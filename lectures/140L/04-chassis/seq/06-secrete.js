/* ------------------------------------------------------------------ *
 * 06-secrete.js — getting all the way out, and what that costs.
 *
 * Replaces a borrowed figure of the three secretion systems that had
 * been scaled until the labels were illegible and the membranes were
 * pale grey bands, beside four bullets that said the same thing in
 * words.  The figure could not be pointed at, which on a slide whose
 * whole content is "where does the protein end up" is fatal.
 *
 * Redrawn on the SAME cross-section as 06-localize.js -- same band
 * order, same bilayer idiom, same amber membranes -- because it is
 * meant to be the same cell, two slides later, with the question moved
 * one compartment further out.
 *
 * The argument is built rather than listed: one membrane and the
 * signal peptide is the whole story, which is the Gram-positive case;
 * add the second membrane and that same signal now strands the protein
 * in the periplasm; and the three systems are three different answers
 * to the barrier that just appeared.  Read left to right they are
 * one step, two steps, and one step into somebody else.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;
const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);

function grp(o){ return G.el("g", {opacity:n1(cl(o == null ? 1 : o, 0, 1))}); }
function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 3,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return G.el("path", a);
}

/* The membranes stop short of the right edge so the compartment names
   have somewhere to sit.  They were on the left first, anchored end,
   and "outer membrane" ran off the slide. */
const X0 = 150, X1 = 1300, MH = 40;
const HOST = 208, OM = 352, IM = 512;      /* membrane tops               */
const PERI = OM + MH, CYT = IM + MH;
const COL = [370, 720, 1070];              /* one system per column       */

/* x0/x1 default to the cell's own width, but the HOST membrane passes
   them: it belongs to the Type III column only, and drawn full width it
   claims that types I and II inject a host cell too. */
function bilayer(yTop, col, x0, x1){
  const g = G.el("g", {}), r = 7.5, step = 20;
  const a = x0 == null ? X0 : x0, b = x1 == null ? X1 : x1;
  g.appendChild(G.el("rect", {x:n1(a), y:n1(yTop), width:n1(b - a), height:MH,
    fill:col, "fill-opacity":".13", stroke:"none"}));
  for (let x = a + r + 2; x < b - r; x += step){
    [yTop + r + 1, yTop + MH - r - 1].forEach(function(y){
      g.appendChild(G.el("circle", {cx:n1(x), cy:n1(y), r:r, fill:col,
        "fill-opacity":".55", stroke:col, "stroke-width":1.3}));
    });
  }
  return g;
}
function band(label, y, col){
  return G.text(X1 + 20, y, label, 21, col || C.muted, 400, "start");
}
/* a channel: two jaws through a membrane, drawn over paper so the
   bilayer's beads do not show through the lumen */
function pore(cx, yTop, yBot, col, w){
  const g = G.el("g", {}), half = (w || 46)/2;
  g.appendChild(G.el("rect", {x:n1(cx - half), y:n1(yTop), width:n1(half*2),
    height:n1(yBot - yTop), fill:C.paper}));
  [-half, half].forEach(function(dx){
    g.appendChild(G.el("rect", {x:n1(cx + dx - 7), y:n1(yTop), width:14,
      height:n1(yBot - yTop), rx:4, fill:col, "fill-opacity":".2", stroke:col,
      "stroke-width":2.6}));
  });
  return g;
}
/* a protein, as a squiggle, because it is not a sequence any more */
function coil(cx, cy, col){
  const w = 46;
  return path("M"+n1(cx - w)+" "+n1(cy)+
    "q"+n1(w*0.3)+" -17 "+n1(w*0.55)+" 0 q"+n1(w*0.3)+" 17 "+n1(w*0.6)+" 0 " +
    "q"+n1(w*0.3)+" -17 "+n1(w*0.55)+" 0", col, 5);
}
function up(cx, y0, y1, col, dash){
  const g = G.el("g", {});
  g.appendChild(path("M"+n1(cx)+" "+n1(y0)+"V"+n1(y1 + 12), col, 3, dash));
  g.appendChild(path("M"+n1(cx - 9)+" "+n1(y1 + 13)+"L"+n1(cx)+" "+n1(y1)+
    "L"+n1(cx + 9)+" "+n1(y1 + 13), col, 3));
  return g;
}
function tag(cx, y, t, col, size){
  return G.text(cx, y, t, size || 22, col, 700);
}

