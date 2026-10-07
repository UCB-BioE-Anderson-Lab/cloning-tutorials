/* ------------------------------------------------------------------ *
 * 04-claim.js — anatomy of a claim, on an invented claim.
 *
 * The claim drawn here is MADE UP, and the slide says so in the corner.
 * That is deliberate: the machinery — preamble, transition, elements,
 * and the fact that infringement needs every element — has to be in
 * hand BEFORE claim 1 of the '525 arrives, or the room spends the case
 * learning two things at once and gets neither.
 *
 * The claim is laid out the way a patent actually sets one out: the
 * preamble on its own line, the transition indented under it, the
 * elements indented again.  That is not a teaching simplification, it
 * is the house style of the document, and recognising the shape on a
 * page is most of what these students will ever need to do with a
 * claim.
 *
 * The two test constructs do the work the words cannot.  One has every
 * element and two parts the claim never mentions, so it infringes and
 * the extras are irrelevant — which is "comprising", drawn.  The other
 * swaps a fluorescent protein for a luciferase, which also makes light
 * and is not a fluorescent protein, so one element is missing and the
 * whole claim misses.  A luciferase rather than a deleted part on
 * purpose: the construct that escapes should look like it ought to be
 * caught.
 *
 * The last beat annotates element three rather than adding a sixth
 * region, because genus and species is a property of a phrase already
 * on the screen and not a new object.  Nothing is taken away.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

/* the claim, one line per clause, exactly as a patent sets one out */
const CLAIM = [
  { y:252, x:170, t:"An expression cassette",                 size:32, col:C.ink,  w:700 },
  { y:300, x:230, t:"comprising",                             size:32, col:C.blue, w:700 },
  { y:348, x:290, t:"a promoter,",                            size:30, col:C.ink,  w:400 },
  { y:392, x:290, t:"a ribosome binding site, and",           size:30, col:C.ink,  w:400 },
  { y:436, x:290, t:"a gene encoding a fluorescent protein.", size:30, col:C.ink,  w:400 }
];

/* one part of a construct: a labelled box on a row */
function part(x, y, w, label, col, dashed){
  const g = G.el("g", {}), c = col || C.ink;
  const at = {x:x, y:y, width:w, height:54, rx:10,
    fill:C.paper, stroke:c, "stroke-width":2.4};
  /* setAttribute stringifies, so a null dash array would literally set
     stroke-dasharray="null" and silently do nothing recognisable */
  if (dashed) at["stroke-dasharray"] = "7 6";
  g.appendChild(G.el("rect", at));
  g.appendChild(G.text(x + w/2, y + 34, label, 21, c, dashed ? 400 : 700));
  return g;
}

function row(o, label, parts, verdictA, verdictB, vcol){
  const g = G.grp(o);
  g.appendChild(G.text(170, label.y, label.t, 19, C.muted, 400, "start"));
  parts.forEach(p => g.appendChild(part(p.x, label.by, p.w, p.t, p.c, p.d)));
  g.appendChild(G.text(1450, label.by + 28, verdictA, 21, C.muted, 400, "end"));
  g.appendChild(G.text(1450, label.by + 62, verdictB, 26, vcol, 700, "end"));
  return g;
}

function paint(v, f){
  const g = G.el("g", {});

  if (v.claim > 0.02){
    const h = G.grp(v.claim);
    /* the flag that this claim is invented is authored in the section
       file as a .src line — it was here first and collided with the
       preamble label, which shares the top-right corner */
    CLAIM.forEach(c => h.appendChild(
      G.text(c.x, c.y, c.t, c.size, c.col, c.w, "start")));
    g.appendChild(h);
  }

  if (v.labels > 0.02){
    const h = G.grp(v.labels);
    h.appendChild(G.text(1450, 252, "preamble — what the thing is",
      20, C.muted, 400, "end"));
    h.appendChild(G.text(1450, 300, "transition — open: contains AT LEAST these",
      20, C.blue, 700, "end"));
    h.appendChild(G.text(1450, 392, "elements — every one of them, or you are outside",
      20, C.muted, 400, "end"));
    /* a bracket rather than three separate marks: the elements are one
       set, and missing any member fails the whole set */
    h.appendChild(G.path("M282 330L272 330L272 448L282 448", C.muted, 2.2));
    g.appendChild(h);
  }

  if (v.consA > 0.02)
    g.appendChild(row(v.consA,
      {t:"the plasmid on your bench", y:560, by:572},
      [{x:170, w:140, t:"promoter"}, {x:322, w:110, t:"RBS"},
       {x:444, w:160, t:"gfp"},      {x:616, w:160, t:"terminator"}],
      "every element present — the extras are irrelevant",
      "INFRINGES", C.verm));

  if (v.consB > 0.02)
    g.appendChild(row(v.consB,
      {t:"a cassette down the hall", y:666, by:678},
      [{x:170, w:140, t:"promoter"}, {x:322, w:110, t:"RBS"},
       {x:444, w:160, t:"luxAB"},
       {x:616, w:200, t:"nothing fluorescent", c:C.verm, d:1}],
      "luciferase makes light; it is not a fluorescent protein",
      "OUTSIDE THE CLAIM", C.blue));

  if (v.genus > 0.02){
    const h = G.grp(v.genus);
    h.appendChild(G.path("M290 450L886 450", C.verm, 2.6));
    h.appendChild(G.text(290, 486,
      "a genus — a class of things. It covers mCherry, and whatever is published next year.",
      22, C.verm, 700, "start"));
    h.appendChild(G.text(290, 518,
      "a species would be: a gene encoding GFP from Aequorea victoria. Narrower, and far safer.",
      22, C.muted, 400, "start"));
    g.appendChild(h);
  }
  return g;
}

