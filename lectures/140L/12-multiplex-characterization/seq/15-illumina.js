/* ------------------------------------------------------------------ *
 * 15-illumina.js : sources 15-19, the Illumina construct.
 *
 * Fills  [data-con="15"] .. [data-con="19"]
 *
 * WHY THIS EXISTS.  The rough cut of 2026-11-10 rendered five slides'
 * worth of this construct as one undifferentiated run of about 660
 * monospace characters.  In the source every region is COLORED and
 * five of them are LABELLED with their own text boxes, so the rough
 * cut threw away the entire content of sources 15-19 and kept only
 * their raw bases.  PLAN.txt called it the single biggest gap in that
 * pass; JCA asked for it on 2026-11-16.
 *
 * WHAT IS DRAWN.  Two things per slide, which is one more than the
 * source had: a MAP of the construct with the regions named, and under
 * it the ACTUAL SEQUENCE, character for character as the pptx has it,
 * colored by region.  The map is schematic -- segment widths are
 * chosen so the labels fit, not scaled to length, and the middle is
 * compressed hard.  The sequence is exact.  Keeping those two jobs in
 * separate objects is what lets the map stay readable without ever
 * lying about a base.
 *
 * EVERY RUN WAS READ OUT OF ppt/slides/slide1[5-9].xml and checked by
 * length before being typed here.  The totals are 664, 664, 660, 192
 * and 192 characters.  If you edit a sequence, re-check the total.
 *
 * THE COLORING WAS REWORKED ON 2026-11-17.  The first cut of this
 * file gave every region its own hue, following the source's, and
 * printed a legend decoding them.  That is an identity map and
 * palette.css forbids it; seven of the nine hues were not palette
 * values at all.  JCA caught it while walking the deck.  How it works
 * now is described at REGION below.  What the rework kept, and what
 * it made unnecessary, from the source's own coloring:
 *
 * KEPT -- THE SOURCE'S FAULTS ARE STILL FIXED, JUST NOT WITH HUE.
 *   The source's two "MiSeq Primer Binding" labels were different
 *   colors (00B0F0 cyan and accent4 purple) although both say the
 *   same words; accent4 meanwhile also meant the spacer; and the two
 *   20 bp library-specific sites -- the very thing JCA's note for
 *   source 15 is about, "and then 20bp sites specific to your
 *   experiment" -- were drawn in bg1, white on white, invisible.
 *   None of those can happen now: a region is named by its label, the
 *   same label every time, and the 20 bp sites are the focus of
 *   source 15 and so are the one thing in blue on it.
 *
 * KEPT -- THE OPEN READING FRAME IS STILL DRAWN.  It is uncoloured in
 *   the source, buried in a run of N, but source 18's whole argument
 *   is that the read runs out before the gene can identify itself,
 *   which you cannot see unless the gene is visible.  It is named and
 *   in focus on 18 and 19.
 *
 * ADDED -- THE WORDS ON THE MAP THAT THE SOURCE DOES NOT HAVE.  The
 *   contract says every change to JCA's slide is listed, and these are
 *   changes: the source labels only P5, P7, the two MiSeq sites and the
 *   spacer.  Everything else written on the map is ours.
 *     "your 20 bp site"  names the region the source drew invisibly
 *        (bg1 on white) and that JCA's own note for 15 describes.
 *     "what you are characterizing"  names the long run of N in the
 *        middle, which the source leaves unnamed; without it the
 *        biggest segment of the map is the only mute one.
 *     "the gene" / "the gene itself"  the ORF, see KEPT above.
 *     "constant flanking context" (17)  is the note's own phrase for
 *        the bases either side of the barcode.
 *     "this much is what comes back in the data file" (16)  states in
 *        words what the source made with color alone.
 *     "the gene runs on; the read does not" (18, 19)  likewise, for
 *        the truncation the source shows by simply stopping.
 *     "NNN bases"  the character count of the run above it.  Not a
 *        source figure, but not an invented one either: it is counted
 *        off the source's own sequence at draw time.
 *   The source's "P5 Illumina adapter" and "P7 Illumina adapter" are
 *   shortened to "P5 adapter" and "P7 adapter" on the map so the
 *   labels fit their segments; the full names are what the alt text
 *   and REGION carry.
 *
 * DROPPED -- THE DESATURATION PASS.  17-19 used to draw the whole
 *   architecture in washed-out versions of its hues so the barcode
 *   could stand out.  With one focus color and context in --rule
 *   there is nothing to wash out; the effect is the same and it
 *   costs no invented values.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

/* ---- the regions -------------------------------------------------- *
 * NAMES ONLY.  These used to carry a hue each -- red P5, cyan MiSeq,
 * purple spacer, green barcode and so on, nine in all, with a printed
 * legend mapping hue to region.  That is an IDENTITY MAP, which
 * palette.css forbids outright ("do not assign a color to a class of
 * object"), and seven of the nine hues were not in the palette at all.
 * JCA caught it on 2026-11-17.
 *
 * Identity is now carried where it always should have been: the map
 * LABELS every region, on every slide.  Color is freed to do its own
 * job, which is attention -- and these five slides each have a
 * different subject, so on each one the region that slide is about is
 * promoted to blue and everything else stays context.  The legend is
 * gone; it existed only to decode hues that no longer mean anything.
 * ------------------------------------------------------------------ */
