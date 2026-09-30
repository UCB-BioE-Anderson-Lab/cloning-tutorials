/* ------------------------------------------------------------------ *
 * 05-bins.js — source slide 45, "TPcon Parts: bin0 bin1 bin2 ... bin12
 * / OFF LOW MED UBER".
 *
 * The source slide is that vocabulary with no argument attached.  The
 * argument is coverage, and it is the thing that turns a characterised
 * set into a usable one: four members with gaps between them answers
 * almost no design question, and a binned library answers most of them.
 * Which is also the answer to a question nobody in the room has asked
 * out loud -- why pP6 has you build a LIBRARY rather than pick a good
 * promoter.  You are not looking for a promoter.  You are filling bins.
 *
 * THE BINS ARE DRAWN AS RANGES, not as values.  The Anderson library's
 * per-member strengths are published on the Registry and are not in
 * this file, because nothing here needs them and inventing them would
 * put five fake numbers on a slide in a section about measurement.
 * What is claimed is the structure the source slide claims: a graded
 * set of bins spanning roughly three decades, with OFF at one end and
 * UBER at the other, and the three BestP references placed by the
 * qualitative description the course's own BestP page gives them.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

const AX0 = 250, AX1 = 1380, AY = 470;
const lg = v => Math.log(v)/Math.LN10;
const LO = 0.004, HI = 12;
const px = v => n1(AX0 + (AX1 - AX0)*(lg(v) - lg(LO))/(lg(HI) - lg(LO)));

/* their four clones from the previous slide, in the same positions */
const MARK = [0.06, 0.35, 0.9, 2.4];
/* the three references BestP uses, placed by what the course's own
   BestP page says of each: J23112 very weak, J23101 the reference,
   J23119 very strong */
const REF = [["pJ12", "J23112", 0.012, C.muted], ["pJ01", "J23101", 1, C.blue],
             ["pJ19", "J23119", 7, C.verm]];
/* bins as ranges across the decades, which is what the source slide
   asserts; no per-member value is claimed */
const BIN = [[0.004, 0.02, "OFF"], [0.02, 0.12, "LOW"], [0.12, 0.7, "·  ·  ·"],
             [0.7, 3, "MED"], [3, 12, "UBER"]];

const FR = [
{ s:{yours:1},
  cap:"your four clones &#8212; and the gaps between them",
  call:"ask for half an RPU and this set has no answer",
  note:"Start with what you have. Your four clones, on the axis from the last slide. Now suppose somebody asks you for half an RPU. Look at where your four sit: there is nothing there. You have four characterised parts and a question you cannot answer, and adding a fifth clone at random is not likely to help, because the gap is wherever it happens to be.",
  desc:"The four pP6 clones marked on a logarithmic RPU axis, with the gaps between them apparent." },

{ s:{yours:1, ref:1},
  cap:"the three you also measured, on the same axis",
  call:"pJ12, pJ01, pJ19 &#183; the same backbone, the same reporter, the same unit",
  note:"You also measured three references, and here they are on the same axis. J23112 is very weak, J23101 is the reference at one RPU by definition, and J23119 is very strong. They are in the same backbone with the same reporter, which is the only reason they can share an axis with your clones at all. These three are already a small family, and they were handed to you.",
  desc:"The three reference plasmids pJ12, pJ01 and pJ19 placed on the same axis as the clones." },

{ s:{yours:1, ref:1, bins:1},
  cap:"and the library those three came from covers the whole range",
  call:"binned, so that every level has a member",
  note:"And those three came out of a library that covers the whole range, sorted into bins. The source deck's own names for the ends are OFF and UBER, with LOW and MED in between, and there are about a dozen bins across roughly three orders of magnitude. The point of binning is not tidiness. It is that every level has a member, so there is no level you can ask for and not get.",
  desc:"The bins of the Anderson promoter library drawn as bands across the axis, labelled from OFF through LOW and MED to UBER." },

{ s:{yours:1, ref:1, bins:1}, on:["cov"],
  cap:"a family is useful in proportion to its <b>coverage</b>",
  call:"characterised is not enough &#8212; it has to have no holes",
  note:"So there is a second property a family needs that the last slide did not mention, and it is coverage. Being characterised is not enough. A set of four beautifully measured parts with a two-decade hole in the middle will not answer the question you actually have. What you want is no holes, and that is a property of the set rather than of any member of it.",
  desc:"The closing point: a family needs coverage as well as characterisation, which is a property of the set rather than of any member." },

/* on: pp6 ALONE, not cov as well.  Both persistent lines plus the
   caption and the call put four stacked sentences in the bottom
   150px; the coverage line has done its work on the beat before. */
{ s:{yours:1, ref:1, bins:1}, on:["pp6"],
  cap:"which is what pP6 is for",
  call:"you are not looking for a good promoter &#8212; you are <b>filling bins</b>",
  note:"Which finally explains the assignment. pP6 does not ask you to find a good promoter. A good promoter already exists — J23119 is right there and you could just use it. It asks you to randomise twelve bases and measure whatever comes out, including the weak ones, including the dead ones, because a library is built by filling the range and the weak members are as much of the product as the strong ones. If you have been treating the low readings as failed clones, that is the thing to change. The low ones are parts.",
  desc:"The closing point: pP6 builds a library by filling the range, so weak clones are members of the family rather than failures." }
];

