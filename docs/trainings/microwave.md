# Microwave

<span style="color: black; font-size: 1.5em; font-weight: bold;">
&#9888;&#65039; Training Required Before Use &#9888;&#65039;
</span>

### General Safety Rules
- Use of the microwave is restricted to trained personnel.
- Wear thermal gloves when handling hot containers.
- Inspect the microwave before each use; do not use if damaged or dirty.
- Do not operate the microwave while empty.
- Use only microwave-safe containers; avoid metal or sealed containers.
- Loosen caps or lids before heating to prevent pressure buildup.
- Avoid heating flammable or volatile chemicals.
- Clean spills promptly to prevent contamination and damage.
- Report any malfunctions to the supervisor immediately.

### Common Use Cases

#### Re-melting Solidified LB Agar
1. Loosen the bottle’s lid by about a quarter turn.
2. Heat in short 30–60 second bursts, resting between intervals, until melted.
3. Monitor closely as it nears melting and stop heating once boiling begins.
4. Allow to cool to 55°C before adding antibiotics and pouring plates.

#### Preparing Agarose for DNA Gels
1. Weigh 5 g agarose powder into a 500 mL glass bottle.
2. Add approximately 350 mL of house distilled water.
3. Cap the bottle and shake to disperse the agarose.
4. Loosen the cap by about a quarter turn.
5. Heat at full power in 30–60 second bursts.
6. After each interval, remove the bottle and swirl to mix.
7. Repeat until the agarose fully dissolves and the solution just starts to boil.
8. Allow to cool until boiling subsides.
9. Add 80 mL of 50x TAE.
10. Fill with distilled water to the bottle’s line.
11. Proceed with pouring gels.

### Preventing Hard-to-Clean Gels
- Dilute the remnant solution with water before allowing to cool.
- Don't leave unattended and allow to boil over.
- Swirl occassionally during heating to avoid superheating.
- Use heating intervals, not one continuous heating.

### Good Practices
- Wear thermal gloves when handling hot items.
- Clean spills immediately.
- Report any issues promptly.

---

## Quiz

<p><em>Answer all questions correctly to pass. If you miss any, the quiz resets with a new randomized set after you review.</em></p>

<div id="microwave_quiz_container"></div>

<div style="margin-top:1rem;">
  <button type="button" id="microwave_check_btn">Check Answers</button>
  <button type="button" id="microwave_reset_btn">Reset</button>
  <span id="microwave_quiz_status" style="margin-left:0.75rem;"></span>
</div>

<script>
(function () {
  // Five topics; each contains multiple conceptually equivalent variants
  const topics = [
    [
      { question: "Always loosen caps or lids before microwaving containers.", answer: true },
      { question: "Sealing containers tightly before microwaving is recommended to prevent spills.", answer: false },
      { question: "Do not loosen lids before microwaving as it causes contamination.", answer: false },
      { question: "Loosening bottle caps by about a quarter turn before microwaving is essential.", answer: true }
    ],
    [
      { question: "Thermal gloves must be worn when handling hot containers from the microwave.", answer: true },
      { question: "Thermal gloves stored on top of the microwave should be worn when handling hot items.", answer: true },
      { question: "It is safe to handle hot containers from the microwave without thermal gloves.", answer: false },
      { question: "Regular nitrile gloves are sufficient protection when removing hot items from the microwave.", answer: false }
    ],
    [
      { question: "Agarose should be heated in short 30–60 second bursts with swirling to prevent boil-over.", answer: true },
      { question: "Continuous heating without stirring is recommended for agarose to ensure even melting.", answer: false },
      { question: "Swirling the agarose solution after each heating interval helps avoid boiling over.", answer: true },
      { question: "Heating agarose until a vigorous boil is reached is necessary for proper melting.", answer: false }
    ],
    [
      { question: "It is absolutely prohibited to heat food in the lab microwave.", answer: true },
      { question: "Heating personal food in the lab microwave is allowed if done carefully.", answer: false },
      { question: "The lab microwave is designated solely for lab-related heating and not for food.", answer: true },
      { question: "Using the lab microwave for snacks during breaks is acceptable.", answer: false }
    ],
    [
      { question: "Spills in the microwave should be cleaned immediately using paper towels and 70% ethanol.", answer: true },
      { question: "Leaving spills in the microwave does not affect its performance.", answer: false },
      { question: "Prompt cleaning of microwave spills helps prevent contamination and damage.", answer: true },
      { question: "Only water is needed to clean microwave spills effectively.", answer: false }
    ]
  ];

  const container = document.getElementById('microwave_quiz_container');
  const statusEl = document.getElementById('microwave_quiz_status');
  const checkBtn = document.getElementById('microwave_check_btn');
  const resetBtn = document.getElementById('microwave_reset_btn');

  let currentSet = [];

  function pickOnePerTopic() {
    return topics.map(variants => {
      const v = variants[Math.floor(Math.random() * variants.length)];
      return { text: v.question, answer: v.answer };
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
      block.className = 'microwave-quiz-item';
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
      if (typeof progressManager !== 'undefined' && typeof progressManager.addCompletion === 'function') {
        progressManager.addCompletion('microwave_quiz', 'correct');
      }
    } else {
      // Preserve current set for review; require explicit new set
      statusEl.textContent = '❌ One or more answers were incorrect. Review the feedback below, then click "New set" to try again.';
      container.querySelectorAll('input[type="radio"]').forEach(el => { el.disabled = true; });
      checkBtn.disabled = true;
      resetBtn.textContent = 'New set';
      resetBtn.focus();
    }
  }

  statusEl.setAttribute('aria-live', 'polite');

  checkBtn.addEventListener('click', checkAnswers);
  resetBtn.addEventListener('click', renderQuiz);

  renderQuiz();
})();
</script>

<p><strong>After you pass the quiz:</strong> log in and submit your report to receive certification.</p>
