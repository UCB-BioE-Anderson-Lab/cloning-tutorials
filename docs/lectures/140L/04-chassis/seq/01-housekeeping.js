/* ------------------------------------------------------------------ *
 * 01-housekeeping.js — most of a bacterium is just "a bacterium".
 *
 * The point the source deck makes on its slide 10 and never quite gets
 * onto ours: about three thousand genes, three million bases, common
 * to all bacteria and base-for-base near-identical across the
 * enterobacteria.  That is the chassis, in the only sense that matters
 * here, and everything the rest of the lecture does is reason about
 * what has been added to it or taken out of it.
 *
 * Proportions are pinned to CORE = 3.0 Mb of TOT = 4.64 in
 * 05-accessory.js, because that slide redraws this bar and opens with
 * "back to the layered genome from the first section".  If these drift
 * apart the callback lands on a figure that does not match.
 *
 * Replaces the minimal-genome survey and prototrophy-as-a-definition,
 * which were the dull stretch and which nothing downstream needed.
 * The layer partition itself is kept because section 6 does need it.
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

const BX0 = 230, BW = 1160, BBY = 316, BBH = 80, TOT = 4.64;
/* sums to 0.65 -> 3.02 Mb of core, which is the 3.0 that 05-accessory
   draws its split at */
const LAY = [["information", 0.28, C.blue], ["biosynthesis", 0.15, C.blue],
             ["robustness", 0.22, C.amber], ["ecological", 0.35, C.verm]];
const BRACK = [[0, 1, "make another cell"],
               [2, 2, "keep it alive when things change"],
               [3, 3, "let it compete somewhere"]];
const CORE = LAY.slice(0, 3).reduce(function(a, L){ return a + L[1]; }, 0);

function edge(i){
  let x = BX0;
  for (let j = 0; j < i; j++) x += BW*LAY[j][1];
  return x;
}

const FR = [
{ s:{bar:1},
  cap:"one <em>E. coli</em> genome &#183; 4.64 <b>Mb</b>",
  call:"how much of this is <em>E. coli</em>, and how much is just <b>a bacterium</b>?",
  note:"One genome, four and a bit megabases. Ask the question before splitting it: how much of that is specifically E. coli, and how much of it is just the cost of being a bacterium at all? Most people guess the wrong way round.",
  desc:"The E. coli genome drawn as a single bar, 4.64 megabases, not yet divided." },

{ s:{bar:1, core:1},
  cap:"about <b>3 Mb</b> of it is the same in every bacterium",
  call:"~3000 genes &#183; growth and division, the central dogma, primary metabolism, sensing",
  note:"About three million bases of it, roughly three thousand genes, encode things every bacterium has to do: grow and divide, run the central dogma, run primary metabolism, sense the environment. This is the housekeeping set. It is not a list anybody memorises, and the number is the useful thing: two thirds of the genome is spent on being alive at all, before the organism gets to be any particular organism.",
  desc:"About 3 megabases of the genome, some 3000 genes, is highlighted as the housekeeping core common to every bacterium." },

{ s:{bar:1, core:1, same:1},
  cap:"and it is <b>nearly identical</b> across the Enterobacteria",
  call:"a commensal and something that will hospitalise you share essentially all of it",
  note:"And it is not merely equivalent, it is close to identical base for base across the enterobacteria, and clearly homologous further out than that. Which gives you the fact this whole lecture turns on: a harmless gut commensal and a strain that will put somebody in hospital have essentially the same three megabases. Whatever makes one of them dangerous is not in here.",
  desc:"The core is marked as nearly identical base for base across the Enterobacteria, so a commensal and a pathogen share essentially all of it." },

{ s:{bar:1, core:1, same:1, lay:1},
  cap:"which leaves <b>1.6 Mb</b> that is actually about <em>this</em> strain",
  call:"the core makes a cell and keeps it alive &#183; the rest lets it compete somewhere",
  note:"So split the core by what it is for. The innermost part is information and reproduction: replication, transcription, translation, division. Next is biosynthesis, making your own amino acids and nucleotides and lipids. Then a robustness layer around that, the regulation and repair and stress responses that keep it going when conditions move. Those three make a cell and keep it alive. And then the outer one, about one and a half megabases, which is not about being alive at all: it is about competing in one particular place. That is where strains differ from each other, it is where almost everything interesting lives, and it is where we are going next.",
  desc:"The genome split into four layers: information, biosynthesis and robustness make up the core that builds and maintains a cell, while the outer ecological layer of about 1.6 megabases is what differs between strains." }
];

