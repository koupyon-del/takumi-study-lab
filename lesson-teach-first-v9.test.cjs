'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const scope={window:{}};
vm.runInNewContext(fs.readFileSync('lesson-teach-first-v9.js','utf8'),scope,{filename:'lesson-teach-first-v9.js'});
const teach=scope.window.TakumiTeachFirstV9;
assert.equal(teach.stageCount,19,'Opening teacher stages must remain 19');
const practice='x＋y＝15、x−y＝5';
const lessons=[
 {id:'overview-simultaneous',practice:[practice,'自力のヒント','解答'],
  steps:[['legacy',['何か'],'理由','説明'],['仕上げ',[practice],'自分で解く','自力です']]},
 {id:'add',practice:[practice,'自力のヒント','解答'],
  steps:[['legacy',['何か'],'理由','説明'],['仕上げ',[practice],'自分で解く','自力です']]},
 {id:'inequality-unmodified',steps:[['初回',['説明'],'先に教える','説明']]}
];
teach.apply(lessons);
const sum=lessons[0],add=lessons[1];
assert.equal(sum.steps.length,13,'12 coherent opening stages plus independent practice');
assert.equal(add.steps.length,8,'7 detailed add stages plus independent practice');
for(const lesson of [sum,add]){
 assert.equal(lesson.steps.at(-1)[1][0],practice,'Independent task was changed or shown too early');
 assert.equal(lesson.steps.at(-1)[1].length,1,'Independent answer leaked into initial view');
 assert.ok(lesson.steps[0][4]==null,'Opening must not quiz a new student');
 assert.ok(lesson.steps[0][2].length>=55,'First teaching paragraph too brief');
 const firstQuiz=lesson.steps.findIndex(s=>s[4]);
 assert.ok(firstQuiz>=6,'Quiz must be after multiple teacher explanations');
 for(const stage of lesson.steps.slice(0,-1)){
  assert.ok(stage[5]?.trap?.length>8&&stage[5]?.check?.length>8);
  assert.ok(stage[2].length>=40,'Short unexplained lecture step: '+stage[0]);
 }
}
assert.equal(lessons[2].teachFirstV9,undefined,'Unrelated lesson content should not be overwritten');
const player=fs.readFileSync('video-lessons-math-v1.js','utf8');
const html=fs.readFileSync('index.html','utf8');
assert.ok(player.includes('TakumiTeachFirstV9.apply(lessons)'),'Opening rewrite must be applied');
assert.ok(player.includes("el('section',null,'ts-teach-before-quiz')"),'Teaching-before-quiz section missing');
assert.ok(player.includes("thought.style.display='none'"),'Quiz must initially be hidden');
assert.ok(player.includes("if(confirm&&!isFinal)confirm.style.display=''"),'Quiz should appear after teaching');
assert.ok(player.includes("nextButton.disabled=false"),'Correct checkpoint should allow progress');
assert.ok(player.includes("openLesson(route.id,source||'quiz',0"),'Remediation should start at the foundation');
assert.ok(html.indexOf('lesson-teach-first-v9.js?v=3900')<html.indexOf('video-lessons-math-v1.js?v=3900'),'Opening lesson module must load before player');
console.log('PASS: introduction teaches before asking, 19 grounded stages, self-study preserved, all-lesson UI gate wired');
