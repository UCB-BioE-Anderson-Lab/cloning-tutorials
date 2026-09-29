/* ------------------------------------------------------------------ *
 * 01-prototroph.js — the boundary, drawn as an experiment.
 *
 * The previous slide argued that "minimal" is meaningless without
 * stating what the environment supplies.  This one states it, and the
 * statement is a medium: a sugar and some salts.  Everything the cell
 * is made of has to be built from that, which is exactly what M9 tests
 * and exactly why the media slides later in the deck stop being a
 * microbiology aside and become the demonstration of this definition.
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
function arrow(x0, x1, y, col, w){
  const g = G.el("g", {});
  g.appendChild(path("M"+n1(x0)+" "+n1(y)+"H"+n1(x1 - 12), col, w || 3));
  g.appendChild(path("M"+n1(x1 - 20)+" "+n1(y - 10)+"L"+n1(x1)+" "+n1(y)+
    "L"+n1(x1 - 20)+" "+n1(y + 10), col, w || 3));
  return g;
}
function cell(cx, cy, r, col){
  return G.el("rect", {x:n1(cx - r), y:n1(cy - r*0.62), width:n1(r*2),
    height:n1(r*1.24), rx:n1(r*0.62), fill:col, "fill-opacity":".10",
    stroke:col, "stroke-width":3});
}

/* The layer decomposition, as the consequence of the definition rather
   than a diagram of its own: once you know what the core has to do, the
   question "what is the rest of E. coli for" answers itself. */
const BX0 = 230, BW = 1160, BBY = 330, BBH = 76;
const LAY = [["information", 0.30, "#004373"], ["biosynthesis", 0.16, "#004373"],
             ["robustness", 0.26, "#a99011"], ["ecological", 0.28, "#ba3a13"]];
const BRACK = [[0, 1, "make another cell"],
               [2, 2, "keep it alive when things change"],
               [3, 3, "let it compete somewhere"]];

const IN  = ["glucose", "NH₄⁺", "PO₄³⁻",
             "SO₄²⁻", "ions", "H₂O"];
const OUT = ["DNA", "RNA", "protein", "membrane", "cell wall", "cofactors",
             "every metabolite"];

const FR = [
{ s:{ask:1},
  cap:"you can make the answer as small as you like",
  call:"by letting the <b>environment</b> do more of the work",
  note:"Ask it first and let them try. The smallest living system — and then notice that the question is broken, because the answer depends entirely on what you are allowed to assume about the surroundings. A prion is one self-propagating protein conformation, and it only manages that because a cell supplies the gene, the ribosome, the energy and everything else. A virus encodes more and still borrows translation and metabolism wholesale. JCVI-syn3.0 is a real cell with five hundred and thirty-one kilobases and four hundred and seventy-three genes, and it got that small by being minimised in a rich medium, so every gene whose product the medium supplied is gone. None of those is a fact about life. They are facts about how generous somebody was being. So genome size on its own is not a useful definition, and what we need instead is a boundary that says what the environment is allowed to hand over.",
  desc:"The opening claim: the minimum size of a living system depends entirely on how much the environment supplies." },

{ s:{in:1},
  cap:"state the environment, and the definition becomes an <b>experiment</b>",
  call:"one carbon source &#183; nitrogen, phosphorus, sulfur &#183; ions &#183; water",
  note:"So let us state the environment, because that is the thing the previous slide said you have to state. Here it is: one carbon and energy source, in our case glucose. Ammonium for nitrogen. Phosphate. Sulfate. A handful of inorganic ions. Water. Nothing on this list is a biological molecule. Nothing here was made by something alive.",
  desc:"The inputs of a minimal medium: glucose, ammonium, phosphate, sulfate, ions and water." },

{ s:{in:1, mk:1},
  cap:"and everything else has to be <b>made</b>",
  call:"amino acids, nucleotides, lipids, cofactors &#8212; all of it, from that",
  note:"And then everything the cell is made of has to be built from those inputs. Not just replication, transcription and translation, but the whole metabolic network that feeds them: twenty amino acids, four nucleotides and their deoxy forms, fatty acids and phospholipids, the peptidoglycan, every cofactor, every intermediate. The central dogma is the part people draw. The biosynthesis is the part that actually dominates the gene count.",
  desc:"Everything the cell has to build from those inputs: DNA, RNA, protein, membrane, cell wall, cofactors and every metabolite." },

{ s:{in:1, mk:1, two:1},
  cap:"if it grows here, it encodes the chemistry to <b>build itself</b>",
  call:"<b>prototrophy</b> &#183; and this is the boundary the rest of the lecture uses",
  note:"And if it grows, that is the whole result. Growth on a rich medium tells you the cell can reproduce when somebody hands it most of its parts. Growth on a defined minimal medium tells you the cell can construct itself, which is a completely different claim and a much more useful one. The word is prototrophy, and it carries a caveat: prototrophy is always relative to a stated set of nutrients, so glucose and salts is an operational definition for a heterotroph like E. coli rather than a universal one. When the media slides come back later with LB and M9 and auxotrophic lab strains, they are demonstrations of this line, not a separate topic.",
  desc:"Two cells, and the term prototrophy: if it grows on this medium it must encode the chemistry to build itself." },

{ s:{bar:1},
  cap:"so what is the other <b>2.6 Mb</b> of <em>E. coli</em> for?",
  call:"it is a good chassis precisely because it is <b>not minimal</b>",
  note:"And now the definition pays for itself, because it lets you ask what the rest of the genome is doing. The first stretch is the prototrophic core: replication, transcription, translation, a membrane, division, and the metabolic network that feeds all of it, which is the larger half of the two. After that is robustness, and none of it is needed to be alive: sensing, regulation, stress responses, DNA repair, nutrient switching, defence against foreign DNA. A cell in one perfectly controlled condition needs none of that. A cell in a changing world does. And the last stretch is what makes one organism different from another rather than different from a rock. The proportions are qualitative and not every base assigns cleanly. The conclusion is the opposite of the one people usually reach for: E. coli is a good chassis because it is not minimal. All of that robustness comes free with the host, and reducing a genome removes exactly the part that made it worth having.",
  desc:"The E. coli genome partitioned into information, biosynthesis, robustness and ecological function, with brackets for making another cell, keeping it alive, and letting it compete." }
];

