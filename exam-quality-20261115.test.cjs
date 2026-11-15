'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const cats=['math','english','science','history','geography','japanese'];
const sample=cat=>({id:'OLD-'+cat,u:cat==='history'?'鎌倉幕府':cat==='geography'?'アフリカ':cat==='science'?'人体のつくり':'文法',q:'旧基礎問題 '+cat,c:['A','B','C','D'],a:0,star:1,e:'説明'});
const data=Object.fromEntries(cats.map(c=>[c,Array.from({length:12},(_,i)=>({...sample(c),id:sample(c).id+'-'+i,q:'旧基礎問題 '+c+' '+i}))]));
const context={data,window:{},console,Date,Math,Set,Map};
vm.createContext(context);
vm.runInContext(fs.readFileSync('exam-quality-bank-20261115.js','utf8'),context);
const declared=context.window.TakumiExamQualityBank;
assert.equal(declared.total,80);
assert.deepEqual(JSON.parse(JSON.stringify(declared.counts)),{history:20,geography:20,math:10,english:10,science:10,japanese:10});
const seenIds=new Set(),ban=/すべて|全て|完全|絶対|必ず|一切|だけ|しか|ゼロ|全面|禁止|全員|どの国も|どこにも/;
for(const cat of cats){
 const curated=data[cat].filter(q=>q.examQuality==='mi2026-2nd-final');
 assert.equal(curated.length,declared.counts[cat],cat+' count');
 for(const q of curated){
  assert.ok(!seenIds.has(q.id),'Duplicate identifier '+q.id);seenIds.add(q.id);
  assert.ok(q.q&&q.e&&q.u,'Stem, explanation and curriculum unit required: '+q.id);
  assert.equal(q.c.length,4,'Four options '+q.id);
  assert.equal(new Set(q.c).size,4,'Unique choices '+q.id);
  assert.equal(q.a,0,'Correct option explicitly keyed '+q.id);
  assert.ok(q.level>=3&&q.level<=5,'Not a foundation-only question '+q.id);
  q.c.slice(1).forEach(x=>assert.doesNotMatch(x,ban,'Conspicuous distractor '+q.id));
 }
}
const html=fs.readFileSync('index.html','utf8');
assert.ok(html.includes('exam-quality-bank-20261115.js?v=1'));
assert.ok(html.includes('exam-quality-router-20261115.js?v=1'));
assert.ok(html.indexOf('exam-quality-bank-20261115.js')<html.indexOf('quality-v1.js'),'Bank must precede duplicate-quality indexing');
assert.ok(html.indexOf('exam-quality-router-20261115.js')>html.indexOf('adaptive-learning-v1.js'),'Router must follow adaptive mode');
const curriculum=fs.readFileSync('curriculum-v1.js','utf8');
for(const u of ['比例・反比例','三角形・四角形','過去形','人体のつくり','モンゴルと東アジア','室町時代','戦国大名','アフリカ','ヨーロッパ'])
 assert.ok(curriculum.includes("['"+u+"','授業','now']")||curriculum.includes("['"+u+"','基礎','now']"),'Current exam unit not accessible: '+u);
Object.assign(context,{
 db:{q:{},sessions:0},
 state:{cat:'',set:[],i:0,score:0,locked:false,session:0},
 document:{querySelector:()=>null,getElementById:()=>null},
 save:()=>{},show:()=>{},render:()=>{},alert:()=>{},
 selectSet:(cat,n)=>data[cat].slice(0,n),
 start:()=>{},repeatQuiz:()=>{}
});
context.window.TakumiQuality={select:(cat,n,raw)=>raw.slice(0,n),refresh:()=>{}};
context.window.TakumiCurriculum={mode:()=> 'mi',isAllowed:()=>true,refresh:()=>{}};
context.window.TakumiTrust={score:()=>({self:0,wrong:0}),grade:()=>''};
vm.runInContext(fs.readFileSync('exam-quality-router-20261115.js','utf8'),context);
const audit=context.window.TakumiExamQuality20261115.audit();
assert.equal(audit.errors.length,0,'No malformed/duplicate curated items');
for(const cat of cats){
 const picked=context.selectSet(cat,10);
 assert.equal(picked.length,10,cat+' normal count');
 assert.equal(new Set(picked.map(q=>q.id)).size,10,cat+' normal uniqueness');
 const required=['history','geography'].includes(cat)?10:7;
 assert.ok(picked.filter(q=>q.examQuality).length>=required,cat+' quality routing');
 const exam=context.window.TakumiQuality.select(cat,10,data[cat],'exam');
 assert.equal(exam.length,10,cat+' exam count');
 assert.ok(exam.filter(q=>q.examQuality).length>=Math.min(8,required),cat+' exam quality');
 context.window.TakumiExamQuality20261115.start(cat);
 assert.equal(context.state.set.length,10,cat+' quick practice count');
 assert.equal(context.state.set.filter(q=>q.examQuality).length,10,cat+' quick practice fully curated');
}
console.log('PASS: 80 MI final questions; plausible distinct distractors; exam and MI selectors; quick 10-question practice for six subjects');