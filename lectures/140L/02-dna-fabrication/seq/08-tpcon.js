/* ------------------------------------------------------------------ *
 * 08-tpcon.js : every drawing in the TPcon6 and MoClo section.
 *
 * Registers, in slide order:
 *     moclo     58  the MoClo standard                      3 steps
 *     rotate    59  why TPcon differs, the rotation        2 steps
 *     uctp      60  the UC.TP variation, iterated           1 step
 *     ucarch    61  the UC part                             1 step
 *     tparch    62  the TPcon6 part                         1 step
 *     tlib2     64  Tlib2, three nested levels of sites     6 steps
 *     bseri     65  pP6-2A x pT6B3                          3 steps
 *
 * They live in one file because they are one drawing seen seven times.
 * The junction tag, the part box, the RBS dome, the ORF arrow, the
 * terminator octagon and the promoter bent arrow are defined once here
 * and every slide draws from the same set.  That is the only way the
 * caution in the brief can actually be met: a student has to be able to
 * see GCTT on slide 58 and recognise it on slide 65.
 *
 * WHY NONE OF THE SOURCE ART IS KEPT
 * The section ships fifteen extracted images.  Every one is a fragment:
 * the largest is 595x77 and most are near 220x50, which on a 1600x900
 * slide is a two- to sevenfold upscale of a JPEG-artefacted raster.
 * They are also in three foreign palettes at once: Addgene's pastels on
 * 58 to 60, a saturated primary red and blue on 59 to 62, SnapGene's
 * olive, cyan and purple on 64 and 65.  What they draw is labelled
 * boxes, ticks and block arrows: the rebuild-natively case, as on the
 * BioBrick slide.  Rebuilt they also earn what a flat picture cannot
 * give, the rotation on slide 59 becomes a move rather than a claim,
 * and Tlib2's three levels of Golden Gate site land one at a time, on
 * the six beats its notes are already written in.
 *
 * COLOUR.  One assignment, held from slide 58 to slide 65:
 *
 *   vermillion  A JUNCTION.  The 4 bp MoClo code: GGAG TACT AATG AGGT
 *               GCTT CGCT, and the 2 bp BseRI sticky ends TC and GT.
 *               Always monospace; boxed on a leader in a figure, bare in
 *               a line of letters, so the same GCTT is the same object
 *               on every slide it appears on.  This is what the section
 *               is about, so it takes the loud rung and keeps it, and
 *               nothing else here is ever vermillion.
 *   blue        THE ENZYME.  A recognition site in letters, a tick and a
 *               name in a figure.  On slide 64 it travels: BsmBI, then
 *               BsaI, then BseRI, because the slide is about each of
 *               them in turn, which is what the ladder is for.
 *   ink         everything merely present: backbone, parts, spacers,
 *               terminator, promoter.
 *   muted       scaffold and captions.
 *
 * The two TPcon primitives are told apart by SHAPE and by name, never by
 * hue.  The source draws UC blue and TP red and it is tempting to carry
 * that over, but it would spend vermillion on a class of object and the
 * junction codes would lose the only colour that can be theirs.
 * palette.css is explicit that a colour encodes attention, not identity
 * ("do not assign a colour to a class of object"), and a dome plus a
 * block arrow against an octagon plus a bent arrow is already the most
 * separable pair of glyphs in the section: it survives greyscale and
 * dichromacy on its own, which a red/blue pair does not.
 *
 * GEOMETRY.  Content box is x 110..1490, y 86..830.  Under an h1.small
 * (48px, 1.1 leading, 18px margin) a drawing starts at 157.  Slides that
 * also carry flow content reserve their band with a .figgap of a stated
 * height, and the numbers here are the contract with that markup.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", RED = "#ba3a13", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";
const SANS = "Helvetica Neue,Arial,Helvetica,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";
const n2 = v => Math.round(v * 10) / 10;

function esc(s){ return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

function txt(x, y, s, size, fill, weight, anchor, family){
  return '<text x="' + n2(x) + '" y="' + n2(y) + '" font-size="' + size +
    '" fill="' + fill + '" font-weight="' + (weight || 400) +
    '" text-anchor="' + (anchor || "middle") +
    '" font-family="' + (family || SANS) + '">' + esc(s) + "</text>";
}

function path(d, stroke, w, fill, extra){
  return '<path d="' + d + '" fill="' + (fill || "none") + '" stroke="' + (stroke || "none") +
    '" stroke-width="' + (w || 0) + '"' + (extra || "") + "/>";
}

function rect(x0, y0, w, h, stroke, sw, fill, r){
  return '<rect x="' + n2(x0) + '" y="' + n2(y0) + '" width="' + n2(w) + '" height="' + n2(h) +
    '" rx="' + (r == null ? 4 : r) + '" fill="' + (fill || "none") +
    '" stroke="' + (stroke || "none") + '" stroke-width="' + (sw || 0) + '"/>';
}

/* ------------------------------------------------------------------ *
 * The shared vocabulary
 * ------------------------------------------------------------------ */

/* the backbone a map is drawn on */
function bone(x0, x1, y){
  return path("M" + n2(x0) + " " + n2(y) + "H" + n2(x1), INK, 3);
}

