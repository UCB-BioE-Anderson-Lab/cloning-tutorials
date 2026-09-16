/* ------------------------------------------------------------------ *
 * 03-crispr.js — the two-plasmid CRISPR knockout, source slides 40 to 45.
 *
 * Six source slides, seven beats.  The extra one is the cut: the source
 * puts the cut and the repair on separate slides but draws the cut with
 * the repair template already in the picture, so the moment the genome is
 * actually broken never gets a frame of its own.  It does here, because
 * that break is the only thing in the method that Cas9 does.
 *
 * The genome exists twice, whole and cut, and the break is a crossfade
 * between them.  Everything else is the kit: seq/parts.js.
 *
 * The source draws both plasmids as Addgene map screenshots.  They are
 * redrawn here for the same reason every other cartoon in this deck is:
 * a screenshot cannot lose a plasmid when the plasmid is cured.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;

const BOX = {x:170, y:420, w:1260, h:336, r:46};
const GY = 690, GX0 = 226, GX1 = 1374;
const PR = 76, AX = 372, BX = 1046, PY = 546;
const TX = 700, TW = 200;            /* the target gene on the genome */

const FR = [
  { on:["whole","target"],
    cap:"any strain carrying the gene you want gone" },
  { on:["whole","target","pcas"],
    cap:"pCas needs no modification &#183; it brings Cas9, lambda red under Pbad, and a guide against pMB1 under IPTG",
    call:"three switches on one plasmid, and the method uses all three" },
  { on:["whole","target","pcas","ptarget"],
    cap:"pTarget is the part you build: a guide against your gene, and a template to repair it with",
    call:"one of these per site &#183; its pMB1 origin is what the pCas guide is aimed at" },
  { on:["cut","pcas","ptarget"],
    cap:"Cas9 and the gene-targeted guide cut the genome",
    call:"a double-strand break in a bacterium is lethal unless something repairs it" },
  { on:["whole","edited","pcas","ptarget"],
    cap:"arabinose had already switched lambda red on, so the break is repaired off the template on pTarget",
    call:"the cell has to take the edit &#183; the only alternative is dying" },
  { on:["whole","edited","pcas"],
    cap:"IPTG switches on the guide aimed at pMB1, and pTarget cuts itself",
    call:"the plasmid you built is cleared by the plasmid you bought" },
  { on:["whole","edited"],
    cap:"42&#176;C clears pCas",
    call:"a markerless edit, and nothing left in the cell" }
];

window.Deck.sequence("crispr", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const s = G.scene(slide);

  s.add(G.el("rect", {x:BOX.x, y:BOX.y, width:BOX.w, height:BOX.h, rx:BOX.r,
    fill:"none", stroke:C.ink, "stroke-width":3}));
  s.add(G.text(GX0, GY + 42, "Genome", 25, C.muted, 400, "start"));

  const seg = (x0, x1) => G.el("path", {d:"M"+x0+" "+GY+"H"+x1, stroke:C.ink,
    "stroke-width":3.5, fill:"none", "stroke-linecap":"round"});

  s.part("whole", seg(GX0, GX1));
  /* cut: the same line with the target's width taken out of the middle,
     so the gap is exactly the thing that was there */
  const cut = G.el("g", {});
  cut.appendChild(seg(GX0, TX + 12));
  cut.appendChild(seg(TX + TW - 12, GX1));
  cut.appendChild(G.text(TX + TW/2, GY - 26, "✂", 34, C.verm, 400));
  s.part("cut", cut);

  s.part("target",  G.feat(TX, GY, TW, "target", C.ink));
  s.part("edited",  G.feat(TX, GY, TW, "edited", C.blue));

  s.part("pcas", G.plasmid(AX, PY, PR, [
    {a0:-150, a1:-96, col:C.blue,  txt:"Cas9"},
    {a0:-84,  a1:-24, col:C.blue,  txt:"red genes"},
    {a0:-8,   a1:56,  col:C.verm,  txt:"gRNA-pMB1"},
    {a0:70,   a1:112, col:C.blue,  txt:"KanR"},
    {a0:126,  a1:176, col:C.amber, txt:"ori ts"}
  ], "pCas"));
  s.part("ptarget", G.plasmid(BX, PY, PR, [
    {a0:-146, a1:-70, col:C.verm,  txt:"gRNA-target"},
    {a0:-56,  a1:22,  col:C.blue,  txt:"template"},
    {a0:36,   a1:96,  col:C.amber, txt:"pMB1"},
    {a0:110,  a1:172, col:C.verm,  txt:"SpecR"}
  ], "pTargetF"));
  s.finish();

  function go(i, animated){
    const f = FR[Math.max(0, Math.min(FR.length - 1, i | 0))];
    s.show(f.on, f, animated === false || reduce.matches);
  }
  go(0, false);
  return { steps: FR.map(() => ({})), go: go };
});
})();
