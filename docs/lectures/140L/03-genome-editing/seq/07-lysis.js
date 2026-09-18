/* ------------------------------------------------------------------ *
 * 07-lysis.js — why alkaline lysis separates a plasmid from a genome.
 *
 * The slide was six volumes and three buffer names, and the one idea the
 * whole procedure turns on was only in the speaker note.  Everything
 * else on that slide is pipetting, so the pipetting stays as a list and
 * this is the reason.
 *
 * EVERYTHING HERE IS DOUBLE-STRANDED UNTIL IT IS NOT.  The first version
 * drew the chromosome as one wandering line and the plasmids as plain
 * rings, and JCA: "it doesn't look like a dna, too abstract."  Fair, and
 * worse than cosmetic: the whole argument is about what happens to the
 * TWO STRANDS, and a single line cannot show a strand losing its partner
 * or keeping it.  So a duplex is two lines here, a single strand is one,
 * and every state of the story is legible from the line count alone.
 *
 * WHAT THE STORY IS.  JCA: "what you should be illustrating is that
 * NaOH separates the strands.  Then in the next beat acetate crashes the
 * pH back down and the genome does not properly find its strand and gets
 * crosslinked."  An earlier pass had the chromosome shearing on its way
 * out of the cell and coming apart because it was in pieces; that is a
 * distraction here and it is not what the slide is for.  The alkali
 * separates the chromosome's two strands because nothing holds them
 * together once the base pairing is gone.  It cannot do that to the
 * plasmid, because a covalently closed circle's two strands are threaded
 * through each other and neither has an end to thread out through.  That
 * one difference is the whole method.
 *
 * Drawing kit and the build-once-then-fade rule: seq/parts.js.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;

const CELL = {x:150, y:292, w:750, h:412, r:56};
const TUBE = {x:1037, y:262, w:136, h:500};   /* a 2.0 mL, from G.V */
const W = 3;                          /* one strand's weight */

const n1 = v => Math.round(v*10)/10;

/* ------------------------------------------------------------------ *
 * One strand, as a smooth line through a set of points, optionally
 * offset perpendicular by `e`.  Draw it twice at +e and -e and you have
 * a duplex; draw it once at 0 and you have a single strand.  Smooth
 * rather than straight: the old tangle was a polyline and came out an
 * angular star, which is the one thing DNA never looks like.
 * ------------------------------------------------------------------ */
function strand(pts, e, col, w){
  const q = pts.map(function(p, i){
    const a = pts[Math.max(0, i-1)], b = pts[Math.min(pts.length-1, i+1)];
    let nx = -(b[1]-a[1]), ny = b[0]-a[0];
    const L = Math.hypot(nx, ny) || 1;
    return [p[0] + nx/L*e, p[1] + ny/L*e];
  });
  let d = "M" + n1(q[0][0]) + " " + n1(q[0][1]);
  for (let i = 1; i < q.length - 1; i++){
    const mx = (q[i][0] + q[i+1][0])/2, my = (q[i][1] + q[i+1][1])/2;
    d += "Q" + n1(q[i][0]) + " " + n1(q[i][1]) + " " + n1(mx) + " " + n1(my);
  }
  d += "L" + n1(q[q.length-1][0]) + " " + n1(q[q.length-1][1]);
  return G.el("path", {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || W,
    "stroke-linecap":"round", "stroke-linejoin":"round"});
}
function duplex(pts, e, col){
  const g = G.el("g", {});
  g.appendChild(strand(pts, e, col));
  g.appendChild(strand(pts, -e, col));
  return g;
}

/* The chromosome, folded into the cell: a serpentine sampled as points
   so the same duplex() draws it as the others. */
function serpPts(x0, y0, w, h, rows){
  const gap = h/(rows - 1), r = gap/2, pts = [];
  for (let i = 0; i < rows; i++){
    const y = y0 + i*gap, right = i % 2 === 0;
    const a = right ? x0 + r : x0 + w - r, b = right ? x0 + w - r : x0 + r;
    for (let k = 0; k <= 10; k++) pts.push([a + (b - a)*k/10, y]);
    if (i < rows - 1){
      const cx = right ? x0 + w - r : x0 + r;
      for (let k = 1; k <= 8; k++){
        const t = Math.PI*k/8, s = right ? 1 : -1;
        pts.push([cx + s*r*Math.sin(t), y + r - r*Math.cos(t)]);
      }
    }
  }
  return pts;
}

