/* ------------------------------------------------------------------ *
 * 02-lambda-red.js — what the three Red proteins actually do, and where
 * the recombination happens.
 *
 *   lambda-red  the donor DNA's fate: RecBCD would eat it, Gam stops
 *               that, Exo resects it, Bet coats what is left
 *   red-fork    the other half of the reaction, on the genome: the
 *               coated strand anneals at a replication fork
 *
 * WHY THIS IS TWO SLIDES NOW.  The first version named exo, gam and bet
 * and then drew only Exo, so two of the three were a list item and
 * nothing else.  JCA: "what do gam and bet do?  Could we illustrate this
 * mechanism in more detail and more accurately?"  They do genuinely
 * different jobs -- Gam never touches your DNA at all, it inhibits a
 * host nuclease -- and the annealing step happens somewhere specific,
 * which is the part that explains why a plain oligo works and why one of
 * the two oligos works far better than the other.
 *
 * ACCURACY, and where the field hedges.  Firm: Exo is a 5'-to-3'
 * double-strand-specific exonuclease that leaves 3' overhangs; Bet is a
 * single-strand annealing protein that binds those overhangs and pairs
 * them with a complementary strand; Gam inhibits RecBCD (and SbcCD), so
 * its whole job is protecting the linear DNA; recombination is
 * replication-dependent and the target is the transiently single-
 * stranded lagging-strand template.  Hedged in the captions, as the
 * field hedges it: exactly how a double-stranded cassette gets both of
 * its ends in is still a model rather than a settled fact.
 *
 * Conventions, as everywhere in these decks: 3' ends get a half barb and
 * never an arrowhead, and separate molecules keep a visible gap.
 *
 * And: G.text() writes textContent, so an HTML entity in one of these
 * labels ships to the screen as its own source.  Write the character.
 *
 * Drawing kit and the build-once-then-fade rule: seq/parts.js.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;

const S = 3.5;                               /* backbone weight */

