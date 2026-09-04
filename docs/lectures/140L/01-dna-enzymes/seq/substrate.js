/* ------------------------------------------------------------------ *
 * substrate.js — what a piece of DNA can BE.
 *
 * One duplex, held on screen, walked through every axis an enzyme might
 * care about: the sequence itself, how long it is, whether the identity
 * of a position matters at all, what chemistry sits on the ends, and
 * what has been hung off a base. Each axis gets one word.
 *
 * This establishes the notation every enzyme section then uses, so the
 * "which bond" figure does not have to be repeated eight times.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const M=window.DNAModel;
const INK="#111111", MUT="#767676", HOT=M.HOT;
const BASES="ACGT";
const rnd = n => Array.from({length:n},()=>BASES[Math.floor(Math.random()*4)]).join("");
const centre = n => (1600 - (n-1)*M.PITCH)/2;

function roles(n, spec){                    /* spec(i) -> {bb, base} */
  return Array.from({length:n}, (_,i)=>spec(i));
}
const allOn = n => roles(n, ()=>({bb:"on",base:"on"}));

window.Deck.sequence("substrate", function(slide){
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  slide.appendChild(svg);
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  let raf=null, timer=null;

  const BLUE="#004373";
  /* a soft blue field behind one moiety, and its name on a leader */
  function spot(p,rx,ry){
    return '<ellipse cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" rx="'+rx+'" ry="'+ry+
           '" fill="'+BLUE+'" opacity="0.15"/>';
  }
  function tag(tx,ty,ax,ay,text,align){
    return '<path d="M'+tx+' '+ty+'L'+ax.toFixed(1)+' '+ay.toFixed(1)+'" stroke="'+BLUE+
           '" stroke-width="1.7" fill="none" opacity="0.75"/>'+
           '<text x="'+tx+'" y="'+ty+'" text-anchor="'+(align||"middle")+'" font-size="23" '+
           'font-weight="600" fill="'+BLUE+'">'+text+'</text>';
  }

  function render(m, word, sub, deco){
    const x0=centre(m.n);
    const mol=M.draw(m, x0);            /* draws, and reports where things landed */
    const d = deco ? deco(M.anchors) : {};
    svg.innerHTML =
      '<text x="800" y="150" text-anchor="middle" font-size="46" font-weight="700" '+
        'fill="'+INK+'">'+word+'</text>'+
      '<text x="800" y="198" text-anchor="middle" font-size="26" fill="'+MUT+'">'+sub+'</text>'+
      (d.under||"") + mol + (d.over||"");
  }

  /* Four axes, in the order they build on each other. */
  const GAATTC = extra => M.make(Object.assign({top:"GAATTC"}, extra||{}));

  const S=[
    /* 1. the object itself, with each distinct moiety named once */
    { word:"the substrate", sub:"one molecule &mdash; and every part of it has a name",
      model:()=>GAATTC(),
      deco:function(a){
        const rib=a.sugar.bot[1], ph=a.phos.bot[2], base=a.base.top[0],
              o5=a.term.top5, o3=a.term.top3;
        return {
          under: spot(rib,50,46)+spot(ph,34,58)+spot(base,72,56)+spot(o5,32,26)+spot(o3,32,26),
          over:  tag(o5[0], o5[1]-58, o5[0], o5[1]-30, "5&#8242; hydroxyl")+
                 tag(o3[0], o3[1]-72, o3[0], o3[1]-30, "3&#8242; hydroxyl")+
                 tag(rib[0], 812, rib[0], rib[1]+50, "ribose")+
                 tag(ph[0], 812, ph[0], ph[1]+62, "phosphate")+
                 tag(base[0]-128, base[1]-54, base[0]-62, base[1]-20, "nucleotide base")
        };
      },
      note:"Before any enzyme, the thing they all act on. Two strands, antiparallel, every base paired. And it is worth naming the parts once, carefully, because every enzyme in this lecture is defined by which of these it touches. A ribose — a sugar, and note there is no hydroxyl at the two prime position, which is what makes it deoxyribose. A phosphate joining one sugar to the next. A free hydroxyl at each end, one on a three prime carbon and one on a five prime carbon, and those two are not interchangeable. And hanging off every sugar, a base. Four things. Everything for the rest of today is one enzyme choosing among them.",
      desc:"A GAATTC duplex drawn as full chemical structure, with five parts highlighted and named: the ribose sugar, a backbone phosphate, the 5-prime hydroxyl, the 3-prime hydroxyl, and a nucleotide base." },

    /* 2. which positions the enzyme actually reads */
    { word:"degeneracy", sub:"red is required &mdash; grey could be anything",
      cycleModel:true,
      model:()=>{
        const n=7, top="GA"+rnd(4)+"C", key=i=>(i<2||i===6);
        /* every sugar and phosphate is required: the enzyme needs the DNA to be
           there and continuous. Only the identity of four bases is free. */
        const r=i=>({bb:"hot", base:key(i)?"hot":"bg"});
        return M.make({top, ends:{t5:"phos",b5:"phos"},
          roleTop:roles(n,r), roleBot:roles(n,r)});
      },
      note:"Now the second thing an enzyme can care about: which positions it actually reads. Red is required, grey is free. Here it needs a G and an A at the start and a C at the end, and the four in between can be anything — watch them keep changing. Every one of those is a real base; there is no such thing as an N in a tube. And notice the whole backbone is red, every sugar and every phosphate, because the enzyme does require the DNA to be there and to be continuous. For today take that as given for all of them. What is free is the identity of those four bases, and nothing else.",
      desc:"The same duplex with the backbone and three base positions in red, and four base positions in grey which cycle slowly through different bases to show their identity is unconstrained." },

    /* 3. the chemistry on the ends, which the letters do not show */
    { word:"the ends", sub:"a 5&#8242; phosphate, or a bare hydroxyl &mdash; four different molecules",
      frames:[ ()=>GAATTC({ends:{t5:"oh",  b5:"oh"}}),
               ()=>GAATTC({ends:{t5:"phos",b5:"oh"}}),
               ()=>GAATTC({ends:{t5:"oh",  b5:"phos"}}),
               ()=>GAATTC({ends:{t5:"phos",b5:"phos"}}) ],
      model:()=>GAATTC({ends:{t5:"phos",b5:"phos"}}),
      note:"Third axis, and it is the one students most often forget exists, because it is invisible if you only write the letters. Every one of these is GAATTC. What changes is whether each five prime end carries a phosphate or a bare hydroxyl, and the two strands are independent, so there are four different molecules here. That single difference decides whether a ligase can act, whether an exonuclease will start, and whether your PCR product will clone. Same sequence, four different substrates.",
      desc:"The same GAATTC duplex cycling through all four combinations of 5-prime phosphate and 5-prime hydroxyl on its two strands." },

    /* 4. what can be hung off a base */
    { word:"methylation", sub:"on the adenines and the cytosines &mdash; still GAATTC",
      model:()=>GAATTC({mods:[{strand:"top",i:1,type:"methyl"},
                              {strand:"top",i:2,type:"methyl"},
                              {strand:"top",i:5,type:"methyl"},
                              {strand:"bot",i:0,type:"methyl"},
                              {strand:"bot",i:3,type:"methyl"},
                              {strand:"bot",i:4,type:"methyl"}]}),
      note:"Fourth and last. A methyl group can be hung off a base after the DNA was made, and in bacteria that is exactly what happens. It goes on adenines and on cytosines — those are the two that get methylated, and you can see them marked here on both strands. The sequence has not changed at all; this is still GAATTC, and it will still read as GAATTC on any gel or any sequencer. But a restriction enzyme will refuse to cut it. That is the whole basis of restriction and modification, and it is why DNA from one strain sometimes will not cut with an enzyme that works perfectly on DNA from another.",
      desc:"The GAATTC duplex with methyl groups marked in red on every adenine and cytosine on both strands, the sequence otherwise unchanged." }
  ];

  let cur=0;
  function go(i,animated){
    if(raf){cancelAnimationFrame(raf);raf=null;}
    if(timer){clearTimeout(timer);timer=null;}
    const st=S[i];
    const show=m=>render(m, st.word, st.sub, st.deco);
    if(animated===false || reduce.matches){
      show(st.model());
    } else if(st.cycleModel){
      /* keep turning over the free positions for as long as the slide is up */
      const roll=function(){ show(st.model()); timer=setTimeout(roll,1600); };
      roll();
    } else if(st.frames){
      /* walk the combinations in order, so every one is actually seen */
      let k=0;
      const roll=function(){ show(st.frames[k % st.frames.length]());
                             k++; timer=setTimeout(roll,1900); };
      roll();
    } else {
      show(st.model());
    }
    cur=i;
  }
  go(0,false);
  return { steps:S.map(x=>({note:x.note,desc:x.desc})), go };
});
})();
