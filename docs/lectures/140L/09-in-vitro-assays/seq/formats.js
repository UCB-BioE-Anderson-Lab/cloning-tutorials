/* ------------------------------------------------------------------ *
 * formats.js: source 41, the shapes an ELISA can take.  Four beats.
 *
 * JCA, 21 Oct 2026: "I don't think we need to show that many variations
 * on the idea, but we should show the major ones, like having 2
 * antibodies, having hrp vs fluorophore on the antibody -- just a few of
 * the major variations on 'sandwich assay'."
 *
 * So the source's six-panel vendor grid becomes three wells built left to
 * right — direct, indirect, sandwich — and then one beat on the label
 * itself, which is the choice that is really independent of the format.
 * Competitive and multiplex are dropped: they are variations on reading
 * the result, not on building the stack, and source 43 goes through one
 * stack click by click straight after this.
 *
 * NARRATION.  Beat 0 is the source note, verbatim.  Beats 1-3 are NEW
 * writing for the beats the animation adds — the source slide had no
 * note for them because it had no clicks.  They need JCA's review.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";
const INK = "#111111", BLUE = "#004373", AMBER = "#a99011", VERM = "#ba3a13";
const MUTED = "#767676", WALL = "#9ec9e8", BEAD = "#b9b9b9", BEADLINE = "#8c8c8c";
const YOLK = "#f5d400", YOLKLINE = "#b99e00";
const W = 1400, H = 680, FLOOR = 450;
const WELL = [250, 700, 1150], HALF = 188;

function el(n, a, p){
  const e = document.createElementNS(NS, n);
  for (const k in a) e.setAttribute(k, a[k]);
  if (p) p.appendChild(e);
  return e;
}
function tx(p, x, y, s, o){
  o = o || {};
  const t = el("text", { x:x, y:y, "text-anchor":o.anchor || "middle", "font-size":o.size || 26,
                         "font-weight":o.weight || 400, fill:o.fill || INK }, p);
  t.textContent = s;
  return t;
}
const o = g => { g.setAttribute("class", "o"); return g; };

/* the well: two walls and a floor of sticky polymer beads */
function well(p, cx, title){
  el("path", { d:"M" + (cx - HALF) + " 150V" + (FLOOR + 26) +
                  "M" + (cx + HALF) + " 150V" + (FLOOR + 26),
               stroke:WALL, "stroke-width":6, "stroke-linecap":"round" }, p);
  for (let i = -2; i <= 2; i++)
    el("path", { d:"M" + (cx + i * 66 - 30) + " " + (FLOOR + 26) + "a30 30 0 0 1 60 0z",
                 fill:BEAD, stroke:BEADLINE, "stroke-width":2 }, p);
  tx(p, cx, 108, title, { size:30, weight:700 });
}
/* the antigen, the same yellow flame the sandwich on source 43 uses */
function antigen(p, cx, base){
  return el("path", { d:"M" + cx + " " + (base - 74) + "C" + (cx + 28) + " " + (base - 22) +
                         " " + (cx + 24) + " " + (base - 4) + " " + cx + " " + (base - 4) +
                         "C" + (cx - 24) + " " + (base - 4) + " " + (cx - 28) + " " + (base - 22) +
                         " " + cx + " " + (base - 74) + "Z",
                      fill:YOLK, stroke:YOLKLINE, "stroke-width":2.5 }, p);
}
/* an antibody as a Y.  dir -1 grips downward, +1 grips upward.
   jy is where the arms meet; the stem runs the other way. */
function antibody(p, cx, jy, dir, colour, label){
  const g = el("g", {}, p);
  const S = { stroke:colour, "stroke-width":8, fill:"none", "stroke-linecap":"round" };
  el("path", Object.assign({ d:"M" + cx + " " + jy + "l-28 " + (38 * dir) }, S), g);
  el("path", Object.assign({ d:"M" + cx + " " + jy + "l28 " + (38 * dir) }, S), g);
  el("path", Object.assign({ d:"M" + cx + " " + jy + "V" + (jy - 54 * dir) }, S), g);
  if (label)
    el("circle", { cx:cx, cy:jy - 72 * dir, r:19, fill:label }, g);
  return g;
}

