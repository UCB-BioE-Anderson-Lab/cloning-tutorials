/* ------------------------------------------------------------------ *
 * 06-tat.js — the other way across the inner membrane.
 *
 * Added after the Sec slide because the deck had been treating "signal
 * peptide" and "Sec" as the same fact, and its own worked example
 * disproves that: the Thermus alkaline phosphatase in the question at
 * the end of this section scores Tat/SPI 0.9944 against Sec/SPI 0.0025
 * on SignalP-5.0.  A student who has only been shown Sec reads that
 * output and has nowhere to put it.
 *
 * The slide is the contrast and nothing else, so it is drawn rather
 * than listed.  Both routes start in the cytoplasm, cross the same
 * membrane, and finish in the same compartment; the difference is the
 * STATE of the thing that travels, and a picture says that in one
 * look where a bullet list has to assert it.  Real signal peptides on
 * top -- E. coli PhoA against the Thermus enzyme -- so the twin
 * arginine is something they can see rather than something they are
 * told about.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;
const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);

function grp(o){ return G.el("g", {opacity:n1(cl(o == null ? 1 : o, 0, 1))}); }
function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 3,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return G.el("path", a);
}

const X0 = 250, X1 = 1330, MH = 40;
/* the membrane sits low enough that a folded protein arriving in the
   periplasm clears the sequence strips above it, and the route labels
   below still finish above the caption at y 800 */
const IM = 570, CYT = IM + MH;
const SEC = 520, TAT = 1060;               /* one route per column       */

/* ---- the two real signal peptides, as monospace strips ------------- *
 * PhoA is the textbook Sec substrate; the Thermus enzyme is the one the
 * question at the end of the section actually runs.  CW is the advance
 * of the monospace face at FS, measured rather than guessed, so the
 * highlight box lands on the right residues.
 * ------------------------------------------------------------------ */
const FS = 25, CW = 15.05;
const SIGS = [
  {y:258, who:"E. coli PhoA", tag:"Sec \u00b7 21 residues",
   seq:"MKQSTIALALLPLLFTPVTKA", marks:[]},
  {y:344, who:"E. coli TorA", tag:"Tat \u00b7 39 residues",
   seq:"MNNNDLFQASRRRFLAQLGGLTVAGMLGPSLLTPRRATA",
   marks:[[9, 15, "twin arginine"], [34, 36, "basic \u2014 keeps Sec off"]]}
];
const SX = 396;
function strip(s, showMarks){
  const g = G.el("g", {});
  g.appendChild(G.text(SX - 24, s.y + 8, s.who, 22, C.ink, 700, "end"));
  g.appendChild(G.text(SX - 24, s.y + 34, s.tag, 19, C.muted, 400, "end"));
  if (showMarks) s.marks.forEach(function(m){
    g.appendChild(G.el("rect", {x:n1(SX + m[0]*CW - 3), y:n1(s.y - 19),
      width:n1((m[1] - m[0])*CW + 6), height:36, rx:5, fill:C.verm,
      "fill-opacity":".16", stroke:C.verm, "stroke-width":2.2}));
  });
  g.appendChild(G.el("text", {x:n1(SX), y:n1(s.y + 8), "font-size":FS,
    fill:C.ink, "font-weight":700, "text-anchor":"start",
    "font-family":"ui-monospace,SFMono-Regular,Menlo,monospace"}, s.seq));
  if (showMarks) s.marks.forEach(function(m, i){
    const cx = SX + (m[0] + m[1])/2*CW;
    g.appendChild(G.text(cx + (i ? 30 : 0), s.y + 58, m[2], 19, C.verm, 700));
  });
  return g;
}

