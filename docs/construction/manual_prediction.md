<script src="https://unpkg.com/seqviz"></script>
# PCR Product Prediction

In this module, you'll learn how to manually predict the result of a PCR reaction by reasoning through oligo binding, template strand directionality, and sequence construction — a critical step before performing any cloning experiment. This manual prediction process is foundational for verifying whether a cloning strategy will work as intended. While there are many tools and algorithms to help you design a cloning plan, this step is about checking whether that plan is correct. It's a skill you'll often use in the lab when results are unclear and you need to troubleshoot. Going through this process also deepens your understanding of how PCR works and how different sequence elements interact.

---
### Before You Try This...

Want a refresher on how PCR works at a mechanistic level? Watch this short, animated video:
> 📺 **Recommended Intro**: [PCR Animation – The Polymerase Chain Reaction](https://www.youtube.com/watch?v=2KoLnIwoZKU)

---
## Guided Walkthrough

We’ll begin with a simple scenario using a structured table format called `cf_shorthand`. You’ll encounter this notation in later tutorials, but here we’ll treat it as a straightforward summary of oligos and templates.

```
operation    primer1      primer2      template    product
PCR          exFor        exRev        pTemp1      pcrpdt

oligo        exFor        CAGCGGATCGGATCGGCGAC
oligo        exRev        CGGTTGTGCGGGCGGAACCAG
plasmid      pTemp1       CTGGTGACCCAGCGGATCGGATCGGCGACCCAAAGCGCCTGGTTCCGCCCGCACAACCGCGA
```

We have two primers (`exFor` and `exRev`) and a circular template plasmid (`pTemp1`). The task is to predict the PCR product, `pcrpdt`.

1. Search for the exact sequence of `exFor` in the template — it should match directly.

2. Take the reverse complement of `exRev`, then search for that in the template.

3. The product is the linear sequence between (and including) the forward primer and the reverse complement of the reverse primer.

Use your sequence editor to try this out yourself and compare your answer to the one below:

  <div id="viewer1"></div>
  <script>
    function waitForSeqViz(callback) {
      if (typeof seqviz !== "undefined" && seqviz.Viewer) {
        callback();
      } else {
        setTimeout(() => waitForSeqViz(callback), 50);
      }
    }

    waitForSeqViz(() => {
      seqviz
        .Viewer("viewer1", {
            "name": "pcrpdt",
            "seq": "CAGCGGATCGGATCGGCGACCCAAAGCGCCTGGTTCCGCCCGCACAACCG",
            "annotations": [
                { "name": "exFor", "start": 0, "end": 20, "color": "cyan", "direction": 1 },
                { "name": "exRev", "start": 29, "end": 50, "color": "#92ffa4", "direction": -1 }
            ],
          translations: [],
          viewer: "linear",
          showComplement: true,
          showIndex: true,
          style: { height: "75px", width: "100%" }
        })
        .render();
    });
  </script>
---
### PCR with 5' Tails

Now try a more advanced case where primers have 5' extensions (tails):

```
operation    primer1     primer2     template     product
PCR          exFor2      exRev2      pTemp1       pcrpdt2

oligo        exFor2      ccataGAATTCCAGCGGATCGGATCGGCGAC
oligo        exRev2      cagatGGATCCCTGGTTCCGCCCGCACAACCG
plasmid      pTemp1      CTGGTGACCCAGCGGATCGGATCGGCGACCCAAAGCGCCTGGTTCCGCCCGCACAACCGCGA
```

Only the **3' end** (the annealing region) of each primer must match the template exactly. Typically, that’s about 18 bp. The 5' ends (e.g., `ccataGAATTC`) do not match but will become part of the product.

1. Identify the annealing portion of each primer.
2. Replace the annealing region in the template with the full primer (end included).
3. Your product is the linear sequence spanning from full forward primer to full reverse primer (reverse complemented).

Compare your answer to the one below:

  <div id="viewer2"></div>
  <script>
    function waitForSeqViz(callback) {
      if (typeof seqviz !== "undefined" && seqviz.Viewer) {
        callback();
      } else {
        setTimeout(() => waitForSeqViz(callback), 50);
      }
    }

    waitForSeqViz(() => {
      seqviz
        .Viewer("viewer2", {
            "name": "pcrpdt",
            "seq": "ccataGAATTCCAGCGGATCGGATCGGCGACCCAAAGCGCCTCGGTTGTGCGGGCGGAACCAGGGATCCatctg",
            "annotations": [
                { "name": "exFor2", "start": 0, "end": 31, "color": "cyan", "direction": 1 },
                { "name": "exRev2", "start": 42, "end": 74, "color": "#92ffa4", "direction": -1 }
            ],
          translations: [],
          viewer: "linear",
          showComplement: true,
          showIndex: true,
          style: { height: "75px", width: "110%" }
        })
        .render();
    });
  </script>
---

### Inverse PCR (IPCR) on a Circular Template
> 📺 **Video demo**: [Watch how inverse PCR prediction works in ApE](https://www.youtube.com/watch?v=SPvvYWmMQ1I)  
Use this as a reference before or after the steps below — it's especially helpful when you're ready to try the inverse PCR example.

In IPCR, primers face away from each other on a circular template. Here’s how prediction works:

1. Find the annealing site of the forward primer.
2. Set the sequence origin to just before that site — this "rotates" the plasmid to linearize it at that position.
3. Reverse complement the reverse primer and find its match.
4. Delete all sequence outside the range of the new forward and reverse primers.
5. The resulting span is your predicted PCR product.

---


## Quiz: Can You Predict This Product?

Try manually predicting the product of this PCR reaction based on the primers and template given below.

```
operation    primer1     primer2     template   product
PCR          qFor        qRev        pQ1        quizpdt

oligo        qFor        ccataCATATGGTTCTTGATTCGATACG
oligo        qRev        cagatCTCGAGTTAGTGCTGTTCGAGGTCCTG
plasmid      pQ1         CACTCAAGGTTCAGGACCTCGAACAGCACTAACGGAAGAAATCCGATGGTTCTTGATTCGATACGTGGCCCCGAGGACCTCGCAT
```

Enter your predicted PCR product sequence in the box below:

<textarea id="pcrQuizInput" rows="4" style="width:100%; font-family:monospace;"></textarea>
<br>
<button onclick="checkPcrQuizAnswer()">Submit</button>
<p id="pcrQuizFeedback"></p>

<script>
function checkPcrQuizAnswer() {
  const correct = "ccataCATATGGTTCTTGATTCGATACGTGGCCCCGAGGACCTCGCATCACTCAAGGTTCAGGACCTCGAACAGCACTAACTCGAGatctg";
  const input = document.getElementById("pcrQuizInput").value.replace(/\s+/g, "");
  const feedback = document.getElementById("pcrQuizFeedback");
  if (input.toLowerCase() === correct.toLowerCase()) {
    feedback.innerHTML = "✅ Correct! Well done.";
    feedback.style.color = "green";
    if (window.progressManager) {
      window.progressManager.addCompletion("pcr_prediction_quiz", "correct");
    }
  } else {
    feedback.innerHTML = "❌ Not quite. Check your annealing regions and try again.";
    feedback.style.color = "red";
    if (window.progressManager) {
      window.progressManager.addCompletion("pcr_prediction_quiz", "incorrect");
    }
  }
}
</script>

---

## Simulating Digestion and Ligation

You’ve now practiced predicting PCR products. Let’s now expand on this by modeling what happens during digestion and ligation.

### Example Scenario

We’ll simulate digesting a PCR product and a second DNA fragment with compatible restriction sites and then ligating them together.

#### Inputs:

```
DNA fragment:   frag1
Sequence:       ccataCATATGGTTCTTGATTCGATACGTGGCCCCGAGGACCTCGCATCACTCAAGGTTCAGGACCTCGAACAGCACTAACTCGAGatctg

DNA fragment:   frag2
Sequence:       tcgagGAATTCAGCTGAGGTCGATGAGGTTGCGGTCGATGATCG

Note: frag2 contains a 5' XhoI site (CTCGAG) and an EcoRI site downstream.
```

#### Step 1: Digest both fragments

- **frag1** will be cut with **XhoI** (CTCGAG): find and cut at the site near the 3' end.
- **frag2** will be cut with **XhoI** as well.

Remember that XhoI cuts between C and T in C^TCGAG and leaves a 5' overhang.

#### Step 2: Simulate ligation

- Remove everything downstream of the XhoI site in `frag1`.
- Remove everything **upstream** of the XhoI site in `frag2`.
- Ligate the remaining ends to form the new construct.

You should now have a linear recombinant sequence with a seamless junction.

---

## Quiz: Simulate the Ligation Product

Use the frag1 and frag2 sequences above to simulate the product of digestion and ligation.

What is the final product sequence?

<textarea id="ligationQuizInput" rows="4" style="width:100%; font-family:monospace;"></textarea>
<br>
<button onclick="checkLigationQuizAnswer()">Submit</button>
<p id="ligationQuizFeedback"></p>

<script>
function checkLigationQuizAnswer() {
  const correct = "ccataCATATGGTTCTTGATTCGATACGTGGCCCCGAGGACCTCGCATCACTCAAGGTTCAGGACCTCGAACAGCACTAACTCGAGGAATTCAGCTGAGGTCGATGAGGTTGCGGTCGATGATCG";
  const input = document.getElementById("ligationQuizInput").value.replace(/\s+/g, "");
  const feedback = document.getElementById("ligationQuizFeedback");
  if (input.toLowerCase() === correct.toLowerCase()) {
    feedback.innerHTML = "✅ Correct! You've successfully simulated the ligation.";
    feedback.style.color = "green";
    if (window.progressManager) {
      window.progressManager.addCompletion("ligation_quiz", "correct");
    }
  } else {
    feedback.innerHTML = "❌ Not quite. Make sure you simulated the XhoI digestion sites and kept the correct fragments.";
    feedback.style.color = "red";
    if (window.progressManager) {
      window.progressManager.addCompletion("ligation_quiz", "incorrect");
    }
  }
}
</script>