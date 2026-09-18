/* ------------------------------------------------------------------ *
 * 05-kcm.js — KCM heat-shock transformation, run against its own clock.
 *
 * JCA: "look up the cloning-tutorials cheat sheet for this.  It has a
 * timeline.  I think you want to animate each action with the timeline
 * above it indicating where you are at."  And: "replace that slide with
 * animation."  What was there was a screenshot of the protocol text.
 *
 * So the timeline off the bench cheatsheet sits across the top for the
 * whole sequence and never moves, and the step you are on is picked out
 * on it in red while the bench action plays underneath.  The point of
 * that pairing is the thing a numbered list cannot say: the plates go in
 * FIRST because they are the slow item, the block sequence is ninety
 * seconds of heat inside thirteen minutes of waiting, and the rescue is
 * a branch rather than a step.
 *
 * EVERY NUMBER HERE COMES OFF protocols/modules/heat_shock_transformation.js
 * by way of docs/cheatsheets/src/5-transformation.mjs.  Nothing is
 * invented and nothing is rounded for the drawing.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;
const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);

function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 3,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return G.el("path", a);
}
function grp(o){ return G.el("g", {opacity:n1(cl(o, 0, 1))}); }
function rect(x, y, w, h, o){
  const a = {x:n1(x), y:n1(y), width:n1(w), height:n1(h), rx:(o && o.rx) || 3,
    fill:(o && o.fill) || "none", stroke:(o && o.stroke) || C.ink,
    "stroke-width":(o && o.sw) || 2.6};
  if (o && o.op != null) a["fill-opacity"] = o.op;
  return G.el("rect", a);
}

/* ------------------------------------------------------------------ *
 * The numbers, from the module.  cold_min / heat_s / recover_min are
 * the block sequence; the three prep durations are the cheatsheet's.
 * ------------------------------------------------------------------ */
const P = {
  coldC:4, hotC:42, incC:37,
  aliquot:100, kcm:25, reactions:3, cells:40, thawS:30,
  coldMin:10, heatS:90, recoverMin:1,
  rescueUL:200, rescueMin:45, rescueMaxH:2,
  cool:2, warm:10, setup:10
};
const T0 = P.cool;                       /* cells cannot go down until cold */
const MIX = T0 + P.setup;
const COLD = MIX + P.coldMin;
const HOT = COLD + P.heatS/60;
const BACK = HOT + P.recoverMin;         /* ~25 min to the fork */

/* ------------------------------------------------------------------ *
 * The timeline.  It was two rows -- a to-scale axis with the block
 * stretch blown out underneath -- which is right on a printed cheatsheet
 * and wrong here.  JCA: "I don't understand that.  10 min?  13 min?  too
 * complicated."  The 13 was the sum of the three holds below it, and
 * asking a room to reconcile a total against its parts, live, while
 * something else is being explained, is a bad trade.
 *
 * So: one row, one box per thing you do, each carrying its own duration.
 * The boxes are equal width and therefore not to scale, which is the
 * price of being able to put 90 seconds and 10 minutes on the same line
 * and have both be readable.  The number under each box is the truth.
 * ------------------------------------------------------------------ */
const STEPS = [
  ["prep",  "plates + EchoTherm on"],
  ["set up", "~" + P.setup + " min"],
  [P.coldC + " \u00b0C", P.coldMin + " min"],
  [P.hotC + " \u00b0C", P.heatS + " s"],
  [P.coldC + " \u00b0C", P.recoverMin + " min"],
  ["plate", P.incC + " \u00b0C overnight"]
];
const BW = 190, BGAP = 12, BX = 200, TBY = 182, TBH = 54;
const boxX = i => BX + i*(BW + BGAP);

/* which box each beat lights up; -1 means the conditional strip */
const LIT = [0, 0, 1, 1, 1, 1, 2, 3, 4, -1, 5];

