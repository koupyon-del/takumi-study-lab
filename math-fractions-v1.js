/* Math fraction display: preserve original question text, IDs, and correct-answer logic.
 * Present simple slash fractions with a school-style horizontal fraction bar.
 * Never change non-math subjects, divide signs (÷), or saved answer data.
 */
(function(){
'use strict';
const pattern=/(?<![a-zA-Z])(?:\((?:[^()]*)\)|[+\-−]?(?:\d+(?:\.\d+)?[a-zA-Z]?|[a-zA-Z]\d*))\s*\/\s*(?:\((?:[^()]*)\)|(?:\d+(?:\.\d+)?|[a-zA-Z]\d*))(?![a-zA-Z])/g;
const removeOuter=t=>t.startsWith('(')&&t.endsWith(')')?t.slice(1,-1):t;
function tokenize(text){
 const src=String(text||''),out=[];
 let index=0,match;pattern.lastIndex=0;
 while((match=pattern.exec(src))){
  if(match.index>index)out.push({kind:'text',value:src.slice(index,match.index)});
  const slash=match[0].indexOf('/');
  let numerator=match[0].slice(0,slash).trim();
  let denominator=match[0].slice(slash+1).trim();
  if(!numerator||!denominator)continue;
  numerator=removeOuter(numerator);denominator=removeOuter(denominator);
  out.push({kind:'frac',num:numerator,den:denominator});
  index=match.index+match[0].length;
 }
 if(index<src.length)out.push({kind:'text',value:src.slice(index)});
 return out;
}
function displayMath(el){
 if(!el)return;
 const tokens=tokenize(el.textContent);
 if(!tokens.some(x=>x.kind==='frac'))return;
 const frag=document.createDocumentFragment();
 for(const t of tokens){
  if(t.kind==='text'){frag.appendChild(document.createTextNode(t.value));continue}
  const span=document.createElement('span'),top=document.createElement('span'),bottom=document.createElement('span');
  span.className='ts-math-frac';span.setAttribute('role','math');
  span.setAttribute('aria-label',t.den+'分の'+t.num);
  top.className='ts-math-frac-num';top.textContent=t.num;
  bottom.className='ts-math-frac-den';bottom.textContent=t.den;
  span.append(top,bottom);frag.appendChild(span);
 }
 el.replaceChildren(frag);
}
const oldRender=render;
render=function(){
 oldRender();
 if(state.cat!=='math')return;
 displayMath(question);
 for(const btn of choices.children)displayMath(btn);
};
const oldAnswer=answer;
answer=function(...args){
 oldAnswer(...args);
 if(state.cat==='math')displayMath(feedback);
};
const style=document.createElement('style');
style.textContent='.ts-math-frac{display:inline-flex;flex-direction:column;vertical-align:middle;align-items:center;justify-content:center;line-height:1.05;white-space:nowrap;margin:0 .14em;font-size:.92em}.ts-math-frac-num{display:block;padding:0 .27em .13em;border-bottom:1.7px solid currentColor}.ts-math-frac-den{display:block;padding:.14em .27em 0}';
document.head.appendChild(style);
window.TakumiMathFractions={tokenize,displayMath};
})();