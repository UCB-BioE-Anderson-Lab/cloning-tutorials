/* ------------------------------------------------------------------ *
 * spectro.js: absorbance, a chromogenic substrate, scattering, and OD,
 * on one drawn spectrophotometer.                          (3 clicks)
 *
 *   0  lamp, wavelength filter, cuvette, detector: light in, light out,
 *      absorbance from how much gets through
 *   1  cells and a caged, colourless substrate; the cells' enzyme
 *      uncages it, the yellow forms and absorbs the 420 nm light:
 *      enzyme activity read as colour
 *   2  the cells also scatter light out of the beam: the reading is
 *      absorbance plus scattering, added
 *   3  at 600 nm the yellow does not absorb: what is left is scattering,
 *      the optical density, OD600
 *
 * CUT FROM SIX CLICKS TO THREE (JCA, 20 Oct 2026: "that animation is
 * tmi, too many clicks").  Two beats went.  A pure yellow dye absorbing,
 * which the chromogenic substrate beat then did again with the cells
 * present; and doubling the cells to double the OD, which slide 23 shows
 * properly with its two fields and its ratio.  No sentence of the source
 * note was dropped: the fourteen are redistributed over four steps.
 *
 * Drawn here, in the manner of seq/cytometer.js on slide 14.  Colours
 * stay in the palette: 420 nm light is blue, 600 nm light vermillion,
 * the yellow of o-nitrophenol amber; cells and apparatus ink.
 *
 * NARRATION: the source note, verbatim, split at sentence boundaries in
 * its own order (it keeps the source's "a very common fluorophore" for
 * o-nitrophenol, a known wording slip left for JCA).  The descriptions
 * are new.  The readings are illustrative, and the slide says so.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", VERM = "#ba3a13", AMBER = "#a99011", MUTED = "#767676";
const NS = "http://www.w3.org/2000/svg";
const W = 1000, H = 560, LINE = 3;

const n2 = v => Math.round(v * 100) / 100;
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const mix = (a, b, t) => a + (b - a) * t;

function el(name, attrs, parent){
  const e = document.createElementNS(NS, name);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function text(parent, x, y, s, o){
  o = o || {};
  const t = el("text", { x:x, y:y, "text-anchor":o.anchor || "middle", "font-size":o.size || 30,
                         "font-weight":o.weight || 400, fill:o.fill || INK }, parent);
  t.textContent = s;
  return t;
}

/* ---- geometry ----------------------------------------------------- */
const BY = 250;                                    // the beam
const CUV = { x:420, y:110, w:120, h:270 };        // the cuvette, glass outside
const LIQ = { x:CUV.x + 8, y:CUV.y + 40, w:CUV.w - 16, h:CUV.h - 48 };
const DET = { x:770, y:BY - 34, w:96, h:68 };

/* cell rods and caged substrate inside the cuvette: fixed positions */
const CELLS = [[455,180,20],[500,205,-30],[470,240,60],[512,270,10],[452,300,-50],[495,330,35],
               [478,360,-15],[520,175,70],[448,215,-80],[505,300,-60],[462,270,25],[490,165,-40],
               [520,340,50],[455,345,-25],[485,285,80],[515,235,-10]];
const SUBS = [[465,195],[505,185],[450,260],[497,250],[520,310],[470,320],[445,365],[510,365],[480,215],[488,345]];

/* ---- the clicks ----------------------------------------------------
   wl: 0 = 420 nm, 1 = 600 nm.  yellow: free chromophore, 0..1.
   cells: how many rods (0, 8 or 16).  subs: caged substrate shown.
   uncage: how far the enzyme has released it.  scat: scattered rays.
   A is the reading; parts splits it into absorbance + scattering. */
