/* Takumi English Structure Lab: curated sentence seeds, transform drills and feedback.
   All sentence templates were authored for MI Year 1. Deterministic answer keys. */
(function(root){
'use strict';
const unitLabels={skeleton:'主語・動詞・文の骨格',present:'現在形と三単現',past:'過去形',negative:'否定文',question:'疑問文',progress:'現在進行形',be:'be動詞',repair:'間違いを直す'};
const seeds=[
 ['Ken','he','read','reads','read','reading','comic books','is'],
 ['Aya','she','play','plays','played','playing','the piano','is'],
 ['My brother','he','study','studies','studied','studying','English','is'],
 ['My sister','she','write','writes','wrote','writing','a diary','is'],
 ['Tom','he','go','goes','went','going','to the library','is'],
 ['The children','they','draw','draw','drew','drawing','pictures','are'],
 ['The students','they','watch','watch','watched','watching','TV','are'],
 ['Mio','she','take','takes','took','taking','photos','is'],
 ['My father','he','cook','cooks','cooked','cooking','dinner','is'],
 ['The boys','they','run','run','ran','running','in the park','are'],
 ['The teacher','she','teach','teaches','taught','teaching','science','is'],
 ['My classmates','they','practice','practice','practiced','practicing','tennis','are'],
 ['Yuki','she','buy','buys','bought','buying','a notebook','is'],
 ['My mother','she','wash','washes','washed','washing','the dishes','is'],
 ['The dogs','they','eat','eat','ate','eating','their food','are'],
 ['Riku','he','listen','listens','listened','listening','to music','is'],
 ['Ken and Mei','they','walk','walk','walked','walking','to school','are'],
 ['The girls','they','swim','swim','swam','swimming','in the pool','are'],
 ['Our friends','they','make','make','made','making','lunch','are'],
 ['Sora','he','have','has','had','having','breakfast','is']
];
const normalize=x=>String(x||'').normalize('NFKC').replace(/[\u2018\u2019]/g,"'").replace(/\s+/g,' ').trim().toLowerCase().replace(/[.!?]+$/,'').replace(/didn't/g,'did not').replace(/doesn't/g,'does not').replace(/don't/g,'do not').replace(/isn't/g,'is not').replace(/aren't/g,'are not').replace(/wasn't/g,'was not').replace(/weren't/g,'were not').replace(/\s+/g,' ');
const tasks=[];
function add(topic,kind,prompt,answer,why,hint,level=2){
 const answers=Array.isArray(answer)?answer:[answer];
 tasks.push({id:'ES26-'+String(tasks.length+1).padStart(3,'0'),topic,kind,prompt,answers,why,hint,level});
}
function cap(s){return s.slice(0,1).toUpperCase()+s.slice(1)}
function qsubject(subject){return /^(My|The|Our)\s/.test(subject)?subject.slice(0,1).toLowerCase()+subject.slice(1):subject}
function has3rd(pronoun){return pronoun==='he'||pronoun==='she'||pronoun==='it'}
function subjectInfo(s,pronoun){return s+' は '+pronoun+' と同じ扱い。'+(has3rd(pronoun)?'現在形では三単現の形を確認する。':'複数主語なので現在形では原形を使う。')}
const catalog=[];
for(const [s,pron,v,third,past,ing,object,be] of seeds){
 const present=has3rd(pron)?third:v;
 const aux=has3rd(pron)?'does':'do';
 const affirmative=s+' '+present+' '+object+' every day.';
 const pastStatement=s+' '+past+' '+object+' yesterday.';
 const pastNegative=s+' did not '+v+' '+object+' yesterday.';
 const pastQuestion='Did '+qsubject(s)+' '+v+' '+object+' yesterday?';
 const presentNegative=s+' '+aux+' not '+v+' '+object+' every day.';
 const presentQuestion=cap(aux)+' '+qsubject(s)+' '+v+' '+object+' every day?';
 const progress=s+' '+be+' '+ing+' '+object+' now.';
 const progressQuestion=cap(be)+' '+qsubject(s)+' '+ing+' '+object+' now?';
 catalog.push({s,pron,v,third,past,ing,object,be,affirmative,pastStatement,pastNegative,pastQuestion,presentNegative,presentQuestion,progress,progressQuestion});
 add('present','現在形を作る',s+' ( '+v+' ) '+object+' every day. を完全な英文にしなさい。',
   affirmative,'① '+subjectInfo(s,pron)+' ② every day は習慣。③ 動詞は '+present+'。進行形のbe動詞は置かない。',
   '主語が he / she / it のどれに置き換えられるか確認する。',2);
 add('past','過去形にする',s+' ( '+v+' ) '+object+' yesterday. を完全な英文にしなさい。',
   pastStatement,'① yesterday は過去を表す。② 肯定文なので過去の意味を動詞 '+past+' で表す。③ did は使わない。',
   '肯定文の過去形では、動詞そのものの形を確認する。',2);
 add('negative','過去の否定文',pastStatement+' を否定文に変えなさい。時間を表す語は残す。',
   pastNegative,'① yesterday なので過去。② did not が過去・否定を担当。③ 後ろの一般動詞は原形 '+v+'。× did not '+past+' は二重に過去形にしている。',
   '否定を作る助動詞がすでに過去を担当しているか考える。',3);
 add('question','過去の疑問文',pastStatement+' を疑問文にしなさい。時間を表す語は残す。',
   pastQuestion,'① 過去形の一般動詞の疑問文は Did＋主語＋原形。② '+s+' の直前に Did。③ 動詞は '+v+' に戻る。× Did '+qsubject(s)+' '+past+' は誤り。',
   '疑問文の先頭に来る助動詞に「過去」を担当させる。',3);
 add('negative','現在の否定文',affirmative+' を否定文に変えなさい。',
   presentNegative,'① every day は習慣。② '+subjectInfo(s,pron)+' ③ '+aux+' not が否定と現在形を担当。動詞は原形 '+v+'。',
   '主語に合わせて do / does を選び、その直後の動詞を原形にする。',3);
 add('question','現在の疑問文',affirmative+' を疑問文に変えなさい。',
   presentQuestion,'① '+subjectInfo(s,pron)+' ② '+cap(aux)+'＋主語＋動詞の原形。③ '+third+' の -s/-es は does に移るため '+v+' に戻す。',
   '疑問文の先頭に置く助動詞と、動詞の原形を分けて考える。',3);
 add('progress','現在進行形を作る',s+' ( '+v+' ) '+object+' now. を現在進行形の英文にしなさい。',
   progress,'① now は今進行中。② '+s+' に合うbe動詞は '+be+'。③ '+v+' の ing形は '+ing+'。④ '+be+' '+ing+' で一つの動詞表現になる。',
   '主語に合わせたbe動詞と、動詞のing形を組み合わせる。',3);
 add('progress','現在進行形の疑問文',progress+' を疑問文に変えなさい。',
   progressQuestion,'① 進行形 '+be+' '+ing+' のbe動詞 '+be+' を主語の前へ。② '+ing+' はそのまま。③ do/does/did を足さない。',
   '進行形はすでにbe動詞がある。何を主語の前へ移すか考える。',4);
}
const repairs=[
 ['He does not play soccer last Sunday.','He did not play soccer last Sunday.','last Sundayは過去。does→didにする。did の後は動詞の原形 play のまま。'],
 ['Are they study English now?','Are they studying English now?','Are＋主語＋動詞-ing が進行形の疑問文。study→studying。'],
 ['Did Ken went to school yesterday?','Did Ken go to school yesterday?','過去を表す did の後は原形 go。went を残さない。'],
 ['She did not played tennis yesterday.','She did not play tennis yesterday.','did が過去を担当しているので played は原形 play にする。'],
 ['Does your brother studies English every day?','Does your brother study English every day?','Does に三単現の情報がある。一般動詞は study。'],
 ['My sister watch TV every evening.','My sister watches TV every evening.','My sister は she に置き換わる三単現。watch→watches。'],
 ['My friends watches TV every evening.','My friends watch TV every evening.','My friends は複数。現在形の動詞は watch。'],
 ['He is plays the piano now.','He is playing the piano now.','現在進行形は is＋playing。is＋playsではない。'],
 ['She was go to the library yesterday.','She went to the library yesterday.','一般動詞 go の過去肯定文は went。was＋原形は不可。'],
 ['They were study English last night.','They studied English last night.','一般動詞 study の過去肯定文は studied。were＋原形は不可。'],
 ['They are read books now.','They are reading books now.','現在進行形は are＋reading。原形 read ではない。'],
 ['My father do not cook dinner every day.','My father does not cook dinner every day.','My father は he と同じ三単現。does not＋cook。'],
 ['He does not cooks dinner every day.','He does not cook dinner every day.','does が三単現を担当。後ろの動詞は原形 cook。'],
 ['Was you at home yesterday?','Were you at home yesterday?','you に対応するbe動詞の過去形は were。'],
 ['They was happy yesterday.','They were happy yesterday.','they の過去のbe動詞は were。'],
 ['I did not was at home yesterday.','I was not at home yesterday.','be動詞の否定は was の後ろに not。did は用いない。'],
 ['Did she was happy yesterday?','Was she happy yesterday?','be動詞の疑問文は Was＋主語。did を追加しない。'],
 ['Is he write a letter now?','Is he writing a letter now?','進行形は is＋writing。write は e を取って ing。'],
 ['What are they do now?','What are they doing now?','What＋are＋主語＋doing。doing が進行中の動作を示す。'],
 ['She going to school now.','She is going to school now.','現在進行形は be動詞＋going。she の be動詞 is を補う。'],
 ['He goes to the park yesterday.','He went to the park yesterday.','yesterdayなら過去形。goesではなくwent。'],
 ['Were she studying at seven yesterday?','Was she studying at seven yesterday?','she の過去進行形は was＋studying。'],
 ['Do Ken play soccer every day?','Does Ken play soccer every day?','Ken は he＝三単現。Does＋Ken＋原形play。'],
 ['Does they study every night?','Do they study every night?','they は複数なので Do を用いる。'],
 ['She is not study English now.','She is not studying English now.','be動詞の後に not を置いても、動詞の ing形は変わらない。'],
 ['They did not watched TV yesterday.','They did not watch TV yesterday.','did not の後は watch。過去形 watched を使わない。']
];
for(const [wrong,correct,reason] of repairs){
 add('repair','間違いを直す','次の英文の文法の誤りを直して、正しい英文を全文書きなさい：\n'+wrong,
  correct,'【何がおかしい？】'+reason+' 正しい英文：'+correct,'まず時間、次に主語、その後でbe動詞・助動詞と一般動詞の関係を調べる。',4);
}
const beRows=[
 ['I','am','was','at home'],['She','is','was','happy'],['They','are','were','busy'],['We','are','were','at school'],
 ['You','are','were','in the library'],['My parents','are','were','at home'],['Tom','is','was','absent'],['The boys','are','were','tired']
];
for(const [s,now,past,tail] of beRows){
 const text=s+' '+now+' '+tail+'.';
 const statement=s+' '+past+' '+tail+' yesterday.';
 const neg=s+' '+past+' not '+tail+' yesterday.';
 const subj=qsubject(s),question=cap(past)+' '+subj+' '+tail+' yesterday?';
 add('be','be動詞の過去',text+' を「昨日〜だった」という過去の肯定文にしなさい。文末に yesterday を付ける。',
 statement,'主語 '+s+' に合う現在のbe動詞は '+now+'。過去形は '+past+'。一般動詞のように did は追加しない。',
 '主語に合う was/were を考える。',2);
 add('be','be動詞の過去の否定',statement+' を否定文にしなさい。',
 neg,'be動詞の否定文は '+past+'＋not。did not は用いない。',
 'be動詞の後ろに否定の語を入れる。',3);
 add('be','be動詞の過去の疑問',statement+' を疑問文にしなさい。',
 question,'be動詞の疑問文は '+cap(past)+'＋主語。一般動詞の疑問文の Did は使わない。',
 '過去のbe動詞そのものを主語の前に置く。',3);
}
for(const seed of catalog.slice(0,12)){
 const {s,past,object,be,ing}=seed;
 add('skeleton','主語を抜き出す','次の文の主語(S)を、文中と同じ英語で答えなさい：\n'+seed.pastNegative,
  s,'主語は「だれが・何が」の部分：'+s+'。did not は助動詞＋否定、'+seed.v+' は一般動詞。','文の中で動作をする人・ものを探す。',2);
 add('skeleton','動詞表現を抜き出す','次の文で、進行形を表す動詞のまとまりをそのまま抜き出しなさい：\n'+seed.progress,
  be+' '+ing,'この文の動詞表現は '+be+' '+ing+'。be が主語に合い現在の時制を表し、'+ing+' は進行中の動作を表す。2つの独立した文ではない。',
  'be動詞とing形が一まとまりになっているか確認する。',3);
}
const lectures=[
 {id:'skeleton',title:'1｜英文の骨組み：S・Vと「動詞2つ」の正体',steps:[
 ['何から読む？','She plays tennis.','S＝She（だれが）／V＝plays（どうする）／O＝tennis（何を）。文型の「SVOC」は全部の文に必要な記号ではなく、S・V・O・Cの役割を示す考え方。まずSとVを見つける。'],
 ['be動詞が中心の文','She is happy.','S＝She、V＝is、C＝happy。happyは「何をした？」ではなく「どんな状態？」。be動詞の文と、一般動詞の文を区別する。'],
 ['「動詞が2個ある？」','She is studying English.','is studying が進行形の一まとまり。isはbe動詞で現在・主語との一致、studyingは動作の進行を表す。独立した一般動詞を2つただ並べているのではない。'],
 ['助動詞も同じ考え','She did not study yesterday.','did not study が否定の動詞表現。did が過去を担当し、study は原形。肯定文 She studied yesterday. と比べる。']
 ]},
 {id:'present',title:'2｜現在形：主語と三単現',steps:[
 ['毎日の習慣','They play soccer every day.','every day は習慣。they は複数なので動詞の原形 play。'],
 ['he・she・it','Ken plays soccer every day.','Ken は he に置き換えられる。三人称単数の現在形では play→plays。主語の形を確認して動詞を決める。'],
 ['つまずく形','My sister studies English.','study は子音字＋yで終わるので studies。go→goes、watch→watches などの変化も復習する。']
 ]},
 {id:'past',title:'3｜過去形：いつの話か',steps:[
 ['過去を見つける','She walked to school yesterday.','yesterday に注目。肯定文では一般動詞 walk 自体を walked にする。'],
 ['不規則変化','He went to school yesterday.','go→went のような不規則動詞がある。read→read（つづりが同じでも発音が変わる）などは暗記が必要。'],
 ['今日の誤りとの違い','He does not play soccer last Sunday. → He did not play soccer last Sunday.','last Sunday は過去。「does not」は現在の否定。過去の否定は did not＋動詞の原形 play。']
 ]},
 {id:'negative',title:'4｜否定文：何が時制を担当する？',steps:[
 ['現在','He does not play soccer every day.','現在で he なので does not。後ろは plays にせず play。'],
 ['過去','He did not play soccer yesterday.','過去を担当するのは did。後ろの play は原形に戻す。「did not played」は不可。'],
 ['be動詞の場合','She was not at home yesterday.','be動詞の文には did not を加えない。be動詞 was の直後に not を置く。']
 ]},
 {id:'question',title:'5｜疑問文：先頭に来る語を見極める',steps:[
 ['一般動詞の現在','Does Ken study English every day?','現在・三単現では Does＋主語＋原形 study。Ken studies → Does Ken study。'],
 ['一般動詞の過去','Did Ken study English yesterday?','過去形なら Did＋主語＋原形。× Did Ken studied は過去を二重に示している。'],
 ['be動詞の文','Was she at home yesterday?','be動詞がある文なら Was を主語の前へ。Did was とはしない。']
 ]},
 {id:'progress',title:'6｜現在進行形：be＋ingをセットで',steps:[
 ['現在の習慣との違い','They study English every day. / They are studying English now.','毎日の習慣は study。今している動作は are studying。時間の手がかりを見分ける。'],
 ['肯定文を作る','She is studying English now.','S＝She、Vのまとまり＝is studying。主語に合うbe動詞＋動詞ing形で、1つの動詞表現。'],
 ['疑問文を作る','Are they studying English now?','be動詞の are を主語の前に出す。× Are they study は ing が欠けている。'],
 ['典型的な誤り','He is plays tennis. → He is playing tennis.','is＋plays ではない。現在進行形の動作部分は playing。']
 ]},
 {id:'be',title:'7｜be動詞の過去形：was / were',steps:[
 ['主語による違い','I was / She was / They were / You were','過去のbe動詞は主語で was または were。三単現の does とは別の仕組み。'],
 ['否定・疑問','They were not busy. / Were they busy?','否定は be＋not、疑問は be を先頭へ。Did were や do be を使わない。']
 ]},
 {id:'repair',title:'8｜間違いを見抜く4つのチェック',steps:[
 ['①主語','He / They / My brother / My friends','主語は誰か、一人か複数か。he/she/itに置き換えられるか確認する。'],
 ['②時間','every day / yesterday / last Sunday / now','いつの話か。現在の習慣か過去か進行中かを選ぶ。'],
 ['③動詞の種類','be動詞の文か、一般動詞の文か','be動詞ならwas/wereやbe＋ing。一般動詞の過去の否定・疑問ならdidを使う。'],
 ['④動詞の形','Does play / Did play / is playing','助動詞・be動詞に何を担当させたかを決め、一般動詞の形を確認する。']
 ]}
];
const multichoice=[];
let mcId=0;
function mc(unit,stem,answers,explanation,level){
 const unique=new Set(answers.map(normalize));
 if(unique.size!==4)throw Error('Duplicate 4-choice: '+stem);
 multichoice.push({id:'ES26C'+String(++mcId).padStart(3,'0'),u:unit,q:stem,c:answers,a:0,star:level||3,level:level||3,e:explanation,grammarStructure:true});
}
for(const x of catalog){
 const s=x.s,v=x.v,past=x.past,o=x.object,be=x.be,ing=x.ing;
 mc('過去形','【文法のしくみ】「'+s+' は昨日'+o+'」と同じ意味の英文は？',[
   x.pastStatement,s+' '+(x.third)+' '+o+' yesterday.',s+' did '+(past===v?x.third:past)+' '+o+' yesterday.',s+' '+be+' '+v+' '+o+' yesterday.'
 ],'yesterdayは過去。一般動詞の過去の肯定文は '+past+'。did＋過去形やbe＋原形は使わない。',3);
 mc('疑問文・否定文','【文法のしくみ】'+x.pastStatement+' の正しい過去の否定文は？',[
   x.pastNegative,s+' does not '+v+' '+o+' yesterday.',s+' did not '+(past===v?x.third:past)+' '+o+' yesterday.',s+' '+be+' not '+v+' '+o+' yesterday.'
 ],'過去の否定文では did not＋原形 '+v+'。didを使ったら '+past+' の過去形を重ねない。',3);
 mc('現在進行形','【文法のしくみ】'+s+' は今'+o+'。現在進行形として正しいのは？',[
   x.progress,s+' '+be+' '+v+' '+o+' now.',s+' '+x.third+' '+o+' now.',s+' '+(be==='is'?'was':'were')+' '+ing+' '+o+' now.'
 ],'進行形は '+be+'＋'+ing+'。現在形の動詞をis/areの後にそのまま置かない。',3);
}
const allKeys=new Set();
for(const item of tasks){
 if(allKeys.has(item.id)||!item.answers?.length||!item.why||!item.hint||!unitLabels[item.topic])throw Error('Invalid structure task '+item.id);
 allKeys.add(item.id);
}
if(!Array.isArray(data.english))throw Error('No English question bank');
for(const q of multichoice){
 if(data.english.some(x=>x.id===q.id))throw Error('Duplicate MC id '+q.id);
 data.english.push(q);
}
root.TakumiEnglishStructureBank={
 version:'2026-11-16',topics:unitLabels,lectures,items:tasks,choices:multichoice,
 normalize,counts:{writing:tasks.length,fourChoice:multichoice.length}
};
})(window);