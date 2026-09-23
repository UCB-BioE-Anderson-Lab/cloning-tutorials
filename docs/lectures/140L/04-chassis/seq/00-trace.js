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

/* ---- the grid ------------------------------------------------------ *
 * DNA to RNA to protein is a hierarchy, so it is drawn as one: the gene
 * cartoons ARE the DNA column, each transcription unit gets a row, and
 * its RNA and whatever that RNA makes sit to the right of it.  Two rows
 * carry the whole point of the frame: gam-bet-exo is one mRNA making
 * three proteins, and the guides are RNAs that make none.
 * ------------------------------------------------------------------ */
const RY0 = 314, RDY = 61;
const LBL = 214, RULE = 226, DNA0 = 246, TX_A = 664, RNA_C = 856, TX_B = 1024, PRO0 = 1070;
const ry = i => RY0 + RDY*i;

const ROWS = [
  {mol:"pcas",  key:"repa",  rna:"repA mRNA",         prot:["RepA"]},
  {mol:"pcas",  key:"cas9",  rna:"cas9 mRNA",         prot:["Cas9"]},
  {mol:"pcas",  key:"red",   rna:"gam-bet-exo mRNA",  prot:["Gam", "Bet", "Exo"]},
  {mol:"pcas",  key:"g2",    rna:"sgRNA ✕ pMB1", prot:[]},
  {mol:"ptar",  key:"pmb1",  rna:null,                prot:[]},
  {mol:"ptar",  key:"g1",    rna:"sgRNA ✕ aspC1",prot:[]},
  {mol:"donor", key:"donor", rna:null,                prot:[]},
  {mol:"chr",   key:"aspc",  rna:"aspC1 mRNA",        prot:["AspC1"]}
];
const MOLS = [["pCas", 0, 3], ["pTarget", 4, 5], ["donor", 6, 6],
              ["chromosome", 7, 7]];

