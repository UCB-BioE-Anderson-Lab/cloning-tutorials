/* ------------------------------------------------------------------ *
 * 03-phosphoramidite.js : the monomer, the coupling, and one turn of
 * the synthesis cycle.
 *
 * Registers:  gs-amidite    the real structure (2 beats)
 *                           the coupling mechanism (3 beats)
 *                           column -> deblock -> couple -> oxidize ->
 *                           cap                            (5 beats)
 *
 * The source slide is the standard four-structure cycle, drawn all at
 * once, with the four reaction names scattered round it. Everything a
 * student has to get out of THAT is temporal: which reagent goes on
 * when, and what state the chain is in afterwards. So the ring is drawn
 * once and the room is walked round it a reaction at a time, in the
 * order the speaker notes take them. That part is unchanged.
 *
 * What is new is the two things the cartoon could not say. A cartoon
 * glyph only means something if you have been shown what it stands for,
 * so the slide now opens on the actual monomer -- full dimethoxytrityl,
 * real furanose geometry, the cyanoethyl and the diisopropylamino on a
 * phosphorus with three bonds and no double bond -- and then colours its
 * regions to key them to the glyphs the cycle uses. After that the
 * coupling itself is drawn with arrows, attacking and leaving, and that
 * frame is HELD at the left for the whole of the cycle, so the cartoon
 * on the right always has the real bond-making next to it.
 *
 * The earlier version of this file argued that the source deck's
 * protecting-group chemistry was unreadable from the back of the room.
 * That is still true of it drawn all at once in a corner. The answer
 * taken here is space and time: the structure gets the width of the
 * slide and two beats of its own before anything else appears.
 *
 * Level of iconography, by region of the slide:
 *   LEFT   real skeletal chemistry, in the idiom of the enzymes deck
 *          (01-dna-enzymes/seq/chem.js and seq/mechanism.js): furanose
 *          at real pentagon geometry with O4' at the apex, bonds at
 *          chemical angles, curly arrows that start on a lone pair or a
 *          bond and end where those electrons actually go.
 *   RIGHT  the cartoon cycle, whose glyphs are now defined.
 *
 * Colour is the palette's attention ladder used, on the keyed beat, as
 * a legend: blue DMT, ink sugar and base, vermillion phosphorus (the
 * cartoon already put vermillion there), muted bead. Amber is not
 * reached. Nothing here is a fifth colour.
 *
 * The chain is drawn vertically in the cartoon because that is how it
 * sits on the column: 3' end held by the CPG, 5' end up, which is the
 * end every reaction in the cycle acts on. No arrowheads on the DNA
 * anywhere; the 3' end is not free, it is bonded to the bead.
 *
 * NOTE ON ORDER: the source puts oxidation before capping, and this
 * follows it. Many texts run the cap first. Not changed here.
 *
 * NOTE ON THE COUPLING MECHANISM: it is drawn here as tetrazole
 * protonating the diisopropylamino nitrogen and the 5' hydroxyl then
 * displacing it directly. The accepted mechanism has a step in between:
 * tetrazolide displaces the protonated amine first, and the alcohol
 * attacks the phosphoro-tetrazolide that makes. That is a deliberate
 * teaching simplification, not an oversight. What the slide has to buy
 * is the pair of arrows -- an alcohol onto phosphorus, an amine off it
 * -- and the intermediate costs a beat without changing either one.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", RED = "#ba3a13", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";
const n2 = v => Math.round(v*10)/10;

/* ==================================================================== *
 * PRIMITIVES.  Same conventions as the enzymes deck: a bond order above
 * one is extra parallel lines and never a wedge, which would assert
 * stereochemistry instead; a lone pair is two dots set off the atom; a
 * curly arrow is a quadratic with a solid head.  There is no dbl() here
 * only because nothing on this slide has a double bond -- which is the
 * whole point of a phosphite.
 * ==================================================================== */
function bond(a,b,c,w){
  return '<path d="M'+n2(a[0])+' '+n2(a[1])+'L'+n2(b[0])+' '+n2(b[1])+
         '" fill="none" stroke="'+(c||INK)+'" stroke-width="'+(w||3)+
         '" stroke-linecap="round"/>';
}
/* the inner line of an aromatic bond, drawn toward the ring centre */
function inner(a,b,ctr,c){
  const dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy)||1;
  let nx=-dy/L*7, ny=dx/L*7;
  const mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2;
  if((mx+nx-ctr[0])**2+(my+ny-ctr[1])**2 > (mx-nx-ctr[0])**2+(my-ny-ctr[1])**2){
    nx=-nx; ny=-ny;
  }
  const ux=dx/L*8, uy=dy/L*8;
  return bond([a[0]+nx+ux,a[1]+ny+uy],[b[0]+nx-ux,b[1]+ny-uy],c,2.4);
}
/* three parallel lines: a nitrile */
function trpl(a,b,c){
  const dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy)||1;
  const nx=-dy/L*6.5, ny=dx/L*6.5;
  return bond(a,b,c)+
         bond([a[0]+nx,a[1]+ny],[b[0]+nx,b[1]+ny],c)+
         bond([a[0]-nx,a[1]-ny],[b[0]-nx,b[1]-ny],c);
}
/* a haloed atom label, mechanism.js style: it punches a hole in a bond */
function lab(p,t,c,sz){
  const s=sz||31;
  return '<circle cx="'+n2(p[0])+'" cy="'+n2(p[1])+'" r="'+(s*0.62)+'" fill="#fff"/>'+
         '<text x="'+n2(p[0])+'" y="'+n2(p[1]+s*0.35)+'" text-anchor="middle" font-size="'+s+
         '" font-weight="700" fill="'+(c||INK)+'">'+t+'</text>';
}
function txt(p,t,c,sz,anchor,weight){
  return '<text x="'+n2(p[0])+'" y="'+n2(p[1])+'" text-anchor="'+(anchor||"middle")+
         '" font-size="'+(sz||22)+'" font-weight="'+(weight||400)+'" fill="'+(c||MUTED)+'">'+
         t+'</text>';
}
/* a lone pair: two dots, set off the atom in a given direction */
function pair(p,deg,c,d){
  const t=deg*Math.PI/180, ux=Math.cos(t), uy=Math.sin(t);
  const q=[p[0]+ux*(d||30), p[1]+uy*(d||30)];
  return '<circle cx="'+n2(q[0]-uy*7)+'" cy="'+n2(q[1]+ux*7)+'" r="4.6" fill="'+(c||INK)+'"/>'+
         '<circle cx="'+n2(q[0]+uy*7)+'" cy="'+n2(q[1]-ux*7)+'" r="4.6" fill="'+(c||INK)+'"/>';
}
const pairAt=(p,deg,d)=>{const t=deg*Math.PI/180;
  return [p[0]+Math.cos(t)*(d||30), p[1]+Math.sin(t)*(d||30)];};
