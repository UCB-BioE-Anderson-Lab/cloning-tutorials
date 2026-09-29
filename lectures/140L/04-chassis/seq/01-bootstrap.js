/* ------------------------------------------------------------------ *
 * 01-bootstrap.js — there is no from-scratch route to a cell.
 *
 * The source slide was one sentence set large — "no living system has
 * ever been generated without descent from a preexisting one" — with
 * the entire argument sitting in the speaker note: JCVI-syn1.0, the
 * minimal genomes, the protocells, and what each of them actually
 * inherited.  That is a paragraph to memorise and nothing to point at.
 *
 * Drawn instead, because the claim is a comparison and comparisons are
 * pictures.  The slide before this one shows a lunar rover and says you
 * could build a vehicle with no chassis at all.  So put that route and
 * the biological one side by side and let the cross do the talking:
 * parts to rover is a road somebody has driven, parts to cell is not,
 * and the only arrow into a cell starts at another cell.  The chassis
 * idea is therefore not a matter of good engineering taste here.  It is
 * the only thing on offer.
 *
 * The three cases people raise are the last beat, each drawn as the
 * PROCESS it is rather than as a cell with a coloured region.  An
 * outcome shaded two colours cannot say what was done to get there,
 * and it pushes the argument into a key.  Drawn as arrows it needs no
 * key, because the tell is where each chain starts: syn1.0 and the
 * minimal genomes both start at a cell that was already alive, and the
 * protocells start at a heap of parts and never reach a living thing.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;
const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);

function grp(o){ return G.el("g", {opacity:n1(cl(o == null ? 1 : o, 0, 1))}); }
function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 2.6,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return G.el("path", a);
}
function arrow(x0, x1, y, col, w){
  const g = G.el("g", {});
  g.appendChild(path("M"+n1(x0)+" "+n1(y)+"H"+n1(x1 - 10), col, w || 3));
  g.appendChild(path("M"+n1(x1 - 18)+" "+n1(y - 8)+"L"+n1(x1)+" "+n1(y)+
    "L"+n1(x1 - 18)+" "+n1(y + 8), col, w || 3));
  return g;
}

/* ---- a heap of raw material, which is what "from scratch" means --- */
const BITS = [[-52,-26,7],[-18,-38,5],[20,-30,8],[52,-14,5],[-58,6,5],
              [-24,-4,9],[14,2,6],[48,14,8],[-44,30,7],[-8,32,5],[28,34,6]];
function parts(cx, cy, col){
  const g = G.el("g", {});
  BITS.forEach(function(b, i){
    if (i % 3 === 0)
      g.appendChild(G.el("rect", {x:n1(cx + b[0] - b[2]), y:n1(cy + b[1] - b[2]),
        width:n1(b[2]*2), height:n1(b[2]*2), rx:2, fill:col, "fill-opacity":".2",
        stroke:col, "stroke-width":2}));
    else
      g.appendChild(G.el("circle", {cx:n1(cx + b[0]), cy:n1(cy + b[1]), r:b[2],
        fill:col, "fill-opacity":".2", stroke:col, "stroke-width":2}));
  });
  return g;
}

/* ---- a cell: membrane, a genome, and the machinery that reads it --- *
 * o.genome and o.machinery are colours, so one cell can be drawn with a
 * synthetic genome inside inherited machinery, which is exactly the
 * JCVI-syn1.0 picture and the whole point of the last beat.
 * ------------------------------------------------------------------ */
const DOTS = [[-30,-16],[-34,14],[-6,26],[24,18],[30,-14],[4,-30],[-14,-2],[16,2]];
function cellIcon(cx, cy, o){
  const g = G.el("g", {}), m = o.machinery || C.muted, gn = o.genome || m;
  const rx = o.rx || 62, ry = o.ry || 48, k = o.k || 1;
  g.appendChild(G.el("ellipse", {cx:n1(cx), cy:n1(cy), rx:n1(rx), ry:n1(ry),
    fill:m, "fill-opacity":".08", stroke:m, "stroke-width":o.w || 3}));
  DOTS.slice(0, o.n || DOTS.length).forEach(function(d){
    g.appendChild(G.el("circle", {cx:n1(cx + d[0]*k), cy:n1(cy + d[1]*k),
      r:4.2, fill:m}));
  });
  if (!o.nogenome)
    g.appendChild(G.el("circle", {cx:n1(cx), cy:n1(cy), r:n1(rx*(o.gr || 0.34)),
      fill:"none", stroke:gn, "stroke-width":o.w || 3}));
  return g;
}
function cross(cx, cy, col, r){
  const g = G.el("g", {}), k = r || 30;
  g.appendChild(path("M"+n1(cx-k)+" "+n1(cy-k)+"L"+n1(cx+k)+" "+n1(cy+k), col, 8));
  g.appendChild(path("M"+n1(cx+k)+" "+n1(cy-k)+"L"+n1(cx-k)+" "+n1(cy+k), col, 8));
  return g;
}
function tick(cx, cy, col){
  return path("M"+n1(cx-16)+" "+n1(cy)+"L"+n1(cx-4)+" "+n1(cy+13)+
              "L"+n1(cx+18)+" "+n1(cy-15), col, 7);
}

