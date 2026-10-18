/* ------------------------------------------------------------------ *
 * gain.js: why a brighter sample can read dimmer, and what fixes it.
 *
 *   gain1, slide 19   the instrument contradicts the truth   (2 clicks)
 *   gain2, slide 20   set the gain on cells that cannot      (3 clicks)
 *                     fluoresce, then measure
 *
 * TWO SLIDES, NOT ONE.  The source has a separate speaker note for each,
 * and the conversion kept them apart for that reason (PLAN.txt).  So
 * this file registers two sequences that share their drawing code, and
 * each slide carries its own note, split across its own clicks.
 *
 * WHAT MOVED.  The cell fields stay as they were: good crops of the
 * source's own drawn art, painted at about 0.6 of their own resolution.
 * What is new is underneath them — the histograms are drawn here rather
 * than pasted in as pictures, so the peak can actually MOVE when the
 * gain changes.  That is the whole argument of these two slides, and a
 * pair of fixed bitmaps could only assert it.
 *
 * THE ARITHMETIC, so the picture cannot lie.  A cell's reading is its
 * true brightness times the instrument's gain, and the axis is four
 * decades of log fluorescence.  Set B = 100 for the bright sample,
 * 25 for the dim one, 1 for cells carrying no fluorophore at all.
 *   slide 19  day one gain 0.3, day two gain 4.0 — drift, nobody
 *             standardised anything, and the dim sample reads higher
 *   slide 20  both days set so the unlabelled cells land in the first
 *             decade: gain 3.0, and the order comes out right
 * Those are illustrative numbers and the slide says so.  They are not
 * in the source; what IS in the source is the claim they illustrate.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", VERM = "#ba3a13", MUTED = "#767676";
const NS = "http://www.w3.org/2000/svg";
const W = 1400, H = 330, LINE = 3;

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
  const t = el("text", { x:x, y:y, "text-anchor":o.anchor || "middle", "font-size":o.size || 25,
                         "font-weight":o.weight || 400, fill:o.fill || INK }, parent);
  t.textContent = s;
  return t;
}

/* brightness of the three populations, in arbitrary units */
const BRIGHT = 100, DIM = 25, BARE = 1;
const AX = { y:250, h:150, pad:34 };          // one histogram's axis
const DEC = 4;                                 // decades on the axis

/* one histogram panel: an axis of four decades and a peak that moves */
function panel(parent, x0, w, title){
  const g = el("g", {}, parent);
  const x1 = x0 + w;
  el("path", { d:"M" + x0 + " " + AX.y + "H" + x1, stroke:INK, "stroke-width":LINE,
               "stroke-linecap":"round" }, g);
  for (let d = 0; d <= DEC; d++){
    const x = x0 + w * d / DEC;
    el("path", { d:"M" + n2(x) + " " + AX.y + "v9", stroke:INK, "stroke-width":2 }, g);
    text(g, x, AX.y + 36, "10" + ["⁰","¹","²","³","⁴"][d], { size:22, fill:MUTED });
  }
  text(g, x0 + w / 2, AX.y + 74, "fluorescence", { size:23, fill:MUTED });
  text(g, x0 + w / 2, 36, title, { size:26, weight:700 });
  const dial = text(g, x0 + w / 2, 70, "", { size:24, fill:BLUE });
  /* two curves: the labelled sample, and the cells carrying nothing */
  const lab = el("path", { fill:VERM, "fill-opacity":0.18, stroke:VERM, "stroke-width":LINE,
                           "stroke-linejoin":"round" }, g);
  const bare = el("path", { fill:MUTED, "fill-opacity":0.16, stroke:MUTED, "stroke-width":2.4,
                            "stroke-linejoin":"round" }, g);
  /* the first decade, shaded, so "centred in the first decade" is visible */
  const band = el("rect", { x:x0, y:AX.y - AX.h, width:w / DEC, height:AX.h, fill:BLUE,
                            "fill-opacity":0.07 }, g);
  band.setAttribute("opacity", 0);
  /* a bell at log10(value), clipped to the axis */
  function curve(el_, value, h){
    if (h <= 0.004){ el_.setAttribute("d", ""); return; }
    const cx = x0 + w * clamp01(Math.log(Math.max(value, 1e-6)) / Math.LN10 / DEC);
    const sd = w / DEC * 0.30;
    let d = "M" + n2(cx - sd * 3) + " " + AX.y;
    for (let i = -30; i <= 30; i++){
      const x = cx + sd * i / 10;
      const y = AX.y - AX.h * h * Math.exp(-0.5 * (i / 10) * (i / 10));
      d += "L" + n2(x) + " " + n2(y);
    }
    el_.setAttribute("d", d + "L" + n2(cx + sd * 3) + " " + AX.y + "Z");
  }
  return { g:g, dial:dial, band:band,
    set:function(s){
      curve(lab, s.B * s.gain, s.lab);
      curve(bare, BARE * s.gain, s.bare);
      this.dial.textContent = s.showGain ? "gain " + s.gain.toFixed(1) : "";
      band.setAttribute("opacity", n2(s.band));
    } };
}