window.Deck.sequence("prototroph", function(slide){
  const s = G.scene(slide, 792, 838);
  s.finish();
  const CY = 470;

  function paint(v){
    const g = G.el("g", {});

    if (v.bar > 0.02){
      const f = grp(v.bar);
      let x = BX0;
      LAY.forEach(function(L){
        const w = BW*L[1];
        f.appendChild(G.el("rect", {x:n1(x), y:BBY, width:n1(w), height:BBH,
          fill:L[2], "fill-opacity":".20", stroke:L[2], "stroke-width":2.8}));
        f.appendChild(G.text(x + w/2, BBY + BBH + 30, L[0], 21, L[2], 700));
        x += w;
      });
      f.appendChild(G.el("text", {x:BX0, y:BBY - 22, "font-size":25, fill:C.ink,
        "font-weight":700, "font-style":"italic"}, "E. coli"));
      f.appendChild(G.text(BX0 + BW, BBY - 22, "4.64 Mb", 24, C.muted, 400, "end"));
      BRACK.forEach(function(k, i){
        let x0 = BX0, x1 = BX0;
        LAY.forEach(function(L, j){
          if (j < k[0]) x0 += BW*L[1];
          if (j <= k[1]) x1 += BW*L[1];
        });
        const by = BBY + BBH + 76 + i*88;
        f.appendChild(path("M"+n1(x0)+" "+n1(by)+"V"+n1(by + 14)+"H"+n1(x1)+
          "V"+n1(by), C.muted, 2.4));
        f.appendChild(G.text((x0 + x1)/2, by + 46, k[2], 25, C.ink, 700));
      });
      g.appendChild(f);
      return g;
    }
    if (v.ask > 0.02 && !(v.in > 0.02)){
      const q = grp(v.ask);
      q.appendChild(G.text(800, 440, "there is no single minimum.", 44, C.ink, 700));
      q.appendChild(G.text(800, 512, "there is a trade.", 44, C.verm, 700));
      q.appendChild(G.text(800, 588,
        "a smaller encoded system \u00b7 more assumptions about the world",
        26, C.muted, 400));
      g.appendChild(q);
    }
    const a = grp(v.in);
    IN.forEach(function(t, i){
      const y = 300 + i*58;
      a.appendChild(G.el("rect", {x:172, y:n1(y - 24), width:200, height:44, rx:8,
        fill:C.muted, "fill-opacity":".07", stroke:C.muted, "stroke-width":2}));
      a.appendChild(G.text(272, y + 6, t, 22, C.ink, 700));
    });
    a.appendChild(G.text(272, 254, "what you put in", 20, C.muted, 400));
    a.appendChild(arrow(392, 470, CY, C.muted));
    a.appendChild(cell(590, CY, 116, C.blue));
    a.appendChild(G.text(590, CY + 8, "one cell", 24, C.blue, 700));
    g.appendChild(a);

    if (v.mk > 0.02){
      const m = grp(v.mk);
      m.appendChild(arrow(712, 790, CY, C.blue));
      OUT.forEach(function(t, i){
        const y = 286 + i*50;
        m.appendChild(path("M812 "+n1(y - 16)+"V"+n1(y + 8), C.blue, 3));
        m.appendChild(G.text(830, y, t, 23, C.blue, 700, "start"));
      });
      m.appendChild(G.text(812, 254, "what it has to make", 20, C.muted, 400, "start"));
      g.appendChild(m);
    }

    if (v.two > 0.02){
      const t = grp(v.two);
      t.appendChild(arrow(1120, 1196, CY, C.verm));
      t.appendChild(cell(1300, CY - 92, 104, C.verm));
      t.appendChild(cell(1300, CY + 92, 104, C.verm));
      t.appendChild(G.text(1300, CY + 218, "two cells", 24, C.verm, 700));
      t.appendChild(G.text(1300, 254, "prototrophy", 26, C.verm, 700));
      g.appendChild(t);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
