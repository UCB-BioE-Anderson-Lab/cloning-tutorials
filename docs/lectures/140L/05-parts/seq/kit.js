/* ------------------------------------------------------------------ *
 * kit.js — the drawing kit this lecture's sequences share.
 *
 * NOT called parts.js, which is what the same file is called in Genome
 * Editing and Chassis.  In those decks the name meant "the shared
 * pieces".  In a lecture whose subject is Parts it would mean the other
 * thing on every second line of every file here, so it is kit.js and the
 * inconsistency is deliberate.
 *
 * el / text / rich / scene / run are the proven runtime from those decks
 * and are copied unchanged — they are the contract deck.js renders
 * against, and re-deriving them would be a second answer key.  What is
 * new below is everything this deck draws that those did not: sequence
 * strips, the nodes and arrows of the central dogma, feature blocks on a
 * line, and a measured bar for a part family.
 *
 * Every sequence builds its scene ONCE and then moves opacities, or
 * repaints only the part that changes shape through run().  Rewriting
 * the whole SVG per beat destroys the nodes a CSS transition needs.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";
const C = { ink:"#111111", blue:"#004373", verm:"#ba3a13",
            amber:"#a99011", muted:"#767676", paper:"#ffffff" };

const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);
const pt = (cx, cy, r, a) => [n1(cx + r*Math.cos(a*Math.PI/180)),
                              n1(cy + r*Math.sin(a*Math.PI/180))];

function el(name, at, txt){
  const e = document.createElementNS(NS, name);
  for (const k in at) e.setAttribute(k, at[k]);
  if (txt != null) e.textContent = txt;
  return e;
}
function text(x, y, s, size, col, weight, anchor){
  return el("text", {x:x, y:y, "font-size":size, fill:col,
    "font-weight":weight || 400, "text-anchor":anchor || "middle"}, s);
}
/* An italic species or gene name inside an SVG <text>.  el() sets
   textContent, so <em> in a string arrives as four literal characters;
   only rich() understands markup and it only runs on the caption bars.
   Anything italic in the drawing itself is built from tspans. */
function mixed(x, y, runs, size, col, weight, anchor){
  const t = el("text", {x:x, y:y, "font-size":size, fill:col,
    "font-weight":weight || 400, "text-anchor":anchor || "middle"});
  runs.forEach(function(r){
    const a = {};
    if (r[1]) a["font-style"] = "italic";
    if (r[2]) a.fill = r[2];
    t.appendChild(el("tspan", a, r[0]));
  });
  return t;
}
function grp(o){ return el("g", {opacity:n1(cl(o == null ? 1 : o, 0, 1))}); }
function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 2.6,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return el("path", a);
}

/* ---------------------------------------------------------------- *
 * ARROWHEADS ARE PATHS, NEVER MARKERS.  A marker id has to be unique
 * across the whole deck, and hidden slides stay in the DOM, so two
 * sequences that both define "arrow" silently share the first one and
 * the second slide's arrows come out headless.  AUTHORING.txt lists it
 * under TRAPS; this deck draws a lot of arrows, so it is a helper.
 *
 * Takes the tip and the direction it came from, so a curve can hand in
 * its own tangent rather than assuming a straight line.
 * ---------------------------------------------------------------- */
function head(x, y, ang, col, k, wdt){
  const a = ang*Math.PI/180, kk = k || 15, ww = wdt == null ? 8 : wdt;
  const ux = Math.cos(a), uy = Math.sin(a);
  const bx = x - ux*kk, by = y - uy*kk;
  return el("path", {d:"M"+n1(x)+" "+n1(y)+
    "L"+n1(bx - uy*ww)+" "+n1(by + ux*ww)+
    "L"+n1(bx + uy*ww)+" "+n1(by - ux*ww)+"Z",
    fill:col, stroke:"none"});
}
/* A straight arrow between two points, shortened at both ends so it
   touches neither box it connects. */
function arrow(p0, p1, col, w, gap0, gap1, dash){
  const g = el("g", {});
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1];
  const m = Math.sqrt(dx*dx + dy*dy) || 1, ux = dx/m, uy = dy/m;
  const a0 = [p0[0] + ux*(gap0 || 0), p0[1] + uy*(gap0 || 0)];
  const a1 = [p1[0] - ux*(gap1 || 0), p1[1] - uy*(gap1 || 0)];
  const tip = [a1[0] - ux*2, a1[1] - uy*2];
  g.appendChild(path("M"+n1(a0[0])+" "+n1(a0[1])+"L"+n1(a1[0] - ux*13)+" "+
    n1(a1[1] - uy*13), col, w || 3, dash));
  g.appendChild(head(tip[0], tip[1], Math.atan2(uy, ux)*180/Math.PI, col));
  return g;
}

