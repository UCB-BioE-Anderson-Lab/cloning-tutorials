/* ------------------------------------------------------------------ *
 * 32-complement.js : source 32, direct complementation, new diagram.
 *
 * Fills  [data-fig="complement"]
 *
 * WHY IT EXISTS.  The source slide is four bullets and nothing else.
 * JCA asked on 2026-11-10 for a diagram under them showing the strain
 * with the gene removed, the plasmid going in, and the two plates.
 * Nothing is taken away -- the bullets are untouched and the spoken
 * note is the source's, verbatim.  The three beats below carry
 * data-note-add, which is spoken but is not part of what
 * verify_notes.py concatenates, so the verbatim claim still holds.
 *
 * THE DIAGRAM MAKES ONE CLAIM THE BULLETS CANNOT.  The bullets say
 * "select for growth under the non-permissive conditions" and leave
 * the reader to work out why that selects anything.  Drawn, it is
 * obvious in one look: the SAME transformed population is split on to
 * two plates, and the difference between the lawn and the four
 * colonies IS the selection.  So the two plates are the point of the
 * figure, and they are the only place vermillion is spent.
 *
 * COLOUR.  Ink for cells, genome and glassware.  Vermillion for the
 * complementing plasmid and for the colonies it rescues -- the same
 * red on the insert, on the one plasmid that works, and on the
 * survivors, so you can follow one molecule from the library to the
 * colony.  Everything else in the library is muted grey, because a
 * library member that does not complement is not wrong, it is just
 * not the answer.
 *
 * HOW THE DELETION IS DRAWN, to JCA's specification of 2026-11-10.
 * The first beat is a WILD-TYPE cell: a closed genome, nothing marked.
 * On the click a gene-shaped block appears on that genome in RED
 * OUTLINE -- outline, because the gene is the thing that is no longer
 * there -- and the caption changes from "wild type" to "knock out a
 * gene".  The plasmid then arrives carrying THE SAME SHAPE, FILLED.
 * Outline is the hole, fill is the thing that fits it, and the two
 * are drawn from one function so they cannot drift apart.  That is
 * what "complement" means, said in shapes rather than in a bullet.
 *
 * An earlier draft drew the deletion as a gap in the circle with a
 * delta beside it.  It was accurate and it read as a smudge.
 *
 * Authored at 1400x500.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", MUTED = "#767676",
      PALE = "#eef2f5", RULE = "#d8d8d8";
const n2 = v => Math.round(v * 10) / 10;
const R2 = Math.PI / 180;

/* ---- the gene, as a shape ------------------------------------------ *
 * One block arrow, drawn outlined when it is the hole in the genome
 * and filled when it is the copy on the plasmid.  Same call, same
 * geometry, so the two always match.
 * ------------------------------------------------------------------ */
function gene(x, y, len, h, rot, filled){
  const hd = h * 0.9, hh = h * 0.42;
  const d = 'M ' + n2(-len/2) + ' ' + n2(-h/2) +
            ' L ' + n2(len/2 - hd) + ' ' + n2(-h/2) +
            ' L ' + n2(len/2 - hd) + ' ' + n2(-h/2 - hh) +
            ' L ' + n2(len/2) + ' 0' +
            ' L ' + n2(len/2 - hd) + ' ' + n2(h/2 + hh) +
            ' L ' + n2(len/2 - hd) + ' ' + n2(h/2) +
            ' L ' + n2(-len/2) + ' ' + n2(h/2) + ' Z';
  return '<g transform="translate(' + n2(x) + ',' + n2(y) + ') rotate(' + n2(rot) +
         ')"><path d="' + d + '" fill="' + (filled ? VERM : "#ffffff") +
         '" stroke="' + VERM + '" stroke-width="3" stroke-linejoin="round"/></g>';
}
/* the same shape, sitting tangent on a ring at the given angle */
function geneOn(cx, cy, r, deg, filled, len){
  const a = deg * R2;
  return gene(cx + Math.cos(a)*r, cy + Math.sin(a)*r, len || 58, 19, deg + 90, filled);
}

