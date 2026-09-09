/* ------------------------------------------------------------------ *
 * 03-phosphoramidite.js : one turn of the synthesis cycle.
 *
 * Registers:  gs-amidite   the column -> deblock -> couple ->
 *                          oxidize -> cap                  (5 steps)
 *
 * The source slide is the standard four-structure cycle, drawn all at
 * once, with the four reaction names scattered round it. Everything a
 * student has to get out of it is temporal: which reagent goes on when,
 * and what state the chain is in afterwards. So the ring is drawn once
 * and the room is walked round it a reaction at a time, in the order
 * the speaker notes take them.
 *
 * Level of iconography: SCHEMATIC. The full protecting-group chemistry
 * is on the source slide and is unreadable from the back of the room;
 * what has to be legible is the bead, the chain, what is capping the
 * 5' end, and how many oxygens are on the phosphorus. Those are drawn.
 *
 * The chain is drawn vertically because that is how it sits on the
 * column: 3' end held by the CPG, 5' end up, which is the end every
 * reaction in the cycle acts on. No arrowheads on the DNA anywhere;
 * the 3' end is not free, it is bonded to the bead.
 *
 * NOTE ON ORDER: the source puts oxidation before capping, and this
 * follows it. Many texts run the cap first. Not changed here.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", RED = "#ba3a13", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";

/* the four corners of the cycle */
const AX = 430, BX = 1170, TY = 340, BY = 650;

/* ---- one node: a bead, a chain of one or two residues, a 5' group -- */
function node(cx, cy, res, top, pcol, primes){
  let s = '<g fill="none" stroke="'+INK+'" stroke-width="3.4" stroke-linecap="round">';
  s += '<circle cx="'+cx+'" cy="'+(cy+72)+'" r="30"/>';
  if (res === 1){
    s += '<path d="M'+cx+' '+(cy+42)+'V'+(cy-6)+'"/>';
    s += '<path d="M'+cx+' '+(cy+18)+'H'+(cx+32)+'"/>';
  } else {
    s += '<path d="M'+cx+' '+(cy+42)+'V'+(cy-2)+'"/>';
    s += '<path d="M'+cx+' '+(cy+18)+'H'+(cx+32)+'"/>';
    s += '<path d="M'+cx+' '+(cy-30)+'V'+(cy-70)+'"/>';
    s += '<path d="M'+cx+' '+(cy-46)+'H'+(cx+32)+'"/>';
  }
  s += '</g>';
  s += '<circle cx="'+(cx+41)+'" cy="'+(cy+18)+'" r="9" fill="'+INK+'"/>';
  if (res === 2){
    s += '<circle cx="'+(cx+41)+'" cy="'+(cy-46)+'" r="9" fill="'+INK+'"/>';
    s += '<circle cx="'+cx+'" cy="'+(cy-16)+'" r="14" fill="#fff" stroke="'+pcol+
         '" stroke-width="3.4"/>' +
         '<text x="'+cx+'" y="'+(cy-9)+'" text-anchor="middle" font-size="18" ' +
           'font-weight="700" fill="'+pcol+'">P</text>';
  }
  s += '<text x="'+cx+'" y="'+(cy+79)+'" text-anchor="middle" font-size="18" ' +
         'fill="'+MUTED+'">CPG</text>';
  s += '<text x="'+cx+'" y="'+(cy + (res === 1 ? -22 : -86))+'" text-anchor="middle" ' +
         'font-size="24" font-weight="700" fill="'+INK+'">'+top+'</text>';
  if (primes){
    s += '<text x="'+(cx-30)+'" y="'+(cy+30)+'" text-anchor="end" font-size="21" ' +
           'fill="'+MUTED+'">3&#8242;</text>' +
         '<text x="'+(cx-30)+'" y="'+(cy + (res === 1 ? -12 : -76))+'" text-anchor="end" ' +
           'font-size="21" fill="'+MUTED+'">5&#8242;</text>';
  }
  return s;
}

function arrow(x1, y1, x2, y2){
  const dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx*dx + dy*dy);
  const ux = dx/L, uy = dy/L, px = -uy, py = ux;
  const h = 16, w = 9;
  return "M"+x1+" "+y1+"L"+x2+" "+y2 +
         "M"+(x2 - h*ux + w*px)+" "+(y2 - h*uy + w*py)+"L"+x2+" "+y2 +
         "L"+(x2 - h*ux - w*px)+" "+(y2 - h*uy - w*py);
}

