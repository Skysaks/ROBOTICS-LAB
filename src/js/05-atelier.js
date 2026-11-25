/* ───────── Workbench: parts, wiring, missions, simulation ───────── */
const BENCH={};
function initBench(thumbs){
 const cv=$('#bgl'),stage=$('#stage'),box=$('#bench'),ren=mkRenderer(cv),scene=new T.Scene(),cam=new T.PerspectiveCamera(30,1,2,5000);
 scene.background=new T.Color('#e9e4da');scene.environment=mkEnv(ren);lights(scene,300);
 let items=[],wires=[],mission=null,mi=-1,steps=[],pend=null,hover=null,sel=null,drag=null,running=false,tab='steps',serial=[],topv=false,uid=0,tool='wire',undo=[],redo=[],last='',pname='',sold=null;
 cv.addEventListener('pointerdown',e=>{orb.block=false;SND.ac();if(tool==='solder'){const en=nearEnd(e);if(en){sold={w:en.w,end:en.end,t:0};orb.block=true;const p=wpos(en.w[en.end].it,en.w[en.end].pin);iron.position.set(p.x,p.y+3.5,p.z);iron.visible=true}return}const pn=nearPin(e);if(pn){orb.block=true;return}const it=itemAt(e);if(it){const g=onPlane(e,cam,cv,0);if(g){drag={it,dx:it.g.position.x-g.x,dz:it.g.position.z-g.z,m:0,x:e.clientX,y:e.clientY};orb.block=true;try{cv.setPointerCapture(e.pointerId)}catch(_){}}}});
 const orb=new Orbit(cam,cv,{minR:60,maxR:900,maxPh:1.45,r:400,gr:400,th:0,gth:0,ph:.74,gph:.74});
 const MW=420,MD=290;
 const table=new T.Mesh(new T.PlaneGeometry(5000,5000),mt('#e9e4da',.95));table.rotation.x=-PI/2;table.position.y=-2.5;table.receiveShadow=true;scene.add(table);
 const mtex=ctex(2100,1450,(c,W,H)=>{const s=5;c.fillStyle='#3d555f';c.fillRect(0,0,W,H);for(let x=0;x<=MW;x+=10){c.fillStyle=x%50?'rgba(255,255,255,.16)':'rgba(255,255,255,.42)';c.fillRect(x*s-(x%50?1:1.5),0,x%50?2:3,H)}for(let y=0;y<=MD;y+=10){c.fillStyle=y%50?'rgba(255,255,255,.16)':'rgba(255,255,255,.42)';c.fillRect(0,y*s-(y%50?1:1.5),W,y%50?2:3)}
  c.fillStyle='rgba(255,255,255,.6)';c.font='600 22px ui-monospace,Menlo,monospace';c.fillText('ESD-SAFE WORK MAT  ·  1 SQUARE = 10 MM',16,30);for(let x=50;x<MW;x+=50)c.fillText(String(x/10),x*s+6,H-12)});
 const matM=new T.Mesh(new T.BoxGeometry(MW,2.5,MD),[mt('#48606a'),mt('#48606a'),new T.MeshStandardMaterial({map:mtex,roughness:.9}),mt('#48606a'),mt('#48606a'),mt('#48606a')]);matM.position.y=-1.25;matM.receiveShadow=true;scene.add(matM);
 const ring=(c)=>{const m=new T.Mesh(new T.TorusGeometry(2.6,.5,10,28),new T.MeshBasicMaterial({color:c,transparent:true,opacity:.95,depthTest:false}));m.rotation.x=PI/2;m.renderOrder=9;m.visible=false;scene.add(m);return m};
 const rA=ring('#ff5a3c'),rB=ring('#ff5a3c'),rH=ring('#ffffff'),rP=ring('#ffd23c');
 const rub=new T.Line(new T.BufferGeometry().setFromPoints([new V3(),new V3()]),new T.LineBasicMaterial({color:'#ffd23c',depthTest:false}));rub.visible=false;rub.renderOrder=9;scene.add(rub);
 const calls=$('#calls'),cA=h('div',{class:'call'}),cB=h('div',{class:'call'});calls.append(cA,cB);
 const wpos=(it,pin)=>it.g.localToWorld(pin.pos.clone());
 const iname=it=>it.kind==='board'?it.def.name:it.def.name;

 /* palette */
 const pal=$('#pal');pal.append(h('span',{class:'mono'},'Boards'));BOARDS.forEach(b=>pal.append(h('button',{class:'it',onclick:()=>palAdd(b.id,'board')},h('img',{src:thumbs[b.id],alt:''}),h('span',{},b.name,h('small',{},b.volt+' V logic')))));
 let cat='';MODS.forEach(m=>{if(m[3]!==cat){cat=m[3];pal.append(h('span',{class:'mono'},cat))}pal.append(h('button',{class:'it',onclick:()=>palAdd(m[0],'mod')},h('img',{src:thumbs[m[0]],alt:''}),h('span',{},m[1],h('small',{},m[2]))))});
 pal.append(h('button',{class:'clear',onclick:()=>{load(-1);toast('Bench cleared — free build.')}},'Clear the bench'));

 function addItem(id,kind,x,z,rot,o,key){const def=kind==='board'?BY[id]:MOD[id],g=kind==='board'?buildBoard(def,{bench:true}):buildMod(id,o||{}),U=g.userData;
  if(kind==='board'&&U.leds.PWR)U.leds.PWR.material.emissiveIntensity=0;g.position.set(x,0,z);g.rotation.y=(rot||0)*PI/180;scene.add(g);g.updateMatrixWorld(true);
  const s=U.box.getSize(new V3());let ky=key;if(!ky){do{ky=id+(++uid)}while(items.some(i=>i.key===ky))}const it={uid:++uid,key:ky,kind,id,def,g,o:o||null,pins:U.pins,rad:Math.hypot(s.x,s.z)/2,h:U.box.max.y,val:{pressed:false,motion:false,v:.5,light:.6,temp:24,hum:55,dist:60}};g.userData.item=it;items.push(it);if(U.fx.knob)U.fx.knob(.5);return it}
 function palAdd(id,kind,o){const probe=kind==='board'?Math.hypot(BY[id].w,BY[id].d)/2+6:30;let best=null;for(let r=0;r<200&&!best;r+=18)for(let a=0;a<(r?12:1);a++){const x=Math.cos(a*PI/6)*r*1.3,z=Math.sin(a*PI/6)*r*.8+10;if(Math.abs(x)>MW/2-30||Math.abs(z)>MD/2-25)continue;if(items.every(o=>Math.hypot(o.g.position.x-x,o.g.position.z-z)>o.rad+probe)){best=[x,z];break}}
  best=best||[(Math.random()-.5)*200,(Math.random()-.5)*120];const it=addItem(id,kind,best[0],best[1],0,o);it.g.position.y=40;tween(.35,k=>it.g.position.y=40*(1-k)).then(()=>refreshWires(it));select({type:'item',ref:it});SND.fx('snap');mkTry();hintText();render();commit()}
 function removeItem(it){if(wires.some(w=>(w.a.it===it||w.b.it===it)&&(w.sa||w.sb))){toast('A soldered wire holds this part. Melt the joint with the iron first (Solder tool).','bad');SND.fx('bad');return}wires.filter(w=>w.a.it===it||w.b.it===it).forEach(removeWire);scene.remove(it.g);items=items.filter(x=>x!==it);if(sel&&sel.ref===it)select(null);mkTry();render();hintText();commit()}

 /* wires */
 function wireGeo(w){const a=wpos(w.a.it,w.a.pin),b=wpos(w.b.it,w.b.pin),d=a.distanceTo(b),m=a.clone().add(b).multiplyScalar(.5);m.y=Math.max(a.y,b.y)+16+d*.22;if(w.k==null)w.k=(wires.length%5)-2;const px=-(b.z-a.z)/(d||1),pz=(b.x-a.x)/(d||1);m.x+=px*w.k*3.2;m.z+=pz*w.k*3.2;m.y+=Math.abs(w.k)*1.5;const c=new T.QuadraticBezierCurve3(a,m,b);w.mid=c.getPoint(.5);w.len=c.getLength();return new T.TubeGeometry(c,36,1.05,8)}
 function addWire(a,b,color,k){const w={a,b,color:color||'#c63a2b'};if(k!=null)w.k=k;w.mesh=sh(new T.Mesh(wireGeo(w),mt(w.color,.5)));w.mesh.userData.wire=w;const cap=()=>cy(1.5,5,mt('#232323',.6),0,0,0,10);w.ca=cap();w.cb=cap();scene.add(w.mesh,w.ca,w.cb);caps(w);wires.push(w);return w}
 function caps(w){const a=wpos(w.a.it,w.a.pin),b=wpos(w.b.it,w.b.pin);w.ca.position.set(a.x,a.y+1.5,a.z);w.cb.position.set(b.x,b.y+1.5,b.z);[[w.ca,w.sa],[w.cb,w.sb]].forEach(([m,so])=>{m.material=so?mt('#e3e6e8',.2,.9):mt('#232323',.6);m.scale.set(so?1.6:1,so?.5:1,so?1.6:1)})}
 const pm=(x,s)=>x.it.key===s.key&&x.pin.name===s.pin,wm=(w,s)=>(pm(w.a,s.a)&&pm(w.b,s.b))||(pm(w.a,s.b)&&pm(w.b,s.a));
 function syncSteps(){steps.forEach(s=>{s.done=false;s.wire=null});wires.forEach(w=>{const st=steps.find(s=>!s.done&&wm(w,s));if(st){st.done=true;st.wire=w}})}
 function tryRemoveWire(w){if(w.sa||w.sb){toast('That wire is soldered. Melt its joints with the iron first (Solder tool).','bad');SND.fx('bad');return false}removeWire(w);render();hintText();commit();return true}
 function refreshWires(it){wires.forEach(w=>{if(!it||w.a.it===it||w.b.it===it){w.mesh.geometry.dispose();w.mesh.geometry=wireGeo(w);caps(w)}})}
 function removeWire(w){scene.remove(w.mesh,w.ca,w.cb);w.mesh.geometry.dispose();wires=wires.filter(x=>x!==w);syncSteps();if(sel&&sel.ref===w)select(null)}
 function check(a,b){const ta=a.pin.type,tb=b.pin.type,P5=t=>t==='p5',PW=t=>t==='p5'||t==='p3';
  if(a.it===b.it&&a.pin===b.pin)return'That is the same pin.';
  if(wires.some(w=>(w.a.pin===a.pin&&w.b.pin===b.pin)||(w.a.pin===b.pin&&w.b.pin===a.pin)))return'Those two pins are already connected.';
  if((PW(ta)&&tb==='gnd')||(PW(tb)&&ta==='gnd'))return'Short circuit: that wire would join power straight to ground.';
  if((ta==='p5'&&tb==='p3')||(ta==='p3'&&tb==='p5'))return'Never join the 5 V and 3.3 V rails.';
  const five=(p,q)=>P5(p.pin.type)&&p.it.kind==='board'&&q.pin.type==='sig'&&q.it.kind==='board'&&q.it.def.volt<5;if(five(a,b)||five(b,a))return'5 V on a 3.3 V pin can destroy the chip. Use the logic level converter.';
  return''}
 function warn(a,b){if(a.it.kind==='board'&&b.it.kind==='board'&&a.pin.type==='sig'&&b.pin.type==='sig'&&a.it.def.volt!==b.it.def.volt)return'Mixed logic levels: safe only when the 3.3 V board is the one talking.';return''}
 function connect(a,b){const err=check(a,b);if(err){toast(err,'bad');SND.fx('bad');return null}
  const m=(x,s)=>x.it.key===s.key&&x.pin.name===s.pin,st=steps.find(s=>!s.done&&((m(a,s.a)&&m(b,s.b))||(m(a,s.b)&&m(b,s.a))));
  const w=addWire(a,b,st?st.color:WCOL[['blue','green','orange','purple','yellow','red'][wires.length%6]]);SND.fx('snap');
  if(st){st.done=true;st.wire=w;if(steps.every(s=>s.done)){toast('All wired. Press Run.','good');SND.fx('ok')}}else{const ww=warn(a,b);if(mission)toast(ww||'Connected — though this wire is not one of the mission steps.');else if(ww)toast(ww)}
  render();hintText();commit();return w}

 /* picking */
 function allPins(){const o=[];items.forEach(it=>it.pins.forEach(pin=>o.push({it,pin})));return o}
 function targets(){const s=steps.find(x=>!x.done);if(!s)return[];const f=t=>{const it=items.find(i=>i.key===t.key);if(!it)return null;const c=it.pins.filter(p=>p.name===t.pin);if(!c.length)return null;return{it,pin:c.find(p=>!wires.some(w=>w.a.pin===p||w.b.pin===p))||c[0]}};const a=f(s.a),b=f(s.b);return a&&b?[a,b]:[]}
 function nearPin(e){const b=cv.getBoundingClientRect(),mx=e.clientX-b.left,my=e.clientY-b.top;let best=null,bd=1e9;const tg=targets();
  allPins().forEach(p=>{const s=toScreen(wpos(p.it,p.pin),cam,cv);if(!s.ok)return;let d=Math.hypot(s.x-mx,s.y-my);const isT=tg.some(t=>t.pin===p.pin);const lim=(isT?26:11)*(e.pointerType==='touch'?1.6:1);if(d<lim){if(isT)d*=.3;if(d<bd){bd=d;best=p}}});return best}
 function itemAt(e){const hit=pick(e,cam,cv,items.map(i=>i.g))[0];if(!hit)return null;let o=hit.object;while(o&&!o.userData.item)o=o.parent;return o?o.userData.item:null}
 function wireAt(e){const hit=pick(e,cam,cv,wires.map(w=>w.mesh),false)[0];return hit?hit.object.userData.wire:null}
 const tip=$('#btip');function showTip(e,html){const b=stage.getBoundingClientRect();tip.innerHTML=html;tip.style.left=(e.clientX-b.left)+'px';tip.style.top=(e.clientY-b.top)+'px';tip.classList.add('on')}
 cv.addEventListener('pointermove',e=>{if(tool==='solder'){const g=onPlane(e,cam,cv,8),en=nearEnd(e);if(en){const p=wpos(en.w[en.end].it,en.w[en.end].pin);iron.position.set(p.x,p.y+3.5,p.z);const so=en.w['s'+en.end];showTip(e,'<b>'+(so?'Soldered joint':'Loose joint')+'</b><small>hold to '+(so?'desolder':'solder')+'</small>')}else{if(g)iron.position.set(g.x,8,g.z);tip.classList.remove('on')}iron.visible=true;if(sold&&(!en||en.w!==sold.w||en.end!==sold.end))sold=null;return}if(drag){drag.m+=Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y);drag.x=e.clientX;drag.y=e.clientY;if(drag.m>5){const g=onPlane(e,cam,cv,0);if(g){drag.it.g.position.x=clamp(g.x+drag.dx,-MW/2+10,MW/2-10);drag.it.g.position.z=clamp(g.z+drag.dz,-MD/2+10,MD/2-10);drag.it.g.updateMatrixWorld(true);refreshWires(drag.it)}}tip.classList.remove('on');return}
  if(orb.pts.size){tip.classList.remove('on');return}
  if(pend){const g=onPlane(e,cam,cv,12);if(g){rub.geometry.setFromPoints([wpos(pend.it,pend.pin),g]);rub.visible=true}}
  const pn=nearPin(e);hover=pn;const pi=$('#pinfo');
  if(pn){cv.style.cursor='crosshair';const nv=volt(pn);showTip(e,'<b>● '+pn.pin.name+'</b><br>'+pn.pin.info+'<small>'+iname(pn.it)+' · probe: '+nv+'</small>');if(pi){pi.hidden=false;pi.innerHTML='<b>● '+pn.pin.name+'</b><small>'+iname(pn.it)+'</small><br>'+pn.pin.info+'<br><b>Probe</b> '+nv+(net(pn).length?' · joined to '+net(pn).map(x=>x.pin.name).join(', '):'')}return}
  if(e.pointerType==='touch')return;const it=itemAt(e);if(it){cv.style.cursor='grab';showTip(e,'<b>'+iname(it)+'</b><small>drag to move · R rotates</small>')}else{cv.style.cursor=wireAt(e)?'pointer':'default';tip.classList.remove('on')}});
 cv.addEventListener('pointerleave',()=>{tip.classList.remove('on');hover=null});
 cv.addEventListener('pointerup',e=>{if(tool==='solder'){orb.block=false;sold=null;return}orb.block=false;const d=drag;drag=null;if(d&&d.m>5){SND.fx('click');commit();return}if(orb.moved>7)return;
  const pn=nearPin(e);if(pn){if(!pend){pend=pn;SND.fx('pick')}else{const a=pend;pend=null;rub.visible=false;if(a.pin!==pn.pin)connect(a,pn)}hintText();return}
  if(pend){pend=null;rub.visible=false;hintText();return}
  if(d){select({type:'item',ref:d.it});return}const w=wireAt(e);select(w?{type:'wire',ref:w}:null)});
 addEventListener('keydown',e=>{if(/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;const r=box.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?doRedo():doUndo();return}
  if(e.key==='Escape'){if(tool==='solder')setTool('wire');else if(pend){pend=null;rub.visible=false;hintText()}else if(box.classList.contains('full'))full(false);else select(null)}
  if((e.key==='r'||e.key==='R')&&!e.metaKey&&!e.ctrlKey){const it=sel&&sel.type==='item'?sel.ref:hover?hover.it:null;if(it)rotate(it)}
  if((e.key==='Delete'||e.key==='Backspace')&&sel){e.preventDefault();sel.type==='item'?removeItem(sel.ref):tryRemoveWire(sel.ref)}});
 function rotate(it){const a=it.g.rotation.y,b=a+PI/2;tween(.22,k=>{it.g.rotation.y=lerp(a,b,k);it.g.updateMatrixWorld(true);refreshWires(it)}).then(commit);SND.fx('click')}
 const sb=$('#selbar');
 function select(s){sel=s;sb.innerHTML='';sb.hidden=!s;if(!s)return;if(s.type==='item'){sb.append(h('span',{},iname(s.ref)),h('button',{onclick:()=>rotate(s.ref)},'Rotate'),h('button',{onclick:()=>palAdd(s.ref.id,s.ref.kind,s.ref.o)},'Duplicate'),h('button',{onclick:()=>removeItem(s.ref)},'Remove'))}
  else{sb.append(h('span',{},'Wire'),...Object.values(WCOL).map(c=>h('button',{class:'dot'+(c===s.ref.color?' on':''),style:'background:'+c,'aria-label':'colour',onclick:()=>{s.ref.color=c;s.ref.mesh.material=mt(c,.5);select(s);render();commit()}})),h('button',{onclick:()=>tryRemoveWire(s.ref)},'Remove'))}}

 /* missions */
 function clearAll(){stop();wires.slice().forEach(removeWire);items.forEach(i=>scene.remove(i.g));items=[];steps=[];pend=null;rub.visible=false;select(null)}
 function mkSteps(){steps=mission?mission.wires.map(s=>{const[w,c,why]=s.split('|'),[a,b]=w.split('>'),pp=t=>{const k=t.indexOf('.');return{key:t.slice(0,k),pin:t.slice(k+1)}};return{a:pp(a),b:pp(b),color:WCOL[c],why,done:false}}):[]}
 function head(){$('#bTitle').textContent=pname||(mission?mission.title:'Free build');$('#bMeta').textContent=mission?mission.lvl+' · '+mission.min+' min'+(STORE.get('done',[]).includes(mission.n)?' · done ✓':''):(pname?'Your project':'Sandbox');$('#bAuto').hidden=!mission}
 function load(i){clearAll();mi=i;mission=i>=0?MISSIONS[i]:null;pname='';if(mission)mission.items.forEach(([key,id,x,z,r,o])=>addItem(id,BY[id]?'board':'mod',x,z,r,o,key));mkSteps();head();serial=[];tab='steps';frame();mkTry();render();hintText();last=snap();undo=[];redo=[];updUndo()}
 /* serialise / restore / undo */
 function snap(){return JSON.stringify({mi,items:items.map(i=>({key:i.key,id:i.id,kind:i.kind,x:+i.g.position.x.toFixed(1),z:+i.g.position.z.toFixed(1),r:Math.round(i.g.rotation.y*180/PI)%360,o:i.o})),wires:wires.map(w=>({a:[w.a.it.key,w.a.it.pins.indexOf(w.a.pin)],b:[w.b.it.key,w.b.it.pins.indexOf(w.b.pin)],c:w.color,sa:w.sa?1:0,sb:w.sb?1:0,k:w.k}))})}
 function restore(js){const d=typeof js==='string'?JSON.parse(js):js;clearAll();mi=typeof d.mi==='number'&&MISSIONS[d.mi]?d.mi:-1;mission=mi>=0?MISSIONS[mi]:null;
  (d.items||[]).forEach(i=>{if((i.kind==='board'?BY:MOD)[i.id])addItem(i.id,i.kind,+i.x||0,+i.z||0,+i.r||0,i.o,String(i.key))});
  (d.wires||[]).forEach(w=>{const A=items.find(i=>i.key===w.a[0]),B=items.find(i=>i.key===w.b[0]);if(!A||!B||!A.pins[w.a[1]]||!B.pins[w.b[1]])return;const x=addWire({it:A,pin:A.pins[w.a[1]]},{it:B,pin:B.pins[w.b[1]]},w.c,w.k);x.sa=!!w.sa;x.sb=!!w.sb;caps(x)});
  mkSteps();syncSteps();head();mkTry();render();hintText()}
 function updUndo(){$('#bUndo').disabled=!undo.length;$('#bRedo').disabled=!redo.length}
 function commit(){const s=snap();if(s===last)return;undo.push(last);if(undo.length>80)undo.shift();redo=[];last=s;updUndo()}
 function doUndo(){if(!undo.length)return;redo.push(last);last=undo.pop();const n=pname;restore(last);pname=n;head();updUndo();SND.fx('click')}
 function doRedo(){if(!redo.length)return;undo.push(last);last=redo.pop();const n=pname;restore(last);pname=n;head();updUndo();SND.fx('click')}
 $('#bUndo').onclick=doUndo;$('#bRedo').onclick=doRedo;
 /* nets + probe */
 function net(p){const seen=new Set([p.pin]),out=[],q=[p.pin];while(q.length){const x=q.pop();wires.forEach(w=>{const o=w.a.pin===x?w.b:w.b.pin===x?w.a:null;if(o&&!seen.has(o.pin)){seen.add(o.pin);out.push(o);q.push(o.pin)}})}return out}
 function volt(p){const all=[p,...net(p)],has=t=>all.some(x=>x.pin.type===t);return has('gnd')?'0 V (ground)':all.some(x=>x.it.id==='batt'&&x.pin.name==='+')?'≈ 6 V (battery)':has('p5')?'5.0 V':has('p3')?'3.3 V':all.length>1?'signal, '+(all.length-1)+' connection'+(all.length>2?'s':''):'not connected'}
 /* soldering tool */
 const iron=mkIron();iron.scale.setScalar(.62);scene.add(iron);const smoke=mkSmoke(scene);let sizT=0;
 function nearEnd(e){const b=cv.getBoundingClientRect(),mx=e.clientX-b.left,my=e.clientY-b.top;let best=null,bd=(e.pointerType==='touch'?40:26);wires.forEach(w=>['a','b'].forEach(k=>{const s=toScreen(wpos(w[k].it,w[k].pin),cam,cv),d=Math.hypot(s.x-mx,s.y-my);if(s.ok&&d<bd){bd=d;best={w,end:k}}}));return best}
 function setTool(t){tool=t;sold=null;pend=null;rub.visible=false;iron.visible=false;select(null);$('#bSol').classList.toggle('on',t==='solder');cv.style.cursor=t==='solder'?'none':'default';hintText()}
 $('#bSol').onclick=()=>{setTool(tool==='solder'?'wire':'solder');if(tool==='solder'&&!wires.length)toast('Run a wire first, then hold the iron on each end to solder it.')};
 function joints(){return wires.reduce((n,w)=>n+(w.sa?1:0)+(w.sb?1:0),0)}
 /* what this build uses */
 function bom(){const m=new Map();let cost=0;items.forEach(i=>{m.set(i.def.name,(m.get(i.def.name)||0)+1);cost+=PRICE[i.id]||0});const L=[...m].map(([n,q])=>[q,n,'']),bb=items.filter(i=>i.kind==='board'&&i.def.down).length;if(bb){L.push([bb,'Mini breadboard','']);cost+=bb*2}
  const wl={};wires.forEach(w=>{const n=Object.keys(WCOL).find(k=>WCOL[k]===w.color)||'other';wl[n]=wl[n]||[0,0];wl[n][0]++;wl[n][1]+=w.len||0});Object.entries(wl).forEach(([c,[q,l]])=>{L.push([q,'Jumper wire, '+c,Math.round(l/10)+' cm']);cost+=q*.1});
  const j=joints();if(j)L.push([j,'Solder joint','≈ '+(j*1.2).toFixed(1)+' cm of solder']);return{L,cost,j,lines:L.map(r=>r[0]+' × '+r[1]+(r[2]?' ('+r[2]+')':''))}}
 const bname=()=>pname?pname+(mission?' (from mission '+mission.n+')':''):mission?'Mission '+mission.n+' — '+mission.title:'Free build';
 /* projects */
 function openProjects(){$('#mTitle').textContent='Projects';$('#mgrid').hidden=true;const b=$('#mbody');b.innerHTML='';const list=STORE.get('proj',[]),inp=h('input',{type:'text',placeholder:'Name this build, e.g. Line follower',value:pname,maxlength:40});
  const save=()=>{const n=inp.value.trim();if(!n){toast('Give the build a name first.','bad');return}if(!items.length){toast('The bench is empty — nothing to save yet.','bad');return}const l=STORE.get('proj',[]).filter(p=>p.name!==n);l.unshift({name:n,t:Date.now(),data:snap(),sum:items.length+' parts · '+wires.length+' wires · '+joints()+' joints'});const ok=STORE.set('proj',l.slice(0,40));pname=n;head();toast(ok?'Saved "'+n+'" in this browser.':'Saved for this visit only — this browser blocks storage. Copy the code to keep it.',ok?'good':'');openProjects()};
  b.append(h('h4',{},'Save what is on the bench'),h('div',{class:'row'},inp,h('button',{class:'pill dark',onclick:save},'Save build'),h('button',{class:'pill',onclick:()=>{load(-1);closeModal();toast('Empty bench — build anything.')}},'New empty project')),h('h4',{},'Your builds'));
  if(!list.length)b.append(h('p',{class:'n'},'Nothing saved yet. Build something in Free build or tweak a mission, then save it here.'));
  list.forEach(p=>b.append(h('div',{class:'pr'},h('b',{},p.name),h('small',{},p.sum+' · '+new Date(p.t).toLocaleDateString()),h('button',{class:'pill',onclick:()=>{restore(p.data);pname=p.name;head();frame();last=snap();undo=[];redo=[];updUndo();closeModal();toast('Opened "'+p.name+'".','good')}},'Open'),h('button',{class:'pill',onclick:e=>{const t=e.currentTarget;if(t.dataset.sure){STORE.set('proj',STORE.get('proj',[]).filter(x=>x.name!==p.name));openProjects()}else{t.dataset.sure=1;t.textContent='Really delete?'}}},'Delete'))));
  let code='';try{code=btoa(unescape(encodeURIComponent(snap())))}catch(e){}const out=h('textarea',{readonly:''},code),imp=h('textarea',{placeholder:'Paste a build code here'});
  b.append(h('h4',{},'Share or back up'),out,h('div',{class:'btnrow'},h('button',{class:'pill',onclick:()=>copyText(code,'Build code copied.')},'Copy code of the current build')),imp,h('div',{class:'btnrow'},h('button',{class:'pill',onclick:()=>{try{const d=JSON.parse(decodeURIComponent(escape(atob(imp.value.trim()))));if(!d||!Array.isArray(d.items))throw 0;restore(d);pname='Imported build';head();frame();last=snap();undo=[];redo=[];updUndo();closeModal();toast('Build loaded.','good')}catch(e){toast('That does not look like a build code.','bad')}}},'Load code')),h('p',{class:'n'},'Builds are stored in this browser only. The code is a full copy you can keep anywhere or send to someone.'));$('#modal').hidden=false}
 $('#bProj').onclick=openProjects;
 function frame(){let ex=95,ez=70;items.forEach(i=>{ex=Math.max(ex,Math.abs(i.g.position.x)+i.rad*.8);ez=Math.max(ez,Math.abs(i.g.position.z)+i.rad*.8)});const asp=(stage.clientWidth||900)/(stage.clientHeight||600),tn=Math.tan(15*PI/180);orb.set({t:new V3(0,0,6),r:clamp(Math.max(ex/(tn*asp),ez*1.25/tn)*1.12,300,1000),th:0,ph:topv?.04:.74})}
 function openModal(){const g=$('#mgrid'),dn=STORE.get('done',[]);g.innerHTML='';g.hidden=false;$('#mbody').innerHTML='';$('#mTitle').textContent='Missions · '+dn.length+' of '+MISSIONS.length+' done';MISSIONS.forEach((m,i)=>g.append(h('button',{class:'m'+(i===mi?' on':''),onclick:()=>{load(i);closeModal()}},h('span',{class:'mono',html:m.n+' · '+m.lvl+' · '+m.min+' min'+(dn.includes(m.n)?' · <b>✓ done</b>':'')}),h('b',{},m.title),h('p',{},m.sub),h('em',{},m.boards))));
  g.append(h('button',{class:'m sand'+(mi<0?' on':''),onclick:()=>{load(-1);closeModal()}},h('span',{class:'mono'},'Sandbox'),h('p',{style:'margin-top:26px'},'An empty bench. Any boards, any parts, your own wiring.'),h('em',{},'All 8 boards')));$('#modal').hidden=false}
 function closeModal(){$('#modal').hidden=true}
 $('#bMis').onclick=openModal;$('#mClose').onclick=closeModal;$('#modal').onclick=e=>{if(e.target.id==='modal')closeModal()};
 function hintText(){const left=steps.filter(s=>!s.done).length;$('#hint').textContent=tool==='solder'?'Solder: hold the iron on a wire end until the joint shines. Hold again to melt it. Esc to put the iron down.':running?'Running — use the Try it panel. Press Stop to end.':pend?'Now click the pin it should connect to. Esc cancels.':mission?(left?'Click a glowing pin, then the pin it should connect to.':'All wired — press Run.'):'Free build: add parts from the list, then click one pin and another to run a wire.'}
 const slab=t=>{const it=items.find(i=>i.key===t.key);return(it?iname(it):t.key)+' <code>'+t.pin+'</code>'};
 function render(){const b=$('#sbody');$$('#side .tabs button').forEach(x=>x.classList.toggle('on',x.dataset.t===tab));
  if(tab==='code'){b.innerHTML='';b.append(h('pre',{html:mission?mission.code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/(\/\/.*|#(?!include).*)$/gm,'<span class="c">$1</span>').replace(/\b(void|int|const|long|bool|float|char|if|else|while|for|return|switch|case|break|import|from|True|String)\b/g,'<span class="k">$1</span>'):'// Free build has no sketch.\n// Pick a mission to see the code that runs it.'}));return}
  if(tab==='serial'){b.innerHTML='<span class="mono">Serial monitor</span><div id="serial">'+(serial.length?serial.join('\n'):running?'':'Press Run to see what the board prints.')+'</div>';b.scrollTop=b.scrollHeight;return}
  if(tab==='parts'){const d=bom();b.innerHTML='<h4>Used in this build</h4><p class="in">'+bname()+'. Everything on the bench right now — it is also written to the Logbook each time you press Run.</p>';b.append(h('ul',{class:'bom'},d.L.length?d.L.map(r=>h('li',{},h('b',{},r[0]+' ×'),r[1],h('span',{},r[2]))):h('li',{},'Nothing on the bench yet.')),h('span',{class:'mono'},'Indicative cost ≈ $'+d.cost.toFixed(2)+' · '+d.j+' of '+wires.length*2+' joints soldered'),h('div',{class:'btnrow'},h('button',{class:'pill',onclick:()=>copyText(bname()+'\n'+d.lines.map(l=>'- '+l).join('\n'),'Parts list copied.')},'Copy list'),h('button',{class:'pill',onclick:()=>{if(!d.L.length){toast('Nothing to log yet.','bad');return}LOG.add('Workbench',bname(),d.lines,'saved by hand');toast('Written to the Logbook.','good')}},'Write to logbook')));return}
  if(!mission){b.innerHTML='<h4>Free build</h4><p class="in">An empty bench. Add any boards and parts from the list on the left, drag them where you want them, and wire pin to pin. The bench refuses dangerous connections — shorts, 5 V into a 3.3 V pin — and tells you why.</p><span class="mono">On the bench</span><ul class="learn"><li>'+items.length+' part'+(items.length===1?'':'s')+', '+wires.length+' wire'+(wires.length===1?'':'s')+'</li><li>Click a pin, then another, to connect them</li><li>Select a part or a wire to rotate, recolour or remove it</li><li>Press Run to power the bench: LEDs wired to power and ground light up, motors on a battery spin</li><li>Solder makes a wire permanent; Projects saves the whole build; the Parts tab lists what you used</li><li>Shortcuts: R rotate · Delete remove · Ctrl+Z undo · Esc cancel</li></ul><div id="pinfo" hidden></div>';return}
  const curI=steps.findIndex(s=>!s.done);b.innerHTML='<h4>'+mission.sub+'</h4><p class="in">'+mission.intro+'</p>'+(curI<0?'<div id="okbar">Circuit complete. Press Run'+(items.some(i=>/button|pot|ldr|dht11|hcsr04/.test(i.id))?', then use the Try it panel.':'.')+'</div>':'');
  steps.forEach((s,i)=>{b.append(h('div',{class:'stp'+(s.done?' done':i===curI?' cur':'')},h('i',{style:'background:'+s.color}),h('span',{html:slab(s.a)+' → '+slab(s.b)}),h('p',{},s.why),h('a',{onclick:()=>showMe()},'Show me')))});
  b.append(h('span',{class:'mono',style:'display:block;margin-top:14px'},'What you learn'),h('ul',{class:'learn'},mission.learn.map(l=>h('li',{},l))),h('div',{id:'pinfo',hidden:''}))}
 function showMe(){const t=targets();if(t.length<2)return;const a=wpos(t[0].it,t[0].pin),b=wpos(t[1].it,t[1].pin);orb.set({t:a.clone().add(b).multiplyScalar(.5).setY(0),r:clamp(a.distanceTo(b)*1.7+170,220,520),ph:.6})}
 $$('#side .tabs button').forEach(x=>x.onclick=()=>{tab=x.dataset.t;render()});
 let autoing=false;
 $('#bAuto').onclick=async()=>{if(autoing)return;autoing=true;pend=null;rub.visible=false;for(const s of steps){if(s.done)continue;const t=targets();if(t.length<2)break;const first=steps.find(x=>!x.done);if(first!==s)continue;connect(t[0],t[1]);await wait(.22)}autoing=false};
 $('#bClr').onclick=()=>{stop();const keep=wires.filter(w=>w.sa||w.sb).length;wires.filter(w=>!w.sa&&!w.sb).forEach(removeWire);render();hintText();commit();if(keep)toast(keep+' soldered wire'+(keep>1?'s stay':' stays')+' — melt the joints with the iron to free '+(keep>1?'them':'it')+'.')};
 $('#bTop').onclick=()=>{topv=!topv;$('#bTop').textContent=topv?'3D view':'Top view';frame()};
 $('#bSnd').onclick=()=>{SND.on=!SND.on;$('#bSnd').textContent=SND.on?'Sound on':'Sound off'};
 function full(on){box.classList.toggle('full',on);setTimeout(frame,60);document.documentElement.style.overflow=on?'hidden':'';$('#bFull').lastChild.textContent=on?'Exit full screen':'Full screen'}
 $('#bFull').onclick=()=>full(!box.classList.contains('full'));document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&box.classList.contains('full'))full(false)});

 /* try-it controls */
 function mkTry(){const t=$('#try');t.innerHTML='';const rows=[];
  const sl=(it,lab,key,min,max,step,fmt,cb)=>{const o=h('b',{},fmt(it.val[key]));rows.push(h('label',{},iname(it)+' · '+lab,h('div',{class:'r'},h('input',{type:'range',min,max,step,value:it.val[key],oninput:e=>{it.val[key]=+e.target.value;o.textContent=fmt(it.val[key]);cb&&cb(it.val[key])}}),o)))};
  items.forEach(it=>{const fx=it.g.userData.fx;
   if(it.id==='button'){const b=h('button',{class:'hold'},'Hold to press'),set=p=>{it.val.pressed=p;b.classList.toggle('dn',p);fx.press(p);if(p)SND.fx('click')};b.addEventListener('pointerdown',e=>{e.preventDefault();try{b.setPointerCapture(e.pointerId)}catch(_){}set(true)});['pointerup','pointercancel','lostpointercapture'].forEach(n=>b.addEventListener(n,()=>set(false)));rows.push(h('label',{},iname(it),b))}
   if(it.id==='pir'){const b=h('button',{class:'hold'},'Hold to wave a hand'),set=p=>{it.val.motion=p;b.classList.toggle('dn',p)};b.addEventListener('pointerdown',e=>{e.preventDefault();try{b.setPointerCapture(e.pointerId)}catch(_){}set(true)});['pointerup','pointercancel','lostpointercapture'].forEach(n=>b.addEventListener(n,()=>set(false)));rows.push(h('label',{},iname(it),b))}
   if(it.id==='pot')sl(it,'Knob','v',0,1,.01,v=>Math.round(v*100)+' %',v=>fx.knob(v));
   if(it.id==='ldr')sl(it,'Light level','light',0,1,.01,v=>v.toFixed(2));
   if(it.id==='dht11'){sl(it,'Air temperature','temp',0,45,1,v=>v+' °C');sl(it,'Humidity','hum',20,95,1,v=>v+' %')}
   if(it.id==='hcsr04')sl(it,'Distance to obstacle','dist',2,200,1,v=>v+' cm')});
  t.hidden=!rows.length;if(rows.length)t.append(h('span',{class:'mono'},'Try it'),...rows)}

 /* simulation */
 const S={t:0,dt:0,_e:{},_c:{},_o:{},it:k=>items.find(i=>i.key===k),fx:k=>S.it(k).g.userData.fx,val:(k,n)=>S.it(k).val[n],
  led:(k,b)=>S.fx(k).led(b),rgb:(k,r,g,b)=>S.fx(k).rgb(r,g,b),servo:(k,d)=>S.fx(k).servo(d),motor:(k,s)=>S.fx(k).motor(s,S.dt),oled:(k,L)=>S.fx(k).oled(L),
  beep:(k,f,d)=>{SND.beep(f,d);const x=S.fx(k);x.buzz(1);setTimeout(()=>x.buzz(0),60)},bled:(k,on)=>{const l=S.it(k).g.userData.leds.L;if(l)l.material.emissiveIntensity=on?2.6:0},
  every(p,fn,id='e'){if(S.t-(S._e[id]??-99)>=p){S._e[id]=S.t;fn()}},change(id,v,fn){if(S._c[id]!==v){S._c[id]=v;fn()}},once(id,fn){if(!S._o[id]){S._o[id]=1;fn()}},
  log(s){serial.push(s);if(serial.length>200)serial.shift();if(tab==='serial'){const e=$('#serial');if(e){e.textContent=serial.join('\n');$('#sbody').scrollTop=1e6}}}};
 function netHas(it,name,types){const mine=it.pins.filter(p=>p.name===name);return wires.some(w=>{const o=mine.includes(w.a.pin)?w.b:mine.includes(w.b.pin)?w.a:null;return o&&types.includes(o.pin.type)})}
 function freeSim(){items.forEach(it=>{const fx=it.g.userData.fx,g=netHas(it,'GND',['gnd']);if(it.id==='led')fx.led(g&&netHas(it,'SIG',['p5','p3'])?1:0);
   if(it.id==='rgb')fx.rgb(g&&netHas(it,'R',['p5','p3'])?1:0,g&&netHas(it,'G',['p5','p3'])?1:0,g&&netHas(it,'B',['p5','p3'])?1:0);
   if(it.id==='motor'){const f=netHas(it,'M+',['p5','p3'])&&netHas(it,'M−',['gnd']),r=netHas(it,'M−',['p5','p3'])&&netHas(it,'M+',['gnd']);fx.motor(f?1:r?-1:0,S.dt)}
   if(it.id==='buzzer'&&g&&netHas(it,'SIG',['p5','p3']))S.every(.5,()=>S.beep(it.key,1800,.08),'z'+it.uid)});
  S.once('f',()=>S.log('Bench powered · '+items.filter(i=>i.kind==='board').length+' board(s), '+wires.length+' wire(s), no shorts found.'))}
 function setPower(on){items.forEach(it=>{const L=it.g.userData.leds;if(L&&L.PWR)L.PWR.material.emissiveIntensity=on?2.4:0})}
 function resetFx(){items.forEach(it=>{const fx=it.g.userData.fx,L=it.g.userData.leds;if(fx.led)fx.led(0);if(fx.rgb)fx.rgb(0,0,0);if(fx.oled)fx.oled(null);if(fx.servo)fx.servo(90);if(L&&L.L&&L.L!==L.PWR)L.L.material.emissiveIntensity=0})}
 function run(){if(running){stop();return}SND.ac();if(mission){const left=steps.filter(s=>!s.done).length;if(left){toast(left+' wire'+(left>1?'s':'')+' still missing — follow the steps, or press "Wire it for me".','bad');SND.fx('bad');return}}else if(!items.some(i=>i.kind==='board'||i.id==='batt')){toast('Put a board or a battery on the bench first.','bad');return}
  if(mission){const dn=STORE.get('done',[]);if(!dn.includes(mission.n)){dn.push(mission.n);STORE.set('done',dn);head()}}{const d=bom();LOG.add('Workbench',bname(),d.lines,'run on the bench')}
  running=true;S.t=0;S._e={};S._c={};S._o={};serial=[];setPower(true);$('#bRun').textContent='Stop';$('#bRun').classList.add('stop');SND.fx('ok');hintText();render()}
 function stop(){if(!running)return;running=false;setPower(false);resetFx();$('#bRun').textContent='Run';$('#bRun').classList.remove('stop');hintText()}
 $('#bRun').onclick=run;

 function tick(dt,t){if(!fit(ren,cam,stage))return;orb.update(dt);
  smoke.tick(dt);iron.userData.glow.material.opacity=sold?.9:0;if(sold){sold.t+=dt/.75;sizT-=dt;if(sizT<0){sizT=.1;SND.fx('sizzle');smoke.puff(iron.position)}if(sold.t>=1){const k='s'+sold.end,w=sold.w;w[k]=!w[k];caps(w);SND.fx(w[k]?'ok':'snap');toast(w[k]?'Joint soldered — '+joints()+' on this build.':'Joint melted. The wire is loose again.',w[k]?'good':'');sold=null;render();commit()}}
  if(running){S.dt=dt;S.t+=dt;try{mission?mission.sim(S):freeSim()}catch(e){console.error(e);stop()}}
  let tg=targets();if(pend&&tg.some(x=>x.pin===pend.pin))tg=tg.filter(x=>x.pin!==pend.pin);const pu=1+.22*Math.sin(t*6);
  [[rA,cA,tg[0]],[rB,cB,tg[1]]].forEach(([r,c,x])=>{if(x&&!running){const p=wpos(x.it,x.pin);r.position.copy(p).y+=.6;r.scale.setScalar(pu);r.visible=true;const s=toScreen(p,cam,stage);c.style.display=s.ok?'':'none';c.style.left=s.x+'px';c.style.top=s.y+'px';c.textContent=x.pin.name}else{r.visible=false;c.style.display='none'}});
  if(hover&&!drag){rH.position.copy(wpos(hover.it,hover.pin)).y+=.7;rH.visible=true}else rH.visible=false;
  if(pend){rP.position.copy(wpos(pend.it,pend.pin)).y+=.8;rP.visible=true}else rP.visible=false;
  if(sel){const p=sel.type==='item'?sel.ref.g.position.clone().setY(sel.ref.h+8):sel.ref.mid.clone().setY(sel.ref.mid.y+6),s=toScreen(p,cam,stage);sb.style.left=clamp(s.x,90,stage.clientWidth-90)+'px';sb.style.top=Math.max(44,s.y)+'px'}
  ren.render(scene,cam)}
 Object.assign(BENCH,{tick,load,frame,snap,restore,bom,_:{orb,cam,scene,get items(){return items},get wires(){return wires},get steps(){return steps}},openBoard(id){load(-1);addItem(id,'board',0,10);render();mkTry();last=snap()}});
 load(0)}

