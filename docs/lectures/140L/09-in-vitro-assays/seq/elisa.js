/* ------------------------------------------------------------------ *
 * elisa.js: the sandwich built in the well, source 43.  Six clicks.
 *
 * WHY THIS IS DRAWN AND NOT CROPPED.  It is JCA's own drawing and it
 * builds in six steps, each one a layer of the sandwich — but several of
 * its shapes share a cNvPr name, so deleting "the shapes that arrive
 * later" deletes the wrong ones and the render of any intermediate state
 * is not the state.  Three of the seven come out empty and one jumps two
 * layers.  There is nothing to crop.  The same drawing is redrawn here,
 * layer for layer, in the house palette.
 *
 * The labels are NOT in here: they are HTML in the section file, which
 * reads the data-step this writes onto the slide.  Six lines of real
 * type beat six lines baked into a bitmap.
 *
 * WHAT IS STACKED, bottom to top:
 *   the MaxiSorp surface   grey beads, there from the start
 *   human serum albumin    the yellow flames that stick to it
 *   milk                   fills the bare patches so nothing else can
 *   the affibody           a red Y, the thing being tested
 *   anti-protein A IgG     carrying a biotin, which is the point of it
 *   streptavidin-HRP       finds that biotin
 *   ABTS + H2O2            what the HRP finally turns yellow
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";
const INK = "#111111", BLUE = "#004373", AMBER = "#a99011", VERM = "#ba3a13";
const WALL = "#9ec9e8", BEAD = "#b9b9b9", BEADLINE = "#8c8c8c";
const YOLK = "#f5d400", YOLKLINE = "#b99e00", MILK = "#c9bd93", MID = "#2b7cc4";
const W = 1000, H = 620, FLOOR = 540;

function el(n, a, p){
  const e = document.createElementNS(NS, n);
  for (const k in a) e.setAttribute(k, a[k]);
  if (p) p.appendChild(e);
  return e;
}
function tx(p, x, y, s, o){
  o = o || {};
  const t = el("text", { x:x, y:y, "text-anchor":o.anchor || "middle", "font-size":o.size || 30,
                         fill:o.fill || INK }, p);
  t.textContent = s;
  return t;
}
const o = g => { g.setAttribute("class", "o"); return g; };

/* the nine beads of the plate surface, and which carry what */
const BEADS = [130, 225, 320, 415, 510, 605, 700, 795, 890];
const ALBUMIN = [0, 2, 3, 5, 7];                 /* beads that caught protein */
const BARE    = [1, 4, 6, 8];                    /* beads milk has to cover */
const TESTED  = [0, 3, 5, 7];                    /* affibody bound here */

function scene(host){
  const svg = el("svg", { viewBox:"0 0 " + W + " " + H, "aria-hidden":"true",
    preserveAspectRatio:"xMidYMid meet", style:"width:100%;height:100%;display:block" });
  host.appendChild(svg);
  const P = {};

  /* the well, and the sticky polymer surface at the bottom of it */
  const plate = el("g", {}, svg);
  el("path", { d:"M74 150V" + (FLOOR + 30) + "M926 150V" + (FLOOR + 30), stroke:WALL,
               "stroke-width":7, "stroke-linecap":"round" }, plate);
  BEADS.forEach(x => el("path", { d:"M" + (x - 36) + " " + (FLOOR + 30) +
      "a36 36 0 0 1 72 0z", fill:BEAD, stroke:BEADLINE, "stroke-width":2.5 }, plate));

  /* human serum albumin: a flame of protein stuck to a bead */
  P.alb = o(el("g", {}, svg));
  ALBUMIN.forEach(i => {
    const x = BEADS[i];
    el("path", { d:"M" + x + " " + (FLOOR - 78) + "C" + (x + 30) + " " + (FLOOR - 24) +
                    " " + (x + 26) + " " + (FLOOR - 4) + " " + x + " " + (FLOOR - 4) +
                    "C" + (x - 26) + " " + (FLOOR - 4) + " " + (x - 30) + " " + (FLOOR - 24) +
                    " " + x + " " + (FLOOR - 78) + "Z",
                 fill:YOLK, stroke:YOLKLINE, "stroke-width":2.5 }, P.alb);
  });

  /* milk: it coats whatever the albumin did not */
  P.milk = o(el("g", {}, svg));
  BARE.forEach(i => {
    const x = BEADS[i];
    el("path", { d:"M" + (x - 22) + " " + (FLOOR - 4) + "L" + x + " " + (FLOOR - 56) +
                    "L" + (x + 22) + " " + (FLOOR - 4) + "Z", fill:MILK }, P.milk);
  });

  /* the affibody, the thing actually being tested */
  P.aff = o(el("g", {}, svg));
  TESTED.forEach(i => {
    const x = BEADS[i];
    el("path", { d:"M" + x + " " + (FLOOR - 76) + "V" + (FLOOR - 128) +
                    "M" + x + " " + (FLOOR - 128) + "l-24 -32" +
                    "M" + x + " " + (FLOOR - 128) + "l24 -32",
                 stroke:VERM, "stroke-width":8, fill:"none", "stroke-linecap":"round" }, P.aff);
  });

  /* anti-protein A IgG, which arrives already carrying its biotin */
  P.igg = o(el("g", {}, svg));
  TESTED.forEach(i => {
    const x = BEADS[i];
    el("ellipse", { cx:x, cy:FLOOR - 188, rx:21, ry:33, fill:MID }, P.igg);
  });

  /* streptavidin-HRP, which finds that biotin */
  P.hrp = o(el("g", {}, svg));
  TESTED.forEach(i => {
    const x = BEADS[i];
    el("ellipse", { cx:x, cy:FLOOR - 256, rx:21, ry:33, fill:BLUE }, P.hrp);
  });

  /* the reaction the whole stack exists to permit */
  P.abts = o(el("g", {}, svg));
  el("path", { d:"M660 232C600 160 430 160 372 230", fill:"none", stroke:BLUE,
               "stroke-width":7, "stroke-linecap":"round" }, P.abts);
  el("path", { d:"M366 206l-6 34l30 -14z", fill:BLUE }, P.abts);
  tx(P.abts, 330, 212, "Yellow product", { size:29, fill:AMBER, anchor:"end" });
  tx(P.abts, 702, 212, "ABTS", { size:29, anchor:"start" });
  return P;
}

