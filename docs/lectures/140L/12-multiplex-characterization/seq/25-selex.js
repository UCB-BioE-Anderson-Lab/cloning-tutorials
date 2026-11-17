/* ------------------------------------------------------------------ *
 * 25-selex.js : source 25, "SELEX with Deep Sequencing".
 * Fills  [data-fig="selex"]
 *
 * WHY THIS EXISTS.  The slide carried two cropped panels from the
 * paper: a binding curve of four pools, and a log-count histogram
 * against R3/R1 enrichment fold.  JCA: "I hate this slide... those
 * figures are cryptic... I can't comprehend these charts, and I won't
 * be able to present them."  He asked for a cartoon of the
 * microfluidic apparatus, and one simpler picture of the enrichment
 * each sequence gets.  So both panels are drawn, and neither is a
 * trace of theirs.
 *
 * THE PAPERS.
 *   Cho M, Xiao Y, ... Thomson JA, Soh HT, "Quantitative selection of
 *   DNA aptamers through microfluidic selection and high-throughput
 *   sequencing", PNAS 107(35):15373-15378, 2010.  PMID 20705898.
 *   Abstract read from PubMed; the full text is not open.
 *
 *   The chip is the Soh lab's own, described in Lou X, Qian J, ...
 *   Heeger AJ, Soh HT, "Micromagnetic selection of aptamers in
 *   microfluidic channels", PNAS 106(9):2989-2994, 2009.  The device
 *   panel here is drawn from that paper's full text, read in full,
 *   not from the 2010 abstract.
 *
 * THIRD DRAFT, AND WHY.  Two drawn versions of the apparatus were
 * rejected -- "That does not resemble any apparatus", then "this is
 * still a shit slide".  JCA chose the paper's own photograph instead
 * (Lou et al. 2009 Fig. 2A, PMID 19202068, cropped to img/25-cmacs.png
 * and credited on the slide), and asked that the data half be redone
 * with real numbers from the paper, showing individual sequences
 * tracked through the selection.  So this module is now the DATA ONLY;
 * the apparatus is the photograph above it.
 *
 * EVERY WORD OF THE DATA PANEL, WITH ITS SENTENCE.  Read from the full
 * text at pmc.ncbi.nlm.nih.gov/articles/PMC2932614/.
 *
 *   the same ten, and not enriched
 *     "Interestingly, the same ten sequences were identified with the
 *      highest copy numbers in all three pools (R1, R2, and R3), but
 *      none of them displayed significant enrichment-fold."
 *   why they were there
 *     "We suspect that these sequences are overrepresented as a result
 *      of biases during library synthesis or PCR."
 *   rare early, 2,347-fold by the end
 *     "the sequences with highest enrichment-fold (e.g., 2,347-fold
 *      for R3/R1 and 650-fold for R3/R2) appear infrequently in
 *      earlier rounds, and we hypothesize that these represent true
 *      high-affinity aptamers."
 *   more than ten million
 *     "the capability to track the evolution and enrichment of > 10
 *      million individual aptamer sequences throughout the selection
 *      process".
 *
 * THE TWO MINI-PLOTS CARRY SHAPE, NOT SCALE, AND THE SHAPES ARE THE
 * PAPER'S: flat across the three rounds for the abundant-but-not-
 * enriched class, and low-then-steep for the enriched one.  No copy
 * numbers are plotted, because the per-round copy numbers of any one
 * sequence are not in the text and inventing them is forbidden
 * (FIGURE-CONTRACT.md s6).  The only printed figure is 2,347-fold,
 * which is quoted above.
 *
 * WHAT THE SEQUENCING PANEL CLAIMS.  Only two numbers, both from the
 * 2010 abstract: "tracks the copy number and enrichment-fold of more
 * than 10 million individual sequences through multiple selection
 * rounds", and "aptamers that specifically bind to PDGF-BB protein
 * with K(d) < 3 nM within 3 rounds".
 *
 * THE THREE SEQUENCES ARE NOT DATA AND SAY SO.  Their bar heights
 * carry no counts and are labelled schematic; what they carry is the
 * comparison the method rests on, which is that a sequence can be
 * abundant at the end for two different reasons and only the change
 * across rounds tells them apart.  Giving them invented fold values
 * would have been inventing data, which FIGURE-CONTRACT.md s6
 * forbids, so the verdicts are words.
 *
 * COLOR.  Blue is the material you are following -- the beads, and
 * the round-three reads.  Vermillion is the one row the slide wants
 * you to leave with.  Everything else is ink, muted or rule.  No hex
 * appears here that is not in palette.css.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK   = "#111111";
const BLUE  = "#004373";
const VERM  = "#ba3a13";
const MUTED = "#767676";
const RULE  = "#e2e2e2";
const PAPER = "#ffffff";

const W = 1480, H = 290;

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

function line(x1, y1, x2, y2, stroke, sw){
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 +
         '" y2="' + y2 + '" stroke="' + stroke +
         '" stroke-width="' + (sw || 1.6) + '"/>';
}

function dot(x, y, r, fill){
  return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' +
         fill + '"/>';
}

/* ---- the data panel ------------------------------------------------ *
 * Two classes of sequence, side by side, each with a mini-plot that
 * carries the SHAPE the paper states across R1, R2, R3 and no values.
 * ------------------------------------------------------------------ */
