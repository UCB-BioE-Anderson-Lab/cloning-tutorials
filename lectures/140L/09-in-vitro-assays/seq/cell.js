/* ------------------------------------------------------------------ *
 * cell.js: one drawing of a bacterium, five slides (source 5-9).
 *
 *   cell5  what a cell is: the envelope and its compartments
 *   cell6  what is IN a cell                       (5 clicks)
 *   cell7  cell lysis: sonication                  (2 clicks)
 *   cell8  denaturing methods: alkaline lysis      (5 clicks)
 *   cell9  small molecule extraction: methanol     (3 clicks)
 *
 * WHY THIS IS DRAWN AND NOT CROPPED.  Source 7, 8 and 9 are MOTION PATH
 * animations and LibreOffice renders a motion-path shape where it
 * STARTS, so a render of those slides is every object piled in its home
 * position with the "Extract" label lying across the cell.  There is no
 * still to crop.
 *
 * REBUILT 27 Oct 2026, AFTER IT FAILED IN FRONT OF A CLASS.  JCA: "the
 * animations at the start weren't right.  They were a mess.  You need to
 * remake those much closer to the original slides."  What the first
 * attempt got wrong, measured against the pptx:
 *
 *   - IT DELETED THE CELL.  On source 8 and 9 the envelope is still
 *     drawn after lysis; the first version set it to opacity 0, so the
 *     middle of the slide went empty and the contents became debris
 *     floating in nothing.  The envelope now FADES and stays.
 *   - IT SCATTERED EVERYTHING.  Each group had its own slot in a far-off
 *     zone, so groups crossed each other and their labels collided.
 *     Now every group keeps its x and moves only in y — one distance up
 *     to the Extract, one distance down to the Debris Pellet — so the
 *     row order is preserved and nothing can cross anything.
 *   - IT WAS THE WRONG COLOURS.  The source colour-codes the molecule
 *     classes (blue, yellow, green, orange) and that coding is what the
 *     slide is for.  Those colours are used here, which is a deliberate
 *     exception to the house palette, recorded in PLAN.txt.
 *   - IT LEFT OUT THE SONICATOR.  Source 7 draws pale rods tearing
 *     across the cell.  They are back.
 *
 * The contents, the labels, the destinations and the order are the
 * source's.  The speaker notes are verbatim, split on the source's own
 * <click> markers.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";
/* the source deck's own colours: each molecule class has one */
const INK = "#111111", BLUE = "#558ED5", NAVY = "#1F497D", YELLOW = "#FFFF00";
const GREEN = "#00B050", ORANGE = "#F79646", TAN = "#C4BD97", LIPID = "#8c8460";
const LINE = "#333333", ROD = "#e9e9e9", RODLINE = "#d2d2d2";
const W = 1400, H = 960;

/* the envelope */
const CX0 = 90, CY0 = 290, CW = 1220, CH = 310, CRX = 155;
const BAND_Y = 586;                       /* centre line of the bottom band */
const IN_TOP = 320, IN_BOT = 570;         /* inside the inner membrane */

/* How far a group travels.  ONE distance each way, for every group, so
   the left-to-right order survives the move and nothing can cross.
   EXTRA is the single exception: the carbohydrates hang off the OUTSIDE
   of the top membrane, 250 above everything else, so the shared drop
   would land them inside the cell they just came off.  They fall that
   much further.  Nothing else needs a special case and nothing else
   should get one. */
const DY_EXTRACT = -290, DY_DEBRIS = 330;
const EXTRA_DEBRIS = { carb: 250 };

/* slides 5 and 6 reserve no Extract or Debris band, so they crop to the
   cell and it is drawn large, the way the source slide has it */
const VIEW_CELL = "60 170 1300 480";

function el(n, a, p){
  const e = document.createElementNS(NS, n);
  for (const k in a) e.setAttribute(k, a[k]);
  if (p) p.appendChild(e);
  return e;
}
function tx(p, x, y, s, o){
  o = o || {};
  const t = el("text", { x:x, y:y, "text-anchor":o.anchor || "middle", "font-size":o.size || 27,
                         "font-weight":o.weight || 400, fill:o.fill || INK }, p);
  t.textContent = s;
  return t;
}
const n2 = v => Math.round(v * 10) / 10;

