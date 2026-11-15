/* MI 2026年度2学期期末: quality-first question routing.
   Existing scores, IDs, local storage and Supabase schema remain unchanged.
   Difficulty is a design estimate, not a psychometric calibration. */
(function(){
'use strict';
const prefix='mi2026-2nd-final';
const cats=['math','english','science','history','geography','japanese'];
const names={math:'数学',english:'英語',science:'理科',history:'歴史',geography:'地理',japanese:'国語'};
const isCurated=q=>q&&q.examQuality===prefix;
const normalized=s=>String(s||'').normalize('NFKC').replace(/[\s　、，。?？!！・「」]/g,'');
let quickCategory=null;
function strength(cat,q){
 const r=db.q?.[q.id]||{};
 const t=window.TakumiTrust?.score?.(q.id)||{};
 const seen=Math.max(Number(r.seen)||0,Number(t.self)||0);
 const wrong=Math.max(Number(r.wrong)||0,Number(t.wrong)||0);
 const grade=window.TakumiTrust?.grade?.(cat,q.u)||'';
 const confidence=r.confidence||'';
 const age=Number(r.last)||0;
 let value=seen?Math.max(-40,20-seen*12):85;
 value+=Math.min(55,wrong*22);
 if(confidence==='again')value+=48;
 if(confidence==='maybe')value+=20;
 if(confidence==='sure'&&seen>=2&&wrong===0)value-=30;
 if(grade==='weak')value+=42;
 else if(grade==='maybe')value+=20;
 else if(grade==='good')value-=12;
 value+=Math.min(40,Number(window.TakumiStudyPolicy?.weight?.(cat,q.u))||0);
 if(age&&Date.now()-age<30*60*1000)value-=90;
 return value+Math.min(5,Math.max(0,Number(q.level)||3));
}
function takeBalanced(cat,n,pool){
 const selected=[],ids=new Set(),stems=new Set(),byUnit=new Map();
 while(selected.length<n){
  const rest=pool.filter(q=>!ids.has(q.id)&&!stems.has(normalized(q.q)));
  if(!rest.length)break;
  rest.sort((a,b)=>{
   const score=x=>strength(cat,x)-(byUnit.get(x.u)||0)*16;
   return score(b)-score(a)||String(a.id).localeCompare(String(b.id));
  });
  const q=rest[0];selected.push(q);ids.add(q.id);
  stems.add(normalized(q.q));byUnit.set(q.u,(byUnit.get(q.u)||0)+1);
 }
 return selected;
}
function blend(cat,n,raw,mode,baseline){
 const count=Math.max(0,Math.floor(Number(n)||0));
 if(!count||!cats.includes(cat)||mode==='foundation')return baseline.slice(0,count);
 const allow=new Set(raw.map(q=>q.id));
 const curated=(data[cat]||[]).filter(q=>allow.has(q.id)&&isCurated(q));
 if(!curated.length)return baseline.slice(0,count);
 // History/geography deliberately avoid the old "obviously wrong" choices.
 // Other subjects retain 2-3 earlier questions per 10 for spaced review.
 const ratio=(cat==='history'||cat==='geography')?1:(mode==='exam'||mode==='challenge'?.8:.7);
 const quota=Math.min(count,curated.length,Math.max(1,Math.ceil(count*ratio)));
 const result=takeBalanced(cat,quota,curated),ids=new Set(result.map(q=>q.id)),
       stems=new Set(result.map(q=>normalized(q.q)));
 for(const q of baseline){
  if(result.length>=count)break;
  if(!allow.has(q.id)||ids.has(q.id)||stems.has(normalized(q.q)))continue;
  result.push(q);ids.add(q.id);stems.add(normalized(q.q));
 }
 if(result.length<count){
  const leftovers=takeBalanced(cat,count,raw.filter(q=>!ids.has(q.id)&&!stems.has(normalized(q.q))));
  for(const q of leftovers){if(result.length>=count)break;result.push(q);}
 }
 return result;
}
const quality=window.TakumiQuality;
if(quality&&typeof quality.select==='function'){
 const prev=quality.select.bind(quality);
 quality.select=function(cat,n,raw,mode){
  const previous=prev(cat,n,raw,mode);
  return blend(cat,n,raw,mode,previous);
 };
}
const previousSelect=selectSet;
selectSet=function(cat,n=10){
 const mode=window.TakumiCurriculum?.mode?.()||'mi';
 const original=previousSelect(cat,n);
 if(mode==='foundation'||mode==='exam'||!cats.includes(cat))return original;
 const available=(data[cat]||[]).filter(q=>window.TakumiCurriculum?.isAllowed?.(cat,q,mode));
 return blend(cat,n,available,mode,original);
};
const previousStart=start;
start=function(cat){quickCategory=null;return previousStart(cat);};
const previousRepeat=repeatQuiz;
repeatQuiz=function(){
 if(quickCategory&&state.cat===quickCategory)return startQuality(quickCategory);
 quickCategory=null;return previousRepeat();
};
function startQuality(cat){
 if(!cats.includes(cat))return;
 const questions=(data[cat]||[]).filter(isCurated);
 if(!questions.length){alert('この教科の期末用問題は読み込まれていません。画面を更新してください。');return;}
 quickCategory=cat;
 state.cat=cat;state.set=takeBalanced(cat,Math.min(10,questions.length),questions);
 state.i=0;state.score=0;state.locked=false;
 state.session=++db.sessions;db.quizUpdatedAt=Date.now();save();
 show('quiz');render();
}
const previousRender=render;
render=function(){
 previousRender();
 const q=state.set?.[state.i];
 if(!isCurated(q))return;
 const el=document.getElementById('takumi-adaptive-hint');
 if(el)el.textContent='期末・厳選4択｜想定難度 L'+q.level+'/5。根拠まで考えてから選択しよう（難度は暫定）。';
};
function buildPanel(){
 const study=document.querySelector('.study-panel');
 if(!study)return;
 const p=document.createElement('section');p.className='ts-final-quality';
 const title=document.createElement('h3');title.textContent='📝 2学期期末｜紛らわしい選択肢で実戦練習';p.appendChild(title);
 const intro=document.createElement('p');
 intro.textContent='学校の発表範囲から6教科80問。歴史・地理は同時代／同地域の誤答を中心に見直しました。通常の基礎練習は残しています。各教科10問、4択で実施。';
 p.appendChild(intro);
 const grid=document.createElement('div');grid.className='ts-final-quality-grid';
 for(const cat of ['geography','history','science','math','english','japanese']){
  const b=document.createElement('button');b.className='secondary';b.type='button';
  const count=(data[cat]||[]).filter(isCurated).length;
  b.textContent=names[cat]+'｜'+count+'問から演習';
  b.onclick=()=>startQuality(cat);grid.appendChild(b);
 }
 p.appendChild(grid);
 const note=document.createElement('p');note.textContent='※ 今回の4択成績だけで記述・証明の実力は判定できません。社会では誤答の理由も説明し、数学は必ず途中式を紙に書いて確認してください。';
 p.appendChild(note);
 study.appendChild(p);
 const css=document.createElement('style');
 css.textContent='.ts-final-quality{border:1px solid #cfd8d1;border-radius:12px;padding:13px;background:#f8faf8;margin-top:12px}.ts-final-quality h3{font-size:15px;margin:0 0 7px}.ts-final-quality p{font-size:12px;line-height:1.7;color:#34443c;margin:6px 0}.ts-final-quality-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.ts-final-quality-grid button{font-size:13px;line-height:1.4;min-height:46px;padding:8px}@media(max-width:350px){.ts-final-quality-grid{grid-template-columns:1fr}}';
 document.head.appendChild(css);
}
function audit(){
 const errors=[],totals={};
 for(const cat of cats){
  const set=(data[cat]||[]).filter(isCurated);totals[cat]=set.length;
  const seen=new Set();
  for(const q of set){
   const key=normalized(q.q);
   if(seen.has(key)||q.c.length!==4||new Set(q.c).size!==4||q.a!==0||![3,4,5].includes(q.level))errors.push(cat+':'+q.id);
   seen.add(key);
  }
 }
 return {version:'2026-11-15',totals,errors};
}
window.TakumiExamQuality20261115={start:startQuality,blend,audit,version:'2026-11-15'};
window.TakumiQuality?.refresh?.();
window.TakumiCurriculum?.refresh?.();
buildPanel();
})();