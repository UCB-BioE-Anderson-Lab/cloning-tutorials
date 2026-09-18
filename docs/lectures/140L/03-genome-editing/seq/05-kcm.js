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
 * The timeline, drawn once.  x maps minutes; the block sequence is too
 * short to read at that scale, so it is expanded on its own strip
 * underneath rather than squashed -- which is what the cheatsheet does.
 * ------------------------------------------------------------------ */
const AX0 = 208, AX1 = 1046, AY = 236;
const K = (AX1 - AX0)/BACK;
const tx = m => AX0 + m*K;
const BX0 = 262, BX1 = 1402, BY = 348;
const BK = (BX1 - BX0)/(BACK - MIX);
const bx = m => BX0 + (m - MIX)*BK;

/* which band of the timeline each beat lights up */
const LIT = ["plates", "echo", "setup", "setup", "cold", "hot", "back",
             "rescue", "plate"];

function band(x0, x1, y, h, on, lab, sub, anchor){
  const g = G.el("g", {}), above = anchor === "start";
  g.appendChild(rect(x0, y, x1 - x0, h,
    {fill:on ? C.verm : C.muted, op:on ? ".22" : ".10",
     stroke:on ? C.verm : C.muted, sw:on ? 2.4 : 1.6, rx:4}));
  const cx = above ? x0 + 2 : (x0 + x1)/2;
  const a = above ? "start" : "middle";
  if (lab) g.appendChild(G.text(above ? x1 + 12 : cx, above ? y + h - 5 : y + h + 22,
    lab, 21, on ? C.verm : C.muted, on ? 700 : 400, a));
  if (sub) g.appendChild(G.text(cx, y + h + 44, sub, 19,
    on ? C.verm : C.muted, 400, a));
  return g;
}

function timeline(step){
  const g = G.el("g", {}), lit = LIT[step];
  /* the two prep jobs, run in parallel before anything else can start */
  g.appendChild(band(tx(0.5), tx(P.warm), 158, 20, lit === "plates",
    "plates: into " + P.incC + " °C, warm, dry, label", null, "start"));
  g.appendChild(band(tx(0), tx(P.cool), 198, 20, lit === "echo",
    "EchoTherm → " + P.coldC + " °C / " + P.hotC + " °C", null, "start"));
  /* the run itself */
  g.appendChild(path("M"+AX0+" "+AY+"H"+n1(AX1), C.ink, 2.6));
  g.appendChild(band(tx(T0), tx(MIX), AY + 4, 26, lit === "setup",
    "~" + P.setup + " min", "set up · hands on"));
  g.appendChild(band(tx(MIX), tx(BACK), AY + 4, 26,
    lit === "cold" || lit === "hot" || lit === "back",
    Math.round(BACK - MIX) + " min", "on the blocks"));
  g.appendChild(G.text(AX0 - 12, AY + 8, "0", 20, C.muted, 400, "end"));
  /* the fork: the rescue is a branch, not a step */
  g.appendChild(path("M"+n1(AX1)+" "+AY+"L"+n1(AX1+46)+" 194H1444", C.ink, 2.6));
  g.appendChild(path("M"+n1(AX1)+" "+AY+"L"+n1(AX1+46)+" 280H1444",
    lit === "rescue" ? C.verm : C.muted, 2.6, "7 6"));
  g.appendChild(G.text(1444, 186, "plate → " + P.incC + " °C overnight", 21,
    lit === "plate" ? C.verm : C.ink, lit === "plate" ? 700 : 400, "end"));
  g.appendChild(G.text(1444, 162, "Amp / Carb — usual", 19, C.muted, 400, "end"));
  g.appendChild(G.text(1444, 306, "+ " + P.rescueMin + " min – " + P.rescueMaxH +
    " h rescue, then plate", 21, lit === "rescue" ? C.verm : C.muted,
    lit === "rescue" ? 700 : 400, "end"));
  g.appendChild(G.text(1444, 272, "any other selection", 19, C.muted, 400, "end"));
  /* the block sequence, expanded, because 90 s does not survive the
     scale that 25 minutes needs */
  g.appendChild(path("M"+n1((tx(MIX)+tx(BACK))/2)+" "+(AY+34)+"V"+(BY-16),
    C.muted, 2, "6 6"));
  g.appendChild(band(bx(MIX), bx(COLD), BY, 26, lit === "cold",
    P.coldMin + " min", P.coldC + " °C"));
  g.appendChild(band(bx(COLD), bx(HOT), BY, 26, lit === "hot",
    P.heatS + " s", P.hotC + " °C"));
  g.appendChild(band(bx(HOT), bx(BACK), BY, 26, lit === "back",
    P.recoverMin + " min", P.coldC + " °C"));
  return g;
}

