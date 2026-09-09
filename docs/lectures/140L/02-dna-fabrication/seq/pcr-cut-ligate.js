/* ------------------------------------------------------------------ *
 * pcr-cut-ligate.js: "PCR, Cut, and Ligate", built one stage per click.
 *
 * The source slide is a single finished picture of the whole workflow:
 * cDNA, PCR product, vector, two digests and a ligation, all true at
 * once. The speaker notes for it say only "Chalk talk", so the drawing
 * has to carry the argument by itself. Here it is the same figure in
 * the same layout, revealed in the order you would actually do it.
 *
 * Layout follows the original: the PCR arm down the left, the vector
 * arm down the right, the two cut molecules side by side, and the
 * ligation product as one circle below them. The 16:9 box is wider and
 * shorter in proportion than the 4:3 original, so the seven bands of the
 * cascade use nearly all the height, and the two arms are pushed further
 * apart horizontally rather than the figure being squashed.
 *
 * Colour follows seq/pet.js in the enzymes lecture, which draws this
 * same pET system:
 *   blue        the T7 system (the promoter), and the primers
 *   vermillion  the payload (INS, all the way through)
 *   amber       the lac system (lacI)
 *   ink/muted   everything structural: backbones, kanR, ori
 * Amber is a fill and a stroke here and nowhere a text colour: it
 * measures 3.1:1 on white, so the lacI arc is amber but its label is
 * ink, exactly as pet.js sets its LacI box.
 *
 * Arrowheads are drawn as paths, not <marker>, so there is no marker id
 * to collide with another section's.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";
const INK = "#111111", BLUE = "#004373", VERM = "#ba3a13", AMBER = "#a99011", MUTED = "#767676";
const MONO = "ui-monospace,SFMono-Regular,Menlo,monospace";

const n2 = v => Math.round(v*10)/10;
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
function smooth(v, a, b){ const t = clamp01((v-a)/(b-a)); return t*t*(3-2*t); }

/* ---- primitives --------------------------------------------------- */
function fade(o, body){ return o <= 0.004 ? "" : '<g opacity="'+n2(o)+'">'+body+'</g>'; }

function txt(x, y, s, size, col, weight, anchor, style, fam){
  return '<text x="'+n2(x)+'" y="'+n2(y)+'" text-anchor="'+(anchor||"middle")+
         '" font-family="'+(fam||"inherit")+'" font-size="'+(size||25)+
         '" font-weight="'+(weight||400)+'" fill="'+(col||INK)+'"'+
         (style ? ' font-style="'+style+'"' : '')+'>'+s+'</text>';
}
function line(x0, y0, x1, y1, col, w){
  return '<path d="M'+n2(x0)+' '+n2(y0)+'L'+n2(x1)+' '+n2(y1)+'" fill="none" stroke="'+
         (col||INK)+'" stroke-width="'+(w||4.4)+'" stroke-linecap="round"/>';
}
/* a gene lying on a linear backbone, pointing right */
function geneArrow(x0, x1, y, h, col){
  const head = Math.min(38, (x1-x0)*0.34), sh = x1 - head;
  return '<path d="M'+n2(x0)+' '+n2(y-h)+'H'+n2(sh)+'V'+n2(y-h*1.85)+
         'L'+n2(x1)+' '+n2(y)+'L'+n2(sh)+' '+n2(y+h*1.85)+'V'+n2(y+h)+'H'+n2(x0)+
         'Z" fill="'+col+'"/>';
}
/* a feature with no direction to show: a plain rounded bar */
function roundBar(x0, x1, y, h, col){
  return '<rect x="'+n2(x0)+'" y="'+n2(y-h)+'" width="'+n2(x1-x0)+'" height="'+n2(h*2)+
         '" rx="'+n2(h)+'" fill="'+col+'"/>';
}
/* half barb at a 3' tip, laid back along the strand and onto its outer
   side.  Same construction as seq/gibson.js in the enzymes lecture. */
const BARB = 25, BW = 0.49;
function barb(xFrom, xTip, y, up, col){
  const back = xFrom > xTip ? 1 : -1;
  const dx = BARB*Math.cos(BW)*back, dy = BARB*Math.sin(BW)*(up ? -1 : 1);
  return line(xTip+dx, y+dy, xTip, y, col||INK, 4);
}
/* a process arrow, growing downward as t runs 0 -> 1 */
function downArrow(x, y0, y1, t){
  if (t <= 0.004) return "";
  const yEnd = y0 + (y1-y0)*t;
  let g = line(x, y0, x, yEnd, INK, 4.4);
  const h = smooth(t, 0.55, 1);
  if (h > 0.004){
    g += fade(h, '<path d="M'+n2(x)+' '+n2(yEnd)+'L'+n2(x-11)+' '+n2(yEnd-22)+
                 'L'+n2(x+11)+' '+n2(yEnd-22)+'Z" fill="'+INK+'"/>');
  }
  return g;
}

