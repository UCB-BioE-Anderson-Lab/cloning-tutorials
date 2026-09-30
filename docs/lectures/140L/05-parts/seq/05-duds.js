/* ------------------------------------------------------------------ *
 * 05-duds.js — the second exercise of the section, placed immediately
 * before the ortholog data it is about.
 *
 * In the first draft of the outline this opened the section, five
 * slides from any orthologs, which is the same mistake as putting a
 * question at the end: a question that far from what it motivates is
 * not doing the work of a question.
 *
 * It is the deck's shape one last time, and this one is the most
 * expensive version of it, because the plausible-looking result is a
 * CONCLUSION rather than a measurement.  Six near-background wells and
 * a sensible-sounding sentence -- "those orthologs are not active in
 * E. coli" -- and you have thrown away six genes on the strength of an
 * assay that never measured the thing the sentence is about.
 *
 * And it closes section 3's loop: Kudla's 250-fold was the same
 * protein, so a panel of orthologs, which differ at far more than
 * wobble positions, has at least that much expression variation inside
 * it before any biochemistry is considered.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

const WX = 380, WY = 330, WR = 40, WGAP = 116;
/* The SAME seven accessions as the panel on the next slide, and the
   same winner.  Generating them as "ca" + (i + 8) produced ca8 to ca14,
   which invents a ca13 that is not in the panel and leaves out ca15 --
   and it put the hit on ca11, so this slide and the data slide after it
   disagreed about which ortholog worked. */
const WELL = ["ca8", "ca9", "ca10", "ca11", "ca12", "ca14", "ca15"];
const HIT = 2;                       /* ca10, the alligator            */

const STEP = [
{ y:520, t:"product measured",    got:true  },
{ y:576, t:"protein measured",    got:false },
{ y:632, t:"mRNA measured",       got:false }
];

const FR = [
{ s:{wells:1},
  cap:"seven orthologs, one hit, six at background",
  call:"what do you conclude? &#183; two minutes",
  note:"Last question of the lecture. You have built a panel of seven orthologs of your enzyme, all into the same vector, same promoter, same ribosome binding site, same strain. You assay for the product. One of them makes it. Six are at background. Two minutes: what do you conclude, and write the sentence down, because I want the actual sentence.",
  desc:"Seven wells representing seven orthologs, one showing product and six at background, with the question of what to conclude." },

{ s:{wells:1, wrong:1},
  cap:"the sentence almost everybody writes",
  call:"&ldquo;those six orthologs are not active in <em>E. coli</em>&rdquo;",
  note:"The sentence almost everybody writes is that those six orthologs are not active in E. coli. It is a reasonable sentence. It is the sentence I would write. And it contains a word the experiment did not measure, which is active.",
  desc:"The common conclusion written out: those six orthologs are not active in E. coli." },

{ s:{wells:1, wrong:1, what:1},
  cap:"what did the assay actually measure?",
  call:"product &#183; and <b>only</b> product",
  note:"Go back to what was measured. The assay measured product. It did not measure whether the protein was there, and it did not measure whether the messenger was there. A well with no product is consistent with an inactive enzyme, and it is equally consistent with a perfectly good enzyme that was never made, and nothing in the experiment separates those two.",
  desc:"A checklist showing that product was measured while protein and messenger were not." },

{ s:{wells:1, wrong:1, what:1, kud:1},
  cap:"and you already know how big that second possibility is",
  call:"250-fold, from synonymous changes alone &#183; these differ by far more",
  note:"And you already know how large the second possibility is, because we measured it in the RNA section. A hundred and fifty-four genes encoding the identical protein, differing only at wobble positions, spanned two hundred and fifty fold. Orthologs differ at far more than wobble positions — they are different sequences from end to end, with different five-prime folding, different rare-codon runs, different everything. Whatever expression variation sits inside an ortholog panel, it is at least as large as that, before anybody considers the biochemistry at all.",
  desc:"The connection back to the Kudla result: identical proteins differing only synonymously spanned 250-fold, and orthologs differ far more." },

{ s:{wells:1, wrong:1, what:1, kud:1}, on:["fix"],
  cap:"so a dud is two different findings wearing the same coat",
  call:"and they have completely different fixes",
  note:"So a dud is two findings wearing the same coat. If the enzyme is genuinely inactive in E. coli, that is a real result and you drop the ortholog. If it was never expressed, you have thrown away a gene that might have been the best one in the panel, and the fix is a different codon optimisation or a different five-prime region, not a different organism. Two fixes, and the assay you ran cannot tell you which you need. The way out is to measure expression per member — a tag, or a gel, or a second reporter — or to hold the first thirty codons constant across the panel so the variable you did not intend to test is held down. Neither is expensive. Both are things people skip. Now look at a real panel with this in your hands.",
  desc:"The resolution: an inactive enzyme and an unexpressed one need different fixes, so a panel needs a per-member expression readout or a constant five-prime region." }
];

window.Deck.sequence("duds", function(slide){
  const s = K.scene(slide, 800, 846);

  const f = K.el("g", {});
  f.appendChild(K.path("M330 700H1270", C.muted, 2));
  f.appendChild(K.text(800, 740,
    "measure expression per member, or hold the first thirty codons constant",
    26, C.verm, 700));
  f.appendChild(K.text(800, 772,
    "neither is expensive · both are routinely skipped", 22, C.muted, 400));
  s.part("fix", f);
  s.finish();

  function paint(v){
    const g = K.el("g", {});

    if (v.wells > 0.02){
      const a = K.grp(v.wells);
      WELL.forEach(function(w, i){
        const x = WX + i*WGAP, hit = i === HIT;
        a.appendChild(K.el("circle", {cx:x, cy:WY, r:WR,
          fill:hit ? C.verm : C.muted, "fill-opacity":hit ? ".55" : ".10",
          stroke:hit ? C.verm : C.muted, "stroke-width":hit ? 3 : 2.4}));
        a.appendChild(K.text(x, WY + WR + 30, w, 21,
          hit ? C.verm : C.muted, hit ? 700 : 400));
      });
      a.appendChild(K.text(WX - WR - 26, WY + 9, "product", 24, C.ink, 700, "end"));
      g.appendChild(a);
    }

    if (v.wrong > 0.02){
      const a = K.grp(v.wrong);
      const t = K.el("text", {x:800, y:452, "font-size":29, fill:C.muted,
        "font-weight":400, "text-anchor":"middle"});
      t.innerHTML = K.rich("“those six orthologs are <b>not active</b> in <em>E. coli</em>”");
      a.appendChild(t);
      g.appendChild(a);
    }

    if (v.what > 0.02){
      const a = K.grp(v.what);
      STEP.forEach(function(st){
        a.appendChild(K.text(760, st.y, st.t, 25,
          st.got ? C.blue : C.verm, 700, "end"));
        if (st.got){
          a.appendChild(K.path("M790 "+n1(st.y - 8)+"l10 12 20-26", C.blue, 3.4));
        } else {
          a.appendChild(K.path("M790 "+n1(st.y - 18)+"l24 24M814 "+
            n1(st.y - 18)+"l-24 24", C.verm, 3.4));
          a.appendChild(K.text(838, st.y, "— so this is not ruled out",
            22, C.muted, 400, "start"));
        }
      });
      g.appendChild(a);
    }

    if (v.kud > 0.02){
      const a = K.grp(v.kud);
      a.appendChild(K.text(800, 682,
        "identical protein, synonymous changes only: 250-fold",
        24, C.blue, 700));
      g.appendChild(a);
    }
    return g;
  }
  return K.run(s, FR, paint);
});
})();
