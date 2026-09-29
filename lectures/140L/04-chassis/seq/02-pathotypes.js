/* ------------------------------------------------------------------ *
 * 02-pathotypes.js — six kinds of E. coli, sorted by what they do to
 * you rather than by where they came from.
 *
 * The source slide is a seven-item bullet list that arrives one line at
 * a time, and every line is a verb: attaches, poisons, effaces,
 * invades, aggregates.  A list cannot show that ETEC and EPEC damage
 * the same tissue in completely different ways, and that is the whole
 * content.  So the list becomes one stage — lumen, epithelium,
 * bloodstream — with each pathotype doing its own thing at its own
 * place along the wall, and all six still standing at the end, which is
 * the argument: they are job descriptions, not branches of the pedigree
 * two slides back.
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
function arrow(x0, y0, x1, y1, col, w){
  const g = G.el("g", {}), a = Math.atan2(y1 - y0, x1 - x0), h = 9;
  g.appendChild(path("M"+n1(x0)+" "+n1(y0)+"L"+n1(x1)+" "+n1(y1), col, w || 2.6));
  g.appendChild(path("M"+n1(x1 - h*Math.cos(a - 0.5))+" "+n1(y1 - h*Math.sin(a - 0.5))+
    "L"+n1(x1)+" "+n1(y1)+
    "L"+n1(x1 - h*Math.cos(a + 0.5))+" "+n1(y1 - h*Math.sin(a + 0.5)), col, w || 2.6));
  return g;
}
/* a cell, at whatever angle it happens to be lying */
function rod(x, y, a, col, w, h){
  w = w || 46; h = h || 19;
  return G.el("rect", {x:n1(x - w/2), y:n1(y - h/2), width:w, height:h, rx:n1(h/2),
    fill:col, "fill-opacity":".18", stroke:col, "stroke-width":2.4,
    transform:"rotate("+n1(a)+" "+n1(x)+" "+n1(y)+")"});
}
function dot(x, y, r, col){
  return G.el("circle", {cx:n1(x), cy:n1(y), r:r, fill:col, "fill-opacity":".55",
    stroke:col, "stroke-width":1.6});
}
/* the name of a pathotype, hung in the lumen above its own patch of wall */
function tag(x, abbr, full, col){
  const g = G.el("g", {});
  g.appendChild(G.text(x, 262, abbr, 27, col, 700));
  g.appendChild(G.text(x, 292, full, 19, C.muted, 400));
  return g;
}

/* ---- the stage ---------------------------------------------------- */
const X0 = 150, X1 = 1450;
const ETOP = 462, EBOT = 576;             /* the epithelium            */
const NC = 12, CW = (X1 - X0)/NC;
const CAP = {y:630, h:38};                /* the capillary underneath  */
const SLOT = [258, 475, 692, 908, 1125, 1342];
/* A pedestal is 80 wide and a cell is 108, so it straddles two of them:
   the microvilli have to be cleared by footprint or half of them survive
   underneath the bacterium that is supposed to have destroyed them. */
const PED = 46;