/* ---- the plasmid circle ------------------------------------------- */
/* angles are degrees clockwise from twelve o'clock */
function polar(cx, cy, r, deg){
  const a = deg*Math.PI/180;
  return [cx + r*Math.sin(a), cy - r*Math.cos(a)];
}
function arcD(cx, cy, r, a0, a1){
  const p0 = polar(cx, cy, r, a0), p1 = polar(cx, cy, r, a1);
  const large = Math.abs(a1-a0) > 180 ? 1 : 0, sweep = a1 > a0 ? 1 : 0;
  return "M"+n2(p0[0])+" "+n2(p0[1])+"A"+n2(r)+" "+n2(r)+" 0 "+large+" "+sweep+
         " "+n2(p1[0])+" "+n2(p1[1]);
}
/* a feature riding on the ring.  dir +1 puts the arrowhead at a1,
   dir -1 at a0, dir 0 draws a plain band. */
const HD = 13;
function arcFeature(cx, cy, r, a0, a1, w, col, dir){
  const b0 = dir < 0 ? a0 + HD : a0;
  const b1 = dir > 0 ? a1 - HD : a1;
  let g = '<path d="'+arcD(cx, cy, r, b0, b1)+'" fill="none" stroke="'+col+
          '" stroke-width="'+n2(w*2)+'"/>';
  if (dir !== 0){
    const at = dir > 0 ? a1 : a0, base = dir > 0 ? a1 - HD : a0 + HD;
    const tip = polar(cx, cy, r, at);
    const c1 = polar(cx, cy, r + w*2, base), c2 = polar(cx, cy, r - w*2, base);
    g += '<path d="M'+n2(tip[0])+' '+n2(tip[1])+'L'+n2(c1[0])+' '+n2(c1[1])+
         'L'+n2(c2[0])+' '+n2(c2[1])+'Z" fill="'+col+'"/>';
  }
  return g;
}
function leader(x0, y0, x1, y1){ return line(x0, y0, x1, y1, MUTED, 2.2); }

/* Feature angles.  Both plasmids use the same map, so the product reads
   as the same molecule with one piece added.  Reading counterclockwise
   from NcoI you meet lacI, then ori, then kanR, then XhoI, which is the
   order the linearised vector is drawn in. */
const A_PT7  = [-22, -8];
const A_MCS  = [2, 20];
const A_INS  = [0, 40];
const A_KANR = [58, 128];
const A_ORI  = [150, 190];
const A_LACI = [230, 330];

/* the empty vector, top right */
const C1 = {x:1150, y:332, r:85};
function petVector(){
  let g = '<circle cx="'+C1.x+'" cy="'+C1.y+'" r="'+C1.r+
          '" fill="#fff" stroke="'+INK+'" stroke-width="4.4"/>';
  g += arcFeature(C1.x, C1.y, C1.r, A_PT7[0],  A_PT7[1],  7, BLUE,  0);
  g += arcFeature(C1.x, C1.y, C1.r, A_MCS[0],  A_MCS[1],  8, INK,   0);
  g += arcFeature(C1.x, C1.y, C1.r, A_KANR[0], A_KANR[1], 8, INK,   1);
  g += arcFeature(C1.x, C1.y, C1.r, A_ORI[0],  A_ORI[1],  8, MUTED, 0);
  g += arcFeature(C1.x, C1.y, C1.r, A_LACI[0], A_LACI[1], 8, AMBER, -1);
  g += txt(C1.x, C1.y + 10, "pET-28a(+)", 27, INK, 700);
  g += txt(1116, 226, "P<tspan font-size='19'>T7</tspan>", 25, BLUE, 700, "end");
  g += leader(1170, 235, 1194, 226);
  g += txt(1200, 231, "NcoI", 25, INK, 700, "start");
  g += txt(1200, 263, "XhoI", 25, INK, 700, "start");
  g += txt(1029, 320, "lacI", 25, INK, 700, "end", "italic");
  g += txt(1254, 350, "kanR", 25, INK, 700, "start", "italic");
  g += txt(1176, 444, "ori", 25, MUTED, 700, "start");
  return g;
}

