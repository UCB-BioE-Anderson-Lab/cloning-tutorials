/* ------------------------------------------------------------------ *
 * 06-tpcon-chart.js — what happened when the cores were moved.
 *
 * Third form for this slide, and the first two were both wrong.
 *
 *   The source had a 3D Excel bar chart: near bars hide far ones and
 *   the perspective distorts the heights.
 *
 *   Replacing it with a strip plot fixed the legibility and threw away
 *   the thing that matters, which is WHICH BIN each point came from.
 *   Without that you can only say the classes overlap, and overlap is
 *   not the finding.  JCA: "as parts, in one bin, there is still
 *   plenty of variance, but there is not maintenance of rank order."
 *
 * So: parallel coordinates.  Six cores across, in the order they held
 * in the Anderson collection; one LINE per bin, joining that bin's
 * measurements.  Now both halves of the finding are visible at once:
 *
 *   each line climbs one to two orders of magnitude  -> a bin still
 *                                                       gives a range
 *   the lines cross                                  -> the ranking
 *                                                       does not hold
 *
 * bin 8 comes out monotonic, in the order the names promise.  bin 3
 * puts UBER at the bottom, below its own OFF.  Same six cores.
 *
 * The matrix is the source deck's own, read out of the embedded chart
 * in ppt/charts/chart1.xml WITH THE POINT INDICES -- those are what say
 * which bin a value belongs to, and reading the values alone (as the
 * strip-plot version did) silently discards it.  A log y axis, because
 * the values run from 30 to 10355.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GP, C = G.C;
const n2 = v => Math.round(v*10)/10;

const CORES = ["OFF", "SLOW", "LOW", "MED", "HIGH", "UBER"];
/* bin -> value per core, null where that bin was not measured */
const BINS = [
  [1, [1703,   63, 7082, 5531, 5197, 4325]],
  [2, [null, null,  554, 2359, 4058,   61]],
  [3, [null,   39,  484, 5543, 3516,   30]],
  [4, [ 531,  239, 3605, 5290, 4268, 3530]],
  [5, [ 181,   84, 4202, null, 5410, 3497]],
  [6, [null, null, 3808, null,10355, 3011]],
  [7, [null, null, 3880, 5378, null, 3553]],
  [8, [ 338,  559,  956, null, 3813, 6699]]
];
const GOOD = 8, BAD = 3;          /* the ordered one, the inverted one */

/* EIGHT CATEGORICAL COLOURS, WHICH IS MORE THAN THE HOUSE PALETTE HAS.
   The palette is four rungs of an attention ladder, and attention is
   the wrong axis here: no bin matters more than another, and the whole
   point of the slide is following one line through the tangle.  Four
   of these are the palette; the other four are picked to sit at
   similar weight and to stay apart on white.  Colour is never the only
   carrier -- every line is also numbered in the legend, and the two
   lines the narration actually names are called out in text. */
const BINCOL = ["#004373", "#ba3a13", "#a99011", "#111111",
                "#0f6e56", "#534ab7", "#993556", "#3b6d11"];
const colOf = b => BINCOL[(b - 1) % BINCOL.length];

const X0 = 352, XG = 206, YB = 700, YT = 262, LO = 20, HI = 14000;
const cx = i => X0 + i*XG;
const ly = v => YB - (Math.log10(v) - Math.log10(LO)) /
                     (Math.log10(HI) - Math.log10(LO)) * (YB - YT);

function frame(){
  const g = G.el("g", {});
  [100, 1000, 10000].forEach(function(t){
    g.appendChild(G.path("M" + (X0 - 44) + " " + n2(ly(t)) + "H" + n2(cx(5) + 44),
      C.rule, 1.6));
    g.appendChild(G.text(X0 - 58, n2(ly(t)) + 8, t.toLocaleString(), 21, C.muted, 400, "end"));
  });
  CORES.forEach(function(c, i){
    g.appendChild(G.text(cx(i), YB + 46, c, 24, C.ink, 700));
  });
  g.appendChild(G.text(cx(2) + XG/2, YB + 82,
    "the six cores, in the order they held in the collection", 21, C.muted, 400));
  g.appendChild(G.text(X0 - 58, YT - 20, "expression", 21, C.muted, 400, "end"));
  return g;
}

