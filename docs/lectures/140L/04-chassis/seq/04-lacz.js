/* ------------------------------------------------------------------ *
 * 04-lacz.js — why a colony goes blue, and why the useful ones do not.
 *
 * The source has two borrowed figures here, one of them a slideplayer
 * screenshot.  The idea is simple and almost always taught badly: the
 * enzyme is in two pieces on two different molecules, and cloning breaks
 * the small one.  Drawn as two pieces, it explains itself.
 *
 * It also pays off the genotype walk three slides earlier.  The lac
 * operon was deleted from the chromosome by Delta(lac)X74, and then a
 * piece of it was put back on a defective phi80 prophage.  This is what
 * that was for.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;
const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);

function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 3,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return G.el("path", a);
}
function grp(o){ return G.el("g", {opacity:n1(cl(o, 0, 1))}); }

/* The enzyme, in two pieces that tile one rectangle.  A rectangular
   tab and a matching socket, because a curve here is ambiguous at slide
   scale and a blob says nothing at all.  Both are drawn from the
   assembled geometry, so when they meet there is no seam to line up. */
const EH = 150, AW = 100, OW = 224, TAB = 30, TH = 30;
function alphaPiece(x, y, col, o){
  const cy = y + EH/2, mx = x + AW;
  return G.el("path", {d:"M"+n1(x)+" "+n1(y)+"H"+n1(mx)+"V"+n1(cy-TH)+
    "H"+n1(mx+TAB)+"V"+n1(cy+TH)+"H"+n1(mx)+"V"+n1(y+EH)+"H"+n1(x)+"Z",
    fill:col, "fill-opacity":n1(0.26*(o == null ? 1 : o)), stroke:col,
    "stroke-width":3, "stroke-linejoin":"round"});
}
function omegaPiece(x, y, col){
  const cy = y + EH/2;
  return G.el("path", {d:"M"+n1(x)+" "+n1(y)+"H"+n1(x+OW)+"V"+n1(y+EH)+
    "H"+n1(x)+"V"+n1(cy+TH)+"H"+n1(x+TAB)+"V"+n1(cy-TH)+"H"+n1(x)+"Z",
    fill:col, "fill-opacity":".16", stroke:col, "stroke-width":3,
    "stroke-linejoin":"round"});
}
function arrow(x0, x1, y, col){
  const g = G.el("g", {});
  g.appendChild(path("M"+n1(x0)+" "+n1(y)+"H"+n1(x1-10), col, 2.8));
  g.appendChild(path("M"+n1(x1-17)+" "+n1(y-8)+"L"+n1(x1)+" "+n1(y)+
    "L"+n1(x1-17)+" "+n1(y+8), col, 2.8));
  return g;
}
/* a plate, from above */
function plate(cx, cy, r, dots){
  const g = G.el("g", {});
  g.appendChild(G.el("circle", {cx:n1(cx), cy:n1(cy), r:n1(r), fill:C.amber,
    "fill-opacity":".10", stroke:C.ink, "stroke-width":3}));
  (dots || []).forEach(function(d){
    g.appendChild(G.el("circle", {cx:n1(cx + d[0]), cy:n1(cy + d[1]), r:13,
      fill:d[2], "fill-opacity":d[2] === "#ffffff" ? "1" : ".75",
      stroke:d[2] === "#ffffff" ? C.muted : d[2], "stroke-width":2}));
  });
  return g;
}
const COL = [[-52,-30],[18,-48],[54,10],[-30,44],[26,52],[-66,26]];

