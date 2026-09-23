/* ------------------------------------------------------------------ *
 * 05-accessory.js — the same bar again, and where virulence lives.
 *
 * The source opens this section by reprinting the core-chassis bullets
 * from the Parent Strains section and adding one clause: none of it is
 * enough to make a pathogen.  That clause is the slide, and the bar
 * those bullets already became two sections ago says it in one look.
 *
 * Deliberately the same geometry as 01-genome.js.  Coming back to a
 * figure you have already read is worth more than a new one here,
 * because the argument IS that this is the same genome.
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

const X0 = 200, PXMB = 245.7, TOT = 4.64, CORE = 3.0;
const XC = X0 + PXMB*CORE, X1 = X0 + PXMB*TOT;
const BY = 300, BH = 64;

const JOBS = ["information and reproduction", "biosynthesis",
              "robustness and control", ""];
const VIR = ["adhesion", "iron", "capsule", "vacuole", "toxins"];

const FR = [
{ s:{bar:1},
  cap:"the same genome you have already read",
  call:"the inner layers are nearly identical in every <em>E. coli</em> there is",
  note:"Back to the layered genome from the first section, because it makes this point in one look. The inner layers -- information and reproduction, biosynthesis, and the robustness layer around them -- are nearly identical base for base across the enterobacteria. A commensal and something that will put you in hospital share essentially all of it.",
  desc:"The E. coli genome bar again, split into the roughly three megabase core and the rest." },

{ s:{bar:1, split:1},
  cap:"and <b>none</b> of the left-hand side makes a pathogen",
  call:"everything that does is over here &#183; and it mostly arrived horizontally",
  note:"And that is the whole setup for this section. Pathogenesis always needs genes on top of the core. The core is not sufficient for it and never has been, which is why you cannot look at an E. coli genome, see that it has all the housekeeping, and conclude anything at all about whether it is dangerous. The genes that decide are out on the right, they are collectively called virulence factors, and most of them arrived horizontally rather than by descent. The rest of this section is what they do.",
  desc:"The core is marked as not sufficient for pathogenesis, and the five categories of virulence factor are shown hanging off the accessory portion." }
];

window.Deck.sequence("accessory", function(slide){
  const s = G.scene(slide, 792, 838);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    const b = grp(v.bar);
    b.appendChild(G.el("rect", {x:X0, y:BY, width:n1(X1 - X0), height:BH, rx:6,
      fill:C.muted, "fill-opacity":".10", stroke:C.ink, "stroke-width":2.6}));
    b.appendChild(G.el("rect", {x:X0, y:BY, width:n1(XC - X0), height:BH, rx:6,
      fill:C.blue, "fill-opacity":".16", stroke:C.blue, "stroke-width":3}));
    b.appendChild(G.text((X0 + XC)/2, BY + 41, "make a cell, and keep it alive", 25, C.blue, 700));
    b.appendChild(G.text(X1, BY - 24, "4.64 Mb", 24, C.muted, 400, "end"));
    b.appendChild(G.el("text", {x:X0, y:BY - 24, "font-size":25, fill:C.ink,
      "font-weight":700, "font-style":"italic"}, "E. coli"));
    JOBS.forEach(function(j, i){
      const x = X0 + (i % 2)*420, y = BY + BH + 60 + Math.floor(i/2)*58;
      b.appendChild(path("M"+n1(x)+" "+n1(y - 20)+"V"+n1(y + 8), C.blue, 3));
      b.appendChild(G.text(x + 16, y, j, 23, C.blue, 400, "start"));
    });
    b.appendChild(G.text((X0 + XC)/2, BY + BH + 216,
      "∼3 Mb · ∼3000 genes · nearly identical across the Enterobacteria",
      21, C.muted, 400));
    g.appendChild(b);

    if (v.split > 0.02){
      const a = grp(v.split);
      a.appendChild(G.el("rect", {x:n1(XC), y:BY, width:n1(X1 - XC), height:BH, rx:6,
        fill:C.verm, "fill-opacity":".18", stroke:C.verm, "stroke-width":3}));
      a.appendChild(G.text((XC + X1)/2, BY + 41, "the outer layer", 25, C.verm, 700));
      VIR.forEach(function(t, i){
        const y = BY + BH + 56 + i*58;
        a.appendChild(path("M"+n1(XC + 20)+" "+n1(y - 20)+"V"+n1(y + 8), C.verm, 3));
        a.appendChild(G.text(XC + 36, y, t, 25, C.verm, 700, "start"));
      });
      a.appendChild(G.text(XC + 36, BY + BH + 56 + 5*58 + 6,
        "virulence factors · and mostly horizontal", 20, C.muted, 400, "start"));
      /* and say the quiet part on the core */
      a.appendChild(G.text((X0 + XC)/2, BY + BH + 248,
        "not one of these is enough", 24, C.muted, 700));
      g.appendChild(a);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
