/* ------------------------------------------------------------------ *
 * 11-ortholog.js : source 11, "Metagenomic Ortholog libraries".
 *
 * Fills  [data-fig="11"]      viewBox 0 0 1480 640
 *
 * WHY THIS EXISTS.  Source 11 is a PowerPoint figure: a screenshot of a
 * GenBank flatfile at left, a thin diagonal connector, and a stack of
 * four right-arrows in four PowerPoint theme fills -- accent1 blue,
 * accent4 yellow, accent6 green, and a hand-picked 7030A0 purple.  The
 * four hues carry ONE idea, that these are different but related
 * sequences, and FIGURE-CONTRACT.md names exactly that as the trap:
 * four hues is an identity map, and the palette is an attention ladder.
 *
 * WHAT IS DRAWN, left to right, matching the source's own layout:
 *   - the database record, schematized: header line, a GenBank-style
 *     two-column flatfile body, a block of sequence at the bottom, and
 *     the little database cylinder that sits over its lower right.
 *   - the thin arrow, running down and to the right as the source's
 *     straightConnector1 does (off 2895600,3119912 ext 1143000,1295400).
 *   - four gene arrows, same four, same stack, same left alignment.
 *
 * HOW THE FOUR-WAY DISTINCTION IS CARRIED WITHOUT FOUR HUES.  Three
 * things, none of them hue:
 *   1. LENGTH.  The four differ in length, as orthologs of one class do.
 *   2. INTERNAL BANDING.  Each gene carries three blocks at roughly --
 *      but only roughly -- the same relative positions, with different
 *      widths and offsets.  That is the actual shape of an ortholog
 *      family: shared architecture, divergent detail.  It is what makes
 *      the four read as "related but different" rather than as "four".
 *   3. POSITION in the stack, which the source already used.
 * Every gene is ink on white; the blocks are blue.  Blue is promoted
 * here because the conserved architecture is the one thing the viewer
 * is meant to follow -- it is what makes these A CLASS of elements.
 * That survives greyscale (blue is a full rung below ink in luminance)
 * and survives dichromacy (blue is the other pole).
 *
 * CHANGES TO JCA'S SLIDE, each one listed:
 *
 * 1. THE FOUR THEME FILLS ARE GONE, replaced as described above.  No
 *    hue outside palette.css appears in this figure.
 *
 * 2. THE CAPTION TEXT BOX IS NOT REDRAWN.  "Synthesize orthologs of a
 *    class of genetic elements" is already the slide's one-line <ul>,
 *    so drawing it again inside the figure would print it twice.  The
 *    words are unchanged; only their container moved, and they moved
 *    when the deck was cut, not here.
 *
 * 3. THE SCREENSHOT IS SCHEMATIZED.  A 100-dpi bitmap of a flatfile is
 *    unreadable from the back of the room, and the deck has no business
 *    shipping someone else's page as an image.  The header line is kept
 *    verbatim -- "Bacillus cereus 23S rRNA gene, type strain LMG 6923"
 *    is legible in the source and is the only line of it that is -- and
 *    the rest is drawn as the shape of a GenBank record: a keyword
 *    column, a value column, a sequence block.  No word of the body is
 *    invented, because no word of the body is drawn.
 *
 * 4. THE CLIP-ART GLOBE ON THE DATABASE ICON IS DROPPED.  The disk
 *    stack is kept because it is what says "database"; the globe was a
 *    gstatic thumbnail and carried nothing.
 *
 * NO NUMBERS APPEAR.  JCA's note for this slide gives ~1000 genes on
 * one chip, and the source slide shows none of that, so neither does
 * the figure.  Four genes are drawn because the source drew four; they
 * are not a count of anything.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK   = "#111111",
      BLUE  = "#004373",
      MUTED = "#767676",
      RULE  = "#e2e2e2",
      PAPER = "#ffffff";

/* deterministic, so the greeked flatfile is the same drawing every
   load and can be checked against a screenshot */
