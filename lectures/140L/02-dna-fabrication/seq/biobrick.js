/* ------------------------------------------------------------------ *
 * biobrick.js: BioBrick standard assembly, drawn as plasmid maps.
 *
 * The source slide is a raster of the familiar registry figure: two part
 * plasmids, two block arrows reading "cut with", the two cut products,
 * and the assembled plasmid.  It is boxes, ticks, block arrows and
 * labelled arcs, which is the case the house rules say to rebuild rather
 * than keep, and its greens and golds have no equivalent in this palette.
 * Rebuilt it also becomes the thing the flat picture cannot be: the two
 * digests land on separate clicks, so the asymmetry that makes the method
 * work (one part cut E and S, the other cut E and X) is a step rather
 * than something to be noticed afterwards.
 *
 * Colour.  The two parts have to be told apart while they travel, so
 * B0034 takes blue and C0010 vermillion, one rung up, exactly the case
 * the palette describes: blue is spent, so the second thing goes higher.
 * Neither distinction rests on colour alone, since both boxes carry their
 * own name.  Everything else is scaffolding: the backbone and the ticks
 * are ink, the AMP marker and the process arrows are muted.  Amber is not
 * reached.
 *
 * Geometry.  Content box is x 110..1490, y 165..830 under the h1.  Five
 * bands, measured rather than eyeballed:
 *
 *     192..329   the two part plasmids
 *     344..400   the two "cut with" arrows
 *     414..551   the two cut products
 *     567..637   mix and ligate
 *     659..792   the assembled plasmid
 *
 * Measured end to end the drawing runs y 187..792 in a box that ends at
 * 830, which is where the balance under the h1 came from.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", SLATE = "#004373", RED = "#ba3a13", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";
const n2 = v => Math.round(v*10)/10;

/* Band centres and the one plasmid size the first two rows share. */
const CY1 = 272, CY3 = 494, CY5 = 737;
const W = 440, H = 88;              /* the part plasmids                */
const W5 = 580, H5 = 84;            /* the product, which carries two   */
const AX = 450, BX = 1150, PX = 800;   /* the three column centres      */

/* A tick sits on the backbone and crosses it; a cut end is a taller bar
   at the end of a strand.  Both are labelled from the same baseline so
   the row of letters reads straight across. */
const TICK_H = 12, END_H = 19;

function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

function txt(x, y, s, size, fill, weight, anchor){
  return '<text x="'+n2(x)+'" y="'+n2(y)+'" text-anchor="'+(anchor||"middle")+
         '" font-size="'+size+'" font-weight="'+(weight||400)+'" fill="'+fill+
         '">'+esc(s)+'</text>';
}

/* A plasmid drawn as a racetrack rather than a circle: the source figure
   does the same, and it packs a map into a wide shallow band. */
function racetrack(cx, cy, w, h){
  const r = h/2, lx = cx - w/2 + r, rx = cx + w/2 - r;
  return '<path fill="none" stroke="'+INK+'" stroke-width="3.5" d="M'+n2(lx)+' '+n2(cy-r)+
         'H'+n2(rx)+'A'+n2(r)+' '+n2(r)+' 0 0 1 '+n2(rx)+' '+n2(cy+r)+
         'H'+n2(lx)+'A'+n2(r)+' '+n2(r)+' 0 0 1 '+n2(lx)+' '+n2(cy-r)+'Z"/>';
}

/* The same racetrack with a piece of the top edge missing: the stub
   between two cuts has been taken out, so the path starts at one free end
   and travels the long way round to the other.  fill is none, because an
   open path that is filled closes itself and comes out as a wedge. */
function cutRacetrack(cx, cy, w, h, xL, xR){
  const r = h/2, lx = cx - w/2 + r, rx = cx + w/2 - r;
  return '<path fill="none" stroke="'+INK+'" stroke-width="3.5" d="M'+n2(xR)+' '+n2(cy-r)+
         'H'+n2(rx)+'A'+n2(r)+' '+n2(r)+' 0 0 1 '+n2(rx)+' '+n2(cy+r)+
         'H'+n2(lx)+'A'+n2(r)+' '+n2(r)+' 0 0 1 '+n2(lx)+' '+n2(cy-r)+
         'H'+n2(xL)+'"/>';
}