/* stroke-width 2.4, not 3: the marker scales with the stroke, and the
   short proton-transfer arrows here are barely longer than a head drawn
   for a wider one */
function arrow(a,b,bow,c){
  const mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2;
  const dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy)||1;
  const cx=mx-dy/L*bow, cy=my+dx/L*bow;
  return '<path d="M'+n2(a[0])+' '+n2(a[1])+'Q'+n2(cx)+' '+n2(cy)+' '+n2(b[0])+' '+n2(b[1])+
         '" fill="none" stroke="'+(c||RED)+'" stroke-width="2.4" marker-end="url(#gsAmdHead)"/>';
}
function sign(p,t,c,sz){
  return '<text x="'+n2(p[0])+'" y="'+n2(p[1])+'" text-anchor="middle" font-size="'+(sz||27)+
         '" font-weight="700" fill="'+(c||INK)+'">'+t+'</text>';
}
const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];

/* an isopropyl on `n`, its CH out along `ang` degrees: the two methyls
   go at 120 degrees either side of the bond back to n, so neither of
   them lies along it and collapses the group into a straight line */
function isopropyl(n,ang,len,col){
  const t=ang*Math.PI/180, ch=[n[0]+Math.cos(t)*len, n[1]+Math.sin(t)*len];
  const back=t+Math.PI, d=120*Math.PI/180;
  const m1=[ch[0]+Math.cos(back+d)*len, ch[1]+Math.sin(back+d)*len];
  const m2=[ch[0]+Math.cos(back-d)*len, ch[1]+Math.sin(back-d)*len];
  return {ch:ch, m1:m1, m2:m2,
          g: bond(ch,m1,col)+bond(ch,m2,col), to:ch};
}

/* ==================================================================== *
 * THE REAL MONOMER.
 *
 * Built the way a skeletal structure is built, not the way a layout is:
 * ONE bond length L for every bond in the molecule, and every atom
 * placed by walking an angle from the atom before it.  Nothing here is
 * positioned by picking a coordinate that looked right, which is how a
 * drawing ends up with bonds of fifteen different lengths.
 *
 *   L        the single bond length.  The furanose is the regular
 *            pentagon chem.js draws -- vertices at 90,18,-54,-126,162 --
 *            and at circumradius R its side is 2 R sin36, so choosing
 *            L fixes R and the ring is correct by construction.
 *   walk()   the only way an atom position is ever produced.
 *   chains   turn 60 degrees each step, so the interior angle is 120.
 *   ring     substituents leave a ring vertex radially, which is 126
 *            degrees off each ring bond.
 *   nitrile  the sp carbon continues straight: C-C=N is 180.
 *   aryl     regular hexagons of side L, so ring centres sit 2L out.
 *
 * Atom labels are haloed rather than drawn with the bond trimmed back,
 * so every bond really is emitted at full length and the audit below
 * measures the geometry rather than the label gaps.  The only strokes
 * that are deliberately not L are the inner lines of aromatic bonds,
 * which are inset at both ends, and the muted label leaders, which are
 * thinner and grey precisely so they cannot be read as bonds.
 *
 * Local coordinates, origin at the centre of the furanose ring; the
 * caller places the whole thing with one transform.
 * ==================================================================== */
const L = 77.6;                       /* the bond length. All of them.  */
const RAD = Math.PI/180;
const walk = (p,ang,n) => [p[0]+Math.cos(ang*RAD)*L*(n||1),
                           p[1]+Math.sin(ang*RAD)*L*(n||1)];
const MR = L/(2*Math.sin(36*RAD));    /* => 66, the pentagon's radius   */
/* furanose vertices, O4' at the apex: angles 90,18,-54,-126,162 */
const RING = [90,18,-54,-126,162].map(function(d){
  return [MR*Math.cos(d*RAD), -MR*Math.sin(d*RAD)];
});
const O4=RING[0], C1=RING[1], C2=RING[2], C3=RING[3], C4=RING[4];

/* every exocyclic bond leaves its vertex radially: for a regular
   polygon that is the outward direction, and the vertex's own polar
   angle -18, 54, 126, 198 is exactly that direction */
const BASEV = walk(C1,-18);                      /* the base on C1'      */
const H2V   = walk(C2,54);                       /* the 2' hydrogen      */
const C5V   = walk(C4,198);                      /* C5'                  */
const O5V   = walk(C5V,258);                     /* the 5' oxygen        */
const CTRV  = walk(O5V,198);                     /* the trityl carbon    */
const O3V   = walk(C3,126);                      /* the 3' oxygen        */
const PV    = walk(O3V,66);                      /* phosphorus(III)      */
/* P's three bonds: the one back to O3' points 246, so the other two sit
   at 246 +/- 120 and the centre is trigonal */
