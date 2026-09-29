/* ------------------------------------------------------------------ *
 * token-art.js — the drawings a genotype token gets.
 *
 * Shared, because the same three cloning mutations are walked twice:
 * once on DH10B in the Genotypes section and again on Mach1 two
 * sections later.  Drawing them identically is the point -- the second
 * walk is meant to read as "you have seen these", and it only does
 * that if it is literally the same picture.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;
const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);

function grp(o){ return G.el("g", {opacity:n1(cl(o == null ? 1 : o, 0, 1))}); }
function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 3,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return G.el("path", a);
}
function box(x, y, w, h, col, r, o){
  return G.el("rect", {x:n1(x), y:n1(y), width:n1(w), height:n1(h), rx:r == null ? 6 : r,
    fill:col, "fill-opacity":o == null ? ".14" : o, stroke:col, "stroke-width":2.6});
}
function cross(cx, cy, r){
  const g = G.el("g", {});
  g.appendChild(path("M"+n1(cx-r)+" "+n1(cy-r)+"L"+n1(cx+r)+" "+n1(cy+r), C.verm, 5));
  g.appendChild(path("M"+n1(cx+r)+" "+n1(cy-r)+"L"+n1(cx-r)+" "+n1(cy+r), C.verm, 5));
  return g;
}
function arrow(x0, x1, y, col){
  const g = G.el("g", {});
  g.appendChild(path("M"+n1(x0)+" "+n1(y)+"H"+n1(x1-10), col, 2.8));
  g.appendChild(path("M"+n1(x1-17)+" "+n1(y-8)+"L"+n1(x1)+" "+n1(y)+
    "L"+n1(x1-17)+" "+n1(y+8), col, 2.8));
  return g;
}
/* a stretch of chromosome with named stuff on it */
function chrom(y, x0, x1, feats){
  const g = G.el("g", {});
  let x = x0;
  feats.forEach(function(f){
    if (f[0] > x) g.appendChild(path("M"+n1(x)+" "+n1(y)+"H"+n1(f[0]), C.ink, 3));
    x = f[1];
  });
  g.appendChild(path("M"+n1(x)+" "+n1(y)+"H"+n1(x1), C.ink, 3));
  return g;
}
/* a membrane, as two rows of heads */
function membrane(y, x0, x1, col, gapAt){
  const g = G.el("g", {});
  for (let x = x0; x <= x1 - 14; x += 19){
    if (gapAt && x > gapAt[0] && x < gapAt[1]) continue;
    [y - 9, y + 9].forEach(function(yy){
      g.appendChild(G.el("circle", {cx:n1(x + 7), cy:n1(yy), r:7, fill:col,
        "fill-opacity":".30", stroke:col, "stroke-width":1.6}));
    });
  }
  return g;
}


/* a flask, and whether anything is growing in it */
function flask(cx, cy, label, ok){
  const g = G.el("g", {}), col = ok ? C.blue : C.muted;
  g.appendChild(G.el("path", {d:"M"+n1(cx-16)+" "+n1(cy-58)+"V"+n1(cy-18)+
    "L"+n1(cx-52)+" "+n1(cy+44)+"H"+n1(cx+52)+"L"+n1(cx+16)+" "+n1(cy-18)+
    "V"+n1(cy-58)+"Z", fill:ok ? C.blue : "none", "fill-opacity":ok ? ".18" : "0",
    stroke:col, "stroke-width":3, "stroke-linejoin":"round"}));
  g.appendChild(G.text(cx, cy + 82, label, 20, col, 700));
  if (!ok) g.appendChild(cross(cx, cy + 6, 26));
  return g;
}

