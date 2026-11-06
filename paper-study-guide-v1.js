/* 巧澄 Study Lab v3.12.4 — paper-to-app navigator.
   UI-only bridge: never changes curriculum settings, historic answers, trust grades, or cloud state.
   Every route is checked against current runtime lesson IDs and canonical question-unit names. */
(function(){
'use strict';
const home=document.getElementById('home'),wrap=document.querySelector('.wrap');
if(!home||!wrap||document.getElementById('ts-paper-study-entry'))return;
const mk=(tag,label,cls)=>{const e=document.createElement(tag);if(label!==undefined&&label!==null)e.textContent=label;if(cls)e.className=cls;return e};
const screen=mk('section',null,'screen ts-paper-study-screen');screen.id='ts-paper-study-screen';wrap.appendChild(screen);
const tasks=[
 {type:'lesson',printed:'数学・板書授業「代入法：式を丸ごと入れる」',id:'sub',expected:'代入法：式を丸ごと入れる',description:'連立方程式：代入法の講座を直接開く'},
 {type:'lesson',printed:'数学・板書授業「符号と括弧：分配法則」',id:'sign',expected:'符号と括弧：分配法則',description:'連立方程式：マイナスの分配の講座を直接開く'},
 {type:'deck',printed:'英語・リクエストデッキ「三単現」5問',cat:'english',unit:'三単現',count:5,description:'英語の「三単現」で5問の設定を開く'},
 {type:'deck',printed:'理科・リクエストデッキ「気象・湿度」5問',cat:'science',unit:'気象・湿度',count:5,description:'理科の「気象・湿度」で5問の設定を開く'}
];
const catNames={math:'数学',english:'英語',japanese:'国語',science:'理科',history:'歴史',geography:'地理',waka:'百人一首'};
const lessonApi=()=>window.TakumiVideoLessons;
const deckApi=()=>window.TakumiRequestDeck;
function knownLesson(id,expected){
 const api=lessonApi();return Boolean(api?.openLesson&&api?.lessonList?.some(l=>l.id===id&&(!expected||l.title===expected)));
}
function knownUnit(cat,u){return Boolean((data[cat]||[]).some(q=>q.u===u))}
function availableUnit(cat,u){
 const d=deckApi();
 return Boolean(d?.subjectPool&&d.subjectPool(cat).some(q=>q.u===u));
}
function validate(task){
 if(task.type==='lesson')return knownLesson(task.id,task.expected)?'ok':'missing-lesson';
 if(!knownUnit(task.cat,task.unit))return 'missing-unit';
 return availableUnit(task.cat,task.unit)?'ok':'unavailable';
}
function dispatch(task){
 const state=validate(task);
 if(state==='missing-lesson'){alert('指定の板書授業が読み込めませんでした。アプリを更新してください。');return}
 if(state==='missing-unit'){alert('指定の単元は現在の問題集に登録されていません。教材との名称不一致として報告してください。');return}
 if(state==='unavailable'){
  alert('「'+task.unit+'」は存在しますが、現在の授業進度・「確認済み単元のみ出題」設定によりリクエストデッキの選択対象外です。📅 MI進度・単元設定で、実際の授業進度に合う状態か確認してください。');
  return;
 }
 if(task.type==='lesson'){
  lessonApi().openLesson(task.id,screen.id);
  return;
 }
 const d=deckApi();if(!d){alert('リクエストデッキが読み込めませんでした。');return}
 d.form.cat=task.cat;d.form.unit=task.unit;d.form.skill=task.skill||'all';d.form.level='auto';d.form.selection='balanced';d.form.count=task.count||5;
 d.open(); // opens the real selector, with the paper's canonical unit preselected
}
function buttonFor(task){
 const b=mk('button',task.type==='lesson'?'▶ この板書授業を開く':'🎯 この単元で'+(task.count||5)+'問を設定','ts-paper-study-action');
 b.type='button';
 const status=validate(task);
 if(status!=='ok'){
  b.classList.add('ts-paper-study-unavailable');
  b.textContent=status==='unavailable'?'単元は登録済み・進度設定を確認':'講座・単元の読み込みを確認';
 }
 b.onclick=()=>dispatch(task);
 return b;
}
function addTask(root,task){
 const card=mk('div',null,'ts-paper-study-card');
 card.appendChild(mk('strong',task.printed));
 card.appendChild(mk('p',task.description));
 card.appendChild(buttonFor(task));
 root.appendChild(card);
}
const clean=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[\s　・:：／\/　「」『』【】（）()]/g,'');
function matches(a,b){const x=clean(a),y=clean(b);return Boolean(x&&y&&(x.includes(y)||y.includes(x)))}
const aliases={
 '代入法':'代入法：式を丸ごと入れる','式を丸ごと入れる':'代入法：式を丸ごと入れる',
 '分配法則':'符号と括弧：分配法則','符号と括弧':'符号と括弧：分配法則','負号':'符号と括弧：分配法則',
 'does':'三単現','does＋動詞原形':'三単現','三人称単数':'三単現',
 '湿度':'気象・湿度','水蒸気と湿度':'気象・湿度',
 '加減法':'加減法①：文字を消す','合同証明':'証明','連立方程式代入':'連立方程式',
 '鎌倉の御恩と奉公':'鎌倉幕府'
};
function liveCatalog(){
 const found=[],seen=new Set();
 for(const l of lessonApi()?.lessonList||[]){
  const task={type:'lesson',printed:'板書授業：'+l.title,expected:l.title,id:l.id,description:'講座 '+(l.group||'')};
  if(!seen.has('lesson:'+l.id)){found.push(task);seen.add('lesson:'+l.id)}
 }
 for(const [cat,qs] of Object.entries(data)){
  for(const u of [...new Set(qs.map(q=>q.u))]){
   const id=cat+'|'+u;if(seen.has(id))continue;
   seen.add(id);
   found.push({type:'deck',printed:catNames[cat]+'：'+u,cat,unit:u,count:5,description:'アプリ上の正式単元名：'+u});
  }
 }
 return found;
}
function results(query,root){
 root.replaceChildren();
 if(!String(query||'').trim()){
  root.appendChild(mk('p','上に入力すると、登録済みの講座・単元を検索します。','ts-paper-study-note'));return;
 }
 const candidates=[query,...Object.entries(aliases).filter(([alias])=>matches(alias,query)||matches(query,alias)).map(([,target])=>target)];
 const matchesList=liveCatalog().filter(t=>candidates.some(q=>matches(t.printed,q)||matches(t.expected||'',q)||matches(t.unit||'',q)));
 if(!matchesList.length){
  root.appendChild(mk('p','該当する講座・単元名は見つかりません。紙に書かれた指示をそのまま保護者へ伝えてください。','ts-paper-study-warning'));
  return;
 }
 root.appendChild(mk('p','一致する講座・単元 '+matchesList.length+'件（先頭15件を表示）','ts-paper-study-note'));
 for(const task of matchesList.slice(0,15))addTask(root,task);
}
function open(){
 screen.replaceChildren();
 const back=mk('button','← ホーム','back');back.type='button';back.onclick=()=>show('home');screen.appendChild(back);
 screen.appendChild(mk('h2','📄 紙課題からアプリを開く'));
 screen.appendChild(mk('p','紙課題に書かれた「板書授業の講座名」と「4択問題の単元名」は別です。この画面からそれぞれの正しい場所へ進めます。','ts-paper-study-note'));
 screen.appendChild(mk('h3','2026年11月7日の紙課題｜指定された4つの操作'));
 const box=mk('div',null,'ts-paper-study-tasks');
 for(const task of tasks)addTask(box,task);
 screen.appendChild(box);
 screen.appendChild(mk('h3','ほかの日の紙課題・単元名を探す'));
 const input=mk('input',null,'ts-paper-study-search');input.type='search';input.placeholder='例：代入法／Does＋動詞原形／湿度／証明';
 input.setAttribute('aria-label','紙課題に記載された講座・単元名を検索');
 const matchesDiv=mk('div',null,'ts-paper-study-results');input.oninput=()=>results(input.value,matchesDiv);
 screen.append(input,matchesDiv);
 results('',matchesDiv);
 const how=mk('details',null,'ts-paper-study-manifest');
 how.appendChild(mk('summary','アプリの正式な単元名一覧を確認する'));
 const body=mk('div',null,'ts-paper-study-manifest-content');
 for(const [cat,qs] of Object.entries(data))body.appendChild(mk('p',(catNames[cat]||cat)+'：'+[...new Set(qs.map(q=>q.u))].join('／')));
 how.appendChild(body);screen.appendChild(how);
 screen.appendChild(mk('p','※ 板書授業は学習記録の正答率に加算されません。リクエストデッキは実際に解くと通常の自力・ヒント・答えを見た記録に反映されます。','ts-paper-study-note'));
 show(screen.id);
}
const entry=mk('section',null,'ts-paper-study-entry');entry.id='ts-paper-study-entry';
entry.appendChild(mk('strong','📄 紙課題とアプリの連携'));
entry.appendChild(mk('p','11/7の課題で指定した板書2講座・英語5問・理科5問へ、名前を探さず進めます。'));
const action=mk('button','今日の紙課題の指示を開く','ts-paper-study-home-button');action.type='button';action.onclick=open;
entry.appendChild(action);
(home.querySelector('.top')||home.firstElementChild)?.after(entry);
const css=mk('style');
css.textContent='.ts-paper-study-entry{background:#eef4fb;border:1px solid #b9d0e4;padding:14px;margin:12px 0;border-radius:15px}.ts-paper-study-entry strong{font-size:16px}.ts-paper-study-entry p,.ts-paper-study-note{color:#405569;font-size:13px;line-height:1.6}.ts-paper-study-home-button,.ts-paper-study-action{width:100%;border:none;border-radius:10px;padding:11px 14px;margin-top:7px;background:#215a81;color:#fff;font-weight:700}.ts-paper-study-card{background:#fff;border:1px solid #e1e6ec;border-radius:12px;padding:13px;margin:9px 0}.ts-paper-study-card strong{font-size:14px;line-height:1.6}.ts-paper-study-card p{font-size:12px;color:#5a6570;margin:6px 0}.ts-paper-study-unavailable{background:#687681}.ts-paper-study-screen h3{font-size:16px;margin-top:20px}.ts-paper-study-search{display:block;width:100%;padding:12px;border:1px solid #c7d1d8;border-radius:10px;font-size:15px}.ts-paper-study-warning{color:#9e3d2e;font-size:13px}.ts-paper-study-manifest{background:#fff;border-radius:12px;margin-top:16px;padding:12px}.ts-paper-study-manifest-content{font-size:12px;line-height:1.7;overflow-wrap:anywhere}';
document.head.appendChild(css);
window.TakumiPaperStudyGuide={open,validate,dispatch,liveCatalog,tasks,version:'3.12.4'};
})();