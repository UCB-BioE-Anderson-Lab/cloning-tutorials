/* ------------------------------------------------------------------ *
 * 00-trace.js — read the circuit, and the whole procedure falls out.
 *
 * The bridge the source deck was missing.  The slide before ends on six
 * lines of growth and one transformation and says an orchestra of
 * events follows; the slide after is polar mutations, which is that
 * reasoning catching something people miss.  Between them has to be the
 * reasoning itself.
 *
 * Drawn rather than tabulated, on JCA's instruction: the genetic part
 * is a gene cartoon with products popping up off the transcription
 * units that are firing, and the only list on the slide is a checklist
 * of the PROTEINS, on or off.  A table of promoters was the thing this
 * slide was supposed to replace.
 *
 * The ticker across the top is deliberately the previous slide's six
 * lines, same order, same words.
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

/* ---- the six conditions, which are the last slide's six lines ----- */
const STEPS = ["Kan · 30°", "+ arabinose", "transform",
               "Spec · Kan", "+ IPTG", "42°"];
const TX0 = 200, TW = 200, TY = 190, TH = 48;

/* ---- the molecules ------------------------------------------------ */
const CAS_Y = 392, TAR_Y = 556, CHR_Y = 700;
const CAS_P = 316, TAR_P = 486;          /* where products pop up      */

/* a promoter: the bent arrow every genetics figure uses */
function promoter(x, y, col){
  const g = G.el("g", {});
  g.appendChild(path("M"+n1(x)+" "+n1(y+14)+"V"+n1(y-26)+"H"+n1(x+34), col, 3));
  g.appendChild(path("M"+n1(x+24)+" "+n1(y-34)+"L"+n1(x+36)+" "+n1(y-26)+
    "L"+n1(x+24)+" "+n1(y-18), col, 3));
  return g;
}
/* a gene, as a block arrow pointing the way it is read */
function gene(x0, x1, y, label, col, size){
  const g = G.el("g", {}), h = 28, tip = 16;
  g.appendChild(G.el("path", {d:"M"+n1(x0)+" "+n1(y-h/2)+"H"+n1(x1-tip)+
    "L"+n1(x1)+" "+n1(y)+"L"+n1(x1-tip)+" "+n1(y+h/2)+"H"+n1(x0)+"Z",
    fill:col, "fill-opacity":".14", stroke:col, "stroke-width":2.4,
    "stroke-linejoin":"round"}));
  g.appendChild(G.text((x0 + x1 - tip)/2, y + 7, label, size || 20, col, 700));
  return g;
}
/* an origin, which is not read and so is not an arrow */
function ori(x0, x1, y, label, col){
  const g = G.el("g", {}), h = 28;
  g.appendChild(G.el("rect", {x:n1(x0), y:n1(y-h/2), width:n1(x1-x0), height:h,
    rx:5, fill:col, "fill-opacity":".10", stroke:col, "stroke-width":2.4,
    "stroke-dasharray":"6 4"}));
  g.appendChild(G.text((x0+x1)/2, y + 6, label, 17, col, 700));
  return g;
}
/* the molecule itself, stepping around everything drawn on it */
function backbone(y, x0, x1, gaps, col){
  const g = G.el("g", {});
  let x = x0;
  gaps.forEach(function(gp){
    if (gp[0] > x) g.appendChild(path("M"+n1(x)+" "+n1(y)+"H"+n1(gp[0]), col, 2.6));
    x = gp[1];
  });
  g.appendChild(path("M"+n1(x)+" "+n1(y)+"H"+n1(x1), col, 2.6));
  return g;
}
/* a protein, popping up off the gene that made it */
function protein(x, gy, py, label, w){
  const g = G.el("g", {}), ww = w || 88;
  g.appendChild(path("M"+n1(x)+" "+n1(gy-16)+"V"+n1(py+20), C.verm, 2.2, "5 4"));
  g.appendChild(G.el("rect", {x:n1(x-ww/2), y:n1(py-18), width:ww, height:38,
    rx:19, fill:C.verm, "fill-opacity":".18", stroke:C.verm, "stroke-width":2.6}));
  g.appendChild(G.text(x, py + 8, label, 21, C.verm, 700));
  return g;
}
/* an RNA, which is not a protein and is drawn as one wave so it cannot
   be mistaken for one on the checklist */
