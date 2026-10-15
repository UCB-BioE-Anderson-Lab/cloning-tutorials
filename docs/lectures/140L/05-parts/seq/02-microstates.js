/* ------------------------------------------------------------------ *
 * 02-microstates.js — molecular function, described as plainly as
 * chemistry allows.
 *
 * Replaces a ribosome structure that was sitting beside this list doing
 * no work at all: it illustrated none of the three words next to it.
 *
 * What the three words actually have in common is that each names a set
 * of states a molecule can be in, and the transitions between them.
 * Drawn that way the differences are visible rather than asserted:
 *
 *   enzyme           four states, and exactly ONE of the transitions
 *                    makes or breaks a bond
 *   binding protein  the same picture with the covalent step deleted
 *   transporter      no covalent step either, but the state has to
 *                    record which side of a membrane the cargo is on
 *
 * The substrate changes SHAPE at the covalent step and only there, so
 * "covalent" is something you can see rather than a word on an arrow.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GP, C = G.C;
const n2 = v => Math.round(v*10)/10;

const ROW = [296, 512, 716];          /* enzyme, binder, transporter   */
const LX  = 128;                      /* the row label                 */
const N0  = 534, NGAP = 288;          /* first node, then spacing      */

/* A substrate is a circle and a product is a diamond.  The shape change
   IS the covalent step; nothing else on the slide changes shape. */
function token(cx, cy, product, col){
  const c = col || C.verm, r = 15;
  return product
    ? G.path("M" + cx + " " + (cy - r) + "L" + (cx + r) + " " + cy +
             "L" + cx + " " + (cy + r) + "L" + (cx - r) + " " + cy + "Z", c, 3)
    : G.el("circle", {cx:cx, cy:cy, r:r, fill:"none", stroke:c, "stroke-width":3});
}
/* An arrow from a to b, with what kind of transition it is written over
   it.  Covalent ones are vermillion and heavier; everything else is the
   unremarkable kind and stays at ink. */
function step(xa, xb, y, label, covalent, both){
  const g = G.el("g", {}), c = covalent ? C.verm : C.muted;
  g.appendChild(G.path("M" + xa + " " + y + "H" + xb, c, covalent ? 4 : 2.8));
  g.appendChild(G.path("M" + xb + " " + y + "l-13 -8m13 8l-13 8", c, covalent ? 4 : 2.8));
  if (both) g.appendChild(G.path("M" + xa + " " + y + "l13 -8m-13 8l13 8", c, 2.8));
  g.appendChild(G.text((xa + xb)/2, y - 18, label, 19, c, 700));
  return g;
}
function caption(cx, y, s){ return G.text(cx, y, s, 20, C.muted, 400); }

/* ---- the three panels -------------------------------------------- */
function enzyme(o){
  const g = G.grp(o), y = ROW[0];
  g.appendChild(G.text(LX, y, "Enzyme", 27, C.blue, 700, "start"));
  g.appendChild(G.text(LX, y + 32, "bind, react, release", 19, C.muted, 400, "start"));
  [0, 1, 2].forEach(function(i){
    const cx = N0 + i*NGAP;
    g.appendChild(G.enzyme(cx, y, C.ink));
    if (i < 2) g.appendChild(token(cx + 22, y, i === 1, C.verm));
    else g.appendChild(token(cx + 96, y, true, C.verm));
    g.appendChild(caption(cx + (i === 2 ? 44 : 0), y + 72,
      ["E·S", "E·P", "E + P"][i]));
  });
  g.appendChild(step(N0 - 120, N0 - 50, y, "+S", false));
  g.appendChild(token(N0 - 150, y, false, C.verm));
  g.appendChild(step(N0 + 52, N0 + NGAP - 50, y, "covalent", true));
  g.appendChild(step(N0 + NGAP + 52, N0 + 2*NGAP - 50, y, "non-covalent", false));
  return g;
}
function binder(o){
  const g = G.grp(o), y = ROW[1];
  g.appendChild(G.text(LX, y, "Binding protein", 27, C.blue, 700, "start"));
  g.appendChild(G.text(LX, y + 32, "minus the chemistry", 19, C.muted, 400, "start"));
  g.appendChild(G.enzyme(N0, y, C.ink));
  g.appendChild(token(N0 - 96, y, false, C.verm));
  g.appendChild(caption(N0 - 24, y + 72, "P + L"));
  g.appendChild(step(N0 + 52, N0 + NGAP - 50, y, "non-covalent", false, true));
  g.appendChild(G.enzyme(N0 + NGAP, y, C.ink));
  g.appendChild(token(N0 + NGAP + 22, y, false, C.verm));
  g.appendChild(caption(N0 + NGAP, y + 72, "P·L"));
  g.appendChild(G.text(N0 + 2*NGAP - 40, y - 4, "two states, one transition,", 21, C.ink, 400, "start"));
  g.appendChild(G.text(N0 + 2*NGAP - 40, y + 26, "and no bond is touched", 21, C.ink, 700, "start"));
  return g;
}
function transporter(o){
  const g = G.grp(o), y = ROW[2];
  g.appendChild(G.text(LX, y, "Transporter", 27, C.blue, 700, "start"));
  g.appendChild(G.text(LX, y + 32, "no reaction — a new side", 19, C.muted, 400, "start"));
  [0, 1, 2].forEach(function(i){
    const cx = N0 + i*NGAP;
    /* the membrane, which is the thing the state is relative to */
    [-34, 34].forEach(dx => g.appendChild(
      G.path("M" + (cx + dx) + " " + (y - 98) + "V" + (y + 76), C.muted, 2.4)));
    g.appendChild(G.permease(cx, y, C.ink));
    g.appendChild(token(cx + [-86, 0, 86][i], y, false, C.verm));
    g.appendChild(caption(cx, y + 100, ["outside", "in transit", "inside"][i]));
  });
  g.appendChild(step(N0 + 62, N0 + NGAP - 60, y - 52, "non-covalent", false));
  g.appendChild(step(N0 + NGAP + 62, N0 + 2*NGAP - 60, y - 52, "non-covalent", false));
  return g;
}

