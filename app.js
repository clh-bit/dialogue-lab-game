"use strict";
const PANELS=[[0,0,.5,.5],[.5,0,1,.5],[0,.5,.5,1],[.5,.5,1,1]],CARDS=[[0,0,1/3,1],[1/3,0,2/3,1],[2/3,0,1,1]];
const scenes=[
{title:"朋友沒有等我",file:"friend-conflict",intro:"朋友沒有等你就離開了。你很生氣，也很重視這段友誼。",labels:["A｜指責","B｜冷處理","C｜表達感受"],words:["你根本不當我是朋友！","算了，我不想說了。","你沒有等我時，我覺得被忽略。下次可以先告訴我嗎？"],feedback:[
["被朋友留下可能真的會讓你受傷。這份心情值得被聽見。","把『你根本……』換成具體發生的事，再說感受。","可以試說：你沒有等我時，我有點失望。下次可以先告訴我嗎？"],
["你可能需要時間整理心情，現在不想說也可以。","可以告訴對方需要暫停，不必讓對方猜測。","可以試說：我現在有點生氣，想先冷靜一下。等準備好再談。"],
["你把感受和希望說清楚了，值得肯定。","也可以聽聽對方的解釋。沒有立即被理解，不代表你表達得不好。","可以問：當時發生了甚麼事？我也想聽你的想法。"]],parts:[["你沒有等我就離開時","你總是這樣"],["我覺得失望","你很討厭"],["下次可以先告訴我嗎？","你永遠不要找我！"]]},
{title:"我的界線，我來說",file:"relationship-boundaries",intro:"對方的接觸讓你不舒服。你可以決定自己的界線。",labels:["A｜直接拒絕","B｜默默忍耐","C｜說明界線"],words:["不要靠近我，請停下！","沒關係……（其實不舒服）","我不想這樣接觸，請保持距離。"],feedback:[
["你清楚說出了停止，界線值得尊重。","不需要為了有禮貌而接受不舒服的接觸。","若對方沒有停止，可以離開並向可信任的老師、家人或支援者求助。"],
["一時不知道怎樣拒絕，不代表你做錯了。","仍可以之後說出界線，也可以請人陪你表達。","可以說：剛才沒有說清楚，但其實我不舒服。我不想再有這樣的接觸。"],
["你把需要說清楚了，值得肯定。","留意對方是否停止。若繼續施壓，不是你需要說得更好，而是可以尋求支援。","重視關係，不代表放下界線。"]],parts:[["當你繼續靠近時","你每次都這樣"],["我感到不舒服","你一定是故意的"],["請停止並保持距離。","請先問我是否願意。"]]},
{title:"功課卡關了",file:"homework",intro:"功課做不出來，家人又在催促。你希望得到幫助。",labels:["A｜發脾氣","B｜逃避","C｜尋求協助"],words:["我不會！你自己做好了！","（推開書本，不回應）","這題我卡住了，可以一起拆成小步驟嗎？"],feedback:[
["卡住又被催促可能讓你挫折。一次發脾氣不代表不努力或沒有能力。","先停一停，再指出需要幫忙的地方。","可以說：不知道第一步怎樣做。可以讓我停一下，再陪我看第一步嗎？"],
["你可能很累。需要休息不等於放棄。","可以說明休息多久，以及之後願意試的小步驟。","可以說：先休息五分鐘，之後做第一小題。卡住時可以問你嗎？"],
["你說出了困難並尋求協助，這是尋找下一步。","再指出做到哪裡，以及哪裡開始不明白。","可以說：我看得懂題目，但不知道用哪個方法，可以一起看嗎？"]],parts:[["做到這一題時","你一直在煩我"],["我覺得很挫折","你根本不懂"],["可以一起看第一步嗎？","可以讓我休息五分鐘再繼續嗎？"]]}
];
const $=id=>document.getElementById(id),screen=$('screen'),cache=new Map(),KEY='story-lab-v4-auto-feedback';
const fresh=()=>({i:0,step:0,feelings:[null,null,null],answers:[null,null,null],builds:[null,null,null]});
let state=fresh(),pending=null,version=0;
try{const x=JSON.parse(localStorage.getItem(KEY));if(x&&Number.isInteger(x.i)&&x.i>=0&&x.i<3&&Number.isInteger(x.step)&&x.step>=0&&x.step<6&&['feelings','answers','builds'].every(k=>Array.isArray(x[k])&&x[k].length===3)&&x.answers.every(n=>n===null||(Number.isInteger(n)&&n>=0&&n<3))){state=x;if(x.step===4&&x.answers[x.i]===null)state.step=3;}}catch(_){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){}}
function el(tag,text,cls){const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;}
function btn(text,fn){const b=el('button',text);b.type='button';b.addEventListener('click',fn);return b;}
function load(file){if(cache.has(file))return cache.get(file);const p=new Promise((ok,no)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=()=>{cache.delete(file);no(Error(`找不到 assets/${file}.jpg\n請檢查檔案和大小寫。`));};im.src=`./assets/${file}.jpg`;});cache.set(file,p);return p;}
function crop(im,r){const [l,t,right,b]=r,x=Math.round(l*im.width),y=Math.round(t*im.height),w=Math.round(right*im.width)-x,h=Math.round(b*im.height)-y,c=el('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,x,y,w,h,0,0,w,h);return c.toDataURL('image/png');}
function pic(src,alt){const im=el('img');im.src=src;im.alt=alt;return im;}
async function panel(s,n,v){const im=await load(s.file);if(v!==version)return;const src=crop(im,PANELS[n]),box=el('div',null,'panel');box.append(pic(src,`${s.title}：第 ${n+1} 格`),btn('放大漫畫',()=>{$('zoom').querySelector('img').src=src;$('zoom').showModal();}));screen.append(box);}
function builder(s){
 const box=el('div',null,'box');box.append(el('h3','組合你的回應'),el('p','不用一次說得完美。選好三個部分後，下面會自動出現鼓勵和調整建議。'));
 const selects=[],preview=el('p'),feedback=el('div',null,'box');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');feedback.setAttribute('aria-atomic','true');
 const old=Array.isArray(state.builds[state.i])?state.builds[state.i]:[];let previous=null;
 ['發生的事','我的感受','我的希望／界線'].forEach((name,n)=>{const label=el('label',name),select=el('select');select.id=`part-${n}`;label.htmlFor=select.id;select.append(new Option('請選擇……',''));s.parts[n].forEach(t=>select.append(new Option(t,t)));select.value=s.parts[n].includes(old[n])?old[n]:'';selects.push(select);box.append(label,select);});
 function review(manual=false){
  const values=selects.map(x=>x.value);state.builds[state.i]=values;save();preview.textContent=values.filter(Boolean).join('，')||'你的句子會顯示在這裡。';feedback.replaceChildren();
  if(values.some(x=>!x)){feedback.append(el('p','不用急，先選好三個部分。完成後，我們再一起看看。'));if(manual)selects.find(x=>!x.value).focus();return;}
  const indices=values.map((x,n)=>s.parts[n].indexOf(x)),bad=indices.map((x,n)=>x===1&&(n<2||state.i===0)),first=bad.indexOf(true);
  if(previous&&previous.some((x,n)=>x!==values[n])){const improved=bad.findIndex((b,n)=>!b&&previous[n]!==values[n]);const messages=['你改用具體發生的事，讓對方更容易知道你想談甚麼。','你改用自己的感受，更清楚表達了心情。','你提出更具體的希望，讓對方知道可以怎樣回應。'];feedback.append(el('p',improved>=0?messages[improved]:'你願意回頭想一想並調整說法，這就是練習的一部分。'));}
  if(first<0){feedback.append(el('h4',state.i===1?'你的界線值得尊重':'你已經把需要說清楚了'),el('p',state.i===1?'你說出了不舒服，也提出界線。這句話已經可以使用，不一定需要更溫柔。若對方不停止，先離開並尋求支援。':'你描述了發生的事、自己的感受和一個具體希望。這些部分可以保留，再想想字眼是否像你平常會說的話。'),el('p','對方未必立即理解，但你的感受仍值得被聽見。'));}
  else{const tips=[`「${values[0]}」比較像概括的責備。可以改成具體發生的事，例如「${s.parts[0][0]}」。`,`「${values[1]}」是在評論或猜測對方，還沒有說出你的心情。可以試試「${s.parts[1][0]}」。`,`「${values[2]}」未說出你希望對方怎樣做。可以提出具體請求，例如「${s.parts[2][0]}」。`];feedback.append(el('h4','先保留你的心情，再調整一小部分'),el('p','你願意說出心裡的話，這值得肯定。不用整句重來，先改一部分就可以。'),el('p',tips[first]));if(!bad[0])feedback.append(el('p','你已指出發生的事，這部分可以保留。'));if(!bad[1])feedback.append(el('p','你已說出自己的感受，這部分可以保留。'));if(state.i===1)feedback.append(el('p','這不是要求你討好對方。你仍有權直接拒絕接觸，不需要先說得完美才可以求助。'));}
  const actions=el('div',null,'chips'),sample=el('div',null,'box');sample.hidden=true;sample.append(el('h4','一個可以參考的說法'),el('p',s.parts.map(a=>a[0]).join('，')),el('small','這只是示範，不會取代你選好的句子。'));
  const example=btn('看看一個示範',()=>{sample.hidden=!sample.hidden;example.textContent=sample.hidden?'看看一個示範':'收起示範';});
  actions.append(btn('修改我的說法',()=>selects[first<0?0:first].focus()),example,btn('我準備好繼續了',()=>$('next').click()));feedback.append(actions,sample);previous=[...values];
 }
 selects.forEach(select=>select.addEventListener('change',()=>review(false)));
 box.append(el('h4','你的句子'),preview,btn('看看我的說法',()=>review(true)),feedback);screen.append(box);review(false);
}
async function render(){const v=++version;pending=null;save();const s=scenes[state.i];screen.replaceChildren(el('small',`情境 ${state.i+1} / 3 · 階段 ${state.step+1} / 6`),el('h2',s.title));$('status').textContent='';$('progress').value=state.i*6+state.step+1;$('next').hidden=false;$('next').disabled=true;$('next').textContent='繼續';$('back').disabled=state.i===0&&state.step===0;
try{
 if(state.step===0){screen.append(el('p',s.intro));await panel(s,0,v);}
 if(state.step===1){screen.append(el('p','繼續閱讀，留意角色遇到的困難。'));await panel(s,1,v);}
 if(state.step===2){screen.append(el('p','角色可能有甚麼感受？不是對錯題，選一個最貼近的就可以。'));const chips=el('div',null,'chips');for(const f of ['被忽略','生氣','失望','不安','挫折','不確定']){const b=btn(f,()=>{state.feelings[state.i]=f;save();for(const x of chips.children){x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b));}$('next').disabled=false;});b.classList.toggle('selected',state.feelings[state.i]===f);b.setAttribute('aria-pressed',String(state.feelings[state.i]===f));chips.append(b);}screen.append(chips);}
 if(state.step===3){screen.append(el('p','選一個想嘗試的回應，再確認。沒有扣分，也可以回來試另一種說法。'));const im=await load(s.file+'-choices');if(v!==version)return;const grid=el('div',null,'grid');CARDS.forEach((r,n)=>{const card=el('article',null,'card'),b=btn(s.labels[n],()=>{pending=n;for(const x of grid.children)x.classList.toggle('selected',x===card);for(const x of grid.querySelectorAll('button'))x.setAttribute('aria-pressed',String(x===b));$('next').disabled=false;});b.setAttribute('aria-pressed','false');card.append(pic(crop(im,r),s.labels[n]),el('p',s.words[n]),b);grid.append(card);});screen.append(grid);$('next').textContent='看看回應與提示';}
 if(state.step===4){const n=state.answers[state.i],box=el('div',null,'box');box.append(el('h3',`你選了 ${s.labels[n]}`));s.feedback[n].forEach(t=>box.append(el('p',t)));box.append(btn('試另一個回應',()=>{state.step=3;render();}),btn('練習修改自己的說法',()=>{state.step=5;render();}));screen.append(box,el('small','下面是原作示範發展，不代表每個選項都會得到相同結果。'));await panel(s,2,v);}
 if(state.step===5){await panel(s,3,v);if(v!==version)return;builder(s);$('next').textContent=state.i===2?'完成練習':'下一個情境';}
 if(v!==version)return;$('next').disabled=state.step===3?pending===null:state.step===2?!state.feelings[state.i]:false;
}catch(e){if(v!==version)return;screen.append(el('div',e.message,'error'),btn('重新載入',render));$('status').textContent='請確認圖片檔案後重試。';$('next').disabled=true;}if(v===version)screen.focus({preventScroll:true});}
function reset(){state=fresh();render();}
$('next').addEventListener('click',()=>{if(state.step===3){if(pending===null)return;state.answers[state.i]=pending;}if(state.step===5){if(state.i===2){screen.replaceChildren(el('h2','練習完成！'),el('p','你願意停下來想一想並嘗試表達需要，這就是重要的一步。不必一次說得完美。'),btn('再練一次',reset));$('next').hidden=true;$('back').disabled=true;return;}state.i++;state.step=0;}else state.step++;render();});
$('back').addEventListener('click',()=>{if(state.step>0)state.step--;else if(state.i>0){state.i--;state.step=5;}render();});$('reset').addEventListener('click',()=>{if(confirm('清除進度並重新開始？'))reset();});$('close').addEventListener('click',()=>$('zoom').close());$('motion').addEventListener('change',e=>document.documentElement.classList.toggle('reduce',e.target.checked));render();
