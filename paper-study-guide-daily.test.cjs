'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
class FakeElement{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.textContent='';this.className='';
   this.classList={add:c=>this.className+=' '+c};}
 appendChild(c){this.children.push(c);return c}
 append(...children){this.children.push(...children)}
 after(){}
 querySelector(sel){return sel==='.top'?this:null}
 replaceChildren(...children){this.children=[...children]}
 setAttribute(k,v){this[k]=v}
}
const home=new FakeElement('section'),wrap=new FakeElement('div'),opened=[],alerts=[];
const rows=[
 ['2026-11-17','代入と分数方程式から合同条件','理科A','消化・吸収','国語','動詞活用','science','geography','図形30・理科20・漢字10'],
 ['2026-12-02','試験最終日','国語','期末','地理','期末','','','休養']
];
const subjects={math:[{u:'比例・反比例',examQuality:'mi2026-2nd-final'}],
 geography:[{u:'ヨーロッパ',examQuality:'mi2026-2nd-final'}],
 science:[{u:'人体のつくり',examQuality:'mi2026-2nd-final'}],
 english:[{u:'三単現'}],japanese:[],history:[]};
const document={getElementById:id=>id==='home'?home:null,
 querySelector:selector=>selector==='.wrap'?wrap:null,
 createElement:t=>new FakeElement(t),head:new FakeElement('head')};
const cloud=()=>({paperDailyRows:rows});
const context={window:{
 TakumiStudyPolicy:{effectivePlan:cloud},
 TakumiExamQuality20261115:{start:cat=>opened.push(cat)},
 TakumiRequestDeck:{form:{},subjectPool:()=>[],open(){}},
 TakumiVideoLessons:{lessonList:[],openLesson(){}},
 addEventListener(){}
 },data:subjects,document,alert:v=>alerts.push(v),show(){}};
vm.runInNewContext(fs.readFileSync('paper-study-guide-v1.js','utf8'),context);
const guide=context.window.TakumiPaperStudyGuide;
assert.ok(guide,'Guide exposed');
assert.equal(guide.version,'3.13.1');
assert.equal(guide.getDay('2026-11-15').date,'2026-11-16');
assert.equal(guide.getDay('2026-11-15').kind,'tomorrow');
assert.equal(guide.getDay('2026-11-16').day.app[0].cat,'geography');
const nov17=guide.getDay('2026-11-17');
assert.equal(nov17.kind,'today');
assert.equal(nov17.day.paper.length,3);
assert.equal(nov17.day.app.length,3);
assert.match(nov17.day.selfStudy,/図形30/);
const finalDay=guide.getDay('2026-12-02');
assert.equal(finalDay.day.app.length,0);
const all=(node,acc=[])=>{acc.push(node);for(const child of node.children||[])all(child,acc);return acc};
const panel=new FakeElement('section');guide.renderAtDate('2026-11-16',panel);
const nodes=all(panel);
assert.ok(nodes.some(n=>n.textContent.includes('2026年11月16日')),'Date shown');
assert.ok(nodes.some(n=>n.textContent.includes('紙教材は作成済み')),'Actual handout acknowledged');
assert.ok(nodes.some(n=>n.textContent.includes('分数・代入・連立')),'Original print instructions used');
assert.ok(!panel.children.some(n=>n.textContent.includes('11月7日')),'Nov7 not the visible assignment');
const examButtons=nodes.filter(n=>typeof n.onclick==='function'&&String(n.textContent).includes('期末厳選10問'));
assert.equal(examButtons.length,2);
examButtons[0].onclick();examButtons[1].onclick();
assert.deepEqual(opened,['geography','math']);
assert.equal(alerts.length,0);
const nextPanel=new FakeElement('div');guide.renderAtDate('2026-11-17',nextPanel);
assert.ok(all(nextPanel).some(n=>String(n.textContent).includes('代入と分数方程式')),'Next day cloud plan displayed');
context.window.TakumiStudyPolicy.effectivePlan=()=>null;
assert.equal(guide.getDay('2026-11-19').day,null,'No stale historical fallback');
assert.equal(guide.getDay('2026-11-16').day.status,'material_ready','Offline Nov16 fallback');
console.log('PASS: dated paper tasks, tomorrow forecast, exam links, cloud daily plan, no stale 11/7 default');
