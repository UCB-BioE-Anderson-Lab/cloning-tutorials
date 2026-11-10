/* ------------------------------------------------------------------ *
 * 39-luxsel.js : source 39, the two LuxR selection constructs.
 *
 * Registers:  luxsel
 *
 * WHY IT IS A CLICK-THROUGH.  The source draws a 2x2: each reporter
 * shown twice, once with the promoter ON and once OFF, four static
 * cartoons that you have to hold in your head at the same time.  JCA
 * asked for it animated on 2026-11-10, and it suits the material --
 * there are two reporters and two states of LuxR, and the only thing
 * worth saying is what happens in each combination.  So it is four
 * beats after the setup, one per cell of that table, and in each one
 * the current panel is live and the other is faded.
 *
 * THE LOGIC, which is the whole reason the slide exists:
 *
 *   pluxCAT    LuxR on  -> cat transcribed -> Cm resistant -> LIVES
 *              LuxR off -> no cat          -> Cm sensitive -> dies
 *   pluxBLIP   LuxR on  -> BLIP made, Bla inhibited -> Cb sensitive -> dies
 *              LuxR off -> no BLIP, Bla intact      -> Cb resistant -> LIVES
 *
 * Read down the LIVES column and the two reporters select for opposite
 * things with the same transcription factor, which is what makes the
 * pair a dual selection.  The four beats are laid out so that falls
 * out of clicking rather than having to be pointed at.
 *
 * COLOUR.  Vermillion is death: the verdict when the cell dies, and
 * the inhibition bar that causes it.  A live construct is ink, a
 * silent one is muted and dashed -- which is the source's own solid
 * and dashed arrows, kept.  The LuxR state chip at the top is the
 * input, and it is amber, this deck's second rung.
 *
 * Authored at 1400x620.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", AMBER = "#a99011",
      MUTED = "#9a9a9a", FAINT = "#d6d6d6";
const n2 = v => Math.round(v * 10) / 10;

/* ---- parts ---------------------------------------------------------- */
function cds(x0, w, y, label, colour){
  return '<rect x="' + x0 + '" y="' + (y - 19) + '" width="' + w +
         '" height="38" fill="#ffffff" stroke="' + colour + '" stroke-width="3"/>' +
         '<text x="' + n2(x0 + w/2) + '" y="' + (y - 32) + '" text-anchor="middle" ' +
         'font-family="inherit" font-style="italic" font-size="26" fill="' +
         colour + '">' + label + '</text>';
}
/* the bent arrow the source uses for a promoter */
function prom(x, y, colour, name, sub){
  let s = '<path d="M ' + x + ' ' + (y + 19) + ' L ' + x + ' ' + (y - 34) +
          ' L ' + (x + 30) + ' ' + (y - 34) + '" fill="none" stroke="' + colour +
          '" stroke-width="3.5" stroke-linejoin="round"/>' +
          '<path d="M ' + (x + 44) + ' ' + (y - 34) + ' L ' + (x + 28) + ' ' +
          (y - 42) + ' L ' + (x + 28) + ' ' + (y - 26) + ' Z" fill="' + colour + '"/>';
  if (name){
    s += '<text x="' + (x - 6) + '" y="' + (y - 54) + '" text-anchor="middle" ' +
         'font-family="inherit" font-size="25" fill="' + colour + '">' + name +
         '<tspan baseline-shift="sub" font-size="0.66em">' + sub + '</tspan></text>';
  }
  return s;
}
function backbone(x0, x1, y, colour){
  return '<line x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y +
         '" stroke="' + colour + '" stroke-width="3"/>';
}
/* a vertical consequence arrow: solid when it happens, dashed when it
   does not -- exactly the source's convention */
