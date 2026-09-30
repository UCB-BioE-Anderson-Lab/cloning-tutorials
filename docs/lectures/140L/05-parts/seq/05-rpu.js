/* ------------------------------------------------------------------ *
 * 05-rpu.js — the section opens on something they built.
 *
 * Not in the source, which starts its families run at slide 42 with
 * "How do we organize information about parts?"  That is a fine
 * question and it is abstract, and the room has spent two weeks making
 * a concrete instance of the answer without being told that is what it
 * was.  So the question here is what pP6 and BestP actually produced,
 * and "four numbers" is the answer almost everyone gives.
 *
 * NO FABRICATED READINGS.  Their fluorescence values are theirs and
 * this file does not invent a table of them.  What is drawn is the
 * STRUCTURE -- four clones identical but for twelve bases, three
 * references, one unit -- and the measured positions on the axis are
 * unlabelled marks whose only claim is that they differ.  The one
 * number on the slide is J23101 = 1 RPU, which is a definition.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

/* the shared cassette, drawn once per clone: everything grey but the
   twelve bases that differ */
const CY = [268, 338, 408, 478];
const BX = 300, BW = 760;
const SLOT = [BX + 150, 150];          /* where the promoter sits       */

const AX0 = 300, AX1 = 1340, AY = 600;
const lg = v => Math.log(v)/Math.LN10;
const px = v => n1(AX0 + (AX1 - AX0)*(lg(v) - lg(0.02))/(lg(4) - lg(0.02)));
/* Marks, not measurements.  These four positions say "they came out
   different"; they are not anybody's data and nothing on the slide
   claims a value for them. */
const MARK = [0.06, 0.35, 0.9, 2.4];

function clone(y, i, lit, u){
  const g = K.grp(u);
  g.appendChild(K.dna(BX, BX + BW, y, C.ink, 3));
  g.appendChild(K.featArrow(SLOT[0], y, SLOT[1], "P" + (i + 1),
    lit > 0.5 ? C.verm : C.muted, 30, 22));
  g.appendChild(K.feat(SLOT[0] + SLOT[1] + 18, y, 110, "B0034", C.muted, 30, 21));
  g.appendChild(K.featArrow(SLOT[0] + SLOT[1] + 142, y, 250, "amilGFP",
    C.muted, 30, 22));
  g.appendChild(K.text(BX - 18, y + 9, "clone " + (i + 1), 23, C.muted, 400, "end"));
  return g;
}

