/* ------------------------------------------------------------------ *
 * 00-biochem.js — what the salicylate part actually sets off.
 *
 * The slide before ends on the claim that classifying a part by what it
 * outputs is enough to compose DNA with and not enough to predict a
 * cell.  This is that claim made good: the same part, in front of GFP,
 * in a cell, with every step drawn.
 *
 * Cumulative on one canvas, because the LAST frame is the deliverable.
 * The slide after it takes this finished diagram and marks the two
 * pieces of DNA that generate the whole of it, which only works if the
 * whole of it is on screen at once.
 *
 * The order is the order of events, and two of the beats exist only
 * because they are the ones people get wrong: NahR occupies the
 * operator BEFORE induction, so "inducible" does not mean "nothing is
 * bound"; and the chromophore matures slowly and needs oxygen, which
 * is a step no promoter-outputs-transcript account has anywhere to put.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GP, C = G.C;
const lerp = (a, b, t) => a + (b - a)*t;
const n2 = v => Math.round(v*10)/10;

/* ---- the canvas -------------------------------------------------- */
const CELL = {x:110, y:146, w:1380, h:606};
const DY = 652, RY = 498, PY = 312;
const LY = DY + 60;          /* feature labels: clear of the rings AND
                                of the cell wall they were sitting on */        /* DNA, RNA, protein bands  */
const X0 = 180, X1 = 1420;
const NAHR = [272, 232];      /* nahR, drawn LEFTWARD: head at NAHR[0] */
const PN   = 574;             /* PnahR, also leftward                  */
const OPX = 656, OPW = 126;   /* the operator, between the two units   */
const PS  = 814, GFP = [856, 300];   /* Psal and gfp, rightward        */

/* Straight.  An earlier version bowed the molecule under the bound
   regulator; a shallow bend is not worth a transition and just makes
   the backbone look wobbly.  A LOOP is worth drawing -- see 01-arac --
   but this is not one. */
function backbone(){
  return G.dna(X0, X1, DY);
}
/* The operator is drawn with the other FEATURES below, not here, so
   that it stays lit while the machinery dims on the reduction beats. */

