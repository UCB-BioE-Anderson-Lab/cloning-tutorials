/* ------------------------------------------------------------------ *
 * cytometer.js: how a flow cytometer works, one idea per click.
 *
 *   0  sample in a sheath stream: the cells line up in single file
 *   1  a laser crosses the stream at one point
 *   2  a green cell crosses it and fluoresces: the FL detector reads it
 *   3  every cell scatters: forward and side scatter, green or not
 *   4  FACS: the stream breaks into droplets, and the green one is
 *      deflected into its own tube
 *   5  the output: one row of numbers per cell
 *
 * Drawn here, not traced (JCA: "you can make this yourself").  The
 * cells are the green rods of the previous slide: green when they carry
 * a fluorophore, ink when they do not.  The laser and the light it
 * scatters are blue, which a 488 nm laser really is; fluorescence is
 * green.  Everything else is ink.
 *
 * Each click moves the file of cells down the capillary; a detector
 * lights only while a cell is in the beam, so "every cell scatters,
 * only the green ones fluoresce" is something you see, not read.
 * Nothing moves between clicks, and reduced motion or a jump settles
 * straight to the click's end state.
 *
 * NARRATION: the source note, verbatim, split at sentence boundaries
 * across the clicks in its own order.  The descriptions are new.  The
 * numbers in the event table are illustrative, and the table says so.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", GREEN = "#2b8a3e", MUTED = "#767676";
const NS = "http://www.w3.org/2000/svg";
const W = 1000, H = 700, LINE = 3;

const n1 = v => Math.round(v * 10) / 10;
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function el(name, attrs, parent){
  const e = document.createElementNS(NS, name);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function text(parent, x, y, s, o){
  o = o || {};
  const t = el("text", { x:x, y:y, "text-anchor":o.anchor || "middle", "font-size":o.size || 26,
                         "font-weight":o.weight || 400, fill:o.fill || INK }, parent);
  t.textContent = s;
  return t;
}

/* ---- geometry ----------------------------------------------------- */
const CX = 360;                    // the stream's axis
const TOP = 30, NECK = 205, NOZZLE = 560;
const FUNNEL = 100, BORE = 22;     // half-widths
const BY = 330;                    // where the laser crosses
const S = 56, Y0 = 150;            // cell spacing; where a cell leaves the needle
const AT_BEAM = (BY - Y0) / S;     // pos - k when cell k is in the beam
const DIAG = [[CX + 26, BY + 26], [455, 425], [530, 500]];   // side light: point, lens, mirror

/* which cells carry a fluorophore */
const LIT = [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0];
/* illustrative readings, one row per cell, arbitrary units */
const READ = LIT.map(function(g, k){
  const fsc = [612, 588, 640, 597, 655, 603, 621, 579, 630, 615, 600, 644, 590, 607][k];
  const ssc = [118, 131, 109, 124, 140, 115, 127, 133, 112, 121, 126, 119, 136, 110][k];
  const fl  = g ? [8412, 0, 7930, 9105, 0, 8268, 7754, 0, 8890, 8013, 0, 8547, 7602, 0][k] : [0, 34, 0, 0, 41, 0, 0, 29, 0, 0, 37, 0, 0, 31][k];
  return [fsc, ssc, fl];
});

