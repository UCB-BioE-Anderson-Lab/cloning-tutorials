/* ------------------------------------------------------------------ *
 * cell.js: one drawing of a bacterium, five slides.
 *
 *   cell5, source 5   what a cell is: the envelope and its compartments
 *   cell6, source 6   what is IN a cell          (5 clicks)
 *   cell7, source 7   cell lysis: sonication     (2 clicks)
 *   cell8, source 8   denaturing: alkaline lysis (5 clicks)
 *   cell9, source 9   small molecules: methanol  (3 clicks)
 *
 * WHY THIS IS DRAWN AND NOT CROPPED.  Source 7, 8 and 9 are MOTION PATH
 * animations: the cell's contents travel out of the cell to an Extract
 * zone or down to a Debris Pellet, and which contents go where IS the
 * argument of each slide.  LibreOffice renders a motion-path shape where
 * it STARTS, so a render of those slides is every object piled in its
 * home position with the "Extract" label lying across the cell.  There
 * is no still to crop.  Drawing the cell once and moving its parts is
 * the only conversion that carries the content over.
 *
 * NOTHING IS RE-ARGUED.  The contents, the labels, the destinations and
 * the order are the source's.  The speaker notes are verbatim, split on
 * the source's own <click> markers.
 *
 * THE LAYOUT, top to bottom:
 *   y  10-175   the Extract zone — what stays in solution
 *   y 190-440   the cell
 *   y 500-660   the Debris Pellet — what precipitates
 * Every movable unit has a home inside the cell and a slot in each zone;
 * a step says, for each unit, which of the three it is in.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";
const INK = "#111111", BLUE = "#004373", AMBER = "#a99011", MUTED = "#767676";
const BAND = "#c9bd93", DARK = "#7a6a0c", LIPID = "#8a7c4e";
const W = 1400, H = 700;

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
const n2 = v => Math.round(v * 10) / 10;

/* a pac-man: a disc with a wedge bitten out, the source's protein glyph */
function pac(p, cx, cy, r, fill, rot){
  const a = 28 * Math.PI / 180;
  const x1 = cx + r * Math.cos(a),  y1 = cy + r * Math.sin(a);
  const x2 = cx + r * Math.cos(-a), y2 = cy + r * Math.sin(-a);
  const d = "M" + cx + " " + cy + "L" + n2(x1) + " " + n2(y1) +
            "A" + r + " " + r + " 0 1 1 " + n2(x2) + " " + n2(y2) + "Z";
  return el("path", { d:d, fill:fill, transform:"rotate(" + (rot || 0) + " " + cx + " " + cy + ")" }, p);
}
function hexagon(p, cx, cy, r, stroke){
  let d = "";
  for (let i = 0; i < 6; i++){
    const a = (i * 60 - 90) * Math.PI / 180;
    d += (i ? "L" : "M") + n2(cx + r * Math.cos(a)) + " " + n2(cy + r * Math.sin(a));
  }
  return el("path", { d:d + "Z", fill:"none", stroke:stroke, "stroke-width":3.4,
                      "stroke-linejoin":"round" }, p);
}
/* a vertical double helix: two strands out of phase, with their rungs */
function helix(p, cx, cy, h, amp){
  const g = el("g", {}, p), turns = 1.7, N = 40;
  const sx = (t, s) => cx + s * amp * Math.sin(2 * Math.PI * turns * t);
  const sy = t => cy - h / 2 + h * t;
  [1, -1].forEach(function(s){
    let d = "";
    for (let i = 0; i <= N; i++){
      const t = i / N;
      d += (i ? "L" : "M") + n2(sx(t, s)) + " " + n2(sy(t));
    }
    el("path", { d:d, fill:"none", stroke:BLUE, "stroke-width":3.2, "stroke-linecap":"round" }, g);
  });
  for (let i = 1; i < 8; i++){
    const t = i / 8;
    el("path", { d:"M" + n2(sx(t, 1)) + " " + n2(sy(t)) + "L" + n2(sx(t, -1)) + " " + n2(sy(t)),
                 stroke:BLUE, "stroke-width":2.4, opacity:0.75 }, g);
  }
  return g;
}
/* a cloverleaf tRNA: an acceptor stem and three arms */
function trna(p, cx, cy){
  const g = el("g", { transform:"translate(" + cx + " " + cy + ")" }, p);
  const S = { fill:"none", stroke:AMBER, "stroke-width":3.4, "stroke-linecap":"round" };
  el("path", Object.assign({ d:"M0 -36V-6" }, S), g);
  el("path", Object.assign({ d:"M0 -6H-16" }, S), g);
  el("path", Object.assign({ d:"M0 -6H16" }, S), g);
  el("path", Object.assign({ d:"M0 -6V12" }, S), g);
  el("circle", Object.assign({ cx:-27, cy:-6, r:11 }, S), g);
  el("circle", Object.assign({ cx:27,  cy:-6, r:11 }, S), g);
  el("circle", Object.assign({ cx:0,   cy:23, r:11 }, S), g);
  return g;
}
/* a plasmid: a closed circle with a replication arrow on it */
function plasmid(p, cx, cy, r){
  const g = el("g", {}, p);
  el("circle", { cx:cx, cy:cy, r:r, fill:"none", stroke:MUTED, "stroke-width":3.4 }, g);
  el("path", { d:"M" + (cx - 7) + " " + n2(cy - r - 5) + "l10 5l-10 5z", fill:MUTED }, g);
  return g;
}
/* a surface glycan: a branched chain of rings on the outer membrane */
function glycan(p, cx, cy){
  const g = el("g", { transform:"translate(" + cx + " " + cy + ")" }, p);
  el("path", { d:"M0 34C0 18 -14 14 -14 0M0 34C0 22 14 18 14 2M-14 0C-14 -12 -24 -16 -26 -28M-14 0C-14 -12 -4 -16 -2 -28",
               fill:"none", stroke:BLUE, "stroke-width":3, "stroke-linecap":"round" }, g);
  hexagon(g, -26, -38, 10, AMBER);
  hexagon(g, -2, -38, 10, BLUE);
  hexagon(g, 14, -8, 10, AMBER);
  return g;
}

