/* ------------------------------------------------------------------ *
 * 06-judge.js — competence and interest arrive together.
 *
 * Was 113 words.  The argument is a Venn and nothing else: the set of
 * people who know enough to judge this work, and the set of people who
 * need it to continue, are very nearly the same set.  Drawn, the room
 * reaches the uncomfortable part by itself, which is the only way it
 * lands — told, it sounds like an accusation and the room defends.
 *
 * THE LENS IS THE SLIDE.  Both circles are drawn full and the overlap
 * is filled, rather than drawing one circle inside the other, because
 * the claim is not that every expert is compromised.  It is that the
 * overlap is most of both circles and there is no arrangement of the
 * field in which it is not.
 *
 * NOTHING IS TAKEN AWAY.  Both circles are still on screen under the
 * lens and under the closing line.
 *
 * PROVENANCE: the conflict-of-interest framing is JCA's own, from the
 * source deck's perception slide.  Nothing here needs a citation and
 * none should be invented.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

const CY = 470, R = 240;
const CXL = 640, CXR = 960;            /* d = 320, so the lens is wide */

function paint(v, f){
  const g = G.grp();

  if (v.a > 0.02){
    const h = G.grp(v.a);
    h.appendChild(G.el("circle", {cx:CXL, cy:CY, r:R,
      fill:"none", stroke:C.ink, "stroke-width":3}));
    h.appendChild(G.lines(CXL - 150, CY - 14,
      ["knows enough", "to judge the risk"], 27, C.ink, 700, "middle", 36));
    g.appendChild(h);
  }

  if (v.b > 0.02){
    const h = G.grp(v.b);
    h.appendChild(G.el("circle", {cx:CXR, cy:CY, r:R,
      fill:"none", stroke:C.blue, "stroke-width":3}));
    h.appendChild(G.lines(CXR + 150, CY - 14,
      ["needs the work", "to continue"], 27, C.blue, 700, "middle", 36));
    g.appendChild(h);
  }

  /* the lens, approximated — an ellipse on the intersection, which is
     close enough at these radii and far easier to read than a clip */
  if (v.lens > 0.02){
    const h = G.grp(v.lens);
    h.appendChild(G.el("ellipse", {cx:(CXL + CXR)/2, cy:CY, rx:80, ry:178,
      fill:C.amber, "fill-opacity":0.22, stroke:C.amber, "stroke-width":3}));
    h.appendChild(G.lines((CXL + CXR)/2, CY - 18,
      ["the", "same", "people"], 27, C.amber, 700, "middle", 36));
    g.appendChild(h);
  }

  return g;
}

const FR = [];
const beat = o => FR.push(o);

beat({ on:[], s:{a:1},
  cap:"Who knows enough to say whether a gene drive is dangerous?",
  call:"",
  note:"Here is the uncomfortable version of the perception problem, and it is the one worth teaching, because the comfortable version — 'the public does not understand the science' — is both self-serving and mostly false. Start with the honest question. Who knows enough about a gene drive to say whether it is dangerous? Somebody who has spent a decade building them. There is no shortcut to that competence and no substitute for it. Let that circle sit on its own for a second.",
  desc:"One circle: the people who know enough to judge the risk of this work."});

beat({ on:[], s:{a:1, b:1},
  cap:"Whose salary, students, grants and reputation depend on it continuing?",
  call:"",
  note:"Now the second question, and ask it before you draw the conclusion. Whose salary, whose students, whose grants and whose reputation all depend on that work continuing? Let the room answer. They will see it coming, and it is much better that they see it coming than that I announce it.",
  desc:"A second circle: the people who need the work to continue."});

beat({ on:[], s:{a:1, b:1, lens:1}, dur:1500,
  cap:"Including me. Including, shortly, you.",
  call:"",
  note:"It is the same people. Me. And in about four years, several of you. SAY PLAINLY THAT THIS IS NOT AN ACCUSATION, and say it here rather than later, because the room will relax a great deal faster if you get it out early. Nobody is lying. It is a structural fact about expertise: competence and interest arrive together, because the only way to become competent is to invest your life in the thing. Look at the picture — there is no way to pull those circles apart. There is no arrangement of this field in which the experts are disinterested, and you cannot fix it by being honest, because the bias it describes is not dishonesty. It is the shape of what looks obvious to you.",
  desc:"The overlap is filled and labelled: it is the same people — including the lecturer, and shortly the students."});

beat({ on:[], s:{a:1, b:1, lens:1},
  cap:"",
  call:"Which is why review comes from outside. Not because anyone lies.",
  note:"And THAT is the whole argument for outside review. Not that scientists need policing — that nobody is a good judge of their own work, and a system which relies on them being one has a known defect in it. Then the turn back to where we started today, and this is the one to land. Remember the GFP E. coli: we assert that it cannot be dangerous, and the mechanistic basis for ruling it out has never been established. Put the two together. A field asserts safety from habit rather than from an established basis — and the people doing the asserting are the people who need the answer to come out that way. That is not a conspiracy. It is two ordinary things that happen to compound, and it is exactly what an outsider sees when they look at us. [If the Cambridge footage was played in the risk section, note that the conflict-of-interest question in it is asked by a city councillor, not by a scientist.]",
  desc:"The closing line: this is why review comes from outside — not because scientists lie, but because nobody is a disinterested judge of their own work."});

window.Deck.sequence("judge", function(slide){
  const s = G.scene(slide, 792, 840);
  s.finish();
  return G.run(s, FR, paint);
});
})();
