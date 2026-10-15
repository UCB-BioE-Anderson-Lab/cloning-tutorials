/* ------------------------------------------------------------------ *
 * 06-scan.js — an alanine scan as one slice of a larger space.
 *
 * The slide had the two experiments side by side as two columns of
 * prose, which makes them look like two different things.  They are
 * not: an alanine scan is a deep mutational scan with nineteen of the
 * twenty planes left out.  JCA's framing, and it is the whole slide:
 * draw the familiar alanine matrix as a sheet, then put the other
 * nineteen sheets behind it.  Twenty, not nineteen: one plane per amino
 * acid, and the substituted residue is one of the twenty.
 *
 * So the contrast is carried by the picture, not by a paragraph in
 * each column: one plane against the stack it is the front sheet of.
 * The counts stay in the narration -- "L variants" on the slide meant
 * nothing without a definition of L, so it is spoken, not drawn.
 *
 * A struck line, for the record: this used to end on NNK encoding a
 * whole column in one oligo.  That is one way to build the library
 * among several, and the slide is about what the library IS.
 *
 * Oblique projection, because the stack has to read as depth without
 * any of the heights meaning anything.  A plane is a parallelogram:
 * across is sequence position, back is which variant, and the marked
 * cell on each row is the position that got substituted.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GP, C = G.C;
const n2 = v => Math.round(v*10)/10;

/* The demo peptide, and a tint per residue so the plane reads as the
   familiar figure rather than as a field of dots.  Letters carry the
   identity; the colour is only there to make the row scannable. */
const PEP = ["T", "E", "K", "N", "D", "W"];
const TINT = {T:"#004373", E:"#a99011", K:"#993556",
              N:"#3b6d11", D:"#ba3a13", W:"#534ab7"};
const NV = PEP.length;                 /* one variant per position     */
const ROWS = NV + 1;                   /* plus the native row at the back */

const W = 400, S = 172, D = 268;       /* plane width, skew, rise      */
const OX = -9, OY = 38;                /* offset between stacked planes */
const REST = ["Asp", "Glu", "Phe"];    /* the ones that arrive together */
const FX = 648, FY = 792;
/* where the Cys sheet waits, before it drops onto the stack */
const SX = FX + 186, SY = FY - 352;

const px = (x, y, u, v) => [n2(x + u*W + v*S), n2(y - v*D)];
function plane(x, y, col, w, op){
  return G.el("path", {d:"M" + x + " " + y + "h" + W + "l" + S + " " + (-D) +
    "h" + (-W) + "Z", fill:C.paper, "fill-opacity":0.94,
    stroke:col, "stroke-width":w, "stroke-linejoin":"round", opacity:n2(op)});
}
function bead(cx, cy, letter, sub, subLetter){
  const g = G.el("g", {}), col = sub ? C.ink : TINT[letter];
  g.appendChild(G.el("circle", {cx:cx, cy:cy, r:15,
    fill:sub ? C.paper : col, "fill-opacity":sub ? 1 : 0.2,
    stroke:col, "stroke-width":sub ? 3 : 2.2}));
  g.appendChild(G.text(cx, cy + 7, sub ? subLetter : letter, 18, col, 700));
  return g;
}
/* The matrix: native along the back, then one row per variant coming
   forward, each with a single residue swapped for THIS plane's amino
   acid.  Drawing the Cys plane with a C on its diagonal is the whole
   point of the second beat -- it is the same experiment, one letter on. */
function matrix(x, y, op, letter){
  const g = G.grp(op);
  for (let r = 0; r < ROWS; r++){
    const native = r === ROWS - 1, v = (r + 0.5)/ROWS;
    for (let i = 0; i < NV; i++){
      const p = px(x, y, (i + 0.5)/NV, v);
      g.appendChild(bead(p[0], p[1], PEP[i], !native && i === (ROWS - 2 - r), letter));
    }
    if (native){
      const lab = px(x, y, 0, v);
      g.appendChild(G.text(lab[0] - 24, lab[1] + 7, "native", 19, C.muted, 700, "end"));
    }
  }
  return g;
}

