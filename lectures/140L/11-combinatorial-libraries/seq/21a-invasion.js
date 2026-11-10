/* ------------------------------------------------------------------ *
 * 21a-invasion.js : source 21, first of three -- what invasin does.
 *
 * Registers:  invasion
 *
 * WHY THIS SLIDE EXISTS.  Source 21 was one slide carrying three
 * separate arguments: what the invasin device is for, why its RBS had
 * to be retuned, and the data.  JCA split it into three on 2026-11-10.
 * This is the first: the biology the whole thing is in aid of.
 *
 * The source never showed it at all.  It opened on three construct
 * cartoons, which only make sense once you know that invasin on the
 * outside of an E. coli makes a mammalian cell eat it, and that the
 * point of the exercise is to make that happen inside a tumour and
 * nowhere else.  So the slide runs: watch it work, see what you want
 * to condition it on, then here are the three constructs.
 *
 * WHY THE INVASION IS ANIMATED.  Phagocytosis is a sequence -- bind,
 * cup, engulf, internalise -- and the only reason the device is worth
 * building is that a surface protein can start it.  A still frame of
 * a bacterium inside a cell does not show that anything was caused.
 *
 * COLOUR.  Invasin is vermillion, on the bacterium's surface and
 * nowhere else, so the thing being engineered is the thing you watch.
 * The integrin it binds is the same red on the mammalian side, because
 * the binding event is one interaction and two colours would hide it.
 * The tumour cues are amber, which is this deck's second rung: they
 * are the input the device is being conditioned on, not the output.
 *
 * Authored on the slide's own 1600x900 frame.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", AMBER = "#a99011",
      MUTED = "#767676", CELL = "#e8eef2", NUC = "#cfd9e0";
const n2 = v => Math.round(v * 10) / 10;
const R2 = Math.PI / 180;

/* ---- geometry ------------------------------------------------------ */
const MX = 470, MY = 520, MR = 196;      /* the mammalian cell         */
const B0 = [122, 250];                   /* where the bacterium starts */
const CONTACT = 232;                     /* its distance at contact    */
const INSIDE  = 96;                      /* and once internalised      */

/* the bacterium travels in along this ray */
const RAY = 214 * R2;                    /* up and to the left of MX,MY */
function onRay(d){
  return [MX + Math.cos(RAY) * d, MY + Math.sin(RAY) * d];
}

/* ---- the mammalian cell -------------------------------------------- *
 * Drawn as a path rather than a circle so the membrane can dimple
 * where the bacterium lands: cupping is the visible part of
 * phagocytosis and a circle cannot do it.
 * ------------------------------------------------------------------ */
function membrane(cup){
  const N = 96, pts = [];
  for (let i = 0; i < N; i++){
    const a = (i / N) * 360 * R2;
    /* how far this point is from the contact direction */
    let d = Math.abs(((a - RAY) * 180 / Math.PI + 540) % 360 - 180) * R2;
    /* a smooth dimple, deepest on the ray, gone by 50 degrees out */
    const w = Math.max(0, 1 - d / (50 * R2));
    const r = MR - cup * 150 * w * w * (3 - 2 * w);
    pts.push([MX + Math.cos(a) * r, MY + Math.sin(a) * r]);
  }
  let s = "M " + n2(pts[0][0]) + " " + n2(pts[0][1]);
  for (let i = 1; i < N; i++) s += " L " + n2(pts[i][0]) + " " + n2(pts[i][1]);
  return s + " Z";
}