function seg(x0, x1, y, col, w){
  return G.el("path", {d:"M"+x0+" "+y+"H"+x1, stroke:col || C.ink,
    "stroke-width":w || S, fill:"none", "stroke-linecap":"round"});
}
function path(d, col, w, dash){
  const a = {d:d, stroke:col || C.ink, "stroke-width":w || S, fill:"none",
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return G.el("path", a);
}
/* a half barb, laid back along the strand, marking a 3' end */
function barb(x, y, dir, col){
  return G.el("path", {d:"M"+(x - dir*22)+" "+(y - 13)+"L"+x+" "+y,
    stroke:col || C.ink, "stroke-width":S, fill:"none", "stroke-linecap":"round"});
}
function prime(x, y, s, anchor){
  return G.text(x, y, s, 23, C.muted, 700, anchor);
}
/* A protein.  Drawn as a lump rather than a box, because a box on a DNA
   line means a feature OF the DNA everywhere else in this deck, and
   these are things sitting on it.  Translucent, so the molecule
   underneath still reads through. */
function prot(cx, cy, rx, ry, label, col){
  const g = G.el("g", {});
  g.appendChild(G.el("ellipse", {cx:cx, cy:cy, rx:rx, ry:ry, fill:col,
    "fill-opacity":".13", stroke:col, "stroke-width":2.5}));
  g.appendChild(G.text(cx, cy + 9, label, 25, col, 700));
  return g;
}
/* Bet on single-stranded DNA: a row of subunits along the strand.  It
   oligomerises on the DNA it binds, which is why it is drawn as a chain
   of them and not as one more lump. */
function coat(x0, x1, y, col){
  const g = G.el("g", {}), step = 27;
  for (let x = x0 + 13; x <= x1 - 8; x += step)
    g.appendChild(G.el("circle", {cx:x, cy:y, r:11, fill:col,
      "fill-opacity":".16", stroke:col, "stroke-width":2.2}));
  return g;
}
function xout(cx, cy, r, col){
  return path("M"+(cx-r)+" "+(cy-r)+"L"+(cx+r)+" "+(cy+r)+
              "M"+(cx+r)+" "+(cy-r)+"L"+(cx-r)+" "+(cy+r), col || C.verm, 5);
}

/* ================================================================== *
 * 1.  lambda-red — what happens to the DNA you put in
 * ================================================================== */

const X0 = 400, X1 = 1200, CHEW = 170;   /* the donor DNA   */
const YT = 440, YB = 484;                 /* its two strands */
const GXY = 170;                          /* the gene cassette */

const FR = [
  { on:["core","ends"],
    cap:"electroporate a linear DNA into <em>E. coli</em> and it does not last long",
    call:"",
    note:"Start with what you are actually putting in the cell: a linear double-stranded DNA, blunt at both ends, with homology to the genome at each end. In yeast, or in Bacillus subtilis, you would be most of the way done. In E. coli this molecule has a short life expectancy, and the reason is the next slide's worth of the story.",
    desc:"A linear double-stranded donor DNA drawn as two parallel lines, five-prime ends labelled and three-prime ends marked with a half barb." },

  { on:["chomp","recbcd"],
    cap:"without help, <b>RecBCD</b> takes it apart from both ends",
    call:"a host exonuclease that treats a free end as damage &#183; this is most of why <em>E. coli</em> will not do this for you",
    note:"E. coli treats free double-stranded ends as damage. RecBCD, also called exonuclease five, loads on a blunt end and degrades the DNA processively from it. It is there to deal with broken chromosomes and invading phage DNA, and it cannot tell the difference between those and the cassette you spent a week making. So the first problem is not getting the recombination to happen. It is keeping the substrate alive long enough to try.",
    desc:"Two protein lumps labelled RecBCD sit on the ends of the donor DNA, which has been eaten back from both ends to a short stub." },

  { on:["core","ends","genes"],
    cap:"three genes off phage &#955;, doing three different jobs",
    call:"only one of them ever touches your DNA at both ends &#183; the other two are a bodyguard and a matchmaker",
    note:"Phage lambda has the same problem: it injects a linear genome into a cell full of RecBCD. Its solution is three genes, and it is worth being clear that they are not three versions of one activity. Gam is a bodyguard, exo is a nuclease, and bet is what actually does the recombining. Expressing all three from pKD46 is what turns E. coli into a strain you can do this in.",
    desc:"A cassette of three genes appears above the donor, labelled exo, gam and bet, marked as coming from phage lambda, with the job of each written beneath it: resects, protects, anneals." },

  { on:["core","ends","genes","gam"],
    cap:"<b>Gam</b> never touches your DNA. It binds RecBCD and switches it off",
    call:"so the molecule survives long enough for the other two to work on it",
    note:"Gam is an inhibitor of RecBCD, and of SbcCD as well. It binds the nuclease, not the DNA. That is worth saying out loud because it is the one of the three whose job is easiest to guess wrong: nothing about the donor changes on this click. All that has changed is that the enzyme which was destroying it has been taken out of service. This is also why Gam matters for a PCR product and does not matter for an oligo, which we will come back to.",
    desc:"A lump labelled Gam has appeared above each RecBCD, joined to it by an inhibition bar. The donor DNA is whole again and entirely unchanged." },

  { on:["core","ss","genes","exo"],
    cap:"<b>Exo</b> eats the 5&#8242;-ended strand in from each end, leaving a 3&#8242; single-stranded tail",
    call:"which is why a PCR product works &#183; you hand it a duplex and it makes the substrate itself",
    note:"Exo is a five-prime to three-prime exonuclease, and it only works on double-stranded DNA. It loads on an end and degrades the strand whose five-prime end is there, so on a linear duplex it eats the top strand from the left and the bottom strand from the right. What survives at each end is a single strand terminating in a three-prime end, and it is long: Exo is processive over thousands of bases. That is why a PCR product is perfectly good starting material. It is not the substrate of the reaction, but Exo turns it into one.",
    desc:"The two RecBCD lumps have been replaced by lumps labelled Exo, and the donor's strands have been eaten back from opposite ends, leaving a long single-stranded three-prime tail hanging off each end, each ending in a half barb." },

  { on:["core","ss","genes","bet"],
    cap:"<b>Bet</b> binds those tails as they come out of Exo, and holds them ready to pair",
    call:"a single-strand annealing protein &#183; it is the one that does the recombining",
    note:"Bet is a single-strand annealing protein. It binds single-stranded DNA longer than about thirty-six bases, oligomerises along it, protects it from the cell's single-strand nucleases, and then catalyses its annealing to a complementary strand. Exo and Bet work as a complex, so Bet is loaded onto the tail as it emerges rather than finding it afterwards. Of the three proteins, this is the one that actually carries out the recombination. The next slide is where it does it.",
    desc:"Chains of small subunits labelled Bet now run along both single-stranded tails of the donor." },

  { on:["circle","genes"],
    cap:"and a circle has no 5&#8242; end for Exo to start on",
    call:"so nothing happens &#183; cut it with anything first and it becomes a substrate",
    note:"The method does not work directly on circular DNAs. There is no free end for either RecBCD or Exo, which is a nice reminder of what these enzymes are for, but it means a plasmid transformed as a circle is simply inert here. Linearise it with any restriction enzyme that cuts once outside the homology and it becomes a substrate.",
    desc:"The donor DNA has been replaced by a closed circle marked with a cross: no free ends, so nothing happens to it." }
];

window.Deck.sequence("lambda-red", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const s = G.scene(slide, 792, 838);

  /* THE DONOR IS ONE DRAWING THAT LOSES TWO PIECES.
     Exo's whole effect is that the 5'-ended halves of both ends go away,
     so the resected molecule is the whole one minus those two pieces.
     Drawn that way the beat is the ends fading and nothing else moving;
     drawn as two separate pictures it was a cross-dissolve of two nearly
     identical things, which reads as a flicker rather than as an event.
     Vermillion throughout, matching the key on the next slide: red is
     the DNA you put in, whatever state it is in. */
  s.part("core", (function(){
    const g = G.el("g", {});
    g.appendChild(seg(X0 + CHEW, X1, YT, C.verm)); g.appendChild(barb(X1, YT, 1, C.verm));
    g.appendChild(seg(X0, X1 - CHEW, YB, C.verm)); g.appendChild(barb(X0, YB, -1, C.verm));
    return g;
  })());
  s.part("ends", (function(){
    const g = G.el("g", {});
    g.appendChild(seg(X0, X0 + CHEW, YT, C.verm));
    g.appendChild(seg(X1 - CHEW, X1, YB, C.verm));
    g.appendChild(prime(X0 - 14, YT + 8, "5′", "end"));
    g.appendChild(prime(X1 + 14, YB + 8, "5′", "start"));
    g.appendChild(G.text(800, 268, "your linear donor DNA", 25, C.muted, 400));
    return g;
  })());
  s.part("ss", (function(){
    const g = G.el("g", {});
    /* clear of Exo: these two marks sit exactly where the enzyme is, so
       on the line they are inside it and unreadable */
    g.appendChild(prime(X0 + CHEW, YT - 36, "5′", "middle"));
    g.appendChild(prime(X1 - CHEW, YB + 46, "5′", "middle"));
    g.appendChild(G.text(800, 268, "3′ single-stranded tails, at both ends", 25, C.verm, 700));
    return g;
  })());

  /* what is left once RecBCD has had it.  A separate drawing, because it
     is a separate outcome: this is the strain without Gam in it. */
  s.part("chomp", (function(){
    const g = G.el("g", {});
    /* the molecule that WAS there, so what has gone is visible */
    g.appendChild(path("M"+X0+" "+YT+"H"+X1, C.muted, 2.4, "3 11"));
    g.appendChild(path("M"+X0+" "+YB+"H"+X1, C.muted, 2.4, "3 11"));
    g.appendChild(seg(702, 898, YT, C.verm));
    g.appendChild(seg(702, 898, YB, C.verm));
    g.appendChild(G.text(800, 268, "degraded inwards from both ends", 25, C.verm, 700));
    return g;
  })());
  s.part("recbcd", (function(){
    const g = G.el("g", {});
    g.appendChild(prot(628, (YT+YB)/2, 66, 46, "RecBCD", C.muted));
    g.appendChild(prot(972, (YT+YB)/2, 66, 46, "RecBCD", C.muted));
    return g;
  })());

  /* Gam, sitting on the nuclease rather than on the DNA */
  s.part("gam", (function(){
    const g = G.el("g", {}), cy = (YT+YB)/2;
    [628, 972].forEach(function(cx){
      g.appendChild(prot(cx, cy, 66, 46, "RecBCD", C.muted));
      /* an inhibition bar, not a cross over the name: a cross drawn
         through the middle of a labelled blob strikes out the label */
      g.appendChild(path("M"+cx+" "+(cy-106)+"V"+(cy-58)+"M"+(cx-19)+" "+(cy-58)+
                         "H"+(cx+19), C.amber, 4));
      g.appendChild(prot(cx, cy - 140, 46, 32, "Gam", C.amber));
    });
    g.appendChild(G.text(800, 620, "the nuclease is switched off \u2014 the DNA itself is untouched", 24, C.muted));
    return g;
  })());
  s.part("exo", (function(){
    const g = G.el("g", {});
    g.appendChild(prot(X0 + CHEW, (YT+YB)/2, 58, 46, "Exo", C.verm));
    g.appendChild(prot(X1 - CHEW, (YT+YB)/2, 58, 46, "Exo", C.verm));
    return g;
  })());
  s.part("bet", (function(){
    const g = G.el("g", {});
    g.appendChild(coat(X0, X0 + CHEW, YB, C.blue));
    g.appendChild(coat(X1 - CHEW, X1, YT, C.blue));
    g.appendChild(G.text(X0 + CHEW/2, YB + 62, "Bet", 25, C.blue, 700));
    g.appendChild(G.text(X1 - CHEW/2, YT - 44, "Bet", 25, C.blue, 700));
    return g;
  })());

  /* and the thing it will not touch */
  s.part("circle", (function(){
    const g = G.el("g", {});
    g.appendChild(G.el("circle", {cx:800, cy:462, r:80, fill:"none",
      stroke:C.ink, "stroke-width":S}));
    g.appendChild(G.el("circle", {cx:800, cy:462, r:66, fill:"none",
      stroke:C.ink, "stroke-width":S}));
    g.appendChild(xout(800, 462, 76, C.verm));
    g.appendChild(G.text(800, 268, "no ends at all", 25, C.verm, 700));
    return g;
  })());

  s.part("genes", (function(){
    const g = G.el("g", {});
    g.appendChild(seg(560, 1040, GXY, C.muted));
    [[580,120,"exo",C.verm, "resects"],
     [712,120,"gam",C.amber,"protects"],
     [844,120,"bet",C.blue, "anneals"]]
      .forEach(function(f){
        g.appendChild(G.feat(f[0], GXY, f[1], f[2], f[3]));
        g.appendChild(G.text(f[0] + f[1]/2, GXY + 52, f[4], 23, C.muted));
      });
    g.appendChild(G.text(540, GXY + 9, "phage λ", 25, C.muted, 400, "end"));
    return g;
  })());
  s.finish();

  function go(i, animated){
    const f = FR[Math.max(0, Math.min(FR.length - 1, i | 0))];
    s.show(f.on, f, animated === false || reduce.matches);
  }
  go(0, false);
  return { steps: FR.map(f => ({note:f.note, desc:f.desc})), go: go };
});


