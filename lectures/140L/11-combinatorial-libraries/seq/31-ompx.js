/* ------------------------------------------------------------------ *
 * 31-ompx.js : source 31, the OmpX and CPX constructs, redrawn.
 *
 * Fills  [data-fig="ompx"]
 *
 * WHY REDRAWN.  ppt/media/image38.png is 1186x384 of scanned journal
 * figure, and at slide size its subscripts and residue labels are
 * mush -- S53 and S54 are the whole point of the figure and you
 * cannot read either of them.  Ninth redraw in this deck.
 *
 * SAME SHAPES as the source: a promoter arrow, a signal-sequence box,
 * two hatched domain boxes, a tick for each SfiI site, a black blob at
 * the C terminus, residue numbers on leaders underneath, and the
 * inserted peptide written out below on a fan of lines from the
 * insertion point.  Both rows, both sequences, every label.
 *
 * WHAT THE COLOUR ADDS, and it is the entire reason the figure is on
 * the slide.  CPX is a CIRCULAR PERMUTANT of OmpX: same residues, cut
 * in a different place, so the piece that was at the front is now at
 * the back.  The source distinguishes the two pieces only by the
 * DIRECTION of their hatching, which at this size nobody sees, so the
 * permutation -- the one fact the reader is supposed to take away --
 * is invisible.  Here A1-S53 is blue and S54-F148 is grey, in both
 * rows, and the swap reads at a glance: the blue block has moved from
 * the front of OmpX to the back of CPX, which is what drags Loop2 up
 * to the new N terminus where a displayed peptide is properly exposed.
 * The hatching is kept anyway, in the source's two directions.
 *
 * The randomised residues are vermillion in both sequences -- X2, X7
 * and X2 -- because that is the library, and the two cysteines that
 * clamp it into a loop are the only other thing set in bold.
 *
 * NO PATTERN FILLS.  SVG patterns need ids, ids are page-global, and
 * this deck puts several drawings on one page.  The hatch lines are
 * computed and clipped arithmetically instead: for a 45-degree line
 * y = c - x crossing a rectangle, the visible span is simply
 * x from max(x0, c-y1) to min(x1, c-y0).  No defs, no ids, no clip.
 *
 * Authored at 1400x580.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", BLUE = "#004373", MUTED = "#767676";
const N_FILL = "#dbe5ee", N_HATCH = "#004373";   /* A1-S53   */
const C_FILL = "#e8e8e8", C_HATCH = "#5f5f5f";   /* S54-F148 */
const n2 = v => Math.round(v * 10) / 10;

const H = 54;                      /* every box is this tall */

function rect(x0, y, w, fill){
  return '<rect x="' + n2(x0) + '" y="' + n2(y - H/2) + '" width="' + n2(w) +
         '" height="' + H + '" fill="' + fill + '" stroke="' + INK +
         '" stroke-width="2.5"/>';
}
/* vertical hatch, the source's fill for A1-S53 */
function hatchV(x0, y, w, colour){
  let s = "";
  for (let x = x0 + 7; x < x0 + w - 2; x += 9){
    s += '<line x1="' + n2(x) + '" y1="' + n2(y - H/2 + 3) + '" x2="' + n2(x) +
         '" y2="' + n2(y + H/2 - 3) + '" stroke="' + colour + '" stroke-width="2"/>';
  }
  return s;
}
/* 45-degree hatch, the source's fill for S54-F148, clipped by arithmetic */
function hatchD(x0, y, w, colour){
  const x1 = x0 + w, y0 = y - H/2, y1 = y + H/2;
  let s = "";
  for (let c = x0 + y0; c <= x1 + y1; c += 13){
    const xa = Math.max(x0 + 2, c - y1 + 2), xb = Math.min(x1 - 2, c - y0 - 2);
    if (xa >= xb) continue;
    s += '<line x1="' + n2(xa) + '" y1="' + n2(c - xa) + '" x2="' + n2(xb) +
         '" y2="' + n2(c - xb) + '" stroke="' + colour + '" stroke-width="2"/>';
  }
  return s;
}
function domainN(x0, y, w){ return rect(x0,y,w,N_FILL) + hatchV(x0,y,w,N_HATCH); }
function domainC(x0, y, w){ return rect(x0,y,w,C_FILL) + hatchD(x0,y,w,C_HATCH); }

