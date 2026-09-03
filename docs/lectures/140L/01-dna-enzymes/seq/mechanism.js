/* ------------------------------------------------------------------ *
 * mechanism.js — the lecture's first technical beat.
 *
 * TWO reactions, kept distinct on purpose.  Both are a nucleophile
 * attacking the same phosphorus, but the nucleophile CLASS differs and
 * that difference is the whole taxonomy:
 *
 *   hydrolysis            H-O-H attacks  -> the bond is destroyed
 *   transphosphorylation  C-O-H attacks  -> the bond is moved
 *
 * Do NOT collapse these into "an OH attacks". Water and an alcohol are
 * different nucleophile classes and the distinction is the point.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const INK="#111111", BLUE="#004373", RED="#ba3a13", MUTED="#767676";
const NS="http://www.w3.org/2000/svg";
const n2 = v => Math.round(v*10)/10;

const PX=800, PY=560, R=30;
const OUP=[800,446], ODN=[800,674], O3=[652,560], O5=[948,560];
const LEFT=[470,560], RIGHT=[1130,560];

function txt(x,y,t,sz,col,w,anc){
  return '<text x="'+x+'" y="'+y+'" text-anchor="'+(anc||"middle")+'" font-size="'+sz+
         '" font-weight="'+(w||400)+'" fill="'+(col||INK)+'">'+t+'</text>';
}
function bond(a,b,col,w){
  return '<path d="M'+a[0]+' '+a[1]+'L'+b[0]+' '+b[1]+'" fill="none" stroke="'+(col||INK)+
         '" stroke-width="'+(w||2.8)+'" stroke-linecap="round"/>';
}
/* a curved electron-pushing arrow: from a lone pair to the atom it attacks */
function push(d, col){
  return '<path d="'+d+'" fill="none" stroke="'+(col||RED)+'" stroke-width="3.2" '+
         'marker-end="url(#mechHead)"/>';
}

