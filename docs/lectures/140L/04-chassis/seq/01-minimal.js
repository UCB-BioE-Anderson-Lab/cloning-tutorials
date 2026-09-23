/* ------------------------------------------------------------------ *
 * 01-minimal.js — how small a genome gets, and why it stops there.
 *
 * The source slide is the published ring map from Posfai 2006 with the
 * deletions marked, and a speaker note that does the actual arguing:
 * Mycoplasma under a megabase, Pelagibacter at 1.3, most bacteria
 * carrying about three megabases of housekeeping whatever else they
 * carry.  Those are four lengths being compared, and the ring map shows
 * exactly one of them.  Drawn as four bars on one scale, the comparison
 * is the figure, and the floor at three megabases is visible rather
 * than asserted.
 *
 * Lengths: MG1655 4,641,652 bp; MDS42 3,976,195 bp (Posfai et al,
 * Science 2006, 14.3 percent removed); Pelagibacter ubique HTCC1062
 * 1,308,759 bp, the smallest free-living bacterium; Mycoplasma
 * genitalium G37 580,076 bp.
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
/* a genome name is half italic and half not, so it is built rather
   than written: the italic part first, the rest measured off it */
function name(x, y, it, rest, col){
  const g = G.el("g", {});
  g.appendChild(G.el("text", {x:n1(x), y:n1(y), "font-size":24, fill:col,
    "font-weight":700, "font-style":"italic"}, it));
  if (rest) g.appendChild(G.el("text", {x:n1(x + it.length*11.5 + 9), y:n1(y),
    "font-size":24, fill:col, "font-weight":700}, rest));
  return g;
}

const X0 = 200, PXMB = 245.7, BH = 44;
const ROW = [268, 392, 516, 640];
const BARS = [
  ["ecoli", 4.64, "E. coli", "MG1655", C.ink,
   "the one you use · nothing removed"],
  ["mds",   3.98, "E. coli", "MDS42",  C.verm,
   "everything Blattner’s group could take out — 14% gone"],
  ["pel",   1.31, "P. ubique", "",     C.blue,
   "the smallest free-living bacterium known"],
  ["myc",   0.58, "M. genitalium", "", C.blue,
   "lives inside you, and has given up most of metabolism"]
];
const FLOOR = X0 + PXMB*3.0;

const FR = [
{ s:{ecoli:1},
  cap:"so how far down can it go?",
  call:"start from the one you use &#183; <b>4.64 Mb</b>",
  note:"People have gone at the minimal chassis directly, from both ends. Start from where we are: MG1655, four point six four megabases, the same bar as the previous slide.",
  desc:"The E. coli MG1655 genome as a bar, 4.64 megabases, as a starting point for comparison." },

{ s:{ecoli:1, mds:1},
  cap:"take out everything you can find",
  call:"MDS42 &#183; <b>3.98 Mb</b> &#183; fourteen per cent gone, and it still grows",
  note:"Blattner's group took the K-12 genome and removed chunk after chunk to see how far down it could be whittled, guided by what is already absent from other enterobacteria. The result is the multiple-deletion series, and MDS42 is the far end of it: about fourteen per cent of the genome gone, insertion sequences and cryptic prophages and a great deal else, and the strain still grows. So a lot of what is in there is genuinely not needed, at least not in a flask.",
  desc:"A second, shorter bar for MDS42 at 3.98 megabases, about fourteen per cent shorter than MG1655." },

{ s:{ecoli:1, mds:1, pel:1},
  cap:"and nature has done better",
  call:"<em>Pelagibacter ubique</em> &#183; <b>1.31 Mb</b> &#183; free-living, in open ocean",
  note:"But nature beat that by a long way. Pelagibacter ubique, which is one of the most abundant organisms on the planet and lives free in open ocean, runs on one point three one megabases. It is the smallest genome of any free-living bacterium known. So the three megabases of housekeeping we just drew is clearly not a hard requirement for being alive on your own.",
  desc:"A much shorter bar for Pelagibacter ubique at 1.31 megabases, the smallest free-living bacterium." },

{ s:{ecoli:1, mds:1, pel:1, myc:1},
  cap:"and the smallest of all is cheating",
  call:"<em>Mycoplasma genitalium</em> &#183; <b>0.58 Mb</b> &#183; it lives inside you",
  note:"And the smallest cellular genomes belong to the Mycoplasma, which are pathogens so dependent on their host cells that much of metabolism is simply missing from their genomes. Mycoplasma genitalium comes in around five hundred and eighty kilobases. But that is not a minimal cell, it is a cell that outsourced. If you had to supply everything it gets from a human, the total would be much larger than the bar drawn here.",
  desc:"The shortest bar, Mycoplasma genitalium at 0.58 megabases, an obligate parasite." },

{ s:{ecoli:1, mds:1, pel:1, myc:1, floor:1},
  cap:"about <b>3 Mb</b> of housekeeping, and then whatever you need to live somewhere",
  call:"everything to the right of it is what makes a strain worth having",
  note:"Put the three megabase line on and the shape of it is clear. Smaller than three megabases is certainly possible. But most free-living bacteria carry about three megabases of housekeeping whatever else they carry, and the additional DNA on top of that is what lets a particular strain survive somewhere particular: in soil, in competition, inside another organism. That extra DNA is where all the diversity lives, and it is where every phenotype from the previous slide is encoded. The minimal genome is an interesting question and a bad chassis. What you want is not the smallest genome, it is the smallest genome that still does the thing you need.",
  desc:"A line marking three megabases across all four bars, separating the housekeeping core from the DNA that adapts a strain to a place." }
];

window.Deck.sequence("minimal", function(slide){
  const s = G.scene(slide, 792, 838);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    BARS.forEach(function(row, i){
      const o = v[row[0]];
      if (!(o > 0.02)) return;
      const b = grp(o), y = ROW[i], w = PXMB*row[1], col = row[4];
      b.appendChild(G.el("rect", {x:X0, y:y, width:n1(w), height:BH, rx:5,
        fill:col, "fill-opacity":".14", stroke:col, "stroke-width":2.8}));
      b.appendChild(name(X0, y - 16, row[2], row[3], col));
      b.appendChild(G.text(X0 + w + 18, y + 30, row[1].toFixed(2) + " Mb", 24,
        col, 700, "start"));
      /* the note goes UNDER the bar: the top bar is 1140px long, so
         anything hung off its right-hand end runs off the slide */
      b.appendChild(G.text(X0 + 4, y + BH + 24, row[5], 19, C.muted, 400, "start"));
      g.appendChild(b);
    });

    /* ---- the floor ----------------------------------------------- */
    if (v.floor > 0.02){
      const f = grp(v.floor);
      f.appendChild(path("M"+n1(FLOOR)+" "+n1(ROW[0] - 44)+
        "V"+n1(ROW[3] + BH + 34), C.blue, 3, "9 7"));
      f.appendChild(G.text(FLOOR, ROW[0] - 56,
        "∼3 Mb of housekeeping", 23, C.blue, 700));
      g.appendChild(f);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
