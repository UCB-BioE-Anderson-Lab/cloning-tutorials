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
 * Every endonuclease requires the sugars and the phosphates — it needs
 * DNA, continuous and double stranded — so the whole backbone is red.
 * Whether it also requires particular BASES varies, so some bases are
 * red and some grey: that is the "may also be constrained" part.
 *
 * The cut is drawn by rendering two shorter duplexes instead of one and
 * letting the gap between them open, which is also why the new ends can
 * be honest: a 5' phosphate on one side, a 3' hydroxyl on the other.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const M=window.DNAModel;
const INK="#111111", MUT="#767676";

/* the loop, in seconds: hold intact, break and separate, hold apart */
const T_HOLD=1.0, T_MOVE=1.15, T_APART=1.25;
const CYCLE=T_HOLD+T_MOVE+T_APART;
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

    const n=spec.top.length, k=spec.cut;          /* cut after position k */
    const role=i=>({bb:"hot", base:spec.keep(i)?"hot":"bg"});
    const sub=(a,b,ends)=>M.make({top:spec.top.slice(a,b),
                                  ends:Object.assign({t5:"oh",t3:"oh",b5:"oh",b3:"oh"},ends),
                                  roleTop:Array.from({length:b-a},(_,j)=>role(a+j)),
                                  roleBot:Array.from({length:b-a},(_,j)=>role(a+j))});
    const whole=()=>M.make({top:spec.top, ends:{t5:"oh",t3:"oh",b5:"oh",b3:"oh"},
                            roleTop:Array.from({length:n},(_,i)=>role(i)),
                            roleBot:Array.from({length:n},(_,i)=>role(i))});
    /* the new ends a nuclease leaves: 5' phosphate, 3' hydroxyl */
    const left =()=>sub(0,k+1,{t3:"oh",  b5:"phos"});
    const right=()=>sub(k+1,n,{t5:"phos",b3:"oh"});

    const X0=(1600-(n-1)*M.PITCH)/2;
    const GAP=100;

    function paint(gap,broken){
      const head =
        '<text x="800" y="140" text-anchor="middle" font-size="44" font-weight="700" fill="'+INK+
          '">'+spec.cap+'</text>'+
        '<text x="800" y="188" text-anchor="middle" font-size="25" fill="'+MUT+'">'+spec.sub+'</text>';
      let body;
      if(!broken){
        body=M.draw(whole(), X0);
      }else{
        /* open the gap about the centre, so the halves move apart evenly
           instead of the right one walking off the slide */
        body=M.draw(left(),  X0-gap/2) +
             M.draw(right(), X0+(k+1)*M.PITCH+gap/2);
      }
      svg.innerHTML=head+body+
        '<text x="800" y="852" text-anchor="middle" font-size="25" font-weight="700" fill="'+
        M.HOT+'">'+spec.foot+'</text>';
    }

    function loop(t0){
      raf=requestAnimationFrame(function f(now){
        /* the deck leaves hidden slides in the DOM; do not burn frames on them */
        if(!slide.classList.contains("on")){ raf=null; return; }
        const t=((now-t0)/1000)%CYCLE;
        if(t<T_HOLD)                 paint(0,false);
        else if(t<T_HOLD+T_MOVE)     paint(GAP*ease((t-T_HOLD)/T_MOVE), true);
        else                         paint(GAP,true);
        raf=requestAnimationFrame(f);
      });
    }
    function go(){
      if(raf){cancelAnimationFrame(raf);raf=null;}
      if(reduce.matches){ paint(GAP,true); return; }
      loop(performance.now());
    }
    go();
    return { steps:[{note:spec.note,desc:spec.desc}], go:go };
  });
};
})();
