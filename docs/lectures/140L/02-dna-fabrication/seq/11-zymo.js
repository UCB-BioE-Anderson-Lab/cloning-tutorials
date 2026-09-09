/* ------------------------------------------------------------------ *
 * 11-zymo.js : the two drawn slides of the Zymo Cleanup section.
 *
 * Registers:  zymo-chem    source slide 81, the silica chemistry (3 steps)
 *             zymo-column  source slide 82, the column run      (4 steps)
 *
 * WHY THESE TWO ARE REDRAWN AND THE OTHER FOUR ARE NOT.  79, 80 and 83
 * are a product photograph, a product photograph and a screenshot, and
 * stay rasters.  81 and 82 are line art: labelled atoms, a small
 * molecule, and a stack of tubes.  Both were also drawn for someone
 * else's palette -- 81 in olive and pale blue on a grey disc, 82 in pink
 * and green on a cream panel -- and neither hue set exists here.
 *
 * COLOUR, one assignment held across both slides:
 *     blue        DNA.  It is the thing being followed, on every frame.
 *     amber       the silica.  A fill and a stroke only, never text:
 *                 amber is 3.1:1 and the palette forbids small text in it.
 *     muted       everything that is not DNA and is on its way to the
 *                 waste -- the contaminants, the flow-through.
 *     ink         the apparatus and all labels.
 * Vermillion is not used.  Nothing on either slide is a warning or an
 * error, and spending the third rung on ordinary glassware would leave
 * nothing to promote to if a later pass needs it.
 *
 * Shape carries the same distinction as hue, so neither slide depends on
 * colour alone (1.4.1): DNA is a round dot, a contaminant is a slanted
 * rod, the silica is a solid band.  The legend on slide 82 names all
 * three in text.
 *
 * The 1600x900 authoring box has a content area of x 110-1490, y 86-830.
 * Every number below was placed against those bounds, not eyeballed.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK   = "#111111",
      BLUE  = "#004373",
      AMBER = "#a99011",
      MUTED = "#767676",
      RULE  = "#e2e2e2",
      GLASS = "#d9d9d9",      /* the plastic of a column, a neutral      */
      LIQ   = "#e8eff4";      /* buffer in a tube: a tint, not a colour  */

const SVGNS = "http://www.w3.org/2000/svg";
const n2 = v => Math.round(v * 10) / 10;

/* ---- small drawing helpers ---------------------------------------- */

function txt(x, y, size, fill, str, opts){
  const o = opts || {};
  return '<text x="' + n2(x) + '" y="' + n2(y) + '" font-size="' + size +
    '" fill="' + fill + '"' +
    ' text-anchor="' + (o.anchor || "middle") + '"' +
    (o.weight ? ' font-weight="' + o.weight + '"' : "") +
    (o.style  ? ' font-style="' + o.style + '"'  : "") +
    '>' + str + '</text>';
}

function line(x1, y1, x2, y2, col, w, dash){
  return '<path d="M' + n2(x1) + ' ' + n2(y1) + 'L' + n2(x2) + ' ' + n2(y2) +
    '" fill="none" stroke="' + col + '" stroke-width="' + w +
    '" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : "") + '/>';
}

/* A process arrow.  Full head, because nothing on these two slides is a
   3' end -- the half barb is reserved for that and must not appear here. */
function arrow(x1, y1, x2, y2, col, w){
  const th = Math.atan2(y1 - y2, x1 - x2), H = 20, W = 0.42;
  return '<path d="M' + n2(x1) + ' ' + n2(y1) + 'L' + n2(x2) + ' ' + n2(y2) +
    'M' + n2(x2 + H*Math.cos(th + W)) + ' ' + n2(y2 + H*Math.sin(th + W)) +
    'L' + n2(x2) + ' ' + n2(y2) +
    'L' + n2(x2 + H*Math.cos(th - W)) + ' ' + n2(y2 + H*Math.sin(th - W)) +
    '" fill="none" stroke="' + (col || INK) + '" stroke-width="' + (w || 3.4) +
    '" stroke-linecap="round" stroke-linejoin="round"/>';
}

