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

8) Using a P20 set to **9 µL**, load each sample into a well carefully. We are setting it lower than the full volume to avoid picking up an air gap that can interfere with filling the well. Also avoid puncturing the wells as the liquid will flow out the bottom; if you do, use another lane or start a new gel.

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

<p><em>Answer all questions correctly to pass. If you miss any, the quiz resets with a new randomized set.</em></p>

<div id="gel_quiz_container"></div>

<div style="margin-top:1rem;">
  <button type="button" id="gel_check_btn">Check Answers</button>
  <button type="button" id="gel_reset_btn">Reset</button>
  <span id="gel_quiz_status" style="margin-left:0.75rem;"></span>
</div>

<script>
(function () {
  // --- Question bank: 3 topics (same concepts as the original gel MCQ). ---
  // Topics: (1) Purpose of Running a Gel, (2) Running the Gel, (3) Purpose of Loading Dye.
  const bank = [
    { topic: 'Purpose of Running a Gel', variants: [
      // True (4)
      { text: "A gel confirms the PCR worked and the product is the correct size.", answer: true },
      { text: "Gels are used to check for product size and presence after PCR.", answer: true },
      { text: "We run a gel to verify that the PCR produced a band near 3.6 kb.", answer: true },
      { text: "The gel helps visualize whether amplification was successful.", answer: true },
      // False (4)
      { text: "The purpose of a gel in this experiment is to purify PCR products for cloning.", answer: false },
      { text: "Running a gel sequences the PCR product to identify mutations.", answer: false },
      { text: "There is a carcinogenic DNA intercalating dye in the premade agarose gels", answer: false },
      { text: "This gel confirms that the promoter randomization succeeded by showing different band intensities.", answer: false }
    ]},

    { topic: 'Running the Gel', variants: [
      // True (4)
      { text: "DNA moves toward the red (positive) electrode because it is negatively charged.", answer: true },
      { text: "The phrase 'run to red' means DNA migrates toward the positive (red) electrode.", answer: true },
      { text: "DNA is loaded near the black (negative) electrode and moves to red.", answer: true },
      { text: "DNA travels toward the red electrode during electrophoresis.", answer: true },
      // False (4)
      { text: "DNA moves toward the black electrode because it is negatively charged.", answer: false },
      { text: "'Run to red' means always load DNA at the red end of the gel.", answer: false },
      { text: "DNA runs toward red because the dye pulls it in that direction.", answer: false },
      { text: "Electrophoresis pushes DNA toward the negative electrode.", answer: false }
    ]},

    { topic: 'Purpose of Loading Buffer', variants: [
      // True (4)
      { text: "Loading dye makes samples sink into the wells and tracks migration.", answer: true },
      { text: "The glycerol adds density so the sample loads smoothly and the color tracks progress.", answer: true },
      { text: "The loading buffer contains glycerol to weigh the sample down and a color to see how far it ran.", answer: true },
      { text: "The loading dye is added to help monitor sample migration visually.", answer: true },
      // False (4)
      { text: "Loading dye binds to DNA to increase yield during electrophoresis.", answer: false },
      { text: "The blue dye binds to the DNA to track its migration through the gel", answer: false },
      { text: "The glycerol in loading buffer causes polarization of the DNA allowing it to fluoresce.", answer: false },
      { text: "Blue dye is needed to denature the DNA so it runs to true to size.", answer: false }
    ]}
  ];

  const container = document.getElementById('gel_quiz_container');
  const statusEl = document.getElementById('gel_quiz_status');
  const checkBtn = document.getElementById('gel_check_btn');
  const resetBtn = document.getElementById('gel_reset_btn');

  let currentSet = [];

  function pickOnePerTopic() {
    // Keep number of questions the same as PCR (3), one per concept/topic.
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
      const qId = `gel_q${idx + 1}`;
      const block = document.createElement('div');
      block.className = 'gel-quiz-item';
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
      const qId = `gel_q${idx + 1}`;
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
        progressManager.addCompletion('gel_q1', 'correct');
        progressManager.addCompletion('gel_q2', 'correct');
        progressManager.addCompletion('gel_q3', 'correct');
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

  document.getElementById('gel_check_btn').addEventListener('click', checkAnswers);
  document.getElementById('gel_reset_btn').addEventListener('click', renderQuiz);

  renderQuiz();
})();
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
