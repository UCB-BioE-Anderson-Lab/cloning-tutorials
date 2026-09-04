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
/* Level 2 is the same event as level 1, run to completion on a molecule
   long enough that the RUNNING is what you see. The red is the enzyme's
   grip, and it is the same red as level 1: what has to be there.

   Two numbers set its width, and they are not the same kind of number.
   BEHIND is a footprint -- polymerase structures show the enzyme holding
   roughly this much primer-template duplex upstream of the active site.
   AHEAD is a requirement, and it is 1: the templating base, the one being
   copied. Everything downstream of that is contacted but not needed, which
   is exactly why a fill-in reaction runs all the way to blunt -- when the
   last overhanging base is copied there is nothing downstream left, and
   there never had to be.

   Level 3 sits directly UNDER level 2 and runs off the same position, so
   the abstraction is not asserted, it is demonstrated: the red segment on
   the line is the red letters, one drawing above the other, moving
   together. */
const BEHIND = 6, AHEAD = 1;
const CO = {A:"T", T:"A", G:"C", C:"G"};
const L2TOP = "GCATTGACCTGAGTCATGCAGTTCGACATGCT";     /* the new strand   */
const L2BOT = L2TOP.split("").map(c => CO[c]).join(""); /* the template   */
const NL = L2TOP.length, P0 = 8;                       /* primer: 8 nt    */
const LSTEP = 40, LX = 800 - (NL-1)*LSTEP/2, LY = 430, LY2 = 496;
const XL = i => LX + i*LSTEP;
const L2_IN = 0.9, L2_PER = 0.155, L2_OUT = 1.25;
const L2_CYCLE = L2_IN + (NL-P0)*L2_PER + L2_OUT;
const held = (i,p) => i > p-BEHIND && i <= p;          /* the duplex it grips   */
const read = (i,p) => i > p && i <= p+AHEAD;           /* the base being copied */

/* p = index of the last base of the new strand */
function level2(p){
  let g = '<g font-family="ui-monospace,SFMono-Regular,Menlo,monospace" ' +
          'font-size="38" font-weight="600" text-anchor="middle">';
  for (let i = 0; i < NL; i++){
    const h = held(i,p);
    if (i <= p)
      g += '<text x="'+XL(i)+'" y="'+LY+'" fill="'+(h?RED:SLATE)+'">'+L2TOP[i]+'</text>';
    g += '<text x="'+XL(i)+'" y="'+LY2+'" fill="'+((h||read(i,p))?RED:INK)+'">'+L2BOT[i]+'</text>';
  }
  /* the 3' tick of the new strand travels with the end that is growing */
  g += '<g font-family="inherit" font-size="24" font-weight="600" fill="'+MUTED+'">' +
         '<text x="'+(LX-LSTEP)+'" y="'+LY+'">5&#8242;</text>' +
         '<text x="'+(LX-LSTEP)+'" y="'+LY2+'">3&#8242;</text>' +
         '<text x="'+XL(p+1)+'" y="'+LY+'">3&#8242;</text>' +
         '<text x="'+XL(NL)+'" y="'+LY2+'">5&#8242;</text></g>';
  return g + '</g>';
}