/* All eight lines finish at UBER within a few hundred units of each
   other, so a label at the end of each one would pile up.  Legend. */
function legend(dimPick){
  const g = G.el("g", {}), y = 196, x0 = 560;
  g.appendChild(G.text(x0 - 26, y + 7, "bin", 21, C.muted, 400, "end"));
  BINS.forEach(function(b, i){
    const x = x0 + i*96;
    g.appendChild(G.path("M" + x + " " + y + "h30", colOf(b[0]), 4.4));
    g.appendChild(G.text(x + 40, y + 7, String(b[0]), 21, C.ink, 700, "start"));
  });
  return g;
}

/* one bin's trace: a polyline over the cores it was measured in */
function trace(vals, col, w, op, dots){
  const g = G.el("g", {opacity:n2(op)});
  let d = "", pen = false;
  vals.forEach(function(v, i){
    if (v == null){ pen = false; return; }
    d += (pen ? "L" : "M") + n2(cx(i)) + " " + n2(ly(v));
    pen = true;
  });
  if (d) g.appendChild(G.path(d, col, w));
  if (dots) vals.forEach(function(v, i){
    if (v != null) g.appendChild(G.el("circle", {cx:n2(cx(i)), cy:n2(ly(v)),
      r:6.5, fill:col, stroke:"none"}));
  });
  return g;
}

function paint(v, f){
  const g = G.el("g", {});
  g.appendChild(frame());

  /* the context lines drop back as one bin is picked out */
  g.appendChild(legend());
  const pick = Math.max(v.good || 0, v.bad || 0, v.range || 0);
  const dim = 1 - 0.76*pick;
  BINS.forEach(function(b){
    if (b[0] === GOOD && v.good > 0.02) return;
    if (b[0] === BAD  && v.bad  > 0.02) return;
    if (b[0] === 1    && v.range > 0.02) return;
    g.appendChild(trace(b[1], colOf(b[0]), 2.8, dim, true));
  });

  if (v.range > 0.02){
    g.appendChild(trace(BINS[0][1], colOf(1), 5, v.range, true));
    const h = G.grp(v.range), bx = cx(0) - 58;
    h.appendChild(G.path("M" + bx + " " + n2(ly(63)) + "V" + n2(ly(7082)), C.blue, 3.4));
    h.appendChild(G.path("M" + bx + " " + n2(ly(63)) + "l-9 -13m9 13l9 -13" +
      "M" + bx + " " + n2(ly(7082)) + "l-9 13m9 -13l9 13", C.blue, 3.4));
    h.appendChild(G.text(bx - 16, n2((ly(63) + ly(7082))/2) + 8,
      "110×", 23, C.blue, 700, "end"));
    h.appendChild(G.text(cx(3), YT - 20,
      "bin 1: the six cores still span two orders of magnitude", 25, C.blue, 700));
    g.appendChild(h);
  }
  if (v.good > 0.02){
    g.appendChild(trace(BINS.find(x => x[0] === GOOD)[1], colOf(GOOD), 5, v.good, true));
    const h = G.grp(v.good);
    h.appendChild(G.text(cx(5) + 34, n2(ly(6699)) + 8, "bin 8", 22, colOf(GOOD), 700, "start"));
    h.appendChild(G.text(cx(3), YT - 20,
      "bin 8 climbs in the order the names promise", 25, colOf(GOOD), 700));
    g.appendChild(h);
  }
  if (v.bad > 0.02){
    g.appendChild(trace(BINS.find(x => x[0] === BAD)[1], colOf(BAD), 5, v.bad, true));
    const h = G.grp(v.bad);
    h.appendChild(G.text(cx(5) + 34, n2(ly(30)) + 8, "bin 3", 22, colOf(BAD), 700, "start"));
    h.appendChild(G.text(cx(3), YT - 20,
      "bin 3 puts UBER at the bottom — under its own OFF", 25, C.verm, 700));
    g.appendChild(h);
  }
  /* last, so the veil covers the annotations rather than sitting under
     them; and no markup in a G.text, which is not run through rich() */
  if (v.use > 0.02){
    const h = G.grp(v.use);
    h.appendChild(G.el("rect", {x:150, y:YT - 54, width:1310, height:YB - YT + 150,
      rx:16, fill:C.paper, "fill-opacity":n2(0.92*v.use), stroke:"none"}));
    h.appendChild(G.text(800, 432, "within a bin: a usable range", 32, C.ink, 700));
    h.appendChild(G.text(800, 492, "across bins: no rank order", 32, C.verm, 700));
    h.appendChild(G.text(800, 560,
      "enough to perturb a pathway with — not to tune one, or to explain the winner",
      25, C.muted, 400));
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
  note:"Here is the measurement, and it is worth being careful about what is plotted. Across the bottom are the six cores, in the order of strength they held back in the collection they came from. Each line is one bin, which is to say one terminator and one flanking context, joined up across all six cores that went into it. So a line tells you what one context did to the whole set. If the cores had carried their behaviour with them, every line would climb steadily from left to right and they would all be roughly parallel.",
  desc:"A parallel-coordinates plot: the six promoter cores along the bottom in the order of strength they held in the Anderson collection, a logarithmic expression axis up the side, and one line per bin joining that bin's measurements across the cores."});

