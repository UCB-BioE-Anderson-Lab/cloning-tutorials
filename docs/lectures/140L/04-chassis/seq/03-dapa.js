/* ------------------------------------------------------------------ *
 * 03-dapa.js — fix the gene you noticed, and fail anyway.
 *
 * The genotypes-and-media exercise.  WM3064 is already on the previous
 * slide as a question with a one-token answer: it will not grow on LB
 * because dapA is deleted, add DAP.  This one hands them a plasmid
 * carrying dapA and asks what grows where.
 *
 * The trap is in the genotype they were shown and did not finish
 * reading.  WM3064 is thrB1004 pro thi as well as dapA, so restoring
 * dapA buys you LB and buys you nothing at all on minimal medium.
 * Three plates, three different answers, and the wrong answer is the
 * natural one: fix the gene you noticed, forget the other three.
 *
 * Which is the whole reason genotypes and media are taught together
 * rather than as two lists.
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

/* the genotype exactly as the previous slide prints it, so they can see
   it is the same string they already answered a question about */
const GENO = [["thrB1004", 1], [" pro", 1], [" thi", 1], [" rpsL", 0],
              [" hsdS", 0], [" lacZΔM15", 0], [" RP4-1360", 0],
              [" Δ(araBAD)567", 0], [" ΔdapA", 2]];
const GX = 250, GY = 262, GFS = 25, GCW = 15.05;

const PLATES = [
  {x:430, name:"LB",            sub:"rich",              ok:1,
   why:"dapA from the plasmid · thr, pro and thi from the peptone"},
  {x:800, name:"LB + DAP",      sub:"rich, supplemented", ok:1,
   why:"grew before the plasmid too — this one proves nothing"},
  {x:1170, name:"M9 + glucose", sub:"minimal",           ok:0,
   why:"still cannot make threonine, proline or thiamine"}
];

function plate(x, y, r, state){
  const g = G.el("g", {});
  const col = state === 1 ? C.blue : state === 0 ? C.verm : C.muted;
  g.appendChild(G.el("circle", {cx:n1(x), cy:n1(y), r:r, fill:col,
    "fill-opacity":".10", stroke:col, "stroke-width":3}));
  if (state === 1){
    [[-34,-22],[-6,-40],[26,-26],[-40,12],[-8,4],[24,16],[-24,38],[12,40],
     [40,-2],[2,-16],[-48,-6],[44,28]].forEach(function(d){
      g.appendChild(G.el("circle", {cx:n1(x + d[0]), cy:n1(y + d[1]), r:7,
        fill:C.blue, "fill-opacity":".55", stroke:C.blue, "stroke-width":1.6}));
    });
  } else if (state === 0){
    g.appendChild(path("M"+n1(x-34)+" "+n1(y-34)+"l68 68m0 -68l-68 68", C.verm, 6));
  } else {
    g.appendChild(G.text(x, y + 18, "?", 54, C.muted, 700));
  }
  return g;
}

const FR = [
{ s:{geno:1, plas:1, pose:1},
  cap:"<b>Your turn.</b> You give WM3064 a plasmid carrying <b>dapA</b>",
  call:"which of these three plates grows?",
  note:"They have met this strain: the last slide asked why it will not grow on LB and the answer was the dapA deletion. So hand them the obvious fix, a plasmid carrying a working copy of dapA, and ask what grows on each of three plates. Give them a few minutes. Most rooms will say all three, because the gene that was broken has been fixed. Take answers before clicking.",
  desc:"WM3064's genotype with its auxotrophies marked, a plasmid carrying dapA, and three plates — LB, LB plus DAP, and M9 with glucose — each marked with a question mark." },

{ s:{geno:1, plas:1, fix:1},
  cap:"the plasmid does exactly what you would expect",
  call:"dapA transcribed &#183; DapA made &#183; diaminopimelate &#183; a cell wall",
  note:"Run the loop on the plasmid, because it is short. The gene is there, it is transcribed off a constitutive promoter, it makes DapA, DapA makes diaminopimelate, and diaminopimelate is the cross-linker the cell wall needs. So the thing that was killing this strain is fixed, and that part of everyone's answer is right.",
  desc:"The loop run on the plasmid: dapA is transcribed, DapA is made, diaminopimelate is produced, and the cell wall can be built." },

{ s:{geno:1, plas:1, fix:1, rich:1},
  cap:"so it grows on <b>LB</b> now, with no DAP added",
  call:"and on LB with DAP as well &#183; which tells you nothing new",
  note:"On LB, yes. It grows, and it no longer needs the DAP supplement, which is a real result. The middle plate grows too, but be careful with it: it grew before you added the plasmid as well, so it is not evidence of anything. Worth pointing out, because a control that cannot fail is a control that is not doing any work.",
  desc:"Both rich plates grow: LB without supplement now works because of the plasmid, and LB plus DAP grew before the plasmid too." },

{ s:{geno:1, plas:1, fix:1, rich:1, min:1},
  cap:"and on <b>minimal</b> it does not grow at all",
  call:"you fixed the gene you noticed &#183; the genotype had <b>four</b>",
  note:"And here is the one. Nothing grows on minimal medium, and the reason is in the genotype they were shown on the last slide and stopped reading after the first interesting token. thrB1004 is a threonine auxotrophy. pro is proline. thi is thiamine. On LB none of those matter, because the peptone and the yeast extract hand all three over. On M9 with glucose the cell has to make everything itself, and this one cannot make three separate things regardless of what you did about the fourth.",
  desc:"The minimal plate does not grow, because thrB1004, pro and thi are still broken and minimal medium supplies none of them." },

{ s:{geno:1, lesson:1},
  cap:"which is why these two are taught <b>together</b>",
  call:"a genotype is only readable against a medium &#183; and a medium only against a genotype",
  note:"Land it as a habit rather than a fact. A genotype on its own does not tell you what will grow, and a medium on its own does not either; the two are only meaningful against each other. Read the whole string, then ask what the plate supplies, then decide. And notice that LB hid three of these four defects completely, which is the trap the metabolic tokens slide was setting up: the strain looked fine for as long as somebody else was doing its chemistry.",
  desc:"The lesson: a genotype is only readable against a medium and a medium only against a genotype, and LB hid three of this strain's four defects." }
];