/* ---------------------------------------------------------------- *
 * A SEQUENCE STRIP.  Monospaced bases with named stretches coloured and
 * optionally labelled underneath, which is the one picture the opening
 * section keeps coming back to: the same letters read as one part, or
 * three, or none, depending on what you mean to reuse.
 *
 * The x advance is measured, not assumed.  A <text> per base would let
 * SVG place each glyph, but 200 of them per frame is 200 nodes to
 * rebuild every tick; one <text> with a letter-spacing does not give a
 * usable per-base x for the brackets underneath.  So: one tspan per
 * stretch, and CH below is the advance of the deck's monospace at
 * size 1, measured once at 20px and divided.
 * ---------------------------------------------------------------- */
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";
const CH = 0.6;                       /* advance per char, in em       */
function seqStrip(x, y, spans, size){
  const g = el("g", {}), w = size*CH;
  let cx = x;
  spans.forEach(function(s){
    g.appendChild(el("text", {x:n1(cx), y:y, "font-size":size,
      "font-family":MONO, fill:s.col || C.muted,
      "font-weight":s.col && s.col !== C.muted ? 700 : 400,
      "text-anchor":"start", "letter-spacing":0}, s.s));
    cx += s.s.length*w;
  });
  return g;
}
function seqWidth(spans, size){
  let n = 0; spans.forEach(s => n += s.s.length);
  return n*size*CH;
}
/* A brace under a stretch of the strip, with its name.  Depth is how far
   below the baseline, so two of them can stack without colliding. */
function brace(x0, x1, y, label, col, depth, size){
  const g = el("g", {}), d = depth || 16, mx = (x0 + x1)/2;
  g.appendChild(path("M"+n1(x0)+" "+n1(y)+"v"+d+"H"+n1(x1)+"v"+(-d), col, 2.4));
  if (label) g.appendChild(text(mx, y + d + (size || 24) + 2, label,
                                size || 24, col, 700));
  return g;
}

/* ---------------------------------------------------------------- *
 * A FEATURE ON A LINE.  Paper first: the line runs underneath and a
 * 14 percent fill does not hide it, so without the white rect every
 * label gets a rule straight through it.  Copied from the Chassis kit
 * because it is the same object; the arrow variant is new, for the
 * slides where a CDS's direction is the point.
 * ---------------------------------------------------------------- */
function feat(x, y, w, label, col, h, size){
  const g = el("g", {}), hh = h || 30;
  g.appendChild(el("rect", {x:x, y:y - hh/2, width:w, height:hh, rx:4,
    fill:C.paper, stroke:"none"}));
  g.appendChild(el("rect", {x:x, y:y - hh/2, width:w, height:hh, rx:4,
    fill:col, "fill-opacity":".14", stroke:col, "stroke-width":2.5}));
  g.appendChild(text(x + w/2, y + (size || 24)*0.37, label, size || 24, col, 700));
  return g;
}
/* Same, cut to a point at the right-hand end.  For a CDS or a promoter,
   where which way it reads is load-bearing. */
function featArrow(x, y, w, label, col, h, size){
  const g = el("g", {}), hh = h || 30, k = Math.min(20, w*0.3);
  const d = "M"+n1(x)+" "+n1(y - hh/2)+"H"+n1(x + w - k)+
            "L"+n1(x + w)+" "+n1(y)+"L"+n1(x + w - k)+" "+n1(y + hh/2)+
            "H"+n1(x)+"Z";
  g.appendChild(el("path", {d:d, fill:C.paper, stroke:"none"}));
  g.appendChild(el("path", {d:d, fill:col, "fill-opacity":".14",
    stroke:col, "stroke-width":2.5}));
  g.appendChild(text(x + (w - k)/2, y + (size || 24)*0.37, label,
                     size || 24, col, 700));
  return g;
}
function dna(x0, x1, y, col, w){
  return path("M"+n1(x0)+" "+n1(y)+"H"+n1(x1), col || C.ink, w || 3.5);
}

/* ---------------------------------------------------------------- *
 * A NODE of the central dogma: a rounded box with a molecule name.  The
 * three encoded levels take a colour; metabolites are muted on purpose
 * and the animation says why, because you cannot write a part that IS a
 * metabolite — you write the enzyme that makes it.
 * ---------------------------------------------------------------- */
function node(cx, cy, w, h, label, col, sub){
  const g = el("g", {});
  g.appendChild(el("rect", {x:n1(cx - w/2), y:n1(cy - h/2), width:w, height:h,
    rx:10, fill:C.paper, stroke:"none"}));
  g.appendChild(el("rect", {x:n1(cx - w/2), y:n1(cy - h/2), width:w, height:h,
    rx:10, fill:col, "fill-opacity":".13", stroke:col, "stroke-width":3}));
  g.appendChild(text(cx, cy + (sub ? 2 : 12), label, 34, col, 700));
  if (sub) g.appendChild(text(cx, cy + 30, sub, 20, C.muted, 400));
  return g;
}
/* Where the edge of a node lies, on the ray toward another point.  Two
   boxes of different sizes joined centre to centre give arrows that stop
   at different distances from each; this makes every gap the same. */
function edge(cx, cy, w, h, tx, ty, pad){
  const dx = tx - cx, dy = ty - cy, p = pad == null ? 12 : pad;
  const m = Math.max(1e-6, Math.max(Math.abs(dx)/(w/2 + p), Math.abs(dy)/(h/2 + p)));
  return [n1(cx + dx/m), n1(cy + dy/m)];
}

