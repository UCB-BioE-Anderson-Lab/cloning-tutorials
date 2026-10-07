/* ------------------------------------------------------------------ *
 * 01-taxonomy.js — three rows, and only two of them have a size.
 *
 * Was 117 words.  The payload is not the taxonomy, which everybody has
 * met; it is the closing line — a taxonomy is not a measurement, and
 * the third row has no size.  Prose states that.  A drawing can SHOW
 * it, by giving all three rows the same measuring track and then
 * leaving the third one empty.
 *
 * THE EMPTY TRACK IS THE SLIDE.  Row three gets the same axis as the
 * other two and nothing on it, so the absence is drawn to the same
 * scale as the things that are present.  That is why the rows share a
 * track rather than each getting their own box.
 *
 * NO NUMBERS ANYWHERE, including on the first row, where it would be
 * tempting.  An infectious dose and an LD50 are named as the KINDS of
 * quantity that exist, not as values — nothing of that sort is in this
 * deck's sourced facts.
 *
 * PROVENANCE: the three-way phrasing is Donald Rumsfeld's, from a
 * Defense Department press briefing, and the credit is drawn on the
 * slide.  The date is commonly given but has not been checked against
 * a transcript — VERIFY before putting a year on it.  Nothing in the
 * argument depends on the date.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

const LX = 150, TX0 = 700, TX1 = 1400;
const ROW = [326, 466, 606];

function label(y, t, gloss, col){
  const g = G.el("g", {});
  g.appendChild(G.text(LX, y, t, 29, col, 700, "start"));
  g.appendChild(G.lines(LX, y + 30, gloss, 20, C.muted, 400, "start", 25));
  return g;
}
function track(y){
  return G.path(`M ${TX0} ${y} L ${TX1} ${y}`, C.rule, 2.4);
}

function paint(v, f){
  const g = G.grp();

  g.appendChild(G.text(LX, 772,
    "Phrasing after Donald Rumsfeld, then US Secretary of Defense, in a press briefing.",
    19, C.muted, 400, "start"));

  if (v.kk > 0.02){
    const h = G.grp(v.kk);
    h.appendChild(label(ROW[0], "known knowns",
      ["hazards we can name and have measured"], C.ink));
    h.appendChild(track(ROW[0]));
    h.appendChild(G.path(`M ${TX0} ${ROW[0]} L 1060 ${ROW[0]}`, C.ink, 13));
    for (let x = TX0; x <= 1060; x += 72)
      h.appendChild(G.path(`M ${x} ${ROW[0] + 12} L ${x} ${ROW[0] + 26}`, C.ink, 2.4));
    h.appendChild(G.text(1084, ROW[0] - 24,
      "an infectious dose, an LD50, a route", 21, C.ink, 400, "start"));
    g.appendChild(h);
  }

  if (v.ku > 0.02){
    const h = G.grp(v.ku);
    h.appendChild(label(ROW[1], "known unknowns",
      ["questions we know to ask and cannot yet answer"], C.blue));
    h.appendChild(track(ROW[1]));
    h.appendChild(G.path(`M 780 ${ROW[1]} L 1080 ${ROW[1]}`, C.blue, 13));
    h.appendChild(G.path(`M ${TX0} ${ROW[1]} L 780 ${ROW[1]}`, C.blue, 3, "8 7"));
    h.appendChild(G.path(`M 1080 ${ROW[1]} L 1240 ${ROW[1]}`, C.blue, 3, "8 7"));
    [TX0, 1240].forEach(x => h.appendChild(
      G.path(`M ${x} ${ROW[1] - 15} L ${x} ${ROW[1] + 15}`, C.blue, 3)));
    h.appendChild(G.text(1272, ROW[1] - 26,
      "you know what to ask", 21, C.blue, 400, "start"));
    g.appendChild(h);
  }

  if (v.uu > 0.02){
    const h = G.grp(v.uu);
    h.appendChild(label(ROW[2], "unknown unknowns",
      ["harm by a mechanism nobody thought to ask about"], C.verm));
    h.appendChild(track(ROW[2]));
    h.appendChild(G.text((TX0 + TX1)/2, ROW[2] + 16, "?", 58, C.verm, 700));
    h.appendChild(G.text((TX0 + TX1)/2, ROW[2] + 60,
      "no denominator, no rate, no distribution", 22, C.verm, 700));
    g.appendChild(h);
  }

  return g;
}

const FR = [];
const beat = o => FR.push(o);

beat({ on:[], s:{kk:1},
  cap:"",
  call:"",
  note:"The taxonomy is borrowed and it is genuinely useful, which is why it survives in this deck. KNOWN KNOWNS are the hazards we can name and have measured — an infectious dose, an LD50, a route of transmission. That bar is solid and it has tick marks on it because that is the column the regulations are written against: you can only write a rule about a quantity you can put a number on. Note that I have not put any actual numbers on the slide — those are kinds of quantity, not values, and none of them are sourced here.",
  desc:"A measuring track with a solid, ticked bar on it: known knowns, hazards we can name and have measured — an infectious dose, an LD50, a route."});

beat({ on:[], s:{kk:1, ku:1},
  cap:"",
  call:"",
  note:"KNOWN UNKNOWNS are the questions we know to ask and cannot yet answer. You have a characterised gene, and you are about to put it in a host nobody has put it in, and you genuinely do not know what it will do. That is most of what you will actually do in a lab. Notice the shape of that second row: there is still a bar, and there are still bounds on it — the dashed ends and the whiskers — because you know what you are uncertain ABOUT. The uncertainty has an address.",
  desc:"A second track: known unknowns, questions we know to ask and cannot yet answer, drawn as a bar with dashed bounds and whiskers, because the uncertainty has an address."});

beat({ on:[], s:{kk:1, ku:1, uu:1}, dur:1500,
  cap:"",
  call:"A taxonomy is not a measurement.",
  note:"And UNKNOWN UNKNOWNS are harm arriving by a mechanism nobody thought to ask about. That is the one the field is actually afraid of — the worry is not that we will approve something dangerous, it is that something will go through proper review and oversight and hurt somebody anyway, in a way the review had no category for. NOW LOOK AT THE THIRD TRACK, because it is the whole slide. Same axis as the other two. Nothing on it. You can NAME that row but you cannot SIZE it: no denominator, no rate, no distribution. And that means an argument about unknown unknowns cannot be settled by evidence, in either direction. Somebody who says the risk is negligible and somebody who says it is unacceptable are both making a claim with nothing underneath it. Keep that in your pocket for the rest of today, because you will hear this argument made in public, and now you know why it never ends.",
  desc:"The third track is given the same axis as the other two and left empty: unknown unknowns, harm by a mechanism nobody thought to ask about — no denominator, no rate, no distribution. A taxonomy is not a measurement."});

window.Deck.sequence("taxonomy", function(slide){
  const s = G.scene(slide, 812, 852);
  s.finish();
  return G.run(s, FR, paint);
});
})();
