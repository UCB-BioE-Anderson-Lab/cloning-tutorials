/* ------------------------------------------------------------------ *
 * 36-dual.js : source 36, dual selections -- new diagram.
 *
 * Fills  [data-fig="dual"]
 *
 * WHY IT EXISTS.  The source slide is five bullets.  The third --
 * "requires linkage in both a positive and a negative mode" -- is the
 * hard one, and no amount of re-reading a bullet makes it obvious why
 * you would ever want a selection that KILLS the cells with the
 * activity.  JCA asked on 2026-11-10 for a diagram.  The bullets and
 * the spoken note are untouched; the new narration is data-note-add.
 *
 * WHY IT IS DRAWN AS TWO SIEVES AND THREE KINDS OF VARIANT.  A dual
 * selection cannot be shown with "good" and "bad" variants, because
 * with only two kinds either round alone would do the job.  It needs
 * THREE, and the note names all three:
 *
 *   conditional   active only when the stimulus is there -- WANTED
 *   constitutive  active whether or not it is there
 *   dead          never active
 *
 * Round one, stimulus present, positive marker: dead ones die.
 * Round two, stimulus withheld, negative marker: constitutive ones
 * die, because they are still active and the negative marker kills
 * what is active.  Only the conditional ones come through both.  That
 * is the whole argument, and it is why one round is not enough --
 * which is exactly what the bullet cannot say.
 *
 * COLOUR.  Vermillion for the conditional variant, the one you are
 * trying to keep, and nothing else on the slide is vermillion.  Blue
 * for constitutive and grey for dead: both are failures, but they are
 * different failures and each round removes one of them.
 *
 * Authored at 1400x350, the shape of the band the bullets leave.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", BLUE = "#004373",
      MUTED = "#9a9a9a", RULE = "#d8d8d8";
const n2 = v => Math.round(v * 10) / 10;

const WANT = VERM, ALWAYS = BLUE, DEAD = MUTED;

/* a population, laid out on a small grid so the counts are countable */
function pop(cx, cy, spec, cols){
  const r = 13, gx = 32, gy = 32;
  const n = spec.length, rows = Math.ceil(n / cols);
  const x0 = cx - (cols - 1) * gx / 2, y0 = cy - (rows - 1) * gy / 2;
  let s = "";
  spec.forEach(function(c, i){
    const col = i % cols, row = Math.floor(i / cols);
    s += '<circle cx="' + n2(x0 + col*gx) + '" cy="' + n2(y0 + row*gy) +
         '" r="' + r + '" fill="' + c + '"/>';
  });
  return s;
}

function arrow(x0, y0, x1, y1, colour, w){
  const dx = x1-x0, dy = y1-y0, L = Math.hypot(dx,dy);
  const ux = dx/L, uy = dy/L, bx = x1-ux*16, by = y1-uy*16;
  return '<line x1="' + n2(x0) + '" y1="' + n2(y0) + '" x2="' + n2(bx) +
           '" y2="' + n2(by) + '" stroke="' + (colour||INK) + '" stroke-width="' +
           (w||4) + '"/>' +
         '<path d="M ' + n2(x1) + ' ' + n2(y1) + ' L ' + n2(bx - uy*9) + ' ' +
           n2(by + ux*9) + ' L ' + n2(bx + uy*9) + ' ' + n2(by - ux*9) +
           ' Z" fill="' + (colour||INK) + '"/>';
}
function txt(x, y, t, colour, size, anchor, weight){
  return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor||"middle") +
         '" font-family="inherit" font-size="' + (size||24) + '" font-weight="' +
         (weight||400) + '" fill="' + (colour||INK) + '">' + t + '</text>';
}

/* the three kinds, in the proportions the drawing uses throughout */
const LIB = [WANT,ALWAYS,DEAD,DEAD, ALWAYS,DEAD,WANT,DEAD,
             DEAD,WANT,ALWAYS,DEAD, WANT,DEAD,DEAD,ALWAYS];
const R1  = [WANT,ALWAYS,WANT,ALWAYS, WANT,ALWAYS,WANT,ALWAYS];
const R2  = [WANT,WANT,WANT,WANT];

function dual(){
  /* The band under five bullets is about 1380 by 340, so the drawing is
     authored at that aspect -- the first pass was 1400x440, which is
     taller than the band, so it scaled down to fit the HEIGHT and came
     out two-thirds width with every caption touching its neighbour. */
  const PY = 110;
  let s = "";

  /* the three populations, each in two rows so they stay short */
  s += pop(176, PY, LIB, 8);
  s += txt(176, PY + 86, "library", INK, 25, "middle", 700);

  s += arrow(324, PY, 496, PY);
  s += txt(410, PY - 56, "+ stimulus", VERM, 25, "middle", 700);
  s += txt(410, PY - 28, "positive marker", INK, 24);
  /* short enough to sit in the 264px between the two populations --
     the full sentence ran under the dots on both sides */
  s += txt(410, PY + 50, "kills the inactive", MUTED, 22);

  s += pop(600, PY, R1, 4);
  s += txt(600, PY + 86, "round 1 survivors", INK, 25, "middle", 700);

  s += arrow(684, PY, 856, PY);
  s += txt(770, PY - 56, "\u2212 stimulus", VERM, 25, "middle", 700);
  s += txt(770, PY - 28, "negative marker", INK, 24);
  s += txt(770, PY + 50, "kills the always-on", MUTED, 22);

  s += pop(980, PY, R2, 2);
  s += txt(980, PY + 86, "round 2 survivors", VERM, 25, "middle", 700);
  s += txt(980, PY + 114, "what you were after", MUTED, 22);

  /* the key, laid out ACROSS the foot rather than down the right-hand
     side: three kinds, and each round removes exactly one of them */
  s += '<line x1="60" y1="252" x2="1340" y2="252" stroke="' + RULE +
       '" stroke-width="2"/>';
  [[WANT, "active only with the stimulus", "what you want"],
   [ALWAYS, "active with or without it", "killed in round 2"],
   [DEAD, "never active", "lost in round 1"]].forEach(function(k, i){
    const x = 150 + i * 430;
    s += '<circle cx="' + x + '" cy="' + 300 + '" r="13" fill="' + k[0] + '"/>';
    s += txt(x + 28, 294, k[1], INK, 23, "start");
    s += txt(x + 28, 322, k[2], MUTED, 21, "start");
  });

  return '<svg viewBox="0 0 1400 350" xmlns="http://www.w3.org/2000/svg" ' +
    'role="img" aria-label="A dual selection as two sieves. The library holds ' +
    'three kinds of variant: red ones active only when the stimulus is there, ' +
    'blue ones active with or without it, and grey ones never active. Round ' +
    'one, with the stimulus present and a positive marker, removes the grey ' +
    'ones. Round two, with the stimulus withheld and a negative marker, ' +
    'removes the blue ones, because they are still active and the negative ' +
    'marker kills whatever is active. Only the red ones come through both, ' +
    'which is why one round would not be enough.">' + s + '</svg>';
}

function fill(){
  const el = document.querySelector('[data-fig="dual"]');
  if (el) el.innerHTML = dual();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
