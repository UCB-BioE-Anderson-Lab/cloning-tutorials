/* ------------------------------------------------------------------ *
 * 05-market.js — CAR-T, by the numbers that decide things.
 *
 * Three rows on one canvas, built downward, because the argument only
 * works if the three are seen against each other:
 *
 *   ONE DOSE      the price is enormous and the gross margin is fine.
 *                 Students arrive certain this is the scandal.  It is
 *                 not even the problem.
 *   THE MARKET    the entire global category, every product and every
 *                 company, is smaller than what two buyers paid to get
 *                 into it.
 *   DELIVERY      and the reason is not price.  It is that every dose
 *                 is a bespoke manufacturing run tied to one patient
 *                 who has to stay well enough to wait for it.
 *
 * Units differ by row and each row is labelled, because a bar in row
 * one is dollars per dose and a bar in row two is dollars per year.
 * Row two also sets a one-time purchase price against an annual market,
 * which is a stock against a flow — legitimate only if you say so out
 * loud, which the narration does.
 *
 * PROVENANCE.  Every figure here is sourced; see the note channel of
 * the beat it appears in.  Nothing is from memory.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;
const n2 = v => Math.round(v*10)/10;

const X0 = 300, W = 900;              /* the bar field                */
const R1 = 236, R2 = 474, R3 = 672;   /* the three rows               */

/* row 1: dollars per dose.  Full width is the list price. */
const PRICE = 593533, COGS_LO = 100000, COGS_HI = 150000;
/* row 2: dollars.  Full width is what the two buyers paid. */
const PAID = 20900e6, MARKET = 4.5e9, KYMRIAH = 381e6;

function bar(x, y, w, h, col, op){
  return G.el("rect", {x:n2(x), y:y, width:n2(w), height:h, rx:4,
    fill:col, "fill-opacity":op == null ? 0.85 : op, stroke:col, "stroke-width":2});
}
function ghost(x, y, w, h, col){
  return G.el("rect", {x:n2(x), y:y, width:n2(w), height:h, rx:4,
    fill:"none", stroke:col, "stroke-width":2.4, "stroke-dasharray":"9 7"});
}
function rowhead(y, s){
  return G.text(X0 - 28, y, s, 20, C.muted, 700, "end");
}

function paint(v, f){
  const g = G.el("g", {});
  const add = n => { g.appendChild(n); return n; };

  /* ---- row 1: one dose ------------------------------------------- */
  if (v.dose > 0.02){
    const h = G.grp(v.dose);
    h.appendChild(rowhead(R1 + 28, "ONE DOSE"));
    h.appendChild(ghost(X0, R1, W, 52, C.ink));
    h.appendChild(G.text(X0 + W + 18, R1 + 34, "$593,533", 30, C.ink, 700, "start"));
    h.appendChild(G.text(X0 + W + 18, R1 + 62, "Kymriah list, 2025", 19, C.muted, 400, "start"));
    g.appendChild(h);
  }
  if (v.cogs > 0.02){
    const h = G.grp(v.cogs);
    const lo = W*COGS_LO/PRICE, hi = W*COGS_HI/PRICE;
    h.appendChild(bar(X0, R1, hi, 52, C.verm, 0.3));
    h.appendChild(bar(X0, R1, lo, 52, C.verm, 0.55));
    h.appendChild(G.text(X0 + hi/2, R1 + 92, "cost to make it", 19, C.verm, 700));
    h.appendChild(G.text(X0 + hi/2, R1 + 116, "$100–150k", 19, C.verm, 400));
    h.appendChild(G.text(X0 + hi + (W - hi)/2, R1 + 92,
      "gross margin on the dose: roughly 75%", 21, C.ink, 700));
    g.appendChild(h);
  }

  /* ---- row 2: the whole category --------------------------------- */
  if (v.market > 0.02){
    const h = G.grp(v.market);
    h.appendChild(rowhead(R2 + 28, "THE CATEGORY"));
    h.appendChild(ghost(X0, R2, W, 52, C.blue));
    h.appendChild(G.text(X0 + W + 18, R2 + 24, "$20.9 billion", 26, C.blue, 700, "start"));
    h.appendChild(G.text(X0 + W + 18, R2 + 50,
      "paid for Kite + Juno, 2017–18", 19, C.muted, 400, "start"));
    const m = W*MARKET/PAID, k = W*KYMRIAH/PAID;
    h.appendChild(bar(X0, R2, m, 52, C.blue, 0.85));
    h.appendChild(bar(X0, R2, k, 52, C.ink, 0.9));
    h.appendChild(G.arrow(X0 + m + 6, R2 + 118, X0 + m + 6, R2 + 62, C.blue, 2.6));
    h.appendChild(G.lines(X0 + m + 22, R2 + 110,
      ["$4.5B — the entire global CAR-T market, 2024",
       "every product, every company, in one year"],
      20, C.ink, 400, "start", 26));
    h.appendChild(G.text(X0 + k/2, R2 - 16, "Kymriah", 17, C.ink, 700));
    h.appendChild(G.text(X0 + k/2, R2 + 142, "$381M", 17, C.ink, 700));
    h.appendChild(G.text(X0 + k/2, R2 + 164, "2025, −14%", 16, C.verm, 700));
    g.appendChild(h);
  }

  /* ---- row 3: why -------------------------------------------------- */
  if (v.deliver > 0.02){
    const h = G.grp(v.deliver);
    h.appendChild(rowhead(R3 + 34, "AND WHY"));
    const BW = 196, GAP = 38;
    [["eligible", "and well enough"],
     ["referred", "to a certified centre"],
     ["apheresis", "when a slot opens"],
     ["manufactured", "3–4 weeks, for one"],
     ["infused", "if still eligible"]].forEach(function(b, i){
      const x = X0 + i*(BW + GAP);
      h.appendChild(G.box(x, R3, BW, 68, C.ink));
      h.appendChild(G.text(x + BW/2, R3 + 30, b[0], 20, C.ink, 700));
      h.appendChild(G.text(x + BW/2, R3 + 54, b[1], 16, C.muted, 400));
      if (i < 4) h.appendChild(G.arrow(x + BW + 7, R3 + 34, x + BW + GAP - 7, R3 + 34, C.rule, 2.6));
     });
    h.appendChild(G.text(X0 + 2.5*(BW + GAP) - GAP/2, R3 + 112,
      "every box is a place a patient is lost, and the clock is a cancer",
      22, C.verm, 700));
    g.appendChild(h);
  }
  return g;
}

