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
const PR = 76, PX = 330, PY = 546;

/* the tube: three rows, template then oligos then product */
const Y1 = 208, Y2 = 286, Y3 = 364;
const TX0 = 440, TX1 = 1160;      /* pKD3's line, which runs past both ends */
const LABX = 418;                 /* the row names, right-aligned together */

/* ONE table for the PCR product, offsets from its left end, and every
   row that draws part of it measures from here.  The three rows of the
   tube are the same molecule seen three ways, so a box has to sit at the
   same x in all three or the reader cannot follow a part down the
   picture -- which is exactly what had gone wrong: the product row had
   drifted a few pixels per feature and by P2 it was twenty out.  Every
   row of the tube, the product inside the cell, and the locus it makes
   are all cut from this one table, so they cannot drift again.  PX0
   centres it on 800, which is where the target sits on the genome. */
const PX0 = 800 - 640/2, PW = 640;
const CASS = [
  [  0, 100, "40 bp", "blue" ], [100,  76, "P1",  "verm" ],
  [186,  66, "FRT",   "amber"], [262, 116, "CmR", "verm" ],
  [388,  66, "FRT",   "amber"], [464,  76, "P2",  "verm" ],
  [540, 100, "40 bp", "blue" ]
];
/* `from` and `to` slice it: the genome keeps the cassette but not the
   homology arms, which have recombined into the chromosome. */
const cass = (x0, from, to) => CASS.slice(from, to)
  .map(f => [x0 + f[0], f[1], f[2], C[f[3]]]);

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
  { on:["target","arms","kd46","tmpl","oligos"],
    cap:"each oligo is those twenty bases, with forty bases of the genome added to its 5&#8242; end",
    call:"the forty is the only part you design &#183; everything else is copied from the paper",
    note:"These PCR oligos are designed to contain those 20bp sequences on their 3-prime ends, and then 40bp of homology to the genome target on their 5-prime ends. The forty is the only part of this you choose.",
    desc:"Below it, the two oligos appear as short pieces: forty bases of genome homology in blue, then the twenty that prime on P1 or P2 in red." },
  { on:["target","arms","kd46","tmpl","oligos","pcr"],
    cap:"PCR gives one linear double-stranded DNA with genome homology at both ends",
    note:"PCR results in a double stranded, linear PCR product with homology to the genome on both ends.",
    desc:"Below those, the PCR product: one linear DNA carrying forty bases of homology, P1, the marker cassette, P2, and forty more bases of homology." },
  { on:["target","arms","kd46","inside"],
    cap:"electroporated into the cell",
    call:"linear, which is what lambda red wants &#183; it would do nothing with a circle",
    note:"The cells containing the lambda red genes are transformed with this PCR product, usually by electroporation. Linear is the point: lambda red would do nothing with a circle.",
    desc:"The three rows above the cell have gone and the same product is now inside the cell, lying above the genome." },
  { on:["arms","kd46","ko"],
    cap:"lambda red crosses it over at both ends at once, so the target goes and the marker takes its place",
    call:"chloramphenicol now selects the cells that did it",
    note:"Inside the cell, the lambda red genes cause the double-crossover recombination of the PCR product over the sequence homologous to its ends in the target. Because recombined cells contain the chloramphenicol resistance gene, they can be selected by growth on antibiotic-containing medium.",
    desc:"The product has gone and the genome now carries P1, the two FRT sites with CmR between them, and P2, where the target gene used to be." },
  { on:["arms","ko"],
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
  /* The target spans exactly the stretch the cassette replaces, and the
     two 40 bp arms sit hard against it, because that is what the oligo
     design means: the forty bases you pick are the genome immediately
     flanking what you are deleting.  Drawn this way the product lying
     above lines up box for box with the genome below it, and the double
     crossover is something you can see rather than something told. */
  s.part("target", G.feat(PX0 + 100, GY, PW - 200, "target", C.ink));
  s.part("arms", (function(){
    const g = G.el("g", {});
    g.appendChild(G.feat(PX0, GY, 100, "40 bp", C.blue));
    g.appendChild(G.feat(PX0 + PW - 100, GY, 100, "40 bp", C.blue));
    return g;
  })());
  s.part("kd46", G.plasmid(PX, PY, PR, [
    {a0:-136, a1:-44, col:C.blue,  txt:"red genes"},
    {a0:-24,  a1:64,  col:C.blue,  txt:"bla"},
    {a0:92,   a1:172, col:C.amber, txt:"ori ts"}
  ], "pKD46"));

  /* ---- the tube ---------------------------------------------------- */
  const put = (g, y, f) => g.appendChild(G.feat(f[0], y, f[1], f[2], f[3]));

  s.part("tmpl", (function(){
    /* the cassette without the homology arms, and with P1 and P2 muted:
       on the template they are only somewhere for an oligo to land */
    const f = cass(PX0, 1, 6);
    f[0][3] = f[4][3] = C.muted;
    const g = row(Y1, TX0, TX1, f);
    g.appendChild(G.text(LABX, Y1 + 9, "pKD3", 25, C.muted, 400, "end"));
    return g;
  })());
  s.part("oligos", (function(){
    /* each oligo: 40 bases of genome on the 5' end, then 20 that prime.
       Two separate molecules, so no line joins them. */
    const g = G.el("g", {});
    cass(PX0, 0, 2).forEach(f => put(g, Y2, f));
    cass(PX0, 5, 7).forEach(f => put(g, Y2, f));
    g.appendChild(G.text(LABX, Y2 + 9, "oligos", 25, C.muted, 400, "end"));
    return g;
  })());
  s.part("pcr", (function(){
    /* the line runs end to end and no further: a PCR product stops where
       the homology arms stop, so a stub either side would be DNA that is
       not there.  It shows only in the gaps between boxes, which is what
       ties them into one molecule. */
    const g = row(Y3, PX0, PX0 + PW, cass(PX0, 0, 7));
    g.appendChild(G.text(LABX, Y3 + 9, "product", 25, C.muted, 400, "end"));
    return g;
  })());

  /* ---- the same product, now in the cell --------------------------- */
  /* directly over what it is about to replace */
  s.part("inside", row(550, PX0, PX0 + PW, cass(PX0, 0, 7)));

  /* what is left on the genome: the cassette without its homology arms,
     at the x the arms put it */
  const ko = G.el("g", {});
  cass(PX0, 1, 6).forEach(f => ko.appendChild(G.feat(f[0], GY, f[1], f[2], f[3])));
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
  { on:[], s:{u:0},
    cap:"the template's FRT sites came along with the marker",
    call:"which is the whole reason pKD3 has them",
    note:"If the original template sequence contains FRT sites flanking the selectable marker, recombination of the PCR product into the genome will retain these sequences. That is why pKD3 has them.",
    desc:"The cell after the knockout, its genome carrying the chloramphenicol marker between the two FRT sites that came in with it." },
  { on:["cp20"], s:{u:0},
    cap:"pCP20 brings Flp in",
    note:"Transformation with a second helper plasmid encoding a site-specific recombinase, pCP20, brings Flp into the cell.",
    desc:"A plasmid labelled pCP20 appears inside the cell, carrying Flp and bla in blue and a temperature-sensitive origin in amber." },
  { on:["cp20"], s:{u:0.8},
    cap:"Flp recombines the two FRTs and everything between them comes out",
    note:"Watch what leaves. Flp brings the two FRT sites together, so the DNA between them bows out into a loop and is cut free as a circle: the marker, and one of the two FRTs. That circle has no origin of replication in it, so it cannot be copied, and it is diluted away as the cells divide. That is the whole of how the marker goes. What is left behind is a single FRT site \u2014 and, either side of it, P1 and P2, because those came in on the oligos and they sit outside the FRTs. So the scar is about a hundred bases, not a single site. No marker, though, which is the point.",
    desc:"The stretch between the two FRT sites bows out of the genome into a loop carrying the marker and one FRT, closes into a circle, lets go and drifts away. The genome closes up behind it: the two 40 bp homology regions with P1, a single FRT and P2 between them." },
  { on:[], s:{u:1},
    cap:"grow them out, and both circles are lost",
    call:"42&#176;C clears pCP20 &#183; the excised one has no origin, so it is simply diluted away",
    note:"Two things leave on this click and they leave for the same reason. The cells are grown at a temperature non-permissive for the pCP20 origin, so the helper is cured. And the circle Flp cut out has no origin of replication in it at all, so it was never going to be copied; it is diluted out as the cells divide. The original target is disrupted, and nothing selectable is left behind \u2014 just the FRT site and the priming sequences either side of it.",
    desc:"The excised circle and the pCP20 plasmid have both gone, leaving the cell with the scar \u2014 P1, one FRT site and P2 between the two homology regions \u2014 marking the disrupted locus." }
];

