/* ------------------------------------------------------------------ *
 * 05-safe.js — is this one safe?  Asked before anything is taught.
 *
 * This section was a catalogue: core versus accessory, then pili, then
 * five categories of virulence factor, then two questions right at the
 * end.  It was reported as the dullest stretch of the lecture, and a
 * catalogue is dull at any length, so shortening it would not have
 * helped.  What helps is arriving at the catalogue needing it.
 *
 * So the section now opens on a judgement call with a real answer, the
 * room fails at it, and everything that follows is the equipment they
 * turned out to need.  It is also the handoff into the practices
 * lecture, which is the reason this material is in the course.
 *
 * The scenario leans on two things already taught: Shigella falls
 * INSIDE the E. coli tree (02-neighbours), and virulence is never on
 * the core chassis (01-housekeeping, redrawn in 05-accessory).
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

const BX0 = 300, BW = 1010, BBY = 380, BBH = 62, CORE = 0.65;
const CHECK = [["adhesion", "can it stick to us?"],
               ["iron", "can it feed in us?"],
               ["capsule", "can it hide from us?"],
               ["vacuole", "can it survive being eaten?"],
               ["toxins", "does it damage us?"]];

const FR = [
{ s:{q:1},
  cap:"<b>Your turn.</b> A collaborator sends you a strain",
  call:"<em>E. coli</em> K-12, carrying one plasmid &#183; the plasmid expresses a gene from <em>Shigella</em>",
  note:"Open the section on the decision rather than the material. A collaborator sends you E. coli K-12 with a single plasmid in it, and the plasmid expresses one gene cloned out of Shigella. Would you work with it on the open bench? Give them a few minutes. You will get two confident and opposite answers, and both of them are reasoning from the wrong thing.",
  desc:"A scenario posed to the room: E. coli K-12 carrying a plasmid that expresses a gene from Shigella. Would you work with it on the open bench?" },

{ s:{q:1, wrong:1},
  cap:"two answers you will hear, and both are wrong",
  call:"the species name is not the question &#183; and neither is the donor's",
  note:"Take the two answers. The first is that it is fine, because it is K-12 and K-12 is a BSL-1 workhorse. The second is that it is obviously not fine, because Shigella causes dysentery. Both are reasoning from a name. And the Shigella one is worse than it looks, because you have already seen that Shigella sits inside the E. coli tree: it is kept as a separate genus for clinical and historical reasons, not evolutionary ones. So calling it a gene from Shigella tells you almost nothing about the gene.",
  desc:"Both common answers are rejected: one reasons from K-12's reputation, the other from Shigella's, and Shigella falls inside the E. coli tree anyway." },

{ s:{bar:1},
  cap:"the question is <b>where the gene comes from in the genome</b>",
  call:"nothing on the core has ever made anything a pathogen",
  note:"Here is the question that does work, and it is the one this section is for. Not which organism the gene came out of, but where in that organism's genome it sat. If it is a housekeeping gene from the three megabases every enterobacterium shares, then it is a gene E. coli already has its own copy of, and expressing another one changes nothing about what the strain can do to you. If it came off the accessory genome, you have to look at what it does. That is the whole test, and it works regardless of what the donor was called.",
  desc:"The layered genome again: a gene from the shared core cannot make a pathogen, while a gene from the accessory genome has to be examined for what it does." },

{ s:{bar:1, list:1},
  cap:"and if it is accessory, there are <b>five</b> things to ask",
  call:"each one is a job the organism does <b>to a host</b>",
  note:"And if it is accessory, this is the checklist, and it is short because these are the only jobs a virulence factor does. Can it stick to us. Can it get iron out of us, because we hide iron deliberately. Can it hide from the immune system. Can it survive being eaten by a phagocyte. Does it do damage. Every category of virulence factor is an answer to something a host does, which is why the list is five items and not fifty, and it is the list we are about to go through properly.",
  desc:"Five questions to ask of an accessory gene: adhesion, iron acquisition, capsule, vacuole survival and toxins, each one an answer to something a host does." },

{ s:{bar:1, list:1, hand:1},
  cap:"and that is a <b>practices</b> question, not a trivia question",
  call:"you will answer it formally next lecture &#183; today is the biology under it",
  note:"Land the handoff. The formal version of this, the containment levels and the risk assessment and the paperwork, is the next lecture. What today gives you is the thing that makes the paperwork mean something: knowing that pathogenicity is not a property of a species, that it sits on an accessory genome you can point at, and that there are five kinds of thing to look for. Go and get that, and then the rest of this section is what each of the five actually does.",
  desc:"The handoff to the practices lecture: containment levels and risk assessment come next time, and today supplies the biology underneath them." }
];

window.Deck.sequence("safe", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    if (v.q > 0.02){
      const q = grp(v.q);
      q.appendChild(G.el("rect", {x:300, y:266, width:1000, height:150, rx:12,
        fill:C.muted, "fill-opacity":".07", stroke:C.muted, "stroke-width":2.4}));
      q.appendChild(G.el("text", {x:340, y:322, "font-size":27, fill:C.ink,
        "font-weight":700}, "E. coli K-12, one plasmid"));
      q.appendChild(G.text(340, 362,
        "the plasmid expresses a single gene cloned from Shigella", 24,
        C.muted, 400, "start"));
      q.appendChild(G.text(340, 396,
        "would you work with it on the open bench?", 24, C.verm, 700, "start"));
      g.appendChild(q);
    }

    if (v.wrong > 0.02){
      const q = grp(v.wrong);
      [["“fine — it is K-12”", 540, "reasoning from a reputation"],
       ["“no — it is Shigella”", 960, "and Shigella is inside the E. coli tree"]
      ].forEach(function(w){
        q.appendChild(G.text(w[1], 520, w[0], 27, C.muted, 700));
        q.appendChild(path("M"+n1(w[1] - 52)+" "+n1(544)+"l104 44m0 -44l-104 44",
          C.verm, 5));
        q.appendChild(G.text(w[1], 632, w[2], 20, C.muted, 400));
      });
      g.appendChild(q);
    }

    if (v.bar > 0.02){
      const f = grp(v.bar), cw = BW*CORE;
      f.appendChild(G.el("rect", {x:BX0, y:BBY, width:n1(cw), height:BBH, rx:5,
        fill:C.blue, "fill-opacity":".2", stroke:C.blue, "stroke-width":3}));
      f.appendChild(G.el("rect", {x:n1(BX0 + cw), y:BBY, width:n1(BW - cw),
        height:BBH, rx:5, fill:C.verm, "fill-opacity":".18", stroke:C.verm,
        "stroke-width":3}));
      f.appendChild(G.text(BX0 + cw/2, BBY + BBH + 32, "the shared core", 22,
        C.blue, 700));
      f.appendChild(G.text(BX0 + cw/2, BBY + BBH + 58,
        "a gene from here changes nothing", 19, C.muted, 400));
      f.appendChild(G.text(BX0 + cw + (BW - cw)/2, BBY - 20, "accessory", 22,
        C.verm, 700));
      f.appendChild(G.text(BX0 + cw + (BW - cw)/2, BBY + BBH + 32,
        "a gene from here, you check", 20, C.verm, 700));
      g.appendChild(f);
    }

    if (v.list > 0.02){
      const q = grp(v.list);
      CHECK.forEach(function(c, i){
        const y = 566 + i*38;
        q.appendChild(G.text(760, y, c[0], 22, C.verm, 700, "end"));
        q.appendChild(G.text(782, y, c[1], 22, C.muted, 400, "start"));
      });
      g.appendChild(q);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
