/* ------------------------------------------------------------------ *
 * 06-eipcr.js : EIPCR mutagenesis — the figure of source slides 45-46.
 *
 * Registers:  eipcr-a   the design, the PCR, the digest      (3 steps)
 *             eipcr-b   the same figure, held               (1 step)
 *
 * In the source these are two slides carrying the IDENTICAL figure; the
 * only thing that changes between them is the sequence block underneath,
 * which goes from the two ends of the PCR product to the one joined
 * mutant product.  They are one animation that ran out of slide.  So the
 * figure is built once here and drawn into both, at the same coordinates,
 * so that nothing moves when the deck steps from one to the other — which
 * is the whole point of the pair.
 *
 * The sequence blocks are NOT drawn here.  They are pre.dna in the slide
 * markup, so they set in the same letter idiom as the rest of the
 * section, and this file only turns them on: [data-part="n"] appears at
 * step n.
 *
 * Level of iconography: SHAPES.  A line is a strand; a half barb marks a
 * 3' end (never an arrowhead — an arrowhead here would be a process
 * arrow, and two of those are on the slide already).
 *
 * COLOUR.  One assignment, held across the whole Golden Gate section:
 *     blue        the BsaI recognition site — the mechanism
 *     vermillion  the 4 bp junction — what Golden Gate is about
 *     ink + label the point mutation
 * The mutation gets ink and a written label rather than the third colour
 * rung.  Amber and vermillion differ only in lightness under red-green
 * CVD, and here the junction and the mutation sit inside the same line of
 * sequence, which is exactly the pairing style/palette.css warns off.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", RED = "#ba3a13", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";
const n2 = v => Math.round(v * 10) / 10;

/* a strand: plain line, half barb at the 3' end */
const BARB = 22, BW = 0.49;
function strand(x1, y1, x2, y2){
  const th = Math.atan2(y1 - y2, x1 - x2);
  return "M" + n2(x1) + " " + n2(y1) + "L" + n2(x2) + " " + n2(y2) +
         "M" + n2(x2 + BARB*Math.cos(th + BW)) + " " + n2(y2 + BARB*Math.sin(th + BW)) +
         "L" + n2(x2) + " " + n2(y2);
}
/* a process arrow — "PCR", "digest" — is not a molecule, so it takes a
   full head and cannot be mistaken for a 3' end */
function arrow(x1, y1, x2, y2){
  const th = Math.atan2(y1 - y2, x1 - x2), H = 17, W = 0.42;
  return "M" + n2(x1) + " " + n2(y1) + "L" + n2(x2) + " " + n2(y2) +
         "M" + n2(x2 + H*Math.cos(th + W)) + " " + n2(y2 + H*Math.sin(th + W)) +
         "L" + n2(x2) + " " + n2(y2) +
         "L" + n2(x2 + H*Math.cos(th - W)) + " " + n2(y2 + H*Math.sin(th - W));
}
function cross(x, y, r){
  return "M" + (x-r) + " " + (y-r) + "L" + (x+r) + " " + (y+r) +
         "M" + (x+r) + " " + (y-r) + "L" + (x-r) + " " + (y+r);
}
function label(x, y, size, fill, str, weight, anchor){
  return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + fill +
    '"' + (weight ? ' font-weight="' + weight + '"' : "") +
    ' text-anchor="' + (anchor || "middle") + '">' + str + "</text>";
}

/* ---- geometry -----------------------------------------------------
   The figure lives between y=164 (under an h1.small) and y=566 (above
   the sequence block).  Both slides reserve the same 424px spacer, so
   these numbers are the contract with the markup. */
const FY = 196, RY = 258;                 /* the two design oligos       */
const CX = 250, CY = 406, CR = 94;        /* the template plasmid        */
const DX0 = 560, DX1 = 1500;              /* the PCR product             */
const DT = 390, DB = 422;                 /* its two strands             */
const TL = 584, TR = 1476;                /* where the two BsaI sites are*/