beat({ on:[], s:{range:1},
  cap:"", call:"",
  note:"First, the half of this that worked. Follow one line, bin one. From the weakest core to the strongest it climbs from about sixty to about seven thousand, which is more than a hundredfold. So inside a single bin the six parts really do give you a spread of expression, and that is not nothing. If what you want is six different settings to throw at a pathway, this delivers them.",
  desc:"The line for bin 1 is picked out, with its span marked: from about 60 at the weakest core to about 7,000 at the strongest, a range of roughly 110-fold within that one bin."});

beat({ on:[], s:{range:0, good:1},
  cap:"", call:"",
  note:"And some bins behave exactly as designed. Bin eight climbs the whole way, in order, each core stronger than the one before it. If every bin looked like this we would have been finished.",
  desc:"The line for bin 8 is picked out: it climbs monotonically across the cores, in the order the names promise."});

beat({ on:[], s:{good:0, bad:1},
  cap:"", call:"",
  note:"But look at bin three. The same six cores, in a different context, and now UBER, the strongest of them, comes out at thirty, which is below the OFF core in that very same bin. The line climbs and then falls off a cliff at the end. And that is the real finding, not that the classes overlap. The ranking does not survive the move. Within a bin you still get variance; between bins you cannot rely on the order, so a core that is near the top in one context can be bottom in another.",
  desc:"The line for bin 3 is picked out in contrast: it rises and then drops sharply, putting the UBER core at about 30, below the OFF core measured in that same bin."});

beat({ on:[], s:{bad:0, use:1},
  cap:"", call:"",
  note:"Which tells you what these parts are for and what they are not for. We ran a few dozen optimisation studies with them, on lycopene and on other pathways, and they worked: they spread expression out, and as a set of perturbations to throw at a system that is exactly what you need. Lycopene yield improved a great deal. What you cannot do is read the result. When one construct wins, you cannot say whether that was the promoter core or the terminator that travelled with it. And you cannot fine tune, because there is no dependable ladder to step up and down. Good enough to perturb a pathway with; not good enough to tune one, or to explain why the winner won. Working out how much of this was the terminators took a TPcon5, and that led to the TPcon6 parts you have been using in the fabrication lecture.",
  desc:"The closing verdict: within a bin, a usable range; across bins, no rank order. Enough to perturb a pathway with, not to tune one or to explain the winner."});

window.Deck.sequence("tpconchart", function(slide){
  const s = G.scene(slide, 900, 900);
  s.finish();
  return G.run(s, FR, paint);
});
})();
