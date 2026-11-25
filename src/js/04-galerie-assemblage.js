/* ───────── Boards gallery + assembly mode ───────── */
function gridTex(bg,line,cell=256,lw=2){const t=ctex(cell,cell,c=>{c.fillStyle=bg;c.fillRect(0,0,cell,cell);c.fillStyle=line;c.fillRect(0,0,cell,lw);c.fillRect(0,0,lw,cell)});t.wrapS=t.wrapT=T.RepeatWrapping;return t}
function initGallery(thumbs){
 const cv=$('#gl'),sec=$('#boards'),ren=mkRenderer(cv),scene=new T.Scene(),cam=new T.PerspectiveCamera(30,1,2,5000);
 scene.background=new T.Color('#cbc7bf');scene.fog=new T.Fog('#cbc7bf',800,2300);scene.environment=mkEnv(ren);lights(scene,330);
 const A={on:false,i:0,phase:'',hand:null,ch:false,miss:0,t:0,run:false,busy:false,sol:0,hold:false,sz:0};
 let expl=false,pinsOn=false;let cur=0,B=null,U=null,sel=-1,rot=true,labs=false,find=null,flipped=false,ptr={x:0,y:0};const cache={};
 /* pointerdown registered before the orbit so it can claim the gesture */
 cv.addEventListener('pointerdown',e=>{orb.block=false;if(A.on&&A.phase==='solder'&&!A.busy){const p=A.parts[A.i],g=onPlane(e,cam,cv,B.position.y+p.box.max.y);if(g&&Math.hypot(g.x-B.position.x-p.center.x,g.z-B.position.z-p.center.z)<Math.max(11,Math.max(p.size.x,p.size.z)/2+5)){A.hold=true;orb.block=true;SND.ac()}}});
 const orb=new Orbit(cam,cv,{wheel:false,minR:28,maxR:900,maxPh:1.5});

 /* scenery */
 const wood=new T.Mesh(new T.PlaneGeometry(6000,6000),mt('#c9a472',.8));wood.rotation.x=-PI/2;wood.position.y=-4;wood.receiveShadow=true;scene.add(wood);
 const mtx=gridTex('#737c7f','#a9b0b2',256,2);mtx.repeat.set(26,20);const mat=new T.Mesh(new T.BoxGeometry(1300,4,1000),[mt('#7d8587',.9),mt('#7d8587',.9),new T.MeshStandardMaterial({map:mtx,roughness:.92}),mt('#7d8587'),mt('#7d8587'),mt('#7d8587')]);mat.position.set(170,-2,120);mat.receiveShadow=true;scene.add(mat);
 const props=new T.Group();scene.add(props);
 (()=>{const w=WHT(),lay=(o,x,z,ry)=>{o.position.set(x,0,z);o.rotation.y=ry||0;props.add(o);return o};
  lay(G(cy(34,5,w,0,0,0,40),cy(17,42,w,0,5,0,32),cy(34,5,w,0,47,0,40),tube([[30,3,10],[80,1,60],[150,1,40],[200,1,-30]],.9,w,40)),-20,-185);
  const probe=c=>G(cyX(6,150,mt(c,.5),0,7,0,20,5),cyX(7.5,14,mt(c,.5),-60,7.5,0,20),cyX(1.6,34,SIL(),-92,5,0,10,.3),tube([[75,7,0],[150,5,-30],[330,5,-10]],2.6,mt(c,.6),20));
  lay(probe('#c2322c'),215,-150,.42);lay(probe('#1c1c1e'),250,-185,.36);
  lay(G(rr(210,300,22,34,mt('#e3b53c',.6))),520,-330,-.3);
  lay(G(rr(34,14,5,8,w,0,0,0),bx(9,3.4,8.6,SIL(),-21,2.3,0),bx(.5,1.8,7,DRK(),-25.4,3.1,0),cyX(4,16,w,24,4,0,16,3),tube([[32,4,0],[90,3,24],[190,3,130],[330,3,330]],3,w,40)),-150,96,-.45);
  const led=G(cy(5,7,mt('#e2281f',.25,0,{transparent:true,opacity:.92}),0,0,0,20),sp(5,mt('#e2281f',.25,0,{transparent:true,opacity:.92}),0,7,0),cy(5.8,1.2,mt('#c5241c',.3),0,-.6,0,20),cy(.45,44,SIL(),-1.3,-45,0,6),cy(.45,50,SIL(),1.3,-51,0,6));led.rotation.z=PI/2-.02;led.rotation.y=-.5;led.position.set(-128,5.6,22);props.add(led);
  const res=(x,z,ry,b)=>{const g=G(cyX(.45,86,SIL(),0,2.4,0,6),cyX(2.4,9.5,mt('#d8c08f',.6),0,2.4,0,14));b.forEach((c,i)=>g.add(cyX(2.48,1,mt(c,.6),-3+i*2,2.4,0,14)));lay(g,x,z,ry)};
  res(-205,78,.05,['#3a56c8','#7a3fb0','#1c1c1c','#c9a13c']);res(-128,84,.75,['#7a4a1e','#1c1c1c','#d0342a','#c9a13c']);
  lay(G(bx(15,2.8,2.8,BLK(),0,0,0),cyX(.4,7,SIL(),-10,1.4,0,6),tube([[7,1.4,0],[40,1.4,-6],[90,1.4,-30],[160,1.4,-34]],1,w,24)),190,92,.1);
  const bb=G(bx(84,9.5,56,mt('#ebe7df',.7)));const t=new T.Mesh(new T.PlaneGeometry(80,52),new T.MeshStandardMaterial({map:holeTex(30,18,1),roughness:.7}));t.rotation.x=-PI/2;t.position.y=9.55;bb.add(t);lay(bb,292,70,-.5);
  lay(G(bx(110,1.2,5,SIL(),0,0,0),bx(110,1.2,5,SIL(),0,3,0)),170,170,1.25);
  lay(G(cy(5,7,mt('#e8a821',.3,0,{transparent:true,opacity:.9}),0,0,0,16),sp(5,mt('#e8a821',.3,0,{transparent:true,opacity:.9}),0,7,0),cy(.45,30,SIL(),-1.3,-30,0,6),cy(.45,30,SIL(),1.3,-30,0,6)),-235,150).rotation.x=PI/2-.1})();
 /* assembly furniture */
 const tray=new T.Group(),pad=new T.Group(),iron=new T.Group(),ghost=new T.Mesh(new T.BoxGeometry(1,1,1),new T.MeshBasicMaterial({color:'#e2452c',transparent:true,opacity:.5,depthWrite:false}));tray.visible=pad.visible=iron.visible=ghost.visible=false;scene.add(tray,pad,iron,ghost);
 (()=>{const ir=G(cy(.25,11,mt('#b8b0a0',.3,.9),0,0,0,12,1.5),cy(1.6,22,mt('#c9ccce',.3,.9),0,11,0,14),cy(5.6,5,mt('#17181b',.5),0,33,0,20),cy(6.2,34,mt('#c9a46f',.85),0,38,0,22,7.6),cy(7.8,56,mt('#2a55c8',.4),0,72,0,22,7),cy(4.2,10,mt('#17181b',.6),0,128,0,14,2.5),tube([[0,137,0],[4,160,2],[30,190,6],[80,200,10]],2.2,mt('#17181b',.7),20));ir.rotation.z=-.95;ir.rotation.y=.35;iron.add(ir);
  const tg=glow('#ff9a3c');tg.scale.setScalar(16);tg.position.y=1;iron.add(tg);iron.userData.glow=tg})();
 const smoke=[];function puff(p){const s=glow('#eeeeee');s.material.blending=T.NormalBlending;s.material.opacity=.35;s.scale.setScalar(6);s.position.copy(p);s.userData.v=new V3((Math.random()-.5)*6,26+Math.random()*14,(Math.random()-.5)*6);scene.add(s);smoke.push(s)}

 /* carousel + card */
 const car=$('#carousel');BOARDS.forEach((b,i)=>car.append(h('button',{onclick:()=>setBoard(i)},h('img',{src:thumbs[b.id],alt:''}),b.name)));
 function world(p){return p.center.clone().add(B.position).add(p.group.position)}
 function setBoard(i,quiet){if(A.on)return;cur=i;const def=BOARDS[i];if(B)scene.remove(B);B=cache[def.id]||(cache[def.id]=buildBoard(def));U=B.userData;B.position.set(0,0,0);B.rotation.set(0,0,0);flipped=false;expl=false;$('#bExp').classList.remove('on');U.parts.forEach(p=>p.group.position.set(0,0,0));scene.add(B);
  $('#cMaker').textContent=def.maker+' · '+def.year;$('#cIdx').textContent=String(i+1).padStart(2,'0')+' / '+String(BOARDS.length).padStart(2,'0');$('#cName').textContent=def.name;$('#cTag').textContent=def.tag;
  $('#cLevel').innerHTML='<span class="bars"><i></i><i></i><i></i></span>'+def.level;sec.style.setProperty('--acc',def.accent);
  $$('button',car).forEach((b,j)=>b.classList.toggle('on',j===i));const on=$('button.on',car);if(on&&!quiet&&on.scrollIntoView)try{car.scrollTo({left:on.offsetLeft-car.clientWidth/2+49,behavior:'smooth'})}catch(e){}
  sel=-1;find=null;$('#bFind').classList.remove('on');showPart();mkLabels();home(true);B.position.y=26;B.scale.setScalar(.92);tween(.45,k=>{B.position.y=26*(1-k);B.scale.setScalar(.92+.08*k)});$$('#gbar [data-v]').forEach(b=>b.classList.toggle('on',b.dataset.v==='34'))}
 function home(snapR){const d=BOARDS[cur],narrow=sec.clientWidth<700;orb.set({t:new V3(0,U.lift+4,0),r:(Math.max(d.w,d.d*1.35)*2.3+90)*(narrow?1.5:1),ph:.98});if(snapR)orb.set({th:orb.gth},false);auto()}
 function auto(){orb.auto=(rot&&sel<0&&!A.on&&!find)?.11:0}
 function showPart(){const pc=$('#pcard'),card=$('#card');U.parts.forEach((p,j)=>tint(p.group,j===sel));if(sel<0&&!find){pc.hidden=true;card.classList.remove('mini');return}
  pc.hidden=false;card.classList.add('mini');pc.style.top=(card.offsetTop+card.offsetHeight+10)+'px';
  if(find){$('#pKind').textContent='Find the part';$('#pIdx').textContent=Math.min(find.i+1,find.order.length)+' / '+find.order.length;$('#pPrev').hidden=$('#pNext').hidden=true;return}
  const p=U.parts[sel];$('#pKind').textContent='Part';$('#pIdx').textContent=String(sel+1).padStart(2,'0')+' / '+U.parts.length;$('#pName').textContent=p.name;$('#pDesc').textContent=p.desc;$('#pPrev').hidden=$('#pNext').hidden=false}
 function select(j){sel=j;showPart();auto();if(j<0){home();return}const p=U.parts[j];orb.set({t:world(p),r:clamp(Math.max(p.size.x,p.size.z)*3.4+60,85,260)});SND.fx('click')}
 function partAt(e){const hit=pick(e,cam,cv,U.parts.map(p=>p.group))[0];if(!hit)return-1;let o=hit.object;while(o&&!o.userData.part)o=o.parent;return o?U.parts.findIndex(p=>p.id===o.userData.part):-1}
 function mkLabels(){const L=$('#glabels');L.innerHTML='';U.parts.forEach(p=>p.lab=null);U.pins.forEach(p=>p.lab=null);if(A.on)return;if(labs)U.parts.forEach(p=>{p.lab=h('div',{class:'lab'},p.name);L.append(p.lab)});if(pinsOn)U.pins.forEach(p=>{p.lab=h('div',{class:'lab pin'},p.name);L.append(p.lab)})}
 function setExpl(on){expl=on;$('#bExp').classList.toggle('on',on);U.parts.forEach((p,j)=>{const y0=p.group.position.y,y1=on?9+p.size.y*.5+j*2.4:0;tween(.55,k=>{if(!A.on)p.group.position.y=lerp(y0,y1,k)})});if(on){if(sel>=0)select(-1);orb.set({r:orb.gr*1.25,ph:1.2})}else home()}
 /* find the part */
 function startFind(){if(find){find=null;$('#bFind').classList.remove('on');sel=-1;showPart();auto();return}sel=-1;const order=U.parts.map((_,j)=>j).sort(()=>Math.random()-.5);find={order,i:0,first:0,tries:0};$('#bFind').classList.add('on');home();askFind();showPart();auto()}
 function askFind(){const p=U.parts[find.order[find.i]];$('#pName').textContent='Where is the '+p.name+'?';$('#pDesc').textContent='Click it on the board. Drag to look around.';find.tries=0;showPart()}
 function answerFind(j){const pc=$('#pcard'),want=find.order[find.i];if(j===want){if(!find.tries)find.first++;SND.fx('ok');pc.classList.add('ok');tint(U.parts[j].group,true,'#3f9c5a');$('#pDesc').textContent=U.parts[j].desc;const f=find;setTimeout(()=>{pc.classList.remove('ok');if(find!==f)return;tint(U.parts[j].group,false);f.i++;if(f.i>=f.order.length){$('#pName').textContent='All found';$('#pDesc').textContent=f.first+' of '+f.order.length+' on the first try. Press "Find the part" to leave, or pick another board.';showPart()}else askFind()},1300)}
  else if(j>=0){find.tries++;SND.fx('bad');pc.classList.remove('no');void pc.offsetWidth;pc.classList.add('no');$('#pDesc').textContent='That is the '+U.parts[j].name+'. Try again.'}}

 /* ── assembly ── */
 const BP=new V3(56,0,6),TP=new V3(-66,0,0);
 const AT=()=>sec.clientWidth<700?new V3(0,0,10):new V3(36,0,-6);
 function asmUI(){const n=A.parts.length,done=A.parts.filter(p=>p.st==='done').length,p=A.parts[A.i];$('#aN').textContent=done;$('#aT').textContent=n;$('#aBar').style.width=(done/n*100)+'%';
  const nm=p?'<b>'+p.name+'</b>':'';$('#aStep').textContent=A.phase==='dis'?'Dismantling':A.phase==='end'?'Complete':'Step '+(A.i+1)+' of '+n;
  $('#aMsg').innerHTML=A.phase==='dis'?'Taking the board apart… every part goes to the tray.':A.phase==='pick'?(A.ch?'Find and pick the '+nm+' in the tray.':'Pick the '+nm+' from the tray.'):A.phase==='place'?'Place the '+nm+' on its pulsing footprint.':A.phase==='solder'?'Now hold the iron on the '+nm+' to solder it.':'Every joint is done. Power is on.';
  $('#aWhat').hidden=!p||A.phase==='dis';if(p){$('#aPn').textContent=p.name;$('#aPd').textContent=p.desc.split('. ')[0].replace(/\.?$/,'.')}
  const ul=$('#aList');ul.innerHTML='';A.parts.forEach((q,j)=>ul.append(h('li',{class:(j===A.i&&A.phase!=='dis'&&A.phase!=='end'?'cur ':'')+(q.st==='done'?'done':q.st==='tacked'?'tacked':'')},h('i'),q.name,h('span',{},q.st==='done'?'Soldered':q.st==='tacked'?'Tacked':q.st==='hand'?'In hand':'Tray'))));
  const c=$('li.cur',ul);if(c)c.scrollIntoView({block:'nearest'});$('#aAuto').disabled=$('#aHint').disabled=A.phase==='dis'||A.phase==='end'}
 function mark(){A.parts.forEach((p,j)=>tint(p.group,!A.ch&&j===A.i&&(A.phase==='pick'||A.phase==='place')))}
 async function startAsm(){if(A.busy)return;const def=BOARDS[cur];sel=-1;find=null;labs=false;pinsOn=false;expl=false;$('#bPin').classList.remove('on');$('#bExp').classList.remove('on');$('#bLab').classList.remove('on');$('#bFind').classList.remove('on');showPart();mkLabels();A.on=true;document.body.classList.add('asm');
  ['#card','#gbar','#carousel','#pcard'].forEach(s=>$(s).hidden=true);$('#asm').hidden=$('#asmExit').hidden=false;$('#asmDone').hidden=true;$('#aName').textContent=def.name;props.visible=false;
  B.rotation.set(0,0,0);B.scale.setScalar(1);B.position.set(BP.x,def.down?2.4-U.lift:2,BP.z);if(U.leds.PWR)U.leds.PWR.material.emissiveIntensity=0;
  A.parts=U.parts;/* shelf-pack the tray */let cx=-42,cz=0,row=0;const slots=[];A.parts.forEach(p=>{const w=p.size.x+6,d=p.size.z+6;if(cx+w>42&&cx>-42){cx=-42;cz+=row;row=0}slots.push([cx+w/2,cz+d/2]);cx+=w;row=Math.max(row,d)});const D=Math.max(130,cz+row+16);
  tray.clear();tray.add(rr(100,D,14,2.4,mt('#d8cfbc',.8)),rr(92,D-8,10,.9,mt('#ece5d6',.85),0,2.4,0));tray.position.copy(TP);tray.visible=true;
  pad.clear();pad.add(rr(def.w+26,def.d+26,7,2,mt('#18191b',.9)));pad.position.set(BP.x,0,BP.z);pad.visible=true;
  A.parts.forEach((p,j)=>{p.st='tray';p.tray=new V3(TP.x+slots[j][0]-BP.x-p.center.x,3.4-B.position.y-p.box.min.y,TP.z+slots[j][1]-(cz+row)/2-BP.z-p.center.z);p.group.position.set(0,0,0)});
  A.i=0;A.phase='dis';A.t=0;A.run=false;A.miss=0;A.busy=true;A.hand=null;asmUI();const nar=sec.clientWidth<700;orb.auto=0;orb.set({t:AT(),r:nar?780:440,th:.42,ph:.82});
  await wait(.5);await Promise.all(A.parts.map((p,j)=>wait(j*.07).then(()=>{SND.fx('pick');return moveTo(p.group,p.tray,.75,46)})));if(!A.on)return;A.busy=false;A.phase='pick';A.run=true;mark();asmUI()}
 function exitAsm(){if(!A.on)return;A.on=false;A.busy=false;A.run=false;TW.length=0;document.body.classList.remove('asm');['#card','#gbar','#carousel'].forEach(s=>$(s).hidden=false);$('#asm').hidden=$('#asmExit').hidden=$('#asmDone').hidden=true;
  tray.visible=pad.visible=iron.visible=ghost.visible=false;props.visible=true;A.parts.forEach(p=>{p.group.position.set(0,0,0);tint(p.group,false)});if(U.leds.PWR)U.leds.PWR.material.emissiveIntensity=2.4;setBoard(cur,true)}
 function toHand(){const p=A.parts[A.i];p.st='hand';A.hand=p;A.phase='place';SND.fx('pick');ghost.scale.set(p.size.x+1.5,.5,p.size.z+1.5);ghost.position.set(B.position.x+p.center.x,B.position.y+U.lift+1.9,B.position.z+p.center.z);ghost.visible=true;p.group.position.y+=16;mark();asmUI()}
 function tack(){const p=A.parts[A.i];A.hand=null;ghost.visible=false;p.st='tacked';A.phase='solder';A.sol=0;SND.fx('snap');tint(p.group,false);asmUI();return moveTo(p.group,new V3(0,0,0),.28,6)}
 function soldered(){const p=A.parts[A.i];p.st='done';A.hold=false;iron.visible=false;SND.fx('ok');A.i++;if(A.i>=A.parts.length){A.phase='end';A.run=false;mark();asmUI();finish()}else{A.phase='pick';mark();asmUI()}}
 function finish(){SND.fx('done');Object.values(U.leds).forEach(l=>l.material.emissiveIntensity=2.4);const s=Math.floor(A.t);$('#adT').textContent=BOARDS[cur].name+' — built';$('#adP').textContent=A.parts.length+' parts soldered in '+Math.floor(s/60)+':'+String(s%60).padStart(2,'0')+(A.ch?' · '+A.miss+' wrong pick'+(A.miss===1?'':'s')+' in challenge mode':'')+'.';{const id=BOARDS[cur].id,best=STORE.get('best',{}),nb=best[id]==null||s<best[id];if(nb){best[id]=s;STORE.set('best',best)}$('#adP').textContent+=nb?' New best time.':' Best so far: '+fmtT(best[id])+'.';const lines=['1 × '+BOARDS[cur].name+' bare PCB',...A.parts.map(p=>'1 × '+p.name)];A.lines=lines;const ul=$('#adL');ul.innerHTML='';lines.forEach(l=>ul.append(h('li',{},l)));LOG.add('Assembly',BOARDS[cur].name,[...lines,A.parts.length+' × Solder joint group'],'soldered in '+fmtT(s)+(A.ch?', challenge mode':''))}$('#asmDone').hidden=false;orb.set({t:new V3(BP.x,6,BP.z),r:230,th:.5,ph:.9});orb.auto=.15}
 async function autoNext(){if(A.busy||!A.on||A.phase==='dis'||A.phase==='end')return;A.busy=true;const p=A.parts[A.i];if(A.phase==='pick'){p.st='hand';A.phase='place';asmUI();SND.fx('pick');await moveTo(p.group,new V3(0,0,0),.6,44);if(!A.on)return;p.st='tacked';A.phase='solder';tint(p.group,false);SND.fx('snap');asmUI()}else if(A.phase==='place'){await tack()}
  if(!A.on)return;iron.visible=true;const to=new V3(B.position.x+p.center.x,B.position.y+p.box.max.y,B.position.z+p.center.z);await moveTo(iron,to,.3);for(let k=0;k<5&&A.on;k++){SND.fx('sizzle');puff(to);await wait(.11)}if(!A.on)return;A.busy=false;soldered()}
 function asmClick(e){if(A.busy)return;const p=A.parts[A.i];if(A.phase==='pick'){const hit=pick(e,cam,cv,A.parts.filter(q=>q.st==='tray').map(q=>q.group))[0];if(!hit)return;let o=hit.object;while(o&&!o.userData.part)o=o.parent;if(o.userData.part===p.id)toHand();else{const q=A.parts.find(x=>x.id===o.userData.part);SND.fx('bad');if(A.ch){A.miss++;toast('Not that one — that is the '+q.name+'.','bad')}else toast('That is the '+q.name+'. Pick the highlighted part: '+p.name+'.')}}
  else if(A.phase==='place'){const g=onPlane(e,cam,cv,B.position.y+U.lift+1.6);if(g&&Math.hypot(g.x-B.position.x-p.center.x,g.z-B.position.z-p.center.z)<Math.max(13,Math.max(p.size.x,p.size.z)/2+7))tack();else toast('Aim for the pulsing red footprint on the board.')}}
 function follow(e){if(!A.on||A.busy)return;const p=A.parts[A.i];if(A.phase==='place'&&A.hand){const g=onPlane(e,cam,cv,26);if(g)A.hand.group.position.set(g.x-B.position.x-p.center.x,22-B.position.y-p.box.min.y,g.z-B.position.z-p.center.z)}
  else if(A.phase==='solder'){const y=B.position.y+p.box.max.y,g=onPlane(e,cam,cv,y);if(g){iron.visible=true;iron.position.set(g.x,y,g.z)}}}
 $('#bAsm').onclick=startAsm;$('#asmExit').onclick=$('#aX').onclick=$('#aExit2').onclick=$('#adExit').onclick=exitAsm;$('#aRe').onclick=$('#adAgain').onclick=()=>{if(A.busy&&A.phase==='dis')return;A.on=false;TW.length=0;A.busy=false;iron.visible=ghost.visible=false;A.parts.forEach(p=>{p.group.position.set(0,0,0);tint(p.group,false)});startAsm()};
 $('#aAuto').onclick=autoNext;$('#aHint').onclick=()=>{if(A.phase==='dis'||A.phase==='end')return;const p=A.parts[A.i];tint(p.group,true);SND.fx('click');const st=p.st;orb.set({t:st==='tray'?p.center.clone().add(B.position).add(p.group.position):world(p),r:260});setTimeout(()=>{mark();if(A.on&&A.phase!=='end')orb.set({t:AT(),r:sec.clientWidth<700?780:440})},1600)};
 $('#aCh').onclick=()=>{A.ch=!A.ch;$('#aCh').classList.toggle('on',A.ch);$('#aChS').textContent=A.ch?'On':'Off';mark();asmUI();toast(A.ch?'Challenge on: no highlights — find each part by its name.':'Challenge off.')};

 /* UI wiring */
 $$('#gbar [data-v]').forEach(b=>b.onclick=()=>{$$('#gbar [data-v]').forEach(x=>x.classList.toggle('on',x===b));const v=b.dataset.v,fl=v==='bottom';if(fl!==flipped){flipped=fl;const a=B.rotation.x,z=fl?PI:0,y0=B.position.y,y1=fl?U.box.max.y+6:0;tween(.6,k=>{B.rotation.x=lerp(a,z,k);B.position.y=lerp(y0,y1,k)})}
  if(sel>=0)select(-1);orb.set(v==='top'||v==='bottom'?{ph:.04,th:Math.round(orb.gth/(2*PI))*2*PI}:v==='front'?{ph:1.36,th:Math.round(orb.gth/(2*PI))*2*PI}:{ph:.98,th:Math.round(orb.gth/(2*PI))*2*PI+.6});if(v!=='34'){rot=false;$('#bRot').classList.remove('on');auto()}});
 $('#bRot').onclick=()=>{rot=!rot;$('#bRot').classList.toggle('on',rot);auto()};
 $('#bLab').onclick=()=>{labs=!labs;$('#bLab').classList.toggle('on',labs);mkLabels()};
 $('#bPin').onclick=()=>{pinsOn=!pinsOn;$('#bPin').classList.toggle('on',pinsOn);mkLabels();if(pinsOn)toast(U.pins.length+' pins on this board. Top view reads best.')};$('#bExp').onclick=()=>setExpl(!expl);$('#adCopy').onclick=()=>copyText(BOARDS[cur].name+' — assembly kit\n'+(A.lines||[]).map(l=>'- '+l).join('\n'),'Parts list copied.');
 $('#bFind').onclick=startFind;$('#pClose').onclick=()=>{if(find)startFind();else select(-1)};
 $('#pPrev').onclick=()=>select((sel-1+U.parts.length)%U.parts.length);$('#pNext').onclick=()=>select((sel+1)%U.parts.length);
 $('#cOpen').onclick=()=>{BENCH.openBoard(BOARDS[cur].id);go('workbench')};
 const tip=$('#gtip');
 cv.addEventListener('pointermove',e=>{ptr=e;if(A.on){follow(e);tip.classList.remove('on');return}if(orb.pts.size){tip.classList.remove('on');return}if(e.pointerType==='touch')return;const j=partAt(e);cv.style.cursor=j>=0?'pointer':'grab';if(j>=0&&!find){const b=sec.getBoundingClientRect();tip.textContent=U.parts[j].name;tip.style.left=(e.clientX-b.left)+'px';tip.style.top=(e.clientY-b.top)+'px';tip.classList.add('on')}else tip.classList.remove('on')});
 cv.addEventListener('pointerleave',()=>tip.classList.remove('on'));
 cv.addEventListener('pointerup',e=>{const wasHold=A.hold;A.hold=false;orb.block=false;if(orb.moved>7||wasHold)return;if(A.on){asmClick(e);follow(e);return}const j=partAt(e);if(find){if(find.i<find.order.length)answerFind(j)}else if(j>=0)select(j);else if(sel>=0)select(-1)});
 addEventListener('keydown',e=>{if(e.key==='Escape'&&A.on)exitAsm();if(!A.on&&scrollY<innerHeight*.5&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){if(e.key==='ArrowRight'){sel>=0?$('#pNext').click():setBoard((cur+1)%BOARDS.length)}if(e.key==='ArrowLeft'){sel>=0?$('#pPrev').click():setBoard((cur+BOARDS.length-1)%BOARDS.length)}}});

 let sizT=0;
 function tick(dt,t){if(!fit(ren,cam,sec))return;orb.update(dt);
  {const W=sec.clientWidth,H=sec.clientHeight,nar=W<700,ox=nar||A.on?0:-.055,oy=nar?(A.on?.2:-.12):0,key=ox+'|'+oy+'|'+W+'|'+H;if(key!==cam.userData.vo){cam.userData.vo=key;(ox||oy)?cam.setViewOffset(W,H,W*ox,H*oy,W,H):cam.clearViewOffset()}}
  if(A.on){if(A.run){A.t+=dt;const s=Math.floor(A.t);$('#aTime').textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
   if(ghost.visible)ghost.material.opacity=.3+.25*Math.sin(t*6);
   const gl=iron.userData.glow;gl.material.opacity=A.hold?.9:0;
   if(A.phase==='solder'&&A.hold&&!A.busy){A.sol+=dt/.85;sizT-=dt;if(sizT<0){sizT=.1;SND.fx('sizzle');puff(iron.position)}$('#aBar').style.width=((A.parts.filter(p=>p.st==='done').length+Math.min(1,A.sol))/A.parts.length*100)+'%';if(A.sol>=1)soldered()}
   else if(A.phase==='solder'&&!A.hold&&A.sol>0)A.sol=Math.max(0,A.sol-dt*.6)}
  for(let i=smoke.length-1;i>=0;i--){const s=smoke[i];s.position.addScaledVector(s.userData.v,dt);s.scale.multiplyScalar(1+dt*1.6);s.material.opacity-=dt*.45;if(s.material.opacity<=0){scene.remove(s);s.material.dispose();smoke.splice(i,1)}}
  if(pinsOn&&!A.on)U.pins.forEach(p=>{if(!p.lab)return;const s=toScreen(B.localToWorld(p.pos.clone()),cam,sec);p.lab.style.left=s.x+'px';p.lab.style.top=s.y+'px';p.lab.style.display=s.ok?'':'none'});
  if(labs&&!A.on)U.parts.forEach(p=>{if(!p.lab)return;const w=p.center.clone().add(p.group.position);w.y=p.box.max.y+p.group.position.y;B.localToWorld(w);const s=toScreen(w,cam,sec);p.lab.style.left=s.x+'px';p.lab.style.top=s.y+'px';p.lab.style.display=s.ok?'':'none'});
  ren.render(scene,cam)}
 setBoard(0,true);
 return{tick,setBoard:i=>{if(A.on)exitAsm();setBoard(i)},get asm(){return A.on},_:{orb,cam,scene,A,get B(){return B}}}}

