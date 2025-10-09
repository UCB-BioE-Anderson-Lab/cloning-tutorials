

# Sequencing Confirmation

<script>
  // Global progress helper for all quizzes on this page
  window.pmComplete = function (key, status) {
    if (window.progressManager && typeof window.progressManager.addCompletion === "function") {
      window.progressManager.addCompletion(key, status);
    }
  };
</script>



After you've completed your cloning, your next step is to verify the integrity of your plasmid. This tutorial walks through sequencing strategies and a practical workflow for confirming that your **confirmation region** matches the **model sequence**.

---

## Choosing the Right Strategy

Three options cover most needs. Choose based on scope and cost, then follow the analysis workflow below.

1. **Cycle sequencing** (as in the pP6 experiment) gives a ~1 kb window of high-quality sequence starting about 50 bp downstream of a primer. It is ideal for checking a specific region of a plasmid, such as an insert or promoter. *(Primer-based Sanger overview: [YouTube](https://www.youtube.com/watch?v=-QIMkQ4E_wE)).*
2. **Full-plasmid sequencing** from providers like Plasmidsaurus uses long-read nanopore technology to return the complete sequence of your plasmid. This is more expensive (~$15/sample), but you get the entire plasmid and can catch unexpected rearrangements or background DNA. *(Nanopore overview: [YouTube](https://www.youtube.com/watch?v=CGWZvHIi3i0&t=28s)).*
3. **NGS** (Next-Generation Sequencing) is a high-throughput approach designed for analyzing complex populations. You PCR-amplify your targets with adapters and submit the pool for deep sequencing. This is powerful, but expensive, and is more suitable for library screens than for single plasmid validation. *(NGS overview: [YouTube](https://www.youtube.com/watch?v=CZeN-IgjYCo)).*

| Method               | Cost/sample | Output                  | Best For                             |
|----------------------|-------------|--------------------------|----------------------------------------|
| Cycle sequencing     | ~$3.50      | ~1 kb from a primer     | Targeted region confirmation           |
| Full plasmid sequencing | ~$15        | Entire plasmid sequence | Whole-plasmid verification, structural issues |
| NGS (deep sequencing)| $750+       | Millions of short reads | Large libraries, pooled clone analysis |

📌 *Only cycle sequencing requires you to choose or design a primer. Full plasmid and NGS options use standardized workflows.*

---

### Quiz: Choosing a Sequencing Method

<form id="strategy_quiz_form">
  <p><strong>Scenario 1:</strong> You’re confirming that a single new antibiotic resistance gene was cloned correctly into a known plasmid backbone. Which sequencing method should you use?</p>
  <select name="q1">
    <option value="">--Select--</option>
    <option value="cycle">Cycle sequencing</option>
    <option value="full_plasmid">Full plasmid sequencing</option>
    <option value="ngs">NGS</option>
  </select>
  <p id="res_q1"></p>

  <p><strong>Scenario 2:</strong> You’ve made a library of 5,000 variants of a ribosome binding site in a plasmid and want to determine the distribution of sequences present. What’s the right method?</p>
  <select name="q2">
    <option value="">--Select--</option>
    <option value="cycle">Cycle sequencing</option>
    <option value="full_plasmid">Full plasmid sequencing</option>
    <option value="ngs">NGS</option>
  </select>
  <p id="res_q2"></p>

  <p><strong>Scenario 3:</strong> You’re validating the structure of a new multi-gene construct with internal repeats and want to ensure the whole thing is intact and mutation-free. Best method?</p>
  <select name="q3">
    <option value="">--Select--</option>
    <option value="cycle">Cycle sequencing</option>
    <option value="full_plasmid">Full plasmid sequencing</option>
    <option value="ngs">NGS</option>
  </select>
  <p id="res_q3"></p>

  <button type="button" id="strategy_submit_btn">Check Answers</button>
</form>

<script>
  document.getElementById("strategy_submit_btn").addEventListener("click", function () {
    const answers = {
      q1: "cycle",
      q2: "ngs",
      q3: "full_plasmid"
    };
    let allCorrect = true;
    let anyAnswered = false;

    ["q1", "q2", "q3"].forEach(function (q) {
      const selected = document.querySelector(`select[name="${q}"]`).value;
      const result = document.getElementById(`res_${q}`);
      if (selected) anyAnswered = true;
      if (selected === answers[q]) {
        result.innerHTML = "✅ Correct!";
      } else {
        if (q === "q1") {
          if (selected === "full_plasmid") {
            result.innerHTML = "❌ Full-plasmid sequencing is overkill for checking a small, known insert.";
          } else if (selected === "ngs") {
            result.innerHTML = "❌ NGS is too expensive and unnecessary for a single variant.";
          } else {
            result.innerHTML = "❌ Please select a valid option.";
          }
        } else if (q === "q2") {
          if (selected === "cycle") {
            result.innerHTML = "❌ Cycle sequencing is too limited to profile thousands of variants.";
          } else if (selected === "full_plasmid") {
            result.innerHTML = "❌ Full plasmid sequencing doesn't scale well to large pools like libraries.";
          } else {
            result.innerHTML = "❌ Please select a valid option.";
          }
        } else if (q === "q3") {
          if (selected === "cycle") {
            result.innerHTML = "❌ Cycle sequencing is not sufficient for validating large, repetitive constructs.";
          } else if (selected === "ngs") {
            result.innerHTML = "❌ While NGS can detect variants, it's not ideal for confirming single plasmid structures.";
          } else {
            result.innerHTML = "❌ Please select a valid option.";
          }
        }
        allCorrect = false;
      }
    });

    if (allCorrect) {
      pmComplete("strategy_scenarios", "correct");
    } else {
      pmComplete("strategy_scenarios", anyAnswered ? "incorrect" : "incomplete");
    }
  });
</script>


## Designing Your Primer (Cycle Sequencing Only)

If you're using cycle sequencing, you must provide a primer. This primer must bind upstream of the region you wish to confirm.

- The sequencing read begins ~50 bp downstream of the primer.
- You can use standard primers (e.g., M13rev, G00101), but only if your target region lies ~50 bp downstream of their site.
- Otherwise, design a custom primer:
  - Length: 18–25 bp
  - GC content: ~40–60%
  - Avoid long repeats or secondary structure
  - Must match the strand in the direction you wish to read

**Important:** Plasmid sequences are circular. In GenBank files, the “start” of the sequence is arbitrary. A feature near the beginning (like the T7 promoter) may require you to rotate the sequence to design a primer “upstream” of it, even if that’s technically the end of the GenBank string.

---

### Quiz: Primer Design for T7 + INS

Download the plasmid: [⬇️ pET-INS.seq](../../assets/pET-INS.seq)

Your goal: Design a 20 bp oligo that will allow a sequencing read to start at the **T7 promoter** and cover the **INS gene**.

Paste your oligo sequence below (5' to 3', exact match to template strand):

<form id="primer_quiz_form">
  <input type="text" name="primer" id="primer_input" size="60" />
  <p id="primer_result"></p>
  <button type="button" id="primer_submit_btn">Check Primer</button>
</form>

<script>
  document.getElementById("primer_submit_btn").addEventListener("click", function () {
    const input = document.getElementById("primer_input").value.toUpperCase().trim();
    const result = document.getElementById("primer_result");
    let logged = false;

    // Check length first
    if (input.length < 18 || input.length > 25) {
      result.innerHTML = "❌ Primer must be between 18 and 25 bases.";
      pmComplete("primer_design", "incomplete"); logged = true; return;
    }

    // Define correct region (upstream of T7 promoter)
    const correctRegion = "CGGTGATGTCGGCGATATAGGCGCCAGCAACCGCACCTGTGGCGCCGGTGATGCCGGCCACGATGCGTCCGGCGTAGAGGATCGAGATCTCGATCCCGCGAAAT";
    // Define known incorrect regions
    const reverseRegion = "ATTTCGCGGGATCGAGATCTCGATCCTCTACGCCGGACGCATCGTGGCCGGCATCACCGGCGCCACAGGTGCGGTTGCTGGCGCCTATATCGCCGACATCACCG";
    const downstreamRegion = "CTCGAGCACCACCACCACCACCACTGAGATCCGGCTGCTAACAAAGCCCGAAAGGAAGCTGAGTTGGCTGCTGCCACCGCTGAGCAATAACTAGCATAACCCCTTGGGGCCTCTAAACGGGTCTTGAGGGGTTTTTTGCTGAAAGGAGGAACTATATCCGGATTGGCGAATGGG";
    const wrongRegion = "ACGCGCCCTGTAGCGGCGCATTAAGCGCGGCGGGTGTGGTGGTTACGCGCAGCGTGACCGCTACACTTGCCAGCGCCCTAGCGCCCGCTCCTTTCGCTTTCTTCCCTTCCTTTCTCGCCACGTTCGCCGGCTTTCCCCGTCAAGCTCTAAATCGGGGGCTCCCTTTAGGGTTCCGATTTAGTGCTTTACGGCACCTCGACCCCAAAAAACTTGATTAGGGTGATGGTTCACGTAGTGGGCCATCGCCCTGATAGACGGTTTTTCGCCCTTTGACGTTGGAGTCCACGTTCTTTAATAGTGGACTCTTGTTCCAAACTGGAACAACACTCAACCCTATCTCGGTCTATTCTTTTGATTTATAAGGGATTTTGCCGATTTCGGCCTATTGGTTAAAAAATGAGCTGATTTAACAAAAATTTAACGCGAATTTTAACAAAATATTAACGTTTACAATTTCAGGTGGCACTTTTCGGGGAAATGTGCGCGGAACCCCTATTTGTTTATTTTTCTAAATACATTCAAATATGTATCCGCTCATGAATTAATTCTTAGAAAAACTCATCGAGCATCAAATGAAACTGCAATTTATTCATATCAGGATTATCAATACCATATTTTTGAAAAAGCCGTTTCTGTAATGAAGGAGAAAACTCACCGAGGCAGTTCCATAGGATGGCAAGATCCTGGTATCGGTCTGCGATTCCGACTCGTCCAACATCAATACAACCTATTAATTTCCCCTCGTCAAAAATAAGGTTATCAAGTGAGAAATCACCATGAGTGACGACTGAATCCGGTGAGAATGGCAAAAGTTTATGCATTTCTTTCCAGACTTGTTCAACAGGCCAGCCATTACGCTCGTCATCAAAATCACTCGCATCAACCAAACCGTTATTCATTCGTGATTGCGCCTGAGCGAGACGAAATACGCGATCGCTGTTAAAAGGACAATTACAAACAGGAATCGAATGCAACCGGCGCAGGAACACTGCCAGCGCATCAACAATATTTTCACCTGAATCAGGATATTCTTCTAATACCTGGAATGCTGTTTTCCCGGGGATCGCAGTGGTGAGTAACCATGCATCATCAGGAGTACGGATAAAATGCTTGATGGTCGGAAGAGGCATAAATTCCGTCAGCCAGTTTAGTCTGACCATCTCATCTGTAACATCATTGGCAACGCTACCTTTGCCATGTTTCAGAAACAACTCTGGCGCATCGGGCTTCCCATACAATCGATAGATTGTCGCACCTGATTGCCCGACATTATCGCGAGCCCATTTATACCCATATAAATCAGCATCCATGTTGGAATTTAATCGCGGCCTAGAGCAAGACGTTTCCCGTTGAATATGGCTCATAACACCCCTTGTATTACTGTTTATGTAAGCAGACAGTTTTATTGTTCATGACCAAAATCCCTTAACGTGAGTTTTCGTTCCACTGAGCGTCAGACCCCGTAGAAAAGATCAAAGGATCTTCTTGAGATCCTTTTTTTCTGCGCGTAATCTGCTGCTTGCAAACAAAAAAACCACCGCTACCAGCGGTGGTTTGTTTGCCGGATCAAGAGCTACCAACTCTTTTTCCGAAGGTAACTGGCTTCAGCAGAGCGCAGATACCAAATACTGTCCTTCTAGTGTAGCCGTAGTTAGGCCACCACTTCAAGAACTCTGTAGCACCGCCTACATACCTCGCTCTGCTAATCCTGTTACCAGTGGCTGCTGCCAGTGGCGATAAGTCGTGTCTTACCGGGTTGGACTCAAGACGATAGTTACCGGATAAGGCGCAGCGGTCGGGCTGAACGGGGGGTTCGTGCACACAGCCCAGCTTGGAGCGAACGACCTACACCGAACTGAGATACCTACAGCGTGAGCTATGAGAAAGCGCCACGCTTCCCGAAGGGAGAAAGGCGGACAGGTATCCGGTAAGCGGCAGGGTCGGAACAGGAGAGCGCACGAGGGAGCTTCCAGGGGGAAACGCCTGGTATCTTTATAGTCCTGTCGGGTTTCGCCACCTCTGACTTGAGCGTCGATTTTTGTGATGCTCGTCAGGGGGGCGGAGCCTATGGAAAAACGCCAGCAACGCGGCCTTTTTACGGTTCCTGGCCTTTTGCTGGCCTTTTGCTCACATGTTCTTTCCTGCGTTATCCCCTGATTCTGTGGATAACCGTATTACCGCCTTTGAGTGAGCTGATACCGCTCGCCGCAGCCGAACGACCGAGCGCAGCGAGTCAGTGAGCGAGGAAGCGGAAGAGCGCCTGATGCGGTATTTTCTCCTTACGCATCTGTGCGGTATTTCACACCGCATATATGGTGCACTCTCAGTACAATCTGCTCTGATGCCGCATAGTTAAGCCAGTATACACTCCGCTATCGCTACGTGACTGGGTCATGGCTGCGCCCCGACACCCGCCAACACCCGCTGACGCGCCCTGACGGGCTTGTCTGCTCCCGGCATCCGCTTACAGACAAGCTGTGACCGTCTCCGGGAGCTGCATGTGTCAGAGGTTTTCACCGTCATCACCGAAACGCGCGAGGCAGCTGCGGTAAAGCTCATCAGCGTGGTCGTGAAGCGATTCACAGATGTCTGCCTGTTCATCCGCGTCCAGCTCGTTGAGTTTCTCCAGAAGCGTTAATGTCTGGCTTCTGATAAAGCGGGCCATGTTAAGGGCGGTTTTTTCCTGTTTGGTCACTGATGCCTCCGTGTAAGGGGGATTTCTGTTCATGGGGGTAATGATACCGATGAAACGAGAGAGGATGCTCACGATACGGGTTACTGATGATGAACATGCCCGGTTACTGGAACGTTGTGAGGGTAAACAACTGGCGGTATGGATGCGGCGGGACCAGAGAAAAATCACTCAGGGTCAATGCCAGCGCTTCGTTAATACAGATGTAGGTGTTCCACAGGGTAGCCAGCAGCATCCTGCGATGCAGATCCGGAACATAATGGTGCAGGGCGCTGACTTCCGCGTTTCCAGACTTTACGAAACACGGAAACCGAAGACCATTCATGTTGTTGCTCAGGTCGCAGACGTTTTGCAGCAGCAGTCGCTTCACGTTCGCTCGCGTATCGGTGATTCATTCTGCTAACCAGTAAGGCAACCCCGCCAGCCTAGCCGGGTCCTCAACGACAGGAGCACGATCATGCGCACCCGTGGGGCCGCCATGCCGGCGATAATGGCCTGCTTCTCGCCGAAACGTTTGGTGGCGGGACCAGTGACGAAGGCTTGAGCGAGGGCGTGCAAGATTCCGAATACCGCAAGCGACAGGCCGATCATCGTCGCGCTCCAGCGAAAGCGGTCCTCGCCGAAAATGACCCAGAGCGCTGCCGGCACCTGTCCTACGAGTTGCATGATAAAGAAGACAGTCATAAGTGCGGCGACGATAGTCATGCCCCGCGCCCACCGGAAGGAGCTGACTGGGTTGAAGGCTCTCAAGGGCATCGGTCGAGATCCCGGTGCCTAATGAGTGAGCTAACTTACATTAATTGCGTTGCGCTCACTGCCCGCTTTCCAGTCGGGAAACCTGTCGTGCCAGCTGCATTAATGAATCGGCCAACGCGCGGGGAGAGGCGGTTTGCGTATTGGGCGCCAGGGTGGTTTTTCTTTTCACCAGTGAGACGGGCAACAGCTGATTGCCCTTCACCGCCTGGCCCTGAGAGAGTTGCAGCAAGCGGTCCACGCTGGTTTGCCCCAGCAGGCGAAAATCCTGTTTGATGGTGGTTAACGGCGGGATATAACATGAGCTGTCTTCGGTATCGTCGTATCCCACTACCGAGATATCCGCACCAACGCGCAGCCCGGACTCGGTAATGGCGCGCATTGCGCCCAGCGCCATCTGATCGTTGGCAACCAGCATCGCAGTGGGAACGATGCCCTCATTCAGCATTTGCATGGTTTGTTGAAAACCGGACATGGCACTCCAGTCGCCTTCCCGTTCCGCTATCGGCTGAATTTGATTGCGAGTGAGATATTTATGCCAGCCAGCCAGACGCAGACGCGCCGAGACAGAACTTAATGGGCCCGCTAACAGCGCGATTTGCTGGTGACCCAATGCGACCAGATGCTCCACGCCCAGTCGCGTACCGTCTTCATGGGAGAAAATAATACTGTTGATGGGTGTCTGGTCAGAGACATCAAGAAATAACGCCGGAACATTAGTGCAGGCAGCTTCCACAGCAATGGCATCCTGGTCATCCAGCGGATAGTTAATGATCAGCCCACTGACGCGTTGCGCGAGAAGATTGTGCAC";

    if (correctRegion.includes(input)) {
      result.innerHTML = "✅ Correct! This primer will initiate a read across T7 and INS.";
      pmComplete("primer_design", "correct"); return;
    } else if (reverseRegion.includes(input)) {
      result.innerHTML = "❌ This is the reverse complement of the correct primer. Try again using the forward strand.";
      pmComplete("primer_design", "incorrect"); return;
    } else if (downstreamRegion.includes(input)) {
      result.innerHTML = "❌ This primer is on the 3' end of INS, not upstream of your target.";
      pmComplete("primer_design", "incorrect"); return;
    } else if (wrongRegion.includes(input)) {
      result.innerHTML = "❌ This primer is not close enough to the target sequence";
      pmComplete("primer_design", "incorrect"); return;
    } else {
      result.innerHTML = "❌ That's not a valid primer for this purpose. Make sure you're selecting a sequence upstream of T7.";
      pmComplete("primer_design", "incorrect");
    }
  });
</script>

---

## Defining the Confirmation Target

Before you can interpret your sequencing results, you need to define the **confirmation target**, the specific region of the plasmid you care about confirming. The choice of this region depends on how much certainty you need about the sequence, and what can already be inferred from functional outcomes (e.g., antibiotic resistance, visible fluorescence, or selection as from an activity screen). As a rule of thumb, the confirmation target is a **subsequence of the full plasmid model** that includes:

- Any inserted or deleted regions
- Any modified regulatory elements (e.g., promoters, RBSs)
- Any junctions created by cloning
- Any regions you targeted for mutagenesis

### Case Study: pET-INS

For the pET-INS plasmid:

- The kanamycin resistance (**kanR**) and the origin of replication (**ori**) are inherited from the original pET28a vector. Since you selected colonies on a kanamycin plate, these must be functional. Even if they contain silent mutations, they won't affect your experiment, so they don’t need to be reconfirmed.
- The confirmation target is the **T7 promoter, RBS, and INS gene**, along with enough flanking sequence to include sites of oligo binding during construction.

This entire block (the T7 + RBS + INS insert) is the **confirmation region**, and it is treated as a whole. The sequencing read must cleanly and correctly cover this entire region to confirm the plasmid’s correctness.

Once you’ve defined your confirmation target, your task is to determine whether your sequencing read contains it accurately and completely. This involves aligning your read to the model plasmid and checking whether the confirmation region is covered and error-free.

---

## Analyzing Sequencing Data

To evaluate your sequencing outcome, you’ll align your sequencing read to the reference model and examine how well it covers your defined confirmation target.

### Performing an Alignment

Use **ApE** or **Benchling** to align the **read** to the **model sequence**. Check:  
1) Does the read start downstream of the primer as expected  
2) Does it **fully cover** the confirmation region with high-quality signal  
3) Are there **any differences** inside that region  

If coverage is complete and identical, your rubric call is **Perfect**. Otherwise, classify using **Types of Sequence Deviations** and the **Final Call Categories**.

### Types of Sequence Deviations


#### Point mutations
These are single base changes. In open reading frames (ORFs), they fall into three categories:

- **Silent**: The codon is changed, but the same amino acid is encoded.
- **Missense**: The codon is changed to encode a different amino acid.
- **Nonsense**: The codon is changed to a stop codon, truncating the protein.

If you find a single base difference between your sequencing read and the confirmation target within an ORF, translate the surrounding region in both the read and the model to determine whether the mutation is silent, missense, or nonsense.

![Alignment of model and read sequences showing a point mutation resulting in a stop codon. The codon TGC (Cys) in the model is mutated to TGA (Stop) in the read.](../images/point-nonsense-example.png)

*Figure: Example of a **nonsense mutation**. In the model, the codon **TGC** codes for cysteine (C). In the read, a point mutation changes it to **TGA**, a stop codon (\*), truncating the protein. This is a single base change with a major functional consequence.*


#### Indels
Insertions or deletions (indels) can be especially problematic in ORFs. If not in multiples of 3, they cause frameshifts, scrambling the downstream protein sequence. Even a single base insertion or deletion can shift the reading frame, changing every amino acid after the mutation and often introducing a premature stop codon. Indels in regulatory regions or non-coding areas may have less dramatic effects but can still disrupt motifs or regulatory elements.

![Alignment of model and read sequences showing a deletion. A 12 bp segment present in the model is missing from the read.](../images/indel-deletion-example.png)

*Figure: Example of an **indel mutation**. The model contains a region coding for multiple amino acids. In the read, this region is deleted, leading to a frameshift. All downstream codons are shifted, likely disrupting the entire ORF.*

| Deviation Type    | Description                                      | Effect in ORFs                   | Effect in Regulatory Regions        | Effect in Non-Coding           |
|-------------------|--------------------------------------------------|----------------------------------|------------------------------------|-------------------------------|
| Exact Match       | No differences                                   | ✅ Ideal                         | ✅ Ideal                           | ✅ Ideal                       |
| Silent Mutation   | Codon changes, same amino acid                   | Usually benign                   | May affect motif behavior          | None                          |
| Missense         | Codon changes, new amino acid                    | May change function              | Not applicable                     | None                          |
| Nonsense         | Creates stop codon                               | Likely disruptive                | Not applicable                     | None                          |
| Indel            | Insertion/deletion; may cause frameshift         | Frameshift if not multiple of 3; severe | May disrupt motifs/regulatory elements | Sometimes none               |
| Frameshift       | Insertion/deletion disrupting codons (not by 3)  | Severe                           | Not applicable                     | None                          |
| Regulatory change | Affects promoter, RBS, etc.                      | Not applicable                   | Can disrupt expression             | None                          |
| Structural error  | Duplication, truncation, or wrong orientation    | Varies                           | Varies                             | Varies                        |

### Quality Issues

Sometimes you can’t interpret the read because:

- **Ns or ambiguous bases**: Signal dropout or primer failure
- **Short reads**: May not reach the confirmation target
- **Mixed signals**: More than one DNA template in the reaction

![Examples of sequencing trace quality showing three types of read profiles: high-quality, low-quality, and mixed template.](../images/trace-quality-examples.png)

*Figure: Sequencing trace types. Left: **High-quality read** with tall, well-resolved peaks and clear base calls. Middle: **Low-quality signal** with noise and ambiguous bases. Right: **Mixed template** beginning around base 169, with two peaks at many positions (two DNA templates present).*

### Final Call Categories

Make a single call for each sample using the criteria below. Use the definitions in **Types of Sequence Deviations** and **Quality Issues** for how to recognize each pattern. Do not reinterpret those details here; this is only the final rubric.

- **Perfect**  
  The entire confirmation region is covered by high-quality signal and matches the model with no differences.

- **Perfect Partial**  
  All observed bases match the model, but part of the confirmation region is not covered by high-quality data. Report the verified coordinate range.

- **Silent Mutation**  
  A single-base substitution inside an ORF that does not change the encoded amino acid. Usually acceptable if function is retained; record the exact change.

- **Missense Mutation**  
  A single-base substitution inside an ORF that changes the amino acid. Requires judgment based on context and function; typically re-pick if alternatives exist.

- **Nonsense Mutation**  
  A single-base substitution inside an ORF that creates a stop codon. Treat as a failed clone for that construct.

- **Indel**  
  An insertion or deletion within the confirmation region. If not a multiple of three in an ORF it causes a frameshift. Treat as a failed clone unless the design intended it.

- **Mixed Clone**  
  The trace indicates more than one sequence population (double peaks or phase-shifted signal) within or spanning the confirmation region. Rerun from a single colony or re-isolate plasmid.

- **Failed**  
  Read quality is insufficient to evaluate the confirmation region, or the read cannot be aligned to the target in a meaningful way.

---

### Quiz: Single-case: pTP2 Clone A

pTP2 was one of the parent plasmids of pP6. We started with pTP1 that had a medium-strength promoter driving amilGFP. We then inserted the RBS and CDS of lacZα between the promoter and FP to get pTP2. We picked several clones of pTP2 and sent for sequencing with oligo G00101. The read, 69-pTP2AF_E09_071, was received for clone A. F means forward. The read and trace are provided below for download.

The confirmation region for plasmid pTP2 is the region from T4 (a terminator) to rrnpB T1 (another terminator).

**Question:** Is clone A consistent with the model?

**Downloads (Part 1)**

- Model: [pTP2.seq](../../assets/sequencing_files/pTP2.seq)
- Clone A forward read (trace): [69-pTP2AF_E09_071.ab1](../../assets/sequencing_files/69-pTP2AF_E09_071.ab1)
- Clone A forward read (base calls): [69-pTP2AF_E09_071.seq](../../assets/sequencing_files/69-pTP2AF_E09_071.seq)

<form id="ptp2_quiz_part1" style="margin-top: 12px;">
  <label for="part1_call"><strong>Final call for Clone A (forward read only):</strong></label>
  <select id="part1_call" name="part1_call" required>
    <option value="">--Select--</option>
    <option value="perfect">Perfect</option>
    <option value="perfect_partial">Perfect Partial</option>
    <option value="mixed">Mixed Clone</option>
    <option value="deletion">Deletion</option>
    <option value="point_mutation">Point Mutation</option>
    <option value="missense_mutation">Missense Mutation</option>
    <option value="nonsense_mutation">Nonsense Mutation</option>
    <option value="indel">Indel</option>
    <option value="failed">Failed</option>
  </select>

  <div id="part1_mixed_details" style="display:none; margin-top: 10px; padding: 8px; border: 1px solid #ddd;">
    <p><strong>If you chose Mixed Clone:</strong> Provide the apparent amino acid change and its position based on the forward read.</p>
    <label>Amino acid position: <input type="number" id="aa_pos_p1" min="1" step="1" placeholder="e.g., 34"></label><br>
    <label>From: 
      <input type="text" id="aa_from_p1" placeholder="e.g., Met or M">
    </label>
    <label>To: 
      <input type="text" id="aa_to_p1" placeholder="e.g., Ile or I">
    </label>
  </div>

  <div style="margin-top: 10px;">
    <button type="button" id="ptp2_part1_submit">Submit Part 1</button>
  </div>
  <p id="ptp2_part1_feedback" style="margin-top: 10px; font-weight: 600;"></p>
</form>

<div id="ptp2_part2" style="display:none; margin-top: 24px;">
  <hr>
  <p><strong>You correctly identified the apparent mixed position in the forward read.</strong> We also did a reverse read with primer <strong>ca998</strong>. Download the additional data below and answer again.</p>

  <p><strong>Downloads (Part 2)</strong></p>
  <ul>
    <li>Reverse read for Clone A (trace): <a href="../../assets/sequencing_files/70-pTP2AR_F09_069.ab1">70-pTP2AR_F09_069.ab1</a></li>
    <li>Reverse read for Clone A (base calls): <a href="../../assets/sequencing_files/70-pTP2AR_F09_069.seq">70-pTP2AR_F09_069.seq</a></li>
    <li>Model (again): <a href="../../assets/sequencing_files/pTP2.seq">pTP2.seq</a></li>
  </ul>


  <form id="ptp2_quiz_part2" style="margin-top: 12px;">
    <label for="part2_call"><strong>With both reads considered, is pTP2 a match to the expected sequence?</strong></label>
    <select id="part2_call" name="part2_call" required>
      <option value="">--Select--</option>
      <option value="perfect">Perfect</option>
      <option value="perfect_partial">Perfect Partial</option>
      <option value="mixed">Mixed Clone</option>
      <option value="deletion">Deletion</option>
      <option value="point_mutation">Point Mutation</option>
      <option value="missense_mutation">Missense Mutation</option>
      <option value="nonsense_mutation">Nonsense Mutation</option>
      <option value="indel">Indel</option>
      <option value="failed">Failed</option>
    </select>
    <div style="margin-top: 10px;">
      <button type="button" id="ptp2_part2_submit">Submit Part 2</button>
    </div>
    <p id="ptp2_part2_feedback" style="margin-top: 10px; font-weight: 600;"></p>
  </form>
</div>

<script>
(function () {
  // Progress manager helper (mirrors usage in other tutorials)
  function pmComplete(key, status) {
    if (window.progressManager && typeof window.progressManager.addCompletion === "function") {
      window.progressManager.addCompletion(key, status);
    }
  }
  // Utility: normalize amino acid tokens like "Ser" or "S"
  function normAA(s) {
    if (!s) return "";
    s = s.trim().toUpperCase();
    const map = {
      "ALA":"A","ARG":"R","ASN":"N","ASP":"D","CYS":"C",
      "GLN":"Q","GLU":"E","GLY":"G","HIS":"H","ILE":"I",
      "LEU":"L","LYS":"K","MET":"M","PHE":"F","PRO":"P",
      "SER":"S","THR":"T","TRP":"W","TYR":"Y","VAL":"V"
    };
    if (s.length > 1 && map[s]) return map[s];
    if (s.length === 1 && Object.values(map).includes(s)) return s;
    // Accept common text variants
    if (s === "SEC") return "U";
    return s.charAt(0); // fallback to first letter
  }

  const part1CallSel = document.getElementById("part1_call");
  const mixedDetails = document.getElementById("part1_mixed_details");
  const p1Btn = document.getElementById("ptp2_part1_submit");
  const p1Feedback = document.getElementById("ptp2_part1_feedback");
  const part2Block = document.getElementById("ptp2_part2");
  const p2Btn = document.getElementById("ptp2_part2_submit");
  const p2Feedback = document.getElementById("ptp2_part2_feedback");

  // Show details only when "mixed" is selected
  part1CallSel.addEventListener("change", function () {
    mixedDetails.style.display = (this.value === "mixed") ? "block" : "none";
    p1Feedback.textContent = "";
  });

  // Part 1 grading logic
  p1Btn.addEventListener("click", function () {
    const call = part1CallSel.value;
    if (!call) {
      p1Feedback.textContent = "Please choose a call before submitting.";
      return;
    }

    // Feedback rules
    if (call === "perfect") {
      p1Feedback.textContent = "Try again.";
      pmComplete("ptp2_quiz_part1", "incorrect");
      return;
    }
    if (call === "deletion") {
      p1Feedback.textContent = "Try again.";
      pmComplete("ptp2_quiz_part1", "incorrect");
      return;
    }
    if (call === "point_mutation" || call === "missense_mutation") {
      p1Feedback.textContent = "That is not the best interpretation for this read. Examine the trace carefully and look at the erroneous position.";
      pmComplete("ptp2_quiz_part1", "incorrect");
      return;
    }
    if (call === "perfect_partial") {
      p1Feedback.textContent = "If there are any errors present, then it is not perfect nor a partial validation.";
      pmComplete("ptp2_quiz_part1", "incorrect");
      return;
    }
    if (call !== "mixed") {
      p1Feedback.textContent = "Not quite. Re-examine the alignment and the trace.";
      pmComplete("ptp2_quiz_part1", "incorrect");
      return;
    }

    // Mixed selected: require details
    const pos = parseInt(document.getElementById("aa_pos_p1").value, 10);
    const fromAA = normAA(document.getElementById("aa_from_p1").value);
    const toAA = normAA(document.getElementById("aa_to_p1").value);

    if (!pos || !fromAA || !toAA) {
      p1Feedback.textContent = "Please provide the amino acid position and the from/to residues.";
      pmComplete("ptp2_quiz_part1_details", "incomplete");
      return;
    }

    // The correct forward-read apparent call is Ser -> Pro at position 98 due to a mixed peak where C is slightly dominant
    const correctPos = 98;
    const correctFrom = "S";
    const correctTo = "P";

    if (pos !== correctPos || fromAA !== correctFrom || toAA !== correctTo) {
      p1Feedback.textContent = "Close. Remember how to count amino acid positions from the correct start codon and translate the region. Re-check the trace.";
      pmComplete("ptp2_quiz_part1_details", "incorrect");
      pmComplete("ptp2_quiz_part1", "incorrect");
      return;
    }

    // Success Part 1
    p1Feedback.textContent = "✅ Correct. The forward read looks mixed at amino acid 98 with an apparent Ser to Pro. This unlocks Part 2.";
    pmComplete("ptp2_quiz_part1", "correct");
    pmComplete("ptp2_quiz_part1_details", "correct");
    part2Block.style.display = "block";
    // Scroll to Part 2
    part2Block.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Part 2 grading logic
  p2Btn.addEventListener("click", function () {
    const call2 = document.getElementById("part2_call").value;
    if (!call2) {
      p2Feedback.textContent = "Please choose a call before submitting.";
      return;
    }
    // Correct answer for Part 2 is Perfect after considering the reverse read
    if (call2 === "perfect") {
      p2Feedback.textContent = "✅ Correct. With the reverse read, the position is unambiguous and the sequence matches the model. This example was chosen to show how sequencing can appear ambiguous: a forward read suggested a difference, but adding the reverse read resolved it. In practice, this plasmid region has been sequenced many times as a parent of pP6, so confidence in its sequence is high. Most runs are less confusing; use single reads cautiously.";
      pmComplete("ptp2_quiz_part2", "correct");
    } else if (call2 === "perfect_partial") {
      p2Feedback.textContent = "If there are any errors present, then it is not perfect nor a partial validation.";
      pmComplete("ptp2_quiz_part2", "incorrect");
    } else if (call2 === "mixed") {
      p2Feedback.textContent = "Reconcile both traces and rethink your conclusions.";
      pmComplete("ptp2_quiz_part2", "incorrect");
    } else if (call2 === "deletion" || call2 === "indel") {
      p2Feedback.textContent = "Try again. With both reads, there is no evidence for a deletion or indel.";
      pmComplete("ptp2_quiz_part2", "incorrect");
    } else if (call2 === "point_mutation" || call2 === "missense_mutation" || call2 === "nonsense_mutation") {
      p2Feedback.textContent = "Reconcile both reads. There is no point, missense, or nonsense mutation here.";
      pmComplete("ptp2_quiz_part2", "incorrect");
    } else if (call2 === "failed") {
      p2Feedback.textContent = "Reconcile both traces and rethink your conclusions.";
      pmComplete("ptp2_quiz_part2", "incorrect");
    } else {
      p2Feedback.textContent = "Not quite. Re-check both reads and the model.";
      pmComplete("ptp2_quiz_part2", "incorrect");
    }
  });
})();
</script>