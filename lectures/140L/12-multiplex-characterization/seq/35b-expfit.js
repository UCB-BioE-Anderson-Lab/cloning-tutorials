/* ------------------------------------------------------------------ *
 * 35b-expfit.js : what comes out of a mismatch-CRISPRi screen.  NEW.
 *
 * Registers:  expfit
 *
 * THE SECOND of the two slides that replace TRMR, and the one that
 * does the real work.  JCA on 2026-11-16: "focus on explaining just
 * one graphically and showing some data about what comes from it."
 * The slide before it is the mechanism; this is the data.
 *
 * WHY THIS DATA AND NOT A VOLCANO PLOT.  Because the output of this
 * experiment is a TRANSFER FUNCTION -- expression in, phenotype out --
 * and lecture 11 spent a whole slide on exactly that object under the
 * name impedance matching.  There the students tuned one RBS until a
 * device's two states fell either side of a phenotype's knee.  Here
 * the same curve has been MEASURED, for essentially every essential
 * gene in two organisms, and the shapes turn out to differ by pathway.
 * The callback is the reason this example is in the lecture at all.
 *
 * THE LAYOUT IS THE PAPER'S.  Hawkins et al. 2020, Figure 4: three
 * pathways down, two organisms across, thin lines for single genes and
 * a thick line for the median of the pathway.  Reading ACROSS a row is
 * the conservation claim; reading DOWN a column is the by-pathway
 * claim.  Keeping their arrangement is what makes both readable at a
 * glance, so it was not redesigned.
 *
 * THE THREE SHAPES ARE THEIRS, IN THEIR WORDS (PMC7704046):
 *   cofactors     "the robustness of both bacteria to CRISPRi
 *                 targeting of essential cofactor synthesis genes"
 *   translation   "once this buffer is overcome, fitness decreases
 *                 linearly with increasing sgRNA activity"
 *                 (B. subtilis 59 genes, E. coli 62)
 *   peptidoglycan "PG synthesis genes exhibited bimodal fitness
 *                 outcomes... Cells tolerated partial repression of
 *                 these genes without exhibiting a fitness defect.  If
 *                 expression was sufficiently repressed, these strains
 *                 lysed."  (10 genes in each species, KEGG ko00550)
 *   and the abstract's headline: "despite ~2 billion years of
 *   evolutionary separation... most essential homologs have similar
 *   expression-fitness relationships, with rare but informative
 *   differences."
 *
 * THE CURVES ARE DRAWN TO THOSE DESCRIBED SHAPES, NOT TRACED off the
 * figure, and the slide says so in small print.  They are honest about
 * form -- flat, buffered-then-linear, bimodal -- and carry no values.
 * Do not let anyone read a number off this slide.
 *
 * AXES.  x is predicted sgRNA activity, which is knockdown: left is
 * the gene untouched, right is the gene fully repressed.  y is
 * relative fitness, 1 at the top.  So every curve starts top-left and
 * can only fall; what differs is WHEN and HOW.
 *
 * Authored at 1480x600 -- see LAYOUT below.
 *
 * STYLE AUDIT, 2026-11-17.  Three palette faults, fixed.  (1) Each of
 * the three pathways was drawn in its own hue -- blue, amber,
 * vermillion -- which is a color per class of object, the one thing
 * palette.css forbids in as many words, and it reached amber, the rung
 * the guide says is almost never needed.  The three pathways are in
 * separate, labelled panels, so hue was adding nothing identity was
 * not already carrying.  Every median line is now blue, the thing to
 * follow in its panel.  (2) The per-gene lines were the row's hue at
 * opacity 0.30, which is an invented pale tint; they are now --muted
 * at full strength, which is what context is for, and the thin/thick
 * distinction survives greyscale on weight alone.  (3) --rule was
 * mistyped #e4e4e4 and is now the palette's #e2e2e2.  The three 17px
 * texts went to 19px, the contract's floor for small print.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373",
      MUTED = "#767676", RULE = "#e2e2e2";
const n2 = v => Math.round(v * 10) / 10;

/* ---- LAYOUT -------------------------------------------------------- *
 * Authored at 1480x600 to match the space a .slide actually leaves once
 * a one-line h1 and a sub line are out of it.  Both slides in this pair
 * use the same header shape on purpose, so the two figures are the same
 * size and the eye does not have to re-seat itself between them.
 *
 *   row labels  x   30-350      name, the one-word shape, the gloss
 *   panels      x  400-1060     two columns, three rows
 *   read-across x 1100-1450     the punchline
 * ------------------------------------------------------------------ */