/* a promoter: the bent arrow every genetics figure uses */
function promoter(x, y, col){
  const g = G.el("g", {});
  g.appendChild(path("M"+n1(x)+" "+n1(y+12)+"V"+n1(y-20)+"H"+n1(x+26), col, 2.6));
  g.appendChild(path("M"+n1(x+18)+" "+n1(y-27)+"L"+n1(x+28)+" "+n1(y-20)+
    "L"+n1(x+18)+" "+n1(y-13), col, 2.6));
  return g;
}
/* a gene, as a block arrow pointing the way it is read */
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
/* an origin, which is not read and so is not an arrow */
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
/* an RNA, one wave, so it can never be mistaken for a protein */
function wave(cx, y, col){
  const w = 96;
  let d = "M"+n1(cx - w/2)+" "+n1(y);
  for (let i = 0; i < 4; i++)
    d += "q"+n1(w/8)+" -8 "+n1(w/4)+" 0 q"+n1(w/8)+" 8 "+n1(w/4)+" 0";
  return path(d, col, 3);
}
/* a protein, which is a blob because it is not a sequence any more */
function blob(cx, y, label, col, on){
  const g = G.el("g", {}), w = label.length > 4 ? 96 : 76;
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
{ s:{sc:1, step:0, pcas:1, chr:1, aspc:1},
  cap:"before we go on — <b>work it out</b>",
  call:"which transcription units fire, when, and what does the product then do?",
  note:"Here is that same experiment as a circuit. It reads left to right, the way the cell does. On the left the DNAs, broken out into the transcription units on each one. In the middle what each unit gets read into. On the right what that RNA makes. Sixteen molecules in all, and two rows worth stopping on: gam, bet and exo are one mRNA making three proteins, and the two guides are RNAs that make nothing. So work along them. At each condition, which promoters are firing? What does that put in the cell? And what does the thing it made then do? Let them have a go at it before you walk it.",
  desc:"A grid running left to right from DNA to RNA to protein: each plasmid broken into its transcription units, the RNA each one is read into, and the proteins those RNAs make. The six growth conditions run along the top." },

{ s:{sc:1, step:1, pcas:1, chr:1, aspc:1, cas9:1, repa:1},
  cap:"<b>Kan &#183; 30&#176;</b> &#183; the strain on its own",
  call:"a nuclease with no guide is an expensive way to do nothing",
  note:"First condition. Kanamycin at thirty degrees, which is just keeping pCas alive. The constitutive promoter fires, so Cas9 appears, and RepA is made and works because thirty degrees is permissive for it. So the cell is now full of Cas9, and Cas9 does nothing at all, because a guide is the only thing that tells it where to go and there is no guide in the cell.",
  desc:"At Kan and 30 degrees, Cas9 pops up off its constitutive promoter and RepA is working, so two boxes are ticked." },

{ s:{sc:1, step:2, pcas:1, chr:1, aspc:1, cas9:1, repa:1, red:1},
  cap:"<b>+ arabinose</b> &#183; and now the order starts to matter",
  call:"Gam blocks RecBCD, which is the only reason a linear donor survives",
  note:"Add arabinose and the araBAD promoter fires, so three more proteins appear: Gam, Bet and Exo. Still nothing to cut. But look at what Gam does, because this is the answer to why the induction has to come first. Gam inhibits RecBCD, and RecBCD is the nuclease that chews up linear DNA in E. coli. The donor is linear. Electroporate it into cells that have not been induced and RecBCD destroys it, the break has nothing to repair from, and every cell dies. The order is not a convention, it is the mechanism.",
  desc:"Arabinose fires the araBAD promoter and Gam, Bet and Exo pop up, ticking three more boxes." },

{ s:{sc:1, step:3, pcas:1, chr:1, aspc:1, cas9:1, repa:1, red:1, ptar:1, pmb1:1, g1:1, donor:1},
  cap:"<b>transform</b> &#183; two molecules arrive at once",
  call:"pTarget&#8217;s guide needs no inducer &#183; Cas9 finally has an address",
  note:"Now electroporate, and two things land. The donor, which is linear and would already be gone if we had skipped the last step. And pTarget, which replicates from its own pMB1 origin and carries its guide under a constitutive promoter, so the guide appears immediately with no induction step. And watch where it lands on the list: the guide is an RNA, so it ticks on the RNA level and nothing appears under protein. Keep an eye on those three levels, because they are how we will organise everything from here, and a part is a thing that lives on one of them. The moment pTarget is in, Cas9 has an address, and the address is on the chromosome.",
  desc:"pTarget and the linear donor arrive. pTarget's constitutive promoter makes a guide RNA, which ticks on the RNA level rather than the protein level." },

{ s:{sc:1, step:4, pcas:1, chr:1, cas9:1, repa:1, red:1, ptar:1, pmb1:1, g1:1, edited:1},
  cap:"<b>Spec &#183; Kan</b> &#183; everything happens here",
  call:"the cut, the repair, and the death of everything that failed",
  note:"And this growth is where the entire experiment happens. Cas9 plus the guide cuts the chromosome at aspC1. The break is lethal on its own, because E. coli has no non-homologous end joining. Gam has kept the donor intact, Exo chews back a strand to leave overhangs, Bet anneals them onto the homology arms, and the deletion is installed. Any cell that failed at that is dead. Notice you never selected for the edit. You selected for two plasmids, and the edit is the only way to survive what those plasmids do to you.",
  desc:"During the growth, the chromosome is cut and repaired off the donor, the donor is consumed, and the chromosome now reads delta-aspC1." },

{ s:{sc:1, step:5, pcas:1, chr:1, cas9:1, repa:1, ptar:1, g2:1, edited:1},
  cap:"<b>+ IPTG</b> &#183; the plasmid you built removes itself",
  call:"pCas has been carrying a guide against pMB1 the whole time",
  note:"Now IPTG. The lac promoter on pCas fires, and it has been sitting there the whole time carrying a guide aimed at the pMB1 origin. pTarget has a pMB1 origin. So Cas9, which is still present, cuts pTarget, and pTarget is gone and the guide against aspC1 goes with it. pCas survives because its origin is repA101, not pMB1. That is a deliberate design choice and you can read it straight off the cartoon: the one origin the guide can reach is the one you want to lose. Also note the arabinose is gone by now, so lambda red has switched off.",
  desc:"IPTG fires the lac promoter, making a guide against pMB1, and pTarget is destroyed. Lambda-Red is off again because the arabinose is gone." },

{ s:{sc:1, step:6, chr:1, edited:1},
  cap:"<b>42&#176;</b> &#183; and the last of it goes",
  call:"RepA is a protein, and 42&#176; is what it cannot do",
  note:"And finally forty-two degrees. This one is worth saying out loud because people treat it as magic: the temperature does not melt the plasmid, it denatures a protein. RepA101 is the replication initiator, the ts allele stops working at forty-two, pCas cannot replicate, and it is diluted out over a few divisions. And look at the grid: sixteen molecules on it, and exactly one is still there. Both plasmids are gone, both guides are gone, every protein is gone, and what is left is a strain whose chromosome is missing aspC1 and which carries nothing else at all.",
  desc:"At 42 degrees the temperature-sensitive RepA fails and pCas is lost. Of the sixteen molecules on the grid, only the chromosome remains." },

{ s:{sc:1, step:6, chr:1, edited:1, pt:1},
  cap:"none of that needed a mechanism you did not already have",
  call:"and the next slide is what happens when you skip it",
  note:"Look back at what we just did. We needed a picture of the promoters, a list of every molecule in the cell sorted by whether it is DNA, RNA or protein, and the conditions in order. Everything else followed from those three things. From here on you are not designing DNA in a tube, you are predicting what a cell will do with the DNA you gave it, and this is how that is done. And the next slide is what happens when you skip it: an edit that is exactly right, in a cell that behaves as though you had deleted a gene you never touched.",
  desc:"The point of the exercise: the whole procedure followed from the circuit, the proteins it makes, and the order of the conditions." }
];

