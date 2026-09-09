/* ------------------------------------------------------------------ *
 * 03-ladder.js : the scale ladder of gene synthesis.
 *
 * Registers:  gs-ladder   bases -> Oligos -> Synthons -> Devices
 *                                                        (4 steps)
 *
 * The source slide shows the whole ladder at once, which asks the room
 * to read four scales, four methods and four sets of vendors in one
 * glance and work out for itself which caption belongs to which rung.
 * Built up a column at a time, each rung arrives with the chemistry
 * that makes it and the companies that sell it, and the ladder is the
 * argument rather than a picture of one.
 *
 * Level of iconography: SHAPES. Nothing here turns on a base identity,
 * only on how long the molecule is, so a rung is a line (single strand)
 * or a pair of lines (duplex) and the letters appear only at 1bp, where
 * the individual base IS the object.
 *
 * Every 3' end carries a half barb, never an arrowhead. The arrows
 * BETWEEN the rungs are process arrows, not DNA, so those do get heads.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";
const n2 = v => Math.round(v*10)/10;

/* column centres, and the icon half-widths that set the arrow gaps */
const CX = [230, 560, 900, 1290];
const YNAME = 310, YICON = 380, YSIZE = 455;
const YM = [540, 578, 616];              /* the method caption, 3 lines */
const YV = [672, 706, 740];              /* the vendor caption, 3 lines */

const BARB = 22, BW = 0.49;

/* a strand whose 3' tip is (x2,y2) */
function strand(x1, y1, x2, y2){
  const th = Math.atan2(y1-y2, x1-x2);
  const bx = x2 + BARB*Math.cos(th + BW), by = y2 + BARB*Math.sin(th + BW);
  return "M"+n2(x1)+" "+n2(y1)+"L"+n2(x2)+" "+n2(y2)+
         "M"+n2(bx)+" "+n2(by)+"L"+n2(x2)+" "+n2(y2);
}

/* a duplex: top strand 5'->3' left to right, bottom antiparallel */
function duplex(x1, x2, y){
  return '<path data-hi="s" d="'+strand(x1, y-12, x2, y-12)+'"/>' +
         '<path data-hi="s" d="'+strand(x2, y+12, x1, y+12)+'"/>';
}

/* a process arrow between two rungs */
function feed(x1, x2, y){
  return '<path d="M'+x1+' '+y+'H'+x2+'M'+(x2-15)+' '+(y-10)+'L'+x2+' '+y+
         'L'+(x2-15)+' '+(y+10)+'" fill="none" stroke="'+MUTED+
         '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
}

function lines(x, ys, arr, size, fill, weight){
  let s = "";
  for (let i = 0; i < arr.length; i++){
    s += '<text x="'+x+'" y="'+ys[i]+'" font-size="'+size+'" fill="'+fill+'"' +
         (weight ? ' font-weight="'+weight+'"' : '') + '>' + arr[i] + '</text>';
  }
  return s;
}

