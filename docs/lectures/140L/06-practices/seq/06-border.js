/* ------------------------------------------------------------------ *
 * 06-border.js — the obligation attaches at a crossing that no longer
 * happens.
 *
 * This slide used to be 110 words of prose, which is the wrong shape
 * for it, because the argument IS a geometry: there is a border, the
 * duty was fastened to the act of carrying something across it, and
 * the thing that crosses now is a file.  Drawn, the room sees the
 * loophole before the sentence describing it has finished.
 *
 * NOTHING IS TAKEN AWAY.  The material route and its clasp stay on
 * screen when the sequencing route appears underneath, because the
 * whole point is that the old rule is still there and still intact —
 * it simply has nothing passing through it any more.  Fading it out
 * would say "the rule was repealed", which is the opposite.
 *
 * NOTHING IS NAMED.  The instrument is not on the drawing, the same
 * decision the prose version made, and for the same reason: none of
 * its dates, parties or requirements are in this deck's sourced facts.
 * The note channel names it with a VERIFY.  The argument does not use
 * the name and is not weakened by its absence.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

/* One vertical budget, worked out once.  The title eats to about 206,
   the caption starts at 792, so everything lives between 250 and 740.
   Two routes stack: material at y 470, information at y 670. */
const BX = 800;                        /* the border */
const BY0 = 250, BY1 = 740;
const LX = 250, RX = 1050, BW = 300;   /* the two boxes */
const TOP = 300, BH = 110;
const Y_MAT = 440, Y_BEN = 580, Y_INF = 690;

function paint(v, f){
  const g = G.grp();

  /* ---- the border itself, always on ------------------------------ */
  g.appendChild(G.path(`M ${BX} ${BY0} L ${BX} ${BY1}`, C.muted, 2.5, "9 9"));
  g.appendChild(G.text(BX, BY0 - 14, "the border", 21, C.muted, 400));

  /* ---- beat 1: the principle ------------------------------------- */
  if (v.principle > 0.02){
    const h = G.grp(v.principle);

    h.appendChild(G.box(LX, TOP, BW, BH, C.ink, C.paper));
    h.appendChild(G.text(LX + BW/2, TOP + 52, "the sample", 29, C.ink, 700));
    h.appendChild(G.text(LX + BW/2, TOP + 86, "collected here", 22, C.muted, 400));

    h.appendChild(G.box(RX, TOP, BW, BH, C.ink, C.paper));
    h.appendChild(G.text(RX + BW/2, TOP + 52, "what gets made", 29, C.ink, 700));
    h.appendChild(G.text(RX + BW/2, TOP + 86, "from it", 22, C.muted, 400));

    /* the material route, and the value coming back */
    h.appendChild(G.arrow(LX + BW + 15, Y_MAT, RX - 15, Y_MAT, C.ink, 3));
    h.appendChild(G.text(BX, Y_MAT - 20, "someone carries it across", 24, C.ink, 400));

    h.appendChild(G.arrow(RX - 15, Y_BEN, LX + BW + 15, Y_BEN, C.blue, 3));
    h.appendChild(G.text(BX, Y_BEN + 34, "a share of what comes back", 24, C.blue, 400));

    g.appendChild(h);
  }

  /* ---- beat 2: the duty is fastened to the crossing --------------- */
  if (v.hook > 0.02){
    const h = G.grp(v.hook);
    h.appendChild(G.el("circle", {cx:BX, cy:Y_MAT, r:17,
      fill:C.paper, stroke:C.verm, "stroke-width":4}));
    h.appendChild(G.text(BX, Y_MAT + 8, "!", 26, C.verm, 700));
    h.appendChild(G.text(BX, Y_MAT + 56, "the duty attaches HERE,", 25, C.verm, 700));
    h.appendChild(G.text(BX, Y_MAT + 86, "to the crossing", 25, C.verm, 700));
    g.appendChild(h);
  }

  /* ---- beat 3: sequence it where it is --------------------------- */
  if (v.seqr > 0.02){
    const h = G.grp(v.seqr);

    /* the sample stays put, and says so */
    h.appendChild(G.text(LX + BW/2, TOP + BH + 38, "never moves", 23, C.verm, 700));

    h.appendChild(G.box(LX, Y_INF - 50, BW, 100, C.ink, C.paper));
    h.appendChild(G.text(LX + BW/2, Y_INF + 8, "sequence it here", 27, C.ink, 700));

    /* information crosses, under the clasp, touching nothing */
    h.appendChild(G.arrow(LX + BW + 15, Y_INF, RX - 15, Y_INF, C.blue, 3));
    h.appendChild(G.text(BX, Y_INF - 20, "a file crosses", 25, C.blue, 700));

    h.appendChild(G.text(RX + BW/2, Y_INF + 8, "all of the value", 27, C.blue, 700));
    g.appendChild(h);
  }

  /* ---- beat 4: and so ------------------------------------------- */
  if (v.ask > 0.02){
    const h = G.grp(v.ask);
    h.appendChild(G.el("rect", {x:BX - 258, y:Y_MAT - 34, width:516, height:68,
      rx:10, fill:"none", stroke:C.amber, "stroke-width":3, "stroke-dasharray":"8 7"}));
    h.appendChild(G.text(BX, Y_MAT - 74, "intact, and bypassed", 23, C.amber, 700));
    g.appendChild(h);
  }

  return g;
}