const OCEV  = walk(PV,6);                        /* the cyanoethyl O     */
const CE1   = walk(OCEV,66);
const CE2   = walk(CE1,6);
const CNC   = walk(CE2,-54);                     /* the nitrile carbon   */
const CNN   = walk(CNC,-54);                     /* sp: straight on      */
const NV    = walk(PV,126);                      /* the amidite nitrogen */

/* an isopropyl on `n`, its CH out along `ang`: the two methyls go at
   120 degrees either side of the bond back to n, so neither of them
   lies along it and collapses the group into a straight line */
function isopropyl(n,ang,col,len){
  const k=(len||L)/L, ch=walk(n,ang,k), back=ang+180;
  const m1=walk(ch,back+120,k), m2=walk(ch,back-120,k);
  return { ch:ch, g: bond(n,ch,col)+bond(ch,m1,col)+bond(ch,m2,col) };
}

/* an aryl ring hung off `ctr` along `ang`: a regular hexagon of side L,
   so the ipso carbon is L out and the ring centre 2L out.  `ome` is the
   angle the para methoxy leaves on, or null for a plain phenyl. */
function aryl(ctr,ang,col,ome){
  const c=walk(ctr,ang,2), v=[];
  for(let k=0;k<6;k++) v.push(walk(c, ang+180+k*60));
  let g=bond(ctr,v[0],col);
  for(let k=0;k<6;k++) g+=bond(v[k],v[(k+1)%6],col);
  [0,2,4].forEach(function(k){ g+=inner(v[k],v[(k+1)%6],c,col); });
  if(ome!==null && ome!==undefined){
    const o=walk(v[3],ome);
    g+=bond(v[3],o,col)+bond(o,walk(o,ome-60),col)+lab(o,"O",col,32);
  }
  return g;
}

/* keyed=false -> everything ink, the molecule on its own terms
   keyed=true  -> regions coloured to match the cartoon's glyphs        */
function monomer(keyed){
  const sug = INK;
  const dmt = keyed ? BLUE : INK;
  const amd = keyed ? RED  : INK;
  let b='<g>', l='';        /* bonds first, labels second */

  /* --- the trityl: one carbon, three rings, two of them methoxylated
         at the para position, which is the 4,4' in the name --- */
  b+=aryl(CTRV,198,dmt,258);
  b+=aryl(CTRV,108,dmt,168);
  b+=aryl(CTRV,288,dmt,null);

  /* --- the 5' arm --- */
  b+=bond(C4,C5V,sug)+bond(C5V,O5V,sug)+bond(O5V,CTRV,dmt);
  l+=lab(O5V,"O",dmt,32);

  /* --- the sugar --- */
  b+=bond(C1,C2,sug)+bond(C2,C3,sug)+bond(C3,C4,sug)+
     bond(C4,O4,sug)+bond(O4,C1,sug);
  l+=lab(O4,"O",sug,32);
  /* 2'-deoxy: the H that makes this DNA and not RNA */
  b+=bond(C2,H2V,sug);
  l+=lab(H2V,"H",MUTED,28);

  /* --- the base.  A block, because at this size the honest thing to
         say about the nucleobase is that it is protected too --- */
  b+=bond(C1,BASEV,sug);
  l+=txt([BASEV[0]+16,BASEV[1]+10],"base",sug,28,"start",700);
  l+=txt([BASEV[0]+16,BASEV[1]+44],"amines protected",MUTED,23,"start");

  /* --- the 3' arm and the phosphoramidite --- */
  b+=bond(C3,O3V,sug)+bond(O3V,PV,amd);
  l+=lab(O3V,"O",sug,32);
  /* the cyanoethyl-protected oxygen */
  b+=bond(PV,OCEV,amd)+bond(OCEV,CE1,amd)+bond(CE1,CE2,amd)+bond(CE2,CNC,amd);
  b+=trpl(CNC,CNN,amd);
  l+=lab(OCEV,"O",amd,32)+lab(CNN,"N",amd,32);
  /* the diisopropylamino group: N's bond back to P points 306, so the
     two isopropyls sit at 306 +/- 120 */
  b+=bond(PV,NV,amd)+isopropyl(NV,66,amd).g+isopropyl(NV,186,amd).g;
  l+=lab(NV,"N",amd,32)+lab(PV,"P",amd,36);

  /* --- what the four regions are called.  A leader is muted and thin,
         so it is never mistaken for a bond --- */
  l+=bond([0,-138],[0,-96],MUTED,1.8);
  l+=txt([0,-152],"2&#8242;-deoxyribose",sug,24);
  l+=txt([-380,215],"5&#8242;-O-DMT",dmt,28,"middle",700);
  l+=txt([-380,247],"acid-labile",MUTED,23);
  l+=txt([250,342],"3&#8242;-O-phosphoramidite",amd,26,"middle",700);
  l+=txt([250,374],"three bonds on P, no P=O",MUTED,23);
  return b+l+'</g>';
}

/* ==================================================================== *
 * THE KEY.  Each cartoon glyph, drawn exactly as the cycle draws it,
 * against the region of the real molecule it stands for.
 * ==================================================================== */
