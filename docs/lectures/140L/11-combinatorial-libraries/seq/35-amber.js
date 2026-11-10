/* ------------------------------------------------------------------ *
 * 35-amber.js : source 35, the amber suppression example, redrawn.
 *
 * Fills  [data-fig="amber"]
 *
 * WHY REDRAWN.  ppt/media is a small scan of a line drawing shown
 * about 1200px wide; the type is stair-stepped and the rules are
 * fringed.  Eighth redraw in this deck, same fault as the rest.
 *
 * SAME SHAPES.  The reporter plasmid on the left with its CAT arc and
 * a UAG flag on a pennant, the suppressor tRNA on the right as a
 * cloverleaf with CUA on a pennant under the anticodon loop, two
 * curved arrows converging on "Transfection", and "Assay for CAT
 * activity" underneath.  The source's arrangement, part for part.
 *
 * THE TWO PENNANTS ARE THE SAME RED, and that is the whole figure.
 * UAG in the message and CUA in the anticodon are the matched pair:
 * the codon that stops translation dead and the anticodon that reads
 * it anyway.  The source draws both in black outline, so the reader
 * has to be told they go together.  Drawn in one colour, and the only
 * colour on the slide, it is the first thing you see.  CAT is blue
 * because it is the marker, not the mechanism.
 *
 * Authored at 1340x780.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", BLUE = "#004373", MUTED = "#767676";
const n2 = v => Math.round(v * 10) / 10;
const R2 = Math.PI / 180;

/* ---- the reporter plasmid ----------------------------------------- */
const CX = 330, CY = 310, CR = 184;

function onC(deg, r){
  return [CX + Math.cos(deg*R2)*(r == null ? CR : r),
          CY + Math.sin(deg*R2)*(r == null ? CR : r)];
}
/* a flag on a pennant, the source's way of pointing at a codon */
function pennant(deg, bx, by, txt){
  const tip = onC(deg, CR);
  const w = 104, h = 46;
  return '<path d="M ' + n2(tip[0]) + ' ' + n2(tip[1]) + ' L ' + n2(bx) + ' ' +
           n2(by + h) + ' L ' + n2(bx + w) + ' ' + n2(by + h) + ' Z" fill="none" ' +
           'stroke="' + VERM + '" stroke-width="2.5"/>' +
         '<rect x="' + n2(bx) + '" y="' + n2(by) + '" width="' + w + '" height="' +
           h + '" rx="4" fill="#ffffff" stroke="' + VERM + '" stroke-width="3"/>' +
         '<text x="' + n2(bx + w/2) + '" y="' + n2(by + h/2 + 1) +
           '" text-anchor="middle" dominant-baseline="central" ' +
           'font-family="ui-monospace,SFMono-Regular,Menlo,monospace" ' +
           'font-size="28" font-weight="700" fill="' + VERM + '">' + txt + '</text>';
}

function plasmid(){
  let s = '<circle cx="' + CX + '" cy="' + CY + '" r="' + CR + '" fill="none" ' +
          'stroke="' + INK + '" stroke-width="4"/>';
  /* CAT, an arc down the right-hand side */
  const a0 = -72, a1 = 58;
  const p0 = onC(a0), p1 = onC(a1);
  s += '<path d="M ' + n2(p0[0]) + ' ' + n2(p0[1]) + ' A ' + CR + ' ' + CR +
       ' 0 0 1 ' + n2(p1[0]) + ' ' + n2(p1[1]) + '" fill="none" stroke="' + BLUE +
       '" stroke-width="20"/>';
  const lab = onC(-14, CR + 44);
  s += '<text x="' + n2(lab[0]) + '" y="' + n2(lab[1]) + '" font-family="inherit" ' +
       'font-size="30" fill="' + BLUE + '">CAT</text>';
  s += pennant(-76, 404, 38, "UAG");
  s += '<text x="' + CX + '" y="' + (CY + 10) + '" text-anchor="middle" ' +
       'font-family="inherit" font-size="31" fill="' + INK +
       '">pRSV CAT<tspan font-style="italic">am</tspan>27</text>';
  return s;
}

/* ---- the suppressor tRNA ------------------------------------------ *
 * The cloverleaf as the source draws it: a stroked cross with ring
 * loops on the three arms, the acceptor stem doubled at the top, and
 * the little variable-arm bump on the lower right.
 * ------------------------------------------------------------------ */
const TX = 1010, TY = 288;