const FR = [];
const beat = o => FR.push(o);

beat({ on:[], s:{principle:1},
  cap:"The country it came from has a claim on what is made from it",
  call:"",
  note:"Last piece before the discussion, and it is the one that is actually unresolved right now, which is why it is worth your time. THE PRINCIPLE FIRST, and it is not a controversial one. If a biological sample is collected in a country, that country has a claim on what is made from it. You get access on agreed terms, and some share of the value comes back — money, or technology, or training, or co-authorship and capacity. The reason this exists is a long and well-documented history of samples leaving poor countries and products arriving back as imports the source country could not afford. Stated at that level, almost nobody argues with it. Point at the two arrows: that is the whole deal, and the top one is what triggers the bottom one.",
  desc:"A border drawn down the middle. On the left, the sample, collected there; on the right, what gets made from it. An arrow carries the material across the border, and a second arrow returns a share of what comes back."});

beat({ on:[], s:{principle:1, hook:1},
  cap:"And it was written for <b>material</b>",
  call:"",
  note:"NOW LOOK AT WHERE THE DUTY IS FASTENED, because this is the whole slide. That principle was written for MATERIAL. The model in everybody's head is a person physically carrying something across a border: a soil core, a leaf, a culture, a vial. The border crossing is the EVENT. The obligation attaches to the event — that is the red mark on the drawing. No crossing, no event, nothing to attach to. Say it in those terms and leave it there for a second, because the next beat does not need explaining once they have seen this one.",
  desc:"A mark is placed on the border exactly where the material arrow crosses it: the duty attaches there, to the act of crossing."});

beat({ on:[], s:{principle:1, hook:1, seqr:1}, dur:1500,
  cap:"You do not have to move it any more",
  call:"",
  note:"And you do not have to do that any more. You sequence it where it is. The sample never leaves — that is why it still says 'never moves' up there — and what crosses the border is a file. Now look at what happened to the red mark. It is still there. Nothing was repealed, nobody changed the rule, the rule is in perfect working order. The new route simply goes underneath it. And the entire value of the sample — which was always the information in it; we were only ever moving information inside a container made of cells — is on the far side of the border with nothing attached to it. THAT is the loophole, and it is not a loophole anybody drilled. It is one that the technology opened underneath a rule that was drafted correctly for the world it was drafted in.",
  desc:"A sequencer appears on the collecting side. The sample is marked as never moving. A second arrow, information rather than material, crosses the border below the first one, passing under the mark and touching nothing, and all of the value arrives on the far side."});

beat({ on:[], s:{principle:1, hook:1, seqr:1, ask:1},
  cap:"",
  call:"Does the claim follow the sequence?",
  note:"So: does the claim follow the sequence? There is a serious argument on each side and I want the room to hear both honestly. AGAINST: a sequence in a public database is data; science runs on open data; attaching ownership claims to database records would break the shared infrastructure every one of you uses daily, and it would hurt the poorest researchers first. FOR: if the claim does not follow the information then the principle is dead in practice rather than in law, because nobody ever needs to move a sample again — and the people whose biodiversity it is will watch the digitisation of exactly the loophole that was closed. THE THING TO MAKE SURE THEY LEAVE WITH: this is live. It is being negotiated now and it will be decided while you are working. You are not being asked to agree with an outcome. You are being asked to notice that depositing a sequence is an act with consequences outside the lab, which is not how anybody is taught to think about hitting submit on a database. VERIFY — the drawing names nothing on purpose, and here is what needs checking before any of it is named out loud. The instrument is the NAGOYA PROTOCOL, on access to genetic resources and benefit sharing, under the Convention on Biological Diversity. Needs checking: when it was adopted and when it entered into force; which countries have ratified it and which notably have not; what it actually requires of a researcher as opposed to what it is popularly described as requiring; whether the United States is a party and what that means for work done here; and the current status of the digital sequence information question, including whether any mechanism has been agreed and what it would cover. The term of art is 'digital sequence information', or DSI, and that phrase itself is contested. Do not put a date, a ratification count or a requirement on a slide without reading the primary text.",
  desc:"The material route is ringed and labelled intact, and bypassed. The question: does the claim follow the sequence? This is the live fight, and it is not settled."});

window.Deck.sequence("border", function(slide){
  const s = G.scene(slide, 792, 840);
  s.finish();
  return G.run(s, FR, paint);
});
})();
