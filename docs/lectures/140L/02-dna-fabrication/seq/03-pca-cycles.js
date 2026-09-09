/* ------------------------------------------------------------------ *
 * 03-pca-cycles.js : PCA as a series of cycles — the whole reaction.
 *
 * Registers:  gs-pca-cycles   target, pool, four extend rounds, PCR
 *                             amplify                        (8 steps)
 *
 * The slide before this one (seq/03-pca.js, "gs-pca") is ONE round of
 * the same reaction, seen close up: eight oligos, one extension, two
 * outer primers.  This slide is the series, and the argument it makes is
 * convergence — every round the pieces get longer and fewer, until one
 * full-length molecule is left and only then is a conventional PCR any
 * use.  So the two are the same reaction at two magnifications, and they
 * are drawn in the same language:
 *
 *     solid ink     ordered as an oligo
 *     dashed blue   made by the polymerase in the tube
 *     half barb     a 3' end.  Never an arrowhead; a full head is a
 *                   process arrow, and there are no process arrows here.
 *
 * The source is a seven-row figure (TRENDS in Biotechnology) read down
 * its own left-hand Operation column.  Where 03-pca.js redraws one set
 * of molecules that CHANGES, this one ACCUMULATES: a click adds a row
 * under the last one, because the convergence only exists as a shape if
 * the earlier rows are still on the slide to converge from.  Redrawing
 * in place here would just be the previous slide again with more clicks.
 *
 * GEOMETRY.  Sixteen oligos, each overlapping its neighbour by 0.4 of
 * its length, so the pool spans 10 oligo-lengths of target.  Pair them
 * and extend and the overlap is still 0.4, so the same pairing runs all
 * the way down:
 *
 *     16 oligos -> 8 pieces -> 4 -> 2 -> 1        lengths 1, 1.6, 2.8, 5.2, 10
 *
 * Four extend rounds, which is the source's count, and the number of
 * pieces halves exactly on each of them.  The source draws ten oligos
 * and its middle rounds do not halve cleanly; sixteen is the only pool
 * that both halves every round and lands on one molecule after the
 * fourth, which is what the figure is for.
 *
 * The thing worth watching is which part of a strand is solid.  A strand
 * is founded by ONE oligo and only ever grows at its 3' end, so the
 * solid run stays exactly one oligo long for the whole reaction while
 * the blue behind it doubles.  By the last row the construct is almost
 * entirely DNA that was made rather than bought, which is the reason to
 * do this at all.
 *
 * The five bullets are the slide's own, and a slide driven by a sequence
 * does not run its data-build steps (deck.js returns early), so this
 * file reveals them itself — the same arrangement t5cut.js uses.  Their
 * data-note and data-desc are read straight off the <li>, so the source
 * deck's narration stays next to the line it belongs to, and only the
 * description of the drawing is added here.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";
const n2 = v => Math.round(v*10)/10;

/* The drawing lives in the right-hand column of a .cols.wide-left, so it
   is boxed rather than spread over the slide: x 930-1484 is that column,
   and the stack runs from just under the subtitle to the bottom of the
   content box. */
const X0 = 930, X1 = 1484;
const L = (X1 - X0)/10;                  /* one oligo, in slide units   */
const OV = 0.4;                          /* overlap, in oligo lengths   */
const STEP = 1 - OV;                     /* so pool span = 10 exactly   */
const u = v => n2(X0 + v*L);             /* oligo lengths -> slide x    */

const SW = 2.6, DS = 12, BARB = 15, BW = 0.49;

function plain(x1, y1, x2, y2){
  return "M"+n2(x1)+" "+n2(y1)+"L"+n2(x2)+" "+n2(y2);
}
/* the half barb that marks the 3' end at (x2,y2).  It is kept apart from
   the line it belongs to because a polymerase-made run is dashed, and a
   dashed barb is not a barb — it is two disconnected ticks.  The barb
   marks an end; the dashes say who made the DNA. */