/* a protein: a disc with a wedge bitten out, as the source draws them */
function pac(p, cx, cy, r, fill, rot){
  const a = 32 * Math.PI / 180;
  const d = "M" + cx + " " + cy +
            "L" + n2(cx + r * Math.cos(a)) + " " + n2(cy + r * Math.sin(a)) +
            "A" + r + " " + r + " 0 1 1 " + n2(cx + r * Math.cos(-a)) + " " + n2(cy - r * Math.sin(a)) + "Z";
  return el("path", { d:d, fill:fill, transform:"rotate(" + (rot || 0) + " " + cx + " " + cy + ")" }, p);
}
function hexagon(p, cx, cy, r, stroke){
  let d = "";
  for (let i = 0; i < 6; i++){
    const a = (i * 60 - 90) * Math.PI / 180;
    d += (i ? "L" : "M") + n2(cx + r * Math.cos(a)) + " " + n2(cy + r * Math.sin(a));
  }
  return el("path", { d:d + "Z", fill:"none", stroke:stroke, "stroke-width":4,
                      "stroke-linejoin":"round" }, p);
}
/* a vertical double helix, as on the source slide */
function helix(p, cx, cy, h, amp){
  const g = el("g", {}, p), turns = 1.8, N = 44;
  const sx = (t, s) => cx + s * amp * Math.sin(2 * Math.PI * turns * t);
  const sy = t => cy - h / 2 + h * t;
  [1, -1].forEach(function(s){
    let d = "";
    for (let i = 0; i <= N; i++) d += (i ? "L" : "M") + n2(sx(i / N, s)) + " " + n2(sy(i / N));
    el("path", { d:d, fill:"none", stroke:BLUE, "stroke-width":4, "stroke-linecap":"round" }, g);
  });
  for (let i = 1; i < 9; i++){
    const t = i / 9;
    el("path", { d:"M" + n2(sx(t, 1)) + " " + n2(sy(t)) + "L" + n2(sx(t, -1)) + " " + n2(sy(t)),
                 stroke:BLUE, "stroke-width":3 }, g);
  }
  return g;
}
/* a cloverleaf tRNA */
function trna(p, cx, cy, s){
  const g = el("g", { transform:"translate(" + cx + " " + cy + ") scale(" + (s || 1) + ")" }, p);
  const S = { fill:"none", stroke:ORANGE, "stroke-width":4.5, "stroke-linecap":"round" };
  ["M0 -34V-5", "M0 -5H-15", "M0 -5H15", "M0 -5V13"].forEach(d =>
    el("path", Object.assign({ d:d }, S), g));
  [[-26,-5],[26,-5],[0,24]].forEach(c =>
    el("circle", Object.assign({ cx:c[0], cy:c[1], r:11 }, S), g));
  return g;
}
/* a plasmid: a closed circle with its replication arrow */
function plasmid(p, cx, cy, r){
  const g = el("g", {}, p);
  el("circle", { cx:cx, cy:cy, r:r, fill:"none", stroke:GREEN, "stroke-width":4 }, g);
  el("path", { d:"M" + (cx - 8) + " " + n2(cy - r - 6) + "l12 6l-12 6z", fill:GREEN }, g);
  return g;
}
/* surface carbohydrate: three wavy chains out of the top membrane */
function glycan(p, cx, cy){
  const g = el("g", { transform:"translate(" + cx + " " + cy + ")" }, p);
  [[-34, ORANGE], [0, NAVY], [34, GREEN]].forEach(function(c){
    el("path", { d:"M" + c[0] + " 4c-12 -18 10 -28 -2 -45c-10 -15 8 -24 -1 -42",
                 fill:"none", stroke:c[1], "stroke-width":4.5, "stroke-linecap":"round" }, g);
  });
  return g;
}

