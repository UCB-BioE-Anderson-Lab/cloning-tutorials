/* ------------------------------------------------------------------ *
 * 05-pili.js — the one virulence factor your laboratory strain has.
 *
 * The source gives this two slides and six photographs, and between
 * them they never show the thing that matters: that a twelve kilobase
 * cluster sitting at one place in the genome builds a rod that reaches
 * out and grips a sugar on somebody else's cell.  The cluster and what
 * it builds are drawn together, on screen at the same time, because the
 * point of the slide is the relationship between them.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;
const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);

function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 3,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return G.el("path", a);
}
function grp(o){ return G.el("g", {opacity:n1(cl(o, 0, 1))}); }

/* ---- the fim cluster, drawn to its real gene order ---------------- */
const GY = 196, GX0 = 300, GX1 = 1330;
const FIM = [
  ["fimB",  36, C.muted], ["fimE", 36, C.muted],
  ["fimA", 120, C.blue ], ["fimI", 34, C.muted],
  ["fimC",  68, C.muted], ["fimD", 128, C.muted],
  ["fimF",  40, C.muted], ["fimG", 40, C.muted], ["fimH", 86, C.verm]
];
function cluster(lit){
  const g = G.el("g", {}), gap = 14;
  let total = FIM.reduce((a, f) => a + f[1], 0) + gap*(FIM.length - 1);
  let x = (GX0 + GX1)/2 - total/2;
  g.appendChild(path("M"+GX0+" "+GY+"H"+GX1, C.ink, 3));
  FIM.forEach(function(f){
    const on = lit === f[0] || lit === "all";
    const h = 34, tip = 13;
    g.appendChild(G.el("path", {d:"M"+n1(x)+" "+n1(GY-h/2)+"H"+n1(x+f[1]-tip)+
      "L"+n1(x+f[1])+" "+n1(GY)+"L"+n1(x+f[1]-tip)+" "+n1(GY+h/2)+"H"+n1(x)+"Z",
      fill:f[2], "fill-opacity":on ? ".34" : ".14",
      stroke:f[2], "stroke-width":on ? 3 : 2}));
    g.appendChild(G.text(x + f[1]/2 - 4, GY + 52, f[0], 20,
      on ? f[2] : C.muted, on ? 700 : 400));
    x += f[1] + gap;
  });
  g.appendChild(path("M"+n1((GX0+GX1)/2 - total/2)+" "+n1(GY-44)+"V"+n1(GY-58)+
    "H"+n1((GX0+GX1)/2 + total/2)+"V"+n1(GY-44), C.muted, 2));
  g.appendChild(G.text((GX0+GX1)/2, GY - 68, "the fim cluster · about 12 kb, all in one place",
    22, C.muted, 400));
  return g;
}

/* ---- the surfaces ------------------------------------------------ */
const OMY = 330, MH = 40;                 /* the bacterium's outer membrane */
const HOSTY = 634;                        /* the gut epithelium             */
const PX = 800;                           /* where the pilus stands         */
function bilayer(yTop){
  const g = G.el("g", {}), r = 7, step = 19;
  g.appendChild(G.el("rect", {x:300, y:n1(yTop), width:1030, height:MH,
    fill:C.amber, "fill-opacity":".13", stroke:"none"}));
  for (let x = 306; x < 1326; x += step)
    [yTop + r + 1, yTop + MH - r - 1].forEach(y =>
      g.appendChild(G.el("circle", {cx:n1(x), cy:n1(y), r:r, fill:C.amber,
        "fill-opacity":".5", stroke:C.amber, "stroke-width":1.3})));
  return g;
}
function host(withSugar){
  const g = G.el("g", {});
  g.appendChild(G.el("rect", {x:300, y:HOSTY, width:1030, height:78,
    fill:C.muted, "fill-opacity":".12", stroke:C.muted, "stroke-width":2.6}));
  g.appendChild(G.text(316, HOSTY + 48, "gut epithelium", 22, C.muted, 400, "start"));
  if (withSugar)
    for (let x = 360; x < 1310; x += 62){
      g.appendChild(path("M"+n1(x)+" "+HOSTY+"V"+n1(HOSTY - 20), C.amber, 2.4));
      g.appendChild(G.el("circle", {cx:n1(x), cy:n1(HOSTY - 28), r:9,
        fill:C.amber, "fill-opacity":".65", stroke:C.amber, "stroke-width":1.8}));
    }
  return g;
}
/* the rod: stacked subunits, helical, the way it actually is */
function rod(topY, botY, o){
  const g = grp(o == null ? 1 : o), step = 26;
  for (let y = topY, i = 0; y < botY; y += step, i++){
    const dx = Math.sin(i*0.9)*9;
    g.appendChild(G.el("ellipse", {cx:n1(PX + dx), cy:n1(y), rx:19, ry:13,
      fill:C.blue, "fill-opacity":".22", stroke:C.blue, "stroke-width":2.4}));
  }
  return g;
}

