/* v3.4 English grammar walkthroughs — Part 1 */
(function(){'use strict';const M={
'en-verb':[
['主語が複数かを判定する',['My brothers (watch) TV after school.','My brothers → they'],'brothersは2人以上を表すので主語は複数です。一般動詞の現在形ではI・you・複数主語のとき動詞の原形watchを使います。'],
['文の骨組みを先に作る',['My brothers + watch + TV','after school を最後に置く','My brothers watch TV after school.'],'英語では「誰が＋どうする＋何を」の順に作り、after schoolのような時を表す語句を加えます。動詞watchにはsを付けません。'],
['単数なら形が変わる',['My brother watches TV.','My brothers watch TV.'],'brotherは1人でheに置き換えられるためwatches、brothersは複数なのでwatchです。主語のsと動詞のsを機械的にそろえないでください。']],
'en-third':[
['現在の習慣＋三人称単数',['My father goes to work every day.','My father → he'],'My fatherは話し手でも聞き手でもない1人なので三人称単数です。every dayは習慣を表し、現在形の一般動詞にs/esが必要です。'],
['goとstudyの形を比較',['go → goes','watch → watches','study → studies'],'動詞の語尾によりs/esの付け方が変わります。studyは子音字d＋yなのでyをiに変えますが、playはa＋yなのでplaysです。'],
['疑問文では原形に戻す',['He goes to school.','Does he go to school?'],'Doesが三人称単数現在の情報を表すので、後ろの一般動詞はgoの原形です。Does he goesにはしません。']],
'en-question':[
['肯定文の主語と動詞を確認',['Mika watches TV after dinner.','Mika → she、動詞watches'],'この文はbe動詞ではなく一般動詞watchesを使います。Mikaは1人なので三人称単数です。'],
['Doesを文頭、動詞は原形',['Does + Mika + watch + TV after dinner?','Does Mika watch TV after dinner?'],'疑問文ではDoesが三単現の役割を引き受けます。watchesを原形watchに戻し、語順をDoes＋主語＋原形にします。'],
['間違いを見つける',['× Does Mika watches TV?','○ Does Mika watch TV?'],'Doesに三単現の働きがあるため、後ろのwatchにもesを重ねて付けるのは誤りです。文末の疑問符も忘れません。']],
'en-why':[
['疑問詞は答える内容を決める',['Why does Ken walk today?','Why → 理由を尋ねる'],'まず何を聞かれているかを読み、Whyなら理由を探します。WhenやWhereとは答えの種類が違います。'],
['本文から理由を抜き出す',['Ken walks because his bicycle is broken.','根拠：because his bicycle is broken'],'becauseの後ろは「自転車が壊れているから」と理由を説明しています。本文にない想像は答案へ入れません。'],
['Becauseの後ろも文にする',['Because his bicycle is broken.','主語his bicycle＋動詞is'],'Because a broken bicycleのように主語と動詞が欠けた答えは避けます。意味だけでなく英文としての構造を確認します。']],
'en-tense':[
['現在形と現在進行形の違い',['They study English every day.','They are studying English now.'],'every dayは普段の習慣を表します。一方nowは今している途中の動作なので、be動詞＋動詞ingの形を使います。'],
['主語を見てbe動詞を選ぶ',['They → are','study → studying','They are studying English now.'],'現在進行形は「主語＋be動詞＋現在分詞」です。Theyにはareを選び、studyにingを付けます。'],
['不足する部分を特定する',['× They studying English now.','× They are study English now.','○ They are studying English now.'],'be動詞が抜ける誤りとingを忘れる誤りを別々に確認します。現在進行形には両方必要です。']],
'en2-be-am':[
['状態をつなぐbe動詞',['I am happy.','You are happy.','He is happy.'],'be動詞は主語と状態などを結ぶ働きをします。誰がその状態なのかを最初に見て、am・are・isの形を選びます。'],
['主語との対応を確かめる',['I → am','you / we / they → are','he / she / it → is'],'Iにはam、youや複数にはare、he/she/itなど三人称単数にはisです。表の形を英文に当てはめてみましょう。'],
['一般動詞の疑問文と混ぜない',['○ Is he happy?','× Does he is happy?'],'be動詞の疑問文はbe動詞を主語の前へ移します。一般動詞用のDoesを追加する必要はありません。']],
'en2-be-plural':[
['複数を示す語を探す',['The boys are in the park.','boys＝2人以上、theyと同じ'],'boyの後ろにsが付き、複数を表します。主語が2人以上なのでbe動詞はareです。'],
['単数と複数を対比する',['A boy is in the park.','The boys are in the park.'],'a boyは1人なのでheと同じisです。the boysは複数なのでtheyと同じareです。数を先に判定すると形が決まります。'],
['数量を確認する習慣',['My parents are busy.','My sister is busy.'],'parentsは複数、sisterは1人です。末尾のsや意味を見ながら、主語とbe動詞の対応を確かめます。']],
'en2-be-question':[
['肯定文から始める',['They are friends.','主語They、be動詞are'],'be動詞の疑問文は主語とbe動詞の順番が変わります。まず主語とbe動詞を囲ってから並べ替えます。'],
['be動詞を主語の前へ',['Are + they + friends?','Are they friends?'],'主語Theyの前へareを移して先頭を大文字にし、最後に疑問符を置きます。語順以外の意味を勝手に変えません。'],
['Doを加える誤りを避ける',['× Do they are friends?','○ Are they friends?'],'be動詞areがある文はDoを追加しません。一般動詞の疑問文の作り方とは分けて覚えます。']],
'en2-be-past':[
['現在と過去を区別する',['I am busy today.','I was busy yesterday.'],'yesterdayは過去の時を示します。be動詞の過去は主語に合わせてwasまたはwereを使います。'],
['主語に合わせて選ぶ',['I / he / she / it → was','you / we / they → were'],'同じ過去でも主語が単数か複数かなどで形が変わります。Weは複数なのでwereです。'],
['時を表す語と照合',['We were at home yesterday.','× We was at home yesterday.'],'yesterdayがあるので過去形、Weにはwereです。現在形areと過去形wereを混ぜないようにします。']],
'en2-verb-plural':[
['主語が複数なら原形',['My brothers watch TV every night.','My brothers → they'],'一般動詞の現在形では、主語がI・you・複数であれば原形を使います。brothersは複数なのでwatchです。'],
['肯定文の骨組みを確かめる',['My brothers＋watch＋TV','every night＝毎晩'],'英語は基本的に主語＋動詞＋目的語と並べます。every nightはいつするのかを示す語句です。'],
['単数と並べて比べる',['My brother watches TV.','My brothers watch TV.'],'主語が1人なら三単現のesが必要ですが、複数ならwatchのままです。主語の数を見ずに動詞へsを付けないことが重要です。']],
'en2-verb-negative':[
['一般動詞の否定の作り方',['I play tennis.','do not / don’t＋動詞の原形'],'一般動詞playを含む現在形の文では、主語がIの場合はdo notを使います。be動詞のnotの入れ方とは異なります。'],
['文の中にdon’tを置く',['I + do not + play + tennis.','I don’t play tennis.'],'主語の後にdo notを置き、一般動詞playは原形のままにします。意味は「私はテニスをしません」です。'],
['be動詞と混ぜない',['× I am not play tennis.','○ I do not play tennis.'],'playは一般動詞なので、現在形の否定でam notを挿入しません。主語＋don’t＋原形を一まとまりで覚えます。']],
'en2-verb-question':[
['一般動詞を先に見つける',['You study English.','studyは一般動詞'],'この肯定文にはbe動詞がありません。主語Youと一般動詞studyを確認してから、疑問文を組み立てます。'],
['Doを主語の前に置く',['Do + you + study + English?','Do you study English?'],'主語youの前にDoを置いて、後の動詞studyは原形のままにします。be動詞areを加えません。'],
['短い返答の形',['Do you study English?','Yes, I do. / No, I don’t.'],'youで尋ねられた人が自分について答えるならIを使います。Doを使った質問にはdoで返します。']],
'en2-verb-order':[
['英語の基本語順を選ぶ',['[ after school / we / study / English ]','主語We、動詞study、目的語English'],'日本語の語順をそのまま移すのではなく「誰が＋どうする＋何を」の順番を先に決めます。'],
['主語から英文を完成する',['We study English after school.','We＝私たちは','study English＝英語を勉強する'],'after schoolはいつ勉強するかを表します。基本の主語＋動詞＋目的語のまとまりを保ち、その後に時の情報を置きます。'],
['三単現による変化',['She studies English after school.','We study English after school.'],'Weは複数なのでstudy、Sheは1人で三単現なのでstudiesになります。語順と動詞の形は別々に判断します。']],
'en2-third-es':[
['語尾によって-esが必要',['watch → watches','go → goes'],'一般動詞の三単現では通常sを付けますが、watchやgoのような語はesを付けます。watchsやgosにはしません。'],
['主語から形を決める',['She watches TV every day.','He goes to school.'],'SheとHeは三人称単数で、every dayなど現在の習慣を表すので、動詞をwatches・goesの形にします。'],
['疑問文では原形',['Does she watch TV?','Does he go to school?'],'Doesが三単現の役割を担うため、後ろの動詞は原形watch・goへ戻ります。肯定文と疑問文を混同しないでください。']]
};window.TakumiMasterclassEnglish=Object.assign(window.TakumiMasterclassEnglish||{},M);})();