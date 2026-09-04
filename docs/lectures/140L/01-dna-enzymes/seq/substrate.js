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
  let raf=null;

  function render(m, word, sub){
    const x0=centre(m.n);
    svg.innerHTML =
      '<text x="800" y="150" text-anchor="middle" font-size="46" font-weight="700" '+
        'fill="'+INK+'">'+word+'</text>'+
      '<text x="800" y="198" text-anchor="middle" font-size="26" fill="'+MUT+'">'+sub+'</text>'+
      M.draw(m, x0);
  }

  /* the settled models each step lands on */
  const S=[
    { word:"a sequence", sub:"two strands, antiparallel, and every base paired",
      model:()=>M.make({top:"GAATTC", ends:{t5:"phos",b5:"phos"}}),
      note:"This is the object every enzyme in the lecture acts on, and it is worth being precise about what it is. Two strands, antiparallel. A backbone of sugars and phosphates. A base on every sugar, paired across. Everything an enzyme can care about is somewhere in this picture, so for the rest of the lecture we will draw the substrate this way and colour in only the part that matters to whichever enzyme we are discussing.",
      desc:"A DNA duplex drawn as full structures: sugars, phosphates and paired bases, five prime phosphates on both strands." },

    { word:"any sequence", sub:"and any length &mdash; most enzymes do not care",
      shuffle:true,
      model:()=>M.make({top:rnd(7), ends:{t5:"phos",b5:"phos"}}),
      note:"First axis: the sequence itself, and the length. Watch it change. Most of the enzymes we will meet do not read the sequence at all — an exonuclease chewing from an end does not know or care what the bases are. So when we draw a substrate in grey, that is what grey means: a real sequence, concrete enough to be a molecule, but arbitrary. Nothing about it is what the enzyme is recognising.",
      desc:"The sequence and the length shuffle rapidly and settle on a new random duplex, showing that neither is fixed." },

    { word:"degeneracy", sub:"black is required &mdash; grey is anything",
      model:()=>{
        const n=7, top="GANNNNC";
        return M.make({top, ends:{t5:"phos",b5:"phos"},
          roleTop:roles(n,i=>({bb:"on", base:(i<2||i===6)?"on":"bg"})),
          roleBot:roles(n,i=>({bb:"on", base:(i<2||i===6)?"on":"bg"}))});
      },
      note:"Second axis, and this is the notation that does the most work. When only part of a site matters, we colour that part black and leave the rest grey. Here the enzyme requires a G and an A at the start and a C at the end, and genuinely does not care about the four positions between. Notice the backbone stays black all the way across — the DNA is still required to be there, continuous and double stranded. It is only the identity of those bases that is free.",
      desc:"The same duplex with only three base positions in black and the rest greyed, while the backbone stays black throughout: a degenerate recognition site." },

    { word:"ends", sub:"a 5&#8242; phosphate, or a bare hydroxyl &mdash; different molecules",
      model:()=>M.make({top:"GAATTC", ends:{t5:"phos", b5:"oh"},
        roleTop:allOn(6), roleBot:allOn(6)}),
      note:"Third axis: the chemistry of the ends, which is not part of the sequence at all and is invisible if you only write the letters. A five prime end either carries a phosphate or it does not. That single difference decides whether a ligase can act, whether an exonuclease will start, and whether your PCR product will clone. Two molecules with identical sequence can be different substrates, and this is the axis students most often forget exists.",
      desc:"The same sequence with a five prime phosphate on the top strand and a bare hydroxyl on the bottom, showing that end chemistry is independent of sequence." },

    { word:"modification", sub:"a methyl on a base &mdash; still the same sequence",
      model:()=>M.make({top:"GAATTC", ends:{t5:"phos",b5:"phos"},
        mods:[{strand:"top", i:1, type:"methyl"}]}),
      note:"Fourth axis: what has been hung off a base. A methyl group does not change the sequence — read the letters and this is the same molecule as before. But a restriction enzyme may now refuse to cut it, and a different enzyme may cut only because it is there. That is an annotation layer sitting on top of the sequence, written by one enzyme and read by another, and it is why a plasmid from the wrong strain silently fails to digest.",
      desc:"The same duplex carrying a methyl group on one base, with the sequence unchanged, illustrating modification as a layer on top of the sequence." }
  ];

  let cur=0;
  function go(i,animated){
    if(raf){cancelAnimationFrame(raf);raf=null;}
    const st=S[i];
    if(st.shuffle && animated!==false && !reduce.matches){
      /* let the sequence and length actually churn before settling */
      const t0=performance.now(), dur=950;
      raf=requestAnimationFrame(function f(now){
        const p=Math.min(1,(now-t0)/dur);
        if(p<1){
          const n=6+Math.floor(Math.random()*4);
          render(M.make({top:rnd(n), ends:{t5:"phos",b5:"phos"}}), st.word, st.sub);
          raf=requestAnimationFrame(f);
        } else { render(st.model(), st.word, st.sub); raf=null; }
      });
    } else {
      render(st.model(), st.word, st.sub);
    }
    cur=i;
  }
  go(0,false);
  return { steps:S.map(x=>({note:x.note,desc:x.desc})), go };
});
})();
