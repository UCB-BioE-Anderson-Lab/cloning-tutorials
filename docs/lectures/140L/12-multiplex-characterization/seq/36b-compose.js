/* ------------------------------------------------------------------ *
 * 36b-compose.js : the Kosuri combinatorial library and its three
 * readouts.  Fills  [data-fig="compose"]
 *
 * WHY THIS EXISTS.  This slide is NOT in JCA's pptx.  The regulatory
 * DNA section had one content slide (CRE-Seq, source 36); JCA asked
 * for Kosuri's composability work to join it.  There is therefore no
 * original to reproduce and no render to draw against -- the drawing
 * is ours, and everything on it comes from the paper.
 *
 * THE PAPER.  Kosuri S, Goodman DB, Cambray G, Mutalik VK, Gao Y,
 * Arkin AP, Endy D, Church GM, "Composability of regulatory sequences
 * controlling transcription and translation in Escherichia coli",
 * PNAS 110(34):14024-14029, 2013.  PMID 23924614.  Read from the
 * authors' own copy at arep.med.harvard.edu/pdf/Kosuri_PNAS_13.pdf.
 *
 * EVERY NUMBER AND EVERY CLAIM ON THIS FIGURE, WITH ITS SENTENCE.
 *
 *   114 promoters, 111 RBSs, 12,653 constructs
 *     "we designed and synthesized all combinations of 114 promoters
 *      with 111 RBSs (12,653 constructs in total; one combination
 *      resulted in an incompatible restriction site)".
 *     NOTE: the ABSTRACT says 12,563, which is 12,653 with two digits
 *     transposed; 114 x 111 = 12,654, so the Results figure is the
 *     one that can be right and it is the one drawn.
 *   one oligo pool
 *     "We synthesized the construct library using Agilent's oligo
 *      library synthesis (OLS) technology".
 *   superfolder GFP
 *     "the constructs drive expression of superfolder GFP".
 *   mCherry, constant, same plasmid
 *     "pGERC also contains an mCherry reporter under constant
 *      expression by PLTetO-1 to act as a control for extrinsic
 *      noise".
 *   DNA-seq / RNA-seq
 *     "We used sequencing, DNASeq and RNASeq, to obtain steady-state
 *      DNA and RNA levels, respectively, across the library."  RNA is
 *      reported per construct DNA: "RNA levels are given as the
 *      measured RNA/DNA ratio".
 *   FlowSeq, 12 log-spaced bins, GFP/mCherry
 *     "we sorted cells into 12 log-spaced bins of varying
 *      GFP/mCherry ratios; isolated, amplified, and barcoded DNA from
 *      each of the bins; and then used high-throughput sequencing to
 *      count the number of constructs that fell into each bin".
 *
 * NOTHING ELSE IS PRINTED.  No read counts, no detection rate, no
 * expression range: they are in the paper but not on this slide,
 * because the slide's job is the design and the three readouts.
 *
 * COLOR, as the attention ladder and not as an identity map.  The two
 * VARIABLE slots are the whole point of the experiment, so they are
 * the two promoted hues: promoter blue, RBS vermillion.  The reporter
 * they drive is rule-gray, because it never changes.  The barcode is
 * amber with BLACK text, which is the deck's standing rule for amber.
 * The internal standard is muted throughout -- it is deliberately the
 * quietest thing on the slide, which is what an internal standard is.
 * No hex appears here that is not in palette.css.
 *
 * THE BIN ROW IS DRAWN EMPTY ON PURPOSE.  Twelve identical outlined
 * boxes claim only that there were twelve bins, which the paper says.
 * Drawing a distribution across them would be inventing a shape, and
 * FIGURE-CONTRACT.md s6 forbids that.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

/* ---- palette.css, nothing else ------------------------------------ */
const INK   = "#111111";
const BLUE  = "#004373";
const VERM  = "#ba3a13";
const AMBER = "#a99011";
const MUTED = "#767676";
const RULE  = "#e2e2e2";
const PAPER = "#ffffff";

const W = 1480, H = 620;

/* ---- primitives ---------------------------------------------------- */
function esc(s){
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;");
}

function rect(x, y, w, h, fill, stroke, sw){
  return '<rect x="' + x + '" y="' + y + '" width="' + w +
         '" height="' + h + '" fill="' + fill + '"' +
         (stroke ? ' stroke="' + stroke + '" stroke-width="' +
                   (sw || 1.5) + '"' : "") + '/>';
}

function text(x, y, s, size, fill, anchor, weight){
  return '<text x="' + x + '" y="' + y + '" font-family="inherit"' +
         ' font-size="' + size + '" fill="' + fill + '"' +
         (anchor ? ' text-anchor="' + anchor + '"' : "") +
         (weight ? ' font-weight="' + weight + '"' : "") +
         '>' + esc(s) + '</text>';
}

function line(x1, y1, x2, y2, stroke, sw){
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 +
         '" y2="' + y2 + '" stroke="' + stroke +
         '" stroke-width="' + (sw || 1.6) + '"/>';
}

