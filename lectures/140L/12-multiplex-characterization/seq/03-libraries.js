/* ------------------------------------------------------------------ *
 * 03-libraries.js : sources 3-6, the four library diagrams.
 *
 * Fills  [data-lib="3"] .. [data-lib="6"]
 *
 * WHY THIS EXISTS.  The rough cut of 2026-11-10 cropped figures by
 * taking the union of every <p:pic> bounding box on a slide.  Sources
 * 3, 4, 5 and 6 contain NO PICTURE AT ALL -- their figures are drawn
 * in PowerPoint out of autoshapes and connectors (slide 5 alone has
 * 21 connectors).  The pass found nothing to crop, so these four came
 * through carrying a title and the one text box that in the source
 * sits BESIDE the drawing.  Source 6 came through as a title and a
 * speaker note, with nothing on screen at all.  JCA spotted it on
 * 2026-11-17.  Across all 43 sources exactly six slides are
 * picture-free with real drawings on them; the other two are 15 and
 * 16, rebuilt on 2026-11-16.  After this there are none left.
 *
 * DRAWN AGAINST A RENDER, NOT AGAINST THE XML.  The first attempt at
 * this file was reconstructed from the shape tree alone and came out
 * wrong in ways the XML does not show: it used white arrows where the
 * source fills them solid, invented a parts palette down the left of
 * source 6 that duplicated the constructs beside it, invented labels
 * and footer lines that are nowhere in the source, and missed that
 * the fourth construct on source 6 is FLIPPED.  JCA rejected it.  The
 * pptx is now converted with soffice and rasterised with pdftoppm,
 * and what follows is drawn against those four images.  Do the same
 * before changing anything here.
 *
 * THE SOURCE'S GRAMMAR, which is the same on all four and is the
 * whole point of the sequence: a parent gene arrow at top left, a
 * thin diagonal arrow meaning "diversify", the caption, and a stack
 * of four variants.  What changes slide to slide is what is drawn ON
 * the variants, and the change IS the lesson:
 *
 *   3  error-prone   red ticks, random positions, a random NUMBER
 *                    (2, 1, 3 and 1, reading down)
 *   4  alanine scan  exactly ONE tick each, marching left to right
 *   5  saturation    the SAME five positions every time, the COLOR
 *                    at each position changing gene to gene
 *   6  expression    the gene is not marked at all; the promoter and
 *                    RBS in front of it vary instead, and the fourth
 *                    construct is flipped onto the other strand
 *
 * EVERY TICK POSITION IS THE SOURCE'S.  They were read connector by
 * connector out of slide[3-5].xml and normalized against the arrow
 * each one sits on -- the groups use their own child coordinate
 * space, so a tick's absolute x means nothing until it is divided by
 * its own parent's.  Source 5's five sit at 0.118, 0.235, 0.353,
 * 0.412 and 0.647 along the shaft; the middle two are 0.059 apart and
 * are opened up slightly here, and only there, because at this size
 * they merge.
 *
 * THREE CHANGES, RECORDED BECAUSE THEY ARE CHANGES TO JCA'S SLIDES.
 *
 * 1. THE COLORS ARE THE HOUSE PALETTE, USED AS AN ATTENTION LADDER.
 *    palette.css is explicit that a color encodes how much attention
 *    something deserves and that a color must NOT be assigned to a
 *    class of object.  So: the gene arrow is context and is drawn in
 *    --rule with an ink outline, and the thing the slide is actually
 *    about is promoted to blue.  On 3 and 4 that is the mutation
 *    marks, which are therefore BLUE and not the source's red --
 *    nothing else on those slides is competing for blue, so there is
 *    no reason to reach past it.
 *
 * 2. SOURCE 5'S FIVE TICK COLORS ARE KEPT AS FIVE, ALL OF THEM
 *    PALETTE VALUES.  Read off slide5.xml and checked connector by
 *    connector on 2026-11-17, the source's mapping is
 *        tx1 -> ink, accent6 -> blue, FF0000 -> vermillion,
 *        FFC000 -> amber, accent4 -> muted
 *    and every row here reproduces its row exactly.  The fifth is
 *    --muted, a palette NEUTRAL rather than a fifth rung of the
 *    ladder; no hue and no tint is invented.  Dropping to four would
 *    have meant merging two of JCA's categories, which is a change to
 *    what the slide claims, so it was left for him.  Here color IS
 *    categorical, which the ladder does not
 *    cover, so it does not carry the claim alone: the dashed plumb
 *    lines are the second channel, and they are what actually says
 *    "the same site every time".  Which residue sits at a site is not
 *    something the student has to decode; that it DIFFERS down the
 *    column is, and position carries that.
 *
 * 3. SOURCE 6'S TWO PART VARIANTS ARE BLUE AND VERMILLION.  The source
 *    uses theme blue and theme yellow.  This went through two wrong
 *    answers before the right one, and both are worth recording.
 *
 *    First attempt: a hue per part TYPE (promoter blue, RBS green, ORF
 *    brown) with a pale tint for the second variant of each.  That is
 *    an identity map twice over and invented four tints.  Rejected.
 *
 *    Second attempt: everything blue, with the variant carried by FILL
 *    -- solid versus open.  Palette-clean and greyscale-safe in theory,
 *    and it failed in practice.  An open shape had to be drawn as a
 *    white core stroked over a colored one, and the gene's open
 *    variant needed an inset outline on top of that, so every open
 *    shape carried two or three stacked edges.  JCA on 2026-11-17:
 *    "the lines are screwy here", and he was right -- it read as a
 *    drawing error, not as a distinction.
 *
 *    So: blue and vermillion, one solid shape each, no overlays.  This
 *    IS a color standing for a class of object, which this file's own
 *    contract forbids, and it is a deliberate exception JCA asked for.
 *    What makes it defensible rather than sloppy: the two variants are
 *    the entire content of this slide, nothing else on it competes for
 *    either rung, and blue-then-vermillion is the ladder's own order.
 *    The alternative was tested and was less legible, which is the
 *    thing the guide is ultimately for.
 *
 * The 4:3 source stacks everything down the middle; this deck is
 * 16:9, so the parent, the diagonal and the caption sit in a left
 * column and the stack fills the right.  Nothing else is moved.
 * ------------------------------------------------------------------ */