const FR = [];
let acc = {};
function beat(o){
  acc = Object.assign({}, acc, o.s || {});
  FR.push(Object.assign({}, o, {s:Object.assign({}, acc)}));
}

beat({ on:[], s:{claim:1},
  cap:"A claim is a sentence. It is also a fence.",
  call:"",
  note:"This claim is invented. I made it up for this slide, nobody owns it, and I am showing you a fake one first on purpose — because in about five minutes a real claim is going to arrive, from a real case, and I want the machinery already in your hands when it does. What is on the screen is laid out the way a patent actually prints a claim: the opening phrase on its own line, then one word, then the parts indented under it. The whole legal document — thirty pages of description, figures, examples — exists to support the sentences at the end, and those sentences are the only part that defines what anybody owns. Everything before the claims is argument. The claims are the fence.",
  desc:"An invented claim, laid out the way a patent prints one: an expression cassette, comprising, a promoter, a ribosome binding site, and a gene encoding a fluorescent protein. A note in the corner says it is a claim made up for this slide and nobody owns it."});

beat({ on:[], s:{labels:1},
  cap:"Preamble, transition, elements.",
  call:"“comprising” means: contains at least these",
  note:"Three parts, and they have names. The preamble says what kind of thing is claimed — an expression cassette. The elements are the parts it must have, and the bracket is there because they are one set: miss any member and you miss the whole set. And between them, doing more work than anything else on this slide, is one word. Comprising. It is open. It means contains at least these, which is to say extra parts do not get you out. If the transition were closed — the word for that is consisting of — then adding anything would take you outside. Almost every claim you will ever read says comprising, and now you know why: the applicant chose the version that is hardest to design around. If you only remember one word from this whole section, remember that one.",
  desc:"The claim is labelled: the preamble says what kind of thing is claimed, the transition word comprising is marked as open, meaning the thing contains at least these, and a bracket gathers the three elements with the note that every one of them must be present or you are outside."});

beat({ on:[], s:{consA:1},
  cap:"Every element present.",
  call:"Extras are irrelevant — you infringe.",
  note:"Now test something against it. Here is the plasmid on your bench: a promoter, a ribosome binding site, a gene for a fluorescent protein, and a terminator. Run the elements one at a time. Promoter, yes. Ribosome binding site, yes. Gene encoding a fluorescent protein, yes. All three present, so you are inside the claim — and the terminator, which the claim never mentions, does not help you at all. That is comprising, drawn. Students reliably guess the other way round: they assume that adding something clever of their own puts them outside somebody else's claim. It does the opposite. You can improve on a claimed invention, patent your improvement, and still not be allowed to build it, because building it means building everything in their claim as well. That situation is extremely common and it is why cross-licensing exists.",
  desc:"The plasmid on your bench is drawn as four parts in a row — promoter, ribosome binding site, gfp and terminator — and tested element by element. Every element of the claim is present, the extra terminator is irrelevant, and the verdict is that it infringes."});

beat({ on:[], s:{consB:1},
  cap:"One element missing.",
  call:"You are outside the fence entirely.",
  note:"And here is a cassette down the hall. Promoter, yes. Ribosome binding site, yes. Third element — and here it has luxAB, a bacterial luciferase. It makes light. It is not a fluorescent protein: a fluorescent protein absorbs a photon and re-emits it, a luciferase runs a chemical reaction and the light comes out of the chemistry. Different object, different words. So the third element is absent, and the moment one element is absent the claim does not reach this construct at all. Not partly. Not nearly. Outside. This is the asymmetry worth leaving with: to infringe you must have every element, so the drafter wants as few elements as possible and each one as broad as possible. Every word in a claim is a hole somebody can walk through, which is why claims are written in that strangled, unreadable register. They are not being obscure for fun. They are being careful about every single noun.",
  desc:"A second construct is tested: promoter, ribosome binding site and luxAB, with a dashed empty box marking that nothing fluorescent is present. A luciferase makes light but is not a fluorescent protein, so one element is missing and the construct is outside the claim entirely."});

beat({ on:[], s:{genus:1},
  cap:"Species, and genus.",
  call:"Every applicant wants the genus.",
  note:"Last thing, and it is the one the case turns on. Look at the third element. A gene encoding a fluorescent protein is not one thing. It is a class of things — a genus — and it covers GFP, and mCherry, and whatever gets published next year by somebody who has never heard of you. Compare the narrow version: a gene encoding GFP from Aequorea victoria. That is one thing, a species, and it is worth very little, because anyone who wants to work in this space uses a different fluorescent protein on Monday and is clear of you. So every applicant wants the genus. It is more valuable by an enormous factor, and nothing about wanting it is improper — generalising past the examples you actually built is normal, expected, and how patents have always worked in chemistry. The question the law then asks is what you have to have shown in order to be allowed to keep it. Hold that question. It is the entire case we are about to do.",
  desc:"The third element is underlined and annotated: a gene encoding a fluorescent protein is a genus, a class of things covering mCherry and whatever is published next year, while a gene encoding GFP from Aequorea victoria would be a species — one thing, narrower and far safer. Every applicant wants the genus."});

window.Deck.sequence("claimparts", function(slide){
  const s = G.scene(slide, 786, 830);
  s.finish();
  return G.run(s, FR, paint);
});
})();
