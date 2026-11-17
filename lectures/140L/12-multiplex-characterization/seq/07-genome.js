/* ------------------------------------------------------------------ *
 * 07-genome.js : source 7, "Genomic DNA libraries".
 *
 * Fills  [data-fig="7"]
 *
 * WHY THIS EXISTS.  Source 7's figure is not drawn at all in the pptx:
 * it is FIVE PASTED BITMAPS.  ppt/slides/slide7.xml has Picture 2 (the
 * karyotype, rId8, 2067687 x 2552700 EMU) and Pictures 3-6, four small
 * crops of that same bitmap stacked at x = 4610100.  Behind the
 * karyotype sits Rectangle 4, a text box holding the image's source
 * URL -- nature.com/nature/journal/v409/n6822/images/409860bw.2.jpg,
 * a figure from the human genome issue.  So the entire figure is one
 * third-party photograph, shown once whole and four times cropped.
 * Redrawing it is what removes that photograph from the deck.
 *
 * WHAT IS DRAWN.  The same three things the source shows, in the same
 * arrangement: a genome at the left as a stack of banded bars, a
 * diagonal arrow down and to the right, and four short fragments at the
 * right, each one a magnified piece of those bars.  Counts come from the
 * render and from the shape tree: ELEVEN bars (counted in the render,
 * s-07.png) and FOUR fragments (Pictures 3-6, and four in the render).
 * The fragments are stacked at the right at roughly even pitch, as the
 * four pictures are (y = 3200399, 4012476, 4749590, 5499198 EMU).
 *
 * THE BANDING IS TEXTURE, NOT DATA.  The source's bands are a
 * photograph of a stained karyotype, used decoratively -- no band in
 * this slide is referred to, named or counted.  The bands here are
 * generated from a FIXED seed, so the picture is the same on every
 * load, but no position, width or count in them means anything and
 * nothing should be read off them.  They exist to give the bars a
 * texture that a crop can be recognized in, which is the one job the
 * photograph was doing.
 *
 * COLOR.  The genome is context, so it is ink, with its bands carried
 * in ink / muted / rule / white -- lightness, not hue, exactly as a
 * stained karyotype does it.  The four fragments are what the slide is
 * about, so they take blue.  Vermillion and amber are not reached: only
 * one thing here deserves attention.  Blue is not standing for "a
 * fragment" as a kind of object; it is standing for the thing the
 * viewer is meant to follow on THIS slide.
 *
 * CHANGES TO JCA'S SLIDE, ALL OF THEM:
 *
 * 1. THE PHOTOGRAPH IS GONE, replaced by our own drawing.  Asked for.
 *    The slide's <p class="src"> carried the nature.com URL, which
 *    described that photograph and nothing else; it came out of
 *    01-libraries.html when the figure went in, and the slide now
 *    carries no credit because there is nothing left to credit.
 *
 * 2. THE CAPTION IS NOT REPEATED.  The source's caption text box reads
 *    "Fragments of a genome or environmental sample of genomes", and
 *    the deck already carries that sentence verbatim as the slide's
 *    one-line <ul>.  Drawing it again inside the figure would put the
 *    same sentence on the slide twice, so the figure has no text at
 *    all; the caption survives, in the deck's own furniture.  The
 *    sentence is in the SVG's aria-label instead.
 *
 * 3. WHERE THE FRAGMENTS CAME FROM IS NOW VISIBLE.  In the source the
 *    four fragments are literal crops of the karyotype, but nothing on
 *    the slide says which stretch each one is -- the connection is
 *    real and invisible.  Here each fragment IS an exact magnified
 *    slice of one drawn bar (about 5.5x), and the stretch it came from
 *    is outlined in blue on that bar, its dark bands promoted to
 *    blue to match.  No label, no leader line, no key: the band pattern
 *    does the matching.  This is an addition, hence it is listed.
 *
 * 4. THE ARROW IS BLUE, NOT THEME BLUE.  Source 7's connector is the
 *    pptx accent1 with a stock arrowhead; it is drawn here as a line
 *    and a <path> head in --blue (markers need page-global ids and
 *    several figures share a page).
 * ------------------------------------------------------------------ */