const STEPS = [
{ note:"All current protocols for gene synthesis begin with solid-phase phorsphoramidite chemistry.  Individual A, T, C, and G nucleotides are biologically derived, but they are extensively derivatized using synthetic organic chemistry.",
  desc:"The first rung of a scale ladder: single bases, drawn as the four letters A, T, C and G, labelled 1bp." },

{ note:"These bases are assembled stepwise under non-aqueous conditions into single-stranded oligonucleotides.  Though it is possible to buy an oligonucleotide synthesizer, in practice it is rarely done anymore.  Commercial suppliers led by IDT and Operon provide oligonucleotide synthesis with next-day delivery at 5x lower prices than can be achieved with the instruments that one could purchase for in-house use. Additionally, the need for water-free conditions in these reactions requires extensive monitoring and continuous use to maintain a high-quality product.  When you purchase oligonucleotides from these suppliers, you receive individual pure oligonucleotide samples in screw-capped tubes, or in 96-well plates.  There is another product, called multiplex oligonucleotide synthesis that is much newer in which oligos are provided as a complex mixture at much lower concentrations. Next-generation gene synthesis methods are expected to build off this alternate format due to desirable scaling and pricing qualities.",
  desc:"An arrow leads to the second rung: oligos, drawn as one single strand with a half barb at its 3-prime end, labelled 6 to 100 base pairs. Underneath, the method that gets you there, solid-phase phosphoramidite chemistry, and the suppliers: single sequences from IDT and Twist, multiplex from Agilent, LC Sciences and others." },

{ note:"Regardless of the source of these oligos, they must be assembled using in vitro molecular biology operations into gene-length DNAs.  In gene synthesis facilities such as Geneart, DNA2.0, or Gen9, the procedures for fabricating larger DNAs has been standardized.  When a user orders a DNA longer than can be synthesized in one round of standardized fabrication, the sequence is broken up into shorter DNAs called synthons.  These synthons have a constant length and do not necessarily correspond to genetic boundaries.  The synthons are individually cloned and sequence-confirmed.",
  desc:"A third rung: synthons, drawn as a short double-stranded molecule about 1 kilobase long, made from the oligos by gene synthesis reactions. The vendors are Twist, Geneart and DNA2.0." },

{ note:"Various assembly reactions, like SLIC, SOEing, or Golden Gate methods, which we’ll discuss later, can be used to assemble these synthons into larger sequences.  Above this scale, in vitro or in vivo recombination methodologies can be used to fabricate DNAs on the genome scale or theoretically longer.  However, there is only one commercial vender of these services as of 2014, SGI-DNA.",
  desc:"The last rung: devices, 1 to 20 kilobases, drawn as a longer duplex divided into four segments. Synthons are joined into devices by Gibson, Golden Gate and BioBrick-like reactions, and beyond that scale by in vitro or in vivo recombination, sold by SGI-DNA." }
];

