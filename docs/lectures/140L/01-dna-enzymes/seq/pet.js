/* ------------------------------------------------------------------ *
 * pet.js — BL21(λDE3) and pET, built up one click at a time.
 *
 * The slide this replaces was a finished picture of a four-part circuit
 * with two bullets beside it. Everything in it was true at once, which
 * is exactly the problem: a student cannot see which part is doing what,
 * and the whole point of the design is that it is TWO switches wired in
 * series. So it is assembled in the order you would actually build it —
 * gene into the vector, vector into the strain, repressor on, inducer
 * in, protein out.
 *
 * Colour follows the deck, not the source figure, which is green:
 *   blue   the T7 system   (the polymerase, its gene, its promoter,
 *                           the transcript it makes)
 *   amber  the lac system  (both operators, LacI, the lacI gene)
 *   red    the payload     (the gene, and the protein it becomes)
 * Two colours for two circuits is the whole content of the picture, so
 * they carry it. The gene and its product share the third colour, which
 * is the point of the last beat: what fills the cell is what you put on
 * the plasmid. IPTG is red too while it is the subject of its own beat,
 * and clears out as the protein arrives so the two never share the cell.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const INK="#111111", BLUE="#004373", VERM="#ba3a13", AMBER="#a99011", MUTED="#767676";
const n2 = v => Math.round(v*10)/10;
const clamp01 = v => v<0?0:v>1?1:v;
const ease = t => t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
function smooth(v,a,b){ const t=clamp01((v-a)/(b-a)); return t*t*(3-2*t); }

/* ---- fixed geometry ---------------------------------------------- */
const CELL = {x:300, y:300, w:1000, h:492, r:66};
const CHY  = 388;                                  /* the chromosome    */
const PLAC = [520, 640], T7G = [684, 924];
const RING = {x:572, y:562, w:456, h:194, r:56};   /* the pET plasmid   */
const PT7  = [636, 716], LACO = [716, 770];
const INSB = [802, 942];
const LACIG= [692, 832];
const LACI_A = [580, CHY], LACI_B = [743, RING.y];  /* where LacI sits  */

function rrect(o, fill, stroke, w, dash){
  return '<rect x="'+o.x+'" y="'+o.y+'" width="'+o.w+'" height="'+o.h+'" rx="'+o.r+
         '" fill="'+(fill||"none")+'" stroke="'+(stroke||INK)+'" stroke-width="'+(w||4)+'"'+
         (dash?' stroke-dasharray="'+dash+'"':'')+'/>';
}
function bar(x0, x1, y, h, col){
  return '<rect x="'+x0+'" y="'+n2(y-h/2)+'" width="'+(x1-x0)+'" height="'+h+
         '" fill="'+col+'"/>';
}
function box(x0, x1, y, h, fill, stroke, text, tcol){
  const g = '<rect x="'+x0+'" y="'+n2(y-h/2)+'" width="'+(x1-x0)+'" height="'+h+
            '" rx="6" fill="'+fill+'" stroke="'+stroke+'" stroke-width="3.4"/>';
  return g + txt((x0+x1)/2, y+10, text, 28, tcol, 700);
}
function txt(x, y, s, size, col, weight, anchor, style){
  return '<text x="'+n2(x)+'" y="'+n2(y)+'" text-anchor="'+(anchor||"middle")+
         '" font-family="inherit" font-size="'+(size||26)+'" font-weight="'+(weight||400)+
         '" fill="'+(col||MUTED)+'"'+(style?' font-style="'+style+'"':'')+'>'+s+'</text>';
}
function fade(o, body){ return o<=0.004 ? "" : '<g opacity="'+n2(o)+'">'+body+'</g>'; }
/* LacI, drawn as a body that physically occupies its operator */
function laci(cx, cy, col){
  return '<rect x="'+n2(cx-40)+'" y="'+n2(cy-25)+'" width="80" height="50" rx="16" fill="'+
         col+'"/>' + txt(cx, cy+9, "LacI", 23, "#fff", 700);
}
function blob(cx, cy, r, col){
  return '<circle cx="'+n2(cx)+'" cy="'+n2(cy)+'" r="'+n2(r)+'" fill="'+col+'"/>';
}
/* the transcript: a wave, as everywhere else RNA is drawn in this deck */
function wave(x0, x1, y, amp){
  if (x1 - x0 < 4) return "";
  let d = "M"+n2(x0)+" "+n2(y);
  const n = Math.max(1, Math.round((x1-x0)/26));
  for (let i=0;i<n;i++){
    const a=x0+(x1-x0)*i/n, b=x0+(x1-x0)*(i+1)/n, m=(a+b)/2;
    d += "Q"+n2(m)+" "+n2(y+(i%2?amp:-amp))+" "+n2(b)+" "+n2(y);
  }
  return '<path d="'+d+'" fill="none" stroke="'+BLUE+'" stroke-width="3.4" stroke-linecap="round"/>';
}

