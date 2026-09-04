/* ------------------------------------------------------------------ *
 * op-exonuclease.js — the operator for the exonuclease class.
 *
 * The counterpart to the endonuclease operator, and the contrast is
 * the whole point of having both:
 *
 *   endonuclease   one cut, somewhere INSIDE, often at a read sequence
 *   exonuclease    nucleotide after nucleotide, only from an END
 *
 * So the backbone is red — every exonuclease needs DNA, and needs an
 * end to start from — and the bases are grey, because none of these
 * enzymes reads the sequence. Residues come off one at a time and
 * drift away as free monophosphates.
 *
 * Chewing the upper strand back from its 3' end also shows the thing
 * you actually use these for: the lower strand is left standing alone,
 * so a 5' overhang grows as the reaction runs.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const M=window.DNAModel;
const INK="#111111", MUT="#767676";
const SEQ="GTCAATG", N=SEQ.length, EAT=4;   /* 8 columns overran both edges */
const T_HOLD=0.8, T_STEP=0.66, T_END=1.1;
const CYCLE=T_HOLD+EAT*T_STEP+T_END;
const ease=t=>t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

/* red backbone, grey bases: it needs the DNA, it does not read it */
const role=()=>Array.from({length:N},()=>({bb:"hot", base:"bg"}));
function piece(rt, rb, ends){
  return M.make({top:SEQ, ends:Object.assign({t5:"phos",t3:"oh",b5:"phos",b3:"oh"}, ends),
                 range:{top:rt, bot:rb}, roleTop:role(), roleBot:role()});
}
const X0=(1600-(N-1)*M.PITCH)/2;

window.Deck.sequence("op-exo", function(slide){
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  slide.appendChild(svg);
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  let raf=null;

  /* k = the residue on its way off, frac = how far gone it is */
  function paint(k, frac){
    const chain = k<0 ? piece([0,N],[0,N],{})
                      : piece([0,k],[0,N],{t3:"oh"});   /* fresh 3' OH behind it */
    let g=M.draw(chain, X0);
    if(k>=0 && k<N){
      /* the residue leaves as a 5' monophosphate with a free 3' OH */
      const free=piece([k,k+1],[N,N],{t5:"phos",t3:"oh"});
      /* up and to the right, but not so far it climbs into the subtitle */
      const dx=(96*frac).toFixed(1), dy=(-96*frac).toFixed(1);
      g+='<g transform="translate('+dx+' '+dy+')" opacity="'+(1-frac*0.88).toFixed(2)+'">'+
         M.draw(free, X0)+'</g>';
    }
    svg.innerHTML=
      '<text x="800" y="140" text-anchor="middle" font-size="44" font-weight="700" fill="'+INK+
        '">Exonuclease</text>'+
      '<text x="800" y="188" text-anchor="middle" font-size="25" fill="'+MUT+
        '">one nucleotide at a time, and only from an <tspan font-style="italic">end</tspan></text>'+
      g+
      '<text x="800" y="852" text-anchor="middle" font-size="25" font-weight="700" fill="'+
        M.HOT+'">it needs a backbone and an end &mdash; it never reads the bases</text>';
  }

  function go(){
    if(raf){cancelAnimationFrame(raf);raf=null;}
    if(reduce.matches){ paint(N-EAT-1, 1); return; }
    const t0=performance.now();
    raf=requestAnimationFrame(function f(now){
      if(!slide.classList.contains("on")){ raf=null; return; }
      let t=((now-t0)/1000)%CYCLE;
      if(t<T_HOLD) paint(-1,0);
      else if((t-=T_HOLD)<EAT*T_STEP){
        const i=Math.floor(t/T_STEP);
        paint(N-1-i, ease((t-i*T_STEP)/T_STEP));
      } else paint(N-1-EAT, 1);
      raf=requestAnimationFrame(f);
    });
  }
  go();
  return { steps:[{
    note:"The operator for the whole class, and it is worth reading straight against the endonuclease one. There, the enzyme made a single cut somewhere inside the molecule, usually at a sequence it recognised. Here the backbone is red because an exonuclease also needs DNA, and needs an end to start from — but every base is grey, because none of these enzymes reads the sequence at all. Watch what it does: one nucleotide comes off, then the next, then the next. Not a cut in the middle. A processive nibble from the end, and each residue leaves as a free five prime monophosphate with the chain behind it carrying a fresh three prime hydroxyl. And notice the consequence, because it is what you actually use these enzymes for: this one is chewing the top strand back from its three prime end, so the bottom strand is left standing on its own and a five prime overhang grows as the reaction runs. That is how you make a sticky end without a restriction site.",
    desc:"An eight base pair duplex drawn in full chemical structure with its whole backbone in red and every base in grey. On a loop, the residues at the 3-prime end of the upper strand are removed one at a time, each drifting away as a free nucleotide carrying a 5-prime phosphate and a 3-prime hydroxyl, while the lower strand stays whole so a growing single-stranded 5-prime overhang is left behind."
  }], go:go };
});
})();
