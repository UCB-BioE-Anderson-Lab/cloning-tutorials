/* ------------------------------------------------------------------ *
 * 06-tat.js — the second way across the inner membrane.
 *
 * Three things are worth saying about Tat and the slide says those
 * three and stops: there is a second system, it folds the protein
 * before it exports it, and the thing it recognises is a short motif.
 *
 * AND THE POINT ABOUT THE MOTIF IS CONTEXT, NOT SIZE.  An earlier
 * draft said the signal peptide is long and the recognition element
 * inside it is small, which is arithmetic rather than biology and
 * leaves the room thinking RR is a tag you can paste anywhere.  It is
 * not.  Arginine pairs are everywhere; what makes one of them a Tat
 * motif is where it sits -- at the n/h boundary of a signal peptide,
 * with a serine or threonine in front and the hydrophobic core behind.
 *
 * HyaA proves it on its own, which is why it gets a beat.  Its signal
 * peptide contains TWO arginine pairs: an MRR at 11 that does nothing,
 * and the real TRRSFLK at 17.  Same peptide, same residues, different
 * context, and only one of them is read.
 *
 * Windows taken from UniProt, aligned on the first S/T-R-R.  Matching
 * on a bare "RR" puts HyaA on the wrong pair: it has an MRR at 11
 * before the real TRRSFLK at 17.
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

const X0 = 250, X1 = 1310, MH = 40;
const IM = 470, CYT = IM + MH;
const SEC = 540, TAT = 1040;

/* ---- the motif, as five real substrates rather than one annotated - */
const FS = 30, CW = 18.06, AX = 700, RR = 4;
const ROWS = [
  ["TorA", "FQAS", "RR", "RFLAQL"],
  ["NapA", "MKLS", "RR", "SFMKAN"],
  ["HyaA", "QGVT", "RR", "SFLKYC"],
  ["SufI", "MSLS", "RR", "QFIQAS"],
  ["DmsA", "AEVS", "RR", "GLVKTT"]
];
const AY0 = 262, ADY = 54;
/* HyaA's signal peptide entire, UniProt P69739 residues 1-45, with the
   index of each arginine pair: the decoy first, then the motif. */
const HYAA = "MNNEETFYQAMRRQGVTRRSFLKYCSLAATSLGLGAGMAPKIAWA";
const HX = 420, HFS = 26, HCW = 15.65, HY = 468;
const DECOY = 11, MOTIF = 17;

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
function chain(cx, cy, col){
  const w = 52;
  return path("M"+n1(cx - w)+" "+n1(cy)+
    "q"+n1(w*0.3)+" -18 "+n1(w*0.55)+" 0 q"+n1(w*0.3)+" 18 "+n1(w*0.6)+" 0 " +
    "q"+n1(w*0.3)+" -18 "+n1(w*0.55)+" 0", col, 5);
}
function folded(cx, cy, col){
  return G.el("path", {d:"M"+n1(cx-40)+" "+n1(cy)+
    "c0 -26 18 -40 40 -40 c24 0 40 16 40 40 c0 24 -18 40 -40 40 "+
    "c-23 0 -40 -15 -40 -40 Z", fill:col, "fill-opacity":".16", stroke:col,
    "stroke-width":3.4, "stroke-linejoin":"round"});
}
function up(cx, y0, y1, col){
  const g = G.el("g", {});
  g.appendChild(path("M"+n1(cx)+" "+n1(y0)+"V"+n1(y1 + 12), col, 3));
  g.appendChild(path("M"+n1(cx - 9)+" "+n1(y1 + 13)+"L"+n1(cx)+" "+n1(y1)+
    "L"+n1(cx + 9)+" "+n1(y1 + 13), col, 3));
  return g;
}

