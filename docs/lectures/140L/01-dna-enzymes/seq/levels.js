/* ------------------------------------------------------------------ *
 * levels.js — the core reaction, 5'->3' extension, shown at the three
 * levels of iconography this lecture (and the literature) moves between.
 *
 *   1. atoms   the actual chemistry: the 3'-OH attacks the alpha
 *              phosphate, pyrophosphate leaves
 *   2. letters bases as characters — used wherever a POSITION matters
 *   3. line    a barbed line — used wherever only topology matters
 *
 * The point of the slide is that these are the SAME EVENT. Nearly every
 * later diagram in the deck is level 3; this is what it stands for.
 *
 * Ring geometry is a schematic: the base hangs off C1', the 3'-O off
 * C3' and the 5' carbon off C4', which is the connectivity that matters,
 * drawn so the chain reads 5'->3' left to right.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", SLATE = "#004373", RED = "#ba3a13", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";
const n2 = v => Math.round(v*10)/10;

/* pentagon vertices, clockwise from the top (ring O) */
const V = [-90, -18, 54, 126, 198];
const vx = (c, r, i) => [c.x + r*Math.cos(V[i]*Math.PI/180),
                         c.y + r*Math.sin(V[i]*Math.PI/180)];

function pentagon(c, r){
  return V.map((_, i) => (i ? "L" : "M") + vx(c,r,i).map(n2).join(" ")).join("") + "Z";
}
function bond(a, b, w, col){
  return '<path d="M'+n2(a[0])+' '+n2(a[1])+'L'+n2(b[0])+' '+n2(b[1])+'" fill="none" stroke="' +
         (col||INK)+'" stroke-width="'+(w||2.6)+'" stroke-linecap="round"/>';
}
function P(x, y, tag){
  return '<circle cx="'+x+'" cy="'+y+'" r="22" fill="#fff" stroke="'+INK+'" stroke-width="2.6"/>' +
         '<text x="'+x+'" y="'+(y+9)+'" text-anchor="middle" font-size="24" font-weight="700" ' +
           'fill="'+INK+'">P</text>' +
         (tag ? '<text x="'+x+'" y="'+(y+52)+'" text-anchor="middle" font-size="22" ' +
                'font-style="italic" fill="'+MUTED+'">'+tag+'</text>' : '');
}
function O(x, y){                       /* a bridging oxygen, knocked out of its bond */
  return '<circle cx="'+x+'" cy="'+y+'" r="15" fill="#fff"/>' +
         '<text x="'+x+'" y="'+(y+9)+'" text-anchor="middle" font-size="24" fill="'+INK+'">O</text>';
}
function baseBox(x, y){                 /* x = left edge, y = centre */
  return '<rect x="'+x+'" y="'+(y-29)+'" width="122" height="58" rx="13" fill="#fff" ' +
           'stroke="'+INK+'" stroke-width="2.6"/>' +
         '<text x="'+(x+61)+'" y="'+(y+9)+'" text-anchor="middle" font-size="25" ' +
           'fill="'+MUTED+'">base</text>';
}

/* ------------------------------------------------------- level 1 */
const R  = 50;
const S1 = {x:470, y:400}, S2 = {x:1010, y:400};
const OH = {x:582, y:496};
const PA = {x:826, y:622}, PB = {x:686, y:622}, PG = {x:546, y:622};
const BR = {x:900, y:505};              /* the 5' bridging oxygen */

