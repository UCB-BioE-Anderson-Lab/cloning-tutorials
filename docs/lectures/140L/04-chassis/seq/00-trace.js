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
 * The ticker across the top is deliberately the previous slide's own
 * steps, same order, same words.
 *
 * ONE COLOUR AXIS, WHICH IS STATE.  The first version coloured the DNA
 * by which molecule it was (pCas blue, the rest grey) and the RNA and
 * protein by whether they existed (vermillion / grey), so grey meant
 * "not in the cell" and "promoter off" at the same time and blue meant
 * nothing at all.  Worse, pCas was drawn blue in the opening frame, so
 * a strain that has not been transformed yet looked like it already
 * carried the plasmid.  Colour now encodes state and only state:
 *
 *   ghost (GHOST opacity, muted)  not in the cell yet, or gone
 *   muted, full opacity           in the cell, promoter not firing
 *   blue                          firing, and its product is present
 *   vermillion                    the edit -- the one thing that changed
 *
 * Presence and firing are separate inputs, so a molecule can sit in the
 * cell doing nothing (lambda red before arabinose) and that reads
 * differently from not being there at all.  The sequence now starts on
 * wild-type Mach1 with only the chromosome, and each DNA fades up as it
 * is actually delivered.
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
const STEPS = ["Mach1", "+ pCas", "+ ara", "transform",
               "recover", "Spec · Kan", "+ IPTG", "42°"];
const TX0 = 110, TW = 172, TY = 190, TH = 48;
/* how far down an absent molecule goes.  Low enough to read as "not
   there", high enough that the parts list is still legible in the
   opening frame, where nothing but the chromosome is in the cell. */
const GHOST = 0.2;

/* ---- the grid ------------------------------------------------------ *
 * DNA to RNA to protein is a hierarchy, so it is drawn as one: the gene
 * cartoons ARE the DNA column, each transcription unit gets a row, and
 * its RNA and whatever that RNA makes sit to the right of it.  Two rows
 * carry the whole point of the frame: gam-bet-exo is one mRNA making
 * three proteins, and the guides are RNAs that make none.
 * ------------------------------------------------------------------ */
const RY0 = 320, RDY = 72;
const LBL = 214, RULE = 226, DNA0 = 246, TX_A = 664, RNA_C = 856, TX_B = 1024, PRO0 = 1070;
const ry = i => RY0 + RDY*i;

const ROWS = [
  {mol:"pcas",  key:"repa",  rna:"repA",         prot:["RepA"]},
  {mol:"pcas",  key:"cas9",  rna:"cas9",         prot:["Cas9"]},
  {mol:"pcas",  key:"red",   rna:"gam-bet-exo",  prot:["Gam", "Bet", "Exo"]},
  {mol:"pcas",  key:"g2",    rna:"sgRNA ✕ pMB1", prot:[]},
  {mol:"ptar",  key:"g1",    rna:"sgRNA ✕ aspC1",prot:[]},
  {mol:"donor", key:"donor", rna:null,                prot:[]},
  {mol:"chr",   key:"aspc",  rna:"aspC1",             prot:["AspC1"]}
];
const MOLS = [["pCas", 0, 3], ["pTarget", 4, 4], ["donor", 5, 5],
              ["chromosome", 6, 6]];

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
  const w = 76;
  let d = "M"+n1(cx - w/2)+" "+n1(y);
  for (let i = 0; i < 4; i++)
    d += "q"+n1(w/16)+" -7 "+n1(w/8)+" 0 q"+n1(w/16)+" 7 "+n1(w/8)+" 0";
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
{ s:{sc:1, step:1, chr:1, aspc:1},
  cap:"before we go on &#8212; <b>work it out</b>",
  call:"which transcription units fire, when, and what does the product then do?",
  note:"Here is that same experiment as a circuit. It reads left to right, the way the cell does. On the left the DNAs, broken into the transcription units on each one. In the middle what each unit is read into. On the right what that RNA makes. Start by looking at what is actually in the cell right now, which is one thing: the chromosome. Everything else on this grid is faded because it has not been delivered yet. That is the parts list, not the contents of the cell. Two rows are worth stopping on before you start: gam, bet and exo are one mRNA making three proteins, and the two guides are RNAs that make no protein at all. Now work along the conditions. At each one, which promoters are firing? What does that put in the cell? And what does the thing it made then do?",
  desc:"A grid running left to right from DNA to RNA to protein, with every molecule in the experiment listed. Only the chromosome is solid; every other DNA is faded out because it is not in the cell yet. The eight steps of the procedure run along the top." },