const STEPS = [
  { s:{ wl:0, yellow:0, cells:0, subs:0, uncage:0, scat:0, A:0.00, parts:0 },
    note:"Though this does not involve fluorescence, another means of using light to make measurements on a cell is to use spectroscopy.  Here, you hit a sample with a beam of light and quantify how much comes out the other end.  That is its \u2018transmittance\u2019 which is inversely related to \u2018absorbance\u2019.",
    desc:"A spectrophotometer drawn in outline: a lamp, a filter that passes one wavelength, 420 nanometres, a cuvette of clear liquid, and a detector. The beam goes in at full strength, I zero, and comes out at full strength, I. The reading is an absorbance of 0.00." },
  { s:{ wl:0, yellow:1, cells:8, subs:1, uncage:1, scat:0, A:0.92, parts:0 },
    note:"This measurement requires the use of a chromophore, which means a molecule that absorbs light.  A very common chromophore for such experiments is o-nitrophenol which turns yellow.  Cells don\u2019t absorb much yellow light, thus there is little competing signal at this wavelength.  Typically o-nitrophenol will be caged with another molecule like phosphate or galactose that prevents the molecule from absorbing light.  An enzyme like alkaline phosphatase or galactosidase can release the alcohol and color results.  Thus, the activity of the enzyme in the cell can be monitored by watching the formation of yellow color.",
    desc:"The cuvette fills with cells and with a colourless substrate, drawn as small hexagons each carrying a cage. The cells\u2019 enzyme takes the cages off, the hexagons turn yellow, the liquid yellows with them, and the beam leaving the cuvette thins as the 420 nanometre light is absorbed. The absorbance climbs to 0.92: the enzyme\u2019s activity read as colour." },
  { s:{ wl:0, yellow:1, cells:8, subs:1, uncage:1, scat:1, A:0.92, parts:1 },
    note:"Scattering is a related phenomenon in which light bounces off a particle at a different angle than its incident vector. Experimentally, scattering is measured the same way as absorbance though it is a distinct phenomenon.  In spectrometric measurements of cells, the scattering signal will be superimposed over the absorbance signal, and the two signals are additive.",
    desc:"Short rays of light bounce off the cells at angles, away from the detector. The reading is split: 0.80 from absorbance by the yellow product plus 0.12 from scattering by the cells, adding to 0.92." },
  { s:{ wl:1, yellow:1, cells:8, subs:1, uncage:1, scat:1, A:0.10, parts:2 },
    note:"The scattering signal can be isolated by monitoring the cells at 600nm, and this is referred to as the sample\u2019s \u2018optical density\u2019.  It is linearly related to the concentration of cells in the sample.",
    desc:"The filter switches to 600 nanometres and the beam turns orange-red. The yellow product does not absorb at this wavelength, so only the cells\u2019 scattering takes light out of the beam. The reading is now the optical density, OD600, 0.10, and it rises and falls with how many cells are in the tube." }
];
const KEYS = ["wl", "yellow", "cells", "subs", "uncage", "scat", "A", "parts"];

