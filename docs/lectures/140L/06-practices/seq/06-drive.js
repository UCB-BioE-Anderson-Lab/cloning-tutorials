/* ------------------------------------------------------------------ *
 * 06-drive.js — one curve goes down because it has to earn its way up.
 *
 * Was 111 words.  The distinction between an ordinary released organism
 * and a drive is a statement about two trajectories, so it is two
 * trajectories.  Seeing the ordinary curve DECAY is what makes the
 * second one shocking, and it is also the underrated half of the
 * argument: most engineered organisms lose to wild type and the
 * ecosystem does the containment for you.
 *
 * NO NUMBERS ON THE AXES, on purpose.  There is no inheritance
 * fraction, no generation count and no release size here, because none
 * of those are in this deck's sourced facts.  The shape of each curve
 * is the claim; a tick mark would be a measurement I cannot defend.
 * The note channel says so and carries the VERIFY.
 *
 * Section 03 names drives in one line as the extreme of containment
 * failing by design.  This picks that line up and turns it over: from
 * this side it is not a failure at all.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

const X0 = 240, X1 = 1380;
const YB = 650, YT = 300;              /* baseline and fixation */

function paint(v, f){
  const g = G.grp();

  /* ---- axes, always on ------------------------------------------- */
  g.appendChild(G.path(`M ${X0} ${YB} L ${X1} ${YB}`, C.rule, 2.6));
  g.appendChild(G.path(`M ${X0} ${YB} L ${X0} ${YT - 20}`, C.rule, 2.6));
  g.appendChild(G.text(X1, YB + 40, "generations →", 23, C.muted, 400, "end"));
  g.appendChild(G.lines(X0 - 16, YT - 34,
    ["share of the wild population", "carrying the construct"],
    22, C.muted, 400, "start", 27));
  g.appendChild(G.path(`M ${X0} ${YT} L ${X1} ${YT}`, C.rule, 2, "7 7"));
  g.appendChild(G.text(X1, YT - 12, "all of it", 21, C.muted, 400, "end"));

  /* ---- an ordinary release has to earn its spread ----------------- */
  if (v.ordinary > 0.02){
    const h = G.grp(v.ordinary);
    h.appendChild(G.path(
      `M ${X0} 560 C 420 592, 620 630, 900 642 S 1200 650, ${X1} 650`,
      C.ink, 4));
    h.appendChild(G.text(960, 594, "has to earn its spread", 26, C.ink, 700, "start"));
    h.appendChild(G.text(960, 624, "— and usually does not", 24, C.muted, 400, "start"));
    g.appendChild(h);
  }

  /* ---- a drive does not ------------------------------------------ */
  if (v.drive > 0.02){
    const h = G.grp(v.drive);
    h.appendChild(G.path(
      `M ${X0} 616 C 460 610, 620 500, 760 420 S 1020 304, ${X1} 300`,
      C.verm, 4.6));
    h.appendChild(G.text(430, 398, "built so that it", 27, C.verm, 700, "start"));
    h.appendChild(G.text(430, 430, "does not have to", 27, C.verm, 700, "start"));
    g.appendChild(h);
  }

  /* ---- and there is only one place to intervene ------------------- */
  if (v.once > 0.02){
    const h = G.grp(v.once);
    h.appendChild(G.path(`M ${X0} ${YT + 6} L ${X0} ${YB}`, C.amber, 4));
    h.appendChild(G.el("circle", {cx:X0, cy:YB, r:12,
      fill:C.amber, stroke:"none"}));
    h.appendChild(G.lines(X0 + 24, YB + 42,
      ["the only decision point", "is here, before the release"],
      25, C.amber, 700, "start", 31));
    g.appendChild(h);
  }

  return g;
}

const FR = [];
const beat = o => FR.push(o);

beat({ on:[], s:{ordinary:1},
  cap:"Most engineered organisms lose to wild type",
  call:"",
  note:"We met drives once already today, in the security section, where the line was that containment by design has failure modes that are biological and a drive is the extreme case, because it fails by design. I want to pick that up rather than re-explain it, and turn it over. But start with the ordinary case, because it is the underrated half. An ordinary released organism HAS TO EARN ITS SPREAD. If it is less fit than what is already there, it dies out — that is the curve on the screen — and that is a real and badly underrated safety margin. Most engineered organisms lose to wild type and the ecosystem does the containment for you, for free, without a committee.",
  desc:"A curve for an ordinary released organism: it has to earn its spread by being fitter, and it decays away instead. No numbers on either axis."});

beat({ on:[], s:{ordinary:1, drive:1}, dur:1600,
  cap:"A drive is built so that it does not have to",
  call:"",
  note:"A drive is built specifically so that it does not have to win that contest. That is the second curve, and that is what makes it an instrument of change rather than an experiment you are watching. From this side it is not a containment failure at all. SPREADING IS THE SPECIFICATION. That is the whole reason the technology is interesting and the whole reason it is hard: you are not building something that might escape, you are building something whose function is to propagate through a wild population until the population is different. DO NOT LET THIS TURN INTO A HORROR SLIDE. The honest position is that drives are being developed for diseases that kill very large numbers of people, by serious people who are acutely aware of all of this. VERIFY if any mechanism is to be described from the podium: the inheritance biology of a drive, what fraction of offspring inherit it, which organisms drives have been built in, whether any has been released, and what reversal or immunising strategies exist. None of that is on the slide and the argument does not use any of it.",
  desc:"A second curve for a drive: it rises to fixation across the whole population, because it is built so that it does not have to be fitter. Spreading is the specification."});

beat({ on:[], s:{ordinary:1, drive:1, once:1},
  cap:"",
  call:"Everything else in this lecture had a second decision. This has one.",
  note:"AND THE CONSEQUENCE FOR THIS SECTION, which is why the slide ends on the amber line rather than on the red curve. Everything else we have discussed today has a second decision available. A containment level can be revised. A trial can be halted. A product can be withdrawn. A drive, if it works as designed, has exactly one decision point, and it is at the left-hand edge of this graph — before the release. So every question about who gets a say becomes urgent in a way it is not anywhere else in this lecture: there is no later, and there is nobody to appeal to afterwards. Also note that the affected population does not respect borders. The decision is taken by whoever has jurisdiction over the release site, and lived with by everyone downwind of it, and there is no mechanism anywhere for a decision at that scale. THE TEACHING POINT IS NARROW AND STRUCTURAL: every control in this lecture assumed a boundary, and this is the case where there is none — not because the boundary broke, but because it was never in the design.",
  desc:"A line marks the left-hand edge of the graph: the only decision point is before the release. Everything else in the lecture had a second decision available; this has one."});

window.Deck.sequence("drive", function(slide){
  const s = G.scene(slide, 792, 840);
  s.finish();
  return G.run(s, FR, paint);
});
})();
