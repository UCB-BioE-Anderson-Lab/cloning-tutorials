/* ------------------------------------------------------------------ *
 * 04-terminators.js — the two ways transcription stops.
 *
 * The slide was four bullets, and two of them ("distinct mechanisms,
 * such as Rho-dependence/independence") name mechanisms without saying
 * what either one does.  They are both easy to show and neither is
 * easy to say, so they are drawn:
 *
 *   intrinsic   the terminator is a sequence in the DNA whose PRODUCT
 *               does the work.  An inverted repeat folds into a hairpin
 *               as soon as it leaves the polymerase, and immediately
 *               behind it sits a run of U, which is the weakest hybrid
 *               a transcript can hold the template with.  Hairpin
 *               pulls, rU:dA lets go, transcript drops.
 *   Rho         nothing folds.  Rho is a ring that threads the RNA at a
 *               bare stretch called rut, runs along it burning ATP, and
 *               prises the hybrid apart when it reaches a paused
 *               polymerase.
 *
 * Drawn on one stage, run twice, because the thing the student should
 * carry away is that the SAME event -- hybrid released, polymerase off
 * -- is reached two different ways.  So the second pass resets the
 * stage rather than opening a second panel beside the first.
 *
 * Why rut has to be naked is the quiet reason the last bullet is true:
 * structure, or a ribosome, in that stretch and Rho never loads.  That
 * is the context dependence, so the closing beat says it rather than
 * leaving "probably" to do the work.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GP, C = G.C;
const n2 = v => Math.round(v*10)/10;
const lerp = (a, b, t) => a + (b - a)*t;

const DY = 604, X0 = 180, X1 = 1430;     /* the template                */
const RY = 322, RX5 = 304;               /* transcript backbone, 5' end */
const PA = 520, PB = 1062;               /* polymerase: start, stall    */
const TA = 812, TB = 1092;               /* the terminator, on the DNA  */
const HOFF = 252;                        /* hairpin, behind the exit    */
const RUTA = 372, RUTB = 556;            /* the rut site                */

/* A stem-loop, growing out of the backbone it is drawn on.  Rungs
   rather than a filled shape: the point of the hairpin is that it is
   the transcript base-paired with itself. */
function hairpin(x, grow){
  const o = Math.max(0, Math.min(1, grow));
  const g = G.el("g", {});
  if (o < 0.02) return g;
  const H = 162*o, top = RY - H, w = 18;
  g.appendChild(G.path("M" + n2(x - w) + " " + RY + "V" + n2(top) +
    "a" + w + " " + w + " 0 0 1 " + (2*w) + " 0V" + RY, C.verm, 3.6));
  for (let y = RY - 26; y > top + 10; y -= 28)
    g.appendChild(G.path("M" + n2(x - w + 4) + " " + n2(y) +
      "H" + n2(x + w - 4), C.verm, 2.2));
  if (o > 0.8) g.appendChild(G.text(x, top - 26, "GC-rich stem", 21, C.verm, 700));
  return g;
}

/* The U tract, written on the transcript because the letters ARE the
   mechanism: nothing else about this stretch matters. */
function uTract(xa, xb, o){
  const g = G.grp(o), n = 6;
  for (let i = 0; i < n; i++)
    g.appendChild(G.text(n2(lerp(xa, xb, (i + 0.5)/n)), RY - 26, "U", 26, C.amber, 700));
  g.appendChild(G.path("M" + n2(xa) + " " + (RY + 30) + "v12H" + n2(xb) + "v-12",
    C.amber, 2.6));
  g.appendChild(G.text(n2((xa + xb)/2), RY + 74, "rU:dA — the weakest hybrid there is",
    22, C.amber, 700));
  return g;
}

/* Rho: a hexamer, drawn as a ring with a hole, because the hole is the
   whole mechanism -- the RNA goes through it. */
function rhoRing(cx, o){
  const g = G.grp(o);
  for (let i = 0; i < 6; i++){
    const a = i*Math.PI/3;
    g.appendChild(G.el("circle", {cx:n2(cx + 40*Math.cos(a)), cy:n2(RY + 40*Math.sin(a)),
      r:21, fill:C.paper, stroke:C.blue, "stroke-width":3}));
  }
  g.appendChild(G.text(cx, RY + 10, "ρ", 28, C.blue, 700));
  g.appendChild(G.text(cx, RY - 86, "Rho — ATP-driven", 22, C.blue, 700));
  return g;
}

function bracket(xa, xb, y, up, col, label, sub){
  const g = G.el("g", {}), d = up ? -1 : 1;
  g.appendChild(G.path("M" + xa + " " + y + "v" + (14*d) + "H" + xb + "v" + (-14*d),
    col, 2.6));
  g.appendChild(G.text((xa + xb)/2, y + (up ? -30 : 52), label, 23, col, 700));
  if (sub) g.appendChild(G.text((xa + xb)/2, y + (up ? -56 : 80), sub, 20, C.muted, 400));
  return g;
}

