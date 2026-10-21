/* ------------------------------------------------------------------ *
 * aminoacyl.js: the filter binding assay, source 35-38.
 *
 *   amino35  Aminoacylation           the construct, the enzyme, the tRNA
 *   amino36  Filter binding assays    hot tyrosine goes onto the tRNA
 *   amino37  Filter binding assays    the TCA paper
 *   amino38  Filter binding assays    wash, and what stays behind
 *
 * WHY THESE ARE DRAWN AND NOT CROPPED.  They are JCA's own drawings, and
 * they convert cleanly in shape — but they were drawn FOR THE GREY
 * MASTER, in a pale blue (#8AB0DD) and a pale yellow that are legible on
 * dark grey and nearly invisible on the white ground this deck uses.
 * Cropping them carries that colour over.  They also build across ten
 * states between them, including an EXIT on 38 (the unreacted hot
 * tyrosine washing out), which a render cannot give you at all.
 *
 * So the same drawings are redrawn here in the house palette, shape for
 * shape: the synthetase is still a pac-man, the tRNAs are still
 * cloverleaves, the hot tyrosine is still a single dot, the TCA paper is
 * still a tan disc.  The speaker notes are verbatim, split on the
 * source's own asterisk markers.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";
const INK = "#111111", BLUE = "#004373", AMBER = "#a99011", MUTED = "#767676";
const SLATE = "#4a4a4a", PAPER = "#d9d0ad";
const W = 1400, H = 620;

function el(n, a, p){
  const e = document.createElementNS(NS, n);
  for (const k in a) e.setAttribute(k, a[k]);
  if (p) p.appendChild(e);
  return e;
}
function tx(p, x, y, s, o){
  o = o || {};
  const t = el("text", { x:x, y:y, "text-anchor":o.anchor || "middle", "font-size":o.size || 26,
                         "font-weight":o.weight || 400, fill:o.fill || INK,
                         "font-style":o.italic ? "italic" : "normal" }, p);
  t.textContent = s;
  return t;
}
const n2 = v => Math.round(v * 10) / 10;

/* the synthetase, as the source drew it: a disc with a bite out */
function pac(p, cx, cy, r, rot, fill){
  const a = 30 * Math.PI / 180;
  const d = "M" + cx + " " + cy +
            "L" + n2(cx + r * Math.cos(a)) + " " + n2(cy + r * Math.sin(a)) +
            "A" + r + " " + r + " 0 1 1 " + n2(cx + r * Math.cos(-a)) + " " + n2(cy - r * Math.sin(a)) + "Z";
  return el("path", { d:d, fill:fill || SLATE,
                      transform:"rotate(" + (rot || 0) + " " + cx + " " + cy + ")" }, p);
}
/* a cloverleaf tRNA; its acceptor stem ends at (cx, cy - 36*s) */
function trna(p, cx, cy, s){
  const g = el("g", { transform:"translate(" + cx + " " + cy + ") scale(" + s + ")" }, p);
  const S = { fill:"none", stroke:BLUE, "stroke-width":3.4 / Math.sqrt(s), "stroke-linecap":"round" };
  ["M0 -36V-6", "M0 -6H-16", "M0 -6H16", "M0 -6V12"].forEach(d =>
    el("path", Object.assign({ d:d }, S), g));
  el("circle", Object.assign({ cx:-27, cy:-6, r:11 }, S), g);
  el("circle", Object.assign({ cx:27,  cy:-6, r:11 }, S), g);
  el("circle", Object.assign({ cx:0,   cy:23, r:11 }, S), g);
  return g;
}
/* tritium-labelled tyrosine: one dot, as on the source slides */
const hot = (p, cx, cy, r) => el("circle", { cx:cx, cy:cy, r:r || 15, fill:AMBER }, p);

