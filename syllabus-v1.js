/* MI 2026年度中1 年間シラバス要約：閲覧専用・DB変更なし */
(function(){
'use strict';
const annual={"math":{"数量":[["4〜5月","正負の数・累乗と文字式"],["6〜9月","方程式と連立方程式"],["10〜11月","1次不等式"],["12〜3月","1次関数"]],"図形":[["4〜5月","平面図形・作図"],["6〜7月","空間図形"],["9〜10月","図形の性質と合同・証明"],["11〜12月","三角形と四角形"],["1〜3月","図形と相似"]]},"english":{"English A":[["4〜7月","Time Zones Starter：自己紹介・国・家・曜日・時刻"],["9〜12月","Time Zones 1：好み・場所・学校生活・会話と発表"],["1〜3月","値段と買い物・過去の経験や行事"]],"English B":[["4〜7月","be動詞・一般動詞・三単現・疑問詞・can"],["9〜10月","現在進行形・一般動詞の過去形"],["11〜12月","be動詞の過去形・be going to"],["1〜3月","There is/are・比較"]]},"japanese":{"文学":[["4〜7月","説明文・小説・詩の読解"],["9〜10月","情報の読み取り・トロッコ・漢字"],["11〜12月","説明文・少年の日の思い出・漢字"],["1〜3月","説明文・小説の読解"]],"表現":[["4〜7月","話す・聞く・文法・書写・百人一首1〜40番"],["9〜10月","ブックカバー作成・自立語・百人一首41〜60番"],["11〜12月","竹取物語・用言の活用・百人一首61〜80番"],["1〜3月","故事成語・自立語・百人一首81〜100番"]]},"science":{"理科A":[["4〜7月","動物の特徴と分類・進化"],["9〜12月","動物のからだのつくりとはたらき"],["1〜3月","生物と人間・生物と環境"]],"理科B":[["4〜7月","大地の変化・火山・地震・地層"],["9〜12月","大気・水蒸気・雲・天気の変化・日本の気象"],["1〜3月","宇宙・太陽と恒星・月の動き"]]},"history":{"歴史":[["4〜7月","古代文明・東アジア・古代日本"],["9〜10月","中世日本・武士の登場・鎌倉時代"],["11〜12月","ヨーロッパの変化・戦国・安土桃山"],["1〜3月","江戸幕府の成立と対外政策"]]},"geography":{"地理":[["4〜7月","世界・日本の姿、気候と暮らし"],["9〜10月","アフリカ州・北アメリカ州"],["11〜12月","南アメリカ州・ヨーロッパ州"],["1〜3月","オセアニア州・アジア州"]]},"waka":{"百人一首":[["4〜7月","1〜40番"],["9〜10月","41〜60番"],["11〜12月","61〜80番"],["1〜3月","81〜100番"]]}};
const cautions={"math":"数量と図形は別授業。既習・授業中は実際の進度で設定してください。","english":"English Aの会話・発表は、4択だけでは測定できません。","japanese":"文学と表現は別授業。国語の問題集には未収録教材もあります。","science":"理科A（生物）と理科B（地学）は独立の授業です。","history":"古代世界・東アジア・ヨーロッパは、現行問題集の収録が不十分です。","geography":"現行の初期進度と州別学習の順序に相違があります。","waka":"表現の百人一首進度に対応します。"};
const tabs=document.getElementById('plan-tabs');if(!tabs)return;
const box=document.createElement('section');
box.id='syllabus-reference';box.className='syllabus-reference';tabs.after(box);
const style=document.createElement('style');
style.textContent='.syllabus-reference{background:#fff;padding:14px;border-radius:14px;margin:12px 0}.syllabus-reference h3{font-size:16px;margin:0 0 8px}.syllabus-reference p{font-size:12px;line-height:1.6}.syllabus-reference .sy-subject{font-weight:700;margin-top:12px}.syllabus-reference .sy-entry{font-size:13px;padding:7px 0;border-bottom:1px solid #eee;line-height:1.5}.syllabus-reference .sy-month{color:#666;display:inline-block;min-width:68px}';
document.head.appendChild(style);
function render(cat){
 box.replaceChildren();
 const h=document.createElement('h3');h.textContent='📑 MI年間シラバス（中1・2026年度）';box.appendChild(h);
 const note=document.createElement('p');note.textContent='学校配布資料の年間予定です。実際の授業進度や定期考査の範囲とは別です。下の「既習・授業中・未習」は手動で管理してください。';box.appendChild(note);
 for(const [name,periods] of Object.entries(annual[cat]||{})){
  const title=document.createElement('div');title.className='sy-subject';title.textContent=name;box.appendChild(title);
  for(const [month,content] of periods){
   const row=document.createElement('div');row.className='sy-entry';
   const m=document.createElement('span');m.className='sy-month';m.textContent=month;
   const txt=document.createElement('span');txt.textContent=content;
   row.append(m,txt);box.appendChild(row);
  }
 }
 const caution=document.createElement('p');caution.textContent='※ '+(cautions[cat]||'');box.appendChild(caution);
}
for(const b of tabs.querySelectorAll('[data-plan-subj]'))b.addEventListener('click',()=>render(b.dataset.planSubj));
window.TakumiSyllabus={render,annual};render('math');
})();