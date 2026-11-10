/* ------------------------------------------------------------------ *
 * 30-yeast.js : source 30, yeast surface display, redrawn.
 *
 * Fills  [data-fig="yeast"]
 *
 * WHY REDRAWN.  ppt/media/image36.png is 400x377 shown about 1100px
 * wide, and its type is dark grey inside pale green and pale blue
 * blocks.  PLAN.txt had this recorded as one of the three legibility
 * gaps inherited from the source and deliberately left alone; it was
 * also, after the ink pass, the weakest type in the deck.  JCA asked
 * on 2026-11-10 for the original or a redraw.  The original is the
 * 400px file -- there is nothing better to retrieve -- so it is
 * redrawn.  That makes seven.
 *
 * SAME SHAPES.  Aga2 as a capsule fused straight into the protein of
 * interest, two disulfides drawn as S-S ladders, Aga1 as a rounded
 * block sitting on the cell wall, and the wall as a thick curved band
 * with a leader to its name.  Nothing is added and nothing moves.
 *
 * COLOUR.  The source's own coding, made legible: the two Aga parts
 * are green because they are the SAME machinery, the protein of
 * interest is blue because it is the thing you supplied, and the wall
 * is a paler blue band so it reads as structure rather than as cargo.
 * Both fills now carry white type -- green at 4.9:1, blue at 10:1 --
 * instead of dark grey on pale, which is what made it the weakest
 * type in the deck.
 *
 * The fusion is drawn as ONE shape with a seam, not two boxes side by
 * side, because that is the fact the slide is teaching: Aga2 and the
 * protein of interest are a single translated chain, and only the
 * disulfides below are a join between molecules.
 *
 * Authored at 1180x770.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", GREEN = "#2e7d4f", BLUE = "#004373",
      WALL = "#5a93c0", MUTED = "#767676";
const n2 = v => Math.round(v * 10) / 10;

/* ---- the fusion ---------------------------------------------------- *
 * One outline: round cap on the free end of Aga2, square on the far
 * end of the passenger, and a seam where the two halves meet.
 * ------------------------------------------------------------------ */
function fusion(){
  const x0 = 284, seam = 560, x1 = 1096, y = 64, h = 92, r = h/2;
  let s = '<path d="M ' + (x0 + r) + ' ' + y +
          ' L ' + x1 + ' ' + y + ' L ' + x1 + ' ' + (y + h) +
          ' L ' + (x0 + r) + ' ' + (y + h) +
          ' A ' + r + ' ' + r + ' 0 0 1 ' + (x0 + r) + ' ' + y + ' Z" ' +
          'fill="' + BLUE + '"/>';
  /* Aga2's half, laid over the left end of the same outline */
  s += '<path d="M ' + seam + ' ' + y + ' L ' + (x0 + r) + ' ' + y +
       ' A ' + r + ' ' + r + ' 0 0 0 ' + (x0 + r) + ' ' + (y + h) +
       ' L ' + seam + ' ' + (y + h) + ' Z" fill="' + GREEN + '"/>';
  s += '<path d="M ' + (x0 + r) + ' ' + y + ' L ' + x1 + ' ' + y +
       ' L ' + x1 + ' ' + (y + h) + ' L ' + (x0 + r) + ' ' + (y + h) +
       ' A ' + r + ' ' + r + ' 0 0 1 ' + (x0 + r) + ' ' + y + ' Z" ' +
       'fill="none" stroke="' + INK + '" stroke-width="3"/>';
  s += '<line x1="' + seam + '" y1="' + y + '" x2="' + seam + '" y2="' + (y+h) +
       '" stroke="' + INK + '" stroke-width="3"/>';
  s += '<text x="' + n2((x0 + seam)/2 + 14) + '" y="' + n2(y + h/2 + 1) +
       '" text-anchor="middle" dominant-baseline="central" font-family="inherit" ' +
       'font-size="31" font-weight="700" fill="#ffffff">Aga2</text>';
  s += '<text x="' + n2((seam + x1)/2) + '" y="' + n2(y + h/2 + 1) +
       '" text-anchor="middle" dominant-baseline="central" font-family="inherit" ' +
       'font-size="31" font-weight="700" fill="#ffffff">protein of interest</text>';
  return s;
}