/* A JUNCTION TAG, the 4 bp code, boxed, above the boundary it names,
   on a leader down to the backbone.  Deliberately the most distinctive
   mark in the vocabulary: it is the one thing the section repeats, and
   nothing else here looks like it. */
function tag(x, ybone, code, size){
  const fs = size || 19, w = code.length * fs * 0.64 + 16, h = fs + 13;
  const y0 = ybone - 30 - h;
  return path("M" + n2(x) + " " + n2(y0 + h) + "V" + n2(ybone + 9), RED, 2.2) +
         rect(x - w/2, y0, w, h, RED, 2, "#ffffff", 3) +
         txt(x, y0 + h - 8, code, fs, RED, 700, "middle", MONO);
}

/* a named part sitting on the backbone */
function part(x0, x1, ybone, h, label, size){
  return rect(x0, ybone - h/2, x1 - x0, h, INK, 3, "#ffffff") +
         txt((x0 + x1)/2, ybone + (size || 22) * 0.36, label, size || 22, INK, 700);
}

/* an enzyme site: a blue tick across the backbone, its name below */
function enz(x, ybone, name, dy, size){
  const half = 17, fs = size || 17;
  return path("M" + n2(x) + " " + n2(ybone - half) + "V" + n2(ybone + half), BLUE, 3) +
         txt(x, ybone + (dy == null ? half + fs + 4 : dy), name, fs, BLUE, 700);
}

/* SBOL-ish glyphs.  A dome for the ribosome binding site, a block arrow
   for the open reading frame, an octagon for the terminator, a bent
   arrow for the promoter.  Shape carries identity here; see the header. */
function rbs(cx, ybone, r){
  return path("M" + n2(cx - r) + " " + n2(ybone) + "A" + n2(r) + " " + n2(r) +
              " 0 0 1 " + n2(cx + r) + " " + n2(ybone) + "Z", INK, 3, "#ffffff");
}

function orf(x0, x1, ybone, h, sw){
  const hl = Math.min(h * 0.95, (x1 - x0) * 0.34), bh = h/2, hh = h * 0.92;
  return path("M" + n2(x0) + " " + n2(ybone - bh) + "H" + n2(x1 - hl) +
              "V" + n2(ybone - hh) + "L" + n2(x1) + " " + n2(ybone) +
              "L" + n2(x1 - hl) + " " + n2(ybone + hh) + "V" + n2(ybone + bh) +
              "H" + n2(x0) + "Z", INK, sw || 3, "#ffffff");
}

function octagon(cx, cy, r, hollow){
  const p = [];
  for (let k = 0; k < 8; k++){
    const a = (Math.PI/8) + k * (Math.PI/4);
    p.push(n2(cx + r * Math.cos(a)) + " " + n2(cy + r * Math.sin(a)));
  }
  return path("M" + p.join("L") + "Z", INK, hollow ? 2.5 : 3, "#ffffff",
              hollow ? ' stroke-dasharray="7 6"' : "");
}

/* The promoter: up from the backbone, then right, with a head.  An
   outline rather than a solid, so the hollow variant on slide 64, where
   the promoter is precisely the thing NOT in the oligo, is the same
   shape with a dashed edge and reads as an absence rather than as a
   different object. */
function promoter(x, ybone, rise, run, hollow, t){
  const th = t || 15, hh = th * 1.72, hl = th * 2, top = ybone - rise, xe = x + run;
  return path("M" + n2(x - th/2) + " " + n2(ybone) +
              "V" + n2(top - th/2) + "H" + n2(xe - hl) + "V" + n2(top - hh) +
              "L" + n2(xe) + " " + n2(top) + "L" + n2(xe - hl) + " " + n2(top + hh) +
              "V" + n2(top + th/2) + "H" + n2(x + th/2) + "V" + n2(ybone) + "Z",
              INK, hollow ? 2.5 : 3, "#ffffff", hollow ? ' stroke-dasharray="7 6"' : "");
}

/* a spacer: a plain block, named underneath: "20 bp spacer" will not
   fit inside one, and the three of them are peers anyway */
function spacer(x0, x1, ybone, h){
  return rect(x0, ybone - h/2, x1 - x0, h, INK, 2.6, "#ffffff", 3);
}

/* A feature on an annotation strip, the SnapGene idiom of slides 64 and
   65, rebuilt.  side -1 puts the name above the arrow, +1 below, which
   is how the source keeps a dozen labels from colliding. */
function feature(x0, x1, y, label, colour, side, dir, backing, sw){
  const h = 11, hl = Math.min(16, (x1 - x0) * 0.4), c = colour || INK;
  const d = dir < 0
    ? "M" + n2(x1) + " " + n2(y - h) + "H" + n2(x0 + hl) + "L" + n2(x0) + " " + n2(y) +
      "L" + n2(x0 + hl) + " " + n2(y + h) + "H" + n2(x1) + "Z"
    : "M" + n2(x0) + " " + n2(y - h) + "H" + n2(x1 - hl) + "L" + n2(x1) + " " + n2(y) +
      "L" + n2(x1 - hl) + " " + n2(y + h) + "H" + n2(x0) + "Z";
  const ly = side < 0 ? y - 22 : y + 38, cx = (x0 + x1) / 2;
  /* the highlight overlay redraws a feature on top of the ink one, so it
     needs to hide the ink label rather than fringe against it */
  const bg = backing ? rect(cx - (label.length * 12 + 16) / 2, ly - 21,
                            label.length * 12 + 16, 28, "none", 0, "#ffffff", 2) : "";
  return path(d, c, sw || 2.4, "#ffffff") + bg + txt(cx, ly, label, 20, c, 700);
}

