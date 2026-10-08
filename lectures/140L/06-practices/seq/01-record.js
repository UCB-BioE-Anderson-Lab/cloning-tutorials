/* ------------------------------------------------------------------ *
 * 01-record.js — fifty clean years, and what they do not tell you.
 *
 * This is the spine of section 01, and it is the one build in the
 * section that unambiguously earns its clicks: the last beat changes
 * what the first one meant.  Drawn as a timeline that stays on screen
 * while three competing explanations of it are laid underneath, because
 * the argument is not about the record — everyone agrees about the
 * record — it is about which of three stories produced it.
 *
 * NOTHING IS TAKEN AWAY.  The timeline is still there under the three
 * explanations at the final beat, because the point is that all three
 * are consistent with it.  Fading it out would say "forget the record",
 * which is the opposite of the argument.
 *
 * PROVENANCE, and this is deliberate: there is not a single number on
 * this drawing other than two years.  "No major incident" is a
 * chronology claim, not a statistic — there is no incident count, no
 * laboratory count and no rate here, because none of those are sourced.
 * The note channel says so out loud.  Do not add one later without a
 * primary source; the argument does not need it and is in fact stronger
 * without it, since the whole point is that the record is not a
 * measurement of anything.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

/* The whole vertical budget of this slide, worked out once here because
   four things have to stack under an h1 without touching: the timeline
   and its labels, the two-line turn, the three boxes, and the closing
   pair.  Content box is y 86-830 and the title eats down to about 206. */
const X0 = 190, X1 = 1410, YL = 300;      /* the timeline */
const BY = 486, BH = 218, BW = 376, BX = [190, 602, 1014];

const WHY = [
  { k:"w1", t:"It is intrinsically safe",
    claim:["the biology cannot do the harm,", "whatever we happen to do to it"],
    pred:["then the record holds even as", "the work stops resembling the work"],
    col:"#004373" },
  { k:"w2", t:"The controls worked",
    claim:["containment, review, training —", "they caught what there was to catch"],
    pred:["then it holds exactly as long as", "the controls do, and no longer"],
    col:"#a99011" },
  { k:"w3", t:"We have been lucky",
    claim:["the distribution has a tail and", "we have not reached it yet"],
    pred:["then it tells you nothing at all", "about the next fifty"],
    col:"#ba3a13" }
];

function why(i, o){
  const w = WHY[i], g = G.grp(o), x = BX[i];
  g.appendChild(G.el("rect", {x:x, y:BY, width:BW, height:BH, rx:16,
    fill:C.paper, stroke:w.col, "stroke-width":2.6}));
  g.appendChild(G.text(x + BW/2, BY + 42, w.t, 25, w.col, 700));
  g.appendChild(G.lines(x + BW/2, BY + 78, w.claim, 19, C.muted, 400, "middle", 24));
  /* the rule separates what the story claims from what it predicts;
     the prediction is the half that distinguishes the three */
  g.appendChild(G.path("M" + (x + 34) + " " + (BY + 126) +
                       "L" + (x + BW - 34) + " " + (BY + 126), C.rule, 2));
  g.appendChild(G.text(x + BW/2, BY + 150, "so the next fifty years:", 16, C.muted, 700));
  g.appendChild(G.lines(x + BW/2, BY + 176, w.pred, 19, w.col, 700, "middle", 23));
  return g;
}

function paint(v, f){
  const g = G.el("g", {});

  if (v.line > 0.02){
    const h = G.grp(v.line);
    h.appendChild(G.path("M" + X0 + " " + YL + "L" + (X0 + (X1 - X0)*v.line) + " " + YL,
      C.ink, 4));
    h.appendChild(G.path("M" + X0 + " " + (YL - 16) + "L" + X0 + " " + (YL + 16), C.ink, 4));
    h.appendChild(G.text(X0, YL + 42, "1973", 24, C.ink, 700, "start"));
    h.appendChild(G.text(X0, YL + 68,
      "a gene cloned into a plasmid with restriction enzymes",
      19, C.muted, 400, "start"));
    if (v.line > 0.96){
      h.appendChild(G.path("M" + X1 + " " + (YL - 16) + "L" + X1 + " " + (YL + 16), C.ink, 4));
      h.appendChild(G.text(X1, YL + 42, "today", 24, C.ink, 700, "end"));
    }
    h.appendChild(G.text(800, YL - 30,
      "no major incident attributable to recombinant work", 27, C.ink, 700));
    g.appendChild(h);
  }

  if (v.ask > 0.02){
    const h = G.grp(v.ask);
    h.appendChild(G.text(800, 410, "That is evidence. It is evidence about the past.",
      25, C.muted, 400));
    h.appendChild(G.text(800, 450, "An absence of incidents is not a mechanism.",
      31, C.verm, 700));
    g.appendChild(h);
  }

  /* the three explanations sit UNDER the record, which stays on screen:
     the argument is that all three are consistent with it, so taking it
     away at the moment of comparison would say the opposite */
  if (v.three > 0.02)
    WHY.forEach(function(w, i){ g.appendChild(why(i, v.three)); });

  if (v.point > 0.02){
    const h = G.grp(v.point);
    h.appendChild(G.text(800, 748,
      "The record you have is consistent with all three.", 28, C.blue, 700));
    h.appendChild(G.text(800, 784,
      "They do not have the same next fifty years — and the record cannot tell you which one you are in.",
      22, C.muted, 400));
    g.appendChild(h);
  }
  return g;
}