/* ---- the bacterium, with invasin on it ----------------------------- */
function bacterium(){
  const L = 128, R = 34;
  let g = '<g data-r="bug">';
  g += '<rect x="' + n2(-L/2) + '" y="' + n2(-R) + '" width="' + L + '" height="' +
       (R*2) + '" rx="' + R + '" fill="#f3f1ec" stroke="' + INK +
       '" stroke-width="3.5"/>';
  /* invasin, studded round the outside */
  for (let i = 0; i < 14; i++){
    const a = (i / 14) * 360 * R2;
    const ex = Math.cos(a), ey = Math.sin(a);
    /* project on to the capsule's outline */
    const px = Math.max(-L/2, Math.min(L/2, ex * L * 0.6));
    const bx = px + ex * 2, by = ey * R;
    g += '<line x1="' + n2(bx) + '" y1="' + n2(by) + '" x2="' + n2(bx + ex*16) +
         '" y2="' + n2(by + ey*16) + '" stroke="' + VERM +
         '" stroke-width="6" stroke-linecap="round"/>';
  }
  return g + '</g>';
}

/* ---- the tumour's cues --------------------------------------------- */
const CUES = [
  { a: -118, t: "low O₂" },
  { a:  -58, t: "low pH" },
  { a:   16, t: "necrotic core" },
  { a:   62, t: "no blood supply" }
];
function cues(){
  let s = '<g data-r="cues" opacity="0">';
  CUES.forEach(function(c){
    const p = [MX + Math.cos(c.a*R2)*(MR+62), MY + Math.sin(c.a*R2)*(MR+62)];
    const t = [MX + Math.cos(c.a*R2)*(MR+18), MY + Math.sin(c.a*R2)*(MR+18)];
    s += '<line x1="' + n2(t[0]) + '" y1="' + n2(t[1]) + '" x2="' + n2(p[0]) +
         '" y2="' + n2(p[1]) + '" stroke="' + AMBER + '" stroke-width="2.5"/>';
    const anc = Math.cos(c.a*R2) < -0.2 ? "end" : "start";
    const dx = anc === "end" ? -10 : 10;
    s += '<text x="' + n2(p[0]+dx) + '" y="' + n2(p[1]+9) + '" text-anchor="' +
         anc + '" font-family="inherit" font-size="26" fill="' + AMBER + '">' +
         c.t + '</text>';
  });
  return s + '</g>';
}

/* ------------------------------------------------------------------ *
 * note: is the SOURCE's, verbatim -- the first three sentences of
 * source 21's note, which open on exactly this material.  The rest of
 * his note is on the impedance slide.  add: is written for the deck.
 * ------------------------------------------------------------------ */
const invasion = [
  {
    note:"Saturation mutagenesis can also be applied to regulatory elements.  A very common trick in synthetic biology is to construct RBS libraries out of a genetic construct.",
    add:"But start with what the device is actually for. Invasin is a surface protein from Yersinia. Put it on the outside of an E. coli and the bacterium can grab a beta-one integrin on a mammalian cell, and the mammalian cell responds by eating it. That is a cell that does not normally phagocytose anything, being made to take up a bacterium, by one protein on the outside of that bacterium.",
    desc:"An E. coli studded with red invasin sits beside a mammalian cell." },
  {
    note:"",
    add:"Watch what happens. The bacterium binds, the membrane cups around it, and it is taken inside. Whatever you have put in that bacterium is now in the cytoplasm of the target cell, which is the whole reason anyone cares about this.",
    desc:"The bacterium moves to the cell, the membrane dimples and cups around it, and it ends up inside." },
  {
    note:"",
    add:"Now, you do not want that happening everywhere. You want it to happen in a tumour and nowhere else. And a tumour is a distinctive place: the core is hypoxic because it has outgrown its blood supply, it is acidic, and it is partly necrotic. Those are the cues you would like to condition invasion on.",
    desc:"Labels appear around the mammalian cell naming the tumour microenvironment: low oxygen, low pH, a necrotic core and no blood supply." },
  {
    note:"Here, we are trying to adjust the RBS of a gene called invasin such that the expression of the gene is dependent on the promoter upstream.",
    add:"So you build three of them. The fdhF promoter is induced when oxygen runs out. The BAD promoter answers to arabinose, which stands in for an inducer you control. And the tet promoter is constitutive, which is the control: it should invade no matter what.",
    desc:"The three invasin constructs appear on the right, each a promoter driving Inv." }
];