/* ------------------------------------------------------------------ *
 * Plumbing: build an <svg> over the slide, group by group, and paint a
 * settled frame for any step in any order.  ON maps a group name to the
 * step it arrives on; -1 means "always".
 * ------------------------------------------------------------------ */
function mount(slide, groups){
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");
  let html = "";
  Object.keys(groups).forEach(function(k){
    html += '<g data-g="' + k + '" opacity="0">' + groups[k] + "</g>";
  });
  svg.innerHTML = html;
  slide.appendChild(svg);
  const r = {};
  svg.querySelectorAll("[data-g]").forEach(el => r[el.getAttribute("data-g")] = el);
  r._svg = svg;
  return r;
}

const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)");

function painter(slide, r, ON, extra){
  const parts = Array.from(slide.querySelectorAll("[data-part]"));
  return function(i, animated){
    const soft = animated !== false && !REDUCE.matches;
    Object.keys(ON).forEach(function(k){
      const el = r[k];
      if (!el) return;
      el.style.transition = soft ? "opacity .36s ease" : "none";
      el.style.opacity = i >= ON[k] ? "1" : "0";
    });
    parts.forEach(function(el){
      const g = parseInt(el.getAttribute("data-part"), 10) || 0;
      el.style.transition = soft ? "opacity .36s ease" : "none";
      el.style.opacity = i >= g ? "1" : "0";
    });
    if (extra) extra(i, soft);
  };
}

/* ================================================================== *
 * 58, the MoClo standard
 *
 * Three bands, one per beat, and the beats are the three the source
 * author marked with asterisks in the note: the four part types, the
 * secreted-protein variant that splits the CDS, and the level 0 modules
 * with the BsaI/BsmBI ladder they climb.
 * ================================================================== */
(function(){
  const AY = 268, BY = 432, CY = 640, X0 = 210;

  function row(y, parts){
    let s = "", x = X0, w = parts.reduce((a, p) => a + p[0], 0);
    s = bone(X0 - 60, X0 + w + 60, y);
    parts.forEach(function(p){ s += part(x, x + p[0], y, 48, p[1]); x += p[0]; });
    return s;
  }
  const tags = (y, xs) => xs.map(t => tag(t[0], y, t[1])).join("");

  const bandA =
    row(AY, [[250,"P"],[120,"U"],[520,"CDS"],[220,"T"]]) +
    tags(AY, [[210,"GGAG"],[460,"TACT"],[580,"AATG"],[1100,"GCTT"],[1320,"CGCT"]]) +
    txt(765, AY + 58, "Cytosolic protein", 24, MUTED);

  const bandB =
    row(BY, [[250,"P"],[120,"U"],[130,"SP"],[390,"CDS"],[220,"T"]]) +
    tags(BY, [[210,"GGAG"],[460,"TACT"],[580,"AATG"],[710,"AGGT"],[1100,"GCTT"],[1320,"CGCT"]]) +
    txt(765, BY + 58, "Secreted protein", 24, MUTED);

  const MOD = [["P","GGAG","TACT"],["U","TACT","AATG"],["SP","AATG","AGGT"],
               ["CDS","AGGT","GCTT"],["T","GCTT","CGCT"]];
  const PITCH = 268, MW = 236, MX = 130;
  let bandC = txt(800, 545, "Level 0 modules: one plasmid each, flanked by BsaI", 24, MUTED);
  MOD.forEach(function(m, i){
    const x = MX + i * PITCH;
    bandC += bone(x, x + MW, CY) +
             enz(x + 26, CY, "BsaI", 40) + enz(x + 210, CY, "BsaI", 40) +
             part(x + 58, x + 178, CY, 42, m[0]) +
             tag(x + 26, CY, m[1]) + tag(x + 210, CY, m[2]);
  });

  /* the ladder the note ends on, three stations rather than a sentence,
     because the point of it is that it repeats */
  let ladder = "";
  [[250, 470, "Level 0"], [580, 950, "Level 1: one gene"],
   [1060, 1450, "Level 2: multi-gene"]].forEach(function(b){
    ladder += rect(b[0], 739, b[1] - b[0], 46, INK, 2.6, "#ffffff", 5) +
              txt((b[0] + b[1]) / 2, 770, b[2], 23, INK, 700);
  });
  [[470, 580, "BsaI"], [950, 1060, "BsmBI"]].forEach(function(a){
    ladder += path("M" + a[0] + " 762H" + (a[1] - 12), MUTED, 2.6, "none",
                   ' marker-end="url(#tpHead)"') +
              txt((a[0] + a[1]) / 2, 731, a[2], 19, BLUE, 700);
  });
  ladder += txt(800, 812, "the alternation repeats, to build indefinitely larger DNAs", 21, MUTED);

  const S = [
{ note:"Image from: https://www.addgene.org/cloning/moclo/ Original publication: PMID: 21364738 MoClo standardizes the junctions between elements within in a single-gene operon. It effectively breaks a gene into P (Promoter), U (5’ UTR), C (CDS/ORF), and T (terminator) parts.",
  desc:"A single-gene operon drawn as one line of boxes: P for promoter, U for the five prime UTR, CDS, and T for terminator, captioned Cytosolic protein. At each boundary a four base code hangs above the line in a red tag: GGAG before P, TACT between P and U, AATG between U and CDS, GCTT between CDS and T, CGCT after T. Those codes are the standard, and the same six reappear on every slide of this section." },

{ note:"They also include a scenario where you break the CDS into two parts, one with a secretory sequence, and one with the active peptide",
  desc:"Below it a second row, captioned Secreted protein. It is the same gene with the CDS split in two: a short SP box for the secretion signal, then the CDS proper. Splitting it adds one junction and one code, AGGT, between them. Every other code is unchanged." },

{ note:"Each of these junctions is associated with specific 4 bp sticky end sequences. Thus, for example, the promoter-5’UTR junction is always the sequence TACT. In the intended use of this system, you start with a collection of individual plasmids each flanked by BsaI sites with these standardized sticky ends, and then you assemble a gene cassette in one round of golden gate with BsaI. You would do this for each gene in your final design. When joining these “level 0 modules” (the P, U, C, and T parts), you include a backbone plasmid which complements the GGAG and CGCT sticky ends. In the process, it also adds standardized BsmBI sites so that you can combine several gene-sized “Level 1” plasmids into multi-gene systems, or “Level 2” plasmids. This alternation of BsmBI and BsaI can be done indefinitely to stitch together larger and larger DNAs hierarchically.",
  desc:"The row breaks into its five level zero modules, each on its own short backbone with a blue BsaI tick at either end and each carrying the two codes it must present: P has GGAG and TACT, U has TACT and AATG, SP has AATG and AGGT, CDS has AGGT and GCTT, T has GCTT and CGCT. Every code appears twice, once on each of the two parts it joins. Beneath, three stations in a row: Level 0, an arrow labelled BsaI to Level 1, one gene, an arrow labelled BsmBI to Level 2, multi-gene, and a line saying the alternation repeats to build indefinitely larger DNAs." }
  ];

  window.Deck.sequence("moclo", function(slide){
    const r = mount(slide, { a: bandA, b: bandB, c: bandC + ladder });
    r._svg.insertAdjacentHTML("afterbegin",
      '<defs><marker id="tpHead" viewBox="0 0 10 10" refX="9" refY="5" ' +
      'markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
      '<path d="M0 0L10 5L0 10" fill="none" stroke="' + MUTED + '" stroke-width="2"/></marker></defs>');
    const paint = painter(slide, r, { a: -1, b: 1, c: 2 });
    paint(0, false);
    return { steps: S, go: paint };
  });
})();

