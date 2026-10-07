/* ------------------------------------------------------------------ *
 * 04-clock.js — a clock you have already started, and three doors.
 *
 * Was 151 words, the densest slide in the section.  It is really two
 * pictures: a timeline with an event on it that the room has already
 * caused, and a branch with three exits.  Drawn that way the registry
 * entry lands as a DATE rather than as a bullet, which is the only
 * version of this that changes anybody's behaviour.
 *
 * THE NUMBER IS A QUESTION MARK ON PURPOSE.  The grace period differs
 * by jurisdiction and in much of the world there is none at all.  No
 * figure appears on this drawing and none should be added from memory;
 * the note channel carries the VERIFY.  The question mark is honest and
 * it is also the better teaching object — it is the thing they have to
 * go and find out.
 *
 * NOTHING IS TAKEN AWAY.  The clock stays on screen under the three
 * doors, because the whole point of the doors is that the clock is
 * already running while you choose between them.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

const TY = 318, X0 = 160, XD = 620, X1 = 1440;
const BY = 470, BH = 170, BW = 400;
const BX = [150, 600, 1050];

const DOOR = [
  { t:"patent",        col:"ink",
    a:["file before the clock runs out"],
    b:["you give up the secret"] },
  { t:"trade secret",  col:"blue",
    a:["no filing, no fees, no expiry"],
    b:["you give up publishing — and anyone", "who works it out owes you nothing"] },
  { t:"open",          col:"amber",
    a:["BioBrick Public Agreement"],
    b:["you undertake not to assert"] }
];

function paint(v, f){
  const g = G.grp();

  if (v.clock > 0.02){
    const h = G.grp(v.clock);
    h.appendChild(G.path(`M ${X0} ${TY} L ${XD} ${TY}`, C.ink, 3.4));
    h.appendChild(G.lines(X0, TY - 54,
      ["a talk · a poster · a preprint · a thesis", "— and a registry entry"],
      23, C.ink, 400, "start", 30));

    h.appendChild(G.path(`M ${XD} ${TY - 34} L ${XD} ${TY + 34}`, C.verm, 4));
    h.appendChild(G.el("circle", {cx:XD, cy:TY, r:11, fill:C.verm}));
    h.appendChild(G.text(XD, TY + 62, "you disclose", 26, C.verm, 700));
    h.appendChild(G.text(XD, TY + 90, "the part page you filled in last month",
      20, C.muted, 400));

    h.appendChild(G.arrow(XD + 12, TY, X1, TY, C.muted, 3));
    h.appendChild(G.text((XD + X1)/2, TY - 56, "?", 54, C.verm, 700));
    h.appendChild(G.lines((XD + X1)/2, TY - 18,
      ["how long you still have to file"], 23, C.ink, 400, "middle", 28));
    h.appendChild(G.text((XD + X1)/2, TY + 34,
      "differs by country — in much of the world, not at all",
      20, C.muted, 400));
    g.appendChild(h);
  }

  if (v.doors > 0.02){
    const h = G.grp(v.doors);
    DOOR.forEach(function(D, i){
      const col = C[D.col];
      h.appendChild(G.box(BX[i], BY, BW, BH, col, C.paper));
      h.appendChild(G.text(BX[i] + BW/2, BY + 48, D.t, 30, col, 700));
      h.appendChild(G.lines(BX[i] + BW/2, BY + 84, D.a, 21, C.ink, 400,
        "middle", 26));
      h.appendChild(G.lines(BX[i] + BW/2, BY + 124, D.b, 20, C.muted, 400,
        "middle", 25));
    });
    g.appendChild(h);
  }

  return g;
}

const FR = [];
const beat = o => FR.push(o);

beat({ on:[], s:{clock:1},
  cap:"",
  call:"",
  note:"Disclosure starts a clock. Any public disclosure — a talk, a poster, a preprint, a thesis in the library, a post — begins a period after which you can no longer file. AND HERE IS THE PART NOBODY SAYS OUT LOUD IN A SYNTHETIC BIOLOGY COURSE: a public registry entry is a disclosure. The part page you filled in last month, with the sequence and the characterisation data on it, is a publication. It is a good publication, it is exactly what the registry is for, and it is ALSO a legal event with a date attached. I am not telling you not to post. I am telling you to know that you did it. Now look at the question mark, because it is the honest state of my knowledge and it is also your homework. The length of that clock differs by country, and in much of the world there is effectively no grace period at all, so the moment of disclosure is the moment you have lost the option. VERIFY: I am deliberately not putting a number of months on the slide, because the figure differs by jurisdiction and I will not state one from memory. Get the actual number from somebody who knows it — before you post rather than after.",
  desc:"A timeline. A talk, a poster, a preprint, a thesis — and a registry entry — lead to a marked event: you disclose, the part page you filled in last month. After it, an arrow to a question mark: how long you still have to file, which differs by country and in much of the world is not a grace period at all."});

beat({ on:[], s:{clock:1, doors:1}, dur:1500,
  cap:"",
  call:"",
  note:"And the clock is running while you choose between these three, which is why it stays on the screen. PATENT: file before it runs out, and what you give up is the secret — the whole bargain is disclosure in exchange for a term of exclusivity. TRADE SECRET is the genuine alternative and it is underrated. No filing, no fees, no disclosure, no expiry — a secret can outlast any patent. What you give up is everything a patent gives you against independent discovery: if somebody else works it out, or buys your product and takes it apart, you have nothing. And you give up publishing, which for most of you is the whole currency of a career. That is why the choice is usually made by what kind of thing it is: a process inside a fermenter nobody can see can be a secret; a sequence in a product cannot. OPEN is a third path and it is a choice, not a failure to choose. Under the BioBrick Public Agreement a contributor undertakes not to assert patent rights against people who use the part they contributed. It is the same manoeuvre as an open-source software licence: the legal power is real, and it is used to keep something open rather than to close it. [VERIFY the exact operative terms before describing the mechanism in more detail than that sentence. There is no date or version number on the slide on purpose.]",
  desc:"Three doors below the clock. Patent: file before the clock runs out, and you give up the secret. Trade secret: no filing, no fees, no expiry, but you give up publishing and anyone who works it out owes you nothing. Open: the BioBrick Public Agreement, under which you undertake not to assert."});

beat({ on:[], s:{clock:1, doors:1},
  cap:"",
  call:"Talk to your tech transfer office before you post. They cannot un-publish.",
  note:"And the practical one, which is the only instruction on this slide. Talk to your technology transfer office before you post. That is the university office that files patents on the institution's behalf — and at a university the inventions usually belong to the institution rather than to you, which is a sentence worth hearing before it is relevant rather than after. They can file quickly when there is a reason to. WHAT THEY CANNOT DO IS UN-PUBLISH ANYTHING, which is why the conversation has to happen first, and why the marker on that timeline points backwards at something several of you have already done. A five-minute email in September is worth more than any amount of regret in March. AND THE CLOSE: none of this tells you what you SHOULD do. It tells you which doors are still open. The decision about which of them to walk through is the subject of the rest of the lecture.",
  desc:"The closing instruction: talk to your technology transfer office before you post rather than after, because they cannot un-publish anything."});

window.Deck.sequence("clock", function(slide){
  const s = G.scene(slide, 792, 840);
  s.finish();
  return G.run(s, FR, paint);
});
})();
