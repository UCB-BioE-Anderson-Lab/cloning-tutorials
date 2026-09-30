/* ------------------------------------------------------------------ *
 * 02-lacz.js — source slides 18 to 20, which are three static images of
 * beta-galactosidase with no reaction on any of them.
 *
 * The thing worth knowing about LacZ as a REPORTER is not its structure.
 * It is that the blue product is insoluble, so it stays inside the
 * colony that made it instead of diffusing across the plate.  That is
 * the entire reason blue/white screening is a per-colony readout and not
 * a plate that slowly goes uniformly blue, and the source never says it.
 *
 * Drawn schematically rather than with real structures: X-gal is a sugar
 * with a dye precursor glued to it, and what matters is which bond
 * breaks and what happens to the half that is left.  Real ring
 * chemistry at this size is unreadable from the back of a room and
 * would be the slide's subject rather than its vehicle.
 *
 * Callback: the Chassis deck's section 4 exercise is three plates of
 * X-gal and which ones go blue.  This is the mechanism under it.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

const RY = 300;                      /* the reaction line               */
const PX = 800, PY = 582, PR = 112;  /* the plate                       */

/* A galactose, drawn as a hexagon because that is what a pyranose is. */
function sugar(cx, cy, r, col, u){
  const g = K.grp(u);
  let d = "";
  for (let i = 0; i < 6; i++){
    const p = K.pt(cx, cy, r, -90 + i*60);
    d += (i ? "L" : "M") + p[0] + " " + p[1];
  }
  g.appendChild(K.el("path", {d:d + "Z", fill:col, "fill-opacity":".13",
    stroke:col, "stroke-width":2.6}));
  g.appendChild(K.text(cx, cy + 8, "gal", 21, col, 700));
  return g;
}
/* The indolyl half: a box, whose colour IS the state. */
function indolyl(cx, cy, col, label, u, w){
  const g = K.grp(u), ww = w || 118, h = 54;
  g.appendChild(K.el("rect", {x:n1(cx - ww/2), y:n1(cy - h/2), width:ww, height:h,
    rx:8, fill:col, "fill-opacity":col === C.muted ? ".10" : ".30",
    stroke:col, "stroke-width":2.6}));
  g.appendChild(K.text(cx, cy + 8, label, 21, col === C.muted ? C.muted : C.ink, 700));
  return g;
}

const FR = [
{ s:{xgal:1},
  cap:"X-gal is a sugar with a dye precursor glued to it",
  call:"and in that state it is colourless",
  note:"X-gal is the substrate, and the name is doing some work: it is a galactose with a modified indole stuck on the end through a glycosidic bond. Whole, it is colourless. You pour it on a plate, it goes everywhere, and nothing happens, because nothing on an ordinary plate breaks that particular bond.",
  desc:"X-gal drawn as a galactose hexagon joined to a colourless indolyl group." },

{ s:{xgal:1, cut:1},
  cap:"&beta;-galactosidase cuts the glycosidic bond",
  call:"the same bond it cuts in lactose &#183; X-gal is just a lactose with a dye on it",
  note:"Beta-galactosidase cuts glycosidic bonds off galactose. That is its day job — in lactose it cuts galactose from glucose. X-gal is the same substrate with a dye precursor in place of the glucose, which is the whole trick of the reagent. The enzyme cannot tell the difference and cuts it anyway.",
  desc:"LacZ cleaves the bond, separating the galactose from the indolyl group." },

{ s:{xgal:1, cut:1, split:1},
  cap:"and the released half is <b>still</b> colourless",
  call:"the enzyme does not make the colour",
  note:"And here is the part people skip. What comes off is still colourless. The enzyme does not produce a blue product. It produces a reactive one, and that is a different claim.",
  desc:"The cleavage products: galactose, and a still-colourless indolyl intermediate." },

{ s:{xgal:1, cut:1, split:1, dimer:1},
  cap:"two of them oxidise and join &#8212; <b>that</b> is the blue",
  call:"spontaneous &#183; nothing is catalysing it",
  note:"Two of the released molecules oxidise in air and couple to each other, and the dimer is the blue dye. Nothing catalyses that step. It happens on its own wherever the concentration gets high enough, which is a detail that matters in about thirty seconds.",
  desc:"Two indolyl intermediates oxidise and couple into a blue dimer." },

{ s:{xgal:1, cut:1, split:1, dimer:1, plate:1},
  cap:"and the dimer is <b>insoluble</b>",
  call:"so it stays in the colony that made it",
  note:"The dimer is insoluble. It precipitates the moment it forms, which means it stays where it was made. That is the entire reason blue-white screening works. If the product were soluble it would diffuse, the plate would go uniformly pale blue over a few hours, and you could not tell which colony had the enzyme. Because it is not, each colony develops its own colour independently and you can screen hundreds of them by eye. You did this exercise in the Chassis lecture, with three plates and which ones go blue. This is what is happening underneath it. And it generalises: for a reporter to be a per-cell readout, the signal has to stay in the cell — which is also why fluorescent proteins work and why a secreted enzyme makes a poor colony reporter.",
  desc:"A plate of colonies, some blue and some white, showing that the insoluble product stays in the colony that produced it." }
];

