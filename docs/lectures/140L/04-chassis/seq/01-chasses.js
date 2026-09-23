/* ------------------------------------------------------------------ *
 * 01-chasses.js — the whole tree, and the six things anyone uses.
 *
 * Two source slides fold together here, because they are one argument
 * split in half.  The first is a borrowed clip-art phylogenetic tree
 * under the title Taxonomy, whose speaker note says the real point:
 * there is no shortage of cells to start from, and our knowledge of
 * almost all of them is thin.  The second is two bullet lists, the
 * organisms people actually use and what a chassis has to provide.
 *
 * Put the lists against the tree and the point draws itself: twenty-odd
 * tips, five of them lit.  The tree is redrawn rather than reused —
 * schematically, as a cladogram, because branch lengths are not what is
 * being argued — and the six chasses arrive with faces on them, since
 * "S. elongatus" means nothing to a room and a cell full of
 * carboxysomes means something.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;
const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);

function grp(o){ return G.el("g", {opacity:n1(cl(o == null ? 1 : o, 0, 1))}); }
function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 2.2,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return G.el("path", a);
}
function ital(x, y, s, size, col, weight, anchor){
  return G.el("text", {x:n1(x), y:n1(y), "font-size":size, fill:col,
    "font-weight":weight || 400, "text-anchor":anchor || "start",
    "font-style":"italic"}, s);
}

/* ---- the tree ----------------------------------------------------- */
const ROOT = 120, SPINE = 300, TIP = 452, LAB = 466;
const TREE = [
  ["Bacteria",  ["Aquifex", "Thermotoga", "Bacteroides", "Cyanobacteria",
                 "Proteobacteria", "Spirochetes", "Gram positives",
                 "Green filamentous"]],
  ["Archaea",   ["Pyrodictium", "Thermoproteus", "Methanococcus",
                 "Methanobacterium", "Methanosarcina", "Halophiles"]],
  ["Eucaryota", ["Diplomonads", "Microsporidia", "Trichomonads", "Flagellates",
                 "Ciliates", "Slime moulds", "Fungi", "Plants", "Animals"]]
];
const LIT = {Cyanobacteria:1, Proteobacteria:1, Fungi:1, Plants:1, Animals:1};
const Y0 = 216, DY = 22.4;                 /* one row per tip, plus a   */
                                           /* blank row between domains */
/* pre-compute every tip's row so the spines and labels agree */
const ROW = (function(){
  const out = []; let r = 0;
  TREE.forEach(function(d, i){
    if (i) r += 1;
    out.push(d[1].map(function(t){ return {t:t, y:Y0 + DY*(r++)}; }));
  });
  return out;
})();

/* ---- the six ------------------------------------------------------ */
const TILE = {x:730, img:78, name:836};
const CY = [250, 346, 442, 538, 634, 730];
const SIX = [
  ["img/01-chassis-ecoli.jpg", "E. coli", 1,
   "fast, transformable, and every protocol already exists"],
  ["img/01-chassis-yeast.jpg", "S. cerevisiae", 1,
   "a eukaryote you can still streak out on a plate"],
  ["img/01-chassis-human.jpg", "H. sapiens", 1,
   "when it has to be made the way a human makes it"],
  ["img/01-chassis-cyano.jpg", "S. elongatus", 1,
   "runs on light and CO₂ · fixes carbon in carboxysomes"],
  ["img/01-chassis-plant.jpg", "Plants", 0,
   "field scale, and the sunlight is free"],
  [null, "in vitro", 1,
   "no cell at all — you supply the machinery yourself"]
];

/* ---- what the thing you picked still has to do -------------------- */
const MUST = [
  ["the central dogma", "so a gene you add is transcribed and translated"],
  ["an initial state",  "the biochemistry your part arrives in the middle of"],
  ["stable replication","your DNA, intact, generation after generation"]
];

const FR = [
{ s:{tree:1, shift:0},
  cap:"there is no shortage of cells to start from",
  call:"every tip here is an organism somebody could have chosen",
  note:"There is no shortage of candidate chassis. This is the tree of life, drawn schematically, and every tip on it is a lineage somebody could in principle build in. The problem is never choice. The problem is that our understanding of almost everything on this tree is thin, and the genetic toolkits, the strains, the protocols and the accumulated lore all sit on a very small number of organisms.",
  desc:"A schematic tree of life with three domains, Bacteria, Archaea and Eucaryota, and around twenty named groups branching off them." },

{ s:{tree:1, lit:1, shift:0},
  cap:"and the toolkits exist for <b>five</b> of them",
  call:"you do not pick a chassis, you pick one somebody already made tractable",
  note:"And here is what people actually work in. Five tips: the proteobacteria, which is E. coli, the cyanobacteria, the fungi, the plants and the animals. Everything else on this tree is a research project before it is a chassis. So in practice you are not choosing an organism on its merits, you are choosing one that somebody else has already spent decades making tractable, and you are inheriting their tools along with their organism.",
  desc:"Five tips on the tree are highlighted: Cyanobacteria, Proteobacteria, Fungi, Plants and Animals." },

{ s:{tree:1, lit:1, six:1, shift:1},
  cap:"the six you will hear named",
  call:"and the sixth is not an organism at all &#183; the rest of this section is what each owes you",
  note:"Named, with faces on them. E. coli, because it grows in twenty minutes, takes up DNA and has the whole toolkit. Saccharomyces, because it is a eukaryote that still behaves like a microbe: you can streak it out and pick colonies. Human cells, when the product has to be folded and glycosylated the way a human does it. Synechococcus elongatus, which runs on light and carbon dioxide and fixes carbon inside protein-shelled compartments called carboxysomes, which E. coli has no version of at all. Plants, where the biomass is essentially free and the scale is a field. And then in vitro, which is the case where you decide the chassis is more trouble than it is worth and supply the transcription and translation machinery yourself.",
  desc:"The six chasses with images: E. coli, S. cerevisiae, H. sapiens, S. elongatus, plants, and in vitro, which has no organism at all." }
];