/* the promoter, an open block arrow as the source draws it */
function promoter(x0, y, w){
  const h = H * 0.86, hh = h/2, head = 46;
  return '<path d="M ' + x0 + ' ' + n2(y - hh*0.52) +
         ' L ' + n2(x0 + w - head) + ' ' + n2(y - hh*0.52) +
         ' L ' + n2(x0 + w - head) + ' ' + n2(y - hh) +
         ' L ' + n2(x0 + w) + ' ' + n2(y) +
         ' L ' + n2(x0 + w - head) + ' ' + n2(y + hh) +
         ' L ' + n2(x0 + w - head) + ' ' + n2(y + hh*0.52) +
         ' L ' + x0 + ' ' + n2(y + hh*0.52) + ' Z" fill="#ffffff" stroke="' +
         INK + '" stroke-width="2.5" stroke-linejoin="round"/>';
}
function ss(x0, y, w){
  return rect(x0, y, w, "#ffffff") +
    '<text x="' + n2(x0 + w/2) + '" y="' + n2(y + 1) + '" text-anchor="middle" ' +
    'dominant-baseline="central" font-family="inherit" font-style="italic" ' +
    'font-weight="700" font-size="25" fill="' + INK + '">s.s.</text>';
}
/* the C-terminal blob, and the SfiI tick marks */
function blob(x, y){
  return '<path d="M ' + n2(x) + ' ' + n2(y - 26) + ' A 26 26 0 1 1 ' + n2(x) +
         ' ' + n2(y + 26) + ' Z" fill="' + INK + '"/>' +
         '<rect x="' + n2(x - 6) + '" y="' + n2(y - 26) + '" width="8" height="52" ' +
         'fill="' + INK + '"/>';
}
function tick(x, y){
  return '<rect x="' + n2(x - 4) + '" y="' + n2(y - H/2 - 12) + '" width="8" ' +
         'height="' + (H + 24) + '" fill="' + INK + '"/>';
}
function sfii(x, y, sub, dy){
  return '<text x="' + n2(x) + '" y="' + n2(y) + '" text-anchor="middle" ' +
         'font-family="inherit" font-size="26" fill="' + INK +
         '"><tspan font-style="italic">Sfi</tspan>I<tspan baseline-shift="sub" ' +
         'font-size="0.62em" font-style="italic">' + sub + '</tspan></text>';
}
/* a residue number on a short leader down from the map */
function res(x, y, txt, anchor, dx){
  return '<line x1="' + n2(x) + '" y1="' + n2(y + H/2) + '" x2="' + n2(x) +
           '" y2="' + n2(y + H/2 + 26) + '" stroke="' + INK + '" stroke-width="2"/>' +
         '<text x="' + n2(x + (dx||0)) + '" y="' + n2(y + H/2 + 54) +
           '" text-anchor="' + (anchor||"middle") + '" font-family="inherit" ' +
           'font-size="26" fill="' + INK + '">' + txt + '</text>';
}
function lab(x, y, txt, size, anchor, colour){
  return '<text x="' + n2(x) + '" y="' + n2(y) + '" text-anchor="' + (anchor||"middle") +
         '" font-family="inherit" font-size="' + (size||26) + '" fill="' +
         (colour||INK) + '">' + txt + '</text>';
}

