/* ------------------------------------------------------------------ *
 * 26-rnaseq.js : source 26, "RNA Seq" -- the RNA-seq workflow.
 *
 * Fills  [data-fig="26"]
 *
 * WHY THIS EXISTS.  Source 26 carries no drawing of its own.  Its
 * whole figure is ONE pasted <p:pic> -- a third-party diagram from
 * www2.fml.tuebingen.mpg.de (RNA-Sequencing.png); slide26.xml has one
 * picture and zero shapes, so there is nothing of JCA's in it to
 * preserve beyond the title.  Redrawing it takes a third-party image
 * out of the deck and puts the workflow in the house hand.  Because
 * the replacement is ours it draws the PROCESS, not a trace of their
 * picture: every step the source shows is here, under the source's
 * own labels, laid out left to right.
 *
 * DRAWN AGAINST THE RENDER (<scratchpad>/render/s-26.png), not against
 * the XML -- the XML is a single <a:blip> and tells you nothing.
 *
 * WHAT IS DRAWN, left to right, as the source has it:
 *   mRNA              three transcript species, stacked
 *   two routes        fragmentation then RT (over the top), and RT
 *                     then fragmentation (underneath) -- the source
 *                     shows BOTH orders converging, and that is a real
 *                     content point, so both are kept
 *   sequence library  adapter-flanked fragments
 *   Sequencer         the instrument box
 *   short sequence reads
 *
 * -------------------------------------------------------------------
 * HOW "SEVERAL TRANSCRIPTS AT DIFFERENT ABUNDANCES" IS CARRIED.
 *
 * The source uses green / blue / orange bars to mean "different
 * transcripts".  That is a hue-to-object-class identity map, which
 * FIGURE-CONTRACT.md s2 forbids outright, and it needs three hues the
 * attention ladder does not have to give.  The distinction is carried
 * here by the three things the guide names instead:
 *
 *   LANE POSITION   each species keeps one vertical lane -- top,
 *                   middle, bottom -- through every stage of the
 *                   figure, so you can follow one species across
 *                   without a single color being spent on it.
 *   BAR LENGTH      the species differ in transcript length, as they
 *                   do in the source (its green bars are the longest,
 *                   its orange the shortest).
 *   COPY COUNT      abundance, which is the entire point of RNA-seq,
 *                   is the number of copies drawn: many in the stack,
 *                   many in the library, dense in the read field.
 *
 * That leaves ONE promotion off ink, and it is the right one: the
 * transcript material is the thing the viewer follows from mRNA
 * through fragment to read, so it is blue.  Everything the transcript
 * passes THROUGH -- adapters, the poly(A) tails, the instrument, the
 * arrows, the labels -- is ink, which is what ink is for.  Nothing
 * reaches vermillion and nothing reaches amber.  No hex appears here
 * that is not in palette.css.
 * -------------------------------------------------------------------
 *
 * WHERE THE COUNTS COME FROM.  Counted off the render:
 *   mRNA stacks       4, 11 and 2 copies   -- the source's, exactly
 *   sequence library  4, 6 and 2 fragments -- the source's, exactly
 *   read field        16, 28 and 4 reads
 * The read field is the one set that is not bar-for-bar.  The source
 * scatters roughly 20 green, 35 blue and 5 orange reads in a blob;
 * those are ~4 : 7 : 1, and 16 : 28 : 4 is that ratio at a count the
 * lanes hold without crowding.  No other number is on this figure --
 * no read length, no depth, no fold-change -- because the source
 * states none and FIGURE-CONTRACT.md s6 forbids inventing one.
 *
 * EVERY CHANGE TO JCA'S SLIDE, LISTED.
 *
 * 1. THE PASTED IMAGE IS GONE, replaced by this drawing.  Asked for.
 *    Its <p class="src"> credit went with it: the credit described the
 *    pasted picture, and with the picture gone it describes nothing on
 *    the slide.  (An earlier draft of this header said the credit
 *    stays; it does not, and PLAN.txt records the removal.)
 * 2. THREE HUES BECOME ONE LANE SYSTEM, as set out above.
 * 3. THE FOUR ROUTE ARROWS BECOME TWO.  The source draws each route
 *    as two arrows in series (a curve, then a straight one) with a
 *    label on each.  Both labels survive, in their source order,
 *    along one curve per route.  Four arrowheads in that space turn
 *    into noise at slide size; the content -- two operations, two
 *    orders, one destination -- is unchanged.
 * 4. THE READ FIELD IS BANDED, NOT BLOBBED.  The source interleaves
 *    the three colors in one oval.  With hue gone, an interleaved
 *    field could not show proportion at all, so the reads sit in the
 *    same three lanes as everything else, with ragged edges and
 *    jittered rows so it still reads as a scatter and not a table.
 *    It does claim a tidiness the instrument does not have; the
 *    alternative was losing "proportion in, proportion out", which is
 *    the reason the slide is in the lecture.
 * 5. THE POLY(A) TAIL IS DRAWN WHITE WITH AN INK EDGE where the
 *    source hatches it gray.  Same job -- a 3' segment that is not
 *    transcript body -- inside the palette, which has no hatch and no
 *    fifth value.  It is not labelled, because the source does not
 *    label it.
 *
 * The scatter is laid out by a fixed-seed LCG, so the figure is the
 * same picture on every load and in every screenshot.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

/* ---- palette.css, nothing else ------------------------------------ */
const INK   = "#111111";
const BLUE  = "#004373";
const PAPER = "#ffffff";
const RULE  = "#e2e2e2";

