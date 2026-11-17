/* ------------------------------------------------------------------ *
 * 31b-brca1.js : what deep mutational scanning is FOR.  NEW SLIDE.
 *
 * Registers:  brca1
 *
 * THE SECOND of the two slides added after source 31.  The first draws
 * the method; this one is the payoff, and it is the reason the method
 * is worth a lecture slot at all.
 *
 * Findlay et al., Nature 2018, PMID 30209399, "Accurate classification
 * of BRCA1 variants with saturation genome editing."  Every number on
 * this slide is from that abstract, quoted here so nobody has to go
 * and look:
 *
 *   "Variants of uncertain significance fundamentally limit the
 *    clinical utility of genetic information."
 *   "Although BRCA1 has been sequenced in millions of women, the risk
 *    associated with most newly observed variants cannot be
 *    definitively assigned."
 *   "saturation genome editing to assay 96.5% of all possible
 *    single-nucleotide variants (SNVs) in 13 exons that encode
 *    functionally critical domains of BRCA1"
 *   "Functional effects for nearly 4,000 SNVs are bimodally
 *    distributed and almost perfectly concordant with established
 *    assessments of pathogenicity."
 *   "Over 400 non-functional missense SNVs are identified, as well as
 *    around 300 SNVs that disrupt expression."
 *
 * BE CAREFUL WITH THE CLOSER.  The paper says "We predict that these
 * results will be immediately useful for the clinical interpretation
 * of BRCA1 variants."  That is the authors' PREDICTION about utility.
 * It is not a statement that any clinic adopted the data, and this
 * slide must not become one -- JCA has already pulled me up once in
 * this deck for saying variants "actually go into patient reports",
 * which I could not support.  The slide says the scores exist before
 * anyone needs them, which is true and is the actual point; the note
 * attributes the clinical claim to the authors as a prediction.
 *
 * THE HISTOGRAM IS SCHEMATIC and says so.  What is faithful is its
 * SHAPE: bimodal, with a sparse valley between a smaller non-functional
 * mode and a larger functional one.  The counts printed beside it are
 * the paper's real ones.  Nothing should be read off the bars.
 *
 * WHY BIMODAL MATTERS HERE, and why this follows the CRISPRi slides
 * well: those curves were continuous, and the lesson was that
 * essentiality is quantitative.  This one is the opposite, and that is
 * the finding -- the variants fall into two camps with a gap between,
 * which is exactly what makes them classifiable.  A continuous
 * distribution would have been much less useful clinically.
 *
 * Authored at 1480x600.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", BLUE = "#004373",
      MUTED = "#767676", RULE = "#e4e4e4";
const n2 = v => Math.round(v * 10) / 10;

/* ---- left: the problem --------------------------------------------- */
function problem(){
  const X = 30;
  let s = "";
  s += '<text x="' + X + '" y="130" font-family="inherit" font-size="26" ' +
       'font-weight="700" fill="' + INK + '">The problem</text>';

  /* a stretch of BRCA1 with variants on it, most of them unknown */
  const BY = 186, BW = 380;
  s += '<rect x="' + X + '" y="' + BY + '" width="' + BW + '" height="26" rx="4" ' +
       'fill="#eef2f6" stroke="' + BLUE + '" stroke-width="2.5"/>';
  s += '<text x="' + (X + BW/2) + '" y="' + (BY + 19) + '" text-anchor="middle" ' +
       'font-family="inherit" font-size="18" fill="' + BLUE + '">BRCA1</text>';

  const marks = [
    [0.08, "known"], [0.17, "?"], [0.26, "?"], [0.33, "known"], [0.41, "?"],
    [0.48, "?"], [0.55, "?"], [0.63, "known"], [0.70, "?"], [0.78, "?"],
    [0.86, "?"], [0.93, "?"]
  ];
  marks.forEach(function(m){
    const x = X + m[0] * BW, known = m[1] === "known";
    s += '<line x1="' + n2(x) + '" y1="' + (BY - 12) + '" x2="' + n2(x) +
         '" y2="' + BY + '" stroke="' + (known ? MUTED : VERM) +
         '" stroke-width="2.5"/>';
    s += '<text x="' + n2(x) + '" y="' + (BY - 18) + '" text-anchor="middle" ' +
         'font-family="inherit" font-size="' + (known ? 13 : 19) +
         '" font-weight="700" fill="' + (known ? MUTED : VERM) + '">' +
         (known ? "✓" : "?") + '</text>';
  });

  const lines = [
    ["BRCA1 has been sequenced in", MUTED],
    ["millions of women.", MUTED],
    ["", MUTED],
    ["For most newly seen variants the", INK],
    ["risk cannot be assigned.", INK],
    ["", MUTED],
    ["variant of uncertain significance", VERM]
  ];
  lines.forEach(function(l, i){
    s += '<text x="' + X + '" y="' + (262 + i * 30) + '" font-family="inherit" ' +
         'font-size="' + (l[1] === VERM ? 23 : 21) + '"' +
         (l[1] === VERM ? ' font-weight="700"' : '') +
         ' fill="' + l[1] + '">' + l[0] + '</text>';
  });
  return s;
}

