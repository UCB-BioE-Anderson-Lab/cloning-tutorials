/* ------------------------------------------------------------------ *
 * 28-panning.js : source 28, the phage display cycle, redrawn.
 *
 * Fills  [data-fig="panning"]
 *
 * WHY REDRAWN.  ppt/media/image31.png is 685x643 shown about 1300px
 * wide, and it is a scan of a line drawing: the glyphs are stair-steps
 * and the rules have grey fringes.  JCA called it splotchy on
 * 2026-11-10.  An upscale is not recoverable, so it is rebuilt.
 *
 * SAME SHAPES, in the source's own arrangement: a cluster of phage at
 * the top, a curved arrow to the displayed library, Bind down into the
 * first tube, Wash across to the second, Elute up to the third, Stock
 * and Titrate off the top of it, Amplify back round to the start, and
 * "Phage Display Cycle" set in italic in the middle of the loop.  Five
 * labels, three tubes, four phage clusters -- the same picture.
 *
 * COLOUR, AND THE ONE THING IT ADDS.  The source is pure black line
 * art and makes no distinction anywhere, which means it cannot show
 * the one fact the cycle exists to teach: the tuft on the end of a
 * phage is the DISPLAYED protein, and the tuft is what the plate
 * binds.  So the body is ink and the tuft is vermillion, the deck's
 * attention colour, used here and nowhere else on the slide.  Watch
 * the red through the loop and you have watched the selection: a mixed
 * tuft goes in, the wash takes most of it away, what elutes is the
 * red, and the amplified pool comes back redder.
 *
 * The glassware is muted grey so it stays behind the phage, which is
 * the opposite of the source, where the tube outline is the same black
 * as everything in it.
 *
 * Authored at 1420x800, the shape of the slide's content box.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", MUTED = "#767676", GLASS = "#8e979e";
const n2 = v => Math.round(v * 10) / 10;

/* ---- one phage ----------------------------------------------------- *
 * A capsule for the body with the genome drawn as a pale line along
 * it, and a tuft of three pIII fibres at the head end.  rot turns the
 * whole thing; tuft picks the fibre colour, which is the only thing
 * that ever varies.
 * ------------------------------------------------------------------ */
function phage(x, y, rot, tuft, scale){
  const s = scale == null ? 1 : scale;
  const L = 86 * s, R = 13 * s;
  let g = '<g transform="translate(' + n2(x) + ',' + n2(y) + ') rotate(' + rot + ')">';
  g += '<rect x="0" y="' + n2(-R) + '" width="' + n2(L) + '" height="' + n2(R*2) +
       '" rx="' + n2(R) + '" fill="' + INK + '"/>';
  /* the genome, a pale thread down the middle of the body */
  g += '<line x1="' + n2(L*0.16) + '" y1="0" x2="' + n2(L*0.84) + '" y2="0" ' +
       'stroke="#ffffff" stroke-width="' + n2(3.4*s) + '" opacity="0.72"/>';
  /* three fibres, splayed off the head */
  [-34, 0, 34].forEach(function(a){
    const r = a * Math.PI / 180;
    g += '<line x1="' + n2(L) + '" y1="0" x2="' + n2(L + Math.cos(r)*30*s) +
         '" y2="' + n2(Math.sin(r)*30*s) + '" stroke="' + tuft +
         '" stroke-width="' + n2(7*s) + '" stroke-linecap="round"/>';
  });
  return g + '</g>';
}

/* a cluster of three, the way the source stacks them */
function cluster(x, y, rot, tufts, scale){
  const s = scale == null ? 1 : scale;
  let g = "";
  tufts.forEach(function(t, i){
    g += phage(x + i * 10 * s, y + (i - 1) * 46 * s, rot, t, s);
  });
  return g;
}

/* ---- a tube -------------------------------------------------------- *
 * Open cylinder: an ellipse for the rim, two walls, a rounded floor.
 * Phage sit on the floor, heads down, because what holds them there is
 * the tuft stuck to the plastic.
 * ------------------------------------------------------------------ */
function tube(x, y, w, h, bound){
  const rx = w/2, ry = w*0.19;
  let g = '<path d="M ' + n2(x-rx) + ' ' + n2(y) +
          ' L ' + n2(x-rx) + ' ' + n2(y+h-rx*0.55) +
          ' Q ' + n2(x-rx) + ' ' + n2(y+h) + ' ' + n2(x-rx*0.55) + ' ' + n2(y+h) +
          ' L ' + n2(x+rx*0.55) + ' ' + n2(y+h) +
          ' Q ' + n2(x+rx) + ' ' + n2(y+h) + ' ' + n2(x+rx) + ' ' + n2(y+h-rx*0.55) +
          ' L ' + n2(x+rx) + ' ' + n2(y) + '" fill="#fbfcfc" stroke="' + GLASS +
          '" stroke-width="3"/>';
  g += '<ellipse cx="' + n2(x) + '" cy="' + n2(y) + '" rx="' + n2(rx) + '" ry="' +
       n2(ry) + '" fill="#ffffff" stroke="' + GLASS + '" stroke-width="3"/>';
  /* Whatever is stuck to the floor -- and it is stuck BY THE TUFT,
     which is the whole claim of the figure: the displayed protein is
     what touches the plastic.  So the body hangs head-DOWN from an
     anchor above the floor (rot +92), rather than standing on its tail
     with the tuft waving in the air, which is what the first draft
     drew and which says the opposite. */
  const n = bound.length, BL = 86 * 0.52;
  bound.forEach(function(t, i){
    const bx = x - rx + (i + 0.72) * (w / (n + 0.5));
    g += phage(bx, y + h - 17 - BL, 92, t, 0.52);
  });
  return g;
}