window.Deck.sequence("mechanism", function(slide){
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");

  let g='<defs><marker id="mechHead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.5" '+
        'markerHeight="5.5" orient="auto-start-reverse">'+
        '<path d="M0 0L10 5L0 10" fill="none" stroke="'+RED+'" stroke-width="2.2"/></marker></defs>';

  /* the phosphate itself — never moves, because that is the point */
  g+='<g>'+
     bond(O3,[PX-R,PY])+bond([PX+R,PY],O5)+bond(O3,LEFT)+bond(O5,RIGHT)+
     bond([PX,PY-R],[OUP[0],OUP[1]+16])+
     '<path d="M'+(PX-9)+' '+(PY-R)+'V'+(OUP[1]+16)+'" fill="none" stroke="'+INK+
       '" stroke-width="2.8"/>'+
     bond([PX,PY+R],[ODN[0],ODN[1]-18])+
     '<circle cx="'+PX+'" cy="'+PY+'" r="'+R+'" fill="#fff" stroke="'+INK+'" stroke-width="3"/>'+
     txt(PX,PY+11,"P",30,INK,700)+
     txt(OUP[0],OUP[1],"O",27,INK,600)+txt(ODN[0],ODN[1]+9,"O&#8315;",27,INK,600)+
     txt(O3[0],O3[1]+10,"O",27,INK,600)+txt(O5[0],O5[1]+10,"O",27,INK,600)+
     txt(O3[0]-4,O3[1]-30,"3&#8242;",22,MUTED)+txt(O5[0]+4,O5[1]-30,"5&#8242;",22,MUTED)+
     txt(LEFT[0]-26,LEFT[1]+10,"sugar",24,MUTED,400,"end")+
     txt(RIGHT[0]+26,RIGHT[1]+10,"sugar",24,MUTED,400,"start")+
     '</g>';

  /* the nucleophile, its arrow, and the bond that breaks */
  g+='<g data-r="nuc" opacity="0">'+
       '<text data-r="nuclab" x="600" y="392" text-anchor="middle" font-size="34" '+
         'font-weight="700" fill="'+RED+'"></text>'+
       push("M636 414Q712 452 763 524", RED)+
     '</g>';
  g+='<g data-r="brk" opacity="0">'+
       push("M886 530Q916 494 946 522", RED)+
     '</g>';
  /* what leaves */
  g+='<g data-r="gone" opacity="0">'+
       txt(1002,494,"leaves",22,MUTED,400,"start")+
     '</g>';

  g+=txt(800,236,"","31",INK,700).replace('<text','<text data-r="cap"');
  g+=txt(800,286,"","26",MUTED).replace('<text','<text data-r="sub"');
  g+=txt(800,790,"","25",BLUE,700).replace('<text','<text data-r="who"');
  svg.innerHTML=g;
  slide.appendChild(svg);

  const r={}; svg.querySelectorAll("[data-r]").forEach(e=>r[e.getAttribute("data-r")]=e);
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  const KEYS=["nuc","brk","gone"];
  let cur=null, raf=null;

  function paint(s){
    r.nuc.setAttribute("opacity",n2(s.nuc));
    r.brk.setAttribute("opacity",n2(s.brk));
    r.gone.setAttribute("opacity",n2(s.gone));
  }

  const S=[
    { s:{nuc:0,brk:0,gone:0}, nl:"",
      cap:"One phosphodiester bond",
      sub:"a phosphorus holding two sugars together, through their 3&#8242; and 5&#8242; oxygens",
      who:"every enzyme in this lecture acts right here",
      note:"Before any enzyme, the bond. A phosphorus atom, double bonded to one oxygen, carrying a negative charge on another, and bridging two sugars through their three prime and five prime oxygens. That is the phosphodiester bond, and it is the only thing any enzyme in this lecture does anything to. Everything you will see today is an attack on this phosphorus.",
      desc:"A single phosphodiester bond drawn at atomic scale: a central phosphorus with a double-bonded oxygen above, a negatively charged oxygen below, and ester oxygens left and right joining it to the 3-prime and 5-prime sugars." },

    { s:{nuc:1,brk:1,gone:1}, nl:"H&#8212;O&#8212;H",
      cap:"1 &nbsp;Hydrolysis &mdash; water attacks",
      sub:"the phosphate ends up on water, and the bond is <tspan font-weight=\"700\">destroyed</tspan>",
      who:"nucleases &middot; phosphatases",
      note:"First mechanism. The nucleophile is water. Its oxygen attacks the phosphorus, the bond to the leaving sugar breaks, and the phosphate is left on the water. Nothing is joined to anything: the bond is gone. That is hydrolysis, and it is what every nuclease and every phosphatase does. Endonucleases, exonucleases, phosphatases — one reaction, three sections of this lecture.",
      desc:"A water molecule, labelled H-O-H, attacks the phosphorus. A curved red arrow runs from the water to the phosphorus, and a second curved arrow shows the bond to the departing sugar breaking." },

    { s:{nuc:1,brk:1,gone:1}, nl:"C&#8212;O&#8212;H",
      cap:"2 &nbsp;Transphosphorylation &mdash; an alcohol attacks",
      sub:"the phosphate is handed to a new partner, and the bond is <tspan font-weight=\"700\">moved</tspan>",
      who:"kinases &middot; polymerases &middot; ligases &middot; recombinases",
      note:"Second mechanism, and it is genuinely a different reaction. The nucleophile is not water now, it is an alcohol — a carbon bearing a hydroxyl. A sugar's three prime hydroxyl in a polymerase or a ligase. The five prime hydroxyl in a kinase. A serine or tyrosine on the protein itself in a recombinase. The chemistry at the phosphorus looks the same, but what you end up with does not: the phosphate is not released, it is handed to the attacking alcohol. A bond is moved rather than destroyed. Be careful here. It is tempting to say both mechanisms are just an OH attacking a phosphate, and that overgeneralises. Water and an alcohol are different nucleophile classes, and the difference between destroying a bond and relocating it is exactly the difference this lecture is organised around.",
      desc:"The same phosphorus, now attacked by an alcohol labelled C-O-H rather than by water. The curved arrows are identical; what differs is the attacking molecule and therefore the product." },

    { s:{nuc:1,brk:0,gone:0}, nl:"H&#8212;O&#8212;H &nbsp;or&nbsp; C&#8212;O&#8212;H",
      cap:"Same phosphorus. The only question is what attacks.",
      sub:"break it or move it &mdash; and after that, only specificity differs",
      who:"which end &middot; which sequence &middot; which strand &middot; which state",
      note:"So: two mechanisms, and always the same phosphorus. Every enzyme for the rest of the lecture is attacking this atom, and the first thing to ask about any of them is which nucleophile it brings — water, and the bond is destroyed, or an alcohol, and the bond is moved. That is the whole of the chemistry. Everything else, and it is most of what you will actually learn today, is specificity: which kind of end an enzyme recognises, which sequence, which strand, whether the DNA is circular, whether a base is methylated. Same reaction, wildly different rules about where it is allowed to happen. That is the cone this lecture opens up, and the reason the catalogue has hundreds of entries for two reactions.",
      desc:"Both nucleophiles shown together against the same phosphorus, with the closing claim that the chemistry is settled in two mechanisms and everything remaining is a question of specificity." }
  ];

  function go(i,animated){
    const to=S[i].s;
    if(raf){cancelAnimationFrame(raf);raf=null;}
    r.cap.innerHTML=S[i].cap; r.sub.innerHTML=S[i].sub;
    r.who.innerHTML=S[i].who; r.nuclab.innerHTML=S[i].nl;
    if(!cur||animated===false||reduce.matches){cur=Object.assign({},to);paint(cur);return;}
    const from=Object.assign({},cur), t0=performance.now(), dur=700;
    const ease=t=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    raf=requestAnimationFrame(function f(now){
      const t=Math.min(1,(now-t0)/dur), e=ease(t), s={};
      KEYS.forEach(k=>s[k]=from[k]+(to[k]-from[k])*e);
      paint(s); cur=s;
      if(t<1) raf=requestAnimationFrame(f); else raf=null;
    });
  }
  go(0,false);
  return { steps:S.map(x=>({note:x.note,desc:x.desc})), go:go };
});
})();
