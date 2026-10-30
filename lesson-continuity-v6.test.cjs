'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = __dirname;
const sandbox = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(root,'lesson-continuity-v6.js'),'utf8'), sandbox);
const fixes = sandbox.window.TakumiLessonContinuityFixes;
assert.equal(Object.keys(fixes).length,9,'Nine priority lesson corrections must remain available');
for(const [id, lesson] of Object.entries(fixes)){
  assert.equal(lesson.practice.length,3, id+' needs question, hint, solution');
  assert.ok(lesson.practice.every(s=>typeof s==='string' && s.length>=8),id+' has incomplete independent practice');
  assert.ok(lesson.steps.length>=6,id+' must teach multiple explicit transitions');
  assert.match(lesson.steps.at(-1)[0],/仕上げ/,id+' must end in independent work');
  for(const [i,stage] of lesson.steps.entries()){
    assert.ok(stage.length>=4 && stage[1].length>=2,id+' stage '+i+' has missing board steps');
    assert.ok(stage[2].length>=25 && stage[3].length>=25,id+' stage '+i+' explanation too short');
    assert.doesNotMatch(stage[2],/操作を飛ばさず|正しく判断すると|間違いやすい点：/,id+' still has placeholder narration');
    if(stage[4]) assert.ok(stage[4][2]>=0 && stage[4][2]<stage[4][1].length,id+' stage '+i+' has invalid quiz answer');
  }
}
const player = fs.readFileSync(path.join(root,'video-lessons-math-v1.js'),'utf8');
assert.ok(player.includes('last[1]=[l.practice[0]]'), 'New exercise must replace ALL old worked board lines');
assert.ok(player.includes('last.length=4'), 'Old checkpoint must not leak into independent practice');
assert.ok(player.includes('selected.continuityChecked||finalPractice'), 'Old decisions must be disabled for rewritten tutorials');
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.ok(html.includes('lesson-continuity-v6.js?v=3300'), 'New teaching content must be loaded');
assert.ok(html.indexOf('lesson-continuity-v6.js?v=3300')<html.indexOf('video-lessons-math-v1.js?v=3400'),'Corrections must precede player');
// Boot only the data assembly section of the player to catch missing IDs and mixing
// across the complete course catalogue, without requiring a browser or speech APIs.
const bootFiles = [
 'math-lessons-foundations-v1.js','english-lessons-foundations-v1.js',
 'math-lessons-expansion-v2.js','english-lessons-expansion-v2.js',
 'lesson-rewrites-core-v3.js','lesson-rewrites-math-basics-v3.js',
 'lesson-rewrites-english-v3.js','lesson-quality-math-v4.js',
 'lesson-quality-english-v4.js','lesson-rewrites-all-extra-v3.js',
 'tutor-decisions-v1.js','lesson-audit-patches-v1.js','overview-lessons-v1.js',
 'lesson-depth-units-v5.js','math-detailed-worked-v5.js','english-detailed-grammar-v5.js',
 'lesson-continuity-v6.js',
 'lesson-masterclass-math-a-v7.js','lesson-masterclass-math-b-v7.js',
 'lesson-masterclass-english-a-v7.js','lesson-masterclass-english-b-v7.js',
 'lesson-masterclass-practice-v7.js','lesson-masterclass-apply-v7.js'
];
const integrated = {window:{}};
for(const file of bootFiles)vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),integrated,{filename:file});
const cutoff = player.indexOf('const el=(tag,text,cls)=>{');
assert.ok(cutoff>0,'Player assembly boundary must exist');
vm.runInNewContext(player.slice(0,cutoff)+'\nwindow.__testLessons=lessons;\n})();',integrated,{filename:'video-lessons-math-v1.js'});
const all=integrated.window.__testLessons;
assert.equal(all.length,81,'All 81 tutorials must assemble successfully');
assert.equal(all.filter(x=>x.overview).length,11,'Eleven overview tutorials must remain');
assert.equal(all.filter(x=>x.continuityChecked).length,70,'All 70 individual lessons must be rewritten');
assert.equal(all.filter(x=>x.masterclassChecked).length,61,'Sixty-one masterclasses must be applied');
assert.equal(all.filter(x=>x.overview).length,11,'Eleven overviews must remain available');
for(const lesson of all){
 assert.equal(lesson.steps.at(-1)[1].length,1,lesson.id+' must not leak an older example');
 assert.equal(lesson.steps.at(-1)[1][0],lesson.practice[0],lesson.id+' independent question mismatch');
}
const filler = /操作を飛ばさず|正しく判断すると|なぜこの操作が成立するか確認|典型的な誤り：|間違いやすい点：|構造に注目しましょう/;
for(const lesson of all){
 for(const stage of lesson.steps.slice(0,-1)){
  assert.doesNotMatch(stage[2],filler,lesson.id+' contains a placeholder in '+stage[0]);
  if(lesson.masterclassChecked)assert.ok(stage[2].length>=40,lesson.id+' has incomplete teacher explanation');
 }
 const normalize = str => String(str).replace(/[\\s　。、：:「」『』()（）＋+−\-=＝]/g,'').toLowerCase();
 const question=normalize(lesson.practice[0]);
 const earlier=normalize(lesson.steps.slice(0,-1).flatMap(stage=>stage[1]).join(' '));
 assert.ok(question.length<8||!earlier.includes(question),lesson.id+' repeats a solved problem as new practice');
}
console.log('Passed: all 81 lessons, 70 rewritten tutorials, 11 overviews, independent exercise isolation');
