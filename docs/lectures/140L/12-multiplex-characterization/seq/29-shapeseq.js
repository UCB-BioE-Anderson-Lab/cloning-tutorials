/* ------------------------------------------------------------------ *
 * 29-shapeseq.js : how the SHAPE reaction is read out by sequencing,
 * drawn from scratch and built in four steps.
 *
 * Fills  [data-shape]  on the SECOND of the two "SHAPE-Seq" slides of
 * 03-nucleic-acids.html (source 29).  It REPLACES img/29-shapeseq.png,
 * which is the Lucks 2011 paper's own two-panel protocol figure.
 *
 * WHY IT EXISTS.  JCA, 2026-11-17, on the published figure: "This
 * graphic is really incomprehensible.  I think you should rethink how
 * to present this and draw your own thing that is simpler and more
 * understandable."  The original is two lettered panels carrying about
 * thirty labelled objects -- both reagent arms, RNA hydrolysis, the
 * single-stranded DNA ligation, two Illumina adapter types, paired-end
 * read structure, read binning, back-to-back count plots, a maximum
 * likelihood step and a predicted fold -- at a size no one can read
 * from the back of a room.  This is a redraw of the MECHANISM, not a
 * reproduction, so the slide's credit line changes accordingly (the
 * slide carried no <p class="src"> for the image; the PMID belongs
 * here now -- JCA wires that, this file only draws).
 *
 * WHAT THIS SLIDE IS FOR, AND WHAT IT DOES NOT REPEAT.  The slide
 * before it (source 28) already teaches the chemistry: 1M7 acylates the
 * 2'-OH of a nucleotide that is flexible and does not where the
 * nucleotide is held by structure.  Nothing here re-teaches that.  This
 * slide is only about turning that chemistry into a sequencing readout
 * for many RNAs at once, which is what JCA's verbatim note says it is:
 * "SHAPE-Seq is a method developed in the Arkin lab by Julius Lucks
 * that enables the readout of the SHAPE reaction by deep sequencing
 * using a barcoding strategy.  This allows them to analyze the
 * structural properties of libraries RNAs."
 *
 * HOW IT ANIMATES, AND WHY NOT A SEQUENCE.  data-build, not
 * Deck.sequence, for the same two reasons as 14-nanopore.js, and the
 * second is load-bearing: the narration here is JCA's own verbatim
 * source note, and verify_notes.py SKIPS the note template of any
 * article carrying data-seq -- a sequence on this slide would silently
 * switch off the check that keeps that note honest against the pptx.
 * No step notes are written anywhere; his note is the narration.  The
 * opening state (the two tubes, each holding the same RNA with its
 * handle) sits OUTSIDE every build group, so the slide is not blank on
 * arrival.
 *
 * WHAT EACH STEP SHOWS, AND WHY IT IS THE SIMPLEST WAY TO SHOW IT.
 *   open  one RNA, 5' to 3', drawn twice -- once in the (+) 1M7 tube
 *         and once in the (-) DMSO tube -- with the handle on its 3'
 *         end marked as primer site plus barcode.  Two copies of one
 *         line is the whole apparatus; the comparison is the method.
 *   1     the adduct.  ONE filled dot on the (+) copy, nothing on the
 *         (-) copy.  One dot is enough: where it sits is the only
 *         thing that matters downstream, and the chemistry that put it
 *         there was the slide before.
 *   2     reverse transcription from the handle primer, drawn as a
 *         line growing right to left under each RNA.  On (+) it stops
 *         one base before the dot; on (-) it runs to the 5' end.  The
 *         cDNA's own 3' end is its growing tip, so the tip carries a
 *         HALF barb, per house convention.  Length -- one line against
 *         another -- is the measurement, so length is all that is
 *         drawn: no hydrolysis step, no ligation, no adapters.
 *   3     the barcode.  Three short RNAs, same handle, different
 *         barcode, under a title saying they ride in one tube.  This
 *         is the only thing on the slide that makes it MULTIPLEX, and
 *         three labelled stubs say it without a library diagram.
 *   4     the readout.  Stop positions counted along the sequence,
 *         (+) above the axis and (-) below, back to back as the paper
 *         plots them.  The distribution IS the structure signal, and a
 *         plot is the only honest way to show a distribution.
 *
 * THE PALETTE, AS A LADDER AND NOT AN IDENTITY MAP.
 *   ink   everything that is merely present: the RNA strands, the
 *         handles, the (-) control arm end to end, the axis, most text.
 *         The control is scenery on this slide -- it is there to be
 *         subtracted.
 *   blue  the one thing followed across the whole figure: the cDNA
 *         produced in the (+) arm, and the counts of where it stopped.
 *         That line and those bars are the same object at two scales,
 *         which is the figure's argument.
 *   verm  the modification and the fact of multiplexing -- the adduct,
 *         its label, the (+) 1M7 tube label, and the barcode block's
 *         title.  Blue was already taken by the readout.
 *   muted secondary labels and small print.  rule: the divider hairline.
 *         paper: the handle blocks, a fill lighter than their own stroke,
 *         which is what the contract allows.  Amber is not used.
 * No legend: no hue stands for a class of object, and the (+)/(-)
 * distinction is carried by position and by a printed label, never by
 * colour alone.
 *
 * NUMBERS.  Exactly one number is printed on this figure.
 *
 *   "a four-nucleotide barcode, one per RNA"
 *     Lucks et al. 2011 is not in the PMC open-access subset and its
 *     full text could not be fetched; the sentence quoted is from the
 *     group's open-access follow-up, Loughrey, Watters, Settle & Lucks,
 *     "SHAPE-Seq 2.0", Nucleic Acids Res 2014, PMC4245970, describing
 *     the v1.0 experiment of the 2011 paper (its ref 7):
 *       "All of the RNAs with the flanking structure cassettes
 *        contained a unique four-nucleotide bar code to multiplex
 *        SHAPE-Seq v1.0 experiments as described previously (7)."
 *     Printed American-style as "barcode"; the quote's "bar code" is
 *     left alone here in the header.
 *
 *   NO COUNT OF RNAs, NO READ COUNT, NO REACTIVITY VALUE is printed.
 *     The 2011 abstract's own scale claim is "hundreds of RNA
 *     molecules of arbitrary sequence" (PMID 21642531), but the figure
 *     draws three stubs and says three, so no number is asserted.  The
 *     bar plot has no numeric axis.
 *
 * WHAT THE PAPER SAYS, AND WHERE EACH DRAWN FACT COMES FROM.  Read via
 * eutils: efetch db=pubmed 21642531 for the abstract, elink to PMC
 * (PMC3131332, not in the OA subset), and the open-access SHAPE-Seq 2.0
 * paper PMC4245970 for the protocol, which states the v1.0 steps.
 *   - the adduct blocks reverse transcriptase, so cDNA length reports
 *     the modified position:
 *       "RT of the RNAs creates a pool of cDNAs, whose length
 *        distribution reflects the distribution of modification
 *        positions."                                   (PMC4245970)
 *   - why there is a (-) channel at all:
 *       "Control reactions are performed to account for RT fall-off at
 *        unmodified positions."                        (PMC4245970)
 *   - the two tubes are 1M7 and DMSO:
 *       "These reaction volumes were split and added to 5 ul 1M7 (10x,
 *        65 mM in dry dimethyl sulfoxide (DMSO)) and 5 ul dry DMSO to
 *        form the (+) and (-) reactions, respectively." (PMC4245970)
 *   - the primer anneals to a cassette on the 3' end and its tail
 *     carries sequencing adapter:
 *       "RT primer tails contain a portion of one of the required
 *        Illumina sequencing adapters"                 (PMC4245970)
 *   - back-to-back (+)/(-) counts along the sequence: the published
 *     figure this replaces, panel B, which plots them that way.
 *   - multiplexing scale and the maximum likelihood pipeline: the 2011
 *     abstract (PMID 21642531).
 *
 * WHAT I LEFT OUT OF THE ORIGINAL FIGURE, AND WHY.
 *   - RNA hydrolysis after RT, the single-stranded DNA ligation, the
 *     two Illumina adapter types, PCR, and paired-end read anatomy:
 *     library construction.  The Illumina construct already has five
 *     slides of its own in this deck; repeating it here is what made
 *     the original unreadable.
 *   - the (+) and (-) handles being two DIFFERENT tags, so both arms
 *     can be sequenced in one run.  True, and in the original, but it
 *     is a second barcoding idea stacked on the first and it crowds
 *     the one that matters.  The two arms are drawn as two tubes.
 *   - the maximum likelihood estimation step and the predicted
 *     secondary structure it constrains.  The figure stops at "the
 *     difference at each base is its reactivity", which is the point
 *     the note makes; modelling is where source 28's note already
 *     leaves the subject.
 *   - lettered panels A and B.  One picture, built in order.
 *
 * SCHEMATIC, AND THE FIGURE SAYS SO.  The bar plot is drawn to the
 * described shape -- (+) counts piling up at a few positions, (-)
 * counts low but not zero, with one position where both are high
 * because reverse transcriptase stops there on its own.  It is not
 * traced from data and carries no axis values; small print beside its
 * title says "schematic; counts are not data".  Do not read anything
 * off it.
 *
 * Authored at 1480x620.  The slide has an h1 and no p.sub.
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

function line(x1, y1, x2, y2, col, w){
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
         '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"/>';
}

/* A 3' end gets a HALF barb, never a full arrowhead.  dir is +1 when the
   strand runs left to right and the 3' end is its right tip, -1 when the
   strand grows right to left and the 3' end is its left tip. */
