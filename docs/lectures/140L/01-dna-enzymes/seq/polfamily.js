/* ------------------------------------------------------------------ *
 * polfamily.js — the whole polymerase catalogue as one picture.
 *
 * Three columns, held fixed, and everything else changes: which domains
 * are present, dead, cut away, or bolted on. Six rows carry the whole
 * argument, so this is ONE slide, not a Pol I slide followed by a
 * diversity slide saying the same thing twice.
 *
 * The modularity is real rather than a teaching convenience. The
 * polymerase fold and the DEDD proofreading domain are shared machinery
 * across families A and B — which is why the two right-hand columns line
 * up at all — and the 5'->3' nuclease is FEN-1-like, a free-standing
 * protein in archaea rather than part of the polymerase. So a domain
 * genuinely can be a separate part.
 *
 * But families A and B are cousins, not a series of deletions, and the
 * drawing has to say so: hence the rule across the middle. The geometry
 * already separates a piece CUT AWAY (dashed outline, still in the
 * frame) from a piece the lineage NEVER HAD (no box at all, the bar
 * simply starts further right) — the rule names what that second case
 * means.
 *
 * DELIBERATELY NOT TO SCALE. An earlier version drew Pol I to real
 * E. coli residue boundaries; nothing else here can be drawn that way,
 * because the manufacturers do not disclose the parent enzymes, and one
 * scaled row would lend its precision to five schematic ones. The
 * residue numbers live in the speaker note instead.
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

/* the three columns keep Pol I's proportions, so the shape is familiar,
   but this is a schematic and not a residue map */
const BX=468, BW=872;
const CUT=[0, 0.348, 0.557, 1].map(f => BX + f*BW);
const EX=[1360, 1478];
const HEAD=["5&#8242;&#8594;3&#8242; exo", "3&#8242;&#8594;5&#8242; exo", "polymerase"];
/* "removes what is ahead" invited the reading that this nuclease chews
   template in front of the polymerase. It is a structure-specific
   nuclease acting at a nick, which is what nick translation IS. */
const JOB =["removes downstream DNA", "proofreads", "adds bases"];
const RY=298, RH=46, RSTEP=74;
const SPLIT=46, BREAK=4;        /* rows from BREAK on are the other family */
const rowY = k => k*RSTEP + (k>=BREAK ? SPLIT : 0);

const ROWS=[
  { name:"<tspan font-style=\"italic\">E. coli</tspan> Pol I", d:["on","on","on"] },
  { name:"Klenow fragment", how:"proteolysis",  d:["off","on","on"] },
  { name:"Klenow exo&#8315;", how:"D355A E357A", d:["off","dead","on"] },
  { name:"Taq",             how:"and Klentaq, cut like Klenow", d:["on","dead","on"] },
  { name:"Pfu &middot; Vent &middot; KOD &middot; PrimeSTAR", d:["none","on","on"] },
  { name:"Phusion &middot; Q5", how:"+ Sso7d", d:["none","on","on"], add:"DNA binding" }
];

function box(x0, x1, state, label){
  const w=x1-x0, cx=x0+w/2;
  if (state==="none") return "";
  const ghost = state==="off";
  const c = (state==="on") ? INK : MUTED;
  let g = '<rect x="'+n2(x0)+'" y="'+RY+'" width="'+n2(w)+'" height="'+RH+'" rx="9" fill="#fff" '+
          'stroke="'+(ghost?FAINT:c)+'" stroke-width="2.6"'+
          (ghost?' stroke-dasharray="9 8"':'')+'/>';
  if (!ghost)
    g += '<text x="'+n2(cx)+'" y="'+(RY+RH/2+7)+'" text-anchor="middle" font-size="19" '+
         'font-weight="700" fill="'+c+'">'+label+'</text>';
  if (state==="dead")
    g += '<path d="M'+n2(cx-24)+' '+(RY+10)+'l48 26M'+n2(cx+24)+' '+(RY+10)+'l-48 26" '+
         'fill="none" stroke="'+RED+'" stroke-width="4.4" stroke-linecap="round"/>';
  return g;
}

