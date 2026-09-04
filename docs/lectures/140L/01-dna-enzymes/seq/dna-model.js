/* ------------------------------------------------------------------ *
 * dna-model.js — a drawable DNA duplex, described as data, drawn all-atom.
 *
 * Mirrors the C6 Polynucleotide the students' own simulations use, plus
 * the render metadata a slide needs:
 *
 *   top      the coding strand, 5'->3'.  bottom is the COMPLEMENT (not the
 *            reverse complement): drawn beneath and labelled 3'->5', so
 *            position i pairs with position i.
 *   ends     5' phosphate or hydroxyl, independently per strand end
 *   mods     methyl at a position on a strand
 *   role     per position AND per element — backbone and base are coloured
 *            separately, because "GANNNN" means the backbone is still
 *            required where the base identity is not.
 *
 * Colour is meaning, not decoration:
 *   bg   grey    concrete filler: a real sequence, but arbitrary
 *   on   black   conserved: the enzyme actually requires this
 *   hot  red     the reactive centre, where the chemistry happens
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const INK="#111111", GREY="#c8c8c8", MUT="#767676", HOT="#ba3a13";
const n2=v=>Math.round(v*10)/10;
const COMP={A:"T",T:"A",G:"C",C:"G",N:"N",R:"Y",Y:"R",W:"W",S:"S",K:"M",M:"K"};
const comp = t => t.split("").map(c=>COMP[c]||"N").join("");

function make(o){
  const top=o.top.toUpperCase(), bot=(o.bot||comp(top)).toUpperCase(), n=top.length;
  const blank=()=>Array.from({length:n},()=>({bb:"on",base:"on"}));
  return { n, top, bot,
    ends:Object.assign({t5:"oh",t3:"oh",b5:"oh",b3:"oh"}, o.ends||{}),
    mods:o.mods||[], cuts:o.cuts||[],
    role:{ top:o.roleTop||blank(), bot:o.roleBot||blank() } };
}
const col = r => r==="bg" ? GREY : r==="hot" ? HOT : INK;

/* ---- geometry ------------------------------------------------------ */
const K=0.70;              /* the scale at which atom labels stay legible */
const PITCH=206, TY=318, BY=663;
const POUT=44;             /* phosphorus sits OUTBOARD of the sugar line, so the
                              C3'/C4' arms leave at their natural diagonal */
const GLY=26;              /* the glycosidic bond itself */

function ring5(cx,cy,r,up){
  /* v0 C1' faces the base; v2 is the right-hand vertex, v3 the left, v4 the ring O */
  const a = up ? [270,342,54,126,198] : [90,18,306,234,162];
  return a.map(d=>[cx+r*Math.cos(d*Math.PI/180), cy-r*Math.sin(d*Math.PI/180)]);
}
function bond(a,b,c,w){
  return '<path d="M'+n2(a[0])+' '+n2(a[1])+'L'+n2(b[0])+' '+n2(b[1])+
         '" fill="none" stroke="'+c+'" stroke-width="'+(w||2.4)+'" stroke-linecap="round"/>';
}
function atomLab(p,t,c,sz){
  const s=sz||17;
  return '<circle cx="'+n2(p[0])+'" cy="'+n2(p[1])+'" r="'+(s*0.62)+'" fill="#fff"/>'+
         '<text x="'+n2(p[0])+'" y="'+n2(p[1]+s*0.34)+'" text-anchor="middle" font-size="'+s+
         '" font-weight="600" fill="'+c+'">'+t+'</text>';
}
const lerp=(a,b,f)=>[a[0]+(b[0]-a[0])*f, a[1]+(b[1]-a[1])*f];
const out=(v,ctr,d)=>{ const x=v[0]-ctr[0],y=v[1]-ctr[1],L=Math.hypot(x,y)||1;
                       return [v[0]+x/L*d, v[1]+y/L*d]; };

/* a backbone phosphate: P with both non-bridging oxygens */
function phosphate(x,y,c,up){
  const s=up?-1:1;
  let g=bond([x-4.5,y],[x-4.5,y+s*36],c)+bond([x+4.5,y],[x+4.5,y+s*36],c);  /* P=O */
  g+=atomLab([x,y+s*50],"O",c);
  g+=bond([x,y],[x,y-s*36],c)+atomLab([x,y-s*52],"O&#8315;",c);
  g+=atomLab([x,y],"P",c,21);
  return g;
}

