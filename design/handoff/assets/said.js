// SAID shared runtime: theme, nav/footer injection, reveals, copy, dot seams, CTA dots
function applyTheme(v){if(v==='dark')document.documentElement.dataset.theme='dark';else delete document.documentElement.dataset.theme}
function toggleTheme(){const v=document.documentElement.dataset.theme==='dark'?'light':'dark';localStorage.setItem('said-theme',v);applyTheme(v)}
applyTheme(localStorage.getItem('said-theme'));
window.saidNav=function(active){
const links=[['Directory','SAID Directory.html'],['Docs','SAID Docs.html'],['$SAID','SAID Token.html'],['Agent','SAID Agent.html']];
document.write(`<nav class="said"><a class="logo" href="SAID Home.html"><img class="lb" src="assets/logo-black.png" alt=""><img class="lw" src="assets/logo-white.png" alt=""><span>SAID</span></a><div class="navlinks">${links.map(([n,h])=>`<a href="${h}"${n===active?' class="on"':''}>${n}</a>`).join('')}</div><div class="navright"><button class="themebtn" title="Toggle dark mode" onclick="toggleTheme()"><svg class="sun" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="8" cy="8" r="3.2"></circle><line x1="8" y1="0.8" x2="8" y2="2.6"></line><line x1="8" y1="13.4" x2="8" y2="15.2"></line><line x1="0.8" y1="8" x2="2.6" y2="8"></line><line x1="13.4" y1="8" x2="15.2" y2="8"></line><line x1="2.9" y1="2.9" x2="4.2" y2="4.2"></line><line x1="11.8" y1="11.8" x2="13.1" y2="13.1"></line><line x1="2.9" y1="13.1" x2="4.2" y2="11.8"></line><line x1="11.8" y1="4.2" x2="13.1" y2="2.9"></line></svg><svg class="moon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M13.5 9.8A6 6 0 0 1 6.2 2.5a6 6 0 1 0 7.3 7.3Z"></path></svg></button><a class="navcta" href="SAID Create Agent.html">Register an agent</a></div></nav>`)}
window.saidFooter=function(){
document.write(`<footer class="said"><span>© 2026 SAID Protocol</span><span class="links"><a href="SAID Home.html">Protocol</a><a href="SAID Directory.html">Directory</a><a href="SAID Docs.html">Docs</a><a href="SAID Token.html">$SAID</a><a href="SAID Grants.html">Grants</a><a href="SAID Security.html">Security</a><a href="SAID Blog.html">Blog</a><a href="SAID Changelog.html">Changelog</a><a href="SAID Terms.html">Terms</a><a href="SAID Privacy.html">Privacy</a></span></footer>`)}
addEventListener('DOMContentLoaded',()=>{
// reveals
const rvEls=[...document.querySelectorAll('.rv,.ctaCard')];
function reveal(){for(let i=rvEls.length-1;i>=0;i--){const el=rvEls[i];
if(el.getBoundingClientRect().top<innerHeight*.88){el.classList.add('in');rvEls.splice(i,1)}}}
addEventListener('scroll',reveal,{passive:true});reveal();
// copy buttons
document.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',()=>{
const host=b.parentElement;const code=host.querySelector('code');
navigator.clipboard.writeText(code?code.textContent.trim():'');
b.textContent='COPIED';setTimeout(()=>b.textContent='COPY',1200)}));
// noise
const G3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
const P=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
const perm=new Array(512).fill(0).map((_,i)=>P[i&255]);
function n3(x,y,z){const F=1/3,Gc=1/6,s=(x+y+z)*F,i=Math.floor(x+s),j=Math.floor(y+s),k=Math.floor(z+s),
t=(i+j+k)*Gc,x0=x-(i-t),y0=y-(j-t),z0=z-(k-t);let i1,j1,k1,i2,j2,k2;
if(x0>=y0){if(y0>=z0){i1=1;j1=0;k1=0;i2=1;j2=1;k2=0}else if(x0>=z0){i1=1;j1=0;k1=0;i2=1;j2=0;k2=1}else{i1=0;j1=0;k1=1;i2=1;j2=0;k2=1}}
else{if(y0<z0){i1=0;j1=0;k1=1;i2=0;j2=1;k2=1}else if(x0<z0){i1=0;j1=1;k1=0;i2=0;j2=1;k2=1}else{i1=0;j1=1;k1=0;i2=1;j2=1;k2=0}}
const x1=x0-i1+Gc,y1=y0-j1+Gc,z1=z0-k1+Gc,x2=x0-i2+2*Gc,y2=y0-j2+2*Gc,z2=z0-k2+2*Gc,
x3=x0-1+3*Gc,y3=y0-1+3*Gc,z3=z0-1+3*Gc,ii=i&255,jj=j&255,kk=k&255;
let n=0,t0=.6-x0*x0-y0*y0-z0*z0;
if(t0>=0){t0*=t0;const g=G3[perm[ii+perm[jj+perm[kk]]]%12];n+=t0*t0*(g[0]*x0+g[1]*y0+g[2]*z0)}
let t1=.6-x1*x1-y1*y1-z1*z1;
if(t1>=0){t1*=t1;const g=G3[perm[ii+i1+perm[jj+j1+perm[kk+k1]]]%12];n+=t1*t1*(g[0]*x1+g[1]*y1+g[2]*z1)}
let t2=.6-x2*x2-y2*y2-z2*z2;
if(t2>=0){t2*=t2;const g=G3[perm[ii+i2+perm[jj+j2+perm[kk+k2]]]%12];n+=t2*t2*(g[0]*x2+g[1]*y2+g[2]*z2)}
let t3=.6-x3*x3-y3*y3-z3*z3;
if(t3>=0){t3*=t3;const g=G3[perm[ii+1+perm[jj+1+perm[kk+1]]]%12];n+=t3*t3*(g[0]*x3+g[1]*y3+g[2]*z3)}
return 32*n}
const dpr=Math.min(2,devicePixelRatio||1);
// dot seams
const divs=[...document.querySelectorAll('canvas.dotdiv')].map(c=>({c,x:c.getContext('2d')}));
let dt=Math.random()*10;
function dsize(){for(const d of divs){const r=d.c.getBoundingClientRect();
d.c.width=Math.round(r.width*dpr);d.c.height=Math.round(64*dpr)}}
addEventListener('resize',dsize);dsize();
if(divs.length)(function drender(){requestAnimationFrame(drender);
dt+=.012;
const dark=document.documentElement.dataset.theme==='dark';
divs.forEach((d,di)=>{
const r=d.c.getBoundingClientRect();
if(r.width===0||r.bottom<0||r.top>innerHeight)return;
if(d.c.width===0)dsize();
const Wd=d.c.width,Hd=d.c.height,SPD=11*dpr;
const cols=Math.ceil(Wd/SPD),rows=Math.ceil(Hd/SPD);
d.x.clearRect(0,0,Wd,Hd);
for(let rr=0;rr<rows;rr++)for(let cc=0;cc<cols;cc++){
const n=n3(cc/cols*3+di*7,rr/rows*1.2,dt*.15);
const v=Math.min(1,Math.max(0,(n+1)*.5));
const ey=1-Math.abs((rr+0.5)/rows*2-1);
const ex=Math.min(1,Math.min(cc,cols-1-cc)/(cols*.18));
const a=(.05+v*.3)*ey*ex;
if(a<.02)continue;
d.x.beginPath();d.x.arc(cc*SPD+SPD/2,rr*SPD+SPD/2,(0.5+v*1.5)*dpr,0,Math.PI*2);
d.x.fillStyle=`hsla(40,${dark?4:6}%,${dark?Math.round(30+v*50):Math.round(64-v*50)}%,${a})`;
d.x.fill()}})
})();
// CTA ambient dots
const ccv=document.querySelector('canvas.ctadots');
if(ccv){const ccx=ccv.getContext('2d');let cW=0,cH=0,ct=0;
function csize(){const r=ccv.getBoundingClientRect();cW=ccv.width=Math.round(r.width*dpr);cH=ccv.height=Math.round(r.height*dpr)}
addEventListener('resize',csize);csize();
(function crender(){requestAnimationFrame(crender);
const r=ccv.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
if(cW===0)csize();
ct+=.012;const SP2=16*dpr;
const cols=Math.ceil(cW/SP2),rows=Math.ceil(cH/SP2);
const dark=document.documentElement.dataset.theme==='dark';
ccx.clearRect(0,0,cW,cH);
for(let rr=0;rr<rows;rr++)for(let cc=0;cc<cols;cc++){
const n=n3(cc/cols*2.2,rr/rows*2.2,ct*.14);
const v=Math.min(1,Math.max(0,(n+1)*.5));
ccx.beginPath();ccx.arc(cc*SP2,rr*SP2,(0.5+v*1.4)*dpr,0,Math.PI*2);
ccx.fillStyle=dark?`hsla(40,6%,20%,${.04+v*.12})`:`hsla(40,10%,90%,${.04+v*.12})`;
ccx.fill()}
})()}
});
