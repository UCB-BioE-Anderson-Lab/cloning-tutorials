/* ------------------------------------------------------------------ *
 * 35-mmcrispri.js : mismatch-CRISPRi, drawn.  NEW SLIDE.
 *
 * Registers:  mmcrispri
 *
 * WHY THIS SLIDE EXISTS.  It replaces the TRMR slide (source 35) on
 * JCA's instruction of 2026-11-16: "I think we should replace trmr
 * with something more modern, and name the techniques on the slide
 * very briefly explaining the distinctions.  But generally, focus on
 * explaining just one graphically and showing some data about what
 * comes from it."
 *
 * WHY MISMATCH-CRISPRi IS THE ONE EXPLAINED.  TRMR's distinctive move
 * was not knocking genes out, it was turning them UP AND DOWN.
 * Mismatch-CRISPRi is that same operation with a modern tool, and it
 * is the only one of the four named here that gives you a DIAL rather
 * than a switch.  It also produces exactly the object lecture 11 spent
 * a slide on -- a transfer function, expression in, phenotype out --
 * which is why the data slide that follows lands as hard as it does.
 *
 * SCOPE.  Two slides, not three.  JCA asked on 2026-11-16 how much
 * time this idea is worth relative to the rest of the lecture; the
 * answer was that an application in this deck gets one or two slides
 * (SHAPE-seq 2, one-hybrid 2, phage display 1, SELEX 1), and the
 * section being replaced was the thinnest in the lecture.  So the
 * naming of the space is FURNITURE along the bottom of this slide, not
 * a slide of its own.
 *
 * EVERY NUMBER HERE IS THE PAPER'S.  Hawkins et al., Cell Systems
 * 2020, PMID 33080209, read from the PMC full text (PMC7704046):
 *   - seed = the 7 PAM-proximal bases, middle = the next 5, distal =
 *     the final 8.  Their definition, Figure 1C, verbatim.
 *   - single mismatches give "the full range of repression (no
 *     efficacy to same efficacy as fully complementary)".
 *   - the essential-gene libraries: each gene targeted by 100 sgRNAs,
 *     10 fully matched guides each with 9 singly mismatched variants,
 *     >30,000 elements, ~300 essential genes per species.
 *   - grown 10 doublings, held in exponential phase.
 *   - 1,000 non-targeting control sgRNAs; their fitness SD was 0.0825
 *     in E. coli and 0.0444 in B. subtilis, so 5-10% growth defects
 *     resolve.
 * The activity-by-position bars are SCHEMATIC -- the shape of their
 * Figure 1C, not its values -- and the slide says so in small print.
 * Do not quote numbers off those bars.
 *
 * Authored at 1480x600 -- see LAYOUT below.
 *
 * STYLE AUDIT, 2026-11-17.  Four palette faults were found and fixed:
 * five invented pale tints (#eef2f6, #e7eef4, #f6f2e2, #f7e8e2,
 * #eceff2) became --paper or --rule, which is what the contract says a
 * fill lighter than its stroke may be; the three region cells were
 * tinted one hue each, which is an identity map, and are now all
 * white, with the regions named by their brackets as they already
 * were; the activity bars were drawn in three hues at opacity 0.78 --
 * a hue per region AND a pale tint of each -- and are now one solid
 * ink series, since they are one quantity; and amber, the rung the
 * guide says is almost never reached, is gone.  Only the seed bracket
 * is promoted, to vermillion, because the seed is what the band is
 * about.  The small print was 17px and is now 19px, the floor.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", BLUE = "#004373",
      MUTED = "#767676", RULE = "#e2e2e2", PAPER = "#ffffff";
const n2 = v => Math.round(v * 10) / 10;

/* ---- LAYOUT -------------------------------------------------------- *
 * Authored at 1480x600, an aspect of 2.47, which is what is actually
 * free on a .slide once the h1 and the sub line are out of it
 * (1600-220 wide by about 560 high).  The first cut was 1420x720 and
 * fitted by HEIGHT, so the drawing sat in a narrow band with slack
 * down both sides while its own text collided in the middle.  If the
 * header on this slide ever changes height, this number changes too.
 *
 *   band A  y  30-330   the molecule, and the dial
 *   band B  y 370-430   the pooled experiment, as a pipeline
 *   band C  y 470-570   the strip that names the space
 * ------------------------------------------------------------------ */

