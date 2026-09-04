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
let R=46;                                /* six-ring circumradius = side */
let r5=R/(2*Math.sin(36*Math.PI/180));   /* five-ring circumradius       */
function setScale(k){ R=46*k; r5=R/(2*Math.sin(36*Math.PI/180)); return R; }

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
const LBL=19;                            /* the ONE label size; nothing overrides it */
function lab(p,t,c){
  const sz=LBL*(R/46);
  return '<circle cx="'+n2(p[0])+'" cy="'+n2(p[1])+'" r="'+(sz*0.62)+'" fill="#fff"/>'+
         '<text x="'+n2(p[0])+'" y="'+n2(p[1]+sz*0.34)+'" text-anchor="middle" font-size="'+
         sz+'" font-weight="600" fill="'+c+'">'+t+'</text>';
}
/* the base's letter, sitting in the ring it names */
function idLab(p,t){
  const sz=LBL*(R/46);
  return '<circle cx="'+n2(p[0])+'" cy="'+n2(p[1])+'" r="'+(sz*0.70)+'" fill="#fff" opacity="0.9"/>'+
         '<text x="'+n2(p[0])+'" y="'+n2(p[1]+sz*0.34)+'" text-anchor="middle" font-size="'+
         sz+'" font-weight="600" fill="#9a9a9a">'+t+'</text>';
}

/* ---- purine: six-ring fused to five-ring on the C4-C5 edge --------- */
function purine(cx,cy,ang,c,which,meth){
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
    const q=[from[0]+dx/L*40*(R/46), from[1]+dy/L*40*(R/46)];
    return bond(from,q,c)+(dd?dbl(from,q,to,c):"")+lab(q,txt,c,19);
  };
  /* methylation replaces a hydrogen, it does not add to a full amine:
     N6-methyladenine is N6-H-CH3, so the amine loses an H when marked */
  if(which==="A") g+=out(a6,ctr, meth?"NH":"NH&#8322;", false);
  else            g+=out(a6,ctr,"O",true)+out(a2,ctr,"NH&#8322;",false)+lab(a1,"NH",c,18);
  /* where a DNA methylase puts a methyl: N6 on adenine (Dam, EcoRI),
     N7 on guanine. Not the ring nitrogen the pairing edge happens to expose. */
  const qOf=(from,to)=>{const dx=from[0]-to[0],dy=from[1]-to[1],L=Math.hypot(dx,dy);
                        return [from[0]+dx/L*40*(R/46), from[1]+dy/L*40*(R/46)];};
  g+=idLab(ctr,which);
  /* Hydrogen-bond atoms in major-groove-to-minor-groove order, so index i on
     one base pairs with index i on its partner:
        A [N6, N1]        with T [O4, N3]
        G [O6, N1, N2]    with C [N4, N3, O2]                            */
  const hb = which==="A" ? [qOf(a6,ctr), a1]
                         : [qOf(a6,ctr), a1, qOf(a2,ctr)];
  return { g, N9:a9, wc:[a1,a6], ctr, hb, mSite: which==="A" ? qOf(a6,ctr) : a7 };
}

/* ---- pyrimidine: one six-ring ------------------------------------- */
function pyrimidine(cx,cy,ang,c,which){
  const O=[cx,cy], h=hex(cx,cy);
  /* N1 C2 N3 C4 C5 C6 running round from the top */
  /* Run the ring the SAME rotational sense as the purine. Numbering it the
     other way makes the pyrimidine a mirror image of its partner, and then the
     two pairing edges come out antiparallel -- N6 ends up opposite N3 rather
     than O4, and no rigid placement can pair them correctly. */
  const N1=h[3],C2=h[4],N3=h[5],C4=h[0],C5=h[1],C6=h[2];
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
    const q=[from[0]+dx/L*40*(R/46), from[1]+dy/L*40*(R/46)];
    return bond(from,q,c)+(dd?dbl(from,q,ctr,c):"")+lab(q,txt,c,19);
  };
  if(which==="C") g+=out(b2,"O",true)+out(b4,"NH&#8322;",false);
  else            g+=out(b2,"O",true)+out(b4,"O",true)+out(b5,"CH&#8323;",false)+lab(b3,"NH",c,18);
  /* 5-methylcytosine is on the ring carbon C5, not on the 4-amino */
  g+=idLab(ctr,which);
  const qOf=(from)=>{const dx=from[0]-ctr[0],dy=from[1]-ctr[1],L=Math.hypot(dx,dy);
                     return [from[0]+dx/L*40*(R/46), from[1]+dy/L*40*(R/46)];};
  const hb = which==="C" ? [qOf(b4), b3, qOf(b2)] : [qOf(b4), b3];
  return { g, N1:b1, wc:[b3,b4], ctr, hb, mSite: which==="C" ? b5 : null };
}