const STEPS = [
{ node:"A1", arrow:null,
  label:"a single base on the column, 5&#8242; blocked",
  note:"Regardless of the downstream processing steps and final format, gene synthesis begins with phosphoramidite chemistry.  Companies such as Glen Research sell controlled-pore-glass, or CPG columns covalently attached to a single DNA base via the 3’ hydroxyl.  Solid-phase oligonucleotide synthesis begins with one of these columns chosen based on the desired 3’ end of the oligo being synthesized.  These bases are protected on the 5’ end with a trityl group, and several positions on the nucleobase are similar blocked to avoid side reactions. These bases initiate the formation of the oligonucleotide through cycles of reactions.",
  desc:"A cycle of four reactions drawn as a ring, labelled deblocking, coupling, oxidation and capping. At the top left of the ring, the starting material: a bead of controlled-pore glass holding one nucleotide by its 3-prime end, with a trityl group blocking the 5-prime end above it." },

{ node:"B", arrow:"ab",
  label:"deblocking: acid takes the trityl off, leaving a free 5&#8242;-OH",
  note:"In the deblocking step, the column is treated with a strong acid to remove the trityl group.",
  desc:"The first arrow lights up. Acid removes the trityl group, and the second structure appears at the top right of the ring: the same bead and base, now with a bare 5-prime hydroxyl." },

{ node:"C", arrow:"bc",
  label:"coupling: the next phosphoramidite joins, P carries only 3 oxygens",
  note:"The column is then washed with the next phosphoramidite that will be joined to the growing chain along with a catalyst.  This coupling step creates the bond between the backbone phosphate and the 5’ hydroxyl.  Note that there are only 3 oxygens on this phosphorus atom: it is in a different oxidation state than the phosphate in the desired DNA.",
  desc:"The incoming phosphoramidite is drawn to the right of the ring, itself trityl-blocked. With tetrazole as the catalyst it joins the free hydroxyl, and the chain on the bead is now two residues long, joined by a phosphorus marked in red because it carries only three oxygens." },

{ node:"D", arrow:"cd",
  label:"oxidation: iodine and water make it a phosphate",
  note:"In the next step of the cycle, the phosphate is oxidized with iodine to generate the phosphate.",
  desc:"Iodine and water oxidize that phosphorus, and the linkage at the bottom right of the ring turns black: a normal phosphate, the backbone bond that belongs in DNA." },

{ node:"A2", arrow:"da",
  label:"capping: acetic anhydride kills the chains that missed",
  note:"Finally, the column is capped with acetic anhydride to terminate any chains that did not receive the added base. At the end of the synthesis, the oligonucleotides are full-length but are immobilized on the column and contain multiple protecting groups.  These linkages are broken by treatment with methylamine and ammonium hydroxide.  Upon purification, a structurally-normal synthetic DNA is obtained.",
  desc:"Acetic anhydride caps every chain that failed to couple, drawn as a short dead chain standing beside the live one, and the cycle closes. The starting structure is back with the chain one base longer and blocked again, ready for the next round." }
];

