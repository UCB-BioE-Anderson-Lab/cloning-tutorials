/* ------------------------------------------------------------------ *
 * exosap.js — heat-killable or not, and why anyone cares.
 *
 * One property, shown twice.
 *
 * TOP  ExoSAP is the payoff. After a PCR the tube holds the product,
 *      leftover primers and leftover dNTPs. Exonuclease I eats the
 *      primers, SAP takes the phosphates off the dNTPs, and then BOTH
 *      DIE IN A HEAT STEP — which is the only reason you can sequence
 *      straight out of the same tube without cleaning anything up.
 *
 * BOTTOM  CIP is the trap. Same heat step, and it is still working. So
 *      the phosphates you were relying on — the insert's 5' ends — come
 *      off, and the ligation you set up quietly does nothing.
 *
 * Red is the enzyme and the phosphate it acts on; blue is DNA that is
 * not the point; ink is the DNA you are trying to keep.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const INK="#111111", BLUE="#004373", RED="#ba3a13", MUT="#767676";
const n2=v=>Math.round(v*10)/10;
const lerp=(a,b,t)=>a+(b-a)*t;

const line=(a,b,c,w)=>'<path d="M'+n2(a[0])+' '+n2(a[1])+'L'+n2(b[0])+' '+n2(b[1])+
  '" fill="none" stroke="'+c+'" stroke-width="'+(w||4)+'" stroke-linecap="round"/>';
const txt=(x,y,t,c,sz,w)=>'<text x="'+n2(x)+'" y="'+n2(y)+'" text-anchor="middle" font-size="'+
  (sz||23)+'" font-weight="'+(w||700)+'" fill="'+(c||INK)+'">'+t+'</text>';
/* a strand: barb marks the 3' end */
function strand(x1,x2,y,c,rev){
  const tip=rev?x1:x2, back=rev?18:-18;
  return line([x1,y],[x2,y],c)+line([tip,y],[tip+back,y+(rev?10:-10)],c);
}
function duplex(x1,x2,y,c){ return strand(x1,x2,y,c,false)+strand(x1,x2,y+26,c,true); }
function P(x,y,gone,c){
  return '<g opacity="'+(1-gone*0.92).toFixed(2)+'" transform="translate('+n2(x)+' '+
    n2(y-gone*46)+')"><circle r="14" fill="#fff" stroke="'+(c||RED)+'" stroke-width="3"/>'+
    '<text y="7" text-anchor="middle" font-size="19" font-weight="700" fill="'+(c||RED)+
    '">P</text></g>';
}
function dntp(x,y,gone){
  const r=15, v=[90,162,234,306,18].map(d=>[x+r*Math.cos(d*Math.PI/180),
                                            y-r*Math.sin(d*Math.PI/180)]);
  return '<path d="M'+v.map(p=>n2(p[0])+" "+n2(p[1])).join("L")+'Z" fill="none" stroke="'+
    BLUE+'" stroke-width="3.4"/>'+
    '<g opacity="'+(1-gone).toFixed(2)+'">'+line(v[2],[x-26,y+10],BLUE,3.4)+'</g>'+
    P(x-40,y+10,gone);
}
/* an enzyme, named; struck through and greyed once heat has taken it */
function enz(x,y,name,dead){
  const c = dead>0.5 ? MUT : RED;
  let g=txt(x,y,name,c,26);
  if(dead>0.5){
    const w=name.length*7.6+16;
    g+='<path d="M'+n2(x-w)+' '+n2(y-8)+'H'+n2(x+w)+'" stroke="'+MUT+
       '" stroke-width="3" fill="none"/>';
  }
  return g;
}

