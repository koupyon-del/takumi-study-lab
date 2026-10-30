/* Educational improvements for all remaining 61 lessons. */
(function(){'use strict';
window.TakumiApplyMasterclass=function(lessons){
 const master=Object.assign({},window.TakumiMasterclassMath||{},window.TakumiMasterclassEnglish||{});
 const corrections=window.TakumiMasterclassPracticeCorrections||{};
 const S=(heading,boards,note,quiz)=>quiz?[heading,boards,note,note,quiz]:[heading,boards,note,note];
 if(Object.keys(master).length!==61)throw Error('Missing lesson guide');
 let applied=0;
 for(const lesson of lessons){
  if(lesson.overview||lesson.continuityChecked)continue;
  const guide=master[lesson.id];
  if(!guide||guide.length!==3)throw Error('Guide missing: '+lesson.id);
  if(corrections[lesson.id])lesson.practice=corrections[lesson.id].slice();
  const previous=lesson.steps;
  const stages=[S('この授業で理解すること',[previous[0][1][0],'意味・理由・途中式・確認'],guide[0][2])];
  const old=previous[1];
  if(old&&String(old[2]).length>=75&&!/正しく判断すると|構造に注目しましょう|操作を飛ばさず|典型的な誤り/.test(old[2])){
   stages.push(JSON.parse(JSON.stringify(old)));
  }
  for(const [heading,boards,note] of guide)stages.push(S(heading,boards,note));
  const quizSlide=previous.find(x=>Array.isArray(x[4])&&x[4][1]?.length>1);
  if(quizSlide){
   const q=JSON.parse(JSON.stringify(quizSlide[4]));
   stages.push(S('理解を確かめる',[q[0],'根拠を言葉で説明する'],guide[0][2],q));
  }
  stages.push(S('最後に自力で挑戦',[lesson.practice[0]],'答えを見る前にノートで解き、理由を書きましょう。'));
  lesson.steps=stages;
  lesson.masterclassChecked=true;
  lesson.continuityChecked=true;
  lesson.level='一から理解する';
  lesson.minutes='約12〜18分';
  applied++;
 }
 if(applied!==61)throw Error('Unexpected lesson count: '+applied);
 return lessons;
};})();