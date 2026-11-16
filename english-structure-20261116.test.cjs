'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
assert.match(html,/Study Lab v3\.13\.0/);
const bankName='english-structure-bank-20261116.js',uiName='english-structure-lab-v1.js';
const indexScripts=[...html.matchAll(/<script src="([^"]+\.js)(?:\?[^"]*)?"><\/script>/g)].map(x=>x[1]);
assert.ok(indexScripts.indexOf(bankName)>indexScripts.indexOf('exam-quality-bank-20261115.js'));
assert.ok(indexScripts.indexOf(bankName)<indexScripts.indexOf('trust-v1.js'));
assert.ok(indexScripts.indexOf(uiName)>indexScripts.indexOf('request-deck-v1.js'));
const data={english:[]},w={};
const bankCode=fs.readFileSync(bankName,'utf8');
vm.runInNewContext(bankCode,{data,window:w,Date,Math,Set});
const bank=w.TakumiEnglishStructureBank;
assert.ok(bank);
assert.equal(bank.items.length,234,'Enough free-writing and reasoning tasks');
assert.equal(bank.choices.length,60,'Enough four-option drills in regular English');
assert.equal(bank.lectures.length,8,'Eight structured lessons');
assert.equal(new Set(bank.items.map(x=>x.id)).size,234);
assert.equal(new Set(bank.choices.map(x=>x.id)).size,60);
const validTopics=Object.keys(bank.topics);
for(const task of bank.items){
 assert.ok(validTopics.includes(task.topic),task.id+' topic');
 assert.ok(task.prompt&&task.why.length>30&&task.hint.length>5,task.id+' complete explanation/hint');
 assert.ok(task.answers.length>=1&&task.answers.every(x=>typeof x==='string'&&x.length>=2),task.id+' expected answer');
 assert.ok(task.level>=2&&task.level<=4,task.id+' difficulty');
}
for(const q of bank.choices){
 assert.equal(q.c.length,4,q.id);
 assert.equal(new Set(q.c.map(bank.normalize)).size,4,q.id+' unique candidates');
 assert.equal(q.a,0,q.id+' answer key');
 assert.ok(q.e.length>=25,q.id+' explanation');
 assert.ok(['過去形','現在進行形','疑問文・否定文'].includes(q.u),q.id+' in actual scope');
}
const errors=bank.items.filter(x=>x.topic==='repair');
assert.ok(errors.some(q=>q.prompt.includes('He does not play soccer last Sunday.')&&q.answers.includes('He did not play soccer last Sunday.')));
assert.ok(errors.some(q=>q.prompt.includes('Are they study English now?')&&q.answers.includes('Are they studying English now?')));
assert.ok(bank.items.some(q=>q.answers.includes('Did Ken read comic books yesterday?')));
assert.equal(bank.normalize("He didn't play soccer yesterday."),bank.normalize("He did not play soccer yesterday."));
class FakeElement{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.className='';this.textContent='';this.hidden=false;this.value='';
  this.classList={add:c=>this.className+=' '+c};}
 appendChild(child){this.children.push(child);return child}
 append(...children){this.children.push(...children)}
 replaceChildren(...children){this.children=[...children]}
 before(){}
 querySelector(){return null}
 setAttribute(k,v){this[k]=v}
}
const home=new FakeElement('section'),wrap=new FakeElement('div'),head=new FakeElement('head');
const document={getElementById:id=>id==='home'?home:id==='ts-grammar-entry'?null:null,
 querySelector:s=>s==='.wrap'?wrap:null,createElement:tag=>new FakeElement(tag),head};
const db={q:{},trust:{schema:1,answers:{},paper:{}},played:0,correct:0,sessions:0};
const saves=[];const rec=id=>db.q[id]||(db.q[id]={seen:0,correct:0,wrong:0,streak:0,last:0,sessions:[],confidence:''});
const context={window:w,document,data,db,rec,show:()=>{},save:()=>saves.push(db.played),Date,Math,console};
vm.runInNewContext(fs.readFileSync(uiName,'utf8'),context);
const lab=w.TakumiEnglishStructureLab;
assert.ok(lab,'UI exposed');
const find=(node,predicate)=>{
 if(predicate(node))return node;
 for(const child of node.children||[]){const got=find(child,predicate);if(got)return got;}
 return null;
};
lab.start('past',5);
const input=find(wrap,n=>n.tagName==='textarea');
const check=find(wrap,n=>String(n.textContent).includes('自分の英文を判定する'));
assert.ok(input&&check,'Typed input and check button');
const first=lab.select('past',5,'balanced')[0];
input.value=first.answers[0];
check.onclick();
assert.equal(db.played,1,'Existing progress counters updated');
assert.equal(db.correct,1);
assert.equal(Object.values(db.trust.answers).length,1);
const ev=Object.values(db.trust.answers)[0];
assert.equal(ev.help,'self');assert.equal(ev.ok,true);assert.equal(ev.form,'typed_sentence');
assert.equal(ev.complete,true);assert.equal(ev.cat,'english');
assert.ok(saves.length>0);
lab.start('repair',5);
const reveal=find(wrap,n=>String(n.textContent).includes('模範解答を見る'));
assert.ok(reveal);
reveal.onclick();
assert.equal(db.played,2);
const last=Object.values(db.trust.answers).at(-1);
assert.equal(last.help,'copied');assert.equal(last.ok,false);
console.log('PASS: 234 typed grammar tasks, 60 valid MC, 8 lectures, live input assessment and trusted progress');
