/* ------------------------------------------------------------------ *
 * 00-trace.js — read the promoters, and the whole procedure falls out.
 *
 * The bridge the source deck was missing.  The slide before this one
 * ends on six lines of growth and one transformation, and says an
 * orchestra of events happens inside the cell; the slide after it is
 * polar mutations, which is a case of that reasoning catching something
 * people miss.  Between them there has to be the reasoning itself.
 *
 * So this is an analysis exercise, and the system is the one they have
 * just seen: every promoter and every origin in the cell, with a lamp
 * on it, walked through the same six conditions.  Nothing here is new
 * mechanism.  What is new is the habit -- ask what is on, ask what that
 * makes, ask what it then does -- which is the habit the next slide
 * punishes you for not having.
 *
 * The ticker across the top is deliberately the previous slide's six
 * lines, in the same order and the same words.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;
const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);

function grp(o){ return G.el("g", {opacity:n1(cl(o == null ? 1 : o, 0, 1))}); }
function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 2.6,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return G.el("path", a);
}

/* ---- the six conditions, which are the six lines of the last slide */
const STEPS = ["Kan · 30°", "+ arabinose", "transform",
               "Spec · Kan", "+ IPTG", "42°"];
const TX0 = 200, TW = 200, TY = 198, TH = 50;

/* ---- every promoter and origin in the cell ------------------------ */
const ROWS = [
  ["Pcon",      "Cas9",                            "pCas",    "cas9"],
  ["repA101ts", "pCas replicates",                 "pCas",    "rep"],
  ["Pbad",      "λ-Red · Gam, Bet, Exo",  "pCas",    "red"],
  ["pMB1",      "pTarget replicates",              "pTarget", "pmb1"],
  ["J23119",    "guide → aspC1",              "pTarget", "g1"],
  ["Plac",      "guide → pMB1",               "pCas",    "g2"]
];
const RY0 = 322, RDY = 64;
const LAMP = 212, DRV = 240, ARR = 422, PRD = 466, MOL = 900;

/* ---- what the lit lamps then do ----------------------------------- */
const EV = {
  1: ["Cas9 is made, and has nothing to aim at.",
      "30\u00b0 is permissive, so pCas replicates."],
  2: ["Gam, Bet and Exo appear.",
      "Gam blocks RecBCD \u2014 which is what will keep a",
      "linear donor alive when it arrives."],
  3: ["pTarget replicates, so its guide is made.",
      "Cas9 finally has a target, and it is the chromosome."],
  4: ["The chromosome is cut. \u03bb-Red repairs it off the donor.",
      "Cells that cannot repair die.",
      "That is the selection \u2014 there is no other one."],
  5: ["A second guide appears, aimed at pMB1.",
      "pTarget cuts its own origin."],
  6: ["repA101ts fails, so pCas cannot replicate.",
      "It is diluted out over a few divisions.",
      "Nothing is left in the cell but the edit."]
};
/* Arabinose is gone by the IPTG growth, so lambda-Red goes with it. */
const ON = {
  1: ["cas9", "rep"],
  2: ["cas9", "rep", "red"],
  3: ["cas9", "rep", "red", "pmb1", "g1"],
  4: ["cas9", "rep", "red", "pmb1", "g1"],
  5: ["cas9", "rep", "g2"],
  6: []
};

