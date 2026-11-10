/* ------------------------------------------------------------------ *
 * 18-eipcr.js : source 18, EIPCR on a sublibrary, redrawn.
 *
 * Fills  [data-fig="eipcr"]
 *
 * WHY REDRAWN RATHER THAN RE-FETCHED.  The figure is from
 * Nat Protoc 2007;2(10):2590-600 (PMID 17948002) -- Cropp, Anderson &
 * Chin, JCA's own paper -- and Nature Protocols is paywalled with no
 * PMC deposit, so there is no clean copy to pull.  JCA asked on
 * 2026-11-10 for the paper if possible and a redraw if not.
 *
 * It needed one either way.  ppt/media/image22.png is 558x384 shown
 * about 1400px wide, AND every label in it is white type on
 * transparency because it was pasted on to a dark slide.  Charcoal
 * panel and all, it was still a four-fold upscale of a JPEG-noisy
 * cut-out.  That panel and its crop are gone now.
 *
 * EVERY CHARACTER BELOW WAS READ OFF THE ORIGINAL at 5x and checked
 * for sense, not transcribed hopefully:
 *
 *   forward   5'-GGTCTC A GCACTC NNK ...
 *   reverse   5'-GGTCTC A GTGCGAT ...   (drawn 3'->5' as TAGCGTGACTCTGG)
 *
 * BsaI is GGTCTC(1/5): it cuts one base past the site on the top
 * strand and five past on the bottom, leaving a four-base 5' overhang.
 * So the forward primer gives GCAC and the reverse gives GTGC, which
 * are complements -- which is exactly why the circle closes scarlessly
 * and why the figure is on this slide at all.  The product's staggered
 * ends below (GCACTCNNK over AGNNM, ATC over TAGCGTG) are the source's
 * own, and they agree with that arithmetic.
 *
 * THE 5' TAILS, added on JCA's instruction, 2026-11-10.  Both primers
 * carry ccata outside the BsaI site -- written atacc on the reverse
 * one, which is drawn 3' to 5'.  A type IIS enzyme will not cut at a
 * blunt end: it needs a few bases beyond its recognition sequence to
 * sit on, so a primer beginning GGTCTC straight off, which is how the
 * source figure draws it, does not work at the bench.  The tails are
 * MUTED because they are scaffolding, and the bottom row is the proof:
 * after the digest they are gone.  It is the same five-base tail
 * C6-Tools writes on the PWM library oligo over on source 20.
 *
 * COLOUR.  Two things are being tracked and they get the two rungs:
 * the BsaI sites are VERMILLION and the degenerate codon is BLUE, in
 * the primers and again in the product, so you can follow each one
 * through the digestion.  KanR keeps a blue block and the two mauve
 * blocks stay mauve, which is the source's own coding; both now carry
 * white type at 10:1 and 5.6:1 instead of white type on pale fill.
 *
 * Authored at 1300x790.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", BLUE = "#004373",
      MAUVE = "#6b6478", MUTED = "#767676";
const MONO = "ui-monospace,SFMono-Regular,Menlo,monospace";
const n2 = v => Math.round(v * 10) / 10;
const R2 = Math.PI / 180;

/* ---- the plasmid --------------------------------------------------- */
const PX = 640, PY = 186, PR = 140;

function onCircle(deg, r){
  return [PX + Math.cos(deg*R2) * (r == null ? PR : r),
          PY + Math.sin(deg*R2) * (r == null ? PR : r)];
}
/* a thick arc of the backbone, optionally with an arrowhead at its end */
function arc(a0, a1, w, colour, head){
  const r = PR, big = (a1 - a0) > 180 ? 1 : 0;
  const end = head ? a1 - 7 : a1;
  const p0 = onCircle(a0, r), p1 = onCircle(end, r);
  let s = '<path d="M ' + n2(p0[0]) + ' ' + n2(p0[1]) + ' A ' + r + ' ' + r +
          ' 0 ' + big + ' 1 ' + n2(p1[0]) + ' ' + n2(p1[1]) + '" fill="none" ' +
          'stroke="' + colour + '" stroke-width="' + w + '"/>';
  if (head){
    const t = onCircle(a1, r);
    const b1 = onCircle(end, r - w*0.95), b2 = onCircle(end, r + w*0.95);
    s += '<path d="M ' + n2(t[0]) + ' ' + n2(t[1]) + ' L ' + n2(b1[0]) + ' ' +
         n2(b1[1]) + ' L ' + n2(b2[0]) + ' ' + n2(b2[1]) + ' Z" fill="' +
         colour + '"/>';
  }
  return s;
}
/* a label outside the circle with a tick back to the backbone */
function site(deg, txt, anchor, dx, dy){
  const a = onCircle(deg, PR - 9), b = onCircle(deg, PR + 26);
  return '<line x1="' + n2(a[0]) + '" y1="' + n2(a[1]) + '" x2="' + n2(b[0]) +
           '" y2="' + n2(b[1]) + '" stroke="' + INK + '" stroke-width="2"/>' +
         '<text x="' + n2(b[0] + (dx||0)) + '" y="' + n2(b[1] + (dy||0)) +
           '" text-anchor="' + anchor + '" font-family="inherit" ' +
           'font-style="italic" font-size="24" fill="' + INK + '">' + txt + '</text>';
}
/* the arc's own name, set along it */
function arcLabel(deg, txt, colour){
  const p = onCircle(deg, PR);
  /* set along the arc, but flipped end-for-end on the lower half --
     deg+90 alone printed N-term upside down, which is how the first
     render came out */
  let rot = deg + 90;
  if (rot > 90 && rot < 270) rot -= 180;
  return '<text x="' + n2(p[0]) + '" y="' + n2(p[1]) + '" text-anchor="middle" ' +
         'dominant-baseline="central" font-family="inherit" font-style="italic" ' +
         'font-size="21" font-weight="600" fill="#ffffff" transform="rotate(' +
         n2(rot) + ' ' + n2(p[0]) + ' ' + n2(p[1]) + ')">' + txt + '</text>';
}