/* ---- the movable units: where each lives, and where each goes ------ */
const HOME = {
  prot: [290, 300], dna: [575, 268], rna: [700, 272], plas: [600, 332],
  sm: [950, 300], lip: [337, 440], carb: [1150, 190], q: [1180, 300]
};
/* Dispersed, each unit carries its own label with it, so the slots are set
   wide enough that the LABELS clear each other, not just the glyphs. */
const EXTRACT = {
  prot: [250, 72], dna: [470, 60], rna: [600, 64], plas: [740, 72],
  sm: [980, 72], lip: [337, 72], carb: [1190, 80], q: [1180, 72]
};
const DEBRIS = {
  prot: [230, 552], dna: [430, 540], rna: [560, 544], plas: [690, 552],
  sm: [1130, 552], lip: [900, 590], carb: [1150, 480], q: [1180, 552]
};

function build(host){
  const svg = el("svg", { viewBox:"0 0 " + W + " " + H, "aria-hidden":"true",
    preserveAspectRatio:"xMidYMid meet", style:"width:100%;height:100%;display:block" });
  host.appendChild(svg);

  /* the two zone labels, in the source's own words and color */
  const zExtract = tx(svg, 1360, 40, "Extract", { size:33, weight:700, fill:BLUE, anchor:"end" });
  const zDebris  = tx(svg, 1360, 692, "Debris Pellet", { size:33, weight:700, fill:BLUE, anchor:"end" });

  /* ---- the envelope: outer membrane, periplasm, inner membrane ---- */
  const env = el("g", {}, svg);
  const outer = el("rect", { x:80, y:190, width:1240, height:250, rx:125, fill:"none",
                             stroke:INK, "stroke-width":3 }, env);
  const band  = el("rect", { x:89, y:199, width:1222, height:232, rx:116, fill:"none",
                             stroke:BAND, "stroke-width":13 }, env);
  const inner = el("rect", { x:97.5, y:207.5, width:1205, height:215, rx:108, fill:"#ffffff",
                             stroke:INK, "stroke-width":2.6 }, env);
  /* the white interior must sit UNDER the contents but OVER nothing else */
  env.insertBefore(inner, outer);

  /* ---- slide 5 only: the four compartments, named -------------------- */
  const anat = el("g", {}, svg);
  tx(anat, 400, 182, "Outer Membrane", { size:27 });
  tx(anat, 400, 242, "Inner Membrane", { size:27 });
  tx(anat, 700, 330, "Cytoplasm", { size:30 });
  tx(anat, 1120, 158, "Periplasm", { size:27 });
  el("path", { d:"M1118 168l-56 42", stroke:INK, "stroke-width":2.4 }, anat);

/* ---- the contents ------------------------------------------------- */
  const U = {};
  function unit(name){
    const g = el("g", { "data-u":name }, svg);
    g.style.transition = "transform .95s cubic-bezier(.4,0,.2,1), opacity .5s ease";
    U[name] = g;
    return g;
  }

  const gp = unit("prot");
  pac(gp, 228, 260, 30, BLUE,  200);
  pac(gp, 330, 252, 36, AMBER, 40);
  pac(gp, 250, 330, 32, MUTED, 330);
  pac(gp, 348, 322, 30, DARK,  110);
  tx(gp, 290, 400, "Proteins", { size:25 });

  helix(unit("dna"), 575, 268, 70, 14);
  trna(unit("rna"), 700, 272);

  const gl = unit("plas");
  plasmid(gl, 600, 332, 23);
  tx(gl, 650, 400, "Nucleic Acids", { size:25 });

  const gs = unit("sm");
  hexagon(gs, 902, 262, 26, BLUE);
  hexagon(gs, 992, 282, 23, MUTED);
  hexagon(gs, 915, 328, 23, AMBER);
  tx(gs, 950, 400, "Small Molecules", { size:25 });

  /* the lipids ARE the membrane, so they are drawn in it — but only along
     the left run of the bottom, because this group travels, and ticks
     spanning the whole cell would sweep across every other unit's slot. */
  const gli = unit("lip");
  for (let x = 265; x <= 410; x += 48)
    el("path", { d:"M" + x + " 424.5v13", stroke:LIPID, "stroke-width":4,
                 "stroke-linecap":"round" }, gli);
  el("path", { d:"M302 462l15 -22M352 462l15 -22", stroke:INK, "stroke-width":2.2 }, gli);
  tx(gli, 337, 482, "Lipids", { size:25 });

  const gc = unit("carb");
  glycan(gc, 1150, 171);     /* anchored in the envelope, rings displayed outside it */
  tx(gc, 1105, 160, "Carbohydrates", { size:25, anchor:"end" });

  const gq = unit("q");
  tx(gq, 1140, 288, "?", { size:52, weight:700, fill:BLUE });
  tx(gq, 1205, 312, "?", { size:52, weight:700, fill:INK });
  tx(gq, 1155, 360, "?", { size:52, weight:700, fill:AMBER });

  return { svg:svg, env:env, rects:[outer, band, inner], anat:anat, U:U,
           zExtract:zExtract, zDebris:zDebris };
}

