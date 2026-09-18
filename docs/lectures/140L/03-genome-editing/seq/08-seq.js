/* ------------------------------------------------------------------ *
 * 08-seq.js — cycle sequencing, run rather than diagrammed.
 *
 * JCA: "Sequencing needs to be animated instead of what we got."  What
 * we had was three borrowed rasters: a ddNTP, a cartoon of the product
 * population, and somebody else's electropherogram.  Three pictures of
 * three different things, and nothing connecting them, which is exactly
 * the connection the method is.
 *
 * So it is one molecule, followed the whole way: an oligo anneals, a
 * polymerase extends it, a dideoxy base lands and the chain stops dead,
 * the strand comes off, that happens a few million times at every
 * position, the population is separated by length, and each terminator
 * is read by its dye as it comes past.  The trace is drawn as it is
 * measured, which is the part a still picture cannot say at all.
 *
 * COLOURS ARE THE POINT, so the four bases get the four palette inks:
 * A amber, C blue, G ink, T vermillion.  Not the instrument's own green
 * and red -- there is no green in this deck, and red/green is the worst
 * possible pair to put a whole lecture's meaning into.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;
const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);

function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 3,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return G.el("path", a);
}
function grp(o){ return G.el("g", {opacity:n1(cl(o, 0, 1))}); }
/* G.text has no opacity argument and one is wanted per letter here */
function txt(x, y, str, size, col, weight, anchor, op){
  const t = G.text(x, y, str, size, col, weight, anchor);
  if (op != null && op < 0.995) t.setAttribute("opacity", n1(cl(op, 0, 1)));
  return t;
}
/* a 3' end gets a half barb on the OUTER side of the duplex */
function barb(x, y, dir, col, side){
  return path("M"+n1(x - dir*20)+" "+n1(y + (side||-1)*12)+"L"+n1(x)+" "+n1(y),
    col || C.ink, 3);
}

/* ------------------------------------------------------------------ *
 * The molecule.  One primer, one template, one run of extension, and
 * the six lengths the ladder is made of.
 * ------------------------------------------------------------------ */
const NEW  = "GTAAAACGACGTCAGTACG";          /* 5' -> 3', left to right */
const TMPL = "CATTTTGCTGCAGTCATGC";          /* 3' -> 5', antiparallel  */
const PRIM = 7;                              /* the oligo you supplied  */
const RUN  = 13;                             /* where this one stopped  */
const STOPS = [13, 14, 15, 16, 17, 18];      /* the six products        */

const BASE = {A:C.amber, C:C.blue, G:C.ink, T:C.verm};
const X0 = 250, PITCH = 42;
const at = i => X0 + i*PITCH;
const NY = 236, NL = 272, TL = 330, TY = 352;    /* the four rows */

/* ------------------------------------------------------------------ *
 * The chip.  Every terminated 3' end in this animation is drawn as one,
 * and the callout on beat three is a real ddNTP with an arrow to it, so
 * the icon is anchored to a structure rather than standing in for one.
 * Three features, and all three are in the structure: the letter is the
 * base, the filled circle is the dye, the bar across the right-hand end
 * is the missing 3' hydroxyl -- the chain stops there.
 * ------------------------------------------------------------------ */
function chip(x, y, letter, o){
  const col = BASE[letter], g = grp(o == null ? 1 : o);
  g.appendChild(G.el("rect", {x:n1(x-17), y:n1(y-21), width:34, height:42, rx:7,
    fill:col, "fill-opacity":".16", stroke:col, "stroke-width":2.4}));
  g.appendChild(G.text(x, y + 9, letter, 25, col, 700));
  g.appendChild(path("M"+n1(x+17)+" "+n1(y-21)+"V"+n1(y+21), col, 6));
  g.appendChild(path("M"+n1(x)+" "+n1(y-21)+"V"+n1(y-34), col, 2.2));
  g.appendChild(G.el("circle", {cx:n1(x), cy:n1(y-43), r:9, fill:col,
    stroke:"none"}));
  return g;
}

/* ------------------------------------------------------------------ *
 * A real 2',3'-dideoxynucleoside triphosphate, skeletal, drawn about
 * its own origin so it can be scaled into the callout.  Same drawing
 * conventions as the enzymes deck: furanose at pentagon geometry with
 * O4' at the apex, explicit P=O double bonds, formal charges shown.
 * ------------------------------------------------------------------ */
