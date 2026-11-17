/* ------------------------------------------------------------------ *
 * 14-nanopore.js : nanopore sequencing, drawn and built in five steps.
 *
 * Fills  [data-nano]  on the "Nanopore sequencing" slide of 02-tools.html
 * (the slide between the two Illumina instrument slides and "The other
 * platforms").  NEW FIGURE: the source slide carried no figure of its
 * own, only the note and a nanoporetech.com credit, so there is nothing
 * here being reproduced -- this is a mechanism drawing we are supplying.
 *
 * WHY IT EXISTS.  JCA, 2026-11-17, asked for "an animation explaining
 * nanopore and provide its stats".  Illumina got five slides of
 * construct anatomy plus two of instrument specs; nanopore is a
 * genuinely different physical measurement and was being asserted
 * rather than shown.
 *
 * HOW IT ANIMATES, AND WHY NOT A SEQUENCE.  This uses data-build, not
 * Deck.sequence.  Two reasons, and the second is the load-bearing one:
 * the slide's narration is JCA's own verbatim source note, which must
 * stay THE narration (a sequence would replace it with per-step notes,
 * and none are written here); and verify_notes.py skips the note
 * template of any article carrying data-seq, so putting a sequence on
 * this slide would silently switch off the check that keeps his note
 * honest against the pptx.  Five <g data-build="N"> groups, revealed
 * one click at a time by deck.js.
 *
 * WHAT EACH STEP SHOWS.  The order follows the mechanism as JCA's note
 * states it -- "uses a voltage to drive the DNA through a protein-based
 * hole in a membrane.  As the DNA goes through, there are current
 * differences depending on the base passing through, which can be
 * interpreted as sequence."
 *   1  the membrane, the protein pore through it, the electrodes and
 *      the voltage across them, and the ion current through the open
 *      pore.
 *   2  a long single strand up in the cis chamber, fed down into the
 *      pore by a motor enzyme and running out the far side.  5' leads,
 *      so the free end left behind in the chamber is the 3' one and
 *      carries a HALF barb, per house convention for nucleic acid ends.
 *   3  the constriction magnified, with the bases that are in it at
 *      this instant, and a ring marking the same spot on the scene.
 *   4  the current trace underneath, with the stretch belonging to
 *      those bases marked, and the basecalled sequence under it.
 *   5  the stats strip.
 *
 * THE PALETTE, AS A LADDER AND NOT AN IDENTITY MAP.
 *   ink   the apparatus: membrane, pore walls, motor, electrodes, axes,
 *         the voltage arrow.  All of it is scenery.
 *   blue  ONE object, followed the whole way across the figure -- the
 *         DNA strand, continuing as the current trace it produces.
 *         That continuity is the figure's argument, which is why blue
 *         is spent on it and on nothing else.
 *   verm  the moment of measurement: the constriction, the two bases
 *         standing in it, the stretch of trace and the two called bases
 *         that came from them, and the accuracy figure in the strip,
 *         which is the slide's point.  Blue was already taken.
 *   muted secondary labels.  rule/paper: fills lighter than their own
 *         stroke, per the contract.  Amber is not used.
 * No legend, because no hue is standing for a class of object.
 *
 * NUMBERS.  Exactly one number is printed on this figure.
 *
 *   99.75% raw-read accuracy, which is Q26.
 *     Quoted from nanoporetech.com/accuracy, for Dorado v5 basecalling
 *     with the Ligation Sequencing Kit V14 on R10.4.1 flow cells; those
 *     conditions are printed on the figure beside the number, because
 *     a nanopore accuracy figure means nothing without them.
 *     JCA's own note for this slide says the same thing in his words:
 *     "Accuracy used to be the objection here-the reads were too rough
 *     to call barcodes reliably-but raw-read accuracy is now around
 *     99.75%, so that objection has gone and these are reasonable
 *     instruments for multiplex characterization."
 *
 *   READ LENGTH: NO FIGURE IS PRINTED, deliberately.  Long reads are
 *     the other half of why the platform matters, but no sourced length
 *     figure for nanopore was established for this deck -- an earlier
 *     pass looked and could not find one it could cite.  The strip
 *     therefore says "long reads" and "one molecule read end to end,
 *     however long it is", with no kilobase figure anywhere.  Do not
 *     add one without a source, and if you find one, record its
 *     sentence here.  (The PacBio read lengths on the next slide are
 *     PacBio's and stay there.)
 *
 * SCHEMATIC, AND THE FIGURE SAYS SO.  The trace is drawn to the
 * described shape of a squiggle -- stepped levels, one per base passing
 * -- not traced from a real signal, and the bases written on it are an
 * arbitrary run.  Small print under the trace says "trace schematic;
 * levels are not data".  Do not read a current value off it.  Likewise
 * the number of bases drawn standing in the constriction is drawn, not
 * quoted: no k-mer length is claimed anywhere in words.
 *
 * Authored at 1480x620.  The slide has an h1 AND a p.sub, which is
 * about 34px more furniture than a bare h1, hence 620 rather than the
 * contract's default 640.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", BLUE = "#004373",
      MUTED = "#767676", RULE = "#e2e2e2", PAPER = "#ffffff";

function txt(x, y, size, fill, s, opt){
  const o = opt || {};
  return '<text x="' + x + '" y="' + y + '" font-family="inherit" font-size="' +
         size + '" fill="' + fill + '"' +
         (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') +
         (o.bold ? ' font-weight="700"' : '') + '>' + s + '</text>';
}

/* ---- LAYOUT -------------------------------------------------------- *
 *   scene   x  60-760,  y  56-316   membrane, pore, voltage, the strand
 *   zoom    x 800-1440, y  56-312   the constriction, magnified
 *   trace   x 120-1420, y 340-500   current against time, then the calls
 *   strip   y 534-600                the stats
 * ------------------------------------------------------------------ */

