/* ------------------------------------------------------------------ *
 * 06-rooms.js — who convened the meeting decides what may be asked.
 *
 * Was 143 words in two columns, the densest slide in the deck.  The
 * argument is not a list of facts about two meetings, it is a picture
 * of two rooms: who is sitting in them, and where the scientists are.
 * Draw the rooms and the question each one is capable of producing
 * follows from the seating, which is the entire point.
 *
 * THE SCIENTISTS ARE THE SAME DOTS IN BOTH ROOMS.  Same colour, same
 * size, moved from the middle of the left room to a witness bench
 * outside the circle on the right.  Nothing about them changed; only
 * where they sit changed, and the question changed with it.
 *
 * Section 01 already shows the Cambridge hearing footage.  This does
 * NOT re-tell it — the note channel opens by acknowledging the room
 * has seen it, and asks a different question of both meetings.
 *
 * NOTHING IS NAMED THAT IS NOT SOURCED.  No years, no attendance, no
 * moratorium lengths, no findings.  All of that is VERIFY in the note.
 * The argument does not use a single date.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

const RY = 268, RH = 300, RW = 600;
const LX = 150, RX = 850;

/* a row of people, because "who is in the room" has to be seeable */
function crowd(cx, cy, n, col, per){
  const g = G.el("g", {});
  const cols = per || 8, gap = 42;
  for (let i = 0; i < n; i++){
    const r = Math.floor(i/cols), c = i % cols;
    const wide = Math.min(n - r*cols, cols);
    g.appendChild(G.el("circle", {
      cx: cx + (c - (wide - 1)/2)*gap, cy: cy + r*gap,
      r: 13, fill: col, "fill-opacity": 0.85 }));
  }
  return g;
}

function room(x, title, sub, col){
  const g = G.el("g", {});
  g.appendChild(G.box(x, RY, RW, RH, col, C.paper));
  g.appendChild(G.text(x + RW/2, RY - 38, title, 34, col, 700));
  g.appendChild(G.text(x + RW/2, RY - 10, sub, 23, C.muted, 400));
  return g;
}

function paint(v, f){
  const g = G.grp();

  /* ---- the field convenes itself ---------------------------------- */
  if (v.asilomar > 0.02){
    const h = G.grp(v.asilomar);
    h.appendChild(room(LX, "Asilomar", "the field convened itself", C.ink));
    h.appendChild(crowd(LX + RW/2, RY + 96, 24, C.ink));
    h.appendChild(G.text(LX + RW/2, RY + 252, "scientists", 24, C.muted, 400));
    h.appendChild(G.text(LX + RW/2, RY + RH + 66, "HOW", 42, C.ink, 700));
    h.appendChild(G.text(LX + RW/2, RY + RH + 106,
      "do we do this safely?", 28, C.ink, 400));
    g.appendChild(h);
  }

  /* ---- a city convenes the field ---------------------------------- */
  if (v.cambridge > 0.02){
    const h = G.grp(v.cambridge);
    h.appendChild(room(RX, "Cambridge", "a city convened the field", C.verm));
    h.appendChild(crowd(RX + RW/2, RY + 50, 24, C.verm));
    h.appendChild(G.text(RX + RW/2, RY + 186, "residents and councillors",
      24, C.muted, 400));

    /* the same dots as the left room, moved to a bench at the edge */
    h.appendChild(G.path(`M ${RX + 150} ${RY + 206} L ${RX + RW - 150} ${RY + 206}`,
      C.rule, 2.5));
    h.appendChild(crowd(RX + RW/2, RY + 236, 5, C.ink));
    h.appendChild(G.text(RX + RW/2, RY + 274, "scientists, as witnesses",
      24, C.muted, 400));

    h.appendChild(G.text(RX + RW/2, RY + RH + 66, "WHETHER", 42, C.verm, 700));
    h.appendChild(G.text(RX + RW/2, RY + RH + 106,
      "should this be done here?", 28, C.verm, 400));
    g.appendChild(h);
  }

  return g;
}

const FR = [];
const beat = o => FR.push(o);

beat({ on:[], s:{asilomar:1},
  cap:"",
  call:"",
  note:"You have already met Cambridge — the hearing footage in the risk section, a city council arguing about recombinant DNA three years after it became possible. I am not going to re-tell it. I want to put it beside the other thing that happened in that decade and ask a different question of both: not what was decided, but WHO CALLED THE MEETING. Asilomar is the field regulating itself. Scientists convened scientists, paused categories of their own work voluntarily, and drafted containment practices which became the basis of the rules they then worked under. It is genuinely admirable and it is taught as the field's founding act of responsibility, which it largely was. But look at the room, because the room is the argument. The field set the agenda, chose who was in it, framed the question and arrived with the answer. And the question it could put on the table was HOW do we do this safely — a question with a technical answer, asked of exactly the people able to give one.",
  desc:"A room with the field inside it: Asilomar, where the field convened itself. The room is scientists, and the question it produces is how do we do this safely."});

beat({ on:[], s:{asilomar:1, cambridge:1}, dur:1500,
  cap:"",
  call:"",
  note:"Now the other room, and look at where the scientists are sitting. The convener is an elected city government. The room is residents and councillors. The scientists are the same people — same dots — but they are on a bench at the edge as witnesses rather than hosts. And the question is not how. It is WHETHER. Should this happen here, in this city, around these people. THAT QUESTION DOES NOT HAVE A TECHNICAL ANSWER, which is exactly why the room felt to the scientists as though it were being unreasonable. It was not being unreasonable. It was asking a question that was not theirs to answer.",
  desc:"The second room: Cambridge, where a city convened the field. The room is residents and councillors; the scientists are the same figures, moved to a witness bench at the edge. The question it produces is whether this should be done here."});

beat({ on:[], s:{asilomar:1, cambridge:1},
  cap:"Same technology. Same decade. Same arguments.",
  call:"Who is in the room decides what the question is allowed to be.",
  note:"THE LINE TO LAND: who is in the room decides what the question is allowed to be. Asilomar could not have produced a moratorium decided by non-scientists, and Cambridge could not have produced a containment manual. Each meeting got the kind of rule its convener was capable of making. AND THE USE OF IT, because this is not a history lesson. You will be in both rooms. When your field convenes itself — a consortium, a standards body, a voluntary code — it is doing something valuable AND it is keeping control of the terms. Both are true at once, and noticing the second is not cynicism, it is literacy. The question to carry out of here: on this particular decision, is 'how' the right question, or is somebody owed 'whether'? VERIFY before stating any of this precisely: the year of the Asilomar conference, who convened it, what the preceding moratorium covered and for how long, what the conference produced, and whether the resulting guidance was adopted as written. Also the length of the Cambridge moratorium and the composition and findings of the citizens' review board. None of that is in this deck's sourced facts, none of it is on the slide on purpose, and the argument does not depend on a single date.",
  desc:"The closing line: same technology, same decade, same arguments, and the two rooms produced different kinds of rule — who is in the room decides what the question is allowed to be."});

window.Deck.sequence("rooms", function(slide){
  const s = G.scene(slide, 792, 840);
  s.finish();
  return G.run(s, FR, paint);
});
})();