/* ---- the clicks --------------------------------------------------- */
const STEPS = [
  { s:{ pos:1.6, laser:0, fl:0, scat:0, sort:0, sortT:0, table:0 },
    note:"One workhorse instrument for measuring fluorescence is cytometry.  Here, a dilute sample of cells is passed through a flow chamber.",
    desc:"A flow cell drawn in outline: a funnel narrowing into a thin capillary. The sample enters down a fine needle at the top, inside a stream of sheath fluid, and the cells, small rods, some green and some not, line up in single file in the capillary." },
  { s:{ pos:2.7, laser:1, fl:0, scat:0, sort:0, sortT:0, table:0 },
    note:"A laser is directed at a specific region of space along this chamber.  Since the cells are dilute, only one cell passes through the laser at any given time.",
    desc:"A laser on the left sends a blue beam across the capillary at one point. The file of cells moves down; the next cell sits just above the beam." },
  { s:{ pos:AT_BEAM, laser:1, fl:1, scat:0, sort:0, sortT:0, table:0 },
    note:"If that cell is fluorescent due to the expression of a fluorescent protein or surface labeling with a fluorophore, the cell will emit light as it passes through the laser. The wavelength of that emitted light will be red-shifted relative to the laser’s wavelength, so it is easily detected.",
    desc:"A green cell moves into the beam and glows. Green light leaves it at an angle, through a lens and a mirror, to a fluorescence detector, FL, which lights up." },
  { s:{ pos:AT_BEAM + 1, laser:1, fl:1, scat:1, sort:0, sortT:0, table:0 },
    note:"Additionally, the cell will scatter the laser light in directions other than its original vector.  These signals are quantified by placing detectors at alternate angles to the incident beam.  Thus, each cell gives a side-scatter signal, a forward-scatter signal, and one or more fluorescence signals depending on the instrument setup.",
    desc:"Two more detectors appear: forward scatter, FSC, straight across from the laser behind a bar that blocks the beam itself, and side scatter, SSC, off the mirror. The next cell, which is not green, is now in the beam: FSC and SSC light up, and FL stays dark." },
  { s:{ pos:AT_BEAM + 3, laser:1, fl:1, scat:1, sort:1, sortT:1, table:0 },
    note:"Cytometers are primarily designed to work on mammalian cells, but they can also be used for bacteria or yeast cells, though the data is less precise. FACS, or fluorescence-activated cell sorting, is an instrument that adds functionality to a cytometer.  As the cell passes through the laser, a FACS machine can deflect the cell into different collection bins based on the signals that are observed.  Thus, a FACS machine will sort your cells while a cytometer only takes measurements of your cells.",
    desc:"Below the capillary the stream breaks into droplets that fall between two charged plates. The droplet carrying a green cell is deflected aside into a tube marked sorted; the others fall straight on into waste." },
  { s:{ pos:AT_BEAM + 8, laser:1, fl:1, scat:1, sort:1, sortT:1, table:1 },
    note:"The output of a cytometer is a list of measurement events for each cell that was detected going through the cytometer.  Each event is accompanied by a forward scatter, side-scatter, and fluorescence value presented as a number.",
    desc:"Several more cells pass the beam, and a table builds up on the right, one row per cell: an event number and its FSC, SSC and FL values. The green cells have large FL values; the others are near zero. The values are illustrative, in arbitrary units." }
];
const KEYS = ["pos", "laser", "fl", "scat", "sort", "sortT", "table"];

