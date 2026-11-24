/* ------------------------------------------------------------------ *
 * anim.js: the drawing shell for animated sequences.  window.DeckArt.
 *
 * Load after deck.js and before any seq/*.js that uses it:
 *
 *   <script src="../deck.js"   defer></script>
 *   <script src="../anim.js"   defer></script>
 *   <script src="lecture.js"   defer></script>
 *   <script src="seq/foo.js"   defer></script>
 *
 * WHERE THIS CAME FROM.  The 140L decks grew this contract three times
 * over: 03-genome-editing/seq/parts.js and 04-chassis/seq/parts.js were
 * byte-identical copies, and 05-parts/seq/lib.js was a third that had
 * started to drift.  The contract is the same in all three and is the
 * one here; what those files ALSO hold (plasmids, tubes, polymerases) is
 * subject matter and stays with the deck that draws it.
 *
 * THE CONTRACT
 *
 *   Deck.sequence("name", function(slide){
 *     const A = DeckArt, s = A.scene(slide);
 *     s.part("cell", A.path("M200 400 H1400"));      // comes and goes
 *     s.finish();                                     // captions on top
 *     return A.run(s, FRAMES, function(v, f){         // changes shape
 *       return A.stroke("M200 600 C600 300 1000 900 1400 600", v.draw);
 *     });
 *   });
 *
 *   FRAMES[i] = { on:[names], s:{key:0..1}, cap, call, note, desc, dur }
 *     on    which named parts are visible this beat (they fade)
 *     s     numbers, tweened between beats and handed to paint as v
 *     cap   the caption line under the drawing; call the coloured one
 *     note  narration for this click; desc the visual description
 *     dur   ms for the move INTO this beat (default 1300)
 *
 * EVERY FRAME CARRIES EVERY KEY THAT SHOULD STILL BE ON SCREEN.  A key
 * missing from a frame's s:{} counts as zero, which is what you want for
 * "nothing of this yet" and a silent deletion anywhere else.
 *
 * The fade rule for parts (.o / .o.in) is injected by this file, once.
 * In the 140L decks it lived in each section's own <style> block and a
 * section that forgot it showed every part from the first beat with no
 * error anywhere (AUTHORING.txt, "the show/hide rule").  Here it cannot
 * be forgotten.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";

/* Colours come from the palette's custom properties, so a project that
   re-themes style/palette.css re-themes its drawings too.  Read lazily:
   this file can load before the stylesheet has applied. */
const FALLBACK = { ink:"#111111", blue:"#004373", verm:"#ba3a13",
                   amber:"#a99011", muted:"#767676", rule:"#e2e2e2", paper:"#ffffff" };
const VAR = { ink:"--ink", blue:"--blue", verm:"--vermillion", amber:"--amber",
              muted:"--muted", rule:"--rule", paper:"--paper" };
const C = {};
Object.keys(FALLBACK).forEach(function(k){
  Object.defineProperty(C, k, { enumerable:true, get:function(){
    const v = getComputedStyle(document.documentElement).getPropertyValue(VAR[k]).trim();
    return v || FALLBACK[k];
  }});
});

const n2 = v => Math.round(v*10)/10;
const clamp = (v, a, b) => Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, v));
const lerp = (a, b, t) => a + (b - a)*t;
const pt = (cx, cy, r, a) => [n2(cx + r*Math.cos(a*Math.PI/180)),
                              n2(cy + r*Math.sin(a*Math.PI/180))];
/* the first and second halves of a 0..1 value, each stretched to 0..1:
   two things in one beat, one after the other */
const early = v => clamp((v || 0)*2);
const late  = v => clamp((v || 0)*2 - 1);
/* a 0..1 value restricted to its own window [a, b] of the beat */
const span  = (v, a, b) => clamp(((v || 0) - a)/(b - a));
const ease  = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;

function el(name, at, txt){
  const e = document.createElementNS(NS, name);
  for (const k in at) if (at[k] != null) e.setAttribute(k, at[k]);
  if (txt != null) e.textContent = txt;
  return e;
}
function text(x, y, s, size, col, weight, anchor){
  return el("text", {x:x, y:y, "font-size":size, fill:col || C.ink,
    "font-weight":weight || 400, "text-anchor":anchor || "middle"}, s);
}
function path(d, col, w, dash){
  return el("path", {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 3,
    "stroke-linecap":"round", "stroke-linejoin":"round", "stroke-dasharray":dash});
}
function grp(o, transform){
  return el("g", {opacity: o == null ? null : n2(clamp(o)), transform:transform});
}

/* LINE ART BEING DRAWN.  u in 0..1 is how much of the stroke exists.
   pathLength="1" normalises the path so the dash arithmetic needs no
   measuring.  u of 0 returns an empty group rather than a zero-length
   dash, because a round linecap on a zero-length dash still paints a dot. */
function stroke(d, u, col, w){
  if (u == null) u = 1;
  if (u <= 0) return el("g", {});
  const p = path(d, col, w);
  if (u < 1){
    p.setAttribute("pathLength", "1");
    p.setAttribute("stroke-dasharray", "1 1");
    p.setAttribute("stroke-dashoffset", n2((1 - u)*1000)/1000);
  }
  return p;
}

/* <b> and <em> are HTML and an SVG <text> is not HTML: assigning them
   through innerHTML drops the element AND the words inside it, silently.
   A caption reading "Exo eats 5' ends" came out as "eats 5' ends". */