const W = 1480, H = 640;

/* ---- the three species, in one lane each -------------------------- *
 * [copies in the stack, transcript body length, fragments in the
 *  library, reads in the field].  Lanes run top to bottom in the
 *  source's own order.
 * ------------------------------------------------------------------ */
const LANES = [
  { copies: 4,  body: 200, frags: 4, reads: 16 },
  { copies: 11, body: 160, frags: 6, reads: 28 },
  { copies: 2,  body: 110, frags: 2, reads:  4 }
];

/* ---- a fixed-seed generator, so the scatter never moves ----------- */
function rng(seed){
  let s = seed >>> 0;
  return function(){
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* ---- primitives ---------------------------------------------------- */
function rect(x, y, w, h, fill, stroke){
  return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) +
         '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) +
         '" fill="' + fill + '"' +
         (stroke ? ' stroke="' + stroke + '" stroke-width="1.5"' : "") + '/>';
}

function text(x, y, s, size, fill, anchor){
  return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) +
         '" text-anchor="' + (anchor || "start") +
         '" font-family="inherit" font-size="' + size +
         '" fill="' + fill + '">' + s + '</text>';
}

/* An arrowhead as a path -- markers need page-global ids and several
   figures share a page (FIGURE-CONTRACT.md s4). */
function head(x, y, dx, dy, color){
  const n = Math.sqrt(dx * dx + dy * dy), ux = dx / n, uy = dy / n;
  const px = -uy, py = ux, L = 19, B = 7.5;
  const p = [
    [x, y],
    [x - ux * L + px * B, y - uy * L + py * B],
    [x - ux * L - px * B, y - uy * L - py * B]
  ].map(q => q[0].toFixed(1) + "," + q[1].toFixed(1)).join(" ");
  return '<polygon points="' + p + '" fill="' + color + '"/>';
}

function straight(x1, y1, x2, y2, color){
  const dx = x2 - x1, dy = y2 - y1, n = Math.sqrt(dx * dx + dy * dy);
  const ex = x2 - dx / n * 17, ey = y2 - dy / n * 17;
  return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) +
         '" x2="' + ex.toFixed(1) + '" y2="' + ey.toFixed(1) +
         '" stroke="' + color + '" stroke-width="3"/>' +
         head(x2, y2, dx, dy, color);
}

/* A quadratic route with its head on the end tangent. */
function curve(x0, y0, cx, cy, x1, y1, color){
  return '<path d="M ' + x0 + ' ' + y0 + ' Q ' + cx + ' ' + cy + ' ' +
         x1 + ' ' + y1 + '" fill="none" stroke="' + color +
         '" stroke-width="3"/>' + head(x1, y1, x1 - cx, y1 - cy, color);
}

/* ---- stage 1 : the mRNA ------------------------------------------- *
 * Transcript body blue, poly(A) tail white with an ink edge.
 * ------------------------------------------------------------------ */
const STACK_X = 40, BAR_H = 8, PITCH = 13, TAIL = 26;
const STACK_Y = [64, 130, 288];

function mrna(){
  let s = text(STACK_X, 40, "mRNA", 26, INK);
  LANES.forEach(function(lane, i){
    for (let k = 0; k < lane.copies; k++){
      const y = STACK_Y[i] + k * PITCH;
      s += rect(STACK_X, y, lane.body, BAR_H, BLUE);
      s += rect(STACK_X + lane.body, y, TAIL, BAR_H, PAPER, INK);
    }
  });
  return s;
}

/* ---- stage 2 : the two routes -------------------------------------- *
 * Over the top: fragmentation, then RT.  Underneath: RT, then
 * fragmentation.  Both land on the library.
 * ------------------------------------------------------------------ */
