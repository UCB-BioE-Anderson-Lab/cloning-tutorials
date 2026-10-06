/* ------------------------------------------------------------------ *
 * 01-lac.js — the lac operon, as one run.
 *
 * This was three slides -- repression, where allolactose comes from,
 * and the CAP site -- and three slides was too much.  More to the
 * point, splitting them made the first one LIE: it ended on "and the
 * operon is transcribed" with no mention that CRP has to be there too,
 * which is exactly the false fully-on that the CAP slide then existed
 * to correct.  Better to carry the complexity through one run than to
 * state something clean and take it back two slides later.
 *
 * CRP AND LacI ARE BOUND AT THE SAME TIME.  The CAP site is around -61
 * and the operator around +11, so they are not competing for DNA: with
 * no glucose and no lactose the promoter is activated and repressed at
 * once, and the repressor wins.  That is beat 4, and it is the state a
 * culture is actually sitting in before you add anything to it.
 *
 * THE TICKER is as much the point of the slide as the drawing.
 * Repression is about a thousand-fold, not infinite, and the only way
 * to put a thousand-fold range on one bar is a log axis, so that is
 * what these are: three decades, ticked.  Watch it NOT move across
 * beats 4 and 5 -- CRP arriving changes nothing while LacI is on the
 * operator, and that is far easier to see than to say.
 *
 * EVERY FRAME CARRIES EVERY KEY, via the beat() accumulator.  A key
 * left out of a later frame counts as zero and silently deletes what
 * it draws -- see AUTHORING.txt.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GP, C = G.C;
const lerp = (a, b, t) => a + (b - a)*t;
const n2 = v => Math.round(v*10)/10;

const CELL = {x:232, y:272, w:1258, h:466};
const WALL = CELL.x;
const DY = 662, RY = 556;
const X0 = 300, X1 = 1440;
const CAPX = 470, CAPW = 112;          /* the CRP site, around -61     */
const OPX  = 640, OPW = 124;           /* the operator, around +11     */
const PRO  = 668;
const Z = [800, 212], Y = [1044, 176], A = [1252, 160];
const PERMY = 476;

/* ---- the ticker --------------------------------------------------- *
 * Levels relative to fully induced.  A log axis, because the range is
 * three decades and a linear bar would draw the basal state as nothing
 * at all -- which is the one thing this slide exists to deny.          */
const GAUGE = [
  {k:"mrna", lab:"lac mRNA",    col:C.verm},
  {k:"lacz", lab:"LacZ",        col:C.blue},
  {k:"lacy", lab:"LacY",        col:C.blue},
  {k:"laci", lab:"LacI",        col:C.blue},
  {k:"allo", lab:"allolactose", col:C.verm}
];
const GW = 206, GX = 214, GGAP = 254, GY = 196;
const logf = v => v <= 0 ? 0 : Math.min(1, Math.log10(v*1000 + 1)/3);

function ticker(v){
  const g = G.el("g", {});
  GAUGE.forEach(function(d, i){
    const x = GX + i*GGAP;
    g.appendChild(G.text(x, GY - 14, d.lab, 21, C.muted, 700, "start"));
    g.appendChild(G.el("rect", {x:x, y:GY, width:GW, height:17, rx:4,
      fill:"none", stroke:C.rule, "stroke-width":2}));
    [1, 2].forEach(t => g.appendChild(G.path("M" + n2(x + GW*t/3) + " " + GY +
      "v17", C.rule, 2)));
    const f = logf(v[d.k] || 0);
    if (f > 0.004) g.appendChild(G.el("rect", {x:x + 1.5, y:GY + 1.5,
      width:n2((GW - 3)*f), height:14, rx:3, fill:d.col}));
  });
  /* under the FIRST gauge and sitting on its own ticks: parked at the
     far right the scale reads as if it belonged to allolactose. */
  ["×1", "×10", "×100", "×1000"].forEach(function(t, i){
    g.appendChild(G.text(GX + GW*i/3, GY + 36, t, 16, C.muted, 400,
      i === 0 ? "start" : i === 3 ? "end" : "middle"));
  });
  return g;
}

