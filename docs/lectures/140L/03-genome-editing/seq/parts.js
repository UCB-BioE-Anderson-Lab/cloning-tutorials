/* ------------------------------------------------------------------ *
 * parts.js — the drawing kit this lecture's sequences share.
 *
 * Genome editing is the same picture over and over: a cell, its genome
 * along the floor, and plasmids that arrive, react and are cured.  That
 * picture is drawn in three sections of this deck by four sequences, so
 * it is built once here and they take it from window.GE.
 *
 * Every one of those sequences builds its scene ONCE and then only moves
 * opacities, because nothing in the drawing changes shape: an object is
 * present or it is not.  Rewriting the SVG per beat, which is what the
 * other decks' sequences do, would destroy the nodes a CSS transition
 * needs, so it is not done here.  The cost is that honouring
 * go(i, false) needs the .nofx class, since the transition lives on the
 * element rather than in the file that sets it.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";
const C = { ink:"#111111", blue:"#004373", verm:"#ba3a13",
            amber:"#a99011", muted:"#767676", paper:"#ffffff" };

const n2 = v => Math.round(v*10)/10;
const pt = (cx, cy, r, a) => [n2(cx + r*Math.cos(a*Math.PI/180)),
                              n2(cy + r*Math.sin(a*Math.PI/180))];

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

/* A cell: the box, its genome along the floor, and the word Genome. */
function cell(box, gy, gx0, gx1){
  const g = el("g", {});
  g.appendChild(el("rect", {x:box.x, y:box.y, width:box.w, height:box.h,
    rx:box.r || 54, fill:"none", stroke:C.ink, "stroke-width":3}));
  g.appendChild(el("path", {d:"M"+gx0+" "+gy+"H"+gx1, stroke:C.ink,
    "stroke-width":3.5, fill:"none", "stroke-linecap":"round"}));
  /* below the line and clear of it: at 25px the label's ascender
     reaches ~18px, so anything tighter than that draws it through
     the molecule it is naming. */
  g.appendChild(text(gx0, gy + 42, "Genome", 25, C.muted, 400, "start"));
  return g;
}

/* A plasmid: a ring with its features as arcs, labels outside the ring at
   each arc's midpoint and anchored by which side they fall on, so a label
   never crosses the ring it belongs to. */
function plasmid(cx, cy, r, feats, name){
  const g = el("g", {});
  g.appendChild(el("circle", {cx:cx, cy:cy, r:r, fill:"none",
    stroke:C.muted, "stroke-width":2.5}));
  feats.forEach(function(f){
    const a = pt(cx, cy, r, f.a0), b = pt(cx, cy, r, f.a1);
    const big = Math.abs(f.a1 - f.a0) > 180 ? 1 : 0;
    g.appendChild(el("path", {d:"M"+a[0]+" "+a[1]+"A"+r+" "+r+" 0 "+big+" 1 "+b[0]+" "+b[1],
      fill:"none", stroke:f.col, "stroke-width":11}));
    const m = (f.a0 + f.a1)/2, l = pt(cx, cy, r + 30, m), cs = Math.cos(m*Math.PI/180);
    g.appendChild(text(l[0], l[1] + 8, f.txt, 25, f.col, 700,
      cs > 0.2 ? "start" : cs < -0.2 ? "end" : "middle"));
  });
  if (name) g.appendChild(text(cx, cy + 9, name, 26, C.muted, 400));
  return g;
}

/* A feature sitting on a DNA line.  It lays down paper first: the line
   runs underneath, and a 14 percent fill does not hide it, so without
   this every label gets a rule straight through it. */
function feat(x, y, w, label, col, h){
  const g = el("g", {}), hh = h || 30;
  g.appendChild(el("rect", {x:x, y:y - hh/2, width:w, height:hh, rx:4,
    fill:C.paper, stroke:"none"}));
  g.appendChild(el("rect", {x:x, y:y - hh/2, width:w, height:hh, rx:4,
    fill:col, "fill-opacity":".14", stroke:col, "stroke-width":2.5}));
  g.appendChild(text(x + w/2, y + 9, label, 24, col, 700));
  return g;
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
  const cap  = text(800, capY  || 792, "", 30, C.ink,  700);
  const call = text(800, callY || 834, "", 28, C.verm, 700);

  const api = {
    svg:svg, root:root, parts:parts,
    add: function(node){ root.appendChild(node); return node; },
    part: function(name, node){
      const g = el("g", {class:"o", "data-o":name});
      g.appendChild(node); root.appendChild(g); parts[name] = g; return g;
    },
    /* call last: the captions have to sit on top of the drawing */
    finish: function(){ root.appendChild(cap); root.appendChild(call);
                        slide.appendChild(svg); return api; },
    show: function(on, f, animated){
      root.classList.toggle("nofx", animated === false);
      for (const k in parts) parts[k].classList.toggle("in", on.indexOf(k) >= 0);
      cap.innerHTML  = (f && f.cap)  || "";
      call.innerHTML = (f && f.call) || "";
    }
  };
  return api;
}

window.GE = { C:C, el:el, text:text, pt:pt, cell:cell, plasmid:plasmid,
              feat:feat, scene:scene };
})();
