/* ------------------------------------------------------------------ *
 * balls.js -- the lottery ball, drawn once and used by three slides.
 *
 * WHY THE DECK HAS THESE AT ALL.  Sources 5, 6 and 8 ran on a gumball
 * machine: twenty colours of gumball, equally common, drawn six at a
 * time.  JCA reframed it as a lottery draw on 2026-11-10 -- same
 * arithmetic, a far more familiar picture.  The gumball photographs are
 * gone and every ball in this section is drawn here.
 *
 * THE ONE TRAP IN THE REFRAME, and how the art answers it.  A real
 * lottery draws WITHOUT replacement, which is exactly the case this
 * slide is not making: 20^6 needs every position to see all twenty
 * numbers.  So the globe is not loaded with one ball per number.  It
 * holds MANY balls of each of twenty numbers, equally common -- the
 * gumball machine's premise, kept word for word -- and the drawn ball
 * is never removed from the pool.  That is why the churn keeps its
 * population constant while the six roll out, and why Seq2 and Seq3
 * repeat numbers on purpose.  Take that away and the right answer
 * becomes P(20,6) = 27,907,200, not 6.4E7.
 *
 * WHY NOT A GRADIENT.  A radial fill per colour means twenty <defs>
 * with twenty ids, and ids are page-global: three SVGs on one page
 * would collide, and the deck's PDF capture would resolve whichever it
 * met last.  A flat disc, one translucent white highlight and one
 * translucent dark crescent read as a sphere from the back of the room
 * and carry no ids at all.
 *
 * COLOUR.  Not the house palette, deliberately.  AUTHORING.txt spends
 * ink, blue, vermillion and amber on an attention ladder, and nothing
 * here is being singled out -- the twenty colours are an INVENTORY, the
 * same job the source's twenty gumball colours did.  The number on the
 * white disc is what identifies a ball; colour only makes the inventory
 * look big.  Read the deck in greyscale and nothing is lost.
 *
 * GEOMETRY.  A ball is drawn in its own unit frame: centre 0,0, radius
 * 50.  Callers place and scale it.  Everything downstream is in slide
 * pixels on the 1600x900 authoring box.
 *
 * Loaded by any section page that needs balls; fills [data-ball] and
 * [data-balls] placeholders at script-evaluation time, which for a
 * defer script is after parsing and before DOMContentLoaded, so the
 * deck's first fit() already measures the real drawing.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

/* Twenty numbers, twenty colours.  Billiard-ish: saturated, flat, and
   chosen so that no two ADJACENT numbers sit close in hue -- the eye
   reads a row of six, not a ramp. */
const COLOUR = [
  null,       /* 1-indexed; index 0 is never drawn */
  "#e8b63a",  /*  1 yellow    */  "#1f5fa8",  /*  2 blue      */
  "#c0392b",  /*  3 red       */  "#6c3fa0",  /*  4 purple    */
  "#e07b20",  /*  5 orange    */  "#1f7a4d",  /*  6 green     */
  "#8a2d2d",  /*  7 maroon    */  "#2b2b2b",  /*  8 black     */
  "#e2609a",  /*  9 pink      */  "#19a0a6",  /* 10 teal      */
  "#7ab02a",  /* 11 lime      */  "#4a4fb5",  /* 12 indigo    */
  "#b5651d",  /* 13 brown     */  "#d14a8c",  /* 14 magenta   */
  "#0f8ac9",  /* 15 sky       */  "#a0162f",  /* 16 crimson   */
  "#5c8a1f",  /* 17 olive     */  "#9b59b6",  /* 18 violet    */
  "#e8762a",  /* 19 tangerine */  "#2f6f8f"   /* 20 slate     */
];
const N = 20;

const n2 = v => Math.round(v * 10) / 10;

/* The sphere, without the number: flat disc, rim, highlight, crescent.
   Used on its own for the churn inside the globe, where a numeral at
   14px would be mud, and underneath every numbered ball. */
function sphere(colour){
  return '<circle r="50" fill="' + colour + '"/>' +
         '<path d="M -47 17 A 50 50 0 0 0 47 17 A 50 50 0 0 1 -47 17 Z" ' +
           'fill="#000" opacity="0.18"/>' +
         '<ellipse cx="-22" cy="-27" rx="14" ry="9" fill="#fff" ' +
           'opacity="0.5" transform="rotate(-32 -22 -27)"/>' +
         '<circle r="50" fill="none" stroke="#000" stroke-width="2.5" ' +
           'opacity="0.22"/>';
}

/* The numbered ball.  The white disc is the billiard convention and it
   is also the legibility answer: the numeral sits on white whatever the
   ball's colour, so 8 on black and 1 on yellow read the same. */
