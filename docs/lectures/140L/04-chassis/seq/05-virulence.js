/* ------------------------------------------------------------------ *
 * 05-virulence.js — the categories, against the thing they are for.
 *
 * The source spends four slides and four borrowed figures on this: a
 * list of the categories, then capsules, then iron, then vacuoles.  Each
 * figure is from a different source and none of them shares a frame with
 * the host, which is the one thing they all have in common — every
 * category on the list is an answer to something a host does.
 *
 * So: one host, one bacterium, and a beat per category, each naming the
 * defence it is defeating.  The list of five is still what leaves the
 * room; it just arrives attached to what each one is for.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;
const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);

function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 3,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return G.el("path", a);
}
function grp(o){ return G.el("g", {opacity:n1(cl(o, 0, 1))}); }

/* the running list down the left: the source's own five, lit one at a
   time as each is explained */
const CATS = [
  ["adhesion",  "stay put"],
  ["iron",      "get fed"],
  ["capsule",   "stay hidden"],
  ["vacuole",   "survive being eaten"],
  ["toxins",    "do damage"]
];
function list(active){
  const g = G.el("g", {}), x = 150, y0 = 250, gap = 74;
  CATS.forEach(function(c, i){
    const on = i === active, col = on ? C.verm : C.muted;
    if (on) g.appendChild(G.el("rect", {x:x-18, y:n1(y0 + i*gap - 32),
      width:300, height:gap - 12, rx:7, fill:C.verm, "fill-opacity":".08",
      stroke:"none"}));
    g.appendChild(G.text(x, y0 + i*gap, c[0], 28, col, on ? 700 : 400, "start"));
    g.appendChild(G.text(x, y0 + i*gap + 27, c[1], 21, col, 400, "start"));
  });
  return g;
}

/* ---- the stage: a host surface, and a bacterium above it ---------- */
const HX = 560, HX1 = 1430, HY = 656;     /* host surface                 */
const BX = 980, BY = 430, BW = 190, BH = 108;   /* the bacterium          */

function hostSurface(){
  const g = G.el("g", {});
  g.appendChild(G.el("rect", {x:HX, y:HY, width:HX1 - HX, height:68,
    fill:C.muted, "fill-opacity":".12", stroke:C.muted, "stroke-width":2.6}));
  g.appendChild(G.text(HX + 16, HY + 44, "host tissue", 21, C.muted, 400, "start"));
  return g;
}
function bug(cx, cy, col){
  return G.el("rect", {x:n1(cx - BW/2), y:n1(cy - BH/2), width:BW, height:BH,
    rx:BH/2, fill:col || C.amber, "fill-opacity":".22",
    stroke:col || C.amber, "stroke-width":3});
}
/* an antibody, drawn as the Y everyone knows */
function antibody(cx, cy, col){
  const g = G.el("g", {});
  g.appendChild(path("M"+n1(cx)+" "+n1(cy+20)+"V"+n1(cy)+
    "M"+n1(cx)+" "+n1(cy)+"L"+n1(cx-16)+" "+n1(cy-20)+
    "M"+n1(cx)+" "+n1(cy)+"L"+n1(cx+16)+" "+n1(cy-20), col || C.blue, 3.4));
  return g;
}

