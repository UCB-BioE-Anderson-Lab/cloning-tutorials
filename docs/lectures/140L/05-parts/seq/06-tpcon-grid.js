/* ------------------------------------------------------------------ *
 * 06-tpcon-grid.js — the TPcon4 grid, drawn rather than captured.
 *
 * The source had four rows in the order MED, UBER, LOW, OFF, which is
 * not an order at all, and an ellipsis standing in for the two that
 * were missing.  Six rows now, strongest at the top, so the eye can
 * read down the column as a ladder -- which matters, because the next
 * slide is about that ladder not surviving the move.
 *
 * The two axes are different kinds of thing and the drawing now says
 * so on its own:
 *
 *   a COLUMN is a bin.  Its terminator is drawn at full strength and
 *     is identical all the way down, because the terminator and the
 *     flanking context belong to the bin, not to the core.
 *   a ROW is a core.  Only the promoter shades, from solid at UBER to
 *     nearly empty at OFF, because the -35/-10 is the only thing that
 *     changes between rows.
 *
 * So "same colour, different shade" means the same bin with a
 * different core in it, and that is exactly what the source's legend
 * was trying to say in words.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GP, C = G.C;
const n2 = v => Math.round(v*10)/10;

/* strongest first: the order the next slide tests */
const ROWS = ["UBER", "HIGH", "MED", "LOW", "SLOW", "OFF"];
const FILL = [1, 0.82, 0.64, 0.46, 0.30, 0.18];
const COLS = [
  {x: 392, lab:"bin0",  col:C.amber},
  {x: 700, lab:"bin1",  col:C.ink},
  {x:1008, lab:"bin2",  col:C.blue},
  {x:1340, lab:"bin12", col:C.verm}
];
const RY0 = 262, RGAP = 96, LX = 250;

function octagon(cx, cy, r, col){
  const p = [];
  for (let i = 0; i < 8; i++){
    const a = (i*45 + 22.5)*Math.PI/180;
    p.push(n2(cx + r*Math.cos(a)) + " " + n2(cy + r*Math.sin(a)));
  }
  return G.el("path", {d:"M" + p.join("L") + "Z", fill:col, stroke:col,
    "stroke-width":2.5, "stroke-linejoin":"round"});
}
/* a promoter: the bent arrow, thick, so it reads at the back of a room */
function bent(x, y, col, op){
  const g = G.el("g", {});
  g.appendChild(G.el("path", {d:"M" + x + " " + (y + 20) + "V" + (y - 8) +
    "q0 -12 12 -12H" + (x + 44),
    fill:"none", stroke:col, "stroke-width":15, "stroke-linecap":"butt",
    "stroke-linejoin":"round", opacity:n2(op)}));
  g.appendChild(G.el("path", {d:"M" + (x + 42) + " " + (y - 34) +
    "L" + (x + 74) + " " + (y - 20) + "L" + (x + 42) + " " + (y - 6) + "Z",
    fill:col, stroke:"none", opacity:n2(op)}));
  /* a hairline outline so the palest row is still a shape, not a stain */
  g.appendChild(G.el("path", {d:"M" + x + " " + (y + 20) + "V" + (y - 8) +
    "q0 -12 12 -12H" + (x + 44), fill:"none", stroke:col, "stroke-width":1.5,
    opacity:0.64}));
  return g;
}
/* the white part slot the source draws between the pairs */
function slot(x, y, label){
  const g = G.el("g", {});
  g.appendChild(G.el("path", {d:"M" + x + " " + (y - 19) + "H" + (x + 34) +
    "L" + (x + 54) + " " + y + "L" + (x + 34) + " " + (y + 19) + "H" + x + "Z",
    fill:C.paper, stroke:C.ink, "stroke-width":2.6, "stroke-linejoin":"round"}));
  g.appendChild(G.text(x + 20, y + 8, label, 20, C.ink, 400));
  return g;
}