const FR = [
{ s:{memb:1},
  cap:"there is a <b>second</b> way across the inner membrane",
  call:"same membrane, same destination &#183; a different machine",
  note:"Everything so far on this section has quietly meant Sec. There is a second translocon sitting in the same membrane, it delivers to the same compartment, and it is called Tat, for twin-arginine translocase. A protein carrying an N-terminal signal peptide might be going through either one, and until you look at the signal you do not know which.",
  desc:"The inner membrane with two translocons in it side by side, labelled Sec and Tat." },

{ s:{memb:1, cargo:1},
  cap:"Tat moves the protein <b>already folded</b>",
  call:"Sec threads a bare chain &#183; Tat pushes a finished one through",
  note:"And here is the difference that matters. Sec takes the chain unfolded, threads it through, and the protein folds once it is on the other side, which is why the periplasm being an oxidising compartment mattered two slides ago. Tat does the opposite: the protein folds in the cytoplasm first and then goes through in one piece. The reason anything would need that is cofactors. An iron-sulfur cluster, a molybdopterin, a nickel centre, all of those are assembled in the cytoplasm, and a protein that has to close around one cannot be sent through as a bare chain and expected to find it again on the far side. So it folds, it loads, and it leaves whole. Tat also refuses substrates that have not folded properly, which makes it a quality-control step as well as a route.",
  desc:"The two routes compared across the same membrane: Sec threading an unfolded chain which folds in the periplasm, and Tat moving an already folded protein through in one piece." },

{ s:{align:1},
  cap:"the pattern it reads is <b>RR</b>",
  call:"<b>S/T &#183; R R &#183; x &#183; F &#183; L &#183; K</b> &#183; the arginines are the invariant part",
  note:"So how does the cell know which translocon a protein is for? A short motif near the front of the signal peptide. These are five real E. coli Tat substrates lined up on it, and you can read the pattern off the column: a serine or threonine, then two arginines, then almost anything, then a hydrophobic residue or two. The arginines are the invariant part and they are what the pathway is named for. That is also exactly what SignalP is looking at when it tells you Tat rather than Sec.",
  desc:"Five E. coli Tat substrates — TorA, NapA, HyaA, SufI and DmsA — with the region around their twin-arginine motifs aligned in a column, the two arginines picked out, and the consensus given as S or T, two arginines, any residue, then F, L, K." },

{ s:{hyaa:1},
  cap:"but <b>RR on its own is not a signal</b>",
  call:"same peptide, two arginine pairs &#183; only one of them is read",
  note:"And this is the part to be careful about, because the motif is easy to over-read. Arginine pairs are common. Two arginines sitting next to each other in a protein tell you nothing on their own, and if you go looking for RR in a sequence you will find plenty that mean nothing at all. What makes one of them a Tat signal is where it is. It has to be near the front, inside a signal peptide, at the join between the charged part and the hydrophobic part, with a serine or threonine in front of it and the hydrophobic core running away behind it. Here is the proof, and it is the same protein that is on the previous list. HyaA's signal peptide contains two arginine pairs. The first, at position eleven, does nothing: it has a methionine in front of it and no hydrophobic stretch behind it, and the cell ignores it completely. The second, at seventeen, has the threonine in front and the core behind, and that is the one Tat reads. Same residues, same peptide, different context, and only one of them is a signal. So the honest way to hold this is not that Tat has a small tag sitting inside a big peptide. It is that the pattern is short and the pattern is not enough.",
  desc:"HyaA's complete 45-residue signal peptide written out, with both of its arginine pairs marked: the one at position 11, which is not the motif because it has no serine or threonine in front and no hydrophobic core behind, and the one at 17, which is, with the hydrophobic core bracketed after it." }
];