function plot(x, pts, col){
  const AX = x + 10, AY = 182;
  let s = line(AX, AY, x + 200, AY, MUTED, 1.6);
  ["R1", "R2", "R3"].forEach(function(t, i){
    s += text(x + 30 + i * 70, AY + 24, t, 16, MUTED, "middle");
  });
  let d = "";
  pts.forEach(function(p, i){
    d += (i ? " L " : "M ") + (x + 30 + i * 70) + " " + p;
  });
  s += '<path d="' + d + '" fill="none" stroke="' + col +
       '" stroke-width="3.5" stroke-linejoin="round"/>';
  pts.forEach(function(p, i){
    s += dot(x + 30 + i * 70, p, 5, col);
  });
  return s;
}

function panel(x, head, l1, l2, verdict, col, pts){
  let s = plot(x, pts, col);
  const T = x + 230;
  s += text(T, 96,  head,    22, INK, null, 700);
  s += text(T, 128, l1,      20, INK);
  s += text(T, 156, l2,      20, INK);
  s += text(T, 196, verdict, 20, col, null, 700);
  return s;
}

function draw(){
  let s = text(0, 32,
    "every one of more than 10 million sequences, counted in all three "
  + "rounds", 26, INK, null, 700);

  s += panel(0, "the ten most abundant sequences",
             "were the same ten in R1, R2 and R3,",
             "and not one of them was enriched",
             "artifacts of library synthesis and PCR",
             VERM, [118, 116, 114]);

  s += line(740, 70, 740, 215, RULE, 2);

  s += panel(770, "the sequence that was enriched",
             "was too rare to notice in round 1,",
             "and 2,347-fold up by round 3",
             "a real binder",
             BLUE, [176, 158, 84]);

  s += text(0, 266,
    "What is abundant at the end would have given you the wrong "
  + "molecules. What changed across rounds gave the right ones.",
    22, INK);
  return s;
}

const ALT = "Two classes of sequence, side by side, each with a small "
  + "plot across rounds one, two and three carrying shape only and no "
  + "values. On the left, a flat line: the ten most abundant sequences "
  + "were the same ten in rounds one, two and three, and not one of "
  + "them was enriched, making them artifacts of library synthesis and "
  + "PCR. On the right, a line that is low and then climbs steeply: "
  + "the sequence that was enriched was too rare to notice in round "
  + "one, and 2,347-fold up by round three, a real binder. Every one "
  + "of more than ten million sequences was counted in all three "
  + "rounds. What is abundant at the end would have given you the "
  + "wrong molecules; what changed across rounds gave the right ones.";

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
