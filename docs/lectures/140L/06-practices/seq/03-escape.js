/* ------------------------------------------------------------------ *
 * 03-escape.js — containment built into the organism, and why it is a
 * probability rather than a wall.
 *
 * DELIBERATELY NOT A TABLE OF ESCAPE FREQUENCIES.  Measured numbers are
 * garnish and they live in the note channel, where they can also carry
 * the distinction that matters: the weaker designs have MEASURED rates,
 * the best ones have DETECTION LIMITS, which is a different claim.
 *
 * What is on the slide is the argument and one piece of arithmetic the
 * room can do in its head:
 *
 *   10^9 cells/mL  x  10^-7..10^-6 per gene per generation
 *                                  = 10^2..10^3 broken copies per mL
 *
 * set against the old NIH certification standard for a host-vector
 * system, fewer than one escapee in 10^8.  The standard was written for
 * a population smaller than one overnight culture.
 *
 * THE FREQUENCY RANGE IS NOT A PUBLISHED NUMBER.  See the note channel
 * of the third beat; the assembly is the research agent's, from three
 * separately sourced routes, and it is defended as such or not at all.
 *
 * Superscripts are real Unicode characters, not HTML entities: these
 * strings are never parsed as HTML, so an entity would read literally.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

const BOX = [
  { t:"a crippled host",
    l:["lab K-12: cannot colonise a gut,",
       "does not last outside the flask"] },
  { t:"an auxotroph",
    l:["an essential metabolite deleted,",
       "and supplied only by you"] },
  { t:"no high-affinity iron",
    l:["iron inside a host is bound and",
       "scarce; delete the uptake system"] },
  { t:"a kill switch",
    l:["a toxin gene held off by an",
       "inducer that you control"] }
];
const BX = [150, 486, 822, 1158], BW = 292;

function paint(v, f){
  const g = G.el("g", {});

  if (v.box > 0.02){
    const h = G.grp(v.box);
    BOX.forEach(function(b, i){
      h.appendChild(G.box(BX[i], 228, BW, 132, C.blue));
      h.appendChild(G.text(BX[i] + BW/2, 268, b.t, 23, C.blue, 700));
      h.appendChild(G.lines(BX[i] + BW/2, 302, b.l, 18, C.muted, 400, "middle", 24));
    });
    h.appendChild(G.text(800, 404,
      "Each of these is a probability. None of them is a wall.", 28, C.ink, 700));
    g.appendChild(h);
  }

  if (v.fail > 0.02){
    const h = G.grp(v.fail);
    /* the two failure modes hang under the two boxes they belong to, so
       nobody has to be told which one cross-feeding defeats */
    h.appendChild(G.arrow(BX[1] + BW/2, 424, BX[1] + BW/2, 460, C.verm, 2.6));
    h.appendChild(G.text(BX[1] + BW/2, 492, "a neighbour feeds it", 23, C.verm, 700));
    h.appendChild(G.lines(BX[1] + BW/2, 522,
      ["a biotin auxotroph was rescued on biotin-free",
       "medium beside wild-type E. coli"], 18, C.muted, 400, "middle", 24));

    h.appendChild(G.arrow(BX[3] + BW/2, 424, BX[3] + BW/2, 460, C.verm, 2.6));
    h.appendChild(G.text(BX[3] + BW/2, 492, "selection breaks it", 23, C.verm, 700));
    h.appendChild(G.lines(BX[3] + BW/2, 522,
      ["the cassette is costly and highly transcribed,",
       "so its own burden recruits what destroys it"], 18, C.muted, 400, "middle", 24));

    h.appendChild(G.text(800, 596,
      "The failure modes are biological, so it degrades with population size and time.",
      25, C.verm, 700));
    g.appendChild(h);
  }

  if (v.math > 0.02){
    const h = G.grp(v.math);
    h.appendChild(G.path("M150 632L1450 632", C.rule, 2));
    h.appendChild(G.text(800, 686,
      "10⁹ cells/mL  ×  10⁻⁷ to 10⁻⁶ per gene per generation  =  10² to 10³ per mL",
      30, C.ink, 700));
    h.appendChild(G.text(800, 718,
      "already carrying a broken copy after one overnight, before any selection",
      21, C.muted, 400));
    h.appendChild(G.text(800, 762,
      "The old NIH certification standard for a host–vector system: fewer than 1 escapee in 10⁸.",
      23, C.blue, 700));
    h.appendChild(G.text(800, 796,
      "A single overnight culture is 10⁹ cells — written for a smaller population than you make by accident.",
      23, C.verm, 700));
    h.appendChild(G.text(800, 824,
      "The extreme case — a drive built to spread on purpose — is section six.",
      17, C.muted, 400));
    g.appendChild(h);
  }
  return g;
}

