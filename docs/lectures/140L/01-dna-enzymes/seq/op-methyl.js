/* ------------------------------------------------------------------ *
 * op-methyl.js — the methyltransferase operator.
 *
 * Red on the bases, which is NOT new by the time this appears: EcoRI
 * required its six and loxP required its arms. The distinctive thing
 * about this one is not that it reads a sequence, it is that reading is
 * all it does to it -- nothing is cut, nothing is joined, and the
 * sequence afterwards is the sequence before. An earlier draft of this
 * note claimed the red-on-bases was an inversion of the deck's grammar.
 * It is not, and two earlier sections disprove it.
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
                : "GATC, four bases whose identity is required") +
      '</text>' +
      '<text x="800" y="818" text-anchor="middle" font-family="inherit" font-size="24" '+
        'fill="'+MUT+'">it reads a sequence, and then leaves it exactly as it found it</text>';
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
    note:"Red on the bases, which you have seen before: EcoRI required its six, loxP required its arms. What is different is what happens next. Nothing here is cut and nothing is joined, and the sequence you would read off afterwards is the sequence you would have read off before. This is Dam, the one that matters most to you: it recognises GATC, four bases, and it puts a methyl on the adenine. Notice it marks both strands, because GATC reads GATC on its complement too. The site is symmetric. That symmetry is not a curiosity: straight after replication one strand carries the old mark and the new one does not, so for a few minutes the cell can tell which strand is which, and that is how mismatch repair knows which base to trust. Hold on to GATC. It is the mark on every miniprep you will make from a standard lab strain, and it is what DpnI reads. And look at the six base pairs I have actually drawn: T-G-A-T-C-A. That is the BclI site, and BclI is the one people get caught by, because Dam has methylated the adenine sitting inside it and BclI will not cut a methylated site. The plasmid is right, the enzyme is right, the buffer is right, and nothing happens. GATC also sits inside BamHI, BglII, XhoII and PvuI, so BclI is not the only one this can happen to. What you do about it is a few slides away.",
    desc:"An all-atom DNA duplex six base pairs long, reading T G A T C A, which is the BclI site. The four bases of the central GATC site are drawn in red on both strands and the flanking bases are grey. On a loop a red methyl group appears on the adenine of each strand and disappears again."
  }], go:go };
});
})();