window.Deck.sequence("tat", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    if (v.memb > 0.02){
      const m = grp(v.memb);
      m.appendChild(bilayer(IM));
      m.appendChild(G.text(X1 + 20, IM + 26, "inner membrane", 21, C.muted, 400, "start"));
      m.appendChild(G.text(X1 + 20, CYT + 44, "cytoplasm", 21, C.muted, 400, "start"));
      m.appendChild(G.text(X1 + 20, IM - 34, "periplasm", 21, C.muted, 400, "start"));
      m.appendChild(pore(SEC, C.blue, 44));
      m.appendChild(pore(TAT, C.verm, 104));
      m.appendChild(G.text(SEC, CYT + 190, "Sec", 28, C.ink, 700));
      m.appendChild(G.text(TAT, CYT + 190, "Tat", 28, C.ink, 700));
      g.appendChild(m);
    }
    if (v.cargo > 0.02){
      const c = grp(v.cargo);
      c.appendChild(chain(SEC, CYT + 96, C.blue));
      c.appendChild(up(SEC, CYT + 68, IM - 58, C.blue));
      c.appendChild(folded(SEC, IM - 102, C.blue));
      c.appendChild(G.text(SEC, CYT + 224, "unfolded going in", 21, C.muted, 400));

      c.appendChild(folded(TAT, CYT + 96, C.verm));
      c.appendChild(up(TAT, CYT + 50, IM - 58, C.verm));
      c.appendChild(folded(TAT, IM - 102, C.verm));
      c.appendChild(G.text(TAT, CYT + 224, "folded before it leaves", 21, C.verm, 400));
      g.appendChild(c);
    }
    if (v.align > 0.02){
      const a = grp(v.align);
      /* one band down the arginine column: the pattern is a vertical
         fact, so it is drawn as one */
      a.appendChild(G.el("rect", {x:n1(AX + RR*CW - 6), y:n1(AY0 - 34),
        width:n1(2*CW + 12), height:n1(ADY*4 + 52), rx:7, fill:C.verm,
        "fill-opacity":".14", stroke:C.verm, "stroke-width":2.6}));
      ROWS.forEach(function(r, i){
        const y = AY0 + i*ADY;
        a.appendChild(G.text(AX - 34, y, r[0], 24, C.ink, 700, "end"));
        a.appendChild(G.el("text", {x:n1(AX), y:n1(y), "font-size":FS,
          fill:C.ink, "font-weight":700, "text-anchor":"start",
          "font-family":"ui-monospace,SFMono-Regular,Menlo,monospace"},
          r[1] + r[2] + r[3]));
      });
      a.appendChild(G.text(AX + RR*CW + CW, AY0 + ADY*4 + 74,
        "two arginines, every time", 22, C.verm, 700));

      g.appendChild(a);
    }
    if (v.hyaa > 0.02){
      const h = grp(v.hyaa);
      function box(i, col, w){
        return G.el("rect", {x:n1(HX + i*HCW - 4), y:n1(HY - 30),
          width:n1(2*HCW + 8), height:44, rx:5, fill:col, "fill-opacity":".16",
          stroke:col, "stroke-width":w || 2.6});
      }
      h.appendChild(box(DECOY, C.muted, 2.2));
      h.appendChild(box(MOTIF, C.verm, 3));
      h.appendChild(G.el("text", {x:HX, y:HY, "font-size":HFS, fill:C.ink,
        "font-weight":700, "text-anchor":"start",
        "font-family":"ui-monospace,SFMono-Regular,Menlo,monospace"}, HYAA));
      h.appendChild(G.text(HX - 24, HY - 2, "HyaA", 24, C.ink, 700, "end"));
      h.appendChild(G.text(HX - 24, HY + 26, "45 residues", 19, C.muted, 400, "end"));

      /* the decoy is labelled above, the real one below, so two labels
         ninety pixels apart do not sit on each other */
      const dx = HX + DECOY*HCW + HCW, mx = HX + MOTIF*HCW + HCW;
      h.appendChild(path("M"+n1(dx)+" "+n1(HY - 34)+"V"+n1(HY - 52), C.muted, 2.2));
      h.appendChild(G.text(dx, HY - 62, "also RR", 21, C.muted, 700));
      h.appendChild(G.text(dx, HY - 88, "no S/T, no core behind it", 19, C.muted, 400));
      h.appendChild(path("M"+n1(mx)+" "+n1(HY + 16)+"V"+n1(HY + 36), C.verm, 2.6));
      h.appendChild(G.text(mx, HY + 60, "this one", 21, C.verm, 700));

      /* and the context that makes it the motif */
      const cx0 = HX + 23*HCW, cx1 = HX + 44*HCW;
      h.appendChild(path("M"+n1(cx0)+" "+n1(HY + 30)+"V"+n1(HY + 44)+
        "H"+n1(cx1)+"V"+n1(HY + 30), C.muted, 2.2));
      h.appendChild(G.text((cx0 + cx1)/2, HY + 68, "hydrophobic core", 20,
        C.muted, 400));
      h.appendChild(G.text(800, HY + 178,
        "what makes it the motif is the company it keeps", 25, C.ink, 700));
      h.appendChild(G.text(800, HY + 214,
        "near the front · a serine or threonine in front of it · "+
        "the hydrophobic core behind it", 21, C.muted, 400));
      g.appendChild(h);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