/* ================================================================== *
 * 59 and 60, the rotation, and what it is for
 *
 * The source draws these as two slides carrying the same picture with
 * the promoter box in a different place, which is an animation that ran
 * out of slide.  Here the modules are five groups on one row and the
 * rotation is a translate: U, SP, CDS and T each step one slot left and
 * P travels four slots right.  The codes ride along with their parts,
 * which is the whole content of the move: GGAG and TACT stay stuck to P
 * wherever P goes.
 *
 * Slide 60 holds the rotated row at identical coordinates, so nothing
 * moves when the deck steps across the pair.  What changes is what sits
 * under it: 59 ends on the sentence about the T-P seam, 60 replaces that
 * one line with the head-to-tail strip.
 * ================================================================== */
(function(){
  const CY = 532, PITCH = 268, MW = 236, MX = 130, LY = 280;
  const ORDER = [["P","GGAG","TACT"],["U","TACT","AATG"],["SP","AATG","AGGT"],
                 ["CDS","AGGT","GCTT"],["T","GCTT","CGCT"]];
  const AFTER = [4, 0, 1, 2, 3];      /* slot each module rotates into */

  const legend =
    bone(190, 730, LY) + rbs(300, LY, 27) + orf(380, 690, LY, 54) +
    txt(300, LY + 48, "RBS", 20, MUTED) + txt(535, LY + 48, "ORF", 20, MUTED) +
    txt(460, 186, "UC", 32, INK, 700) + txt(460, 218, "transcribed", 22, MUTED) +
    bone(870, 1410, LY) + octagon(960, LY, 42) + promoter(1150, LY, 62, 190) +
    txt(960, LY + 68, "terminator", 20, MUTED) + txt(1250, LY + 48, "promoter", 20, MUTED) +
    txt(930, 186, "TP", 32, INK, 700) + txt(930, 218, "not transcribed", 22, MUTED);

  const modules = ORDER.map(function(m, i){
    const x = MX + i * PITCH;
    return '<g data-m="' + i + '">' + bone(x, x + MW, CY) +
      enz(x + 26, CY, "BsaI", 40) + enz(x + 210, CY, "BsaI", 40) +
      part(x + 58, x + 178, CY, 42, m[0]) +
      tag(x + 26, CY, m[1]) + tag(x + 210, CY, m[2]) + "</g>";
  }).join("");

  const BY = 616;
  function bracket(s0, s1, label){
    const a = MX + s0 * PITCH, b = MX + s1 * PITCH + MW;
    return path("M" + a + " " + (BY - 12) + "V" + BY + "H" + b + "V" + (BY - 12), INK, 2.6) +
           txt((a + b) / 2, BY + 34, label, 27, INK, 700);
  }
  /* The dashed mark is the seam inside TP.  MoClo sets that one with
     BsmBI during level 2 assembly, so it has no standardized 4 bp code -
     and TPcon never varies the pairing, so it never needs one. */
  const brackets = bracket(0, 2, "UC") + bracket(3, 4, "TP") +
    path("M1186 470V596", MUTED, 2.4, "none", ' stroke-dasharray="6 7"');

  const seam = txt(800, 706,
    "MoClo sets the T–P seam with BsmBI, not with a 4 bp code, and TPcon never varies that pairing, so it needs none",
    22, MUTED);

  /* slide 60: the parts iterated head to tail */
  const SY = 762;
  let strip = txt(800, 680, "one operon after another, head to tail", 22, MUTED) + bone(140, 1450, SY);
  [0, 1, 2, 3].forEach(function(k){
    const x = 150 + k * 320;
    strip += octagon(x + 34, SY, 24) + promoter(x + 100, SY, 40, 76, false, 9) +
             rbs(x + 226, SY, 16) + orf(x + 252, x + 312, SY, 34, 2.6) +
             txt(x + 88, SY + 56, "TP", 21, INK, 700) +
             txt(x + 272, SY + 56, "UC", 21, INK, 700);
  });

  /* the move itself: a settled frame exists for either state */
  function rotate(ms, on, soft){
    ms.forEach(function(g, i){
      g.style.transition = soft ? "transform .62s cubic-bezier(.4,0,.2,1)" : "none";
      g.style.transform = "translateX(" + n2(((on ? AFTER[i] : i) - i) * PITCH) + "px)";
    });
  }

  const A = [
{ note:"The use case for the TPcon6 parts is a little different. With MoClo, you do iterative rounds of assembly to build up a bigger DNA. If your goal is to simply change one promoter part in the context of a very large DNA, you are looking at 3 rounds of cloning to get there. We want to be able to do such promoter scans in one step. So, instead of doing it all with plasmid-based golden gate, we are doing it by PCR-based golden gate. Nevertheless, it simplifies design immensely to standardize junctions, and as there is a preexisting standard (MoClo), we stayed as close to that as possible. The other issue with this is we wanted to simplify the grammer from there being 4 or 5 types of primitives to there being just 2. Why this helps is a subject for another day, but suffice it to say it simplifies things. Effectively we are coding the DNA as being composed of transcribed and non-transcribed parts.",
  desc:"Across the top, the two primitives TPcon uses. On the left, labelled UC and transcribed: a dome for the ribosome binding site and a block arrow for the open reading frame. On the right, labelled TP and not transcribed: an octagon for the terminator and a bent arrow for the promoter. Below them, the five MoClo level zero modules in their MoClo order, P first, each with its blue BsaI ticks and its pair of red junction codes." },

{ note:"To adapt MoClo for this, we effectively just rotate the sequence such that the promoter comes after the terminator. That junction would be set with a BsmBI site during the second level of assembly in MoClo, so there is no standardized junction for it. In our TPcon system, we will never be varying the pairing of terminator and promoter, so we won’t need a junction, so there is none present.",
  desc:"The row rotates. P slides the whole way from the front to the back and the other four modules each step one place left, so the order becomes U, SP, CDS, T, P. The codes travel with their parts: P still carries GGAG and TACT wherever it goes. Brackets underneath name the new grouping: U, SP and CDS together are the UC part; T and P together are the TP part. A dashed line marks the seam between T and P, and a line beneath says MoClo sets that seam with BsmBI rather than a four base code, and TPcon never varies the pairing, so it needs none." }
  ];

  const B = [
{ note:"In a multi-operon system, these UC and TP parts are iterated head to tail restoring the expected gene structure.",
  desc:"The rotated row is held exactly where it was, with the UC and TP brackets still under it. Beneath, the same two glyphs repeated along one line: TP then UC, four times over: terminator, promoter, ribosome binding site, open reading frame, and round again. Read across, the alternation restores the ordinary gene structure, since every promoter is still followed by the thing it transcribes, but the parts you hold and swap are the two TPcon primitives rather than four or five MoClo ones." }
  ];

  window.Deck.sequence("rotate", function(slide){
    const r = mount(slide, { legend: legend, mods: modules, brackets: brackets, seam: seam });
    const ms = Array.from(r.mods.querySelectorAll("[data-m]"));
    const paint = painter(slide, r, { legend: -1, mods: -1, brackets: 1, seam: 1 },
                          function(i, soft){ rotate(ms, i >= 1, soft); });
    paint(0, false);
    return { steps: A, go: paint };
  });

  window.Deck.sequence("uctp", function(slide){
    const r = mount(slide, { legend: legend, mods: modules, brackets: brackets, strip: strip });
    const ms = Array.from(r.mods.querySelectorAll("[data-m]"));
    const paint = painter(slide, r, { legend: -1, mods: -1, brackets: -1, strip: -1 },
                          function(){ rotate(ms, true, false); });
    paint(0, false);
    return { steps: B, go: paint };
  });
})();