/* ---- band A, left: dCas9 sitting on the DNA ------------------------ *
 * REDRAWN 2026-11-17.  JCA: "that graphic is incomprehensible.  I think
 * you need to show the dna where the rnap binds, where the grna anneals
 * (the protospacer) and show dcas9.grna sitting above it."  He was
 * right.  The first version drew the gene as a block arrow, stopped the
 * DNA duplex dead where that arrow began, and floated RNAP and dCas9 on
 * top of it as two ellipses with a red bar between them.  So the one
 * thing the slide is about -- WHERE on the DNA the guide anneals -- was
 * not drawn at all, and the duplex disappeared exactly where it was
 * needed.
 *
 * Now: one continuous duplex across the whole width; the promoter and
 * RNAP at the left, on it; the protospacer marked as a stretch OF the
 * duplex with its PAM immediately 3' of it; and dCas9 above, holding
 * the sgRNA, whose spacer lies along the protospacer with base-pairing
 * ticks drawn between them.  RNAP's transcript runs out and stops
 * against dCas9, which is the actual mechanism -- a roadblock to
 * elongation, not a cut.
 *
 * ORIENTATION IS LOad-BEARING, because the dial to the right of this
 * drawing is numbered from the PAM.  The sgRNA spacer runs 5' at the
 * left to 3' at the right, so its 3' end -- the seed -- sits against
 * the PAM, which is where the dial puts it too.  The 3' end carries a
 * HALF barb, not a full arrowhead, per house convention for nucleic
 * acid ends.
 * -------------------------------------------------------------------- */
