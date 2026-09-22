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

/* <b> and <em> are HTML, and an SVG <text> is not HTML: assigning them
   through innerHTML drops the element AND the words inside it, silently.
   A caption reading "Exo eats 5' ends" came out as "eats 5' ends" and
   nothing anywhere said so.  Captions are written with <b> and <em>
   because that is what everything else in these decks uses, and this
   turns them into the tspans SVG will actually render. */
function rich(t){
  return String(t)
    .replace(/<b>/g,  '<tspan font-weight="700">')
    .replace(/<em>/g, '<tspan font-style="italic">')
    .replace(/<\/(?:b|em)>/g, "</tspan>");
}

/* ------------------------------------------------------------------ *
 * excision(o) -- Flp taking out what lies between two sites, drawn as
 * one continuous move rather than a cut to the answer.
 *
 * Returns paint(u), u in 0..1:
 *   0 .. 0.8   the piece between the sites bows out, its two ends
 *              converging, until it is a closed loop on the molecule
 *   0.8 .. 1   the loop lets go, drifts off and fades
 *
 * THE LOOP IS A CUBIC, NOT AN ARC OF THE RIGHT LENGTH.  An arc that
 * conserves the DNA's length closes into a circle of circumference d,
 * and d here is about two hundred pixels, so the circle comes out
 * sixty-odd across -- smaller than the marker box riding on it, and the
 * whole thing reads as a fold rather than a loop.  The control points
 * are driven directly instead: at bend 0 they sit at the thirds of a
 * straight segment, so the curve IS the flat molecule and every feature
 * is at its own x; at bend 1 the two feet have met and the controls are
 * splayed, so it is a loop big enough to carry what is on it.
 *
 * o = { y, x0, x1, feats, a, b, dx, h, w }
 *   feats  [x, w, label, colour] in the BEFORE layout
 *   a, b   the span that leaves; features inside it ride the loop
 *   x0,x1  the molecule's own ends, if it has drawn ends.  Omit inside a
 *          cell: a chromosome does not visibly shorten by two hundred
 *          bases, so there only the features slide together.
 *   dx     how far the molecule slides as it contracts, so the finished
 *          thing is still centred where the room was looking
 * ------------------------------------------------------------------ */
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

function excision(o){
  const d = o.b - o.a, RISE = 210;
  /* Wide and low rather than tall and narrow.  A narrow loop puts what
     is riding on it out on the steep flanks, where a feature box comes
     out nearly vertical and its label stops being readable from the back
     of a room.  A broad arch keeps them near the top, where the tangent
     is shallow.  Note that a cubic with its two ends together and its
     controls at plus and minus W is only about 0.29*W across and 0.75*H
     tall, so both numbers are much larger than the loop they draw. */
  const H = o.h || 215, W = o.w || 540;
  return function(u){
    const g = el("g", {});
    const bend = Math.min(u/0.8, 1);
    const away = u <= 0.8 ? 0 : (u - 0.8)/0.2;
    const shift = d*bend, dx = (o.dx || 0) * bend;
    const f0 = o.a + dx, gap = d - shift, f1 = f0 + gap;
    const P = [[f0, o.y],
               [f0 + gap/3 - W*bend, o.y - H*bend],
               [f0 + 2*gap/3 + W*bend, o.y - H*bend],
               [f1, o.y]];

    if (o.x0 != null){
      g.appendChild(el("path", {d:"M"+n2(o.x0 + dx)+" "+o.y+"H"+n2(f0)+
        "M"+n2(f1)+" "+o.y+"H"+n2(o.x1 - shift + dx), stroke:C.ink,
        "stroke-width":3.5, fill:"none", "stroke-linecap":"round"}));
    }

    /* Once the two feet meet, the circle is a SEPARATE MOLECULE, and
       separate molecules are drawn with a visible gap in these decks.
       So it lifts clear of the line as it closes, before it starts to
       drift; without that it reads as a fold still attached at a point. */
    const tt = Math.max(0, Math.min(1, (bend - 0.9)/0.1));
    const lift = 30*tt*tt*(3 - 2*tt) + RISE*away;
    const loop = el("g", {});
    if (lift > 0.4) loop.setAttribute("transform", "translate(0 " + n2(-lift) + ")");
    if (away > 0) loop.setAttribute("opacity", n2(1 - away));
    loop.appendChild(el("path", {d:"M"+n2(P[0][0])+" "+n2(P[0][1])+
      "C"+n2(P[1][0])+" "+n2(P[1][1])+" "+n2(P[2][0])+" "+n2(P[2][1])+
      " "+n2(P[3][0])+" "+n2(P[3][1]),
      stroke:C.ink, "stroke-width":3.5, fill:"none", "stroke-linecap":"round"}));

    o.feats.forEach(function(f){
      const fx = f[0], fw = f[1];
      if (fx + fw <= o.a + 1){            /* left of the loop, stays put  */
        g.appendChild(feat(fx + dx, o.y, fw, f[2], f[3]));
      } else if (fx >= o.b - 1){          /* right of it, slides across   */
        g.appendChild(feat(fx - shift + dx, o.y, fw, f[2], f[3]));
      } else {                            /* inside it, rides the loop    */
        /* and pulled in toward the top of the arch as it closes, for
           the same reason: at the true parameter the outer one ends up
           on the flank */
        const t0 = (fx + fw/2 - o.a)/d;
        const t = 0.5 + (t0 - 0.5)*(1 - 0.34*bend), q = bez(P, t);
        const r = el("g", {transform:"translate(" + n2(q[0]) + " " + n2(q[1]) +
          ") rotate(" + n2(bezAng(P, t)) + ")"});
        r.appendChild(feat(-fw/2, 0, fw, f[2], f[3]));
        loop.appendChild(r);
      }
    });
    g.appendChild(loop);
    return g;
  };
}

