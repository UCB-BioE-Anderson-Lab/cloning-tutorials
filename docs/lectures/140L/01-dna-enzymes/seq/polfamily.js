/* ------------------------------------------------------------------ *
 * polfamily.js — the polymerase catalogue as one static picture.
 *
 * Three columns held fixed; everything else changes. The point is only
 * that these are very similar things that differ in specific, nameable
 * ways — so it is one slide, one look, no build. Six rows read top to
 * bottom or column by column, whichever the room does first.
 *
 * The modularity is real rather than a teaching convenience. The
 * polymerase fold and the DEDD proofreading domain are shared machinery
 * across the Pol I and archaeal lineages — which is why the two
 * right-hand columns line up at all — and the 5'->3' nuclease is
 * FEN-1-like, a free-standing protein in archaea rather than a piece of
 * the polymerase. So a domain genuinely can be a separate part.
 *
 * The lineage split is NOT drawn. It was, briefly, and it bought
 * accuracy nobody needed at the cost of a second thing to explain. The
 * geometry still carries the honest distinction on its own: a piece CUT
 * AWAY leaves a dashed outline, still in the frame, while a piece the
 * lineage never had leaves no box at all and the bar simply starts
 * further right. The note names the families for anyone who asks.
 *
 * DELIBERATELY NOT TO SCALE. Only the first row could be drawn to real
 * residue boundaries, and one scaled row would lend its precision to
 * five schematic ones. The residue numbers live in the note.
 *
 * Four states per slot:
 *   on    present and working
 *   dead  present but catalytically dead   (Taq, Klenow exo-)
 *   off   present in the parent, cut away  (Klenow)
 *   none  not in this lineage at all       (the archaeal enzymes)
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const INK="#111111", SLATE="#004373", RED="#ba3a13", MUTED="#767676", FAINT="#c9c9c9";
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
const RY=286, RH=44, RSTEP=74;
/* The blend row is two half-height bars, because that is what the
   product is: two separate enzymes in one tube, not one protein with a
   different domain set. Drawing it as a single row would say fusion. */
const MY=[724, 764], MH=22;

const ROWS=[
  { name:"<tspan font-style=\"italic\">E. coli</tspan> Pol I", d:["on","on","on"] },
  { name:"Klenow fragment",   how:"proteolysis",              d:["off","on","on"] },
  { name:"Klenow exo&#8315;", how:"D355A E357A",              d:["off","dead","on"] },
  { name:"Taq",               how:"Klentaq: the same cut",    d:["on","dead","on"] },
  /* Named enzymes only. Pfu, Vent and KOD are specific archaeal proteins
     from named organisms; PrimeSTAR is a product LINE whose composition
     Takara does not publish, so putting it here would assert archaeal
     origin, no 5'->3' exo, no fusion partner AND a single enzyme, when
     all that is actually known is that it proofreads and runs blunt. */
  { name:"Pfu &middot; Vent &middot; KOD", d:["none","on","on"] },
  { name:"Phusion &middot; Q5", how:"+ Sso7d",                d:["none","on","on"], add:"DNA binding" }
];

function box(y, x0, x1, state, label, h){
  const H = h || RH, w=x1-x0, cx=x0+w/2;
  if (state==="none") return "";
  const ghost = state==="off";
  const c = (state==="on") ? INK : MUTED;
  let g = '<rect x="'+n2(x0)+'" y="'+y+'" width="'+n2(w)+'" height="'+H+'" rx="'+(H<30?6:9)+
          '" fill="#fff" stroke="'+(ghost?FAINT:c)+'" stroke-width="2.6"'+
          (ghost?' stroke-dasharray="9 8"':'')+'/>';
  /* the half-height bars carry no text: by the time you reach them you
     have read the columns six times, and the shape is the whole point */
  if (!ghost && H>=RH)
    g += '<text x="'+n2(cx)+'" y="'+(y+H/2+7)+'" text-anchor="middle" font-size="20" '+
         'font-weight="700" fill="'+c+'">'+label+'</text>';
  if (state==="dead"){
    const dx = H>=RH ? 25 : 15, dy = H>=RH ? 10 : 5, dh = H - 2*dy;
    g += '<path d="M'+n2(cx-dx)+' '+(y+dy)+'l'+(2*dx)+' '+dh+
         'M'+n2(cx+dx)+' '+(y+dy)+'l'+(-2*dx)+' '+dh+'" fill="none" stroke="'+RED+
         '" stroke-width="'+(H>=RH?4.4:3)+'" stroke-linecap="round"/>';
  }
  return g;
}

