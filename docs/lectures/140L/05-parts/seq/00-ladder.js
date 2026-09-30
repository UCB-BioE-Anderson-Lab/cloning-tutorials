/* ------------------------------------------------------------------ *
 * 00-ladder.js — source slide 2, "Part Abstractions".
 *
 * The source puts four strings on one slide: a protein, a CDS, a
 * transcript, and a BioBrick part, each longer than the one above.  It
 * never says what the ladder is for, so read cold it looks like four
 * ways of writing the same thing.  It is not.  Each rung is the rung
 * above plus exactly what that rung could not do on its own, and drawing
 * it a rung at a time makes the sequence grow leftward in front of them:
 *
 *   protein      the function you actually want.  Cannot be ordered.
 *   CDS          encodes it.  Cannot be expressed — nothing starts.
 *   transcript   + an RBS.  Can be translated, given a promoter.
 *   part         + defined ends.  Can be joined to other parts.
 *
 * THE EXAMPLE IS REAL AND WORTH NAMING.  The source's MEKKITGYT is the
 * N-terminus of chloramphenicol acetyltransferase, UniProt P62577
 * (MEKKITGYTTVDISQWHRKEHFEAFQSVAQCTYNQTVQLD...), and its atggagaaaaaaatc
 * translates to exactly that.  The source shows the letters without
 * saying what they are, which throws away a gene the students already
 * use — cat is the chloramphenicol marker.
 *
 * Bases are the source's own and are not extended past where it stops.
 * Inventing another twenty bases of cat to make a row look fuller would
 * put sequence on a slide that is not in any tube.
 *
 * THE FOURTH RUNG IS WHERE THE FORMATS DISAGREE.  The source's own
 * fourth row runs tctaga straight into atg, skipping the RBS it had just
 * added, because a BioBrick CDS part is defined to begin at the start
 * codon while a transcript part carries its own RBS.  That is not an
 * error in the source, it is two Formats, and it is the hand-off to the
 * Formats slide that follows — so the note says it rather than the
 * drawing silently picking one.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

const SIZE = 24, SX = 506, LX = 466;
const RY = [286, 412, 538, 664];

const PROT = "MEKKITGYTTVDISQWHRKEHFEAFQSVAQCTYNQTVQLD";
const CDS  = "atggagaaaaaaatcactggatataccac";
const RBS  = "TAAGGAGGAAAAACAT";
const PRE  = "tctaga";

const ROW = [
{ lab:"the protein",    note:"what you actually want — and you cannot order it",
  seg:[{s:PROT, col:C.ink}, {s:"…", col:C.muted}] },
{ lab:"the CDS",        note:"encodes it · but nothing here tells a ribosome to start",
  seg:[{s:CDS, col:C.blue}, {s:"…", col:C.muted}] },
{ lab:"the transcript", note:"+ a ribosome binding site · now it can be translated",
  seg:[{s:RBS, col:C.amber}, {s:CDS, col:C.blue}, {s:"…", col:C.muted}] },
{ lab:"the part",       note:"+ ends with a known sequence · now it can be joined",
  seg:[{s:PRE, col:C.verm}, {s:RBS, col:C.amber}, {s:CDS, col:C.blue},
       {s:"…", col:C.muted}] }
];

/* Every rung is drawn right-aligned on the CDS, so the atg sits in one
   column down the slide and what each rung adds appears to its left.
   Left-aligning them instead makes four strings of different lengths
   with nothing in common to the eye. */
const CDSX = SX + (RBS.length + PRE.length)*SIZE*K.CH;
function rowX(i){
  const seg = ROW[i].seg;
  let pre = 0;
  for (let j = 0; j < seg.length; j++){
    if (seg[j].s === CDS || seg[j].s === PROT) break;
    pre += seg[j].s.length;
  }
  return CDSX - pre*SIZE*K.CH;
}

function fr(n){
  const o = {}; for (let i = 0; i < 4; i++) o["r"+i] = i < n ? 1 : 0; return o;
}

