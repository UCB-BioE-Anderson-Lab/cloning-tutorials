/* ------------------------------------------------------------------ *
 * otis.js: Otis cuts the rope, in four clicks.
 *
 *   0  Otis has built a safety elevator and wants to show it
 *   1  he gathers a crowd
 *   2  he cuts the rope: the platform drops a hair and the catches bite
 *   3  and nothing happens: he raises his hat
 *
 * The art is window.ART.otis (seq/art-otis.js): twelve AI-drawn parts
 * traced to vectors, each in its own crop's pixels.  This file places and
 * scales them and swaps them per click; it draws nothing of its own except
 * the white plate and the floor line.
 *
 * WHERE IT LIVES.  Built to sit inside the amber Demonstation card; in
 * the deck it is a white slide of its own straight after that card, the
 * art at full slide height with the title laid over it (JCA, 18 Oct
 * 2026).  The white plate below is now invisible on the white slide and
 * is kept so the file still works on a coloured ground.
 *
 * The art is AI-generated (ChatGPT) line art, traced with lineart-trace;
 * built outside the repo in ~/Downloads/demoanimation, whose README and
 * tools rebuild art-otis.js.
 *
 * SCALE.  The sheet drew every part at its own size, so nothing is
 * placed at sheet scale.  Everything is set from three facts:
 *   - the railing comes to Otis's hip
 *   - the folded catches just clear the rail teeth, and the open ones
 *     reach into them
 *   - the crowd stands as tall as Otis, plus a hat
 * The constants below are those three decisions turned into numbers; the
 * anchors in A are measured off the part images, in crop pixels.
 *
 * THE TOWER IS SHORTENED.  Scaled so its teeth meet the catches, it came
 * out nearly five men tall, and fitting that on the slide left Otis 120
 * units high: too small to read his pose.  A 140 px band is taken out of
 * the middle of the posts (TOWER_CUT), between two brackets and including
 * a third, so the brackets that remain stay evenly spaced.  The posts are
 * plain verticals, so the seam does not show.
 *
 * LINE WEIGHT.  Scaling a part scales its strokes, so the tower (drawn
 * small, scaled up) would carry twice Otis's line.  Every stroke is
 * rescaled at build time so all parts draw at one weight on the slide.
 *
 * Self-contained on purpose: no lecture helper (no G.scene), so the
 * show/hide is done with opacity set here, not with the page-local .o/.in
 * rule, and it cannot be left out by accident.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";
const W = 800, H = 640;          // viewBox
const GROUND = 618;              // floor line

/* crop-pixel anchors, measured on the parts */
const A = {
  tower:  { cx:145, bottom:595, top:7, pulleyY:40, teethL:67, teethR:223 },
  plat:   { "plat-folded":{cx:119}, "plat-out":{cx:139},
            barTop:9, railTop:141, floor:230, bottom:254 },
  otis:   { "otis-a":{cx:103, feet:299}, "otis-b":{cx:64, feet:412}, "otis-c":{cx:63, feet:375} },
  /* h is the calm group's head-to-feet height, which sets each pair's
     scale: the right group is a separate, larger drawing (crowd-r-v3) */
  crowd:  { "crowd-l":{cx:169.5, feet:223, h:217}, "crowd-l-alarm":{cx:185, feet:220, h:217},
            "crowd-r":{cx:385, feet:467, h:461},   "crowd-r-alarm":{cx:413, feet:464, h:461} },
  rope:   { rope:{cx:14, top:6}, "rope-upper":{cx:20, bottom:368}, "rope-lower":{cx:19, top:6, bottom:107} }
};

/* the three decisions, as scales (svg units per crop pixel) */
const OTIS = 160 / 293;          // Otis stands 160 units tall
const PLAT = OTIS * 1.65;        // railing (76 px) lands at Otis's hip
const TOWER = PLAT * 228 / (A.tower.teethR - A.tower.teethL);   // teeth 228 platform px apart
const CROWD = OTIS * 1.15 * 293;  // a man in the crowd, hat included, is 1.15 Otis: units per crowd height
const ROPE = 0.62;               // rope reads about 10 units thick
const STROKE = 2.2;              // every outline, in svg units, whatever its part's scale

