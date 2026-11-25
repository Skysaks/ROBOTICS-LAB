/* ───────── core helpers ───────── */
const T=THREE,V3=T.Vector3,PI=Math.PI;
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,k)=>a+(b-a)*k;
function h(tag,attrs,...kids){const e=document.createElement(tag);for(const k in attrs||{}){const v=attrs[k];if(k==='html')e.innerHTML=v;else if(k.startsWith('on'))e.addEventListener(k.slice(2),v);else if(v!==false&&v!=null)e.setAttribute(k,v)}kids.flat().forEach(c=>c!=null&&e.append(c));return e}
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let toastT;function toast(msg,kind){const t=$('#toast');t.textContent=msg;t.className='on '+(kind||'');clearTimeout(toastT);toastT=setTimeout(()=>t.className='',kind==='bad'?4200:2600)}

/* materials + geometry cache */
const _m={},_g={};
function mt(c,r=.6,m=0,x){const k=c+'|'+r+'|'+m+(x?JSON.stringify(x):'');return _m[k]||(_m[k]=new T.MeshStandardMaterial(Object.assign({color:c,roughness:r,metalness:m},x)))}
function sh(o){o.castShadow=o.receiveShadow=true;return o}
function bx(w,hh,d,m,x=0,y=0,z=0){const k='b'+w+','+hh+','+d;const g=_g[k]||(_g[k]=new T.BoxGeometry(w,hh,d));const o=new T.Mesh(g,m);o.position.set(x,y+hh/2,z);return sh(o)}
function cy(r,hh,m,x=0,y=0,z=0,s=24,r2){const k='c'+r+','+hh+','+s+','+r2;const g=_g[k]||(_g[k]=new T.CylinderGeometry(r2==null?r:r2,r,hh,s));const o=new T.Mesh(g,m);o.position.set(x,y+hh/2,z);return sh(o)}
function cyX(r,len,m,x=0,y=0,z=0,s=20,r2){const o=cy(r,len,m,0,0,0,s,r2);o.rotation.z=PI/2;o.position.set(x,y,z);return o}
function sp(r,m,x=0,y=0,z=0){const k='s'+r;const g=_g[k]||(_g[k]=new T.SphereGeometry(r,20,14));const o=new T.Mesh(g,m);o.position.set(x,y,z);return sh(o)}
function G(...k){const g=new T.Group();k.flat().forEach(c=>c&&g.add(c));return g}
function rrGeo(w,d,r,hh){const s=new T.Shape(),x=-w/2,y=-d/2;r=Math.min(r,w/2,d/2);s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+d-r);s.quadraticCurveTo(x+w,y+d,x+w-r,y+d);s.lineTo(x+r,y+d);s.quadraticCurveTo(x,y+d,x,y+d-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
 const g=hh?new T.ExtrudeGeometry(s,{depth:hh,bevelEnabled:false,curveSegments:8}):new T.ShapeGeometry(s,8);g.rotateX(-PI/2);return g}
function rr(w,d,r,hh,m,x=0,y=0,z=0){const o=new T.Mesh(rrGeo(w,d,r,hh),m);o.position.set(x,y,z);return sh(o)}
function tube(pts,r,m,seg=40){const c=new T.CatmullRomCurve3(pts.map(p=>new V3(...p)));return sh(new T.Mesh(new T.TubeGeometry(c,seg,r,8),m))}
function ctex(w,hh,draw){const c=document.createElement('canvas');c.width=w;c.height=hh;draw(c.getContext('2d'),w,hh);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;return t}
function label(text,w,d,y,o={}){const s=o.s||40,W=Math.max(16,Math.round(w*s)),H=Math.max(16,Math.round(d*s));
 const tx=ctex(W,H,(c)=>{if(o.bg){c.fillStyle=o.bg;c.fillRect(0,0,W,H)}c.fillStyle=o.c||'rgba(210,210,205,.75)';const L=String(text).split('\n');const fs=Math.min(H/(L.length*1.25),W/(Math.max(...L.map(l=>l.length))*.62))*(o.k||1);c.font=(o.b||'600 ')+fs+'px '+(o.f||'Helvetica,Arial,sans-serif');c.textAlign='center';c.textBaseline='middle';L.forEach((l,i)=>c.fillText(l,W/2,H/2+(i-(L.length-1)/2)*fs*1.15))});
 const p=new T.Mesh(new T.PlaneGeometry(w,d),new T.MeshStandardMaterial({map:tx,transparent:!o.bg,roughness:.6,polygonOffset:true,polygonOffsetFactor:-2}));p.rotation.x=-PI/2;p.position.y=y;p.receiveShadow=true;return p}
function shade(hex,k){const c=new T.Color(hex);c.offsetHSL(0,0,k);return'#'+c.getHexString()}