window.Deck.sequence("invasion", function(slide){
  const host = slide.querySelector("[data-scene]");
  const rightHand = slide.querySelector("[data-right]");
  if (!host) return { steps: invasion.map(x => ({note:x.note, desc:x.desc})),
                      go: function(){} };

  host.innerHTML = '<svg viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg" ' +
    'aria-hidden="true">' +
      '<path data-r="mem" fill="' + CELL + '" stroke="' + INK + '" stroke-width="4"/>' +
      '<ellipse cx="' + (MX+46) + '" cy="' + (MY+36) + '" rx="74" ry="58" fill="' +
        NUC + '" stroke="' + MUTED + '" stroke-width="3"/>' +
      /* the integrins it binds, the same red as invasin */
      '<g data-r="integ"></g>' +
      cues() +
      bacterium() +
      '<text x="' + MX + '" y="' + (MY + MR + 64) + '" text-anchor="middle" ' +
        'font-family="inherit" font-size="27" fill="' + INK + '">mammalian cell</text>' +
    '</svg>';

  const svg = host.querySelector("svg"), r = {};
  svg.querySelectorAll("[data-r]").forEach(e => r[e.getAttribute("data-r")] = e);

  /* integrins sit on the membrane either side of the contact point */
  let ig = "";
  [-26, -9, 9, 26].forEach(function(off){
    const a = RAY + off * R2;
    const p = [MX + Math.cos(a)*MR, MY + Math.sin(a)*MR];
    ig += '<line x1="' + n2(p[0]) + '" y1="' + n2(p[1]) + '" x2="' +
          n2(p[0] + Math.cos(a)*15) + '" y2="' + n2(p[1] + Math.sin(a)*15) +
          '" stroke="' + VERM + '" stroke-width="6" stroke-linecap="round"/>';
  });
  r.integ.innerHTML = ig;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let raf = null, prev = -1;

  /* u runs 0 -> 1 across the whole invasion: approach, then engulf */
  function paint(u){
    const approach = Math.min(1, u / 0.45);
    const engulf = Math.max(0, (u - 0.45) / 0.55);
    const d = CONTACT + (B0d() - CONTACT) * (1 - approach)
              - (CONTACT - INSIDE) * engulf;
    const p = onRay(d);
    r.bug.setAttribute("transform", "translate(" + n2(p[0]) + "," + n2(p[1]) +
      ") rotate(" + n2(RAY * 180 / Math.PI) + ")");
    r.mem.setAttribute("d", membrane(engulf));
    /* once it is inside, the membrane closes back up behind it */
    if (engulf > 0.86){
      const close = (engulf - 0.86) / 0.14;
      r.mem.setAttribute("d", membrane(engulf * (1 - close)));
    }
    r.integ.setAttribute("opacity", String(1 - engulf));
  }
  function B0d(){ return Math.hypot(B0[0] - MX, B0[1] - MY); }

  function stop(){ if (raf){ cancelAnimationFrame(raf); raf = null; } }
  function run(){
    stop();
    const t0 = performance.now(), DUR = 2600;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1, (now - t0) / DUR);
      const e = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
      paint(e);
      if (t < 1) raf = requestAnimationFrame(f); else raf = null;
    });
  }

  function go(i, animated){
    stop();
    r.cues.setAttribute("opacity", i >= 2 ? "1" : "0");
    if (rightHand) rightHand.style.opacity = i >= 3 ? "1" : "0";
    if (i === 0){ paint(0); prev = i; return; }
    if (i === 1 && prev === 0 && animated !== false && !reduce.matches) run();
    else paint(1);
    prev = i;
  }
  go(0, false);

  return {
    steps: invasion.map(function(x){
      const spoken = x.note && x.add ? x.note + "  " + x.add : (x.note || x.add || "");
      return { note: spoken, desc: x.desc };
    }),
    go: go
  };
});

})();
