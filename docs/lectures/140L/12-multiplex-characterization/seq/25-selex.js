/* ------------------------------------------------------------------ *
 * 25-selex.js : source 25, "SELEX with Deep Sequencing".
 * Fills  [data-fig="selex"]  -- the LEFT column of the slide.
 *
 * THE SLIDE IS NOW: this animated explanation of the experiment on the
 * left, and ONE piece of the paper's data on the right (Fig. 3A,
 * img/25-enrich.png, credited separately).  JCA, after three earlier
 * attempts: "let's use the attached on the right, and a conceptual
 * diagram of the electrophoresis and pooling and sequencing on the
 * left.  Basically, an illustration/animation on the left that
 * explains the experiment, and this one piece of data on the right."
 *
 * ON "ELECTROPHORESIS".  This paper does not run a gel; it separates
 * on target-coated magnetic beads in a microfluidic chip.  Some SELEX
 * variants do separate on a gel shift, and JCA's own source note says
 * the step "might also be done by more traditional columns or
 * panning", so the separation is drawn GENERICALLY -- bound stays,
 * unbound washes away -- with no apparatus committed to.  That keeps
 * the picture true for every version of the experiment and matches
 * what the note says.
 *
 * HOW IT ANIMATES.  data-build, not data-seq.  verify_notes.py skips
 * the note template of any article carrying data-seq, and this slide
 * has a verbatim source note that must stay machine-checked, so the
 * build groups live inside the SVG and carry their own
 * data-note-add.  Three beats, no more: JCA has cut the click count
 * on two other slides in this deck already.
 *
 * WHAT IS FROM THE PAPER (PMID 20705898, full text read at
 * pmc.ncbi.nlm.nih.gov/articles/PMC2932614/):
 *   "The DNA library design features a central 40-base random domain
 *    flanked by two 20-nucleotide PCR primer sites."
 *   "We performed a total of three rounds of positive selection with
 *    PDGF-BB-coated beads with increasing selection stringency."
 *   "We analyzed the DNA sequences contained in the R1, R2 and R3
 *    pools by performing high-throughput DNA sequencing."
 *   "To identify high affinity sequences, we calculated and ranked
 *    the enrichment-fold (i.e., ratio of copy numbers between two
 *    selection rounds) for every sequence."
 *
 * THE THREE POOL ROWS ARE A CARTOON AND SAY SO.  One molecule is
 * followed through R1, R2 and R3 as 1, 3 and 9 copies out of sixteen.
 * Those counts are not the paper's -- the real per-round copy numbers
 * of a single sequence are not published -- so the row is labelled
 * "counts schematic".  The only real number anywhere near this slide
 * is the 2,347-fold on the plot's own axis, which is the paper's.
 *
 * COLOR.  Blue is the one molecule you follow, from a single strand
 * in the library to nine copies in R3.  Vermillion is the target, and
 * then the ratio that the plot on the right is made of.  Everything
 * else is ink, muted or rule.  No hex here that is not in palette.css.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK   = "#111111";
const BLUE  = "#004373";
const VERM  = "#ba3a13";
const MUTED = "#767676";
const RULE  = "#e2e2e2";
const PAPER = "#ffffff";

const W = 820, H = 580;

/* ---- primitives ---------------------------------------------------- */
function esc(t){
  return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;");
}

function text(x, y, t, size, fill, anchor, weight){
  return '<text x="' + x + '" y="' + y + '" font-family="inherit"' +
         ' font-size="' + size + '" fill="' + fill + '"' +
         (anchor ? ' text-anchor="' + anchor + '"' : "") +
         (weight ? ' font-weight="' + weight + '"' : "") +
         '>' + esc(t) + '</text>';
}

function rect(x, y, w, h, fill, stroke, sw){
  return '<rect x="' + x + '" y="' + y + '" width="' + w +
         '" height="' + h + '" fill="' + fill + '"' +
         (stroke ? ' stroke="' + stroke + '" stroke-width="' +
                   (sw || 1.2) + '"' : "") + '/>';
}

