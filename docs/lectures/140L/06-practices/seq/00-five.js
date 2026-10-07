/* ------------------------------------------------------------------ *
 * 00-five.js — four questions in a row, and a fifth that is not their
 * sum.
 *
 * Was 89 words as a five-item list, and a list is precisely the wrong
 * shape: it puts the fifth question at the bottom of the same column as
 * the other four, where it reads as their conclusion.  It is not their
 * conclusion.  You can have work that is safe, approved, unencumbered
 * and profitable and still answer no — and the harder direction, yes
 * for something that fails all four.
 *
 * SO THE FIFTH IS DRAWN OFF THE ROW, in amber, which is this deck's
 * discussion colour: by the time it appears the room has already learnt
 * that amber means nobody is lecturing.  That is the whole design of
 * the slide and it is why the bracket under the four stops short of it.
 *
 * This is the lecture's map.  The four gloss lines name what each
 * section actually does, so the room can orient from this one frame.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

const BY = 282, BH = 108, BW = 300, GAP = 40;
const X0 = 140;
const bx = i => X0 + i*(BW + GAP);
const XEND = X0 + 4*BW + 3*GAP;

const Q = [
  ["is it safe",  ["risk, containment —", "and whether it can be misused"]],
  ["who says so", ["the committees, and a federal", "policy being rewritten now"]],
  ["who owns it", ["patents, and what a claim", "actually covers"]],
  ["does it pay", ["the arithmetic the field", "keeps declining to do"]]
];

function paint(v, f){
  const g = G.grp();

  if (v.four > 0.02){
    const h = G.grp(v.four);
    Q.forEach(function(q, i){
      h.appendChild(G.box(bx(i), BY, BW, BH, C.ink, C.paper));
      h.appendChild(G.text(bx(i) + BW/2, BY + 40, q[0], 28, C.ink, 700));
      h.appendChild(G.lines(bx(i) + BW/2, BY + 70, q[1], 19, C.muted, 400,
        "middle", 24));
    });
    g.appendChild(h);
  }

  if (v.answers > 0.02){
    const h = G.grp(v.answers);
    h.appendChild(G.path(
      `M ${X0} ${BY + BH + 20} L ${X0} ${BY + BH + 34} ` +
      `L ${XEND} ${BY + BH + 34} L ${XEND} ${BY + BH + 20}`, C.rule, 2.6));
    h.appendChild(G.text((X0 + XEND)/2, BY + BH + 68,
      "these have answers — by tonight you have a method for each",
      26, C.ink, 400));
    g.appendChild(h);
  }

  if (v.fifth > 0.02){
    const h = G.grp(v.fifth);
    h.appendChild(G.el("rect", {x:570, y:528, width:460, height:104, rx:12,
      fill:C.amber, "fill-opacity":0.14, stroke:C.amber, "stroke-width":3}));
    h.appendChild(G.text(800, 570, "should we", 30, C.amber, 700));
    h.appendChild(G.text(800, 602, "everyone who is not in this room",
      21, C.ink, 400));
    h.appendChild(G.text(800, 672,
      "the only one no amount of evidence settles", 25, C.amber, 700));
    g.appendChild(h);
  }

  return g;
}

const FR = [];
const beat = o => FR.push(o);

beat({ on:[], s:{four:1},
  cap:"",
  call:"",
  note:"Here is the shape of the next hundred and ten minutes, and I would like you to be able to see all of it from this one slide. IS IT SAFE — risk, containment, and the question of whether somebody could deliberately turn your work into something else. Say that last part as a deliberate aside: outside the lab it arrives as ONE question, and the first thing the security section does is split it in two, because safety is about accidents and security is about intent, and almost none of the controls we build against the first do anything about the second. The frame is the outsider's, not ours, and taking it apart is part of the day. WHO SAYS SO — the committees, which at this campus means EH and S and an institutional biosafety committee, sitting under a federal policy that is in the middle of being rewritten as we speak. WHO OWNS IT — patents, and specifically what a claim does and does not cover, which is narrower and stranger than people assume. DOES IT PAY — the arithmetic, which is the one the field keeps skipping and the one I think is the real deficiency in how this subject is usually taught.",
  desc:"Four questions in a row: is it safe, who says so, who owns it, does it pay — each with a line saying what that section of the lecture does."});

beat({ on:[], s:{four:1, answers:1},
  cap:"",
  call:"",
  note:"And those four have answers. Not easy ones, and not always the answer you wanted, but they are questions you can get evidence about, and by the end of today you will have a method for each one of them. That is what the bracket means and it is a promise about the day. Pause on it, because the next click is the turn.",
  desc:"A bracket under the four: these have answers, and by tonight you have a method for each."});

beat({ on:[], s:{four:1, answers:1, fifth:1}, dur:1500,
  cap:"",
  call:"",
  note:"And then the fifth, and notice that it is not in the row and not under the bracket. SHOULD WE. Nothing in the first four settles it. You can have a protocol that is safe, approved, unencumbered and profitable, and the answer to should we can still be no — and it can also be YES for something that fails all four, which is the harder direction and the one people forget. The fifth is not the summary of the other four; it is the one they do not reach. It is also drawn in the colour this deck uses whenever the room is doing the talking rather than me, which you will work out within two slides, and it is why the last section of the day is about everyone who is not in this room.",
  desc:"A fifth question set apart from the row, in the deck's discussion colour: should we — everyone who is not in this room, and the only one of the five that no amount of evidence settles."});

window.Deck.sequence("five", function(slide){
  const s = G.scene(slide, 792, 840);
  s.finish();
  return G.run(s, FR, paint);
});
})();