const KEYX=1040, KEYG=1086, KEYT=1136;
function keyRow(y,glyph,title,detail){
  return glyph + txt([KEYT,y-2],title,INK,23,"start",700) +
                 txt([KEYT,y+28],detail,MUTED,20,"start");
}
function keyPanel(){
  let g='<g>';
  g+=txt([KEYX,268],"What the cartoon stands for",BLUE,24,"start",700);
  g+=keyRow(340,
      txt([KEYG,348],"DMT",BLUE,22,"middle",700),
      "the 5&#8242; blocking group","dimethoxytrityl; acid removes it");
  g+=keyRow(440,
      '<circle cx="'+KEYG+'" cy="440" r="9" fill="'+INK+'"/>',
      "the nucleobase","on C1&#8242;, its amines protected");
  g+=keyRow(540,
      bond([KEYG,514],[KEYG,566],INK,3.4),
      "sugar and backbone","2&#8242;-deoxyribose, 3&#8242; to 5&#8242;");
  g+=keyRow(640,
      '<circle cx="'+KEYG+'" cy="640" r="14" fill="#fff" stroke="'+RED+'" stroke-width="3.4"/>'+
      txt([KEYG,647],"P",RED,18,"middle",700),
      "the phosphoramidite","three bonds on P, no double bond");
  g+=keyRow(740,
      '<circle cx="'+KEYG+'" cy="740" r="19" fill="none" stroke="'+MUTED+'" stroke-width="3"/>'+
      txt([KEYG,746],"CPG",MUTED,14),
      "the bead","holds the chain; not on the monomer");
  return g+'</g>';
}

/* ==================================================================== *
 * THE COUPLING, atom by atom.  Local coordinates, origin on the
 * phosphorus.  Two molecules: the chain on the bead comes in from the
 * upper left, the monomer hangs off the 3' oxygen at the right.
 * ==================================================================== */
const P0=[0,0];
/* This panel is a mechanism in the idiom of 01-dna-enzymes/seq/mechanism.js,
   not a structure: there the bonds around the reacting centre are drawn long
   so the curly arrows and the charges have somewhere to go, and the groups
   hanging off them are drawn at ordinary length.  So there are two lengths
   here and only two -- MB for every bond at the phosphorus, MS for every
   bond beyond it -- and each family is uniform.  Leaders out to a cartoon
   glyph are muted and thin and are not bonds at all. */
const MB=176, MS=92;
const mw=(p,ang,r)=>[p[0]+Math.cos(ang*RAD)*r, p[1]+Math.sin(ang*RAD)*r];
const MO=mw(P0,270,MB), MOH=mw(MO,-38,MS), MC5=mw(MO,215,MS);  /* attacking 5'-OH */
const MTETH=[-208,-262], MBEAD=[-244,-274];        /* leader, then the bead glyph */
const MO3=mw(P0,9,MB), MC3=mw(MO3,-29,MS), MMON=[334,-64];      /* the monomer side */
const MOCE=mw(P0,171,MB), MCE=mw(MOCE,151,MS);                  /* the cyanoethyl   */
/* the proton comes in straight below the nitrogen, which is where its lone
   pair points and the only lane the two isopropyls leave open */
const MN=mw(P0,90,MB), MNH=mw(MN,90,MS);
const MTET=mw(MNH,145,MS);                                  /* where tetrazole is */

/* the cartoon glyph for the rest of the incoming monomer */
function monoGlyph(){
  return bond(MMON,[MMON[0],MMON[1]-96],INK,3.4)+
         bond([MMON[0],MMON[1]-48],[MMON[0]+32,MMON[1]-48],INK,3.4)+
         '<circle cx="'+(MMON[0]+41)+'" cy="'+(MMON[1]-48)+'" r="9" fill="'+INK+'"/>'+
         txt([MMON[0],MMON[1]-122],"DMT",BLUE,24,"middle",700)+
         txt([MMON[0],MMON[1]-158],"the monomer",MUTED,23);
}
/* the cartoon glyph for the chain the bead is holding */
function chainGlyph(){
  return bond(MC5,MTETH,MUTED,2)+
         '<circle cx="'+MBEAD[0]+'" cy="'+MBEAD[1]+'" r="26" fill="#fff" stroke="'+MUTED+
           '" stroke-width="3"/>'+
         txt([MBEAD[0],MBEAD[1]+7],"CPG",MUTED,16)+
         txt([MBEAD[0],MBEAD[1]+58],"the growing chain",MUTED,23);
}
/* Every bond first, every label second: a label's white halo has to be
   able to punch a hole in ANY bond that reaches it, and a bond drawn
   afterwards would strike straight through the letter.
   o: {bonded:bool, protonated:bool, gone:bool, plus:bool} */
function phosphorus(o){
  let b="", l="";
  /* the 3' oxygen, out to the rest of the monomer */
  b+=bond(P0,MO3)+bond(MO3,MC3)+bond(MC3,MMON,MUTED,2)+monoGlyph();
  l+=lab(MO3,"O");
  /* the cyanoethyl-protected oxygen */
  b+=bond(P0,MOCE)+bond(MOCE,MCE);
  l+=lab(MOCE,"O")+txt([MCE[0]-16,MCE[1]+46],"CH&#8322;CH&#8322;CN",INK,24);
  /* the attacking oxygen's own molecule */
  b+=chainGlyph()+bond(MO,MC5)+bond(MO,MOH);
  if(o.bonded) b+=bond(P0,MO);
  l+=lab(MO,"O")+lab(MOH,"H",INK,29);
  if(o.plus) l+=sign([MO[0]+40,MO[1]+34],"+");
  /* the diisopropylamino group */
  if(!o.gone){
    b+=bond(P0,MN);
    b+=isopropyl(MN,180,null,MS).g+isopropyl(MN,0,null,MS).g;
    if(o.protonated){ b+=bond(MN,MNH); l+=lab(MNH,"H",INK,29)+sign([MN[0]+38,MN[1]-16],"+"); }
    else            { l+=pair(MN,90,INK,36); }
    l+=lab(MN,"N");
  }
  l+=lab(P0,"P",RED,34);
  return b+l;
}

