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
/* Where the tools are actually piled up, which is not the same as where
   they exist.  Cyanobacteria is deliberately NOT lit: it is on the list
   of six because of what it can do, not because the toolkit is deep,
   and that distinction is the point of this slide. */
const LIT = {Proteobacteria:1, Fungi:1, Plants:1, Animals:1};

/* Addgene plasmid deposits by expression host, retrieved 2026-09-23.
   Categories are Addgene's own; 177,561 plasmids in the repository, of
   which these six carry a host tag. */
const DEPOT = [["mammalian", 82381], ["bacterial", 33902], ["yeast", 8431],
               ["insect", 5076], ["plant", 4796], ["worm", 1910]];
const DTOT = 177561, DX = 900, DW = 420, DY0 = 300, DDY = 62;

/* And inside "bacterial", by genus.  These are free-text mentions
   within the bacterial-expression set, which is the only honest way to
   do it: Addgene's host facet stops at kingdom, and the same query on
   the mammalian set returns 42,341 for "Homo sapiens" because it is
   matching the INSERT's species, not the host.
   The bias runs one way and it is the finding: E. coli is the unmarked
   default, so almost nobody writes it down, and its 93% is a floor
   rather than a measurement.  The twenty genera counted sum to ~2,500. */
const GEN = [["Bacillus", 527, "secretes, and it is GRAS"],
             ["Pseudomonas", 487, "eats what other things cannot"],
             ["Streptomyces", 232, "makes the antibiotics"],
             ["Mycobacterium", 194, "the disease is the reason"],
             ["Synechocystis", 109, "photosynthesis"],
             ["Corynebacterium", 43, "industrial amino acids"]];
const GTOT = 33902, GNAMED = 2528;
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

{ s:{tree:1, lit:1, shift:1, dep:1},
  cap:"tools exist almost everywhere &#8212; they are just not spread <b>evenly</b>",
  call:"of <b>177,561</b> plasmids shared at Addgene, two categories are <b>two thirds</b>",
  note:"Correct the impression the last slide might have given, because tools exist for far more organisms than most people assume. Somebody has made transgenic jellyfish. There are published parts for halophilic archaea. The constraint is not that tooling is absent, it is that it is piled up in a few places. These are deposits at Addgene by expression host, and the shape is stark: mammalian cells are forty-six per cent of everything shared, bacteria another nineteen, and those two together are two thirds of a hundred and seventy-seven thousand plasmids. Yeast is five per cent. Everything else is noise by comparison. And notice the two big ones are big for opposite reasons. Bacteria because they are easy -- fast, transformable, they grow on defined medium, and a century of genetics was done on them before anybody said synthetic biology. Mammalian cells because that is where the medicine is, and people build the tools anyway, in spite of the cells being slow, fragile and expensive. So the honest rule is not that you must pick from a short list. It is that picking outside it means you are also signing up to build the tooling.",
  desc:"Addgene deposits by expression host: mammalian 82,381, bacterial 33,902, yeast 8,431, insect 5,076, plant 4,796, worm 1,910, out of 177,561 plasmids in total." },

