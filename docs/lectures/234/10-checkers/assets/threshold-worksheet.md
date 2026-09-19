# Activity — pick a threshold, and defend it

**BioE 134/234 · Checkers I**

Your group gets one phenomenon. By the end of the period you owe the room three
things:

1. **A number.** The actual threshold you would put in the code.
2. **What it rests on.** A source, a calibration set, or a measurement — and if
   you have none of the three, say so out loud, because that is a finding.
3. **What you would have to run** to find out you were wrong.

You will not have enough information to be confident. That is deliberate, and it
is the normal condition of writing one of these.

---

## 1 · RNase E cleavage

Transcripts carrying RNase E sites are degraded faster, so a site inside your
design lowers expression for reasons that have nothing to do with translation.

The consensus is loose: an AU-rich single-stranded region, roughly `RAUUW`, with
a strong preference for accessible secondary structure around it.

- How many matches in a 1 kb CDS would you tolerate?
- Does a match matter equally everywhere in the transcript?
- The motif is five bases. How often does it occur by chance?

*Starting points:* JBC 272(1):609; JBC 269(14):10790

## 2 · Internal Shine–Dalgarno

An internal ribosome binding site can initiate translation in the middle of your
gene, producing a truncated protein and consuming ribosomes.

An SD is a purine-rich stretch complementary to the 3′ end of the 16S rRNA,
positioned roughly 5–13 nt upstream of a start codon.

- How good a match counts? `AGGAGG` is canonical; how much degeneracy is real?
- Does an internal ATG out of frame matter as much as one in frame?
- What does the spacing tolerance do to your false-positive rate?

## 3 · GC content extremes

Regions of very high or very low GC are hard to synthesise and hard to amplify,
and extreme GC affects duplex stability during assembly.

- Over what window do you even measure this? 20 bp? 50? The whole gene?
- What bounds — and are they symmetric?
- Your answer here is a claim about a vendor's process, not about the cell.
  Does that change what evidence you would want?

## 4 · Homopolymer runs

Long single-base runs cause polymerase slippage during synthesis and sequencing,
and are a common cause of indels in ordered DNA.

- How long is too long? Is the answer the same for A, T, G and C?
- Does this constraint come from the cell or from the supplier?
- Check a real vendor's published specification. Does it agree with your guess?

## 5 · Rare codons

Rare codons slow elongation and can cause ribosome stalling, particularly in runs.

- A single rare codon, or a run of them?
- What counts as rare — bottom 10% by frequency? Below some absolute rate?
- L11 showed that full-length CAI does *not* correlate with expression. Does
  that change what you think this checker should measure?

## 6 · Hairpins over the start codon

Secondary structure occluding the ribosome binding site is the dominant
preventable cause of an expression failure.

- Over what window? L11 gave you a specific answer; does it apply here?
- Count of base pairs, or free energy?
- A hairpin is not binary. Where does a continuous score become a boolean?

---

## Reporting back

One number, one sentence on what it rests on, one sentence on what would show
you were wrong. Groups will disagree on the same phenomenon. **That is the
point** — the disagreement is the visible form of how little of this is settled,
and you are about to go write six of these for real.