/* ---- the experiment, as a strip ------------------------------------ */
function strip(){
  const Y = 530;
  const facts = [
    ["saturation genome editing", "every SNV made in the cell's own gene"],
    ["96.5%", "of all possible SNVs, in 13 exons"],
    ["~4,000", "variants scored"],
    ["400+ / ~300", "non-functional missense / disrupt expression"]
  ];
  const X = [30, 390, 700, 950];
  let s = '<line x1="30" y1="' + (Y - 32) + '" x2="1450" y2="' + (Y - 32) +
          '" stroke="' + RULE + '" stroke-width="2"/>';
  facts.forEach(function(f, i){
    s += '<text x="' + X[i] + '" y="' + Y + '" font-family="inherit" ' +
         'font-size="23" font-weight="700" fill="' + INK + '">' + f[0] + '</text>';
    s += '<text x="' + X[i] + '" y="' + (Y + 24) + '" font-family="inherit" ' +
         'font-size="18" fill="' + MUTED + '">' + f[1] + '</text>';
  });
  return s;
}

/* ---- right: the bimodal distribution ------------------------------- *
 * Shape only.  A smaller non-functional mode on the left, a larger
 * functional one on the right, and a sparse valley between them, which
 * is what "bimodally distributed" means and is the whole finding.
 * ------------------------------------------------------------------ */
/* PH was 280, which pushed the "known to be pathogenic / benign" captions
   down onto the rule above the fact strip.  250 gives every row its line. */
const PX0 = 560, PW = 890, PY = 150, PH = 250, NB = 44;

const BINS = (function(){
  const b = [];
  for (let i = 0; i < NB; i++){
    const x = i / (NB - 1);
    const lo = Math.exp(-Math.pow((x - 0.14) / 0.085, 2));
    const hi = Math.exp(-Math.pow((x - 0.78) / 0.105, 2));
    b.push(0.42 * lo + 1.0 * hi + 0.012);
  }
  return b;
})();
const BMAX = Math.max.apply(null, BINS);