function paint(v, f){
  const g = G.el("g", {});
  const add = n => { g.appendChild(n); return n; };
  const lerp = (a, b, t) => a + (b - a)*t;

  /* the ones that arrive last, furthest back */
  if (v.rest > 0.02){
    for (let k = REST.length; k >= 1; k--){
      const t = k/REST.length, x = FX + (k + 1)*OX, y = FY - (k + 1)*OY;
      const o = v.rest*(0.9 - 0.45*t);
      add(plane(x, y, C.muted, 2.2, o));
      add(G.text(x - 30, y + 8, REST[k - 1], 22, C.muted, 700, "end"))
        .setAttribute("opacity", n2(o));
    }
    const kx = FX + (REST.length + 2)*OX, ky = FY - (REST.length + 2)*OY;
    add(G.text(kx - 30, ky + 10, "\u22ee", 26, C.muted, 700, "end"))
      .setAttribute("opacity", n2(v.rest*0.6));
    /* clear of the stack entirely: the back sheet's top edge reaches
       y ~ 372 and x ~ 1184, so this sits above and right of all of it */
    add(G.text(1310, 326, "20 planes in all", 26, C.blue, 700, "end"))
      .setAttribute("opacity", n2(v.rest));
  }

  /* Cys: waits off the stack, then drops onto it */
  if (v.cys > 0.02){
    const t = v.fly || 0;
    const x = lerp(SX, FX + OX, t), y = lerp(SY, FY - OY, t);
    add(plane(x, y, C.ink, 2.6, v.cys));
    add(matrix(x, y, v.cys*(v.cysmat == null ? 1 : v.cysmat), "C"));
    add(G.text(x - 30, y + 8, "Cys", 23, C.ink, 700, "end"))
      .setAttribute("opacity", n2(v.cys));
  }

  add(plane(FX, FY, C.ink, 3.2, 1));
  add(matrix(FX, FY, 1, "A"));
  add(G.text(FX - 30, FY + 8, "Ala", 24, C.verm, 700, "end"));
  const a = px(FX, FY, 0, 0), b = px(FX, FY, 1, 0);
  add(G.text((a[0] + b[0])/2, a[1] + 46, "sequence position \u2192", 19, C.muted, 400));

  if (v.one > 0.02){
    const h = G.grp(v.one);
    h.appendChild(G.text(130, 302, "Alanine scan", 34, C.ink, 700, "start"));
    h.appendChild(G.text(130, 348, "alanine at every position,", 24, C.muted, 400, "start"));
    h.appendChild(G.text(130, 380, "one variant each", 24, C.muted, 400, "start"));
    g.appendChild(h);
  }
  if (v.dms > 0.02){
    const h = G.grp(v.dms);
    h.appendChild(G.text(130, 596, "Deep mutational scanning", 32, C.ink, 700, "start"));
    h.appendChild(G.text(130, 640, "every alternative,", 24, C.muted, 400, "start"));
    h.appendChild(G.text(130, 672, "at every position", 24, C.muted, 400, "start"));
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

beat({ on:[], s:{one:1, cysmat:1},
  cap:"", call:"",
  note:"The slide before was genuinely about codons: the same protein encoded different ways. This one changes the protein, so it is not a codon scan, it is scanning mutagenesis, and the two experiments people run have proper names. The first is an alanine scan. The native sequence runs along the back there, and then one variant per row coming towards you, each with a single residue swapped for alanine, walking along the chain. Alanine because it takes the side chain away past the beta carbon without putting anything new in its place. One variant per position, so a two hundred residue protein gives you two hundred constructs, and it asks exactly one question: which positions matter.",
  desc:"An alanine scan drawn as one plane in oblique projection. The native peptide runs along the back edge; each row coming forward is one variant with a single residue replaced by alanine, the substitution walking along the sequence."});

beat({ on:[], s:{cys:1}, dur:1500,
  cap:"", call:"",
  note:"But alanine was a choice. Here is the same experiment run with cysteine instead: same peptide along the back, same one-substitution-per-row structure, and a C down the diagonal where the A was. Nothing about the design changed. We just picked a different residue to put in.",
  desc:"A second plane arrives, held clear of the first: the identical experiment run with cysteine, with a C down its diagonal where the alanine plane had an A."});

beat({ on:[], s:{fly:1, cysmat:0.14}, dur:1600,
  cap:"", call:"",
  note:"And it stacks behind the first one, because it is the same shape of thing. Two planes now, two of the twenty residues you could have put there.",
  desc:"The cysteine plane drops into place behind the alanine plane, its matrix fading to a ghost so the stack stays readable."});

beat({ on:[], s:{rest:1, dms:1},
  cap:"", call:"",
  note:"And then the rest. Aspartate, glutamate, phenylalanine, and on through every residue you could have put there: twenty planes, one per amino acid, every position crossed with every one of them, still one substitution at a time. That is deep mutational scanning, and the alanine scan is simply its front sheet. About four thousand variants for that same two hundred residue protein, where the scan gave you two hundred, and the question it answers is correspondingly bigger: not just which positions matter, but what each one will accept. Worth seeing it this way round, because the two are usually taught as alternatives and they are not. One is a slice of the other, and which you run is a question about how much of the space you can afford to build.",
  desc:"The remaining planes stack in behind, labelled aspartate, glutamate and phenylalanine, with an ellipsis and a note that there are twenty planes in all. Deep mutational scanning is the whole stack; the alanine scan is its front slice."});

window.Deck.sequence("scanspace", function(slide){
  const s = G.scene(slide, 870, 870);
  s.finish();
  return G.run(s, FR, paint);
});
})();
