# Sequencing Confirmation

After you've completed your cloning, your next step is to verify the integrity of your plasmid. This tutorial walks through different sequencing strategies and how to choose and apply the right one for your purpose.

---

## Choosing the Right Strategy

There are three main sequencing strategies available, each suited to different goals and budgets:

1. **Cycle sequencing** (like you used in the pP6 experiment) gives a ~1 kb window of high-quality sequence starting about 50 bp downstream of a primer. It's ideal for checking a specific region of a plasmid—like an insert or promoter.
2. **Full-plasmid sequencing** from providers like Plasmidsaurus uses long-read nanopore technology to return the complete sequence of your plasmid. This is more expensive (~$15/sample), but you get the entire plasmid and can catch unexpected rearrangements or background DNA.
3. **NGS** (Next-Generation Sequencing) is a high-throughput approach designed for analyzing complex populations. You PCR-amplify your targets with adapters and submit the pool for deep sequencing. This is powerful, but expensive, and more suitable for library screens than for single plasmid validation.

| Method               | Cost/sample | Output                  | Best For                             |
|----------------------|-------------|--------------------------|----------------------------------------|
| Cycle sequencing     | ~$3.50      | ~1 kb from a primer     | Targeted region confirmation           |
| Full plasmid (Plasmidsaurus) | ~$15        | Entire plasmid sequence | Whole-plasmid verification, structural issues |
| NGS (deep sequencing)| $750+       | Millions of short reads | Large libraries, pooled clone analysis |

📌 *Only cycle sequencing requires you to choose or design a primer. Full plasmid and NGS options use standardized workflows.*

---

### Sequencing Scenarios

<form id="strategy_quiz_form">
  <p><strong>Scenario 1:</strong> You’re confirming that a single new antibiotic resistance gene was cloned correctly into a known plasmid backbone. Which sequencing method should you use?</p>
  <select name="q1">
    <option value="">--Select--</option>
    <option value="cycle">Cycle sequencing</option>
    <option value="plasmidsaurus">Full plasmid (Plasmidsaurus)</option>
    <option value="ngs">NGS</option>
  </select>
  <p id="res_q1"></p>

  <p><strong>Scenario 2:</strong> You’ve made a library of 5,000 variants of a ribosome binding site in a plasmid and want to determine the distribution of sequences present. What’s the right method?</p>
  <select name="q2">
    <option value="">--Select--</option>
    <option value="cycle">Cycle sequencing</option>
    <option value="plasmidsaurus">Full plasmid (Plasmidsaurus)</option>
    <option value="ngs">NGS</option>
  </select>
  <p id="res_q2"></p>

  <p><strong>Scenario 3:</strong> You’re validating the structure of a new multi-gene construct with internal repeats and want to ensure the whole thing is intact and mutation-free. Best method?</p>
  <select name="q3">
    <option value="">--Select--</option>
    <option value="cycle">Cycle sequencing</option>
    <option value="plasmidsaurus">Full plasmid (Plasmidsaurus)</option>
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
      q3: "plasmidsaurus"
    };
    let allCorrect = true;

    ["q1", "q2", "q3"].forEach(function (q) {
      const selected = document.querySelector(`select[name="${q}"]`).value;
      const result = document.getElementById(`res_${q}`);
      if (selected === answers[q]) {
        result.innerHTML = "✅ Correct!";
      } else {
        if (q === "q1") {
          if (selected === "plasmidsaurus") {
            result.innerHTML = "❌ Full-plasmid sequencing is overkill for checking a small, known insert.";
          } else if (selected === "ngs") {
            result.innerHTML = "❌ NGS is too expensive and unnecessary for a single variant.";
          } else {
            result.innerHTML = "❌ Please select a valid option.";
          }
        } else if (q === "q2") {
          if (selected === "cycle") {
            result.innerHTML = "❌ Cycle sequencing is too limited to profile thousands of variants.";
          } else if (selected === "plasmidsaurus") {
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


## Primer Design (Only for Cycle Sequencing)

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

### 🧠 Primer Design Quiz: T7 + INS

Download the plasmid: [📄 pET-INS.seq](../assets/pET-INS.seq)

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

## Interpreting Sequencing Results

You’ll typically receive:

- A `.txt` file: Base calls
- An `.ab1` file: Fluorescence trace

View these in **ApE** or **Benchling**.

Check:

- **High-quality region length**
- **Presence of expected features**
- **Any mismatches, gaps, or ambiguous bases**

---

## Understanding Mutation Consequences

### Mutation Ontology

| Type              | Definition                                     | Impact depends on location            |
|-------------------|------------------------------------------------|----------------------------------------|
| Exact match       | Identical to model                             | ✅ Ideal                              |
| Silent mutation   | Codon change, same amino acid                  | Often benign in ORFs                 |
| Missense mutation | Codon change, different amino acid             | Can affect protein function           |
| Nonsense mutation | Introduces stop codon                          | Usually disruptive                    |
| Frameshift        | Indels that alter codon frame                  | Likely severe                         |
| Regulatory change | Alters promoter/operator/UTR sequences         | Affects expression, may be subtle     |

---

## Activity: Compare Sequences

You’ll be given:
- A GenBank model
- A sequencing read (.txt/.ab1)
- Instructions to open and align in ApE

Your task:
- Confirm the region of interest is present and correct
- Identify and classify any differences
- Use the mutation ontology to describe impact

---

## 🧠 Quiz: Decision & Interpretation

<form id="confirmation_quiz_form">
  <h3>1️⃣ Which strategy is best if you want to verify the entire plasmid?</h3>
  <label><input type="radio" name="q1" value="a"> Cycle sequencing</label><br>
  <label><input type="radio" name="q1" value="b"> Plasmidsaurus</label><br>
  <label><input type="radio" name="q1" value="c"> NGS</label><br>
  <p id="conf_res_q1"></p>

  <h3>2️⃣ When do you need to design a primer?</h3>
  <label><input type="radio" name="q2" value="a"> When using Plasmidsaurus</label><br>
  <label><input type="radio" name="q2" value="b"> When using NGS</label><br>
  <label><input type="radio" name="q2" value="c"> When using cycle sequencing</label><br>
  <p id="conf_res_q2"></p>

  <h3>3️⃣ What type of mutation introduces a premature stop codon?</h3>
  <label><input type="radio" name="q3" value="a"> Silent</label><br>
  <label><input type="radio" name="q3" value="b"> Missense</label><br>
  <label><input type="radio" name="q3" value="c"> Nonsense</label><br>
  <p id="conf_res_q3"></p>

  <button type="button" id="confirmation_submit_btn">Check Answers</button>
</form>

<script>
  document.getElementById("confirmation_submit_btn").addEventListener("click", function () {
    const answers = {
      q1: "b",
      q2: "c",
      q3: "c"
    };
    ["q1", "q2", "q3"].forEach(function (q) {
      const selected = document.querySelector(`input[name="${q}"]:checked`);
      const result = document.getElementById(`conf_res_${q}`);
      if (selected && selected.value === answers[q]) {
        result.innerHTML = "✅ Correct!";
        if (typeof progressManager !== "undefined") {
          progressManager.addCompletion(`confirmation_${q}`, "correct");
        }
      } else {
        result.innerHTML = "❌ Try again.";
      }
    });
  });
</script>
