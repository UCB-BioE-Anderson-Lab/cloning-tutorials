/* ------------------------------------------------------------------ *
 * levels.js — the core reaction, 5'->3' extension, shown at the three
 * levels of iconography this lecture (and the literature) moves between.
 *
 *   1. atoms   the actual chemistry: the 3'-OH attacks the alpha
 *              phosphate, pyrophosphate leaves
 *   2. letters bases as characters — used wherever a POSITION matters
 *   3. line    a barbed line — used wherever only topology matters
 *
 * The point of the slide is that these are the SAME EVENT. Nearly every
 * later diagram in the deck is level 3; this is what it stands for.
 *
 * Ring geometry is a schematic: the base hangs off C1', the 3'-O off
 * C3' and the 5' carbon off C4', which is the connectivity that matters,
 * drawn so the chain reads 5'->3' left to right.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", SLATE = "#004373", RED = "#ba3a13", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";
const n2 = v => Math.round(v*10)/10;

function bond(a, b, w, col){
  return '<path d="M'+n2(a[0])+' '+n2(a[1])+'L'+n2(b[0])+' '+n2(b[1])+'" fill="none" stroke="' +
         (col||INK)+'" stroke-width="'+(w||2.6)+'" stroke-linecap="round"/>';
}

/* ------------------------------------------------------- level 1 */
/* Drawn with the same all-atom renderer as every other operator in the
   lecture, and coloured by the same rule: RED is what the enzyme has to
   have, GREY is what it does not care about.

   For a polymerase the address is a shape, not a sequence -- two strands,
   annealed, with the upper one RECESSED so a free 3' hydroxyl sits
   opposite unread template. So both backbones are red along their whole
   length and every base is grey: a polymerase will extend that junction
   whatever the letters are. The incoming dNTP is the same story, its
   triphosphate red and its base grey.

   The chain is a real one -- once the bond forms, the new residue is
   simply part of the top strand, and the alpha phosphate is the ordinary
   internal phosphate the renderer draws between two sugars. Nothing is
   faked to make the product look joined. */
const NC = 8, PRIMER = 6;               /* six pairs annealed, two recessed */
const SEQ = "GATCAGTC";
const X0  = (1600 - (NC-1)*188) / 2;
/* Everything between the slide's bullet and the caption line belongs to
   the drawing. The level marker used to sit on its own line above the
   panel, which cost ~90px of height the chemistry needed more; it now
   opens the caption instead. */
const FIT = {x0:110, y0:206, x1:1490, y1:788};

const roles = () => Array.from({length:NC}, () => ({bb:"hot", base:"bg"}));
/* hb:"hot" because the pairing is part of the requirement, not scenery --
   a polymerase will not extend a primer that is not annealed to anything */
const mk = (r, e) => window.DNAModel.make({top:SEQ, range:r, hb:"hot",
                       roleTop:roles(), roleBot:roles(),
                       ends:Object.assign({t5:"oh", t3:"oh", b5:"oh", b3:"oh"}, e||{})});

/* Phosphates drawn to the SAME atom scale the DNA renderer uses -- its
   bond length is R*0.8 and its labels are Atoms.LBL, both of which follow
   the scale draw() sets. Hand-picked sizes here came out at roughly twice
   the size of the DNA's own atoms, which made the triphosphate read as a
   different drawing pasted on top of the duplex. */
const geo = () => { const R = window.Atoms.R, SZ = window.Atoms.LBL;
                    return {R, SZ, L:R*0.80, ST:R*2.4}; };

function lab(p, t, c, sz){
  const z = sz || window.Atoms.LBL;
  return '<circle cx="'+n2(p[0])+'" cy="'+n2(p[1])+'" r="'+n2(z*0.62)+'" fill="#fff"/>' +
         '<text x="'+n2(p[0])+'" y="'+n2(p[1]+z*0.34)+'" text-anchor="middle" font-size="'+n2(z)+
         '" font-weight="600" fill="'+c+'">'+t+'</text>';
}
/* flat in the chain: bridges left and right, spare oxygens above and below */
function phos(x, y, c, term, d){
  const {SZ, L} = geo();
  let g = bond([x-4,y],[x-4,y-L], 2.4, c) + bond([x+4,y],[x+4,y-L], 2.4, c) +
          lab([x, y-(L+SZ*0.95)], "O", c) +
          bond([x,y],[x,y+L], 2.4, c) + lab([x, y+(L+SZ*1.05)], "O&#8315;", c);
  if (term) g += bond([x,y],[x+d*L,y], 2.4, c) + lab([x+d*(L+SZ*1.15), y], "O&#8315;", c);
  return g + lab([x,y], "P", c);
}
/* alpha bridges LEFT to beta and DOWN to the nucleotide's own 5' oxygen,
   so its spare oxygens take the two directions that are left */
