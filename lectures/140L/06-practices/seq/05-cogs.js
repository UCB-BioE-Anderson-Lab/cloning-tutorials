/* ------------------------------------------------------------------ *
 * 05-cogs.js — the two processes, side by side.
 *
 * The point of this slide is NOT the two numbers at the bottom.  It is
 * the tags on the boxes.  Every step of the CAR-T column is paid for
 * once per PATIENT; every step of the antibody column is paid for once
 * per BATCH and then divided by ten thousand doses.  Read that way the
 * cost figures stop being facts to memorise and become consequences of
 * a process diagram, which is the only form in which they are any use
 * to someone designing a product.
 *
 * The left column deliberately follows the same four moves as the MSKCC
 * figure two slides earlier — isolate, engineer, expand, infuse — so the
 * students are being shown the cost structure of a picture they have
 * already accepted.  The steps between those four are the ones the
 * figure leaves out, and they are where the money is.
 *
 * The sharpest single box is release testing: a full sterility,
 * identity and potency panel, run on a batch of one.  In the antibody
 * column the identical panel is run on a batch of ten thousand.  Same
 * regulatory requirement, four orders of magnitude apart in cost per
 * dose, and nothing about the biology explains the difference.
 *
 * PROVENANCE.  Every figure is sourced in the note channel of the beat
 * it appears in.  Nothing from memory.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;
const n2 = v => Math.round(v*10)/10;

const W = 440, LX = 270, RX = 890;
const Y0 = 180, BH = 62, GAP = 10;
const yOf = i => Y0 + i*(BH + GAP);

const LEFT = [
  ["apheresis",        "a hospital procedure, one patient"],
  ["ship to facility", "cold chain, one shipment"],
  ["activate, transduce", "a slice of a vector lot, one patient"],
  ["expand 7–10 days", "one incubator slot, one patient"],
  ["release testing",  "sterility, identity, potency — on a batch of one"],
  ["cryo and ship back", "cold chain again"],
  ["infuse",           "one patient"]
];
const RIGHT = [
  ["master cell bank", "made once, for the life of the product"],
  ["seed train",       "days, one operator"],
  ["production bioreactor", "titres now 8+ g/L"],
  ["capture and polish", "protein A, chromatography"],
  ["fill and finish",  "into vials"],
  ["release testing",  "the same panel — on the whole batch"]
];

function column(x, rows, per, col, o, hi){
  const g = G.grp(o);
  rows.forEach(function(r, i){
    const y = yOf(i);
    g.appendChild(G.step(x, y, W, BH, r[0], r[1], per, col));
    if (i < rows.length - 1)
      g.appendChild(G.arrow(x + W/2, y + BH + 1, x + W/2, y + BH + GAP - 1, C.rule, 2.4));
  });
  if (hi != null && hi > 0.02){
    const y = yOf(4);
    g.appendChild(G.el("rect", {x:x - 10, y:y - 10, width:W + 20, height:BH + 20, rx:16,
      fill:"none", stroke:C.verm, "stroke-width":3.4, opacity:n2(hi)}));
  }
  return g;
}

function paint(v, f){
  const g = G.el("g", {});
  const add = n => { g.appendChild(n); return n; };

  if (v.cart > 0.02){
    const h = G.grp(v.cart);
    h.appendChild(G.text(LX + W/2, 152, "autologous CAR-T", 29, C.verm, 700));
    g.appendChild(h);
    g.appendChild(column(LX, LEFT, "patient", C.ink, v.cart, v.hi));
  }
  if (v.hi > 0.02){
    const h = G.grp(v.hi), y = yOf(4);
    h.appendChild(G.lines(LX - 24, y + 4,
      ["the same release panel", "a regulator would demand", "of ten thousand doses —", "run on one"],
      19, C.verm, 700, "end", 25));
    g.appendChild(h);
  }
  if (v.bi > 0.02){
    const h = G.grp(v.bi);
    h.appendChild(G.text(RX + W/2, 152, "bispecific antibody", 29, C.blue, 700));
    g.appendChild(h);
    g.appendChild(column(RX, RIGHT, "batch", C.ink, v.bi));
  }

  /* the division is the whole asymmetry, so it gets a box of its own */
  if (v.div > 0.02){
    const h = G.grp(v.div), y = yOf(6);
    h.appendChild(G.el("rect", {x:RX, y:y, width:W, height:BH, rx:12,
      fill:C.blue, "fill-opacity":0.12, stroke:C.blue, "stroke-width":2.6}));
    h.appendChild(G.text(RX + W/2, y + 42, "÷ ten thousand doses", 24, C.blue, 700));
    g.appendChild(h);
  }

  if (v.tot > 0.02){
    const h = G.grp(v.tot), y = yOf(7) + 24;
    h.appendChild(G.path("M" + LX + " " + y + "H" + (LX + W), C.rule, 2));
    h.appendChild(G.path("M" + RX + " " + y + "H" + (RX + W), C.rule, 2));
    h.appendChild(G.text(LX + W/2, y + 44, "$100,000–150,000", 32, C.verm, 700));
    h.appendChild(G.text(LX + W/2, y + 74, "per dose", 21, C.muted, 400));
    h.appendChild(G.text(RX + W/2, y + 44, "tens of dollars", 32, C.blue, 700));
    h.appendChild(G.text(RX + W/2, y + 74,
      "of drug substance, per dose", 21, C.muted, 400));
    g.appendChild(h);
  }
  return g;
}