const FR = [
{ s:{gene:1, cell:1},
  lit:"all",
  cap:"one cluster, about <b>12 kb</b>, all at one place in the genome",
  call:"which is what makes this virulence factor easy to remove <em>completely</em>",
  note:"In K-12 strains there is one virulence factor that matters, and this is it. The genes are the fim cluster: about twelve kilobases, and every one of them sits together at a single locus. That last part is unusual and it is practically important, because it means you can delete this entire capability cleanly, in one edit, which is not true of most virulence factors. A few of these genes are regulators that control whether the thing gets built at all, and the rest are structural.",
  desc:"The fim cluster drawn as a gene map on the chromosome, about twelve kilobases, with all nine genes adjacent, above a section of the bacterium's outer membrane and the gut epithelium below it." },

{ s:{gene:1, cell:1, rod:1},
  lit:"fimA",
  cap:"<b>fimA</b> is the subunit, and it polymerises into a rod",
  call:"hundreds of copies of one protein, helical, reaching out from the surface",
  note:"fimA is the major structural subunit, and hundreds of copies of it polymerise into a long helical rod that projects out from the outer membrane. Two of the other genes are doing the work of getting it there: fimC is a chaperone that keeps subunits folded in the periplasm, and fimD is the usher in the outer membrane that they are threaded through. So this is the same problem as the last section, an outer membrane assembly, solved by a dedicated apparatus.",
  desc:"A helical rod of repeated fimA subunits extending from the bacterium's outer membrane down toward the epithelium." },

{ s:{gene:1, cell:1, rod:1, tip:1},
  lit:"fimH",
  cap:"and <b>fimH</b> sits on the tip",
  call:"the rod is the reach &#183; the tip is the grip",
  note:"On the very end is fimH, and fimH is the adhesin. Divide the labour in your head: the rod is reach, and the tip is grip. All those fimA subunits exist to hold one fimH far enough out from the cell surface to get past everything else on it. fimF and fimG are the short adaptors that join the tip to the rod.",
  desc:"The fimH adhesin drawn at the tip of the rod, picked out in red on both the gene map and the drawing." },

{ s:{gene:1, cell:1, rod:1, tip:1, grip:1},
  lit:"fimH",
  cap:"which binds <b>mannose</b> on the cells lining your gut",
  call:"that is the whole mechanism &#183; a long sticky rod with a specific grip on the end",
  note:"And what fimH binds is mannose, specifically mannose residues on the glycoproteins lining the surface of gut epithelial cells. That is the entire mechanism. Everything else in the cluster exists to put that one interaction in the right place. Now notice what it is for: this is how a bacterium stays in a gut rather than being washed straight through it, which is exactly as necessary for a harmless commensal as it is for a pathogen. The same structure does both jobs, and that is worth sitting with, because it is why the word virulence factor is slippery.",
  desc:"The fimH tip engaging mannose residues displayed on the surface of the gut epithelium." },

{ s:{gene:1, cell:1, rod:1, tip:1, grip:1, lab:1},
  lit:"all",
  cap:"and it is in <b>DH10B</b>, and <b>DH5&alpha;</b>, and most of the rest",
  call:"your laboratory strain can stick to you &#183; it simply cannot do anything once it has",
  note:"And it is present in most laboratory strains, DH10B and DH5-alpha included. Which sounds alarming and is not, and the reason is worth being precise about. Adhesion on its own does nothing to you. There is no toxin, no invasion, no capsule to hide behind, and a lab strain that has been passaged for decades is bad at all of it. Sticking to a surface is a necessary step for pathogenesis, not a sufficient one, and the difference between your strain and a pathogen is everything else the pathogen has and yours does not.",
  desc:"A note that type I pili are present in most laboratory strains including DH10B and DH5-alpha, with the whole assembly shown gripping the epithelium." }
];