/* A plasmid: a covalently closed circle, so a duplex ring -- and once
   the alkali has been through it, two loops that have lost their shape
   but not their grip on each other.  Two neat offset circles read as two
   intact plasmids side by side, which is the wrong reading entirely. */
function lobePts(cx, cy, r, k, ph, n){
  const pts = [];
  for (let i = 0; i <= (n || 44); i++){
    const a = 2*Math.PI*i/(n || 44);
    const rr = r*(1 + k*Math.sin(2*a + ph) + k*0.55*Math.sin(3*a - ph*1.7));
    pts.push([cx + rr*Math.cos(a), cy + rr*Math.sin(a)]);
  }
  return pts;
}
function ringPts(cx, cy, r, n){
  const pts = [];
  for (let i = 0; i <= (n || 40); i++){
    const a = 2*Math.PI*i/(n || 40);
    pts.push([cx + r*Math.cos(a), cy + r*Math.sin(a)]);
  }
  return pts;
}
/* THE PLASMIDS DO NOT SIT ON THE CHROMOSOME.  Threaded along its folds
   they read as beads on a string -- JCA: "that looks like you are
   illustrating histones on chromosome, or balls on a track.  It does not
   read as 2 populations."  So the chromosome is a nucleoid occupying its
   own part of the cell and the plasmids are in the cytoplasm beside it,
   which is both what the picture has to say and where they actually are.
   The same split keeps them clear of the tangle three beats later. */
const PLAS = [[632,366,28],[752,340,28],[856,424,28],[624,492,28],
              [748,470,28],[852,570,28],[660,616,28],[784,640,28]];
/* And where they are once there is no cell to be in.  ONE BAND EACH,
   for the rest of the sequence: the chromosome across the top and the
   plasmids in a row underneath it.  They were interleaved and it read
   as one population of beads on one molecule, which is the opposite of
   what the slide is for.  Nothing here ever has to be on top of
   anything else, so nothing is. */
const PLASW = [[252,648,28],[408,624,28],[576,664,28],[718,632,28],
               [892,658,28],[1030,622,28],[1198,662,28],[1338,638,28]];

/* A deterministic wander, for the sheared fragments and for the tangle,
   so the drawing is the same on every build. */
function lcg(seed){
  let t = seed;
  return function(){ t = (t*1103515245 + 12345) % 2147483648; return t/2147483648; };
}
function walk(cx, cy, rx, ry, n, seed, step){
  const rnd = lcg(seed), pts = [];
  let a = rnd()*6.28, x = cx + (rnd()-0.5)*rx, y = cy + (rnd()-0.5)*ry;
  for (let i = 0; i <= n; i++){
    pts.push([x, y]);
    a += (rnd() - 0.5)*1.9;
    x += Math.cos(a)*step; y += Math.sin(a)*step;
    /* steer back before it leaves the blob, so the walk stays a tangle
       rather than wandering off across the slide */
    if (Math.abs(x - cx) > rx) a = Math.atan2(cy - y, cx - x);
    if (Math.abs(y - cy) > ry) a = Math.atan2(cy - y, cx - x);
  }
  return pts;
}

/* The chromosome once the alkali has been through it: one molecule, two
   strands, no longer holding on to each other.  Long loose meanders
   rather than anything folded, because the thing that kept it compact
   was the cell it was in. */
const SEPA = [[190,384],[282,436],[382,348],[496,400],[614,330],[728,394],
              [848,342],[970,428],[1088,346],[1208,394],[1324,350],[1400,388]];
const SEPB = [[190,514],[300,458],[416,538],[530,468],[648,520],[764,452],
              [882,536],[1002,470],[1120,516],[1240,456],[1352,524],[1400,488]];

