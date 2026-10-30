'use strict';
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const bridge=require('./paper-link-v1.js');
const original={schema:'takumi-study-lab-paper-v1',sourceDate:'2026-10-30',title:'紙教材採点',
 subjects:{math:{'連立方程式':'×','1次不等式':'△'},english:{'三単現':'○'}}};
assert.deepEqual(bridge.decode(bridge.encode(original)),original,'Japanese grade payload must round-trip');
assert.throws(()=>bridge.decode('../bad token'),/形式/);
assert.throws(()=>bridge.decode('A'.repeat(17000)),/形式/);
const categoryData={
 math:[{id:'M1',u:'連立方程式',star:3},{id:'M2',u:'1次不等式',star:3}],
 english:[{id:'E1',u:'三単現',star:3}]
};
const paper={
 insertBefore(){},querySelector(){return null;},classList:{contains(){return false}}
};
let saves=0;
const context={
 window:{TakumiCurriculum:{drawCards(){},refresh(){}},TakumiStorageWarningShown:false},
 document:{createElement(tag){return {tag,textContent:'',appendChild(){},className:''}},
   head:{appendChild(){}},getElementById(id){return id==='paper'?paper:null}},
 data:categoryData,
 db:{q:{},played:0,paper:{},paperUpdated:{},trust:{answers:{},paper:{},paperEvents:{}}},
 rec(){return {}},
 mastered(){return false},
 answer(){},setConfidence(){},nextQ(){},openPaper(){},setPaper(){},importPaper(){},
 paperGrade(){return ''},
 save(){saves++},updateStats(){},renderPaper(){},
 played:{textContent:''},rate:{textContent:''},labels:{math:'数学',english:'英語'},
 confirm(){return true},alert(){},prompt(){return '2026-10-30'},
 console,Date,Math,Object,Set,WeakMap,JSON,Number,String
};
vm.runInNewContext(fs.readFileSync('./trust-v1.js','utf8'),context,{timeout:2000});
const api=context.window.TakumiTrust;
const normalized=api.validatePaperPayload(original);
assert.equal(normalized.items.length,3);
let out=api.importVerifiedPaperPayload(original);
assert.equal(out.added,3);
assert.equal(saves,1);
assert.equal(context.db.trust.paper.math['連立方程式'].grade,'weak');
assert.equal(context.db.trust.paper.english['三単現'].grade,'good');
out=api.importVerifiedPaperPayload(original);
assert.equal(out.added,0,'reopening the same link cannot create duplicate evidence');
assert.equal(saves,1,'duplicate must not request another cloud save');
assert.equal(Object.keys(context.db.trust.paperEvents).length,3);
const prior={schema:original.schema,sourceDate:'2026-10-28',subjects:{math:{'連立方程式':'○'}}};
out=api.importVerifiedPaperPayload(prior);
assert.equal(out.added,1,'older grades retained as dated evidence');
assert.equal(context.db.trust.paper.math['連立方程式'].grade,'weak','older results may not override newer verified grade');
assert.equal(context.db.trust.paper.math['連立方程式'].sourceDate,'2026-10-30');
assert.throws(()=>api.validatePaperPayload({...original,sourceDate:'2026-02-30'}),/実施日/);
assert.throws(()=>api.validatePaperPayload({...original,schema:'unexpected'}),/未対応/);
assert.throws(()=>api.validatePaperPayload({...original,subjects:{english:{'non-existing':'○'}}}),/単元名/);
assert.throws(()=>api.validatePaperPayload({...original,subjects:{math:{'連立方程式':'◎'}}}),/評価/);
const corrected={...original,subjects:{math:{'連立方程式':'△'}}};
out=api.importVerifiedPaperPayload(corrected);
assert.equal(out.added,1);
assert.equal(context.db.trust.paper.math['連立方程式'].grade,'maybe');
console.log('PASS: Japanese direct-link codec, strict input, dated paper grades, deduplication');
