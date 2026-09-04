/* ------------------------------------------------------------------ *
 * t5cut.js — the T5 question slide, answered by watching it happen.
 *
 * The molecule is blunt on the left and carries a 3' extension on the
 * right, so BOTH of its 5' ends are addresses T5 will initiate on. The
 * answer is not "yes" so much as "yes, twice", and the only way to show
 * that is to run both ends at once.
 *
 * T5 walks 5'->3'. The top strand's 5' end is on the left, so it is
 * eaten left to right; the bottom strand's 5' end is on the right, so
 * it is eaten right to left. The two fronts move toward each other and
 * the molecule disappears -- which is the point the table then confirms
 * row by row.
 *
 * Bases hold their columns as they go: an eaten base leaves a space, so
 * nothing slides sideways and the two fronts are easy to follow. The
 * 5' label travels with its own end, because that end is what is moving.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const TOP="gatttctgGAATTTGACACGTG";      /* 5' on the left            */
const BOT="ctaaagacCTTAA";               /* 5' on the right           */
const N=Math.max(TOP.length, BOT.length);
const F="’";                        /* the prime mark            */
const HOLD_IN=0.8, PER=0.085, HOLD_OUT=0.85;
const CYCLE=HOLD_IN + N*PER + HOLD_OUT;

/* k bases gone from each 5' end */
function frame(k){
  const t = k>=TOP.length ? "" : " ".repeat(k)+"5"+F+"-"+TOP.slice(k)+"-3"+F;
  const b = k>=BOT.length ? "" : "3"+F+"-"+BOT.slice(0, BOT.length-k)+"-5"+F;
  return t+"\n"+b;
}

window.Deck.sequence("t5cut", function(slide){
  const pre=slide.querySelector("pre.dna");
  const reveal=Array.from(slide.querySelectorAll("[data-build]"));
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  let raf=null, step=0;

  function stop(){ if(raf){cancelAnimationFrame(raf); raf=null;} }

  function run(){
    stop();
    if(reduce.matches){ pre.textContent=frame(N); return; }
    const t0=performance.now();
    raf=requestAnimationFrame(function f(now){
      if(!slide.classList.contains("on") || step===0){ raf=null; return; }
      const t=((now-t0)/1000)%CYCLE;
      const k = t<HOLD_IN ? 0 : Math.min(N, Math.floor((t-HOLD_IN)/PER));
      pre.textContent=frame(k);
      raf=requestAnimationFrame(f);
    });
  }

  function go(i){
    step=i||0;
    reveal.forEach(el=>el.classList.toggle("in", step>=1));
    if(step===0){ stop(); pre.textContent=frame(0); }
    else if(!raf) run();
  }
  go(0);

  return { steps:[
    { note:"Look at the ends of this molecule. It is blunt at one end and has a three prime overhang at the other. Will T5 exonuclease touch it? Let the room work it out before you put the table up.",
      desc:"A short DNA written as sequence, blunt at its left-hand end and carrying a 3-prime overhang on the top strand at the right. The NEB table is not on the slide yet." },
    { note:"Yes, and from both ends. T5 initiates on blunt ends and on three prime extensions, and this molecule offers it one of each. Watch which way each front runs: T5 walks five prime to three prime, so on the top strand it starts at the left-hand end and on the bottom strand it starts at the right-hand end. The two fronts run at each other and the molecule is gone. Read along the T5 row and notice two more things. It is a plus under nicked, so a nicked plasmid is not safe from it. And it is a minus under supercoiled circles — no end, no reaction. Hold that against Exonuclease I, which we come to shortly: single-stranded linear only, and a minus everywhere else. Same chart, opposite address.",
      desc:"The answer appears — yes, from both ends, because T5 initiates on blunt ends and on 3-prime extensions — above the T5 Exonuclease row of the NEB selection chart: 5-prime to 3-prime, and active on every substrate listed except supercoiled circles. Below them the sequence animates: bases disappear from the top strand's left-hand end and from the bottom strand's right-hand end at the same time, until nothing is left." }
  ], go:go };
});
})();
