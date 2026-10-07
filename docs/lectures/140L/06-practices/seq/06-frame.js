/* ------------------------------------------------------------------ *
 * 06-frame.js — a perimeter you can inspect, against a map with people
 * on it.
 *
 * Was 115 words.  The slide's claim is that every control in the
 * lecture assumed a boundary, and that release deletes the boundary on
 * purpose — which is a claim about two shapes, so it is drawn as two
 * shapes side by side rather than transformed one into the other.
 * Side by side matters: the containment picture is not wrong and is not
 * superseded, it is simply the wrong instrument for the other case.
 *
 * THE PEOPLE ARE THE POINT.  The right-hand picture has residents drawn
 * in it, in blue, mixed among the organisms.  Without them it is just a
 * picture of a bigger flask, and the whole argument is that the second
 * case contains people who did not build the thing.
 *
 * NOTHING IS NAMED.  "Engineered mosquitoes released to suppress a wild
 * population" is in the note channel, by what it is rather than by a
 * company, and everything specific about it is VERIFY.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

const TOP = 300, H = 290, W = 560;
const LX = 150, RX = 890;

/* fixed scatter, so the picture is identical every render */
const ORGANISMS = [
  [930,340],[1010,322],[1100,356],[1195,330],[1285,360],[1375,336],
  [955,398],[1060,386],[1140,414],[1245,392],[1330,418],[1420,400],
  [920,460],[1005,448],[1095,472],[1185,452],[1280,478],[1365,456],
  [950,522],[1120,530],[1240,520],[1350,526]];
const RESIDENTS = [
  [1045,350],[1160,388],[1400,364],[1015,500],[1210,556],[1390,520],[915,556]];

function dots(cx, cy, n, per, gap, r, col, op){
  const g = G.el("g", {});
  for (let i = 0; i < n; i++){
    const row = Math.floor(i/per), c = i % per;
    const wide = Math.min(n - row*per, per);
    g.appendChild(G.el("circle", {
      cx: cx + (c - (wide - 1)/2)*gap, cy: cy + row*gap,
      r: r, fill: col, "fill-opacity": op == null ? 0.85 : op }));
  }
  return g;
}

function paint(v, f){
  const g = G.grp();

  /* ---- containment: a boundary, and things inside it -------------- */
  if (v.perimeter > 0.02){
    const h = G.grp(v.perimeter);
    h.appendChild(G.text(LX + W/2, TOP - 26, "Containment", 34, C.ink, 700));
    h.appendChild(G.el("rect", {x:LX, y:TOP, width:W, height:H, rx:12,
      fill:C.paper, stroke:C.ink, "stroke-width":3.4, "stroke-dasharray":"12 8"}));
    h.appendChild(dots(LX + W/2, TOP + 108, 18, 6, 56, 12, C.ink));
    h.appendChild(G.text(LX + W/2, TOP + H + 44,
      "a perimeter you can inspect", 25, C.muted, 400));
    g.appendChild(h);
  }

  /* ---- release: no boundary, and people inside the area ----------- */
  if (v.map > 0.02){
    const h = G.grp(v.map);
    h.appendChild(G.text(RX + W/2, TOP - 26, "Release", 34, C.verm, 700));

    /* no edge to draw — the area is suggested, not bounded */
    h.appendChild(G.el("rect", {x:RX, y:TOP, width:W, height:H, rx:120,
      fill:C.verm, "fill-opacity":0.05, stroke:"none"}));

    /* scattered on purpose — a lattice would read as another flask */
    ORGANISMS.forEach(p => h.appendChild(G.el("circle",
      {cx:p[0], cy:p[1], r:11, fill:C.verm, "fill-opacity":0.85})));
    RESIDENTS.forEach(p => h.appendChild(G.el("circle",
      {cx:p[0], cy:p[1], r:13, fill:C.blue})));
    h.appendChild(G.text(RX + W/2, TOP + H + 44,
      "a map, with people living on it", 25, C.muted, 400));
    g.appendChild(h);
  }

  /* ---- and so the review question changes ------------------------- */
  if (v.ask > 0.02){
    const h = G.grp(v.ask);
    h.appendChild(G.text(LX + W/2, TOP + H + 106,
      "“Can it get out?”", 30, C.muted, 700));
    h.appendChild(G.text(RX + W/2, TOP + H + 106,
      "“Who agreed to live with it?”", 30, C.verm, 700));
    g.appendChild(h);
  }

  return g;
}

const FR = [];
const beat = o => FR.push(o);

beat({ on:[], s:{perimeter:1},
  cap:"Every control today assumed you could draw this box",
  call:"",
  note:"Everything we have done today has had an unstated assumption under it, and I want to make it visible before we break it. Containment levels, validated waste streams, crippled hosts, auxotrophies, kill switches — every single one of those is a control that works by drawing a boundary around the work and then arguing about how leaky the boundary is. The entire vocabulary of biosafety is a vocabulary of perimeters. That is the box on the left, and the reason it is drawn as a dashed line is that the argument was always about how good the dashes are.",
  desc:"A dashed boundary with organisms inside it: containment, a perimeter you can inspect. Every control in the lecture assumed you could draw it."});

beat({ on:[], s:{perimeter:1, map:1}, dur:1500,
  cap:"A field trial deletes it on purpose",
  call:"",
  note:"Environmental release deletes the perimeter, and it deletes it deliberately. This is the part students consistently get backwards: in a field trial the organism is NOT ESCAPING. The organism is the product. Dispersal is not the failure mode, it is the mechanism of action — a released organism that stayed where you put it would be a failed experiment. THE CASE TO NAME, and name it by what it is rather than by a company: engineered mosquitoes released into the wild to suppress a local mosquito population. Whatever the construct, the shape is the same. Now look at the blue dots, because they are the slide. That area contains people who did not build the thing and were not in the room when it was designed. Without them this is just a picture of a bigger flask.",
  desc:"Beside it, the same organisms with no boundary at all, dispersed across an area — and people, in blue, living among them. Release is not escape: dispersal is the mechanism."});

beat({ on:[], s:{perimeter:1, map:1, ask:1},
  cap:"",
  call:"A perimeter you can walk around. A map you cannot.",
  note:"Now watch what happens to the review question. 'Can it get out' is meaningless on the right-hand side; of course it can, that is what you are paying for. The question becomes WHO AGREED TO LIVE WITH IT. And that question has a completely different shape: containment had a perimeter you could walk around and inspect, and consent has a map — there is a set of people who live inside the area that will be changed, and whether they said yes, and who was empowered to say yes on their behalf, is now the central fact about the experiment. WORTH SAYING OUT LOUD: nothing about this is anti-release. Suppressing a mosquito population that carries a disease is a serious good, and the people who live there are the ones who benefit most. The point is that the committee structure we spent half this lecture on was built for perimeters, and it is not, by itself, the right instrument for a decision about a map. VERIFY before stating anything precisely: which mosquito species and which engineering strategy, where releases have been conducted, by whom, under what regulatory approval, and with what measured effect on the target population. All of that is deliberately off the slide and the argument needs none of it.",
  desc:"The review question under each picture: can it get out, against who agreed to live with it. Containment had a perimeter you could inspect; consent has a map."});

window.Deck.sequence("frame", function(slide){
  const s = G.scene(slide, 792, 840);
  s.finish();
  return G.run(s, FR, paint);
});
})();
