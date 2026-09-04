/* ------------------------------------------------------------------ *
 * operator.js — the reaction operator that opens an enzyme section.
 *
 * One picture per class, in place of repeating the circled-phosphate
 * diagram eight times. It says three things at once:
 *
 *   red     what the enzyme requires
 *   grey    what it does not care about
 *   motion  what it does to the molecule, on a loop
 *
 * The strands are broken ONE AT A TIME, because that is what happens: a
 * nuclease cuts one phosphodiester bond, then another. Holding the first
 * break on screen before the second also makes the staggered geometry
 * readable, which a single simultaneous snap does not.
 *
 * A break is drawn by splitting the duplex into two pieces that share
 * one column frame and differ only in which columns each STRAND
 * occupies. That is what allows an overhang: the left piece's lower
 * strand runs on past where its upper strand stopped, and the hydrogen
 * bonds simply stop being drawn where a partner no longer exists.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const M=window.DNAModel;
const INK="#111111", MUT="#767676";

const T=[0.95, 0.85, 0.85, 1.15, 1.10];   /* intact, nick, nick, drift, hold */
const CYCLE=T.reduce((a,b)=>a+b,0);
const ease=t=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;

window.Operator = function(name, spec){
  window.Deck.sequence(name, function(slide){
    const svg=document.createElementNS(NS,"svg");
    svg.setAttribute("viewBox","0 0 1600 900");
    svg.setAttribute("aria-hidden","true");
    svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
    slide.appendChild(svg);
    const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf=null;

    const n=spec.top.length;
    const cutT=spec.breaks.top, cutB=spec.breaks.bot;
    const role=i=>({bb:"hot", base:spec.keep(i)?"hot":"bg"});
    const roles=()=>Array.from({length:n},(_,i)=>role(i));

    /* one piece of the duplex: same frame, its own columns per strand */
    function piece(rt,rb,ends){
      return M.make({top:spec.top,
                     ends:Object.assign({t5:"oh",t3:"oh",b5:"oh",b3:"oh"},ends),
                     range:{top:rt, bot:rb},
                     roleTop:roles(), roleBot:roles()});
    }
    const X0=(1600-(n-1)*M.PITCH)/2;
    const GAP=70;    /* wider walks the outer terminal groups off the slide */

    /* stage 0 whole · 1 upper strand cut · 2 both cut */
    function pieces(stage){
      if(stage===0) return [[piece([0,n],[0,n],{}), 0]];
      if(stage===1) return [[piece([0,cutT+1],[0,n],{t3:"oh"}),      0],
                            [piece([cutT+1,n],[n,n],{t5:"phos"}),    0]];
      return           [[piece([0,cutT+1],[0,cutB+1],{t3:"oh",b5:"phos"}), -1],
                        [piece([cutT+1,n],[cutB+1,n],{t5:"phos",b3:"oh"}), +1]];
    }

    function paint(stage,gap){
      let body="";
      pieces(stage).forEach(function(q){
        body += M.draw(q[0], X0 + q[1]*gap/2);
      });
      svg.innerHTML =
        '<text x="800" y="140" text-anchor="middle" font-size="44" font-weight="700" fill="'+INK+
          '">'+spec.cap+'</text>'+
        '<text x="800" y="188" text-anchor="middle" font-size="25" fill="'+MUT+'">'+spec.sub+'</text>'+
        body+
        '<text x="800" y="852" text-anchor="middle" font-size="25" font-weight="700" fill="'+
          M.HOT+'">'+spec.foot+'</text>';
    }

    function go(){
      if(raf){cancelAnimationFrame(raf);raf=null;}
      if(reduce.matches){ paint(2,GAP); return; }
      const t0=performance.now();
      raf=requestAnimationFrame(function f(now){
        /* the deck leaves hidden slides in the DOM; do not burn frames on them */
        if(!slide.classList.contains("on")){ raf=null; return; }
        let t=((now-t0)/1000)%CYCLE;
        if(t<T[0])                          paint(0,0);
        else if((t-=T[0])<T[1])             paint(1,0);
        else if((t-=T[1])<T[2])             paint(2,0);
        else if((t-=T[2])<T[3])             paint(2,GAP*ease(t/T[3]));
        else                                paint(2,GAP);
        raf=requestAnimationFrame(f);
      });
    }
    go();
    return { steps:[{note:spec.note,desc:spec.desc}], go:go };
  });
};
})();
