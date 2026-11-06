'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

class FakeElement {
 constructor(tag='div'){
  this.tagName=tag;this.children=[];this.textContent='';this.className='';
  this.classList={add:(name)=>{this.className+=' '+name}};
 }
 appendChild(node){this.children.push(node);return node}
 append(...nodes){this.children.push(...nodes)}
 after(){}
 querySelector(sel){return sel==='.top'?this:null}
 replaceChildren(...nodes){this.children=[...nodes]}
 setAttribute(k,v){this[k]=v}
}
const home=new FakeElement('section');
const wrap=new FakeElement('div');
const alerts=[],opened=[],shown=[];
const deck={form:{},subjectPool:cat=>cat==='english'?[{u:'三単現'}]:cat==='science'?[{u:'気象・湿度'}]:[],open(){opened.push(['deck',{...this.form}])}};
const lessons={
 openLesson(id,origin){opened.push(['lesson',id,origin])},
 lessonList:[
  {id:'sub',title:'代入法｜なぜ式ごと置き換える？',group:'連立方程式',subject:'math'},
  {id:'sign',title:'符号と括弧｜−2(6−x)の意味',group:'連立方程式',subject:'math'}
 ]
};
const document={
 getElementById:id=>id==='home'?home:null,
 querySelector:s=>s==='.wrap'?wrap:null,
 createElement:tag=>new FakeElement(tag),
 head:new FakeElement('head')
};
const context={
 window:{TakumiVideoLessons:lessons,TakumiRequestDeck:deck},
 document,alert:msg=>alerts.push(msg),show:id=>shown.push(id),
 data:{math:[],english:[{u:'三単現'}],science:[{u:'気象・湿度'}]}
};
vm.runInNewContext(fs.readFileSync('paper-study-guide-v1.js','utf8'),context,{filename:'paper-study-guide-v1.js'});
const guide=context.window.TakumiPaperStudyGuide;
assert.ok(guide,'Paper navigator must be registered');
assert.equal(guide.tasks.length,4);
assert.notEqual(lessons.lessonList[0].title,guide.tasks[0].expected,'Regression: lecture display name differs from old paper name');
assert.notEqual(lessons.lessonList[1].title,guide.tasks[1].expected,'Regression: both paper lecture names differ');
for(const task of guide.tasks)assert.equal(guide.validate(task),'ok','All four paper routes must be available: '+task.printed);
guide.dispatch(guide.tasks[0]);guide.dispatch(guide.tasks[1]);
assert.deepEqual(opened.slice(0,2),[
 ['lesson','sub','ts-paper-study-screen'],['lesson','sign','ts-paper-study-screen']
]);
guide.dispatch(guide.tasks[2]);guide.dispatch(guide.tasks[3]);
assert.equal(opened[2][0],'deck');assert.equal(opened[2][1].cat,'english');assert.equal(opened[2][1].unit,'三単現');assert.equal(opened[2][1].count,5);
assert.equal(opened[3][0],'deck');assert.equal(opened[3][1].cat,'science');assert.equal(opened[3][1].unit,'気象・湿度');assert.equal(opened[3][1].count,5);
assert.equal(alerts.length,0,'No false missing-lecture errors');

guide.open();
assert.ok(shown.includes('ts-paper-study-screen'),'Navigator should open from the home entry');
assert.equal(guide.liveCatalog().some(t=>t.id==='sub'&&t.expected===guide.tasks[0].expected),true,'Retain legacy printed title as a search alias');
const lessonList=lessons.lessonList;
lessons.lessonList=[];
assert.equal(guide.validate(guide.tasks[0]),'missing-lesson','Missing real ID must still be detected');
lessons.lessonList=lessonList;
console.log('PASS: paper navigation opens renamed lectures by stable ID, all four routes, aliases, and fallback');
