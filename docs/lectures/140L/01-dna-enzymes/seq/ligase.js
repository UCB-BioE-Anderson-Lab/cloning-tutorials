/* ------------------------------------------------------------------ *
 * ligase.js — what a ligase actually needs to see at a junction.
 *
 * Registers:   register   blunt -> sticky -> sealed -> gap   (4 steps)
 *
 * The argument, one click each:
 *   1. blunt ends: two molecules with NOTHING holding them together
 *   2. sticky ends: four base pairs hold them in register; what is left
 *      is a NICK in each strand
 *   3. ligase seals both nicks; two molecules become one
 *   4. remove a single base and it is a GAP, not a nick — ligase cannot
 *      bridge it, a polymerase has to fill it first
 *
 * Level of iconography: LETTERS. Position is the whole point here —
 * which base pairs with which, and exactly which base is missing.
 * The sugar-phosphate backbone is drawn as a line outside each strand
 * so that a break is VISIBLE: a nick is a 30px break, a gap is 100px,
 * and a sealed strand has no break at all. Every 3' end carries a half
 * barb (never an arrowhead), laid back on the outer side of the duplex.
 *
 * The sequence is an EcoRI junction (G^AATTC), which is the same site
 * the blunting question on the next slide uses.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", SLATE = "#004373", RED = "#ba3a13", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";
const n2 = v => Math.round(v*10)/10;

/* ---- the duplex ------------------------------------------------- */
/*  col:  0 1 2 3 4 5 6 7 8 9 10 11 12 13
 *  top:  g a t t c G A A T T  C  g  c  g
 *  bot:  c t a a g C T T A A  G  c  g  c
 *
 *  EcoRI cuts G^AATTC, so the annealed pair is:
 *    left molecule  = top cols 0-5,  bottom cols 0-9
 *    right molecule = top cols 6-13, bottom cols 10-13
 *  and cols 6-9 are the four base pairs of the overhang — each half of
 *  which belongs to the OTHER molecule. That is what "held in register"
 *  means, and it is the only thing this drawing has to make visible.  */
const TOP = "gattcGAATTCgcg";
const BOT = "ctaagCTTAAGcgc";
const N = 14;

const COL = 72, X0 = 300;
const cx = i => X0 + i * COL;
const LEFTX = cx(0) - COL/2;            /* 264  */
const RIGHTX = cx(N-1) + COL/2;         /* 1272 */
const bnd = i => cx(i) + COL/2;         /* boundary between col i and i+1 */

const YTL = 500, YBL = 578;             /* letter baselines            */
const YTB = 448, YBB = 616;             /* backbone lines, outside     */
const YLAB = 380, YEND = 416, YCALL = 700;
const RUNG0 = 512, RUNG1 = 532;         /* base-pair ticks, clear of both rows */

const BARB = 26, BW = 0.49;             /* half barb, as elsewhere     */
const HALF = 15;                        /* half a nick's width         */
const SEP  = 34;                        /* extra pull-apart, blunt step*/

/* A strand from (x1,y1) to (x2,y2); the 3' tip is (x2,y2). */
function strand(x1,y1,x2,y2){
  if (Math.abs(x2-x1) < 1 && Math.abs(y2-y1) < 1) return "";
  const th = Math.atan2(y1-y2, x1-x2);
  const bx = x2 + BARB*Math.cos(th + BW), by = y2 + BARB*Math.sin(th + BW);
  return "M"+n2(x1)+" "+n2(y1)+"L"+n2(x2)+" "+n2(y2)+
         "M"+n2(bx)+" "+n2(by)+"L"+n2(x2)+" "+n2(y2);
}
function plain(x1,y1,x2,y2){
  if (Math.abs(x2-x1) < 1) return "";
  return "M"+n2(x1)+" "+n2(y1)+"L"+n2(x2)+" "+n2(y2);
}

