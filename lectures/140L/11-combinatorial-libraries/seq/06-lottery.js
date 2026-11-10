/* ------------------------------------------------------------------ *
 * 06-lottery.js : source 6, the draw.
 *
 * Registers:  lottery
 *
 * WHAT THE SLIDE HAS TO SHOW, in order:  that there are twenty numbers
 * and plenty of each; that a draw of six is a draw of six INDEPENDENT
 * positions; and that two draws may repeat a number, because that is
 * the whole difference between 20^6 and P(20,6).  The source made all
 * three points with a static grid of coloured gumballs.  The draw is
 * animated here because the independence of the positions is a
 * PROCESS -- six separate events out of the same unchanged pool -- and
 * a still picture of the result cannot show that the pool was never
 * depleted.
 *
 * WHY THE POOL IS NEVER DEPLETED, and why that is drawn rather than
 * stated.  balls.js says it at length: a real lottery draws without
 * replacement and would give the wrong answer here.  The churn keeps
 * exactly CHURN balls on screen for the whole animation; a drawn ball
 * is a NEW ball leaving the chute, never one of the churning ones
 * removed.  Count them at any frame and the globe is as full as it
 * started.
 *
 * THE CHURN IS NOT A SIMULATION.  Fifty balls under collision would
 * need a solver, would differ frame to frame, and would land somewhere
 * different in every PDF capture.  Each ball instead rides two
 * sinusoids of its own, inside a disc, at frequencies drawn from the
 * seeded generator: unsynchronised, so the eye reads turbulence, and
 * perfectly reproducible.  They are also drawn WITHOUT numbers -- a
 * numeral on a 15px sphere is mud, and the numbers that matter are the
 * six that come out.
 *
 * TIMING.  Six balls leave at 0.55s intervals, each taking 0.85s down
 * the chute and into its slot, so the draw runs about 5.2 seconds and
 * every ball is in the air while the next one is launched.  Faster and
 * it stops reading as six separate events; slower and it is dead air
 * in a lecture.
 *
 * REPLAY.  The animation plays only when the slide is ENTERED forward
 * on to the draw step.  Stepping back to it, or arriving with the
 * deck's reduced-motion or capture paths, paints the end state at
 * once -- check_section.js measures a settled frame, and nobody wants
 * five seconds of churn again on the way back.
 *
 * The authoring box is 1600x900, content x 110-1490, y 86-830.  The
 * bullets own the top; everything below y 330 is this drawing.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const B = window.LotteryBall;
const INK = "#111111", VERM = "#ba3a13", MUTED = "#767676";
const n2 = v => Math.round(v * 10) / 10;

/* ---- geometry, in slide pixels ------------------------------------ */
const GX = 395, GY = 556, GR = 168;      /* the globe                  */
const CHX = GX + 150, CHY = GY + 226;    /* where the chute lets go    */
const COL0 = 812, COLW = 112, BR = 45;   /* the six slots              */
const ROWY = [470, 592, 714];            /* Seq1, Seq2, Seq3           */
const HEADY = 408;                       /* the 1..6 column numbers    */
const CHURN = 60;

/* The three draws.  These are the SOURCE's three sequences, carried
   across one for one from the gumball grid: Seq1 all different, Seq2
   repeating 3 and 8, Seq3 leaning hard on 8 and 2.  The repeats are
   the argument, so they are not randomised. */
const DRAW = [
  [6, 3, 14, 1, 8, 2],
  [15, 8, 3, 3, 8, 14],
  [8, 8, 8, 2, 1, 2]
];

const LAUNCH = 0.55, FLIGHT = 0.85, LEAD = 0.35;
const TOTAL = LEAD + LAUNCH * 5 + FLIGHT;

const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;

