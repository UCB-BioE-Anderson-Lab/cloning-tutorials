# Zymo Cleanup

After confirming your PCR reaction on a gel, the next step is to purify the DNA. This is essential for most cloning workflows, especially **Golden Gate** and **restriction enzyme-based** cloning. Although it is **optional for Gibson**, cleanup helps remove components from the PCR that may interfere with downstream steps.

---

## Why Cleanup Is Necessary

PCR reactions contain:

- Unreacted dNTPs
- Active polymerase
- Buffers and salts

These can interfere with cloning enzymes, particularly enzymes like BsaI that generate sticky ends. Polymerase can fill in sticky overhangs, preventing proper ligation. Cleanup eliminates these components.

---

## How It Works

![A schematic showing silica column DNA purification. In the binding step, DNA and contaminants are shown entering the column and contacting a pink silica resin. After spinning, contaminants are washed away and DNA remains bound. A second spin after ethanol wash further clears the column. In the final elution step, DNA is released from the resin into the collection tube. A legend shows icons representing silica resin (pink), DNA (black dots), contaminants (green bars), column, and collection tube.](../images/zymo_cleanup_steps.png)

*Figure: Stepwise diagram of silica column cleanup showing binding, washing, and elution. DNA binds to the pink resin in the column, contaminants are washed away, and purified DNA is eluted into a clean tube.*

DNA binds to silica in the presence of a chaotropic salt—usually **guanidinium thiocyanate**—found in Zymo's **ADB buffer**. This same chemical also denatures proteins like polymerases.

The basic workflow:

1. Mix PCR product with **ADB buffer**
2. Pass through a **silica column** by centrifugation
3. Wash the column with **70% ethanol** (provided as PE or Wash buffer)
4. Dry the column by spinning
5. Elute DNA with water or **EB Buffer**

> EB is preferred because it's a dilute Tris buffer. Pure water can absorb CO₂ and become slightly acidic, which may reduce recovery of DNA.

> Be mindful: **know where your DNA is at each step.** Many errors involve discarding the DNA by accident.

---

## Zymo vs. Other Kits

We use the **Zymo DNA Clean & Concentrator-5** kit because it allows elution in as little as **6 µL**, which is sometimes useful for concentrating the DNA. However, there are many equivalent products on the market.

Popular Alternative: **Qiagen QIAquick Gel Extraction Kit (purple column)**  

- Typically used to extract DNA from excised gel slices  
- Requires special buffer if binding from a gel  
- Similar silica-based chemistry

> Note: for small DNA fragments (<250 bp), improve binding by mixing **1 part ADB + 3 parts isopropanol** before loading.

---

## Lab Sheet Overview

**Title:** TPcon6-P6: Zymo  
**Location of PCR product:** Enzyme freezer, PCR rack labeled “to Zymo”

| Reaction | Tube Label | Side Label | Elution Volume | Destination      |
|----------|------------|------------|----------------|------------------|
| 79       | z79        | P6 z79     | 25 µL          | zymos1/___       |

Each PCR reaction you process will yield a new **labeled Eppendorf tube** with your cleaned-up DNA.

---

## Step-by-Step: Regular Zymo Cleanup

This protocol removes polymerase, dNTPs, salts, and oligos from your PCR. It also works for cleaning up restriction digests.

1. Add **180 µL of Zymo ADB buffer** (brown bottle) to your PCR reaction.
2. Transfer the mixture to a **Zymo column** (small clear tube labeled for cleanup).
3. Spin at full speed for **15 seconds**, discard the flow-through.
4. Add **200 µL of PE Buffer** to the column.
5. Spin at full speed for **15 seconds**, discard the flow-through.
6. Add another **200 µL of PE Buffer**.
7. Spin at full speed for **15 seconds**, discard the flow-through.
8. Spin at full speed for **90 seconds** to dry the column, discard flow-through.
9. Place the column in a clean 1.5 mL Eppendorf tube. Add the elution volume (see lab sheet) of **EB Buffer** or water **directly to the center** of the column matrix. Avoid letting liquid stick to the walls.  
10. Spin at full speed for **45 seconds** to collect your purified DNA.

---

## 🧪 Quiz: Zymo Cleanup

<form id="cleanup_quiz_form">
  <h3>1️⃣ Why Cleanup?</h3>
  <p>Why is it important to clean up a PCR reaction before cloning?</p>
  <label><input type="radio" name="q1" value="a"> To increase the fluorescence of the DNA</label><br>
  <label><input type="radio" name="q1" value="b"> To convert DNA to RNA</label><br>
  <label><input type="radio" name="q1" value="c"> To shorten the DNA for easier ligation</label><br>
  <label><input type="radio" name="q1" value="d"> To remove enzymes and reagents that could interfere with cloning steps</label><br>
  <p id="cleanup_res_q1"></p>

  <h3>2️⃣ ADB Buffer</h3>
  <p>What is in the ADB buffer that causes DNA to bind to the silica column?</p>
  <label><input type="radio" name="q2" value="a"> Guanidinium thiocyanate</label><br>
  <label><input type="radio" name="q2" value="b"> Urea</label><br>
  <label><input type="radio" name="q2" value="c"> Antibodies</label><br>
  <label><input type="radio" name="q2" value="d"> Sodium bicarbonate</label><br>
  <p id="cleanup_res_q2"></p>

  <h3>3️⃣ Common Cleanup Errors</h3>
  <p>Select all common mistakes to avoid during a Zymo cleanup:</p>
  <label><input type="checkbox" name="q3" value="a"> Trying to purify very short DNA fragments without modifying the protocol</label><br>
  <label><input type="checkbox" name="q3" value="b"> Forgetting to add ADB buffer before binding</label><br>
  <label><input type="checkbox" name="q3" value="c"> Eluting into the collection tube instead of a clean Eppendorf</label><br>
  <label><input type="checkbox" name="q3" value="d"> Discarding your eluted DNA, thinking it’s waste</label><br>
  <p id="cleanup_res_q3"></p>

  <button type="button" id="cleanup_submit_btn">Check Answers</button>
</form>

<script>
  document.getElementById("cleanup_submit_btn").addEventListener("click", function () {
    const answers = {
      q1: "d",
      q2: "a"
    };

    ["q1", "q2"].forEach(function (q) {
      const selected = document.querySelector(`input[name="${q}"]:checked`);
      const result = document.getElementById(`cleanup_res_${q}`);
      if (selected && selected.value === answers[q]) {
        result.innerHTML = "✅ Correct!";
        if (typeof progressManager !== "undefined") {
          progressManager.addCompletion(`cleanup_${q}`, "correct");
        }
      } else {
        result.innerHTML = "❌ Try again.";
      }
    });

    const checkboxes = document.querySelectorAll('input[name="q3"]:checked');
    const selectedVals = Array.from(checkboxes).map(cb => cb.value).sort().join("");
    const correctVals = ["a", "b", "c", "d"].sort().join("");
    const result3 = document.getElementById("cleanup_res_q3");
    if (selectedVals === correctVals) {
      result3.innerHTML = "✅ Correct!";
      if (typeof progressManager !== "undefined") {
        progressManager.addCompletion("cleanup_q3", "correct");
      }
    } else {
      result3.innerHTML = "❌ Try again.";
    }
  });
</script>
<!-- 
----

## 🎥 Watch Before Lab

Watch the Zymo cleanup tutorial video before coming to lab.

<iframe width="560" height="315" src="https://www.youtube.com/embed/gKHO0HHPsXg" frameborder="0" allowfullscreen></iframe> -->