const RA = 292, RB = 470, RC = 664;        /* the three rows            */
const LBL = 272, P0 = 400, A0 = 480, A1 = 616;

/* ---- and the three things somebody always brings up ---------------- *
 * Drawn as processes, because that is what they are and because the
 * argument is visible in where each arrow STARTS.  syn1.0 begins at a
 * living cell and empties it; the minimal genomes begin at a living
 * cell and cut it down; only the protocells begin at a heap of parts,
 * and what they reach is not alive.  Three static cells with a coloured
 * region could not say any of that.
 * ------------------------------------------------------------------ */
const CR = [306, 492, 678];
const CLB = 300, CX0 = 352;

const FR = [
{ s:{eng:1},
  cap:"a rover, you can build out of parts",
  call:"the slide before this one &#183; no chassis, and it still drove",
  note:"Start where the last slide left off. A lunar rover is a vehicle somebody assembled out of raw components for one job, with no standardised chassis underneath it. It is more work and none of it carries over, but it is a real route and people have driven down it. Engineering has a from-scratch option.",
  desc:"The engineering route: a heap of parts, an arrow, and a lunar rover. It works." },

{ s:{eng:1, bio:1},
  cap:"a cell, <b>nobody ever has</b>",
  call:"not once &#183; there is no from-scratch route to a living cell",
  note:"Now draw the same arrow for a cell, and it does not exist. Nobody has ever assembled a living cell out of non-living components. Not as a hard problem that is nearly solved, but as a thing that has not been done at all. Which means the chassis idea is not imported into biology as good engineering practice, the way it is in a car factory where you could in principle start from nothing. In biology it is the only route there is.",
  desc:"The same arrow drawn for a cell, struck through: nobody has assembled a living cell from non-living components." },

{ s:{eng:1, bio:1, chain:1},
  cap:"what actually happens is <b>descent</b>",
  call:"every cell you have ever pipetted came out of another cell",
  note:"What happens instead is this. Every cell came out of a cell, and that one came out of another, and the chain runs back without a break to something none of us were there for. Your strain is on the right-hand end of it. That is why the last section was a pedigree rather than a parts list: when you pick a chassis you are joining a lineage, and everything that lineage already contains arrives with it whether you asked for it or not.",
  desc:"The only route that exists: a chain of cells, each giving rise to the next, ending in your strain." },

{ s:{cases:1},
  cap:"and the three cases people raise",
  call:"look at where each arrow <b>starts</b>",
  note:"Three things get filed under synthetic life and it is worth being able to say what each one actually is. JCVI-syn1.0 put a chemically synthesised genome into a bacterial cell that had had its own removed, and that cell booted up on the recipient's ribosomes, proteins, RNAs and membrane. The genome was synthetic; the machinery that read it was inherited. Minimal genome organisms are heavily engineered, but they were cut down from a natural cell rather than built up from components, so the descent is unbroken. Protocells, liposomes with RNA or partial expression systems inside them, genuinely are assembled from parts, and they can imitate particular life-like behaviours, but they do not grow, sustain themselves or evolve. Look at the colour on all three: the red is what somebody made, the grey is what came from a cell that was already running, and in every case the grey is still there. Even where the genome is synthetic, the system that reads it came from a previous cell. Life is a bootstrapped process.",
  desc:"The three claimed cases, each drawn as a process. JCVI-syn1.0: a living cell, its genome taken out, a synthetic one put in. Minimal genomes: a living cell whose genome is cut down. Protocells: a heap of components assembled into a vesicle, marked with a cross because it does not grow, sustain itself or evolve. Two of the three arrows start at a cell; the one that starts at parts does not reach a living thing." }
];