/* ---- a cell -------------------------------------------------------- */
function capsule(cx, cy){
  const w = 244, h = 136;
  return '<rect x="' + n2(cx - w/2) + '" y="' + n2(cy - h/2) + '" width="' + w +
         '" height="' + h + '" rx="' + (h/2) + '" fill="' + PALE + '" stroke="' +
         INK + '" stroke-width="3"/>';
}
function ring(cx, cy, r, w){
  return '<circle cx="' + n2(cx) + '" cy="' + n2(cy) + '" r="' + r + '" ' +
         'fill="none" stroke="' + INK + '" stroke-width="' + (w||5) + '"/>';
}

/* ---- a plate ------------------------------------------------------- */
function plate(cx, cy, r, spec, seed){
  const rand = window.LotteryBall.rng(seed);
  let s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#fbfbfb" ' +
          'stroke="' + INK + '" stroke-width="3"/>';
  const placed = [];
  spec.forEach(function(sp){
    let guard = 0;
    while (placed.length < sp.n && guard++ < sp.n * 80){
      const a = rand() * 360, rr = Math.sqrt(rand()) * (r - 14);
      const x = cx + Math.cos(a*R2)*rr, y = cy + Math.sin(a*R2)*rr;
      if (placed.some(q => Math.hypot(q[0]-x, q[1]-y) < sp.r * 2.4)) continue;
      placed.push([x, y]);
      s += '<circle cx="' + n2(x) + '" cy="' + n2(y) + '" r="' + sp.r +
           '" fill="' + sp.fill + '"/>';
    }
  });
  return s;
}

function arrow(x0, y0, x1, y1, colour){
  const dx = x1-x0, dy = y1-y0, L = Math.hypot(dx,dy);
  const ux = dx/L, uy = dy/L, bx = x1-ux*16, by = y1-uy*16;
  return '<line x1="' + n2(x0) + '" y1="' + n2(y0) + '" x2="' + n2(bx) +
           '" y2="' + n2(by) + '" stroke="' + (colour||INK) + '" stroke-width="4"/>' +
         '<path d="M ' + n2(x1) + ' ' + n2(y1) + ' L ' + n2(bx - uy*9) + ' ' +
           n2(by + ux*9) + ' L ' + n2(bx + uy*9) + ' ' + n2(by - ux*9) +
           ' Z" fill="' + (colour||INK) + '"/>';
}
function cap(x, y, txt, colour, size, anchor, weight){
  return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor||"middle") +
         '" font-family="inherit" font-size="' + (size||25) + '" font-weight="' +
         (weight||400) + '" fill="' + (colour||INK) + '">' + txt + '</text>';
}

