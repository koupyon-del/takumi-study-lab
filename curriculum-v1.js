/* Takumi Study Lab v1.0: curriculum and remedial learning; preserves all legacy IDs and progress. */
(function(){
'use strict';
const topicPlan={
 math:[
 ['正負の数','基礎','learned'],['指数・累乗','基礎','learned'],['分数・小数','基礎','learned'],
 ['文字式','基礎','learned'],['一次方程式','基礎','learned'],['分数方程式','基礎','learned'],
 ['連立方程式','授業','learned'],['1次不等式','授業','now'],
 ['図形の基本','基礎','learned'],['図形の性質と合同','授業','now'],['証明','授業','now'],
 ['一次関数','授業','future'],['三角形・四角形','授業','future'],['相似','授業','future']],
 english:[
 ['be動詞','基礎','learned'],['一般動詞','基礎','learned'],['疑問文・否定文','基礎','learned'],
 ['三単現','基礎','learned'],['代名詞','基礎','learned'],['前置詞・時刻','基礎','learned'],
 ['現在進行形','授業','now'],['英文読解','授業','now'],['過去形','授業','future'],
 ['未来表現','授業','future'],['比較','授業','future'],['語彙・現在完了','発展','future'],['並べ替え','発展','future']],
 japanese:[
 ['語彙・知識','基礎','learned'],['文法','授業','now'],['読解の基本','基礎','learned'],
 ['説明文・論説文','授業','now'],['小説の心情','授業','now'],
 ['竹取物語','授業','now'],['情報を関係づける','授業','now'],['トロッコ','授業','now'],
 ['少年の日の思い出','授業','future']],
 science:[
 ['植物のつくり','基礎','learned'],['地震と火山','基礎','learned'],
 ['動物の分類','授業','now'],['動物の進化','授業','now'],
 ['気象・水蒸気','授業','now'],['気象・湿度','授業','now'],['気象・雲','授業','now'],
 ['気象・観測','授業','now'],['気象・総合','授業','now'],
 ['人体のつくり','授業','future'],['天体','授業','future']],
 history:[
 ['古代日本','基礎','learned'],['天平文化','授業','learned'],['平安京','授業','learned'],
 ['国風文化','授業','learned'],['武士の成長','授業','now'],
 ['鎌倉幕府','授業','now'],['鎌倉文化・仏教','授業','now'],['室町時代','授業','future']],
 geography:[
 ['地球と地図','基礎','learned'],['緯度・経度と時差','基礎','learned'],
 ['世界の地域','基礎','learned'],['日本の地域','基礎','learned'],
 ['世界の気候','授業','now'],['世界の生活・文化','授業','now'],
 ['アジア','授業','future'],['ヨーロッパ','授業','future'],['アフリカ','授業','future'],
 ['南北アメリカ','授業','future'],['オセアニア','授業','future']],
 waka:[['40〜44番','授業','learned'],['45〜49番','授業','learned'],['50〜54番','授業','now'],['55〜59番','授業','now'],['60〜60番','授業','now']]
};
const newBank={math:[],english:[],japanese:[],science:[],history:[],geography:[]};
const counters={math:0,english:0,japanese:0,science:0,history:0,geography:0};
const prefixes={math:'FM',english:'FE',japanese:'FJ',science:'FS',history:'FH',geography:'FG'};
function add(cat,u,q,choices,reason,star=2){
 if(!topicPlan[cat]?.some(x=>x[0]===u))throw new Error('未登録単元：'+cat+'/'+u);
 if(!Array.isArray(choices)||choices.length!==4||new Set(choices.map(String)).size!==4)throw new Error('選択肢が不正: '+q);
 newBank[cat].push({id:prefixes[cat]+String(++counters[cat]).padStart(4,'0'),u,q,c:choices.map(String),a:0,star,e:reason||'答えは「'+choices[0]+'」。'});
}
function integerChoices(ans,extras=[]){
 const a=[ans,...extras,ans+1,ans-1,-ans,ans+2,ans-2,ans+3,ans-3,ans+5,ans-5,ans*2];
 return [...new Set(a.map(String))].slice(0,4);
}
function calc(u,question,answer,reason,star=2,extras=[]){add('math',u,question,integerChoices(answer,extras),reason,star)}
/* 数量の基礎：符号、分配、代入、方程式、連立、比例・関数 */
for(const [a,b] of [[-7,12],[5,-14],[-9,-6],[-12,8],[15,-19],[-6,17],[-13,-8],[11,-18],[-20,9],[7,-15]]){
 calc('正負の数','計算：('+a+')＋('+b+')',a+b,'符号を確認し、絶対値の大小を比べます。',2,[Math.abs(a)+Math.abs(b)]);
 calc('正負の数','計算：('+a+')－('+b+')',a-b,'引き算は、引く数の符号を変えて足します。',2,[a+b]);
}
for(const [a,b] of [[-3,5],[4,-7],[-6,-4],[-8,2],[7,-3],[-9,-2],[3,-8],[5,6]]){
 calc('正負の数','計算：('+a+')×('+b+')',a*b,'同符号は正、異符号は負です。',2,[Math.abs(a*b),a+b]);
}
for(const [a,b] of [[-24,6],[36,-9],[-42,-7],[56,-8],[63,-7],[-54,9]]){
 calc('正負の数','計算：('+a+')÷('+b+')',a/b,'割り算も符号の規則は掛け算と同じです。',2,[Math.abs(a/b),a*b]);
}
for(const [b,e] of [[-2,2],[-3,2],[-2,3],[-4,2],[3,3],[-3,3],[-5,2],[4,3]]){
 const v=b**e;calc('指数・累乗','計算：('+b+')の'+e+'乗',v,'括弧内の数を'+e+'回掛けます。',2,[-v,b*e]);
}
add('math','指数・累乗','「－3²」と「(－3)²」の組合せは？',['－9 と 9','9 と 9','－9 と －9','9 と －9'],'括弧がない－3²は－(3²)です。',3);
add('math','指数・累乗','2³×2² の値は？',['32','64','16','10'],'同じ底の累乗の積は指数を足せます。',2);
add('math','指数・累乗','(2³)² の値は？',['64','32','16','256'],'(2³)²＝8²＝64です。',3);
add('math','分数・小数','½＋⅓＝？',['⅚','⅔','¹⁄₆','1'],'通分して 3/6＋2/6＝5/6 です。',2);
add('math','分数・小数','¾－½＝？',['¼','½','⅛','¾'],'½を2/4に直して引きます。',2);
add('math','分数・小数','⅔×¾＝？',['½','⅔','¾','⅜'],'分子同士・分母同士を掛け、約分します。',2);
add('math','分数・小数','⅔÷¼＝？',['⁸⁄₃','⅙','¾','³⁄₈'],'¼で割るとは4を掛けることです。',3);
add('math','分数・小数','計算：0.6＋0.35＝？',['0.95','0.41','0.65','0.91'],'小数点の位置をそろえて計算します。');
add('math','分数・小数','計算：1.2×0.5＝？',['0.6','6','0.06','1.7'],'12×5から小数点の桁数を戻します。');
add('math','分数・小数','計算：1.5÷0.3＝？',['5','0.5','50','0.45'],'両方10倍して15÷3と考えます。');
add('math','分数・小数','－½＋¾＝？',['¼','－¼','－⁵⁄₄','⅝'],'－2/4＋3/4＝1/4です。',3);
for(const [a,b,x] of [[2,3,-2],[-3,5,4],[4,-7,3],[-2,-3,-5],[5,-1,2],[3,4,-3],[-4,1,-2],[2,-5,6]]){
 calc('文字式','x＝'+x+' のとき '+a+'x'+(b>=0?'＋':'－')+Math.abs(b)+' の値は？',a*x+b,'xに'+x+'を代入し、乗算から計算します。',2,[a*(x+b),a+x+b]);
}
for(const [a,b] of [[2,3],[-3,4],[5,-2],[-4,-3],[3,6],[6,-5],[2,-7]]){
 add('math','文字式','分配法則：'+a+'(x'+(b>=0?'＋':'－')+Math.abs(b)+') を展開すると？',
 [a+'x'+(a*b>=0?'＋':'－')+Math.abs(a*b),a+'x'+(b>=0?'＋':'－')+Math.abs(b),(a+b)+'x',a+'x'+(a*b>=0?'－':'＋')+Math.abs(a*b)],
 'a(b＋c)＝ab＋ac。括弧の外の数を両方の項に掛けます。',3);
}
add('math','文字式','3x－2x＋5x を整理すると？',['6x','10x','0','6x²'],'同じ文字の項の係数をまとめます。');
add('math','文字式','2a＋3b－a＋b を整理すると？',['a＋4b','a＋2b','2a＋4b','5ab'],'aの項、bの項をそれぞれまとめます。');
add('math','文字式','xと3を掛けた数から5を引いた式は？',['3x－5','3(x－5)','x＋3－5','5－3x'],'掛け算を先に、引き算を後にします。');
for(const [a,x,b] of [[2,3,5],[3,-2,7],[-2,4,6],[5,1,-3],[-3,-2,4],[4,-3,-5],[6,2,1],[7,-1,3],[2,-5,-4],[5,4,6],[3,6,-8],[4,7,-9]]){
 const y=a*x+b;
 calc('一次方程式','方程式：'+a+'x'+(b>=0?'＋':'－')+Math.abs(b)+'＝'+y+' を解き、xは？',x,'定数項を移項し、最後に係数で割ります。',2,[x+b,x-b]);
}
for(const [a,x,b] of [[2,2,3],[3,3,4],[4,2,-3],[5,-1,6],[2,-3,7],[3,4,-2]]){
 const rhs=a*(x+b);calc('一次方程式','方程式：'+a+'(x'+(b>=0?'＋':'－')+Math.abs(b)+')＝'+rhs+' のxは？',x,'分配して整理するか、先に両辺を'+a+'で割ります。',3,[x+b,x-b]);
}
for(const [a,b,x] of [[2,3,6],[3,4,-2],[5,2,4],[4,5,-3],[3,5,7],[2,5,-6]]){
 const rhs=(a*x+b)/1;
 add('math','分数方程式','方程式：(x＋'+b+')／'+a+'＝'+((x+b)/a)+' を解くと？',
 integerChoices(x,[x+b,(x+b)/a]),'両辺に'+a+'を掛けて分母を払い、'+b+'を引きます。',3);
}
add('math','分数方程式','(x＋2)／3＝4 を解くと？',['10','6','12','14'],'両辺を3倍するとx＋2＝12です。',2);
add('math','分数方程式','x／2＋x／3＝5 の解は？',['6','5','10','30'],'両辺を6倍すると3x＋2x＝30です。',3);
add('math','分数方程式','x／4－x／6＝1 の解は？',['12','6','24','2'],'両辺を12倍すると3x－2x＝12です。',3);
add('math','分数方程式','(x－1)／2＝(x＋2)／3 の解は？',['7','5','－7','1'],'6倍すると3(x－1)＝2(x＋2)、x＝7。',3);
for(const [x,y] of [[2,3],[4,-1],[-2,5],[3,4],[-3,-2],[1,-4],[5,2],[6,-3]]){
 const s=x+y,d=x-y;
 add('math','連立方程式','x＋y＝'+s+'、x－y＝'+d+' を同時に満たすxは？',
 integerChoices(x,[y,s,d]),'2式を加えて2x＝'+(s+d)+'を作ります。',3);
}
for(const [x,y] of [[1,2],[3,-1],[-2,1],[4,3]]){
 const a=2*x+y,b=x-y;
 add('math','連立方程式','2x＋y＝'+a+'、x－y＝'+b+' の解の組は？',
 ['x＝'+x+'、y＝'+y,'x＝'+y+'、y＝'+x,'x＝'+x+'、y＝'+(-y),'x＝'+(-x)+'、y＝'+y],
 '2式を加えると3x＝'+(a+b)+'。xを求めて代入します。',3);
}
for(const [a,b,x] of [[2,3,2],[-3,2,-1],[4,-3,1],[5,1,4],[-2,4,3]]){
 const y=a*x+b;
 add('math','1次不等式',a+'x'+(b>=0?'＋':'－')+Math.abs(b)+' ＞ '+y+' を解くと？',
 [a>0?'x ＞ '+x:'x ＜ '+x,a>0?'x ＜ '+x:'x ＞ '+x,'x ≧ '+x,'x ≦ '+x],
 '負の数で両辺を割ると不等号の向きが反対になります。',3);
}
add('math','1次不等式','－2x ≧ 8 の解は？',['x ≦ －4','x ≧ －4','x ＜ 4','x ≦ 4'],'負の数－2で割るため不等号を反転します。',3);
add('math','1次不等式','2(x－3) ＜ 8 の解は？',['x ＜ 7','x ＞ 7','x ＜ 5','x ≦ 7'],'2x－6＜8、2x＜14。',3);
for(const [a,b,x] of [[2,1,3],[-2,5,-1],[3,-4,2],[4,2,-3]]){
 const v=a*x+b;calc('一次関数','y＝'+a+'x'+(b>=0?'＋':'－')+Math.abs(b)+'、x＝'+x+' のときyは？',v,'式にxを代入します。',2,[a+x+b,a*x-b]);
}
add('math','一次関数','y＝3x－2 の傾きは？',['3','－2','－3','2'],'一次関数y＝ax＋bの傾きはaです。');
add('math','一次関数','y＝－2x＋5 の切片は？',['5','－2','2','－5'],'y軸との交点のy座標はbです。');
/* 図形 */
const geo=[
 ['図形の基本','一直線上の隣り合う2つの角の和は？',['180°','90°','360°','270°'],'平角は180°です。'],
 ['図形の基本','対頂角の大きさは？',['等しい','和が180°','和が90°','必ず45°'],'2本の直線が交わってできる向かい合う角は等しい。'],
 ['図形の基本','三角形の内角の和は？',['180°','90°','270°','360°'],'内角の和は180°です。'],
 ['図形の基本','平行線に1本の直線が交わるとき錯角は？',['等しい','和が180°','必ず直角','関係がない'],'平行線の錯角は等しい。'],
 ['図形の基本','四角形の内角の和は？',['360°','180°','270°','540°'],'対角線で2つの三角形に分けて考えます。'],
 ['図形の基本','半径が3 cmの円の直径は？',['6 cm','3 cm','9 cm','1.5 cm'],'直径は半径の2倍です。'],
 ['図形の性質と合同','2辺とその間の角がそれぞれ等しい三角形は？',['合同','相似だけで合同とは限らない','必ず直角三角形','必ず二等辺三角形'],'SASの合同条件です。'],
 ['図形の性質と合同','3辺がそれぞれ等しい三角形は？',['合同','周長だけ等しい','面積だけ等しい','相似でない'],'SSSの合同条件です。'],
 ['証明','合同の証明で必要な記述は？',['対応する辺・角の等しさとその理由','最後の合同条件の名称だけ','図から見た印象','結論を先に書くだけ'],'条件に当てはまる3要素を根拠付きで示します。'],
 ['証明','「共通な辺」で示せる関係は？',['同じ線分どうしの長さが等しい','すべての角が等しい','三角形の面積が等しい','向かい合う辺は平行'],'同じ線分は自身と長さが等しいです。'],
 ['証明','合同な三角形の対応する角は？',['等しい','必ず90°','必ず60°','等しくない'],'合同な図形では対応する辺・角が等しいです。'],
 ['三角形・四角形','二等辺三角形の底角は？',['等しい','和が90°','一方が2倍','必ず直角'],'2つの底角は等しいです。'],
 ['三角形・四角形','平行四辺形の向かい合う辺は？',['平行で長さが等しい','垂直である','和が必ず10 cm','長さが異なる'],'平行四辺形の基本性質です。'],
 ['三角形・四角形','長方形の対角線の長さは？',['等しい','いつも異なる','直交するとは限らず長さも異なる','一方が2倍'],'長方形の対角線は等しいです。'],
 ['相似','相似な三角形の対応する角は？',['等しい','比例するだけ','和が90°','すべて直角'],'相似な図形は対応する角が等しいです。'],
 ['相似','相似比が2：3のとき周の長さの比は？',['2：3','4：9','8：27','1：1'],'周の長さの比は相似比と同じです。']
];
for(const [u,q,c,e] of geo)add('math',u,q,c,e,2);
/* English A/B: wording/structure aligned to early MEISEI lessons */
const en=[
 ['be動詞','I ___ a student.',['am','is','are','be']],
 ['be動詞','She ___ my friend.',['is','am','are','do']],
 ['be動詞','They ___ from Japan.',['are','is','am','does']],
 ['be動詞','___ you ready?',['Are','Is','Am','Do']],
 ['be動詞','He is not at home. の短縮形は？',['He isn’t at home.','He aren’t at home.','He don’t at home.','He hasn’t at home.']],
 ['一般動詞','I ___ tennis every Sunday.',['play','plays','playing','am']],
 ['一般動詞','We ___ English at school.',['study','studies','studying','is study']],
 ['一般動詞','They ___ to school by bus.',['go','goes','going','is go']],
 ['一般動詞','I like apples. の意味は？',['私はりんごが好きです。','私はりんごを食べています。','私はりんごを買いました。','私はりんごを持っていません。']],
 ['疑問文・否定文','___ you like music?',['Do','Does','Are','Is']],
 ['疑問文・否定文','Does she play soccer? の短い肯定答えは？',['Yes, she does.','Yes, she do.','Yes, she is.','Yes, she plays.']],
 ['疑問文・否定文','I do not like milk. の短縮形は？',['I don’t like milk.','I doesn’t like milk.','I amn’t like milk.','I not like milk.']],
 ['疑問文・否定文','He is happy. を疑問文にすると？',['Is he happy?','Does he happy?','Do he is happy?','He is happy?']],
 ['疑問文・否定文','Where ___ you live?',['do','does','are','is']],
 ['三単現','He ___ basketball after school.',['plays','play','playing','is play']],
 ['三単現','She ___ English every day.',['studies','study','studys','studying']],
 ['三単現','My brother ___ a dog.',['has','have','having','haves']],
 ['三単現','___ your sister read books?',['Does','Do','Is','Are']],
 ['三単現','He ___ like coffee.',['doesn’t','don’t','isn’t','aren’t']],
 ['三単現','「彼は学校へ行く」を正しく表す英文は？',['He goes to school.','He go to school.','He going to school.','He does goes to school.']],
 ['代名詞','This is Tom. I know ___.',['him','he','his','they']],
 ['代名詞','This is my book. It is ___.',['mine','my','me','I']],
 ['代名詞','___ are my friends.',['They','Them','Their','Theirs']],
 ['代名詞','I like ___ mother.',['my','me','mine','I']],
 ['前置詞・時刻','The ball is ___ the box.（箱の中）',['in','on','at','to']],
 ['前置詞・時刻','The picture is ___ the wall.',['on','in','to','from']],
 ['前置詞・時刻','「7時半」を表す英語は？',['seven thirty','seven thirteen','seventeen','half seven o’clock']],
 ['前置詞・時刻','I get up ___ six.',['at','on','in','to']],
 ['現在進行形','She is ___ a book now.',['reading','read','reads','to read']],
 ['現在進行形','They ___ playing soccer.',['are','is','am','do']],
 ['現在進行形','What ___ you doing?',['are','is','do','does']],
 ['現在進行形','I am studying now. の否定文は？',['I am not studying now.','I do not studying now.','I not am studying now.','I does not study now.']],
 ['過去形','I ___ to the park yesterday.',['went','go','goes','going']],
 ['過去形','She ___ soccer last Sunday.',['played','plays','play','playing']],
 ['過去形','Did you ___ breakfast?',['eat','ate','eats','eating']],
 ['過去形','We ___ happy yesterday.',['were','was','are','is']],
 ['未来表現','I ___ visit Kyoto tomorrow.',['will','was','did','am']],
 ['未来表現','She is going ___ study.',['to','for','at','in']],
 ['未来表現','Will you come tomorrow? の短い肯定答えは？',['Yes, I will.','Yes, I do.','Yes, I am.','Yes, I did.']],
 ['比較','Tom is ___ than Ken.（背が高い）',['taller','tallest','tall','more tall']],
 ['比較','This is the ___ book of the three.（いちばん大きい）',['biggest','bigger','big','most big']],
 ['比較','Which is ___, tea or coffee?（よりよい）',['better','best','good','well']]
];
for(const [u,q,c] of en)add('english',u,q,c,'文の主語・時制・語順を確認してください。',2);
for(const [sub,word,third,object] of [['He','go','goes','to school'],['She','watch','watches','TV'],['Tom','have','has','lunch'],['My father','teach','teaches','English'],['My sister','wash','washes','her hands'],['Mary','study','studies','English']]){
 add('english','三単現',sub+' ___ '+object+' every day.（動詞：'+word+'）',
 [third,word,word+'ing','is '+word],
 '主語が三人称単数で、習慣を表す現在形なら動詞に-s／-esを付けます。',3);
}
/* 国語：知識と短い根拠判断（長文・記述は紙教材） */
const jp=[
 ['語彙・知識','「顕著」の意味は？',['はっきり目立つこと','あいまいなこと','静かなこと','とても古いこと']],
 ['語彙・知識','「漠然」の意味は？',['はっきりしないさま','きわめて具体的なさま','素早いさま','怒っているさま']],
 ['語彙・知識','「端的」の意味は？',['要点をとらえていること','回りくどいこと','言い換えないこと','遠く離れていること']],
 ['文法','「とても速い」の「とても」の品詞は？',['副詞','名詞','助詞','動詞']],
 ['文法','「しかし」の接続の関係は？',['逆接','順接','並列','添加']],
 ['文法','「ああ、きれいだ」の「ああ」の品詞は？',['感動詞','接続詞','助詞','形容詞']],
 ['文法','「静かな町」の「静か」の品詞は？',['形容動詞','形容詞','副詞','名詞']],
 ['読解の基本','「しかし」で始まる一文が直前に対して示す関係は？',['逆接','同内容の反復','時刻の指定','例示だけ']],
 ['読解の基本','「このこと」が指す内容を確認する際は？',['前後の文脈と指示対象を探す','必ず直後の単語だけを選ぶ','本文を読まず予想する','指示語を無視する']],
 ['読解の基本','説明文の中心的な主張を探すとき重視するものは？',['段落の関係と根拠','最初の一語だけ','登場人物の名前だけ','語句の難しさだけ']],
 ['説明文・論説文','具体例が本文に置かれる主な理由は？',['主張を分かりやすく支えるため','必ず結論を否定するため','作者の名前を示すため','文字数を増やすためだけ']],
 ['説明文・論説文','要約で優先して残す内容は？',['主張と必要な根拠','例の細部すべて','繰り返された表現すべて','本文の最初の一文だけ']],
 ['小説の心情','人物の心情を考えるとき根拠になりやすいものは？',['言動と情景描写の組合せ','人物名の漢字だけ','ページ番号','作者の生年月日だけ']],
 ['小説の心情','同じ言葉が場面を変えて繰り返された場合は？',['前後の状況による意味の変化を考える','いつも同じ感情と断定する','読み飛ばす','登場人物の人数だけ調べる']],
 ['少年の日の思い出','「少年の日の思い出」の作者は？',['ヘルマン・ヘッセ','芥川龍之介','夏目漱石','宮沢賢治']],
 ['少年の日の思い出','人物の行動の動機を問われたら？',['出来事と心情の変化を根拠にする','印象だけで断定する','題名の文字数で考える','登場人物名だけ答える']]
];
for(const [u,q,c] of jp)add('japanese',u,q,c,'本文や文法のルールに照らして説明できるか確認します。',2);
/* science: previous lessons outside term exam */
const sc=[
 ['植物のつくり','植物が光合成を行う主な場所は？',['葉の葉緑体','根の道管','茎の表皮だけ','花の雄しべ'],'葉緑体で光エネルギーを利用します。'],
 ['植物のつくり','道管が主に運ぶものは？',['水と無機養分','光合成でできた糖だけ','酸素だけ','花粉'],'根から吸収した水と無機養分を運びます。'],
 ['植物のつくり','師管が主に運ぶものは？',['葉でつくられた有機物','地中の岩石','空気中の窒素だけ','花粉'],'光合成で作られた養分を運びます。'],
 ['植物のつくり','気孔のはたらきとして正しいものは？',['気体交換と蒸散','水の吸収だけ','花粉をつくる','根を固定する'],'気孔から二酸化炭素が入り、水蒸気などが出ます。'],
 ['植物のつくり','葉にヨウ素液を付け、デンプンがある部分の色は？',['青紫色','赤色','無色透明','緑色'],'ヨウ素液はデンプンと反応し青紫色になります。'],
 ['植物のつくり','根毛がある利点は？',['水を吸収する表面積が大きくなる','光合成を増やす','花粉を飛ばす','葉を支える'],'細い毛によって吸収面積が増えます。'],
 ['地震と火山','地震の発生した地下の地点は？',['震源','震央','震度','等高線'],'地下が震源、真上の地表の点が震央です。'],
 ['地震と火山','震源の真上にあたる地表の地点は？',['震央','震源','火口','断層面の長さ'],'震源の真上が震央です。'],
 ['地震と火山','地震の規模を表す指標は？',['マグニチュード','震度だけ','湿度','気圧'],'規模と各地点の揺れの強さは異なります。'],
 ['地震と火山','各地点の揺れの強さを示す指標は？',['震度','マグニチュードだけ','標高','気温'],'震度は観測地点ごとの揺れの強さです。'],
 ['地震と火山','火山灰などが積もってできる岩石は？',['凝灰岩','花こう岩','大理石','れき岩だけ'],'凝灰岩は火山の噴出物が堆積した岩石です。'],
 ['人体のつくり','肺で血液中に取り込まれる気体は？',['酸素','窒素だけ','二酸化炭素だけ','水素'],'肺胞で酸素と二酸化炭素が交換されます。'],
 ['天体','地球が太陽の周りを回る運動は？',['公転','自転','日周運動だけ','歳差運動だけ'],'太陽の周りを回るのが公転です。']
];
for(const [u,q,c,e] of sc)add('science',u,q,c,e,2);
/* geography: foundational skills */
const gg=[
 ['地球と地図','赤道の緯度は？',['0度','90度','180度','135度']],
 ['地球と地図','地球の形に最も近いものは？',['球体','平面','円柱','立方体']],
 ['地球と地図','太平洋はどれ？',['日本の東側に広がる大洋','アフリカの内部にある湖','欧州の北の小さな湾','南極大陸の山脈']],
 ['地球と地図','地図の縮尺が1：100000のとき地図上1 cmは現地で？',['1 km','10 km','100 m','100 km']],
 ['緯度・経度と時差','経度0度を通る基準の子午線は？',['本初子午線','赤道','北回帰線','日付変更線']],
 ['緯度・経度と時差','緯度は何を表す？',['赤道から北・南への角度','本初子午線から東西への角度','標高','地球の半径']],
 ['緯度・経度と時差','経度15度の差は時差約何時間？',['1時間','15時間','30分','24時間']],
 ['緯度・経度と時差','日本標準時の基準となる東経は？',['135度','0度','90度','180度']],
 ['緯度・経度と時差','日本が午前9時で8時間遅い地域は？',['午前1時','午後5時','午前8時','午後9時']],
 ['世界の地域','アジア州にある国は？',['インド','フランス','ブラジル','エジプト']],
 ['世界の地域','南米大陸にある国は？',['ブラジル','モンゴル','ノルウェー','タイ']],
 ['世界の地域','オーストラリアが属する州は？',['オセアニア州','ヨーロッパ州','アフリカ州','南アメリカ州']],
 ['日本の地域','日本の都道府県数は？',['47','46','48','50']],
 ['日本の地域','日本の標準時子午線が通る兵庫県の市は？',['明石市','京都市','名古屋市','福岡市']],
 ['世界の気候','一年を通して高温・多雨になりやすい気候は？',['熱帯雨林気候','ツンドラ気候','地中海性気候','砂漠気候']],
 ['世界の気候','降水量が極端に少ない気候帯は？',['乾燥帯','熱帯雨林気候','冷帯湿潤気候','温帯湿潤気候']],
 ['世界の生活・文化','イスラム教徒が多い地域として適切なのは？',['西アジア','南極大陸','北極海中央','太平洋の外洋']],
 ['世界の生活・文化','季節風（モンスーン）の影響が大きい地域は？',['南アジア','南極','グリーンランド内陸','サハラ砂漠中央']],
 ['アジア','人口が非常に多いアジアの国は？',['インド','アイスランド','チリ','ニュージーランド']],
 ['ヨーロッパ','EUは何の略称？',['欧州連合','国際連合','アフリカ連合','東南アジア諸国連合']],
 ['アフリカ','サハラ砂漠が広がる大陸は？',['アフリカ','オーストラリア','南極','ヨーロッパ']],
 ['南北アメリカ','アンデス山脈があるのは？',['南アメリカ','ヨーロッパ','アフリカ東部','オセアニア']],
 ['オセアニア','ニュージーランドが位置する州は？',['オセアニア','アフリカ','ヨーロッパ','南アメリカ']]
];
for(const [u,q,c] of gg)add('geography',u,q,c,'地図・位置・理由を組み合わせて確認してください。',['緯度・経度と時差','世界の気候'].includes(u)?3:2);
for(const [u,q,c] of [
 ['古代日本','大化の改新が始まった年は？',['645年','710年','794年','1192年']],
 ['古代日本','奈良に都が移された年は？',['710年','794年','645年','1185年']],
 ['古代日本','平城京が置かれた場所は？',['奈良','京都','鎌倉','平泉']],
 ['室町時代','室町幕府を開いた人物は？',['足利尊氏','源頼朝','徳川家康','藤原道長']]
])add('history',u,q,c,'時代と人物・出来事のつながりを確かめます。');
/* Register new questions preserving IDs, previous records, and existing bank objects. */
data.geography=data.geography||[];
labels.geography='地理';desc.geography='地図・時差・世界の地域';
labels.history='歴史';
for(const [cat,arr] of Object.entries(newBank))data[cat].push(...arr);
function cfg(){
 if(!db.curriculum||typeof db.curriculum!=='object')db.curriculum={};
 if(!db.curriculum.units||typeof db.curriculum.units!=='object')db.curriculum.units={};
 if(!db.curriculum.mode)db.curriculum.mode='mi';
 if(!Number(db.curriculum.updatedAt))db.curriculum.updatedAt=0;
 return db.curriculum;
}
function status(cat,u){
 return cfg().units[cat+'|'+u]||topicPlan[cat]?.find(t=>t[0]===u)?.[2]||'future';
}
function tier(cat,u){return topicPlan[cat]?.find(t=>t[0]===u)?.[1]||'授業'}
function isAllowed(cat,q,mode){
 const st=status(cat,q.u),t=tier(cat,q.u);
 if(st==='future')return false;
 if(mode==='foundation')return t==='基礎'||(cat==='math'&&['連立方程式','図形の性質と合同','証明'].includes(q.u));
 if(mode==='mi')return st==='now'||st==='learned';
 return (st==='now'||st==='learned')&&(q.star>=3||t==='発展');
}
function chooseSet(cat,n=10,mode=cfg().mode){
 const pool=(data[cat]||[]).filter(q=>isAllowed(cat,q,mode));
 if(!pool.length)return [];
 const ranked=pool.map(q=>({q,score:priorityForCurriculum(q,rec(q.id),cat,mode)})).sort((a,b)=>b.score-a.score);
 const out=[],usedQuestions=new Set(),usedUnits=new Set();
 /* First pass: cover distinct units; next pass: prioritise weak and unseen questions. */
 for(const x of ranked){
   if(usedUnits.has(x.q.u))continue;
   out.push(x.q);usedQuestions.add(x.q.q.replace(/^【[^】]+】/,''));
   usedUnits.add(x.q.u);
   if(out.length>=n)return out;
 }
 for(const x of ranked){
   const key=x.q.q.replace(/^【[^】]+】/,'');
   if(!usedQuestions.has(key)){out.push(x.q);usedQuestions.add(key)}
   if(out.length>=n)return out;
 }
 for(const x of ranked){if(out.length>=n)break;if(!out.includes(x.q))out.push(x.q)}
 return out;
}
function priorityForCurriculum(q,r,cat,mode){
 let p=q.star*12 + (!r.seen?35:Math.max(0,22-r.correct*4)+r.wrong*15);
 if(r.confidence==='maybe')p+=20;
 if(r.confidence==='again')p+=43;
 if(r.confidence==='sure')p-=10;
 if(mastered(r))p-=26;
 const grade=paperGrade(cat,q.u);
 if(grade==='weak')p+=43;else if(grade==='maybe')p+=26;else if(grade==='good')p-=14;
 if(status(cat,q.u)==='now')p+=(mode==='mi'?24:4);
 if(mode==='foundation'&&tier(cat,q.u)==='基礎')p+=18;
 if(r.last)p+=Math.min(22,(Date.now()-r.last)/86400000*4);
 return p+Math.random()*17;
}
selectSet=function(cat,n=10){return chooseSet(cat,n)};
const oldStart=start;
start=function(cat){
 if(!chooseSet(cat,1).length){alert('現在の進度設定では出題できる問題がありません。「MI進度・単元設定」を確認してください。');return;}
 oldStart(cat);
};
function setStudyMode(m){
 const c=cfg();c.mode=m;c.updatedAt=Date.now();save();drawMode();drawCards();
}
function drawMode(){
 document.querySelectorAll('[data-study-mode]').forEach(b=>{
  const on=b.dataset.studyMode===cfg().mode;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');
 });
}
function countEligible(cat){return (data[cat]||[]).filter(q=>isAllowed(cat,q,cfg().mode)).length}
function drawCards(){
 cards.innerHTML='';
 const icons={math:'➗',english:'🔤',japanese:'📖',science:'🔬',history:'🏯',geography:'🌍',waka:'🎴'};
 const order=['math','english','japanese','science','history','geography','waka'];
 for(const cat of order){
  const eligible=countEligible(cat),b=document.createElement('button');
  b.className='card';b.disabled=!eligible;
  b.onclick=()=>start(cat);
  b.innerHTML='<b>'+icons[cat]+' '+labels[cat]+'</b><span>'+desc[cat]+'<br>現在のモードで '+eligible+'問／10問ずつ</span>';
  cards.appendChild(b);
 }
}
function topicStats(cat,u){
 const arr=(data[cat]||[]).filter(x=>x.u===u);let attempts=0,correct=0,weak=0;
 for(const q of arr){const r=rec(q.id);attempts+=r.seen;correct+=r.correct;weak+=r.wrong;}
 return {questions:arr.length,attempts,correct,weak,grade:paperGrade(cat,u)};
}
function openStudyPlan(cat='math'){
 show('studyplan');drawStudyPlan(cat);
}
function drawStudyPlan(cat){
 const root=document.getElementById('plan-root');
 document.querySelectorAll('[data-plan-subj]').forEach(b=>b.classList.toggle('on',b.dataset.planSubj===cat));
 root.innerHTML='';
 const intro=document.createElement('p');intro.className='legend';
 intro.textContent='学校で扱った単元を「授業中」「既習」に変更します。未習の単元は出題されません。シラバスは年間予定のため実際の授業進度に合わせて設定してください。';
 root.appendChild(intro);
 const tr=document.createElement('div');tr.className='plan-items';
 for(const [u,t] of topicPlan[cat]||[]){
  const st=status(cat,u),stats=topicStats(cat,u),item=document.createElement('div');
  item.className='plan-item';
  const top=document.createElement('div');top.className='plan-title';
  const left=document.createElement('b');left.textContent=u;
  const hint=document.createElement('span');hint.className='small';hint.textContent=t+'／収録'+stats.questions+'問';
  top.append(left,hint);item.appendChild(top);
  const seg=document.createElement('div');seg.className='plan-seg';
  for(const [v,txt] of [['future','未習'],['now','授業中'],['learned','既習']]){
   const b=document.createElement('button');b.textContent=txt;b.className=st===v?'selected':'';
   b.onclick=()=>{const c=cfg();c.units[cat+'|'+u]=v;c.updatedAt=Date.now();save();drawStudyPlan(cat);drawCards();};
   seg.appendChild(b);
  }
  item.appendChild(seg);
  if(stats.attempts||stats.grade){
   const note=document.createElement('div');note.className='small';note.textContent='アプリ '+stats.attempts+'回答'+(stats.attempts?'・正答率'+Math.round(stats.correct/stats.attempts*100)+'%':'')+'／紙教材 '+({good:'○',maybe:'△',weak:'×'}[stats.grade]||'—');
   item.appendChild(note);
  }
  tr.appendChild(item);
 }
 root.appendChild(tr);
}
function launchFoundationCheck(){
 const focus=['正負の数','指数・累乗','分数・小数','文字式','一次方程式','分数方程式','連立方程式','図形の基本','証明'];
 const taken=[],stateMode=cfg().mode;
 for(const u of focus){
  const qs=data.math.filter(x=>x.u===u);
  if(qs.length){const picked=qs.sort((a,b)=>(rec(a.id).seen-rec(b.id).seen))[0];taken.push(picked);}
 }
 state.cat='math';state.set=taken;state.i=0;state.score=0;state.locked=false;
 state.session=++db.sessions;db.quizUpdatedAt=Date.now();save();
 studyCheck={mode:stateMode,answers:[]};
 show('quiz');render();
}
let studyCheck=null;
const oldAnswer=answer;
answer=function(j,b){
 if(studyCheck&&state.set[state.i]){
  const q=state.set[state.i];studyCheck.answers.push({u:q.u,ok:j===state.correctIndex});
 }
 oldAnswer(j,b);
};
const oldNextQ=nextQ;
nextQ=function(){
 const last=state.i===state.set.length-1;
 oldNextQ();
 if(last&&studyCheck){
  const notes=studyCheck.answers.filter(x=>!x.ok).map(x=>x.u);
  const p=document.createElement('p');p.className='legend';
  p.textContent=notes.length?'簡易診断で要確認：'+[...new Set(notes)].join('、')+'。4択の結果だけでは計算力を断定できません。紙の問題で解き直しましょう。':'簡易診断では全問正解です。分数や方程式は紙に途中式を書いて再確認してください。';
  resultText.appendChild(p);studyCheck=null;
 }
};
const oldBuildReport=buildReport;
buildReport=function(){
 const prefix='【MI年間シラバス対応 v1.0】\n現在の学習モード：'+({foundation:'基礎リカバリー',mi:'MI授業復習',challenge:'応用確認'}[cfg().mode])+'\n';
 return prefix+oldBuildReport()+'\n【授業進度の設定】\n'+Object.entries(topicPlan).map(([cat,ts])=>labels[cat]+'：'+ts.filter(x=>status(cat,x[0])!=='future').map(x=>x[0]+'['+(status(cat,x[0])==='now'?'授業中':'既習')+']').join('、')).join('\n');
};
/* Paper subject tabs must include geography. */
paperCats=function(){return ['math','japanese','english','science','history','geography','waka']};
const newUI='<section id="studyplan" class="screen"><button class="back" onclick="show(\'home\')">← ホーム</button><h2>📅 MI進度・単元設定</h2><p class="legend">年間シラバスを土台に、学校の実際の進度を手動で更新します。</p><div class="tabs" id="plan-tabs"></div><div id="plan-root"></div></section>';
document.querySelector('.wrap').insertAdjacentHTML('beforeend',newUI);
const panel=document.createElement('div');panel.className='study-panel';
panel.innerHTML='<b>学習コースを選択</b><div class="mode-options">'+
 '<button data-study-mode="foundation" onclick="setStudyMode(\'foundation\')">🧩 基礎リカバリー</button>'+
 '<button data-study-mode="mi" onclick="setStudyMode(\'mi\')">📚 MI授業復習</button>'+
 '<button data-study-mode="challenge" onclick="setStudyMode(\'challenge\')">🎯 応用確認</button></div>'+
 '<p class="legend">基礎は既習範囲の穴埋め。MIは授業中・既習の範囲。応用確認も未習単元は出しません。4択だけで計算力や記述力の定着は判断できないため、紙教材と併用します。</p>'+
 '<div class="actions"><button class="secondary" onclick="launchFoundationCheck()">🔎 数学基礎チェック（9問）</button><button class="secondary" onclick="openStudyPlan()">📅 MI進度・単元設定</button></div>';
document.getElementById('home').querySelector('.hero').after(panel);
for(const cat of ['math','english','japanese','science','history','geography','waka']){
 const b=document.createElement('button');b.className='tab';b.dataset.planSubj=cat;b.textContent=labels[cat];
 b.onclick=()=>drawStudyPlan(cat);document.getElementById('plan-tabs').appendChild(b);
}
const style=document.createElement('style');
style.textContent='.study-panel{background:#fff;padding:15px;border-radius:16px;margin:14px 0}.study-panel b{font-size:16px}.mode-options{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-top:12px}.mode-options button{border:1px solid #ccc;border-radius:12px;padding:12px 3px;background:#f6f6f6;font-size:12px;font-weight:700}.mode-options button.on{background:#171717;color:white}.plan-items{background:#fff;border-radius:15px;padding:10px}.plan-item{padding:12px 5px;border-bottom:1px solid #eee}.plan-title{display:flex;justify-content:space-between;gap:6px;margin-bottom:8px}.plan-title .small{white-space:nowrap}.plan-seg{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-bottom:5px}.plan-seg button{background:#fff;border:1px solid #ddd;border-radius:8px;padding:8px 4px;font-size:12px}.plan-seg button.selected{background:#171717;color:#fff}.card:disabled{opacity:.46}';
document.head.appendChild(style);
window.setStudyMode=setStudyMode;
window.openStudyPlan=openStudyPlan;
window.launchFoundationCheck=launchFoundationCheck;
drawMode();drawCards();drawStudyPlan('math');
})();