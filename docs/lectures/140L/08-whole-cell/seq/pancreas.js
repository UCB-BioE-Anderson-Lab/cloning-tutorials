/* ------------------------------------------------------------------ *
 * pancreas.js: testing a gene therapy for diabetes, then a demonstration,
 * one bullet per click.                                     (4 clicks)
 *
 *   1  Find a mouse diabetes model       a hunched, unwell mouse
 *   2  Treat it with the gene therapy    a vial and syringe; the virus
 *                                        goes into the mouse's pancreas
 *   3  Compare treated ... untreated     treated and untreated side by
 *                                        side; two insulin bars rise
 *   or 4  Show happy treated mice ...    the mouse runs on a treadmill
 *      5  ...about four months later     it slumps back on the still belt
 *
 * CLICK 5 IS AN ADDITION in this repo (JCA, 18 Oct 2026), not in the
 * build in ~/Downloads/demoanimation/pancreas: the treadmill as the segue
 * to ethics.  In Xiao et al.'s autoimmune mice the effect lasted about four
 * months; the running mouse is real footage that still implies a cure.
 * The four-month caveat moved here from click 1's note.
 *
 * The sibling of seq/biofuel.js, the slide before: the same layout (text
 * column left, art panel right, class "bf"), the same reveal of lines by
 * data-beat, the same conventions.  Read that file's header for the
 * reasoning; only what differs is noted here.
 *
 * RE-ARGUED.  The source slide was a cell therapy ("Artificial Pancreas
 * Cells").  JCA moved it to a gene therapy, after Xiao et al., Cell Stem
 * Cell 2018 (PMID 29304344): AAV8 carrying Pdx1 and MafA, infused into
 * the pancreatic duct, turned the mouse's own alpha cells into insulin-
 * producing cells.  So the syringe is shorthand for an intraductal
 * infusion, and the descriptions say "into the pancreas", not "injected".
 *
 * NARRATION.  Click 1 carries the slide's notes (new in their first part,
 * see the HTML); click 4 the source's treadmill note, verbatim, from
 * data-note.  Clicks 2 and 3 are silent by JCA's decision; each does
 * visible work.  The descriptions are new.
 *
 * COLOUR.  Mice, syringe, vial and treadmill are scene art, ink.  The
 * virus and the insulin bars are blue, the thing to follow.  No numbers
 * and no axis values on the bars: the slide is about what you would
 * measure, not a result.
 *
 * RUNNING WITHOUT A LOOP.  The guide forbids idle motion, so the mouse
 * does not run continuously.  Click 4 plays once: the belt's slats slide
 * back three spacings and the motion lines come in, over 900 ms, and
 * then everything holds still.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", MUTED = "#767676";
const NS = "http://www.w3.org/2000/svg";
const W = 660, H = 600;
const LINE = 2.6;

const n1 = v => Math.round(v * 10) / 10;
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const mix = (a, b, t) => a + (b - a) * t;

function el(name, attrs, parent){
  const e = document.createElementNS(NS, name);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}

/* one traced object, drawn at its own origin; place() moves it */
function object(parent, name, color){
  const a = window.ART.pancreas[name];
  const g = el("g", {}, parent);
  const p = el("path", { d:a.d, fill:"none", stroke:color || INK,
               "stroke-linecap":"round", "stroke-linejoin":"round" }, g);
  return { g:g, a:a, place:function(x, y, s, rot){
    g.setAttribute("transform", "translate(" + n1(x) + " " + n1(y) + ")" +
      (rot ? " rotate(" + rot + ")" : "") + " scale(" + s + ")");
    p.setAttribute("stroke-width", (LINE / s).toFixed(2));
  }};
}

/* a virus capsid: a small hexagon */
function capsid(parent, r){
  let d = "";
  for (let i = 0; i < 6; i++){
    const t = Math.PI / 3 * i + Math.PI / 6;
    d += (i ? "L" : "M") + n1(r * Math.cos(t)) + " " + n1(r * Math.sin(t));
  }
  return el("path", { d:d + "Z", fill:"none", stroke:BLUE, "stroke-width":2.4, "stroke-linejoin":"round" }, parent);
}

