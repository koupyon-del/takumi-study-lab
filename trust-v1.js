/* Takumi Study Lab v1.3 — trust levels and evidence journal. */
(function(){
'use strict';
let active=null,help='',confidence='',cacheRef=null,cache=null,n=0;
function store(){
 if(!db.trust||typeof db.trust!=='object')db.trust={schema:1,answers:{},paper:{}};
 db.trust.answers=db.trust.answers||{};
 db.trust.paper=db.trust.paper||{};
 db.trust.paperEvents=db.trust.paperEvents||{};
 return db.trust;
}
function make(tag,value,cls){
 const e=document.createElement(tag);if(value!==undefined)e.textContent=value;
 if(cls)e.className=cls;return e;
}
const unitOf={};
for(const [cat,qs] of Object.entries(data))for(const q of qs)unitOf[q.id]={cat,u:q.u};
function values(){return Object.values(store().answers)}
function map(){
 const ref=store().answers;
 if(ref===cacheRef&&cache)return cache;
 const out={};
 for(const e of Object.values(ref)){
  if(!e?.questionId||!e.cat)continue;
  const k=e.questionId;
  const x=out[k]||(out[k]={seen:0,correct:0,wrong:0,self:0,good:0,days:new Set(),lastConfidence:''});
  x.seen++;if(e.ok)x.correct++;else x.wrong++;
  if(e.help==='self'){x.self++;if(e.ok){x.good++;x.days.add(String(e.at||'').slice(0,10))}}
  x.lastConfidence=e.confidence||'';
 }
 cacheRef=ref;cache=out;return out;
}
function score(id){return map()[id]||{seen:0,correct:0,wrong:0,self:0,good:0,days:new Set(),lastConfidence:''}}
const refs=new WeakMap(),oldRec=rec;
rec=function(id){const r=oldRec(id);if(r&&typeof r==='object')refs.set(r,id);return r};
function grade(cat,u){return store().paper?.[cat]?.[u]?.grade||''}
function confirmed(r){
 const id=refs.get(r),x=id&&unitOf[id];if(!x)return false;
 const s=score(id);return grade(x.cat,x.u)==='good'&&s.good>=2&&s.days.size>=2;
}
mastered=function(r){return confirmed(r)};
paperGrade=function(cat,u){return grade(cat,u)};
function priority(q,cat){
 const x=score(q.id),g=grade(cat,q.u);
 let p=q.star*13+(x.self?Math.max(0,30-x.good*6)+x.wrong*18:72);
 if(x.self===0&&x.seen)p+=12;
 if(x.lastConfidence==='again')p+=30;else if(x.lastConfidence==='maybe')p+=15;
 if(g==='weak')p+=52;else if(g==='maybe')p+=29;else if(g==='good')p-=12;
 if(g==='good'&&x.good>=2&&x.days.size>=2)p-=40;
 return p+Math.random()*10;
}
/* Store every selected answer immediately as provisional, then refine the SAME
   event when assistance/confidence is marked. Never infer independent mastery. */
function saveActive(patch){
 if(!active?.recordId)return;
 const t=store(),previous=t.answers[active.recordId]||{};
 const updated={...previous,...patch,updatedAt:Date.now()};
 t.answers={...t.answers,[active.recordId]:updated};
 cacheRef=null;
 save();
}
const baseAnswer=answer;
answer=function(index,button){
 if(state.locked)return;
 const q=state.set?.[state.i];if(!q)return;
 active={questionId:q.id,cat:state.cat,unit:q.u,ok:index===state.correctIndex,
  session:state.session,recordId:Date.now()+'-'+(++n)+'-'+Math.random().toString(36).slice(2)};
 help='';confidence='';
 baseAnswer(index,button);
 // Pending is NOT a self-reported success or a confirmed result.
 saveActive({id:active.recordId,questionId:active.questionId,cat:active.cat,unit:active.unit,
  ok:active.ok,session:active.session,help:'pending',confidence:'',complete:false,
  at:new Date().toISOString(),source:'student_self_report'});
 let box=document.getElementById('trust-help');
 if(!box){box=make('div',undefined,'trust-help');box.id='trust-help';document.getElementById('confidence').appendChild(box)}
 box.innerHTML='';
 box.appendChild(make('h3','解き方の記録（必須）'));
 const row=make('div',undefined,'trust-help-row');
 for(const [v,label] of [['self','自力で解いた'],['hint','ヒント後'],['copied','答えを見た']]){
  const b=make('button',label,'secondary');
  b.type='button';b.onclick=()=>{
   help=v;for(const x of row.children)x.classList.remove('trust-on');
   b.classList.add('trust-on');
   saveActive({help:v});
  };
  row.appendChild(b);
 }
 box.appendChild(row);
 box.appendChild(make('p','この回答は本人申告です。紙の答案を確認した評価とは区別します。','legend'));
};
const baseConfidence=setConfidence;
setConfidence=function(v,b){
 baseConfidence(v,b);
 if(active){confidence=v;saveActive({confidence:v})}
};
const baseNext=nextQ;
nextQ=function(){
 if(active){
  if(!confidence){alert('今回の自信度を選んでください。');return}
  if(!help){alert('「自力・ヒント後・答えを見た」から選んでください。');return}
  saveActive({help:help,confidence:confidence,complete:true});
  active=null;help='';confidence='';
 }
 baseNext();
};


const verifiedPaperGrades={'○':'good','△':'maybe','×':'weak',O:'good',A:'maybe',X:'weak',good:'good',maybe:'maybe',weak:'weak'};
function validPaperDate(s){
 if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;
 const d=new Date(s+'T00:00:00Z');
 return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===s;
}
/* The same strict validation is used for file imports and link imports.
   Never silently throw away a subject or an unknown unit. */
function validatePaperPayload(payload){
 if(!payload||typeof payload!=='object'||Array.isArray(payload))throw Error('紙教材のデータ形式が正しくありません。');
 if(payload.schema&&payload.schema!=='takumi-study-lab-paper-v1')throw Error('未対応の紙教材データ形式です。');
 const sourceDate=payload.sourceDate||payload.date||payload.gradedAt;
 if(!validPaperDate(sourceDate))throw Error('実施日が正しいYYYY-MM-DD形式ではありません。');
 if(sourceDate>new Date(Date.now()+86400000).toISOString().slice(0,10))throw Error('実施日が未来の日付です。');
 const ref=payload.subjects||payload.results;
 if(!ref||typeof ref!=='object'||Array.isArray(ref))throw Error('教科別の採点結果がありません。');
 const items=[];
 for(const [cat,vals] of Object.entries(ref)){
  if(!Object.prototype.hasOwnProperty.call(data,cat))throw Error('未対応の教科：'+cat);
  if(!vals||typeof vals!=='object'||Array.isArray(vals))throw Error('教科別の評価形式が不正です：'+cat);
  const known=new Set(data[cat].map(q=>q.u));
  for(const [unit,value] of Object.entries(vals)){
   if(!known.has(unit))throw Error('アプリの単元名と一致しません：'+cat+'／'+unit);
   const raw=typeof value==='string'?value:value?.grade;
   const grade=verifiedPaperGrades[raw];
   if(!grade)throw Error('評価は○・△・×のいずれかにしてください：'+unit);
   items.push({cat,unit,grade});
   if(items.length>100)throw Error('一度に登録できる評価は100件までです。');
  }
 }
 if(!items.length)throw Error('取り込める単元評価がありません。');
 items.sort((a,b)=>(a.cat+'/'+a.unit).localeCompare(b.cat+'/'+b.unit,'ja'));
 return {sourceDate,title:String(payload.title||'紙教材の採点結果').slice(0,100),items};
}
function verifiedPaperBatchId(parsed){
 const s=JSON.stringify({sourceDate:parsed.sourceDate,items:parsed.items});
 let a=2166136261,b=0x811c9dc7;
 for(let i=0;i<s.length;i++){const n=s.charCodeAt(i);a=Math.imul(a^n,16777619);b=Math.imul(b^(n+i),2246822519)}
 return (a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');
}
function markPaper(cat,u,g,sourceDate,source,eventId){
 if(!['good','maybe','weak'].includes(g))return false;
 const t=store(),now=Date.now();
 const id=eventId||now+'-P'+(++n)+'-'+Math.random().toString(36).slice(2);
 if(Object.prototype.hasOwnProperty.call(t.paperEvents,id))return false;
 const event={id,cat,unit:u,grade:g,sourceDate,source,verifiedAt:now};
 t.paperEvents={...t.paperEvents,[id]:event};
 const old=t.paper[cat]?.[u];
 if(!old||sourceDate>=String(old.sourceDate||'')){
  (t.paper[cat]||(t.paper[cat]={}))[u]={grade:g,sourceDate,source,verifiedAt:now};
  db.paper[cat]=db.paper[cat]||{};db.paperUpdated=db.paperUpdated||{};
  db.paperUpdated[cat]=db.paperUpdated[cat]||{};
  db.paper[cat][u]=g;db.paperUpdated[cat][u]=now;
 }
 return true;
}
function importVerifiedPaperPayload(payload,source='verified_paper_link'){
 const parsed=validatePaperPayload(payload),batch=verifiedPaperBatchId(parsed);
 let added=0;
 for(const {cat,unit,grade} of parsed.items){
  const eventId='paper-batch:'+batch+':'+cat+':'+unit;
  if(markPaper(cat,unit,grade,parsed.sourceDate,source,eventId))added++;
 }
 if(added){save();if(document.getElementById('paper')?.classList.contains('active'))renderPaper();refresh();window.TakumiCurriculum?.refresh?.()}
 return {...parsed,added,duplicates:parsed.items.length-added,batchId:batch};
}
setPaper=function(cat,u,g){
 if(!confirm('この紙答案を保護者が確認した結果として登録しますか？\n過去の不確かなアプリ正答率は根拠にしないでください。'))return;
 markPaper(cat,u,g,new Date().toISOString().slice(0,10),'manual_parent');save();renderPaper();refresh();
};
importPaper=function(ev){
 const f=ev.target.files?.[0];if(!f)return;
 const rd=new FileReader();
 rd.onload=()=>{
  try{
   const x=JSON.parse(rd.result),parsed=validatePaperPayload(x);
   const date=prompt('紙課題を実施した日を入力してください（YYYY-MM-DD）',parsed.sourceDate);
   if(date===null)return;
   const checked=validatePaperPayload({...x,sourceDate:date});
   if(!confirm(checked.sourceDate+'の紙課題 '+checked.items.length+'単元は、保護者が答案を確認し、自力で取り組んだ結果ですか？\n古い不確かな評価は登録しないでください。'))return;
   const out=importVerifiedPaperPayload({...x,sourceDate:date},'verified_paper_import');
   alert(out.added?'確認済み紙教材 '+out.added+'単元を登録しました。'+(out.duplicates?'（登録済み'+out.duplicates+'単元）':''):'この紙教材は登録済みです。重複登録はしていません。');
  }catch(e){alert('JSONを読み込めませんでした：'+String(e.message||e))}
  finally{ev.target.value=''}
 };
 rd.onerror=()=>{alert('ファイルを読み込めませんでした');ev.target.value=''};
 rd.readAsText(f,'utf-8');
};
const oldOpenPaper=openPaper;
openPaper=function(cat){oldOpenPaper(cat);const info=document.getElementById('trust-paper-info');if(info)info.textContent='過去の紙評価は参考記録として保存されています。この画面の○△×は、保護者が確認して登録したものだけです。'};


function statFor(cat,unit){
 const qs=(data[cat]||[]).filter(q=>unit===undefined||q.u===unit);
 let seen=0,correct=0,attempts=0,mas=0,again=0,maybe=0;
 for(const q of qs){
  const x=score(q.id);if(x.self)seen++;
  correct+=x.good;attempts+=x.self;
  if(confirmed(rec(q.id)))mas++;
  if(x.lastConfidence==='again')again++;
  if(x.lastConfidence==='maybe')maybe++;
 }
 return {total:qs.length,seen,correct,attempts,mastered:mas,again,maybe,rate:attempts?correct/attempts:0};
}
subjectStat=function(cat){return statFor(cat)};
unitStat=function(cat,u){return statFor(cat,u)};
function evidenceCount(){return Object.values(store().paper).reduce((n,p)=>n+Object.keys(p||{}).length,0)}
function summary(){
 const a=values(),self=a.filter(e=>e.help==='self');
 return '新しい回答：'+a.length+'件（自力申告 '+self.length+'件）／保護者確認済み紙課題：'+evidenceCount()+'単元。これまでの回答 '+db.played+'件は履歴として保存中。';
}
updateStats=function(){
 const a=values().filter(e=>e.help==='self');
 played.textContent=db.played||0;
 rate.textContent=a.length?Math.round(a.filter(e=>e.ok).length/a.length*100)+'%':'—';
 let total=0;for(const qs of Object.values(data))for(const q of qs)if(confirmed(rec(q.id)))total++;
 mastered.textContent=total;
 const labelsOnHome=document.getElementById('home')?.querySelectorAll('.stat .small');
 if(labelsOnHome?.length===3){
  labelsOnHome[0].textContent='回答履歴（過去分含む）';
  labelsOnHome[1].textContent='自力正答率（本人申告）';
  labelsOnHome[2].textContent='確認済み定着問題';
 }
};
function trustedReport(){
 const journal=values(),lines=[
  '【巧澄 Study Lab v1.3 信頼性別学習レポート】',
  '集計日：'+new Date().toLocaleString('ja-JP'),
  '注意：以前のアプリ回答は答えを写した可能性があるため、学力評価には含めない。',
  '回答履歴の累計（参考のみ）：'+db.played,
  'v1.3以降に解いた回答（本人申告）：'+journal.length,
  '自力：'+journal.filter(e=>e.help==='self').length+'、ヒント後：'+journal.filter(e=>e.help==='hint').length+'、答えを見た：'+journal.filter(e=>e.help==='copied').length,''
 ];
 for(const cat of ['math','english','japanese','science','history','geography','waka']){
  const subject=journal.filter(e=>e.cat===cat),self=subject.filter(e=>e.help==='self');
  lines.push('■'+labels[cat]+'：新規回答'+subject.length+'／自力申告'+self.length+'／自力正答率'+(self.length?Math.round(self.filter(e=>e.ok).length/self.length*100)+'%':'未測定'));
  for(const u of new Set((data[cat]||[]).map(q=>q.u))){
   const a=subject.filter(e=>e.unit===u),ok=a.filter(e=>e.help==='self'),paper=store().paper[cat]?.[u];
   const events=Object.values(store().paperEvents||{}).filter(e=>e.cat===cat&&e.unit===u);
   if(!a.length&&!paper&&!events.length)continue;
   const grades={good:'○',maybe:'△',weak:'×'};
   lines.push('・'+u+'：自力申告'+ok.length+'件（正答'+ok.filter(e=>e.ok).length+'件）、ヒント後'+a.filter(e=>e.help==='hint').length+'件、答え見た'+a.filter(e=>e.help==='copied').length+'件、確認済み紙'+(grades[paper?.grade]||'—')+(paper?' ['+paper.sourceDate+']':'')+(events.length?'／紙課題日：'+[...new Set(events.map(e=>e.sourceDate))].sort().join('・'):'') );
  }
  lines.push('');
 }
 lines.push('【判定ルール】本人申告の正解は暫定。保護者確認済み紙課題を優先。過去のアプリ正答率は信用しない。');
 return lines.join('\n');
}
buildReport=trustedReport;
function refresh(){cacheRef=null;updateStats();window.TakumiCurriculum?.drawCards?.()}


const css=make('style');
css.textContent='.trust-help{border-top:1px solid #ddd;margin-top:12px;padding-top:12px}.trust-help h3{margin:0 0 9px;font-size:14px}.trust-help-row{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.trust-help-row button{padding:10px 4px;font-size:12px}.trust-help-row button.trust-on{background:#171717;color:#fff}#trust-paper-info{background:#fff;padding:12px;border-radius:10px;margin:10px 0}';
document.head.appendChild(css);
const notice=make('p',undefined,'legend');notice.id='trust-paper-info';
const paperScreen=document.getElementById('paper');
if(paperScreen)paperScreen.insertBefore(notice,paperScreen.querySelector('input[type=file]')||paperScreen.firstChild);

/* EXTENSION_POINT */
window.TakumiTrust={store,grade,score,priority,confirmed,refresh,summary,report:trustedReport,validatePaperPayload,importVerifiedPaperPayload};
refresh();
})();