function hist(){
  let s = "";
  const bw = PW / NB;
  BINS.forEach(function(v, i){
    const h = v / BMAX * PH, x = PX0 + i * bw;
    const t = i / (NB - 1);
    const col = t < 0.42 ? VERM : t < 0.56 ? MUTED : BLUE;
    s += '<rect x="' + n2(x) + '" y="' + n2(PY + PH - h) + '" width="' +
         n2(bw - 1.5) + '" height="' + n2(h) + '" fill="' + col +
         '" opacity="0.82"/>';
  });
  s += '<line x1="' + PX0 + '" y1="' + (PY + PH) + '" x2="' + (PX0 + PW) +
       '" y2="' + (PY + PH) + '" stroke="' + INK + '" stroke-width="2.5"/>';
  s += '<line x1="' + PX0 + '" y1="' + PY + '" x2="' + PX0 + '" y2="' +
       (PY + PH) + '" stroke="' + INK + '" stroke-width="2.5"/>';
  s += '<text x="' + (PX0 + PW/2) + '" y="' + (PY + PH + 38) +
       '" text-anchor="middle" font-family="inherit" font-size="21" fill="' +
       INK + '">function score &#8594;</text>';
  s += '<text transform="translate(' + (PX0 - 22) + ',' + (PY + PH/2) +
       ') rotate(-90)" text-anchor="middle" font-family="inherit" ' +
       'font-size="21" fill="' + INK + '">variants</text>';
  s += '<text x="' + (PX0 + 0.14 * PW) + '" y="' + (PY + PH - 112) +
       '" text-anchor="middle" font-family="inherit" font-size="22" ' +
       'font-weight="700" fill="' + VERM + '">non-functional</text>';
  s += '<text x="' + (PX0 + 0.80 * PW) + '" y="' + (PY - 14) +
       '" text-anchor="middle" font-family="inherit" font-size="22" ' +
       'font-weight="700" fill="' + BLUE + '">functional</text>';
  return s;
}

function concordance(){
  let s = "";
  const y = PY + PH + 62;
  [[0.14, VERM, "the variants already", "known to be pathogenic"],
   [0.80, BLUE, "the variants already", "known to be benign"]].forEach(function(q){
    const x = PX0 + q[0] * PW;
    s += '<line x1="' + n2(x) + '" y1="' + (PY + PH + 6) + '" x2="' + n2(x) +
         '" y2="' + (y - 34) + '" stroke="' + q[1] + '" stroke-width="1.5" ' +
         'opacity="0.6"/>';
    s += '<text x="' + n2(x) + '" y="' + (y - 14) + '" text-anchor="middle" ' +
         'font-family="inherit" font-size="17" fill="' + q[1] + '">' + q[2] +
         '</text>';
    s += '<text x="' + n2(x) + '" y="' + (y + 6) + '" text-anchor="middle" ' +
         'font-family="inherit" font-size="17" fill="' + q[1] + '">' + q[3] +
         '</text>';
  });
  /* in the valley, which is the one piece of empty space inside the plot
     and is also the part of the picture the sentence is about; pinned to
     the top right it sat under the "functional" label */
  const VX = PX0 + 0.47 * PW;
  s += '<text x="' + n2(VX) + '" y="' + (PY + 74) + '" text-anchor="middle" ' +
       'font-family="inherit" font-size="21" font-weight="700" fill="' + INK +
       '">almost perfectly concordant</text>';
  s += '<text x="' + n2(VX) + '" y="' + (PY + 98) + '" text-anchor="middle" ' +
       'font-family="inherit" font-size="18" fill="' + MUTED +
       '">with established assessments of pathogenicity</text>';
  return s;
}

function figure(){
  let s = "";
  s += '<g data-r="prob" opacity="0">' + problem() + '</g>';
  s += '<g data-r="strip" opacity="0">' + strip() + '</g>';
  s += '<g data-r="hist" opacity="0">' + hist() + '</g>';
  s += '<g data-r="conc" opacity="0">' + concordance() + '</g>';
  s += '<text x="1450" y="' + (PY - 44) + '" text-anchor="end" ' +
       'font-family="inherit" font-size="17" fill="' + MUTED +
       '">Findlay et al., Nature 2018 &#183; PMID 30209399 &#183; distribution ' +
       'drawn to the described shape; the counts are the paper\'s</text>';
  return '<svg viewBox="0 0 1480 600" xmlns="http://www.w3.org/2000/svg" ' +
    'role="img" aria-label="Why deep mutational scanning matters. On the ' +
    'left, a stretch of BRCA1 carrying twelve variants, of which only three ' +
    'are marked as known and the rest as question marks: BRCA1 has been ' +
    'sequenced in millions of women, but for most newly seen variants the ' +
    'risk cannot be assigned, which is what a variant of uncertain ' +
    'significance means. On the right, a histogram of function scores for ' +
    'nearly four thousand single-nucleotide variants made by saturation ' +
    'genome editing. It is bimodal: a smaller non-functional peak on the ' +
    'left, a sparse valley, and a larger functional peak on the right. The ' +
    'variants already known to be pathogenic fall under the left peak and ' +
    'those already known to be benign under the right, almost perfectly ' +
    'concordant with established assessments of pathogenicity. The ' +
    'distribution is drawn to the described shape; the counts beneath are ' +
    'the paper\'s own.">' + s + '</svg>';
}