/* ------------------------------------------------------------------ *
 * A step is {env, zones, where, gone}:
 *   env    "intact" | "broken" | "gone"
 *   zones  which zone labels are showing
 *   where  unit -> "cell" | "extract" | "debris" | null (not yet drawn)
 *   gone   units that have been destroyed rather than moved
 * ------------------------------------------------------------------ */
function driver(host, slide, STEPS, opts){
  const v = build(host);
  opts = opts || {};
  if (!opts.anatomy) v.anat.setAttribute("opacity", 0);
  v.zExtract.setAttribute("opacity", 0);
  v.zDebris.setAttribute("opacity", 0);
  Object.keys(v.U).forEach(k => { v.U[k].style.opacity = 0; });

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function place(name, zone){
    const g = v.U[name];
    if (!g) return;
    if (!zone){ g.style.opacity = 0; return; }
    const home = HOME[name];
    const to = zone === "extract" ? EXTRACT[name] : zone === "debris" ? DEBRIS[name] : home;
    g.style.opacity = 1;
    g.style.transform = "translate(" + n2(to[0] - home[0]) + "px," + n2(to[1] - home[1]) + "px)";
  }

  function draw(s){
    const E = s.env || "intact";
    v.env.setAttribute("opacity", E === "gone" ? 0 : E === "broken" ? 0.45 : 1);
    v.rects.forEach(r => {
      if (E === "broken") r.setAttribute("stroke-dasharray", "30 26");
      else r.removeAttribute("stroke-dasharray");
    });
    v.zExtract.setAttribute("opacity", (s.zones || "").indexOf("e") >= 0 ? 1 : 0);
    v.zDebris.setAttribute("opacity", (s.zones || "").indexOf("d") >= 0 ? 1 : 0);
    Object.keys(v.U).forEach(function(k){
      if ((s.gone || "").indexOf(k) >= 0){ v.U[k].style.opacity = 0; return; }
      place(k, s.where[k] || null);
    });
  }

  function go(i, animated){
    const first = animated === false || reduce.matches;
    if (first) v.svg.style.setProperty("--none", "");
    Object.keys(v.U).forEach(k => {
      v.U[k].style.transition = first ? "none"
        : "transform .95s cubic-bezier(.4,0,.2,1), opacity .5s ease";
    });
    draw(STEPS[i].s);
    if (first) v.svg.getBoundingClientRect();        /* flush, so the next step animates */
    slide.setAttribute("data-step", i);
  }

  go(0, false);
  return { steps: STEPS.map(x => ({ note:x.note, desc:x.desc })), go: go };
}