function paint(v, f){
  const g = G.el("g", {});
  const add = n => { g.appendChild(n); return n; };

  /* Machinery dims on the reduction beats; the two features do not.
     Everything the cell brought with it is context once the question
     becomes which pieces of DNA you actually have to name. */
  const M = 1 - (v.reduce || 0)*0.88;

  /* ---- the molecule itself ------------------------------------- */
  add(backbone()).setAttribute("opacity", n2(1 - (v.reduce || 0)*0.55));

  /* ---- what is written on it ------------------------------------ */
  const feat = G.grp(1);
  feat.appendChild(G.gene(NAHR[0], DY, NAHR[1], "nahR", C.blue, -1))
      .setAttribute("font-style", "italic");
  feat.appendChild(G.operator(OPX, OPW, DY, C.amber));
  feat.appendChild(G.promoter(PS, DY, null, C.ink, 1));
  feat.appendChild(G.text(OPX + OPW/2, LY, "operator", 22, C.amber, 700));
  feat.appendChild(G.text(PS + 20, LY, "Psal", 22, C.ink, 700, "start"));
  add(feat);
  const other = G.grp(M);
  other.appendChild(G.promoter(PN, DY, null, C.ink, -1));
  other.appendChild(G.text(PN - 20, LY, "PnahR", 22, C.ink, 700, "end"));
  other.appendChild(G.gene(GFP[0], DY, GFP[1], "gfp", C.amber, 1))
       .setAttribute("font-style", "italic");
  add(other);

  /* ---- the two irreducible pieces, ringed ----------------------- */
  if (v.reduce > 0.02){
    const r = G.grp(v.reduce);
    /* One ring over the whole leftward unit.  A divergent promoter sits
       hard against its own gene, so separate rings around them collide
       no matter how they are nudged -- and "makes a protein" needs both
       of them anyway. */
    r.appendChild(G.el("rect", {x:NAHR[0] - 20, y:DY - 50, width:(PN - NAHR[0]) + 42,
      height:78, rx:14, fill:"none", stroke:C.verm, "stroke-width":3.4}));
    r.appendChild(G.text(NAHR[0] + (PN - NAHR[0])/2, DY - 68,
      "makes a protein that binds DNA", 22, C.verm, 700));
    r.appendChild(G.el("rect", {x:OPX - 20, y:DY - 50, width:(PS - OPX) + 82,
      height:78, rx:14, fill:"none", stroke:C.verm, "stroke-width":3.4}));
    r.appendChild(G.text(OPX + (PS - OPX)/2 + 22, DY - 68,
      "the DNA it binds", 22, C.verm, 700));
    add(r);
  }
  /* The interaction needs two pieces, but the part carries THREE
     irreducible ones, and the left-hand ring holds two of them.  The
     last beat divides it rather than drawing a third box nobody has
     room for. */
  if (v.named > 0.02){
    const q = G.grp(v.named), mid = PN - 44;
    q.appendChild(G.path("M" + mid + " " + (DY - 50) + "v78", C.verm, 2.6, "7 6"));
    q.appendChild(G.text(mid - 12, DY - 26, "CDS", 19, C.verm, 700, "end"));
    q.appendChild(G.text(mid + 12, DY - 26, "promoter", 19, C.verm, 700, "start"));
    add(q);
  }

  /* ---- polymerase at PnahR -------------------------------------- */
  if (v.pol1 > 0.02){
    const h = G.grp(Math.min(1, v.pol1*2)*M);
    const s1 = G.early(v.seat1);
    const cx = lerp(PN + 160, PN - 10, s1), cy = lerp(PY + 40, DY, s1);
    h.appendChild(G.rnap(cx, cy, C.ink));
    h.appendChild(G.sigma(cx + 60, cy - 70, v.share > 0.5 ? C.verm : C.blue, "σ70"));
    g.appendChild(h);
  }
  /* ---- polymerase recruited to Psal ----------------------------- */
  if (v.pol2 > 0.02){
    const h = G.grp(Math.min(1, v.pol2*2)*M);
    const s2 = G.early(v.seat2);
    const cx = lerp(PS - 160, PS + 16, s2), cy = lerp(PY + 60, DY, s2);
    h.appendChild(G.rnap(cx, cy, C.ink));
    h.appendChild(G.sigma(cx + 60, cy - 70, v.share > 0.5 ? C.verm : C.blue, "σ70"));
    g.appendChild(h);
  }

  /* ---- transcripts ---------------------------------------------- */
  if (G.late(v.tx1) > 0.01) add(G.rna(PN - 24, NAHR[0] - 26, RY,
    G.late(v.tx1))).setAttribute('opacity', n2(M));
  if (G.late(v.tx2) > 0.01) add(G.rna(GFP[0] - 16, GFP[0] + GFP[1] + 30, RY,
    G.late(v.tx2))).setAttribute('opacity', n2(M));

  /* ---- ribosomes ------------------------------------------------ */
  if (v.rib1 > 0.02){
    const h = G.grp(Math.min(1, v.rib1*2)*M);
    h.appendChild(G.ribosome(lerp(PN - 60, NAHR[0] + 10, G.early(v.rib1)), RY));
    g.appendChild(h);
  }
  if (v.rib2 > 0.02){
    const h = G.grp(Math.min(1, v.rib2*2)*M);
    h.appendChild(G.ribosome(lerp(GFP[0] + 30, GFP[0] + GFP[1] - 10, G.early(v.rib2)), RY));
    g.appendChild(h);
  }

  /* ---- NahR: made, folded, paired, then seated on the operator --- */
  const dx = lerp(392, OPX + OPW/2 - 24, v.bound) + v.salb*40;
  const dy = lerp(PY, DY - 44, v.bound);
  if (G.late(v.nahr) > 0.02){
    const h = G.grp(G.late(v.nahr)*M);
    /* The pair stays far enough apart to read as TWO protomers, and the
       second is mirrored.  At a closer separation the two outlines merge
       into one silhouette and the dimer reads as a single blob sitting
       on the DNA -- which is exactly how a repressor is drawn. */
    const sep = lerp(78, 38, v.dim);
    h.appendChild(G.nahr(dx - sep, dy, v.salb, C.blue));
    if (v.dim > 0.02){
      const h2 = G.grp(Math.min(1, v.dim*2));
      h2.appendChild(G.nahr(dx + sep, dy, v.salb, C.blue, null, true));
      h.appendChild(h2);
    }
    /* It is an ACTIVATOR, and a protein seated on DNA upstream of a
       promoter is read as a repressor unless the drawing says so. */
    if (v.bound > 0.5)
      h.appendChild(G.text(dx, dy - 82, "NahR dimer — an activator", 20, C.blue, 700));
    g.appendChild(h);
  }
  /* the induced contact: what activation IS here, drawn rather than
     asserted -- the dimer reaching the polymerase it is recruiting */
  if (v.salb > 0.3 && v.pol2 > 0.3 && G.early(v.seat2) > 0.6){
    const h = G.grp(Math.min(1, (v.salb - 0.3)/0.4));
    h.appendChild(G.path("M" + n2(dx + 58) + " " + n2(dy - 28) +
      "q36 -22 70 -4", C.blue, 3.4));
    h.appendChild(G.text(n2(dx + 116), n2(dy - 46), "recruits", 20, C.blue, 700));
    g.appendChild(h);
  }

  /* ---- salicylate, crossing in and then docking ------------------ */
  if (v.sal > 0.02){
    const bx = lerp(CELL.x - 46, 330, Math.min(1, v.sal)),
          by = lerp(300, 272, Math.min(1, v.sal));
    const h = G.grp(Math.min(1, v.sal*2)*M);
    /* docks ABOVE the pair rather than beside it: at the side its own
       OH and COOH labels are drawn straight through the protein. */
    /* Docks ABOVE AND LEFT of the pair, which is the only clear space
       at this point in the run: to the right it lands on the Psal
       polymerase and on the head of the gfp transcript, and directly
       above it lands on the sigma lobe.  It also arrived from the left
       wall, so approaching from that side is the honest path. */
    h.appendChild(G.mol("salicylate", lerp(bx, dx - 76, v.salb),
                        lerp(by, dy - 192, v.salb), 178));
    g.appendChild(h);
  }

  /* ---- GFP ------------------------------------------------------- */
  if (G.late(v.prot) > 0.02){
    const h = G.grp(G.late(v.prot)*M);
    h.appendChild(G.gfp(GFP[0] + GFP[1]/2, PY, v.mat, C.amber));
    g.appendChild(h);
  }

  /* ---- the shared pool ------------------------------------------- */
  if (v.share > 0.02){
    const h = G.grp(v.share*M);
    h.appendChild(G.text(800, 212, "one σ70 pool — every promoter in the cell draws on it",
      25, C.verm, 700));
    g.appendChild(h);
  }
  return g;
}