function barb(x1, y1, x2, y2){
  const th = Math.atan2(y1-y2, x1-x2);
  return "M"+n2(x2 + BARB*Math.cos(th + BW))+" "+n2(y2 + BARB*Math.sin(th + BW))+
         "L"+n2(x2)+" "+n2(y2);
}
function strand(x1, y1, x2, y2){
  return plain(x1, y1, x2, y2) + barb(x1, y1, x2, y2);
}

/* round r (1..4): how many pieces, how far apart they start, how long */
function round(r){
  const p = Math.pow(2, r-1);
  const count = 16/(2*p), step = 2*STEP*p;
  return { count: count, step: step, len: 10 - step*(count - 1) };
}

/* one double-stranded piece spanning [a, b] in oligo lengths.  Its top
   strand is founded by the forward oligo at its left end and its bottom
   strand by the reverse oligo at its right end, so one oligo length at
   each end is solid and everything between is polymerase. */
function piece(a, b, y){
  return { ink:  [plain(u(a), y, u(a+1), y),
                  plain(u(b), y+DS, u(b-1), y+DS)],
           blue: [plain(u(a+1), y, u(b), y),
                  plain(u(b-1), y+DS, u(a), y+DS)],
           tips: [barb(u(a+1), y, u(b), y),
                  barb(u(b-1), y+DS, u(a), y+DS)] };
}

/* a group of paths in one hand: solid ink is what was ordered, dashed
   blue is what the polymerase made */
function grp(paths, colour, dashed){
  if (!paths.length) return "";
  return '<g fill="none" stroke="' + colour + '" stroke-width="' + SW + '" ' +
         'stroke-linecap="round"' + (dashed ? ' stroke-dasharray="6 5.5"' : '') + '>' +
         paths.map(d => '<path d="' + d + '"/>').join("") + '</g>';
}

/* ---- the seven bands, top to bottom ---------------------------------
   label baseline, then the rows of molecules under it.  Pieces that
   overlap cannot share a row or they would read as one molecule, so
   every round alternates between two rows, as the source does. */
const BAND = [
  { label:"Target sequence",               ly:277, rows:[293] },
  { label:"Oligo pool",                    ly:324, rows:[340, 355] },
  { label:"Anneal / Extend",               ly:386, rows:[402, 439] },
  { label:"Denature and anneal / Extend",  ly:483, rows:[499, 536] },
  { label:"Denature and anneal / Extend",  ly:580, rows:[596, 633] },
  { label:"Denature and anneal / Extend",  ly:677, rows:[693], note:"Desired construct" },
  { label:"PCR amplify",                   ly:737, rows:[769] }
];
const YPF = 753, YPR = 798;              /* the two outer primers        */
/* the lowest ink in each band, so the key can sit under the drawing as
   it stands rather than at a fixed bottom the figure has not reached */
const FOOT = [293, 355, 451, 548, 645, 705, 798];

/* step -> how many bands are on the slide, and which bullet arrives */
const BANDS  = [1, 2, 3, 4, 5, 6, 7, 7];
const BULLET = [-1, 0, 1, 2, -1, -1, 3, 4];

/* what the drawing does on each step.  Step 0 has none: the slide's own
   desc covers the opening state. */
const FIG = [
  null,
  "Under it the oligo pool arrives: sixteen short solid lines tiling the same span in two staggered rows, each overlapping its neighbours by about half. The forward ones carry a half barb at their right-hand 3-prime end, the reverse ones at the left.",
  "Anneal and extend: the sixteen oligos are now eight double-stranded pieces, half again as long, on two offset rows. In each one the ordered oligo is still solid at the end it started from and the DNA the polymerase added runs on from its 3-prime end as a dashed blue line.",
  "Denature and anneal, extend: the eight pieces have become four, longer again. The solid ordered run at each end of a piece is the same one-oligo length it always was; every bit of the new length is dashed blue.",
  "Denature and anneal, extend: four pieces have become two, each now most of the target, and the two overlap in the middle.",
  "Denature and anneal, extend: the last two have become one full-length double-stranded molecule spanning the whole target, marked Desired construct. Each strand is one short solid oligo followed by a long dashed blue run.",
  "PCR amplify: the full-length molecule again, with two short solid outer primers drawn against its ends, one above the left end pointing right and one below the right end pointing left.",
  null
];

