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
// Home: keep learning choices at the top, move rarely used configuration to collapsible panels.
const launchPanel=mk('section',null,'ts-deck-home');
const title=mk('strong','🎯 集中練習をリクエスト');
const intro=mk('p','教科・単元・難易度・問題数を選んで、その場限りのデッキを作成');
const openButton=mk('button','リクエストデッキを作る','secondary');openButton.type='button';openButton.onclick=open;
launchPanel.append(title,intro,openButton);
const cards=document.getElementById('cards');if(cards)home.insertBefore(launchPanel,cards);else home.appendChild(launchPanel);
const header=mk('h3','教科別の通常練習','ts-deck-sectiontitle');if(cards)home.insertBefore(header,cards);
const controls=mk('details',null,'ts-home-fold');controls.id='ts-home-courses';controls.appendChild(mk('summary','学習コース・進度設定を開く'));
const studyPanel=home.querySelector('.study-panel');if(studyPanel)controls.appendChild(studyPanel);
const summary=mk('details',null,'ts-home-fold');summary.id='ts-home-details';summary.appendChild(mk('summary','個別補習・進捗・管理メニューを開く'));
const focus=home.querySelector('.ts-focus');if(focus)summary.appendChild(focus);
const stats=home.querySelector('.stats');if(stats)summary.appendChild(stats);
for(const actions of [...home.querySelectorAll(':scope > .actions')])summary.appendChild(actions);
const help=home.querySelector('.home-help');if(help)summary.appendChild(help);
home.append(controls,summary);
const lesson=home.querySelector('.ts-video-home');
if(lesson&&cards)cards.after(lesson);
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
.ts-deck-home{margin:12px 0;padding:15px;background:#e9f2fa;border:1px solid #c7d8e7;border-radius:15px}
.ts-deck-home strong{font-size:17px}.ts-deck-home p{font-size:13px;line-height:1.5;color:#4e6477}
.ts-deck-home button{width:100%;font-weight:700;background:#fff}
.ts-deck-sectiontitle{font-size:15px;margin:19px 1px 11px}
.ts-home-fold{margin:12px 0;border:1px solid #dae1e7;background:#fff;border-radius:14px;padding:12px}
.ts-home-fold>summary{font-weight:700;font-size:14px;padding:5px 2px;cursor:pointer}
.ts-home-fold[open]>summary{margin-bottom:12px}
.ts-home-fold .study-panel{box-shadow:none;margin:0;padding:8px 0}
.ts-home-fold .ts-focus{margin:0 0 13px}
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
window.TakumiRequestDeck={open,form,subjectPool,uniqueBank,eligibleCandidates,assembled,version:'2.2.0'};
})();