/* ------------------------------------------------------------------ *
 * The bench kit.
 * ------------------------------------------------------------------ */
/* a PCR tube: flanged rim, short straight wall, long cone */
function pcr(cx, top, w, h){
  const g = G.el("g", {}), x = cx - w/2, sh = top + h*0.38;
  g.appendChild(path("M"+n1(x)+" "+n1(top)+"V"+n1(sh)+"L"+n1(cx)+" "+n1(top+h)+
    "L"+n1(x+w)+" "+n1(sh)+"V"+n1(top)));
  g.appendChild(rect(x - 6, top - 12, w + 12, 12, {rx:2}));
  return g;
}
/* whatever is in it, filling from the tip up to a fraction of the cone */
function pcrFill(cx, top, w, h, frac, col, op){
  const sh = top + h*0.38, x = cx - w/2;
  const y = (top + h) - (h - (sh - top))*cl(frac, 0, 1);
  const half = y >= sh ? (w/2)*((top + h - y)/(top + h - sh)) : w/2;
  const d = y >= sh
    ? "M"+n1(cx-half)+" "+n1(y)+"L"+n1(cx)+" "+n1(top+h)+"L"+n1(cx+half)+" "+n1(y)+"Z"
    : "M"+n1(x)+" "+n1(y)+"V"+n1(sh)+"L"+n1(cx)+" "+n1(top+h)+"L"+n1(x+w)+" "+n1(sh)+
      "V"+n1(y)+"Z";
  return G.el("path", {d:d, fill:col, "fill-opacity":op || ".18", stroke:"none"});
}
function cellAt(x, y, o){
  const g = grp(o == null ? 1 : o);
  g.appendChild(G.el("rect", {x:n1(x-17), y:n1(y-9), width:34, height:18, rx:9,
    fill:C.amber, "fill-opacity":".32", stroke:C.amber, "stroke-width":2}));
  return g;
}
function ring(x, y, r){
  const g = G.el("g", {});
  [r, r - 3.6].forEach(rr => g.appendChild(G.el("circle", {cx:n1(x), cy:n1(y),
    r:n1(rr), fill:"none", stroke:C.blue, "stroke-width":2.2})));
  return g;
}
/* the two-block incubator the whole middle of this protocol happens on */
function echoTherm(hot){
  const g = G.el("g", {}), x = 470, y = 580, w = 660, h = 132;
  g.appendChild(rect(x, y, w, h, {rx:10}));
  g.appendChild(G.text(x + w/2, y + h + 34, "EchoTherm", 23, C.muted, 400));
  [[620, C.blue, P.coldC], [980, C.verm, P.hotC]].forEach(function(q, i){
    const on = (i === 1) === (hot > 0.5);
    g.appendChild(rect(q[0] - 76, y + 16, 152, 58,
      {fill:q[1], op:on ? ".22" : ".08", stroke:q[1], sw:on ? 2.8 : 1.8, rx:6}));
    g.appendChild(G.text(q[0], y + 104, q[2] + " °C", 26, q[1], 700));
  });
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
function squirt(x, y, label, sub, col){
  const g = G.el("g", {});
  g.appendChild(path("M"+n1(x)+" "+n1(y)+"V"+n1(y+56), col || C.ink, 3, "7 6"));
  g.appendChild(path("M"+n1(x-8)+" "+n1(y+44)+"L"+n1(x)+" "+n1(y+58)+"L"+n1(x+8)+
    " "+n1(y+44), col || C.ink, 3));
  g.appendChild(G.text(x, y - 26, label, 25, col || C.ink, 700));
  if (sub) g.appendChild(G.text(x, y - 2, sub, 21, C.muted, 400));
  return g;
}

/* ------------------------------------------------------------------ *
 * The beats.
 * ------------------------------------------------------------------ */
const FR = [
{ s:{step:0, inc:1},
  cap:"plates into the incubator <b>first</b> &#183; they are the slow thing",
  call:"a cold plate carries condensation, and you cannot write on a wet plate",
  note:"Plates first, before anything else, because they are the only slow item on the bench and everything else waits on them. They need about ten minutes at thirty-seven to come up to temperature and dry off. A plate straight out of the fridge has condensation on the agar and on the lid, and you cannot write on a wet plate, so the labelling waits for the drying. Check while you are there that the plate actually carries the antibiotic on your labsheet: plating a transformation onto the wrong selection is a whole day gone and it looks exactly like a failed transformation.",
  desc:"Petri dishes going into a thirty-seven degree incubator, with the timeline above showing the ten minutes they need to warm and dry." },

{ s:{step:1, echo:1},
  cap:"<b>EchoTherm</b> on &#183; cold block " + P.coldC + " °C, warm block " + P.hotC + " °C",
  call:"about two minutes to come down &#183; the cells cannot go on until it is cold",
  note:"Two blocks, set once and left alone for the whole protocol: one at four degrees, one at forty-two. The cold one takes a couple of minutes to come down and nothing can start until it has, which is why it goes on at the same time as the plates rather than when you are ready for it. Leave both running the whole way through. You will be moving tubes between them rather than changing the temperature of either.",
  desc:"The EchoTherm with two blocks, one at four degrees and one at forty-two, with the timeline above showing the two minutes it takes to cool." },

{ s:{step:2, echo:1, tube:1, cells:1},
  cap:"<b>" + P.aliquot + " µL</b> of competent cells on the cold block, thaw ~" + P.thawS + " s",
  call:"then <b>" + P.kcm + " µL KCM</b> &#183; one aliquot does " + P.reactions + " reactions",
  note:"An aliquot of competent cells onto the cold block, and the DNA tube with it. They thaw in about thirty seconds, and you want them thawed and not warm. Then twenty-five microlitres of KCM into the aliquot and pipette gently to mix. KCM is the potassium, calcium and magnesium that makes this work at all, and gentle is the word: competent cells are fragile and vortexing them costs you efficiency. One aliquot of a hundred microlitres does three reactions, so do not open one per sample.",
  desc:"A PCR tube of competent cells on the cold block, with KCM being added." },

{ s:{step:3, echo:1, tube:1, cells:1, kcm:1, dna:1},
  cap:"<b>" + P.cells + " µL</b> of the cell/KCM mix onto the DNA",
  call:"the DNA should be about a fifth of the total &#183; more than that and the salts are too dilute",
  note:"Forty microlitres of the cell and KCM mix onto the DNA, not the other way round, and mix gently again. The ratio matters: the DNA wants to be about a fifth of the total volume, because everything you add dilutes the salts that are doing the work. If you are retransforming a miniprep rather than a ligation, half a microlitre into ten of cells is plenty, and if you are transforming pure DNA you want it diluted ten to twenty fold first. Too much DNA is a real failure mode here and it does not look like too much DNA, it looks like nothing grew.",
  desc:"The cell and KCM mix being added to the DNA tube, with blue plasmid drawn in the tube." },

{ s:{step:4, echo:1, tube:1, cells:1, kcm:1, dna:1, out:1},
  cap:"<b>" + P.coldMin + " min</b> on the cold block",
  call:"the DNA and the cells are together in the cold, and nothing has gone in yet",
  note:"Ten minutes at four degrees. Nothing dramatic is happening that you can see: the DNA and the cells are simply sitting together in the cold with a lot of divalent cations, which screen the charge on the DNA backbone and on the membrane so that the two can get near each other at all. The DNA is stuck to the outside of the cells at the end of this, not inside them. This is the long hold, and it is the one people shorten when they are in a hurry, which is exactly the wrong one to shorten.",
  desc:"The tube sitting on the cold block, with blue plasmid drawn outside the cells." },

{ s:{step:5, echo:1, hot:1, tube:1, cells:1, kcm:1, dna:1, out:1, warm:1},
  cap:"<b>" + P.heatS + " s</b> at " + P.hotC + " °C",
  call:"move the tube, not the block &#183; this is the step that puts the DNA in",
  note:"Ninety seconds at forty-two. This is the actual transformation. The jump in temperature makes the membrane briefly permeable and the DNA that was stuck to the outside gets in. Move the tube across to the warm block rather than reprogramming anything, because the whole point of running two blocks is that the transition is instant. The protocol says ninety seconds and a bit longer may work better, but do not wander off: this is the step where a minute of inattention costs you the experiment.",
  desc:"The tube moved across to the forty-two degree block, with a plasmid drawn entering a cell." },

{ s:{step:6, echo:1, tube:1, cells:1, kcm:1, dna:1, inside:1},
  cap:"<b>" + P.recoverMin + " min</b> back on the cold block",
  call:"the plasmid is inside now &#183; the cells still have to be rescued or plated",
  note:"Straight back to four degrees for a minute. The cold closes the membrane again and the plasmid is inside. What you have at this point is a cell carrying your plasmid but not yet expressing anything from it, which matters for what happens next: it has no resistance protein yet, so putting it on a plate that requires one is only safe if the antibiotic is slow enough to let it catch up.",
  desc:"The tube back on the cold block, with the plasmid now drawn inside a cell." },

{ s:{step:7, resc:1},
  cap:"<b>rescue only if it is not Amp or Carb</b> &#183; " + P.rescueUL + " µL 2YT, " +
      P.incC + " °C, " + P.rescueMin + " min – " + P.rescueMaxH + " h",
  call:"not less, not more &#183; ampicillin forgives you the wait, kanamycin does not",
  note:"This is a branch and not a step, which is why the timeline draws it hanging off the side. Ampicillin and carbenicillin work on a cell that is already dividing, so a freshly transformed cell has time to make beta-lactamase before the drug can hurt it, and you can plate straight away. Every other selection kills faster than that: kanamycin, chloramphenicol, spectinomycin all need the cell to have made the resistance protein before it meets the drug. So for those, two hundred microlitres of 2YT, move it to a 1.5 millilitre tube, and shake at thirty-seven for forty-five minutes to two hours. Not less, because it will not have expressed. Not more, because you start selecting for whichever transformant grew fastest rather than sampling what you made.",
  desc:"The reaction moved to a 1.5 millilitre tube with 2YT and put in a thirty-seven degree shaker, drawn hanging off the main timeline as a branch." },

{ s:{step:8, plate:1},
  cap:"plate it all, spread with beads, and invert into " + P.incC + " °C overnight",
  call:"and cancel the programs on the thermocycler on your way out",
  note:"All of it onto the plate, spread with beads rather than a spreader, and into the incubator inverted so that condensation collects in the lid instead of running across your colonies and smearing them into each other. Overnight, and nothing you do now changes the result. Cancel the temperature programs on the way out: an EchoTherm left at forty-two overnight is the next person's problem and a block left at four collects condensation.",
  desc:"The transformation spread on a plate with beads and the plate going inverted into the thirty-seven degree incubator." }
];

window.Deck.sequence("kcm", function(slide){
  const s = G.scene(slide, 800, 846);
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

    /* ---- the blocks, and the tube that moves between them ------- */
    if (half(v.echo) > 0.02){
      const k = grp(half(v.echo));
      k.appendChild(echoTherm(v.warm));
      if (v.tube > 0.02){
        const cx = 620 + 360*v.warm, top = 462, w = 110, h = 190;
        const t = grp(v.tube);
        if (v.cells > 0.02)
          t.appendChild(pcrFill(cx, top, w, h, 0.78, C.amber, ".20"));
        t.appendChild(pcr(cx, top, w, h));
        /* WHERE THE PLASMID IS, at every beat: loose in the tube until
           the heat shock, then inside a cell.  That is the one thing the
           protocol text cannot show and the whole reason to draw it. */
        const CELLS = [[-14, 62], [12, 84], [-4, 104]];
        if (v.cells > 0.02)
          CELLS.forEach(p => t.appendChild(cellAt(cx + p[0], top + p[1], v.cells)));
        if (v.dna > 0.02 && v.inside < 0.98){
          const d = grp(v.dna * (1 - v.inside));
          [[20, 54], [-22, 76], [18, 96]].forEach(p =>
            d.appendChild(ring(cx + p[0], top + p[1], 8)));
          t.appendChild(d);
        }
        if (v.inside > 0.02){
          const d = grp(v.inside);
          CELLS.slice(0, 2).forEach(p =>
            d.appendChild(ring(cx + p[0], top + p[1], 6)));
          t.appendChild(d);
        }
        k.appendChild(t);
      }
      if (v.kcm < 0.5 && v.cells > 0.5)
        k.appendChild(squirt(620, 486, P.kcm + " µL KCM",
          "K⁺, Ca²⁺, Mg²⁺", C.ink));
      if (v.kcm > 0.5 && v.out < 0.5 && v.inside < 0.5)
        k.appendChild(squirt(620, 486, P.cells + " µL cell/KCM mix",
          "onto the DNA", C.ink));
      g.appendChild(k);
    }

    /* ---- the rescue branch ------------------------------------- */
    if (half(v.resc) > 0.02){
      const k = grp(half(v.resc));
      k.appendChild(boxLabel(540, 470, 460, 220, P.incC + " °C shaker",
        P.rescueMin + " min – " + P.rescueMaxH + " h"));
      k.appendChild(G.text(700, 444, P.rescueUL + " µL 2YT in a 1.5 mL tube", 24,
        C.ink, 700));
      /* the real thing, from the shared glassware, because this is the
         same 1.5 mL Eppendorf the miniprep slides draw */
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
