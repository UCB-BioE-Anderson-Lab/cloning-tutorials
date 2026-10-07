/* ------------------------------------------------------------------ *
 * 01-cambridge.js — three years of record, and the argument had to be
 * made anyway.
 *
 * Was 103 words, on a slide whose own note channel says "run the clips
 * here rather than reading this slide".  A holding frame for a video
 * should get SPARSER, not denser, so this is deliberately the thinnest
 * drawing in the deck: a span, two ends, and what came out of it.
 *
 * IT IS THE SAME DEVICE AS seq/01-record.js, which is the point the
 * slide's own closing line makes — there, fifty years and no mechanism;
 * here, no record at all.  Same timeline, drawn short.  The room has
 * seen the long one four beats earlier and will recognise it.
 *
 * NO CLAIM ABOUT WHAT WAS SAID IN THE ROOM.  The hearings, the
 * moratorium and the review board are on the drawing; their contents,
 * durations and findings are not, and the note channel keeps the
 * VERIFY that the risk section already carries.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

const Y = 392, XA = 420, XB = 1120;

function end(x, year, sub){
  const g = G.el("g", {});
  g.appendChild(G.el("circle", {cx:x, cy:Y, r:13, fill:C.ink}));
  g.appendChild(G.text(x, Y - 36, year, 34, C.ink, 700));
  g.appendChild(G.lines(x, Y + 44, sub, 21, C.muted, 400, "middle", 26));
  return g;
}

function paint(v, f){
  const g = G.grp();

  if (v.span > 0.02){
    const h = G.grp(v.span);
    h.appendChild(G.path(`M ${XA} ${Y} L ${XB} ${Y}`, C.ink, 3.4));
    h.appendChild(end(XA, "1973", ["the first recombinant", "plasmids"]));
    h.appendChild(end(XB, "1976", ["the elected city government", "holds public hearings"]));
    h.appendChild(G.path(
      `M ${XA} ${Y - 78} L ${XA} ${Y - 92} L ${XB} ${Y - 92} L ${XB} ${Y - 78}`,
      C.verm, 2.6));
    h.appendChild(G.text((XA + XB)/2, Y - 108, "three years", 30, C.verm, 700));
    g.appendChild(h);
  }

  if (v.out > 0.02){
    const h = G.grp(v.out);
    h.appendChild(G.text(770, 568,
      "a temporary local moratorium, and a citizens’ review board",
      26, C.ink, 400));
    h.appendChild(G.text(770, 614,
      "a city, not a funding agency, wrote the first rules",
      27, C.verm, 700));
    g.appendChild(h);
  }

  return g;
}

const FR = [];
const beat = o => FR.push(o);

beat({ on:[], s:{span:1},
  cap:"There was no track record to argue from. Not fifty years of it. Not one.",
  call:"",
  note:"RUN THE CLIPS HERE rather than reading this slide; it is a holding frame for a video. WHAT IT IS: a Cambridge City Council hearing on recombinant DNA research, 1976. The Cambridge City Council is the elected city government of Cambridge, Massachusetts — not a university body and not a federal one. They held public hearings on whether this work could be done within the city limits at all, which is to say that the first serious regulatory fight over this technology was municipal. THE CONTEXT THAT MAKES IT WORTH WATCHING, and it is the span on the screen: it was only three years earlier that Boyer and Cohen showed you could clone a gene into a plasmid using restriction enzymes. At the time of this meeting, deliberately changing the genetic blueprint of a cell was brand new. There was no track record to point at — no fifty years, no five. Everything anybody said in that room was an argument from first principles or from fear, because nothing else was available. Understandably, it was heated. [Clip timings are in the source deck. The original MIT TechTV link is dead; the clips are reproduced at youtube.com/watch?v=vvTmIMNMmoE.]",
  desc:"A short timeline. 1973, the first recombinant plasmids; 1976, the elected city government holds public hearings — a span of three years, with no track record to argue from."});

beat({ on:[], s:{span:1, out:1},
  cap:"",
  call:"",
  note:"And what came out of it was a temporary local moratorium and a citizens' review board. Say that slowly, because it is the part people do not expect: a CITY wrote the first rules for this technology. Not a funding agency, not a learned society, not the people doing the work. [VERIFY, and the risk section's note channel already carries this: the length of the moratorium and the composition and findings of the citizens' review board. None of that is on the drawing and the argument does not use it.]",
  desc:"What came out of it: a temporary local moratorium and a citizens' review board — a city, not a funding agency, wrote the first rules."});

beat({ on:[], s:{span:1, out:1},
  cap:"",
  call:"There, a long record and no mechanism. Here, no record at all.",
  note:"And now put this beside the slide we did four beats ago, because it is the mirror image of it and that is why the two sit in the same section. THERE: fifty years of clean record, and no mechanism underneath it — a conclusion with a track record and no argument. HERE: no track record whatsoever, three years after the technique existed, and the argument had to be made ANYWAY, because the decision could not wait for evidence that did not exist yet. Both of those are the normal condition of this subject. You will spend your career in one or the other of them, and almost never in the comfortable middle where you have both the record and the mechanism.",
  desc:"The closing line, as the mirror of the fifty-year record: there, a long record and no mechanism; here, no record at all, and the argument had to be made anyway."});

window.Deck.sequence("cambridge", function(slide){
  const s = G.scene(slide, 792, 840);
  s.finish();
  return G.run(s, FR, paint);
});
})();