function rng(seed){
  let s = seed >>> 0;
  return function(){ s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

const esc = t => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const n1  = v => Math.round(v * 10) / 10;

/* ---- the database record ------------------------------------------- *
 * x 40..460, y 54..554 -- the source's picture is 2205544 x 2938463 EMU,
 * so it is about three units tall for four wide; this keeps that.
 * ------------------------------------------------------------------ */
const PX = 40, PY = 54, PW = 420, PH = 500;

function record(){
  let s = "";

  s += '<rect x="' + PX + '" y="' + PY + '" width="' + PW + '" height="' + PH +
       '" fill="' + PAPER + '" stroke="' + RULE + '" stroke-width="2"/>';

  /* header: the one line of the screenshot that is actually legible */
  s += '<text x="' + (PX + 18) + '" y="' + (PY + 34) + '" font-family="inherit" ' +
       'font-size="19" font-weight="700" fill="' + INK + '">' +
       esc("Bacillus cereus 23S rRNA") + '</text>';
  s += '<text x="' + (PX + 18) + '" y="' + (PY + 58) + '" font-family="inherit" ' +
       'font-size="19" font-weight="700" fill="' + INK + '">' +
       esc("gene, type strain LMG 6923") + '</text>';
  s += '<line x1="' + (PX + 18) + '" y1="' + (PY + 74) + '" x2="' + (PX + PW - 18) +
       '" y2="' + (PY + 74) + '" stroke="' + RULE + '" stroke-width="2"/>';

  /* the flatfile body: a keyword column and a value column.  Bars, not
     words -- the figure says "a database record", it does not pretend
     to quote one. */
  const rand = rng(11011);
  const KX = PX + 18, VX = PX + 128, VR = PX + PW - 20;
  let y = PY + 100;
  for (let i = 0; i < 13; i++){
    const keyed = rand() < 0.42;
    if (keyed){
      s += '<rect x="' + KX + '" y="' + y + '" width="' + n1(44 + rand() * 46) +
           '" height="7" fill="' + MUTED + '"/>';
    }
    const w = (VR - VX) * (0.30 + rand() * 0.70);
    s += '<rect x="' + VX + '" y="' + y + '" width="' + n1(w) +
         '" height="7" fill="' + RULE + '"/>';
    y += 17;
  }

  /* the sequence block: numbered lines, denser, ragged last line.
     Row counts here are set by the panel, not by the record: 13 and 8
     are what fit between the rule and the panel's lower edge. */
  y += 16;
  for (let i = 0; i < 8; i++){
    s += '<rect x="' + KX + '" y="' + y + '" width="26" height="6" fill="' +
         MUTED + '"/>';
    const full = i < 7;
    const w = full ? (VR - (KX + 38)) : (VR - (KX + 38)) * 0.47;
    s += '<rect x="' + (KX + 38) + '" y="' + y + '" width="' + n1(w) +
         '" height="6" fill="' + RULE + '"/>';
    y += 15;
  }

  /* the database cylinder, over the record's lower right as in the
     source (icon off 2209800,2409230 against picture off 533400,882617) */
  const cx = PX + PW - 6, cy = PY + PH - 96, rx = 46, ry = 15;
  s += '<g fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.5" ' +
       'stroke-linejoin="round">';
  s += '<path d="M ' + (cx - rx) + ' ' + cy + ' V ' + (cy + 58) +
       ' A ' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + (cy + 58) +
       ' V ' + cy + ' Z"/>';
  s += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"/>';
  s += '</g>';
  s += '<path d="M ' + (cx - rx) + ' ' + (cy + 20) + ' A ' + rx + ' ' + ry +
       ' 0 0 0 ' + (cx + rx) + ' ' + (cy + 20) + '" fill="none" stroke="' + INK +
       '" stroke-width="2" opacity="0.5"/>';
  s += '<path d="M ' + (cx - rx) + ' ' + (cy + 39) + ' A ' + rx + ' ' + ry +
       ' 0 0 0 ' + (cx + rx) + ' ' + (cy + 39) + '" fill="none" stroke="' + INK +
       '" stroke-width="2" opacity="0.5"/>';

  return s;
}

/* ---- the connector -------------------------------------------------- *
 * The source's arrow leaves the database icon and runs down and to the
 * right.  Same here, from the cylinder to the gene stack.  Drawn as a
 * path, not a marker: markers need page-global ids and several figures
 * share a page.
 * ------------------------------------------------------------------ */
function connector(){
  const x1 = PX + PW + 24, y1 = PY + PH - 58,
        x2 = 640,          y2 = 470;
  const a = Math.atan2(y2 - y1, x2 - x1), h = 17, sp = 0.42;
  let s = '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + n1(x2 - Math.cos(a) * 9) +
          '" y2="' + n1(y2 - Math.sin(a) * 9) + '" stroke="' + INK +
          '" stroke-width="2"/>';
  s += '<path d="M ' + x2 + ' ' + y2 +
       ' L ' + n1(x2 - Math.cos(a - sp) * h) + ' ' + n1(y2 - Math.sin(a - sp) * h) +
       ' L ' + n1(x2 - Math.cos(a + sp) * h) + ' ' + n1(y2 - Math.sin(a + sp) * h) +
       ' Z" fill="' + INK + '"/>';
  return s;
}

/* ---- the four genes -------------------------------------------------- *
 * [length, [[start, width] ...]] with every value a fraction of the
 * LONGEST gene, so the blocks sit at comparable places along the stack
 * and the eye can see them not quite line up.  Lengths and offsets are
 * drawing values: they say "these differ", they do not measure anything.
 * ------------------------------------------------------------------ */
const GX = 680, GW = 760, GH = 86, GGAP = 48, HEAD = 52, WAIST = 32;

const GENES = [
  [0.91, [[0.09, 0.14], [0.34, 0.19], [0.63, 0.13]]],
  [1.00, [[0.12, 0.12], [0.38, 0.21], [0.69, 0.16]]],
  [0.83, [[0.07, 0.16], [0.31, 0.16], [0.58, 0.12]]],
  [0.94, [[0.11, 0.13], [0.36, 0.23], [0.66, 0.14]]]
];

function gene(spec, yc){
  const L = spec[0] * GW, tip = GX + L, shoulder = tip - HEAD;
  let s = '<path d="M ' + GX + ' ' + (yc - WAIST) +
          ' H ' + n1(shoulder) + ' V ' + (yc - GH / 2) +
          ' L ' + n1(tip) + ' ' + yc +
          ' L ' + n1(shoulder) + ' ' + (yc + GH / 2) +
          ' V ' + (yc + WAIST) + ' H ' + GX + ' Z" fill="' + PAPER +
          '" stroke="' + INK + '" stroke-width="2.5" stroke-linejoin="round"/>';

  spec[1].forEach(function(b){
    const x = GX + b[0] * GW, w = Math.min(b[1] * GW, shoulder - 6 - x);
    if (w <= 0) return;
    s += '<rect x="' + n1(x) + '" y="' + (yc - WAIST + 5) + '" width="' + n1(w) +
         '" height="' + (WAIST * 2 - 10) + '" fill="' + BLUE + '"/>';
  });
  return s;
}

function genes(){
  const span = GENES.length * GH + (GENES.length - 1) * GGAP;
  let y = 320 - span / 2 + GH / 2, s = "";
  GENES.forEach(function(g){ s += gene(g, y); y += GH + GGAP; });
  return s;
}

const ALT =
  "A database sequence record at left, with a database symbol over it, " +
  "and an arrow from it to four gene arrows stacked at right.  The four " +
  "genes are drawn alike -- the same outline, the same three dark blocks " +
  "in the same order -- but each has a different length and its blocks " +
  "fall at slightly different places and widths: one class of element, " +
  "four different members of it.";

function draw(){
  return record() + connector() + genes();
}

function fill(){
  const el = document.querySelector('[data-fig="11"]');
  if (!el) return;
  el.innerHTML = '<svg viewBox="0 0 1480 640" xmlns="http://www.w3.org/2000/svg" '
    + 'role="img" aria-label="' + esc(ALT).replace(/"/g, "&quot;") + '">'
    + draw() + '</svg>';
}

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
