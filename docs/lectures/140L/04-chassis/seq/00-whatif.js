/* ------------------------------------------------------------------ *
 * 00-whatif.js — the same system, one condition moved, and it breaks.
 *
 * The group exercise that follows the worked CRISPR trace.  It is
 * deliberately NOT a new system: the point of the previous slide is
 * that the loop is a method, and the way to show a method generalises
 * is to run it again with an input changed, not to introduce parts
 * nobody has met.  Everything needed to answer is already on the wall.
 *
 * The question: you add the IPTG at the same time as the arabinose,
 * before the electroporation, instead of at the end.  What happens?
 *
 * The answer falls out of the loop in three moves.  IPTG is present,
 * so the anti-pMB1 guide fires.  Cas9 is constitutive and has been
 * there since pCas landed.  So the moment pTarget arrives carrying a
 * pMB1 origin, it is cut -- before its own guide has done anything.
 * No guide against aspC1, no break at aspC1, no edit.
 *
 * What makes it worth twelve minutes of class: the plate still looks
 * right.  Nothing dies dramatically, you just get colonies that are
 * not edited, and the genotype you wanted is silently absent.  That is
 * the failure mode the method is for.
 *
 * NOTE: the grid drawing here duplicates 00-trace.js.  Left duplicated
 * on purpose until the exercise format has been presented once -- the
 * regulation column was not obviously missing until the first version
 * had been in front of a room, and freezing a shared component before
 * that happens again would be premature.
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

/* the same procedure, with the IPTG moved to the front */
const STEPS = ["Mach1", "+ pCas", "+ ara <b>+ IPTG</b>", "transform",
               "recover", "Spec · Kan", "42°"];
const TX0 = 150, TW = 194, TY = 196, TH = 46;
const GHOST = 0.2;

const RY0 = 330, RDY = 74;
const LBL = 214, RULE = 226, DNA0 = 246, TX_A = 664, RNA_C = 856, PRO0 = 1076;
const ry = i => RY0 + RDY*i;

const ROWS = [
  {mol:"pcas", key:"cas9", reg:"always on",      rna:"cas9",          prot:"Cas9"},
  {mol:"pcas", key:"g2",   reg:"needs IPTG",     rna:"sgRNA ✕ pMB1",  prot:null},
  {mol:"ptar", key:"g1",   reg:"always on",      rna:"sgRNA ✕ aspC1", prot:null},
  {mol:"chr",  key:"aspc", reg:"always on",      rna:"aspC1",         prot:"AspC1"}
];
const MOLS = [["pCas", 0, 1], ["pTarget", 2, 2], ["chromosome", 3, 3]];