function phosA(x, y, c){
  const {SZ, L} = geo();
  return bond([x-4,y],[x-4,y-L], 2.4, c) + bond([x+4,y],[x+4,y-L], 2.4, c) +
         lab([x, y-(L+SZ*0.95)], "O", c) +
         bond([x,y],[x+L,y], 2.4, c) + lab([x+L+SZ*1.15, y], "O&#8315;", c) +
         lab([x,y], "P", c);
}
const GREEK = (x, y, t) => '<text x="'+n2(x)+'" y="'+n2(y)+'" text-anchor="middle" ' +
  'font-size="'+n2(window.Atoms.LBL*1.55)+'" font-style="italic" fill="'+MUTED+'">'+t+'</text>';

/* bonded = the phosphodiester has formed, so the dNTP is simply the fifth
   residue of the top strand and what is left over is pyrophosphate */
function level1(bonded){
  const M = window.DNAModel;
  let g = M.draw(mk({top:[0, PRIMER + (bonded?1:0)], bot:[0,NC]}), X0);
  const oh3 = M.anchors.term.top3;

  if (!bonded){
    /* The free dNTP, already paired with the base that decides which one it
       is -- that pairing is the whole of a polymerase's fidelity, so it is
       drawn, in red like the rest of the requirement. The template residue
       under it is redrawn to get those bonds and carries no terminus of its
       own, since it is the middle of a strand. */
    g += M.draw(mk({top:[PRIMER, PRIMER+1], bot:[PRIMER, PRIMER+1]},
                   {t5:"o", b3:"none", b5:"none"}), X0);
    const o5 = M.anchors.term.top5, {SZ, L, ST, R} = geo();
    /* The triphosphate runs flat, above the primer, rather than straight up
       out of the slide: alpha has to sit clear of the 3' hydroxyl that is
       about to attack it, and there is nothing else in that band. */
    const AX = o5[0], AY = o5[1] - R*3.2;
    /* bonds first, so the atom labels mask their ends */
    g += bond([AX,AY],[AX-2*ST,AY], 2.4, RED) + bond([AX,AY],[AX,o5[1]], 2.4, RED);
    g += lab([AX-ST/2, AY], "O", RED) + lab([AX-1.5*ST, AY], "O", RED);
    g += phosA(AX, AY, RED) + phos(AX-ST, AY, RED) + phos(AX-2*ST, AY, RED, true, -1);
    const gy = AY - (L + SZ*0.95) - SZ*1.5;
    g += GREEK(AX, gy, "&#945;") + GREEK(AX-ST, gy, "&#946;") + GREEK(AX-2*ST, gy, "&#947;");
    /* The attack. It has to arrive at alpha pointing AT it, from below and
       left, which fixes which side the control point goes: putting it near
       the start, or out beyond either end, bends the head away from the
       phosphorus and the arrow reads as a hook instead of a curl. */
    g += '<path fill="none" stroke="'+RED+'" stroke-width="3" marker-end="url(#lvArrow)" d="M' +
         n2(oh3[0]+12)+' '+n2(oh3[1]-18)+'Q'+n2(AX-L)+' '+n2(AY+L*3.1)+' '+
         n2(AX-L*0.25)+' '+n2(AY+L)+'"/>';
  } else {
    /* beta and gamma, leaving together */
    const {SZ, L, ST, R} = geo();
    const AX = M.anchors.phos.top[PRIMER-1][0] - ST/2, AY = 251 - R*3.2;
    g += bond([AX,AY],[AX-ST,AY], 2.4, RED) + lab([AX-ST/2, AY], "O", RED);
    g += phos(AX, AY, RED, true, 1) + phos(AX-ST, AY, RED, true, -1);
    g += '<text x="'+n2(AX-ST-(L+SZ*1.15)-26)+'" y="'+n2(AY+SZ*0.34)+'" text-anchor="end" ' +
           'font-size="26" font-weight="700" fill="'+MUTED+'">pyrophosphate</text>';
  }
  return g;
}

/* ------------------------------------------------- levels 2 and 3 */
/* Levels 2 and 3 share ONE box and ONE moment: the same six positions, the
   same strand separation, and both strands drawn to the same length so the
   line panel does not read as "still running" next to a finished sequence.
   LX is set so the six letters centre on x=800, under the caption. */
const LT = "GCATTG", LB = "CGTAAC";
const LX = 570, LSTEP = 92, LY = 490, LY2 = 568;

