/* v3.4 English grammar walkthroughs — Part 2 */
(function(){'use strict';const M={
'en2-third-y':[
['語尾のyの直前を見る',['study：d＋y（子音字＋y）','play：a＋y（母音字＋y）'],'studyは子音字dがyの直前にあるのでyをiへ変えてesを付けます。playは母音字a＋yなのでyを変えずsを付けます。'],
['主語が三単現かも確認',['Ken studies English.','My sister carries a bag.','My friends study English.'],'KenとMy sisterは三人称単数なのでstudies・carries。My friendsは複数なので原形studyを使います。動詞の綴りより先に主語を判断します。'],
['間違えやすい綴り',['× studys / carrys','○ studies / carries','○ plays'],'子音字＋yの場合は「y→i＋es」という変化です。単にsを足してstudysにはしません。']],
'en2-do-does':[
['主語を置き換えてみる',['they→Do','he→Does'],'現在の一般動詞の疑問文ではI・you・複数はDo、he/she/itなど三人称単数はDoesで始めます。'],
['二つの疑問文を並べる',['Do they play?','Does he play?'],'どちらも「助動詞＋主語＋動詞の原形」です。Doesの後でもplaysではなくplayの原形になります。'],
['複数名詞にもDo',['My sisters → they','Do my sisters like cats?'],'My sistersは複数なのでDoを使います。複数形のsが付いているからDoesにする、という混同を避けます。']],
'en2-short-reply':[
['質問の最初の助動詞を読む',['Do you like apples?','Yes, I do. / No, I don’t.'],'一般動詞のDoで聞かれた場合、短く答えるときもdoを使います。自分への質問に答えるのでyouをIへ替えます。'],
['Doesで尋ねられたら',['Does he run?','Yes, he does. / No, he doesn’t.'],'主語heはそのままheで受け、Doesで始まる質問にはdoesで答えます。'],
['be動詞との違いを確認',['Is he happy? → Yes, he is.','Does he run? → Yes, he does.'],'be動詞の質問はisで返し、一般動詞の質問はdoesで返します。「Yes, he is」と「Yes, he does」は質問の動詞の種類で選びます。']],
'en2-wh':[
['疑問詞は答える情報を決める',['When＝いつ','Where＝どこで','Why＝なぜ'],'英文の先頭にある疑問詞の意味をまず確かめます。時間を尋ねるときはWhen、場所ならWhere、理由ならWhyです。'],
['質問と答えの対応',['When do you get up?','At seven.'],'At sevenは時刻を表すのでWhenと対応します。WhereやWhyでは答えの種類と一致しません。'],
['理由の答えは一文で',['Why does he stay home?','Because he is sick.'],'Whyにはbecauseを使って理由を答えられます。英語で一文にするならbecauseの後ろに主語と動詞を置きます。']],
'en2-progressive-form':[
['現在進行形の意味',['They study English every day.','They are studying English now.'],'every dayは習慣、nowは今している途中の動作を表します。現在進行形にはbe動詞＋動詞ingを使います。'],
['be動詞を主語で選ぶ',['They → are','study → studying','They are studying English now.'],'現在進行形はbe動詞だけでもing形だけでも完成しません。複数主語Theyにare、studyにingを組み合わせます。'],
['抜けがある文を修正',['× They studying English now.','× They are study English now.','○ They are studying English now.'],'最初の文はareがなく、2番目はstudyingのingがありません。足りない要素を別々に確認しましょう。']],
'en2-progressive-question':[
['肯定文から始める',['They are playing soccer.','主語They、be動詞are、動詞playing'],'現在進行形ではareがすでにあるので、疑問文を作る際にDoを新しく足す必要はありません。'],
['be動詞を主語の前へ',['Are they playing soccer?'],'areとtheyを入れ替え、残りのplaying soccerはそのままにします。最後には疑問符を付けます。'],
['一般動詞の疑問文とは違う',['× Do they are playing soccer?','○ Are they playing soccer?'],'現在進行形の疑問文はbe動詞を前へ出します。一般動詞の現在形で使うDoを混ぜないようにします。']],
'en2-progressive-negative':[
['現在進行形の骨組み',['He is playing now.','主語He＋be動詞is＋playing'],'「今、している最中」を表すのでis playingです。否定にする場合はbe動詞の直後にnotを置きます。'],
['notを置く位置',['He is not playing now.'],'notはisの後ろです。playingはing形のままで、原形playへ戻しません。'],
['一般動詞の否定と比較',['He does not play every day.','He is not playing now.'],'習慣の現在形の否定はdoes not＋原形、現在進行形の否定はis not＋ingです。時の意味と文の型を対応させます。']],
'en2-past-ed':[
['過去を表す語を探す',['They watch TV every day.','They watched TV yesterday.'],'yesterdayは過去を示します。規則動詞watchの肯定文では過去形watchedを使います。'],
['規則動詞の基本変化',['watch → watched','play → played'],'多くの動詞は過去形でedを付けます。ただし不規則動詞もあるため、すべての動詞にedを付ければよいわけではありません。'],
['疑問文では原形へ戻す',['Did they watch TV yesterday?'],'Didが過去の情報を担当するので、後ろの動詞はwatchedでなくwatchです。肯定文の過去形と区別します。']],
'en2-past-irregular':[
['不規則動詞の過去形',['go → went','eat → ate','see → saw'],'一部の一般動詞はedを付けずに別の形へ変わります。時の言葉を読み取って、過去形を選びます。'],
['過去の肯定文を作る',['We ate lunch at noon yesterday.'],'yesterdayは過去を表し、eatの過去形はateです。Weは複数ですが、一般動詞の過去形では三単現のsを付けません。'],
['Didの後ろは原形',['Did we eat lunch?','× Did we ate lunch?'],'Didが過去の役割を表しているため、後ろは原形eatに戻ります。疑問文でateを重ねません。']],
'en2-past-did':[
['肯定文から動詞を見つける',['Ken watched TV last night.','watched＝watchの過去形'],'last nightは昨晩という過去の時を表します。肯定文では一般動詞watchedを使っています。'],
['Didを先頭に出す',['Did Ken watch TV last night?'],'過去の疑問文ではDid＋主語＋動詞の原形です。watchedを原形watchに戻し、last nightを残します。'],
['よくある二重過去を防ぐ',['× Did Ken watched TV?','○ Did Ken watch TV?'],'Didにすでに過去を表す役割があるので、一般動詞にもedを残さないようにします。']],
'en2-read-why':[
['質問が求めるのは理由',['Mio takes a bus because she has a heavy bag.','Why does Mio take a bus?'],'Whyは理由を尋ねる疑問詞です。本文中のbecause以降が答えの根拠になります。'],
['根拠を主語・動詞つきで答える',['Because she has a heavy bag.','she＝主語、has＝動詞'],'単にa heavy bagと名詞だけを書くのではなく、because＋主語＋動詞の文として理由を説明します。'],
['本文の外の推測を足さない',['× Because she is tired.（本文にない）','○ Because she has a heavy bag.'],'読解問題では理由としてありそうなことではなく、本文に書かれた根拠に基づき答えます。']],
'en2-read-when':[
['Whenは時を尋ねる',['Mika goes home at five.','When does Mika go home?'],'Whenは「いつ」を尋ねます。本文から時刻や曜日など、時間に関する表現を探してください。'],
['本文の該当箇所を抜き出す',['at five＝5時に','答え：At five.'],'設問が時刻を聞いているので、at fiveが直接の根拠です。主語や動詞に関する別の情報を書き足す必要はありません。'],
['別の疑問詞との違い',['Where＝場所','When＝時間','Why＝理由'],'答えに「5時」があるならWhen、場所ならWhere、becauseによる理由ならWhyが対応します。']],
'en2-read-full':[
['英文読解は質問を先に特定',['Rina runs because she is late.','Why does Rina run?'],'Whyは理由を問います。because以降に書かれた情報に下線を引き、本文にない情報を足さないようにします。'],
['一文として答える',['Because she is late.','sheは主語、isは動詞'],'Becauseの後ろに主語sheと動詞isが続いています。名詞や形容詞だけで終わらず、文の構造を確認します。'],
['意味だけでなく文法も点検',['× Because late.','○ Because she is late.'],'「遅れているから」という意味が伝わっても、英語の答案では主語と動詞が必要です。短い回答ほど文の構造を確認しましょう。']]
};window.TakumiMasterclassEnglish=Object.assign(window.TakumiMasterclassEnglish||{},M);})();