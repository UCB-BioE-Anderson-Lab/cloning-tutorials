/* ------------------------------------------------------------------ *
 * 02-lineage.js — where the strains in the freezer came from.
 *
 * The source slide is a micrograph beside four bullets, and all four
 * bullets are describing the same thing: a pedigree.  "Most lab strains
 * descend from one isolate", "MG1655 and W3110 are derivatives of it",
 * "BL21 is not K-12 at all", "W is a third lineage" — that is a tree
 * read aloud.  So it is drawn as one, and grown in the order the
 * argument runs: one isolate, then the reference strains, then the
 * cloning strains, and only then the two lineages that are not K-12 —
 * one of which is the strain this class actually uses.
 *
 * The dates and provenances are the well-attested ones: K-12 out of a
 * convalescent diphtheria patient in Palo Alto in 1922, B as the host
 * the phage group standardised on, W as Waksman's soil isolate,
 * ATCC 9637.  TOP10 and DH10B are drawn as one node because that is
 * what they are; the difference is the label on the tube.
 *
 * THE CLONING BRANCH WAS WRONG AND IS NOW SOURCED.  It used to read
 * W1485 -> MC1061 -> DH1 -> {DH5a, DH10B}, which is three false
 * parentages in one line.  Durfee et al. 2008 (J Bacteriol 190:2597,
 * "The complete genome sequence of Escherichia coli DH10B"), Fig. 1 and
 * its legend, give the real chain: wild-type K-12 reaches HfrC+ by a
 * branched pathway of 25 steps, HfrC+ leads to MC1061, and "MC1061
 * served as a starting point for Hanahan and coworkers to replace
 * alleles by using a series of P1 transductions that resulted in
 * DH10B".  So DH10B descends from MC1061, not from DH1.  DH1 is a
 * recA gyrA derivative of Meselson's MM294 and is the parent of DH5a,
 * which is a separate descent that never passes through MC1061 at all.
 * Neither cloning chain runs through W1485.
 *
 * The marker sets say the same thing without reading a paper: DH10B
 * carries MC1061's araD139, D(ara-leu), DlacX74, galU, galK and rpsL,
 * and DH5a carries none of them.
 *
 * Intermediates are drawn as dashed links with the step count on them
 * rather than as boxes, because HfrC+ and MM294 mean nothing to the
 * room and the honest point is only that the chains are long.  One
 * thing worth saying out loud: DH10B is not purely K-12 -- the region
 * around its ara-leu deletion came from E. coli B SB3118 by P1
 * transduction, so the tidy tree has a graft in it.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;
const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);

function grp(o){ return G.el("g", {opacity:n1(cl(o == null ? 1 : o, 0, 1))}); }
function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 2.6,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return G.el("path", a);
}

/* ---- the grid the pedigree hangs on ------------------------------- */
const COL = [250, 520, 790, 1060, 1330];
const H = 52;                              /* every node is one height */
const wOf = s => Math.max(128, s.length*15 + 40);

/* a strain, as a box with its name in it */
function node(ci, y, label, col, sub){
  const g = G.el("g", {}), x = COL[ci], w = wOf(label);
  g.appendChild(G.el("rect", {x:n1(x - w/2), y:n1(y - H/2), width:n1(w),
    height:H, rx:7, fill:col, "fill-opacity":".10", stroke:col,
    "stroke-width":2.6}));
  g.appendChild(G.text(x, y + 9, label, 25, col, 700));
  if (sub) g.appendChild(G.text(x, y + H/2 + 25, sub, 19, C.muted, 400));
  return g;
}
/* descent, as an elbow from one box's right edge to the next box's left */
function link(ci, y0, l0, cj, y1, l1, col){
  const x0 = COL[ci] + wOf(l0)/2, x1 = COL[cj] - wOf(l1)/2;
  const m = x0 + (x1 - x0)*0.42;
  return path("M"+n1(x0)+" "+n1(y0)+"H"+n1(m)+"V"+n1(y1)+"H"+n1(x1), col, 2.6);
}
/* A descent with many steps left out, dashed.  It leaves the parent's
   BOTTOM rather than its right edge and drops clear before turning: an
   elbow out of the right edge lays its vertical straight through the
   reference-strain row, which draws W1485 as the parent of the cloning
   strains -- the exact claim this pedigree was corrected to stop
   making. */