function barb(x, y, dir, col){
  return '<path d="M ' + x + ' ' + y + ' L ' + (x - dir * 20) + ' ' + (y - 13) +
         '" fill="none" stroke="' + col + '" stroke-width="4" ' +
         'stroke-linecap="round"/>';
}

/* ---- LAYOUT -------------------------------------------------------- *
 *   band 1   y  40-350   the two tubes: RNA, adduct, cDNA
 *   divider  y  366
 *   band 2L  x  60-620   the barcode, three RNAs in one tube
 *   band 2R  x 700-1440  the stop counts
 * ------------------------------------------------------------------ */

const RNA_X0 = 250, RNA_X1 = 1080;     /* the drawn RNA, 5' to 3'        */
const HAN_X0 = 910, HAN_X1 = 1040;     /* the handle block on that end   */
const PLUS_Y = 140, MINUS_Y = 256;     /* the two tubes                  */
const ADDUCT_X = 620;                  /* where 1M7 landed on the (+) RNA */
const STOP_X = 648;                    /* RT stops one base 3' of it     */
const RIGHT_X = 1150;                  /* the right-hand text column     */

/* ---- opening: one RNA, two tubes ----------------------------------- */
function rna(y){
  let s = "";
  /* the handle: a block interrupting the strand near its 3' end, drawn
     as a white core inside its own stroke */
  s += '<rect x="' + HAN_X0 + '" y="' + (y - 17) + '" width="' + (HAN_X1 - HAN_X0) +
       '" height="34" rx="6" fill="' + PAPER + '" stroke="' + INK +
       '" stroke-width="2"/>';
  s += line(RNA_X0, y, HAN_X0, y, INK, 5);
  s += line(HAN_X1, y, RNA_X1, y, INK, 5);
  s += barb(RNA_X1, y, 1, INK);
  s += txt(RNA_X0 - 14, y + 7, 19, INK, "5&#8242;", {anchor:"end"});
  s += txt(RNA_X1 + 10, y - 14, 19, INK, "3&#8242;");
  return s;
}

