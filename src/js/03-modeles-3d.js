/* ───────── procedural 3D models: components, boards, modules ───────── */
const SIL=()=>mt('#d4d6d8',.36,.6),BLK=()=>mt('#161616',.5,.05),GOLD=()=>mt('#d9ab3d',.3,.95),DRK=()=>mt('#070707',.85),WHT=()=>mt('#ecebe6',.55);
let _hole={};
function holeTex(n,rows,light){const k=light?'l':'d';if(!_hole[k])_hole[k]=ctex(32,32,c=>{c.fillStyle=light?'#ece9e1':'#161616';c.fillRect(0,0,32,32);c.fillStyle=light?'#3a3936':'#000';c.fillRect(light?11:8,light?11:8,light?10:16,light?10:16);if(!light){c.strokeStyle='rgba(217,171,61,.35)';c.strokeRect(9,9,14,14)}});
 const t=_hole[k].clone();t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(n,rows);t.needsUpdate=true;return t}
function inst(geo,mat,pts){const m=new T.InstancedMesh(geo,mat,pts.length),d=new T.Object3D();pts.forEach((p,i)=>{d.position.set(p[0],p[1],p[2]);d.rotation.y=p[3]||0;d.updateMatrix();m.setMatrixAt(i,d.matrix)});m.castShadow=m.receiveShadow=true;m.computeBoundingBox();m.computeBoundingSphere();return m}
const P=2.54;
const K={
 chip(o){const hh=o.h||1.1,g=G(bx(o.w,hh,o.d,mt('#17181a',.42,.1),0,.15,0));if(o.legs!==0){const lm=mt('#bdbfc1',.35,.85);g.add(bx(+(o.w*.84).toFixed(2),.3,o.d+1.1,lm));if(o.quad!==0)g.add(bx(o.w+1.1,.3,+(o.d*.84).toFixed(2),lm))}
  g.add(o.t?label(o.t,o.w*.86,o.d*.8,hh+.17,{c:'rgba(205,205,200,.7)'}):cy(.32,.05,mt('#3c3c3c'),-o.w/2+.9,hh+.15,o.d/2-.9,10));return g},
 dip(o){return G(bx(o.w+1.6,1.5,o.d+2.8,mt('#1d1d1d',.6)),bx(o.w,3.3,o.d,mt('#17181a',.42,.1),0,1.5,0),bx(+(o.w*.95).toFixed(2),1.6,o.d+1.8,mt('#bdbfc1',.35,.85),0,1.5,0),label(o.t||'',o.w*.7,o.d*.55,4.82,{c:'rgba(205,205,200,.6)'}),cy(1,.05,mt('#0c0c0c'),-o.w/2+1.6,4.78,0,14))},
 can(o){return G(bx(o.w,o.h,o.d,mt('#c9ccce',.36,.6)),bx(o.w-1.2,.12,o.d-1.2,mt('#bcbfc1',.4,.6),0,o.h,0),o.t&&label(o.t,o.w*.74,o.d*.5,o.h+.14,{c:'rgba(60,60,60,.6)'}))},
 wmod(o){const cx=o.w/2-o.can/2-.8,aw=o.w-o.can-2.2,g=G(bx(o.w,.8,o.d,mt('#151617',.6)),bx(o.can,2.4,o.d-2,mt('#c9ccce',.36,.6),cx,.8,0),label(o.t,o.can*.8,(o.d-2)*.3,3.22,{c:'rgba(60,60,60,.65)'}));g.children[2].position.x=cx;
  const a=new T.Mesh(new T.PlaneGeometry(aw,o.d-2),new T.MeshStandardMaterial({transparent:true,metalness:.6,roughness:.4,map:ctex(128,256,(c,W,H)=>{c.strokeStyle='#d9ab3d';c.lineWidth=9;c.beginPath();c.moveTo(110,12);for(let i=0;i<7;i++){const y=12+i*34;c.lineTo(22,y);c.lineTo(22,y+17);c.lineTo(110,y+17);c.lineTo(110,y+34)}c.stroke()})}));a.rotation.x=-PI/2;a.position.set(-o.w/2+aw/2+.6,.83,0);g.add(a);return g},
 fh(o){const r=o.rows||1,g=G(bx(+(o.n*P).toFixed(2),8.5,+(r*P).toFixed(2),mt('#151515',.6)));const t=new T.Mesh(new T.PlaneGeometry(o.n*P,r*P),new T.MeshStandardMaterial({map:holeTex(o.n,r),roughness:.6}));t.rotation.x=-PI/2;t.position.y=8.52;g.add(t);return g},
 mh(o){const r=o.rows||1,dn=o.down,g=G(bx(+(o.n*P).toFixed(2),2.5,+(r*P).toFixed(2),BLK(),0,dn?-4.1:0,0)),L=dn?10.8:8.6,pts=[];
  for(let i=0;i<o.n;i++)for(let j=0;j<r;j++)pts.push([(i-(o.n-1)/2)*P,dn?-4.7:4.3,(j-(r-1)/2)*P]);g.add(inst(_g['pin'+L]||(_g['pin'+L]=new T.BoxGeometry(.64,L,.64)),GOLD(),pts));return g},
 pads(o){const pts=[];for(let i=0;i<o.n;i++)pts.push([(i-(o.n-1)/2)*P,.07,0]);return G(inst(_g.pad||(_g.pad=new T.BoxGeometry(1.7,.14,2.3)),GOLD(),pts))},
 usbB(){return G(bx(16,10.8,12,SIL()),bx(.5,7.2,8.6,DRK(),-7.85,1.9,0),bx(.7,3,5.6,WHT(),-7.85,4.2,0))},
 barrel(){return G(bx(14,10.8,9,BLK()),cyX(3.1,.6,DRK(),-6.9,6,0),cyX(1,1,SIL(),-7,6,0))},
 usbA(o){const c=mt(o.c,.5);return G(bx(17.5,15.6,13.2,SIL()),bx(.5,5.2,11.2,DRK(),-8.55,1.6,0),bx(.5,5.2,11.2,DRK(),-8.55,8.8,0),bx(.7,1.7,10,c,-8.6,3.3,0),bx(.7,1.7,10,c,-8.6,10.5,0),bx(17.5,.1,.3,mt('#9ea1a3',.4,.8),0,15.6,0))},
 rj45(){return G(bx(21,13.5,16,SIL()),bx(.5,9.6,11.8,DRK(),-10.3,2.1,0),bx(8,.12,.3,mt('#9ea1a3',.4,.8),-4,13.5,-3),bx(8,.12,.3,mt('#9ea1a3',.4,.8),-4,13.5,3))},
 ecap(){return G(bx(6.6,.8,6.6,BLK()),cy(3.15,7.4,SIL(),0,.8,0),bx(5.2,.06,1.7,mt('#1e1e1e'),0,8.2,-1.8))},
 xtal(o){const g=G(bx(11,3.6,4.6,SIL()),label('16.000',8,2.6,3.62,{c:'rgba(70,70,70,.55)'}));g.scale.setScalar(o.s||1);return g},
 led(o){const m=new T.MeshStandardMaterial({color:o.c,emissive:o.c,emissiveIntensity:o.on?2.4:0,roughness:.35});const e=bx(1.7,.75,.9,m);e.userData.led=1;e.userData.noTint=1;return G(bx(2.6,.2,1.1,SIL()),e)},
 btn(o){const g=G(bx(6,3.4,6,SIL()),cy(1.75,1.3,mt(o.c||'#222',.5),0,3.4,0,16));g.scale.setScalar(o.s||1);return g},
 musb(o){const g=G(bx(5.6,2.7,7.6,SIL()),bx(.4,1.5,6.2,DRK(),-2.65,.6,0));if(o.big)g.scale.set(1.5,1.45,1.05);return g},
 usbc(){return G(bx(7.3,3.2,8.9,SIL()),bx(.4,1.7,7.2,DRK(),-3.5,.75,0))},
 mhdmi(){return G(bx(7.5,3,6.5,SIL()),bx(.4,1.6,5.2,DRK(),-3.6,.7,0))},
 jack(){return G(bx(12,6,7,BLK()),cyX(3,2.6,BLK(),-7.2,3,0),cyX(1.7,.3,DRK(),-8.5,3,0))},
 fpc(){return G(bx(22,2.7,3,mt('#e7dcc6',.6),0,0,-1.2),bx(22.6,2.9,2.6,mt('#4b3426',.6),0,0,1.5))},
 reg(){return G(bx(6.5,1.6,3.5,mt('#17181a',.45)),bx(3,.5,2,SIL(),0,0,2.4),bx(5,.5,1.2,SIL(),0,0,-2.2))},
 jmp(){return G(bx(2.4,6,5,mt('#e3c21c',.5),0,2.5,0))},
 sd(){return G(bx(12,1.4,11.5,SIL(),0,-3,0),bx(11,1,15,BLK(),-5,-2.8,0))}
};
function pinType(n){if(/^(GND|AGND|−)$/.test(n))return'gnd';if(/^(5V|VBUS|\+)$/.test(n))return'p5';if(n==='3V3')return'p3';if(/^(VCC|VIN|VSYS|HV|LV|12V)$/.test(n))return'vcc';return'sig'}
function pinDesc(def,n){const x=def.pinx&&def.pinx[n];if(x)return x;const f=def.pinf&&def.pinf(n);if(f)return f;let m;
 if(/GND/.test(n))return'ground · the 0 V reference every circuit returns to';if(n==='5V')return'5 V power output for sensors and modules';if(n==='3V3')return'3.3 V regulated output for low-voltage parts';
 if(n==='VIN')return'raw supply input, 7–12 V';if(n==='AREF')return'reference voltage for the analog inputs';if(n==='IOREF')return'tells shields which logic voltage the board uses';
 if(/^(RESET|RST|EN|RUN)$/.test(n))return'pull LOW to restart the chip';if(n==='NC')return'not connected';
 if((m=/^D(\d+)$/.exec(n)))return'digital I/O'+(def.pwm&&def.pwm.includes(+m[1])?' · PWM':'')+(def.volt<5?' · 3.3 V logic':'');
 if(/^A\d+$/.test(n))return'analog input · reads 0 … '+def.volt+' V';if(/^GP\d+$/.test(n))return'GPIO '+n.slice(2)+' · general-purpose I/O · 3.3 V logic';
 if(/^TX/.test(n))return'serial TX — sends data';if(/^RX/.test(n))return'serial RX — receives data';return'board pin'}