/* Drive a sequence whose scene both fades AND changes shape.  `paint`
   returns the node for the changing part, keyed off the numbers in each
   frame's `s`; everything else is scene.show as usual.

   paint gets TWO arguments: the tweening numbers, and the frame being
   moved to.  Not everything on a slide should ease -- a highlight on a
   protocol list is answering "which step am I on", and a tweened index
   flips it halfway through the animation instead of when the click
   happened.  Anything read off the second argument changes at once.

   THE KEYS ARE READ OFF THE FRAMES, not passed in.  They used to be an
   argument, and adding two numbers to a sequence's frames without adding
   them to that list left them untweened: the settled frames were right,
   because those copy the whole object, but the moment anything animated
   the interpolated state was missing them, arithmetic on undefined gave
   NaN, and the drawing vanished.  The auditor walks settled frames, so
   it saw nothing wrong.  Deriving the list here means a frame cannot
   carry a number the driver does not know about.  A key absent from one
   frame and present in another counts as zero there, which is what
   "nothing of this yet" means everywhere it comes up. */
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
    /* A beat can ask for longer.  Most transitions are a single thing
       moving and 1.3s is right; a whole run down a capillary with six
       fragments arriving one at a time is not, and at that speed it is
       over before anyone has seen what it was showing. */
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
  /* things that change SHAPE rather than come and go: redrawn per frame
     by run(), over the fading parts and under the captions */
  const dyn = el("g", {});
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
      for (const k in parts) parts[k].classList.toggle("in", on.indexOf(k) >= 0);
      cap.innerHTML  = rich((f && f.cap)  || "");
      call.innerHTML = rich((f && f.call) || "");
    }
  };
  return api;
}

/* A minimal path helper, local to the glassware. */
function vpath(d, col, w){
  return el("path", {d:d, fill:"none", stroke:col || C.ink,
    "stroke-width":w || 3, "stroke-linecap":"round", "stroke-linejoin":"round"});
}
/* ------------------------------------------------------------------ *
 * REAL GLASSWARE.  JCA: "make the column and tubes more real to aspect
 * ratio and shape.  The collection tube is an open-top tube.  The
 * elution tube is a 1.5 mL eppendorf with a lid hanging off the side."
 *
 * So: one profile function for a conical-bottomed tube, used for the
 * outline and for whatever is in it, and the three vessels differ in
 * what is bolted to the top of it -- a flange and an open lid for an
 * Eppendorf, a bare rim for a collection tube, a wide lip and a frit and
 * a spout for the column.  Proportions are about right: a 1.5 mL tube is
 * roughly four times as tall as it is wide, and the old ones were less
 * than twice.
 * ------------------------------------------------------------------ */