function opening(){
  let s = '<g>';
  s += txt(60, 62, 26, INK, "one RNA, split into two tubes", {bold:true});

  s += txt(60, PLUS_Y + 7, 23, VERM, "(+) 1M7", {bold:true});
  s += rna(PLUS_Y);

  s += txt(60, MINUS_Y + 7, 23, INK, "(&#8722;) DMSO", {bold:true});
  s += txt(60, MINUS_Y + 32, 19, MUTED, "control");
  s += rna(MINUS_Y);

  s += txt(HAN_X0, PLUS_Y - 44, 19, MUTED, "handle: primer site + barcode");
  return s + '</g>';
}

/* ---- 1. the adduct, on one arm only -------------------------------- */
function adduct(){
  let s = '<g data-build="1">';
  s += line(ADDUCT_X, PLUS_Y - 4, ADDUCT_X, PLUS_Y - 30, VERM, 4);
  s += '<circle cx="' + ADDUCT_X + '" cy="' + (PLUS_Y - 40) + '" r="11" fill="' +
       VERM + '"/>';
  s += txt(ADDUCT_X - 26, PLUS_Y - 34, 21, VERM, "2&#8242;-O adduct", {anchor:"end"});

  s += txt(RIGHT_X, PLUS_Y - 6, 21, VERM, "modified where");
  s += txt(RIGHT_X, PLUS_Y + 20, 21, VERM, "the RNA is flexible");

  s += txt(RIGHT_X, MINUS_Y + 2, 21, INK, "nothing modified");
  return s + '</g>';
}

