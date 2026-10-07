/* ------------------------------------------------------------------ *
 * 06-chain.js — the question was asked once, upstream, by somebody.
 *
 * Was 99 words.  The argument is a chain and the chain is the picture:
 * one act at the far left that was not ordinary, and then four that
 * were entirely ordinary, ending on a bench in this building.  Drawn,
 * the room can see that nobody in the middle did anything wrong, which
 * is the part that makes it uncomfortable rather than safely historical.
 *
 * THE FIRST BOX IS DELIBERATELY SPARSE.  The cell line's name is not in
 * dispute and neither is the absence of consent; everything else about
 * that history — dates, names, family circumstances, later litigation
 * and a negotiated access arrangement — is specific, and getting any of
 * it wrong in a lecture about consent would be its own small insult.
 * The note channel carries the VERIFY list.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

const BY = 330, BH = 124, BW = 230, GAP = 50;
const X0 = 125;
const x = i => X0 + i*(BW + GAP);

const LINK = [
  ["a culture", "shared"],
  ["a stock", "deposited"],
  ["a vial", "shipped"],
  ["your bench", ""]
];

function paint(v, f){
  const g = G.grp();

  /* ---- the origin ------------------------------------------------- */
  if (v.origin > 0.02){
    const h = G.grp(v.origin);
    h.appendChild(G.box(x(0), BY, BW, BH, C.verm, C.paper));
    h.appendChild(G.lines(x(0) + BW/2, BY + 42,
      ["taken during", "treatment,", "without consent"], 23, C.verm, 700,
      "middle", 30));
    h.appendChild(G.text(x(0) + BW/2, BY - 20, "the first hand-off", 22, C.verm, 400));
    g.appendChild(h);
  }

  /* ---- and four that nobody would look at twice ------------------- */
  if (v.chain > 0.02){
    const h = G.grp(v.chain);
    LINK.forEach(function(L, i){
      const xi = x(i + 1), last = i === LINK.length - 1;
      h.appendChild(G.arrow(xi - GAP + 8, BY + BH/2, xi - 10, BY + BH/2,
        C.rule, 3));
      h.appendChild(G.box(xi, BY, BW, BH, last ? C.ink : C.muted, C.paper));
      h.appendChild(G.lines(xi + BW/2, BY + (L[1] ? 56 : 70),
        L[1] ? [L[0], L[1]] : [L[0]], 25, last ? C.ink : C.muted,
        last ? 700 : 400, "middle", 32));
    });
    h.appendChild(G.path(`M ${x(1)} ${BY + BH + 30} L ${x(4) + BW} ${BY + BH + 30}`,
      C.rule, 2.6));
    h.appendChild(G.text((x(1) + x(4) + BW)/2, BY + BH + 66,
      "every one of these was completely ordinary", 26, C.muted, 400));
    g.appendChild(h);
  }

  /* ---- the question stopped being asked --------------------------- */
  if (v.faded > 0.02){
    const h = G.grp(v.faded);
    h.appendChild(G.text(x(0) + BW/2, BY + BH + 66,
      "nobody asked again", 25, C.verm, 700));
    h.appendChild(G.text((x(1) + x(4) + BW)/2, BY + BH + 110,
      "the question had been answered upstream, by somebody,", 25, C.ink, 400));
    h.appendChild(G.text((x(1) + x(4) + BW)/2, BY + BH + 142,
      "and nobody could remember who", 25, C.ink, 400));
    g.appendChild(h);
  }

  return g;
}

const FR = [];
const beat = o => FR.push(o);

beat({ on:[], s:{origin:1},
  cap:"The most widely used human cell line in biology",
  call:"",
  note:"Change of subject, and this one is about the freezer rather than the field. HeLa is the most widely used human cell line in biology. It is in your building. Those cells were taken from a patient in the course of her treatment, without her consent, and her family learned what had happened decades afterwards. I am going to leave it at that level of detail on purpose, and I will come back to why in a second. WHY SO LITTLE DETAIL: the cell line's name is not in dispute and neither is the absence of consent. Beyond that, this history has specific dates, names, family circumstances, and a long sequence of later events including litigation and a negotiated access arrangement — and getting any of those wrong in a lecture about consent would be its own small insult. VERIFY before stating any of the following from the podium: the patient's name and the year the cells were taken; the hospital and the research context; when and how the family learned; whether and when any compensation, acknowledgement or control over access was agreed, and with whom; and whether consent of the kind we now mean was required by any standard in force at the time. That last one matters, because a student will ask whether this was wrong by the standards of the day, and it is a good question which should not be answered by guessing.",
  desc:"The first box in a chain: cells taken from a patient during treatment, without consent."});

beat({ on:[], s:{origin:1, chain:1}, dur:1600,
  cap:"",
  call:"",
  note:"THE PART THAT IS ACTUALLY FOR YOU is not the original act. It is everything after it. Walk the chain out loud. Somebody shared a culture with a colleague. Somebody deposited a stock. Somebody shipped a vial. Somebody ordered a line and used it, and that somebody is you, and the bench is in this building. NOT ONE of those people did anything unusual. There is no villain anywhere to the right of the first box. That is the mechanism I want you to see, and it is why this is not a story about somebody else being careless.",
  desc:"Four more boxes follow, each an entirely ordinary hand-off: a culture shared, a stock deposited, a vial shipped, your bench."});

beat({ on:[], s:{origin:1, chain:1, faded:1},
  cap:"",
  call:"“It was in the repository” answers where you got it, not how it got there.",
  note:"And not one of them asked the question again, because the question had already been answered — somewhere upstream, by somebody else, and nobody could remember who. Consent is a question about an ORIGIN. It is asked exactly once, and then it becomes invisible, because everything downstream is a transaction, and transactions do not carry history unless somebody deliberately attaches it. SO THE LINE TO LAND: 'it was in the repository' is an answer about where you got it. It is not an answer about how it got there. Provenance is a property of the material and it does not reset when the material changes hands — which means the person at the end of the chain, which is you, inherits a question they did not create and cannot answer from the catalogue page. MAKE IT CONCRETE, because otherwise this is a story about somebody else. Go through your own freezer. Patient-derived lines, primary cells, clinical isolates, organoids, environmental and field samples, anything collected from a person or from a place. For how many of those can you say where it came from and on what terms? And the practical version, which is not rhetorical: what would you actually do if you found out that something you had been using for two years had a bad origin? Who do you tell? That is a real procedural question with a real answer at this institution, and most people do not know it.",
  desc:"The closing line: nobody asked again, because the question had been answered upstream by somebody and nobody could remember who. Provenance is a property of the material and does not reset when the material changes hands."});

window.Deck.sequence("chain", function(slide){
  const s = G.scene(slide, 792, 840);
  s.finish();
  return G.run(s, FR, paint);
});
})();