const CH_X0 = 60, CH_X1 = 760, CH_Y0 = 84, CH_Y1 = 316;   /* the chamber  */
const MEM_Y0 = 190, MEM_Y1 = 238;                          /* the membrane */
const PCX = 330;                                           /* pore centre  */

/* ---- 1. the membrane, the pore, the voltage ------------------------ */
function apparatus(){
  let s = '<g>';

  s += txt(CH_X0, 70, 26, INK, "a voltage across a membrane", {bold:true});

  /* the well, as a hairline box: everything happens inside it */
  s += '<rect x="' + CH_X0 + '" y="' + CH_Y0 + '" width="' + (CH_X1 - CH_X0) +
       '" height="' + (CH_Y1 - CH_Y0) + '" rx="10" fill="' + PAPER +
       '" stroke="' + RULE + '" stroke-width="2"/>';

  /* the membrane: a grey band with its two leaflet faces drawn in */
  s += '<rect x="' + CH_X0 + '" y="' + MEM_Y0 + '" width="' + (CH_X1 - CH_X0) +
       '" height="' + (MEM_Y1 - MEM_Y0) + '" fill="' + RULE + '"/>';
  [MEM_Y0, MEM_Y1].forEach(function(y){
    s += '<line x1="' + CH_X0 + '" y1="' + y + '" x2="' + CH_X1 + '" y2="' + y +
         '" stroke="' + INK + '" stroke-width="2"/>';
  });
  s += txt(CH_X0 + 12, MEM_Y1 + 22, 19, MUTED, "lipid membrane");

  /* the pore: an hourglass through the membrane, white on the grey band
     so the protein reads as a separate object without a new colour */
  s += '<path d="M 258 144 L 272 144 L 317 206 L 317 226 L 290 284 L 258 284 Z" ' +
       'fill="' + PAPER + '" stroke="' + INK + '" stroke-width="3"/>';
  s += '<path d="M 402 144 L 388 144 L 343 206 L 343 226 L 370 284 L 402 284 Z" ' +
       'fill="' + PAPER + '" stroke="' + INK + '" stroke-width="3"/>';
  s += '<line x1="368" y1="270" x2="410" y2="264" stroke="' + MUTED +
       '" stroke-width="2"/>';
  s += txt(416, 270, 21, INK, "protein pore");

  s += txt(416, 176, 19, MUTED, "open pore: ions flow steadily");

  /* the electrodes and the field between them */
  s += txt(706, 158, 30, INK, "&#8722;", {anchor:"middle"});
  s += txt(706, 300, 30, INK, "+", {anchor:"middle"});
  s += '<line x1="706" y1="172" x2="706" y2="264" stroke="' + INK +
       '" stroke-width="3"/>';
  s += '<path d="M 706 276 L 699 260 L 713 260 Z" fill="' + INK + '"/>';
  s += '<text transform="translate(684,218) rotate(-90)" text-anchor="middle" ' +
       'font-family="inherit" font-size="21" fill="' + INK + '">voltage</text>';

  return s + '</g>';
}

