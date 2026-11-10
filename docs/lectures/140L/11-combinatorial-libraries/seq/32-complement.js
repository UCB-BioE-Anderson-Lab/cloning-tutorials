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
 * THE DELETION IS DRAWN AS A GAP IN THE GENOME, not as a cross or a
 * shaded box, because a deletion is missing DNA and the circle should
 * actually be open.  The plasmid's insert is drawn the same width as
 * the gap, which is what "complement" means here.
 *
 * Authored at 1400x500.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", MUTED = "#767676",
      PALE = "#eef2f5", RULE = "#d8d8d8";
const n2 = v => Math.round(v * 10) / 10;
const R2 = Math.PI / 180;

/* ---- a cell: a capsule with a genome in it ------------------------- *
 * gap: the deletion, in degrees of the genome circle.  plasmid: a
 * colour, or null for a cell that has not been transformed yet.
 * ------------------------------------------------------------------ */
function cell(cx, cy, plasmid){
  const w = 244, h = 136, r = h/2;
  let s = '<rect x="' + n2(cx - w/2) + '" y="' + n2(cy - h/2) + '" width="' + w +
          '" height="' + h + '" rx="' + r + '" fill="' + PALE + '" stroke="' +
          INK + '" stroke-width="3"/>';
  /* the genome, open where the activity used to be */
  const gx = cx - 42, gr = 38, a0 = -46, a1 = 286;
  const p0 = [gx + Math.cos(a0*R2)*gr, cy + Math.sin(a0*R2)*gr];
  const p1 = [gx + Math.cos(a1*R2)*gr, cy + Math.sin(a1*R2)*gr];
  s += '<path d="M ' + n2(p0[0]) + ' ' + n2(p0[1]) + ' A ' + gr + ' ' + gr +
       ' 0 1 1 ' + n2(p1[0]) + ' ' + n2(p1[1]) + '" fill="none" stroke="' + INK +
       '" stroke-width="5"/>';
  /* the gap, named */
  s += '<text x="' + n2(gx + 54) + '" y="' + n2(cy - 46) + '" ' +
       'font-family="inherit" font-size="25" font-weight="700" fill="' + VERM +
       '">Δ</text>';

  if (plasmid){
    const px = cx + 62, pr = 25;
    s += '<circle cx="' + px + '" cy="' + cy + '" r="' + pr + '" fill="none" ' +
         'stroke="' + INK + '" stroke-width="4"/>';
    s += arcSeg(px, cy, pr, -58, 58, plasmid, 8);
  }
  return s;
}
function arcSeg(cx, cy, r, a0, a1, colour, w){
  const p0 = [cx + Math.cos(a0*R2)*r, cy + Math.sin(a0*R2)*r];
  const p1 = [cx + Math.cos(a1*R2)*r, cy + Math.sin(a1*R2)*r];
  return '<path d="M ' + n2(p0[0]) + ' ' + n2(p0[1]) + ' A ' + r + ' ' + r +
         ' 0 ' + ((a1-a0) > 180 ? 1 : 0) + ' 1 ' + n2(p1[0]) + ' ' + n2(p1[1]) +
         '" fill="none" stroke="' + colour + '" stroke-width="' + (w || 7) +
         '" stroke-linecap="round"/>';
}

/* a loose plasmid, for the library cloud */
function plasmid(cx, cy, r, colour){
  return '<circle cx="' + n2(cx) + '" cy="' + n2(cy) + '" r="' + r + '" ' +
         'fill="none" stroke="' + INK + '" stroke-width="3"/>' +
         arcSeg(cx, cy, r, -58, 58, colour, 7);
}

/* ---- a plate ------------------------------------------------------- */
function plate(cx, cy, r, spec, seed){
  const rand = window.LotteryBall.rng(seed);
  let s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#fbfbfb" ' +
          'stroke="' + INK + '" stroke-width="3"/>';
  let placed = [];
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
    placed = placed.slice();
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
  const CY = 210;
  let s = "";

  /* ---- 1. the knockout strain ---- */
  s += '<g data-build="1" data-note-add="So you start with a strain that has ' +
       'the activity deleted from its genome. On its own, under the ' +
       'non-permissive condition, this cell is dead.">';
  s += cell(176, CY, null);
  s += cap(176, CY + 104, "Δ strain", INK, 26, "middle", 700);
  s += cap(176, CY + 136, "cannot grow", MUTED, 23);
  s += '</g>';

  /* ---- 2. the library goes in ---- */
  s += '<g data-build="2" data-note-add="Then you transform in the library. ' +
       'Most of the plasmids carry something that does not do the job, and ' +
       'one of them carries something that does.">';
  s += arrow(312, CY, 404, CY);
  /* the library, as a small cloud above the arrow */
  [[352, CY-104, MUTED], [410, CY-128, MUTED], [470, CY-104, VERM],
   [412, CY-70, MUTED]].forEach(function(q){
    s += plasmid(q[0], q[1], 24, q[2]);
  });
  s += cap(410, CY-162, "plasmid library", INK, 24);
  s += arrow(432, CY-48, 466, CY-14, MUTED);
  s += cell(566, CY, VERM);
  s += cap(566, CY + 104, "transformants", INK, 26, "middle", 700);
  s += cap(566, CY + 136, "one plasmid each", MUTED, 23);
  s += '</g>';

  /* ---- 3. the two plates, which are the whole argument ---- */
  /* Stacked, and far enough apart that the upper plate's two caption
     lines clear the lower plate -- the first pass put them 196 apart
     with 84-radius plates and the captions landed inside the rim. */
  s += '<g data-build="3" data-note-add="Split that population on to two ' +
       'plates. On the permissive plate everything grows, which tells you ' +
       'how many transformants you had. On the non-permissive plate only ' +
       'the cells whose plasmid complements the deletion can grow, and ' +
       'those are your hits.">';
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
    'role="img" aria-label="Direct complementation in three steps. First a ' +
    'cell whose genome is drawn as an open circle with a gap where the ' +
    'activity was deleted; on its own it cannot grow. Then a library of ' +
    'plasmids, three grey and one red, is transformed in, giving cells that ' +
    'each carry one plasmid. The population is split on to two plates: the ' +
    'permissive plate is a lawn of ninety colonies, and the non-permissive ' +
    'plate has only four, drawn in red, which are the cells whose plasmid ' +
    'complements the deletion. Those are the ones whose plasmid you ' +
    'sequence.">' + s + '</svg>';
}

function fill(){
  const el = document.querySelector('[data-fig="complement"]');
  if (el) el.innerHTML = complement();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
