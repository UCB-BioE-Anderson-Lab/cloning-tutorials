/* ------------------------------------------------------------------ *
 * 31-dms.js : deep mutational scanning, named and drawn.  NEW SLIDE.
 *
 * Registers:  dms
 *
 * WHY THIS SLIDE EXISTS, AND WHY IT SITS HERE.  I told JCA on
 * 2026-11-16 that deep mutational scanning was missing from Protein
 * Function.  That was wrong, and the way it was wrong decided this
 * slide's design.  Source 31 is PMID 20711194 -- Fowler et al., Nat
 * Methods 2010, "High-resolution mapping of protein sequence-function
 * relationships" -- which is the paper that FOUNDED deep mutational
 * scanning and gave it its name.  It is already in the deck, but it is
 * framed as a thing you can do to a phage display experiment rather
 * than as the start of a method.
 *
 * So this slide does not introduce DMS cold.  It goes immediately
 * after 31 and says: that experiment has a name, and here is the shape
 * of the thing it produces.  Source 31 gets more valuable rather than
 * being competed with.
 *
 * FOWLER'S OWN NUMBERS, from the abstract: ">600,000 variants of a
 * human WW domain after three and six rounds of selection by phage
 * display".  Note that 600,000 is NOT the number of single
 * substitutions -- a WW domain is about 35 residues, so single
 * substitutions number in the hundreds.  Their library carried
 * multiples too.  The slide says "every single substitution" for the
 * MODERN form of the method and gives Fowler's 600,000 separately as
 * his.  Do not merge those two numbers.
 *
 * THE LINE WORTH TEACHING is also Fowler's, and is quoted in the note:
 * "each position had unique features that could not be captured by a
 * few representative mutations."  That is the entire argument for
 * doing this instead of alanine scanning, in one sentence, from the
 * paper that first did it.
 *
 * THE HEATMAP IS SCHEMATIC and the slide says so.  It is drawn to show
 * HOW SUCH A MAP READS -- a dark column is a position that tolerates
 * nothing, a pale column is one that tolerates anything, a band across
 * the hydrophobic rows is a buried position that cares about chemistry
 * rather than identity -- and it carries no measured values.  Nobody
 * should read a number off it.  The two conserved tryptophans are real
 * though: a WW domain is named for them, and they are drawn as the two
 * columns that tolerate nothing, because that is what they are.
 *
 * Authored at 1480x600.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", BLUE = "#004373",
      MUTED = "#767676", RULE = "#e2e2e2";
const n2 = v => Math.round(v * 10) / 10;

/* amino acids grouped by chemistry, which is what makes the rows
   readable: a buried position shows a band, not a scatter */
const AA = [
  ["A", 0], ["V", 0], ["L", 0], ["I", 0], ["M", 0], ["F", 0], ["W", 0], ["C", 0],
  ["G", 1], ["P", 1],
  ["S", 2], ["T", 2], ["N", 2], ["Q", 2], ["Y", 2],
  ["D", 3], ["E", 3],
  ["K", 4], ["R", 4], ["H", 4]
];
const GROUP = ["hydrophobic", "special", "polar", "acidic", "basic"];

const NCOL = 34;
/* CH was 19 on the first pass, which put the map's bottom edge at 484 and
   left the callouts, the axis label and the color key all trying to live
   in the same 60 units.  At 17 the map ends at 436 and each gets a line. */
const HX = 566, HY = 96, CW = 24.5, CH = 17;

/* ---- the schematic map --------------------------------------------- *
 * Each column gets a character, and the character decides the column:
 *   "dead"  nothing is tolerated          (the conserved tryptophans)
 *   "core"  only hydrophobics are         (a buried position)
 *   "free"  everything is                 (a surface loop)
 *   "mild"  most things are, prolines not (ordinary structure)
 * ------------------------------------------------------------------ */
const W1 = 7, W2 = 20;              /* the two conserved tryptophans   */

function kindOf(col){
  if (col === W1 || col === W2) return "dead";
  if ([3, 10, 14, 24, 29].indexOf(col) >= 0) return "core";
  if ([1, 5, 12, 17, 22, 27, 32].indexOf(col) >= 0) return "free";
  return "mild";
}

