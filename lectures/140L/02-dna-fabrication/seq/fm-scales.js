/* ------------------------------------------------------------------ *
 * fm-scales.js: the scale ladder that opens the lecture.
 *
 * Four rungs, each an order of magnitude or two above the last:
 *
 *     bases      1bp        the letters themselves
 *     "parts"    0.1-3kb    one gene, drawn as one arrow
 *     "devices"  1-20kb     several genes, drawn as several arrows
 *     genomes    0.5-10Mb   a circular map
 *
 * The original is one flat picture, so the room has to take in four
 * scales at once and work out afterwards that they are a progression.
 * Built a rung at a time it is a progression by construction: each
 * click adds one connector and one object, and the object it adds is
 * made of the objects already on the slide.
 *
 * The genome circle in the source deck is a raster.  It is a circle
 * with tick marks, which is exactly the case the house rules say to
 * rebuild, so the ticks are generated here from a seeded PRNG: stable
 * between loads, sharp at any projector size.
 *
 * Colour follows the attention ladder rather than object identity.
 * The objects are what the slide is about, so they are blue; the
 * scaffolding that holds them in a row (stage names, size figures,
 * connectors) stays ink and muted.  Nothing here needs vermillion,
 * and amber is not reached.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", SLATE = "#004373", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";
const n2 = v => Math.round(v*10)/10;

/* The authoring box is 1600x900 and .slide padding is 86px 110px 70px,
   so the usable content box is x 110..1490, y 86..830.  Measured in the
   browser, the h1 on this slide runs y 86..139 and claims 26px of margin
   under it, so the drawing owns y 165..830: 665px of height.

   The first cut of this slide used about a third of that and left a hole
   between the ladder and the two closing lines.  The objects are the
   content, so they take the space: every object is 1.5x its first size,
   and the whole block is centred in what is left under the h1.  Widths
   were the binding constraint, not heights, since the four rungs stand in
   a row; at 1.5x they total 1103 of the 1380 available, which leaves 89px
   between neighbours for the connectors to live in. */
const LBL_Y  = 286;      /* stage name, above the object              */
const CY     = 436;      /* the objects all share one centre line     */
const SIZE_Y = 606;      /* the size figure, below the object         */
const L1_Y   = 674, L2_Y = 734;   /* the two closing lines            */

/* Each rung: where its object sits, and the two labels around it. */
const RUNGS = [
  { cx: 187,  name: "bases",     size: "1bp"      },
  { cx: 496,  name: "“parts”",   size: "0.1-3kb"  },
  { cx: 935,  name: "“devices”", size: "1-20kb"   },
  { cx: 1356, name: "genomes",   size: "0.5-10Mb" }
];

/* The gaps between the objects, measured from their real edges: the
   letters end at 264, the part arrow runs 353..639, the device train
   727..1143, the genome circle 1251..1461.  All three connectors are the
   same 65px long, so the row reads as evenly spaced even though the
   objects it joins are not. */
const LINKS = [
  [276, 341], [650, 715], [1157, 1222]
];

function txt(x, y, s, size, fill, weight, family){
  return '<text x="'+n2(x)+'" y="'+n2(y)+'" text-anchor="middle" font-size="'+size+
         '" font-weight="'+(weight||400)+'" fill="'+fill+'"'+
         (family ? ' font-family="'+family+'"' : '')+'>'+s+'</text>';
}

/* A gene arrow: flat body, then a head.  Written out longhand because a
   marker cannot carry the body, and the body length is the point. */
function geneArrow(x0, x1, y, bh, hl, hh, fill){
  return '<path fill="'+fill+'" d="M'+n2(x0)+' '+n2(y-bh)+
         'L'+n2(x1-hl)+' '+n2(y-bh)+'L'+n2(x1-hl)+' '+n2(y-hh)+
         'L'+n2(x1)+' '+n2(y)+'L'+n2(x1-hl)+' '+n2(y+hh)+
         'L'+n2(x1-hl)+' '+n2(y+bh)+'L'+n2(x0)+' '+n2(y+bh)+'Z"/>';
}

/* ------------------------------------------------------- rung 0 */
/* Four letters in a 2x2 block, set in the mono face so the four glyphs
   share a width and the block is square without hand-kerning. */
function bases(){
  /* Baselines, not box edges: the block is 87px caps on a 96px row pitch,
     so its ink runs CY-79 to CY+79 and sits on the centre line the other
     three rungs share. */
  const COL = [136, 238], ROW = [CY + 15, CY + 111];
  const MONO = "ui-monospace,SFMono-Regular,Menlo,monospace";
  return [["A", 0, 0], ["T", 1, 0], ["C", 0, 1], ["G", 1, 1]]
    .map(b => txt(COL[b[1]], ROW[b[2]], b[0], 87, SLATE, 700, MONO)).join("");
}

/* ------------------------------------------------------- rung 1 */
const part = () => geneArrow(353.5, 638.5, CY, 42, 81, 75, SLATE);

/* ------------------------------------------------------- rung 2 */
/* Five of them, touching end to end, because a device is what you get
   when parts are put in a row and not something new. */
function devices(){
  let g = "", x = 726.8;
  for (let i = 0; i < 5; i++){
    g += geneArrow(x, x + 72, CY, 19.5, 25.5, 34.5, SLATE);
    x += 86.1;
  }
  return g;
}

