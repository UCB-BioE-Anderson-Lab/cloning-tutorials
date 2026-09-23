/* ------------------------------------------------------------------ *
 * 01-layers.js — the genome as nested layers of capability.
 *
 * The conceptual centrepiece of the section, and the replacement for
 * the old "core bacterial chassis" bullet list, which put the central
 * dogma, primary metabolism and environmental sensing in one bucket as
 * though they were the same kind of requirement.  They are not.  A cell
 * held in one controlled condition needs no sensing at all; it still
 * needs to make its own nucleotides.
 *
 * The boundaries are an engineering decomposition, not a phylogenetic
 * claim, and the notes say so.  The last beat unrolls the same four
 * categories onto the E. coli genome, which is where the argument was
 * always going: E. coli is not 4.6 Mb because life costs 4.6 Mb.
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

/* One colour per layer, and the same four run through the rest of the
   deck: blue is what you cannot do without, amber is what keeps it
   alive when the world moves, vermillion is what makes this organism
   different from that one. */
const CX = 496, CY = 452;
const LAYER = [
  {k:"info", r:100, col:C.blue, name:"information &amp; reproduction",
   items:["DNA replication", "transcription", "translation",
          "membrane and division", "energy coupling"]},
  {k:"bio",  r:176, col:C.blue, name:"biosynthesis",
   items:["central metabolism", "amino acids", "nucleotides",
          "lipids and cofactors", "the cell envelope"]},
  {k:"rob",  r:244, col:C.amber, name:"robustness and control",
   items:["sensing and regulation", "stress response", "DNA repair",
          "homeostasis, nutrient switching", "restriction, CRISPR, defence"]},
  {k:"eco",  r:308, col:C.verm, name:"ecological and specialised",
   items:["competition and colonisation", "toxins", "secondary metabolism",
          "unusual substrates, symbiosis", "and whatever you add"]}
];

/* the same four, unrolled onto the genome */
const X0 = 210, X1 = 1400;
const SPAN = [0.30, 0.16, 0.26, 0.28];      /* qualitative, and said so */
const BRACK = [[0, 1, "make another cell"], [2, 2, "keep it alive when things change"],
               [3, 3, "let it compete somewhere"]];

const FR = [
{ s:{info:1},
  cap:"the middle is <b>information and reproduction</b>",
  call:"copy the DNA, read it, build a membrane, divide &#183; and pay for all of it",
  note:"Build the genome outward in layers, and be honest that the boundaries are an engineering decomposition rather than a fact of biology. In the middle is what it takes to be a cell at all: replicate the DNA, transcribe it, translate it, make a membrane, divide, and couple some energy source to all of that. This is the part everybody draws when they draw a cell, and it is the smaller part.",
  desc:"The innermost layer of the genome: information and reproduction — DNA replication, transcription, translation, membrane and division, energy coupling." },

{ s:{info:1, bio:1, core:1},
  cap:"and around it, <b>biosynthesis</b> &#8212; which is bigger",
  call:"the two together are the <b>prototrophic core</b>",
  note:"And around it, the thing that actually dominates the gene count: the metabolic network that makes the substrates the middle runs on. Amino acids, nucleotides, lipids, cofactors, the envelope. Note which is larger. A ribosome is spectacular and there is one operon's worth of it; making the twenty amino acids takes a hundred genes. The two layers together are what the last two slides were defining: the prototrophic core, the thing that can build a whole new cell from a sugar and some salts.",
  desc:"The second layer, biosynthesis, and the two together labelled as the prototrophic core." },

{ s:{info:1, bio:1, core:1, rob:1},
  cap:"then <b>robustness</b>, which is not needed to be alive",
  call:"needed to <b>stay</b> alive when the world does not hold still",
  note:"The next layer is not required to make a cell and is required to keep one. Sensing, regulation, stress responses, DNA repair, switching between nutrients, homeostasis, and defence against foreign DNA and phage. A cell in one perfectly controlled laboratory condition needs none of it. This is also where the useful synthetic biology distinction lives: a minimal cell works in one specified condition, and a chassis stays controllable and functional across the conditions you actually intend to use it in. Those are different objects and people use the same word for both.",
  desc:"The third layer, robustness and control: sensing, regulation, stress response, DNA repair, homeostasis and defence." },

{ s:{info:1, bio:1, core:1, rob:1, eco:1},
  cap:"and outside everything, what makes one organism <b>different from another</b>",
  call:"colonise, poison, digest something odd, build a fruiting body",
  note:"And the outermost layer is everything that lets an organism occupy, defend or exploit a particular place. Colonisation and virulence, toxins and antagonism, secondary metabolism, unusual carbon sources, symbiosis, biofilms and developmental programmes. None of it is life. It is what a particular life does for a living. And it is also, almost always, the layer a synthetic biologist is trying to add, remove or transplant, which is why the rest of this lecture lives out here.",
  desc:"The outermost layer: ecological and specialised functions — competition, colonisation, toxins, secondary metabolism, unusual substrates and symbiosis." },

{ s:{bar:1},
  cap:"<em>E. coli</em> is not 4.6 Mb because <b>life</b> costs 4.6 Mb",
  call:"and it is a good chassis precisely because it is <b>not minimal</b>",
  note:"Unroll the same four categories onto the genome. Do not pretend every base can be cleanly assigned, because it cannot, and the proportions here are qualitative. The point is the shape. Only the first stretch is making another cell. The rest is robustness, adaptability and ecological capability, and all of it comes free when you pick this host. That is the argument for E. coli as a chassis, and it is the opposite of the argument people usually make: it is useful because it is not minimal. Reducing a genome makes the system conceptually cleaner and it removes exactly the robustness that made the chassis worth having.",
  desc:"The same four categories unrolled onto the E. coli genome as a bar, with brackets: making another cell, keeping it alive when things change, and letting it compete somewhere." }
];

