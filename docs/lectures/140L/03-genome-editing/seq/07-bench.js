/* ------------------------------------------------------------------ *
 * 07-bench.js — the miniprep, run rather than listed.
 *
 * JCA: "ditch this slide as a standalone... instead, have that repeated
 * on each of the animation slides of the procedure highlighting in red
 * which step you are on.  I think you need to illustrate more what's
 * going on in each step, in terms of what is in the wash liquid, what is
 * in the container below, and visually showing at all times where the
 * dna is."
 *
 * So the protocol is not a slide any more, it is the left-hand column of
 * every beat, with the line you are on in red.  The room can still read
 * the recipe -- volumes, buffer names, what is in each buffer -- while
 * watching the thing it describes happen.
 *
 * AND THE BLUE NEVER LEAVES THE SCREEN.  Blue is the plasmid, the same
 * blue as everywhere else in this lecture, and at every single beat it
 * is somewhere you can point at: inside the cells, then free in the
 * lysate, then on the frit, then in the tube you elute into.  That is
 * the thread the whole procedure is about, and a list cannot draw it.
 *
 * Geometry tweens, so both sequences use G.run and the dyn group.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;

const n1 = v => Math.round(v*10)/10;
const S = 3;

function path(d, col, w, dash, op){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || S,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  if (op != null) a.opacity = op;
  return G.el("path", a);
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
    d += "L" + n1(cx + sgn*hw(w, h, dd, cn)) + " " + n1(top + dd);
  }
  return d;
}
function tubeOutline(x, w, top, h, cn){
  const cx = x + w/2;
  return "M" + n1(cx - w/2) + " " + top + wallD(x, w, top, h, false, cn) +
         "Q" + n1(cx) + " " + n1(top + h) + " " + n1(cx + hw(w, h, h*0.94, cn)) +
         " " + n1(top + h*0.94) + wallD(x, w, top, h, true, cn);
}
function tubeFill(x, w, top, h, L, cn){
  const cx = x + w/2, N = 12, dL = Math.max(0, Math.min(h*0.9, L - top));
  let d = "M" + n1(cx - hw(w, h, dL, cn)) + " " + n1(top + dL) +
          "Q" + n1(cx) + " " + n1(top + dL + 12) + " " +
          n1(cx + hw(w, h, dL, cn)) + " " + n1(top + dL);
  for (let i = 0; i <= N; i++){
    const dd = dL + (h*0.94 - dL)*i/N;
    d += "L" + n1(cx + hw(w, h, dd, cn)) + " " + n1(top + dd);
  }
  d += "Q" + n1(cx) + " " + n1(top + h) + " " + n1(cx - hw(w, h, h*0.94, cn)) +
       " " + n1(top + h*0.94);
  for (let i = N; i >= 0; i--){
    const dd = dL + (h*0.94 - dL)*i/N;
    d += "L" + n1(cx - hw(w, h, dd, cn)) + " " + n1(top + dd);
  }
  return d + "Z";
}
function contents(x, w, top, h, L, col, op, cn){
  const g = G.el("g", {});
  g.appendChild(G.el("path", {d:tubeFill(x, w, top, h, L, cn), fill:col,
    "fill-opacity":op == null ? ".13" : op, stroke:"none"}));
  const cx = x + w/2, dL = Math.max(0, Math.min(h*0.9, L - top));
  g.appendChild(path("M" + n1(cx - hw(w, h, dL, cn)) + " " + n1(top + dL) +
    "Q" + n1(cx) + " " + n1(top + dL + 12) + " " + n1(cx + hw(w, h, dL, cn)) +
    " " + n1(top + dL), C.muted, 2));
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
    d += "L" + n1(cx + side*hw(w, h, dd, cn)) + " " + n1(top + dd);
  }
  return d;
}
/* whatever has gone to the bottom, sitting in the cone */
function pellet(x, w, top, h, col, op, cn){
  const cx = x + w/2, d0 = h*((cn || CONE) - 0.02), d1 = h*0.94;
  return G.el("path", {d:"M" + n1(cx - hw(w, h, d0, cn)) + " " + n1(top + d0) +
    wallSeg(x, w, top, h, d0, d1, -1, cn) +
    "Q" + n1(cx) + " " + n1(top + h) + " " + n1(cx + hw(w, h, d1, cn)) + " " + n1(top + d1) +
    wallSeg(x, w, top, h, d1, d0, 1, cn) + "Z",
    fill:col, "fill-opacity":op || ".7", stroke:"none"});
}
/* an Eppendorf: a flange, and the lid hanging open off the side */
function eppy(x, w, top, h, cn){
  const g = G.el("g", {});
  g.appendChild(path(tubeOutline(x, w, top, h, cn)));
  g.appendChild(G.el("rect", {x:x-8, y:top-13, width:w+16, height:13, rx:3,
    fill:"none", stroke:C.ink, "stroke-width":2.6}));
  /* An open Eppendorf lid is a flat disc lying almost edge-on at about
     rim height, with a squat plug standing on it, on a short flat strap.
     It was a small ring floating up and to the right, a third of the
     diameter of the mouth it is supposed to close. */
  const hx = x + w + 8;
  const rx = w*0.56, ry = w*0.155, th = w*0.075;
  const lx = hx + 14 + rx, ly = top - 4;
  g.appendChild(path("M"+n1(hx)+" "+n1(top-11)+
    "Q"+n1(hx+18)+" "+n1(top-14)+" "+n1(lx - rx*0.92)+" "+n1(ly-6)+
    "L"+n1(lx - rx*0.92)+" "+n1(ly+3)+
    "Q"+n1(hx+18)+" "+n1(top-3)+" "+n1(hx)+" "+n1(top-2)+"Z",
    C.ink, 2.2));
  g.appendChild(path("M"+n1(lx-rx)+" "+n1(ly)+"v"+n1(th)+
    "A"+n1(rx)+" "+n1(ry)+" 0 0 0 "+n1(lx+rx)+" "+n1(ly+th)+"v"+n1(-th),
    C.ink, 2.6));
  g.appendChild(G.el("ellipse", {cx:n1(lx), cy:n1(ly), rx:n1(rx), ry:n1(ry),
    fill:"none", stroke:C.ink, "stroke-width":2.6}));
  const px = lx - rx*0.10, py = ly - w*0.02;
  const prx = w*0.36, pry = w*0.10, ph = w*0.21;
  g.appendChild(path("M"+n1(px-prx)+" "+n1(py-ph)+"v"+n1(ph)+
    "A"+n1(prx)+" "+n1(pry)+" 0 0 0 "+n1(px+prx)+" "+n1(py)+"v"+n1(-ph),
    C.ink, 2.6));
  g.appendChild(G.el("ellipse", {cx:n1(px), cy:n1(py-ph), rx:n1(prx),
    ry:n1(pry), fill:"none", stroke:C.ink, "stroke-width":2.6}));
  return g;
}
/* a collection tube: the same body, open at the top, no lid */
function openTube(x, w, top, h, cn){
  const g = G.el("g", {});
  g.appendChild(path(tubeOutline(x, w, top, h, cn)));
  g.appendChild(path("M"+(x-6)+" "+top+"h12M"+(x+w-6)+" "+top+"h12", C.ink, 2.6));
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

/* The plasmid, wherever it currently is: a small double ring. */
function ring(cx, cy, r){
  const g = G.el("g", {});
  [r, r - 4.5].forEach(rr => g.appendChild(G.el("circle", {cx:n1(cx), cy:n1(cy),
    r:n1(rr), fill:"none", stroke:C.blue, "stroke-width":2.4})));
  return g;
}
/* A cell, with its plasmid inside it. */
function cellAt(cx, cy, o){
  const g = G.el("g", {opacity:n1(o)});
  g.appendChild(G.el("rect", {x:n1(cx-22), y:n1(cy-12), width:44, height:24, rx:12,
    fill:C.amber, "fill-opacity":".30", stroke:C.amber, "stroke-width":2}));
  g.appendChild(G.el("circle", {cx:n1(cx), cy:n1(cy), r:7, fill:"none",
    stroke:C.blue, "stroke-width":2.6}));
  return g;
}

/* ------------------------------------------------------------------ *
 * The protocol, down the left, with the step you are on in red.
 * ------------------------------------------------------------------ */
/* One line per step.  The explanation of a step arrives WITH that step,
   trailing it on the same line, rather than sitting under every line at
   once -- ten items each with a subtitle is a wall of grey text, and
   JCA: "the text looks cluttered."  It also means the list can be set
   tight enough to leave the drawing room. */
function steps(items, x, y0, gap){
  return function(active){
    const g = G.el("g", {});
    items.forEach(function(it, i){
      const on = i === active, y = y0 + i*gap;
      if (on) g.appendChild(G.el("rect", {x:x-18, y:y-30, width:640, height:gap-4,
        rx:6, fill:C.verm, "fill-opacity":".08", stroke:"none"}));
      const t = G.el("text", {x:x, y:y, "font-size":26,
        fill:on ? C.verm : C.muted, "text-anchor":"start"});
      t.appendChild(G.el("tspan", {"font-weight":on ? 700 : 400}, it[0]));
      if (on && it[1]) t.appendChild(G.el("tspan",
        {"font-weight":400, "font-size":22, "fill-opacity":".85"}, "   \u2014   " + it[1]));
      g.appendChild(t);
    });
    return g;
  };
}

/* ================================================================== *
 * 1.  lysisrun — the tube half
 * ================================================================== */
const LX = 1096, LW = 136, LTOP = 214, LH = 508;     /* a 2.0 mL Eppendorf */
const LIST1 = steps([
  ["Fill a 2 mL tube with saturated culture", ""],
  ["Spin 1 min, toss the supernatant", ""],
  ["Resuspend in 250 µL P1", "Tris, EDTA, RNase A"],
  ["Lyse with 250 µL P2", "NaOH, SDS"],
  ["Neutralize with 350 µL N3", "guanidinium chloride, acetate"],
  ["Spin 5 min", ""]
], 130, 286, 68);

/* -1..1 on each axis, so the same scatter works whatever the liquid
   level is and whatever the tube is doing at that depth */
const CELLS = [[-.85,-.74],[.06,-.97],[.83,-.64],[-.46,-.27],[.54,-.17],[-1,.2],
               [.25,.32],[.98,.08],[-.31,.56],[.64,.7],[-.9,.84],[.1,1]];

const LFR = [
  { s:{step:0, lvl:1, cells:1, cpel:0, free:0, floc:0, ppel:0}, on:["t0"],
    cap:"a saturated overnight, and the plasmid is inside the cells",
    call:"blue is the plasmid &#183; watch where it is on every step from here",
    note:"Two millilitres of a saturated overnight. Every one of those cells has some tens of copies of your plasmid in it, and that is the blue. Keep an eye on the blue for the rest of this: it is inside the cells now, it will be loose in the lysate in three steps, then stuck to a piece of silica, and finally in a tube on its own. The whole procedure is just moving it between those places.",
    desc:"A two millilitre tube full of turbid culture. Cells are drawn as small grey capsules suspended in it, each with a blue ring inside it: the plasmid." },

  { s:{step:1, lvl:1, cells:0, cpel:1, free:0, floc:0, ppel:0}, on:["t1"],
    cap:"spin one minute &#183; the cells go to the bottom",
    call:"the blue went down with them &#183; now tip the medium off",
    note:"One minute is plenty. Watch what moves and what does not: the cells go to the bottom and the liquid stays exactly where it was. Only then do you pour the medium off. Nothing has been done to the DNA yet. It is still inside the cells, and the cells are now at the bottom of the tube.",
    desc:"The liquid has not moved. The cells have gone to the bottom of the tube as a grey pellet, still carrying the blue plasmid." },

  { s:{step:2, lvl:0.5, cells:1, cpel:0, free:0, floc:0, ppel:0}, on:["t2"],
    cap:"<b>P1</b> &#183; resuspend the pellet, 250 &micro;L",
    call:"Tris to buffer it, EDTA to stop nucleases, RNase to deal with the RNA",
    note:"P1 is buffer with RNase in it. The EDTA chelates magnesium so that any nuclease that gets loose cannot work, and the RNase is there because you are about to release an enormous amount of RNA that would otherwise come all the way through the prep with you. Resuspend properly: if there are clumps of cells left, P2 will not reach them and you have simply thrown that fraction away. The cells are whole again and the blue is still in them.",
    desc:"The pellet has been resuspended in P1. The cells are suspended in the liquid again, each still carrying its blue plasmid." },

  { s:{step:3, lvl:0.72, cells:0, cpel:0, free:1, floc:0, ppel:0}, on:["t3"],
    cap:"<b>P2</b> &#183; lyse and denature, 250 &micro;L",
    call:"the cells burst and the blue is now loose in the liquid &#183; invert, do not vortex",
    note:"P2 is the lysis. SDS dissolves the membranes and denatures protein, and the sodium hydroxide denatures the DNA. The cells are gone, and everything that was in them, your plasmid included, is now loose in the tube. This is the step where the liquid goes clear and viscous, and the step you invert gently rather than vortex, because the chromosome is enormous and you do not want it sheared into pieces small enough to follow the plasmid through the rest of the prep.",
    desc:"The cells have burst. The liquid is clear, and the blue plasmid rings are now loose in it along with grey strands of chromosomal DNA." },

  { s:{step:4, lvl:0.95, cells:0, cpel:0, free:1, floc:1, ppel:0}, on:["t4"],
    cap:"<b>N3</b> &#183; neutralise into high salt, 350 &micro;L",
    call:"everything except the plasmid comes out of solution &#183; the blue stays in",
    note:"N3 drops the pH back and puts the tube into high salt at the same time. The plasmid re-pairs and stays dissolved. Everything else does not: the chromosome, the denatured protein, the cell debris and the detergent all come out of solution together as a white precipitate, which you can watch appear. The blue is still in the liquid.",
    desc:"White flecks of precipitate have appeared throughout the liquid. The blue plasmid rings are still in solution among them." },

  { s:{step:5, lvl:0.95, cells:0, cpel:0, free:1, floc:0, ppel:1}, on:["t5"],
    cap:"spin five minutes, and take the liquid off the top",
    call:"the blue is in the supernatant &#183; that is what goes on the column",
    note:"Five minutes and the precipitate is a firm pellet at the bottom with everything you do not want in it. The supernatant above it is clear and carries your plasmid. That is the cleared lysate, and it is what goes on the column on the next slide. Do not disturb the pellet on the way out of the tube: a bit of it carried over is chromosomal DNA in your prep.",
    desc:"The precipitate has pelleted at the bottom of the tube. The supernatant above it is clear and carries the blue plasmid rings." }
];

window.Deck.sequence("lysisrun", function(slide){
  const s = G.scene(slide, 800, 846);
  const lab = t => G.text(LX + LW/2, 174, t, 25, C.muted, 400);
  s.part("t0", lab("saturated culture"));
  s.part("t1", lab("cell pellet"));
  s.part("t2", lab("resuspended"));
  s.part("t3", lab("lysate"));
  s.part("t4", lab("precipitate forming"));
  s.part("t5", lab("cleared lysate"));
  s.finish();

  function paint(v, f){
    const g = G.el("g", {});
    g.appendChild(LIST1(f.s.step));        /* snaps on the click, not mid-tween */

    const lvl = LTOP + LH*0.9 - (LH*0.9 - 18)*v.lvl;
    if (v.lvl > 0.02)
      g.appendChild(contents(LX, LW, LTOP, LH, lvl,
        v.cells > 0.5 ? C.amber : C.blue, v.cells > 0.5 ? ".13" : ".08", CONE20));
    g.appendChild(eppy(LX, LW, LTOP, LH, CONE20));

    const cx = LX + LW/2;
    const at = (p, pad) => inLiquid(LX, LW, LTOP, LH, lvl, p[0], p[1], pad, CONE20);

    if (v.cells > 0.02)
      CELLS.forEach(function(p, i){
        if (i % 2 && v.lvl < 0.62) return;
        const q = at(p, 30);
        if (q) g.appendChild(cellAt(q[0], q[1], v.cells));
      });
    if (v.free > 0.02){
      const k = G.el("g", {opacity:n1(v.free)});
      CELLS.forEach(function(p, i){
        if (i % 3 === 2) return;
        const q = at(p, 18);
        if (q) k.appendChild(ring(q[0], q[1], 10));
      });
      g.appendChild(k);
    }
    if (v.floc > 0.02){
      const k = G.el("g", {opacity:n1(v.floc)});
      CELLS.forEach(function(p){
        const q = at([p[1], p[0]], 14);
        if (q) k.appendChild(G.el("circle", {cx:n1(q[0]), cy:n1(q[1]), r:6,
          fill:C.ink, "fill-opacity":".3", stroke:"none"}));
      });
      g.appendChild(k);
    }
    if (v.cpel > 0.02) g.appendChild(pellet(LX, LW, LTOP, LH, C.amber, n1(0.46*v.cpel), CONE20));
    if (v.ppel > 0.02) g.appendChild(pellet(LX, LW, LTOP, LH, C.muted, n1(0.55*v.ppel), CONE20));
    return g;
  }
  return G.run(s, LFR, paint);
});

/* ================================================================== *
 * 2.  column — the silica half
 * ================================================================== */
const CX = 1100, CW = 146, CTOP = 232, FRIT = 408, SPOUT = 458;
const TX = 1086, TW = 174, TTOP = 322, TH = 404;
const LIST2 = steps([
  ["Load the cleared lysate", "the blue arrives with it"],
  ["Spin 15 s, discard", "DNA binds the silica"],
  ["Add 500 \u00b5L PB", "more chaotrope"],
  ["Spin 15 s, discard", "protein leaves"],
  ["Add 750 \u00b5L PE", "ethanol wash"],
  ["Spin 15 s, discard", "salt leaves"],
  ["Spin 90 s dry", "ethanol leaves"],
  ["Swap for a clean tube", "or you elute into the waste"],
  ["Add 50 \u00b5L water", "low salt lets it go"],
  ["Spin 45 s", "the blue lands in the tube"]
], 130, 250, 52);


/* The column: a wide lip that rests on the collection tube's rim, a
   straight barrel, the frit, and a spout that reaches down inside. */
function barrel(){
  const g = G.el("g", {});
  g.appendChild(path("M"+CX+" "+CTOP+"V"+FRIT+"L"+n1(CX+CW*0.30)+" "+(FRIT+34)+
    "V"+SPOUT+"H"+n1(CX+CW*0.70)+"V"+(FRIT+34)+"L"+(CX+CW)+" "+FRIT+"V"+CTOP));
  g.appendChild(G.el("rect", {x:CX-22, y:CTOP-14, width:CW+44, height:14, rx:3,
    fill:"none", stroke:C.ink, "stroke-width":2.6}));
  return g;
}
function squirt(label, sub, t){
  const g = G.el("g", {opacity:n1(t)}), px = CX + CW/2;
  g.appendChild(path("M"+(px-24)+" 74V110L"+(px-6)+" 142V158H"+(px+6)+"V142L"+
    (px+24)+" 110V74Z", C.muted, 2.6));
  for (let i = 0; i < 3; i++)
    g.appendChild(G.el("ellipse", {cx:px, cy:168 + i*22, rx:5.5, ry:8.5,
      fill:C.muted, "fill-opacity":".45", stroke:C.muted, "stroke-width":1.8}));
  g.appendChild(G.text(px + 66, 108, label, 29, C.ink, 700, "start"));
  if (sub) g.appendChild(G.text(px + 66, 140, sub, 22, C.muted, 400, "start"));
  return g;
}
function spinMark(label){
  const g = G.el("g", {}), x = 1416, y = 176;   /* clear of the open lid below */
  g.appendChild(path("M"+(x-36)+" "+y+"a36 36 0 1 1 11 26", C.verm, 3.4));
  g.appendChild(path("M"+(x-32)+" "+(y+38)+"l9 -15l16 8", C.verm, 3.4));
  g.appendChild(G.text(x, y + 74, label, 23, C.verm, 700));
  return g;
}

const CFR = [
  { s:{step:0, col:1, blueCol:1, thru:0, bound:0, swap:0, elu:0}, on:["load"],
    cap:"the cleared lysate goes on the column",
    call:"the blue arrives with it &#183; still in high salt, which is what makes it stick",
    note:"This is the supernatant from the last slide and the plasmid is in it. It is also still full of the guanidinium salt that came in with N3, and that matters: silica only binds DNA in high chaotropic salt. Load it with water instead and the plasmid goes straight through.",
    desc:"A spin column seated in a collection tube. The column is full of cleared lysate with blue plasmid rings in it; the tube below is empty." },

  { s:{step:1, col:0, blueCol:0, thru:1, bound:1, swap:0, elu:0}, on:["spin1"],
    cap:"<b>spin 15 s</b> &#183; the liquid goes through and the blue does not",
    call:"below: salt, protein, RNA &#183; on the frit: your plasmid",
    note:"Fifteen seconds. The liquid passes the frit and the plasmid stays on it, held there by the salt. Look at the two containers: everything in the tube underneath is waste, and everything you care about is now a film on a disc of silica a few millimetres across. Tip the flow-through away.",
    desc:"The column has emptied into the collection tube. The frit is now blue: the plasmid is bound to it. The flow-through below is grey waste." },

  { s:{step:2, col:1, blueCol:0, thru:0, bound:1, swap:0, elu:0}, on:["pb"],
    cap:"<b>PB</b>, 500 &micro;L &#183; more chaotrope",
    call:"clear liquid in, and the blue does not move",
    note:"PB is more of the same salt. Nothing about the plasmid changes here: the point is that it stays put while everything that is not DNA is persuaded to let go.",
    desc:"PB buffer is squirted into the column. The liquid carries no blue; the plasmid is still on the frit." },

  { s:{step:3, col:0, blueCol:0, thru:1, bound:1, swap:0, elu:0}, on:["spin2"],
    cap:"<b>spin</b> &#183; and this time the protein goes",
    call:"below: protein &#183; on the frit: still your plasmid",
    note:"Protein gone. This is the first of three spins that read identically on a protocol sheet and are not: each removes a different thing, and the order is not arbitrary.",
    desc:"The column has emptied again. The flow-through is labelled protein; the frit is still blue." },

  { s:{step:4, col:1, blueCol:0, thru:0, bound:1, swap:0, elu:0}, on:["pe"],
    cap:"<b>PE</b>, 750 &micro;L &#183; the ethanol wash",
    call:"DNA will not dissolve in ethanol, so the blue stays",
    note:"PE is ethanol with a little buffer. DNA is not soluble in it so the plasmid stays on the silica, and the salt that has been holding it there is soluble, so the salt leaves.",
    desc:"PE buffer is squirted into the column. The plasmid is still on the frit." },

  { s:{step:5, col:0, blueCol:0, thru:1, bound:1, swap:0, elu:0}, on:["spin3"],
    cap:"<b>spin</b> &#183; and this time the salt goes",
    call:"below: salt &#183; on the frit: plasmid and ethanol",
    note:"Salt gone. What is left on the frit now is your plasmid and some ethanol.",
    desc:"The column has emptied for the third time. The flow-through is labelled salt." },

  { s:{step:6, col:0, blueCol:0, thru:0, bound:1, swap:0, elu:0}, on:["dry"],
    cap:"<b>spin 90 s dry</b> &#183; nothing added, and not optional",
    call:"nothing below, because what leaves is ethanol vapour",
    note:"Nothing goes in for this one and nothing visible comes out, which is why it is the step people skip. It is driving off the ethanol left in the frit. Ethanol carried into your eluate will ruin a sequencing read and inhibit half the enzymes you might want to use next.",
    desc:"No liquid is added and the collection tube stays empty. The plasmid is still on the frit." },

  { s:{step:7, col:0, blueCol:0, thru:0, bound:1, swap:1, elu:0}, on:["fresh"],
    cap:"and <b>now</b> change the tube underneath",
    call:"everything so far has been waste &#183; the next thing through is the plasmid",
    note:"This is the one step everybody has skipped at least once. Up to now the tube underneath has been catching waste, and the next thing through the frit is what you came for. Elute into the tube you have been throwing away and you have done the whole prep to produce fifty microlitres of ethanol wash.",
    desc:"The used collection tube slides out from under the column and a clean one takes its place." },

  { s:{step:8, col:1, blueCol:0, thru:0, bound:1, swap:1, elu:0}, on:["water"],
    cap:"water, 50 &micro;L &#183; low salt is what makes it let go",
    call:"the binding step, run backwards",
    note:"Water, and no salt. Silica holds DNA in high chaotropic salt and releases it in low salt, so this is the loading step in reverse. Put it on the middle of the frit rather than down the side, and warm it first if you are chasing yield.",
    desc:"Fifty microlitres of water is squirted onto the frit." },

  { s:{step:9, col:0, blueCol:0, thru:0, bound:0, swap:1, elu:1}, on:["spin4"],
    cap:"<b>spin 45 s</b> &#183; and the blue is in the tube",
    call:"fifty microlitres of clean plasmid &#183; the column goes in the bin",
    note:"Forty-five seconds and the plasmid comes off the silica and into the clean tube. Follow the blue back through the whole thing: it was inside the cells, then loose in the lysate, then on the frit, and now it is in a tube on its own in fifty microlitres of water. That is the entire miniprep.",
    desc:"The column has emptied into the clean tube, the frit is clear, and the tube now holds the blue plasmid." }
];

window.Deck.sequence("column", function(slide){
  const s = G.scene(slide, 800, 846);
  s.part("load",  G.el("g", {}));
  s.part("pb",    squirt("PB", "500 \u00b5L", 1));
  s.part("pe",    squirt("PE", "750 \u00b5L", 1));
  s.part("water", squirt("water", "50 \u00b5L", 1));
  s.part("spin1", spinMark("15 s"));
  s.part("spin2", spinMark("15 s"));
  s.part("spin3", spinMark("15 s"));
  s.part("dry",   spinMark("90 s, dry"));
  s.part("spin4", spinMark("45 s"));
  s.part("fresh", (function(){
    const g = G.el("g", {});
    g.appendChild(path("M"+(TX-40)+" 640h-110m24-13l-24 13l24 13", C.verm, 3.2));
    g.appendChild(path("M"+(TX+TW+40)+" 640h110m-24-13l24 13l-24 13", C.verm, 3.2));
    return g;
  })());
  s.finish();

  /* what is in the flow-through at each spin -- the whole reason the
     three washes are not one instruction repeated */
  const WASTE = ["", "salt, protein, RNA", "", "protein", "", "salt", "", "", "", ""];

  function paint(v, f){
    const g = G.el("g", {});
    const st = f.s.step;                   /* snaps on the click */
    g.appendChild(LIST2(st));

    /* the waste tube is open-topped; the one you elute into is a 1.5 mL
       Eppendorf, lid hanging off the side */
    function below(dx, lvl, col, tag, fade, eppen){
      const t = G.el("g", {transform:"translate("+n1(dx)+" 0)"});
      if (fade != null && fade < 0.995) t.setAttribute("opacity", n1(fade));
      if (lvl > 0.02)
        t.appendChild(contents(TX, TW, TTOP, TH,
          TTOP + TH*0.9 - (TH*0.42)*lvl, col, ".15", eppen ? CONE : CONE20));
      t.appendChild(eppen ? eppy(TX, TW, TTOP, TH)
                          : openTube(TX, TW, TTOP, TH, CONE20));
      if (tag) t.appendChild(G.text(TX - 22, TTOP + 82, tag, 22,
        col === C.blue ? C.blue : C.muted, col === C.blue ? 700 : 400, "end"));
      return t;
    }
    g.appendChild(below(-430*v.swap, v.thru, C.muted,
      v.swap < 0.5 ? (WASTE[st] || "waste") : "", 1 - v.swap, false));
    if (v.swap > 0.02){
      const nt = below(430*(1 - v.swap), v.elu, C.blue,
        v.elu > 0.3 ? "your plasmid" : "clean tube", 1, true);
      g.appendChild(nt);
      if (v.elu > 0.3){
        const k = G.el("g", {opacity:n1(v.elu), transform:"translate("+
          n1(430*(1 - v.swap))+" 0)"});
        [[-22,-6],[16,-18],[6,10],[-2,-30]].forEach(p =>
          k.appendChild(ring(TX + TW/2 + p[0], TTOP + TH*0.66 + p[1], 10)));
        g.appendChild(k);
      }
    }

    /* and the column itself */
    if (v.col > 0.02)
      g.appendChild(G.el("path", {d:"M"+CX+" "+n1(FRIT - (FRIT-CTOP-24)*v.col)+
        "H"+(CX+CW)+"V"+(FRIT-12)+"H"+CX+"Z", fill:C.blue,
        "fill-opacity":v.blueCol > 0.5 ? ".15" : ".08", stroke:"none"}));
    if (v.col > 0.02)
      g.appendChild(path("M"+CX+" "+n1(FRIT - (FRIT-CTOP-24)*v.col)+"H"+(CX+CW), C.muted, 2));
    if (v.blueCol > 0.02){
      const k = G.el("g", {opacity:n1(v.blueCol)});
      [[-34,-104],[24,-132],[-4,-66],[36,-44]].forEach(p =>
        k.appendChild(ring(CX + CW/2 + p[0], FRIT + p[1], 10)));
      g.appendChild(k);
    }
    g.appendChild(barrel());
    g.appendChild(G.el("rect", {x:CX+2, y:FRIT-12, width:CW-4, height:12,
      fill:C.muted, "fill-opacity":".25", stroke:C.muted, "stroke-width":1.8}));
    if (v.bound > 0.02)
      g.appendChild(G.el("rect", {x:CX+2, y:FRIT-12, width:CW-4, height:12,
        fill:C.blue, "fill-opacity":n1(0.6*v.bound), stroke:C.blue,
        "stroke-width":2.2, opacity:n1(v.bound)}));
    g.appendChild(G.text(CX + CW/2, CTOP - 32, "silica column", 24, C.muted, 400));
    if (v.bound > 0.5)
      g.appendChild(G.text(CX + CW + 34, FRIT - 2, "plasmid, bound", 23, C.blue, 700, "start"));
    return g;
  }
  return G.run(s, CFR, paint);
});
})();
