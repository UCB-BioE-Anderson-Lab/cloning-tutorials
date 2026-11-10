/* ------------------------------------------------------------------ *
 * 07-titer.js : source 7, measuring library size.
 *
 * Registers:  titer
 *
 * WHY THE SLIDE CHANGED.  The source was five bullets and nothing
 * else.  The last two of them -- plate dilutions, back-calculate, call
 * it titering -- describe an arithmetic that students get wrong every
 * year, and a bullet saying "back-calculating the diversity" does not
 * show anyone where the factors come from.  JCA asked on 2026-11-10
 * for three tightened bullets and the calculation drawn out: a litre
 * flask, a log dilution series, three plates, and the sum.
 *
 * THE NUMBERS ARE ONE CONSISTENT CASE, not three illustrative ones.
 * Work them in either direction and they close:
 *
 *     flask            1.6e6 cfu/mL  x  1000 mL  =  1.6e9
 *     10^-3, 100 uL    1.6e6 x 1e-3 x 0.1  =  160 colonies
 *     10^-4, 100 uL                         =  16, counted as 15
 *     10^-5, 100 uL                         =  1.6, counted as 2
 *
 * The 15 and the 2 are deliberately NOT 16 and 1.6.  Real counts miss
 * their expectation, and a slide whose three plates agree to the digit
 * teaches that counting is exact, which is the opposite of the lesson.
 * They are also the reason the countable-range caption is on the
 * slide: 160 is the only plate in it, and the arithmetic uses that
 * plate alone.
 *
 * WHY 30-300.  It is the convention this course already uses at the
 * bench, and it has two halves: under about 30 the Poisson error on
 * the count is worse than 18 percent, and over about 300 colonies
 * merge and the count runs low.  Stated on the slide in one muted
 * line, because it is the justification for a choice the arithmetic
 * makes silently.
 *
 * COLOUR.  Ink for the glassware and the plates, vermillion for the
 * one plate the calculation uses and for the result, muted for the
 * two plates it discards and for the caption.  That is the attention
 * ladder doing its job: the slide's whole point is WHICH plate you
 * count, so that plate is the only coloured thing in the row.
 *
 * The authoring box is 1600x900, content x 110-1490, y 86-830.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", MUTED = "#767676", RULE = "#e2e2e2";
const n2 = v => Math.round(v * 10) / 10;

/* ---- the case ------------------------------------------------------ */
const PLATES = [
  { exp: 3, count: 160, use: true  },
  { exp: 4, count: 15,  use: false },
  { exp: 5, count: 2,   use: false }
];
const TUBES = [1, 2, 3, 4, 5];

/* ---- geometry ------------------------------------------------------ *
 * THE LAYOUT, SECOND TIME.  The first one put the three plates under
 * the last three tubes on the RIGHT and the arithmetic in a column
 * beside them, and the two collided: the plates ran under the sum, the
 * "100 uL" tags landed on top of it, and the three count labels
 * overlapped each other because the tubes were closer together than
 * the words were wide.
 *
 * The fix is to use the space the slide actually has.  The flask sits
 * top-left, the tube row runs the full width beside it, the plates
 * hang under the last three tubes, and the arithmetic goes in the big
 * empty quarter UNDER the flask -- which the first layout left blank
 * while crowding everything else.  Tube spacing is now 148, wider than
 * any label that sits under it.
 * -------------------------------------------------------------------- */
const FLX = 244, FLY = 418;              /* flask centre               */
const TUBE0 = 440, TUBEW = 148, TUBEY = 376;
const PLATEY = 664, PLATER = 66;
const MATHX = 128, MATHY = 616;          /* the sum, under the flask   */

function sci(m, e){
  return m + ' × 10<tspan baseline-shift="super" ' +
         'font-size="0.62em">' + e + '</tspan>';
}

/* ---- the flask ----------------------------------------------------- *
 * An Erlenmeyer, because that is what an outgrowth actually sits in.
 * Drawn as neck, shoulders and base in one path, with the broth as a
 * second path clipped to the same silhouette by construction rather
 * than by a clip-path -- fewer ids, and it prints.
 * ------------------------------------------------------------------ */