const FR = [
{ s:{tbl:1, step:0},
  cap:"before we go on — <b>work it out</b>",
  call:"every line here is a promoter or an origin &#183; which ones are on, and when?",
  note:"Before the next slide, an exercise, because this is the habit the whole back half of the course runs on. Here is every promoter and every origin in that cell. Two plasmids and a chromosome, six switches. The six conditions along the top are the six lines from the slide before: the growths and the transformation, in order. Work down the list. At each condition, which of these are on? What does that make? And what does the thing it made then do? Give them a minute on it before you walk it, because the answer is not hard and the method is the point.",
  desc:"A list of every promoter and origin in the Jiang system, each with an indicator lamp, all currently off, beside the six growth conditions from the previous slide." },

{ s:{tbl:1, step:1, ev:1},
  cap:"<b>Kan &#183; 30&#176;</b> &#183; the strain on its own",
  call:"a nuclease with no guide is an expensive way to do nothing",
  note:"First condition. Kanamycin at thirty degrees, which is just keeping pCas alive. Two things are on. The constitutive promoter makes Cas9, and the temperature sensitive origin works because thirty degrees is permissive for it. So the cell is full of Cas9 and Cas9 does nothing at all, because a guide is the only thing that tells it where to go, and there is no guide in the cell yet.",
  desc:"At Kan and 30 degrees, two lamps are lit: the constitutive promoter making Cas9, and the temperature-sensitive origin replicating pCas." },

{ s:{tbl:1, step:2, ev:1},
  cap:"<b>+ arabinose</b> &#183; and now the order starts to matter",
  call:"Gam blocks RecBCD, which is the only reason a linear donor survives",
  note:"Add arabinose and the araBAD promoter fires, so now there is Gam, Bet and Exo. Still nothing to cut. But look at what Gam does, because this is the answer to why the induction has to come first. Gam inhibits RecBCD, and RecBCD is the nuclease that chews up linear DNA in E. coli. The donor is linear. If you electroporated it into cells that had not been induced, RecBCD would destroy it before anything could use it, the break would have nothing to repair from, and every cell would die. The order is not a convention, it is the mechanism.",
  desc:"Adding arabinose lights the araBAD promoter, so lambda-Red is present: Gam, Bet and Exo." },

{ s:{tbl:1, step:3, ev:1},
  cap:"<b>transform</b> &#183; two molecules arrive at once",
  call:"pTarget brings a constitutive guide &#183; Cas9 finally has an address",
  note:"Now electroporate, and two things land. The donor, which is linear and would already be gone if we had skipped the last step. And pTarget, which has a pMB1 origin so it starts replicating, and a constitutive promoter on its guide, so the guide is made immediately. There is no induction step here and there does not need to be one. The moment pTarget is in the cell, Cas9 has an address, and the address is on the chromosome.",
  desc:"After transformation, pTarget replicates from its pMB1 origin and its J23119 promoter makes the guide against aspC1." },

{ s:{tbl:1, step:4, ev:1},
  cap:"<b>Spec &#183; Kan</b> &#183; everything happens here",
  call:"the cut, the repair, and the death of everything that failed",
  note:"And this growth is where the entire experiment happens. Cas9 plus the guide cuts the chromosome at aspC1. The break is lethal on its own, because E. coli has no non-homologous end joining. Gam has kept the donor intact, Exo chews back a strand to leave overhangs, Bet anneals them to the homology arms, and the deletion is installed. Any cell that did not manage that is dead. Notice that you never selected for the edit. You selected for two plasmids, and the edit is the only way to survive the thing those plasmids do to you.",
  desc:"During the growth on spectinomycin and kanamycin, the chromosome is cut and repaired off the donor, and aspC1 is deleted." },

{ s:{tbl:1, step:5, ev:1},
  cap:"<b>+ IPTG</b> &#183; the plasmid you built removes itself",
  call:"pCas has been carrying a guide against pMB1 the whole time",
  note:"Now IPTG. The lac promoter on pCas fires, and it has been sitting there this whole time carrying a guide aimed at the pMB1 origin. pTarget has a pMB1 origin. So Cas9, which is still present, cuts pTarget, and pTarget is gone, and with it the guide against aspC1. pCas survives this because its origin is repA101, not pMB1. That is a deliberate design choice and you can read it off this table: the one plasmid the guide can reach is the one you want to lose.",
  desc:"IPTG lights the lac promoter, which makes a guide against pMB1, so Cas9 destroys pTarget and its guide with it." },

{ s:{tbl:1, step:6, ev:1},
  cap:"<b>42&#176;</b> &#183; and the last of it goes",
  call:"nothing left in the cell but the edit you meant to make",
  note:"And finally forty-two degrees, which the temperature sensitive origin cannot survive. pCas stops replicating and is diluted out over a few divisions. Every lamp is now off, both plasmids are gone, and what is left is a strain whose chromosome is missing aspC1 and which carries nothing else at all. Markerless, and ready to be used as a parent for the next thing.",
  desc:"At 42 degrees the temperature-sensitive origin fails, pCas is lost, and every lamp is off." },

{ s:{tbl:1, step:6, ev:0, pt:1},
  cap:"none of that needed a mechanism you did not already have",
  call:"read the promoters &#183; ask what is on &#183; ask what it then does",
  note:"Look back at what we just did. We did not need anything except a list of promoters, a list of what they make, and the conditions in order. Everything else followed. That is the habit, and it is the one thing to take out of this lecture if you take nothing else, because from here on you are not designing DNA in a tube, you are predicting what a cell will do with the DNA you gave it. And the next slide is what happens when you do not do it: an edit that is exactly right, in a cell that behaves as though you had deleted something you never touched.",
  desc:"The point of the exercise: the whole procedure was predicted from a list of promoters, what they make, and the order of conditions." }
];

