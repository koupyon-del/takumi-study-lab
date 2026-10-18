/* Takumi Study Lab v1.3 — trust levels and evidence journal. */
(function(){
'use strict';
let active=null,help='',confidence='',cacheRef=null,cache=null,n=0;
function store(){
 if(!db.trust||typeof db.trust!=='object')db.trust={schema:1,answers:{},paper:{}};
 db.trust.answers=db.trust.answers||{};
 db.trust.paper=db.trust.paper||{};
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
 let p=q.star*13+(x.seen?Math.max(0,26-x.good*6)+x.wrong*18:48);
 if(x.self===0)p+=25;
 if(x.lastConfidence==='again')p+=30;else if(x.lastConfidence==='maybe')p+=15;
 if(g==='weak')p+=52;else if(g==='maybe')p+=29;else if(g==='good')p-=12;
 if(g==='good'&&x.good>=2&&x.days.size>=2)p-=40;
 return p+Math.random()*10;
}
/* A new app response is provisional; mark assistance before moving on. */
const baseAnswer=answer;
answer=function(index,button){
 if(state.locked)return;
 const q=state.set?.[state.i];if(!q)return;
 active={questionId:q.id,cat:state.cat,unit:q.u,ok:index===state.correctIndex,session:state.session};
 help='';confidence='';
 baseAnswer(index,button);
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
  };
  row.appendChild(b);
 }
 box.appendChild(row);
 box.appendChild(make('p','この回答は本人申告です。紙の答案を確認した評価とは区別します。','legend'));
};
const baseConfidence=setConfidence;
setConfidence=function(v,b){baseConfidence(v,b);if(active)confidence=v};
const baseNext=nextQ;
nextQ=function(){
 if(active){
  if(!confidence){alert('今回の自信度を選んでください。');return}
  if(!help){alert('「自力・ヒント後・答えを見た」から選んでください。');return}
  const ev={id:Date.now()+'-'+(++n)+'-'+Math.random().toString(36).slice(2),
   questionId:active.questionId,cat:active.cat,unit:active.unit,ok:active.ok,
   session:active.session,help,confidence,at:new Date().toISOString(),source:'student_self_report'};
  const t=store();t.answers={...t.answers,[ev.id]:ev};cacheRef=null;save();
  active=null;help='';confidence='';
 }
 baseNext();
};


function markPaper(cat,u,g,sourceDate,source){
 if(!['good','maybe','weak'].includes(g))return;
 const t=store(),now=Date.now();
 (t.paper[cat]||(t.paper[cat]={}))[u]={grade:g,sourceDate,source,verifiedAt:now};
 db.paper[cat]=db.paper[cat]||{};db.paperUpdated=db.paperUpdated||{};
 db.paperUpdated[cat]=db.paperUpdated[cat]||{};
 db.paper[cat][u]=g;db.paperUpdated[cat][u]=now;
}
setPaper=function(cat,u,g){
 if(!confirm('この紙答案を保護者が確認した結果として登録しますか？\n過去の不確かなアプリ正答率は根拠にしないでください。'))return;
 markPaper(cat,u,g,new Date().toISOString().slice(0,10),'manual_parent');save();renderPaper();updateStats();
};
importPaper=function(ev){
 const f=ev.target.files?.[0];if(!f)return;
 const rd=new FileReader();
 rd.onload=()=>{
  try{
   const x=JSON.parse(rd.result),list=[],ref=x.subjects||x.results||{};
   const grades={'○':'good','△':'maybe','×':'weak',O:'good',A:'maybe',X:'weak',good:'good',maybe:'maybe',weak:'weak'};
   for(const [cat,vals] of Object.entries(ref)){
    if(!data[cat]||!vals||typeof vals!=='object')continue;
    const valid=new Set(data[cat].map(q=>q.u));
    for(const [u,value] of Object.entries(vals)){
     const v=typeof value==='string'?value:value?.grade;
     if(valid.has(u)&&grades[v])list.push([cat,u,grades[v]]);
    }
   }
   if(!list.length){alert('一致する単元評価がありません。');return}
   const suggested=String(x.sourceDate||x.date||x.gradedAt||'').slice(0,10)||new Date().toISOString().slice(0,10);
   const date=prompt('紙課題を実施した日を入力してください（YYYY-MM-DD）',suggested);
   if(!date||!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date+'T00:00:00'))){alert('日付の確認ができず登録を中止しました。');return}
   if(!confirm(date+'の紙課題 '+list.length+'単元は、保護者が答案を確認し、自力で取り組んだ結果ですか？\n古い不確かな評価は登録しないでください。'))return;
   for(const [cat,u,g] of list)markPaper(cat,u,g,date,'verified_paper_import');
   save();renderPaper();updateStats();alert('確認済み紙教材 '+list.length+'単元を登録しました。');
  }catch(e){alert('JSONを読み込めませんでした：'+String(e.message||e))}
  finally{ev.target.value=''}
 };
 rd.onerror=()=>{alert('ファイルを読み込めませんでした');ev.target.value=''};
 rd.readAsText(f,'utf-8');
};
const oldOpenPaper=openPaper;
openPaper=function(cat){oldOpenPaper(cat);const info=document.getElementById('trust-paper-info');if(info)info.textContent='過去の紙評価は参考記録として保存されています。この画面の○△×は、保護者が確認して登録したものだけです。10/17・10/18の結果はJSONを再取り込みするか、答案を見ながら再評価してください。'};