function drop(ci, y0, l0, cj, y1, l1, col){
  const xs = COL[ci] + wOf(l0)/2 + 46, x1 = COL[cj] - wOf(l1)/2;
  return path("M"+n1(COL[ci] + wOf(l0)/2)+" "+n1(y0)+"H"+n1(xs)+
              "V"+n1(y1)+"H"+n1(x1), col, 2.6, "3 8");
}
/* where such a descent's step count goes: just right of its vertical */
const dropX = (ci, l0) => COL[ci] + wOf(l0)/2 + 64;
/* a note hung off the right of a box */
function ann(ci, y, label, s, col){
  return G.text(COL[ci] + wOf(label)/2 + 18, y + 7, s, 20, col || C.muted,
                col ? 700 : 400, "start");
}

/* ---- who descends from whom -------------------------------------- */
const Y = {mg:218, k12:300, mc:382, dh1:472, b:590, w:696};

const FR = [
{ s:{iso:1, em:1},
  cap:"one isolate, and it was not chosen for anything",
  call:"a convalescent diphtheria patient, Palo Alto, <b>1922</b>",
  note:"Start with where the strains came from, because the answer is funnier than people expect. K-12 was isolated in 1922 from the stool of a patient recovering from diphtheria in Palo Alto, and put into the Stanford bacteriology collection. Nobody picked it because it was good at anything. It was simply on the shelf when Lederberg went looking for an organism to do genetics in, and it happened to conjugate, so that is the one the field got. Almost everything you will ever pipette is descended from that one sample.",
  desc:"A single box labelled K-12, dated 1922, Palo Alto, beside a micrograph of E. coli cells." },

{ s:{iso:1, k12:1},
  cap:"the reference strains",
  call:"<b>MG1655</b> is what people mean by <em>the</em> <em>E. coli</em> genome",
  note:"From K-12 comes W1485, and from W1485 the two strains that have been studied more than any other bacteria on earth: MG1655 and W3110. They are nearly identical to each other. MG1655 is the one that was sequenced in 1997, so when a paper says the E. coli genome, or a coordinate, or a gene number, it means MG1655. And watch the name W3110, because it is a trap: that W has nothing to do with E. coli W. W3110 is a K-12 strain.",
  desc:"K-12 gives rise to W1485, which gives rise to MG1655, the sequenced reference genome, and W3110, which despite its name is also a K-12 strain." },

{ s:{iso:1, k12:1, clone:1},
  cap:"the cloning strains &#8212; <b>two</b> descents, not one",
  call:"<b>DH10B</b> comes from <b>MC1061</b> &#183; <b>DH5&#945;</b> does not",
  note:"The cloning strains come off the same isolate, but they are not one family, and neither of them runs through the reference strains. MC1061 is the parent of DH10B, and DH10B is what is in most competent cells you will ever thaw. TOP10 is the same strain with a different label on the tube. DH5 alpha comes down a completely different line, through Meselson's MM294 and then DH1, and it is not an MC1061 derivative at all. You can see that in the genotypes without taking my word for it: DH10B carries MC1061's ara and gal and rpsL markers, and DH5 alpha carries none of them. Notice how long these chains are. Getting from the 1922 isolate to MC1061 took about twenty-five documented steps, and that is before any of the steps that made DH10B. So every competent cell you have used, unless it said BL21 or Mach1, is a great-great-grandchild of that stool sample with a few dozen mutations deliberately stacked on top. That is what the next section is about: a genotype is the list of what was done. And one wrinkle worth knowing, because it undercuts the tidiness of the whole picture: DH10B is not purely K-12. The region around its ara-leu deletion was moved in from E. coli B by P1 transduction, so there is a graft in the tree, from the very lineage we are about to draw as separate.",
  desc:"The cloning branch, as two separate descents from K-12: a dashed twenty-five-step path to MC1061 and then DH10B, also sold as TOP10; and a separate dashed path to DH1 and then DH5-alpha, which is not an MC1061 derivative." },

{ s:{iso:1, k12:1, clone:1, b:1},
  cap:"but not everything in the freezer is K-12",
  call:"BL21 is <em>E. coli</em> <b>B</b> &#8212; a different isolate entirely",
  note:"BL21 is not in that tree at all. It belongs to E. coli B, the strain the phage group standardised on in the nineteen forties, and it differs from K-12 in both genotype and phenotype. B834 is the parent, BL21 the derivative, and BL21(DE3) carries a lambda lysogen supplying T7 RNA polymerase, which is what makes it the protein expression strain. It is a poor cloning strain, being recA and endA positive, so people keep both on the bench and use each for one job.",
  desc:"A second root: E. coli B, giving B834, then BL21, then BL21(DE3), used for protein expression." },

{ s:{iso:1, k12:1, clone:1, b:1, w:1},
  cap:"and yours is a third",
  call:"<b>Mach1</b> descends from <em>E. coli</em> <b>W</b>, ATCC 9637",
  note:"And the strain in this class is from a third isolate again. E. coli W is Waksman's soil isolate, ATCC 9637, and Mach1 is a derivative of it. That is why Mach1 grows on sucrose when K-12 strains will not, and it is why the genotype you will read next week cannot be interpreted against MG1655 coordinates the way a DH10B genotype can. Different parent, different inheritance.",
  desc:"A third root: E. coli W, ATCC 9637, giving Mach1, the strain used in this class." },

{ s:{iso:1, k12:1, clone:1, b:1, w:1, sum:1},
  cap:"three isolates, a hundred years of derivatives",
  call:"whichever one you started from decides what you inherit",
  note:"So the whole working collection comes down to three natural isolates, picked up between 1922 and the 1940s, and a century of deliberate modification on top of them. Nothing here was designed from scratch. When you choose a strain you are choosing a parent, and the parent decides what you get for free, what you have to add, and what is quietly missing. Hold that when you read a genotype, because a genotype only tells you the differences from a parent, and it does not tell you which parent.",
  desc:"The whole pedigree at once: three founding isolates, K-12, B and W, and everything derived from them, with a bracket marking the three roots." }
];

