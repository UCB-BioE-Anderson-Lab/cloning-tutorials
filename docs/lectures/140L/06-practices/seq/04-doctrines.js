/* ------------------------------------------------------------------ *
 * 04-doctrines.js — three tests, run against one picture.
 *
 * Was 96 words of definitions.  Definitions do not show the thing that
 * matters here, which is that two of these tests can come apart: you
 * can enable something you never possessed.  So all three are applied
 * to the SAME drawing — the class you claimed — and the room watches
 * the third one fail on a picture where the second has just passed.
 *
 * THE CIRCLE IS NOT THE UC CASE.  This slide runs before the case, on
 * purpose, so there are no verdicts and no insulin here: it is a generic
 * genus with generic members.  seq/04-claim.js has already taught the
 * claim as a fence; this is the same fence seen from above.
 *
 * NOTHING IS TAKEN AWAY.  The inward arrows for enablement stay on
 * screen when the filing-date member is marked, because the whole hinge
 * is that both things are true of the same picture at the same time.
 *
 * PROVENANCE: these are the three requirements the Federal Circuit
 * applied in the case that follows.  The statutory section number is
 * deliberately not printed; VERIFY before putting it on a handout.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

const CX = 500, CY = 460, R = 190;
const TX = 880;
const ROW = [322, 452, 582];

/* members of the genus — fixed, so the picture is stable per render */
const MEMBER = [
  [-110,-80],[-30,-120],[60,-100],[130,-40],[-140,10],[-60,-30],[20,-40],
  [110,20],[-100,80],[-20,60],[70,80],[140,70],[-50,130],[40,130]
];
const HELD = [40,130];                  /* the one in the freezer */

function test(y, name, q, aside, col){
  const g = G.el("g", {});
  g.appendChild(G.text(TX, y, name, 29, col, 700, "start"));
  g.appendChild(G.text(TX, y + 32, q, 23, C.ink, 400, "start"));
  g.appendChild(G.text(TX, y + 58, aside, 20, C.muted, 400, "start"));
  return g;
}

function paint(v, f){
  const g = G.grp();

  if (v.genus > 0.02){
    const h = G.grp(v.genus);
    h.appendChild(G.el("circle", {cx:CX, cy:CY, r:R, fill:"none",
      stroke:C.ink, "stroke-width":3, "stroke-dasharray":"10 8"}));
    h.appendChild(G.text(CX, CY - R - 28, "the class you claimed", 27, C.ink, 700));
    MEMBER.forEach(m => h.appendChild(G.el("circle",
      {cx:CX + m[0], cy:CY + m[1], r:11, fill:C.muted, "fill-opacity":0.7})));
    h.appendChild(test(ROW[0], "definiteness", "Can a reader find this edge?",
      "if nobody can, there is no fence", C.ink));
    g.appendChild(h);
  }

  if (v.enable > 0.02){
    const h = G.grp(v.enable);
    /* diagonals, not the axes: a vertical arrow runs straight through
       the title label above and the filing-date label below */
    const K = 0.707;
    [[-K,-K],[K,-K],[-K,K],[K,K]].forEach(function(d){
      const x0 = CX + d[0]*(R + 96), y0 = CY + d[1]*(R + 96);
      const x1 = CX + d[0]*(R + 16), y1 = CY + d[1]*(R + 16);
      h.appendChild(G.arrow(x0, y0, x1, y1, C.blue, 3));
    });
    h.appendChild(test(ROW[1], "enablement", "Could a reader make any of these?",
      "a recipe question", C.blue));
    g.appendChild(h);
  }

  if (v.had > 0.02){
    const h = G.grp(v.had);
    h.appendChild(G.el("circle", {cx:CX + HELD[0], cy:CY + HELD[1], r:16,
      fill:C.verm}));
    h.appendChild(G.path(`M ${CX + HELD[0]} ${CY + HELD[1] + 24} L ${CX + 20} 702`,
      C.verm, 2.4));
    h.appendChild(G.text(CX + 20, 728, "all you had on the day you filed",
      24, C.verm, 700));
    h.appendChild(test(ROW[2], "written description", "Did you show you had it?",
      "a possession question, asked about a date", C.verm));
    g.appendChild(h);
  }

  return g;
}

const FR = [];
const beat = o => FR.push(o);

beat({ on:[], s:{genus:1},
  cap:"",
  call:"",
  note:"Three doctrines that get run together, and I am going to run all three against the same picture so you can see where they come apart. Here is the class you claimed — a genus, with members in it. DEFINITENESS asks whether a reader can tell what is covered. It is a question about the words. If nobody can locate the edge of that circle then there is no fence, and the claim fails for that reason alone, before anybody argues about the science.",
  desc:"A dashed circle, the class you claimed, with members scattered inside it. The first test: definiteness — can a reader find this edge, because if nobody can there is no fence."});

beat({ on:[], s:{genus:1, enable:1}, dur:1500,
  cap:"",
  call:"",
  note:"ENABLEMENT asks whether somebody skilled in the field could make and use the thing without undue experimentation. It is a recipe question: is there enough in this document to go and do it. Those arrows are a reader coming in from outside and being able to reach any member they like. Write out a perfectly good general method for finding a class of genes and you may well have told the world how to get every member of that class. That is enablement, satisfied. Leave the arrows up.",
  desc:"Arrows point inward from outside the circle: enablement, could a reader make any of these — a recipe question."});

beat({ on:[], s:{genus:1, enable:1, had:1},
  cap:"",
  call:"You can enable something you never possessed.",
  note:"WRITTEN DESCRIPTION asks something that sounds like the same question and is not: did you show that you actually HAD the invention. Not could somebody get there — did you have it, on the day you filed. It is a possession question, asked about a date in the past. And now look at the picture, because the arrows are still up. A reader can reach every member of that circle, and you had one of them. Both of those are true at the same time, of the same patent. THAT is the sentence the next ten minutes hang on: you can enable something you never possessed. Those two doctrines can come apart, they do come apart, and when they come apart the patent dies on the one nobody was watching. This is also why a room reading the case cold will keep trying to argue about enablement — it is the one that feels like science. Push them off it.",
  desc:"One member is marked as all you had on the day you filed, while the enablement arrows stay on screen: written description, did you show you had it. The hinge — you can enable something you never possessed."});

window.Deck.sequence("doctrines", function(slide){
  const s = G.scene(slide, 792, 840);
  s.finish();
  return G.run(s, FR, paint);
});
})();