function paint(v, f){
  const g = G.el("g", {});
  const add = n => { g.appendChild(n); return n; };
  add(ticker(v));

  /* Straight.  CRP really does bend this DNA, but a shallow bend is
     not worth a transition and just makes the backbone look wobbly;
     the reach that matters is drawn as the alpha tail instead. */
  add(G.dna(CAPX, X1, DY));
  add(G.dna(X0, CAPX, DY));
  add(G.el("rect", {x:CAPX, y:DY - 13, width:CAPW, height:26, rx:5,
    fill:"none", stroke:C.amber, "stroke-width":3}));
  add(G.text(CAPX + CAPW/2, DY + 46, "CAP site", 21, C.amber, 700));
  add(G.operator(OPX, OPW, DY, C.amber));
  add(G.text(OPX + OPW + 12, DY + 46, "lacO", 21, C.amber, 700, "start"));
  add(G.promoter(PRO, DY, "Plac", C.ink, 1));
  [[Z, "lacZ"], [Y, "lacY"], [A, "lacA"]].forEach(function(p){
    add(G.gene(p[0][0], DY, p[0][1], p[1], C.blue)).setAttribute("font-style", "italic");
  });

  const lx = lerp(880, OPX + OPW/2, Math.min(1, v.lbound)) + (v.off || 0)*168;
  const ly = lerp(380, DY - 46, Math.min(1, v.lbound)) - (v.off || 0)*140;

  /* ---- LacI ------------------------------------------------------ */
  if (v.laci > 0.02){
    const h = G.grp(Math.min(1, v.laci*2));
    h.appendChild(G.regulator(lx - 24, ly, v.off, C.blue));
    h.appendChild(G.regulator(lx + 24, ly, v.off, C.blue));
    h.appendChild(G.text(lx, ly - 58, "LacI", 21, C.blue, 700));
    g.appendChild(h);
  }
  /* ---- CRP, which is bound long before anything is induced -------- */
  if (v.crp > 0.02){
    const h = G.grp(Math.min(1, v.crp*2));
    const cx = lerp(392, CAPX + CAPW/2, v.cbound),
          cy = lerp(362, DY - 46, v.cbound);
    h.appendChild(G.regulator(cx - 24, cy, 1, C.blue));
    h.appendChild(G.regulator(cx + 24, cy, 1, C.blue));
    h.appendChild(G.text(cx - 76, cy + 4, "CRP", 21, C.blue, 700, "end"));
    h.appendChild(G.mol("camp", cx + 48, cy - 258, 142, "cAMP"));
    g.appendChild(h);
  }
  /* ---- what the leak paid for ------------------------------------ */
  if (v.lacy > 0.0005){
    const h = G.grp(1), n = v.lacy > 0.4 ? 3 : 1;
    for (let i = 0; i < n; i++)
      h.appendChild(G.permease(WALL, PERMY + i*104 - (n - 1)*52, C.blue));
    /* one label, under the whole stack: on the first copy the ones
       below it are drawn straight over the word. */
    h.appendChild(G.text(WALL, PERMY + (n - 1)*52 + 76, "LacY", 21, C.blue, 700));
    g.appendChild(h);
  }
  if (v.lacz > 0.0005){
    const h = G.grp(1), n = v.lacz > 0.4 ? 3 : 1;
    for (let i = 0; i < n; i++)
      h.appendChild(G.enzyme(382 + i*112, 464, C.blue));
    h.appendChild(G.text(382, 528, "LacZ", 21, C.blue, 700));
    g.appendChild(h);
  }
  /* ---- lactose in, then rearranged ------------------------------- */
  if (v.lacout > 0.02){
    const h = G.grp(Math.min(1, v.lacout*2));
    [0, 1].forEach(i => h.appendChild(G.mol("lactose", WALL - 74,
      PERMY - 52 + i*112, 132, i === 0 ? "lactose" : null)));
    g.appendChild(h);
  }
  if (v.lacin > 0.02){
    const h = G.grp(Math.min(1, v.lacin*2));
    h.appendChild(G.mol("lactose", lerp(WALL + 54, 300, Math.min(1, v.lacin)),
      PERMY - 92, 128));
    g.appendChild(h);
  }
  if (v.allo > 0.0005){
    const h = G.grp(Math.min(1, v.allo*3));
    h.appendChild(G.mol("allolactose", lerp(518, lx + 10, v.abind),
      lerp(412, ly - 100, v.abind), 196, "allolactose"));
    g.appendChild(h);
  }
  /* ---- polymerase, and the grip CRP gives it ---------------------- */
  if (v.pol > 0.02){
    const h = G.grp(Math.min(1, v.pol*2));
    const o1 = G.early(v.on);
    const cx = lerp(PRO - 42, PRO + 26, o1), cy = lerp(430, DY, o1);
    h.appendChild(G.rnap(cx, cy, C.ink));
    h.appendChild(G.sigma(cx + 68, cy - 74, C.blue, "σ70"));
    if (G.late(v.ctd) > 0.02){
      const t = G.grp(G.late(v.ctd));
      t.appendChild(G.actd(cx - 44, cy - 28, CAPX + CAPW/2 + 40, DY - 48, C.ink));
      g.appendChild(t);
    }
    g.appendChild(h);
  }
  if (G.late(v.tx) > 0.01) add(G.rna(Z[0], A[0] + A[1] + 28, RY, G.late(v.tx)));
  return g;
}

