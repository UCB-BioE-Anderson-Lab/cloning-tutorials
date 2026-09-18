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
function tubeD(x, w, top, bot){
  return "M"+x+" "+top+"V"+bot+"Q"+(x+w/2)+" "+(bot+w*0.5)+" "+(x+w)+" "+bot+"V"+top;
}
function fillD(x, w, lvl, bot){
  return "M"+x+" "+n1(lvl)+"Q"+(x+w/2)+" "+n1(lvl+14)+" "+(x+w)+" "+n1(lvl)+
         "V"+bot+"Q"+(x+w/2)+" "+(bot+w*0.5)+" "+x+" "+bot+"Z";
}
function pool(x, w, lvl, bot, col, op){
  const g = G.el("g", {});
  g.appendChild(G.el("path", {d:fillD(x, w, lvl, bot), fill:col,
    "fill-opacity":op == null ? ".13" : op, stroke:"none"}));
  g.appendChild(path("M"+x+" "+n1(lvl)+"Q"+(x+w/2)+" "+n1(lvl+14)+" "+(x+w)+" "+n1(lvl),
    C.muted, 2));
  return g;
}
/* a dome of stuff sitting in the bottom of a tube */
function pellet(x, w, bot, h, col, op){
  const g = G.el("g", {});
  g.appendChild(G.el("path", {d:"M"+(x+16)+" "+(bot+h*0.3)+"Q"+(x+w/2)+" "+(bot+w*0.5+10)+
    " "+(x+w-16)+" "+(bot+h*0.3)+"Z", fill:col, "fill-opacity":op || ".8", stroke:"none"}));
  return g;
}
/* the plasmid, wherever it currently is: a small double ring */
function ring(cx, cy, r){
  const g = G.el("g", {});
  [r, r - 5].forEach(rr => g.appendChild(G.el("circle", {cx:cx, cy:cy, r:rr,
    fill:"none", stroke:C.blue, "stroke-width":2.4})));
  return g;
}
/* a cell, with its plasmid inside it */
function cellAt(cx, cy, o){
  const g = G.el("g", {opacity:n1(o)});
  g.appendChild(G.el("rect", {x:cx-24, y:cy-13, width:48, height:26, rx:13,
    fill:C.muted, "fill-opacity":".16", stroke:C.muted, "stroke-width":2}));
  g.appendChild(G.el("circle", {cx:cx, cy:cy, r:7.5, fill:"none",
    stroke:C.blue, "stroke-width":2.8}));
  return g;
}

/* ------------------------------------------------------------------ *
 * The protocol, down the left, with the step you are on in red.
 * ------------------------------------------------------------------ */
function steps(items, x, y0, gap){
  return function(active){
    const g = G.el("g", {});
    items.forEach(function(it, i){
      const on = i === active;
      const y = y0 + i*gap;
      if (on) g.appendChild(G.el("rect", {x:x-18, y:y-30, width:560, height:gap-6,
        rx:6, fill:C.verm, "fill-opacity":".07", stroke:"none"}));
      g.appendChild(G.text(x, y, it[0], 26, on ? C.verm : C.muted,
        on ? 700 : 400, "start"));
      if (it[1]) g.appendChild(G.text(x, y + 28, it[1], 22,
        on ? C.verm : C.muted, 400, "start"));
    });
    return g;
  };
}

/* ================================================================== *
 * 1.  lysisrun — the tube half
 * ================================================================== */
const LX = 1010, LW = 280, LTOP = 236, LBOT = 610;   /* the 2 mL tube */
const LSPAN = LBOT - LTOP - 26;
const LIST1 = steps([
  ["Fill a 2 mL tube with saturated culture", ""],
  ["Spin 1 min, toss the supernatant", "bleach it, then drain"],
  ["Resuspend in 250 µL P1", "Tris, EDTA, RNase A"],
  ["Lyse with 250 µL P2", "NaOH, SDS"],
  ["Neutralize with 350 µL N3", "guanidinium chloride, acetate"],
  ["Spin 5 min", ""]
], 130, 244, 92);