const FR = [];
let acc = {};
function beat(o){
  acc = Object.assign({}, acc, o.s || {});
  FR.push(Object.assign({}, o, {s:Object.assign({}, acc)}));
}

beat({ on:[], s:{box:1},
  cap:"", call:"",
  note:"The other half of biosecurity is not about who can order DNA. It is about what happens to the organism once it exists, and the idea is a good one: instead of relying on a building, build the containment into the cell. Four strategies, and you have met versions of all of them.\nA crippled host. Lab K-12 E. coli has been passaged in flasks for most of a century and it is bad at being an organism — it does not colonise a gut and it does not last long outside the incubator.\nAn auxotroph. Delete a gene for something essential, and the strain only grows where you supply that metabolite. It cannot live anywhere you are not feeding it.\nIron. Iron inside a host is almost all bound up by proteins that exist specifically to deny it to bacteria, so a high-affinity uptake system is how a pathogen competes for it. Delete that and the organism cannot get iron where it would matter.\nAnd a kill switch: a toxin gene that is held off by an inducer you control. Take the inducer away and the cell kills itself.\nNow the line at the bottom, and it is the frame for everything after it. Each of these is a probability. Not one of them is a wall. An autoclave is a wall — it is a physical process with a failure rate you can engineer. These are biology, and biology negotiates.",
  desc:"Four strategies for containment built into the organism: a crippled host that cannot colonise a gut or last outside the flask; an auxotroph missing an essential metabolite that only you supply; a strain with its high-affinity iron uptake deleted, since iron inside a host is bound and scarce; and a kill switch, a toxin gene held off by an inducer you control. Each is a probability rather than a wall."});

beat({ on:[], s:{fail:1}, dur:1400,
  cap:"", call:"",
  note:"So how do they actually fail? Not by somebody leaving a door open. They fail biologically, which is a different and worse thing.\nThe auxotroph gets fed. A natural auxotrophy is defeated by the neighbours — in the work this comes from, a biotin-auxotrophic E. coli grew on biotin-free medium when it was sitting next to wild-type E. coli, which is cross-feeding: the organism next door is leaking the thing you deleted. The world is not a defined medium. It is full of other cells making metabolites.\nAnd the kill switch is under continuous selection to break, every generation, forever. Think about what that cassette looks like to the cell: it is expensive, it is highly transcribed, and it does nothing for the cell except threaten it. Any cell that loses it outgrows the ones that keep it. And the mechanism by which it actually gets lost, most of the time, is not a point mutation — it is an insertion sequence transposing into it, and a costly, highly transcribed locus is a preferred insertion site. The cassette's own burden recruits the mechanism that destroys it. That is a genuinely unpleasant piece of engineering news: the harder you make the kill switch work, the more attractive a target it becomes.\nAnd that is the sentence at the bottom. The failure modes are biological, so the control degrades with population size and with time. A mechanical control does not get worse because you ran the experiment for longer.\nGARNISH, IF THE ROOM WANTS NUMBERS, AND MIND THE DISTINCTION. Synthetic auxotrophs that depend on a non-natural amino acid have been built, and the weaker designs have measured escape rates — one in a hundred thousand down to one in ten million for a single engineered codon, around one in two hundred million for three. The best designs do not have a measured rate at all; they have a DETECTION LIMIT, below about one in a hundred billion over a week or two. Those are different claims and you should not blur them: \"we did not detect an escapee\" is not \"the rate is zero\". One of those studies also sequenced the escapees it did find and identified a single amino acid change that restores growth without costing the cell anything under permissive conditions — a free escape route, which is the whole argument in one result. Sources: Rovner et al., Nature 518:89-93 (2015), which is also where the biotin cross-feeding observation comes from; Mandell et al., Nature 518:55-60 (2015).",
  desc:"The failure modes, drawn under the strategies they defeat. Under the auxotroph: a neighbour feeds it — a biotin auxotroph was rescued on biotin-free medium beside wild-type E. coli. Under the kill switch: selection breaks it — the cassette is costly and highly transcribed, so its own burden recruits the insertion-sequence machinery that destroys it. The conclusion: the failure modes are biological, so the control degrades with population size and time."});

