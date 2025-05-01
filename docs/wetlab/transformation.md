# Transformation

After assembly, the circular plasmid has been generated, but it is mixed with other DNAs—some incomplete or mutant. By passing the material through cells, we isolate a single one of these sequences and amplify it a billion-fold.

**Transformation** is the process in which a bacterium takes up DNA from the environment. While some bacteria (like *B. subtilis*) do this naturally, *E. coli* requires preparation to become “competent.”

There are two common methods:

---

### 🔌 Electroporation

Electroporation involves preparing cells in salt-free, ice-cold water or 10% glycerol and shocking them with a brief electric pulse in a special cuvette. This creates pores in the membrane, allowing DNA to enter. It is:

- ~100× more efficient than heat shock
- More expensive (cuvettes are single-use)
- Sensitive to salt contamination
- Ideal for library transformations needing high colony counts

---

### 🌡️ Heat Shock (used in pP6)

We use the **TSS method** for heat shock, where cells are suspended in a PEG-salt mix. You add DNA and a small amount of KCM buffer, chill, then heat shock at 42°C for 90 seconds.  
📄 [Full TSS protocol](https://www.protocols.io/view/tss-competent-cells-and-transformation-csnqwddw.html)

TSS cells can be frozen in aliquots and remain competent for years. TSS cells are easier to work with during transformation and are well-suited for routine cloning workflows.

In dilute conditions, as in pP6, most cells take up just **one plasmid**, resulting in unique colonies.

---

### Rescue Step?

Some antibiotics (e.g., kanamycin, chloramphenicol) block translation immediately. To survive, cells must first express the resistance gene—this requires a **rescue step** (1 hour outgrowth in rich media before plating).

**Ampicillin**, used in pP6, is different: it kills only **actively growing cells**. Cells recover naturally after transformation, so **no rescue is required**.

---

### Amp vs. Carbenicillin

Both are β-lactam antibiotics. The **bla** gene on pP6 confers resistance to both.

- Ampicillin breaks down when heated (e.g., during plate pouring)
- Carbenicillin is more stable, so we use **Carb** in practice

Cells without plasmid die at 5 µg/mL; with plasmid, they survive over 1000 µg/mL—a wide window for selection.

### Transformation Efficiency

Transformation efficiency measures how effectively DNA is taken up and expressed by cells. It's typically calculated as:  
**CFU/µg DNA = (Colonies on plate) ÷ (amount of plasmid DNA in µg)**  
Our heat shock competent cells typically yield around **10⁶ CFU/µg DNA**. With electroporation, efficiencies as high as **10¹¹ CFU/µg DNA** can be achieved.  

This varies based on:

- Method (electroporation ≫ heat shock)
- Competency of the cells
- DNA purity and volume
- Handling technique

Don’t worry about calculating it for pP6, but understand that **low DNA input typically gives 1 DNA per cell**, which is ideal when selecting single clones.

---

### Handling Competent Cells

Competent cells are fragile. To maintain their viability:

- **Keep them cold at all times** (on ice or in a cold block).
- **Do not pipette vigorously.** Stir gently with the tip, then pipette up and down **once or twice carefully**.
- **Avoid bubbles**—they indicate lysis.
- **Aliquot immediately after prep**—cells degrade with freeze-thaw cycles.
- **Do not re-freeze thawed competent cells**—even one additional freeze-thaw cycle can dramatically reduce their transformation efficiency.

Note: You will not make your own competent cells. We prepare large batches once a year using the TSS method and store them at -80°C. Your instructor or supervisor will provide a frozen aliquot when needed.

---

### Plating Techniques

Once transformation is complete, you’ll plate your cells using one of two methods:

**1. Glass beads:**

- Pour the transformation mix onto the plate.
- Add ~5–10 sterile glass beads.
- Gently shake the plate in a circular motion (avoid sloshing).
- Pour off the beads into the discard jar.

**2. Metal spreader:**

- Use a **sterile spreader**. These can be disposable plastic, reusable metal or glass wands, or made by bending a glass pipette. We use bent coat hangers shaped into a triangle—they cool quickly, are unbreakable, and can be reused indefinitely.
- Flame sterilize, cool briefly.
- Spread the liquid evenly by rotating the plate under the spreader.
- Don't gouge the agar.

Invert the plate (lid on the bottom) and place it in the incubator (not a shaker)

---

### Labeling and Inventory

Be consistent and thorough:

- Write **label, date, and your name** on the plate bottom (not the lid since those can fall off).
- Match plate name to your **sample ID and lab sheet** entry (e.g., `pP6-79`).
- Return any used DNA tubes to their storage rack and note usage if needed.

----
## 🧪 Quiz: Transformation

<form id="transformation_quiz_form">
  <h3>1️⃣ What is transformation?</h3>
  <p>What happens to cells during transformation?</p>
  <label><input type="radio" name="q1" value="a"> They divide rapidly</label><br>
  <label><input type="radio" name="q1" value="b"> They take up new DNA</label><br>
  <label><input type="radio" name="q1" value="c"> Their plasmids are destroyed</label><br>
  <p id="transformation_res_q1"></p>

  <h3>2️⃣ Transformation Efficiency</h3>
  <p>Which method gives the highest transformation efficiency?</p>
  <label><input type="radio" name="q2" value="a"> Heat shock</label><br>
  <label><input type="radio" name="q2" value="b"> Electroporation</label><br>
  <label><input type="radio" name="q2" value="c"> Glass beads</label><br>
  <p id="transformation_res_q2"></p>

  <h3>3️⃣ Purpose of Antibiotic</h3>
  <p>Why do we add an antibiotic after transformation?</p>
  <label><input type="radio" name="q3" value="a"> To help cells grow</label><br>
  <label><input type="radio" name="q3" value="b"> To kill cells without the plasmid</label><br>
  <label><input type="radio" name="q3" value="c"> To improve plasmid uptake</label><br>
  <p id="transformation_res_q3"></p>

  <h3>4️⃣ Rescue Step</h3>
  <p>Is a rescue step needed for ampicillin selection?</p>
  <label><input type="radio" name="q4" value="a"> Yes, cells must recover before selection</label><br>
  <label><input type="radio" name="q4" value="b"> No, they can be plated directly</label><br>
  <p id="transformation_res_q4"></p>

  <h3>5️⃣ Best Practices</h3>
  <p>Check all best practices for successful transformation:</p>
  <label><input type="checkbox" name="q5" value="a"> Keep competent cells cold</label><br>
  <label><input type="checkbox" name="q5" value="b"> Avoid freeze-thaw cycles</label><br>
  <label><input type="checkbox" name="q5" value="c"> Invert plates when incubating</label><br>
  <label><input type="checkbox" name="q5" value="d"> Vortex competent cells vigorously</label><br>
  <p id="transformation_res_q5"></p>

  <button type="button" id="transformation_submit_btn">Check Answers</button>
</form>

<script>
  document.getElementById("transformation_submit_btn").addEventListener("click", function () {
    const answers = {
      q1: "b",
      q2: "b",
      q3: "b",
      q4: "b"
    };

    ["q1", "q2", "q3", "q4"].forEach(function (q) {
      const selected = document.querySelector(`input[name="${q}"]:checked`);
      const result = document.getElementById(`transformation_res_${q}`);
      if (selected && selected.value === answers[q]) {
        result.innerHTML = "✅ Correct!";
        if (typeof progressManager !== "undefined") {
          progressManager.addCompletion(`transformation_${q}`, "correct");
        }
      } else {
        result.innerHTML = "❌ Try again.";
      }
    });

    const checkboxes = document.querySelectorAll('input[name="q5"]:checked');
    const selectedVals = Array.from(checkboxes).map(cb => cb.value).sort().join("");
    const correctVals = ["a", "b", "c"].sort().join("");
    const result5 = document.getElementById("transformation_res_q5");
    if (selectedVals === correctVals) {
      result5.innerHTML = "✅ Correct!";
      if (typeof progressManager !== "undefined") {
        progressManager.addCompletion("transformation_q5", "correct");
      }
    } else {
      result5.innerHTML = "❌ Try again.";
    }
  });
</script>
<!-- 
---

## 🎥 Watch Before Lab

Watch the Transformation tutorial video before coming to lab.
<iframe width="560" height="315" src="https://www.youtube.com/embed/gKHO0HHPsXg" frameborder="0" allowfullscreen></iframe> -->