function promoter(x, y, col){
  const g = G.el("g", {});
  g.appendChild(path("M"+n1(x)+" "+n1(y+12)+"V"+n1(y-20)+"H"+n1(x+26), col, 2.6));
  g.appendChild(path("M"+n1(x+18)+" "+n1(y-27)+"L"+n1(x+28)+" "+n1(y-20)+
    "L"+n1(x+18)+" "+n1(y-13), col, 2.6));
  return g;
}
function gene(x0, x1, y, label, col, size){
  const g = G.el("g", {}), h = 26, tip = 14;
  g.appendChild(G.el("rect", {x:n1(x0), y:n1(y - h/2), width:n1(x1 - x0),
    height:h, rx:4, fill:C.paper}));
  g.appendChild(G.el("path", {d:"M"+n1(x0)+" "+n1(y-h/2)+"H"+n1(x1-tip)+
    "L"+n1(x1)+" "+n1(y)+"L"+n1(x1-tip)+" "+n1(y+h/2)+"H"+n1(x0)+"Z",
    fill:col, "fill-opacity":".14", stroke:col, "stroke-width":2.2,
    "stroke-linejoin":"round"}));
  g.appendChild(G.text((x0 + x1 - tip)/2, y + 6, label, size || 18, col, 700));
  return g;
}
function ori(x0, x1, y, label, col){
  const g = G.el("g", {}), h = 26;
  g.appendChild(G.el("rect", {x:n1(x0), y:n1(y - h/2), width:n1(x1 - x0),
    height:h, rx:5, fill:C.paper}));
  g.appendChild(G.el("rect", {x:n1(x0), y:n1(y-h/2), width:n1(x1-x0), height:h,
    rx:5, fill:col, "fill-opacity":".10", stroke:col, "stroke-width":2.2,
    "stroke-dasharray":"6 4"}));
  g.appendChild(G.text((x0+x1)/2, y + 5, label, 16, col, 700));
  return g;
}
function seg(x0, x1, y, col){ return path("M"+n1(x0)+" "+n1(y)+"H"+n1(x1), col, 2.4); }
function wave(cx, y, col){
  const w = 76;
  let d = "M"+n1(cx - w/2)+" "+n1(y);
  for (let i = 0; i < 4; i++)
    d += "q"+n1(w/16)+" -7 "+n1(w/8)+" 0 q"+n1(w/16)+" 7 "+n1(w/8)+" 0";
  return path(d, col, 3);
}
function blob(cx, y, label, col, on){
  const g = G.el("g", {}), w = label.length > 4 ? 96 : 78;
  g.appendChild(G.el("rect", {x:n1(cx - w/2), y:n1(y - 17), width:w, height:34,
    rx:17, fill:col, "fill-opacity":on ? ".2" : "0", stroke:col,
    "stroke-width":on ? 2.6 : 1.8}));
  g.appendChild(G.text(cx, y + 7, label, 19, col, on ? 700 : 400));
  return g;
}
function arrow(x0, x1, y, col){
  const g = G.el("g", {});
  g.appendChild(path("M"+n1(x0)+" "+n1(y)+"H"+n1(x1 - 8), col, 2.4));
  g.appendChild(path("M"+n1(x1 - 15)+" "+n1(y - 6)+"L"+n1(x1)+" "+n1(y)+
    "L"+n1(x1 - 15)+" "+n1(y + 6), col, 2.4));
  return g;
}

const FR = [
{ s:{sc:1, step:3, pcas:1, chr:1, pose:1},
  cap:"<b>Your turn.</b> Same experiment, one change",
  call:"you add the <b>IPTG at the start</b>, with the arabinose &#183; what happens?",
  note:"This one they do, not you. Same system as the last slide, same grid, one thing moved: the IPTG goes in at the beginning, alongside the arabinose, instead of at the end. Everything needed to answer it is already on the wall. Give them a few minutes in pairs and take answers before clicking. The wrong answers are useful. Some will say it makes no difference because IPTG only matters at the end; some will say the cells die. Neither is right, and the second one is interestingly wrong.",
  desc:"The same grid as the previous slide, with the procedure changed so IPTG is added at the start alongside arabinose. The room is asked to predict what happens." },

{ s:{sc:1, step:3, pcas:1, cas9:1, g2:1, chr:1, aspc:1, r1:1},
  cap:"round one &#183; what fires with IPTG present?",
  call:"the anti-pMB1 guide &#8212; and <b>Cas9 was already there</b>",
  note:"Run the loop. IPTG is present, so the lac promoter on pCas fires and the guide against pMB1 is made. And Cas9 is constitutive, so it has been sitting in the cell since pCas arrived. Those two together are a loaded nuclease with an address, and the address is a pMB1 origin. At this point nothing has gone wrong, because there is no pMB1 origin in the cell yet.",
  desc:"With IPTG present from the start, the anti-pMB1 guide is transcribed, and Cas9 is already present because its promoter is constitutive." },

{ s:{sc:1, step:4, pcas:1, cas9:1, g2:1, chr:1, aspc:1, ptar:1, hit:1},
  cap:"then you electroporate &#183; and <b>pTarget has a pMB1 origin</b>",
  call:"it is cut on arrival, before its own guide does anything",
  note:"Now electroporate. pTarget carries a pMB1 origin, which is exactly what the guide already in the cell is pointed at. So it is cut on arrival. Its own guide, the one against aspC1, is under a constitutive promoter and would have been made straight away, but the plasmid does not survive long enough to matter.",
  desc:"pTarget arrives carrying a pMB1 origin and is cut immediately by the Cas9 and anti-pMB1 guide already present." },

{ s:{sc:1, step:5, pcas:1, cas9:1, g2:1, chr:1, aspc:1, hit:1, none:1},
  cap:"so there is <b>no guide</b> against aspC1",
  call:"no break at aspC1 &#183; no repair &#183; <b>no edit</b>",
  note:"And that is the whole failure. No guide against aspC1 means no double-strand break at aspC1, and with no break there is nothing for lambda Red to repair off the donor. The chromosome is untouched. The donor is still sitting there, unused, and will be degraded.",
  desc:"Without the aspC1 guide there is no break at the target, so no repair and no edit; the chromosome is unchanged." },

{ s:{sc:1, step:6, pcas:1, cas9:1, g2:1, chr:1, aspc:1, hit:1, none:1, silent:1},
  cap:"and here is the part that should worry you",
  call:"the plate looks <b>fine</b> &#183; the strain is simply not edited",
  note:"Here is why this is worth doing rather than telling. Ask what you would actually see. You plate on spectinomycin and kanamycin, and you get colonies, because some pTarget will have been cut after replicating enough times to keep the cells alive on spectinomycin for a while, and because cutting is never one hundred per cent. Nothing dies dramatically. There is no error message. You pick colonies, you send them for sequencing, and only then do you find out that none of them carry the deletion. The method on the last slide is not an academic exercise; it is the thing that would have told you, before you spent a week, that adding the inducer early breaks the experiment. Order is not a convention.",
  desc:"The conclusion: the selection still produces colonies, so the failure is silent, and the strain is simply not edited." }
];

