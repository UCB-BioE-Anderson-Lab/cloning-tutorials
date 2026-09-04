/* ------------------------------------------------------------------ *
 * op-phosphatase.js — what an alkaline phosphatase actually reads.
 *
 * The bullet this replaces said "any exposed phosphate: 5' ends of RNA
 * or DNA, dNTPs and NTPs, small molecules like pNPP". That is a list to
 * be believed. This is the same claim as a picture you can check:
 * four completely unrelated molecules, blue, each carrying a TERMINAL
 * phosphate in red, and every red phosphate leaves.
 *
 * The fifth is the control that makes the point sharp. It is a
 * phosphate too, and the same red, but it sits between two sugars in a
 * backbone rather than on an end — and it stays. A phosphomonoester is
 * the substrate; a phosphodiester in a chain is not.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const BLUE="#004373", RED=window.DNAModel.HOT, MUT="#767676", INK="#111111";
const n2=v=>Math.round(v*10)/10;
/* Three removals, not one. A phosphatase takes a TERMINAL phosphate, so on a
   triphosphate it takes gamma, then beta, then alpha — each one only becomes
   terminal once the one outside it has gone. Pulling all three at once would
   be a different enzyme. */
const T_HOLD=0.9, T_GO=0.62, T_END=1.15;
const CYCLE=T_HOLD+3*T_GO+T_END;
const ease=t=>1-Math.pow(1-t,3);

const line=(a,b,c,w)=>'<path d="M'+n2(a[0])+' '+n2(a[1])+'L'+n2(b[0])+' '+n2(b[1])+
  '" fill="none" stroke="'+c+'" stroke-width="'+(w||4)+'" stroke-linecap="round"/>';
/* a phosphate, drawn the same way everywhere so it is recognisable as one thing */
function P(x,y,gone){
  const o=(1-gone*0.9).toFixed(2);
  return '<g opacity="'+o+'" transform="translate('+n2(x)+' '+n2(y-gone*74)+')">'+
    '<circle r="17" fill="#fff" stroke="'+RED+'" stroke-width="3.4"/>'+
    '<text y="8" text-anchor="middle" font-size="23" font-weight="700" fill="'+RED+'">P</text></g>';
}
function barb(x,y,dir){
  return line([x,y],[x-dir*20,y-13],BLUE,4);
}
function label(x,y,t,c,sz){
  return '<text x="'+n2(x)+'" y="'+n2(y)+'" text-anchor="middle" font-size="'+(sz||23)+
    '" font-weight="700" fill="'+(c||INK)+'">'+t+'</text>';
}

/* ---- the four substrates, each a terminal phosphate on something different -- */
function dna(x,y,g){
  return line([x-52,y],[x+92,y],BLUE)+barb(x+92,y,1)+
         line([x-52,y],[x-74,y],BLUE)+P(x-92,y,g)+label(x+14,478,"DNA 5&#8242; end",MUT,21);
}
/* a plain alkyl phosphate: no sugar, no base, no nucleic acid at all —
   which is the point of including it */
function alkyl(x,y,g){
  const pts=[[x-46,y],[x-22,y-16],[x+2,y],[x+26,y-16],[x+50,y]];
  let d="";
  for(let k=0;k<pts.length-1;k++) d+=line(pts[k],pts[k+1],BLUE);
  d+=line(pts[0],[x-68,y-14],BLUE)+P(x-88,y-22,g);
  return d+label(x+2,478,"alkyl phosphate",MUT,21);
}
function ntp(x,y,gg,gb,ga){
  /* sugar as a small pentagon, base as a slab, three phosphates on the 5' side */
  const r=22, v=[90,162,234,306,18].map(d=>[x+40+r*Math.cos(d*Math.PI/180),
                                            y-r*Math.sin(d*Math.PI/180)]);
  let s='<path d="M'+v.map(p=>n2(p[0])+" "+n2(p[1])).join("L")+'Z" fill="none" stroke="'+
        BLUE+'" stroke-width="4"/>';
  s+=line(v[0],[x+40,y-46],BLUE)+'<rect x="'+(x+22)+'" y="'+(y-72)+'" width="36" height="26" '+
     'rx="6" fill="none" stroke="'+BLUE+'" stroke-width="4"/>';
  /* alpha sits against the sugar, gamma furthest out; gamma is the one that
     is terminal to begin with, so it is the one that goes first */
  s+='<g opacity="'+(1-ga*0.9).toFixed(2)+'">'+line(v[2],[x-16,y+14],BLUE)+'</g>';
  s+=P(x-30,y+14,ga)+P(x-74,y+14,gb)+P(x-118,y+14,gg);
  return s+label(x-24,478,"dNTP",MUT,21);
}
function pnpp(x,y,g){
  const r=26, v=[90,150,210,270,330,30].map(d=>[x+22+r*Math.cos(d*Math.PI/180),
                                                y-r*Math.sin(d*Math.PI/180)]);
  let s='<path d="M'+v.map(p=>n2(p[0])+" "+n2(p[1])).join("L")+'Z" fill="none" stroke="'+
        BLUE+'" stroke-width="4"/>';
  s+=line(v[0],[x+22,y-52],BLUE)+P(x+22,y-74,g);
  s+=line(v[3],[x+22,y+52],BLUE)+
     '<text x="'+(x+22)+'" y="'+(y+76)+'" text-anchor="middle" font-size="20" fill="'+BLUE+
     '">NO&#8322;</text>';
  return s+label(x+22,478,"pNPP",MUT,21);
}
/* ---- and the one that is not a substrate ---- */
function internal(x,y){
  const s=line([x-150,y],[x+150,y],BLUE)+barb(x+150,y,1)+
          line([x-150,y+40],[x+150,y+40],BLUE)+barb(x-150,y+40,-1)+
          P(x,y,0);
  return s+label(x,y+96,"phosphate <tspan font-style=\"italic\">inside</tspan> a backbone",MUT,21);
}