const FR = [];
let acc = {};
function beat(o){
  acc = Object.assign({}, acc, o.s || {});
  FR.push(Object.assign({}, o, {s:Object.assign({}, acc)}));
}

beat({ on:[], s:{line:1}, dur:1500,
  cap:"", call:"",
  note:"Start with the thing everybody agrees on. Gene cloning as a technique dates from the early nineteen seventies — a gene into a plasmid with restriction enzymes, which is the experiment this whole course is downstream of. From there to now is about fifty years, and in that time there has been no major incident attributable to recombinant work. No escaped engineered organism that caused an epidemic, no laboratory-origin outbreak from this kind of work. That is a remarkable record for a technology this widespread, and people reach for it constantly in public arguments, including me. PROVENANCE, and I want to be honest about this: that is a chronology claim, not a statistic. I am not giving you a number of laboratories, a count of incidents, or an accident rate, because I do not have sourced ones and neither does almost anybody who says this. What I am claiming is that in fifty years nothing of that kind has happened, dating the fifty from the first recombinant plasmids — and the exact starting date is worth checking before you quote a number from a podium.",
  desc:"A timeline from 1973, when a gene was first cloned into a plasmid using restriction enzymes, to today, with the line reading: no major incident attributable to recombinant work."});

beat({ on:[], s:{ask:1},
  cap:"", call:"",
  note:"And here is the sentence I want you to take out of this section. That record is evidence, and it is evidence about the past. An absence of incidents is not a mechanism. It tells you what did not happen; it does not tell you why nothing happened. And if you cannot say why, you cannot say anything about what happens next — which is the only question anybody actually cares about.",
  desc:"The turn: that is evidence, and it is evidence about the past. An absence of incidents is not a mechanism."});

beat({ on:[], s:{three:1}, dur:1500,
  cap:"", call:"",
  note:"There are at least three stories that produce exactly the record we have, and I want you to look at how different they are. One: the work is intrinsically safe — the biology simply cannot do the harm, whatever we do to it. Two: the controls worked — containment, committee review, training, and they caught what there was to catch. Three: we have been lucky — the distribution of outcomes has a tail and we have not reached it yet. Now read the bottom half of each box, because that is where they come apart. If it is intrinsically safe, the record holds even as the work stops resembling the work it used to be. If it was the controls, the record holds exactly as long as the controls do and not one day longer — so weakening them is not free. And if it was luck, the record tells you nothing whatsoever about the next fifty years.",
  desc:"Three explanations of the record drawn side by side, each with what it predicts. Intrinsically safe: the biology cannot do the harm, so the record holds even as the work changes. The controls worked: containment, review and training caught what there was to catch, so the record holds as long as the controls do. We have been lucky: the distribution has a tail we have not reached, so the record predicts nothing."});

beat({ on:[], s:{point:1},
  cap:"", call:"",
  note:"And the point. The record you have is consistent with all three of those, equally. It does not distinguish between them, and no amount of additional clean years will, because every clean year is predicted by all three. Which means that when somebody says — and they will say it, in a hearing, in a grant review, in a newspaper — fifty years and nothing has gone wrong, the honest response is: yes, and which of these three is your argument? Because they lead to completely different policies. The first says relax the controls, they were never what was doing the work. The second says do not touch the controls, they are the only reason the record exists. The third says the record is not an argument at all. Everything in the rest of this lecture — committees, containment levels, screening, review — is somebody's bet on which of those three is true. You should know which one you are betting on.",
  desc:"The closing line: the record is consistent with all three explanations, they do not have the same next fifty years, and the record cannot tell you which one you are in."});

window.Deck.sequence("record", function(slide){
  const s = G.scene(slide, 812, 852);
  s.finish();
  return G.run(s, FR, paint);
});
})();
