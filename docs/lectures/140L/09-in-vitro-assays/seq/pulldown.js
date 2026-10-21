/* ------------------------------------------------------------------ *
 * pulldown.js: source 40, the pulldown assay, in five beats.
 *
 * JCA, 21 Oct 2026: "three proteins, two bind, one doesn't, add the
 * bead, the bound one pulls down with it on spin.  The graphical styling
 * of that figure was nice, but I think it will be better as an
 * animation."
 *
 * The source figure is a borrowed vendor cartoon that shows the three
 * stages stacked down the page, each stage a separate little picture of
 * the same objects.  Drawn as one picture that moves, the objects stay
 * put and only their state changes, which is what the assay is: the same
 * three proteins, and the question of which of them is still there at
 * the end.  The colors follow the house palette rather than the
 * vendor's: vermillion bait, blue prey, grey for everything else.
 *
 * The speaker note is the source's, verbatim, split at its own sentence
 * boundaries so each beat says what is on screen.  Nothing is reworded.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";
const INK = "#111111", BLUE = "#004373", VERM = "#ba3a13", MUTED = "#767676";
const BEAD = "#e2e0d8", BEADLINE = "#9a978c", GEL = "#eceae4";
const W = 1400, H = 700;
const BX = 360, BY = 360, BR = 130;                 /* the bead */
const DOCK_BAIT = [536, 360], DOCK_PREY = [640, 360];
const PELLET = 190;                                 /* how far the spin drops it */

function el(n, a, p){
  const e = document.createElementNS(NS, n);
  for (const k in a) e.setAttribute(k, a[k]);
  if (p) p.appendChild(e);
  return e;
}
function tx(p, x, y, s, o){
  o = o || {};
  const t = el("text", { x:x, y:y, "text-anchor":o.anchor || "middle", "font-size":o.size || 26,
                         "font-weight":o.weight || 400, fill:o.fill || INK }, p);
  t.textContent = s;
  return t;
}
const o = g => { g.setAttribute("class", "o"); return g; };
const n2 = v => Math.round(v * 10) / 10;

/* a protein: a disc with a wedge bitten out, as everywhere else in this deck */
function prot(p, cx, cy, r, fill, rot){
  const a = 30 * Math.PI / 180;
  const d = "M" + cx + " " + cy +
            "L" + n2(cx + r * Math.cos(a)) + " " + n2(cy + r * Math.sin(a)) +
            "A" + r + " " + r + " 0 1 1 " + n2(cx + r * Math.cos(-a)) + " " + n2(cy - r * Math.sin(a)) + "Z";
  return el("path", { d:d, fill:fill, transform:"rotate(" + rot + " " + cx + " " + cy + ")" }, p);
}
/* the cell goop: small angular things that bind nothing */
function goop(p, cx, cy, s){
  return el("path", { d:"M" + cx + " " + (cy - 15 * s) + "l" + 14 * s + " " + 10 * s +
                         "l-5 " + 16 * s + "h" + -18 * s + "l-5 " + -16 * s + "z",
                      fill:MUTED, opacity:0.75 }, p);
}

function build(host){
  const svg = el("svg", { viewBox:"0 0 " + W + " " + H, "aria-hidden":"true",
    preserveAspectRatio:"xMidYMid meet", style:"width:100%;height:100%;display:block" });
  host.appendChild(svg);
  const P = {};

  /* ---- the bead, with its affinity ligand on the surface ---------- */
  P.bead = o(el("g", {}, svg));
  P.bead.style.transition = "transform 1s cubic-bezier(.4,0,.2,1), opacity .5s ease";
  el("circle", { cx:BX, cy:BY, r:BR, fill:BEAD, stroke:BEADLINE, "stroke-width":3 }, P.bead);
  tx(P.bead, BX, BY + 9, "bead", { size:28, fill:MUTED });
  /* the ligand: a notch of blue on the rim, where the bait's tag plugs in.
     Its label goes ABOVE the bead: to the right is where the bait docks. */
  el("path", { d:"M" + (BX + BR - 6) + " " + (BY - 28) + "h32v56h-32z", fill:BLUE }, P.bead);
  tx(P.bead, BX, BY - BR - 22, "Affinity Ligand", { size:25, fill:BLUE });

  /* ---- the three proteins ----------------------------------------- */
  function mover(name){
    const g = o(el("g", {}, svg));
    g.style.transition = "transform 1s cubic-bezier(.4,0,.2,1), opacity .5s ease";
    P[name] = g;
    return g;
  }
  const bait = mover("bait");
  prot(bait, DOCK_BAIT[0], DOCK_BAIT[1], 56, VERM, 180);
  el("rect", { x:DOCK_BAIT[0] - 74, y:DOCK_BAIT[1] - 26, width:32, height:52, fill:BLUE }, bait);
  tx(bait, DOCK_BAIT[0] - 36, DOCK_BAIT[1] + 96, "Bait", { size:29, weight:700, fill:VERM });

  const prey = mover("prey");
  prot(prey, DOCK_PREY[0], DOCK_PREY[1], 46, BLUE, 180);
  tx(prey, DOCK_PREY[0] + 68, DOCK_PREY[1] + 12, "Prey", { size:29, weight:700, fill:BLUE,
      anchor:"start" });

  const odd = mover("odd");
  goop(odd, 1030, 170, 2.4);
  tx(odd, 1030, 262, "binds nothing", { size:24, fill:MUTED });

  /* ---- the rest of the lysate ------------------------------------- */
  P.lysate = o(el("g", {}, svg));
  [[150,150,1.5],[280,190,1.2],[760,470,1.4],[880,330,1.1],[620,560,1.3],
   [170,520,1.2],[900,560,1.5],[400,600,1.1],[1140,420,1.3]]
    .forEach(c => goop(P.lysate, c[0], c[1], c[2]));
  tx(P.lysate, 180, 610, "cell lysate", { size:24, fill:MUTED });

  /* ---- the gel it all ends in ------------------------------------- */
  P.gel = o(el("g", {}, svg));
  const GX = 1010, GY = 120, GW = 330, GH = 420;
  el("rect", { x:GX, y:GY, width:GW, height:GH, fill:GEL, stroke:BEADLINE, "stroke-width":2.5 }, P.gel);
  tx(P.gel, GX + 86, GY - 44, "“Bait”", { size:23, fill:MUTED });
  tx(P.gel, GX + 86, GY - 18, "only", { size:23, fill:MUTED });
  tx(P.gel, GX + 244, GY - 18, "Sample", { size:23, fill:MUTED });
  const band = (lane, y, fill) =>
    el("rect", { x:GX + (lane ? 190 : 32), y:y, width:108, height:15, rx:4, fill:fill }, P.gel);
  band(0, GY + 120, VERM); band(1, GY + 120, VERM);
  band(1, GY + 250, BLUE);
  tx(P.gel, GX + GW + 14, GY + 133, "Bait", { size:24, fill:VERM, anchor:"start" });
  tx(P.gel, GX + GW + 14, GY + 263, "Prey", { size:24, fill:BLUE, anchor:"start" });

  return { svg:svg, P:P };
}

