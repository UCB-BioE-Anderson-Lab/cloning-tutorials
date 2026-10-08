/* ------------------------------------------------------------------ *
 * 04-states.js — three questions, and the third is not computed from
 * the first two.
 *
 * Was 144 words: a list of three definitions followed by a list of
 * three crossings.  But the crossings ARE the argument, and a list
 * cannot show what they demonstrate — that the three answers vary
 * independently.  A matrix can, and the room reads the independence
 * straight off the third column without being told it.
 *
 * THE THIRD COLUMN IS THE SLIDE.  It is the one that stops projects and
 * the one nobody asks until late, so it is the one that gets ringed at
 * the end, after the room has seen three rows in which it fails to
 * follow from anything to its left.
 *
 * WORDS, NOT TICKS.  "yes" and "no" are set as words rather than as ✓
 * and ✗ glyphs, partly because the middle answer in row two is neither
 * — it is "in practice", which is the whole point of that row and
 * cannot be drawn as a tick.
 *
 * PROVENANCE: these are definitional distinctions, so there is nothing
 * to cite.  The one claim with legal content is the negative one about
 * a research exemption, phrased as enforcement rather than doctrine,
 * and the note channel keeps the VERIFY on it.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

const COL = [790, 1060, 1340];
const RULE = 348, ROW = [416, 512, 608];
const TX = 150;

const HEAD = [
  ["patentable",      "could one be granted?"],
  ["patented",        "granted, and still in force?"],
  ["free to practise","may you actually use it?"]
];

const CASE = [
  { t:["Your idea is obvious. Nobody can patent it — and you",
       "still cannot build it, because it needs an enzyme someone owns"],
    m:["no", "no", "no"] },
  { t:["Somebody else's patent, used on a teaching bench.",
       "Nothing whatsoever happens to you"],
    m:["yes", "yes", "in practice"] },
  { t:["Free of every patent on earth — and the strain arrived",
       "under a material transfer agreement you signed"],
    m:["—", "no", "no"] }
];

function paint(v, f){
  const g = G.grp();

  if (v.cols > 0.02){
    const h = G.grp(v.cols);
    HEAD.forEach(function(H, i){
      const last = i === 2;
      h.appendChild(G.text(COL[i], 282, H[0], 30, last ? C.verm : C.ink, 700));
      h.appendChild(G.text(COL[i], 314, H[1], 19, C.muted, 400));
    });
    h.appendChild(G.path(`M ${TX} ${RULE} L 1450 ${RULE}`, C.rule, 2.6));
    g.appendChild(h);
  }

  if (v.rows > 0.02){
    const h = G.grp(v.rows);
    CASE.forEach(function(R, r){
      const y = ROW[r];
      h.appendChild(G.lines(TX, y - 10, R.t, 22, C.ink, 400, "start", 28));
      R.m.forEach(function(m, i){
        const soft = m === "in practice" || m === "—";
        h.appendChild(G.text(COL[i], y + 2, m,
          soft ? 24 : 29, soft ? C.amber : (i === 2 ? C.verm : C.muted),
          700));
      });
      if (r < 2) h.appendChild(G.path(
        `M ${TX} ${y + 44} L 1450 ${y + 44}`, C.rule, 1.6));
    });
    h.appendChild(G.text(COL[2], ROW[1] + 30, "not a right", 18, C.amber, 400));
    g.appendChild(h);
  }

  if (v.ring > 0.02){
    const h = G.grp(v.ring);
    h.appendChild(G.el("rect", {x:COL[2] - 128, y:252, width:256,
      height:ROW[2] - 252 + 44, rx:12, fill:"none", stroke:C.verm,
      "stroke-width":3, "stroke-dasharray":"9 7"}));
    g.appendChild(h);
  }

  return g;
}

const FR = [];
const beat = o => FR.push(o);

beat({ on:[], s:{cols:1},
  cap:"Three words that sound like one word",
  call:"",
  note:"Three words that sound like the same word, and the confusion between them costs people years. PATENTABLE is a question about the thing: could a patent be granted on it — is it new, is it non-obvious to somebody working in the field, is it useful, and is it the kind of thing the system will grant a patent on at all. PATENTED is a question about the world: did somebody actually file, argue it through an examiner, and keep paying the maintenance fees. Most patentable things are not patented, because somebody has to want it enough to spend the money. And FREE TO PRACTISE is a third question entirely: are you allowed to go and do it. Set them up as three separate questions and leave them empty for a moment, because the next beat is the one that does the work.",
  desc:"Three columns: patentable, could one be granted; patented, was one granted and is it still alive; free to practise, may you actually use it."});

beat({ on:[], s:{cols:1, rows:1}, dur:1600,
  cap:"",
  call:"",
  note:"Now three situations people actually walk into, and read the rows across rather than down. ROW ONE: your idea is obvious, nobody can patent it, and you still cannot build it, because making it requires an enzyme or a vector or a screening method that somebody else does own. Unpatentable and unusable at the same time. ROW TWO, and this is the one that surprises students most: a thing can be patented by somebody else and absolutely nothing will happen to you for using it in a teaching lab. NOTICE WHAT I DID AND DID NOT SAY. I did not say you have a right — that is why the answer in that box is 'in practice' and why it says 'not a right' underneath it. Infringement does not have a general research exemption that covers you. What you have is the fact that nobody sues a class, and that protection evaporates the day your project has a customer. ROW THREE: a thing can be free of every patent on earth and still be completely locked up, because the strain came from another lab under a material transfer agreement, and that is a contract you signed. An MTA reaches things patents never could — publication, who owns what you make with it, whether you may send it on. Contracts are often the harder constraint and nobody teaches them. [VERIFY the scope of the experimental-use defence before stating anything stronger than the enforcement claim as phrased.]",
  desc:"Three rows of real situations, answered across the three columns: no/no/no; yes/yes/in practice, marked not a right; and dash/no/no."});

beat({ on:[], s:{cols:1, rows:1, ring:1},
  cap:"",
  call:"The third column does not follow from the first two. Ask it separately.",
  note:"And here is the whole slide, which you can now simply point at. Look down the third column. It does not follow from either of the other two. It is 'no' when both of the others are 'no', it is barely 'yes' when both of them are 'yes', and it is 'no' again when the patent questions have gone away entirely. Freedom to practise is not computed from patentability or from whether a patent exists. It is a separate question with separate inputs — other people's patents, contracts you signed, and material you accepted — and it is the one that stops projects, and the one nobody asks until late. If you take one thing from this section before the case, take the habit of asking the third question on its own.",
  desc:"The third column is ringed: freedom to practise does not follow from the first two answers, and has to be asked separately."});

window.Deck.sequence("states", function(slide){
  const s = G.scene(slide, 792, 840);
  s.finish();
  return G.run(s, FR, paint);
});
})();