function pcbTex(def,boxes,bare){const s=16,W=Math.round(def.w*s),H=Math.round(def.d*s),R=rng(def.id.length*977+Math.round(def.w*13));
 return ctex(W,H,c=>{c.fillStyle=def.color;c.fillRect(0,0,W,H);c.lineCap=c.lineJoin='round';
  for(let i=0;i<Math.round(def.w*def.d/55);i++){c.strokeStyle=shade(def.color,R()<.55?.045:-.035);c.lineWidth=(.22+R()*.3)*s;c.beginPath();let x=R()*W,y=R()*H;c.moveTo(x,y);for(let j=0;j<3;j++){const L=(2+R()*12)*s,a=Math.floor(R()*8)*PI/4;x+=Math.cos(a)*L;y+=Math.sin(a)*L;c.lineTo(x,y)}c.stroke();c.fillStyle=shade(def.color,.13);c.beginPath();c.arc(x,y,.42*s,0,7);c.fill()}
  def.holes.forEach(([x,z])=>{c.fillStyle='#c9a13c';c.beginPath();c.arc(x*s,z*s,2.7*s,0,7);c.fill();c.fillStyle='#24241f';c.beginPath();c.arc(x*s,z*s,1.45*s,0,7);c.fill()});
  boxes.forEach(b=>{const x=(b.min.x+def.w/2)*s,y=(b.min.z+def.d/2)*s,w=(b.max.x-b.min.x)*s,hh=(b.max.z-b.min.z)*s;c.fillStyle='rgba(215,220,222,.5)';const n=Math.max(2,Math.round(w/(1.3*s)));for(let i=0;i<n;i++){c.fillRect(x+i*w/n+w/n*.25,y-.25*s,w/n*.5,.7*s);c.fillRect(x+i*w/n+w/n*.25,y+hh-.45*s,w/n*.5,.7*s)}
   c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=.14*s;c.strokeRect(x-.3*s,y-.3*s,w+.6*s,hh+.6*s)});
  c.fillStyle='rgba(255,255,255,.93)';c.textAlign='center';c.textBaseline='middle';def.silk.forEach(([t,x,z,sz])=>{c.font='700 '+sz*s+'px Helvetica,Arial,sans-serif';c.fillText(t,x*s,z*s)})})}

