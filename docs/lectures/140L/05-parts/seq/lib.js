/* ------------------------------------------------------------------ *
 * lib.js — the drawing shell for the Parts deck's sequences.
 *
 * Named lib rather than parts.js, which is what the other 140L decks
 * call this file: in THIS deck "part" is the subject of the lecture and
 * a file called parts.js would be read as being about the content.
 *
 * The scene/run pair is the same contract as the other decks, so a
 * sequence written for one reads the same here:
 *
 *   const s = GP.scene(slide); ... s.finish();
 *   return GP.run(s, FRAMES, function(v, f){ ... return <g> });
 *
 *   FRAMES[i] = { on:[names], s:{key:0..1}, cap, call, note, desc, dur }
 *     on    which named parts are visible this beat
 *     s     continuous values, tweened between beats and handed to paint
 *
 * EVERY FRAME CARRIES EVERY KEY THAT SHOULD STILL BE ON SCREEN.  A key
 * missing from s:{} counts as zero, which is a silent deletion anywhere
 * but the first beat.  See AUTHORING.txt.
 *
 * The molecules below are drawn as the things they are rather than as
 * boxes: a polymerase with a cleft that seats on the DNA, a ribosome in
 * two subunits with the message running between them, a LysR regulator
 * with its two domains, salicylate as its actual structure, and GFP as
 * a barrel.  A cartoon that cannot be recognised is not a cartoon.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const NS = "http://www.w3.org/2000/svg";
const C = { ink:"#111111", blue:"#004373", verm:"#ba3a13", amber:"#a99011",
            muted:"#767676", rule:"#e2e2e2", paper:"#ffffff" };
const n2 = v => Math.round(v*10)/10;

function el(name, at, txt){
  const e = document.createElementNS(NS, name);
  for (const k in at) e.setAttribute(k, at[k]);
  if (txt != null) e.textContent = txt;
  return e;
}
function text(x, y, s, size, col, weight, anchor){
  return el("text", {x:x, y:y, "font-size":size, fill:col || C.ink,
    "font-weight":weight || 400, "text-anchor":anchor || "middle"}, s);
}
function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 3,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return el("path", a);
}
function grp(o){
  return el("g", o == null ? {} : {opacity:n2(Math.max(0, Math.min(1, o)))});
}
/* <b>/<em> are HTML and an SVG <text> is not HTML; assigning them through
   innerHTML drops the element and the words inside it, silently. */
function rich(t){
  return String(t)
    .replace(/<b>/g,  '<tspan font-weight="700">')
    .replace(/<em>/g, '<tspan font-style="italic">')
    .replace(/<\/(?:b|em)>/g, "</tspan>");
}

/* ---- the cell ---------------------------------------------------- *
 * One envelope, drawn as a rounded box.  Two lines rather than one,
 * because the thing salicylate crosses in beat 7 is a membrane and a
 * single stroke gives it nothing to cross.                            */
function envelope(x, y, w, h){
  const g = el("g", {});
  g.appendChild(el("rect", {x:x, y:y, width:w, height:h, rx:62,
    fill:"none", stroke:C.ink, "stroke-width":3}));
  g.appendChild(el("rect", {x:x + 11, y:y + 11, width:w - 22, height:h - 22,
    rx:52, fill:"none", stroke:C.muted, "stroke-width":2}));
  return g;
}

/* ---- DNA --------------------------------------------------------- */
function dna(x0, x1, y){
  return path("M" + x0 + " " + y + "H" + x1, C.ink, 3.5);
}
/* A gene, drawn as an arrow lying on the DNA so its direction is on the
   page rather than in the caption.  dir -1 points it leftward, which a
   divergently transcribed gene needs: nahR and Psal face away from each
   other across their shared regulatory region, and drawing them in
   tandem states a topology the molecule does not have. */
