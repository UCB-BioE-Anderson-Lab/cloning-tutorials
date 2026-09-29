/* ------------------------------------------------------------------ *
 * 06-sec.js — the Sec pathway, as the process it is.
 *
 * Replaces a borrowed textbook figure beside three bullets about the
 * anatomy of a signal peptide.  The figure has every object you need --
 * mRNA, ribosome, SRP, FtsY, SecDF, SecYEG, SecA with its ATP, the
 * signal sequence, signal peptidase, the pH gradient -- and shows them
 * all at once, frozen, so the one thing it cannot show is the order
 * they act in.  That order is the content.
 *
 * Same objects, same anatomy, redrawn in the deck's language and on the
 * same cross-section as the rest of the section, so it is the cell the
 * room has already been looking at.  The bullets are gone because the
 * signal peptide is now drawn with its three regions, which says
 * "basic n-region, hydrophobic core, cleavage site" without a list.
 *
 * Colour is doing one job: vermillion is the signal peptide and the
 * things that act on it, SRP at the start and signal peptidase at the
 * end.  Everything the protein merely passes through is blue or muted.
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

const X0 = 150, X1 = 1290, MH = 38;
const OM = 246, IM = 470;                  /* membrane tops             */
const PERI = OM + MH, CYT = IM + MH;
/* the machinery, left to right as the source figure has it */
const FTSY = 356, SECD = 452, SECF = 512, SECY = 618, SECE = 672, SECG = 726;
const SECA = 820, SPASE = 950, PORE = 672;

function bilayer(yTop){
  const g = G.el("g", {}), r = 7, step = 19;
  g.appendChild(G.el("rect", {x:X0, y:n1(yTop), width:X1 - X0, height:MH,
    fill:C.amber, "fill-opacity":".13", stroke:"none"}));
  for (let x = X0 + r + 2; x < X1 - r; x += step){
    [yTop + r + 1, yTop + MH - r - 1].forEach(function(y){
      g.appendChild(G.el("circle", {cx:n1(x), cy:n1(y), r:r, fill:C.amber,
        "fill-opacity":".55", stroke:C.amber, "stroke-width":1.2}));
    });
  }
  return g;
}
/* a membrane protein: a capsule sitting in the bilayer, named down it */
function unit(cx, label, col, w, h, dy){
  const g = G.el("g", {}), W = w || 40, H = h || (MH + 26), y = IM - 13 + (dy || 0);
  g.appendChild(G.el("rect", {x:n1(cx - W/2), y:n1(y), width:W, height:H,
    rx:W/2, fill:col, "fill-opacity":".2", stroke:col, "stroke-width":2.6}));
  g.appendChild(G.el("text", {x:n1(cx), y:n1(y + H/2), "font-size":17,
    fill:col, "font-weight":700, "text-anchor":"middle",
    transform:"rotate(-90 "+n1(cx)+" "+n1(y + H/2)+")"}, label));
  return g;
}
function blob(cx, cy, rx, ry, label, col, size){
  const g = G.el("g", {});
  g.appendChild(G.el("ellipse", {cx:n1(cx), cy:n1(cy), rx:rx, ry:ry, fill:col,
    "fill-opacity":".2", stroke:col, "stroke-width":2.8}));
  if (label) g.appendChild(G.text(cx, cy + 7, label, size || 19, col, 700));
  return g;
}
function ribosome(cx, cy){
  const g = G.el("g", {});
  g.appendChild(G.el("ellipse", {cx:n1(cx), cy:n1(cy + 26), rx:92, ry:44,
    fill:C.muted, "fill-opacity":".18", stroke:C.muted, "stroke-width":2.8}));
  g.appendChild(G.el("ellipse", {cx:n1(cx), cy:n1(cy - 18), rx:62, ry:30,
    fill:C.muted, "fill-opacity":".18", stroke:C.muted, "stroke-width":2.8}));
  g.appendChild(G.text(cx, cy + 34, "ribosome", 19, C.muted, 700));
  return g;
}
/* the signal peptide, drawn as the three regions it is made of */
function signal(x, y, vert, showParts){
  const g = G.el("g", {}), L = 112;
  const seg = [[0, .26, "n"], [.26, .78, "h"], [.78, 1, "c"]];
  seg.forEach(function(s){
    const a = s[0]*L, b = s[1]*L;
    const at = vert
      ? {x:n1(x - 9), y:n1(y - b), width:18, height:n1(b - a)}
      : {x:n1(x + a), y:n1(y - 9), width:n1(b - a), height:18};
    g.appendChild(G.el("rect", Object.assign(at, {rx:3, fill:C.verm,
      "fill-opacity":s[2] === "h" ? ".34" : ".16", stroke:C.verm,
      "stroke-width":2.4})));
  });
  if (showParts && !vert){
    g.appendChild(G.text(x + L*0.13, y - 22, "basic", 18, C.verm, 700));
    g.appendChild(G.text(x + L*0.52, y - 22, "hydrophobic core", 18, C.verm, 700));
    g.appendChild(G.text(x + L*0.89, y - 22, "cut", 18, C.verm, 700));
    g.appendChild(G.text(x + L/2, y + 38, "18–30 residues", 19, C.muted, 400));
  }
  return g;
}