function plasmid(){
  let s = '<circle cx="' + PX + '" cy="' + PY + '" r="' + PR + '" fill="none" ' +
          'stroke="' + INK + '" stroke-width="3"/>';
  /* KanR runs up the left side to the top, arrowhead leading */
  s += arc(186, 286, 22, BLUE, true);
  s += arcLabel(232, "KanR", "#ffffff");
  /* N-term runs down the right side */
  s += arc(22, 92, 22, MAUVE, false);
  s += arcLabel(57, "N-term", "#ffffff");

  s += site(184, "Xho I", "end", -8, 8);
  s += site(20,  "Not I", "start", 8, -4);
  s += site(36,  "Pst I", "start", 10, 14);
  /* 125 degrees, not the source's bottom-dead-centre: the Inverse PCR
     arrow leaves from there and the two labels sat on top of each other */
  s += site(125, "EcoR\u2009I", "end", -10, 18);

  [["pEcYRS-Nterm", -22], ["(sublibrary)", 12], ["3,141 bp", 46]].forEach(function(l){
    s += '<text x="' + PX + '" y="' + (PY + l[1]) + '" text-anchor="middle" ' +
         'font-family="inherit" font-size="26" fill="' + INK + '">' + l[0] +
         '</text>';
  });
  return s;
}

/* ---- the linear map ------------------------------------------------ */
const BOX = [
  { x: 352, w: 128, fill: MAUVE, label: "EcYRS"  },
  { x: 524, w: 244, fill: BLUE,  label: "KanR"   },
  { x: 812, w: 132, fill: MAUVE, label: "N-term" }
];
function map(y){
  let s = '<line x1="' + (BOX[0].x + BOX[0].w) + '" y1="' + y + '" x2="' +
          BOX[1].x + '" y2="' + y + '" stroke="' + INK + '" stroke-width="2.5"/>' +
          '<line x1="' + (BOX[1].x + BOX[1].w) + '" y1="' + y + '" x2="' +
          BOX[2].x + '" y2="' + y + '" stroke="' + INK + '" stroke-width="2.5"/>';
  BOX.forEach(function(b){
    s += '<rect x="' + b.x + '" y="' + (y - 23) + '" width="' + b.w +
         '" height="46" rx="3" fill="' + b.fill + '" stroke="' + INK +
         '" stroke-width="2"/>' +
         '<text x="' + (b.x + b.w/2) + '" y="' + (y + 1) + '" text-anchor="middle" ' +
         'dominant-baseline="central" font-family="inherit" font-size="25" ' +
         'font-weight="600" fill="#ffffff">' + b.label + '</text>';
  });
  return s;
}

/* a run of sequence, coloured piece by piece, returned with its width so
   the next piece can be placed without measuring text in the browser */
const CW = 15.2;                      /* one monospace character at 25px */
function seq(x, y, parts, size){
  const cw = CW * ((size || 25) / 25);
  let s = "", cx = x;
  parts.forEach(function(p){
    s += '<text x="' + n2(cx) + '" y="' + y + '" font-family="' + MONO +
         '" font-size="' + (size || 25) + '" fill="' + (p[1] || INK) + '">' +
         p[0] + '</text>';
    cx += p[0].length * cw;
  });
  seq.end = cx;
  return s;
}
function arrowH(x0, x1, y){
  const d = x1 > x0 ? 1 : -1;
  return '<line x1="' + n2(x0) + '" y1="' + y + '" x2="' + n2(x1 - d*11) +
           '" y2="' + y + '" stroke="' + INK + '" stroke-width="2.5"/>' +
         '<path d="M ' + n2(x1) + ' ' + y + ' L ' + n2(x1 - d*12) + ' ' + (y-7) +
           ' L ' + n2(x1 - d*12) + ' ' + (y+7) + ' Z" fill="' + INK + '"/>';
}
function arrowV(x, y0, y1, label){
  let s = '<line x1="' + x + '" y1="' + y0 + '" x2="' + x + '" y2="' + (y1-12) +
          '" stroke="' + INK + '" stroke-width="2.5"/>' +
          '<path d="M ' + x + ' ' + y1 + ' L ' + (x-8) + ' ' + (y1-13) + ' L ' +
          (x+8) + ' ' + (y1-13) + ' Z" fill="' + INK + '"/>';
  if (label){
    s += '<text x="' + (x + 24) + '" y="' + n2((y0+y1)/2 + 9) + '" ' +
         'font-family="inherit" font-size="26" fill="' + INK + '">' + label +
         '</text>';
  }
  return s;
}

