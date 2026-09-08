/* ------------------------------------------------------------------ *
 * op-ligase.js — the ligase operator, in the deck's standard grammar.
 *
 * Every other enzyme section opens with one of these and ligases did
 * not, which left the one enzyme whose whole story IS a list of
 * requirements as the only one never to state them in the shared
 * visual language.
 *
 * Red is what has to be there; grey is what the enzyme never reads.
 * So both backbones are red, both 5' phosphate and 3' hydroxyl are red
 * and named, and the hydrogen bonds are red too -- being annealed is
 * part of the requirement here, not scenery, because ligase seals a
 * nick and a nick only exists inside a duplex. The bases are grey:
 * ligase has no recognition sequence at all.
 *
 * The loop is the reaction: nicked, then sealed, then nicked again. It
 * is deliberately the SAME picture in both frames apart from one bond,
 * because that is the honest scale of what this enzyme does.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const M=window.DNAModel;
const INK="#111111", MUT="#767676", RED=M.HOT;
const n2=v=>Math.round(v*10)/10;

const SEQ="GATCAG", N=SEQ.length, NICK=3;   /* the nick sits after base 3 */
const X0=(1600-(N-1)*188)/2;
const HOLD_N=1.15, HOLD_S=1.45;             /* nicked, then sealed        */
const CYCLE=HOLD_N+HOLD_S;

const role=()=>Array.from({length:N},()=>({bb:"hot", base:"bg"}));
const mk=(r,e)=>M.make({top:SEQ, range:r, hb:"hot", roleTop:role(), roleBot:role(),
                        ends:Object.assign({t5:"oh",t3:"oh",b5:"oh",b3:"oh"}, e||{})});
const tx=(x,y,t,c,sz)=>'<text x="'+n2(x)+'" y="'+n2(y)+'" text-anchor="middle" '+
  'font-family="inherit" font-size="'+(sz||22)+'" font-weight="700" fill="'+c+'">'+t+'</text>';

function frame(sealed){
  if (sealed) return M.draw(mk({top:[0,N], bot:[0,N]}), X0);
  /* two molecules, abutting: the upstream piece ends in a 3' hydroxyl,
     the downstream piece starts with a 5' phosphate, and the template
     strand runs unbroken underneath both */
  let g = M.draw(mk({top:[0,NICK], bot:[0,N]}, {t3:"oh"}), X0);
  const oh = M.anchors.term.top3;
  /* The downstream piece is drawn against its OWN stretch of template so
     its bases pair too: the ends are held in register ACROSS the nick,
     which is the requirement. Its template residues are redrawn
     identically and carry no termini of their own -- they are the middle
     of a strand, not the end of one. */
  g += M.draw(mk({top:[NICK,N], bot:[NICK,N]}, {t5:"phos", b3:"none", b5:"none"}), X0);
  const ph = M.anchors.term.top5;
  g += tx(oh[0]-4, oh[1]-44, "3&#8242;-OH", RED, 21) +
       tx(ph[0]+16, ph[1]-62, "5&#8242;-P", RED, 21);
  return g;
}

window.Deck.sequence("op-ligase", function(slide){
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  slide.appendChild(svg);
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  let raf=null, was=null;

  function paint(sealed){
    if (was === sealed) return;             /* redraw only on the flip */
    was = sealed;
    /* both lines live at the bottom: the top of this drawing is where the
       3'-OH and 5'-P labels have to go, and a subtitle there collided */
    svg.innerHTML = frame(sealed) +
      '<text x="800" y="800" text-anchor="middle" font-family="inherit" font-size="27" '+
        'font-weight="700" fill="'+(sealed?RED:MUT)+'">' +
        (sealed ? "one bond, one ATP" : "two ends, held in register by the strand underneath") +
      '</text>' +
      '<text x="800" y="840" text-anchor="middle" font-family="inherit" font-size="24" '+
        'fill="'+MUT+'">a nick in a duplex, and no sequence anywhere in the list</text>';
  }
  function go(){
    if(raf){cancelAnimationFrame(raf);raf=null;}
    if(reduce.matches){ paint(true); return; }
    const t0=performance.now();
    raf=requestAnimationFrame(function f(now){
      if(!slide.classList.contains("on")){ raf=null; return; }
      paint(((now-t0)/1000)%CYCLE >= HOLD_N);
      raf=requestAnimationFrame(f);
    });
  }
  go();
  return { steps:[{
    note:"Here is ligase in the same terms we have used for every other enzyme. Red is what has to be there; grey is what it never reads. Look at how much is red. Both backbones, because it works on a duplex. The hydrogen bonds, because the two ends have to be held in register by the strand running underneath them. That is not scenery here, it is the requirement. And at the junction, a three prime hydroxyl on one side and a five prime phosphate on the other, directly abutting. Now look at what is grey: every base. Ligase has no recognition sequence whatsoever. It is the only enzyme in this lecture whose specificity is entirely about the SHAPE of a junction and not at all about what the junction says. And watch the loop, because the honest scale of the reaction is that one bond appears. Everything else on this slide is the price of admission.",
    desc:"An all-atom DNA duplex with a nick in the upper strand. Both backbones and every hydrogen bond are drawn in red, marking what the enzyme requires; every base is grey, marking that it reads none of them. At the nick, the 3-prime hydroxyl and the 5-prime phosphate are labelled in red. On a loop the nick seals into a continuous backbone and opens again."
  }], go:go };
});
})();
