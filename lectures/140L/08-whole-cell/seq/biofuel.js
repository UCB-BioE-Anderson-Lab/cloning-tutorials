/* ------------------------------------------------------------------ *
 * biofuel.js: the technical characterization of a biofuel yeast, then
 * three demonstrations, one bullet per click.          (8 clicks)
 *
 *   1  Build a biorefinery              the bioreactor
 *   2  Put the yeast into a bioreactor  yeast drop in; the tank fills
 *   3  ...cellulose-derived carbon      a straw bale; straw feeds in
 *   4  Collect the biofuel              the outlet pipe fills a drum
 *   5  ...cost to make a barrel         a price tag: "$ per barrel"
 *   or 6  Run a car on biofuel          the car drives in
 *   or 7  ...a layer of biofuel         a flask; medium, then a layer
 *   or 8  Light a culture on fire       a flame on that layer
 *
 * Eight clicks, over the guide's six: JCA's call, 18 Oct 2026.
 *
 * NARRATION.  Click 1 carries the source note (the slide's own
 * <template class="notes">); clicks 6-8 carry the source's three
 * "or..." notes, read from data-note on the HTML so the words stay
 * verbatim in one place.  Clicks 2-5 have NO note, by JCA's decision:
 * each does visible work, which is what the guide asks of a silent click.
 * The descriptions here are new, written for this animation.
 *
 * THE ART.  The six objects are traced ChatGPT line art from
 * seq/art-biofuel.js, each one path in its own coordinates.  Everything
 * else is drawn here: the yeast, the straw that feeds in, the pipe, the
 * liquids, the price tag.  The liquids are clipped to each object's
 * `inside`, its interior taken from the raster, so they sit inside the
 * traced walls.
 *
 * COLOUR (palette ladder).  The objects are scene art, ink.  The culture
 * and the yeast are blue: the first thing to follow.  The biofuel is
 * vermillion wherever it appears (drum, flask layer, flame), because blue
 * is already carrying the culture.  Liquids are tints at low opacity with
 * a solid surface line, the guide's envelope exception; the price tag is
 * white-filled so its words read over the fuel behind it.
 *
 * MOTION.  Arrivals are instant (the tank, the bale, the drum and pipe,
 * the tag, the flask); changes are tweened, ease-in-out, 700-900 ms, or
 * up to 1200 for a composed reveal (yeast then filling; pipe then drum;
 * medium then layer).  No bounce.  Under prefers-reduced-motion, and
 * going backwards or jumping, each click settles straight to its end
 * state.  Nothing moves between clicks.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", VERM = "#ba3a13";
const NS = "http://www.w3.org/2000/svg";
const W = 660, H = 600;
const LINE = 2.6;                         // every traced object, in svg units

const n1 = v => Math.round(v * 10) / 10;
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function el(name, attrs, parent){
  const e = document.createElementNS(NS, name);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}

/* where each object goes: origin and scale, in svg units.  Anchors
   inside an object are in its own coordinates (art-biofuel.js), read
   off the traced drawing. */
const PLACE = {
  tank:  { x:24,  y:36,  s:1.15 },
  bale:  { x:392, y:44,  s:0.70 },
  drum:  { x:466, y:400, s:0.62 },
  car:   { x:52,  y:236, s:1.34 },
  flask: { x:204, y:244, s:1.14 },
  flame: { x:232, y:54,  s:0.78 }     // base 14 units down inside the neck
};
const ANCHOR = {
  tankInlet: [99, 2],          // top of the straight pipe on the dome
  tankSpout: [252, 305],       // the tap's mouth, pointing down
  drumBung:  [146, 30],        // the filler hole on the lid
  drumLid:   56,               // y of the lid's lower edge: fuel stops below it
  baleEnd:   [62, 150],       // the middle of the cut end (bale-v2), where straw leaves
  flameBase: 262               // y below which the flame art is its ground line
};
function at(name, p){ const o = PLACE[name]; return [o.x + p[0] * o.s, o.y + p[1] * o.s]; }

/* One traced object as a group at its place.  Its strokes are a uniform
   LINE on the slide, whatever its scale. */