function statFor(cat,unit){
 const qs=(data[cat]||[]).filter(q=>unit===undefined||q.u===unit);
 let seen=0,correct=0,attempts=0,mas=0,again=0,maybe=0;
 for(const q of qs){
  const x=score(q.id);if(x.seen)seen++;
  correct+=x.correct;attempts+=x.seen;
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
 const s=document.getElementById('trust-status');if(s)s.textContent=summary();
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
   if(!a.length&&!paper)continue;
   const grades={good:'○',maybe:'△',weak:'×'};
   lines.push('・'+u+'：自力申告'+ok.length+'件（正答'+ok.filter(e=>e.ok).length+'件）、ヒント後'+a.filter(e=>e.help==='hint').length+'件、答え見た'+a.filter(e=>e.help==='copied').length+'件、確認済み紙'+(grades[paper?.grade]||'—')+(paper?' ['+paper.sourceDate+']':''));
  }
  lines.push('');
 }
 lines.push('【判定ルール】本人申告の正解は暫定。保護者確認済み紙課題を優先。過去のアプリ正答率は信用しない。');
 return lines.join('\n');
}
buildReport=trustedReport;
function refresh(){cacheRef=null;updateStats();window.TakumiCurriculum?.drawCards?.()}


const css=make('style');
css.textContent='.trust-info{background:#fff;border-radius:15px;margin:12px 0;padding:15px}.trust-info h3{font-size:16px;margin:0 0 8px}.trust-help{border-top:1px solid #ddd;margin-top:12px;padding-top:12px}.trust-help h3{margin:0 0 9px;font-size:14px}.trust-help-row{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.trust-help-row button{padding:10px 4px;font-size:12px}.trust-help-row button.trust-on{background:#171717;color:#fff}#trust-paper-info{background:#fff;padding:12px;border-radius:10px;margin:10px 0}';
document.head.appendChild(css);
const info=make('section',undefined,'trust-info');
info.appendChild(make('h3','🔎 信頼できる記録で再評価'));
const countLabel=make('p',undefined,'legend');countLabel.id='trust-status';info.appendChild(countLabel);
info.appendChild(make('p','旧アプリ正答率は学力評価に使用しません。新しい回答は「自力・ヒント後・答えを見た」を記録します。自力申告も未検証のため、紙の答案で確認します。','legend'));
const guide=make('button','10月17日・18日の紙評価を登録する方法','secondary');
guide.onclick=()=>alert('「📝 紙教材」で10/17・10/18の採点結果JSONを再読み込み、日付と保護者確認を行ってください。これまでの紙評価を自動的に信頼済みにすることはありません。');
info.appendChild(guide);
document.getElementById('home')?.querySelector('.hero')?.after(info);
const notice=make('p',undefined,'legend');notice.id='trust-paper-info';
const paperScreen=document.getElementById('paper');
if(paperScreen)paperScreen.insertBefore(notice,paperScreen.querySelector('input[type=file]')||paperScreen.firstChild);

/* EXTENSION_POINT */
window.TakumiTrust={store,grade,score,priority,confirmed,refresh,summary,report:trustedReport};
refresh();
})();