window.Deck.sequence("bootstrap", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    /* ---- the route engineering has ------------------------------- */
    if (v.eng > 0.02){
      const e = grp(v.eng);
      e.appendChild(G.text(LBL, RA + 8, "engineering", 23, C.muted, 700, "end"));
      e.appendChild(parts(P0, RA, C.muted));
      e.appendChild(arrow(A0, A1, RA, C.muted));
      e.appendChild(G.el("image", {href:"img/01-car-no-chassis.png", x:640,
        y:n1(RA - 66), width:232, height:132,
        preserveAspectRatio:"xMidYMid meet"}));
      e.appendChild(tick(936, RA, C.blue));
      e.appendChild(G.text(978, RA + 9, "somebody has done this", 22,
        C.muted, 400, "start"));
      g.appendChild(e);
    }

    /* ---- and the one it does not --------------------------------- */
    if (v.bio > 0.02){
      const b = grp(v.bio);
      b.appendChild(G.text(LBL, RB + 8, "biology", 23, C.muted, 700, "end"));
      b.appendChild(parts(P0, RB, C.muted));
      b.appendChild(arrow(A0, A1, RB, C.muted));
      b.appendChild(cellIcon(722, RB, {machinery:C.muted}));
      b.appendChild(cross(548, RB, C.verm, 34));
      b.appendChild(G.text(852, RB + 9, "nobody, not once", 24, C.verm, 700,
        "start"));
      g.appendChild(b);
    }

    /* ---- the only arrow into a cell starts at a cell -------------- */
    if (v.chain > 0.02){
      const c = grp(v.chain);
      c.appendChild(G.text(LBL, RC + 8, "what happens", 23, C.muted, 700, "end"));
      c.appendChild(G.text(318, RC + 8, "…", 34, C.muted, 400, "middle"));
      [420, 640, 860, 1080].forEach(function(x, i){
        const last = i === 3;
        c.appendChild(cellIcon(x, RC, {machinery:last ? C.blue : C.muted,
          rx:52, ry:40, k:0.82}));
        if (!last) c.appendChild(arrow(x + 62, x + 158, RC, C.muted, 2.6));
      });
      c.appendChild(G.text(1080, RC + 76, "your strain", 22, C.blue, 700));
      c.appendChild(tick(1196, RC, C.blue));
      g.appendChild(c);
    }

    /* ---- the three that get raised ------------------------------- */
    if (v.cases > 0.02){
      const q = grp(v.cases);
      function lab(x, y, t){ q.appendChild(G.text(x, y, t, 18, C.muted, 400)); }
      function step(x0, x1, y, t){
        q.appendChild(arrow(x0, x1, y, C.muted, 2.6));
        lab((x0 + x1)/2, y - 18, t);
      }
      function name(y, t){
        q.appendChild(G.text(CLB, y + 7, t, 23, C.ink, 700, "end"));
      }
      function note(x, y, t){
        q.appendChild(G.text(x, y + 7, t, 20, C.muted, 400, "start"));
      }

      /* syn1.0: start at a living cell, take its genome out, put a
         made one in.  The arrow starts at a cell. */
      name(CR[0], "JCVI-syn1.0");
      q.appendChild(cellIcon(406, CR[0], {rx:52, ry:40, k:.82}));
      step(468, 648, CR[0], "genome out");
      q.appendChild(cellIcon(710, CR[0], {rx:52, ry:40, k:.82, nogenome:1}));
      step(772, 952, CR[0], "synthetic one in");
      q.appendChild(cellIcon(1014, CR[0], {rx:52, ry:40, k:.82, genome:C.verm}));
      note(CX0, CR[0] + 62, "the genome was made \u00b7 the cell that reads it was not");

      /* minimal genomes: start at a living cell and cut it down */
      name(CR[1], "minimal genomes");
      q.appendChild(cellIcon(406, CR[1], {rx:52, ry:40, k:.82, gr:.44}));
      step(468, 648, CR[1], "cut it down");
      q.appendChild(cellIcon(710, CR[1], {rx:52, ry:40, k:.82, gr:.2,
        genome:C.verm}));
      note(CX0, CR[1] + 62, "engineered down from a living cell, never built up");

      /* protocells: the only one that does start at parts, and the only
         one whose product is not alive */
      name(CR[2], "protocells");
      q.appendChild(parts(406, CR[2], C.verm));
      step(486, 648, CR[2], "assemble");
      q.appendChild(cellIcon(710, CR[2], {rx:52, ry:40, k:.82, n:4,
        machinery:C.verm, nogenome:1}));
      q.appendChild(cross(806, CR[2], C.verm, 17));
      note(CX0, CR[2] + 62, "assembled from parts \u2014 and it does not grow, sustain itself or evolve");
      g.appendChild(q);
    }

    return g;
  }
  return G.run(s, FR, paint);
});
})();