const FR = [
{ s:{gut:1, comm:1},
  cap:"your large intestine, on an ordinary day",
  call:"<em>E. coli</em> is the dominant <b>facultative anaerobe</b> in there",
  note:"Set the stage first, because all six of the categories coming up are defined on it. This is a cutaway of the gut: the lumen on top, a single layer of epithelial cells with microvilli facing into it, and the bloodstream underneath. E. coli is the dominant facultative anaerobe of the human large intestine, and in the ordinary case it simply lives in the lumen and does nothing to you. That is where the lab strains came from and that is what they still are. But particular strains can infect nearly any part of the body, including the brain, and the way they are sorted is worth understanding, because it is not by descent.",
  desc:"A cutaway of the gut: lumen above, a layer of epithelial cells with microvilli, and a capillary below. Commensal E. coli cells float in the lumen." },

{ s:{gut:1, comm:1, etec:1},
  cap:"<b>ETEC</b> &#183; enterotoxigenic",
  call:"attaches, then secretes a toxin that makes the lining dump water",
  note:"Enterotoxigenic E. coli. These are the travellers' diarrhoea strains. They colonise the small intestine, hold on with adhesins, and secrete an enterotoxin, and the toxin does all of the harm: it locks the epithelium's ion transport into the wrong state and the lining pours water into the lumen. The cells themselves are not damaged. Take the toxin away and you have an ordinary commensal sitting on a wall.",
  desc:"Enterotoxigenic E. coli attached to the epithelium, releasing toxin, with water flowing out of the epithelial cells into the lumen." },

{ s:{gut:1, comm:1, etec:1, epec:1},
  cap:"<b>EPEC</b> &#183; enteropathogenic",
  call:"effaces the microvilli and stands on a pedestal it built",
  note:"Enteropathogenic E. coli does the opposite kind of damage. It attaches intimately to the cell surface, destroys the microvilli underneath it, and makes the cell build an actin pedestal that the bacterium then sits on. That is a structural attack rather than a chemical one, and it is a major cause of infant diarrhoea. Same tissue, same starting organism, completely different mechanism from the one before it.",
  desc:"Enteropathogenic E. coli on a pedestal raised from the epithelial surface, with the microvilli beneath it gone." },

{ s:{gut:1, comm:1, etec:1, epec:1, ehec:1},
  cap:"<b>EHEC</b> &#183; enterohemorrhagic",
  call:"attaches the same way, and adds <b>Shiga toxin</b> &#183; O157:H7",
  note:"Enterohemorrhagic E. coli attaches the way EPEC does, and then adds Shiga toxin, which crosses into the bloodstream and damages tissue far from the gut, the kidney in particular. This is the O157:H7 group. Be careful with that name: O157 refers to carbohydrates on the cell surface and H7 to a flagellar gene cluster, so the two together describe biochemistry on the outside of the cell, which is what antibodies see. Two strains can share O157 and H7 and differ everywhere else. O157:H7 is a pattern of co-associated sequences, not a strain. CDC B6914-MS1 is a strain.",
  desc:"Enterohemorrhagic E. coli attached like EPEC, with Shiga toxin passing down through the epithelium into the capillary and away." },

{ s:{gut:1, comm:1, etec:1, epec:1, ehec:1, eiec:1},
  cap:"<b>EIEC</b> &#183; enteroinvasive",
  call:"gets <b>inside</b> the cell and multiplies &#8212; which is what <em>Shigella</em> does",
  note:"Enteroinvasive E. coli does not stay outside at all. It gets taken into the epithelial cell, escapes the vacuole, multiplies in the cytoplasm and spreads sideways into the neighbouring cell without ever going back out into the lumen. And this is the same organism you met two slides ago under a different name, because that is precisely what Shigella does, and genomically Shigella is E. coli. The vacuole escape comes back later in this lecture as one of the five virulence strategies.",
  desc:"Enteroinvasive E. coli inside an epithelial cell, multiplying in the cytoplasm and spreading into the neighbouring cell." },

{ s:{gut:1, comm:1, etec:1, epec:1, ehec:1, eiec:1, eagg:1},
  cap:"<b>EAggEC</b> &#183; enteroaggregative",
  call:"stacks up like bricks and stays &#183; persistent diarrhoea",
  note:"Enteroaggregative E. coli is named for how it looks: instead of spreading out over the surface, the cells stack onto each other in a brick-like pattern and build a biofilm that is hard to clear. The result is persistent diarrhoea rather than an acute episode. Again a different mechanism, on the same tissue, from the same species.",
  desc:"Enteroaggregative E. coli stacked in a brick pattern on the epithelial surface as a biofilm." },

{ s:{gut:1, comm:1, etec:1, epec:1, ehec:1, eiec:1, eagg:1, sum:1},
  cap:"six categories, and <b>not one</b> of them is a branch",
  call:"these are job descriptions &#183; the pedigree is somewhere else entirely",
  note:"Now look at the whole wall. Six categories, six mechanisms, and every one of them is defined by what the strain does to a person: where it sits, what it secretes, what an antibody sees. None of them is defined by descent. Go back to the pedigree from earlier in this section and you cannot draw these six categories onto it, because a pathotype is a job description and a lineage is an ancestry, and the two do not line up. Pathogenicity is not a property of a species. It is not even reliably a property of a clade. It is a property of what a particular strain is carrying, and most of what it is carrying arrived horizontally.",
  desc:"All six categories on the wall at once, braced together, with the point that they are clinical categories rather than branches of a lineage." }
];

