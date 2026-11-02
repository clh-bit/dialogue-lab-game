"use strict";
(() => {
 const EXTRA_KEY='story-lab-four-scenarios-v1';
 scenes.push({title:'朋友洩露秘密',file:'friend-secret',intro:'你以為是朋友之間的私事，卻發現其他同學也知道了。你可以表達受傷，並說出自己的界線。',labels:['A｜公開指責','B｜忍住不說','C｜私下設立界線'],words:['你怎可以把我的秘密告訴所有人！','先不說出來，把難過留在心裡。','你把我的秘密告訴別人，我感到不被尊重。請不要再分享我的私事。'],feedback:[['信任被打破，感到生氣或受傷是可以理解的。','你有權要求對方停止轉述，不需要先隱藏自己的感受。','如果情況容許，可以找較安靜的地方說清楚界線，避免在公開爭吵中讓更多人知道私事。'],['一時說不出口，不代表你接受了這件事，也不是你的錯。','你可以先整理心情，等準備好再談，或請信任的人陪你表達。','可以說：我現在還很難過，想先靜一靜。請不要再分享我的私事。'],['你說出了事情帶來的影響，也清楚要求停止分享。','對方道歉後，你仍然可以需要時間，不必立即原諒或恢復原來的信任。','若私事繼續被轉述，可以找信任的老師、家人或支援者協助。']],parts:[['當你把我的私事告訴別人時','你從來都不值得信任'],['我感到受傷和失望','你就是一個壞朋友'],['請不要再分享我的私事。','我想先靜一靜，等準備好再談。']]});
 function normalize(){for(const k of ['feelings','answers','builds']){if(!Array.isArray(state[k]))state[k]=[];while(state[k].length<scenes.length)state[k].push(null);state[k]=state[k].slice(0,scenes.length);}}
 try{const old=JSON.parse(localStorage.getItem(EXTRA_KEY));if(old&&Number.isInteger(old.i)&&old.i>=0&&old.i<scenes.length&&Number.isInteger(old.step)&&old.step>=0&&old.step<6&&['feelings','answers','builds'].every(k=>Array.isArray(old[k])&&old[k].length===scenes.length)&&old.answers.every(n=>n===null||(Number.isInteger(n)&&n>=0&&n<3))){state=old;if(state.step===4&&state.answers[state.i]===null)state.step=3;}}catch(e){}
 normalize();
 const originalSave=save;
 save=function(){normalize();originalSave();try{localStorage.setItem(EXTRA_KEY,JSON.stringify(state));}catch(e){}};
 const originalRender=render;
 render=async function(){normalize();const expected=version+1;await originalRender();if(version!==expected)return;const marker=screen.querySelector('small');if(marker)marker.textContent=`情境 ${state.i+1} / ${scenes.length} · 階段 ${state.step+1} / 6`;$('progress').max=scenes.length*6;if(state.step===5)$('next').textContent=state.i===scenes.length-1?'完成練習':'下一個情境';};
 function menu(){version++;pending=null;document.getElementById('gameArea').hidden=true;document.getElementById('scenarioMenu').hidden=false;document.getElementById('scenarioMenu').querySelector('button').focus();}
 $('next').addEventListener('click',event=>{if(state.step!==5)return;event.preventDefault();event.stopImmediatePropagation();if(state.i<scenes.length-1){state.i++;state.step=0;render();}else{save();version++;pending=null;screen.replaceChildren(el('h2','練習完成！'),el('p','你已探索四個情境。你的感受和界線值得被聽見，也不需要一次說得完美。'),btn('返回情境選單',menu));$('next').hidden=true;$('back').disabled=true;$('progress').max=scenes.length*6;$('progress').value=scenes.length*6;$('status').textContent='四個情境練習完成。';screen.focus({preventScroll:true});}},true);
 document.addEventListener('DOMContentLoaded',()=>{
 const card=el('article',null,'menu-card');card.append(el('h3','朋友洩露秘密'),el('p','表達受傷，保護私事，並說出界線。'),btn('開始：朋友洩露秘密',()=>{version++;pending=null;state.i=scenes.length-1;state.step=0;normalize();save();document.getElementById('scenarioMenu').hidden=true;document.getElementById('gameArea').hidden=false;$('back').hidden=false;render();}));document.querySelector('.menu-grid').append(card);$('progress').max=scenes.length*6;save();
 });
})();
