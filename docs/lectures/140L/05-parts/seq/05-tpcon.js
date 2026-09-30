/* ------------------------------------------------------------------ *
 * 05-tpcon.js — source slides 47 and 49, the two "insertion" diagrams.
 *
 * Those two slides in the source are grids of 0 1 2 3 against 0 1 2 3
 * labelled Promoter and Terminator, twice, with no caption and no
 * notes.  What they are getting at is the thing this deck has been
 * calling a slot, and it is worth drawing properly once: a position
 * with fixed junctions on both sides, so that every member of a
 * collection is interchangeable within it.
 *
 * The slide was prose, which is the wrong medium for an argument whose
 * whole content is that two ends match.  The junctions are drawn as
 * interlocking notches, because that is what a defined overhang IS --
 * a shape that only fits one way -- and the last beat draws what the
 * alternative looks like, which is four parts with four different ends
 * and four separate cloning problems.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

const CY = 310, X0 = 300, SLOTW = [190, 250, 300];
const NOTCH = 13;

/* A block with a notch cut out of its left end and a tab on its right,
   so that neighbours visibly interlock.  `key` picks the notch shape:
   two parts join only where their keys match. */
/* `key` has to make a VISIBLE difference or the last beat's whole point
   -- these ends do not match -- is invisible.  At key*9 the four shapes
   differed by nine pixels on a 58px block and read as identical. */
function block(x, y, w, label, col, key, u, h){
  /* o must stay inside the block: at (key-1)*19 on a 52px block the
     key-3 notch was 38px on a 26px half-height, so the path turned back
     on itself and grew a spike out of the top edge. */
  const g = K.grp(u), hh = h || 58, k = NOTCH + key*6, o = (key - 1.5)*9;
  const d = "M"+n1(x)+" "+n1(y - hh/2)+
            "H"+n1(x + w)+
            "l"+k+" "+n1(hh/2 - o - 6)+"l"+(-k)+" "+12+"l"+k+" "+n1(hh/2 + o - 6)+
            "H"+n1(x)+
            "l"+k+" "+n1(-(hh/2 + o - 6))+"l"+(-k)+" "+(-12)+"l"+k+" "+n1(-(hh/2 - o - 6))+"Z";
  g.appendChild(K.el("path", {d:d, fill:C.paper, stroke:"none"}));
  g.appendChild(K.el("path", {d:d, fill:col, "fill-opacity":".14",
    stroke:col, "stroke-width":2.6}));
  g.appendChild(K.text(x + w/2, y + 9, label, 25, col, 700));
  return g;
}

const LIB = ["J23101", "J23112", "J23119", "J23106"];

const FR = [
{ s:{arch:1},
  cap:"three positions, and the junctions between them are fixed",
  call:"terminator, promoter, coding sequence &#183; always in that order",
  note:"Here is the TPcon architecture, and you know how to assemble it because that is DNA Fabrication section eight. What I want is what it is for, which that lecture had no reason to say. Three positions in a fixed order, and — this is the part that matters — the junction between any two of them is a fixed sequence. Not a fixed length, a fixed sequence, the same in every construct anyone builds to this standard.",
  desc:"The TPcon architecture drawn as three interlocking blocks: terminator, promoter and coding sequence, with fixed junctions between them." },

{ s:{arch:1, lib:1},
  cap:"and every promoter in the collection carries the <b>same</b> two ends",
  call:"which is what a Format is &#8212; a promise about the ends",
  note:"Now the collection. Every promoter in the library was built with the same two junction sequences on it, whatever is in the middle. That is the promise the Format makes, and it is why the ends of these blocks are drawn as a shape rather than a line: a defined overhang is a shape that fits one way.",
  desc:"Four promoters from the library, all drawn with identical ends." },

{ s:{arch:1, lib:1, swap:1},
  cap:"so any of them drops into the slot",
  call:"the set differs in one place by <b>construction</b>, not by care",
  note:"So any of them drops into the promoter position, in the same reaction, with no design work per member. Which is the mechanical basis of everything this section has said. A family whose members differ in exactly one place is easy to talk about and hard to build, unless the ends make it automatic — and then it is a pool.",
  desc:"A promoter from the library shown dropping into the promoter slot of the architecture." },

{ s:{arch:1, lib:1, swap:1, bad:1},
  cap:"without the shared ends, twelve parts are twelve cloning problems",
  call:"and at that price, nobody builds the library",
  note:"And here is the counterfactual, which is the thing to leave with. Take the same twelve characterised promoters and give them twelve different sets of ends. Nothing about the biology changed. Every promoter still has its measured strength, the data is all still good. But now putting each one into your construct is its own primer design, its own PCR, its own assembly, and twelve of those is a month. At that price nobody builds the library, they pick one promoter and hope. The Format is not bookkeeping. It is the thing that decides whether combinatorial design is affordable, and that is why section zero spent a slide on it.",
  desc:"The alternative drawn: the same parts with mismatched ends, each requiring its own cloning, which is what makes a library unaffordable." }
];

