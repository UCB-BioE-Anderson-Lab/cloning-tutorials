/* ------------------------------------------------------------------ *
 * 39-y2h.js : source 39, "Yeast Two-Hybrid Assay".
 *
 * Fills  [data-fig="39"]   (viewBox 0 0 1480 640 -- the slide carries an
 * h1 and nothing else, so the figure has the whole content box.)
 *
 * WHY THIS EXISTS.  The source figure is a picture pasted into the
 * slide: ppt/slides/slide39.xml holds the title and two rectangles and
 * nothing else, so there is no geometry to recover from the XML and the
 * drawing was read off <scratchpad>/render/s-39.png.  It is drawn in
 * five PowerPoint theme hues -- orange UAS, green reporter gene, blue Y,
 * red AD, purple BD -- which is one hue per named object: an identity
 * map, exactly what style/FIGURE-CONTRACT.md s2 forbids.  Redrawn here
 * on the attention ladder.
 *
 * WHAT IS DRAWN.  The source's three rows, in the source's order and
 * with the source's content: a UAS box and a Reporter Gene box end to
 * end on one line, a bent transcription arrow rising from the junction,
 * and the fusion halves above them -- BD fused to X, AD fused to Y.
 * Row 1 AD-Y alone, no transcription, X mark.  Row 2 BD-X alone, no
 * transcription, X mark.  Row 3 both, X and Y touching, transcription,
 * check mark.  The three-row structure IS the content and is kept.
 *
 * HOW ATTENTION IS SPENT.  Identity is carried by the labels (UAS,
 * Reporter Gene, BD, AD, X, Y) and by shape -- X is the notched blob, Y
 * the round one, and they interlock only in row 3.  Color is free to
 * carry attention, and moves between rows as the guide allows:
 *
 *   everywhere  the DNA line is ink: the UAS and the reporter gene are
 *               the context the rows have in common, identical in all
 *               three, and nothing about them changes.
 *   row 1       the AD-Y fusion is blue.  It is the half under test and
 *               the only thing in the row that is not context.
 *   row 2       the BD-X fusion is blue, for the same reason, and AD-Y
 *               is absent rather than demoted.
 *   row 3       both fusions have been met, so the DOMAINS drop back to
 *               ink and blue narrows to X and Y themselves, which is
 *               where the row's argument is -- they touch.  The
 *               transcription arrow and the check mark go to vermillion:
 *               blue is already carrying the contact, and this is the
 *               one row in which anything fires.
 *
 * Vermillion appears once in the figure and never alone -- it lands on
 * the row whose readout glyph is a check rather than an X, so the
 * distinction survives greyscale and red-green CVD (palette.css, KNOWN
 * LIMITATION).
 *
 * CHANGES TO JCA'S SLIDE.  One, and it is the recolouring above: the
 * five theme hues are gone and nothing is colored by what kind of
 * object it is.  No text was added, removed or reworded -- the figure
 * has exactly the six labels and the three readout glyphs the source
 * has, and no caption, footer, takeaway or color key, which the source
 * does not have either.  Positions follow the render: BD on the UAS
 * with X above it, AD to the right of Y, the arrow rising at the
 * UAS/reporter junction, the readout glyph over its horizontal run.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

var INK  = "#111111",
    BLUE = "#004373",
    VERM = "#ba3a13",
    RULE = "#e2e2e2",
    PAPER = "#ffffff";

/* ---- canvas ------------------------------------------------------- */
var VW = 1480, VH = 640;

/* the DNA line, identical in every row */
var DNA_X0 = 200, JUNC = 620, DNA_X1 = 1290, DNA_H = 36;

/* the three rows, given by the y of the TOP of their DNA line.  All the
   geometry below is written relative to that, with negative y upward. */
var ROWS = [190, 395, 600];