function timeline(step){
  const g = G.el("g", {}), lit = LIT[step];
  STEPS.forEach(function(t, i){
    const x = boxX(i), on = lit === i;
    g.appendChild(rect(x, TBY, BW, TBH,
      {fill:on ? C.verm : C.muted, op:on ? ".20" : ".09",
       stroke:on ? C.verm : C.muted, sw:on ? 2.6 : 1.6, rx:6}));
    g.appendChild(G.text(x + BW/2, TBY + 36, t[0], 25,
      on ? C.verm : C.ink, 700));
    g.appendChild(G.text(x + BW/2, TBY + TBH + 30, t[1], 22,
      on ? C.verm : C.muted, on ? 700 : 400));
    if (i < STEPS.length - 1)
      g.appendChild(path("M"+n1(x + BW + 2)+" "+(TBY + 20)+"l7 9l-7 9",
        C.muted, 2.4));
  });
  /* the rescue is a condition on the last box, not a step of its own */
  const on = lit === -1, rx0 = boxX(4), rx1 = boxX(5) + BW;
  g.appendChild(rect(rx0, 300, rx1 - rx0, 62,
    {fill:on ? C.verm : C.muted, op:on ? ".16" : ".05",
     stroke:on ? C.verm : C.muted, sw:2, rx:6}));
  g.appendChild(G.el("rect", {x:n1(rx0), y:300, width:n1(rx1-rx0), height:62, rx:6,
    fill:"none", stroke:on ? C.verm : C.muted, "stroke-width":2,
    "stroke-dasharray":"7 6"}));
  g.appendChild(G.text((rx0+rx1)/2, 326, "not Amp or Carb?", 22,
    on ? C.verm : C.muted, 700));
  g.appendChild(G.text((rx0+rx1)/2, 350, P.rescueMin + " min \u2013 " +
    P.rescueMaxH + " h rescue first", 22, on ? C.verm : C.muted, 400));
  return g;
}

/* ------------------------------------------------------------------ *
 * The bench kit, in section.  JCA: "show it more truly as a pcr tube in
 * a metal block.  do it like a cutaway like you cut the block and the
 * tube in half and are looking at the side."
 *
 * So the block is drawn as cut metal -- hatched, with the wells as voids
 * machined into it -- and the tube is cut with it, which is the only way
 * to show the thing that matters: the liquid sits down in the cone,
 * below the surface of the metal, which is why the block holds it at
 * temperature at all.
 * ------------------------------------------------------------------ */
const TUBE = {w:104, h:220, top:400};
const T_SH = TUBE.top + TUBE.h*0.42;         /* wall gives way to cone */
const T_TIP = TUBE.top + TUBE.h;
const T_TW = TUBE.w*0.15;                    /* half width at the tip   */
function halfAt(y, pad){
  const p = pad || 0, W = TUBE.w/2;
  if (y <= T_SH) return W + p;
  if (y >= T_TIP) return T_TW + p;
  return W - (W - T_TW)*(y - T_SH)/(T_TIP - T_SH) + p;
}
/* the tube's own outline, or -- with a positive pad -- the void that has
   to be machined into the block for it to sit in */