function bilayer(yTop){
  const g = G.el("g", {}), r = 7.5, step = 20;
  g.appendChild(G.el("rect", {x:X0, y:n1(yTop), width:X1 - X0, height:MH,
    fill:C.amber, "fill-opacity":".13", stroke:"none"}));
  for (let x = X0 + r + 2; x < X1 - r; x += step){
    [yTop + r + 1, yTop + MH - r - 1].forEach(function(y){
      g.appendChild(G.el("circle", {cx:n1(x), cy:n1(y), r:r, fill:C.amber,
        "fill-opacity":".55", stroke:C.amber, "stroke-width":1.3}));
    });
  }
  return g;
}
function pore(cx, col, w){
  const g = G.el("g", {}), half = (w || 46)/2;
  g.appendChild(G.el("rect", {x:n1(cx - half), y:IM, width:n1(half*2),
    height:MH, fill:C.paper}));
  [-half, half].forEach(function(dx){
    g.appendChild(G.el("rect", {x:n1(cx + dx - 7), y:IM, width:14, height:MH,
      rx:4, fill:col, "fill-opacity":".2", stroke:col, "stroke-width":2.6}));
  });
  return g;
}
/* unfolded: a loose chain.  folded: a compact body with the cofactor
   already buried in it, which is the reason the route exists. */
function chain(cx, cy, col){
  const w = 50;
  return path("M"+n1(cx - w)+" "+n1(cy)+
    "q"+n1(w*0.3)+" -18 "+n1(w*0.55)+" 0 q"+n1(w*0.3)+" 18 "+n1(w*0.6)+" 0 " +
    "q"+n1(w*0.3)+" -18 "+n1(w*0.55)+" 0", col, 5);
}
function folded(cx, cy, col, cofactor){
  const g = G.el("g", {});
  g.appendChild(G.el("path", {d:"M"+n1(cx-40)+" "+n1(cy)+
    "c0 -26 18 -40 40 -40 c24 0 40 16 40 40 c0 24 -18 40 -40 40 "+
    "c-23 0 -40 -15 -40 -40 Z", fill:col, "fill-opacity":".16", stroke:col,
    "stroke-width":3.4, "stroke-linejoin":"round"}));
  if (cofactor){
    g.appendChild(G.el("circle", {cx:n1(cx), cy:n1(cy), r:12, fill:C.amber,
      stroke:C.amber, "stroke-width":2}));
    g.appendChild(G.text(cx + 56, cy + 6, "cofactor bound", 18, C.amber,
      700, "start"));
  }
  return g;
}
function up(cx, y0, y1, col){
  const g = G.el("g", {});
  g.appendChild(path("M"+n1(cx)+" "+n1(y0)+"V"+n1(y1 + 12), col, 3));
  g.appendChild(path("M"+n1(cx - 9)+" "+n1(y1 + 13)+"L"+n1(cx)+" "+n1(y1)+
    "L"+n1(cx + 9)+" "+n1(y1 + 13), col, 3));
  return g;
}

