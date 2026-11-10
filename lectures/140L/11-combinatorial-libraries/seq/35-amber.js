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
  const W = 15;
  const L = function(x1,y1,x2,y2){
    return '<line x1="' + n2(TX+x1) + '" y1="' + n2(TY+y1) + '" x2="' + n2(TX+x2) +
           '" y2="' + n2(TY+y2) + '" stroke="' + INK + '" stroke-width="' + W +
           '" stroke-linecap="round"/>';
  };
  const ring = function(cx,cy,r){
    return '<circle cx="' + n2(TX+cx) + '" cy="' + n2(TY+cy) + '" r="' + r +
           '" fill="none" stroke="' + INK + '" stroke-width="' + W + '"/>';
  };
  let s = "";
  /* the acceptor stem, two strands, running off the top */
  s += L(0, -200, 0, -24);
  s += L(34, -200, 34, -104);
  /* the D and T arms */
  s += L(-134, -24, 134, -24);
  s += ring(-170, -24, 36);
  s += ring(170, -24, 36);
  /* the anticodon arm and its loop */
  s += L(0, -24, 0, 128);
  s += ring(0, 164, 36);
  /* the variable arm: ON the anticodon stem, where the source puts
     it -- floated out at x=62 it read as a stray dot */
  s += ring(40, 34, 18);
  /* CUA, on the same pennant the plasmid's UAG uses */
  const tip = [TX, TY + 200];
  const bx = TX - 52, by = TY + 254, w = 104, h = 46;
  s += '<path d="M ' + n2(tip[0]) + ' ' + n2(tip[1]) + ' L ' + n2(bx) + ' ' +
       n2(by) + ' L ' + n2(bx + w) + ' ' + n2(by) + ' Z" fill="none" stroke="' +
       VERM + '" stroke-width="2.5"/>';
  s += '<rect x="' + n2(bx) + '" y="' + n2(by) + '" width="' + w + '" height="' +
       h + '" rx="4" fill="#ffffff" stroke="' + VERM + '" stroke-width="3"/>';
  s += '<text x="' + n2(bx + w/2) + '" y="' + n2(by + h/2 + 1) + '" ' +
       'text-anchor="middle" dominant-baseline="central" ' +
       'font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="28" ' +
       'font-weight="700" fill="' + VERM + '">CUA</text>';
  s += '<text x="' + TX + '" y="' + (TY - 232) + '" text-anchor="middle" ' +
       'font-family="inherit" font-size="30" fill="' + INK +
       '">suppressor tRNA</text>';
  return s;
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