function draw(m, x0){
  const A=window.Atoms; A.setScale(K);
  const R=A.R, sr=R*0.90;
  x0 = x0 || (1600-(m.n-1)*PITCH)/2;
  let g="", put={top:[],bot:[]};

  ["top","bot"].forEach(function(which){
    const up=which==="top", y=up?TY:BY, seq=up?m.top:m.bot, s=up?1:-1;
    const py=y-s*POUT;                       /* the backbone phosphorus line */
    const verts=[], sugarC=[];
    for(let i=0;i<m.n;i++){ const cx=x0+i*PITCH; verts.push(ring5(cx,y,sr,up)); sugarC.push([cx,y]); }

    for(let i=0;i<m.n;i++){
      const cx=x0+i*PITCH, r=m.role[which][i]||{bb:"on",base:"on"};
      const cb=col(r.bb), cbase=col(r.base), v=verts[i];
      g+='<path d="M'+v.map(p=>n2(p[0])+" "+n2(p[1])).join("L")+'Z" fill="#f4f4f4" stroke="'+cb+
         '" stroke-width="2.4" stroke-linejoin="round"/>';
      g+=atomLab(v[4],"O",cb,15);                                   /* O4' */
      const glyPt=[cx, y+s*(sr+GLY)];
      g+=bond(v[0],glyPt,cb);
      /* pairing edge faces the partner strand; the base positions itself by
         its glycosidic atom, so purine and pyrimidine meet in the middle */
      const b=A.baseFacingAt(seq[i], glyPt[0], glyPt[1], up?90:-90, cbase);
      g+=b.g; put[which][i]=b;
    }

    /* linkages. v[2] is always the right-hand vertex, v[3] the left; which of
       them is C3' depends on which way the strand runs. */
    const rightIs3 = up;
    for(let i=0;i<m.n-1;i++){
      const px=x0+i*PITCH+PITCH/2;
      const hot=m.cuts.some(c=>c.strand===which && c.after===i);
      const cL=hot?HOT:col((m.role[which][i]||{}).bb), cR=hot?HOT:col((m.role[which][i+1]||{}).bb);
      const P=[px,py];
      /* left residue reaches right; right residue reaches left */
      g+=arm(verts[i][2], sugarC[i], P, cL, !rightIs3);
      g+=arm(verts[i+1][3], sugarC[i+1], P, cR, rightIs3);
      g+=phosphate(px,py,hot?HOT:cL,up);
    }

    /* the two termini */
    const e5=up?m.ends.t5:m.ends.b5, e3=up?m.ends.t3:m.ends.b3;
    [[0,3,up?e5:e3,up?"5&#8242;":"3&#8242;",-1],
     [m.n-1,2,up?e3:e5,up?"3&#8242;":"5&#8242;",1]].forEach(function(q){
      const i=q[0], v=verts[i][q[1]], ctr=sugarC[i], end=q[2], d=q[4];
      const isC5 = (q[1]===3) ? rightIs3 : !rightIs3;   /* same rule as the linkages */
      const tip=[ctr[0]+d*(PITCH*0.42), py];
      if(end==="phos"){
        g+=arm(v,ctr,tip,INK,isC5)+phosphate(tip[0],tip[1],INK,up);
        g+='<text x="'+n2(tip[0]+d*74)+'" y="'+n2(y+7)+'" text-anchor="middle" font-size="20" fill="'+
           MUT+'">'+q[3]+'</text>';
      }else{
        /* a free hydroxyl: the O and its H, on the arm's natural diagonal */
        let start=v;
        if(isC5){ const c5=out(v,ctr,24); g+=bond(v,c5,INK); start=c5; }
        const oh=out(start,ctr,34);
        g+=bond(start,oh,INK)+atomLab(oh,"OH",INK,19);
        g+='<text x="'+n2(oh[0]+d*46)+'" y="'+n2(oh[1]+6)+'" text-anchor="middle" font-size="20" fill="'+
           MUT+'">'+q[3]+'</text>';
      }
    });
  });

  /* hydrogen bonds: three for G:C, two for A:T, between the facing edges */
  for(let i=0;i<m.n;i++){
    const tb=put.top[i], bb=put.bot[i];
    if(!tb||!bb) continue;
    const pair=(m.top[i]+m.bot[i]).toUpperCase();
    const n = (pair==="GC"||pair==="CG") ? 3 : 2;
    const faded = m.role.top[i].base==="bg"||m.role.bot[i].base==="bg";
    for(let k=0;k<n;k++){
      const f=(k+0.5)/n;
      const a0=lerp(tb.wc[0],tb.wc[1],f), b0=lerp(bb.wc[1],bb.wc[0],f);
      const a=lerp(a0,b0,0.12), b=lerp(a0,b0,0.88);
      g+='<path d="M'+n2(a[0])+' '+n2(a[1])+'L'+n2(b[0])+' '+n2(b[1])+
         '" fill="none" stroke="'+(faded?GREY:MUT)+'" stroke-width="2" stroke-dasharray="5 6"/>';
    }
  }

  m.mods.forEach(function(mo){
    const up=mo.strand==="top", y=up?TY:BY, s=up?1:-1, cx=x0+mo.i*PITCH;
    if(mo.type!=="methyl") return;
    const a=[cx+R*1.5, y+s*(R*0.90+GLY+R*0.9)];
    g+=bond(a,[a[0]+32,a[1]+s*20],HOT,3);
    g+='<text x="'+n2(a[0]+40)+'" y="'+n2(a[1]+s*32+6)+'" font-size="19" font-weight="700" fill="'+
       HOT+'">CH&#8323;</text>';
  });
  return g;
}
/* C3'-O-P is one bond to the bridging oxygen; C4'-C5'-O-P has a carbon first */
function arm(v,ctr,target,c,withC5){
  let g="", start=v;
  if(withC5){ const c5=out(v,ctr,24); g+=bond(v,c5,c); start=c5; }
  g+=bond(start,target,c)+atomLab(lerp(start,target,0.5),"O",c,15);
  return g;
}
window.DNAModel={ make, draw, comp, HOT, PITCH };
})();
