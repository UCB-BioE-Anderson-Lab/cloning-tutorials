/* ------------------------------------------------------------------ *
 * formats.js: source 41, the shapes an ELISA can take.  Five beats.
 *
 * JCA, 21 Oct 2026: "I don't think we need to show that many variations
 * on the idea, but we should show the major ones, like having 2
 * antibodies, having hrp vs fluorophore on the antibody -- just a few of
 * the major variations on 'sandwich assay'."
 *
 * JCA, 27 Oct 2026: "the labels come at the end, so it is unclear what
 * is what.  I think the analyte is yellow, so that's the first beat."
 * So the first beat is now the plate and the antigen ALONE, named; each
 * glyph is named in the first well as it appears, and the well that
 * introduces nothing new carries no new words.  The HRP / fluorophore
 * legend at the end expands the one word "label", which by then has
 * been on screen for three beats.
 *
 * COLOUR IS A RULE HERE, not decoration: blue is the antibody carrying
 * the label, grey is an antibody that is not.  That holds in all three
 * formats, so the student can read a well without a key.
 *
 * NARRATION.  Beat 0 is the source note, verbatim.  Beats 1-4 are NEW
 * writing for the beats the animation adds -- the source slide had no
 * clicks and so no note for them.  They need JCA's review.
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
/* naming a glyph where it stands, so no key is needed to read the well */
const name = (p, x, y, s, anchor) =>
  tx(p, x, y, s, { size:23, fill:MUTED, anchor:anchor || "middle" });
const o = g => { g.setAttribute("class", "o"); return g; };

/* the well: two walls and a floor of sticky polymer beads */
function well(p, cx){
  el("path", { d:"M" + (cx - HALF) + " 150V" + (FLOOR + 26) +
                  "M" + (cx + HALF) + " 150V" + (FLOOR + 26),
               stroke:WALL, "stroke-width":6, "stroke-linecap":"round" }, p);
  for (let i = -2; i <= 2; i++)
    el("path", { d:"M" + (cx + i * 66 - 30) + " " + (FLOOR + 26) + "a30 30 0 0 1 60 0z",
                 fill:BEAD, stroke:BEADLINE, "stroke-width":2 }, p);
}
/* the antigen, the same yellow flame the sandwich on source 43 uses.
   Its base sits at `base`; its tip is 74 above that. */
function antigen(p, cx, base){
  return el("path", { d:"M" + cx + " " + (base - 74) + "C" + (cx + 28) + " " + (base - 22) +
                         " " + (cx + 24) + " " + (base - 4) + " " + cx + " " + (base - 4) +
                         "C" + (cx - 24) + " " + (base - 4) + " " + (cx - 28) + " " + (base - 22) +
                         " " + cx + " " + (base - 74) + "Z",
                      fill:YOLK, stroke:YOLKLINE, "stroke-width":2.5 }, p);
}
/* an antibody as a Y.  `grip` is the way the ARMS point: +1 reaches
   down onto what is below, -1 reaches up at what is above.  The stem
   and the label always go the other way, so the label ends up at the
   free end of the stem and never inside what the arms are holding. */
function antibody(p, cx, jy, grip, color, label){
  const g = el("g", {}, p);
  const S = { stroke:color, "stroke-width":8, fill:"none", "stroke-linecap":"round" };
  el("path", Object.assign({ d:"M" + cx + " " + jy + "l-28 " + (38 * grip) }, S), g);
  el("path", Object.assign({ d:"M" + cx + " " + jy + "l28 " + (38 * grip) }, S), g);
  el("path", Object.assign({ d:"M" + cx + " " + jy + "V" + (jy - 54 * grip) }, S), g);
  if (label)
    el("circle", { cx:cx, cy:jy - 72 * grip, r:19, fill:label }, g);
  return g;
}

/* where things sit, given the antigen tip at FLOOR - 74 */
const GRIPS_ANTIGEN = FLOOR - 112;      /* arms reach down to the tip */
const GRIPS_STEM    = FLOOR - 204;      /* arms reach down to that stem's top */
const STANDS_ON_PLATE = FLOOR - 50;     /* arms reach up, stem down to the beads */