/* every unit present in the cell, as slides 7-9 all begin */
const ALL = { prot:"cell", dna:"cell", rna:"cell", plas:"cell", sm:"cell",
              lip:"cell", carb:"cell" };
const cp = o => Object.assign({}, ALL, o || {});

/* ---- source 5: the envelope, named -------------------------------- */
const S5 = [
  { s:{ env:"intact", where:{} },
    note:null,
    desc:"A bacterium drawn in cross-section: an outer membrane, a tan band of peptidoglycan gel filling the periplasm, and an inner membrane enclosing the cytoplasm. Each of the four is labeled." }
];

/* ---- source 6: what is in it, one class at a time ----------------- */
const S6 = [
  { s:{ env:"intact", where:{ prot:"cell" } },
    note:"Chemically, there are proteins of various types in the cytoplasm, periplasm, and membranes",
    desc:"Inside the cytoplasm, four proteins appear, drawn as colored discs with a wedge bitten out of each." },
  { s:{ env:"intact", where:{ prot:"cell", dna:"cell", rna:"cell", plas:"cell" } },
    note:"There are genomic DNAs, plasmid DNAs, and tRNAs",
    desc:"Beside them, the nucleic acids: a double helix, a cloverleaf tRNA, and a small closed circle of plasmid DNA." },
  { s:{ env:"intact", where:{ prot:"cell", dna:"cell", rna:"cell", plas:"cell", sm:"cell" } },
    note:"there are various small molecule metabolites",
    desc:"To their right, three ring structures stand for the small molecule metabolites." },
  { s:{ env:"intact", where:{ prot:"cell", dna:"cell", rna:"cell", plas:"cell", sm:"cell", lip:"cell" } },
    note:"we also have lipids or other fat soluble compounds associated with the membranes",
    desc:"Short marks appear within the membrane itself, labeled as the lipids." },
  { s:{ env:"intact", where:cp({ q:null }) },
    note:"and finally we have various surface-displayed carbohydrates.",
    desc:"On the outside of the outer membrane, a branched chain of sugar rings appears." },
  { s:{ env:"intact", where:cp({ q:"cell" }) },
    note:"There may additionally be other substances you have engineered the cell to produce floating around in the cytoplasm",
    desc:"Three question marks appear in the free space of the cytoplasm: whatever else the cell has been engineered to make." }
];

/* ---- source 7: sonication, then a spin ---------------------------- */
const S7 = [
  { s:{ env:"intact", where:cp() },
    note:"After spinning down cells, you typically resuspend them in some solution, often PBS buffer (phosphate buffered saline), and then subject them to some destructive method.  In cell lysis methods, you are in some way puncturing the membranes and peptidoglycan allowing the soluble products in the cell to leak out. One way to do this is with a sonic disruptor which is the sound probe device that you submerge into the cell suspension",
    desc:"The whole cell, with all five classes of contents in place." },
  { s:{ env:"broken", zones:"ed",
        where:cp({ lip:"debris", carb:"debris", prot:"extract", dna:"extract",
                   rna:"extract", plas:"extract", sm:"extract" }) },
    note:"When you subsequently centrifuge the cells, you separate the insoluble components associated with the cell wall and membrane from those components that are soluble in the cytoplasm.",
    desc:"The envelope breaks into dashes. The proteins, nucleic acids and small molecules rise into the Extract above; the lipids and the surface carbohydrates fall into the Debris Pellet below." },
  { s:{ env:"broken", zones:"ed",
        where:cp({ lip:"debris", carb:"debris", prot:"extract", dna:"extract",
                   rna:"extract", plas:"extract", sm:"extract" }) },
    note:"There are multiple ways to achieve this – you can google these terms, but they all involve adding reagents or doing mechanical actions that disrupt the cell surface, and you follow them up with centrifugation. They differ in terms of scalability and harshness, but they all accomplish the release of the cytoplasm into a buffer solution.",
    desc:"A list of the other lysis methods appears beside the figure: osmotic shock, freeze-thaw, lysozymes, BugBuster detergent, bead milling, French press." }
];

