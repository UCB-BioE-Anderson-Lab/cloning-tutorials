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
 * Authored at 1420x720.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", BLUE = "#004373",
      AMBER = "#a99011", MUTED = "#767676", RULE = "#e2e2e2";
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

/* ---- band A, left: dCas9 sitting on the gene ----------------------- */
function molecular(){
  const Y = 200, GAP = 26;
  let s = "";

  s += '<text x="30" y="60" font-family="inherit" font-size="25" ' +
       'font-weight="700" fill="' + MUTED + '">dCas9 does not cut &#8212; it sits</text>';

  /* the gene, a block arrow */
  const g0 = 170, g1 = 460, h = 28, head = 30, mid = Y + GAP/2;
  s += '<path d="M ' + g0 + ' ' + (mid - h/2) +
       ' L ' + (g1 - head) + ' ' + (mid - h/2) +
       ' L ' + (g1 - head) + ' ' + (mid - h/2 - 11) +
       ' L ' + g1 + ' ' + mid +
       ' L ' + (g1 - head) + ' ' + (mid + h/2 + 11) +
       ' L ' + (g1 - head) + ' ' + (mid + h/2) +
       ' L ' + g0 + ' ' + (mid + h/2) + ' Z" ' +
       'fill="#eef2f6" stroke="' + BLUE + '" stroke-width="3"/>';

  /* upstream duplex */
  [0, GAP].forEach(function(dy){
    s += '<line x1="50" y1="' + (Y + dy) + '" x2="' + (g0 + 4) + '" y2="' +
         (Y + dy) + '" stroke="' + INK + '" stroke-width="3"/>';
  });

  /* promoter */
  s += '<path d="M 72 ' + (Y + GAP) + ' L 72 120 L 124 120" fill="none" ' +
       'stroke="' + INK + '" stroke-width="3"/>';
  s += '<path d="M 140 120 L 122 111 L 122 129 Z" fill="' + INK + '"/>';

  /* RNA polymerase, elongating, and dCas9 in its way */
  s += '<ellipse cx="212" cy="' + mid + '" rx="28" ry="34" fill="#ffffff" ' +
       'stroke="' + MUTED + '" stroke-width="3"/>';
  s += '<text x="212" y="' + (mid + 7) + '" text-anchor="middle" ' +
       'font-family="inherit" font-size="18" fill="' + MUTED + '">RNAP</text>';

  s += '<ellipse cx="306" cy="' + mid + '" rx="44" ry="52" fill="#e7eef4" ' +
       'stroke="' + BLUE + '" stroke-width="4"/>';
  s += '<text x="306" y="' + (mid + 8) + '" text-anchor="middle" ' +
       'font-family="inherit" font-size="22" font-weight="700" fill="' + BLUE +
       '">dCas9</text>';

  /* the sgRNA, a vermillion curl off the top of dCas9 */
  s += '<path d="M 306 ' + (mid - 52) + ' q 38 -26 18 -50 q -18 -22 -46 -12" ' +
       'fill="none" stroke="' + VERM + '" stroke-width="5" stroke-linecap="round"/>';
  s += '<text x="356" y="' + (mid - 112) + '" text-anchor="middle" ' +
       'font-family="inherit" font-size="21" fill="' + VERM + '">sgRNA</text>';

  /* the block */
  s += '<line x1="258" y1="' + (mid - 46) + '" x2="258" y2="' + (mid + 46) +
       '" stroke="' + VERM + '" stroke-width="6"/>';

  s += '<text x="402" y="' + (mid + 84) + '" text-anchor="middle" ' +
       'font-family="inherit" font-size="21" fill="' + BLUE + '">essential gene</text>';
  s += '<text x="186" y="' + (mid + 84) + '" text-anchor="middle" ' +
       'font-family="inherit" font-size="21" fill="' + VERM +
       '">transcription blocked</text>';
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

  for (let i = 0; i < 20; i++){
    const reg = i < 8 ? 0 : i < 13 ? 1 : 2;
    s += '<rect x="' + (DX + i * DW) + '" y="' + DY + '" width="' + DW +
         '" height="' + DH + '" fill="' + ["#ffffff","#f6f2e2","#f7e8e2"][reg] +
         '" stroke="' + MUTED + '" stroke-width="1.5"/>';
  }
  s += '<rect x="' + (DRIGHT + 8) + '" y="' + DY + '" width="56" height="' + DH +
       '" rx="4" fill="#eceff2" stroke="' + INK + '" stroke-width="2"/>';
  s += '<text x="' + (DRIGHT + 36) + '" y="' + (DY + DH/2 + 7) +
       '" text-anchor="middle" font-family="inherit" font-size="20" fill="' +
       INK + '">PAM</text>';

  /* region brackets */
  [[0, 8, "distal", MUTED], [8, 13, "middle", AMBER], [13, 20, "seed", VERM]]
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
         (DW - 6) + '" height="' + n2(h) + '" fill="' +
         (i < 8 ? MUTED : i < 13 ? AMBER : VERM) + '" opacity="0.78"/>';
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
  let s = "";
  s += '<g data-r="mol" opacity="0">' + molecular() + '</g>';
  s += '<g data-r="dial" opacity="0">' + dial() + '</g>';
  s += '<g data-r="pipe" opacity="0">' + pipeline() + '</g>';
  s += '<g data-r="strip" opacity="0">' + strip() + '</g>';
  s += '<text x="1450" y="592" text-anchor="end" font-family="inherit" ' +
       'font-size="17" fill="' + MUTED + '">activity profile schematic, after ' +
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
    add:"Start with ordinary CRISPRi. This is dCas9, so it has no nuclease activity at all — it does not cut the gene, it just parks on it and gets in the way of an elongating polymerase. Point the guide at an essential gene and you knock that gene down. The trouble is that this is a switch. You get the knockdown the guide gives you, and the only way to ask what a cell does at half that level is to go and build something else.",
    desc:"dCas9 guided by an sgRNA sits on an essential gene and blocks an elongating RNA polymerase." },
  {
    add:"Here is the trick that turns the switch into a dial. The guide pairs over twenty bases, and a single mismatch does not affect it equally everywhere. Out at the distal end, away from the PAM, one mismatch barely matters and you keep almost all the knockdown. Down in the seed, the seven bases nearest the PAM, one mismatch nearly abolishes it. And in between you can get anything you want. So by choosing WHERE you put one mismatch, you order a particular strength of knockdown — and they built a model that predicts it well enough to design to.",
    desc:"The 20-base pairing region split into distal, middle and seed regions, with bars showing how much knockdown a mismatch at each position leaves intact." },
  {
    add:"Now it multiplexes, and this is the part that matters for this lecture. Instead of one guide per gene, you order a hundred: ten guides against the gene, each with nine mismatched variants, chosen to spread right across the knockdown range. Do that for every essential gene in the organism — about three hundred of them — and the library is over thirty thousand members. Grow the whole pool together for ten doublings, keeping it in exponential phase, and sequence the guide cassettes at the start and at the end. A guide that got rarer belongs to a strain that grew badly. The change in frequency is the fitness measurement, and it comes for every one of those thirty thousand strains out of one experiment.",
    desc:"The pooled workflow: a hundred sgRNAs per gene, over thirty thousand per library, grown ten doublings and read out by sequencing the guides." },
  {
    add:"And for orientation, this is one corner of a much bigger space. Tn-seq disrupts genes at random and needs no separate barcode, because the insertion site is its own identifier. Ordinary CRISPRi knocks down on purpose, but all the way. Mismatch CRISPRi, the one we just drew, knocks down by an amount you choose. And Perturb-seq does any of these but reads the answer out of single cells as whole transcriptomes, so the phenotype is not one number but thousands. The older version of this idea is TRMR, from Ryan Gill's lab in 2010 — same ambition, tuning genes up and down with barcoded genomic edits made by recombineering, before CRISPR made the aiming easy.",
    desc:"A strip naming Tn-seq, CRISPRi, mismatch CRISPRi and Perturb-seq, with the distinction each one draws." }
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
    set("pipe", i >= 2);
    set("strip", i >= 3);
  }
  go(0);

  return { steps: steps.map(x => ({ note: x.add, desc: x.desc })), go: go };
});

})();
