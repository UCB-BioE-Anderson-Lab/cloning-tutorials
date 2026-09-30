/* ------------------------------------------------------------------ *
 * 06-fractions.js — you put a signal peptide on it.  Now find it.
 *
 * The localization exercise.  Everything in this section so far says
 * where a protein GOES; this asks the question that actually turns up
 * at a bench, which is where it shows up when you go looking.
 *
 * The trap is the one the section has been building to and which
 * people get wrong constantly: a Sec signal peptide addresses ONE
 * membrane.  In a Gram negative that lands you in the periplasm, not
 * the medium, and a band in the medium lane is much more likely to be
 * lysis than secretion.  Which is why the control is a cytoplasmic
 * marker run in the same lane.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;
const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);
function grp(o){ return G.el("g", {opacity:n1(cl(o == null ? 1 : o, 0, 1))}); }
function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 2.6,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return G.el("path", a);
}

const LX = [452, 800, 1148], LW = 210, LY = 404, LH = 264;
const LANES = [
  {name:"cytoplasm",  sub:"lysed cells",       key:"cyt"},
  {name:"periplasm",  sub:"osmotic shock",     key:"peri"},
  {name:"medium",     sub:"spun supernatant",  key:"med"}
];

function lane(x, showBand, y, w, label, col){
  const g = G.el("g", {});
  g.appendChild(G.el("rect", {x:n1(x - LW/2), y:LY, width:LW, height:LH, rx:4,
    fill:C.muted, "fill-opacity":".07", stroke:C.muted, "stroke-width":2.2}));
  if (showBand){
    g.appendChild(G.el("rect", {x:n1(x - LW/2 + 20), y:n1(y - 11),
      width:n1(LW - 40), height:22, rx:3, fill:col, "fill-opacity":".72",
      stroke:col, "stroke-width":2}));
    if (label) g.appendChild(G.text(x, y + 42, label, 19, col, 700));
  }
  return g;
}

const FR = [
{ s:{con:1, pose:1},
  cap:"<b>Your turn.</b> You put a <b>pelB</b> signal on it and expressed it",
  call:"you fractionate the culture &#183; which lanes have your protein in them?",
  note:"The section has been about where proteins go. This asks the question you actually face, which is where the protein turns up when you go looking for it. You have fused a pelB signal peptide to your protein, expressed it in E. coli, and split the culture three ways: lysed cells, an osmotic shock fraction, and the spun supernatant. Give them a few minutes on which lanes light up. Expect a confident vote for the medium.",
  desc:"A construct with a pelB signal peptide fused to a protein, and three empty fractionation lanes — cytoplasm, periplasm and medium — with the room asked which will contain the protein." },

{ s:{con:1, cyt:1},
  cap:"a little in the <b>cytoplasm</b>, and it is the <b>wrong size</b>",
  call:"precursor that has not gone through yet &#183; signal still on the front",
  note:"There is usually some in the cytoplasm, and the useful detail is that it runs higher than you expect. That is precursor: made, not yet translocated, signal peptide still attached and adding a couple of thousand daltons. If that band is the big one, your export is saturated or your signal peptide is not working, and the gel has told you which problem you have.",
  desc:"The cytoplasmic lane has a faint band running higher than expected, because it is unprocessed precursor with the signal peptide still attached." },

{ s:{con:1, cyt:1, peri:1},
  cap:"most of it in the <b>periplasm</b>, at the <b>right size</b>",
  call:"signal peptidase has been at it &#183; this is where Sec delivers",
  note:"The bulk of it is in the periplasm, and it runs lower than the cytoplasmic band because signal peptidase has taken the address off. Two bands, two sizes, and the size difference is the evidence that the thing actually went through rather than merely being made.",
  desc:"The periplasmic lane has a strong band at the mature size, the signal peptide having been cleaved on arrival." },

{ s:{con:1, cyt:1, peri:1, med:1},
  cap:"and <b>nothing</b> in the medium",
  call:"a Sec signal addresses <b>one</b> membrane &#183; there are two",
  note:"And the medium is empty, which is the part the room usually gets wrong. A Sec signal peptide addresses the inner membrane and nothing else. In a Gram positive that would be the end of the story and the protein would be outside. Here there is a second membrane in the way, so the protein is in the periplasm and it stays there. If you wanted it in the medium you needed a different mechanism entirely, which is the next slide.",
  desc:"The medium lane is empty, because a Sec signal peptide addresses only the inner membrane and the outer membrane still stands between the periplasm and the medium." },

{ s:{con:1, cyt:1, peri:1, med:1, lysis:1},
  cap:"so if you <b>do</b> see it in the medium",
  call:"suspect <b>lysis</b> before you claim secretion &#183; and run a cytoplasmic marker",
  note:"Finish on the diagnostic, because people publish this mistake. If you run this experiment and there is a band in the medium lane, the likely explanation is not that you have achieved secretion, it is that some of your cells have burst. The control is to blot the same lane for something that has no business leaving the cytoplasm at all, GroEL or a ribosomal protein. If that shows up too, you are looking at lysis. Same rule as the blue-white plate: the result on its own is not evidence, it is evidence relative to a control that could have come out the other way.",
  desc:"The diagnostic: a band in the medium lane usually means lysis rather than secretion, and the control is to blot the same fraction for a cytoplasmic marker such as GroEL." }
];

window.Deck.sequence("fractions", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    if (v.con > 0.02){
      const q = grp(v.con), x = 560, y = 286;
      q.appendChild(G.el("rect", {x:n1(x), y:n1(y - 18), width:118, height:36,
        rx:5, fill:C.verm, "fill-opacity":".2", stroke:C.verm, "stroke-width":2.6}));
      q.appendChild(G.text(x + 59, y + 7, "pelB", 20, C.verm, 700));
      q.appendChild(G.el("rect", {x:n1(x + 118), y:n1(y - 18), width:260,
        height:36, rx:5, fill:C.blue, "fill-opacity":".2", stroke:C.blue,
        "stroke-width":2.6}));
      q.appendChild(G.text(x + 248, y + 7, "your protein", 20, C.blue, 700));
      q.appendChild(G.text(x - 22, y + 7, "construct", 21, C.muted, 700, "end"));
      g.appendChild(q);
    }

    LANES.forEach(function(L, i){
      const on = (v[L.key] || 0) > 0.5;
      const q = grp(1);
      if (L.key === "cyt")
        q.appendChild(lane(LX[i], on, LY + 78, LW, "precursor · runs high", C.verm));
      else if (L.key === "peri")
        q.appendChild(lane(LX[i], on, LY + 150, LW, "mature · signal cut off", C.blue));
      else
        q.appendChild(lane(LX[i], false, 0, LW, null, C.muted));
      if (L.key === "med" && on)
        q.appendChild(G.text(LX[i], LY + 140, "nothing", 26, C.muted, 700));
      if (!on && (v.pose || 0) > 0.5)
        q.appendChild(G.text(LX[i], LY + 148, "?", 50, C.muted, 700));
      q.appendChild(G.text(LX[i], LY + LH + 36, L.name, 23, C.ink, 700));
      q.appendChild(G.text(LX[i], LY + LH + 62, L.sub, 19, C.muted, 400));
      g.appendChild(q);
    });

    if (v.lysis > 0.02){
      const q = grp(v.lysis);
      q.appendChild(G.el("rect", {x:n1(LX[2] - LW/2 - 8), y:n1(LY - 8),
        width:LW + 16, height:LH + 16, rx:8, fill:"none", stroke:C.verm,
        "stroke-width":3, "stroke-dasharray":"8 6"}));
      q.appendChild(G.text(LX[2], LY - 26, "a band here is probably lysis", 21,
        C.verm, 700));
      g.appendChild(q);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