/* Where the straight wall gives out.  This is the whole visual
   difference between the two tubes on the bench: a 1.5 mL tapers for the
   bottom third, a 2.0 mL runs straight almost to the floor and then
   turns a short blunt cone.  Every helper below takes the value as an
   optional last argument and defaults to the 1.5 mL. */
const CONE = 0.56, CONE20 = 0.80;
function hw(w, h, d, cn){             /* half width at depth d        */
  cn = cn || CONE;
  if (d <= h*cn) return w/2;
  const t = Math.min(1, (d - h*cn)/(h*(0.94 - cn)));
  return w/2 * (1 - 0.62*t);
}
function wallD(x, w, top, h, up, cn){
  const cx = x + w/2, N = 12, sgn = up ? 1 : -1;
  let d = "";
  for (let i = 0; i <= N; i++){
    const dd = h*0.94*(up ? N - i : i)/N;
    d += "L" + n2(cx + sgn*hw(w, h, dd, cn)) + " " + n2(top + dd);
  }
  return d;
}
function tubeOutline(x, w, top, h, cn){
  const cx = x + w/2;
  return "M" + n2(cx - w/2) + " " + top + wallD(x, w, top, h, false, cn) +
         "Q" + n2(cx) + " " + n2(top + h) + " " + n2(cx + hw(w, h, h*0.94, cn)) +
         " " + n2(top + h*0.94) + wallD(x, w, top, h, true, cn);
}
function tubeFill(x, w, top, h, L, cn){
  const cx = x + w/2, N = 12, dL = Math.max(0, Math.min(h*0.9, L - top));
  let d = "M" + n2(cx - hw(w, h, dL, cn)) + " " + n2(top + dL) +
          "Q" + n2(cx) + " " + n2(top + dL + 12) + " " +
          n2(cx + hw(w, h, dL, cn)) + " " + n2(top + dL);
  for (let i = 0; i <= N; i++){
    const dd = dL + (h*0.94 - dL)*i/N;
    d += "L" + n2(cx + hw(w, h, dd, cn)) + " " + n2(top + dd);
  }
  d += "Q" + n2(cx) + " " + n2(top + h) + " " + n2(cx - hw(w, h, h*0.94, cn)) +
       " " + n2(top + h*0.94);
  for (let i = N; i >= 0; i--){
    const dd = dL + (h*0.94 - dL)*i/N;
    d += "L" + n2(cx - hw(w, h, dd, cn)) + " " + n2(top + dd);
  }
  return d + "Z";
}
function contents(x, w, top, h, L, col, op, cn){
  const g = el("g", {});
  g.appendChild(el("path", {d:tubeFill(x, w, top, h, L, cn), fill:col,
    "fill-opacity":op == null ? ".13" : op, stroke:"none"}));
  const cx = x + w/2, dL = Math.max(0, Math.min(h*0.9, L - top));
  g.appendChild(vpath("M" + n2(cx - hw(w, h, dL, cn)) + " " + n2(top + dL) +
    "Q" + n2(cx) + " " + n2(top + dL + 12) + " " + n2(cx + hw(w, h, dL, cn)) +
    " " + n2(top + dL), C.muted, 2));
  return g;
}
/* A part of the wall, between two depths.  wallD always runs the whole
   way from the rim, which is what put a band of pellet colour up both
   sides of the tube: the pellet was tracing the entire wall and then
   cutting straight across, so everything above the cut was filled too. */