function molecular(){
  /* band A runs y 30-340 and the dial starts at x 580, so this drawing
     gets the whole of x 30-560 and most of the height.  The first cut
     used half of it and everything collided. */
  const TOP = 266, BOT = 294;            /* the two strands            */
  const X0 = 50, X1 = 556;               /* how far the duplex runs    */
  const PS0 = 300, PS1 = 428;            /* the protospacer            */
  const PAM0 = PS1 + 7, PAM1 = PAM0 + 34;
  const CAS = (PS0 + PS1) / 2, CASY = 158, CRX = 86, CRY = 56;
  let s = "";

  s += '<text x="30" y="60" font-family="inherit" font-size="25" ' +
       'font-weight="700" fill="' + MUTED + '">dCas9 does not cut &#8212; it sits</text>';

  /* ---- the DNA, one continuous duplex, drawn first and never broken */
  [TOP, BOT].forEach(function(y){
    s += '<line x1="' + X0 + '" y1="' + y + '" x2="' + X1 + '" y2="' + y +
         '" stroke="' + INK + '" stroke-width="3"/>';
  });

  /* ---- the promoter, and RNAP on it */
  s += '<path d="M 86 ' + BOT + ' L 86 208 L 132 208" fill="none" stroke="' +
       INK + '" stroke-width="3"/>';
  s += '<path d="M 150 208 L 130 199 L 130 217 Z" fill="' + INK + '"/>';
  s += '<ellipse cx="152" cy="' + ((TOP + BOT) / 2) + '" rx="32" ry="28" fill="' +
       PAPER + '" stroke="' + MUTED + '" stroke-width="3"/>';
  s += '<text x="152" y="' + ((TOP + BOT) / 2 + 6) + '" text-anchor="middle" ' +
       'font-family="inherit" font-size="17" fill="' + MUTED + '">RNAP</text>';

  /* ---- the transcript, running out and stopping against dCas9 */
  s += '<line x1="184" y1="' + (TOP - 16) + '" x2="' + (PS0 - 26) + '" y2="' +
       (TOP - 16) + '" stroke="' + MUTED + '" stroke-width="3"/>';
  s += '<line x1="' + (PS0 - 20) + '" y1="' + (TOP - 30) + '" x2="' + (PS0 - 20) +
       '" y2="' + (TOP - 2) + '" stroke="' + VERM + '" stroke-width="5"/>';

  /* ---- the protospacer: a stretch OF the duplex, not a thing on top */
  s += '<line x1="' + PS0 + '" y1="' + TOP + '" x2="' + PS1 + '" y2="' + TOP +
       '" stroke="' + VERM + '" stroke-width="7"/>';
  /* the PAM, immediately 3' of it */
  s += '<rect x="' + PAM0 + '" y="' + (TOP - 9) + '" width="' + (PAM1 - PAM0) +
       '" height="18" rx="3" fill="' + RULE + '" stroke="' + INK + '" stroke-width="2"/>';
  /* both of these go UNDER the duplex, far enough apart not to touch:
     protospacer centred on itself, PAM centred on its box */
  s += '<text x="' + ((PS0 + PS1) / 2 - 18) + '" y="' + (BOT + 24) +
       '" text-anchor="middle" font-family="inherit" font-size="19" fill="' +
       VERM + '">protospacer</text>';
  s += '<text x="' + ((PAM0 + PAM1) / 2 + 4) + '" y="' + (BOT + 24) +
       '" text-anchor="middle" font-family="inherit" font-size="17" fill="' +
       INK + '">PAM</text>';

  /* ---- dCas9, above the DNA, over the protospacer */
  s += '<ellipse cx="' + CAS + '" cy="' + CASY + '" rx="' + CRX + '" ry="' + CRY +
       '" fill="' + RULE + '" stroke="' + BLUE + '" stroke-width="4"/>';
  s += '<text x="' + CAS + '" y="' + (CASY - 4) + '" text-anchor="middle" ' +
       'font-family="inherit" font-size="22" font-weight="700" fill="' + BLUE +
       '">dCas9</text>';

  /* ---- the sgRNA: scaffold inside dCas9, spacer annealed below it */
  const SP = TOP - 13;                   /* the spacer lies just above  */
  s += '<path d="M ' + (CAS - 34) + ' ' + (CASY + 20) +
       ' q -26 26 -18 52" fill="none" stroke="' + VERM +
       '" stroke-width="5" stroke-linecap="round"/>';
  s += '<line x1="' + PS0 + '" y1="' + SP + '" x2="' + (PS1 - 10) + '" y2="' + SP +
       '" stroke="' + VERM + '" stroke-width="5"/>';
  /* base pairing, drawn so "anneals" is visible rather than asserted */
  for (let x = PS0 + 8; x < PS1 - 8; x += 14){
    s += '<line x1="' + x + '" y1="' + (SP + 3) + '" x2="' + x + '" y2="' +
         (TOP - 4) + '" stroke="' + VERM + '" stroke-width="1.5" opacity="0.8"/>';
  }
  /* 3' end: a HALF barb, house convention -- and it points at the PAM,
     which is where the seed is and where the dial starts counting */
  s += '<path d="M ' + (PS1 - 10) + ' ' + SP + ' L ' + (PS1 - 24) + ' ' + (SP - 9) +
       '" fill="none" stroke="' + VERM + '" stroke-width="4" stroke-linecap="round"/>';
  s += '<text x="' + (PS1 + 4) + '" y="' + (SP - 8) + '" font-family="inherit" ' +
       'font-size="15" fill="' + VERM + '">3&#8242;</text>';
  s += '<text x="' + (PS0 - 26) + '" y="' + (SP + 4) + '" font-family="inherit" ' +
       'font-size="15" fill="' + VERM + '">5&#8242;</text>';
  s += '<text x="' + (CAS + 92) + '" y="' + (CASY - 26) + '" ' +
       'font-family="inherit" font-size="21" fill="' + VERM + '">sgRNA</text>';
  s += '<path d="M ' + (CAS + 88) + ' ' + (CASY - 32) + ' q -22 -6 -34 10" ' +
       'fill="none" stroke="' + VERM + '" stroke-width="2"/>';

  /* ---- what it costs */
  s += '<text x="' + (PS0 - 28) + '" y="' + (TOP - 28) + '" text-anchor="end" ' +
       'font-family="inherit" font-size="19" fill="' + VERM +
       '">elongation blocked</text>';
  s += '<text x="' + (X1 - 6) + '" y="' + (BOT + 48) + '" text-anchor="end" ' +
       'font-family="inherit" font-size="19" fill="' + BLUE +
       '">essential gene</text>';
  return s;
}