function gene(x, y, w, label, col, dir, h){
  const hh = h || 44, hl = Math.min(34, w*0.3), g = el("g", {}), d = dir === -1 ? -1 : 1;
  const body = d === 1
    ? "M" + x + " " + (y - hh/2) + "H" + (x + w - hl) + "L" + (x + w) + " " + y +
      "L" + (x + w - hl) + " " + (y + hh/2) + "H" + x + "Z"
    : "M" + (x + w) + " " + (y - hh/2) + "H" + (x + hl) + "L" + x + " " + y +
      "L" + (x + hl) + " " + (y + hh/2) + "H" + (x + w) + "Z";
  g.appendChild(el("path", {d:body, fill:C.paper, stroke:col,
    "stroke-width":3, "stroke-linejoin":"round"}));
  g.appendChild(text(x + w/2 + (d === 1 ? 4 : -4), y + 9, label, 25, col, 700));
  return g;
}

/* A promoter: the bent arrow that marks a transcription start. */
function promoter(x, y, label, col, dir){
  const d = dir === -1 ? -1 : 1, g = el("g", {});
  g.appendChild(path("M" + x + " " + (y + 14) + "V" + (y - 30) +
    "h" + (34*d), col, 3.4));
  g.appendChild(path("M" + (x + 34*d) + " " + (y - 30) +
    "l" + (-11*d) + " -9M" + (x + 34*d) + " " + (y - 30) +
    "l" + (-11*d) + " 9", col, 3.4));
  if (label) g.appendChild(text(x + 2*d, y + 46, label, 23, col, 700,
    d === 1 ? "start" : "end"));
  return g;
}
/* An operator: the stretch of DNA a regulator sits on.  Drawn as a
   thickened segment rather than a box, because it is the same molecule. */
function operator(x, w, y, col){
  return path("M" + x + " " + y + "h" + w, col || C.amber, 11);
}

/* ---- RNA --------------------------------------------------------- *
 * Drawn as a wave, per the style guide, so it separates from DNA by
 * shape and not only by colour.  u clips it, so a transcript can be
 * drawn being made.                                                   */
function rna(x0, x1, y, u, col){
  const t = Math.max(0, Math.min(1, u == null ? 1 : u));
  const end = x0 + (x1 - x0)*t, step = x1 >= x0 ? 26 : -26;
  if (Math.abs(end - x0) < 2) return el("g", {});
  let d = "M" + x0 + " " + y, x = x0, up = true;
  while (step > 0 ? x < end : x > end){
    const nx = step > 0 ? Math.min(x + step, end) : Math.max(x + step, end);
    d += "Q" + (x + (nx - x)/2) + " " + (y + (up ? -15 : 15)) + " " + nx + " " + y;
    x = nx; up = !up;
  }
  return path(d, col || C.verm, 3.4);
}

/* ---- RNA polymerase ---------------------------------------------- *
 * A body with a cleft cut into its underside, seated on the DNA it is
 * reading, plus the sigma subunit as a separate lobe -- separate
 * because the whole point of beat 13 is that sigma is shared and can
 * run out.                                                            */
function rnap(cx, y, col){
  const g = el("g", {}), c = col || C.ink;
  /* body: a dome whose base is interrupted by the cleft */
  g.appendChild(el("path", {d:
    "M" + (cx - 62) + " " + y +
    "V" + (y - 30) + "a62 62 0 0 1 124 0V" + y +
    "h-34l-12 -21h-32l-12 21Z",
    fill:C.paper, stroke:c, "stroke-width":3, "stroke-linejoin":"round"}));
  return g;
}
function sigma(cx, cy, col, label){
  const g = el("g", {}), c = col || C.blue;
  g.appendChild(el("ellipse", {cx:cx, cy:cy, rx:34, ry:24,
    fill:C.paper, stroke:c, "stroke-width":3}));
  g.appendChild(text(cx, cy + 8, label || "σ", 23, c, 700));
  return g;
}

/* ---- ribosome ---------------------------------------------------- *
 * Two subunits with the message running in the gap between them, which
 * is the one structural fact a learner needs from this shape.          */