/* An arrowhead as a path.  Page-global marker ids are forbidden. */
function arrow(x1, y, x2, stroke){
  const d = x2 > x1 ? 1 : -1;
  return line(x1, y, x2 - d * 9, y, stroke, 1.6) +
         '<path d="M' + x2 + ' ' + y + ' L' + (x2 - d * 11) + ' ' +
         (y - 5) + ' L' + (x2 - d * 11) + ' ' + (y + 5) + ' Z" fill="' +
         stroke + '"/>';
}

/* A labelled segment of the construct. */
function seg(x, w, y, h, fill, label, labelFill, size){
  return rect(x, y, w, h, fill, fill === PAPER ? MUTED : null) +
         text(x + w / 2, y + h / 2 + size * 0.35, label, size,
              labelFill, "middle");
}

/* ---- the construct ------------------------------------------------- */
function construct(){
  const Y = 130, HH = 48;
  let s = "";

  /* the plasmid runs on past both ends of what is drawn */
  s += line(180, Y + HH / 2, 1080, Y + HH / 2, INK, 2);

  s += seg(240, 200, Y, HH, BLUE,  "promoter",        PAPER, 22);
  s += seg(440, 140, Y, HH, VERM,  "RBS",             PAPER, 22);
  s += seg(580, 290, Y, HH, RULE,  "superfolder GFP", INK,   22);
  s += seg(870, 150, Y, HH, AMBER, "barcode",         INK,   22);

  /* the two slots that vary, and how many choices each had */
  s += line(340, Y - 2, 340, Y - 16, BLUE, 1.6);
  s += text(340, Y - 24, "114 of these", 21, BLUE, "middle");
  s += line(510, Y - 2, 510, Y - 16, VERM, 1.6);
  s += text(510, Y - 24, "111 of these", 21, VERM, "middle");

  /* the internal standard, deliberately the quietest thing here */
  const Y2 = 232, H2 = 40;
  s += text(560, Y2 + 27, "on the same plasmid:", 20, MUTED, "end");
  s += seg(580, 130, Y2, H2, MUTED, "PLTetO-1", PAPER, 18);
  s += seg(710, 170, Y2, H2, PAPER, "mCherry",  MUTED, 18);
  s += text(900, Y2 + 20, "constant in every cell — the internal",
            19, MUTED);
  s += text(900, Y2 + 44, "standard every ratio is taken against",
            19, MUTED);

  return s;
}

/* ---- the three readouts -------------------------------------------- */
const READS = [
  ["DNA-seq",  "how many copies of each construct are in the pool"],
  ["RNA-seq",  "how much message each one makes, per copy of its DNA"],
  ["FlowSeq",  "sort the cells by GFP/mCherry, then sequence each bin"]
];

function readouts(){
  let s = text(40, 352, "one pool, three measurements", 27, INK,
               null, 700);
  READS.forEach(function(r, i){
    const y = 410 + i * 58;
    s += text(40,  y, r[0], 24, INK, null, 700);
    s += text(220, y, r[1], 21, INK);
  });

  /* the sort: twelve bins, drawn empty because only their number is
     a fact of the paper */
  const X0 = 1000, BW = 28, GAP = 5, BY = 480, BH = 54;
  s += text(1195, BY - 14, "12 log-spaced bins", 18, MUTED, "middle");
  for (let i = 0; i < 12; i++)
    s += rect(X0 + i * (BW + GAP), BY, BW, BH, PAPER, INK, 1.4);
  const X1 = X0 + 12 * (BW + GAP) - GAP;
  s += arrow(X0, BY + BH + 22, X1, MUTED);
  s += text(X0, BY + BH + 48, "dimmer", 17, MUTED);
  s += text(X1, BY + BH + 48, "brighter", 17, MUTED, "end");

  return s;
}

/* ---- assembly ------------------------------------------------------ */
function draw(){
  return text(40, 58,
         "every combination of promoter and RBS: 12,653 constructs, "
       + "made as one oligo pool", 27, INK, null, 700)
       + construct()
       + readouts();
}

const ALT = "The design of the Kosuri library and how it was read. "
  + "One construct runs left to right along a plasmid: a promoter, a "
  + "ribosome binding site, superfolder GFP, and a barcode. The "
  + "promoter and the ribosome binding site are the two slots that "
  + "vary, marked 114 of these and 111 of these, and every "
  + "combination was made, 12,653 constructs in one oligo pool. On "
  + "the same plasmid, quietly below, PLTetO-1 drives mCherry at a "
  + "constant level as the internal standard every ratio is taken "
  + "against. From that one pool come three measurements: DNA-seq "
  + "for how many copies of each construct are in the pool, RNA-seq "
  + "for how much message each one makes per copy of its DNA, and "
  + "FlowSeq, which sorts the cells by their GFP to mCherry ratio "
  + "into twelve log-spaced bins, drawn at the right as a row of "
  + "twelve boxes running from dimmer to brighter, and sequences "
  + "each bin.";

function fill(){
  const el = document.querySelector('[data-fig="compose"]');
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