const FR = [
  { on:["cell","chrom","plas"],
    cap:"one cell: a <b>4.6 Mb</b> chromosome and dozens of copies of a <b>3 kb</b> plasmid",
    call:"both are circular double-stranded DNA &#183; what differs is length, and length decides everything after this",
    note:"Start with what is in the cell. One chromosome, four and a half million base pairs of it, folded into a nucleoid, and some tens of copies of your plasmid at three thousand, loose in the cytoplasm beside it. Both are double-stranded and both are covalently closed circles, which is why each is drawn with two lines. That difference in length is the only thing this method uses.",
    desc:"A cell drawn as a rounded box. In its left half the chromosome is folded back and forth into a compact nucleoid, drawn as a long double-stranded molecule. In the cytoplasm beside it, clear of the chromosome, eight small double-stranded rings standing for copies of the plasmid." },

  { on:["sep","plasX","p2"],
    cap:"<b>P2</b> is SDS and NaOH &#183; it bursts the cell and denatures everything in it",
    call:"the chromosome loses all its organisation &#183; the plasmid&rsquo;s two strands stay topologically linked",
    note:"P2 does two things at once. The SDS dissolves the membrane and denatures protein, and the sodium hydroxide denatures the DNA: every base pair in the tube lets go, the plasmid's included. Be clear that the plasmid denatures too, because the difference is not whether they come unpaired, it is what happens to them once they have. The chromosome is four and a half megabases of unpaired strand with nothing organising it any more, and its two strands simply drift apart. The plasmid's cannot drift anywhere: they are wound round each other in a closed circle and neither has an end to thread out through, so they stay interlinked however thoroughly the pairing is broken. That is why this is the step you do not leave running longer than the protocol says. Given long enough the plasmid denatures irreversibly too.",
    desc:"The cell has burst. The chromosome is now two long single strands wandering separately across the field, one dark and one grey. Each plasmid is drawn as two rings offset from each other and crossing, unpaired but still threaded together." },

  { on:["tangle","plasW","n3"],
    cap:"<b>N3</b> neutralises &#183; the pH crashes back down and everything tries to re-pair",
    call:"small and still linked &#8594; it renatures &#183; huge and disorganised &#8594; it ends up in the precipitate",
    note:"N3 drops the pH back in one go and puts the tube into high salt at the same time, and everything tries to re-pair at once. The plasmid manages it, because its partner strand never went anywhere, and it zips straight back into a clean closed circle that stays in solution. The chromosome cannot. Its strands have drifted apart and there is nothing left holding the molecule in register, so instead of re-pairing cleanly it tangles with itself and with everything else in the tube. And the tube is full of things to tangle with: denatured protein, cell debris, and the SDS, which in potassium acetate comes out of solution as potassium dodecyl sulfate. The chromosome ends up inside that precipitate. Nothing is chemically cross-linked here, it is an aggregate, and that is the whole of the separation.",
    desc:"The plasmid rings have gone back to being clean double-stranded circles. The chromosome has collapsed into a dense cross-linked tangle of strands crossing each other." },

  { on:["tangle","tube","n3"],
    cap:"spin, and the tangle goes to the bottom",
    call:"the plasmid stays in solution, and the supernatant is what you put on the column",
    note:"Five minutes in the centrifuge and the aggregate pellets, taking the protein, the debris and the precipitated detergent down with it. What is left floating is your plasmid, still double-stranded, still covalently closed, and that supernatant is the cleared lysate that goes on the column. And now you can see why the protocol keeps telling you not to vortex: shear the chromosome into short enough pieces and they re-pair well enough to stay in solution, and they come through into your prep. Inverting gently keeps it long, and long is what gets left behind.",
    desc:"The tangle, and beside it a tube of liquid with a meniscus near the top, a dense pellet at the bottom, and the small double-stranded rings floating in the supernatant between them." }
];


