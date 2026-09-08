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

    /* stage 0 whole · 1 upper strand cut · 2 both cut.
       `side` is which way the piece drifts; `brk` is the end that was made by
       a break, which the stick view draws as a gap. */
    function pieces(stage){
      if(stage===0) return [{rt:[0,n], rb:[0,n], side:0, ends:{}}];
      if(stage===1) return [{rt:[0,cutT+1], rb:[0,n],   side:0, ends:{t3:"oh"},   brk:"R"},
                            {rt:[cutT+1,n], rb:[n,n],   side:0, ends:{t5:"phos"}, brk:"L"}];
      return           [{rt:[0,cutT+1], rb:[0,cutB+1], side:-1,
                         ends:{t3:"oh",b5:"phos"}, brk:"R"},
                        {rt:[cutT+1,n], rb:[cutB+1,n], side:+1,
                         ends:{t5:"phos",b3:"oh"}, brk:"L"}];
    }

    /* ---- the stick view: barbed lines, one level of abstraction up ------
       Compact enough to do what the all-atom view cannot: separate the two
       fragments FAR enough that the overhangs clear each other, which is the
       picture everyone actually draws at the bench. */
    /* the two strands sit close enough to read as one duplex; the stick view
       has room to be drawn large because it carries so little */
    const PS=120, TYS=462, BYS=512, HALF=PS/2, NICK=15;
    function stick(pcs,gap){
      const SX=(1600-(n-1)*PS)/2;
      /* clear of each other means past the whole stagger, not just a gap */
      const shift=(cutB-cutT)*PS+gap;
      let g="";
      pcs.forEach(function(p,idx){
        const dx = p.side===0 ? 0 : (p.side<0 ? -shift/2 : shift/2);
        const x=i=>SX+i*PS+dx;
        [["rt",TYS,true],["rb",BYS,false]].forEach(function(q){
          const r=p[q[0]], y=q[1], up=q[2];
          if(r[1]<=r[0]) return;
          const inL=(p.brk==="L")?NICK:0, inR=(p.brk==="R")?NICK:0;
          for(let i=r[0];i<r[1];i++){
            const a=x(i)-HALF+(i===r[0]?inL:0), b=x(i)+HALF-(i===r[1]-1?inR:0);
            g+='<path d="M'+a.toFixed(1)+' '+y+'L'+b.toFixed(1)+' '+y+
               '" stroke="'+(spec.keep(i)?M.HOT:"#767676")+'" stroke-width="9" '+
               'stroke-linecap="butt"/>';
          }
          /* the 3' end takes a HALF barb — never a full arrowhead. Upper
             strand runs 5'->3' rightward, lower strand the other way. */
          const tipR=x(r[1]-1)+HALF-inR, tipL=x(r[0])-HALF+inL;
          const c3=spec.keep(up?r[1]-1:r[0])?M.HOT:"#767676";
          if(up) g+='<path d="M'+tipR.toFixed(1)+' '+y+'L'+(tipR-26).toFixed(1)+' '+(y-17)+
                    '" stroke="'+c3+'" stroke-width="9" fill="none" stroke-linecap="round"/>';
          else   g+='<path d="M'+tipL.toFixed(1)+' '+y+'L'+(tipL+26).toFixed(1)+' '+(y+17)+
                    '" stroke="'+c3+'" stroke-width="9" fill="none" stroke-linecap="round"/>';
          const lab=(xx,t,anch)=>'<text x="'+xx.toFixed(1)+'" y="'+(y+8)+'" text-anchor="'+anch+
            '" font-size="24" fill="'+MUT+'">'+t+'</text>';
          if(!(p.brk==="L")) g+=lab(tipL-18, up?"5&#8242;":"3&#8242;","end");
          if(!(p.brk==="R")) g+=lab(tipR+18, up?"3&#8242;":"5&#8242;","start");
        });
      });
      return g;
    }

    function paint(stage,gap){
      const pcs=pieces(stage);
      let body="";
      if(spec.view==="stick"){
        body=stick(pcs,gap);
      }else{
        pcs.forEach(function(q){
          body += M.draw(piece(q.rt,q.rb,q.ends), X0 + q.side*gap/2);
        });
      }
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
