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

/* The big piece, with a rectangular bite out of its corner.  A notch
   reads as "a missing piece" in a way that a blob does not. */
const NW = 64, NH = 58;
function omega(cx, cy, col){
  const g = G.el("g", {});
  g.appendChild(G.el("path", {d:
    "M"+n1(cx-104)+" "+n1(cy-76+NH)+"V"+n1(cy+76)+"H"+n1(cx+104)+
    "V"+n1(cy-76)+"H"+n1(cx-104+NW)+"V"+n1(cy-76+NH)+"Z",
    fill:col || C.blue, "fill-opacity":".16", stroke:col || C.blue,
    "stroke-width":3, "stroke-linejoin":"round"}));
  return g;
}
function alpha(x, y, col){
  return G.el("rect", {x:n1(x), y:n1(y), width:NW, height:NH, rx:4,
    fill:col || C.verm, "fill-opacity":".28", stroke:col || C.verm,
    "stroke-width":3});
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
  const s = G.scene(slide, 800, 846);
  s.finish();

  const GY = 250, PX = 360, PY = 606;     /* genome line, plasmid centre */
  const OX = 1010, OY = 430;              /* the big fragment            */

  function paint(v){
    const g = G.el("g", {});
    const half = x => cl(x*2 - 1, 0, 1);

    /* ---- the chromosome, and what it makes ---------------------- */
    const a = grp(half(v.gen));
    a.appendChild(path("M180 "+GY+"H700", C.ink, 3));
    a.appendChild(G.el("rect", {x:330, y:GY-20, width:190, height:40, rx:5,
      fill:C.blue, "fill-opacity":".16", stroke:C.blue, "stroke-width":2.6}));
    a.appendChild(G.text(425, GY+8, "lacZΔM15", 23, C.blue, 700));
    a.appendChild(G.text(425, GY-38, "Φ80 prophage", 21, C.muted, 400));
    a.appendChild(G.text(180, GY+44, "chromosome", 21, C.muted, 400, "start"));
    g.appendChild(a);

    /* ---- the plasmid, and what it makes ------------------------- */
    if (v.pls > 0.02){
      const b = grp(half(v.pls));
      b.appendChild(G.el("circle", {cx:PX, cy:PY, r:104, fill:"none",
        stroke:C.ink, "stroke-width":3}));
      b.appendChild(G.el("path", {d:"M"+n1(PX-62)+" "+n1(PY-84)+
        "A104 104 0 0 1 "+n1(PX+62)+" "+n1(PY-84),
        fill:"none", stroke:C.verm, "stroke-width":13, "stroke-linecap":"round"}));
      b.appendChild(G.text(PX, PY-118, "lacZα", 23, C.verm, 700));
      b.appendChild(G.text(PX, PY+140, "your vector", 21, C.muted, 400));
      if (v.ins > 0.02){
        const q = grp(half(v.ins));
        q.appendChild(G.el("rect", {x:n1(PX-26), y:n1(PY-112), width:52,
          height:26, rx:5, fill:"#ffffff", stroke:C.blue, "stroke-width":3}));
        q.appendChild(G.text(PX, PY-92, "ins", 18, C.blue, 700));
        b.appendChild(q);
      }
      g.appendChild(b);
    }

    /* ---- the two pieces of the enzyme --------------------------- */
    const om = grp(half(v.gen));
    om.appendChild(omega(OX, OY));
    g.appendChild(om);

    if (v.pls > 0.02 && v.ins < 0.5){
      const p = grp(half(v.pls));
      /* apart until they are put together */
      const ax = v.fit > 0.5 ? OX - 104 : OX - 320;
      const ay = v.fit > 0.5 ? OY - 76 : OY - 34;
      p.appendChild(alpha(ax, ay));
      if (v.fit < 0.5)
        p.appendChild(G.text(ax + NW/2, ay - 18, "α fragment", 21, C.verm, 700));
      g.appendChild(p);
    }
    /* broken, once something has been cloned into the middle of it */
    if (v.ins > 0.02){
      const p = grp(half(v.ins));
      p.appendChild(alpha(OX - 340, OY - 34));
      p.appendChild(alpha(OX - 250, OY - 34));
      p.appendChild(path("M"+n1(OX-268)+" "+n1(OY-56)+"V"+n1(OY+50), C.blue, 3.4));
      p.appendChild(G.text(OX - 250, OY - 54, "broken in two", 21, C.verm, 700));
      g.appendChild(p);
    }

    /* ---- what it says about the enzyme -------------------------- */
    const verdict = v.fit > 0.5 ? ["active", C.blue]
                  : (v.ins > 0.5 ? ["still nothing", C.muted] : ["inactive", C.muted]);
    g.appendChild(G.text(OX, OY + 128, verdict[0], 26, verdict[1], 700));

    /* ---- and the plate ------------------------------------------ */
    if (v.blue > 0.02 || v.white > 0.02){
      const bl = v.blue > 0.5;
      const k = grp(half(Math.max(v.blue, v.white)));
      k.appendChild(plate(1300, 648, 128,
        COL.map(d => [d[0], d[1], bl ? C.blue : "#ffffff"])));
      k.appendChild(G.text(1300, 802, bl ? "blue · no insert" : "white · you got one",
        23, bl ? C.blue : C.ink, 700));
      if (bl) k.appendChild(G.text(1300, 500, "X-gal", 23, C.muted, 400));
      g.appendChild(k);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