function buildBoard(def,opt={}){const g=new T.Group(),lift=opt.bench?(def.down?12:.6):(def.down?8.6:.5),top=lift+1.6,U=g.userData={def,parts:[],pins:[],leds:{},fx:{},lift,base:new T.Group()};g.add(U.base);
 const pm={};def.parts.forEach(([id,name,desc])=>{const pg=new T.Group();pg.userData.part=id;g.add(pg);const p={id,name,desc,group:pg};pm[id]=p;U.parts.push(p)});
 const boxes=[];
 def.comps.forEach(([k,x,z,o])=>{const c=K[k](o);c.position.set(x-def.w/2,top,z-def.d/2);const a=(o.r||0)*PI/180;c.rotation.y=a;(o.p?pm[o.p].group:U.base).add(c);
  c.updateMatrixWorld(true);const b=new T.Box3().setFromObject(c);if(k!=='sd')boxes.push(b);
  if(o.k)c.traverse(m=>{if(m.userData.led)U.leds[o.k]=m});if(o.on)c.traverse(m=>{if(m.userData.led)U.leds.PWR=m});
  if(o.pins){const r=o.rows||1,py=top+(k==='fh'?8.6:k==='pads'?.3:o.down?.9:8.7);o.pins.forEach((nm,i)=>{const col=r>1?Math.floor(i/r):i,row=r>1?i%r:0,lx=(col-(o.n-1)/2)*P,lz=r>1?(row-(r-1)/2)*P:0;
    U.pins.push({name:nm,pos:new V3(c.position.x+lx*Math.cos(a)+lz*Math.sin(a),py,c.position.z-lx*Math.sin(a)+lz*Math.cos(a)),type:pinType(nm),info:pinDesc(def,nm)})})}});
 const pcb=new T.Mesh(rrGeo(def.w,def.d,def.id==='pi4'?3:1.2,1.6),mt(shade(def.color,-.06),.55));pcb.position.y=lift;sh(pcb);U.base.add(pcb);
 const face=new T.Mesh(rrGeo(def.w,def.d,def.id==='pi4'?3:1.2),new T.MeshStandardMaterial({map:pcbTex(def,boxes),roughness:.62,metalness:0,envMapIntensity:.45}));face.material.map.repeat.set(1/def.w,1/def.d);face.material.map.offset.set(.5,.5);face.position.y=top+.02;face.receiveShadow=true;U.base.add(face);
 /* tiny SMD passives */
 const R=rng(def.w*31+def.d),tan=[],blk=[],sot=[],N=Math.round(def.w*def.d/36);let tries=0;
 while(tan.length+blk.length+sot.length<N&&tries++<N*30){const x=(R()-.5)*(def.w-4),z=(R()-.5)*(def.d-4);if(boxes.some(b=>x>b.min.x-1.6&&x<b.max.x+1.6&&z>b.min.z-1.4&&z<b.max.z+1.4))continue;if(def.holes.some(hh=>Math.hypot(hh[0]-def.w/2-x,hh[1]-def.d/2-z)<4))continue;
  const rot=R()<.5?0:PI/2,q=R();(q<.5?tan:q<.85?blk:sot).push([x,top+(q<.85?.3:.5),z,rot])}
 U.base.add(inst(_g.s1||(_g.s1=new T.BoxGeometry(1.2,.5,.65)),mt('#a4845f',.6),tan),inst(_g.s2||(_g.s2=new T.BoxGeometry(1.2,.45,.65)),mt('#1c1c1c',.5),blk),inst(_g.s3||(_g.s3=new T.BoxGeometry(2.9,1,1.5)),mt('#17181a',.45),sot));
 if(opt.bench&&def.down){const L=def.w+8,D=Math.max(34,def.d+15),bb=G(bx(+L.toFixed(1),9.5,+D.toFixed(1),mt('#ebe7df',.7)));const t=new T.Mesh(new T.PlaneGeometry(L-3,D-3),new T.MeshStandardMaterial({map:holeTex(Math.round((L-3)/P),Math.round((D-3)/P),1),roughness:.7}));t.rotation.x=-PI/2;t.position.y=9.53;t.receiveShadow=true;bb.add(t,bx(+L.toFixed(1),.1,1.6,mt('#d8d3c8',.7),0,9.5,0));U.base.add(bb)}
 g.updateMatrixWorld(true);U.parts.forEach(p=>{p.box=new T.Box3().setFromObject(p.group);p.center=p.box.getCenter(new V3());p.size=p.box.getSize(new V3())});
 U.box=new T.Box3().setFromObject(g);return g}

