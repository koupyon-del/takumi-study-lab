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

// Additional lessons are provided as static, audited lesson data.
for(const next of (window.TakumiExtraMathLessons||[])){
 if(lessons.some(l=>l.id===next.id))throw Error('Duplicated lesson id '+next.id);
 lessons.push(next);
}
for(const l of (window.TakumiExtraEnglishLessons||[])){
 if(lessons.some(x=>x.id===l.id))throw Error('Duplicated lesson id '+l.id);
 lessons.push(l);
}
// Overview courses are independent non-scored lessons; no quiz history is modified.
for(const intro of (window.TakumiOverviewLessons||[])){
 if(lessons.some(l=>l.id===intro.id))throw Error('Duplicate overview id '+intro.id);
 if(!intro.overview||!intro.group||!intro.subject||intro.steps.length<10)throw Error('Invalid overview '+intro.id);
 lessons.push(intro);
}
for(const revised of (window.TakumiLessonRewrites||[])){
 const index=lessons.findIndex(l=>l.id===revised.id);
 if(index<0)throw Error('Rewrite target missing: '+revised.id);
 const current=lessons[index];
 lessons[index]={...current,...revised,rewritten:true};
}
for(const quality of (window.TakumiExpandedLessonQuality||[])){
 const i=lessons.findIndex(l=>l.id===quality.id);
 if(i<0)throw Error('Lesson enhancement target missing: '+quality.id);
 const l=lessons[i];if(l.qualityChecked)throw Error('Duplicate enhancement: '+quality.id);
 if(!quality.steps||quality.steps.length!==3||!Array.isArray(l.steps)||l.steps.length<5)throw Error('Unsupported lesson structure: '+quality.id);
 const [concept,diagnostic,transfer]=quality.steps;
 l.steps=[l.steps[0],concept,l.steps[1],l.steps[2],diagnostic,...l.steps.slice(3,-1),transfer,l.steps[l.steps.length-1]];
 l.level='理由から学ぶ';l.minutes='約9〜12分';l.qualityChecked=true;
}
for(const l of lessons){
 if(!l.subject)l.subject='math';
 if(!l.group)l.group='連立方程式';
 if(!l.steps||l.steps.length<4||!l.practice)throw Error('Invalid math lesson');
 for(const s of l.steps)if(!s[1].length||!s[2]||!s[3]||(s[4]&&(s[4][2]<0||s[4][2]>=s[4][1].length)))throw Error('Invalid slide');
}
// Add lesson-specific, teacher-authored explanations after the generic revisions.
for(const [id,extra] of Object.entries(window.TakumiDetailedMathSteps||{})){
 const lesson=lessons.find(l=>l.id===id);if(!lesson)throw Error('Missing deep math lesson '+id);
 if(!extra.length||extra.some(st=>!Array.isArray(st[1])||st[1].length<2||!st[2]||!st[3]))throw Error('Invalid deep math data '+id);
 lesson.steps.splice(1,0,...extra);
 lesson.minutes='約12〜18分・分割可';lesson.deepDetailed=true;
}
for(const [id,extra] of Object.entries(window.TakumiDetailedEnglishSteps||{})){
 const lesson=lessons.find(l=>l.id===id);if(!lesson)throw Error('Missing deep English lesson '+id);
 if(!extra.length||extra.some(st=>!Array.isArray(st[1])||st[1].length<2||!st[2]||!st[3]))throw Error('Invalid deep English data '+id);
 lesson.steps.splice(1,0,...extra);
 lesson.minutes='約12〜18分・分割可';lesson.deepDetailed=true;
}
// Explicit teacher review runs after all rewrites and enrichment are merged.
const audited=window.TakumiLessonAuditPatches||{};
for(const l of lessons){
 const patch=audited[l.id];
 if(patch){
  if(patch.question)l.practice[0]=patch.question;
  if(patch.hint)l.practice[1]=patch.hint;
  if(patch.answer)l.practice[2]=patch.answer;
  if(patch.worked){
   if(!Array.isArray(patch.worked)||patch.worked.length<4||!Array.isArray(patch.worked[1]))throw Error('Invalid worked example '+l.id);
   l.steps.splice(l.steps.length-2,0,patch.worked);
  }
 }
 // The independent exercise comes last: never display its hint in advance.
 const last=l.steps[l.steps.length-1];
 last[0]='仕上げ｜初見問題を自力で解く';
 last[1]=[l.practice[0]]; // Replace the entire worked board: never mix an earlier example with the new exercise.
 last.length=4; // The exercise must not reuse an old multiple-choice checkpoint.
 last[2]='まず紙で自力で解き、理由と途中式を残しましょう。行き詰まった場合だけ下の「ヒント・解答」を開いてください。';
 last[3]='ここからは別問題です。解説は閉じ、考え方と途中式を自分で書いてから答え合わせをしてください。';
 for(const s of l.steps){
  s[2]=s[2].replaceAll('。。','。').replaceAll('式または英文の各部分を確かめます',l.subject==='math'?'等号・不等号と一行ごとの操作を確かめます':'主語・動詞・時と語順を確かめます');
  s[3]=s[3].replaceAll('。。','。').replaceAll('式または英文の各部分を確かめます',l.subject==='math'?'式の各行を確かめます':'英文の各部分を確かめます');
 }
}
// Quality-gated, fully worked lesson corrections load after prior legacy rewrites.
for(const [id,fix] of Object.entries(window.TakumiLessonContinuityFixes||{})){
 const lesson=lessons.find(l=>l.id===id);
 if(!lesson)throw Error('Continuity correction target is missing: '+id);
 if(!Array.isArray(fix.practice)||fix.practice.length!==3||fix.practice.some(v=>typeof v!=='string'||v.length<8))
  throw Error('Incomplete independent practice: '+id);
 if(!Array.isArray(fix.steps)||fix.steps.length<6||fix.steps.some(s=>!Array.isArray(s)||s.length<4||s[1].length<2||String(s[2]).length<25||String(s[3]).length<25))
  throw Error('Explanation gap detected: '+id);
 // Clone shared lesson data: the final stage is customized for each independent exercise.
 lesson.steps=JSON.parse(JSON.stringify(fix.steps));
 lesson.practice=[...fix.practice];
 lesson.level='理由から一行ずつ学ぶ';
 lesson.minutes='約12〜20分・分割受講可';
 lesson.continuityChecked=true;
 // The continuity module is applied after the legacy audit, so normalize its last slide too.
 const final=lesson.steps[lesson.steps.length-1];
 final[0]='仕上げ｜初見問題を自力で解く';
 final[1]=[lesson.practice[0]];
 final[2]='まず自分の力で解き、途中式と理由を書きます。答え合わせが終わるまでヒントを開かないでください。';
 final[3]='ここからは新しい問題です。ノートに解答を書いてから確認しましょう。';
 final.length=4;
}
window.TakumiApplyMasterclass(lessons);
const el=(tag,text,cls)=>{const x=document.createElement(tag);if(text!==undefined&&text!==null)x.textContent=String(text);if(cls)x.className=cls;return x};
const screen=el('section',null,'screen ts-video-screen');screen.id='ts-video-screen';document.querySelector('.wrap').appendChild(screen);
let selected=null,index=0,from='home',timer=null,auto=false,speed=1,answers=new Map(),decisionAnswers=new Map(),spoken=null,origin=null,catalogSubject='math',voiceMode=false;
function cancelAudio(){try{window.speechSynthesis?.cancel()}catch(e){}spoken=null}
function stop(){if(timer!==null)clearTimeout(timer);timer=null;auto=false;voiceMode=false;cancelAudio()}
const priorShow=show;show=function(id){if(id!==screen.id)stop();priorShow(id)};
function exit(){stop();selected=null;show(from)}
function openList(source,subject='math'){stop();selected=null;origin=null;from=source||from;catalogSubject=subject==='english'?'english':'math';paintList();show(screen.id)}
function openLesson(id,source,stage=0,sourceQuestion=null){
 stop();selected=lessons.find(x=>x.id===id)||lessons[0];catalogSubject=selected.subject;from=source||from;
 index=Math.max(0,Math.min(selected.steps.length-1,Math.floor(Number(stage)||0)));
 origin=sourceQuestion;answers=new Map();decisionAnswers=new Map();paintPlayer();show(screen.id)
}
function paintList(){
 screen.replaceChildren();
 const b=el('button','← 戻る','back');b.type='button';b.onclick=exit;
 screen.append(b,el('h2',catalogSubject==='english'?'英語｜考えて学ぶ文法授業':'数学｜考えて学ぶ板書授業'),el('p','📚 はじめての単元は「総合授業」から。基本の意味→理由→板書例→間違いの原因→自力問題を学び、次に個別授業へ進みます。端末の読み上げに対応。授業視聴は正答率に加算しません。','ts-note'));
 const groups=catalogSubject==='english'?['be動詞','一般動詞','三単現','疑問文・否定文','現在進行形','過去形','英文読解・記述']:['一次不等式','代数の基礎','連立方程式','図形・合同・証明'];
 for(const group of groups){
  const subset=lessons.filter(l=>l.subject===catalogSubject&&l.group===group).sort((a,b)=>Number(!!b.overview)-Number(!!a.overview));
  if(!subset.length)continue;
  const fold=el('details',null,'ts-lesson-group');fold.open=group===(catalogSubject==='english'?'一般動詞':'一次不等式');
  const heading=el('summary',group+'（総合1＋個別'+(subset.length-1)+'講座）','ts-lesson-group-title');
  fold.appendChild(heading);
  const grid=el('div',null,'ts-vgrid');
  for(const l of subset){
   const btn=el('button',null,'ts-vcard'+(l.overview?' ts-overview-card':''));btn.type='button';
   btn.append(el('span',(l.overview?'📚 まずはここから｜':'')+l.level+'・'+l.minutes,'ts-level'),el('strong',l.title),el('small',l.subtitle));
   btn.onclick=()=>openLesson(l.id,from);grid.appendChild(btn);
  }
  fold.appendChild(grid);screen.appendChild(fold);
 }
}
function speak(override){
 const st=selected?.steps[index],status=document.getElementById('ts-audio-status');if(!st)return;
 cancelAudio();
 const text=override||st[0]+'。'+st[3];
 if(typeof window.SpeechSynthesisUtterance!=='function'||!window.speechSynthesis){
  voiceMode=false;const btn=document.getElementById('ts-voice-btn');if(btn)btn.textContent='🔊 読み上げを試す';
  if(status)status.textContent='このブラウザに日本語音声の読み上げ機能がありません。端末のChromeで開くか、字幕で学習してください。';return false;
 }
 try{
  const u=new window.SpeechSynthesisUtterance(text);u.lang='ja-JP';u.rate=Math.max(.65,Math.min(1.3,.88*speed));u.pitch=1;
  const voices=window.speechSynthesis.getVoices?.()||[];
  const ja=voices.find(v=>/^ja[-_]/i.test(v.lang))||voices.find(v=>v.lang==='ja-JP');
  if(ja)u.voice=ja;
  u.onstart=()=>{if(status)status.textContent='🔊 日本語の説明を読み上げています。音量を確認してください。'};
  u.onend=()=>{if(status)status.textContent='読み上げ終了。次の操作を選んでください。'};
  u.onerror=()=>{if(status)status.textContent='読み上げに失敗しました。ブラウザの音量・端末の日本語音声を確認してください。録音音声は未対応です。'};
  spoken=u;
  window.speechSynthesis.speak(u);
  if(status)status.textContent='音声の開始待ちです。聞こえなければChromeの音声設定を確認してください。';
  return true;
 }catch(e){if(status)status.textContent='端末の読み上げ機能を起動できませんでした。字幕でも学べます。';return false;}
}
function speakPrompt(){
 const st=selected?.steps[index];if(!st||!voiceMode)return;
 const prompt=selected?.steps[index]?.[4]?.[0]||(!selected.deepDetailed&&!selected.continuityChecked&&window.TakumiTutorDecisions?.[selected.id]?.[index]?.prompt)||
   (selected.continuityChecked?null:thinkQuestions[selected.id]?.[index])||'次に何をするか考えてください。';
 speak(st[0]+'。'+prompt+'。まず自分で考えて、選択してください。');
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
 index=next;paintStep();if(voiceMode)speakPrompt()
}
function toggleAuto(){if(auto){auto=false;if(timer!==null)clearTimeout(timer);timer=null;setAutoButton();return}
 if(index===selected.steps.length-1)index=0;auto=true;paintStep()}