const CELLS = [[-82,-96],[6,-128],[80,-84],[-44,-36],[52,-22],[-96,26],[24,42],[94,10],
               [-30,74],[62,92],[-86,110],[10,132]];

const LFR = [
  { s:{step:0, lvl:1, cells:1, cpel:0, free:0, floc:0, ppel:0}, on:["t0"],
    cap:"a saturated overnight, and the plasmid is inside the cells",
    call:"blue is the plasmid &#183; watch where it is on every step from here",
    note:"Two millilitres of a saturated overnight. Every one of those cells has some tens of copies of your plasmid in it, and that is the blue. Keep an eye on the blue for the rest of this: it is inside the cells now, it will be loose in the lysate in three steps, then stuck to a piece of silica, and finally in a tube on its own. The whole procedure is just moving it between those places.",
    desc:"A two millilitre tube full of turbid culture. Cells are drawn as small grey capsules suspended in it, each with a blue ring inside it: the plasmid." },

  { s:{step:1, lvl:0, cells:0, cpel:1, free:0, floc:0, ppel:0}, on:["t1"],
    cap:"spin one minute and tip the medium away",
    call:"the cells are a pellet, and the blue went down with them",
    note:"One minute is plenty. The cells pellet and the spent medium is poured off, which needs bleaching before it goes down the drain because it is a saturated culture of engineered bacteria. Nothing has been done to the DNA yet. It is still inside the cells, and the cells are now at the bottom of the tube.",
    desc:"The medium has gone. A grey pellet of cells sits in the bottom of the tube, still carrying the blue plasmid." },

  { s:{step:2, lvl:0.55, cells:1, cpel:0, free:0, floc:0, ppel:0}, on:["t2"],
    cap:"<b>P1</b> &#183; resuspend the pellet, 250 &micro;L",
    call:"Tris to buffer it, EDTA to stop nucleases, RNase to deal with the RNA",
    note:"P1 is buffer with RNase in it. The EDTA chelates magnesium so that any nuclease that gets loose cannot work, and the RNase is there because you are about to release an enormous amount of RNA that would otherwise come all the way through the prep with you. Resuspend properly: if there are clumps of cells left, P2 will not reach them and you have simply thrown that fraction away. The cells are whole again and the blue is still in them.",
    desc:"The pellet has been resuspended in P1. The cells are suspended in the liquid again, each still carrying its blue plasmid." },

  { s:{step:3, lvl:0.78, cells:0, cpel:0, free:1, floc:0, ppel:0}, on:["t3"],
    cap:"<b>P2</b> &#183; lyse and denature, 250 &micro;L",
    call:"the cells burst and the blue is now loose in the liquid &#183; invert, do not vortex",
    note:"P2 is the lysis. SDS dissolves the membranes and denatures protein, and the sodium hydroxide denatures the DNA. The cells are gone, and everything that was in them, your plasmid included, is now loose in the tube. This is the step where the liquid goes clear and viscous, and the step you invert gently rather than vortex, because the chromosome is enormous and you do not want it sheared into pieces small enough to follow the plasmid through the rest of the prep.",
    desc:"The cells have burst. The liquid is clear, and the blue plasmid rings are now loose in it along with grey strands of chromosomal DNA." },

  { s:{step:4, lvl:1, cells:0, cpel:0, free:1, floc:1, ppel:0}, on:["t4"],
    cap:"<b>N3</b> &#183; neutralise into high salt, 350 &micro;L",
    call:"everything except the plasmid comes out of solution &#183; the blue stays in",
    note:"N3 drops the pH back and puts the tube into high salt at the same time. The plasmid re-pairs and stays dissolved. Everything else does not: the chromosome, the denatured protein, the cell debris and the detergent all come out of solution together as a white precipitate, which you can watch appear. The blue is still in the liquid.",
    desc:"White flecks of precipitate have appeared throughout the liquid. The blue plasmid rings are still in solution among them." },

  { s:{step:5, lvl:1, cells:0, cpel:0, free:1, floc:0, ppel:1}, on:["t5"],
    cap:"spin five minutes, and take the liquid off the top",
    call:"the blue is in the supernatant &#183; that is what goes on the column",
    note:"Five minutes and the precipitate is a firm pellet at the bottom with everything you do not want in it. The supernatant above it is clear and carries your plasmid. That is the cleared lysate, and it is what goes on the column on the next slide. Do not disturb the pellet on the way out of the tube: a bit of it carried over is chromosomal DNA in your prep.",
    desc:"The precipitate has pelleted at the bottom of the tube. The supernatant above it is clear and carries the blue plasmid rings." }
];