/* A sampled sine, written as a polyline.  fill="none" is not optional:
   an open path that is filled closes itself and comes out as a wedge. */
function wave(x0, x1, y, amp, period, col, w){
  let d = "";
  for (let x = x0; x <= x1 + 0.01; x += 4){
    const yy = y + amp * Math.sin(2 * Math.PI * (x - x0) / period);
    d += (d ? "L" : "M") + n2(x) + " " + n2(yy);
  }
  return '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + w +
    '" stroke-linecap="round" stroke-linejoin="round"/>';
}

/* ------------------------------------------------------------------ *
 * SLIDE 81 -- Zymo Cleanup Chemistry
 *
 * The source packs three drawings onto this slide: a column with the
 * load and the product written round it, a magnified disc showing a
 * silica surface, and the guanidinium chloride structure.  The disc's
 * cone points at a SECOND tube on the right, which is the same tube as
 * the one on the left drawn twice.  Here there is one tube and the cone
 * comes off its silica pad, which is what the disc is actually a
 * magnification of.
 *
 * The disc itself is faithful to the source and is two stacked panels,
 * not a pore: above, a silanol surface with water hydrogen bonded to it;
 * below, the same surface bridged to DNA through sodium.  Sodium, not
 * guanidinium, because that is what the source figure labels -- the
 * guanidinium structure sits beside it as its own object, as it does in
 * the source.
 * ------------------------------------------------------------------ */

/* ---- the column, drawn once and reused at two scales --------------
   Local frame: x centred on 0, y 0 at the top of the column's cap.
   Overall 152 wide by 408 tall.                                       */
const COL_W = 76, COL_H = 408;

function columnShell(){
  return (
    /* collection tube: straight sides, semicircular bottom */
    '<path d="M-76 34V332A76 76 0 0 0 76 332V34" fill="#ffffff" stroke="' + INK +
      '" stroke-width="3.6" stroke-linejoin="round"/>' +
    /* the column insert */
    '<rect x="-52" y="34" width="104" height="218" fill="#ffffff" stroke="' + INK +
      '" stroke-width="3" />' +
    '<path d="M-52 252L-20 282V318H20V282L52 252" fill="#ffffff" stroke="' + INK +
      '" stroke-width="3" stroke-linejoin="round"/>' +
    '<rect x="-56" y="18" width="112" height="16" fill="' + GLASS + '" stroke="' + INK +
      '" stroke-width="3"/>' +
    '<rect x="-72" y="0" width="144" height="18" rx="4" fill="' + GLASS + '" stroke="' + INK +
      '" stroke-width="3"/>'
  );
}
function silicaPad(){
  return '<rect x="-52" y="222" width="104" height="28" fill="' + AMBER + '"/>';
}
/* buffer standing on the pad, from local y=top down to the pad */
function columnLiquid(top){
  return '<rect x="-49" y="' + top + '" width="98" height="' + (222 - top) +
    '" fill="' + LIQ + '"/>' +
    line(-49, top, 49, top, MUTED, 2);
}
/* the semicircular bottom of the collection tube, as a pool */
function tubePool(){
  return '<path d="M-76 332A76 76 0 0 0 76 332Z" fill="' + LIQ + '"/>';
}
function dot(x, y, r){
  return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 11) + '" fill="' + BLUE + '"/>';
}
function rod(x, y, ang){
  return '<g transform="translate(' + x + ' ' + y + ') rotate(' + ang + ')">' +
    '<rect x="-15" y="-5" width="30" height="10" rx="5" fill="' + MUTED + '"/></g>';
}

/* ---- the magnified disc ------------------------------------------- */
const CX = 800, CY = 500, R = 278;
const SI = [CX - 108, CX - 36, CX + 36, CX + 108];   /* four silanol columns */

