/* ------------------------------------------------------------------ *
 * 21-invasin.js : source 21, RBS libraries -- both figures, redrawn.
 *
 * Fills  [data-fig="constructs"]  the three invasin constructs
 *        [data-fig="invasin"]     the recovery assay
 *
 * WHY THEY ARE REDRAWN RATHER THAN RE-FETCHED.  Both come from
 * J Mol Biol 2006;355(4):619-27 (PMID 16330045), which is JCA's own
 * paper and is behind Elsevier's paywall, so there is no clean copy to
 * fetch.  More to the point there was nothing wrong with the pipeline
 * here: ppt/media/image27.png is 283x241 and image28.png is 625x361,
 * and the deck shows them about 1400px wide.  That is a four- to
 * five-fold upscale, and no filter, threshold or ground fixes an
 * upscale.  AUTHORING.txt's rule for line art and charts is to rebuild
 * them natively, and rebuilt they are sharp at any size and can be
 * measured instead of eyeballed.
 *
 * THE CONSTRUCTS KEEP THE SOURCE'S SHAPES EXACTLY, on JCA's
 * instruction: block arrow for a coding sequence, rectangle for the
 * promoter, bent arrow for the transcription start, thin backbone
 * through the middle, AraC divergent to the left of P_BAD.  Only the
 * colours and the type change.
 *
 * WHAT WAS WRONG WITH THE COLOURS.  Every label in the original is
 * WHITE with a thin dark outline, set on pale green and pale yellow --
 * about 1.6:1.  PLAN.txt had this recorded as a legibility gap
 * inherited from the source and deliberately left alone; JCA asked for
 * it fixed on 2026-11-10.  The fills are now dark enough to carry
 * white type: Inv green reads 4.9:1, AraC amber 5.3:1, both clear of
 * the 4.5:1 floor for body text, and the outline trick is gone.
 *
 * THE CHART'S COLOURS ARE A CATEGORICAL SET, not the attention ladder.
 * Three conditions are being compared and none of them is the answer,
 * so no rung is being spent -- this is the inventory case, the same
 * one balls.js argues.  Ink for normal growth, amber for arabinose,
 * blue for anaerobic: amber and blue are the palette's own two
 * chromatic rungs, they differ in hue AND in lightness, and they
 * survive greyscale.  The source's black / grey / WHITE could not be
 * carried over at all -- white bars need a grey panel to exist on,
 * which is what this deck did until now, and the panel was always a
 * workaround rather than a choice.
 *
 * THE NUMBERS ARE READ OFF THE SOURCE FIGURE, bar by bar, against its
 * own decade gridlines, and are recorded in DATA below with the
 * reading written next to each one.  Nothing here is invented: where
 * the source shows no bar and an asterisk, DATA says bdl and the
 * drawing says bdl.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", AMBER = "#a99011",
      BLUE = "#004373", MUTED = "#767676", RULE = "#d8d8d8";
const n2 = v => Math.round(v * 10) / 10;

/* ================================================================== *
 * 1. the three constructs
 * ================================================================== */
const ROW = [
  { y: 92,  p: "fdhF", araC: false },
  { y: 250, p: "BAD",  araC: true  },
  { y: 408, p: "tet",  araC: false }
];
const GREEN = "#2e7d4f";          /* Inv   -- white reads 4.9:1 on it */
const GOLD  = "#8a6f0e";          /* AraC  -- white reads 5.3:1 on it */

/* A block arrow: body from x0 to the neck, then a head to x1.
   dir +1 points right, -1 points left. */
function cds(x0, x1, y, h, head, dir, fill, label){
  const neck = dir > 0 ? x1 - head : x1 + head;
  const hh = h / 2, hy = h * 0.42;
  const d = 'M ' + x0 + ' ' + (y - hh) +
            ' L ' + neck + ' ' + (y - hh) +
            ' L ' + neck + ' ' + (y - hh - hy) +
            ' L ' + x1 + ' ' + y +
            ' L ' + neck + ' ' + (y + hh + hy) +
            ' L ' + neck + ' ' + (y + hh) +
            ' L ' + x0 + ' ' + (y + hh) + ' Z';
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + INK +
           '" stroke-width="2.5" stroke-linejoin="round"/>' +
         '<text x="' + n2((x0 + neck) / 2) + '" y="' + (y + 1) +
           '" text-anchor="middle" dominant-baseline="central" ' +
           'font-family="inherit" font-style="italic" font-weight="600" ' +
           'font-size="30" fill="#ffffff">' + label + '</text>';
}

/* The transcription start: up out of the promoter, right, arrowhead.
   The source draws it exactly this way and it is the one piece of
   SBOL-ish grammar on the figure, so it is kept to the pixel. */