window.Deck.sequence("gs-pca-cycles", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const li = Array.from(slide.querySelectorAll("li[data-build]"));

  let h = '<g font-family="Helvetica Neue,Arial,Helvetica,sans-serif">';

  BAND.forEach(function(b, n){
    const ink = [], blue = [], tips = [], grey = [];

    if (n === 0){
      /* the goal, not a molecule anyone has in a tube yet: a plain rule
         the length of the target, with no 3' end to barb.  Everything
         below is measured against it. */
      grey.push(plain(u(0), b.rows[0], u(10), b.rows[0]));
    } else if (n === 1){
      for (let k = 0; k < 16; k++){
        const a = STEP*k, y = b.rows[k % 2];
        ink.push(k % 2 === 0 ? strand(u(a), y, u(a+1), y)
                             : strand(u(a+1), y, u(a), y));
      }
    } else if (n <= 5){
      const R = round(n - 1);
      for (let m = 0; m < R.count; m++){
        const p = piece(R.step*m, R.step*m + R.len, b.rows[m % b.rows.length]);
        ink.push.apply(ink, p.ink); blue.push.apply(blue, p.blue);
        tips.push.apply(tips, p.tips);
      }
    } else {
      const p = piece(0, 10, b.rows[0]);
      ink.push.apply(ink, p.ink);
      /* the two outer primers.  They were ordered, so they are solid ink
         like every other oligo on the slide */
      ink.push(strand(u(0), YPF, u(1), YPF), strand(u(10), YPR, u(9), YPR));
      blue.push.apply(blue, p.blue); tips.push.apply(tips, p.tips);
    }

    h += '<g data-r="b'+n+'" opacity="0">' +
         grp(grey, MUTED, false) + grp(ink, INK, false) +
         grp(blue, BLUE, true) + grp(tips, BLUE, false) +
         '<text data-r="l'+n+'" x="'+X0+'" y="'+b.ly+'" font-size="18" ' +
           'fill="'+MUTED+'">'+b.label+'</text>';
    if (b.note)
      h += '<text x="'+X1+'" y="'+b.ly+'" text-anchor="end" font-size="18" ' +
             'fill="'+MUTED+'">'+b.note+'</text>';
    h += '</g>';
  });

  h += '<text data-r="key" x="'+X0+'" y="'+(FOOT[0]+26)+'" font-size="17" ' +
         'fill="'+MUTED+'" opacity="0">dashed blue is new DNA, made in the tube</text>';
  h += '</g>';

  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");
  svg.innerHTML = h;
  slide.appendChild(svg);

  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);

  function fade(el, on, soft){
    el.style.transition = soft ? "opacity .34s ease" : "none";
    el.style.opacity = on ? "1" : "0";
  }

  function go(i, animated){
    const soft = animated !== false && !reduce.matches;
    const shown = BANDS[i], live = shown - 1;
    BAND.forEach(function(b, n){
      fade(r["b"+n], n < shown, soft);
      r["l"+n].setAttribute("fill", n === live ? INK : MUTED);
      r["l"+n].setAttribute("font-weight", n === live ? "700" : "400");
    });
    r.key.setAttribute("y", FOOT[live] + 26);
    fade(r.key, shown >= 3, soft);

    let upto = -1;
    for (let k = 0; k <= i; k++) if (BULLET[k] >= 0) upto = BULLET[k];
    li.forEach((el, k) => el.classList.toggle("in", k <= upto));
  }

  go(0, false);

  const steps = BANDS.map(function(_, i){
    const b = BULLET[i] >= 0 ? li[BULLET[i]] : null;
    const said = b ? (b.getAttribute("data-desc") || "") : "";
    const desc = [said, FIG[i]].filter(Boolean).join(" ");
    return { note: b ? (b.getAttribute("data-note") || "") : (i === 0 ? undefined : ""),
             desc: desc || undefined };
  });
  return { steps: steps, go: go };
});

})();