/* Draw a base rotated so its glycosidic nitrogen points in a given screen
   direction — up (-90) for a top-strand base whose sugar sits above it.
   Without this the sugar bonds to whatever atom happens to face it. */
function baseAligned(letter,cx,cy,targetDeg,c){
  const probe = (letter==="A"||letter==="G") ? purine(cx,cy,0,c,letter)
                                             : pyrimidine(cx,cy,0,c,letter);
  const gly = probe.N9 || probe.N1;
  const cur = Math.atan2(gly[1]-cy, gly[0]-cx)*180/Math.PI;
  const ang = targetDeg - cur;
  return (letter==="A"||letter==="G") ? purine(cx,cy,ang,c,letter)
                                      : pyrimidine(cx,cy,ang,c,letter);
}

/* Place a base BY ITS GLYCOSIDIC ATOM rather than by its centre, so the ring
   hangs off the sugar instead of overlapping it. dirDeg is the direction from
   the ring centre out to that atom. */
/* Rotate a base so its WATSON-CRICK EDGE faces a given direction, which is
   what lets the hydrogen bonds be drawn between real atoms instead of
   suggested by one dash. purine wc = [N1,C6]; pyrimidine wc = [N3,C4]. */
/* Face the pairing edge inward, but position the base by its GLYCOSIDIC atom.
   A purine reaches further from that atom to its pairing edge than a
   pyrimidine does, so placing both this way makes the two edges meet in the
   middle on their own -- which is why real base pairs are a constant width. */
function baseFacingAt(letter,gx,gy,faceDeg,c){
  const probe=baseFacing(letter,0,0,faceDeg,c);
  const off=probe.N9||probe.N1;
  return baseFacing(letter, gx-off[0], gy-off[1], faceDeg, c);
}

function baseFacing(letter,cx,cy,faceDeg,c){
  const pu=(letter==="A"||letter==="G");
  const probe=pu?purine(cx,cy,0,c,letter):pyrimidine(cx,cy,0,c,letter);
  const w=probe.wc, mid=[(w[0][0]+w[1][0])/2,(w[0][1]+w[1][1])/2];
  const cur=Math.atan2(mid[1]-cy,mid[0]-cx)*180/Math.PI;
  const ang=faceDeg-cur;
  return pu?purine(cx,cy,ang,c,letter):pyrimidine(cx,cy,ang,c,letter);
}

function baseAt(letter,gx,gy,dirDeg,c){
  const probe=baseAligned(letter,0,0,dirDeg,c);
  const off=probe.N9||probe.N1;
  return baseAligned(letter, gx-off[0], gy-off[1], dirDeg, c);
}

/* Place a base so its hydrogen-bonding atoms land ON the given targets.
   This is the 2D Kabsch fit: the rotation and translation minimising the
   squared error between the base's H-bond atoms and where they must be.
   Because a purine and its pyrimidine partner present the same spacing --
   one ring edge plus one exocyclic bond on each side of the ring nitrogen --
   the fit is exact, which is the geometric reason Watson-Crick pairs are
   isomorphous and the helix has a constant width. */
/* Orient a base so its PAIRING EDGE lies horizontal, then hang it off the
   given glycosidic point.

   With both partners' edges horizontal and their first H-bond atom on the same
   side, every hydrogen bond comes out vertical, parallel and the same length,
   joining the atoms that really make it. That is the only way to get all three
   of: a regular backbone, glycosidic bonds that point at their own sugars, and
   honest hydrogen bonds. Insisting instead that the partner be a rigid-body fit
   onto vertically-offset targets rotates it about 55 degrees and drives the
   ring through its own sugar -- a real Watson-Crick pair does not have both
   glycosidic bonds perpendicular to the pair axis, so a ladder drawing has to
   give up something, and this gives up the least.

   A purine so oriented points its glycosidic nitrogen up and a pyrimidine
   points its own down, so when the purine is on the lower strand the whole
   pair is turned over together -- which keeps H-bond atom k above atom k. */
function baseEdgeAt(letter,gx,gy,flip,c,meth){
  const B=(l,x,y,a)=>(l==="A"||l==="G")?purine(x,y,a,c,l,meth):pyrimidine(x,y,a,c,l,meth);
  const h=B(letter,0,0,0).hb, n=h.length;
  const cur=Math.atan2(h[n-1][1]-h[0][1], h[n-1][0]-h[0][0])*180/Math.PI;
  const ang=-cur+(flip?180:0);
  const r=B(letter,0,0,ang), off=r.N9||r.N1;
  return B(letter, gx-off[0], gy-off[1], ang);
}

window.Atoms={ purine, pyrimidine, setScale, baseEdgeAt, get LBL(){return LBL*(R/46);}, baseAligned, baseAt, baseFacing, baseFacingAt, get R(){return R;},
  base:(letter,cx,cy,ang,c)=> (letter==="A"||letter==="G")
        ? purine(cx,cy,ang,c,letter) : pyrimidine(cx,cy,ang,c,letter) };
})();