window.Deck.sequence("spectro", function(slide){
  const host = slide.querySelector(".spec-stage") || slide;
  const svg = el("svg", { viewBox:"0 0 " + W + " " + H, "aria-hidden":"true",
    preserveAspectRatio:"xMidYMid meet", style:"width:100%;height:100%;display:block" });
  host.appendChild(svg);

  /* ---- lamp and filter ---- */
  el("circle", { cx:70, cy:BY, r:30, fill:"#ffffff", stroke:INK, "stroke-width":LINE }, svg);
  el("path", { d:"M58 " + (BY + 12) + "q12 -30 24 0", fill:"none", stroke:INK, "stroke-width":2.4 }, svg);
  text(svg, 70, BY + 74, "lamp", { size:29, fill:MUTED });
  el("rect", { x:170, y:BY - 50, width:70, height:100, rx:6, fill:"#ffffff", stroke:INK, "stroke-width":LINE }, svg);
  const wlText = text(svg, 205, BY + 94, "420 nm", { size:30, weight:700 });
  text(svg, 205, BY - 64, "filter", { size:29, fill:MUTED });

  /* ---- beams: in, and out (width follows transmittance) ---- */
  const beamA = el("path", { d:"M100 " + BY + "H170", stroke:"#c9c9c9", "stroke-width":10, "stroke-linecap":"round" }, svg);
  const beamIn = el("path", { d:"M240 " + BY + "H" + CUV.x, "stroke-width":10, "stroke-linecap":"round" }, svg);
  const beamOut = el("path", { d:"M" + (CUV.x + CUV.w) + " " + BY + "H" + DET.x, "stroke-linecap":"round" }, svg);
  text(svg, 330, BY - 24, "I₀", { size:32, weight:700 });
  text(svg, 655, BY - 24, "I", { size:32, weight:700 });

  /* ---- the cuvette ---- */
  const liquid = el("rect", { x:LIQ.x, y:LIQ.y, width:LIQ.w, height:LIQ.h, fill:AMBER, "fill-opacity":0 }, svg);
  const cellG = el("g", {}, svg);
  const CELL = CELLS.map(function(c){
    return el("rect", { x:-6, y:-14, width:12, height:28, rx:6, fill:"#ffffff", stroke:INK, "stroke-width":2.2,
                        transform:"translate(" + c[0] + " " + c[1] + ") rotate(" + c[2] + ")" }, cellG);
  });
  const subG = el("g", {}, svg);
  const SUB = SUBS.map(function(p){
    const g = el("g", { transform:"translate(" + p[0] + " " + p[1] + ")" }, subG);
    let d = "";
    for (let i = 0; i < 6; i++){ const t = Math.PI / 3 * i; d += (i ? "L" : "M") + n2(7 * Math.cos(t)) + " " + n2(7 * Math.sin(t)); }
    const hex = el("path", { d:d + "Z", stroke:INK, "stroke-width":2 }, g);
    const cage = el("circle", { cx:11, cy:-6, r:4.5, fill:"#ffffff", stroke:INK, "stroke-width":2 }, g);
    return { hex:hex, cage:cage };
  });
  /* scattered rays: short strokes leaving cells at angles, off the beam */
  const scatG = el("g", {}, svg);
  const RAYS = [[470,240,-140],[500,205,-60],[512,270,40],[455,180,-120],[495,330,130],[452,300,160],[485,285,70],[505,300,110]];
  const RAY = RAYS.map(function(r){
    const a = r[2] * Math.PI / 180;
    return el("path", { d:"M" + r[0] + " " + r[1] + "l" + n2(70 * Math.cos(a)) + " " + n2(70 * Math.sin(a)),
                        "stroke-width":3, "stroke-linecap":"round", "stroke-dasharray":"10 8" }, scatG);
  });
  el("path", { d:"M" + CUV.x + " " + CUV.y + "V" + (CUV.y + CUV.h) + "H" + (CUV.x + CUV.w) + "V" + CUV.y,
               fill:"none", stroke:INK, "stroke-width":LINE + 1, "stroke-linejoin":"round" }, svg);
  text(svg, CUV.x + CUV.w / 2, CUV.y + CUV.h + 46, "cuvette", { size:29, fill:MUTED });

  /* ---- detector and readout ---- */
  el("rect", { x:DET.x, y:DET.y, width:DET.w, height:DET.h, rx:6, fill:"#ffffff", stroke:INK, "stroke-width":LINE }, svg);
  text(svg, DET.x + DET.w / 2, DET.y - 16, "detector", { size:29, fill:MUTED });
  const readG = el("g", {}, svg);
  el("rect", { x:660, y:330, width:330, height:180, rx:8, fill:"#ffffff", stroke:INK, "stroke-width":2 }, readG);
  const label = text(readG, 825, 372, "absorbance", { size:28, fill:MUTED });
  const value = text(readG, 825, 428, "0.00", { size:50, weight:700 });
  const split = text(readG, 825, 466, "", { size:26 });
  const split2 = text(readG, 825, 498, "", { size:26 });
  text(svg, 825, 548, "illustrative readings", { size:25, fill:MUTED });

  /* ---- drawing a state ---- */
  function draw(s){
    const col = s.wl < 0.5 ? BLUE : VERM;
    wlText.textContent = s.wl < 0.5 ? "420 nm" : "600 nm";
    beamIn.setAttribute("stroke", col);
    beamOut.setAttribute("stroke", col);
    const T = Math.pow(10, -s.A);
    beamOut.setAttribute("stroke-width", n2(1.5 + 8.5 * T));
    /* the yellow shows only as far as it has formed; at 600 nm it is
       still in the tube, still yellow, just not absorbing */
    liquid.setAttribute("fill-opacity", n2(0.42 * clamp01(s.yellow) * (s.subs > 0.5 ? clamp01(s.uncage) : 1)));
    const nC = Math.round(s.cells);
    CELL.forEach((c, i) => c.setAttribute("display", i < nC ? "inline" : "none"));
    subG.setAttribute("display", s.subs > 0.5 ? "inline" : "none");
    const u = clamp01(s.uncage);
    SUB.forEach(function(p, i){
      const ui = clamp01(u * 1.6 - i * 0.06);
      p.hex.setAttribute("fill", ui > 0.5 ? AMBER : "#ffffff");
      p.cage.setAttribute("opacity", n2(1 - ui));
    });
    scatG.setAttribute("opacity", n2(clamp01(s.scat)));
    RAY.forEach((r, i) => { r.setAttribute("stroke", col); r.setAttribute("display", i < Math.max(4, nC / 2) ? "inline" : "none"); });
    label.textContent = s.parts > 1.5 ? "optical density, OD600" : "absorbance";
    value.textContent = s.A.toFixed(2);
    const both = s.parts > 0.5 && s.parts < 1.5;
    split.textContent = both ? "0.80 absorbance" : "";
    split2.textContent = both ? "+ 0.12 scattering" : "";
  }

  /* ---- driver ---- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur = null, raf = null;
  function go(i, animated){
    const to = STEPS[i].s;
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    if (!cur || animated === false || reduce.matches){ cur = Object.assign({}, to); draw(cur); return; }
    const from = Object.assign({}, cur), t0 = performance.now(), dur = 1100;
    /* a fresh cuvette on click 2: the substrate starts caged and clear */
    if (to.subs > 0.5 && from.subs < 0.5){ from.subs = 1; from.uncage = 0; from.cells = to.cells; from.A = 0.12; }
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1, (now - t0) / dur), e = ease(t), s = {};
      KEYS.forEach(k => s[k] = mix(from[k], to[k], e));
      s.wl = e < 0.5 ? from.wl : to.wl;
      draw(s); cur = s;
      raf = t < 1 ? requestAnimationFrame(f) : null;
    });
  }
  go(0, false);
  return { steps: STEPS.map(x => ({ note:x.note, desc:x.desc })), go: go };
});
})();