function rna(x, gy, py, label){
  const g = G.el("g", {}), w = 62;
  g.appendChild(path("M"+n1(x)+" "+n1(gy-16)+"V"+n1(py+16), C.verm, 2.2, "5 4"));
  let d = "M"+n1(x - w/2)+" "+n1(py);
  for (let i = 0; i < 4; i++)
    d += "q"+n1(w/8)+" -9 "+n1(w/4)+" 0 q"+n1(w/8)+" 9 "+n1(w/4)+" 0";
  g.appendChild(path(d, C.verm, 3));
  g.appendChild(G.text(x, py - 18, label, 19, C.verm, 700));
  return g;
}

/* ---- pCas ---------------------------------------------------------- */
const REPA = [150, 262], PCON = 292, CAS9 = [342, 458];
const PBAD = 492, GAM = [542, 618], BET = [622, 692], EXO = [696, 772];
const PLAC = 812, GPMB = [862, 1020];
/* ---- pTarget ------------------------------------------------------- */
const PMB1 = [150, 240], J231 = [330, 514];
/* ---- the chromosome and the donor ---------------------------------- */
const ASPC = [480, 650], DON = [700, 900], DON_Y = 636;

/* ---- the only list on the slide, and it has three levels -----------
 * Every biomolecule in the system gets a name and a row, sorted by what
 * kind of molecule it is.  The Parts lecture is organised on the same
 * three planes, so the room meets the frame here first. */
const LEVELS = [
  ["DNA", [["pCas", "pcas"], ["pTarget", "ptar"],
           ["donor", "donor"], ["chromosome", "chr"]]],
  ["RNA", [["sgRNA \u2715 aspC1", "g1"], ["sgRNA \u2715 pMB1", "g2"]]],
  ["protein", [["Cas9", "cas9"], ["Gam", "red"], ["Bet", "red"],
               ["Exo", "red"], ["RepA", "repa"]]]
];
const CK_X = 1070, CK_W = 330, CK_TOP = 286, CK_ROW = 32, CK_HEAD = 34, CK_GAP = 10;