function tubeProfile(cx, pad){
  const p = pad || 0, top = TUBE.top - p, tip = T_TIP + p;
  return "M"+n1(cx - halfAt(top, p))+" "+n1(top)+
         "V"+n1(T_SH)+
         "L"+n1(cx - T_TW - p)+" "+n1(tip - 12)+
         "Q"+n1(cx)+" "+n1(tip)+" "+n1(cx + T_TW + p)+" "+n1(tip - 12)+
         "L"+n1(cx + halfAt(T_SH, p))+" "+n1(T_SH)+
         "V"+n1(top)+"Z";
}
/* liquid, filling the inside from the tip up to a level */
function liquid(cx, lvl, col, op){
  const inner = -5, tip = T_TIP + inner;
  let d = "M"+n1(cx - halfAt(lvl, inner))+" "+n1(lvl);
  for (let y = lvl; y <= tip - 12; y += 8)
    d += "L"+n1(cx - halfAt(y, inner))+" "+n1(y);
  d += "L"+n1(cx - T_TW - inner)+" "+n1(tip - 12)+
       "Q"+n1(cx)+" "+n1(tip)+" "+n1(cx + T_TW - inner)+" "+n1(tip - 12);
  for (let y = tip - 12; y >= lvl; y -= 8)
    d += "L"+n1(cx + halfAt(y, inner))+" "+n1(y);
  return G.el("path", {d:d + "Z", fill:col, "fill-opacity":op || ".20",
    stroke:"none"});
}
function tubeCut(cx, lvl, col){
  const g = G.el("g", {});
  g.appendChild(G.el("path", {d:tubeProfile(cx, 0), fill:"#ffffff",
    stroke:C.ink, "stroke-width":2.8, "stroke-linejoin":"round"}));
  if (lvl) g.appendChild(liquid(cx, lvl, col || C.amber));
  g.appendChild(G.el("path", {d:tubeProfile(cx, -5), fill:"none",
    stroke:C.ink, "stroke-width":1.6, "stroke-linejoin":"round"}));
  /* the hinged flange, cut through with everything else */
  g.appendChild(rect(cx - TUBE.w/2 - 10, TUBE.top - 16, TUBE.w + 20, 16, {rx:3}));
  return g;
}
/* the block: one slab of metal with the wells cut out of its top face */
const BLK = {y:540, h:160};
function blockCut(x, w, wells, on, col, label){
  const g = G.el("g", {}), y = BLK.y, h = BLK.h;
  let d = "M"+n1(x)+" "+n1(y + h)+"V"+n1(y);
  wells.forEach(function(cx){
    d += "H"+n1(cx - halfAt(y, 8));
    d += "L"+n1(cx - T_TW - 8)+" "+n1(T_TIP - 4)+
         "Q"+n1(cx)+" "+n1(T_TIP + 10)+" "+n1(cx + T_TW + 8)+" "+n1(T_TIP - 4);
    d += "L"+n1(cx + halfAt(y, 8))+" "+n1(y);
  });
  d += "H"+n1(x + w)+"V"+n1(y + h)+"Z";
  g.appendChild(G.el("path", {d:d, fill:"url(#kcmhatch)", stroke:"none"}));
  g.appendChild(G.el("path", {d:d, fill:col, "fill-opacity":on ? ".22" : ".07",
    stroke:C.ink, "stroke-width":2.8, "stroke-linejoin":"round"}));
  g.appendChild(G.text(x + w/2, y + h + 40, label, 26, col, 700));
  return g;
}
/* -1..1 across and down the liquid.  Positions were absolute before, so
   a ring could sit above the meniscus or through the wall -- there is
   very little room in a cone and none of it is where you guess. */
function inTube(cx, lvl, fx, fy, pad){
  const yTop = lvl + 16, yBot = T_TIP - 26;
  const y = yTop + (yBot - yTop)*(fy*0.5 + 0.5);
  const half = halfAt(y, -5) - pad;
  return half <= 3 ? null : [cx + fx*half, y];
}
function cellAt(x, y, o){
  const g = G.el("g", {opacity:n1(cl(o == null ? 1 : o, 0, 1))});
  g.appendChild(G.el("rect", {x:n1(x-13), y:n1(y-7), width:26, height:14, rx:7,
    fill:C.amber, "fill-opacity":".40", stroke:C.amber, "stroke-width":1.8}));
  return g;
}
function ring(x, y, r){
  const g = G.el("g", {});
  [r, r - 3.4].forEach(rr => g.appendChild(G.el("circle", {cx:n1(x), cy:n1(y),
    r:n1(rr), fill:"none", stroke:C.blue, "stroke-width":2})));
  return g;
}
function dish(cx, cy, r, o){
  const g = G.el("g", {}), ry = r*0.30, hh = r*0.17;
  g.appendChild(path("M"+n1(cx-r)+" "+n1(cy)+"v"+n1(hh)+
    "A"+n1(r)+" "+n1(ry)+" 0 0 0 "+n1(cx+r)+" "+n1(cy+hh)+"v"+n1(-hh)));
  g.appendChild(G.el("ellipse", {cx:n1(cx), cy:n1(cy), rx:n1(r), ry:n1(ry),
    fill:(o && o.fill) || "#ffffff", "fill-opacity":(o && o.fill) ? ".14" : "1",
    stroke:C.ink, "stroke-width":2.6}));
  return g;
}
function boxLabel(x, y, w, h, t, sub){
  const g = G.el("g", {});
  g.appendChild(rect(x, y, w, h, {rx:10}));
  g.appendChild(G.text(x + w/2, y + h + 32, t, 24, C.ink, 700));
  if (sub) g.appendChild(G.text(x + w/2, y + h + 58, sub, 21, C.muted, 400));
  return g;
}
/* what you are adding, named beside the tube it goes into */
function reagent(label, sub, tubeX){
  const g = G.el("g", {}), ex = tubeX - TUBE.w/2 - 10;
  g.appendChild(G.text(300, 430, label, 25, C.ink, 700, "end"));
  if (sub) g.appendChild(G.text(300, 458, sub, 21, C.muted, 400, "end"));
  g.appendChild(path("M316 420C"+n1(ex-92)+" 406 "+n1(ex-56)+" 366 "+n1(ex-4)+" 382,",
    C.ink, 2.6, "7 6"));
  g.appendChild(G.el("path", {d:"M"+n1(ex+8)+" 384L"+n1(ex-12)+" 372L"+
    n1(ex-9)+" 389Z", fill:C.ink, stroke:"none"}));
  return g;
}
/* the transfer between the two tubes, which is the step that was missing */
function transfer(fromX, toX, label){
  const g = G.el("g", {}), y = 336;
  g.appendChild(path("M"+n1(fromX)+" "+n1(y)+"C"+n1(fromX+30)+" "+n1(y-34)+" "+
    n1(toX-30)+" "+n1(y-34)+" "+n1(toX-6)+" "+n1(y), C.ink, 2.8, "7 6"));
  g.appendChild(G.el("path", {d:"M"+n1(toX)+" "+n1(y+8)+"L"+n1(toX-14)+" "+
    n1(y-10)+"L"+n1(toX+8)+" "+n1(y-6)+"Z", fill:C.ink, stroke:"none"}));
  g.appendChild(G.text((fromX + toX)/2, y - 44, label, 24, C.ink, 700));
  return g;
}

