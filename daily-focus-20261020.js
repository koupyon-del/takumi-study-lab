/* 2026-10-20: short, verified-history-preserving focused app practice.
   Does not change saved curriculum, answer history or default study mode. */
(function(){
'use strict';
const tasks=[
 {cat:'math',units:['正負の数','指数・累乗','分数・小数','分数方程式','連立方程式'],title:'朝：数学の基礎 10問',note:'負数・指数・分数・方程式を優先。途中式は紙に書く。'},
 {cat:'math',units:['1次不等式','図形の性質と合同','証明'],title:'放課後：数量・幾何 10問',note:'MIの授業に接続。証明文は紙で自力再現。'},
 {cat:'english',units:['一般動詞','疑問文・否定文','三単現','現在進行形'],title:'放課後：英文法 10問',note:'do/does、動詞の形と語順を確認。速単は本で読む。'}
];
function focusPool(task){
 const statuses=window.TakumiCurriculum;
 return (data[task.cat]||[]).filter(q=>task.units.includes(q.u)&&statuses?.status?.(task.cat,q.u)!=='future');
}
function runTask(index){
 const task=tasks[index];if(!task)return;
 const pool=focusPool(task);
 const chosen=window.TakumiQuality?.select?.(task.cat,10,pool,task.cat==='english'?'mi':'foundation')||pool.slice(0,10);
 if(!chosen.length){alert('対象問題がありません。授業進度や出題設定を確認してください。');return}
 state.cat=task.cat;state.set=chosen;state.i=0;state.score=0;state.locked=false;
 state.session=++db.sessions;db.quizUpdatedAt=Date.now();save();
 show('quiz');render();
}
const panel=document.createElement('section');panel.className='ts-focus';
panel.innerHTML='<h3>10/20（火） 個別補修メニュー</h3>'+
'<p>今週は「正しい解き方を知る → 紙に書いて解く → アプリで確認」を徹底します。10月19日の自力結果を踏まえた出題範囲です。4択の正解だけで定着とは判定しません。</p>'+
'<div class="ts-task-list"></div><p class="ts-foot">学校の宿題と紙教材が優先です。行事で時間が足りない日は、朝の数学だけでも構いません。進度・履歴・採点結果は変更しません。</p>';
for(let i=0;i<tasks.length;i++){
 const t=tasks[i],row=document.createElement('div');row.className='ts-task';
 const label=document.createElement('div');label.className='ts-task-note';label.textContent=t.note;
 const button=document.createElement('button');button.className='secondary';button.type='button';button.textContent=t.title;button.onclick=()=>runTask(i);
 row.append(button,label);panel.querySelector('.ts-task-list').appendChild(row);
}
const anchor=document.querySelector('#home .study-panel');
if(anchor)anchor.after(panel);
const css=document.createElement('style');
css.textContent='.ts-focus{background:white;border:1px solid #e1e1df;border-radius:16px;padding:15px;margin:12px 0}.ts-focus h3{font-size:16px;margin:0 0 8px}.ts-focus p,.ts-task-note,.ts-foot{color:#555;font-size:12px;line-height:1.6}.ts-task{display:grid;grid-template-columns:minmax(0,1fr);gap:4px;margin:9px 0}.ts-task button{text-align:left;font-weight:700}.ts-foot{margin-bottom:0}.ts-task-note{padding:0 7px}';
document.head.appendChild(css);
window.TakumiDailyFocus={tasks:tasks.map(t=>({cat:t.cat,units:[...t.units],title:t.title})),runTask,focusPool};
})();