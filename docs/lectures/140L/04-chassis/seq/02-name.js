/* ------------------------------------------------------------------ *
 * 02-name.js — three strains, one species, and the name tells you
 * nothing.
 *
 * This section was the one stretch with no question in it at all, so
 * it read as a different deck when you arrived in it.  It also had a
 * motivation problem: the pedigree, the neighbours and the pathotypes
 * are all good material arriving before anybody has been given a
 * reason to want them.
 *
 * So it opens on the reason.  Three real E. coli, named, and a
 * judgement they cannot make from the names -- which is exactly the
 * gap that genotypes fill in the next section.  It also sets up the
 * safety exercise in section 6 without duplicating it: this one is
 * "the species name is not a specification", that one is "here is the
 * gene, now decide".
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

const CX = [410, 800, 1190], CY = 386, CW = 320, CH = 128;
const CARDS = [
  {key:"mg",   name:"MG1655",      sub:"E. coli K-12",
   tell:"the reference genome", col:"blue",
   more:"harmless · sequenced in 1997 · the strain every coordinate is quoted against"},
  {key:"o157", name:"O157:H7",     sub:"E. coli",
   tell:"Shiga toxin · outbreaks", col:"verm",
   more:"enterohaemorrhagic · has killed people · BSL-2, and handled accordingly"},
  {key:"niss", name:"Nissle 1917", sub:"E. coli",
   tell:"sold as a probiotic", col:"blue",
   more:"a wild isolate · taken deliberately, by people, as medicine"}
];

const FR = [
{ s:{cards:1, pose:1},
  cap:"<b>Your turn.</b> Three strains, and that is all you are told",
  call:"which of these would you grow on the open bench?",
  note:"Open on the decision rather than the pedigree. Three strain names, nothing else. Which would you be willing to grow on the bench? Give them a minute. Most rooms will split on the middle one and be confident about the outer two, and the interesting part is that they cannot actually justify any of it yet.",
  desc:"Three strain names — MG1655, O157:H7 and Nissle 1917 — presented with no other information, and the room asked which they would grow on the open bench." },

{ s:{cards:1, same:1},
  cap:"all three are <em>E. coli</em>",
  call:"same species &#183; same genus &#183; and the label has told you almost nothing",
  note:"All three are E. coli. Not relatives, not close cousins: the same species, and two of them are the same serotype naming convention applied to the same organism. So whatever made you comfortable about one and uncomfortable about another, it was not the species name, because the species name is identical in all three cases.",
  desc:"All three strains are revealed to be E. coli — the same species — so the species name cannot be what distinguishes them." },

{ s:{cards:1, same:1, tell:1},
  cap:"and they could hardly be more different",
  call:"a reference strain, something that has killed people, and a <b>medicine</b>",
  note:"And here is what they are. MG1655 is the K-12 reference, the harmless thing every genome coordinate in the field is quoted against. O157:H7 is enterohaemorrhagic, carries Shiga toxin, and is responsible for outbreaks that have killed people; it is handled at BSL-2. And Nissle 1917 is a wild isolate that is sold in pharmacies and swallowed deliberately as a probiotic. One species. A reference organism, a pathogen, and a medicine.",
  desc:"The three are revealed as the K-12 reference strain, an enterohaemorrhagic pathogen carrying Shiga toxin, and a probiotic taken as medicine." },

{ s:{lesson:1},
  cap:"so a species name is <b>not a specification</b>",
  call:"which is why the next thing you will be handed is a <b>genotype</b>",
  note:"Land the consequence, because it is what the rest of the lecture is for. A species name does not tell you what a strain can do, what it needs, or whether it is safe. It is a label attached for historical and clinical reasons and it survives being wrong: you will see in a moment that Shigella is inside the E. coli tree and is kept separate anyway. What does carry the information is a genotype, which says what has been done to a particular strain, and a lineage, which says what it inherited before anybody did anything to it. Those are the next two things we look at, and now you know why you want them.",
  desc:"The conclusion: a species name is not a specification, so what carries the information is the genotype and the lineage — which are what the rest of the section covers." }
];

window.Deck.sequence("name", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    if (v.lesson > 0.02){
      const q = grp(v.lesson);
      q.appendChild(G.text(800, 390, "the name is a label,", 46, C.muted, 400));
      q.appendChild(G.text(800, 456, "not a description", 46, C.ink, 700));
      q.appendChild(path("M540 512H1060", C.muted, 2.4));
      q.appendChild(G.text(800, 566, "what a strain can do is in its genotype", 28,
        C.blue, 700));
      q.appendChild(G.text(800, 610, "what it started as is in its lineage", 28,
        C.blue, 700));
      q.appendChild(G.text(800, 672, "both of which are the rest of this section",
        22, C.muted, 400));
      g.appendChild(q);
      return g;
    }

    CARDS.forEach(function(c, i){
      const q = grp(v.cards);
      const shown = (v.tell || 0) > 0.5;
      const col = shown ? (c.col === "verm" ? C.verm : C.blue) : C.muted;
      q.appendChild(G.el("rect", {x:n1(CX[i] - CW/2), y:CY, width:CW, height:CH,
        rx:10, fill:col, "fill-opacity":shown ? ".12" : ".06", stroke:col,
        "stroke-width":shown ? 3 : 2.2}));
      q.appendChild(G.text(CX[i], CY + 56, c.name, 30, C.ink, 700));
      if ((v.same || 0) > 0.5)
        q.appendChild(G.el("text", {x:n1(CX[i]), y:n1(CY + 96), "font-size":22,
          fill:C.muted, "text-anchor":"middle", "font-style":"italic"},
          "E. coli"));
      else
        q.appendChild(G.text(CX[i], CY + 96, "?", 34, C.muted, 700));
      if (shown){
        q.appendChild(G.text(CX[i], CY + CH + 44, c.tell, 23, col, 700));
        c.more.split(" · ").forEach(function(t, k){
          q.appendChild(G.text(CX[i], CY + CH + 78 + k*28, t, 18, C.muted, 400));
        });
      }
      g.appendChild(q);
    });
    return g;
  }
  return G.run(s, FR, paint);
});
})();
