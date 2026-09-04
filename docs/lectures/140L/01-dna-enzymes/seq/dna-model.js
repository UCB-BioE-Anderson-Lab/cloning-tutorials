/* ------------------------------------------------------------------ *
 * dna-model.js — a drawable DNA duplex, described as data.
 *
 * Mirrors the C6 Polynucleotide the students' own simulations use, plus
 * the render metadata a slide needs:
 *
 *   top      the coding strand, 5'->3'.  bottom is computed unless given
 *            explicitly, so a mismatch (GAGTTC / GAATTC) is expressible.
 *   ends     5' phosphate or hydroxyl, independently per strand end
 *   mods     methyl, biotin, ... at a position on a strand
 *   role     per position AND per element: the backbone and the base are
 *            coloured separately, because "GANNNN" means the backbone is
 *            still conserved where the base identity is not
 *
 * Colour is meaning, not decoration:
 *   bg        grey    concrete filler — a real sequence, but arbitrary
 *   on        black   conserved: the enzyme actually requires this
 *   hot       accent  the reactive centre, where the chemistry happens
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const INK="#111111", GREY="#c3c3c3", MUT="#767676";
const HOT="#ba3a13";                 /* the reactive centre. Swap here if the
                                        palette gains a green for this role. */
const n2=v=>Math.round(v*10)/10;
const COMP={A:"T",T:"A",G:"C",C:"G",N:"N",R:"Y",Y:"R",W:"W",S:"S",K:"M",M:"K",
            B:"V",V:"B",D:"H",H:"D"};
const revcomp = s => s.split("").reverse().map(c=>COMP[c]||"N").join("");
const PURINE = c => c==="A"||c==="G";

/* ---- the model ---------------------------------------------------- */
function make(o){
  const top = o.top.toUpperCase();
  const comp = t => t.split("").map(c=>COMP[c]||"N").join("");
  const bot = (o.bot || comp(top)).toUpperCase();   /* drawn left to right, 3'->5' */
  const n = top.length;
  const blank = () => Array.from({length:n}, () => ({bb:"on", base:"on"}));
  return {
    n, top, bot,
    ends: Object.assign({t5:"oh", t3:"oh", b5:"oh", b3:"oh"}, o.ends||{}),
    mods: o.mods || [],
    role: { top: o.roleTop || blank(), bot: o.roleBot || blank() },
    cuts: o.cuts || [],          /* {strand, after}  — reactive backbone position */
    label: o.label || ""
  };
}
function col(r){ return r==="bg" ? GREY : r==="hot" ? HOT : INK; }

/* ---- geometry ------------------------------------------------------ */
const PITCH=150, TY=330, BY=630, SR=30;      /* sugar radius */
function sugar(cx,cy,up){
  /* a furanose, flattened and simplified — recognisable, not a structure paper */
  const s = up ? 1 : -1;
  const p=[[cx-SR,cy],[cx-SR*0.5,cy-s*SR*0.78],[cx+SR*0.5,cy-s*SR*0.78],[cx+SR,cy]];
  return "M"+p.map(q=>n2(q[0])+" "+n2(q[1])).join("L");
}
function ringPath(cx,cy,r,sides,rot){
  let d="";
  for(let i=0;i<sides;i++){
    const a=(rot+i*360/sides)*Math.PI/180;
    d+=(i?"L":"M")+n2(cx+r*Math.cos(a))+" "+n2(cy-r*Math.sin(a));
  }
  return d+"Z";
}
function base(cx,cy,letter,up,c){
  /* purine = fused six + five, pyrimidine = six.  Drawn small and plain. */
  const s=up?1:-1, y=cy+s*30;
  let g='<path d="'+ringPath(cx,y,26,6,90)+'" fill="#fff" stroke="'+c+'" stroke-width="2.4"/>';
  if(PURINE(letter))
    g+='<path d="'+ringPath(cx+30,y,19,5,90)+'" fill="#fff" stroke="'+c+'" stroke-width="2.4"/>';
  g+='<text x="'+n2(cx)+'" y="'+n2(y+9)+'" text-anchor="middle" font-size="25" '+
     'font-weight="700" fill="'+c+'">'+letter+'</text>';
  return g;
}
function phos(x,y,c,mode){
  /* mode: "p" a phosphate in the backbone, "oh" a free hydroxyl end */
  if(mode==="oh")
    return '<text x="'+n2(x)+'" y="'+n2(y+9)+'" text-anchor="middle" font-size="24" '+
           'font-weight="700" fill="'+c+'">OH</text>';
  return '<circle cx="'+n2(x)+'" cy="'+n2(y)+'" r="17" fill="#fff" stroke="'+c+
         '" stroke-width="2.4"/><text x="'+n2(x)+'" y="'+n2(y+8)+'" text-anchor="middle" '+
         'font-size="21" font-weight="700" fill="'+c+'">P</text>';
}