/* ---- 2. reverse transcription, from the handle leftwards ----------- */
function extension(){
  let s = '<g data-build="2">';

  /* (+): primer on the handle, cDNA stopping one base before the dot */
  s += line(1030, PLUS_Y + 36, STOP_X, PLUS_Y + 36, BLUE, 5);
  s += barb(STOP_X, PLUS_Y + 36, -1, BLUE);
  s += txt(1046, PLUS_Y + 43, 19, BLUE, "primer");
  s += txt(RNA_X0, PLUS_Y + 76, 21, BLUE,
           "reverse transcription stops one base before the adduct");

  /* (-): nothing in the way, so it runs to the 5' end */
  s += line(1030, MINUS_Y + 36, RNA_X0 + 4, MINUS_Y + 36, INK, 5);
  s += barb(RNA_X0 + 4, MINUS_Y + 36, -1, INK);
  s += txt(1046, MINUS_Y + 43, 19, INK, "primer");
  s += txt(RNA_X0, MINUS_Y + 76, 21, INK,
           "with nothing in its way it runs to the 5&#8242; end");

  s += txt(RIGHT_X, MINUS_Y + 32, 19, MUTED, "reverse transcriptase also");
  s += txt(RIGHT_X, MINUS_Y + 57, 19, MUTED, "stops on its own, which is");
  s += txt(RIGHT_X, MINUS_Y + 82, 19, MUTED, "what this tube measures");
  return s + '</g>';
}

/* ---- 3. the barcode: what makes it multiplex ----------------------- */
const BC_Y = [446, 496, 546], BC_X0 = 150, BC_X1 = 590;
const BC_H0 = 420, BC_H1 = 560;        /* the handle block on each stub  */

function barcode(){
  let s = '<g data-build="3">';
  s += '<line x1="60" y1="366" x2="1440" y2="366" stroke="' + RULE +
       '" stroke-width="2"/>';
  s += txt(60, 412, 23, VERM, "many RNAs in one tube", {bold:true});

  BC_Y.forEach(function(y, i){
    s += txt(60, y + 7, 21, INK, "RNA " + (i + 1));
    s += '<rect x="' + BC_H0 + '" y="' + (y - 17) + '" width="' + (BC_H1 - BC_H0) +
         '" height="34" rx="6" fill="' + PAPER + '" stroke="' + INK +
         '" stroke-width="2"/>';
    s += line(BC_X0, y, BC_H0, y, INK, 5);
    s += line(BC_H1, y, BC_X1, y, INK, 5);
    s += barb(BC_X1, y, 1, INK);
    s += txt((BC_H0 + BC_H1) / 2, y + 7, 19, VERM, "barcode " + (i + 1),
             {anchor:"middle"});
  });

  s += txt(60, 596, 19, MUTED,
           "a four-nucleotide barcode, one per RNA, sorts the reads afterward");
  return s + '</g>';
}