/* ================================================================== *
 * 2.  red-fork — where the annealing happens, and how it finishes
 *
 * The one thing that makes the rest of this section make sense: the
 * target is not the duplex genome, it is the stretch of lagging-strand
 * template that is single-stranded until the next Okazaki fragment
 * covers it.
 *
 * HOW IT FINISHES.  JCA: "It needs to show A and B homology arms (40
 * mers) and where they live in the sequence.  It needs to explain how
 * the end gets resolved, which this one does not."  Both fair.  The
 * slide used to show one 3' tail pairing and the other "still waiting",
 * which is not an ending.
 *
 * The model it now draws is the one that fits the data best: Exo does
 * not stop at the ends, it takes ONE WHOLE STRAND off, so what Bet is
 * holding is a full-length single strand of the cassette with the A arm
 * at one end and the B arm at the other.  Both arms then find their
 * partners on the same exposed template, and what lies between them --
 * your cassette on one strand, the target on the other -- has no partner
 * and loops out.  (Mosberg, Lajoie & Church, Genetics 2010.  CHECK THIS
 * CITATION before presenting: the finding is solid, the reference is
 * from memory.)
 *
 * That ending also earns the bench rule at the end of the section: the
 * two strands at the locus now disagree, so the first colony is mixed
 * and you streak for singles before you believe anything.
 *
 * It also makes dsDNA and oligo recombineering the same reaction.  An
 * oligo IS the annealed strand; the dsDNA case just pays Exo to make one.
 * ================================================================== */

