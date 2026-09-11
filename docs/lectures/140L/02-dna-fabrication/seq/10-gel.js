/* ------------------------------------------------------------------ *
 * 10-gel.js : the two dye structures on slide 76.
 *
 * Registers:  dyes   source slide 76, SYBR Green and ethidium bromide
 *
 * WHY THESE ARE REDRAWN.  The source slide carries four pictures.  Two
 * are photographs of hardware that is actually on the bench -- the Safe
 * Imager and the gel rig -- and those stay rasters, on the same call 09
 * and 11 made: the point of a photograph of equipment is recognising the
 * thing, which no redrawing can do.  The other two are chemical line
 * drawings, and a small molecule is the case this deck rebuilds
 * natively every time (11 did it for guanidinium).
 *
 * THE WHITE-LINE-ART CHECK, run before the decision.  Both PNGs are
 * pure #000000 on transparent -- every non-transparent pixel in both
 * files is black -- so neither would have vanished on the paper ground,
 * and neither carries a baked white halo.  They were safe to keep.  They
 * are rebuilt anyway because they are line art at 300px on a 1600px
 * slide, where vector stays sharp and a 1369px raster downsampled by
 * four does not, and because rebuilt they can be measured rather than
 * eyeballed.
 *
 * FIDELITY.  Both source drawings sit on a clean 60-degree lattice with
 * one bond length throughout, so they can be reconstructed exactly
 * rather than traced.  Every ring centre, chain vertex and Kekule
 * assignment below was read off the source PNG at 1:1, converted to a
 * bond length of 100, and checked back against it -- the reconstructed
 * points land within about two units of the measured ones, which at this
 * scale is under a line width.  The Kekule structures are the source's,
 * not a tidied version: SYBR Green is drawn in the neutral 4-ylidene
 * form with the formal charge on the benzothiazolium nitrogen, which is
 * how the source draws it and how the compound is normally written.
 *
 * COLOUR.  None.  Everything is ink.  These are two structures being
 * compared, and nothing in either one is being followed, warned about or
 * singled out, so no rung of the palette is spent here -- the one
 * warning on the slide is the word "carcinogen", and that is set in the
 * caption, in markup, not here.
 *
 * The 1600x900 authoring box has a content area of x 110-1490, y 86-830.
 * These two drawings do not use it directly: each is a viewBox scaled to
 * fit its cell of the slide's grid, so the numbers below are in bond
 * lengths, not slide pixels.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111";
const BL  = 100;             /* one bond, the unit everything is in     */
const LW  = 8;               /* bond stroke                             */
const OFF = 21;              /* inner line of a double bond, offset     */
const CUT = 26;              /* and shortened by this at each end       */
const FS  = 70;              /* atom label                              */
const GAP = 42;              /* bond stops this far short of a label    */

const D2R = Math.PI / 180;
const n2 = v => Math.round(v * 10) / 10;

/* ---- lattice ------------------------------------------------------ *
 * A ring is six points on a circle of radius BL.  rot 0 puts vertices
 * at left and right and lays the top and bottom edges flat; rot 30
 * stands the ring on a point.  Two rings fused on an edge have centres
 * BL*sqrt(3) apart, along the perpendicular through that edge's middle,
 * which is how every fused centre below was derived.
 * ------------------------------------------------------------------ */
function ring(cx, cy, rot){
  const p = [];
  for (let k = 0; k < 6; k++){
    const a = (rot + 60 * k) * D2R;
    p.push([cx + BL * Math.cos(a), cy + BL * Math.sin(a)]);
  }
  return p;
}
function at(cx, cy, deg, r){
  return [cx + (r == null ? BL : r) * Math.cos(deg * D2R),
          cy + (r == null ? BL : r) * Math.sin(deg * D2R)];
}

/* ---- drawing ------------------------------------------------------ */

function unit(p, q){
  const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
  return [dx / L, dy / L, L];
}
function trim(p, q, gp, gq){
  const u = unit(p, q);
  return [[p[0] + u[0]*gp, p[1] + u[1]*gp],
          [q[0] - u[0]*gq, q[1] - u[1]*gq]];
}
function d(p, q){
  return "M" + n2(p[0]) + " " + n2(p[1]) + "L" + n2(q[0]) + " " + n2(q[1]);
}

/* A bond.  g is [gapAtP, gapAtQ], the clearance left for an atom label
   at either end; toward is the point the second line of a double bond
   leans towards, which for a ring bond is the ring's own centre. */