function ballBody(n){
  const c = COLOUR[((n - 1) % N + N) % N + 1];
  /* The white disc is 46% of the ball's diameter, which is the billiard
     proportion.  An earlier draft had it at 58% and every ball read as a
     ring rather than a sphere with a number on it -- at lecture distance
     the colour has to be the larger area or the inventory stops looking
     like twenty of anything. */
  return sphere(c) +
    '<circle r="23" fill="#fff"/>' +
    '<circle r="23" fill="none" stroke="#000" stroke-width="1.2" opacity="0.16"/>' +
    '<text y="1" text-anchor="middle" dominant-baseline="central" ' +
      'font-family="var(--sans, system-ui, sans-serif)" font-weight="700" ' +
      'font-size="29" fill="#111111">' + n + '</text>';
}

/* A placed ball: <g> at (x,y), radius r slide-pixels. */
function ballAt(n, x, y, r, extra){
  const s = r / 50;
  return '<g transform="translate(' + n2(x) + ',' + n2(y) + ') scale(' +
         n2(s * 1000) / 1000 + ')"' + (extra || "") + '>' + ballBody(n) + '</g>';
}
function sphereAt(n, x, y, r, extra){
  const s = r / 50;
  const c = COLOUR[((n - 1) % N + N) % N + 1];
  return '<g transform="translate(' + n2(x) + ',' + n2(y) + ') scale(' +
         n2(s * 1000) / 1000 + ')"' + (extra || "") + '>' + sphere(c) + '</g>';
}

/* A deterministic generator.  Every heap, every starting churn position
   and every drift frequency comes from this, so the drawing is the same
   on every machine, in every capture, and in the PDF. */
function rng(seed){
  let s = seed >>> 0;
  return function(){
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function svgWrap(viewBox, body, cls){
  return '<svg viewBox="' + viewBox + '" xmlns="http://www.w3.org/2000/svg" ' +
         'aria-hidden="true"' + (cls ? ' class="' + cls + '"' : "") + '>' +
         body + '</svg>';
}

/* ---- a heap of balls, for the section divider --------------------- *
 * Three rows, back to front, each row jittered and the back rows
 * smaller and tucked up -- enough to read as a pile rather than a
 * shelf, without a physics solver deciding where anything lands.
 * ------------------------------------------------------------------ */
function heap(count, w, h, seed){
  const rand = rng(seed || 7);
  const R = h * 0.17;
  const rows = [
    { y: h * 0.42, r: R * 0.74, n: Math.round(count * 0.34), sp: 0.84 },
    { y: h * 0.60, r: R * 0.88, n: Math.round(count * 0.33), sp: 0.90 },
    { y: h * 0.78, r: R * 1.00, n: count - Math.round(count * 0.34)
                                      - Math.round(count * 0.33), sp: 0.96 }
  ];
  let s = "";
  rows.forEach(function(row){
    const step = (w * row.sp) / row.n;
    const x0 = (w - step * (row.n - 1)) / 2;
    for (let i = 0; i < row.n; i++){
      const n = 1 + Math.floor(rand() * N);
      const x = x0 + step * i + (rand() - 0.5) * step * 0.30;
      const y = row.y + (rand() - 0.5) * row.r * 0.34;
      s += ballAt(n, x, y, row.r * (0.92 + rand() * 0.16));
    }
  });
  return s;
}

/* ---- public ------------------------------------------------------- */
const API = window.LotteryBall = {
  N: N,
  colour: function(n){ return COLOUR[((n - 1) % N + N) % N + 1]; },
  body: ballBody,
  at: ballAt,
  sphereAt: sphereAt,
  rng: rng,
  svg: svgWrap,
  heap: heap
};

/* ---- placeholders -------------------------------------------------- *
 *   <span data-ball="7">                one ball
 *   <span data-balls="6,3,14,1,8,2">    a row of them, touching
 *   <span data-heap="34">               a pile, for a divider
 * Each is replaced by an SVG that scales to its box.
 * ------------------------------------------------------------------ */
function fill(){
  document.querySelectorAll("[data-ball]").forEach(function(el){
    const n = parseInt(el.getAttribute("data-ball"), 10);
    el.innerHTML = svgWrap("-55 -55 110 110", ballBody(n));
  });

  document.querySelectorAll("[data-balls]").forEach(function(el){
    const list = el.getAttribute("data-balls").split(",")
                   .map(v => parseInt(v.trim(), 10)).filter(v => v > 0);
    /* glued: centres one diameter apart, so the spheres touch exactly --
       source 8 presses them together into a hexamer and the drawing has
       to show contact, not a row with gaps */
    const r = 50, gap = r * 2;
    let s = "";
    list.forEach(function(n, i){ s += ballAt(n, i * gap, 0, r); });
    const w = gap * (list.length - 1) + r * 2 + 6;
    el.innerHTML = svgWrap((-r - 3) + " " + (-r - 3) + " " + w + " " + (r * 2 + 6), s);
  });

  document.querySelectorAll("[data-heap]").forEach(function(el){
    const n = parseInt(el.getAttribute("data-heap"), 10) || 30;
    const seed = parseInt(el.getAttribute("data-seed"), 10) || 7;
    const W = 1200, H = 560;
    el.innerHTML = svgWrap("0 0 " + W + " " + H, heap(n, W, H, seed));
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
else fill();

API.fill = fill;

})();
