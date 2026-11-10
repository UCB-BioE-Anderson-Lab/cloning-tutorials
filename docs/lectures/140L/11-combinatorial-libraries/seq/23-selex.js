/* ------------------------------------------------------------------ *
 * 23-selex.js : source 23, the SELEX cycle, redrawn.
 *
 * Fills  [data-fig="selex"]
 *
 * WHY REDRAWN.  ppt/media/image30.png is 367x328 and the deck shows it
 * about 1380px wide -- nearly four times up.  Every label in it is a
 * blocky stair-step and the squiggles have coloured fringes.  Nothing
 * downstream can undo an upscale, so it is rebuilt.  JCA's
 * instruction, 2026-11-10: same shapes, proper colours.
 *
 * SAME SHAPES.  Squiggles for library members, straight capsules for
 * the ones that bind, grey column walls with beads on stalks between
 * them, fat arrows round a loop, and the five labels in the source's
 * own words and positions.  Nothing has been tidied into a nicer
 * diagram -- it is the same picture.
 *
 * THE COLOURS ARE THE ARGUMENT, which is why they are not decorative.
 * The source has black squiggles, two blue ones and a salmon rod, and
 * the salmon rod is the only thing whose fate the figure is actually
 * about: it is what sticks to the target, what elutes, and what comes
 * back amplified.  So the binder is VERMILLION, the deck's one
 * attention colour, and it is the only vermillion on the slide.  The
 * losers are ink and blue, the column is muted grey, and the beads are
 * ink.  Follow the red and you have followed the method.
 *
 * Count them and the story closes: eight members go on, ONE red rod
 * among them; the flowthrough keeps every blue and black one and no
 * red; the eluate is mostly red; the next-cycle pool is redder than
 * the first.  That is enrichment, drawn rather than asserted, and the
 * source's own counts do the same thing.
 *
 * The drawing is authored at 1420x812 and scaled to its cell: wide
 * rather than square, because the slide's content box is 1380x744
 * and a square drawing in it is height-limited and comes out small.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", BLUE = "#004373",
      SKY = "#4a7fae", MUTED = "#767676";
const n2 = v => Math.round(v * 10) / 10;

/* ---- a library member --------------------------------------------- *
 * The squiggle is one cubic with its two control points thrown to
 * opposite sides, which is exactly the shape the source draws: a short
 * kinked worm, never a smooth arc.
 * ------------------------------------------------------------------ */
function squiggle(x, y, len, rot, colour, rand){
  const a = rot * Math.PI / 180;
  const dx = Math.cos(a), dy = Math.sin(a);
  const px = -dy, py = dx;              /* perpendicular              */
  const k = len * (0.52 + rand() * 0.30);
  const s1 = (rand() < 0.5 ? -1 : 1) * k;
  const x1 = x + dx*len, y1 = y + dy*len;
  const c1x = x + dx*len*0.30 + px*s1,  c1y = y + dy*len*0.30 + py*s1;
  const c2x = x + dx*len*0.70 - px*s1,  c2y = y + dy*len*0.70 - py*s1;
  return '<path d="M ' + n2(x) + ' ' + n2(y) + ' C ' + n2(c1x) + ' ' + n2(c1y) +
         ' ' + n2(c2x) + ' ' + n2(c2y) + ' ' + n2(x1) + ' ' + n2(y1) +
         '" fill="none" stroke="' + colour + '" stroke-width="13" ' +
         'stroke-linecap="round"/>';
}
/* the binder: straight, because in the source it IS straight -- that
   is how you can pick it out of the pool at a glance */
function rod(x, y, len, rot, colour){
  const a = rot * Math.PI / 180;
  return '<line x1="' + n2(x) + '" y1="' + n2(y) + '" x2="' +
         n2(x + Math.cos(a)*len) + '" y2="' + n2(y + Math.sin(a)*len) +
         '" stroke="' + colour + '" stroke-width="15" stroke-linecap="round"/>';
}

/* A scatter of members in a box.  spec is a list of [colour, straight]
   so each pool's composition is written out rather than randomised --
   the counts are the point. */
function pool(cx, cy, w, h, spec, seed){
  const rand = window.LotteryBall ? window.LotteryBall.rng(seed)
                                  : (function(){ let s=seed; return function(){
                                      s=(s*1664525+1013904223)>>>0; return s/4294967296; }; })();
  let s = "";
  const n = spec.length, cols = Math.ceil(Math.sqrt(n * w / h));
  const rows = Math.ceil(n / cols);
  spec.forEach(function(it, i){
    const r = Math.floor(i / cols), c = i % cols;
    const x = cx - w/2 + (c + 0.5) * (w / cols) + (rand() - 0.5) * (w/cols) * 0.42;
    const y = cy - h/2 + (r + 0.5) * (h / rows) + (rand() - 0.5) * (h/rows) * 0.42;
    const rot = -60 + rand() * 120;
    s += it[1] ? rod(x, y, 44, rot, it[0])
               : squiggle(x, y, 46, rot, it[0], rand);
  });
  return s;
}

