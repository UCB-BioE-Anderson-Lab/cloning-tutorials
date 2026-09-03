/* ------------------------------------------------------------------ *
 * kunkel.js — Kunkel mutagenesis, as one animated slide.
 *
 * Same circular geometry as rca.js, but T4 DNA polymerase has neither
 * 5'->3' exonuclease nor strand displacement, so the new strand stops
 * dead when it meets its own 5' end: one lap, a nick, no tail.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const CX = 800, CY = 468, R_T = 190, R_N = 214;
const NICK = 8, MAXARC = 360 - NICK, START = -96;
const CAP_Y = 792, SUB_Y = 836;
const INK = "#111111", SLATE = "#004373", RED = "#ba3a13", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";
const rad = d => d*Math.PI/180;
const pol = (r,a) => ({ x: CX + r*Math.cos(rad(a)), y: CY + r*Math.sin(rad(a)) });
const n2 = v => Math.round(v*10)/10;

const STEPS = [
  { prog:0,
    cap:"a single-stranded circular template",
    sub:"one strand — the one the mutation has to end up opposite",
    note:"Another example of the utility of subtly different polymerase properties is Kunkel mutagenesis. Kunkel involves the use of T4 DNA polymerase, which has neither 5’ to 3’ exonuclease nor strand displacement behaviour. That combination is the whole method.",
    desc:"A single circular DNA template, drawn as one black ring." },
  { prog:34, snap:true,
    cap:"anneal the mutagenic oligo",
    sub:"homologous to the template except at the mutation, marked ×",
    note:"An oligo that is homologous to the DNA but contains a mutation, designated by the red X, is annealed to the DNA. Its 3’ end is the primer, and polymerisation runs from it round the circle.",
    desc:"A short blue oligonucleotide has annealed near the top of the circle. A red × just outside the ring, on a short leader, marks the mutation it carries. Its 3' end has a half barb pointing clockwise." },
  { prog:MAXARC,
    cap:"one lap, then it stops dead at the nick",
    sub:"no displacement, no 5′→3′ exo — so the oligo, and the mutation, survive",
    note:"The new strand goes all the way round and simply stops when it meets its own 5’ end, leaving a nick that E. coli repairs after transformation. If a different polymerase were used, one that did strand displacement or 5’ to 3’ exonuclease, the oligo carrying the X would be peeled off or chewed up and the mutation would never make it into the product. That is why the method names the enzyme.",
    desc:"The new strand has gone all the way round and stopped at its own 5' end, leaving a visible nick. Because T4 polymerase neither displaces nor degrades, the mutagenic oligo is still in place and the mutation is retained." }
];

window.Deck.sequence("kunkel", function(slide){
  const s = document.createElementNS(SVGNS,"svg");
  s.setAttribute("viewBox","0 0 1600 900");
  s.setAttribute("aria-hidden","true");
  s.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  s.innerHTML =
    '<g fill="none" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="'+CX+'" cy="'+CY+'" r="'+R_T+'" stroke="'+INK+'" stroke-width="2.6"/>' +
      '<path data-r="ring" stroke="'+SLATE+'" stroke-width="3"/>' +
      '<path data-r="tip"  stroke="'+SLATE+'" stroke-width="3"/>' +
    '</g>' +
    '<text data-r="x" font-family="inherit" font-weight="700" font-size="34" ' +
      'fill="'+RED+'" stroke="#ffffff" stroke-width="6" paint-order="stroke" ' +
      'text-anchor="middle" opacity="0">&#215;</text>';
  slide.appendChild(s);
  const r = {};
  s.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur = { prog:0 }, raf = null;

  function paint(st){
    const prog = Math.min(st.prog, MAXARC);
    if (prog < 0.5){ r.ring.setAttribute("d",""); r.tip.setAttribute("d",""); r.x.setAttribute("opacity","0"); return; }
    const tp = START + prog;
    const p0 = pol(R_N, START), p1 = pol(R_N, tp);
    r.ring.setAttribute("d","M"+n2(p0.x)+" "+n2(p0.y)+"A"+R_N+" "+R_N+" 0 "+(prog>180?1:0)+" 1 "+n2(p1.x)+" "+n2(p1.y));
    const t = rad(tp + 90), L = 26, W = 0.50;
    r.tip.setAttribute("d","M"+n2(p1.x - L*Math.cos(t+W))+" "+n2(p1.y - L*Math.sin(t+W))+"L"+n2(p1.x)+" "+n2(p1.y));
    // the mutation is IN the oligo, so the X sits on the strand itself
    const xp = pol(R_N, START + 13);
    r.x.setAttribute("x", n2(xp.x)); r.x.setAttribute("y", n2(xp.y + 12));
    r.x.setAttribute("opacity","1");
  }

  function go(i, animated){
    const to = { prog: STEPS[i].prog };
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    if (animated === false || reduce.matches){ cur = to; paint(cur); return; }
    // the annealed oligo simply appears; only synthesis is worth animating
    const from = { prog: STEPS[i].snap ? to.prog : cur.prog };
    const t0 = performance.now(), dur = 760;
    const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1,(now-t0)/dur), e = ease(t);
      cur = { prog: from.prog + (to.prog - from.prog)*e };
      paint(cur);
      if (t < 1) raf = requestAnimationFrame(f); else raf = null;
    });
  }

  paint(cur);
  return { steps: STEPS.map(s => ({ note:s.note, desc:s.desc })), go: go };
});
})();