/* ------------------------------------------------------------------ *
 * The beats.  THIS IS TWO TUBES, NOT ONE.  The first version had the
 * cells and the DNA in a single tube from the start and then "added the
 * mix to the DNA" with nothing to add it to.  JCA wrote the order out:
 * assembly reaction on the cold block, competent cells as a SECOND tube,
 * KCM into the cells, then forty microlitres of cells across into the
 * assembly reaction.  The direction matters -- cells go to the DNA.
 * ------------------------------------------------------------------ */
const WCOLD = [516, 716], WHOT = [942, 1114];
/* scattered in -1..1, so the same arrangement works at either level */
const CELLPOS = [[-0.42, -0.62], [0.34, 0.04], [-0.12, 0.72]];
const DNAPOS = [[0.52, -0.58], [-0.5, 0.08], [0.22, 0.78]];
const XASM = WCOLD[1], XCOMP = WCOLD[0], XWARM = WHOT[0];

const FR = [
{ s:{step:0, inc:1},
  cap:"plates into the incubator <b>first</b> &#183; they are the slow thing",
  call:"a cold plate carries condensation, and you cannot write on a wet plate",
  note:"Plates first, before anything else, because they are the only slow item on the bench and everything else waits on them. They need about ten minutes at thirty-seven to come up to temperature and dry off. A plate straight out of the fridge has condensation on the agar and on the lid, and you cannot write on a wet plate, so the labelling waits for the drying. Check while you are there that the plate carries the antibiotic on your labsheet.",
  desc:"Petri dishes going into a thirty-seven degree incubator." },

{ s:{step:1, blk:1},
  cap:"<b>EchoTherm</b> on &#183; cold block " + P.coldC + " °C, warm block " + P.hotC + " °C",
  call:"about two minutes to come down &#183; nothing goes on until it is cold",
  note:"Two blocks, set once and left alone for the whole protocol: one at four degrees, one at forty-two. Drawn cut in half, because the point of a block is that the tube sits down inside it and the liquid is below the surface of the metal. The cold one takes a couple of minutes to come down and nothing can start until it has, which is why it goes on at the same time as the plates.",
  desc:"Two metal blocks drawn in cutaway section, one at four degrees and one at forty-two, with tube-shaped wells machined into them." },

{ s:{step:2, blk:1, asm:1, dna:1},
  cap:"your <b>assembly reaction</b> goes on the cold block",
  call:"this is the tube everything else gets added to",
  note:"The assembly or ligation reaction goes onto the cold block first, and it stays there. This is the tube that everything else joins: nothing is being moved out of it at any point. If you are transforming pure plasmid rather than a reaction, this is a fresh tube with the DNA in it, and you want that DNA diluted ten to twenty fold first, using about a microlitre.",
  desc:"A PCR tube of assembly reaction seated in a well of the cold block, drawn in cutaway, with blue plasmid in the liquid." },

{ s:{step:3, blk:1, asm:1, dna:1, comp:1},
  cap:"<b>" + P.aliquot + " µL</b> of competent cells &#183; a <b>second</b> tube",
  call:"thaw about " + P.thawS + " s on the cold block &#183; one aliquot does " + P.reactions + " reactions",
  note:"Competent cells come as their own aliquot and they are a separate tube. Onto the cold block beside the reaction, and they thaw in about thirty seconds. You want them thawed and not warm. One aliquot of a hundred microlitres serves three reactions, so do not open one per sample, and do not leave them sitting out while you find your labsheet.",
  desc:"A second tube of competent cells seated in the next well along on the cold block." },

{ s:{step:4, blk:1, asm:1, dna:1, comp:1, kcm:1},
  cap:"<b>" + P.kcm + " µL KCM</b> into the <b>cells</b>",
  call:"into the cell tube, not the reaction &#183; pipette gently, they are fragile",
  note:"Twenty-five microlitres of KCM into the cell aliquot, not into the reaction. KCM is the potassium, calcium and magnesium that make the whole thing work: the divalent cations screen the charge on the DNA backbone and on the membrane so the two can approach each other at all. Pipette gently to mix. Competent cells are fragile and vortexing them costs you efficiency you cannot get back.",
  desc:"KCM being added to the competent cell tube, with a leader from the label to that tube's mouth." },

{ s:{step:5, blk:1, asm:1, dna:1, comp:1, kcm:1, xfer:1, mixed:1},
  cap:"<b>" + P.cells + " µL</b> of cells across into the <b>reaction</b>",
  call:"cells go to the DNA, not the other way round &#183; pipette gently to mix",
  note:"Forty microlitres of the cell and KCM mix across into the assembly reaction. That direction, not the other way: the reaction is the tube you keep. Mix by pipetting gently. The ratio matters too, because everything you add dilutes the salts that are doing the work, so you want the DNA to be about a fifth of the total. Retransforming a miniprep, half a microlitre into ten of cells is plenty.",
  desc:"Forty microlitres transferred from the competent cell tube into the assembly reaction tube, drawn as an arrow between the two tubes." },

{ s:{step:6, blk:1, asm:1, dna:1, mixed:1, out:1},
  cap:"<b>" + P.coldMin + " min</b> on the cold block",
  call:"nothing has gone in yet &#183; the DNA is stuck to the outside of the cells",
  note:"Ten minutes at four degrees, and nothing dramatic is happening that you can see. The DNA and the cells are simply sitting together in the cold with a lot of divalent cations around them. At the end of this the DNA is stuck to the outside of the cells, not inside them. This is the long hold and it is the one people shorten when they are in a hurry, which is exactly the wrong one to shorten.",
  desc:"The assembly reaction tube resting in the cold block, with blue plasmid drawn outside the cells." },

{ s:{step:7, blk:1, asm:1, dna:1, mixed:1, out:1, warm:1},
  cap:"move the tube to the warm block &#183; <b>" + P.heatS + " s</b> at " + P.hotC + " °C",
  call:"move the tube, not the block &#183; this is the step that puts the DNA in",
  note:"Ninety seconds at forty-two, and this is the actual transformation. The jump in temperature makes the membrane briefly permeable and the DNA that was stuck to the outside gets in. Move the tube across rather than reprogramming anything: the whole reason for running two blocks is that the transition is instant. Ninety seconds, and a little longer may work better, but do not wander off.",
  desc:"The tube lifted out of the cold block and seated in the forty-two degree block." },

{ s:{step:8, blk:1, asm:1, dna:1, mixed:1, inside:1},
  cap:"straight back to the cold block &#183; <b>" + P.recoverMin + " min</b>",
  call:"the plasmid is inside now &#183; but the cell has not made anything from it yet",
  note:"Straight back to four degrees for a minute. The cold closes the membrane again and the plasmid is inside. What you have now is a cell carrying your plasmid but not yet expressing anything from it, and that is exactly what decides the next step: it has no resistance protein, so putting it on a plate that demands one is only safe if the antibiotic is slow enough to let it catch up.",
  desc:"The tube returned to the cold block, with the plasmid now drawn inside the cells." },

{ s:{step:9, resc:1},
  cap:"<b>rescue only if it is not Amp or Carb</b> &#183; " + P.rescueUL + " µL 2YT, " +
      P.incC + " °C, " + P.rescueMin + " min – " + P.rescueMaxH + " h",
  call:"not less, not more &#183; ampicillin forgives you the wait, kanamycin does not",
  note:"A branch, not a step. Ampicillin and carbenicillin act on a cell that is already dividing, so a freshly transformed cell has time to make beta-lactamase before the drug can hurt it and you can plate straight away. Every other selection kills faster than that: kanamycin, chloramphenicol, spectinomycin all need the resistance protein to exist before the cell meets the drug. For those, two hundred microlitres of 2YT, move it to a 1.5 millilitre tube, shake at thirty-seven for forty-five minutes to two hours. Not less, because it will not have expressed. Not more, because you start selecting for whichever transformant grew fastest rather than sampling what you made.",
  desc:"The reaction moved to a 1.5 millilitre tube with 2YT and put in a thirty-seven degree shaker." },

{ s:{step:10, plate:1},
  cap:"plate it all, spread with beads, and invert into " + P.incC + " °C overnight",
  call:"and cancel the programs on the thermocycler on your way out",
  note:"All of it onto the plate, spread with beads rather than a spreader, and into the incubator inverted so that condensation collects in the lid instead of running across your colonies and smearing them together. Overnight, and nothing you do now changes the result. Cancel the temperature programs on the way out: a block left at forty-two overnight is the next person's problem and one left at four collects condensation.",
  desc:"The transformation spread on a plate with beads and the plate going inverted into the thirty-seven degree incubator." }
];

