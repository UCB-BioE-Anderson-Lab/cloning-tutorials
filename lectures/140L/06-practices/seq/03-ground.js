/* ------------------------------------------------------------------ *
 * 03-ground.js — the chronology of US dual-use oversight policy.
 *
 * The teachable thing here is NOT the contents of any of these policies.
 * It is the speed.  A single unified policy was written, implemented by
 * NIH, and killed by executive order ONE DAY before it would have taken
 * effect; it never operated at all.  Then a different policy, with a
 * different vocabulary, replaced it and four older documents with it.
 *
 * So the drawing is a dated list with one piece of geometry in it: a
 * vermillion brace spanning the two adjacent rows that are one day
 * apart.  Everything else is text, because a date list IS the argument
 * and dressing it up as a timeline would hide the one-day gap inside a
 * tick two pixels wide.
 *
 * VOCABULARY.  "DURC/PEPP policy", "Category 1 / Category 2" and "P3CO"
 * are retired as NAMES of the operative framework and must not appear
 * as current policy names; they appear here only as things that were
 * replaced.  "Dual use research of concern" survives as a concept.
 *
 * NO EFFECTIVE DATE is stated for the 2026 policy anywhere in the
 * document, and none is drawn here.  Secondary summaries saying
 * "effective January 2027" are misreading a 180-day deadline.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

/* one row = a date in the left gutter and one or two lines beside it.
   the date column ends at 400 so the longest date, "10 Jan 2025", still
   clears the text column at 432. */
function row(y, date, body, col){
  const g = G.el("g", {});
  g.appendChild(G.text(400, y, date, 26, col || C.ink, 700, "end"));
  g.appendChild(G.lines(432, y, body, 25, C.ink, 400, "start", 34));
  return g;
}

