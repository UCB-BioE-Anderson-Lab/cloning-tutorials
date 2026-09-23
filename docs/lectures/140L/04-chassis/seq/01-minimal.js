/* ------------------------------------------------------------------ *
 * 01-minimal.js — genome size as a measure of what has been outsourced.
 *
 * NOT "how small can it get", which was the old framing and which
 * invites a single number as the answer.  Genome size falls when the
 * environment supplies more, so the four landmarks are chosen to make
 * that trade visible and each one carries the caveat that complicates
 * it.
 *
 * Deliberately no vertical line labelled "minimum".  The 1.5-2 Mb band
 * is shaded and labelled as an empirical neighbourhood, because there
 * is no cleanly established smallest natural glucose-and-salts
 * prototroph and pretending otherwise would be inventing a record.
 *
 * Lengths: JCVI-syn3.0 531 kb / 473 genes (Hutchison, Science 2016);
 * Pelagibacter ubique HTCC1062 ~1.31 Mb / ~1,354 ORFs; Prochlorococcus
 * MED4 1,657,990 bp / ~1,716 genes (Rocap, Nature 2003); E. coli K-12
 * MG1655 ~4.64 Mb.
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
  if (rest) g.appendChild(G.el("text", {x:n1(x + it.length*13 + 10), y:n1(y),
    "font-size":24, fill:col, "font-weight":700}, rest));
  return g;
}

const X0 = 250, PXMB = 232, BH = 46;
const ROW = [258, 388, 518, 648];
const BARS = [
  ["syn",  0.53, "JCVI-syn3.0", "", C.muted,
   "dependent minimal cell", "minimised in a rich medium \u2014 so it imports most of its chemistry"],
  ["pel",  1.31, "P. ubique", "", C.blue,
   "streamlined free-living heterotroph", "needs reduced sulfur, and glycine or serine, and pyruvate"],
  ["pro",  1.66, "Prochlorococcus", " MED4", C.blue,
   "biosynthetically autonomous \u2014 on light and CO\u2082",
   "a phototroph, so not the glucose heterotroph in our definition"],
  ["ecoli", 4.64, "E. coli", " K-12", C.ink,
   "versatile prototrophic heterotroph", "and far more capability than turning glucose into a cell"]
];
const BAND = [1.5, 2.0];

const FR = [
{ s:{ecoli:1},
  cap:"genome size is partly a measure of <b>what has been outsourced</b>",
  call:"start from the one you use &#183; <em>E. coli</em> K-12, <b>4.64 Mb</b>",
  note:"Four landmarks, and the point of putting them on one axis is not to find the smallest. It is that genome size falls when the environment takes over more of the work, so a small genome is as much a statement about a niche as about an organism. Start from the one you use: four point six four megabases, a prototroph, grows on glucose and salts.",
  desc:"The E. coli K-12 genome as a bar to scale, 4.64 megabases, as the starting point for comparison." },

{ s:{ecoli:1, syn:1},
  cap:"<b>JCVI-syn3.0</b> &#183; 0.53 Mb &#183; 473 genes",
  call:"a cell that reproduces &#8212; and was minimised <b>in a rich medium</b>",
  note:"The smallest self-reproducing cell anybody has built. Five hundred and thirty-one kilobases, four hundred and seventy-three genes, and it divides. But it was minimised by deleting genes in a rich medium, so every gene whose product the medium supplied is gone. Read it as an answer to what a cell must encode when almost everything is handed to it, not as an answer to what it takes to build a cell from chemicals. Breuer and colleagues did the metabolic reconstruction on syn3A, five hundred and forty-three kilobases, and the story there is import, import, import.",
  desc:"A much shorter bar for JCVI-syn3.0 at 0.53 megabases, marked as minimised in a rich medium." },

{ s:{ecoli:1, syn:1, pel:1},
  cap:"<b><em>Pelagibacter ubique</em></b> &#183; 1.31 Mb",
  call:"free-living, and it made a very specific bargain with the ocean",
  note:"The natural version of the same lesson, and one of the most abundant organisms on the planet. One point three one megabases, free-living in open ocean, and streamlined rather than parasitic. But defined-medium work shows what streamlining cost: it cannot do assimilatory sulfate reduction, so it needs reduced sulfur handed to it, and it has requirements involving glycine or serine and pyruvate. Free-living, and still not autonomous in the sense we care about.",
  desc:"A bar for Pelagibacter ubique at 1.31 megabases, free-living but with specific metabolite dependencies." },

{ s:{ecoli:1, syn:1, pel:1, pro:1},
  cap:"<b><em>Prochlorococcus</em></b> MED4 &#183; 1.66 Mb",
  call:"a complete biosynthetic network &#183; on <b>light and CO&#8322;</b>",
  note:"And this one is the proof of principle. One point six six megabases, about seventeen hundred genes, and it encodes a complete metabolic network: it makes everything it is out of carbon dioxide, mineral nutrients and light. Say the caveat plainly, because it matters: it is a phototroph, not the glucose heterotroph our operational definition describes. What it demonstrates is that near-complete biosynthetic autonomy can fit in a genome of this order, which is the useful claim.",
  desc:"A bar for Prochlorococcus MED4 at 1.66 megabases, a phototroph with a complete biosynthetic network." },

{ s:{ecoli:1, syn:1, pel:1, pro:1, band:1},
  cap:"so autonomy is an <b>order-of-magnitude</b> answer, not a number",
  call:"and the difference between 2 Mb and 4.6 Mb is not <em>life</em>",
  note:"Shade the neighbourhood rather than drawing a line, because there is no cleanly established smallest natural glucose-and-salts prototroph and it would be inventing a record to claim one. What the landmarks support is an order-of-magnitude statement: a metabolically dependent cell can be half a megabase, a fully biosynthetic bacterial system is plausibly a one and a half to two megabase problem, and E. coli is four point six. Which means the gap between those two is not life. It is flexibility, sensing, regulation, repair, defence, alternative nutrients, stress response, and everything that lets an organism live somewhere real. That gap is the next slide.",
  desc:"A shaded band from 1.5 to 2 megabases, labelled as the empirical neighbourhood in which near-complete biosynthetic autonomy is demonstrably possible, with the gap up to E. coli marked as capability rather than life." }
];

window.Deck.sequence("minimal", function(slide){
  const s = G.scene(slide, 792, 838);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    /* ---- the neighbourhood, shaded and never a line -------------- */
    if (v.band > 0.02){
      const f = grp(v.band);
      const x0 = X0 + PXMB*BAND[0], x1 = X0 + PXMB*BAND[1];
      f.appendChild(G.el("rect", {x:n1(x0), y:262, width:n1(x1 - x0),
        height:n1(ROW[3] + BH + 6 - 262), fill:C.verm, "fill-opacity":".09",
        stroke:"none"}));
      f.appendChild(G.text((x0 + x1)/2, 196, "1.5\u20132 Mb", 24, C.verm, 700));
      f.appendChild(G.text((x0 + x1)/2, 226,
        "near-complete biosynthetic autonomy is", 19, C.verm, 400));
      f.appendChild(G.text((x0 + x1)/2, 250,
        "demonstrably possible here \u2014 not a minimum", 19, C.verm, 400));
      g.appendChild(f);
    }

    BARS.forEach(function(row, i){
      const o = v[row[0]];
      if (!(o > 0.02)) return;
      const b = grp(o), y = ROW[i], w = PXMB*row[1], col = row[4];
      b.appendChild(G.el("rect", {x:X0, y:y, width:n1(w), height:BH, rx:5,
        fill:col, "fill-opacity":".14", stroke:col, "stroke-width":2.8}));
      b.appendChild(name(X0, y - 16, row[2], row[3], col));
      b.appendChild(G.text(X0 + w + 18, y + 32, row[1].toFixed(2) + " Mb", 24,
        col, 700, "start"));
      b.appendChild(G.text(X0 + 4, y + BH + 24, row[5], 20, C.ink, 700, "start"));
      b.appendChild(G.text(X0 + 4, y + BH + 50, row[6], 18, C.muted, 400, "start"));
      g.appendChild(b);
    });
    return g;
  }
  return G.run(s, FR, paint);
});
})();