window.Deck.sequence("dapa", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    if (v.geno > 0.02){
      const q = grp(v.geno);
      let x = GX;
      q.appendChild(G.text(GX, GY - 34, "WM3064", 22, C.muted, 700, "start"));
      GENO.forEach(function(t){
        const w = t[0].length*GCW;
        if (t[1]) q.appendChild(G.el("rect", {x:n1(x + 5), y:n1(GY - 22),
          width:n1(w - 10), height:34, rx:5,
          fill:t[1] === 2 ? C.verm : C.amber, "fill-opacity":".16",
          stroke:t[1] === 2 ? C.verm : C.amber, "stroke-width":2.2}));
        q.appendChild(G.el("text", {x:n1(x), y:n1(GY), "font-size":GFS,
          fill:t[1] ? C.ink : C.muted, "font-weight":t[1] ? 700 : 400,
          "text-anchor":"start",
          "font-family":"ui-monospace,SFMono-Regular,Menlo,monospace"}, t[0]));
        x += w;
      });
      if ((v.min || 0) > 0.5 || (v.lesson || 0) > 0.5)
        q.appendChild(G.text(GX, GY + 48,
          "three more auxotrophies, and none of them is dapA", 21, C.amber,
          700, "start"));
      g.appendChild(q);
    }

    if (v.plas > 0.02){
      const q = grp(v.plas), px = 430, py = 404;
      q.appendChild(G.el("circle", {cx:px, cy:py, r:46, fill:"none",
        stroke:C.blue, "stroke-width":3}));
      q.appendChild(G.el("rect", {x:n1(px - 40), y:n1(py - 82), width:80,
        height:26, rx:4, fill:C.blue, "fill-opacity":".2", stroke:C.blue,
        "stroke-width":2.4}));
      q.appendChild(G.text(px, py - 63, "dapA", 18, C.blue, 700));
      q.appendChild(G.text(px + 74, py + 8, "the obvious fix", 21, C.blue,
        700, "start"));
      if ((v.fix || 0) > 0.5)
        q.appendChild(G.text(px + 74, py + 38,
          "DapA → diaminopimelate → cell wall", 20, C.muted, 400, "start"));
      g.appendChild(q);
    }

    const shown = (v.pose || 0) > 0.5 || (v.rich || 0) > 0.5;
    if (shown && (v.lesson || 0) < 0.5){
      const q = grp(1);
      PLATES.forEach(function(p, i){
        const ready = (v.rich || 0) > 0.5 && (i < 2 || (v.min || 0) > 0.5);
        q.appendChild(plate(p.x, 612, 92, ready ? p.ok : -1));
        q.appendChild(G.text(p.x, 736, p.name, 24, C.ink, 700));
        q.appendChild(G.text(p.x, 762, p.sub, 19, C.muted, 400));
        if (ready)
          q.appendChild(G.text(p.x, 500, p.ok ? "grows" : "nothing", 23,
            p.ok ? C.blue : C.verm, 700));
      });
      g.appendChild(q);
    }

    if (v.lesson > 0.02){
      const q = grp(v.lesson);
      q.appendChild(G.text(800, 500, "read the whole string", 38, C.ink, 700));
      q.appendChild(G.text(800, 556, "then ask what the plate supplies", 30,
        C.muted, 400));
      q.appendChild(G.text(800, 636,
        "LB hid three of this strain's four defects", 26, C.verm, 700));
      g.appendChild(q);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