/* ---- band A, right: the dial --------------------------------------- *
 * Twenty cells, PAM at the right-hand end, so the seed is the rightmost
 * seven.  Under each cell, how much knockdown SURVIVES a mismatch
 * there: nearly all of it out at the distal end, almost none of it in
 * the seed.  That gradient is the whole method -- it is what turns a
 * switch into a dial.
 * ------------------------------------------------------------------ */
const DX = 580, DW = 30, DY = 96, DH = 34;
const DRIGHT = DX + 20 * DW;

/* schematic retained-knockdown profile, distal (left) to seed (right) */
const KEEP = [];
(function(){
  for (let i = 0; i < 20; i++){
    const t = i / 19;
    KEEP.push(0.92 - 0.80 / (1 + Math.exp(-(t - 0.60) * 11)));
  }
})();

function dial(){
  let s = "";

  s += '<text x="' + DX + '" y="' + (DY - 16) + '" font-family="inherit" ' +
       'font-size="22" fill="' + INK +
       '">the 20-base pairing region of the sgRNA</text>';

  /* all twenty cells are white: the regions are named by the brackets
     under them, and a tint per region would be an identity map */
  for (let i = 0; i < 20; i++){
    s += '<rect x="' + (DX + i * DW) + '" y="' + DY + '" width="' + DW +
         '" height="' + DH + '" fill="' + PAPER +
         '" stroke="' + MUTED + '" stroke-width="1.5"/>';
  }
  s += '<rect x="' + (DRIGHT + 8) + '" y="' + DY + '" width="56" height="' + DH +
       '" rx="4" fill="' + RULE + '" stroke="' + INK + '" stroke-width="2"/>';
  s += '<text x="' + (DRIGHT + 36) + '" y="' + (DY + DH/2 + 7) +
       '" text-anchor="middle" font-family="inherit" font-size="20" fill="' +
       INK + '">PAM</text>';

  /* region brackets */
  /* only the seed is promoted -- it is what this band is about.  Distal
     and middle are context and are told apart by their labels. */
  [[0, 8, "distal", MUTED], [8, 13, "middle", MUTED], [13, 20, "seed", VERM]]
  .forEach(function(r){
    const x0 = DX + r[0] * DW, x1 = DX + r[1] * DW, y = DY + DH + 10;
    s += '<path d="M ' + x0 + ' ' + y + ' L ' + x0 + ' ' + (y + 9) + ' L ' +
         x1 + ' ' + (y + 9) + ' L ' + x1 + ' ' + y + '" fill="none" stroke="' +
         r[3] + '" stroke-width="2.5"/>';
    s += '<text x="' + ((x0 + x1)/2) + '" y="' + (y + 32) + '" text-anchor="middle" ' +
         'font-family="inherit" font-size="22" font-weight="700" fill="' + r[3] +
         '">' + r[2] + '</text>';
    s += '<text x="' + ((x0 + x1)/2) + '" y="' + (y + 52) + '" text-anchor="middle" ' +
         'font-family="inherit" font-size="18" fill="' + MUTED + '">' +
         (r[1] - r[0]) + ' nt</text>';
  });

  /* how much knockdown survives a mismatch at each position */
  const BY = 212, BH = 92;
  s += '<line x1="' + DX + '" y1="' + (BY + BH) + '" x2="' + DRIGHT + '" y2="' +
       (BY + BH) + '" stroke="' + INK + '" stroke-width="2.5"/>';
  for (let i = 0; i < 20; i++){
    const h = KEEP[i] * BH;
    s += '<rect x="' + (DX + i * DW + 3) + '" y="' + n2(BY + BH - h) + '" width="' +
         (DW - 6) + '" height="' + n2(h) + '" fill="' + INK + '"/>';
  }
  s += '<text transform="translate(' + (DX - 22) + ',' + (BY + BH/2) +
       ') rotate(-90)" text-anchor="middle" font-family="inherit" ' +
       'font-size="19" fill="' + INK + '">knockdown kept</text>';

  s += '<text x="' + DX + '" y="' + (BY + BH + 30) + '" font-family="inherit" ' +
       'font-size="20" fill="' + MUTED + '">mismatch here: barely matters</text>';
  s += '<text x="' + DRIGHT + '" y="' + (BY + BH + 30) + '" text-anchor="end" ' +
       'font-family="inherit" font-size="20" fill="' + VERM +
       '">here: knockdown nearly gone</text>';
  return s;
}