function wallSeg(x, w, top, h, d0, d1, side, cn){
  const cx = x + w/2, N = 8;
  let d = "";
  for (let i = 0; i <= N; i++){
    const dd = d0 + (d1 - d0)*i/N;
    d += "L" + n2(cx + side*hw(w, h, dd, cn)) + " " + n2(top + dd);
  }
  return d;
}
/* whatever has gone to the bottom, sitting in the cone */
function pellet(x, w, top, h, col, op, cn){
  const cx = x + w/2, d0 = h*((cn || CONE) - 0.02), d1 = h*0.94;
  return el("path", {d:"M" + n2(cx - hw(w, h, d0, cn)) + " " + n2(top + d0) +
    wallSeg(x, w, top, h, d0, d1, -1, cn) +
    "Q" + n2(cx) + " " + n2(top + h) + " " + n2(cx + hw(w, h, d1, cn)) + " " + n2(top + d1) +
    wallSeg(x, w, top, h, d1, d0, 1, cn) + "Z",
    fill:col, "fill-opacity":op || ".7", stroke:"none"});
}
/* an Eppendorf: a flange, and the lid hanging open off the side */
function eppy(x, w, top, h, cn){
  const g = el("g", {});
  g.appendChild(vpath(tubeOutline(x, w, top, h, cn)));
  g.appendChild(el("rect", {x:x-8, y:top-13, width:w+16, height:13, rx:3,
    fill:"none", stroke:C.ink, "stroke-width":2.6}));
  /* An open Eppendorf lid is a flat disc lying almost edge-on at about
     rim height, with a squat plug standing on it, on a short flat strap.
     It was a small ring floating up and to the right, a third of the
     diameter of the mouth it is supposed to close. */
  const hx = x + w + 8;
  const rx = w*0.56, ry = w*0.155, th = w*0.075;
  const lx = hx + 14 + rx, ly = top - 4;
  g.appendChild(vpath("M"+n2(hx)+" "+n2(top-11)+
    "Q"+n2(hx+18)+" "+n2(top-14)+" "+n2(lx - rx*0.92)+" "+n2(ly-6)+
    "L"+n2(lx - rx*0.92)+" "+n2(ly+3)+
    "Q"+n2(hx+18)+" "+n2(top-3)+" "+n2(hx)+" "+n2(top-2)+"Z",
    C.ink, 2.2));
  g.appendChild(vpath("M"+n2(lx-rx)+" "+n2(ly)+"v"+n2(th)+
    "A"+n2(rx)+" "+n2(ry)+" 0 0 0 "+n2(lx+rx)+" "+n2(ly+th)+"v"+n2(-th),
    C.ink, 2.6));
  g.appendChild(el("ellipse", {cx:n2(lx), cy:n2(ly), rx:n2(rx), ry:n2(ry),
    fill:"none", stroke:C.ink, "stroke-width":2.6}));
  const px = lx - rx*0.10, py = ly - w*0.02;
  const prx = w*0.36, pry = w*0.10, ph = w*0.21;
  g.appendChild(vpath("M"+n2(px-prx)+" "+n2(py-ph)+"v"+n2(ph)+
    "A"+n2(prx)+" "+n2(pry)+" 0 0 0 "+n2(px+prx)+" "+n2(py)+"v"+n2(-ph),
    C.ink, 2.6));
  g.appendChild(el("ellipse", {cx:n2(px), cy:n2(py-ph), rx:n2(prx),
    ry:n2(pry), fill:"none", stroke:C.ink, "stroke-width":2.6}));
  return g;
}
/* a collection tube: the same body, open at the top, no lid */
function openTube(x, w, top, h, cn){
  const g = el("g", {});
  g.appendChild(vpath(tubeOutline(x, w, top, h, cn)));
  g.appendChild(vpath("M"+(x-6)+" "+top+"h12M"+(x+w-6)+" "+top+"h12", C.ink, 2.6));
  return g;
}

/* Put something inside a tube's liquid, given a position in -1..1 on
   each axis.  The horizontal room runs out in the cone, so the width is
   taken at that actual depth rather than assumed: scattering by a fixed
   fraction of the tube's width either bunches everything in the middle
   or pokes it through the wall near the tip. */
function inLiquid(x, w, top, h, lvl, fx, fy, pad, cn){
  const yTop = lvl + 26, yBot = top + h*0.86;
  const y = yTop + (yBot - yTop)*(fy*0.5 + 0.5);
  const half = hw(w, h, y - top, cn) - pad;
  return half <= 6 ? null : [x + w/2 + fx*half, y];
}


window.GE = { C:C, el:el, text:text, pt:pt, cell:cell, plasmid:plasmid,
              feat:feat, scene:scene, excision:excision, run:run,
              V:{ CONE:CONE, CONE20:CONE20, hw:hw, tubeOutline:tubeOutline,
                  tubeFill:tubeFill, contents:contents, wallSeg:wallSeg,
                  pellet:pellet, eppy:eppy, openTube:openTube, inLiquid:inLiquid } };
})();
