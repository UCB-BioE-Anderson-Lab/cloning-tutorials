/* ------------------------------------------------------------------ *
 * esterase.js: source 28, the pNB esterase structure, turning.
 *
 * WHY THIS IS DRAWN AND NOT CROPPED.  The source slide carries a
 * photographic render on a near-black ground, and JCA's complaint was
 * exactly that: "it is so dark it is hard to see what's going on."  You
 * cannot brighten a raster of a dark render into a legible figure, and
 * the slide's whole argument is a SPATIAL one -- that the winning
 * mutations sit far from the substrate -- which a still of one viewpoint
 * makes you take on trust.
 *
 * So the coordinates are the real ones.  esterase-data.js is generated
 * from PDB 1QE3 (Spiller, Gershenson, Arnold & Stevens, PNAS 1999;96:
 * 12305-10, PMID 10535917), which is
 * the structure the source figure was made from: every one of the eleven
 * residue numbers the slide labels matches 1QE3's wild-type identity,
 * the labels being the MUTANT identity (V60 at ILE60, G94 at SER94, and
 * so on).  That check is what licenses using it.
 *
 * The distances are measured, not asserted.  Minimum heavy-atom distance
 * from each substitution site to the catalytic Ser189 OG: of the seven
 * the source colours as improved, six are beyond 10 A and the median is
 * 17.4 A.  For scale, His399 of the catalytic triad is 2.8 A away.
 *
 * THE ONE THING THAT IS NOT MEASURED is the substrate.  1QE3 is apo --
 * it has a sulfate 21 A from the active site and nothing else -- so
 * there is no ligand to draw.  The white blob is the CAVITY beside the
 * nucleophile, found by searching for the largest empty sphere within
 * 11 A of Ser189 OG and then filling the run between the two.  It is
 * the space a substrate has to occupy, not a modelled pose, and the alt
 * text says so.
 *
 * The speaker notes are the source's, verbatim, split at sentence
 * boundaries across the four beats.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const INK = "#111111", COIL = "#c2c2c2", STRAND = "#9a9a9a", HELIX = "#7e7e7e";
const AMBER = "#a99011", BLUE = "#004373", VERM = "#ba3a13", MUTED = "#767676";
const CX = 530, CY = 340;
const BOXW = 1020, BOXH = 644;              /* the room the fold gets */
const SPIN = 0.0032;                         /* radians per frame */
const REST = 0.55;                           /* the still orientation */

const S28 = [
  { show:0,
    note:"They then look at the crystal structure of the protein to determine where these mutations lie.",
    desc:"The esterase drawn from its crystal structure as a backbone trace, turning slowly: helices heavy, strands medium, loops fine." },
  { show:1,
    note:"The big white blob in the middle of this protein is the substrate.",
    desc:"A cluster of white spheres appears in a cavity near the centre of the fold, with the catalytic triad marked beside it in red." },
  { show:2,
    note:"The mutations identified in their screens are in yellow.",
    desc:"The substitution sites appear: seven in yellow, the ones the screens picked out as improved, and two in blue marked neutral. Nearly all of them sit out on the surface." },
  { show:3,
    note:"Note that the mutations are quite far from the active site, and this is frequently the case.  When screening for properties such as relaxation in substrate specificity, or improvements to folding, expression, thermal, or chemical stability, the mutations with increased fitness rarely are the ones that directly contact the substrate. Additionally, any mechanistic explanation of why these mutations improve chemical stability would require detailed energetic calculations about the structure.  As of 2014, the computational tools still cannot reliably predict the sorts of mutations that come out of directed evolution studies, and rarely do the mutations make any intuitive sense.",
    desc:"A line is drawn from each improved mutation to the substrate and labelled with its measured distance. Six of the seven lie more than 10 angstroms from the catalytic serine and the median is 17.4; for scale, the catalytic histidine is 2.8 angstroms away." }
];

function el(tag, attrs){
  const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
}