function arrow(x0, y0, x1, y1, w, colour){
  const dx = x1-x0, dy = y1-y0, L = Math.hypot(dx,dy);
  const ux = dx/L, uy = dy/L, hl = w*2.7, hw = w*1.9;
  const bx = x1 - ux*hl, by = y1 - uy*hl, px = -uy, py = ux;
  return '<line x1="' + n2(x0) + '" y1="' + n2(y0) + '" x2="' + n2(bx) +
           '" y2="' + n2(by) + '" stroke="' + colour + '" stroke-width="' + w + '"/>' +
         '<path d="M ' + n2(x1) + ' ' + n2(y1) +
           ' L ' + n2(bx + px*hw) + ' ' + n2(by + py*hw) +
           ' L ' + n2(bx - px*hw) + ' ' + n2(by - py*hw) + ' Z" fill="' + colour + '"/>';
}

/* the source's two long connectors are curved, not straight */
function curve(x0, y0, cx, cy, x1, y1, w){
  const t = 0.88;
  const mt = 1 - t;
  const px = mt*mt*x0 + 2*mt*t*cx + t*t*x1;
  const py = mt*mt*y0 + 2*mt*t*cy + t*t*y1;
  const ux = (x1-px), uy = (y1-py), L = Math.hypot(ux,uy) || 1;
  const hw = w*1.9, nx = -uy/L, ny = ux/L;
  return '<path d="M ' + n2(x0) + ' ' + n2(y0) + ' Q ' + n2(cx) + ' ' + n2(cy) +
           ' ' + n2(px) + ' ' + n2(py) + '" fill="none" stroke="' + INK +
           '" stroke-width="' + w + '"/>' +
         '<path d="M ' + n2(x1) + ' ' + n2(y1) +
           ' L ' + n2(px + nx*hw) + ' ' + n2(py + ny*hw) +
           ' L ' + n2(px - nx*hw) + ' ' + n2(py - ny*hw) + ' Z" fill="' + INK + '"/>';
}

function label(x, y, txt, anchor, size, style){
  return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor||"middle") +
         '" font-family="inherit" font-size="' + (size||28) + '" ' +
         (style || '') + ' fill="' + INK + '">' + txt + '</text>';
}

function panning(){
  let s = "";
  const MIX = [VERM, INK, INK];      /* a library: one binder in three */
  const WON = [VERM, VERM, INK];     /* after a round: enriched        */

  /* the amplified pool at the top, and the arc down to the library */
  s += cluster(690, 150, 18, WON, 0.84);
  s += curve(640, 180, 520, 150, 408, 196, 7);
  s += label(196, 128, "Display variants", "middle");
  s += label(196, 164, "on surface", "middle");
  s += label(196, 200, "of phages", "middle");

  s += cluster(306, 268, 18, MIX, 0.84);

  /* bind */
  s += arrow(330, 392, 330, 470, 7, INK);
  s += label(286, 438, "Bind", "end", 28, 'font-weight="700"');
  s += tube(330, 506, 188, 226, MIX);

  /* wash */
  s += arrow(450, 690, 596, 716, 7, INK);
  s += label(520, 768, "Wash", "middle", 28, 'font-weight="700"');
  s += tube(706, 542, 188, 226, [VERM, INK]);

  /* elute */
  s += arrow(820, 690, 950, 616, 7, INK);
  s += label(900, 736, "Elute", "middle", 28, 'font-weight="700"');
  s += tube(1066, 430, 188, 226, WON);

  /* stock and titrate */
  s += arrow(1100, 404, 1166, 330, 7, INK);
  s += label(1270, 228, "Stock and", "middle");
  s += label(1270, 264, "Titrate", "middle");

  /* amplify, back to the top */
  s += arrow(1108, 160, 884, 142, 7, INK);
  s += label(1000, 110, "Amplify", "middle", 28, 'font-weight="700"');

  s += label(640, 470, "Phage Display Cycle", "middle", 36,
             'font-style="italic" font-weight="700"');

  return '<svg viewBox="0 0 1420 800" xmlns="http://www.w3.org/2000/svg" ' +
    'role="img" aria-label="The phage display cycle as a loop. Variants are ' +
    'displayed on the surface of phages, drawn as dark rods with a tuft of ' +
    'fibres at one end; one tuft in three is red, standing for the binder. ' +
    'Bind puts them into the first tube, Wash carries what is left to the ' +
    'second, Elute lifts the bound phage into the third, and by then two ' +
    'tufts in three are red. Stock and titrate comes off that tube, and ' +
    'Amplify returns the enriched pool to the top of the cycle.">' + s + '</svg>';
}

function fill(){
  const el = document.querySelector('[data-fig="panning"]');
  if (el) el.innerHTML = panning();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
