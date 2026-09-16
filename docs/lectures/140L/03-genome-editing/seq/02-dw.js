/* ------------------------------------------------------------------ *
 * 02-dw.js — the Datsenko/Wanner knockout, source slides 20 to 26.
 *
 * Seven source slides, eleven beats, split into two sequences on the same
 * break the source uses: the knockout, then making it markerless.
 *
 * The source draws the cassette and the cell in one frame, which puts a
 * PCR reaction inside a bacterium.  Here they are two bands: the tube on
 * top, the cell underneath, and the tube clears the moment the product is
 * electroporated in.  Nothing else about the picture moves, so the room
 * can watch the same molecule cross the boundary.
 *
 * Drawing kit and the build-once-then-fade rule: seq/parts.js.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;

/* The cell has to be tall enough for a LABELLED plasmid: a ring of
   radius r needs r+30 of clearance above and below it, or the top label
   lands on the cell wall and the bottom one on the genome. */
const BOX = {x:170, y:420, w:1260, h:336, r:46};
const GY = 690, GX0 = 226, GX1 = 1374;
const PR = 76, PX = 360, PY = 546;

/* the tube: three rows, template then oligos then product */
const Y1 = 208, Y2 = 286, Y3 = 364;
const TX0 = 470, TX1 = 1200;

const FR = [
  { on:["target"],
    cap:"any strain that has the gene you want gone",
    note:"It begins with pretty much any E. coli strain containing the target sequence we wish to remove.",
    desc:"A cell drawn as a rounded box with its genome along the floor, and the gene to be removed marked on it." },
  { on:["target","kd46"],
    cap:"pKD46 carries the lambda red genes under Pbad &#183; 30&#176;C to keep the plasmid, arabinose to switch them on",
    call:"E. coli will not recombine on its own; this is what makes it able to",
    note:"The cell is first transformed with a helper plasmid, pKD46, and grown at the permissive temperature of 30 degrees. This temperature-sensitive plasmid encodes the lambda red genes under a Pbad promoter. Growth of the cells with arabinose present will induce expression of this cassette, resulting in the production of lambda red and enhancement of homologous recombination in the cell.",
    desc:"A plasmid labelled pKD46 appears inside the cell, carrying the lambda red genes and bla in blue and a temperature-sensitive origin in amber." },
  { on:["target","kd46","tmpl"],
    cap:"the marker comes off a template plasmid, pKD3, with FRT sites already flanking it",
    call:"P1 and P2 are just the twenty bases your oligos will prime on",
    note:"The knockout cassette begins with a template plasmid. The plasmids pKD3, pKD4 and pKD13 were originally designed for this experiment, and they essentially are sources of the chloramphenicol resistance gene, for pKD3, or the kanamycin resistance gene, for pKD4. There are specific 20bp regions of the plasmid called P1 and P2 which are the sites where oligos can prime to amplify the selectable marker by PCR.",
    desc:"Above the cell, a stretch of pKD3 appears: the P1 and P2 priming sites in grey with the FRT-CmR-FRT cassette between them." },
  { on:["target","kd46","tmpl","oligos"],
    cap:"each oligo is those twenty bases, with forty bases of the genome added to its 5&#8242; end",
    call:"the forty is the only part you design &#183; everything else is copied from the paper",
    note:"These PCR oligos are designed to contain those 20bp sequences on their 3-prime ends, and then 40bp of homology to the genome target on their 5-prime ends. The forty is the only part of this you choose.",
    desc:"Below it, the two oligos appear as short pieces: forty bases of genome homology in blue, then the twenty that prime on P1 or P2 in red." },
  { on:["target","kd46","tmpl","oligos","pcr"],
    cap:"PCR gives one linear double-stranded DNA with genome homology at both ends",
    note:"PCR results in a double stranded, linear PCR product with homology to the genome on both ends.",
    desc:"Below those, the PCR product: one linear DNA carrying forty bases of homology, P1, the marker cassette, P2, and forty more bases of homology." },
  { on:["target","kd46","inside"],
    cap:"electroporated into the cell",
    call:"linear, which is what lambda red wants &#183; it would do nothing with a circle",
    note:"The cells containing the lambda red genes are transformed with this PCR product, usually by electroporation. Linear is the point: lambda red would do nothing with a circle.",
    desc:"The three rows above the cell have gone and the same product is now inside the cell, lying above the genome." },
  { on:["kd46","ko"],
    cap:"lambda red crosses it over at both ends at once, so the target goes and the marker takes its place",
    call:"chloramphenicol now selects the cells that did it",
    note:"Inside the cell, the lambda red genes cause the double-crossover recombination of the PCR product over the sequence homologous to its ends in the target. Because recombined cells contain the chloramphenicol resistance gene, they can be selected by growth on antibiotic-containing medium.",
    desc:"The product has gone and the genome now carries P1, the two FRT sites with CmR between them, and P2, where the target gene used to be." },
  { on:["ko"],
    cap:"42&#176;C clears pKD46",
    call:"the gene is disrupted, and the cell is carrying nothing it should not be",
    note:"The helper plasmid pKD46 is then cleared from the cell by growth at elevated temperature. This results in a strain in which the target sequence has been disrupted.",
    desc:"The pKD46 plasmid has gone, leaving the cell with the disrupted locus and nothing else." }
];