/* ------------------------------------------------------- rung 3 */
/* A circular map.  Ticks straddle the circle, some in, some out, the
   way an annotated genome is drawn: features on either strand.  The
   PRNG is seeded so the same picture comes back every load, because a
   genome that reshuffles itself between slides would read as an
   animation. */
function genome(){
  const cx = 1356, cy = CY, R = 105;
  let s = 0x2f6e2b1;
  const rnd = function(){
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
  let g = '<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="none" stroke="'+SLATE+
          '" stroke-width="2.4" opacity="0.45"/>';
  const N = 132;
  for (let i = 0; i < N; i++){
    const a  = (i / N) * Math.PI * 2 + (rnd() - 0.5) * 0.035;
    const out = rnd() < 0.5;
    const len = 6 + rnd() * 10.5;
    const r0 = out ? R + 2.25 : R - 2.25 - len;
    const r1 = out ? R + 2.25 + len : R - 2.25;
    g += '<path d="M'+n2(cx + Math.cos(a)*r0)+' '+n2(cy + Math.sin(a)*r0)+
         'L'+n2(cx + Math.cos(a)*r1)+' '+n2(cy + Math.sin(a)*r1)+
         '" stroke="'+SLATE+'" stroke-width="3.4" stroke-linecap="butt" opacity="'+
         n2(0.45 + rnd()*0.55)+'"/>';
  }
  return g;
}

const OBJ = [bases, part, devices, genome];

/* ------------------------------------------------------- sequence */
window.Deck.sequence("fm-scales", function(slide){
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");

  /* Marker ids are global to the document and hidden slides stay in the
     DOM, so this one carries the section's prefix. */
  let html = '<defs><marker id="fmScaleHead" viewBox="0 0 10 10" refX="9" refY="5" ' +
    'markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">' +
    '<path d="M0 0L10 5L0 10" fill="none" stroke="'+MUTED+'" stroke-width="2"/></marker></defs>';

  /* One group per click.  Rung 0 has no connector before it; the rest
     bring their own, so the link and the thing it points at always
     arrive together. */
  RUNGS.forEach(function(r, i){
    let g = "";
    if (i > 0){
      const L = LINKS[i-1];
      g += '<path d="M'+L[0]+' '+CY+'H'+L[1]+'" fill="none" stroke="'+MUTED+
           '" stroke-width="2.6" marker-end="url(#fmScaleHead)"/>';
    }
    g += OBJ[i]();
    g += txt(r.cx, LBL_Y,  r.name, 34, INK,   700);
    g += txt(r.cx, SIZE_Y, r.size, 28, MUTED, 400);
    html += '<g data-g="'+i+'" opacity="0">'+g+'</g>';
  });

  const SLAB = 'Rockwell,"Rockwell Extra Bold","Bookman Old Style",Georgia,"Times New Roman",serif';
  const line = (y, s) => '<text x="110" y="'+y+'" font-size="36" font-weight="700" ' +
                         'font-family=\''+SLAB+'\' fill="'+INK+'">'+s+'</text>';
  html += '<g data-g="4" opacity="0">'+line(L1_Y, "…and different purposes")+'</g>';
  html += '<g data-g="5" opacity="0">'+line(L2_Y, "…and different time/price constraints")+'</g>';

  svg.innerHTML = html;
  slide.appendChild(svg);

  const G = Array.from(svg.querySelectorAll("[data-g]"))
                 .sort((a,b) => a.getAttribute("data-g") - b.getAttribute("data-g"));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const TR = "opacity .38s ease";

  /* Settled frame for any i, in any order: every group is assigned its
     end-state opacity outright, and the transition is switched off
     whenever we are not allowed to animate.  Nothing is tweened by
     hand, so there is no in-flight state to get stranded. */
  function go(i, animated){
    const anim = animated !== false && !reduce.matches;
    G.forEach(function(g, k){
      g.style.transition = anim ? TR : "none";
      g.style.opacity = k <= i ? "1" : "0";
    });
  }
  go(0, false);

  const S = [
    { note:"There are a great many methods for fabricating DNAs, and different techniques are used at different scales and different contexts. At the short end, there is the fabrication of short single-stranded DNAs called oligonucleotides.",
      desc:"The first rung of a scale ladder: the four bases A, T, C and G set as letters in a square block, labelled bases above and 1bp below." },
    { note:"Then there is a scale in which these short DNAs are combined into gene-length DNAs.",
      desc:"An arrow leads right to the second rung: a single large gene arrow, labelled parts in quotation marks above and 0.1-3kb below." },
    { note:"Those DNAs can be further assembled into multi-gene DNAs that can encode cellular processes like genetic circuits or biosynthetic pathways.",
      desc:"A further arrow leads to the third rung: five small gene arrows in a row, the same shape as the single one before it repeated, labelled devices in quotation marks above and 1-20kb below." },
    { note:"Finally, these can be combined into genome-length DNAs.",
      desc:"A last arrow leads to the fourth rung: a circular genome map, a ring carrying tick marks inside and outside it, labelled genomes above and 0.5-10Mb below. All four scales now stand in a row, each an order of magnitude or two above the one on its left." },
    { note:"Though the decision logic about which methodology should be used for any given scenario is complicated and beyond the scope of these lectures, we will describe how the various techniques work and some of the pros and cons of the various techniques.",
      desc:"Below the ladder, a line appears: and different purposes." },
    { note:"What is important to understand about these techniques is how they work, their limitations, and which ones work for which scales.",
      desc:"A second line joins it: and different time/price constraints." }
  ];

  return { steps: S, go: go };
});
})();