window.Deck.sequence("gs-ladder", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");

  let h = '<g font-family="Helvetica Neue,Arial,Helvetica,sans-serif">';

  /* --- rung 0: the bases themselves ------------------------------- */
  h += '<g data-g="0">' +
       '<text data-hi="f" x="'+CX[0]+'" y="'+YNAME+'" text-anchor="middle" ' +
         'font-size="32" font-weight="700" fill="'+INK+'">bases</text>' +
       '<g data-hi="f" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" ' +
         'font-size="54" font-weight="600" text-anchor="middle" fill="'+INK+'">' +
         '<text x="'+(CX[0]-46)+'" y="'+(YICON-20)+'">A</text>' +
         '<text x="'+(CX[0]+46)+'" y="'+(YICON-20)+'">T</text>' +
         '<text x="'+(CX[0]-46)+'" y="'+(YICON+42)+'">C</text>' +
         '<text x="'+(CX[0]+46)+'" y="'+(YICON+42)+'">G</text>' +
       '</g>' +
       '<text x="'+CX[0]+'" y="'+YSIZE+'" text-anchor="middle" font-size="26" ' +
         'fill="'+MUTED+'">1bp</text>' +
       '</g>';

  /* --- rung 1: oligos --------------------------------------------- */
  h += '<g data-g="1">' + feed(350, 430, YICON) +
       '<text data-hi="f" x="'+CX[1]+'" y="'+YNAME+'" text-anchor="middle" ' +
         'font-size="32" font-weight="700" fill="'+INK+'">Oligos</text>' +
       '<g fill="none" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">' +
         '<path data-hi="s" d="'+strand(450, YICON, 670, YICON)+'" stroke="'+INK+'"/>' +
       '</g>' +
       '<text x="'+CX[1]+'" y="'+YSIZE+'" text-anchor="middle" font-size="26" ' +
         'fill="'+MUTED+'">6-100bp</text>' +
       lines(130, YM, ["Solid-Phase", "Phosphoramidite", "Chemistry"], 26, INK) +
       '<text x="130" y="'+YV[0]+'" font-size="24" fill="'+MUTED+'">' +
         '<tspan font-weight="700" fill="'+INK+'">Single:</tspan> IDT,  Twist</text>' +
       '<text x="130" y="'+YV[1]+'" font-size="24" fill="'+MUTED+'">' +
         '<tspan font-weight="700" fill="'+INK+'">Multiplex:</tspan>  Agilent, LC</text>' +
       '<text x="130" y="'+YV[2]+'" font-size="24" fill="'+MUTED+'">Sciences, etc.</text>' +
       '</g>';

  /* --- rung 2: synthons ------------------------------------------- */
  h += '<g data-g="2">' + feed(690, 760, YICON) +
       '<text data-hi="f" x="'+CX[2]+'" y="'+YNAME+'" text-anchor="middle" ' +
         'font-size="32" font-weight="700" fill="'+INK+'">Synthons</text>' +
       '<g fill="none" stroke="'+INK+'" stroke-width="3.4" stroke-linecap="round" ' +
         'stroke-linejoin="round">' + duplex(780, 1025, YICON) + '</g>' +
       '<text x="'+CX[2]+'" y="'+YSIZE+'" text-anchor="middle" font-size="26" ' +
         'fill="'+MUTED+'">1kb</text>' +
       lines(480, YM, ["Gene Synthesis", "Reactions"], 26, INK) +
       lines(480, YV, ["Twist, Geneart,", "DNA2.0, etc."], 24, MUTED) +
       '</g>';

  /* --- rung 3: devices, and the scale above them ------------------ */
  let seg = "";
  for (let k = 1; k <= 3; k++){
    const x = 1135 + k*77.5;
    seg += '<path d="M'+n2(x)+' '+(YICON-12)+'V'+(YICON+12)+'" stroke="'+BLUE+
           '" stroke-width="3"/>';
  }
  h += '<g data-g="3">' + feed(1045, 1115, YICON) +
       '<text data-hi="f" x="'+CX[3]+'" y="'+YNAME+'" text-anchor="middle" ' +
         'font-size="32" font-weight="700" fill="'+INK+'">Devices</text>' +
       '<g fill="none" stroke="'+INK+'" stroke-width="3.4" stroke-linecap="round" ' +
         'stroke-linejoin="round">' + duplex(1135, 1445, YICON) + seg + '</g>' +
       '<text x="'+CX[3]+'" y="'+YSIZE+'" text-anchor="middle" font-size="26" ' +
         'fill="'+MUTED+'">1-20kb</text>' +
       lines(830, YM, ["Gibson, GG,", "BioBrick-like", "Reactions"], 26, INK) +
       lines(1180, YM, ["In vitro or in vivo", "recombination"], 26, INK) +
       lines(1180, YV, ["SGI-DNA"], 24, MUTED) +
       '</g>';

  h += '</g>';
  svg.innerHTML = h;
  slide.appendChild(svg);

  const groups = [];
  for (let k = 0; k < 4; k++) groups.push(svg.querySelector('[data-g="'+k+'"]'));

  function go(i, animated){
    const soft = animated !== false && !reduce.matches;
    groups.forEach(function(g, k){
      g.style.transition = soft ? "opacity .34s ease" : "none";
      g.style.opacity = k <= i ? "1" : "0";
      /* the rung just reached is the one to look at; the ones behind it
         are context and drop back to ink */
      const col = k === i ? BLUE : INK;
      g.querySelectorAll('[data-hi="s"]').forEach(e => e.setAttribute("stroke", col));
      g.querySelectorAll('[data-hi="f"]').forEach(e => e.setAttribute("fill", col));
    });
  }

  go(0, false);
  return { steps: STEPS.map(x => ({ note:x.note, desc:x.desc })), go: go };
});

})();