function bar(x, y, half, wide){
  return '<path d="M'+n2(x)+' '+n2(y-half)+'V'+n2(y+half)+'" stroke="'+INK+
         '" stroke-width="'+(wide ? 3.5 : 2.6)+'" stroke-linecap="butt"/>';
}

/* A named part: a box straddling the backbone, with its name inside it. */
function partBox(cx, cy, w, h, fill, label){
  return '<rect x="'+n2(cx-w/2)+'" y="'+n2(cy-h/2)+'" width="'+n2(w)+'" height="'+n2(h)+
         '" rx="5" fill="'+fill+'"/>' +
         txt(cx, cy + h*0.02 + 8, label, 22, "#ffffff", 700);
}

/* The resistance marker, pointing the way the source figure points it.
   Outlined rather than filled solid: it is context, not the subject. */
function ampArrow(xTip, xTail, y, h){
  const hh = h/2, bh = h*0.34, hl = 34;
  return '<path fill="#f4f4f4" stroke="'+MUTED+'" stroke-width="2" d="M'+n2(xTip)+' '+n2(y)+
         'L'+n2(xTip+hl)+' '+n2(y-hh)+'L'+n2(xTip+hl)+' '+n2(y-bh)+
         'L'+n2(xTail)+' '+n2(y-bh)+'L'+n2(xTail)+' '+n2(y+bh)+
         'L'+n2(xTip+hl)+' '+n2(y+bh)+'L'+n2(xTip+hl)+' '+n2(y+hh)+'Z"/>' +
         txt((xTip+hl+xTail)/2, y + 7, "AMP", 19, INK, 700);
}

function procArrow(x0, y0, x1, y1){
  return '<path d="M'+n2(x0)+' '+n2(y0)+'L'+n2(x1)+' '+n2(y1)+'" fill="none" stroke="'+MUTED+
         '" stroke-width="3" marker-end="url(#bbHead)"/>';
}

/* ------------------------------------------------------------------ *
 * The map along a top edge, as (x, letter) pairs.  Both part plasmids
 * carry the identical prefix and suffix, which is the whole point of the
 * standard, so both are laid out from the same numbers.
 * ------------------------------------------------------------------ */
function siteRow(cy, marks, labelY){
  return marks.map(m => bar(m[0], cy, TICK_H) +
                        txt(m[0], labelY, m[1], 21, INK, 700)).join("");
}

/* ------------------------------------------------------- band 1 */
function partPlasmid(cx, cy, fill, name){
  const top = cy - H/2, bot = cy + H/2;
  return racetrack(cx, cy, W, H) +
         siteRow(top, [[cx-144, "E"], [cx-114, "X"]], top - 20) +
         siteRow(top, [[cx+106, "S"], [cx+136, "P"]], top - 20) +
         partBox(cx, top, 140, 34, fill, name) +
         ampArrow(cx - 100, cx + 100, bot, 26);
}

/* ------------------------------------------------------- band 3 */
/* The insert: linear, and drawn away from the plasmid it came out of, so
   the two products of the digest are visibly two molecules. */
function insert(cx, cy){
  const x0 = cx - 144, x1 = cx + 106;
  return '<path d="M'+n2(x0)+' '+n2(cy)+'H'+n2(x1)+'" fill="none" stroke="'+INK+
         '" stroke-width="3.5"/>' +
         bar(x0, cy, END_H, true) + txt(x0, cy - 32, "E", 21, INK, 700) +
         bar(x1, cy, END_H, true) + txt(x1, cy - 32, "S", 21, INK, 700) +
         siteRow(cy, [[cx-114, "X"]], cy - 32) +
         partBox(cx, cy, 140, 34, SLATE, "B0034");
}

/* The opened vector: everything except the short stub between the two
   cuts, which is why the top edge has a gap in it. */
function cutVector(cx, cy){
  const top = cy - H/2, bot = cy + H/2;
  const xE = cx - 150, xX = cx - 104;
  return cutRacetrack(cx, cy, W, H, xE, xX) +
         bar(xE, top, END_H, true) + txt(xE, top - 20, "E", 21, INK, 700) +
         bar(xX, top, END_H, true) + txt(xX, top - 20, "X", 21, INK, 700) +
         siteRow(top, [[cx+106, "S"], [cx+136, "P"]], top - 20) +
         partBox(cx, top, 140, 34, RED, "C0010") +
         ampArrow(cx - 100, cx + 100, bot, 26);
}

