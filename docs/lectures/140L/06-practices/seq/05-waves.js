/* ------------------------------------------------------------------ *
 * 05-waves.js — three waves, one mistake.
 *
 * The generalisation, placed after CAR-T rather than before it, so the
 * pattern is recognised rather than announced.  Each row is a period in
 * which the biology worked and the business did not, and the third
 * column is the number that would have said so at the outset.
 *
 * The rows are deliberately not "failures".  Every one of these waves
 * produced real science that is still standing.  What they have in
 * common is that the killing quantity was knowable from arithmetic
 * before the first experiment, and in each case the field found it out
 * afterwards instead.
 *
 * PROVENANCE in the note channels.  Where a claim is chronology rather
 * than a figure — Amyris walking from fuel to cosmetics — the note says
 * so, and says what is sourced and what is general record.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

const CW = [150, 520, 962];           /* wave, biology, the number     */
const RY = [300, 468, 636];
const KEYS = ["wave", "chem", "cell"];

const ROWS = [
  { when:["Biofuels", "about 2007–2012"],
    bio:["microbes made fuel molecules,", "and the titres kept climbing"],
    num:["your selling price is set by crude oil.", "You cannot out-engineer a commodity ceiling."] },
  { when:["Metabolic engineering", "about 2013–2016"],
    bio:["pathways worked; strain building", "was automated and industrialised"],
    num:["the distance from titre, rate and yield", "to a viable price per kilo — against the", "capital cost of a plant to make it in."] },
  { when:["Cell therapy", "2017 onwards"],
    bio:["it cures people — which none of", "the others could claim"],
    num:["cost per dose does not fall with volume,", "and the eligible population is small."] }
];

function row(i, o){
  const g = G.grp(o), r = ROWS[i], y = RY[i];
  g.appendChild(G.text(CW[0], y, r.when[0], 26, C.ink, 700, "start"));
  g.appendChild(G.text(CW[0], y + 30, r.when[1], 20, C.muted, 400, "start"));
  g.appendChild(G.lines(CW[1], y, r.bio, 21, C.muted, 400, "start", 28));
  g.appendChild(G.lines(CW[2], y, r.num, 21, C.verm, 700, "start", 28));
  g.appendChild(G.path("M" + CW[0] + " " + (y + 72) + "H1450", C.rule, 1.6));
  return g;
}

function paint(v, f){
  const g = G.el("g", {});
  const add = n => { g.appendChild(n); return n; };
  if (v.wave > 0.02){
    const h = G.grp(v.wave);
    h.appendChild(G.text(CW[1], 232, "the biology", 19, C.muted, 700, "start"));
    h.appendChild(G.text(CW[2], 232, "the number nobody ran", 19, C.verm, 700, "start"));
    h.appendChild(G.path("M" + CW[0] + " " + 250 + "H1450", C.ink, 2.4));
    g.appendChild(h);
  }
  KEYS.forEach((k, i) => { if (v[k] > 0.02) g.appendChild(row(i, v[k])); });
  if (v.close > 0.02){
    const h = G.grp(v.close);
    h.appendChild(G.text(800, 772,
      "the biology succeeded every time", 30, C.ink, 700));
    h.appendChild(G.text(800, 812,
      "and the quantity that killed it was computable before the first experiment",
      24, C.muted, 400));
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

beat({ on:[], s:{wave:1},
  cap:"", call:"",
  note:"Now step back, because this has happened before, and it will happen to you if nobody says it out loud. Three waves in roughly twenty years. In each one the biology worked. In each one there was a number that would have told you how it ended, and the field found that number out afterwards.",
  desc:"An empty three-column table: the wave, the biology, and the number nobody ran."});

beat({ on:[], s:{wave:1, chem:1},
  cap:"", call:"",
  note:"Biofuels first, roughly 2007 to 2012. The engineering genuinely worked: organisms were made that produced fuel molecules, and the titres climbed year on year. The number nobody ran is that your selling price is set by crude oil, by people who are not interested in how clever your pathway is. A commodity price is a ceiling, and no amount of strain engineering goes through it. Amyris is the clearest case, because you can watch the arithmetic happen to a company: it began in fuels and farnesene, moved to a cosmetic ingredient, squalane, then to consumer brands, and filed for Chapter 11 in August 2023. That is not a failure of biology. It is a company walking, over fifteen years, from a commodity price to a specialty one, because that is the only direction the arithmetic allows. [Chapter 11, August 2023, District of Delaware, with $190M DIP financing: Bloomberg Law and CosmeticsDesign, 15 Aug 2023. The fuel-to-ingredient chronology is general record rather than from that filing — worth confirming against Amyris's own 10-K history before presenting it as exact.]",
  desc:"The first row: biofuels, about 2007 to 2012. The biology worked and titres climbed; the number nobody ran was that the selling price is set by crude oil, a ceiling engineering cannot pass."});

beat({ on:[], s:{cell:1},
  cap:"", call:"",
  note:"Then metabolic engineering, call it 2013 to 2016, when the promise was that strain building itself would be industrialised — automation, foundries, machine learning over the design space. Again the biology delivered. The number nobody ran is the distance from titre, rate and yield to a price per kilo anybody would pay, measured against the capital cost of the plant you would need to make it in. Zymergen is the compressed version: more than a billion dollars of venture funding, a five hundred million dollar IPO in April 2021, the chief executive gone three months later, the shares down about seventy-five per cent after it disclosed it would have no meaningful revenue that year or the next, and acquisition by Ginkgo in October 2022 for three hundred million in stock. Eighteen months from public offering to absorbed. [IPO April 2021 and the share collapse: contemporaneous coverage. Merger agreement 24 July 2022 and completion October 2022 at $300M, all stock: Ginkgo Bioworks SEC filings, Form 424B3 and S-1/A, 2022.]",
  desc:"The second row: metabolic engineering, about 2013 to 2016. Pathways worked and strain building was automated; the number nobody ran was the distance from titre, rate and yield to a viable price per kilogram, against the capital cost of a plant."});

beat({ on:[], s:{close:1},
  cap:"", call:"",
  note:"And then cell therapy, which is the one you are living through. And notice that this row is the strongest of the three on the biology: it cures people, which neither of the others could ever claim. The number nobody ran is the one we spent the last two slides on — the cost per dose does not fall with volume, and the population that can receive it is small. Three waves, three different killing numbers, and the same shape every time. The biology succeeded. The arithmetic was done afterwards. And every one of those numbers was available at the start: a commodity price is public, capital cost is quotable, and a process diagram tells you whether your costs divide. None of it required market research. It required somebody to multiply.",
  desc:"The third row: cell therapy from 2017, where the biology is the strongest of the three because it cures people, and the number nobody ran is that cost per dose does not fall with volume while the eligible population is small. The closing line: the biology succeeded every time, and the quantity that killed it was computable before the first experiment."});

window.Deck.sequence("waves", function(slide){
  const s = G.scene(slide, 858, 886);
  s.finish();
  return G.run(s, FR, paint);
});
})();
