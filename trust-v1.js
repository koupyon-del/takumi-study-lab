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

/* EXTENSION_POINT */
window.TakumiTrust={store,grade,score,priority,confirmed};
})();