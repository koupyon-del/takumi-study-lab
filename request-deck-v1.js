(function requestDeckModule(){
'use strict';
const mk=(tag,txt,cls)=>{const e=document.createElement(tag);if(txt!==undefined&&txt!==null)e.textContent=String(txt);if(cls)e.className=cls;return e};
const subjects=['math','english','japanese','science','history','geography','waka'];
const names={math:'数学',english:'英語',japanese:'国語',science:'理科',history:'歴史',geography:'地理',waka:'百人一首'};
const home=document.getElementById('home');
const wrap=document.querySelector('.wrap');
if(!home||!wrap)return;
let activeSession=null;
let lastSelection=null;
const form={cat:'math',unit:'',skill:'all',level:'auto',count:10,selection:'balanced'};
const ui=mk('section',null,'screen ts-request-screen');ui.id='ts-request-screen';wrap.appendChild(ui);

function subjectPool(cat){return (data[cat]||[]).filter(q=>window.TakumiCurriculum?.isAllowed?.(cat,q,'mi')===true)}
function unitMap(cat){
 const groups=new Map();
 for(const q of subjectPool(cat)){if(!groups.has(q.u))groups.set(q.u,[]);groups.get(q.u).push(q)}
 return groups;
}
function questionPool(){
 const inUnit=(unitMap(form.cat).get(form.unit)||[]);
 if(form.cat!=='math'||form.unit!=='連立方程式'||form.skill==='all')return inUnit;
 const filters={
  addition:q=>/【加減法】|加減法/.test(q.q)||['M002','M027'].includes(q.id),
  substitution:q=>/代入法|【連立・代入】|【代入】/.test(q.q)||['M003','M028'].includes(q.id),
  fraction:q=>/分数|分母|通分|÷/.test(q.q)||['M004','M029'].includes(q.id),
  word:q=>/文章題|人数|何冊|代金|合計|個数/.test(q.q)||['M005','M030'].includes(q.id)
 };
 return inUnit.filter(filters[form.skill]||(()=>true));
}
function uniqueBank(){
 const raw=questionPool();
 if(!raw.length)return [];
 const result=window.TakumiQuality?.select?.(form.cat,raw.length,raw,'mi')||raw;
 // Quality selector filters exact duplicates and conflicting answers.
 const seen=new Set();
 return result.filter(q=>{const key=q.u+'|'+String(q.q).normalize('NFKC').replace(/^【[^】]+】/,'').replace(/[\s　]/g,'');
  if(seen.has(key))return false;seen.add(key);return true;
 });
}
function level(q){return window.TakumiAdaptive?.level?.(q)??Math.max(1,Math.min(5,Number(q.star)||2))}
function targetLevel(){
 const e=window.TakumiAdaptive?.unitEvidence?.(form.cat);
 return window.TakumiAdaptive?.targetLevel?.(form.cat,form.unit,e||new Map())||2
}
function recent(q){return window.TakumiTrust?.score?.(q.id)||{seen:0,wrong:0,self:0,good:0}}
function eligibleCandidates(){
 const all=uniqueBank(),target=form.level==='auto'?targetLevel():Number(form.level);
 const filtered=form.level==='auto'?all:all.filter(q=>Math.abs(level(q)-target)<=1);
 const list=filtered.map(q=>{
  const s=recent(q),n=Number(s.self)||0,bad=Number(s.wrong)||0;
  const miss=bad/(Math.max(1,Number(s.seen)||0));
  let rank=Math.abs(level(q)-target)*18+n*2+((Number(s.good)||0)>1?6:0);
  if(form.selection==='weak')rank-=bad*12+miss*10;
  if(form.selection==='unseen')rank+=n*20;
  if(form.selection==='balanced')rank-=Math.min(12,bad*3);
  return {q,rank};
 }).sort((a,b)=>a.rank-b.rank||String(a.q.id).localeCompare(String(b.q.id)));
 return list.map(o=>o.q);
}
function assembled(){
 const picked=eligibleCandidates().slice(0,Math.min(20,form.count));
 return picked;
}
function addOption(select,val,text){const opt=mk('option',text);opt.value=String(val);select.appendChild(opt)}
function control(root,label,options,key,changed){
 const wrap=mk('label',null,'ts-deck-field');wrap.appendChild(mk('span',label));
 const sel=mk('select');sel.id='ts-deck-'+key;sel.setAttribute('aria-label',label);
 for(const [v,t] of options)addOption(sel,v,t);
 sel.value=String(form[key]);sel.onchange=()=>{form[key]=key==='count'?Number(sel.value):sel.value;changed();};
 wrap.appendChild(sel);root.appendChild(wrap);return sel;
}
function syncCategory(){
 const groups=unitMap(form.cat);
 if(!groups.has(form.unit))form.unit=groups.has('連立方程式')?'連立方程式':([...groups.keys()][0]||'');
 if(form.cat!=='math'||form.unit!=='連立方程式')form.skill='all';
}
function makeForm(){
 ui.replaceChildren();
 const back=mk('button','← ホーム','back');back.type='button';back.onclick=()=>show('home');
 ui.appendChild(back);
 ui.appendChild(mk('h2','🎯 リクエストデッキ'));
 ui.appendChild(mk('p','今だけ集中したい単元を指定して、既存の問題バンクから練習セットを作ります。通常の学習コース設定は変更しません。','ts-deck-intro'));
 const panel=mk('div',null,'ts-deck-form');
 control(panel,'教科',subjects.map(c=>[c,names[c]]),'cat',()=>{syncCategory();paintForm()});
 const unitOptions=[...unitMap(form.cat).keys()].map(u=>[u,u]);
 if(!unitOptions.length)unitOptions.push(['','出題可能な単元がありません']);
 const u=control(panel,'集中したい単元',unitOptions,'unit',()=>{form.skill='all';paintForm()});u.disabled=!form.unit;
 if(form.cat==='math'&&form.unit==='連立方程式'){
  control(panel,'さらに絞り込む',[
   ['all','単元全体'],['addition','加減法'],['substitution','代入法'],['fraction','分数を含む式'],['word','文章題'],
  ],'skill',updatePreview)
 }
 control(panel,'難易度',[
  ['auto','自動（最近の実力に合わせる）'],
  ['1','L1中心｜入門'],['2','L2中心｜基本'],['3','L3中心｜標準'],
  ['4','L4中心｜応用'],['5','L5中心｜発展'],
 ],'level',updatePreview);
 control(panel,'問題数',[[5,'5問'],[10,'10問'],[15,'15問'],[20,'20問']],'count',updatePreview);
 control(panel,'優先する問題',[
  ['balanced','適正難度・復習バランス'],
  ['weak','以前間違えた問題を優先'],
  ['unseen','まだ解いていない問題を優先']
 ],'selection',updatePreview);
 ui.appendChild(panel);
 const preview=mk('div',null,'ts-deck-preview');preview.id='ts-deck-preview';ui.appendChild(preview);
 const make=mk('button','この条件でデッキを作って始める','ts-deck-start');make.id='ts-deck-create';make.type='button';make.onclick=launch;
 ui.appendChild(make);
 ui.appendChild(mk('p','※ L1〜L5は暫定的な難易度推定です。指定レベルの前後1段階まで候補に含めます。問題不足時は水増しせず、実際の問題数を表示します。4択正答だけで紙の計算力・記述力は認定しません。','ts-deck-intro'));
 updatePreview();
}
function paintForm(){syncCategory();makeForm()}
function updatePreview(){
 const area=document.getElementById('ts-deck-preview'),start=document.getElementById('ts-deck-create');if(!area||!start)return;
 const all=uniqueBank(),avail=eligibleCandidates(),picked=assembled();
 const dist=[1,2,3,4,5].map(i=>'L'+i+':'+picked.filter(q=>level(q)===i).length).join(' ／ ');
 area.replaceChildren();
 const header=mk('strong',picked.length+'問のデッキを用意できます');area.appendChild(header);
 const subtitle=mk('p','収録候補 '+all.length+'問 ／ 今の条件に合う候補 '+avail.length+'問 ／ 希望 '+form.count+'問');
 area.appendChild(subtitle);
 if(picked.length)area.appendChild(mk('p','難易度内訳（暫定）：'+dist));
 if(!form.unit){area.appendChild(mk('p','進度設定で「未習」以外の単元がないか、出題が制限されています。単元設定を確認してください。','ts-deck-warning'))}
 else if(picked.length<form.count){area.appendChild(mk('p','希望より少ないため、'+picked.length+'問で実施します。同じ問題の水増しや範囲外出題はしません。','ts-deck-warning'))}
 if(!picked.length)area.appendChild(mk('p','この条件では出題できません。難易度や絞り込みを変更してください。','ts-deck-warning'));
 start.disabled=picked.length===0;
 start.textContent=picked.length?'この'+picked.length+'問で練習を始める':'出題できる問題がありません';
}
function open(){
 syncCategory();makeForm();show(ui.id);
}
function launch(){
 const qs=assembled();
 if(!qs.length){updatePreview();return}
 // Preserve original q IDs and route every answer through the existing trust journal.
 activeSession=null;
 state.cat=form.cat;state.set=qs;state.i=0;state.score=0;state.locked=false;
 state.session=++db.sessions;state.weeklySession=null;db.quizUpdatedAt=Date.now();
 activeSession={session:state.session,cat:form.cat,unit:form.unit,count:qs.length,level:form.level};
 lastSelection={...form}; 
 if(window.TakumiAdaptive)window.TakumiAdaptive.lastPlan=null; // stale normal-mode label
 save();show('quiz');render();tagQuiz();
}
function tagQuiz(){
 const container=document.querySelector('#quiz .qbox');if(!container)return;
 let tag=document.getElementById('ts-deck-indicator');
 if(!tag){tag=mk('div',null,'ts-deck-indicator');const meta=container.querySelector('.meta');if(meta)meta.after(tag);else container.prepend(tag)}
 if(activeSession?.session===state.session)tag.textContent='🎯 リクエストデッキ｜'+activeSession.unit+'｜'+activeSession.count+'問';
 else tag.textContent='';
 tag.hidden=!(activeSession&&activeSession.session===state.session);
}
const oldRender=render;render=function(){oldRender();tagQuiz()};
const oldStart=start;start=function(cat){activeSession=null;return oldStart(cat)};
const oldNext=nextQ;
nextQ=function(){
 const finishing=activeSession&&state.session===activeSession.session&&state.i===state.set.length-1;
 const before=state.i;const sess=state.session;
 const result=oldNext();
 if(finishing&&state.session===sess&&state.i>before&&document.getElementById('result')?.classList.contains('active')){
  const root=document.querySelector('#result .qbox');if(root){
   let note=document.getElementById('ts-deck-finish');
   if(!note){note=mk('div',null,'ts-deck-finish');note.id='ts-deck-finish';root.appendChild(note)}
   note.replaceChildren(mk('strong','🎯 リクエストデッキ終了：'+activeSession.unit),
     mk('p','このデッキの正誤は通常どおり学習履歴に残っています。デッキ設定は一時的で、普段の学習コースには影響しません。'));
   const retry=mk('button','条件を変更・再リクエスト','secondary');retry.type='button';retry.onclick=()=>{
    if(lastSelection)Object.assign(form,lastSelection);
    open();
   };
   note.appendChild(retry);
  }
 }
 return result
};
const oldShow=show;
show=function(id){
 if(id!=='result'&&id!=='ts-request-screen'){
  const note=document.getElementById('ts-deck-finish');if(note)note.remove();
 }
 oldShow(id)
};
// Daily tutoring stays prominent, but the large task list opens only on demand.
const cards=document.getElementById('cards');
const focus=home.querySelector('.ts-focus');
const daily=mk('details',null,'ts-daily-fold');daily.id='ts-home-daily';
const dailySummary=mk('summary',null,'ts-daily-summary');
dailySummary.append(
 mk('span','毎日の必修学習','ts-daily-eyebrow'),
 mk('strong','数学と英語を、今日も少しずつ。','ts-daily-title'),
 mk('span','一歩ずつ積み重ねよう。','ts-daily-message'),
 mk('span','個別補習メニューを開く ▾','ts-daily-open'),
 mk('span','個別補習メニューを閉じる ▴','ts-daily-close')
);
daily.appendChild(dailySummary);
if(focus)daily.appendChild(focus);
const topAnchor=home.querySelector('.hero')||cards;
if(topAnchor)home.insertBefore(daily,topAnchor);else home.appendChild(daily);

// Study course directly controls which questions appear in ordinary subject practice.
// Reuse the original buttons (including Exam mode), so no setting or handlers are duplicated.
const course=mk('section',null,'ts-course-choice');course.id='ts-home-course-choice';
course.append(
 mk('h3','学習コースを選択','ts-course-title'),
 mk('p','教科別の通常練習の出題範囲を切り替えます。個別補習メニューは専用の学習プランで出題します。','ts-course-hint')
);
const studyPanel=home.querySelector('.study-panel');
const modeButtons=studyPanel?.querySelector('.mode-options');
if(modeButtons)course.appendChild(modeButtons);
if(cards)home.insertBefore(course,cards);else home.appendChild(course);
const header=mk('h3','教科別の通常練習','ts-deck-sectiontitle');
if(cards)home.insertBefore(header,cards);
// Keep the existing review button and its click handler; relocate only its position.
// The explanation module creates it before this module executes.
const priorReview=[...home.querySelectorAll('button')].find(button=>
 (button.textContent||'').includes('前回の解説・間違い直しを見る')
);
if(priorReview){priorReview.classList.add('ts-home-review-entry');home.insertBefore(priorReview,header);}
const lesson=home.querySelector('.ts-video-home');
if(lesson&&cards)cards.after(lesson);
// Optional request decks belong below the everyday learning tools.
const launchPanel=mk('section',null,'ts-deck-home');
const title=mk('strong','🎯 必要なときだけ｜リクエストデッキ');
const intro=mk('p','特定の単元を集中して解きたいときに、問題数や難易度を指定できます。');
const openButton=mk('button','単元を指定して練習する','secondary');openButton.type='button';openButton.onclick=open;
launchPanel.append(title,intro,openButton);
const optionalAnchor=lesson||cards;
if(optionalAnchor)optionalAnchor.after(launchPanel);else home.appendChild(launchPanel);
// Rarely used settings and reports remain collapsible, preserving the local fold state.
const controls=mk('details',null,'ts-home-fold');controls.id='ts-home-courses';controls.appendChild(mk('summary','単元の進度・シラバス・出題設定を開く'));
if(studyPanel){
 const heading=studyPanel.querySelector('b');
 if(heading)heading.textContent='単元の進度・出題条件の詳しい設定';
 controls.appendChild(studyPanel);
}
const summary=mk('details',null,'ts-home-fold');summary.id='ts-home-details';summary.appendChild(mk('summary','進捗・記録・保護者メニューを開く'));
const stats=home.querySelector('.stats');if(stats)summary.appendChild(stats);
for(const actions of [...home.querySelectorAll(':scope > .actions')])summary.appendChild(actions);
const help=home.querySelector('.home-help');if(help)summary.appendChild(help);
home.append(controls,summary);
const storageKey='takumi-study-lab-layout-v1';
try{
 const settings=JSON.parse(localStorage.getItem(storageKey)||'{}');
 controls.open=Boolean(settings.courses);summary.open=Boolean(settings.details);
}catch(e){}
for(const [node,key] of [[controls,'courses'],[summary,'details']]){
 node.addEventListener('toggle',()=>{
  try{
   const cfg=JSON.parse(localStorage.getItem(storageKey)||'{}');
   cfg[key]=node.open;localStorage.setItem(storageKey,JSON.stringify(cfg));
  }catch(e){}
 });
}
const css=`
.ts-daily-fold{display:block;margin:14px 0 14px;background:#edf4f8;border:1px solid #b9cedd;border-radius:16px;padding:0;overflow:hidden}
.ts-daily-summary{display:flex;flex-direction:column;gap:5px;cursor:pointer;padding:14px 16px;list-style:none;line-height:1.4}
.ts-daily-summary::-webkit-details-marker{display:none}
.ts-daily-summary::marker{content:''}
.ts-daily-summary:focus-visible{outline:3px solid #4e819b;outline-offset:-3px}
.ts-daily-eyebrow{color:#426b83;font-size:12px;font-weight:900;letter-spacing:.03em}
.ts-daily-title{font-size:17px;font-weight:850;color:#193b54}
.ts-daily-message{font-size:12px;color:#537083}
.ts-daily-open,.ts-daily-close{font-size:13px;font-weight:850;margin-top:5px;padding:10px 12px;border-radius:9px;background:#fff;color:#20435b;text-align:center;border:1px solid #c3d5e0}
.ts-daily-close,.ts-daily-fold[open] .ts-daily-open{display:none}
.ts-daily-fold[open] .ts-daily-close{display:block}
.ts-daily-fold .ts-focus{margin:0 11px 12px;border:1px solid #dbe3e8;box-shadow:none;padding:12px}
.ts-daily-fold .ts-focus h3{font-size:15px}
.ts-daily-fold .ts-focus p,.ts-daily-fold .ts-focus .ts-task-note{font-size:12px}
.ts-course-choice{margin:14px 0 8px;padding:15px 14px;background:#fff;border:1px solid #dce3e9;border-radius:15px}
.ts-course-title{font-size:16px;margin:0 0 8px;color:#20384c}
.ts-course-hint{font-size:12px;line-height:1.6;color:#647381;margin:0}
.ts-course-choice .mode-options{margin-top:10px}
.ts-course-choice .mode-options button{min-height:49px;padding:10px 5px;line-height:1.45;font-size:12px}
.ts-course-choice .mode-options button.on{outline:2px solid #4c8295;outline-offset:1px}
@media(max-width:370px){.ts-course-choice .mode-options button{font-size:11px;padding:9px 3px}}
.ts-deck-home{margin:20px 0 12px;padding:13px 15px;background:#fff;border:1px solid #dce2e7;border-radius:14px}
.ts-deck-home strong{font-size:14px}.ts-deck-home p{font-size:12px;line-height:1.5;color:#65717d;margin:8px 0}
.ts-deck-home button{width:100%;font-weight:700;background:#f7f9fb}
.ts-deck-sectiontitle{font-size:15px;margin:11px 1px 11px}
#home>.ts-home-review-entry{margin:16px 0 3px!important;min-height:44px;font-weight:700}
.ts-home-fold{margin:12px 0;border:1px solid #dae1e7;background:#fff;border-radius:14px;padding:12px}
.ts-home-fold>summary{font-weight:700;font-size:14px;padding:5px 2px;cursor:pointer}
.ts-home-fold[open]>summary{margin-bottom:12px}
.ts-home-fold .study-panel{box-shadow:none;margin:0;padding:8px 0}
.ts-home-fold .home-help{margin-top:16px}
.ts-request-screen h2{font-size:22px;margin:20px 0 9px}
.ts-deck-intro{font-size:13px;color:#5d6b76;line-height:1.7}
.ts-deck-form{background:white;border-radius:16px;padding:15px;display:grid;grid-template-columns:1fr;gap:15px}
.ts-deck-field{display:flex;flex-direction:column;gap:7px;font-weight:700;font-size:13px;color:#283c4c}
.ts-deck-field select{width:100%;font-size:15px;padding:12px;border:1px solid #c4cfd9;background:#fff;color:#152535;border-radius:10px;min-height:46px}
.ts-deck-preview{margin:14px 0;border-radius:14px;padding:13px 15px;background:#f0f6fa;border:1px solid #d4e0ea;font-size:13px;line-height:1.6}
.ts-deck-preview p{margin:8px 0;color:#465d6d}
.ts-deck-preview .ts-deck-warning{color:#9b562a;font-weight:650}
.ts-deck-start{width:100%;min-height:50px;border:0;border-radius:12px;background:#203a55;color:white;font-weight:800;font-size:15px;padding:13px}
.ts-deck-start:disabled{background:#b0bac3}
.ts-deck-indicator{padding:8px 10px;border-radius:9px;background:#e9f3fc;color:#245478;font-size:12px;font-weight:800;margin:9px 0}
.ts-deck-finish{border:1px solid #d2e2ef;background:#f0f6fa;border-radius:12px;padding:14px;margin-top:14px}
.ts-deck-finish p{font-size:13px;line-height:1.6}
.ts-deck-finish button{width:100%;margin-top:8px}
@media(min-width:650px){.ts-deck-form{grid-template-columns:1fr 1fr}}
`;
document.head.appendChild(mk('style',css));
window.TakumiRequestDeck={open,form,subjectPool,uniqueBank,eligibleCandidates,assembled,version:'2.3.1'};
})();