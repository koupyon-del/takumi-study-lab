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
assert.ok(html.indexOf('lesson-continuity-v6.js?v=3300')<html.indexOf('video-lessons-math-v1.js?v=3300'),'Corrections must precede player');
console.log('Passed: 9 lessons, stage continuity, separate self-test, integration order');