function routes(){
  let s = curve(290, 100, 450, 30, 588, 96, INK);
  s += text(380, 50, "fragmentation", 23, INK, "middle");
  s += text(505, 50, "RT", 23, INK, "middle");

  s += curve(290, 300, 450, 372, 588, 268, INK);
  s += text(380, 362, "RT", 23, INK, "middle");
  s += text(505, 362, "fragmentation", 23, INK, "middle");
  return s;
}

/* ---- stage 3 : the sequence library -------------------------------- *
 * Each fragment is adapter / insert / adapter.  The insert is the
 * transcript material, so it keeps the blue; the adapters are what it
 * was ligated into, so they are ink.
 * ------------------------------------------------------------------ */
const LIB_X = 600, ADAPT = 38, INSERT = 104, FRAG_H = 10, FRAG_PITCH = 17;
const LIB_Y = [70, 150, 265];

function library(){
  let s = text(LIB_X + (ADAPT * 2 + INSERT) / 2, 36, "sequence library",
               26, INK, "middle");
  LANES.forEach(function(lane, i){
    for (let k = 0; k < lane.frags; k++){
      const y = LIB_Y[i] + k * FRAG_PITCH;
      s += rect(LIB_X, y, ADAPT, FRAG_H, INK);
      s += rect(LIB_X + ADAPT, y, INSERT, FRAG_H, BLUE);
      s += rect(LIB_X + ADAPT + INSERT, y, ADAPT, FRAG_H, INK);
    }
  });
  return s;
}

/* ---- stage 4 : the sequencer --------------------------------------- */
function sequencer(){
  const x = 1060, y = 110, w = 250, h = 180;
  let s = rect(x, y, w, h, RULE, INK);
  s += text(x + 16, y + 34, "Sequencer", 21, INK);
  s += rect(x + 16, y + 46, 130, 96, BLUE);
  s += rect(x + 158, y + 42, 76, 116, PAPER, INK);
  s += rect(x + 30, y + h, 10, 13, INK);
  s += rect(x + w - 40, y + h, 10, 13, INK);
  return s;
}

/* ---- stage 5 : the short sequence reads ---------------------------- *
 * One band per lane.  Every band is the SAME WIDTH and the SAME THREE
 * ROWS, so the only thing that differs between them is how many reads
 * are in that area -- which is the whole claim the slide makes, and
 * is what the source was spending three hues on.  Rows are jittered
 * and the cells are loose, so it still reads as a scatter.
 * ------------------------------------------------------------------ */
const FIELD_X = 640, FIELD_W = 780, READ_H = 9, ROWS = 3, ROW_PITCH = 21;
const BAND_Y = [384, 462, 540];

function reads(){
  const r = rng(26101117);
  let s = text(40, 500, "short sequence reads", 26, INK);

  LANES.forEach(function(lane, i){
    const n = lane.reads;
    for (let k = 0; k < n; k++){
      const row = k % ROWS;
      const inRow = Math.ceil((n - row) / ROWS);
      const idx = Math.floor(k / ROWS);
      const cell = FIELD_W / inRow;
      const wBar = 54 + r() * 20;
      const x = FIELD_X + idx * cell + r() * Math.max(0, cell - wBar);
      const y = BAND_Y[i] + row * ROW_PITCH + (r() - 0.5) * 7;
      s += rect(x, y, wBar, READ_H, BLUE);
    }
  });
  return s;
}

/* ---- assembly ------------------------------------------------------ */
function draw(){
  return mrna() + routes() + library()
       + straight(800, 190, 1045, 190, INK)
       + sequencer()
       + straight(1150, 310, 1012, 368, INK)
       + reads();
}

const ALT = "The RNA-seq workflow, left to right. Three transcript " +
  "species are stacked at the left as mRNA, each in its own lane: four " +
  "long copies, eleven of a shorter transcript, and two shorter still, " +
  "each ending in a poly(A) tail. Two routes lead right -- " +
  "fragmentation then RT over the top, RT then fragmentation " +
  "underneath -- and both arrive at the sequence library, where each " +
  "lane's fragments sit between adapters, four, six and two of them. " +
  "An arrow runs to the sequencer, and from the sequencer down to a " +
  "field of short sequence reads, banded by the same three lanes: " +
  "sixteen, twenty-eight and four, so each species leaves the machine " +
  "in proportion to how much of it went in.";

function fill(){
  const el = document.querySelector('[data-fig="26"]');
  if (!el) return;
  el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" '
    + 'xmlns="http://www.w3.org/2000/svg" role="img" '
    + 'aria-label="' + ALT + '">' + draw() + '</svg>';
}
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