window.Deck.sequence("lacz", function(slide){
  const s = K.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = K.el("g", {});

    /* LEFT: the intact substrate, sliding apart as it is cut. */
    const sep = 96*v.split;
    const sx = 320 - sep, ix = 452 + sep;
    g.appendChild(sugar(sx, RY, 38, C.amber, v.xgal));
    /* the bond, and the enzyme sitting on it */
    if (v.xgal > 0.02 && v.split < 0.98){
      const b = K.grp(v.xgal*(1 - v.split));
      b.appendChild(K.path("M"+n1(sx + 38)+" "+RY+"H"+n1(ix - 59), C.ink, 3));
      g.appendChild(b);
    }
    g.appendChild(indolyl(ix, RY, C.muted, "colourless", v.xgal));

    if (v.cut > 0.02){
      const e = K.grp(v.cut);
      /* the enzyme as a clamp over the bond it breaks */
      e.appendChild(K.el("path", {d:"M368 244a52 52 0 0 1 0 104",
        fill:"none", stroke:C.blue, "stroke-width":14, "stroke-linecap":"round"}));
      /* Above the clamp, not on it.  At RY-74 and RY-48 the second line
         ran straight through the arc, which starts at RY-56. */
      e.appendChild(K.mixed(394, RY - 108, [["LacZ", false]], 26, C.blue, 700));
      e.appendChild(K.text(394, RY - 82, "β-galactosidase", 20, C.muted, 400));
      g.appendChild(e);
    }

    /* RIGHT: two of the released halves couple into the blue dimer. */
    if (v.dimer > 0.02){
      const d = K.grp(v.dimer);
      d.appendChild(K.arrow([640, RY], [770, RY], C.muted, 2.6, 0, 0));
      d.appendChild(K.text(705, RY - 22, "O₂", 21, C.muted, 400));
      d.appendChild(indolyl(880, RY - 32, C.blue, "", 1, 108));
      d.appendChild(indolyl(880, RY + 32, C.blue, "", 1, 108));
      d.appendChild(K.path("M880 "+(RY - 5)+"v10", C.blue, 3));
      d.appendChild(K.text(880, RY - 84, "the indigo dimer", 26, C.blue, 700));
      d.appendChild(K.text(1020, RY + 8, "insoluble — it precipitates", 23, C.verm, 700, "start"));
      g.appendChild(d);
    }

    /* BELOW: the plate this buys you. */
    if (v.plate > 0.02){
      const p = K.grp(v.plate);
      p.appendChild(K.el("circle", {cx:PX, cy:PY, r:PR, fill:C.paper,
        stroke:C.muted, "stroke-width":2.6}));
      [[-62,-34,1],[-18,-58,0],[30,-46,1],[64,-8,0],[38,36,1],[-8,18,1],
       [-52,42,0],[6,66,1],[-74,4,0],[70,52,1]].forEach(function(q){
        p.appendChild(K.el("circle", {cx:PX + q[0], cy:PY + q[1], r:13,
          fill:q[2] ? C.blue : C.paper, "fill-opacity":q[2] ? .78 : 1,
          stroke:q[2] ? C.blue : C.muted, "stroke-width":2}));
      });
      p.appendChild(K.text(PX + PR + 30, PY - 10,
        "each colony develops its own colour", 24, C.ink, 700, "start"));
      p.appendChild(K.text(PX + PR + 30, PY + 22,
        "a soluble dye would have diffused and told you nothing",
        21, C.muted, 400, "start"));
      g.appendChild(p);
    }
    return g;
  }
  return K.run(s, FR, paint);
});
})();