function silanolTop(){
  let g = wave(620, 980, 404, 7, 90, AMBER, 4);
  SI.forEach(function(x){
    g += txt(x, 396, 26, INK, "Si");
    g += line(x, 372, x, 356, INK, 2.4);
    g += txt(x, 352, 26, INK, 'O<tspan dy="-11" font-size="19">&#8722;</tspan>');
    g += line(x, 330, x, 316, MUTED, 2.4, "3 5");
  });
  /* two waters, each bridging a pair of silanols */
  [[SI[0], SI[1]], [SI[2], SI[3]]].forEach(function(p){
    const wx = (p[0] + p[1]) / 2;
    g += txt(p[0], 312, 26, INK, "H") + txt(p[1], 312, 26, INK, "H");
    g += txt(wx, 288, 26, INK, "O");
    g += line(p[0] + 9, 303, wx - 11, 293, INK, 2.4);
    g += line(p[1] - 9, 303, wx + 11, 293, INK, 2.4);
    g += txt(p[0] - 22, 306, 17, MUTED, "&#948;+");
    g += txt(wx + 20, 274, 17, MUTED, "&#948;&#8722;");
  });
  return g;
}

function silanolBottom(){
  let g = wave(625, 975, 706, 7, 90, AMBER, 4);
  SI.forEach(function(x){
    g += txt(x, 698, 26, INK, "Si");
    g += line(x, 674, x, 658, INK, 2.4);
    g += txt(x, 654, 26, INK, 'O<tspan dy="-11" font-size="19">&#8722;</tspan>');
  });
  return g;
}

/* the duplex: two backbones a half period apart, rungs between them */
function duplex(x0, x1, ymid, amp, period){
  let g = "";
  let a = "", b = "";
  for (let x = x0; x <= x1 + 0.01; x += 4){
    const t = 2 * Math.PI * (x - x0) / period;
    a += (a ? "L" : "M") + n2(x) + " " + n2(ymid + amp * Math.sin(t));
    b += (b ? "L" : "M") + n2(x) + " " + n2(ymid - amp * Math.sin(t));
  }
  /* Rungs stop short of the crossings.  Drawn all the way in, they fill
     each crossing with a solid wedge and the figure reads as chain-link
     fencing rather than as a helix. */
  for (let x = x0 + 10; x <= x1 - 10; x += 18){
    const t = 2 * Math.PI * (x - x0) / period;
    const y1 = ymid + amp * Math.sin(t), y2 = ymid - amp * Math.sin(t);
    if (Math.abs(y1 - y2) < 16) continue;
    g += line(x, y1, x, y2, MUTED, 2.2);
  }
  return g +
    '<path d="' + a + '" fill="none" stroke="' + BLUE + '" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="' + b + '" fill="none" stroke="' + BLUE + '" stroke-width="5" stroke-linecap="round"/>';
}

function bridged(){
  let g = duplex(620, 980, 490, 30, 120);
  SI.forEach(function(x){
    g += line(x, 540, x, 558, MUTED, 2.4, "3 5");
    g += txt(x, 588, 26, INK, 'Na<tspan dy="-11" font-size="19">+</tspan>');
    g += line(x, 600, x, 618, MUTED, 2.4, "3 5");
  });
  return g;
}

/* ---- guanidinium chloride ------------------------------------------
   Skeletal, in the idiom of 01-dna-enzymes/seq/chem.js: the central
   carbon is an unlabelled vertex, the nitrogens are written out, and the
   C=N is a real double bond drawn as two parallel lines rather than
   suggested by a heavier stroke.  The formal charges are on the ion,
   because the whole reason molar guanidinium works is that it is a
   cation. */
const GC = [1280, 566];

function guanidinium(){
  return (
    /* C=N(+)H2, straight up */
    line(GC[0] - 6, GC[1], GC[0] - 6, 512, INK, 3.2) +
    line(GC[0] + 6, GC[1], GC[0] + 6, 512, INK, 3.2) +
    txt(1265.5, 502, 40, INK, 'NH<tspan dy="9" font-size="27">2</tspan>', {anchor:"start"}) +
    txt(1252, 458, 30, INK, "&#8853;") +
    /* the two neutral amines */
    line(GC[0], GC[1], 1226, 608, INK, 3.2) +
    line(GC[0], GC[1], 1334, 608, INK, 3.2) +
    txt(1222.5, 634, 40, INK, 'H<tspan dy="9" font-size="27">2</tspan><tspan dy="-9">N</tspan>', {anchor:"end"}) +
    txt(1337.5, 634, 40, INK, 'NH<tspan dy="9" font-size="27">2</tspan>', {anchor:"start"}) +
    /* the counter-ion */
    txt(1400, 540, 40, INK, "Cl", {anchor:"start"}) +
    txt(1458, 514, 26, INK, "&#8854;", {anchor:"start"}) +
    txt(1300, 742, 27, INK, "Guanidinium Chloride")
  );
}