/* the expression construct: promoter, gene, tag */
function construct(p, x, y){
  const g = el("g", {}, p), H0 = 88;
  el("path", { d:"M" + x + " " + (y + H0) + "V" + (y + 10) + "h70", fill:"none", stroke:BLUE,
               "stroke-width":8 }, g);
  el("path", { d:"M" + (x + 64) + " " + (y - 12) + "l38 22l-38 22z", fill:BLUE }, g);
  const x0 = x + 112, w = 540;
  el("path", { d:"M" + x0 + " " + y + "h" + (w - 56) + "l56 " + (H0 / 2) + "l-56 " + (H0 / 2) +
                  "H" + x0 + "z", fill:SLATE }, g);
  tx(g, x0 + w / 2 - 24, y + 60, "MjTyrRS", { size:42, fill:"#ffffff", italic:true });
  el("rect", { x:x0 + w + 10, y:y, width:172, height:H0, fill:BLUE }, g);
  tx(g, x0 + w + 96, y + 59, "His6", { size:40, fill:"#ffffff" });
  tx(g, x + 36, y - 30, "Pbad", { size:40, fill:BLUE, italic:true });
  return g;
}

function frame(host){
  const svg = el("svg", { viewBox:"0 0 " + W + " " + H, "aria-hidden":"true",
    preserveAspectRatio:"xMidYMid meet", style:"width:100%;height:100%;display:block" });
  host.appendChild(svg);
  return svg;
}
/* every part that comes and goes is class "o"; the section CSS fades it */
const o = g => { g.setAttribute("class", "o"); return g; };
function show(parts, on){
  Object.keys(parts).forEach(k =>
    parts[k].classList.toggle("in", on.indexOf(k) >= 0));
}

/* ---- source 35: what you start with ------------------------------- */
function scene35(host){
  const svg = frame(host), P = {};
  P.plasmid = o(el("g", {}, svg));
  construct(P.plasmid, 110, 70);

  P.enzyme = o(el("g", {}, svg));
  pac(P.enzyme, 280, 400, 98, 200);
  tx(P.enzyme, 280, 560, "Purified MjTyrRS", { size:34, fill:BLUE });

  P.trnas = o(el("g", {}, svg));
  [[720,300],[900,265],[1080,300],[790,420],[990,405],[1190,415],[870,540],[1080,545]]
    .forEach(c => trna(P.trnas, c[0], c[1], 1.6));
  tx(P.trnas, 960, 210, "Total E. coli tRNA", { size:34, fill:BLUE, italic:true });
  return P;
}
const S35 = [
  { on:["plasmid"],
    note:"We start with a DNA on a plasmid encoding the tyrosine synthetase,",
    desc:"A construct drawn as a gene diagram: an arabinose promoter, the MjTyrRS gene, and a His6 tag on its end." },
  { on:["plasmid","enzyme"],
    note:"then we induce and purify it.",
    desc:"Below it, the purified synthetase itself, drawn as a single dark disc with a bite out of it." },
  { on:["plasmid","enzyme","trnas"],
    note:"We also purify some E. coli total tRNA, which is a product you can purchase.",
    desc:"Beside the enzyme, a scattered field of eight cloverleaf tRNAs: total E. coli tRNA, bought off the shelf." }
];

/* ---- source 36: the hot amino acid goes on ------------------------ */
function scene36(host){
  const svg = frame(host), P = {};
  P.setup = o(el("g", {}, svg));
  pac(P.setup, 500, 140, 100, 205);
  hot(P.setup, 290, 150, 26);
  tx(P.setup, 250, 112, "Tritium-labeled", { size:32, fill:AMBER, anchor:"end" });
  tx(P.setup, 250, 150, "Tyrosine", { size:32, fill:AMBER, anchor:"end" });
  tx(P.setup, 680, 152, "ATP", { size:36 });
  trna(P.setup, 400, 430, 3.2);

  P.charged = o(el("g", {}, svg));
  el("path", { d:"M760 430h130", stroke:BLUE, "stroke-width":7 }, P.charged);
  el("path", { d:"M882 412l32 18l-32 18z", fill:BLUE }, P.charged);
  trna(P.charged, 1130, 430, 3.2);
  hot(P.charged, 1130, 310, 26);
  return P;
}
const S36 = [
  { on:["setup"],
    note:"We also purchase Tritium-labeled tyrosine.  You can buy radioactive versions of many of the common metabolites and cofactors, and all the amino acids are available.  You will incubate the tRNA sample, the synthetase sample, ATP, and hot tyrosine in a reaction.",
    desc:"The reaction laid out: a tRNA, the synthetase, ATP, and a single amber dot standing for tritium-labelled tyrosine." },
  { on:["setup","charged"],
    note:"The tritium-labeled tyrosine becomes covalently attached to the 3’ end of the tRNA.",
    desc:"An arrow, and the same tRNA again with the amber dot now sitting on the tip of its acceptor stem." }
];

