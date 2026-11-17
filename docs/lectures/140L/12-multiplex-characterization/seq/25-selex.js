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
 * WHAT THE DEVICE PANEL CLAIMS, AND WHERE EACH BIT COMES FROM.  All
 * from Lou et al.'s Fig. 2 legend and Methods, quoted here so nobody
 * has to take it on trust:
 *   two streams that do not mix
 *     "The laminar flow architecture prevents the sample and the
 *      buffer streams from mixing."  Two inlets, "driven by 2
 *      independently controlled syringe pumps".
 *   nickel strips, magnetized from outside
 *     "An external magnet is placed in the dotted area to magnetize
 *      the Ni strips embedded within the microchannel", producing
 *      "localized magnetic field gradients via ferromagnetic patterns
 *      imbedded in the microchannel".
 *   the beads walk across, the unbound carries straight on
 *     "Target protein-coated magnetic beads are selectively guided by
 *      the combined mechanical forces along the Ni strips and eluted
 *      through the product outlet, whereas unbound aptamers are
 *      directed into the waste outlets."
 * Nothing about bead counts, channel dimensions, flow rates or field
 * strength is drawn, because none of it is the point of the slide.
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

const W = 1480, H = 560;

function esc(s){
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;");
}

function text(x, y, s, size, fill, anchor, weight){
  return '<text x="' + x + '" y="' + y + '" font-family="inherit"' +
         ' font-size="' + size + '" fill="' + fill + '"' +
         (anchor ? ' text-anchor="' + anchor + '"' : "") +
         (weight ? ' font-weight="' + weight + '"' : "") +
         '>' + esc(s) + '</text>';
}

function rect(x, y, w, h, fill, stroke, sw){
  return '<rect x="' + x + '" y="' + y + '" width="' + w +
         '" height="' + h + '" fill="' + fill + '"' +
         (stroke ? ' stroke="' + stroke + '" stroke-width="' +
                   (sw || 1.5) + '"' : "") + '/>';
}

function line(x1, y1, x2, y2, stroke, sw, dash){
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 +
         '" y2="' + y2 + '" stroke="' + stroke +
         '" stroke-width="' + (sw || 1.6) + '"' +
         (dash ? ' stroke-dasharray="' + dash + '"' : "") + '/>';
}

/* arrowheads are drawn as paths; a page-global marker id is forbidden */
function arrow(x1, y, x2, stroke){
  return line(x1, y, x2 - 9, y, stroke, 2) +
         '<path d="M' + x2 + ' ' + y + ' L' + (x2 - 12) + ' ' + (y - 6) +
         ' L' + (x2 - 12) + ' ' + (y + 6) + ' Z" fill="' + stroke + '"/>';
}

function dot(x, y, r, fill){
  return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' +
         fill + '"/>';
}

/* ---- left: one round on the chip ----------------------------------- */
const CX0 = 150, CX1 = 600, CY0 = 150, CY1 = 300, MID = 225;

function chip(){
  let s = text(40, 56, "one round on the chip", 24, INK, null, 700);

  s += rect(CX0, CY0, CX1 - CX0, CY1 - CY0, PAPER, INK, 2);
  /* the two streams run side by side and never mix */
  s += line(CX0, MID, CX1, MID, MUTED, 1.6, "6 5");

  /* the ferromagnetic patterns the beads are walked along */
  for (let i = 0; i < 6; i++)
    s += line(200 + i * 65, CY1 - 5, 270 + i * 65, CY0 + 5, MUTED, 2);
  s += text(CX0 + 24, 138, "nickel strips, magnetized from outside",
            17, MUTED);

  /* beads crossing out of the sample stream into the buffer stream */
  [[210,285],[285,250],[360,215],[435,190],[510,175],[585,170]]
    .forEach(function(p){ s += dot(p[0], p[1], 7, BLUE); });

  /* everything unbound stays low and carries straight on */
  for (let i = 0; i < 6; i++)
    s += line(225 + i * 65, 292, 253 + i * 65, 292, MUTED, 2.5);

  /* inlets and outlets */
  s += text(40, 193, "buffer", 19, MUTED);
  s += arrow(100, 187, CX0, MUTED);
  s += text(40, 268, "sample", 19, MUTED);
  s += arrow(100, 262, CX0, MUTED);

  s += arrow(CX1, 187, 680, INK);
  s += text(690, 194, "product", 19, INK, null, 700);
  s += arrow(CX1, 262, 680, MUTED);
  s += text(690, 269, "waste", 19, MUTED);

  s += text(40, 342,
       "sample = the library, plus magnetic beads coated with the target",
       18, MUTED);
  s += text(40, 384,
       "product: the beads, and whatever stayed stuck to them", 20, INK);
  s += text(40, 412,
       "waste: everything that did not", 20, MUTED);
  s += text(40, 456,
       "then PCR the product, make it single-stranded, and run it again",
       20, INK);
  return s;
}

