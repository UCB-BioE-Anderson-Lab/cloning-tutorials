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
 * THE MECHANISM THE OLD VERSION SKIPPED.  It had the chromosome failing
 * to re-pair purely because it is long.  That is half of it.  The other
 * half, and the half that earns "invert gently, do not vortex", is that
 * the chromosome does not survive lysis intact -- you cannot get 4.6 Mb
 * out of a cell without shearing it -- so its strands are free to come
 * apart altogether.  The plasmid is small enough to come out whole, and
 * a covalently closed circle's two strands are threaded through each
 * other: the alkali can unpair them but it cannot separate them.  That
 * is why one zips straight back and the other cannot.
 *
 * Drawing kit and the build-once-then-fade rule: seq/parts.js.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;

const CELL = {x:150, y:292, w:640, h:412, r:56};
const TUBE = {x:980, y:262, w:250, h:442};
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

/* A plasmid: a covalently closed circle, so a duplex ring. */
function ringPts(cx, cy, r, n){
  const pts = [];
  for (let i = 0; i <= (n || 40); i++){
    const a = 2*Math.PI*i/(n || 40);
    pts.push([cx + r*Math.cos(a), cy + r*Math.sin(a)]);
  }
  return pts;
}
const PLAS = [[268,372,30],[452,372,30],[636,372,30],
              [360,502,30],[544,502,30],[268,632,30],[636,632,30]];
/* and where they are once there is no cell to be in */
const PLASW = [[256,406,30],[598,392,30],[930,430,30],[1256,350,30],
               [246,570,30],[556,608,30],[906,586,30],[1250,486,30],
               [420,706,30],[1120,716,30]];

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

/* The pieces the chromosome comes out in.  Scattered and at angles with
   their ends inside the frame, because five full-width wavy lines read
   as five molecules lying in parallel rather than as one molecule that
   broke: what says "broken" is the free ends, so they have to be where
   they can be seen. */
function piece(cx, cy, len, ang, bow){
  const c = Math.cos(ang), sn = Math.sin(ang), pts = [];
  for (let k = 0; k <= 4; k++){
    const t = (k/4 - 0.5)*len, b = bow*Math.sin(Math.PI*k/4);
    pts.push([cx + c*t - sn*b, cy + sn*t + c*b]);
  }
  return pts;
}
/* Once the cell has burst its contents are in a tube, not in a cell, so
   from here to the tangle they use the whole slide.  The collapse back
   to a clump at the neutralisation beat then reads as the aggregation
   it is, rather than as the drawing happening to move. */
const FRAG = [piece(400, 352, 262, -0.16,  24), piece( 762, 340, 224,  0.24, -20),
              piece(1094, 370, 244,  0.18,  22), piece(330, 500, 232,  0.30, -22),
              piece(702, 512, 262, -0.26,  26), piece(1062, 522, 226, -0.20, -20),
              piece(432, 648, 244,  0.12,  22), piece( 800, 662, 214, -0.34, -18),
              piece(1132, 640, 234,  0.26,  20)];

/* The same piece, as the two strands it comes apart into: rotated a
   little in opposite directions about its own centre as well as pushed
   apart, so they splay rather than staying parallel.  Two parallel
   curves is a duplex however far apart you put them. */
function apart(pts, k){
  let cx = 0, cy = 0;
  pts.forEach(p => { cx += p[0]/pts.length; cy += p[1]/pts.length; });
  const c = Math.cos(k), sn = Math.sin(k);
  return pts.map(function(p){
    const x = p[0] - cx, y = p[1] - cy;
    return [cx + x*c - y*sn, cy + x*sn + y*c + (k > 0 ? 17 : -17)];
  });
}

