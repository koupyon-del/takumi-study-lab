/* Study Lab v1.9: small-step adaptive practice.
 * Ordinary MI/foundation sessions only. Weekly diagnostic & exam keep their own selectors.
 * Reads trusted self-reports and parent-paper grades; NEVER modifies history or IDs.
 * Difficulty labels are estimated until paper evidence/calibration confirms them. */
(function(){
'use strict';
const prevSelect=selectSet;
const normalize=s=>String(s||'').normalize('NFKC').replace(/^【[^】]+】/,'').replace(/[\s　「」『』（）()、，。?？]/g,'').toLowerCase();
const rawLevel=q=>{
 const s=String(q.q||''),u=String(q.u||''),star=Number(q.star)||2;
 if(q.level>=1&&q.level<=5)return q.level;
 if(q.id&&/^M\d{3}$/.test(q.id))return 1; // original short concept checks
 if(u==='連立方程式'){
  if(/考え方|どんなとき|最初に|必ず確認|正しいものは|基本/.test(s)&&!/[\d]+[xy].*[=＝]/.test(s))return 1;
  if(/文章題|速さ|代金|個数|合計|人数|濃度|割合/.test(s))return 5;
  if(/分数|小数|通分|分母|\/|÷/.test(s))return 4;
  if(/代入|加減|係数|符号|負|括弧|かっこ/.test(s))return 3;
  if(/[\dxxy].*[=＝].*[xy]/.test(s))return 3;
  return Math.max(1,Math.min(4,star));
 }
 if(/文章題|複合|発展|証明せよ|理由を説明|初見/.test(s))return 5;
 if(/分数|小数|速さ|割合|応用|比較して|根拠/.test(s))return 4;
 if(/判断|並べ替え|文脈|書き換え|計算|代入/.test(s))return 3;
 if(/基本|確認|単語|意味|何という|どれ/.test(s))return Math.min(2,star);
 return Math.max(1,Math.min(4,star));
};
const values=()=>{
 const t=window.TakumiTrust?.store?.()||{};
 return Object.values(t.answers||{}).filter(e=>e&&e.complete!==false&&e.help==='self'&&e.cat&&e.unit);
};
function unitEvidence(cat){
 const groups=new Map();
 for(const e of values()){
  if(e.cat!==cat)continue;
  const a=groups.get(e.unit)||[];
  a.push(e);groups.set(e.unit,a);
 }
 const result=new Map();
 for(const [u,events] of groups){
  events.sort((a,b)=>String(a.at||'').localeCompare(String(b.at||'')));
  const recent=events.slice(-12),good=recent.filter(x=>x.ok===true).length;
  result.set(u,{count:recent.length,rate:recent.length?good/recent.length:null,good});
 }
 return result;
}
function targetLevel(cat,u,ev){
 const s=ev.get(u),g=window.TakumiTrust?.grade?.(cat,u);
 let level=2;
 if(s&&s.count>=5){
  level=s.rate<0.45?1:s.rate<0.60?2:s.rate<0.75?3:s.rate<0.88?4:4;
  if(s.rate>=0.90&&s.count>=8&&g==='good')level=5;
 }
 if(g==='weak')level=Math.min(level,2);
 if(g==='maybe')level=Math.min(level,3);
 return level;
}
function unitNeed(cat,u,ev){
 const s=ev.get(u),grade=window.TakumiTrust?.grade?.(cat,u);
 let need=grade==='weak'?60:grade==='maybe'?35:grade==='good'?-10:5;
 if(s?.count>=5)need+=Math.round((1-s.rate)*70);
 else if(s?.count>0)need+=15;
 return need;
}
function lastAttempt(id){
 const t=window.TakumiTrust?.score?.(id);
 return {seen:t?.self||0,good:t?.good||0,wrong:t?.wrong||0};
}
function stableSort(a,b,target){
 const la=rawLevel(a),lb=rawLevel(b),da=Math.abs(la-target),db=Math.abs(lb-target);
 const aa=lastAttempt(a.id),bb=lastAttempt(b.id);
 // Favor unseen independent problems within the desired level; avoid overdrilling exact same item.
 return da-db || aa.seen-bb.seen || bb.wrong-aa.wrong || String(a.id).localeCompare(String(b.id));
}
function pick(cat,n,pool,mode){
 const ev=unitEvidence(cat);
 const unique=window.TakumiQuality?.select?.(cat,Math.max(pool.length,1),pool,mode)||pool;
 if(!unique.length)return [];
 const units=[...new Set(unique.map(x=>x.u))].sort((a,b)=>unitNeed(cat,b,ev)-unitNeed(cat,a,ev));
 // A weak unit receives up to 70% of the session; do not force concentration without adequate evidence.
 const focus=units.find(u=>{const s=ev.get(u);return window.TakumiTrust?.grade?.(cat,u)==='weak'||(s&&s.count>=5&&s.rate<.60)})||null;
 const target=focus?Math.min(n,Math.max(4,Math.round(n*.7))):Math.max(0,Math.ceil(n*.4));
 const chosen=[],used=new Set(),levelCount={review:0,core:0,stretch:0};
 function add(q,bucket){
  if(!q||used.has(q.id)||chosen.length>=n)return false;
  chosen.push(q);used.add(q.id);levelCount[bucket]++;return true;
 }
 const categories=['review','core','stretch'];
 const quotas={review:Math.round(n*.2),core:Math.round(n*.6),stretch:n-Math.round(n*.2)-Math.round(n*.6)};
 const selectedUnitCount=()=>chosen.filter(q=>q.u===focus).length;
 for(const bucket of categories){
  const limit=quotas[bucket];
  for(let k=0;k<limit&&chosen.length<n;k++){
   let candidates=unique.filter(q=>!used.has(q.id));
   // Focus on weak unit in at least 7/10 while allowing transfer to the remaining subjects.
   if(focus&&selectedUnitCount()<target){
    const focused=candidates.filter(q=>q.u===focus);
    if(focused.length)candidates=focused;
   }
   if(!focus&&units.length>1){
    candidates.sort((a,b)=>unitNeed(cat,b.u,ev)-unitNeed(cat,a.u,ev));
   }
   candidates.sort((a,b)=>{
    const ta=targetLevel(cat,a.u,ev)+(bucket==='review'?-1:bucket==='stretch'?1:0);
    const tb=targetLevel(cat,b.u,ev)+(bucket==='review'?-1:bucket==='stretch'?1:0);
    const da=Math.abs(rawLevel(a)-Math.max(1,Math.min(5,ta)));
    const db=Math.abs(rawLevel(b)-Math.max(1,Math.min(5,tb)));
    return da-db||lastAttempt(a.id).seen-lastAttempt(b.id).seen||
           unitNeed(cat,b.u,ev)-unitNeed(cat,a.u,ev)||String(a.id).localeCompare(String(b.id));
   });
   if(!add(candidates[0],bucket))break;
  }
 }
 // If candidate coverage is too small, retain historical selector as a safe fallback.
 if(chosen.length<n)for(const q of prevSelect(cat,n)){if(chosen.length>=n)break;add(q,'core')}
 const levels=chosen.map(q=>rawLevel(q));
 const info={cat,focus,targets:Object.fromEntries(units.map(u=>[u,targetLevel(cat,u,ev)])),
   levels,quotas:levelCount,questions:chosen.map(q=>q.id)};
 window.TakumiAdaptive.lastPlan=info;
 return chosen;
}
selectSet=function(cat,n=10){
 const mode=window.TakumiCurriculum?.cfg?.()?.mode||'mi';
 if(mode==='exam'||mode==='challenge'||!['math','english','japanese','science','history','geography'].includes(cat))
  return prevSelect(cat,n);
 try{
  const pool=(data[cat]||[]).filter(q=>isAllowed(cat,q,mode));
  if(!pool.length)return prevSelect(cat,n);
  return pick(cat,n,pool,mode);
 }catch(err){console.error('適応出題の安全切替:',err);return prevSelect(cat,n)}
};
const oldRender=render;
render=function(){
 oldRender();
 const root=document.getElementById('quiz'),q=state.set?.[state.i];if(!root||!q)return;
 let info=document.getElementById('takumi-adaptive-hint');
 if(!info){info=document.createElement('p');info.id='takumi-adaptive-hint';info.className='legend';
  const question=root.querySelector('.question');if(question)question.before(info);else root.prepend(info)}
 const plan=window.TakumiAdaptive.lastPlan;
 info.textContent=plan&&plan.cat===state.cat
  ?'練習難度 L'+rawLevel(q)+'／5（暫定）'+(plan.focus?'｜重点：'+plan.focus:'')+'。難しければ解説を読み、紙に途中式を書こう。'
  :'';
};
window.TakumiAdaptive={level:rawLevel,targetLevel,unitEvidence,lastPlan:null,version:'1.9.0'};
})();
