
# Sequencing Confirmation



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

    ["q1", "q2", "q3"].forEach(function (q) {
      const selected = document.querySelector(`select[name="${q}"]`).value;
      const result = document.getElementById(`res_${q}`);
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

    if (allCorrect && typeof progressManager !== "undefined") {
      progressManager.addCompletion("strategy_scenarios", "correct");
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

Download the plasmid: [⬇️ pET-INS.seq](../assets/pET-INS.seq)

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

    // Check length first
    if (input.length < 18 || input.length > 25) {
      result.innerHTML = "❌ Primer must be between 18 and 25 bases.";
      return;
    }

    // Define correct region (upstream of T7 promoter)
    const correctRegion = "CGGTGATGTCGGCGATATAGGCGCCAGCAACCGCACCTGTGGCGCCGGTGATGCCGGCCACGATGCGTCCGGCGTAGAGGATCGAGATCTCGATCCCGCGAAAT";
    // Define known incorrect regions
    const reverseRegion = "ATTTCGCGGGATCGAGATCTCGATCCTCTACGCCGGACGCATCGTGGCCGGCATCACCGGCGCCACAGGTGCGGTTGCTGGCGCCTATATCGCCGACATCACCG";
    const downstreamRegion = "CTCGAGCACCACCACCACCACCACTGAGATCCGGCTGCTAACAAAGCCCGAAAGGAAGCTGAGTTGGCTGCTGCCACCGCTGAGCAATAACTAGCATAACCCCTTGGGGCCTCTAAACGGGTCTTGAGGGGTTTTTTGCTGAAAGGAGGAACTATATCCGGATTGGCGAATGGG";
    const wrongRegion = "ACGCGCCCTGTAGCGGCGCATTAAGCGCGGCGGGTGTGGTGGTTACGCGCAGCGTGACCGCTACACTTGCCAGCGCCCTAGCGCCCGCTCCTTTCGCTTTCTTCCCTTCCTTTCTCGCCACGTTCGCCGGCTTTCCCCGTCAAGCTCTAAATCGGGGGCTCCCTTTAGGGTTCCGATTTAGTGCTTTACGGCACCTCGACCCCAAAAAACTTGATTAGGGTGATGGTTCACGTAGTGGGCCATCGCCCTGATAGACGGTTTTTCGCCCTTTGACGTTGGAGTCCACGTTCTTTAATAGTGGACTCTTGTTCCAAACTGGAACAACACTCAACCCTATCTCGGTCTATTCTTTTGATTTATAAGGGATTTTGCCGATTTCGGCCTATTGGTTAAAAAATGAGCTGATTTAACAAAAATTTAACGCGAATTTTAACAAAATATTAACGTTTACAATTTCAGGTGGCACTTTTCGGGGAAATGTGCGCGGAACCCCTATTTGTTTATTTTTCTAAATACATTCAAATATGTATCCGCTCATGAATTAATTCTTAGAAAAACTCATCGAGCATCAAATGAAACTGCAATTTATTCATATCAGGATTATCAATACCATATTTTTGAAAAAGCCGTTTCTGTAATGAAGGAGAAAACTCACCGAGGCAGTTCCATAGGATGGCAAGATCCTGGTATCGGTCTGCGATTCCGACTCGTCCAACATCAATACAACCTATTAATTTCCCCTCGTCAAAAATAAGGTTATCAAGTGAGAAATCACCATGAGTGACGACTGAATCCGGTGAGAATGGCAAAAGTTTATGCATTTCTTTCCAGACTTGTTCAACAGGCCAGCCATTACGCTCGTCATCAAAATCACTCGCATCAACCAAACCGTTATTCATTCGTGATTGCGCCTGAGCGAGACGAAATACGCGATCGCTGTTAAAAGGACAATTACAAACAGGAATCGAATGCAACCGGCGCAGGAACACTGCCAGCGCATCAACAATATTTTCACCTGAATCAGGATATTCTTCTAATACCTGGAATGCTGTTTTCCCGGGGATCGCAGTGGTGAGTAACCATGCATCATCAGGAGTACGGATAAAATGCTTGATGGTCGGAAGAGGCATAAATTCCGTCAGCCAGTTTAGTCTGACCATCTCATCTGTAACATCATTGGCAACGCTACCTTTGCCATGTTTCAGAAACAACTCTGGCGCATCGGGCTTCCCATACAATCGATAGATTGTCGCACCTGATTGCCCGACATTATCGCGAGCCCATTTATACCCATATAAATCAGCATCCATGTTGGAATTTAATCGCGGCCTAGAGCAAGACGTTTCCCGTTGAATATGGCTCATAACACCCCTTGTATTACTGTTTATGTAAGCAGACAGTTTTATTGTTCATGACCAAAATCCCTTAACGTGAGTTTTCGTTCCACTGAGCGTCAGACCCCGTAGAAAAGATCAAAGGATCTTCTTGAGATCCTTTTTTTCTGCGCGTAATCTGCTGCTTGCAAACAAAAAAACCACCGCTACCAGCGGTGGTTTGTTTGCCGGATCAAGAGCTACCAACTCTTTTTCCGAAGGTAACTGGCTTCAGCAGAGCGCAGATACCAAATACTGTCCTTCTAGTGTAGCCGTAGTTAGGCCACCACTTCAAGAACTCTGTAGCACCGCCTACATACCTCGCTCTGCTAATCCTGTTACCAGTGGCTGCTGCCAGTGGCGATAAGTCGTGTCTTACCGGGTTGGACTCAAGACGATAGTTACCGGATAAGGCGCAGCGGTCGGGCTGAACGGGGGGTTCGTGCACACAGCCCAGCTTGGAGCGAACGACCTACACCGAACTGAGATACCTACAGCGTGAGCTATGAGAAAGCGCCACGCTTCCCGAAGGGAGAAAGGCGGACAGGTATCCGGTAAGCGGCAGGGTCGGAACAGGAGAGCGCACGAGGGAGCTTCCAGGGGGAAACGCCTGGTATCTTTATAGTCCTGTCGGGTTTCGCCACCTCTGACTTGAGCGTCGATTTTTGTGATGCTCGTCAGGGGGGCGGAGCCTATGGAAAAACGCCAGCAACGCGGCCTTTTTACGGTTCCTGGCCTTTTGCTGGCCTTTTGCTCACATGTTCTTTCCTGCGTTATCCCCTGATTCTGTGGATAACCGTATTACCGCCTTTGAGTGAGCTGATACCGCTCGCCGCAGCCGAACGACCGAGCGCAGCGAGTCAGTGAGCGAGGAAGCGGAAGAGCGCCTGATGCGGTATTTTCTCCTTACGCATCTGTGCGGTATTTCACACCGCATATATGGTGCACTCTCAGTACAATCTGCTCTGATGCCGCATAGTTAAGCCAGTATACACTCCGCTATCGCTACGTGACTGGGTCATGGCTGCGCCCCGACACCCGCCAACACCCGCTGACGCGCCCTGACGGGCTTGTCTGCTCCCGGCATCCGCTTACAGACAAGCTGTGACCGTCTCCGGGAGCTGCATGTGTCAGAGGTTTTCACCGTCATCACCGAAACGCGCGAGGCAGCTGCGGTAAAGCTCATCAGCGTGGTCGTGAAGCGATTCACAGATGTCTGCCTGTTCATCCGCGTCCAGCTCGTTGAGTTTCTCCAGAAGCGTTAATGTCTGGCTTCTGATAAAGCGGGCCATGTTAAGGGCGGTTTTTTCCTGTTTGGTCACTGATGCCTCCGTGTAAGGGGGATTTCTGTTCATGGGGGTAATGATACCGATGAAACGAGAGAGGATGCTCACGATACGGGTTACTGATGATGAACATGCCCGGTTACTGGAACGTTGTGAGGGTAAACAACTGGCGGTATGGATGCGGCGGGACCAGAGAAAAATCACTCAGGGTCAATGCCAGCGCTTCGTTAATACAGATGTAGGTGTTCCACAGGGTAGCCAGCAGCATCCTGCGATGCAGATCCGGAACATAATGGTGCAGGGCGCTGACTTCCGCGTTTCCAGACTTTACGAAACACGGAAACCGAAGACCATTCATGTTGTTGCTCAGGTCGCAGACGTTTTGCAGCAGCAGTCGCTTCACGTTCGCTCGCGTATCGGTGATTCATTCTGCTAACCAGTAAGGCAACCCCGCCAGCCTAGCCGGGTCCTCAACGACAGGAGCACGATCATGCGCACCCGTGGGGCCGCCATGCCGGCGATAATGGCCTGCTTCTCGCCGAAACGTTTGGTGGCGGGACCAGTGACGAAGGCTTGAGCGAGGGCGTGCAAGATTCCGAATACCGCAAGCGACAGGCCGATCATCGTCGCGCTCCAGCGAAAGCGGTCCTCGCCGAAAATGACCCAGAGCGCTGCCGGCACCTGTCCTACGAGTTGCATGATAAAGAAGACAGTCATAAGTGCGGCGACGATAGTCATGCCCCGCGCCCACCGGAAGGAGCTGACTGGGTTGAAGGCTCTCAAGGGCATCGGTCGAGATCCCGGTGCCTAATGAGTGAGCTAACTTACATTAATTGCGTTGCGCTCACTGCCCGCTTTCCAGTCGGGAAACCTGTCGTGCCAGCTGCATTAATGAATCGGCCAACGCGCGGGGAGAGGCGGTTTGCGTATTGGGCGCCAGGGTGGTTTTTCTTTTCACCAGTGAGACGGGCAACAGCTGATTGCCCTTCACCGCCTGGCCCTGAGAGAGTTGCAGCAAGCGGTCCACGCTGGTTTGCCCCAGCAGGCGAAAATCCTGTTTGATGGTGGTTAACGGCGGGATATAACATGAGCTGTCTTCGGTATCGTCGTATCCCACTACCGAGATATCCGCACCAACGCGCAGCCCGGACTCGGTAATGGCGCGCATTGCGCCCAGCGCCATCTGATCGTTGGCAACCAGCATCGCAGTGGGAACGATGCCCTCATTCAGCATTTGCATGGTTTGTTGAAAACCGGACATGGCACTCCAGTCGCCTTCCCGTTCCGCTATCGGCTGAATTTGATTGCGAGTGAGATATTTATGCCAGCCAGCCAGACGCAGACGCGCCGAGACAGAACTTAATGGGCCCGCTAACAGCGCGATTTGCTGGTGACCCAATGCGACCAGATGCTCCACGCCCAGTCGCGTACCGTCTTCATGGGAGAAAATAATACTGTTGATGGGTGTCTGGTCAGAGACATCAAGAAATAACGCCGGAACATTAGTGCAGGCAGCTTCCACAGCAATGGCATCCTGGTCATCCAGCGGATAGTTAATGATCAGCCCACTGACGCGTTGCGCGAGAAGATTGTGCAC";

    if (correctRegion.includes(input)) {
      result.innerHTML = "✅ Correct! This primer will initiate a read across T7 and INS.";
      if (typeof progressManager !== "undefined") {
        progressManager.addCompletion("primer_design", "correct");
      }
    } else if (reverseRegion.includes(input)) {
      result.innerHTML = "❌ This is the reverse complement of the correct primer. Try again using the forward strand.";
    } else if (downstreamRegion.includes(input)) {
      result.innerHTML = "❌ This primer is on the 3' end of INS, not upstream of your target.";
    } else if (wrongRegion.includes(input)) {
      result.innerHTML = "❌ This primer is not close enough to the target sequence";
    } else {
      result.innerHTML = "❌ That's not a valid primer for this purpose. Make sure you're selecting a sequence upstream of T7.";
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

### Quiz: Sequence Interpretation

Download the full quiz data set here:  

 [⬇️ Download All Cases (ZIP)](../assets/sequence_cases.zip)

Each folder in the zip includes:

- A `.str` model file
- A `.ab1` trace file
- A `.txt` read file

Below are six real-world sequencing cases. For each clone, download the files, analyze them, and select the best interpretation.

<form id="sequencing_cases_form">
  <ol>
    <li>
      <strong>Clone 1: JCAseq_pSB1A2-Bca9143</strong><br>
      Model: <a href="../assets/sequencing_files/JCAseq_pSB1A2-Bca9143.str" download>JCAseq_pSB1A2-Bca9143.str</a><br>
      Trace: <a href="../assets/sequencing_files/jca388_G00101_2007-03-10_E02_004.ab1" download>jca388_G00101_2007-03-10_E02_004.ab1</a><br>
      Calls: <a href="../assets/sequencing_files/jca388_G00101_2007-03-10_E02_004.txt" download>jca388_G00101_2007-03-10_E02_004.txt</a><br>
      <label for="case1_select">What is the outcome?</label>
      <select id="case1_select" name="case1">
        <option value="">--Select--</option>
        <option value="perfect">Perfect</option>
        <option value="perfect_partial">Perfect Partial</option>
        <option value="mixed">Mixed Clone</option>
        <option value="failed">Failed</option>
        <option value="silent_mutation">Silent Mutation</option>
        <option value="nonsense_mutation">Nonsense Mutation</option>
        <option value="missense_mutation">Missense Mutation</option>
        <option value="indel">Indel</option>
      </select>
      <span id="res_case1"></span>
    </li>
    <li>
      <strong>Clone 2: JCAseq_pSB1A2-Bca9144</strong><br>
      Model: <a href="../assets/sequencing_files/JCAseq_pSB1A2-Bca9144.str" download>JCAseq_pSB1A2-Bca9144.str</a><br>
      Trace: <a href="../assets/sequencing_files/jca388_G00101_2007-03-10_E02_005.ab1" download>jca388_G00101_2007-03-10_E02_005.ab1</a><br>
      Calls: <a href="../assets/sequencing_files/jca388_G00101_2007-03-10_E02_005.txt" download>jca388_G00101_2007-03-10_E02_005.txt</a><br>
      <label for="case2_select">What is the outcome?</label>
      <select id="case2_select" name="case2">
        <option value="">--Select--</option>
        <option value="perfect">Perfect</option>
        <option value="perfect_partial">Perfect Partial</option>
        <option value="mixed">Mixed Clone</option>
        <option value="failed">Failed</option>
        <option value="silent_mutation">Silent Mutation</option>
        <option value="nonsense_mutation">Nonsense Mutation</option>
        <option value="missense_mutation">Missense Mutation</option>
        <option value="indel">Indel</option>
      </select>
      <span id="res_case2"></span>
    </li>
    <li>
      <strong>Clone 3: JCAseq_pSB1A2-Bca9145</strong><br>
      Model: <a href="../assets/sequencing_files/JCAseq_pSB1A2-Bca9145.str" download>JCAseq_pSB1A2-Bca9145.str</a><br>
      Trace: <a href="../assets/sequencing_files/jca388_G00101_2007-03-10_E02_006.ab1" download>jca388_G00101_2007-03-10_E02_006.ab1</a><br>
      Calls: <a href="../assets/sequencing_files/jca388_G00101_2007-03-10_E02_006.txt" download>jca388_G00101_2007-03-10_E02_006.txt</a><br>
      <label for="case3_select">What is the outcome?</label>
      <select id="case3_select" name="case3">
        <option value="">--Select--</option>
        <option value="perfect">Perfect</option>
        <option value="perfect_partial">Perfect Partial</option>
        <option value="mixed">Mixed Clone</option>
        <option value="failed">Failed</option>
        <option value="silent_mutation">Silent Mutation</option>
        <option value="nonsense_mutation">Nonsense Mutation</option>
        <option value="missense_mutation">Missense Mutation</option>
        <option value="indel">Indel</option>
      </select>
      <span id="res_case3"></span>
    </li>
    <li>
      <strong>Clone 4: JCAseq_pSB1A2-Bca9146</strong><br>
      Model: <a href="../assets/sequencing_files/JCAseq_pSB1A2-Bca9146.str" download>JCAseq_pSB1A2-Bca9146.str</a><br>
      Trace: <a href="../assets/sequencing_files/jca388_G00101_2007-03-10_E02_007.ab1" download>jca388_G00101_2007-03-10_E02_007.ab1</a><br>
      Calls: <a href="../assets/sequencing_files/jca388_G00101_2007-03-10_E02_007.txt" download>jca388_G00101_2007-03-10_E02_007.txt</a><br>
      <label for="case4_select">What is the outcome?</label>
      <select id="case4_select" name="case4">
        <option value="">--Select--</option>
        <option value="perfect">Perfect</option>
        <option value="perfect_partial">Perfect Partial</option>
        <option value="mixed">Mixed Clone</option>
        <option value="failed">Failed</option>
        <option value="silent_mutation">Silent Mutation</option>
        <option value="nonsense_mutation">Nonsense Mutation</option>
        <option value="missense_mutation">Missense Mutation</option>
        <option value="indel">Indel</option>
      </select>
      <span id="res_case4"></span>
    </li>
    <li>
      <strong>Clone 5: JCAseq_pSB1A2-Bca9147</strong><br>
      Model: <a href="../assets/sequencing_files/JCAseq_pSB1A2-Bca9147.str" download>JCAseq_pSB1A2-Bca9147.str</a><br>
      Trace: <a href="../assets/sequencing_files/jca388_G00101_2007-03-10_E02_008.ab1" download>jca388_G00101_2007-03-10_E02_008.ab1</a><br>
      Calls: <a href="../assets/sequencing_files/jca388_G00101_2007-03-10_E02_008.txt" download>jca388_G00101_2007-03-10_E02_008.txt</a><br>
      <label for="case5_select">What is the outcome?</label>
      <select id="case5_select" name="case5">
        <option value="">--Select--</option>
        <option value="perfect">Perfect</option>
        <option value="perfect_partial">Perfect Partial</option>
        <option value="mixed">Mixed Clone</option>
        <option value="failed">Failed</option>
        <option value="silent_mutation">Silent Mutation</option>
        <option value="nonsense_mutation">Nonsense Mutation</option>
        <option value="missense_mutation">Missense Mutation</option>
        <option value="indel">Indel</option>
      </select>
      <span id="res_case5"></span>
    </li>
    <li>
      <strong>Clone 6: JCAseq_pSB1A2-Bca9148</strong><br>
      Model: <a href="../assets/sequencing_files/JCAseq_pSB1A2-Bca9148.str" download>JCAseq_pSB1A2-Bca9148.str</a><br>
      Trace: <a href="../assets/sequencing_files/jca388_G00101_2007-03-10_E02_009.ab1" download>jca388_G00101_2007-03-10_E02_009.ab1</a><br>
      Calls: <a href="../assets/sequencing_files/jca388_G00101_2007-03-10_E02_009.txt" download>jca388_G00101_2007-03-10_E02_009.txt</a><br>
      <label for="case6_select">What is the outcome?</label>
      <select id="case6_select" name="case6">
        <option value="">--Select--</option>
        <option value="perfect">Perfect</option>
        <option value="perfect_partial">Perfect Partial</option>
        <option value="mixed">Mixed Clone</option>
        <option value="failed">Failed</option>
        <option value="silent_mutation">Silent Mutation</option>
        <option value="nonsense_mutation">Nonsense Mutation</option>
        <option value="missense_mutation">Missense Mutation</option>
        <option value="indel">Indel</option>
      </select>
      <span id="res_case6"></span>
    </li>
  </ol>
  <button type="button" id="sequencing_cases_submit">Check Answers</button>
</form>
<div id="sequencing_cases_summary" style="margin-top: 12px; font-weight: 600;"></div>

<script>
document.addEventListener("DOMContentLoaded", function () {
  function shuffleOptions(selectEl, correctValue) {
    // Keep the placeholder (empty value) first
    const placeholder = selectEl.querySelector('option[value=""]') || selectEl.querySelector('option:first-child');
    const options = Array.from(selectEl.querySelectorAll('option')).filter(o => o !== placeholder);
    // Detach existing non-placeholder options
    options.forEach(o => selectEl.removeChild(o));
    // Fisher-Yates shuffle on actual elements
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    // Ensure the first non-placeholder option is not the correct answer
    if (options.length > 1 && options[0].value === correctValue) {
      const swapIdx = 1 + Math.floor(Math.random() * (options.length - 1));
      [options[0], options[swapIdx]] = [options[swapIdx], options[0]];
    }
    // Append back in order (placeholder first, then shuffled)
    options.forEach(o => selectEl.appendChild(o));
  }
  const answers = [
    "perfect",            // 1
    "indel",              // 2
    "perfect_partial",    // 3
    "indel",              // 4
    "failed",             // 5
    "missense_mutation"   // 6
  ];
  // Randomize options for each case select to reduce guessing
  for (let i = 1; i <= 6; ++i) {
    const sel = document.getElementById(`case${i}_select`);
    if (sel) shuffleOptions(sel, answers[i-1]);
  }

  // Utility getters to avoid hard-coding node lookups elsewhere if expanded
  function getCaseSelect(i) { return document.getElementById(`case${i}_select`); }
  function getCaseResult(i) { return document.getElementById(`res_case${i}`); }

  document.getElementById("sequencing_cases_submit").addEventListener("click", function () {
    let correctCount = 0;
    for (let i = 1; i <= 6; ++i) {
      const select = document.getElementById(`case${i}_select`);
      const result = document.getElementById(`res_case${i}`);
      if (!select) continue;
      if (select.value === answers[i-1]) {
        result.innerHTML = " ✅";
        correctCount += 1;
        if (typeof progressManager !== "undefined") {
          progressManager.addCompletion(`sequencing_case_${i}`, "correct");
        }
      } else {
        result.innerHTML = " ❌";
      }
    }
    const summary = document.getElementById("sequencing_cases_summary");
    if (summary) {
      if (correctCount === answers.length) {
        summary.textContent = "✅ All answers correct.";
        if (typeof progressManager !== "undefined") {
          progressManager.addCompletion("sequencing_cases_all_correct", "correct");
        }
      } else {
        summary.textContent = `You have ${correctCount} / ${answers.length} correct. Review your analyses and try again.`;
      }
    }
    // If any answer is wrong, reshuffle all option orders and clear incorrect selections
    if (correctCount !== answers.length) {
      for (let i = 1; i <= 6; ++i) {
        const sel = document.getElementById(`case${i}_select`);
        if (!sel) continue;
        // Clear only incorrect selections to placeholder to prevent mindless resubmits
        if (sel.value !== answers[i-1]) {
          sel.value = "";
        }
        shuffleOptions(sel, answers[i-1]);
      }
    }
  });
});
</script>