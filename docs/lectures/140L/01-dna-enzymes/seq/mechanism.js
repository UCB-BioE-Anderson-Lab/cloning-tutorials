/* ------------------------------------------------------------------ *
 * mechanism.js — in-line nucleophilic substitution at phosphorus,
 * animated as a continuous reaction coordinate rather than a before
 * and an after.
 *
 * The geometry is the teaching point and it is drawn honestly:
 *
 *   t = 0     tetrahedral phosphate
 *   t = 0.5   PENTACOORDINATE trigonal bipyramid — nucleophile and
 *             leaving group AXIAL (180 degrees apart, which is why the
 *             attack has to be in-line), the other three EQUATORIAL
 *   t = 1     tetrahedral again, leaving group gone, and the three
 *             equatorial ligands have flipped through the plane —
 *             the umbrella inversion
 *
 * Two mechanisms share every frame of this. Only the nucleophile
 * differs: H-O-H destroys the bond, C-O-H relocates it. They are NOT
 * the same reaction and the deck must not say they are.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const INK="#111111", BLUE="#004373", RED="#ba3a13", MUTED="#767676";
const NS="http://www.w3.org/2000/svg";
const n2=v=>Math.round(v*10)/10;
const PX=800, PY=548, PR=31;

/* ligand offsets from P at the three keyframes of the reaction coordinate */
const K={
  nu:[[0,-250],[0,-146],[0,-152]],      /* nucleophile: approaches, bonds, stays  */
  lg:[[0,152],[0,178],[0,236]],         /* leaving group: bonded, stretched, gone */
  e1:[[-152,-82],[-176,0],[-152,84]],   /* the three equatorials invert through   */
  e2:[[152,-82],[176,0],[152,84]],      /* the plane as the reaction completes    */
  e3:[[-84,112],[-100,88],[-84,-116]]
};
function at(k,t){
  const a=K[k], u=t<=.5?t/.5:(t-.5)/.5, i=t<=.5?0:1;
  return [PX+a[i][0]+(a[i+1][0]-a[i][0])*u, PY+a[i][1]+(a[i+1][1]-a[i][1])*u];
}
const lerp=(a,b,t)=>a+(b-a)*t;
const clamp01=v=>v<0?0:v>1?1:v;

