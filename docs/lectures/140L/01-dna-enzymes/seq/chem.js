/* ------------------------------------------------------------------ *
 * chem.js — THE dinucleotide.  One drawing, used by every slide that
 * asks a question about a bond, so the molecule a student sees in the
 * endonuclease section is literally the same molecule as in the ligase
 * and kinase sections.  Slides do not redraw it; they annotate it.
 *
 * Drawn as proper skeletal chemistry:
 *   - furanose rings at real pentagon geometry, O4' at the apex
 *   - the phosphate carries an explicit P=O DOUBLE BOND (two lines) and
 *     a formal negative charge on the other non-bridging oxygen
 *   - bonds meet at chemical angles, not convenient ones
 *   - a wedge means stereochemistry and is therefore NOT used for P=O
 *
 * window.CHEM.draw()  -> svg markup for the molecule
 * window.CHEM.A       -> named anchors, so a slide can ring the answer:
 *                        scissile  the 3'O-P bond a nuclease breaks
 *                        p5        the 5' phosphate a kinase installs
 *                        o3        the free 3' hydroxyl
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const INK="#111111", MUTED="#767676";
const n2=v=>Math.round(v*10)/10;
const R=66;
/* furanose vertices, O4' at the apex: angles 90,18,-54,-126,162 */
function ring(cx,cy){
  const a=[90,18,-54,-126,162].map(d=>d*Math.PI/180);
  return a.map(t=>[cx+R*Math.cos(t), cy-R*Math.sin(t)]);
}
const S1=[430,430], S2=[1210,430];
const r1=ring(S1[0],S1[1]), r2=ring(S2[0],S2[1]);
/* [O4', C1', C2', C3', C4'] */
const P=[820,672], PO=[820,556], PN=[820,788];
const O3=[560,566], O5=[1010,590], C5=[1104,494];
const C5a=[r1[4][0]-88,r1[4][1]-58], O5a=[C5a[0]-84,C5a[1]+34];   /* free 5' end */
const O3b=[r2[3][0]+6,r2[3][1]+92];                                /* free 3' end */

function bond(a,b,w){
  return '<path d="M'+n2(a[0])+' '+n2(a[1])+'L'+n2(b[0])+' '+n2(b[1])+
         '" fill="none" stroke="'+INK+'" stroke-width="'+(w||3)+'" stroke-linecap="round"/>';
}
/* a true double bond: two parallel lines, offset perpendicular to the bond */
function dbl(a,b,gapA,gapB){
  const dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy);
  const ux=dx/L, uy=dy/L, nx=-uy*6, ny=ux*6;
  const p=[a[0]+ux*(gapA||0), a[1]+uy*(gapA||0)], q=[b[0]-ux*(gapB||0), b[1]-uy*(gapB||0)];
  return bond([p[0]+nx,p[1]+ny],[q[0]+nx,q[1]+ny]) + bond([p[0]-nx,p[1]-ny],[q[0]-nx,q[1]-ny]);
}
function lab(p,t,dx,dy,col,sz){
  return '<text x="'+n2(p[0]+(dx||0))+'" y="'+n2(p[1]+(dy||0))+'" text-anchor="middle" '+
         'font-size="'+(sz||27)+'" font-weight="600" fill="'+(col||INK)+'">'+t+'</text>';
}
/* shorten a bond so it stops clear of an atom label */
function to(a,b,g){
  const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);
  return [b[0]-dx/L*g, b[1]-dy/L*g];
}

function draw(){
  let g='<g>';
  /* the two sugars */
  /* v = [O4', C1', C2', C3', C4'].  Three C-C bonds drawn full length, and the
     two C-O bonds stopped short so the ring oxygen's label has room. */
  [r1,r2].forEach(function(v){
    g+=bond(v[1],v[2]) + bond(v[2],v[3]) + bond(v[3],v[4]);
    g+=bond(v[1], to(v[1],v[0],24)) + bond(v[4], to(v[4],v[0],24));
    g+=lab(v[0],"O",0,9);
  });
  /* bases, drawn at the level this figure is about: the backbone */
  g+=bond(r1[1], to(r1[1],[r1[1][0]+96,r1[1][1]-74],26)) + lab([r1[1][0]+120,r1[1][1]-84],"base",0,0,MUTED,25);
  g+=bond(r2[1], to(r2[1],[r2[1][0]+96,r2[1][1]-74],26)) + lab([r2[1][0]+120,r2[1][1]-84],"base",0,0,MUTED,25);
  /* 2' deoxy — the H that makes this DNA and not RNA */
  g+=bond(r1[2], to(r1[2],[r1[2][0]+2,r1[2][1]+44],18)) + lab([r1[2][0]+2,r1[2][1]+62],"H",0,0,MUTED,24);
  g+=bond(r2[2], to(r2[2],[r2[2][0]+2,r2[2][1]+44],18)) + lab([r2[2][0]+2,r2[2][1]+62],"H",0,0,MUTED,24);

  /* 5' end of the left sugar: a free hydroxyl */
  g+=bond(r1[4],C5a)+bond(C5a,to(C5a,O5a,26))+lab(O5a,"HO",0,9);
  g+=lab([O5a[0]-6,O5a[1]-34],"5&#8242;",0,0,MUTED,22);

  /* the phosphodiester: 3'O -> P -> 5'O */
  g+=bond(r1[3], to(r1[3],O3,24)) + lab(O3,"O",0,9);
  g+=bond(to(O3,P,24), to(P,O3,26));
  g+=lab(P,"P",0,11,INK,31);
  g+=dbl(P,PO,30,26) + lab(PO,"O",0,9);                 /* explicit double bond */
  g+=bond(to(P,PN,30), to(PN,P,26)) + lab(PN,"O",-10,9) +
     '<text x="'+(PN[0]+16)+'" y="'+(PN[1]-4)+'" font-size="20" fill="'+INK+'">&#8722;</text>';
  g+=bond(to(P,O5,30), to(O5,P,24)) + lab(O5,"O",0,9);
  g+=bond(to(C5,O5,24), C5) + bond(C5, r2[4]);
  g+=lab([O3[0]-6,O3[1]-36],"3&#8242;",0,0,MUTED,22);
  g+=lab([O5[0]+2,O5[1]+44],"5&#8242;",0,0,MUTED,22);

  /* 3' end of the right sugar: a free hydroxyl */
  g+=bond(r2[3], to(r2[3],O3b,26)) + lab(O3b,"OH",0,9);
  g+=lab([O3b[0]-52,O3b[1]-4],"3&#8242;",0,0,MUTED,22);
  return g+'</g>';
}

window.CHEM={
  draw: draw,
  /* what a slide can ring, and where */
  A:{
    scissile:{ x:(O3[0]+P[0])/2-14, y:(O3[1]+P[1])/2+2, rx:88, ry:54, rot:18 },
    p5:      { x:(P[0]+O5[0])/2,   y:(P[1]+O5[1])/2,   rx:104, ry:62, rot:-16 },
    phos:    { x:P[0], y:P[1], rx:96, ry:104, rot:0 },
    o3:      { x:O3b[0], y:O3b[1], rx:82, ry:56, rot:0 },
    p5end:   { x:O5a[0], y:O5a[1], rx:86, ry:56, rot:0 }
  }
};
})();