/* ---- the four beats ----------------------------------------------- *
 * note: is the SOURCE's, verbatim, and verify_notes.py reads these
 * strings straight out of this array -- which is why the array is a
 * plain const with one note: per line and nothing computed in it.
 * The source's note has three sentences for what are now four beats,
 * so the beat it never covered carries add: instead.  That is the
 * data-note-add rule from AUTHORING.txt, in the form a sequence can
 * hold: add: is spoken, but it is NOT part of what the verifier
 * concatenates, so the verbatim claim still proves itself.
 * ------------------------------------------------------------------ */
const lottery = [
  {
    note:"Suppose we have a lottery machine, and there are 20 different numbers of balls inside, each occurring at the same frequency.",
    desc:"A lottery globe full of coloured numbered balls, churning, and beside it six numbered columns waiting for a draw." },
  {
    note:"If you pick 6 of them and get sequences of 6 numbers, how many different sequences are possible?",
    desc:"The draw runs: six balls leave the chute one after another and settle into the six columns, giving the first sequence — 6, 3, 14, 1, 8, 2. The globe stays as full as it started." },
  {
    note:"",
    add:"Here are two more draws from the same machine. Look at what repeats. Seq2 has two 3s and two 8s, Seq3 has three 8s. That is only possible because every ball goes back in the globe before the next one is drawn, and it is the whole reason the answer is 20 to the sixth and not 20 times 19 times 18.",
    desc:"Two more draws appear underneath, Seq2 and Seq3. Both repeat numbers — Seq2 has two 3s and two 8s, Seq3 has three 8s — because every ball drawn is replaced before the next one." },
  {
    note:"So, there are 20 at this position, 20 at that position, and so on for 6 positions, so there are 20^6 permutations, or around 60 million variants that potentially could exist within this space.",
    desc:"The count written out underneath, one factor per column: 20 choices at each of six positions." }
];

function slotX(i){ return COL0 + COLW * i; }

/* ---- the globe, drawn once ---------------------------------------- *
 * A glass sphere reads from three things and no more: a pale fill so
 * the balls inside sit on something, one bright rim, and a highlight
 * that is clearly ON the glass rather than in the pile.  The chute is
 * a tube off the lower right, because a draw that emerges from the
 * middle of the glass is a draw that came from nowhere.
 * ------------------------------------------------------------------ */
function globeBack(){
  /* The chute is one stroked line drawn twice -- a wide muted stroke for
     the wall, a narrower pale one on top for the bore.  Two strokes beat
     a four-point polygon here: the round cap gives the open end for
     free, and the tube keeps an even width however it is angled, which
     the polygon did not. */
  const x0 = GX + GR*0.50, y0 = GY + GR*0.74;
  return '<line x1="' + n2(x0) + '" y1="' + n2(y0) + '" x2="' + n2(CHX) +
           '" y2="' + n2(CHY) + '" stroke="' + MUTED + '" stroke-width="56" ' +
           'stroke-linecap="round"/>' +
         '<line x1="' + n2(x0) + '" y1="' + n2(y0) + '" x2="' + n2(CHX) +
           '" y2="' + n2(CHY) + '" stroke="#e8edf1" stroke-width="48" ' +
           'stroke-linecap="round"/>' +
         '<circle cx="' + GX + '" cy="' + GY + '" r="' + GR + '" fill="#eef2f5"/>';
}
function globeFront(){
  return '<circle cx="' + GX + '" cy="' + GY + '" r="' + GR + '" fill="none" ' +
           'stroke="' + MUTED + '" stroke-width="3"/>' +
         '<path d="M ' + n2(GX - GR*0.62) + ' ' + n2(GY - GR*0.55) +
           ' A ' + GR + ' ' + GR + ' 0 0 1 ' + n2(GX + GR*0.22) + ' ' +
           n2(GY - GR*0.96) + '" fill="none" stroke="#fff" stroke-width="12" ' +
           'stroke-linecap="round" opacity="0.75"/>' +
         '<rect x="' + n2(GX - 58) + '" y="' + n2(GY + GR - 8) + '" width="116" ' +
           'height="24" rx="7" fill="' + MUTED + '" opacity="0.35"/>' +
         /* the lip the ball rolls out on to: short, horizontal, and the
            one thing that stops the chute reading as a pan handle */
         '<rect x="' + n2(CHX - 6) + '" y="' + n2(CHY + 16) + '" width="92" ' +
           'height="13" rx="6" fill="' + MUTED + '" opacity="0.45"/>';
}

