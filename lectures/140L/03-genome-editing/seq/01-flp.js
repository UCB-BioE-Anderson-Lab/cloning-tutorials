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
  { on:["before"],
    cap:"the marker goes in between two FRT sites, pointing the same way",
    call:"",
    note:"There are various ways in which you can make this process markerless. One common strategy is to flox the selectable marker. Here, a DNA is constructed with FRT sites in a parallel orientation flanking an antibiotic resistance gene. This cassette is introduced into the genome conferring chloramphenicol resistance, which is what lets you select it.",
    desc:"A stretch of DNA drawn as a line, carrying a chloramphenicol resistance marker between two FRT sites." },
  { on:["before","arrow","after"],
    cap:"Flp recombines the two FRTs and loops out everything between them",
    call:"one FRT is left behind &#183; the marker is gone and can be used again",
    note:"Subsequently, Flp recombinase is introduced into the cell, resulting in excision of the marker and leaving behind only the FRT site. The two FRTs point the same way, which is what makes this an excision rather than an inversion.",
    desc:"An arrow labelled Flp recombinase points down to a second line below the first, which carries a single FRT site and nothing else." }
];

window.Deck.sequence("flp", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const s = G.scene(slide, 786, 830);
  const YT = 372, YB = 604, X0 = 400, X1 = 1200;

  function line(y){
    return G.el("path", {d:"M"+X0+" "+y+"H"+X1, stroke:C.ink,
      "stroke-width":3.5, fill:"none", "stroke-linecap":"round"});
  }
  const before = G.el("g", {});
  before.appendChild(line(YT));
  [[560,86,"FRT",C.amber],[664,140,"CmR",C.verm],[822,86,"FRT",C.amber]]
    .forEach(f => before.appendChild(G.feat(f[0], YT, f[1], f[2], f[3])));
  s.part("before", before);

  s.part("arrow", (function(){
    const g = G.el("g", {});
    g.appendChild(G.el("path", {d:"M800 432V544M780 520L800 546L820 520",
      stroke:C.ink, "stroke-width":3.5, fill:"none",
      "stroke-linecap":"round", "stroke-linejoin":"round"}));
    g.appendChild(G.text(838, 496, "Flp recombinase", 27, C.ink, 700, "start"));
    return g;
  })());

  const after = G.el("g", {});
  after.appendChild(line(YB));
  after.appendChild(G.feat(757, YB, 86, "FRT", C.amber));
  s.part("after", after);
  s.finish();

  function go(i, animated){
    const f = FLP[Math.max(0, Math.min(FLP.length - 1, i | 0))];
    s.show(f.on, f, animated === false || reduce.matches);
  }
  go(0, false);
  /* one note and one desc per beat: without these deck.js falls back
     to the slide\'s single <template>, and presenter view shows the
     same sentence for every click while the picture changes */
  return { steps: FLP.map(f => ({note:f.note, desc:f.desc})), go: go };
});

/* ---- the same trick, on the integrated CRIM ------------------------- */
const BOX = {x:170, y:286, w:1260, h:436};
const GY = 656, GX0 = 226, GX1 = 1374;
const PR = 112, HX = 400, PY = 452;

const ML = [
  { on:["pre"],
    cap:"the CRIM went in with FRT sites flanking its marker",
    call:"everything between them is now disposable",
    note:"Let's take a look at how that would be implemented in the CRIM system. The helper plasmid was used to insert the CRIM into the genome and then cleared, and the cassette that went in had FRT sites flanking its marker.",
    desc:"The cell with the CRIM in its genome: attL, the R6K origin, an FRT site, the CmR marker, a second FRT site, the gene, and attR." },
  { on:["pre","cp20"],
    cap:"a second helper, pCP20, brings Flp in &#183; again on a temperature-sensitive origin",
    note:"The cell is now transformed with a second helper plasmid, pCP20, encoding the Flp recombinase. Same trick as before: temperature-sensitive origin, so it can be cleared afterwards.",
    desc:"A plasmid labelled pCP20 appears inside the cell, carrying Flp and bla in blue and a temperature-sensitive origin in amber." },
  { on:["post","cp20"],
    cap:"Flp loops out the marker and the origin it came in with",
    call:"one FRT left, and the gene",
    note:"The recombinase will excise the intervening region of the DNA, leaving behind only the FRT site. Notice what goes with it: the marker and the R6K origin that carried the whole thing in.",
    desc:"The genome has contracted: the R6K origin, the marker and one of the two FRT sites have gone, leaving attL, one FRT, the gene and attR." },
  { on:["post"],
    cap:"42&#176;C clears pCP20",
    call:"a gene and one FRT scar in an otherwise untouched strain",
    note:"The cells are grown again at 42 degrees to cure them of the helper plasmid. At the end of this process, a gene and a single FRT site are introduced into the genome of an otherwise unmodified cell containing no residual selectable markers.",
    desc:"The pCP20 plasmid has gone, leaving the cell with the gene and a single FRT scar in its genome." }
];

window.Deck.sequence("markerless", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const s = G.scene(slide);
  s.add(G.cell(BOX, GY, GX0, GX1));

  function run(specs){
    const g = G.el("g", {});
    specs.forEach(f => g.appendChild(G.feat(f[0], GY, f[1], f[2], f[3])));
    return g;
  }
  s.part("pre", run([
    [606, 96,"attL",  C.verm], [710,120,"oriR6K",C.amber],
    [838, 66,"FRT",   C.amber],[912, 96,"CmR",   C.verm],
    [1016,66,"FRT",   C.amber],[1090,96,"gene",  C.blue],
    [1194,96,"attR",  C.verm]
  ]));
  s.part("post", run([
    [706, 96,"attL", C.verm], [810, 66,"FRT",  C.amber],
    [884, 96,"gene", C.blue], [988, 96,"attR", C.verm]
  ]));
  s.part("cp20", G.plasmid(HX, PY, PR, [
    {a0:-128, a1:-40, col:C.blue,  txt:"Flp"},
    {a0:-20,  a1:70,  col:C.blue,  txt:"bla"},
    {a0:96,   a1:176, col:C.amber, txt:"ori ts"}
  ], "pCP20"));
  s.finish();

  function go(i, animated){
    const f = ML[Math.max(0, Math.min(ML.length - 1, i | 0))];
    s.show(f.on, f, animated === false || reduce.matches);
  }
  go(0, false);
  /* one note and one desc per beat: without these deck.js falls back
     to the slide\'s single <template>, and presenter view shows the
     same sentence for every click while the picture changes */
  return { steps: ML.map(f => ({note:f.note, desc:f.desc})), go: go };
});
})();