const FR = [
{ s:fr(1),
  cap:"a part is written at four levels, and they are not four names for one thing",
  call:"start at the top: this is chloramphenicol acetyltransferase",
  note:"Same sequence, four levels of abstraction, and they are not interchangeable. Start at the top. This is a protein — chloramphenicol acetyltransferase, the cat gene, the chloramphenicol marker you have been selecting on all semester. This is the thing you actually want. And you cannot order it. No company will ship you a protein against a purchase order the way they will ship you DNA.",
  desc:"The first rung: the N-terminal protein sequence of chloramphenicol acetyltransferase." },

{ s:fr(2),
  cap:"the coding sequence",
  call:"DNA you can order · and nothing in it starts translation",
  note:"So you go down a level to the DNA that encodes it. That is the CDS, and it begins with the start codon. This you can order, and it is where most part registries stop. But put this in a cell on its own and nothing happens, because there is nothing here that tells a ribosome where to begin.",
  desc:"The second rung adds the coding sequence in blue below, aligned so its start codon sits under the protein it encodes." },

{ s:fr(3),
  cap:"the transcript",
  call:"+ a ribosome binding site · now translation can start",
  note:"Add a ribosome binding site in front and you have the transcript — the messenger as the ribosome sees it. Now translation can start, given something upstream to transcribe it. Notice that the sequence is growing leftward: each level is the one above it plus what that one was missing.",
  desc:"The third rung adds a ribosome binding site in amber in front of the coding sequence." },

{ s:fr(4),
  cap:"the part",
  call:"+ ends with a known sequence · now it can be <b>joined</b>",
  note:"And the last level adds ends. A defined sequence at each end, the same on every part in the collection, so that any two of them can be joined by the same reaction. That is the difference between a stretch of DNA that works and a part you can build with, and it is the only level where the word part is doing any work. Which raises the question the next slide answers: who decides what the ends are.",
  desc:"The fourth rung adds an assembly prefix in vermillion in front of the ribosome binding site." },

{ s:fr(4), on:["add"],
  cap:"each level is the one above it, plus what that one could not do",
  call:"and only the bottom one can be ordered <b>and</b> built with",
  note:"So read the ladder downward and each level adds one ability the level above did not have. The protein is the function and cannot be ordered. The CDS can be ordered and cannot be expressed. The transcript can be expressed and cannot be joined. The part can be joined. One caution on that bottom rung, because it is where the Formats disagree with each other: the source deck's own fourth row runs the prefix straight into the start codon and drops the ribosome binding site, because a BioBrick coding-sequence part is defined to begin at the ATG, while a transcript part carries its own site. That is not a mistake. It is two different Formats making two different choices about where a part ends, which is the next slide.",
  desc:"Brackets down the left of the four rungs mark what each level adds: the function, the encoding, the start, and the joinable ends." }
];

window.Deck.sequence("ladder", function(slide){
  const s = K.scene(slide, 800, 846);

  const a = K.el("g", {});
  /* The spine sits at x 300, not 250.  End-anchored at 224, "the
     joinable ends" began at x 62 and the content box starts at 110. */
  a.appendChild(K.path("M300 "+(RY[0] - 26)+"V"+(RY[3] + 10), C.muted, 2.4));
  ["the function", "the encoding", "the start", "joinable ends"].forEach(function(t, i){
    a.appendChild(K.path("M300 "+RY[i]+"h-14", C.muted, 2.4));
    a.appendChild(K.text(274, RY[i] + 8, t, 21, C.muted, 400, "end"));
  });
  s.part("add", a);
  s.finish();

  function paint(v){
    const g = K.el("g", {});
    ROW.forEach(function(r, i){
      const u = v["r"+i];
      if (u <= 0.02) return;
      const row = K.grp(u), y = RY[i];
      row.appendChild(K.text(LX, y + 8, r.lab, 26, C.ink, 700, "end"));
      row.appendChild(K.seqStrip(rowX(i), y + 8, r.seg, SIZE));
      /* clear of the start-codon rule, which runs down x = CDSX */
      row.appendChild(K.text(rowX(i) + 8, y + 38, r.note, 20, C.muted, 400, "start"));
      g.appendChild(row);
    });
    /* the column the start codon holds, so the leftward growth is
       visible rather than asserted */
    if (v.r1 > 0.6){
      g.appendChild(K.path("M"+n1(CDSX - 3)+" "+(RY[1] - 22)+"V"+(RY[3] + 16),
        C.blue, 2, "2 8"));
    }
    return g;
  }
  return K.run(s, FR, paint);
});
})();
