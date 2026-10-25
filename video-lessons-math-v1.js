(function videoLessonModule(){
'use strict';
const lessons=[
{id:'add',title:'加減法①：文字を消す',level:'L1',subtitle:'＋y と −y に注目',minutes:'約2分',
 practice:['x＋y＝15、x−y＝5','二つの式を足すと y が消えます。','2x＝20 なので x＝10。代入して y＝5。2本で検算。'],
 steps:[
 ['連立方程式って何？',['① x＋y＝13','② x−y＝5'],'2本の式を同時に満たす x と y を探します。','まず二本の式を見て、同時に成り立つエックスとワイを探しましょう。'],
 ['消せる文字を発見',['① x＋y＝13','② x−y＝5','★ ＋y＋(−y)＝0'],'＋y と −y は、足すと0。だから式を足します。','プラスワイとマイナスワイは、足すとゼロ。二つの式を足して消しましょう。',['足すと消える文字は？',['x','y','どちらも'],1,'＋y と −y が消えます。x は 2x になります。']],
 ['左右をそれぞれ足す',['(x＋y)＋(x−y)＝13＋5','★ 2x＝18'],'左辺同士と右辺同士を計算します。','両辺をそれぞれ足すと、二エックス、イコール十八です。'],
 ['もう1文字も解く',['★ x＝9','① 9＋y＝13','★ y＝4'],'xだけで終わらない。元の式へ戻して y を求めます。','エックスは九です。元の式に戻すと、ワイは四です。'],
 ['2本で検算',['✓ 9＋4＝13','✓ 9−4＝5','★ (x, y)＝(9, 4)'],'途中式・2文字の答え・2本の検算で完成です。','九と四を二本の式に戻すと、どちらも成立します。']
]},
{id:'coef',title:'加減法②：係数をそろえる',level:'L2',subtitle:'式の両辺すべてを2倍',minutes:'約2分',
 practice:['2x＋y＝17、x＋2y＝13','最初の式全体を2倍し、下の式を引きます。','4x＋2y＝34 から x＋2y＝13 を引いて 3x＝21。x＝7、y＝3。'],
 steps:[
 ['そのまま引いても消えない',['① 2x＋y＝14','② x＋2y＝13'],'yの係数が1と2です。消すには係数をそろえます。','ワイの係数が一と二なので、このままでは消せません。'],
 ['①の式全体を2倍',['①を2倍','★ 4x＋2y＝28','② x＋2y＝13'],'左辺の両方の項と右辺、すべてを2倍します。','式の全体を二倍します。四エックス、プラス二ワイ、イコール二十八です。',['①の両辺を2倍した式は？',['4x＋y＝28','4x＋2y＝28','2x＋2y＝28'],1,'2xもyも14も、すべて2倍します。']],
 ['係数がそろえば引く',['4x＋2y＝28','−) x＋2y＝13','★ 3x＝15'],'＋2yが同符号なので引くと消えます。','上の式から下の式を引くと、三エックスは十五です。'],
 ['片方を求めて元へ',['★ x＝5','① 2×5＋y＝14','★ y＝4'],'x＝5を①に戻します。10＋y＝14だからy＝4。','エックスは五。最初の式に代入するとワイは四です。'],
 ['2本の式に戻して確かめる',['✓ 2×5＋4＝14','✓ 5＋2×4＝13','★ (x, y)＝(5, 4)'],'係数をそろえた操作も、答えも確認できました。','二つの式で答えを確かめましょう。']
]},
{id:'sub',title:'代入法：式を丸ごと入れる',level:'L2',subtitle:'y の代わりに式全体を代入',minutes:'約2分',
 practice:['y＝3x−2、x＋y＝18','x＋(3x−2)＝18 を計算します。','4x＝20 なので x＝5、y＝13。'],
 steps:[
 ['代入しやすい式を探す',['① y＝2x−3','② x＋y＝9'],'①は y＝… の形。②のyを式で置き換えられます。','ワイは二エックス引く三です。この式を丸ごと入れます。'],
 ['yの代わりに括弧ごと代入',['x＋y＝9','★ x＋(2x−3)＝9'],'まずは式全体に括弧を付けて代入しましょう。','ワイの場所に、二エックス引く三という式を入れます。',['括弧を付けた代入直後の式は？',['x＋(2x＋3)＝9','x＋(x−3)＝9','x＋(2x−3)＝9'],2,'yは2x−3そのもの。括弧でまとめて置き換えます。']],
 ['文字を整理する',['x＋2x−3＝9','3x−3＝9','★ 3x＝12'],'xの項をまとめ、両辺に3を足します。','三エックス引く三が九。三エックスは十二です。'],
 ['xとyを求める',['★ x＝4','y＝2×4−3','★ y＝5'],'元の①でyを求めます。','エックスは四、ワイは五です。'],
 ['検算して完成',['✓ 5＝2×4−3','✓ 4＋5＝9','★ (x, y)＝(4, 5)'],'代入しても元の条件を両方満たします。','最初の二本の式で答えを確認します。']
]},
{id:'sign',title:'符号と括弧：分配法則',level:'L3',subtitle:'−2(6−x) の符号に注意',minutes:'約2分',
 practice:['x＋y＝7、3x−2y＝11','y＝7−xを代入し、−2を括弧全体に掛けます。','3x−2(7−x)＝11 →5x＝25。x＝5、y＝2。'],
 steps:[
 ['符号に注意する連立',['① x＋y＝6','② 3x−2y＝8'],'②には−2yがあります。括弧の符号がポイントです。','マイナス二ワイの計算に注意して解きます。'],
 ['①からyを求める',['x＋y＝6','★ y＝6−x'],'両辺からxを引きます。','ワイは六引くエックスです。'],
 ['−2を括弧の両方に掛ける',['3x−2(6−x)＝8','−2×6＝−12','★ −2×(−x)＝＋2x'],'負の数同士の積はプラス。ここを飛ばさず書きます。','マイナス二を、六にもマイナスエックスにも掛けます。',['−2(6−x) を展開すると？',['−12−2x','−12＋2x','−12＋x'],1,'−2×6＝−12、−2×(−x)＝＋2xです。']],
 ['項をまとめる',['3x−12＋2x＝8','5x−12＝8','★ x＝4'],'5x＝20を経てx＝4です。','五エックスは二十なので、エックスは四です。'],
 ['検算して完成',['★ y＝6−4＝2','✓ 4＋2＝6','✓ 3×4−2×2＝8'],'答えはx＝4、y＝2。元の式を満たします。','ワイは二。二つの式で検算します。']
]},
{id:'word',title:'文章題：条件から式を作る',level:'L4',subtitle:'個数と金額を分けて考える',minutes:'約2分',
 practice:['ノート180円とペン90円を8個買い、合計990円でした。それぞれ何個？','n＋p＝8、180n＋90p＝990。','90で割ると2n＋p＝11。引いてn＝3、p＝5。540＋450＝990。'],
 steps:[
 ['数字と単位を整理',['ノート 180円／冊','ペン 90円／本','★ 合計7個・900円'],'何を求めるか、どの条件があるか先に整理します。','ノートが百八十円、ペンが九十円。合計七個で九百円です。'],
 ['未知数を決める',['ノートn冊・ペンp本','① n＋p＝7','★ ② 180n＋90p＝900'],'①は個数、②は金額の式です。','ノートをエヌ冊、ペンをピー本として、二本の式を立てます。',['個数を表す式は？',['n＋p＝7','180n＋90p＝7','n＋p＝900'],0,'冊数と本数を合わせて7個です。']],
 ['金額の式を簡単に',['180n＋90p＝900','すべて90で割る','★ 2n＋p＝10'],'等式の左辺全体と右辺を90で割ります。','金額の式全体を九十で割ると、二エヌ、プラスピー、イコール十です。'],
 ['式を引いて個数を求める',['2n＋p＝10','−) n＋p＝7','★ n＝3、p＝4'],'pが消え、n＝3。①に戻してp＝4。','二本の式を引くとエヌは三、ピーは四です。'],
 ['単位を付けて検算',['✓ 3＋4＝7個','✓ 180×3＋90×4＝900円','★ ノート3冊、ペン4本'],'個数も代金も一致。答えには単位を付けます。','個数も金額も一致しました。']
]}];

lessons.push({
 id:'fraction',title:'分数を含む連立：分母を払う',level:'L3',
 subtitle:'等式の全項に同じ数を掛ける',minutes:'約2分',
 practice:['x÷3＋y÷2＝4、x−y＝2','最初の式全体に6を掛けて 2x＋3y＝24。次に2本の式のyの係数をそろえます。','2x＋3y＝24、3x−3y＝6 を加えると5x＝30。x＝6、y＝4。検算：6÷3＋4÷2＝4、6−4＝2。'],
 steps:[
  ['分母のある式を見る',['① x÷2＋y÷3＝3','② x−y＝1'],'分数を含む式は、最小公倍数を掛けると整数係数の式になります。','最初の式はエックス割る二、プラス、ワイ割る三、イコール三です。'],
  ['式全体に6を掛ける',['①の両辺を6倍','6×(x÷2)＋6×(y÷3)＝6×3','★ 3x＋2y＝18'],'分母2と3の最小公倍数は6。すべての項に6を掛けます。','左辺のそれぞれの項と右辺を、六倍しましょう。',['x÷2＋y÷3＝3 を6倍した式は？',['3x＋2y＝18','3x＋2y＝3','6x＋6y＝18'],0,'x÷2は3x、y÷3は2y、右辺3は18になります。']],
  ['もう1本も係数をそろえる',['② x−y＝1','②を2倍','★ 2x−2y＝2'],'yの係数を＋2と−2にそろえます。','二本目の式を二倍すると、二エックス、マイナス二ワイ、イコール二です。'],
  ['足して2文字を求める',['(3x＋2y)＋(2x−2y)＝18＋2','★ 5x＝20 → x＝4','②に戻してy＝3'],'係数をそろえれば、yが消えます。もう一方も求めましょう。','式を足すと五エックスは二十です。エックスは四、ワイは三です。'],
  ['両方の式で検算',['✓ 4÷2＋3÷3＝3','✓ 4−3＝1','★ (x, y)＝(4, 3)'],'分数のまま元の2式へ戻し、どちらも成立するか確認します。','元の二本の式に戻して確かめます。']
 ]
});

for(const l of lessons){
 if(!l.steps||l.steps.length<4||!l.practice)throw Error('Invalid math lesson');
 for(const s of l.steps)if(!s[1].length||!s[2]||!s[3]||(s[4]&&(s[4][2]<0||s[4][2]>=s[4][1].length)))throw Error('Invalid slide');
}
const el=(tag,text,cls)=>{const x=document.createElement(tag);if(text!==undefined&&text!==null)x.textContent=String(text);if(cls)x.className=cls;return x};
const screen=el('section',null,'screen ts-video-screen');screen.id='ts-video-screen';document.querySelector('.wrap').appendChild(screen);
let selected=null,index=0,from='home',timer=null,auto=false,speed=1,answers=new Map(),spoken=null,origin=null;
function cancelAudio(){try{window.speechSynthesis?.cancel()}catch(e){}spoken=null}
function stop(){if(timer!==null)clearTimeout(timer);timer=null;auto=false;cancelAudio()}
const priorShow=show;show=function(id){if(id!==screen.id)stop();priorShow(id)};
function exit(){stop();selected=null;show(from)}
function openList(source){stop();selected=null;origin=null;from=source||from;paintList();show(screen.id)}
function openLesson(id,source,stage=0,sourceQuestion=null){
 stop();selected=lessons.find(x=>x.id===id)||lessons[0];from=source||from;
 index=Math.max(0,Math.min(selected.steps.length-1,Math.floor(Number(stage)||0)));
 origin=sourceQuestion;answers=new Map();paintPlayer();show(screen.id)
}
function paintList(){
 screen.replaceChildren();
 const b=el('button','← 戻る','back');b.type='button';b.onclick=exit;
 screen.append(b,el('h2','数学｜動く板書授業'),el('p','解法を短い授業に分けました。音声は任意で再生できます。視聴や確認問題を自力正答率に加算しません。','ts-note'));
 const grid=el('div',null,'ts-vgrid');
 for(const l of lessons){
  const btn=el('button',null,'ts-vcard');btn.type='button';
  btn.append(el('span',l.level+'・'+l.minutes,'ts-level'),el('strong',l.title),el('small',l.subtitle));
  btn.onclick=()=>openLesson(l.id,from);grid.appendChild(btn);
 }
 screen.appendChild(grid);
}
function speak(){
 const st=selected?.steps[index],status=document.getElementById('ts-audio-status');if(!st)return;
 cancelAudio();
 if(typeof window.SpeechSynthesisUtterance!=='function'||!window.speechSynthesis){
  if(status)status.textContent='音声を利用できない端末です。字幕を確認してください。';return
 }
 try{
  const u=new window.SpeechSynthesisUtterance(st[3]);u.lang='ja-JP';u.rate=.92;
  u.onend=()=>{if(status)status.textContent='読み上げが終了しました'};
  u.onerror=()=>{if(status)status.textContent='端末で音声を再生できません。字幕は表示されています。'};
  spoken=u;window.speechSynthesis.speak(u);if(status)status.textContent='読み上げ中…';
 }catch(e){if(status)status.textContent='音声が利用できません。字幕は表示されています。'}
}
function tick(){
 if(timer!==null)clearTimeout(timer);timer=null;
 if(!auto||!selected)return;
 const step=selected.steps[index];if(step[4]&&!answers.has(index)){
  auto=false;const n=document.getElementById('ts-auto-status');if(n)n.textContent='確認問題で自動再生を停止しました。';setAutoButton();return
 }
 if(index>=selected.steps.length-1){auto=false;setAutoButton();return}
 timer=setTimeout(()=>{if(auto){index++;paintStep()}},Math.round(15500/speed))
}
function setAutoButton(){const b=document.getElementById('ts-autobtn');if(b)b.textContent=auto?'⏸ 自動再生を停止':'▶ 板書を自動再生'}
function changeStep(delta){if(!selected)return;cancelAudio();const next=index+delta;if(next<0)return;
 if(next>=selected.steps.length){stop();paintList();return}
 index=next;paintStep()
}
function toggleAuto(){if(auto){auto=false;if(timer!==null)clearTimeout(timer);timer=null;setAutoButton();return}
 if(index===selected.steps.length-1)index=0;auto=true;paintStep()}
function paintPlayer(){
 screen.replaceChildren();
 const back=el('button','← 授業一覧','back');back.type='button';back.onclick=()=>{stop();paintList()};
 screen.append(back,el('h2',selected.title),el('p',selected.level+'｜'+selected.subtitle+'｜'+selected.minutes,'ts-note'));
 if(origin){
  const context=el('div',null,'ts-question-bridge');
  context.append(el('strong','いま解いた問題に関連する授業です'),el('p',origin.q));
  if(origin.note)context.appendChild(el('p',origin.note,'ts-note'));
  context.appendChild(el('small','※ この授業は解き方を説明します。問題の数値・設問形式は異なる場合があります。'));
  screen.appendChild(context);
 }
 const outer=el('div',null,'ts-progress');const inside=el('div',null,'ts-progress-bar');inside.id='ts-progress-fill';outer.appendChild(inside);screen.appendChild(outer);
 const prog=el('p',null,'ts-note ts-count');prog.id='ts-stage-count';screen.appendChild(prog);
 const stage=el('div',null,'ts-vstage');stage.id='ts-vstage';screen.appendChild(stage);
 const controls=el('div',null,'ts-vcontrols');
 const prev=el('button','← 前へ','secondary');prev.type='button';prev.id='ts-vprev';prev.onclick=()=>changeStep(-1);
 const next=el('button','次へ →','secondary');next.type='button';next.id='ts-vnext';next.onclick=()=>changeStep(1);
 const play=el('button','▶ 板書を自動再生','secondary');play.type='button';play.id='ts-autobtn';play.onclick=toggleAuto;
 const voice=el('button','🔊 場面を読み上げ','secondary');voice.type='button';voice.onclick=speak;
 const speedLabel=el('label','再生速度 ','ts-speed');const sel=el('select');sel.setAttribute('aria-label','再生速度');
 for(const v of [.75,1,1.25,1.5]){const o=el('option',v+'倍');o.value=v;if(v===speed)o.selected=true;sel.appendChild(o)}
 sel.onchange=()=>{speed=Number(sel.value)||1;if(auto)tick()};speedLabel.appendChild(sel);
 controls.append(prev,next,play,voice,speedLabel);screen.appendChild(controls);
 const audio=el('p','音声の読み上げは端末の機能を使用します。文字の説明はいつでも読めます。','ts-note');audio.id='ts-audio-status';
 const autoStatus=el('p','','ts-note');autoStatus.id='ts-auto-status';
 screen.append(audio,autoStatus,el('p','※ 動画ファイルではなく、数式が順番に現れる「動く板書」です。確認問題や視聴は学力評価へ加算しません。','ts-note'));
 paintStep();
}
function paintStep(){
 if(!selected)return;const st=selected.steps[index],target=document.getElementById('ts-vstage');if(!target)return;
 if(timer!==null)clearTimeout(timer);timer=null;target.replaceChildren();
 target.appendChild(el('h3',st[0]));
 const board=el('div',null,'ts-blackboard');
 for(const line of st[1]){
  const special=line.startsWith('★'),good=line.startsWith('✓');
  board.appendChild(el('div',special?line.slice(2):line,'ts-formula'+(special?' ts-highlight':good?' ts-good':'')))
 }
 target.appendChild(board);target.appendChild(el('p',st[2],'ts-explain'));
 if(st[4]){
  const q=st[4],group=el('div',null,'ts-check');group.append(el('strong','ここで考えてみよう'),el('p',q[0]));
  const buttons=el('div',null,'ts-check-options'),feedback=el('p',null,'ts-check-feedback'),record=answers.get(index);
  q[1].forEach((txt,j)=>{
   const b=el('button',txt,'secondary');b.type='button';
   if(record!==undefined){b.disabled=true;if(j===q[2])b.classList.add('ts-correct');if(j===record&&j!==q[2])b.classList.add('ts-incorrect')}
   b.onclick=()=>{
    answers.set(index,j);
    [...buttons.children].forEach((bb,k)=>{bb.disabled=true;if(k===q[2])bb.classList.add('ts-correct');if(k===j&&k!==q[2])bb.classList.add('ts-incorrect')});
    feedback.textContent=(j===q[2]?'正解です。':'ここを確認。')+q[3];
    if(auto){auto=false;if(timer!==null)clearTimeout(timer);timer=null;setAutoButton()}
   };
   buttons.appendChild(b)
  });
  if(record!==undefined)feedback.textContent=(record===q[2]?'正解です。':'ここを確認。')+q[3];
  group.append(buttons,feedback);target.appendChild(group)
 }
 if(index===selected.steps.length-1){
  const p=el('div',null,'ts-practice');p.append(el('strong','仕上げ：解説を閉じて紙で解こう'),el('p',selected.practice[0]));
  const d=el('details');d.append(el('summary','ヒント・解答を確認'),el('p','ヒント：'+selected.practice[1]),el('p','解答：'+selected.practice[2]));p.appendChild(d);target.appendChild(p)
 }
 const progress=document.getElementById('ts-progress-fill');if(progress)progress.style.width=Math.round((index+1)/selected.steps.length*100)+'%';
 const ct=document.getElementById('ts-stage-count');if(ct)ct.textContent='場面 '+(index+1)+' / '+selected.steps.length;
 const prev=document.getElementById('ts-vprev');if(prev)prev.disabled=index===0;
 const next=document.getElementById('ts-vnext');if(next)next.textContent=index===selected.steps.length-1?'授業一覧へ':'次へ →';
 const status=document.getElementById('ts-audio-status');if(status)status.textContent='必要なら「場面を読み上げ」を押してください。';
 const autoStatus=document.getElementById('ts-auto-status');if(autoStatus)autoStatus.textContent='';
 setAutoButton();if(auto)tick()
}
function matchQuestion(q){
 if(!q||q.u!=='連立方程式')return null;
 const s=String(q.q||''),id=String(q.id||'');
 // Specific legacy concept checks override keyword guesses.
 const originals={
  M001:['add',0],M026:['add',0],
  M002:['coef',0],M027:['coef',0],
  M003:['sub',0],M028:['sub',0],
  M004:['fraction',0],M029:['fraction',0],
  M005:['word',1],M030:['word',1]
 };
 let match=originals[id];
 if(!match){
  if(/分数|小数|分母|通分|÷|\/|[⅓½¼¾]/.test(s))match=['fraction',1];
  else if(/文章題|冊|本|代金|個数|人数|合計|速さ|濃度|買い物|何円/.test(s))match=['word',1];
  else if(/分配|括弧|かっこ|符号|負の数|−2\(|-\s*2\(/.test(s))match=['sign',2];
  else if(/【連立・代入】|代入法|代入|y[=＝]/.test(s))match=['sub',1];
  else if(/係数|そろえ|同じ数倍|２倍|2倍|３倍|3倍/.test(s))match=['coef',1];
  else match=['add',1];
 }
 const lesson=lessons.find(l=>l.id===match[0]);
 return lesson?{id:lesson.id,step:match[1],title:lesson.title}:null;
}
function openForQuestion(q,source){
 const route=matchQuestion(q);if(!route)return false;
 const note='問題の該当単元を手掛かりに選んだ授業です。誤答原因を断定するものではありません。';
 openLesson(route.id,source||'quiz',route.step,{q:String(q.q||''),note});
 return true;
}
function attachQuestionLink(target,q,source,wrong){
 const route=matchQuestion(q);if(!route||!target)return null;
 const b=el('button',wrong?'▶ 間違えた問題を板書で復習':'▶ この問題の解き方を動画で確認','secondary ts-video-quiz');
 b.type='button';
 b.setAttribute('aria-label',(wrong?'間違い直し：':'関連解説：')+route.title);
 b.onclick=()=>openForQuestion(q,source);
 target.appendChild(b);
 return b;
}
const home=document.getElementById('home');
if(home){
 const p=el('div',null,'ts-video-home');p.append(el('strong','🎬 数学の動く板書授業'),el('p','連立方程式の5つの短い授業。音声・確認問題・紙の仕上げ問題付き。'));
 const b=el('button','▶ 授業一覧を開く','secondary');b.type='button';b.onclick=()=>openList('home');p.appendChild(b);
 const near=home.querySelector('.home-help');if(near)home.insertBefore(p,near);else home.appendChild(p)
}
const oldAnswer=answer;
answer=function(...args){
 const q=state?.set?.[state.i],cat=state?.cat;
 const eligible=cat==='math'&&matchQuestion(q);
 const isCorrect=args[0]===state.correctIndex;
 oldAnswer(...args);
 if(!eligible||!state.locked)return;
 const f=document.getElementById('feedback');
 if(!f||f.querySelector('.ts-video-quiz'))return;
 attachQuestionLink(f,q,'quiz',!isCorrect);
};
const css=`
.ts-video-home{margin:14px 0;padding:15px;border:1px solid #ced9e9;background:#edf3fb;border-radius:15px}
.ts-video-home strong{font-size:16px}.ts-video-home p{font-size:13px;line-height:1.65}
.ts-video-home button,.ts-video-quiz{width:100%;margin-top:9px;font-weight:700}.ts-question-bridge{border:1px solid #c8d8e7;background:#eef6fb;padding:12px 14px;border-radius:12px;margin:12px 0;line-height:1.6}.ts-question-bridge p{font-size:14px;margin:7px 0}.ts-question-bridge small{font-size:11px;color:#5c6d7f}
.ts-video-screen h2{font-size:21px;margin:14px 0;line-height:1.5}
.ts-note{font-size:12px;color:#5c6d7f;line-height:1.7}.ts-vgrid{display:grid;grid-template-columns:1fr;gap:12px}
.ts-vcard{display:flex;flex-direction:column;gap:8px;border:1px solid #d8e2ed;background:white;padding:16px;text-align:left;border-radius:15px}
.ts-vcard strong{font-size:17px}.ts-vcard small{color:#65727f;font-size:12px}.ts-level{font-size:12px;font-weight:800;color:#416983}
.ts-progress{height:8px;border-radius:99px;overflow:hidden;background:#dce6ef;margin-top:17px}
.ts-progress-bar{height:100%;background:#438d96;transition:width .35s}.ts-count{text-align:right;margin:5px 0 12px}
.ts-vstage{background:white;border:1px solid #d8e2ed;border-radius:15px;padding:13px}
.ts-vstage h3{font-size:15px;margin:4px 2px 12px}
.ts-blackboard{background:#152939;color:#f4f9ff;border-radius:12px;padding:22px 12px;min-height:204px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:12px}
.ts-formula{font-family:ui-monospace,Menlo,monospace;font-size:clamp(16px,5.1vw,24px);font-weight:700;line-height:1.5;white-space:pre-wrap;text-align:center;overflow-wrap:anywhere;animation:ts-rise .6s ease both}
.ts-formula:nth-child(2){animation-delay:.2s}.ts-formula:nth-child(3){animation-delay:.4s}
.ts-highlight{color:#ffdd89}.ts-good{color:#99efc9}
@keyframes ts-rise{from{opacity:0;transform:translateY(13px)}to{opacity:1;transform:translateY(0)}}
.ts-explain{font-size:15px;line-height:1.8;margin:14px 2px}
.ts-vcontrols{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}
.ts-vcontrols button{min-height:44px;font-size:13px;padding:8px}
.ts-speed{background:#f0f3f6;padding:9px;border-radius:9px;text-align:center;font-size:13px}
.ts-speed select{border:1px solid #bdc9d4;background:white;padding:6px;border-radius:7px}
.ts-check,.ts-practice{margin-top:14px;padding:13px;background:#eef5fb;border:1px solid #d2dfee;border-radius:12px}
.ts-check p,.ts-practice p{font-size:14px;line-height:1.6}
.ts-check-options{display:grid;grid-template-columns:1fr;gap:7px}
.ts-check-options button{text-align:left;font-size:14px;min-height:43px}
.ts-check-options .ts-correct{background:#dcf3e8;border-color:#5b9c7c;color:#183d30}
.ts-check-options .ts-incorrect{background:#fff0e4;border-color:#bd8168}
.ts-check-feedback{font-size:13px;font-weight:650}
.ts-practice details{background:white;border:1px solid #d7e2eb;padding:12px;border-radius:10px}
.ts-practice summary{cursor:pointer;font-weight:700}
@media(min-width:650px){.ts-vgrid{grid-template-columns:1fr 1fr}.ts-vcontrols{grid-template-columns:repeat(5,minmax(0,1fr))}}
@media(prefers-reduced-motion:reduce){.ts-formula{animation:none}.ts-progress-bar{transition:none}}
`;
document.head.appendChild(el('style',css));
window.TakumiVideoLessons={openLibrary:openList,openLesson,openForQuestion,matchQuestion,attachQuestionLink,lessonList:lessons.map(x=>({id:x.id,title:x.title,level:x.level,steps:x.steps.length})),version:'2.1.0'};
})();