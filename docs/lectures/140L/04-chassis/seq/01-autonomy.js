/* ------------------------------------------------------------------ *
 * 01-autonomy.js — how much of a living system has to be encoded by
 * the organism itself?
 *
 * Replaces the old "3000 genes and 3 Mb is the core" framing, which was
 * too coarse and which lumped the central dogma, primary metabolism and
 * environmental sensing into one bucket as though they were the same
 * kind of requirement.
 *
 * The organising variable here is environmental subsidy.  A genome gets
 * small by moving work OUT of the organism and into its niche, so the
 * bars are not genome sizes -- they are the fraction of the functions
 * needed to make a copy that the system encodes rather than borrows.
 * They are illustrative and the notes say so.
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

/* ---- the spectrum ------------------------------------------------- */
const COL = [230, 434, 638, 842, 1046, 1250];
const BW = 132, BTOP = 292, BH = 250;
const STEP = [
  {k:"pri", name:"prion",      sub:"a protein state",       enc:0.03},
  {k:"vir", name:"virus",      sub:"some machinery", enc:0.13},
  {k:"dep", name:"dependent cell", sub:"JCVI-syn3.0",       enc:0.44},
  {k:"aut", name:"autonomous cell", sub:"builds itself", enc:0.80},
  {k:"rob", name:"robust cell", sub:"survives change",enc:0.90},
  {k:"eco", name:"specialist",  sub:"competes", enc:1.00}
];

function bar(i, v){
  const g = G.el("g", {}), d = STEP[i], x = COL[i] - BW/2;
  const encH = BH*d.enc, encY = BTOP + BH - encH;
  /* what the environment has to supply */
  g.appendChild(G.el("rect", {x:n1(x), y:BTOP, width:BW, height:n1(BH - encH),
    rx:5, fill:C.muted, "fill-opacity":".07", stroke:C.muted,
    "stroke-width":2, "stroke-dasharray":"7 5"}));
  /* what it encodes itself */
  g.appendChild(G.el("rect", {x:n1(x), y:n1(encY), width:BW, height:n1(encH),
    rx:5, fill:C.blue, "fill-opacity":".22", stroke:C.blue, "stroke-width":2.8}));
  if (d.enc < 0.7) g.appendChild(G.text(COL[i], BTOP + (BH - encH)/2 + 8,
    "supplied", 19, C.muted, 400));
  if (d.enc > 0.18) g.appendChild(G.text(COL[i], encY + encH/2 + 8,
    "encoded", 19, C.blue, 700));
  return g;
}