window.Deck.sequence("whatif", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v, f){
    const g = G.el("g", {}), st = f.s || {}, step = st.step || 0;

    const t = grp(v.sc);
    STEPS.forEach(function(lab, i){
      const x = TX0 + TW*i, on = (i + 1) === step, hot = i === 2;
      t.appendChild(G.el("rect", {x:n1(x), y:TY, width:n1(TW - 12), height:TH,
        rx:7, fill:on ? C.verm : C.muted, "fill-opacity":on ? ".14" : ".05",
        stroke:on ? C.verm : (hot ? C.verm : C.muted),
        "stroke-width":on ? 3 : (hot ? 2.4 : 1.8)}));
      const e = G.el("text", {x:n1(x + (TW - 12)/2), y:n1(TY + 31),
        "font-size":20, fill:on || hot ? C.verm : C.muted,
        "font-weight":on ? 700 : 400, "text-anchor":"middle"});
      e.innerHTML = lab.replace(/<b>/g, '<tspan font-weight="700">')
                       .replace(/<\/b>/g, "</tspan>");
      t.appendChild(e);
    });
    g.appendChild(t);

    const grid = grp(v.sc);
    [[DNA0 + 160, "DNA"], [RNA_C + 40, "RNA"], [PRO0 + 40, "protein"]]
      .forEach(function(h){ grid.appendChild(G.text(h[0], 288, h[1], 20,
        C.muted, 700)); });

    MOLS.forEach(function(m){
      const key = m[0] === "pCas" ? "pcas" : m[0] === "pTarget" ? "ptar" : "chr";
      const pres = cl(v[key] || 0, 0, 1);
      const b = grp(GHOST + (1 - GHOST)*pres);
      const y0 = ry(m[1]) - 24, y1 = ry(m[2]) + 24;
      const col = pres > 0.5 ? C.blue : C.muted;
      b.appendChild(path("M"+n1(RULE)+" "+n1(y0)+"V"+n1(y1), col, 2.4));
      b.appendChild(G.text(LBL, (y0 + y1)/2 + 7, m[0], 20, col, 700, "end"));
      grid.appendChild(b);
    });

    ROWS.forEach(function(r, i){
      const y = ry(i);
      const pres = cl(v[r.mol] || 0, 0, 1);
      const cut  = r.mol === "ptar" && (st.hit || 0) > 0.5;
      const fire = cut ? 0 : cl(v[r.key] || 0, 0, 1);
      const posing = (st.pose || 0) > 0.5;
      const dcol = !posing && fire > 0.5 ? C.blue : C.muted;
      const d = grp(GHOST + (1 - GHOST)*pres);

      if (r.key === "cas9"){
        d.appendChild(seg(DNA0, 452, y, dcol));
        d.appendChild(promoter(DNA0 + 6, y, dcol));
        d.appendChild(gene(DNA0 + 62, 446, y, "cas9", dcol));
      } else if (r.key === "g2"){
        d.appendChild(seg(DNA0, 556, y, dcol));
        d.appendChild(promoter(DNA0 + 6, y, dcol));
        d.appendChild(gene(DNA0 + 62, 550, y, "sgRNA ✕ pMB1", dcol, 16));
      } else if (r.key === "g1"){
        d.appendChild(seg(DNA0, 640, y, dcol));
        d.appendChild(ori(DNA0, 344, y, "pMB1", cut ? C.verm : dcol));
        d.appendChild(promoter(364, y, dcol));
        d.appendChild(gene(420, 634, y, "sgRNA ✕ aspC1", dcol, 16));
        if (cut){
          d.appendChild(path("M"+n1(292)+" "+n1(y - 30)+"l60 60m0 -60l-60 60",
            C.verm, 5));
          d.appendChild(G.text(500, y - 44, "cut on arrival", 20, C.verm, 700));
        }
      } else {
        d.appendChild(seg(DNA0 - 10, 600, y, C.ink));
        d.appendChild(promoter(DNA0 + 4, y, C.ink));
        d.appendChild(gene(DNA0 + 60, 400, y, "aspC1", C.ink));
        if ((st.none || 0) > 0.5)
          d.appendChild(G.text(470, y - 40, "never cut · unchanged", 20,
            C.verm, 700, "start"));
      }
      d.appendChild(G.text(DNA0 + 2, y + 34, r.reg, 17,
        !posing && fire > 0.5 ? C.blue : C.muted,
        !posing && fire > 0.5 ? 700 : 400, "start"));
      grid.appendChild(d);

      /* while the question is open the right-hand columns are theirs
         to fill: showing the products is showing the answer */
      if ((st.pose || 0) > 0.5){
        const q = grp(pres);
        q.appendChild(G.text(RNA_C - 6, y + 10, "?", 30, C.muted, 700));
        q.appendChild(G.text(PRO0 + 40, y + 10, "?", 30, C.muted, 700));
        grid.appendChild(q);
      } else {
        const o = grp(GHOST + (1 - GHOST)*fire);
        const oc = fire > 0.5 ? C.blue : C.muted;
        o.appendChild(arrow(TX_A, TX_A + 44, y, oc));
        o.appendChild(wave(RNA_C - 42, y, oc));
        o.appendChild(G.text(RNA_C + 22, y + 7, r.rna, 19, oc,
          fire > 0.5 ? 700 : 400, "start"));
        if (r.prot){
          o.appendChild(arrow(PRO0 - 62, PRO0 - 18, y, oc));
          o.appendChild(blob(PRO0 + 40, y, r.prot, oc, fire > 0.5));
        } else {
          o.appendChild(G.text(PRO0 + 40, y + 6, "—", 24, C.muted, 400));
        }
        grid.appendChild(o);
      }
    });
    g.appendChild(grid);

    if (v.silent > 0.02){
      const q = grp(v.silent);
      q.appendChild(G.el("rect", {x:300, y:700, width:1000, height:74, rx:10,
        fill:C.verm, "fill-opacity":".10", stroke:C.verm, "stroke-width":2.6}));
      q.appendChild(G.text(800, 736, "you still get colonies on Spec · Kan",
        24, C.verm, 700));
      q.appendChild(G.text(800, 762,
        "nothing tells you it failed until you sequence", 20, C.muted, 400));
      g.appendChild(q);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