const FR = [
{ s:{cell:1, mach:1},
  cap:"everything in the wall, before anything happens",
  call:"one channel, one motor, and a protease waiting at the far end",
  note:"Start with the parts, because the textbook picture shows them all at once and that is the one thing it cannot explain: the order. In the inner membrane there is a channel, SecY, SecE and SecG together, and that is the hole the protein actually goes through. SecD and SecF sit beside it and help pull the chain out on the far side. FtsY is the docking point. SecA is underneath on the cytoplasmic face, and it is the motor: it burns ATP to push the chain through, one shove at a time. And over on the right, signal peptidase, waiting in the membrane with its active site on the periplasmic face. Notice where that is, because it tells you when it can act.",
  desc:"The inner and outer membranes with the Sec machinery in place: FtsY, SecD and SecF, the SecYEG channel, SecA on the cytoplasmic face, and signal peptidase to the right with its active site facing the periplasm." },

{ s:{cell:1, mach:1, rib:1, sig:1},
  cap:"the protein is made with an <b>address on the front</b>",
  call:"basic residues, then a hydrophobic core &#183; that shape is the whole signal",
  note:"Translation starts, and the first thing out of the ribosome is the signal peptide. Eighteen to thirty residues, and it has three parts you can see in any of them. One or more basic residues at the very front. Then a hydrophobic core, seven residues or more, and that stretch is doing most of the work: it is what gets recognised and it is what lets the thing sit in a membrane. Then a small cleavable end. This goes by three names and they all mean the same object: pre sequence, signal sequence, leader sequence.",
  desc:"Translation begins and the signal peptide emerges from the ribosome, drawn as three regions: basic residues at the front, a hydrophobic core in the middle, and a small cleavage site at the end, totalling 18 to 30 residues." },

{ s:{cell:1, mach:1, rib:1, srp:1, dock:1},
  cap:"<b>SRP</b> grabs it and takes the ribosome to the membrane",
  call:"the protein is not finished yet &#183; and that is the point",
  note:"SRP is the recognition step. It binds the hydrophobic core as soon as it is clear of the ribosome, and while it is bound translation slows right down, which matters more than it sounds: it stops the protein being finished and folded in the cytoplasm before it ever reaches the membrane. SRP then docks on FtsY, which hands the whole ribosome over to the translocon. So the protein arrives at the channel still being made, still unfolded, which is exactly the state Sec needs it in.",
  desc:"SRP binds the hydrophobic core of the signal peptide, slowing translation, and docks the ribosome onto FtsY at the membrane." },

{ s:{cell:1, mach:1, rib:1, thread:1, atp:1},
  cap:"<b>SecA</b> pushes it through, ATP at a time",
  call:"the channel is <b>SecYEG</b> &#183; the pH gradient helps pull from the far side",
  note:"Now the chain feeds into SecYEG and goes through as it is made. SecA is the motor and it is worth being concrete about it: it grips a stretch of the chain, hydrolyses ATP, shoves it through, lets go, grips further along, and repeats. That is why this costs energy. The proton gradient across the membrane helps from the other side, and SecD and SecF use it to pull the emerging chain out into the periplasm so it does not slide back. Nothing is folded yet at this point. The protein is a bare thread passing through a hole.",
  desc:"The nascent chain feeds into the SecYEG channel and is pushed through by SecA using ATP, with the proton gradient and SecDF pulling from the periplasmic side." },

{ s:{cell:1, mach:1, cut:1},
  cap:"<b>signal peptidase</b> cuts the address off",
  call:"its active site faces the <b>periplasm</b> &#183; so it can only cut what has arrived",
  note:"Signal peptidase sits in the membrane with its active site on the periplasmic face, and that geometry is the whole of its specificity. It cannot reach a signal peptide that is still in the cytoplasm. It can only cut once the cleavage site has come through, which means the protein is committed before the address is removed. The signal peptide itself stays behind in the membrane and is degraded there. What comes off is the mature protein, starting exactly where you wanted it to start.",
  desc:"Signal peptidase, with its active site on the periplasmic face, cleaves the signal peptide from the translocated chain; the peptide remains in the membrane." },

{ s:{cell:1, mach:1, done:1},
  cap:"and it folds on the <b>far side</b>",
  call:"which is why the periplasm being oxidising is the whole point",
  note:"And only now does it fold, in the periplasm, which is where the last few slides came from. This is an oxidising compartment, so disulfides form here and not in the cytoplasm, and that is why anything that needs them goes this way. Count what the cell has spent: a recognition particle, a docking protein, a channel, an ATP-burning motor, a proton gradient and a protease, all to move one chain across one membrane and take twenty residues off the front of it. That is what a signal peptide actually buys you.",
  desc:"The mature protein folds in the periplasm, an oxidising compartment where disulfide bonds can form." }
];