const REGION = {
  p5:  { c: "ink",   name: "P5 Illumina adapter" },
  ms:  { c: "verm",  name: "MiSeq primer binding" },
  sp:  { c: "muted", name: "variable-length spacer" },
  lib: { c: "blue",  name: "your 20 bp site" },
  mid: { c: "rule",  name: "what you are characterizing" },
  p7:  { c: "ink",   name: "P7 Illumina adapter" },
  bc:  { c: "amber", name: "barcode" },
  t7:  { c: "verm",  name: "reverse priming site (T7 universal)" },
  orf: { c: "blue",  name: "the gene itself" }
};

/* WHY THESE, after JCA on 2026-11-17: "I told you to use more color
   here.  There is no red or yellow.  You have multiple annotations as
   just black, and you are only showing them in the diagram and not on
   the sequence."
   All four content colours are now in play and every annotated region
   on a given slide is a different one.  The only pair that shares a
   value is P5 and P7, and that is deliberate rather than a collapse:
   they are the two flow-cell adapters, the matched pair at the two
   ends of the molecule, and their labels name them apart.  What used
   to be lumped in with them -- the MiSeq primer binding sites -- is
   vermillion now.
   Per slide, nothing collides: the full construct uses ink, vermillion,
   blue, muted and rule; the barcoded one adds amber; the read slides
   drop the adapters and reuse vermillion for the T7 site and blue for
   the gene, neither of which ever appears beside the region it borrows
   from.
   The MAP AND THE SEQUENCE share this assignment, which was the other
   half of the complaint -- a region is the same colour in both, so you
   can find it in the bases.  Where a region's fill is --rule its bases
   are drawn in muted instead, because --rule on white is invisible;
   that puts "what you are characterizing" and the spacer in the same
   grey, which is fine because the spacer is written as an ellipsis and
   is told apart by shape, not colour. */


const N = n => new Array(n + 1).join("N");

/* ---- the sequences, exactly as the pptx has them ------------------- */
const P5    = "AATGATACGGCGACCACCGAGATCT";                 /* 25 */
const READ1 = "ACACTCTTTCCCTACACGACGCTCTTCCGATCT";         /* 33 */
const READ2 = "AGATCGGAAGAGCACACGTCTGAACTCCAGTCAC";        /* 34 */
const P7    = "ATCTCGTATGCCGTCTTCTGCTTG";                  /* 24 */
const BC    = "ctcccaggctaa";                              /* 12 */
const T7    = "CCCTATAGTGAGTCGTATTA";                      /* 20 */
const ORF   = "atgaaaataattgctgatagtaagcttattagaaaaagaa" +
              "tgattgatttaaatattaatagcatt";                /* 66 */

/* the full amplicon, sources 15 and 16 -- 664 characters */
const FULL = [
  ["p5", P5], ["ms", READ1], ["sp", "N..N"], ["lib", N(20)],
  ["mid", N(500)],
  ["lib", N(20)], ["sp", "N..N"], ["ms", READ2], ["p7", P7]
];