/* ---- where things go (svg units) and anchors (object units) ---------- */
const A = {
  sickBelly: [165, 118],       // under the hunched mouse, about where the pancreas is
  sickFeet: 129,               // y of the hunched mouse's paws
  mouseFeet: 172,              // y of the standing mouse's paws
  runFeet: 140,                // y of the running mouse's paws
  beltTop: 37,                 // y of the treadmill belt's upper run
  needle: [0, 38]              // the syringe's needle tip
};
const SICK1 = { s:1.15, x:132, feet:330 };            // beats 1-2: the mouse, alone, centre
const TREATED = { s:0.82, x:22, feet:330 };           // beat 3, left: the same mouse, treated
const UNTREATED = { s:0.82, x:352, feet:330 };        // beat 3, right: a second, untreated mouse
const BARS = { base:560, w:64, tall:170, short:46 };
const TRACK = { s:1.36, x:56, y:330 };                // beat 4
const RUNNER = { s:0.95 };

const DESC = [
  "A lab mouse, hunched and slumped low, head drooping, ears flat: a mouse model of diabetes.",
  "A vial of the gene therapy and a syringe. The syringe moves in under the mouse's belly, and small hexagonal virus particles pass from it into the mouse, into the pancreas.",
  "Two mice side by side: on the left the treated mouse, now standing up alert; on the right an untreated mouse, still hunched. Under each, a bar for insulin rises, tall for the treated mouse and short for the untreated one. No values are given.",
  "The lab scene is gone. The treated mouse runs on a small treadmill: the belt slides back under its feet and motion lines trail behind it.",
  "About four months later: the same mouse sits hunched and unwell on the still treadmill, the motion lines gone."
];

const FRAMES = [
  { lab:1, kit:0, dose:0, compare:0, bars:0, track:0, belt:0, relapse:0 },
  { lab:1, kit:1, dose:1, compare:0, bars:0, track:0, belt:0, relapse:0 },
  { lab:1, kit:0, dose:1, compare:1, bars:1, track:0, belt:0, relapse:0 },
  { lab:0, kit:0, dose:1, compare:1, bars:1, track:1, belt:1, relapse:0 },
  { lab:0, kit:0, dose:1, compare:1, bars:1, track:1, belt:1, relapse:1 }
];
const ENTER = {
  1: [["dose", 0, 1, 0, 1200]],
  2: [["compare", 0, 1, 0, 800], ["bars", 0, 1, 400, 800]],
  3: [["belt", 0, 1, 0, 900]],
  4: [["relapse", 0, 1, 0, 900]]
};

