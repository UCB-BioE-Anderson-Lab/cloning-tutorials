/* ------------------------------------------------------------------ *
 * 00-loop.js — the method, taught slowly on one plasmid.
 *
 * The trace slide runs the whole procedure and that is the right thing
 * for it to do, but it starts by handing over a finished grid.  This
 * slide is the move before: ONE molecule, just arrived, and the
 * reasoning walked a step at a time until the loop is named.
 *
 * Deliberately the real system rather than a toy.  pCas has four
 * transcription units and exactly the right mix -- two that fire on
 * arrival and two that are waiting on an inducer -- so the whole
 * method is exercised without inventing parts.  Slow here, fast on the
 * trace, and the room does the third one themselves.
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
const RY0 = 300, RDY = 92;
const DNA0 = 300, TX_A = 700, RNA_C = 892, PRO0 = 1110;
const ry = i => RY0 + RDY*i;
const GHOST = 0.22;

const ROWS = [
  {key:"repa", reg:"always on",       gene:"repA101ts", w:536, rna:"repA",
   prot:"RepA", does:"copies the plasmid · at 30°"},
  {key:"cas9", reg:"always on",       gene:"cas9",      w:474, rna:"cas9",
   prot:"Cas9", does:"a nuclease with no address yet"},
  {key:"red",  reg:"needs arabinose", gene:"gam-bet-exo", w:566, rna:"gam-bet-exo",
   prot:"Gam Bet Exo", does:null},
  {key:"g2",   reg:"needs IPTG",      gene:"sgRNA ✕ pMB1", w:588,
   rna:"sgRNA ✕ pMB1", prot:null, does:null}
];

function promoter(x, y, col){
  const g = G.el("g", {});
  g.appendChild(path("M"+n1(x)+" "+n1(y+12)+"V"+n1(y-20)+"H"+n1(x+26), col, 2.6));
  g.appendChild(path("M"+n1(x+18)+" "+n1(y-27)+"L"+n1(x+28)+" "+n1(y-20)+
    "L"+n1(x+18)+" "+n1(y-13), col, 2.6));
  return g;
}
function gene(x0, x1, y, label, col, size){
  const g = G.el("g", {}), h = 28, tip = 14;
  g.appendChild(G.el("rect", {x:n1(x0), y:n1(y - h/2), width:n1(x1 - x0),
    height:h, rx:4, fill:C.paper}));
  g.appendChild(G.el("path", {d:"M"+n1(x0)+" "+n1(y-h/2)+"H"+n1(x1-tip)+
    "L"+n1(x1)+" "+n1(y)+"L"+n1(x1-tip)+" "+n1(y+h/2)+"H"+n1(x0)+"Z",
    fill:col, "fill-opacity":".14", stroke:col, "stroke-width":2.2,
    "stroke-linejoin":"round"}));
  g.appendChild(G.text((x0 + x1 - tip)/2, y + 6, label, size || 19, col, 700));
  return g;
}
function wave(cx, y, col){
  const w = 78;
  let d = "M"+n1(cx - w/2)+" "+n1(y);
  for (let i = 0; i < 4; i++)
    d += "q"+n1(w/16)+" -7 "+n1(w/8)+" 0 q"+n1(w/16)+" 7 "+n1(w/8)+" 0";
  return path(d, col, 3);
}
function blob(cx, y, label, col){
  const g = G.el("g", {}), w = label.length*12 + 34;
  g.appendChild(G.el("rect", {x:n1(cx - w/2), y:n1(y - 18), width:n1(w),
    height:36, rx:18, fill:col, "fill-opacity":".2", stroke:col,
    "stroke-width":2.6}));
  g.appendChild(G.text(cx, y + 7, label, 20, col, 700));
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
{ s:{dna:1},
  cap:"pCas is in the cell. <b>Nothing has happened yet</b>",
  call:"it is just DNA &#183; sitting there",
  note:"Start from a standstill, because this is the step everyone skips. You have electroporated a plasmid in. At this instant it is a piece of DNA in a cytoplasm and nothing whatsoever has happened. No protein has appeared, nothing has been cut, the cell does not know it is there. Everything that follows has to be derived from that starting point, and the only way anything gets derived is transcription.",
  desc:"pCas drawn as four transcription units, present in the cell but with nothing transcribed yet." },

{ s:{dna:1, ask:1},
  cap:"so the only question is: <b>what gets transcribed?</b>",
  call:"look at each promoter, and at what it needs",
  note:"So ask the only question that can be asked of a piece of DNA: what reads it. Go promoter by promoter and check what each one needs. This is the move, and it is worth doing out loud the first time because it is the habit the rest of the lecture runs on.",
  desc:"The question is posed: which of the four promoters will fire, given what each one requires." },

{ s:{dna:1, ask:1, on:1},
  cap:"two are <b>constitutive</b> &#8212; they fire immediately",
  call:"the other two are waiting on something that is not in the flask",
  note:"Two of them are constitutive, meaning they need nothing, so they fire the moment the plasmid lands. The other two need an inducer. Lambda red is under an arabinose promoter and there is no arabinose in the medium. The guide against pMB1 is under a lac promoter and there is no IPTG. So those two units are present, and dark. That distinction matters: they are not absent, they are not firing, and that is a different thing.",
  desc:"The two constitutive units fire while the arabinose-dependent and IPTG-dependent units stay dark, because neither inducer is present." },

{ s:{dna:1, ask:1, on:1, rna:1},
  cap:"which gives you these <b>RNAs</b>",
  call:"and only these &#183; you can read them straight off the promoters",
  note:"Two promoters firing gives two RNAs. Nothing else is being made. And notice you did not need to be told that, you read it off the promoters and the contents of the flask.",
  desc:"The two firing units produce their RNAs; the other two rows show no RNA." },

{ s:{dna:1, ask:1, on:1, rna:1, prot:1},
  cap:"which give you these <b>proteins</b>",
  call:"RepA and Cas9 &#183; and nothing else",
  note:"And those two RNAs are translated, so RepA and Cas9 now exist in the cell. Still nothing else. Three levels, and each one follows from the one before it.",
  desc:"The two RNAs are translated into RepA and Cas9." },

{ s:{dna:1, ask:1, on:1, rna:1, prot:1, does:1},
  cap:"and now the part that matters: <b>what do they do?</b>",
  call:"RepA copies the plasmid &#183; Cas9 does <b>nothing</b>, because it has no guide",
  note:"Now the last step, and it is the one that changes the state of the cell. RepA is a replication initiator, so it copies the plasmid, which is why the plasmid persists at all and why thirty degrees matters. And Cas9, which is the most dangerous protein in this cell, does absolutely nothing. It is a nuclease without an address. It will sit there, fully expressed, harmlessly, until something hands it a guide. That is the whole state of the cell at this point, and every later step starts from here.",
  desc:"What the two proteins do: RepA copies the plasmid at 30 degrees, and Cas9 does nothing at all because it has no guide RNA." },

{ s:{loop:1},
  cap:"that is the whole method",
  call:"and you will use it on every system in this course",
  note:"Name it, because they are about to do it three more times. What DNA is in the cell. What is transcribed, which you get by checking each promoter against the conditions. What that RNA makes. What that product does, and what it changes. And then round again, because what it changed may have switched something else on. Four questions, in that order, and the answer to the last one feeds the first.",
  desc:"The loop named as four questions: what DNA is present, what is transcribed, what does that make, what does it do — and then round again, because what it changed may switch something else on." }
];

const STEP = ["what DNA is in the cell?", "what is transcribed?",
              "what does that make?", "what does it do?"];

window.Deck.sequence("loop", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    if (v.loop > 0.02){
      const L = grp(v.loop), cx = 800, cy = 460, r = 224;
      STEP.forEach(function(t, i){
        const a = -90 + i*90, p = G.pt(cx, cy, r, a);
        const w = t.length*11.4 + 40;
        L.appendChild(G.el("rect", {x:n1(p[0] - w/2), y:n1(p[1] - 30),
          width:n1(w), height:60, rx:12, fill:C.blue, "fill-opacity":".12",
          stroke:C.blue, "stroke-width":2.8}));
        L.appendChild(G.text(p[0], p[1] + 8, t, 21, C.blue, 700));
      });
      for (let i = 0; i < 4; i++){
        const a0 = -90 + i*90 + 26, a1 = -90 + (i + 1)*90 - 26;
        /* the arc that closes the cycle is the point of the figure, so
           it is the one drawn in vermillion -- "and round again" as a
           caption in the middle collided with the side boxes */
        const col = i === 3 ? C.verm : C.muted;
        const p0 = G.pt(cx, cy, r - 6, a0), p1 = G.pt(cx, cy, r - 6, a1);
        L.appendChild(path("M"+n1(p0[0])+" "+n1(p0[1])+
          "A"+(r-6)+" "+(r-6)+" 0 0 1 "+n1(p1[0])+" "+n1(p1[1]), col, 2.8));
        /* a real arrowhead: take the tangent from the point just behind
           the tip, then lay two barbs off it */
        const pb = G.pt(cx, cy, r - 6, a1 - 7);
        const dx = p1[0] - pb[0], dy = p1[1] - pb[1];
        const m = Math.sqrt(dx*dx + dy*dy) || 1;
        const ux = dx/m, uy = dy/m, k = 15, wdt = 8;
        L.appendChild(path(
          "M"+n1(p1[0] - k*ux - wdt*uy)+" "+n1(p1[1] - k*uy + wdt*ux)+
          "L"+n1(p1[0])+" "+n1(p1[1])+
          "L"+n1(p1[0] - k*ux + wdt*uy)+" "+n1(p1[1] - k*uy - wdt*ux), col, 2.8));
      }
      g.appendChild(L);
      return g;
    }

    g.appendChild(G.text(DNA0, 244, "pCas", 24, C.blue, 700, "start"));
    ROWS.forEach(function(r, i){
      const y = ry(i);
      const on = (v.on || 0) > 0.5 && r.reg === "always on";
      const shown = (v.ask || 0) > 0.5;
      const col = on ? C.blue : C.muted;
      const d = grp(v.dna);
      d.appendChild(path("M"+n1(DNA0)+" "+n1(y)+"H"+n1(r.w), col, 2.4));
      d.appendChild(promoter(DNA0 + 6, y, col));
      d.appendChild(gene(DNA0 + 62, r.w - 8, y, r.gene, col, 18));
      if (shown)
        d.appendChild(G.text(DNA0 + 2, y + 36, r.reg, 18,
          on ? C.blue : C.muted, on ? 700 : 400, "start"));
      g.appendChild(d);

      if ((v.rna || 0) > 0.5 && on){
        const q = grp(v.rna);
        q.appendChild(arrow(TX_A, TX_A + 46, y, C.blue));
        q.appendChild(wave(RNA_C - 46, y, C.blue));
        q.appendChild(G.text(RNA_C + 16, y + 7, r.rna, 20, C.blue, 700, "start"));
        g.appendChild(q);
      }
      if ((v.prot || 0) > 0.5 && on && r.prot){
        const q = grp(v.prot);
        q.appendChild(blob(PRO0 + 66, y, r.prot, C.blue));
        g.appendChild(q);
      }
      if ((v.does || 0) > 0.5 && on && r.does){
        const q = grp(v.does);
        q.appendChild(G.text(PRO0 + 66, y + 48, r.does, 19, C.verm, 700));
        g.appendChild(q);
      }
    });
    return g;
  }
  return G.run(s, FR, paint);
});
})();