const RR = 46;
const VS = [90, 18, -54, -126, 162].map(function(d){
  const t = d*Math.PI/180;
  return [RR*Math.cos(t), -RR*Math.sin(t)];
});                                   /* [O4', C1', C2', C3', C4'] */
function bd(a, b, w){ return path("M"+n1(a[0])+" "+n1(a[1])+"L"+n1(b[0])+" "+n1(b[1]),
                                  C.ink, w || 3); }
function dbl(a, b){
  const dx = b[0]-a[0], dy = b[1]-a[1], L = Math.hypot(dx, dy);
  const nx = -dy/L*6, ny = dx/L*6;
  const g = G.el("g", {});
  g.appendChild(bd([a[0]+nx, a[1]+ny], [b[0]+nx, b[1]+ny]));
  g.appendChild(bd([a[0]-nx, a[1]-ny], [b[0]-nx, b[1]-ny]));
  return g;
}
function shrink(a, b, g){
  const dx = b[0]-a[0], dy = b[1]-a[1], L = Math.hypot(dx, dy);
  return [b[0]-dx/L*g, b[1]-dy/L*g];
}
function atom(p, t, col, sz){
  return G.text(p[0], p[1] + 9, t, sz || 26, col || C.ink, 600);
}
function ddntp(letter){
  const g = G.el("g", {}), col = BASE[letter];
  const O4 = VS[0], C1 = VS[1], C2 = VS[2], C3 = VS[3], C4 = VS[4];
  /* the sugar */
  g.appendChild(bd(C1, C2)); g.appendChild(bd(C2, C3)); g.appendChild(bd(C3, C4));
  g.appendChild(bd(C1, shrink(C1, O4, 22)));
  g.appendChild(bd(C4, shrink(C4, O4, 22)));
  g.appendChild(atom(O4, "O"));
  /* 2' and 3' are both H -- that is what dideoxy means */
  const H2 = [C2[0] + 20, C2[1] + 58], H3 = [C3[0] - 20, C3[1] + 58];
  g.appendChild(bd(C2, shrink(C2, H2, 20)));
  g.appendChild(bd(C3, shrink(C3, H3, 20)));
  g.appendChild(atom(H2, "H", C.muted));
  g.appendChild(atom(H3, "H", C.verm));
  g.appendChild(G.el("ellipse", {cx:n1(H3[0]), cy:n1(H3[1]), rx:27, ry:25,
    fill:"none", stroke:C.verm, "stroke-width":3.4}));
  g.appendChild(G.text(H3[0] - 12, H3[1] + 74, "no 3′ OH", 25, C.verm, 700, "middle"));
  g.appendChild(G.text(H3[0] - 12, H3[1] + 104, "nothing to add the next base to",
    22, C.verm, 400, "middle"));
  /* the base, and the dye hung off it */
  const BB = [C1[0] + 62, C1[1] - 50];
  g.appendChild(bd(C1, shrink(C1, BB, 26)));
  g.appendChild(G.el("rect", {x:n1(BB[0]-6), y:n1(BB[1]-26), width:60, height:50,
    rx:9, fill:col, "fill-opacity":".16", stroke:col, "stroke-width":2.6}));
  g.appendChild(G.text(BB[0] + 24, BB[1] + 8, letter, 27, col, 700));
  const DY = [BB[0] + 128, BB[1] - 44];
  g.appendChild(bd([BB[0]+54, BB[1]-8], shrink([BB[0]+54, BB[1]-8], DY, 30), 2.6));
  g.appendChild(G.el("circle", {cx:n1(DY[0]), cy:n1(DY[1]), r:28, fill:col,
    stroke:"none"}));
  g.appendChild(G.text(DY[0], DY[1] - 44, "dye", 24, col, 700));
  g.appendChild(G.text(DY[0], DY[1] + 60, "one colour", 21, C.muted, 400));
  g.appendChild(G.text(DY[0], DY[1] + 86, "per base", 21, C.muted, 400));
  /* 5' triphosphate */
  const C5 = [C4[0] - 56, C4[1] - 34], O5 = [C5[0] - 56, C5[1]];
  g.appendChild(bd(C4, C5));
  g.appendChild(bd(C5, shrink(C5, O5, 20)));
  g.appendChild(atom(O5, "O"));
  let prev = O5;
  [0, 1, 2].forEach(function(k){
    const P = [prev[0] - 54, prev[1]];
    g.appendChild(bd(shrink(P, prev, 20), shrink(prev, P, 20)));
    g.appendChild(atom(P, "P"));
    const up = [P[0], P[1] - 52], dn = [P[0], P[1] + 52];
    g.appendChild(dbl(shrink(P, up, 22), shrink(up, P, 22)));
    g.appendChild(atom(up, "O"));
    g.appendChild(bd(shrink(P, dn, 22), shrink(dn, P, 22)));
    g.appendChild(atom(dn, k === 2 ? "O⁻" : "O⁻"));
    const O = [P[0] - 54, P[1]];
    if (k < 2){ g.appendChild(bd(shrink(P, O, 20), shrink(O, P, 20)));
                g.appendChild(atom(O, "O")); prev = O; }
    else { g.appendChild(bd(shrink(P, O, 20), shrink(O, P, 20)));
           g.appendChild(atom(O, "⁻O")); }
  });
  g.appendChild(G.text(O5[0] - 168, O5[1] + 104, "5′ triphosphate", 22, C.muted, 400));
  g.appendChild(G.text(O5[0] - 168, O5[1] + 130, "same as any dNTP", 22, C.muted, 400));
  return g;
}

