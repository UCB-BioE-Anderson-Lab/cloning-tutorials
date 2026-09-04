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
const NC = 6, PRIMER = 4;               /* six pairs; the primer covers four */
const SEQ = "GATCAG";
const X0  = (1600 - (NC-1)*188) / 2;
/* Everything between the slide's bullet and the caption line belongs to
   the drawing. The level marker used to sit on its own line above the
   panel, which cost ~90px of height the chemistry needed more; it now
   opens the caption instead. */
const FIT = {x0:110, y0:206, x1:1490, y1:788};

const roles = () => Array.from({length:NC}, () => ({bb:"hot", base:"bg"}));
const mk = (r, e) => window.DNAModel.make({top:SEQ, range:r, roleTop:roles(), roleBot:roles(),
                       ends:Object.assign({t5:"oh", t3:"oh", b5:"oh", b3:"oh"}, e||{})});

/* a phosphate drawn flat: the bridges run left and right, so the two
   non-bridging oxygens go above and below */
function phos(x, y, c, term, d){
  d = d || 1;
  let g = bond([x-4,y-24],[x-4,y-52], 2.6, c) + bond([x+4,y-24],[x+4,y-52], 2.6, c) +
          lab([x, y-72], "O", c) +
          bond([x,y+24],[x,y+52], 2.6, c) + lab([x, y+72], "O&#8315;", c);
  if (term) g += bond([x+d*24,y],[x+d*52,y], 2.6, c) + lab([x+d*80, y], "O&#8315;", c);
  return g + lab([x,y], "P", c, 25);
}
function lab(p, t, c, sz){
  const z = sz || 21;
  return '<circle cx="'+n2(p[0])+'" cy="'+n2(p[1])+'" r="'+n2(z*0.66)+'" fill="#fff"/>' +
         '<text x="'+n2(p[0])+'" y="'+n2(p[1]+z*0.34)+'" text-anchor="middle" font-size="'+n2(z)+
         '" font-weight="600" fill="'+c+'">'+t+'</text>';
}
/* alpha is the odd one out: it bridges LEFT to beta and DOWN to the
   nucleotide's own 5' oxygen, so its spare oxygens go up and right */
function phosA(x, y, c, down){
  return bond([x-4,y-24],[x-4,y-52], 2.6, c) + bond([x+4,y-24],[x+4,y-52], 2.6, c) +
         lab([x, y-72], "O", c) +
         bond([x+24,y],[x+52,y], 2.6, c) + lab([x+80, y], "O&#8315;", c) +
         bond([x, y+24], [x, down-18], 2.6, c) +
         lab([x,y], "P", c, 25);
}

const GREEK = (x, y, t) => '<text x="'+n2(x)+'" y="'+n2(y)+'" text-anchor="middle" ' +
  'font-size="26" font-style="italic" fill="'+MUTED+'">'+t+'</text>';

/* bonded = the phosphodiester has formed, so the dNTP is simply the fifth
   residue of the top strand and what is left over is pyrophosphate */