function build(host, opts){
  const svg = el("svg", { viewBox:opts.crop || ("0 0 " + W + " " + H), "aria-hidden":"true",
    preserveAspectRatio:"xMidYMid meet", style:"width:100%;height:100%;display:block" });
  host.appendChild(svg);

  /* the two zone labels, in the source's own words, colour and weight */
  const zExtract = tx(svg, 1350, 100, "Extract", { size:48, fill:BLUE, anchor:"end" });
  const zDebris  = tx(svg, 1350, 925, "Debris Pellet", { size:48, fill:BLUE, anchor:"end" });

  /* ---- the envelope: outer membrane, periplasm, inner membrane ---- */
  const env = el("g", {}, svg);
  el("rect", { x:CX0 + 16, y:CY0 + 16, width:CW, height:CH, rx:CRX,
               fill:"#000", opacity:0.06 }, env);                     /* the source's shadow */
  el("rect", { x:CX0, y:CY0, width:CW, height:CH, rx:CRX, fill:"#fff",
               stroke:LINE, "stroke-width":2 }, env);
  el("rect", { x:CX0 + 14, y:CY0 + 14, width:CW - 28, height:CH - 28, rx:CRX - 14,
               fill:"none", stroke:TAN, "stroke-width":16 }, env);
  el("rect", { x:CX0 + 30, y:CY0 + 30, width:CW - 60, height:CH - 60, rx:CRX - 30,
               fill:"#fff", stroke:LINE, "stroke-width":2 }, env);

  /* ---- source 5 only: the four compartments, named ----------------- */
  const anat = el("g", {}, svg);
  tx(anat, 470, CY0 - 14, "Outer Membrane", { size:30 });
  tx(anat, 470, IN_TOP + 42, "Inner Membrane", { size:30 });
  tx(anat, 760, 452, "Cytoplasm", { size:30 });
  tx(anat, 1150, 236, "Periplasm", { size:30 });
  el("path", { d:"M1120 250L1010 302", stroke:INK, "stroke-width":3 }, anat);
  if (!opts.anatomy) anat.setAttribute("opacity", 0);

  /* ---- the sonicator, source 7: pale rods tearing across the cell -- */
  const clip = el("clipPath", { id:"cellclip-" + Math.random().toString(36).slice(2) }, svg);
  el("rect", { x:CX0 - 40, y:CY0 - 34, width:CW + 80, height:CH + 68, rx:CRX }, clip);
  const rods = el("g", { "clip-path":"url(#" + clip.getAttribute("id") + ")" }, svg);
  /* irregular on purpose: evenly spaced bars at alternating angles read
     as a lattice, which is a structure, and this is damage */
  [[150,-31,1.00],[255,12,0.62],[352,-52,0.84],[470,27,1.00],[548,-9,0.55],
   [668,41,0.78],[742,-23,1.00],[880,8,0.60],[958,-44,0.92],[1086,33,0.70],
   [1188,-14,1.00]].forEach(function(r){
      const h = (CH + 240) * r[2];
      el("rect", { x:r[0], y:CY0 + CH / 2 - h / 2, width:14, height:h, fill:ROD,
                   stroke:RODLINE, "stroke-width":1.5,
                   transform:"rotate(" + r[1] + " " + (r[0] + 7) + " " + (CY0 + CH / 2) + ")" }, rods);
    });
  rods.setAttribute("opacity", 0);

  /* ---- the contents.  Every unit moves in y only. ------------------ */
  const U = {};
  function unit(name){
    const g = el("g", { "data-u":name }, svg);
    g.style.transition = "transform .95s cubic-bezier(.4,0,.2,1), opacity .5s ease";
    U[name] = g;
    return g;
  }

  const gp = unit("prot");
  pac(gp, 240, 345, 40, BLUE,   200);          /* straddles the membrane, as the source has it */
  pac(gp, 392, 390, 46, YELLOW,  40);
  pac(gp, 338, 468, 43, GREEN,  330);
  pac(gp, 452, 492, 41, ORANGE, 110);
  tx(gp, 430, 556, "Proteins", { size:28 });

  helix(unit("dna"), 640, 400, 95, 19);
  trna(unit("rna"), 757, 410, 1.0);

  const gl = unit("plas");
  plasmid(gl, 665, 490, 30);
  tx(gl, 700, 556, "Nucleic Acids", { size:28 });

  const gs = unit("sm");
  hexagon(gs, 905, 385, 33, NAVY);
  hexagon(gs, 1015, 435, 31, GREEN);
  hexagon(gs, 915, 487, 31, ORANGE);
  tx(gs, 960, 556, "Small Molecules", { size:28 });

  /* the lipids ARE the membrane: ticks in the band, labelled from the
     left so the label travels with them without leaving the frame */
  const gli = unit("lip");
  for (let x = 300; x <= 720; x += 42)
    el("path", { d:"M" + x + " " + (BAND_Y - 10) + "v20", stroke:LIPID, "stroke-width":5,
                 "stroke-linecap":"round" }, gli);
  el("path", { d:"M212 564l56 16M248 564l56 16", stroke:INK, "stroke-width":2.4 }, gli);
  tx(gli, 180, 556, "Lipids", { size:28, anchor:"start" });

  const gc = unit("carb");
  glycan(gc, 1080, CY0);
  tx(gc, 1152, 232, "Carbohydrates", { size:28, anchor:"start" });   /* right of the
     glyph, not left: on source 8 the extract row rises to just under it */

  const gq = unit("q");
  tx(gq, 1195, 410, "?", { size:62, weight:700, fill:NAVY });
  tx(gq, 1135, 468, "?", { size:62, weight:700, fill:GREEN });
  tx(gq, 1200, 526, "?", { size:62, weight:700, fill:ORANGE });

  return { svg:svg, env:env, anat:anat, rods:rods, U:U,
           zExtract:zExtract, zDebris:zDebris };
}

