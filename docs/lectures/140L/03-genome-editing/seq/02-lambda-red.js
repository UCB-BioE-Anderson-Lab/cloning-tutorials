/* ------------------------------------------------------------------ *
 * 02-lambda-red.js — what lambda Red is and what it will accept.
 *
 * This was six bullets and no picture, which is the wrong shape for it:
 * five of the six are about a molecule's ENDS, and the sixth -- that it
 * does nothing to a circle -- is a rule you have to take on trust when it
 * is written down and is obvious the moment you draw one.  A circle has
 * no 5' end, so Exo has nowhere to start.
 *
 * Five beats on one scene: the donor DNA above, the genome below.
 *
 * Conventions, as everywhere in these decks: 3' ends get a half barb and
 * never an arrowhead, and separate molecules keep a visible gap.  Exo is
 * a 5'-to-3' exonuclease, so it eats the top strand from the left and the
 * bottom strand from the right, which is why both surviving ends are 3'.
 *
 * Drawing kit and the build-once-then-fade rule: seq/parts.js.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;

const X0 = 430, X1 = 1170, CHEW = 150;      /* the donor DNA          */
const YT = 322, YB = 366;                    /* its two strands        */
const GY = 654, GX0 = 150, GX1 = 1450;       /* the genome             */
const TX = 690, TW = 220;                    /* the target on it       */

const S = 3.5;                               /* backbone weight        */
function seg(x0, x1, y, col){
  return G.el("path", {d:"M"+x0+" "+y+"H"+x1, stroke:col || C.ink,
    "stroke-width":S, fill:"none", "stroke-linecap":"round"});
}
/* a half barb, laid back along the strand, marking a 3' end */
function barb(x, y, dir, col){
  return G.el("path", {d:"M"+(x - dir*22)+" "+(y - 13)+"L"+x+" "+y,
    stroke:col || C.ink, "stroke-width":S, fill:"none", "stroke-linecap":"round"});
}
function prime(x, y, s, anchor){
  return G.text(x, y, s, 23, C.muted, 700, anchor);
}

const FR = [
  { on:["donor","target"],
    cap:"<em>E. coli</em> on its own barely recombines these at all",
    call:"unlike yeast, or <em>B. subtilis</em>, where this works out of the box",
    note:"In E. coli and other bacteria that lack efficient homologous recombination systems, a linear DNA with homology to the genome mostly just sits there and gets degraded. Yeast will do this reaction for you; E. coli will not.",
    desc:"A linear double-stranded donor DNA drawn above, and the genome below it with a target region marked. Nothing is happening between them." },
  { on:["donor","target","genes"],
    cap:"three genes off phage lambda change that: <b>exo</b>, <b>gam</b>, <b>bet</b>",
    call:"",
    note:"Expression of the phage lambda Red genes, exo, gam and bet, enhances recombination dramatically. This is the functionality that lets you do knockins and knockouts in a prokaryotic genome at all.",
    desc:"A small cassette of three genes appears above the donor DNA, labelled exo, gam and bet, and marked as coming from phage lambda." },
  { on:["chewed","target","genes"],
    cap:"<b>Exo</b> eats 5&#8242; ends, so what is left hanging off each end is a 3&#8242; single strand",
    call:"which is why a PCR product works &#183; you hand it a duplex and it makes the substrate itself",
    note:"Exo is a five-prime to three-prime exonuclease. On a linear duplex it eats the top strand from the left and the bottom strand from the right, and what survives at each end is the strand terminating in a three-prime end. That is why a PCR product is a perfectly good starting material: Exo converts it into the thing the reaction actually wants.",
    desc:"The donor's two strands have been eaten back from opposite ends, leaving a long single-stranded three-prime tail hanging off each end of the molecule, each ending in a half barb." },
  { on:["chewed","target","genes","anneal"],
    cap:"and a single strand is what actually recombines",
    call:"so an oligonucleotide works just as well &#183; no PCR needed if you only want a small change",
    note:"Mechanistically, the recombinagenic species is linear single-stranded DNA. Bet loads it onto the homologous sequence at the replication fork. And that has a practical consequence worth saying out loud: if the change you want is small enough to fit on an oligo, you can skip the PCR entirely and just transform the oligo.",
    desc:"One of the single-stranded tails has moved down and paired with the target region on the genome." },
  { on:["circle","target","genes"],
    cap:"a circle has no 5&#8242; end for Exo to start on",
    call:"so it does nothing &#183; cut it with anything first and it becomes a substrate",
    note:"The method does not work directly on circular DNAs. There is no free five-prime end for Exo to begin at. But linear DNAs can be generated from circular ones by treatment with any of the various restriction enzymes, so this is a thing to remember rather than a thing to worry about.",
    desc:"The donor DNA has been replaced by a closed circle, marked with a cross: Exo has no end to start from, so nothing happens to it." }
];