/* ------------------------------------------------------------------ *
 * The instrument end: a capillary, a detector, and the trace it writes.
 * ------------------------------------------------------------------ */
const CX0 = 200, CX1 = 980, CYM = 286, CBORE = 30;
const DX = 1046, DW = 168;
const PK0 = 300, PKP = 206, PKY = 728, PKW = 86, PKH = 146;

function peak(x, h, col, o){
  const g = grp(o);
  g.appendChild(G.el("path", {d:
    "M"+n1(x-PKW)+" "+PKY+
    "C"+n1(x-PKW*0.45)+" "+PKY+" "+n1(x-PKW*0.34)+" "+n1(PKY-h)+" "+n1(x)+" "+n1(PKY-h)+
    "C"+n1(x+PKW*0.34)+" "+n1(PKY-h)+" "+n1(x+PKW*0.45)+" "+PKY+" "+n1(x+PKW)+" "+PKY,
    fill:col, "fill-opacity":".17", stroke:col, "stroke-width":3.2,
    "stroke-linejoin":"round"}));
  return g;
}
function legend(x, y, o){
  const g = grp(o);
  "ACGT".split("").forEach(function(b, i){
    const bx = x + i*86;
    g.appendChild(G.el("rect", {x:n1(bx), y:n1(y-15), width:22, height:22, rx:4,
      fill:BASE[b], stroke:"none"}));
    g.appendChild(G.text(bx + 34, y + 5, b, 23, C.muted, 400, "start"));
  });
  return g;
}
function card(x, y, w, h, title, sub, col, o){
  const g = grp(o);
  g.appendChild(G.el("rect", {x:n1(x), y:n1(y), width:w, height:h, rx:12,
    fill:col, "fill-opacity":".07", stroke:col, "stroke-width":2.8}));
  g.appendChild(G.text(x + w/2, y + 46, title, 28, col, 700));
  g.appendChild(G.text(x + w/2, y + 82, sub, 23, C.muted, 400));
  return g;
}

/* ------------------------------------------------------------------ *
 * The beats.
 * ------------------------------------------------------------------ */