window.Deck.sequence("lysisrun", function(slide){
  const s = G.scene(slide, 800, 846);
  const lab = t => G.text(LX + LW/2, 176, t, 25, C.muted, 400);
  s.part("t0", lab("saturated culture"));
  s.part("t1", lab("cell pellet"));
  s.part("t2", lab("resuspended"));
  s.part("t3", lab("lysate"));
  s.part("t4", lab("precipitate forming"));
  s.part("t5", lab("cleared lysate"));
  s.finish();

  function paint(v){
    const g = G.el("g", {});
    g.appendChild(LIST1(Math.round(v.step)));

    const lvl = LBOT - LSPAN*v.lvl;
    if (v.lvl > 0.02)
      g.appendChild(pool(LX+3, LW-6, lvl, LBOT, v.cells > 0.5 ? C.muted : C.blue,
        v.cells > 0.5 ? ".12" : ".08"));
    g.appendChild(path(tubeD(LX, LW, LTOP, LBOT)));

    const cx = LX + LW/2, mid = (lvl + LBOT)/2;
    /* cells, each with its plasmid inside */
    if (v.cells > 0.02)
      CELLS.forEach(function(p, i){
        if (i % 2 && v.lvl < 0.7) return;
        g.appendChild(cellAt(cx + p[0], mid + p[1]*0.62*v.lvl, v.cells));
      });
    /* or the plasmid loose in the liquid */
    if (v.free > 0.02){
      const k = G.el("g", {opacity:n1(v.free)});
      CELLS.forEach(function(p, i){
        if (i % 3 === 2) return;
        k.appendChild(ring(cx + p[0]*0.94, mid + p[1]*0.6, 11));
      });
      g.appendChild(k);
    }
    /* the precipitate, first in suspension and then at the bottom */
    if (v.floc > 0.02){
      const k = G.el("g", {opacity:n1(v.floc)});
      CELLS.forEach(function(p, i){
        k.appendChild(G.el("circle", {cx:cx + p[1]*0.7, cy:mid + p[0]*0.7, r:7,
          fill:C.ink, "fill-opacity":".3", stroke:"none"}));
      });
      g.appendChild(k);
    }
    if (v.cpel > 0.02) g.appendChild(pellet(LX, LW, LBOT, 40, C.muted, n1(0.55*v.cpel)));
    if (v.ppel > 0.02) g.appendChild(pellet(LX, LW, LBOT, 40, C.ink, n1(0.72*v.ppel)));
    if (v.cpel > 0.5) g.appendChild(ring(cx, LBOT + 76, 11));
    return g;
  }
  return G.run(s, LFR, paint);
});

/* ================================================================== *
 * 2.  column — the silica half
 * ================================================================== */
const CX = 1040, CW = 190, CTOP = 196, FRIT = 386, SPOUT = 452;
const TX = 1010, TW = 250, TTOP = 336, TBOT = 604;
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
], 130, 240, 54);