/* ================================================================== *
 * 61, the UC part.  One drawing, no build; the slide's other two
 * elements, the BsaI cut and the worked example, are letters and live
 * in the markup.  .figgap there is 380px, which puts this band at
 * y 282..662.
 * ================================================================== */
(function(){
  const Y = 470;
  const fig =
    txt(180, Y + 15, "TACT", 42, RED, 700, "start", MONO) +
    txt(1420, Y + 15, "GCTT", 42, RED, 700, "end", MONO) +
    bone(330, 1300, Y) +
    rbs(455, Y, 36) + txt(455, Y + 68, "RBS", 26, MUTED) +
    orf(580, 1210, Y, 80) + txt(895, Y + 68, "ORF", 26, MUTED);

  window.Deck.sequence("ucarch", function(slide){
    const r = mount(slide, { fig: fig });
    const paint = painter(slide, r, { fig: -1 });
    paint(0, false);
    return { steps: [
{ note:"So, a UC part (the transcribed regions) have the general architecture of standardized TACT and GCTT BsaI sites on the ends, and the 5’ UTR and CDS on the inside.",
  desc:"The UC part drawn out. TACT stands at the left end and GCTT at the right, both red and both in the monospace they are written in everywhere else in this section. Between them, on one line, a dome for the ribosome binding site and a long block arrow for the open reading frame. Above the drawing the BsaI cut is written as letters, GGTCTC then one base and the cut on the top strand against CCAGAG then five on the bottom, which is what puts the four base overhang where it is. Below, the whole part worked out in one line of sequence: blue BsaI sites at each end, the red TACT and GCTT just inside them, and between them the underlined SD/RBS and the underlined CDS/ORF, which starts at ATG and ends at TGA." }
    ], go: paint };
  });
})();