const FR = [
{ s:{rx:1, one:1},
  cap:"an oligo anneals to your plasmid",
  call:"one primer, not two &#183; this is not a PCR and nothing here amplifies",
  note:"You send them the plasmid and one primer. The primer anneals where you chose it to anneal, and that is the only thing in the tube that decides where the read starts. One primer, not two, so nothing amplifies: each round of cycling copies the template again from the same place rather than doubling what is already there. That is why it is called cycle sequencing and not sequencing PCR, and why you get a linear amount of product out rather than an exponential one.",
  desc:"A template strand runs left to right with its bases written along it. A short primer is annealed at the left-hand end, base-paired to the template, with a half barb marking its free three prime end." },

{ s:{rx:1, one:1, ext:1, pol:1},
  cap:"a polymerase extends it, one base at a time",
  call:"each base is chosen by the template &#183; so the new strand is the complement of what is there",
  note:"A polymerase sits on that three prime end and extends. Every base it adds is chosen by whatever is opposite it on the template, so what gets written is the complement of the sequence you are trying to read. This is ordinary polymerase chemistry and nothing about it is specific to sequencing yet. The trick is entirely in what else is in the tube.",
  desc:"The primer is being extended: new bases appear one at a time along the template, with a polymerase drawn as a shape sitting at the growing three prime end." },

{ s:{rx:1, one:1, ext:1, pol:1, dd:1},
  cap:"and a few per cent of the bases in the tube are <b>dideoxy</b>",
  call:"no 3&#8242; hydroxyl, and a dye on the base &#183; the polymerase cannot tell until it is too late",
  note:"Here is the whole method. A few per cent of the nucleotides in the tube are dideoxy: the three prime position is a hydrogen instead of a hydroxyl. A polymerase will take one perfectly happily, because the part it checks is the base pairing and the five prime triphosphate, both of which are normal. But the next base has to attack a three prime hydroxyl that is not there, so the chain stops at that point and cannot continue. And each of the four dideoxy bases carries a different dye, which is the part that makes it readable.",
  desc:"A dideoxynucleotide is drawn in full skeletal structure in a callout: the furanose ring, the five prime triphosphate, hydrogens at both the two prime and three prime positions with the three prime one ringed in red and labelled no three prime OH, and a coloured dye hung off the base. An arrow connects it to the simplified chip used for the same thing in the animation." },

{ s:{rx:1, one:1, ext:1, inc:1, off:1},
  cap:"one lands, and that strand is finished",
  call:"it comes off carrying the dye of whichever base stopped it",
  note:"One goes in, and that molecule is done. It falls off the template carrying a dye, and which dye it carries tells you what base was at that position. Note what has happened to the length: this molecule is exactly as long as the distance from the primer to the base that stopped it. The dye says which base, and the length says where. Those two facts together are the entire readout.",
  desc:"A dideoxy base has been added at the end of the new strand and the finished strand has lifted off the template, its three prime end capped by a coloured chip carrying a dye." },

{ s:{rx:1, lad:1},
  cap:"and it happens at every position, in millions of molecules at once",
  call:"one product terminated at each base &#183; a ladder one base apart",
  note:"That was one molecule. In the tube there are billions of them, the dideoxy bases are rare enough that each one gets some distance before it meets one, and the position it stops at is essentially random. So you end up with a population containing a molecule terminated at every single position along the read, each one carrying the dye of the base that stopped it. Six drawn here; in reality it is eight hundred or a thousand, and that is your read length.",
  desc:"Six finished strands are stacked below the template, each one base longer than the last, with the coloured terminating chips forming a diagonal staircase down the right-hand side." },

{ s:{mach:1, trace:1},
  cap:"a capillary separates them by length, and a detector reads the dye",
  call:"shortest first &#183; the order the colours arrive in <em>is</em> the sequence",
  note:"Now they get separated by size down a capillary, shortest first, one base of resolution. As each one comes past the window a laser excites its dye and a fluorimeter records which colour came off. Short ones arrive early, long ones late, so the colours arrive in the order the bases sit in on the molecule. What gets written down is a plot of colour against time, and that is the trace file.",
  desc:"The products travel down a capillary from left to right, shortest leading, past a detector at the far end. As each one passes, a coloured peak is added to a trace being drawn along the bottom of the slide." },

{ s:{trace:1, calls:1, files:1},
  cap:"software calls a base from each peak, and you are emailed both",
  call:"read the trace, not just the calls &#183; the ends are guesses and a double peak means two colonies",
  note:"Last step is software: it finds each peak, decides which colour it is and writes down a letter, and that string of letters is the read. You get both files. Always look at the trace and not only at the base calls, because the calls are an interpretation and the trace is the measurement. The first and last stretch of every read is guesswork where the peaks are not resolved, and a clean double peak in the middle of an otherwise good read almost always means you picked two colonies at once rather than a real mixed base.",
  desc:"The called bases are printed above their peaks, and two file cards appear: the trace, and the read, which is the base calls as a sequence file." }
];