{ s:{sc:1, step:2, chr:1, aspc:1, pcas:1, repa:1, cas9:1},
  cap:"<b>+ pCas</b> &#183; kanamycin at 30&#176; keeps it",
  call:"<b>cas9</b> has no inducer &#183; it is on from the moment the plasmid lands",
  note:"Transform pCas in and hold it with kanamycin at thirty degrees. Now look at which of its four units fire. The cas9 promoter is the native one and it is constitutive, so Cas9 appears immediately and stays for the rest of the experiment. That is the thing that gets misread at the IPTG step. RepA is made too, and it works, because thirty degrees is permissive for the temperature-sensitive allele. The other two units are dark: lambda red needs arabinose and there is none, and the anti-pMB1 guide needs IPTG and there is none. So the cell is now full of Cas9, and Cas9 does nothing whatsoever, because a guide is the only thing that tells it where to go and there is no guide in the cell.",
  desc:"pCas arrives. Its constitutive cas9 promoter fires so Cas9 is present, and RepA is made and works at 30 degrees. The lambda-red and anti-pMB1 units stay dark for want of their inducers." },

{ s:{sc:1, step:3, chr:1, aspc:1, pcas:1, repa:1, cas9:1, red:1},
  cap:"<b>+ arabinose</b> &#183; and now the order starts to matter",
  call:"Gam blocks RecBCD, which is the only reason a linear donor survives",
  note:"Add arabinose and the araBAD promoter fires, so three more proteins appear from one mRNA: Gam, Bet and Exo. Still nothing to cut. But look at what Gam does, because this is the answer to why the induction has to come before the electroporation and not after. Gam inhibits RecBCD, and RecBCD is the nuclease that chews up linear DNA in E. coli. The donor is linear. Electroporate it into cells that have not been induced and RecBCD destroys it, the break then has nothing to repair from, and every cell dies. The order is not a convention, it is the mechanism.",
  desc:"Arabinose fires the araBAD promoter and Gam, Bet and Exo appear from a single mRNA." },

{ s:{sc:1, step:4, chr:1, aspc:1, pcas:1, repa:1, cas9:1, red:1, ptar:1, g1:1, donor:1},
  cap:"<b>transform</b> &#183; two molecules arrive at once",
  call:"pTarget&#8217;s guide needs no inducer either &#183; Cas9 finally has an address",
  note:"Now electroporate, and two things land. The donor, which is linear and would already be gone if we had skipped the last step. And pTarget, which replicates off its own pMB1 origin and carries its guide under a constitutive promoter, so that guide appears at once with no induction. Watch which level it lands on: the guide is an RNA, so it lights up in the RNA column and nothing at all appears under protein. Keep an eye on those three levels, because they are how we will organise everything from here, and a part is a thing that lives on one of them. The moment pTarget is in, Cas9 has an address, and the address is on the chromosome.",
  desc:"pTarget and the linear donor arrive. pTarget's constitutive promoter makes a guide RNA, which appears on the RNA level and makes no protein." },

{ s:{sc:1, step:5, chr:1, edited:1, pcas:1, repa:1, cas9:1, red:1, ptar:1, g1:1},
  cap:"<b>recover</b> &#183; nothing selecting, and everything happening",
  call:"the cut, the repair, and the death of everything that failed",
  note:"This is the outgrowth straight after the pulse, with no antibiotic on yet, and it is where the entire experiment happens. Cas9 plus the guide cuts the chromosome at aspC1. That break is lethal on its own, because E. coli has no non-homologous end joining and cannot simply stick it back together. Gam has kept the donor intact, Exo chews back a strand to leave single-stranded overhangs, Bet anneals them onto the homology arms, and the deletion is installed. Any cell that failed at any of that is dead. And watch the grid: the aspC1 row goes dark, because the gene it was reading is no longer there, and the donor goes with it because it has been consumed.",
  desc:"During the non-selective recovery the chromosome is cut and repaired off the donor. The donor is consumed, the aspC1 row goes dark, and the chromosome now reads delta-aspC1." },

{ s:{sc:1, step:6, chr:1, edited:1, pcas:1, repa:1, cas9:1, red:1, ptar:1, g1:1},
  cap:"<b>Spec &#183; Kan</b> &#183; and nothing new fires",
  call:"this selects for the <b>plasmids</b> &#183; it never selected for the edit",
  note:"Plate on spectinomycin and kanamycin. Notice the grid does not change at all: no promoter turns on or off here, because an antibiotic is not an inducer. So ask what this step is actually doing. Spectinomycin selects for pTarget and kanamycin selects for pCas, and that is all it does. It does not select for the edit. The reason your colonies are mostly edited is not selection, it is that the unedited ones died of an unrepaired double-strand break back in the recovery. That is a completely different argument, and it is why you still have to screen.",
  desc:"On spectinomycin and kanamycin nothing on the grid changes, because an antibiotic is not an inducer: the step selects for the two plasmids, not for the edit." },

