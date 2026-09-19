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
    call:"so most laboratory strains are ready for this without any work",
    note:"Start with the cell, and notice that nothing has been done to it. MG1655 is the grandaddy of most modern lab E. coli strains and it carries the phi80 att site already, so anything descended from it \u2014 which is most of what is in your freezer \u2014 is ready for this without any preparation. That is the thing to appreciate before we add anything: the landing pad is not something you build. It is a phage integration site the strain has had all along, and the whole method is borrowing it.",
    desc:"A cell drawn as a rounded box with its genome as a line along the floor. On the genome, the phi80 attB site is marked in blue." },
  { on:["attB","helper"],
    cap:"the helper plasmid brings the integrase &#183; bla selects it, and its origin only works at 30&#176;C",
    note:"A helper plasmid with a beta-lactamase gene is introduced into the cell by transformation and selected on ampicillin. The plasmid contains a temperature sensitive origin of replication, so the cells are grown at the permissive temperature of 30 degrees. It also encodes the phi80 integrase, and the cells start producing the protein.",
    desc:"A plasmid labelled helper appears inside the cell, carrying the phi80 integrase and bla in blue and a temperature-sensitive origin in amber." },
  { on:["attB","helper","crim"],
    cap:"the CRIM carries attP, the marker, and an R6K origin that cannot replicate here",
    call:"so it is in the cell, but only passing through",
    note:"The cells are then transformed again with the CRIM plasmid. This plasmid has a conditional origin of replication called R6K. In a cell that lacks the pir gene, which is true of most laboratory strains, this origin cannot replicate. Thus, this plasmid is only transiently present in the cell. It also contains an antibiotic selection marker, CmR, and the attP site.",
    desc:"A second plasmid labelled CRIM appears beside it, carrying CmR and attP in red and the R6K origin in amber." },
  { on:["helper","ing"],
    cap:"integrase recombines attP with attB, and the whole plasmid lands in the genome",
    call:"one crossover, so all of it goes in &#183; CmR now selects the integrants",
    note:"Integrase from the helper plasmid catalyzes the single-crossover recombination of the CRIM plasmid into the attB site of the genome. Now that it is in the genome, it will replicate with the rest of the genome. The CmR gene confers chloramphenicol resistance, allowing the selection of integrants on antibiotic-containing medium.",
    desc:"The CRIM plasmid has gone from inside the cell and its contents are now laid out along the genome: attL, the R6K origin, CmR and attR, all sitting on the line where the att B site used to be." },
  { on:["ing"],
    cap:"grown at 42&#176;C the helper cannot replicate, and is lost",
    call:"the cargo is in the genome and nothing else has changed",
    note:"The cells are grown at a temperature non-permissive for replication of the helper plasmid, 42 degrees, resulting in the final product, which is a cell with the CRIM inserted into the genome, and no other residual modification to the strain's original composition.",
    desc:"The helper plasmid has gone. What is left is the cell, its genome, and the integrated cargo on it." }
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
  /* one note and one desc per beat: without these deck.js falls back
     to the slide\'s single <template>, and presenter view shows the
     same sentence for every click while the picture changes */
  return { steps: FR.map(f => ({note:f.note, desc:f.desc})), go: go };
});
})();