/* ---- the churning pool -------------------------------------------- *
 * Derived ONCE, at module level, and used by both the markup and the
 * frame loop.  An earlier draft seeded a second generator in the
 * factory and re-derived these, which works only as long as the two
 * call sequences stay character-for-character identical -- a trap, and
 * exactly the kind that fails silently as a drifting pile.
 * ------------------------------------------------------------------ */
const CH = (function(){
  const rand = B.rng(20251110), out = [];
  for (let i = 0; i < CHURN; i++){
    const r = 13 + rand() * 5;
    out.push({
      n:   1 + Math.floor(rand() * B.N),
      /* sqrt() so the pool is spread evenly over the disc's AREA rather
         than bunched at the centre, and the ceiling leaves room for the
         ball's own radius inside the glass */
      rad: Math.sqrt(rand()) * (GR - r - 6),
      ph1: rand() * Math.PI * 2, ph2: rand() * Math.PI * 2,
      f1:  0.9 + rand() * 1.5,   f2:  0.7 + rand() * 1.4,
      r:   r
    });
  }
  return out;
})();

/* ---- markup -------------------------------------------------------- */
function build(){
  let s = globeBack();
  CH.forEach(function(c, i){
    s += B.sphereAt(c.n, GX, GY, c.r, ' data-c="' + i + '"');
  });
  s += globeFront();

  /* the six in flight / at rest */
  for (let i = 0; i < 6; i++){
    s += B.at(DRAW[0][i], CHX, CHY, BR, ' data-f="' + i + '" opacity="0"');
  }

  /* column numbers and row labels */
  for (let i = 0; i < 6; i++){
    s += '<text x="' + slotX(i) + '" y="' + HEADY + '" text-anchor="middle" ' +
         'font-family="inherit" font-size="30" fill="' + VERM + '">' + (i+1) +
         '</text>';
  }
  ROWY.forEach(function(y, r){
    s += '<text data-row="' + r + '" x="' + (COL0 - 92) + '" y="' + (y + 11) +
         '" text-anchor="end" font-family="inherit" font-size="30" fill="' +
         VERM + '" opacity="0">Seq' + (r+1) + '</text>';
  });

  /* rows 2 and 3, placed but hidden until their step */
  for (let r = 1; r < 3; r++){
    for (let i = 0; i < 6; i++){
      s += B.at(DRAW[r][i], slotX(i), ROWY[r], BR,
                ' data-r="' + r + '" opacity="0"');
    }
  }

  s += '<text data-prod="1" x="' + (COL0 - 92) + '" y="818" ' +
       'font-family="ui-monospace,SFMono-Regular,Menlo,monospace" ' +
       'font-size="30" fill="' + VERM + '" opacity="0">' +
       '20* 20* 20* 20* 20* 20 = 20^6 = 6.4E7</text>';
  return s;
}

