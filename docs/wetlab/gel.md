# Gel Electrophoresis

After PCR, it’s important to confirm that the reaction worked by checking for the presence and size of the product. We do this by running a small portion of each PCR reaction on an **analytical agarose gel**.

---

## Why We Run a Gel

PCR can fail in a variety of ways (no product, wrong size, smearing, etc.). Running a gel lets us visually check:

- Whether a product was formed
- Whether it’s the correct size (~3583 bp for pP6)
- Whether there’s nonspecific amplification

This is an **analytical gel**, meaning we are only checking—**not purifying**—the DNA.

---

## What Is a Gel?

Agarose gel electrophoresis separates DNA fragments by size. DNA is negatively charged and moves toward the red (positive) electrode when voltage is applied.

- **"Run to red"**: always load your DNA at the black (negative) electrode end.
- DNA travels through a gel matrix—**smaller pieces move faster**.
- A loading dye is added to weigh down the sample and track progress visually.

Gels are made from agarose, a gelling agent purified from seaweed. To prepare a gel, agarose is dissolved in 1× TAE buffer at 1% weight/volume by heating (typically in a microwave until boiling), then poured into a mold with combs to form wells. After it sets, we store the gels in bulk in a sealed container in the fridge. In lab, you’ll cut a section from a pre-made gel with enough wells for your samples.

TAE stands for Tris-Acetate-EDTA. It is a buffer that maintains pH and ionic strength during electrophoresis. Standard 1× TAE contains 40 mM Tris, 20 mM Acetate, and 1 mM EDTA at pH 8.3.

---

## Lab Sheet Overview

**Title:** TPcon6-P6: Gel (79)  
**Location of PCR products:** Enzyme freezer, PCR rack labeled “to Gel”

---

## Sample Setup

You’ll set up one lane for each PCR product. In this case, you're preparing one labeled sample:

| Label | Size  | Product |
|-------|-------|---------|
| 79    | 3583  | P6      |

### To prepare your gel samples:

1) Add **8 µL of loading dye** (tube labeled ‘load’) to a new PCR tube.

2) Add **3 µL of PCR product** to the tube, mix, and quick spin.

### Marker Sample (1 per section):

3) Add **8 µL of loading dye** to a tube of marker (yellow), mix, and spin.

---

## Running the Gel

If others in your lab section are also ready to run a gel, set up one gel for the group:

4) Cut a gel slab with enough wells for all samples plus 1 for marker and a few extras.

5) Place the gel in the rig. Fill with **1× TAE buffer** to just cover it.

6) Brace the gel with a plastic wedge to keep it from floating.

7) Label all samples on a strip of paper and arrange tubes in loading order.

8) Using a P20 set to **9 µL**, load each sample into a well carefully. Avoid puncturing the wells—if you do, restart that lane.

---

## Electrophoresis

9) Attach the lid and power leads: **"run to red"**.

10) Run at **175 volts for ~10 minutes**, or until the front (blue) dye band is 2/3–3/4 down the gel.

---

## Imaging the Gel

11) Transfer the gel to the imager and place a sample label strip above it.

12) Take a picture **with your phone through the orange filter**.

13) Name the image file by date and time (e.g., `2022_05_23-10am.png`) and upload it at:

[Google Drive Gel Upload](https://forms.gle/WfnEtHvNrLvuQj7d9)

---

## 🧪 Quiz: Gel Electrophoresis

<form id="gel_quiz_form">
  <h3>1️⃣ Purpose of Running a Gel</h3>
  <p>Why do we run an agarose gel after PCR?</p>
  <label><input type="radio" name="q1" value="a"> To sequence the amplified DNA and analyze the base composition</label><br>
  <label><input type="radio" name="q1" value="b"> To purify the PCR product for downstream cloning steps</label><br>
  <label><input type="radio" name="q1" value="c"> To amplify the DNA a second time in a gel matrix</label><br>
  <label><input type="radio" name="q1" value="d"> To confirm that the PCR reaction worked as expected</label><br>
  <p id="gel_res_q1"></p>

  <h3>2️⃣ Running the Gel</h3>
  <p>What does "run to red" mean in gel electrophoresis?</p>
  <label><input type="radio" name="q2" value="a"> Start the gel run using the maximum voltage setting</label><br>
  <label><input type="radio" name="q2" value="b"> Load DNA at the red (positive) electrode side</label><br>
  <label><input type="radio" name="q2" value="c"> DNA migrates toward the red (positive) electrode</label><br>
  <label><input type="radio" name="q2" value="d"> Use red dye to visualize the DNA in the gel</label><br>
  <p id="gel_res_q2"></p>

  <h3>3️⃣ Purpose of Loading Dye</h3>
  <p>Why is loading dye added to PCR samples before running them on a gel?</p>
  <label><input type="radio" name="q3" value="a"> To increase DNA yield during electrophoresis</label><br>
  <label><input type="radio" name="q3" value="b"> To bind to DNA and make it heavier</label><br>
  <label><input type="radio" name="q3" value="c"> To reduce voltage needed for migration</label><br>
  <label><input type="radio" name="q3" value="d"> To weigh down the sample and help track it during electrophoresis</label><br>
  <p id="gel_res_q3"></p>

  <button type="button" id="gel_submit_btn">Check Answers</button>
</form>

<script>
  document.getElementById("gel_submit_btn").addEventListener("click", function () {
    const answers = {
      q1: "d",
      q2: "c",
      q3: "d"
    };
    ["q1", "q2", "q3"].forEach(function (q) {
      const selected = document.querySelector(`input[name="${q}"]:checked`);
      const result = document.getElementById(`gel_res_${q}`);
      if (selected && selected.value === answers[q]) {
        result.innerHTML = "✅ Correct!";
        if (typeof progressManager !== "undefined") {
          progressManager.addCompletion(`gel_${q}`, "correct");
        }
      } else {
        result.innerHTML = "❌ Try again.";
      }
    });
  });
</script>

## 🎥 pP6-2022-2-Gel — Course Video

<div style="margin-bottom: 1em;">
  <iframe
    width="560"
    height="315"
    src="https://kaf.berkeley.edu/embed/secure/iframe/entryId/1_74krdpcx?iframeembed=true&autoplay=false"
    frameborder="0"
    allowfullscreen
    style="max-width: 100%;">
  </iframe>
</div>

<p><a href="https://bcourses.berkeley.edu/courses/1548791/external_tools/90481" target="_blank" rel="noopener"><strong>Open pP6-2022-2-Gel in Canvas (CalNet login)</strong></a></p>
