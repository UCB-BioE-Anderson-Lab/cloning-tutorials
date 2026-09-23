/* ------------------------------------------------------------------ *
 * 01-genome.js — the core you inherit, and the part that makes a
 * strain a particular strain.
 *
 * The source slide is four bolded phrases and a line of numbers, and
 * the numbers are the content: three thousand genes, three million
 * bases, out of a genome that is four and a half million.  That is a
 * proportion, and a proportion wants to be a length.  So the genome is
 * drawn to scale and cut where the note says to cut it, which also sets
 * up the next slide, because the celebrity phenotypes are all in the
 * piece on the right.
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
function ital(x, y, s, size, col, weight, anchor){
  return G.el("text", {x:n1(x), y:n1(y), "font-size":size, fill:col,
    "font-weight":weight || 400, "text-anchor":anchor || "start",
    "font-style":"italic"}, s);
}

/* ---- the genome, to scale ---------------------------------------- *
 * MG1655 is 4,641,652 bp.  The core, per the source, is about three
 * million of them, so the cut falls a little under two thirds along. */
const X0 = 200, PXMB = 245.7, TOT = 4.64, CORE = 3.0;
const XC = X0 + PXMB*CORE, X1 = X0 + PXMB*TOT;
const BY = 322, BH = 58;

const JOBS = [["cell growth and division", "septation, the wall, splitting in two"],
              ["the central dogma", "replication, transcription, translation"],
              ["primary metabolism", "carbon in, ATP and building blocks out"],
              ["environment sensing", "what is out there, what to do about it"]];

const FR = [
{ s:{bar:1},
  cap:"one genome, <b>4.64 Mb</b>",
  call:"about 4,400 genes, and you did not choose any of them",
  note:"This is the MG1655 genome drawn to scale: four point six four million bases, a bit over four thousand genes. Everything in this lecture is about how that length is divided, because the division is not even slightly even, and the two parts of it behave completely differently when you engineer them.",
  desc:"The E. coli MG1655 genome drawn as a bar to scale, 4.64 megabases." },

{ s:{bar:1, core:1},
  cap:"most of it is the <b>same genome every bacterium has</b>",
  call:"~3000 genes &#183; ~3 Mb &#183; and almost identical across the Enterobacteria",
  note:"Most of the genes in any given prokaryote are the same as the genes in all the others. There is a core set of processes that every prokaryote has and that vary remarkably little in their details: cell growth and division, the central dogma, primary metabolism and environmental sensing. Together that takes about three thousand genes and about three million bases to encode, which is this much of the bar. Among the enterobacteria those genes are very nearly identical base for base, and they are clearly homologous to the same genes in prokaryotes much further away. So when you pick a bacterial chassis, most of what you are picking is the same whatever you pick.",
  desc:"About three megabases of the bar is marked as the core genome, the roughly three thousand genes common to all bacteria." },

{ s:{bar:1, core:1, jobs:1},
  cap:"four jobs, and they are what being alive consists of",
  call:"you inherit all of this, working, and you did not have to build it",
  note:"Those three million bases are doing four things. Growing and dividing, which is the wall, the septum and the machinery of splitting in two. The central dogma, which is replication, transcription and translation, and is what makes your gene into your protein. Primary metabolism, which turns whatever carbon you feed it into ATP and building blocks. And environmental sensing, which is how it knows what is out there and what to do about it. Every one of those arrives working. That is what the chassis metaphor was pointing at.",
  desc:"The four process groups inside the core: cell growth and division, the central dogma, primary metabolism, and environment sensing." },

{ s:{bar:1, core:1, jobs:1, acc:1},
  cap:"and then there is <b>the rest</b>",
  call:"~1.6 Mb &#183; this is the part that makes a strain a particular strain",
  note:"And then a third of the genome is not that. It is the part that differs between one strain and the next, and it is where everything interesting lives: the ability to eat a particular sugar, to survive in a particular place, to stick to a particular surface, to make a particular molecule. Two E. coli strains can share essentially the whole core and differ by a thousand genes out here. When a genotype tells you a strain is different from its parent, this is almost always the region it is talking about, and the next slide is a tour of how strange it gets.",
  desc:"The remaining 1.6 megabases is marked as the accessory genome, the part that differs between strains." }
];