window.Deck.sequence("trace", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v, f){
    const g = G.el("g", {}), st = f.s || {}, step = st.step || 0;
    const dim = 1 - 0.78*cl(v.pt || 0, 0, 1);

    /* ---- the six conditions, which are the last slide's six lines -- */
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

    const grid = grp(dim*(v.sc || 0));

    /* ---- the three planes, named once ------------------------------ */
    [[DNA0 + 130, "DNA"], [RNA_C, "RNA"], [PRO0 + 150, "protein"]]
      .forEach(function(h, i){
        grid.appendChild(G.text(h[0], 272, h[1], 20, C.muted, 700));
        if (i) grid.appendChild(arrow(i === 1 ? TX_A : TX_B,
          (i === 1 ? TX_A : TX_B) + 40, 266, C.muted));
      });

    /* ---- which molecule each row belongs to ------------------------ */
    MOLS.forEach(function(m){
      const on = (v[m[0] === "pCas" ? "pcas" : m[0] === "pTarget" ? "ptar" :
                    m[0] === "donor" ? "donor" : "chr"] || 0) > 0.5;
      const y0 = ry(m[1]) - 22, y1 = ry(m[2]) + 22, col = on ? C.blue : C.muted;
      grid.appendChild(path("M"+n1(RULE)+" "+n1(y0)+"V"+n1(y1), col, 2.4));
      grid.appendChild(G.text(LBL, (y0 + y1)/2 + 7, m[0], 20, col, 700, "end"));
    });

    /* ---- a row per transcription unit ------------------------------ */
    ROWS.forEach(function(r, i){
      const y = ry(i), on = (v[r.key] || 0) > 0.5;
      const molOn = (v[r.mol] || 0) > 0.5;
      const dcol = molOn ? C.blue : C.muted;

      /* the DNA itself */
      if (r.key === "repa"){
        grid.appendChild(seg(DNA0, 396, y, dcol));
        grid.appendChild(gene(DNA0 + 4, 390, y, "repA101ts", dcol, 16));
      } else if (r.key === "cas9"){
        grid.appendChild(seg(DNA0, 440, y, dcol));
        grid.appendChild(promoter(DNA0 + 6, y, dcol));
        grid.appendChild(gene(DNA0 + 62, 434, y, "cas9", dcol));
      } else if (r.key === "red"){
        grid.appendChild(seg(DNA0, 536, y, dcol));
        grid.appendChild(promoter(DNA0 + 6, y, dcol));
        grid.appendChild(gene(DNA0 + 62, 378, y, "gam", dcol, 16));
        grid.appendChild(gene(382, 456, y, "bet", dcol, 16));
        grid.appendChild(gene(460, 530, y, "exo", dcol, 16));
      } else if (r.key === "g2"){
        grid.appendChild(seg(DNA0, 544, y, dcol));
        grid.appendChild(promoter(DNA0 + 6, y, dcol));
        grid.appendChild(gene(DNA0 + 62, 538, y, "sgRNA ✕ pMB1", dcol, 16));
      } else if (r.key === "pmb1"){
        grid.appendChild(seg(DNA0, 390, y, dcol));
        grid.appendChild(ori(DNA0 + 4, 384, y, "pMB1 origin", dcol));
        if (step === 5) grid.appendChild(path("M"+n1(DNA0 + 40)+" "+n1(y - 24)+
          "L"+n1(DNA0 + 140)+" "+n1(y + 24), C.verm, 4));
      } else if (r.key === "g1"){
        grid.appendChild(seg(DNA0, 550, y, dcol));
        grid.appendChild(promoter(DNA0 + 6, y, dcol));
        grid.appendChild(gene(DNA0 + 62, 544, y, "sgRNA ✕ aspC1", dcol, 16));
      } else if (r.key === "donor"){
        grid.appendChild(G.el("rect", {x:DNA0, y:n1(y - 13), width:200, height:26,
          rx:4, fill:dcol, "fill-opacity":".14", stroke:dcol, "stroke-width":2.2}));
        grid.appendChild(path("M"+n1(DNA0 + 100)+" "+n1(y - 13)+"V"+n1(y + 13),
          dcol, 2, "5 4"));
        grid.appendChild(G.text(DNA0 + 50, y + 6, "up", 17, dcol, 700));
        grid.appendChild(G.text(DNA0 + 150, y + 6, "dn", 17, dcol, 700));
      } else {
        const done = (st.edited || 0) > 0.5;
        grid.appendChild(seg(DNA0 - 10, 600, y, C.ink));
        if (done){
          grid.appendChild(path("M"+n1(DNA0 + 130)+" "+n1(y - 14)+"V"+n1(y + 14),
            C.verm, 3));
          grid.appendChild(G.text(DNA0 + 130, y - 22, "ΔaspC1", 18, C.verm, 700));
        } else {
          grid.appendChild(promoter(DNA0 + 4, y, C.ink));
          grid.appendChild(gene(DNA0 + 60, 400, y, "aspC1", C.ink));
        }
      }

      /* the RNA it is read into */
      if (r.rna){
        grid.appendChild(arrow(TX_A, TX_A + 44, y, on ? C.verm : C.muted));
        grid.appendChild(wave(RNA_C, y - 6, on ? C.verm : C.muted));
        grid.appendChild(G.text(RNA_C, y + 22, r.rna, 17,
          on ? C.verm : C.muted, on ? 700 : 400));
      } else {
        grid.appendChild(G.text(RNA_C, y + 6, "—", 24, C.muted, 400));
      }

      /* and whatever that RNA makes */
      if (r.prot.length){
        grid.appendChild(arrow(TX_B, TX_B + 44, y, on ? C.verm : C.muted));
        r.prot.forEach(function(nm, k){
          grid.appendChild(blob(PRO0 + 56 + k*112, y, nm,
            on ? C.verm : C.muted, on));
        });
      } else {
        grid.appendChild(G.text(PRO0 + 56, y + 6, "—", 24, C.muted, 400));
      }
    });
    g.appendChild(grid);

    /* ---- the habit, named ------------------------------------------ */
    if (v.pt > 0.02){
      const p = grp(v.pt);
      ["what is on?", "what does it make?", "what does that then do?"]
        .forEach(function(q, i){
          /* the grid is still there behind these, faint; without paper
             the waves and the mRNA names read straight through them */
          const w = q.length*21 + 48, y = 400 + i*82;
          p.appendChild(G.el("rect", {x:n1(800 - w/2), y:n1(y - 36), width:n1(w),
            height:56, fill:C.paper}));
          p.appendChild(G.text(800, y, q, 40, C.verm, 700));
        });
      g.appendChild(p);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