function flask(){
  const nw = 17, nh = 56, bw = 86, bh = 92, lip = 5;
  const topY = FLY - nh - bh / 2, botY = FLY + bh / 2;
  const body = 'M ' + (FLX - nw - lip) + ' ' + topY +
    ' L ' + (FLX + nw + lip) + ' ' + topY +
    ' L ' + (FLX + nw) + ' ' + (topY + 12) +
    ' L ' + (FLX + nw) + ' ' + (topY + nh) +
    ' L ' + (FLX + bw) + ' ' + botY +
    ' Q ' + (FLX + bw) + ' ' + (botY + 13) + ' ' + (FLX + bw - 14) + ' ' + (botY + 13) +
    ' L ' + (FLX - bw + 14) + ' ' + (botY + 13) +
    ' Q ' + (FLX - bw) + ' ' + (botY + 13) + ' ' + (FLX - bw) + ' ' + botY +
    ' L ' + (FLX - nw) + ' ' + (topY + nh) +
    ' L ' + (FLX - nw) + ' ' + (topY + 12) + ' Z';
  /* broth: the lower trapezoid of the same cone */
  const fy = botY - 52;
  const hw = nw + (bw - nw) * ((fy - topY - nh) / (botY - topY - nh));
  const broth = 'M ' + n2(FLX - hw) + ' ' + n2(fy) +
    ' L ' + n2(FLX + hw) + ' ' + n2(fy) +
    ' L ' + (FLX + bw) + ' ' + botY +
    ' Q ' + (FLX + bw) + ' ' + (botY + 13) + ' ' + (FLX + bw - 14) + ' ' + (botY + 13) +
    ' L ' + (FLX - bw + 14) + ' ' + (botY + 13) +
    ' Q ' + (FLX - bw) + ' ' + (botY + 13) + ' ' + (FLX - bw) + ' ' + botY + ' Z';
  return '<path d="' + broth + '" fill="#d8e2ea"/>' +
         '<path d="' + body + '" fill="none" stroke="' + INK +
           '" stroke-width="3.5" stroke-linejoin="round"/>' +
         '<text x="' + FLX + '" y="' + (botY + 50) + '" text-anchor="middle" ' +
           'font-family="inherit" font-size="27" fill="' + INK +
           '">library, 1 L</text>' +
         '<text x="' + FLX + '" y="' + (botY + 82) + '" text-anchor="middle" ' +
           'font-family="inherit" font-size="24" fill="' + MUTED +
           '">titre unknown</text>';
}

/* ---- a dilution tube ----------------------------------------------- */
function tube(i){
  const x = TUBE0 + TUBEW * i, w = 27, h = 86, y = TUBEY;
  const fill = y + h - 46;
  return '<path d="M ' + (x-w) + ' ' + y + ' L ' + (x-w) + ' ' + (y+h-w) +
           ' A ' + w + ' ' + w + ' 0 0 0 ' + (x+w) + ' ' + (y+h-w) +
           ' L ' + (x+w) + ' ' + y + '" fill="none" stroke="' + INK +
           '" stroke-width="3"/>' +
         '<path d="M ' + (x-w) + ' ' + fill + ' L ' + (x-w) + ' ' + (y+h-w) +
           ' A ' + w + ' ' + w + ' 0 0 0 ' + (x+w) + ' ' + (y+h-w) +
           ' L ' + (x+w) + ' ' + fill + ' Z" fill="#d8e2ea"/>' +
         '<text x="' + x + '" y="' + (y - 16) + '" text-anchor="middle" ' +
           'font-family="inherit" font-size="26" fill="' + INK + '">10' +
           '<tspan baseline-shift="super" font-size="0.62em">−' +
           TUBES[i] + '</tspan></text>';
}

function arrow(x0, y0, x1, y1, colour){
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
  const ux = dx / L, uy = dy / L, hx = x1 - ux * 11, hy = y1 - uy * 11;
  return '<line x1="' + n2(x0) + '" y1="' + n2(y0) + '" x2="' + n2(hx) +
           '" y2="' + n2(hy) + '" stroke="' + colour + '" stroke-width="2.5"/>' +
         '<path d="M ' + n2(x1) + ' ' + n2(y1) +
           ' L ' + n2(hx - uy*6) + ' ' + n2(hy + ux*6) +
           ' L ' + n2(hx + uy*6) + ' ' + n2(hy - ux*6) + ' Z" fill="' + colour + '"/>';
}