const FR = [
{ s:{sc:1, step:0, pcas:1, chr:1},
  cap:"before we go on — <b>work it out</b>",
  call:"which transcription units fire, when, and what does the product then do?",
  note:"Before the next slide, an exercise, because this is the habit the whole back half of the course runs on. Here is the circuit on the left and, on the right, every molecule in the system by kind: the DNAs, the RNAs and the proteins. Four transcription units between the two plasmids, two origins, eleven molecules in total. The six conditions along the top are the six lines from the slide before, in order. Work along them. At each one, which promoters are firing? What does that put in the cell? And what does the thing it made then do? Give the room a minute on it before you walk it, because the answer is not hard and the method is the entire point.",
  desc:"A gene cartoon of pCas with its transcription units, beside a list of every molecule in the system grouped into DNA, RNA and protein, and the six growth conditions along the top." },

{ s:{sc:1, step:1, pcas:1, chr:1, cas9:1, repa:1},
  cap:"<b>Kan &#183; 30&#176;</b> &#183; the strain on its own",
  call:"a nuclease with no guide is an expensive way to do nothing",
  note:"First condition. Kanamycin at thirty degrees, which is just keeping pCas alive. The constitutive promoter fires, so Cas9 appears, and RepA is made and works because thirty degrees is permissive for it. So the cell is now full of Cas9, and Cas9 does nothing at all, because a guide is the only thing that tells it where to go and there is no guide in the cell.",
  desc:"At Kan and 30 degrees, Cas9 pops up off its constitutive promoter and RepA is working, so two boxes are ticked." },

{ s:{sc:1, step:2, pcas:1, chr:1, cas9:1, repa:1, red:1},
  cap:"<b>+ arabinose</b> &#183; and now the order starts to matter",
  call:"Gam blocks RecBCD, which is the only reason a linear donor survives",
  note:"Add arabinose and the araBAD promoter fires, so three more proteins appear: Gam, Bet and Exo. Still nothing to cut. But look at what Gam does, because this is the answer to why the induction has to come first. Gam inhibits RecBCD, and RecBCD is the nuclease that chews up linear DNA in E. coli. The donor is linear. Electroporate it into cells that have not been induced and RecBCD destroys it, the break has nothing to repair from, and every cell dies. The order is not a convention, it is the mechanism.",
  desc:"Arabinose fires the araBAD promoter and Gam, Bet and Exo pop up, ticking three more boxes." },

{ s:{sc:1, step:3, pcas:1, chr:1, cas9:1, repa:1, red:1, tardraw:1, ptar:1, g1:1, donor:1},
  cap:"<b>transform</b> &#183; two molecules arrive at once",
  call:"pTarget&#8217;s guide needs no inducer &#183; Cas9 finally has an address",
  note:"Now electroporate, and two things land. The donor, which is linear and would already be gone if we had skipped the last step. And pTarget, which replicates from its own pMB1 origin and carries its guide under a constitutive promoter, so the guide appears immediately with no induction step. And watch where it lands on the list: the guide is an RNA, so it ticks on the RNA level and nothing appears under protein. Keep an eye on those three levels, because they are how we will organise everything from here, and a part is a thing that lives on one of them. The moment pTarget is in, Cas9 has an address, and the address is on the chromosome.",
  desc:"pTarget and the linear donor arrive. pTarget's constitutive promoter makes a guide RNA, which ticks on the RNA level rather than the protein level." },

{ s:{sc:1, step:4, pcas:1, chr:1, cas9:1, repa:1, red:1, tardraw:1, ptar:1, g1:1, edited:1},
  cap:"<b>Spec &#183; Kan</b> &#183; everything happens here",
  call:"the cut, the repair, and the death of everything that failed",
  note:"And this growth is where the entire experiment happens. Cas9 plus the guide cuts the chromosome at aspC1. The break is lethal on its own, because E. coli has no non-homologous end joining. Gam has kept the donor intact, Exo chews back a strand to leave overhangs, Bet anneals them onto the homology arms, and the deletion is installed. Any cell that failed at that is dead. Notice you never selected for the edit. You selected for two plasmids, and the edit is the only way to survive what those plasmids do to you.",
  desc:"During the growth, the chromosome is cut and repaired off the donor, the donor is consumed, and the chromosome now reads delta-aspC1." },

{ s:{sc:1, step:5, pcas:1, chr:1, cas9:1, repa:1, tardraw:1, g2:1, edited:1},
  cap:"<b>+ IPTG</b> &#183; the plasmid you built removes itself",
  call:"pCas has been carrying a guide against pMB1 the whole time",
  note:"Now IPTG. The lac promoter on pCas fires, and it has been sitting there the whole time carrying a guide aimed at the pMB1 origin. pTarget has a pMB1 origin. So Cas9, which is still present, cuts pTarget, and pTarget is gone and the guide against aspC1 goes with it. pCas survives because its origin is repA101, not pMB1. That is a deliberate design choice and you can read it straight off the cartoon: the one origin the guide can reach is the one you want to lose. Also note the arabinose is gone by now, so lambda red has switched off.",
  desc:"IPTG fires the lac promoter, making a guide against pMB1, and pTarget is destroyed. Lambda-Red is off again because the arabinose is gone." },

{ s:{sc:1, step:6, chr:1, edited:1},
  cap:"<b>42&#176;</b> &#183; and the last of it goes",
  call:"RepA is a protein, and 42&#176; is what it cannot do",
  note:"And finally forty-two degrees. This one is worth saying out loud because people treat it as magic: the temperature does not melt the plasmid, it denatures a protein. RepA101 is the replication initiator, the ts allele stops working at forty-two, pCas cannot replicate, and it is diluted out over a few divisions. And look at the list: eleven molecules, and exactly one of them is still there. Both plasmids are gone, both guides are gone, every protein is gone, and what is left is a strain whose chromosome is missing aspC1 and which carries nothing else at all.",
  desc:"At 42 degrees the temperature-sensitive RepA fails and pCas is lost. Of the eleven molecules listed, only the chromosome remains." },

{ s:{sc:1, step:6, chr:1, edited:1, pt:1},
  cap:"none of that needed a mechanism you did not already have",
  call:"and the next slide is what happens when you skip it",
  note:"Look back at what we just did. We needed a picture of the promoters, a list of every molecule in the cell sorted by whether it is DNA, RNA or protein, and the conditions in order. Everything else followed from those three things. That is the habit, and it is the one thing to take from this lecture if you take nothing else, because from here on you are not designing DNA in a tube, you are predicting what a cell will do with the DNA you gave it. And the next slide is what happens when you skip it: an edit that is exactly right, in a cell that behaves as though you had deleted a gene you never touched.",
  desc:"The point of the exercise: the whole procedure followed from the circuit, the proteins it makes, and the order of the conditions." }
];