const FR = [
{ s:{gpos:1},
  cap:"in a <b>Gram positive</b>, the signal peptide is the whole story",
  call:"one membrane to cross &#183; <em>B. subtilis</em> secretes what <em>E. coli</em> would keep",
  note:"Start with the easy case, because it makes the hard one obvious. A Gram positive like Bacillus subtilis has one membrane. There is no periplasm and no outer membrane, so a protein that is pushed through the inner membrane by Sec is already outside the cell. That is the whole mechanism. A gene that encodes a periplasmic protein in E. coli encodes a secreted protein in B. subtilis, with no change to the sequence at all, and that single fact is most of why B. subtilis is the organism industry reaches for when it wants an enzyme in the supernatant.",
  desc:"A Gram positive cell drawn as a single membrane: a protein crosses it on a signal peptide and is immediately outside, with no periplasm and no second barrier." },

{ s:{gpos:1, gneg:1, stuck:1},
  cap:"add the second membrane and the same signal <b>strands it</b>",
  call:"the periplasm is not outside &#183; it is a room you are now locked in",
  note:"Now put the outer membrane back, which is the cell we have been drawing for two slides. The signal peptide has not changed and it still works, but it only ever addressed one membrane. Sec delivers to the periplasm and stops, and the periplasm is not the outside world. So everything that a Gram negative sends beyond that point needs a second mechanism, built out of its own genes, and that is what the rest of this slide is.",
  desc:"The outer membrane is added and the same protein is now trapped in the periplasm, because a Sec signal peptide only addresses the inner membrane." },

{ s:{gneg:1, t1:1},
  cap:"<b>Type I</b> &#183; one step, and it never stops in the periplasm",
  call:"a single channel spanning both membranes &#183; the address is at the <b>C terminus</b>",
  note:"Type I is the simplest answer. One apparatus spans both membranes at once, so the substrate goes from the cytoplasm to the outside in a single move and is never in the periplasm at any point. It does not use a cleaved N-terminal signal peptide either, which is worth flagging because everything up to now has: the targeting information sits at the C terminus instead and it is not removed. The classic substrate is haemolysin. If you are designing with this, the consequence is that a Sec signal peptide does you no good at all here, because this machine is not reading one.",
  desc:"Type I secretion: one channel spanning both membranes, moving the substrate from cytoplasm to outside in a single step, using an uncleaved C-terminal signal." },

{ s:{gneg:1, t1:1, t2:1},
  cap:"<b>Type II</b> &#183; two steps, and the first one you already know",
  call:"Sec to the periplasm, then a second apparatus pushes it the rest of the way",
  note:"Type II is the two-step route and it is the one that matters most for engineering, because the first step is the one you already have. Sec, or sometimes Tat, delivers the protein into the periplasm on an ordinary cleaved signal peptide, exactly as on the last slide. Then a separate apparatus in the outer membrane, built by its own operon, recognises the folded protein and pushes it through. So the protein folds in the periplasm before it leaves, which means this is the route for anything that needs the oxidising compartment and disulfides on its way out. Notice what that costs you: two recognition events, and the second one is looking at a folded shape rather than a sequence, so it is far less portable than a signal peptide.",
  desc:"Type II secretion: Sec delivers the protein to the periplasm on a cleaved signal peptide, where it folds, and a separate outer-membrane apparatus then pushes it out." },

{ s:{gneg:1, t1:1, t2:1, t3:1},
  cap:"<b>Type III</b> &#183; one step, into somebody else",
  call:"a needle through <b>three</b> membranes &#183; the substrate never touches the medium",
  note:"And Type III is the one that is not really secretion at all. It is a needle, assembled from dozens of genes, and it spans both of the bacterium's membranes and then keeps going through the membrane of a host cell. The substrate is delivered straight into the host cytoplasm and is never in the medium at any point. That is why it belongs in the pathogenicity section as much as this one: the machine is not for exporting a product, it is for putting effector proteins inside another organism. Count the membranes on the drawing, because three is the whole point, and the third one is not yours.",
  desc:"Type III secretion: a needle spanning both bacterial membranes and a host cell membrane, delivering the substrate directly into the host cytoplasm without it ever entering the medium." }
];

