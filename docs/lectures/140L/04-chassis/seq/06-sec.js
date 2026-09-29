/* ------------------------------------------------------------------ *
 * 06-sec.js — the Sec pathway, in the order it happens.
 *
 * Replaces a borrowed textbook figure beside three bullets.  The figure
 * has every object at once, frozen, so the one thing it cannot show is
 * the order -- and the order is the content.
 *
 * Storyboarded by JCA: open on a cell with a ribosome in it, then make
 * a peptide and name the signal, then put Sec in the membrane, then
 * bring the ribosome to it, then push the protein through, then fold
 * it.  Nothing is on screen before the story needs it, which is why
 * the apparatus arrives on beat three rather than sitting there from
 * the start waiting to be explained.
 *
 * Deliberately fewer objects than the source figure.  SRP, FtsY and
 * SecDF are in the notes and not on the slide: they are real and they
 * are not what a first pass through this needs to carry.  SecY, SecE
 * and SecG are drawn as ONE body, because they are one translocon, and
 * SecA docks against it rather than floating nearby.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;
const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);
const lerp = (a, b, t) => a + (b - a)*cl(t, 0, 1);

function grp(o){ return G.el("g", {opacity:n1(cl(o == null ? 1 : o, 0, 1))}); }
function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 3,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return G.el("path", a);
}

const X0 = 150, X1 = 1300, MH = 38;
const OM = 246, IM = 470;
const PERI = OM + MH, CYT = IM + MH;
/* RIB1 puts the ribosome under the channel mouth, so the peptide it
   is carrying arrives AT the translocon rather than beside it */