function driver(slide){
  const D = window.ESTERASE, svg = slide.querySelector("svg.prot");
  if (!D || !svg) return { steps:S28, go:function(){} };
  /* Scale to what the molecule ACTUALLY spans, not to the largest single
     coordinate: it turns about y, so its width sweeps out the biggest
     radius in the xz plane while its height never changes.  Scaling by
     max|coord| drew it at two thirds the size it could be. */
  let rxz = 0, ry = 0, span = 0;
  D.trace.concat(D.sites.map(s => s.p)).forEach(function(q){
    rxz = Math.max(rxz, Math.hypot(q[0], q[2]));
    ry  = Math.max(ry, Math.abs(q[1]));
    span = Math.max(span, Math.hypot(q[0], q[2]));
  });
  const K = Math.min(BOXW / (2*rxz + 5), BOXH / (2*ry + 5));

  /* Depth order matters more than anything else here.  Over the blob goes
     the FRONT half of the fold only: on top of everything it looked stuck
     to the outside, underneath everything it vanished. */
  const gBack = el("g", {}), gBlob = el("g", {}), gFront = el("g", {}),
        gSite = el("g", {}), gLead = el("g", {}), gLab = el("g", {});
  [gLead, gBack, gBlob, gFront, gSite, gLab].forEach(g => svg.appendChild(g));

  /* one path per secondary-structure class per depth band, so the back of
     the fold reads as the back without drawing 466 separate segments */
  const bands = {};
  [["C",COIL,2.4],["E",STRAND,4.2],["H",HELIX,5.4]].forEach(function(t){
    bands[t[0]] = [0,1].map(function(b){
      const p = el("path", { fill:"none", stroke:t[1], "stroke-width":t[2],
                             "stroke-linecap":"round", "stroke-linejoin":"round",
                             opacity: b ? 0.95 : 0.3 });
      (b ? gFront : gBack).appendChild(p); return p;
    });
  });

  function rot(p, th){
    const c = Math.cos(th), s = Math.sin(th);
    return [p[0]*c + p[2]*s, p[1], -p[0]*s + p[2]*c];
  }
  const sx = q => CX + q[0]*K, sy = q => CY - q[1]*K;
  const depth = q => Math.max(0, Math.min(1, (q[2] + span) / (2*span)));

  function paint(step, th){
    /* --- the fold ------------------------------------------------- */
    const R = D.trace.map(q => rot(q, th)), n = R.length;
    const d = { C:["",""], E:["",""], H:["",""] };
    let prev = null;
    const at = i => R[Math.max(0, Math.min(n - 1, i))];
    for (let i = 0; i < n - 1; i++){
      const p0 = at(i-1), p1 = R[i], p2 = R[i+1], p3 = at(i+2);
      const t = D.ss[i], b = (p1[2] + p2[2]) > 0 ? 1 : 0, key = t + b;
      if (prev !== key) d[t][b] += "M" + sx(p1).toFixed(1) + " " + sy(p1).toFixed(1);
      /* Catmull-Rom through the alpha carbons, as cubics */
      const c1x = sx(p1) + (sx(p2) - sx(p0)) / 6, c1y = sy(p1) + (sy(p2) - sy(p0)) / 6;
      const c2x = sx(p2) - (sx(p3) - sx(p1)) / 6, c2y = sy(p2) - (sy(p3) - sy(p1)) / 6;
      d[t][b] += "C" + c1x.toFixed(1) + " " + c1y.toFixed(1) + " " +
                       c2x.toFixed(1) + " " + c2y.toFixed(1) + " " +
                       sx(p2).toFixed(1) + " " + sy(p2).toFixed(1);
      prev = key;
    }
    for (const t in bands) bands[t].forEach((p, b) => p.setAttribute("d", d[t][b] || "M0 0"));

    /* --- everything that is drawn on top, painter-sorted ---------- */
    [gBlob, gSite, gLead, gLab].forEach(g => { while (g.firstChild) g.removeChild(g.firstChild); });

    if (step >= 1){
      const bs = D.blob.map(s => ({ q: rot(s, th), r: s[3]*K*0.92 }));
      bs.forEach(b => gBlob.appendChild(el("circle", { cx:sx(b.q), cy:sy(b.q),
        r:b.r, fill:"#ffffff", stroke:INK, "stroke-width":2.2 })));
      bs.forEach(b => gBlob.appendChild(el("circle", { cx:sx(b.q), cy:sy(b.q),
        r:b.r, fill:"#ffffff" })));
      D.triad.forEach(function(a){
        const q = rot(a.p, th), t = depth(q);
        gSite.appendChild(el("circle", { cx:sx(q), cy:sy(q), r:5 + 3*t,
          fill:VERM, stroke:"#ffffff", "stroke-width":1.6, opacity:0.5 + 0.5*t }));
      });
    }

    if (step >= 2){
      const pocket = rot(D.blob[1], th);
      const marks = D.sites.map(s => ({ s:s, q:rot(s.p, th) }))
                           .sort((a, b) => a.q[2] - b.q[2]);
      marks.forEach(function(o){
        const t = depth(o.q), s = o.s;
        const col = s.k === "imp" ? AMBER : s.k === "neu" ? BLUE : MUTED;
        if (step >= 3 && s.k === "imp"){
          gLead.appendChild(el("path", { d:"M" + sx(pocket) + " " + sy(pocket) +
            "L" + sx(o.q) + " " + sy(o.q), stroke:col, "stroke-width":1.4,
            "stroke-dasharray":"5 5", fill:"none", opacity:0.35 + 0.45*t }));
        }
        const rr = s.k === "oth" ? 3 + 2*t : 5 + 4*t;
        gSite.appendChild(el("circle", { cx:sx(o.q), cy:sy(o.q), r:rr,
          fill:col, stroke:"#ffffff", "stroke-width":1.6, opacity:0.4 + 0.6*t }));
      });
      /* Labels last, front-most first, and only where one fits: these sites
         cluster, so left to themselves they land on top of each other. */
      const placed = [];
      marks.slice().reverse().forEach(function(o){
        const t = depth(o.q), s = o.s;
        if (t <= 0.62 || s.k === "oth") return;
        const txt = s.lab + (step >= 3 && s.k === "imp" ? "  " + s.d + "\u00c5" : "");
        const ux = sx(o.q) - CX, uy = sy(o.q) - CY;
        const m = Math.max(1, Math.hypot(ux, uy)), out = 16 + 4*t;
        const x = sx(o.q) + ux/m*out, y = sy(o.q) + uy/m*out + 7;
        const w = txt.length * 12.2, left = ux < 0 ? x - w : x;
        const box = [left - 3, y - 20, left + w + 3, y + 7];
        if (placed.some(b => box[0] < b[2] && b[0] < box[2] &&
                             box[1] < b[3] && b[1] < box[3])) return;
        placed.push(box);
        const col = s.k === "imp" ? AMBER : BLUE;
        const lab = el("text", { x:x, y:y, "font-size":23, "font-weight":700,
          fill:col, "text-anchor": ux < 0 ? "end" : "start",
          "paint-order":"stroke", stroke:"#ffffff", "stroke-width":4.5 });
        lab.textContent = txt;
        gLab.appendChild(lab);
      });
    }
  }

  const reduce = window.matchMedia &&
                 window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let step = 0, th = REST, raf = null;
  function tick(){
    if (!slide.classList.contains("on")){ raf = null; return; }
    th += SPIN; paint(step, th); raf = requestAnimationFrame(tick);
  }
  return {
    steps: S28,
    go: function(i, animated){
      step = S28[i] ? S28[i].show : 0;
      if (reduce || animated === false){
        if (raf){ cancelAnimationFrame(raf); raf = null; }
        th = REST; paint(step, th);                 /* deterministic still */
      } else {
        paint(step, th);
        if (!raf) raf = requestAnimationFrame(tick);
      }
    }
  };
}
window.Deck.sequence("esterase", driver);
})();