/* ------------------------------------------------------- band 5 */
/* The product: the two parts now sit end to end inside one plasmid, and
   the prefix and suffix that survived are back on the outside of them,
   so the whole thing is itself a part. */
function assembled(cx, cy){
  const top = cy - H5/2, bot = cy + H5/2;
  return racetrack(cx, cy, W5, H5) +
         siteRow(top, [[cx-220, "E"], [cx-188, "X"]], top - 20) +
         siteRow(top, [[cx+176, "S"], [cx+208, "P"]], top - 20) +
         partBox(cx - 74, top, 140, 34, SLATE, "B0034") +
         partBox(cx + 66, top, 140, 34, RED,   "C0010") +
         ampArrow(cx - 100, cx + 100, bot, 26);
}

/* ------------------------------------------------------- sequence */
window.Deck.sequence("bb-standard", function(slide){
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");

  /* Marker ids are global to the document and hidden slides stay in the
     DOM, so this one carries the section's prefix. */
  let html = '<defs><marker id="bbHead" viewBox="0 0 10 10" refX="9" refY="5" ' +
    'markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">' +
    '<path d="M0 0L10 5L0 10" fill="none" stroke="'+MUTED+'" stroke-width="2"/></marker></defs>';

  const G = [
    /* 0 */ partPlasmid(AX, CY1, SLATE, "B0034") + partPlasmid(BX, CY1, RED, "C0010"),
    /* 1 */ procArrow(AX, 344, AX, 400) +
            txt(AX + 24, 378, "Cut with E & S", 23, INK, 700, "start") +
            insert(AX, CY3),
    /* 2 */ procArrow(BX, 344, BX, 400) +
            txt(BX + 24, 378, "Cut with E & X", 23, INK, 700, "start") +
            cutVector(BX, CY3),
    /* 3 */ procArrow(AX, 567, PX - 110, 637) + procArrow(BX, 567, PX + 110, 637) +
            txt(PX, 614, "Mix & Ligate", 24, INK, 700),
    /* 4 */ assembled(PX, CY5)
  ];
  G.forEach(function(g, i){ html += '<g data-g="'+i+'" opacity="0">'+g+'</g>'; });

  svg.innerHTML = html;
  slide.appendChild(svg);

  const GR = Array.from(svg.querySelectorAll("[data-g]"))
                  .sort((a,b) => a.getAttribute("data-g") - b.getAttribute("data-g"));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const TR = "opacity .38s ease";

  /* Settled frame for any i, in any order: every group is assigned its
     end-state opacity outright, and the transition is switched off when
     we are not allowed to animate, so nothing can be stranded mid-fade. */
  function go(i, animated){
    const anim = animated !== false && !reduce.matches;
    GR.forEach(function(g, k){
      g.style.transition = anim ? TR : "none";
      g.style.opacity = k <= i ? "1" : "0";
    });
  }
  go(0, false);

  /* The source slide has no speaker notes, so none are written here. The
     description channel is this file's own, and describes only what is
     drawn. */
  const S = [
    { note:"",
      desc:"Two plasmid maps side by side, each drawn as a rounded loop. Both carry the same four sites along the top in the same order: E and X to the left, S and P to the right. Between them sits the part, B0034 in blue on the left plasmid and C0010 in red on the right. Each plasmid also carries an AMP marker on its lower edge." },
    { note:"",
      desc:"First click: an arrow labelled Cut with E and S drops from the left plasmid, and below it the B0034 part has come out as a straight piece of DNA, with a cut end at E on the left, X beside it, and a cut end at S on the right." },
    { note:"",
      desc:"Second click: an arrow labelled Cut with E and X drops from the right plasmid, and below it the C0010 plasmid has been opened. The short stub between its E and X sites has gone, leaving a gap in the top of the loop with a free end at E and another at X. C0010, S, P and the AMP marker are all still on the piece that remains." },
    { note:"",
      desc:"Third click: two arrows converge from the two cut pieces onto a single point, labelled Mix and Ligate." },
    { note:"",
      desc:"Fourth click: one plasmid, wider than the two it came from. Along its top edge, E and X, then B0034 and C0010 sitting directly against one another, then S and P, with the AMP marker below. The prefix and suffix are back on the outside of the pair, so the product is itself a part." }
  ];

  return { steps: S, go: go };
});
})();
