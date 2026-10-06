/* ------------------------------------------------------------------ *
 * 01-arac.js — AraC at P(BAD), drawn rather than borrowed.
 *
 * The source slide carried a figure of the two AraC configurations side
 * by side.  Side by side is exactly what this mechanism cannot be shown
 * as: what AraC does is MOVE, from one pair of sites to another, and
 * the DNA loop that the first pair forces is the reason the first state
 * is off.  A loop is a thing that forms and collapses.
 *
 * THE FRAMES ARE BUILT BY ACCUMULATION.  This specific animation is the
 * one written up in AUTHORING.txt as the cautionary case: an earlier
 * AraC sequence narrated "the dimer lets go of araO2" over a frame
 * whose s:{} had dropped the dimer key, so the dimer was not on screen
 * at all.  beat() below merges into a running object so a key cannot be
 * lost by omission; the only way to remove something is to set it to 0
 * on purpose.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GP, C = G.C;
const lerp = (a, b, t) => a + (b - a)*t;
const n2 = v => Math.round(v*10)/10;

/* The three bullets live on the slide above, so the drawing starts low. */
const DY = 690, RY = 566;
const X0 = 180, X1 = 1420;
const O2  = 258;                       /* araO2, far upstream          */
const I1  = 686, I2 = 790;             /* the two half sites at P(BAD) */
const PB  = 918;                       /* the P(BAD) start             */
const BAD = [974, 300];

function site(x, w, y, col, lab, labY){
  const g = G.el("g", {});
  g.appendChild(G.path("M" + x + " " + y + "h" + w, col, 11));
  if (lab) g.appendChild(G.text(x + w/2, y + (labY || 40), lab, 21, col, 700));
  return g;
}

function paint(v, f){
  const g = G.el("g", {});
  const add = n => { g.appendChild(n); return n; };

  /* The molecule: flat everywhere except between araO2 and I1, which
     is the stretch the dimer bridges and bows out. */
  const ox = lerp(O2, I1 - 74, v.loop);
  add(G.dna(X0, ox, DY));
  add(G.loopSeg(ox + 56, I1, DY, v.loop, C.ink, 3.5));
  add(G.dna(I1, X1, DY));

  add(site(ox, 56, DY, C.amber, "araO2"));
  add(site(I1, 56, DY, C.amber, null));
  add(G.text(I1 + 28, DY + 40, "I1", 21, C.amber, 700));
  add(site(I2, 56, DY, C.amber, null));
  add(G.text(I2 + 28, DY + 40, "I2", 21, C.amber, 700));
  add(G.promoter(PB, DY, "PBAD", C.ink, 1));
  add(G.gene(BAD[0], DY, BAD[1], "araBAD", C.blue)).setAttribute("font-style", "italic");

  /* ---- the AraC dimer ------------------------------------------- *
   * One subunit stays on I1 throughout.  The other is the one that
   * moves, from araO2 to I2, and the move is the mechanism.          */
  if (v.arac > 0.02){
    const h = G.grp(Math.min(1, v.arac*2));
    const fixed = I1 + 28, fy = DY - 46;
    const movx = lerp(lerp(500, ox + 28, v.loop), I2 + 28, v.swap);
    const movy = lerp(lerp(PY0, DY - 46, v.loop), DY - 46, v.swap);
    h.appendChild(G.regulator(fixed, fy, v.ind, C.blue));
    h.appendChild(G.regulator(movx, movy, v.ind, C.blue));
    /* the two subunits are one dimer: draw the contact between them */
    h.appendChild(G.path("M" + n2(fixed) + " " + n2(fy - 6) +
      "L" + n2(movx) + " " + n2(movy - 6), C.blue, 3, "1 9"));
    h.appendChild(G.text(Math.min(fixed, movx) - 74, fy + 6, "AraC", 22, C.blue, 700, "end"));
    g.appendChild(h);
  }

  /* ---- arabinose -------------------------------------------------- */
  if (v.ara > 0.02){
    const h = G.grp(Math.min(1, v.ara*2));
    const bx = lerp(X0 - 70, 352, Math.min(1, v.ara));
    h.appendChild(G.mol("arabinose", lerp(bx, I1 + 30, v.ind),
                        lerp(432, DY - 186, v.ind), 196, "arabinose"));
    g.appendChild(h);
  }

  /* ---- polymerase ------------------------------------------------- */
  if (v.pol > 0.02){
    const h = G.grp(Math.min(1, v.pol*2));
    const o1 = G.early(v.on);
    const cx = lerp(PB - 230, PB + 8, o1), cy = lerp(388, DY, o1);
    h.appendChild(G.rnap(cx, cy, C.ink));
    h.appendChild(G.sigma(cx + 70, cy - 76, C.blue, "σ70"));
    g.appendChild(h);
  }
  if (G.late(v.tx) > 0.01) add(G.rna(BAD[0], BAD[0] + BAD[1] + 40, RY, G.late(v.tx)));
  return g;
}
const PY0 = 404;

