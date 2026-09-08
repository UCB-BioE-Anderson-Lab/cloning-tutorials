/* ------------------------------------------------------------------ *
 * exosap.js — heat-killable or not, told in the order it bites you.
 *
 * The narrative runs CIP first, because that is the one people meet
 * first and get wrong:
 *
 *   1  You phosphatase a vector with CIP. Now CIP is in the tube, and
 *      you have to physically take the DNA away from it — a gel or a
 *      column — before you ligate.
 *   2  Trying to heat-kill it instead is the classic error. It survives,
 *      bleeds into the ligation, and takes the INSERT's 5' phosphates
 *      as well. Nothing ligates and nothing errors.
 *   3  SAP is the same reaction from a different organism, and it IS
 *      fully killed by heat.
 *   4  Which buys you ExoSAP: Exonuclease I eats the leftover primers,
 *      SAP destroys the leftover dNTPs, heat kills them both, and the
 *      PCR goes straight into a sequencing reaction unpurified.
 *
 * So the CIP half is the problem and the ExoSAP half is what the
 * property is worth — not the other way round.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const INK="#111111", BLUE="#004373", RED="#ba3a13", MUT="#767676";
const n2=v=>Math.round(v*10)/10;
const lerp=(a,b,t)=>a+(b-a)*t;

const line=(a,b,c,w)=>'<path d="M'+n2(a[0])+' '+n2(a[1])+'L'+n2(b[0])+' '+n2(b[1])+
  '" fill="none" stroke="'+c+'" stroke-width="'+(w||4)+'" stroke-linecap="round"/>';
const txt=(x,y,t,c,sz,w)=>'<text x="'+n2(x)+'" y="'+n2(y)+'" text-anchor="middle" font-size="'+
  (sz||23)+'" font-weight="'+(w||700)+'" fill="'+(c||INK)+'">'+t+'</text>';
/* a strand: barb marks the 3' end */
function strand(x1,x2,y,c,rev){
  const tip=rev?x1:x2, back=rev?18:-18;
  return line([x1,y],[x2,y],c)+line([tip,y],[tip+back,y+(rev?10:-10)],c);
}
function duplex(x1,x2,y,c){ return strand(x1,x2,y,c,false)+strand(x1,x2,y+26,c,true); }
function P(x,y,gone,c){
  return '<g opacity="'+(1-gone*0.92).toFixed(2)+'" transform="translate('+n2(x)+' '+
    n2(y-gone*46)+')"><circle r="14" fill="#fff" stroke="'+(c||RED)+'" stroke-width="3"/>'+
    '<text y="7" text-anchor="middle" font-size="19" font-weight="700" fill="'+(c||RED)+
    '">P</text></g>';
}
function dntp(x,y,gone){
  const r=15, v=[90,162,234,306,18].map(d=>[x+r*Math.cos(d*Math.PI/180),
                                            y-r*Math.sin(d*Math.PI/180)]);
  return '<path d="M'+v.map(p=>n2(p[0])+" "+n2(p[1])).join("L")+'Z" fill="none" stroke="'+
    BLUE+'" stroke-width="3.4"/>'+
    '<g opacity="'+(1-gone).toFixed(2)+'">'+line(v[2],[x-26,y+10],BLUE,3.4)+'</g>'+
    P(x-40,y+10,gone);
}
/* an enzyme, named; struck through and greyed once heat has taken it */
function enz(x,y,name,dead){
  const c = dead>0.5 ? MUT : RED;
  let g=txt(x,y,name,c,26);
  if(dead>0.5){
    const w=name.length*7.6+16;
    g+='<path d="M'+n2(x-w)+' '+n2(y-8)+'H'+n2(x+w)+'" stroke="'+MUT+
       '" stroke-width="3" fill="none"/>';
  }
  return g;
}

