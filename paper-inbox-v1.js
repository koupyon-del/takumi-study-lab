/* Study Lab paper evidence inbox v1.
   New inbox is independent of study_state; never deletes learning history.
   Authenticated learners read their own rows. Only server-side service_role
   can insert; browser may acknowledge after cloud-verified persistence.
   Parent-verified items are applied automatically; unverified items wait. */
(function(root){
'use strict';
function isMissingTable(error){
 const code=String(error?.code||'');
 const msg=String(error?.message||'');
 return code==='42P01'||code==='PGRST205'||code==='PGRST116'&&/relation|schema cache/i.test(msg)||
   /Could not find the table .paper_evidence_inbox./i.test(msg);
}
function requiredEventIds(result){
 return result.items.map(x=>'paper-batch:'+result.batchId+':'+x.cat+':'+x.unit);
}
const api={isMissingTable,requiredEventIds};
root.TakumiPaperInbox=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
if(!root.document||!root.TakumiTrust)return;
let polling=false,disabled=false,pending=[],lastStatus='';
const intervalMs=120000;
function active(){return typeof cloudUser!=='undefined'&&cloudUser&&typeof cloudReady!=='undefined'&&cloudReady}
function client(){return typeof sb!=='undefined'?sb:null}
function panel(){
 let p=root.document.getElementById('paperInboxPanel');
 if(p)return p;
 const page=root.document.getElementById('paper');
 if(!page)return null;
 p=root.document.createElement('section');
 p.id='paperInboxPanel';
 p.className='qbox';
 p.style.cssText='padding:14px;margin:12px 0;border:1px solid #d9dfda;border-radius:14px';
 const h=root.document.createElement('h3');
 h.textContent='☁ 紙教材の自動受信';
 h.style.margin='0 0 7px';
 const status=root.document.createElement('p');
 status.id='paperInboxStatus';status.className='legend';status.setAttribute('role','status');
 status.style.lineHeight='1.7';
 const list=root.document.createElement('div');list.id='paperInboxRows';
 p.append(h,status,list);
 const target=page.querySelector('.tabs')||page.querySelector('details')||page.lastChild;
 page.insertBefore(p,target);
 return p;
}
function setStatus(text){lastStatus=text;const p=panel();if(p)p.querySelector('#paperInboxStatus').textContent=text}
function textNode(tag,label){const el=root.document.createElement(tag);el.textContent=label;return el}
function humanGrade(grade){return {good:'○ 定着',maybe:'△ あやしい',weak:'× 要復習'}[grade]||grade}
function preview(parsed){
 return parsed.items.map(x=>(typeof labels!=='undefined'?labels[x.cat]||x.cat:x.cat)+'／'+x.unit+' '+humanGrade(x.grade)).join('\n');
}
async function confirmInCloud(ids){
 const row=await cloudRead();
 if(!row?.study_data?.trust?.paperEvents)return false;
 const events=row.study_data.trust.paperEvents;
 return ids.every(id=>Object.prototype.hasOwnProperty.call(events,id));
}
async function acknowledge(row,col){
 if(!['applied_at','dismissed_at'].includes(col))throw Error('不正な確認項目です。');
 const patch={[col]:new Date().toISOString()};
 const {error}=await client().from('paper_evidence_inbox').update(patch).eq('id',row.id)
   .eq('user_id',cloudUser.id).is('applied_at',null).is('dismissed_at',null);
 if(error)throw error;
}
async function applyRow(row,approved){
 if(!active()||!client())return false;
 if(row.review_status!=='parent_verified'&&!approved)return false;
 if(polling&&approved)return false;
 try{
  const parsed=root.TakumiTrust.validatePaperPayload(row.payload);
  const out=root.TakumiTrust.importVerifiedPaperPayload(row.payload,
    approved?'verified_paper_inbox_parent':'verified_paper_inbox_auto');
  // Local save is not sufficient: ACK only after the entire evidence batch
  // has been persisted to the authenticated cloud study_state record.
  await cloudPush();
  if(!await confirmInCloud(requiredEventIds(out))){
   setStatus('採点結果は端末に保存されましたが、クラウドへの保存確認が取れていません。受信記録は残し、再試行します。');
   return false;
  }
  await acknowledge(row,'applied_at');
  pending=pending.filter(x=>x.id!==row.id);
  setStatus(parsed.items.length+'単元の採点結果をクラウドに反映しました。次回の問題選択に利用します。');
  render();
  return true;
 }catch(e){
  console.error('Paper inbox import error:',e);
  setStatus('採点結果を反映できませんでした：'+String(e.message||e)+'。受信記録は残しています。');
  return false;
 }
}
async function dismiss(row){
 if(!root.confirm('この採点結果を取り込まずに受信一覧から除外しますか？'))return;
 try{await acknowledge(row,'dismissed_at');pending=pending.filter(x=>x.id!==row.id);render()}
 catch(e){setStatus('除外できませんでした：'+String(e.message||e))}
}
function render(){
 const p=panel();if(!p)return;
 const area=p.querySelector('#paperInboxRows');
 area.textContent='';
 for(const row of pending){
  let parsed;
  try{parsed=root.TakumiTrust.validatePaperPayload(row.payload)}
  catch(e){const error=textNode('p','受信内容を確認できません：'+String(e.message||e));area.append(error);continue}
  const box=root.document.createElement('div');
  box.style.cssText='padding:10px 0;border-top:1px solid #e4e4e4';
  const head=textNode('strong',parsed.title+'（'+parsed.sourceDate+'）');
  const data=textNode('p',preview(parsed));
  data.style.cssText='font-size:12px;line-height:1.7;white-space:pre-wrap;margin:6px 0';
  box.append(head,data);
  const controls=root.document.createElement('div');controls.style.cssText='display:flex;gap:8px';
  const ok=textNode('button','答案確認済み・登録');
  ok.type='button';ok.className='secondary';ok.style.flex='1';
  ok.onclick=async()=>{
   if(!root.confirm('紙の答案を保護者が確認し、自力で解いた評価であることを確認しましたか？\n'+parsed.sourceDate+'／'+parsed.items.length+'単元'))return;
   ok.disabled=true;
   await applyRow(row,true);
   ok.disabled=false;
  };
  const no=textNode('button','除外');no.type='button';no.className='secondary';
  no.onclick=()=>dismiss(row);
  controls.append(ok,no);box.append(controls);area.append(box);
 }
}
async function poll(){
 if(polling||disabled)return;
 if(!active()||!client()){setStatus('クラウドにログインすると、採点結果を自動確認します。');return}
 polling=true;
 try{
  const {data,error}=await client().from('paper_evidence_inbox')
   .select('id,user_id,batch_key,payload,review_status,created_at')
   .eq('user_id',cloudUser.id).is('applied_at',null).is('dismissed_at',null)
   .order('created_at',{ascending:true}).limit(20);
  if(error){
   if(isMissingTable(error)){disabled=true;setStatus('自動受信用のテーブルが未設定です。既存の学習履歴はそのままです。');return}
   throw error;
  }
  const rows=Array.isArray(data)?data:[];
  pending=rows.filter(x=>x.review_status!=='parent_verified');
  render();
  let imported=0,failed=0;
  for(const row of rows.filter(x=>x.review_status==='parent_verified')){
    if(await applyRow(row,false))imported++;else failed++;
  }
  if(imported)setStatus(imported+'件の確認済み採点結果を自動反映しました。');
  else if(failed)setStatus('自動反映できなかった結果があります。学習履歴は保持し、次回再試行します。');
  else if(pending.length)setStatus('保護者の答案確認が必要な採点結果が'+pending.length+'件あります。');
  else setStatus('自動受信は有効です。新しい採点結果を待っています。');
 }catch(e){setStatus('自動受信の確認に失敗しました。履歴は変更していません：'+String(e.message||e))}
 finally{polling=false}
}
api.poll=poll;api.applyRow=applyRow;api.getStatus=()=>lastStatus;api.pendingCount=()=>pending.length;
const originalOpenPaper=openPaper;
openPaper=function(...args){const r=originalOpenPaper(...args);panel();void poll();return r};
const originalCloudLoadOrSeed=cloudLoadOrSeed;
cloudLoadOrSeed=async function(...args){
 const r=await originalCloudLoadOrSeed(...args);
 if(active())root.setTimeout(()=>void poll(),30);
 return r;
};
function ready(){
 panel();root.setTimeout(()=>void poll(),200);
 root.setInterval(()=>{if(root.document.visibilityState!=='hidden')void poll()},intervalMs);
 root.addEventListener('online',()=>void poll());
 root.document.addEventListener('visibilitychange',()=>{if(root.document.visibilityState==='visible')void poll()});
}
if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})(typeof window!=='undefined'?window:globalThis);