function rng(seed){
  let s = seed >>> 0;
  return function(){ s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

/* score in [-1, 1]: -1 fully depleted, 0 neutral, +1 enriched */
const SCORE = (function(){
  const rand = rng(31031), m = [];
  for (let c = 0; c < NCOL; c++){
    const kind = kindOf(c), col = [];
    for (let r = 0; r < AA.length; r++){
      const hydrophobic = AA[r][1] === 0;
      const proline = AA[r][0] === "P";
      let v;
      if (kind === "dead")      v = -0.92 + rand() * 0.12;
      else if (kind === "core") v = hydrophobic ? -0.10 + rand() * 0.30
                                                : -0.78 + rand() * 0.30;
      else if (kind === "free") v = -0.12 + rand() * 0.42;
      else                      v = proline ? -0.70 + rand() * 0.25
                                            : -0.30 + rand() * 0.55;
      col.push(Math.max(-1, Math.min(1, v)));
    }
    m.push(col);
  }
  return m;
})();

/* the wild-type residue at each position, so it can be marked */
const WT = (function(){
  const rand = rng(7717), w = [];
  for (let c = 0; c < NCOL; c++){
    if (c === W1 || c === W2) { w.push(6); continue; }      /* W */
    w.push(Math.floor(rand() * AA.length));
  }
  return w;
})();

/* blue for depleted, paper for neutral, vermillion for enriched --
   the convention these maps are normally drawn in, in house colors */
function heat(v){
  const mix = (a, b, t) => a.map((x, i) => Math.round(x + (b[i] - x) * t));
  const paper = [255, 255, 255],
        cold  = [0, 67, 115],
        warm  = [186, 58, 19];
  const c = v < 0 ? mix(paper, cold, Math.min(1, -v))
                  : mix(paper, warm, Math.min(1, v));
  return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
}

function heatmap(){
  let s = "";
  for (let c = 0; c < NCOL; c++){
    for (let r = 0; r < AA.length; r++){
      s += '<rect x="' + n2(HX + c * CW) + '" y="' + n2(HY + r * CH) +
           '" width="' + n2(CW) + '" height="' + n2(CH) + '" fill="' +
           heat(SCORE[c][r]) + '"/>';
    }
  }
  /* the wild-type residue, marked the way these maps usually mark it */
  for (let c = 0; c < NCOL; c++){
    s += '<circle cx="' + n2(HX + c * CW + CW/2) + '" cy="' +
         n2(HY + WT[c] * CH + CH/2) + '" r="2.2" fill="#111111" opacity="0.5"/>';
  }
  s += '<rect x="' + HX + '" y="' + HY + '" width="' + n2(NCOL * CW) +
       '" height="' + n2(AA.length * CH) + '" fill="none" stroke="' + RULE +
       '" stroke-width="1.5"/>';

  /* amino-acid labels, and the chemistry brackets beside them */
  AA.forEach(function(a, r){
    s += '<text x="' + (HX - 12) + '" y="' + n2(HY + r * CH + CH/2 + 5) +
         '" text-anchor="end" font-family="inherit"' +
         ' font-size="14" fill="' + INK + '">' + a[0] + '</text>';
  });
  let start = 0;
  GROUP.forEach(function(g, gi){
    let end = start;
    while (end < AA.length && AA[end][1] === gi) end++;
    const y0 = HY + start * CH, y1 = HY + end * CH;
    s += '<path d="M ' + (HX - 34) + ' ' + y0 + ' L ' + (HX - 40) + ' ' + y0 +
         ' L ' + (HX - 40) + ' ' + y1 + ' L ' + (HX - 34) + ' ' + y1 +
         '" fill="none" stroke="' + MUTED + '" stroke-width="1.5"/>';
    /* only the groups tall enough to hold their own name get one; at two
       rows the rotated word is longer than its bracket and collides with
       the next group's */
    if (end - start >= 4)
      s += '<text transform="translate(' + (HX - 48) + ',' + ((y0 + y1) / 2) +
           ') rotate(-90)" text-anchor="middle" font-family="inherit" ' +
           'font-size="13" fill="' + MUTED + '">' + g + '</text>';
    start = end;
  });

  s += '<text x="' + (HX + NCOL * CW / 2) + '" y="' +
       n2(HY + AA.length * CH + 70) + '" text-anchor="middle" ' +
       'font-family="inherit" font-size="20" fill="' + INK +
       '">position along the domain &#8594;</text>';
  return s;
}

/* ---- the annotations that teach you to read it --------------------- */
function callouts(){
  let s = "";
  const bottom = HY + AA.length * CH;

  function tag(col, span, text, up){
    const x = HX + (col + span/2) * CW;
    const y = up ? HY - 16 : bottom + 38;
    s += '<rect x="' + n2(HX + col * CW) + '" y="' + (HY - 3) + '" width="' +
         n2(span * CW) + '" height="' + n2(AA.length * CH + 6) +
         '" fill="none" stroke="' + VERM + '" stroke-width="2.5"/>';
    s += '<text x="' + n2(x) + '" y="' + y + '" text-anchor="middle" ' +
         'font-family="inherit" font-size="17" font-weight="700" fill="' +
         VERM + '">' + text + '</text>';
    s += '<line x1="' + n2(x) + '" y1="' + (up ? y + 7 : y - 14) + '" x2="' +
         n2(x) + '" y2="' + (up ? HY - 4 : bottom + 6) + '" stroke="' + VERM +
         '" stroke-width="1.5" opacity="0.6"/>';
  }
  /* one short tag each, not one sentence split across two columns: split,
     it read as two unrelated labels */
  tag(W1, 1, "conserved W", true);
  tag(W2, 1, "conserved W", true);
  tag(3, 1, "buried: hydrophobics only", false);
  tag(12, 1, "surface: anything goes", false);
  ["every position has its own pattern.",
   "A few representative mutations",
   "would have missed all of this."].forEach(function(t, i){
    s += '<text x="30" y="' + (486 + i * 26) + '" font-family="inherit" ' +
         'font-size="20"' + (i === 0 ? ' font-weight="700"' : '') +
         ' fill="' + (i === 0 ? INK : MUTED) + '">' + t + '</text>';
  });
  return s;
}

/* ---- the pipeline down the left ------------------------------------ */
function pipeline(upTo){
  const stages = [
    ["every substitution", "at every position, one at a time"],
    ["one pool", "all of them together, in one tube"],
    ["select", "bind, or grow, or display &#8212; any assay"],
    ["sequence, twice", "the pool before and the pool after"],
    ["score each variant", "how much it was enriched or lost"]
  ];
  let s = "";
  const X = 30, Y0 = 112, DY = 78;
  stages.forEach(function(t, i){
    if (i > upTo) return;
    const y = Y0 + i * DY;
    s += '<circle cx="' + (X + 15) + '" cy="' + (y - 7) + '" r="15" fill="' +
         (i === 4 ? VERM : BLUE) + '"/>';
    s += '<text x="' + (X + 15) + '" y="' + (y - 1) + '" text-anchor="middle" ' +
         'font-family="inherit" font-size="16" font-weight="700" ' +
         'fill="#ffffff">' + (i + 1) + '</text>';
    s += '<text x="' + (X + 42) + '" y="' + y + '" font-family="inherit" ' +
         'font-size="22" font-weight="700" fill="' + INK + '">' + t[0] + '</text>';
    s += '<text x="' + (X + 42) + '" y="' + (y + 24) + '" font-family="inherit" ' +
         'font-size="17" fill="' + MUTED + '">' + t[1] + '</text>';
    if (i > 0)
      s += '<line x1="' + (X + 15) + '" y1="' + (y - DY + 10) + '" x2="' +
           (X + 15) + '" y2="' + (y - 24) + '" stroke="' + RULE +
           '" stroke-width="3"/>';
  });
  return s;
}

/* ---- the color key ------------------------------------------------ */
function key(){
  const X = 566, Y = 530, W = 190;
  let s = "";
  for (let i = 0; i <= 40; i++){
    s += '<rect x="' + n2(X + i * (W/41)) + '" y="' + Y + '" width="' +
         n2(W/41 + 0.6) + '" height="16" fill="' + heat(-1 + i / 20) + '"/>';
  }
  s += '<rect x="' + X + '" y="' + Y + '" width="' + W + '" height="16" ' +
       'fill="none" stroke="' + RULE + '" stroke-width="1"/>';
  s += '<text x="' + (X - 10) + '" y="' + (Y + 13) + '" text-anchor="end" ' +
       'font-family="inherit" font-size="16" fill="' + MUTED + '">lost</text>';
  s += '<text x="' + (X + W + 10) + '" y="' + (Y + 13) + '" font-family="inherit" ' +
       'font-size="16" fill="' + MUTED + '">enriched</text>';
  s += '<text x="1450" y="' + (Y + 48) + '" text-anchor="end" ' +
       'font-family="inherit" font-size="16" fill="' + MUTED +
       /* the attribution is already on the slide, in p.sub ("Fowler et al.
          2010"); a figure does not repeat what the slide already says */
       '">map schematic &#183; drawn to show how one reads, ' +
       'not measured data</text>';
  return s;
}

function figure(){
  let s = "";
  s += '<g data-r="p0">' + pipeline(1) + '</g>';
  s += '<g data-r="p1" opacity="0">' + pipeline(4) + '</g>';
  s += '<g data-r="map" opacity="0">' + heatmap() + key() + '</g>';
  s += '<g data-r="read" opacity="0">' + callouts() + '</g>';
  return '<svg viewBox="0 0 1480 600" xmlns="http://www.w3.org/2000/svg" ' +
    'role="img" aria-label="Deep mutational scanning. Down the left, a five ' +
    'step pipeline: make every substitution at every position, pool them, ' +
    'select, sequence the pool before and after, and score each variant by ' +
    'how much it was enriched or lost. On the right, the result drawn as a ' +
    'heat map with the twenty amino acids down the side, grouped by ' +
    'chemistry, and position along the domain across the bottom. Blue cells ' +
    'are substitutions that were lost, white are neutral, red are enriched. ' +
    'Two columns are entirely blue: the conserved tryptophans a WW domain is ' +
    'named for, where nothing substitutes. Another column is blue except ' +
    'across the hydrophobic rows, a buried position that accepts only ' +
    'hydrophobics. Another is pale all the way down, a surface position that ' +
    'accepts anything. The map is schematic and carries no measured values.">' +
    s + '</svg>';
}

const steps = [
  {
    add:"The phage display experiment was Fowler, 2010, and it deserves its proper name, because it started a method. It is called deep mutational scanning. The idea is this. Instead of picking a handful of mutations you think matter and making them one at a time, you make every substitution at every position in the domain, and you put them all in one tube.",
    desc:"The first two steps of the pipeline: make every substitution at every position, and pool them." },
  {
    add:"Then you do an assay that sorts the good from the bad — for Fowler that was phage display selecting for binding to the WW domain's peptide ligand, but it can be growth, or fluorescence, or anything you can select on. And here is the multiplexing move, which by now should be familiar: you sequence the pool before the selection and after it. A variant that got rarer was a bad variant. The change in frequency is that variant's score, and you get one for every member at once. Fowler tracked over six hundred thousand variants that way.",
    desc:"The remaining three steps: select, sequence the pool before and after, and score each variant by its change in frequency." },
  {
    add:"What comes out is not a list, it is a matrix — a score for every amino acid at every position. Position runs across the bottom, the twenty amino acids run down the side, and I have grouped them by chemistry rather than alphabetically, because that is what makes this thing readable. Blue means that substitution was lost, red means it was enriched, and white means the protein did not much care.",
    desc:"The heat map appears: positions across, the twenty amino acids down the side grouped by chemistry, colored by score." },
  {
    add:"And now look at what you can read straight off it. These two columns are solid blue — nothing substitutes there at all. Those are the two tryptophans a WW domain is literally named after. This column is blue everywhere except across the hydrophobic rows: that is a buried position, and it does not care which hydrophobic you give it as long as you give it one. And this one is pale all the way down — a surface position that will take anything. That is three completely different kinds of constraint, and Fowler's own sentence about it is the one I would have you remember: each position had unique features that could not be captured by a few representative mutations. That is the argument for doing this instead of alanine scanning, from the paper that first did it.",
    desc:"Four positions are picked out: the two conserved tryptophans where nothing substitutes, a buried position that takes only hydrophobics, and a surface position that takes anything." }
];

window.Deck.sequence("dms", function(slide){
  const host = slide.querySelector("[data-dms]");
  if (!host) return { steps: steps.map(x => ({note:x.add, desc:x.desc})), go: function(){} };
  host.innerHTML = figure();
  const svg = host.querySelector("svg"), r = {};
  svg.querySelectorAll("[data-r]").forEach(e => r[e.getAttribute("data-r")] = e);

  function go(i){
    const set = (k, on) => r[k] && r[k].setAttribute("opacity", on ? "1" : "0");
    set("p0", i < 1);
    set("p1", i >= 1);
    set("map", i >= 2);
    set("read", i >= 3);
  }
  go(0);

  return { steps: steps.map(x => ({ note: x.add, desc: x.desc })), go: go };
});

})();
