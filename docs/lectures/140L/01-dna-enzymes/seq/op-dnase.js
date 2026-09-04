/* ------------------------------------------------------------------ *
 * op-dnase.js — DNase I, as the counterpart to the EcoRI operator.
 *
 * EcoRI's picture is mostly about WHERE: a red site, grey flanks, one
 * cut in one place. DNase I has no where. So this one is red end to
 * end — the enzyme does need DNA, and needs it to be DNA — and the
 * cuts land at positions drawn fresh every cycle, which is the only
 * honest way to draw "it does not read the sequence at all".
 *
 * Nicks accumulate one at a time rather than appearing together,
 * because that is what a potent non-specific nuclease does to a
 * molecule, and then the whole thing comes apart.
 *
 * Every fragment keeps a half barb at its 3' end, so the ends the
 * enzyme leaves stay visible right through the dissociation.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const RED=window.DNAModel.HOT, MUT="#767676", INK="#111111";
const N=18, PS=74, HALF=PS/2, TY=436, BY=496, GAPW=11;
const SX=(1600-(N-1)*PS)/2;
const NICKS=7;
const T_HOLD=0.75, T_STEP=0.38, T_GO=1.35, T_END=0.65;
const CYCLE=T_HOLD+NICKS*T_STEP+T_GO+T_END;
const ease=t=>1-Math.pow(1-t,3);

/* a fresh set of cut positions every time round: no site, no pattern */
function plan(){
  const picks=[], used={top:{},bot:{}};
  while(picks.length<NICKS){
    const s=Math.random()<0.5?"top":"bot";
    const c=1+Math.floor(Math.random()*(N-3));
    if(used[s][c]) continue;
    used[s][c]=1; picks.push({s:s,c:c});
  }
  const drift=[];
  for(let i=0;i<NICKS+3;i++)
    drift.push([(Math.random()*2-1)*120, (Math.random()*2-1)*104]);
  return {picks:picks, drift:drift};
}
function segs(nicks){
  const out=[]; let lo=0;
  nicks.slice().sort((a,b)=>a-b).forEach(function(c){ out.push([lo,c]); lo=c+1; });
  out.push([lo,N-1]);
  return out;
}
function strand(y, nicks, up, prog, drift){
  let g="";
  segs(nicks).forEach(function(seg,k){
    const d=drift[k%drift.length], dx=d[0]*prog, dy=d[1]*prog;
    const inL=seg[0]>0?GAPW:0, inR=seg[1]<N-1?GAPW:0;
    const a=SX+seg[0]*PS-HALF+inL+dx, b=SX+seg[1]*PS+HALF-inR+dx;
    const yy=y+dy, op=(1-prog*0.72).toFixed(2);
    g+='<path d="M'+a.toFixed(1)+' '+yy.toFixed(1)+'L'+b.toFixed(1)+' '+yy.toFixed(1)+
       '" stroke="'+RED+'" stroke-width="9" stroke-linecap="butt" opacity="'+op+'"/>';
    /* the 3' end of every fragment, upper strand rightward, lower leftward */
    const tip=up?b:a, back=up?-26:26;
    g+='<path d="M'+tip.toFixed(1)+' '+yy.toFixed(1)+'L'+(tip+back).toFixed(1)+' '+
       (yy+(up?-17:17)).toFixed(1)+'" stroke="'+RED+'" stroke-width="9" fill="none" '+
       'stroke-linecap="round" opacity="'+op+'"/>';
  });
  return g;
}

window.Deck.sequence("op-dnase", function(slide){
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  slide.appendChild(svg);
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  let raf=null, cur=null, curId=-1;

  function paint(shown, prog){
    const top=[], bot=[];
    cur.picks.slice(0,shown).forEach(p=>(p.s==="top"?top:bot).push(p.c));
    const lab=(x,y,t,anch)=>'<text x="'+x+'" y="'+(y+8)+'" text-anchor="'+anch+
      '" font-size="24" fill="'+MUT+'" opacity="'+(1-prog*3<0?0:1-prog*3).toFixed(2)+
      '">'+t+'</text>';
    svg.innerHTML=
      '<text x="800" y="140" text-anchor="middle" font-size="44" font-weight="700" fill="'+INK+
        '">DNase I</text>'+
      '<text x="800" y="188" text-anchor="middle" font-size="25" fill="'+MUT+
        '">it needs DNA &mdash; and reads nothing about it</text>'+
      strand(TY, top, true,  prog, cur.drift)+
      strand(BY, bot, false, prog, cur.drift.slice(1))+
      lab(SX-HALF-22, TY, "5&#8242;", "end")+ lab(SX+(N-1)*PS+HALF+22, TY, "3&#8242;", "start")+
      lab(SX-HALF-22, BY, "3&#8242;", "end")+ lab(SX+(N-1)*PS+HALF+22, BY, "5&#8242;", "start")+
      '<text x="800" y="700" text-anchor="middle" font-size="25" font-weight="700" fill="'+RED+
        '">no site, no pattern &mdash; every cut leaves a 5&#8242; phosphate and a 3&#8242; hydroxyl</text>';
  }

  function go(){
    if(raf){cancelAnimationFrame(raf);raf=null;}
    if(reduce.matches){ cur=plan(); paint(NICKS,0); return; }
    const t0=performance.now();
    raf=requestAnimationFrame(function f(now){
      if(!slide.classList.contains("on")){ raf=null; return; }
      const el=(now-t0)/1000, id=Math.floor(el/CYCLE);
      if(id!==curId){ curId=id; cur=plan(); }     /* new cuts every cycle */
      let t=el%CYCLE;
      if(t<T_HOLD)                       paint(0,0);
      else if((t-=T_HOLD)<NICKS*T_STEP)  paint(Math.floor(t/T_STEP)+1, 0);
      else if((t-=NICKS*T_STEP)<T_GO)    paint(NICKS, ease(t/T_GO));
      else                               paint(NICKS, 1);
      raf=requestAnimationFrame(f);
    });
  }
  cur=plan(); go();
  return { steps:[{
    note:"And here is the other end of the same class. EcoRI's picture was mostly about where — a red site, grey flanks, one cut in one place. DNase I has no where. It is red end to end, because it does need DNA and it needs it to be DNA rather than RNA, which is exactly why you use it to clean up an RNA prep. But it reads nothing about that DNA at all. Watch where the cuts land: they are drawn fresh every time this loops, and no two runs are the same, because that is the honest picture of an enzyme with no recognition sequence. Notice they come one at a time, and notice that with magnesium in the buffer most of them are nicks on one strand only. Swap in manganese and it prefers to cut both strands together and leave blunt ends. Either way it is very potent — most protocols use tiny amounts — and the ends it leaves are the same ends every enzyme in this section leaves: five prime phosphate, three prime hydroxyl, so the fragments are competent for ligation. That is what makes it useful for chopping a large DNA down to oligonucleotide length, which is the fragmentation step in DNA shuffling.",
    desc:"A DNA duplex drawn as two barbed lines, red along their whole length, with a half barb at each 3-prime end. On a loop, single-strand nicks appear one after another at positions that are different every time, until the molecule comes apart into fragments that drift away and fade. Each fragment keeps a half barb at its own 3-prime end."
  }], go:go };
});
})();