function scene(s){
  let g = "";

  /* ---- the cell, and the chromosome it carries ---- */
  g += fade(s.cell,
        rrect(CELL, "none", MUTED, 3, "3 9") +
        /* inside the cell, not above it: above collides with the caption */
        txt(CELL.x + 32, CELL.y + 46, "BL21(&#955;DE3)", 28, INK, 700, "start") +
        '<path d="M360 '+CHY+'H1240" fill="none" stroke="'+INK+'" stroke-width="4.4"/>' +
        bar(PLAC[0], PLAC[1], CHY, 22, AMBER) +
        txt((PLAC[0]+PLAC[1])/2, CHY-30, "P<tspan font-size='20'>lac</tspan>", 26, INK, 700) +
        box(T7G[0], T7G[1], CHY, 48, BLUE, BLUE, "T7 RNAP", "#fff"));

  /* ---- the plasmid, which is where the click starts ---- */
  g += rrect(RING, "none", INK, 4.4) +
       bar(PT7[0], PT7[1], RING.y, 20, BLUE) +
       txt((PT7[0]+PT7[1])/2, RING.y-30, "P<tspan font-size='20'>T7</tspan>", 26, INK, 700) +
       bar(LACO[0], LACO[1], RING.y, 20, AMBER) +
       box(INSB[0], INSB[1], RING.y, 48, VERM, VERM, "INS", "#fff") +
       box(LACIG[0], LACIG[1], RING.y+RING.h, 46, AMBER, AMBER, "lacI", INK) +
       txt(RING.x-16, RING.y+RING.h/2+10, "pET", 27, MUTED, 700, "end");

  /* ---- repression: LacI on both operators ---- */
  /* it slides off to its own side rather than fading, so the beat reads
     as the protein letting go rather than as the drawing changing */
  const off = smooth(s.ind, 0.22, 0.55);
  const rep = s.rep * (1 - smooth(s.ind, 0.5, 0.78));
  g += fade(rep, laci(LACI_A[0] - 150*off, LACI_A[1] - 96*off, AMBER) +
                 laci(LACI_B[0] - 150*off, LACI_B[1] + 96*off, AMBER));

  /* ---- IPTG arrives and takes hold of it ---- */
  const iptg = smooth(s.ind, 0, 0.34);
  if (iptg > 0.004){
    const pts = [[430,470],[470,700],[1160,470],[1130,700]];
    let d = "";
    for (const p of pts) d += blob(p[0], p[1], 12, VERM);
    /* IPTG clears out as the protein comes in. It has done its job, and
       leaving it there would put two unrelated red things in one cell on
       the beat whose whole point is that the cell fills with ONE thing. */
    const spent = 1 - smooth(s.prot, 0, 0.55);
    g += fade(iptg * spent, d + txt(430, 442, "IPTG", 25, VERM, 700));
  }

  /* ---- the polymerase is made, finds P(T7), and transcribes ---- */
  const made = smooth(s.ind, 0.5, 0.74);
  const trav = smooth(s.ind, 0.66, 0.9);
  if (made > 0.004){
    const px = 804 + (PT7[1] - 804)*trav, py = CHY + 56 + (RING.y - CHY - 56)*trav;
    g += fade(made, blob(px, py, 26, BLUE) +
                    txt(px, py+9, "T7", 23, "#fff", 700));
  }
  const tx = smooth(s.ind, 0.82, 1);
  g += wave(PT7[1], PT7[1] + (INSB[1] - PT7[1])*tx, RING.y - 52, 9);
  g += fade(tx, txt(INSB[1] + 16, RING.y - 46, "mRNA", 24, BLUE, 700, "start"));

  /* ---- and the protein, which is the only thing you keep ---- */
  if (s.prot > 0.004){
    const spots = [[402,486],[418,594],[404,690],[1198,486],[1210,592],[1196,688],
                   [520,742],[1074,742],[476,466],[1130,462]];
    let d = "";
    spots.forEach(function(p, i){
      const o = smooth(s.prot, i*0.045, i*0.045 + 0.4);
      if (o > 0.004) d += fade(o, blob(p[0], p[1], 17, VERM));
    });
    g += d;
    g += fade(smooth(s.prot, 0.55, 1), txt(800, 838, "insulin &#8212; and now you purify it", 28, VERM, 700));
  }
  return g;
}

