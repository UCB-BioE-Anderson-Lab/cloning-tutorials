# Golden Gate Assembly
 
 In previous tutorials, we built the **pET-INS** plasmid using both traditional restriction enzyme cloning and Gibson Assembly. In this tutorial, you'll use **Golden Gate Assembly** to build the same construct—while learning how this method enables precise, scar-controlled, multi-part DNA construction.
 
## What is Golden Gate Assembly?
 
![Diagram of Golden Gate Assembly showing a DNA fragment with BsaI recognition sites flanking the sequence. After digestion, the enzyme produces non-palindromic sticky ends which guide correct ligation orientation. Final product is a seamless joint between two DNA fragments.](../images/golden_gate_reaction.png)

Golden Gate Assembly is a method for joining DNA fragments using **Type IIs restriction enzymes** like **BsaI, BsmBI, BbsI,** and **SapI**. These enzymes cut a fixed number of bases away from their recognition sites, which allows the creation of custom 4 bp overhangs that control exactly where and how parts join together.

This makes Golden Gate powerful for:
- Precisely controlling ligation junctions
- Removing recognition sites from the final product
- Performing digestion and ligation in a single-pot reaction

It’s especially useful in modular cloning workflows where you want to reuse standard parts and tune junctions with custom scar sequences.

##  🎥 Video Demo
<iframe width="560" height="315" src="https://www.youtube.com/embed/gKHO0HHPsXg" frameborder="0" allowfullscreen></iframe>

 *(This video walks through the concept and shows how to design junctions and oligos in ApE.)*

 This is especially useful for modular cloning systems where you want reusable parts and consistent overhangs across many constructs.

 ---
 
 The core trick is that:

 - **Digestion and ligation occur in a single pot**, in the same reaction mix.
 - The recognition sites are designed to be removed from the final product.
 - The sticky ends can be *custom-designed*, so the resulting ligation has seamless (or deliberately scarred) junctions.
 
 ⚠️ This means:

 - The recognition site **must not appear** in the final product, or it will be re-cleaved.
 - The method can be iterated using the same enzyme again and again, since the site is removed during assembly.
 
 ---
 
## Designing Golden Gate Oligos
 
 Golden Gate Assembly gives you full control over sticky ends—but that means **you** have to design them. Here’s the process you'll follow, which is also demonstrated in the video walkthrough:
 
### Step 1: Model Your Product
 
 Open your vector and insert sequences, and build a mockup of the **final product** in your editor. Use:

 - **Feature annotations** or
 - **Uppercase/lowercase casing**  

 to track which parts come from each source. This helps you clearly mark junctions.
 
### Step 2: Define Sticky Ends
 
 At each junction:

 - Pick a **4 bp sticky end**—these should be non-palindromic (e.g., avoid `AATT`, `GATC`, etc.) to ensure correct orientation.
 - Create a feature annotation called `"junction"` over those 4 bases.
 
 > 💡 Tip: If you’re unsure about orientation after simulating, remember there are only two possibilities—it’s either the sequence you expect or its reverse complement.

### Step 3: Design Oligos

Design the **junction + annealing region** for each oligo first. These are the 3′ ends that will bind to your template.

**1. Forward oligo:**
- From the forward strand of your product, copy the 4 bp sticky end **plus ~20 bp downstream** (i.e., to the right).
- This is your **junction + anneal** region.

**2. Reverse oligo:**
- From the reverse strand of your product, copy the 4 bp sticky end **plus ~20 bp upstream** (i.e., to the left).
- Reverse complement this sequence. This is your **junction + anneal** region for the reverse oligo.

**3. Add the Golden Gate prefix to both:**

Add the following 5′ tail to both the forward and reverse oligos:

```
ccataGGTCTCa
```

This includes:
- `ccata` = arbitrary tail
- `GGTCTC` = BsaI recognition site
- `a` = one-base spacer before the sticky

**Final orientation of Golden Gate oligos (both forward and reverse):**

```
5' tail - BsaI - spacer - sticky end - annealing region - 3'
```

> ⚠️ Important: For the **reverse oligo**, only the junction + annealing region is reverse complemented. The prefix remains in forward orientation.

Do the same for each junction.  Realistically, you can do this PCR-based variant of Golden Gate for up to 4 fragments.  You can also do golden gate with clonal plasmid DNA.  With the higher quality DNA and the restriciton sites being further from the ends, plasmid-based golden gate is much more efficient for multi-fragment assembly than the PCR variant.
 
### Step 4: Simulate It
 
 Paste your oligos and template into C6-Tools to simulate the PCR. Then simulate the Golden Gate Assembly to confirm:

 - Your sticky ends match
 - The product matches your intended construct

---

## Quiz: Golden Gate Promoter Swap

What if we wanted to test a different induction system to compare how much protein we get? Instead of a lacI-repressed T7 promoter, we can switch to an AraC-activated Pbad promoter. Both systems are complete regulatory cassettes—each containing the promoter and its corresponding regulator. In this exercise, you'll cleanly replace the T7 promoter and lacO site with the AraC-Pbad cassette using Golden Gate Assembly.

### Instructions:

1. Open `pET-INS.seq` and locate the T7 promoter and LacO annotations.
2. Your task is to replace the entire region from the start of the T7 promoter to the end of the LacO site.
3. Open the AraC-Pbad part and model it in place of the removed region.
4. Define your 4 bp sticky ends flanking the replacement boundaries.
5. Design 4 oligos with appropriate BsaI tails.
6. Write a Construction File (CF) describing your PCRs and Golden Gate assembly.
7. Paste it below and submit.

### Goal:

- Replace the full T7/LacO regulatory cassette with AraC-Pbad.
- Ensure the insulin gene and RBS are preserved.
- The final product must not retain any BsaI sites.
- Junctions should be seamless and directionally correct with non-palindromic sticky ends.

<textarea id="cfGoldenGateInput" rows="10" style="width:100%; font-family:monospace;"></textarea>
<br>
<button onclick="gradeGoldenGate()">Grade My Work</button>

<div id="cfGoldenGateOutput" style="margin-top:20px;"></div>

<script>
window.gradeGoldenGate = function gradeGoldenGate() {
    const input = document.getElementById("cfGoldenGateInput").value.trim();
    const outputDiv = document.getElementById("cfGoldenGateOutput");
    outputDiv.innerHTML = "";

    try {
        const steps = parseCF(input);
        const results = simCF(steps);

        let feedback = [];
        const operations = steps.map(s => s.op.toLowerCase());
        const finalProduct = results[results.length - 1];

        if (!operations.includes("goldengate")) {
            feedback.push("❌ Missing GoldenGate step.");
        }

        if (operations.filter(op => op === "pcr").length < 2) {
            feedback.push("❌ You must simulate PCRs for both the insert and the backbone.");
        }

        if (/GGTCTC/i.test(finalProduct.sequence)) {
            feedback.push("❌ Your final product still contains a BsaI site. These must be removed.");
        }

        if (!/ATG/.test(finalProduct.sequence)) {
            feedback.push("⚠️ Could not confirm presence of insulin ORF start codon.");
        }

        if (!feedback.length) {
            feedback.push("✅ Success! Your design correctly swaps the promoter using Golden Gate Assembly.");
        }

        outputDiv.innerHTML = `<ul>${feedback.map(f => `<li>${f}</li>`).join("")}</ul>`;
    } catch (err) {
        outputDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    }
};
</script>