function level1(){
  let g = '<g data-r="L1" opacity="0">';

  /* ---- the two sugars, their bases, and the primer running off left */
  g += '<g fill="none" stroke="'+INK+'" stroke-width="2.6" stroke-linejoin="round">' +
         '<path d="'+pentagon(S1,R)+'"/><path d="'+pentagon(S2,R)+'"/></g>';
  g += bond(vx(S1,R,1), [600, 350]) + baseBox(600, 350);
  g += bond(vx(S2,R,1), [1140, 350]) + baseBox(1140, 350);
  g += bond(vx(S1,R,4), [352, 350]);
  g += '<text x="330" y="342" text-anchor="end" font-size="23" fill="'+MUTED+'">5&#8242;&#8230;</text>';

  /* ---- the primer's free 3' hydroxyl: the nucleophile */
  g += bond(vx(S1,R,2), [OH.x-24, OH.y-16]);
  g += '<text x="'+OH.x+'" y="'+(OH.y+9)+'" font-size="26" font-weight="700" fill="'+RED+'">OH</text>';
  g += '<text x="'+(OH.x+2)+'" y="'+(OH.y-26)+'" font-size="21" fill="'+RED+'">3&#8242;</text>';

  /* ---- the incoming dNTP: 5'-O, then the alpha, beta and gamma phosphates */
  g += bond(vx(S2,R,4), [BR.x, BR.y]) + bond([BR.x, BR.y], [PA.x+16, PA.y-16]);
  g += O(BR.x, BR.y);
  g += '<text x="'+(BR.x+30)+'" y="'+(BR.y-16)+'" font-size="21" fill="'+MUTED+'">5&#8242;</text>';
  g += '<g data-r="ppi_l">' + bond([PA.x-22, PA.y], [PB.x+22, PB.y]) + O(756, PA.y) + '</g>';
  g += P(PA.x, PA.y, "&#945;");
  g += '<g data-r="ppi">' +
         bond([PB.x-22, PB.y], [PG.x+22, PG.y]) + O(616, PA.y) +
         P(PB.x, PB.y, "&#946;") + P(PG.x, PG.y, "&#947;") +
       '</g>';

  /* ---- the attack, and the bond it leaves behind */
  g += '<path data-r="attack" fill="none" stroke="'+RED+'" stroke-width="3.4" ' +
         'marker-end="url(#lvArrow)" d="M'+(OH.x+34)+' '+(OH.y+18)+
         'Q'+(OH.x+164)+' '+(OH.y+2)+' '+(PA.x-20)+' '+(PA.y-22)+'"/>';
  g += '<path data-r="newbond" fill="none" stroke="'+RED+'" stroke-width="4.4" opacity="0" ' +
         'stroke-linecap="round" d="M'+(OH.x+42)+' '+(OH.y+8)+'L'+(PA.x-20)+' '+(PA.y-14)+'"/>';

  /* ---- who is who */
  g += '<g font-size="24" font-weight="700" text-anchor="middle" fill="'+SLATE+'">' +
         '<text x="490" y="306">primer 3&#8242; end</text>' +
         '<text x="1040" y="306">incoming dNTP</text></g>';
  g += '<text data-r="ppilab" x="396" y="744" text-anchor="end" font-size="24" ' +
         'font-weight="700" opacity="0" fill="'+MUTED+'">pyrophosphate</text>';
  return g + '</g>';
}

/* ------------------------------------------------- levels 2 and 3 */
const LT = "GCATTG", LB = "CGTAAC";
const LX = 615, LSTEP = 92, LY = 500, LY2 = 600;

function level2(){
  let g = '<g data-r="L2" opacity="0" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" ' +
          'font-size="52" font-weight="600" text-anchor="middle">';
  for (let i = 0; i < LT.length; i++){
    const last = i === LT.length - 1;
    g += '<text'+(last?' data-r="l2_new"':'')+' x="'+(LX+i*LSTEP)+'" y="'+LY+'" fill="' +
         (last?RED:SLATE)+'">'+LT[i]+'</text>' +
         '<text x="'+(LX+i*LSTEP)+'" y="'+LY2+'" fill="'+INK+'">'+LB[i]+'</text>';
  }
  const xe = LX + (LT.length-1)*LSTEP;
  g += '<g font-family="inherit" font-size="28" fill="'+MUTED+'">' +
         '<text x="'+(LX-92)+'" y="'+LY+'">5&#8242;</text>' +
         '<text x="'+(LX-92)+'" y="'+LY2+'">3&#8242;</text>' +
         '<text x="'+(xe+92)+'" y="'+LY+'">3&#8242;</text>' +
         '<text x="'+(xe+92)+'" y="'+LY2+'">5&#8242;</text></g>';
  return g + '</g>';
}

function level3(){
  const x0 = LX - 46, x1 = LX + (LT.length-1)*LSTEP + 46, y1 = LY - 16, y2 = LY2 - 16, B = 34;
  return '<g data-r="L3" opacity="0" fill="none" stroke-width="4.6" stroke-linecap="round">' +
    '<g stroke="'+SLATE+'"><path d="M'+(x0-56)+' '+y1+'H'+x1+'"/>' +
      '<path d="M'+(x1-B)+' '+(y1-17)+'L'+x1+' '+y1+'"/></g>' +
    '<g stroke="'+INK+'"><path d="M'+(x1+56)+' '+y2+'H'+(x0-56)+'"/>' +
      '<path d="M'+(x0-56+B)+' '+(y2+17)+'L'+(x0-56)+' '+y2+'"/></g>' +
  '</g>';
}

