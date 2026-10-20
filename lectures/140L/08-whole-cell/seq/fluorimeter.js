/* ------------------------------------------------------------------ *
 * fluorimeter.js: the same instrument as slide 21, with the detector
 * moved round to ninety degrees.                           (5 clicks)
 *
 *   0  spectroscopy, as slide 21 left it: the detector sits in line
 *      with the beam and reads the light that came through
 *   1  fluorimetry: the detector moves to ninety degrees, behind an
 *      emission filter, and reads a LONGER wavelength
 *   2  it only reads anything if a fluorophore is there: the cells
 *      absorb blue and give back green
 *   3  autofluorescence: cells with no fluorophore still give a dim
 *      signal, and that floor is what masks a small one
 *   4  so the reading is normalised against those cells, and then
 *      divided by OD - which is slide 23
 *
 * Built on seq/spectro.js, slide 21: read that first.  Same lamp,
 * filter and cuvette, so the two slides read as one instrument twice.
 * The geometry that differs is the point of the slide, so the ninety
 * degree path is the thing that moves.
 *
 * COLOUR.  Excitation is blue, as 420 nm is on slide 21.  Emission is
 * green, the same green as the cells on slides 13 and 14 (#2b8a3e),
 * because here it is the signal itself.  Everything else is ink.
 *
 * NARRATION: the source note, verbatim, split at sentence boundaries
 * in its own order.  The descriptions are new.  Readings are
 * illustrative and the slide says so.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", GREEN = "#2b8a3e", MUTED = "#767676";
const NS = "http://www.w3.org/2000/svg";
const W = 1000, H = 620, LINE = 3;

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
  const t = el("text", { x:x, y:y, "text-anchor":o.anchor || "middle", "font-size":o.size || 29,
                         "font-weight":o.weight || 400, fill:o.fill || INK }, parent);
  t.textContent = s;
  return t;
}

/* ---- geometry: the beam line, and the cuvette on it ---------------- */
const BY = 210;                                  // the excitation beam
const CUV = { x:400, y:90, w:130, h:250 };
const CXC = CUV.x + CUV.w / 2;
const LIQ = { x:CUV.x + 8, y:CUV.y + 36, w:CUV.w - 16, h:CUV.h - 44 };
const THRU = { x:760, y:BY - 36, w:100, h:72 };  // the in-line detector, click 0
const EMIT = { y:520 };                          // the 90 degree detector

/* rods in the cuvette */
const RODS = [[428,150,20],[470,178,-30],[440,215,60],[492,248,10],[424,282,-50],[478,310,35],
              [500,140,70],[452,312,-15]];

const STEPS = [
  { s:{ thru:1, emit:0, lit:0, cells:0, auto:0, norm:0, read:0 },
    note:"Fluorimetry is highly related to spectroscopy, and a fluorimeter can also perform absorbance measurements.  In spectroscopy, we hit with one wavelength and monitor the amount of light coming through the sample.",
    desc:"The spectrophotometer of the previous slide, drawn again: a lamp, a filter that passes one wavelength, a cuvette, and a detector sitting in line with the beam, reading the light that came through the sample." },
  { s:{ thru:0, emit:1, lit:0, cells:0, auto:0, norm:0, read:0 },
    note:"In fluorimetry, we hit with one wavelength and monitor the light emitted at 90 degree angle to the incident beam and at a higher wavelength.  Thus, there is an excitation wavelength at which we probe the sample, and an emission wavelength at which we observe the response.",
    desc:"The in-line detector is gone. A second detector appears below the cuvette, at ninety degrees to the beam, behind its own filter: the excitation filter picks the wavelength going in, the emission filter the longer wavelength coming out." },
  { s:{ thru:0, emit:1, lit:1, cells:1, auto:0, norm:0, read:1 },
    note:"Such experiments require the presence of a small molecule fluorophore or a fluorescent protein.  Like chromophores, these molecules absorb light.  However, instead of simply radiating heat, these molecules release the energy as photons of higher wavelength.",
    desc:"Cells carrying a fluorophore fill the cuvette, drawn as green rods. Where the blue beam crosses them, green light leaves at ninety degrees, down through the emission filter to the detector, which reads a strong signal." },
  { s:{ thru:0, emit:1, lit:1, cells:1, auto:1, norm:0, read:2 },
    note:"Cells contain some mildly-fluorescent fluorophores such as tryptophan which produce a background signal in these measurements.  This autofluorescence can mask low signals.",
    desc:"A second cuvette of cells carrying no fluorophore at all, drawn as plain outlines. The green path is much fainter but it is not gone: the detector still reads a small signal, labelled autofluorescence. That floor is what hides a weak signal." },
  { s:{ thru:0, emit:1, lit:1, cells:1, auto:1, norm:1, read:3 },
    note:"Like cytometry and microscopy, you must normalize the signal against some standard such as white cells in fluorimetry and spectrometry.  Additionally, you must normalize for cell density.",
    desc:"The two readings are set against each other: the signal from the labelled cells, less the background from the unlabelled ones, and then divided by the optical density, so the number is per cell rather than per tube." }
];
const KEYS = ["thru", "emit", "lit", "cells", "auto", "norm", "read"];

