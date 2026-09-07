/* ------------------------------------------------------------------ *
 * mechanism.js — phosphoryl transfer, drawn as a sequence of events
 * along the most frequent reaction coordinate.
 *
 * Uncatalysed, in water. No enzyme, no active site, no general base.
 * Every frame is drawn explicitly rather than tweened, because the
 * point is the arrows and where they start and end:
 *
 *   tail on a lone pair, or on the bond whose electrons move
 *   head on the atom, or the bond, those electrons arrive at
 *
 * The substrate is the DNA phosphodiester, not a monoester dianion,
 * because that is the bond this lecture is about. Charge is conserved
 * at -1 throughout: monoanion, then the pentacoordinate species at
 * -1 -1 +1, then products at -1.
 *
 * Water attacks first. It does not become hydroxide before attacking:
 * at pH 7 hydroxide is 10^-7 M, and the proton leaves afterwards
 * through the surrounding water.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const INK="#111111", MUT="#767676", RED="#ba3a13", BLUE="#004373";
const n2=v=>Math.round(v*10)/10;

/* ---- primitives ---------------------------------------------------- */
function bond(a,b,c,w){
  return '<path d="M'+n2(a[0])+' '+n2(a[1])+'L'+n2(b[0])+' '+n2(b[1])+
         '" fill="none" stroke="'+(c||INK)+'" stroke-width="'+(w||2.6)+
         '" stroke-linecap="round"/>';
}
/* a second parallel line, offset away from `away` — never a wedge, which
   would assert stereochemistry rather than bond order */
function dbl(a,b,away,c){
  const dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy)||1;
  let nx=-dy/L*5, ny=dx/L*5;
  const mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2;
  if((mx+nx-away[0])**2+(my+ny-away[1])**2 < (mx-nx-away[0])**2+(my-ny-away[1])**2){
    nx=-nx; ny=-ny;
  }
  return bond(a,b,c)+bond([a[0]+nx,a[1]+ny],[b[0]+nx,b[1]+ny],c);
}
function lab(p,t,c,sz){
  const s=sz||31;
  return '<circle cx="'+n2(p[0])+'" cy="'+n2(p[1])+'" r="'+(s*0.66)+'" fill="#fff"/>'+
         '<text x="'+n2(p[0])+'" y="'+n2(p[1]+s*0.35)+'" text-anchor="middle" font-size="'+s+
         '" font-weight="700" fill="'+(c||INK)+'">'+t+'</text>';
}
/* a lone pair: two dots, set off the atom in a given direction */
function pair(p,deg,c,d){
  const t=deg*Math.PI/180, ux=Math.cos(t), uy=Math.sin(t);
  const q=[p[0]+ux*(d||30), p[1]+uy*(d||30)];
  return '<circle cx="'+n2(q[0]-uy*7)+'" cy="'+n2(q[1]+ux*7)+'" r="4.4" fill="'+(c||INK)+'"/>'+
         '<circle cx="'+n2(q[0]+uy*7)+'" cy="'+n2(q[1]-ux*7)+'" r="4.4" fill="'+(c||INK)+'"/>';
}
const pairAt=(p,deg,d)=>{const t=deg*Math.PI/180;
  return [p[0]+Math.cos(t)*(d||30), p[1]+Math.sin(t)*(d||30)];};
function arrow(a,b,bow,c){
  const mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2;
  const dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy)||1;
  const cx=mx-dy/L*bow, cy=my+dx/L*bow;
  return '<path d="M'+n2(a[0])+' '+n2(a[1])+'Q'+n2(cx)+' '+n2(cy)+' '+n2(b[0])+' '+n2(b[1])+
         '" fill="none" stroke="'+(c||RED)+'" stroke-width="2.9" marker-end="url(#mh)"/>';
}
function sign(p,t,c){
  return '<text x="'+n2(p[0])+'" y="'+n2(p[1])+'" text-anchor="middle" font-size="26" '+
         'font-weight="700" fill="'+(c||INK)+'">'+t+'</text>';
}
function tether(from,to,text){
  return bond(from,to,MUT,1.9)+
         '<text x="'+n2(to[0]-8)+'" y="'+n2(to[1]+7)+'" text-anchor="end" font-size="23" fill="'+
         MUT+'">'+text+'</text>';
}
const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];