/* ---- a plate -------------------------------------------------------- *
 * Colonies are placed by the seeded generator with a minimum spacing,
 * so 160 reads as a crowded lawn-in-waiting and 2 reads as two.  The
 * dot radius shrinks as the count rises, which is what a real plate
 * looks like and keeps 160 from becoming a solid disc.
 * ------------------------------------------------------------------ */
function plate(k){
  const p = PLATES[k];
  const cx = TUBE0 + TUBEW * (2 + k), cy = PLATEY;
  const col = p.use ? VERM : MUTED;
  const rand = window.LotteryBall.rng(9000 + k * 31);
  let dots = "", placed = [];
  const dr = p.count > 100 ? 3.1 : p.count > 10 ? 4.4 : 5.6;
  let guard = 0;
  while (placed.length < p.count && guard++ < p.count * 60){
    const a = rand() * Math.PI * 2;
    const rr = Math.sqrt(rand()) * (PLATER - 11);
    const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
    if (placed.some(q => Math.hypot(q[0]-x, q[1]-y) < dr * 2.25)) continue;
    placed.push([x, y]);
    dots += '<circle cx="' + n2(x) + '" cy="' + n2(y) + '" r="' + dr +
            '" fill="' + col + '"/>';
  }
  return '<circle cx="' + cx + '" cy="' + cy + '" r="' + PLATER +
           '" fill="#fbfbfb" stroke="' + (p.use ? VERM : INK) +
           '" stroke-width="' + (p.use ? 4 : 2.5) + '"/>' + dots +
         '<text x="' + cx + '" y="' + (cy + PLATER + 34) + '" text-anchor="middle" ' +
           'font-family="inherit" font-size="24" font-weight="' +
           (p.use ? "700" : "400") + '" fill="' + col + '">' + p.count +
           ' colonies</text>';
}

/* ---- the sum -------------------------------------------------------- *
 * Five lines, left-aligned under the flask.  The exponents are real
 * tspans, not hyphens in a string -- the first version printed
 * "10-3 dilution" in running text next to a properly set 10^-3 on the
 * tube, which reads as two different numbers.
 * -------------------------------------------------------------------- */
function sup(base, e){
  return base + '<tspan baseline-shift="super" font-size="0.62em">' + e + '</tspan>';
}
function sum(){
  const L = 42;
  let y = MATHY, s = "";
  function line(txt, colour, size, weight){
    s += '<text x="' + MATHX + '" y="' + y + '" font-family="inherit" ' +
         'font-size="' + (size || 27) + '" font-weight="' + (weight || 400) +
         '" fill="' + (colour || INK) + '">' + txt + '</text>';
    y += L;
  }
  line("Count the plate in range:", MUTED, 24);
  line("160 colonies, from 100 \u00b5L of the " + sup("10", "\u22123") +
       " dilution", INK, 26);
  line("160 \u00f7 0.1 mL = " + sci("1.6", "3") + " /mL", INK, 26);
  line("\u00d7 " + sup("10", "3") + " dilution = " + sci("1.6", "6") + " /mL",
       INK, 26);
  y += 6;
  line("\u00d7 1000 mL = " + sci("1.6", "9") + " transformants", VERM, 31, 700);
  return s;
}

/* ---- the whole drawing --------------------------------------------- */
function build(){
  let s = "";
  /* the series */
  s += arrow(FLX + 104, TUBEY + 44, TUBE0 - 38, TUBEY + 44, INK);
  TUBES.forEach(function(_, i){
    s += tube(i);
    if (i < TUBES.length - 1){
      s += arrow(TUBE0 + TUBEW*i + 34, TUBEY + 44,
                 TUBE0 + TUBEW*(i+1) - 34, TUBEY + 44, INK);
    }
  });
  /* under the FIRST gap, not the middle: the middle is where the plate
     arrows drop, and the caption was landing on them */
  s += '<text x="' + n2(TUBE0 + TUBEW * 0.5) + '" y="' + (TUBEY + 126) +
       '" text-anchor="middle" font-family="inherit" font-size="24" fill="' +
       MUTED + '">each step 1:10</text>';
  s += flask();

  /* down to the plates */
  PLATES.forEach(function(p, k){
    const x = TUBE0 + TUBEW * (2 + k);
    s += arrow(x, TUBEY + 162, x, PLATEY - PLATER - 14, p.use ? VERM : MUTED);
    s += '<text x="' + (x + 11) + '" y="' + (TUBEY + 196) +
         '" font-family="inherit" font-size="21" fill="' + MUTED +
         '">100 \u00b5L</text>';
  });
  PLATES.forEach(function(_, k){ s += plate(k); });
  return s;
}

