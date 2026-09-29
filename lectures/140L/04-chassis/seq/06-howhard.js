/* ------------------------------------------------------------------ *
 * 06-howhard.js — how hard each destination is, on the cell it is
 * about.
 *
 * The source slide is a five-row table of prose: eighty-four words
 * saying "easy", "easy", "difficult but doable", "all of them iffy".
 * That is not prose, it is a scale, and it belongs on the cutaway the
 * section already opened with rather than in a paragraph beside it.
 *
 * Drawn that way it also argues rather than lists, because the
 * difficulty turns out to track one thing: how many membranes the
 * protein has to get through.  The table could not say that.
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

/* Same geometry as 06-localize.js, deliberately: this is the same cell
   seen again, and it should sit exactly where it sat. */
const X0 = 286, X1 = 966;
const OM = 252, IM = 424, MH = 44;
const OUT = 168, PERI = OM + MH, CYT = IM + MH;
const CYTH = 232;

function bilayer(yTop){
  const g = G.el("g", {}), r = 8, step = 21;
  g.appendChild(G.el("rect", {x:X0, y:n1(yTop), width:X1 - X0, height:MH,
    fill:C.amber, "fill-opacity":".13", stroke:"none"}));
  for (let x = X0 + r + 2; x < X1 - r; x += step){
    [yTop + r + 1, yTop + MH - r - 1].forEach(function(y){
      g.appendChild(G.el("circle", {cx:n1(x), cy:n1(y), r:r,
        fill:C.amber, "fill-opacity":".55", stroke:C.amber, "stroke-width":1.4}));
    });
  }
  return g;
}

/* ---- the five destinations, hardest last -------------------------- */
const DEST = [
  {k:"cyt",  lab:"cytoplasm",       y:CYT + 96,  n:0, how:"nothing to do",
   why:"translation is already there"},
  {k:"im",   lab:"inner membrane",  y:IM + 22,   n:1, how:"sec \u00b7 a pre sequence",
   why:"if it belongs there"},
  {k:"peri", lab:"periplasm",       y:PERI + 44, n:1, how:"sec \u00b7 a prepro sequence",
   why:"or tat, if it must fold first"},
  {k:"om",   lab:"outer membrane",  y:OM + 22,   n:2, how:"natural, or difficult",
   why:"free if it belongs there"},
  {k:"out",  lab:"secreted",        y:OUT + 30,  n:3, how:"many methods, all iffy",
   why:"Gram positives find this easy"}
];
const BX = 1026;                            /* where the scale sits     */

function pips(x, y, n){
  const g = G.el("g", {});
  for (let i = 0; i < 3; i++){
    const on = i < n, col = n >= 3 ? C.verm : (n === 2 ? C.verm : C.blue);
    g.appendChild(G.el("circle", {cx:n1(x + i*30), cy:n1(y), r:11,
      fill:on ? col : "none", "fill-opacity":on ? ".85" : "0",
      stroke:on ? col : C.muted, "stroke-width":on ? 2.6 : 2}));
  }
  return g;
}

const FR = [
{ s:{cell:1, marks:1},
  cap:"the same five places, and what each one costs",
  call:"three of them are routine &#183; two of them are a project",
  note:"A summary of the section, and it is worth leaving up. The cytoplasm is free because translation is already there. The inner membrane and the periplasm are routine, both through sec, and the difference is only which signal sequence you put on the front: pre for the membrane, prepro for the periplasm, and tat instead of sec if the protein has to be folded before it crosses. The outer membrane is free for proteins that naturally belong there and genuinely difficult for anything else. And secretion out of the cell has a dozen published methods, none of which reliably works, which is why people who need a secreted protein often reach for a Gram positive instead.",
  desc:"The cell cutaway with all five destinations marked and a three-point difficulty scale beside each: cytoplasm free, inner membrane and periplasm easy, outer membrane difficult, secretion hardest." },

{ s:{cell:1, marks:1, why:1},
  cap:"and it tracks one thing",
  call:"<b>how many membranes it has to get through</b>",
  note:"And here is the pattern, which the list of adjectives could not show you. The difficulty is not about the protein, it is about the number of membranes between the ribosome and where you want the protein to end up. Zero for the cytoplasm. One for the inner membrane and the periplasm. Two for the outer membrane. Two and then some for the outside, because getting through the outer membrane and then letting go of it are separate problems. That is also the whole reason Gram positives are easier to secrete from: they only have one membrane to solve.",
  desc:"The difficulty scale is explained: it tracks the number of membranes the protein has to cross, from none for the cytoplasm to more than two for secretion." }
];

window.Deck.sequence("howhard", function(slide){
  const s = G.scene(slide, 792, 838);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    /* ---- the cell, as the section already drew it ----------------- */
    const c = grp(v.cell);
    c.appendChild(G.el("rect", {x:X0, y:CYT, width:X1 - X0, height:CYTH,
      fill:C.blue, "fill-opacity":".05", stroke:"none"}));
    c.appendChild(G.el("rect", {x:X0, y:PERI, width:X1 - X0, height:IM - PERI,
      fill:C.blue, "fill-opacity":".05", stroke:"none"}));
    c.appendChild(bilayer(OM));
    c.appendChild(bilayer(IM));
    g.appendChild(c);

    /* ---- what each destination costs ------------------------------ */
    if (v.marks > 0.02){
      const m = grp(v.marks);
      DEST.forEach(function(d){
        m.appendChild(G.text(X0 - 26, d.y + 8, d.lab, 24,
          d.n >= 2 ? C.verm : C.blue, 700, "end"));
        m.appendChild(pips(BX, d.y, d.n));
        m.appendChild(G.text(BX + 112, d.y - 2, d.how, 21, C.ink, 700, "start"));
        m.appendChild(G.text(BX + 112, d.y + 26, d.why, 18, C.muted, 400, "start"));
        m.appendChild(path("M"+n1(X0 + 10)+" "+n1(d.y)+"H"+n1(BX - 26),
          C.muted, 1.6, "5 6"));
      });
      g.appendChild(m);
    }

    /* ---- and why it goes in that order ---------------------------- */
    if (v.why > 0.02){
      const w = grp(v.why);
      DEST.forEach(function(d){
        w.appendChild(G.el("rect", {x:n1(BX - 20), y:n1(d.y - 22), width:104,
          height:44, rx:8, fill:C.paper, stroke:"none"}));
        w.appendChild(G.text(BX + 32, d.y + 10, d.n === 3 ? "2+" : String(d.n),
          34, d.n >= 2 ? C.verm : C.blue, 700));
      });
      w.appendChild(G.text(BX + 32, 140, "membranes", 21, C.muted, 700));
      w.appendChild(G.text(BX + 32, 166, "to cross", 21, C.muted, 700));
      g.appendChild(w);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