/* ---- the phosphorus centre ----------------------------------------- */
const P   =[660,548];
const EUL =[496,452];      /* equatorial: the sugar that stays          */
const ELL =[496,644];      /* equatorial: an anionic oxygen             */
const ER  =[846,548];      /* equatorial: P=O, or anionic once attacked */
const AXU =[660,344];      /* axial: the incoming nucleophile           */
const AXD =[660,738];      /* axial: the sugar that leaves              */

/* o: {nuc:0|1, nucH:2|1|0, plus:bool, rightDouble:bool, leaving:bool} */
function centre(o){
  let g="";
  g+=bond(P,EUL)+lab(EUL,"O");
  g+=tether(EUL,[366,386],"sugar");
  g+=bond(P,ELL)+lab(ELL,"O")+sign([ELL[0]-27,ELL[1]-14],"&#8722;");
  g+= o.rightDouble ? dbl(P,ER,[P[0],P[1]+90])+lab(ER,"O")
                    : bond(P,ER)+lab(ER,"O")+sign([ER[0]+30,ER[1]-14],"&#8722;");
  if(o.leaving){
    g+=bond(P,AXD)+lab(AXD,"O")+tether(AXD,[500,794],"sugar");
  }
  if(o.nuc) g+=bond(P,AXU);
  g+=lab(P,"P");
  return g;
}
/* the attacking water, above the phosphorus on the axis */
function nucleophile(o){
  let g="";
  if(o.nucH>=1) g+=bond(AXU,[AXU[0]-62,AXU[1]-52],RED)+lab([AXU[0]-78,AXU[1]-64],"H",RED,29);
  if(o.nucH>=2) g+=bond(AXU,[AXU[0]+62,AXU[1]-52],RED)+lab([AXU[0]+78,AXU[1]-64],"H",RED,29);
  g+=lab(AXU,"O",RED);
  if(o.plus) g+=sign([AXU[0]+36,AXU[1]+38],"+",RED);
  if(o.lp)   g+=pair(AXU,90,RED,34);
  return g;
}

/* ---- frames -------------------------------------------------------- */
/* the sugar the attacking hydroxyl belongs to, greyed: the ring is not the
   point, the O and the H hanging off it are */
function ribose(cx,cy,c){
  const r=44, v=[90,18,-54,-126,162].map(d=>[cx+r*Math.cos(d*Math.PI/180),
                                             cy-r*Math.sin(d*Math.PI/180)]);
  let g="";
  for(let i=0;i<5;i++) g+=bond(v[i],v[(i+1)%5],c,2.2);
  g+=lab(v[0],"O",c,22);
  return {g, out:v[1]};       /* the right-hand vertex, facing the phosphorus */
}
const W2=[1180,366];                       /* the neighbouring water    */
function water2(charged){
  let g="";
  g+=bond(W2,[W2[0]-58,W2[1]-46],RED)+lab([W2[0]-74,W2[1]-58],"H",RED,29);
  g+=bond(W2,[W2[0]+58,W2[1]-46],RED)+lab([W2[0]+74,W2[1]-58],"H",RED,29);
  if(charged) g+=bond(W2,[W2[0],W2[1]+58],RED)+lab([W2[0],W2[1]+76],"H",RED,29);
  g+=lab(W2,"O",RED);
  if(charged) g+=sign([W2[0]+38,W2[1]-6],"+",RED);
  else        g+=pair(W2,182,RED,34);
  return g;
}