function paint(v, f){
  const g = G.el("g", {});
  const past = v.now > 0.02 ? 0.42 : 1;

  if (v.set > 0.02){
    const h = G.grp(v.set*past);
    h.appendChild(row(248, "May 2024",
      ["One unified federal policy is issued, covering both dual use research of",
       "concern and research on pathogens with enhanced pandemic potential"]));
    h.appendChild(row(332, "10 Jan 2025",
      ["NIH tells every institution it funds how to implement it"]));
    g.appendChild(h);
  }

  if (v.due > 0.02){
    const h = G.grp(v.due*past);
    h.appendChild(row(396, "6 May 2025",
      ["the day the 2024 policy would have taken effect"],
      v.eo > 0.02 ? C.verm : C.blue));
    /* the strike is drawn across the row rather than the row being faded:
       "replaced" is a thing that happened to it, not a loss of emphasis */
    if (v.eo > 0.02)
      h.appendChild(G.path("M246 388L1040 388", C.verm, 3));
    g.appendChild(h);
  }

  /* The executive order is one day EARLIER than the row above it, which
     is why it is a panel cutting in rather than a fourth row: a strict
     chronology would hide the whole point inside a two-pixel gap.  The
     arrow carries the inversion and the heading says it in words. */
  if (v.eo > 0.02){
    const h = G.grp(v.eo*past);
    h.appendChild(G.arrow(700, 436, 700, 404, C.verm, 2.6));
    h.appendChild(G.el("rect", {x:150, y:444, width:1300, height:162, rx:16,
      fill:C.verm, "fill-opacity":0.06, stroke:C.verm, "stroke-width":2.8}));
    h.appendChild(G.text(180, 490, "5 May 2025 — one day earlier",
      28, C.verm, 700, "start"));
    h.appendChild(G.lines(180, 528,
      ["Executive Order 14292 suspends federal funding for dangerous gain-of-function",
       "research and orders the policy replaced. Two days later NIH rescinds its own",
       "implementation notice. The 2024 policy never operated at all."],
      23, C.ink, 400, "start", 30));
    g.appendChild(h);
  }

  if (v.now > 0.02){
    const h = G.grp(v.now);
    h.appendChild(G.el("rect", {x:150, y:640, width:1300, height:188, rx:16,
      fill:C.paper, stroke:C.blue, "stroke-width":2.8}));
    h.appendChild(G.text(180, 686, "20 July 2026", 26, C.blue, 700, "start"));
    h.appendChild(G.lines(400, 686,
      ["Approved: “Stopping High-Risk Life Sciences Research”. It prohibits federal",
       "funding for two things — dangerous gain-of-function research, and",
       "international research of concern."], 25, C.ink, 400, "start", 32));
    h.appendChild(G.lines(180, 786,
      ["It replaces the 2024 policy and three older documents with it. No effective date appears anywhere in it, and the",
       "review bodies and the lists of entities of concern that it calls for are all due after today."],
      19, C.muted, 400, "start", 24));
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

beat({ on:[], s:{set:1, due:1},
  cap:"", call:"",
  note:"Start in 2024. For about a decade before this there were two separate oversight regimes, one for dual use research of concern and one for research on pathogens with enhanced pandemic potential, and they overlapped awkwardly. In May 2024 a single unified policy was issued to replace both. In January 2025 NIH did the thing that actually makes a policy real, which is to tell every institution it funds how to implement it. And it was set to take effect on the sixth of May, 2025. At this point in the story everything is working exactly the way you would hope a federal science policy works: it was drafted, it went out for comment, it was unified, it was implemented, and it had a date.",
  desc:"A dated chronology begins. May 2024: one unified federal policy is issued covering both dual use research of concern and research on pathogens with enhanced pandemic potential. 10 January 2025: NIH tells every institution it funds how to implement it. 6 May 2025 is marked as the day it would take effect."});

beat({ on:[], s:{eo:1}, dur:1500,
  cap:"", call:"",
  note:"And on the fifth of May, 2025 — one day earlier — Executive Order 14292 suspended federal funding for dangerous gain-of-function research and directed that the policy be replaced. Two days after that, NIH rescinded its own implementation notice. So the unified policy was killed the day before it would have taken effect, and it never operated. Not for a week, not for a day. The department's own policy history page describes it as developed in 2024 but not implemented, which is an unusually blunt sentence for a government web page.\nI am not asking you to have an opinion about whether that was right. I am asking you to notice what it tells you about the ground you are standing on. A policy that had been drafted, consulted on, unified, implemented and dated turned out to have a shelf life of less than a day, and the people who had spent the previous January rewriting their institutional procedures to comply with it had to throw that work away.",
  desc:"5 May 2025, one day earlier: Executive Order 14292 suspends federal funding for dangerous gain-of-function research and orders the policy replaced. A brace marks the one-day gap, the 6 May row is struck through, and the conclusion is drawn: it never operated, and the agency's own policy history page describes the 2024 policy as developed in 2024 but not implemented."});

beat({ on:[], s:{now:1}, dur:1400,
  cap:"", call:"",
  note:"And what is actually in force today. In July 2026 the White House science office approved a policy called Stopping High-Risk Life Sciences Research. It prohibits federal funding for two categories: dangerous gain-of-function research, and international research of concern. It replaces the 2024 policy and three older documents along with it — the 2012 federal dual-use policy, the 2014 institutional one, and the 2017 guidance on enhanced potential pandemic pathogens. Four documents retired at once, and with them the acronyms that every course like this one taught for a decade.\nTwo cautions, and then the point. First, there is no effective date anywhere in that document; it is in force from issuance with phased deadlines, and any summary that tells you it takes effect in January 2027 is misreading a hundred-and-eighty-day institutional deadline. Second, the machinery it calls for does not exist yet: the interagency review body, the lists of entities of concern, the institutional review entities — every one of those is due after today, so do not describe the international-research restrictions as operational, because they are not.\nAND THE POINT, which is why I taught you a chronology instead of a rule list. You will outlive every acronym on this slide. Three of the four documents it replaced were things somebody stood in a room like this one and taught as current. What you need is not the name of the policy that is in force in October of 2026; it is the habit of checking what is in force before you rely on it — which is a thirty-second search, and almost nobody does it.",
  desc:"What is in force now. 20 July 2026: a policy called Stopping High-Risk Life Sciences Research is approved. It prohibits federal funding for dangerous gain-of-function research and for international research of concern, and it replaces the 2024 policy and three older documents. No effective date appears anywhere in it, and the review bodies and lists of concern it calls for are all due after today."});

window.Deck.sequence("ground", function(slide){
  const s = G.scene(slide, 860, 888);
  s.finish();
  return G.run(s, FR, paint);
});
})();