(function(){

const INK = "#111111", VERM = "#ba3a13", BLUE = "#004373",
      AMBER = "#a99011", MUTED = "#767676";
const RULE = "#e2e2e2";          /* palette neutral: context fill */

const MW = 1480, MH = 640;

/* ---- the grammar, shared by 3, 4 and 5 ------------------------------ */
const PX = 90,  PY = 86,  PW = 300, PH = 104;     /* the parent gene     */
const VX = 620, VW = 560, VH = 92;                /* the variants        */
const ROWY = [214, 322, 430, 538];
const CAPX = 90, CAPY = 406;

function esc(s){
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

/* A PowerPoint rightArrow.  The source's is chunky: the head is about
   a third of the length and stands well proud of the shaft. */
function arrowPts(x, y, w, h){
  const sh = h * 0.58, top = y + (h - sh) / 2, hl = Math.min(w * 0.17, h * 1.05);
  return [
    [x, top], [x + w - hl, top], [x + w - hl, y], [x + w, y + h / 2],
    [x + w - hl, y + h], [x + w - hl, top + sh], [x, top + sh]
  ].map(q => q[0].toFixed(1) + "," + q[1].toFixed(1)).join(" ");
}
function arrow(x, y, w, h, fill, stroke){
  return '<polygon points="' + arrowPts(x, y, w, h) + '" fill="' + fill +
         '" stroke="' + stroke + '" stroke-width="2" stroke-linejoin="round"/>';
}

/* A mutation mark.  The source confines these to the shaft exactly --
   they do not stand proud of it, and they are thin. */
function tick(x, y, h, color){
  const sh = h * 0.58, top = y + (h - sh) / 2;
  return '<line x1="' + x.toFixed(1) + '" y1="' + top.toFixed(1) +
         '" x2="' + x.toFixed(1) + '" y2="' + (top + sh).toFixed(1) +
         '" stroke="' + color + '" stroke-width="4"/>';
}

/* Position along the shaft, as a fraction read out of the source. */
function at(f){ return VX + f * VW; }

function text(x, y, s, size, color, opt){
  opt = opt || {};
  return '<text x="' + x + '" y="' + y + '" font-family="inherit" font-size="' +
         size + '"' + (opt.anchor ? ' text-anchor="' + opt.anchor + '"' : "") +
         ' fill="' + color + '">' + s + '</text>';
}

/* The thin diagonal.  The source's is a hairline in the theme blue
   with a small open head, not a heavy gray shaft. */
function diagonal(x1, y1, x2, y2){
  const a = Math.atan2(y2 - y1, x2 - x1), hl = 22, hw = 7;
  const bx = x2 - hl * Math.cos(a), by = y2 - hl * Math.sin(a);
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + bx.toFixed(1) +
         '" y2="' + by.toFixed(1) + '" stroke="' + BLUE + '" stroke-width="2"/>' +
         '<path d="M ' + x2 + ' ' + y2 +
         ' L ' + (bx - hw * Math.sin(a)).toFixed(1) + ' ' + (by + hw * Math.cos(a)).toFixed(1) +
         ' L ' + (bx + hw * Math.sin(a)).toFixed(1) + ' ' + (by - hw * Math.cos(a)).toFixed(1) +
         ' Z" fill="' + BLUE + '"/>';
}

function caption(lines){
  let s = "";
  lines.forEach(function(ln, i){
    s += text(CAPX, CAPY + i * 34, esc(ln), 26, INK);
  });
  return s;
}

/* ---- sources 3, 4 and 5 --------------------------------------------- */
function ticked(spec){
  let s = arrow(PX, PY, PW, PH, RULE, INK);
  s += diagonal(PX + 150, PY + PH + 36, PX + 320, PY + PH + 150);
  s += caption(spec.caption);
  spec.rows.forEach(function(row, i){
    const y = ROWY[i];
    s += arrow(VX, y, VW, VH, RULE, INK);
    row.forEach(function(m){ s += tick(at(m[0]), y, VH, m[1]); });
  });
  if (spec.plumb) s += spec.plumb();
  return s;
}

/* slide3.xml, normalized per group: 2, 1, 3 and 1 ticks reading down */
const SRC3 = {
  caption: ["Random point mutations"],
  rows: [
    [[0.118, BLUE], [0.235, BLUE]],
    [[0.412, BLUE]],
    [[0.088, BLUE], [0.441, BLUE], [0.676, BLUE]],
    [[0.176, BLUE]]
  ]
};

/* slide4.xml: one tick each, at 0.118, 0.235, 0.353, 0.471 */
const SRC4 = {
  caption: ["Mutate each site of the gene to",
            "alanine (or other AAs), one",
            "mutant per gene"],
  rows: [[[0.118, BLUE]], [[0.235, BLUE]], [[0.353, BLUE]], [[0.471, BLUE]]]
};

/* slide5.xml.  Five fixed sites; the color at each varies by row.
   Source order per row is tx1 / accent6 / accent4 / FFC000 / FF0000,
   folded onto the four palette colors -- see note (1). */
const P5 = [0.118, 0.235, 0.353, 0.436, 0.647];
const SRC5 = {
  caption: ["Multiple specific sites, a specific",
            "set of mutations at each site, in",
            "combinations"],
  rows: [
    [[P5[0], INK],   [P5[1], BLUE],  [P5[2], BLUE],  [P5[3], MUTED], [P5[4], INK]],
    [[P5[0], AMBER], [P5[1], BLUE],  [P5[2], INK],   [P5[3], VERM],  [P5[4], MUTED]],
    [[P5[0], VERM],  [P5[1], BLUE],  [P5[2], BLUE],  [P5[3], MUTED], [P5[4], AMBER]],
    [[P5[0], VERM],  [P5[1], MUTED], [P5[2], BLUE],  [P5[3], BLUE],  [P5[4], INK]]
  ],
  plumb: function(){
    let s = "";
    P5.forEach(function(f){
      s += '<line x1="' + at(f).toFixed(1) + '" y1="' + (ROWY[0] - 18) +
           '" x2="' + at(f).toFixed(1) + '" y2="' + (ROWY[3] + VH + 18) +
           '" stroke="' + MUTED + '" stroke-width="1.5" stroke-dasharray="4 6"/>';
    });
    return s;
  }
};

/* ---- source 6 -------------------------------------------------------- *
 * Two constructs at left, four at right, and the fourth is FLIPPED --
 * the same construct read off the other strand.  Nothing is labelled
 * and nothing is named in the source; the drawing carries it all.
 *
 * The source's own proportions are not kept here and could not be:
 * its gene arrow is 75 units tall on a 216.7-unit backbone, so at the
 * width four rows need on this canvas the arrow comes out 180 tall
 * and the rows collide.  Heights are therefore fixed and only the
 * backbone length scales.  The arrangement -- promoter before the
 * backbone, RBS a third along, gene overrunning the backbone's end --
 * is the source's.
 * ---------------------------------------------------------------------- */
const GENE_H = 76, PROM_H = 52;

/* The two part variants, as two palette hues.  See note (3) in the header
   for why this is hue and not fill. */
const VAR = [BLUE, VERM];

function construct(x, base, w, pv, rv, gv, flip){
  let s = "";
  s += '<line x1="' + x + '" y1="' + base + '" x2="' + (x + w) +
       '" y2="' + base + '" stroke="' + INK + '" stroke-width="2.5"/>';
  /* the promoter: a bent arrow up and to the right.  ONE stroke, one head,
     no overlay -- the previous open variant drew a white core on top of
     this and the two edges read as a drawing error. */
  const px = x + 8, ph = PROM_H, pc = VAR[pv];
  s += '<path d="M ' + px + ' ' + base + ' L ' + px + ' ' + (base - ph) +
       ' L ' + (px + 26) + ' ' + (base - ph) + '" fill="none" stroke="' + pc +
       '" stroke-width="7"/>';
  s += '<path d="M ' + (px + 58) + ' ' + (base - ph) +
       ' L ' + (px + 26) + ' ' + (base - ph - 15) +
       ' L ' + (px + 26) + ' ' + (base - ph + 15) + ' Z" fill="' + pc + '"/>';
  s += '<circle cx="' + (x + 150) + '" cy="' + base + '" r="15" fill="' +
       VAR[rv] + '"/>';
  s += arrow(x + 190, base - GENE_H / 2, w - 150, GENE_H, VAR[gv], INK);
  if (flip){
    const cx = x + w / 2;
    s = '<g transform="translate(' + (2 * cx) + ',0) scale(-1,1)">' + s + '</g>';
  }
  return s;
}

function expression(){
  let s = "";
  /* the two parents: each one variant throughout */
  s += construct(110, 128, 300, 0, 0, 0, false);
  s += construct(110, 244, 300, 1, 1, 1, false);
  s += diagonal(470, 310, 598, 398);
  /* four of the combinations; the last is on the other strand */
  const G = [[0, 1, 0, false],
             [0, 1, 1, false],
             [1, 0, 0, false],
             [0, 1, 1, true]];
  const BASE = [248, 360, 472, 584];
  G.forEach(function(g, i){
    s += construct(680, BASE[i], 450, g[0], g[1], g[2], g[3]);
  });
  return s;
}

/* ---- assembly -------------------------------------------------------- */
const SLIDES = {
  "3": function(){ return ticked(SRC3); },
  "4": function(){ return ticked(SRC4); },
  "5": function(){ return ticked(SRC5); },
  "6": expression
};

function fill(){
  Object.keys(SLIDES).forEach(function(k){
    const el = document.querySelector('[data-lib="' + k + '"]');
    if (!el) return;
    el.innerHTML =
      '<svg viewBox="0 0 ' + MW + ' ' + MH + '" xmlns="http://www.w3.org/2000/svg" ' +
      'role="img">' + SLIDES[k]() + '</svg>';
  });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