/* the inserted peptide, piece by piece, with the randomised runs in red */
function peptide(cx, y, tail){
  const parts = [["GQSGQ", INK, 0], ["X", VERM, 2], ["C", INK, 0],
                 ["X", VERM, 7], ["C", INK, 0], ["X", VERM, 2], [tail, INK, 0]];
  const CW = 19.2, SW = 11.6;         /* a letter, and a subscript digit */
  let w = 0;
  parts.forEach(p => { w += p[0].length * CW + (p[2] ? SW : 0); });
  let x = cx - w/2, s = "";
  parts.forEach(function(p){
    s += '<text x="' + n2(x) + '" y="' + n2(y) + '" font-family="' +
         'ui-monospace,SFMono-Regular,Menlo,monospace" font-size="27" ' +
         'font-weight="' + (p[1] === VERM || p[0] === "C" ? 700 : 400) +
         '" fill="' + p[1] + '">' + p[0] +
         (p[2] ? '<tspan baseline-shift="sub" font-size="0.64em">' + p[2] +
                 '</tspan>' : '') + '</text>';
    x += p[0].length * CW + (p[2] ? SW : 0);
  });
  return { svg: s, x0: cx - w/2, x1: cx + w/2 };
}
/* the fan of lines from the insertion point down to the sequence */
function fan(jx, jy, p, y){
  return '<line x1="' + n2(jx) + '" y1="' + n2(jy) + '" x2="' + n2(p.x0) +
           '" y2="' + n2(y - 30) + '" stroke="' + INK + '" stroke-width="1.8"/>' +
         '<line x1="' + n2(jx) + '" y1="' + n2(jy) + '" x2="' + n2(p.x1) +
           '" y2="' + n2(y - 30) + '" stroke="' + INK + '" stroke-width="1.8"/>';
}

function ompx(){
  let s = "";

  /* ---------------- OmpX: s.s. | A1-S53 | Loop2 | S54-F148 ---------- */
  const yA = 136;
  s += lab(28, yA + 10, "OmpX", 34, "start");
  s += promoter(176, yA, 148);
  s += ss(338, yA, 104);
  s += domainN(452, yA, 252);
  s += tick(712, yA);
  s += domainC(722, yA, 440);
  s += blob(1168, yA);
  s += sfii(712, yA - H/2 - 26, "a");
  s += lab(800, yA - H/2 - 26, "Loop2");
  s += sfii(1196, yA + H/2 + 54, "b");
  s += res(460, yA, "A1");
  s += res(694, yA, "S53", "end", -6);
  s += res(734, yA, "S54", "start", 6);
  s += res(1150, yA, "F148", "end", 10);
  const pA = peptide(730, yA + 182, "GGS");
  s += fan(716, yA + H/2 + 6, pA, yA + 182);
  s += pA.svg;

  /* ---------------- CPX: s.s. | Loop2 | S54-F148 | A1-S53 ----------- */
  const yB = 400;
  s += lab(28, yB + 10, "CPX", 34, "start");
  s += promoter(176, yB, 148);
  s += ss(338, yB, 104);
  s += tick(458, yB);
  s += domainC(468, yB, 440);
  s += tick(918, yB);
  s += domainN(928, yB, 234);
  s += blob(1168, yB);
  s += sfii(458, yB - H/2 - 26, "a");
  s += lab(548, yB - H/2 - 26, "Loop2");
  s += lab(918, yB - H/2 - 26, "GGSG");
  s += sfii(1196, yB + H/2 + 54, "b");
  s += res(480, yB, "S54");
  s += res(898, yB, "F148", "end", -6);
  s += res(940, yB, "A1", "start", 6);
  s += res(1150, yB, "S53", "end", 10);
  const pB = peptide(520, yB + 182, "GGQSGQ");
  s += fan(462, yB + H/2 + 6, pB, yB + 182);
  s += pB.svg;

  return '<svg viewBox="0 0 1400 620" xmlns="http://www.w3.org/2000/svg" ' +
    'role="img" aria-label="Two display constructs drawn as linear maps. ' +
    'OmpX runs: promoter, signal sequence, a blue vertically hatched block ' +
    'from A1 to S53, an SfiI site, then a grey diagonally hatched block from ' +
    'S54 to F148 ending in a black cap at a second SfiI site. The peptide ' +
    'GQSGQ X2 C X7 C X2 GGS is inserted at Loop2, between S53 and S54, with ' +
    'the X runs in red. CPX is the circular permutant of the same protein: ' +
    'the grey S54 to F148 block now comes first, straight after the signal ' +
    'sequence, and the blue A1 to S53 block has moved to the far end behind ' +
    'a GGSG linker. So the blue block has swapped from front to back, which ' +
    'brings Loop2 to the new N terminus, and the peptide there reads GQSGQ ' +
    'X2 C X7 C X2 GGQSGQ.">' + s + '</svg>';
}

function fill(){
  const el = document.querySelector('[data-fig="ompx"]');
  if (el) el.innerHTML = ompx();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