function level2(){
  let g = '<g data-r="L2" opacity="0" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" ' +
          'font-size="52" font-weight="600" text-anchor="middle">';
  for (let i = 0; i < LT.length; i++){
    const last = i === LT.length - 1;
    g += '<text'+(last?' data-r="l2_new"':'')+' x="'+(LX+i*LSTEP)+'" y="'+LY+'" fill="' +
         (last?RED:SLATE)+'">'+LT[i]+'</text>' +
         '<text x="'+(LX+i*LSTEP)+'" y="'+LY2+'" fill="'+INK+'">'+LB[i]+'</text>';
  }
  const xe = LX + (LT.length-1)*LSTEP;
  g += '<g font-family="inherit" font-size="28" fill="'+MUTED+'">' +
         '<text x="'+(LX-92)+'" y="'+LY+'">5&#8242;</text>' +
         '<text x="'+(LX-92)+'" y="'+LY2+'">3&#8242;</text>' +
         '<text x="'+(xe+92)+'" y="'+LY+'">3&#8242;</text>' +
         '<text x="'+(xe+92)+'" y="'+LY2+'">5&#8242;</text></g>';
  return g + '</g>';
}

function level3(){
  /* Both strands run the SAME span, so the duplex reads as finished — the
     same moment panel 2 shows. (It used to leave the blue strand 56px short
     of the black one, which read as synthesis still in progress.) */
  const xa = LX - 102, xb = LX + (LT.length-1)*LSTEP + 102;
  const y1 = LY - 16, y2 = LY2 - 16, B = 34;
  return '<g data-r="L3" opacity="0" fill="none" stroke-width="4.6" stroke-linecap="round">' +
    '<g stroke="'+SLATE+'"><path d="M'+xa+' '+y1+'H'+xb+'"/>' +
      '<path d="M'+(xb-B)+' '+(y1-17)+'L'+xb+' '+y1+'"/></g>' +
    '<g stroke="'+INK+'"><path d="M'+xb+' '+y2+'H'+xa+'"/>' +
      '<path d="M'+(xa+B)+' '+(y2+17)+'L'+xa+' '+y2+'"/></g>' +
  '</g>';
}

