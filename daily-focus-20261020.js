/* Adaptive individual review menu. Keeps the original URL and existing data intact.
   Reads current verified paper grades, self-reported answers and curriculum status.
   Does not alter history, settings, cloud data, or the default study mode. */
(function(){
'use strict';
const tasks=[
 {cat:'math',units:['正負の数','指数・累乗','分数・小数','文字式','一次方程式','分数方程式','連立方程式'],title:'朝：数学の基礎 10問',note:'途中式は紙に書いて確認。連立方程式も基礎から復習します。'},
 {cat:'math',units:['連立方程式','1次不等式','図形の性質と合同','証明'],title:'放課後：数量・幾何 10問',note:'学校範囲を優先。合同の証明は別紙で理由まで書いて確認します。'},
 {cat:'english',units:['be動詞','一般動詞','疑問文・否定文','三単現','現在進行形'],title:'放課後：英文法 10問',note:'do/does、動詞の形と語順を確認。読解は紙と速単で学びます。'}
];
function allowedPool(task){
 const statuses=window.TakumiCurriculum;
 return (data[task.cat]||[]).filter(q=>task.units.includes(q.u)&&statuses?.status?.(task.cat,q.u)!=='future');
}
function evidence(){
 const answerEvents=Object.values(window.TakumiTrust?.store?.()?.answers||{});
 const byUnit={};
 let lastSelf=0;
 for(const item of answerEvents){
  if(!item||!item.cat||!item.unit)continue;
  const at=Date.parse(item.at||'')||0;
  const k=item.cat+'|'+item.unit;
  (byUnit[k]||(byUnit[k]=[])).push({help:item.help||'',ok:item.ok===true,at:at});
  if(item.help==='self'&&at>lastSelf)lastSelf=at;
 }
 for(const values of Object.values(byUnit))values.sort((a,b)=>a.at-b.at);
 return {byUnit:byUnit,lastSelf:lastSelf};
}
function unitPriority(cat,u,ev){
 const calc=window.TakumiQuality?.priorityForUnit;
 if(typeof calc==='function'){
  try{
   const n=calc(cat,u,ev);
   if(Number.isFinite(n))return n;
  }catch(_error){}
 }
 const g=window.TakumiTrust?.grade?.(cat,u)||'';
 return g==='weak'?100:g==='maybe'?60:g==='good'?0:35;
}
function plan(task,ev){
 const all=allowedPool(task);
 const names=[...new Set(all.map(q=>q.u))];
 const ranked=names.map(u=>({u:u,score:unitPriority(task.cat,u,ev)}))
  .sort((a,b)=>b.score-a.score||task.units.indexOf(a.u)-task.units.indexOf(b.u));
 const chosen=ranked.slice(0,3).map(x=>x.u);
 let pool=all.filter(q=>chosen.includes(q.u));
 // Retain enough distinct questions to give a complete 10-question session.
 for(let i=3;i<ranked.length;i++){
  const unique=window.TakumiQuality?.uniqueCount?.(task.cat,pool)??pool.length;
  if(unique>=10)break;
  chosen.push(ranked[i].u);
  pool=all.filter(q=>chosen.includes(q.u));
 }
 return {units:chosen,pool:pool,ranked:ranked};
}
function focusPool(task){return plan(task,evidence()).pool}
function runTask(index){
 const task=tasks[index];if(!task)return;
 const p=plan(task,evidence());
 const picked=window.TakumiQuality?.select?.(task.cat,10,p.pool,task.cat==='english'?'mi':'foundation');
 const chosen=Array.isArray(picked)&&picked.length?picked:p.pool.slice(0,10);
 if(!chosen.length){alert('対象問題がありません。授業進度や出題設定を確認してください。');return}
 state.cat=task.cat;state.set=chosen;state.i=0;state.score=0;state.locked=false;
 state.session=++db.sessions;db.quizUpdatedAt=Date.now();save();
 show('quiz');render();
}
const panel=document.createElement('section');
panel.className='ts-focus';
const heading=document.createElement('h3');heading.textContent='個別補習メニュー｜学習結果で更新';
const intro=document.createElement('p');intro.textContent='保護者確認済みの紙評価、自力回答、授業進度から、メニュー内の重点単元を毎回選び直します。4択だけで定着とは判定しません。';
const updated=document.createElement('p');updated.className='ts-focus-updated';
const list=document.createElement('div');list.className='ts-task-list';
const foot=document.createElement('p');foot.className='ts-foot';foot.textContent='学校の宿題と紙教材が優先です。合唱祭などで時間が足りない日は短縮して構いません。表示更新で学習履歴は変更されません。';
panel.append(heading,intro,updated,list,foot);
const rows=[];
for(let i=0;i<tasks.length;i++){
 const task=tasks[i],row=document.createElement('div');row.className='ts-task';
 const label=document.createElement('div');label.className='ts-task-note';
 const button=document.createElement('button');button.className='secondary';button.type='button';button.textContent=task.title;button.onclick=()=>runTask(i);
 row.append(button,label);list.appendChild(row);rows.push(label);
}
function refresh(){
 const ev=evidence();
 const stamp=new Date().toLocaleString('ja-JP',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
 let msg='メニュー再計算：'+stamp+'（この端末の記録を使用）';
 if(ev.lastSelf)msg+=' ／ 最新の自力回答：'+new Date(ev.lastSelf).toLocaleString('ja-JP',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
 updated.textContent=msg;
 for(let i=0;i<tasks.length;i++){
  const p=plan(tasks[i],ev);
  rows[i].textContent='重点：'+(p.units.length?p.units.join('・'):'対象単元なし')+'。'+tasks[i].note;
 }
}
const anchor=document.querySelector('#home .study-panel');
if(anchor)anchor.after(panel);else document.querySelector('#home')?.appendChild(panel);
const css=document.createElement('style');
css.textContent='.ts-focus{background:white;border:1px solid #e1e1df;border-radius:16px;padding:15px;margin:12px 0}.ts-focus h3{font-size:16px;margin:0 0 8px}.ts-focus p,.ts-task-note,.ts-foot{color:#555;font-size:12px;line-height:1.6}.ts-focus-updated{background:#f6f6f3;border-radius:8px;padding:7px 9px}.ts-task{display:grid;grid-template-columns:minmax(0,1fr);gap:4px;margin:9px 0}.ts-task button{text-align:left;font-weight:700}.ts-task-note{padding:0 7px}.ts-foot{margin-bottom:0}';
document.head.appendChild(css);
refresh();
// Recompute when returning home, changing tabs, or coming back to the app.
document.addEventListener('click',function(){if(document.querySelector('#home')?.classList.contains('active'))refresh();});
window.addEventListener('focus',refresh);
document.addEventListener('visibilitychange',function(){if(!document.hidden)refresh();});
window.TakumiDailyFocus={tasks:tasks.map(t=>({cat:t.cat,units:[...t.units],title:t.title})),runTask:runTask,focusPool:focusPool,refresh:refresh,getPlan:function(i){return plan(tasks[i],evidence())}};
})();