/* the ligation product, bottom centre */
const C2 = {x:800, y:718, r:74};
function petIns(){
  let g = '<circle cx="'+C2.x+'" cy="'+C2.y+'" r="'+C2.r+
          '" fill="#fff" stroke="'+INK+'" stroke-width="4.4"/>';
  g += arcFeature(C2.x, C2.y, C2.r, A_PT7[0],  A_PT7[1],  7, BLUE,  0);
  g += arcFeature(C2.x, C2.y, C2.r, A_INS[0],  A_INS[1],  8, VERM,  1);
  g += arcFeature(C2.x, C2.y, C2.r, A_KANR[0], A_KANR[1], 8, INK,   1);
  g += arcFeature(C2.x, C2.y, C2.r, A_ORI[0],  A_ORI[1],  8, MUTED, 0);
  g += arcFeature(C2.x, C2.y, C2.r, A_LACI[0], A_LACI[1], 8, AMBER, -1);
  g += txt(C2.x, C2.y + 10, "pET-INS", 27, INK, 700);
  g += txt(770, 626, "P<tspan font-size='19'>T7</tspan>", 25, BLUE, 700, "end");
  g += leader(800, 628, 828, 614);
  g += txt(834, 618, "NcoI", 25, INK, 700, "start");
  g += leader(858, 649, 872, 646);
  g += txt(878, 654, "XhoI", 25, INK, 700, "start");
  g += txt(818, 682, "INS", 24, VERM, 700);
  g += txt(694, 708, "lacI", 25, INK, 700, "end", "italic");
  g += txt(896, 735, "kanR", 25, INK, 700, "start", "italic");
  g += txt(824, 820, "ori", 25, MUTED, 700, "start");
  return g;
}

/* ---- the scene ---------------------------------------------------- */
function scene(s){
  let g = "";

  /* 1. the insulin cDNA, and the two primers that put sites on it */
  if (s.cdna > 0.004){
    let d = line(350, 255, 590, 255, INK, 4.4);
    d += geneArrow(400, 528, 255, 13, VERM);
    d += txt(352, 292, "cDNA", 25, INK, 400, "start");
    /* forward primer above the strand, 3' barb at its right-hand tip */
    d += line(392, 228, 452, 228, BLUE, 4) + barb(392, 452, 228, true, BLUE);
    d += txt(422, 211, "NcoI", 25, INK, 700);
    /* reverse primer below it, running the other way */
    d += line(536, 282, 476, 282, BLUE, 4) + barb(536, 476, 282, false, BLUE);
    d += txt(506, 318, "XhoI", 25, INK, 700);
    g += fade(s.cdna, d);
  }

  /* 2. PCR, and the fragment it gives */
  g += downArrow(470, 328, 369, smooth(s.pcr, 0, 0.5));
  g += fade(smooth(s.pcr, 0.15, 0.55), txt(492, 356, "PCR", 26, INK, 700, "start"));
  const frag = smooth(s.pcr, 0.4, 1);
  if (frag > 0.004){
    let d = line(392, 409, 552, 409, INK, 4.4);
    d += geneArrow(404, 536, 409, 13, VERM);
    d += line(394, 396, 394, 422, INK, 3.4) + line(550, 396, 550, 422, INK, 3.4);
    d += txt(398, 385, "NcoI", 25, INK, 700);
    d += txt(546, 385, "XhoI", 25, INK, 700);
    d += txt(470, 444, "INS", 25, VERM, 700);
    g += fade(frag, d);
  }

  /* 3. the vector */
  g += fade(s.vec, petVector());

  /* 4. digest both, and the two cut molecules */
  const da = smooth(s.dig, 0, 0.45);
  g += downArrow(470, 458, 498, da);
  g += fade(smooth(s.dig, 0.15, 0.5), txt(492, 485, "Digest NcoI/EcoRI", 25, INK, 700, "start"));
  if (s.vec > 0.5){
    g += downArrow(1095, 458, 498, da);
    g += fade(smooth(s.dig, 0.15, 0.5), txt(1117, 485, "Digest NcoI/EcoRI", 25, INK, 700, "start"));
  }
  const cut = smooth(s.dig, 0.4, 1);
  if (cut > 0.004){
    /* the cut insert */
    let d = txt(326, 532, "CATG", 26, BLUE, 700, "start", null, MONO);
    d += line(390, 523, 412, 523, INK, 4.4);
    d += geneArrow(410, 534, 523, 13, VERM);
    d += line(532, 523, 556, 523, INK, 4.4);
    d += txt(556, 532, "TCGA", 26, BLUE, 700, "start", null, MONO);
    d += txt(472, 558, "INS", 25, VERM, 700);
    /* the cut vector: NcoI end, then lacI, ori, kanR, then the XhoI end */
    d += txt(950, 532, "CATG", 26, BLUE, 700, "start", null, MONO);
    d += line(1014, 523, 1036, 523, INK, 4.4);
    d += roundBar(1034, 1134, 523, 11, AMBER);
    d += line(1134, 523, 1174, 523, INK, 4.4);
    d += roundBar(1174, 1226, 523, 11, MUTED);
    d += line(1226, 523, 1238, 523, INK, 4.4);
    d += roundBar(1236, 1316, 523, 11, INK);
    d += line(1316, 523, 1338, 523, INK, 4.4);
    d += txt(1338, 532, "TCGA", 26, BLUE, 700, "start", null, MONO);
    d += txt(1084, 558, "lacI", 25, INK, 700, null, "italic");
    d += txt(1200, 558, "ori", 25, MUTED, 700);
    d += txt(1276, 558, "kanR", 25, INK, 700, null, "italic");
    g += fade(cut, d);
  }

  /* 5. ligate */
  g += downArrow(722, 556, 598, smooth(s.lig, 0, 0.45));
  g += fade(smooth(s.lig, 0.15, 0.5), txt(744, 584, "T4 DNA Ligase", 25, INK, 700, "start"));
  g += fade(smooth(s.lig, 0.4, 1), petIns());

  return g;
}

