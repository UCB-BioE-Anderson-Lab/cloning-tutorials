/* ------------------------------------------------------------------ *
 * 02-salicylate.js — source slide 37, moved to the front of its section.
 *
 * The source asks it as a ponder slide near the end of the DNA-parts
 * run, by which point the answer has already been given three times.
 * Asked first, before any of the protein classes, it is a real question,
 * and the wrong answer is the shape every exercise in this deck uses:
 * not an error, a plausible result that looks like success.
 *
 * Build constitutive RFP, grow it in salicylate, and you get red cells
 * in salicylate.  Every observation matches the specification.  The
 * construct is not responding to anything, and the only experiment that
 * would have told you is the one nobody runs when the result already
 * looks right -- the minus-salicylate control.
 *
 * Two designs are drawn side by side and BOTH are grown both ways, so
 * the four-way comparison is on the screen at once.  Drawn as plates
 * rather than as a table because the failure is something you would see
 * on a bench and not notice.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

/* Two constructs, each drawn as a short DNA with its features. */
const DY = 300, CW = 560;
const DES = [
{ x:150, name:"constitutive",  col:C.verm,
  feat:[["Pcon", 150, C.muted], ["RFP", 300, C.verm]] },
{ x:890, name:"salicylate-responsive", col:C.blue,
  feat:[["Psal", 150, C.blue], ["RFP", 300, C.verm]] }
];
/* plate centres: two rows (minus and plus salicylate) under each design */
const PY = [462, 620], PR = 54;

function plasmidRow(d, u){
  const g = K.grp(u);
  g.appendChild(K.dna(d.x, d.x + CW, DY, C.ink, 3.5));
  let x = d.x + 40;
  d.feat.forEach(function(f){
    g.appendChild(K.featArrow(x, DY, f[1], f[0], f[2], 34, 24));
    x += f[1] + 16;
  });
  g.appendChild(K.text(d.x + CW/2, DY - 46, d.name, 27, d.col, 700));
  return g;
}
/* A plate.  Red when the cells fluoresce, paper when they do not; the
   colony ring is always there, because in every one of the four cases
   the cells grow.  That is the point -- nothing here is a failed
   experiment, they all work. */
function plate(cx, cy, red, u){
  const g = K.grp(u);
  g.appendChild(K.el("circle", {cx:cx, cy:cy, r:PR, fill:C.paper,
    stroke:C.muted, "stroke-width":2.6}));
  if (red > 0.02){
    g.appendChild(K.el("circle", {cx:cx, cy:cy, r:PR - 7, fill:C.verm,
      "fill-opacity":n1(0.42*red), stroke:"none"}));
  }
  /* colonies, the same eight every time */
  [[-22,-18],[8,-26],[26,4],[-6,10],[-30,16],[18,28],[-14,-2],[34,-14]]
    .forEach(function(p){
      g.appendChild(K.el("circle", {cx:cx + p[0], cy:cy + p[1], r:6.5,
        fill:red > 0.5 ? C.verm : C.muted, "fill-opacity":red > 0.5 ? .95 : .5,
        stroke:"none"}));
    });
  return g;
}

