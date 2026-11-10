/* ------------------------------------------------------------------ *
 * 27-m13.js : source 27, the M13 phagemid particle, redrawn.
 *
 * Fills  [data-fig="m13"]
 *
 * WHY REDRAWN.  ppt/media/image33.png is 408x243 and the deck shows it
 * about 1650px wide -- four times up -- and its five labels are white
 * type with a dark outline, drawn for a dark slide.  Between the
 * upscale and the white-on-nothing type there was nothing left to
 * rescue, which is what JCA saw.  It is the fourth figure in this deck
 * with the same two faults; crops.txt and PLAN.txt record the pattern.
 *
 * SAME SHAPES.  A filamentous particle lying on a diagonal, its coat
 * drawn as two rows of spheres, a darker cap of spheres at the far
 * end, a dark cluster and a splay of pIII petals at the near end, the
 * phagemid drawn as a long flattened loop inside the body with two
 * lens-shaped genes on it, an antibody of two capsules hanging off a
 * petal by a square linker, and five leader lines.  That is the
 * source's picture, part for part.
 *
 * THE ONE THING THE COLOUR ADDS, and the reason this figure is worth
 * redrawing rather than just sharpening.  Phage display is ONE idea:
 * the gene you select is carried inside the particle that displays the
 * protein you selected it by.  The source cannot show it -- its
 * antibody is blue, its antibody gene is a pale lens, and nothing ties
 * them together.  Here the antibody gene and the antibody protein are
 * both VERMILLION, and gene III and the pIII petals are both AMBER.
 * The fusion is then readable off the picture: amber gene plus
 * vermillion gene, amber tail protein carrying a vermillion antibody.
 * Genotype on the inside, phenotype on the outside, in two colours.
 *
 * The coat itself is a warm tan, which is the source's own colour and
 * carries no meaning -- it is the bag, not the argument.
 *
 * THE ONE ADDITION.  The source has a grey arrow pointing up at the
 * petals with no label on it at all.  An unlabelled leader is a riddle,
 * so it is labelled "Displayed antibody" here.  Nothing else on the
 * slide is new.
 *
 * Authored at 1420x800 and scaled to the cell.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", AMBER = "#a99011", MUTED = "#767676";
const TAN = "#c0905f", TAN_D = "#8d663d", CAP = "#6f6f6f", CAP_D = "#4c4c4c";
const n2 = v => Math.round(v * 10) / 10;

/* the particle is drawn in its own horizontal frame and then laid on a
   diagonal; the labels are NOT rotated, so every leader endpoint comes
   back through P() into page coordinates */
const TH = -20 * Math.PI / 180, OX = 430, OY = 516;
/* each petal is [length, angle offset from straight-back]; DISPLAY is
   the one that carries the fusion, and it is the upper-left one so the
   antibody hangs clear of the particle rather than across it */
const PETAL = [[188,-54],[178,-14],[182,26],[170,58]], DISPLAY = 3;
const CO = Math.cos(TH), SI = Math.sin(TH);
function P(lx, ly){ return [OX + lx*CO - ly*SI, OY + lx*SI + ly*CO]; }

function bead(cx, cy, r, fill, rim){
  return '<circle cx="' + n2(cx) + '" cy="' + n2(cy) + '" r="' + n2(r) +
           '" fill="' + fill + '" stroke="' + rim + '" stroke-width="2"/>' +
         '<circle cx="' + n2(cx - r*0.30) + '" cy="' + n2(cy - r*0.32) + '" r="' +
           n2(r*0.21) + '" fill="#ffffff" opacity="0.55"/>';
}

/* ---- the particle, in local coordinates --------------------------- */
const BODY0 = 0, BODY1 = 880, HW = 52, BR = 29, STEP = 45;