function bond(p, q, g, toward){
  const gp = g ? g[0] : 0, gq = g ? g[1] : 0;
  const e = trim(p, q, gp, gq);
  let path = d(e[0], e[1]);
  if (toward){
    const u = unit(p, q);
    let nx = -u[1], ny = u[0];
    const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
    if ((toward[0] - mx) * nx + (toward[1] - my) * ny < 0){ nx = -nx; ny = -ny; }
    const i = trim(e[0], e[1], CUT, CUT);
    path += d([i[0][0] + nx*OFF, i[0][1] + ny*OFF],
              [i[1][0] + nx*OFF, i[1][1] + ny*OFF]);
  }
  return '<path d="' + path + '" fill="none" stroke="' + INK +
         '" stroke-width="' + LW + '" stroke-linecap="round"/>';
}

/* An atom label.  sub is a trailing subscript, chg a raised charge, and
   anchor decides which end of the string the bond arrives at -- "end"
   for H2N, where the nitrogen is the last glyph. */
function atom(p, str, opts){
  const o = opts || {};
  let inner = str;
  if (o.sub) inner += '<tspan font-size="' + Math.round(FS*0.72) +
                      '" dy="' + Math.round(FS*0.20) + '">' + o.sub + '</tspan>';
  if (o.chg) inner += '<tspan font-size="' + Math.round(FS*0.66) +
                      '" dy="' + (-Math.round(FS*0.42)) + '">' + o.chg + '</tspan>';
  return '<text x="' + n2(p[0] + (o.dx || 0)) + '" y="' + n2(p[1] + (o.dy || 0)) +
    '" font-size="' + FS + '" fill="' + INK +
    '" text-anchor="' + (o.anchor || "middle") +
    '" dominant-baseline="central">' + inner + '</text>';
}

function svg(box, body){
  return '<svg viewBox="' + box + '" width="100%" height="100%" ' +
    'preserveAspectRatio="xMidYMid meet" focusable="false" ' +
    'font-family="Helvetica Neue, Arial, Helvetica, sans-serif">' + body + '</svg>';
}

/* ------------------------------------------------------------------ *
 * ETHIDIUM BROMIDE
 * 3,8-diamino-5-ethyl-6-phenylphenanthridinium bromide.
 *
 * Origin is the centre of the middle ring of the phenanthridinium.  The
 * two outer rings hang off its two lower slanted edges, which is the
 * angular fusion that makes it a phenanthridine and not an acridine, and
 * the bond across the bottom of the middle ring is the biaryl bond
 * joining them.
 *
 * Kekule, read off the source: the middle ring carries N5=C6 across the
 * top and BOTH fusion bonds double, so it is the fully drawn ring and
 * each outer ring gets the remaining two.  The inner line of a fusion
 * bond is drawn inside the outer ring, as the source draws it.
 * ------------------------------------------------------------------ */
