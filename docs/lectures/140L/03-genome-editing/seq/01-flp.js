/* ------------------------------------------------------------------ *
 * 01-flp.js — Flp/FRT marker excision, source slide 9, and the markerless
 * CRIM it enables, source slides 10 and 11.
 *
 * Two sequences, one file, because they are one idea told twice: the
 * generic cassette first, then the same trick played on the CRIM that
 * section 01 has just put in the genome.
 *
 * "flp" is the concept.  A marker between two FRT sites in parallel
 * orientation, Flp, and one FRT left behind.  Both states are drawn and
 * the second arrives on a click, so the scar is compared against what it
 * replaced rather than described.
 *
 * "markerless" is four beats, which is the two source slides plus the two
 * clicks they mark with a "*" mid-note.  The genome's features exist
 * twice, before excision and after, and the swap is a crossfade: the DNA
 * contracts when the middle is looped out, so the survivors cannot simply
 * stay where they were and leave gaps in the molecule.
 *
 * Drawing kit and the build-once-then-fade rule: seq/parts.js.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;

/* ---- the concept ---------------------------------------------------- */
const FLP = [
  { on:[], s:{u:0},
    cap:"the marker goes in between two FRT sites, pointing the same way",
    call:"",
    note:"There are various ways in which you can make this process markerless. One common strategy is to flox the selectable marker. Here, a DNA is constructed with FRT sites in a parallel orientation flanking an antibiotic resistance gene. This cassette is introduced into the genome conferring chloramphenicol resistance, which is what lets you select it.",
    desc:"A stretch of DNA drawn as a line, carrying a chloramphenicol resistance marker between two FRT sites." },
  { on:[], s:{u:0.8},
    cap:"Flp recombines the two FRTs and loops out everything between them",
    call:"one FRT is left behind &#183; the marker is gone and can be used again",
    note:"Subsequently, Flp recombinase is introduced into the cell. It brings the two FRT sites together, which means the DNA between them has to bow out into a loop, and then it cuts and rejoins: the loop leaves as a circle carrying the marker and one of the two sites, and a single FRT is left behind. Watch the orientation, because it is the whole of why this is an excision and not an inversion \u2014 the two sites point the same way. Point them at each other and the same enzyme flips the middle instead of removing it.",
    desc:"The stretch between the two FRT sites bows out of the molecule into a loop carrying the marker and one FRT, and is cut free as a circle above it. The molecule closes up behind it, carrying a single FRT site and nothing else." }
];

window.Deck.sequence("flp", function(slide){
  const s = G.scene(slide, 786, 830);
  const Y = 500, X0 = 400, X1 = 1200;

  /* The cassette, and the piece of it that leaves.  a and b are the ends
     of that piece: from the right-hand edge of one FRT to the right-hand
     edge of the other, which is the marker and one of the two sites.
     dx slides the molecule as it contracts so the result is still
     centred rather than sitting off to the left. */
  const FEATS = [[560, 86,"FRT",C.amber],[664,140,"CmR",C.verm],
                 [822, 86,"FRT",C.amber]];
  const A = 646, B = 908;
  const paint = G.excision({
    y:Y, x0:X0, x1:X1, feats:FEATS, a:A, b:B,
    dx:(X1 - X0)/2 - (X1 - X0 - (B - A))/2
  });
  s.finish();
  return G.run(s, FLP, ["u"], f => paint(f.u));
});

/* ---- the same trick, on the integrated CRIM ------------------------- */
const BOX = {x:170, y:286, w:1260, h:436};
const GY = 656, GX0 = 226, GX1 = 1374;
/* pCP20 sits further left than the CRIM sequence's helper: the loop
   forms over the left half of the cassette, and at HX 400 the plasmid's
   bla label was underneath it. */
const PR = 112, HX = 340, PY = 452;

const ML = [
  { on:[], s:{u:0},
    cap:"the CRIM went in with FRT sites flanking its marker",
    call:"everything between them is now disposable",
    note:"Let's take a look at how that would be implemented in the CRIM system. The helper plasmid was used to insert the CRIM into the genome and then cleared, and the cassette that went in had FRT sites flanking its marker.",
    desc:"The cell with the CRIM in its genome: attL, then an FRT site, the R6K origin, the CmR marker, a second FRT site, the gene, and attR. Both FRTs enclose both the origin and the marker." },
  { on:["cp20"], s:{u:0},
    cap:"a second helper, pCP20, brings Flp in &#183; again on a temperature-sensitive origin",
    note:"The cell is now transformed with a second helper plasmid, pCP20, encoding the Flp recombinase. Same trick as before: temperature-sensitive origin, so it can be cleared afterwards.",
    desc:"A plasmid labelled pCP20 appears inside the cell, carrying Flp and bla in blue and a temperature-sensitive origin in amber." },
  { on:["cp20"], s:{u:0.8},
    cap:"Flp loops out the marker and the origin it came in with",
    call:"one FRT left, and the gene",
    note:"The recombinase brings the two FRT sites together, so everything between them bows out into a loop and is cut free as a circle. Watch what is on that circle: the marker, and the R6K origin that carried the whole thing in. That is why both of them were put inside the sites when the CRIM was designed. What is left on the genome is one FRT, the gene, and the two att junctions.",
    desc:"The stretch between the two FRT sites bows out of the genome into a loop carrying the R6K origin, the marker and one FRT, and is cut free as a circle above it. The genome closes up behind it, leaving attL, one FRT, the gene and attR." },
  { on:[], s:{u:1},
    cap:"grow them out, and both circles are lost",
    call:"a gene and one FRT scar in an otherwise untouched strain",
    note:"The cells are grown again at 42 degrees to cure them of the helper plasmid, and the circle Flp cut out goes at the same time and for a related reason: it took the R6K origin with it, so it cannot be copied either. At the end of this process, a gene and a single FRT site are introduced into the genome of an otherwise unmodified cell containing no residual selectable markers.",
    desc:"The excised circle and the pCP20 plasmid have both gone, leaving the cell with the gene and a single FRT scar in its genome." }
];

window.Deck.sequence("markerless", function(slide){
  const s = G.scene(slide);
  s.add(G.cell(BOX, GY, GX0, GX1));
  s.part("cp20", G.plasmid(HX, PY, PR, [
    {a0:-128, a1:-40, col:C.blue,  txt:"Flp"},
    {a0:-20,  a1:70,  col:C.blue,  txt:"bla"},
    {a0:96,   a1:176, col:C.amber, txt:"ori ts"}
  ], "pCP20"));

  /* THE ORIGIN GOES INSIDE THE FRT SITES.  It used to be drawn between
     attL and the first FRT -- outside the pair -- while the narration
     said the marker and the R6K origin both leave.  Both cannot be true.
     The origin is the reason you want it out (it is the thing that made
     the plasmid conditional) so the cassette is built with both FRTs
     around both of them, which is also how a CRIM is actually made. */
  const X = 452;
  const FEATS = [
    [X,      96,"attL",  C.verm ], [X + 106, 66,"FRT",   C.amber],
    [X + 182,120,"oriR6K",C.amber], [X + 312, 96,"CmR",   C.verm ],
    [X + 418, 66,"FRT",   C.amber], [X + 494, 96,"gene",  C.blue ],
    [X + 600, 96,"attR",  C.verm ]
  ];
  const A = X + 172, B = X + 484;      /* right edge of one FRT to the other */
  const paint = G.excision({
    y:GY, feats:FEATS, a:A, b:B, dx:(B - A)/2
  });
  s.finish();
  return G.run(s, ML, ["u"], f => paint(f.u));
});
})();