function particle(){
  let s = "";

  /* the phagemid: a long flattened loop of single-stranded DNA, with
     the two genes drawn as lenses on it, exactly as the source does */
  const g0 = 128, g1 = 760;
  s += '<path d="M ' + g0 + ' 0 C ' + (g0+40) + ' -21 ' + (g1-40) + ' -21 ' + g1 + ' 0 ' +
       'C ' + (g1-40) + ' 21 ' + (g0+40) + ' 21 ' + g0 + ' 0 Z" fill="#9fa8b0" ' +
       'stroke="#5d666e" stroke-width="3"/>';
  /* antibody gene, on the upper strand */
  s += '<ellipse cx="600" cy="-19" rx="96" ry="11" fill="' + VERM +
       '" stroke="' + INK + '" stroke-width="2.5" transform="rotate(-2 600 -19)"/>';
  /* gene III, on the lower strand, nearer the tail it builds */
  s += '<ellipse cx="268" cy="17" rx="72" ry="11" fill="' + AMBER +
       '" stroke="' + INK + '" stroke-width="2.5" transform="rotate(3 268 17)"/>';

  /* the coat: two rows of pVIII, drawn after the DNA so they overlap it
     the way a coat does */
  for (let x = BODY0 + 26; x <= BODY1 - 26; x += STEP){
    s += bead(x, -HW, BR, TAN, TAN_D);
    s += bead(x + STEP/2, HW, BR, TAN, TAN_D);
  }
  /* the far cap: pVII/pIX, darker and bunched */
  [[BODY1-6,-32],[BODY1+22,-2],[BODY1+4,34],[BODY1+36,-40],[BODY1+44,26]]
    .forEach(function(p){ s += bead(p[0], p[1], 27, CAP, CAP_D); });
  /* the near shoulder, where pIII sits */
  [[14,-28],[-14,6],[20,34]]
    .forEach(function(p){ s += bead(p[0], p[1], 26, CAP, CAP_D); });

  /* pIII: four petals splaying off the near end, amber because gene III
     is amber -- the protein and its gene are the same colour.  DISPLAY
     is the index of the one the antibody hangs from; the antibody is
     built from the same entry, so the two cannot drift apart. */
  PETAL.forEach(function(q){
    const L = q[0], a = (180 + q[1]) * Math.PI/180;
    const ex = Math.cos(a)*L, ey = Math.sin(a)*L;
    s += '<ellipse cx="' + n2(ex/2) + '" cy="' + n2(ey/2) + '" rx="' + n2(L/2) +
         '" ry="15" fill="' + AMBER + '" stroke="' + INK + '" stroke-width="2.5" ' +
         'transform="rotate(' + n2(180 + q[1]) + ' ' + n2(ex/2) + ' ' + n2(ey/2) +
         ')"/>';
  });

  return '<g transform="translate(' + OX + ',' + OY + ') rotate(-20)">' + s + '</g>';
}

/* ---- the displayed antibody, hanging off the top petal ------------- *
 * Drawn in PAGE space, not in the particle's frame: it dangles, and a
 * dangling thing that shares the particle's 20-degree tilt reads as
 * part of the rod rather than as cargo on it.
 * ------------------------------------------------------------------ */
