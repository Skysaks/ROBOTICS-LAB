/* ───────── nav, lesson, quiz, compare ───────── */
function go(id){const e=document.getElementById(id);if(!e)return;e.scrollIntoView({behavior:'smooth',block:'start'});try{history.replaceState(null,'','#'+id)}catch(_){}}
function initPages(thumbs){
 $$('[data-go]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();go(a.dataset.go)}));
 const ids=['boards','workbench','lesson','quiz','compare','logbook'];
 const spy=()=>{const y=scrollY+innerHeight*.4;let c=ids[0];ids.forEach(i=>{if(document.getElementById(i).getBoundingClientRect().top+scrollY<=y)c=i});$$('#nav nav a').forEach(a=>a.classList.toggle('on',a.dataset.go===c));$('#nav').classList.toggle('solid',scrollY>innerHeight-60)};
 addEventListener('scroll',spy,{passive:true});spy();
 const lofi=()=>{const on=SND.toggleLofi();$('#lofi').classList.toggle('playing',on);$('#bLofi').classList.toggle('on',on);toast(on?'Lofi on — a generated loop, no samples.':'Lofi off.')};
 $('#lofi').onclick=lofi;$('#bLofi').onclick=lofi;
 /* lesson */
 const lc=$('#lcards');LESSONS.forEach((l,i)=>{lc.append(h('div',{class:'lc'},h('span',{class:'mono'},'0'+(i+1)),h('h3',{},l[0]),h('p',{html:l[1]})));
  if(i===2){const sv=h('div',{html:'<svg viewBox="0 0 400 90" preserveAspectRatio="none"><path id="pw" fill="none" stroke="#b8402c" stroke-width="2.5"/></svg>'}),bulb=h('div',{class:'bulb'}),out=h('code',{}),inp=h('input',{type:'range',min:0,max:255,value:127});
   const up=()=>{const v=+inp.value,d=v/255;let p='M0 '+(d>0?70:70);for(let k=0;k<8;k++){const x=k*50;p+=' L'+x+' 70 L'+x+' '+(d>0?20:70)+' L'+(x+50*d)+' '+(d>0?20:70)+' L'+(x+50*d)+' 70'}p+=' L400 70';$('#pw',sv).setAttribute('d',p);bulb.style.opacity=.12+d*.88;bulb.style.boxShadow='0 0 '+(d*60)+'px '+(d*14)+'px rgba(255,80,40,'+(d*.7)+')';out.textContent='analogWrite(9, '+v+');  // '+Math.round(d*100)+' % on';};inp.oninput=up;
   lc.append(h('div',{class:'lc pwm'},h('div',{},h('span',{class:'mono'},'Try it · PWM'),h('h3',{},'Drag to change the duty cycle'),inp,h('p',{style:'margin-top:8px'},out)),sv,bulb));up()}});
 /* quiz */
 let qi=0,score=0;const qb=$('#qbox');
 function quiz(){qb.innerHTML='';if(qi>=QUIZ.length){qb.append(h('span',{class:'mono'},'Result'),h('h3',{},score+' of '+QUIZ.length+' correct'),h('p',{class:'why'},score===QUIZ.length?'Flawless. Go and wire the robot mission.':score>=6?'Solid. Reread the lesson cards for the ones you missed, then try again.':'Worth another pass through the lesson — then come back.'),h('button',{class:'pill dark',onclick:()=>{qi=0;score=0;quiz()}},'Try again'));return}
  const q=QUIZ[qi];let done=false;qb.append(h('span',{class:'mono'},'Question '+(qi+1)+' of '+QUIZ.length+' · score '+score),h('h3',{html:q[0]}));
  q[1].forEach((o,j)=>{const b=h('button',{class:'opt',html:o,onclick:()=>{if(done)return;done=true;const ok=j===q[2];if(ok)score++;SND.fx(ok?'ok':'bad');b.classList.add(ok?'ok':'no');$$('.opt',qb)[q[2]].classList.add('ok');qb.append(h('p',{class:'why'},(ok?'Correct. ':'Not quite. ')+q[3]),h('button',{class:'pill dark',onclick:()=>{qi++;quiz()}},qi===QUIZ.length-1?'See result':'Next question'))}});qb.append(b)})}
 quiz();
 /* logbook */
 LOG.render=()=>{const a=LOG.all(),L=$('#lgList');L.innerHTML='';$('#lgSum').textContent=a.length?a.length+' build'+(a.length>1?'s':'')+' logged':'Nothing logged yet';if(!a.length)L.append(h('div',{class:'lc lg'},h('span',{class:'mono'},'Empty'),h('h3',{},'Your first entry is one Run away'),h('p',{},'Wire a mission on the workbench and press Run, or finish an assembly kit. The parts you used will be listed here.')));
  a.forEach(e=>L.append(h('div',{class:'lc lg'},h('span',{class:'mono'},e.kind+(e.n>1?' · '+e.n+' times':'')),h('h3',{},e.title),h('small',{},new Date(e.t).toLocaleString()+(e.note?' · '+e.note:'')),h('ul',{},e.lines.map(l=>h('li',{},l))))))};LOG.render();
 $('#lgCopy').onclick=()=>LOG.all().length?copyText(LOG.text(),'Logbook copied.'):toast('The logbook is empty.');
 $('#lgClear').onclick=e=>{const t=e.currentTarget;if(t.dataset.sure){delete t.dataset.sure;t.textContent='Clear logbook';STORE.set('log',[]);LOG.render()}else{t.dataset.sure=1;t.textContent='Really clear everything?';setTimeout(()=>{delete t.dataset.sure;t.textContent='Clear logbook'},4000)}};
 /* compare */
 const tb=$('#ctb'),F=[['All boards',()=>true],['Has Wi-Fi',b=>/Wi-Fi/.test(b.spec[7])],['5 V logic',b=>b.volt===5],['3.3 V logic',b=>b.volt<5],['Fits a breadboard',b=>b.down||b.id==='pico'],['Runs Linux',b=>b.id==='pi4'],['Under $10',b=>/\$(3|4|6)/.test(b.spec[8])]];
 BOARDS.forEach((b,i)=>tb.append(h('tr',{onclick:()=>{GAL.setBoard(i);go('boards')}},h('td',{class:'n'},h('img',{src:thumbs[b.id],alt:''}),b.name),...b.spec.map(s=>h('td',{},s)))));
 const ch=$('#chips');F.forEach((f,k)=>ch.append(h('button',{class:'pill'+(k?'':' on'),onclick:e=>{$$('.pill',ch).forEach(x=>x.classList.remove('on'));e.currentTarget.classList.add('on');$$('tr',tb).forEach((r,i)=>r.classList.toggle('dim',!f[1](BOARDS[i])))}},f[0])));
}

