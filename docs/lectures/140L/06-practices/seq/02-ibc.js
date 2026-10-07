/* ------------------------------------------------------------------ *
 * 02-ibc.js — the ladder that replaces Section III.
 *
 * The old NIH Guidelines sorted experiments by what you did to the
 * DNA: III-A through III-F, with III-D-1 to III-D-6 and the rest, a
 * list that every BUA form in this building still has checkboxes for.
 * The draft sorts them by how much review the risk earns, and there
 * are three:
 *
 *   IV-1  NIH *and* IBC approval before you start
 *   IV-2  full IBC approval before you start
 *   IV-3  approval that may be delegated to one member or a subgroup
 *
 * Drawn as the old list going grey beside the new ladder going up,
 * because the change students need to carry is not the contents of
 * either list.  It is that the sorting principle changed, and that
 * their own work falls off the bottom of the new one.
 *
 * IV-1 is worth lingering on for a reason that is easy to walk past:
 * its first bullet is "emerging, novel or zoonotic agents lacking an
 * RG classification", which is precisely the gap the metagenomic
 * cluster fell into two sections ago.  NIH noticed the same hole and
 * built a door for it.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;
const n2 = v => Math.round(v*10)/10;

const OLD = ["Section III-A", "Section III-B", "Section III-C",
             "Section III-D-1 … III-D-6", "Section III-E-1 … III-E-3",
             "Section III-F"];

const NEW = [
  { k:"iv1", t:"IV-1", h:"NIH and IBC approval",
    lines:["agents with no risk-group classification at all —",
           "emerging, novel, zoonotic",
           "first request to lower containment for RG3 or RG4",
           "first request to go below BSL-2 for a gene drive"],
    col:"#ba3a13" },
  { k:"iv2", t:"IV-2", h:"full IBC approval",
    lines:["RG3 and RG4 wild-type agents",
           "genetically modified organisms",
           "Select Agent toxins, prions",
           "deliberate administration to human subjects"],
    col:"#a99011" },
  { k:"iv3", t:"IV-3", h:"may be delegated to one member",
    lines:["RG2 agents",
           "genetically modified RG1 agents",
           "transgenic organisms at BSL-1",
           "well-characterised cell lines"],
    col:"#004373" }
];
const RY = [250, 430, 610];

function tier(i, o, hot){
  const n = NEW[i], g = G.grp(o), y = RY[i];
  g.appendChild(G.el("rect", {x:620, y:y, width:830, height:152, rx:18,
    fill:hot ? n.col : C.paper, "fill-opacity":hot ? 0.09 : 1,
    stroke:n.col, "stroke-width":hot ? 3.6 : 2.6}));
  g.appendChild(G.text(676, y + 54, n.t, 38, n.col, 700, "start"));
  g.appendChild(G.text(772, y + 40, n.h, 24, n.col, 700, "start"));
  g.appendChild(G.lines(772, y + 72, n.lines, 19, C.muted, 400, "start", 24));
  return g;
}

function paint(v, f){
  const g = G.el("g", {});
  const add = n => { g.appendChild(n); return n; };

  if (v.old > 0.02){
    const h = G.grp(v.old*(v.sorted > 0.02 ? 0.34 : 1));
    /* the two headings occupy the same line on purpose — one replaces
       the other — so the old one has to go rather than merely fade */
    if (!(v.sorted > 0.02))
      h.appendChild(G.text(170, 214, "sorted by what you did to the DNA",
        21, C.ink, 700, "start"));
    OLD.forEach(function(s, i){
      const y = 268 + i*44;
      h.appendChild(G.el("rect", {x:170, y:y - 20, width:26, height:26, rx:4,
        fill:"none", stroke:C.ink, "stroke-width":2.2}));
      h.appendChild(G.text(212, y, s, 22, C.ink, 400, "start"));
    });
    g.appendChild(h);
  }
  if (v.sorted > 0.02){
    const h = G.grp(v.sorted);
    h.appendChild(G.text(170, 214, "sorted by how much review the risk earns",
      21, C.blue, 700, "start"));
    /* a single rule struck through the retired list says "replaced"
       more economically than any amount of fading does */
    h.appendChild(G.path("M164 " + 268 + "L560 " + 492, C.verm, 3));
    g.appendChild(h);
  }

  NEW.forEach(function(n, i){
    if (v[n.k] > 0.02) g.appendChild(tier(i, v[n.k], v.mine > 0.02 && i === 2));
  });

  if (v.gap > 0.02){
    const h = G.grp(v.gap);
    /* both lines of the thought, or the ring cuts a sentence in half */
    h.appendChild(G.el("rect", {x:764, y:RY[0] + 54, width:620, height:58, rx:8,
      fill:"none", stroke:C.verm, "stroke-width":2.8}));
    h.appendChild(G.text(1450, RY[0] - 18,
      "the hole the metagenomic cluster fell into", 20, C.verm, 700, "end"));
    g.appendChild(h);
  }
  if (v.mine > 0.02){
    const h = G.grp(v.mine);
    h.appendChild(G.text(1450, RY[2] + 182,
      "everything in this course is here: one reviewer, not a committee",
      23, C.blue, 700, "end"));
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

beat({ on:[], s:{old:1},
  cap:"", call:"",
  note:"Here is what the old sorting looked like in practice. Section Three of the NIH Guidelines, subdivided: III-A, III-B, III-C, III-D with six sub-categories, III-E with three, III-F for the exempt. You have just seen those exact checkboxes on a real Berkeley form. And the thing to notice is what the list is sorted by. It is sorted by what you did to the DNA — whether you moved a drug-resistance trait, whether you used a viral vector, whether more than two thirds of a eukaryotic viral genome was involved. Technique, all the way down.",
  desc:"The old Section III categories listed as checkboxes: III-A through III-F, sorted by what was done to the DNA."});

beat({ on:[], s:{sorted:1, iv1:1, iv2:1, iv3:1}, dur:1600,
  cap:"", call:"",
  note:"The draft replaces that whole list with three tiers, and they are sorted by a different thing: how much review the risk earns. IV-1 needs NIH approval and IBC approval before you start. IV-2 needs the full committee. IV-3 needs approval too, but it may be delegated to a single IBC member or a small subgroup rather than going to a meeting. Three boxes instead of fifteen, and the question that puts you in one of them is about hazard rather than about method.",
  desc:"The old list is struck through and replaced by three tiers: IV-1 requiring both NIH and IBC approval, IV-2 requiring full IBC approval, and IV-3 where approval may be delegated to one member or a subgroup."});

beat({ on:[], s:{gap:1},
  cap:"", call:"",
  note:"And look at the first line of the top tier, because we walked straight into it earlier. Agents with no risk-group classification at all — emerging, novel, zoonotic. That is the metagenomic cluster. The thing that broke the old logic, because the old logic began by asking which organism it came from, now has a category of its own, and the category says: this one goes to NIH as well as to your committee. They noticed the same hole you did. That is worth knowing, because it means the framework is not handed down finished; it gets patched when somebody points at a gap.",
  desc:"The first line of IV-1 is picked out: agents lacking a risk-group classification, which is precisely the gap the metagenomic cluster fell into."});

beat({ on:[], s:{mine:1},
  cap:"", call:"",
  note:"And then the bottom tier, which is where you live. RG2 agents, genetically modified RG1 agents, transgenics at BSL-1, well-characterised cell lines. Modified E. coli is a genetically modified RG1 agent. Everything in this course, everything in most of the labs in this building, sits in the tier where one reviewer can approve it without convening a committee. Hold that thought, because it is the thing we are about to argue about.",
  desc:"The bottom tier is highlighted: everything in this course is in IV-3, approvable by one reviewer rather than a committee."});

window.Deck.sequence("ibctiers", function(slide){
  const s = G.scene(slide, 832, 868);
  s.finish();
  return G.run(s, FR, paint);
});
})();
