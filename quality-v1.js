/* 巧澄 Study Lab v1.5: verified-evidence adaptive selector, duplicates suppressed at selection only.
   Never changes existing IDs, historic q counters, trust journals, curriculum settings or cloud schema. */
(function(){
'use strict';
const normalized=s=>String(s||'').normalize('NFKC').replace(/^【[^】]+】\s*/,'').replace(/[\s　]+/g,'').replace(/[?？!！、，。．・：:「」『』（）()]/g,'').toLowerCase();
const now=()=>Date.now();
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
   else if(g.answer===answer)g.ids.push(q);
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
 result+='\n【v1.5 出題品質と優先順位】\n登録 '+a.total+'問／重複を除く独立問題文 '+a.distinct+'件／重複抑制 '+a.duplicates+'件／矛盾回答候補 '+a.conflicts+'件\n';
 for(const [cat,units] of Object.entries(a.units)){
  const focus=Object.entries(units).map(([u,count])=>({u,count,need:unitNeed(cat,u,ev)})).sort((x,y)=>y.need-x.need).slice(0,4);
  result+=(labels[cat]||cat)+'：重点 '+focus.map(x=>x.u+'('+Math.round(x.need)+')').join('、')+'\n';
 }
 return result;
};
window.TakumiQuality={select,uniqueCount,audit,refresh:rebuild,priorityForUnit:unitNeed};
})();