const FR = [];
let acc = {};
function beat(o){
  acc = Object.assign({}, acc, o.s || {});
  FR.push(Object.assign({}, o, {s:Object.assign({}, acc)}));
}

beat({ on:[], s:{},
  cap:"the arabinose operon, and <b>three</b> AraC sites",
  call:"araO2 a long way upstream, then I1 and I2 at the promoter",
  note:"The arabinose system. Three places AraC can sit: araO2, well upstream, and then I1 and I2 next to each other right at the P BAD promoter. Hold on to the fact that there are three, because which two are occupied is the entire switch.",
  desc:"The araBAD region drawn on one DNA molecule: the site araO2 far upstream, then I1 and I2 adjacent to each other, the PBAD promoter, and the araBAD genes."});

beat({ on:[], s:{arac:1},
  cap:"AraC binds as a dimer",
  call:"",
  note:"AraC works as a dimer, two subunits held together, and each subunit has a DNA-binding end. So it can hold two sites at once, and that is what makes the next frame possible.",
  desc:"An AraC dimer appears, drawn as two two-domain subunits joined to one another."});

beat({ on:[], s:{loop:1},
  cap:"with no arabinose it holds araO2 <b>and</b> I1",
  call:"so the DNA between them loops out",
  note:"With no arabinose present, one subunit takes araO2 and the other takes I1. Those two sites are hundreds of bases apart, so for one dimer to hold both, the DNA between them has to come round into a loop. And that loop is the off state.",
  desc:"One subunit of the dimer binds araO2 and the other binds I1, pulling the two sites together so the DNA between them bows out into a loop."});

beat({ on:[], s:{pol:1},
  cap:"polymerase cannot work on looped DNA",
  call:"<b>off</b> — and nothing is sitting on the promoter to make it so",
  note:"Polymerase cannot do anything useful with the promoter while it is held inside that loop. Worth being precise about why this is off: nothing is blocking P BAD the way LacI blocks the lac promoter. The promoter is free. It is the shape of the molecule around it that is wrong.",
  desc:"RNA polymerase is present but no transcript is made; the promoter is held inside the DNA loop."});

beat({ on:[], s:{ara:1},
  cap:"arabinose arrives",
  call:"",
  note:"Then arabinose gets into the cell.",
  desc:"An arabinose molecule, drawn as a single sugar ring in Haworth projection, enters the cell."});

beat({ on:[], s:{ind:1},
  cap:"it binds AraC, and AraC changes shape",
  call:"",
  note:"Arabinose binds the dimer and changes its shape. And unlike LacI, what that shape change does is not to make AraC let go of DNA altogether.",
  desc:"Arabinose docks into AraC and the protein's conformation shifts."});

beat({ on:[], s:{swap:1, loop:0},
  cap:"it lets go of araO2 and takes <b>I2</b> instead",
  call:"I1 and I2 are adjacent — so the loop collapses",
  note:"In the new shape the dimer releases araO2 and binds I2 instead. I1 and I2 are side by side, so a dimer holding both does not have to bend anything, and the loop falls open. The protein did not leave the DNA. It moved along it.",
  desc:"The free subunit releases araO2 and binds I2, which sits immediately beside I1, so the DNA loop relaxes back to a straight molecule."});

beat({ on:[], s:{on:1, tx:1},
  cap:"and now AraC <b>recruits</b> polymerase",
  call:"the same protein, repressor then activator — the difference is where it is sitting",
  note:"And now, sitting at I1 and I2 right next to the promoter, AraC does the opposite job: it recruits polymerase and activates transcription of araBAD. Same protein, same cell, same DNA. The only thing that changed was which pair of sites it was holding. That is why AraC is the example of a transcription factor that is neither an activator nor a repressor but both, depending on what it is bound to.",
  desc:"With the loop gone and AraC on I1 and I2 beside the promoter, RNA polymerase is recruited to PBAD and the araBAD transcript is made."});

window.Deck.sequence("arac", function(slide){
  const s = G.scene(slide);
  s.finish();
  return G.run(s, FR, paint);
});
})();