window.Deck.sequence("cytometer", function(slide){
  const host = slide.querySelector(".cyto-stage") || slide;
  const svg = el("svg", { viewBox:"0 0 " + W + " " + H, "aria-hidden":"true",
    preserveAspectRatio:"xMidYMid meet", style:"width:100%;height:100%;display:block" });
  host.appendChild(svg);
  const uid = Math.random().toString(36).slice(2, 7);
  const defs = el("defs", {}, svg);

  /* ---- the flow cell ---- */
  const inside = "M" + (CX - FUNNEL) + " " + TOP + "L" + (CX - BORE) + " " + NECK + "V" + NOZZLE +
                 "H" + (CX + BORE) + "V" + NECK + "L" + (CX + FUNNEL) + " " + TOP + "Z";
  el("path", { d:inside }, el("clipPath", { id:"cy-in-" + uid }, defs));
  el("path", { d:inside, fill:BLUE, "fill-opacity":0.05, stroke:"none" }, svg);   // sheath fluid
  const walls = "M" + (CX - FUNNEL) + " " + TOP + "L" + (CX - BORE) + " " + NECK + "V" + NOZZLE +
                "M" + (CX + FUNNEL) + " " + TOP + "L" + (CX + BORE) + " " + NECK + "V" + NOZZLE;
  el("path", { d:walls, fill:"none", stroke:INK, "stroke-width":LINE, "stroke-linejoin":"round" }, svg);
  el("path", { d:"M" + (CX - 7) + " " + (TOP - 22) + "V" + (Y0 - 8) + "M" + (CX + 7) + " " + (TOP - 22) + "V" + (Y0 - 8),
               fill:"none", stroke:INK, "stroke-width":LINE }, svg);            // the sample needle
  text(svg, CX - 18, TOP - 2, "sample", { anchor:"end", size:26, fill:MUTED });
  text(svg, CX + FUNNEL + 14, TOP + 26, "sheath fluid", { anchor:"start", size:26, fill:MUTED });

  /* ---- cells, clipped to the inside of the flow cell ---- */
  const cellG = el("g", { "clip-path":"url(#cy-in-" + uid + ")" }, svg);
  const CELLS = LIT.map(function(g){
    return el("rect", { x:CX - 7, width:14, height:30, rx:7, fill:g ? GREEN : "#ffffff",
                        "fill-opacity":g ? 0.85 : 1, stroke:g ? GREEN : INK, "stroke-width":2.4 }, cellG);
  });

  /* ---- the laser ---- */
  const laserG = el("g", {}, svg);
  el("rect", { x:40, y:BY - 22, width:110, height:44, rx:6, fill:"#ffffff", stroke:INK, "stroke-width":LINE }, laserG);
  text(laserG, 95, BY + 56, "laser", { size:27, weight:700 });
  const beam = el("path", { d:"M150 " + BY + "H570", stroke:BLUE, "stroke-width":5, "stroke-linecap":"round" }, laserG);
  el("rect", { x:570, y:BY - 16, width:10, height:32, fill:INK }, laserG);      // the beam stop

  /* ---- detectors ---- */
  function detector(parent, x, y, label, sub, colour){
    const g = el("g", {}, parent);
    const box = el("rect", { x:x, y:y, width:84, height:48, rx:6, fill:colour, "fill-opacity":0,
                             stroke:INK, "stroke-width":LINE }, g);
    text(g, x + 42, y + 33, label, { size:26, weight:700 });
    text(g, x + 42, y + 78, sub, { size:24, fill:MUTED });
    return { g:g, box:box };
  }
  const flG = el("g", {}, svg), scG = el("g", {}, svg);
  /* side light: from the interrogation point down a diagonal, a lens, a mirror */
  el("path", { d:"M" + DIAG[0][0] + " " + DIAG[0][1] + "L" + DIAG[2][0] + " " + DIAG[2][1],
               stroke:INK, "stroke-width":1.6, "stroke-dasharray":"2 7", "stroke-linecap":"round" }, flG);
  el("ellipse", { cx:DIAG[1][0], cy:DIAG[1][1], rx:30, ry:9, transform:"rotate(-45 " + DIAG[1][0] + " " + DIAG[1][1] + ")",
                  fill:"#ffffff", stroke:INK, "stroke-width":LINE }, flG);
  el("path", { d:"M" + (DIAG[2][0] - 26) + " " + (DIAG[2][1] + 26) + "L" + (DIAG[2][0] + 26) + " " + (DIAG[2][1] - 26),
               stroke:INK, "stroke-width":LINE + 1, "stroke-linecap":"round" }, flG);   // the mirror
  const FL = detector(flG, 590, 560, "FL", "fluorescence", GREEN);
  const flRay = el("path", { d:"M" + DIAG[0][0] + " " + DIAG[0][1] + "L" + DIAG[2][0] + " " + DIAG[2][1] + "L620 580",
                             fill:"none", stroke:GREEN, "stroke-width":5, "stroke-linecap":"round", "stroke-linejoin":"round" }, flG);
  const SSC = detector(scG, 620, 455, "SSC", "side scatter", BLUE);
  const sscRay = el("path", { d:"M" + DIAG[0][0] + " " + DIAG[0][1] + "L" + DIAG[2][0] + " " + DIAG[2][1] + "H620",
                              fill:"none", stroke:BLUE, "stroke-width":4, "stroke-linecap":"round", "stroke-linejoin":"round" }, scG);
  const FSC = detector(scG, 610, BY - 24, "FSC", "forward scatter", BLUE);
  const fscRay = el("path", { d:"M" + (CX + 24) + " " + BY + "L570 " + (BY - 22) + "M570 " + (BY - 22) + "L610 " + (BY - 10) +
                              "M" + (CX + 24) + " " + BY + "L570 " + (BY + 22) + "M570 " + (BY + 22) + "L610 " + (BY + 10),
                              fill:"none", stroke:BLUE, "stroke-width":3, "stroke-linecap":"round" }, scG);

  /* ---- FACS: droplets, plates, tubes ---- */
  const sortG = el("g", {}, svg);
  text(sortG, CX - 120, NOZZLE + 46, "+", { size:30, weight:700 });
  text(sortG, CX + 120, NOZZLE + 46, "−", { size:30, weight:700 });
  el("path", { d:"M" + (CX - 95) + " " + (NOZZLE + 22) + "v52M" + (CX + 95) + " " + (NOZZLE + 22) + "v52",
               stroke:INK, "stroke-width":LINE + 3, "stroke-linecap":"round" }, sortG);
  function tube(x, label){
    el("path", { d:"M" + (x - 22) + " " + (H - 58) + "V" + (H - 22) + "a22 14 0 0 0 44 0V" + (H - 58),
                 fill:"none", stroke:INK, "stroke-width":LINE, "stroke-linejoin":"round" }, sortG);
    text(sortG, x, H - 66, label, { size:24, fill:MUTED });
  }
  tube(CX - 150, "sorted"); tube(CX, "waste");
  const DROPS = [0, 1, 2].map(function(i){
    const g = el("g", {}, sortG);
    el("circle", { r:13, fill:"#ffffff", stroke:INK, "stroke-width":2.4 }, g);
    const c = el("rect", { x:-4, y:-8, width:8, height:16, rx:4, stroke:"none" }, g);
    return { g:g, c:c };
  });

  /* ---- the event table ---- */
  const tableG = el("g", {}, svg);
  const TX = 730, COLS = [TX, TX + 74, TX + 144, TX + 212];
  ["event", "FSC", "SSC", "FL"].forEach(function(h, i){
    text(tableG, COLS[i] + 20, 130, h, { size:24, weight:700, fill:i === 3 ? GREEN : (i ? BLUE : INK) });
  });
  el("path", { d:"M" + (TX - 10) + " 144H" + (TX + 244), stroke:INK, "stroke-width":2 }, tableG);
  const ROWS = READ.map(function(r, k){
    const g = el("g", {}, tableG);
    const y = 176 + k * 36;
    text(g, COLS[0] + 20, y, String(k + 1), { size:24, fill:MUTED });
    r.forEach(function(v, j){
      text(g, COLS[j + 1] + 20, y, String(v), { size:24, fill:j === 2 && LIT[k] ? GREEN : INK,
                                                weight:j === 2 && LIT[k] ? 700 : 400 });
    });
    return g;
  });
  text(tableG, TX + 124, 176 + 9 * 36 + 8, "illustrative values,", { size:23, fill:MUTED });
  text(tableG, TX + 124, 176 + 9 * 36 + 36, "arbitrary units", { size:23, fill:MUTED });

  /* ---- drawing a state ---- */
  const show = (g, on) => g.setAttribute("display", on ? "inline" : "none");
  function draw(s){
    /* the cells, and which one (if any) is in the beam */
    let hitG = 0, hitAny = 0;
    CELLS.forEach(function(r, k){
      const y = Y0 + S * (s.pos - k);
      r.setAttribute("y", n1(y - 15));
      r.setAttribute("display", y > Y0 - 20 && y < NOZZLE + 20 ? "inline" : "none");
      const near = clamp01(1 - Math.abs(y - BY) / 22);
      if (near > hitAny) hitAny = near;
      if (LIT[k] && near > hitG) hitG = near;
    });
    const L = clamp01(s.laser);
    show(laserG, L > 0.01);
    beam.setAttribute("opacity", n1(L * 100) / 100);
    hitG *= L; hitAny *= L;

    show(flG, s.fl > 0.01); flG.setAttribute("opacity", n1(clamp01(s.fl) * 100) / 100);
    flRay.setAttribute("opacity", n1(hitG * 100) / 100);
    FL.box.setAttribute("fill-opacity", n1(hitG * 30) / 100);

    show(scG, s.scat > 0.01); scG.setAttribute("opacity", n1(clamp01(s.scat) * 100) / 100);
    sscRay.setAttribute("opacity", n1(hitAny * 100) / 100);
    fscRay.setAttribute("opacity", n1(hitAny * 100) / 100);
    SSC.box.setAttribute("fill-opacity", n1(hitAny * 22) / 100);
    FSC.box.setAttribute("fill-opacity", n1(hitAny * 22) / 100);

    /* FACS: three droplets leave the nozzle; the one with a green cell
       is pulled toward the + plate and into the sorted tube */
    show(sortG, s.sort > 0.01);
    const t = clamp01(s.sortT);
    DROPS.forEach(function(d, i){
      const green = i === 1;
      const u = clamp01(t * 1.4 - i * 0.2), e = ease(u);
      const y = NOZZLE + 30 + e * 120 + (1 - i) * 0;
      const x = CX + (green ? -150 * ease(clamp01((u - 0.25) / 0.75)) : 0);
      d.g.setAttribute("transform", "translate(" + n1(x) + " " + n1(y - i * 34 * (1 - e)) + ")");
      d.c.setAttribute("fill", green ? GREEN : "#ffffff");
      d.c.setAttribute("stroke", green ? "none" : INK);
      d.c.setAttribute("stroke-width", 1.6);
      d.g.setAttribute("opacity", u > 0 ? 1 : 0);
    });

    /* the table: a row for each cell that has passed the beam */
    show(tableG, s.table > 0.01);
    const passed = Math.floor(s.pos - AT_BEAM + 1e-6) + 1;
    ROWS.forEach(function(g, k){ show(g, s.table > 0.01 && k < passed && k < 12); });
  }

  /* ---- driver: keyed tween, settles on jumps and reduced motion ---- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur = null, raf = null;
  function go(i, animated){
    const to = STEPS[i].s;
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    if (!cur || animated === false || reduce.matches){ cur = Object.assign({}, to); draw(cur); return; }
    const from = Object.assign({}, cur), t0 = performance.now();
    const dur = Math.min(2400, 900 + 260 * Math.abs(to.pos - from.pos));
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1, (now - t0) / dur), e = ease(t), s = {};
      KEYS.forEach(k => s[k] = from[k] + (to[k] - from[k]) * (k === "pos" ? t : e));
      draw(s); cur = s;
      raf = t < 1 ? requestAnimationFrame(f) : null;
    });
  }
  go(0, false);
  return { steps: STEPS.map(x => ({ note:x.note, desc:x.desc })), go: go };
});
})();