const FR = [
{ s:{cl:1},
  cap:"four pP6 clones, measured against J23101 &#8212; what did you <b>produce</b>?",
  call:"two minutes &#183; and &ldquo;four numbers&rdquo; is not the answer I am after",
  note:"Last section of the lecture, and it opens on something you have already made. In pP6 you built a promoter library and picked four clones, and in BestP you measured them against J23101. So: what did you produce? Not what did you measure — what did you make. Two minutes with your neighbour, and I will tell you now that four numbers is not the answer I am after, because four numbers is what you wrote down rather than what you built.",
  desc:"Four pP6 clones drawn as identical cassettes, each with a different promoter in the same slot, with the question of what they collectively are." },

{ s:{cl:1, lit:1},
  cap:"they are identical &#8212; except in one slot",
  call:"same backbone, same RBS, same reporter, twelve bases different",
  note:"Look at what is the same. Same backbone, same ribosome binding site, same reporter, same strain, same medium, same plate reader. Everything is held constant except twelve bases in one position. That is not an accident of how you built them — it is the whole design of the experiment, and it is the thing that makes the comparison mean anything.",
  desc:"The four clones with everything shown as identical grey except the promoter slot, highlighted, which differs by twelve bases." },

{ s:{cl:1, lit:1, ax:1},
  cap:"and each one carries a measured value",
  call:"in a unit defined by one of them &#183; J23101 = 1 RPU",
  note:"And each of them now carries a number. Not a raw fluorescence reading, because a raw reading depends on the gain setting and the medium and how the cells were growing. A ratio, against J23101, which we simply define as one relative promoter unit. Defining the unit as one member of the set is the move that makes the set usable: anybody with J23101 can reproduce your number, and nobody needs your plate reader.",
  desc:"A logarithmic axis in relative promoter units with J23101 marked at 1 RPU and the four clones falling at different points along it." },

{ s:{cl:1, lit:1, ax:1}, on:["def"],
  cap:"that is a <b>part family</b>",
  call:"a set identical but for one slot &#183; each with a value &#183; all in one unit",
  note:"And that is the definition. A part family is a set of parts that are identical except in one slot, each carrying a characterised value, all measured in the same unit against the same reference. You have made one. Three properties, and every one of them is doing work. Identical but for one slot, so the difference between two members is attributable. Characterised, so you can choose instead of guessing. One unit, so the numbers survive leaving your lab. Take any one of those away and you have a pile of plasmids rather than a family.",
  desc:"The definition of a part family stated under the figure: identical but for one slot, each characterised, all in one unit." },

{ s:{cl:1, lit:1, ax:1}, on:["def"],
  cap:"which turns designing into <b>choosing</b>",
  call:"&ldquo;I need about a third of an RPU&rdquo; is a question with an answer",
  note:"Here is why that matters, and it is the point of the whole section. Before you have a family, getting a gene to a particular expression level is a research project — you try things. Once you have one, it is a lookup: I need about a third of an RPU, which member is that. Design becomes selection. Everything in the rest of this section is that same move applied to something other than promoters, and the last one of them is your capstone project.",
  desc:"The consequence: with a characterised family, hitting a target expression level becomes selection from a set rather than an experiment." }
];

window.Deck.sequence("rpu", function(slide){
  const s = K.scene(slide, 800, 846);

  const d = K.el("g", {});
  d.appendChild(K.path("M300 706H1340", C.muted, 2));
  d.appendChild(K.text(800, 748,
    "identical but for one slot · each with a value · all in one unit",
    27, C.blue, 700));
  s.part("def", d);
  /* There was a second persistent line here reading "so design becomes
     selection", which is what the caption and the call of that beat
     both already say -- four stacked sentences in the bottom 100px,
     with the last of them printed over the caption. */
  s.finish();

  function paint(v){
    const g = K.el("g", {});
    CY.forEach(function(y, i){ g.appendChild(clone(y, i, v.lit, v.cl)); });

    if (v.ax > 0.02){
      const a = K.grp(v.ax);
      a.appendChild(K.path("M"+AX0+" "+AY+"H"+AX1, C.ink, 3));
      [[0.03, "0.03"], [0.1, "0.1"], [0.3, "0.3"], [1, "1"], [3, "3"]]
        .forEach(function(t){
          a.appendChild(K.path("M"+px(t[0])+" "+AY+"v11", C.muted, 2.4));
          a.appendChild(K.text(px(t[0]), AY + 36, t[1], 21, C.muted, 400));
        });
      a.appendChild(K.text((AX0 + AX1)/2, AY + 70, "relative promoter units",
        22, C.muted, 400));
      /* the reference, which is a definition rather than a measurement */
      a.appendChild(K.path("M"+px(1)+" "+(AY - 54)+"V"+(AY - 4), C.blue, 3));
      a.appendChild(K.text(px(1), AY - 66, "J23101 ≡ 1", 23, C.blue, 700));
      MARK.forEach(function(m, i){
        a.appendChild(K.el("circle", {cx:px(m), cy:AY, r:11, fill:C.verm,
          "fill-opacity":".22", stroke:C.verm, "stroke-width":3}));
        a.appendChild(K.text(px(m), AY - 22, String(i + 1), 21, C.verm, 700));
      });
      g.appendChild(a);
    }
    return g;
  }
  return K.run(s, FR, paint);
});
})();
