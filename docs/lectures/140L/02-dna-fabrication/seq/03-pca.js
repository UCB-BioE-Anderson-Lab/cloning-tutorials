/* ------------------------------------------------------------------ *
 * 03-pca.js : polymerase chain assembly.
 *
 * Registers:  gs-pca   seed oligos -> extension -> outer primers ->
 *                      amplified product                   (4 steps)
 *
 * The source slide is a four-panel figure of the same molecules in four
 * states, stacked down the slide with arrows between them. Redrawn as
 * one set of molecules that changes, so the eye tracks a given oligo
 * through the reaction instead of re-finding it in the next panel.
 *
 * The design is the alternating one the worked answer in the notes
 * uses: oligo 1 forward, oligo 2 reverse, oligo 3 forward, and so on,
 * each overlapping its neighbour by about half its length. That leaves
 * a short single-stranded gap opposite every junction, and filling
 * those gaps is the whole difference from ligase chain assembly: a
 * ligase would need the gaps not to be there.
 *
 * Level of iconography: SHAPES. Solid line = ordered as an oligo;
 * dashed blue = made by the polymerase in the tube. Half barbs at 3'
 * ends, never arrowheads, so the direction a strand can be extended in
 * is readable without a legend.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";
const n2 = v => Math.round(v*10)/10;

const XA = 320, XB = 1380;
const L = 220, S = 120;                  /* oligo length, and the step  */
const YT = 460, YB = 520;                /* the seeds, and the product  */
/* Once every 3' end has been run out, the eight oligos are four separate
   double-stranded pieces that OVERLAP one another, so they cannot share a
   line: drawn there they would read as one molecule. Alternate pieces
   drop to a second row, which is how the source figure draws them too. */
const RY = [424, 512];                   /* the two rows, top strand of  */
const RSEP = 56;                         /* each piece; its partner below*/
const YPF = 380, YPR = 612;              /* the two outer primers        */

const BARB = 24, BW = 0.49;
function strand(x1, y1, x2, y2){
  const th = Math.atan2(y1-y2, x1-x2);
  const bx = x2 + BARB*Math.cos(th + BW), by = y2 + BARB*Math.sin(th + BW);
  return "M"+n2(x1)+" "+n2(y1)+"L"+n2(x2)+" "+n2(y2)+
         "M"+n2(bx)+" "+n2(by)+"L"+n2(x2)+" "+n2(y2);
}
function plain(x1, y1, x2, y2){
  return "M"+n2(x1)+" "+n2(y1)+"L"+n2(x2)+" "+n2(y2);
}

/* oligo k as ordered, and how far its 3' end reaches once a polymerase
   has run it out along its neighbour */
function seed(k){ return [XA + S*k, XA + S*k + L]; }
function grown(k){
  return k % 2 === 0 ? [seed(k)[0], Math.min(XB, seed(k+1)[1])]
                     : [Math.max(XA, seed(k-1)[0]), seed(k)[1]];
}

const STEPS = [
{ label:"overlapping oligos, forward and reverse in turn",
  desc:"Eight oligos laid out across the slide, alternating strand by strand: four forward ones above with a half barb at the right-hand 3-prime end, four reverse ones below barbed at the left. Each overlaps its neighbour by about half its length, and short single-stranded gaps sit opposite the junctions." },

{ label:"PCR extension of seed oligonucleotides",
  desc:"A thermostable polymerase extends every 3-prime end along the oligo it is annealed to. The new DNA is drawn as a dashed blue continuation of each strand, filling the gaps, and the oligos have become four short double-stranded pieces that overlap one another." },

{ label:"Insert primers unique to ends",
  desc:"Two more oligos are added: a forward primer against the left end of the top strand and a reverse primer against the right end of the bottom strand, drawn in blue outside the duplex. These two are the only primers a conventional PCR needs." },

{ label:"PCR amplification of target sequence",
  desc:"The conventional PCR runs off the assembled material and gives one full-length double-stranded product spanning the whole target, both strands continuous end to end." }
];

window.Deck.sequence("gs-pca", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");

  let h = '<g font-family="Helvetica Neue,Arial,Helvetica,sans-serif">';

  /* what was ordered */
  h += '<g data-r="oligos" fill="none" stroke="'+INK+'" stroke-width="3.4" ' +
         'stroke-linecap="round">';
  for (let k = 0; k < 8; k++) h += '<path data-r="o'+k+'"/>';
  h += '</g>';

  /* what the polymerase made */
  h += '<g data-r="made" fill="none" stroke="'+BLUE+'" stroke-width="3.4" ' +
         'stroke-linecap="round" stroke-dasharray="10 9" opacity="0">';
  for (let k = 0; k < 8; k++) h += '<path data-r="m'+k+'"/>';
  h += '</g>';

  /* the two outer primers */
  h += '<g data-r="prim" fill="none" stroke="'+BLUE+'" stroke-width="3.4" ' +
         'stroke-linecap="round" opacity="0">' +
       '<path d="'+strand(XA, YPF, XA+150, YPF)+'"/>' +
       '<path d="'+strand(XB, YPR, XB-150, YPR)+'"/>' +
       '</g>';

  /* the product */
  h += '<g data-r="prod" fill="none" stroke="'+INK+'" stroke-width="3.4" ' +
         'stroke-linecap="round" opacity="0">' +
       '<path d="'+strand(XA, YT, XB, YT)+'"/>' +
       '<path d="'+strand(XB, YB, XA, YB)+'"/>' +
       '</g>';

  h += '<text data-r="label" x="800" y="690" text-anchor="middle" font-size="30" ' +
         'font-weight="700" fill="'+INK+'"></text>' +
       '<text data-r="key" x="800" y="740" text-anchor="middle" font-size="24" ' +
         'fill="'+MUTED+'" opacity="0">dashed blue is new DNA, made in the tube</text>';

  h += '</g>';
  svg.innerHTML = h;
  slide.appendChild(svg);

  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);

  function draw(extended){
    for (let k = 0; k < 8; k++){
      const pair = k >> 1;
      const y = extended ? RY[pair % 2] + (k % 2) * RSEP
                         : (k % 2 === 0 ? YT : YB);
      const q = seed(k), g = grown(k);
      /* forward oligos are barbed at the right, reverse ones at the left,
         and once a strand has been extended the barb travels to the new
         3' end and the ordered part is drawn plain */
      if (k % 2 === 0){
        r["o"+k].setAttribute("d", extended ? plain(q[0], y, q[1], y)
                                            : strand(q[0], y, q[1], y));
        r["m"+k].setAttribute("d", extended ? strand(q[1], y, g[1], y) : "");
      } else {
        r["o"+k].setAttribute("d", extended ? plain(q[1], y, q[0], y)
                                            : strand(q[1], y, q[0], y));
        r["m"+k].setAttribute("d", extended ? strand(q[0], y, g[0], y) : "");
      }
    }
  }

  function go(i, animated){
    const soft = animated !== false && !reduce.matches;
    draw(i >= 1);
    [["oligos", i <= 2], ["made", i >= 1 && i <= 2], ["prim", i === 2],
     ["prod", i === 3], ["key", i >= 1 && i <= 2]].forEach(function(p){
      const el = r[p[0]];
      el.style.transition = soft ? "opacity .34s ease" : "none";
      el.style.opacity = p[1] ? "1" : "0";
    });
    r.label.textContent = STEPS[i].label;
  }

  go(0, false);
  return { steps: STEPS.map(x => ({ note:"", desc:x.desc })), go: go };
});

})();