const FR = [
{ s:{stage:1}, lit:-1,
  cap:"every one of these is an answer to something <b>you</b> do",
  call:"the core chassis has none of them &#183; they are all extra genes",
  note:"Here is the useful way to hold the list. Every category of virulence factor is a solution to a problem the host creates. None of them is on the core chassis; they are all additional genes carried by particular strains, and a strain that lacks them is not a weakened pathogen, it is simply not a pathogen. Go through them in order and name the defence each one is defeating, because that is what makes the list memorable rather than a list.",
  desc:"A bacterium above a surface of host tissue, with the five categories of virulence factor listed down the left-hand side." },

{ s:{stage:1, adh:1}, lit:0,
  cap:"<b>adhesion</b> &#183; because you are trying to wash it away",
  call:"pili, and the fimH tip on the end of them",
  note:"First problem: a gut is a river. Anything that does not hold on is gone within a day. So the first thing a colonising organism needs is a grip, and that is what you just saw: a pilus with an adhesin on the tip that binds a sugar on the epithelial surface. Note again that this is as necessary for a harmless commensal as for a pathogen. Adhesion is not harm. It is permission to stay long enough to do anything else on this list.",
  desc:"Pili extending from the bacterium and gripping the host surface, with adhesion lit on the list." },

{ s:{stage:1, adh:1, fe:1}, lit:1,
  cap:"<b>iron</b> &#183; because you keep it locked up",
  call:"siderophores go out empty and come back loaded",
  note:"Second problem: iron. Every cell needs it, and the host keeps free iron effectively at zero by binding it all up in transferrin and lactoferrin. That is an immune strategy in its own right and it is called nutritional immunity. The answer is a siderophore: a small molecule with an affinity for iron high enough to strip it off the host's own carriers, secreted out and then retrieved through a dedicated receptor. And you have already met one of those receptors. FhuA, on the Mach1 genotype, is a ferrichrome transporter, and fhuA was knocked out of your strain, which is worth noticing: a surface receptor is a door, and doors are how phages get in.",
  desc:"Siderophores secreted from the bacterium, binding iron in the host tissue, and being retrieved through a receptor, with iron lit on the list." },

{ s:{stage:1, adh:1, cap:1}, lit:2,
  cap:"<b>capsule</b> &#183; because you would otherwise see it",
  call:"a sugar shield &#183; antibodies cannot land, complement cannot assemble",
  note:"Third problem: being recognised. The immune system works by getting hold of the surface, and a capsule is a thick layer of polysaccharide that puts the surface out of reach. Antibodies cannot get to their targets to mark the cell for destruction, complement cannot assemble on it, and a phagocyte has nothing to grip. It is not a weapon and it does no damage; it is simply in the way. The electron micrographs in the literature make this vivid: a lab strain and an encapsulated strain side by side, and the encapsulated one has a visible halo around it, and that halo is most of the difference between an organism you clear and one you do not.",
  desc:"A thick polysaccharide capsule around the bacterium, with antibodies unable to reach the surface, and capsule lit on the list." },

{ s:{stage:1, vac:1}, lit:3,
  cap:"<b>vacuole</b> &#183; because you eat it",
  call:"a phagosome is supposed to be a death sentence &#183; some of them live in it",
  note:"Fourth problem, and this one is an inversion. A phagocyte engulfs a bacterium into a vacuole and then acidifies it and fuses it with a lysosome, and that is normally the end. Some organisms have worked out how to interfere. They either arrest the vacuole so it never matures, and live inside it quite comfortably, or they break out of it into the cytoplasm entirely. Listeria, Shigella and Salmonella each do a version of this. What makes it worth its own category is that the immune mechanism has been turned into a delivery service: the cell that was supposed to kill it has carried it inside the tissue.",
  desc:"The bacterium taken into a phagocyte's vacuole and surviving there rather than being destroyed, with vacuole lit on the list." },

{ s:{stage:1, adh:1, tox:1}, lit:4,
  cap:"<b>toxins</b> &#183; and these are the ones that actually do harm",
  call:"Shiga, botulinum, diphtheria, hemolysins &#183; dedicated molecules, dedicated damage",
  note:"And the last category is the only one on the list whose purpose is damage. A toxin is a dedicated molecule that harms host cells: lysing them, as the hemolysins do, or getting inside and shutting down translation, as Shiga and diphtheria toxin do. Everything else on this list is logistics. This is the weapon. Keep it separate in your head from the thing on the next slide, because the next slide is about a molecule that provokes an enormous immune response and is not a toxin and is not a virulence factor, and the difference between those two decides the answer to the last two questions in this lecture.",
  desc:"Toxin molecules released from the bacterium and damaging host cells, with toxins lit on the list." }
];