{ s:{tree:1, lit:1, shift:1, gen:1},
  cap:"and inside &#8220;bacterial&#8221;, it is <b>one organism</b>",
  call:"every other genus named adds up to about <b>7%</b>",
  note:"Go one level down, because kingdom is too coarse to be interesting. Of the thirty-four thousand bacterial plasmids, everything that names a genus other than Escherichia comes to about two and a half thousand, which is seven per cent. The rest is E. coli, and most of those do not say so, because you only write the host down when it is not the obvious one. That bias runs one way, so ninety-three per cent is a floor and not a measurement. Now read the right-hand column, because this is the thing worth taking away. Not one of those genera is on the list for being easy to work with. Bacillus secretes properly and is generally regarded as safe, so it is where you go for enzymes in food. Pseudomonas eats solvents and aromatics that would kill E. coli. Streptomyces makes most of the antibiotics anybody has ever isolated. Mycobacterium is there because tuberculosis is. Every one of them is being used for a property it already had, and somebody paid to build the tooling afterwards.",
  desc:"The bacterial category broken down by genus: about 93 per cent is E. coli, and the named alternatives — Bacillus, Pseudomonas, Streptomyces, Mycobacterium, Synechocystis, Corynebacterium — are each used for a capability they already had." },

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

    /* ---- where the tools are actually piled up ------------------- */
    if (v.dep > 0.02){
      const d = grp(v.dep), max = DEPOT[0][1];
      d.appendChild(G.text(730, DY0 - 52, "plasmids shared at Addgene", 21,
        C.muted, 700, "start"));
      d.appendChild(G.text(730, DY0 - 26, "177,561 in the repository", 19,
        C.muted, 400, "start"));
      DEPOT.forEach(function(row, i){
        const y = DY0 + i*DDY, w = DW*row[1]/max;
        const hot = i < 2;
        d.appendChild(G.text(884, y + 7, row[0], 21,
          hot ? C.verm : C.muted, hot ? 700 : 400, "end"));
        d.appendChild(G.el("rect", {x:DX, y:n1(y - 14), width:n1(w), height:28,
          rx:4, fill:hot ? C.verm : C.muted, "fill-opacity":hot ? ".26" : ".14",
          stroke:hot ? C.verm : C.muted, "stroke-width":2}));
        d.appendChild(G.text(DX + w + 14, y + 7,
          row[1].toLocaleString() + "  \u00b7  " +
          Math.round(100*row[1]/DTOT) + "%", 19,
          hot ? C.verm : C.muted, hot ? 700 : 400, "start"));
      });
      d.appendChild(G.text(730, DY0 + 6*DDY + 14,
        "two categories, two thirds of everything", 21, C.ink, 700, "start"));
      d.appendChild(G.text(730, DY0 + 6*DDY + 42,
        "and they are big for opposite reasons", 19, C.muted, 400, "start"));
      g.appendChild(d);
    }

    /* ---- and one level down, where it is one organism ------------ */
    if (v.gen > 0.02){
      const q = grp(v.gen), BX = 730, BWD = 710, BYY = 268, BHH = 44;
      const share = 1 - GNAMED/GTOT, split = BX + BWD*share;
      q.appendChild(G.text(BX, BYY - 46, "the 33,902 \u201cbacterial\u201d plasmids",
        21, C.muted, 700, "start"));
      q.appendChild(G.el("rect", {x:BX, y:BYY, width:n1(split - BX), height:BHH,
        rx:5, fill:C.verm, "fill-opacity":".22", stroke:C.verm, "stroke-width":2.6}));
      q.appendChild(G.el("rect", {x:n1(split), y:BYY, width:n1(BX + BWD - split),
        height:BHH, rx:5, fill:C.muted, "fill-opacity":".18", stroke:C.muted,
        "stroke-width":2.6}));
      q.appendChild(G.el("text", {x:n1((BX + split)/2), y:n1(BYY + 29),
        "font-size":22, fill:C.verm, "font-weight":700, "text-anchor":"middle",
        "font-style":"italic"}, "E. coli"));
      q.appendChild(G.text((BX + split)/2, BYY + 68,
        "and everything that does not bother to say", 18, C.muted, 400));
      q.appendChild(path("M"+n1(split)+" "+n1(BYY - 10)+"V"+n1(BYY - 24)+
        "H"+n1(BX + BWD)+"V"+n1(BYY - 10), C.muted, 2));
      q.appendChild(G.text(BX + BWD, BYY - 34, "7%", 21, C.ink, 700, "end"));
      GEN.forEach(function(r, i){
        const y = 400 + i*56;
        q.appendChild(G.el("text", {x:990, y:n1(y), "font-size":23, fill:C.ink,
          "font-weight":700, "text-anchor":"end", "font-style":"italic"}, r[0]));
        q.appendChild(G.text(1012, y, String(r[1]), 21, C.muted, 400, "start"));
        q.appendChild(G.text(1088, y, r[2], 20, C.verm, 400, "start"));
      });
      q.appendChild(G.text(730, 400 + 6*56 + 10,
        "each one used for something it could already do", 21, C.ink, 700, "start"));
      q.appendChild(G.text(730, 400 + 6*56 + 38,
        "free-text mentions \u00b7 E. coli is the unmarked default, so 93% is a floor",
        17, C.muted, 400, "start"));
      g.appendChild(q);
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
