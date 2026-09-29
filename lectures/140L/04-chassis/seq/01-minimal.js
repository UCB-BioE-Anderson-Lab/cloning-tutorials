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
const ROW = [238, 350, 462, 574, 686];
const BARS = [
  ["vir",  0.0135, "influenza A", "", C.verm,
   "a virus \u2014 and an enveloped one", "it does not even make its own membrane"],
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
/* The layer decomposition, which used to be a ring diagram with twenty
   items listed beside it.  It survives as the one part of the idea that
   is a picture rather than a list: the E. coli bar, partitioned. */
const LAY = [["information", 0.30, C.blue], ["biosynthesis", 0.16, C.blue],
             ["robustness", 0.26, C.amber], ["ecological", 0.28, C.verm]];
const BRACK = [[0, 1, "make another cell"],
               [2, 2, "keep it alive when things change"],
               [3, 3, "let it compete somewhere"]];

const FR = [
{ s:{vir:1},
  cap:"the smallest thing on this slide is <b>13.5 kb</b>",
  call:"and it does not even make its own <b>membrane</b>",
  note:"Start at the bottom and be concrete. Influenza A is about thirteen and a half kilobases across eight segments. It is so small it barely draws at this scale, and it is enveloped, which means it does not even build its own membrane -- it takes one on the way out of the cell it just destroyed. Phage lambda, which you have met all over this course, is forty-eight kilobases and the same story. Neither has a ribosome. Neither makes a nucleotide. So if the question is how small a genome can get, the honest answer starts here, and it is going to turn out to be a bad question.",
  desc:"Influenza A at 13.5 kilobases, drawn as a sliver: an enveloped virus that does not make its own membrane." },

{ s:{vir:1, syn:1},
  cap:"<b>JCVI-syn3.0</b> &#183; 0.53 Mb &#183; 473 genes",
  call:"a cell that reproduces &#8212; and was minimised <b>in a rich medium</b>",
  note:"The smallest self-reproducing cell anybody has built. Five hundred and thirty-one kilobases, four hundred and seventy-three genes, and it divides, which the virus does not. But read how it was made: genes were deleted one at a time in a rich medium, so everything whose product the medium supplied is gone. It answers what a cell must encode when almost everything is handed to it. Breuer and colleagues did the metabolic reconstruction on syn3A and the story is import, import, import.",
  desc:"JCVI-syn3.0 at 0.53 megabases, a self-reproducing cell minimised in a rich medium." },

{ s:{vir:1, syn:1, pel:1},
  cap:"<b><em>Pelagibacter ubique</em></b> &#183; 1.31 Mb",
  call:"free-living, and it made a very specific bargain with the ocean",
  note:"The natural version of the same lesson, and one of the most abundant organisms on the planet. One point three one megabases, free-living in open ocean, streamlined rather than parasitic. But defined-medium work shows what the streamlining cost: it cannot do assimilatory sulfate reduction, so reduced sulfur has to be handed to it, and it has requirements involving glycine or serine and pyruvate. Free-living, and still not autonomous.",
  desc:"Pelagibacter ubique at 1.31 megabases, free-living but with specific metabolite dependencies." },

{ s:{vir:1, syn:1, pel:1, pro:1},
  cap:"<b><em>Prochlorococcus</em></b> MED4 &#183; 1.66 Mb",
  call:"a complete biosynthetic network &#183; on <b>light and CO&#8322;</b>",
  note:"And this one is the proof of principle. One point six six megabases, about seventeen hundred genes, and it encodes a complete metabolic network: everything it is made of, out of carbon dioxide, mineral nutrients and light. Say the caveat plainly, because it matters: it is a phototroph, not a glucose heterotroph. What it demonstrates is that near-complete biosynthetic autonomy fits in a genome of this order.",
  desc:"Prochlorococcus MED4 at 1.66 megabases, a phototroph with a complete biosynthetic network." },

{ s:{vir:1, syn:1, pel:1, pro:1, ecoli:1},
  cap:"and <em>E. coli</em> at <b>4.64 Mb</b>",
  call:"three hundred times the virus &#183; and nine times the minimal cell",
  note:"And the one you use, four point six four megabases. Three orders of magnitude above the virus and nine times the minimal cell. Now look at the column on the left, because the ordering is real and it is measured, and it is about to stop being useful.",
  desc:"E. coli K-12 at 4.64 megabases, completing the set of five." },

{ s:{vir:1, syn:1, pel:1, pro:1, ecoli:1, why:1},
  cap:"but every one of these is small for the <b>same reason</b>",
  call:"something else is doing the work &#183; so &#8220;smallest&#8221; is not a definition",
  note:"Here is why the question was bad. Read the second line under each bar. The virus has no ribosome because a cell has one. Syn3.0 is half a megabase because it was minimised in a medium that fed it. Pelagibacter is small because the ocean reliably supplies reduced sulfur. Prochlorococcus is small and genuinely autonomous, but on a completely different input set. Every one of these numbers is as much a statement about an environment as about an organism, which means you can drive genome size arbitrarily low by assuming a more generous world. Smallest is not a definition of anything. So the next slide asks for a definition that does not depend on somebody else being generous.",
  desc:"All five bars with their caveats emphasised: each is small because something else supplies the work, so smallest is not a usable definition." }
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

    const hot = (v.why || 0) > 0.5;

    BARS.forEach(function(row, i){
      const o = v[row[0]];
      if (!(o > 0.02)) return;
      const b = grp(o), y = ROW[i], col = row[4];
      const w = Math.max(PXMB*row[1], 5);
      b.appendChild(G.el("rect", {x:X0, y:n1(y), width:n1(w), height:BH,
        rx:row[1] < 0.1 ? 2 : 5, fill:col, "fill-opacity":".14",
        stroke:col, "stroke-width":2.8}));
      b.appendChild(name(X0, y - 16, row[2], row[3], col));
      /* what kind of thing it is, right-aligned so the column reads */
      b.appendChild(G.text(1440, y - 16, row[5], 21, C.ink, 700, "end"));
      b.appendChild(G.text(X0 + w + 18, y + 32,
        row[1] < 0.1 ? "13.5 kb" : row[1].toFixed(2) + " Mb", 24, col, 700, "start"));
      if (row[1] < 0.1)
        b.appendChild(G.text(X0 + w + 128, y + 32,
          "\u2014 too small to draw to scale", 19, C.muted, 400, "start"));
      /* and why it is small, which is the punch on the last beat */
      b.appendChild(G.text(X0 + 4, y + BH + 26, row[6], 19,
        hot ? C.verm : C.muted, hot ? 700 : 400, "start"));
      g.appendChild(b);
    });

    return g;
  }
  return G.run(s, FR, paint);
});
})();