/* ------------------------------------------------------------------ *
 * A step is {env, rods, zones, where, gone}:
 *   env    1 intact · a fraction for a membrane that has dissolved.
 *          NEVER 0: the source keeps the cell drawn after lysis.
 *   where  unit -> "cell" | "extract" | "debris" | null (not yet drawn)
 * ------------------------------------------------------------------ */
function driver(host, slide, STEPS, opts){
  const v = build(host, opts || {});
  v.zExtract.setAttribute("opacity", 0);
  v.zDebris.setAttribute("opacity", 0);
  Object.keys(v.U).forEach(k => { v.U[k].style.opacity = 0; });
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function draw(s){
    v.env.setAttribute("opacity", s.env == null ? 1 : s.env);
    v.rods.setAttribute("opacity", s.rods ? 1 : 0);
    v.zExtract.setAttribute("opacity", (s.zones || "").indexOf("e") >= 0 ? 1 : 0);
    v.zDebris.setAttribute("opacity", (s.zones || "").indexOf("d") >= 0 ? 1 : 0);
    Object.keys(v.U).forEach(function(k){
      const g = v.U[k];
      if ((s.gone || "").indexOf(k) >= 0){ g.style.opacity = 0; return; }
      const zone = s.where[k];
      if (!zone){ g.style.opacity = 0; return; }
      g.style.opacity = 1;
      const dy = zone === "extract" ? DY_EXTRACT
               : zone === "debris" ? DY_DEBRIS + (EXTRA_DEBRIS[k] || 0) : 0;
      g.style.transform = "translate(0," + dy + "px)";
    });
  }

  function go(i, animated){
    const still = animated === false || reduce.matches;
    Object.keys(v.U).forEach(k => {
      v.U[k].style.transition = still ? "none"
        : "transform .95s cubic-bezier(.4,0,.2,1), opacity .5s ease";
    });
    draw(STEPS[i].s);
    if (still) v.svg.getBoundingClientRect();
    slide.setAttribute("data-step", i);
  }
  go(0, false);
  return { steps: STEPS.map(x => ({ note:x.note, desc:x.desc })), go: go };
}

/* every unit in the cell, as 7, 8 and 9 all begin */
const ALL = { prot:"cell", dna:"cell", rna:"cell", plas:"cell", sm:"cell",
              lip:"cell", carb:"cell" };