window.Deck.sequence("lysis", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const s = G.scene(slide, 786, 830);

  s.part("cell", G.el("rect", {x:CELL.x, y:CELL.y, width:CELL.w, height:CELL.h,
    rx:CELL.r, fill:"none", stroke:C.ink, "stroke-width":3}));

  s.part("chrom", duplex(serpPts(202, 350, 336, 296, 9), 4.5, C.ink));


  /* denatured: the same molecule, its two strands no longer paired */
  s.part("sep", (function(){
    const g = G.el("g", {});
    g.appendChild(strand(SEPA, 0, C.ink));
    g.appendChild(strand(SEPB, 0, C.muted));
    return g;
  })());

  s.part("tangle", (function(){
    const g = G.el("g", {});
    [[11, C.ink], [83, C.muted], [157, C.ink], [229, C.muted], [313, C.ink]]
      .forEach(function(t, i){
        g.appendChild(strand(walk(578, 428, 228, 104, 46, t[0], 42), 0, t[1]));
      });
    return g;
  })());

  /* The plasmids go on LAST so they sit in front of the chromosome: at
     the tangle beat they were disappearing into it. */
  /* The paper underlay is what puts a plasmid in FRONT of the
     chromosome.  It was r+10, which bit a visible notch out of every
     fragment it crossed -- and on a beat whose whole point is that the
     chromosome is in pieces, a drawing must not invent extra breaks. */
  function plasmids(where, off){
    const g = G.el("g", {});
    where.forEach(function(p){
      g.appendChild(G.el("circle", {cx:p[0], cy:p[1], r:p[2] + 5,
        fill:C.paper, stroke:"none"}));
      if (off){
        /* unpaired but still threaded: two rings of the same size whose
           centres have drifted, so they cross rather than nest */
        g.appendChild(strand(lobePts(p[0] - off*0.7, p[1] - off*0.7, p[2], 0.20, 0.7), 0, C.blue));
        g.appendChild(strand(lobePts(p[0] + off*0.7, p[1] + off*0.7, p[2], 0.20, 2.5), 0, C.muted));
      } else {
        g.appendChild(duplex(ringPts(p[0], p[1], p[2]), 4.5, C.blue));
      }
    });
    return g;
  }
  s.part("plas",  plasmids(PLAS,  0));
  s.part("plasW", plasmids(PLASW, 0));
  s.part("plasX", plasmids(PLASW, 13));

  s.part("p2", G.text(760, 258, "P2 · SDS + NaOH", 27, C.verm, 700));
  s.part("n3", G.text(578, 262, "N3 · neutralise + high salt", 27, C.verm, 700));

  s.part("tube", (function(){
    const g = G.el("g", {}), V = G.V, T = TUBE;
    const cn = V.CONE20, ML = T.y + 68;
    /* The liquid.  Without it the tube is an outline with things
       floating in mid-air, and the caption's word -- supernatant -- has
       nothing on the slide to point at.  The glassware is the shared
       2.0 mL from parts.js: this slide used to draw its own tube, a
       squat thing with a round bottom, and it no longer matched the one
       the bench slides put the same lysate in. */
    g.appendChild(V.contents(T.x, T.w, T.y, T.h, ML, C.blue, ".09", cn));
    g.appendChild(V.eppy(T.x, T.w, T.y, T.h, cn));
    g.appendChild(V.pellet(T.x, T.w, T.y, T.h, C.ink, ".82", cn));
    g.appendChild(G.text(T.x - 22, T.y + 250, "supernatant", 21, C.muted, 400, "end"));
    /* two lines: naming everything in the pellet put the label off the
       right edge of the slide */
    g.appendChild(G.text(T.x + T.w + 22, T.y + T.h - 52,
      "chromosomal DNA, protein,", 21, C.muted, 400, "start"));
    g.appendChild(G.text(T.x + T.w + 22, T.y + T.h - 26,
      "cell debris, precipitated SDS", 21, C.muted, 400, "start"));
    g.appendChild(G.text(T.x + T.w + 22, T.y + 132, "plasmid", 23, C.blue, 700, "start"));
    /* all four below the meniscus and above the pellet, placed by the
       tube's own geometry so none of them can end up in the wall */
    [[-.78,-.88],[.62,-.55],[-.66,-.10],[.55,.28]].forEach(function(c){
      const q = V.inLiquid(T.x, T.w, T.y, T.h, ML, c[0], c[1], 28, cn);
      if (q) g.appendChild(duplex(ringPts(q[0], q[1], 20), 4.5, C.blue));
    });
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