window.Deck.sequence("gs-amidite", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");

  let h = '<g font-family="Helvetica Neue,Arial,Helvetica,sans-serif">';

  /* the ring */
  h += '<g fill="none" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">' +
       '<path data-r="ab" d="'+arrow(560, TY, 1120, TY)+'"/>' +
       '<path data-r="bc" d="'+arrow(BX+100, 462, BX+100, 536)+'"/>' +
       '<path data-r="cd" d="'+arrow(1120, BY, 560, BY)+'"/>' +
       '<path data-r="da" d="'+arrow(AX-100, 536, AX-100, 462)+'"/>' +
       '</g>';

  /* the four reaction names, always up; the reagents only when acting */
  h += '<text data-r="n-ab" x="840" y="306" text-anchor="middle" font-size="30" ' +
         'font-weight="700" fill="'+MUTED+'">Deblocking</text>' +
       '<text data-r="r-ab" x="840" y="378" text-anchor="middle" font-size="24" ' +
         'fill="'+BLUE+'" opacity="0">strong acid, H&#8314;</text>' +
       '<text data-r="n-bc" x="1290" y="490" font-size="30" ' +
         'font-weight="700" fill="'+MUTED+'">Coupling</text>' +
       '<text data-r="r-bc" x="1290" y="524" font-size="24" ' +
         'fill="'+BLUE+'" opacity="0">+ tetrazole</text>' +
       '<text data-r="n-cd" x="840" y="616" text-anchor="middle" font-size="30" ' +
         'font-weight="700" fill="'+MUTED+'">Oxidation</text>' +
       '<text data-r="r-cd" x="840" y="688" text-anchor="middle" font-size="24" ' +
         'fill="'+BLUE+'" opacity="0">I&#8322;, H&#8322;O</text>' +
       '<text data-r="n-da" x="310" y="490" text-anchor="end" font-size="30" ' +
         'font-weight="700" fill="'+MUTED+'">Capping</text>' +
       '<text data-r="r-da" x="310" y="524" text-anchor="end" font-size="24" ' +
         'fill="'+BLUE+'" opacity="0">acetic anhydride</text>';

  /* the structures */
  h += '<g data-r="A1">' + node(AX, TY, 1, "DMT", INK, true) + '</g>';
  h += '<g data-r="A2" opacity="0">' + node(AX, TY, 2, "DMT", INK, true) + '</g>';
  h += '<g data-r="B" opacity="0">' + node(BX, TY, 1, "HO", INK, false) + '</g>';
  h += '<g data-r="C" opacity="0">' + node(BX, BY, 2, "DMT", RED, false) + '</g>';
  h += '<g data-r="D" opacity="0">' + node(AX, BY, 2, "DMT", INK, false) + '</g>';

  /* the incoming monomer, out to the right of the ring */
  h += '<g data-r="mono" opacity="0">' +
       '<g fill="none" stroke="'+INK+'" stroke-width="3.4" stroke-linecap="round">' +
         '<path d="M1390 372V316"/><path d="M1390 348H1422"/>' +
       '</g>' +
       '<circle cx="1431" cy="348" r="9" fill="'+INK+'"/>' +
       '<circle cx="1390" cy="386" r="14" fill="#fff" stroke="'+RED+'" stroke-width="3.4"/>' +
       '<text x="1390" y="393" text-anchor="middle" font-size="18" font-weight="700" ' +
         'fill="'+RED+'">P</text>' +
       '<text x="1390" y="300" text-anchor="middle" font-size="22" font-weight="700" ' +
         'fill="'+INK+'">DMT</text>' +
       '<text x="1390" y="250" text-anchor="middle" font-size="22" fill="'+BLUE+
         '">Phosphoramidite</text>' +
       '</g>';

  /* the chain that missed its base, capped and out of the run */
  h += '<g data-r="dead" opacity="0">' +
       '<g fill="none" stroke="'+MUTED+'" stroke-width="3.4" stroke-linecap="round">' +
         '<circle cx="215" cy="412" r="30"/><path d="M215 382V334"/><path d="M215 358H247"/>' +
       '</g>' +
       '<circle cx="256" cy="358" r="9" fill="'+MUTED+'"/>' +
       '<text x="215" y="419" text-anchor="middle" font-size="18" fill="'+MUTED+'">CPG</text>' +
       '<text x="215" y="318" text-anchor="middle" font-size="22" font-weight="700" ' +
         'fill="'+MUTED+'">Ac</text>' +
       '<text x="215" y="282" text-anchor="middle" font-size="21" fill="'+MUTED+
         '">capped</text>' +
       '</g>';

  /* what each structure is */
  h += '<text x="'+AX+'" y="478" text-anchor="middle" font-size="24" fill="'+MUTED+
         '">5&#8242; blocked</text>' +
       '<text data-r="lB" x="'+BX+'" y="478" text-anchor="middle" font-size="24" ' +
         'fill="'+MUTED+'" opacity="0">free 5&#8242;-OH</text>' +
       '<text data-r="lC" x="'+BX+'" y="790" text-anchor="middle" font-size="24" ' +
         'fill="'+MUTED+'" opacity="0">phosphite: 3 oxygens on P</text>' +
       '<text data-r="lD" x="'+AX+'" y="790" text-anchor="middle" font-size="24" ' +
         'fill="'+MUTED+'" opacity="0">phosphate: the bond DNA has</text>';

  h += '<text data-r="cap" x="800" y="214" text-anchor="middle" font-size="30" ' +
         'font-weight="700" fill="'+INK+'"></text>';

  h += '</g>';
  svg.innerHTML = h;
  slide.appendChild(svg);

  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);

  const ARROWS = ["ab", "bc", "cd", "da"];
  const SHOWN = { A1:[0,1,2,3], A2:[4], B:[1,2,3,4], C:[2,3,4], D:[3,4],
                  mono:[2], dead:[4], lB:[1,2,3,4], lC:[2,3,4], lD:[3,4] };

  function go(i, animated){
    const soft = animated !== false && !reduce.matches;
    Object.keys(SHOWN).forEach(function(k){
      const el = r[k];
      el.style.transition = soft ? "opacity .34s ease" : "none";
      el.style.opacity = SHOWN[k].indexOf(i) >= 0 ? "1" : "0";
    });
    ARROWS.forEach(function(a){
      const live = STEPS[i].arrow === a;
      r[a].setAttribute("stroke", live ? BLUE : MUTED);
      r[a].setAttribute("stroke-width", live ? "4.6" : "3");
      r[a].setAttribute("opacity", live ? "1" : "0.45");
      r["n-"+a].setAttribute("fill", live ? BLUE : MUTED);
      r["r-"+a].setAttribute("opacity", live ? "1" : "0");
    });
    r.cap.innerHTML = STEPS[i].label;
  }

  go(0, false);
  return { steps: STEPS.map(x => ({ note:x.note, desc:x.desc })), go: go };
});

})();