const cp = o => Object.assign({}, ALL, o || {});
/* after a lysis: the soluble things up, the wall and membrane down */
const SOLUBLE = { prot:"extract", dna:"extract", rna:"extract", plas:"extract", sm:"extract" };

/* ---- source 5: the envelope, named -------------------------------- */
const S5 = [
  { s:{ where:{} },
    note:null,
    desc:"A bacterium drawn in cross-section: an outer membrane, a tan band of peptidoglycan gel filling the periplasm, and an inner membrane enclosing the cytoplasm. Each of the four is labeled." }
];

/* ---- source 6: what is in it, one class at a time ----------------- */
const S6 = [
  { s:{ where:{ prot:"cell" } },
    note:"Chemically, there are proteins of various types in the cytoplasm, periplasm, and membranes",
    desc:"Inside the cell, four proteins appear as coloured discs with a wedge bitten out of each. One of them straddles the membrane itself." },
  { s:{ where:{ prot:"cell", dna:"cell", rna:"cell", plas:"cell" } },
    note:"There are genomic DNAs, plasmid DNAs, and tRNAs",
    desc:"Beside them the nucleic acids: a blue double helix, an orange cloverleaf tRNA, and a small green circle of plasmid DNA." },
  { s:{ where:{ prot:"cell", dna:"cell", rna:"cell", plas:"cell", sm:"cell" } },
    note:"there are various small molecule metabolites",
    desc:"To their right, three outlined rings stand for the small molecule metabolites." },
  { s:{ where:{ prot:"cell", dna:"cell", rna:"cell", plas:"cell", sm:"cell", lip:"cell" } },
    note:"we also have lipids or other fat soluble compounds associated with the membranes",
    desc:"Marks appear within the membrane band itself, labeled from the left as the lipids." },
  { s:{ where:cp({ q:null }) },
    note:"and finally we have various surface-displayed carbohydrates.",
    desc:"Three wavy chains of sugar rise out of the top of the outer membrane." },
  { s:{ where:cp({ q:"cell" }) },
    note:"There may additionally be other substances you have engineered the cell to produce floating around in the cytoplasm",
    desc:"Three question marks appear in the free space of the cytoplasm: whatever else the cell has been engineered to make." }
];

/* ---- source 7: sonication, then a spin ---------------------------- */
const S7 = [
  { s:{ where:cp() },
    note:"After spinning down cells, you typically resuspend them in some solution, often PBS buffer (phosphate buffered saline), and then subject them to some destructive method.  In cell lysis methods, you are in some way puncturing the membranes and peptidoglycan allowing the soluble products in the cell to leak out. One way to do this is with a sonic disruptor which is the sound probe device that you submerge into the cell suspension",
    desc:"The whole cell, with all five classes of contents in place." },
  { s:{ env:0.45, rods:1, zones:"ed",
        where:cp(Object.assign({ lip:"debris", carb:"debris" }, SOLUBLE)) },
    note:"When you subsequently centrifuge the cells, you separate the insoluble components associated with the cell wall and membrane from those components that are soluble in the cytoplasm.",
    desc:"Pale rods tear across the cell and the envelope goes faint. The proteins, nucleic acids and small molecules rise straight up into the Extract; the lipids and the surface carbohydrates drop straight down into the Debris Pellet." },
  { s:{ env:0.45, rods:1, zones:"ed",
        where:cp(Object.assign({ lip:"debris", carb:"debris" }, SOLUBLE)) },
    note:"There are multiple ways to achieve this – you can google these terms, but they all involve adding reagents or doing mechanical actions that disrupt the cell surface, and you follow them up with centrifugation. They differ in terms of scalability and harshness, but they all accomplish the release of the cytoplasm into a buffer solution.",
    desc:"A list of the other lysis methods appears beside the figure: osmotic shock, freeze-thaw, lysozymes, BugBuster detergent, bead milling, French press." }
];