function ribosome(cx, y, col){
  const g = el("g", {}), c = col || C.ink;
  /* large subunit above the message, small subunit below, and a real
     gap between them -- the message runs THROUGH the ribosome, and if
     the two lobes touch the shape reads as one blob with a line on it. */
  g.appendChild(el("path", {d:"M" + (cx - 54) + " " + (y - 11) +
    "a54 44 0 0 1 108 0Z", fill:C.paper, stroke:c, "stroke-width":3,
    "stroke-linejoin":"round"}));
  g.appendChild(el("path", {d:"M" + (cx - 45) + " " + (y + 11) +
    "a45 34 0 0 0 90 0Z", fill:C.paper, stroke:c, "stroke-width":3,
    "stroke-linejoin":"round"}));
  return g;
}

/* ---- NahR, a LysR-type regulator --------------------------------- *
 * Two domains, because the mechanism turns on them being different
 * things: a DNA-binding head and an effector-binding body.  open is
 * how far the effector pocket is swung, 0 .. 1.                        */
function nahr(cx, cy, open, col, lab){
  const g = el("g", {}), c = col || C.blue, o = open || 0;
  /* THIS SHAPE HAS BEEN WRONG TWICE.  A lobe stacked on a smaller lobe
     with two linkers read as a cartoon figure with legs; replacing it
     with a rounded silhouette carrying a notch and two bars read as a
     FACE, because a symmetrical blob with marks inside it always will.
     What it is now is what the textbook picture of a helix-turn-helix
     regulator actually is:
       - an irregular, ASYMMETRIC effector domain, with a notch on one
         shoulder where the ligand docks (it opens as `open` rises)
       - two helices below it, drawn as outlined capsules, one of them
         angled down into the DNA.  Nothing inside the body at all.    */
  const P = o*7;
  g.appendChild(el("path", {d:
    "M" + (cx - 34) + " " + (cy - 8) +
    "C" + (cx - 41) + " " + (cy - 33) + " " + (cx - 15) + " " + (cy - 49) +
      " " + (cx + 7) + " " + (cy - 45) +
    "C" + (cx + 31) + " " + (cy - 41) + " " + (cx + 42) + " " + (cy - 25) +
      " " + (cx + 37) + " " + (cy - 9) +
    "L" + (cx + 19 - P) + " " + (cy - 3) +
    "L" + (cx + 35) + " " + (cy + 6) +
    "C" + (cx + 31) + " " + (cy + 19) + " " + (cx + 7) + " " + (cy + 24) +
      " " + (cx - 15) + " " + (cy + 18) +
    "C" + (cx - 29) + " " + (cy + 14) + " " + (cx - 30) + " " + (cy + 3) +
      " " + (cx - 34) + " " + (cy - 8) + "Z",
    fill:C.paper, stroke:c, "stroke-width":3, "stroke-linejoin":"round"}));
  /* The two helices.  They start INSIDE the body outline and are short,
     so they read as part of one object; hung clear underneath it they
     read as legs.  The right-hand one is the recognition helix, and the
     caller seats it ON the DNA -- a helix that stops short of the
     molecule it is supposed to be gripping is the whole problem. */
  g.appendChild(el("rect", {x:cx - 17, y:cy + 4, width:15, height:30, rx:7.5,
    fill:C.paper, stroke:c, "stroke-width":2.8,
    transform:"rotate(-13 " + (cx - 10) + " " + (cy + 19) + ")"}));
  g.appendChild(el("rect", {x:cx + 2, y:cy + 6, width:15, height:34, rx:7.5,
    fill:C.paper, stroke:c, "stroke-width":2.8,
    transform:"rotate(11 " + (cx + 9) + " " + (cy + 23) + ")"}));
  if (lab) g.appendChild(text(cx, cy - 58, lab, 19, c, 700));
  return g;
}

/* ---- GFP --------------------------------------------------------- *
 * The barrel, with the chromophore on its axis.  lit fades the fill in,
 * which is the only place in this deck where a fill means anything.     */