window.Deck.sequence("op-phosphatase", function(slide){
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  slide.appendChild(svg);
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  let raf=null;

  function paint(g,gb,ga){
    svg.innerHTML=
      '<text x="800" y="140" text-anchor="middle" font-size="44" font-weight="700" fill="'+INK+
        '">Alkaline Phosphatase</text>'+
      '<text x="800" y="188" text-anchor="middle" font-size="25" fill="'+MUT+
        '">the substrate is a phosphate ester, not a DNA</text>'+
      dna(250,340,g)+ alkyl(630,346,g)+ ntp(1010,340,g,gb,ga)+ pnpp(1340,330,g)+
      '<path d="M180 560H1420" stroke="'+MUT+'" stroke-width="1.6" stroke-dasharray="7 9"/>'+
      internal(800,660)+
      label(800,806,"an internal phosphate is a diester in a chain &mdash; not a substrate",RED,26);
  }
  function go(){
    if(raf){cancelAnimationFrame(raf);raf=null;}
    if(reduce.matches){ paint(1,1,1); return; }
    const t0=performance.now();
    raf=requestAnimationFrame(function f(now){
      if(!slide.classList.contains("on")){ raf=null; return; }
      let t=((now-t0)/1000)%CYCLE;
      const step=k=>{ const u=(t-T_HOLD-k*T_GO)/T_GO;
                      return u<=0?0:(u>=1?1:ease(u)); };
      if(t<T_HOLD) paint(0,0,0);
      else if(t<T_HOLD+3*T_GO) paint(step(0),step(1),step(2));
      else paint(1,1,1);
      raf=requestAnimationFrame(f);
    });
  }
  go();
  return { steps:[{
    note:"Read the first line literally, because it is more useful than it looks. An alkaline phosphatase does not recognise DNA. What it recognises is a phosphate ester on the end of something, and it does not care in the slightest what the something is. Here are four completely unrelated molecules — the five prime end of a DNA, the five prime end of an RNA, a free dNTP with its three phosphates, and p-nitrophenyl phosphate, which is not a nucleic acid at all — and every terminal phosphate on all four comes off. That last one is why the same enzyme doubles as the colorimetric reporter in an ELISA: strip the phosphate off pNPP and what is left goes yellow. Now the one at the bottom, which is the important one. That is a phosphate too, and it is not touched, because it is sitting between two sugars in the middle of a backbone. A terminal phosphate is a monoester and it is the substrate; a phosphate in a chain is a diester and it is not. That single distinction is the whole specificity of the enzyme. And the consequence is why we bother: a five prime end with no phosphate on it cannot be ligated, and lambda exonuclease will not start on it either. Strip the phosphate and you have taken away both of those.",
    desc:"Four unrelated molecules drawn in blue, each carrying a terminal phosphate marked as a red circled P: the 5-prime end of a DNA, a simple alkyl phosphate, a dNTP with three phosphates, and p-nitrophenyl phosphate. On a loop every red phosphate detaches and drifts away. Below a dividing line, a fifth structure shows a phosphate in the middle of a double-stranded backbone; it keeps its phosphate, and a line reads: an internal phosphate is a diester in a chain, not a substrate."
  }], go:go };
});
})();
