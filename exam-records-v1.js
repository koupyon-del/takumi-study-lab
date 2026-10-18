/* Takumi Study Lab v1.7: independent, verified school-exam result journal. */
(function(){
'use strict';
const SUBJECTS=['math','english','japanese','science','history','geography'];
const GRADES={good:'○ 定着傾向',maybe:'△ あやしい',weak:'× 要復習'};
const CAUSES={knowledge:'知識不足',approach:'方針不明',calculation:'計算ミス',reading:'読み違い',notation:'記述・表記',time:'時間切れ',other:'その他'};
let editingId=null,formUnits=[],showingForm=false;
function el(id){return document.getElementById(id)}
function textNode(tag,value,cls){const x=document.createElement(tag);if(value!==undefined)x.textContent=value;if(cls)x.className=cls;return x}
function current(){if(!db.examRecords||typeof db.examRecords!=='object'||Array.isArray(db.examRecords))db.examRecords={};return db.examRecords}
function records(){return Object.values(current()).filter(x=>x&&x.deleted!==true).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))||(Number(b.updatedAt)||0)-(Number(a.updatedAt)||0))}
function dateToday(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function validDate(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T00:00:00Z');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===s}
function numberOrNull(v){if(v===null||v===undefined||String(v).trim()==='')return null;const n=Number(v);return Number.isFinite(n)?n:NaN}
function validate(raw){
 if(!raw||typeof raw!=='object')throw Error('データの形式が違います');
 const cat=String(raw.cat||'');
 if(!SUBJECTS.includes(cat))throw Error('教科が登録対象外です');
 const date=String(raw.date||'');
 if(!validDate(date))throw Error('実施日を正しく入力してください');
 const title=String(raw.title||'').trim().slice(0,90);
 if(!title)throw Error('考査名を入力してください');
 const part=String(raw.part||'').trim().slice(0,60);
 const score=numberOrNull(raw.score),max=numberOrNull(raw.max),average=numberOrNull(raw.average);
 const rank=numberOrNull(raw.rank),cohort=numberOrNull(raw.cohort);
 if(score===null||max===null||!Number.isFinite(score)||!Number.isFinite(max)||max<=0||score<0||score>max)throw Error('本人点と満点の値を確認してください');
 if(average!==null&&(!Number.isFinite(average)||average<0||average>max))throw Error('平均点は0〜満点の範囲で入力してください');
 if(rank!==null&&(!Number.isInteger(rank)||rank<1))throw Error('順位は1以上の整数で入力してください');
 if(cohort!==null&&(!Number.isInteger(cohort)||cohort<1))throw Error('学年人数は1以上の整数で入力してください');
 if(rank!==null&&cohort!==null&&rank>cohort)throw Error('順位が学年人数を超えています');
 const input=Array.isArray(raw.units)?raw.units:[];
 const seen=new Set(),units=[];
 for(const u of input.slice(0,80)){
  const unit=String(u?.unit||'').trim().slice(0,90);
  if(!unit)continue;
  if(seen.has(unit))throw Error('同じ単元が重複しています：'+unit);
  seen.add(unit);
  const grade=String(u.grade||'');
  if(grade&&!Object.prototype.hasOwnProperty.call(GRADES,grade))throw Error('単元評価が不正です：'+unit);
  const cause=String(u.cause||'');
  if(cause&&!Object.prototype.hasOwnProperty.call(CAUSES,cause))throw Error('失点原因が不正です：'+unit);
  units.push({unit,grade,cause,memo:String(u.memo||'').slice(0,250)});
 }
 return {id:String(raw.id||'').slice(0,110)||('exam-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10)),
  title,date,cat,part,score,max,average,rank,cohort,units,
  verified:raw.verified===true,notes:String(raw.notes||'').slice(0,1000),
  updatedAt:Number(raw.updatedAt)||Date.now(),deleted:false};
}
function field(label,id,type,placeholder){
 const box=textNode('label',undefined,'er-field'),caption=textNode('span',label);
 const input=document.createElement('input');input.id=id;input.type=type||'text';input.placeholder=placeholder||'';
 if(type==='number'){input.min='0';input.step='any'}
 box.append(caption,input);return box;
}
function selectOptions(select,entries){
 for(const [value,label] of entries){const op=document.createElement('option');op.value=value;op.textContent=label;select.appendChild(op)}
}
function showNew(){
 editingId=null;formUnits=[];showingForm=true;
 el('er-form-title').textContent='考査結果を登録';
 el('er-title').value='2学期中間考査';
 el('er-date').value=dateToday();
 el('er-cat').value='math';el('er-part').value='数量';
 for(const id of ['er-score','er-max','er-average','er-rank','er-cohort','er-notes'])el(id).value='';
 el('er-verified').checked=false;drawUnitOptions();drawUnits();draw();
 el('er-form').scrollIntoView({behavior:'smooth',block:'start'});
}
function edit(id){
 const r=current()[id];if(!r||r.deleted)return;
 editingId=id;showingForm=true;
 el('er-form-title').textContent='考査結果を編集';
 el('er-title').value=r.title;el('er-date').value=r.date;el('er-cat').value=r.cat;el('er-part').value=r.part||'';
 for(const k of ['score','max','average','rank','cohort','notes'])el('er-'+k).value=r[k]===null||r[k]===undefined?'':r[k];
 el('er-verified').checked=r.verified===true;
 formUnits=(r.units||[]).map(x=>({...x}));drawUnitOptions();drawUnits();draw();
 el('er-form').scrollIntoView({behavior:'smooth',block:'start'});
}
function drawUnitOptions(){
 const list=el('er-unit-options');list.replaceChildren();
 const cat=el('er-cat').value;
 for(const unit of new Set((data[cat]||[]).map(q=>q.u))){
  const opt=document.createElement('option');opt.value=unit;list.appendChild(opt);
 }
}
function drawUnits(){
 const list=el('er-units');list.replaceChildren();
 formUnits.forEach((u,i)=>{
  const row=textNode('div',undefined,'er-unit-row');
  const name=document.createElement('input');name.type='text';name.setAttribute('list','er-unit-options');name.placeholder='単元（候補から選択または自由入力）';name.value=u.unit||'';
  name.oninput=()=>u.unit=name.value;row.appendChild(name);
  const grade=document.createElement('select');
  selectOptions(grade,[['','判定なし'],...Object.entries(GRADES)]);
  grade.value=u.grade||'';grade.onchange=()=>u.grade=grade.value;row.appendChild(grade);
  const cause=document.createElement('select');
  selectOptions(cause,[['','失点原因を選択'],...Object.entries(CAUSES)]);
  cause.value=u.cause||'';cause.onchange=()=>u.cause=cause.value;row.appendChild(cause);
  const memo=document.createElement('input');memo.type='text';memo.placeholder='例：負数で割るときに逆転を忘れた';memo.value=u.memo||'';
  memo.oninput=()=>u.memo=memo.value;row.appendChild(memo);
  const remove=textNode('button','削除','secondary');remove.type='button';remove.onclick=()=>{formUnits.splice(i,1);drawUnits()};row.appendChild(remove);
  list.appendChild(row);
 });
}
function collect(){
 return {id:editingId||'',title:el('er-title').value,date:el('er-date').value,cat:el('er-cat').value,part:el('er-part').value,
 score:el('er-score').value,max:el('er-max').value,average:el('er-average').value,rank:el('er-rank').value,cohort:el('er-cohort').value,
 units:formUnits,verified:el('er-verified').checked,notes:el('er-notes').value,updatedAt:Date.now()};
}
function saveRecord(){
 try{
  const r=validate(collect());
  if(!confirm((editingId?'更新':'登録')+'しますか？'+(r.verified?'\\n確認済みの単元評価は弱点優先出題にも反映されます。':'\\n未確認の結果は記録のみ行い、出題優先度には反映されません。')))return;
  current()[r.id]=r;save();showingForm=false;editingId=null;draw();
 }catch(e){alert(String(e.message||e))}
}
function deleteRecord(id){
 const r=current()[id];if(!r||r.deleted)return;
 if(!confirm(r.title+'（'+r.date+'）を削除しますか？\\n学習履歴はそのままです。'))return;
 current()[id]={...r,deleted:true,updatedAt:Date.now()};
 if(editingId===id){editingId=null;showingForm=false}
 save();draw();
}
function percent(v,max){return Math.round(v/max*1000)/10}
function fmt(n){return n===null||n===undefined?'—':String(n)}
function valueRow(label,value){const row=textNode('div',undefined,'er-result-row');row.append(textNode('span',label),textNode('strong',value));return row}
function bar(label,pct,cl){
 const wrap=textNode('div',undefined,'er-bar-wrap');wrap.appendChild(textNode('div',label+' '+pct.toFixed(1)+'%','er-bar-label'));
 const track=textNode('div',undefined,'er-track'),fill=textNode('div',undefined,'er-fill '+cl);
 fill.style.width=Math.max(0,Math.min(100,pct))+'%';track.appendChild(fill);wrap.appendChild(track);return wrap;
}
function comparison(r,arr){
 const previous=arr.filter(x=>x.cat===r.cat&&(x.part||'')===(r.part||'')&&x.id!==r.id&&String(x.date)<=String(r.date))
 .sort((a,b)=>String(b.date).localeCompare(String(a.date))||(b.updatedAt||0)-(a.updatedAt||0))[0];
 if(!previous)return '同じ教科・区分の前回データなし';
 const change=percent(r.score,r.max)-percent(previous.score,previous.max);
 const sign=change>0?'+':'';
 return '前回 '+previous.date+' と比較：'+sign+change.toFixed(1)+'ポイント（得点率）';
}
function drawList(){
 const box=el('er-records');box.replaceChildren();const arr=records();
 el('er-count').textContent=arr.length+'件の考査結果';
 if(!arr.length){box.appendChild(textNode('p','登録済みの結果はまだありません。返却された答案を確認して登録してください。','legend'));return}
 for(const r of arr){
  const card=textNode('div',undefined,'er-card');
  const h=textNode('div',undefined,'er-card-head');
  const title=textNode('b',r.title+'｜'+(labels[r.cat]||r.cat)+(r.part?'・'+r.part:''));
  const tag=textNode('span',r.verified?'確認済み':'未確認','er-tag');
  h.append(title,tag);card.append(h,textNode('div',r.date,'er-muted'));
  card.appendChild(valueRow('本人得点',r.score+' / '+r.max+'点（'+percent(r.score,r.max).toFixed(1)+'%）'));
  card.appendChild(bar('本人',percent(r.score,r.max),'er-student'));
  if(r.average!==null){card.appendChild(valueRow('学年平均',r.average+' / '+r.max+'点'));card.appendChild(bar('学年平均',percent(r.average,r.max),'er-average'))}
  const d=r.average===null?'平均未入力':'平均との差：'+(r.score-r.average>=0?'+':'')+(Math.round((r.score-r.average)*10)/10)+'点';
  card.appendChild(textNode('p',d,'er-muted'));
  if(r.rank!==null||r.cohort!==null)card.appendChild(textNode('p','順位：'+fmt(r.rank)+' / '+fmt(r.cohort)+'人（学校発表値のみ）','er-muted'));
  card.appendChild(textNode('p',comparison(r,arr),'er-muted'));
  if(r.units.length){
   const unitBox=textNode('div',undefined,'er-tags');
   for(const u of r.units){
    const text=u.unit+' '+(GRADES[u.grade]||'未判定')+(u.cause?'・'+(CAUSES[u.cause]||u.cause):'');
    const t=textNode('span',text,'er-unit-tag');t.title=u.memo||'';unitBox.appendChild(t);
   }
   card.appendChild(unitBox);
  }
  if(r.notes)card.appendChild(textNode('p',r.notes,'er-note'));
  const actions=textNode('div',undefined,'actions');
  const editBtn=textNode('button','編集','secondary');editBtn.onclick=()=>edit(r.id);
  const delBtn=textNode('button','削除','secondary');delBtn.onclick=()=>deleteRecord(r.id);
  actions.append(editBtn,delBtn);card.appendChild(actions);box.appendChild(card);
 }
}
function draw(){
 el('er-form').hidden=!showingForm;
 el('er-new').hidden=showingForm;
 drawList();
}
function downloadJSON(payload,filename){
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportResults(){downloadJSON({schema:'takumi-study-lab-exam-results-v1',exportedAt:new Date().toISOString(),records:records()},
 'Takumi_Study_Lab_exam_results_'+dateToday()+'.json')}
function importResults(ev){
 const file=ev.target.files?.[0];if(!file)return;
 const reader=new FileReader();
 reader.onload=()=>{
  try{
   const payload=JSON.parse(reader.result);
   if(!['takumi-study-lab-exam-results-v1','takumi-study-lab-exam-result-v1'].includes(payload?.schema))throw Error('StudyLabの考査結果JSONではありません');
   const inputs=Array.isArray(payload.records)?payload.records:payload.record?[payload.record]:[];
   if(!inputs.length||inputs.length>200)throw Error('取り込み可能な結果がありません');
   const normalized=inputs.map(raw=>validate(raw));
   const verified=normalized.filter(r=>r.verified).length;
   if(!confirm(normalized.length+'件の考査結果を取り込みますか？\\n確認済み '+verified+'件。既存と同じIDは更新日時の新しい結果を採用します。'))return;
   const all=current();let count=0;
   for(const r of normalized){
    const prev=all[r.id];if(!prev||(Number(r.updatedAt)||0)>(Number(prev.updatedAt)||0)){all[r.id]=r;count++}
   }
   if(count)save();draw();alert(count+'件の考査結果を取り込みました。');
  }catch(e){alert('読み込み失敗：'+String(e.message||e))}
  finally{ev.target.value=''}
 };
 reader.onerror=()=>{alert('ファイルを読み込めませんでした');ev.target.value=''};
 reader.readAsText(file,'utf-8');
}
function reportText(){
 const rs=records(),lines=['【定期考査・模試の記録】','保存済み '+rs.length+'件（学校の採点済み答案を優先。未確認の評価は出題に反映しない。）'];
 for(const r of rs.slice(0,12)){
  let x=r.date+' '+r.title+'／'+(labels[r.cat]||r.cat)+(r.part?'・'+r.part:'')+'：'+r.score+'/'+r.max+'点';
  if(r.average!==null)x+='、平均'+r.average+'点、差'+(r.score-r.average>=0?'+':'')+(r.score-r.average)+'点';
  if(r.rank!==null)x+='、順位'+r.rank+(r.cohort!==null?'/'+r.cohort:'');
  x+='、'+(r.verified?'答案確認済':'未確認');lines.push(x);
  for(const u of r.units)lines.push('  '+u.unit+'：'+(GRADES[u.grade]||'未判定')+(u.cause?'／'+CAUSES[u.cause]:'')+(u.memo?'／'+u.memo:''));
 }
 lines.push('※中間考査から偏差値・順位を推定しない。平均点との差のみを記載。');
 return lines.join('\n');
}
function open(){show('examRecords');draw()}
function refresh(){if(el('examRecords')?.classList.contains('active'))draw()}
const main=document.createElement('section');main.className='screen';main.id='examRecords';
main.innerHTML='<button class="back" id="er-back">← ホーム</button><h2>📈 考査結果・学力の変化</h2>'+
 '<p class="legend">学校の考査・模試の本人点、満点、学年平均と、答案から確認した単元別の弱点を保存します。本人点を推定せず、未返却の数値は空欄のままにしてください。</p>'+
 '<div class="actions"><button class="secondary" id="er-new">＋ 考査結果を追加</button><button class="secondary" id="er-export">⬇ JSONで書き出し</button></div>'+
 '<p class="legend" id="er-count"></p><div id="er-records"></div>'+
 '<div id="er-form" class="er-card" hidden><h3 id="er-form-title">考査結果を登録</h3>'+
 '<div class="er-fields" id="er-fields"></div>'+
 '<p class="er-subhead">答案で確認した単元別の評価（任意）</p>'+
 '<p class="legend">○＝この考査で正しく扱えた／△＝不安定／×＝誤答・要修復。1回の正解だけでは「定着確定」にしません。登録済みの問題集にない単元も入力できますが、その場合は自動出題に直結しません。</p>'+
 '<datalist id="er-unit-options"></datalist><div id="er-units"></div>'+
 '<button class="secondary" id="er-add-unit" type="button">＋ 単元を追加</button>'+
 '<label class="er-check"><input type="checkbox" id="er-verified"> 採点済み答案を保護者が確認した（この単元評価を出題優先度に使用）</label>'+
 '<div class="actions"><button class="next" id="er-save" style="display:block" type="button">保存</button><button class="secondary" id="er-cancel" type="button">キャンセル</button></div></div>'+
 '<div class="er-card"><h3>ChatGPTで分析した結果を取り込む</h3><p class="legend">この画面では写真の自動読み取りは行いません。答案をChatGPTで確認した後、StudyLab形式のJSONを読み込めます。学習履歴のバックアップとは別のファイルです。</p>'+
 '<input type="file" accept=".json,application/json" id="er-import"></div>';
document.querySelector('.wrap').appendChild(main);
const fields=el('er-fields');
fields.append(field('考査名','er-title','text','例：2学期中間考査'),
 field('実施日','er-date','date'),
 field('区分（任意）','er-part','text','例：数量、図形、理科A、理科B'),
 field('本人点','er-score','number','例：62'),
 field('満点','er-max','number','例：100'),
 field('学年平均（任意）','er-average','number','例：55'),
 field('順位（任意）','er-rank','number','学校発表値のみ'),
 field('学年人数（任意）','er-cohort','number','例：60'));
const catField=textNode('label',undefined,'er-field');
catField.appendChild(textNode('span','教科'));
const catSelect=document.createElement('select');catSelect.id='er-cat';
selectOptions(catSelect,SUBJECTS.map(c=>[c,labels[c]||c]));
catField.appendChild(catSelect);
fields.insertBefore(catField,fields.children[2]);
const notesLabel=textNode('label',undefined,'er-field er-wide');notesLabel.appendChild(textNode('span','講評・失点傾向（任意）'));
const notes=document.createElement('textarea');notes.id='er-notes';notes.rows=3;notes.placeholder='例：計算ミスが多い。証明は理由が抜ける。';notesLabel.appendChild(notes);fields.appendChild(notesLabel);
const action=document.createElement('div');action.className='actions';
const entry=textNode('button','📈 考査結果の記録・分析','secondary');entry.onclick=open;
action.appendChild(entry);const plan=document.querySelector('#home .study-panel');
if(plan)plan.after(action);else document.querySelector('#home .hero').after(action);
el('er-back').onclick=()=>show('home');
el('er-new').onclick=showNew;
el('er-export').onclick=exportResults;
el('er-save').onclick=saveRecord;
el('er-cancel').onclick=()=>{showingForm=false;editingId=null;draw()};
el('er-add-unit').onclick=()=>{formUnits.push({unit:'',grade:'',cause:'',memo:''});drawUnits()};
el('er-import').onchange=importResults;
el('er-cat').onchange=()=>drawUnitOptions();
const style=document.createElement('style');
style.textContent='.er-card{background:white;padding:15px;margin:12px 0;border-radius:15px;line-height:1.6}.er-card-head{display:flex;gap:8px;justify-content:space-between;align-items:center}.er-tag{font-size:11px;color:#555;border:1px solid #ddd;border-radius:99px;padding:2px 8px;white-space:nowrap}.er-muted{font-size:12px;color:#666;margin:7px 0}.er-note{font-size:13px;white-space:pre-wrap;overflow-wrap:anywhere}.er-result-row{display:flex;justify-content:space-between;gap:8px;font-size:13px;margin:8px 0}.er-bar-wrap{margin:8px 0}.er-bar-label{font-size:12px}.er-track{height:10px;background:#e9e9e9;border-radius:99px;overflow:hidden}.er-fill{height:100%;background:#303030}.er-average{background:#a8acb2}.er-tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}.er-unit-tag{background:#f1f3f5;border-radius:7px;padding:5px 7px;font-size:11px}.er-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.er-field{font-size:12px;font-weight:600;display:flex;flex-direction:column;gap:4px}.er-field input,.er-field select,.er-field textarea,.er-unit-row input,.er-unit-row select{min-width:0;width:100%;font:inherit;border:1px solid #ccc;border-radius:9px;padding:10px;background:white}.er-wide{grid-column:1/-1}.er-subhead{font-weight:700;margin:18px 0 4px}.er-unit-row{display:grid;grid-template-columns:2fr 1fr 1fr 2fr auto;gap:6px;align-items:center;padding:9px 0;border-bottom:1px solid #eee}.er-check{display:flex;align-items:flex-start;gap:9px;font-size:13px;padding:13px 0}.er-check input{width:20px;height:20px;flex-shrink:0}@media(max-width:650px){.er-fields{grid-template-columns:1fr 1fr}.er-unit-row{grid-template-columns:1fr 1fr}.er-unit-row input:first-child,.er-unit-row input:nth-of-type(2){grid-column:1/-1}}';
document.head.appendChild(style);
const oldReport=buildReport;
buildReport=function(){return oldReport()+'\n\n'+reportText()};
window.TakumiExamRecords={open,refresh,records,validate,reportText};
draw();
})();