/* ------------------------------------------------------------------ *
 * polfamily.js — the polymerase catalogue as one static picture.
 *
 * Six rows in two groups. The first three are ONE protein taken apart,
 * and their job is to show that the three activities are severable: cut
 * a domain off, or kill it where it stands, and you get a different
 * catalogue entry. The last three are enzymes they will actually meet
 * at a bench.
 *
 * Colour carries the source organism: blue bacterial, red archaeal,
 * amber the added binding domain. It is a small palette -- black, white,
 * red, blue, yellow -- and this slide is one where colour is the fastest
 * way to say the thing.
 *
 * Two things to keep right when using it that way:
 *   - Amber is 3.1:1 on white. Valid as a diagram stroke, NOT as text,
 *     so the added domain's box is amber and its label is ink.
 *   - Vermillion and amber differ only in lightness under red-green
 *     CVD. They meet on the Phusion row, so that box is also set apart
 *     by being detached, offset right, and labelled -- colour is never
 *     the only thing carrying it.
 *
 * A dead domain is drawn NEUTRAL grey rather than in the organism
 * colour, so "this does not work" cannot be confused with "this is
 * archaeal" now that red means the latter.
 *
 * DELIBERATELY NOT TO SCALE. Only the first row could be drawn to real
 * residue boundaries, and one scaled row would lend its precision to
 * five schematic ones. The residue numbers live in the note.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const INK="#111111", BACT="#004373", ARCH="#ba3a13", ADD="#a99011",
      MUTED="#767676", FAINT="#c9c9c9";
const SVGNS="http://www.w3.org/2000/svg";
const n2 = v => Math.round(v*10)/10;

const BX=468, BW=872;
const CUT=[0, 0.348, 0.557, 1].map(f => BX + f*BW);
const EX=[1360, 1478];
const HEAD=["5&#8242;&#8594;3&#8242; exo", "3&#8242;&#8594;5&#8242; exo", "polymerase"];
/* "removes what is ahead" invited the reading that this nuclease chews
   template in front of the polymerase. It acts at a nick, which is what
   nick translation IS. */
const JOB =["removes downstream DNA", "proofreads", "adds bases"];
/* RY sits where it does because the slide carries a title and no bullet
   line under it; the table takes the space that leaves. */
const RY=266, RH=48, RSTEP=78, GAP=30, SPLIT=3;
const rowY = k => k*RSTEP + (k>=SPLIT ? GAP : 0);

const ROWS=[
  { name:"<tspan font-style=\"italic\">E. coli</tspan> Pol I", c:BACT, d:["on","on","on"] },
  { name:"Klenow fragment",   c:BACT, how:"proteolysis",           d:["off","on","on"] },
  { name:"Klenow exo&#8315;", c:BACT, how:"D355A E357A",           d:["off","dead","on"] },
  { name:"Taq",               c:BACT, how:"Klentaq: the same cut", d:["on","dead","on"] },
  { name:"Vent",              c:ARCH, how:"also Pfu, KOD, Deep Vent", d:["none","on","on"] },
  { name:"Phusion",           c:ARCH, how:"+ Sso7d &mdash; Q5 likewise",
    d:["none","on","on"], add:"DNA binding" }
];

function box(y, x0, x1, state, label, col){
  const w=x1-x0, cx=x0+w/2;
  if (state==="none") return "";
  const ghost = state==="off";
  /* dead is neutral, not the organism colour: red now means archaeal */
  const c = state==="on" ? col : MUTED;
  let g = '<rect x="'+n2(x0)+'" y="'+y+'" width="'+n2(w)+'" height="'+RH+'" rx="9" fill="#fff" '+
          'stroke="'+(ghost?FAINT:c)+'" stroke-width="2.6"'+
          (ghost?' stroke-dasharray="9 8"':'')+'/>';
  if (!ghost)
    g += '<text x="'+n2(cx)+'" y="'+(y+RH/2+7)+'" text-anchor="middle" font-size="20" '+
         'font-weight="700" fill="'+c+'">'+label+'</text>';
  if (state==="dead")
    g += '<path d="M'+n2(cx-25)+' '+(y+11)+'l50 26M'+n2(cx+25)+' '+(y+11)+'l-50 26" '+
         'fill="none" stroke="'+MUTED+'" stroke-width="4.2" stroke-linecap="round"/>';
  return g;
}

function row(k){
  const R=ROWS[k], y=RY+rowY(k);
  let g='<text x="'+(BX-30)+'" y="'+(y+(R.how?20:RH/2+7))+'" text-anchor="end" font-size="21" '+
        'font-weight="700" fill="'+INK+'">'+R.name+'</text>';
  if (R.how)
    g+='<text x="'+(BX-30)+'" y="'+(y+43)+'" text-anchor="end" font-size="16" '+
       'fill="'+MUTED+'">'+R.how+'</text>';
  for (let i=0;i<3;i++) g+=box(y, CUT[i], CUT[i+1], R.d[i], HEAD[i], R.c);
  if (R.add)
    /* amber box, INK label: amber is 3.1:1 on white and fails as text */
    g+='<rect x="'+EX[0]+'" y="'+y+'" width="'+(EX[1]-EX[0])+'" height="'+RH+'" rx="9" '+
       'fill="#fff" stroke="'+ADD+'" stroke-width="3.2"/>'+
       '<text x="'+((EX[0]+EX[1])/2)+'" y="'+(y+RH/2+6)+'" text-anchor="middle" '+
       'font-size="16" font-weight="700" fill="'+INK+'">'+R.add+'</text>';
  return g;
}