window.Deck.sequence("layers", function(slide){
  const s = G.scene(slide, 792, 838);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    /* ---- the rings ---------------------------------------------- */
    if ((v.bar || 0) < 0.5){
      for (let i = LAYER.length - 1; i >= 0; i--){
        const L = LAYER[i], o = cl((v[L.k] || 0)*2 - 1, 0, 1);
        if (o < 0.02) continue;
        const r = grp(o);
        r.appendChild(G.el("circle", {cx:CX, cy:CY, r:L.r, fill:L.col,
          "fill-opacity":i === 0 ? ".16" : ".08", stroke:L.col,
          "stroke-width":i === 0 ? 3 : 2.6}));
        const ty = 250 + i*132;
        r.appendChild(G.el("text", {x:960, y:n1(ty), "font-size":24,
          fill:L.col, "font-weight":700}, L.name.replace("&amp;", "&")));
        L.items.forEach(function(t, k){
          r.appendChild(G.text(960, ty + 28 + k*22, t, 17, C.muted, 400, "start"));
        });
        g.appendChild(r);
      }
      if (v.core > 0.02){
        const c = grp(v.core);
        c.appendChild(path("M"+n1(CX - 176 - 18)+" "+n1(CY + 176 + 26)+
          "a194 194 0 0 0 "+n1(2*(176 + 18))+" 0", C.blue, 3.4));
        c.appendChild(G.text(CX, CY + 176 + 66, "prototrophic core", 26, C.blue, 700));
        c.appendChild(G.text(CX, CY + 176 + 96,
          "builds a whole cell from a sugar and some salts", 19, C.muted, 400));
        g.appendChild(c);
      }
    }

    /* ---- and the same four, unrolled ---------------------------- */
    if (v.bar > 0.02){
      const b = grp(v.bar), BY = 320, BH = 78;
      let x = X0;
      LAYER.forEach(function(L, i){
        const w = (X1 - X0)*SPAN[i];
        b.appendChild(G.el("rect", {x:n1(x), y:BY, width:n1(w), height:BH,
          fill:L.col, "fill-opacity":i < 2 ? ".18" : ".12", stroke:L.col,
          "stroke-width":2.8}));
        b.appendChild(G.el("text", {x:n1(x + w/2), y:n1(BY + BH + 34),
          "font-size":20, fill:L.col, "font-weight":700, "text-anchor":"middle"},
          L.name.replace("&amp;", "&").split(" ")[0]));
        x += w;
      });
      b.appendChild(G.el("text", {x:X0, y:BY - 22, "font-size":25, fill:C.ink,
        "font-weight":700, "font-style":"italic"}, "E. coli"));
      b.appendChild(G.text(X1, BY - 22, "4.64 Mb", 24, C.muted, 400, "end"));
      BRACK.forEach(function(k, i){
        let x0 = X0, x1 = X0;
        LAYER.forEach(function(L, j){
          const w = (X1 - X0)*SPAN[j];
          if (j < k[0]) x0 += w;
          if (j <= k[1]) x1 += w;
        });
        const y = BY + BH + 84 + i*84;
        b.appendChild(path("M"+n1(x0)+" "+n1(y)+"V"+n1(y + 14)+"H"+n1(x1)+
          "V"+n1(y), C.muted, 2.4));
        b.appendChild(G.text((x0 + x1)/2, y + 46, k[2], 24, C.ink, 700));
      });
      b.appendChild(G.text(800, BY + BH + 84 + 3*84 + 10,
        "proportions are qualitative · not every base assigns cleanly",
        19, C.muted, 400));
      g.appendChild(b);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