const MECH={
/* ---- 1: tetrazole protonates the amine ---------------------------- */
activate:function(){
  const H=MNH, T=MTET;
  let g=bond(H,T) + phosphorus({protonated:false}) + lab(H,"H",INK,29);
  g+=txt([T[0]-10,T[1]+8],"tetrazole",MUTED,23,"end");
  g+=arrow(pairAt(MN,90,34),[H[0]+2,H[1]-22],32);
  g+=arrow([H[0]+(T[0]-H[0])*0.42, H[1]+(T[1]-H[1])*0.42],
           [T[0]+14,T[1]-8],-32);
  return g;
},
/* ---- 2: the 5' oxygen attacks, the amine leaves -------------------- */
attack:function(){
  let g=phosphorus({protonated:true});
  g+=pair(MO,90,INK,36);
  g+=arrow(pairAt(MO,90,44),[P0[0]-6,P0[1]-46],54);
  g+=arrow(mid(P0,MN),[MN[0],MN[1]-40],44);
  return g;
},
/* ---- 3: a phosphite triester, and the proton goes back ------------- */
product:function(){
  const T=[185,-286];
  let g=phosphorus({bonded:true,gone:true,plus:true});
  g+=txt([0,246],"HN(iPr)&#8322;",INK,26,"middle",700);
  g+=txt([0,282],"diisopropylamine, released",MUTED,23);
  const TP=[T[0]-40,T[1]+8];
  g+=txt(T,"tetrazolide",MUTED,23)+sign([T[0]+74,T[1]-4],"&#8722;",MUTED,24);
  g+=pair(TP,120,MUTED,26);
  g+=arrow(pairAt(TP,120,32),[MOH[0]+28,MOH[1]+6],-24);
  /* out off the O-H bond and back onto the oxygen, the way mechanism.js
     draws the same hand-back: a short span needs a big bow to read */
  g+=arrow([MO[0]+(MOH[0]-MO[0])*0.55, MO[1]+(MOH[1]-MO[1])*0.55],
           [MO[0]+40,MO[1]-34],-62);
  return g;
}};

/* ==================================================================== *
 * THE CARTOON CYCLE.  Same drawing as before, moved right and scaled
 * down to leave the left of the slide to the chemistry.
 * ==================================================================== */
const AX = 960, BX = 1330, TY = 400, BY = 690, NS = 0.86;

/* one node: a bead, a chain of one or two residues, a 5' group */
function node(cx, cy, res, top, tcol, pcol, primes){
  let s = '<g transform="translate('+cx+','+cy+') scale('+NS+')">';
  s += '<g fill="none" stroke="'+INK+'" stroke-width="3.4" stroke-linecap="round">';
  if (res === 1){
    s += '<path d="M0 42V-6"/><path d="M0 18H32"/>';
  } else {
    s += '<path d="M0 42V-2"/><path d="M0 18H32"/>';
    s += '<path d="M0 -30V-70"/><path d="M0 -46H32"/>';
  }
  s += '</g>';
  s += '<circle cx="0" cy="72" r="30" fill="none" stroke="'+MUTED+'" stroke-width="3.4"/>';
  s += '<circle cx="41" cy="18" r="9" fill="'+INK+'"/>';
  if (res === 2){
    s += '<circle cx="41" cy="-46" r="9" fill="'+INK+'"/>';
    s += '<circle cx="0" cy="-16" r="14" fill="#fff" stroke="'+pcol+'" stroke-width="3.4"/>' +
         '<text x="0" y="-9" text-anchor="middle" font-size="18" ' +
           'font-weight="700" fill="'+pcol+'">P</text>';
  }
  s += '<text x="0" y="79" text-anchor="middle" font-size="18" fill="'+MUTED+'">CPG</text>';
  s += '<text x="0" y="'+(res === 1 ? -22 : -86)+'" text-anchor="middle" ' +
         'font-size="24" font-weight="700" fill="'+tcol+'">'+top+'</text>';
  if (primes){
    s += '<text x="-44" y="30" text-anchor="end" font-size="21" ' +
           'fill="'+MUTED+'">3&#8242;</text>' +
         '<text x="-44" y="'+(res === 1 ? -12 : -76)+'" text-anchor="end" ' +
           'font-size="21" fill="'+MUTED+'">5&#8242;</text>';
  }
  return s + '</g>';
}

function cycleArrow(x1, y1, x2, y2){
  const dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx*dx + dy*dy);
  const ux = dx/L, uy = dy/L, px = -uy, py = ux;
  const h = 16, w = 9;
  return "M"+x1+" "+y1+"L"+x2+" "+y2 +
         "M"+(x2 - h*ux + w*px)+" "+(y2 - h*uy + w*py)+"L"+x2+" "+y2 +
         "L"+(x2 - h*ux - w*px)+" "+(y2 - h*uy - w*py);
}

/* ==================================================================== *
 * THE BEATS
 * ==================================================================== */