function barrel(){
  return path("M"+CX+" "+CTOP+"V"+FRIT+"L"+(CX+CW*0.34)+" "+(FRIT+42)+
    "V"+SPOUT+"H"+(CX+CW*0.66)+"V"+(FRIT+42)+"L"+(CX+CW)+" "+FRIT+"V"+CTOP);
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
  const g = G.el("g", {}), x = 1418, y = 306;   /* clear of the column label */
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
    g.appendChild(path("M"+(TX-60)+" "+(TBOT+96)+"h-96m22-13l-22 13l22 13", C.verm, 3.2));
    g.appendChild(path("M"+(TX+TW+60)+" "+(TBOT+96)+"h96m-22-13l22 13l-22 13", C.verm, 3.2));
    return g;
  })());
  s.finish();

  /* what is in the flow-through at each spin -- the whole reason the
     three washes are not one instruction repeated */
  const WASTE = ["", "salt, protein, RNA", "", "protein", "", "salt", "", "", "", ""];

  function paint(v){
    const g = G.el("g", {});
    const st = Math.round(v.step);
    g.appendChild(LIST2(st));

    function tube(dx, lvl, col, tag, fade){
      const t = G.el("g", {transform:"translate("+n1(dx)+" 0)"});
      if (fade != null && fade < 0.995) t.setAttribute("opacity", n1(fade));
      t.appendChild(path(tubeD(TX, TW, TTOP, TBOT)));
      if (lvl > 0.02)
        t.appendChild(pool(TX+3, TW-6, TBOT - (TBOT-TTOP-30)*0.5*lvl, TBOT, col, ".15"));
      if (tag) t.appendChild(G.text(TX - 20, TBOT + 40, tag, 22, C.muted, 400, "end"));
      return t;
    }
    g.appendChild(tube(-470*v.swap, v.thru, C.muted,
      v.swap < 0.5 ? (WASTE[st] || "waste") : "", 1 - v.swap));
    if (v.swap > 0.02){
      const nt = tube(470*(1 - v.swap), v.elu, C.blue, "", 1);
      g.appendChild(nt);
      if (v.elu > 0.3){
        const k = G.el("g", {opacity:n1(v.elu)});
        [[-52,-14],[18,-32],[54,6],[-16,20]].forEach(p =>
          k.appendChild(ring(TX + TW/2 + p[0], TBOT - 44 + p[1], 12)));
        k.appendChild(G.text(TX - 20, TBOT + 40, "your plasmid", 22, C.blue, 700, "end"));
        g.appendChild(k);
      }
    }

    if (v.col > 0.02)
      g.appendChild(pool(CX+3, CW-6, FRIT - (FRIT-CTOP-26)*v.col, FRIT - 14, C.blue,
        v.blueCol > 0.5 ? ".14" : ".07"));
    if (v.blueCol > 0.02){
      const k = G.el("g", {opacity:n1(v.blueCol)});
      [[-44,-96],[30,-128],[-6,-62],[48,-44]].forEach(p =>
        k.appendChild(ring(CX + CW/2 + p[0], FRIT + p[1], 11)));
      g.appendChild(k);
    }
    g.appendChild(barrel());
    g.appendChild(G.el("rect", {x:CX+3, y:FRIT-14, width:CW-6, height:14,
      fill:C.muted, "fill-opacity":".22", stroke:C.muted, "stroke-width":1.8}));
    if (v.bound > 0.02)
      g.appendChild(G.el("rect", {x:CX+3, y:FRIT-14, width:CW-6, height:14,
        fill:C.blue, "fill-opacity":n1(0.55*v.bound), stroke:C.blue,
        "stroke-width":2.2, opacity:n1(v.bound)}));
    g.appendChild(G.text(CX + CW + 22, CTOP + 22, "silica column", 24, C.muted, 400, "start"));
    if (v.bound > 0.5)
      g.appendChild(G.text(CX + CW + 22, FRIT - 2, "plasmid, bound", 23, C.blue, 700, "start"));
    return g;
  }
  return G.run(s, CFR, paint);
});
})();