/* ---- source 37: the paper ----------------------------------------- */
function scene37(host){
  const svg = frame(host), P = {};
  P.all = o(el("g", {}, svg));
  pac(P.all, 440, 140, 96, 205);
  hot(P.all, 230, 200, 26);
  trna(P.all, 740, 200, 2.6);
  hot(P.all, 740, 104, 24);
  el("ellipse", { cx:700, cy:450, rx:390, ry:98, fill:PAPER }, P.all);
  tx(P.all, 700, 596, "Trichloroacetic Acid (TCA)-soaked Filter paper", { size:32, fill:BLUE });
  return P;
}
const S37 = [
  { on:["all"],
    note:"After incubation, we transfer the reaction to a piece of filter paper that has been soaked in trichloroacetic acid and then dried out.  The acidity will quickly denature the sample and cause the tRNA and protein to precipitate in the paper.",
    desc:"The finished reaction — the synthetase, a charged tRNA and a loose dot of hot tyrosine — above a tan oval of filter paper soaked in trichloroacetic acid." }
];

/* ---- source 38: the wash ------------------------------------------ */
function scene38(host){
  const svg = frame(host), P = {};
  P.filter = o(el("g", {}, svg));
  el("circle", { cx:960, cy:306, r:294, fill:PAPER }, P.filter);
  pac(P.filter, 850, 190, 92, 205);
  trna(P.filter, 1110, 330, 2.4);
  hot(P.filter, 1110, 240, 24);
  P.loose = o(el("g", {}, svg));
  hot(P.loose, 790, 400, 25);
  hot(P.loose, 1090, 110, 25);
  hot(P.loose, 930, 500, 25);
  return P;
}
const S38 = [
  { on:["filter","loose"],
    note:"So, now the reaction is quenched and all the metabolites are in the paper.",
    desc:"The filter paper drawn as a tan disc, with the precipitated synthetase and charged tRNA caught in it and three loose dots of unreacted hot tyrosine among them." },
  { on:["filter","loose"],
    note:"We then soak the filters in 10% TCA.  Unreacted hot tyrosine",
    desc:"The second step of the protocol appears: wash with ten percent TCA, repeatedly, to remove the small molecules." },
  { on:["filter"],
    note:"diffuses out of the paper.",
    desc:"The three loose dots fade away. The synthetase and the charged tRNA, with its tyrosine still attached, stay in the paper." },
  { on:["filter"],
    note:"After several washes we soak the paper in ethanol to remove water, then dry it out with ether, then place the filter in a vial and quantify the radioactivity with a scintillation counter.  We can then calculate how much of the hot tyrosine remains on the filter, and from this quantify the conversion during the reaction.",
    desc:"The rest of the protocol appears: exchange the water for ethanol, dry that off with ether, and count the filter in a scintillation counter." }
];

function reg(name, scene, STEPS){
  window.Deck.sequence(name, function(slide){
    const P = scene(slide.querySelector(".amino-stage") || slide);
    return {
      steps: STEPS.map(x => ({ note:x.note, desc:x.desc })),
      go: function(i){ show(P, STEPS[i].on); slide.setAttribute("data-step", i); }
    };
  });
}
reg("amino35", scene35, S35);
reg("amino36", scene36, S36);
reg("amino37", scene37, S37);
reg("amino38", scene38, S38);
})();