/* ---- band B: the pooled experiment --------------------------------- */
const COLS = [30, 395, 760, 1125];

/* NO LONGER DRAWN.  Kept because it is correct and may be wanted
   back; see the note on figure() for why the slide was cut to two
   bands.  If it stays unused much longer, delete it. */
function pipeline(){
  const Y = 392;
  const steps = [
    ["100 sgRNAs per gene", "10 guides &#215; 10 variants each"],
    ["&gt;30,000 per library", "~300 essential genes, two species"],
    ["grow 10 doublings", "pooled, in exponential phase"],
    ["sequence the sgRNAs", "frequency change = fitness"]
  ];
  let s = "";
  steps.forEach(function(t, i){
    s += '<text x="' + COLS[i] + '" y="' + Y + '" font-family="inherit" ' +
         'font-size="24" font-weight="700" fill="' + INK + '">' + t[0] + '</text>';
    s += '<text x="' + COLS[i] + '" y="' + (Y + 26) + '" font-family="inherit" ' +
         'font-size="19" fill="' + MUTED + '">' + t[1] + '</text>';
    if (i < 3){
      const ax = COLS[i + 1] - 30;
      s += '<path d="M ' + (ax - 26) + ' ' + (Y - 8) + ' L ' + ax + ' ' + (Y - 8) +
           '" stroke="' + MUTED + '" stroke-width="2.5"/>' +
           '<path d="M ' + (ax + 11) + ' ' + (Y - 8) + ' L ' + (ax - 3) + ' ' +
           (Y - 15) + ' L ' + (ax - 3) + ' ' + (Y - 1) + ' Z" fill="' + MUTED + '"/>';
    }
  });
  return s;
}

/* ---- band C: the strip that names the space ------------------------ */
/* NO LONGER DRAWN.  Kept because it is correct and may be wanted
   back; see the note on figure() for why the slide was cut to two
   bands.  If it stays unused much longer, delete it. */
function strip(){
  const Y = 498;
  const items = [
    ["Tn-seq", "disrupt at random; the insertion", "site is its own barcode", false],
    ["CRISPRi", "knock down on purpose,", "all the way", false],
    ["mismatch-CRISPRi", "knock down by an amount", "you choose", true],
    ["Perturb-seq", "any of these, read out as", "single-cell transcriptomes", false]
  ];
  let s = '<line x1="30" y1="' + (Y - 30) + '" x2="1450" y2="' + (Y - 30) +
          '" stroke="' + RULE + '" stroke-width="2"/>';
  items.forEach(function(t, i){
    s += '<text x="' + COLS[i] + '" y="' + Y + '" font-family="inherit" ' +
         'font-size="22" font-weight="700" fill="' + (t[3] ? VERM : MUTED) +
         '">' + t[0] + '</text>';
    s += '<text x="' + COLS[i] + '" y="' + (Y + 24) + '" font-family="inherit" ' +
         'font-size="18" fill="' + MUTED + '">' + t[1] + '</text>';
    s += '<text x="' + COLS[i] + '" y="' + (Y + 44) + '" font-family="inherit" ' +
         'font-size="18" fill="' + MUTED + '">' + t[2] + '</text>';
  });
  return s;
}