window.Deck.sequence("trace", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v, f){
    const g = G.el("g", {}), st = f.s || {}, step = st.step || 0;
    const lit = ON[step] || [];

    /* ---- the six conditions, in the previous slide's order -------- */
    const t = grp(v.tbl);
    STEPS.forEach(function(lab, i){
      const x = TX0 + TW*i, on = (i + 1) === step;
      t.appendChild(G.el("rect", {x:n1(x), y:TY, width:n1(TW - 12), height:TH,
        rx:7, fill:on ? C.verm : C.muted, "fill-opacity":on ? ".14" : ".05",
        stroke:on ? C.verm : C.muted, "stroke-width":on ? 3 : 1.8}));
      t.appendChild(G.text(x + (TW - 12)/2, TY + 33, lab, 22,
        on ? C.verm : C.muted, on ? 700 : 400));
      if (i < STEPS.length - 1)
        t.appendChild(path("M"+n1(x + TW - 10)+" "+n1(TY + TH/2)+
          "H"+n1(x + TW - 2), C.muted, 1.8));
    });
    g.appendChild(t);

    /* ---- every switch in the cell --------------------------------- */
    ROWS.forEach(function(r, i){
      const y = RY0 + RDY*i, on = lit.indexOf(r[3]) >= 0;
      const row = grp(v.tbl);
      row.appendChild(G.el("circle", {cx:LAMP, cy:n1(y - 8), r:11,
        fill:on ? C.verm : "none", "fill-opacity":on ? ".8" : "0",
        stroke:on ? C.verm : C.muted, "stroke-width":on ? 3 : 2}));
      row.appendChild(G.text(DRV, y, r[0], 24, on ? C.verm : C.muted,
        on ? 700 : 400, "start"));
      row.appendChild(path("M"+ARR+" "+n1(y - 8)+"H"+n1(PRD - 14),
        on ? C.verm : C.muted, 2.2));
      row.appendChild(path("M"+n1(PRD - 22)+" "+n1(y - 14)+"L"+n1(PRD - 14)+" "+n1(y - 8)+
        "L"+n1(PRD - 22)+" "+n1(y - 2), on ? C.verm : C.muted, 2.2));
      row.appendChild(G.text(PRD, y, r[1], 24, on ? C.ink : C.muted,
        on ? 700 : 400, "start"));
      row.appendChild(G.text(MOL, y, "on " + r[2], 19, C.muted, 400, "end"));
      g.appendChild(row);
    });

    /* ---- the chromosome, which is the only thing that matters ----- */
    const ch = grp(v.tbl), done = step >= 4;
    ch.appendChild(G.text(DRV, 706, "chromosome", 22, C.muted, 400, "start"));
    ch.appendChild(G.text(PRD, 706, done ? "ΔaspC1" : "aspC1", 24,
      done ? C.verm : C.ink, 700, "start"));
    if (done) ch.appendChild(G.text(PRD + 108, 706,
      "· and you never selected for it", 20, C.muted, 400, "start"));
    g.appendChild(ch);

    /* ---- and what the lit lamps then do --------------------------- */
    if (v.ev > 0.02 && EV[step]){
      const e = grp(v.ev);
      e.appendChild(path("M960 "+n1(RY0 - 18)+"V"+n1(RY0 - 18 + 46*EV[step].length),
        C.verm, 3));
      EV[step].forEach(function(line, i){
        e.appendChild(G.text(986, RY0 + 8 + i*46, line, 23, C.ink, 400, "start"));
      });
      g.appendChild(e);
    }
    /* ---- the habit, named ----------------------------------------- */
    if (v.pt > 0.02){
      const p = grp(v.pt);
      ["what is on?", "what does it make?", "what does that do?"]
        .forEach(function(q, i){
          p.appendChild(G.text(986, RY0 + 8 + i*54, q, 27, C.verm, 700, "start"));
        });
      g.appendChild(p);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
