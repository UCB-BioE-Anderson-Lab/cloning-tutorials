/* ------------------------------------------------------------------ *
 * op-exonuclease.js — the operator for the exonuclease class, in both
 * directions.
 *
 * The counterpart to the endonuclease operator, and the contrast is
 * why both exist:
 *
 *   endonuclease   one cut, somewhere INSIDE, often at a read sequence
 *   exonuclease    nucleotide after nucleotide, only from an END
 *
 * Backbone red — these enzymes need DNA and need an end to start from.
 * Bases grey — none of them reads the sequence.
 *
 * Which end it starts from is the whole difference, and it decides what
 * you are left holding:
 *
 *   3'->5'   eats the upper strand back from the right; the lower
 *            strand stands alone and a 5' overhang grows
 *   5'->3'   eats it from the left instead, and a 3' overhang grows
 *
 * One slide, three clicks. It used to be two slides, each of which
 * started its loop the moment you arrived, so the substrate was never
 * on screen still and the two directions were never adjacent. Now the
 * first click holds the intact molecule -- long enough to ask the room
 * which end it will start from -- and each direction gets a click of
 * its own, so the second is read against the first rather than against
 * a memory of the previous slide.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const M=window.DNAModel;
const INK="#111111", MUT="#767676";
const SEQ="GTCAATG", N=SEQ.length, EAT=4;
const T_HOLD=0.8, T_STEP=0.66, T_END=1.1;
const CYCLE=T_HOLD+EAT*T_STEP+T_END;
const ease=t=>t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const X0=(1600-(N-1)*M.PITCH)/2, ARROW_Y=766;

const role=()=>Array.from({length:N},()=>({bb:"hot", base:"bg"}));
function piece(rt, rb, ends){
  return M.make({top:SEQ, ends:Object.assign({t5:"phos",t3:"oh",b5:"phos",b3:"oh"}, ends),
                 range:{top:rt, bot:rb}, roleTop:role(), roleBot:role()});
}
/* the direction the enzyme travels, drawn under the end it is working on */
function travel(right, id){
  const a = right ? X0-40 : X0+(N-1)*M.PITCH+40;
  const b = right ? X0+3*M.PITCH : X0+(N-4)*M.PITCH;
  /* the id has to be unique across the deck: hidden slides stay in the DOM, so
     two markers sharing a name resolve to whichever came first in the document
     and the later arrow loses its head */
  return '<defs><marker id="'+id+'" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" '+
      'markerHeight="7" orient="auto"><path d="M0 0L12 6L0 12z" fill="'+M.HOT+'"/></marker></defs>'+
    '<path d="M'+a+' '+ARROW_Y+'H'+b+'" stroke="'+M.HOT+'" stroke-width="4.2" fill="none" '+
      'marker-end="url(#'+id+')"/>';
}

/* dir: 0 static, +1 eating from the right (3'->5'), -1 from the left */
const STEPS = [
  { dir:0,
    cap:"Exonuclease",
    sub:"one nucleotide at a time, and only from an <tspan font-style=\"italic\">end</tspan>",
    foot:"it needs a backbone and an end; it never reads the bases",
    note:"The operator for the whole class, and it is worth reading straight against the endonuclease one. There, the enzyme made a single cut somewhere inside the molecule, usually at a sequence it recognised. Here the backbone is red because an exonuclease also needs DNA, and needs an end to start from, but every base is grey, because none of these enzymes reads the sequence at all. Nothing is moving yet. Look at the molecule: it has two ends, on two different strands, pointing opposite ways. Which one an exonuclease starts from is not something you can work out from this picture, and it is the first thing you have to look up about any of them. Here are the two answers.",
    desc:"A seven base pair duplex drawn in full chemical structure with its whole backbone in red and every base in grey, intact and still. Nothing is being removed yet." },
  { dir:1,
    cap:"3&#8242; &#8594; 5&#8242; Exo Activity",
    sub:"working back from the 3&#8242; end: a 5&#8242; overhang is left behind",
    foot:"it needs a backbone and an end; it never reads the bases",
    note:"The first answer. This is three prime to five prime exonuclease activity: it starts at the three prime end of the upper strand and works back along it, which is right to left as the molecule is drawn, and that is what the arrow means. Watch the residues come off one at a time (not a cut in the middle, a nibble from the end) each leaving as a free five prime monophosphate with the chain behind it carrying a fresh three prime hydroxyl. And look at what it leaves you holding. The upper strand shortens from its three prime end while the lower strand stays whole, so a five prime overhang grows as the reaction runs: a sticky end made without a restriction site. This is also the activity built into a polymerase as proofreading: back up one residue, remove it, try again.",
    desc:"Titled 3-prime to 5-prime exo activity, with an arrow beneath the molecule pointing left. On a loop, residues are removed one at a time from the 3-prime end of the upper strand, each drifting away to the right as a free nucleotide, leaving a single-stranded 5-prime overhang on the lower strand." },
  { dir:-1,
    cap:"5&#8242; &#8594; 3&#8242; Exo Activity",
    sub:"working forward from the 5&#8242; end: a 3&#8242; overhang is left behind",
    foot:"same chemistry, opposite end, and the opposite overhang",
    note:"And the other answer, on the same molecule, so you can read them against each other. This one begins at the five prime end of the upper strand and works forward along it, left to right as drawn. The chemistry has not changed at all (residues still come off one at a time, still as five prime monophosphates), but because it is eating from the other end, the strand left standing alone is the other one, and what grows is a three prime overhang instead of a five prime. Lambda exonuclease is the one you will actually use for this, and that is exactly why: give it a duplex and it hands you back a long three prime single strand. So the two differ in one thing only: which end they start from. That decides the direction of travel, which strand is left standing, and what you are holding when the reaction is done.",
    desc:"The same duplex, now titled 5-prime to 3-prime exo activity with the arrow beneath it pointing right. Residues are removed one at a time from the 5-prime end of the upper strand, drifting away to the left, leaving a single-stranded 3-prime overhang on the lower strand." }
];