/* the same amplicon carrying a barcode, source 17 -- 660 characters.
   The barcode sits five bases into the near 20 bp site, so that site
   reads 5 N, the barcode, then 3 N: the constant flanking context the
   note says you scan for. */
const BARCODED = [
  ["p5", P5], ["ms", READ1], ["sp", "N..N"],
  ["lib", N(5)], ["bc", BC], ["lib", N(3)],
  ["mid", N(516)],
  ["sp", "N..N"], ["ms", READ2], ["p7", P7]
];

/* what one read actually contains, sources 18 and 19 -- 192 characters */
const READ_PLAIN = [
  ["sp", N(9)], ["bc", BC], ["mid", N(105)], ["orf", ORF]
];
const READ_T7 = [
  ["sp", N(9)], ["bc", BC], ["mid", N(19)], ["t7", T7],
  ["mid", N(66)], ["orf", ORF]
];

/* ---- the maps ------------------------------------------------------ *
 * [weight, region, label, row].  Weight is DISPLAY width, chosen so the
 * labels fit; it is not proportional to length and is not pretending to
 * be.  row is u1/u2 above the bar, d1/d2 below it, "in" for a label
 * written inside the bar, or "" for a segment that is not labelled
 * because another segment of the same color already is.
 * ------------------------------------------------------------------ */
const MAP_FULL = [
  [25, "p5",  "P5 adapter",           "u2"],
  [33, "ms",  "MiSeq primer binding", "u1"],
  [15, "sp",  "",                     ""  ],
  [22, "lib", "your 20 bp site",      "u2"],
  [66, "mid", "",                     "in"],
  [22, "lib", "",                     ""  ],
  [15, "sp",  "variable-length spacer", "d1"],
  [34, "ms",  "",                     ""  ],
  [24, "p7",  "P7 adapter",           "d2"]
];

const MAP_BARCODED = [
  [25, "p5",  "P5 adapter",           "u2"],
  [33, "ms",  "MiSeq primer binding", "u1"],
  [15, "sp",  "",                     ""  ],
  /* the flank label goes BELOW and on the near side: above, it sat
     shoulder to shoulder with "barcode" on the next segment along */
  [9,  "lib", "constant flanking context", "d1"],
  [20, "bc",  "barcode",              "u1"],
  [9,  "lib", "",                     ""  ],
  [66, "mid", "",                     "in"],
  [22, "lib", "",                     ""  ],
  [15, "sp",  "variable-length spacer", "d1"],
  [34, "ms",  "",                     ""  ],
  [24, "p7",  "P7 adapter",           "d2"]
];

const MAP_READ_PLAIN = [
  [14, "sp",  "",                      ""  ],
  [22, "bc",  "barcode",               "u1"],
  [74, "mid", "",                      "in"],
  [48, "orf", "the gene",               "d1"]
];

const MAP_READ_T7 = [
  [14, "sp",  "",                      ""  ],
  [22, "bc",  "barcode",               "u1"],
  [20, "mid", "",                      ""  ],
  [30, "t7",  "reverse priming site, T7 universal", "u2"],
  [36, "mid", "",                      "in"],
  [44, "orf", "the gene",              "d1"]
];

/* ---- per slide ----------------------------------------------------- *
 * `focus` names the regions THIS slide is about.  They are drawn in
 * blue; every other region is context.  The sets for 16-19 are the
 * source's own emphasis.  15's is new, and it is the subject of JCA's
 * own note for that slide -- "and then 20bp sites specific to your
 * experiment", the one part of the construct that is yours rather
 * than Illumina's.
 * ------------------------------------------------------------------ */
const SLIDES = {
  "15": { seq: FULL,        map: MAP_FULL, focus: ["lib"] },
  "16": { seq: FULL,        map: MAP_FULL,
          focus: ["sp", "lib", "mid"],
          bracket: [2, 6, "this much is what comes back in the data file"] },
  "17": { seq: BARCODED,    map: MAP_BARCODED, focus: ["bc"] },
  "18": { seq: READ_PLAIN,  map: MAP_READ_PLAIN, focus: ["bc", "orf"],
          truncated: "the gene runs on; the read does not" },
  "19": { seq: READ_T7,     map: MAP_READ_T7,  focus: ["bc", "t7", "orf"],
          truncated: "the gene runs on; the read does not" }
};