window.Deck.sequence("housekeeping", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});
    const split = (v.core || 0) > 0.5, layered = (v.lay || 0) > 0.5;

    const f = grp(v.bar);
    f.appendChild(G.el("text", {x:BX0, y:BBY - 24, "font-size":25, fill:C.ink,
      "font-weight":700, "font-style":"italic"}, "E. coli"));
    f.appendChild(G.text(BX0 + BW, BBY - 24, "4.64 Mb", 24, C.muted, 400, "end"));

    if (!split){
      f.appendChild(G.el("rect", {x:BX0, y:BBY, width:BW, height:BBH, rx:5,
        fill:C.muted, "fill-opacity":".14", stroke:C.muted, "stroke-width":2.8}));
    } else if (!layered){
      const cw = BW*CORE;
      f.appendChild(G.el("rect", {x:BX0, y:BBY, width:n1(cw), height:BBH, rx:5,
        fill:C.blue, "fill-opacity":".2", stroke:C.blue, "stroke-width":3}));
      f.appendChild(G.el("rect", {x:n1(BX0 + cw), y:BBY, width:n1(BW - cw),
        height:BBH, rx:5, fill:C.muted, "fill-opacity":".12", stroke:C.muted,
        "stroke-width":2.6}));
      f.appendChild(G.text(BX0 + cw/2, BBY + BBH + 34, "~3 Mb · ~3000 genes",
        24, C.blue, 700));
      f.appendChild(G.text(BX0 + cw/2, BBY + BBH + 64,
        "every bacterium has to do this", 20, C.muted, 400));
    } else {
      LAY.forEach(function(L, i){
        const x = edge(i), w = BW*L[1];
        f.appendChild(G.el("rect", {x:n1(x), y:BBY, width:n1(w), height:BBH,
          fill:L[2], "fill-opacity":".20", stroke:L[2], "stroke-width":2.8}));
        f.appendChild(G.text(x + w/2, BBY + BBH + 30, L[0], 21, L[2], 700));
      });
      BRACK.forEach(function(k, i){
        const x0 = edge(k[0]), x1 = edge(k[1] + 1);
        const by = BBY + BBH + 68 + i*84;
        f.appendChild(path("M"+n1(x0)+" "+n1(by)+"V"+n1(by + 14)+"H"+n1(x1)+
          "V"+n1(by), C.muted, 2.4));
        f.appendChild(G.text((x0 + x1)/2, by + 44, k[2], 24, C.ink, 700));
      });
    }
    g.appendChild(f);

    if (v.same > 0.02 && !layered){
      const q = grp(v.same), cw = BW*CORE;
      q.appendChild(path("M"+n1(BX0)+" "+n1(BBY - 46)+"V"+n1(BBY - 60)+
        "H"+n1(BX0 + cw)+"V"+n1(BBY - 46), C.verm, 2.6));
      q.appendChild(G.text(BX0 + cw/2, BBY - 72,
        "near-identical, base for base, across the Enterobacteria", 23,
        C.verm, 700));
      g.appendChild(q);
    }
    if (layered){
      const q = grp(v.lay), x = edge(3);
      q.appendChild(G.text(x + BW*LAY[3][1]/2, BBY - 60,
        "1.6 Mb · this is where strains differ", 23, C.verm, 700));
      g.appendChild(q);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