/* ---------------------------------------------------------------- *
 * A MEASURED BAR, for a part family: one row per member, a bar as long
 * as its value, the value printed at the end.  Log by default, because
 * every real family in this lecture spans two or three decades — the
 * carnosine panel is 87-fold and the synonymous GFP library is 250 —
 * and on a linear axis every member but the winner is a stub.
 * ---------------------------------------------------------------- */
function bars(o){
  const g = el("g", {});
  const lo = o.lo, hi = o.hi, lg = v => Math.log(Math.max(v, lo))/Math.LN10;
  const s0 = lg(lo), s1 = lg(hi);
  const px = v => n1(o.x + (o.w)*(lg(v) - s0)/(s1 - s0));
  o.rows.forEach(function(r, i){
    const y = o.y + i*(o.rh || 46), col = r.col || C.blue;
    const u = r.u == null ? 1 : cl(r.u, 0, 1);
    if (r.label) g.appendChild(mixed(o.x - 16, y + 9, r.label, o.size || 23,
                                     col, r.bold ? 700 : 400, "end"));
    if (u > 0.01){
      const w = Math.max(2, px(r.v) - o.x);
      g.appendChild(el("rect", {x:o.x, y:y - 12, width:n1(w*u), height:24, rx:3,
        fill:col, "fill-opacity":".18", stroke:col, "stroke-width":2.4}));
      if (u > 0.92 && r.v != null)
        g.appendChild(text(o.x + w + 12, y + 9, r.txt || String(r.v),
                           o.size || 23, C.muted, 400, "start"));
    }
  });
  return g;
}

/* ---------------------------------------------------------------- *
 * <b> and <em> are HTML, and an SVG <text> is not HTML: assigning them
 * through innerHTML drops the element AND the words inside it, silently.
 * Captions are written with <b> and <em> because that is what every
 * other deck uses, and this turns them into tspans SVG will render.
 * ---------------------------------------------------------------- */
function rich(t){
  return String(t)
    .replace(/<b>/g,  '<tspan font-weight="700">')
    .replace(/<em>/g, '<tspan font-style="italic">')
    .replace(/<\/(?:b|em)>/g, "</tspan>");
}

/* ---------------------------------------------------------------- *
 * Drive a sequence whose scene both fades AND changes shape.  `paint`
 * returns the node for the changing part, keyed off the numbers in each
 * frame's `s`; everything else is scene.show as usual.
 *
 * paint gets TWO arguments: the tweening numbers, and the frame being
 * moved to.  Not everything should ease — a highlight answering "which
 * one am I on" flips halfway through the animation instead of when the
 * click happened.  Anything read off the second argument changes at once.
 *
 * THE KEYS ARE READ OFF THE FRAMES, not passed in.  A key present in one
 * frame and missing from the list used to arrive undefined the moment
 * anything animated, arithmetic on it gave NaN, and the drawing
 * vanished — while the settled frames the auditor walks stayed correct.
 * A key absent from a frame counts as zero there, which is what "nothing
 * of this yet" means everywhere it comes up.
 * ---------------------------------------------------------------- */
function run(api, FR, paint){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
  const keys = [];
  FR.forEach(f => { for (const k in (f.s || {})) if (keys.indexOf(k) < 0) keys.push(k); });
  const state = f => {
    const o = {}; keys.forEach(k => o[k] = (f.s && f.s[k]) || 0); return o;
  };
  let cur = null, raf = null;
  function go(i, animated){
    const f = FR[Math.max(0, Math.min(FR.length - 1, i | 0))];
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    const instant = animated === false || reduce.matches;
    api.show(f.on, f, instant);
    const to = state(f);
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

/* The shell every sequence in this lecture wants: a full-slide SVG, a
   root the .nofx class can hang on, a registry of things that come and
   go, and the two caption lines under the drawing. */
function scene(slide, capY, callY){
  const svg = el("svg", {viewBox:"0 0 1600 900", "aria-hidden":"true",
    style:"position:absolute;inset:0;pointer-events:none",
    "font-family":"Helvetica Neue,Arial,Helvetica,sans-serif"});
  const root = el("g", {});
  svg.appendChild(root);
  const parts = {};
  const dyn = el("g", {});
  const cap  = text(800, capY  || 792, "", 30, C.ink,  700);
  const call = text(800, callY || 834, "", 28, C.verm, 700);

  const api = {
    svg:svg, root:root, parts:parts, dyn:dyn,
    add: function(n){ root.appendChild(n); return n; },
    part: function(name, n){
      const g = el("g", {class:"o", "data-o":name});
      g.appendChild(n); root.appendChild(g); parts[name] = g; return g;
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

window.PK = { C:C, n1:n1, cl:cl, pt:pt, el:el, text:text, mixed:mixed,
              grp:grp, path:path, head:head, arrow:arrow,
              seqStrip:seqStrip, seqWidth:seqWidth, brace:brace, MONO:MONO, CH:CH,
              feat:feat, featArrow:featArrow, dna:dna,
              node:node, edge:edge, bars:bars,
              rich:rich, run:run, scene:scene };
})();