window.Deck.sequence("exosap", function(slide){
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  slide.appendChild(svg);

  /* s = {strip, low, clean, heat} */
  function paint(s){
    let g="";
    /* ---------- top: CIP, and why it has to come out ---------- */
    g+=txt(800,176,"CIP: you have to take the DNA away from it",INK,30);
    g+=duplex(250,620,262,INK)+txt(435,336,"phosphatased vector",MUT,21,600);
    g+=duplex(760,1080,262,INK)+txt(920,336,"insert",MUT,21,600);
    g+=P(760,262,s.strip)+P(1080,288,s.strip);
    g+=enz(1310,258,"CIP",0);
    g+=txt(1310,306,s.strip>0.5?"heat did not kill it":"gel or column, not heat",
           s.strip>0.5?RED:MUT,22,600);
    if(s.strip>0.5) g+=txt(920,392,"it takes the insert&#8217;s phosphates too, nothing ligates",RED,25,700);

    /* ---------- bottom: SAP, and what being killable buys ---------- */
    if(s.low>0){
      g+='<g opacity="'+s.low.toFixed(2)+'">';
      g+='<path d="M150 470H1450" stroke="'+MUT+'" stroke-width="1.6" stroke-dasharray="7 9"/>';
      g+=txt(800,540,"SAP: a different organism, and heat does kill it",INK,30);
      g+=duplex(210,560,624,INK)+txt(385,700,"PCR product",MUT,21,600);
      [0,1,2].forEach(function(k){
        const x=250+k*118;
        g+='<g opacity="'+(1-s.clean).toFixed(2)+'">'+strand(x,x+82,752,BLUE)+'</g>';
      });
      g+='<g opacity="'+(1-s.clean).toFixed(2)+'">'+txt(385,800,"leftover primers",MUT,21,600)+'</g>';
      [0,1,2].forEach(k=>{ g+=dntp(760+k*104,752,s.clean); });
      g+=txt(864,800,"leftover dNTPs",MUT,21,600);
      /* the technique is named after its two enzymes, so the name is a
         heading over them rather than a caption somewhere else */
      g+=txt(1290,568,"ExoSAP",INK,30,700);
      g+='<path d="M1168 584H1412" stroke="'+MUT+'" stroke-width="1.6"/>';
      g+=enz(1290,624,"Exonuclease I",s.heat);
      g+=enz(1290,682,"SAP",s.heat);
      if(s.heat>0.5){
        g+=txt(1290,734,"80&deg;C, both gone",MUT,22,600);
        g+=txt(385,752,"ExoSAP, sequence it unpurified",BLUE,23,700);
      }
      g+='</g>';
    }
    svg.innerHTML=g;
  }

  const S=[
    {s:{strip:0,low:0,clean:0,heat:0},
     note:"Start with the case you will actually meet. You have phosphatased your vector with CIP so it cannot close on itself, and now CIP is sitting in the tube with your DNA. Before you ligate, you have to physically separate the two: run it on a gel and cut the band out, or put it over a column. Which raises the obvious question. Why not just heat it and move on?",
     desc:"A phosphatased vector and an insert, drawn as duplexes; the insert carries a red phosphate at each 5-prime end. CIP is named in red beside them, labelled: gel or column, not heat."},
    {s:{strip:1,low:0,clean:0,heat:0},
     note:"Because here is the error, and it is made every year. People try to heat-kill CIP the way they would any other enzyme. It does not work, CIP is notoriously robust, so it comes through into the ligation still active, and now it meets your insert, which does still have its five prime phosphates. It takes those off too. Ligase has nothing to seal. You get no colonies, and nothing anywhere told you why: the reaction looked like it ran.",
     desc:"The insert's phosphates have gone. CIP is still named in red, now labelled heat did not kill it, and a line reads: it takes the insert's phosphates too, nothing ligates."},
    {s:{strip:1,low:1,clean:0,heat:0},
     note:"Which is why the alternatives exist. SAP is shrimp alkaline phosphatase: the same reaction, an alkaline phosphatase like CIP, but from a different organism, and this one is fully destroyed by heat. That single difference is worth a lot, and the clearest illustration of it is a reagent called ExoSAP, whose name is literally the two enzymes in the tube: Exonuclease I and shrimp alkaline phosphatase.",
     desc:"Below a dividing line, a second scene: a PCR product with leftover single-stranded primers and leftover dNTPs. To the right, a heading reading ExoSAP over the two enzymes it names, Exonuclease I and SAP, in red."},
    {s:{strip:1,low:1,clean:1,heat:1},
     note:"So here is ExoSAP doing its job: sequencing a PCR product straight out of the tube. You met Exonuclease I last section, single-stranded only, so it eats the leftover primers and cannot touch the double-stranded product. What SAP adds is the leftover dNTPs, whose phosphates it takes off so they cannot be incorporated. Then the part that matters here: one incubation at eighty degrees kills both, and the tube goes straight into the sequencing reaction. No gel, no column, no sample lost. That is what being heat-killable is worth, and it is exactly what CIP cannot give you. Which is why you will see ExoSAP sold as a single premixed reagent, and why there is no CIP equivalent of it.",
     desc:"The primers have gone and every dNTP has lost its phosphate. Both enzyme names are struck through and greyed, labelled 80 degrees, both gone, and a line by the product reads: ExoSAP, sequence it unpurified."}
  ];
  let cur=null, raf=null;
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  function go(i,animated){
    const to=S[i].s;
    if(raf){cancelAnimationFrame(raf);raf=null;}
    if(!cur||animated===false||reduce.matches){ cur=Object.assign({},to); paint(cur); return; }
    const from=Object.assign({},cur), t0=performance.now(), dur=620;
    const ease=t=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    raf=requestAnimationFrame(function f(now){
      const p=Math.min(1,(now-t0)/dur), e=ease(p), s={};
      Object.keys(to).forEach(k=>{ s[k]=lerp(from[k],to[k],e); });
      paint(s); cur=s;
      if(p<1) raf=requestAnimationFrame(f); else raf=null;
    });
  }
  go(0,false);
  return { steps:S.map(x=>({note:x.note,desc:x.desc})), go:go };
});
})();