function legend(y){
  const items=[[BACT,"bacterial"],[ARCH,"archaeal"],[ADD,"added domain"]];
  let x=130, g="";                     /* clears the slide's 110px padding */
  items.forEach(function(it){
    g+='<rect x="'+x+'" y="'+(y-14)+'" width="26" height="16" rx="4" fill="#fff" stroke="'+
       it[0]+'" stroke-width="3"/>'+
       '<text x="'+(x+36)+'" y="'+y+'" font-size="19" fill="'+MUTED+'">'+it[1]+'</text>';
    x += 36 + it[1].length*10 + 42;
  });
  return g;
}

window.Deck.sequence("polfamily", function(slide){
  const svg=document.createElementNS(SVGNS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  svg.innerHTML =
    HEAD.map(function(h,i){
      const cx=(CUT[i]+CUT[i+1])/2;
      return '<text x="'+n2(cx)+'" y="'+(RY-30)+'" text-anchor="middle" font-size="21" '+
             'font-weight="700" fill="'+MUTED+'">'+JOB[i]+'</text>';
    }).join("") +
    ROWS.map((_,k)=>row(k)).join("") +
    legend(RY+rowY(ROWS.length-1)+RH+52);
  slide.appendChild(svg);

  return { steps:[{
    note:"This is one picture, not a list to memorise, so give the room a moment on it. Three columns, and they are the three catalytic domains of E. coli Pol I: a five prime to three prime nuclease that removes DNA downstream of a nick — that is what nick translation is — a three prime to five prime exonuclease that proofreads, and the polymerase itself. Real residue numbers if you want them: one to three twenty three, three twenty four to five seventeen, five eighteen to nine twenty eight. The top three rows are all one protein, and they are here to make a single point: those three activities are severable. Cut the first domain off with a protease and you have Klenow, which is why its box is an empty dashed outline — and note that Klenow still proofreads. That is what makes it the filling-in enzyme: give it a recessed three prime end and it fills that end in without destroying the end you are filling. Then make two point mutations in the proofreading site, D355A and E357A, and you have Klenow exo minus. The domain is still physically there, which is why it is drawn but crossed out; it simply no longer works. You want that for Sanger sequencing, where a proofreader would sit there removing the dideoxy terminator you just paid for. So: same polypeptide, three products, and the only difference is which active sites are still doing anything. The bottom three are the ones you will actually meet. Colour is doing real work now — blue is bacterial, red is archaeal. Taq, from Thermus aquaticus, is bacterial and thermostable, which is the whole reason PCR is a machine rather than a person adding fresh enzyme every cycle. Read its columns rather than its name: all three domains present, middle one dead. Taq does not proofread, which is the same picture as Klenow exo minus arrived at by evolution instead of mutagenesis. Its first domain is very much alive, which is why Taq will destroy a probe in its path, and you can cut that domain off exactly as proteolysis did to Pol I — the product is Klentaq. Vent is archaeal, from Thermococcus litoralis, and it stands in for Pfu and KOD and Deep Vent as well. Notice its bar simply starts further right, with no box at all rather than an empty one: that is the difference between a piece cut off and a piece the lineage never had. And the lovely part is that the missing domain still exists in those organisms, just as a separate protein called FEN-1 — in E. coli it is fused to the polymerase, in archaea it walks around on its own, so the piece really is modular. Practically, the archaeal ones proofread, they will not touch what is in front of them, and they give you blunt ends. Phusion is that same archaeal core with a small DNA-binding domain bolted on, Sso7d from Sulfolobus, in yellow — Q5 is the same idea. It clamps the enzyme to the DNA and makes it far more processive. Not a fidelity trick, a grip trick, and it is why Phusion wants fifteen to thirty seconds per kilobase instead of a minute, and why its annealing rules will catch you out if you carry a Taq protocol across. Two things that are not on the chart and should be. Some products are mixtures: Expand from Roche is a bacterial polymerase plus a small amount of an archaeal proofreading one, in the same tube. Taq stalls once it misincorporates, the proofreader removes the mismatch, and the bacterial enzyme carries on — that combination is what made long PCR work, and nothing on the label tells you there are two enzymes in there. And the one we actually use in this lab is PrimeSTAR, which I cannot put on this chart at all, because Takara does not publish what is in it. I can tell you it proofreads, it gives blunt ends, and it works extremely well. That is the honest state of it, and it is worth noticing that a fair amount of the catalogue is like that.",
    desc:"A table with three column headings — removes downstream DNA, proofreads, adds bases — and six rows of schematic domain bars in two groups. The top three are E. coli Pol I with all three domains; the Klenow fragment, annotated proteolysis, with the first domain replaced by an empty dashed outline; and Klenow exo minus, annotated D355A E357A, which additionally has the proofreading domain greyed and struck through. These three are drawn in blue for bacterial. Below a gap: Taq, also blue, with all three domains and the proofreader struck through, annotated that Klentaq is the same cut; Vent, in red for archaeal and annotated also Pfu, KOD and Deep Vent, whose bar has no box at all in the first column and starts at the second; and Phusion, also red and annotated plus Sso7d, with an extra detached box outlined in amber on the right labelled DNA binding. A legend below gives the three colours: bacterial, archaeal, added domain."
  }], go:function(){} };
});
})();