const FR = [];
let acc = {};
function beat(o){
  acc = Object.assign({}, acc, o.s || {});
  FR.push(Object.assign({}, o, {s:Object.assign({}, acc)}));
}

beat({ on:[], s:{cart:1},
  cap:"", call:"",
  note:"So let us take the process apart, because the cost is not a fact about cell therapy, it is a consequence of these boxes. On the left, CAR-T. Four of these steps you have already seen, in the figure two slides ago: isolate, engineer, expand, infuse. The ones the figure leaves out are where the money is. Apheresis is a hospital procedure booked for one named person. The shipment is a cold chain for one bag. The vector, the incubator, the operator's time, all of it is consumed by one patient. Look at the tag on every box: per patient. Nothing here is amortised over anybody else.",
  desc:"The autologous CAR-T process drawn as seven steps: apheresis, shipping, activation and transduction, expansion, release testing, cryopreservation and return shipping, and infusion. Every step is tagged as happening once per patient."});

beat({ on:[], s:{hi:1},
  cap:"", call:"",
  note:"And the one worth stopping on is release testing. Before any of this can be given to a person, it has to pass sterility, identity and potency — the full panel a regulator demands of a medicine. That panel does not get cheaper because your batch is small. Here the batch is one. The same testing a company would run once over ten thousand doses of a drug gets run here over a single patient's cells, and it gets run again for the next patient, and the one after that. One more thing follows from a batch of one: a failed run is not a failed batch, it is a failed patient, and they may not have time for a second attempt.",
  desc:"The release testing step is picked out: the same sterility, identity and potency panel that a regulator would demand of ten thousand doses, run here on a batch of one."});

beat({ on:[], s:{bi:1},
  cap:"", call:"",
  note:"Now the other column. A bispecific is an ordinary recombinant protein, made the way every therapeutic antibody has been made for thirty years. You build a master cell bank once and it lasts the life of the product. You grow a seed train, you run a production bioreactor — and titres are now above eight grams per litre, which is the quiet engineering achievement underneath all of this — then protein A capture, polishing, fill and finish. Read the tags. Every one of these says per batch. [Titres: Tandfonline, The history and potential future of monoclonal antibody therapeutics development and manufacturing in four eras, 2024.]",
  desc:"The bispecific antibody process drawn as six steps: master cell bank, seed train, production bioreactor at titres above 8 grams per litre, capture and polish, fill and finish, and release testing. Every step is tagged as happening once per batch."});

beat({ on:[], s:{div:1},
  cap:"", call:"",
  note:"And then the step that has no counterpart on the left at all. You divide by the number of doses in the batch. Everything above this line — the bioreactor run, the chromatography, the release panel, the operator, the facility — gets spread across ten thousand patients. The left column has no such line. There is nothing to divide by, because the batch was one person.",
  desc:"A final box on the antibody side: divide by ten thousand doses. The CAR-T column has no equivalent step."});

beat({ on:[], s:{tot:1},
  cap:"", call:"",
  note:"Which gives you the numbers, and now they are conclusions rather than claims. Autologous CAR-T lands at a hundred to a hundred and fifty thousand dollars a patient. Antibody drug substance at commercial scale costs on the order of fifty to a hundred dollars a gram, and a dose is a fraction of a gram to about a gram, so the drug substance in a dose is tens of dollars. Bispecifics cost perhaps thirty to forty per cent more to make than a conventional antibody, which moves that figure hardly at all on this scale. Three orders of magnitude, and not one of them is explained by the biology. The biology of CAR-T is arguably the better idea. The difference is entirely in which boxes get divided by ten thousand. [Antibody COGS of $50–100/g and the $10s–$100s per gram range: Tandfonline, Cost and supply considerations for antibody therapeutics, 2025; Gates Foundation Grand Challenges low-cost mAb manufacturing white paper. Bispecific premium of 30–40%: Synapse/PatSnap, 2023. CAR-T COGS as before.]",
  desc:"The two totals: $100,000 to $150,000 per dose for autologous CAR-T, against tens of dollars of drug substance per dose for the antibody. Three orders of magnitude, explained entirely by which steps are divided across a batch."});

window.Deck.sequence("cogs", function(slide){
  const s = G.scene(slide, 862, 890);
  s.finish();
  return G.run(s, FR, paint);
});
})();