function bent(x, y, top, right){
  return '<path d="M ' + x + ' ' + y + ' L ' + x + ' ' + top +
           ' L ' + (right - 11) + ' ' + top + '" fill="none" stroke="' +
           INK + '" stroke-width="3.5" stroke-linejoin="round"/>' +
         '<path d="M ' + right + ' ' + top + ' L ' + (right - 13) + ' ' +
           (top - 7) + ' L ' + (right - 13) + ' ' + (top + 7) + ' Z" fill="' +
           INK + '"/>';
}

function constructs(){
  let s = "";
  ROW.forEach(function(r){
    const y = r.y;
    /* backbone */
    s += '<line x1="' + (r.araC ? 150 : 112) + '" y1="' + y + '" x2="276" y2="' +
         y + '" stroke="' + INK + '" stroke-width="3"/>';
    if (r.araC) s += cds(150, 14, y, 56, 46, -1, GOLD, "AraC");
    /* promoter */
    s += '<rect x="168" y="' + (y - 27) + '" width="94" height="54" rx="3" ' +
         'fill="' + VERM + '" stroke="' + INK + '" stroke-width="2.5"/>';
    s += bent(196, y - 27, y - 74, 286);
    /* the promoter's name, set as two runs so the subscript is real */
    s += '<text x="296" y="' + (y - 62) + '" font-family="inherit" ' +
         'font-style="italic" font-size="31" fill="' + INK + '">P' +
         '<tspan baseline-shift="sub" font-size="0.68em">' + r.p + '</tspan></text>';
    s += cds(276, 612, y, 62, 56, 1, GREEN, "Inv");
  });
  return '<svg viewBox="0 0 626 500" xmlns="http://www.w3.org/2000/svg" ' +
         'role="img" aria-label="Three invasin constructs. Each is a promoter ' +
         'box with a bent transcription-start arrow driving a green Inv block ' +
         'arrow: the anaerobically induced fdhF promoter, the arabinose-induced ' +
         'BAD promoter with its AraC regulator pointing away to the left, and ' +
         'the constitutive tet promoter.">' + s + '</svg>';
}

/* ================================================================== *
 * 2. the recovery assay
 * ================================================================== *
 * Every value below was read off ppt/media/image28.png against its own
 * decade gridlines.  "bdl" is the source's asterisk: no bar drawn,
 * below the limit of detection.  lo/hi are the error bar's ends.
 * ------------------------------------------------------------------ */
const SERIES = [
  { key: "normal",   label: "Normal growth", fill: INK   },
  { key: "arabinose",label: "Arabinose",     fill: AMBER },
  { key: "anaerobic",label: "Anaerobic",     fill: BLUE  }
];
const DATA = [
  { panel: 0, group: "wt",      bars: [
      { s: "normal",    bdl: true },
      { s: "anaerobic", v: 1.0e-5, lo: 1.0e-5, hi: 1.5e-5 } ] },
  { panel: 0, group: "FdhInv",  bars: [
      { s: "normal",    bdl: true },
      { s: "anaerobic", v: 1.0e-1, lo: 7.5e-2, hi: 1.6e-1 } ] },
  { panel: 1, group: "wt",      bars: [
      { s: "normal",    bdl: true },
      { s: "arabinose", bdl: true } ] },
  { panel: 1, group: "AraInv",  bars: [
      { s: "normal",    bdl: true },
      { s: "arabinose", v: 2.0e-2, lo: 1.4e-2, hi: 2.7e-2 } ] },
  { panel: 2, group: "TetInv",  bars: [
      { s: "normal",    v: 1.0e-1, lo: 3.5e-2, hi: 1.5e-1 },
      { s: "arabinose", v: 3.0e-2, lo: 2.5e-3, hi: 7.0e-2 },
      { s: "anaerobic", v: 3.6e-2, lo: 2.8e-2, hi: 4.8e-2 } ] }
];

const CT = 44, CB = 404;          /* plot top (=1) and floor (=1e-5)   */
const DEC = (CB - CT) / 5;        /* one decade                        */
const BW = 44, BGAP = 5, GGAP = 26, PPAD = 15, PGAP = 17;
const X0 = 92;

function cy(v){ return CB - DEC * (Math.log10(v) + 5); }