const FR = [
{ s:{gen:1},
  cap:"the chromosome makes a &beta;-galactosidase with a <b>piece missing</b>",
  call:"&Delta;(lac)X74 took the operon out &#183; &Phi;80 put this much back",
  note:"Go back to the genotype for a moment. Delta lac X74 deleted the entire lac operon from the chromosome, and then a defective phi80 prophage put part of it back, carrying a lacZ gene with the M15 deletion in it. What that gene makes is a beta-galactosidase missing a short stretch near its N-terminus. On its own it does nothing at all. That is not an accident or a broken strain, it is the design.",
  desc:"The chromosome, carrying a phi80 prophage with lacZ delta M15 on it, and the protein it makes: a beta-galactosidase with a rectangular piece missing from one corner, marked inactive." },

{ s:{gen:1, pls:1},
  cap:"and your <b>plasmid</b> carries the piece that is missing",
  call:"lacZ&alpha; &#183; it is on almost every cloning vector you will ever use",
  note:"And the plasmid carries exactly the piece that is missing, called the alpha fragment. This is on almost every cloning vector you have ever handled, which is why almost every cloning vector has a lac promoter on it that you were probably ignoring. Two molecules, two halves of one enzyme.",
  desc:"The plasmid, carrying lacZ alpha, and the small fragment it encodes: a rectangle the exact shape of the missing corner." },

{ s:{gen:1, pls:1, fit:1},
  cap:"together they make <b>one working enzyme</b>",
  call:"&alpha;-complementation &#183; neither piece does anything alone",
  note:"Put both in one cell and the two pieces find each other and associate, and the assembled thing is an active beta-galactosidase. This is alpha complementation. It is worth saying plainly that neither piece does anything on its own; it is not that one is weakly active and the other helps. The enzyme exists only when both are present, which is what makes it a clean readout.",
  desc:"The alpha fragment slotted into the notch in the larger fragment, making one complete and active enzyme." },

{ s:{gen:1, pls:1, fit:1, blue:1},
  cap:"which cuts <b>X-gal</b>, and the colony goes blue",
  call:"blue means the vector closed on <b>nothing</b>",
  note:"Its real job is cutting lactose, but it will also cut X-gal, and one of the products of that reaction is an intense blue that precipitates where it is made. So a colony carrying an intact alpha fragment goes blue. Read what that actually tells you: blue means the alpha fragment is intact, which means nothing was cloned into it, which means the vector closed on itself. Blue is the failure.",
  desc:"The completed enzyme cutting X-gal, and a plate of blue colonies." },

{ s:{gen:1, pls:1, ins:1, white:1},
  cap:"clone into the middle of it, and there is <b>no</b> enzyme",
  call:"white means you got an insert &#183; a screen, not a selection &mdash; still check",
  note:"Now clone something into the polylinker, which sits in the middle of that alpha fragment. The fragment is interrupted, it no longer complements, no enzyme assembles, and the colony stays white. So white means you got an insert. Two things to be careful about. It is a screen and not a selection, so a white colony is a candidate and not an answer, and you still sequence. And an insert small enough to stay in frame can sometimes leave the fragment working, so you get a blue colony that does have your insert in it. Rare, but it happens, and it is the kind of thing that costs a week if you do not know it can.",
  desc:"An insert cloned into the middle of lacZ alpha, breaking the fragment in two, so nothing complements the larger piece and the colony stays white." }
];