{ s:{sc:1, step:7, chr:1, edited:1, pcas:1, repa:1, cas9:1, g2:1},
  cap:"<b>+ IPTG</b> &#183; the plasmid you built removes itself",
  call:"no arabinose needed &#8212; <b>Cas9 never left</b>, and the guide is the missing half",
  note:"Now IPTG. The lac promoter on pCas fires, and it has been sitting there the whole time carrying a guide aimed at the pMB1 origin. pTarget has a pMB1 origin, so it is cut, and it is gone, and the guide against aspC1 goes with it. And the obvious question here is whether you need arabinose on as well for this to work. No, and the grid tells you why. Cutting needs two things, Cas9 and a guide. Cas9 is constitutive, so it has been present since the first step and it never needed an inducer at all. The guide is the only half that was missing, and IPTG supplies it. Lambda red is irrelevant here, because you are destroying this plasmid rather than repairing anything, and by now the arabinose is long gone anyway, so those three proteins have diluted out. And pCas survives its own nuclease because its origin is repA101, not pMB1. You can read that design straight off the cartoon: the one origin the guide can reach is the one you wanted to lose.",
  desc:"IPTG fires the lac promoter on pCas, making a guide against pMB1, and pTarget is destroyed. Cas9 is still present because it was never inducible, so no arabinose is needed here. Lambda-Red has diluted out." },

{ s:{sc:1, step:8, chr:1, edited:1},
  cap:"<b>42&#176;</b> &#183; and the last of it goes",
  call:"RepA is a protein, and 42&#176; is what it cannot do",
  note:"And finally forty-two degrees. This one gets treated as magic, and it is not: the temperature does not melt the plasmid, it denatures a protein. RepA101 is the replication initiator, the temperature-sensitive allele stops folding at forty-two, pCas cannot replicate, and it is diluted out over a few divisions. Now look at the whole grid. Sixteen molecules on it, and exactly one is left. Both plasmids gone, both guides gone, every protein gone, the donor consumed, and what remains is a strain whose chromosome is missing aspC1 and which carries nothing else at all.",
  desc:"At 42 degrees the temperature-sensitive RepA fails and pCas is lost. Of everything on the grid, only the edited chromosome remains." },

