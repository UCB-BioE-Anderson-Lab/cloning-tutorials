/* ------------------------------------------------------------------ *
 * atoms.js — all-atom nucleobases, drawn skeletally.
 *
 * Skeletal convention throughout: ring carbons are vertices and carry no
 * label; nitrogens are labelled; exocyclic groups are written out. Ring
 * geometry is real — the purine's five-ring shares the C4-C5 edge with
 * the six-ring rather than being stuck on beside it.
 *
 * Every base exposes its GLYCOSIDIC point (N9 on a purine, N1 on a
 * pyrimidine) so a sugar can be attached, and its H-BOND atoms so a
 * partner can be paired against it.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const n2=v=>Math.round(v*10)/10;
const R=46;                              /* six-ring circumradius = side */
const r5=R/(2*Math.sin(36*Math.PI/180)); /* five-ring circumradius       */

function rot(p,a,o){                     /* rotate p about origin o by a deg */
  const t=a*Math.PI/180, dx=p[0]-o[0], dy=p[1]-o[1];
  return [o[0]+dx*Math.cos(t)-dy*Math.sin(t), o[1]+dx*Math.sin(t)+dy*Math.cos(t)];
}
function hex(cx,cy){                     /* C6,N1,C2,N3,C4,C5 at 90..30 */
  return [90,150,210,270,330,30].map(a=>
    [cx+R*Math.cos(a*Math.PI/180), cy-R*Math.sin(a*Math.PI/180)]);
}
function bond(a,b,c,w){
  return '<path d="M'+n2(a[0])+' '+n2(a[1])+'L'+n2(b[0])+' '+n2(b[1])+
         '" fill="none" stroke="'+c+'" stroke-width="'+(w||2.4)+'" stroke-linecap="round"/>';
}
function dbl(a,b,inward,c){              /* second line, offset toward `inward` */
  const dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy);
  let nx=-dy/L, ny=dx/L;
  const mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2;
  if((mx+nx-inward[0])**2+(my+ny-inward[1])**2 > (mx-nx-inward[0])**2+(my-ny-inward[1])**2){
    nx=-nx; ny=-ny;
  }
  const p=[a[0]+nx*6+dx*0.18, a[1]+ny*6+dy*0.18], q=[b[0]+nx*6-dx*0.18, b[1]+ny*6-dy*0.18];
  return bond(p,q,c,2.2);
}
function lab(p,t,c,sz){
  return '<circle cx="'+n2(p[0])+'" cy="'+n2(p[1])+'" r="'+((sz||20)*0.62)+'" fill="#fff"/>'+
         '<text x="'+n2(p[0])+'" y="'+n2(p[1]+(sz||20)*0.34)+'" text-anchor="middle" font-size="'+
         (sz||20)+'" font-weight="600" fill="'+c+'">'+t+'</text>';
}