/* Expand and friends: a bacterial polymerase plus a proofreading one,
   mixed. The proofreader rescues the mismatches that stall the first
   enzyme, which is what made long PCR possible. */
function blend(){
  const D=[["on","dead","on"], ["none","on","on"]];
  let g="";
  MY.forEach(function(y,r){
    for (let i=0;i<3;i++) g+=box(y, CUT[i], CUT[i+1], D[r][i], HEAD[i], MH);
  });
  /* a bracket, not a plus sign: it has to say "these two together are
     the one product you buy", and it has to survive the bottom bar
     starting further right than the top one */
  g+='<path d="M'+(BX-6)+' '+MY[0]+'h-10v'+(MY[1]+MH-MY[0])+'h10" fill="none" stroke="'+
     MUTED+'" stroke-width="2.2"/>';
  const cy=(MY[0]+MY[1]+MH)/2;
  g+='<text x="'+(BX-30)+'" y="'+n2(cy-4)+'" text-anchor="end" font-size="21" '+
     'font-weight="700" fill="'+INK+'">Expand &middot; Platinum Taq HiFi</text>' +
     '<text x="'+(BX-30)+'" y="'+n2(cy+20)+'" text-anchor="end" font-size="16" '+
     'fill="'+MUTED+'">two enzymes, not one protein</text>';
  return g;
}

