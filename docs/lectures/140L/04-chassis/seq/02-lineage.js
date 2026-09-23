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
/* a note hung off the right of a box */
function ann(ci, y, label, s, col){
  return G.text(COL[ci] + wOf(label)/2 + 18, y + 7, s, 20, col || C.muted,
                col ? 700 : 400, "start");
}

/* ---- who descends from whom -------------------------------------- */
const Y = {mg:218, k12:300, mc:396, dh1:396, dh5:340, dh10:452,
           b:580, w:690};

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
  cap:"and the cloning strains, off the same isolate",
  call:"DH5&#945;, DH10B, TOP10, MC1061 &#183; one family",
  note:"The cloning strains are the same lineage again. MC1061 gives DH1, and DH1 gives DH5 alpha and, through a longer series of steps, DH10B. TOP10 is DH10B with a different label on the tube. So every competent cell you have ever thawed, unless it said BL21 or Mach1 on it, is a great-grandchild of that 1922 sample, with a few dozen mutations deliberately added along the way. That is what the next section is about: the genotype is the list of what was done.",
  desc:"The cloning branch: MC1061 to DH1, and from DH1 both DH5-alpha and DH10B, which is also sold as TOP10." },

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
      c.appendChild(link(1, Y.k12, "W1485", 2, Y.mc,  "MC1061", C.blue));
      c.appendChild(node(2, Y.mc,  "MC1061", C.blue));
      c.appendChild(link(2, Y.mc,  "MC1061", 3, Y.dh1, "DH1", C.blue));
      c.appendChild(node(3, Y.dh1, "DH1", C.blue));
      c.appendChild(link(3, Y.dh1, "DH1", 4, Y.dh5,  "DH5α", C.blue));
      c.appendChild(link(3, Y.dh1, "DH1", 4, Y.dh10, "DH10B / TOP10", C.blue));
      c.appendChild(node(4, Y.dh5,  "DH5α", C.blue));
      c.appendChild(node(4, Y.dh10, "DH10B / TOP10", C.blue,
        "what is in your competent cells"));
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