window.Deck.sequence("pet", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const svg = document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  svg.innerHTML = '<g data-r="dyn"></g>' +
    '<text data-r="cap" x="800" y="252" text-anchor="middle" font-family="inherit" ' +
      'font-weight="700" font-size="31" fill="'+INK+'"></text>';
  slide.appendChild(svg);
  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);

  const KEYS = ["cell","rep","ind","prot"];
  const S = [
    { s:{cell:0,rep:0,ind:0,prot:0}, dur:700,
      cap:"1 · your gene into a pET vector, behind a T7 promoter",
      note:"Build it in the order you would actually build it. Start with the vector. A pET plasmid gives you a T7 promoter, and just downstream of it a place to put your gene — here the human insulin coding sequence, which is the first design tutorial you will do. The plasmid also carries lacI, and you will see why in a moment. Right now this construct does nothing at all, in any ordinary strain, because nothing in E. coli can read a T7 promoter.",
      desc:"A pET plasmid drawn as a rounded ring. On its top edge a blue T7 promoter bar and an amber lac operator bar, then a box labelled INS. On its bottom edge an amber box labelled lacI." },
    { s:{cell:1,rep:0,ind:0,prot:0}, dur:800,
      cap:"2 · into BL21(λDE3), which carries the reader",
      note:"Now put it into BL21 lambda DE3. That strain is ordinary E. coli with one addition: a copy of the T7 RNA polymerase gene sitting in its own chromosome, under a lac promoter. That is the reader. The design is split deliberately — the strain owns the polymerase, you own the gene — and neither half does anything without the other.",
      desc:"A dotted cell outline appears around the plasmid, labelled BL21 lambda DE3, with a chromosome line above the plasmid carrying an amber lac promoter and a blue box labelled T7 RNAP." },
    { s:{cell:1,rep:1,ind:0,prot:0}, dur:700,
      cap:"3 · LacI sits on both operators",
      note:"And in the uninduced state, LacI is bound. Look at where: on the lac promoter in the chromosome, so no T7 polymerase is made, and on the lac operator next to the T7 promoter on your plasmid, so even a stray molecule of polymerase finds the site blocked. Two switches, wired in series, and both of them off. That redundancy is not decoration — it is what lets you clone a gene whose product would otherwise kill the cell before you ever induced.",
      desc:"Two amber LacI proteins appear, one covering the lac promoter on the chromosome and one covering the lac operator beside the T7 promoter on the plasmid." },
    { s:{cell:1,rep:1,ind:1,prot:0}, dur:2400,
      cap:"4 · add IPTG — and one induction opens both",
      note:"Add IPTG. It binds LacI, LacI changes shape and lets go, and it lets go of both operators at once, because both are the same operator. Watch the order of what follows, because it is the whole reason this works. The chromosomal gene is now on, so the cell makes T7 RNA polymerase. That polymerase goes looking for a T7 promoter, and the only one in the cell is the one on your plasmid. It binds, and it transcribes — and because it is fast, processive, and has nothing else in the cell to do, it reads your gene and essentially nothing else.",
      desc:"Red IPTG appears, both LacI proteins slide off their operators, a blue T7 RNA polymerase is made at the chromosomal gene and travels down to the T7 promoter on the plasmid, and a blue mRNA wave grows out across the INS gene." },
    { s:{cell:1,rep:1,ind:1,prot:1}, dur:1300,
      cap:"5 · and the cell fills with one protein",
      note:"And then it just keeps going. A well-behaved pET induction can put your protein at a third or more of the total protein in the cell, which is why this system took over the catalogue: the purification is easy because there is so much of it and so little of anything else competing. That is what you harvest. Two levels of control, one induction, and one protein.",
      desc:"Protein appears throughout the cell as a scatter of solid dots, and a line reads: insulin, and now you purify it." }
  ];

  let cur = null, raf = null;
  function paint(s){
    r.dyn.innerHTML = scene({cell:clamp01(s.cell), rep:clamp01(s.rep),
                             ind:clamp01(s.ind), prot:clamp01(s.prot)});
  }
  function go(i, animated){
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    r.cap.innerHTML = S[i].cap;
    const to = S[i].s;
    if (!cur || animated === false || reduce.matches){
      cur = Object.assign({}, to); paint(cur); return;
    }
    const from = Object.assign({}, cur), t0 = performance.now(), dur = S[i].dur || 800;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1, (now-t0)/dur), e = ease(t), s = {};
      KEYS.forEach(k => s[k] = from[k] + (to[k]-from[k])*e);
      paint(s); cur = s;
      raf = t < 1 ? requestAnimationFrame(f) : null;
    });
  }
  go(0, false);
  return { steps: S.map(x => ({note:x.note, desc:x.desc})), go: go };
});
})();