/* ------------------------------------------------------------------ */
window.Deck.sequence("lottery", function(slide){
  const host = slide.querySelector("[data-draw]");
  if (!host || !B) return { steps: [{}, {}, {}, {}], go: function(){} };

  host.innerHTML = B.svg("0 0 1600 900", build(), "drawsvg");
  const svg = host.querySelector("svg");

  const churnEls = Array.from(svg.querySelectorAll("[data-c]"));
  const flyEls   = Array.from(svg.querySelectorAll("[data-f]"));
  const rowEls   = Array.from(svg.querySelectorAll("[data-r]"));
  const rowLab   = Array.from(svg.querySelectorAll("[data-row]"));
  const prodEl   = svg.querySelector("[data-prod]");
  /* the bullets live in HTML, as prose should; the sequence only decides
     when they are on screen */
  const b2 = slide.querySelector("[data-b2]");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let raf = null, prev = -1;

  function place(el, x, y, r){
    el.setAttribute("transform", "translate(" + n2(x) + "," + n2(y) +
                    ") scale(" + n2(r / 50 * 1000) / 1000 + ")");
  }

  function paintChurn(t){
    CH.forEach(function(c, i){
      /* ONE angle and a breathing radius, not a sinusoid per axis.  Per
         axis gave each ball a bounding BOX of side 2*rad, whose corners
         are rad*1.41 from the centre, so the outermost balls swung
         clean through the glass -- which is what the first render did.
         Driving x and y from the same angle keeps every ball inside a
         circle of its own rad, and rad already allows for its radius. */
      const a = c.ph1 + t * c.f1;
      const rr = c.rad * (0.82 + 0.18 * Math.sin(c.ph2 + t * c.f2));
      place(churnEls[i], GX + Math.cos(a) * rr, GY + Math.sin(a) * rr, c.r);
    });
  }

  /* The flight: out of the chute, a shallow arc up to the slot.  The
     arc matters -- a straight line from chute to slot reads as a
     teleport, and the ball has to look like it was thrown. */
  function flight(i, u){
    const x0 = CHX + 14, y0 = CHY + 8, x1 = slotX(i), y1 = ROWY[0];
    const cx = (x0 + x1) / 2, cy = Math.min(y0, y1) - 120;
    const v = 1 - u;
    return [ v*v*x0 + 2*v*u*cx + u*u*x1,
             v*v*y0 + 2*v*u*cy + u*u*y1 ];
  }

  function paintDraw(t){
    for (let i = 0; i < 6; i++){
      const t0 = LEAD + LAUNCH * i;
      if (t < t0){ flyEls[i].setAttribute("opacity", "0"); continue; }
      const u = Math.min(1, (t - t0) / FLIGHT);
      flyEls[i].setAttribute("opacity", "1");
      const p = flight(i, ease(u));
      place(flyEls[i], p[0], p[1], BR);
    }
    rowLab[0].setAttribute("opacity", t > LEAD + 0.2 ? "1" : "0");
  }

  function endState(){
    paintChurn(TOTAL);
    for (let i = 0; i < 6; i++){
      flyEls[i].setAttribute("opacity", "1");
      place(flyEls[i], slotX(i), ROWY[0], BR);
    }
    rowLab[0].setAttribute("opacity", "1");
  }

  function startState(){
    paintChurn(0);
    flyEls.forEach(el => el.setAttribute("opacity", "0"));
    rowLab[0].setAttribute("opacity", "0");
  }

  function stop(){ if (raf){ cancelAnimationFrame(raf); raf = null; } }

  function run(){
    stop();
    const t0 = performance.now();
    raf = requestAnimationFrame(function f(now){
      const t = (now - t0) / 1000;
      paintChurn(t);
      paintDraw(t);
      if (t < TOTAL) raf = requestAnimationFrame(f);
      else { raf = null; endState(); }
    });
  }

  function go(i, animated){
    stop();
    if (b2) b2.style.opacity = i >= 1 ? "1" : "0";
    rowEls.forEach(function(el){
      el.setAttribute("opacity", i >= 2 ? "1" : "0");
    });
    rowLab[1].setAttribute("opacity", i >= 2 ? "1" : "0");
    rowLab[2].setAttribute("opacity", i >= 2 ? "1" : "0");
    prodEl.setAttribute("opacity", i >= 3 ? "1" : "0");

    if (i === 0){ startState(); prev = i; return; }
    /* animate only on the forward entry to the draw */
    if (i === 1 && prev === 0 && animated !== false && !reduce.matches) run();
    else endState();
    prev = i;
  }

  go(0, false);

  return {
    steps: lottery.map(function(x){
      const spoken = x.note && x.add ? x.note + "  " + x.add : (x.note || x.add || "");
      return { note: spoken, desc: x.desc };
    }),
    go: go
  };
});

})();
