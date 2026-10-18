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
/* EXTENSION_POINT */
window.TakumiTrust={store,grade,score,priority,confirmed};
})();