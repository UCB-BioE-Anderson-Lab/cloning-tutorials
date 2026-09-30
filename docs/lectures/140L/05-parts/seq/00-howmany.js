/* ------------------------------------------------------------------ *
 * 00-howmany.js — the question the deck opens on.
 *
 * Source slide 3 is titled "Parts vs Features" and is a wall of raw
 * sequence with nothing else on it.  The distinction it is reaching for
 * is real and the slide never states it, so here the sequence becomes a
 * question instead: how many parts is this?
 *
 * Three, one and none are all defensible, which is the point.  "Three"
 * is the answer almost everybody gives, it is correct, and it is also
 * incomplete in a way that matters — the same letters are one part if
 * what you keep in a tube and reuse is the whole cassette, and no parts
 * at all if you never reuse any of it.  The question is malformed until
 * you say what you intend to reuse.  That is the definition the rest of
 * the section is built on, and it arrives as the resolution of an
 * argument the room has already had rather than as a bullet.
 *
 * THE SEQUENCE IS REAL, and it is deliberately the one in their hands.
 * J23101 is the Anderson-library promoter BestP defines as 1 RPU, so the
 * first thing on the screen in this lecture is the thing they are
 * measuring in lab this week.  B0034 is the RBS, and the tail is the
 * start of a fluorescent protein.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

const SIZE = 26, SY = 322;
const SEG = [
{ s:"TTTACAGCTAGCTCAGTCCTAGGTATTATGCTAGC", col:C.blue,  t:"J23101",  k:"promoter" },
{ s:"AAAGAGGAGAAA",                        col:C.amber, t:"B0034",   k:"RBS" },
{ s:"ATGGTGAGCAAGGGCGAGGAGCTGTTCACCGGG",  col:C.verm,  t:"amilGFP", k:"CDS, first 33 bases" }
];
const W  = K.seqWidth(SEG.map(x => ({s:x.s})), SIZE);
const X0 = n1((1600 - W)/2);
const CW = SIZE*K.CH;                      /* advance per base          */

/* where each segment starts and ends, in px */
const AT = (function(){
  const a = []; let x = X0;
  SEG.forEach(function(g){ a.push([x, x + g.s.length*CW]); x += g.s.length*CW; });
  return a;
})();

const FR = [
{ s:{},
  cap:"how many parts is this?",
  call:"two minutes with the person next to you",
  note:"This is where we start, and I want an argument about it before I tell you anything. Here is eighty-five bases of real DNA — you have all of it in a freezer box downstairs. How many parts is it? Two minutes with the person next to you. There is more than one defensible answer and I am interested in which one you reach for.",
  desc:"Eighty-five bases of DNA sequence across the middle of the slide, in grey, with no annotation." },

{ s:{lit:1, three:1},
  cap:"three",
  call:"a promoter, a ribosome binding site, and the start of a coding sequence",
  note:"Three is what almost everyone says, and it is right. There is a promoter — that is J23101, which is the reference promoter BestP calls one RPU, so you are measuring this exact sequence in lab this week. Then a ribosome binding site, B0034. Then the first thirty-three bases of a fluorescent protein. Three functional stretches, three parts.",
  desc:"Three braces appear under the sequence naming a promoter J23101, an RBS B0034, and the start of the amilGFP coding sequence." },

{ s:{lit:1, three:1, one:1},
  cap:"one",
  call:"if what you keep in a tube and reuse is the whole cassette",
  note:"It is also one. If what lives in your freezer box, with a number on the tube, is the whole promoter-RBS-CDS cassette, and what you reuse is the whole thing, then it is one part that happens to have three functional stretches inside it. Nothing about the DNA changed between that answer and the last one.",
  desc:"A single brace spans the whole sequence, labelled as one cassette." },

{ s:{lit:1, three:1, one:1, none:1},
  cap:"or none",
  call:"if you built it once and will never build with it again",
  note:"And it is none. If you assembled this once for one experiment and will never use any piece of it again, there are no parts here at all. There are three features — three stretches of DNA that do something — and features are not parts. That is the distinction the source deck's title reaches for and never states.",
  desc:"A line is added noting that if none of it is reused, there are three features and no parts." },

{ s:{lit:1, three:1, one:1, none:1, ans:1},
  cap:"the question was malformed",
  call:"a feature is what a sequence <b>does</b> · a part is what you have committed to <b>reusing</b>",
  note:"So the question was malformed, and that is the answer. You cannot count the parts in a sequence by looking at the sequence. A feature is a property of the DNA: this stretch is a promoter whether anyone ever uses it or not. A part is a decision you made — it has a name, a number, and a physical tube, and it exists because somebody committed to using it again. Everything in this lecture follows from that, including why the same sequence can be a part in one lab and not in another, and why the interesting question about a new part is never what it does but whether it will compose.",
  desc:"The resolution is stated: a feature is what a sequence does, a part is what someone has committed to reusing." }
];

window.Deck.sequence("howmany", function(slide){
  const s = K.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = K.el("g", {});

    /* Two copies of the strip, cross-faded: grey while it is still a
       question, coloured once the segments are named.  Interpolating a
       fill between two hex colours per frame is the other way and it is
       more code for the same picture. */
    if (v.lit < 0.98){
      const m = K.grp(1 - v.lit);
      m.appendChild(K.seqStrip(X0, SY, SEG.map(x => ({s:x.s, col:C.muted})), SIZE));
      g.appendChild(m);
    }
    if (v.lit > 0.02){
      const c = K.grp(v.lit);
      c.appendChild(K.seqStrip(X0, SY, SEG, SIZE));
      g.appendChild(c);
    }

    if (v.three > 0.02){
      const b = K.grp(v.three);
      SEG.forEach(function(seg, i){
        b.appendChild(K.brace(AT[i][0] + 2, AT[i][1] - 2, SY + 16, null, seg.col, 16));
        const mx = (AT[i][0] + AT[i][1])/2;
        b.appendChild(K.text(mx, SY + 62, seg.t, 26, seg.col, 700));
        b.appendChild(K.text(mx, SY + 90, seg.k, 21, C.muted, 400));
      });
      g.appendChild(b);
    }

    if (v.one > 0.02){
      const b = K.grp(v.one);
      b.appendChild(K.brace(X0 + 2, X0 + W - 2, SY + 118, null, C.ink, 18));
      b.appendChild(K.text(800, SY + 170, "one cassette, one tube, one number", 26, C.ink, 700));
      g.appendChild(b);
    }

    if (v.none > 0.02){
      const b = K.grp(v.none);
      b.appendChild(K.text(800, SY + 232,
        "or three features and no parts at all, if none of it is ever used again",
        26, C.muted, 400));
      g.appendChild(b);
    }

    if (v.ans > 0.02){
      const b = K.grp(v.ans);
      b.appendChild(K.path("M420 "+(SY + 268)+"H1180", C.muted, 2));
      b.appendChild(K.text(800, SY + 316,
        "you cannot count the parts by looking at the sequence", 30, C.blue, 700));
      g.appendChild(b);
    }
    return g;
  }
  return K.run(s, FR, paint);
});
})();
