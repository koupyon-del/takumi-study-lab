/* Study Lab: answer explanations and self-review, v1.8.0.
   UI-only learning aid. The original correctness, question IDs and evidence remain unchanged.
   Review drill answers are never counted as trusted independent answers. */
(function(){
'use strict';
const named={math:'数学',english:'英語',japanese:'国語',science:'理科',history:'歴史',geography:'地理',waka:'百人一首'};
const byId={};
for(const [cat,qs] of Object.entries(data))for(const q of qs)byId[q.id]={q,cat};
const clean=s=>String(s||'').replace(/^【[^】]+】\s*/,'').replace(/\s+/g,'').normalize('NFKC');
const say=(tag,txt,cls)=>{const e=document.createElement(tag);if(txt!==undefined)e.textContent=String(txt);if(cls)e.className=cls;return e;};
const renderMath=e=>{if(e&&typeof window.TakumiMathFractions?.displayMath==='function')window.TakumiMathFractions.displayMath(e);};
const num=s=>Number(String(s||'').replace(/[－−]/g,'-'));
function explain(q,cat){
 const s=clean(q.q),answer=String(q.c?.[q.a]||''),raw=String(q.e||'');
 const steps=[];
 const add=t=>{if(t&&!steps.includes(t))steps.push(t);};
 if(cat==='math'){
  const m=s.match(/x\+y=([+\-]?\d+)、x\-y=([+\-]?\d+)/);
  const m2=s.match(/2x\+y=([+\-]?\d+)、x\-y=([+\-]?\d+)/);
  if(m){
   const sum=num(m[1]),difference=num(m[2]),x=(sum+difference)/2,y=(sum-difference)/2;
   add('① 2本の式をたすと、+y と -y が消えて 2x='+(sum+difference)+' になります。');
   add('② 両辺を2で割って x='+x+'。x+y='+sum+' に代入すると y='+y+' です。');
   add('③ x+y='+sum+'、x-y='+difference+' の両方を満たすか検算します。');
  }else if(m2){
   const a=num(m2[1]),b=num(m2[2]),x=(a+b)/3,y=x-b;
   add('① 2本の式をたすと y が消えて 3x='+(a+b)+' になります。');
   add('② 両辺を3で割り x='+x+'。x-y='+b+' に代入して y='+y+'。');
   add('③ 2x+y='+a+' と x-y='+b+' の両方で検算します。');
  }else if(s.includes('連立方程式')||q.u==='連立方程式'){
   add('① 加減法は、同じ文字の係数をそろえて式をたす・ひくことで、未知数を1つ消します。');
   add('② 代入法は、たとえば y=2x-3 を x+2y=14 に入れて x+2(2x-3)=14 とします。括弧全体に2を掛けるのがポイントです。');
   add('③ 1文字を求めたら元の式に戻してもう1文字を求め、2本とも代入して検算します。');
  }else if(q.u==='1次不等式'){
   add('① まず括弧を外し、文字の項と数の項を分けます。移項とは、両辺に同じ数を加減する操作です。');
   add('② 両辺を負の数で掛けたり割ったりするときだけ、不等号の向きを反対にします。例：-2x ≧ 8 なら x ≦ -4。');
   add('③ 境界の数を含むか（≧・≦）、含まないか（＞・＜）を確認します。');
  }else if(q.u==='分数方程式'){
   add('① 分母の最小公倍数を両辺のすべての項に掛け、分母を払います。');
   add('② たとえば x/2+x/3=5 は 6倍して 3x+2x=30、したがって x=6。');
   add('③ 解を元の分数方程式へ戻して検算します。');
  }else if(q.u==='分数・小数'){
   add('① 足し算・引き算は通分して分母をそろえます。掛け算は分子同士・分母同士を掛けます。');
   add('② 分数で割るときは、割る数の逆数を掛けます。例：2/3 ÷ 1/4 = 2/3 × 4/1 = 8/3。');
   add('③ 約分、符号、小数点の位置を最後に確認します。');
  }else if(q.u==='文字式'){
   add('① 同じ文字・同じ次数の項だけをまとめます。xとx²、xとyは別の種類です。');
   add('② 分配法則 a(b+c)=ab+ac では、括弧の中の両方の項に掛けます。');
   add('③ 文字へ数を代入するときは、負の数を括弧で囲むと符号を間違えにくくなります。');
  }else if(q.u==='一次方程式'){
   add('① 両辺に同じ数を加減して、文字のある項を片側に集めます。');
   add('② 文字の係数で両辺を割り、最後に元の式に代入して確かめます。');
   add('③ 括弧があるときは分配法則で外すか、先に両辺を同じ数で割ります。');
  }else if(q.u==='証明'||q.u.includes('合同')||q.u.includes('図形')){
   add('① 問題で与えられた「仮定」、共通な辺、対頂角、平行線の錯角・同位角を探します。');
   add('② 等しい辺・角を3組、必ず「なぜ等しいか」と一緒に書きます。');
   add('③ SSS（3辺）、SAS（2辺と間の角）、ASA（1辺と両端の角）から合同条件を選び、最後に求める結論を書きます。');
  }else if(q.u==='正負の数'){
   add('① 引き算は、引く数の符号を変えた足し算として考えます。');
   add('② 掛け算・割り算は同符号なら正、異符号なら負。符号を決めてから数値を計算します。');
  }else if(q.u==='指数・累乗'){
   add('① 累乗は同じ数を指定回数掛けたものです。（-3）²=9 ですが -3²=-9 です。');
   add('② 同じ底の積は指数をたし、累乗の累乗は指数を掛けます。');
  }else if(q.u.includes('比例')||q.u.includes('関数')){
   add('① 比例は y=ax、一次関数は y=ax+b。式の係数と定数項を区別します。');
   add('② 文字に数を代入するときは、掛け算を先に行い符号を確かめます。');
  }else add('式の意味を確認し、どの性質・公式を使うか説明してから答えを出します。');
 }else if(cat==='english'){
  if(/三単現|一般動詞|疑問文|否定文/.test(q.u)){
   add('① 主語が he・she・it など三人称単数で、現在の一般動詞の肯定文なら、基本形に -s/-es を付けます。');
   add('② 疑問文・否定文は Does/does を使い、後ろの動詞は原形に戻します。I・you・複数主語なら Do/do を使います。');
   add('③ 文中の時を表す語、主語、元の動詞を変えずに答えを作り、つづりを確認します。');
  }else if(/進行形/.test(q.u)){
   add('① 「今〜している」は be動詞＋動詞の-ing形です。');
   add('② 主語に合わせ am/is/are を選び、疑問文ではbe動詞を主語の前に置きます。');
  }else if(/過去形/.test(q.u)){
   add('① 過去の肯定文では動詞を過去形にします。');
   add('② 過去の疑問文・否定文は did/did not＋動詞の原形です。');
  }else if(/未来/.test(q.u)){
   add('① 未来を表す will＋動詞の原形、be going to＋動詞の原形を区別します。');
   add('② 主語に合わせたbe動詞と、後ろの動詞の原形を確認します。');
  }else if(/現在完了/.test(q.u)){
   add('① 現在完了は have/has＋過去分詞です。主語が三人称単数ならhasです。');
   add('② 経験・完了・継続のどの意味かを、文脈や副詞から判断します。');
  }else if(/be動詞/.test(q.u)){
   add('① am・is・are は主語と時制で選びます。');
   add('② 疑問文ではbe動詞を主語の前に、否定文ではbe動詞の後ろにnotを置きます。');
  }else if(/比較/.test(q.u)){
   add('① 2つを比べる比較級と、3つ以上の中での最上級を区別します。');
   add('② thanやthe、形容詞・副詞の形の変化を確認します。');
  }else if(/英文読解/.test(q.u)){
   add('① 先に設問で何を聞かれているか確認し、英文中の根拠となる主語・動詞・時の表現を探します。');
   add('② 想像だけで選ばず、選択肢と本文の意味が一致するか確かめます。');
  }else add('① 主語と動詞を先に見つけ、語順・時制・代名詞の形を確認します。');
 }else if(cat==='japanese'){
  if(/文法/.test(q.u)){
   add('① その語が文の中で何を修飾・説明しているかを調べます。');
   add('② 副詞は原則として用言を修飾し、活用しません。連体詞は体言を修飾し、接続詞は語句・文をつなぎます。');
   add('③ 例：「とても美しい」の「とても」は「美しい」を修飾する副詞です。');
  }else if(/竹取|古典|故事/.test(q.u)){
   add('① 古語や歴史的仮名遣いを現代語の意味と対応させます。');
   add('② 登場人物の行動と気持ちを、本文の前後の記述から確認します。');
  }else if(/読解|心情|トロッコ|説明文|情報|少年/.test(q.u)){
   add('① 答えの根拠となる前後の文を探し、複数の記述を結び付けます。');
   add('② 心情は出来事→行動・言葉→気持ちの順に推測します。説明文では接続語・指示語・対比に着目します。');
   add('③ 本文にない推測を混ぜず、設問の条件に合う形でまとめます。');
  }else add('① 語句の意味を確認し、本文や例文の中でどのように使われているかを確かめます。');
 }else if(cat==='science'){
  if(/動物/.test(q.u)){
   add('① まず背骨の有無で脊椎動物・無脊椎動物を区別します。');
   add('② 脊椎動物は呼吸・体表・体温・生まれ方など、複数の特徴で魚類・両生類・爬虫類・鳥類・哺乳類を見分けます。');
  }else if(/湿度|水蒸気|気象|雲/.test(q.u)){
   add('① 空気に含まれる水蒸気量と、その温度での飽和水蒸気量を区別します。');
   add('② 湿度(%)＝実際の水蒸気量÷飽和水蒸気量×100。単位と温度条件を確認します。');
   add('③ 温度が下がって飽和水蒸気量が減ると、露点に達して水滴ができます。');
  }else if(/地震|火山|地層/.test(q.u)){
   add('① 問題で問われているのが現象・原因・観察結果のどれかを分けます。');
   add('② 地層では重なり方や粒の大きさ、地震では揺れの到着順と震源を区別して整理します。');
  }else add('① 観察した事実と、その事実から推定できる理由を区別して考えます。');
 }else if(cat==='history'){
  if(/天平|古代|平安|国風/.test(q.u)){
   add('① 人物・制度・文化を、奈良時代か平安時代かに分けます。');
   add('② 奈良時代は国家仏教・遣唐使の影響、平安時代の国風文化はかな文字や日本風の文学などが手掛かりです。');
  }else if(/武士|鎌倉|モンゴル/.test(q.u)){
   add('① 出来事の前後関係と、政治の中心が朝廷か武家政権かを確認します。');
   add('② 武士の成長、鎌倉幕府の成立、御家人と将軍の関係を時系列で整理します。');
  }else add('① その人物・出来事の時代を特定し、前後の出来事と結び付けて覚えます。');
 }else if(cat==='geography'){
  if(/緯度|経度|時差/.test(q.u)){
   add('① 緯度は赤道から南北の位置、経度は本初子午線から東西の位置を表します。');
   add('② 経度15°で時差1時間。東へ進むほど時刻は進み、西へ進むほど遅れます。');
  }else if(/気候|生活|文化/.test(q.u)){
   add('① 気候は気温・降水量を読み取り、緯度・標高・海からの距離とも関連付けます。');
   add('② 暮らしや農業を気候条件と結び付け、地域名だけの丸暗記にしないようにします。');
  }else add('① 地図で位置・方向・近隣地域を確かめ、自然条件と人々の生活を結び付けます。');
 }else if(cat==='waka'){
  add('① 上の句の特徴的な言葉と、下の句の冒頭を一組にして声に出して確認します。');
  add('② 意味を大まかに把握し、似た表現の別の歌との混同を防ぎます。');
 }else add('正解だけでなく、設問の条件と根拠を結び付けて説明できるか確認します。');
 const reason=raw.replace(/^正解は[「『][\s\S]*?[」』]。?\s*/,'').trim();
 if(reason&&!/^正解は/.test(reason)&&!steps.some(x=>x.includes(reason)))add('この問題の手掛かり：'+reason);
 if(!steps.length)add('正答の根拠を問題文と教科書の関連箇所で確かめます。');
 return {answer,steps};
}
function addExplanation(target,q,cat,title){
 const e=explain(q,cat),card=say('div',undefined,'ts-explain-card');
 const h=say('strong',title||'解き方・なぜそうなる？');card.appendChild(h);
 const answer=say('p','正答：'+e.answer,'ts-explain-answer');card.appendChild(answer);renderMath(answer);
 const ol=say('ol');for(const x of e.steps){const li=say('li',x);ol.appendChild(li);renderMath(li)}card.appendChild(ol);
 target.appendChild(card);return card;
}
function practiceFrom(q,cat){
 const normalize=x=>clean(x.q);
 const candidates=(data[cat]||[]).filter(x=>x.u===q.u&&x.id!==q.id&&normalize(x)!==normalize(q));
 if(!candidates.length)return null;
 const history=window.TakumiTrust?.score;
 candidates.sort((a,b)=>{
  const as=typeof history==='function'?history(a.id)?.self||0:0;
  const bs=typeof history==='function'?history(b.id)?.self||0:0;
  return as-bs||a.id.localeCompare(b.id);
 });
 return candidates[0];
}
function addPractice(target,q,cat){
 const other=practiceFrom(q,cat);if(!other)return;
 const box=say('div',undefined,'ts-practice');
 box.appendChild(say('strong','確認類題（解説を閉じて考える）'));
 const question=say('p',other.q);box.appendChild(question);renderMath(question);
 const choose=say('div',undefined,'ts-review-options');
 for(const choice of other.c){const item=say('div','・'+choice);choose.appendChild(item);renderMath(item)}
 box.appendChild(choose);
 const reveal=say('details');reveal.appendChild(say('summary','類題の正答・解説を見る'));
 addExplanation(reveal,other,cat,'類題の解説');
 box.appendChild(reveal);
 box.appendChild(say('p','類題の正解は自力正答率に自動加算しません。紙に途中式を書いてから答えを開いてください。','ts-note'));
 target.appendChild(box);
}
let currentSession=null,answered=[];
const oldAnswer=answer;
answer=function(j,b){
 if(state.locked)return;
 const q=state.set?.[state.i];if(!q)return;
 if(currentSession!==state.session){currentSession=state.session;answered=[]}
 const selected=state.currentChoices?.[j]?.text??b?.textContent??'',ok=j===state.correctIndex;
 oldAnswer(j,b);
 if(!state.locked)return;
 answered.push({qId:q.id,selected:String(selected),ok,cat:state.cat});
 feedback.appendChild(addExplanation(document.createDocumentFragment(),q,state.cat,'解き方・なぜそうなる？'));
};
function mergeReviewRows(a,b){
 const all=new Map();
 for(const r of [...(a||[]),...(b||[])]){
  if(r&&r.id&&Array.isArray(r.rows)){
   const old=all.get(r.id);
   if(!old||(r.at||0)>=(old.at||0))all.set(r.id,r);
  }
 }
 return [...all.values()].sort((a,b)=>b.at-a.at).slice(0,6);
}
function savedSessions(){return Array.isArray(db.reviewSessions)?db.reviewSessions:[]}
const oldNext=nextQ;
nextQ=function(){
 const was=state.i,finishing=was===state.set.length-1,sessionId=state.session;
 oldNext();
 if(!finishing||state.i<=was||!document.getElementById('result')?.classList.contains('active'))return;
 if(currentSession!==sessionId||!answered.length)return;
 const review={id:String(Date.now())+'-'+sessionId,at:Date.now(),cat:state.cat,
  weekly:state.weeklySession===sessionId,rows:answered.slice()};
 db.reviewSessions=mergeReviewRows(savedSessions(),[review]);
 save();
 paintResultButton(review);
 currentSession=null;answered=[];
};
function reviewCard(row,i){
 const item=byId[row.qId];if(!item)return null;
 const {q,cat}=item;
 const details=say('details',undefined,'ts-review-card');
 if(!row.ok)details.open=true;
 const summary=say('summary',(row.ok?'○ ':'× ')+(i+1)+'. '+q.u+'｜'+q.q);
 details.appendChild(summary);
 const choice=say('p','本人の回答：'+row.selected+' ／ 正答：'+q.c[q.a]);details.appendChild(choice);renderMath(choice);
 addExplanation(details,q,cat,'理由と解き方');
 if(!row.ok)addPractice(details,q,cat);
 return details;
}
function drawReview(root,review){
 root.replaceChildren();
 if(!review){root.appendChild(say('p','この端末に復習できる診断結果はまだありません。'));return}
 const stamp=new Date(review.at).toLocaleString('ja-JP');
 root.appendChild(say('h3',(review.weekly?'数学・週次診断':'通常学習')+'｜'+stamp));
 const wrong=review.rows.filter(x=>!x.ok).length;
 root.appendChild(say('p','全'+review.rows.length+'問／要復習'+wrong+'問。×の問題を先に開いています。解説を読んだ後は類題を自力で考えましょう。','ts-note'));
 if(wrong===0)root.appendChild(say('p','全問正解です。ただし4択の結果だけで計算・記述の定着は判断しません。'));
 for(let i=0;i<review.rows.length;i++){const c=reviewCard(review.rows[i],i);if(c)root.appendChild(c)}
}
function paintResultButton(review){
 const panel=document.querySelector('#result .qbox');if(!panel)return;
 let button=document.getElementById('ts-review-link');
 if(!button){button=say('button','今回の解説・間違い直しを見る','secondary');
  button.id='ts-review-link';button.type='button';button.style.width='100%';button.style.margin='12px 0';
  const nextBtn=panel.querySelector('button');panel.insertBefore(button,nextBtn||null)}
 button.onclick=()=>openReview(review.id);
}
const area=document.createElement('section');
area.id='ts-review-screen';area.className='screen';
const back=say('button','← ホーム','back');back.type='button';back.onclick=()=>show('home');
area.append(back,say('h2','解説・間違い直し'),say('p','間違えた問題の理由と類題を復習できます。ここで答えを見ても自力正解としては記録しません。','ts-note'));
const actions=say('div',undefined,'ts-review-history'),body=say('div',undefined,'ts-review-body');
area.append(actions,body);document.querySelector('.wrap').appendChild(area);
function openReview(id){
 show('ts-review-screen');actions.replaceChildren();
 const sessions=savedSessions();
 for(const s of sessions){
  const b=say('button',(s.weekly?'週次':'通常')+' '+new Date(s.at).toLocaleString('ja-JP',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}),'secondary');
  b.type='button';b.onclick=()=>{drawReview(body,s);for(const x of actions.children)x.classList.toggle('ts-selected',x===b)};
  actions.appendChild(b);
 }
 drawReview(body,sessions.find(x=>x.id===id)||sessions[0]);
 for(const b of actions.children){if(b.textContent===actions.children[0]?.textContent)b.classList.add('ts-selected')}
}
for(const selector of ['#progress .qbox','#home']){
 const target=document.querySelector(selector);if(!target)continue;
 const b=say('button','📘 前回の解説・間違い直しを見る','secondary');
 b.type='button';b.style.width='100%';b.style.marginTop='12px';b.onclick=()=>openReview();
 if(selector==='#home'){const before=document.querySelector('#home .home-help');if(before)target.insertBefore(b,before);else target.appendChild(b)}else target.appendChild(b);
}
const style=document.createElement('style');
style.textContent='.ts-explain-card{margin:12px 0;padding:12px;border-radius:10px;border:1px solid #dce3e6;background:#f7fafb;font-size:14px;line-height:1.75;white-space:normal}.ts-explain-card strong{display:block;font-size:14px}.ts-explain-card ol{padding-left:21px;margin:7px 0}.ts-explain-card li{margin:7px 0}.ts-explain-answer{font-weight:700;margin:8px 0}.ts-review-card{background:white;border:1px solid #ddd;border-radius:12px;margin:12px 0;padding:12px;overflow-wrap:anywhere}.ts-review-card summary{cursor:pointer;font-weight:750;line-height:1.5}.ts-review-card p{line-height:1.7}.ts-note{font-size:12px;color:#555;line-height:1.6}.ts-practice{border-top:1px solid #ccc;padding-top:13px}.ts-practice details{padding:9px;background:#fafafa;border-radius:8px}.ts-review-options{font-size:14px;line-height:1.75}.ts-review-history{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0}.ts-review-history button{font-size:12px}.ts-review-history button.ts-selected{font-weight:900;border-color:#222}';
document.head.appendChild(style);
window.TakumiExplanation={explain,openReview,mergeReviewRows};
})();