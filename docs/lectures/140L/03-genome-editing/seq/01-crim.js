/* ------------------------------------------------------------------ *
 * 01-crim.js — the CRIM phi80 integration, source slides 6 to 8.
 *
 * Three source slides, five beats.  The source marks two of its own
 * clicks with a "*" mid-note, and both are a plasmid arriving or leaving,
 * so the beats are the five things that happen to the cell rather than
 * the three pictures that were drawn of them.
 *
 * The CRIM's cargo exists twice, once as a circle and once laid out on
 * the genome line, and integration is a crossfade between the two -- one
 * picture each side of it, which is how the source slides show it.
 *
 * Drawing kit and the build-once-then-fade rule: seq/parts.js.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;

const BOX = {x:170, y:286, w:1260, h:436};
const GY = 656, GX0 = 226, GX1 = 1374;
const PR = 112, HX = 470, CX = 1090, PY = 452;

const FR = [
  { on:["attB"],
    cap:"MG1655 and everything descended from it already carries the att site",
    call:"so most laboratory strains are ready for this without any work" },
  { on:["attB","helper"],
    cap:"the helper plasmid brings the integrase &#183; bla selects it, and its origin only works at 30&#176;C" },
  { on:["attB","helper","crim"],
    cap:"the CRIM carries attP, the marker, and an R6K origin that cannot replicate here",
    call:"so it is in the cell, but only passing through" },
  { on:["helper","ing"],
    cap:"integrase recombines attP with attB, and the whole plasmid lands in the genome",
    call:"one crossover, so all of it goes in &#183; CmR now selects the integrants" },
  { on:["ing"],
    cap:"grown at 42&#176;C the helper cannot replicate, and is lost",
    call:"the cargo is in the genome and nothing else has changed" }
];

window.Deck.sequence("crim", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const s = G.scene(slide);

  s.add(G.cell(BOX, GY, GX0, GX1));
  s.part("attB", G.feat(742, GY, 116, "attBϕ80", C.blue));
  s.part("helper", G.plasmid(HX, PY, PR, [
    {a0:-128, a1:-40, col:C.blue,  txt:"int ϕ80"},
    {a0:-20,  a1:70,  col:C.blue,  txt:"bla"},
    {a0:96,   a1:176, col:C.amber, txt:"ori ts"}
  ], "helper"));
  s.part("crim", G.plasmid(CX, PY, PR, [
    {a0:-140, a1:-56, col:C.verm,  txt:"CmR"},
    {a0:-38,  a1:44,  col:C.amber, txt:"oriR6K"},
    {a0:64,   a1:140, col:C.verm,  txt:"attPϕ80"}
  ], "CRIM"));

  const ing = G.el("g", {});
  [[566,104,"attLϕ80",C.verm],[678,140,"oriR6K",C.amber],
   [826,104,"CmR",C.verm],[938,104,"attRϕ80",C.verm]]
    .forEach(f => ing.appendChild(G.feat(f[0], GY, f[1], f[2], f[3])));
  s.part("ing", ing);
  s.finish();

  function go(i, animated){
    const f = FR[Math.max(0, Math.min(FR.length - 1, i | 0))];
    s.show(f.on, f, animated === false || reduce.matches);
  }
  go(0, false);
  return { steps: FR.map(() => ({})), go: go };
});
})();