function eipcr(){
  let s = plasmid();
  s += arrowV(PX, 340, 396, "Inverse PCR");

  /* ---- the PCR, with its two primers ---- */
  const Y1 = 452;
  /* forward primer, above the left end */
  s += seq(28, Y1 - 44, [["5′", INK], ["ccata", MUTED], ["GGTCTC", VERM],
                         ["AGCACTC", INK], ["NNK", BLUE]]);
  const fEnd = seq.end;
  s += arrowH(fEnd + 10, fEnd + 62, Y1 - 52);
  /* the BsaI bracket, over GGTCTC only */
  const b0 = 28 + 6*CW, b1 = 28 + 12*CW;
  s += '<path d="M ' + n2(b0) + ' ' + (Y1-72) + ' L ' + n2(b0) + ' ' + (Y1-80) +
       ' L ' + n2(b1) + ' ' + (Y1-80) + ' L ' + n2(b1) + ' ' + (Y1-72) +
       '" fill="none" stroke="' + INK + '" stroke-width="2"/>';
  s += '<text x="' + n2((b0+b1)/2) + '" y="' + (Y1-92) + '" text-anchor="middle" ' +
       'font-family="inherit" font-style="italic" font-size="24" fill="' + INK +
       '">Bsa I site</text>';

  s += '<text x="28" y="' + (Y1 - 2) + '" font-family="inherit" font-size="21" ' +
       'fill="' + MUTED + '">5\u2032 tails give Bsa\u2009I room to bind</text>';

  s += map(Y1);

  /* reverse primer, below the right end, written 3' to 5' as the source does */
  const rY = Y1 + 56;
  s += arrowH(1268, 1216, rY - 8);
  /* drawn 3' to 5', as the source draws it, so THIS primer's tail is on
     the right-hand end: ccata reversed is atacc */
  s += seq(896, rY, [["TAGCGTGA", INK], ["CTCTGG", VERM], ["atacc", MUTED],
                     ["-5′", INK]]);

  s += arrowV(PX, 520, 592, "Bsa I digestion");

  /* ---- the digested product, with its four-base overhangs ---- */
  const Y2 = 690;
  s += map(Y2);
  /* left end: the top strand overhangs by GCAC */
  s += seq(118, Y2 - 10, [["GCACTC", INK], ["NNK", BLUE]]);
  s += '<line x1="' + n2(seq.end + 8) + '" y1="' + (Y2-18) + '" x2="' + BOX[0].x +
       '" y2="' + (Y2-18) + '" stroke="' + INK + '" stroke-width="2.5"/>';
  s += seq(118 + 4*CW, Y2 + 28, [["AG", INK], ["NNM", BLUE]]);
  s += '<line x1="' + n2(seq.end + 8) + '" y1="' + (Y2+20) + '" x2="' + BOX[0].x +
       '" y2="' + (Y2+20) + '" stroke="' + INK + '" stroke-width="2.5"/>';
  /* right end */
  const rx = BOX[2].x + BOX[2].w;
  s += '<line x1="' + rx + '" y1="' + (Y2-18) + '" x2="' + (rx+54) + '" y2="' +
       (Y2-18) + '" stroke="' + INK + '" stroke-width="2.5"/>';
  s += seq(rx + 62, Y2 - 10, [["ATC", INK]]);
  s += '<line x1="' + rx + '" y1="' + (Y2+20) + '" x2="' + (rx+54) + '" y2="' +
       (Y2+20) + '" stroke="' + INK + '" stroke-width="2.5"/>';
  s += seq(rx + 62, Y2 + 28, [["TAGCGTG", INK]]);

  return '<svg viewBox="0 0 1300 790" xmlns="http://www.w3.org/2000/svg" ' +
    'role="img" aria-label="EIPCR on a sublibrary. A 3,141 base-pair plasmid, ' +
    'pEcYRS-Nterm, carries KanR as a blue arc and N-term as a mauve arc, with ' +
    'Xho one, Not one, Pst one and EcoR one marked round it. Inverse PCR with ' +
    'two primers, each carrying a red BsaI site in its tail and the forward one ' +
    'a blue NNK codon, copies the whole plasmid into a linear map of EcYRS, ' +
    'KanR and N-term. BsaI digestion then leaves four-base overhangs: GCACTC ' +
    'NNK over AG NNM at the left end and ATC over TAGCGTG at the right, which ' +
    'are complementary, so the circle closes without a scar.">' + s + '</svg>';
}

function fill(){
  const el = document.querySelector('[data-fig="eipcr"]');
  if (el) el.innerHTML = eipcr();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
else fill();

})();