const FR = [
{ s:{sig:1, hi:1},
  cap:"the same job, and <b>not</b> the same tag",
  call:"two motifs, and nearly twice the length &#183; a Tat signal is its own thing",
  note:"Two real E. coli signal peptides, and the point of putting them one above the other is that a Tat signal is not a Sec signal with two arginines bolted on the front. Look at the length first. PhoA, the Sec substrate, is twenty-one residues. TorA, which is the standard Tat substrate and the signal everybody borrows when they want to push something down this route, is thirty-nine. Now the motifs, and there are two of them. The twin arginine is the one the pathway is named for, and notice where it is: not at the very start, but about a quarter of the way in, at the join between the charged region and the hydrophobic one. The second is the pair of basic residues down near the cleavage site, and that one has a job people rarely hear about. It is a Sec-avoidance motif. It is there to stop Sec picking the protein up, because otherwise these two signals are similar enough that it would. Between them, and the h-region here being longer and less hydrophobic than PhoA's, this is a different object with a different grammar.",
  desc:"Two E. coli signal peptides compared: PhoA at 21 residues for Sec, and TorA at 39 for Tat. On the TorA sequence two regions are marked \u2014 the twin-arginine motif about a quarter of the way in, and a pair of basic residues near the cleavage site which act as a Sec-avoidance motif." },

{ s:{sig:1, hi:1, memb:1, sec:1},
  cap:"<b>Sec</b> threads an <b>unfolded</b> chain",
  call:"it folds on the far side &#183; which is why the periplasm being oxidising matters",
  note:"Sec takes the protein unfolded. The chain is threaded through the translocon more or less as it comes off the ribosome, and it does not acquire its structure until it is on the other side. That is the whole reason the previous slides made a point of the periplasm being an oxidising compartment: the folding happens there, so that is where the disulfides form. It also means Sec can move things that would be far too big to push through in one piece if they were already folded.",
  desc:"The Sec route drawn on the inner membrane: an unfolded chain is threaded through the translocon and folds once it reaches the periplasm." },

{ s:{sig:1, hi:1, memb:1, sec:1, tat:1},
  cap:"<b>Tat</b> moves it <b>already folded</b>",
  call:"for anything that had to pick up a cofactor <b>before</b> it could leave",
  note:"Tat does the opposite, and the name says how you spot it: twin-arginine translocase. It takes the protein fully folded and pushes it through in one piece, which sounds like the harder way to do it until you ask why anything would need that. The answer is cofactors. An iron-sulfur cluster, a molybdopterin, a nickel centre: those get assembled in the cytoplasm, and a protein that has to wrap itself around one cannot be exported as a bare chain and expected to find it again on the far side. TorA, the signal on the slide, is exactly that case. It folds first, loads, and leaves whole. Two consequences worth stating, because they are where the analogy with a targeting tag breaks down completely. The first is that the signal is necessary but not sufficient: Tat proofreads, and it refuses a substrate that has not folded properly, so putting a Tat signal on something that misfolds gets you nothing. The second is that a substrate does not always need a signal at all. Tat moves assembled complexes, and a folded partner subunit can cross by hitching a ride on one that does carry a signal. For engineering, the working summary is that Sec is the default and has far more capacity; you reach for Tat when the thing you are moving has to be put together before it goes.",
  desc:"The Tat route beside it: the protein folds in the cytoplasm around a bound cofactor and is then moved through the membrane in one piece, already folded." }
];

window.Deck.sequence("tat", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    if (v.sig > 0.02){
      const a = grp(v.sig);
      SIGS.forEach(function(x){ a.appendChild(strip(x, (v.hi || 0) > 0.5)); });
      g.appendChild(a);
    }
    if (v.memb > 0.02){
      const m = grp(v.memb);
      m.appendChild(bilayer(IM));
      m.appendChild(G.text(X1 + 20, IM + 26, "inner membrane", 21, C.muted,
        400, "start"));
      m.appendChild(G.text(X1 + 20, CYT + 44, "cytoplasm", 21, C.muted, 400,
        "start"));
      m.appendChild(G.text(X1 + 20, IM - 34, "periplasm", 21, C.muted, 400,
        "start"));
      g.appendChild(m);
    }
    if (v.sec > 0.02){
      const a = grp(v.sec);
      a.appendChild(chain(SEC, CYT + 70, C.blue));
      a.appendChild(pore(SEC, C.blue, 44));
      a.appendChild(up(SEC, CYT + 44, IM - 60, C.blue));
      a.appendChild(folded(SEC, IM - 104, C.blue, false));
      a.appendChild(G.text(SEC, CYT + 140, "Sec", 27, C.ink, 700));
      g.appendChild(a);
    }
    if (v.tat > 0.02){
      const b = grp(v.tat);
      b.appendChild(folded(TAT, CYT + 70, C.verm, true));
      b.appendChild(pore(TAT, C.verm, 104));
      b.appendChild(up(TAT, CYT + 26, IM - 60, C.verm));
      b.appendChild(folded(TAT, IM - 104, C.verm, false));
      b.appendChild(G.text(TAT, CYT + 140, "Tat", 27, C.ink, 700));
      g.appendChild(b);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
