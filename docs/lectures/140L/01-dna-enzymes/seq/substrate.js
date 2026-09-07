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

  const MONO='ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';
  const GREY="#767676";
  /* The written sequence, set directly under the bases it stands for. Half the
     point of these slides is what the letters CANNOT tell you, so the string
     has to be visibly the same while the molecule underneath changes. */
  function strip(a, code, colFn, concrete){
    const y=a.sugar.bot[0][1]+200;
    let g="";
    for(let i=0;i<code.length;i++)
      g+='<text x="'+a.sugar.top[i][0].toFixed(1)+'" y="'+y+'" text-anchor="middle" '+
         'font-size="46" font-weight="700" font-family="'+MONO+'" fill="'+
         (colFn?colFn(i):INK)+'">'+code[i]+'</text>';
    if(concrete)
      for(let i=0;i<concrete.length;i++)
        g+='<text x="'+a.sugar.top[i][0].toFixed(1)+'" y="'+(y+50)+'" text-anchor="middle" '+
           'font-size="38" font-family="'+MONO+'" fill="'+GREY+'">'+concrete[i]+'</text>';
    return g;
  }

  /* the marks, named where they sit: above the string for the top strand,
     below it for the bottom, so the notation maps onto the drawing */
  const MLAB={"6":"6mA","5":"5mC","4":"4mC"};
  function markStrip(a,m){
    const y=a.sugar.bot[0][1]+200;
    let g="";
    (m.mods||[]).forEach(function(mo){
      if(mo.type!=="methyl") return;
      const x=a.sugar.top[mo.i][0], c = mo.site==="6" ? M.HOT : BLUE;
      g+='<text x="'+x.toFixed(1)+'" y="'+(mo.strand==="top"?y-48:y+46)+'" '+
         'text-anchor="middle" font-size="29" font-weight="700" font-family="'+MONO+'" fill="'+
         c+'">'+MLAB[mo.site]+'</text>';
    });
    return g;
  }

  function render(m, word, sub, deco){
    const x0=centre(m.n);
    const mol=M.draw(m, x0);            /* draws, and reports where things landed */
    const d = deco ? deco(M.anchors, m) : {};
    svg.innerHTML =
      '<text x="800" y="150" text-anchor="middle" font-size="46" font-weight="700" '+
        'fill="'+INK+'">'+word+'</text>'+
      '<text x="800" y="198" text-anchor="middle" font-size="26" fill="'+MUT+'">'+sub+'</text>'+
      (d.under||"") + mol + (d.over||"") + (d.strip||"");
  }

  /* Four axes, in the order they build on each other. */
  const GAATTC = extra => M.make(Object.assign({top:"GAATTC"}, extra||{}));

  const S=[
    /* 1. the object itself, with each distinct moiety named once */
    { word:"the substrate", sub:"one molecule, and every part of it has a name",
      model:()=>GAATTC(),
      code:"GAATTC",
      deco:function(a){
        const rib=a.sugar.bot[1], ph=a.phos.bot[2], base=a.base.top[0],
              o5=a.term.top5, o3=a.term.top3;
        return {
          under: spot(rib,50,46)+spot(ph,34,58)+spot(base,72,56)+spot(o5,32,26)+spot(o3,32,26),
          over:  tag(o5[0], o5[1]-58, o5[0], o5[1]-30, "5&#8242; hydroxyl")+
                 tag(o3[0], o3[1]-72, o3[0], o3[1]-30, "3&#8242; hydroxyl")+
                 tag(rib[0], 734, rib[0], rib[1]+44, "ribose")+
                 tag(ph[0], 734, ph[0], ph[1]+46, "phosphate")+
                 tag(base[0]-128, base[1]-54, base[0]-62, base[1]-20, "nucleotide base")
        };
      },
      note:"Now the substrate, because an enzyme can be picky in four separate ways and we will take them one at a time. The first is the simplest: which part of the molecule it touches at all. Two strands, antiparallel, every base paired. Name the parts once, carefully, because there are only five places where chemistry ever happens, and every enzyme in the lecture is defined by which of them it touches. The sugar: no hydroxyl at the two prime position, which is what makes it deoxyribose. The phosphate joining one sugar to the next. The base hanging off each sugar. And the two everyone mixes up: the free hydroxyl at the five prime end and the free hydroxyl at the three prime end. Those are not interchangeable, and you will be telling them apart all day. Here is how I do it, and it works on every drawing in this deck. At the five prime end the oxygen is not on the ring. There is a carbon in between, so the bond takes a little elbow on its way out. The three prime hydroxyl has no elbow; its oxygen sits straight on the ring. Elbow, five prime. No elbow, three prime. Five things, and everything today is one enzyme choosing among them.",
      desc:"A GAATTC duplex drawn as full chemical structure, with five parts highlighted and named: the ribose sugar, a backbone phosphate, the 5-prime hydroxyl, the 3-prime hydroxyl, and a nucleotide base." },

    /* 2. which positions the enzyme actually reads */
    { word:"degeneracy", sub:"red is required; grey could be anything",
      cycleModel:true,
      code:"GANNTC", concrete:true,
      codeCol:i=>(i<2||i>=4)?M.HOT:GREY,
      /* the SAME six-mer as the slide before, with two positions freed, so the
         written site lines up letter for letter against GAATTC */
      model:()=>{
        const n=6, top="GA"+rnd(2)+"TC", key=i=>(i<2||i>=4);
        /* every sugar and phosphate is required: the enzyme needs the DNA to be
           there and continuous. Only the identity of two bases is free. */
        const r=i=>({bb:"hot", base:key(i)?"hot":"bg"});
        return M.make({top, ends:{t5:"phos",b5:"phos"},
          roleTop:roles(n,r), roleBot:roles(n,r)});
      },
      note:"Second: which positions it actually reads. Red is required, grey is free. The same six bases as a moment ago, but read it as a pattern rather than a sequence: G, A, anything, anything, T, C. The enzyme needs G-A at the start and T-C at the end; the two in between can be whatever they like. Underneath you can see both: the site as you would write it, G-A-N-N-T-C, and below it whatever is actually there this second, changing as we watch. Every one of those is a real base. There is no such thing as an N in a tube. And notice the backbone is red throughout, every sugar and every phosphate, because the enzyme does require the DNA to be there and to be continuous. What is free is the identity of two bases, and nothing else.",
      desc:"The same six base pair duplex with the backbone and four base positions in red and two in grey, cycling through different bases. Below it the written site GANNTC, and under that the concrete sequence currently drawn." },

    /* 3. the chemistry on the ends, which the letters do not show */
    { word:"the ends", code:"GAATTC", sub:"a phosphate, a bare hydroxyl, a biotin, all of them still GAATTC",
      frames:[ ()=>GAATTC({endHot:1, ends:{t5:"oh",    b5:"oh"}}),
               ()=>GAATTC({endHot:1, ends:{t5:"phos",  b5:"oh"}}),
               ()=>GAATTC({endHot:1, ends:{t5:"oh",    b5:"phos"}}),
               ()=>GAATTC({endHot:1, ends:{t5:"phos",  b5:"phos"}}),
               ()=>GAATTC({endHot:1, ends:{t5:"phos",  b5:"biotin"}}),
               ()=>GAATTC({endHot:1, ends:{t5:"biotin",b5:"phos"}}) ],
      model:()=>GAATTC({endHot:1, ends:{t5:"phos",b5:"phos"}}),
      note:"Third, and the one students forget exists, because it is invisible if you only write the letters. It applies to linear DNA only: a circle has no ends, so it has no end chemistry, and that alone decides what a good many enzymes will do to it. On a linear molecule every one of these is GAATTC, and what changes is what sits on each five prime end, in red, with the two strands independent of one another. A bare hydroxyl, or a phosphate. Worth carrying out of here as a rule of thumb: a free hydroxyl is rare in biology but it is exactly how a synthesised oligo arrives, because that is what comes off the synthesiser, whereas a phosphate is what you find once an enzyme has been at it. End chemistry is a record of where that DNA has been. And it decides whether a ligase can act, whether an exonuclease will start, and whether your PCR product will clone. It does not stop at those two: the five prime end of a synthetic oligo is built chemically, so you can hang almost anything off it. The last ones here carry a biotin through a linker, how you would pull one strand out on streptavidin beads, and dyes go on the same way. We will meet some of that later in the course. Notice biotin never touches the DNA itself. Same sequence every time, and every one a different molecule.",
      desc:"The same GAATTC duplex cycling through six different sets of 5-prime ends, marked in red: all four combinations of phosphate and hydroxyl, then a biotin attached through a linker to the 5-prime phosphate of one strand and then the other." },

    /* 4. what can be hung off a base */
    { word:"methylation", code:"GAATTC", cycleModel:true, marks:true,
      sub:"three different marks, and the sequence is GAATTC through all of them",
      /* Adenine takes a methyl in one place, cytosine in two, and each site is
         independently marked or not. */
      model:()=>{
        const top="GAATTC", bot=M.comp(top), mods=[];
        [["top",top],["bot",bot]].forEach(function(q){
          for(let i=0;i<q[1].length;i++){
            const b=q[1][i];
            if(b==="A" && Math.random()<0.45)
              mods.push({strand:q[0], i:i, type:"methyl", site:"6"});
            if(b==="C" && Math.random()<0.6)
              mods.push({strand:q[0], i:i, type:"methyl",
                         site: Math.random()<0.5 ? "5" : "4"});
          }
        });
        return GAATTC({mods:mods});
      },
      note:"Fourth and last, and the one that is not phosphorus chemistry at all: a methyl transferred onto a base, rather than something moved on a phosphate. It goes on after the DNA was made, and in bacteria that is exactly what happens. Three marks are worth knowing and you are seeing all of them. Six-methyladenine, on the exocyclic nitrogen, in red. That one is everywhere in bacteria and archaea. Then two on cytosine, both in blue: five-methylcytosine on a ring carbon, the one you know from eukaryotes though bacteria and archaea make it too, and four-methylcytosine on the exocyclic nitrogen instead, essentially bacterial and archaeal. Watch them come and go. Each site is independently marked or not, which is the point. This is not a property of a sequence; it is something done to one particular molecule. The letters never change. Every one of these is GAATTC and will read as GAATTC on any gel or any sequencer, but a restriction enzyme will refuse to cut it. That is the whole basis of restriction and modification.",
      desc:"The GAATTC duplex with methyl marks appearing and disappearing independently: 6-methyladenine in red on the exocyclic nitrogen of each adenine, and on the cytosines either 5-methylcytosine on the ring carbon or 4-methylcytosine on the exocyclic nitrogen, in blue. The marks present are named above and below the written sequence, which stays GAATTC." }
  ];

  let cur=0;
  function go(i,animated){
    if(raf){cancelAnimationFrame(raf);raf=null;}
    if(timer){clearTimeout(timer);timer=null;}
    const st=S[i];
    const show=m=>render(m, st.word, st.sub, function(a,mm){
      const d = st.deco ? st.deco(a,mm) : {};
      if(st.code) d.strip = strip(a, st.code, st.codeCol, st.concrete?mm.top:null)
                          + (st.marks ? markStrip(a, mm) : "");
      return d;
    });
    if(animated===false || reduce.matches){
      show(st.model());
    } else if(st.cycleModel){
      /* keep turning over the free positions for as long as the slide is up */
      const roll=function(){ show(st.model()); timer=setTimeout(roll,600); };
      roll();
    } else if(st.frames){
      /* walk the combinations in order, so every one is actually seen */
      let k=0;
      const roll=function(){ show(st.frames[k % st.frames.length]());
                             k++; timer=setTimeout(roll,625); };
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
