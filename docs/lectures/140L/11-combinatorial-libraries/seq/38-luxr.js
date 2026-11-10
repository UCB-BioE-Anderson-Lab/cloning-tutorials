/* ------------------------------------------------------------------ *
 * 38-luxr.js : source 38, what the two rounds do to the population.
 *
 * Fills  [data-fig="luxr"]
 *
 * WHY REDRAWN.  JCA asked on 2026-11-10 for this one to stop being
 * abstract and name the actual experiment, and its labels were baked
 * into a raster, so relabelling it meant redrawing it.  Tenth redraw.
 *
 * THE LABELS ARE THE POINT, so they are worth getting exactly right.
 * Source 39's note says how the experiment is actually run: "they
 * first apply the ON selection in the presence of their new small
 * molecule C10HSL.  They then apply the negative selection in the
 * presence of the old small molecule 3OC6HSL."
 *
 * So the second round is NOT run with the stimulus withheld.  It is
 * run with the OLD ligand supplied, which is what makes it a trap for
 * anything that still answers to the old ligand -- wild-type LuxR
 * walks into it.  The raster said "(- stimulus)", which is the
 * general statement of a dual selection and is right on source 36,
 * where JCA's note says you "withhold the stimulus".  On THIS slide,
 * which is one named experiment, it was wrong.
 *
 * WHY THE DOTS KEEP THEIR POSITIONS across the three panels.  The
 * original re-scatters each population, so the three panels read as
 * three separate pictures.  Held in place, the same library is
 * visibly being sieved: the open circles vanish in round one and the
 * blue ones in round two, and nothing moves.  That is the claim the
 * slide is making.
 *
 * COLOUR.  Blue is wild-type LuxR, open is a dead variant, vermillion
 * is changed specificity -- the source's own three, and vermillion is
 * the survivor, which is this deck's rule for what red is for.
 *
 * Authored at 1400x700.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", BLUE = "#004373", MUTED = "#767676";
const n2 = v => Math.round(v * 10) / 10;

const WT = "wt", DEAD = "dead", NEW = "new";
const R = 17;

/* The library: eighteen dead, three wild type, two with changed
   specificity -- the source's own proportions. */
const MEMBERS = (function(){
  const rand = window.LotteryBall ? window.LotteryBall.rng(38041)
    : (function(){ let s=38041; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; })();
  const kinds = [];
  for (let i = 0; i < 18; i++) kinds.push(DEAD);
  kinds.push(WT, WT, WT, NEW, NEW);
  /* shuffle so the colours are not clumped, deterministically */
  for (let i = kinds.length - 1; i > 0; i--){
    const j = Math.floor(rand() * (i + 1));
    const t = kinds[i]; kinds[i] = kinds[j]; kinds[j] = t;
  }
  /* scatter them in a box, no two closer than a diameter */
  const W = 300, H = 400, pts = [];
  let guard = 0;
  while (pts.length < kinds.length && guard++ < 6000){
    const x = rand() * W, y = rand() * H;
    if (pts.some(q => Math.hypot(q[0]-x, q[1]-y) < R * 2.5)) continue;
    pts.push([x, y]);
  }
  return kinds.map((k, i) => ({ kind: k, x: pts[i][0], y: pts[i][1] }));
})();

function dot(cx, cy, kind){
  const fill = kind === WT ? BLUE : kind === NEW ? VERM : "#ffffff";
  return '<circle cx="' + n2(cx) + '" cy="' + n2(cy) + '" r="' + R + '" fill="' +
         fill + '" stroke="' + (kind === DEAD ? INK : INK) + '" stroke-width="3"/>';
}

/* one panel: the same members, with the named kinds removed */
function panel(ox, oy, gone){
  let s = "";
  MEMBERS.forEach(function(m){
    if (gone.indexOf(m.kind) >= 0) return;
    s += dot(ox + m.x, oy + m.y, m.kind);
  });
  return s;
}
function cap(cx, y, lines, colour, weight){
  let s = "";
  lines.forEach(function(t, i){
    s += '<text x="' + n2(cx) + '" y="' + n2(y + i * 34) + '" text-anchor="middle" ' +
         'font-family="inherit" font-size="26" font-weight="' + (weight||400) +
         '" fill="' + (colour||INK) + '">' + t + '</text>';
  });
  return s;
}

function luxr(){
  const PY = 150, COL = [92, 532, 972];
  let s = "";

  s += panel(COL[0], PY, []);
  s += panel(COL[1], PY, [DEAD]);
  s += panel(COL[2], PY, [DEAD, WT]);

  s += cap(COL[0] + 150, 620, ["naïve library"], INK, 700);
  s += cap(COL[1] + 150, 620,
        ["after positive selection", "+ C10HSL, the new ligand"], INK, 700);
  s += cap(COL[2] + 150, 620,
        ["after negative selection", "+ 3OC6HSL, the old ligand"], INK, 700);
  /* the second line of each caption is the condition, not the round */
  s += '<rect x="0" y="0" width="0" height="0" fill="none"/>';

  /* the key */
  const KX = 1096, KY = 58;
  [[WT, "wild-type LuxR", "answers 3OC6HSL"],
   [DEAD, "dead variant", "answers neither"],
   [NEW, "changed specificity", "answers C10HSL"]].forEach(function(k, i){
    const y = KY + i * 76;
    s += dot(KX, y, k[0]);
    s += '<text x="' + (KX + 32) + '" y="' + (y - 2) + '" font-family="inherit" ' +
         'font-size="25" fill="' + INK + '">' + k[1] + '</text>';
    s += '<text x="' + (KX + 32) + '" y="' + (y + 26) + '" font-family="inherit" ' +
         'font-size="22" fill="' + MUTED + '">' + k[2] + '</text>';
  });

  return '<svg viewBox="0 0 1400 700" xmlns="http://www.w3.org/2000/svg" ' +
    'role="img" aria-label="The same library of LuxR variants, shown three ' +
    'times in the same positions. In the naive library most circles are open ' +
    'dead variants, with three blue wild-type LuxR and two red variants of ' +
    'changed specificity. After the positive selection, run with C10HSL, the ' +
    'new ligand, every open circle has gone and the blue and red remain. ' +
    'After the negative selection, run with 3OC6HSL, the old ligand, the blue ' +
    'wild types have gone too, because they still answer the old ligand, and ' +
    'only the two red variants are left.">' + s + '</svg>';
}

function fill(){
  const el = document.querySelector('[data-fig="luxr"]');
  if (el) el.innerHTML = luxr();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