function row(k){
  const R=ROWS[k];
  let g='<g data-r="r'+k+'" opacity="0" transform="translate(0 '+n2(rowY(k))+')">';
  /* how the product was made rides under its name, so it never competes
     for the space the added domain needs on the right */
  g+='<text x="'+(BX-30)+'" y="'+(RY+(R.how?18:RH/2+7))+'" text-anchor="end" font-size="21" '+
     'font-weight="700" fill="'+INK+'">'+R.name+'</text>';
  if (R.how)
    g+='<text x="'+(BX-30)+'" y="'+(RY+40)+'" text-anchor="end" font-size="16" '+
       'fill="'+MUTED+'">'+R.how+'</text>';
  for (let i=0;i<3;i++) g+=box(CUT[i], CUT[i+1], R.d[i], HEAD[i]);
  if (R.add)
    g+='<rect x="'+EX[0]+'" y="'+RY+'" width="'+(EX[1]-EX[0])+'" height="'+RH+'" rx="9" '+
       'fill="#fff" stroke="'+SLATE+'" stroke-width="2.6"/>'+
       '<text x="'+((EX[0]+EX[1])/2)+'" y="'+(RY+RH/2+6)+'" text-anchor="middle" '+
       'font-size="16" font-weight="700" fill="'+SLATE+'">'+R.add+'</text>';
  return g+'</g>';
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
    '<text x="'+(BX-30)+'" y="'+(RY-30)+'" text-anchor="end" font-size="19" '+
      'font-weight="700" letter-spacing="1.5" fill="'+MUTED+'">FAMILY A</text>' +
    /* the family boundary, drawn and named -- without it the stack reads
       as one continuous series of deletions, which it is not */
    '<g data-r="famB" opacity="0">' +
      '<path d="M148 '+(RY+rowY(BREAK)-32)+'H1478" fill="none" stroke="'+FAINT+
        '" stroke-width="2" stroke-dasharray="9 8"/>' +
      '<text x="'+(BX-30)+'" y="'+(RY+rowY(BREAK)-10)+'" text-anchor="end" font-size="19" '+
      'font-weight="700" letter-spacing="1.5" fill="'+MUTED+'">FAMILY B</text></g>' +
    ROWS.map((_,k)=>row(k)).join("") +
    '<text data-r="cap" x="800" y="820" text-anchor="middle" font-family="inherit" '+
      'font-weight="700" font-size="29" fill="'+INK+'"></text>';
  slide.appendChild(svg);
  const r={}; svg.querySelectorAll("[data-r]").forEach(e=>r[e.getAttribute("data-r")]=e);
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur=null, raf=null;

  function paint(v){
    for (let k=0;k<ROWS.length;k++)
      r["r"+k].setAttribute("opacity", n2(Math.max(0, Math.min(1, v - k))));
    r.famB.setAttribute("opacity", n2(Math.max(0, Math.min(1, v - BREAK))));
  }

  const S=[
    { v:1, cap:"One polypeptide, three active sites",
      note:"E. coli DNA polymerase I is a single polypeptide with three separate catalytic domains. At the N terminus, a five prime to three prime nuclease that removes DNA downstream of a nick — that is what nick translation is. In the middle, a three prime to five prime exonuclease that proofreads. At the C terminus, the polymerase itself. In real residue numbers that is one to three twenty three, three twenty four to five seventeen, and five eighteen to nine twenty eight. I am going to hold those three columns fixed for the rest of this slide and change everything else, because three rows of the NEB table are not three facts to memorise — they are these three pieces. Two warnings. This drawing is not to scale; only the first row could be, and one scaled row would lend its precision to five schematic ones. And watch for the line partway down: everything above it is one protein family and everything below is another.",
      desc:"Three column headings — removes downstream DNA, proofreads, adds bases — over a schematic bar for E. coli Pol I showing all three domains present. The group is labelled FAMILY A." },
    { v:2, cap:"Cut a piece off",
      note:"Cleave the polypeptide with a protease and the N-terminal domain comes away. What is left is the Klenow fragment, and its first box is now an empty dashed outline to mark where the piece used to be. Note carefully what it keeps: Klenow still proofreads. What it has lost is the ability to chew up what is in front of it, and that is exactly what Klenow is for. It fills in. Give it a recessed three prime end and it fills that end in without destroying the end you are filling. Give it two oligos annealed through their three prime ends, each with a five prime tail, and it extends both to a full-length double-stranded product — overlap extension, which is how you build a part of thirty to a hundred and thirty base pairs without ordering it as a gene, and you will use it later in the course.",
      desc:"A second row, the Klenow fragment: the same bar with the first domain replaced by an empty dashed outline, annotated proteolysis." },
    { v:3, cap:"Or kill one where it stands",
      note:"Now take Klenow and make two point mutations, D355A and E357A, in the proofreading active site. The domain is still there — you have not cut anything off — but it no longer works, so it is greyed and crossed out. That is Klenow exo minus, and it matters when you need an enzyme that will not touch the ends of your substrate at all. Most famously in Sanger sequencing, where a three prime to five prime exonuclease would sit there removing the dideoxy terminator you just paid for. Same protein, three catalogue entries, and the only difference is which active sites still work.",
      desc:"A third row, Klenow exo minus: the first domain still a dashed outline, and now the proofreading domain greyed and struck through with a red cross, annotated D355A E357A." },
    { v:4, cap:"Same three domains, a different organism",
      note:"Now change organism rather than surgery. Taq, from Thermus aquaticus, thermostable, which is the whole reason PCR is a machine rather than a person adding fresh enzyme every cycle. Read the columns rather than the name: Taq has all three domains and the middle one is dead. Taq does not proofread — the domain is there, it simply does not work, which is the same picture as Klenow exo minus arrived at by evolution instead of by mutagenesis. That is why Taq has an error rate you can see on a sequencing trace. And its first domain is very much alive, which is why Taq will destroy a probe sitting in its path. You can do to Taq exactly what proteolysis did to Pol I, and the product is called Klentaq.",
      desc:"A fourth row, Taq, with all three domains present but the proofreading domain greyed and struck through." },
    { v:5, cap:"Family B: a different architecture, not a deletion",
      note:"Now we cross the line, and I want you to notice that we have crossed it. Pfu from Pyrococcus, Vent, KOD, Takara's PrimeSTAR — these are family B, archaeal, a genuinely different protein architecture. Do not read this row as Pol I with the left-hand box deleted; that is Klenow, three rows up. These are cousins, not children. What is genuinely shared, and it is why the two right-hand columns still line up, is the polymerase fold and the proofreading exonuclease — the same machinery in both families. What family B never had is the five prime to three prime nuclease, which is why the bar simply starts further right, with no box at all rather than an empty one. And here is the lovely part: that domain still exists in these organisms, just as a separate protein called FEN-1. In E. coli it is fused to the polymerase; in archaea it walks around on its own. The piece really is a modular part, which is what gives anyone the right to draw this as boxes. Practically: these proofread, they will not touch what is in front of them, and they leave you blunt ends. One caveat on PrimeSTAR — Takara does not publish what is in it, so I have placed it on what it does rather than on a sequence.",
      desc:"Below a dashed rule labelled FAMILY B, a fifth row for the archaeal enzymes Pfu, Vent, KOD and PrimeSTAR. Its bar starts at the second column, with no box at all where the 5-prime to 3-prime nuclease would be." },
    { v:6, cap:"Natural diversity, then domain engineering &mdash; that is the catalogue",
      note:"And finally you can add pieces as well as take them away. Phusion and Q5 are that same family B core with a small DNA-binding domain fused on — for Q5, NEB names it as Sso7d, from Sulfolobus — which clamps the enzyme to the DNA and makes it far more processive. That is not a fidelity trick, it is a grip trick, and it is why those enzymes want fifteen to thirty seconds per kilobase instead of a minute, and why their annealing rules will catch you out if you carry a Taq protocol across. Now step back and read the whole thing, and read it as two stories rather than one. Nature supplied two architectures. Then thirty years of engineering cut a domain off one, killed a domain in another, and bolted a new domain onto a third. There are dozens more products I have not put up and new ones every year, and you do not memorise them. You read the columns, and the catalogue tells you which columns each product has.",
      desc:"A sixth row, Phusion and Q5: the same archaeal arrangement with an extra blue box appended on the right labelled DNA binding, annotated plus Sso7d. The caption reads: natural diversity, then domain engineering, that is the catalogue." }
  ];

  function go(i,animated){
    const to=S[i].v;
    if(raf){cancelAnimationFrame(raf);raf=null;}
    r.cap.innerHTML=S[i].cap;
    if(cur===null||animated===false||reduce.matches){cur=to;paint(cur);return;}
    const from=cur, t0=performance.now(), dur=420;
    raf=requestAnimationFrame(function f(now){
      const t=Math.min(1,(now-t0)/dur);
      cur=from+(to-from)*t; paint(cur);
      if(t<1) raf=requestAnimationFrame(f); else raf=null;
    });
  }
  go(0,false);
  return { steps:S.map(x=>({note:x.note,desc:x.desc})), go:go };
});
})();
