# Pipetting

Recombinant DNA technology is technically easy to do once you have mastered a few basic manual procedures. The most essential of these is the transfer of specified volumes of liquid accurately and cleanly from one container to another. In molecular biology, we frequently work with microliter (µL) volumes, often using multi-step protocols where precision and care are essential.

---

## Micropipette Basics

Micropipettes are precision tools used to measure and transfer small volumes of liquid, typically between 0.5 µL and 1000 µL. Each pipette is optimized for a specific volume range and should only be used within that range for accurate results.

Common pipette sizes:

- **P10**: 0.5–10 µL
- **P20**: 0.5/2–20 µL
- **P200**: 20–200 µL
- **P1000**: 100–1000 µL

Both the P10 and P20 can be used to deliver 0.5 µL, though accuracy at this volume depends more on careful technique than on the specific pipette. You’ll will always visually confirm how far the liquid rides up the tip to know things went right, and this is most important with the smaller volumes.

Each pipette uses tips that must be changed between uses to avoid contamination.

---

## LTS vs. Universal Tips

In this lab, we use **LTS (LiteTouch System)** pipettes and tips. Unlike universal-fit pipettes, LTS tips require less force to attach and eject and help reduce repetitive strain. LTS pipettes have a cylindrical shaft with a defined stop, making tip seating more consistent. Do not attempt to use universal tips with LTS pipettes—they will not seal properly and will result in inaccurate volumes.

---

## How to Pipette

1. **Set the volume** using the adjustment dial. Ensure it is within the specified range.
2. **Attach a sterile tip** securely by pressing the pipette into the tip box and gently twisting.
3. **Press the plunger** to the first stop before inserting into the liquid.
4. **Immerse the tip** just below the surface of the liquid (2–3 mm), then slowly release the plunger to draw up the sample.
5. **Transfer the liquid** by touching the pipette tip to the side of the destination container and pressing the plunger to the second stop.
6. **Eject the tip** into the waste bin using the ejector button.

![Illustration showing the correct sequence for forward pipetting using a blue micropipette. Steps include pressing to the first stop, immersing tip, drawing up liquid, dispensing to the first stop, and pressing to the second stop to expel remaining liquid. Each step is labeled and the plunger positions are color-coded for clarity.](../images/pipetting_sequence.png)

