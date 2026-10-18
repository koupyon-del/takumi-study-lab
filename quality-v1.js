/* 巧澄 Study Lab v1.5: verified-evidence adaptive selector, duplicates suppressed at selection only.
   Never changes existing IDs, historic q counters, trust journals, curriculum settings or cloud schema. */
(function(){
'use strict';
const normalized=s=>String(s||'').normalize('NFKC').replace(/^【[^】]+】\s*/,'').replace(/[\s　]+/g,'').replace(/[?？!！、，。．・：:「」『』（）()]/g,'').toLowerCase();
const now=()=>Date.now();
function equivalentAnswer(a,b){
 const x=normalized(a).replace(/大陸$/,''),y=normalized(b).replace(/大陸$/,'');
 if(x===y)return true;
 if(x.includes('城郭')&&x.includes('障壁画')&&y.includes('城郭')&&y.includes('障壁画'))return true;
 return false;
}

let indexByCat={};
function rebuild(){
 const map={};
 for(const [cat,questions] of Object.entries(data)){
  const groups=new Map(),conflicts=[];
  for(const q of questions){
   const key=q.u+'|'+normalized(q.q);
   const answer=normalized(q.c[q.a]);
   const g=groups.get(key);
   if(!g)groups.set(key,{ids:[q],answer,unit:q.u});
   else if(equivalentAnswer(g.answer,answer))g.ids.push(q);
   else conflicts.push({cat,unit:q.u,question:q.q,ids:[...g.ids.map(v=>v.id),q.id],reason:'same question, incompatible answer'});
  }
  map[cat]={groups:[...groups.values()],conflicts};
 }
 indexByCat=map;
}
rebuild();
const trust=()=>window.TakumiTrust;
function evidence(){
 const t=trust()?.store?.()||{};
 const entries=Object.values(t.answers||{});
 const byId={},byUnit={};
 for(const ev of entries){
  if(!ev||!ev.questionId||!ev.cat)continue;
  const item={ok:ev.ok===true,help:ev.help||'',at:Date.parse(ev.at)||0,confidence:ev.confidence||''};
  (byId[ev.questionId]||(byId[ev.questionId]=[])).push(item);
  const key=ev.cat+'|'+ev.unit;
  (byUnit[key]||(byUnit[key]=[])).push(item);
 }
 for(const a of [...Object.values(byId),...Object.values(byUnit)])a.sort((x,y)=>x.at-y.at);
 return {byId,byUnit};
}
function grade(cat,u){return trust()?.grade?.(cat,u)||''}
function key(q){return q.u+'|'+normalized(q.q)}
function representative(group,ev){
 return [...group.ids].sort((a,b)=>{
  const aa=ev.byId[a.id]||[],bb=ev.byId[b.id]||[];
  const aLast=aa.length?aa[aa.length-1].at:0,bLast=bb.length?bb[bb.length-1].at:0;
  const aSelf=aa.filter(x=>x.help==='self').length,bSelf=bb.filter(x=>x.help==='self').length;
  return bSelf-aSelf||bLast-aLast||a.id.localeCompare(b.id);
 })[0];
}
function stateOf(q,group,ev){
 const events=group.ids.flatMap(x=>ev.byId[x.id]||[]).sort((a,b)=>a.at-b.at);
 const self=events.filter(e=>e.help==='self');
 const recentSelf=self.slice(-6);
 const last=events[events.length-1];
 const lastSelf=self[self.length-1];
 const good=recentSelf.filter(x=>x.ok).length;
 const failures=recentSelf.length-good;
 const lastAt=last?.at||0;
 const gap=(now()-lastAt)/86400000;
 let due=1;
 if(last){
  if(last.help==='self'&&last.ok){
   const streak=[...self].reverse().findIndex(x=>!x.ok);
   const consecutive=streak===-1?self.length:streak;
   const interval=consecutive>=3?7:consecutive===2?3:1;
   due=Math.min(2,gap/interval);
  }else due=Math.min(2,gap);
 }
 return {events,self,last,lastSelf,good,failures,gap,due};
}
function unitNeed(cat,u,ev){
 const g=grade(cat,u);
 const all=(ev.byUnit[cat+'|'+u]||[]).filter(x=>x.help==='self').slice(-10);
 const misses=all.filter(x=>!x.ok).length;
 let score=g==='weak'?70:g==='maybe'?42:g==='good'?-12:23;
 if(all.length)score+=40*(misses/all.length);
 else if(g!=='good')score+=14;
 if(all.length>=5&&misses===0)score-=12;
 return score;
}
function score(q,group,ev,mode){
 const x=stateOf(q,group,ev),unit=unitNeed((group.cat||''),q.u,ev);
 const g=grade(group.cat,q.u);
 let p=unit+q.star*4;
 if(!x.last)p+=35;
 else if(x.last.help!=='self')p+=48;
 else if(x.last.ok===false)p+=70;
 else p+=x.due>=1?30:-(65*(1-x.due));
 p+=x.failures*7;
 if(x.last?.confidence==='again')p+=19;
 if(x.last?.confidence==='maybe')p+=9;
 if(x.last&&x.gap<0.02)p-=100; // don't immediately repeat within half an hour
 if(g==='good'&&x.self.length>=2&&x.failures===0)p-=26;
 if(mode==='foundation'){p+=q.star===1?22:q.star===2?12:-18}
 if(mode==='challenge'){p+=q.star>=3?26:-14}
 if(mode==='exam')p+=q.star>=2?7:0;
 if(mode==='mi'&&window.TakumiCurriculum?.status?.(group.cat,q.u)==='now')p+=18;
 if(mode==='challenge'&&window.TakumiCurriculum?.status?.(group.cat,q.u)==='now')p+=12;
 return p+Math.random()*7;
}
function select(cat,n,raw,mode){
 const ev=evidence();
 const allow=new Set(raw.map(q=>q.id));
 const groups=(indexByCat[cat]?.groups||[]).filter(g=>g.ids.some(q=>allow.has(q.id)));
 const conflicted=new Set((indexByCat[cat]?.conflicts||[]).flatMap(x=>x.ids));
 const ranked=[];
 for(const g of groups){
  const valid=g.ids.filter(q=>allow.has(q.id)&&!conflicted.has(q.id));
  if(!valid.length)continue;
  const sub={...g,ids:valid,cat};
  const q=representative(sub,ev);
  ranked.push({q,score:score(q,sub,ev,mode),unitWeight:unitNeed(cat,q.u,ev)});
 }
 ranked.sort((a,b)=>b.score-a.score);
 const chosen=[],units=new Map(),target=Math.min(Math.max(1,n),ranked.length);
 const distinctUnits=new Set(ranked.map(a=>a.q.u)).size;
 const limit=distinctUnits===1?target:Math.max(2,Math.ceil(target*0.4));
 function fill(cap){
  for(const x of ranked){
   if(chosen.length>=target)break;
   if(chosen.includes(x.q))continue;
   if((units.get(x.q.u)||0)>=cap)continue;
   chosen.push(x.q);
   units.set(x.q.u,(units.get(x.q.u)||0)+1);
  }
 }
 fill(limit);if(chosen.length<target)fill(target);
 return chosen;
}
function uniqueCount(cat,raw){
 const allow=new Set(raw.map(x=>x.id));
 return (indexByCat[cat]?.groups||[]).filter(g=>g.ids.some(x=>allow.has(x.id))).length;
}
function audit(){
 const info={total:0,distinct:0,duplicates:0,conflicts:0,units:{}};
 for(const [cat,ix] of Object.entries(indexByCat)){
  let total=(data[cat]||[]).length,unique=ix.groups.length;
  info.total+=total;info.distinct+=unique;info.conflicts+=ix.conflicts.length;
  const counts={};for(const g of ix.groups)counts[g.unit]=(counts[g.unit]||0)+1;
  info.units[cat]=counts;
 }
 info.duplicates=info.total-info.distinct;
 return info;
}
const oldReport=buildReport;
buildReport=function(){
 const a=audit(),ev=evidence();
 let result=oldReport();
 result+='\n【v1.6 出題品質と優先順位】\n登録 '+a.total+'問／重複を除く独立問題文 '+a.distinct+'件／重複抑制 '+a.duplicates+'件／矛盾回答候補 '+a.conflicts+'件\n';
 result+='※ 実際の授業進度は学校の資料・本人の確認が必要。進度確認が未完了の単元は初期推定です。\n';
 for(const [cat,units] of Object.entries(a.units)){
  const focus=Object.entries(units).map(([u,count])=>({u,count,need:unitNeed(cat,u,ev)})).sort((x,y)=>y.need-x.need).slice(0,4);
  const progress=window.TakumiCurriculum?.confirmedCount?.(cat);
  const verified=progress===undefined?'確認状況未取得':'進度確認'+progress+'/'+Object.keys(units).length;
  result+=(labels[cat]||cat)+'：'+verified+'／重点 '+focus.map(x=>x.u+'('+Math.round(x.need)+')').join('、')+'\n';
 }
 return result;
};
window.TakumiQuality={select,uniqueCount,audit,refresh:rebuild,priorityForUnit:unitNeed};
window.TakumiCurriculum?.refresh?.();
/* Visible audit: read-only diagnostics; does not mutate historic progress. */
const panel=document.querySelector('.study-panel');
if(panel&&document.querySelector('.wrap')){
 const trigger=document.createElement('button');
 trigger.className='secondary';trigger.textContent='📊 出題品質・苦手単元の優先度';
 trigger.style.width='100%';trigger.style.marginTop='9px';
 trigger.onclick=()=>openQualityAudit('math');
 panel.appendChild(trigger);
 const shell=document.createElement('section');shell.className='screen';shell.id='qualityAudit';
 shell.innerHTML='<button class="back" onclick="show(\'home\')">← ホーム</button><h2>📊 出題品質・優先度</h2><div id="quality-audit-main"></div>';
 document.querySelector('.wrap').appendChild(shell);
 const style=document.createElement('style');
 style.textContent='.qa-card{background:white;padding:13px;margin:12px 0;border-radius:12px}.qa-tabs{display:flex;flex-wrap:wrap;gap:6px}.qa-tabs button{padding:8px 12px;border:1px solid #ddd;border-radius:8px;background:white;font-size:12px}.qa-tabs button.on{background:#171717;color:white}.qa-line{display:flex;gap:10px;justify-content:space-between;border-bottom:1px solid #eee;padding:9px 0;font-size:13px;align-items:center}.qa-line span:last-child{text-align:right}.qa-muted{font-size:12px;color:#666;line-height:1.6}';
 document.head.appendChild(style);
}
function openQualityAudit(cat='math'){
 const root=document.getElementById('quality-audit-main');if(!root)return;
 root.replaceChildren();
 const all=audit(),ev=evidence();
 const summary=document.createElement('div');summary.className='qa-card';
 const h=document.createElement('b');h.textContent='登録 '+all.total+'問 ／ 独立した出題候補 '+all.distinct+'問';summary.appendChild(h);
 const notes=document.createElement('p');notes.className='qa-muted';notes.textContent='同一問題文 '+all.duplicates+'問は出題時に重複を抑制。過去の記録は削除していません。正答表記の矛盾検出 '+all.conflicts+'件。';summary.appendChild(notes);root.appendChild(summary);
 const tabs=document.createElement('div');tabs.className='qa-tabs';
 for(const subject of ['math','english','japanese','science','history','geography','waka']){
  const b=document.createElement('button');b.textContent=labels[subject]||subject;
  b.className=cat===subject?'on':'';
  b.onclick=()=>openQualityAudit(subject);tabs.appendChild(b);
 }
 root.appendChild(tabs);
 const desc=document.createElement('p');desc.className='qa-muted';
 desc.textContent='出題優先度は、保護者確認済み紙課題の評価・新しい自力誤答・復習間隔から決まります。過去の不確かなアプリ正答率は含めません。数字は順位付け用であり、学力の点数ではありません。';
 root.appendChild(desc);
 const card=document.createElement('div');card.className='qa-card';
 const units=Object.entries(all.units[cat]||{}).map(([u,count])=>({u,count,grade:grade(cat,u),need:unitNeed(cat,u,ev)})).sort((a,b)=>b.need-a.need);
 for(const x of units){
  const row=document.createElement('div');row.className='qa-line';
  const l=document.createElement('span');l.textContent=x.u+'（独立 '+x.count+'問）';
  const r=document.createElement('span');
  const mark={good:'○',maybe:'△',weak:'×'}[x.grade]||'未評価';
  r.textContent='紙'+mark+' ／ 優先 '+Math.round(x.need);row.append(l,r);card.appendChild(row);
 }
 root.appendChild(card);show('qualityAudit');
}
window.openQualityAudit=openQualityAudit;

})();