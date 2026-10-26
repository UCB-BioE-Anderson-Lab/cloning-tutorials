# Transformation

<!-- cheatsheet -->
!!! tip "Bench cheatsheet"
    **[KCM Heat-Shock Transformation](../cheatsheets/transformation.pdf)** — the one-page version of this protocol.
    It is the same as the printed copies at the bench.


<div class="lab-video" data-video="transform"></div>
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
📄 How the two solutions are made: [TSS](../trainings/media_and_plates.md#7-tss) and [5× KCM](../trainings/media_and_plates.md#8-5-kcm). The method is from [Chung, Niemela & Miller, PNAS 1989](https://pmc.ncbi.nlm.nih.gov/articles/PMC286873).

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

### Plate Hygiene and Freshness

A petri dish is not a shelf-stable reagent. Before you plate, check that the plate you are about
to use is still good. A bad plate costs you a day and can give you colonies that do not carry
your plasmid.

**How long fresh plates keep.** Plates are stored **sealed, upside-down, at 4 °C**, in a bag
labeled with the **antibiotic and the pour date**.

- **Carbenicillin plates: use within 4 weeks of the pour date.** Throw them out at 6 weeks no
  matter how they look.
- **Ampicillin plates: use within 2 weeks.** Ampicillin breaks down faster than carbenicillin.
- A bag with no pour date on it is treated as expired.

*Why that number:* standard cloning practice puts β-lactam (amp/carb) plates at about one month
at 4 °C. Carbenicillin is more stable than ampicillin, so it gets the longer window.

**Contamination spreads through a bag.**

- If **one** plate in a bag is contaminated, the others are at risk. Mold spores and bacteria
  move between plates in the bag, and they keep growing slowly in the fridge. The longer a bag
  sits, the more contaminated it gets.
- If you see **any** growth on an unused plate, treat the whole bag as suspect. Don't use its
  plates, and tell whoever pours plates.
- Take out only the plates you need and close the bag right away. **Do not put unused plates
  back** once they have been at the bench.
- Keep plates **upside-down** so condensation drips onto the lid, not onto the agar.

**Plates dry out.**

- Plates must be wrapped in **saran wrap**, sealed with **parafilm**, or kept in a **closed
  bag**. Even then they slowly dry out. Sealing slows drying; it does not stop it.
- **Signs a plate is too dry:** the agar **pulls away from the side** of the dish, shrinks or
  cracks, or turns a **darker brown**. Cells grow poorly on it, colonies come up small, and
  the antibiotic is more concentrated than intended. Throw it out.

**Antibiotics are unstable.**

- Ampicillin and carbenicillin break down over time, and faster when warm. A plate left out on
  the bench ages quickly — put plates back in the fridge.
- **What an old plate looks like:** lots of **satellite colonies** (small colonies crowded
  around a real one, growing where the antibiotic has been used up), or growth on a plate
  that should have none. On a plate with weakened antibiotic, colonies without your plasmid
  can survive.

**After your plates have grown.**

- Grown plates go in the **culture fridge**, not back with the fresh plates. Wrap them in
  parafilm and store them upside-down.
- They still dry out, and the cells on them die. **Expect 1–2 weeks** even when wrapped.
- **A grown plate is a record, not storage.** To keep a clone, restreak it onto a fresh plate
  or make a glycerol stock at −80 °C.

---

### Plating

Plating is done with **sterile glass beads** at one of the lab's **two sterile benches**.

**1. Prepare the bench.**  
Spray the working surface with **70% ethanol** and wipe it down with paper towels before you
begin.

**2. Label the plate.**  
Write your label, the date, and your name on the **bottom** of the plate before you put
anything on it. See [Labeling and Inventory](#labeling-and-inventory) below.

**3. Add the beads.**  
Pour sterile glass beads onto the surface of the plate — **about 10** is typical, and the
exact number doesn't matter much. Sterile beads are kept in glass bottles marked with
**autoclave tape**.

**4. Add the cells.**  
Pipette **50–200 µL** of your cell suspension onto the plate.

**5. Spread.**  
Cap the plate and shake it **side to side** — a straight back-and-forth motion. Watch the
beads to confirm they are travelling across the whole surface.

> **Do not swirl.** A circular motion just drives the liquid out to the perimeter of the
> plate and leaves the middle unspread. Back and forth, not around.

**6. Recover the beads.**  
Uncap the plate and pour the used beads through a **funnel** into the collection beaker.

> The beads are **not trash**. They are collected, washed, and re-sterilized for reuse.
> Do not throw them away.

**7. Incubate.**  
Recap the plate, **invert it** (lid on the bottom), and place it in the **incubator** — not
a shaker.

> **No open flames at the sterile bench.** Flame sterilization and flamed metal spreaders
> are a **supervisor-only** technique carried out elsewhere in the lab, and are not part of
> this procedure. For plating, you use glass beads and 70% ethanol.

---

### Labeling and Inventory

Be consistent and thorough:

- Write **label, date, and your name** on the plate bottom (not the lid since those can fall off).
- Match plate name to your **sample ID and lab sheet** entry (e.g., `pP6-79`).
- Return any used DNA tubes to their storage rack and note usage if needed.

### Controls

If you select with **anything other than carbenicillin**, run the restreak, positive and negative
controls beside your plates, as your lab sheet lists them. Without them, a blank plate can't tell
you whether the DNA, the cells or the plates failed. See
[Control Strains and Plasmids](./controls.md).

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

  <h3>6️⃣ Plate Freshness</h3>
  <p>You find a bag of carbenicillin plates in the fridge. The bag says it was poured 7 weeks ago. One plate in the bag has a fuzzy spot, and on some plates the agar has pulled away from the side of the dish. What should you do?</p>
  <label><input type="radio" name="q6" value="a"> Use the plates that look clean; only the fuzzy one is contaminated</label><br>
  <label><input type="radio" name="q6" value="b"> Use them, but add extra cells to make up for the old plates</label><br>
  <label><input type="radio" name="q6" value="c"> Don't use any plate from the bag, and tell whoever pours plates</label><br>
  <label><input type="radio" name="q6" value="d"> Re-wrap the bag in parafilm and use it next week</label><br>
  <p id="transformation_res_q6"></p>

  <button type="button" id="transformation_submit_btn">Check Answers</button>
</form>

<script>
  document.getElementById("transformation_submit_btn").addEventListener("click", function () {
    const answers = {
      q1: "b",
      q2: "b",
      q3: "b",
      q4: "b",
      q6: "c"
    };

    ["q1", "q2", "q3", "q4", "q6"].forEach(function (q) {
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
