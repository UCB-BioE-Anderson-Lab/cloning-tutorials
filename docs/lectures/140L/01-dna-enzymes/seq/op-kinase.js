/* ------------------------------------------------------------------ *
 * op-kinase.js — PNK, and the first transphosphorylation of the course.
 *
 * Deliberately the same picture as the nuclease operators: the DNA is
 * drawn all-atom, the backbone is red because the enzyme needs it, the
 * bases are grey because it never reads them. What changes is the verb.
 * Every enzyme so far ran a hydroxyl at a phosphate and DESTROYED a
 * bond. This one runs a hydroxyl at a phosphate and MOVES one.
 *
 * The nucleophile is the oligo's own free 5' hydroxyl; the electrophile
 * is the gamma phosphate of ATP; the leaving group is ADP. Alpha and
 * beta are labelled only so gamma can be pointed at — they are not the
 * subject and nothing is said about them.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const M=window.DNAModel, A=window.Atoms;
const INK="#111111", MUT="#767676", RED=M.HOT;
const n2=v=>Math.round(v*10)/10;
/* four held frames: substrate, first arrow, second arrow, product */
const DUR=[1.05,1.15,1.15,1.75];
const STOP=DUR.reduce((a,d)=>(a.push((a[a.length-1]||0)+d),a),[]);
const CYCLE=STOP[STOP.length-1];

const SEQ="GATC", N=SEQ.length;
const X0=880;                       /* where the oligo starts            */
const PY=286;                       /* the triphosphate chain            */
const AX=[452,566,680];             /* alpha, beta, gamma                */

const bond=(a,b,c,w)=>'<path d="M'+n2(a[0])+' '+n2(a[1])+'L'+n2(b[0])+' '+n2(b[1])+
  '" fill="none" stroke="'+c+'" stroke-width="'+(w||2.6)+'" stroke-linecap="round"/>';
function lab(p,t,c,sz){
  const s=sz||17;
  return '<circle cx="'+n2(p[0])+'" cy="'+n2(p[1])+'" r="'+n2(s*0.62)+'" fill="#fff"/>'+
    '<text x="'+n2(p[0])+'" y="'+n2(p[1]+s*0.34)+'" text-anchor="middle" font-size="'+n2(s)+
    '" font-weight="600" fill="'+c+'">'+t+'</text>';
}
/* one phosphate of the chain: P with its non-bridging oxygens */
function phos(x,y,c,term,d){
  d = d||1;                          /* which side the free O&#8315; sits on */
  let g=bond([x-4,y],[x-4,y-30],c)+bond([x+4,y],[x+4,y-30],c)+lab([x,y-46],"O",c);
  g+=bond([x,y],[x,y+30],c)+lab([x,y+46],"O&#8315;",c);
  if(term) g+=bond([x,y],[x+34*d,y],c)+lab([x+52*d,y],"O&#8315;",c);
  return g+lab([x,y],"P",c,21);
}
const LY=70;                        /* how far the greek letters sit above  */

/* ATP, drawn once. Gamma is drawn separately because it changes owner,
   and beta only becomes a terminus once it has. */
function atpCore(done){
  A.setScale(0.66);
  const R=A.R, sr=R*0.90;
  const sug=[352,430];                       /* the ribose               */
  const v=[270,342,54,126,198].map(d=>[sug[0]+sr*Math.cos(d*Math.PI/180),
                                       sug[1]-sr*Math.sin(d*Math.PI/180)]);
  let g='<path d="M'+v.map(p=>n2(p[0])+" "+n2(p[1])).join("L")+'Z" fill="#f4f4f4" stroke="'+
        INK+'" stroke-width="2.4" stroke-linejoin="round"/>'+lab(v[4],"O",INK,15);
  const b=A.baseEdgeAt("A", v[0][0], v[0][1]+R*0.80, false, INK);
  g+=bond(v[0], b.N9||b.N1, INK)+b.g;
  /* 5' arm up to the alpha phosphate */
  const c5=[v[3][0]-24,v[3][1]-24];
  g+=bond(v[3],c5,INK)+bond(c5,[AX[0],PY],INK)+lab([(c5[0]+AX[0])/2,(c5[1]+PY)/2],"O",INK,15);
  g+=phos(AX[0],PY,INK)+phos(AX[1],PY,INK,done,1);
  g+=bond([AX[0],PY],[AX[1],PY],INK)+lab([(AX[0]+AX[1])/2,PY],"O",INK,15);
  g+='<text x="'+AX[0]+'" y="'+(PY-LY)+'" text-anchor="middle" font-size="24" fill="'+MUT+
     '">&alpha;</text>'+
     '<text x="'+AX[1]+'" y="'+(PY-LY)+'" text-anchor="middle" font-size="24" fill="'+MUT+
     '">&beta;</text>';
  return g;
}
/* the gamma phosphate, on whichever molecule currently owns it */
function gamma(done, tip){
  const p = done ? [tip[0]-48, tip[1]] : [AX[2], PY];
  let g="";
  /* it is a terminal monoester either way, so it keeps its fourth oxygen --
     on whichever side the bridge is not */
  if(done) g+=bond([p[0]+18,p[1]],tip,RED);
  else     g+=bond([AX[1],PY],[p[0]-18,PY],RED)+lab([(AX[1]+p[0])/2,PY],"O",RED,15);
  g+=phos(p[0],p[1],RED,true,done?-1:1);
  g+='<text x="'+n2(p[0])+'" y="'+n2(p[1]-LY)+'" text-anchor="middle" font-size="24" '+
     'font-weight="700" fill="'+RED+'">&gamma;</text>';
  return g;
}
/* the same curly arrows as the mechanism section, with its own marker id --
   two sequences sharing one id resolve to whichever <defs> comes first */
