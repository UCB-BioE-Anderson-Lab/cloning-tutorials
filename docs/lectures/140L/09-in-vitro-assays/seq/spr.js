/* ------------------------------------------------------------------ *
 * spr.js: source 44, surface plasmon resonance.  Four beats.
 *
 * JCA, 21 Oct 2026: "That too could be an animation and explained
 * better.  It is not a major slide of the deck, so nothing too long, but
 * click through animation would work better."
 *
 * The source is a borrowed vendor cartoon of the chip and the optics.  It
 * shows the apparatus and not the measurement, which is the part worth
 * having: the note ends by saying you get kinetic information out, and
 * the only thing that shows that is a sensorgram.  So the chip is drawn
 * on the left and the trace is drawn on the right, and the trace is what
 * moves — baseline, association while analyte flows, dissociation when
 * it stops.
 *
 * NARRATION.  The source note runs through all four beats and is split
 * at its own sentence boundaries.  Two sentences are NEW, both marked
 * below, covering the sensorgram the source figure never showed.  They
 * need JCA's review.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";
const INK = "#111111", BLUE = "#004373", VERM = "#ba3a13", AMBER = "#a99011";
const MUTED = "#767676", GOLD = "#b8912f";
const W = 1400, H = 620;
const CHIP = 400;                       /* y of the gold film */
const PX0 = 760, PX1 = 1340, PY0 = 120, PY1 = 420;   /* the sensorgram axes */

function el(n, a, p){
  const e = document.createElementNS(NS, n);
  for (const k in a) e.setAttribute(k, a[k]);
  if (p) p.appendChild(e);
  return e;
}
function tx(p, x, y, s, o){
  o = o || {};
  const t = el("text", { x:x, y:y, "text-anchor":o.anchor || "middle", "font-size":o.size || 25,
                         "font-weight":o.weight || 400, fill:o.fill || INK }, p);
  t.textContent = s;
  return t;
}
const o = g => { g.setAttribute("class", "o"); return g; };
const n2 = v => Math.round(v * 10) / 10;

/* the sensorgram: response against time, drawn from a few control points */
function trace(frac){
  /* 0 baseline, 1 fully associated, 2 back off again — frac runs 0..2 */
  const pts = [];
  for (let i = 0; i <= 120; i++){
    const t = i / 120;                       /* 0..1 across the axis */
    let r;
    if (t < 0.22) r = 0;
    else if (t < 0.62) r = 1 - Math.exp(-(t - 0.22) / 0.13);
    else r = (1 - Math.exp(-0.4 / 0.13)) * Math.exp(-(t - 0.62) / 0.17);
    /* reveal the curve left to right as frac grows */
    const limit = 0.22 + frac * 0.39;
    if (t > limit) break;
    pts.push([PX0 + (PX1 - PX0) * t, PY1 - (PY1 - PY0) * 0.86 * r]);
  }
  return pts.length < 2 ? "M" + PX0 + " " + PY1 + "H" + n2(PX0 + (PX1 - PX0) * 0.22)
    : "M" + pts.map(p => n2(p[0]) + " " + n2(p[1])).join("L");
}