(function(){
"use strict";

/* ---- palette.css, nothing else ------------------------------------ */
const INK   = "#111111",
      BLUE  = "#004373",
      MUTED = "#767676",
      RULE  = "#e2e2e2",
      PAPER = "#ffffff";

/* band levels: 0 dark, 1 mid, 2 light, 3 unstained */
const GENOME_LEVEL   = [INK,  MUTED, RULE, PAPER];
const FRAGMENT_LEVEL = [BLUE, MUTED, RULE, PAPER];

/* ---- geometry ------------------------------------------------------ */
const VW = 1480, VH = 640;

const GX = 40,            /* genome left edge                           */
      GY = 56,            /* top of the first bar                       */
      GH = 28,            /* bar height                                 */
      GP = 44,            /* bar to bar pitch                           */
      NBAR = 11,          /* counted in the render                      */
      GL0 = 560, GLD = 24;/* longest bar, and the drop per bar          */

const FX = 840,           /* fragment left edge                         */
      FW = 600,           /* fragment width                             */
      FH = 54,            /* fragment height                            */
      FY = 100,           /* top of the first fragment                  */
      FP = 124;           /* fragment pitch                             */

const WL = 110;           /* window length, in genome units             */
const MAG = FW / WL;      /* magnification of a fragment, about 5.5x    */

/* which bar each fragment is cut from, and where it starts on it.
   Four of them because the source has four crops. */
const CUTS = [[1, 120], [4, 90], [7, 200], [9, 60]];

/* ---- the banding --------------------------------------------------- *
 * Fixed seed, so the figure is identical on every load.  See the header:
 * none of these numbers mean anything.
 * ------------------------------------------------------------------ */
let seed = 20261117;
function rnd(){
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}
function level(){
  const r = rnd();
  return r < 0.40 ? 0 : r < 0.75 ? 1 : 2;
}

/* A bar is [width, level] runs summing to its length.  The first and
   last run are forced unstained: the bar's outline is drawn with
   rounded ends, and a run that reached into a rounded corner would
   spill outside it.  White runs spill invisibly onto white paper. */
const CAP = 18;
function makeBands(L){
  const b = [[CAP, 3]];
  let used = CAP;
  while (L - used > CAP + 30){
    const w = Math.min(12 + Math.floor(rnd() * 19), L - used - CAP - 10);
    b.push([w, level()]);
    used += w;
    const g = Math.min(8 + Math.floor(rnd() * 13), L - used - CAP);
    if (g <= 0) break;
    b.push([g, 3]);
    used += g;
  }
  b.push([L - used, 3]);
  /* the constriction: force the run nearest 38% of the length dark, so
     the bars read as chromosomes rather than as barcodes */
  let x = 0, best = -1, bestd = 1e9;
  for (let i = 0; i < b.length; i++){
    const mid = x + b[i][0] / 2, d = Math.abs(mid - L * 0.38);
    if (b[i][1] !== 3 && d < bestd){ bestd = d; best = i; }
    x += b[i][0];
  }
  if (best >= 0) b[best][1] = 0;
  return b;
}

const BARS = [];
for (let i = 0; i < NBAR; i++){
  const L = GL0 - i * GLD;
  BARS.push({ len: L, y: GY + i * GP, bands: makeBands(L) });
}

/* Take the runs covering [s, s+WL) of a bar, clipped at both edges --
   a crop cuts bands in half, and the fragment should show that. */
function cropOf(bar, s){
  const out = [];
  let x = 0;
  bar.bands.forEach(function(run){
    const a = Math.max(x, s), b = Math.min(x + run[0], s + WL);
    if (b > a) out.push([b - a, run[1]]);
    x += run[0];
  });
  return out;
}

/* ---- drawing ------------------------------------------------------- */
function rect(x, y, w, h, fill, extra){
  return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) +
         '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) +
         '" fill="' + fill + '"' + (extra || "") + '/>';
}

function arrow(x1, y1, x2, y2, col){
  const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len, px = -uy, py = ux;
  const HL = 24, HW = 9;                     /* head length, half width */
  const bx = x2 - ux * HL, by = y2 - uy * HL;
  return '<line x1="' + x1 + '" y1="' + y1 +
         '" x2="' + (x2 - ux * (HL - 4)).toFixed(1) +
         '" y2="' + (y2 - uy * (HL - 4)).toFixed(1) +
         '" stroke="' + col + '" stroke-width="3" stroke-linecap="round"/>' +
         '<path d="M ' + x2 + ' ' + y2 +
         ' L ' + (bx + px * HW).toFixed(1) + ' ' + (by + py * HW).toFixed(1) +
         ' L ' + (bx - px * HW).toFixed(1) + ' ' + (by - py * HW).toFixed(1) +
         ' Z" fill="' + col + '"/>';
}

function draw(){
  let s = "";

  /* the genome: eleven banded bars, context, ink */
  BARS.forEach(function(bar, i){
    const cut = CUTS.filter(function(c){ return c[0] === i; })[0];
    const ws = cut ? cut[1] : -1, we = cut ? cut[1] + WL : -1;
    let x = 0;
    bar.bands.forEach(function(run){
      if (run[1] !== 3){
        /* a dark run inside the stretch that becomes a fragment is
           promoted to blue; everything else stays where it is */
        const inCut = cut && x + run[0] > ws && x < we;
        const fill = (inCut && run[1] === 0) ? BLUE : GENOME_LEVEL[run[1]];
        s += rect(GX + x, bar.y, run[0], GH, fill);
      }
      x += run[0];
    });
    s += '<rect x="' + GX + '" y="' + bar.y + '" width="' + bar.len +
         '" height="' + GH + '" rx="' + (GH / 2) +
         '" fill="none" stroke="' + INK + '" stroke-width="1.6"/>';
    if (cut){
      s += '<rect x="' + (GX + ws) + '" y="' + (bar.y - 5) +
           '" width="' + WL + '" height="' + (GH + 10) +
           '" rx="4" fill="none" stroke="' + BLUE + '" stroke-width="2.2"/>';
    }
  });

  /* the arrow, in the gap the source puts it in */
  s += arrow(650, 250, 800, 332, BLUE);

  /* the fragments: the four windows above, magnified */
  CUTS.forEach(function(cut, i){
    const y = FY + i * FP;
    const runs = cropOf(BARS[cut[0]], cut[1]);
    let x = 0;
    runs.forEach(function(run){
      const w = run[0] * MAG;
      if (run[1] !== 3) s += rect(FX + x, y, w, FH, FRAGMENT_LEVEL[run[1]]);
      x += w;
    });
    s += '<rect x="' + FX + '" y="' + y + '" width="' + FW +
         '" height="' + FH + '" fill="none" stroke="' + BLUE +
         '" stroke-width="2.6"/>';
  });

  return s;
}

const ALT = "Fragments of a genome or environmental sample of genomes: " +
  "eleven banded chromosome bars at the left, an arrow down to the right, " +
  "and four short fragments at the right, each a magnified piece of one " +
  "of the bars, with the stretch it came from outlined on that bar.";

function fill(){
  const el = document.querySelector('[data-fig="7"]');
  if (!el) return;
  el.innerHTML = '<svg viewBox="0 0 ' + VW + ' ' + VH + '" '
    + 'xmlns="http://www.w3.org/2000/svg" role="img" '
    + 'aria-label="' + ALT + '">' + draw() + '</svg>';
}
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