const STEPS = [
  { on:[],
    note:"I start with a MaxiSorp plate.  ELISA plates are distinct from those used to culture cells.  The polymer surface is sticky towards proteins.  So, when we",
    desc:"An empty ELISA well, its floor drawn as a row of grey beads: the MaxiSorp surface, which protein sticks to." },
  { on:["alb"],
    note:"add the human serum albumin or rat sample to the well, the protein becomes immobilized on the surface of the plate.  We then",
    desc:"Yellow shapes appear on five of the nine beads: albumin, stuck down wherever it happened to land." },
  { on:["alb","milk"],
    note:"block the surface with milk to coat any surfaces of the plate that did not pick up the albumin.",
    desc:"Tan wedges fill the four bare beads. Milk has covered every patch of plate the albumin missed, so nothing else can stick there." },
  { on:["alb","milk","aff"],
    note:"We then add the purified affibody, and if it binds to the albumin, it will become immobilized.  Unreacted affibody is washed away.",
    desc:"A red Y stands on four of the five albumins: affibody that bound. The fifth is bare, and that affibody washed away." },
  { on:["alb","milk","aff","igg"],
    note:"we then add an anti-protein A IgG/Biotin conjugate.  Affibodies derived from protein A such as ours will react with the IgG antibody.  This reagent will become immobilized on the plate as well.  The Biotin is chemically reacted with the antibody in the company that supplies it, so biotin is now also immobilized on the plate.",
    desc:"A blue oval settles on each red Y: the anti-protein A antibody, which arrives with a biotin already attached to it." },
  { on:["alb","milk","aff","igg","hrp"],
    note:"We then add streptavidin-HRP conjugate which will  bind to the Biotin.",
    desc:"A darker oval lands on each of those: streptavidin, carrying horseradish peroxidase, caught by the biotin underneath." },
  { on:["alb","milk","aff","igg","hrp","abts"],
    note:"Finally, we add hydrogen peroxide and a chemical substrate called ABTS.  Upon reaction with HRP a detectable product results.  Thus, ultimately we are monitoring HRP reactions, but the HRP will only still be present in the well if all these other non-covalent reactions took place.",
    desc:"An arrow over the stack turns ABTS into a yellow product. That color is the readout, and it only appears if every binding step below it happened." }
];

window.Deck.sequence("elisa", function(slide){
  const P = scene(slide.querySelector(".elisa-stage") || slide);
  return {
    steps: STEPS.map(x => ({ note:x.note, desc:x.desc })),
    go: function(i){
      Object.keys(P).forEach(k => P[k].classList.toggle("in", STEPS[i].on.indexOf(k) >= 0));
      slide.setAttribute("data-step", i);
    }
  };
});
})();