window.Deck.sequence("mechanism",function(slide){
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  svg.innerHTML=
    '<defs><marker id="mHead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.2" '+
      'markerHeight="5.2" orient="auto-start-reverse">'+
      '<path d="M0 0L10 5L0 10" fill="none" stroke="'+RED+'" stroke-width="2.2"/></marker></defs>'+
    '<g data-r="bonds" fill="none" stroke="'+INK+'" stroke-width="2.9" stroke-linecap="round">'+
      '<path data-r="bnu"/><path data-r="blg"/><path data-r="be1"/><path data-r="be2"/>'+
    '</g>'+
    '<g data-r="dbl" fill="none" stroke="'+INK+'" stroke-width="2.9" stroke-linecap="round"><path data-r="d1"/><path data-r="d2"/></g>'+'<path data-r="sug1" fill="none" stroke="'+MUTED+'" stroke-width="2.4"/>'+'<path data-r="sug2" fill="none" stroke="'+MUTED+'" stroke-width="2.4"/>'+'<text data-r="sl1" text-anchor="middle" font-size="22" fill="'+MUTED+'">sugar</text>'+'<text data-r="sl2" text-anchor="middle" font-size="22" fill="'+MUTED+'">sugar</text>'+
    '<path data-r="atk" fill="none" stroke="'+RED+'" stroke-width="3.2" marker-end="url(#mHead)"/>'+
    '<path data-r="dep" fill="none" stroke="'+RED+'" stroke-width="3.2" marker-end="url(#mHead)"/>'+
    '<circle data-r="pc" cx="'+PX+'" cy="'+PY+'" r="22" fill="#fff" stroke="none"/>'+
    '<text data-r="pl" x="'+PX+'" y="'+(PY+12)+'" text-anchor="middle" font-size="32" font-weight="700" fill="'+INK+'">P</text>'+
    '<text data-r="tnu" text-anchor="middle" font-size="31" font-weight="700" fill="'+RED+'"></text>'+
    '<text data-r="tlg" text-anchor="middle" font-size="27" font-weight="600" fill="'+INK+'"></text>'+
    '<text data-r="te1" text-anchor="middle" font-size="27" font-weight="600" fill="'+INK+'"></text>'+
    '<text data-r="te2" text-anchor="middle" font-size="27" font-weight="600" fill="'+INK+'"></text>'+
    '<text data-r="te3" text-anchor="middle" font-size="27" font-weight="600" fill="'+INK+'">O</text>'+
    '<text data-r="axis" x="'+(PX+250)+'" y="'+PY+'" font-size="22" fill="'+MUTED+'" opacity="0">'+
      'axial &#8212; 180&#176; apart</text>'+
    '<text data-r="cap" x="800" y="212" text-anchor="middle" font-size="31" font-weight="700" fill="'+INK+'"></text>'+
    '<text data-r="sub" x="800" y="260" text-anchor="middle" font-size="26" fill="'+MUTED+'"></text>'+
    '<text data-r="who" x="800" y="828" text-anchor="middle" font-size="25" font-weight="700" fill="'+BLUE+'"></text>';
  slide.appendChild(svg);
  const r={}; svg.querySelectorAll("[data-r]").forEach(e=>r[e.getAttribute("data-r")]=e);
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur=null, raf=null;

  function bondTo(p,gap){                 /* stop the bond short of the atom label */
    const dx=p[0]-PX, dy=p[1]-PY, L=Math.hypot(dx,dy)||1;
    return ["M"+n2(PX+dx/L*PR)+" "+n2(PY+dy/L*PR),
            "L"+n2(p[0]-dx/L*gap)+" "+n2(p[1]-dy/L*gap)].join("");
  }
  function paint(s){
    const t=s.t;
    const nu=at("nu",t), lg=at("lg",t), e1=at("e1",t), e2=at("e2",t), e3=at("e3",t);
    r.bnu.setAttribute("d",bondTo(nu,26));
    r.bnu.setAttribute("opacity",n2(clamp01(t/0.42)));
    r.blg.setAttribute("d",bondTo(lg,26));
    r.blg.setAttribute("opacity",n2(clamp01((0.94-t)/0.36)));
    r.be1.setAttribute("d",bondTo(e1,24));
    r.be2.setAttribute("d",bondTo(e2,24));
    /* P=O is a DOUBLE BOND — two parallel lines. A wedge would mean
       stereochemistry, which is a different claim entirely. */
    const dx=e3[0]-PX, dy=e3[1]-PY, L=Math.hypot(dx,dy)||1, nx=-dy/L*6, ny=dx/L*6;
    const s0=[PX+dx/L*PR, PY+dy/L*PR], s1=[e3[0]-dx/L*26, e3[1]-dy/L*26];
    r.d1.setAttribute("d","M"+n2(s0[0]+nx)+" "+n2(s0[1]+ny)+"L"+n2(s1[0]+nx)+" "+n2(s1[1]+ny));
    r.d2.setAttribute("d","M"+n2(s0[0]-nx)+" "+n2(s0[1]-ny)+"L"+n2(s1[0]-nx)+" "+n2(s1[1]-ny));
    /* the two ester oxygens each carry a sugar, so the phosphate reads as a
       phosphodiester rather than as a free ion */
    function stub(o,at,path,label,dirx,diry){
      const q=[o[0]+dirx, o[1]+diry];
      r[path].setAttribute("d","M"+n2(o[0]+dirx*0.30)+" "+n2(o[1]+diry*0.30)+
                               "L"+n2(q[0])+" "+n2(q[1]));
      r[label].setAttribute("x",n2(q[0]+dirx*0.34)); r[label].setAttribute("y",n2(q[1]+diry*0.34+8));
    }
    stub(e1,0,"sug1","sl1",-86,-26);
    stub(lg,0,"sug2","sl2",86,34);
    r.sug2.setAttribute("opacity",n2(clamp01((1.06-t)/0.3)));
    r.sl2.setAttribute("opacity",n2(clamp01((1.06-t)/0.3)));
    [["tnu",nu],["tlg",lg],["te1",e1],["te2",e2],["te3",e3]].forEach(function(q){
      r[q[0]].setAttribute("x",n2(q[1][0])); r[q[0]].setAttribute("y",n2(q[1][1]+10));
    });
    r.tlg.setAttribute("opacity",n2(clamp01((1.06-t)/0.3)));
    /* arrow pushing, superimposed on the motion */
    const aO=clamp01((0.72-t)/0.22)*clamp01(t/0.06+0.4);
    r.atk.setAttribute("opacity",n2(s.arrows*aO));
    r.atk.setAttribute("d","M"+n2(nu[0]-46)+" "+n2(nu[1]+26)+"Q"+n2(PX-92)+" "+n2(PY-70)+
                            " "+n2(PX-30)+" "+n2(PY-24));
    r.dep.setAttribute("opacity",n2(s.arrows*clamp01((t-0.34)/0.2)));
    r.dep.setAttribute("d","M"+n2(PX+34)+" "+n2(PY+30)+"Q"+n2(PX+112)+" "+n2(PY+84)+
                            " "+n2(lg[0]+40)+" "+n2(lg[1]-18));
    r.axis.setAttribute("opacity",n2(s.axis));
  }

  const S=[
    { s:{t:0,arrows:0,axis:0}, nu:"", lg:"O", e1:"O", e2:"O&#8315;",
      cap:"One phosphodiester bond",
      sub:"a phosphorus holding two sugars together &mdash; tetrahedral, and going nowhere on its own",
      who:"every enzyme in this lecture attacks this atom",
      note:"Start with the bond. A phosphorus, four oxygens around it in a tetrahedron: a double bonded oxygen, a negative charge, and two ester oxygens running out to the two sugars. That is a phosphodiester, and left alone it is extremely stable — the half life for spontaneous hydrolysis is on the order of tens of millions of years. Everything an enzyme does today is to make this one atom attackable.",
      desc:"A phosphodiester bond at atomic scale: a central phosphorus in a tetrahedral arrangement with a double-bonded oxygen shown as a solid wedge, a negatively charged oxygen, and two ester oxygens to the sugars." },

    { s:{t:0.34,arrows:1,axis:0}, nu:"H&#8212;O&#8212;H", lg:"O", e1:"O", e2:"O&#8315;",
      cap:"1 &nbsp;Water comes in along the axis",
      sub:"it has to approach from directly opposite the bond that will break",
      who:"the curved arrow is a pair of electrons moving, nothing else",
      note:"Water attacks. Notice where it comes from: directly opposite the bond that is going to break, a hundred and eighty degrees away. It is not arbitrary. The nucleophile has to come in on that axis, because the electrons it donates go into the orbital that lies along the bond it is displacing. That is what in-line attack means, and it is the reason the geometry is about to change shape rather than just swap one oxygen for another. The curved arrow is doing one job: it shows a pair of electrons moving from the water's oxygen to the phosphorus.",
      desc:"A water molecule approaches the phosphorus along the axis directly opposite the leaving oxygen, with a curved red arrow showing its electron pair moving toward the phosphorus." },

    { s:{t:0.5,arrows:1,axis:1}, nu:"H&#8212;O&#8212;H", lg:"O", e1:"O", e2:"O&#8315;",
      cap:"2 &nbsp;Pentacoordinate &mdash; five things on one phosphorus",
      sub:"attacking and leaving groups <tspan font-weight=\"700\">axial</tspan>; the other three splay into the <tspan font-weight=\"700\">equator</tspan>",
      who:"the highest point of the reaction &mdash; it is not a resting place",
      note:"And here is the part worth stopping on. For a moment the phosphorus has five things attached to it, not four. This is the pentacoordinate species, a trigonal bipyramid: the incoming water and the departing oxygen sit on the axis, a hundred and eighty degrees apart, and the other three oxygens have splayed out into a plane around the equator. Look at what the three equatorial oxygens just did — they were tilted up, and they have flattened. This is the top of the energy hill, not a stable compound, and everything an enzyme does to speed this reaction up is really about stabilising this arrangement: positioning the nucleophile on the right axis, and putting a magnesium or a positive side chain where the extra negative charge builds up.",
      desc:"The pentacoordinate trigonal bipyramid: five oxygens on one phosphorus, the incoming water and the leaving oxygen axial and opposite each other, the remaining three splayed into the equatorial plane." },

    { s:{t:1,arrows:1,axis:0}, nu:"O&#8212;H", lg:"H&#8212;O", e1:"O", e2:"O&#8315;",
      cap:"3 &nbsp;The leaving group goes &mdash; and the centre turns inside out",
      sub:"tetrahedral again, but inverted &mdash; the phosphate now sits on the water",
      who:"hydrolysis &nbsp;&middot;&nbsp; the bond is <tspan font-weight=\"700\">destroyed</tspan> &nbsp;&middot;&nbsp; nucleases, phosphatases",
      note:"The leaving oxygen takes the bonding pair with it, the five drops back to four, and watch the three equatorial oxygens: they keep going. They were tilted up at the start, they flattened at the intermediate, and now they have tipped the other way. The centre has turned inside out, like an umbrella in the wind. That inversion is the fingerprint of in-line attack, and it is how this mechanism was proven — run the reaction on a phosphorus you can tell the handedness of, and the product comes out the other hand. What is left: the phosphate is now attached to what used to be water. Nothing is joined to anything. The bond is destroyed, and that is hydrolysis, which is every nuclease and every phosphatase in this lecture.",
      desc:"The leaving oxygen has departed and the phosphorus is tetrahedral again, but inverted: the three equatorial oxygens have flipped through the plane to the opposite side. The phosphate now sits on the oxygen that arrived as water." },

    { s:{t:1,arrows:1,axis:0}, nu:"O&#8212;C", lg:"H&#8212;O", e1:"O", e2:"O&#8315;",
      cap:"Now run it again with an alcohol",
      sub:"identical geometry, identical arrows &mdash; a different <tspan font-weight=\"700\">nucleophile</tspan>",
      who:"transphosphorylation &nbsp;&middot;&nbsp; the bond is <tspan font-weight=\"700\">moved</tspan> &nbsp;&middot;&nbsp; kinases, polymerases, ligases, recombinases",
      note:"Same film, one substitution. Swap the water for an alcohol — a carbon carrying a hydroxyl — and every frame you just watched is identical. In-line approach, pentacoordinate intermediate, inversion. What changes is the product. The phosphate is not released into solution, it is handed to the thing that attacked, so the bond has moved rather than gone. That alcohol is a sugar's three prime hydroxyl in a polymerase or a ligase, a five prime hydroxyl in a kinase, a serine or a tyrosine on the protein itself in a recombinase. And do not let the similarity mislead you: water and an alcohol are different nucleophiles, and destroying a bond and relocating it are different outcomes. That difference is the reason this lecture is ordered the way it is.",
      desc:"The same reaction replayed with an alcohol as the nucleophile instead of water. The geometry and the curved arrows are unchanged; the difference is that the phosphate is transferred to the attacking alcohol rather than released." },

    { s:{t:1,arrows:0,axis:0}, nu:"H&#8212;O&#8212;H &nbsp;or&nbsp; C&#8212;O&#8212;H", lg:"O", e1:"O", e2:"O&#8315;",
      cap:"Same phosphorus. The only question is what attacks.",
      sub:"break it or move it &mdash; after that, only specificity differs",
      who:"which end &middot; which sequence &middot; which strand &middot; which state",
      note:"So that is the chemistry, and it does not change again today. One phosphorus, attacked in line, through a five-coordinate intermediate, with inversion. Two nucleophiles: water, and the bond is destroyed; an alcohol, and the bond is moved. Everything else in this lecture — and it is most of what you will actually learn — is the question of where each enzyme is allowed to do this. Which kind of end it recognises. Which sequence. Which strand. Whether the molecule is circular. Whether a base was methylated. Same reaction, entirely different rules about where it may happen.",
      desc:"Both nucleophile classes named against the same phosphorus, closing the argument: the chemistry is two mechanisms and everything remaining is specificity." }
  ];

  function go(i,animated){
    const to=S[i].s;
    if(raf){cancelAnimationFrame(raf);raf=null;}
    r.cap.innerHTML=S[i].cap; r.sub.innerHTML=S[i].sub; r.who.innerHTML=S[i].who;
    r.tnu.innerHTML=S[i].nu; r.tlg.innerHTML=S[i].lg;
    r.te1.innerHTML=S[i].e1; r.te2.innerHTML=S[i].e2;
    if(!cur||animated===false||reduce.matches){cur=Object.assign({},to);paint(cur);return;}
    const from=Object.assign({},cur), t0=performance.now();
    /* the reaction coordinate is the point, so give it room to be watched */
    const dur=Math.abs(to.t-from.t)>0.3?1150:720;
    const ease=t=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    raf=requestAnimationFrame(function f(now){
      const p=Math.min(1,(now-t0)/dur), e=ease(p);
      const s={t:lerp(from.t,to.t,e),arrows:lerp(from.arrows,to.arrows,e),
               axis:lerp(from.axis,to.axis,e)};
      paint(s); cur=s;
      if(p<1) raf=requestAnimationFrame(f); else raf=null;
    });
  }
  go(0,false);
  return { steps:S.map(x=>({note:x.note,desc:x.desc})), go:go };
});
})();