const FR = [];
let acc = {};
function beat(o){
  acc = Object.assign({}, acc, o.s || {});
  FR.push(Object.assign({}, o, {s:Object.assign({}, acc)}));
}

beat({ on:[], s:{},
  cap:"the <em>lac</em> operon arrives",
  call:"and nothing in the cell has touched it yet",
  note:"Start with the DNA and nothing else. A CAP site, the promoter, the operator, and lacZ, lacY and lacA transcribed as one message. Nothing is bound to any of it, and every counter along the top is at zero.",
  desc:"The lac operon drawn as one DNA molecule with its CAP site, promoter, operator and three genes. A row of level gauges above it reads zero for lac mRNA, LacZ, LacY, LacI and allolactose."});

beat({ on:[], s:{laci:1, lbound:1, mrna:0.001},
  cap:"LacI is made, and sits down on the operator",
  call:"the operator overlaps the promoter — that geometry <b>is</b> the mechanism",
  note:"LacI is made from its own gene, constitutively, and it goes straight to the operator. And look at where the operator is: it overlaps the promoter. A repressor sitting on it is physically occupying the DNA that polymerase needs. This is the most repressed this system ever gets.",
  desc:"LacI binds the operator, drawn overlapping the promoter, and its gauge goes to full while the others show only a trace."});

beat({ on:[], s:{lacz:0.001, lacy:0.001},
  cap:"but repression is about a <b>thousand-fold</b>, not infinite",
  call:"a repressed cell still holds a few LacZ and a few LacY",
  note:"And here is what the word repressed hides. Repression is about a thousand-fold, and a thousand-fold is not infinity. The cell is still making the occasional message, so it still contains a handful of LacZ and a handful of LacY. Look at the axis on those bars while I say that: it is logarithmic, three decades, because that is the only way a thousand-fold range fits on one bar at all. Hold on to that handful. Nothing that follows can start without it.",
  desc:"A single LacZ in the cytoplasm and a single LacY in the membrane, with the gauges showing them at about one thousandth of full on a logarithmic axis."});

beat({ on:[], s:{crp:1, cbound:1},
  cap:"there is no glucose, so cAMP is high and <b>CRP is already bound</b>",
  call:"alongside the repressor, not instead of it",
  note:"Now the second input, and it is already switched on before you have done anything. There is no glucose in the medium, so cAMP is high, so CRP has its ligand and is sitting on the CAP site. And notice that CRP and LacI are bound at the same time. They are not competing for anything: the CAP site is about sixty bases upstream of the start and the operator is just past it, so both fit. This promoter is activated and repressed simultaneously, and the repressor wins.",
  desc:"CRP, with cAMP bound to it, binds the CAP site while LacI stays on the operator. Nothing on the gauges moves."});