/* ---- 2. the strand, and the motor that feeds it -------------------- */
function strand(){
  let s = '<g data-build="1">';

  /* the loose molecule in the cis chamber, ending at the motor */
  s += '<path d="M 80 182 C 120 196, 118 140, 150 132 C 186 122, 196 176, ' +
       '232 166 C 268 156, 258 110, 292 102 C 310 98, 322 104, 330 112" ' +
       'fill="none" stroke="' + BLUE + '" stroke-width="5" stroke-linecap="round"/>';
  /* 3' end: a HALF barb, never a full arrowhead */
  s += '<path d="M 80 182 L 94 172" fill="none" stroke="' + BLUE +
       '" stroke-width="4" stroke-linecap="round"/>';
  s += txt(66, 170, 19, BLUE, "3&#8242;");

  /* through the pore and out the far side */
  s += '<line x1="' + PCX + '" y1="156" x2="' + PCX + '" y2="308" stroke="' +
       BLUE + '" stroke-width="5"/>';
  s += txt(PCX + 14, 304, 19, BLUE, "5&#8242;");

  /* the motor, sitting on the mouth of the pore */
  s += '<ellipse cx="' + PCX + '" cy="136" rx="48" ry="21" fill="' + PAPER +
       '" stroke="' + INK + '" stroke-width="3"/>';
  s += txt(PCX, 143, 19, INK, "motor", {anchor:"middle"});
  s += txt(416, 146, 19, MUTED, "a motor feeds the strand in");

  return s + '</g>';
}

/* ---- 3. the constriction, magnified -------------------------------- *
 * The link back to the scene is a vermillion ring round the real
 * constriction plus a vermillion panel title -- not a pair of leader
 * lines, which would have to cross the electrodes to get here.
 * ------------------------------------------------------------------ */
const ZX = 1000;                       /* channel centre in the zoom    */
const ZBASES = ["T", "G", "A", "C", "C"];
const ZY = [120, 154, 188, 222, 256];  /* 188 and 222 are in the gap    */

function zoom(){
  let s = '<g data-build="2">';

  /* mark the same spot on the scene */
  s += '<ellipse cx="' + PCX + '" cy="216" rx="40" ry="26" fill="none" stroke="' +
       VERM + '" stroke-width="3"/>';

  s += '<rect x="800" y="56" width="640" height="256" rx="10" fill="' + PAPER +
       '" stroke="' + RULE + '" stroke-width="2"/>';
  s += txt(820, 92, 23, VERM, "the constriction, magnified", {bold:true});

  /* the two walls, pinched towards each other in the middle */
  s += '<path d="M 860 118 L 920 118 L 920 172 L 972 186 L 972 210 L 920 224 ' +
       'L 920 252 L 860 252 Z" fill="' + PAPER + '" stroke="' + INK +
       '" stroke-width="3"/>';
  s += '<path d="M 1140 118 L 1080 118 L 1080 172 L 1028 186 L 1028 210 ' +
       'L 1080 224 L 1080 252 L 1140 252 Z" fill="' + PAPER + '" stroke="' +
       INK + '" stroke-width="3"/>';

  /* the strand standing in it */
  s += '<line x1="' + ZX + '" y1="100" x2="' + ZX + '" y2="272" stroke="' + BLUE +
       '" stroke-width="6"/>';
  /* the bases as beads ON the strand: a white core over its own stroke,
     which is what the contract allows for a fill lighter than its line */
  ZBASES.forEach(function(b, i){
    const y = ZY[i], hot = (y > 172 && y < 226);
    s += '<rect x="' + (ZX - 14) + '" y="' + (y - 20) + '" width="28" height="28" ' +
         'rx="6" fill="' + PAPER + '" stroke="' + (hot ? VERM : INK) +
         '" stroke-width="2.5"/>';
    s += txt(ZX, y, 21, hot ? VERM : INK, b, {anchor:"middle", bold:hot});
  });

  s += txt(1168, 182, 21, VERM, "the bases standing here");
  s += txt(1168, 208, 21, VERM, "set the current");
  s += txt(820, 290, 21, INK,
           "a different stretch of sequence lets a different current past");

  return s + '</g>';
}

/* ---- 4. the trace, and the calls that come out of it --------------- *
 * SCHEMATIC.  Stepped levels drawn to the described shape of a squiggle,
 * one step per base going past; not traced from a signal.  The figure
 * says so under the trace.
 * ------------------------------------------------------------------ */
const TX0 = 120, TBASE = 462, TW = 50, TN = 26;
const LEVELS = [0.62,0.48,0.71,0.55,0.34,0.44,0.66,0.80,0.52,0.38,0.58,0.74,
                0.46,0.63,0.30,0.50,0.68,0.42,0.77,0.56,0.36,0.60,0.49,0.72,
                0.41,0.64];