/* ---- the four states, as tweenable numbers ---------------------- *
 * splitT / splitB: how many columns belong to the LEFT molecule, so
 * that during the blunt->sticky move each letter travels with the
 * molecule it belongs to.
 * xs: [tLx0 tLx1 tRx0 tRx1  bLx0 bLx1 bRx0 bRx1] — the ends of the
 * four backbone segments. Where a pair meets (tLx1 === tRx0) the
 * strand is continuous: that is what "sealed" looks like.           */
function mk(sep, splitT, splitB, xs, o6){
  const s = { sep:sep, o6:o6,
              tLx0:xs[0], tLx1:xs[1], tRx0:xs[2], tRx1:xs[3],
              bLx0:xs[4], bLx1:xs[5], bRx0:xs[6], bRx1:xs[7] };
  for (let i = 0; i < N; i++){
    s["st"+i] = i < splitT ? -1 : 1;
    s["sb"+i] = i < splitB ? -1 : 1;
  }
  return s;
}

const CUT_B = bnd(6);                   /* 768 — the blunt cut         */
const NICK_T = bnd(5);                  /* 696 — top nick              */
const NICK_B = bnd(9);                  /* 984 — bottom nick           */
const GAP_R  = bnd(6);                  /* 768 — right of the 1nt gap  */

const STEPS = [
{ s: mk(SEP, 7, 7,
        [LEFTX-SEP, CUT_B-HALF-SEP, CUT_B+HALF+SEP, RIGHTX+SEP,
         LEFTX-SEP, CUT_B-HALF-SEP, CUT_B+HALF+SEP, RIGHTX+SEP], 1),
  label: "blunt ends — two molecules",
  call:  "nothing is holding them together",
  note: "Start with the hard case. These are two blunt-cut molecules, and there is literally nothing between them — no base pairing, no hydrogen bonds, nothing that holds one end against the other. They find each other by collision, and the only thing that keeps them together long enough for chemistry to happen is the ligase itself. That is why a blunt ligation wants more enzyme, more DNA, a longer and colder incubation, and often a crowding agent such as PEG. Blunt ligation is not forbidden — it works — it is just enormously less efficient, and when a blunt ligation gives you no colonies, this picture is the reason.",
  desc: "Two separate double-stranded DNAs drawn as two rows of letters, each cut straight across, with a wide empty space between them. Neither strand is continuous across the space." },

{ s: mk(0, 6, 10,
        [LEFTX, NICK_T-HALF, NICK_T+HALF, RIGHTX,
         LEFTX, NICK_B-HALF, NICK_B+HALF, RIGHTX], 1),
  label: "sticky ends — held in register",
  call:  "4 base pairs, 2 nicks",
  note: "Now give the same two molecules four-base overhangs — an EcoRI cut. The overhangs are complementary, so they base-pair, and those four base pairs are the entire reason sticky ends beat blunt. It is not that ligase prefers a sticky end. It is that the base pairing physically holds the two molecules in register, end to end and in frame, long enough for the enzyme to find the junction and act. Four pairs are weak and transient, which is why ligations are often run cold, but they are infinitely better than nothing. And look at what the annealed structure actually is: not one break but two, one in each strand, and each one is a nick.",
  desc: "The two molecules slide together. Four bases from each molecule pair with four from the other, marked with vertical ticks. Each strand is now broken at exactly one point — the top strand at the left edge of the paired region, the bottom strand at the right edge. Labels mark a 3-prime hydroxyl and a 5-prime phosphate facing each other across the top break." },

{ s: mk(0, 6, 10,
        [LEFTX, NICK_T, NICK_T, RIGHTX,
         LEFTX, NICK_B, NICK_B, RIGHTX], 1),
  label: "ligase seals both nicks — one molecule",
  call:  "2 bonds, 2 ATP",
  note: "That is the substrate. At each nick a 3' hydroxyl and a 5' phosphate sit directly against one another with nothing in between. Be exact about the direction: the phosphate that ends up in the new bond is the one already sitting on the downstream 5' end, and the upstream 3' hydroxyl is the nucleophile that attacks it. Ligase spends one ATP to make that happen — it adenylylates itself, hands the AMP to the 5' phosphate to activate it, and the 3' hydroxyl then attacks and displaces the AMP. Two nicks, two bonds, two ATP, and the two molecules are one molecule. That ATP dependence is practical, not trivia: buffer that has been thawed twenty times has no usable ATP left in it, and a ligation in dead buffer fails silently.",
  desc: "Both breaks close. Both strands now run continuously from one end to the other as a single molecule, with a half barb only at the two true 3-prime ends. Two short vermillion marks show where the new bonds were made." },

{ s: mk(0, 6, 10,
        [LEFTX, NICK_T-HALF, GAP_R+HALF, RIGHTX,
         LEFTX, NICK_B-HALF, NICK_B+HALF, RIGHTX], 0),
  label: "one base missing — a gap, not a nick",
  call:  "polymerase first, then ligase",
  note: "Now the failure mode nobody sees coming. Take that same junction and remove a single base from the top strand. It looks almost the same, but it is not a nick, it is a gap, and T4 ligase cannot bridge it. There is no bond available to make: the 3' hydroxyl and the 5' phosphate are a whole nucleotide apart. A polymerase has to put the missing base in first, using the bottom strand as template, and only then can ligase seal the nick that remains. This is exactly the division of labour inside a Gibson reaction — exonuclease chews back, the ends anneal, polymerase fills the gaps, ligase seals the nicks — and it is why all three are in the tube. If you ever design an assembly where the ends anneal but a base is unaccounted for, you have designed a gap, and no amount of extra ligase will rescue it.",
  desc: "The molecules stay annealed, but one letter is now missing from the top strand, leaving an empty position and a break several times wider than a nick. The unpaired base opposite it on the bottom strand is marked in vermillion with a dashed tick standing in for its missing partner." }
];