/* ---- right: what the sequencing adds ------------------------------- */
const RX = 820, B0 = 980, BMAX = 280;

const SEQS = [
  { r1:  20, r3: 260, word: "climbs", hot: true  },
  { r1: 240, r3: 250, word: "flat",   hot: false },
  { r1: 120, r3:  55, word: "falls",  hot: false }
];

function reads(){
  let s = text(RX, 56, "what the sequencing adds", 24, INK, null, 700);
  s += text(RX, 92, "reads for each sequence, round 1 against round 3",
            19, MUTED);

  SEQS.forEach(function(q, i){
    const y = 140 + i * 90;
    s += text(RX, y + 26, "sequence " + (i + 1), 20, INK, null, 700);
    s += text(965, y + 14, "R1", 15, MUTED, "end");
    s += text(965, y + 38, "R3", 15, MUTED, "end");
    s += rect(B0, y,      BMAX * q.r1 / 280, 18, MUTED);
    s += rect(B0, y + 24, BMAX * q.r3 / 280, 18, BLUE);
    s += text(1290, y + 28, q.word, 20, q.hot ? VERM : MUTED, null,
              q.hot ? 700 : null);
  });

  s += text(RX, 420,
       "abundance at the end cannot tell sequence 1 from sequence 2.",
       21, INK);
  s += text(RX, 450, "The change across rounds can.", 21, INK, null, 700);
  s += text(RX, 492,
       "more than 10 million sequences followed through every round;",
       18, MUTED);
  s += text(RX, 516,
       "aptamers to PDGF-BB with a Kd under 3 nM in three rounds",
       18, MUTED);
  s += text(1440, 544, "bar heights schematic", 16, MUTED, "end");
  return s;
}

function draw(){
  return chip() + line(790, 100, 790, 520, RULE, 2) + reads();
}

const ALT = "Two panels. On the left, one round on the chip: a "
  + "microfluidic channel with two inlets, buffer above and sample "
  + "below, the sample being the library plus magnetic beads coated "
  + "with the target. A dashed line down the middle marks that the "
  + "two streams do not mix. Diagonal nickel strips, magnetized from "
  + "outside, cross the channel, and the beads are drawn walking up "
  + "along them out of the sample stream and into the buffer stream, "
  + "leaving by the product outlet, while everything unbound stays "
  + "low and carries straight on to waste. The product is then PCR'd, "
  + "made single-stranded and run again. On the right, what the "
  + "sequencing adds: for each of three sequences, a round one bar "
  + "and a round three bar. Sequence one starts tiny and ends large, "
  + "marked climbs. Sequence two is large in both rounds, marked "
  + "flat. Sequence three shrinks, marked falls. Abundance at the end "
  + "cannot tell sequence one from sequence two; the change across "
  + "rounds can. More than ten million sequences were followed "
  + "through every round, giving aptamers to PDGF-BB with a Kd under "
  + "3 nM in three rounds. The bar heights are schematic.";

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
