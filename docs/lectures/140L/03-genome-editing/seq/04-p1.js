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
    cap:"the donor is a strain you have already modified &#183; the marker is in its genome" },
  { on:["dcell","dgen","marker","rcell","rgen","infect"],
    cap:"infect it with P1vir &#183; a lytic phage, so it replicates and packages and kills" },
  { on:["dcell","rcell","rgen","burst","oddone"],
    cap:"most heads get phage DNA &#183; about two in a hundred get a random 90 kb piece of the host genome instead",
    call:"nothing aims that &#183; it is a packaging mistake, and the method is built on it" },
  { on:["rcell","rgen","lysate"],
    cap:"chloroform kills anything unlysed, and the lysate goes onto the recipient" },
  { on:["rcell","rgen","inject","frag"],
    cap:"a phage carrying genome injects it like any other cargo",
    call:"the recipient is not infected by it &#183; there is no phage DNA in that head" },
  { on:["rcell","rgen","moved"],
    cap:"the fragment recombines with the recipient&rsquo;s own genome",
    call:"select the marker and you have moved a locus between two strains" }
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
  return { steps: FR.map(() => ({})), go: go };
});
})();