**Figure: Forward pipetting sequence using a micropipette.**  
Steps: (1) Press plunger to first stop. (2) Insert tip into liquid. (3) Slowly release plunger to draw up liquid. (4) Dispense by pressing to first stop. (5) Press to second stop to expel remaining liquid. Always eject tips between uses to prevent contamination.  
*Image credit: [Jeremy Seto, bio-oer GitHub repository](https://raw.githubusercontent.com/jeremyseto/bio-oer/master/figures/molecular/pipetting/pipetting_sequence.png)*

---

## Best Practices

- Always hold the pipette vertically when drawing up liquid.
- Change tips between samples to avoid cross-contamination.
- Never turn the volume dial outside of the pipette’s range.
- Never lay a pipette sideways with liquid inside.

---

## Preventing Contamination

Contamination is one of the most common issues in molecular biology labs.

Key guidelines:

- **One tip = one sample.** Never reuse a tip between samples.
- Avoid touching the tip to anything other than the intended liquid and container.
- Never pipette without a tip—this will contaminate the pipette barrel.
- Always prep your workspace before picking up a tip:
    - Label tubes
    - Open caps
    - Arrange tubes in racks
    - Uncap reagents if needed

Trying to do setup with a tip already on risks cross-contamination.

Hold large pipettes like the **P1000** **vertically** when pipetting. If held at an angle, liquid can run up into the barrel and damage the internal mechanism. You may also see an apparent air gap in the tip, which is not a real issue—it's just gravity acting on a larger volume.

---

## Reading the Display

The display on a pipette shows the set volume. On a **P20**, for example, "200" means 20.0 µL, while on a **P1000**, it would mean 200 µL. Make sure you understand what each digit represents based on the pipette type.

---

## When Things Go Wrong

Signs you’ve pipetted incorrectly:

- Air bubbles in the tip
- Liquid stuck in the tip
- Inconsistent volumes across replicates
- Droplets left on the outside of the tip

If you see any of these, discard the tip and try again carefully.

---

## What You'll Practice and Demonstrate

As part of pipetting training, you will perform the following steps and demonstrate them to your instructor:

1. Transfer **1 mL** of water from a conical tube to a 1.5 mL microcentrifuge tube using a P1000.
2. Transfer **50 µL** of pink solution from a microcentrifuge tube to a 0.2 mL PCR tube using a P200.
3. Transfer **0.5 µL** of viscous blue glycerol solution into the same 0.2 mL PCR tube using a P20.
4. Close the 0.2 mL PCR tube **once** (repeated openings damage the seal and can cause leakage during thermocycling).
5. Mix the solution by inverting and slamming the tube on the bench upside down.
6. Perform a **quick spin** to collect liquid at the bottom of the tube.

Follow all pipetting best practices and contamination precautions during this demo.

---

## 🧪 Quiz: Pipetting Basics

<p><em>Answer all questions correctly to pass. If you miss any, the quiz resets with a new randomized set.</em></p>

<div id="pipetting_quiz_container"></div>

<div style="margin-top:1rem;">
  <button type="button" id="pipetting_check_btn">Check Answers</button>
  <button type="button" id="pipetting_reset_btn">Reset</button>
  <span id="pipetting_quiz_status" style="margin-left:0.75rem;"></span>
</div>

<script>
(function () {
  // --- Question bank: topics with multiple variants. answer: true means statement is true. ---
  const bank = [
    { topic: 'Pipette Selection', variants: [
      { text: "A P10 or P20 can be used to deliver 0.5 µL with careful technique.", answer: true },
      { text: "Any pipette whose upper range exceeds 0.5 µL is appropriate for 0.5 µL measurements.", answer: false },
      { text: "A P1000 is acceptable for accurately dispensing 0.5 µL.", answer: false },
      { text: "Select the smallest pipette whose range includes your target volume (e.g., 0.5 µL → P10/P20), not larger models like P200 or P1000.", answer: true }
    ]},

    { topic: 'Tip Changes and Contamination', variants: [
      { text: "One tip per sample is required to avoid cross‑contamination.", answer: true },
      { text: "It is acceptable to reuse a tip for multiple different samples if it looks clean.", answer: false },
    ]},

    { topic: 'Workflow & Setup', variants: [
      { text: "Arrange tubes, labels, and caps before picking up a tip so you don’t risk the tip accidentally touching something while you’re distracted.", answer: true },
      { text: "It’s fine to open new tubes while holding a loaded tip; preparation order does not affect contamination risk.", answer: false },
      { text: "Setting up the workspace before pipetting reduces the need to touch surfaces while holding a tip.", answer: true },
      { text: "Planning your steps has no effect on contamination; only changing tips matters.", answer: false }
    ]},

    { topic: 'LTS vs Universal Tips', variants: [
      { text: "LTS pipettes require matching LTS tips for a proper seal.", answer: true },
      { text: "Universal tips seal fine on LTS pipettes in a pinch.", answer: false },
      { text: "Using universal tips on LTS pipettes can lead to leaks and inaccurate volumes.", answer: true }
    ]},

    { topic: 'P1000 Handling', variants: [
      { text: "Keep a P1000 vertical to prevent liquid entering the barrel.", answer: true },
      { text: "Holding a P1000 sideways with liquid in the tip can let liquid run into the barrel.", answer: true },
      { text: "It is safe to lay a P1000 down on the bench while there is liquid in the tip.", answer: false },
      { text: "After aspirating with a P1000, keep it upright while moving to the destination.", answer: true },
      { text: "Tilting a P1000 is recommended during transport because it reduces dripping.", answer: false }
    ]}
  ];

  const container = document.getElementById('pipetting_quiz_container');
  const statusEl = document.getElementById('pipetting_quiz_status');
  const checkBtn = document.getElementById('pipetting_check_btn');
  const resetBtn = document.getElementById('pipetting_reset_btn');

  let currentSet = [];

  function pickOnePerTopic() {
    return bank.map(topic => {
      const v = topic.variants[Math.floor(Math.random() * topic.variants.length)];
      return { topic: topic.topic, text: v.text, answer: v.answer };
    });
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function renderQuiz() {
    container.innerHTML = '';
    statusEl.textContent = '';
    checkBtn.disabled = false;
    resetBtn.textContent = 'Reset';

    currentSet = shuffle(pickOnePerTopic());

    currentSet.forEach((q, idx) => {
      const qId = `q${idx + 1}`;
      const block = document.createElement('div');
      block.className = 'pipetting-quiz-item';
      block.style.margin = '0.75rem 0';

      const h = document.createElement('h4');
      h.textContent = `${idx + 1}. ${q.text}`;
      h.style.margin = '0 0 0.35rem 0';
      block.appendChild(h);

      const trueId = `${qId}_true`;
      const falseId = `${qId}_false`;

      const trueLbl = document.createElement('label');
      trueLbl.style.marginRight = '1rem';
      trueLbl.innerHTML = `<input type="radio" name="${qId}" id="${trueId}" value="true"> True`;
      block.appendChild(trueLbl);

      const falseLbl = document.createElement('label');
      falseLbl.innerHTML = `<input type="radio" name="${qId}" id="${falseId}" value="false"> False`;
      block.appendChild(falseLbl);

      const feedback = document.createElement('p');
      feedback.id = `${qId}_res`;
      feedback.style.margin = '0.35rem 0 0 0';
      block.appendChild(feedback);

      container.appendChild(block);
    });
  }

  function checkAnswers() {
    let allAnswered = true;
    let allCorrect = true;

    currentSet.forEach((q, idx) => {
      const qId = `q${idx + 1}`;
      const chosen = container.querySelector(`input[name="${qId}"]:checked`);
      const feedback = document.getElementById(`${qId}_res`);
      if (!chosen) {
        allAnswered = false;
        feedback.textContent = 'Please choose True or False.';
        return;
      }
      const val = chosen.value === 'true';
      const correct = (val === q.answer);
      allCorrect = allCorrect && correct;
      feedback.textContent = correct ? '✅ Correct' : '❌ Incorrect';
    });

    if (!allAnswered) {
      statusEl.textContent = 'Answer all questions before submitting.';
      return;
    }

    if (allCorrect) {
      statusEl.textContent = '✅ Passed';
      if (typeof progressManager !== 'undefined') {
        progressManager.addCompletion('pipetting_quiz', 'correct');
      }
    } else {
      statusEl.textContent = '❌ One or more answers were incorrect. Review the feedback below, then click "New set" to try again.';
      container.querySelectorAll('input[type="radio"]').forEach(el => { el.disabled = true; });
      checkBtn.disabled = true;
      resetBtn.textContent = 'New set';
      resetBtn.focus();
    }
  }

  statusEl.setAttribute('aria-live', 'polite');

  document.getElementById("pipetting_check_btn").addEventListener("click", checkAnswers);
  document.getElementById("pipetting_reset_btn").addEventListener("click", renderQuiz);

  renderQuiz();
})();
</script>

<!-- 
### 🎥 Watch Before Lab

Watch the pipetting tutorial video before coming to lab.
<iframe width="560" height="315" src="https://www.youtube.com/embed/gKHO0HHPsXg" frameborder="0" allowfullscreen></iframe> -->