function build(host){
  const svg = el("svg", { viewBox:"0 0 " + W + " " + H, "aria-hidden":"true",
    preserveAspectRatio:"xMidYMid meet", style:"width:100%;height:100%;display:block" });
  host.appendChild(svg);
  const P = {};

  /* ---- beat 0: the plate, and the thing you are looking for -------- */
  P.plate = o(el("g", {}, svg));
  well(P.plate, WELL[0]);
  antigen(P.plate, WELL[0], FLOOR);
  name(P.plate, 158, 424, "antigen", "end");

  /* ---- beat 1: direct, one antibody that carries the label --------- */
  P.direct = o(el("g", {}, svg));
  tx(P.direct, WELL[0], 108, "Direct", { size:30, weight:700 });
  antibody(P.direct, WELL[0], GRIPS_ANTIGEN, 1, BLUE, VERM);
  name(P.direct, 340, 306, "antibody", "start");
  name(P.direct, 172, 274, "label", "end");

  /* ---- beat 2: indirect, the label moves onto a second antibody ---- */
  P.indirect = o(el("g", {}, svg));
  tx(P.indirect, WELL[1], 108, "Indirect", { size:30, weight:700 });
  well(P.indirect, WELL[1]);
  antigen(P.indirect, WELL[1], FLOOR);
  antibody(P.indirect, WELL[1], GRIPS_ANTIGEN, 1, MUTED, null);
  antibody(P.indirect, WELL[1], GRIPS_STEM, 1, BLUE, VERM);
  name(P.indirect, 608, 352, "primary", "end");
  name(P.indirect, 790, 250, "secondary", "start");

  /* ---- beat 3: sandwich, the plate holds an antibody, not the antigen */
  P.sandwich = o(el("g", {}, svg));
  tx(P.sandwich, WELL[2], 108, "Sandwich", { size:30, weight:700 });
  well(P.sandwich, WELL[2]);
  antibody(P.sandwich, WELL[2], STANDS_ON_PLATE, -1, MUTED, null);
  antigen(P.sandwich, WELL[2], FLOOR - 92);
  antibody(P.sandwich, WELL[2], GRIPS_STEM, 1, BLUE, VERM);
  name(P.sandwich, 1058, 434, "capture", "end");
  name(P.sandwich, 1240, 250, "detection", "start");

  /* ---- beat 4: what that label can be ------------------------------ */
  P.label = o(el("g", {}, svg));
  el("path", { d:"M90 520H1310", stroke:"#d8d5cc", "stroke-width":2 }, P.label);
  const chip = (x, fill, title, outcome) => {
    el("circle", { cx:x, cy:596, r:19, fill:fill }, P.label);
    tx(P.label, x + 32, 605, title, { size:27, weight:700, anchor:"start" });
    tx(P.label, x + 32, 640, outcome, { size:24, fill:MUTED, anchor:"start" });
  };
  tx(P.label, 90, 562, "the label on the detecting antibody:",
     { size:25, fill:MUTED, anchor:"start" });
  chip(130, VERM, "HRP", "turns a substrate a color you read on a plate reader");
  chip(800, AMBER, "fluorophore", "no developing step, and two colors in one well");
  return P;
}

const STEPS = [
  { on:["plate"],
    note:"A more high-throughput and lower detection limit option is an ELISA assay.  This makes use of MaxiSorp plates, which are 96-well plates with a sticky base.",
    desc:"One well of an ELISA plate, its floor drawn as sticky polymer beads, with the antigen you are looking for stuck down on them." },
  { on:["plate","direct"],
    note:"That sticky base is doing the work in the simplest version.  The antigen goes in, it sticks to the plastic, and then one antibody binds it, and that same antibody is the one carrying the label.  One binding event and one readout, with nothing in between.",
    desc:"An antibody drops onto the antigen, gripping it with the two arms of its Y, and a colored bead at the top of its stem marks the label it carries. This is the direct format." },
  { on:["plate","direct","indirect"],
    note:"Add a second antibody and you have the indirect version.  The first one binds the antigen and carries nothing, and the second one binds the first and carries the label.  You get more signal, because several labeled antibodies can land on one primary, and you get cheaper reagents, because one labeled anti-rabbit works for every rabbit antibody in your freezer.",
    desc:"A second well. The antibody on the antigen is now grey and carries no label; a second antibody grips its stem and carries the label instead." },
  { on:["plate","direct","indirect","sandwich"],
    note:"In a sandwich assay you stop relying on the antigen sticking to the plastic at all.  You coat the plate with a capture antibody, that antibody holds the antigen, and a detection antibody binds a different part of it.  Two antibodies have to agree before you see anything, so this is the most specific of the three, and it is what you use on a crude sample where plenty of other things would have stuck to the plate.",
    desc:"A third well. An antibody now stands on the beads with its arms pointing up, holding the antigen off the plastic, and the detection antibody grips the antigen from above." },
  { on:["plate","direct","indirect","sandwich","label"],
    note:"What you hang on that last antibody is a separate decision.  Horseradish peroxidase turns a substrate a color you read on a plate reader, and because the enzyme keeps turning over it usually wins on sensitivity.  A fluorophore skips the enzyme, so there is nothing to develop and nothing to stop, and you can put two colors in the same well and read both.",
    desc:"Beneath the three wells, the two things that bead can be: horseradish peroxidase, which turns a substrate a color, or a fluorophore, which needs no developing step and allows two colors in one well." }
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