const STEPS = [

{ show:"mono-ink",
  label:"The monomer the cartoon is standing in for",
  note:"Before the cycle, the molecule. This is one phosphoramidite monomer, drawn properly, and everything the cycle does happens to one of its four parts. On the five prime oxygen, a dimethoxytrityl group: one carbon carrying three rings, two of them with a methoxy out at the far end, and that whole assembly comes off in acid. On carbon one prime, the base, drawn as a block because at this size the honest thing to say is that its exocyclic amines are protected too: benzoyl on A and C, isobutyryl on G, and T needs nothing. The sugar is two prime deoxyribose, and that hydrogen on carbon two prime is the whole difference between this and RNA. Then the part the reaction is named for, on the three prime oxygen: a phosphorus carrying a cyanoethyl-protected oxygen and a diisopropylamino group. Count the bonds on that phosphorus. Three, and no double bond. Hold on to that, because it is the reason this cycle has an oxidation step in it at all.",
  desc:"A full skeletal structure of one DNA phosphoramidite monomer, drawn in black across the slide. At the left, the dimethoxytrityl group: a central carbon bonded to three benzene rings, two of which carry a methoxy oxygen at the para position, with the label 5-prime-O-DMT, acid-labile. That group is joined through an oxygen and a CH2 to carbon 4-prime of a five-membered deoxyribose ring drawn with the ring oxygen at the apex, labelled 2-prime-deoxyribose, with a hydrogen on carbon 2-prime and a block labelled base on carbon 1-prime, noted as having its amines protected. Down from carbon 3-prime, an oxygen leads to a phosphorus that carries two further substituents: an oxygen leading to a cyanoethyl chain ending in a triple-bonded nitrogen, and a nitrogen carrying two isopropyl groups. The region is labelled 3-prime-O-phosphoramidite, three bonds on P, no P equals O." },

{ show:"mono-key",
  label:"Every mark in the cartoon means one of these regions",
  note:"Now the same molecule with the regions coloured, and beside it the marks I am going to use for the rest of the hour. The word DMT stands for that entire trityl group and nothing else, so when a structure on the cycle has DMT on top it means the five prime end is blocked. The filled dot is the base on carbon one prime. The plain lines are the sugar and the backbone, and that is all they are. The circled P in vermillion is this phosphorus, and its colour is doing a job: vermillion means it is still the three-bonded phosphorus you just counted. And the open circle marked CPG is the bead, which is the one glyph that is not on this molecule at all. The monomer is free in solution; the bead is holding the other molecule, the chain that is growing. Two molecules, and the next few beats are about what happens between them.",
  desc:"The same structure, now colour-coded, with a key down the right-hand side under the heading, what the cartoon stands for. The dimethoxytrityl group is drawn in blue and keyed to the word DMT. The base is keyed to a filled black dot, on carbon 1-prime with its amines protected. The sugar and backbone are keyed to plain black lines, 2-prime-deoxyribose, 3-prime to 5-prime. The phosphoramidite is drawn in vermillion and keyed to a vermillion circle marked P, three bonds on P and no double bond. A grey circle marked CPG is keyed to the bead, which holds the chain and is not part of this molecule." },

{ show:"mech-act",
  label:"Coupling, 1 &nbsp;&middot;&nbsp; tetrazole activates the monomer",
  note:"Here are the two molecules, side by side and zoomed in on the only part that reacts. At the upper left, the chain the bead is holding, with its five prime hydroxyl free. At the right, the monomer, hanging off that three prime oxygen. And the catalyst does the first thing: tetrazole is a weak acid, and the nitrogen of the diisopropylamino group has a lone pair, so that lone pair takes the proton. Two arrows, and neither of them is optional bookkeeping: one makes the nitrogen-hydrogen bond, the other puts the electrons of the old bond back on the tetrazole. What you have afterwards is a nitrogen with four bonds and a positive charge, which is the point. A neutral amine is a terrible leaving group. A protonated one is a decent one.",
  desc:"The coupling drawn at the left of the slide as real chemistry. A phosphorus in vermillion carries three bonds: an oxygen to the right leading out to the incoming monomer, drawn as the cartoon glyph with its base dot and DMT label; an oxygen to the left leading to a cyanoethyl group; and a nitrogen below carrying two isopropyl groups. Up and to the left, a separate molecule: the growing chain on its bead, drawn as a grey circle marked CPG, ending in a free 5-prime oxygen with its hydrogen. A curved arrow runs from a lone pair on the amidite nitrogen to a hydrogen held by tetrazole, and a second arrow runs from that hydrogen-tetrazole bond back onto the tetrazole." },

{ show:"mech-att",
  label:"Coupling, 2 &nbsp;&middot;&nbsp; the 5&#8242;-OH attacks, the amine leaves",
  note:"And now the bond you are paying for. The free five prime hydroxyl on the chain comes in at the phosphorus, and the arrow starts where the electrons actually are, on a lone pair of that oxygen. At the same time the protonated nitrogen goes, and that arrow starts on the phosphorus-nitrogen bond and ends on the nitrogen, because the leaving group takes both of those electrons with it. One arrow makes a bond, one arrow breaks a bond, and they are drawn together because the nucleophile comes in on the axis opposite the group that is leaving. That is the same geometry you saw for every phosphoryl transfer in the enzymes lecture. The difference here is only that a chemist, not an enzyme, is holding the substrates still.",
  desc:"The same two molecules, with the amidite nitrogen now protonated and carrying a plus sign. Two curved arrows: one from a lone pair on the chain's 5-prime oxygen to the phosphorus, coming in on the axis opposite the nitrogen, and one from the phosphorus-nitrogen bond onto the nitrogen itself." },

{ show:"mech-prod",
  label:"Coupling, 3 &nbsp;&middot;&nbsp; a phosphite triester: three oxygens, no double bond",
  note:"There is the product, and there are the pieces. Diisopropylamine leaves as a neutral amine, taking back the proton tetrazole gave it. The oxygen that attacked is briefly holding three bonds, so it is positive, and tetrazolide takes that proton straight back off it, which regenerates the tetrazole you started with. Follow it through and the catalyst is exactly where it began. What is left is the linkage: count the oxygens on that phosphorus. Three, and no double bond anywhere on it. That is not the bond DNA has. It is a phosphite triester, and it is why the very next thing the cycle does is throw iodine and water at it.",
  desc:"The product. The phosphorus is now bonded to three oxygens, with no double bond: the 3-prime oxygen of the monomer, the cyanoethyl oxygen, and the 5-prime oxygen of the chain that attacked. That attacking oxygen carries a plus sign and still holds its hydrogen, and a curved arrow runs from a lone pair on tetrazolide to that hydrogen, with a second arrow from the oxygen-hydrogen bond back onto the oxygen. Below, detached, the released diisopropylamine." },

/* ---- the five cycle beats, notes verbatim from the source deck ----- */
{ show:"cycle", node:"A1", arrow:null,
  label:"a single base on the column, 5&#8242; blocked",
  note:"Regardless of the downstream processing steps and final format, gene synthesis begins with phosphoramidite chemistry.  Companies such as Glen Research sell controlled-pore-glass, or CPG columns covalently attached to a single DNA base via the 3’ hydroxyl.  Solid-phase oligonucleotide synthesis begins with one of these columns chosen based on the desired 3’ end of the oligo being synthesized.  These bases are protected on the 5’ end with a trityl group, and several positions on the nucleobase are similar blocked to avoid side reactions. These bases initiate the formation of the oligonucleotide through cycles of reactions.",
  desc:"The coupling mechanism stays at the left for the rest of the slide, and the cartoon cycle appears at the right: four reactions drawn as a ring, labelled deblocking, coupling, oxidation and capping. At the top left of the ring, the starting material: a bead of controlled-pore glass holding one nucleotide by its 3-prime end, with a trityl group blocking the 5-prime end above it." },

{ show:"cycle", node:"B", arrow:"ab",
  label:"deblocking: acid takes the trityl off, leaving a free 5&#8242;-OH",
  note:"In the deblocking step, the column is treated with a strong acid to remove the trityl group.",
  desc:"The first arrow lights up. Acid removes the trityl group, and the second structure appears at the top right of the ring: the same bead and base, now with a bare 5-prime hydroxyl." },

{ show:"cycle", node:"C", arrow:"bc",
  label:"coupling: the next phosphoramidite joins, P carries only 3 oxygens",
  note:"The column is then washed with the next phosphoramidite that will be joined to the growing chain along with a catalyst.  This coupling step creates the bond between the backbone phosphate and the 5’ hydroxyl.  Note that there are only 3 oxygens on this phosphorus atom: it is in a different oxidation state than the phosphate in the desired DNA.",
  desc:"The incoming phosphoramidite is drawn to the right of the ring, itself trityl-blocked. With tetrazole as the catalyst it joins the free hydroxyl, and the chain on the bead is now two residues long, joined by a phosphorus marked in vermillion because it carries only three oxygens. This is the step the mechanism at the left is drawing." },

{ show:"cycle", node:"D", arrow:"cd",
  label:"oxidation: iodine and water make it a phosphate",
  note:"In the next step of the cycle, the phosphate is oxidized with iodine to generate the phosphate.",
  desc:"Iodine and water oxidize that phosphorus, and the linkage at the bottom right of the ring turns black: a normal phosphate, the backbone bond that belongs in DNA." },

{ show:"cycle", node:"A2", arrow:"da",
  label:"capping: acetic anhydride kills the chains that missed",
  note:"Finally, the column is capped with acetic anhydride to terminate any chains that did not receive the added base. At the end of the synthesis, the oligonucleotides are full-length but are immobilized on the column and contain multiple protecting groups.  These linkages are broken by treatment with methylamine and ammonium hydroxide.  Upon purification, a structurally-normal synthetic DNA is obtained.",
  desc:"Acetic anhydride caps every chain that failed to couple, drawn as a short dead chain inside the ring and out of the run, and the cycle closes. The starting structure is back with the chain one base longer and blocked again, ready for the next round." }
];