const steps = [
  {
    add:"So what is all that actually for? Here is the case I find most convincing. BRCA1 is a tumour suppressor, and germline loss-of-function variants in it predispose women to breast and ovarian cancer. It has been sequenced in millions of women. But sequencing someone only tells you which variant they have — it does not tell you whether that variant does anything. And most variants are rare, so when a new one turns up, there is often no evidence either way. That is what a variant of uncertain significance is, and it is the thing that limits how useful any of this sequencing actually is.",
    desc:"A stretch of BRCA1 with twelve variants on it, most marked with question marks rather than known." },
  {
    add:"Findlay and colleagues went at it the way we have just been describing. Saturation genome editing — so these are real edits to the cell's own copy of the gene, not a plasmid — covering ninety-six and a half percent of every single-nucleotide variant it is possible to have in thirteen exons, the ones encoding the functionally critical domains. Nearly four thousand variants, each with a measured effect on function.",
    desc:"The experiment: saturation genome editing of 96.5% of all possible SNVs in 13 exons, nearly 4,000 variants scored." },
  {
    add:"And this is the distribution of what came back. Look at the shape, because the shape is the result. It is bimodal. There is a non-functional population over here and a functional population over there and remarkably little in between. Now contrast that with the CRISPRi curves we just looked at, where the whole lesson was that essentiality is continuous and quantitative. This is the opposite, and it is a piece of luck: a gene whose variants fall cleanly into two camps is a gene whose variants you can classify.",
    desc:"The histogram of function scores: a smaller non-functional peak, a sparse valley, and a larger functional peak." },
  {
    add:"Here is the part that makes it trustworthy. Take the variants whose status was already settled — the ones independently known to be pathogenic, and the ones known to be benign — and ask where they land. The pathogenic ones sit under the left peak and the benign ones under the right. Almost perfectly concordant, in their words. So the assay reproduces what careful clinical assessment had already worked out, one variant at a time, over years. Which means you can trust it on the ones nobody has assessed: four hundred-odd non-functional missense variants, and about three hundred more that wreck expression. The authors' claim is that this should be immediately useful for clinical interpretation — and I'd flag that as a prediction about utility, not a report that any clinic has adopted it. But the measurement exists now, before anybody walks in with that variant, and that is the thing multiplexing bought.",
    desc:"The known-pathogenic variants fall under the non-functional peak and the known-benign under the functional one, with the paper's counts beneath." }
];

window.Deck.sequence("brca1", function(slide){
  const host = slide.querySelector("[data-brca]");
  if (!host) return { steps: steps.map(x => ({note:x.add, desc:x.desc})), go: function(){} };
  host.innerHTML = figure();
  const svg = host.querySelector("svg"), r = {};
  svg.querySelectorAll("[data-r]").forEach(e => r[e.getAttribute("data-r")] = e);

  function go(i){
    const set = (k, on) => r[k] && r[k].setAttribute("opacity", on ? "1" : "0");
    set("prob",  i >= 0);
    set("strip", i >= 1);
    set("hist",  i >= 2);
    set("conc",  i >= 3);
  }
  go(0);

  return { steps: steps.map(x => ({ note: x.add, desc: x.desc })), go: go };
});

})();
