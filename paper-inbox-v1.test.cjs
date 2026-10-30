'use strict';
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const lib=require('./paper-inbox-v1.js');
assert.equal(lib.isMissingTable({code:'PGRST205'}),true);
assert.equal(lib.isMissingTable({code:'42501'}),false);
assert.deepEqual(lib.requiredEventIds({batchId:'abc',items:[{cat:'math',unit:'連立方程式'}]}),
 ['paper-batch:abc:math:連立方程式']);

const row=(id,review_status)=>({id,user_id:'test-user',batch_key:'batch-'+id,
 review_status,payload:{schema:'takumi-study-lab-paper-v1',sourceDate:'2026-10-30',
 title:'数学採点',subjects:{math:{'連立方程式':'×'}}},created_at:'2026-10-30T10:00:00Z'});
let remoteEvents={},queue=[row('a','parent_verified')],ack=[],imported=0,allowCloudSave=true;
const context={
 window:{
   document:{readyState:'loading',getElementById(){return null},addEventListener(){}},
   TakumiTrust:{
     validatePaperPayload(v){assert.equal(v.schema,'takumi-study-lab-paper-v1');return {
       title:v.title,sourceDate:v.sourceDate,items:[{cat:'math',unit:'連立方程式',grade:'weak'}]};},
     importVerifiedPaperPayload(){imported++;return {
       batchId:'batch-key',items:[{cat:'math',unit:'連立方程式',grade:'weak'}]};}
   },
   setTimeout(){},setInterval(){},addEventListener(){},confirm(){return true}
 },
 cloudUser:{id:'test-user'},cloudReady:true,
 sb:{
   from(table){assert.equal(table,'paper_evidence_inbox');
     let mode='read',change={};
     const query={
       select(){return this;},eq(){return this;},is(){return this;},order(){return this;},
       limit(){return Promise.resolve({data:queue,error:null});},
       update(p){mode='update';change=p;return this;},
       then(resolve,reject){if(mode==='update'){ack.push({...change});return resolve({data:null,error:null})}return reject(Error('invalid'));}
     };return query;
   }
 },
 cloudPush:async()=>{if(allowCloudSave)remoteEvents['paper-batch:batch-key:math:連立方程式']={id:'ack'}},
 cloudRead:async()=>({study_data:{trust:{paperEvents:remoteEvents}}}),
 openPaper(){},cloudLoadOrSeed:async()=>{},
 console,Date,Object,Boolean,String,Array,Promise
};
vm.runInNewContext(fs.readFileSync('./paper-inbox-v1.js','utf8'),context,{timeout:1000});
(async()=>{
 await context.window.TakumiPaperInbox.poll();
 assert.equal(imported,1,'parent verified evidence must be applied automatically');
 assert.equal(ack.length,1,'ack only after cloud-verified save');
 assert.ok(ack[0].applied_at,'ack includes timestamp');
 queue=[row('b','needs_parent_review')];
 await context.window.TakumiPaperInbox.poll();
 assert.equal(imported,1,'unverified grades must not be applied automatically');
 assert.equal(context.window.TakumiPaperInbox.pendingCount(),1);
 remoteEvents={};ack.length=0;queue=[row('c','parent_verified')];allowCloudSave=false;
 await context.window.TakumiPaperInbox.poll();
 assert.equal(ack.length,0,'failed cloud verification must leave inbox pending');
 console.log('PASS: auto-receive verified paper evidence, keep unverified pending, acknowledge only after cloud persistence');
})().catch(e=>{console.error(e);process.exitCode=1});
