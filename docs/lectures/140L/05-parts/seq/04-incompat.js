/* ------------------------------------------------------------------ *
 * 04-incompat.js — source slide 39, moved to the front of its section.
 *
 * "When I transform my E. coli with two pBca9145 plasmids I'm getting
 * irreproducible expression levels."  It is a real question with a real
 * answer and the source asks it after the origins slide, which gives it
 * away.  Asked first it is the section's motivation, and it is this
 * deck's shape again: nothing failed.  You get colonies.  You get
 * expression.  It is simply a different number every time, which reads
 * as bad pipetting for about three weeks before anybody suspects the
 * design.
 *
 * The mechanism is worth drawing rather than stating, because the thing
 * people get wrong is WHERE the randomness is.  It is not that the
 * plasmids replicate badly.  Each one replicates perfectly.  The copy
 * number control on a colE1 origin counts the total -- it cannot tell
 * two identical replicons apart, because the thing doing the counting
 * is an antisense RNA that pairs with either -- so the cell holds
 * twenty copies of "colE1", not twenty of each.  Segregation at
 * division then shuffles that fixed pot, and a random walk with
 * absorbing states at both ends ends at an end.
 *
 * So the drift is drawn as a lineage: one cell, then two, then four,
 * and the ratios wander apart until they cannot come back.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

const GX = [330, 630, 930], R = 46;
const GEN = [
[{ y:450, b:3, v:3 }],
[{ y:360, b:4, v:2 }, { y:540, b:2, v:4 }],
[{ y:300, b:5, v:1 }, { y:400, b:3, v:3 },
 { y:500, b:1, v:5 }, { y:600, b:0, v:6 }]
];
/* six seats inside a cell, always the same six, so the eye reads the
   RATIO changing rather than the dots moving */
const SEAT = [[-20,-18], [20,-18], [-28,6], [28,6], [-10,24], [14,26]];

function cell(cx, cy, b, u){
  const g = K.grp(u);
  g.appendChild(K.el("circle", {cx:cx, cy:cy, r:R, fill:C.paper,
    stroke:C.ink, "stroke-width":2.6}));
  SEAT.forEach(function(p, i){
    g.appendChild(K.el("circle", {cx:cx + p[0], cy:cy + p[1], r:9,
      fill:i < b ? C.blue : C.verm, "fill-opacity":".85", stroke:"none"}));
  });
  return g;
}

const FR = [
{ s:{q:1},
  cap:"two plasmids, same origin, and the numbers will not repeat",
  call:"colonies grow &#183; expression happens &#183; it is different every time",
  note:"Here is a question from a real lab notebook. I transformed E. coli with two plasmids that both have the colE1 origin, and I am getting irreproducible expression levels. Nothing has failed. The transformation worked, there are colonies, both plasmids are in there, the protein is being made. Pick a colony, measure it, pick another colony, measure it, and you get a different answer, and you get a different answer again next week from the same glycerol stock. Two minutes. What is going on, and notice that nothing on that list looks like an error.",
  desc:"The question posed: two plasmids sharing an origin giving irreproducible expression levels despite everything working." },

{ s:{q:1, g0:1},
  cap:"an origin is not just where replication starts",
  call:"it carries the <b>copy-number control</b> too &#8212; and that control counts the total",
  note:"The answer starts with what an origin actually is. It is not only the place replication begins. It also carries the regulation that sets how many copies there are, and for colE1 that regulation is an antisense RNA that pairs with the replication primer and blocks it. Now ask what that RNA can distinguish. It pairs by sequence. Two plasmids with the same origin have the same sequence there, so the RNA pairs with either one, and the cell has no way of counting them separately. It holds about twenty copies of colE1. Not twenty of each. Twenty in total, split however they happen to be split.",
  desc:"One cell containing six plasmids, three of each kind, with the note that the copy-number control regulates the total rather than each kind separately." },

{ s:{q:1, g0:1, g1:1},
  cap:"so division deals from a fixed pot",
  call:"and which copies go to which daughter is not controlled at all",
  note:"So when the cell divides, it deals out whatever it has. These plasmids have no partitioning system — nothing actively puts one of each into each daughter, the way a chromosome is actively segregated. They diffuse, and they are dealt at random. One daughter comes out four to two, the other two to four, and both of them then top back up to six of whatever they have got.",
  desc:"The cell divides into two daughters with different ratios, four to two and two to four, illustrating random segregation." },

{ s:{q:1, g0:1, g1:1, g2:1},
  cap:"which is a random walk with a wall at each end",
  call:"and one of those cells has already lost a plasmid for good",
  note:"Do that again and the ratios spread further. And here is the part that makes it irreversible: look at the bottom cell. It has no blue plasmids left. There is no route back — nothing in that lineage can regenerate a plasmid it does not have. Every division is a random walk on the ratio and both ends of the walk are absorbing. Given enough generations, every lineage hits an end. This is the same phenomenon as genetic drift in a small population, and it is fast here because the population is six.",
  desc:"A second division spreading the ratios further, with one lineage having lost one plasmid type entirely and no route back." },

{ s:{q:1, g0:1, g1:1, g2:1, late:1},
  cap:"so an overnight culture is not one strain",
  call:"it is a <b>mixture</b>, in proportions set by which lineages drifted which way",
  note:"By the time you have an overnight culture, which is more than twenty generations, most of the cells carry one plasmid or the other and very few carry both. Your culture is a mixture. The proportions in that mixture were set by a random process that ran differently in every tube, which is exactly why the number is different every time — and why it is different between colonies from the same plate. You are not measuring a strain. You are measuring a population whose composition you did not choose and do not know.",
  desc:"After many generations, the population is a mixture of cells carrying one plasmid or the other, with few carrying both." },

{ s:{q:1, g0:1, g1:1, g2:1, late:1}, on:["fix"],
  cap:"the fix is a <b>different origin</b>, not more antibiotic",
  call:"colE1 &#183; p15A &#183; F &#183; R6K &#8212; different controls, counted separately",
  note:"And the fix is not more antibiotic, which is what people try, because selection keeps the plasmid that carries the marker and does nothing about the ratio between two plasmids that both carry markers. The fix is to give them different origins. ColE1, p15A, the F replicon and R6K are controlled by different machinery, so the cell counts them separately and holds each at its own copy number, and neither can displace the other. Those are called incompatibility groups, and the rule is simply that two plasmids in the same group cannot be stably maintained in the same cell. When you see a two-plasmid system in a paper — pCas and pTarget in the CRISPR procedure, for instance — check the origins, and you will find they are in different groups every time.",
  desc:"The resolution: different incompatibility groups, colE1, p15A, F and R6K, are regulated separately so both plasmids are held stably." }
];