window.Deck.sequence("genome", function(slide){
  const s = G.scene(slide, 792, 838);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    /* ---- the bar ------------------------------------------------- */
    const b = grp(v.bar);
    b.appendChild(G.el("rect", {x:X0, y:BY, width:n1(X1 - X0), height:BH, rx:6,
      fill:C.muted, "fill-opacity":".10", stroke:C.ink, "stroke-width":2.6}));
    b.appendChild(ital(X0, BY - 24, "E. coli", 25, C.ink, 700, "start"));
    b.appendChild(G.text(X0 + 84, BY - 24, "MG1655", 25, C.ink, 700, "start"));
    b.appendChild(G.text(X1, BY - 24, "4.64 Mb", 25, C.muted, 400, "end"));
    g.appendChild(b);

    /* ---- the part every bacterium has ---------------------------- */
    if (v.core > 0.02){
      const c = grp(v.core);
      c.appendChild(G.el("rect", {x:X0, y:BY, width:n1(XC - X0), height:BH, rx:6,
        fill:C.blue, "fill-opacity":".16", stroke:C.blue, "stroke-width":3}));
      c.appendChild(G.text((X0 + XC)/2, BY + 37, "core", 27, C.blue, 700));
      c.appendChild(path("M"+n1(X0)+" "+n1(BY + BH + 16)+"V"+n1(BY + BH + 26)+
        "H"+n1(XC)+"V"+n1(BY + BH + 16), C.blue, 2.4));
      c.appendChild(G.text((X0 + XC)/2, BY + BH + 52,
        "∼3 Mb · ∼3000 genes · every bacterium has it", 23, C.blue, 400));
      g.appendChild(c);
    }
    /* ---- what those genes are for -------------------------------- */
    if (v.jobs > 0.02){
      const j = grp(v.jobs);
      JOBS.forEach(function(row, i){
        const x = X0 + (i % 2)*430, y = 500 + Math.floor(i/2)*102;
        j.appendChild(path("M"+n1(x)+" "+n1(y - 22)+"V"+n1(y + 26), C.blue, 3));
        j.appendChild(G.text(x + 18, y, row[0], 25, C.blue, 700, "start"));
        j.appendChild(G.text(x + 18, y + 28, row[1], 19, C.muted, 400, "start"));
      });
      g.appendChild(j);
    }
    /* ---- and the part that is this strain and no other ----------- */
    if (v.acc > 0.02){
      const a = grp(v.acc);
      a.appendChild(G.el("rect", {x:n1(XC), y:BY, width:n1(X1 - XC), height:BH, rx:6,
        fill:C.verm, "fill-opacity":".16", stroke:C.verm, "stroke-width":3}));
      a.appendChild(G.text((XC + X1)/2, BY + 37, "the rest", 26, C.verm, 700));
      /* The bracket and the total both wanted the line above the bar,
         and the three notes ran into the second column of jobs. */
      a.appendChild(path("M"+n1(XC)+" "+n1(BY + BH + 16)+"V"+n1(BY + BH + 26)+
        "H"+n1(X1)+"V"+n1(BY + BH + 16), C.verm, 2.4));
      a.appendChild(G.text((XC + X1)/2, BY + BH + 52, "\u223c1.6 Mb", 23, C.verm, 700));
      ["sugars it can eat \u00b7 places it can live",
       "things it sticks to \u00b7 things it makes",
       "and every gene a genotype names"].forEach(function(t, k){
        a.appendChild(G.text(XC + 14, 664 + k*32, t, 21, C.verm, 400, "start"));
      });
      g.appendChild(a);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
