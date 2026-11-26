/* 巧澄 Study Lab v3.13.1 — date-aware paper-to-app navigator.
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

const fallbackNov16={
 status:'material_ready',
 paper:[{subject:'数学',minutes:25,summary:'正負・分数・代入・連立10分、不等式・反比例・合同15分'},{subject:'地理',minutes:20,summary:'ヨーロッパの暖流と偏西風、アフリカのサヘル・コンゴ盆地、EUの説明'},{subject:'英語',minutes:10,summary:'過去形、did not、進行形の疑問文、was/were'}],
 app:[{cat:'geography',minutes:15,summary:'地理の期末厳選10問'},{cat:'math',minutes:10,summary:'数学の期末厳選10問。途中式は紙に書く'},{minutes:5,summary:'選択肢の誤答理由を確認'}],
 selfStudy:'数学数量の問題集p.61〜71から25分／地理のアフリカp.80〜91を20分／図形提出課題15分',
 notes:'11/16の紙教材は本人用プリントで配布済み。'
};
const printedDays={
 "2026-11-26": {
  "paper": [
   {
    "subject": "数量",
    "minutes": 15,
    "summary": "p.2 M1・M2　不等式・反比例"
   },
   {
    "subject": "英語",
    "minutes": 15,
    "summary": "p.2 E1・E2　過去形・代名詞"
   },
   {
    "subject": "理科B",
    "minutes": 10,
    "summary": "p.2 B1　湿度"
   },
   {
    "subject": "幾何",
    "minutes": 10,
    "summary": "p.3　学校教材から四角形１問"
   },
   {
    "subject": "国語",
    "minutes": 10,
    "summary": "p.3　J1・百人一首"
   }
  ],
  "app": [],
  "selfStudy": "残りは自由に使う。",
  "notes": "朝30分・放課後30分。丸つけ込み。",
  "status": "material_ready",
  "recordMinutes": 0,
  "selfStudyTitle": "学習時間の使い方"
 },
 "2026-11-27": {
  "paper": [
   {
    "subject": "数量",
    "minutes": 40,
    "summary": "p.4 M3・M4を中心に比例・反比例。図書館では問題集p.76～87の類題へ。M5は不等式の式だけ確認。"
   },
   {
    "subject": "英語",
    "minutes": 35,
    "summary": "p.5 E3②の理由と③のmakingを直し、学校の単元テストへ。"
   },
   {
    "subject": "理科B",
    "minutes": 25,
    "summary": "p.5 B2・B3は取り組み済み。残りは学校プリントの天気記号と誤答。"
   },
   {
    "subject": "学校教材",
    "minutes": 25,
    "summary": "午前に最も困った教科を１つ。"
   },
   {
    "subject": "国語",
    "minutes": 10,
    "summary": "アプリの後に文法の誤答１問と漢字３語。"
   }
  ],
  "app": [
   {
    "cat": "geography",
    "unit": "アフリカ",
    "minutes": 8,
    "summary": "アフリカの誤答を解き直し、コンゴ盆地とサヘルを地図で確認。"
   },
   {
    "cat": "science",
    "unit": "人体のつくり",
    "minutes": 7,
    "summary": "人体の誤答を解き直し、血液の３成分の働きを説明。"
   }
  ],
  "selfStudy": "学校教材25分は上の150分に含む。解き終えた紙を最初からやり直す必要はありません。",
  "notes": "午前100分。午後は学校教材25分→地理8分→理科A7分→国語10分。",
  "status": "material_ready",
  "recordMinutes": 0,
  "selfStudyTitle": "学習時間の使い方"
 }
};
function tokyoDate(){
 return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
}
function tomorrow(day){const n=new Date(day+'T00:00:00Z').getTime();return Number.isFinite(n)?new Date(n+86400000).toISOString().slice(0,10):day}
function getDay(given){
 const date=typeof given==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(given)?given:tokyoDate();
 const plan=window.TakumiStudyPolicy?.effectivePlan?.();
 const full=plan?.paperDaily||{};
 const compact=Array.isArray(plan?.paperDailyRows)?plan.paperDailyRows:[];
 const read=day=>{
  const v=Object.prototype.hasOwnProperty.call(full,day)?full[day]:null;
  if(v&&Array.isArray(v.paper)&&Array.isArray(v.app))return v;
  if(printedDays[day])return printedDays[day];
  if(day==='2026-11-16')return fallbackNov16;
  const a=compact.find(row=>Array.isArray(row)&&row.length>=9&&row[0]===day);
  if(!a)return null;
  if(day==='2026-12-02')return {status:'planned',
    paper:[{subject:'試験最終日',minutes:0,summary:'国語・地理・美術・OC。試験終了後は休養'}],
    app:[],selfStudy:'試験後は休養し、未提出物の確認のみ。',notes:'試験最終日につき通常の学習枠は課さない。'};
  const examDay=day>='2026-11-28';
  return {status:'planned',
   paper:[{subject:'数学',minutes:25,summary:a[1]},{subject:a[2],minutes:20,summary:a[3]},{subject:a[4],minutes:10,summary:a[5]}],
   app:[{cat:a[6],minutes:examDay?20:15,summary:'期末厳選問題10問'},
        {cat:a[7],minutes:10,summary:'期末厳選問題10問'},
        ...examDay?[]:[{minutes:5,summary:'誤答の理由を確認'}]],
   selfStudy:a[8],notes:examDay
    ?'試験当日・試験後は疲労に応じて短縮。各教科の提出物を優先する。'
    :'日別計画。個別の紙問題・解答が配布済みとは限らない。'};
 };
 const d=read(date);if(d)return {date,day:d,kind:'today'};
 const next=tomorrow(date),e=read(next);
 if(e)return {date:next,day:e,kind:'tomorrow'};
 return {date,day:null,kind:'missing'};
}
function labelDate(date){const a=date.split('-');return a[0]+'年'+Number(a[1])+'月'+Number(a[2])+'日'}
function examReady(cat){return Boolean(window.TakumiExamQuality20261115?.start&&(data[cat]||[]).some(q=>q.examQuality==='mi2026-2nd-final'))}
function renderToday(root,given){
 const info=getDay(given),day=info.day;
 root.appendChild(mk('h3',(info.date===tomorrow(tokyoDate())?'明日の予告｜':'今日の指示｜')+labelDate(info.date)));
 if(!day){
  root.appendChild(mk('p','この日の課題は未登録です。学習方針のクラウド連携を確認してください。11/7の課題を今日のものとして表示しません。','ts-paper-study-warning'));return;
 }
 root.appendChild(mk('p',day.status==='material_ready'?'紙教材は作成済みです。実際の問題は配布済みの本人用プリントを参照。':'日別学習計画です。紙の個別問題が作成済みとは限りません。','ts-paper-study-note'));
 function rows(title,items,app){
  root.appendChild(mk('h3',title));
  for(const t of items){
   const card=mk('div',null,'ts-paper-study-card');
   const name=t.subject||(t.cat?catNames[t.cat]||t.cat:'誤答の復習');
   card.appendChild(mk('strong',name+(Number(t.minutes)>0?'｜'+Number(t.minutes)+'分':'')));
   if(t.summary)card.appendChild(mk('p',t.summary));
   if(app&&t.unit){
    card.appendChild(buttonFor({type:'deck',cat:t.cat,unit:t.unit,count:5,selection:'weak'}));
   }else if(app&&t.cat){
    const grammar=t.cat==='english';
    const btn=mk('button',grammar?'▶ 英文法ラボ（入力式・詳しい解説）を開く':'▶ '+(catNames[t.cat]||t.cat)+'の期末厳選10問を開く','ts-paper-study-action');
    btn.type='button';if(grammar?!window.TakumiEnglishStructureLab:!examReady(t.cat))btn.classList.add('ts-paper-study-unavailable');
    btn.onclick=()=>{
      if(grammar){
        if(!window.TakumiEnglishStructureLab?.menu){alert('英文法ラボが読み込まれていません。再読み込みしてください。');return}
        window.TakumiEnglishStructureLab.menu();return;
      }
      if(!examReady(t.cat)){alert('期末厳選問題が未読込です。再読み込みしてください。');return}
      window.TakumiExamQuality20261115.start(t.cat);
    };
    card.appendChild(btn);
   }
   root.appendChild(card);
  }
 }
 const paperMinutes=day.paper.reduce((n,t)=>n+Math.max(0,Number(t.minutes)||0),0);
 const appMinutes=day.app.reduce((n,t)=>n+Math.max(0,Number(t.minutes)||0),0);
 rows('紙教材・試験対応｜'+(paperMinutes?paperMinutes+'分':'任意'),day.paper,false);
 if(appMinutes)rows('アプリ｜'+appMinutes+'分',day.app,true);
 if(day.app.length && day.recordMinutes!==0){root.appendChild(mk('h3','本人の自己採点・記録｜5分'));
 root.appendChild(mk('p','間違いを知識・方針・計算・読み違い・時間切れに分類し、自分で解き直す。','ts-paper-study-note'));}
 root.appendChild(mk('h3',day.selfStudyTitle||(day.app.length?'自主学習｜60分':'試験後の過ごし方')));
 root.appendChild(mk('p',day.selfStudy||'学校の教科書・問題集と提出物を優先','ts-paper-study-note'));
 if(day.notes)root.appendChild(mk('p','※ '+day.notes,'ts-paper-study-note'));
}

const lessonApi=()=>window.TakumiVideoLessons;
const deckApi=()=>window.TakumiRequestDeck;
function knownLesson(id){
 // The ID is the stable route key. Lesson titles may change as teaching content improves.
 const api=lessonApi();
 return Boolean(typeof api?.openLesson==='function'&&api?.lessonList?.some(l=>l.id===id));
}
function knownUnit(cat,u){return Boolean((data[cat]||[]).some(q=>q.u===u))}
function availableUnit(cat,u){
 const d=deckApi();
 return Boolean(d?.subjectPool&&d.subjectPool(cat).some(q=>q.u===u));
}
function validate(task){
 if(task.type==='lesson')return knownLesson(task.id)?'ok':'missing-lesson';
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
 d.form.cat=task.cat;d.form.unit=task.unit;d.form.skill=task.skill||'all';d.form.level='auto';d.form.selection=task.selection||'balanced';d.form.count=task.count||5;
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
 if(task.type==='lesson'){
  const live=lessonApi()?.lessonList?.find(l=>l.id===task.id);
  if(live&&live.title!==task.expected)card.appendChild(mk('p','アプリ内の現在の講座名：'+live.title,'ts-paper-study-note'));
 }
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
  const oldPrint=tasks.find(t=>t.type==='lesson'&&t.id===l.id);
  const task={type:'lesson',printed:'板書授業：'+l.title,expected:oldPrint?.expected||l.title,id:l.id,description:'講座 '+(l.group||'')};
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
 renderToday(screen);
 const nextDate=tomorrow(tokyoDate());
 if(getDay(nextDate).date===nextDate && getDay(nextDate).day?.status==='material_ready'){
  const preview=mk('details');preview.appendChild(mk('summary','明日の紙課題を確認'));
  const content=mk('div');renderToday(content,nextDate);preview.appendChild(content);screen.appendChild(preview);
 }
 const archived=mk('details',null,'ts-paper-study-manifest');
 archived.appendChild(mk('summary','過去の紙課題：2026年11月7日'));
 const archivedTasks=mk('div',null,'ts-paper-study-tasks');
 for(const t of tasks)addTask(archivedTasks,t);
 archived.appendChild(archivedTasks);screen.appendChild(archived);
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
const summary=mk('p',null,'ts-paper-study-home-summary');entry.appendChild(summary);
function refresh(){const x=getDay();summary.textContent=(x.kind==='tomorrow'?'明日':'今日')+' '+labelDate(x.date)+'｜'+(x.day?'紙・学校教材 '+x.day.paper.reduce((n,t)=>n+(Number(t.minutes)||0),0)+'分／アプリ '+x.day.app.reduce((n,t)=>n+(Number(t.minutes)||0),0)+'分':'最新の指示を確認');}
const action=mk('button','今日の紙課題の指示を開く','ts-paper-study-home-button');action.type='button';action.onclick=open;
entry.appendChild(action);
(home.querySelector('.top')||home.firstElementChild)?.after(entry);
const css=mk('style');
css.textContent='.ts-paper-study-entry{background:#eef4fb;border:1px solid #b9d0e4;padding:14px;margin:12px 0;border-radius:15px}.ts-paper-study-entry strong{font-size:16px}.ts-paper-study-entry p,.ts-paper-study-note{color:#405569;font-size:13px;line-height:1.6}.ts-paper-study-home-button,.ts-paper-study-action{width:100%;border:none;border-radius:10px;padding:11px 14px;margin-top:7px;background:#215a81;color:#fff;font-weight:700}.ts-paper-study-card{background:#fff;border:1px solid #e1e6ec;border-radius:12px;padding:13px;margin:9px 0}.ts-paper-study-card strong{font-size:14px;line-height:1.6}.ts-paper-study-card p{font-size:12px;color:#5a6570;margin:6px 0}.ts-paper-study-unavailable{background:#687681}.ts-paper-study-screen h3{font-size:16px;margin-top:20px}.ts-paper-study-search{display:block;width:100%;padding:12px;border:1px solid #c7d1d8;border-radius:10px;font-size:15px}.ts-paper-study-warning{color:#9e3d2e;font-size:13px}.ts-paper-study-manifest{background:#fff;border-radius:12px;margin-top:16px;padding:12px}.ts-paper-study-manifest-content{font-size:12px;line-height:1.7;overflow-wrap:anywhere}';
document.head.appendChild(css);
refresh();
window.addEventListener?.('focus',refresh);
document.addEventListener?.('visibilitychange',refresh);
window.TakumiPaperStudyGuide={open,validate,dispatch,liveCatalog,tasks,getDay,renderAtDate:(date,root)=>renderToday(root,date),refresh,version:'3.13.1'};
})();