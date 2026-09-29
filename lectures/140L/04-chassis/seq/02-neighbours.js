/* ------------------------------------------------------------------ *
 * 02-neighbours.js — E. coli's address, and what lives next door.
 *
 * The source is two lists side by side: five taxonomic ranks on the
 * left and eight genus names on the right, with the whole argument in
 * the speaker notes.  But the ranks ARE a nesting — each one is inside
 * the one above it — and the genus list is what is inside the last
 * box, so the two lists are one figure.  Drawn that way, the slide can
 * then do the thing the notes wanted it to do: light up the two famous
 * killers, admit that Shigella is not really a separate genus at all,
 * and then put both back in their place, because the overwhelming
 * majority of this family is ordinary gut flora.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;
const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);
const mix = (a, b, t) => a + (b - a)*cl(t, 0, 1);

function grp(o){ return G.el("g", {opacity:n1(cl(o == null ? 1 : o, 0, 1))}); }
function ital(x, y, s, size, col, weight, anchor){
  return G.el("text", {x:n1(x), y:n1(y), "font-size":size, fill:col,
    "font-weight":weight || 400, "text-anchor":anchor || "middle",
    "font-style":"italic"}, s);
}

/* ---- the nesting ------------------------------------------------- */
const RANKS = [["Domain","Bacteria"], ["Phylum","Pseudomonadota"],
               ["Class","Gammaproteobacteria"], ["Order","Enterobacterales"],
               ["Family","Enterobacteriaceae"]];
const BOX0 = {x:150, y:190, w:1300, h:572}, STEP = {x:40, y:44};
const box = i => ({x:BOX0.x + STEP.x*i, y:BOX0.y + STEP.y*i,
                   w:BOX0.w - STEP.x*2*i, h:BOX0.h - STEP.y*i});

/* ---- what is in the innermost box -------------------------------- */
/* 4 across, 2 down, alphabetical, which is how the source had them */
const GEN = ["Citrobacter","Escherichia","Klebsiella","Proteus",
             "Salmonella","Serratia","Shigella","Yersinia"];
const SUB = {Salmonella:"S. typhi · S. typhimurium", Yersinia:"Y. pestis"};
const FAME = {Salmonella:"typhoid", Yersinia:"plague"};
const CX = [443, 681, 919, 1157], CY = [478, 600], CW = 214, CH = 58;
const at = i => [CX[i % 4], CY[i < 4 ? 0 : 1]];

const FR = [
{ s:{nest:1},
  cap:"<em>E. coli</em>&#8217;s address",
  call:"five ranks, each one inside the last",
  note:"Place the organism before talking about its relatives. E. coli is a bacterium, in the phylum Pseudomonadota, in the class Gammaproteobacteria, in the order Enterobacterales, in the family Enterobacteriaceae. Each of those is a box inside the previous box, which is worth drawing because the word enterobacteria gets used loosely and it is a family, not a vague grouping. Entero is the gut, which is where the family mostly lives, and that is the thread for the rest of this slide.",
  desc:"Five nested boxes, from the domain Bacteria inward through Pseudomonadota, Gammaproteobacteria and Enterobacterales to the family Enterobacteriaceae." },

{ s:{nest:1, gen:1},
  cap:"the neighbours",
  call:"eight genera, and the species boundaries between them are soft",
  note:"Inside that last box are the genera you will hear about. Citrobacter, Escherichia, Klebsiella, Proteus, Salmonella, Serratia, Shigella, Yersinia. Now, because these organisms reproduce asexually, species and genus are far fuzzier concepts here than they are in the organisms taxonomy was invented for. A given strain is often about as similar to strains in a neighbouring species as it is to strains in its own. So treat these boxes as labels people find useful, not as walls.",
  desc:"The eight genera of the Enterobacteriaceae laid out inside the family box: Citrobacter, Escherichia, Klebsiella, Proteus, Salmonella, Serratia, Shigella and Yersinia." },

{ s:{nest:1, gen:1, fame:1},
  cap:"two of them are famous",
  call:"<em>S. typhi</em> &#183; typhoid &nbsp;&#183;&nbsp; <em>Y. pestis</em> &#183; plague",
  note:"Two names in that list are famous, and for the same reason. Salmonella you have met through chicken and eggs. Salmonella typhi is not one strain but a clade of genetically similar ones, defined by the fact that they cause typhoid fever, and typhimurium LT2 is a fairly common lab strain that gives humans diarrhoea and kills mice. Working with typhimurium and working with typhi are wildly different propositions. Yersinia pestis is bubonic plague and is in the same family. So your organism's close relatives include two of the more consequential pathogens in human history.",
  desc:"Salmonella and Yersinia are marked out, with Salmonella typhi labelled typhoid and Yersinia pestis labelled plague." },

{ s:{nest:1, gen:1, fame:1, shig:1},
  cap:"and one of them is not really a genus",
  call:"<em>Shigella</em> lineages sit <b>inside</b> the <em>E. coli</em> tree",
  note:"And one of those boxes is a fiction. By every genomic measure, Shigella is E. coli: the Shigella lineages fall inside the diversity of Escherichia coli rather than beside it, and they are kept as a separate genus for clinical and historical reasons rather than evolutionary ones. You will meet the same organisms again at the end of this lecture under the name enteroinvasive E. coli. This is the clearest illustration of the previous point. A name can be useful to a clinician and still not describe descent.",
  desc:"A tie is drawn between Escherichia and Shigella, marking that Shigella lineages fall inside the E. coli tree rather than beside it." },

{ s:{nest:1, gen:1, fame:0.18, shig:1, flora:1},
  cap:"but the family business is being ordinary",
  call:"most enterobacteria live quietly in animal guts",
  note:"Having said all that, put it back in proportion. The famous members are famous because people studied them, and people studied them because they cause disease. The overwhelming majority of enterobacterial strains do nothing to anybody. They live in animal guts as part of the ordinary healthy flora, which is exactly what your strains do, and it is why E. coli was available to be picked up out of a stool sample in the first place.",
  desc:"The two pathogens fade back to the same weight as the rest, with a line noting that most enterobacteria live quietly in animal guts." }
];