function row(k){
  const R=ROWS[k], y=RY+k*RSTEP;
  /* how the product was made rides under its name, so it never competes
     for the space the added domain needs on the right */
  let g='<text x="'+(BX-30)+'" y="'+(y+(R.how?20:RH/2+7))+'" text-anchor="end" font-size="21" '+
        'font-weight="700" fill="'+INK+'">'+R.name+'</text>';
  if (R.how)
    g+='<text x="'+(BX-30)+'" y="'+(y+43)+'" text-anchor="end" font-size="16" '+
       'fill="'+MUTED+'">'+R.how+'</text>';
  for (let i=0;i<3;i++) g+=box(y, CUT[i], CUT[i+1], R.d[i], HEAD[i]);
  if (R.add)
    g+='<rect x="'+EX[0]+'" y="'+y+'" width="'+(EX[1]-EX[0])+'" height="'+RH+'" rx="9" '+
       'fill="#fff" stroke="'+SLATE+'" stroke-width="2.6"/>'+
       '<text x="'+((EX[0]+EX[1])/2)+'" y="'+(y+RH/2+6)+'" text-anchor="middle" '+
       'font-size="16" font-weight="700" fill="'+SLATE+'">'+R.add+'</text>';
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
    ROWS.map((_,k)=>row(k)).join("") + blend();
  slide.appendChild(svg);

  return { steps:[{
    note:"This is one picture rather than a list to memorise, so give the room a moment on it. Three columns, and they are the three catalytic domains of E. coli Pol I: a five prime to three prime nuclease that removes DNA downstream of a nick — that is what nick translation is — a three prime to five prime exonuclease that proofreads, and the polymerase itself. Real residue numbers, if you want them, are one to three twenty three, three twenty four to five seventeen, five eighteen to nine twenty eight. Everything below the top row is that same set of columns with something changed. Cut the first domain off with a protease and you have Klenow, which is why its box is an empty dashed outline — and note that Klenow still proofreads. That is what makes it a filling-in enzyme: give it a recessed three prime end and it fills the end in without destroying the end you are filling. Make two point mutations in the proofreading site, D355A and E357A, and you have Klenow exo minus, where the domain is still physically there but crossed out because it no longer works. You want that for Sanger sequencing, where a proofreader would sit there chewing off the dideoxy terminator you just paid for. Then stop doing surgery and change organism. Taq is thermostable, which is the whole reason PCR is a machine rather than a person adding enzyme every cycle, and look at its middle column: the domain is there and it is dead. Taq does not proofread. Same picture as Klenow exo minus, arrived at by evolution instead of by mutagenesis. Its first domain is very much alive, which is why Taq will destroy a probe in its path. Now the next two rows, and notice their bars simply start further right — no box at all rather than an empty one. That is the difference between a piece cut off and a piece that was never there. Pfu from Pyrococcus furiosus, Vent from Thermococcus litoralis, KOD from Thermococcus kodakarensis — these are archaeal, and everything above them is bacterial — that is really all the deep taxonomy amounts to on this slide. Strictly they are cousins of Pol I rather than trimmed-down versions of it: the polymerase and proofreading domains genuinely are shared machinery, the five prime nuclease is not. Here is the lovely part: that missing domain still exists in those organisms, just as a separate protein called FEN-1. In E. coli it is fused to the polymerase; in archaea it walks around on its own. The piece really is modular. Practically, these proofread, they will not touch what is in front of them, and they give you blunt ends. And the last row shows you can add as well as remove: Phusion and Q5 are that core with a small DNA-binding domain fused on — for Q5, NEB names it Sso7d — which clamps the enzyme to the DNA and makes it far more processive. Not a fidelity trick, a grip trick, and it is why they want fifteen to thirty seconds per kilobase instead of a minute. And then the last row, which breaks the pattern on purpose. Expand from Roche, Platinum Taq High Fidelity, Takara's LA Taq — these are not one protein at all. They are two enzymes mixed in one tube, which is why I have drawn them as two half-height bars under a bracket. A bacterial polymerase like Taq, plus a small amount of an archaeal proofreading enzyme. And the reason is lovely. Taq on its own stalls after it misincorporates — it cannot fix the mismatch and it cannot easily extend past it, so long products fall apart. Add a proofreader and it removes the mismatch, and the bacterial enzyme carries on. That combination is what made long PCR work in the first place, and it is worth knowing the tube can contain two things, because nothing on the label tells you. One honest gap before we leave it. I have put only named enzymes on this chart, because for those I can say what they are. A lot of the catalogue is not like that. Takara's PrimeSTAR is the example I would give: I can tell you what it does — it proofreads, it gives you blunt ends — but Takara does not publish what is in the tube, and PrimeSTAR is a product line rather than a single enzyme, so I cannot honestly put it in any one row here. Notice that rather than papering over it. So: thirty years of this, dozens more products than I have put up, new ones every year. You do not memorise the catalogue. You read the columns, and the catalogue tells you which columns each product has.",
    desc:"A table with three column headings — removes downstream DNA, proofreads, adds bases — and seven rows of schematic domain bars. E. coli Pol I has all three domains. Klenow fragment, annotated proteolysis, has the first replaced by an empty dashed outline. Klenow exo minus, annotated D355A E357A, additionally has the proofreading domain greyed and struck through with a red cross. Taq, annotated that Klentaq is the same cut, has all three domains with the proofreading one struck through. Pfu, Vent and KOD have no box at all in the first column, their bar starting at the second. Phusion and Q5, annotated plus Sso7d, are the same with an extra blue box appended on the right labelled DNA binding. A final entry, Expand and Platinum Taq High Fidelity, is drawn differently: two half-height bars under a bracket, one with all three domains and its proofreader struck through and one starting at the second column, annotated two enzymes, not one protein."
  }], go:function(){} };
});
})();