window.Deck.sequence("pili", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v, f){
    const g = G.el("g", {});

    /* ---- and what one actually looks like ------------------------ *
     * The whole left column is clear -- the gene map, the membrane and
     * the epithelium all start at GX0 -- so the specimen sits beside
     * the cartoon rather than replacing anything.  It arrives with the
     * rod, which is the beat where the drawing starts claiming a
     * shape the room has never seen. */
    if (v.rod > 0.02){
      const m = grp(v.rod);
      m.appendChild(G.el("image", {href:"img/05-mg1655-pili.jpg", x:136, y:392,
        width:166, height:207, preserveAspectRatio:"xMidYMid meet"}));
      m.appendChild(G.el("rect", {x:136, y:392, width:166, height:207,
        fill:"none", stroke:C.muted, "stroke-width":1.6}));
      m.appendChild(G.text(219, 626, "MG1655", 21, C.ink, 700));
      m.appendChild(G.text(219, 652, "the real thing", 19, C.muted, 400));
      g.appendChild(m);
    }
    const half = x => cl(x*2 - 1, 0, 1);

    if (v.gene > 0.02){ const k = grp(half(v.gene));
      k.appendChild(cluster(f.lit)); g.appendChild(k); }

    if (v.cell > 0.02){
      const k = grp(half(v.cell));
      k.appendChild(bilayer(OMY));
      k.appendChild(G.text(316, OMY - 16, "the bacterium's outer membrane", 22,
        C.muted, 400, "start"));
      k.appendChild(host(v.grip > 0.02));
      g.appendChild(k);
    }
    /* the rod stops short until the tip is on it, and short of the host
       until it actually grips: the reach is the point */
    if (v.rod > 0.02){
      const bot = v.grip > 0.5 ? HOSTY - 62 : (v.tip > 0.5 ? 540 : 516);
      g.appendChild(rod(OMY + MH + 18, bot, half(v.rod)));
      g.appendChild(G.text(PX - 104, (OMY + MH + bot)/2, "fimA", 23, C.blue, 700, "end"));
    }
    if (v.tip > 0.02){
      const k = grp(half(v.tip));
      const ty = v.grip > 0.5 ? HOSTY - 44 : 562;
      k.appendChild(G.el("path", {d:"M"+n1(PX-26)+" "+n1(ty-16)+
        "C"+n1(PX-30)+" "+n1(ty+16)+" "+n1(PX+30)+" "+n1(ty+16)+" "+n1(PX+26)+" "+n1(ty-16)+"Z",
        fill:C.verm, "fill-opacity":".30", stroke:C.verm, "stroke-width":2.8}));
      k.appendChild(G.text(PX + 46, ty + 8, "fimH", 23, C.verm, 700, "start"));
      g.appendChild(k);
    }
    if (v.grip > 0.02){
      const k = grp(half(v.grip));
      k.appendChild(G.text(330, HOSTY - 56, "mannose", 22, C.amber, 700, "start"));
      g.appendChild(k);
    }
    if (v.lab > 0.02){
      const k = grp(half(v.lab));
      /* beside the pilus, not under it: under it is where the caption is */
      k.appendChild(G.el("rect", {x:942, y:412, width:392, height:96, rx:9,
        fill:C.verm, "fill-opacity":".07", stroke:C.verm, "stroke-width":2.4,
        "stroke-dasharray":"8 7"}));
      k.appendChild(G.text(1138, 452, "present in DH10B,", 23, C.verm, 700));
      k.appendChild(G.text(1138, 482, "DH5\u03b1, and most others", 23, C.verm, 700));
      g.appendChild(k);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