window.Deck.sequence("chasses", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    /* ---- the tree ------------------------------------------------ */
    if (v.tree > 0.02){
      const t = grp(v.tree);
      t.setAttribute("transform", "translate("+n1(250*(1 - cl(v.shift, 0, 1)))+" 0)");
      const mids = [];
      ROW.forEach(function(tips, i){
        const y0 = tips[0].y, y1 = tips[tips.length - 1].y;
        mids.push((y0 + y1)/2);
        t.appendChild(path("M"+SPINE+" "+n1(y0)+"V"+n1(y1), C.muted, 2.2));
        tips.forEach(function(tp){
          const on = LIT[tp.t] ? cl(v.lit, 0, 1) : 0;
          const col = on > 0.5 ? C.verm : C.muted;
          t.appendChild(path("M"+SPINE+" "+n1(tp.y)+"H"+TIP, col,
            2.2 + 1.4*on));
          t.appendChild(G.text(LAB, tp.y + 6, tp.t, 17, on > 0.5 ? C.verm : C.ink,
            on > 0.5 ? 700 : 400, "start"));
        });
      });
      /* and the root the three of them share */
      const y0 = mids[0], y1 = mids[mids.length - 1];
      t.appendChild(path("M"+ROOT+" "+n1((y0 + y1)/2)+"H"+n1(ROOT + 26), C.muted, 2.2));
      t.appendChild(path("M"+n1(ROOT + 26)+" "+n1(y0)+"V"+n1(y1), C.muted, 2.2));
      mids.forEach(function(m){
        t.appendChild(path("M"+n1(ROOT + 26)+" "+n1(m)+"H"+SPINE, C.muted, 2.2));
      });
      /* The domain names sit at their group's midpoint, which is exactly
         where the connector from the root arrives, so they go on LAST
         and over paper -- drawn any earlier and every one of them has a
         rule through it. */
      mids.forEach(function(m, i){
        const dl = TREE[i][0], dw = dl.length*12 + 18;
        t.appendChild(G.el("rect", {x:n1(SPINE - 18 - dw), y:n1(m - 15),
          width:n1(dw), height:30, fill:C.paper}));
        t.appendChild(G.text(SPINE - 26, m + 7, dl, 21, C.ink, 700, "end"));
      });
      g.appendChild(t);
    }

    /* ---- the six ------------------------------------------------- */
    if (v.six > 0.02){
      const q = grp(v.six);
      SIX.forEach(function(row, i){
        const y = CY[i], ix = TILE.x, iy = y - TILE.img/2;
        if (row[0]){
          q.appendChild(G.el("image", {href:row[0], x:ix, y:n1(iy),
            width:TILE.img, height:TILE.img,
            preserveAspectRatio:"xMidYMid slice"}));
          q.appendChild(G.el("rect", {x:ix, y:n1(iy), width:TILE.img,
            height:TILE.img, rx:5, fill:"none", stroke:C.muted,
            "stroke-width":1.6}));
        } else {
          q.appendChild(G.el("rect", {x:ix, y:n1(iy), width:TILE.img,
            height:TILE.img, rx:5, fill:"none", stroke:C.muted,
            "stroke-width":2, "stroke-dasharray":"7 6"}));
          q.appendChild(G.text(ix + TILE.img/2, y + 6, "no cell", 17,
            C.muted, 400, "middle"));
        }
        q.appendChild(row[2]
          ? ital(TILE.name, y - 4, row[1], 26, C.blue, 700)
          : G.text(TILE.name, y - 4, row[1], 26, C.blue, 700, "start"));
        q.appendChild(G.text(TILE.name, y + 26, row[3], 19, C.muted, 400, "start"));
      });
      g.appendChild(q);
    }

    /* ---- and the job it still has to do -------------------------- */
    if (v.must > 0.02){
      const m = grp(v.must);
      m.appendChild(G.text(168, 246, "for any of the six \u2014",
        24, C.muted, 400, "start"));
      MUST.forEach(function(row, i){
        const y = 336 + i*128;
        m.appendChild(path("M"+168+" "+n1(y - 30)+"V"+n1(y + 20), C.verm, 3));
        m.appendChild(G.text(190, y, row[0], 28, C.verm, 700, "start"));
        m.appendChild(G.text(190, y + 32, row[1], 20, C.muted, 400, "start"));
      });
      g.appendChild(m);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
