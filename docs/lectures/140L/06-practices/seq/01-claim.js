/* ------------------------------------------------------------------ *
 * 01-claim.js — a conclusion, and the thing actually holding it up.
 *
 * Was 85 words.  The argument is a load path: there are two routes into
 * this conclusion, one of them is empty, and the other one is not the
 * one anybody thinks they are using.  Drawn, the room can see that the
 * mechanism box is empty BEFORE being told, which is the only way this
 * lands without sounding like a trick.
 *
 * THE CLAIM IS TRUE AND THE SLIDE SAYS SO.  The point is not that GFP
 * E. coli is secretly dangerous — nobody should leave the room making
 * that claim.  The point is that from the inside you cannot tell "we
 * ruled this out" from "we have never had to", and those feel
 * identical.  The drawing keeps the claim box solid throughout for
 * exactly that reason: it is not being knocked down.
 *
 * PROVENANCE: this beat is JCA's own argument, from the source deck's
 * notes on the hypothetical-risks slide.  No external citation is
 * needed and none should be invented.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

const CBX = 400, CBY = 248, CBW = 800, CBH = 112;
const SY = 512, SH = 124, SW = 420;
const LX = 250, RX = 930;

function paint(v, f){
  const g = G.grp();

  if (v.claim > 0.02){
    const h = G.grp(v.claim);
    h.appendChild(G.box(CBX, CBY, CBW, CBH, C.ink, C.paper));
    h.appendChild(G.lines(CBX + CBW/2, CBY + 46,
      ["A laboratory E. coli overexpressing GFP",
       "cannot be dangerous."], 29, C.ink, 700, "middle", 38));
    h.appendChild(G.text(CBX + CBW/2, CBY + CBH + 32,
      "Everyone in this room believes this. It is probably true.",
      22, C.muted, 400));
    g.appendChild(h);
  }

  /* ---- the route everybody thinks they are standing on ----------- */
  if (v.mech > 0.02){
    const h = G.grp(v.mech);
    h.appendChild(G.el("rect", {x:LX, y:SY, width:SW, height:SH, rx:12,
      fill:"none", stroke:C.verm, "stroke-width":3, "stroke-dasharray":"11 8"}));
    h.appendChild(G.text(LX + SW/2, SY + 50, "from mechanism", 28, C.verm, 700));
    h.appendChild(G.text(LX + SW/2, SY + 84, "never established", 21, C.muted, 400));

    /* a broken arrow: it does not reach */
    h.appendChild(G.path(`M ${LX + SW/2 + 40} ${SY - 12} L 640 ${CBY + CBH + 66}`,
      C.verm, 3, "10 9"));
    g.appendChild(h);
  }

  /* ---- the route that is actually bearing the load --------------- */
  if (v.prec > 0.02){
    const h = G.grp(v.prec);
    h.appendChild(G.box(RX, SY, SW, SH, C.ink, C.paper));
    h.appendChild(G.text(RX + SW/2, SY + 50, "from precedent", 28, C.ink, 700));
    h.appendChild(G.text(RX + SW/2, SY + 84,
      "decades, and nothing happened", 21, C.muted, 400));
    h.appendChild(G.arrow(RX + SW/2 - 40, SY - 12, 980, CBY + CBH + 46,
      C.ink, 3.4));
    g.appendChild(h);
  }

  return g;
}

const FR = [];
const beat = o => FR.push(o);

beat({ on:[], s:{claim:1},
  cap:"",
  call:"",
  note:"Here is a sentence everybody in this room agrees with. A lab E. coli overexpressing green fluorescent protein cannot be dangerous. I agree with it. It is probably true, and I want that said plainly before I do anything else to it, because I am not about to knock it down. Now the question: what is the ARGUMENT? Not the conclusion — the argument. Say the mechanism by which that organism is ruled out as a hazard. Give them a moment to try.",
  desc:"The claim, set out on its own and left standing: a laboratory E. coli overexpressing GFP cannot be dangerous. Everyone in the room believes it, and it is probably true."});

beat({ on:[], s:{claim:1, mech:1},
  cap:"",
  call:"",
  note:"You will find you cannot, quite. You can gesture at it — K-12 is crippled, it does not colonise, GFP is just a beta barrel that folds and glows. But a mechanistic basis for ruling out ALL potential for harm in that organism has never actually been established. Nobody did that work. That is why the box is empty and why the line coming out of it does not reach the claim. I am not saying the mechanism is absent because the organism is dangerous. I am saying nobody ever had to supply it, so nobody did.",
  desc:"The first route into the claim, drawn empty: from mechanism, never established, with a broken line that does not reach the conclusion."});

beat({ on:[], s:{claim:1, mech:1, prec:1}, dur:1500,
  cap:"",
  call:"We cannot tell “we ruled this out” from “we have never had to”.",
  note:"THIS is what is actually holding the claim up. We assert the conclusion because it is obvious, and it is obvious because we have been doing it for decades and nothing has happened. So what we hold is a habit of classification, not an argument — and it happens to give the right answer in this case. The point is that we cannot distinguish, FROM THE INSIDE, between 'we ruled this out' and 'we have never had to'. Those two feel identical and they are not. AND WHY IT MATTERS MORE AS THE FIELD CHANGES: as long as you are moving genes between organisms that evolved alongside each other, precedent is a reasonable guide and that solid arrow is load-bearing. The moment you are designing from first principles — a pathway that has never existed, a host that has never seen it — precedent runs out, and the only thing left is the mechanism you can actually state. That is why this is a practices question and not a philosophy question: it is about which arguments you will still have when you stop recognising your own constructs.",
  desc:"The second route, solid and load-bearing: from precedent, decades and nothing happened. The closing line: we cannot tell we ruled this out from we have never had to."});

window.Deck.sequence("gfp", function(slide){
  const s = G.scene(slide, 792, 840);
  s.finish();
  return G.run(s, FR, paint);
});
})();