/* ---- source 8: alkaline lysis, which denatures as it lyses -------- */
const S8 = [
  { s:{ env:"intact", where:cp() },
    note:"There are also methods that will denature biopolymers in the sample.  For example, the alkaline lysis procedure which  involves putting the bacteria into high concentrations of strong detergent (SDS) and pH 12 sodium hydroxide and then crashing the pH rapidly with acetic acid.  This is what you have done during the miniprep procedure.",
    desc:"The whole cell again, intact, with all of its contents." },
  { s:{ env:"gone", zones:"ed",
        where:cp({ lip:"debris", prot:"extract", dna:"extract", rna:"extract",
                   plas:"extract", sm:"extract", carb:"extract" }) },
    note:"This dissolves the membrane,",
    desc:"The envelope disappears entirely and its lipids drop into the Debris Pellet. Everything else is now loose in the Extract." },
  { s:{ env:"gone", zones:"ed",
        where:cp({ lip:"debris", prot:"debris", dna:"extract", rna:"extract",
                   plas:"extract", sm:"extract", carb:"extract" }) },
    note:"precipitates protein",
    desc:"The four proteins fall out of the Extract and join the Debris Pellet." },
  { s:{ env:"gone", zones:"ed",
        where:cp({ lip:"debris", prot:"debris", carb:"debris", dna:"extract",
                   rna:"extract", plas:"extract", sm:"extract" }) },
    note:"precipitates the peptidoglycan and surface carbohydrates",
    desc:"The surface carbohydrates follow the proteins down into the pellet." },
  { s:{ env:"gone", zones:"ed",
        where:cp({ lip:"debris", prot:"debris", carb:"debris", dna:"debris",
                   rna:"extract", plas:"extract", sm:"extract" }) },
    note:"and larger DNAs over around 100kb.",
    desc:"The genomic double helix falls as well. The small plasmid circle stays up in the Extract, which is why a miniprep works." },
  { s:{ env:"gone", zones:"ed", gone:"rna",
        where:cp({ lip:"debris", prot:"debris", carb:"debris", dna:"debris",
                   rna:"extract", plas:"extract", sm:"extract" }) },
    note:"If you also include an RNAse with the cocktail, you will degrade the RNA as well.",
    desc:"The tRNA fades out of the Extract: degraded rather than precipitated. The plasmid and the small molecules are all that is left in solution." }
];

/* ---- source 9: methanol, which keeps the small molecules ---------- */
const S9 = [
  { s:{ env:"intact", where:cp() },
    note:"There are also various methods to purify the small molecule population within the cell.  Methanol extraction is the most common.  You resuspend the cell pellet in methanol, and then spin the sample.  During this process, the methanol dissolves the membrane",
    desc:"The whole cell, intact, with all of its contents." },
  { s:{ env:"gone", zones:"e",
        where:cp({ sm:"extract", prot:"debris", dna:"debris", rna:"debris",
                   plas:"debris", lip:"debris", carb:"debris" }) },
    note:"allowing release of the small molecules into the methanol, but everything large gets denatured and precipitates.",
    desc:"The envelope dissolves. Only the three small molecules rise into the Extract; every biopolymer — proteins, nucleic acids, lipids, carbohydrates — sinks." },
  { s:{ env:"gone", zones:"ed",
        where:cp({ sm:"extract", prot:"debris", dna:"debris", rna:"debris",
                   plas:"debris", lip:"debris", carb:"debris" }) },
    note:"All that biopolymer is collected as a debris pellet after the spin. So, you get a solution of the small molecule fraction in methanol in the supernatant.",
    desc:"The pile at the bottom is labeled the Debris Pellet; the small molecules alone are the supernatant." },
  { s:{ env:"gone", zones:"ed",
        where:cp({ sm:"extract", prot:"debris", dna:"debris", rna:"debris",
                   plas:"debris", lip:"debris", carb:"debris" }) },
    note:"There are additional methods that are better for some small molecule types than others.  For example, Bligh-Dyer is a method for isolating the membrane lipids.",
    desc:"A list of the other small-molecule extractions appears: acetone, toluenization, chloroform-methanol, and the Bligh-Dyer method." }
];

function reg(name, STEPS, opts){
  window.Deck.sequence(name, function(slide){
    return driver(slide.querySelector(".cell-stage") || slide, slide, STEPS, opts);
  });
}
reg("cell5", S5, { anatomy:true });
reg("cell6", S6);
reg("cell7", S7);
reg("cell8", S8);
reg("cell9", S9);
})();