const YEG0 = 630, YEG1 = 780, PORE = 700;
const SECA = 890, SPASE = 1030;
const RIB0 = 360, RIB1 = 700, RIBY = CYT + 172;

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
function unit(x0, x1, label, col, lx, dy, h){
  const g = G.el("g", {}), H = h || (MH + 26), y = IM - 13 + (dy || 0);
  g.appendChild(G.el("rect", {x:n1(x0), y:n1(y), width:n1(x1 - x0), height:H,
    rx:Math.min(20, (x1 - x0)/2), fill:col, "fill-opacity":".2", stroke:col,
    "stroke-width":3}));
  const cx = lx == null ? (x0 + x1)/2 : lx;
  g.appendChild(G.el("text", {x:n1(cx), y:n1(y + H/2 + 6), "font-size":18,
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
  g.appendChild(G.el("ellipse", {cx:n1(cx), cy:n1(cy + 24), rx:88, ry:42,
    fill:C.muted, "fill-opacity":".18", stroke:C.muted, "stroke-width":2.8}));
  g.appendChild(G.el("ellipse", {cx:n1(cx), cy:n1(cy - 18), rx:58, ry:28,
    fill:C.muted, "fill-opacity":".18", stroke:C.muted, "stroke-width":2.8}));
  g.appendChild(G.text(cx, cy + 30, "ribosome", 19, C.muted, 700));
  return g;
}
/* the signal peptide: three regions, so its anatomy is something to
   point at rather than a bullet list */
function signal(x, y, vert){
  const g = G.el("g", {}), L = 104;
  [[0, .26, 0], [.26, .78, 1], [.78, 1, 0]].forEach(function(sg){
    const a = sg[0]*L, b = sg[1]*L;
    g.appendChild(G.el("rect", vert
      ? {x:n1(x - 9), y:n1(y - b), width:18, height:n1(b - a), rx:3,
         fill:C.verm, "fill-opacity":sg[2] ? ".34" : ".16", stroke:C.verm,
         "stroke-width":2.4}
      : {x:n1(x + a), y:n1(y - 9), width:n1(b - a), height:18, rx:3,
         fill:C.verm, "fill-opacity":sg[2] ? ".34" : ".16", stroke:C.verm,
         "stroke-width":2.4}));
  });
  return g;
}

const FR = [
{ s:{cell:1, rib:1},
  cap:"a cell, and a ribosome doing its job",
  call:"two membranes to get past &#183; and nothing yet that knows how",
  note:"Open on the situation rather than the machinery. Two membranes, and a ribosome in the cytoplasm translating an mRNA like any other. Nothing on this slide yet knows that this particular protein is going anywhere.",
  desc:"A cell drawn as two membranes with a ribosome in the cytoplasm translating an mRNA." },

{ s:{cell:1, rib:1, pep:1},
  cap:"and the first thing out is an <b>address</b>",
  call:"18&#8211;30 residues &#183; basic at the front, then a hydrophobic core",
  note:"Translation starts and the first thing out of the ribosome is the signal peptide. Eighteen to thirty residues, and it has three parts you can see in any of them: one or more basic residues at the very front, then a hydrophobic core of seven or more, which is the part that actually gets recognised, then a small cleavable end. Three names, all the same object: pre sequence, signal sequence, leader sequence. And it is recognised before the protein is anywhere near finished, which matters, because a protein that folds in the cytoplasm is not going anywhere afterwards.",
  desc:"The nascent chain emerges from the ribosome with a signal peptide on the front, drawn as three regions \— basic residues, a hydrophobic core, and a cleavage site \— and labelled as 18 to 30 residues." },

{ s:{cell:1, rib:1, pep:1, sec:1, srp:1},
  cap:"<b>SRP</b> grabs it, and <b>Sec</b> is where it is going",
  call:"one channel, and a motor that burns ATP to push it through",
  note:"Two things arrive at once. SRP, the signal recognition particle, binds that hydrophobic core the moment it is clear of the ribosome, and while it is bound translation slows right down, which matters more than it sounds: it stops the protein being finished and folded in the cytoplasm before it ever gets anywhere. And the apparatus it is heading for. SecY, SecE and SecG are one thing, a single translocon, and that is the hole the protein goes through. SecA sits against it on the cytoplasmic face and it is the motor: it grips the chain, hydrolyses ATP, shoves it through, lets go, grips further along, repeats. Signal peptidase waits further along the membrane.",
  desc:"SRP binds the hydrophobic core of the signal peptide, and the Sec apparatus appears in the inner membrane: the SecYEG translocon drawn as a single body, SecA docked against its cytoplasmic face, and signal peptidase further along." },

{ s:{cell:1, rib:1, pep:1, sec:1, srp:1, dock:1},
  cap:"<b>SRP</b> carries the ribosome over",
  call:"still translating &#183; the protein arrives unfinished, and that is the point",
  note:"SRP delivers the whole ribosome to the membrane, handing off to a receptor called FtsY, and translation picks up again right there at the translocon. Notice what that gets you: the protein arrives unfolded and unfinished, feeding straight from the ribosome into the channel. Sec cannot move a folded protein, so this coupling is not an optimisation, it is the requirement. SRP lets go once the chain is in the channel and goes back for the next one.",
  desc:"SRP carries the ribosome to the Sec translocon, where translation continues and the chain feeds directly into the channel." },

{ s:{cell:1, rib:1, sec:1, dock:1, thru:1},
  cap:"and it is pushed <b>through</b>",
  call:"grip, hydrolyse, shove, let go &#183; and again, all the way along",
  note:"SecA pushes the chain through as it is made, one ATP at a time, and the protein emerges into the periplasm as a bare thread. Then signal peptidase cuts the address off, and it can only do that once the protein has come through, so the cell is committed before the label is removed. The peptide itself stays behind in the membrane and is degraded there. What comes off is the mature protein, starting exactly where you wanted it to start, which is what the signal peptide was for.",
  desc:"SecA pushes the chain through the translocon into the periplasm, and signal peptidase cleaves the signal peptide, which stays behind in the membrane." },

{ s:{cell:1, sec:1, fold:1},
  cap:"and it folds on the <b>far side</b>",
  call:"which is why the periplasm being oxidising is the whole point",
  note:"And only now does it fold, in the periplasm. This is an oxidising compartment, so disulfides form here and not in the cytoplasm, which is why anything that needs them goes this way. Count what the cell spent to do it: a recognition particle, a receptor, a channel, an ATP-burning motor and a protease, all to move one chain across one membrane and take twenty residues off the front. That is what a signal peptide actually buys.",
  desc:"The mature protein folds in the periplasm, an oxidising compartment where disulfide bonds can form." }
];

window.Deck.sequence("secpath", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});
    const rx = lerp(RIB0, RIB1, v.dock || 0);

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
    if (v.rib > 0.02){
      const r = grp(v.rib);
      r.appendChild(ribosome(rx, RIBY));
      r.appendChild(path("M"+n1(X0 + 10)+" "+n1(RIBY + 78)+
        "Q"+n1(rx - 150)+" "+n1(RIBY + 122)+" "+n1(rx + 104)+" "+n1(RIBY + 62),
        C.muted, 2.6));
      r.appendChild(G.text(X0 + 2, RIBY + 74, "mRNA", 19, C.muted, 400, "end"));
      g.appendChild(r);
    }

    /* the peptide, riding on whatever x the ribosome is at */
    if (v.pep > 0.02 && (v.thru || 0) < 0.5){
      const named = (v.dock || 0) < 0.5;
      const p = grp(v.pep), top = RIBY - 52;
      /* the peptide fills the gap between the ribosome and the membrane
         exactly, so it never rides up into the bilayer and its label
         has somewhere flat to sit */
      p.appendChild(path("M"+n1(rx)+" "+n1(top)+"V"+n1(top - 16), C.ink, 3.4));
      p.appendChild(signal(rx, top - 16, true));
      if (named){
        p.appendChild(path("M"+n1(rx + 13)+" "+n1(top - 78)+
          "L"+n1(rx + 54)+" "+n1(top - 92), C.verm, 2.2));
        p.appendChild(G.text(rx + 64, top - 90, "signal peptide", 21, C.verm, 700, "start"));
        p.appendChild(G.text(rx + 64, top - 64,
          "18–30 residues · hydrophobic core", 19, C.muted, 400, "start"));
      }
      g.appendChild(p);
    }

    /* SRP has hold of the hydrophobic core, so it is drawn against the
       peptide and moves with it -- it is what carries the ribosome
       over, and it lets go once the chain is in the channel */
    if (v.srp > 0.02 && (v.thru || 0) < 0.5){
      const q = grp(v.srp);
      q.appendChild(blob(rx - 54, RIBY - 120, 44, 32, "SRP", C.verm, 19));
      g.appendChild(q);
    }
    if (v.sec > 0.02){
      const m = grp(v.sec);
      m.appendChild(unit(YEG0, YEG1, "SecYEG", C.blue, YEG0 + 30));
      m.appendChild(blob(SECA, CYT + 42, 58, 38, "SecA", C.blue, 20));
      m.appendChild(unit(SPASE - 22, SPASE + 22, "SPase I", C.verm, null, -6, MH + 30));
      g.appendChild(m);
    }

    /* through the channel, and the peptide left behind */
    if (v.thru > 0.02){
      const t = grp(v.thru);
      t.appendChild(path("M"+n1(RIB1)+" "+n1(RIBY - 52)+"V"+n1(CYT - 6), C.ink, 3.4));
      t.appendChild(path("M"+n1(PORE)+" "+n1(IM + 4)+"V"+n1(PERI + 70), C.ink, 3.4));
      t.appendChild(signal(862, IM + MH - 6, true));
      t.appendChild(G.text(862, IM - 86, "peptide stays", 19, C.verm, 700));
      t.appendChild(G.text(SECA, CYT + 100, "ATP → ADP + Pᵢ", 20, C.blue, 700));
      g.appendChild(t);
    }

    if (v.fold > 0.02){
      const d = grp(v.fold), FX = 430, FY = 366;
      d.appendChild(G.el("path", {d:"M"+n1(FX - 46)+" "+n1(FY)+
        "c0 -30 20 -46 46 -46 c28 0 46 18 46 46 c0 28 -20 46 -46 46 "+
        "c-26 0 -46 -17 -46 -46 Z", fill:C.blue, "fill-opacity":".18",
        stroke:C.blue, "stroke-width":3.4, "stroke-linejoin":"round"}));
      d.appendChild(G.text(FX + 66, FY - 8, "folds here", 22, C.blue, 700, "start"));
      d.appendChild(G.text(FX + 66, FY + 22, "oxidising · disulfides form", 20,
        C.muted, 400, "start"));
      g.appendChild(d);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
