/* ───────── boot ───────── */
let GAL={};
(function(){
 const fail=m=>{document.body.insertAdjacentHTML('afterbegin','<div style="position:fixed;inset:0;z-index:999;display:grid;place-items:center;background:#ebe6dc;padding:30px;text-align:center;font:16px Georgia,serif">'+m+'</div>')};
 try{const c=document.createElement('canvas');if(!(c.getContext('webgl2')||c.getContext('webgl')))return fail('Robotics Lab needs WebGL, which this browser or device has switched off.')}catch(e){return fail('Robotics Lab needs WebGL.')}
 let thumbs;try{thumbs=makeThumbs()}catch(e){console.error(e);thumbs={}}
 GAL=initGallery(thumbs);initBench(thumbs);initPages(thumbs);
 const vis={boards:true,bench:false};try{const io=new IntersectionObserver(es=>es.forEach(e=>{vis[e.target.id]=e.isIntersecting}),{rootMargin:'80px'});io.observe($('#boards'));io.observe($('#bench'))}catch(e){vis.bench=true}
 let last=0;function loop(){const now=performance.now(),dt=(last?clamp((now-last)/1000,0,.1):.016)*(window.LABSPEED||1);last=now;tickTW(dt);if(vis.boards)GAL.tick(dt,now/1000);if(vis.bench||$('#bench').classList.contains('full'))BENCH.tick(dt,now/1000);requestAnimationFrame(loop)}requestAnimationFrame(loop);
 const hs=location.hash.slice(1);if(hs&&document.getElementById(hs)&&hs!=='boards')setTimeout(()=>document.getElementById(hs).scrollIntoView(),60);
 window.LAB={GAL,BENCH};
})();

