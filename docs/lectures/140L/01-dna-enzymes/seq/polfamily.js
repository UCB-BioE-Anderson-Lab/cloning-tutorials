/* ------------------------------------------------------------------ *
 * polfamily.js — the same three domains, across thirty years of products.
 *
 * The previous slide carved ONE polypeptide into three active sites and
 * got three catalogue entries out of it. This one keeps the three
 * columns and changes organism instead, because that is what the
 * catalogue actually is: mostly homologous enzymes with specific
 * domains present, removed, killed, or bolted on.
 *
 * That modularity is real rather than a teaching convenience. The
 * polymerase fold and the DEDD proofreading domain are shared between
 * families A and B; the 5'->3' exonuclease domain is FEN-1-like, and in
 * archaea and eukaryotes FEN-1 is a free-standing protein rather than a
 * piece of the polymerase. So a domain genuinely can be a separate part.
 *
 * DELIBERATELY NOT TO SCALE, and the note says so out loud. The Pol I
 * slide is drawn to E. coli residue boundaries; this one cannot be,
 * because the manufacturers do not disclose the parent enzymes. Equal
 * column geometry across rows is what makes the comparison readable,
 * and pretending it is a residue map would be a lie the last slide's
 * format would lend credibility to.
 *
 * Four states per slot:
 *   on    present and working
 *   dead  present but catalytically dead   (Taq's proofreader)
 *   off   present in the parent, cut away  (Klenow)
 *   none  not in this lineage at all       (the archaeal enzymes)
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const INK="#111111", SLATE="#004373", RED="#ba3a13", MUTED="#767676", FAINT="#c9c9c9";
const SVGNS="http://www.w3.org/2000/svg";
const n2 = v => Math.round(v*10)/10;

/* the three columns keep Pol I's proportions so the eye carries over
   from the previous slide, but the bar is schematic, not a residue map */
/* BX leaves room for the longest row name -- "Pfu . Vent . KOD .
   PrimeSTAR" -- to sit inside the slide's left padding rather than
   hanging off it */
const BX=468, BW=872;
const CUT=[0, 0.348, 0.557, 1].map(f => BX + f*BW);
const EX=[1360, 1478];
const HEAD=["5&#8242;&#8594;3&#8242; exo", "3&#8242;&#8594;5&#8242; exo", "polymerase"];
/* "removes what is ahead" invited the reading that this nuclease chews
   template in front of the polymerase. It is a structure-specific
   nuclease that acts at a nick, which is what nick translation IS. */
const JOB =["removes downstream DNA", "proofreads", "adds bases"];
const RY=320, RH=50, RSTEP=82;
const SPLIT=44, BREAK=3;      /* rows from BREAK on are the other family */
const rowY = k => k*RSTEP + (k>=BREAK ? SPLIT : 0);

const ROWS=[
  { name:"<tspan font-style=\"italic\">E. coli</tspan> Pol I", d:["on","on","on"] },
  { name:"Klenow fragment",            d:["off","on","on"] },
  { name:"Taq",                        d:["on","dead","on"] },
  { name:"Pfu &middot; Vent &middot; KOD &middot; PrimeSTAR", d:["none","on","on"] },
  { name:"Phusion &middot; Q5",        d:["none","on","on"], add:"DNA binding" }
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
    g += '<text x="'+n2(cx)+'" y="'+(RY+RH/2+7)+'" text-anchor="middle" font-size="20" '+
         'font-weight="700" fill="'+c+'">'+label+'</text>';
  if (state==="dead")
    g += '<path d="M'+n2(cx-26)+' '+(RY+12)+'l52 30M'+n2(cx+26)+' '+(RY+12)+'l-52 30" '+
         'fill="none" stroke="'+RED+'" stroke-width="4.6" stroke-linecap="round"/>';
  return g;
}

function row(k){
  const R=ROWS[k];
  let g='<g data-r="r'+k+'" opacity="0" transform="translate(0 '+n2(rowY(k))+')">';
  g+='<text x="'+(BX-30)+'" y="'+(RY+RH/2+8)+'" text-anchor="end" font-size="21" '+
     'font-weight="700" fill="'+INK+'">'+R.name+'</text>';
  for (let i=0;i<3;i++) g+=box(CUT[i], CUT[i+1], R.d[i], HEAD[i]);
  if (R.add)
    g+='<rect x="'+EX[0]+'" y="'+RY+'" width="'+(EX[1]-EX[0])+'" height="'+RH+'" rx="9" '+
       'fill="#fff" stroke="'+SLATE+'" stroke-width="2.6"/>'+
       '<text x="'+((EX[0]+EX[1])/2)+'" y="'+(RY+RH/2+7)+'" text-anchor="middle" '+
       'font-size="17" font-weight="700" fill="'+SLATE+'">'+R.add+'</text>';
  return g+'</g>';
}