const FR = [
{ s:{axis:1},
  cap:"how much does the organism have to encode <b>itself</b>?",
  call:"&#8220;minimal&#8221; means nothing until you say what the environment supplies",
  note:"Start with the question rather than an answer, and do not define life yet. Here are six kinds of self-propagating system, and the only thing being asked of each is: of everything needed to make another one of you, how much do you carry, and how much does the world around you hand over? That framing is the whole section, because you can make the encoded part arbitrarily small by assuming more about the environment. There is no single minimal genome. There is a trade.",
  desc:"Six kinds of self-propagating system named along a spectrum, from a prion to an ecological specialist, with nothing quantified yet." },

{ s:{axis:1, pri:1},
  cap:"a <b>prion</b> encodes almost nothing",
  call:"one protein conformation, templating itself &#183; the cell supplies all the rest",
  note:"Start at the provocative end. A prion is one protein conformation that templates its own state onto other copies of the same protein. That is self-propagating information with essentially no encoded machinery at all: the gene, the ribosome that translated it, the energy, the amino acids, every bit of the production line belongs to the host. Whether a prion is alive is a definitional argument and we are not going to settle it. It is here because it shows what goes wrong if you define minimal life by the size of the replicator.",
  desc:"The prion's bar: a very small encoded fraction and almost everything supplied by the host." },

{ s:{axis:1, pri:1, vir:1},
  cap:"a <b>virus</b> encodes more, and still borrows a cell",
  call:"no translation, no energy metabolism, no precursor synthesis",
  note:"A virus moves one step along. It encodes real information and often substantial machinery — capsids, polymerases, packaging motors — but it has no ribosomes, no ATP generation and no way to make its own nucleotides or amino acids. It borrows all of that. So the step from prion to virus is not a step toward being alive, it is a step toward encoding more of your own production.",
  desc:"The virus's bar: more encoded than a prion, but translation, energy metabolism and precursor synthesis still supplied." },

{ s:{axis:1, pri:1, vir:1, dep:1},
  cap:"a <b>dependent cell</b> reproduces, and still imports most of its chemistry",
  call:"JCVI-syn3.0 &#183; <b>531 kb</b>, 473 genes &#183; minimised in a rich medium",
  note:"Now a real cell. JCVI-syn3.0 has a five hundred and thirty-one kilobase genome, four hundred and seventy-three genes, and it divides. But read how it was made: it was minimised by deleting genes one at a time in a rich medium, so every gene it could afford to lose because the medium supplied the product is gone. It is an experimental answer to a specific question — what must this cell encode when the medium supplies almost everything else — and it is not an answer to what it takes to build a cell out of simple chemicals. The same is true of the naturally reduced parasites and endosymbionts: their small genomes are possible because their environments are generous.",
  desc:"The dependent cell's bar, labelled JCVI-syn3.0 at 531 kilobases and 473 genes: it reproduces as a cell but imports most of its chemistry." },

{ s:{axis:1, pri:1, vir:1, dep:1, aut:1},
  cap:"and here the line actually falls",
  call:"it can build a whole new cell from <b>a sugar and some salts</b>",
  note:"And this is the step that matters for us, because it is the first one where the environment stops supplying chemistry. Give this cell one carbon and energy source, ammonium, phosphate, sulfate, some ions and water, and it makes another complete cell: every amino acid, every nucleotide, every lipid, every cofactor. That is a much stricter boundary than reproducing, and it is a much more useful one for an engineer, because it tells you what you are getting for free when you pick a host. This is the definition the rest of the lecture uses.",
  desc:"The autonomous cell's bar: a large encoded fraction, because it builds everything from a simple carbon source and inorganic nutrients." },

{ s:{axis:1, pri:1, vir:1, dep:1, aut:1, rob:1, eco:1},
  cap:"and then two more layers that are not about being alive at all",
  call:"surviving a <b>change</b> &#183; and competing for a <b>place</b>",
  note:"Past that point the genome keeps growing, and none of what it adds is required to make a cell. The next layer is robustness: sensing, regulation, stress responses, DNA repair, nutrient switching, defence against foreign DNA. A cell held in one perfectly controlled condition does not need any of it. A cell in a changing world does. And outside that is everything that makes one organism ecologically different from another: colonisation, toxins, secondary metabolism, unusual substrates, biofilms. Those are not life. They are what a particular life does for a living.",
  desc:"The last two bars: the robust cell and the ecological specialist, encoding more still, none of it required to make a cell." },

{ s:{axis:1, pri:1, vir:1, dep:1, aut:1, rob:1, eco:1, mean:1},
  cap:"so <b>minimal</b> means three different things",
  call:"and only the third one is a chassis",
  note:"Three different questions have been getting the same word. A minimal replicator is something that can propagate information or state at all, and by that standard a prion qualifies and the question stops being interesting. A minimal cell is something that can reproduce as a cell given a supportive environment, and syn3.0 is the cleanest example there is. A biosynthetically autonomous cell can construct a new cell out of simple chemical inputs, and that is the one worth calling a chassis, because it is the only one of the three whose requirements do not depend on somebody else's medium. The formal word is prototrophy, and the caveat is that prototrophy is always defined relative to a specified set of nutrients.",
  desc:"Three brackets under the spectrum: minimal replicator covering the prion and virus, minimal cell covering the dependent cell, and biosynthetically autonomous cell covering the rest, emphasised." }
];

window.Deck.sequence("autonomy", function(slide){
  const s = G.scene(slide, 792, 838);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    /* ---- the spectrum, and which way it runs --------------------- */
    const a = grp(v.axis);
    a.appendChild(path("M150 "+n1(BTOP + BH + 22)+"H1450", C.muted, 2));
    a.appendChild(path("M1436 "+n1(BTOP + BH + 14)+"L1450 "+n1(BTOP + BH + 22)+
      "L1436 "+n1(BTOP + BH + 30), C.muted, 2));
    a.appendChild(G.text(800, BTOP + BH + 46,
      "more encoded \u00b7 less supplied", 20, C.muted, 400));
    STEP.forEach(function(d, i){
      const on = (v[d.k] || 0) > 0.5;
      a.appendChild(G.text(COL[i], BTOP - 74, d.name, 23,
        on ? C.ink : C.muted, 700));
      a.appendChild(G.text(COL[i], BTOP + BH + 78, d.sub, 19, C.muted, 400));
    });
    g.appendChild(a);

    /* ---- what each one encodes ----------------------------------- */
    STEP.forEach(function(d, i){
      const o = cl((v[d.k] || 0)*2 - 1, 0, 1);
      if (o > 0.02) g.appendChild(grp(o)).appendChild(bar(i, o));
    });

    /* ---- and the three questions that share the word ------------- */
    if (v.mean > 0.02){
      const m = grp(v.mean), y = BTOP + BH + 110;
      [[0, 1, "minimal replicator", "propagates information", C.muted],
       [2, 2, "minimal cell", "given a generous environment", C.muted],
       [3, 5, "biosynthetically autonomous", "builds a cell from simple inputs", C.verm]
      ].forEach(function(b){
        const x0 = COL[b[0]] - BW/2 - 14, x1 = COL[b[1]] + BW/2 + 14;
        m.appendChild(path("M"+n1(x0)+" "+n1(y)+"V"+n1(y + 12)+"H"+n1(x1)+
          "V"+n1(y), b[4], b[4] === C.verm ? 3.4 : 2.4));
        m.appendChild(G.text((x0 + x1)/2, y + 46, b[2], b[4] === C.verm ? 26 : 23,
          b[4], 700));
        m.appendChild(G.text((x0 + x1)/2, y + 74, b[3], 19, C.muted, 400));
      });
      g.appendChild(m);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