function arrow(a,b,bow){
  const mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2;
  const dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy)||1;
  const cx=mx-dy/L*bow, cy=my+dx/L*bow;
  return '<path d="M'+n2(a[0])+' '+n2(a[1])+'Q'+n2(cx)+' '+n2(cy)+' '+n2(b[0])+' '+n2(b[1])+
         '" fill="none" stroke="'+RED+'" stroke-width="2.9" marker-end="url(#kn-h)"/>';
}
const DEFS='<defs><marker id="kn-h" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" '+
  'markerHeight="7" orient="auto"><path d="M0 0L12 6L0 12z" fill="'+RED+'"/></marker></defs>';

window.Deck.sequence("op-kinase", function(slide){
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  slide.appendChild(svg);
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  let raf=null;

  /* the oligo: single stranded, backbone red, bases grey -- PNK reads neither.
     Its 5' oxygen stops being a hydroxyl the moment the phosphate lands on it. */
  function oligo(done){
    const role=Array.from({length:N},()=>({bb:"hot", base:"bg"}));
    const m=M.make({top:SEQ, range:{top:[0,N], bot:[N,N]},
                    ends:{t5: done?"o":"oh", t3:"oh"},
                    roleTop:role, roleBot:role});
    return M.draw(m, X0);
  }
  /* Four frames, not a tween. The phosphate does not slide across the slide:
     the arrows say what happens, and then the product is simply there. */
  function paint(f){
    const done = f===3;
    M.draw(M.make({top:SEQ, range:{top:[0,N],bot:[N,N]}}), X0);   /* fills anchors */
    const tip=(M.anchors && M.anchors.term && M.anchors.term.top5) || [824,248];
    let arr="";
    if(f===1||f===2) arr+=arrow([tip[0]-14,tip[1]-16],[AX[2]+17,PY-20], 55);
    if(f===2)         arr+=arrow([AX[2]-22,PY+12],[(AX[1]+AX[2])/2+4,PY+16], -46);
    svg.innerHTML=
      '<text x="800" y="132" text-anchor="middle" font-size="42" font-weight="700" fill="'+INK+
        '">T4 Polynucleotide Kinase</text>'+
      '<text x="800" y="180" text-anchor="middle" font-size="25" fill="'+MUT+
        '">the oligo&#8217;s own 5&#8242; hydroxyl attacks the &gamma; phosphate of ATP</text>'+
      DEFS+
      '<g transform="translate(-64,84)">'+
        atpCore(done)+ gamma(done,tip) + oligo(done) + arr +
      '</g>'+
      '<text x="800" y="800" text-anchor="middle" font-size="25" font-weight="700" fill="'+RED+
        '">'+(done?"the oligo now has a 5&#8242; phosphate, and ADP is left over"
                  :"a hydroxyl at a phosphate again, but this bond is moved, not destroyed")+
      '</text>';
  }
  function go(){
    if(raf){cancelAnimationFrame(raf);raf=null;}
    if(reduce.matches){ paint(3); return; }
    const t0=performance.now();
    raf=requestAnimationFrame(function f(now){
      if(!slide.classList.contains("on")){ raf=null; return; }
      const t=((now-t0)/1000)%CYCLE;
      let k=0; while(k<3 && t>=STOP[k]) k++;
      paint(k);
      raf=requestAnimationFrame(f);
    });
  }
  go();
  return { steps:[{
    note:"Cast your mind back to the mechanism at the start of the lecture. The hydrolases we opened with ran a hydroxyl at a phosphorus and destroyed a bond. This is the same attack with the opposite outcome: the bond gets moved, not broken \u2014 and here it is drawn with the same arrows. Here is why you care. Suppose you buy an oligo and you want to make a PCR product with it and then ligate that into a vector. A synthetic oligo comes off the synthesiser with a bare five prime hydroxyl \u2014 there is no phosphate on it. And we have just seen what happens when a five prime phosphate is missing: ligase has nothing to seal, and nothing ligates. A restriction digest would have left you a phosphate; a synthesiser does not. So you put it on yourself, with polynucleotide kinase and ATP. Follow the arrows. The oligo's own five prime hydroxyl attacks the gamma phosphorus \u2014 that is the first arrow, and it is the same arrow we drew for hydrolysis, only the nucleophile is an alcohol instead of water. The second arrow breaks the ester to beta, and the electrons land on the bridging oxygen, which is what makes ADP the leaving group. Then the product: the phosphate is simply on the DNA. Alpha and beta are labelled only so you can see which one gamma is; nothing else about them matters here. And notice the backbone is red and the bases are grey, as always \u2014 PNK needs DNA, and does not read a word of it.",
    desc:"On the left, ATP drawn in full chemical structure with its three phosphates labelled alpha, beta and gamma, the gamma phosphate in red. On the right, a four base single-stranded oligo drawn all-atom with a red backbone and grey bases, carrying a free 5-prime hydroxyl. On a loop, a curly arrow is drawn from that hydroxyl to the gamma phosphorus, then a second curly arrow breaks the ester bond to the beta phosphate, and then the product appears: the gamma phosphate now bonded to the oligo's 5-prime oxygen, with ADP left behind."
  }], go:go };
});
})();