window.Deck.sequence("fluorimeter", function(slide){
  const host = slide.querySelector(".fluo-stage") || slide;
  const svg = el("svg", { viewBox:"0 0 " + W + " " + H, "aria-hidden":"true",
    preserveAspectRatio:"xMidYMid meet", style:"width:100%;height:100%;display:block" });
  host.appendChild(svg);

  /* ---- lamp and excitation filter ---- */
  el("circle", { cx:66, cy:BY, r:28, fill:"#ffffff", stroke:INK, "stroke-width":LINE }, svg);
  el("path", { d:"M55 " + (BY + 11) + "q11 -28 22 0", fill:"none", stroke:INK, "stroke-width":2.4 }, svg);
  text(svg, 66, BY + 68, "lamp", { size:27, fill:MUTED });
  el("rect", { x:150, y:BY - 46, width:62, height:92, rx:6, fill:"#ffffff", stroke:INK, "stroke-width":LINE }, svg);
  text(svg, 181, BY - 60, "excitation", { size:26, fill:MUTED });
  text(svg, 181, BY + 78, "filter", { size:26, fill:MUTED });
  el("path", { d:"M94 " + BY + "H150", stroke:"#c9c9c9", "stroke-width":9, "stroke-linecap":"round" }, svg);
  el("path", { d:"M212 " + BY + "H" + CUV.x, stroke:BLUE, "stroke-width":9, "stroke-linecap":"round" }, svg);

  /* ---- the cuvette ---- */
  const liquid = el("rect", { x:LIQ.x, y:LIQ.y, width:LIQ.w, height:LIQ.h, fill:GREEN, "fill-opacity":0 }, svg);
  const rodG = el("g", {}, svg);
  const ROD = RODS.map(function(r){
    return el("rect", { x:-6, y:-14, width:12, height:28, rx:6, "stroke-width":2.3,
                        transform:"translate(" + r[0] + " " + r[1] + ") rotate(" + r[2] + ")" }, rodG);
  });
  el("path", { d:"M" + CUV.x + " " + CUV.y + "V" + (CUV.y + CUV.h) + "H" + (CUV.x + CUV.w) + "V" + CUV.y,
               fill:"none", stroke:INK, "stroke-width":LINE + 1, "stroke-linejoin":"round" }, svg);
  /* above the cuvette: below it the emission ray runs straight through */
  const cuvLabel = text(svg, CXC, CUV.y - 18, "cuvette", { size:27, fill:MUTED });

  /* ---- the in-line detector: spectroscopy, click 0 ---- */
  const thruG = el("g", {}, svg);
  el("path", { d:"M" + (CUV.x + CUV.w) + " " + BY + "H" + THRU.x, stroke:BLUE, "stroke-width":7,
               "stroke-linecap":"round" }, thruG);
  el("rect", { x:THRU.x, y:THRU.y, width:THRU.w, height:THRU.h, rx:6, fill:"#ffffff", stroke:INK,
               "stroke-width":LINE }, thruG);
  text(thruG, THRU.x + THRU.w / 2, THRU.y + 44, "detector", { size:26 });
  text(thruG, THRU.x + THRU.w / 2, THRU.y + THRU.h + 36, "light that came through", { size:24, fill:MUTED });

  /* ---- the ninety degree path: fluorimetry ---- */
  const emitG = el("g", {}, svg);
  const ray = el("path", { d:"M" + CXC + " " + BY + "V" + (EMIT.y - 52), stroke:GREEN, "stroke-width":9,
                           "stroke-linecap":"round" }, emitG);
  el("rect", { x:CXC - 72, y:398, width:144, height:52, rx:6, fill:"#ffffff", stroke:INK, "stroke-width":LINE }, emitG);
  text(emitG, CXC, 432, "emission", { size:26 });
  text(emitG, CXC - 92, 424, "filter: passes the", { size:24, fill:MUTED, anchor:"end" });
  text(emitG, CXC - 92, 452, "longer wavelength", { size:24, fill:MUTED, anchor:"end" });
  const det = el("rect", { x:CXC - 50, y:EMIT.y, width:100, height:68, rx:6, fill:GREEN, "fill-opacity":0,
                           stroke:INK, "stroke-width":LINE }, emitG);
  text(emitG, CXC, EMIT.y + 42, "detector", { size:26 });
  const ninetyT = text(emitG, CXC + 80, 384, "90° from the beam", { size:25, fill:MUTED, anchor:"start" });

  /* ---- the readout ---- */
  const readG = el("g", {}, svg);
  el("rect", { x:690, y:316, width:296, height:176, rx:8, fill:"#ffffff", stroke:INK, "stroke-width":2 }, readG);
  const rLabel = text(readG, 838, 360, "signal", { size:27, fill:MUTED });
  const rValue = text(readG, 838, 418, "", { size:48, weight:700, fill:GREEN });
  const rSub = text(readG, 838, 456, "", { size:25, fill:MUTED });
  text(svg, 838, 524, "illustrative readings", { size:24, fill:MUTED });

  /* ---- drawing a state ---- */
  const show = (g, on) => g.setAttribute("display", on ? "inline" : "none");
  function draw(s){
    show(thruG, s.thru > 0.01); thruG.setAttribute("opacity", n2(clamp01(s.thru)));
    show(emitG, s.emit > 0.01); emitG.setAttribute("opacity", n2(clamp01(s.emit)));
    /* the cells: green once a fluorophore is in them, plain outlines when
       the point is that there is none */
    const labelled = s.auto > 0.5 ? 0 : clamp01(s.cells);
    show(rodG, s.cells > 0.01);
    ROD.forEach(function(r){
      r.setAttribute("fill", labelled > 0.5 ? GREEN : "#ffffff");
      r.setAttribute("fill-opacity", labelled > 0.5 ? 0.85 : 1);
      r.setAttribute("stroke", labelled > 0.5 ? GREEN : INK);
    });
    liquid.setAttribute("fill-opacity", n2(0.14 * labelled));
    cuvLabel.textContent = s.cells < 0.5 ? "cuvette"
      : (s.auto > 0.5 ? "cells with no fluorophore" : "cells carrying a fluorophore");
    /* the emitted light: strong from labelled cells, a floor from bare ones */
    const strength = s.lit < 0.5 ? 0 : (s.auto > 0.5 ? 0.18 : 1);
    ray.setAttribute("opacity", n2(strength));
    ray.setAttribute("stroke-width", n2(3 + 8 * strength));
    det.setAttribute("fill-opacity", n2(0.3 * strength));
    ninetyT.setAttribute("opacity", n2(1 - clamp01(s.lit)));
    /* the readout */
    const r = Math.round(s.read);
    show(readG, r > 0);
    if (r === 1){ rLabel.textContent = "signal"; rValue.textContent = "8,400"; rSub.textContent = ""; }
    if (r === 2){ rLabel.textContent = "autofluorescence"; rValue.textContent = "320"; rSub.textContent = "with no fluorophore"; }
    if (r === 3){ rLabel.textContent = "per cell"; rValue.textContent = "(8,400 − 320) / OD"; rSub.textContent = ""; }
    rValue.setAttribute("font-size", r === 3 ? 32 : 48);
  }

  /* ---- driver ---- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur = null, raf = null;
  function go(i, animated){
    const to = STEPS[i].s;
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    if (!cur || animated === false || reduce.matches){ cur = Object.assign({}, to); draw(cur); return; }
    const from = Object.assign({}, cur), t0 = performance.now(), dur = 1000;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1, (now - t0) / dur), e = ease(t), s = {};
      KEYS.forEach(k => s[k] = mix(from[k], to[k], e));
      s.read = e < 0.5 ? from.read : to.read;
      s.auto = e < 0.5 ? from.auto : to.auto;
      draw(s); cur = s;
      raf = t < 1 ? requestAnimationFrame(f) : null;
    });
  }
  go(0, false);
  return { steps: STEPS.map(x => ({ note:x.note, desc:x.desc })), go: go };
});
})();