const KEYS = Object.keys(STEPS[0].s);

/* ---------------------------------------------------------------- */
window.Deck.sequence("register", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");

  let h = '<g data-r="bb" fill="none" stroke="'+INK+'" stroke-width="3.4" ' +
            'stroke-linecap="round" stroke-linejoin="round">' +
            '<path data-r="tL"/><path data-r="tR"/><path data-r="bL"/><path data-r="bR"/></g>';

  h += '<g font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="52" ' +
         'font-weight="600" text-anchor="middle">';
  for (let i = 0; i < N; i++){
    h += '<text data-r="t'+i+'" y="'+YTL+'" fill="'+INK+'">'+TOP[i]+'</text>' +
         '<text data-r="b'+i+'" y="'+YBL+'" fill="'+INK+'">'+BOT[i]+'</text>';
  }
  h += '</g>';

  h += '<g font-family="inherit" font-size="26" fill="'+MUTED+'">' +
         '<text data-r="e0" y="'+YTL+'" text-anchor="end">5&#8242;</text>' +
         '<text data-r="e1" y="'+YTL+'" text-anchor="start">3&#8242;</text>' +
         '<text data-r="e2" y="'+YBL+'" text-anchor="end">3&#8242;</text>' +
         '<text data-r="e3" y="'+YBL+'" text-anchor="start">5&#8242;</text></g>';

  h += '<g data-r="ann" fill="none" stroke-linecap="round"></g>';
  h += '<text data-r="lab" x="800" y="'+YLAB+'" text-anchor="middle" font-family="inherit" ' +
         'font-weight="700" font-size="30" fill="'+INK+'"></text>';
  h += '<text data-r="call" x="800" y="'+YCALL+'" text-anchor="middle" font-family="inherit" ' +
         'font-weight="700" font-size="32" fill="'+RED+'" opacity="0"></text>';

  svg.innerHTML = h;
  slide.appendChild(svg);

  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);
  const tl = [], bl = [];
  for (let i = 0; i < N; i++){ tl.push(r["t"+i]); bl.push(r["b"+i]); }

  let sealed = false;

  function paint(s){
    for (let i = 0; i < N; i++){
      tl[i].setAttribute("x", n2(cx(i) + s["st"+i] * s.sep));
      bl[i].setAttribute("x", n2(cx(i) + s["sb"+i] * s.sep));
    }
    tl[6].setAttribute("opacity", n2(Math.min(1, Math.max(0, s.o6))));

    /* top strand runs 5'->3' left to right: the 3' tip is the RIGHT end */
    r.tL.setAttribute("d", sealed ? plain (s.tLx0, YTB, s.tLx1, YTB)
                                  : strand(s.tLx0, YTB, s.tLx1, YTB));
    r.tR.setAttribute("d", strand(s.tRx0, YTB, s.tRx1, YTB));
    /* bottom strand is antiparallel: its 3' tip is the LEFT end */
    r.bL.setAttribute("d", strand(s.bLx1, YBB, s.bLx0, YBB));
    r.bR.setAttribute("d", sealed ? plain (s.bRx1, YBB, s.bRx0, YBB)
                                  : strand(s.bRx1, YBB, s.bRx0, YBB));

    r.e0.setAttribute("x", n2(s.tLx0 - 18));
    r.e1.setAttribute("x", n2(s.tRx1 + 18));
    r.e2.setAttribute("x", n2(s.bLx0 - 18));
    r.e3.setAttribute("x", n2(s.bRx1 + 18));
  }

  function endlab(x, txt, anchor, fill){
    return '<text x="'+n2(x)+'" y="'+YEND+'" text-anchor="'+anchor+'" font-family="inherit" ' +
           'font-size="24" font-weight="700" stroke="none" fill="'+fill+'">'+txt+'</text>';
  }

  /* Everything that is a colour or a mark rather than a position. */
  function decorate(i){
    sealed = (i === 2);
    r.lab.textContent  = STEPS[i].label;
    r.call.textContent = STEPS[i].call || "";
    r.call.setAttribute("opacity", STEPS[i].call ? "1" : "0");
    for (let k = 0; k < N; k++){
      tl[k].setAttribute("fill", INK);
      bl[k].setAttribute("fill", INK);
    }
    let a = "";
    if (i === 1){
      for (let k = 6; k <= 9; k++){
        tl[k].setAttribute("fill", SLATE);
        bl[k].setAttribute("fill", SLATE);
        a += '<path d="M'+cx(k)+' '+RUNG0+'V'+RUNG1+'" stroke="'+SLATE+'" stroke-width="3"/>';
      }
      a += endlab(NICK_T - HALF - 8, "3&#8242;-OH", "end",   SLATE) +
           endlab(NICK_T + HALF + 8, "5&#8242;-P",  "start", SLATE);
    }
    if (i === 2){
      a += '<path d="M'+NICK_T+' '+(YTB-14)+'V'+(YTB+14)+'" stroke="'+RED+'" stroke-width="4.6"/>' +
           '<path d="M'+NICK_B+' '+(YBB-14)+'V'+(YBB+14)+'" stroke="'+RED+'" stroke-width="4.6"/>';
    }
    if (i === 3){
      bl[6].setAttribute("fill", RED);
      a += '<path d="M'+cx(6)+' '+RUNG0+'V'+RUNG1+'" stroke="'+RED+'" stroke-width="3" ' +
             'stroke-dasharray="7 7"/>';
      a += endlab(NICK_T - HALF - 8, "3&#8242;-OH", "end",   RED) +
           endlab(GAP_R  + HALF + 8, "5&#8242;-P",  "start", RED);
    }
    r.ann.innerHTML = a;
  }

  let cur = Object.assign({}, STEPS[0].s), raf = null;

  function go(i, animated){
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    decorate(i);
    const to = STEPS[i].s;
    if (animated === false || reduce.matches){
      cur = Object.assign({}, to); paint(cur); return;
    }
    const from = Object.assign({}, cur), t0 = performance.now(), dur = 700;
    const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1, (now - t0)/dur), e = ease(t);
      KEYS.forEach(k => cur[k] = from[k] + (to[k] - from[k]) * e);
      paint(cur);
      if (t < 1) raf = requestAnimationFrame(f); else raf = null;
    });
  }

  decorate(0);
  paint(cur);
  return { steps: STEPS.map(x => ({ note:x.note, desc:x.desc })), go: go };
});
})();