/* where things go */
const CX = 400;
const TOWER_CUT = [150, 290];                          // crop rows taken out of the posts
const CUT_H = (TOWER_CUT[1] - TOWER_CUT[0]) * TOWER;
const TOWER_Y = GROUND - A.tower.bottom * TOWER + CUT_H;   // where the TOP piece's crop origin sits
const PULLEY_Y = TOWER_Y + A.tower.pulleyY * TOWER;
const PLAT_Y = 182;                                    // top of the platform crop
const BAR_Y = PLAT_Y + A.plat.barTop * PLAT;           // where the rope ties on
const FEET_Y = PLAT_Y + A.plat.floor * PLAT;
const OTIS_X = CX + 22;                                // a little right, so the axe meets the rope
const DROP = 9;                                        // how far it falls before the catches hold
const CUT_GAP = 12;
const STUB = 30;               // the cut end left on the crossbar: where the axe is

function el(name, attrs, parent){
  const e = document.createElementNS(NS, name);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}

/* One part: underlay + line art, in its crop pixels, its strokes rescaled
   so they draw at STROKE on the slide. */
function part(name, scale){
  const p = window.ART.otis[name];
  const g = el("g", {});
  g.innerHTML = p.under + p.g;
  const k = STROKE / (p.line * scale);       // p.line: its sheet's outline weight, in crop px
  g.querySelectorAll("[stroke-width]").forEach(function(n){
    n.setAttribute("stroke-width", (parseFloat(n.getAttribute("stroke-width")) * k).toFixed(2));
  });
  return g;
}

function place(g, x, y, s){
  g.setAttribute("transform", "translate(" + x.toFixed(2) + " " + y.toFixed(2) + ") scale(" +
    s.toFixed(4) + ")");
}

const STEPS = [
  /* The source note's opening sentences, up to "goes beyond this.", stay
     on the amber Demonstation card before this slide: they are about its
     two bullets.  The note resumes here, verbatim, at "The image here". */
  { note:"The image here is of Otis, of elevator fame, who was demonstrating their new safety system that involved a mechanism that locked the elevator car in place if the hoisting ropes fail.",
    desc:"Elisha Otis stands on an open elevator platform raised high in a timber hoist tower, one arm held out as if introducing it. A single red rope runs from a pulley at the top of the tower down to the platform's crossbar. Each tower post carries a rail of amber saw teeth, and at each end of the crossbar an amber catch is folded down, clear of the teeth." },
  { note:"He gathered a crowd of people around as he stood on the elevator platform,",
    desc:"A crowd in 1850s dress, top hats and bonnets, gathers at the foot of the tower on both sides, looking up at Otis." },
  { note:"and then he cut the rope.",
    desc:"Otis swings an axe and cuts the rope. The cut ends fly apart, the platform drops a hair's breadth, and both amber catches swing out sideways into the saw teeth on the rails. The crowd flinches, hands up, one covering their eyes." },
  { note:"Instead of plunging to his death, the safety mechanism kicked in. Now, he could have instead written a report that quantified the load capacity of the breaking mechanism, shown statistics on its rate of failure under test conditions, or provided simulations of the failure process.  However, for the goals of introducing a product, the more direct demonstration is far more tangible and powerful.  By doing the demo live and in person, he is showing that he is willing to trust his life to the invention, and in the process is inducing emotions of anticipation and foreboding in his audience members minds.  Thus they are paying attention, and when the device does not fail, the memory of the experiment is far more tangible than if they read a report.  This is not to say that the report should not be generated – some people will want a more technical specification about the performance of this device.  However, the report alone is far less compelling than the dramatic demonstration.  Technical reports are only comprehensible to an expert in the subject, and whether the report means the system works well or not is often intangible to a general audience.  However, the demonstration is immediately tangible and communicates exactly what the general audience wants to know:  If I use an Otis elevator, and the rope breaks, I won’t die.",
    desc:"Nothing happens. The platform hangs where it stopped, held by the two catches locked in the rail teeth, with the cut rope dangling from its crossbar. Otis, calm, lifts his top hat to the crowd, who look up again, at ease." }
];

/* the state each click settles to */
const FRAMES = [
  { crowd:0, alarm:0, pose:"otis-a", cut:0, drop:0 },
  { crowd:1, alarm:0, pose:"otis-a", cut:0, drop:0 },
  { crowd:1, alarm:1, pose:"otis-b", cut:1, drop:1 },
  { crowd:1, alarm:0, pose:"otis-c", cut:1, drop:1 }
];