/* ---- the beats --------------------------------------------------- *
 * Built by accumulation, so every frame carries every key that should
 * still be on screen.  Leaving a key out of a later frame counts as
 * zero and deletes what it draws, silently.                           */
const FR = [];
let acc = {};
function beat(o){
  acc = Object.assign({}, acc, o.s || {});
  FR.push(Object.assign({}, o, {s:Object.assign({}, acc)}));
}

beat({ on:[], s:{},
  cap:"The part is in the cell",
  call:"and it is just DNA",
  note:"So here is that part, cloned in front of GFP, sitting in a cell. And at this moment nothing is happening at all. It is a piece of DNA, and DNA on its own does nothing. Everything that follows has to be done to it by something that was already in the cell before it arrived.",
  desc:"A cell containing one DNA molecule. On it, from left to right: the promoter for nahR, the nahR gene, the operator NahR binds, the salicylate promoter, and gfp. Nothing is bound to any of it."});

beat({ on:[], s:{pol1:0.35},
  cap:"σ70 was already here",
  call:"on core polymerase, before your DNA arrived",
  note:"The first thing to notice is that the machinery is already here. Sigma seventy is in the cell, associated with core RNA polymerase, and that holoenzyme existed before you transformed anything into it. You did not encode it and you do not control it, and that will matter by the end of this slide.",
  desc:"RNA polymerase with its sigma-70 subunit appears inside the cell, away from the DNA, to make the point that it was already present."});