function level1(bonded){
  const M = window.DNAModel;
  let g = M.draw(mk({top:[0, PRIMER + (bonded?1:0)], bot:[0,NC]}), X0);
  const oh3 = M.anchors.term.top3;

  if (!bonded){
    /* the free dNTP, sitting over the base that decides which one it is */
    g += M.draw(mk({top:[PRIMER, PRIMER+1], bot:[NC,NC]}, {t5:"o"}), X0);
    const o5 = M.anchors.term.top5;
    /* The triphosphate runs flat, above the primer, rather than straight up
       out of the slide: alpha has to sit clear of the 3' hydroxyl it is
       about to be attacked by, and there is nothing else in that band. */
    const AX = o5[0] - 4, AY = o5[1] - 132, ST = 148;
    g += phosA(AX, AY, RED, o5[1]);
    g += bond([AX-24,AY],[AX-ST+24,AY], 2.6, RED) + lab([AX-ST/2, AY], "O", RED);
    g += phos(AX-ST, AY, RED);
    g += bond([AX-ST-24,AY],[AX-2*ST+24,AY], 2.6, RED) + lab([AX-1.5*ST, AY], "O", RED);
    g += phos(AX-2*ST, AY, RED, true, -1);
    g += GREEK(AX, AY-108, "&#945;") + GREEK(AX-ST, AY-108, "&#946;") +
         GREEK(AX-2*ST, AY-108, "&#947;");
    /* the attack */
    g += '<path fill="none" stroke="'+RED+'" stroke-width="3.4" marker-end="url(#lvArrow)" d="M' +
         n2(oh3[0]+14)+' '+n2(oh3[1]-22)+'Q'+n2(oh3[0]+96)+' '+n2(AY+74)+' '+
         n2(AX-14)+' '+n2(AY+40)+'"/>';
  } else {
    /* beta and gamma, leaving together */
    const AX = M.anchors.phos.top[PRIMER-1][0] - 150, AY = 118, ST = 148;
    g += '<g opacity="0.6">' + phos(AX, AY, RED, true, 1) +
         bond([AX-24,AY],[AX-ST+24,AY], 2.6, RED) + lab([AX-ST/2, AY], "O", RED) +
         phos(AX-ST, AY, RED, true, -1) + '</g>';
    g += '<text x="'+n2(AX-2*ST-38)+'" y="'+n2(AY+8)+'" text-anchor="end" font-size="26" ' +
           'font-weight="700" fill="'+MUTED+'">pyrophosphate</text>';
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
  let cur = null, raf = null, drawn = null;

  /* The all-atom panel is drawn, not tweened -- like every other operator
     in the deck. Only its opacity crossfades against levels 2 and 3.
     It is scaled to the space left between the caption and the subtitle
     once, from its own bounding box, so the panel is never clipped and
     never has to be re-measured by hand when the sequence changes. */
  function drawL1(bonded){
    if (drawn === bonded) return;
    drawn = bonded;
    r.L1.removeAttribute("transform");
    r.L1.innerHTML = level1(bonded);
    const b = r.L1.getBBox();
    if (!b.width || !b.height){ drawn = null; return; }   /* slide not shown yet */
    const k = Math.min((FIT.x1-FIT.x0)/b.width, (FIT.y1-FIT.y0)/b.height, 1);
    r.L1.setAttribute("transform",
      "translate(" + n2((FIT.x0+FIT.x1)/2 - k*(b.x+b.width/2)) + " " +
                     n2((FIT.y0+FIT.y1)/2 - k*(b.y+b.height/2)) + ") scale(" + n2(k) + ")");
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
      note:"Read the colours first, the way we have all lecture. Everything red is what the enzyme has to have; everything grey is what it does not care about. So the whole of both backbones is red and every single base is grey. That is the polymerase's address, and it is a shape rather than a sequence: two strands annealed, with the upper one recessed, so a free three prime hydroxyl sits opposite template that has not been copied yet. Give a polymerase that junction and it will extend it, whatever the letters are. Now the chemistry. Every base it adds is one phosphodiester bond, and this is it. The free three prime hydroxyl is the nucleophile, and it attacks the alpha phosphate of the incoming dNTP. Notice what that means: the growing end is a three prime hydroxyl, so synthesis can only ever run five prime to three prime. There is no chemistry here for going the other way.",
      desc:"An all-atom drawing of a primed template: two annealed strands with both backbones in red, marking what the enzyme requires, and every base in grey, marking that it reads none of them. The upper strand is recessed, leaving two template bases uncopied and a free 3-prime hydroxyl at its end. Above sits the incoming dNTP with its three phosphates labelled alpha, beta and gamma, and a red curved arrow runs from the 3-prime hydroxyl up to the alpha phosphate." },
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