window.Deck.sequence("dw", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const s = G.scene(slide);

  function line(x0, x1, y){
    return G.el("path", {d:"M"+x0+" "+y+"H"+x1, stroke:C.ink,
      "stroke-width":3.5, fill:"none", "stroke-linecap":"round"});
  }
  function row(y, x0, x1, specs){
    const g = G.el("g", {});
    g.appendChild(line(x0, x1, y));
    specs.forEach(f => g.appendChild(G.feat(f[0], y, f[1], f[2], f[3])));
    return g;
  }

  s.add(G.cell(BOX, GY, GX0, GX1));
  s.part("target", G.feat(700, GY, 200, "target", C.ink));
  s.part("kd46", G.plasmid(PX, PY, PR, [
    {a0:-136, a1:-44, col:C.blue,  txt:"red genes"},
    {a0:-24,  a1:64,  col:C.blue,  txt:"bla"},
    {a0:92,   a1:172, col:C.amber, txt:"ori ts"}
  ], "pKD46"));

  /* ---- the tube ---------------------------------------------------- */
  s.part("tmpl", (function(){
    const g = row(Y1, TX0, TX1, [
      [566, 76,"P1", C.muted],  [652, 66,"FRT",C.amber],
      [728,116,"CmR",C.verm],   [854, 66,"FRT",C.amber],
      [930, 76,"P2", C.muted]
    ]);
    g.appendChild(G.text(TX0 - 22, Y1 + 9, "pKD3", 25, C.muted, 400, "end"));
    return g;
  })());
  s.part("oligos", (function(){
    const g = G.el("g", {});
    /* each oligo: 40 bases of genome on the 5' end, then 20 that prime */
    g.appendChild(G.feat(466, Y2, 100, "40 bp", C.blue));
    g.appendChild(G.feat(566, Y2,  76, "P1",    C.verm));
    g.appendChild(G.feat(930, Y2,  76, "P2",    C.verm));
    g.appendChild(G.feat(1006,Y2, 100, "40 bp", C.blue));
    g.appendChild(G.text(TX0 - 22, Y2 + 9, "oligos", 25, C.muted, 400, "end"));
    return g;
  })());
  s.part("pcr", (function(){
    const g = row(Y3, 452, 1104, [
      [466,100,"40 bp",C.blue], [570, 76,"P1", C.verm],
      [650, 66,"FRT",  C.amber],[720,116,"CmR",C.verm],
      [840, 66,"FRT",  C.amber],[910, 76,"P2", C.verm],
      [990,100,"40 bp",C.blue]
    ]);
    g.appendChild(G.text(444, Y3 + 9, "product", 25, C.muted, 400, "end"));
    return g;
  })());

  /* ---- the same product, now in the cell --------------------------- */
  s.part("inside", (function(){
    const g = row(550, 546, 1198, [
      [560,100,"40 bp",C.blue], [664, 76,"P1", C.verm],
      [744, 66,"FRT",  C.amber],[814,116,"CmR",C.verm],
      [934, 66,"FRT",  C.amber],[1004,76,"P2", C.verm],
      [1084,100,"40 bp",C.blue]
    ]);
    return g;
  })());

  const ko = G.el("g", {});
  [[600,76,"P1",C.verm],[680,66,"FRT",C.amber],[750,116,"CmR",C.verm],
   [870,66,"FRT",C.amber],[940,76,"P2",C.verm]]
    .forEach(f => ko.appendChild(G.feat(f[0], GY, f[1], f[2], f[3])));
  s.part("ko", ko);
  s.finish();

  function go(i, animated){
    const f = FR[Math.max(0, Math.min(FR.length - 1, i | 0))];
    s.show(f.on, f, animated === false || reduce.matches);
  }
  go(0, false);
  /* one note and one desc per beat: without these deck.js falls back
     to the slide\'s single <template>, and presenter view shows the
     same sentence for every click while the picture changes */
  return { steps: FR.map(f => ({note:f.note, desc:f.desc})), go: go };
});