window.Deck.sequence("lacz", function(slide){
  const s = G.scene(slide, 792, 838);
  s.finish();

  const GY = 236, PX = 322, PY = 560;      /* chromosome, plasmid centre */
  const EY = 382;                          /* where the enzyme assembles */
  const AX_IN = 744, OX_IN = 844;          /* assembled                  */
  const AX_OUT = 640, OX_OUT = 900;        /* apart                      */

  function paint(v, f){
    const g = G.el("g", {}), st = f.s || {};
    const half = x => cl(x*2 - 1, 0, 1);
    const fit = cl(v.fit || 0, 0, 1);
    const ax = AX_OUT + (AX_IN - AX_OUT)*fit, ay = 508 - (508 - EY)*fit;
    const ox = OX_OUT + (OX_IN - OX_OUT)*fit, oy = 232 + (EY - 232)*fit;

    /* ---- the chromosome, and what it makes ---------------------- */
    const a = grp(half(v.gen));
    a.appendChild(path("M150 "+GY+"H300", C.ink, 3));
    a.appendChild(path("M560 "+GY+"H620", C.ink, 3));
    a.appendChild(G.el("rect", {x:300, y:GY-22, width:260, height:44, rx:6,
      fill:C.muted, "fill-opacity":".07", stroke:C.muted, "stroke-width":2,
      "stroke-dasharray":"7 5"}));
    a.appendChild(G.el("rect", {x:330, y:GY-17, width:200, height:34, rx:5,
      fill:C.blue, "fill-opacity":".16", stroke:C.blue, "stroke-width":2.6}));
    a.appendChild(G.text(430, GY+9, "lacZ\u0394M15", 23, C.blue, 700));
    a.appendChild(G.text(430, GY-38, "\u03a680 prophage", 20, C.muted, 400));
    a.appendChild(G.text(150, GY+46, "chromosome", 20, C.muted, 400, "start"));
    a.appendChild(arrow(646, 720, GY, C.muted));
    g.appendChild(a);

    /* ---- the plasmid, and what it makes ------------------------- */
    if (v.pls > 0.02){
      const b = grp(half(v.pls));
      b.appendChild(G.el("circle", {cx:PX, cy:PY, r:98, fill:"none",
        stroke:C.ink, "stroke-width":3}));
      b.appendChild(G.el("path", {d:"M"+n1(PX-58)+" "+n1(PY-79)+
        "A98 98 0 0 1 "+n1(PX+58)+" "+n1(PY-79),
        fill:"none", stroke:C.verm, "stroke-width":13, "stroke-linecap":"round"}));
      b.appendChild(G.text(PX, PY-116, "lacZ\u03b1", 23, C.verm, 700));
      b.appendChild(G.text(PX, PY+132, "your vector", 20, C.muted, 400));
      b.appendChild(arrow(440, 556, PY, C.muted));
      g.appendChild(b);
    }

    /* ---- the big piece, which the strain supplies --------------- */
    if (v.gen > 0.02){
      const om = grp(half(v.gen));
      om.appendChild(omegaPiece(ox, oy, C.blue));
      if (fit < 0.5) om.appendChild(G.text(ox + OW/2, oy - 20,
        "\u03c9 \u00b7 no activity", 21, C.muted, 400));
      g.appendChild(om);
    }

    /* ---- the small piece, which your plasmid supplies ----------- */
    if (v.pls > 0.02 && !(st.ins > 0.5)){
      const p = grp(half(v.pls));
      p.appendChild(alphaPiece(ax, ay, C.verm));
      if (fit < 0.5) p.appendChild(G.text(ax + AW/2, ay + EH + 30,
        "\u03b1 \u00b7 no activity", 21, C.muted, 400));
      g.appendChild(p);
    }

    /* ---- clone into the middle and the small piece is never made - */
    if (v.ins > 0.02){
      const q = grp(half(v.ins));
      q.appendChild(G.el("rect", {x:n1(PX-30), y:n1(PY-111), width:60,
        height:28, rx:5, fill:C.paper, stroke:C.blue, "stroke-width":3}));
      q.appendChild(G.text(PX, PY-90, "insert", 17, C.blue, 700));
      q.appendChild(G.text(AX_IN + AW/2, EY + EH/2 + 8, "?", 46, C.muted, 700));
      q.appendChild(G.text(AX_IN + AW/2 + 10, EY + EH + 34,
        "no \u03b1 \u00b7 nothing to complement", 21, C.muted, 400));
      g.appendChild(q);
    }

    /* ---- what the two of them add up to ------------------------- */
    if (fit > 0.5 && !(st.ins > 0.5))
      g.appendChild(G.text(AX_IN + (AW + OW)/2, EY - 22,
        "one working \u03b2-galactosidase", 23, C.blue, 700));

    /* ---- and the plate ------------------------------------------ */
    if (v.blue > 0.02 || v.white > 0.02){
      const bl = (st.blue || 0) > 0.5;
      const k = grp(half(Math.max(v.blue, v.white)));
      k.appendChild(arrow(1112, 1176, EY + EH/2, C.muted));
      k.appendChild(G.text(1144, EY + EH/2 - 18, "X-gal", 20, C.muted, 400));
      k.appendChild(plate(1306, EY + EH/2, 124,
        COL.map(d => [d[0], d[1], bl ? C.blue : "#ffffff"])));
      k.appendChild(G.text(1306, EY + EH/2 + 156,
        bl ? "blue \u00b7 no insert" : "white \u00b7 you got one",
        23, bl ? C.blue : C.ink, 700));
      g.appendChild(k);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
