/* ------------------------------------------------------------------ *
 * 04-bluewhite.js — run the loop on a circuit, and find the trap.
 *
 * The section's exercise, placed AFTER the complementation mechanism
 * rather than before it.  The other two exercises are predictions from
 * first principles; this one cannot be, because alpha-omega
 * complementation is not derivable from anything they have been told.
 * So the mechanism slide supplies the parts and this slide makes them
 * run the loop over it.
 *
 * Worth it for the third plate.  Everyone gets the first two: no
 * insert goes blue, insert goes white, that is the screen.  The third
 * is the same plate with the IPTG left out, and it goes white as well
 * -- so a forgotten inducer looks exactly like a tray of perfect
 * clones.  Same shape as the IPTG-early failure in section 1: the
 * result is not an error, it is a plausible wrong answer.
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

const PLATES = [
  {x:406, top:"no insert", sub:"+ IPTG", blue:1,
   why:"α made · joins ω · enzyme cuts X-gal"},
  {x:800, top:"insert in the MCS", sub:"+ IPTG", blue:0,
   why:"α disrupted · no enzyme · this is the screen"},
  {x:1194, top:"no insert", sub:"no IPTG", blue:0,
   why:"lacI never let go · no α · and it looks identical"}
];

function plate(x, y, r, state){
  const g = G.el("g", {});
  const rim = state === null ? C.muted : (state ? C.blue : C.verm);
  g.appendChild(G.el("circle", {cx:n1(x), cy:n1(y), r:r, fill:C.muted,
    "fill-opacity":".06", stroke:rim, "stroke-width":3}));
  if (state === null){ g.appendChild(G.text(x, y + 18, "?", 52, C.muted, 700)); return g; }
  [[-32,-24],[-2,-40],[28,-22],[-42,8],[-8,0],[24,14],[-26,34],[10,36],[40,4],[4,-14]]
    .forEach(function(d){
      g.appendChild(G.el("circle", {cx:n1(x + d[0]), cy:n1(y + d[1]), r:9,
        fill:state ? C.blue : C.paper, "fill-opacity":state ? ".62" : "1",
        stroke:state ? C.blue : C.muted, "stroke-width":1.8}));
    });
  return g;
}
function piece(x, y, w, label, col, dash){
  const g = G.el("g", {});
  g.appendChild(G.el("rect", {x:n1(x), y:n1(y - 17), width:n1(w), height:34,
    rx:5, fill:col, "fill-opacity":".18", stroke:col, "stroke-width":2.6,
    "stroke-dasharray":dash || "none"}));
  g.appendChild(G.text(x + w/2, y + 7, label, 19, col, 700));
  return g;
}

const FR = [
{ s:{parts:1, pose:1},
  cap:"<b>Your turn.</b> Three plates, all with X-gal",
  call:"which colonies come up <b>blue</b>?",
  note:"They have the parts now: the chromosome carries lacI and a lacZ missing its alpha region, the plasmid carries the alpha fragment with the cloning site inside it. So run the loop on it. Three plates, all containing X-gal, differing in whether the plasmid has an insert and whether IPTG went in. Give them a few minutes. Almost everyone gets the first two and almost nobody gets the third.",
  desc:"The chromosome and plasmid pieces shown, and three X-gal plates with question marks: no insert with IPTG, insert with IPTG, and no insert without IPTG." },

{ s:{parts:1, one:1},
  cap:"<b>no insert, IPTG in</b> &#183; blue",
  call:"α and ω find each other &#183; the enzyme works &#183; X-gal is cut",
  note:"First plate. IPTG takes lacI off the promoter, so the alpha fragment is transcribed and made. Alpha finds omega, the two halves together are a working beta-galactosidase, and it cuts X-gal into something blue. Blue means the plasmid is intact.",
  desc:"The first plate is blue: IPTG relieves lacI, alpha is made, it complements omega and the enzyme cleaves X-gal." },

{ s:{parts:1, one:1, two:1},
  cap:"<b>insert in the site, IPTG in</b> &#183; white",
  call:"the insert lands in the middle of α &#183; and that is the whole screen",
  note:"Second plate. The cloning site sits inside the alpha coding sequence, so anything ligated into it breaks alpha. No alpha means no complementation, no enzyme, no cleavage, white colony. That is blue-white screening: white means your insert went in.",
  desc:"The second plate is white: the insert disrupts the alpha fragment so there is no complementation and no enzyme." },

{ s:{parts:1, one:1, two:1, three:1},
  cap:"<b>no insert, IPTG forgotten</b> &#183; also white",
  call:"and it looks exactly like a plate full of clones",
  note:"And the third. No IPTG means lacI is still sitting on the promoter, so no alpha is made, so there is no enzyme and the colony is white. Same colour, completely different reason. If you forget the IPTG your empty vector gives you a tray of white colonies that look like a perfect ligation, and you find out when you miniprep ten of them and they are all empty. Same shape as the IPTG failure in the first section: not an error message, a plausible wrong answer.",
  desc:"The third plate is also white, because without IPTG no alpha is made at all — an empty vector that looks exactly like a successful ligation." },

{ s:{parts:1, one:1, two:1, three:1, rule:1},
  cap:"white is <b>not</b> evidence on its own",
  call:"a plate with no blue anywhere is telling you about your <b>IPTG</b>, not your ligation",
  note:"Land the rule, because it is a habit rather than a fact. A white colony is only informative if blue was possible on that plate. So the control that matters is the one nobody sets up: vector with no insert, same plate, same inducer. If that one is blue you can believe your whites. If nothing on the bench is blue, the experiment has not told you anything about your ligation at all. And notice this is the loop again: the observation was the same both times, and only working out what was actually being transcribed separated them.",
  desc:"The rule: a white colony is only informative if blue was possible, so an uncut-vector control on the same plate is what makes the screen mean anything." }
];

window.Deck.sequence("bluewhite", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    if (v.parts > 0.02){
      const q = grp(v.parts);
      q.appendChild(G.text(250, 262, "chromosome", 21, C.muted, 700, "start"));
      q.appendChild(piece(250, 302, 108, "lacI", C.amber));
      q.appendChild(piece(372, 302, 210, "lacZ ΔM15  →  ω", C.ink));
      q.appendChild(G.text(950, 262, "plasmid", 21, C.muted, 700, "start"));
      q.appendChild(piece(950, 302, 118, "Pₗₐᴄ", C.amber));
      q.appendChild(piece(1082, 302, 200, "lacZα", C.blue));
      q.appendChild(path("M1182 285V266", C.verm, 2.4));
      q.appendChild(G.text(1182, 256, "cloning site is in here", 18, C.verm, 700));
      g.appendChild(q);
    }

    const ready = [v.one, v.two, v.three];
    PLATES.forEach(function(p, i){
      const on = (ready[i] || 0) > 0.5;
      const q = grp(1);
      q.appendChild(plate(p.x, 482, 96, on ? p.blue : null));
      q.appendChild(G.text(p.x, 614, p.top, 22, C.ink, 700));
      q.appendChild(G.text(p.x, 642, p.sub, 21,
        p.sub === "no IPTG" ? C.verm : C.muted, p.sub === "no IPTG" ? 700 : 400));
      if (on){
        q.appendChild(G.text(p.x, 360, p.blue ? "blue" : "white", 24,
          p.blue ? C.blue : C.verm, 700));
        q.appendChild(G.text(p.x, 678, p.why, 18, C.muted, 400));
      }
      g.appendChild(q);
    });

    if (v.rule > 0.02){
      const q = grp(v.rule);
      q.appendChild(G.el("rect", {x:300, y:706, width:1000, height:56, rx:10,
        fill:C.verm, "fill-opacity":".10", stroke:C.verm, "stroke-width":2.6}));
      q.appendChild(G.text(800, 742,
        "no blue anywhere on the bench → the screen told you nothing", 23,
        C.verm, 700));
      g.appendChild(q);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