const LN1 = 648, LN2 = 706, BARB = 30;
function level3(p){
  const xa = LX - LSTEP/2, xb = XL(NL-1) + LSTEP/2;
  const w0 = XL(p-BEHIND+1) - LSTEP/2;
  const w1 = XL(p) + LSTEP/2;
  const w2 = Math.min(xb, XL(p+AHEAD) + LSTEP/2);
  const seg = (x1,y,x2,c) => '<path d="M'+n2(x1)+' '+y+'H'+n2(x2)+'" stroke="'+c+'"/>';
  /* barbs mark the 3' ends: the template's sits still on the left, the new
     strand's rides the growing end, so it is inside the grip and red */
  return '<g fill="none" stroke-width="4.6" stroke-linecap="round">' +
    seg(xb, LN2, xa, INK) +
      '<path d="M'+(xa+BARB)+' '+(LN2+16)+'L'+xa+' '+LN2+'" stroke="'+INK+'"/>' +
    seg(xa, LN1, w1, SLATE) +
    seg(w0, LN1, w1, RED) + seg(w0, LN2, w2, RED) +
      '<path d="M'+n2(w1-BARB)+' '+(LN1-16)+'L'+n2(w1)+' '+LN1+'" stroke="'+RED+'"/>' +
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
    '<g data-r="L1" opacity="0"></g><g data-r="L2" opacity="0"></g>' +
    '<g data-r="L3" opacity="0"></g>' +
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
  }

  /* Levels 2 and 3 are ONE animation with two renderers. The line is not a
     separate picture that happens to agree with the letters -- it is the
     same position drawn twice, so it can only ever agree. The loop keeps
     running across the step that reveals the line, which is why the two
     never fall out of step with each other. */
  let l2raf = null;
  function stopL2(){ if (l2raf){ cancelAnimationFrame(l2raf); l2raf = null; } }
  function frameL2(p){ r.L2.innerHTML = level2(p); r.L3.innerHTML = level3(p); }
  function runL2(){
    if (l2raf) return;
    if (reduce.matches){ frameL2(NL-1); return; }
    const t0 = performance.now();
    l2raf = requestAnimationFrame(function f(now){
      if (!slide.classList.contains("on")){ l2raf = null; return; }
      const t = ((now - t0)/1000) % L2_CYCLE;
      frameL2(t < L2_IN ? P0-1
                        : Math.min(NL-1, P0-1 + Math.floor((t - L2_IN)/L2_PER)));
      l2raf = requestAnimationFrame(f);
    });
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
      sub:"six pairs of duplex behind, one templating base ahead — the whole enzyme is that window",
      note:"Same event, drawn as letters, and now let it run. Every one of those characters is a sugar, a phosphate and a base, and the join between any two of them is the bond you just watched form. Watch the red, because the red is the same red as the last panel — it is what the enzyme has to have. Behind the growing end it holds about six base pairs of duplex; that is a footprint, and it is roughly what the structures show. Ahead of it, the red covers exactly one base: the one it is copying. That is not a footprint, that is the requirement, and it is worth knowing that it is one and not more. It is why a fill-in reaction goes all the way to blunt — when the last overhanging base has been copied there is nothing downstream left, and there never needed to be. So the whole enzyme is that little window, and all it does is slide. Use this level whenever a position matters — a start site, a mismatch, a recognition sequence.",
      desc:"The same reaction on a longer molecule, written as paired letters. A red window of six base pairs plus the single templating base ahead of it slides steadily left to right, and the new strand fills in behind it, five prime to three prime, until the template is fully copied. Then it repeats." },
    { s:{l1:0,l2:1,l3:1}, l1state:true, cap:"3 · a line",
      sub:"the same event — and this is what the rest of the lecture draws",
      note:"And now the same event as a barbed line, drawn underneath and running off the same position, so you can see the one become the other. The red segment on the line is the red letters above it. The barb is the three prime end, and it travels because that is the end being extended. This is what almost every diagram from here on uses: it carries direction and topology and nothing else. That is a feature, not laziness — but remember that each little step along that line is the chemistry from the first drawing.",
      desc:"Beneath the letters, the same reaction reduced to two antiparallel barbed lines, one per strand, the barb marking each 3-prime end. It animates in step with the letters above it, the red segment of line always covering the same positions as the red letters. This is the level of abstraction used for the rest of the lecture." }
  ];

  function go(i, animated){
    const to = S[i].s;
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    r.sub.innerHTML = '<tspan font-weight="700" fill="'+INK+'">'+S[i].cap+
                      '</tspan>\u2003' + S[i].sub;
    drawL1(S[i].l1state);
    if (i >= 2) runL2(); else stopL2();
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
  frameL2(P0-1);          /* never crossfade into an empty panel */
  go(0, false);
  return { steps: S.map(x => ({ note:x.note, desc:x.desc })), go: go };
});
})();