function paint(v, f){
  const g = G.el("g", {});
  const add = n => { g.appendChild(n); return n; };
  const px = lerp(PA, PB, v.tx || 0);
  const off = v.gone || 0;

  add(G.dna(X0, X1, DY));
  add(G.text(X1 + 14, DY + 8, "DNA", 22, C.muted, 700, "start"));
  if (v.term > 0.02){
    const h = G.grp(v.term);
    h.appendChild(G.path("M" + TA + " " + DY + "H" + TB, C.verm, 11));
    h.appendChild(bracket(TA, TB, DY + 26, false, C.verm, "terminator"));
    g.appendChild(h);
  }

  /* the transcript, and everything that happens in it.  On release the
     whole group leaves together, which is the point: hairpin, U tract
     and message are one molecule. */
  const tg = G.el("g", {opacity:n2(1 - 0.55*off),
    transform:"translate(" + n2(-170*off) + "," + n2(186*off) + ")"});
  tg.appendChild(G.rna(px - 28, RX5, RY, 1, C.verm));
  tg.appendChild(G.text(RX5 - 22, RY + 8, "5′", 22, C.muted, 700, "end"));
  /* the rut annotation goes as the transcript goes: once it is off the
     template it is a message, not a mechanism, and the label would
     otherwise come to rest on the DNA */
  if (v.rut*(1 - off) > 0.02)
    tg.appendChild(G.grp(v.rut*(1 - off))).appendChild(
      bracket(RUTA, RUTB, RY + 30, false, C.blue,
              "rut", "C-rich, unfolded, no ribosome"));
  if (v.hair > 0.02) tg.appendChild(hairpin(px - HOFF, v.hair));
  if (v.utr  > 0.02) tg.appendChild(uTract(px - HOFF + 52, px - 72, v.utr));
  if (v.rho  > 0.02) tg.appendChild(rhoRing(lerp(RUTA + 86, px - 104, v.chase || 0), v.rho));
  add(tg);

  /* the transcript leaves the polymerase by its exit channel, so the
     connector goes with the polymerase, not with the message */
  add(G.el("path", {d:"M" + n2(px) + " " + (DY - 88) +
    "C" + n2(px) + " " + (RY + 92) + " " + n2(px - 28) + " " + (RY + 52) +
    " " + n2(px - 28) + " " + RY,
    fill:"none", stroke:C.verm, "stroke-width":3.4, opacity:n2(1 - off)}));

  /* it lifts off the template as it releases, rather than being
     captioned as gone while still drawn sitting on the DNA */
  const pg = G.el("g", {transform:"translate(" + n2(34*off) + "," + n2(-30*off) + ")"});
  pg.appendChild(G.rnap(px, DY, v.paused > 0.02 ? C.blue : C.ink));
  /* beside the polymerase, not under it: the terminator bracket owns
     the space below the DNA and the pause label owns the space above */
  pg.appendChild(G.text(px + 78, DY - 6, off > 0.5 ? "off the template" : "RNA pol",
    22, off > 0.5 ? C.verm : C.muted, 700, "start"));
  if (v.paused > 0.02)
    pg.appendChild(G.grp(v.paused)).appendChild(
      G.text(px, DY - 120, "paused", 23, C.blue, 700));
  add(pg);

  if (off > 0.3)
    add(G.text(1286, 248, "transcript released", 28, C.verm, 700, "end"))
      .setAttribute("opacity", n2(Math.min(1, (off - 0.3)/0.4)));

  if (v.label > 0.02)
    add(G.text(248, 206, v.rut > 0.02 ? "Rho-dependent" : "intrinsic (Rho-independent)",
      32, v.rut > 0.02 ? C.blue : C.verm, 700, "start"))
      .setAttribute("opacity", n2(v.label));

  /* The closing beat stays on the drawing.  An earlier version wiped
     the stage and put a panel of text in its place, which is a second
     slide wearing the first one's title; the verdict goes in the empty
     upper left instead, beside the picture it is about. */
  if (v.sum > 0.02){
    /* below the template, where nothing else is: the upper left still
       holds the mechanism label this beat is the verdict on */
    const h = G.grp(v.sum);
    h.appendChild(G.text(132, 712, "Either way, the same ending \u2014 and neither is a switch.",
      25, C.ink, 700, "start"));
    h.appendChild(G.text(132, 752,
      "A terminator's strength is the fraction of polymerases that stop at it,", 24, C.muted, 400, "start"));
    h.appendChild(G.text(132, 786,
      "and that fraction moves with the sequence around it, because the hairpin has to fold.",
      24, C.muted, 400, "start"));
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

beat({ on:[], s:{tx:0, term:1},
  cap:"a terminator is DNA, but it acts as RNA", call:"",
  note:"One last class of RNA part, and it is the one that ends a message rather than starting it. Here is a polymerase working along the template towards a terminator, marked in red. And the first thing to say about a terminator is the thing the name hides: it is a stretch of DNA, but nothing about it stops the polymerase while it is still DNA. It only works once it has been transcribed. The part is the sequence; the mechanism is its product.",
  desc:"A polymerase transcribing along DNA towards a marked terminator region, with the nascent transcript trailing out behind it."});

beat({ on:[], s:{tx:1, hair:1, label:1}, dur:1800,
  cap:"an inverted repeat folds the moment it is free", call:"",
  note:"The classical terminator, the one that needs no help from anything, is an inverted repeat: a stretch of sequence followed by its own reverse complement. The moment that leaves the exit channel it pairs with itself and folds into a hairpin, and because the repeat is GC-rich the hairpin is a strong one. Note where it forms. Not on the DNA, in the transcript, a few bases behind the polymerase.",
  desc:"The polymerase reaches the terminator. In the transcript just behind it, an inverted repeat folds into a GC-rich hairpin, drawn as a stem of base pairs with a loop at the top."});

beat({ on:[], s:{utr:1, paused:1},
  cap:"and behind the hairpin, a run of U", call:"",
  note:"And immediately behind the hairpin is the second half of it: a run of uracils. Those are still inside the polymerase, paired with the template, and a U against an A is the weakest base pairing in the cell, weaker than anything DNA does with itself. So the polymerase is now holding on by the flimsiest grip available to it, and the hairpin folding up behind is pulling. It pauses.",
  desc:"A run of six U residues in the transcript between the hairpin and the polymerase, bracketed and labelled as the rU:dA hybrid, the weakest there is. The polymerase pauses."});

beat({ on:[], s:{gone:1},
  cap:"", call:"hairpin pulls, the weak hybrid lets go",
  note:"That is enough. The hybrid comes apart, the transcript drops off, and the polymerase comes off the template behind it. No protein was involved anywhere in that, which is why it is called intrinsic, or Rho-independent. Two sequence features, a strong hairpin and a weak hybrid, and the thing terminates itself.",
  desc:"The transcript releases and falls away from the polymerase, which leaves the template. Nothing but the sequence was involved."});

beat({ on:[], s:{hair:0, utr:0, gone:0, rut:1, paused:1},
  cap:"the other kind has no hairpin at all", call:"",
  note:"Now the other mechanism, and it starts from the opposite situation. Same polymerase, same pause, but this transcript folds into nothing useful. What it has instead is this: a stretch of forty to eighty bases that is C-rich, has no secondary structure of its own, and crucially has no ribosome sitting on it. That stretch is called a rut site, for Rho utilisation.",
  desc:"The stage resets: the same polymerase paused on the template, but with no hairpin in the transcript. Instead a bare stretch of the RNA is bracketed and labelled rut: C-rich, unfolded, with no ribosome on it."});

beat({ on:[], s:{rho:1},
  cap:"Rho is a ring, and the RNA goes through it", call:"",
  note:"Rho is a hexamer, six subunits in a ring, and that ring is why the rut site has to be bare. The RNA threads through the hole in the middle. Anything else bound there, a fold, a ribosome, and Rho simply cannot load.",
  desc:"Rho arrives at the rut site, drawn as a ring of six subunits with the transcript threaded through the hole in the centre."});

beat({ on:[], s:{chase:1}, dur:1900,
  cap:"it runs along the message, burning ATP", call:"",
  note:"Once it is on, it translocates along the RNA towards the three prime end, hydrolysing ATP as it goes. So this is a chase. A polymerase moving along DNA, a motor protein moving faster along the message behind it, and the only reason Rho ever catches up is that the polymerase has paused.",
  desc:"Rho translocates along the transcript towards the polymerase, powered by ATP, closing the gap while the polymerase remains paused."});

beat({ on:[], s:{gone:1},
  cap:"", call:"Rho prises the hybrid apart",
  note:"And when it arrives it unwinds the hybrid directly, the same way a helicase would. Transcript off, polymerase off. Exactly the same ending as before, reached by completely different means: there the sequence did it to itself, here a protein came and did it.",
  desc:"Rho reaches the paused polymerase and unwinds the RNA-DNA hybrid. The transcript releases and the polymerase leaves the template, the same ending as the intrinsic route."});

beat({ on:[], s:{sum:1},
  cap:"", call:"",
  note:"So, two mechanisms, and the practical consequences of the difference. An intrinsic terminator is self-contained, which is why essentially every terminator you will use as a part is one: a hundred base pairs or so, and it folds the same way wherever you put it. A Rho-dependent one is not a part in that sense at all, because it depends on a protein finding a bare patch of message. And then the thing that catches people out. Neither of these is a switch. A terminator has a strength, which is the fraction of polymerases that actually stop at it, and the rest read straight through into whatever you put downstream. Strong ones leak a percent or two, weak ones leak a great deal more. And because the hairpin has to fold to work, sequence either side of it can pair with it and spoil the fold, so a terminator that measured strong in one construct can measure weaker in the next. Same problem as ribosome binding sites, same cause.",
  desc:"The closing comparison: intrinsic terminators work by folding and work anywhere; Rho-dependent ones need a protein and a bare stretch of RNA to load on. Neither is all-or-nothing, and because the hairpin has to fold, the fraction that stops depends on the neighbouring sequence."});

window.Deck.sequence("terminators", function(slide){
  const s = G.scene(slide, 790, 842);
  s.finish();
  return G.run(s, FR, paint);
});
})();