/* ---- the whole of slide 81 ---------------------------------------- */
const CHEM =
'<g font-family="Helvetica Neue,Arial,Helvetica,sans-serif">' +

  /* the cone first, so the disc is painted over its far end and no arc
     has to be computed to trim it */
  '<path d="M278 423L800 235L800 765L278 440Z" fill="#f7f7f7" stroke="' + RULE +
    '" stroke-width="2.5" stroke-linejoin="round"/>' +
  '<circle cx="' + CX + '" cy="' + CY + '" r="' + R + '" fill="#ffffff" stroke="' + RULE +
    '" stroke-width="2.5"/>' +

  '<g data-r="load">' +
    txt(232, 206, 26, INK, "Up to 5 &#181;g DNA") +
    arrow(232, 224, 232, 274) +
    '<g transform="translate(232 286) scale(0.6)">' +
      columnShell() + silicaPad() +
    '</g>' +
  '</g>' +

  '<g data-r="surface">' + silanolTop() + silanolBottom() + '</g>' +
  '<g data-r="salt">' + guanidinium() + '</g>' +
  '<g data-r="bind" opacity="0">' + bridged() + '</g>' +

  '<g data-r="out" opacity="0">' +
    '<ellipse cx="232" cy="600" rx="60" ry="26" fill="none" stroke="' + INK +
      '" stroke-width="3.4"/>' +
    '<path d="M186 585L172 601L192 606" fill="none" stroke="' + INK +
      '" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M278 585L292 601L272 606" fill="none" stroke="' + INK +
      '" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    arrow(232, 556, 232, 700) +
    txt(310, 578, 26, INK, "Spin",  {anchor:"start"}) +
    txt(310, 610, 26, INK, "Wash",  {anchor:"start"}) +
    txt(310, 642, 26, INK, "Elute", {anchor:"start"}) +
    txt(232, 742, 27, INK, "Ultra-pure DNA", {weight:700, style:"italic"}) +
  '</g>' +

'</g>';

/* ------------------------------------------------------------------ *
 * SLIDE 82 -- DNA Purification Columns
 *
 * The source draws three states: Binding, Washing, Elution.  The speaker
 * notes walk FOUR, because between the last wash and the elution there
 * is a 90 second spin with nothing added, and a column that still has
 * ethanol in it will carry that ethanol into the eluate.  So the drying
 * spin gets its own panel.  Every other word on this slide, the legend
 * and the stage names and the Spin on each arrow, is the source's.
 *
 * Built one panel per click, because the argument is sequential: what
 * you are looking at each time is what changed since the last spin.
 * ------------------------------------------------------------------ */

const AX = [290, 630, 970, 1310];   /* the four panel centres */
const ATOP = 318;                   /* local y=0 of each assembly        */
const STAGE = ["Binding", "Washing", "Drying", "Elution"];