function complement(){
  const CY = 210, AX = 176, BX = 566;
  let s = "";

  /* ---- 1. the wild type ---- */
  s += '<g data-build="1" data-note-add="Start with the wild type. Its genome ' +
       'is intact and it grows anywhere.">';
  s += capsule(AX, CY);
  s += ring(AX, CY, 42);
  s += '</g>';
  s += '<text data-build="1" data-unbuild="2" x="' + AX + '" y="' + (CY + 104) +
       '" text-anchor="middle" font-family="inherit" font-size="26" ' +
       'font-weight="700" fill="' + INK + '">wild type</text>';

  /* ---- 2. knock the gene out ---- */
  s += '<g data-build="2" data-note-add="Knock out the activity of interest. ' +
       'The gene is gone, which is drawn here as its outline on the genome: ' +
       'the shape is still the right shape, there is just nothing in it. ' +
       'Under the non-permissive condition this cell is dead.">';
  s += geneOn(AX, CY, 42, -90, false);
  s += cap(AX, CY + 104, "knock out a gene", INK, 26, "middle", 700);
  s += cap(AX, CY + 136, "cannot grow", MUTED, 23);
  s += '</g>';

  /* ---- 3. the library goes in ---- */
  s += '<g data-build="3" data-note-add="Then transform in the library. Most ' +
       'of the plasmids carry something that does not fit. One of them carries ' +
       'the same shape, filled in -- a working copy of what was removed.">';
  s += arrow(312, CY, 404, CY);
  [[348, CY-108, false], [410, CY-134, false], [412, CY-66, false]]
    .forEach(function(q){
      s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="26" fill="none" ' +
           'stroke="' + MUTED + '" stroke-width="3.5"/>';
    });
  s += '<circle cx="478" cy="' + (CY-108) + '" r="26" fill="none" stroke="' + INK +
       '" stroke-width="3.5"/>';
  s += geneOn(478, CY-108, 26, -90, true, 46);
  s += cap(410, CY-178, "plasmid library", INK, 24);
  s += arrow(470, CY-70, 500, CY-34, MUTED);

  s += capsule(BX, CY);
  s += ring(BX - 48, CY, 42);
  s += geneOn(BX - 48, CY, 42, -90, false);
  s += '<circle cx="' + (BX + 66) + '" cy="' + CY + '" r="26" fill="none" ' +
       'stroke="' + INK + '" stroke-width="3.5"/>';
  s += geneOn(BX + 66, CY, 26, -90, true, 46);
  s += cap(BX, CY + 104, "transformants", INK, 26, "middle", 700);
  s += cap(BX, CY + 136, "one plasmid each", MUTED, 23);
  s += '</g>';

  /* ---- 4. the two plates, which are the whole argument ---- */
  s += '<g data-build="4" data-note-add="Split that population on to two ' +
       'plates. On the permissive plate everything grows, which tells you how ' +
       'many transformants you had. On the non-permissive plate only the cells ' +
       'whose plasmid complements the deletion can grow, and those are your ' +
       'hits.">';
  const PR = 70, PYT = 96, PYB = 342;
  s += arrow(700, CY - 26, 812, PYT + 40);
  s += arrow(700, CY + 26, 812, PYB - 40);
  s += plate(922, PYT, PR, [{ n: 90, r: 3.8, fill: INK }], 5101);
  s += cap(922, PYT + PR + 32, "permissive", INK, 25, "middle", 700);
  s += cap(922, PYT + PR + 60, "everything grows", MUTED, 23);

  s += plate(922, PYB, PR, [{ n: 4, r: 6.5, fill: VERM }], 5102);
  s += cap(922, PYB + PR + 32, "non-permissive", VERM, 25, "middle", 700);
  s += cap(922, PYB + PR + 60, "only the complemented", MUTED, 23);

  s += arrow(1000, PYB, 1086, PYB, VERM);
  s += cap(1102, PYB - 8, "sequence", INK, 25, "start", 700);
  s += cap(1102, PYB + 22, "the plasmid", INK, 25, "start", 700);
  s += '</g>';

  return '<svg viewBox="0 0 1400 500" xmlns="http://www.w3.org/2000/svg" ' +
    'role="img" aria-label="Direct complementation in four steps. A wild-type ' +
    'cell with a closed genome. Then a gene-shaped block appears on that ' +
    'genome in red outline, the knockout: the shape is right but nothing is ' +
    'in it, and the cell cannot grow. A library of plasmids is transformed in, ' +
    'three of them empty and one carrying the same shape filled solid red. ' +
    'The transformants are split on to two plates: the permissive plate is a ' +
    'lawn, and the non-permissive plate has only four red colonies, the cells ' +
    'whose plasmid complements the deletion, and those are the plasmids you ' +
    'sequence.">' + s + '</svg>';
}

function fill(){
  const el = document.querySelector('[data-fig="complement"]');
  if (el) el.innerHTML = complement();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