function gfp(cx, cy, lit, col){
  const g = el("g", {}), c = col || C.amber, L = lit || 0;
  const w = 50, h = 68;
  if (L > 0.02) g.appendChild(el("ellipse", {cx:cx, cy:cy, rx:w + 16, ry:h*0.78,
    fill:c, "fill-opacity":n2(0.26*L), stroke:"none"}));
  g.appendChild(el("path", {d:"M" + (cx - w) + " " + (cy - h/2) +
    "v" + h + "a" + w + " 15 0 0 0 " + 2*w + " 0v" + (-h),
    fill:C.paper, stroke:c, "stroke-width":3, "stroke-linejoin":"round"}));
  g.appendChild(el("ellipse", {cx:cx, cy:cy - h/2, rx:w, ry:15,
    fill:C.paper, stroke:c, "stroke-width":3}));
  for (const dx of [-22, 0, 22])
    g.appendChild(path("M" + (cx + dx) + " " + (cy - h/2 + 9) + "v" + (h - 12), c, 1.9));
  if (L > 0.02) g.appendChild(el("circle", {cx:cx, cy:cy + 4, r:9,
    fill:c, "fill-opacity":n2(L), stroke:"none"}));
  return g;
}


/* ---- small molecules --------------------------------------------- *
 * Generated by RDKit from SMILES, not drawn by hand.  The hand-drawn
 * salicylate had its hydroxyl and its carboxyl META to each other, and
 * salicylate is 2-hydroxybenzoic acid: they are ortho.  A drawing that
 * is nearly a molecule is just a wrong molecule.
 *
 * gen-molecules.py in this directory writes img/mol-*.svg and refuses
 * to write a file whose structure does not match the formula it is
 * supposed to have.  Edit the SMILES there, re-run it; nothing here
 * knows any chemistry.
 *
 * The intrinsic sizes below are the canvases RDKit drew on, kept so a
 * caller can ask for a width and get the right height.               */
const MOLS = {
  salicylate:  [210, 162], arabinose: [200, 168],
  glucose:     [200, 162], galactose: [200, 162],
  lactose:     [290, 176], allolactose: [290, 176],
  camp:        [230, 192]
};
function mol(name, cx, cy, w, lab, col){
  const d = MOLS[name];
  if (!d) return el("g", {});
  const h = w*d[1]/d[0], g = el("g", {});
  g.appendChild(el("image", {href:"img/mol-" + name + ".svg",
    x:n2(cx - w/2), y:n2(cy - h/2), width:n2(w), height:n2(h)}));
  if (lab) g.appendChild(text(cx, n2(cy - h/2 - 12), lab, 21, col || C.verm, 700));
  return g;
}

/* ---- a DNA loop -------------------------------------------------- *
 * The segment between two sites bowing out while the sites converge,
 * which is what a regulator bridging two operators does to the
 * molecule.  b is 0 (flat) to 1 (fully looped).                       */
function loopSeg(xa, xb, y, b, col, w){
  /* The two sites end up ADJACENT -- one protein is holding both -- so
     the loop has to be thrown wide by the control points rather than by
     the span between its feet.  Splayed narrow it draws as a spike. */
  const h = 250*b, sp = 250*b;
  return path("M" + n2(xa) + " " + y +
    "C" + n2(xa - sp) + " " + n2(y - h) + " " + n2(xb + sp) + " " + n2(y - h) +
    " " + n2(xb) + " " + y, col || C.ink, w || 3.5);
}


/* ---- a membrane transporter -------------------------------------- *
 * Sits IN the envelope wall rather than beside it, with a channel
 * through it, because the whole point of LacY is that it is the hole.  */
function permease(cx, y, col, lab){
  const g = el("g", {}), c = col || C.blue;
  g.appendChild(el("path", {d:"M" + (cx - 34) + " " + (y - 46) +
    "h22v30q0 10 10 10h4q10 0 10 -10v-30h22v92h-22v-30q0 -10 -10 -10h-4q-10 0 -10 10v30h-22Z",
    fill:C.paper, stroke:c, "stroke-width":3, "stroke-linejoin":"round"}));
  if (lab) g.appendChild(text(cx, y + 76, lab, 21, c, 700));
  return g;
}

/* ---- a generic enzyme -------------------------------------------- *
 * A body with a cleft, seated on nothing: what distinguishes it from
 * the polymerase is that the cleft faces sideways and holds a
 * substrate rather than straddling a molecule.                        */