/* ================================================================== *
 * 62.  The TPcon6 part.
 *
 * GCTT and TACT are on the ends in the opposite order to the UC part,
 * which is the whole reason the two iterate head to tail, so they are
 * set in the same size and face as on slide 61 and the two slides can
 * be flipped between.
 *
 * What the three spacers are FOR stays in the note.  An earlier draft
 * wrote it at the foot of the slide; the source slide carries no such
 * line, so it is the presenter's, and the drawing names the blocks and
 * stops there.
 * ================================================================== */
(function(){
  /* Y sits the drawing in the middle of the whole 157..830 band: this
     slide carries no flow content, and with the foot line gone there is
     nothing below the spacer captions to balance against. */
  const Y = 540;
  const fig =
    txt(165, Y + 15, "GCTT", 42, RED, 700, "start", MONO) +
    txt(1435, Y + 15, "TACT", 42, RED, 700, "end", MONO) +
    bone(255, 1345, Y) +
    spacer(285, 425, Y, 44) + txt(355, Y + 88, "20 bp", 23, MUTED) + txt(355, Y + 118, "spacer", 23, MUTED) +
    octagon(560, Y, 78) + txt(560, Y + 118, "terminator", 23, MUTED) +
    spacer(700, 840, Y, 44) + txt(770, Y + 88, "20 bp", 23, MUTED) + txt(770, Y + 118, "spacer", 23, MUTED) +
    promoter(900, Y, 170, 190) + txt(1000, Y - 204, "Promoter", 27, INK, 700) +
    spacer(1150, 1290, Y, 44) + txt(1220, Y + 88, "20 bp", 23, MUTED) + txt(1220, Y + 118, "spacer", 23, MUTED);

  window.Deck.sequence("tparch", function(slide){
    const r = mount(slide, { fig: fig });
    const paint = painter(slide, r, { fig: -1 });
    paint(0, false);
    return { steps: [
{ note:"And TP parts have GCTT and TACT sticky ends (flipped order) and include terminator and promoter elements. They also have unique spacer elements. This is done to provide sites for initiating PCR for doing editing reactions involving the replacement of a UC part. These are the parts we are trying to make right now.",
  desc:"The TPcon6 part drawn at the same scale as the UC part on the slide before, and with its two end codes in the opposite order: GCTT on the left, TACT on the right. Along the line, a 20 bp spacer, then an octagon for the terminator, then a second 20 bp spacer, then the bent arrow of the promoter, then a third 20 bp spacer." }
    ], go: paint };
  });
})();

/* ================================================================== *
 * 64: Tlib2
 *
 * The richest notes in the deck: six paragraphs, and the last three are
 * one each for the three levels of Golden Gate site.  So this is six
 * beats, and the three enzymes light up one at a time with the job the
 * note gives them written underneath.  They accumulate rather than
 * replacing one another, so the slide ends as a three-line legend of
 * what each nested pair is for, which is the thing the flat SnapGene
 * strip cannot do, since there all twelve features arrive at once and
 * the three levels have to be picked out by ear.
 * ================================================================== */