/* ---- source 8: alkaline lysis, which denatures as it lyses -------- */
const S8 = [
  { s:{ where:cp() },
    note:"There are also methods that will denature biopolymers in the sample.  For example, the alkaline lysis procedure which  involves putting the bacteria into high concentrations of strong detergent (SDS) and pH 12 sodium hydroxide and then crashing the pH rapidly with acetic acid.  This is what you have done during the miniprep procedure.",
    desc:"The whole cell again, intact, with all of its contents." },
  { s:{ env:0.45, zones:"ed",
        where:cp(Object.assign({ lip:"debris" }, SOLUBLE)) },
    note:"This dissolves the membrane,",
    desc:"The envelope fades almost away and its lipids drop into the Debris Pellet. The soluble contents rise into the Extract above; the surface carbohydrates stay where they were, still intact." },
  { s:{ env:0.45, zones:"ed",
        where:cp(Object.assign({ lip:"debris" }, SOLUBLE, { prot:"debris" })) },
    note:"precipitates protein",
    desc:"The four proteins fall out of the Extract and join the Debris Pellet." },
  { s:{ env:0.45, zones:"ed",
        where:cp(Object.assign({ lip:"debris", carb:"debris" }, SOLUBLE, { prot:"debris" })) },
    note:"precipitates the peptidoglycan and surface carbohydrates",
    desc:"The surface carbohydrates follow the proteins down into the pellet." },
  { s:{ env:0.45, zones:"ed",
        where:cp(Object.assign({ lip:"debris", carb:"debris" }, SOLUBLE,
                               { prot:"debris", dna:"debris" })) },
    note:"and larger DNAs over around 100kb.",
    desc:"The genomic double helix falls as well. The small plasmid circle stays up in the Extract, which is why a miniprep works." },
  { s:{ env:0.45, zones:"ed", gone:"rna",
        where:cp(Object.assign({ lip:"debris", carb:"debris" }, SOLUBLE,
                               { prot:"debris", dna:"debris" })) },
    note:"If you also include an RNAse with the cocktail, you will degrade the RNA as well.",
    desc:"The tRNA fades out of the Extract: degraded rather than precipitated. The plasmid and the small molecules are all that is left in solution." }
];

/* ---- source 9: methanol, which keeps the small molecules ---------- */
const BIG = { prot:"debris", dna:"debris", rna:"debris", plas:"debris",
              lip:"debris", carb:"debris" };
const S9 = [
  { s:{ where:cp() },
    note:"There are also various methods to purify the small molecule population within the cell.  Methanol extraction is the most common.  You resuspend the cell pellet in methanol, and then spin the sample.  During this process, the methanol dissolves the membrane",
    desc:"The whole cell, intact, with all of its contents." },
  { s:{ env:0.45, zones:"e", where:cp(Object.assign({ sm:"extract" }, BIG)) },
    note:"allowing release of the small molecules into the methanol, but everything large gets denatured and precipitates.",
    desc:"The envelope fades. Only the three small molecules rise into the Extract; every biopolymer — proteins, nucleic acids, lipids, carbohydrates — sinks." },
  { s:{ env:0.45, zones:"ed", where:cp(Object.assign({ sm:"extract" }, BIG)) },
    note:"All that biopolymer is collected as a debris pellet after the spin. So, you get a solution of the small molecule fraction in methanol in the supernatant.",
    desc:"The pile at the bottom is labeled the Debris Pellet; the small molecules alone are the supernatant." },
  { s:{ env:0.45, zones:"ed", where:cp(Object.assign({ sm:"extract" }, BIG)) },
    note:"There are additional methods that are better for some small molecule types than others.  For example, Bligh-Dyer is a method for isolating the membrane lipids.",
    desc:"A list of the other small-molecule extractions appears: acetone, toluenization, chloroform-methanol, and the Bligh-Dyer method." }
];

function reg(name, STEPS, opts){
  window.Deck.sequence(name, function(slide){
    return driver(slide.querySelector(".cell-stage") || slide, slide, STEPS, opts);
  });
}
reg("cell5", S5, { anatomy:true, crop:VIEW_CELL });
reg("cell6", S6, { crop:VIEW_CELL });
reg("cell7", S7);
reg("cell8", S8);
reg("cell9", S9);
})();