function chart(){
  /* lay the groups out left to right, panel by panel */
  let x = X0, s = "", panels = [], cur = -1, px0 = 0;
  const marks = [];
  DATA.forEach(function(g, gi){
    if (g.panel !== cur){
      if (cur >= 0){ panels.push([px0, x - GGAP + PPAD]); x += PGAP; }
      cur = g.panel; px0 = x; x += PPAD;
    }
    const gx0 = x;
    g.bars.forEach(function(b, bi){
      const bx = x + bi * (BW + BGAP);
      const ser = SERIES.find(q => q.key === b.s);
      if (b.bdl){
        marks.push('<text x="' + n2(bx + BW/2) + '" y="' + n2(cy(2.0e-5) + 10) +
          '" text-anchor="middle" font-family="inherit" font-size="36" ' +
          'font-weight="700" fill="' + MUTED + '">*</text>');
      } else {
        const top = cy(b.v);
        /* a value sitting ON the floor has no height to show; the source
           draws only its error bar, and so does this */
        const h = Math.max(1.5, CB - top);
        marks.push('<rect x="' + n2(bx) + '" y="' + n2(CB - h) + '" width="' + BW +
          '" height="' + n2(h) + '" fill="' + ser.fill + '" stroke="' + INK +
          '" stroke-width="1.5"/>');
        const mx = bx + BW/2;
        marks.push('<path d="M ' + n2(mx) + ' ' + n2(cy(b.hi)) + ' L ' + n2(mx) +
          ' ' + n2(cy(b.lo)) + ' M ' + n2(mx-11) + ' ' + n2(cy(b.hi)) + ' L ' +
          n2(mx+11) + ' ' + n2(cy(b.hi)) + ' M ' + n2(mx-11) + ' ' + n2(cy(b.lo)) +
          ' L ' + n2(mx+11) + ' ' + n2(cy(b.lo)) + '" stroke="' + INK +
          '" stroke-width="2" fill="none"/>');
      }
    });
    const gw = g.bars.length * BW + (g.bars.length - 1) * BGAP;
    marks.push('<text x="' + n2(gx0 + gw/2) + '" y="' + (CB + 40) +
      '" text-anchor="middle" font-family="inherit" font-size="27" fill="' +
      INK + '">' + g.group + '</text>');
    x = gx0 + gw + GGAP;
  });
  panels.push([px0, x - GGAP + PPAD]);
  const W = x - GGAP + PPAD + 10;

  /* gridlines and the decade labels, behind everything */
  for (let e = 0; e >= -5; e--){
    const y = cy(Math.pow(10, e));
    s += '<line x1="' + X0 + '" y1="' + n2(y) + '" x2="' + n2(W) + '" y2="' +
         n2(y) + '" stroke="' + RULE + '" stroke-width="' + (e === -5 ? 0 : 1.5) +
         '"/>';
    s += '<text x="' + (X0 - 14) + '" y="' + n2(y + 9) + '" text-anchor="end" ' +
         'font-family="inherit" font-size="25" fill="' + INK + '">' +
         (e === 0 ? "1" : '10<tspan baseline-shift="super" font-size="0.62em">' +
          (e === -1 ? "−1" : "−" + (-e)) + '</tspan>') + '</text>';
  }
  /* the panel frames */
  panels.forEach(function(p){
    s += '<rect x="' + n2(p[0]) + '" y="' + CT + '" width="' + n2(p[1]-p[0]) +
         '" height="' + (CB - CT) + '" fill="none" stroke="' + MUTED +
         '" stroke-width="1.5"/>';
  });
  s += marks.join("");
  /* axis title and the footnote the asterisk always needed */
  s += '<text transform="translate(26,' + n2((CT+CB)/2) + ') rotate(-90)" ' +
       'text-anchor="middle" font-family="inherit" font-size="27" fill="' +
       INK + '">Fraction recovered</text>';
  s += '<text x="' + X0 + '" y="' + (CB + 78) + '" font-family="inherit" ' +
       'font-size="21" fill="' + MUTED + '">* below the limit of detection</text>';

  return '<svg viewBox="0 0 ' + n2(W) + ' ' + (CB + 96) + '" ' +
         'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' +
         'Fraction of cells recovered, on a log scale from 1 down to ten to the ' +
         'minus five, for wild type and each invasin construct under normal ' +
         'growth, arabinose and anaerobic conditions. FdhInv is recovered only ' +
         'anaerobically, at about ten percent. AraInv only with arabinose, at ' +
         'about two percent. TetInv is recovered in all three conditions. Every ' +
         'other bar is below the limit of detection and is marked with an ' +
         'asterisk.">' + s + '</svg>';
}

/* ---- fill the placeholders ---------------------------------------- */
function fill(){
  const a = document.querySelector('[data-fig="constructs"]');
  const b = document.querySelector('[data-fig="invasin"]');
  if (a) a.innerHTML = constructs();
  if (b) b.innerHTML = chart();
  /* the key's swatches are HTML, and they have to agree with the bars */
  SERIES.forEach(function(q){
    document.querySelectorAll('.key dt[data-s="' + q.key + '"]')
      .forEach(function(el){ el.style.background = q.fill; });
  });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