beat({ on:[], s:{pol1:1, seat1:1, tx1:1},
  cap:"σ70 finds the promoter for <em>nahR</em>",
  call:"open complex, and a transcript",
  note:"Sigma seventy is the thing that reads a promoter. It finds the constitutive promoter the part carries for nahR, melts the DNA open, and core polymerase starts making RNA. Notice that nothing about this first event is regulated: the promoter fires simply because sigma seventy exists.",
  desc:"The polymerase seats on the nahR promoter and a transcript grows out along the RNA band above the DNA."});

beat({ on:[], s:{rib1:1, nahr:1},
  cap:"a ribosome reads it, and NahR comes off",
  call:"two domains: one binds DNA, one binds a small molecule",
  note:"A ribosome binds the message and translates it, and what comes off is NahR. It folds into two domains, and those two domains are the whole mechanism: one of them binds DNA and the other binds a small molecule. Keep those two separate in your head; everything that follows turns on the difference.",
  desc:"A ribosome moves along the nahR transcript and the NahR protein appears above it, drawn with two domains."});

beat({ on:[], s:{dim:1},
  cap:"NahR pairs up",
  call:"the functional unit is a dimer, not a chain",
  note:"NahR is not functional as a single chain. It is a LysR-type regulator, and like the rest of that family its DNA-bound form is a dimer, with higher-order assemblies on top of that depending on the promoter. Two copies have to find each other first, so how much NahR there is, and how fast it is made, both matter.",
  desc:"A second copy of NahR appears and the two associate into a pair."});

beat({ on:[], s:{bound:1},
  cap:"and it binds the operator <b>with no salicylate present</b>",
  call:"bound — and <b>not yet activating</b>",
  note:"Now the part people get wrong. NahR is an activator, not a repressor, and yet it goes and sits down on its site straight away, before there is any salicylate anywhere. With it sitting there, transcription of GFP is low but not zero. So inducible does not mean that nothing is bound, and a protein on the DNA does not mean a gene is being held shut. The site is occupied the whole time, and what salicylate changes is not whether the regulator is there, but what it does once it is.",
  desc:"The NahR pair moves down onto the operator and binds it. No transcript is being made from the salicylate promoter."});

beat({ on:[], s:{sal:1},
  cap:"salicylate crosses the envelope",
  call:"",
  note:"Then you add salicylate to the medium. It crosses the cell envelope and arrives in the cytoplasm, and how fast that happens, and how much of it gets in, are properties of the molecule and the membrane. Nothing in your construct has any say in either.",
  desc:"A salicylate molecule, drawn as its real structure with a hydroxyl and a carboxylic acid on a benzene ring, crosses into the cell."});

beat({ on:[], s:{salb:1},
  cap:"it binds the effector domain, and NahR changes shape",
  call:"and shifts where it sits on the DNA",
  note:"Salicylate binds the other domain, the one that never touches DNA. That changes the shape of the protein, the change is passed through to the DNA-binding domain, and it shifts where it grips, sliding towards the promoter. The regulator has not arrived and it has not left; the complex it forms with the DNA has rearranged into a different configuration.",
  desc:"Salicylate docks into the effector domain of NahR, the protein's shape shifts, and the bow in the DNA straightens out."});

beat({ on:[], s:{pol2:1, seat2:1, tx2:1},
  cap:"<b>now</b> polymerase is recruited to P<em>sal</em>",
  call:"which is what activation means",
  note:"And in that new configuration the regulator can reach the polymerase and help hold it at the salicylate promoter. That is what activation is: not the removal of a block, but a protein recruiting the machinery. Transcription of GFP goes from a trickle to the real thing. Everything up to this point had to happen first, and all of it took time.",
  desc:"RNA polymerase arrives at the salicylate promoter and a second transcript grows out along the RNA band."});

