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
 *
 * The lower strand is not positioned by hand. Each of its bases is fitted
 * onto its partner's hydrogen-bonding atoms, and the lower backbone then
 * sits wherever the glycosidic nitrogens ended up.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
/* Straight off the deck palette. #767676 is documented there as the lightest
   legible grey, so anything meant to be READ as a molecule cannot go lighter;
   the old #c8c8c8 filler dissolved. Blue is the palette's "what to look at". */
const INK="#111111", GREY="#767676", MUT="#767676", HOT="#ba3a13";
const KEY="#004373", FAINT="#bcbcbc";
const n2=v=>Math.round(v*10)/10;
const COMP={A:"T",T:"A",G:"C",C:"G",N:"N",R:"Y",Y:"R",W:"W",S:"S",K:"M",M:"K"};
const comp = t => t.split("").map(c=>COMP[c]||"N").join("");

function make(o){
  const top=o.top.toUpperCase(), bot=(o.bot||comp(top)).toUpperCase(), n=top.length;
  const blank=()=>Array.from({length:n},()=>({bb:"on",base:"on"}));
  return { n, top, bot,
    ends:Object.assign({t5:"oh",t3:"oh",b5:"oh",b3:"oh"}, o.ends||{}),
    mods:o.mods||[], cuts:o.cuts||[], endHot:!!o.endHot,
    role:{ top:o.roleTop||blank(), bot:o.roleBot||blank() } };
}
/* bg   grey   a real base, but arbitrary — identity is not what matters
   on   ink    present and required, but unremarkable
   key  blue   the part the enzyme actually reads
   hot  red    the bond that reacts                                        */
const col = r => r==="bg" ? GREY : r==="key" ? KEY : r==="hot" ? HOT : INK;

const K=0.66;             /* 0.70 is where atom labels stop being legible;
                             most of the size cut is taken from spacing instead */
const PITCH=188, TY=292;
let SZ=13;                 /* set from Atoms so every label matches */

function ring5(cx,cy,r,up){
  /* v0 C1' faces the base; v2 is the right-hand vertex, v3 the left, v4 the ring O */
  const a = up ? [270,342,54,126,198] : [90,18,306,234,162];
  return a.map(d=>[cx+r*Math.cos(d*Math.PI/180), cy-r*Math.sin(d*Math.PI/180)]);
}
function bond(a,b,c,w){
  return '<path d="M'+n2(a[0])+' '+n2(a[1])+'L'+n2(b[0])+' '+n2(b[1])+
         '" fill="none" stroke="'+c+'" stroke-width="'+(w||2.4)+'" stroke-linecap="round"/>';
}
function atomLab(p,t,c){
  return '<circle cx="'+n2(p[0])+'" cy="'+n2(p[1])+'" r="'+n2(SZ*0.62)+'" fill="#fff"/>'+
         '<text x="'+n2(p[0])+'" y="'+n2(p[1]+SZ*0.34)+'" text-anchor="middle" font-size="'+
         n2(SZ)+'" font-weight="600" fill="'+c+'">'+t+'</text>';
}
const lerp=(a,b,f)=>[a[0]+(b[0]-a[0])*f, a[1]+(b[1]-a[1])*f];
const out=(v,ctr,d)=>{ const x=v[0]-ctr[0],y=v[1]-ctr[1],L=Math.hypot(x,y)||1;
                       return [v[0]+x/L*d, v[1]+y/L*d]; };

/* term: a chain-terminal phosphate is a MONOester and needs its fourth
   oxygen. Without it the phosphorus carries only three substituents and reads
   as a diester with the chain running on — which is not what a 6-mer's 5' end
   looks like. d points away from the sugar. */
function phosphate(x,y,c,up,R,term,d){
  const s=up?-1:1, L=R*0.80;
  let g=bond([x-4,y],[x-4,y+s*L],c)+bond([x+4,y],[x+4,y+s*L],c);      /* P=O */
  g+=atomLab([x,y+s*(L+SZ*0.95)],"O",c);
  g+=bond([x,y],[x,y-s*L],c)+atomLab([x,y-s*(L+SZ*1.05)],"O&#8315;",c);
  if(term) g+=bond([x,y],[x+d*L,y],c)+atomLab([x+d*(L+SZ*1.15),y],"O&#8315;",c);
  g+=atomLab([x,y],"P",c);
  return g;
}
/* C3'-O-P is one bond to the bridging oxygen; C4'-C5'-O-P has a carbon first */
function arm(v,ctr,target,c,withC5,R){
  let g="", start=v;
  if(withC5){ const c5=out(v,ctr,R*0.52); g+=bond(v,c5,c); start=c5; }
  g+=bond(start,target,c)+atomLab(lerp(start,target,0.5),"O",c);
  return g;
}