const FR = [
  { on:["cell","chrom","plas"],
    cap:"one cell: a <b>4.6 Mb</b> chromosome and dozens of copies of a <b>3 kb</b> plasmid",
    call:"both are covalently closed circles &#183; the only difference that matters is length",
    note:"Start with what is in the cell. One chromosome, four and a half million base pairs of it, folded into a space a couple of microns across, and some tens of copies of your plasmid at three thousand. Both are double-stranded, and both are covalently closed circles, which is why they are drawn with two lines each. That difference in length is the only thing this method uses, and it is going to use it twice.",
    desc:"A cell drawn as a rounded box. Inside it, the chromosome as a long double-stranded molecule folded back and forth across the whole box, and seven small double-stranded rings standing for copies of the plasmid." },

  { on:["frag","plasW","p2a"],
    cap:"<b>P2</b> bursts the cell, and the chromosome does not survive the trip",
    call:"you cannot get 4.6 Mb out of a cell in one piece &#183; the plasmid is small enough to come out whole",
    note:"P2 is sodium hydroxide and SDS, and the SDS does the lysis. Watch what that costs the chromosome: four and a half megabases of DNA is long and fragile and it shears on the way out, so what you actually have in the tube is pieces with free ends. Your plasmid, at three kilobases, is short enough to survive intact. This is the step the protocol means by invert gently and do not vortex, and what being rough costs you is purity rather than yield: the harder you shear it the shorter the pieces get, and short pieces re-pair well enough to stay in solution and come through into your prep.",
    desc:"The cell has burst. The chromosome is now several separate double-stranded pieces with free ends, while the plasmid rings are still whole." },

  { on:["single","plasX","p2b"],
    cap:"and the alkali pulls every base pair apart",
    call:"a fragment has free ends, so its strands drift apart &#183; a closed circle&rsquo;s cannot",
    note:"Now the sodium hydroxide. It denatures everything it can reach, plasmid and chromosome alike, and every base pair in the tube lets go. But unpairing is not the same as separating. A sheared fragment has free ends, so its two strands simply come apart and drift. A covalently closed circle does not: its two strands are wound round each other and neither has an end to thread out through, so they stay threaded no matter how thoroughly the base pairing is broken. That is the whole of the trick, and it is why you do not leave this step running longer than the protocol says.",
    desc:"Each chromosome fragment has come apart into two separate single strands, drawn as single lines. Each plasmid is now drawn as two rings offset from each other and crossing, unpaired but still threaded together." },

  { on:["tangle","plas","n3"],
    cap:"<b>N3</b> drops the pH back, and only one of them can re-pair",
    call:"the plasmid&rsquo;s partner never left &#183; the fragments grab whatever is nearest",
    note:"N3 brings the pH back down and everything tries to re-pair at once. The plasmid manages it immediately, because its partner strand was never anywhere else. The fragments cannot: a strand that has drifted has to find its own partner among millions of near-misses, and what it finds instead is a neighbour, and a bit of another one after that. The result is a tangled aggregate that traps the protein and the SDS along with it. That difference, one molecule re-pairing and the other knotting, is the entire method.",
    desc:"The plasmid rings have gone back to being clean double-stranded circles. The chromosome fragments have collapsed into a dense tangle of strands crossing each other." },

  { on:["tangle","plas","tube","n3"],
    cap:"spin, and the tangle goes to the bottom",
    call:"the plasmid stays in solution, and the supernatant is what you put on the column",
    note:"Five minutes in the centrifuge and the tangle pellets, taking the protein and the SDS down with it. What is left floating is your plasmid, still double-stranded, still covalently closed, and that supernatant is what goes on the column.",
    desc:"A tube beside the cell, with a dense pellet at its bottom and clear liquid above it carrying the small double-stranded rings." }
];

window.Deck.sequence("lysis", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const s = G.scene(slide, 786, 830);

  s.part("cell", G.el("rect", {x:CELL.x, y:CELL.y, width:CELL.w, height:CELL.h,
    rx:CELL.r, fill:"none", stroke:C.ink, "stroke-width":3}));

  s.part("chrom", duplex(serpPts(200, 336, 540, 336, 9), 5, C.ink));

  s.part("frag", (function(){
    const g = G.el("g", {});
    FRAG.forEach(f => g.appendChild(duplex(f, 5, C.ink)));
    return g;
  })());

  /* denatured: each fragment as its two strands, pulled apart.  They are
     drawn from the same points as the fragment they came from, so the
     eye can follow which came from where. */
  s.part("single", (function(){
    const g = G.el("g", {});
    FRAG.forEach(function(f, i){
      g.appendChild(strand(apart(f, -0.13 - (i%2)*0.04), 0, C.ink));
      g.appendChild(strand(apart(f,  0.13 + (i%2)*0.04), 0, C.muted));
    });
    return g;
  })());

  s.part("tangle", (function(){
    const g = G.el("g", {});
    [[11, C.ink], [83, C.muted], [157, C.ink], [229, C.muted], [313, C.ink]]
      .forEach(function(t, i){
        g.appendChild(strand(walk(468, 500, 208, 148, 46, t[0], 46), 0, t[1]));
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
        g.appendChild(strand(ringPts(p[0] - off, p[1] - off, p[2]), 0, C.blue));
        g.appendChild(strand(ringPts(p[0] + off, p[1] + off, p[2]), 0, C.muted));
      } else {
        g.appendChild(duplex(ringPts(p[0], p[1], p[2]), 4.5, C.blue));
      }
    });
    return g;
  }
  s.part("plas",  plasmids(PLAS,  0));
  s.part("plasW", plasmids(PLASW, 0));
  s.part("plasX", plasmids(PLASW, 13));

  s.part("p2a", G.text(760, 258, "P2 · SDS bursts the cell", 27, C.verm, 700));
  s.part("p2b", G.text(760, 258, "P2 · NaOH denatures it all", 27, C.verm, 700));
  s.part("n3",  G.text(470, 258, "N3 · back to neutral", 27, C.verm, 700));

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
    g.appendChild(G.text(TUBE.x+TUBE.w+22, TUBE.y+112, "plasmid", 23, C.blue, 700, "start"));
    [[1048,352,20],[1136,398,20],[1072,456,20],[1162,326,20]]
      .forEach(c => g.appendChild(duplex(ringPts(c[0], c[1], c[2]), 4.5, C.blue)));
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