window.Deck.sequence("neighbours", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    /* ---- the nesting --------------------------------------------- */
    const n = grp(v.nest);
    RANKS.forEach(function(r, i){
      const b = box(i);
      n.appendChild(G.el("rect", {x:b.x, y:b.y, width:b.w, height:b.h, rx:12,
        fill:"none", stroke:i === 4 ? C.blue : C.muted,
        "stroke-width":i === 4 ? 3 : 2.2}));
      n.appendChild(G.text(b.x + 18, b.y + 30, r[0], 21, C.muted, 400, "start"));
      n.appendChild(G.text(b.x + 124, b.y + 30, r[1], 23,
        i === 4 ? C.blue : C.ink, 700, "start"));
    });
    g.appendChild(n);

    /* ---- the genera ---------------------------------------------- */
    if (v.gen > 0.02){
      const q = grp(v.gen);
      GEN.forEach(function(name, i){
        const p = at(i), fam = FAME[name],
              col = fam ? mix(0, 1, v.fame) : 0,
              c = fam && col > 0.5 ? C.verm : C.ink;
        q.appendChild(G.el("rect", {x:n1(p[0] - CW/2), y:n1(p[1] - CH/2),
          width:CW, height:CH, rx:8, fill:c, "fill-opacity":n1(0.06 + 0.10*col),
          stroke:c, "stroke-width":n1(2 + 0.8*col)}));
        q.appendChild(ital(p[0], p[1] + 9, name, 25, c, 700));
        if (SUB[name])
          q.appendChild(ital(p[0], p[1] + CH/2 + 26, SUB[name], 19, C.muted, 400));
      });
      g.appendChild(q);
    }
    /* ---- typhoid and plague -------------------------------------- */
    if (v.fame > 0.02){
      const f = grp(v.fame);
      GEN.forEach(function(name, i){
        if (!FAME[name]) return;
        const p = at(i);
        f.appendChild(G.text(p[0], p[1] - CH/2 - 14, FAME[name], 21, C.verm, 700));
      });
      g.appendChild(f);
    }
    /* ---- Shigella is E. coli ------------------------------------- */
    if (v.shig > 0.02){
      const h = grp(v.shig);
      const e = at(GEN.indexOf("Escherichia")), sh = at(GEN.indexOf("Shigella"));
      /* under both chips, so it never crosses a name */
      const y0 = e[1] + CH/2, y1 = sh[1] - CH/2, my = (y0 + y1)/2;
      h.appendChild(G.el("path", {d:"M"+n1(e[0])+" "+n1(y0)+"V"+n1(my)+
        "H"+n1(sh[0])+"V"+n1(y1), fill:"none", stroke:C.blue,
        "stroke-width":2.6, "stroke-dasharray":"7 6",
        "stroke-linecap":"round", "stroke-linejoin":"round"}));
      [e, sh].forEach(function(p){
        h.appendChild(G.el("rect", {x:n1(p[0] - CW/2), y:n1(p[1] - CH/2),
          width:CW, height:CH, rx:8, fill:"none", stroke:C.blue,
          "stroke-width":3.2}));
      });
      g.appendChild(h);
    }
    /* ---- and most of them are nobody ----------------------------- */
    if (v.flora > 0.02){
      const fl = grp(v.flora);
      fl.appendChild(G.text(800, 716,
        "the rest of the family: gut flora, and nothing more", 24, C.muted, 400));
      g.appendChild(fl);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