(function(){
  const CY = 390, SY = 580;

  /* the cassette, promoter drawn hollow: the one thing the synthesised
     oligo does NOT contain */
  const cassette =
    txt(175, CY + 13, "GCTT", 36, RED, 700, "start", MONO) +
    txt(1425, CY + 13, "TACT", 36, RED, 700, "end", MONO) +
    bone(255, 1345, CY) +
    spacer(290, 410, CY, 38) + txt(350, CY + 76, "spacer", 21, MUTED) +
    octagon(560, CY, 62) + txt(560, CY + 76, "terminator", 21, MUTED) +
    spacer(700, 820, CY, 38) + txt(760, CY + 76, "spacer", 21, MUTED) +
    promoter(900, CY, 100, 170, true) + txt(985, CY + 76, "promoter", 21, MUTED) +
    spacer(1180, 1300, CY, 38) + txt(1240, CY + 76, "spacer", 21, MUTED);

  /* Direction is not decoration: a type IIS site cuts AWAY from itself,
     so each pair has to read outward from the piece it is meant to leave
     behind.  Both BsmBI and both BsaI sites therefore point inward, at
     the material they keep; the BseRI pair in the middle points outward,
     because there it is the middle, the missing promoter, that is
     being opened up. */
  const F = [
    [150, 262, "G00101", MUTED, -1,  1],
    [278, 320, "BsmBI",  INK,    1,  1],
    [336, 378, "BsaI",   INK,   -1,  1],
    [394, 512, "spacer", MUTED,  1,  1],
    [536, 780, "terminator", INK, -1, 1],
    [806, 924, "spacer", MUTED,  1,  1],
    [940, 982, "BseRI",  INK,   -1, -1],
    [1002, 1044, "BseRI", INK,   1,  1],
    [1060, 1178, "spacer", MUTED, 1, 1],
    [1194, 1236, "BsaI",  INK,    1, -1],
    [1252, 1294, "BsmBI", INK,   -1, -1],
    [1310, 1450, "CA998", MUTED,  1, -1]
  ];
  const strip = F.map(f => feature(f[0], f[1], SY, f[2], f[3], f[4], f[5])).join("");

  /* The highlight is the feature redrawn on the attention rung, same
     shape, heavier stroke, blue name over a white patch that hides the
     ink one.  An earlier version boxed each site instead, and at this
     spacing the boxes of neighbouring levels ran into one another. */
  /* Lighting the pair IS the statement; the job each level does is in the
     spoken note, where the source deck keeps it.  An earlier draft captioned
     each one on the slide, which is text JCA's slide does not carry. */
  function level(pair){
    return pair.map(f => feature(f[0], f[1], SY, f[2], BLUE, f[4], f[5], true, 4.5)).join("");
  }

  const G = {
    cass: cassette,
    strip: strip,
    a: level([F[1], F[10]]),
    b: level([F[2], F[9]]),
    c: level([F[6], F[7]])
  };

  const S = [
{ note:"The other thing we need are robust terminators. This Tlib2 experiment has already been performed.",
  desc:"The TP cassette again, with one difference: the promoter is a dashed outline rather than a solid shape, because it is the one element the synthesised molecule does not carry. GCTT and TACT are still on the ends, and the terminator and the three spacers are still solid." },

{ note:"Tlib2 is a small library (61 members) of terminator parts from phage that are all unique in sequence and predicted to have high termination efficiency. Each one is also associated with three 20 bp spacer elements that are priming sites for PCR. The library is synthesized as a pool of long oligos, each encoding 1 terminator and 3 spacers, all unique.",
  desc:"A line under the title says 61 of these cassettes were synthesised as an oligo pool: everything but the promoter was included, and in its place were BseRI sites. Sixty-one different terminators, each with its own three spacers, all in one tube." },

{ note:"They follow this architecture with 3 levels of golden gate sites.",
  desc:"The oligo appears as a map beneath the cassette, its twelve features named along one line: an outer priming site G00101, then BsmBI, then BsaI, then a spacer, then the terminator, then a spacer, then two BseRI sites facing each other where the promoter is missing, then a spacer, then BsaI, then BsmBI, then the outer priming site CA998. Three different Golden Gate enzymes, each pair nested inside the last." },

{ note:"The BsmBI sites are for cloning the oligo pool into the reporter plasmid pTP2.",
  desc:"The outermost pair lights up in blue: the two BsmBI sites, one near each end of the oligo, boxed. A line beneath says they are what gets the pool into the reporter plasmid pTP2." },

{ note:"The BsaI sites will exist in the final TPcon part. It is used for integrationof the TPcon into a prototype plasmid undergoing optimization.",
  desc:"The next pair in lights up as well: the two BsaI sites, just inside the BsmBI ones. These are the pair that survives into the finished TPcon part and installs it in a prototype plasmid being optimised, they are the same pair that reads out as GCTT and TACT on the cassette above." },

{ note:"The BseRI sites are for joining the promoter into this reporter plasmid with the terminator.",
  desc:"The innermost pair lights up: the two BseRI sites in the middle, facing each other across the gap where the promoter is not. All three levels are now boxed and named, one line each, and the BseRI pair is what the promoter gets dropped into on the next slide." }
  ];

  window.Deck.sequence("tlib2", function(slide){
    const r = mount(slide, G);
    const paint = painter(slide, r, { cass: -1, strip: 2, a: 3, b: 4, c: 5 });
    paint(0, false);
    return { steps: S, go: paint };
  });
})();