window.Deck.sequence("exosap", function(slide){
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  slide.appendChild(svg);

  /* s = {prime, dntp, heat, low, strip} */
  function paint(s){
    let g="";
    /* ---------- top: ExoSAP ---------- */
    g+=txt(800,178,"ExoSAP &mdash; clean up a PCR without touching it",INK,30);
    g+=duplex(210,560,262,INK)+txt(385,340,"PCR product",MUT,21,600);
    /* leftover primers, eaten by Exonuclease I */
    [0,1,2].forEach(function(k){
      const o=(1-s.prime).toFixed(2), x=250+k*118;
      g+='<g opacity="'+o+'">'+strand(x,x+82,392,BLUE)+'</g>';
    });
    g+='<g opacity="'+(1-s.prime).toFixed(2)+'">'+txt(385,440,"leftover primers",MUT,21,600)+'</g>';
    /* leftover dNTPs, dephosphorylated by SAP */
    [0,1,2].forEach(k=>{ g+=dntp(760+k*104,392,s.dntp); });
    g+=txt(864,440,"leftover dNTPs",MUT,21,600);
    g+=enz(1230,268,"Exonuclease I",s.heat);
    g+=enz(1230,330,"SAP",s.heat);
    if(s.heat>0.5) g+=txt(1230,392,"80&deg;C &mdash; both gone",MUT,22,600);
    /* below the product, in the space the primers have just vacated */
    if(s.heat>0.5) g+=txt(385,392,"sequence straight from the tube",BLUE,23,700);

    /* ---------- bottom: CIP ---------- */
    if(s.low>0){
      g+='<g opacity="'+s.low.toFixed(2)+'">';
      g+='<path d="M150 520H1450" stroke="'+MUT+'" stroke-width="1.6" stroke-dasharray="7 9"/>';
      g+=txt(800,584,"the same heat step, with CIP",INK,30);
      /* vector, already phosphatased, and an insert that still has its 5' P */
      g+=duplex(250,640,668,INK)+txt(445,742,"phosphatased vector",MUT,21,600);
      g+=duplex(760,1080,668,INK)+txt(920,742,"insert",MUT,21,600);
      g+=P(760,668,s.strip)+P(1080,694,s.strip);
      g+=enz(1290,650,"CIP",0);
      g+=txt(1290,700,"heat does not kill it",MUT,22,600);
      if(s.strip>0.5) g+=txt(920,790,"its 5&#8242; phosphates go too &mdash; nothing ligates",RED,25,700);
      g+='</g>';
    }
    svg.innerHTML=g;
  }

  const S=[
    {s:{prime:0,dntp:0,heat:0,low:0,strip:0},
     note:"After a PCR your product is in there, but so is everything you did not use: unincorporated primers, and unincorporated dNTPs. Both of them will wreck a sequencing reaction — spare primers give you a second priming site, spare dNTPs throw the ratio of terminators off.",
     desc:"A PCR product drawn as a duplex, with three leftover single-stranded primers and three leftover dNTPs, each dNTP carrying a red phosphate."},
    {s:{prime:1,dntp:1,heat:0,low:0,strip:0},
     note:"ExoSAP is two enzymes in one tube. Exonuclease I is a three prime to five prime exonuclease that only acts on single-stranded DNA, so it eats every leftover primer and cannot touch the double-stranded product. And SAP, shrimp alkaline phosphatase, takes the phosphates off the leftover dNTPs, which is all it takes to make them useless to a polymerase. Neither one touches what you want.",
     desc:"The primers have gone and every dNTP has lost its phosphate. The PCR product is untouched."},
    {s:{prime:1,dntp:1,heat:1,low:0,strip:0},
     note:"And here is the step the whole thing depends on. Both of those enzymes are heat labile, so a short incubation at eighty degrees destroys them, and you can put the tube straight into a sequencing reaction without a column, a gel, or a precipitation. That is the entire appeal of ExoSAP: it is a cleanup that costs you one incubation and no sample.",
     desc:"Both enzyme names are struck through and greyed, labelled 80 degrees, both gone. A line by the product reads: sequence straight from the tube."},
    {s:{prime:1,dntp:1,heat:1,low:1,strip:0},
     note:"Now the trap, and it catches people every year. Calf intestinal phosphatase does the same chemistry as SAP and it is cheaper and more robust — but robust is exactly the problem, because heat does not kill it. Run the same heat step and CIP is still working.",
     desc:"Below a dividing line, the same heat step with CIP: a phosphatased vector and an insert that still carries its 5-prime phosphates, and CIP named in red and not struck through, labelled heat does not kill it."},
    {s:{prime:1,dntp:1,heat:1,low:1,strip:1},
     note:"So when you add your insert and your ligase, CIP takes the insert's five prime phosphates off as well. Ligase has nothing to seal, and you get no colonies and no error message — the reaction looks like it ran. If you phosphatase with CIP you have to physically remove it, by column or by extraction, before you ligate. With SAP you heat the tube. That is the whole difference, and it is worth knowing before you choose which bottle to pick up.",
     desc:"The insert's phosphates have gone as well, with a line reading: its 5-prime phosphates go too, nothing ligates."}
  ];
  let cur=null, raf=null;
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  function go(i,animated){
    const to=S[i].s;
    if(raf){cancelAnimationFrame(raf);raf=null;}
    if(!cur||animated===false||reduce.matches){ cur=Object.assign({},to); paint(cur); return; }
    const from=Object.assign({},cur), t0=performance.now(), dur=620;
    const ease=t=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    raf=requestAnimationFrame(function f(now){
      const p=Math.min(1,(now-t0)/dur), e=ease(p), s={};
      Object.keys(to).forEach(k=>{ s[k]=lerp(from[k],to[k],e); });
      paint(s); cur=s;
      if(p<1) raf=requestAnimationFrame(f); else raf=null;
    });
  }
  go(0,false);
  return { steps:S.map(x=>({note:x.note,desc:x.desc})), go:go };
});
})();