function draw(m, x0){
  x0 = x0 || 240;
  let g="";
  ["top","bot"].forEach(function(which){
    const up = which==="top", y = up?TY:BY, seq = up?m.top:m.bot;
    for(let i=0;i<m.n;i++){
      const cx=x0+i*PITCH, r=m.role[which][i]||{bb:"on",base:"on"};
      const cb=col(r.bb), cbase=col(r.base);
      g+='<path d="'+sugar(cx,y,up)+'" fill="none" stroke="'+cb+'" stroke-width="2.6" '+
         'stroke-linejoin="round"/>';
      g+='<path d="M'+n2(cx)+' '+n2(y)+'V'+n2(y+(up?18:-18))+'" fill="none" stroke="'+cb+
         '" stroke-width="2.4"/>';
      g+=base(cx,y,seq[i],up,cbase);
      if(i<m.n-1){                                   /* the phosphate that follows */
        const px=cx+PITCH/2;
        const hot=m.cuts.some(c=>c.strand===which && c.after===i);
        g+='<path d="M'+n2(cx+SR)+' '+n2(y)+'H'+n2(px-17)+'" fill="none" stroke="'+
           (hot?HOT:cb)+'" stroke-width="2.6"/>';
        g+='<path d="M'+n2(px+17)+' '+n2(y)+'H'+n2(cx+PITCH-SR)+'" fill="none" stroke="'+
           (hot?HOT:col((m.role[which][i+1]||{}).bb))+'" stroke-width="2.6"/>';
        g+=phos(px,y,hot?HOT:cb,"p");
      }
    }
    /* the two ends */
    const l=x0-SR, rgt=x0+(m.n-1)*PITCH+SR;
    const e5 = up?m.ends.t5:m.ends.b5, e3 = up?m.ends.t3:m.ends.b3;
    const leftIs5 = up;                              /* bottom runs the other way */
    g+='<path d="M'+n2(l)+' '+n2(y)+'H'+n2(l-42)+'" fill="none" stroke="'+INK+'" stroke-width="2.6"/>';
    g+=phos(l-64,y,INK,(leftIs5?e5:e3)==="phos"?"p":"oh");
    g+='<path d="M'+n2(rgt)+' '+n2(y)+'H'+n2(rgt+42)+'" fill="none" stroke="'+INK+'" stroke-width="2.6"/>';
    g+=phos(rgt+64,y,INK,(leftIs5?e3:e5)==="phos"?"p":"oh");
    g+='<text x="'+n2(l-104)+'" y="'+n2(y+8)+'" text-anchor="middle" font-size="22" fill="'+MUT+
       '">'+(leftIs5?"5&#8242;":"3&#8242;")+'</text>';
    g+='<text x="'+n2(rgt+104)+'" y="'+n2(y+8)+'" text-anchor="middle" font-size="22" fill="'+MUT+
       '">'+(leftIs5?"3&#8242;":"5&#8242;")+'</text>';
  });
  /* base pairing */
  for(let i=0;i<m.n;i++){
    const cx=x0+i*PITCH;
    const c = (m.role.top[i].base==="bg"||m.role.bot[i].base==="bg") ? GREY : MUT;
    g+='<path d="M'+n2(cx)+' '+n2(TY+62)+'V'+n2(BY-62)+'" fill="none" stroke="'+c+
       '" stroke-width="2" stroke-dasharray="6 8"/>';
  }
  /* modifications ride on top of whatever they modify */
  m.mods.forEach(function(mo){
    const cx=x0+mo.i*PITCH, up=mo.strand==="top", y=up?TY:BY;
    const my=up?y+30:y-30;
    /* the methyl hangs off the base AWAY from the backbone — pointing it back
       toward the strand ran it straight through the phosphate */
    const away = up ? 1 : -1;
    if(mo.type==="methyl"){
      g+='<path d="M'+n2(cx+22)+' '+n2(my+away*14)+'l28 '+n2(away*20)+
         '" fill="none" stroke="'+HOT+'" stroke-width="3"/>';
      g+='<text x="'+n2(cx+58)+'" y="'+n2(my+away*44)+'" font-size="22" font-weight="700" fill="'+
         HOT+'">CH&#8323;</text>';
    }
    if(mo.type==="biotin"){
      g+='<path d="M'+n2(cx+22)+' '+n2(my+away*14)+'l28 '+n2(away*20)+
         '" fill="none" stroke="'+HOT+'" stroke-width="3"/>';
      g+='<circle cx="'+n2(cx+62)+'" cy="'+n2(my+away*40)+'" r="13" fill="'+HOT+'"/>';
      g+='<text x="'+n2(cx+84)+'" y="'+n2(my+away*47)+'" font-size="21" font-weight="700" fill="'+
         HOT+'">biotin</text>';
    }
  });
  return g;
}

window.DNAModel={ make, draw, revcomp, comp:t=>t.split('').map(c=>COMP[c]||'N').join(''), HOT, PITCH };
})();