function ethidium(){
  const M  = ring(0, 0, 0);                    /* middle: M4=N5, M5=C6  */
  const Mc = [0, 0];
  const A  = ring(-1.5*BL,  Math.sqrt(3)/2*BL, 0);   /* left,  3-amino  */
  const Ac = [-1.5*BL, Math.sqrt(3)/2*BL];
  const B  = ring( 1.5*BL,  Math.sqrt(3)/2*BL, 0);   /* right, 8-amino  */
  const Bc = [ 1.5*BL, Math.sqrt(3)/2*BL];

  const N5 = M[4], C6 = M[5];
  const P  = ring(1.5*BL, -1.5*Math.sqrt(3)/2*BL - Math.sqrt(3)/2*BL + Math.sqrt(3)/2*BL, 0);
  /* the phenyl: ipso is its lower-left vertex, one bond up-right of C6 */
  const ipso = at(C6[0], C6[1], 300);
  const Pc = [ipso[0] + BL/2, ipso[1] - Math.sqrt(3)/2*BL];
  const Ph = ring(Pc[0], Pc[1], 0);

  const E1 = at(N5[0], N5[1], 240);            /* N-ethyl               */
  const E2 = at(E1[0], E1[1], 180);
  const NL = at(A[3][0], A[3][1], 180);        /* where H2N sits        */
  const NR = at(B[0][0], B[0][1], 0);          /* where NH2 sits        */

  let s = "";
  /* middle ring */
  s += bond(M[4], M[5], [GAP, 0], Mc);         /* N5 = C6               */
  s += bond(M[5], M[0], null, null);
  s += bond(M[0], M[1], null, Bc);             /* fusion, inner in B    */
  s += bond(M[1], M[2], null, null);           /* the biaryl bond       */
  s += bond(M[2], M[3], null, Ac);             /* fusion, inner in A    */
  s += bond(M[3], M[4], [0, GAP], null);
  /* left ring */
  s += bond(A[0], A[1], null, null);
  s += bond(A[1], A[2], null, Ac);
  s += bond(A[2], A[3], null, null);
  s += bond(A[3], A[4], null, Ac);
  s += bond(A[4], A[5], null, null);
  /* right ring */
  s += bond(B[4], B[5], null, null);
  s += bond(B[5], B[0], null, Bc);
  s += bond(B[0], B[1], null, null);
  s += bond(B[1], B[2], null, Bc);
  s += bond(B[2], B[3], null, null);
  /* phenyl */
  s += bond(C6, ipso, null, null);
  s += bond(Ph[0], Ph[1], null, null);
  s += bond(Ph[1], Ph[2], null, Pc);
  s += bond(Ph[2], Ph[3], null, null);
  s += bond(Ph[3], Ph[4], null, Pc);
  s += bond(Ph[4], Ph[5], null, null);
  s += bond(Ph[5], Ph[0], null, Pc);
  /* ethyl and the two anilines */
  s += bond(N5, E1, [GAP, 0], null);
  s += bond(E1, E2, null, null);
  s += bond(A[3], NL, [0, GAP], null);
  s += bond(B[0], NR, [0, GAP], null);

  s += atom(N5, "N", { chg: "+" });
  s += atom(NL, "H", { sub: "2", anchor: "end", dx: 6 });
  /* H2N: written right to left so the nitrogen meets the bond, which is
     one string with the subscript in the middle rather than two texts */
  s = s.replace(/<text([^>]*text-anchor="end"[^>]*)>H<tspan font-size="(\d+)" dy="(\d+)">2<\/tspan><\/text>/,
                '<text$1>H<tspan font-size="$2" dy="$3">2</tspan>' +
                '<tspan font-size="' + FS + '" dy="' + (-Math.round(FS*0.20)) + '">N</tspan></text>');
  s += atom(NR, "N", { sub: "H", anchor: "start", dx: -6 });
  s = s.replace(/<text([^>]*text-anchor="start"[^>]*)>N<tspan font-size="(\d+)" dy="(\d+)">H<\/tspan><\/text>/,
                '<text$1>NH<tspan font-size="$2" dy="$3">2</tspan></text>');
  s += atom([-278, -108], "Br", { chg: "−" });

  return svg("-475 -375 950 575", s);
}

/* ------------------------------------------------------------------ *
 * SYBR GREEN I
 * The asymmetric cyanine: a 3-methylbenzothiazol-2-ylidene joined by a
 * single methine to the 4 position of a 1-phenyl-1,4-dihydroquinoline
 * that carries an N-propyl-N'-dimethylaminopropyl amine at C2.
 *
 * Origin is the centre of the quinoline's pyridine ring.  The benzo ring
 * fuses on its lower-right edge; the N-phenyl goes up from N1; the
 * methine leaves C4 down-left; the amine leaves C2 up-left and the two
 * chains run off it.
 *
 * Kekule, read off the source: C2=C3 and the C4a=C8a fusion bond in the
 * pyridine ring, C4=CH exocyclic, the benzothiazolium's N3=C2 in the
 * five-ring, and the three alternating pairs in each benzene.  N1 of the
 * quinoline is a neutral three-bonded enamine nitrogen and the charge
 * sits on the benzothiazolium N -- one drawn resonance form of a dye
 * that is a cation overall, and the form the source draws.
 * ------------------------------------------------------------------ */