/* THE FORK RUNS RIGHT TO LEFT: the parental duplex is on the left, the
   two finished arms on the right, and the fork travels leftward into the
   unreplicated DNA.  Every polarity on the slide follows from that, so
   the direction is drawn rather than left to be inferred:

     leading   made continuously TOWARD the fork, so its 3' end is at the
               fork, on the left
     lagging   made in fragments AWAY from the fork, so each fragment's
               3' end is on its right
     the gap   between the fork and the nearest fragment, the one stretch
               of template with nothing paired to it

   The donor sits BELOW the fork rather than above it.  Above, the strand
   coming up to anneal has to cross the leading arm, which reads as a
   junction between two molecules that never touch. */
const FX = 610, SEP = 22;
const FY = 320;                      /* the parental duplex, ahead of the fork */
const UY = 228, LY = 436;            /* the two daughter arms                  */
const UT = UY + SEP/2, UN = UY - SEP/2;   /* leading: template, new strand     */
const LT = LY - SEP/2, LN = LY + SEP/2;   /* lagging: template, fragments      */
const ARM0 = 700, ARM1 = 1450;       /* how far the copied arms run            */
const BARE = 720;                    /* the exposed stretch starts here        */

/* The locus, on the exposed template.  One set of x positions, used by
   the genome, by the donor, and by the two daughters, so a part can be
   tracked straight down the slide. */
