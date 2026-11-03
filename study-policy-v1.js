/* Takumi Study Lab v3.12: tutor learning-policy bridge.
 * Read-only authenticated cloud plan. Never edits study history, settings or grades.
 * A conversation alone cannot publish plans: an authorized tutor-side write to
 * tutor_study_plan is required. This module applies published priorities on read. */
(function(root){
'use strict';
if(!root.document)return;
let current=null, activeUser='', busy=false, checkedAt=null, lastError='';
const title='家庭教師の学習方針｜自動反映';
function todayTokyo(){
 return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
}
function effectivePlan(){
 const p=current?.plan;
 if(!p||p.schema!=='takumi-tutor-plan-v1'||typeof p.priorities!=='object'||!p.priorities)return null;
 const today=todayTokyo();
 if((p.startsOn&&today<p.startsOn)||(p.endsOn&&today>p.endsOn))return null;
 return p;
}
function list(cat){
 const a=effectivePlan()?.priorities?.[cat];
 return Array.isArray(a)?a.filter(x=>x&&typeof x.unit==='string'&&Number.isFinite(Number(x.weight))&&Number(x.weight)>0):[];
}
function weight(cat,unit){
 const row=list(cat).find(x=>x.unit===unit);
 return row?Math.min(60,Math.max(0,Number(row.weight))):0;
}
function units(cat){return list(cat).map(x=>x.unit)}
function time(value){
 if(!value)return '未取得';
 return new Date(value).toLocaleString('ja-JP',{timeZone:'Asia/Tokyo',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
}
function make(tag,textValue,className){
 const node=root.document.createElement(tag);
 if(textValue!==undefined)node.textContent=String(textValue);
 if(className)node.className=className;
 return node;
}
function ensurePanel(){
 let panel=root.document.getElementById('ts-policy-panel');
 if(panel)return panel;
 const home=root.document.getElementById('home');
 if(!home)return null;
 panel=make('section',undefined,'ts-policy');
 panel.id='ts-policy-panel';
 const heading=make('h3','🎯 '+title);
 const status=make('p','学習方針を照合しています。','ts-policy-status');status.id='ts-policy-status';status.setAttribute('role','status');
 const contents=make('div');contents.id='ts-policy-contents';
 const actions=make('div',undefined,'actions');
 const refresh=make('button','☁ 今すぐ学習方針を確認','secondary');
 refresh.type='button';refresh.onclick=()=>{void poll()};
 const paper=make('button','📝 紙教材の受信を確認','secondary');
 paper.type='button';paper.onclick=async()=>{
  const inbox=root.TakumiPaperInbox;
  if(!inbox?.poll){root.alert('紙教材の受信機能を読み込めませんでした。再読み込みしてください。');return}
  await inbox.poll();
  const message=inbox.getStatus?.()||'受信結果を確認してください';
  root.alert(message);
 };
 actions.append(refresh,paper);
 const foot=make('p','学習方針は認証済みアカウント専用です。会話だけでは自動送信されず、家庭教師側がクラウドに公開した内容をアプリが取得します。紙教材は保護者確認済みの結果だけを学力評価に使用します。','ts-policy-note');
 panel.append(heading,status,contents,actions,foot);
 const anchor=home.querySelector('.ts-focus')||home.querySelector('.study-panel')||home.querySelector('.ts-lesson-entry');
 if(anchor)anchor.before(panel);else home.append(panel);
 const css=make('style');
 css.textContent='.ts-policy{background:#fff;border:1px solid #d8e1dd;border-radius:16px;padding:15px;margin:12px 0}.ts-policy h3{font-size:16px;margin:0 0 8px}.ts-policy p{font-size:12px;line-height:1.65;color:#47514b}.ts-policy-status{background:#f1f5f2;border-radius:8px;padding:8px 10px}.ts-policy-rows{margin:8px 0;padding-left:17px;font-size:12px;line-height:1.8}.ts-policy .actions button{font-size:12px;min-width:0}.ts-policy-note{margin-bottom:0}';
 root.document.head.appendChild(css);
 return panel;
}
function display(){
 const panel=ensurePanel();if(!panel)return;
 const status=panel.querySelector('#ts-policy-status'),body=panel.querySelector('#ts-policy-contents');
 body.replaceChildren();
 if(!cloudUser||!cloudReady){
  status.textContent='☁ 未接続／学習履歴の初回同期待ち。ログイン後に自動確認します。';
  return;
 }
 if(lastError)status.textContent='⚠ 方針照合エラー：'+lastError+'。前回取得分の扱いを確認してください。';
 else if(!checkedAt)status.textContent='☁ クラウドで学習方針を照合中です。';
 else if(!current)status.textContent='学習方針はまだ公開されていません。最終確認：'+time(checkedAt);
 else if(!effectivePlan())status.textContent='⚠ 方針の対象期間外です。改定が必要です（版'+current.revision+'）。';
 else status.textContent='✅ クラウド方針を反映：版'+current.revision+' ／ 公開 '+time(current.updated_at)+' ／ 最終確認 '+time(checkedAt);
 const p=current?.plan;
 if(!p)return;
 const heading=make('b',p.title||'学習方針');body.appendChild(heading);
 if(p.overview)body.appendChild(make('p',p.overview));
 if(!effectivePlan()){body.appendChild(make('p','期間外の方針は出題優先順位に適用しません。'));return}
 for(const [cat,name] of [['math','数学'],['english','英語']]){
  const chosen=list(cat);if(!chosen.length)continue;
  body.appendChild(make('b',name+'の重点：'));
  const ul=make('ul',undefined,'ts-policy-rows');
  for(const item of chosen.slice(0,7))ul.appendChild(make('li',item.unit+'（優先度+'+item.weight+'）'+(item.reason?' — '+item.reason:'')));
  body.appendChild(ul);
 }
 if(Array.isArray(p.daily)&&p.daily.length){
  body.appendChild(make('b','1日の学習枠'));
  const ul=make('ul',undefined,'ts-policy-rows');
  for(const d of p.daily)ul.appendChild(make('li',d.label+'（最大'+d.maxMinutes+'分） '+d.description));
  body.appendChild(ul);
 }
 body.appendChild(make('p','※ 重点単元でも、学校進度設定が「未習」の問題は出題しません。4択の成績だけで定着済みにはしません。'));
}
function refreshSelections(){
 root.TakumiDailyFocus?.refresh?.();
 root.TakumiCurriculum?.refresh?.();
}
async function poll(){
 if(busy)return;
 ensurePanel();
 if(!cloudUser||!cloudReady||!sb){
  current=null;activeUser='';lastError='';checkedAt=null;display();return;
 }
 if(activeUser!==cloudUser.id){activeUser=cloudUser.id;current=null;checkedAt=null}
 busy=true;
 try{
  const {data,error}=await sb.from('tutor_study_plan')
   .select('revision,plan,updated_at').eq('user_id',cloudUser.id).maybeSingle();
  if(error)throw error;
  if(data&&(!data.plan||data.plan.schema!=='takumi-tutor-plan-v1'))throw Error('学習方針の形式が正しくありません');
  const changed=(data?.revision||0)!==(current?.revision||0) ||
    (data?.updated_at||'')!==(current?.updated_at||'');
  current=data||null;checkedAt=new Date().toISOString();lastError='';
  if(changed)refreshSelections();
 }catch(e){lastError=String(e?.message||e)}
 finally{busy=false;display()}
}
root.TakumiStudyPolicy={weight,units,poll,refresh:display,effectivePlan,version:'3.12'};
const oldLoad=cloudLoadOrSeed;
cloudLoadOrSeed=async function(...args){
 const result=await oldLoad(...args);
 if(cloudUser&&cloudReady)void poll();
 return result;
};
const oldSignOut=cloudSignOut;
cloudSignOut=async function(...args){
 const result=await oldSignOut(...args);
 current=null;activeUser='';checkedAt=null;lastError='';display();
 return result;
};
function ready(){
 ensurePanel();display();
 root.setTimeout(()=>{void poll()},300);
 root.setInterval(()=>{if(!root.document.hidden)void poll()},60000);
 root.addEventListener('online',()=>{void poll()});
 root.addEventListener('focus',()=>{void poll()});
 root.document.addEventListener('visibilitychange',()=>{if(!root.document.hidden)void poll()});
}
if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',ready,{once:true});
else ready();
})(typeof window!=='undefined'?window:globalThis);
