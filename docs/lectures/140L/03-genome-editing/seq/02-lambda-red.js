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
  { on:["donor"],
    cap:"electroporate a linear DNA into <em>E. coli</em> and it does not last long",
    call:"",
    note:"Start with what you are actually putting in the cell: a linear double-stranded DNA, blunt at both ends, with homology to the genome at each end. In yeast, or in Bacillus subtilis, you would be most of the way done. In E. coli this molecule has a short life expectancy, and the reason is the next slide's worth of the story.",
    desc:"A linear double-stranded donor DNA drawn as two parallel lines, five-prime ends labelled and three-prime ends marked with a half barb." },

  { on:["chomp","recbcd"],
    cap:"<b>RecBCD</b> is a host exonuclease that takes linear DNA apart from the ends",
    call:"which is most of the reason <em>E. coli</em> will not do this reaction for you",
    note:"E. coli treats free double-stranded ends as damage. RecBCD, also called exonuclease five, loads on a blunt end and degrades the DNA processively from it. It is there to deal with broken chromosomes and invading phage DNA, and it cannot tell the difference between those and the cassette you spent a week making. So the first problem is not getting the recombination to happen. It is keeping the substrate alive long enough to try.",
    desc:"Two protein lumps labelled RecBCD sit on the ends of the donor DNA, which has been eaten back from both ends to a short stub." },

  { on:["donor","genes"],
    cap:"three genes off phage &#955;, doing three different jobs",
    call:"only one of them ever touches your DNA at both ends &#183; the other two are a bodyguard and a matchmaker",
    note:"Phage lambda has the same problem: it injects a linear genome into a cell full of RecBCD. Its solution is three genes, and it is worth being clear that they are not three versions of one activity. Gam is a bodyguard, exo is a nuclease, and bet is what actually does the recombining. Expressing all three from pKD46 is what turns E. coli into a strain you can do this in.",
    desc:"A cassette of three genes appears above the donor, labelled exo, gam and bet, marked as coming from phage lambda, with the job of each written beneath it: resects, protects, anneals." },

  { on:["donor","genes","gam"],
    cap:"<b>Gam</b> never touches your DNA. It binds RecBCD and switches it off",
    call:"so the molecule survives long enough for the other two to work on it",
    note:"Gam is an inhibitor of RecBCD, and of SbcCD as well. It binds the nuclease, not the DNA. That is worth saying out loud because it is the one of the three whose job is easiest to guess wrong: nothing about the donor changes on this click. All that has changed is that the enzyme which was destroying it has been taken out of service. This is also why Gam matters for a PCR product and does not matter for an oligo, which we will come back to.",
    desc:"A lump labelled Gam has appeared above each RecBCD, joined to it by an inhibition bar. The donor DNA is whole again and entirely unchanged." },

  { on:["chewed","genes","exo"],
    cap:"<b>Exo</b> eats the 5&#8242;-ended strand in from each end, leaving a 3&#8242; single-stranded tail",
    call:"which is why a PCR product works &#183; you hand it a duplex and it makes the substrate itself",
    note:"Exo is a five-prime to three-prime exonuclease, and it only works on double-stranded DNA. It loads on an end and degrades the strand whose five-prime end is there, so on a linear duplex it eats the top strand from the left and the bottom strand from the right. What survives at each end is a single strand terminating in a three-prime end, and it is long: Exo is processive over thousands of bases. That is why a PCR product is perfectly good starting material. It is not the substrate of the reaction, but Exo turns it into one.",
    desc:"The two RecBCD lumps have been replaced by lumps labelled Exo, and the donor's strands have been eaten back from opposite ends, leaving a long single-stranded three-prime tail hanging off each end, each ending in a half barb." },

  { on:["chewed","genes","bet"],
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

  /* the donor, whole */
  s.part("donor", (function(){
    const g = G.el("g", {});
    g.appendChild(seg(X0, X1, YT));  g.appendChild(barb(X1, YT, 1));
    g.appendChild(seg(X0, X1, YB));  g.appendChild(barb(X0, YB, -1));
    g.appendChild(prime(X0 - 14, YT + 8, "5′", "end"));
    g.appendChild(prime(X1 + 14, YB + 8, "5′", "start"));
    g.appendChild(G.text(800, 268, "your linear donor DNA", 25, C.muted, 400));
    return g;
  })());

  /* what is left of it once RecBCD has had it */
  s.part("chomp", (function(){
    const g = G.el("g", {});
    /* the molecule that WAS there, so what has gone is visible: without
       it the drawing is a short piece of DNA between two enzymes and
       says nothing about what they did to it */
    g.appendChild(path("M"+X0+" "+YT+"H"+X1, C.muted, 2.4, "3 11"));
    g.appendChild(path("M"+X0+" "+YB+"H"+X1, C.muted, 2.4, "3 11"));
    g.appendChild(seg(702, 898, YT));
    g.appendChild(seg(702, 898, YB));
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
    g.appendChild(G.text(800, 620, "the nuclease is switched off — the DNA itself is untouched", 24, C.muted));
    return g;
  })());

  /* the donor, chewed: top eaten from the left, bottom from the right */
  s.part("chewed", (function(){
    const g = G.el("g", {});
    g.appendChild(seg(X0 + CHEW, X1, YT, C.verm)); g.appendChild(barb(X1, YT, 1, C.verm));
    g.appendChild(seg(X0, X1 - CHEW, YB, C.verm)); g.appendChild(barb(X0, YB, -1, C.verm));
    g.appendChild(prime(X0 + CHEW - 14, YT + 8, "5′", "end"));
    g.appendChild(prime(X1 - CHEW + 14, YB + 8, "5′", "start"));
    g.appendChild(G.text(800, 268, "3′ single-stranded tails, at both ends", 25, C.verm, 700));
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
    g.appendChild(xout(800, 462, 102, C.verm));
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
 * 2.  red-fork — where the annealing actually happens
 *
 * The one thing that makes the rest of this section make sense: the
 * target is not the duplex genome, it is the stretch of lagging-strand
 * template that is single-stranded for as long as it takes the next
 * Okazaki fragment to cover it.  Everything practical falls out of that
 * -- why an oligo needs no Exo and no Gam, why one of the two oligos
 * beats the other by more than an order of magnitude, and why you have
 * to be growing the cells.
 * ================================================================== */

const FX = 610, SEP = 22;            /* where the strands part, and their spacing */
const FY = 480;                      /* the parental duplex               */
const UY = 376, LY = 584;            /* the two daughter arms             */
const UT = UY + SEP/2, UN = UY - SEP/2;   /* leading: template, new strand */
const LT = LY - SEP/2, LN = LY + SEP/2;   /* lagging: template, fragments  */
const GAP0 = 800, GAP1 = 1120;       /* the stretch with no partner yet   */
const DX0 = 420, DX1 = 1180, DY = 250;    /* the donor, waiting above     */

const RF = [
  { on:["fork","bare"],
    cap:"meanwhile the genome is being copied",
    call:"and a replication fork leaves one of the two templates bare for a moment",
    note:"Here is the other half of the reaction, and it is the half that is usually left out. The genome is not a static duplex. Where a replication fork is passing, the two parental strands are separated, and the two sides are not treated alike. The leading-strand template is copied continuously and is duplex again almost at once. The lagging-strand template is copied in fragments, backwards, so between the fork and the last Okazaki fragment there is always a stretch of it with no partner. That stretch is single-stranded DNA sitting in the genome, and it is there for as long as it takes the next fragment to be made.",
    desc:"A replication fork: a parental duplex arriving from the left and splitting into two arms. The upper arm is complete duplex, labelled leading. The lower arm has its new strand made in short Okazaki fragments, with a length of bare single-stranded template between the fork and the nearest fragment." },

  { on:["fork","bare","donor"],
    cap:"and this is what Bet is holding",
    call:"a long 3&#8242; single strand, coated, and complementary to that bare stretch",
    note:"And this is the molecule from the last slide: a long three-prime single strand with Bet along it. Put the two pictures next to each other and the reaction is nearly obvious. Bet is holding a single strand. The fork has just exposed a single strand. The forty bases you chose make them complementary.",
    desc:"The resected donor from the previous slide appears above the fork, its three-prime single-stranded tail coated with Bet." },

  { on:["fork","annealed"],
    cap:"Bet pairs it with the exposed template, and the fork carries on over it",
    call:"so the change ends up in one of the two daughter chromosomes",
    note:"Bet anneals the strand it is holding to the complementary bare template, and from there the cell does the rest: the next round of synthesis copies the new strand as though it belonged there. Notice the two consequences. The recombinant appears in one daughter chromosome and not the other, so the colony you pick has to be purified. And the whole thing is replication-dependent, which is why this is done on cells in mid-log growth and why it does not work on a culture that has stopped.",
    desc:"The donor's coated strand has moved down and paired with the bare stretch of lagging-strand template, becoming part of that arm of the fork." },

  { on:["fork","oligo"],
    cap:"which is why a plain oligo is enough",
    call:"no Exo needed, and no Gam either &#183; RecBCD does not eat single strands",
    note:"Follow that through and the practical rule falls out. If the recombinagenic species is a coated single strand, then handing the cell a single strand directly skips two of the three proteins. No Exo, because there is nothing to resect. No Gam, because RecBCD needs a double-stranded end to load on and an oligo does not give it one. Just Bet. The oligo is not immortal — the cell's single-strand exonucleases will get it eventually, which is why some protocols order the last few linkages as phosphorothioates — but it does not need protecting from RecBCD. So for a point mutation or a small insertion you can skip the PCR entirely and electroporate a seventy-mer. And there is a catch worth knowing: of the two oligos you could order, the one that anneals to the lagging-strand template works far better, often by ten to thirty fold, because that is the template that is exposed. Same change, same locus, one strand or the other, and an order of magnitude between them.",
    desc:"The donor has been replaced by a single short oligonucleotide, coated with Bet, annealed at the same place on the lagging-strand template." }
];

window.Deck.sequence("red-fork", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const s = G.scene(slide, 800, 846);

  s.part("fork", (function(){
    const g = G.el("g", {});
    /* The fork runs right to left: the parental duplex is on the left,
       the two finished arms on the right.  Everything about the polarity
       follows from that.  The leading strand is made continuously TOWARD
       the fork, so its 3' end is at the fork.  The lagging strand is made
       in fragments AWAY from it, so each fragment's 3' end points right,
       and the stretch between the fork and the nearest fragment has no
       partner at all.  That stretch is the whole point of the slide. */
    g.appendChild(path("M150 "+(FY-SEP/2)+"H"+FX+"Q"+(FX+66)+" "+(FY-SEP/2)+" "+
      (FX+110)+" "+UT+"H1430"));
    g.appendChild(path("M150 "+(FY+SEP/2)+"H"+FX+"Q"+(FX+66)+" "+(FY+SEP/2)+" "+
      (FX+110)+" "+LT+"H1430"));

    g.appendChild(seg(FX + 126, 1430, UN, C.blue));
    g.appendChild(barb(FX + 126, UN, -1, C.blue));
    g.appendChild(G.text(1430, UN - 30, "leading \u00b7 copied continuously, toward the fork",
      23, C.muted, 400, "end"));

    [[GAP1, 1250], [1274, 1430]].forEach(function(f){
      g.appendChild(seg(f[0], f[1], LN, C.blue));
      g.appendChild(barb(f[1], LN, 1, C.blue));
    });
    g.appendChild(G.text(1430, LN + 66, "lagging \u00b7 copied in fragments, away from it",
      23, C.muted, 400, "end"));

    g.appendChild(G.text(150, FY - 34, "genome", 25, C.muted, 400, "start"));
    g.appendChild(G.text(FX - 16, FY + 56, "fork", 23, C.muted, 400, "end"));
    return g;
  })());

  /* Its own part, because it stops being true the moment the donor
     anneals to it: leaving the highlight up through the last two beats
     would have the slide contradicting itself. */
  s.part("bare", (function(){
    const g = G.el("g", {});
    /* drawn as itself rather than boxed: a dashed box round a line reads
       as an annotation, and this is the molecule */
    g.appendChild(seg(GAP0, GAP1, LT, C.amber, 8));
    g.appendChild(G.text((GAP0+GAP1)/2, LT - 30, "no partner yet", 24, C.amber, 700));
    return g;
  })());

  /* the resected donor, waiting above */
  s.part("donor", (function(){
    const g = G.el("g", {});
    g.appendChild(seg(DX0 + 170, DX1, DY, C.verm));      g.appendChild(barb(DX1, DY, 1, C.verm));
    g.appendChild(seg(DX0, DX1 - 170, DY + 44, C.verm)); g.appendChild(barb(DX0, DY + 44, -1, C.verm));
    g.appendChild(coat(DX0, DX0 + 170, DY + 44, C.blue));
    g.appendChild(coat(DX1 - 170, DX1, DY, C.blue));
    g.appendChild(G.text(800, DY - 48, "the strand Bet is holding", 25, C.muted, 400));
    return g;
  })());

  /* the same strand, paired with the bare template.  It sits where an
     Okazaki fragment would sit, because that is what it is standing in
     for, and its 3' end points the same way as theirs. */
  function paired(x0, x1, label){
    const g = G.el("g", {});
    g.appendChild(seg(x0, x1, LN, C.verm));
    g.appendChild(barb(x1, LN, 1, C.verm));
    g.appendChild(coat(x0, x1, LN, C.blue));
    g.appendChild(G.text((x0+x1)/2, LN + 52, label, 25, C.verm, 700));
    return g;
  }
  s.part("annealed", paired(GAP0, GAP1, "your strand, annealed"));
  s.part("oligo", paired(GAP0 + 74, GAP1 - 44, "a 70-mer, and nothing else"));
  s.finish();

  function go(i, animated){
    const f = RF[Math.max(0, Math.min(RF.length - 1, i | 0))];
    s.show(f.on, f, animated === false || reduce.matches);
  }
  go(0, false);
  return { steps: RF.map(f => ({note:f.note, desc:f.desc})), go: go };
});
})();