function build(slide, host){
  const svg = el("svg", { viewBox:"0 0 " + W + " " + H, "aria-hidden":"true",
    preserveAspectRatio:"xMidYMid meet", style:"width:100%;height:100%;display:block" });
  host.appendChild(svg);
  const L = panel(svg, 70, 560, "run on day one");
  const R = panel(svg, 770, 560, "run on day two");
  /* at the right edge: between the two axes it reads as a label for neither */
  text(svg, W - 10, H - 4, "illustrative values", { size:21, fill:MUTED, anchor:"end" });
  return { svg:svg, L:L, R:R };
}

/* ---- slide 19: the instrument contradicts the truth ---------------- */
const S19 = [
  { s:{ lab:0, bare:0, gL:0.3, gR:4, showGain:0, band:0 },
    note:"Suppose I use my God’s eye view of what’s going on in two samples of bacteria encoding RFP.  On the left, the cells are much more fluorescent than those on the right.  On two different days, I run one of the samples on the cytometer and collect a histogram.",
    desc:"Two fields of bacteria: on the left strongly fluorescent cells, on the right the same cells much dimmer. Below each, an empty fluorescence axis of four decades, one for each day the sample was run." },
  { s:{ lab:1, bare:0, gL:0.3, gR:4, showGain:1, band:0 },
    note:"Surprisingly, the instrument is telling me that the cells on the right are more fluorescent than those on the left.  The problem here is that the sensitivity of the instrument will drift over time.  There are dials you can tune that can make the signal be any number you want it to be.  Thus, you must in some way standardize the signal to get consistent measurements across experiments.",
    desc:"A peak rises on each axis, and the gain used on each day appears above it. The bright sample, run at low gain, peaks low on the axis; the dim sample, run at high gain, peaks higher. The instrument has reversed the truth." }
];

/* ---- slide 20: set the gain on cells that cannot fluoresce --------- */
const S20 = [
  { s:{ lab:0, bare:1, gL:0.3, gR:4, showGain:1, band:0 },
    note:"For cytometry, this normalization is typically done by comparison to cells that lack the fluorophore, such as unmodified bacteria grown under similar conditions to the test sample.",
    desc:"Under each field, a second field of cells that carry no fluorophore at all. On each axis a grey peak appears for those cells, and at the two days' different gains the grey peaks sit in different places." },
  { s:{ lab:0, bare:1, gL:3, gR:3, showGain:1, band:1 },
    note:"You run the white cells through the cytometer then adjust the gain on the instrument such that the signal is centered in the first decade.",
    desc:"The first decade of each axis is shaded. The gain on each day is turned until the grey peak sits inside that band, and both days end at the same gain." },
  { s:{ lab:1, bare:1, gL:3, gR:3, showGain:1, band:1 },
    note:"You then measure your test samples with these settings.",
    desc:"The labelled samples are run again at those settings. Now the bright sample peaks well to the right of the dim one: the order matches the cells themselves." }
];

function driver(host, STEPS, slide){
  const v = build(slide, host);
  const KEYS = ["lab", "bare", "gL", "gR", "band"];
  function draw(s){
    v.L.set({ B:BRIGHT, gain:s.gL, lab:s.lab, bare:s.bare, showGain:s.showGain > 0.5, band:s.band });
    v.R.set({ B:DIM,    gain:s.gR, lab:s.lab, bare:s.bare, showGain:s.showGain > 0.5, band:s.band });
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur = null, raf = null;
  function go(i, animated){
    const to = STEPS[i].s;
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    if (!cur || animated === false || reduce.matches){ cur = Object.assign({}, to); draw(cur); return; }
    const from = Object.assign({}, cur), t0 = performance.now(), dur = 1100;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1, (now - t0) / dur), e = ease(t), s = {};
      KEYS.forEach(k => s[k] = mix(from[k], to[k], e));
      s.showGain = to.showGain;
      draw(s); cur = s;
      raf = t < 1 ? requestAnimationFrame(f) : null;
    });
  }
  go(0, false);
  return { steps: STEPS.map(x => ({ note:x.note, desc:x.desc })), go: go };
}

window.Deck.sequence("gain1", function(slide){
  return driver(slide.querySelector(".gain-stage") || slide, S19, slide);
});
window.Deck.sequence("gain2", function(slide){
  return driver(slide.querySelector(".gain-stage") || slide, S20, slide);
});
})();