function enzyme(cx, cy, col, lab){
  const g = el("g", {}), c = col || C.blue;
  /* a disc with a WEDGE taken out of its right side.  An arc with the
     notch tacked on after it closes as a crescent instead -- the cleft
     has to be cut from a shape that was going to be closed anyway. */
  g.appendChild(el("path", {d:
    "M" + cx + " " + (cy - 40) +
    "A40 40 0 1 0 " + cx + " " + (cy + 40) +
    "L" + (cx + 15) + " " + (cy + 19) +
    "L" + (cx + 34) + " " + cy +
    "L" + (cx + 15) + " " + (cy - 19) + "Z",
    fill:C.paper, stroke:c, "stroke-width":3, "stroke-linejoin":"round"}));
  if (lab) g.appendChild(text(cx, cy + 64, lab, 21, c, 700));
  return g;
}

/* ---- cyclic AMP --------------------------------------------------- *
 * Adenine as the fused bicycle it is, the ribose as a pentagon, and
 * the phosphate closed back onto the sugar, which is what makes it
 * CYCLIC and is the only reason the cell can use its concentration as
 * a signal at all.                                                     */
function camp(cx, cy, s, col, lab){
  const g = el("g", {}), c = col || C.verm, k = s || 1;
  const poly = (pts, w) => path("M" + pts.map(p =>
    n2(cx + p[0]*k) + " " + n2(cy + p[1]*k)).join("L") + "Z", c, w || 2.4*k);
  /* adenine: six-ring fused to a five-ring */
  g.appendChild(poly([[-52,-26],[-38,-38],[-20,-32],[-16,-14],[-30,-2],[-48,-8]]));
  g.appendChild(poly([[-20,-32],[-2,-34],[6,-20],[-4,-8],[-16,-14]]));
  /* ribose */
  g.appendChild(poly([[22,-14],[40,-20],[52,-6],[42,10],[24,6]]));
  g.appendChild(path("M" + n2(cx + 6*k) + " " + n2(cy - 20*k) +
                     "L" + n2(cx + 22*k) + " " + n2(cy - 14*k), c, 2.4*k));
  /* the cyclic phosphate, closing the sugar back on itself */
  g.appendChild(path("M" + n2(cx + 42*k) + " " + n2(cy + 10*k) +
    "q" + n2(2*k) + " " + n2(28*k) + " " + n2(-20*k) + " " + n2(22*k) +
    "q" + n2(-20*k) + " " + n2(-4*k) + " " + n2(-6*k) + " " + n2(-26*k), c, 2.4*k));
  g.appendChild(text(cx + 30*k, cy + 40*k, "P", 17*k, c, 700));
  if (lab) g.appendChild(text(cx, cy - 50*k, lab, 19*k, c, 700));
  return g;
}

/* ---- a sharp bend at one point ------------------------------------ *
 * CRP kinks lac DNA by something close to ninety degrees.  The
 * upstream arm pivots about the site; everything downstream stays put,
 * because that is where the polymerase has to remain.                  */
function kinkArm(xp, y, x0, b, col, w){
  const a = -b*62*Math.PI/180;
  const L = xp - x0;
  return path("M" + n2(xp) + " " + y + "L" + n2(xp - L*Math.cos(a)) +
    " " + n2(y + L*Math.sin(a)), col || C.ink, w || 3.5);
}

/* ---- the alpha-CTD on its tether ---------------------------------- *
 * Drawn as a lobe on a flexible linker rather than as part of the
 * polymerase body, because the reach is the mechanism: it is how a
 * protein bound a long way upstream can touch the enzyme at all.       */
function actd(x0, y0, x1, y1, col){
  const g = el("g", {}), c = col || C.ink;
  const mx = (x0 + x1)/2, my = Math.min(y0, y1) - 46;
  g.appendChild(path("M" + n2(x0) + " " + n2(y0) + "Q" + n2(mx) + " " +
    n2(my) + " " + n2(x1) + " " + n2(y1), c, 2.4, "7 7"));
  g.appendChild(el("circle", {cx:n2(x1), cy:n2(y1), r:17,
    fill:C.paper, stroke:c, "stroke-width":3}));
  g.appendChild(text(n2(x1), n2(y1) + 6, "\u03B1", 18, c, 700));
  return g;
}