window.Deck.sequence("gs-amidite", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");

  let h = '<defs><marker id="gsAmdHead" viewBox="0 0 12 12" refX="10" refY="6" ' +
            'markerWidth="7" markerHeight="7" orient="auto">' +
            '<path d="M0 0L12 6L0 12z" fill="'+RED+'"/></marker></defs>' +
          '<g font-family="Helvetica Neue,Arial,Helvetica,sans-serif">';

  /* ---- the real monomer, twice: bare, then keyed ---- */
  h += '<g data-r="mono-ink" transform="translate(630,514) scale(0.81)">' +
       monomer(false) + '</g>';
  h += '<g data-r="mono-key" opacity="0" transform="translate(630,514) scale(0.81)">' +
       monomer(true) + '</g>';
  h += '<g data-r="key" opacity="0">' + keyPanel() + '</g>';

  /* ---- the coupling, three frames in the same place ---- */
  h += '<text data-r="mech-hd" x="455" y="268" text-anchor="middle" font-size="24" ' +
         'font-weight="700" fill="'+BLUE+'" opacity="0">The coupling step, atom by atom</text>';
  ["act","att","prod"].forEach(function(k,j){
    h += '<g data-r="mech-'+k+'" opacity="0" transform="translate(434,548) scale(0.82)">' +
         [MECH.activate,MECH.attack,MECH.product][j]() + '</g>';
  });

  /* ================= the cartoon cycle ================= */
  h += '<g data-r="cycle" opacity="0">';

  /* the ring */
  h += '<g fill="none" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">' +
       '<path data-r="ab" d="'+cycleArrow(1030, TY, 1250, TY)+'"/>' +
       '<path data-r="bc" d="'+cycleArrow(1430, 505, 1430, 585)+'"/>' +
       '<path data-r="cd" d="'+cycleArrow(1250, BY, 1030, BY)+'"/>' +
       '<path data-r="da" d="'+cycleArrow(860, 585, 860, 505)+'"/>' +
       '</g>';

  /* the four reaction names, always up; the reagents only when acting */
  h += '<text data-r="n-ab" x="1140" y="326" text-anchor="middle" font-size="26" ' +
         'font-weight="700" fill="'+MUTED+'">Deblocking</text>' +
       '<text data-r="r-ab" x="1140" y="360" text-anchor="middle" font-size="21" ' +
         'fill="'+BLUE+'" opacity="0">strong acid, H&#8314;</text>' +
       '<text data-r="n-bc" x="1430" y="480" text-anchor="middle" font-size="26" ' +
         'font-weight="700" fill="'+MUTED+'">Coupling</text>' +
       '<text data-r="r-bc" x="1430" y="620" text-anchor="middle" font-size="21" ' +
         'fill="'+BLUE+'" opacity="0">+ tetrazole</text>' +
       '<text data-r="n-cd" x="1140" y="742" text-anchor="middle" font-size="26" ' +
         'font-weight="700" fill="'+MUTED+'">Oxidation</text>' +
       '<text data-r="r-cd" x="1140" y="776" text-anchor="middle" font-size="21" ' +
         'fill="'+BLUE+'" opacity="0">I&#8322;, H&#8322;O</text>' +
       '<text data-r="n-da" x="855" y="480" text-anchor="middle" font-size="26" ' +
         'font-weight="700" fill="'+MUTED+'">Capping</text>' +
       '<text data-r="r-da" x="838" y="620" text-anchor="middle" font-size="19" ' +
         'fill="'+BLUE+'" opacity="0">acetic anhydride</text>';

  /* the structures */
  h += '<g data-r="A1">' + node(AX, TY, 1, "DMT", BLUE, INK, true) + '</g>';
  h += '<g data-r="A2" opacity="0">' + node(AX, TY, 2, "DMT", BLUE, INK, true) + '</g>';
  h += '<g data-r="B" opacity="0">' + node(BX, TY, 1, "HO", INK, INK, false) + '</g>';
  h += '<g data-r="C" opacity="0">' + node(BX, BY, 2, "DMT", BLUE, RED, false) + '</g>';
  h += '<g data-r="D" opacity="0">' + node(AX, BY, 2, "DMT", BLUE, INK, false) + '</g>';

  /* the incoming monomer, out to the top right of the ring */
  h += '<g data-r="mono" opacity="0">' +
       '<g fill="none" stroke="'+INK+'" stroke-width="3.4" stroke-linecap="round">' +
         '<path d="M1440 372V316"/><path d="M1440 348H1472"/>' +
       '</g>' +
       '<circle cx="1481" cy="348" r="9" fill="'+INK+'"/>' +
       '<circle cx="1440" cy="386" r="14" fill="#fff" stroke="'+RED+'" stroke-width="3.4"/>' +
       '<text x="1440" y="393" text-anchor="middle" font-size="18" font-weight="700" ' +
         'fill="'+RED+'">P</text>' +
       '<text x="1440" y="300" text-anchor="middle" font-size="22" font-weight="700" ' +
         'fill="'+BLUE+'">DMT</text>' +
       '<text x="1440" y="268" text-anchor="middle" font-size="20" fill="'+MUTED+
         '">monomer</text>' +
       '</g>';

  /* the chain that missed its base, capped and out of the run */
  h += '<g data-r="dead" opacity="0">' +
       '<g fill="none" stroke="'+MUTED+'" stroke-width="3" stroke-linecap="round">' +
         '<circle cx="1140" cy="578" r="24"/><path d="M1140 554V500"/>' +
         '<path d="M1140 530H1166"/>' +
       '</g>' +
       '<circle cx="1175" cy="530" r="8" fill="'+MUTED+'"/>' +
       '<text x="1140" y="584" text-anchor="middle" font-size="16" fill="'+MUTED+'">CPG</text>' +
       '<text x="1140" y="480" text-anchor="middle" font-size="20" font-weight="700" ' +
         'fill="'+MUTED+'">Ac</text>' +
       '<text x="1140" y="626" text-anchor="middle" font-size="18" fill="'+MUTED+
         '">capped, out of the run</text>' +
       '</g>';

  /* what each structure is */
  h += '<text x="'+AX+'" y="530" text-anchor="middle" font-size="22" fill="'+MUTED+
         '">5&#8242; blocked</text>' +
       '<text data-r="lB" x="'+BX+'" y="530" text-anchor="middle" font-size="22" ' +
         'fill="'+MUTED+'" opacity="0">free 5&#8242;-OH</text>' +
       '<text data-r="lC" x="'+BX+'" y="812" text-anchor="middle" font-size="22" ' +
         'fill="'+MUTED+'" opacity="0">phosphite: 3 oxygens on P</text>' +
       '<text data-r="lD" x="'+AX+'" y="812" text-anchor="middle" font-size="22" ' +
         'fill="'+MUTED+'" opacity="0">phosphate: the bond DNA has</text>';

  h += '</g>';   /* end of the cycle */

  h += '<text data-r="cap" x="800" y="214" text-anchor="middle" font-size="30" ' +
         'font-weight="700" fill="'+INK+'"></text>';

  h += '</g>';
  svg.innerHTML = h;
  slide.appendChild(svg);

  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);

  const ARROWS = ["ab", "bc", "cd", "da"];
  const SHOWN = {
    "mono-ink":[0], "mono-key":[1], key:[1,2,3,4],
    "mech-act":[2], "mech-att":[3,5,6,7,8,9], "mech-prod":[4],
    "mech-hd":[2,3,4,5,6,7,8,9],
    cycle:[5,6,7,8,9],
    A1:[5,6,7,8], A2:[9], B:[6,7,8,9], C:[7,8,9], D:[8,9],
    mono:[7], dead:[9], lB:[6,7,8,9], lC:[7,8,9], lD:[8,9]
  };

  function go(i, animated){
    const soft = animated !== false && !reduce.matches;
    Object.keys(SHOWN).forEach(function(k){
      const el = r[k];
      el.style.transition = soft ? "opacity .34s ease" : "none";
      el.style.opacity = SHOWN[k].indexOf(i) >= 0 ? "1" : "0";
    });
    ARROWS.forEach(function(a){
      const live = STEPS[i].arrow === a;
      r[a].setAttribute("stroke", live ? BLUE : MUTED);
      r[a].setAttribute("stroke-width", live ? "4.6" : "3");
      r[a].setAttribute("opacity", live ? "1" : "0.45");
      r["n-"+a].setAttribute("fill", live ? BLUE : MUTED);
      r["r-"+a].setAttribute("opacity", live ? "1" : "0");
    });
    r.cap.innerHTML = STEPS[i].label;
  }

  go(0, false);
  return { steps: STEPS.map(x => ({ note:x.note, desc:x.desc })), go: go };
});

})();
