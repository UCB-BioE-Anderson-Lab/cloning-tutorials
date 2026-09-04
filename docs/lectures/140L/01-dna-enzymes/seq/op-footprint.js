/* ------------------------------------------------------------------ *
 * op-footprint.js — why a non-specific nuclease is a measuring tool.
 *
 * The same picture as the DNase I figure before it, zoomed out: same
 * red barbed lines, same half barbs, just a longer molecule at a
 * smaller pitch so a whole binding site fits on screen.
 *
 * Two molecules, treated identically. The lower one has a protein sat
 * on it. Cuts land at random on both — drawn fresh every loop — except
 * that no cut can land under the protein, because the enzyme cannot
 * reach the backbone there. Everything else shatters; that stretch
 * survives whole. The long unbroken bar IS the footprint, and its
 * length is the measurement.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const RED=window.DNAModel.HOT, BLUE="#004373", MUT="#767676", INK="#111111";
const N=30, PS=40, HALF=PS/2;
const SX=(1600-(N-1)*PS)/2;
const AT=352, AB=396;                  /* the naked molecule    */
const BT=606, BB=650;                  /* the bound one         */
const P0=11, P1=19;                    /* columns under the protein */
const CUTS=11;
const T_HOLD=0.8, T_STEP=0.22, T_OPEN=1.0, T_SHOW=1.7;
const CYCLE=T_HOLD+CUTS*T_STEP+T_OPEN+T_SHOW;
const ease=t=>1-Math.pow(1-t,3);
const x=c=>SX+c*PS;

/* boundaries under the protein are simply unavailable to the enzyme */
function pick(shielded){
  const out=[], used={};
  let guard=0;
  while(out.length<CUTS && guard++<400){
    const s=Math.random()<0.5?"t":"b";
    const c=1+Math.floor(Math.random()*(N-3));
    if(shielded && c>=P0 && c<P1) continue;
    if(used[s+c]) continue;
    used[s+c]=1; out.push({s:s,c:c});
  }
  return out;
}
function segs(nicks){
  const out=[]; let lo=0;
  nicks.slice().sort((a,b)=>a-b).forEach(c=>{ out.push([lo,c]); lo=c+1; });
  out.push([lo,N-1]);
  return out;
}
function strand(y, nicks, up, open){
  let g="";
  segs(nicks).forEach(function(seg){
    const inL=seg[0]>0?open:0, inR=seg[1]<N-1?open:0;
    const a=x(seg[0])-HALF+inL, b=x(seg[1])+HALF-inR;
    g+='<path d="M'+a.toFixed(1)+' '+y+'L'+b.toFixed(1)+' '+y+
       '" stroke="'+RED+'" stroke-width="7" stroke-linecap="butt"/>';
    const tip=up?b:a;
    g+='<path d="M'+tip.toFixed(1)+' '+y+'L'+(tip+(up?-18:18)).toFixed(1)+' '+
       (y+(up?-12:12))+'" stroke="'+RED+'" stroke-width="7" fill="none" '+
       'stroke-linecap="round"/>';
  });
  return g;
}

window.Deck.sequence("op-footprint", function(slide){
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  slide.appendChild(svg);
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  let raf=null, free=pick(false), bound=pick(true), curId=-1;

  function rowLabel(y,t){
    return '<text x="'+(SX-HALF)+'" y="'+y+'" font-size="25" font-weight="700" fill="'+INK+
           '">'+t+'</text>';
  }
  function paint(shown, open, tell){
    const fT=[],fB=[],bT=[],bB=[];
    free .slice(0,shown).forEach(p=>(p.s==="t"?fT:fB).push(p.c));
    bound.slice(0,shown).forEach(p=>(p.s==="t"?bT:bB).push(p.c));
    const px0=x(P0)-HALF, pw=(P1-P0)*PS;
    svg.innerHTML=
      '<text x="800" y="150" text-anchor="middle" font-size="42" font-weight="700" fill="'+INK+
        '">Footprinting</text>'+
      '<text x="800" y="196" text-anchor="middle" font-size="25" fill="'+MUT+
        '">cut everything, and see what did not get cut</text>'+
      rowLabel(AT-52,"no protein")+
      strand(AT,fT,true,open)+strand(AB,fB,false,open)+
      /* the protein is drawn first so the DNA sits on top of it */
      '<rect x="'+px0.toFixed(1)+'" y="'+(BT-46)+'" width="'+pw+'" height="'+(BB-BT+92)+
        '" rx="30" fill="'+BLUE+'" fill-opacity=".13" stroke="'+BLUE+'" stroke-width="2.6"/>'+
      '<text x="'+(px0+pw/2).toFixed(1)+'" y="'+(BT-62)+'" text-anchor="middle" font-size="24" '+
        'font-weight="700" fill="'+BLUE+'">protein</text>'+
      rowLabel(BT-98,"protein bound")+
      strand(BT,bT,true,open)+strand(BB,bB,false,open)+
      (tell
        ? '<path d="M'+px0.toFixed(1)+' '+(BB+78)+'H'+(px0+pw).toFixed(1)+
            '" stroke="'+BLUE+'" stroke-width="3.4" fill="none"/>'+
          '<text x="'+(px0+pw/2).toFixed(1)+'" y="'+(BB+112)+'" text-anchor="middle" '+
            'font-size="25" font-weight="700" fill="'+BLUE+'">intact &mdash; the footprint</text>'
        : "");
  }
  function go(){
    if(raf){cancelAnimationFrame(raf);raf=null;}
    if(reduce.matches){ paint(CUTS,10,true); return; }
    const t0=performance.now();
    raf=requestAnimationFrame(function f(now){
      if(!slide.classList.contains("on")){ raf=null; return; }
      const el=(now-t0)/1000, id=Math.floor(el/CYCLE);
      if(id!==curId){ curId=id; free=pick(false); bound=pick(true); }
      let t=el%CYCLE;
      if(t<T_HOLD)                     paint(0,0,false);
      else if((t-=T_HOLD)<CUTS*T_STEP) paint(Math.floor(t/T_STEP)+1,0,false);
      else if((t-=CUTS*T_STEP)<T_OPEN) paint(CUTS,10*ease(t/T_OPEN),false);
      else                             paint(CUTS,10,true);
      raf=requestAnimationFrame(f);
    });
  }
  go();
  return { steps:[{
    note:"Here is what that last slide is actually good for, and it is a nice piece of thinking. Same enzyme, same picture as before, just zoomed out so a whole binding site fits. Two identical DNAs. The lower one has a protein sitting on part of it. Now treat them the same: add a trace of DNase I, and let it cut at random. The top molecule shatters, exactly as it did on the previous slide — cuts anywhere, no pattern. The bottom one shatters too, everywhere except one stretch. Not because the enzyme dislikes that sequence, it has no opinion about sequence at all, but because it physically cannot reach the backbone underneath a bound protein. So every fragment comes out short except one, and that one survives whole. Its length tells you how much DNA the protein covers, and where it starts and stops tells you where the protein sits. That is footprinting: you find a protein's binding site by destroying everything that is not it.",
    desc:"Two DNA molecules drawn as red barbed lines, one above the other, the same style as the previous figure but zoomed out over thirty base pairs. The lower one has a blue rounded box labelled protein sitting over eight of its base pairs. On a loop, cuts appear at random positions on both molecules, different every time, and the fragments pull apart into short pieces — except that no cut ever lands under the protein, so that stretch of the lower molecule survives as one long unbroken piece. A blue rule beneath it is labelled: intact, the footprint."
  }], go:go };
});
})();