window.Deck.sequence("pathotypes", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v, f){
    const g = G.el("g", {});
    const st = f.s || {};
    /* the two pathotypes that strip the microvilli off their own cell */
    const bald = [];
    if (st.epec > 0.5) bald.push(SLOT[2]);
    if (st.ehec > 0.5) bald.push(SLOT[3]);
    const shaved = mx => bald.some(c => Math.abs(mx - c) < PED);

    /* ---- the gut ------------------------------------------------- */
    const gut = grp(v.gut);
    for (let i = 0; i < NC; i++){
      const x = X0 + CW*i;
      gut.appendChild(G.el("rect", {x:n1(x), y:ETOP, width:n1(CW), height:EBOT - ETOP,
        fill:C.blue, "fill-opacity":".07", stroke:C.blue, "stroke-width":2}));
      for (let k = 0; k < 5; k++){
        const mx = x + CW*(k + 0.5)/5;
        if (!shaved(mx))
          gut.appendChild(path("M"+n1(mx)+" "+ETOP+"V"+n1(ETOP - 14), C.blue, 2.4));
      }
    }
    gut.appendChild(path("M"+X0+" "+n1(CAP.y - CAP.h/2)+"H"+X1, C.verm, 2.4));
    gut.appendChild(path("M"+X0+" "+n1(CAP.y + CAP.h/2)+"H"+X1, C.verm, 2.4));
    gut.appendChild(G.text(X0, CAP.y + 7, " bloodstream", 20, C.muted, 400, "start"));
    gut.appendChild(G.text(X0, 226, "lumen", 20, C.muted, 400, "start"));
    g.appendChild(gut);

    /* ---- the ordinary case --------------------------------------- */
    if (v.comm > 0.02){
      const c = grp(v.comm), x = SLOT[0];
      [[-46, -122, 18], [22, -86, -26], [-10, -34, 8]].forEach(function(d){
        c.appendChild(rod(x + d[0], ETOP + d[1], d[2], C.ink));
      });
      c.appendChild(tag(x, "commensal", "and does nothing at all", C.ink));
      g.appendChild(c);
    }
    /* ---- ETEC: attach, then poison ------------------------------- */
    if (v.etec > 0.02){
      const e = grp(v.etec), x = SLOT[1];
      e.appendChild(rod(x, ETOP - 34, 0, C.verm));
      for (let k = -1; k <= 1; k++)
        e.appendChild(path("M"+n1(x + k*13)+" "+n1(ETOP - 25)+"V"+n1(ETOP - 12), C.verm, 2.2));
      [[-16, 34], [4, 52], [20, 30]].forEach(function(d){
        e.appendChild(dot(x + d[0], ETOP + d[1], 6, C.verm));
      });
      /* and the water the epithelium then loses */
      [-54, 54].forEach(function(dx){
        e.appendChild(arrow(x + dx, ETOP + 40, x + dx, ETOP - 66, C.blue, 2.4));
      });
      e.appendChild(G.text(x + 84, ETOP - 74, "water", 19, C.blue, 400, "middle"));
      e.appendChild(tag(x, "ETEC", "enterotoxigenic", C.verm));
      g.appendChild(e);
    }
    /* ---- EPEC: efface, then stand on the wreckage ---------------- */
    if (v.epec > 0.02){
      const p = grp(v.epec), x = SLOT[2];
      p.appendChild(G.el("path", {d:"M"+n1(x - 40)+" "+ETOP+
        "C"+n1(x - 28)+" "+n1(ETOP - 38)+" "+n1(x + 28)+" "+n1(ETOP - 38)+" "+
        n1(x + 40)+" "+ETOP+"Z", fill:C.blue, "fill-opacity":".18",
        stroke:C.blue, "stroke-width":2.4}));
      p.appendChild(rod(x, ETOP - 46, 0, C.verm));
      p.appendChild(G.text(x, ETOP + 74, "microvilli gone", 19, C.blue, 400));
      p.appendChild(tag(x, "EPEC", "enteropathogenic", C.verm));
      g.appendChild(p);
    }
    /* ---- EHEC: the same, plus a toxin that leaves the gut -------- */
    if (v.ehec > 0.02){
      const h = grp(v.ehec), x = SLOT[3];
      h.appendChild(G.el("path", {d:"M"+n1(x - 40)+" "+ETOP+
        "C"+n1(x - 28)+" "+n1(ETOP - 38)+" "+n1(x + 28)+" "+n1(ETOP - 38)+" "+
        n1(x + 40)+" "+ETOP+"Z", fill:C.blue, "fill-opacity":".18",
        stroke:C.blue, "stroke-width":2.4}));
      h.appendChild(rod(x, ETOP - 46, 0, C.verm));
      [0, 1, 2, 3].forEach(function(k){
        h.appendChild(dot(x, ETOP + 24 + k*38, 7, C.verm));
      });
      h.appendChild(arrow(x + 16, CAP.y, x + 150, CAP.y, C.verm, 2.6));
      h.appendChild(G.text(x + 172, CAP.y + 7, "Shiga toxin", 19, C.verm, 700, "start"));
      h.appendChild(tag(x, "EHEC", "enterohemorrhagic", C.verm));
      g.appendChild(h);
    }
    /* ---- EIEC: inside, and then sideways ------------------------- */
    if (v.eiec > 0.02){
      const i = grp(v.eiec), x = SLOT[4], my = (ETOP + EBOT)/2;
      i.appendChild(rod(x - 22, my - 18, -12, C.verm, 40, 17));
      i.appendChild(rod(x - 6,  my + 20, 14,  C.verm, 40, 17));
      i.appendChild(arrow(x + 22, my, x + 74, my, C.verm, 2.4));
      i.appendChild(G.text(x, ETOP - 46, "inside the cell", 19, C.verm, 400));
      i.appendChild(tag(x, "EIEC", "enteroinvasive", C.verm));
      g.appendChild(i);
    }
    /* ---- EAggEC: a wall of bricks -------------------------------- */
    if (v.eagg > 0.02){
      const a = grp(v.eagg), x = SLOT[5];
      [[-26, -24], [26, -24], [-52, -50], [0, -50], [52, -50], [-26, -76], [26, -76]]
        .forEach(function(d){ a.appendChild(rod(x + d[0], ETOP + d[1], 0, C.verm, 48, 20)); });
      a.appendChild(tag(x, "EAggEC", "enteroaggregative", C.verm));
      g.appendChild(a);
    }
    /* ---- and the point ------------------------------------------- */
    if (v.sum > 0.02){
      const b = grp(v.sum), y = CAP.y + CAP.h/2 + 34;
      b.appendChild(path("M"+n1(SLOT[1] - 96)+" "+n1(y - 12)+
        "V"+n1(y)+"H"+n1(SLOT[5] + 96)+"V"+n1(y - 12), C.muted, 2.4));
      b.appendChild(G.text((SLOT[1] + SLOT[5])/2, y + 32,
        "five clinical categories · one species · no lineage",
        23, C.muted, 400));
      g.appendChild(b);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