/* tweens */
const TW=[];const ease=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
function tween(dur,fn){return new Promise(r=>{TW.push({t:0,dur,fn,r})})}
function tickTW(dt){for(let i=TW.length-1;i>=0;i--){const a=TW[i];a.t+=dt;const k=Math.min(1,a.t/a.dur);a.fn(ease(k),k);if(k>=1){TW.splice(i,1);a.r()}}}
function moveTo(o,p,dur=.5,arc=0){const s=o.position.clone();return tween(dur,k=>{o.position.lerpVectors(s,p,k);o.position.y+=Math.sin(k*PI)*arc})}
const wait=s=>tween(s,()=>{});

/* environment map + lights shared by every scene */
function mkEnv(renderer){const s=new T.Scene();s.background=new T.Color('#b9b6b0');
 const e=(c,i)=>new T.MeshBasicMaterial({color:new T.Color(c).multiplyScalar(i)});
 const a=new T.Mesh(new T.BoxGeometry(8,.2,8),e('#ffffff',2.2));a.position.set(0,6,0);s.add(a);
 const b=new T.Mesh(new T.BoxGeometry(.2,5,6),e('#ffe9c8',1.6));b.position.set(-7,2,0);s.add(b);
 const c=new T.Mesh(new T.BoxGeometry(.2,4,6),e('#cfe2ff',1.1));c.position.set(7,1,2);s.add(c);
 const d=new T.Mesh(new T.BoxGeometry(20,.2,20),e('#6c665c',.5));d.position.set(0,-4,0);s.add(d);
 const p=new T.PMREMGenerator(renderer);const t=p.fromScene(s,.04).texture;p.dispose();return t}
function mkRenderer(canvas,alpha){const r=new T.WebGLRenderer({canvas,antialias:true,alpha:!!alpha,powerPreference:'high-performance'});
 r.setPixelRatio(Math.min(devicePixelRatio||1,2));r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=.8;r.outputColorSpace=T.SRGBColorSpace;return r}
function lights(scene,size=260){scene.add(new T.HemisphereLight('#ffffff','#8a8478',.38));
 const d=new T.DirectionalLight('#fff4e2',2.7);d.position.set(-140,330,170);d.castShadow=true;d.shadow.mapSize.set(2048,2048);const c=d.shadow.camera;c.left=-size;c.right=size;c.top=size;c.bottom=-size;c.near=50;c.far=900;d.shadow.bias=-.0006;d.shadow.normalBias=.6;d.shadow.radius=5;scene.add(d);
 const f=new T.DirectionalLight('#dbe8ff',.5);f.position.set(200,150,-120);scene.add(f);return d}
function fit(renderer,cam,el){const w=el.clientWidth,hh=el.clientHeight;if(!w||!hh)return false;const c=renderer.domElement;if(c.width!==Math.round(w*renderer.getPixelRatio())||c.height!==Math.round(hh*renderer.getPixelRatio())){renderer.setSize(w,hh,false);cam.aspect=w/hh;cam.updateProjectionMatrix()}return true}

/* orbit camera */
class Orbit{constructor(cam,dom,o){Object.assign(this,{cam,dom,t:new V3(),gt:new V3(),r:240,gr:240,th:.6,gth:.6,ph:1,gph:1,minR:25,maxR:1100,minPh:.02,maxPh:1.5,auto:0,block:false,wheel:true,moved:0,pts:new Map(),pinch:0},o||{});
  dom.addEventListener('pointerdown',e=>{this.moved=0;if(this.block)return;this.pts.set(e.pointerId,[e.clientX,e.clientY]);this.btn=e.button;this.shift=e.shiftKey;this.pinch=0;try{dom.setPointerCapture(e.pointerId)}catch(_){}});
  dom.addEventListener('pointermove',e=>{const p=this.pts.get(e.pointerId);if(!p)return;const dx=e.clientX-p[0],dy=e.clientY-p[1];p[0]=e.clientX;p[1]=e.clientY;this.moved+=Math.abs(dx)+Math.abs(dy);
   if(this.pts.size>=2){const a=[...this.pts.values()];const dd=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);if(this.pinch)this.gr=clamp(this.gr*this.pinch/dd,this.minR,this.maxR);this.pinch=dd;return}
   if(this.btn===2||this.shift){const k=this.r*.0016,cx=Math.cos(this.th),sx=Math.sin(this.th);this.gt.x-=(dx*cx+dy*sx)*k;this.gt.z-=(-dx*sx+dy*cx)*k}
   else{this.gth-=dx*.0065;this.gph=clamp(this.gph-dy*.005,this.minPh,this.maxPh)}});
  const up=e=>{this.pts.delete(e.pointerId);this.pinch=0};dom.addEventListener('pointerup',up);dom.addEventListener('pointercancel',up);
  dom.addEventListener('contextmenu',e=>e.preventDefault());
  dom.addEventListener('wheel',e=>{if(!this.wheel&&!e.ctrlKey)return;e.preventDefault();this.gr=clamp(this.gr*Math.exp(e.deltaY*(e.ctrlKey?.01:.0012)),this.minR,this.maxR)},{passive:false})}
 set(o,snap){for(const k in o){if(k==='t')this.gt.copy(o.t);else this['g'+k]=o[k]}if(snap){this.t.copy(this.gt);this.r=this.gr;this.th=this.gth;this.ph=this.gph}}
 update(dt){if(this.auto&&!this.pts.size)this.gth+=this.auto*dt;const k=1-Math.exp(-dt*7);this.t.lerp(this.gt,k);this.r=lerp(this.r,this.gr,k);this.th=lerp(this.th,this.gth,k);this.ph=lerp(this.ph,this.gph,k);
  const s=Math.sin(this.ph);this.cam.position.set(this.t.x+this.r*s*Math.sin(this.th),this.t.y+this.r*Math.cos(this.ph),this.t.z+this.r*s*Math.cos(this.th));this.cam.lookAt(this.t)}}