function build(host){
  const svg = el("svg", { viewBox:"0 0 " + W + " " + H, "aria-hidden":"true",
    preserveAspectRatio:"xMidYMid meet", style:"width:100%;height:100%;display:block" });
  host.appendChild(svg);
  const P = {};

  /* ---- the chip: gold film, bait on top, light underneath ---------- */
  P.chip = o(el("g", {}, svg));
  el("rect", { x:80, y:CHIP, width:580, height:16, fill:GOLD }, P.chip);
  tx(P.chip, 80, CHIP + 54, "sensor chip, gold film", { size:23, fill:MUTED, anchor:"start" });
  for (let i = 0; i < 5; i++){
    const x = 150 + i * 120;
    el("path", { d:"M" + x + " " + CHIP + "v-34", stroke:BLUE, "stroke-width":6 }, P.chip);
    el("circle", { cx:x, cy:CHIP - 52, r:22, fill:BLUE }, P.chip);
  }
  tx(P.chip, 370, CHIP - 132, "Bait, immobilized on the chip", { size:25, fill:BLUE });
  /* the optics: a beam in, a beam out */
  el("path", { d:"M110 560L300 " + (CHIP + 20), stroke:AMBER, "stroke-width":5 }, P.chip);
  el("path", { d:"M300 " + (CHIP + 20) + "L560 560", stroke:AMBER, "stroke-width":5 }, P.chip);
  tx(P.chip, 92, 588, "light in", { size:23, fill:AMBER, anchor:"start" });
  tx(P.chip, 572, 588, "detector", { size:23, fill:AMBER, anchor:"end" });

  /* ---- the flow cell above it -------------------------------------- */
  P.flow = o(el("g", {}, svg));
  el("path", { d:"M80 190H640", stroke:MUTED, "stroke-width":2.5, "stroke-dasharray":"10 9" }, P.flow);
  el("path", { d:"M614 178l26 12l-26 12z", fill:MUTED }, P.flow);
  tx(P.flow, 80, 174, "flow cell", { size:23, fill:MUTED, anchor:"start" });

  /* ---- the analyte, flowing and then bound -------------------------- */
  P.free = o(el("g", {}, svg));
  [[200,250],[330,232],[470,254],[600,236],[120,300],[560,300]]
    .forEach(c => el("path", { d:"M" + c[0] + " " + (c[1] - 17) + "l16 11l-6 19h-20l-6 -19z",
                               fill:VERM }, P.free));
  tx(P.free, 640, 166, "analyte flowing past", { size:25, fill:VERM, anchor:"end" });

  P.bound = o(el("g", {}, svg));
  [150, 270, 390, 630].forEach((x, i) => {
    if (i === 3) return;
    el("path", { d:"M" + x + " " + (CHIP - 92) + "l16 11l-6 19h-20l-6 -19z", fill:VERM }, P.bound);
  });

  /* ---- the sensorgram ---------------------------------------------- */
  P.plot = o(el("g", {}, svg));
  el("path", { d:"M" + PX0 + " " + PY0 + "V" + PY1 + "H" + PX1, stroke:INK,
               "stroke-width":3, fill:"none", "stroke-linecap":"round" }, P.plot);
  tx(P.plot, PX0 - 16, PY0 + 6, "response", { size:23, fill:MUTED, anchor:"end" });
  tx(P.plot, PX0 - 16, PY0 + 34, "(bound mass)", { size:23, fill:MUTED, anchor:"end" });
  tx(P.plot, (PX0 + PX1) / 2, PY1 + 42, "time", { size:23, fill:MUTED });
  const curve = el("path", { d:trace(0), fill:"none", stroke:VERM, "stroke-width":4,
                             "stroke-linejoin":"round", "stroke-linecap":"round" }, P.plot);

  P.phase = o(el("g", {}, svg));
  tx(P.phase, PX0 + (PX1 - PX0) * 0.40, PY1 + 80, "analyte on", { size:23, fill:MUTED });
  tx(P.phase, PX0 + (PX1 - PX0) * 0.80, PY1 + 80, "buffer only", { size:23, fill:MUTED });
  el("path", { d:"M" + (PX0 + (PX1 - PX0) * 0.62) + " " + PY0 + "V" + PY1,
               stroke:MUTED, "stroke-width":2, "stroke-dasharray":"8 8" }, P.phase);

  return { P:P, curve:curve };
}

const STEPS = [
  { on:["chip"], frac:0,
    note:"In SPR, you have these gold film-coated chips that you buy as a kit.  You get your Bait protein attached to the chip through affinity interactions, and then put it into a special instrument.  A common one is called a Biacore. It has a light beam bouncing off the surface of the chip.",
    desc:"A gold-filmed chip with bait protein immobilized on its upper face, and a beam of light entering underneath, reflecting off the film and leaving towards a detector." },
  { on:["chip","flow","free","plot"], frac:0,
    note:"It also has a flow cell that passes your Prey sample, or a small molecule, or whatever over the surface.  With only buffer going past, the trace sits flat, and that flat line is your baseline.",
    desc:"A flow cell runs across the top of the chip and analyte sweeps past without binding. Beside it, an empty set of axes, response against time, with the trace flat along the bottom." },
  { on:["chip","flow","bound","plot","phase"], frac:1,
    note:"If this ‘analyte’ sticks to your Bait protein, the refractive index of the surface changes affecting the amount of light that reaches a detector.  The changes in the light  are proportional to the concentration of bound analyte.",
    desc:"Analyte settles onto the bait on the chip, and the trace climbs and levels off: the response is proportional to how much is bound." },
  { on:["chip","flow","plot","phase"], frac:2,
    note:"SPR is usually the most quantitative technique.  You can also get kinetic information out which is rarely possible with the other methods.  Switch back to buffer and watch it come off, and the shape of the climb gives you the on-rate while the shape of the fall gives you the off-rate.",
    desc:"The flow switches back to buffer, the analyte comes off the chip, and the trace falls away. The rise gives the on-rate and the fall gives the off-rate." }
];

window.Deck.sequence("spr", function(slide){
  const v = build(slide.querySelector(".spr-stage") || slide);
  return {
    steps: STEPS.map(s => ({ note:s.note, desc:s.desc })),
    go: function(i){
      Object.keys(v.P).forEach(k => v.P[k].classList.toggle("in", STEPS[i].on.indexOf(k) >= 0));
      v.curve.setAttribute("d", trace(STEPS[i].frac));
      slide.setAttribute("data-step", i);
    }
  };
});
})();