/* ---- the sequence ------------------------------------------------- */
window.Deck.sequence("pcrcutligate", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");
  svg.innerHTML = '<g data-r="dyn"></g>';
  slide.appendChild(svg);
  const dyn = svg.querySelector('[data-r="dyn"]');

  const KEYS = ["cdna", "pcr", "vec", "dig", "lig"];
  const S = [
    { s:{cdna:1, pcr:0, vec:0, dig:0, lig:0}, dur:700,
      desc:"The insulin cDNA is drawn as a horizontal line with the INS coding sequence on it as a red arrow pointing right. A blue primer sits above the left end of the gene and another below the right end, each with a half barb at its 3-prime end. The upper one is labelled NcoI, the lower one XhoI." },
    { s:{cdna:1, pcr:1, vec:0, dig:0, lig:0}, dur:1100,
      desc:"An arrow labelled PCR points down from the cDNA to the product below it: the INS arrow on a short piece of its own, with a tick at each end, labelled NcoI on the left and XhoI on the right." },
    { s:{cdna:1, pcr:1, vec:1, dig:0, lig:0}, dur:800,
      desc:"On the right, pET-28a(+) appears as a circle. Clockwise from the top: a blue T7 promoter bar, then a short black block carrying the NcoI and XhoI sites, then kanR down the right side, ori at the bottom, and lacI in amber up the left side." },
    { s:{cdna:1, pcr:1, vec:1, dig:1, lig:0}, dur:1200,
      desc:"An arrow labelled Digest NcoI/EcoRI points down from the fragment and another from the plasmid. The fragment becomes a piece reading CATG at its left end and TCGA at its right, with the INS arrow between them. The plasmid opens into a line with the same two ends, carrying lacI, ori and kanR in that order between them." },
    { s:{cdna:1, pcr:1, vec:1, dig:1, lig:1}, dur:1100,
      desc:"An arrow labelled T4 DNA Ligase leads down to a single circle, pET-INS. It carries lacI, ori and kanR as before, and the INS arrow now sits between the NcoI and XhoI sites, just downstream of the T7 promoter." }
  ];

  let cur = null, raf = null;
  function paint(s){
    dyn.innerHTML = scene({ cdna:clamp01(s.cdna), pcr:clamp01(s.pcr), vec:clamp01(s.vec),
                            dig:clamp01(s.dig),  lig:clamp01(s.lig) });
  }
  function go(i, animated){
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    const to = S[i].s;
    if (!cur || animated === false || reduce.matches){
      cur = Object.assign({}, to); paint(cur); return;
    }
    const from = Object.assign({}, cur), t0 = performance.now(), dur = S[i].dur || 900;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1, (now - t0)/dur), e = ease(t), s = {};
      KEYS.forEach(k => s[k] = from[k] + (to[k] - from[k])*e);
      paint(s); cur = s;
      raf = t < 1 ? requestAnimationFrame(f) : null;
    });
  }
  go(0, false);
  return { steps: S.map(x => ({ desc: x.desc })), go: go };
});
})();