/* ================================================================== *
 * 65, pP6-2A x pT6B3 = pT6B3P2A
 *
 * The payoff.  Both inputs already exist and both were made on the two
 * slides before this one; the only new thing is a BseRI Golden Gate
 * between them.  The two sticky ends are drawn and named, and they are
 * the same TC and GT that were marked red in the pP6 sequence on slide
 * 63, which is the reason for holding one treatment for junctions all
 * the way across the section.  The third step draws the product as the
 * TP cassette of slide 62, closing the section on the architecture it
 * opened with.
 * ================================================================== */
(function(){
  const TY = 355, PY = 540, QY = 745;

  const t6 = txt(130, 290, "pT6B3", 27, INK, 700, "start") +
    [[200, 246, "BsaI", INK, -1, 1],
     [266, 384, "spacer", MUTED, 1, 1],
     [410, 654, "terminator", INK, -1, 1],
     [680, 798, "spacer", MUTED, 1, 1],
     [880, 922, "BseRI", INK, -1, -1],
     [1000, 1042, "BseRI", INK, -1, 1],
     [1068, 1186, "spacer", MUTED, 1, 1],
     [1330, 1376, "BsaI", INK, -1, -1]].map(f => feature(f[0], f[1], TY, f[2], f[3], f[4], f[5])).join("");

  const p6 = txt(130, 470, "pP6-2A", 27, INK, 700, "start") +
    /* These two point inward, toward the promoter: BseRI cuts away from
       its own site, so to release the promoter with the TC and GT
       overhangs the sites have to read across it.  The pair in pT6B3
       points the other way for the same reason, there the middle is
       what gets discarded. */
    [[200, 300, "BseRI", INK, -1, 1],
     [430, 1130, "pP6-2A UBER promoter", INK, 1, 1],
     [1280, 1380, "BseRI", INK, -1, -1]].map(f => feature(f[0], f[1], PY, f[2], f[3], f[4], f[5])).join("");

  const join =
    path("M901 386C901 440 600 452 430 508", RED, 2.6, "none", ' stroke-dasharray="8 8"') +
    path("M1041 386C1041 440 1100 452 1130 508", RED, 2.6, "none", ' stroke-dasharray="8 8"') +
    rect(600, 428, 62, 34, RED, 2, "#ffffff", 3) + txt(631, 453, "TC", 21, RED, 700, "middle", MONO) +
    rect(1075, 428, 62, 34, RED, 2, "#ffffff", 3) + txt(1106, 453, "GT", 21, RED, 700, "middle", MONO);

  const prod =
    txt(130, 662, "pT6B3P2A", 27, INK, 700, "start") +
    txt(175, QY + 12, "GCTT", 32, RED, 700, "start", MONO) +
    txt(1425, QY + 12, "TACT", 32, RED, 700, "end", MONO) +
    bone(265, 1335, QY) +
    spacer(300, 400, QY, 34) + octagon(540, QY, 48) + spacer(680, 780, QY, 34) +
    promoter(880, QY, 74, 150) + spacer(1130, 1230, QY, 34) +
    txt(800, 818, "one complete TP part, the architecture slide 62 specified", 21, MUTED);

  const S = [
/* The source has two sentences for three beats, so one beat is silent.
   It is the first, a presenter can name two plasmids off the slide -
   rather than the join, which is the beat the section has been building
   to.  Nothing is invented to fill it. */
{ note:"",
  desc:"Two plasmids drawn as annotation maps, one above the other. pT6B3 on top is a Tlib2 hit: BsaI, a spacer, the terminator, a spacer, then two BseRI sites facing each other in the middle where the promoter is missing, then a spacer and the far BsaI. pP6-2A below is a pP6 hit: a BseRI site, the UBER promoter of clone 2A, and a second BseRI site. Neither has been cut yet." },

{ note:"Joining one of the hits from Tlib2, like pT6B3 here and a hit of pP6 – here clone 2A, is just an assembly reaction applied directly to the two plasmid DNAs using BseRI.",
  desc:"Two dashed red lines run from the BseRI pair in pT6B3 down to the two ends of the promoter in pP6-2A, showing which end meets which, and each is labelled with the two base sticky end it runs on: TC on the left, GT on the right. Those are the same two overhangs marked in red in the pP6 sequence on the slide before. Above, the construction file: GoldenGate pT6B3 pP6-2A BseRI gg, then Transform gg Mach1 Amp pT6B3P2A." },

{ note:"Try simulating the product of BseRI-based Golden Gate",
  desc:"The product, pT6B3P2A, drawn out: GCTT at the left end, a spacer, the terminator, a spacer, the promoter now solid and in place, a third spacer, and TACT at the right end. It is one complete TP part, exactly the architecture slide 62 specified." }
  ];

  window.Deck.sequence("bseri", function(slide){
    const r = mount(slide, { maps: t6 + p6, join: join, prod: prod });
    const paint = painter(slide, r, { maps: -1, join: 1, prod: 2 });
    paint(0, false);
    return { steps: S, go: paint };
  });
})();

})();