function paint(v, f){
  const g = G.el("g", {});
  const add = n => { g.appendChild(n); return n; };

  COLS.forEach(function(c, ci){
    const on = v.col > 0.02 ? (ci === 1 ? 1 : 1 - 0.78*v.col) : 1;
    add(G.text(c.x + 30, 206, c.lab, 23, C.muted, 700)).setAttribute("opacity", n2(on));
  });
  add(G.text(1222, 206, "…", 23, C.muted, 700));

  ROWS.forEach(function(r, ri){
    const y = RY0 + ri*RGAP;
    const rowOn = v.row > 0.02 ? (ri === 3 ? 1 : 1 - 0.78*v.row) : 1;
    add(G.text(LX, y + 9, r, 25, C.ink, 700, "end")).setAttribute("opacity", n2(rowOn));
    COLS.forEach(function(c, ci){
      const colOn = v.col > 0.02 ? (ci === 1 ? 1 : 1 - 0.78*v.col) : 1;
      const o = Math.min(rowOn, colOn);
      const cell = G.grp(o);
      /* the top row is also drawn as a construct, which is what these
         parts are actually for */
      if (ri === 0){
        const x1 = ci < COLS.length - 1 ? COLS[ci + 1].x - 26 : c.x + 190;
        cell.appendChild(G.path("M" + (c.x - 26) + " " + y + "H" + x1, C.ink, 3));
        cell.appendChild(slot(c.x + 104, y, String(ci === 3 ? 12 : ci)));
      }
      cell.appendChild(octagon(c.x, y, 24, c.col));
      cell.appendChild(bent(c.x + 34, y, c.col, FILL[ri]));
      g.appendChild(cell);
    });
  });

  if (v.col > 0.02){
    const h = G.grp(v.col);
    h.appendChild(G.el("rect", {x:COLS[1].x - 58, y:218, width:208,
      height:6*RGAP - 8, rx:14, fill:"none", stroke:C.verm, "stroke-width":3.4}));
    h.appendChild(G.text(COLS[1].x + 46, 170,
      "one bin: one terminator, one context, six cores", 24, C.verm, 700));
    g.appendChild(h);
  }
  if (v.row > 0.02){
    const y = RY0 + 3*RGAP;
    const h = G.grp(v.row);
    h.appendChild(G.el("rect", {x:LX + 28, y:y - 48, width:1210, height:96,
      rx:14, fill:"none", stroke:C.blue, "stroke-width":3.4}));
    h.appendChild(G.text(800, y - 66,
      "one core, in thirteen different contexts", 24, C.blue, 700));
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

beat({ on:[], s:{},
  cap:"", call:"",
  note:"So some years ago we set out to widen the choice. We took six members of the Anderson collection that spanned the range, lifted out only the minus thirty-five and the minus ten, and grafted those cores onto completely different flanking sequence, each one paired with its own terminator. That gives you this grid. Strongest at the top, weakest at the bottom, and every cell is a terminator and a promoter as one part.",
  desc:"The TPcon4 grid: six rows, one per promoter core, running from UBER at the top down to OFF at the bottom, and four columns drawn out of thirteen bins. Each cell is a terminator drawn as an octagon and a promoter drawn as a bent arrow. The top row is additionally drawn as a construct, with the numbered part slots between the pairs."});

beat({ on:[], s:{col:1},
  cap:"", call:"",
  note:"The two axes are different kinds of thing, so take them one at a time. A column is a bin, which is a position in a construct. Everything in that column shares a terminator and shares the sequence flanking the promoter, which is why the octagon is identical all the way down. What changes as you go down a column is the core, and the shading tracks it: solid at the top for UBER, almost empty at the bottom for OFF.",
  desc:"One column is picked out: a single bin, with its terminator identical down the whole column and only the promoter shading changing from row to row."});

beat({ on:[], s:{col:0, row:1},
  cap:"", call:"",
  note:"And a row is one core, the same minus thirty-five and minus ten sequence, shown in each of the thirteen bins it was put into. Different terminator each time, different flanking sequence each time, same core. The intent was that you could now take six graded promoters out of six different columns and put them all in one construct with no repeated sequence anywhere in it. Whether a row actually behaves like one promoter is the next slide.",
  desc:"One row is picked out instead: a single promoter core, appearing in each bin, with a different terminator and a different flanking context every time."});

window.Deck.sequence("tpcongrid", function(slide){
  const s = G.scene(slide, 860, 860);
  s.finish();
  return G.run(s, FR, paint);
});
})();