function down(x, y0, y1, on, colour){
  const c = on ? colour : MUTED;
  return '<line x1="' + x + '" y1="' + y0 + '" x2="' + x + '" y2="' + (y1 - 14) +
         '" stroke="' + c + '" stroke-width="' + (on ? 5 : 3.5) + '"' +
         (on ? '' : ' stroke-dasharray="9 8"') + '/>' +
         '<path d="M ' + x + ' ' + y1 + ' L ' + (x - 11) + ' ' + (y1 - 16) +
         ' L ' + (x + 11) + ' ' + (y1 - 16) + ' Z" fill="' + c + '"/>';
}
function txt(x, y, t, colour, size, weight, anchor){
  return '<text x="' + n2(x) + '" y="' + n2(y) + '" text-anchor="' +
         (anchor || "middle") + '" font-family="inherit" font-size="' +
         (size || 27) + '" font-weight="' + (weight || 400) + '" fill="' +
         (colour || INK) + '">' + t + '</text>';
}
function box(x0, y0, w, h, colour){
  return '<rect x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + h +
         '" fill="none" stroke="' + colour + '" stroke-width="3"/>';
}

/* ---- geometry ------------------------------------------------------- */
const AX = 70, AW = 560, BX = 710, BW = 620, BY = 150, BH = 408;
const ROW = 300;

/* ---- the two panels -------------------------------------------------- */
function panelCAT(live, luxOn){
  const c = live ? INK : FAINT;
  let s = box(AX, BY, AW, BH, live ? MUTED : FAINT);
  s += txt(AX + AW/2, BY - 26, "ON selection", c, 29, 700);
  s += txt(AX + AW/2, BY + 46, "pluxCAT", c, 27);
  s += backbone(AX + 60, AX + AW - 60, ROW, c);
  s += prom(AX + 92, ROW, luxOn && live ? INK : c, "P", "luxI");
  s += cds(AX + 184, 210, ROW, "cat", luxOn && live ? INK : c);
  s += down(AX + AW/2, ROW + 34, ROW + 120, luxOn, live ? c : FAINT);
  if (live){
    s += txt(AX + AW/2, ROW + 164,
             luxOn ? "Cm resistant" : "Cm sensitive", INK, 28);
    s += txt(AX + AW/2, ROW + 212, luxOn ? "the cell lives" : "the cell dies",
             luxOn ? INK : VERM, 29, 700);
  }
  return s;
}

function panelBLIP(live, luxOn){
  const c = live ? INK : FAINT;
  let s = box(BX, BY, BW, BH, live ? MUTED : FAINT);
  s += txt(BX + BW/2, BY - 26, "OFF selection", c, 29, 700);
  s += txt(BX + BW/2, BY + 46, "pluxBLIP", c, 27);
  /* PluxI -> bli, on the left */
  s += backbone(BX + 40, BX + 300, ROW, c);
  s += prom(BX + 62, ROW, luxOn && live ? INK : c, "P", "luxI");
  s += cds(BX + 140, 142, ROW, "bli", luxOn && live ? INK : c);
  /* a constitutive promoter -> bla, on the right */
  s += backbone(BX + 340, BX + 590, ROW, c);
  s += prom(BX + 362, ROW, c);
  s += cds(BX + 430, 148, ROW, "bla", c);
  /* BLIP inhibits Bla: the connector only bites when BLIP is there */
  const ic = live ? (luxOn ? VERM : MUTED) : FAINT;
  s += '<path d="M ' + (BX + 210) + ' ' + (ROW + 20) + ' L ' + (BX + 210) + ' ' +
       (ROW + 76) + ' L ' + (BX + 470) + ' ' + (ROW + 76) + '" fill="none" ' +
       'stroke="' + ic + '" stroke-width="' + (luxOn ? 4.5 : 3) + '"' +
       (luxOn ? '' : ' stroke-dasharray="9 8"') + '/>';
  s += '<line x1="' + (BX + 470) + '" y1="' + (ROW + 58) + '" x2="' + (BX + 470) +
       '" y2="' + (ROW + 94) + '" stroke="' + ic + '" stroke-width="' +
       (luxOn ? 5 : 3) + '"/>';
  /* Bla's own output: blocked when BLIP is made */
  s += down(BX + 504, ROW + 24, ROW + 132, !luxOn, live ? c : FAINT);
  if (live){
    s += txt(BX + 504, ROW + 176,
             luxOn ? "Cb sensitive" : "Cb resistant", INK, 28);
    s += txt(BX + BW/2, ROW + 224, luxOn ? "the cell dies" : "the cell lives",
             luxOn ? VERM : INK, 29, 700);
  }
  return s;
}