window.Deck.sequence("lambda-red", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const s = G.scene(slide, 792, 838);

  /* the genome, always */
  s.add(seg(GX0, GX1, GY));
  s.add(G.text(GX0, GY + 42, "Genome", 25, C.muted, 400, "start"));
  s.part("target", G.feat(TX, GY, TW, "target", C.ink));

  /* the donor, whole */
  s.part("donor", (function(){
    const g = G.el("g", {});
    g.appendChild(seg(X0, X1, YT));  g.appendChild(barb(X1, YT, 1));
    g.appendChild(seg(X0, X1, YB));  g.appendChild(barb(X0, YB, -1));
    g.appendChild(prime(X0 - 14, YT + 8, "5′", "end"));
    g.appendChild(prime(X1 + 14, YB + 8, "5′", "start"));
    g.appendChild(G.text(800, 258, "a linear donor DNA", 25, C.muted, 400));
    return g;
  })());

  /* the donor, chewed: top eaten from the left, bottom from the right */
  s.part("chewed", (function(){
    const g = G.el("g", {});
    g.appendChild(seg(X0 + CHEW, X1, YT, C.verm)); g.appendChild(barb(X1, YT, 1, C.verm));
    g.appendChild(seg(X0, X1 - CHEW, YB, C.verm)); g.appendChild(barb(X0, YB, -1, C.verm));
    g.appendChild(prime(X0 + CHEW - 14, YT + 8, "5′", "end"));
    g.appendChild(prime(X1 - CHEW + 14, YB + 8, "5′", "start"));
    g.appendChild(G.text(800, 258, "3′ single-stranded tails, at both ends", 25, C.verm, 700));
    return g;
  })());

  /* the strand that has found its match on the genome */
  s.part("anneal", (function(){
    const g = G.el("g", {});
    g.appendChild(G.el("path", {d:"M"+(X0)+" "+YB+"C"+(X0-60)+" 500 "+(TX-60)+" 560 "+TX+" "+(GY-13),
      stroke:C.verm, "stroke-width":S, fill:"none", "stroke-linecap":"round",
      "stroke-dasharray":"1 14", "stroke-linejoin":"round"}));
    g.appendChild(seg(TX, TX + TW, GY - 13, C.verm));
    g.appendChild(barb(TX + TW, GY - 13, 1, C.verm));
    return g;
  })());

  /* and the thing it will not touch */
  s.part("circle", (function(){
    const g = G.el("g", {});
    g.appendChild(G.el("circle", {cx:800, cy:344, r:78, fill:"none",
      stroke:C.ink, "stroke-width":S}));
    g.appendChild(G.el("circle", {cx:800, cy:344, r:64, fill:"none",
      stroke:C.ink, "stroke-width":S}));
    g.appendChild(G.el("path", {d:"M700 244L900 444M900 244L700 444",
      stroke:C.verm, "stroke-width":5, fill:"none", "stroke-linecap":"round"}));
    g.appendChild(G.text(800, 258, "no ends at all", 25, C.verm, 700));
    return g;
  })());

  s.part("genes", (function(){
    const g = G.el("g", {});
    g.appendChild(seg(560, 1040, 170, C.muted));
    [[580,120,"exo",C.verm],[712,120,"gam",C.blue],[844,120,"bet",C.blue]]
      .forEach(f => g.appendChild(G.feat(f[0], 170, f[1], f[2], f[3])));
    g.appendChild(G.text(540, 179, "phage λ", 25, C.muted, 400, "end"));
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
})();