function panel(k){
  let inner = columnShell() + silicaPad();

  if (k === 0){
    /* the dirty mix, standing on the resin */
    inner += columnLiquid(112);
    inner += dot(-22, 148) + dot(16, 176) + dot(-4, 200);
    inner += rod(20, 130, -34) + rod(-26, 182, 22) + rod(6, 158, -12);
  }
  else if (k === 1){
    /* DNA on the resin, everything else through into the tube */
    inner += columnLiquid(104);
    inner += dot(-25, 208) + dot(0, 206) + dot(25, 209);
    inner += tubePool();
    inner += rod(-32, 368, -20) + rod(4, 380, 14) + rod(30, 360, -32);
  }
  else if (k === 2){
    /* waste discarded, nothing added, the column spun dry */
    inner += dot(-25, 208) + dot(0, 206) + dot(25, 209);
  }
  else {
    /* water on, DNA off the resin and into a fresh tube */
    inner += tubePool();
    inner += dot(-26, 372) + dot(0, 380) + dot(26, 372);
  }

  return '<g data-r="a' + k + '"' + (k ? ' opacity="0"' : "") + '>' +
    '<g transform="translate(' + AX[k] + ' ' + ATOP + ')">' + inner + '</g>' +
    txt(AX[k], 785, 28, INK, STAGE[k], {weight:700}) +
  '</g>';
}

function spin(k){
  return '<g data-r="s' + k + '" opacity="0">' +
    arrow(AX[k] + 92, 500, AX[k] + 248, 500) +
    txt(AX[k] + 170, 545, 26, INK, "Spin", {weight:700}) +
  '</g>';
}

/* The legend is the source's, in the source's words, laid out as one row
   rather than a stacked box: five short items across the top read faster
   than a column that competes with the four panels for the eye. */
const LEGEND =
  '<g data-r="key">' +
    '<rect x="130" y="204" width="48" height="20" fill="' + AMBER + '"/>' +
    txt(192, 222, 24, INK, "Silica Resin", {anchor:"start"}) +

    dot(410, 208, 9) + dot(432, 222, 9) +
    txt(452, 222, 24, INK, "DNA", {anchor:"start"}) +

    rod(674, 208, -28) + rod(696, 224, -28) +
    txt(716, 222, 24, INK, "Contaminants", {anchor:"start"}) +

    '<g transform="translate(984 196) scale(0.115)">' +
      '<rect x="-52" y="34" width="104" height="218" fill="#ffffff" stroke="' + INK +
        '" stroke-width="22"/>' +
      '<path d="M-52 252L-20 282V318H20V282L52 252" fill="#ffffff" stroke="' + INK +
        '" stroke-width="22" stroke-linejoin="round"/>' +
      '<rect x="-72" y="0" width="144" height="18" rx="4" fill="' + GLASS +
        '" stroke="' + INK + '" stroke-width="22"/>' +
    '</g>' +
    txt(1010, 222, 24, INK, "Column", {anchor:"start"}) +

    '<g transform="translate(1234 196) scale(0.115)">' +
      '<path d="M-76 34V332A76 76 0 0 0 76 332V34" fill="#ffffff" stroke="' + INK +
        '" stroke-width="22" stroke-linejoin="round"/>' +
    '</g>' +
    txt(1260, 222, 24, INK, "Collection Tube", {anchor:"start"}) +
  '</g>';

const COLUMN =
  '<g font-family="Helvetica Neue,Arial,Helvetica,sans-serif">' +
    LEGEND + panel(0) + spin(0) + panel(1) + spin(1) + panel(2) + spin(2) + panel(3) +
  '</g>';

/* ------------------------------------------------------------------ *
 * Wiring
 * ------------------------------------------------------------------ */

function build(slide, markup){
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");
  svg.innerHTML = markup;
  slide.appendChild(svg);
  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);
  return r;
}

/* ON maps a group to the step it arrives on; -1 means "from the first
   frame".  go() reads only from this map, so any step renders correctly
   from any other step and in any order, which is what the PDF export and
   the reduced-motion path both need. */
function painter(slide, markup, ON){
  const r = build(slide, markup);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  return function(i, animated){
    const soft = animated !== false && !reduce.matches;
    Object.keys(ON).forEach(function(k){
      const el = r[k];
      if (!el) return;
      el.style.transition = soft ? "opacity .34s ease" : "none";
      el.style.opacity = i >= ON[k] ? "1" : "0";
    });
  };
}

/* The narration is the source deck's own note for slide 81, split at its
   sentence boundaries into the three beats the drawing has.  Nothing is
   reworded and nothing is dropped, the protocol link included. */