/* ------------------------------------------------------- sequence */
window.Deck.sequence("levels", function(slide){
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");
  svg.innerHTML =
    '<defs><marker id="lvArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" ' +
      'markerHeight="6" orient="auto-start-reverse">' +
      '<path d="M0 0L10 5L0 10" fill="none" stroke="'+RED+'" stroke-width="2"/></marker></defs>' +
    level1() + level2() + level3() +
    '<text data-r="cap" x="800" y="252" text-anchor="middle" font-family="inherit" ' +
      'font-weight="700" font-size="31" fill="'+INK+'"></text>' +
    '<text data-r="sub" x="800" y="812" text-anchor="middle" font-family="inherit" ' +
      'font-size="26" fill="'+MUTED+'"></text>';
  slide.appendChild(svg);
  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const KEYS = ["l1","l2","l3","bond","ppi"];
  let cur = null, raf = null;

  function paint(s){
    r.L1.setAttribute("opacity", n2(s.l1));
    r.L2.setAttribute("opacity", n2(s.l2));
    r.L3.setAttribute("opacity", n2(s.l3));
    r.attack .setAttribute("opacity", n2(1 - s.bond));
    r.newbond.setAttribute("opacity", n2(s.bond));
    r.l2_new .setAttribute("opacity", n2(s.l2));
    /* pyrophosphate leaves once the bond is made, and names itself on the way out */
    r.ppi_l .setAttribute("opacity", n2(1 - s.ppi));
    r.ppi   .setAttribute("opacity", n2(1 - 0.45*s.ppi));
    r.ppi   .setAttribute("transform", "translate(" + n2(-96*s.ppi) + " " + n2(112*s.ppi) + ")");
    r.ppilab.setAttribute("opacity", n2(s.ppi));
  }

  const S = [
    { s:{l1:1,l2:0,l3:0,bond:0,ppi:0}, cap:"1 · atoms",
      sub:"the primer's 3′ hydroxyl attacks the α phosphate of the incoming dNTP",
      note:"Every base a polymerase adds is one phosphodiester bond, and this is it. The free 3-prime hydroxyl on the primer is the nucleophile. It attacks the alpha phosphate of the incoming dNTP. Notice what that means: the growing end is a 3-prime hydroxyl, so synthesis can only ever run five prime to three prime. There is no chemistry here for going the other way.",
      desc:"A skeletal chemical drawing. On the left, the primer's last sugar ring with its base, ending in a red 3-prime hydroxyl. On the right, the incoming nucleotide's sugar and base, its 5-prime oxygen leading down to a chain of three phosphates labelled alpha, beta and gamma. A red curved arrow runs from the hydroxyl to the alpha phosphate." },
    { s:{l1:1,l2:0,l3:0,bond:1,ppi:1}, cap:"1 · atoms",
      sub:"the bond forms; pyrophosphate leaves, and is hydrolysed",
      note:"The bond forms, and the beta and gamma phosphates leave together as pyrophosphate. Hydrolysing that pyrophosphate is what pulls the reaction forward and makes it effectively irreversible. That is the whole reason the substrate is a triphosphate and not a monophosphate — you are paying for the bond with the two phosphates you throw away.",
      desc:"The bond has formed between the 3-prime oxygen and the alpha phosphate, drawn in red. The beta and gamma phosphates have moved away together, labelled pyrophosphate." },
    { s:{l1:0,l2:1,l3:0,bond:1,ppi:1}, cap:"2 · letters",
      sub:"the same event — one base added at the 3′ end",
      note:"Same event, drawn as letters. Every one of those characters is a sugar, a phosphate and a base, and the join between any two of them is the bond you just watched form. Use this level whenever a position matters — a start site, a mismatch, a recognition sequence.",
      desc:"The same reaction redrawn as sequence: a short duplex written as paired letters, five prime to three prime, with the newest base at the 3-prime end of the top strand picked out in red." },
    { s:{l1:0,l2:0,l3:1,bond:1,ppi:1}, cap:"3 · a line",
      sub:"the same event — and this is what the rest of the lecture draws",
      note:"And the same event again as a barbed line, which is what almost every diagram from here on uses. It carries direction and topology and nothing else. That is a feature, not laziness — but remember that each little step along that line is the chemistry from the first drawing.",
      desc:"The same reaction reduced to two antiparallel barbed lines, one per strand, the barb marking each 3-prime end. This is the level of abstraction used for the rest of the lecture." }
  ];

  function go(i, animated){
    const to = S[i].s;
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    r.cap.textContent = S[i].cap;
    r.sub.textContent = S[i].sub;
    if (!cur || animated === false || reduce.matches){ cur = Object.assign({}, to); paint(cur); return; }
    const from = Object.assign({}, cur), t0 = performance.now(), dur = 800;
    const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1, (now-t0)/dur), e = ease(t), s = {};
      KEYS.forEach(k => s[k] = from[k] + (to[k]-from[k])*e);
      paint(s); cur = s;
      if (t < 1) raf = requestAnimationFrame(f); else raf = null;
    });
  }
  go(0, false);
  return { steps: S.map(x => ({ note:x.note, desc:x.desc })), go: go };
});
})();
