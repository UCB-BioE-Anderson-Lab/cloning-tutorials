/* ------------------------------------------------------------------ *
 * 31b-avgfp.js : what happens when you stack mutations in a part.
 * Fills  [data-fig="avgfp"]
 *
 * WHY THIS EXISTS.  An added slide, in the slot where the BRCA1
 * saturation-editing slide used to be.  JCA on that one: "This slide
 * is crap.  Unpresentable.  Too many numbers.  Too many clicks.  And
 * it isn't even a synthetic biology relevant example."  This is the
 * replacement he picked: deep mutational scanning on the one protein
 * everybody in the room has already used.
 *
 * THE PAPER.  Sarkisyan KS, Bolotin DA, Meer MV, et al., Kondrashov
 * FA, "Local fitness landscape of the green fluorescent protein",
 * Nature 533:397-401, 2016.  PMID 27193686.  Abstract read directly
 * from PubMed; the full text is not open, so NOTHING here goes beyond
 * what the abstract states.
 *
 * EVERY NUMBER, WITH ITS SENTENCE.
 *
 *   tens of thousands of genotypes
 *     "measuring the native function (fluorescence) of tens of
 *      thousands of derivative genotypes of avGFP".
 *   3 of 4, dimmer -- NOT dark
 *     "3/4 of the derivatives with a single mutation showing reduced
 *      fluorescence".  Reduced, so the bar says dimmer and the figure
 *      never calls these dead.
 *   1 of 2, completely dark
 *     "half of the derivatives with four mutations being completely
 *      non-fluorescent".
 *   up to 30%
 *     "epistasis, which was detected in up to 30% of genotypes with
 *      multiple mutations".
 *   the mechanism
 *     "mostly occurred through the cumulative effect of slightly
 *      deleterious mutations causing a threshold-like decrease in
 *      protein stability and a concomitant loss of fluorescence".
 *
 * THE TWO BARS MEASURE DIFFERENT THINGS AND MUST SAY SO.  "Dimmer"
 * at one mutation and "completely dark" at four are not points on one
 * curve, and drawing them as one curve would be inventing the three
 * values in between.  So they are two bars, each labelled with its
 * own words.  There is no fraction-versus-number-of-mutations curve
 * on this figure for exactly that reason.
 *
 * THE STAIRCASE IS A MECHANISM, NOT A MEASUREMENT.  It is one
 * genotype losing a little stability per mutation and crossing a
 * threshold, which is the abstract's own explanation drawn as what it
 * is.  It carries no axis values and is labelled schematic.
 *
 * COLOR.  Vermillion is the loss -- the dark fraction, the threshold,
 * the word dark -- and it is the only promoted hue.  Everything else
 * is ink, muted or rule.  No hex appears here that is not in
 * palette.css.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK   = "#111111";
const VERM  = "#ba3a13";
const MUTED = "#767676";
const RULE  = "#e2e2e2";
const PAPER = "#ffffff";

const W = 1480, H = 560;

function esc(s){
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;");
}

function text(x, y, s, size, fill, anchor, weight){
  return '<text x="' + x + '" y="' + y + '" font-family="inherit"' +
         ' font-size="' + size + '" fill="' + fill + '"' +
         (anchor ? ' text-anchor="' + anchor + '"' : "") +
         (weight ? ' font-weight="' + weight + '"' : "") +
         '>' + esc(s) + '</text>';
}

function rect(x, y, w, h, fill, stroke, sw){
  return '<rect x="' + x + '" y="' + y + '" width="' + w +
         '" height="' + h + '" fill="' + fill + '"' +
         (stroke ? ' stroke="' + stroke + '" stroke-width="' +
                   (sw || 1.5) + '"' : "") + '/>';
}

function line(x1, y1, x2, y2, stroke, sw, dash){
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 +
         '" y2="' + y2 + '" stroke="' + stroke +
         '" stroke-width="' + (sw || 1.6) + '"' +
         (dash ? ' stroke-dasharray="' + dash + '"' : "") + '/>';
}

/* ---- left: what one mutation costs, and what four cost ------------- */
const BX = 40, BW = 620, BH = 50;