function figure(){
  /* TWO bands, not four.  JCA, 2026-11-17: "This whole sequence on
     crispr-i is too complicated and nuanced.  I can't present that
     either."  The slide carried four separate ideas -- the dCas9
     mechanism, the mismatch dial, the pooled-library pipeline, and a
     strip naming four other methods -- and any one of them is a
     slide's worth.  The two the lecture needs are kept: dCas9 blocks
     rather than cuts, and WHERE you put one mismatch sets how hard it
     blocks.  The pipeline numbers and the comparison with Tn-seq,
     CRISPRi and Perturb-seq are not lost, they moved into the
     narration, where they can be said rather than drawn. */
  let s = "";
  s += '<g data-r="mol" opacity="0">' + molecular() + '</g>';
  s += '<g data-r="dial" opacity="0">' + dial() + '</g>';
  s += '<text x="1450" y="592" text-anchor="end" font-family="inherit" ' +
       'font-size="19" fill="' + MUTED + '">activity profile schematic, after ' +
       'Hawkins et al., Cell Syst 2020, Fig. 1C</text>';
  return '<svg viewBox="0 0 1480 600" xmlns="http://www.w3.org/2000/svg" ' +
    'role="img" aria-label="Mismatch CRISPRi. On the left, dCas9 guided by an ' +
    'sgRNA sits on an essential gene and blocks an elongating RNA polymerase; ' +
    'it does not cut. On the right, the twenty base pairing region of the ' +
    'sgRNA is drawn as twenty cells with the PAM at the right end, divided ' +
    'into a distal region of eight bases, a middle of five and a seed of seven ' +
    'nearest the PAM. Bars underneath show that a single mismatch in the ' +
    'distal region leaves nearly all the knockdown intact, while a mismatch ' +
    'in the seed nearly abolishes it, so the position of one mismatch sets ' +
    'the strength. Below, the pooled experiment: a hundred sgRNAs per gene ' +
    'spanning that range, over thirty thousand per library across about three ' +
    'hundred essential genes in E. coli and B. subtilis, grown ten doublings ' +
    'and read out by sequencing the sgRNAs, where the change in frequency is ' +
    'relative fitness. A strip along the bottom names Tn-seq, CRISPRi, ' +
    'mismatch CRISPRi and Perturb-seq.">' + s + '</svg>';
}

const steps = [
  {
    add:"To ask that question you need a way to turn a gene down by a controlled amount, and the modern way to do it is CRISPR interference. Start with the ordinary version. This is dCas9, so it has no nuclease activity at all — it does not cut the gene, it parks on it and gets in the way of an elongating polymerase. Point the guide at an essential gene and you knock that gene down. The trouble is that this is a switch. You get the knockdown the guide gives you, and the only way to ask what a cell does at half that level is to go and build something else.",
    desc:"dCas9 guided by an sgRNA sits on an essential gene and blocks an elongating RNA polymerase." },
  {
    add:"Here is the trick that turns the switch into a dial. The guide pairs over twenty bases, and a single mismatch does not affect it equally everywhere. Out at the distal end, away from the PAM, one mismatch barely matters and you keep almost all the knockdown. Down in the seed, the seven bases nearest the PAM, one mismatch nearly abolishes it. And in between you can get anything you want. So by choosing WHERE you put one mismatch, you order a particular strength of knockdown — and they built a model that predicts it well enough to design to.",
    desc:"The 20-base pairing region split into distal, middle and seed regions, with bars showing how much knockdown a mismatch at each position leaves intact." }
];

window.Deck.sequence("mmcrispri", function(slide){
  const host = slide.querySelector("[data-mm]");
  if (!host) return { steps: steps.map(x => ({note:x.add, desc:x.desc})), go: function(){} };
  host.innerHTML = figure();
  const svg = host.querySelector("svg"), r = {};
  svg.querySelectorAll("[data-r]").forEach(e => r[e.getAttribute("data-r")] = e);

  function go(i){
    const set = (k, on) => r[k] && r[k].setAttribute("opacity", on ? "1" : "0");
    set("mol", i >= 0);
    set("dial", i >= 1);
  }
  go(0);

  return { steps: steps.map(x => ({ note: x.add, desc: x.desc })), go: go };
});

})();