/* Biotin: two cis-fused five-membered rings sharing the C3a-C6a bond — a
   ureido ring carrying two NH and the 2-oxo carbonyl, and a tetrahydro-
   thiophene carrying the sulphur — with the valeryl chain off C4, ending in
   the amide that joins it to the linker. This is how a biotinylated oligo is
   actually built: biotin does not touch the DNA, it hangs off the 5'
   phosphate through a linker. */
function biotinCore(cx,cy,ang,c,R){
  const r=R*0.62, h=r*Math.cos(36*Math.PI/180), t=ang*Math.PI/180;
  const rt=p=>{const dx=p[0]-cx, dy=p[1]-cy;
               return [cx+dx*Math.cos(t)-dy*Math.sin(t), cy+dx*Math.sin(t)+dy*Math.cos(t)];};
  const P=(ox,angs)=>angs.map(a=>rt([ox+r*Math.cos(a*Math.PI/180), cy-r*Math.sin(a*Math.PI/180)]));
  /* ureido: C6a N1 C2 N3 C3a   |   thiophene: C6a C6 S5 C4 C3a */
  const [C6a,N1,C2,N3,C3a] = P(cx-h,[36,108,180,252,324]);
  const [ ,C6,S5,C4 ]       = P(cx+h,[144,72,0,288]);
  const ctrA=rt([cx-h,cy]);
  let g="";
  [[C6a,N1],[N1,C2],[C2,N3],[N3,C3a],[C3a,C6a],
   [C6a,C6],[C6,S5],[S5,C4],[C4,C3a]].forEach(e=>g+=bond(e[0],e[1],c));
  const o=out(C2,ctrA,R*0.62);
  const dx=o[0]-C2[0], dy=o[1]-C2[1], L=Math.hypot(dx,dy)||1, nx=-dy/L*4, ny=dx/L*4;
  g+=bond(C2,o,c)+bond([C2[0]+nx,C2[1]+ny],[o[0]+nx,o[1]+ny],c);
  g+=atomLab(o,"O",c)+atomLab(N1,"NH",c)+atomLab(N3,"NH",c)+atomLab(S5,"S",c);
  return {g, C4};
}
function biotinGroup(from,d,v,c,R){
  const core=[from[0]+d*R*4.4, from[1]+v*R*3.5];
  /* turn the bicycle so C4 faces the chain. Left unrotated, C4 points away
     and the valeryl chain has to cut back through the rings to reach it. */
  const probe=biotinCore(0,0,0,c,R);
  const base=Math.atan2(probe.C4[1],probe.C4[0])*180/Math.PI;
  const want=Math.atan2(from[1]-core[1],from[0]-core[0])*180/Math.PI;
  const B=biotinCore(core[0],core[1],want-base,c,R);
  /* C4 -> four CH2 -> C(=O) -> NH -> two CH2 -> the linker oxygen. Biotin's
     tail is a valeryl chain, and the amide must sit well back from that
     oxygen: a nitrogen bonded straight to it would be a hydroxylamine. */
  const a=B.C4, b=from, n=9;
  const dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy)||1;
  const nx=-dy/L, ny=dx/L, amp=R*0.24;
  const pts=[a];
  for(let k=1;k<n;k++){ const f=k/n, o=(k%2?1:-1)*amp;
                        pts.push([a[0]+dx*f+nx*o, a[1]+dy*f+ny*o]); }
  pts.push(b);
  let g="";
  for(let k=0;k<pts.length-1;k++) g+=bond(pts[k],pts[k+1],c);
  const cc=pts[5], nn=pts[6];
  /* throw the carbonyl oxygen to the side the zig-zag already leans, so it
     moves away from the amide N rather than stacking on top of it */
  const sgn=(5%2)?1:-1;
  const co=[cc[0]+nx*sgn*R*0.70, cc[1]+ny*sgn*R*0.70];
  g+=bond(cc,co,c)+bond([cc[0]+ny*4,cc[1]-nx*4],[co[0]+ny*4,co[1]-nx*4],c)+atomLab(co,"O",c);
  g+=atomLab(nn,"NH",c);
  return B.g+g;
}

