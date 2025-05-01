# BestP: Measuring Fluorescence

## Overview

The **BestP** experiment marks a shift from building DNA to **measuring its activity**. The goal is to assign a quantitative value—**Relative Promoter Units (RPU)**—to each promoter you identified in pP6. This allows us to compare their strengths under consistent conditions.

### Why RPU?

Different experiments can yield different fluorescence values due to instrument settings, media conditions, or cell growth. To standardize promoter activity, we compare each sample’s fluorescence to a **reference promoter**: **J23101**, a commonly used medium-strength promoter from the Anderson library. Its activity is defined as **1 RPU**.

### Reference Plasmids

We use three plasmids from the Anderson promoter library:

- **pJ12** – Contains **J23112**, a very weak promoter
- **pJ01** – Contains **J23101**, the **standard reference**
- **pJ19** – Contains **J23119**, a very strong promoter

Each has the same vector backbone and reporter gene (amilGFP) as your pP6 clones, ensuring fair comparison.

---

## Experimental Workflow

You'll choose **4 pP6 clones** to characterize—either your own from sequencing or others from the TPcon6B box. You'll also measure the reference plasmids above. Here’s the full procedure:

### Step 1: Transformation

Transform all 7 plasmids (4 pP6 clones + pJ12, pJ01, pJ19) using a **single aliquot of 100 μL competent cells**. Use 16 μL of cells + KCM + 0.5 μL of plasmid DNA per transformation.

- Plate the transformations and label clearly with your assigned number
- Use carbencillin selection
- No rescue step is needed

### Step 2: Picking

Pick **4 colonies per plasmid** into a 24-well block:

- Add 4 mL of 2YT + carb to each well
- Pick in a **left-to-right order** to match data entry format
- Label with an airpore sheet
- Grow overnight in the multitron shaker
- Refrigerate plates and upload a photo (name it `BestP-XX`)

### Step 3: Measurement

Measure both **fluorescence** and **OD₆₀₀** for all samples using a plate reader:

- Transfer 100 μL from each culture into a black-walled Tecan plate (2 technical replicates per sample)
- Use **fluorescein settings** to read amilGFP
- Save data to the USB stick

### Step 4: Data Entry

Paste your raw OD and fluorescence readings into the provided spreadsheet. The sheet will:

- Calculate **normalized fluorescence** (per OD unit)
- Average technical and biological replicates
- Compute final **RPU values** with error bars

You’ll report these results to the main **BestP Results** sheet to help build a complete picture of the promoter library.

---

### Example Results

| Promoter | RPU | Error |
|----------|-----|-------|
| pJ01-C (J23101) | 1.00 | ±0.02 |
| 45C | 0.037 | ±0.003 |
| 7C | 0.679 | ±0.012 |
| 8A | 1.045 | ±0.019 |

Our ultimate goal with BestP is to measure the RPU of each pP6 clone and compare it to pJ19 to see if we have discovered a promoter with comparable or even greater activity. The strongest hits from this screen will move forward into the next stage of the project, where we’ll develop each into a part family. This is the final quality control step before we commit to that process.

---

## 🧪 Quiz: BestP and RPU Measurement

<form id="bestp_quiz_form">
  <h3>1️⃣ What is RPU?</h3>
  <p>What does RPU stand for, and why is it used?</p>
  <label><input type="radio" name="q1" value="a"> Relative Protein Units; to measure cell growth</label><br>
  <label><input type="radio" name="q1" value="b"> Reference Promoter Units; to normalize fluorescence data</label><br>
  <label><input type="radio" name="q1" value="c"> Relative Promoter Units; to standardize promoter activity across conditions</label><br>
  <label><input type="radio" name="q1" value="d"> Ribosomal Production Units; to calculate expression efficiency</label><br>
  <p id="bestp_res_q1"></p>

  <h3>2️⃣ RPU Calculation</h3>
  <p>If pJ01 gives a fluorescence value of 3033, and your pP6 clone gives 9213, what is the RPU of your pP6 clone?</p>
  <label><input type="radio" name="q2" value="a"> 9213 ÷ 3033 = ~3.0</label><br>
  <label><input type="radio" name="q2" value="b"> 9213 − 3033 = 6179</label><br>
  <label><input type="radio" name="q2" value="c"> 3033 ÷ 9213 = ~0.33</label><br>
  <label><input type="radio" name="q2" value="d"> 3033 − 9213 = -6180</label><br>
  <p id="bestp_res_q2"></p>

  <h3>3️⃣ Controlling Variables</h3>
  <p>Why are all reference and test plasmids built on the same vector backbone?</p>
  <label><input type="radio" name="q3" value="a"> To simplify miniprepping</label><br>
  <label><input type="radio" name="q3" value="b"> To avoid needing a control lane on a gel</label><br>
  <label><input type="radio" name="q3" value="c"> To ensure differences in fluorescence come only from promoter activity</label><br>
  <label><input type="radio" name="q3" value="d"> To save cost in plasmid construction</label><br>
  <p id="bestp_res_q3"></p>

  <h3>4️⃣ Experimental Consistency</h3>
  <p>Which of the following would invalidate your RPU comparison?</p>
  <label><input type="radio" name="q4" value="a"> Using a different volume of media across wells</label><br>
  <label><input type="radio" name="q4" value="b"> Growing cells overnight in the same incubator</label><br>
  <label><input type="radio" name="q4" value="c"> Picking colonies in left-to-right order</label><br>
  <label><input type="radio" name="q4" value="d"> Using the same airpore sheet for all blocks</label><br>
  <p id="bestp_res_q4"></p>

  <button type="button" id="bestp_submit_btn">Check Answers</button>
</form>

<script>
  document.getElementById("bestp_submit_btn").addEventListener("click", function () {
    const answers = {
      q1: "c",
      q2: "a",
      q3: "c",
      q4: "a"
    };
    ["q1", "q2", "q3", "q4"].forEach(function (q) {
      const selected = document.querySelector(`input[name="${q}"]:checked`);
      const result = document.getElementById(`bestp_res_${q}`);
      if (selected && selected.value === answers[q]) {
        result.innerHTML = "✅ Correct!";
        if (typeof progressManager !== "undefined") {
          progressManager.addCompletion(`bestp_${q}`, "correct");
        }
      } else {
        result.innerHTML = "❌ Try again.";
      }
    });
  });
</script>
<!-- 
----

## 🎥 Watch Before Lab

Watch the fluorescense measurement tutorial video before coming to lab.

<iframe width="560" height="315" src="https://www.youtube.com/embed/gKHO0HHPsXg" frameborder="0" allowfullscreen></iframe> -->
