/* ------------------------------------------------------------------ *
 * 15-illumina.js : sources 15-19, the Illumina construct.
 *
 * Fills  [data-con="15"] .. [data-con="19"]
 *
 * WHY THIS EXISTS.  The rough cut of 2026-11-10 rendered five slides'
 * worth of this construct as one undifferentiated run of about 660
 * monospace characters.  In the source every region is COLOURED and
 * five of them are LABELLED with their own text boxes, so the rough
 * cut threw away the entire content of sources 15-19 and kept only
 * their raw bases.  PLAN.txt called it the single biggest gap in that
 * pass; JCA asked for it on 2026-11-16.
 *
 * WHAT IS DRAWN.  Two things per slide, which is one more than the
 * source had: a MAP of the construct with the regions named, and under
 * it the ACTUAL SEQUENCE, character for character as the pptx has it,
 * coloured by region.  The map is schematic -- segment widths are
 * chosen so the labels fit, not scaled to length, and the middle is
 * compressed hard.  The sequence is exact.  Keeping those two jobs in
 * separate objects is what lets the map stay readable without ever
 * lying about a base.
 *
 * EVERY RUN WAS READ OUT OF ppt/slides/slide1[5-9].xml and checked by
 * length before being typed here.  The totals are 664, 664, 660, 192
 * and 192 characters.  If you edit a sequence, re-check the total.
 *
 * THREE THINGS IN THE SOURCE'S COLOURING ARE WRONG, AND ARE FIXED HERE.
 * All three are recorded because they are changes to JCA's slides:
 *
 * 1. THE TWO "MiSeq Primer Binding" LABELS HAVE DIFFERENT COLOURS.
 *    The near one is 00B0F0 cyan, the far one is accent4 purple, and
 *    both label text boxes carry the same words.  Two labels reading
 *    the same thing in two colours means colour is not identity, which
 *    defeats the figure.  Both are cyan here.
 *
 * 2. accent4 IS ALSO THE VARIABLE-LENGTH SPACER.  Having been freed by
 *    (1), accent4 purple now means the spacer and only the spacer,
 *    which is what its own label said it meant.
 *
 * 3. THE 20 bp LIBRARY-SPECIFIC SITES ARE DRAWN IN bg1 -- WHITE ON
 *    WHITE, SO INVISIBLE.  There are exactly two runs of exactly 20 N,
 *    and JCA's note for source 15 says "and then 20bp sites specific
 *    to your experiment", so these are the thing the note is about and
 *    they could not be seen at all.  They are amber here.
 *
 * ONE THING IS ADDED: the open reading frame at the end of sources 18
 * and 19 is uncoloured in the source, buried in a run of N.  Source
 * 18's whole argument is that the read runs out before the gene can
 * identify itself, which you cannot see unless the gene is visible.
 * It is blue.
 *
 * WHY 17-19 LOOK FADED.  The source drops the architecture colours on
 * those three slides and leaves only the barcode in green -- a
 * deliberate change of emphasis, since those slides are about the
 * barcode and not about the adapters.  Rather than either ignore that
 * or lose the orientation the colours give, the architecture is drawn
 * DESATURATED there and the barcode at full strength.  The map above
 * keeps its labels on every slide, so nothing is ever unnamed.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

/* ---- the regions -------------------------------------------------- *
 * Hues follow the source's own choices wherever the source was
 * self-consistent: red P5, cyan MiSeq, purple spacer, orange P7, green
 * barcode, brick T7.  They are a categorical inventory, not the house
 * attention ladder, so they are allowed to sit outside the palette.
 * ------------------------------------------------------------------ */
const REGION = {
  p5:  { c: "#c0392b", name: "P5 Illumina adapter" },
  ms:  { c: "#0a7fb8", name: "MiSeq primer binding" },
  sp:  { c: "#7a5aa6", name: "variable-length spacer" },
  lib: { c: "#a07d0c", name: "your 20 bp site" },
  mid: { c: "#8a8a8a", name: "what you are characterising" },
  p7:  { c: "#d4761f", name: "P7 Illumina adapter" },
  bc:  { c: "#00843d", name: "barcode" },
  t7:  { c: "#b0504d", name: "reverse priming site (T7 universal)" },
  orf: { c: "#004373", name: "the gene itself" }
};

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
 * because another segment of the same colour already is.
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
 * faded: true draws the architecture desaturated and leaves only the
 * regions named in `bright` at full strength -- the source's own
 * emphasis on 17-19.
 * ------------------------------------------------------------------ */
const SLIDES = {
  "15": { seq: FULL,        map: MAP_FULL },
  "16": { seq: FULL,        map: MAP_FULL,
          bright: ["sp", "lib", "mid"],
          bracket: [2, 6, "this much is what comes back in the data file"] },
  "17": { seq: BARCODED,    map: MAP_BARCODED, bright: ["bc"] },
  "18": { seq: READ_PLAIN,  map: MAP_READ_PLAIN, bright: ["bc", "orf"],
          truncated: "the gene runs on; the read does not" },
  "19": { seq: READ_T7,     map: MAP_READ_T7,  bright: ["bc", "t7", "orf"],
          truncated: "the gene runs on; the read does not" }
};

/* ------------------------------------------------------------------ */
const INK = "#111111", MUTED = "#767676", FADE = "#c9c9c9";

function dim(hex){
  /* mix a region colour most of the way to paper, so it still reads as
     itself but stops competing with whatever is at full strength */
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16), t = 0.72;
  const m = v => Math.round(v + (255 - v) * t);
  return "rgb(" + m(r) + "," + m(g) + "," + m(b) + ")";
}

function colourOf(spec, key){
  const c = REGION[key].c;
  if (!spec.bright) return c;
  return spec.bright.indexOf(key) >= 0 ? c : dim(c);
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
    const col = colourOf(spec, key);
    s += '<rect x="' + x.toFixed(1) + '" y="' + BAR_Y + '" width="' + w.toFixed(1) +
         '" height="' + BAR_H + '" fill="' + col + '" stroke="#ffffff" ' +
         'stroke-width="1.5"/>';
    if (row === "in"){
      s += '<text x="' + (x + w/2).toFixed(1) + '" y="' + (BAR_Y + BAR_H/2 + 7) +
           '" text-anchor="middle" font-family="inherit" font-size="19" ' +
           'fill="#ffffff">' + REGION[key].name + '</text>';
    } else if (lab && ROW[row] !== undefined){
      ticks.push([x + w/2, ROW[row], lab, col, row[0] === "u"]);
    }
    x += w;
  });

  ticks.forEach(function(t){
    const cx = t[0], y = t[1], up = t[4];
    s += '<text x="' + cx.toFixed(1) + '" y="' + y + '" text-anchor="middle" ' +
         'font-family="inherit" font-size="21" font-weight="700" fill="' + t[3] +
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
    const last = segs[segs.length - 1], col = colourOf(spec, last[1]);
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
    /* anchored to the right edge, not centred on the fade: centred, the
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
    s += '<span style="color:' + colourOf(spec, run[0]) + '">' + run[1] + '</span>';
  });
  return s;
}

/* ---- the legend ----------------------------------------------------- */
function legendHtml(spec){
  const seen = [];
  let s = "";
  spec.seq.forEach(function(run){
    if (seen.indexOf(run[0]) >= 0) return;
    seen.push(run[0]);
    const c = colourOf(spec, run[0]);
    s += '<span class="chip"><i style="background:' + c + '"></i>' +
         REGION[run[0]].name + '</span>';
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
      '<div class="conkey">' + legendHtml(spec) +
      '<span class="chip len">' + total + ' bases</span></div>';
  });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
