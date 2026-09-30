/* ------------------------------------------------------------------ *
 * 05-carnosine.js — source slides 50 and 51, and the single most
 * load-bearing slide in the source deck for this course.
 *
 * It is an ortholog panel with real titers, and the capstone in
 * planning/project_ispA.md asks the students to design exactly this:
 * pick orthologs, express them in one vector, justify the picks.  The
 * source has it fourth from the end.
 *
 * THE NUMBERS ARE THE SOURCE DECK'S OWN CHART, unchanged:
 *
 *     neg0   21,988        ca8    32,399   Gorilla gorilla
 *     ca2   120,971        ca10 1,912,085   Alligator mississippiensis
 *                          ca14   38,837   Python bivittatus
 *
 * with 76.15% identity across the panel as tested.  So ca10 is 87-fold
 * over the negative control and 16-fold over the next best thing, and
 * three of the four orthologs plotted sit within a factor of two of a
 * strain carrying no enzyme at all.
 *
 * Log axis, because 87-fold on a linear one is one bar and four stubs.
 * The species names are on the slide because they are the argument: a
 * gorilla, a falcon, an alligator, a panda, a polar bear, a python and
 * an orca is not a list anybody would arrive at by reasoning about
 * biochemistry, and the one that won is the alligator.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

/* the panel as tested, from the source deck's own table */
const PANEL = [
["ca8",  "Gorilla gorilla"],        ["ca9",  "Falco peregrinus"],
["ca10", "Alligator mississippiensis"], ["ca11", "Ailuropoda melanoleuca"],
["ca12", "Ursus maritimus"],        ["ca14", "Python bivittatus"],
["ca15", "Orcinus orca"]
];
/* and the measured titers, from the source deck's own chart */
const DATA = [
{ n:"neg0", v:21988,     col:C.muted, note:"no enzyme" },
{ n:"ca2",  v:120971,    col:C.blue },
{ n:"ca8",  v:32399,     col:C.blue },
{ n:"ca10", v:1912084.5, col:C.verm },
{ n:"ca14", v:38836.5,   col:C.blue }
];
/* Five rows have to finish above the closing block at y 700.  At the
   first spacing the last bar landed at 744, straight through it. */
const BX = 560, BW = 580, BARY = 462, BH = 46;

const FR = [
{ s:{panel:1},
  cap:"carnosine synthase, seven orthologs, one vector",
  call:"76% identical across the panel &#183; same promoter, same RBS, same strain",
  note:"Here is a real panel, and it is a design you are about to have to justify yourselves. Carnosine synthase, cloned from seven organisms, every one of them into the same vector behind the same promoter and the same ribosome binding site. Look at the species. A gorilla, a peregrine falcon, an alligator, a giant panda, a polar bear, a Burmese python and an orca. That is not a list anyone arrived at by reasoning about the enzyme mechanism. It is a spread across the vertebrates, chosen so that if the trait varies with something you have not thought of, you catch it. And across the panel as tested the proteins are about seventy-six per cent identical, which is to say they are nearly the same protein.",
  desc:"The seven orthologs of carnosine synthase in the panel, with their accessions and species, all cloned into the same vector." },

{ s:{panel:1, bars:1},
  cap:"relative carnosine in the cell pellet",
  call:"log axis &#8212; on a linear one this is one bar and four stubs",
  note:"And these are the titers. Note the axis: it is logarithmic, because on a linear axis this figure is one bar and four stubs and you cannot read anything off it. The grey bar at the top is the negative control, a strain carrying no carnosine synthase at all, which still shows a signal because the assay has a background.",
  desc:"A logarithmic bar chart of relative carnosine titer for the negative control and four of the orthologs." },

{ s:{panel:1, bars:1, call1:1},
  cap:"one of them is <b>87&#215;</b> over the negative control",
  call:"and the next best is 16&#215; below it",
  note:"One of them worked. The alligator ortholog gives about eighty-seven times the negative control, and the next best in the panel is sixteen-fold below that. Three of the four plotted sit within a factor of two of a strain carrying no enzyme at all — which is to say, within the noise of having done nothing.",
  desc:"The alligator ortholog marked as 87-fold over the negative control, with the next best 16-fold below it." },

{ s:{panel:1, bars:1, call1:1}, on:["why"],
  cap:"nearly the same protein &#8212; and you could not have picked the winner",
  call:"which is the entire argument for making a panel instead of a choice",
  note:"So here is the argument, and it is the one your capstone writeup has to make. These proteins are about seventy-six per cent identical. They do the same reaction in their own organisms. And the spread between them in E. coli is nearly two orders of magnitude, with no obvious feature separating the winner from the rest. Nobody looked at an alignment and predicted the alligator. Which is exactly why the answer is a panel rather than a choice: when you cannot predict the ranking, you buy the ranking, and seven constructs is cheap compared to one construct and six months. Now — and this is the caveat from the previous slide — notice what this figure does not tell you. It reports product, not protein. Any of those near-background orthologs could be a perfectly good enzyme that was never expressed, and there is nothing here that would distinguish the two.",
  desc:"The closing argument: the orthologs are 76% identical and span nearly two orders of magnitude with no predictor, so a panel replaces a prediction, with the caveat that the assay reports product rather than protein." }
];

window.Deck.sequence("carnosine", function(slide){
  const s = K.scene(slide, 800, 846);

  const w = K.el("g", {});
  w.appendChild(K.path("M330 700H1270", C.muted, 2));
  w.appendChild(K.text(800, 742,
    "when you cannot predict the ranking, buy it", 28, C.verm, 700));
  w.appendChild(K.text(800, 772,
    "— and remember this assay reports product, not protein", 22, C.muted, 400));
  s.part("why", w);

  const cite = K.el("text", {x:1380, y:250, "font-size":19, fill:C.muted,
    "text-anchor":"end"}, "relative carnosine titer in the cell pellet");
  s.add(cite);
  s.finish();

  function paint(v){
    const g = K.el("g", {});

    if (v.panel > 0.02){
      const a = K.grp(v.panel);
      PANEL.forEach(function(p, i){
        const x = 150 + (i % 2)*420, y = 300 + Math.floor(i/2)*38;
        a.appendChild(K.text(x, y, p[0], 22,
          p[0] === "ca10" ? C.verm : C.muted, 700, "start"));
        a.appendChild(K.mixed(x + 62, y, [[p[1], true]], 22,
          p[0] === "ca10" ? C.verm : C.muted, 400, "start"));
      });
      a.appendChild(K.text(150, 254, "76% identical across the panel",
        23, C.ink, 700, "start"));
      g.appendChild(a);
    }

    if (v.bars > 0.02){
      const rows = DATA.map(function(d){
        return { v:d.v, col:d.col, u:v.bars, bold:d.col === C.verm,
                 label:[[d.n, false]],
                 txt:d.v >= 1e6 ? (d.v/1e6).toFixed(2) + "M"
                                : Math.round(d.v/1000) + "k" };
      });
      g.appendChild(K.bars({ x:BX, y:BARY, w:BW, rh:BH,
                             lo:15000, hi:2600000, rows:rows, size:23 }));
      g.appendChild(K.text(BX - 100, BARY, "no enzyme", 20, C.muted, 400, "end"));
    }

    if (v.call1 > 0.02){
      const a = K.grp(v.call1), y3 = BARY + 3*BH;
      a.appendChild(K.text(BX + BW + 120, y3 + 9, "87× the control",
        25, C.verm, 700, "start"));
      g.appendChild(a);
    }
    return g;
  }
  return K.run(s, FR, paint);
});
})();