window.Deck.sequence("otis", function(slide){
  const host = slide.querySelector(".otis-stage") || slide;
  const svg = el("svg", { viewBox:"0 0 " + W + " " + H, "aria-hidden":"true",
    preserveAspectRatio:"xMidYMid meet", style:"width:100%;height:100%;display:block" });
  host.appendChild(svg);

  el("rect", { x:0, y:0, width:W, height:H, rx:14, fill:"#ffffff" }, svg);
  el("path", { d:"M28 " + GROUND + "H" + (W - 28), stroke:"#111111", "stroke-width":STROKE,
               "stroke-linecap":"round", fill:"none" }, svg);

  /* rope first: the pulley and crossbar draw over its ends */
  const ropeClip = "otis-rope-clip-" + Math.random().toString(36).slice(2, 8);
  const defs = el("defs", {}, svg);
  const clipRect = el("rect", { x:0, y:PULLEY_Y, width:W, height:0 }, el("clipPath", { id:ropeClip }, defs));
  const ropes = el("g", { "clip-path":"url(#" + ropeClip + ")" }, svg);
  const ropeWhole = part("rope", ROPE); ropes.appendChild(ropeWhole);
  const ropeUp = part("rope-upper", ROPE); ropes.appendChild(ropeUp);
  /* the stub left tied to the crossbar.  Only its frayed top shows: the
     rest would hang down through the open frame of the platform. */
  const stubClip = el("rect", { x:0, y:0, width:W, height:0 }, el("clipPath", { id:ropeClip + "-s" }, defs));
  const ropeLow = part("rope-lower", ROPE);
  el("g", { "clip-path":"url(#" + ropeClip + "-s)" }, svg).appendChild(ropeLow);

  /* the tower in two pieces either side of the band taken out */
  const seam = TOWER_Y + TOWER_CUT[0] * TOWER;
  const towerTop = part("tower", TOWER), towerBot = part("tower", TOWER);
  el("rect", { x:0, y:-50, width:W, height:seam + 50 }, el("clipPath", { id:ropeClip + "-tt" }, defs));
  el("rect", { x:0, y:seam - 0.5, width:W, height:H }, el("clipPath", { id:ropeClip + "-tb" }, defs));
  el("g", { "clip-path":"url(#" + ropeClip + "-tt)" }, svg).appendChild(towerTop);
  el("g", { "clip-path":"url(#" + ropeClip + "-tb)" }, svg).appendChild(towerBot);
  place(towerTop, CX - A.tower.cx * TOWER, TOWER_Y, TOWER);
  place(towerBot, CX - A.tower.cx * TOWER, TOWER_Y - CUT_H, TOWER);

  /* the moving assembly: platform, Otis, the railing in front of his legs */
  const car = el("g", {}, svg);
  const plats = {}, fronts = {};
  ["plat-folded", "plat-out"].forEach(function(n){
    plats[n] = part(n, PLAT); car.appendChild(plats[n]);
    place(plats[n], CX - A.plat[n].cx * PLAT, PLAT_Y, PLAT);
  });
  const poses = {};
  ["otis-a", "otis-b", "otis-c"].forEach(function(n){
    poses[n] = part(n, OTIS); car.appendChild(poses[n]);
    place(poses[n], OTIS_X - A.otis[n].cx * OTIS, FEET_Y - A.otis[n].feet * OTIS, OTIS);
  });
  /* the railing again, clipped to its own band, over Otis's legs */
  const railClip = "otis-rail-clip-" + Math.random().toString(36).slice(2, 8);
  el("rect", { x:0, y:PLAT_Y + A.plat.railTop * PLAT - 1, width:W, height:H },
     el("clipPath", { id:railClip }, defs));
  const railing = el("g", { "clip-path":"url(#" + railClip + ")" }, car);
  ["plat-folded", "plat-out"].forEach(function(n){
    fronts[n] = part(n, PLAT); railing.appendChild(fronts[n]);
    place(fronts[n], CX - A.plat[n].cx * PLAT, PLAT_Y, PLAT);
  });

  /* the crowd: two different groups, the right one drawn facing left.
     (Sheet v2's right group was the left group again; mirrored, it read
     as reflected twins, so it was redrawn.) */
  const crowd = {};
  [["crowd-l", CX - 175], ["crowd-l-alarm", CX - 175],
   ["crowd-r", CX + 175], ["crowd-r-alarm", CX + 175]].forEach(function(c){
    const n = c[0], a = A.crowd[n], s = CROWD / a.h;
    const g = el("g", {}, svg), inner = part(n, s);
    g.appendChild(inner);
    place(inner, c[1] - a.cx * s, GROUND - a.feet * s, s);
    crowd[n] = g;
  });

  /* ---- drawing a state ------------------------------------------ */
  const v = { crowd:0, alarm:0, a:1, b:0, c:0, cut:0, drop:0, catches:0, retract:0 };

  function op(g, x){ g.setAttribute("opacity", Math.max(0, Math.min(1, x)).toFixed(3)); }

  function draw(){
    const dy = v.drop * DROP;
    car.setAttribute("transform", "translate(0 " + dy.toFixed(2) + ")");
    op(plats["plat-folded"], 1 - v.catches); op(fronts["plat-folded"], 1 - v.catches);
    op(plats["plat-out"], v.catches);        op(fronts["plat-out"], v.catches);
    op(poses["otis-a"], v.a); op(poses["otis-b"], v.b); op(poses["otis-c"], v.c);

    /* rope: one piece from the pulley to the crossbar, or two with a gap */
    const bar = BAR_Y + dy;
    const lowTop = bar - STUB;
    stubClip.setAttribute("height", (bar + 1).toFixed(2));
    clipRect.setAttribute("height", Math.max(0, bar - PULLEY_Y + 2).toFixed(2));
    place(ropeWhole, CX - A.rope.rope.cx * ROPE, PULLEY_Y - A.rope.rope.top * ROPE, ROPE);
    const upBottom = lowTop - CUT_GAP - v.retract * 14;   // a short recoil, not gone
    place(ropeUp, CX - A.rope["rope-upper"].cx * ROPE, upBottom - A.rope["rope-upper"].bottom * ROPE, ROPE);
    place(ropeLow, CX - A.rope["rope-lower"].cx * ROPE, lowTop - A.rope["rope-lower"].top * ROPE, ROPE);
    op(ropeWhole, 1 - v.cut); op(ropeUp, v.cut); op(ropeLow, v.cut);

    /* crowd slides in from the sides */
    const off = (1 - v.crowd) * 90;
    crowd["crowd-l"].setAttribute("transform", "translate(" + (-off).toFixed(2) + " 0)");
    crowd["crowd-l-alarm"].setAttribute("transform", "translate(" + (-off).toFixed(2) + " 0)");
    crowd["crowd-r"].setAttribute("transform", "translate(" + off.toFixed(2) + " 0)");
    crowd["crowd-r-alarm"].setAttribute("transform", "translate(" + off.toFixed(2) + " 0)");
    op(crowd["crowd-l"], v.crowd * (1 - v.alarm)); op(crowd["crowd-r"], v.crowd * (1 - v.alarm));
    op(crowd["crowd-l-alarm"], v.crowd * v.alarm); op(crowd["crowd-r-alarm"], v.crowd * v.alarm);
  }

  function settle(f){
    v.crowd = f.crowd; v.alarm = f.alarm;
    v.a = f.pose === "otis-a" ? 1 : 0; v.b = f.pose === "otis-b" ? 1 : 0; v.c = f.pose === "otis-c" ? 1 : 0;
    v.cut = f.cut; v.retract = f.cut; v.drop = f.drop; v.catches = f.drop;
    draw();
  }

  /* ---- tweening --------------------------------------------------- */
  let raf = 0;
  const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  /* tracks: [key, from, to, start ms, duration ms, easing] */
  function play(tracks, done){
    cancelAnimationFrame(raf);
    const t0 = performance.now();
    const end = Math.max.apply(null, tracks.map(t => t[3] + t[4]));
    (function tick(now){
      const t = now - t0;
      tracks.forEach(function(k){
        const u = Math.max(0, Math.min(1, (t - k[3]) / k[4]));
        v[k[0]] = k[1] + (k[2] - k[1]) * (k[5] || ease)(u);
      });
      draw();
      if (t < end) raf = requestAnimationFrame(tick); else done();
    })(t0);
  }

  /* the drop: fast in, a small bounce as the catches take the load */
  const fall = function(u){ return u < 0.6 ? Math.pow(u / 0.6, 2) : 1 + Math.sin((u - 0.6) / 0.4 * Math.PI) * 0.18 * (1 - u); };
  const snap = function(u){ return u < 1 ? 0 : 1; };

  const ENTER = {
    1: [["crowd", 0, 1, 0, 700]],
    2: [["a", 1, 0, 0, 160], ["b", 0, 1, 0, 160],
        ["cut", 0, 1, 420, 1, snap], ["retract", 0, 1, 420, 320],
        ["drop", 0, 1, 420, 260, fall], ["catches", 0, 1, 470, 90],
        ["alarm", 0, 1, 440, 220]],
    3: [["b", 1, 0, 0, 300], ["c", 0, 1, 0, 300], ["alarm", 1, 0, 300, 600]]
  };

  let at = 0;
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  settle(FRAMES[0]);

  return {
    steps: STEPS,
    go: function(i, animated){
      cancelAnimationFrame(raf);
      if (animated && !reduce && i === at + 1 && ENTER[i]){
        settle(FRAMES[at]);
        at = i;
        play(ENTER[i], function(){ settle(FRAMES[i]); });
      } else {
        at = i;
        settle(FRAMES[i]);
      }
    }
  };
});
})();