/* ------------------------------------------------------------------ */
/* every value here is from palette.css and nowhere else */
const INK = "#111111", BLUE = "#004373", VERM = "#ba3a13",
      AMBER = "#a99011", MUTED = "#767676", RULE = "#e2e2e2",
      PAPER = "#ffffff";

/* Fill for a region, and the text colour that clears it.  Every value is
   from palette.css, and the text pairings are the ones palette.css itself
   measures -- including the one that catches people out: AMBER TAKES
   BLACK.  White on amber fails. */
const FILL   = { ink: INK, blue: BLUE, verm: VERM, amber: AMBER,
                 muted: MUTED, rule: RULE };
const ONFILL = { ink: PAPER, blue: PAPER, verm: PAPER, amber: INK,
                 muted: PAPER, rule: INK };

function isFocus(spec, key){
  return !!spec.focus && spec.focus.indexOf(key) >= 0;
}
function barFill(spec, key){ return FILL[REGION[key].c]; }
/* a name sits INSIDE its segment, so it must clear what is under it:
   white on blue is 10.2:1, ink on --rule is 16.8:1 */
function barText(spec, key){ return ONFILL[REGION[key].c]; }
/* a name on a leader outside the bar, and the leader itself */
function labelColour(spec, key){
  const c = REGION[key].c;
  return c === "rule" ? MUTED : FILL[c];   /* a --rule label would vanish */
}
/* the bases themselves */
function seqColour(spec, key){
  const c = REGION[key].c;
  return c === "rule" ? MUTED : FILL[c];   /* same: bases must stay legible */
}

/* ---- the map ------------------------------------------------------- */
const MW = 1480, BAR_Y = 92, BAR_H = 34;

/* The bracket hangs below the bar, so on a slide that has one the lower
   label rows have to get out of its way or they land on top of it --
   which is exactly what source 16 did on the first attempt. */
function rowsFor(spec){
  const drop = spec.bracket ? 62 : 0;
  return { rows: { u1: 34, u2: 66, d1: 162 + drop, d2: 194 + drop },
           height: 220 + drop };
}