window.Deck.sequence("virulence", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v, f){
    const g = G.el("g", {});
    const half = x => cl(x*2 - 1, 0, 1);
    g.appendChild(list(f.lit));            /* snaps on the click */

    if (v.stage > 0.02){
      const k = grp(half(v.stage));
      k.appendChild(hostSurface());
      if (v.vac < 0.5) k.appendChild(bug(BX, BY));
      g.appendChild(k);
    }

    /* ---- adhesion ---------------------------------------------- */
    if (v.adh > 0.02 && v.vac < 0.5){
      const k = grp(half(v.adh));
      [-58, -20, 18, 56].forEach(function(dx){
        k.appendChild(path("M"+n1(BX+dx)+" "+n1(BY + BH/2)+
          "C"+n1(BX+dx-8)+" "+n1(BY+140)+" "+n1(BX+dx+10)+" "+n1(BY+190)+" "+
          n1(BX+dx)+" "+n1(HY - 6), C.blue, 3.4));
        k.appendChild(G.el("circle", {cx:n1(BX+dx), cy:n1(HY - 12), r:9,
          fill:C.blue, "fill-opacity":".5", stroke:C.blue, "stroke-width":2}));
      });
      g.appendChild(k);
    }

    /* ---- iron --------------------------------------------------- */
    if (v.fe > 0.02){
      const k = grp(half(v.fe)), by = v.vac > 0.5 ? BY + 120 : BY;
      k.appendChild(path("M"+n1(BX - BW/2 - 16)+" "+n1(by)+
        "C"+n1(BX-260)+" "+n1(by-70)+" "+n1(BX-380)+" "+n1(by+44)+" "+
        n1(BX-306)+" "+n1(by+74), C.amber, 3, "8 7"));
      k.appendChild(G.el("circle", {cx:n1(BX-306), cy:n1(by+82), r:16,
        fill:C.amber, "fill-opacity":".55", stroke:C.amber, "stroke-width":2.4}));
      k.appendChild(G.text(BX-306, by+89, "Fe", 19, C.ink, 700));
      k.appendChild(path("M"+n1(BX-286)+" "+n1(by+74)+
        "C"+n1(BX-210)+" "+n1(by+58)+" "+n1(BX-180)+" "+n1(by+30)+" "+
        n1(BX - BW/2 - 14)+" "+n1(by+16)+"m6 -12l-8 12l12 6", C.amber, 3));
      k.appendChild(G.text(BX-330, by-62, "siderophore", 22, C.amber, 700));
      g.appendChild(k);
    }

    /* ---- capsule ------------------------------------------------ */
    if (v.cap > 0.02){
      const k = grp(half(v.cap));
      k.appendChild(G.el("rect", {x:n1(BX - BW/2 - 34), y:n1(BY - BH/2 - 34),
        width:BW + 68, height:BH + 68, rx:(BH + 68)/2, fill:C.blue,
        "fill-opacity":".13", stroke:C.blue, "stroke-width":3,
        "stroke-dasharray":"2 9", "stroke-linecap":"round"}));
      [[-250, -40], [-230, 46], [250, -30]].forEach(function(p, i){
        k.appendChild(antibody(BX + p[0], BY + p[1]));
      });
      k.appendChild(path("M"+n1(BX-186)+" "+n1(BY-40)+"h34m-10 -8l10 8l-10 8",
        C.blue, 2.6, "6 5"));
      k.appendChild(G.text(BX - 254, BY - 78, "antibodies", 22, C.blue, 700));
      k.appendChild(G.text(BX - 254, BY + 112, "cannot reach it", 22, C.blue, 400));
      g.appendChild(k);
    }

    /* ---- vacuole ------------------------------------------------ */
    if (v.vac > 0.02){
      const k = grp(half(v.vac));
      k.appendChild(G.el("ellipse", {cx:BX, cy:BY + 96, rx:250, ry:170,
        fill:C.muted, "fill-opacity":".10", stroke:C.muted, "stroke-width":3}));
      k.appendChild(G.text(BX, BY - 46, "phagocyte", 22, C.muted, 400));
      k.appendChild(G.el("ellipse", {cx:BX, cy:BY + 120, rx:132, ry:92,
        fill:"#ffffff", stroke:C.verm, "stroke-width":3}));
      /* beside the phagocyte: under it is the host tissue band */
      k.appendChild(G.text(BX + 268, BY + 108, "vacuole", 22, C.verm, 700, "start"));
      k.appendChild(G.text(BX + 268, BY + 136, "never matures", 22, C.verm, 400, "start"));
      k.appendChild(bug(BX, BY + 120));
      g.appendChild(k);
    }

    /* ---- toxins -------------------------------------------------- */
    if (v.tox > 0.02){
      const k = grp(half(v.tox));
      [[-120, 112], [-40, 148], [46, 124], [118, 158]].forEach(function(p){
        k.appendChild(G.el("path", {d:
          "M"+n1(BX+p[0])+" "+n1(BY+p[1]-13)+"l12 9l14 -5l-6 14l9 12l-15 1l-7 13l-6 -13l-15 -2l10 -11l-6 -14Z",
          fill:C.verm, "fill-opacity":".45", stroke:C.verm, "stroke-width":2}));
      });
      k.appendChild(path("M"+n1(HX+70)+" "+n1(HY+26)+"h"+n1(HX1-HX-140),
        C.verm, 3, "12 9"));
      k.appendChild(G.text(BX, HY - 34, "damage", 22, C.verm, 700));
      g.appendChild(k);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
