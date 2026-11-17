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
 * SECOND DRAFT, AND WHY.  The first version drew the chip as a plain
 * rectangle with diagonals in it.  JCA: "That does not resemble any
 * apparatus, and it is too abstract to be comprehensible."  He was
 * right, and the cause was the oldest mistake in FIGURE-CONTRACT.md:
 * it was built from the Methods prose without rendering Lou et al.
 * Fig. 2 and LOOKING at it.  Rendered at 130 dpi and redrawn against
 * it.  What the figure shows that the prose did not:
 *   - the channel is a LENS, wide in the middle and tapered at both
 *     ends, not a rectangle;
 *   - there are THREE inlets, not two: sample, buffer, sample, with
 *     the buffer in the MIDDLE and a sample stream on either side of
 *     it.  The first draft had buffer above and sample below, which
 *     is simply not the device;
 *   - likewise three outlets: waste, product, waste, product in the
 *     middle;
 *   - the beads start at BOTH outer edges and converge on the
 *     centreline as they travel, which is the picture;
 *   - the syringe pumps, the chip body and the external magnet are
 *     all in Fig. 2A, and they are what make the thing read as an
 *     apparatus rather than a diagram.
 * The text confirms the geometry: beads "are selectively transported
 * from the sample stream into the buffer stream", and "After the
 * magnetic particles reach the buffer stream at the center of the
 * device, they are eluted through the Product outlet."
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

/* ---- left: one round on the chip ----------------------------------- *
 * Geometry from Lou et al. Fig. 2A (the photograph: two syringe pumps,
 * the chip, the magnet area, the collection tube) and Fig. 2C (the
 * schematic: three inlets, lens-shaped channel, nickel strips, three
 * outlets, beads converging on the centreline).
 * ------------------------------------------------------------------ */
const CL = 240;                       /* the channel's centreline      */

function syringe(y, label){
  let s = rect(58, y - 18, 75, 36, PAPER, INK, 2);
  s += line(50, y - 16, 50, y + 16, INK, 3);     /* plunger flange     */
  s += line(50, y, 78, y, INK, 3);               /* plunger rod        */
  s += rect(133, y - 5, 11, 10, INK);            /* nozzle             */
  s += text(50, y + 44, label, 17, MUTED);
  return s;
}

function chip(){
  let s = text(40, 60, "one round on the chip", 24, INK, null, 700);

  /* the two pumps, and the tubing into the three ports */
  s += syringe(168, "buffer");
  s += syringe(348, "sample: library + beads");
  s += '<path d="M144 168 L210 168 L210 ' + CL + ' L250 ' + CL +
       '" fill="none" stroke="' + MUTED + '" stroke-width="2.5"/>';
  s += '<path d="M144 348 L185 348 L185 196 L250 196" fill="none" '
     + 'stroke="' + MUTED + '" stroke-width="2.5"/>';
  s += '<path d="M185 294 L250 294" fill="none" stroke="' + MUTED
     + '" stroke-width="2.5"/>';

  /* the chip itself */
  s += '<rect x="250" y="140" width="470" height="200" rx="12" fill="'
     + PAPER + '" stroke="' + INK + '" stroke-width="2"/>';

  /* three feed channels in, three out, converging on the lens tips */
  [[250,196,300,232],[250,CL,300,CL],[250,294,300,248]].forEach(function(c){
    s += '<line x1="' + c[0] + '" y1="' + c[1] + '" x2="' + c[2] +
         '" y2="' + c[3] + '" stroke="' + RULE +
         '" stroke-width="11" stroke-linecap="round"/>';
  });
  [[670,232,720,196],[670,CL,720,CL],[670,248,720,294]].forEach(function(c){
    s += '<line x1="' + c[0] + '" y1="' + c[1] + '" x2="' + c[2] +
         '" y2="' + c[3] + '" stroke="' + RULE +
         '" stroke-width="11" stroke-linecap="round"/>';
  });

  /* the channel: a lens, wide in the middle, tapered at both ends */
  s += '<path d="M300 ' + CL + ' L360 180 L610 180 L670 ' + CL
     + ' L610 300 L360 300 Z" fill="' + RULE + '" stroke="' + INK
     + '" stroke-width="1.8"/>';

  /* the ferromagnetic strips the beads are walked along */
  for (let i = 0; i < 6; i++){
    const x0 = 368 + i * 34;
    s += line(x0, 296, x0 + 50, 184, MUTED, 3);
  }

  /* unbound DNA stays in its own stream, top and bottom */
  for (let i = 0; i < 6; i++){
    s += line(390 + i * 40, 190, 408 + i * 40, 190, MUTED, 2.5);
    s += line(390 + i * 40, 290, 408 + i * 40, 290, MUTED, 2.5);
  }

  /* the beads leave both sample streams and converge on the middle */
  for (let i = 0; i < 6; i++){
    s += dot(378 + i * 38, 200 + i * 8, 6.5, BLUE);
    s += dot(378 + i * 38, 280 - i * 8, 6.5, BLUE);
  }
  s += dot(620, CL, 6.5, BLUE);

  /* out: waste above and below, product down the middle */
  s += line(720, 196, 768, 196, MUTED, 2.5);
  s += text(776, 202, "waste", 17, MUTED);
  s += line(720, 294, 768, 294, MUTED, 2.5);
  s += text(776, 300, "waste", 17, MUTED);
  s += line(720, CL, 836, CL, INK, 2.5);
  s += '<path d="M838 222 L872 222 L872 282 L855 300 L838 282 Z" fill="'
     + PAPER + '" stroke="' + INK + '" stroke-width="2"/>';
  s += text(855, 322, "product", 18, INK, "middle", 700);

  /* the magnet sits under the chip, outside it */
  s += '<rect x="360" y="352" width="250" height="26" fill="none" '
     + 'stroke="' + MUTED + '" stroke-width="2" stroke-dasharray="6 5"/>';
  s += text(520, 398, "external magnet, under the chip", 17, MUTED,
            "middle");

  s += text(40, 452,
       "the beads cross out of the sample streams into the buffer", 19,
       INK);
  s += text(40, 478,
       "unbound DNA never leaves its own stream, so it all goes to waste",
       19, MUTED);
  s += text(40, 510,
       "then PCR the product, make it single-stranded, and run it again",
       19, INK);
  return s;
}