const CHEM_STEPS = [
{ note:"Protocol: https://files.zymoresearch.com/protocols/_d4003t_d4003_d4004_d4013_d4014_dna_clean_concentrator_-5.pdf The dominant chemistry for purifying DNA involves complexation between DNA and silica with guanidinium chloride.",
  desc:"On the left, a spin column sitting in a collection tube, with an arrow into the top of it labelled up to 5 micrograms of DNA. A band across the bottom of the column is the silica resin, and a cone opens from that band out to a magnified disc filling the middle of the slide. Inside the disc are two silica surfaces drawn one above the other, each a wavy line carrying four Si groups, and each Si carrying an oxygen with a negative charge. On the upper surface, two water molecules are hydrogen bonded down onto those oxygens, with the partial charges marked. The lower surface is bare. To the right of the disc, the skeletal structure of guanidinium chloride: a central carbon double bonded up to a positively charged NH2 and single bonded down to two more NH2 groups, with a chloride ion beside it." },

{ note:"The sample, usually a PCR reaction or other enzymatic modification reaction, is mixed with a solution containing molar concentrations of guanidinium chloride, called ADP Buffer in the zymo kit. This is loaded into the column and then centrifuged. The DNA adheres to the surface of a silica pad while everything else flows through.",
  desc:"A DNA duplex appears in the lower half of the disc, drawn as two blue backbones with rungs between them, lying along the bare silica surface. Four sodium ions now stand in the gap between the duplex and the surface, each one dotted to the DNA above it and to a negatively charged silanol oxygen below it. The DNA does not touch the silica: the cation bridges it, which is what the molar salt is for." },

{ note:"The salt can then be washed out with ethanol, which will not redissolve the DNA. This leaves only DNA on the column which can then be eluted with water.",
  desc:"Under the column on the left, a looped arrow labelled Spin, Wash, Elute, and below it an arrow down to the words Ultra-pure DNA." }
];

/* Slide 82's note, split one sentence group per panel.  The source's own
   sentence order is the order of the four panels, which is why the
   drawing is built this way and not some other. */
const COLUMN_STEPS = [
{ note:"Adapted from https://www.takarabio.com/images/Data%20Image/531.gif So, the overall process is you start with a dirty mix, and add this salty buffer and spin it.",
  desc:"A key across the top names five things: silica resin, an amber band; DNA, round blue dots; contaminants, grey slanted rods; the column; and the collection tube. Below it, the first panel, Binding. A spin column sits in a collection tube, an amber band of silica resin across the bottom of the column. Buffer stands on the resin, and suspended in it are three blue dots and three grey rods together. The collection tube below is empty." },

{ note:"You then toss the flow through as waste and add washing buffer and spin that through. With the zymo kit, you do that wash twice.",
  desc:"An arrow labelled Spin leads to the second panel, Washing. The three blue dots are now sitting on top of the amber resin, and the three grey rods have gone straight through into the bottom of the collection tube. Fresh buffer stands on the resin above the DNA." },

{ note:"Finally, you spin the column to full dry it out.",
  desc:"A second Spin arrow leads to the third panel, Drying. The flow-through has been discarded, so the collection tube is empty again, and there is no liquid anywhere in the column. The three blue dots are still on the resin." },

{ note:"Then you elute it by adding water to redissolve the DNA and spin it through into a collection vessel.",
  desc:"A third Spin arrow leads to the last panel, Elution. The resin is bare, and the three blue dots are now in the bottom of the collection tube, in a small volume of water. The DNA has come off the column and nothing else has come with it." }
];

window.Deck.sequence("zymo-chem", function(slide){
  const paint = painter(slide, CHEM,
    { load:-1, surface:-1, salt:-1, bind:1, out:2 });
  paint(0, false);
  return { steps: CHEM_STEPS, go: paint };
});

window.Deck.sequence("zymo-column", function(slide){
  const paint = painter(slide, COLUMN,
    { key:-1, a0:-1, s0:1, a1:1, s1:2, a2:2, s2:3, a3:3 });
  paint(0, false);
  return { steps: COLUMN_STEPS, go: paint };
});

})();