function antibody(){
  /* The chain is petal tip -> linker -> scFv, all along ONE direction,
     computed from the petal it actually hangs on.  The first draft
     placed the capsules by eye and they floated off the end of the
     particle with the linker stranded behind them. */
  const q = PETAL[DISPLAY], L = q[0], a = (180 + q[1]) * Math.PI/180;
  const tip = P(Math.cos(a)*L, Math.sin(a)*L);
  const pa = a + TH;                       /* the same ray, on the page */
  const ux = Math.cos(pa), uy = Math.sin(pa);
  const lk = [tip[0] + ux*48, tip[1] + uy*48];
  const ab = [tip[0] + ux*132, tip[1] + uy*132];
  const deg = pa * 180 / Math.PI + 90;

  let s = '<line x1="' + n2(tip[0]) + '" y1="' + n2(tip[1]) + '" x2="' + n2(ab[0]) +
          '" y2="' + n2(ab[1]) + '" stroke="' + INK + '" stroke-width="6"/>';
  s += '<rect x="' + n2(lk[0]-18) + '" y="' + n2(lk[1]-18) + '" width="36" ' +
       'height="36" rx="5" fill="' + INK + '" opacity="0.85" transform="rotate(' +
       n2(deg) + ' ' + n2(lk[0]) + ' ' + n2(lk[1]) + ')"/>';
  /* two capsules: the scFv.  Vermillion, because the gene that encodes
     it is vermillion, inside the particle this is hanging off. */
  [-25, 25].forEach(function(off){
    const cx = ab[0] - uy*off, cy = ab[1] + ux*off;
    s += '<g transform="translate(' + n2(cx) + ',' + n2(cy) + ') rotate(' + n2(deg) + ')">' +
         '<rect x="-20" y="-58" width="40" height="116" rx="20" fill="' + VERM +
         '" stroke="' + INK + '" stroke-width="2.5"/>' +
         '<path d="M -20 -38 L 20 -38" stroke="' + INK + '" stroke-width="2" ' +
         'opacity="0.45"/></g>';
  });
  antibody.at = ab;
  return s;
}

function leader(x0, y0, x1, y1, colour){
  const dx = x1-x0, dy = y1-y0, L = Math.hypot(dx,dy) || 1;
  const ux = dx/L, uy = dy/L, bx = x1-ux*17, by = y1-uy*17;
  return '<line x1="' + n2(x0) + '" y1="' + n2(y0) + '" x2="' + n2(bx) + '" y2="' +
           n2(by) + '" stroke="' + colour + '" stroke-width="3"/>' +
         '<path d="M ' + n2(x1) + ' ' + n2(y1) + ' L ' + n2(bx - uy*9) + ' ' +
           n2(by + ux*9) + ' L ' + n2(bx + uy*9) + ' ' + n2(by - ux*9) + ' Z" fill="' +
           colour + '"/>';
}
function label(x, y, txt, anchor){
  return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor||"middle") +
         '" font-family="inherit" font-size="29" fill="' + INK + '">' + txt + '</text>';
}

function m13(){
  let s = particle() + antibody();  /* antibody() records where it landed */

  const ag = P(600, -19), pc = P(760, 52), pm = P(640, 22), g3 = P(268, 17);

  s += leader(ag[0], 118, ag[0], ag[1]-12, INK);
  s += label(ag[0], 92, "Antibody gene");

  s += leader(1276, pc[1]+6, pc[0]+24, pc[1], INK);
  s += label(1292, pc[1]+16, "Phage coat", "start");

  s += leader(pm[0]+40, 688, pm[0]+6, pm[1]+16, INK);
  s += label(pm[0]+52, 722, "Phagemid", "start");

  s += leader(g3[0]-16, 712, g3[0]-2, g3[1]+16, INK);
  s += label(g3[0]-28, 748, "Gene III", "end");

  const at = antibody.at;
  s += leader(at[0]-40, 700, at[0]-6, at[1]+74, MUTED);
  s += label(at[0]-48, 736, "Displayed antibody", "end");

  return '<svg viewBox="0 0 1420 800" xmlns="http://www.w3.org/2000/svg" ' +
    'role="img" aria-label="An M13 phagemid particle lying on a diagonal. Its ' +
    'coat is two rows of tan pVIII spheres with a darker cap of spheres at the ' +
    'far end. Inside runs the phagemid, a long flattened loop of single-stranded ' +
    'DNA carrying two genes drawn as lenses: the antibody gene in red and gene ' +
    'III in amber. At the near end a splay of amber pIII petals carries, by a ' +
    'short linker, an antibody of two red capsules. The antibody and its gene ' +
    'are the same red, and pIII and its gene the same amber, so the particle ' +
    'carries the gene for the protein it displays.">' + s + '</svg>';
}

function fill(){
  const el = document.querySelector('[data-fig="m13"]');
  if (el) el.innerHTML = m13();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