function paint(v, f){
  const g = G.el("g", {});
  if (v.enz  > 0.01) g.appendChild(enzyme(v.enz));
  if (v.bind > 0.01) g.appendChild(binder(v.bind));
  if (v.tran > 0.01) g.appendChild(transporter(v.tran));
  if (v.close > 0.01){
    const h = G.grp(v.close);
    h.appendChild(G.text(800, 864,
      "every one of these is a set of states and the moves between them", 26, C.ink, 700));
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

beat({ on:[], s:{enz:1},
  cap:"", call:"",
  note:"Start with the most chemically basic way of saying what a protein does. An enzyme binds something, changes a bond in it, and lets go. Drawn as states, that is four of them, and only one of the transitions between them is a chemical reaction. The substrate changes shape on this diagram exactly once, at the covalent step. Everything either side of it is binding and release.",
  desc:"An enzyme drawn as a sequence of states: free enzyme plus substrate, enzyme bound to substrate, enzyme bound to product, and enzyme plus released product. The substrate is a circle and the product a diamond, and the shape changes only at the one transition marked covalent."});

beat({ on:[], s:{bind:1},
  cap:"", call:"",
  note:"A binding protein is that same picture with the covalent step deleted. Two states, one transition, and no bond is made or broken anywhere in it. An antibody, a lectin, a transcription factor on its operator: all of them are this diagram. Which is worth noticing, because it means the difference between an enzyme and a binding protein is not a difference of kind. It is one missing arrow.",
  desc:"A binding protein drawn as two states, free protein plus ligand and the complex, joined by a single reversible non-covalent transition, with no covalent step anywhere."});

beat({ on:[], s:{tran:1},
  cap:"", call:"",
  note:"A transporter is the interesting one. Nothing reacts here either; every transition is non-covalent. But look at what the states have to record. The cargo starts outside, ends inside, and is the same molecule throughout. So the state is not just what is bound to what. It includes which side of a membrane you are on. Compartment is part of the description.",
  desc:"A transporter drawn as three states across a membrane: cargo outside, cargo in transit within the protein, and cargo inside. Every transition is non-covalent; what changes between the states is which side of the membrane the cargo is on."});

beat({ on:[], s:{close:1},
  cap:"", call:"",
  note:"So at this level the vocabulary is very small. A molecular function is a set of states and the moves between them, and the moves are either covalent or non-covalent, with compartment as the third thing a state can record. Enzyme, binding protein and transporter are not three different kinds of thing. They are three shapes of the same diagram.",
  desc:"The closing line: every one of these is a set of states and the moves between them."});

window.Deck.sequence("microstates", function(slide){
  const s = G.scene(slide, 900, 900);
  s.finish();
  return G.run(s, FR, paint);
});
})();