function object(parent, name, colour){
  const a = window.ART.biofuel[name], o = PLACE[name];
  const g = el("g", { transform:"translate(" + o.x + " " + o.y + ") scale(" + o.s + ")" }, parent);
  el("path", { d:a.d, fill:"none", stroke:colour || INK, "stroke-width":(LINE / o.s).toFixed(2),
               "stroke-linecap":"round", "stroke-linejoin":"round" }, g);
  return g;
}

/* A liquid inside an object: a tint plus a surface line, clipped to the
   object's interior.  set(level) takes a y in the object's coordinates. */
let clipN = 0;
function liquid(parent, name, colour, tint){
  const a = window.ART.biofuel[name], o = PLACE[name];
  const id = "bf-clip-" + (++clipN) + "-" + Math.random().toString(36).slice(2, 7);
  const defs = el("defs", {}, parent);
  el("path", { d:a.inside }, el("clipPath", { id:id }, defs));
  const g = el("g", { transform:"translate(" + o.x + " " + o.y + ") scale(" + o.s + ")",
                      "clip-path":"url(#" + id + ")" }, parent);
  const body = el("rect", { x:-10, width:a.w + 20, fill:colour, "fill-opacity":tint }, g);
  const top = el("path", { fill:"none", stroke:colour, "stroke-width":(LINE / o.s).toFixed(2) }, g);
  return {
    g: g,
    set: function(y, y1){
      const bottom = y1 != null ? y1 : a.h + 10;
      body.setAttribute("y", n1(y)); body.setAttribute("height", n1(Math.max(0, bottom - y)));
      top.setAttribute("d", "M-10 " + n1(y) + "H" + n1(a.w + 10));
    }
  };
}

/* the interior's vertical extent, for levels */
function span(name){
  const ys = (window.ART.biofuel[name].inside.match(/-?\d+\.?\d*/g) || []).map(Number).filter((v, i) => i % 2);
  return [Math.min.apply(null, ys), Math.max.apply(null, ys)];
}

/* a budding yeast cell: an oval mother with a small bud */
function yeast(parent, x, y, r, tilt){
  const g = el("g", {}, parent);
  const c = el("g", { transform:"translate(" + x + " " + y + ") rotate(" + tilt + ")" }, g);
  el("ellipse", { cx:0, cy:0, rx:r, ry:r * 0.78, fill:"none", stroke:BLUE, "stroke-width":2.5 }, c);
  el("ellipse", { cx:r * 1.22, cy:-r * 0.2, rx:r * 0.45, ry:r * 0.38, fill:"none", stroke:BLUE, "stroke-width":2.5 }, c);
  return g;
}

/* ---- the clicks ------------------------------------------------------ */
const DESC = [
  "A bioreactor, a tall steel fermentation tank with a conical bottom, a ladder up its side, pipes on its top and a tap near its base.",
  "Budding yeast cells, small ovals each with a smaller bud, drop into the tank from above, and the tank fills with culture to near the top.",
  "A rectangular bale of straw, bound with two bands, appears beside the tank, and loose straw from its cut end feeds over into the top of the tank.",
  "A pipe runs from the tank's tap down to a steel drum. Biofuel flows along the pipe and fills the drum from the bottom up, and the level in the tank falls a little.",
  "A price tag hangs on the full drum, reading: dollars per barrel. No figure is given.",
  "The plant is gone. A car drives in from the left and stops on a road: the fuel tested by simply running a car on it.",
  "A conical lab flask fills with culture medium, and then small droplets of biofuel rise through it and gather into a separate layer floating on top.",
  "The biofuel layer in the flask is lit, and a flame rises out of the flask's mouth."
];