/* ---- a disulfide ladder -------------------------------------------- *
 * line, S, line, S, line -- the source's own notation for a pair of
 * cystines holding the two subunits together.
 * ------------------------------------------------------------------ */
function disulfide(x, yTop, yBot){
  const s1 = yTop + 92, s2 = yBot - 92;
  let s = "";
  [[yTop, s1 - 18], [s1 + 16, s2 - 18], [s2 + 16, yBot]].forEach(function(seg){
    s += '<line x1="' + x + '" y1="' + n2(seg[0]) + '" x2="' + x + '" y2="' +
         n2(seg[1]) + '" stroke="' + INK + '" stroke-width="3"/>';
  });
  [s1, s2].forEach(function(y){
    s += '<text x="' + x + '" y="' + n2(y) + '" text-anchor="middle" ' +
         'dominant-baseline="central" font-family="inherit" font-size="30" ' +
         'fill="' + INK + '">S</text>';
  });
  return s;
}

function yeast(){
  let s = fusion();

  const yTop = 156, yBot = 432;
  s += disulfide(396, yTop, yBot);
  s += disulfide(474, yTop, yBot);

  /* Aga1, anchored in the wall */
  s += '<rect x="356" y="' + yBot + '" width="158" height="152" rx="20" fill="' +
       GREEN + '" stroke="' + INK + '" stroke-width="3"/>';
  s += '<text x="435" y="' + (yBot + 78) + '" text-anchor="middle" ' +
       'dominant-baseline="central" font-family="inherit" font-size="31" ' +
       'font-weight="700" fill="#ffffff">Aga1</text>';

  /* the cell wall: a thick band curving away under the anchor */
  const cx = 435, cy = 1460, R = 876, W = 44;
  s += '<path d="M ' + (cx - 560) + ' ' + n2(cy - Math.sqrt(R*R - 560*560)) +
       ' A ' + R + ' ' + R + ' 0 0 1 ' + (cx + 560) + ' ' +
       n2(cy - Math.sqrt(R*R - 560*560)) + '" fill="none" stroke="' + WALL +
       '" stroke-width="' + W + '"/>';
  s += '<path d="M ' + (cx - 560) + ' ' + n2(cy - Math.sqrt(R*R - 560*560)) +
       ' A ' + R + ' ' + R + ' 0 0 1 ' + (cx + 560) + ' ' +
       n2(cy - Math.sqrt(R*R - 560*560)) + '" fill="none" stroke="' + INK +
       '" stroke-width="' + (W + 6) + '" opacity="0.001"/>';
  /* its two edges, so the band reads as a wall and not as a stroke */
  [W/2, -W/2].forEach(function(off){
    const r = R + off;
    s += '<path d="M ' + (cx - 556) + ' ' + n2(cy - Math.sqrt(r*r - 556*556)) +
         ' A ' + r + ' ' + r + ' 0 0 1 ' + (cx + 556) + ' ' +
         n2(cy - Math.sqrt(r*r - 556*556)) + '" fill="none" stroke="' + INK +
         '" stroke-width="3"/>';
  });

  /* the wall's name, with a leader on to the band */
  s += '<line x1="880" y1="664" x2="812" y2="712" stroke="' + INK +
       '" stroke-width="2.5"/>';
  s += '<text x="896" y="652" font-family="inherit" font-size="30" fill="' +
       INK + '">cell wall</text>';

  return '<svg viewBox="0 0 1180 770" xmlns="http://www.w3.org/2000/svg" ' +
    'role="img" aria-label="Yeast surface display. A single fused chain lies ' +
    'across the top: a green Aga2 capsule running straight into a blue block ' +
    'labelled protein of interest, with a seam where they join. Two disulfide ' +
    'ladders, each drawn as S to S, hang from Aga2 down to a green Aga1 block, ' +
    'which sits on a thick blue band of cell wall curving away on both sides. ' +
    'The protein of interest therefore ends up outside the cell that carries ' +
    'its gene.">' + s + '</svg>';
}

function fill(){
  const el = document.querySelector('[data-fig="yeast"]');
  if (el) el.innerHTML = yeast();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
