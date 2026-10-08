/* ------------------------------------------------------------------ *
 * lib.js — the drawing shell for the Practices deck's sequences.
 *
 * Same scene/run contract as the other decks, so a sequence written for
 * one reads the same here:
 *
 *   const s = PR.scene(slide); ... s.finish();
 *   return PR.run(s, FRAMES, function(v, f){ ... return <g> });
 *
 *   FRAMES[i] = { on:[names], s:{key:0..1}, cap, call, note, desc, dur }
 *
 * EVERY FRAME CARRIES EVERY KEY THAT SHOULD STILL BE ON SCREEN.  A key
 * missing from s:{} counts as zero, which is a silent deletion anywhere
 * but the first beat.  See AUTHORING.txt.
 *
 * What this deck draws is not molecules.  It is processes, money and
 * arguments, so the shapes here are boxes, stacks, rules and bars — and
 * the one thing worth having as a primitive is `step`, a process box
 * that carries a tag saying whether it happens once per patient or once
 * per batch.  That tag is the whole argument of the COGS slide, so it
 * is part of the shape rather than something a caller remembers to add.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const NS = "http://www.w3.org/2000/svg";
const C = { ink:"#111111", blue:"#004373", verm:"#ba3a13", amber:"#a99011",
            muted:"#767676", rule:"#e2e2e2", paper:"#ffffff" };
const n2 = v => Math.round(v*10)/10;

function el(name, at, txt){
  const e = document.createElementNS(NS, name);
  for (const k in at) e.setAttribute(k, at[k]);
  if (txt != null) e.textContent = txt;
  return e;
}
function text(x, y, s, size, col, weight, anchor){
  return el("text", {x:x, y:y, "font-size":size, fill:col || C.ink,
    "font-weight":weight || 400, "text-anchor":anchor || "middle"}, s);
}
function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 3,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return el("path", a);
}
function grp(o){
  return el("g", o == null ? {} : {opacity:n2(Math.max(0, Math.min(1, o)))});
}
/* <b>/<em> are HTML and an SVG <text> is not HTML; assigning them through
   innerHTML drops the element and the words inside it, silently. */
function rich(t){
  return String(t)
    .replace(/<b>/g,  '<tspan font-weight="700">')
    .replace(/<em>/g, '<tspan font-style="italic">')
    .replace(/<\/(?:b|em)>/g, "</tspan>");
}
/* several lines of text from one call, so a caller never has to track a
   running y and get it wrong when a line is added in the middle */
function lines(x, y, arr, size, col, weight, anchor, lh){
  const g = el("g", {});
  arr.forEach((s, i) => g.appendChild(
    text(x, y + i*(lh || size*1.35), s, size, col, weight, anchor)));
  return g;
}
function box(x, y, w, h, col, fill){
  return el("rect", {x:x, y:y, width:w, height:h, rx:12,
    fill:fill || C.paper, stroke:col || C.ink, "stroke-width":2.6});
}
function arrow(xa, ya, xb, yb, col, w){
  const g = el("g", {});
  g.appendChild(path("M" + xa + " " + ya + "L" + xb + " " + yb, col || C.rule, w || 3));
  const a = Math.atan2(yb - ya, xb - xa), L = 13, s = 0.44;
  g.appendChild(path("M" + n2(xb) + " " + n2(yb) +
    "L" + n2(xb - L*Math.cos(a - s)) + " " + n2(yb - L*Math.sin(a - s)) +
    "M" + n2(xb) + " " + n2(yb) +
    "L" + n2(xb - L*Math.cos(a + s)) + " " + n2(yb - L*Math.sin(a + s)),
    col || C.rule, w || 3));
  return g;
}

/* ---- a process step ---------------------------------------------- *
 * The tag is not decoration.  The entire argument of the COGS slide is
 * that one column's boxes are each paid for once per PATIENT and the
 * other's once per BATCH, so the tag belongs to the shape and cannot be
 * left off by accident.  per: "patient" | "batch" | null.             */
function step(x, y, w, h, label, note, per, col){
  const g = el("g", {}), c = col || C.ink;
  g.appendChild(box(x, y, w, h, c));
  /* both lines INSIDE the box: a note hung below the frame lands on the
     next step down and the column turns to mush */
  g.appendChild(text(x + w/2, y + (note ? 28 : h/2 + 8), label, 21, c, 700));
  if (note) g.appendChild(text(x + w/2, y + 52, note, 17, C.muted, 400));
  if (per){
    const t = per === "batch" ? "per batch" : "per patient";
    const tc = per === "batch" ? C.blue : C.verm;
    g.appendChild(el("rect", {x:x + w - 96, y:y - 11, width:88, height:22, rx:11,
      fill:C.paper, stroke:tc, "stroke-width":1.8}));
    g.appendChild(text(x + w - 52, y + 5, t, 14, tc, 700));
  }
  return g;
}

/* ---- a stacked bar, for cost broken into its parts ---------------- */
function stack(x, y, w, parts, scale){
  const g = el("g", {});
  let acc = 0;
  parts.forEach(function(p){
    const h = p.v*scale;
    g.appendChild(el("rect", {x:x, y:n2(y - acc - h), width:w, height:n2(h),
      fill:p.col, "fill-opacity":p.op == null ? 0.82 : p.op,
      stroke:p.col, "stroke-width":1.6}));
    acc += h;
  });
  return g;
}

/* ---- two events inside one tweened beat --------------------------- *
 * Every key tweens over the same transition, so "A then B" inside one
 * beat needs the two halves of it: early() finishes at the midpoint,
 * late() has not started until then.                                  */
const early = v => Math.max(0, Math.min(1, (v || 0)*2));
const late  = v => Math.max(0, Math.min(1, (v || 0)*2 - 1));

/* ---- the shell --------------------------------------------------- */
function scene(slide, capY, callY){
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
    finish: function(){ root.appendChild(dyn);
                        root.appendChild(cap); root.appendChild(call);
                        slide.appendChild(svg); return api; },
    show: function(on, f, animated){
      root.classList.toggle("nofx", animated === false);
      for (const k in parts) parts[k].classList.toggle("in", on.indexOf(k) >= 0);
      cap.innerHTML  = rich((f && f.cap)  || "");
      call.innerHTML = rich((f && f.call) || "");
    }
  };
  return api;
}

function run(api, FR, paint){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
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
    if (!cur || instant){ cur = to; api.dyn.replaceChildren(paint(cur, f)); return; }
    const from = cur, t0 = performance.now(), dur = f.dur || 1200;
    raf = requestAnimationFrame(function step(now){
      const t = Math.min(1, (now - t0)/dur), e = ease(t), st = {};
      keys.forEach(k => st[k] = from[k] + (to[k] - from[k])*e);
      api.dyn.replaceChildren(paint(st, f)); cur = st;
      raf = t < 1 ? requestAnimationFrame(step) : null;
    });
  }
  go(0, false);
  return { steps: FR.map(x => ({note:x.note, desc:x.desc})), go: go };
}

window.PR = { C:C, el:el, text:text, path:path, grp:grp, rich:rich, lines:lines,
              box:box, arrow:arrow, step:step, stack:stack,
              scene:scene, run:run, early:early, late:late };
})();