function esc(s){ return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

function text(x, y, s, size, fill, weight){
  return '<text x="' + x + '" y="' + y + '" text-anchor="middle" '
    + 'font-family="inherit" font-size="' + size + '" font-weight="'
    + (weight || 700) + '" fill="' + fill + '">' + esc(s) + '</text>';
}

/* ---- the DNA line -------------------------------------------------- */
function dna(T){
  var s = "";
  /* UAS filled to --rule, reporter left white: the two boxes are told
     apart by their labels and the divider, not by a hue each */
  s += '<rect x="' + DNA_X0 + '" y="' + T + '" width="' + (JUNC - DNA_X0)
     + '" height="' + DNA_H + '" fill="' + RULE + '" stroke="' + INK
     + '" stroke-width="2.5"/>';
  s += '<rect x="' + JUNC + '" y="' + T + '" width="' + (DNA_X1 - JUNC)
     + '" height="' + DNA_H + '" fill="' + PAPER + '" stroke="' + INK
     + '" stroke-width="2.5"/>';
  s += text((DNA_X0 + JUNC) / 2, T + DNA_H / 2 + 8, "UAS", 23, INK);
  s += text((JUNC + DNA_X1) / 2, T + DNA_H / 2 + 8, "Reporter Gene", 23, INK);
  return s;
}

/* ---- the bent transcription arrow ---------------------------------- */
var ARROW_RISE = 56, ARROW_TIP = 1012;

function arrow(T, col, w){
  var y = T - ARROW_RISE, s = "";
  s += '<path d="M ' + JUNC + ' ' + (T + 2) + ' L ' + JUNC + ' ' + y
     + ' L ' + (ARROW_TIP - 22) + ' ' + y + '" fill="none" stroke="' + col
     + '" stroke-width="' + w + '" stroke-linecap="butt" stroke-linejoin="miter"/>';
  s += '<path d="M ' + ARROW_TIP + ' ' + y + ' L ' + (ARROW_TIP - 26) + ' '
     + (y - 14) + ' L ' + (ARROW_TIP - 26) + ' ' + (y + 14) + ' Z" fill="'
     + col + '"/>';
  return s;
}

/* ---- the readout glyphs -------------------------------------------- */
/* centered over the arrow's horizontal run, as in the render */
var GLYPH_X = 900, GLYPH_DY = -96;

function cross(T, col){
  var cx = GLYPH_X, cy = T + GLYPH_DY, r = 27;
  return '<path d="M ' + (cx - r) + ' ' + (cy - r) + ' L ' + (cx + r) + ' '
    + (cy + r) + ' M ' + (cx + r) + ' ' + (cy - r) + ' L ' + (cx - r) + ' '
    + (cy + r) + '" fill="none" stroke="' + col
    + '" stroke-width="10" stroke-linecap="round"/>';
}

function tick(T, col){
  var cx = GLYPH_X, cy = T + GLYPH_DY;
  return '<path d="M ' + (cx - 28) + ' ' + (cy + 2) + ' L ' + (cx - 8) + ' '
    + (cy + 24) + ' L ' + (cx + 30) + ' ' + (cy - 26) + '" fill="none" stroke="'
    + col + '" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>';
}

/* ---- the fusion halves --------------------------------------------- */
/* A domain is a rounded rectangle; a protein is a blob.  X is notched
   on its upper right and Y is round, so the two of them only fit
   together one way -- that is what row 3 shows, and it is shape doing
   the work rather than color. */
var DOM_W = 110, DOM_H = 52;

/* `hollow` draws the domain as an outline on white instead of a solid.
   A solid ink slab is the heaviest mark on the slide, which is the
   opposite of what ink is for; hollow lets row 3's domains sit back
   while the blue proteins stay the loudest thing in the row. */
function domain(cx, cy, label, col, hollow){
  var s = '<rect x="' + (cx - DOM_W / 2) + '" y="' + (cy - DOM_H / 2)
    + '" width="' + DOM_W + '" height="' + DOM_H + '" rx="12" fill="'
    + (hollow ? PAPER : col) + '" stroke="' + (hollow ? col : PAPER)
    + '" stroke-width="' + (hollow ? 2.5 : 3) + '"/>';
  return s + text(cx, cy + 8, label, 21, hollow ? col : PAPER);
}

/* X: a disc with a wedge taken out between -70deg and -5deg */
function blobX(cx, cy, r, col){
  var a1 = -5 * Math.PI / 180, a2 = -70 * Math.PI / 180;
  var x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
  var x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
  var d = "M " + cx.toFixed(1) + " " + cy.toFixed(1)
        + " L " + x1.toFixed(1) + " " + y1.toFixed(1)
        + " A " + r + " " + r + " 0 1 1 " + x2.toFixed(1) + " " + y2.toFixed(1)
        + " Z";
  /* paper stroke, not a stroke in the fill color: where two blue shapes
     touch -- which is the whole point of row 3 -- a same-color stroke
     fuses them into one blob and the contact stops being visible */
  return '<path d="' + d + '" fill="' + col + '" stroke="' + PAPER
    + '" stroke-width="3" stroke-linejoin="round"/>'
    + text(cx - 10, cy + 16, "X", 23, PAPER);
}

/* Y: a plain disc, which is what seats into X's notch */
function blobY(cx, cy, r, col){
  return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + col
    + '" stroke="' + PAPER + '" stroke-width="3"/>'
    + text(cx, cy + 8, "Y", 23, PAPER);
}

/* positions, relative to the top of the row's DNA line.  BD sits on the
   UAS with X above it; Y rides in X's notch, up and to the right, with
   AD beyond it -- the arrangement of the render. */
var BD_CX = 373, BD_CY = -30,
    X_CX  = 470, X_CY  = -72, X_R = 44,
    Y_CX  = 532, Y_CY  = -118, Y_R = 42,
    AD_CX = 631, AD_CY = -118;

/* Y's center is 77 from X's, on the bearing of the notch (-37.5deg):
   far enough out that the notch still reads as a seat rather than
   vanishing under Y, close enough that the two plainly touch. */
function bdx(T, protCol, domCol, hollow){
  return domain(BD_CX, T + BD_CY, "BD", domCol, hollow)
       + blobX(X_CX, T + X_CY, X_R, protCol);
}

function ady(T, protCol, domCol, hollow){
  return blobY(Y_CX, T + Y_CY, Y_R, protCol)
       + domain(AD_CX, T + AD_CY, "AD", domCol, hollow);
}

/* ---- the three rows ------------------------------------------------ */
function rows(){
  var s = "";

  /* row 1 -- AD-Y alone, floating free: the whole fusion is blue */
  s += dna(ROWS[0]);
  s += arrow(ROWS[0], INK, 4);
  s += ady(ROWS[0], BLUE, BLUE);
  s += cross(ROWS[0], INK);

  /* row 2 -- BD-X alone, tethered but inert: the whole fusion is blue */
  s += dna(ROWS[1]);
  s += arrow(ROWS[1], INK, 4);
  s += bdx(ROWS[1], BLUE, BLUE);
  s += cross(ROWS[1], INK);

  /* row 3 -- both.  The domains are context now; blue narrows to the two
     proteins, which touch, and the firing output takes vermillion. */
  s += dna(ROWS[2]);
  s += arrow(ROWS[2], VERM, 5);
  s += bdx(ROWS[2], BLUE, INK, true);
  s += ady(ROWS[2], BLUE, INK, true);
  s += tick(ROWS[2], VERM);

  return s;
}

var ALT = "Three rows, each a UAS box beside a reporter gene box with a "
  + "transcription arrow rising from the junction. Row one: the AD domain "
  + "fused to protein Y floats free above the DNA and there is no "
  + "transcription, marked with an X. Row two: the BD domain fused to "
  + "protein X sits on the UAS and there is still no transcription, marked "
  + "with an X. Row three: both are present, X and Y touch, and "
  + "transcription happens, marked with a check.";

function draw(){
  return rows();
}

function fill(){
  var el = document.querySelector('[data-fig="39"]');
  if (!el) return;
  el.innerHTML = '<svg viewBox="0 0 ' + VW + ' ' + VH + '" '
    + 'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + ALT
    + '">' + draw() + '</svg>';
}

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