/* ------------------------------------------------------- sequence */
window.Deck.sequence("levels", function(slide){
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");
  svg.innerHTML =
    '<defs><marker id="lvArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" ' +
      'markerHeight="6" orient="auto-start-reverse">' +
      '<path d="M0 0L10 5L0 10" fill="none" stroke="'+RED+'" stroke-width="2"/></marker></defs>' +
    '<g data-r="L1" opacity="0"></g>' + level2() + level3() +
    '<text data-r="sub" x="800" y="836" text-anchor="middle" font-family="inherit" ' +
      'font-size="27" fill="'+MUTED+'"></text>';
  slide.appendChild(svg);
  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const KEYS = ["l1","l2","l3"];
  let cur = null, raf = null, drawn = null, fitTr = null;

  /* The all-atom panel is drawn, not tweened -- like every other operator
     in the deck. Only its opacity crossfades against levels 2 and 3.

     ONE transform serves both frames, measured from the union of their two
     bounding boxes. Fitting each frame to its own box made the duplex jump
     between them, because the incoming dNTP and the departing pyrophosphate
     sit in different places -- and the jump is exactly what you are trying
     to watch, so it has to be the base that moves and nothing else. */
  function drawL1(bonded){
    if (!fitTr){
      const box = [false, true].map(function(b){
        r.L1.removeAttribute("transform");
        r.L1.innerHTML = level1(b);
        return r.L1.getBBox();
      });
      if (!box[0].width || !box[1].width) return;        /* slide not shown yet */
      const x0 = Math.min(box[0].x, box[1].x), y0 = Math.min(box[0].y, box[1].y);
      const x1 = Math.max(box[0].x+box[0].width,  box[1].x+box[1].width);
      const y1 = Math.max(box[0].y+box[0].height, box[1].y+box[1].height);
      const k = Math.min((FIT.x1-FIT.x0)/(x1-x0), (FIT.y1-FIT.y0)/(y1-y0), 1);
      fitTr = "translate(" + n2((FIT.x0+FIT.x1)/2 - k*(x0+x1)/2) + " " +
                             n2((FIT.y0+FIT.y1)/2 - k*(y0+y1)/2) + ") scale(" + n2(k) + ")";
      drawn = true;
    }
    if (drawn !== bonded){ r.L1.innerHTML = level1(bonded); drawn = bonded; }
    r.L1.setAttribute("transform", fitTr);
  }

  function paint(s){
    r.L1.setAttribute("opacity", n2(s.l1));
    r.L2.setAttribute("opacity", n2(s.l2));
    r.L3.setAttribute("opacity", n2(s.l3));
    r.l2_new .setAttribute("opacity", n2(s.l2));
  }

  const S = [
    { s:{l1:1,l2:0,l3:0}, l1state:false, cap:"1 · atoms",
      sub:"the primer's 3′ hydroxyl attacks the α phosphate of the incoming dNTP",
      note:"Read the colours first, the way we have all lecture. Everything red is what the enzyme has to have; everything grey is what it does not care about. So the whole of both backbones is red, the hydrogen bonds holding the two strands together are red, and every single base is grey. That is the polymerase's address, and it is a shape rather than a sequence: two strands annealed, with the upper one recessed, so a free three prime hydroxyl sits opposite template that has not been copied yet. The pairing has to be there — a polymerase will not extend a primer that is annealed to nothing — but which pairs they are is free. Give a polymerase that junction and it will extend it, whatever the letters are. And notice the incoming nucleotide is already paired with the base opposite it. That pairing is the whole of the enzyme's fidelity: the template picks the nucleotide, the enzyme just makes the bond. Now the chemistry. Every base it adds is one phosphodiester bond, and this is it. The free three prime hydroxyl is the nucleophile, and it attacks the alpha phosphate of the incoming dNTP. Notice what that means: the growing end is a three prime hydroxyl, so synthesis can only ever run five prime to three prime. There is no chemistry here for going the other way.",
      desc:"An all-atom drawing of a primed template. Six base pairs are annealed and the upper strand is then recessed by two, leaving two template bases uncopied and a free 3-prime hydroxyl at its end. Both backbones and every hydrogen bond are red, marking what the enzyme requires; every base is grey, marking that it reads none of them in particular. The incoming dNTP sits at the next position, already hydrogen bonded to the base opposite it, with its three phosphates labelled alpha, beta and gamma above, and a red curved arrow runs from the 3-prime hydroxyl up to the alpha phosphate." },
    { s:{l1:1,l2:0,l3:0}, l1state:true, cap:"1 · atoms",
      sub:"the bond forms; pyrophosphate leaves, and is hydrolysed",
      note:"The bond forms, and the beta and gamma phosphates leave together as pyrophosphate. Hydrolysing that pyrophosphate is what pulls the reaction forward and makes it effectively irreversible. That is the whole reason the substrate is a triphosphate and not a monophosphate — you are paying for the bond with the two phosphates you throw away. And look at what the molecule now is: the same junction as before, one base further along. The recessed end has moved one step and the enzyme's address is intact, which is why this runs as a cycle and not as a single event.",
      desc:"The new residue is now simply part of the upper strand, joined by an ordinary internal phosphate and paired with the template, so the recessed junction has moved one position along. The beta and gamma phosphates have left together above, faded and labelled pyrophosphate." },
    { s:{l1:0,l2:1,l3:0}, l1state:true, cap:"2 · letters",
      sub:"the same event — one base added at the 3′ end",
      note:"Same event, drawn as letters. Every one of those characters is a sugar, a phosphate and a base, and the join between any two of them is the bond you just watched form. Use this level whenever a position matters — a start site, a mismatch, a recognition sequence.",
      desc:"The same reaction redrawn as sequence: a short duplex written as paired letters, five prime to three prime, with the newest base at the 3-prime end of the top strand picked out in red." },
    { s:{l1:0,l2:0,l3:1}, l1state:true, cap:"3 · a line",
      sub:"the same event — and this is what the rest of the lecture draws",
      note:"And the same event again as a barbed line, which is what almost every diagram from here on uses. It carries direction and topology and nothing else. That is a feature, not laziness — but remember that each little step along that line is the chemistry from the first drawing.",
      desc:"The same reaction reduced to two antiparallel barbed lines, one per strand, the barb marking each 3-prime end. This is the level of abstraction used for the rest of the lecture." }
  ];

  function go(i, animated){
    const to = S[i].s;
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    r.sub.innerHTML = '<tspan font-weight="700" fill="'+INK+'">'+S[i].cap+
                      '</tspan>\u2003' + S[i].sub;
    drawL1(S[i].l1state);
    if (!cur || animated === false || reduce.matches){ cur = Object.assign({}, to); paint(cur); return; }
    const from = Object.assign({}, cur), t0 = performance.now(), dur = 800;
    const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1, (now-t0)/dur), e = ease(t), s = {};
      KEYS.forEach(k => s[k] = from[k] + (to[k]-from[k])*e);
      paint(s); cur = s;
      if (t < 1) raf = requestAnimationFrame(f); else raf = null;
    });
  }
  go(0, false);
  return { steps: S.map(x => ({ note:x.note, desc:x.desc })), go: go };
});
})();
