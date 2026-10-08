/* ------------------------------------------------------------------ *
 * 02-trigger.js — what makes a piece of work "regulated research".
 *
 * The single most important thing in the draft policy, and the easiest
 * to miss, is that the TRIGGER changes.  For nearly fifty years the
 * question at the top of the NIH Guidelines was a question about what
 * you did to the DNA: did you join nucleic acid molecules, or make
 * synthetic ones that can base-pair with natural ones?  The draft
 * replaces that with a question about what is in the flask: is this a
 * biohazard?
 *
 * Drawn as scope rather than described as policy, because the shape is
 * the argument.  The new boundary is strictly larger — it pulls in
 * wild-type pathogens, toxins, prions and self-aggregating proteins
 * that the old document never addressed — and yet the review burden on
 * the inside goes DOWN for most of it.  Those two facts sound
 * contradictory until you see that scope and burden are different axes,
 * which is exactly the thing worth arguing about afterwards.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;
const n2 = v => Math.round(v*10)/10;

/* the chips, and whether the OLD document reached them */
const ITEM = [
  { s:"genetically modified\norganisms",     x:800, y:420, old:true  },
  { s:"synthetic nucleic acids",             x:800, y:530, old:true  },
  { s:"wild-type\ndisease agents",           x:430, y:398, old:false },
  { s:"toxins",                              x:1180, y:398, old:false },
  { s:"prions",                              x:430, y:556, old:false },
  { s:"self-aggregating\nproteins",          x:1180, y:556, old:false },
  { s:"cells containing\nany of these",      x:800, y:640, old:false }
];

function chip(it, o, col){
  const g = G.grp(o), parts = it.s.split("\n");
  const w = 232, h = parts.length > 1 ? 72 : 52;
  g.appendChild(G.el("rect", {x:it.x - w/2, y:it.y - h/2, width:w, height:h, rx:14,
    fill:C.paper, stroke:col, "stroke-width":2.6}));
  g.appendChild(G.lines(it.x, it.y + (parts.length > 1 ? -2 : 8), parts,
    20, col, 700, "middle", 26));
  return g;
}

function paint(v, f){
  const g = G.el("g", {});
  const add = n => { g.appendChild(n); return n; };

  /* the new boundary, drawn first so everything sits inside it */
  if (v.wide > 0.02){
    const h = G.grp(v.wide);
    h.appendChild(G.el("rect", {x:244, y:322, width:1112, height:390, rx:40,
      fill:C.blue, "fill-opacity":0.05, stroke:C.blue, "stroke-width":3.4}));
    h.appendChild(G.text(800, 290, "is it a biohazard?", 32, C.blue, 700));
    g.appendChild(h);
  }

  /* the old boundary: a question about what you did to the DNA */
  if (v.old > 0.02){
    const h = G.grp(v.old*(1 - 0.45*(v.wide || 0)));
    h.appendChild(G.el("rect", {x:648, y:372, width:304, height:216, rx:28,
      fill:"none", stroke:C.ink, "stroke-width":3, "stroke-dasharray":"10 8"}));
    /* above the box it names once the wide boundary arrives: below it,
       the label lands on the "cells containing any of these" chip */
    h.appendChild(G.lines(800, v.wide > 0.02 ? 356 : 290,
      v.wide > 0.02 ? ["the old trigger"]
                    : ["did you join nucleic acid molecules,",
                       "or synthesise ones that can pair with them?"],
      v.wide > 0.02 ? 21 : 29, C.ink, 700, "middle", 34));
    g.appendChild(h);
  }

  ITEM.forEach(function(it){
    const o = it.old ? v.old : v.wide;
    if (o > 0.02) g.appendChild(chip(it, o, it.old ? C.ink : C.blue));
  });

  if (v.light > 0.02){
    const h = G.grp(v.light);
    h.appendChild(G.el("rect", {x:648, y:372, width:304, height:216, rx:28,
      fill:C.verm, "fill-opacity":0.1, stroke:C.verm, "stroke-width":3}));
    /* two sizes, so drawn by hand rather than bending G.lines out of
       shape for its one caller that wants them */
    h.appendChild(G.text(800, 756, "the scope goes up and the paperwork goes down",
      27, C.ink, 700));
    h.appendChild(G.text(800, 790,
      "different axes — and nearly everything you will ever do is in the red box",
      22, C.muted, 400));
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

beat({ on:[], s:{old:1},
  cap:"", call:"",
  note:"Before anything else, the question of what makes a piece of work regulated at all. For nearly fifty years the NIH Guidelines opened with a question about what you did to the DNA: did you join nucleic acid molecules together, or synthesise ones that can base-pair with natural ones? Answer yes and the document applied to you. Answer no and it did not. Which has a strange consequence that nobody designed on purpose: somebody working with a wild-type pathogen, doing no cloning at all, fell outside this document entirely.",
  desc:"The old trigger drawn as a dashed box containing just two things: genetically modified organisms and synthetic nucleic acids. The question at the top is whether you joined nucleic acid molecules or synthesised ones that can pair with them."});

beat({ on:[], s:{wide:1}, dur:1500,
  cap:"", call:"",
  note:"The draft policy replaces that question with a different one: is this a biohazard? Which pulls in everything the old document never addressed. Wild-type disease agents. Toxins. Prions and self-aggregating proteins — and notice that a prion is not a nucleic acid at all, so no amount of rewriting the recombinant definition was ever going to reach it. Cells that contain any of these. The boundary is strictly larger than it was, and it is drawn around hazard rather than around technique.",
  desc:"The new boundary expands to a much larger box labelled: is it a biohazard? Inside it, alongside the old two, sit wild-type disease agents, toxins, prions, self-aggregating proteins, and cells containing any of these."});

beat({ on:[], s:{light:1},
  cap:"", call:"",
  note:"And here is the part that sounds contradictory until you look at it. The scope got bigger and the paperwork got smaller. Scope and burden are different axes. The old framework asked a technique question and then applied a fairly uniform process to everybody who answered yes; the new one asks a hazard question and then scales the review to the answer. So work with a genetically modified RG1 organism — which is to say nearly everything you will ever do, everything in this course, the red box — moves to the lightest tier there is. We will come back to whether that is proportionality or deregulation, because it is a real argument and I do not think it has an obvious answer.",
  desc:"The old box is highlighted in red: the scope of oversight goes up while the paperwork goes down, because scope and burden are different axes, and nearly all of the students' own work sits in the lightest tier."});

window.Deck.sequence("trigger", function(slide){
  const s = G.scene(slide, 826, 862);
  s.finish();
  return G.run(s, FR, paint);
});
})();