function mapSvg(spec){
  const segs = spec.map;
  const geom = rowsFor(spec), ROW = geom.rows;
  const total = segs.reduce((a, s) => a + s[0], 0);
  /* a truncated map gives up the right-hand 150 units so the gene can be
     shown running off the end of the read -- which IS source 18's whole
     argument, and is invisible if the bar just stops at a tidy edge */
  const X0 = 20, W = MW - 40 - (spec.truncated ? 150 : 0);
  let x = X0, s = "";
  const ticks = [];

  segs.forEach(function(seg){
    const w = seg[0] / total * W, key = seg[1], lab = seg[2], row = seg[3];
    s += '<rect x="' + x.toFixed(1) + '" y="' + BAR_Y + '" width="' + w.toFixed(1) +
         '" height="' + BAR_H + '" fill="' + barFill(spec, key) +
         '" stroke="' + PAPER + '" stroke-width="1.5"/>';
    if (row === "in"){
      s += '<text x="' + (x + w/2).toFixed(1) + '" y="' + (BAR_Y + BAR_H/2 + 7) +
           '" text-anchor="middle" font-family="inherit" font-size="19" ' +
           'fill="' + barText(spec, key) + '">' + REGION[key].name + '</text>';
    } else if (lab && ROW[row] !== undefined){
      ticks.push([x + w/2, ROW[row], lab, labelColour(spec, key),
                  row[0] === "u", isFocus(spec, key)]);
    }
    x += w;
  });

  ticks.forEach(function(t){
    const cx = t[0], y = t[1], up = t[4];
    /* weight backs up hue, so the focused region still stands out in
       greyscale and to a viewer who cannot separate the two */
    s += '<text x="' + cx.toFixed(1) + '" y="' + y + '" text-anchor="middle" ' +
         'font-family="inherit" font-size="21" font-weight="' +
         (t[5] ? "700" : "400") + '" fill="' + t[3] +
         '">' + t[2] + '</text>';
    s += '<line x1="' + cx.toFixed(1) + '" y1="' + (up ? y + 8 : y - 20) +
         '" x2="' + cx.toFixed(1) + '" y2="' + (up ? BAR_Y : BAR_Y + BAR_H) +
         '" stroke="' + t[3] + '" stroke-width="1.5" opacity="0.55"/>';
  });

  /* the optional bracket under the bar, for "this much comes back" */
  if (spec.bracket){
    const segsum = (i) => segs.slice(0, i).reduce((a, q) => a + q[0], 0);
    const x1 = X0 + segsum(spec.bracket[0]) / total * W;
    const x2 = X0 + segsum(spec.bracket[1] + 1) / total * W;
    const y = BAR_Y + BAR_H + 16;
    s += '<path d="M ' + x1.toFixed(1) + ' ' + y + ' L ' + x1.toFixed(1) + ' ' +
         (y + 10) + ' L ' + x2.toFixed(1) + ' ' + (y + 10) + ' L ' +
         x2.toFixed(1) + ' ' + y + '" fill="none" stroke="' + INK +
         '" stroke-width="2"/>';
    s += '<text x="' + ((x1 + x2) / 2).toFixed(1) + '" y="' + (y + 36) +
         '" text-anchor="middle" font-family="inherit" font-size="21" ' +
         'font-weight="700" fill="' + INK + '">' + spec.bracket[2] + '</text>';
  }

  if (spec.truncated){
    const last = segs[segs.length - 1], col = barFill(spec, last[1]);
    /* stepped blocks rather than a gradient: a gradient needs an id, and
       ids on this deck are page-global with several drawings per page */
    for (let i = 0; i < 5; i++){
      s += '<rect x="' + (X0 + W + i * 26) + '" y="' + BAR_Y + '" width="24" ' +
           'height="' + BAR_H + '" fill="' + col + '" opacity="' +
           (0.62 - i * 0.12).toFixed(2) + '"/>';
    }
    s += '<line x1="' + (X0 + W) + '" y1="' + (BAR_Y - 14) + '" x2="' +
         (X0 + W) + '" y2="' + (BAR_Y + BAR_H + 14) + '" stroke="' + INK +
         '" stroke-width="2.5" stroke-dasharray="5 4"/>';
    /* anchored to the right edge, not centered on the fade: centered, the
       sentence ran off the end of the viewBox and lost its last word */
    s += '<text x="' + (MW - 20) + '" y="' + (BAR_Y - 24) +
         '" text-anchor="end" font-family="inherit" font-size="18" ' +
         'fill="' + MUTED + '">' + spec.truncated + '</text>';
  }

  return '<svg viewBox="0 0 ' + MW + ' ' + geom.height + '" xmlns="http://www.w3.org/2000/svg" ' +
         'role="img" aria-label="' + mapAlt(spec) + '">' + s + '</svg>';
}

function mapAlt(spec){
  const seen = [], order = [];
  spec.map.forEach(function(seg){
    if (seen.indexOf(seg[1]) < 0){ seen.push(seg[1]); order.push(REGION[seg[1]].name); }
  });
  return "A map of the construct, left to right: " + order.join(", ") + "." +
         (spec.truncated ? "  The last region fades out past a dashed line: " +
          spec.truncated + "." : "");
}

/* ---- the sequence --------------------------------------------------- */
function seqHtml(spec){
  let s = "";
  spec.seq.forEach(function(run){
    s += '<span style="color:' + seqColour(spec, run[0]) + '">' + run[1] + '</span>';
  });
  return s;
}

function fill(){
  Object.keys(SLIDES).forEach(function(k){
    const el = document.querySelector('[data-con="' + k + '"]');
    if (!el) return;
    const spec = SLIDES[k];
    const total = spec.seq.reduce((a, r) => a + r[1].length, 0);
    el.innerHTML =
      '<div class="conmap">' + mapSvg(spec) + '</div>' +
      '<pre class="conseq">' + seqHtml(spec) + '</pre>' +
      '<div class="conkey">' +
      '<span class="chip len">' + total + ' bases</span></div>';
  });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