/* ---- ordering two events inside one beat -------------------------- *
 * Every key on a frame tweens 0..1 across the SAME transition, so two
 * things that must happen in order will otherwise happen at once.  The
 * case that caught this: a polymerase arriving at a promoter while its
 * transcript grew alongside it, which draws RNA being made by nothing.
 *
 *   early(v)  finishes at the half way point
 *   late(v)   has not started until the half way point
 *
 * Both are self-contained -- they do not depend on what the key was set
 * to on any other frame -- and both settle to 1, so a settled frame and
 * a reduced-motion jump are unaffected.                                */
const early = v => Math.max(0, Math.min(1, (v || 0)*2));
const late  = v => Math.max(0, Math.min(1, (v || 0)*2 - 1));

/* ---- the shell --------------------------------------------------- */
function scene(slide, capY, callY){
  const svg = el("svg", {viewBox:"0 0 1600 900", "aria-hidden":"true",
    style:"position:absolute;inset:0;pointer-events:none",
    "font-family":"Helvetica Neue,Arial,Helvetica,sans-serif"});
  const root = el("g", {});
  svg.appendChild(root);
  const parts = {}, dyn = el("g", {});
  const cap  = text(800, capY  || 792, "", 30, C.ink,  700);
  const call = text(800, callY || 834, "", 28, C.verm, 700);
  const api = {
    svg:svg, root:root, parts:parts, dyn:dyn,
    add: function(node){ root.appendChild(node); return node; },
    part: function(name, node){
      const g = el("g", {class:"o", "data-o":name});
      g.appendChild(node); root.appendChild(g); parts[name] = g; return g;
    },
    finish: function(){ root.appendChild(dyn);
                        root.appendChild(cap); root.appendChild(call);
                        slide.appendChild(svg); return api; },
    show: function(on, f, animated){
      root.classList.toggle("nofx", animated === false);
      for (const k in parts) parts[k].classList.toggle("in", on.indexOf(k) >= 0);
      cap.innerHTML  = rich((f && f.cap)  || "");
      call.innerHTML = rich((f && f.call) || "");
    }
  };
  return api;
}

function run(api, FR, paint){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
  const keys = [];
  FR.forEach(f => { for (const k in (f.s || {})) if (keys.indexOf(k) < 0) keys.push(k); });
  const state = f => { const o = {};
    keys.forEach(k => o[k] = (f.s && f.s[k]) || 0); return o; };
  let cur = null, raf = null;
  function go(i, animated){
    const f = FR[Math.max(0, Math.min(FR.length - 1, i | 0))];
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    const instant = animated === false || reduce.matches;
    api.show(f.on, f, instant);
    const to = state(f);
    if (!cur || instant){ cur = to; api.dyn.replaceChildren(paint(cur, f)); return; }
    const from = cur, t0 = performance.now(), dur = f.dur || 1200;
    raf = requestAnimationFrame(function step(now){
      const t = Math.min(1, (now - t0)/dur), e = ease(t), st = {};
      keys.forEach(k => st[k] = from[k] + (to[k] - from[k])*e);
      api.dyn.replaceChildren(paint(st, f)); cur = st;
      raf = t < 1 ? requestAnimationFrame(step) : null;
    });
  }
  go(0, false);
  return { steps: FR.map(x => ({note:x.note, desc:x.desc})), go: go };
}

window.GP = { C:C, el:el, text:text, path:path, grp:grp, rich:rich,
              envelope:envelope, dna:dna, gene:gene, promoter:promoter,
              operator:operator, rna:rna, rnap:rnap, sigma:sigma,
              ribosome:ribosome, nahr:nahr, regulator:nahr, gfp:gfp, mol:mol, loopSeg:loopSeg,
              permease:permease, enzyme:enzyme, camp:camp, kinkArm:kinkArm, actd:actd,
              scene:scene, run:run, early:early, late:late };
})();
