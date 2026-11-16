/* Takumi Study Lab English Structure Lab v3.13.0.
 * Typing first (not answer elimination), grammar lectures, delayed answer,
 * repeat weak items. Store in existing study_state/trust journal without schema changes. */
(function(root){
'use strict';
const bank=root.TakumiEnglishStructureBank;
const home=document.getElementById('home'),wrap=document.querySelector('.wrap');
if(!bank||!home||!wrap)return;
if(document.getElementById('ts-grammar-entry'))return;
const label=bank.topics;
const make=(tag,txt,cls)=>{const n=document.createElement(tag);if(txt!==undefined&&txt!==null)n.textContent=String(txt);if(cls)n.className=cls;return n};
const screen=make('section',null,'screen ts-grammar-screen');screen.id='ts-grammar-screen';wrap.appendChild(screen);
const entry=make('section',null,'ts-grammar-entry');entry.id='ts-grammar-entry';
entry.appendChild(make('strong','🔤 英語のしくみ｜自分で書く文法トレーニング'));
entry.appendChild(make('p','11/16の英語の誤りから、主語・時制・動詞の役割を理解→英文を入力→解説で確認。4択だけに頼りません。'));
const openButton=make('button','英文法トレーニングを開く','ts-grammar-primary');openButton.type='button';openButton.onclick=menu;
entry.appendChild(openButton);
const anchor=home.querySelector('.ts-lesson-entry')||home.querySelector('.study-panel');
if(anchor?.before)anchor.before(entry);else home.appendChild(entry);
const state={topic:'skeleton',count:10,phase:'menu',session:0,index:0,set:[],correct:0,help:false,completed:false,answered:false,lastRecordId:null,missed:[],mode:'balanced'};
function backToHome(){show('home')}
function backButton(action,labelText='← 学習メニュー'){
 const b=make('button',labelText,'back');b.type='button';b.onclick=action;return b;
}
function title(rootNode,text,sub){
 rootNode.appendChild(make('h2',text));
 if(sub)rootNode.appendChild(make('p',sub,'ts-grammar-sub'));
}
function refresh(){
 const c=bank.counts;
 const summary=entry.querySelector?.('.ts-grammar-entry-count');
 if(summary)summary.textContent='入力式 '+c.writing+'問 ＋ 通常4択 '+c.fourChoice+'問';
}
const counts=make('div','入力式 '+bank.counts.writing+'問 ＋ 通常4択 '+bank.counts.fourChoice+'問','ts-grammar-entry-count');entry.appendChild(counts);
function menu(){
 screen.replaceChildren();state.phase='menu';screen.appendChild(backButton(backToHome,'← ホーム'));
 title(screen,'英文のしくみ・文法ラボ',
  '「なぜ did になる？」「are の後が studying なのはなぜ？」を、解説→自分で作文→答え合わせの順に理解します。');
 const notice=make('p','入力式 '+bank.items.length+'問／通常の英語4択 '+bank.choices.length+'問。解答を表示してからの回答は自力正解として記録しません。','ts-grammar-info');screen.appendChild(notice);
 screen.appendChild(make('h3','単元を選択'));
 const grid=make('div',null,'ts-grammar-grid');
 for(const [code,name] of Object.entries(label)){
  const b=make('button',name+'（入力式 '+bank.items.filter(x=>x.topic===code).length+'問）','ts-grammar-topic');
  b.type='button';b.onclick=()=>lecture(code);grid.appendChild(b);
 }
 screen.appendChild(grid);
 screen.appendChild(make('h3','今日のおすすめ：10分コース'));
 const routine=make('p','①「英文の骨格」で主語・動詞を確認 → ②「過去形」「否定文」「疑問文」「現在進行形」から各日1単元を10問 → ③間違えた英文を1文、理由付きで紙に書き直す。','ts-grammar-info');
 screen.appendChild(routine);
 const btn=make('button','まず「主語・動詞・文の骨格」を学ぶ','ts-grammar-primary');
 btn.type='button';btn.onclick=()=>lecture('skeleton');screen.appendChild(btn);
 show(screen.id);
}
function lecture(topic){
 state.topic=topic;state.phase='lecture';screen.replaceChildren();screen.appendChild(backButton(menu));
 const section=bank.lectures.find(x=>x.id===topic);
 title(screen,'板書授業｜'+(section?.title||label[topic]),
 '問題より先に、何を見てどう判断するかを確認する。答えの丸暗記を目指さない。');
 for(const [index,example,reason] of (section?.steps||[])){
  const card=make('div',null,'ts-grammar-lesson');
  card.appendChild(make('h3',index));
  card.appendChild(make('div',example,'ts-grammar-example'));
  card.appendChild(make('p',reason));screen.appendChild(card);
 }
 const target=make('div',null,'ts-grammar-select');
 target.appendChild(make('strong','演習数を選ぶ（1問ごとに自分で英文を入力）'));
 const sel=make('select');sel.setAttribute('aria-label','演習数');
 for(const n of [5,10,15,20]){
  const o=make('option',n+'問');o.value=String(n);sel.appendChild(o);
 }
 sel.value=String(state.count);sel.onchange=()=>{state.count=Number(sel.value)};
 target.appendChild(sel);
 const startBtn=make('button','この単元の入力式演習を開始','ts-grammar-primary');
 startBtn.type='button';startBtn.onclick=()=>start(topic,state.count,'balanced');target.appendChild(startBtn);
 const w=make('button','過去に間違えた問題だけやり直す','ts-grammar-secondary');
 w.type='button';w.onclick=()=>start(topic,state.count,'weak');target.appendChild(w);
 screen.appendChild(target);show(screen.id);
}
function learned(q){
 const r=db.q?.[q.id]||{};
 return {seen:Number(r.seen)||0,wrong:Number(r.wrong)||0,streak:Number(r.streak)||0,last:Number(r.last)||0};
}
function select(topic,count,mode){
 const a=bank.items.filter(q=>q.topic===topic);
 let candidates=mode==='weak'?a.filter(q=>learned(q).wrong>0):a;
 if(mode==='weak'&&!candidates.length)return [];
 const ranked=candidates.map(q=>{
  const x=learned(q);
  const score=(mode==='weak'?x.wrong*35:Math.min(25,x.wrong*15))-(x.seen*2)+(x.seen===0?20:0)+(Date.now()-x.last>86400000?3:0);
  return {q,score};
 }).sort((a,b)=>b.score-a.score||a.q.id.localeCompare(b.q.id));
 // Deterministic and balanced enough for reproducible feedback while checking weak/new first.
 return ranked.slice(0,Math.min(count,ranked.length)).map(x=>x.q);
}
function start(topic,count=10,mode='balanced'){
 const list=select(topic,count,mode);
 if(!list.length){
  const message=make('p','この単元の「過去に間違えた問題」はまだありません。まず通常演習で実力を確認しましょう。','ts-grammar-info');
  screen.appendChild(message);return;
 }
 state.topic=topic;state.count=count;state.phase='practice';state.mode=mode;state.set=list;state.index=0;state.correct=0;state.completed=false;state.session=++db.sessions;state.missed=[];
 db.quizUpdatedAt=Date.now();save();drawQuestion();show(screen.id);
}
function norm(s){return bank.normalize(s)}
function accepted(q,s){return q.answers.some(a=>norm(a)===norm(s))}
function record(q,ok,help,answerText){
 const r=rec(q.id),stamp=Date.now();
 db.played++;if(ok)db.correct++;
 r.seen++;r.last=stamp;
 if(!Array.isArray(r.sessions))r.sessions=[];
 if(!r.sessions.includes(state.session))r.sessions.push(state.session);
 if(ok){r.correct++;r.streak++}else{r.wrong++;r.streak=0}
 r.confidence=ok?'maybe':'again';
 if(!ok)state.missed.push(q);
 if(ok)state.correct++;
 const trust=db.trust||(db.trust={schema:1,answers:{},paper:{},paperEvents:{}});
 if(!trust.answers)trust.answers={};
 const id='grammar-'+stamp+'-'+state.session+'-'+q.id;
 trust.answers={...trust.answers,[id]:{
   id,questionId:q.id,cat:'english',unit:q.topic==='past'?'過去形':q.topic==='progress'?'現在進行形':q.topic==='present'?'三単現':
       q.topic==='question'||q.topic==='negative'?'疑問文・否定文':q.topic==='be'?'be動詞':'文の骨格',
   ok,session:state.session,help,confidence:r.confidence,complete:true,at:new Date(stamp).toISOString(),
   updatedAt:stamp,source:'student_grammar_written',form:'typed_sentence',answerLength:String(answerText||'').length
 }};
 state.lastRecordId=id;db.quizUpdatedAt=stamp;save();
}
function updateConfidence(value){
 const q=state.set[state.index],r=rec(q.id);r.confidence=value;r[value]=(r[value]||0)+1;
 const entry=db.trust?.answers?.[state.lastRecordId];if(entry){db.trust.answers={...db.trust.answers,[state.lastRecordId]:{...entry,confidence:value,updatedAt:Date.now()}}}
 save();
}
function drawQuestion(){
 const q=state.set[state.index];state.answered=false;state.help=false;state.lastRecordId=null;
 screen.replaceChildren();screen.appendChild(backButton(()=>lecture(state.topic)));
 title(screen,label[state.topic]+'｜自力で英文を書く',(state.index+1)+' / '+state.set.length+'問　難度L'+q.level+'/5（設計上の目安）');
 screen.appendChild(make('div',q.prompt,'ts-grammar-prompt'));
 const lbl=make('label','英文を全文入力してください','ts-grammar-label');lbl.setAttribute('for','ts-grammar-answer');
 const input=make('textarea');input.id='ts-grammar-answer';input.rows=3;input.spellcheck=false;
 input.placeholder='ここに英文を入力。句読点や大文字小文字は採点対象外。';
 screen.append(lbl,input);
 const helpArea=make('div',null,'ts-grammar-help');
 const controls=make('div',null,'ts-grammar-controls');
 const hint=make('button','ヒントを表示','ts-grammar-secondary');hint.type='button';hint.onclick=()=>{
  state.help=true;helpArea.replaceChildren(make('p',q.hint));hint.disabled=true;
 };
 const check=make('button','自分の英文を判定する','ts-grammar-primary');check.type='button';
 const reveal=make('button','模範解答を見る（自力正解には加算しない）','ts-grammar-secondary');reveal.type='button';
 const feedbackBox=make('div',null,'ts-grammar-feedback');feedbackBox.hidden=true;
 function finish(ok,help,answerText){
  if(state.answered)return;state.answered=true;
  record(q,ok,help,answerText);
  check.disabled=true;reveal.disabled=true;hint.disabled=true;input.disabled=true;
  feedbackBox.hidden=false;
  feedbackBox.replaceChildren(make('strong',ok?'○ 一致しています。':'△ もう一度、仕組みを確認しよう。'),
    make('p','模範解答：'+q.answers[0],'ts-grammar-model'),
    make('p',q.why,'ts-grammar-reason'),
    make('p',ok?'正解でも、なぜこの形かを声に出して説明しよう。':'模範解答を隠して、紙で一度書き直そう。','ts-grammar-guidance'));
  const assess=make('div',null,'ts-grammar-controls');
  const sure=make('button','理由まで説明できた','ts-grammar-secondary');sure.type='button';
  const again=make('button','まだ理解が不十分','ts-grammar-secondary');again.type='button';
  sure.onclick=()=>{updateConfidence('sure');sure.disabled=true;again.disabled=true};
  again.onclick=()=>{updateConfidence('again');sure.disabled=true;again.disabled=true};
  assess.append(sure,again);feedbackBox.appendChild(assess);
  const next=make('button',state.index===state.set.length-1?'結果を見る':'次の問題へ','ts-grammar-primary');
  next.type='button';next.onclick=()=>{state.index++;if(state.index>=state.set.length)result();else drawQuestion()};
  feedbackBox.appendChild(next);
 }
 check.onclick=()=>{
  const a=input.value;if(!a||!a.trim()){helpArea.replaceChildren(make('p','英文を入力してから判定してください。'));return}
  finish(accepted(q,a),state.help?'hint':'self',a);
 };
 reveal.onclick=()=>finish(false,'copied','');
 controls.append(check,hint,reveal);screen.append(controls,helpArea,feedbackBox);
 show(screen.id);
}
function result(){
 state.phase='result';screen.replaceChildren();screen.appendChild(backButton(menu));
 const n=state.set.length;
 title(screen,'英文法トレーニング結果',state.correct+' / '+n+'問（入力文の形式一致。理由説明の自己評価は別）');
 screen.appendChild(make('p','自分で全文を書き、主語・時制・助動詞と動詞の形を説明できることが目標です。選択式の正解とは区別して記録しています。','ts-grammar-info'));
 if(state.missed.length){
  screen.appendChild(make('h3','解き直したい問題 '+state.missed.length+'問'));
  for(const q of state.missed.slice(0,10)){
   const d=make('div',null,'ts-grammar-review');
   d.appendChild(make('strong',q.kind+'：'+q.prompt));
   d.appendChild(make('p',q.answers[0]));screen.appendChild(d);
  }
 }
 const restart=make('button','同じ単元をもう一度10問','ts-grammar-primary');restart.type='button';restart.onclick=()=>start(state.topic,10,'balanced');
 const weak=make('button','不正解の多い問題を優先する','ts-grammar-secondary');weak.type='button';weak.onclick=()=>start(state.topic,10,'weak');
 screen.append(restart,weak);show(screen.id);
}
const style=make('style');
style.textContent='.ts-grammar-entry{border:1px solid #becfd0;background:#f4f8fb;border-radius:15px;padding:13px 15px;margin:12px 0}.ts-grammar-entry strong{font-size:16px}.ts-grammar-entry p,.ts-grammar-entry-count{font-size:12px;color:#3c4d59;line-height:1.65}.ts-grammar-entry-count{padding-top:7px}.ts-grammar-screen h2{font-size:21px;margin:9px 0}.ts-grammar-sub{font-size:13px;line-height:1.7;color:#394d58}.ts-grammar-info{font-size:12px;line-height:1.7;color:#3d5965}.ts-grammar-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:12px 0}.ts-grammar-topic{min-height:58px;padding:9px;font-size:13px;border:1px solid #bcced7;background:#fff;color:#1a435a;border-radius:10px}.ts-grammar-primary,.ts-grammar-secondary{width:100%;border-radius:10px;min-height:45px;padding:9px 12px;margin-top:9px;font-weight:700}.ts-grammar-primary{border:0;background:#1d597c;color:#fff}.ts-grammar-secondary{border:1px solid #9aafb9;background:#fff;color:#20516a}.ts-grammar-lesson,.ts-grammar-feedback,.ts-grammar-review{border:1px solid #d5e0e8;background:#fff;padding:13px;border-radius:12px;margin:12px 0}.ts-grammar-lesson h3{font-size:15px;margin:0 0 9px}.ts-grammar-lesson p,.ts-grammar-feedback p,.ts-grammar-review p{font-size:14px;line-height:1.8;overflow-wrap:anywhere}.ts-grammar-example{white-space:pre-wrap;font-size:15px;background:#f0f5f8;padding:10px;border-radius:8px}.ts-grammar-select{margin:17px 0;padding:12px;border:1px solid #cbdadf;border-radius:10px}.ts-grammar-select select{display:block;padding:10px;margin-top:10px;width:100%}.ts-grammar-prompt{white-space:pre-wrap;line-height:1.85;background:#f2f7fa;padding:15px;border-radius:10px;font-size:16px;margin:14px 0}.ts-grammar-label{display:block;font-size:13px;font-weight:700;margin:10px 0 6px}.ts-grammar-screen textarea{width:100%;font-size:17px;line-height:1.6;padding:12px;border:1px solid #a6b9c5;border-radius:9px;background:#fff;color:#122637}.ts-grammar-feedback{border-left:4px solid #317394}.ts-grammar-model{font-weight:700}.ts-grammar-controls{display:flex;gap:8px;flex-wrap:wrap}.ts-grammar-controls button{flex:1 1 180px}.ts-grammar-help p{padding:9px;background:#fbf5e7;font-size:13px}.ts-grammar-review strong{font-size:13px}@media(max-width:420px){.ts-grammar-grid{grid-template-columns:1fr}.ts-grammar-controls button{flex:1 1 100%}}';
document.head.appendChild(style);
root.TakumiEnglishStructureLab={menu,lecture,start,select,accepted,bank,version:'3.13.0'};
refresh();
})(window);