function sybr(){
  const Q  = ring(0, 0, 0);           /* Q0 C8a Q1 C4a Q2 C4 Q3 C3 Q4 C2 Q5 N1 */
  const Qc = [0, 0];
  const Zc = [1.5*BL, Math.sqrt(3)/2*BL];
  const Z  = ring(Zc[0], Zc[1], 0);   /* the benzo ring                */

  const N1 = Q[5];
  const ipso = at(N1[0], N1[1], 300);
  const Yc = [ipso[0] + BL/2, ipso[1] - Math.sqrt(3)/2*BL];
  const Y  = ring(Yc[0], Yc[1], 0);   /* the N-phenyl                  */

  const C4 = Q[2];
  const CH = at(C4[0], C4[1], 120);   /* the methine bridge            */

  /* The benzothiazole.  Its benzene stands on a point (rot 30) and the
     five-ring is a regular pentagon fused on the benzene's right edge:
     side BL, so circumradius BL/(2 sin36) and apothem BL/(2 tan36), and
     the centre sits one apothem out from that edge. */
  const Wc = [-442.5, 177];
  const W  = ring(Wc[0], Wc[1], 30);  /* W5 = C3a, W0 = C7a            */
  const R5 = BL / (2 * Math.sin(36*D2R));
  const Tc = [Wc[0] + BL*Math.sqrt(3)/2 + BL/(2*Math.tan(36*D2R)), Wc[1]];
  const N3   = at(Tc[0], Tc[1], 288, R5);
  const C2bt = at(Tc[0], Tc[1],   0, R5);
  const S1   = at(Tc[0], Tc[1],  72, R5);
  const NMe  = at(N3[0], N3[1], 288);

  const An  = at(Q[4][0], Q[4][1], 240);       /* the C2 amine          */
  const Pr1 = at(An[0], An[1], 300);
  const Pr2 = at(Pr1[0], Pr1[1], 240);
  const Pr3 = at(Pr2[0], Pr2[1], 300);
  const Ca  = at(An[0], An[1], 180);
  const Cb  = at(Ca[0], Ca[1], 240);
  const Cc  = at(Cb[0], Cb[1], 180);
  const Nd  = at(Cc[0], Cc[1], 240);
  const Me1 = at(Nd[0], Nd[1], 300);
  const Me2 = at(Nd[0], Nd[1], 180);

  let s = "";
  /* pyridine ring of the quinoline */
  s += bond(Q[0], Q[1], null, Qc);             /* C8a = C4a, fusion     */
  s += bond(Q[1], Q[2], null, null);
  s += bond(Q[2], Q[3], null, null);
  s += bond(Q[3], Q[4], null, Qc);             /* C3 = C2               */
  s += bond(Q[4], Q[5], [0, GAP], null);
  s += bond(Q[5], Q[0], [GAP, 0], null);
  /* benzo ring */
  s += bond(Z[4], Z[5], null, null);
  s += bond(Z[5], Z[0], null, Zc);
  s += bond(Z[0], Z[1], null, null);
  s += bond(Z[1], Z[2], null, Zc);
  s += bond(Z[2], Z[3], null, null);
  /* N-phenyl */
  s += bond(N1, ipso, [GAP, 0], null);
  s += bond(Y[0], Y[1], null, null);
  s += bond(Y[1], Y[2], null, Yc);
  s += bond(Y[2], Y[3], null, null);
  s += bond(Y[3], Y[4], null, Yc);
  s += bond(Y[4], Y[5], null, null);
  s += bond(Y[5], Y[0], null, Yc);
  /* the bridge.  The second line leans up-left, the open side */
  s += bond(CH, C4, null, [CH[0] - 86.6, CH[1] - 50]);
  s += bond(C2bt, CH, null, null);
  /* benzothiazole: benzene then the five-ring */
  s += bond(W[0], W[1], null, Wc);
  s += bond(W[1], W[2], null, null);
  s += bond(W[2], W[3], null, Wc);
  s += bond(W[3], W[4], null, null);
  s += bond(W[4], W[5], null, Wc);
  s += bond(W[5], W[0], null, null);           /* the fusion bond       */
  s += bond(W[5], N3, [0, GAP], null);         /* C3a - N3              */
  s += bond(N3, C2bt, [GAP, 0], Tc);           /* N3 = C2               */
  s += bond(C2bt, S1, [0, GAP], null);
  s += bond(S1, W[0], [GAP, 0], null);
  s += bond(N3, NMe, [GAP, 0], null);
  /* the amine and its two chains */
  s += bond(Q[4], An, [0, GAP], null);
  s += bond(An, Pr1, [GAP, 0], null);
  s += bond(Pr1, Pr2, null, null);
  s += bond(Pr2, Pr3, null, null);
  s += bond(An, Ca, [GAP, 0], null);
  s += bond(Ca, Cb, null, null);
  s += bond(Cb, Cc, null, null);
  s += bond(Cc, Nd, [0, GAP], null);
  s += bond(Nd, Me1, [GAP, 0], null);
  s += bond(Nd, Me2, [GAP, 0], null);

  s += atom(N1, "N");
  s += atom(N3, "N", { chg: "+" });
  s += atom(S1, "S");
  s += atom(An, "N");
  s += atom(Nd, "N");

  return svg("-545 -455 815 765", s);
}

/* ------------------------------------------------------------------ *
 * One step.  The slide is a comparison and the source note runs across
 * both dyes and the lamp in the same breath -- "SYBR Safe ... which
 * involves a blue lamp" is the first sentence -- so there is nothing
 * here to build in beats without the words getting ahead of the
 * pictures.  Everything is on screen at once, which is also what the
 * source shows.  Note and description come from the slide's templates.
 * ------------------------------------------------------------------ */
window.Deck.sequence("dyes", function(slide){
  const a = slide.querySelector('[data-mol="sybr"]');
  const b = slide.querySelector('[data-mol="etbr"]');
  if (a) a.innerHTML = sybr();
  if (b) b.innerHTML = ethidium();
  return { steps: [{}], go: function(){} };
});

})();