const PW = 300, PH = 140;
const COLX = [400, 760];
const ROWY = [56, 232, 408];
const LABX = 30, SAYX = 1100;

/* deterministic jitter, so the thin lines never move between loads */
function rng(seed){
  let s = seed >>> 0;
  return function(){ s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

/* ---- the three described shapes ----------------------------------- */
/* robust: holds flat almost the whole way, then droops a little */
function fCofactor(x){ return 1 - 0.26 * Math.pow(x, 5); }
/* buffered, then linear: nothing happens, then it falls in a straight line */
function fTranslation(x){
  const b = 0.30;
  return x <= b ? 1 : Math.max(0.08, 1 - (x - b) / (1 - b) * 0.88);
}
/* bimodal: tolerated, then the cells lyse */
function fPeptidoglycan(x){
  return 0.05 + 0.93 / (1 + Math.exp((x - 0.62) * 22));
}

/* No `color` field: the pathway is named in the label beside its row
   and the panels are physically separate, so hue has no identity work
   left to do.  Blue is the median line in every panel -- the thing to
   follow -- and the per-gene lines behind it are context. */
const ROWS = [
  { f: fCofactor,
    name: "cofactor biosynthesis", gloss: "robust",
    say:  "partial knockdown costs almost nothing" },
  { f: fTranslation,
    name: "translation", gloss: "linear",
    say:  "a buffer, then fitness falls in step" },
  { f: fPeptidoglycan,
    name: "peptidoglycan precursors", gloss: "bimodal",
    say:  "tolerated, tolerated, then they lyse" }
];

/* How many genes each panel COUNTS -- the label printed in the corner.
   Every pair is quoted from PMC7704046, column 0 B. subtilis, column 1
   E. coli, in the paper's own order:
     cofactors      "KEGG pathways under 'Metabolism of cofactors and
                     vitamins'; B. subtilis: 25 genes, E. coli: 36 genes"
     translation    "KEGG pathways under 'Translation' ... B. subtilis:
                     59 genes, E. coli: 62 genes"
     peptidoglycan  "KEGG ko00550; B. subtilis: 10 genes, E. coli: 10
                     genes"
   The cofactor pair read 24 and 26 until 2026-11-17.  Neither number is
   in the paper; they were invented when this file was written and the
   comment above them claimed they were the paper's.  An audit caught
   that the other two pairs had their sentences recorded in this header
   and this one did not.  If a number here has no quote beside it, it is
   not trustworthy -- check it before it goes on a slide.
   NOTE these are COUNTS, not the number of lines drawn: the drawing
   caps at 10 thin lines a panel for legibility. */
const NGENES = [[25, 36], [59, 62], [10, 10]];

function px(c, x){ return COLX[c] + x * PW; }
function py(r, y){ return ROWY[r] + PH - y * PH; }

function frame(r, c){
  return '<rect x="' + COLX[c] + '" y="' + ROWY[r] + '" width="' + PW +
         '" height="' + PH + '" fill="none" stroke="' + RULE + '" stroke-width="2"/>' +
         '<line x1="' + COLX[c] + '" y1="' + (ROWY[r] + PH) + '" x2="' +
         (COLX[c] + PW) + '" y2="' + (ROWY[r] + PH) + '" stroke="' + INK +
         '" stroke-width="2.5"/>' +
         '<line x1="' + COLX[c] + '" y1="' + ROWY[r] + '" x2="' + COLX[c] +
         '" y2="' + (ROWY[r] + PH) + '" stroke="' + INK + '" stroke-width="2.5"/>';
}

/* one panel's worth of lines: thin per gene, thick for the median */
function lines(r, c){
  const row = ROWS[r], rand = rng(9001 + r * 31 + c * 7);
  let s = "";
  const n = Math.min(10, NGENES[r][c]);
  for (let g = 0; g < n; g++){
    const sx = 0.82 + rand() * 0.36;      /* how early it turns        */
    const sy = 0.80 + rand() * 0.26;      /* how far it finally falls  */
    let d = "";
    for (let i = 0; i <= 60; i++){
      const x = i / 60;
      const v = row.f(Math.min(1, x * sx));
      const y = Math.max(0, Math.min(1, 1 - (1 - v) * sy));
      d += (i ? " L " : "M ") + n2(px(c, x)) + " " + n2(py(r, y));
    }
    s += '<path d="' + d + '" fill="none" stroke="' + MUTED +
         '" stroke-width="1.6"/>';
  }
  let d = "";
  for (let i = 0; i <= 80; i++){
    const x = i / 80;
    d += (i ? " L " : "M ") + n2(px(c, x)) + " " + n2(py(r, row.f(x)));
  }
  s += '<path d="' + d + '" fill="none" stroke="' + BLUE + '" stroke-width="4.5"/>';
  /* bottom LEFT, not bottom right: every one of these curves starts high
     on the left and falls, so the lower left corner is the only one that
     is empty in all six panels.  Bottom right sits on the bimodal curve. */
  s += '<text x="' + (COLX[c] + 10) + '" y="' + (ROWY[r] + PH - 12) +
       '" font-family="inherit" font-size="19" fill="' + MUTED +
       '">' + NGENES[r][c] + ' genes</text>';
  return s;
}

function figure(){
  let s = "";

  /* column headings */
  ["B. subtilis", "E. coli"].forEach(function(t, c){
    s += '<text x="' + (COLX[c] + PW/2) + '" y="' + (ROWY[0] - 20) +
         '" text-anchor="middle" font-family="inherit" font-size="25" ' +
         'font-weight="700" font-style="italic" fill="' + INK + '">' + t + '</text>';
  });

  /* every frame is there from the start, so the grid reads as one object */
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 2; c++) s += frame(r, c);

  /* axes, labelled once, on the bottom row */
  s += '<text x="' + (COLX[0] + PW/2) + '" y="' + (ROWY[2] + PH + 32) +
       '" text-anchor="middle" font-family="inherit" font-size="20" fill="' +
       INK + '">knockdown &#8594;</text>';
  s += '<text transform="translate(' + (COLX[0] - 20) + ',' + (ROWY[2] + PH/2) +
       ') rotate(-90)" text-anchor="middle" font-family="inherit" ' +
       'font-size="20" fill="' + INK + '">fitness</text>';

  /* each row: the label on the left, then the curves */
  ROWS.forEach(function(row, r){
    s += '<g data-r="row' + r + '" opacity="0">';
    s += '<text x="' + LABX + '" y="' + (ROWY[r] + 38) + '" font-family="inherit" ' +
         'font-size="23" font-weight="700" fill="' + INK + '">' + row.name + '</text>';
    s += '<text x="' + LABX + '" y="' + (ROWY[r] + 76) + '" font-family="inherit" ' +
         'font-size="30" font-weight="700" fill="' + BLUE + '">' +
         row.gloss + '</text>';
    s += '<text x="' + LABX + '" y="' + (ROWY[r] + 104) + '" font-family="inherit" ' +
         'font-size="19" fill="' + MUTED + '">' + row.say + '</text>';
    s += lines(r, 0) + lines(r, 1);
    s += '</g>';
  });

  /* the punchline */
  s += '<g data-r="conserved" opacity="0">';
  s += '<path d="M 1080 ' + (ROWY[0] + PH/2) + ' L 1080 ' + (ROWY[2] + PH/2) +
       '" fill="none" stroke="' + MUTED + '" stroke-width="2" stroke-dasharray="4 6"/>';
  s += '<text x="' + SAYX + '" y="' + (ROWY[0] + 30) + '" font-family="inherit" ' +
       'font-size="25" font-weight="700" fill="' + INK + '">Read across.</text>';
  const say = ["E. coli and B. subtilis are", "about 2 billion years apart.",
               "Most essential homologs", "still have the same shape",
               "of curve.", "",
               "The shape is a property of", "the pathway, not of the",
               "organism."];
  say.forEach(function(t, i){
    s += '<text x="' + SAYX + '" y="' + (ROWY[0] + 66 + i * 28) +
         '" font-family="inherit" font-size="20" fill="' +
         (i > 5 ? INK : MUTED) + '">' + t + '</text>';
  });
  s += '</g>';

  s += '<text x="1450" y="592" text-anchor="end" font-family="inherit" ' +
       'font-size="19" fill="' + MUTED + '">curve shapes after Hawkins et al., ' +
       'Cell Syst 2020, Fig. 4 &#183; drawn to the described forms, not to scale</text>';

  return '<svg viewBox="0 0 1480 600" xmlns="http://www.w3.org/2000/svg" ' +
    'role="img" aria-label="A grid of six charts, three pathways down and two ' +
    'organisms across, B. subtilis and E. coli. In every chart the horizontal ' +
    'axis is how hard the gene is knocked down and the vertical axis is ' +
    'fitness, so each curve starts at full fitness on the left and can only ' +
    'fall. Cofactor biosynthesis genes are robust: the curve stays almost flat ' +
    'all the way across. Translation genes are linear: a short buffer where ' +
    'nothing happens, then fitness falls in step with knockdown. Peptidoglycan ' +
    'precursor genes are bimodal: partial repression is tolerated completely, ' +
    'and then past a threshold the cells lyse and fitness collapses. Each ' +
    'chart shows thin lines for individual genes and a thick line for the ' +
    'median. Reading across each row, the same shape appears in both ' +
    'organisms, which are about two billion years apart, so the shape is a ' +
    'property of the pathway rather than of the organism.">' + s + '</svg>';
}

const steps = [
  {
    add:"So that is thirty thousand strains, each one carrying a known amount of knockdown of a known gene, and this is the shape of what comes back. Every one of these six panels has knockdown along the bottom — left is the gene untouched, right is the gene shut right down — and fitness up the side. Every curve starts at the top left, because an unrepressed cell is a healthy cell, and from there it can only fall. The question is when, and how. Three pathways going down, two organisms going across. Each thin line is one gene; the thick one is the median for the pathway.",
    desc:"Six empty chart frames, three pathways down and two organisms across, with knockdown on the x axis and fitness on the y axis." },
  {
    add:"Cofactor biosynthesis first, and this one is almost a flat line. You can take these genes down a long way and the cell barely notices. And these are ESSENTIAL genes — delete one and the cell dies — so essential turns out not to mean what we usually let it mean. There is an enormous amount of headroom in how much of this enzyme the cell is actually carrying, and a knockout experiment, which is the only experiment anyone could do before this, would have told you precisely none of that.",
    desc:"The cofactor biosynthesis row fills in: curves that stay almost flat across the whole knockdown range in both organisms." },
  {
    add:"Translation does not behave that way at all. There is a short buffer at the start where nothing much happens, and then once you have used that up, fitness falls in a straight line with knockdown. And that makes mechanistic sense — growth rate in these organisms tracks the number of working ribosomes, so if you take ribosomal protein expression down linearly, you take growth down linearly with it. Notice that the shape is telling you something about the biology. A straight line means no spare capacity and no feedback to rescue you.",
    desc:"The translation row fills in: a flat buffer at low knockdown, then an approximately linear decline in both organisms." },
  {
    add:"And then peptidoglycan precursor synthesis does the thing you would never have guessed. It is bimodal. Partial repression is tolerated completely — the curve is flat, the cells are fine — and then you cross a threshold and they lyse. There is no graded middle at all. The cell is either building a wall or it is bursting. Now look back at lecture eleven for a moment: this is an impedance curve. It is the same object we drew when we were tuning a ribosome binding site to put a device's two states either side of a knee. Here it has been measured rather than guessed, and these three rows are three completely different knees.",
    desc:"The peptidoglycan row fills in: flat while partially repressed, then a sharp collapse past a threshold." },
  {
    add:"Here is the part I would hang the whole lecture on. Read across instead of down. E. coli and B. subtilis are separated by something like two billion years of evolution, they are on opposite sides of the Gram stain, and the curves still match row for row. The shape belongs to the pathway, not to the organism. That is a real biological result — not a methods result — and there is no way to get it one gene at a time. You need every essential gene, at every level of knockdown, in two organisms at once, which is thirty thousand measurements, which is this technique. That is what multiplexing buys you.",
    desc:"The conservation statement: the same shapes appear in both organisms despite about two billion years of separation." }
];

window.Deck.sequence("expfit", function(slide){
  const host = slide.querySelector("[data-ef]");
  if (!host) return { steps: steps.map(x => ({note:x.add, desc:x.desc})), go: function(){} };
  host.innerHTML = figure();
  const svg = host.querySelector("svg"), r = {};
  svg.querySelectorAll("[data-r]").forEach(e => r[e.getAttribute("data-r")] = e);

  function go(i){
    const set = (k, on) => r[k] && r[k].setAttribute("opacity", on ? "1" : "0");
    set("row0", i >= 1);
    set("row1", i >= 2);
    set("row2", i >= 3);
    set("conserved", i >= 4);
  }
  go(0);

  return { steps: steps.map(x => ({ note: x.add, desc: x.desc })), go: go };
});

})();