window.Deck.sequence("incompat", function(slide){
  const s = K.scene(slide, 800, 846);

  const f = K.el("g", {});
  f.appendChild(K.path("M330 722H1270", C.muted, 2));
  /* Not a restatement of the call under it.  The concrete check they
     can actually run is the useful thing to leave on the screen. */
  f.appendChild(K.text(800, 766,
    "check the origins on any two-plasmid system you meet — pCas and pTarget are not in the same group",
    24, C.verm, 700));
  s.part("fix", f);
  s.finish();

  function paint(v){
    const g = K.el("g", {});

    GEN.forEach(function(row, gi){
      const u = v["g" + gi];
      if (u <= 0.02) return;
      const a = K.grp(u);
      row.forEach(function(c, ci){
        /* the line back to the parent, so the tree reads as descent */
        if (gi > 0){
          const p = GEN[gi - 1][ci >> 1];
          a.appendChild(K.path("M"+n1(GX[gi - 1] + R)+" "+n1(p.y)+
            "C"+n1(GX[gi - 1] + R + 60)+" "+n1(p.y)+" "+
                n1(GX[gi] - R - 60)+" "+n1(c.y)+" "+n1(GX[gi] - R)+" "+n1(c.y),
            C.muted, 2.2));
        }
        a.appendChild(cell(GX[gi], c.y, c.b, 1));
        /* Generation 2's four cells are 120px apart and 92 across, so a
           ratio under each one lands on the next cell.  Theirs go to the
           right, which is the side the connectors do not use. */
        const pure = (c.b === 0 || c.v === 0);
        const lbl = c.b + " : " + c.v;
        if (gi < 2)
          a.appendChild(K.text(GX[gi], c.y + R + 26, lbl, 21,
            pure ? C.verm : C.muted, pure ? 700 : 400));
        else
          a.appendChild(K.text(GX[gi] + R + 14, c.y + 8, lbl, 21,
            pure ? C.verm : C.muted, pure ? 700 : 400, "start"));
      });
      a.appendChild(K.text(GX[gi], 246,
        gi === 0 ? "one cell" : "generation " + gi, 23, C.muted, 400));
      g.appendChild(a);
    });

    if (v.late > 0.02){
      const a = K.grp(v.late);
      a.appendChild(K.text(1120, 246, "an overnight later", 23, C.muted, 400, "start"));
      /* a handful of cells, nearly all of them pure one way or the other */
      [[1180, 330, 6], [1300, 330, 0], [1180, 450, 0], [1300, 450, 6],
       [1180, 570, 6], [1300, 570, 0]].forEach(function(q){
        a.appendChild(cell(q[0], q[1], q[2], 1));
      });
      a.appendChild(K.text(1240, 660, "a mixture, not a strain", 24, C.verm, 700));
      g.appendChild(a);
    }
    return g;
  }
  return K.run(s, FR, paint);
});
})();