function dot(x, y, r, fill, stroke){
  return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' +
         fill + '"' + (stroke ? ' stroke="' + stroke +
         '" stroke-width="1.8"' : "") + '/>';
}

/* an arrowhead drawn as a path; page-global marker ids are forbidden */
function arrow(x1, y1, x2, y2, col){
  const a = Math.atan2(y2 - y1, x2 - x1), L = 12, Wd = 6;
  const bx = x2 - L * Math.cos(a), by = y2 - L * Math.sin(a);
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + bx.toFixed(1) +
         '" y2="' + by.toFixed(1) + '" stroke="' + col +
         '" stroke-width="2.2"/>' +
         '<path d="M' + x2 + ' ' + y2 +
         ' L' + (bx - Wd * Math.sin(a)).toFixed(1) + ' ' +
                (by + Wd * Math.cos(a)).toFixed(1) +
         ' L' + (bx + Wd * Math.sin(a)).toFixed(1) + ' ' +
                (by - Wd * Math.cos(a)).toFixed(1) +
         ' Z" fill="' + col + '"/>';
}

/* a single-stranded molecule: a short wiggle, folded differently each
   time so the library reads as a set of shapes and not a set of bars */
function strand(x, y, col, shape){
  const S = [
    "m0 0 q10 -12 20 0 q10 12 20 0 q10 -12 20 0",
    "m0 0 q12 10 24 -4 q12 -14 22 4",
    "m0 0 q8 -14 18 -2 q12 14 24 -6",
    "m0 0 q14 8 20 -6 q8 -14 24 2",
    "m0 0 q10 14 22 2 q10 -12 20 4"
  ][shape % 5];
  return '<path d="M' + x + ' ' + y + ' ' + S + '" fill="none" stroke="'
       + col + '" stroke-width="3" stroke-linecap="round"/>';
}

/* ---- step 0: the library ------------------------------------------- */
function library(){
  let s = text(0, 28, "the library", 24, INK, null, 700);
  for (let i = 0; i < 7; i++)
    s += strand(10 + i * 78, 78, i === 2 ? BLUE : MUTED, i);
  s += text(0, 124,
       "a 40-base random core between two fixed primer sites", 18, MUTED);
  s += text(0, 150, "one of them is drawn in blue, to follow", 18, BLUE);
  return s;
}

/* ---- step 1: one round --------------------------------------------- */
function round(){
  let s = '<g data-build="1" data-note-add="' + esc(NOTE1) + '">';
  s += text(0, 204, "one round of selection", 24, INK, null, 700);

  /* incubate: the target on a bead, with the library around it */
  s += dot(86, 272, 32, RULE, INK);
  for (let i = 0; i < 6; i++){
    const a = i * Math.PI / 3;
    s += dot(86 + 32 * Math.cos(a), 272 + 32 * Math.sin(a), 6, VERM);
  }
  s += strand(118, 250, BLUE, 1);
  s += strand(24, 318, MUTED, 3);
  s += strand(120, 300, MUTED, 0);
  s += text(86, 348, "incubate", 19, INK, "middle", 700);
  s += text(86, 370, "target on a bead", 17, MUTED, "middle");

  s += arrow(190, 272, 250, 272, MUTED);

  /* separate: what binds stays, the rest washes away */
  s += dot(330, 272, 32, RULE, INK);
  for (let i = 0; i < 6; i++){
    const a = i * Math.PI / 3;
    s += dot(330 + 32 * Math.cos(a), 272 + 32 * Math.sin(a), 6, VERM);
  }
  s += strand(362, 250, BLUE, 1);
  s += arrow(340, 214, 396, 190, MUTED);
  s += strand(400, 182, MUTED, 3);
  s += strand(400, 206, MUTED, 0);
  s += text(330, 348, "separate", 19, INK, "middle", 700);
  s += text(330, 370, "the rest washes away", 17, MUTED, "middle");

  s += arrow(434, 272, 494, 272, MUTED);

  /* amplify */
  s += strand(520, 254, BLUE, 1);
  s += strand(520, 286, BLUE, 1);
  s += text(574, 348, "PCR", 19, INK, "middle", 700);
  s += text(574, 370, "what you kept", 17, MUTED, "middle");

  /* and go round again -- routed clear of the labels, which the first
     version's curve ran straight through */
  s += '<path d="M648 292 L690 292 L690 392 L10 392 L10 334" fill="none" '
     + 'stroke="' + MUTED + '" stroke-width="2.2" stroke-dasharray="7 6"/>';
  s += arrow(10, 334, 10, 318, MUTED);
  s += text(350, 416, "three rounds", 19, MUTED, "middle");
  return s + '</g>';
}

