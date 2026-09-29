/* ------------------------------------------------------------------ *
 * 06-tat.js — the second way across the inner membrane.
 *
 * Two things, and it stops there: there is a second system, and it
 * folds the protein before it exports it.
 *
 * It had a third and fourth beat on the recognition motif -- five
 * substrates aligned on the twin arginine, then HyaA's own signal
 * peptide showing that its OTHER arginine pair is ignored, so the
 * pattern is RR and RR alone is not the pattern.  Both were accurate
 * and both are cut: two beats carry the idea and the sequence work
 * turned the slide into a reading exercise.  The material is in the
 * history if it is ever wanted back.
 *
 * Note for anyone restoring it: align on [ST]RR, not RR.  HyaA has an
 * MRR at 11 before the real TRRSFLK at 17, and a bare match puts it on
 * the wrong pair.
 */
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

const X0 = 250, X1 = 1310, MH = 40;
const IM = 470, CYT = IM + MH;
const SEC = 540, TAT = 1040;

function bilayer(yTop){
  const g = G.el("g", {}), r = 7.5, step = 20;
  g.appendChild(G.el("rect", {x:X0, y:n1(yTop), width:X1 - X0, height:MH,
    fill:C.amber, "fill-opacity":".13", stroke:"none"}));
  for (let x = X0 + r + 2; x < X1 - r; x += step){
    [yTop + r + 1, yTop + MH - r - 1].forEach(function(y){
      g.appendChild(G.el("circle", {cx:n1(x), cy:n1(y), r:r, fill:C.amber,
        "fill-opacity":".55", stroke:C.amber, "stroke-width":1.3}));
    });
  }
  return g;
}
function pore(cx, col, w){
  const g = G.el("g", {}), half = (w || 46)/2;
  g.appendChild(G.el("rect", {x:n1(cx - half), y:IM, width:n1(half*2),
    height:MH, fill:C.paper}));
  [-half, half].forEach(function(dx){
    g.appendChild(G.el("rect", {x:n1(cx + dx - 7), y:IM, width:14, height:MH,
      rx:4, fill:col, "fill-opacity":".2", stroke:col, "stroke-width":2.6}));
  });
  return g;
}
function chain(cx, cy, col){
  const w = 52;
  return path("M"+n1(cx - w)+" "+n1(cy)+
    "q"+n1(w*0.3)+" -18 "+n1(w*0.55)+" 0 q"+n1(w*0.3)+" 18 "+n1(w*0.6)+" 0 " +
    "q"+n1(w*0.3)+" -18 "+n1(w*0.55)+" 0", col, 5);
}
function folded(cx, cy, col){
  return G.el("path", {d:"M"+n1(cx-40)+" "+n1(cy)+
    "c0 -26 18 -40 40 -40 c24 0 40 16 40 40 c0 24 -18 40 -40 40 "+
    "c-23 0 -40 -15 -40 -40 Z", fill:col, "fill-opacity":".16", stroke:col,
    "stroke-width":3.4, "stroke-linejoin":"round"});
}
function up(cx, y0, y1, col){
  const g = G.el("g", {});
  g.appendChild(path("M"+n1(cx)+" "+n1(y0)+"V"+n1(y1 + 12), col, 3));
  g.appendChild(path("M"+n1(cx - 9)+" "+n1(y1 + 13)+"L"+n1(cx)+" "+n1(y1)+
    "L"+n1(cx + 9)+" "+n1(y1 + 13), col, 3));
  return g;
}

const FR = [
{ s:{memb:1},
  cap:"there is a <b>second</b> way across the inner membrane",
  call:"same membrane, same destination &#183; a different machine",
  note:"Everything so far on this section has quietly meant Sec. There is a second translocon sitting in the same membrane, it delivers to the same compartment, and it is called Tat, for twin-arginine translocase. A protein carrying an N-terminal signal peptide might be going through either one, and until you look at the signal you do not know which.",
  desc:"The inner membrane with two translocons in it side by side, labelled Sec and Tat." },

{ s:{memb:1, cargo:1},
  cap:"Tat moves the protein <b>already folded</b>",
  call:"Sec threads a bare chain &#183; Tat pushes a finished one through",
  note:"And here is the difference that matters. Sec takes the chain unfolded, threads it through, and the protein folds once it is on the other side, which is why the periplasm being an oxidising compartment mattered two slides ago. Tat does the opposite: the protein folds in the cytoplasm first and then goes through in one piece. The reason anything would need that is cofactors. An iron-sulfur cluster, a molybdopterin, a nickel centre, all of those are assembled in the cytoplasm, and a protein that has to close around one cannot be sent through as a bare chain and expected to find it again on the far side. So it folds, it loads, and it leaves whole. Tat also refuses substrates that have not folded properly, which makes it a quality-control step as well as a route.",
  desc:"The two routes compared across the same membrane: Sec threading an unfolded chain which folds in the periplasm, and Tat moving an already folded protein through in one piece." }
];

window.Deck.sequence("tat", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    if (v.memb > 0.02){
      const m = grp(v.memb);
      m.appendChild(bilayer(IM));
      m.appendChild(G.text(X1 + 20, IM + 26, "inner membrane", 21, C.muted, 400, "start"));
      m.appendChild(G.text(X1 + 20, CYT + 44, "cytoplasm", 21, C.muted, 400, "start"));
      m.appendChild(G.text(X1 + 20, IM - 34, "periplasm", 21, C.muted, 400, "start"));
      m.appendChild(pore(SEC, C.blue, 44));
      m.appendChild(pore(TAT, C.verm, 104));
      m.appendChild(G.text(SEC, CYT + 190, "Sec", 28, C.ink, 700));
      m.appendChild(G.text(TAT, CYT + 190, "Tat", 28, C.ink, 700));
      g.appendChild(m);
    }
    if (v.cargo > 0.02){
      const c = grp(v.cargo);
      c.appendChild(chain(SEC, CYT + 96, C.blue));
      c.appendChild(up(SEC, CYT + 68, IM - 58, C.blue));
      c.appendChild(folded(SEC, IM - 102, C.blue));
      c.appendChild(G.text(SEC, CYT + 224, "unfolded going in", 21, C.muted, 400));

      c.appendChild(folded(TAT, CYT + 96, C.verm));
      c.appendChild(up(TAT, CYT + 50, IM - 58, C.verm));
      c.appendChild(folded(TAT, IM - 102, C.verm));
      c.appendChild(G.text(TAT, CYT + 224, "folded before it leaves", 21, C.verm, 400));
      g.appendChild(c);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