window.Deck.sequence("cycleseq", function(slide){
  const s = G.scene(slide, 792, 842);
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    /* CLEAR, THEN BUILD.  Every key tweens on the same curve, so a beat
       that swaps one whole scene for another used to cross-dissolve the
       two on top of each other -- the ladder still fading out through
       the capillary fading in.  The scene-level opacities are squeezed
       into half the tween instead: whatever is leaving is gone by the
       midpoint, and only then does the next thing start to arrive.
       Motion WITHIN a scene (the extension, the release) is left on the
       full curve, because there is nothing for it to collide with. */
    const half = x => cl(x*2 - 1, 0, 1);
    v = {ext:v.ext, inc:v.inc, off:v.off, pol:v.pol, calls:v.calls,
         rx:half(v.rx), one:half(v.one), lad:half(v.lad), dd:half(v.dd),
         mach:half(v.mach), trace:half(v.trace), files:half(v.files)};

    /* ---- the reaction ------------------------------------------- */
    if (v.rx > 0.02){
      const r = grp(v.rx);
      /* the template is the one thing present at every beat of this half */
      r.appendChild(path("M"+n1(at(0)-16)+" "+TY+"H"+n1(at(TMPL.length-1)+16)));
      r.appendChild(barb(at(0)-16, TY, -1, C.ink, 1));
      TMPL.split("").forEach(function(b, i){
        r.appendChild(G.text(at(i), TL, b, 25, C.muted, 400));
      });
      r.appendChild(G.text(at(TMPL.length-1) + 52, TY + 9, "template", 24, C.muted, 400, "start"));
      r.appendChild(G.text(at(0) - 34, TL, "3′", 22, C.muted, 400, "end"));
      g.appendChild(r);

      /* the single molecule, beats one to four */
      if (v.one > 0.02){
        const last = 6 + v.ext*(RUN - 1 - 6) + v.inc;
        const o = G.el("g", {opacity:n1(v.one),
          transform:"translate(0 " + n1(-60*v.off) + ")"});
        const bbEnd = at(last) + 18 - 35*v.inc;
        o.appendChild(path("M"+n1(at(0)-16)+" "+NY+"H"+n1(bbEnd)));
        if (v.inc < 0.98){
          const bg = grp(1 - v.inc);
          bg.appendChild(barb(bbEnd, NY, 1, C.ink, -1));
          o.appendChild(bg);
        }
        o.appendChild(G.text(at(0) - 34, NL, "5′", 22, C.muted, 400, "end"));
        NEW.split("").forEach(function(b, i){
          if (i > RUN) return;
          const a = i < PRIM ? 1 : cl(last - i + 1, 0, 1);
          if (a < 0.02) return;
          if (i === RUN){ if (v.inc > 0.02) o.appendChild(chip(at(i), NL - 9, b, v.inc)); }
          else o.appendChild(txt(at(i), NL, b, 25, i < PRIM ? C.blue : C.ink,
            i < PRIM ? 700 : 400, "middle", a));
        });
        /* the pairing, which is what lets go when the strand comes off */
        const tick = grp(1 - v.off);
        NEW.split("").forEach(function(b, i){
          if (i > RUN) return;
          const a = i < PRIM ? 1 : cl(last - i + 1, 0, 1);
          if (a < 0.02 || i === RUN) return;
          tick.appendChild(path("M"+n1(at(i))+" 284V304", C.muted, 2));
        });
        o.appendChild(tick);
        o.appendChild(G.text(at(3), NY - 26, "primer", 23, C.blue, 700));
        g.appendChild(o);
        /* the two facts this molecule carries, marked where they are:
           the dye says which base, and the length says where. */
        if (v.off > 0.02){
          const m = grp(v.off), x1 = at(0) - 16, x2 = at(RUN) + 17, my = 258;
          m.appendChild(path("M"+n1(x1)+" "+my+"H"+n1(x2), C.muted, 2));
          m.appendChild(path("M"+n1(x1)+" "+(my-9)+"V"+(my+9)+
                             "M"+n1(x2)+" "+(my-9)+"V"+(my+9), C.muted, 2));
          m.appendChild(G.text((x1+x2)/2, my + 34,
            "the length says where it stopped", 23, C.muted, 400));
          m.appendChild(G.text(at(RUN) + 58, 212,
            "the dye says which base", 23, C.amber, 700, "start"));
          g.appendChild(m);
        }
      }

      /* the polymerase, seated on the growing end with an open cleft */
      if (v.pol > 0.02){
        const px = at(6 + v.ext*(RUN - 1 - 6)) + 26, py = NY - 46;
        const p = grp(v.pol * (1 - v.off));
        p.appendChild(G.el("path", {d:
          "M"+n1(px-96)+" "+n1(py-6)+
          "C"+n1(px-102)+" "+n1(py-58)+" "+n1(px+8)+" "+n1(py-80)+" "+n1(px+58)+" "+n1(py-48)+
          "C"+n1(px+102)+" "+n1(py-18)+" "+n1(px+86)+" "+n1(py+30)+" "+n1(px+34)+" "+n1(py+26)+
          "C"+n1(px+18)+" "+n1(py+24)+" "+n1(px+22)+" "+n1(py-4)+" "+n1(px)+" "+n1(py-2)+
          "C"+n1(px-22)+" "+n1(py)+" "+n1(px-30)+" "+n1(py+24)+" "+n1(px-58)+" "+n1(py+22)+
          "C"+n1(px-84)+" "+n1(py+20)+" "+n1(px-92)+" "+n1(py+10)+" "+n1(px-96)+" "+n1(py-6)+"Z",
          fill:C.ink, "fill-opacity":".08", stroke:C.ink, "stroke-width":2.6,
          "stroke-opacity":".55"}));
        p.appendChild(path("M"+n1(px+112)+" "+n1(py-14)+"H"+n1(px+134), C.muted, 2.2));
        p.appendChild(G.text(px + 142, py - 6, "DNA polymerase", 23, C.muted, 400, "start"));
        g.appendChild(p);
      }

      /* the callout: a real ddNTP, with an arrow to the chip above it */
      if (v.dd > 0.02){
        const d = grp(v.dd);
        /* the incoming base waits clear of the duplex, on the right, and
           the leader climbs the outside of the slide to reach it: run it
           straight up from the box and it goes through the template. */
        d.appendChild(chip(1300, 178, NEW[RUN], 1));
        d.appendChild(G.text(1300, 244, "the next base in", 22, C.muted, 400));
        d.appendChild(G.el("rect", {x:150, y:414, width:1235, height:338, rx:14,
          fill:C.ink, "fill-opacity":".03", stroke:C.muted, "stroke-width":2,
          "stroke-dasharray":"7 7"}));
        d.appendChild(path("M1352 410C1378 358 1338 318 1312 274", C.muted, 2.4, "8 8"));
        d.appendChild(path("M1318 296L1311 272L1333 283", C.muted, 2.4));
        const st = G.el("g", {transform:"translate(940 566) scale(0.86)"});
        st.appendChild(ddntp(NEW[RUN]));
        d.appendChild(st);
        d.appendChild(G.text(178, 456, "a 2\u2032,3\u2032-dideoxynucleotide", 26, C.ink, 700, "start"));
        g.appendChild(d);
      }

      /* the population: one product terminated at every position */
      if (v.lad > 0.02){
        const L = grp(v.lad);
        STOPS.forEach(function(stop, i){
          const y = 452 + i*56;
          L.appendChild(path("M"+n1(at(0)-16)+" "+y+"H"+n1(at(stop)-24), C.ink, 3));
          L.appendChild(G.text(at(0) - 34, y + 9, "5′", 21, C.muted, 400, "end"));
          L.appendChild(chip(at(stop), y, NEW[stop], 1));
        });
        L.appendChild(G.text(at(STOPS[5]) + 72, 452 + 2*56,
          "one product stopped", 23, C.muted, 400, "start"));
        L.appendChild(G.text(at(STOPS[5]) + 72, 452 + 2*56 + 30,
          "at every position", 23, C.muted, 400, "start"));
        g.appendChild(L);
      }
    }

    /* ---- the instrument ----------------------------------------- */
    if (v.mach > 0.02){
      const m = grp(v.mach);
      m.appendChild(G.el("rect", {x:CX0, y:n1(CYM-CBORE), width:CX1-CX0,
        height:CBORE*2, rx:CBORE, fill:"none", stroke:C.ink, "stroke-width":3}));
      m.appendChild(G.text(CX0 + 6, CYM - 58, "capillary · separates by length", 24,
        C.muted, 400, "start"));
      m.appendChild(G.text(CX0 + 6, CYM + 76, "shortest first", 23, C.muted, 400, "start"));
      /* the fragments, strung out and arriving in length order */
      STOPS.forEach(function(stop, i){
        const t = cl(v.trace*1.55 - i*0.15, 0, 1.12);
        if (t >= 1.06) return;
        const x = CX0 + 58 + (CX1 - CX0 - 90)*cl(t, 0, 1);
        const f = grp(1);
        f.appendChild(path("M"+n1(x-46)+" "+CYM+"H"+n1(x-9), C.ink, 3));
        f.appendChild(G.el("circle", {cx:n1(x), cy:n1(CYM), r:11,
          fill:BASE[NEW[stop]], stroke:"none"}));
        m.appendChild(f);
      });
      /* the detector */
      m.appendChild(G.el("rect", {x:DX, y:n1(CYM-66), width:DW, height:132, rx:12,
        fill:"none", stroke:C.ink, "stroke-width":3}));
      m.appendChild(G.text(DX + DW/2, CYM - 12, "fluorimeter", 24, C.ink, 700));
      m.appendChild(G.text(DX + DW/2, CYM + 20, "reads the dye", 22, C.muted, 400));
      m.appendChild(path("M"+n1(CX1-70)+" "+CYM+"H"+n1(DX), C.verm, 3, "9 7"));
      m.appendChild(path("M"+n1(DX+DW/2)+" "+n1(CYM+72)+"V"+n1(PKY-PKH-64),
        C.muted, 2.4, "8 8"));
      m.appendChild(path("M"+n1(DX+DW/2-9)+" "+n1(PKY-PKH-78)+"L"+n1(DX+DW/2)+" "+
        n1(PKY-PKH-64)+"L"+n1(DX+DW/2+9)+" "+n1(PKY-PKH-78), C.muted, 2.4));
      m.appendChild(G.text(DX + DW/2 + 24, CYM + 150, "writes the trace", 23,
        C.muted, 400, "start"));
      g.appendChild(m);
    }

    /* ---- the trace ---------------------------------------------- */
    if (v.trace > 0.02){
      const t = grp(1);
      t.appendChild(path("M"+n1(PK0-PKW-40)+" "+PKY+"H1430", C.muted, 2.4));
      t.appendChild(G.text(PK0 - PKW - 40, PKY + 36, "time →", 22, C.muted, 400, "start"));
      STOPS.forEach(function(stop, i){
        const a = cl(v.trace*6.6 - i*0.9, 0, 1);
        if (a < 0.02) return;
        const x = PK0 + i*PKP, b = NEW[stop];
        t.appendChild(peak(x, PKH*a, BASE[b], a));
        if (v.calls > 0.02)
          t.appendChild(txt(x, PKY - PKH - 30, b, 30, BASE[b], 700, "middle",
            cl(v.calls*3 - i*0.3, 0, 1)));
      });
      t.appendChild(legend(PK0 - PKW - 40, PKY - 232, cl(v.trace*3 - 1, 0, 1)));
      g.appendChild(t);
    }

    /* ---- what lands in your inbox ------------------------------- */
    if (v.files > 0.02){
      const fgrp = grp(v.files);
      fgrp.appendChild(card(330, 196, 420, 132, "the trace",
        "what the machine measured", C.blue, 1));
      fgrp.appendChild(card(850, 196, 420, 132, "the read",
        "what the software concluded", C.verm, 1));
      fgrp.appendChild(G.el("text", {x:1060, y:306, "font-size":25,
        "text-anchor":"middle", "letter-spacing":"5", fill:C.ink,
        "font-family":"ui-monospace, Menlo, monospace"},
        "\u2026" + STOPS.map(i => NEW[i]).join("") + "\u2026"));
      fgrp.appendChild(path("M770 262H830m-16-12l16 12l-16 12", C.muted, 2.6));
      fgrp.appendChild(G.text(800, 366, "both, in your inbox, next day", 24, C.muted, 400));
      g.appendChild(fgrp);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