beat({ on:[], s:{math:1}, dur:1400,
  cap:"", call:"",
  note:"And here is the arithmetic, which you can do in your head and which is the reason I did not give you a table of escape frequencies.\nA saturated overnight culture is about a billion cells per millilitre. Take an ordinary loss-of-function frequency — somewhere between one in ten million and one in a million, per gene, per generation. Multiply. Between a hundred and a thousand cells in every millilitre are already carrying a broken copy of your containment gene, after a single overnight, before any selection has acted at all. You did not do anything wrong. That is just what a population of that size does.\nNow put that next to the standard. The old NIH Guidelines certified a host-vector system as safe when fewer than one cell in a hundred million could escape. Fewer than one in ten to the eight. A single overnight culture is ten to the nine cells. The certification standard was written for a population smaller than the one you make by accident, overnight, in a tube you were not thinking about. That is not a scandal and nobody was being careless — it is what happens when a threshold set in one era meets scale from another, and it is the single most useful thing on this slide.\nPROVENANCE, AND BE HONEST ABOUT THIS IF YOU ARE PUSHED. The density, one to two times ten to the ninth cells per millilitre at stationary phase in rich medium at thirty-seven degrees, is sourced. The hundred-million certification standard is from the NIH Guidelines' host-vector certification appendix and reached this deck second-hand, through a published paper's introduction rather than from the appendix itself — mark that VERIFY before printing it on a handout. And the loss-of-function frequency is NOT a single published number. There is no canonical measured value. The research that built this deck assembled a defensible range of ten to the minus seven up to ten to the minus five from three separately sourced routes — point mutation rates per kilobase, frameshift and deletion rates at a reporter locus, and insertion-sequence transposition rates per genome per generation. I am deliberately carrying the conservative bottom of that range on the slide, so the number on the wall is the unflattering one. If a student asks where it comes from, the honest answer is that it is an order-of-magnitude assembly and not a citation, and the argument does not depend on which end of it you take: at ten to the minus five the answer is ten thousand cells per millilitre instead of a hundred, and you are even more wrong.\nAND THE FORWARD POINTER, one line and do not build it out: the extreme case is an organism engineered to spread on purpose, a gene drive, where containment stops being the question entirely. That is section six, when we get to things released outside containment.",
  desc:"The arithmetic. A billion cells per millilitre, times a loss-of-function frequency of one in ten million to one in a million per gene per generation, gives of order a hundred to a thousand cells per millilitre already carrying a broken copy after one overnight, before any selection. Set against it: the old NIH certification standard for a host-vector system was fewer than one escapee in a hundred million, while a single overnight culture is a billion cells — a standard written for a smaller population than you make by accident. A closing line points forward to gene drives, in section six."});

window.Deck.sequence("escape", function(slide){
  const s = G.scene(slide, 860, 888);
  s.finish();
  return G.run(s, FR, paint);
});
})();