function build(host){
  const svg = el("svg", { viewBox:"0 0 " + W + " " + H, "aria-hidden":"true",
    preserveAspectRatio:"xMidYMid meet", style:"width:100%;height:100%;display:block" });
  host.appendChild(svg);
  const P = {};

  /* ---- direct: the antigen sticks to the plate, one antibody reads it */
  P.direct = o(el("g", {}, svg));
  well(P.direct, WELL[0], "Direct");
  antigen(P.direct, WELL[0], FLOOR);
  antibody(P.direct, WELL[0], FLOOR - 112, -1, BLUE, VERM);

  /* ---- indirect: an unlabelled first antibody, a labelled second ---- */
  P.indirect = o(el("g", {}, svg));
  well(P.indirect, WELL[1], "Indirect");
  antigen(P.indirect, WELL[1], FLOOR);
  antibody(P.indirect, WELL[1], FLOOR - 112, -1, BLUE, null);
  antibody(P.indirect, WELL[1], FLOOR - 204, -1, MUTED, VERM);

  /* ---- sandwich: the plate holds an antibody, not the antigen ------- */
  P.sandwich = o(el("g", {}, svg));
  well(P.sandwich, WELL[2], "Sandwich");
  antibody(P.sandwich, WELL[2], FLOOR - 50, 1, MUTED, null);
  antigen(P.sandwich, WELL[2], FLOOR - 92);
  antibody(P.sandwich, WELL[2], FLOOR - 204, -1, BLUE, VERM);

  /* ---- the label on that last antibody is its own choice ------------ */
  P.label = o(el("g", {}, svg));
  el("path", { d:"M90 520H1310", stroke:"#d8d5cc", "stroke-width":2 }, P.label);
  const chip = (x, fill, name, outcome) => {
    el("circle", { cx:x, cy:596, r:19, fill:fill }, P.label);
    tx(P.label, x + 32, 605, name, { size:27, weight:700, anchor:"start" });
    tx(P.label, x + 32, 640, outcome, { size:24, fill:MUTED, anchor:"start" });
  };
  tx(P.label, 90, 562, "the label on the detecting antibody:", { size:25, fill:MUTED, anchor:"start" });
  chip(130, VERM, "HRP", "turns a substrate a colour you read on a plate reader");
  chip(800, AMBER, "fluorophore", "no developing step, and two colours in one well");
  return P;
}

const STEPS = [
  { on:["direct"],
    note:"A more high-throughput and lower detection limit option is an ELISA assay.  This makes use of MaxiSorp plates, which are 96-well plates with a sticky base.",
    desc:"One well of an ELISA plate, its floor drawn as sticky polymer beads with the antigen stuck to them, and a single labelled antibody bound to the antigen: the direct format." },
  { on:["direct","indirect"],
    note:"The direct version is one antibody: the antigen is stuck to the plastic and the antibody that binds it is the one carrying the label.  Add a second antibody and you have the indirect version.  The first one binds the antigen and carries nothing, and the second one binds the first and carries the label.  You get more signal, because several labelled antibodies can land on one primary, and you get cheaper reagents, because one labelled anti-rabbit works for every rabbit antibody in your freezer.",
    desc:"A second well beside it: the antibody on the antigen now carries no label, and a second antibody binds that one and carries the label instead." },
  { on:["direct","indirect","sandwich"],
    note:"In a sandwich assay you stop relying on the antigen sticking to the plastic at all.  You coat the plate with a capture antibody, that antibody holds the antigen, and a detection antibody binds a different part of it.  Two antibodies have to agree before you see anything, so this is the most specific of the three, and it is what you use on a crude sample where plenty of other things would have stuck to the plate.",
    desc:"A third well: an antibody now stands on the plate holding the antigen up, and the detection antibody binds the antigen from above." },
  { on:["direct","indirect","sandwich","label"],
    note:"What you hang on that last antibody is a separate decision.  Horseradish peroxidase turns a substrate a colour you read on a plate reader, and because the enzyme keeps turning over it usually wins on sensitivity.  A fluorophore skips the enzyme, so there is nothing to develop and nothing to stop, and you can put two colours in the same well and read both.",
    desc:"Beneath the three wells, the two choices of label: horseradish peroxidase, which turns a substrate a colour, or a fluorophore, which needs no developing step and allows two colours in one well." }
];

window.Deck.sequence("formats", function(slide){
  const P = build(slide.querySelector(".fmt-stage") || slide);
  return {
    steps: STEPS.map(s => ({ note:s.note, desc:s.desc })),
    go: function(i){
      Object.keys(P).forEach(k => P[k].classList.toggle("in", STEPS[i].on.indexOf(k) >= 0));
      slide.setAttribute("data-step", i);
    }
  };
});
})();
