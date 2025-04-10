# Colony Picking

After plating your transformation and incubating overnight, if everything goes well you will see colonies that look something like this:

![Two student plates after transformation. Left: a dense plate with a wide range of bright green colonies. Right: a sparser plate with only a few green colonies. A zoomed-in region highlights a green colony surrounded by smaller white colonies.](../images/pp6_plates.png)
*Figure: Results from two students' pP6 transformations under blue light illumination to excite amilGFP. Left: an ideal plate with many green colonies. Right: a minimally usable plate. The zoomed region shows a green colony (a true pP6 transformant) surrounded by smaller white "satellite colonies"—non-transformed cells growing in an antibiotic-depleted zone. Only the green colony contains the plasmid and is ampicillin-resistant.*

---

## What Are You Looking For?

In the pP6 experiment, you're trying to identify the **strongest promoter variants**. These drive expression of amilGFP, which fluoresces green.  

- **Bright green colonies** indicate successful assembly of a strong promoter driving GFP.  
- Colonies with no fluorescence are likely the template plasmid (pJ12) or inactive variants.

Some bright colonies are so strong that you can see yellowish color even without blue light. These are your best candidates.

Each visible spot on the plate arises from a single bacterium that landed there and divided repeatedly. To ensure you're picking a true single clone, choose **well-isolated, round colonies** that are clearly separated from their neighbors.  

- Avoid picking colonies that are touching or very close together  
- Avoid elongated or smeared colonies, which may indicate mixed or unhealthy growth  

**Picking** refers to using a sterile tool (usually a toothpick or pipette tip) to transfer a single colony to a liquid culture.  
**Inoculating** means introducing that colony into fresh media to grow overnight.
---

![Cartoon showing colony picking with a sterile toothpick and inoculating into a labeled snap-cap tube.](../images/colony_pick_cartoon.png)
*Figure: Use a sterile toothpick to gently touch a green colony, then inoculate 4 mL of media by dropping the toothpick into a labeled snap-cap tube.*

---

## Protocol

Follow your lab sheet and the steps below:

**Step 1:** Identify the brightest green colonies under blue light and mark them on the plate.

**Step 2:** Label snap-cap tubes for up to 4 clones with your assigned ID number and a letter. For example:  
`pP6-79A`, `pP6-79B`, etc.

**Step 3:** Add 4 mL of 2YT + Carb (from fridge) into each tube.

**Step 4:** Pick each marked colony using a sterile toothpick and inoculate it by dropping the toothpick directly into the labeled tube (do not remove the toothpick).

**Step 5:** Cover the tube and grow in the shaking incubator overnight.

**Step 6:** Wrap the agar plate with parafilm and place it upside-down in the fridge for recordkeeping.

**Step 7:** Upload a photo of your plate under blue light to this folder:  
[Google Drive Folder](https://drive.google.com/drive/folders/1cumFECQCZbFkj-G1cFbsXqGeBUpqBo0D)  
Name the image as: `pP6-79` (with your number)

**Step 8:** Document your picks. Why did you choose each clone?  
(e.g., "very green and slow growing")

---

## Example

| clone_id | why was it chosen?                  |
|----------|-------------------------------------|
| 79A      | It was exceptionally green and slow growing |
| 79B      | Brightest colony on the plate       |

---

## 🧪 Quiz: Colony Picking

<form id="picking_quiz_form">
  <h3>1️⃣ Picking Strategy</h3>
  <p>Which colony is most likely to contain the strongest promoter and should be picked?</p>
  <label><input type="radio" name="q1" value="a"> A white colony near the edge of the plate</label><br>
  <label><input type="radio" name="q1" value="b"> The largest colony on the plate</label><br>
  <label><input type="radio" name="q1" value="c"> A large, bright green colony in a dense cluster</label><br>
  <label><input type="radio" name="q1" value="d"> A small, isolated, bright green colony</label><br>
  <p id="pick_res_q1"></p>

  <h3>2️⃣ Colony Isolation</h3>
  <p>Why is it important to choose a well-separated colony?</p>
  <label><input type="radio" name="q2" value="a"> It ensures the colony is round</label><br>
  <label><input type="radio" name="q2" value="b"> It increases the transformation efficiency</label><br>
  <label><input type="radio" name="q2" value="c"> It ensures the picked colony comes from a single clone</label><br>
  <label><input type="radio" name="q2" value="d"> It improves antibiotic resistance</label><br>
  <p id="pick_res_q2"></p>

  <h3>3️⃣ Sample Labeling</h3>
  <p>What does the label <code>pP6-37C</code> indicate?</p>
  <label><input type="radio" name="q3" value="a"> It is the third colony picked by the student assigned number 37 for the pP6 experiment</label><br>
  <label><input type="radio" name="q3" value="b"> It represents the colony with the third highest green fluorescence intensity on the plate</label><br>
  <label><input type="radio" name="q3" value="c"> It is the 37th colony selected across all students in this year’s lab</label><br>
  <label><input type="radio" name="q3" value="d"> It refers to a pP6 plate that was incubated at 37°C and produced a colony labeled "C"</label><br>
  <p id="pick_res_q3"></p>

  <button type="button" id="picking_submit_btn">Check Answers</button>
</form>

<script>
  document.getElementById("picking_submit_btn").addEventListener("click", function () {
    const answers = {
      q1: "d",
      q2: "c",
      q3: "a"
    };
    ["q1", "q2", "q3"].forEach(function (q) {
      const selected = document.querySelector(`input[name="${q}"]:checked`);
      const result = document.getElementById(`pick_res_${q}`);
      if (selected && selected.value === answers[q]) {
        result.innerHTML = "✅ Correct!";
        if (typeof progressManager !== "undefined") {
          progressManager.addCompletion(`pick_${q}`, "correct");
        }
      } else {
        result.innerHTML = "❌ Try again.";
      }
    });
  });
</script>

----

## Video Tutorial

🎥 Watch the picking tutorial video before lab.  
<iframe width="560" height="315" src="https://www.youtube.com/embed/gKHO0HHPsXg" frameborder="0" allowfullscreen></iframe>
