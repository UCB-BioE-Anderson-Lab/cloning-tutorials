/* ------------------------------------------------------------------ *
 * lambdaexo.js — lambda exonuclease, answered by running it.
 *
 * The slide used to be a before-and-after with a labelled arrow between
 * them: duplex on top, surviving strand underneath. Everything it said
 * was true and none of it was watchable, and the one thing a student has
 * to get right here is DIRECTION -- which end is eaten and therefore
 * which strand is left. So it is one molecule now, and the click runs
 * the reaction on it.
 *
 * Lambda exo walks 5'->3'. The phosphorylated strand's 5' end is on the
 * LEFT, so it recedes to the right and the strand underneath it is what
 * survives. The 5' P label rides the retreating end rather than sitting
 * still: lambda exo leaves a phosphate on the new 5' terminus every time
 * it takes a nucleotide off, so the label is accurate the whole way, and
 * a moving label is what makes the direction unmissable.
 *
 * Level of iconography: BARBED LINES. Sequence is irrelevant here --
 * only the ends matter -- and the letters slide two clicks earlier
 * already carried the sequence-level view of an exonuclease.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const INK="#111111", BLUE="#004373", RED="#ba3a13", MUTED="#767676";
const X0=300, X1=1300, TOPY=470, BOTY=528;
const LABY=664, SUBY=710;
const BARB=26, BW=0.49;
const n2=v=>Math.round(v*10)/10;

/* a strand from (x1,y) to (x2,y); the 3' tip -- and the half barb -- is
   at (x2,y), laid back on the outer side of the duplex */
function strand(x1,y1,x2,y2){
  if (Math.abs(x2-x1) < 1) return "";
  const th=Math.atan2(y1-y2, x1-x2);
  const bx=x2+BARB*Math.cos(th+BW), by=y2+BARB*Math.sin(th+BW);
  return "M"+n2(x1)+" "+n2(y1)+"L"+n2(x2)+" "+n2(y2)+
         "M"+n2(bx)+" "+n2(by)+"L"+n2(x2)+" "+n2(y2);
}

const S=[
  { a:X0, dur:0,
    label:"one 5′ end carries a phosphate, the other does not",
    sub:"a synthesiser delivers a 5′ hydroxyl, so you order one primer phosphorylated",
    note:"Here is a specificity you can aim. Lambda exonuclease runs five prime to three prime on a double-stranded end, like T5 does, but it strongly prefers that end to carry a five prime phosphate. A PCR product made with ordinary oligos has no phosphate on either strand: synthesisers deliver a five prime hydroxyl. So order one of your two primers phosphorylated, and now only one of the two ends of your product is a substrate. Before I run it: work out which strand you are going to be left with.",
    desc:"A double-stranded DNA drawn as two antiparallel barbed lines. The top strand's 5-prime end, on the left, is labelled 5-prime P in blue. The bottom strand's 5-prime end, on the right, is labelled 5-prime OH in grey. Each 3-prime end carries a half barb." },
  { a:X1, dur:1500,
    label:"Lambda Exo · 5′→3′ · from the phosphorylated end",
    call:"one defined single strand, the one you left unphosphorylated",
    note:"Lambda exo takes the phosphorylated strand, and it takes it from the left, because that is where that strand's five prime end is. Watch the label travel: every nucleotide it removes leaves a phosphate on the new five prime end, so that end stays a substrate and the enzyme keeps going right through. What is left is the other strand, on its own, in a defined orientation, and that is how you make long single-stranded DNA without a phage. Two cautions. In the NEB table that phosphate column reads plus-slash-minus, not minus: without the phosphate it is slow, not dead. And single-stranded DNA is a poor substrate for it too, not a forbidden one, so the strand you want back is only relatively safe. Do not over-incubate.",
    desc:"The top strand is eaten away from its left-hand end. Its 5-prime P label travels rightward with the retreating end until the whole strand is gone. What remains is the bottom strand alone, now drawn in red, still carrying its 3-prime half barb at the left and its 5-prime hydroxyl at the right." }
];

window.Deck.sequence("lambdaexo", function(slide){
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  svg.innerHTML=
    '<g fill="none" stroke-width="3" stroke-linecap="round">' +
      '<path data-r="top" stroke="'+INK+'"/><path data-r="bot" stroke="'+INK+'"/>' +
    '</g>' +
    '<text data-r="plab" y="'+(TOPY+10)+'" text-anchor="end" font-family="inherit" ' +
      'font-size="27" font-weight="700" fill="'+BLUE+'">5&#8242;&#8202;P</text>' +
    '<text x="'+(X1+16)+'" y="'+(BOTY+10)+'" font-family="inherit" font-size="26" ' +
      'fill="'+MUTED+'">5&#8242;&#8202;OH</text>' +
    '<text data-r="label" x="800" y="'+LABY+'" text-anchor="middle" font-family="inherit" ' +
      'font-weight="700" font-size="30" fill="'+INK+'"></text>' +
    '<text data-r="sub" x="800" y="'+SUBY+'" text-anchor="middle" font-family="inherit" ' +
      'font-size="26" fill="'+MUTED+'"></text>' +
    '<text data-r="call" x="800" y="'+SUBY+'" text-anchor="middle" font-family="inherit" ' +
      'font-weight="700" font-size="30" fill="'+RED+'" opacity="0"></text>';
  slide.appendChild(svg);
  const r={};
  svg.querySelectorAll("[data-r]").forEach(el=>r[el.getAttribute("data-r")]=el);
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur=S[0].a, raf=null;

  function paint(a){
    r.top.setAttribute("d", strand(a, TOPY, X1, TOPY));
    r.bot.setAttribute("d", strand(X1, BOTY, X0, BOTY));
    /* the survivor turns red only once it IS the survivor -- colouring it
       early would answer the question the first step is asking */
    r.bot.setAttribute("stroke", a > X1 - 60 ? RED : INK);
    r.plab.setAttribute("x", n2(a - 16));
    /* consumed with the last nucleotide it was sitting on */
    r.plab.setAttribute("opacity", n2(Math.max(0, Math.min(1, (X1 - 40 - a)/70))));
  }

  function go(i, animated){
    if(raf){cancelAnimationFrame(raf); raf=null;}
    r.label.textContent = S[i].label || "";
    r.sub  .textContent = S[i].call ? "" : (S[i].sub || "");
    r.call .textContent = S[i].call || "";
    r.call .setAttribute("opacity", S[i].call ? "1" : "0");
    const to=S[i].a;
    if(animated===false || reduce.matches || !S[i].dur){ cur=to; paint(cur); return; }
    const from=cur, t0=performance.now(), dur=S[i].dur;
    const ease=t=>t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
    raf=requestAnimationFrame(function f(now){
      const t=Math.min(1,(now-t0)/dur);
      cur=from+(to-from)*ease(t);
      paint(cur);
      if(t<1) raf=requestAnimationFrame(f); else raf=null;
    });
  }
  go(0,false);
  return { steps:S.map(x=>({note:x.note, desc:x.desc})), go:go };
});
})();
