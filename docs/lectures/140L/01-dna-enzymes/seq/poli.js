/* ------------------------------------------------------------------ *
 * poli.js — DNA Polymerase I as three domains on one polypeptide.
 *
 * The argument: three rows of the NEB table are not three facts to
 * memorise, they are three pieces of one protein, and the catalogue
 * entries are literally what you get by removing pieces.
 *
 *   full length   5'->3' exo  +  3'->5' exo  +  polymerase
 *   Klenow        proteolysis removes the 5'->3' exo domain
 *   Klenow exo-   two point mutations kill the proofreading site
 *
 * NOTE: Klenow KEEPS proofreading. The slide this replaced said the
 * opposite, which is also why the "Klenow Frag exo-" column exists.
 * Domain boundaries are the E. coli Pol I residues (928 aa total).
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const INK="#111111", SLATE="#004373", RED="#ba3a13", MUTED="#767676";
const SVGNS="http://www.w3.org/2000/svg";
const n2 = v => Math.round(v*10)/10;

const X0=210, X1=1390, YT=402, H=104, L=928;
const at = r => X0 + (r/L)*(X1-X0);
const D = [
  { a:1,   b:323, key:"exo53",  name:"5&#8242;&#8594;3&#8242; exo", job:"removes what is ahead" },
  { a:324, b:517, key:"exo35",  name:"3&#8242;&#8594;5&#8242; exo", job:"proofreads" },
  { a:518, b:928, key:"pol",    name:"polymerase",                          job:"adds bases" }
];

function seg(d){
  const x = at(d.a), w = at(d.b) - at(d.a), cx = x + w/2;
  return '<g data-r="'+d.key+'">' +
    '<rect x="'+n2(x)+'" y="'+YT+'" width="'+n2(w)+'" height="'+H+'" rx="10" fill="#fff" ' +
      'stroke="'+INK+'" stroke-width="3"/>' +
    '<text x="'+n2(cx)+'" y="'+(YT+46)+'" text-anchor="middle" font-size="28" font-weight="700" ' +
      'fill="'+INK+'">'+d.name+'</text>' +
    '<text x="'+n2(cx)+'" y="'+(YT+80)+'" text-anchor="middle" font-size="24" ' +
      'fill="'+MUTED+'">'+d.job+'</text>' +
    '<text x="'+n2(cx)+'" y="'+(YT+H+34)+'" text-anchor="middle" font-size="22" ' +
      'fill="'+MUTED+'">'+d.a+'&#8211;'+d.b+'</text></g>';
}

window.Deck.sequence("polI", function(slide){
  const svg = document.createElementNS(SVGNS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  svg.innerHTML =
    D.map(seg).join("") +
    /* the scissors cut, and the bracket naming what is left */
    '<g data-r="cut" opacity="0"><path d="M'+at(323)+' '+(YT-34)+'V'+(YT+H+14)+'" fill="none" ' +
      'stroke="'+RED+'" stroke-width="3.4" stroke-dasharray="11 9"/>' +
      '<text x="'+at(323)+'" y="'+(YT-48)+'" text-anchor="middle" font-size="23" ' +
      'font-weight="700" fill="'+RED+'">proteolysis</text></g>' +
    '<g data-r="brace" opacity="0">' +
      '<path d="M'+at(324)+' '+(YT+H+62)+'v20H'+at(928)+'v-20" fill="none" stroke="'+SLATE+'" ' +
      'stroke-width="3"/>' +
      '<text data-r="bracelab" x="'+((at(324)+at(928))/2)+'" y="'+(YT+H+118)+'" ' +
      'text-anchor="middle" font-size="30" font-weight="700" fill="'+SLATE+'"></text></g>' +
    /* the two point mutations that kill proofreading */
    '<g data-r="mut" opacity="0"><text x="'+((at(324)+at(517))/2)+'" y="'+(YT-22)+'" ' +
      'text-anchor="middle" font-size="24" font-weight="700" fill="'+RED+'">D355A E357A</text>' +
      '<path d="M'+(at(360)-30)+' '+(YT+26)+'l60 52M'+(at(360)+30)+' '+(YT+26)+'l-60 52" ' +
      'fill="none" stroke="'+RED+'" stroke-width="5" stroke-linecap="round"/></g>' +
    '<text x="'+X0+'" y="'+(YT-24)+'" font-size="24" font-weight="700" fill="'+MUTED+'">N</text>' +
    '<text x="'+X1+'" y="'+(YT-24)+'" text-anchor="end" font-size="24" font-weight="700" ' +
      'fill="'+MUTED+'">C</text>' +
    '<text data-r="cap" x="800" y="700" text-anchor="middle" font-family="inherit" ' +
      'font-weight="700" font-size="31" fill="'+INK+'"></text>' +
    '<text data-r="row" x="800" y="754" text-anchor="middle" font-family="inherit" ' +
      'font-size="26" fill="'+MUTED+'"></text>';
  slide.appendChild(svg);
  const r={}; svg.querySelectorAll("[data-r]").forEach(e=>r[e.getAttribute("data-r")]=e);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const KEYS=["gone","cut","brace","mut"];
  let cur=null, raf=null;

  function paint(s){
    /* the 5'->3' exo domain slides off to the left as it is cleaved away */
    r.exo53.setAttribute("opacity", n2(1 - 0.86*s.gone));
    r.exo53.setAttribute("transform", "translate(" + n2(-150*s.gone) + " 0)");
    r.cut  .setAttribute("opacity", n2(s.cut));
    r.brace.setAttribute("opacity", n2(s.brace));
    r.mut  .setAttribute("opacity", n2(s.mut));
    r.exo35.setAttribute("opacity", n2(1 - 0.45*s.mut));
  }

  const S=[
    { s:{gone:0,cut:0,brace:0,mut:0}, cap:"One polypeptide, three active sites",
      row:"928 residues, three jobs — and each one is a row of the NEB table",
      note:"E. coli DNA polymerase I is a single polypeptide with three separate catalytic domains. At the N terminus, a five prime to three prime exonuclease that removes whatever is in front of the enzyme. In the middle, a three prime to five prime exonuclease that proofreads. At the C terminus, the polymerase itself. Three of the rows in the NEB table you are about to see are not three independent facts — they are these three pieces, and the catalogue entries are what you get by taking pieces away.",
      desc:"A bar representing the 928-residue polymerase I polypeptide, running N terminus on the left to C terminus on the right, divided into three labelled domains: five prime to three prime exonuclease at residues 1 to 323, three prime to five prime exonuclease at 324 to 517, and the polymerase at 518 to 928." },
    { s:{gone:1,cut:1,brace:1,mut:0}, cap:"It still proofreads", lab:"Klenow fragment",
      row:"NEB: 5&#8242;&#8594;3&#8242; exo — no · 3&#8242;&#8594;5&#8242; exo — YES",
      note:"Cleave the polypeptide with a protease and the N-terminal domain comes away. What is left is the Klenow fragment. Note carefully what it keeps: Klenow still proofreads. It has lost the five prime to three prime exonuclease, so it will no longer chew up what is in front of it — which is exactly why you use it to fill in a recessed three prime end without destroying the very end you are filling.",
      desc:"The five prime to three prime exonuclease domain has been cut away along a dashed red line marked proteolysis and slid off to the left. A blue bracket under the two remaining domains labels them the Klenow fragment." },
    { s:{gone:1,cut:1,brace:1,mut:1}, cap:"Now neither exonuclease works", lab:"Klenow exo&#8315;",
      row:"NEB: 5&#8242;&#8594;3&#8242; exo — no · 3&#8242;&#8594;5&#8242; exo — no",
      note:"Take Klenow and make two point mutations, D355A and E357A, in the proofreading active site, and you get Klenow exo minus. Now neither exonuclease works. That matters when you need an enzyme that will not touch the ends of your substrate at all — most famously in Sanger sequencing, where a three prime to five prime exonuclease would sit there removing the dideoxy terminator you just paid for. Same protein, three catalogue entries, and the difference between them is which active sites are still there.",
      desc:"The proofreading domain is faded and struck through with a red cross, labelled with the two point mutations D355A and E357A. Only the polymerase domain remains fully active." }
  ];

  function go(i,animated){
    const to=S[i].s;
    if(raf){cancelAnimationFrame(raf);raf=null;}
    r.cap.innerHTML=S[i].cap; r.row.innerHTML=S[i].row;
    if(S[i].lab) r.bracelab.innerHTML=S[i].lab;
    if(!cur||animated===false||reduce.matches){cur=Object.assign({},to);paint(cur);return;}
    const from=Object.assign({},cur), t0=performance.now(), dur=760;
    const ease=t=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    raf=requestAnimationFrame(function f(now){
      const t=Math.min(1,(now-t0)/dur), e=ease(t), s={};
      KEYS.forEach(k=>s[k]=from[k]+(to[k]-from[k])*e);
      paint(s); cur=s;
      if(t<1) raf=requestAnimationFrame(f); else raf=null;
    });
  }
  go(0,false);
  return { steps:S.map(x=>({note:x.note,desc:x.desc})), go:go };
});
})();