window.Deck.sequence("lineage", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    /* ---- the 1922 isolate, and a look at the organism ------------- */
    if (v.em > 0.02){
      const e = grp(v.em);
      e.appendChild(G.el("image", {href:"img/02-ecoli-cells.jpg", x:900,
        y:250, width:500, height:330, preserveAspectRatio:"xMidYMid slice"}));
      g.appendChild(e);
    }
    const i = grp(v.iso);
    i.appendChild(node(0, Y.k12, "K-12", C.blue, "1922 · Palo Alto"));
    g.appendChild(i);

    /* ---- the reference strains ----------------------------------- */
    if (v.k12 > 0.02){
      const k = grp(v.k12);
      k.appendChild(link(0, Y.k12, "K-12", 1, Y.k12, "W1485", C.blue));
      k.appendChild(node(1, Y.k12, "W1485", C.blue));
      k.appendChild(link(1, Y.k12, "W1485", 2, Y.mg,  "MG1655", C.blue));
      k.appendChild(link(1, Y.k12, "W1485", 2, Y.k12, "W3110",  C.blue));
      k.appendChild(node(2, Y.mg,  "MG1655", C.blue));
      k.appendChild(node(2, Y.k12, "W3110",  C.blue));
      k.appendChild(ann(2, Y.mg,  "MG1655", "the sequenced reference"));
      k.appendChild(ann(2, Y.k12, "W3110",  "also K-12 — the W is a red herring"));
      g.appendChild(k);
    }
    /* ---- the cloning strains ------------------------------------- */
    if (v.clone > 0.02){
      const c = grp(v.clone);
      /* Two descents, not one, and neither goes through W1485.  The long
         way back to the isolate is dashed with its step count on it,
         because the intermediates (HfrC+, MM294) are names the room has
         no use for -- what matters is that the chains are long. */
      c.appendChild(drop(0, Y.k12, "K-12", 2, Y.mc, "MC1061", C.blue));
      c.appendChild(G.text(dropX(0, "K-12"), Y.mc - 14,
        "about 25 steps, via HfrC", 17, C.muted, 400, "start"));
      c.appendChild(node(2, Y.mc, "MC1061", C.blue));
      c.appendChild(link(2, Y.mc, "MC1061", 3, Y.mc, "DH10B / TOP10", C.blue));
      c.appendChild(node(3, Y.mc, "DH10B / TOP10", C.blue,
        "what is in your competent cells"));

      c.appendChild(drop(0, Y.k12, "K-12", 2, Y.dh1, "DH1", C.blue));
      c.appendChild(G.text(dropX(0, "K-12"), Y.dh1 - 14,
        "a separate line, via MM294", 17, C.muted, 400, "start"));
      c.appendChild(node(2, Y.dh1, "DH1", C.blue));
      c.appendChild(link(2, Y.dh1, "DH1", 3, Y.dh1, "DH5α", C.blue));
      c.appendChild(node(3, Y.dh1, "DH5α", C.blue));
      c.appendChild(ann(3, Y.dh1, "DH5α", "not an MC1061 derivative"));
      g.appendChild(c);
    }
    /* ---- E. coli B ----------------------------------------------- */
    if (v.b > 0.02){
      const b = grp(v.b);
      b.appendChild(node(0, Y.b, "B", C.ink, "the phage group’s host"));
      b.appendChild(link(0, Y.b, "B", 1, Y.b, "B834", C.ink));
      b.appendChild(node(1, Y.b, "B834", C.ink));
      b.appendChild(link(1, Y.b, "B834", 2, Y.b, "BL21", C.ink));
      b.appendChild(node(2, Y.b, "BL21", C.ink));
      b.appendChild(link(2, Y.b, "BL21", 3, Y.b, "BL21(DE3)", C.ink));
      b.appendChild(node(3, Y.b, "BL21(DE3)", C.ink));
      b.appendChild(ann(3, Y.b, "BL21(DE3)", "protein expression"));
      g.appendChild(b);
    }
    /* ---- E. coli W, and the strain in this class ------------------ */
    if (v.w > 0.02){
      const w = grp(v.w);
      w.appendChild(node(0, Y.w, "W", C.verm, "ATCC 9637 · a soil isolate"));
      w.appendChild(link(0, Y.w, "W", 1, Y.w, "Mach1", C.verm));
      w.appendChild(node(1, Y.w, "Mach1", C.verm));
      w.appendChild(ann(1, Y.w, "Mach1", "yours", C.verm));
      g.appendChild(w);
    }
    /* ---- and the point: three roots, not one --------------------- */
    if (v.sum > 0.02){
      const t = grp(v.sum), bx = COL[0] - wOf("W (ATCC 9637)")/2 - 34;
      t.appendChild(path("M"+n1(bx + 14)+" "+n1(Y.k12 - 30)+
        "H"+n1(bx)+"V"+n1(Y.w + 30)+"H"+n1(bx + 14), C.muted, 2.4));
      t.appendChild(G.el("text", {x:n1(bx - 14), y:n1((Y.k12 + Y.w)/2),
        "font-size":21, fill:C.muted, "text-anchor":"middle",
        transform:"rotate(-90 "+n1(bx - 14)+" "+n1((Y.k12 + Y.w)/2)+")"},
        "three isolates"));
      g.appendChild(t);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