window.Deck.sequence("polfamily", function(slide){
  const svg=document.createElementNS(SVGNS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  svg.innerHTML =
    /* column headings: the three jobs, named once */
    HEAD.map(function(h,i){
      const cx=(CUT[i]+CUT[i+1])/2;
      return '<text x="'+n2(cx)+'" y="284" text-anchor="middle" font-size="21" '+
             'font-weight="700" fill="'+MUTED+'">'+JOB[i]+'</text>';
    }).join("") +
    /* The family boundary, drawn. The archaeal rows already START further
       right, with no box at all where family A has one -- that is the
       difference between a piece cut off and a piece the lineage never
       had -- but the boundary itself has to be named, or the stack reads
       as one series of deletions. */
    '<g data-r="famA"><text x="'+(BX-30)+'" y="'+(RY-16)+'" text-anchor="end" '+
      'font-size="19" font-weight="700" letter-spacing="1.5" fill="'+MUTED+
      '">FAMILY A</text></g>' +
    '<g data-r="famB" opacity="0">' +
      '<path d="M148 '+(RY+2*RSTEP+RH+32)+'H1478" fill="none" stroke="'+FAINT+
        '" stroke-width="2" stroke-dasharray="9 8"/>' +
      '<text x="'+(BX-30)+'" y="'+(RY+rowY(BREAK)-16)+'" text-anchor="end" '+
      'font-size="19" font-weight="700" letter-spacing="1.5" fill="'+MUTED+
      '">FAMILY B</text></g>' +
    ROWS.map((_,k)=>row(k)).join("") +
    '<text data-r="cap" x="800" y="806" text-anchor="middle" font-family="inherit" '+
      'font-weight="700" font-size="29" fill="'+INK+'"></text>';
  slide.appendChild(svg);
  const r={}; svg.querySelectorAll("[data-r]").forEach(e=>r[e.getAttribute("data-r")]=e);
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur=null, raf=null;

  /* shown = how many rows are up; rows fade in one per click */
  function paint(v){
    for (let k=0;k<ROWS.length;k++)
      r["r"+k].setAttribute("opacity", n2(Math.max(0, Math.min(1, v - k))));
    /* the divider arrives with the first archaeal row, not before */
    r.famB.setAttribute("opacity", n2(Math.max(0, Math.min(1, v - BREAK))));
  }

  const S=[
    { v:1, cap:"Family A: one polypeptide, three active sites",
      note:"Hold that picture and change one thing at a time. Here is Pol I again with its three domains, and I am going to keep those three columns fixed and swap the organism underneath them. Two warnings before I do. First, this drawing is not to scale — the last slide was, those were real E. coli residue numbers, but this one is a schematic, because for several of these products the manufacturer does not tell you what the parent enzyme is. Second, watch for the horizontal line partway down. Everything above it is one protein family and everything below it is another, and the difference between those two halves is not the same kind of difference as the one between Pol I and Klenow.",
      desc:"A schematic bar showing E. coli Pol I as three labelled domains under three column headings: removes what is ahead, proofreads, adds bases." },
    { v:2, cap:"Cut a piece off",
      note:"Klenow, from the last slide: the five prime to three prime exonuclease is cut away with a protease, and its box is now a dashed outline to show where the piece used to be. Same protein, one domain lighter.",
      desc:"A second row appears: the Klenow fragment, identical except that the first domain is now an empty dashed outline." },
    { v:3, cap:"Same three domains, a different organism",
      note:"Now Taq, from Thermus aquaticus. Thermostable, which is the whole reason PCR is a machine and not a person adding enzyme after every cycle. But look at the columns rather than the name: Taq has all three domains, and the middle one is dead. Taq does not proofread — the domain is there, it just does not work. That is why Taq has an error rate you can measure by eye on a sequencing trace, and it is also why Taq will chew up a probe in front of it, because that first domain is very much alive. And you can do to Taq exactly what proteolysis did to Pol I: cut the front domain off and you have Klentaq.",
      desc:"A third row: Taq, with all three domains present, but the proofreading domain greyed and struck through with a red cross." },
    { v:4, cap:"Family B: a different architecture, not a deletion",
      note:"Now we cross the line, and I want you to notice that we have crossed it. Everything above is family A, the Pol I lineage. Pfu from Pyrococcus, Vent, KOD, Takara's PrimeSTAR — these are family B, archaeal, a genuinely different protein architecture. So do not read this row as Pol I with the left-hand box deleted. That is Klenow, and it is two rows up. These are cousins, not children. What IS shared, and it is why the two right-hand columns still line up, is real: the polymerase fold and the proofreading exonuclease are structurally the same machinery in both families. What family B does not have, and never had, is the five prime to three prime nuclease — which is why their bar simply starts further right, with no box at all, rather than an empty one. And here is the lovely part. That domain still exists in these organisms; it is just a separate protein, called FEN-1. In E. coli it is fused to the polymerase, in archaea it walks around on its own. So the piece really is a modular part, which is the licence for drawing any of this as boxes. Practically: these enzymes proofread, they will not touch what is in front of them, and they leave you blunt ends. One caveat on PrimeSTAR: Takara does not publish what is in it, so I have placed it on what it does rather than on a sequence.",
      desc:"A fourth row for the archaeal family B enzymes Pfu, Vent, KOD and PrimeSTAR. Its bar starts at the second column, with no box at all where the 5-prime to 3-prime exonuclease would be." },
    { v:5, cap:"Natural diversity, then domain engineering &mdash; that is the catalogue",
      note:"And finally you can add pieces as well as remove them. Phusion and Q5 are that same family B core with a small DNA-binding domain fused on — for Q5, NEB names it as Sso7d, from Sulfolobus — which clamps the enzyme to the DNA and makes it far more processive. That is not a fidelity trick, it is a grip trick, and it is why those enzymes want fifteen to thirty seconds per kilobase instead of a minute, and why their annealing temperature rules are different enough to catch you out if you carry a Taq protocol across. Now step back and read the whole picture, and read it as two things rather than one. Nature supplied two architectures. Then thirty years of engineering cut a domain off one, killed a domain in another, and bolted a new domain onto a third. The catalogue is the product of both of those, not of endlessly reshuffling one chassis. There are dozens more enzymes I have not put up, and new ones every year. You do not memorise them. You read the columns, and the catalogue tells you which columns each product has.",
      desc:"A fifth row, Phusion and Q5: the same archaeal arrangement with an extra blue box appended on the right labelled DNA binding. The caption reads: thirty years of this, and the catalogue is the result." }
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