window.Deck.sequence("secrete", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});
    const gneg = cl(v.gneg || 0, 0, 1);

    /* ---- the cell, gaining a membrane as the argument needs it ---- */
    const m = grp(v.gpos || gneg);
    m.appendChild(bilayer(IM, C.amber));
    m.appendChild(band("inner membrane", IM + 26));
    m.appendChild(band("cytoplasm", CYT + 44));
    g.appendChild(m);

    if (gneg > 0.02){
      const o = grp(gneg);
      o.appendChild(bilayer(OM, C.amber));
      o.appendChild(band("outer membrane", OM + 26));
      o.appendChild(band("periplasm", PERI + 44));
      o.appendChild(band("outside", OM - 34));
      g.appendChild(o);
    } else if (v.gpos > 0.02){
      const o = grp(v.gpos);
      o.appendChild(band("outside", IM - 34));
      g.appendChild(o);
    }

    /* ---- the Gram positive case: straight through, done ----------- */
    if (v.gpos > 0.02 && gneg < 0.5){
      const p = grp(v.gpos);
      p.appendChild(coil(COL[1], CYT + 80, C.blue));
      p.appendChild(pore(COL[1], IM, CYT, C.blue));
      p.appendChild(up(COL[1], CYT + 46, IM - 56, C.blue));
      p.appendChild(coil(COL[1], IM - 96, C.blue));
      p.appendChild(tag(COL[1], IM - 140, "outside, in one move", C.blue));
      g.appendChild(p);
    }

    /* ---- and the same move in a Gram negative, which stops -------- */
    if (v.stuck > 0.02){
      const q = grp(v.stuck);
      q.appendChild(coil(COL[1], CYT + 80, C.muted));
      q.appendChild(pore(COL[1], IM, CYT, C.muted));
      q.appendChild(up(COL[1], CYT + 46, PERI + 36, C.muted));
      q.appendChild(coil(COL[1], PERI + 74, C.verm));
      q.appendChild(path("M"+n1(COL[1] - 26)+" "+n1(PERI + 12)+
        "H"+n1(COL[1] + 26), C.verm, 5));
      q.appendChild(tag(COL[1], PERI - 16, "stops here", C.verm));
      g.appendChild(q);
    }

    /* ---- Type I: through both, in one ---------------------------- */
    if (v.t1 > 0.02){
      const a = grp(v.t1), x = COL[0];
      a.appendChild(coil(x, CYT + 80, C.blue));
      a.appendChild(pore(x, OM, CYT, C.blue, 52));
      a.appendChild(up(x, CYT + 46, OM - 54, C.blue));
      a.appendChild(coil(x, OM - 92, C.blue));
      a.appendChild(tag(x, 706, "Type I", C.ink, 27));
      a.appendChild(G.text(x, 738, "one step · C-terminal signal, uncut",
        20, C.muted, 400));
      g.appendChild(a);
    }

    /* ---- Type II: Sec first, then a second machine ---------------- */
    if (v.t2 > 0.02){
      const b = grp(v.t2), x = COL[1];
      b.appendChild(coil(x, CYT + 80, C.blue));
      b.appendChild(pore(x, IM, CYT, C.blue));
      b.appendChild(pore(x, OM, PERI, C.blue));
      b.appendChild(up(x, CYT + 46, PERI + 30, C.blue));
      b.appendChild(coil(x, PERI + 66, C.blue));
      b.appendChild(up(x, PERI + 88, OM - 54, C.blue));
      b.appendChild(coil(x, OM - 92, C.blue));
      b.appendChild(tag(x, 706, "Type II", C.ink, 27));
      b.appendChild(G.text(x, 738, "two steps · folds in the periplasm",
        20, C.muted, 400));
      g.appendChild(b);
    }

    /* ---- Type III: and through a third membrane that is not yours - */
    if (v.t3 > 0.02){
      const c = grp(v.t3), x = COL[2];
      c.appendChild(bilayer(HOST, C.verm, 890, X1));
      c.appendChild(band("host cell", HOST + 26, C.verm));
      c.appendChild(coil(x, CYT + 80, C.blue));
      c.appendChild(pore(x, HOST, CYT, C.verm, 44));
      c.appendChild(up(x, CYT + 46, HOST - 4, C.verm));
      c.appendChild(coil(x, HOST - 38, C.verm));
      c.appendChild(tag(x, 706, "Type III", C.ink, 27));
      c.appendChild(G.text(x, 738, "one step · straight into a host",
        20, C.verm, 400));
      g.appendChild(c);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
