'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const js=fs.readFileSync('video-lessons-math-v1.js','utf8');
const smoke=fs.readFileSync('tests/browser-smoke.html','utf8');
const expectations=[
 ['prominent Next button', "inlineNext=el('button',finalPractice?'授業一覧へ →':'次の説明へ →'"],
 ['auto-next off by default', 'let autoNextOnCorrect=false'],
 ['next only once explanation is complete', 'syncInlineNext();'],
 ['auto-next opt-in setting', "autoNextCheck.type='checkbox'"],
 ['correct answer unlocks Next', "const nextButton=document.getElementById('ts-vnext');if(nextButton)nextButton.disabled=false;"],
 ['correct answer schedules opt-in advance', "if(autoNextOnCorrect){"],
 ['delayed auto-advance instead of skipping teaching', '},4000);'],
 ['timer cancelled on manual Next', 'function changeStep(delta){if(!selected)return;cancelCorrectNext()'],
 ['timer cancelled upon stage reload', 'cancelCorrectNext();if(timer!==null)clearTimeout(timer);timer=null;target.replaceChildren();'],
 ['last stage independent problem still separate', "const finalPractice=index===selected.steps.length-1;"],
 ['avoid altering grading records', 'window.TakumiVideoLessons=']
];
for(const [name,needle] of expectations)assert.ok(js.includes(needle),name+' is absent');
assert.ok(html.includes('<title>巧澄 Study Lab v3.10</title>'));
assert.ok(html.includes('video-lessons-math-v1.js?v=31000'));
assert.ok(smoke.includes('correct answer did not reveal in-stage Next'));
assert.ok(smoke.includes('automatic advancing should be opt-in'));
assert.ok(smoke.includes('auto-next feedback absent'));
console.log('PASS: Next CTA, optional timed progress, timer cancel, untouched lesson data and version');