window.Deck.sequence("op-exo", function(slide){
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  slide.appendChild(svg);
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  let raf=null, step=0;

  /* k is the residue on its way off; which end that is depends on direction */
  function paint(i, frac){
    const S=STEPS[step], fromRight = S.dir > 0;
    let chain, free;
    if(S.dir===0 || i<0){
      chain = piece([0,N],[0,N],{}); free = null;
    }else if(fromRight){
      const k=N-1-i;
      chain = piece([0,k],[0,N],{t3:"oh"});
      free  = piece([k,k+1],[N,N],{t5:"phos",t3:"oh"});
    }else{
      const k=i;
      chain = piece([k+1,N],[0,N],{t5:"phos"});
      free  = piece([k,k+1],[N,N],{t5:"phos",t3:"oh"});
    }
    let g=M.draw(chain, X0);
    if(free){
      const sgn=fromRight?1:-1;
      /* out and DOWN: drifting upward took the released residue straight
         through the subtitle, and its end labels collided with the chain's */
      const dx=(118*frac*sgn).toFixed(1), dy=(66*frac).toFixed(1);
      g+='<g transform="translate('+dx+' '+dy+')" opacity="'+(1-frac*0.88).toFixed(2)+'">'+
         M.draw(free, X0)+'</g>';
    }
    svg.innerHTML=
      '<text x="800" y="140" text-anchor="middle" font-size="44" font-weight="700" fill="'+INK+
        '">'+S.cap+'</text>'+
      '<text x="800" y="188" text-anchor="middle" font-size="25" fill="'+MUT+'">'+S.sub+'</text>'+
      g + (S.dir ? travel(!fromRight, "op-exo-hd") : "")+
      '<text x="800" y="852" text-anchor="middle" font-size="25" font-weight="700" fill="'+
        M.HOT+'">'+S.foot+'</text>';
  }

  function go(i){
    step = i||0;
    /* every step is now a different direction, so the loop restarts on
       each one -- the old guard existed because one step only renamed */
    if(raf){ cancelAnimationFrame(raf); raf=null; }
    if(STEPS[step].dir===0){ paint(-1, 0); return; }
    if(reduce.matches){ paint(EAT-1, 1); return; }
    const t0=performance.now();
    raf=requestAnimationFrame(function f(now){
      if(!slide.classList.contains("on")){ raf=null; return; }
      let t=((now-t0)/1000)%CYCLE;
      if(t<T_HOLD) paint(-1,0);
      else if((t-=T_HOLD)<EAT*T_STEP){
        const k=Math.floor(t/T_STEP);
        paint(k, ease((t-k*T_STEP)/T_STEP));
      } else paint(EAT-1, 1);
      raf=requestAnimationFrame(f);
    });
  }
  go(0);
  return { steps:STEPS.map(x=>({note:x.note, desc:x.desc})), go:go };
});
})();
