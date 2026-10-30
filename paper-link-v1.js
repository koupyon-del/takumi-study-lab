/* Study Lab paper evidence link bridge v1.0.
   A link contains only a small, explicit grade payload in the URL fragment
   (not sent to the web server). No private API key or student ID is embedded.
   A parent must review and approve before anything is persisted. */
(function(root){
'use strict';
const SCHEMA='takumi-study-lab-paper-v1';
function encode(payload){
 const str=JSON.stringify(payload);
 const bytes=new TextEncoder().encode(str);
 let binary='';
 for(let i=0;i<bytes.length;i++)binary+=String.fromCharCode(bytes[i]);
 return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function decode(token){
 if(typeof token!=='string'||!token||token.length>16000||!/^[A-Za-z0-9_-]+$/.test(token))throw Error('受取リンクの形式が正しくありません。');
 const s=token.replace(/-/g,'+').replace(/_/g,'/');
 const str=atob(s.padEnd(Math.ceil(s.length/4)*4,'='));
 const bytes=Uint8Array.from(str,ch=>ch.charCodeAt(0));
 const decoded=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
 return JSON.parse(decoded);
}
function createLink(payload){
 if(!root.location||!root.TakumiTrust)throw Error('Study Labでリンクを作成してください。');
 const v=root.TakumiTrust.validatePaperPayload(payload);
 const canonical={schema:SCHEMA,sourceDate:v.sourceDate,title:v.title,subjects:{}};
 for(const item of v.items)(canonical.subjects[item.cat]||(canonical.subjects[item.cat]={}))[item.unit]=({good:'○',maybe:'△',weak:'×'})[item.grade];
 const url=root.location.origin+root.location.pathname+'#paper='+encode(canonical);
 if(url.length>16000)throw Error('採点結果が大きすぎます。複数に分割してください。');
 return url;
}
const api={encode,decode,createLink};
root.TakumiPaperLink=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
if(!root.document||!root.location||!root.TakumiTrust)return;
const hash=root.location.hash||'';
if(!hash.startsWith('#paper='))return;
function clearHash(){
 try{root.history.replaceState(root.history.state,'',root.location.pathname+root.location.search)}catch(e){/* non-fatal */}
}
function el(tag,content){
 const node=root.document.createElement(tag);
 if(content!==undefined)node.textContent=content;
 return node;
}
function showImportDialog(parsed,payload){
 const shade=el('div');
 shade.setAttribute('role','presentation');
 shade.style.cssText='position:fixed;inset:0;z-index:9999;background:#0009;display:flex;align-items:center;justify-content:center;padding:16px';
 const panel=el('section');
 panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','紙教材の採点結果を受け取る');
 panel.style.cssText='max-width:520px;width:100%;max-height:90vh;overflow:auto;border-radius:16px;background:#fff;padding:20px;color:#171717;box-shadow:0 12px 40px #0004';
 const title=el('h2','紙教材の採点結果を受け取りました');title.style.cssText='font-size:19px;margin:0 0 10px';
 const desc=el('p',parsed.title+'／実施日 '+parsed.sourceDate);desc.style.cssText='font-size:14px;line-height:1.7';
 const summary=el('div');
 summary.style.cssText='background:#f4f5f3;border-radius:10px;padding:12px;margin:10px 0;font-size:14px;line-height:1.9;white-space:pre-wrap';
 const chars={good:'○ 定着',maybe:'△ あやしい',weak:'× 要復習'};
 summary.textContent=parsed.items.map(x=>(typeof labels!=='undefined'?labels[x.cat]||x.cat:x.cat)+'／'+x.unit+'：'+chars[x.grade]).join('\n');
 const warning=el('p','保護者が答案を確認し、本人が自力で取り組んだ評価だけを登録してください。確認前に記録を書き換えることはありません。');
 warning.style.cssText='font-size:12px;line-height:1.65;color:#555';
 const feedback=el('p','');feedback.style.cssText='font-size:13px;line-height:1.6';
 feedback.setAttribute('role','status');
 const buttons=el('div');buttons.style.cssText='display:flex;gap:9px;margin-top:12px';
 const cancel=el('button','今回は登録しない');cancel.type='button';cancel.style.cssText='flex:1;padding:12px;border:1px solid #aaa;background:#fff;border-radius:10px';
 const apply=el('button','確認して取り込む');apply.type='button';apply.style.cssText='flex:1;padding:12px;background:#171717;color:white;border:0;border-radius:10px;font-weight:bold';
 cancel.onclick=()=>{clearHash();shade.remove()};
 apply.onclick=()=>{
  try{
   const result=root.TakumiTrust.importVerifiedPaperPayload(payload,'verified_paper_link');
   clearHash();
   apply.disabled=true;
   cancel.textContent='閉じる';
   const status=typeof cloudUser!=='undefined'&&cloudUser&&typeof cloudReady!=='undefined'&&cloudReady?
     'クラウドへの自動同期を開始しました。':'端末には保存しました。クラウド同期にはStudy Labへのログイン・接続が必要です。';
   feedback.textContent=result.added?
     '登録完了：'+result.added+'単元。'+(result.duplicates?'登録済み'+result.duplicates+'単元は重複を防ぎました。':'')+status:
     'この採点結果は登録済みです。重複登録はしていません。';
  }catch(e){feedback.textContent='登録できませんでした：'+String(e.message||e)}
 };
 buttons.appendChild(cancel);buttons.appendChild(apply);
 panel.appendChild(title);panel.appendChild(desc);panel.appendChild(summary);panel.appendChild(warning);panel.appendChild(feedback);panel.appendChild(buttons);
 shade.appendChild(panel);root.document.body.appendChild(shade);apply.focus();
}
try{
 const payload=decode(hash.slice('#paper='.length));
 const parsed=root.TakumiTrust.validatePaperPayload(payload);
 showImportDialog(parsed,payload);
}catch(e){clearHash();root.alert('紙教材の受取リンクを確認できませんでした：'+String(e.message||e))}
})(typeof window!=='undefined'?window:globalThis);