{ s:{sc:1, step:8, chr:1, edited:1, pt:1},
  cap:"none of that needed a mechanism you did not already have",
  call:"and the next slide is what happens when you skip it",
  note:"Look back at what we just did. We needed a picture of the promoters, a list of every molecule in the cell sorted by whether it is DNA, RNA or protein, and the conditions in order. Everything else followed from those three things, including the two questions that catch people out: why the arabinose has to come before the electroporation, and why the IPTG step does not need it. From here on you are not designing DNA in a tube, you are predicting what a cell will do with the DNA you gave it, and this is how that is done. And the next slide is what happens when you skip it: an edit that is exactly right, in a cell that behaves as though you had deleted a gene you never touched.",
  desc:"The point of the exercise: the whole procedure followed from the circuit, the molecules it makes on three levels, and the order of the conditions." }
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
    [[DNA0 + 160, "DNA"], [RNA_C + 40, "RNA"], [PRO0 + 150, "protein"]]
      .forEach(function(h){ grid.appendChild(G.text(h[0], 276, h[1], 20,
        C.muted, 700)); });

    /* ---- which molecule each row belongs to ------------------------ */
    MOLS.forEach(function(m){
      const pres = cl(v[m[0] === "pCas" ? "pcas" : m[0] === "pTarget" ? "ptar" :
                        m[0] === "donor" ? "donor" : "chr"] || 0, 0, 1);
      const b = grp(GHOST + (1 - GHOST)*pres);
      const y0 = ry(m[1]) - 22, y1 = ry(m[2]) + 22;
      const col = pres > 0.5 ? C.blue : C.muted;
      b.appendChild(path("M"+n1(RULE)+" "+n1(y0)+"V"+n1(y1), col, 2.4));
      b.appendChild(G.text(LBL, (y0 + y1)/2 + 7, m[0], 20, col, 700, "end"));
      grid.appendChild(b);
    });

    /* ---- a row per transcription unit ------------------------------ *
     * Two independent inputs, never conflated: pres is whether the DNA
     * is in the cell at all, fire is whether its promoter is running.
     * Opacity carries presence, colour carries firing, so "not
     * delivered yet" and "delivered but switched off" cannot be
     * mistaken for one another.
     * ---------------------------------------------------------------- */
    ROWS.forEach(function(r, i){
      const y = ry(i);
      const pres = cl(v[r.mol] || 0, 0, 1);
      const fire = cl(v[r.key] || 0, 0, 1);
      const dcol = fire > 0.5 ? C.blue : C.muted;
      const d = grp(GHOST + (1 - GHOST)*pres);

      /* the DNA itself */
      if (r.key === "repa"){
        d.appendChild(seg(DNA0, 396, y, dcol));
        d.appendChild(gene(DNA0 + 4, 390, y, "repA101ts", dcol, 16));
      } else if (r.key === "cas9"){
        d.appendChild(seg(DNA0, 440, y, dcol));
        d.appendChild(promoter(DNA0 + 6, y, dcol));
        d.appendChild(gene(DNA0 + 62, 434, y, "cas9", dcol));
      } else if (r.key === "red"){
        d.appendChild(seg(DNA0, 536, y, dcol));
        d.appendChild(promoter(DNA0 + 6, y, dcol));
        d.appendChild(gene(DNA0 + 62, 378, y, "gam", dcol, 16));
        d.appendChild(gene(382, 456, y, "bet", dcol, 16));
        d.appendChild(gene(460, 530, y, "exo", dcol, 16));
      } else if (r.key === "g2"){
        d.appendChild(seg(DNA0, 544, y, dcol));
        d.appendChild(promoter(DNA0 + 6, y, dcol));
        d.appendChild(gene(DNA0 + 62, 538, y, "sgRNA ✕ pMB1", dcol, 16));
      } else if (r.key === "g1"){
        d.appendChild(seg(DNA0, 628, y, dcol));
        d.appendChild(ori(DNA0, 344, y, "pMB1", dcol));
        d.appendChild(promoter(364, y, dcol));
        d.appendChild(gene(420, 622, y, "sgRNA ✕ aspC1", dcol, 16));
      } else if (r.key === "donor"){
        d.appendChild(G.el("rect", {x:DNA0, y:n1(y - 13), width:200, height:26,
          rx:4, fill:C.muted, "fill-opacity":".14", stroke:C.muted,
          "stroke-width":2.2}));
        d.appendChild(path("M"+n1(DNA0 + 100)+" "+n1(y - 13)+"V"+n1(y + 13),
          C.muted, 2, "5 4"));
        d.appendChild(G.text(DNA0 + 50, y + 6, "up", 17, C.muted, 700));
        d.appendChild(G.text(DNA0 + 150, y + 6, "dn", 17, C.muted, 700));
      } else {
        /* the chromosome is never absent, so its backbone stays solid;
           only the locus changes state */
        const done = (st.edited || 0) > 0.5;
        d.appendChild(seg(DNA0 - 10, 600, y, C.ink));
        if (done){
          d.appendChild(path("M"+n1(DNA0 + 130)+" "+n1(y - 14)+"V"+n1(y + 14),
            C.verm, 3));
          d.appendChild(G.text(DNA0 + 130, y - 22, "ΔaspC1", 18, C.verm, 700));
        } else {
          d.appendChild(promoter(DNA0 + 4, y, dcol));
          d.appendChild(gene(DNA0 + 60, 400, y, "aspC1", dcol));
        }
      }
      grid.appendChild(d);

      /* the RNA it is read into, and whatever that RNA makes: both
         ride firing, not presence */
      const o = grp(GHOST + (1 - GHOST)*fire);
      const ocol = fire > 0.5 ? C.blue : C.muted;
      if (r.rna){
        o.appendChild(arrow(TX_A, TX_A + 44, y, ocol));
        o.appendChild(wave(RNA_C - 42, y, ocol));
        o.appendChild(G.text(RNA_C + 22, y + 7, r.rna, 19, ocol,
          fire > 0.5 ? 700 : 400, "start"));
      }
      if (r.prot.length){
        o.appendChild(arrow(TX_B, TX_B + 44, y, ocol));
        r.prot.forEach(function(nm, k){
          o.appendChild(blob(PRO0 + 56 + k*112, y, nm, ocol, fire > 0.5));
        });
      }
      grid.appendChild(o);

      /* a guide makes no protein, and the donor is read into nothing:
         those dashes are a property of the row, not of its state, so
         they sit outside the firing group and stay put */
      const dash = grp(GHOST + (1 - GHOST)*pres);
      if (!r.rna) dash.appendChild(G.text(RNA_C - 42, y + 6, "—", 24, C.muted, 400));
      if (!r.prot.length) dash.appendChild(G.text(PRO0 + 56, y + 6, "—", 24,
        C.muted, 400));
      grid.appendChild(dash);
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