/* ---- 4. the stop counts ------------------------------------------- *
 * SCHEMATIC.  Drawn to the described shape, not traced; no axis values.
 * Position 14 is high in BOTH arms, which is what the control is for.
 * ------------------------------------------------------------------ */
const AX_Y = 505, BAR_X0 = 776, BAR_W = 22, BAR_P = 31;
const PLUS_H  = [5,8,6,52,9,7,62,12,8,6,72,11,8,40,9,6,12,56,8,6];
const MINUS_H = [6,8,5, 9,7,8,11, 7,5,8,12, 7,5,38,7,5, 8, 9,7,5];

function counts(){
  let s = '<g data-build="4">';
  s += txt(700, 412, 23, BLUE, "count where it stopped", {bold:true});
  s += txt(1440, 412, 19, MUTED, "schematic; counts are not data",
           {anchor:"end"});

  s += '<line x1="760" y1="' + AX_Y + '" x2="1390" y2="' + AX_Y +
       '" stroke="' + INK + '" stroke-width="2.5"/>';
  s += txt(748, AX_Y - 24, 23, BLUE, "(+)", {anchor:"end", bold:true});
  s += txt(748, AX_Y + 38, 23, INK, "(&#8722;)", {anchor:"end", bold:true});

  PLUS_H.forEach(function(h, i){
    const x = BAR_X0 + i * BAR_P;
    s += '<rect x="' + x + '" y="' + (AX_Y - h) + '" width="' + BAR_W +
         '" height="' + h + '" fill="' + BLUE + '"/>';
    s += '<rect x="' + x + '" y="' + AX_Y + '" width="' + BAR_W +
         '" height="' + MINUS_H[i] + '" fill="' + INK + '"/>';
  });

  s += txt(1390, 568, 19, MUTED, "position along the RNA", {anchor:"end"});
  s += txt(700, 586, 21, INK, "each molecule is modified somewhere different");
  s += txt(700, 610, 21, INK,
           "the difference at each base is its reactivity");
  return s + '</g>';
}

const ALT =
  "How the SHAPE reaction is read out by sequencing, built up in four " +
  "stages. At the start, the same RNA is drawn twice, five prime end at " +
  "the left and three prime end at the right, once in a tube of 1M7 " +
  "labelled plus and once in a tube of DMSO labelled minus; the last " +
  "stretch of each three prime end is a handle carrying a primer site and " +
  "a barcode. First, a single adduct appears on the plus copy, at a " +
  "flexible position, and nothing appears on the minus copy. Second, " +
  "reverse transcription runs from a primer on the handle back toward the " +
  "five prime end: in the plus tube the cDNA stops one base before the " +
  "adduct, and in the minus tube it runs the whole way, since reverse " +
  "transcriptase stopping on its own is what the control measures. Third, " +
  "three different RNAs are drawn one above another, each with the same " +
  "handle but its own four-nucleotide barcode, which is what lets them " +
  "share one tube and be sorted apart afterward. Fourth, the stop " +
  "positions are counted along the sequence and drawn back to back about " +
  "an axis, plus counts above and minus counts below, with the plus counts " +
  "piling up at a few positions and one position high in both. The plot is " +
  "schematic and carries no values; the difference at each base is its " +
  "reactivity.";

function figure(){
  return '<svg viewBox="0 0 1480 620" xmlns="http://www.w3.org/2000/svg" ' +
    'role="img" aria-label="' + ALT + '">' +
    opening() + adduct() + extension() + barcode() + counts() + '</svg>';
}

function fill(){
  const el = document.querySelector("[data-shape]");
  if (!el) return;
  el.innerHTML = figure();
}
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