function bar(y, head, frac, inside){
  let s = text(BX, y - 15, head, 24, INK, null, 700);
  s += rect(BX, y, BW * frac, BH, VERM);
  s += rect(BX + BW * frac, y, BW * (1 - frac), BH, RULE);
  s += rect(BX, y, BW, BH, "none", INK, 1.5);
  s += text(BX + BW * frac / 2, y + BH / 2 + 8, inside, 22, PAPER, "middle");
  return s;
}

function left(){
  let s = text(BX, 60, "what the mutations cost", 24, INK, null, 700);
  s += bar(155, "one mutation",   0.75, "3 of 4 are dimmer than avGFP");
  s += bar(290, "four mutations", 0.50, "1 of 2 are completely dark");
  s += text(BX, 400,
       "tens of thousands of genotypes, fluorescence read by sorting "
     + "and sequencing", 19, MUTED);
  return s;
}

/* ---- right: why four is worse than four times one ------------------ */
function right(){
  const X0 = 860, DX = 115, Y0 = 150, DY = 50, THR = 320;
  let s = text(780, 60, "why four is worse than four times one",
               24, INK, null, 700);

  s += '<text transform="translate(812,262) rotate(-90)" '
     + 'text-anchor="middle" font-family="inherit" font-size="20" fill="'
     + MUTED + '">folding stability</text>';

  /* one genotype, losing a little per mutation, crossing the line */
  let d = "M " + X0 + " " + Y0;
  for (let i = 0; i < 4; i++){
    d += " L " + (X0 + (i + 1) * DX) + " " + (Y0 + i * DY);
    d += " L " + (X0 + (i + 1) * DX) + " " + (Y0 + (i + 1) * DY);
  }
  s += '<path d="' + d + '" fill="none" stroke="' + INK +
       '" stroke-width="3" stroke-linejoin="round"/>';

  s += line(840, THR, 1420, THR, VERM, 2.2, "7 6");
  /* the label goes at the LEFT end: the staircase lands on the right end
     of this line, and the two collided there */
  s += text(845, THR - 12, "folding threshold", 19, VERM);
  s += text(1420, 206, "fluorescent", 19, MUTED, "end");
  s += text(1420, THR + 52, "dark", 24, VERM, "end", 700);

  s += text(X0 + 2 * DX, 400, "mutations added, one at a time",
            19, MUTED, "middle");
  s += text(780, 452,
       "each costs a little stability, and the protein does not care "
     + "until the total crosses", 20, INK);
  s += text(780, 480,
       "the threshold; then it stops folding and the fluorescence goes "
     + "off a cliff", 20, INK);
  s += text(780, 516,
       "epistasis like this in up to 30% of the multiple mutants "
     + "· stability panel schematic", 18, MUTED);
  return s;
}

function draw(){
  return left()
       + line(740, 100, 740, 500, RULE, 2)
       + right();
}

const ALT = "What stacking mutations costs in avGFP. On the left, two "
  + "proportion bars. For one mutation, three quarters of the bar is "
  + "filled and labeled three of four are dimmer than avGFP. For four "
  + "mutations, half is filled and labeled one of two are completely "
  + "dark. Beneath them: tens of thousands of genotypes, fluorescence "
  + "read by sorting and sequencing. On the right, headed why four is "
  + "worse than four times one, a staircase descends one step per "
  + "mutation against an axis of folding stability and crosses a "
  + "dashed threshold line at the fourth step, below which the region "
  + "is labeled dark. Each mutation costs a little stability, and the "
  + "protein does not care until the total crosses the threshold; "
  + "then it stops folding and the fluorescence goes off a cliff. "
  + "Epistasis like this appears in up to thirty percent of the "
  + "multiple mutants. The stability panel is schematic.";

function fill(){
  const el = document.querySelector('[data-fig="avgfp"]');
  if (!el) return;
  el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" '
    + 'xmlns="http://www.w3.org/2000/svg" role="img" '
    + 'aria-label="' + ALT.replace(/"/g, "&quot;") + '">' + draw()
    + '</svg>';
}
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