function trna(){
  const W = 26, LW = 9;                 /* strand gap, and stroke       */
  const D2 = Math.PI / 180;

  /* ---- one arm: a base-paired stem that opens into a loop ---------- *
   * The first draft drew every arm as ONE thick line with a separate
   * ring stuck on the end, which is why JCA called it wonky: a stem is
   * two strands, and a loop is those same two strands continuing round.
   * So an arm is a single open path -- out along one strand, round the
   * loop, back along the other -- and the loop is where the strands
   * separate, which is what a loop actually is.
   *
   * The strands run tangent to the loop circle, so they meet it at
   * sqrt(r^2 - (W/2)^2) back from its centre.  That is the whole trick;
   * get it wrong and the stem either floats off the loop or cuts a
   * chord across it.
   * ------------------------------------------------------------------ */
  function arm(deg, stem, r){
    const a = deg * D2, ux = Math.cos(a), uy = Math.sin(a);
    const px = -uy, py = ux, h = W/2;
    const d = Math.sqrt(Math.max(1, r*r - h*h));
    const cx = ux * (stem + d), cy = uy * (stem + d);
    const ax = cx - ux*d + px*h, ay = cy - uy*d + py*h;
    const bx = cx - ux*d - px*h, by = cy - uy*d - py*h;
    return '<path d="M ' + n2(px*h) + ' ' + n2(py*h) +
           ' L ' + n2(ax) + ' ' + n2(ay) +
           ' A ' + r + ' ' + r + ' 0 1 0 ' + n2(bx) + ' ' + n2(by) +
           ' L ' + n2(-px*h) + ' ' + n2(-py*h) + '" fill="none" stroke="' +
           INK + '" stroke-width="' + LW + '" stroke-linejoin="round" ' +
           'stroke-linecap="round"/>';
  }

  /* the acceptor stem does NOT end in a loop -- it ends in the single
     stranded CCA that gets charged, so it is drawn open */
  function acceptor(len){
    const h = W/2;
    return '<path d="M ' + (-h) + ' 0 L ' + (-h) + ' ' + (-len) +
           '" fill="none" stroke="' + INK + '" stroke-width="' + LW +
           '" stroke-linecap="round"/>' +
           '<path d="M ' + h + ' 0 L ' + h + ' ' + (-len) +
           ' l 0 ' + (-28) + '" fill="none" stroke="' + INK + '" stroke-width="' +
           LW + '" stroke-linecap="round"/>';
  }

  let g = '<g transform="translate(' + TX + ',' + TY + ')">';
  g += acceptor(150);
  g += arm(180, 96, 44);                /* D arm,  left  */
  g += arm(0,   96, 44);                /* T arm,  right */
  g += arm(90, 132, 48);                /* anticodon, down */
  /* the variable loop: a short stub off the anticodon stem, which is
     where it sits on a real tRNA */
  g += '<g transform="translate(' + n2(W/2) + ',72)">' + arm(16, 24, 19) + '</g>';
  g += '</g>';

  /* CUA, on the same pennant the plasmid's UAG uses */
  const tip = [TX, TY + 236];
  const bx = TX - 52, by = TY + 282, w = 104, h = 46;
  g += '<path d="M ' + n2(tip[0]) + ' ' + n2(tip[1]) + ' L ' + n2(bx) + ' ' +
       n2(by) + ' L ' + n2(bx + w) + ' ' + n2(by) + ' Z" fill="none" stroke="' +
       VERM + '" stroke-width="2.5"/>';
  g += '<rect x="' + n2(bx) + '" y="' + n2(by) + '" width="' + w + '" height="' +
       h + '" rx="4" fill="#ffffff" stroke="' + VERM + '" stroke-width="3"/>';
  g += '<text x="' + n2(bx + w/2) + '" y="' + n2(by + h/2 + 1) + '" ' +
       'text-anchor="middle" dominant-baseline="central" ' +
       'font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="28" ' +
       'font-weight="700" fill="' + VERM + '">CUA</text>';
  g += '<text x="' + TX + '" y="' + (TY - 212) + '" text-anchor="middle" ' +
       'font-family="inherit" font-size="30" fill="' + INK +
       '">suppressor tRNA</text>';
  return g;
}

function curve(x0, y0, cx, cy, x1, y1){
  const t = 0.9, mt = 1 - t;
  const px = mt*mt*x0 + 2*mt*t*cx + t*t*x1;
  const py = mt*mt*y0 + 2*mt*t*cy + t*t*y1;
  const ux = x1-px, uy = y1-py, L = Math.hypot(ux,uy) || 1;
  const nx = -uy/L, ny = ux/L;
  return '<path d="M ' + n2(x0) + ' ' + n2(y0) + ' Q ' + n2(cx) + ' ' + n2(cy) +
           ' ' + n2(px) + ' ' + n2(py) + '" fill="none" stroke="' + INK +
           '" stroke-width="4"/>' +
         '<path d="M ' + n2(x1) + ' ' + n2(y1) + ' L ' + n2(px + nx*10) + ' ' +
           n2(py + ny*10) + ' L ' + n2(px - nx*10) + ' ' + n2(py - ny*10) +
           ' Z" fill="' + INK + '"/>';
}

function amber(){
  let s = plasmid() + trna();
  const MX = 668;
  s += curve(400, 486, 540, 594, MX - 10, 620);
  s += curve(930, 486, 800, 594, MX + 10, 620);
  s += '<text x="' + MX + '" y="672" text-anchor="middle" font-family="inherit" ' +
       'font-size="31" font-weight="700" fill="' + INK + '">Transfection</text>';
  s += '<line x1="' + MX + '" y1="692" x2="' + MX + '" y2="716" stroke="' + INK +
       '" stroke-width="4"/>' +
       '<path d="M ' + MX + ' 730 L ' + (MX-9) + ' 714 L ' + (MX+9) + ' 714 Z" ' +
       'fill="' + INK + '"/>';
  s += '<text x="' + MX + '" y="768" text-anchor="middle" font-family="inherit" ' +
       'font-size="31" font-weight="700" fill="' + INK +
       '">Assay for CAT activity</text>';
  return '<svg viewBox="0 0 1340 800" xmlns="http://www.w3.org/2000/svg" ' +
    'role="img" aria-label="Amber suppression as a selection. On the left, the ' +
    'reporter plasmid pRSV CATam27, whose CAT gene is drawn as a blue arc with ' +
    'a red flag reading UAG pointing at it. On the right, a suppressor tRNA ' +
    'drawn as a cloverleaf, with a matching red flag reading CUA under its ' +
    'anticodon loop. Curved arrows from both converge on Transfection, and ' +
    'below that, Assay for CAT activity. The two red flags are the pair: the ' +
    'codon that stops translation and the anticodon that reads it anyway.">' +
    s + '</svg>';
}

function fill(){
  const el = document.querySelector('[data-fig="amber"]');
  if (el) el.innerHTML = amber();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