function draw(m, x0){
  const A=window.Atoms; A.setScale(K);
  const R=A.R, sr=R*0.90, GLY=R*0.80;
  SZ = A.LBL;
  x0 = x0 || (1600-(m.n-1)*PITCH)/2;
  const HB = 2.05*R;        /* N...O is about 2.9 A against a 1.39 A ring bond */
  const put={top:[],bot:[]};

  /* Both bases of a pair are oriented edge-horizontal, and turned over
     together when the purine is on the lower strand. */
  const meth={top:{},bot:{}};
  m.mods.forEach(mo=>{ if(mo.type==="methyl") meth[mo.strand][mo.i]=true; });
  const flips=[], glyBot=[];
  for(let i=0;i<m.n;i++){
    const cx=x0+i*PITCH, fl=!(m.top[i]==="A"||m.top[i]==="G");
    flips[i]=fl;
    const t=A.baseEdgeAt(m.top[i], cx, TY+sr+GLY, fl, col(m.role.top[i].base), meth.top[i]);
    put.top[i]=t;
    /* where the lower glycosidic atom has to sit for the H-bonds to be HB long */
    const probe=A.baseEdgeAt(m.bot[i], 0, 0, fl, "#000");
    glyBot[i] = t.hb[0][1] + HB - probe.hb[0][1];
  }
  /* this comes out the same at every position -- a purine and a pyrimidine
     always sum to the same span -- which is why one backbone line serves all */
  const BY = glyBot.reduce((a,b)=>a+b,0)/m.n + sr + GLY;
  for(let i=0;i<m.n;i++){
    put.bot[i]=A.baseEdgeAt(m.bot[i], x0+i*PITCH, BY-sr-GLY, flips[i],
                            col(m.role.bot[i].base), meth.bot[i]);
  }

  /* where each moiety ended up, so a slide can point at one and name it */
  const AN={sugar:{top:[],bot:[]}, phos:{top:[],bot:[]}, base:{top:[],bot:[]}, term:{}};
  for(let i=0;i<m.n;i++){ AN.base.top[i]=put.top[i].ctr; AN.base.bot[i]=put.bot[i].ctr; }

  let g="";
  ["top","bot"].forEach(function(which){
    const up=which==="top", y=up?TY:BY, s=up?1:-1, py=y-s*(R*1.35);
    const verts=[], ctrs=[];
    for(let i=0;i<m.n;i++){ const cx=x0+i*PITCH; verts.push(ring5(cx,y,sr,up)); ctrs.push([cx,y]); }
    AN.sugar[which]=ctrs;

    for(let i=0;i<m.n;i++){
      const cb=col((m.role[which][i]||{}).bb), v=verts[i], b=put[which][i];
      g+='<path d="M'+v.map(p=>n2(p[0])+" "+n2(p[1])).join("L")+'Z" fill="#f4f4f4" stroke="'+cb+
         '" stroke-width="2.4" stroke-linejoin="round"/>';
      g+=atomLab(v[4],"O",cb);                                       /* O4' */
      g+=bond(v[0], b.N9||b.N1, cb);                                 /* glycosidic */
      g+=b.g;
    }

    const rightIs3 = up;
    for(let i=0;i<m.n-1;i++){
      const px=x0+i*PITCH+PITCH/2, P=[px,py];
      const hot=m.cuts.some(c=>c.strand===which && c.after===i);
      const cL=hot?HOT:col((m.role[which][i]||{}).bb), cR=hot?HOT:col((m.role[which][i+1]||{}).bb);
      g+=arm(verts[i][2], ctrs[i], P, cL, !rightIs3, R);
      g+=arm(verts[i+1][3], ctrs[i+1], P, cR, rightIs3, R);
      AN.phos[which][i]=P;
      g+=phosphate(px,py,hot?HOT:cL,up,R);
    }

    const e5=up?m.ends.t5:m.ends.b5, e3=up?m.ends.t3:m.ends.b3;
    [[0,3,up?e5:e3,up?"5&#8242;":"3&#8242;",-1],
     [m.n-1,2,up?e3:e5,up?"3&#8242;":"5&#8242;",1]].forEach(function(q){
      const i=q[0], v=verts[i][q[1]], ctr=ctrs[i], end=q[2], d=q[4];
      const isC5 = (q[1]===3) ? rightIs3 : !rightIs3;
      /* a terminus belongs to the backbone, so it takes the backbone's colour
         rather than a hardcoded ink that leaves the ends looking unrelated */
      const isFive = q[3].indexOf("5")>=0;
      /* on the ends slide the 5' group IS the subject, so it takes the
         reactive colour rather than the backbone's */
      const ce = (m.endHot && isFive) ? HOT : col((m.role[which][i]||{}).bb);
      if(end==="biotin"){
        const tip=[ctr[0]+d*(PITCH*0.42), py];
        g+=arm(v,ctr,tip,ce,isC5,R)+phosphate(tip[0],tip[1],ce,up,R);
        const ox=[tip[0]+d*R*0.86, py];
        g+=bond(tip,ox,ce)+atomLab(ox,"O",ce);
        AN.term[which+"5"]=ox;
        g+=biotinGroup(ox, d, -s, ce, R);
      }else if(end==="phos"){
        const tip=[ctr[0]+d*(PITCH*0.42), py];
        AN.term[which+(q[3].indexOf("5")>=0?"5":"3")]=tip;
        g+=arm(v,ctr,tip,ce,isC5,R)+phosphate(tip[0],tip[1],ce,up,R,true,d);
        g+='<text x="'+n2(tip[0]+d*70)+'" y="'+n2(y+7)+'" text-anchor="middle" font-size="20" fill="'+
           MUT+'">'+q[3]+'</text>';
      }else{
        /* A 5' terminus has a methylene between C4' and its oxygen; a 3' one
           does not — C3' bonds the oxygen directly. The methylene was being
           drawn, but extending radially put C4', C5' and O on one straight
           line, so the vertex disappeared. It now takes the same bend toward
           the phosphorus line that an internal linkage does. */
        let oh;
        if(isC5){
          const c5=out(v,ctr,R*0.52);
          oh=[c5[0]+d*R*0.72, py];
          g+=bond(v,c5,ce)+bond(c5,oh,ce);
        }else{
          oh=out(v,ctr,R*0.72);
          g+=bond(v,oh,ce);
        }
        AN.term[which+(q[3].indexOf("5")>=0?"5":"3")]=oh;
        g+=atomLab(oh,"OH",ce);
        g+='<text x="'+n2(oh[0]+d*44)+'" y="'+n2(oh[1]+6)+'" text-anchor="middle" font-size="20" fill="'+
           MUT+'">'+q[3]+'</text>';
      }
    });
  });

  /* hydrogen bonds, drawn between the atoms that actually make them */
  for(let i=0;i<m.n;i++){
    const tb=put.top[i], bb=put.bot[i];
    if(!tb||!bb) continue;
    const faded = m.role.top[i].base==="bg"||m.role.bot[i].base==="bg";
    const n=Math.min(tb.hb.length, bb.hb.length);
    for(let k=0;k<n;k++){
      const a=lerp(tb.hb[k], bb.hb[k], 0.16), b=lerp(tb.hb[k], bb.hb[k], 0.84);
      g+='<path d="M'+n2(a[0])+' '+n2(a[1])+'L'+n2(b[0])+' '+n2(b[1])+
         '" fill="none" stroke="'+(faded?FAINT:MUT)+'" stroke-width="2" stroke-dasharray="4 5"/>';
    }
  }

  m.mods.forEach(function(mo){
    if(mo.type!=="methyl") return;
    const b=put[mo.strand][mo.i]; if(!b||!b.mSites) return;
    const site=b.mSites.filter(x=>x.k===mo.site)[0]; if(!site) return;
    /* 6mA red; the two cytosine marks blue. Position tells 5mC from 4mC. */
    const mc = mo.site==="6" ? HOT : KEY;
    const q=[site.p[0]+site.d[0]*R*1.25, site.p[1]+site.d[1]*R*1.25];
    g+=bond(site.p,q,mc,3)+
       '<circle cx="'+n2(q[0])+'" cy="'+n2(q[1])+'" r="'+n2(SZ*0.9)+'" fill="#fff"/>'+
       '<text x="'+n2(q[0])+'" y="'+n2(q[1]+SZ*0.34)+'" text-anchor="middle" font-size="'+n2(SZ)+
       '" font-weight="700" fill="'+mc+'">CH&#8323;</text>';
  });
  window.DNAModel.anchors=AN;
  return g;
}
window.DNAModel={ make, draw, comp, HOT, PITCH, anchors:null };
})();