const F=[
/* A held frame before any chemistry starts. The slide used to open with
   the water already arriving and an arrow drawn, so the framing for the
   whole lecture had to be said over a reaction in progress. The bond on
   its own is the right thing to be looking at while that is said. */
{ cap:"First, the bond it all happens to",
  sub:"three reactions, and every one of them happens on its own &mdash; slowly",
  who:"phosphorus, an oxygen out to each sugar, one double bond and one negative charge",
  draw:function(){ return centre({rightDouble:1,leaving:1}); },
  note:"Reading the catalogue is the reason, but not the only one. This is a lecture about biochemistry, and I want you to understand the tools down to the atom. The day comes down to three reactions. Two are the attack I just mentioned, a hydroxyl onto a phosphorus, differing only in what does the attacking; the third is on a different atom and is the odd one out. And there is nothing special about any of them — all three happen on their own, in water, with no protein anywhere near, just extremely slowly. An enzyme takes one and accelerates it enormously. Then it restricts it: to one sequence, one kind of end, one position on one base. The reaction is ordinary. The restrictions are what you are buying. There are only a few hundred common reaction mechanisms in all of biology, and every one has this kind of nuance. We can be this precise about the DNA-modifying ones because they are working tools of biotechnology, and decades of effort have gone into understanding them and into optimising them. Most of biology has not had that attention, which is missing mapping, not missing complexity. The starting point is the same everywhere, and it is why I want to begin here: everything a cell does corresponds to a real reaction that would happen anyway, given long enough.",
  desc:"A phosphodiester drawn on its own, with no reaction under way: phosphorus at the centre, an oxygen tethered out to a sugar on each side, one double-bonded oxygen and one anionic oxygen." },

{ cap:"1 &nbsp;Water attacks the phosphorus",
  sub:"water itself, not hydroxide &mdash; at pH 7 there is almost no hydroxide to wait for",
  who:"a lone pair on the oxygen makes the new bond",
  draw:function(){
    return centre({rightDouble:1,leaving:1}) + nucleophile({nucH:2,lp:1}) +
           arrow(pairAt(AXU,90,40),[P[0]-6,P[1]-46],54,RED);
  },
  note:"The first of the three: hydrolysis, one step at a time, no enzyme anywhere — the uncatalysed reaction, just water. Think about what is happening in the tube. Everything is jostling, colliding millions of times a second, and almost every collision does nothing. Every so often a water hits the phosphorus at the right angle with a lone pair pointed the right way, and those two electrons drop into an empty orbital. The angle is not arbitrary: it is straight down the line of the bond about to break, from the opposite side, because the orbital they enter is that bond\u2019s antibonding orbital — fill it and the bond weakens. That is why the attack comes in on the axis. And notice what is attacking: water, not hydroxide. At pH seven there is one ten-millionth molar hydroxide, so nothing is waiting around as hydroxide. Water attacks as water, and the proton problem is solved afterwards. The arrow starts on a lone pair, because that is what moves, and ends at the phosphorus, because that is where the electrons go.",
  desc:"A phosphodiester with phosphorus at the centre: two oxygens tethered to sugars, one double-bonded oxygen and one anionic oxygen. A water molecule sits above on the axis opposite the leaving sugar, and a curved arrow runs from a lone pair on its oxygen to the phosphorus." },

{ cap:"2 &nbsp;Now that oxygen has three bonds",
  sub:"so it carries a positive charge &mdash; and a neighbouring water takes the proton",
  who:"two arrows: the second water takes H, and the O&#8722;H electrons fall back onto the oxygen",
  draw:function(){
    const H=[AXU[0]+78,AXU[1]-64];
    return centre({nuc:1,leaving:1}) + nucleophile({nucH:2,plus:1}) + water2(false) +
           arrow(pairAt(W2,182,40),[H[0]+30,H[1]-4],46,RED) +
           arrow([AXU[0]+(H[0]-AXU[0])*0.60, AXU[1]+(H[1]-AXU[1])*0.60],
                 [AXU[0]+30,AXU[1]-24], -64, RED);
  },
  note:"The bond has formed, so count. That oxygen now has three bonds — two hydrogens and the phosphorus — and three bonds on oxygen means a positive charge. There it is. Phosphorus is holding five things at once, a trigonal bipyramid, and that is the only moment in the reaction when it does. Nothing has left yet. Now the proton comes off, and this is the part people skip: it does not evaporate, a neighbouring water takes it. Two arrows, both matter. The first runs from a lone pair on that second water to the hydrogen — the water grabbing the proton. The second runs from the oxygen-hydrogen bond onto the oxygen, because a proton leaving leaves its bonding electrons behind.",
  desc:"The new phosphorus-oxygen bond is drawn and the attacking oxygen now carries a plus sign. A second water molecule at the right has a curved arrow from its lone pair to one hydrogen of the attacking water, and a second arrow from that oxygen-hydrogen bond back onto its own oxygen." },

{ cap:"3 &nbsp;The bond to the leaving sugar breaks",
  sub:"the phosphate takes its double bond back, and pushes the sugar off",
  who:"again two arrows &mdash; one makes a bond, one breaks a bond",
  draw:function(){
    return centre({nuc:1,leaving:1}) + nucleophile({nucH:1}) + water2(true) +
           pair(ER,0,INK,34) +
           arrow(pairAt(ER,0,42),mid(P,ER),-46,RED) +
           arrow(mid(P,AXD),[AXD[0],AXD[1]-44],46,RED);
  },
  note:"The proton is now on that neighbouring water — hydronium, positive, sitting there — and the attacking oxygen is a neutral hydroxyl on the phosphorus. Now the leaving group goes. Two arrows again. One runs from a lone pair on the anionic oxygen into the phosphorus-oxygen bond, remaking the double bond. That push displaces the sugar: the other runs from the phosphorus-to-leaving-oxygen bond onto that oxygen, so the sugar leaves with both electrons, as an alkoxide.",
  desc:"The attacking oxygen is now a neutral hydroxyl and the second water has become hydronium with a plus charge. Two curved arrows: one from a lone pair on the anionic oxygen into the phosphorus-oxygen bond, remaking the double bond, and one from the phosphorus to leaving-oxygen bond onto that oxygen." },

{ cap:"4 &nbsp;The alkoxide takes a proton back",
  sub:"from the hydronium the attacking water made a moment ago",
  who:"the proton the water brought in is handed to the sugar that left",
  draw:function(){
    /* the proton hangs straight down off the hydronium. Set off to the side it
       lay almost along the bond the second arrow starts on, so that arrow
       collapsed into a sliver and its head ran past the oxygen. */
    /* the departed sugar sits under the hydronium it takes the proton from.
       Left across the figure, the arrow between them ran straight through
       the phosphate. */
    const A=[906,744], H=[W2[0],W2[1]+96];
    let g=centre({nuc:1,rightDouble:1}) + nucleophile({nucH:1});
    g+=lab(A,"O",RED)+sign([A[0]-30,A[1]-14],"&#8722;",RED)+tether(A,[790,806],"sugar");
    g+=pair(A,-30,RED,34);
    g+=bond(W2,[W2[0]-58,W2[1]-46],RED)+lab([W2[0]-74,W2[1]-58],"H",RED,29);
    g+=bond(W2,[W2[0]+58,W2[1]-46],RED)+lab([W2[0]+74,W2[1]-58],"H",RED,29);
    g+=bond(W2,H,RED)+lab(H,"H",RED,29)+lab(W2,"O",RED)+sign([W2[0]+38,W2[1]-6],"+",RED);
    g+=arrow(pairAt(A,-30,42),[H[0]-34,H[1]+22],-58,RED);
    /* out to the right off the bond, then back into the oxygen */
    g+=arrow([W2[0]-4,W2[1]+62],[W2[0]+32,W2[1]+18],-54,RED);
    return g;
  },
  note:"Last step, and it is bookkeeping catching up. The sugar left as an alkoxide — a strong base — with hydronium sitting right there, so it takes a proton straight back. The same two arrows run the other way: a lone pair on the alkoxide reaches for the hydrogen, and the bond that hydrogen was using collapses onto its oxygen. Follow the proton across all four steps: the one the attacking water brought ends up on the sugar that left. The water network just moved it around.",
  desc:"The phosphate now carries a hydroxyl and its double bond is restored. The departed sugar is drawn at lower left as an alkoxide with a negative charge, and hydronium at the right. Two curved arrows: from a lone pair on the alkoxide to a hydrogen of the hydronium, and from that oxygen-hydrogen bond back onto its oxygen." },

{ cap:"The bond is gone, and the pieces are capped",
  sub:"a phosphate on one end, a hydroxyl on the other &mdash; exactly what a nuclease leaves",
  who:"hydrolysis &nbsp;&middot;&nbsp; the bond is <tspan font-weight=\"700\">destroyed</tspan> &nbsp;&middot;&nbsp; endonucleases, exonucleases, phosphatases",
  draw:function(){
    const A=[906,744];
    let g=centre({nuc:1,rightDouble:1}) + nucleophile({nucH:1});
    g+=lab(A,"O",RED)+bond(A,[A[0]+52,A[1]+44],RED)+lab([A[0]+68,A[1]+56],"H",RED,29);
    g+=tether(A,[742,800],"sugar");
    g+=bond(W2,[W2[0]-58,W2[1]-46],RED)+lab([W2[0]-74,W2[1]-58],"H",RED,29);
    g+=bond(W2,[W2[0]+58,W2[1]-46],RED)+lab([W2[0]+74,W2[1]-58],"H",RED,29);
    g+=lab(W2,"O",RED)+pair(W2,90,RED,34);
    return g;
  },
  note:"And there are the products. One piece keeps the phosphate and has gained a hydroxyl; the other is a sugar with a free hydroxyl. The water that attacked is now part of the phosphate, and its proton is on the other fragment. That is what every nuclease and every phosphatase in this lecture does: a phosphate end, a hydroxyl end, and the bond between them gone rather than moved. And it is nearly always the same bond — three prime oxygen to phosphorus — which is why the phosphate is left behind on the downstream piece: a five prime phosphate on one side of the break, a three prime hydroxyl on the other. Hold on to which end gets which. That single fact decides whether the pieces can be put back together.",
  desc:"The products: a phosphate bearing a hydroxyl and still tethered to one sugar, a separate sugar with a free hydroxyl, and a neutral water molecule. The bond between the two sugars is gone." }
,

{ cap:"Now run it again with an alcohol",
  sub:"a sugar&#8217;s 3&#8242; hydroxyl this time",
  who:"same axis, same lone pair, same arrow",
  draw:function(){
    const rb=ribose(498,338,MUT);
    return centre({rightDouble:1,leaving:1}) + rb.g + bond(rb.out,AXU,MUT) +
           bond(AXU,[AXU[0]+62,AXU[1]-52],RED)+lab([AXU[0]+78,AXU[1]-64],"H",RED,29) +
           lab(AXU,"O",RED) + pair(AXU,90,RED,34) +
           arrow(pairAt(AXU,90,40),[P[0]-6,P[1]-46],54,RED);
  },
  note:"Same film, one substitution. Swap the water for an alcohol — here a sugar\u2019s three prime hydroxyl, ring greyed out because the ring is not the point. Same axis, opposite the bond that breaks, same lone pair, same arrow. Every step you just watched happens again exactly as it did, proton bookkeeping included: this oxygen picks up a positive charge at three bonds and loses its proton to the surrounding water. I will not draw those four frames again. Watch what is different at the end.",
  desc:"The same phosphodiester, with a sugar's 3-prime hydroxyl in place of water as the nucleophile. The ribose ring is drawn in grey. A curved arrow runs from a lone pair on its oxygen to the phosphorus, along the axis opposite the leaving sugar." },

{ cap:"The phosphate is handed on, not released",
  sub:"identical chemistry &mdash; opposite outcome",
  who:"transphosphorylation &nbsp;&middot;&nbsp; the bond is <tspan font-weight=\"700\">moved</tspan> &nbsp;&middot;&nbsp; kinases, polymerases, ligases, recombinases",
  draw:function(){
    /* the displaced sugar drops away below the phosphorus, so its leader runs
       down-left rather than back across the figure */
    const rb=ribose(498,338,MUT), A=[880,742];
    let g=centre({nuc:1,rightDouble:1}) + rb.g + bond(rb.out,AXU,MUT) + lab(AXU,"O",RED);
    g+=lab(A,"O",RED)+bond(A,[A[0]+54,A[1]+42],RED)+lab([A[0]+70,A[1]+54],"H",RED,29);
    g+=tether(A,[762,804],"sugar");
    return g;
  },
  note:"And there is the difference, and it is why the lecture is ordered the way it is. With water, the phosphate ended up on water and the bond was destroyed. With an alcohol, the phosphate ends up on the alcohol — handed from one sugar to another. The bond has moved rather than gone. That attacking alcohol is a three prime hydroxyl in a polymerase or a ligase, a five prime hydroxyl in a kinase, a serine or a tyrosine on the protein itself in a recombinase. Identical chemistry, opposite outcome. Do not let the similarity fool you into thinking a nuclease and a ligase do the same thing. And that is two of the three. The third has no phosphorus in it at all — a methyl handed from one molecule to another — and it waits for the enzymes that do it, at the end of the day.",
  desc:"The product: the phosphate is now bonded to the attacking sugar's oxygen, and the sugar that was there before has left carrying a hydroxyl. The phosphodiester has been transferred rather than broken." }
];

window.Deck.sequence("mechanism", function(slide){
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  slide.appendChild(svg);
  function go(i){
    const f=F[i];
    svg.innerHTML =
      '<defs><marker id="mh" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" '+
        'markerHeight="7" orient="auto"><path d="M0 0L12 6L0 12z" fill="'+RED+'"/></marker></defs>'+
      '<text x="800" y="206" text-anchor="middle" font-size="42" font-weight="700" fill="'+INK+
        '">'+f.cap+'</text>'+
      '<text x="800" y="252" text-anchor="middle" font-size="25" fill="'+MUT+'">'+f.sub+'</text>'+
      f.draw()+
      '<text x="800" y="846" text-anchor="middle" font-size="25" font-weight="700" fill="'+BLUE+
        '">'+f.who+'</text>';
  }
  go(0);
  return { steps:F.map(x=>({note:x.note,desc:x.desc})), go:go };
});
})();