window.Deck.sequence("trace", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v, f){
    const g = G.el("g", {}), st = f.s || {}, step = st.step || 0;

    /* ---- the six conditions --------------------------------------- */
    const t = grp(v.sc);
    STEPS.forEach(function(lab, i){
      const x = TX0 + TW*i, on = (i + 1) === step;
      t.appendChild(G.el("rect", {x:n1(x), y:TY, width:n1(TW - 12), height:TH,
        rx:7, fill:on ? C.verm : C.muted, "fill-opacity":on ? ".14" : ".05",
        stroke:on ? C.verm : C.muted, "stroke-width":on ? 3 : 1.8}));
      t.appendChild(G.text(x + (TW - 12)/2, TY + 32, lab, 22,
        on ? C.verm : C.muted, on ? 700 : 400));
    });
    g.appendChild(t);

    /* ---- pCas ------------------------------------------------------ */
    if (v.pcas > 0.02){
      const p = grp(v.pcas);
      p.appendChild(backbone(CAS_Y, 150, 1020,
        [REPA, CAS9, GAM, BET, EXO, GPMB], C.blue));
      p.appendChild(gene(REPA[0], REPA[1], CAS_Y, "repA101ts", C.blue, 17));
      p.appendChild(promoter(PCON, CAS_Y, C.blue));
      p.appendChild(gene(CAS9[0], CAS9[1], CAS_Y, "cas9", C.blue));
      p.appendChild(promoter(PBAD, CAS_Y, C.blue));
      p.appendChild(gene(GAM[0], GAM[1], CAS_Y, "gam", C.blue));
      p.appendChild(gene(BET[0], BET[1], CAS_Y, "bet", C.blue));
      p.appendChild(gene(EXO[0], EXO[1], CAS_Y, "exo", C.blue));
      p.appendChild(promoter(PLAC, CAS_Y, C.blue));
      p.appendChild(gene(GPMB[0], GPMB[1], CAS_Y, "sgRNA ✕ pMB1", C.blue, 19));
      p.appendChild(G.text(150, CAS_Y + 46, "pCas", 22, C.muted, 400, "start"));
      p.appendChild(G.text(PBAD + 6, CAS_Y + 46, "araBAD", 18, C.muted, 400, "start"));
      p.appendChild(G.text(PLAC + 6, CAS_Y + 46, "lac", 18, C.muted, 400, "start"));
      g.appendChild(p);
    }
    if (v.repa > 0.02)
      g.appendChild(grp(v.repa)).appendChild(
        protein((REPA[0] + REPA[1])/2, CAS_Y, CAS_P, "RepA"));
    if (v.cas9 > 0.02)
      g.appendChild(grp(v.cas9)).appendChild(
        protein((CAS9[0] + CAS9[1])/2, CAS_Y, CAS_P, "Cas9"));
    if (v.red > 0.02){
      const r = grp(v.red);
      [[GAM, "Gam"], [BET, "Bet"], [EXO, "Exo"]].forEach(function(q){
        r.appendChild(protein((q[0][0] + q[0][1])/2, CAS_Y, CAS_P, q[1], 66));
      });
      g.appendChild(r);
    }
    if (v.g2 > 0.02)
      g.appendChild(grp(v.g2)).appendChild(
        rna((GPMB[0] + GPMB[1])/2, CAS_Y, CAS_P, "guide"));

    /* ---- pTarget --------------------------------------------------- */
    if (v.tardraw > 0.02){
      const p = grp(v.tardraw);
      p.appendChild(backbone(TAR_Y, 150, 660, [PMB1, J231], C.blue));
      p.appendChild(ori(PMB1[0], PMB1[1], TAR_Y, "pMB1", C.blue));
      p.appendChild(promoter(J231[0] - 46, TAR_Y, C.blue));
      p.appendChild(gene(J231[0], J231[1], TAR_Y, "sgRNA ✕ aspC1", C.blue, 19));
      p.appendChild(G.text(150, TAR_Y + 46, "pTarget", 22, C.muted, 400, "start"));
      p.appendChild(G.text(J231[0] - 46, TAR_Y + 46, "J23119", 18, C.muted, 400, "start"));
      if (step === 5)
        p.appendChild(path("M"+n1(PMB1[0] + 16)+" "+n1(TAR_Y - 26)+
          "L"+n1(PMB1[1] - 16)+" "+n1(TAR_Y + 26), C.verm, 4));
      g.appendChild(p);
    }
    if (v.g1 > 0.02)
      g.appendChild(grp(v.g1)).appendChild(
        rna((J231[0] + J231[1])/2, TAR_Y, TAR_P, "guide"));

    /* ---- the donor, which is linear and therefore in danger -------- */
    if (v.donor > 0.02){
      const d = grp(v.donor);
      d.appendChild(G.el("rect", {x:DON[0], y:n1(DON_Y - 13), width:n1(DON[1]-DON[0]),
        height:26, rx:4, fill:C.verm, "fill-opacity":".14", stroke:C.verm,
        "stroke-width":2.4}));
      d.appendChild(path("M"+n1((DON[0]+DON[1])/2)+" "+n1(DON_Y - 13)+
        "V"+n1(DON_Y + 13), C.verm, 2.2, "5 4"));
      d.appendChild(G.text(DON[0] + 48, DON_Y + 7, "up", 19, C.verm, 700));
      d.appendChild(G.text(DON[1] - 48, DON_Y + 7, "dn", 19, C.verm, 700));
      d.appendChild(G.text(DON[1] + 14, DON_Y + 7, "donor · linear", 19,
        C.muted, 400, "start"));
      g.appendChild(d);
    }

    /* ---- the chromosome, which is the only thing that matters ------ */
    const ch = grp(v.sc), done = (st.edited || 0) > 0.5;
    ch.appendChild(backbone(CHR_Y, 150, 1020, done ? [] : [ASPC], C.ink));
    if (!done) ch.appendChild(gene(ASPC[0], ASPC[1], CHR_Y, "aspC1", C.ink, 22));
    else {
      ch.appendChild(path("M"+n1(ASPC[0] + 60)+" "+n1(CHR_Y - 16)+
        "V"+n1(CHR_Y + 16), C.verm, 3));
      ch.appendChild(G.text(ASPC[0] + 60, CHR_Y - 26, "ΔaspC1", 22, C.verm, 700));
    }
    ch.appendChild(G.text(150, CHR_Y + 46, "chromosome", 22, C.muted, 400, "start"));
    g.appendChild(ch);

    /* ---- every molecule in the system, by kind -------------------- */
    const k = grp(v.sc);
    let cy = CK_TOP;
    LEVELS.forEach(function(lv){
      k.appendChild(G.text(CK_X, cy, lv[0], 18, C.muted, 700, "start"));
      k.appendChild(path("M"+CK_X+" "+n1(cy + 10)+"H"+n1(CK_X + CK_W), C.muted, 1.4));
      cy += CK_HEAD;
      lv[1].forEach(function(row){
        const on = (v[row[1]] || 0) > 0.5, y = cy;
        k.appendChild(G.el("rect", {x:CK_X, y:n1(y - 17), width:22, height:22, rx:5,
          fill:on ? C.verm : "none", "fill-opacity":on ? ".85" : "0",
          stroke:on ? C.verm : C.muted, "stroke-width":on ? 2.6 : 1.8}));
        if (on) k.appendChild(path("M"+n1(CK_X + 5)+" "+n1(y - 6)+
          "l5 6l7 -10", C.paper, 2.6));
        k.appendChild(G.text(CK_X + 34, y, row[0], 21, on ? C.verm : C.muted,
          on ? 700 : 400, "start"));
        cy += CK_ROW;
      });
      cy += CK_GAP;
    });
    g.appendChild(k);

    if (v.pt > 0.02){
      const p = grp(v.pt);
      ["what is on?", "what does it make?", "what does that then do?"]
        .forEach(function(q, i){
          p.appendChild(path("M240 "+n1(348 + i*72)+"V"+n1(388 + i*72), C.verm, 4));
          p.appendChild(G.text(266, 380 + i*72, q, 33, C.verm, 700, "start"));
        });
      g.appendChild(p);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
