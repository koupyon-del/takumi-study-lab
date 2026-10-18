/* 巧澄 Study Lab v1.2 — 定期考査の範囲別演習。既存の問題・学習記録は変更しない。 */
(function(){
'use strict';
const order=['math','english','japanese','science','history','geography','waka'];
const defaultExam=()=>({title:'',count:20,subjects:{}});
let currentCat='math',currentUnit='';

function settings(){
 if(!db.curriculum||typeof db.curriculum!=='object')db.curriculum={mode:'mi',units:{},updatedAt:0};
 if(!db.curriculum.exam||typeof db.curriculum.exam!=='object')db.curriculum.exam=defaultExam();
 const exam=db.curriculum.exam;
 if(typeof exam.title!=='string')exam.title='';
 if(![10,20,30].includes(Number(exam.count)))exam.count=20;
 if(!exam.subjects||typeof exam.subjects!=='object')exam.subjects={};
 return exam;
}
function subject(cat){
 const e=settings();
 if(!e.subjects[cat]||typeof e.subjects[cat]!=='object')e.subjects[cat]={units:[],excludedIds:[]};
 const x=e.subjects[cat];
 if(!Array.isArray(x.units))x.units=[];
 if(!Array.isArray(x.excludedIds))x.excludedIds=[];
 return x;
}
function availableUnits(cat){return [...new Set((data[cat]||[]).map(q=>q.u))]}
function isAllowed(cat,q){
 const scope=subject(cat);
 return scope.units.includes(q.u)&&!scope.excludedIds.includes(q.id);
}
function candidates(cat){return (data[cat]||[]).filter(q=>isAllowed(cat,q))}
function count(){return Number(settings().count)||20}
function changed(){
 db.curriculum.updatedAt=Date.now();save();
 window.TakumiCurriculum?.drawCards();
}
function make(tag,content,cls){
 const el=document.createElement(tag);
 if(content!==undefined)el.textContent=content;
 if(cls)el.className=cls;
 return el;
}
function button(label,handler,on=false){
 const b=make('button',label,'secondary'+(on?' exam-selected':''));
 b.onclick=handler;return b;
}
function chooseUnits(cat,u,on){
 const x=subject(cat);
 x.units=on?[...new Set([...x.units,u])]:x.units.filter(s=>s!==u);
 changed();drawScope();
}
function allUnits(cat,on){
 subject(cat).units=on?availableUnits(cat):[];
 changed();drawScope();
}
function excludeQuestion(cat,id,on){
 const x=subject(cat);
 x.excludedIds=on?x.excludedIds.filter(s=>s!==id):[...new Set([...x.excludedIds,id])];
 changed();drawQuestions();
}
function openScope(cat){
 if(cat&&data[cat])currentCat=cat;
 show('examSetup');drawScope();
}
function drawScope(){
 const root=document.getElementById('exam-config-root');root.innerHTML='';
 root.appendChild(make('p','教科ごとに考査範囲の単元を選択します。選択していない単元は考査モードで出題しません。通常の基礎リカバリーやMI授業復習の設定には影響しません。','legend'));
 const main=make('div',undefined,'qbox');
 main.appendChild(make('label','考査名（任意）','exam-label'));
 const name=make('input');name.type='text';name.maxLength=80;name.placeholder='例：2学期期末考査';name.value=settings().title;
 name.onchange=()=>{settings().title=name.value.slice(0,80);changed()};
 main.appendChild(name);
 main.appendChild(make('div','1回の問題数','exam-label'));
 const nums=make('div',undefined,'exam-counts');
 for(const n of [10,20,30])nums.appendChild(button(n+'問',()=>{
  settings().count=n;changed();drawScope()
 },count()===n));
 main.appendChild(nums);
 main.appendChild(make('p','範囲表の写真から私が作成する設定用JSONを使う場合は、こちらで読み込めます。','legend'));
 const file=make('input');file.type='file';file.accept='.json,application/json';
 file.onchange=importExam;main.appendChild(file);
 root.appendChild(main);
 const tabs=make('div',undefined,'tabs');
 for(const cat of order)tabs.appendChild(button(labels[cat],()=>{currentCat=cat;drawScope()},currentCat===cat));
 root.appendChild(tabs);
 const x=subject(currentCat);
 const block=make('div',undefined,'qbox');
 block.appendChild(make('h3',labels[currentCat]+'の試験範囲'));
 block.appendChild(make('p','選択中 '+x.units.length+'単元／出題候補 '+candidates(currentCat).length+'問','legend'));
 const acts=make('div',undefined,'actions');
 acts.appendChild(button('この教科を全選択',()=>allUnits(currentCat,true)));
 acts.appendChild(button('選択を解除',()=>allUnits(currentCat,false)));
 block.appendChild(acts);
 for(const u of availableUnits(currentCat)){
  const row=make('div',undefined,'exam-unit');
  const label=make('label',undefined,'exam-checkbox');
  const cb=make('input');cb.type='checkbox';cb.checked=x.units.includes(u);
  cb.onchange=()=>chooseUnits(currentCat,u,cb.checked);
  label.appendChild(cb);label.appendChild(make('span',u));
  label.appendChild(make('span','（'+data[currentCat].filter(q=>q.u===u).length+'問）','small'));
  row.appendChild(label);
  if(x.units.includes(u)){
   const b=button('この単元の問題を個別に選ぶ',()=>openQuestions(currentCat,u));b.className='secondary exam-detail';row.appendChild(b);
  }
  block.appendChild(row);
 }
 root.appendChild(block);
 const foot=make('div',undefined,'qbox'),candidateCount=candidates(currentCat).length;
 foot.appendChild(make('p','この設定で1回 '+Math.min(candidateCount,count())+'問を出題します。候補が指定数より少ない場合は、候補数だけ出します。','legend'));
 const go=button('この範囲で'+labels[currentCat]+'の演習を開始',()=>{
  if(!candidates(currentCat).length){alert('少なくとも1単元を選び、対象問題を残してください。');return}
  window.setStudyMode('exam');startExam(currentCat);
 });
 go.style.width='100%';go.disabled=!candidateCount;foot.appendChild(go);
 foot.appendChild(make('p','重要：現行問題には教科書のページ番号が登録されていません。ページ指定だけで自動的に問題を選別することはできません。必要な場合は各単元の「個別に選ぶ」で対象を調整してください。','legend'));
 root.appendChild(foot);
}
function openQuestions(cat,u){
 currentCat=cat;currentUnit=u;show('examQuestionFilter');drawQuestions();
}
function drawQuestions(){
 const cat=currentCat,u=currentUnit,root=document.getElementById('exam-questions-root');
 root.innerHTML='';
 root.appendChild(make('p',labels[cat]+'／'+u,'exam-label'));
 root.appendChild(make('p','チェックを外した問題は、この教科の定期考査モードで出題されません。回答履歴は残ります。','legend'));
 const qs=(data[cat]||[]).filter(q=>q.u===u);
 const excluded=new Set(subject(cat).excludedIds);
 root.appendChild(make('p','出題対象 '+qs.filter(q=>!excluded.has(q.id)).length+'／'+qs.length+'問','legend'));
 const acts=make('div',undefined,'actions');
 acts.appendChild(button('全問を対象にする',()=>{
  const ids=new Set(qs.map(q=>q.id));
  subject(cat).excludedIds=subject(cat).excludedIds.filter(id=>!ids.has(id));
  changed();drawQuestions();
 }));
 acts.appendChild(button('全問を除外する',()=>{
  subject(cat).excludedIds=[...new Set([...subject(cat).excludedIds,...qs.map(q=>q.id)])];
  changed();drawQuestions();
 }));
 root.appendChild(acts);
 const list=make('div',undefined,'qbox');
 for(const q of qs){
  const label=make('label',undefined,'exam-question-line');
  const cb=make('input');cb.type='checkbox';cb.checked=!excluded.has(q.id);
  cb.onchange=()=>excludeQuestion(cat,q.id,cb.checked);
  label.appendChild(cb);
  label.appendChild(make('span',q.q,'exam-question-text'));
  list.appendChild(label);
 }
 root.appendChild(list);
 root.appendChild(button('← 範囲設定に戻る',()=>openScope(cat)));
}
function importExam(e){
 const input=e.target,f=input.files?.[0];if(!f)return;
 const reader=new FileReader();
 reader.onload=()=>{
  try{
   const parsed=JSON.parse(reader.result);
   if(parsed.schema!=='takumi-study-lab-exam-v1'||!parsed.subjects||typeof parsed.subjects!=='object')throw Error('ファイルの形式が違います');
   const next={title:String(parsed.title||'').slice(0,80),count:[10,20,30].includes(Number(parsed.count))?Number(parsed.count):20,subjects:{}};
   let selected=0;
   for(const [cat,raw] of Object.entries(parsed.subjects)){
    if(!data[cat]||!raw||!Array.isArray(raw.units))continue;
    const allowed=new Set(availableUnits(cat)),ids=new Set(data[cat].map(q=>q.id));
    const units=[...new Set(raw.units.filter(u=>typeof u==='string'&&allowed.has(u)))];
    const excluded=[...new Set((Array.isArray(raw.excludedIds)?raw.excludedIds:[]).filter(id=>typeof id==='string'&&ids.has(id)))];
    next.subjects[cat]={units,excludedIds:excluded};selected+=units.length;
   }
   if(!selected)throw Error('有効な単元を見つけられません');
   if(!confirm('現在の定期考査の範囲設定を置き換えます。学習履歴は変更しません。よろしいですか？'))return;
   settings();db.curriculum.exam=next;db.curriculum.mode='exam';changed();window.TakumiCurriculum?.drawMode();drawScope();
   alert('考査の範囲を設定しました（'+selected+'単元）');
  }catch(error){alert('読み込み失敗：'+String(error.message||error))}
  finally{input.value=''}
 };
 reader.onerror=()=>{alert('ファイルを読み込めませんでした');input.value=''};
 reader.readAsText(f,'utf-8');
}
function selectQuestions(cat,n){
 const pool=candidates(cat);
 const rank=q=>{
  const r=rec(q.id);
  let p=q.star*14+(!r.seen?35:Math.max(0,22-r.correct*4)+(r.wrong||0)*14);
  if(r.confidence==='again')p+=42;else if(r.confidence==='maybe')p+=22;else if(r.confidence==='sure')p-=8;
  if(mastered(r))p-=25;
  const grade=paperGrade(cat,q.u);
  if(grade==='weak')p+=45;else if(grade==='maybe')p+=25;else if(grade==='good')p-=10;
  return p+Math.random()*14;
 };
 const sorted=pool.map(q=>({q,score:rank(q)})).sort((a,b)=>b.score-a.score);
 const list=[],seenQuestions=new Set(),seenUnits=new Set();
 for(const {q} of sorted){
  if(seenUnits.has(q.u))continue;
  list.push(q);seenUnits.add(q.u);seenQuestions.add(q.q.replace(/^【[^】]+】/,''));
  if(list.length>=n)return list;
 }
 for(const {q} of sorted){
  const k=q.q.replace(/^【[^】]+】/,'');
  if(!seenQuestions.has(k)){list.push(q);seenQuestions.add(k)}
  if(list.length>=n)return list;
 }
 for(const {q} of sorted){if(list.length>=n)break;if(!list.includes(q))list.push(q)}
 return list;
}
function startExam(cat){
 const picked=selectQuestions(cat,count());
 if(!picked.length){alert('定期考査の範囲が未設定か、出題する問題がありません。「定期考査の範囲設定」を確認してください。');openScope(cat);return}
 state.cat=cat;state.set=picked;state.i=0;state.score=0;state.locked=false;
 state.session=++db.sessions;db.quizUpdatedAt=Date.now();save();show('quiz');render();
}
function report(){
 const scope=settings();
 return '考査名：'+(scope.title||'未設定')+'／1回'+count()+'問\n考査範囲：'+order.map(cat=>labels[cat]+'='+subject(cat).units.join('、')).join('｜')+'\n';
}
function refresh(){
 window.TakumiCurriculum?.drawMode();window.TakumiCurriculum?.drawCards();
 if(document.getElementById('examSetup')?.classList.contains('active'))drawScope();
}
window.TakumiExam={isAllowed,startExam,count,report,refresh,openScope,selectQuestions,importExam};
window.openExamConfig=openScope;
const setup='<section id="examSetup" class="screen"><button class="back" onclick="show(\'home\')">← ホーム</button><h2>📝 定期考査の範囲設定</h2><div id="exam-config-root"></div></section>'+
 '<section id="examQuestionFilter" class="screen"><button class="back" onclick="openExamConfig()">← 範囲設定</button><h2>考査範囲の個別問題設定</h2><div id="exam-questions-root"></div></section>';
document.querySelector('.wrap').insertAdjacentHTML('beforeend',setup);
const course=document.querySelector('.mode-options');
const examButton=make('button','📝 定期考査対策');examButton.dataset.studyMode='exam';
examButton.onclick=()=>{window.setStudyMode('exam');openScope()};
course.appendChild(examButton);
const panel=document.querySelector('.study-panel');
const configButton=button('📝 定期考査の範囲を設定する',()=>openScope());
configButton.style.width='100%';configButton.style.marginTop='9px';
panel.appendChild(configButton);
const style=make('style');
style.textContent='.mode-options{grid-template-columns:repeat(2,1fr)!important}.exam-selected{background:#171717;color:white;border-color:#171717}.exam-label{display:block;font-size:13px;font-weight:750;margin:10px 0}.exam-counts{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}#exam-config-root input[type=text]{width:100%;padding:12px;font:inherit;border:1px solid #ccc;border-radius:10px}.exam-unit{padding:12px 0;border-bottom:1px solid #eee}.exam-checkbox{display:flex;align-items:center;gap:8px;font-size:14px}.exam-checkbox input,.exam-question-line input{height:19px;width:19px;flex-shrink:0}.exam-detail{display:block;width:100%;font-size:12px;margin-top:7px;padding:8px}.exam-question-line{display:flex;align-items:flex-start;gap:10px;line-height:1.5;padding:12px 0;border-bottom:1px solid #eee}.exam-question-text{white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px}.exam-counts .secondary{min-width:0}';
document.head.appendChild(style);
refresh();
})();