function paintPlayer(){
 screen.replaceChildren();
 const back=el('button','← 授業一覧','back');back.type='button';back.onclick=()=>{stop();paintList()};
 screen.append(back,el('h2',selected.title),el('p',selected.level+'｜'+selected.subtitle+'｜'+selected.minutes,'ts-note'));
 const unit=window.TakumiDeepTeachingUnits?.[selected.subject]?.[selected.group];
 if(unit){
  const pre=el('details',null,'ts-prereq');pre.open=!selected.overview;
  pre.appendChild(el('summary','📖 解く前にここを理解｜'+unit.name));
  const inner=el('div',null,'ts-prereq-inner');
  inner.appendChild(el('p',unit.core,'ts-prereq-core'));
  const guide=el('ol',null,'ts-prereq-examples');
  for(const line of unit.pre)guide.appendChild(el('li',line));
  inner.appendChild(guide);
  inner.appendChild(el('p','よくある誤り：'+unit.mistake,'ts-prereq-warning'));
  const qbox=el('div',null,'ts-prereq-quiz');
  qbox.appendChild(el('strong','まずは前提を確かめよう'));
  qbox.appendChild(el('p',unit.quiz[0]));
  const feedback=el('p','','ts-prereq-response');
  for(let j=0;j<unit.quiz[1].length;j++){
   const b=el('button',unit.quiz[1][j],'secondary');
   b.type='button';
   b.onclick=()=>{feedback.textContent=(j===unit.quiz[2]?'正解です。':'もう一度、前提を読みましょう。')+unit.quiz[3]};
   qbox.appendChild(b);
  }
  qbox.appendChild(feedback);inner.appendChild(qbox);pre.appendChild(inner);screen.appendChild(pre);
 }
 if(selected.overview){
  const guide=el('div',null,'ts-overview-guide');
  guide.append(el('strong','📚 単元の総合授業'),el('p','基本の意味・理由・板書例・間違いやすい点・自力問題を一通り教えます。長ければ分けて学び、目次から気になる場面を復習できます。'));
  const toc=el('details',null,'ts-overview-chapters');
  toc.appendChild(el('summary','目次を見る・場面を選んで学ぶ'));
  const nav=el('div',null,'ts-overview-chapter-list');
  selected.steps.forEach((s,i)=>{
   const jump=el('button',(i+1)+'. '+s[0],'secondary');jump.type='button';
   jump.onclick=()=>{stop();index=i;answers=new Map();decisionAnswers=new Map();paintStep();toc.open=false};
   nav.appendChild(jump);
  });
  toc.appendChild(nav);guide.appendChild(toc);screen.appendChild(guide);
 }
 if(origin){
  const context=el('div',null,'ts-question-bridge');
  context.append(el('strong','いま解いた問題に関連する授業です'),el('p',origin.q));
  if(origin.note)context.appendChild(el('p',origin.note,'ts-note'));
  context.appendChild(el('small','※ この授業は解き方を説明します。問題の数値・設問形式は異なる場合があります。'));
  screen.appendChild(context);
 }
 const outer=el('div',null,'ts-progress');const inside=el('div',null,'ts-progress-bar');inside.id='ts-progress-fill';outer.appendChild(inside);screen.appendChild(outer);
 const prog=el('p',null,'ts-note ts-count');prog.id='ts-stage-count';screen.appendChild(prog);
 const starter=el('button','🔊 音声つきで授業を始める（タップ）','secondary ts-voice-start');
starter.type='button';starter.id='ts-voice-starter';starter.onclick=()=>{
 voiceMode=true;
 const b=document.getElementById('ts-voice-btn');if(b)b.textContent='🔇 読み上げを止める';
 speakPrompt();
};
screen.appendChild(starter);
screen.appendChild(el('p','まず考え方を聞き、選択してから板書の続きを表示します。録画動画ではなく端末の音声合成です。','ts-voice-help'));
 const stage=el('div',null,'ts-vstage');stage.id='ts-vstage';screen.appendChild(stage);
 const controls=el('div',null,'ts-vcontrols');
 const prev=el('button','← 前へ','secondary');prev.type='button';prev.id='ts-vprev';prev.onclick=()=>changeStep(-1);
 const next=el('button','次へ →','secondary');next.type='button';next.id='ts-vnext';next.onclick=()=>changeStep(1);
 const play=el('button','▶ 板書を自動再生','secondary');play.type='button';play.id='ts-autobtn';play.onclick=toggleAuto;
 const voice=el('button','🔊 解説を音声で聞く','secondary');voice.type='button';voice.id='ts-voice-btn';voice.onclick=()=>{
 if(voiceMode){voiceMode=false;cancelAudio();voice.textContent='🔊 解説を音声で聞く';return}
 voiceMode=true;voice.textContent='🔇 読み上げを止める';speakPrompt();
};
 const speedLabel=el('label','音声の速度 ','ts-speed');const sel=el('select');sel.setAttribute('aria-label','再生速度');
 for(const v of [.75,1,1.25,1.5]){const o=el('option',v+'倍');o.value=v;if(v===speed)o.selected=true;sel.appendChild(o)}
 sel.onchange=()=>{speed=Number(sel.value)||1};speedLabel.appendChild(sel);
 // Do not offer automatic text animation as a substitute for learning. Students must make decisions.
 controls.append(prev,next,voice,speedLabel);screen.appendChild(controls);
if(selected.subject==='english'){
 const en=el('button','🇬🇧 英文だけ発音','secondary ts-en-pronounce');en.type='button';en.onclick=()=>speakEnglish();
 screen.appendChild(en);
}
 const audio=el('p','音声は録音ではなく端末の読み上げ機能です。最初に「音声つきで授業を始める」を押してください。音が出ない場合はChromeの音量と日本語音声の設定を確認してください。','ts-note');audio.id='ts-audio-status';
 const autoStatus=el('p','','ts-note');autoStatus.id='ts-auto-status';
 screen.append(audio,autoStatus,el('p','※ 録画された映像授業ではありません。考える→解説を見る→確認する形式の学習画面です。視聴は正答率に加算しません。','ts-note'));
 paintStep();
}
function revealStep(){
 const stage=document.getElementById('ts-vstage');if(!stage)return;
 const prompt=stage.querySelector('.ts-think');if(prompt)prompt.style.display='none';
 const lineBtn=stage.querySelector('#ts-next-line');
 if(lineBtn)lineBtn.style.display='';
 const lines=[...stage.querySelectorAll('.ts-formula')];
 if(auto){
  for(const line of lines)line.style.display='';
  showTeachingNotes();
 }else{showNextLine()}
}
function showTeachingNotes(){
 const stage=document.getElementById('ts-vstage');if(!stage)return;
 for(const child of stage.querySelectorAll('.ts-after-think:not(.ts-formula)'))child.style.display='';
 const next=document.getElementById('ts-vnext');if(next)next.disabled=false;
 const lineBtn=stage.querySelector('#ts-next-line');if(lineBtn)lineBtn.style.display='none';
}
function showNextLine(){
 const stage=document.getElementById('ts-vstage');if(!stage)return;
 const hidden=[...stage.querySelectorAll('.ts-formula')].find(x=>x.style.display==='none');
 if(hidden){hidden.style.display='';}
 const remaining=[...stage.querySelectorAll('.ts-formula')].some(x=>x.style.display==='none');
 const button=stage.querySelector('#ts-next-line');
 if(button)button.textContent=remaining?'次の式を1行ずつ表示 →':'解説と確認問題を表示 →';
 if(!hidden||!remaining)showTeachingNotes();
}
function speakEnglish(){
 const st=selected?.steps[index],status=document.getElementById('ts-audio-status');if(!st)return;
 const isSentence=x=>/^[A-Za-z][A-Za-z0-9 .,!?'’:\-]+$/.test(String(x).trim())&&/[A-Za-z]{2}/.test(x);
 const candidates=[...st[1],selected.practice[2]].map(x=>String(x).replace(/^[★✓①②]\s*/, '').trim());
 const english=candidates.find(isSentence);
 if(!english){if(status)status.textContent='この場面には発音用の英文がありません。前後の英文例を選んでください。';return}
 cancelAudio();
 try{
  if(!window.speechSynthesis||typeof window.SpeechSynthesisUtterance!=='function')throw Error('unsupported');
  const utterance=new window.SpeechSynthesisUtterance(english);utterance.lang='en-US';utterance.rate=Math.max(.62,Math.min(1.2,.78*speed));
  const voices=window.speechSynthesis.getVoices?.()||[];
  const en=voices.find(v=>/^en[-_]/i.test(v.lang));if(en)utterance.voice=en;
  utterance.onerror=()=>{if(status)status.textContent='英語音声が利用できません。端末の読み上げ設定をご確認ください。'};
  spoken=utterance;window.speechSynthesis.speak(utterance);
  if(status)status.textContent='発音例：'+english;
 }catch(e){if(status)status.textContent='端末の英語音声を起動できませんでした。英文は画面に表示されています。'}
}

const thinkQuestions={
 coef:['どの文字を消せばよいだろう？','①を何倍すれば係数がそろう？','式を引くと何が消える？','残った文字をどう求める？','元の2本で確かめた？'],
 sub:['どの式なら文字を置き換えやすい？','yの代わりにどの式を入れる？','同類項はどうまとめる？','もう一方の文字を求めた？','2本とも成立する？'],
 'en-third':['この主語はhe、she、itのどれ？','三単現では何を付ける？','watchの語尾に注意すると？','studyとplayはどう違う？','主語が複数なら？'],
 'en-question':['主語は三人称単数？','Doesの後の動詞は何形？','複数主語なら？','否定文の語順は？','付け足す情報を省いていない？'],
 'en-why':['Whyは何を尋ねている？','理由を示す語句は？','Becauseの後に何が必要？','代名詞は誰を指す？','本文にない理由を付けていない？']
};
function paintStep(){
 if(!selected)return;const st=selected.steps[index],target=document.getElementById('ts-vstage');if(!target)return;
 if(timer!==null)clearTimeout(timer);timer=null;target.replaceChildren();
 target.appendChild(el('h3',st[0]));
 const board=el('div',null,'ts-blackboard');
 for(const [j,line] of st[1].entries()){
  const special=line.startsWith('★'),good=line.startsWith('✓');
  const item=el('div',special?line.slice(2):line,'ts-formula'+(special?' ts-highlight':good?' ts-good':'')+(j>0?' ts-after-think':''));
  if(j>0)item.style.display='none';board.appendChild(item);
 }
 target.appendChild(board);
 const thought=el('div',null,'ts-think');
 const finalPractice=index===selected.steps.length-1;
 const builtInQuiz=finalPractice?null:st[4];
 const tutor=builtInQuiz?{prompt:builtInQuiz[0],options:builtInQuiz[1],correct:builtInQuiz[2],reason:builtInQuiz[3],wrong:builtInQuiz[4]}:
   ((selected.deepDetailed||selected.continuityChecked||finalPractice)?null:window.TakumiTutorDecisions?.[selected.id]?.[index]);
 const prompt=finalPractice?'ここからは新しい問題です。ノートに理由と途中式（英語なら主語・動詞・語順）を書き、答えを出してから確認しましょう。':(tutor?.prompt||(selected.continuityChecked?null:thinkQuestions[selected.id]?.[index])||'この場面の板書を見て、何をしたか・なぜ許されるかを自分の言葉で説明しよう。');
 const reveal=el('button',finalPractice?'自力で解いたので、答え合わせへ':'考えたので、解説を開く','secondary');reveal.type='button';reveal.id='ts-reveal';
 reveal.disabled=!!tutor&&decisionAnswers.get(index)===undefined;
 reveal.onclick=()=>{if(reveal.disabled)return;revealStep();if(voiceMode)speak(st[0]+'。'+st[3])};
 thought.append(el('strong','✏️ まず自分で考える'),el('p',prompt));
 if(tutor){
  const options=el('div',null,'ts-decision-choices'),result=el('p','','ts-decision-feedback');
  const prior=decisionAnswers.get(index);
  tutor.options.forEach((opt,j)=>{
   const b=el('button',opt,'secondary');b.type='button';
   if(prior!==undefined){b.disabled=true;if(j===tutor.correct)b.classList.add('ts-correct')}
   b.onclick=()=>{
    const correct=j===tutor.correct;
    result.textContent=(correct?'その判断で正しいです。':'どこが違うか考えてもう一度選びましょう。')+
      (correct?tutor.reason:(tutor.wrong?.[j]||tutor.reason));
    if(correct){
      decisionAnswers.set(index,j);
      for(const child of options.children)child.disabled=true;
      b.classList.add('ts-correct');
      reveal.textContent='板書を一行ずつ開いて確かめる →';reveal.disabled=false;
    }else{
      b.classList.add('ts-incorrect');b.disabled=true;
      if([...options.children].every(el=>el.disabled)){
        for(const child of options.children)if(!child.classList.contains('ts-incorrect'))child.disabled=false;
      }
    }
    if(voiceMode)speak(result.textContent);
   };options.appendChild(b);
  });
  if(prior!==undefined){result.textContent=(prior===tutor.correct?'その判断で正しいです。':'ここで考え直しましょう。')+
    (prior===tutor.correct?tutor.reason:(tutor.wrong?.[prior]||tutor.reason));}
  thought.append(options,result);
 }
 thought.appendChild(reveal);target.appendChild(thought);
 const nextLine=el('button','次の式を1行ずつ表示 →','secondary ts-next-line');nextLine.id='ts-next-line';nextLine.type='button';nextLine.style.display='none';nextLine.onclick=()=>showNextLine();target.appendChild(nextLine);
 const explanation=el('p',st[2],'ts-explain ts-after-think');explanation.style.display='none';target.appendChild(explanation);
 // The embedded checkpoint appears before the explanation, not duplicated afterward.
 if(index===selected.steps.length-1){
  const p=el('div',null,'ts-practice');p.append(el('strong',selected.subject==='english'?'仕上げ：自分で英文を書いてみる':'仕上げ：解説を閉じて紙で解こう'),el('p','上の新しい問題を解き終えたら、必要に応じて下のヒント・解答を開いて確かめましょう。'));
  const d=el('details');d.append(el('summary','ヒント・解答を確認'),el('p','ヒント：'+selected.practice[1]),el('p','模範解答：'+selected.practice[2]));
  if(selected.subject==='english'){
   const label=el('label','✍️ 英文を最後まで書く（4択ではありません）','ts-write-label');
   const field=el('textarea');field.id='ts-english-write';field.rows=3;field.placeholder='主語と動詞を含む英文を入力してください。';field.setAttribute('aria-label','英文の自力練習');
   label.appendChild(field);p.appendChild(label);
   const compare=el('button','自分の英文と模範文を比較する','secondary ts-write-compare');compare.type='button';
   const response=el('p','','ts-write-feedback');
   compare.onclick=()=>{
    const student=String(field.value||'').trim();
    if(!student){response.textContent='まだ英文がありません。まず自分で1文を書いてください。';return}
    const target=String(selected.practice[2]).trim();
    const normalized=x=>x.toLowerCase().replace(/[’‘]/g,"'").replace(/[.?!,]/g,'').replace(/\s+/g,' ').trim();
    const simple=/^[A-Za-z][A-Za-z0-9 ,.!?'’:\-]+$/.test(target);
    if(simple&&normalized(student)===normalized(target)){
      response.textContent='模範文と一致しました。なぜこの動詞の形・語順なのかも説明しましょう。';
    }else{
      response.textContent='模範文と比べ、主語・動詞の形・語順・時の言葉を確かめましょう。これは自動採点ではありません。';
    }
    d.open=true;
   };
   p.append(compare,response,el('p','※入力文は学力記録に加算しません。正確な自由記述採点ではないため、模範文と理由を見比べて直してください。','ts-note'));
  }
  p.appendChild(d);p.classList.add('ts-after-think');p.style.display='none';target.appendChild(p)
 }
 const progress=document.getElementById('ts-progress-fill');if(progress)progress.style.width=Math.round((index+1)/selected.steps.length*100)+'%';
 const ct=document.getElementById('ts-stage-count');if(ct)ct.textContent='場面 '+(index+1)+' / '+selected.steps.length;
 const prev=document.getElementById('ts-vprev');if(prev)prev.disabled=index===0;
 const next=document.getElementById('ts-vnext');if(next){next.textContent=index===selected.steps.length-1?'授業一覧へ':'次へ →';next.disabled=true}
 const status=document.getElementById('ts-audio-status');if(status)status.textContent=voiceMode?'問題を考えたあと、板書を1行ずつ確認してください。':'音声を使う場合は上の「音声つきで授業を始める」を押してください。';
 const autoStatus=document.getElementById('ts-auto-status');if(autoStatus)autoStatus.textContent='';
 setAutoButton();if(auto){revealStep();tick()}
}

function matchQuestion(q){
 if(!q)return null;
 const s=String(q.q||''),id=String(q.id||''),u=String(q.u||'');
 let match=null;
 if(u==='be動詞'){
  match=/yesterday|last |was|were|過去/.test(s)?['en2-be-past',1]:
    /疑問|否定|Are |Is |am not|are not|is not/.test(s)?['en2-be-question',1]:
    /they|we|friends|boys|dogs|parents|複数/i.test(s)?['en2-be-plural',1]:['en2-be-am',1];
 }else if(u==='一般動詞'){
  match=/not|don't|do not|否定|does not/i.test(s)?['en2-verb-negative',1]:
   /疑問|Do |Does |\?/.test(s)?['en2-verb-question',1]:
   /並べ替え|語順|\[/.test(s)?['en2-verb-order',1]:['en-verb',1];
 }else if(u==='三単現'){
  match=/stud|carr|yから|ies|語尾.*y/.test(s)?['en2-third-y',1]:
   /watch|wash|go |goes|esを付け/.test(s)?['en2-third-es',1]:['en-third',1];
 }else if(u==='疑問文・否定文'){
  match=/when|where|why|what|疑問詞/i.test(s)?['en2-wh',1]:
   /答え|Yes|No|返答|短く/.test(s)?['en2-short-reply',1]:
   /Does|三単現|he|she|Ken|Mika/i.test(s)?['en2-third-does',1]:['en-question',1];
 }else if(u==='英文読解'){
  match=/When|時刻|何時|曜日/i.test(s)?['en2-read-when',1]:
   /Why|because|理由/i.test(s)?['en2-read-why',1]:['en2-read-full',1];
 }else if(u==='現在進行形'){
  match=/疑問|Are |Is |\?/.test(s)?['en2-progressive-question',1]:
   /否定|not|isn't|aren't/.test(s)?['en2-progressive-negative',1]:['en2-progressive-form',1];
 }else if(/過去形/.test(u)){
  match=/Did |疑問|否定|did not|didn't/i.test(s)?['en2-past-did',1]:
   /went|ate|saw|不規則|go |eat |see /i.test(s)?['en2-past-irregular',1]:['en2-past-ed',1];
 }else if(u==='1次不等式'){
  const first={M006:['ineq-basic',0],M031:['ineq-basic',0],M007:['ineq-negative',0],M032:['ineq-negative',0],
  M008:['ineq-symbol',4],M033:['ineq-symbol',4],M009:['ineq-symbol',1],M034:['ineq-symbol',1],
  M010:['ineq-symbol',3],M035:['ineq-symbol',3],M011:['ineq-basic',1],M036:['ineq-basic',1]};
  match=first[id]||(
   /括弧|かっこ|分配|−\s?\d+\s*\(|-\s?\d+\s*\(/.test(s)?['ineq2-bracket',1]:
   /分数|小数|\/|÷/.test(s)?['ineq2-fraction',1]:
   /負の数|負数|負の係数|マイナス|反転|逆向き/.test(s)?['ineq2-negative',1]:
   /以上|以下|未満|境界|含む|どの不等号/.test(s)?['ineq-symbol',1]:['ineq2-basic',1]);
 }else if(u==='正負の数'){
  match=/積|商|掛け算|割り算|同符号|異符号/.test(s)?['algebra-mul',1]:['al2-sign',1];
 }else if(u==='指数・累乗'){
  match=['al2-power',1];
 }else if(u==='分数・小数'){
  match=/割り算|÷|逆数/.test(s)?['al2-division',1]:['al2-common',1];
 }else if(u==='文字式'){
  match=/分配|展開|括弧|かっこ/.test(s)?['al2-distributive',1]:['al2-like',1];
 }else if(u==='一次方程式'){
  match=['al2-equation',1];
 }else if(u==='分数方程式'){
  match=['algebra-frac',1];
 }else if(u==='連立方程式'){
  const originals={
   M001:['add',0],M026:['add',0],M002:['coef',0],M027:['coef',0],M003:['sub',0],M028:['sub',0],
   M004:['fraction',0],M029:['fraction',0],M005:['word',1],M030:['word',1]
  };
  match=originals[id]||(
   /分数|小数|分母|通分|÷|\//.test(s)?['fraction',1]:
   /文章題|冊|本|代金|個数|人数|合計|速さ|濃度|買い物|何円/.test(s)?['sim2-word',1]:
   /【加減法】/.test(s)?['sim2-minus',1]:
   /分配|括弧|かっこ|符号|負の数|−2\(|-\s*2\(/.test(s)?['sim2-subbracket',1]:
   /【連立・代入】|代入法|代入|y[=＝]/.test(s)?['sim2-subneg',1]:
   /係数|そろえ|同じ数倍|２倍|2倍|３倍|3倍/.test(s)?['sim2-lcm',1]:['sim2-add',1]);
 }else if(u==='図形の性質と合同'||u==='証明'||u==='図形の基本'){
  match=/共通|仮定|証明|根拠|結論/.test(s)?['geo2-proof',1]:
   /対頂角/.test(s)?['geo2-vertical',1]:
   /平行|錯角|同位角/.test(s)?['geo2-parallel',1]:
   /3組の辺|三辺|SSS/.test(s)?['geo2-sss',1]:
   /2組の辺|その間の角|SAS/.test(s)?['geo2-sas',1]:
   /両端の角|ASA/.test(s)?['geo2-asa',1]:['geo2-proof',1];
 }else return null;
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
 const b=el('button',wrong?'▶ 間違えた問題を授業で復習':'▶ 関連する授業で確認','secondary ts-video-quiz');
 b.type='button';
 b.setAttribute('aria-label',(wrong?'間違い直し：':'関連解説：')+route.title);
 b.onclick=()=>openForQuestion(q,source);
 target.appendChild(b);
 return b;
}
const home=document.getElementById('home');
if(home && !document.getElementById('ts-lesson-entrance')){
 const p=el('div',null,'ts-video-home');p.append(el('strong','✏️ 数学の対話型板書授業'),el('p','代数・連立・不等式・合同と証明。考えて選ぶ → 途中式を1行ずつ → 類題。音声は端末の読み上げ機能です。'));
 const b=el('button','▶ 授業一覧を開く','secondary');b.type='button';b.onclick=()=>openList('home');p.appendChild(b);
 const near=home.querySelector('.home-help');if(near)home.insertBefore(p,near);else home.appendChild(p)
}
if(home && !document.getElementById('ts-lesson-entrance')){
 const ep=el('div',null,'ts-video-home ts-english-home');ep.append(el('strong','📘 英語の対話型授業'),el('p','be動詞・一般動詞・三単現・疑問文・進行形・過去形・読解。選択→理由→一文で答える練習。'));
 const ebtn=el('button','▶ 英語の授業一覧を開く','secondary');ebtn.type='button';ebtn.onclick=()=>openList('home','english');ep.appendChild(ebtn);
 const math=home.querySelector('.ts-video-home');if(math)math.after(ep);else home.appendChild(ep);
}
const oldAnswer=answer;
answer=function(...args){
 const q=state?.set?.[state.i],cat=state?.cat;
 const eligible=(cat==='math'||cat==='english')&&matchQuestion(q);
 const isCorrect=args[0]===state.correctIndex;
 oldAnswer(...args);
 if(!eligible||!state.locked)return;
 const f=document.getElementById('feedback');
 if(!f||f.querySelector('.ts-video-quiz'))return;
 attachQuestionLink(f,q,'quiz',!isCorrect);
};
const css=`
.ts-lesson-group{margin:14px 0;background:#f8fafc;border:1px solid #d9e3ed;border-radius:13px;overflow:hidden}
.ts-lesson-group-title{font-size:16px;font-weight:800;padding:14px 15px;cursor:pointer;color:#23415a}
.ts-lesson-group[open] .ts-lesson-group-title{border-bottom:1px solid #d9e3ed;background:#edf4fa}
.ts-lesson-group .ts-vgrid{padding:12px}
.ts-video-home{margin:14px 0;padding:15px;border:1px solid #ced9e9;background:#edf3fb;border-radius:15px}
.ts-video-home strong{font-size:16px}.ts-video-home p{font-size:13px;line-height:1.65}
.ts-video-home button,.ts-video-quiz{width:100%;margin-top:9px;font-weight:700}.ts-question-bridge{border:1px solid #c8d8e7;background:#eef6fb;padding:12px 14px;border-radius:12px;margin:12px 0;line-height:1.6}.ts-question-bridge p{font-size:14px;margin:7px 0}.ts-question-bridge small{font-size:11px;color:#5c6d7f}
.ts-video-screen h2{font-size:21px;margin:14px 0;line-height:1.5}
.ts-note{font-size:12px;color:#5c6d7f;line-height:1.7}.ts-vgrid{display:grid;grid-template-columns:1fr;gap:12px}
.ts-vcard{display:flex;flex-direction:column;gap:8px;border:1px solid #d8e2ed;background:white;padding:16px;text-align:left;border-radius:15px}
.ts-vcard strong{font-size:17px}.ts-vcard small{color:#65727f;font-size:12px}.ts-level{font-size:12px;font-weight:800;color:#416983}
.ts-overview-card{border:2px solid #6e9cb5;background:#eaf4fa;box-shadow:0 2px 6px #132f400d}
.ts-overview-card strong{font-size:18px}.ts-overview-card .ts-level{color:#194b6c}
.ts-overview-guide{background:#eaf4fa;border:1px solid #c2d9e7;border-radius:14px;padding:14px;margin:12px 0}
.ts-overview-guide p{font-size:13px;line-height:1.75;color:#34566c}
.ts-overview-chapters{margin-top:10px;background:white;border-radius:10px;padding:12px;border:1px solid #bdd0df}
.ts-overview-chapters summary{font-weight:750;cursor:pointer;line-height:1.65}
.ts-overview-chapter-list{display:grid;grid-template-columns:1fr;gap:7px;margin-top:12px;max-height:270px;overflow-y:auto}
.ts-overview-chapter-list button{text-align:left;padding:10px 12px;font-size:13px;min-height:42px;line-height:1.4}
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
.ts-think{margin:12px 0 0;padding:15px;background:#fff5e8;border:1px solid #ead2af;border-radius:12px}
.ts-think strong{font-size:15px;color:#694621}.ts-think p{line-height:1.7;font-size:14px}
.ts-think button{width:100%;min-height:44px;background:#fff;font-weight:800}
.ts-voice-start{display:block;width:100%;min-height:52px;border:2px solid #74a9c3!important;background:#eaf5fc!important;color:#13394f;font-weight:900;margin:12px 0 5px}
.ts-voice-help{font-size:12px;color:#536878;line-height:1.5;margin:0 0 10px}
.ts-decision-choices{display:grid;gap:7px;margin:11px 0}
.ts-decision-choices button{min-height:44px;text-align:left;background:#fff}
.ts-decision-choices button.ts-correct{background:#d7f2e4;border-color:#65a688;color:#153c2e}
.ts-decision-choices button.ts-incorrect{background:#ffe9d9;border-color:#b96b53;color:#5a2e21}
.ts-decision-feedback{font-size:13px;line-height:1.6;font-weight:650;color:#3f4f61}
.ts-next-line{width:100%;min-height:48px;margin:12px 0;background:#eef4f8;font-weight:750}
.ts-vcontrols button:disabled{opacity:.45}
.ts-en-pronounce{display:block;margin:10px 0;width:100%}
.ts-prereq{border:1px solid #bcd4e5;border-radius:14px;background:#f0f7fc;margin:12px 0;padding:12px}
.ts-prereq>summary{font-weight:800;cursor:pointer;line-height:1.6;color:#214d69}
.ts-prereq-inner{padding:9px 2px 3px;line-height:1.75;font-size:14px}
.ts-prereq-core{font-weight:650}.ts-prereq-examples{padding-left:22px}.ts-prereq-examples li{margin-bottom:5px}
.ts-prereq-warning{padding:9px;border-left:3px solid #bd8b53;background:#fff8ed}
.ts-prereq-quiz{background:#fff;padding:10px;border:1px solid #d5e2eb;border-radius:10px;display:grid;gap:7px}
.ts-prereq-quiz button{min-height:40px;text-align:left;background:#fafcfe}
.ts-prereq-response{font-size:13px;font-weight:650}
.ts-write-label{display:block;font-weight:800;margin:14px 0 8px}
.ts-write-label textarea{width:100%;font:inherit;min-height:95px;margin-top:9px;padding:12px;border:1px solid #afc4d5;border-radius:10px;background:white;color:#172b3c;line-height:1.6}
.ts-write-compare{width:100%;min-height:46px;margin:8px 0}
.ts-write-feedback{font-size:14px;font-weight:700;line-height:1.6}
.ts-english-home{background:#f6f8ff;border-color:#d4dcf5}
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
window.TakumiVideoLessons={openLibrary:openList,openLesson,openForQuestion,matchQuestion,attachQuestionLink,lessonList:lessons.map(x=>({id:x.id,subject:x.subject,group:x.group,title:x.title,level:x.level,steps:x.steps.length,qualityChecked:!!x.qualityChecked,overview:!!x.overview})),version:'3.4.0'};
})();