const FR = [];
let acc = {};
function beat(o){
  acc = Object.assign({}, acc, o.s || {});
  FR.push(Object.assign({}, o, {s:Object.assign({}, acc)}));
}

beat({ on:[], s:{dose:1},
  cap:"", call:"",
  note:"Start with the number everybody already has an opinion about. One dose of Kymriah lists at five hundred and ninety-three thousand dollars. Yescarta is five hundred and three. Those are 2025 list prices, and both have gone up since launch — Kymriah came out at four hundred and seventy-five thousand in 2017, Yescarta at three hundred and seventy-three. Hold on to the outrage for a moment, because the interesting thing about this number is that it is not the problem. [Prices: BioInformant, Global Pricing of Approved Cell Therapy Products, bioinformant.com/price-of-cell-therapy-products. Launch prices widely reported, Aug–Oct 2017.]",
  desc:"A bar representing the list price of one dose of Kymriah in 2025, $593,533."});

beat({ on:[], s:{cogs:1},
  cap:"", call:"so the margin per dose was never the problem",
  note:"Here is what it costs to make. Estimates scatter, because it depends on whether you count the facility, the failed runs and the logistics, but the usual working range is a hundred to a hundred and fifty thousand dollars a patient. Narrower batch-level estimates run higher, up to two hundred and twenty. Take the middle and the gross margin on a dose is around seventy-five per cent, which is an ordinary, healthy pharmaceutical margin. Nobody went broke on this line. So whatever went wrong, it was not the margin. [COGS range: IntuitionLabs, CAR-T Manufacturing Cost of Goods Sold, intuitionlabs.ai/articles/car-t-manufacturing-economics-cogs, which collects the $78–93k supply-chain model, the $100–150k working figure and the $170–220k batch estimates.]",
  desc:"The cost to make one dose, $100,000 to $150,000, shown as a fraction of the list price. The gross margin on a dose is roughly 75 per cent."});

beat({ on:[], s:{market:1},
  cap:"", call:"",
  note:"Now widen out, and be careful about what is being compared, because these are two different kinds of number. The dashed bar is a one-time purchase price: Gilead paid eleven point nine billion dollars for Kite in 2017, and Celgene paid about nine billion for Juno a few months later. Nearly twenty-one billion to buy into this field. The solid bar inside it is an annual flow: four and a half billion dollars, which is the entire global CAR-T market in 2024 — every approved product, every company, one year of sales. Not profit. Sales. A stock against a flow is a sloppy comparison unless you say what you are doing, so: at that size, and at ordinary margins, those two purchases need something like a decade of category dominance to come back. And the little black sliver is Kymriah, the first one approved, at three hundred and eighty-one million in 2025, down fourteen per cent, while Gilead reports its own CAR-T sales eroding too. [Kite $11.9B: Gilead press release, 28 Aug 2017, SEC 8-K. Juno ~$9B: Celgene press release, 22 Jan 2018, SEC filings. 2024 market $4.5B: Astute Analytica via Yahoo Finance. Kymriah 2025 $381M, −14%, and Gilead erosion: FiercePharma, 2025.]",
  desc:"The whole global CAR-T market in 2024, $4.5 billion, drawn inside a dashed bar representing the $20.9 billion paid for Kite and Juno in 2017 and 2018. Kymriah's 2025 sales of $381 million, down 14 per cent, are a thin sliver at the left end."});

beat({ on:[], s:{deliver:1},
  cap:"", call:"",
  note:"And the reason is not that the price is too high. It is this. Every dose is a separate manufacturing run tied to one named patient, and before you can bill for it, that patient has to be eligible, be referred to one of a limited number of certified centres, get an apheresis slot, survive the three to four weeks while their own cells are engineered and released, and still be well enough to receive them. Every box on that chain is a place where a patient is lost, and the clock they are racing is a cancer. So the ceiling on this business is not willingness to pay. It is throughput. You cannot sell more by making it cheaper, and you cannot make it faster by making more.",
  desc:"The delivery chain drawn as five boxes: eligible, referred to a certified centre, apheresis when a slot opens, manufactured over three to four weeks for one patient, and infused if still eligible. Every box is a place a patient is lost."});

window.Deck.sequence("cartmarket", function(slide){
  const s = G.scene(slide, 858, 886);
  s.finish();
  return G.run(s, FR, paint);
});
})();