const _ray=new T.Raycaster(),_v2=new T.Vector2();
function rayFrom(e,cam,dom){const b=dom.getBoundingClientRect();_v2.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);_ray.setFromCamera(_v2,cam);return _ray}
function pick(e,cam,dom,objs,rec=true){return rayFrom(e,cam,dom).intersectObjects(objs,rec)}
function onPlane(e,cam,dom,y=0){const r=rayFrom(e,cam,dom),p=new V3();return r.ray.intersectPlane(new T.Plane(new V3(0,1,0),-y),p)?p:null}
const _p=new V3();function toScreen(v,cam,dom){_p.copy(v).project(cam);return{x:(_p.x+1)/2*dom.clientWidth,y:(1-_p.y)/2*dom.clientHeight,ok:_p.z<1}}
function tint(group,on,color='#c9472f',k=.55){group.traverse(o=>{if(!o.isMesh||o.userData.noTint)return;if(on){if(!o.userData.om)o.userData.om=o.material;const key='hl'+color+k;let m=o.userData.om.userData[key];if(!m){m=o.userData.om.clone();m.emissive=new T.Color(color);m.emissiveIntensity=k;o.userData.om.userData[key]=m}o.material=m}else if(o.userData.om){o.material=o.userData.om}})}

/* sound: tiny synth for UI, buzzer and a generative lofi loop */
const SND={on:true,ctx:null,lofi:false,
 ac(){if(!this.ctx){try{this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.out=this.ctx.createGain();this.out.gain.value=.5;this.out.connect(this.ctx.destination)}catch(e){return null}}if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});return this.ctx},
 tone(f,d=.08,type='sine',v=.12,when=0,dest){const a=this.ac();if(!a)return;const o=a.createOscillator(),g=a.createGain(),t=a.currentTime+when;o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(dest||this.out);o.start(t);o.stop(t+d+.02)},
 noise(d=.2,v=.05,fq=3000,when=0,dest){const a=this.ac();if(!a)return;const n=Math.floor(a.sampleRate*d),b=a.createBuffer(1,n,a.sampleRate),ch=b.getChannelData(0);for(let i=0;i<n;i++)ch[i]=(Math.random()*2-1)*(1-i/n);const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=b;f.type='bandpass';f.frequency.value=fq;g.gain.value=v;s.connect(f);f.connect(g);g.connect(dest||this.out);s.start(a.currentTime+when)},
 fx(n){if(!this.on)return;({click:()=>this.tone(900,.04,'triangle',.07),pick:()=>this.tone(520,.07,'triangle',.09),snap:()=>{this.tone(300,.06,'square',.05);this.tone(700,.05,'triangle',.07,.03)},ok:()=>{this.tone(660,.1,'triangle',.1);this.tone(990,.16,'triangle',.1,.09)},bad:()=>this.tone(160,.18,'sawtooth',.07),sizzle:()=>this.noise(.12,.035,5200),done:()=>[523,659,784,1047].forEach((f,i)=>this.tone(f,.22,'triangle',.1,i*.11))})[n]()},
 beep(f=2000,d=.05){if(this.on)this.tone(f,d,'square',.05)},
 toggleLofi(){const a=this.ac();if(!a)return false;this.lofi=!this.lofi;if(this.lofi){this.lg=a.createGain();this.lg.gain.value=.0001;this.lg.gain.exponentialRampToValueAtTime(.55,a.currentTime+1.5);const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=1500;this.lg.connect(f);f.connect(a.destination);this.bar=0;this.next=a.currentTime+.1;this.lt=setInterval(()=>this.sched(),200);this.sched()}else{clearInterval(this.lt);const g=this.lg;g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+.6);setTimeout(()=>g.disconnect(),800)}return this.lofi},
 sched(){const a=this.ctx,B=60/74;const ch=[[174.6,220,261.6,329.6],[164.8,196,246.9,293.7],[146.8,174.6,220,261.6],[130.8,164.8,196,246.9]];
  while(this.next<a.currentTime+.6){const w=this.next-a.currentTime,c=ch[this.bar%4];
   c.forEach((f,i)=>{this.tone(f,B*3.8,'triangle',.035,w+i*.03,this.lg);this.tone(f*2,B*2,'sine',.012,w+B*(i%2?1:2),this.lg)});
   this.tone(c[0]/2,B*1.6,'sine',.09,w,this.lg);this.tone(c[0]/2,B*1.2,'sine',.07,w+B*2.5,this.lg);
   for(let i=0;i<4;i++){this.tone(i%2?150:58,.16,'sine',i%2?.05:.16,w+i*B,this.lg);if(i%2)this.noise(.12,.05,1800,w+i*B,this.lg);this.noise(.03,.02,7000,w+i*B+B*.5+(.02*Math.random()),this.lg)}
   this.noise(B*4,.006,900,w,this.lg);this.next+=B*4;this.bar++}}};