window.Deck.sequence("bins", function(slide){
  const s = K.scene(slide, 800, 846);

  const c = K.el("g", {});
  c.appendChild(K.path("M330 668H1270", C.muted, 2));
  c.appendChild(K.text(800, 708, "characterised, and with no holes in it",
    28, C.blue, 700));
  s.part("cov", c);

  const p = K.el("g", {});
  p.appendChild(K.path("M330 668H1270", C.muted, 2));
  p.appendChild(K.text(800, 710, "so a weak clone is a member, not a failure",
    28, C.verm, 700));
  s.part("pp6", p);
  s.finish();

  function paint(v){
    const g = K.el("g", {});

    if (v.bins > 0.02){
      const a = K.grp(v.bins);
      BIN.forEach(function(b, i){
        a.appendChild(K.el("rect", {x:px(b[0]), y:AY - 152,
          width:n1(px(b[1]) - px(b[0])), height:52, rx:4,
          fill:i === 0 ? C.muted : C.blue,
          "fill-opacity":(0.06 + i*0.05).toFixed(2),
          stroke:i === 0 ? C.muted : C.blue, "stroke-width":2}));
        if (b[2]) a.appendChild(K.text((px(b[0]) + px(b[1]))/2, AY - 118,
          b[2], 23, i === 0 ? C.muted : C.blue, 700));
      });
      a.appendChild(K.text((AX0 + AX1)/2, AY - 172,
        "about a dozen bins, across three decades", 22, C.muted, 400));
      g.appendChild(a);
    }

    g.appendChild(K.path("M"+AX0+" "+AY+"H"+AX1, C.ink, 3));
    [[0.01, "0.01"], [0.1, "0.1"], [1, "1"], [10, "10"]].forEach(function(t){
      g.appendChild(K.path("M"+px(t[0])+" "+AY+"v11", C.muted, 2.4));
      g.appendChild(K.text(px(t[0]), AY + 36, t[1], 21, C.muted, 400));
    });
    g.appendChild(K.text((AX0 + AX1)/2, AY + 70, "relative promoter units",
      22, C.muted, 400));

    if (v.yours > 0.02){
      const a = K.grp(v.yours);
      MARK.forEach(function(m, i){
        a.appendChild(K.el("circle", {cx:px(m), cy:AY, r:11, fill:C.verm,
          "fill-opacity":".22", stroke:C.verm, "stroke-width":3}));
        a.appendChild(K.text(px(m), AY - 22, String(i + 1), 21, C.verm, 700));
      });
      /* the hole, named where it is */
      a.appendChild(K.path("M"+px(0.1)+" "+(AY + 96)+"H"+px(0.3), C.verm, 3));
      a.appendChild(K.text((px(0.1) + px(0.3))/2, AY + 128, "nothing here",
        22, C.verm, 700));
      g.appendChild(a);
    }

    if (v.ref > 0.02){
      const a = K.grp(v.ref);
      REF.forEach(function(r){
        a.appendChild(K.path("M"+px(r[2])+" "+(AY - 4)+"v-34", r[3], 3));
        a.appendChild(K.text(px(r[2]), AY - 46, r[0], 22, r[3], 700));
      });
      g.appendChild(a);
    }
    return g;
  }
  return K.run(s, FR, paint);
});
})();