/* ---- the three beats ------------------------------------------------ *
 * note: is the SOURCE's, verbatim, split at its own paragraph breaks:
 * the first three paragraphs are the bullets, the fourth is the
 * dilution series, the fifth is the name of the thing.  The arithmetic
 * itself is new to the deck, so it is in add:, which is spoken but is
 * not part of what verify_notes.py concatenates.
 * -------------------------------------------------------------------- */
const titer = [
  {
    note:"When transforming plasmids into cells, it is generally assumed that by far the limiting step is transformation.  You can assume that there are a few orders of magnitude more DNAs in the reaction than actually get into a cell, so you only need to consider transformation.  This of course assumes that you are using cells in your experiment.  For all in-vitro experiments, you must use other strategies to determine the diversity which involve following how much DNA is present at every step of the experiment. You should assume that each colony is derived from a single unique member of the library. So, the diversity of a library is the number of colonies observed following transformation.  It is very common for multiple plasmids to enter a single cell under the concentrated conditions used in these fabrication schemes—you must use a lot of DNA to hit these high colony counts.  However, that extra diversity is difficult to measure and will depend on the quality and amount of your ligation product.  For large libraries, the existence of this cotransformation background can affect the outcome of selections, but it does not erode the confidence that your library is sufficiently inclusive.  Your diversity is minimally the number of transformants you observe—it might be a little higher in practice.",
    desc:"Three statements: transformation is the limiting step, one colony is one library member, so the diversity is the colony count." },
  {
    note:"Due to the large numbers involved, this is usually quantified by plating dilutions of the library on multiple plates and then back-calculating the diversity",
    desc:"The bench procedure appears. A one-litre flask of library feeds a row of five tubes, each a ten-fold dilution of the one before, down to ten to the minus five. From the last three tubes, 100 microlitres each goes on to a plate. The plates come back with 160, 15 and 2 colonies; the 160 plate is drawn in red, the other two in grey." },
  {
    note:"This is referred to as “titering the library”",
    add:"Only one of those three plates is worth counting. Thirty to three hundred is the range where the count means something: below thirty the Poisson error is worse than eighteen percent, and above three hundred the colonies merge and you count low. So fifteen and two get thrown away, and the whole calculation rests on the plate with a hundred and sixty. A hundred and sixty colonies came out of a tenth of a millilitre, so that tube holds sixteen hundred per millilitre. That tube is a thousand-fold dilution, so the flask holds one point six million per millilitre. And there is a litre of it, so the library is one point six billion transformants.",
    desc:"The arithmetic, worked down the right-hand side: 160 colonies from 100 microlitres is 1.6 thousand per millilitre, times the thousand-fold dilution is 1.6 million per millilitre, times a thousand millilitres is 1.6 billion transformants." }
];

window.Deck.sequence("titer", function(slide){
  const host = slide.querySelector("[data-titer]");
  if (!host) return { steps: titer.map(x => ({ note:x.note, desc:x.desc })),
                      go: function(){} };

  host.innerHTML = window.LotteryBall.svg("0 0 1600 900", build(), "titersvg");
  const svg = host.querySelector("svg");
  /* the sum is drawn into its own group so it can arrive on its own beat */
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("opacity", "0");
  g.innerHTML = sum();
  svg.appendChild(g);

  function go(i){
    host.style.opacity = i >= 1 ? "1" : "0";
    g.setAttribute("opacity", i >= 2 ? "1" : "0");
  }
  go(0);

  return {
    steps: titer.map(function(x){
      const spoken = x.note && x.add ? x.note + "  " + x.add : (x.note || x.add || "");
      return { note: spoken, desc: x.desc };
    }),
    go: go
  };
});

})();
