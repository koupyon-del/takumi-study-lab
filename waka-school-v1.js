/* School-use Ogura Hyakunin Isshu, 2026-10-24.
   Restore the upper/lower matching practice without poem-number or author quizzes.
   Never erase historical answer data: only replace the active question bank.
   For 40–60 use kana-centric karuta wording; school's own handout remains authoritative. */
(function(){
'use strict';
const corrections={
40:['しのぶれどいろにいでにけりわがこひは','ものやおもふとひとのとふまで'],
41:['こひすてふわがなはまだきたちにけり','ひとしれずこそおもひそめしか'],
42:['ちぎりきなかたみにそでをしぼりつつ','すゑのまつやまなみこさじとは'],
43:['あひみてののちのこころにくらぶれば','むかしはものをおもはざりけり'],
44:['あふことのたえてしなくばなかなかに','ひとをもみをもうらみざらまし'],
45:['あはれともいふべきひとはおもほえで','みのいたづらになりぬべきかな'],
46:['ゆらのとをわたるふなびとかぢをたえ','ゆくへもしらぬこひのみちかな'],
47:['やへむぐらしげれるやどのさびしきに','ひとこそみえねあきはきにけり'],
48:['かぜをいたみいはうつなみのおのれのみ','くだけてものをおもふころかな'],
49:['みかきもりゑじのたくひのよるはもえ','ひるはきえつつものをこそおもへ'],
50:['きみがためをしからざりしいのちさへ','ながくもがなとおもひけるかな'],
51:['かくとだにえやはいぶきのさしもぐさ','さしもしらじなもゆるおもひを'],
52:['あけぬればくるるものとはしりながら','なほうらめしきあさぼらけかな'],
53:['なげきつつひとりぬるよのあくるまは','いかにひさしきものとかはしる'],
54:['わすれじのゆくすゑまではかたければ','けふをかぎりのいのちともがな'],
55:['たきのおとはたえてひさしくなりぬれど','なこそながれてなほきこえけれ'],
56:['あらざらむこのよのほかのおもひでに','いまひとたびのあふこともがな'],
57:['めぐりあひてみしやそれともわかぬまに','くもがくれにしよはのつきかな'],
58:['ありまやまゐなのささはらかぜふけば','いでそよひとをわすれやはする'],
59:['やすらはでねなましものをさよふけて','かたぶくまでのつきをみしかな'],
60:['おほえやまいくののみちのとほければ','まだふみもみずあまのはしだて']
};
const legacy=(data.waka||[]).filter(x=>/^XW\d{3}S$/.test(x.id));
if(legacy.length!==100){console.warn('百人一首の正規化を見送りました：歌の件数が100ではありません',legacy.length);return}
const poems=legacy.map(x=>{
 const n=Number(x.id.slice(2,5)), m=x.q.match(/^【\d+番・下の句】(.+?)／続く下の句は？$/);
 if(!m)throw Error('原文を読めない歌:'+n);
 const fixed=corrections[n];
 return {n,kami:fixed?fixed[0]:m[1],shimo:fixed?fixed[1]:x.c[0],unit:x.u,old:x};
}).sort((a,b)=>a.n-b.n);
const bank=[];
for(let i=0;i<poems.length;i++){
 const p=poems[i],wrong=[7,13,29].map(k=>poems[(i+k)%100]);
 const choicesLower=[p.shimo,...wrong.map(x=>x.shimo)];
 const choicesUpper=[p.kami,...wrong.map(x=>x.kami)];
 if(new Set(choicesLower).size!==4||new Set(choicesUpper).size!==4)throw Error('重複した選択肢：'+p.n);
 bank.push({id:p.old.id,u:p.unit,q:'上の句に続く下の句を選ぼう：\n'+p.kami,
  c:choicesLower,a:0,star:2,e:'上の句と下の句を一組にして覚えよう。答えは「'+p.shimo+'」。'});
 bank.push({id:'XW'+String(p.n).padStart(3,'0')+'U',u:p.unit,
  q:'下の句に合う上の句を選ぼう：\n'+p.shimo,
  c:choicesUpper,a:0,star:2,e:'下の句からも上の句を思い出せるか確認。答えは「'+p.kami+'」。'});
}
data.waka.splice(0,data.waka.length,...bank);
const css=document.createElement('style');
css.textContent='#quiz .question{white-space:pre-line}';
document.head.appendChild(css);
window.TakumiWakaSchool={correctedCount:Object.keys(corrections).length,count:bank.length,
 noNumberQuestions:bank.every(x=>!/何番|【\d+番|第\d+首/.test(x.q))};
})();