/* ---- right: what the sequencing adds ------------------------------- */
const RX = 960, B0 = 960, BMAX = 300;

const SEQS = [
  { r1:  20, r3: 280, word: "climbs", hot: true  },
  { r1: 255, r3: 268, word: "flat",   hot: false },
  { r1: 130, r3:  58, word: "falls",  hot: false }
];

function reads(){
  let s = text(RX, 60, "what the sequencing adds", 24, INK, null, 700);
  s += text(RX, 92, "upper bar: round 1", 17, MUTED);
  s += text(RX, 114, "lower bar: round 3", 17, MUTED);

  SEQS.forEach(function(q, i){
    const y = 160 + i * 86;
    s += text(RX, y, "sequence " + (i + 1), 19, INK, null, 700);
    s += rect(B0, y + 10, BMAX * q.r1 / 280, 17, MUTED);
    s += rect(B0, y + 32, BMAX * q.r3 / 280, 17, BLUE);
    s += text(1290, y + 2, q.word, 20, q.hot ? VERM : MUTED, null,
              q.hot ? 700 : null);
  });

  s += text(RX, 452,
       "abundance at the end cannot tell", 19, INK);
  s += text(RX, 478,
       "sequence 1 from sequence 2. The change", 19, INK);
  s += text(RX, 504,
       "across rounds can.", 19, INK, null, 700);
  s += text(1440, 538, "bar heights schematic", 15, MUTED, "end");
  return s;
}

function draw(){
  return chip() + line(930, 100, 930, 540, RULE, 2) + reads();
}

const ALT = "Two panels. On the left, one round on the chip, drawn "
  + "as the apparatus: two syringe pumps at the far left, one of "
  + "buffer and one of sample, the sample being the library plus "
  + "magnetic beads coated with the target. Tubing runs into a chip "
  + "with three feed channels, the sample splitting to the outer two "
  + "and the buffer going to the middle. They converge into one "
  + "lens-shaped channel, wide in the middle and tapered at both "
  + "ends, crossed by diagonal nickel strips magnetized by a magnet "
  + "drawn underneath the chip. The beads are shown leaving both "
  + "outer sample streams and converging on the centreline as they "
  + "travel, while unbound DNA stays in its own stream at the top and "
  + "bottom edges. Three channels leave: waste above, waste below, "
  + "and the product down the middle into a collection tube. The "
  + "product is then amplified, made single-stranded and run again. "
  + "On the right, what the sequencing adds: for each of three "
  + "sequences, an upper bar for round one and a lower bar for round "
  + "three. Sequence one starts tiny and ends large, marked climbs. "
  + "Sequence two is large in both, marked flat. Sequence three "
  + "shrinks, marked falls. Abundance at the end cannot tell "
  + "sequence one from sequence two; the change across rounds can. "
  + "The bar heights are schematic.";

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