window.Deck.sequence("secpath", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    if (v.cell > 0.02){
      const c = grp(v.cell);
      c.appendChild(bilayer(OM));
      c.appendChild(bilayer(IM));
      c.appendChild(G.text(X1 + 18, OM + 25, "outer membrane", 20, C.muted, 400, "start"));
      c.appendChild(G.text(X1 + 18, PERI + 46, "periplasm", 20, C.muted, 400, "start"));
      c.appendChild(G.text(X1 + 18, IM + 25, "inner membrane", 20, C.muted, 400, "start"));
      c.appendChild(G.text(X1 + 18, CYT + 46, "cytoplasm", 20, C.muted, 400, "start"));
      g.appendChild(c);
    }

    if (v.mach > 0.02){
      const m = grp(v.mach);
      m.appendChild(unit(FTSY, "FtsY", C.muted, 38, MH + 40, 14));
      m.appendChild(unit(SECD, "SecD", C.muted));
      m.appendChild(unit(SECF, "SecF", C.muted));
      m.appendChild(unit(SECY, "SecY", C.blue, 44));
      m.appendChild(unit(SECE, "SecE", C.blue, 44));
      m.appendChild(unit(SECG, "SecG", C.blue, 44));
      m.appendChild(blob(SECA, CYT + 44, 54, 38, "SecA", C.blue, 20));
      m.appendChild(unit(SPASE, "SPase I", C.verm, 40, MH + 30, -6));
      m.appendChild(G.text(SPASE + 46, IM - 34, "active site", 18, C.verm, 700, "start"));
      m.appendChild(G.text(SPASE + 46, IM - 12, "faces this way", 18, C.verm, 400, "start"));
      m.appendChild(G.text(X1 - 20, PERI + 24, "ΔpH", 21, C.muted, 700, "end"));
      g.appendChild(m);
    }

    /* the ribosome, where it is at this point in the story */
    if (v.rib > 0.02){
      const r = grp(v.rib);
      const rx = (v.dock || 0) > 0.5 || (v.thread || 0) > 0.5 ? 590 : 400;
      r.appendChild(ribosome(rx, CYT + 170));
      r.appendChild(path("M"+n1(X0 + 30)+" "+n1(CYT + 268)+
        "q90 34 "+n1(rx - X0 - 120)+" -28", C.muted, 2.6));
      r.appendChild(G.text(X0 + 20, CYT + 264, "mRNA", 19, C.muted, 400, "end"));
      g.appendChild(r);
    }

    /* the signal peptide, out of the ribosome and named */
    if (v.sig > 0.02){
      const p = grp(v.sig);
      p.appendChild(path("M400 "+n1(CYT + 124)+"V"+n1(CYT + 76), C.ink, 3.4));
      p.appendChild(signal(400 - 56, CYT + 66, false, true));
      g.appendChild(p);
    }

    /* SRP on the core, and the hand-off to FtsY */
    if (v.srp > 0.02){
      const q = grp(v.srp);
      q.appendChild(path("M590 "+n1(CYT + 124)+"V"+n1(CYT + 84), C.ink, 3.4));
      q.appendChild(signal(590, CYT + 84, true));
      q.appendChild(blob(536, CYT + 50, 46, 32, "SRP", C.verm, 19));
      q.appendChild(path("M"+n1(FTSY + 22)+" "+n1(CYT + 58)+"H"+n1(490),
        C.verm, 2.6, "6 5"));
      q.appendChild(G.text(FTSY + 6, CYT + 112, "docks on FtsY", 19, C.verm, 700));
      g.appendChild(q);
    }

    /* threading: the chain through the channel, SecA on the tail */
    if (v.thread > 0.02){
      const t = grp(v.thread);
      /* ribosome to the channel mouth */
      t.appendChild(path("M590 "+n1(CYT + 124)+"V"+n1(CYT + 30)+
        "Q"+n1(PORE)+" "+n1(CYT + 8)+" "+n1(PORE)+" "+n1(CYT + 22), C.ink, 3.4));
      /* the signal peptide, inserted in the bilayer it is crossing */
      t.appendChild(signal(PORE, IM + 58, true));
      t.appendChild(G.text(PORE - 28, IM + 22, "N", 22, C.verm, 700, "end"));
      /* and the mature chain, out into the periplasm */
      t.appendChild(path("M"+n1(PORE)+" "+n1(IM - 54)+"V"+n1(PERI + 72), C.ink, 3.4));
      t.appendChild(G.text(PORE, PERI + 58, "mature chain", 19, C.muted, 400));
      g.appendChild(t);
    }
    if (v.atp > 0.02){
      const a = grp(v.atp);
      a.appendChild(G.text(SECA, CYT + 108, "ATP", 20, C.blue, 700));
      a.appendChild(path("M"+n1(SECA - 26)+" "+n1(CYT + 124)+"h52m-10 -7l10 7l-10 7",
        C.blue, 2.4));
      a.appendChild(G.text(SECA, CYT + 158, "ADP + Pᵢ", 20, C.muted, 400));
      g.appendChild(a);
    }

    /* the cut, and what is left behind */
    if (v.cut > 0.02){
      const k = grp(v.cut);
      k.appendChild(signal(PORE, IM + 58, true));
      k.appendChild(path("M"+n1(PORE)+" "+n1(IM - 54)+"V"+n1(PERI + 72), C.ink, 3.4));
      /* the blade comes in from the periplasmic face, which is the
         only side signal peptidase can reach from */
      k.appendChild(path("M"+n1(SPASE - 26)+" "+n1(IM - 40)+
        "H"+n1(PORE + 30), C.verm, 3, "7 6"));
      k.appendChild(path("M"+n1(PORE - 34)+" "+n1(IM - 64)+
        "l62 22m0 -22l-62 22", C.verm, 4.4));
      k.appendChild(G.text(PORE - 44, IM - 84, "cut here", 20, C.verm, 700, "end"));
      g.appendChild(k);
    }

    /* folded, on the far side */
    if (v.done > 0.02){
      const d = grp(v.done), FX = 420, FY = 368;
      /* the periplasm is only ~190px deep, so the folded protein takes
         its captions beside it rather than under it: stacked, they land
         on the channel proteins */
      d.appendChild(G.el("path", {d:"M"+n1(FX - 46)+" "+n1(FY)+
        "c0 -30 20 -46 46 -46 c28 0 46 18 46 46 c0 28 -20 46 -46 46 "+
        "c-26 0 -46 -17 -46 -46 Z", fill:C.blue, "fill-opacity":".18",
        stroke:C.blue, "stroke-width":3.4, "stroke-linejoin":"round"}));
      d.appendChild(G.text(FX + 66, FY - 8, "folds here", 22, C.blue, 700, "start"));
      d.appendChild(G.text(FX + 66, FY + 22,
        "oxidising · disulfides form", 20, C.muted, 400, "start"));
      /* and the peptide left behind, clear of SecA */
      d.appendChild(signal(880, IM + MH - 4, true));
      d.appendChild(G.text(898, IM + 68, "peptide stays,", 19, C.verm, 400, "start"));
      d.appendChild(G.text(898, IM + 92, "and is degraded", 19, C.verm, 400, "start"));
      g.appendChild(d);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