beat({ on:[], s:{rib2:1, prot:1},
  cap:"translated into a GFP chain",
  call:"which is not yet green",
  note:"A ribosome translates it, and a GFP polypeptide comes off and folds into the barrel. And at this point you still have nothing to measure, because a folded GFP is colourless.",
  desc:"A ribosome moves along the GFP transcript and a GFP barrel appears above it, drawn as an outline with no colour in it."});

beat({ on:[], s:{mat:1},
  cap:"the chromophore matures — and needs <b>O₂</b>",
  call:"minutes to tens of minutes, after everything else is done",
  note:"The chromophore forms inside the folded barrel, by a reaction the protein runs on itself: a cyclisation, a dehydration, and then an oxidation that consumes molecular oxygen. It takes minutes to tens of minutes, it happens after all the gene expression is over, and in an anaerobic culture it does not happen at all. This is the step everybody forgets, and it is the one that decides when your assay reads.",
  desc:"The GFP barrel fills with colour as the chromophore matures, labelled as requiring oxygen and taking minutes to tens of minutes."});

beat({ on:[], s:{share:1},
  cap:"every arrow here has a rate, and the rates are the cell's",
  call:"overexpress something else and σ70 is scarcer — this whole chain slows",
  note:"Now look at the whole thing. Every arrow on this diagram has a rate, and almost none of those rates are set by your construct. Sigma seventy is the clearest case: there is one pool of it, and every promoter in the cell is competing for that pool. If you are strongly overexpressing something else, there is less of it to go round, transcription here drops, and your part behaves differently. Same DNA, different cell, different answer. Which is why a part described only as the thing that outputs protein cannot tell you what is going to happen.",
  desc:"The finished diagram, with the sigma-70 subunits marked and a line reading: one sigma-70 pool, every promoter in the cell draws on it."});

beat({ on:[], s:{reduce:1},
  cap:"but you do not have to specify any of that",
  call:"name two pieces of DNA, and the rest of the diagram follows from them",
  note:"And here is the move that rescues the whole idea: we do not have to write any of that down. Once we have said that this stretch of DNA makes NahR, and that this other stretch is the DNA NahR binds, the binding is a property of those two molecules. We never specified it, because it is what they are. And in the context of the proteins the cell already has, most of the rest of the diagram follows too — the polymerase, the sigma factor, the ribosomes, the oxygen are none of them ours to declare. So the whole biochemical picture comes back out of a very short list, provided the things on it are chosen properly.",
  desc:"Everything the cell supplied fades back, leaving two stretches of DNA ringed: the nahR coding sequence, labelled as making a protein that binds DNA, and the operator and salicylate promoter, labelled as the DNA it binds."});

beat({ on:[], s:{named:1},
  cap:"the pieces that cannot be reduced further",
  call:"these are <b>features</b>",
  note:"And that is what a feature is. There are three of them on this one part, because nahR's own promoter is every bit as irreducible as the salicylate promoter. A feature is not the part you ordered and it is not the molecule you measured; it is the smallest piece of sequence that still carries a function of its own. Define those, and everything else becomes an attribute of the DNA, the RNA or the protein that the sequence encodes, rather than something you have to state. That is the idea the rest of this lecture is organised around.",
  desc:"The same two ringed stretches, named: these are features — the pieces of sequence that cannot be reduced further."});

window.Deck.sequence("biochem", function(slide){
  const s = G.scene(slide);

  /* the fixed furniture: the cell, the molecule, and what is on it */
  s.add(G.envelope(CELL.x, CELL.y, CELL.w, CELL.h));
  s.add(G.text(CELL.x + 30, CELL.y + 44, "E. coli", 24, C.muted, 400, "start"))
   .setAttribute("font-style", "italic");
  s.finish();

  return G.run(s, FR, paint);
});
})();
