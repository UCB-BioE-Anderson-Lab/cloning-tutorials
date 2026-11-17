/* ------------------------------------------------------------------ *
 * 36c-expected.js : what the Kosuri library says about composing
 * parts.  Fills  [data-fig="expected"]
 *
 * WHY THIS EXISTS.  An added slide, as 36b-compose.js is; see that
 * file's header for the paper and how it was read.  This one carries
 * the result, and the result is the reason the paper is in a
 * synthetic biology lecture at all.
 *
 * EVERY NUMBER, WITH ITS SENTENCE FROM THE PAPER.
 *
 *   the model
 *     "Using a simple model for gene expression, where promoter
 *      strengths determine RNA levels and RBS strengths determine
 *      translation efficiencies, we reconstructed expected expression
 *      across all constructs and compared them with measurements".
 *   where the strengths came from -- and this is the point of the
 *   subtitle, because it is what makes the test generous:
 *     "We calculated average promoter and RBS strengths by averaging
 *      transcription levels and translation efficiency
 *      (protein/RNA), respectively".  Each element's strength is its
 *      own average across the whole library, so the model is fitted
 *      on the very data it is asked to predict.
 *   80% / 64% / R2 0.92 / R2 0.76
 *     "We find that 80% of RNA levels and 64% of protein levels fall
 *      within twofold of the model predictions, and had R2 = 0.92 and
 *      R2 = 0.76 for RNA and protein, respectively".
 *   the worst 5%, 13-fold
 *     "the largest 5% of protein model deviations are off by an
 *      average of 13-fold".
 *
 * WHY TWO PROPORTION BARS AND NOT A DISTRIBUTION.  The honest shape
 * of those deviations is in the paper's Fig. 4 and we do not have it.
 * Drawing a histogram would mean inventing the shape to carry two
 * numbers we actually know, which FIGURE-CONTRACT.md s6 forbids.  A
 * bar split at 80% states 80% and nothing more.  Because the bar is
 * ordered best-to-worst, the rightmost sliver IS the worst 5%, so the
 * tail callout sits where it belongs instead of being a second
 * picture.
 *
 * COLOR.  Blue is "the model got it", rule-gray is "it did not",
 * vermillion is reserved for the one thing the slide wants you to
 * leave with, which is the size of the tail.  Nothing else is
 * promoted.  No hex appears here that is not in palette.css.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK   = "#111111";
const BLUE  = "#004373";
const VERM  = "#ba3a13";
const MUTED = "#767676";
const RULE  = "#e2e2e2";
const PAPER = "#ffffff";

const W = 1480, H = 560;

const BX = 300, BW = 940, BH = 58;

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

function line(x1, y1, x2, y2, stroke, sw){
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 +
         '" y2="' + y2 + '" stroke="' + stroke +
         '" stroke-width="' + (sw || 1.6) + '"/>';
}

/* one proportion bar: what the model got, and what it did not */
function bar(y, label, r2, frac, pct){
  const cut = BX + BW * frac;
  let s = "";
  s += text(40, y + 36, label, 28, INK, null, 700);
  s += text(40, y + 64, "R² = " + r2, 19, MUTED);

  s += rect(BX, y, BW * frac, BH, BLUE);
  s += rect(cut, y, BW * (1 - frac), BH, RULE);
  s += rect(BX, y, BW, BH, "none", INK, 1.5);

  s += text(BX + BW * frac / 2, y + BH / 2 + 9,
            pct + "% within twofold of prediction", 26, PAPER, "middle");
  s += text(cut + BW * (1 - frac) / 2, y + BH + 26,
            (100 - pct) + "% further off", 19, MUTED, "middle");
  return s;
}

function tail(){
  /* the bar runs best to worst, so the worst 5% is its last 5% */
  const y = 320;
  const x0 = BX + BW * 0.95, x1 = BX + BW, mid = (x0 + x1) / 2;
  let s = "";
  s += line(x0, y + BH + 46, x1, y + BH + 46, VERM, 2.5);
  s += line(x0, y + BH + 46, x0, y + BH + 36, VERM, 2.5);
  s += line(x1, y + BH + 46, x1, y + BH + 36, VERM, 2.5);
  s += line(mid, y + BH + 46, mid, y + BH + 72, VERM, 1.6);
  s += text(mid, y + BH + 98,
            "the worst 5% miss by 13-fold on average", 24, VERM, "middle");
  return s;
}

function draw(){
  let s = "";
  s += text(40, 56,
       "the model: each promoter's own average strength, times each "
     + "RBS's own average strength", 26, INK, null, 700);
  s += text(40, 92,
       "both averaged over this same library — the most generous "
     + "test of composing them there is", 21, MUTED);

  s += bar(170, "RNA",     "0.92", 0.80, 80);
  s += bar(320, "protein", "0.76", 0.64, 64);
  s += tail();
  return s;
}

const ALT = "How well promoter and ribosome binding site strengths "
  + "predict expression when combined. The model takes each "
  + "promoter's own average strength times each ribosome binding "
  + "site's own average strength, both averaged over this same "
  + "library, which makes it the most generous test of composing them "
  + "there is. Two proportion bars run across the figure. For RNA, "
  + "R squared 0.92, eighty percent of the bar is filled to mark "
  + "eighty percent within twofold of prediction, and twenty percent "
  + "is further off. For protein, R squared 0.76, sixty-four percent "
  + "is within twofold and thirty-six percent further off. The bars "
  + "run best to worst, and a bracket under the last five percent of "
  + "the protein bar is labeled: the worst five percent miss by "
  + "thirteen-fold on average.";

function fill(){
  const el = document.querySelector('[data-fig="expected"]');
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
