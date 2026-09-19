/* ------------------------------------------------------------------ *
 * 04-p1.js — P1 generalized transduction, source slide 55.
 *
 * One source slide with a borrowed figure on it, drawn here instead, for
 * the one reason that matters: the whole method turns on a mistake that
 * happens about two percent of the time, and a still picture cannot show
 * something being rare.  Six beats, and the third is the mistake.
 *
 * Two cells, a lysate between them, and the donor's marker ending up in
 * the recipient's genome without either cell ever meeting the other.
 *
 * Drawing kit and the build-once-then-fade rule: seq/parts.js.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;

const D = {x:186, y:396, w:520, h:286, r:44};   /* donor      */
const R = {x:894, y:396, w:520, h:286, r:44};   /* recipient  */
const DGY = 628, RGY = 628;

/* A phage: hexagonal head, tail, baseplate.  col is what is inside it. */
function phage(x, y, col, k){
  const s = k || 1, g = G.el("g", {});
  const h = 17*s;
  g.appendChild(G.el("path", {
    d:"M"+x+" "+(y-h)+"L"+(x+h*0.87)+" "+(y-h*0.5)+"L"+(x+h*0.87)+" "+(y+h*0.5)+
      "L"+x+" "+(y+h)+"L"+(x-h*0.87)+" "+(y+h*0.5)+"L"+(x-h*0.87)+" "+(y-h*0.5)+"Z",
    fill:col, "fill-opacity":".22", stroke:col, "stroke-width":2.2}));
  g.appendChild(G.el("path", {d:"M"+x+" "+(y+h)+"V"+(y+h+16*s),
    stroke:col, "stroke-width":2.2}));
  g.appendChild(G.el("path", {d:"M"+(x-7*s)+" "+(y+h+16*s)+"H"+(x+7*s),
    stroke:col, "stroke-width":2.2}));
  return g;
}
/* A head full of phage is a crowd, and a crowd drawn on a spiral overlaps
   itself.  These sit on a grid instead, with one slot left empty for the
   rare one so it is not buried by the common ones. */
function swarm(x0, y0, cols, rows, dx, dy, col, skip){
  const g = G.el("g", {});
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++){
      const i = r*cols + c;
      if (skip != null && i === skip) continue;
      g.appendChild(phage(x0 + c*dx, y0 + r*dy, col, 0.72));
    }
  return g;
}

const FR = [
  { on:["dcell","dgen","marker","rcell","rgen"],
    cap:"the donor is a strain you have already modified &#183; the marker is in its genome",
    note:"P1 generalized transduction involves the transfer of random DNA fragments from one strain of E. coli to another. You start with a donor: a strain whose genome you have already modified, carrying a selectable marker.",
    desc:"Two cells side by side, a donor on the left with a marker in its genome and a recipient on the right." },
  { on:["dcell","dgen","marker","rcell","rgen","infect"],
    cap:"infect it with P1vir &#183; a lytic phage, so it replicates and packages and kills",
    note:"First, the donor cell is infected with P1vir phage. It is a lytic phage, so it will replicate inside the cell, package itself, and kill the host.",
    desc:"A single phage particle is drawn over the donor cell." },
  { on:["dcell","rcell","rgen","burst","oddone"],
    cap:"most heads get phage DNA &#183; about two in a hundred get a random 90 kb piece of the host genome instead",
    call:"nothing aims that &#183; it is a packaging mistake, and the method is built on it",
    note:"When a lytic phage infects a cell, usually it will package its own DNA. However, the process incorporates a piece of genomic DNA instead around 2 percent of the time, and the sequence incorporated into the phage head is a random one. Nothing directs it. The whole method is built on a packaging mistake.",
    desc:"The donor's genome has gone and the cell is full of phage particles, fourteen of them drawn in blue. One, in the bottom right corner, is drawn in red and labelled one head in fifty." },
  { on:["rcell","rgen","lysate"],
    cap:"chloroform kills anything unlysed, and the lysate goes onto the recipient",
    note:"Chloroform into the lysate, which kills any donor cell that did not lyse. That matters more than it sounds: without it you are carrying live donor cells into the recipient culture, and since the donor is the strain that already has the marker, those cells will grow on your selection and look exactly like the transductants you are trying to make. Phage particles are unharmed by chloroform, so what goes onto the recipient is phage and nothing else.",
    desc:"The donor cell is empty and a group of phage particles has moved across to sit between the two cells, an arrow carrying them toward the recipient. One of them is red." },
  { on:["rcell","rgen","inject","frag"],
    cap:"a phage carrying genome injects it like any other cargo",
    call:"the recipient is not infected by it &#183; there is no phage DNA in that head",
    note:"For the rare phages that contain a piece of genome, this DNA will be injected into the recipient cell. Note what does not happen: there is no phage DNA in that head, so the recipient is not infected.",
    desc:"The red phage is now at the recipient cell, and a red segment labelled 90 kb has appeared on the recipient's genome." },
  { on:["rcell","rgen","moved"],
    cap:"the fragment recombines with the recipient&rsquo;s own genome",
    call:"select the marker and you have moved a locus between two strains",
    note:"The injected fragment will undergo homologous recombination with the recipient genome. If that fragment of DNA contains a selectable marker, these transduced cells can be selected. P1 moves 90kb random chunks, which makes it useful for transferring single genes or even large gene clusters from one genome to another.",
    desc:"The phage has gone and the segment on the recipient's genome is now labelled marker: the donor's modification is in the recipient's chromosome." }
];