const MARKUP =
'<g font-family="Helvetica Neue,Arial,Helvetica,sans-serif">' +

  /* ---- the two oligos, back to back, polymerising outward ---- */
  '<g data-r="oligos">' +
    '<g fill="none" stroke="' + INK + '" stroke-width="3.4" stroke-linecap="round">' +
      '<path d="' + strand(352, FY, 680, FY) + '"/>' +
      '<path d="' + strand(372, RY, 120, RY) + '"/>' +
    '</g>' +
    '<g fill="none" stroke="' + BLUE + '" stroke-width="3.4" stroke-linecap="round">' +
      '<path d="M372 ' + FY + 'L372 ' + (FY - 30) + '"/>' +
      '<path d="M352 ' + RY + 'L352 ' + (RY + 30) + '"/>' +
    '</g>' +
    label(372, FY - 42, 25, BLUE, "BsaI", 700) +
    label(352, RY + 58, 25, BLUE, "BsaI", 700) +
    '<path d="' + cross(460, FY, 12) + '" stroke="' + INK +
      '" stroke-width="5.5" fill="none" stroke-linecap="round"/>' +
    label(460, FY - 30, 24, INK, "mutation") +
  '</g>' +

  /* ---- the template, and the PCR ---- */
  '<g data-r="circle">' +
    '<circle cx="' + CX + '" cy="' + CY + '" r="' + CR + '" fill="none" stroke="' +
      INK + '" stroke-width="3.4"/>' +
    label(CX, CY + CR + 36, 24, MUTED, "template plasmid") +
  '</g>' +

  '<g data-r="pcr" opacity="0">' +
    '<path d="' + arrow(390, CY, 506, CY) + '" fill="none" stroke="' + INK +
      '" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    label(448, CY - 28, 27, INK, "PCR") +
  '</g>' +

  /* ---- the linear PCR product ---- */
  '<g data-r="dup" opacity="0">' +
    '<g fill="none" stroke="' + INK + '" stroke-width="3.4" stroke-linecap="round">' +
      '<path d="M' + DX0 + " " + DT + "H" + DX1 + '"/>' +
      '<path d="M' + DX0 + " " + DB + "H" + DX1 + '"/>' +
    '</g>' +
    '<rect x="606" y="' + DT + '" width="30" height="' + (DB - DT) + '" fill="' + RED + '"/>' +
    '<rect x="1424" y="' + DT + '" width="30" height="' + (DB - DT) + '" fill="' + RED + '"/>' +
    '<g fill="none" stroke="' + BLUE + '" stroke-width="3.4" stroke-linecap="round">' +
      '<path d="M' + TL + " " + DT + "L" + TL + " " + (DT - 30) + '"/>' +
      '<path d="M' + TR + " " + DT + "L" + TR + " " + (DT - 30) + '"/>' +
    '</g>' +
    label(TL, DT - 42, 25, BLUE, "BsaI", 700) +
    label(TR, DT - 42, 25, BLUE, "BsaI", 700) +
    '<path d="' + cross(700, (DT + DB)/2, 13) + '" stroke="' + INK +
      '" stroke-width="5.5" fill="none" stroke-linecap="round"/>' +
    label(700, DT - 42, 24, INK, "mutation") +
    label(1035, DB + 40, 24, MUTED, "the two red blocks are the same 4 bp overhang") +
  '</g>' +

  /* ---- and what you do with it ---- */
  '<g data-r="ligate" opacity="0">' +
    label(620, 500, 28, INK, "BsaI digest", 0, "start") +
    label(620, 536, 28, INK, "ligate and transform", 0, "start") +
    '<path d="' + arrow(1160, 474, 1160, 540) + '" fill="none" stroke="' + INK +
      '" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    label(1160, 578, 28, INK, "Mutant Product Vector", 700) +
  '</g>' +

'</g>';

function build(slide){
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");
  svg.innerHTML = MARKUP;
  slide.appendChild(svg);
  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);
  return r;
}

/* Groups are keyed by the step they arrive on; -1 means "always". */
const ON = { oligos:-1, circle:-1, pcr:1, dup:1, ligate:2 };

function painter(slide, floor){
  const r = build(slide);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const parts = Array.from(slide.querySelectorAll("[data-part]"));
  return function(i, animated){
    const at = Math.max(i, floor);            /* eipcr-b holds the end state */
    const soft = animated !== false && !reduce.matches;
    Object.keys(ON).forEach(function(k){
      const el = r[k];
      el.style.transition = soft ? "opacity .34s ease" : "none";
      el.style.opacity = at >= ON[k] ? "1" : "0";
    });
    parts.forEach(function(el){
      const g = parseInt(el.getAttribute("data-part"), 10) || 0;
      el.style.transition = soft ? "opacity .34s ease" : "none";
      el.style.opacity = at >= g ? "1" : "0";
    });
  };
}

/* The narration is the source deck's own note for slide 45, split at the
   three asterisks the author left in it to mark the animation beats.  The
   fourth beat is the whole of slide 46. */
const A = [
{ note:"EIPCR stands for enzymatic inverse PCR. The term ‘inverse PCR’ refers to the fact that you are going to PCR around the backbone of the template DNA. You design two oligos that both anneal near the site of mutation, but are oriented such that polymerization occurs away from one another around the circle.",
  desc:"Two oligos drawn back to back near the top of the slide, their 5-prime ends meeting in the middle and their 3-prime half barbs pointing away from each other, so a polymerase would run outward in both directions. A blue tick on each marks a BsaI site carried in its 5-prime tail, and a heavy cross on the upper oligo is labelled mutation. Below, a bare circle labelled template plasmid." },

{ note:"This results in a linear double-stranded PCR product like any other PCR. If a restriction site is included in the 5’ ends of the oligos, then the PCR product will contain this site on its ends.",
  desc:"An arrow labelled PCR runs from the circle to a long linear double-stranded product. A blue BsaI tick stands at each end of it, and just inside each tick a red block marks the four base pair overhang the enzyme will leave. The cross marking the mutation sits a short way in from the left end. Underneath, the two ends of the product written out as letters: the BsaI sites in blue at the outside, the shared TTAG junction in red, and the three mutated bases in the second block." },

{ note:"Cleavage with the restriction enzyme generates sticky ends which can be joined by T4 ligase to re-close the circle. That material is then transformed. EIPCR can be done with conventional type II enzymes like EcoRI, and the resulting product will contain that restriction site.",
  desc:"The words BsaI digest, ligate and transform appear under the linear product, with an arrow down to the name of the result: Mutant Product Vector." }
];

const B = [
{ note:"Alternatively, it can be done with a type IIs enzyme like BsaI. Because BsaI will cut itself off the ends of the PCR product, it will be absent in the final product. Thus, ‘scarless’ mutagenesis can be performed. EIPCR turns out to be an exceptional method of saturation mutagenesis for construction of libraries, which we’ll revisit in a later lecture on combinatorial libraries.",
  desc:"The same figure, unchanged. The sequence beneath it has been replaced by the closed product: one continuous duplex in which the two ends have joined through the TTAG junction, carrying the three mutated bases. There is no BsaI site anywhere in it — nothing is blue — so the mutation has been made without leaving a scar." }
];

window.Deck.sequence("eipcr-a", function(slide){
  const paint = painter(slide, -1);
  paint(0, false);
  return { steps: A, go: paint };
});

window.Deck.sequence("eipcr-b", function(slide){
  const paint = painter(slide, 2);         /* everything, from the first frame */
  paint(0, false);
  return { steps: B, go: paint };
});

})();