function arrow(x0, y0, x1, y1, w, colour){
  const dx = x1-x0, dy = y1-y0, L = Math.hypot(dx,dy);
  const ux = dx/L, uy = dy/L, hl = w*2.6, hw = w*1.85;
  const bx = x1 - ux*hl, by = y1 - uy*hl;
  const px = -uy, py = ux;
  return '<line x1="' + n2(x0) + '" y1="' + n2(y0) + '" x2="' + n2(bx) +
           '" y2="' + n2(by) + '" stroke="' + colour + '" stroke-width="' + w +
           '" stroke-linecap="butt"/>' +
         '<path d="M ' + n2(x1) + ' ' + n2(y1) +
           ' L ' + n2(bx + px*hw) + ' ' + n2(by + py*hw) +
           ' L ' + n2(bx - px*hw) + ' ' + n2(by - py*hw) + ' Z" fill="' +
           colour + '"/>';
}

function label(x, y, txt, anchor, size){
  return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor||"middle") +
         '" font-family="inherit" font-size="' + (size||27) + '" fill="' + INK +
         '">' + txt + '</text>';
}

/* ---- the column ---------------------------------------------------- *
 * Two walls and four beads on stalks, exactly the source's cartoon of
 * an affinity resin.  The beads are ink because they are the target,
 * and the target is not the thing being followed.
 * ------------------------------------------------------------------ */
function column(){
  const L = 200, R = 560, T = 296, B = 572, WW = 44;
  let s = '<rect x="' + L + '" y="' + T + '" width="' + WW + '" height="' +
          (B-T) + '" rx="3" fill="' + MUTED + '"/>' +
          '<rect x="' + (R-WW) + '" y="' + T + '" width="' + WW + '" height="' +
          (B-T) + '" rx="3" fill="' + MUTED + '"/>';
  /* two beads per wall, staggered.  The wall has to be tall enough that
     no two beads come within a diameter of each other -- the first
     attempt packed four into 214px and two of them merged into a blob. */
  const beads = [[L+WW, T+52, 1], [R-WW, T+96, -1],
                 [L+WW, B-52, 1], [R-WW, B-96, -1]];
  beads.forEach(function(b){
    const x0 = b[0], y = b[1], d = b[2];
    s += '<line x1="' + x0 + '" y1="' + y + '" x2="' + (x0 + d*64) + '" y2="' + y +
         '" stroke="' + MUTED + '" stroke-width="9"/>' +
         '<circle cx="' + (x0 + d*64) + '" cy="' + y + '" r="27" fill="' + INK + '"/>';
  });
  return s;
}

function selex(){
  let s = "";
  /* the starting library: eight members, ONE of them a binder */
  s += label(340, 66, "Random DNA pool");
  s += pool(340, 150, 440, 112, [
    [INK,0],[BLUE,0],[INK,0],[INK,0],
    [VERM,1],[SKY,0],[INK,0],[INK,0]], 101);

  s += arrow(340, 216, 340, 284, 11, INK);
  s += column();
  /* the label sits UNDER the column, clear of both outgoing arrows.
     In the source it lies across the beads, which was legible there
     only because the beads were smaller than the type. */
  s += label(380, 622, "Target protein");

  s += arrow(246, 584, 176, 656, 11, INK);
  s += arrow(514, 584, 584, 656, 11, INK);

  /* flowthrough: every loser, and no red */
  s += pool(168, 714, 290, 96, [
    [SKY,0],[INK,0],[BLUE,0],[INK,0],[INK,0],[SKY,0]], 202);
  s += label(168, 786, "Flowthrough");

  /* eluate: the red ones, and the non-specific black ones the note is
     careful to say are always carried through too */
  s += pool(580, 714, 226, 96, [
    [VERM,1],[INK,0],[VERM,1],[INK,0]], 303);
  s += label(592, 786, "Elution of bound DNAs");

  s += arrow(760, 716, 866, 650, 11, INK);
  s += label(982, 726, "PCR amplification");
  s += arrow(1124, 672, 1124, 570, 11, INK);

  /* next cycle: redder than the pool it came from */
  s += pool(1124, 452, 300, 124, [
    [VERM,1],[INK,0],[INK,0],[VERM,1],[INK,0],[INK,0]], 404);
  s += label(1124, 252, "DNA pool for next");
  s += label(1124, 288, "cycle selection");
  s += arrow(1000, 348, 614, 206, 11, INK);

  return '<svg viewBox="0 0 1420 812" xmlns="http://www.w3.org/2000/svg" ' +
    'role="img" aria-label="The SELEX cycle. A random DNA pool of eight ' +
    'squiggles, one of them a straight red rod, passes down on to a column ' +
    'whose two grey walls carry four black target-protein beads on stalks. ' +
    'Two arrows leave the column: the flowthrough keeps every black and blue ' +
    'squiggle and no red rod, while the elution of bound DNAs is mostly red ' +
    'rods. PCR amplification carries the eluate up to the DNA pool for the ' +
    'next cycle of selection, which is redder than the pool it started from, ' +
    'and an arrow returns it to the top.">' + s + '</svg>';
}

function fill(){
  const el = document.querySelector('[data-fig="selex"]');
  if (el) el.innerHTML = selex();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