/* storage (per browser), logbook, clipboard */
const STORE={mem:{},get(k,d){try{const v=localStorage.getItem('rl_'+k);if(v!=null)return JSON.parse(v)}catch(e){}return k in this.mem?this.mem[k]:d},set(k,v){this.mem[k]=v;try{localStorage.setItem('rl_'+k,JSON.stringify(v));return true}catch(e){return false}}};
const LOG={all(){return STORE.get('log',[])},add(kind,title,lines,note){const a=this.all(),sig=kind+title+lines.join('|');if(a[0]&&a[0].kind+a[0].title+a[0].lines.join('|')===sig){a[0].t=Date.now();a[0].note=note;a[0].n=(a[0].n||1)+1}else a.unshift({t:Date.now(),kind,title,lines,note,n:1});STORE.set('log',a.slice(0,80));this.render&&this.render()},
 text(){return this.all().map(e=>new Date(e.t).toLocaleString()+' — '+e.kind+': '+e.title+(e.note?' ('+e.note+')':'')+'\n'+e.lines.map(l=>'  - '+l).join('\n')).join('\n\n')}};
function copyText(t,msg){const ok=()=>toast(msg||'Copied.','good'),fb=()=>{try{const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.append(a);a.select();const r=document.execCommand('copy');a.remove();r?ok():toast('Copy was blocked by the browser.','bad')}catch(e){toast('Copy was blocked by the browser.','bad')}};try{navigator.clipboard.writeText(t).then(ok,fb)}catch(e){fb()}}
const fmtT=s=>Math.floor(s/60)+':'+String(Math.floor(s)%60).padStart(2,'0');
function mkIron(){const g=new T.Group(),ir=G(cy(.25,11,mt('#b8b0a0',.3,.9),0,0,0,12,1.5),cy(1.6,22,mt('#c9ccce',.3,.9),0,11,0,14),cy(5.6,5,mt('#17181b',.5),0,33,0,20),cy(6.2,34,mt('#c9a46f',.85),0,38,0,22,7.6),cy(7.8,56,mt('#2a55c8',.4),0,72,0,22,7),cy(4.2,10,mt('#17181b',.6),0,128,0,14,2.5),tube([[0,137,0],[4,160,2],[30,190,6],[80,200,10]],2.2,mt('#17181b',.7),20));ir.rotation.z=-.95;ir.rotation.y=.35;g.add(ir);
 const s=new T.Sprite(new T.SpriteMaterial({map:glowTex(),color:'#ff9a3c',transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false}));s.scale.setScalar(16);s.position.y=1;g.add(s);g.userData.glow=s;g.visible=false;return g}
let _gt;function glowTex(){return _gt||(_gt=ctex(64,64,x=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)}))}
function mkSmoke(scene){const a=[];return{puff(p){const s=new T.Sprite(new T.SpriteMaterial({map:glowTex(),color:'#eeeeee',transparent:true,opacity:.35,depthWrite:false}));s.scale.setScalar(6);s.position.copy(p);s.userData.v=new V3((Math.random()-.5)*6,26+Math.random()*14,(Math.random()-.5)*6);scene.add(s);a.push(s)},tick(dt){for(let i=a.length-1;i>=0;i--){const s=a[i];s.position.addScaledVector(s.userData.v,dt);s.scale.multiplyScalar(1+dt*1.6);s.material.opacity-=dt*.45;if(s.material.opacity<=0){scene.remove(s);s.material.dispose();a.splice(i,1)}}}}}