beat({ on:[], s:{pol:1},
  cap:"polymerase still cannot get on",
  call:"nothing has moved on the counters — CRP on its own does nothing here",
  note:"Polymerase arrives and can do nothing with the promoter, because the repressor is across it. This is exactly why activation and repression should not be told as two separate stories: CRP is doing its job perfectly and the operon is still off. Look at the gauges. They have not moved.",
  desc:"RNA polymerase is present but cannot occupy the promoter, and the gauges are unchanged from the previous beat."});

beat({ on:[], s:{lacout:1, lacin:1},
  cap:"then you add lactose, and the few LacY carry it in",
  call:"the operon supplied the transporter that detects its own substrate",
  note:"Now add lactose. It is a disaccharide and it cannot cross the membrane by itself; it needs LacY, and the few copies the leak paid for are enough to bring some in. The operon has supplied the thing needed to notice its own substrate.",
  desc:"Lactose appears outside the cell and is carried through the LacY permease into the cytoplasm."});

beat({ on:[], s:{allo:0.05},
  cap:"LacZ rearranges a little of it into <b>allolactose</b>",
  call:"same two sugars, different linkage — and <em>this</em> is the inducer, not lactose",
  note:"Inside, it meets LacZ. Most of what beta-galactosidase does to lactose is cut it in half, into glucose and galactose, which is the enzyme's actual job and the reason the operon exists. But a fraction of the time it does something else with the same substrate: it moves the galactose onto a different hydroxyl of the glucose. Same two sugars, different linkage, different molecule. Allolactose. Everybody draws lactose on this diagram, and the real inducer is a minor side product that does not exist until the enzyme encoded by this operon has made it.",
  desc:"LacZ converts some of the lactose into allolactose, drawn as the same two sugar rings joined differently, and the allolactose gauge lifts off zero."});

beat({ on:[], s:{abind:1, off:1, allo:0.3},
  cap:"allolactose binds LacI, and LacI lets go",
  call:"it does not leave the cell — its gauge never moves",
  note:"Allolactose binds the repressor, the repressor changes shape, and in that shape it no longer grips the operator. Say this one carefully, because the picture most people carry is wrong. The repressor has not been destroyed and it has not left. Its counter is exactly where it was at the start and it stays there all the way through. It is simply no longer holding on.",
  desc:"Allolactose docks into LacI, which releases the operator and lifts clear of it, while its own gauge stays at full."});

beat({ on:[], s:{on:1, ctd:1, mrna:1, tx:1},
  cap:"σ70 takes the promoter — and CRP <b>holds it there</b>",
  call:"the α tail reaches back to CRP; only now are both inputs satisfied",
  note:"With the operator clear, sigma seventy takes the promoter. And now CRP finally earns its keep, because this promoter is a bad one: its minus thirty-five and minus ten are poor matches to the consensus, so polymerase binds weakly and would let go again. But the alpha subunit's C-terminal domain sits on a long flexible linker, long enough to reach back along the DNA and touch CRP, and that contact is a second grip. The enzyme that could not hold this promoter by itself is now being held on it.",
  desc:"RNA polymerase seats on the promoter and the alpha C-terminal domain reaches back along the DNA on its linker to contact CRP; transcription begins."});

beat({ on:[], s:{lacz:1, lacy:1, allo:1},
  cap:"and then it runs away with itself",
  call:"<b>two</b> inputs had to be true: lactose present <b>and</b> glucose absent",
  note:"More LacY means more lactose coming in, more LacZ means more of it turned into allolactose, which means more repressor held off, which means more of both enzymes. The system drives itself from a trickle to full. And the thing to take away is that it needed two separate inputs, read by two separate proteins, at two separate sites on the same stretch of DNA. Lactose with glucose still present gets you very little, because without CRP the promoter is weak. Glucose absent with no lactose gets you very little, because the repressor is still on. It is an AND gate, and it is only all the way on when both terms are true.",
  desc:"All three gauges rise to full as the positive feedback closes, with the closing point that the operon is an AND gate requiring both lactose present and glucose absent."});

window.Deck.sequence("lac", function(slide){
  const s = G.scene(slide);
  s.add(G.envelope(CELL.x, CELL.y, CELL.w, CELL.h));
  s.finish();
  return G.run(s, FR, paint);
});
})();
