/* ------------------------------------------------------------------ *
 * 07-lysis.js — why alkaline lysis separates a plasmid from a genome.
 *
 * The slide was six volumes and three buffer names, and the one idea the
 * whole procedure turns on was only in the speaker note: a small circle
 * finds its partner strand again when the pH comes back down, and a 4.6
 * megabase chromosome does not.  Everything else on that slide is
 * pipetting.  So the pipetting stays as a list and this is the reason,
 * in four beats.
 *
 * The chromosome is drawn as one long line that wanders, the plasmid as
 * small circles, and the whole argument is the difference in length --
 * which is why the chromosome is drawn crossing itself and the plasmids
 * are not.  Nothing here is to scale; 4.6 Mb against 3 kb could not be.
 *
 * Drawing kit and the build-once-then-fade rule: seq/parts.js.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;

const CELL = {x:150, y:292, w:640, h:412, r:56};
const TUBE = {x:980, y:262, w:250, h:442};

/* One very long molecule folded into a small space: a serpentine with
   rounded turns.  The first attempt used a sine of x, which draws a
   sawtooth -- it reads as a graph, not as DNA.  What makes this read as
   length is the folding, so the folding is the drawing. */
function serpentine(x0, y0, w, h, rows, col, dash){
  const gap = h / (rows - 1), r = gap / 2;
  let d = "M" + x0 + " " + y0;
  for (let i = 0; i < rows - 1; i++){
    const y = y0 + i*gap, right = i % 2 === 0;
    d += "H" + (right ? x0 + w : x0);
    d += "a" + r + " " + r + " 0 0 " + (right ? 1 : 0) + " 0 " + gap;
  }
  d += "H" + ((rows - 1) % 2 === 0 ? x0 + w : x0);
  const at = {d:d, fill:"none", stroke:col, "stroke-width":3,
              "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) at["stroke-dasharray"] = dash;
  return G.el("path", at);
}
/* A plasmid lays down paper first, so it reads as being in front of the
   chromosome rather than tangled into it. */
function circles(spec, col, off){
  const g = G.el("g", {});
  spec.forEach(function(c){
    g.appendChild(G.el("circle", {cx:c[0], cy:c[1], r:c[2] + 5, fill:C.paper, stroke:"none"}));
    g.appendChild(G.el("circle", {cx:c[0], cy:c[1], r:c[2], fill:"none",
      stroke:col, "stroke-width":3}));
    if (off) g.appendChild(G.el("circle", {cx:c[0] + off, cy:c[1] + off, r:c[2],
      fill:"none", stroke:col, "stroke-width":3, "stroke-dasharray":"7 6"}));
  });
  return g;
}
/* tucked between the folds, and sized so the paper underlay clears the
   line on either side */
const PLAS = [[268,372,26],[452,372,26],[636,372,26],
              [360,500,26],[544,500,26],[268,628,26],[636,628,26]];

const FR = [
  { on:["chrom","plas"],
    cap:"one cell: a <b>4.6 Mb</b> chromosome, and dozens of copies of a <b>3 kb</b> plasmid",
    call:"both are double-stranded circles &#183; the only difference that matters is length",
    note:"Start with what is in the cell. One chromosome, four and a half million base pairs of it, and some tens of copies of your plasmid at three thousand. Both are covalently closed circles. That difference in length is the only thing this method uses.",
    desc:"A cell drawn as a rounded box. Inside it, one long line that wanders back and forth across the whole box and crosses itself, standing for the chromosome, and six small circles standing for copies of the plasmid." },
  { on:["chromX","plasX","p2"],
    cap:"<b>P2</b> is NaOH and SDS &#183; it pulls every base pair in the cell apart",
    call:"the plasmid&rsquo;s two strands are still wound round each other &#183; they cannot float away",
    note:"P2 is the lysis. The SDS dissolves the membrane and the sodium hydroxide denatures everything it can reach, chromosome and plasmid alike. But notice what denaturing does not do to a covalently closed circle: the two strands are interlinked, so they come unpaired without ever separating. This is the step you do not leave running, because given long enough even that gives way.",
    desc:"Every molecule in the cell has come apart into single strands. The chromosome is now two long separate lines, and each plasmid is drawn as two circles slightly offset from each other, still threaded together." },
  { on:["chromT","plas","n3"],
    cap:"<b>N3</b> drops the pH back &#183; the small one finds its partner instantly",
    call:"the chromosome cannot &#183; nothing that long finds the right strand again, so it tangles",
    note:"N3 brings the pH back down and everything tries to re-pair. The plasmid manages it immediately, because its partner strand never went anywhere. The chromosome does not: at four and a half megabases the odds of a strand finding its own partner rather than a neighbour are nil, so it tangles with itself, with the other strands and with the SDS and protein. That difference is the entire method.",
    desc:"The plasmids have gone back to being clean circles. The chromosome has collapsed into a dense tangle." },
  { on:["chromT","plas","tube","n3"],
    cap:"spin, and the tangle goes to the bottom",
    call:"the plasmid stays in solution, and the supernatant is what you put on the column",
    note:"Five minutes in the centrifuge and the tangle pellets, taking the protein and the SDS with it. What is left floating is your plasmid, and that supernatant is what goes on the column.",
    desc:"A tube beside the cell, with a dense pellet at its bottom and clear liquid above it carrying the small circles." }
];

window.Deck.sequence("lysis", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const s = G.scene(slide, 786, 830);

  s.add(G.el("rect", {x:CELL.x, y:CELL.y, width:CELL.w, height:CELL.h, rx:CELL.r,
    fill:"none", stroke:C.ink, "stroke-width":3}));

  s.part("chrom",  serpentine(196, 330, 548, 340, 9, C.ink));
  /* denatured: the chromosome as two separate lines, the plasmid as two
     circles that are unpaired but still threaded through each other */
  s.part("chromX", (function(){
    const g = G.el("g", {});
    g.appendChild(serpentine(196, 324, 548, 340, 9, C.ink));
    g.appendChild(serpentine(196, 340, 548, 340, 9, C.muted, "9 7"));
    return g;
  })());
  /* renatured: the chromosome is a tangle, drawn as many turns in a small
     box, because that is what "could not find its partner" looks like */
  /* A tangle is not a neat stack.  The serpentine was reused here at
     first and it read as orderly -- parallel lines, evenly spaced, which
     is the opposite of the point.  This is a scribble that crosses
     itself, generated from a fixed seed so it never changes between
     builds. */
  s.part("chromT", (function(){
    const g = G.el("g", {});
    /* A CONSTANT angular step draws a rosette, however irregular the
       radius is -- the golden angle gave a tidy geometric star, which is
       not what a tangle looks like either.  Both the angle and the radius
       have to wander, so both come off one small deterministic generator
       and the drawing is the same on every build. */
    function scribble(cx, cy, rx, ry, n, seed, col, dash){
      let t = seed, a = 0, d = "";
      const rnd = function(){ t = (t * 1103515245 + 12345) % 2147483648; return t / 2147483648; };
      for (let i = 0; i <= n; i++){
        a += 1.1 + rnd() * 3.4;
        const k = 0.30 + 0.70 * rnd();
        d += (i ? "L" : "M") + Math.round(cx + rx * k * Math.cos(a)) + " " +
                               Math.round(cy + ry * k * Math.sin(a));
      }
      const at = {d:d, fill:"none", stroke:col,
        "stroke-width":3, "stroke-linecap":"round", "stroke-linejoin":"round"};
      if (dash) at["stroke-dasharray"] = dash;
      return G.el("path", at);
    }
    g.appendChild(scribble(468, 512, 200, 132, 54, 7, C.ink));
    g.appendChild(scribble(468, 512, 186, 122, 54, 91, C.muted, "9 7"));
    return g;
  })());

  /* the plasmids go on LAST so they sit in front of the chromosome: at
     the tangle beat the scribble is drawn over everything added before
     it, and two of them were disappearing into it. */
  s.part("plas",   circles(PLAS, C.blue));
  s.part("plasX",  circles(PLAS, C.blue, 9));

  s.part("p2", G.text(470, 262, "NaOH + SDS", 27, C.verm, 700));
  s.part("n3", G.text(470, 262, "back to neutral", 27, C.verm, 700));

  s.part("tube", (function(){
    const g = G.el("g", {});
    g.appendChild(G.el("path", {
      d:"M"+TUBE.x+" "+TUBE.y+"V"+(TUBE.y+TUBE.h-70)+
        "Q"+(TUBE.x+TUBE.w/2)+" "+(TUBE.y+TUBE.h+50)+" "+(TUBE.x+TUBE.w)+" "+(TUBE.y+TUBE.h-70)+
        "V"+TUBE.y, fill:"none", stroke:C.ink, "stroke-width":3, "stroke-linejoin":"round"}));
    g.appendChild(G.el("path", {
      d:"M"+(TUBE.x+42)+" "+(TUBE.y+TUBE.h-84)+
        "Q"+(TUBE.x+TUBE.w/2)+" "+(TUBE.y+TUBE.h+34)+" "+(TUBE.x+TUBE.w-42)+" "+(TUBE.y+TUBE.h-84)+"Z",
      fill:C.ink, "fill-opacity":".82", stroke:"none"}));
    g.appendChild(G.text(TUBE.x+TUBE.w+22, TUBE.y+TUBE.h-24,
      "chromosome, protein, SDS", 23, C.muted, 400, "start"));
    g.appendChild(G.text(TUBE.x+TUBE.w+22, TUBE.y+120, "plasmid", 23, C.blue, 700, "start"));
    [[1048,344,17],[1130,392,17],[1070,446,17],[1160,318,17]]
      .forEach(c => g.appendChild(G.el("circle", {cx:c[0], cy:c[1], r:c[2],
        fill:"none", stroke:C.blue, "stroke-width":3})));
    return g;
  })());
  s.finish();

  function go(i, animated){
    const f = FR[Math.max(0, Math.min(FR.length - 1, i | 0))];
    s.show(f.on, f, animated === false || reduce.matches);
  }
  go(0, false);
  return { steps: FR.map(f => ({note:f.note, desc:f.desc})), go: go };
});
})();
