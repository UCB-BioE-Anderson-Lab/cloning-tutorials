# Assembly

In molecular cloning, “assembly” refers to joining two or more DNA molecules together into one. Two of the most common methods are **Golden Gate Assembly** and **Gibson Assembly**—together they cover nearly all modern cloning needs.

---

### Assembly Methods Overview

**Golden Gate Assembly** uses a **type IIS restriction enzyme** (e.g., *BsaI*, *BsmBI*, *BbsI*) to cut DNA at defined locations and generate sticky ends. These are then joined by **T4 DNA Ligase**.

**Gibson Assembly** uses an exonuclease to chew back DNA ends, allowing single-stranded overlaps to anneal. A polymerase fills in gaps and a ligase seals the nicks.

Both methods:

- Are performed in a single tube (one-pot)
- Run in a thermocycler
- Require specific enzyme buffers and careful setup

---

### What We're Doing Here

In the **pP6 experiment**, we only have one DNA fragment: the linear PCR product from earlier. Our goal is to **re-circularize it** by joining its ends together using **Golden Gate**.

This works because the PCR primers added **BsaI recognition sites**, which generate **complementary sticky ends** at each end of the linear product.

---

### Golden Gate Diagram

![Diagram of Golden Gate Assembly showing a DNA fragment with BsaI recognition sites flanking the sequence. After digestion, the enzyme produces non-palindromic sticky ends which guide correct ligation orientation. Final product is a seamless joint between two DNA fragments.](../images/golden_gate_reaction.png)

*Figure: Schematic of the pP6 assembly process. The plasmid pJ12 is first amplified by PCR using primers that introduce BsaI sites and overhangs. The resulting linear product is then re-circularized via Golden Gate Assembly. This is a special case of Golden Gate Assembly, also referred to as enzymatic inverse PCR (EIPCR), where the input and output are the same plasmid sequence in linear and circular forms, respectively.*

In the pP6 experiment, we only have a single linear DNA molecule—the full plasmid amplified by PCR. The primers introduce BsaI sites at both ends. When digested, the ends form compatible overhangs that allow the DNA to ligate back into a circle. This is a special case of Golden Gate where the product is a re-circularized version of the input.

![Diagram showing a three-step process for plasmid reassembly. Top: circular plasmid labeled pJ12 with ori (origin of replication), bla (antibiotic resistance), and amilGFP (fluorescent reporter) regions marked in gray, red, and yellow respectively. Green arrows indicate primers flanking the amilGFP region. Middle: linear PCR product with the same three regions, and green (N)n overhangs at each end. Bottom: reassembled circular plasmid labeled pP6 with the same features, showing successful Golden Gate Assembly.](../images/pP6_GG_scheme.png)
*Figure: The linear PCR product is digested by BsaI to expose sticky ends. These are self-compatible and ligate to form a circular plasmid.*

---

### Reaction Setup

Setting up a Golden Gate reaction is similar to setting up PCR. You pipette reagents in order from top to bottom, **adding enzymes last** to avoid denaturing them in pure water or incomplete mixtures.

| Volume | Reagent                     | Tube Label |
|--------|-----------------------------|------------|
| 6 µL   | ddH₂O (white rack)          | W____      |
| 1 µL   | 10× T4 Ligase Buffer (red)  | L____      |
| 2 µL   | z79 (your cleaned PCR DNA)  |            |
| 0.5 µL | T4 DNA Ligase               |            |
| 0.5 µL | BsaI                        |            |

- Label your reaction tube with your assigned code (e.g., `a79`).
- Place all reactions from your section together in a single thermocycler block.

---

### Thermocycler Program

We use the program **GG1**, which alternates between:

- **37°C** (cutting by BsaI)
- **16°C** (ligation by T4 Ligase)

The final steps:

- Extended 37°C incubation
- 65°C heat inactivation

---

### Lab Sheet Overview

| Label | Fragment | Product |
|-------|----------|---------|
| a79   | P6       | pP6     |

The **Label** is what you write on your PCR tube. **P6** refers to the PCR product you're assembling. Once the reaction is complete, the product is a **circularized plasmid** called **pP6**, ready for transformation.

---

### Scaling the Reaction

You can scale this up or down depending on your needs, but:

- Final buffer concentration must be 1×
- Avoid excessive DNA concentrations that may inhibit ligation

Typical scale is **10 µL**, matching what’s needed for competent cell transformation.

---

### 🧪 Quiz: Golden Gate Assembly

<form id="assembly_quiz_form">
  <h3>1️⃣ Assembly Purpose</h3>
  <p>What is the goal of the Golden Gate Assembly in the pP6 experiment?</p>
  <label><input type="radio" name="q1" value="a"> To prepare DNA for sequencing</label><br>
  <label><input type="radio" name="q1" value="b"> To combine multiple DNA fragments into one plasmid</label><br>
  <label><input type="radio" name="q1" value="c"> To circularize a linear DNA fragment using its self-compatible ends</label><br>
  <label><input type="radio" name="q1" value="d"> To amplify a gene using PCR</label><br>
  <p id="assembly_res_q1"></p>

  <h3>2️⃣ Reaction Setup</h3>
  <p>Which of the following is acceptable when setting up a Golden Gate reaction?</p>
  <label><input type="radio" name="q2" value="a"> Adding the enzyme first before any buffer or water</label><br>
  <label><input type="radio" name="q2" value="b"> Setting up the reaction in a standard Eppendorf tube</label><br>
  <label><input type="radio" name="q2" value="c"> Not mixing your reaction after setup</label><br>
  <label><input type="radio" name="q2" value="d"> Mixing the reaction thoroughly once everything has been added</label><br>
  <p id="assembly_res_q2"></p>

  <button type="button" id="assembly_submit_btn">Check Answers</button>
</form>

<script>
  document.getElementById("assembly_submit_btn").addEventListener("click", function () {
    const answers = {
      q1: "c",
      q2: "d"
    };
    ["q1", "q2"].forEach(function (q) {
      const selected = document.querySelector(`input[name="${q}"]:checked`);
      const result = document.getElementById(`assembly_res_${q}`);
      if (selected && selected.value === answers[q]) {
        result.innerHTML = "✅ Correct!";
        if (typeof progressManager !== "undefined") {
          progressManager.addCompletion(`assembly_${q}`, "correct");
        }
      } else {
        result.innerHTML = "❌ Try again.";
      }
    });
  });
</script>
<!-- 
### 🎥 Watch Before Lab

Watch the assembly tutorial video before coming to lab.
<iframe width="560" height="315" src="https://www.youtube.com/embed/gKHO0HHPsXg" frameborder="0" allowfullscreen></iframe> -->