const AX = 850, AW = 80;             /* the A homology arm      */
const MX = 930, MW = 280;            /* what sits between them  */
const BX = 1210, BW = 80;            /* the B homology arm      */
const LOC0 = AX, LOC1 = BX + BW;     /* the whole of it         */
const OK0 = 1320;                    /* the nearest Okazaki fragment */
const DY = 660;                      /* the donor, waiting below     */

const RF = [
  { on:["fork","flat","bare","locus","tgt"],
    cap:"the fork leaves one stretch of template with nothing paired to it",
    call:"and the two 40 bp arms you chose are sitting right there in it",
    note:"Here is the other half of the reaction, and it is the half that usually gets left out. The genome is not a static duplex. Where a replication fork is passing, the leading-strand template is copied continuously and is duplex again almost at once, but the lagging-strand template is copied in fragments, backwards, so between the fork and the last Okazaki fragment there is always a stretch of it with no partner. Now look at what is in that stretch. The gene you want gone, and either side of it the forty bases you copied into your oligos. Those are the arms. They are not a separate thing you added to the genome; they are genome, and choosing them is choosing where in this picture your DNA is allowed to land.",
    desc:"A replication fork. The upper arm is complete duplex, its new leading strand made continuously toward the fork. The lower arm is copied in Okazaki fragments, and between the fork and the nearest fragment lies a length of bare single-stranded template, marked in amber. On that bare stretch, three regions: the A homology arm, the target gene, and the B homology arm." },

  { on:["fork","flat","bare","locus","tgt","donor"],
    cap:"and <b>Exo</b> does not stop at the ends &#8212; it takes one whole strand off",
    call:"so what Bet is holding is the entire cassette, single-stranded, with A at one end and B at the other",
    note:"Back to the molecule from the last slide. Exo is processive over thousands of bases, and the model that fits the data best is that it does not stop partway: it degrades one strand of the cassette completely. What is left is a full-length single strand, coated along its length with Bet. And look at its ends. The forty bases at one end are A, the forty at the other are B, and they are the same forty bases as the two regions on the genome above, because that is how you designed the oligos.",
    desc:"Below the fork, the donor appears as a single strand rather than a duplex, coated along its length with Bet, and bracketed into three parts: the A arm of forty base pairs, the cassette you made, and the B arm of forty base pairs, aligned with the matching regions on the genome above." },

  { on:["fork","loop","locus","annealed"],
    cap:"both arms find their partners at once, and what is between them has nowhere to go",
    call:"the target loops out of the template &#183; your cassette loops out of the new strand",
    note:"Bet pairs A with A and B with B, and because both arms are on the same single strand of the genome, both can pair at the same time. That is the whole reaction. Now follow what happens to the middle. The template between the arms still carries the target, and your strand between the arms still carries the cassette, and neither has anything to pair with, so both loop out. This is where the gene is lost: not by being cut out, but by ending up on a loop that is not going to be copied.",
    desc:"The donor strand has moved up onto the template. Its A and B arms lie paired against the genome's A and B. Between them the genome's target arcs up and away from the line, and the donor's cassette arcs down, each on its own loop with no partner." },

  { on:["daughters"],
    cap:"so the two strands at that locus now disagree",
    call:"one gets your cassette, the other keeps the gene &#183; so streak for singles before you believe anything",
    note:"And here is the ending. The strand Bet annealed becomes the new strand, joined up to the Okazaki fragments either side of it, and the template it is paired with still carries the target. The two strands of that one duplex disagree with each other. When the cell divides, they separate, and only one of the two chromosomes has your cassette in it. Two practical things come out of that. The colony you pick off the selection plate is a mixture, so you streak for single colonies before you trust any of it. And all of this only happens where a fork is passing, which is why this is done on cells in mid-log growth and does not work on a culture that has stopped.",
    desc:"The fork has gone. In its place, the same locus drawn twice: one chromosome carrying the A arm, your cassette and the B arm, and the other carrying the A arm, the original target gene and the B arm." },

  { on:["fork","flat","bare","locus","oligo"],
    cap:"which is why a plain oligo is enough",
    call:"no Exo needed, and no Gam either &#183; RecBCD needs a double-stranded end and an oligo does not give it one",
    note:"Follow that through and the practical rule falls out. If the thing that recombines is a coated single strand, then handing the cell a single strand directly skips two of the three proteins. No Exo, because there is nothing to resect. No Gam, because RecBCD needs a double-stranded end to load on. Just Bet. So for a point mutation you can skip the PCR entirely and electroporate a seventy-mer with the change in the middle of it. The oligo is not immortal, the cell's single-strand exonucleases will get it eventually, which is why some protocols order the last few linkages as phosphorothioates. And there is a catch worth knowing: of the two oligos you could order, the one that anneals to the lagging-strand template works far better, often by ten to thirty fold, because that is the template that is exposed. Same change, same locus, one strand or the other, and an order of magnitude between them.",
    desc:"The donor has been replaced by a short oligonucleotide annealed to the same exposed template, with a cross marking the single base where it disagrees with the genome." }
];