const FR = [
{ s:{q:1},
  cap:"you want <em>E. coli</em> that fluoresce red only in salicylate",
  call:"what do you build? &#183; two minutes",
  note:"First question of the section, and I want you to answer it before I tell you anything about reporter proteins. You want E. coli that fluoresce red only when they are grown in the presence of salicylate. Salicylate is a small molecule, the thing aspirin becomes in your body. What do you build? Two minutes. And when you have an answer, tell me how you would know it worked.",
  desc:"The question posed on an empty slide: build E. coli that fluoresce red only in the presence of salicylate." },

{ s:{q:1, d0:1},
  cap:"the first answer that comes up",
  call:"RFP behind a constitutive promoter",
  note:"The answer that comes up first, almost every time, is this one. Take a red fluorescent protein, put it behind a promoter, transform it in. It is not a silly answer. It is the design you would reach for if the question were just make red cells, and half the question is exactly that.",
  desc:"The first design: RFP behind a constitutive promoter." },

{ s:{q:1, d0:1, p00:1},
  cap:"grow it in salicylate",
  call:"red cells &#183; in salicylate &#183; exactly as specified",
  note:"So grow it in salicylate. And you get red cells, growing in salicylate. Every word of the specification is satisfied by what is on that plate. If this is the experiment you ran and the only experiment you ran, you would write it up and move on, and you would be wrong.",
  desc:"The constitutive design grown with salicylate: the plate is red." },

{ s:{q:1, d0:1, p00:1, p01:1},
  cap:"and now the plate nobody runs",
  call:"<b>it was never responding to anything</b>",
  note:"Here is the control. Same strain, no salicylate. Still red. It was never responding to the salicylate — it was red the whole time, and the salicylate on the first plate was doing nothing except being present while you looked. This is the failure mode I want you to have in your hands for the rest of the course. The wrong answer did not produce an error. It produced exactly the observation you were hoping for, and the only thing that would have caught it is the condition you had no reason to test.",
  desc:"The constitutive design grown without salicylate: the plate is still red, showing the construct never responded to the inducer." },

{ s:{q:1, d0:1, p00:1, p01:1, d1:1, p10:1, p11:1},
  cap:"the design the question was asking for",
  call:"a salicylate-responsive promoter &#183; P<em>sal</em>, read by NahR",
  note:"What the question was asking for is transcriptional control. Put RFP behind a promoter that is only active when salicylate is around — Psal, which is read by a transcription factor called NahR. NahR is a salicylate sensor: bound to salicylate it activates the promoter, and without it the promoter is off. Now the two plates differ, and the difference is the experiment. Notice that the reporter did not change. Both designs use the same RFP. The whole question was about the promoter, which is a DNA part, and the sensing is done by a protein you have to remember to supply. That is three of the four boxes from the last section in one construct.",
  desc:"The second design, RFP behind the salicylate-responsive Psal promoter, grown both with and without salicylate: red only with." },

{ s:{q:1, d0:1, p00:1, p01:1, d1:1, p10:1, p11:1, rule:1},
  cap:"a reporter tells you a promoter fired",
  call:"it never tells you <b>why</b> &#183; that is what the other plate is for",
  note:"And the general statement, which is why this is the first slide of the section rather than a curiosity. A reporter tells you that a promoter fired. It does not tell you why it fired, and it cannot. Every reporter measurement in this course, including the fluorescence you are reading in BestP this week, is a number that only means something next to another number taken under a condition you chose. Now, with that in hand, what reporters are and which ones we use.",
  desc:"The closing rule: a reporter reports that a promoter fired, never why, so every reporter measurement needs a comparison condition." }
];

window.Deck.sequence("salicylate", function(slide){
  const s = K.scene(slide, 800, 846);

  const r = K.el("g", {});
  r.appendChild(K.path("M330 714H1270", C.muted, 2));
  s.part("rule", r);
  s.finish();

  function paint(v){
    const g = K.el("g", {});

    DES.forEach(function(d, i){
      const u = v["d" + i];
      if (u > 0.02) g.appendChild(plasmidRow(d, u));
      [0, 1].forEach(function(j){
        const pu = v["p" + i + j];
        if (pu <= 0.02) return;
        const cx = d.x + CW/2;
        /* design 0 is red on BOTH plates; design 1 only with salicylate */
        const red = (i === 0) ? 1 : (j === 0 ? 1 : 0);
        g.appendChild(plate(cx, PY[j], red, pu));
        /* The condition names the ROW, so it is drawn once at the left
           of the row rather than beside each of the two plates in it. */
        if (i === 0)
          g.appendChild(K.text(cx - PR - 24, PY[j] + 9,
            j === 0 ? "+ salicylate" : "no salicylate",
            24, j === 0 ? C.ink : C.muted, j === 0 ? 700 : 400, "end"));
      });
    });

    /* Restored.  This looked like a third stacked sentence, and it was
       actually the .o visibility rule missing from the section file --
       it was showing on every beat instead of only on the last. */
    if (v.rule > 0.02){
      const a = K.grp(v.rule);
      a.appendChild(K.text(800, 762, "both plates, or the number means nothing",
        27, C.blue, 700));
      g.appendChild(a);
    }
    return g;
  }
  return K.run(s, FR, paint);
});
})();