window.Deck.sequence("kcm", function(slide){
  const s = G.scene(slide, 800, 846);
  /* section hatching for the cut metal */
  const defs = G.el("defs", {});
  const pat = G.el("pattern", {id:"kcmhatch", width:10, height:10,
    patternUnits:"userSpaceOnUse", patternTransform:"rotate(45)"});
  pat.appendChild(G.el("line", {x1:0, y1:0, x2:0, y2:10,
    stroke:C.muted, "stroke-width":2, "stroke-opacity":".55"}));
  defs.appendChild(pat);
  s.add(defs);
  s.finish();

  function paint(v, f){
    const g = G.el("g", {});
    const half = x => cl(x*2 - 1, 0, 1);
    g.appendChild(timeline(f.s.step));       /* snaps on the click */

    /* ---- plates and the incubator ------------------------------ */
    if (half(v.inc) > 0.02 || half(v.plate) > 0.02){
      const k = grp(Math.max(half(v.inc), half(v.plate)));
      k.appendChild(boxLabel(980, 470, 300, 230, P.incC + " °C incubator",
        v.plate > 0.5 ? "inverted, overnight" : "about " + P.warm + " min to warm and dry"));
      [0, 1, 2].forEach(i => k.appendChild(dish(1130, 522 + i*54, 100)));
      if (v.plate < 0.5){
        [0, 1, 2].forEach(i => k.appendChild(dish(560, 522 + i*54, 100)));
        k.appendChild(path("M720 586H900m-22-16l22 16l-22 16", C.ink, 3));
        k.appendChild(G.text(560, 448, "label the bottoms once dry", 23, C.muted, 400));
        k.appendChild(G.text(560, 720, "date · initials · strain", 21, C.muted, 400));
        k.appendChild(G.text(560, 746, "plasmid · selection", 21, C.muted, 400));
      }
      g.appendChild(k);
    }

    /* ---- the two blocks, cut, and the tubes in them ------------- */
    if (half(v.blk) > 0.02){
      const k = grp(half(v.blk));
      /* tubes are drawn between the block's far wall and its near wall,
         which is the whole point of cutting it open */
      k.appendChild(blockCut(444, 372, WCOLD, v.warm < 0.5, C.blue,
        P.coldC + " °C"));
      k.appendChild(blockCut(870, 372, WHOT, v.warm > 0.5, C.verm,
        P.hotC + " °C"));
      const ax = XASM + (XWARM - XASM)*v.warm;
      if (v.comp > 0.02){
        const t = grp(v.comp * (1 - v.mixed*0.55));
        t.appendChild(tubeCut(XCOMP, 508, C.amber));
        CELLPOS.forEach(function(p){
          const q = inTube(XCOMP, 508, p[0], p[1], 14);
          if (q) t.appendChild(cellAt(q[0], q[1], 1));
        });
        t.appendChild(G.text(XCOMP, 370, "competent cells", 22, C.muted, 400));
        k.appendChild(t);
      }
      if (v.asm > 0.02){
        const t = grp(v.asm);
        t.appendChild(tubeCut(ax, v.mixed > 0.5 ? 508 : 560,
          v.mixed > 0.5 ? C.amber : C.blue));
        const alvl = v.mixed > 0.5 ? 508 : 560;
        if (v.mixed > 0.02)
          CELLPOS.forEach(function(p){
            const q = inTube(ax, alvl, p[0], p[1], 14);
            if (q) t.appendChild(cellAt(q[0], q[1], v.mixed));
          });
        if (v.dna > 0.02 && v.inside < 0.98){
          const d = grp(v.dna * (1 - v.inside));
          DNAPOS.forEach(function(p){
            const q = inTube(ax, alvl, p[0], p[1], 8);
            if (q) d.appendChild(ring(q[0], q[1], 6));
          });
          t.appendChild(d);
        }
        if (v.inside > 0.02){
          const d = grp(v.inside);
          CELLPOS.slice(0, 2).forEach(function(p){
            const q = inTube(ax, alvl, p[0], p[1], 14);
            if (q) d.appendChild(ring(q[0], q[1], 5));
          });
          t.appendChild(d);
        }
        t.appendChild(G.text(ax, 370, "assembly reaction", 22, C.muted, 400));
        k.appendChild(t);
      }
      if (v.kcm > 0.5 && v.xfer < 0.5)
        k.appendChild(reagent(P.kcm + " µL KCM",
          "K⁺, Ca²⁺, Mg²⁺", XCOMP));
      if (v.xfer > 0.5)
        k.appendChild(transfer(XCOMP + 30, XASM - 24, P.cells + " µL of cells"));
      g.appendChild(k);
    }

    /* ---- the rescue branch ------------------------------------- */
    if (half(v.resc) > 0.02){
      const k = grp(half(v.resc));
      k.appendChild(boxLabel(540, 470, 460, 220, P.incC + " °C shaker",
        P.rescueMin + " min – " + P.rescueMaxH + " h"));
      k.appendChild(G.text(700, 444, P.rescueUL + " µL 2YT in a 1.5 mL tube", 24,
        C.ink, 700));
      const V = G.V, ex = 620, ew = 100, etop = 512, eh = 158;
      k.appendChild(V.contents(ex, ew, etop, eh, etop + eh*0.52, C.amber, ".16"));
      k.appendChild(V.eppy(ex, ew, etop, eh));
      [[-20, 112], [16, 130]].forEach(p =>
        k.appendChild(cellAt(ex + ew/2 + p[0], etop + p[1], 1)));
      k.appendChild(G.text(1130, 540, "Amp or Carb?", 24, C.ink, 700));
      k.appendChild(G.text(1130, 572, "skip this — plate now", 22, C.muted, 400));
      k.appendChild(G.text(1130, 618, "anything else?", 24, C.verm, 700));
      k.appendChild(G.text(1130, 650, "it has not made the", 22, C.muted, 400));
      k.appendChild(G.text(1130, 676, "resistance protein yet", 22, C.muted, 400));
      g.appendChild(k);
    }

    /* ---- plating ----------------------------------------------- */
    if (half(v.plate) > 0.02){
      const k = grp(half(v.plate));
      k.appendChild(G.text(560, 448, "spread with beads", 23, C.muted, 400));
      k.appendChild(dish(560, 560, 132, {fill:C.amber}));
      [[-70, 552], [-18, 566], [38, 550], [76, 564], [10, 544]].forEach(p =>
        k.appendChild(G.el("circle", {cx:n1(560 + p[0]), cy:n1(p[1]), r:7,
          fill:C.muted, "fill-opacity":".55", stroke:"none"})));
      k.appendChild(G.text(560, 664, "then invert", 23, C.muted, 400));
      k.appendChild(path("M720 586H900m-22-16l22 16l-22 16", C.ink, 3));
      g.appendChild(k);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