window.Deck.sequence("p1", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const s = G.scene(slide);

  function box(b, label){
    const g = G.el("g", {});
    g.appendChild(G.el("rect", {x:b.x, y:b.y, width:b.w, height:b.h, rx:b.r,
      fill:"none", stroke:C.ink, "stroke-width":3}));
    g.appendChild(G.text(b.x + b.w/2, b.y - 18, label, 26, C.muted, 400));
    return g;
  }
  const line = (b, y) => G.el("path", {d:"M"+(b.x+30)+" "+y+"H"+(b.x+b.w-30),
    stroke:C.ink, "stroke-width":3.5, fill:"none", "stroke-linecap":"round"});

  s.part("dcell", box(D, "donor"));
  s.part("dgen",  line(D, DGY));
  s.part("marker",G.feat(370, DGY, 150, "marker", C.verm));
  s.part("rcell", box(R, "recipient"));
  s.part("rgen",  line(R, RGY));

  s.part("infect", phage(446, 300, C.blue, 1.5));
  s.part("burst",  swarm(286, 462, 5, 3, 80, 62, C.blue, 14));
  /* the rare head, and it is drawn once because it happens once */
  s.part("oddone", (function(){
    /* bottom right of the grid, so its leader runs down the outside
       and does not cross another head on the way to the label */
    const g = G.el("g", {}), x = 286 + 4*80, y = 462 + 2*62;
    g.appendChild(phage(x, y, C.verm, 1.1));
    g.appendChild(G.el("path", {d:"M"+x+" "+(y+34)+"V"+(D.y+D.h+18),
      stroke:C.verm, "stroke-width":2, "stroke-dasharray":"4 5", fill:"none"}));
    g.appendChild(G.text(x, D.y + D.h + 44, "one head in fifty", 24, C.verm, 700));
    return g;
  })());
  s.part("lysate", (function(){
    const g = swarm(722, 470, 2, 3, 74, 62, C.blue, null);
    g.appendChild(phage(796, 594, C.verm, 1.1));
    g.appendChild(G.el("path", {d:"M706 388H880M860 374L886 388L860 402",
      stroke:C.muted, "stroke-width":3, fill:"none",
      "stroke-linecap":"round", "stroke-linejoin":"round"}));
    return g;
  })());
  s.part("inject", phage(1000, 470, C.verm, 1.3));
  s.part("frag",   G.feat(1086, RGY, 150, "90 kb", C.verm));
  s.part("moved",  G.feat(1086, RGY, 150, "marker", C.verm));
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
