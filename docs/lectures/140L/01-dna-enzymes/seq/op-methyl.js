/* ------------------------------------------------------------------ *
 * op-methyl.js — the methyltransferase operator.
 *
 * The one place in this lecture where the red goes on the BASES.
 *
 * Every operator before this has red backbone and grey bases, because
 * every enzyme before this reads a shape: an end, a nick, a recessed
 * junction. A methyltransferase reads a sequence. So GATC is red on both
 * strands and its flanks are grey, and that inversion is the point --
 * it is worth saying out loud that the picture has changed, because the
 * grammar has been consistent for an hour by the time this appears.
 *
 * Dam is the example because the whole section turns on it: it is the
 * mark on every miniprep from a standard lab strain, it is what DpnI
 * reads, and GATC sits inside BamHI, BglII, XhoII and PvuI.
 *
 * The methyl lands on BOTH strands. GATC reads GATC on its complement,
 * so the site is symmetric and Dam marks the adenine on each -- which is
 * exactly why hemimethylated DNA exists after replication and why the
 * cell can tell an old strand from a new one.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const M=window.DNAModel;
const MUT="#767676", RED=M.HOT;

const SEQ="TGATCA", N=SEQ.length;      /* GATC at 1..4, flanked either side */
const SITE=[1,2,3,4];
const MA_TOP=2, MA_BOT=3;              /* the adenine on each strand        */
const X0=(1600-(N-1)*188)/2;
const HOLD_OFF=1.2, HOLD_ON=1.5;
const CYCLE=HOLD_OFF+HOLD_ON;

/* Backbone AND base go red across GATC and grey either side, so the red
   region is exactly the four base pairs. Leaving the flanking backbone
   red would have claimed those nucleotides are required, and by the test
   this deck uses -- swap it for something else and ask whether the
   reaction still happens -- they are not: Dam reads four bases and does
   not care what abuts them. */
const role=()=>Array.from({length:N},(_,i)=>{
  const on = SITE.indexOf(i) >= 0;
  return {bb: on ? "hot" : "bg", base: on ? "hot" : "bg"};
});

/* The methyl is drawn at atom scale, which is honest -- it really is one
   carbon among a hundred -- but on the one slide that exists to be about
   it, honest is not the same as findable. A ring points at each mark
   without inflating it. */
function ring(q){
  const R=window.Atoms.R;
  return '<circle cx="'+q[0].toFixed(1)+'" cy="'+q[1].toFixed(1)+'" r="'+(R*1.65).toFixed(1)+
         '" fill="none" stroke="'+RED+'" stroke-width="3" stroke-opacity="0.5"/>';
}

function frame(marked){
  const g=M.draw(M.make({top:SEQ, roleTop:role(), roleBot:role(),
    mods: marked ? [{type:"methyl", strand:"top", i:MA_TOP, site:"6"},
                    {type:"methyl", strand:"bot", i:MA_BOT, site:"6"}] : []
  }), X0);
  if(!marked) return g;
  const a=M.anchors.mod;
  return g + ring(a.top[MA_TOP]) + ring(a.bot[MA_BOT]);
}

window.Deck.sequence("op-methyl", function(slide){
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  slide.appendChild(svg);
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  let raf=null, was=null;

  function paint(marked){
    if (was === marked) return;
    was = marked;
    svg.innerHTML = frame(marked) +
      '<text x="800" y="778" text-anchor="middle" font-family="inherit" font-size="27" '+
        'font-weight="700" fill="'+(marked?RED:MUT)+'">' +
        (marked ? "a methyl on the adenine of each strand"
                : "GATC &#8212; four bases whose identity is required") +
      '</text>' +
      '<text x="800" y="818" text-anchor="middle" font-family="inherit" font-size="24" '+
        'fill="'+MUT+'">every enzyme so far read a shape; this one reads a sequence</text>';
  }
  function go(){
    if(raf){cancelAnimationFrame(raf);raf=null;}
    if(reduce.matches){ paint(true); return; }
    const t0=performance.now();
    raf=requestAnimationFrame(function f(now){
      if(!slide.classList.contains("on")){ raf=null; return; }
      paint(((now-t0)/1000)%CYCLE >= HOLD_OFF);
      raf=requestAnimationFrame(f);
    });
  }
  go();
  return { steps:[{
    note:"Look at what has changed about the picture. For the whole of this lecture red has been on the backbone and the bases have been grey, because every enzyme so far reads a shape — an end, a nick, a recessed junction — and does not care what the sequence says. Here the red is on the bases. A methyltransferase reads a sequence, and that is the whole difference. This is Dam, the one that matters most to you: it recognises GATC, four bases, and it puts a methyl on the adenine. Notice it marks both strands, because GATC reads GATC on its complement too — the site is symmetric. That symmetry is not a curiosity: straight after replication one strand carries the old mark and the new one does not, so for a few minutes the cell can tell which strand is which, and that is how mismatch repair knows which base to trust. Hold on to GATC. It is the mark on every miniprep you will make from a standard lab strain, and it is what DpnI reads. And look at the six base pairs I have actually drawn: T-G-A-T-C-A. That is the BclI site, and BclI is the one people get caught by, because Dam has methylated the adenine sitting inside it and BclI will not cut a methylated site. The plasmid is right, the enzyme is right, the buffer is right, and nothing happens — you have to grow the DNA in a dam-minus strain first. GATC also sits inside BamHI, BglII, XhoII and PvuI, so BclI is not the only one this can happen to.",
    desc:"An all-atom DNA duplex six base pairs long, reading T G A T C A, which is the BclI site. The four bases of the central GATC site are drawn in red on both strands and the flanking bases are grey, inverting the convention used for every earlier enzyme, whose backbone was red and bases grey. On a loop a red methyl group appears on the adenine of each strand and disappears again."
  }], go:go };
});
})();