/* ── bench modules ── */
let _glow;function glow(c){if(!_glow)_glow=ctex(64,64,(x)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)});
 const s=new T.Sprite(new T.SpriteMaterial({map:_glow,color:c,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false}));s.scale.setScalar(34);return s}
const PINFO={SIG:'signal input',VCC:'power input · 3.3 – 5 V',GND:'ground · connect to the board\'s GND',OUT:'signal output',DATA:'one-wire data output',TRIG:'trigger input · start a measurement',ECHO:'echo output · HIGH for the travel time',SDA:'I²C data',SCL:'I²C clock',R:'red LED input',G:'green LED input',B:'blue LED input',
 'M+':'motor terminal','M−':'motor terminal','+':'battery positive · about 6 V','−':'battery negative · ground','12V':'motor supply input · 5 – 12 V','5V':'5 V logic supply output',ENA:'enable A · PWM sets motor A speed',ENB:'enable B · PWM sets motor B speed',IN1:'direction input, motor A',IN2:'direction input, motor A',IN3:'direction input, motor B',IN4:'direction input, motor B',
 OUT1:'output to motor A',OUT2:'output to motor A',OUT3:'output to motor B',OUT4:'output to motor B',HV:'high-voltage reference · 5 V',LV:'low-voltage reference · 3.3 V'};