window.Deck.sequence("red-fork", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const s = G.scene(slide, 800, 846);

  /* What the three colours mean.  Without this the slide is black, blue
     and red lines and the room is guessing which is whose. */
  s.add((function(){
    const g = G.el("g", {}), x = 150;
    [[C.ink,  "the chromosome"],
     [C.blue, "new DNA the cell is making"],
     [C.verm, "the DNA you put in"]].forEach(function(r, k){
      const y = 560 + k*36;
      g.appendChild(seg(x, x + 38, y - 8, r[0]));
      g.appendChild(G.text(x + 52, y, r[1], 23, C.muted, 400, "start"));
    });
    return g;
  })());

  s.part("fork", (function(){
    const g = G.el("g", {});
    /* the parental duplex, and the two templates peeling apart.  The
       lagging template stops short of the locus and picks up after it,
       because on one beat its middle is up in a loop. */
    g.appendChild(path("M150 "+(FY-SEP/2)+"H"+FX+"Q"+(FX+60)+" "+(FY-SEP/2)+" "+ARM0+" "+UT+"H"+ARM1));
    g.appendChild(path("M150 "+(FY+SEP/2)+"H"+FX+"Q"+(FX+60)+" "+(FY+SEP/2)+" "+ARM0+" "+LT+"H"+MX));
    g.appendChild(seg(BX, ARM1, LT));

    /* which way it is going, because everything else depends on it */
    g.appendChild(path("M580 250H400M424 236L400 250L424 264", C.muted, 3));
    g.appendChild(G.text(490, 222, "the fork moves this way", 23, C.muted));
    g.appendChild(G.text(300, FY + 54, "not copied yet", 23, C.muted));
    g.appendChild(G.text(FX + 6, FY + 54, "fork", 23, C.muted, 700, "start"));

    /* leading: one continuous strand, its 3' end up against the fork */
    g.appendChild(seg(ARM0 + 16, ARM1, UN, C.blue));
    g.appendChild(barb(ARM0 + 16, UN, -1, C.blue));
    g.appendChild(G.text(ARM0 + 30, UN - 26, "leading strand · one piece, made toward the fork",
      23, C.muted, 400, "start"));

    /* lagging: fragments, each made away from the fork */
    [[OK0, 1390], [1410, ARM1]].forEach(function(f){
      g.appendChild(seg(f[0], f[1], LN, C.blue));
      g.appendChild(barb(f[1], LN, 1, C.blue));
    });
    g.appendChild(G.text(ARM1, LN + 76, "Okazaki fragments", 23, C.muted, 400, "end"));
    return g;
  })());

  /* the lagging template's middle: flat while nothing is paired to it,
     and arced up out of the way once the donor takes its place */
  s.part("flat", seg(MX, BX, LT));
  s.part("loop", (function(){
    const g = G.el("g", {});
    g.appendChild(path("M"+MX+" "+LT+"C"+(MX+40)+" "+(LT-116)+" "+(BX-40)+" "+(LT-116)+" "+BX+" "+LT));
    /* clear of the arc: its apex is at LT-87, so anything below that is
       drawn through by the curve it belongs to */
    g.appendChild(G.text((MX+BX)/2, LT - 112, "target", 24, C.ink, 700));
    return g;
  })());

  s.part("bare", (function(){
    const g = G.el("g", {});
    g.appendChild(seg(BARE, OK0 - 10, LT, C.amber, 8));
    g.appendChild(G.text(BARE + 6, LT + 46, "single-stranded", 23, C.amber, 700, "start"));
    return g;
  })());

  /* where A and B live: on the genome, either side of the target */
  s.part("locus", (function(){
    const g = G.el("g", {});
    g.appendChild(G.feat(AX, LT, AW, "A", C.amber));
    g.appendChild(G.feat(BX, LT, BW, "B", C.amber));
    g.appendChild(G.text(AX + AW/2, LT - 34, "40 bp", 22, C.amber, 700));
    g.appendChild(G.text(BX + BW/2, LT - 34, "40 bp", 22, C.amber, 700));
    return g;
  })());
  s.part("tgt", G.feat(MX + 10, LT, MW - 20, "target", C.ink));

  /* the donor: one full-length single strand, bracketed rather than
     boxed so the Bet subunits along it stay visible */
  s.part("donor", (function(){
    const g = G.el("g", {});
    g.appendChild(seg(AX, LOC1, DY, C.verm));
    g.appendChild(barb(LOC1, DY, 1, C.verm));
    g.appendChild(coat(AX, LOC1, DY, C.blue));
    [[AX, AX+AW, "A · 40 bp"], [MX, BX, "your cassette"],
     [BX, LOC1, "B · 40 bp"]].forEach(function(b){
      g.appendChild(path("M"+b[0]+" "+(DY-26)+"V"+(DY-39)+"H"+b[1]+"V"+(DY-26)+"", C.verm, 2.4));
      g.appendChild(G.text((b[0]+b[1])/2, DY - 50, b[2], 22, C.verm, 700));
    });
    g.appendChild(G.text((AX+LOC1)/2, DY + 58, "one whole strand, coated with Bet", 25, C.muted, 400));
    return g;
  })());

  /* both arms paired, the cassette looping out below */
  s.part("annealed", (function(){
    const g = G.el("g", {});
    g.appendChild(seg(AX, MX, LN, C.verm));
    g.appendChild(seg(BX, LOC1, LN, C.verm));
    g.appendChild(barb(LOC1, LN, 1, C.verm));
    g.appendChild(path("M"+MX+" "+LN+"C"+(MX+40)+" "+(LN+116)+" "+(BX-40)+" "+(LN+116)+" "+BX+" "+LN, C.verm));
    g.appendChild(G.text((MX+BX)/2, LN + 104, "your cassette", 24, C.verm, 700));
    g.appendChild(G.text(AX + AW/2, LN + 32, "A", 23, C.verm, 700));
    g.appendChild(G.text(BX + BW/2, LN + 32, "B", 23, C.verm, 700));
    return g;
  })());

  /* an oligo: the annealed strand and nothing else */
  s.part("oligo", (function(){
    const g = G.el("g", {}), x0 = MX + 20, x1 = BX - 20, mid = (x0+x1)/2;
    g.appendChild(seg(x0, x1, LN, C.verm));
    g.appendChild(barb(x1, LN, 1, C.verm));
    /* no Bet along it: by the time it is paired Bet has done its job, and
       the coat is exactly what the mismatch mark would get lost among */
    g.appendChild(xout(mid, LN, 10, C.verm));
    g.appendChild(G.text(mid, LN + 44, "a 70-mer · the cross is the base you are changing", 23, C.verm, 700));
    return g;
  })());

  /* how it ends: the same locus, twice, once per daughter */
  s.part("daughters", (function(){
    const g = G.el("g", {});
    [[330, C.verm, "your cassette", "one daughter chromosome"],
     [560, C.ink,  "target",        "the other"]].forEach(function(r){
      g.appendChild(seg(560, 1420, r[0]));
      g.appendChild(G.feat(AX, r[0], AW, "A", C.amber));
      g.appendChild(G.feat(MX + 10, r[0], MW - 20, r[2], r[1]));
      g.appendChild(G.feat(BX, r[0], BW, "B", C.amber));
      g.appendChild(G.text(560, r[0] - 42, r[3], 25, C.muted, 400, "start"));
    });
    g.appendChild(path("M760 372V518M746 496L760 520L774 496", C.muted, 3));
    g.appendChild(G.text(790, 452, "they separate when the cell divides", 24, C.muted, 400, "start"));
    return g;
  })());
  s.finish();

  function go(i, animated){
    const f = RF[Math.max(0, Math.min(RF.length - 1, i | 0))];
    s.show(f.on, f, animated === false || reduce.matches);
  }
  go(0, false);
  return { steps: RF.map(f => ({note:f.note, desc:f.desc})), go: go };
});
})();
