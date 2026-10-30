'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const context={window:{}};
vm.runInNewContext(fs.readFileSync('./math-clarity-v8.js','utf8'),context,{timeout:2000});
const api=context.window.TakumiMathClarityV8;
assert.ok(api,'Deep maths module not loaded');
assert.equal(api.guideIds.length,8,'Expected eight explicitly authored tutorials');
const lessons=Array.from(api.guideIds,id=>({
 id,practice:['未出題の確認問題：'+id,'自分で考えるヒント','模範解答は確認後に表示'],
 steps:[['すでに学習した内容',['原題','式'],'理由','授業'],['仕上げ',['未出題の確認問題：'+id],'答えを見ない','学習者自身で確認']],
 continuityChecked:true
}));
api.apply(lessons);
assert.equal(lessons.filter(x=>x.mathClarityV8).length,8);
for(const lesson of lessons){
 assert.ok(lesson.steps.length>=7,lesson.id+' is missing explanations');
 assert.equal(lesson.steps.at(-1)[1][0],lesson.practice[0],lesson.id+' leaks independent answer');
 assert.equal(lesson.steps.at(-1)[1].length,1,lesson.id+' final stage must show only new question');
 assert.ok(lesson.minutes.includes('20'),lesson.id+' should not be represented as a two-minute lecture');
 let quizzes=0;
 for(const stage of lesson.steps.slice(0,-1)){
  assert.ok(stage[1].length>=2,lesson.id+' must have multi-line work');
  assert.ok(stage[2].length>=38,lesson.id+' must explain why, not just announce result');
  assert.ok(stage[5]?.trap?.length>=15,lesson.id+' must name a concrete misconception');
  assert.ok(stage[5]?.check?.length>=12,lesson.id+' must include a self-check');
  if(stage[4]){
   quizzes++;
   assert.ok(stage[4][2]>=0&&stage[4][2]<stage[4][1].length);
  }
 }
 assert.ok(quizzes>=1,lesson.id+' lacks interactive misconception checkpoint');
}
for(const unit of ['連立方程式','1次不等式','分数・小数','証明']){
 const tip=api.explainQuestion({u:unit});
 assert.ok(tip&&tip.why.length>=35&&tip.pitfall.length>=15,'Wrong-answer recovery missing '+unit);
}
assert.equal(api.explainQuestion({u:'架空の単元'}),null);
const page=fs.readFileSync('./index.html','utf8');
const player=fs.readFileSync('./video-lessons-math-v1.js','utf8');
assert.ok(page.includes('math-clarity-v8.js?v=3800'),'Maths content must load');
assert.ok(page.indexOf('math-clarity-v8.js')<page.indexOf('video-lessons-math-v1.js?v=3900'),'Maths module must load before player');
assert.ok(player.includes('TakumiMathClarityV8.apply(lessons)'),'Maths teacher content must actually be applied');
assert.ok(player.includes('ts-teacher-trap')&&player.includes('ts-teacher-check'),'Detailed mistake and check panels must render');
assert.ok(player.includes('ts-math-recovery'),'Incorrect answers must expose a recovery panel');
console.log('PASS: eight maths lessons with independent practice, misconceptions, checkpoints and wrong-answer guidance');