/* where each mover sits at each beat, as an offset from its docked place */
const FREE = { bait:[-296, -120], prey:[120, -150], odd:[90, 80] };
const AWAY = { odd:[210, -30] };

const STEPS = [
  { on:["bait","prey","odd"], at:FREE,
    note:"If you want to observe an interaction between two biomolecules (typically two proteins, or one protein and one something else), one workhorse technique is a pulldown assay. We will refer to one of the proteins as the Bait, and the other as the Prey.",
    desc:"Three proteins floating free: the bait in vermillion, the prey in blue, and a third grey one that binds nothing." },
  { on:["bait","prey","odd","bead"], at:{ bait:[0, 0], prey:FREE.prey, odd:[0, 0] },
    note:"First, you get the Bait protein attached to a solid support.  Typically, this is done by something like fusing GST to the Bait’s open reading frame to express a fusion protein, which can then be isolated on glutathione beads based on affinity chromatography.",
    desc:"A bead arrives carrying an affinity ligand, and the bait docks onto it by the tag fused to its open reading frame." },
  { on:["bait","prey","odd","bead","lysate"], at:{ bait:[0, 0], prey:FREE.prey, odd:[0, 0] },
    note:"You then incubate those beads with a lysate containing the Prey protein amongst other cell goop.",
    desc:"The lysate pours in: the prey, and a scatter of other grey proteins all round the bead." },
  { on:["bait","prey","bead"], at:{ bait:[0, 0], prey:[0, 0], odd:AWAY.odd },
    note:"If there is a stable interaction, the prey will become attached to the Bait on the Bead, and upon washing it will be retained.",
    desc:"The prey settles against the bait and stays there. Everything that bound nothing washes away." },
  { on:["bait","prey","bead","gel"], at:{ bait:[0, PELLET], prey:[0, PELLET], odd:AWAY.odd },
    note:"Finally, you elute the beads by denaturing them with detergent, and run an SDS-PAGE gel.  If there was an interaction, you should get a band for the Prey as well as the Bait.",
    desc:"The spin drops the bead to the bottom, carrying the bait and the prey with it. Beside it, the gel: one band in the bait-only lane, two in the sample lane." }
];

window.Deck.sequence("pulldown", function(slide){
  const v = build(slide.querySelector(".pd-stage") || slide);
  function place(name, dx, dy, animated){
    const g = v.P[name];
    g.style.transition = animated ? "transform 1s cubic-bezier(.4,0,.2,1), opacity .5s ease" : "none";
    g.style.transform = "translate(" + dx + "px," + dy + "px)";
  }
  return {
    steps: STEPS.map(s => ({ note:s.note, desc:s.desc })),
    go: function(i, animated){
      const st = STEPS[i];
      Object.keys(v.P).forEach(k => v.P[k].classList.toggle("in", st.on.indexOf(k) >= 0));
      ["bait", "prey", "odd"].forEach(k => {
        const d = st.at[k] || [0, 0];
        place(k, d[0], d[1], animated !== false);
      });
      /* the bead goes down with its cargo on the spin */
      v.P.bead.style.transition = animated !== false
        ? "transform 1s cubic-bezier(.4,0,.2,1), opacity .5s ease" : "none";
      v.P.bead.style.transform = "translate(0," + (i === 4 ? PELLET : 0) + "px)";
      slide.setAttribute("data-step", i);
    }
  };
});
})();