/* the LuxR state, which is the input to both panels */
function chip(state){
  if (state === null) return "";
  const t = state ? "LuxR active — its ligand is present"
                  : "LuxR inactive — no ligand it answers to";
  return '<rect x="430" y="36" width="540" height="52" rx="10" fill="#ffffff" ' +
         'stroke="' + AMBER + '" stroke-width="3"/>' +
         txt(700, 70, t, AMBER, 27, 700);
}

function draw(i){
  /* i: 0 setup, 1 CAT+LuxR on, 2 CAT+LuxR off, 3 BLIP+LuxR on, 4 BLIP+LuxR off */
  const catLive = i === 1 || i === 2, blipLive = i === 3 || i === 4;
  const luxOn = i === 1 || i === 3;
  let s = chip(i === 0 ? null : luxOn);
  s += panelCAT(i === 0 || catLive, i === 0 ? false : luxOn);
  s += panelBLIP(i === 0 || blipLive, i === 0 ? false : luxOn);
  return s;
}

/* ------------------------------------------------------------------ *
 * note: is the SOURCE's, verbatim, split at its own sentence breaks
 * across the five beats.  add: is written for the deck.
 * ------------------------------------------------------------------ */
const luxsel = [
  {
    note:"For positive selection, they employ the PluxI-cat construct as discussed before.  For the negative selection, the LuxI promoter drives the blip gene encoding a beta-lactamase inhibitory protein.  They also provide a constitutively-expressed Bla gene.  The selection strain here is ampicillin resistant.",
    desc:"Two reporter constructs side by side: pluxCAT on the left, and pluxBLIP on the right with a separate constitutive bla gene." },
  {
    note:"",
    add:"Take them one at a time. LuxR is active, its ligand is there. On pluxCAT the lux promoter fires, cat is transcribed, the cell is chloramphenicol resistant, and it lives. That is the positive selection and it is the obvious half.",
    desc:"LuxR active. On pluxCAT the promoter fires, cat is made, and the cell is chloramphenicol resistant and lives." },
  {
    note:"",
    add:"Now LuxR is inactive. No cat, no resistance, and on chloramphenicol the cell dies. So pluxCAT keeps whatever responds and throws away whatever does not.",
    desc:"LuxR inactive. No cat is made, and on chloramphenicol the cell dies." },
  {
    note:"However, if PluxI is activated, BLIP is expressed, Bla is inactivated, and the cells die on the antibiotic.  So, you can select against a functional LuxR.",
    add:"And this is the half that is worth drawing. The strain carries bla and is carbenicillin resistant to start with. Switch LuxR on and the lux promoter now makes BLIP, BLIP shuts down Bla, the resistance goes away, and the cell dies on carbenicillin. The reporter is wired backwards on purpose.",
    desc:"LuxR active on pluxBLIP: BLIP is made, it inhibits Bla, and the cell is carbenicillin sensitive and dies." },
  {
    note:"Operationally, they first apply the ON selection in the presence of their new small molecule C10HSL.  They then apply the negative selection in the presence of the old small molecule 3OC6HSL.  If you just apply the positive selection in such an experiment, you tend to pull out many variants that are constitutively on either by responding to an endogenous metabolite or by an internal conformation change.  However, when you include the negative selection, the only things that can pass both selections are the ones specific to the small molecule.",
    add:"And with LuxR inactive, no BLIP is made, Bla is left alone, and the cell survives on carbenicillin. Read down the two panels and you can see what you have: the same transcription factor, two reporters, and the cell lives in opposite cases. That is what lets you ask for a response to one molecule and silence to the other.",
    desc:"LuxR inactive on pluxBLIP: no BLIP, Bla is intact, and the cell is carbenicillin resistant and lives." }
];

window.Deck.sequence("luxsel", function(slide){
  const host = slide.querySelector("[data-luxsel]");
  if (!host) return { steps: luxsel.map(x => ({note:x.note, desc:x.desc})),
                      go: function(){} };
  function paint(i){
    host.innerHTML = '<svg viewBox="0 0 1400 620" ' +
      'xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + draw(i) + '</svg>';
  }
  paint(0);
  return {
    steps: luxsel.map(function(x){
      const spoken = x.note && x.add ? x.note + "  " + x.add : (x.note || x.add || "");
      return { note: spoken, desc: x.desc };
    }),
    go: function(i){ paint(i); }
  };
});

})();