const FRAMES = [
  { plant:1, yeast:0, culture:0, bale:0, feed:0, pipe:0, drum:0, tag:0, car:0, drive:0, flask:0, medium:0, layer:0, flame:0 },
  { plant:1, yeast:1, culture:1, bale:0, feed:0, pipe:0, drum:0, tag:0, car:0, drive:0, flask:0, medium:0, layer:0, flame:0 },
  { plant:1, yeast:1, culture:1, bale:1, feed:1, pipe:0, drum:0, tag:0, car:0, drive:0, flask:0, medium:0, layer:0, flame:0 },
  { plant:1, yeast:1, culture:1, bale:1, feed:1, pipe:1, drum:1, tag:0, car:0, drive:0, flask:0, medium:0, layer:0, flame:0 },
  { plant:1, yeast:1, culture:1, bale:1, feed:1, pipe:1, drum:1, tag:1, car:0, drive:0, flask:0, medium:0, layer:0, flame:0 },
  { plant:0, yeast:1, culture:1, bale:1, feed:1, pipe:1, drum:1, tag:1, car:1, drive:1, flask:0, medium:0, layer:0, flame:0 },
  { plant:0, yeast:1, culture:1, bale:1, feed:1, pipe:1, drum:1, tag:1, car:0, drive:1, flask:1, medium:1, layer:1, flame:0 },
  { plant:0, yeast:1, culture:1, bale:1, feed:1, pipe:1, drum:1, tag:1, car:0, drive:1, flask:1, medium:1, layer:1, flame:1 }
];

/* what each click tweens on the way in: [key, from, to, start ms, ms].
   Keys not listed jump to the new frame's value at the start. */
const ENTER = {
  1: [["yeast", 0, 1, 0, 700], ["culture", 0, 1, 400, 800]],
  2: [["feed", 0, 1, 0, 900]],
  3: [["pipe", 0, 1, 0, 400], ["drum", 0, 1, 300, 900]],
  5: [["drive", 0, 1, 0, 900]],
  6: [["medium", 0, 1, 0, 600], ["layer", 0, 1, 500, 700]],
  7: [["flame", 0, 1, 0, 800]]
};