function rich(t){
  return String(t)
    .replace(/<b>/g,  '<tspan font-weight="700">')
    .replace(/<em>/g, '<tspan font-style="italic">')
    .replace(/<\/(?:b|em)>/g, "</tspan>");
}

function bez(P, t){
  const m = 1 - t;
  return [m*m*m*P[0][0] + 3*m*m*t*P[1][0] + 3*m*t*t*P[2][0] + t*t*t*P[3][0],
          m*m*m*P[0][1] + 3*m*m*t*P[1][1] + 3*m*t*t*P[2][1] + t*t*t*P[3][1]];
}
function bezAng(P, t){
  const m = 1 - t;
  const x = 3*m*m*(P[1][0]-P[0][0]) + 6*m*t*(P[2][0]-P[1][0]) + 3*t*t*(P[3][0]-P[2][0]);
  const y = 3*m*m*(P[1][1]-P[0][1]) + 6*m*t*(P[2][1]-P[1][1]) + 3*t*t*(P[3][1]-P[2][1]);
  return Math.atan2(y, x) * 180/Math.PI;
}

/* ---- the fade rule, once per page -------------------------------- */
function injectStyle(){
  if (document.getElementById("deckart-style")) return;
  const st = document.createElement("style");
  st.id = "deckart-style";
  st.textContent =
    ".slide svg .o{opacity:0;transition:opacity .42s ease}" +
    ".slide svg .o.in{opacity:1}" +
    ".slide svg .nofx .o,.slide svg.nofx .o{transition:none}" +
    "@media (prefers-reduced-motion:reduce){.slide svg .o{transition:none}}";
  document.head.appendChild(st);
}

/* ---- the shell --------------------------------------------------- *
 * A full-slide SVG, a registry of parts that come and go, a layer for
 * what changes shape, and two caption lines on top. */
function scene(slide, capY, callY){
  injectStyle();
  const svg = el("svg", {viewBox:"0 0 1600 900", "aria-hidden":"true",
    style:"position:absolute;inset:0;pointer-events:none",
    "font-family":"Helvetica Neue,Arial,Helvetica,sans-serif"});
  const root = el("g", {});
  svg.appendChild(root);
  const parts = {}, dyn = el("g", {});
  const cap  = text(800, capY  || 792, "", 30, C.ink,  700);
  const call = text(800, callY || 834, "", 28, C.verm, 700);
  const api = {
    svg:svg, root:root, parts:parts, dyn:dyn,
    add: function(node){ root.appendChild(node); return node; },
    part: function(name, node){
      const g = el("g", {class:"o", "data-o":name});
      g.appendChild(node); root.appendChild(g); parts[name] = g; return g;
    },
    /* call last: the captions have to sit on top of the drawing */
    finish: function(){ root.appendChild(dyn);
                        root.appendChild(cap); root.appendChild(call);
                        slide.appendChild(svg); return api; },
    show: function(on, f, animated){
      root.classList.toggle("nofx", animated === false);
      for (const k in parts) parts[k].classList.toggle("in", (on || []).indexOf(k) >= 0);
      cap.innerHTML  = rich((f && f.cap)  || "");
      call.innerHTML = rich((f && f.call) || "");
    }
  };
  return api;
}

/* ---- the driver -------------------------------------------------- *
 * paint(v, f) returns the node for the changing part: v holds the
 * tweened numbers, f is the frame being moved TO.  Anything read off f
 * changes at once instead of easing, which is right for "which step am I
 * on" and wrong for anything that moves.
 *
 * THE KEYS ARE READ OFF THE FRAMES.  They used to be an argument, and a
 * number added to the frames but not to that list went untweened: the
 * settled frames were right, every animated one computed NaN and the
 * drawing vanished, and an audit of settled frames saw nothing. */
function run(api, FR, paint){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const keys = [];
  FR.forEach(f => { for (const k in (f.s || {})) if (keys.indexOf(k) < 0) keys.push(k); });
  const state = f => { const o = {};
    keys.forEach(k => o[k] = (f.s && f.s[k]) || 0); return o; };
  let cur = null, raf = null;
  function go(i, animated){
    const f = FR[Math.max(0, Math.min(FR.length - 1, i | 0))];
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    const instant = animated === false || reduce.matches;
    api.show(f.on, f, instant);
    const to = state(f);
    if (!paint){ cur = to; return; }
    if (!cur || instant){ cur = to; api.dyn.replaceChildren(paint(cur, f)); return; }
    const from = cur, t0 = performance.now(), dur = f.dur || 1300;
    raf = requestAnimationFrame(function step(now){
      const t = Math.min(1, (now - t0)/dur), e = ease(t), st = {};
      keys.forEach(k => st[k] = from[k] + (to[k] - from[k])*e);
      api.dyn.replaceChildren(paint(st, f)); cur = st;
      raf = t < 1 ? requestAnimationFrame(step) : null;
    });
  }
  go(0, false);
  /* one note and one desc per beat: without these deck.js falls back to
     the slide's single <template> and every click reads the same */
  return { steps: FR.map(x => ({note:x.note, desc:x.desc})), go: go };
}

window.DeckArt = { C:C, NS:NS, el:el, text:text, path:path, grp:grp, stroke:stroke,
                   rich:rich, pt:pt, n2:n2, clamp:clamp, lerp:lerp, ease:ease,
                   early:early, late:late, span:span, bez:bez, bezAng:bezAng,
                   scene:scene, run:run };
})();