/* ---- step 2: sequence every round ---------------------------------- */
const POOLS = [["R1", 1], ["R2", 3], ["R3", 9]];

function sequencing(){
  let s = '<g data-build="2" data-note-add="' + esc(NOTE2) + '">';
  s += text(0, 448, "sequence the pool from every round", 24, INK,
            null, 700);

  POOLS.forEach(function(p, r){
    const y = 468 + r * 34;
    s += text(0, y + 17, p[0], 19, INK, null, 700);
    for (let i = 0; i < 16; i++){
      const hit = i < p[1];
      s += rect(44 + i * 24, y, 20, 20, hit ? BLUE : PAPER,
                hit ? null : RULE, 1.4);
    }
  });

  s += text(452, 490, "the same molecule,", 19, INK);
  s += text(452, 514, "counted in every round", 19, INK);
  s += text(452, 552, "R3 ÷ R1 = enrichment fold", 20, VERM, null,
            700);
  s += text(0, 578, "counts schematic", 15, MUTED);
  return s + '</g>';
}

/* ---- the narration for each beat ----------------------------------- */
const NOTE1 =
  "A round is three operations and they are the same three whatever "
+ "you select on. You incubate the library with the target, here "
+ "carried on a bead so there is something to hold on to. You separate "
+ "what bound from what did not, which in this paper is done on a "
+ "magnetic chip but is just as often a column, a gel or a dish. Then "
+ "you PCR what you kept, which is the step that makes it a selection "
+ "rather than a purification, because the survivors come back at full "
+ "strength for the next round. Cho and Xiao did three rounds, raising "
+ "the stringency each time and adding a negative selection against a "
+ "related protein before the last one.";

const NOTE2 =
  "Here is the part that makes it quantitative. Instead of waiting for "
+ "the pool to converge and then cloning out a hundred colonies, they "
+ "sequenced the pool from every round. That gives each of more than "
+ "ten million sequences a count in round one, a count in round two "
+ "and a count in round three, so you can follow one molecule through "
+ "the whole experiment. The ratio of its count at the end to its "
+ "count at the start is its enrichment fold, and that is the number "
+ "on the plot beside this.";

/* ---- assembly ------------------------------------------------------ */
function draw(){
  return library() + round() + sequencing();
}

const ALT = "An explanation of the experiment, built up in three "
  + "steps. First, the library: seven single strands of different "
  + "shapes, one drawn in blue to follow, described as a 40-base "
  + "random core between two fixed primer sites. Second, one round of "
  + "selection, left to right: incubate, with the target drawn as red "
  + "dots on a bead and strands around it; separate, where the blue "
  + "strand stays on the bead and the others are arrowed away to wash; "
  + "and PCR, where the kept strand becomes two. A dashed arrow loops "
  + "back to the start, labeled three rounds. Third, sequence the pool "
  + "from every round: three rows labeled R1, R2 and R3, each of "
  + "sixteen squares, with one blue square in R1, three in R2 and nine "
  + "in R3, showing the same molecule counted in every round, and R3 "
  + "divided by R1 giving the enrichment fold. The counts in those "
  + "rows are schematic.";

function fill(){
  const el = document.querySelector('[data-fig="selex"]');
  if (!el) return;
  el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" '
    + 'xmlns="http://www.w3.org/2000/svg" role="img" '
    + 'aria-label="' + ALT.replace(/"/g, "&quot;") + '">' + draw()
    + '</svg>';
}
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