window.Deck.sequence("biofuel", function(slide){
  const host = slide.querySelector(".bf-stage") || slide;
  const svg = el("svg", { viewBox:"0 0 " + W + " " + H, "aria-hidden":"true",
    preserveAspectRatio:"xMidYMid meet", style:"width:100%;height:100%;display:block;overflow:hidden" });
  host.appendChild(svg);
  const lines = Array.from(slide.querySelectorAll("[data-beat]"));

  /* ---- the plant ---- */
  const plant = el("g", {}, svg);
  const tankLevels = span("tank");
  const culture = liquid(plant, "tank", BLUE, 0.12);
  const cells = el("g", {}, plant);
  /* in the cylinder: x about 40-190, y about 90-265 in tank coordinates */
  const YEAST = [[66, 150, 9, 10], [112, 196, 8, -20], [160, 140, 9, 35], [168, 232, 8, 5],
                 [74, 238, 8, 60], [120, 120, 8, -40], [130, 255, 9, 20]]
    .map(c => ({ c:c, g:yeast(cells, 0, 0, c[2], c[3]) }));
  object(plant, "tank");

  const bale = el("g", {}, plant);
  object(bale, "bale");
  const straw = el("g", {}, plant);
  const STRAW = [0, 1, 2, 3, 4, 5].map(i => el("path", { d:"M-8 -2L8 2", stroke:INK,
    "stroke-width":LINE, "stroke-linecap":"round", fill:"none" }, straw));

  const outflow = el("g", {}, plant);
  const spout = at("tank", ANCHOR.tankSpout), bung = at("drum", ANCHOR.drumBung);
  const run = spout[1] + 16;
  const pipeD = "M" + n1(spout[0]) + " " + n1(spout[1] + 2) + "V" + n1(run) + "H" + n1(bung[0]) + "V" + n1(bung[1] + 4);
  el("path", { d:pipeD, fill:"none", stroke:INK, "stroke-width":11, "stroke-linejoin":"round" }, outflow);
  el("path", { d:pipeD, fill:"none", stroke:"#ffffff", "stroke-width":11 - 2 * LINE, "stroke-linejoin":"round" }, outflow);
  const flow = el("path", { d:pipeD, fill:"none", stroke:VERM, "stroke-width":11 - 2 * LINE - 1,
    "stroke-linejoin":"round" }, outflow);
  const drumLevels = span("drum");
  const fuel = liquid(outflow, "drum", VERM, 0.16);
  object(outflow, "drum");

  const tag = el("g", {}, plant);
  (function(){
    const dx = PLACE.drum.x + window.ART.biofuel.drum.w * PLACE.drum.s / 2, dy = PLACE.drum.y + 96;
    el("path", { d:"M" + n1(bung[0]) + " " + n1(bung[1] + 6) + "L" + n1(dx - 50) + " " + n1(dy + 8),
                 stroke:INK, "stroke-width":2, fill:"none" }, tag);
    el("path", { d:"M" + (dx - 58) + " " + (dy + 8) + "L" + (dx - 44) + " " + (dy - 6) + "H" + (dx + 66) +
                   "V" + (dy + 22) + "H" + (dx - 44) + "Z",
                 fill:"#ffffff", stroke:INK, "stroke-width":LINE, "stroke-linejoin":"round" }, tag);
    el("circle", { cx:dx - 47, cy:dy + 8, r:3.2, fill:"none", stroke:INK, "stroke-width":2 }, tag);
    const t = el("text", { x:dx + 12, y:dy + 16, "text-anchor":"middle", "font-size":19, "font-weight":700,
                           fill:INK, "font-family":"inherit" }, tag);
    t.textContent = "$ per barrel";
  })();

  /* ---- the car ---- */
  const carScene = el("g", {}, svg);
  const carY = PLACE.car.y + window.ART.biofuel.car.h * PLACE.car.s + 2;
  el("path", { d:"M16 " + n1(carY) + "H" + (W - 16), stroke:INK, "stroke-width":LINE, "stroke-linecap":"round" }, carScene);
  const carMove = el("g", {}, carScene);
  object(carMove, "car");

  /* ---- the flask ---- */
  const flaskScene = el("g", {}, svg);
  const flaskLevels = span("flask");
  const medium = liquid(flaskScene, "flask", BLUE, 0.12);
  const layer = liquid(flaskScene, "flask", VERM, 0.22);
  const drops = el("g", {}, flaskScene);
  const DROPS = [[70, 0.0], [105, 0.18], [140, 0.08], [88, 0.3], [125, 0.4]].map(d =>
    ({ x:d[0], t0:d[1], c:el("circle", { r:4.5, fill:VERM }, drops) }));
  object(flaskScene, "flask");
  const flameClip = "bf-flame-" + Math.random().toString(36).slice(2, 7);
  el("rect", { x:-20, y:-20, width:400, height:ANCHOR.flameBase + 20 },
     el("clipPath", { id:flameClip }, el("defs", {}, flaskScene)));
  const flameG = el("g", {}, flaskScene);
  const flameInner = el("g", { "clip-path":"url(#" + flameClip + ")" }, flameG);
  (function(){
    const a = window.ART.biofuel.flame;
    el("path", { d:a.d, fill:"none", stroke:VERM, "stroke-width":(LINE / PLACE.flame.s).toFixed(2),
                 "stroke-linecap":"round", "stroke-linejoin":"round" }, flameInner);
  })();

  /* ---- drawing a state ---- */
  const v = Object.assign({}, FRAMES[0]);
  const show = (g, on) => g.setAttribute("display", on ? "inline" : "none");

  function draw(){
    show(plant, v.plant > 0.5);
    show(carScene, v.car > 0.5);
    show(flaskScene, v.flask > 0.5);

    /* yeast fall from above the panel to their places in the tank */
    show(cells, v.yeast > 0);
    YEAST.forEach(function(y, i){
      const t = ease(clamp01(v.yeast * 1.35 - i * 0.05));
      const p = at("tank", [y.c[0], y.c[1]]);
      const top = -40 - i * 18;
      y.g.setAttribute("transform", "translate(" + n1(p[0]) + " " + n1(top + (p[1] - top) * t) + ")");
    });

    /* culture level: from the cone's tip to near the top of the cylinder;
       it falls a little as the drum fills */
    const full = tankLevels[0] + (tankLevels[1] - tankLevels[0]) * 0.08;
    const lvl = v.culture * (1 - 0.14 * v.drum);
    show(culture.g, lvl > 0.001);
    culture.set(tankLevels[1] - (tankLevels[1] - full) * ease(clamp01(lvl)));

    show(bale, v.bale > 0.5);
    /* straw: each piece arcs from the bale's cut end to the tank's inlet, then down inside */
    const from = at("bale", ANCHOR.baleEnd), to = at("tank", ANCHOR.tankInlet);
    show(straw, v.feed > 0 && v.feed < 1);
    STRAW.forEach(function(s, i){
      const t = ease(clamp01(v.feed * 1.5 - i * 0.1));
      const x = from[0] + (to[0] - from[0]) * t;
      const y = from[1] + (to[1] - from[1]) * t - Math.sin(Math.PI * t) * 34 + (t > 0.85 ? (t - 0.85) * 400 : 0);
      s.setAttribute("transform", "translate(" + n1(x) + " " + n1(y) + ") rotate(" + n1(t * 300 + i * 40) + ")");
      s.setAttribute("opacity", t <= 0 || t >= 1 ? 0 : 1);
    });

    show(outflow, v.pipe > 0 || v.drum > 0);
    const L = flow.getTotalLength();
    flow.setAttribute("stroke-dasharray", n1(L) + " " + n1(L));
    flow.setAttribute("stroke-dashoffset", n1(L * (1 - ease(clamp01(v.pipe)))));
    const fullD = ANCHOR.drumLid + 14;
    show(fuel.g, v.drum > 0.001);
    fuel.set(drumLevels[1] - (drumLevels[1] - fullD) * ease(clamp01(v.drum)));

    show(tag, v.tag > 0.5);

    carMove.setAttribute("transform", "translate(" + n1(-(W + 20) * (1 - ease(clamp01(v.drive)))) + " 0)");

    /* flask: medium to about half the body, then the layer gathers on top */
    const bottom = flaskLevels[1], mTop = flaskLevels[1] - (flaskLevels[1] - flaskLevels[0]) * 0.42;
    const thick = 22;
    const m = ease(clamp01(v.medium)), l = ease(clamp01(v.layer));
    show(medium.g, m > 0.001);
    medium.set(bottom - (bottom - mTop) * m);
    show(layer.g, l > 0.001);
    layer.set(mTop - thick * l, mTop);
    /* droplets rise through the medium while the layer gathers */
    show(drops, v.layer > 0 && v.layer < 1);
    DROPS.forEach(function(d){
      const t = clamp01((v.layer - d.t0) / 0.55);
      const p = at("flask", [d.x, bottom - 12 - (bottom - 12 - mTop) * ease(t)]);
      d.c.setAttribute("cx", n1(p[0])); d.c.setAttribute("cy", n1(p[1]));
      d.c.setAttribute("opacity", t <= 0 || t >= 1 ? 0 : 1);
    });

    /* the flame grows from its base, on the flask's mouth */
    const f = ease(clamp01(v.flame)), o = PLACE.flame;
    show(flameG, f > 0.001);
    const by = o.y + ANCHOR.flameBase * o.s, bx = o.x + window.ART.biofuel.flame.w * o.s / 2;
    flameG.setAttribute("transform", "translate(" + n1(bx) + " " + n1(by) + ") scale(" + n1((0.25 + 0.75 * f) * 1000) / 1000 +
      ") translate(" + n1(-bx) + " " + n1(-by) + ") translate(" + o.x + " " + o.y + ") scale(" + o.s + ")");
    flameG.setAttribute("opacity", n1(f * 100) / 100);
  }

  function settle(i){
    Object.assign(v, FRAMES[i]);
    lines.forEach(function(e){
      e.style.visibility = parseInt(e.getAttribute("data-beat"), 10) <= i + 1 ? "visible" : "hidden";
    });
    draw();
  }

  /* ---- tweening ---- */
  let raf = 0, at_ = 0;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  function play(i){
    const tracks = ENTER[i];
    Object.assign(v, FRAMES[i]);
    tracks.forEach(k => { v[k[0]] = k[1]; });
    lines.forEach(function(e){
      e.style.visibility = parseInt(e.getAttribute("data-beat"), 10) <= i + 1 ? "visible" : "hidden";
    });
    const t0 = performance.now(), end = Math.max.apply(null, tracks.map(k => k[3] + k[4]));
    (function tick(now){
      const t = now - t0;
      tracks.forEach(function(k){
        const u = clamp01((t - k[3]) / k[4]);
        v[k[0]] = k[1] + (k[2] - k[1]) * u;        // eased inside draw(), per quantity
      });
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
      if (animated !== false && !reduce.matches && i === at_ + 1 && ENTER[i]){ at_ = i; play(i); }
      else { at_ = i; settle(i); }
    }
  };
});
})();