window.Deck.sequence("dw-markerless", function(slide){
  const s = G.scene(slide);
  s.add(G.cell(BOX, GY, GX0, GX1));
  s.part("cp20", G.plasmid(PX, PY, PR, [
    {a0:-136, a1:-44, col:C.blue,  txt:"Flp"},
    {a0:-24,  a1:64,  col:C.blue,  txt:"bla"},
    {a0:92,   a1:172, col:C.amber, txt:"ori ts"}
  ], "pCP20"));

  /* The excision is drawn rather than cut to.  Flp recombines the two
     FRT sites, so the piece that leaves runs from the right-hand edge of
     one to the right-hand edge of the other: the marker, and one of the
     two FRTs.  Everything outside stays, and that includes P1 and P2 --
     the priming sites came in on the oligos and sit outside the FRTs --
     so the scar is a hundred-odd bases and not a single site.

     a and b are the ends of that piece.  dx slides the molecule as it
     contracts so the finished locus is still centred on 800; without it
     the whole cassette ends up a hundred pixels left of where the room
     was looking. */
  const A = PX0 + 186 + 66, B = PX0 + 388 + 66;
  const paint = G.excision({
    y:GY, feats:cass(PX0, 0, 7), a:A, b:B, dx:(B - A)/2
  });
  s.finish();
  return G.run(s, MK, ["u"], f => paint(f.u));
});
})();