function buildMod(id,o={}){const g=new T.Group(),U=g.userData={mod:MOD[id],pins:[],fx:{}};
 const pcb=(w,d,c)=>g.add(bx(w,1.6,d,mt(c,.55)));
 const pin=(n,x,y,z)=>U.pins.push({name:n,pos:new V3(x,y,z),type:pinType(n),info:PINFO[n]||(/^[HL]V\d$/.test(n)?(n[0]==='H'?'5 V side of channel ':'3.3 V side of channel ')+n[2]:'pin')});
 const hdr=(names,x,z,r=0)=>{const n=names.length,a=r*PI/180,m=K.mh({n});m.position.set(x,1.6,z);m.rotation.y=a;g.add(m);names.forEach((nm,i)=>{const lx=(i-(n-1)/2)*P;pin(nm,x+lx*Math.cos(a),10.4,z-lx*Math.sin(a))})};
 const RED='#b0281f',BLU='#2455a8',BK='#1a1b1d';
 ({led(){pcb(15,19,BK);const c=o.c||'#ff3b28',m=new T.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.04,transparent:true,opacity:.88,roughness:.2});const d=G(cy(2.9,1,m,0,1.6,-3.5),cy(2.5,4.6,m,0,2.6,-3.5),sp(2.5,m,0,7.2,-3.5));d.traverse(x=>x.userData.noTint=1);const gl=glow(c);gl.position.set(0,7,-3.5);g.add(d,gl,bx(3,.6,1.4,mt('#111'),0,1.6,2.2));hdr(['SIG','GND'],0,6.6);U.fx.led=b=>{m.emissiveIntensity=.04+b*3.2;gl.material.opacity=b*.85}},
  rgb(){pcb(15,19,RED);const m=new T.MeshStandardMaterial({color:'#f4f4f0',emissive:'#000',emissiveIntensity:2.6,transparent:true,opacity:.9,roughness:.25});const gl=glow('#fff');gl.position.set(0,7,-3.5);g.add(cy(2.9,1,m,0,1.6,-3.5),cy(2.5,4.6,m,0,2.6,-3.5),sp(2.5,m,0,7.2,-3.5),gl);hdr(['R','G','B','GND'],0,6.6);U.fx.rgb=(r,gg,b)=>{m.emissive.setRGB(r,gg,b);gl.material.color.setRGB(r,gg,b);gl.material.opacity=Math.max(r,gg,b)*.85}},
  buzzer(){pcb(16,23,RED);const top=cy(6,6.5,BLK(),0,1.6,-4);g.add(top,cy(1.1,.1,DRK(),0,8.1,-4,12),label('+',3,3,8.12,{c:'#888'}));g.children[g.children.length-1].position.set(-3.6,8.12,-4);hdr(['SIG','GND'],0,8.4);U.fx.buzz=k=>{top.scale.setScalar(1+k*.05)}},
  oled(){pcb(27,27,BLU);const cv=document.createElement('canvas');cv.width=128;cv.height=64;const tx=new T.CanvasTexture(cv);tx.colorSpace=T.SRGBColorSpace;tx.magFilter=T.NearestFilter;const scr=new T.Mesh(new T.PlaneGeometry(22,11),new T.MeshBasicMaterial({map:tx}));scr.rotation.x=-PI/2;scr.position.set(0,3.02,1.5);g.add(bx(25.5,1.4,15.5,mt('#08080a',.15,.2),0,1.6,1.5),scr);hdr(['GND','VCC','SCL','SDA'],0,-11);
   U.fx.oled=L=>{const c=cv.getContext('2d');c.fillStyle='#020304';c.fillRect(0,0,128,64);if(L){c.fillStyle='#9fe3ff';c.font='bold 15px monospace';c.textBaseline='middle';L.forEach((l,i)=>c.fillText(l,6,18+i*26))}tx.needsUpdate=true};U.fx.oled(null)},
  button(){pcb(14,24,BLU);const cap=cy(3.3,3.4,mt('#c92a1e',.4),0,5,-4.5);g.add(bx(7,3.4,7,SIL(),0,1.6,-4.5),cap);hdr(['VCC','OUT','GND'],0,8.6);U.fx.press=p=>{cap.position.y=p?5.2:6.7}},
  pot(){pcb(16,26,BK);const kn=G(cy(3.2,9,mt('#111',.5),0,0,0,20),bx(.7,.3,3,WHT(),0,9,-1.5));kn.position.set(0,6.6,-4.5);g.add(bx(9.6,5,9.6,mt('#2a5fb5',.5),0,1.6,-4.5),kn);hdr(['VCC','OUT','GND'],0,9.6);U.fx.knob=v=>{kn.rotation.y=(.5-v)*4.7}},
  hcsr04(){pcb(45,20,BLU);[-13,13].forEach(x=>g.add(cy(8,12,SIL(),x,1.6,-1.5,28),cy(6.8,.2,mt('#1b1b1b',.9),x,13.6,-1.5,28)));g.add(bx(8,3,3.5,SIL(),0,1.6,-5.5));hdr(['VCC','TRIG','ECHO','GND'],0,7.6)},
  dht11(){pcb(15,29,BK);g.add(bx(12,5.6,15.6,mt('#3a9fe0',.5),0,1.6,-5.5),label('▪ ▪ ▪\n▪ ▪ ▪\n▪ ▪',9,11,7.24,{c:'rgba(10,40,80,.75)'}));g.children[g.children.length-1].position.z=-5.5;hdr(['VCC','DATA','GND'],0,11.4)},
  ldr(){pcb(33,14,BLU);g.add(bx(6.6,5,6.6,mt('#2a6fd6',.45),-1,1.6,0),cy(1.2,.4,GOLD(),-1,6.6,0,12),bx(5,1.5,4,BLK(),7,1.6,0),cy(.4,4.5,SIL(),12.6,1.6,-1.2,8),cy(.4,4.5,SIL(),12.6,1.6,1.2,8),cy(2.6,1.8,mt('#efe6d0',.5),12.6,6,0,20),cy(2,.1,mt('#c96a3a',.6),12.6,7.8,0,20));hdr(['VCC','GND','OUT'],-13.6,0,90)},
  pir(){pcb(32,25,'#1f7a3c');const dm=sp(11.3,mt('#f3f1ea',.45,0,{transparent:true,opacity:.95}),0,5.2,-2);dm.scale.y=.85;g.add(bx(23,3.6,23,WHT(),0,1.6,-2),dm,cy(2,3,mt('#e0802a',.5),-11,1.6,9.5,12),cy(2,3,mt('#e0802a',.5),-5.5,1.6,9.5,12));hdr(['VCC','OUT','GND'],7,10)},
  servo(){const b=mt('#2f66d0',.4),horn=G(cy(3.5,1.8,WHT(),0,0,0,20),bx(15,1.3,5,WHT(),7,.2,0),cy(2.5,1.3,WHT(),14.5,.2,0,16));horn.position.set(5.5,27.4,0);
   g.add(bx(22.6,22,12.3,b),bx(32.5,2.5,12.3,b,0,15.5,0),cy(5.9,4.6,b,5.5,22,0,24),cy(2.3,.9,WHT(),5.5,26.6,0,14),horn);
   [['#e08a2c',-P],['#b5302a',0],['#4a2c1c',P]].forEach(([c,z])=>g.add(tube([[-11,5,z*.5],[-22,3,6+z*.6],[-36,1.6,12+z],[-44,1.6,12+z]],.75,mt(c,.6),24)));g.add(bx(8,2.7,7.9,BLK(),-48,0,12));['SIG','VCC','GND'].forEach((n,i)=>pin(n,-49.5,3,12+(i-1)*P));U.fx.servo=d=>{horn.rotation.y=(90-d)*PI/180};U.fx.servo(90)},
  motor(){const y=mt('#e7c12c',.5),wh=G(cy(32.5,26,mt('#151515',.9),0,0,0,40),cy(24.5,26.6,y,0,0,0,32),cy(5,27.4,y,0,0,0,16));[0,1,2].forEach(i=>{const a=i*PI*2/3;wh.add(cy(6.5,27,mt('#b08f18',.7),Math.cos(a)*14,0,Math.sin(a)*14,16))});for(let i=0;i<24;i++){const a=i*PI/12,t=bx(3,26,5,mt('#101010',.95),Math.cos(a)*32.6,0,Math.sin(a)*32.6);t.rotation.y=-a;wh.add(t)}wh.position.set(-12,20,0);
   g.add(bx(37,19,22.5,y,0,0,0),cyX(9.6,22,mt('#d6d6d2',.35,.7),29.5,9.5,0,24),cyX(8.6,6,WHT(),43,9.5,0,24),cy(2.6,3,WHT(),-12,19,0,12),wh,bx(2,.4,4,GOLD(),45.5,13,-4),bx(2,.4,4,GOLD(),45.5,13,4));pin('M+',45.5,13.6,-4);pin('M−',45.5,13.6,4);U.fx.motor=(s,dt)=>{wh.rotation.y+=s*dt*7}},
  l298n(){pcb(43,43,RED);for(let i=0;i<7;i++)g.add(bx(1.3,25,23,mt('#141414',.5,.3),-9+i*3,1.6,-9));g.add(bx(20,3,23,mt('#141414',.5,.3),0,1.6,-9),bx(15,19,4.4,BLK(),0,1.6,4.5),cy(4,10,BLK(),-14,1.6,12,18),cy(4,10,BLK(),15.5,1.6,-16,18));
   const tb=(x,z,w,d)=>g.add(bx(w,10,d,mt('#2a6fd6',.45),x,1.6,z));tb(-17.5,-4,8,10.2);tb(17.5,-4,8,10.2);tb(-9,17,15.3,8);
   pin('OUT1',-17.5,11.8,-6.5);pin('OUT2',-17.5,11.8,-1.5);pin('OUT3',17.5,11.8,-6.5);pin('OUT4',17.5,11.8,-1.5);pin('12V',-14,11.8,17);pin('GND',-9,11.8,17);pin('5V',-4,11.8,17);
   U.pins.forEach(p=>g.add(cy(1.5,.3,SIL(),p.pos.x,11.5,p.pos.z,12)));hdr(['ENA','IN1','IN2','IN3','IN4','ENB'],11,18.5)},
  batt(){g.add(bx(62,2.5,60,BLK()),bx(62,13,2,BLK(),0,0,-30),bx(62,13,2,BLK(),0,0,30),bx(2,13,60,BLK(),-31,0,0),bx(2,13,60,BLK(),31,0,0));
   [-21,-7,7,21].forEach((z,i)=>{const f=i%2?-1:1;g.add(cyX(7,44,mt('#2848b0',.35,.2),0,10,z,24),cyX(7.05,5,GOLD(),f*24.5,10,z,24),cyX(7.05,3,mt('#b9bbbd',.3,.9),-f*23.6,10,z,24),cyX(2.4,2.2,GOLD(),f*28,10,z,14));const l=label((f>0?'−  AA 1.5V  +':'+  AA 1.5V  −'),34,6,17.05,{c:'#fff',b:'700 '});l.position.z=z;g.add(l)});
   g.add(tube([[-31,6,-6],[-38,4,-7],[-44,2,-7]],.9,mt('#c63a2b',.6),12),tube([[-31,6,6],[-38,4,7],[-44,2,7]],.9,mt('#1c1c1c',.6),12),cy(1.1,1.5,GOLD(),-45,1.2,-7,10),cy(1.1,1.5,GOLD(),-45,1.2,7,10));pin('+',-45,3,-7);pin('−',-45,3,7)},
  llc(){pcb(16.5,14,RED);[[-3.2,-1.3],[3.2,-1.3],[-3.2,1.3],[3.2,1.3]].forEach(([x,z])=>g.add(bx(2.9,1,1.5,BLK(),x,1.6,z)));hdr(['HV1','HV2','HV','GND','HV3','HV4'],0,-5.4);hdr(['LV1','LV2','LV','GND','LV3','LV4'],0,5.4)}
 })[id]();
 g.updateMatrixWorld(true);U.box=new T.Box3().setFromObject(g);return g}

