/* ------------------------------------------------------------------ *
 * 00-word.js — six things the field calls practices, and the one it
 * does not.
 *
 * Was 95 words.  The slide's actual payload is an ABSENCE, and prose is
 * the worst possible way to deliver one: a sentence saying "notice what
 * is not on that list" asks the room to hold six items in memory and
 * run a search over them.  Drawn, the gap is a shape on the screen and
 * the room sees it before the sentence arrives.
 *
 * THE SEVENTH BOX IS DASHED AND EMPTY-LOOKING on purpose — it is the
 * only verm object on the slide and it sits apart from the row, so it
 * reads as something missing from the row rather than as a seventh
 * member of it.
 *
 * PROVENANCE: the six uses are the field's own, from the source deck.
 * VERIFY before expanding from the podium: Rabinow's department, the
 * funding and span of SynBERC, and any specific phrase attributed to
 * him.  No quotation is put in his mouth here or in the note.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

const RY = 408, RH = 96, RW = 208, GAP = 20;
const X0 = 136;
const rx = i => X0 + i*(RW + GAP);

const USE = [
  ["biosafety"], ["biosecurity"], ["intellectual", "property"],
  ["government", "regulation"], ["public", "perception"], ["education"]
];

const MX = 800, MY = 584, MW = 460, MH = 92;

function paint(v, f){
  const g = G.grp();

  if (v.origin > 0.02){
    const h = G.grp(v.origin);
    h.appendChild(G.text(420, 276, "human practices", 36, C.ink, 700));
    h.appendChild(G.text(420, 308, "Paul Rabinow · SynBERC", 21, C.muted, 400));
    h.appendChild(G.arrow(620, 268, 760, 268, C.rule, 3));
    h.appendChild(G.text(1010, 276, "practices", 36, C.ink, 700));
    h.appendChild(G.text(1010, 308, "shortened, and stretched ever since",
      21, C.muted, 400));
    g.appendChild(h);
  }

  if (v.six > 0.02){
    const h = G.grp(v.six);
    USE.forEach(function(U, i){
      h.appendChild(G.box(rx(i), RY, RW, RH, C.muted, C.paper));
      h.appendChild(G.lines(rx(i) + RW/2, RY + (U[1] ? 42 : 56), U,
        22, C.ink, 400, "middle", 28));
    });
    g.appendChild(h);
  }

  if (v.gap > 0.02){
    const h = G.grp(v.gap);
    h.appendChild(G.el("rect", {x:MX - MW/2, y:MY, width:MW, height:MH, rx:12,
      fill:"none", stroke:C.verm, "stroke-width":3, "stroke-dasharray":"11 8"}));
    h.appendChild(G.text(MX, MY + 56, "whether any of it can be paid for",
      27, C.verm, 700));
    h.appendChild(G.text(MX, MY - 16, "not on that list", 22, C.verm, 400));
    g.appendChild(h);
  }

  return g;
}

const FR = [];
const beat = o => FR.push(o);

beat({ on:[], s:{origin:1},
  cap:"",
  call:"",
  note:"A word about the word, because you will meet it and it does not define itself. In the early years of SynBERC — the Synthetic Biology Engineering Research Center, which ran human practices as one of its thrusts next to the engineering ones — Paul Rabinow, a professor here at Berkeley, introduced the phrase human practices into the lexicon of genetic engineering. It was meant to name the study of how the technology meets people's lives, done alongside the technology rather than after it. Then it got shortened, which is the arrow, and the scope has been getting broader ever since. VERIFY BEFORE EXPANDING ON THIS FROM THE PODIUM: Rabinow's department, the funding and span of SynBERC, and any specific phrase attributed to him. What is on the slide is the whole of what the source notes support, and I have deliberately not put a quotation in his mouth.",
  desc:"Where the term comes from: human practices, introduced by Berkeley professor Paul Rabinow in the early years of SynBERC, shortened to practices and stretched ever since."});

beat({ on:[], s:{origin:1, six:1}, dur:1500,
  cap:"",
  call:"",
  note:"People in this field now use the term for all six of these: biosafety, biosecurity, intellectual property, government regulation, public perception, and education. That breadth is the honest reason it is hard to define — it is a container word. It is also its strength, because those things genuinely do belong together. The committee that reviews your protocol and the patent that covers your construct are both answers to the same kind of question, which is what the world outside the lab is allowed to ask of you. Read the row out and then STOP, and let them look at it for a moment before you go on, because the next beat depends on them having looked.",
  desc:"Six boxes: the uses the field now puts the word to — biosafety, biosecurity, intellectual property, government regulation, public perception, and education."});

beat({ on:[], s:{origin:1, six:1, gap:1},
  cap:"",
  call:"That omission is a whole section of this lecture.",
  note:"And now the one that is not in the row. Whether any of it can be paid for. That is not an accident of my phrasing — the list of six is the field's own usage, and money is genuinely not in it. The field does not treat elementary business arithmetic as part of practices, and it has cost it three times now: biofuels, the metabolic-engineering wave, and cell therapy. Each time the biology worked and the arithmetic was never run. We are going to spend twenty minutes on that later precisely BECAUSE the list does not, and you should notice that the box is drawn differently from the other six — it is not a seventh thing the field does, it is a hole in what the field counts.",
  desc:"A seventh box, dashed and set apart from the row: whether any of it can be paid for — not on that list, and a whole section of this lecture."});

window.Deck.sequence("word", function(slide){
  const s = G.scene(slide, 792, 840);
  s.finish();
  return G.run(s, FR, paint);
});
})();