window.Deck.sequence("pancreas", function(slide){
  const host = slide.querySelector(".bf-stage") || slide;
  const svg = el("svg", { viewBox:"0 0 " + W + " " + H, "aria-hidden":"true",
    preserveAspectRatio:"xMidYMid meet", style:"width:100%;height:100%;display:block;overflow:hidden" });
  host.appendChild(svg);
  const lines = Array.from(slide.querySelectorAll("[data-beat]"));

  /* ---- the lab ---- */
  const lab = el("g", {}, svg);
  const sick = object(lab, "sick");             // the mouse of beats 1-2; becomes "treated"
  const well = object(lab, "mouse");            // its well pose, cross-faded in on beat 3
  const other = object(lab, "sick");            // the untreated mouse, beat 3
  const kit = el("g", {}, lab);
  const vial = object(kit, "vial");
  vial.place(40, 360, 0.72);
  const syringe = object(kit, "syringe");
  const virus = el("g", {}, kit);
  const CAPS = [0, 1, 2, 3, 4].map(() => capsid(virus, 6.5));

  const bars = el("g", {}, lab);
  function bar(cx, label){
    const g = el("g", {}, bars);
    const r = el("rect", { x:n1(cx - BARS.w / 2), width:BARS.w, fill:BLUE, "fill-opacity":0.12,
                           stroke:BLUE, "stroke-width":LINE, "stroke-linejoin":"round" }, g);
    const t = el("text", { x:n1(cx), y:BARS.base + 30, "text-anchor":"middle", "font-size":21, fill:INK }, g);
    t.textContent = label;
    return r;
  }
  const treatedX = TREATED.x + window.ART.pancreas.mouse.w * TREATED.s / 2;
  const otherX = UNTREATED.x + window.ART.pancreas.sick.w * UNTREATED.s / 2;
  const barT = bar(treatedX, "treated"), barU = bar(otherX, "untreated");
  el("path", { d:"M" + n1(treatedX - 110) + " " + BARS.base + "H" + n1(otherX + 110),
               stroke:INK, "stroke-width":LINE, "stroke-linecap":"round" }, bars);
  const ylab = el("text", { x:n1((treatedX + otherX) / 2), y:BARS.base - BARS.tall - 24,
                            "text-anchor":"middle", "font-size":21, "font-weight":700, fill:BLUE }, bars);
  ylab.textContent = "insulin";

  /* ---- the treadmill ---- */
  const track = el("g", {}, svg);
  const mill = object(track, "treadmill");
  mill.place(TRACK.x, TRACK.y, TRACK.s);
  const beltY = TRACK.y + A.beltTop * TRACK.s;
  const millW = window.ART.pancreas.treadmill.w * TRACK.s;
  const slatClip = "pc-slat-" + Math.random().toString(36).slice(2, 7);
  el("rect", { x:TRACK.x + 70, y:beltY - 2, width:millW - 140, height:16 },
     el("clipPath", { id:slatClip }, el("defs", {}, track)));
  const slats = el("g", { "clip-path":"url(#" + slatClip + ")" }, track);
  const slatG = el("g", {}, slats);
  const GAP = 34;
  for (let x = TRACK.x + 40; x < TRACK.x + millW + 3 * GAP; x += GAP)
    el("path", { d:"M" + n1(x) + " " + n1(beltY + 3) + "v9", stroke:INK, "stroke-width":2, "stroke-linecap":"round" }, slatG);
  const runner = object(track, "run");
  const runW = window.ART.pancreas.run.w * RUNNER.s;
  runner.place(TRACK.x + millW / 2 - runW / 2, beltY - A.runFeet * RUNNER.s, RUNNER.s);
  /* click 5: the same mouse, hunched, on the belt it was running on */
  const slump = object(track, "sick");
  const SL = RUNNER.s * 0.95, slW = window.ART.pancreas.sick.w * SL;
  slump.place(TRACK.x + millW / 2 - slW / 2, beltY - A.sickFeet * SL, SL);
  const speed = el("g", {}, track);
  [[-26, 0, 54], [-48, 22, 40], [-30, 44, 50]].forEach(function(m){
    const x = TRACK.x + millW / 2 - runW / 2 + m[0], y = beltY - 90 + m[1];
    el("path", { d:"M" + n1(x) + " " + n1(y) + "h" + (-m[2]), stroke:INK, "stroke-width":2.2, "stroke-linecap":"round" }, speed);
  });

  /* ---- drawing a state ---- */
  const v = Object.assign({}, FRAMES[0]);
  const show = (g, on) => g.setAttribute("display", on ? "inline" : "none");

  function draw(){
    show(lab, v.lab > 0.5);
    show(track, v.track > 0.5);

    /* the mouse: centred and large on beats 1-2; on beat 3 it moves left,
       shrinks, and stands up, while the untreated mouse is already there */
    const c = ease(clamp01(v.compare));
    const s = mix(SICK1.s, TREATED.s, c);
    const feet = mix(SICK1.feet, TREATED.feet, c);
    const x = mix(SICK1.x, TREATED.x, c);
    sick.place(x, feet - A.sickFeet * s, s);
    sick.g.setAttribute("opacity", n1((1 - c) * 100) / 100);
    well.place(x, feet - A.mouseFeet * s, s);
    well.g.setAttribute("opacity", n1(c * 100) / 100);
    show(well.g, c > 0.001);
    show(other.g, v.compare > 0);
    other.place(UNTREATED.x, UNTREATED.feet - A.sickFeet * UNTREATED.s, UNTREATED.s);

    /* the kit: the syringe slides in under the belly, then the virus
       passes from the needle into the mouse and is gone */
    show(kit, v.kit > 0.5);
    const d = clamp01(v.dose);
    const reach = ease(clamp01(d / 0.55)), inject = ease(clamp01((d - 0.5) / 0.5));
    const belly = [SICK1.x + A.sickBelly[0] * SICK1.s, SICK1.feet - A.sickFeet * SICK1.s + A.sickBelly[1] * SICK1.s];
    /* straight up from below: rotate(90) turns the needle (drawn pointing
       left) to point up, so the barrel hangs below the mouse, clear of it */
    const SS = 0.62, ROT = 90;
    const rest = [belly[0], belly[1] + 120];
    const tip = [belly[0], mix(rest[1], belly[1] + 4, reach)];
    /* place the syringe so its needle tip sits at `tip` */
    const rad = ROT * Math.PI / 180;
    const ox = tip[0] - (A.needle[0] * Math.cos(rad) - A.needle[1] * Math.sin(rad)) * SS;
    const oy = tip[1] - (A.needle[0] * Math.sin(rad) + A.needle[1] * Math.cos(rad)) * SS;
    syringe.place(ox, oy, SS, ROT);
    CAPS.forEach(function(cp, i){
      /* start in the barrel, behind the needle; end inside the belly */
      const along = 70 + i * 22;
      const bx = tip[0] + along * SS * Math.cos(rad) + 0, by = tip[1] + along * SS * Math.sin(rad);
      const t = ease(clamp01(inject * 1.4 - i * 0.1));
      const ex = belly[0] - 30 + i * 16, ey = belly[1] - 34 - (i % 2) * 14;
      cp.setAttribute("transform", "translate(" + n1(mix(bx, ex, t)) + " " + n1(mix(by, ey, t)) + ")");
      cp.setAttribute("opacity", 1);
    });
    /* the virus stays where it went, inside the mouse, for the rest of the
       click: that is what was delivered.  It goes with the kit on click 3. */
    show(virus, d > 0 && v.kit > 0.5);

    /* bars rise from the baseline */
    show(bars, v.compare > 0);
    const b = ease(clamp01(v.bars));
    [[barT, BARS.tall], [barU, BARS.short]].forEach(function(p){
      const h = p[1] * b;
      p[0].setAttribute("y", n1(BARS.base - h)); p[0].setAttribute("height", n1(h));
      p[0].setAttribute("display", h > 0.5 ? "inline" : "none");
    });
    ylab.setAttribute("opacity", n1(b * 100) / 100);

    /* treadmill: one pass of the belt, then still */
    const e = ease(clamp01(v.belt));
    slatG.setAttribute("transform", "translate(" + n1(-3 * GAP * e) + " 0)");
    const r = ease(clamp01(v.relapse));
    speed.setAttribute("opacity", n1(e * (1 - r) * 100) / 100);
    runner.g.setAttribute("opacity", n1((1 - r) * 100) / 100);
    slump.g.setAttribute("opacity", n1(r * 100) / 100);
    show(slump.g, r > 0.001);
  }

  function reveal(i){
    lines.forEach(function(e){
      e.style.visibility = parseInt(e.getAttribute("data-beat"), 10) <= i + 1 ? "visible" : "hidden";
    });
  }
  function settle(i){ Object.assign(v, FRAMES[i]); reveal(i); draw(); }

  let raf = 0, at = 0;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  function play(i){
    const tracks = ENTER[i];
    Object.assign(v, FRAMES[i]);
    tracks.forEach(k => { v[k[0]] = k[1]; });
    reveal(i);
    const t0 = performance.now(), end = Math.max.apply(null, tracks.map(k => k[3] + k[4]));
    (function tick(now){
      const t = now - t0;
      tracks.forEach(function(k){ v[k[0]] = k[1] + (k[2] - k[1]) * clamp01((t - k[3]) / k[4]); });
      draw();
      if (t < end) raf = requestAnimationFrame(tick); else settle(i);
    })(t0);
  }

  settle(0);

  return {
    steps: DESC.map(function(d, i){
      const src = lines.find(e => parseInt(e.getAttribute("data-beat"), 10) === i + 1 && e.hasAttribute("data-note"));
      return { note: i === 0 ? null : src ? src.getAttribute("data-note") : "", desc: d };
    }),
    go: function(i, animated){
      cancelAnimationFrame(raf);
      if (animated !== false && !reduce.matches && i === at + 1 && ENTER[i]){ at = i; play(i); }
      else { at = i; settle(i); }
    }
  };
});
})();