/* thumbnails rendered once into data-URLs */
function makeThumbs(){const cv=document.createElement('canvas'),r=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});r.setPixelRatio(1);r.setSize(260,180,false);r.toneMapping=T.ACESFilmicToneMapping;r.outputColorSpace=T.SRGBColorSpace;
 const sc=new T.Scene();sc.environment=mkEnv(r);sc.add(new T.HemisphereLight('#fff','#9a948a',.7));const d=new T.DirectionalLight('#fff',2);d.position.set(-1,3,2);sc.add(d);const cam=new T.PerspectiveCamera(26,260/180,1,3000),out={};
 const shot=(id,obj)=>{sc.add(obj);const b=new T.Box3().setFromObject(obj),c=b.getCenter(new V3()),s=b.getSize(new V3()),R=Math.max(s.x,s.z*1.2,s.y*1.4)*1.55+30;cam.position.set(c.x+R*.55,c.y+R*.75,c.z+R*.85);cam.lookAt(c);r.render(sc,cam);out[id]=cv.toDataURL('image/png');sc.remove(obj)};
 BOARDS.forEach(b=>shot(b.id,buildBoard(b)));MODS.forEach(m=>shot(m[0],buildMod(m[0])));r.dispose();try{r.forceContextLoss()}catch(e){}return out}