/* ---- and making it markerless, source slides 25 and 26 -------------- */
const MK = [
  { on:["ko"],
    cap:"the template's FRT sites came along with the marker",
    call:"which is the whole reason pKD3 has them",
    note:"If the original template sequence contains FRT sites flanking the selectable marker, recombination of the PCR product into the genome will retain these sequences. That is why pKD3 has them.",
    desc:"The cell after the knockout, its genome carrying the chloramphenicol marker between the two FRT sites that came in with it." },
  { on:["ko","cp20"],
    cap:"pCP20 brings Flp in",
    note:"Transformation with a second helper plasmid encoding a site-specific recombinase, pCP20, brings Flp into the cell.",
    desc:"A plasmid labelled pCP20 appears inside the cell, carrying Flp and bla in blue and a temperature-sensitive origin in amber." },
  { on:["scar","cp20"],
    cap:"Flp loops the marker out between the two FRTs",
    note:"Flp catalyzes the excision of the intervening marker, leaving behind only a single FRT site in the genome.",
    desc:"The marker and one FRT site have gone from the genome, leaving a single FRT site where the gene was." },
  { on:["scar"],
    cap:"42&#176;C clears pCP20",
    call:"the target is gone and one FRT is all that marks where it was",
    note:"Growth of the cells at a non-permissive temperature results in clearance of the helper plasmid. Thus, the original target is disrupted with no residual modifications.",
    desc:"The pCP20 plasmid has gone, leaving the cell with one FRT site marking the disrupted locus." }
];

window.Deck.sequence("dw-markerless", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const s = G.scene(slide);
  s.add(G.cell(BOX, GY, GX0, GX1));

  const ko = G.el("g", {});
  [[600,76,"P1",C.verm],[680,66,"FRT",C.amber],[750,116,"CmR",C.verm],
   [870,66,"FRT",C.amber],[940,76,"P2",C.verm]]
    .forEach(f => ko.appendChild(G.feat(f[0], GY, f[1], f[2], f[3])));
  s.part("ko", ko);
  s.part("scar", G.feat(737, GY, 66, "FRT", C.amber));
  s.part("cp20", G.plasmid(PX, PY, PR, [
    {a0:-136, a1:-44, col:C.blue,  txt:"Flp"},
    {a0:-24,  a1:64,  col:C.blue,  txt:"bla"},
    {a0:92,   a1:172, col:C.amber, txt:"ori ts"}
  ], "pCP20"));
  s.finish();

  function go(i, animated){
    const f = MK[Math.max(0, Math.min(MK.length - 1, i | 0))];
    s.show(f.on, f, animated === false || reduce.matches);
  }
  go(0, false);
  /* one note and one desc per beat: without these deck.js falls back
     to the slide\'s single <template>, and presenter view shows the
     same sentence for every click while the picture changes */
  return { steps: MK.map(f => ({note:f.note, desc:f.desc})), go: go };
});
})();