/* ---- and what each one looks like ---------------------------------- */
function draw(k){
  const g = G.el("g", {}), CX = 560;
  if (k === "par"){
    g.appendChild(box(300, 380, 210, 56, C.muted));
    g.appendChild(G.text(405, 416, "MG1655", 25, C.muted, 700));
    g.appendChild(G.text(405, 460, "the default reference", 19, C.muted, 400));
    g.appendChild(box(300, 546, 210, 56, C.verm));
    g.appendChild(G.text(405, 582, "E. coli W", 25, C.verm, 700));
    g.appendChild(arrow(520, 596, 574, C.verm));
    g.appendChild(box(606, 546, 190, 56, C.verm));
    g.appendChild(G.text(701, 582, "Mach1", 25, C.verm, 700));
    g.appendChild(G.text(405, 626, "ATCC 9637 · sequenced", 19, C.muted, 400));
    g.appendChild(G.text(701, 626, "never published", 19, C.muted, 400));
  } else if (k === "rec"){
    g.appendChild(G.el("circle", {cx:440, cy:510, r:96, fill:"none",
      stroke:C.ink, "stroke-width":3}));
    [[-130, -50], [-50, 30]].forEach(function(a, i){
      const p0 = G.pt(440, 510, 96, a[0]), p1 = G.pt(440, 510, 96, a[1]);
      g.appendChild(G.el("path", {d:"M"+p0[0]+" "+p0[1]+"A96 96 0 0 1 "+p1[0]+" "+p1[1],
        fill:"none", stroke:C.blue, "stroke-width":12, "stroke-linecap":"round"}));
    });
    g.appendChild(G.text(440, 386, "two repeats", 20, C.blue, 700));
    g.appendChild(arrow(560, 636, 510, C.muted));
    g.appendChild(G.el("circle", {cx:750, cy:510, r:64, fill:"none",
      stroke:C.muted, "stroke-width":3}));
    g.appendChild(G.text(750, 606, "one repeat left", 20, C.muted, 400));
    g.appendChild(cross(750, 510, 40));
  } else if (k === "end"){
    g.appendChild(G.el("circle", {cx:420, cy:500, r:86, fill:"none",
      stroke:C.blue, "stroke-width":3}));
    g.appendChild(G.text(420, 616, "your plasmid", 20, C.blue, 700));
    g.appendChild(arrow(530, 606, 500, C.muted));
    [[690,470],[740,512],[688,540],[752,462],[726,560]].forEach(function(d){
      g.appendChild(path("M"+d[0]+" "+d[1]+"l26 12", C.muted, 5));
    });
    g.appendChild(G.text(722, 616, "a smear", 20, C.muted, 400));
    g.appendChild(box(556, 400, 118, 52, C.verm, 26));
    g.appendChild(G.text(615, 434, "EndA", 22, C.verm, 700));
    g.appendChild(cross(615, 426, 40));
  } else if (k === "hsd"){
    /* left to right, because the order is the argument: it goes in, it
       is not cut, and it comes back out carrying marks */
    g.appendChild(G.el("circle", {cx:352, cy:520, r:62, fill:"none",
      stroke:C.blue, "stroke-width":3}));
    g.appendChild(G.text(352, 428, "incoming DNA", 20, C.blue, 700));
    g.appendChild(arrow(428, 500, 520, C.muted));
    g.appendChild(box(520, 492, 160, 56, C.verm, 28));
    g.appendChild(G.text(600, 528, "restrict", 22, C.verm, 700));
    g.appendChild(cross(600, 520, 42));
    g.appendChild(G.text(600, 600, "rK\u2013", 21, C.muted, 400));
    g.appendChild(arrow(700, 772, 520, C.muted));
    g.appendChild(G.el("circle", {cx:862, cy:520, r:62, fill:"none",
      stroke:C.blue, "stroke-width":3}));
    [[-62,-14],[-22,-58],[40,-48],[60,24],[-8,62]].forEach(function(d){
      g.appendChild(G.el("circle", {cx:862+d[0], cy:520+d[1], r:8, fill:C.blue}));
    });
    g.appendChild(G.text(862, 428, "kept, and methylated", 20, C.blue, 700));
    g.appendChild(G.text(862, 616, "mK+", 21, C.muted, 400));
  } else if (k === "fhu"){
    g.appendChild(membrane(600, 280, 880, C.amber, [520, 604]));
    g.appendChild(G.el("rect", {x:520, y:574, width:84, height:52, rx:8,
      fill:"none", stroke:C.muted, "stroke-width":2.6, "stroke-dasharray":"7 5"}));
    g.appendChild(G.text(562, 680, "no FhuA", 20, C.muted, 400));
    g.appendChild(G.text(280, 680, "outer membrane", 19, C.muted, 400, "start"));
    const ph = G.el("g", {transform:"translate(562 420)"});
    ph.appendChild(G.el("path", {d:"M0 -42L38 -20V22L0 44L-38 22V-20Z",
      fill:C.verm, "fill-opacity":".18", stroke:C.verm, "stroke-width":3,
      "stroke-linejoin":"round"}));
    ph.appendChild(path("M0 44V82", C.verm, 4));
    ph.appendChild(path("M-16 82H16", C.verm, 4));
    g.appendChild(ph);
    g.appendChild(G.text(562, 348, "T1 · T5 · Φ80", 21, C.verm, 700));
    g.appendChild(cross(562, 548, 24));
  } else if (k === "lac"){
    g.appendChild(chrom(520, 260, 900, [[470, 690]]));
    g.appendChild(path("M470 500V540", C.verm, 3));
    g.appendChild(path("M690 500V540", C.verm, 3));
    g.appendChild(path("M470 520H690", C.verm, 3, "8 7"));
    g.appendChild(G.text(580, 478, "Δ(lac)X74", 23, C.verm, 700));
    g.appendChild(G.text(580, 576, "lacI lacZ lacY lacA · and neighbours",
      20, C.muted, 400));
    g.appendChild(G.text(260, 566, "chromosome", 19, C.muted, 400, "start"));
  } else if (k === "phi"){
    g.appendChild(chrom(560, 260, 900, [[430, 760]]));
    g.appendChild(box(430, 528, 330, 64, C.muted, 6, ".06"));
    g.appendChild(G.el("rect", {x:430, y:528, width:330, height:64, rx:6,
      fill:"none", stroke:C.muted, "stroke-width":2.2, "stroke-dasharray":"7 5"}));
    g.appendChild(G.text(595, 508, "Φ80 prophage · next to tonB",
      20, C.muted, 400));
    g.appendChild(box(456, 540, 278, 40, C.blue));
    g.appendChild(G.text(595, 568, "lacZΔM15", 23, C.blue, 700));
    g.appendChild(G.text(595, 632, "the piece that gets complemented",
      20, C.blue, 400));
    g.appendChild(G.text(260, 606, "chromosome", 19, C.muted, 400, "start"));
  } else if (k === "mcr"){
    /* DH10B's restriction tokens run the other way from Mach1's: what
       gets cut is METHYLATED incoming DNA, which is most of what you
       would ever want to move in from somewhere else. */
    g.appendChild(G.el("circle", {cx:320, cy:520, r:62, fill:"none",
      stroke:C.blue, "stroke-width":3}));
    [[-62,-14],[-22,-58],[40,-48],[60,24],[-8,62]].forEach(function(d){
      g.appendChild(G.el("circle", {cx:320+d[0], cy:520+d[1], r:8, fill:C.blue}));
    });
    g.appendChild(G.text(320, 428, "methylated DNA", 20, C.blue, 700));
    g.appendChild(arrow(396, 466, 520, C.muted));
    g.appendChild(box(486, 492, 220, 56, C.verm, 28));
    g.appendChild(G.text(596, 528, "mcr \u00b7 mrr \u00b7 hsd", 21, C.verm, 700));
    g.appendChild(cross(596, 520, 42));
    g.appendChild(arrow(726, 794, 520, C.muted));
    g.appendChild(G.el("circle", {cx:862, cy:520, r:62, fill:"none",
      stroke:C.blue, "stroke-width":3}));
    g.appendChild(G.text(862, 428, "survives", 20, C.blue, 700));
  } else {
    /* gal / ara / leu: one shape, because the lesson is one lesson.
       The catabolic two are NOT on M9: swapping the carbon source makes
       a different medium, and calling a galactose plate M9 teaches the
       wrong thing about what the glucose is doing there. */
    const M = {gal:"Gal MM", ara:"Ara MM", leu:"M9 \u00b7 any carbon"}[k];
    const three = k === "leu";
    const FX = three ? [340, 600, 860] : [420, 720];
    g.appendChild(flask(FX[0], 500, "LB", true));
    g.appendChild(G.text(FX[0], 392, "grows", 21, C.blue, 700));
    g.appendChild(flask(FX[1], 500, M, false));
    g.appendChild(G.text(FX[1], 392, "does not", 21, C.verm, 700));
    if (three){
      /* leucine is an auxotrophy, not a carbon defect, so no carbon
         source rescues it -- but a medium that simply hands the amino
         acid over does, and GMML is the one they will actually meet. */
      g.appendChild(flask(FX[2], 500, "GMML", true));
      g.appendChild(G.text(FX[2], 392, "grows", 21, C.blue, 700));
      g.appendChild(G.text(600, 648,
        "no carbon source rescues it \u00b7 GMML does, because it supplies leucine",
        21, C.muted, 400));
    } else {
      g.appendChild(G.text(570, 648,
        "rich medium hands it over \u00b7 minimal on that sugar does not",
        21, C.muted, 400));
    }
    if (k === "leu"){
      g.appendChild(chrom(724, 260, 900, [[440, 760]]));
      g.appendChild(path("M440 704V744", C.verm, 3));
      g.appendChild(path("M760 704V744", C.verm, 3));
      g.appendChild(path("M440 724H760", C.verm, 3, "8 7"));
      g.appendChild(G.text(600, 694, "ara \u2026 leu, in one deletion", 20, C.verm, 700));
    }
  }
  return g;
}


window.TOKART = {draw:draw, cross:cross, arrow:arrow, box:box, path:path,
                 chrom:chrom, membrane:membrane, grp:grp, flask:flask};
})();