/* ---- purine: six-ring fused to five-ring on the C4-C5 edge --------- */
function purine(cx,cy,ang,c,which){
  const O=[cx,cy], h=hex(cx,cy);
  const C6=h[0],N1=h[1],C2=h[2],N3=h[3],C4=h[4],C5=h[5];
  /* five-ring centre sits beyond the shared edge midpoint */
  const mid=[(C4[0]+C5[0])/2,(C4[1]+C5[1])/2];
  const ux=(mid[0]-cx)/Math.hypot(mid[0]-cx,mid[1]-cy), uy=(mid[1]-cy)/Math.hypot(mid[0]-cx,mid[1]-cy);
  const c5c=[mid[0]+ux*r5*Math.cos(36*Math.PI/180), mid[1]+uy*r5*Math.cos(36*Math.PI/180)];
  const aC5=Math.atan2(C5[1]-c5c[1],C5[0]-c5c[0]);
  const step=72*Math.PI/180;
  const N7=[c5c[0]+r5*Math.cos(aC5+step), c5c[1]+r5*Math.sin(aC5+step)];
  const C8=[c5c[0]+r5*Math.cos(aC5+2*step), c5c[1]+r5*Math.sin(aC5+2*step)];
  const N9=[c5c[0]+r5*Math.cos(aC5+3*step), c5c[1]+r5*Math.sin(aC5+3*step)];
  const P=p=>rot(p,ang,O);
  const [a6,a1,a2,a3,a4,a5,a7,a8,a9]=[C6,N1,C2,N3,C4,C5,N7,C8,N9].map(P);
  let g="";
  [[a6,a1],[a1,a2],[a2,a3],[a3,a4],[a4,a5],[a5,a6],[a5,a7],[a7,a8],[a8,a9],[a9,a4]]
    .forEach(e=>g+=bond(e[0],e[1],c));
  const ctr=P([cx,cy]), ctr5=P(c5c);
  /* Kekule differs between the two purines: guanine's C6 already carries a
     double-bonded oxygen, so it cannot also be double bonded to C5. Drawing one
     shared pattern gave C6 five bonds. */
  if(which==="A") g+=dbl(a1,a6,ctr,c)+dbl(a2,a3,ctr,c)+dbl(a4,a5,ctr,c);
  else            g+=dbl(a2,a3,ctr,c)+dbl(a4,a5,ctr,c);
  g+=dbl(a7,a8,ctr5,c);
  g+=lab(a1,"N",c)+lab(a3,"N",c)+lab(a7,"N",c)+lab(a9,"N",c);
  /* exocyclic: adenine 6-NH2; guanine 6-oxo and 2-NH2 */
  const out=(from,to,txt,dd)=>{
    const dx=from[0]-to[0],dy=from[1]-to[1],L=Math.hypot(dx,dy);
    const q=[from[0]+dx/L*40, from[1]+dy/L*40];
    return bond(from,q,c)+(dd?dbl(from,q,to,c):"")+lab(q,txt,c,19);
  };
  if(which==="A") g+=out(a6,ctr,"NH&#8322;",false);
  else            g+=out(a6,ctr,"O",true)+out(a2,ctr,"NH&#8322;",false)+lab(a1,"NH",c,18);
  return { g, N9:a9, wc:[a1,a6] };
}

/* ---- pyrimidine: one six-ring ------------------------------------- */
function pyrimidine(cx,cy,ang,c,which){
  const O=[cx,cy], h=hex(cx,cy);
  /* N1 C2 N3 C4 C5 C6 running round from the top */
  const N1=h[3],C2=h[2],N3=h[1],C4=h[0],C5=h[5],C6=h[4];
  const P=p=>rot(p,ang,O);
  const [b1,b2,b3,b4,b5,b6]=[N1,C2,N3,C4,C5,C6].map(P), ctr=P([cx,cy]);
  let g="";
  [[b1,b2],[b2,b3],[b3,b4],[b4,b5],[b5,b6],[b6,b1]].forEach(e=>g+=bond(e[0],e[1],c));
  /* cytosine is N3=C4 and C5=C6; thymine has C4 as a carbonyl, so only C5=C6 */
  g+=dbl(b5,b6,ctr,c);
  if(which==="C") g+=dbl(b3,b4,ctr,c);
  g+=lab(b1,"N",c)+lab(b3,"N",c);
  const out=(from,txt,dd)=>{
    const dx=from[0]-ctr[0],dy=from[1]-ctr[1],L=Math.hypot(dx,dy);
    const q=[from[0]+dx/L*40, from[1]+dy/L*40];
    return bond(from,q,c)+(dd?dbl(from,q,ctr,c):"")+lab(q,txt,c,19);
  };
  if(which==="C") g+=out(b2,"O",true)+out(b4,"NH&#8322;",false);
  else            g+=out(b2,"O",true)+out(b4,"O",true)+out(b5,"CH&#8323;",false)+lab(b3,"NH",c,18);
  return { g, N1:b1, wc:[b3,b4] };
}

window.Atoms={ purine, pyrimidine,
  base:(letter,cx,cy,ang,c)=> (letter==="A"||letter==="G")
        ? purine(cx,cy,ang,c,letter) : pyrimidine(cx,cy,ang,c,letter) };
})();