const CALLS = "GATTCAGCTTGACCATGGTAACGTCA".split("");
const HOT = [11, 12];                  /* the two bases drawn in the gap */

function level(i){ return TBASE - LEVELS[i] * 108; }

function run(i0, i1){
  const pts = [];
  for (let i = i0; i <= i1; i++){
    pts.push((TX0 + i * TW) + "," + level(i));
    pts.push((TX0 + (i + 1) * TW) + "," + level(i));
  }
  return pts.join(" ");
}

function trace(){
  let s = '<g data-build="3">';

  s += '<line x1="' + TX0 + '" y1="340" x2="' + TX0 + '" y2="' + TBASE +
       '" stroke="' + INK + '" stroke-width="2.5"/>';
  s += '<line x1="' + TX0 + '" y1="' + TBASE + '" x2="1420" y2="' + TBASE +
       '" stroke="' + INK + '" stroke-width="2.5"/>';
  s += '<text transform="translate(98,404) rotate(-90)" text-anchor="middle" ' +
       'font-family="inherit" font-size="21" fill="' + INK + '">current</text>';
  s += txt(1416, 452, 19, MUTED, "time", {anchor:"end"});

  s += '<polyline points="' + run(0, TN - 1) + '" fill="none" stroke="' + BLUE +
       '" stroke-width="3.5" stroke-linejoin="round"/>';
  s += '<polyline points="' + run(HOT[0], HOT[1]) + '" fill="none" stroke="' +
       VERM + '" stroke-width="5" stroke-linejoin="round"/>';

  CALLS.forEach(function(c, i){
    const hot = HOT.indexOf(i) >= 0;
    s += txt(TX0 + i * TW + TW / 2, 496, 21, hot ? VERM : INK, c,
             {anchor:"middle", bold:hot});
  });

  s += txt(TX0, 524, 21, INK, "a model reads the trace back as sequence");
  s += txt(1420, 524, 19, MUTED, "trace schematic; levels are not data",
           {anchor:"end"});

  return s + '</g>';
}

/* ---- 5. the stats -------------------------------------------------- */
function stats(){
  let s = '<g data-build="4">';
  s += '<line x1="60" y1="540" x2="1420" y2="540" stroke="' + RULE +
       '" stroke-width="2"/>';

  const cols = [
    [60,   "99.75% raw-read accuracy", VERM,
           "Q26 &#8212; Dorado v5, Kit V14, R10.4.1 flow cells"],
    [560,  "long reads", INK,
           "one molecule read end to end, however long it is"],
    [1020, "the molecule itself", INK,
           "read directly, not a copy made by synthesis"]
  ];
  cols.forEach(function(c){
    s += txt(c[0], 576, 26, c[2], c[1], {bold:true});
    s += txt(c[0], 602, 19, MUTED, c[3]);
  });
  return s + '</g>';
}

const ALT =
  "Nanopore sequencing, built up in five stages. First, a protein pore " +
  "sits in a lipid membrane dividing a well of salt solution, with a " +
  "negative electrode above and a positive one below, so a voltage pulls " +
  "ions steadily through the open pore. Second, a long single strand of " +
  "DNA lies loose in the upper chamber with its three prime end free, and " +
  "a motor enzyme on the mouth of the pore feeds it down through, five " +
  "prime end first, so it emerges on the far side. Third, the narrowest " +
  "part of the pore is magnified: the strand stands in the constriction " +
  "and the bases that happen to be in it are picked out. Fourth, a trace " +
  "of current against time runs along the bottom, a stepped squiggle with " +
  "one level per base going past; the stretch of trace belonging to those " +
  "bases is marked, and the basecalled sequence is written underneath, " +
  "with the same two bases marked. The trace is schematic and its levels " +
  "are not data. Last, the stats: raw-read accuracy of 99.75 percent, " +
  "which is Q26, for Dorado version 5 basecalling with the Ligation " +
  "Sequencing Kit V14 on R10.4.1 flow cells; long reads, one molecule read " +
  "end to end however long it is; and the molecule read directly rather " +
  "than as a copy made by synthesis.";

function figure(){
  return '<svg viewBox="0 0 1480 620" xmlns="http://www.w3.org/2000/svg" ' +
    'role="img" aria-label="' + ALT + '">' +
    apparatus() + strand() + zoom() + trace() + stats() + '</svg>';
}

function fill(){
  const el = document.querySelector("[data-nano]");
  if (!el) return;
  el.innerHTML = figure();
}
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