window.Deck.sequence("tpcon", function(slide){
  const s = K.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = K.el("g", {});

    if (v.arch > 0.02){
      const a = K.grp(v.arch);
      let x = X0;
      /* ONE key across all three.  Different keys here drew the
         architecture's own junctions as mismatched, which is the exact
         opposite of what the slide is asserting about them. */
      [["terminator", C.muted], ["promoter", C.verm],
       ["coding sequence", C.blue]].forEach(function(b, i){
        const w = SLOTW[i];
        if (i === 1 && v.swap > 0.02 && v.swap < 0.92){
          /* the slot stands empty while a member is coming into it */
          a.appendChild(K.el("rect", {x:n1(x), y:CY - 29, width:w, height:58,
            rx:4, fill:"none", stroke:C.verm, "stroke-width":2.6,
            "stroke-dasharray":"4 8"}));
        } else {
          a.appendChild(block(x, CY, w, b[0], b[1], 1, 1));
        }
        x += w;
      });
      a.appendChild(K.text(X0 + (SLOTW[0] + SLOTW[1] + SLOTW[2])/2, CY - 58,
        "the junctions are a fixed sequence, not a fixed length",
        22, C.muted, 400));
      g.appendChild(a);
    }

    if (v.lib > 0.02){
      const a = K.grp(v.lib);
      a.appendChild(K.text(X0 - 24, CY + 150, "the collection", 23, C.muted, 400, "end"));
      LIB.forEach(function(p, i){
        const x = X0 + i*250;
        a.appendChild(block(x, CY + 150, 220, p, C.verm, 1, 1, 52));
      });
      a.appendChild(K.text(X0 + 500, CY + 208, "same two ends, whatever is in the middle",
        22, C.verm, 700));
      g.appendChild(a);
    }

    if (v.swap > 0.02){
      const a = K.grp(v.swap);
      const from = [X0 + 110, CY + 150], to = [X0 + SLOTW[0] + SLOTW[1]/2, CY];
      const t = K.cl(v.swap, 0, 1);
      const cx = from[0] + (to[0] - from[0])*t, cy = from[1] + (to[1] - from[1])*t;
      a.appendChild(block(cx - 110, cy, 220, "J23101", C.verm, 1, 1, 52));
      g.appendChild(a);
    }

    if (v.bad > 0.02){
      const a = K.grp(v.bad);
      a.appendChild(K.path("M300 "+(CY + 262)+"H1300", C.muted, 2));
      a.appendChild(K.text(800, CY + 302, "the same parts — but every one with different ends",
        25, C.muted, 700));
      LIB.forEach(function(p, i){
        const x = X0 + i*250;
        a.appendChild(block(x, CY + 366, 220, p, C.muted, [0, 2, 3, 1][i], 1, 52));
      });
      a.appendChild(K.text(800, CY + 424, "twelve primer designs · twelve assemblies · a month",
        24, C.verm, 700));
      g.appendChild(a);
    }
    return g;
  }
  return K.run(s, FR, paint);
});
})();
