/* ------------------------------------------------------------------ *
 * whichbond.js — the deck's recurring question, on the shared molecule.
 *
 * The original slides posed the question over a borrowed raster and put
 * the answer only in the speaker notes, so the figure never answered
 * anything.  Here the answer RINGS THE BOND on the drawing, which is
 * what the pptx did with a hand-drawn circle and what a text line under
 * the picture cannot do.
 *
 * One sequence, parameterised by the slide's data-bond attribute, so
 * every section asks its own question of the same molecule.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const RED="#ba3a13", MUTED="#767676";
const NS="http://www.w3.org/2000/svg";
const n2=v=>Math.round(v*10)/10;

const Q={
  ecori:{ anchor:"scissile",
    q:"Which bond is broken&hellip; by <tspan font-style=\"italic\">Eco</tspan>RI, G/AATTC?",
    a:"the bond from the phosphate to the 3&#8242; oxygen",
    t:"a nuclease leaves a 5&#8242; phosphate and a free 3&#8242; OH",
    note:"Every restriction enzyme, every exonuclease, every nuclease of any kind breaks this one bond: the ester between the phosphorus and the three prime oxygen. Water attacks the phosphorus, that bond breaks, and the phosphate stays behind on the five prime side. So the products always come out the same way round — a five prime phosphate on one fragment, a free three prime hydroxyl on the other. Hold on to that, because it is exactly what a ligase needs to put them back together, and it is why a phosphatase can stop that from happening.",
    desc:"The answer is marked on the molecule: a ring is drawn around the bond between the phosphorus and the 3-prime oxygen, and the caption notes that a nuclease leaves a 5-prime phosphate and a free 3-prime hydroxyl." },
  exo:{ anchor:"scissile",
    q:"Which bond is broken&hellip; by <tspan font-style=\"italic\">all</tspan> exonucleases?",
    a:"the same bond &mdash; phosphate to 3&#8242; oxygen",
    t:"the difference between them is never the bond &mdash; it is which end they start from",
    note:"The same bond again, and that is the point of asking twice. An endonuclease and an exonuclease break the identical linkage by the identical chemistry. Nothing about the bond tells you which enzyme did it. What separates every enzyme in this section from every other one is not the reaction, it is the address: which kind of end it will start from, whether it needs a free end at all, whether it wants single or double stranded DNA. Same chemistry, four different questions about where it is allowed to happen.",
    desc:"The same phosphate-to-3-prime-oxygen bond is ringed, with the caption noting that exonucleases differ from endonucleases in where they start, not in which bond they break." },
  ligase:{ anchor:"scissile",
    q:"Which bond is formed&hellip; by T4 DNA Ligase?",
    a:"the same bond &mdash; phosphate to 3&#8242; oxygen",
    t:"the 3&#8242; OH attacks the 5&#8242; phosphate that is already there",
    note:"The same bond, made instead of broken. The three prime hydroxyl is the nucleophile and it attacks the phosphate already sitting on the five prime end of the other fragment. That is why ligase brings no phosphate of its own, and it is the whole reason a five prime phosphate is a licence to be ligated: take it away with a phosphatase and this reaction has nothing to attack.",
    desc:"The same bond is ringed on the molecule, now as the bond that ligase forms rather than the one a nuclease breaks." },
  pnk:{ anchor:"p5end",
    q:"T4 PNK phosphorylates a free 5&#8242;-OH. Where can it act here?",
    a:"onto the free 5&#8242; hydroxyl, at the end of the chain",
    t:"the only free one &mdash; every other 5&#8242; oxygen is already in the backbone",
    note:"Only one place on this molecule, and finding it is the exercise. Every other five prime oxygen here is already esterified into the backbone, so there is nothing for a kinase to add to. The one free five prime hydroxyl is at the end of the chain, and that is where PNK works. Polynucleotide kinase puts a phosphate onto the free five prime hydroxyl at the end of the molecule, transferring it from the gamma position of ATP. That is the end an oligo comes off the synthesiser with, and the end a PCR product carries: bare. Which is why a PCR product will not ligate until you kinase it.",
    desc:"A ring is drawn around the free 5-prime hydroxyl at the left end of the molecule, marking where polynucleotide kinase installs a phosphate." }
};

window.Deck.sequence("whichbond", function(slide){
  const key=slide.getAttribute("data-bond")||"ecori";
  const c=Q[key]||Q.ecori;
  const a=window.CHEM.A[c.anchor];
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  svg.innerHTML=
    '<text x="800" y="150" text-anchor="middle" font-size="40" font-weight="700" '+
      'fill="#111111">'+c.q+'</text>'+
    '<g transform="translate(0 34) scale(0.96)">'+window.CHEM.draw()+'</g>'+
    '<ellipse data-r="ring" cx="'+a.x+'" cy="'+(a.y+34)+'" rx="'+a.rx+'" ry="'+a.ry+'" '+
      'transform="rotate('+a.rot+' '+a.x+' '+(a.y+34)+')" fill="none" stroke="'+RED+
      '" stroke-width="5" opacity="0"/>'+
    '<text data-r="ans" x="800" y="838" text-anchor="middle" font-size="31" '+
      'font-weight="700" fill="'+RED+'" opacity="0">'+c.a+'</text>'+
    '<text data-r="tail" x="800" y="878" text-anchor="middle" font-size="25" '+
      'fill="'+MUTED+'" opacity="0">'+c.t+'</text>';
  slide.appendChild(svg);
  const r={}; svg.querySelectorAll("[data-r]").forEach(e=>r[e.getAttribute("data-r")]=e);
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur=null, raf=null;

  function paint(v){
    r.ring.setAttribute("opacity",n2(v));
    /* the ring draws itself on, the way a hand would */
    const C=2*Math.PI*Math.sqrt((a.rx*a.rx+a.ry*a.ry)/2);
    r.ring.setAttribute("stroke-dasharray",n2(C));
    r.ring.setAttribute("stroke-dashoffset",n2(C*(1-v)));
    r.ans.setAttribute("opacity",n2(Math.max(0,(v-0.45)/0.55)));
    r.tail.setAttribute("opacity",n2(Math.max(0,(v-0.7)/0.3)));
  }

  const S=[
    { v:0, note:"Look at the molecule before the answer goes up. One phosphate, bridging two sugars, through a three prime oxygen on one side and a five prime oxygen on the other. Only one of those two ester bonds is the one this enzyme breaks. Give the room a moment to pick.",
      desc:"A dinucleotide drawn as skeletal chemistry: two deoxyribose rings, a phosphate bridging them through 3-prime and 5-prime oxygens, with an explicit P equals O double bond and a negatively charged oxygen. A free 5-prime hydroxyl on the left and a free 3-prime hydroxyl on the right." },
    { v:1, note:c.note, desc:c.desc }
  ];

  function go(i,animated){
    const to=S[i].v;
    if(raf){cancelAnimationFrame(raf);raf=null;}
    if(cur===null||animated===false||reduce.matches){cur=to;paint(cur);return;}
    const from=cur, t0=performance.now(), dur=700;
    const ease=t=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    raf=requestAnimationFrame(function f(now){
      const t=Math.min(1,(now-t0)/dur), e=ease(t);
      cur=from+(to-from)*e; paint(cur);
      if(t<1) raf=requestAnimationFrame(f); else raf=null;
    });
  }
  go(0,false);
  return { steps:S.map(x=>({note:x.note,desc:x.desc})), go:go };
});
})();
