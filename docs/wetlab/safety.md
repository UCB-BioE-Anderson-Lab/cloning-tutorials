# Wetlab Safety Training (B144 Stanley)

This tutorial covers the basic safety rules for students working in B144 Stanley. You must review these rules, follow them at all times, and complete the quiz.

For the full list of lab rules, see the [Lab Rules – B144 Stanley (PDF)](../assets/Lab_Rules_B144_Stanley.pdf). A printed copy is posted in the Safety Corner.

---

## General Conduct

- No food or drink in the lab.
- Only enter B144 when a supervisor (facilitator or instructor) is present.
- Only work on projects that have been authorized by your instructor/PI.
- Do not bring materials in or out of the lab unless explicitly authorized.
- This lab is **BSL1 only**: no infectious agents, sharps, or hazardous chemicals.

---

## Personal Protective Equipment (PPE)
- Required at all times:
  - Closed-toe shoes and long pants
  - Lab coat
  - Gloves
  - Eye protection (prescription glasses are acceptable)
- PPE is available in designated locations in the room.

---

## Safety Equipment and Emergencies

The **Safety Corner** is located by the north door, near the biosafety cabinets on the mammalian cell side of the room. This area contains the emergency and safety supplies you may need during lab sessions.

![Safety Corner](../images/safety_corner.png)

**What is in the Safety Corner**

- Safety shower
- Eye wash
- Fire extinguisher
- PPE (gloves, lab coats, eye protection)
- Spill kit
- First-aid kit
- Chemical Hygiene Plan and other emergency information


**Safety Shower and Eye Wash**  

- Located by the biohood-side door.  All safety-related materials are in this corner.
- If exposed to chemicals, flush eyes thoroughly for **15 minutes**.

**Fire Extinguisher**  

- Located by the biohood-side door.  
- Ensure you know how to operate it safely.

**Emergency Procedures**  

- Notify your supervisor immediately of any spill or injury.  
- Call **911** for life-threatening emergencies.  
- If evacuation is required, proceed to the **Mining Circle**.

---

## Common Lab Hazards
- **Microwave**: beware of superheated agar or liquids that can cause burns.
- **Bunsen burner**: fire hazard, especially with ethanol-based solutions.
- Never spray ethanol near an open flame.

---

## Equipment Use and Signage
Certain equipment and cabinets are marked with signage to indicate who may use them and under what conditions. Always follow these signs. If in doubt, ask your supervisor before using the equipment.

![Examples of lab signage: Supervisors Only, Training Required, Training Available](../images/training_signs.png)

- **Supervisors Only** – Students must not touch or use this equipment.
- **Training Required** – Students may use this equipment, but only after completing the required training. Follow the QR code on the sign to access the training.
- **Training Available** – Training is available for this instrument. If you don’t know how to use it, scan the QR code for assistance.

---

## Cleanup and Records
- Clean your bench with 70% ethanol and restore it to its default organization after each session.
- Dispose of research materials including gloves in the large white bin or benchtop plastic beakers.
- Maintain accurate records of all experiments as directed by your instructor.

---

## Compliance
- Follow all University policies, including COVID-19 mitigation and emergency response.
- Failure to follow these rules may result in loss of access to the lab.

---

# Quiz
<p><em>Answer all questions correctly to pass. If you miss any, the quiz resets with a new randomized set.</em></p>

<div id="safety_quiz_container"></div>

<div style="margin-top:1rem;">
  <button type="button" id="safety_check_btn">Check Answers</button>
  <button type="button" id="safety_reset_btn">Reset</button>
  <span id="safety_quiz_status" style="margin-left:0.75rem;"></span>
</div>

<script>
(function () {
  // --- Question bank: 8 topics, 2 variants each ---
  // answer: true means the statement is true; false means it is false.
  const bank = [
    { topic: 'Food & Drink', variants: [
      { text: "It is OK to drink coffee in the lab if it has a lid.", answer: false },
      { text: "Chewing gum or sipping a drink during lab is acceptable if done carefully.", answer: false },
      { text: "Food or drink is permitted only at the bench.", answer: false },
      { text: "Eating and drinking are prohibited anywhere inside B144.", answer: true },
      { text: "Carrying a water bottle into the lab is allowed.", answer: false }
    ]},

    { topic: 'Supervision & Authorization', variants: [
      { text: "I can work in B144 even if no supervisor is present, as long as I am careful.", answer: false },
      { text: "Students may only work on projects approved by the instructor or PI.", answer: true },
      { text: "Entering B144 without an authorized supervisor present is not allowed.", answer: true },
      { text: "Bringing research materials into or out of the lab without authorization is allowed.", answer: false },
      { text: "I can work on a personal experiment in B144 as long as I have the materials.", answer: false }
    ]},

    { topic: 'PPE', variants: [
      { text: "Closed-toe shoes, lab coat, gloves, and eye protection are required at all times.", answer: true },
      { text: "A lab coat, pants, and flip flops are acceptable PPE", answer: false },
      { text: "Prescription glasses are acceptable eye protection in this lab.", answer: true },
      { text: "Gloves, lab coats, and eye protection are required whenever handling lab materials", answer: true },
      { text: "Open-toed shoes are not allowed in B144.", answer: true }
    ]},

    { topic: 'Restricted Equipment & Signage', variants: [
      { text: "If equipment is labeled 'Supervisors Only', I should not touch it.", answer: true },
      { text: "If a piece of equipment has a warning label, I can still try it if someone else is nearby.", answer: false },
      { text: "'Supervisors Only' means do not use unless you are a trained facilitator/instructor/TA.", answer: true },
      { text: "'Training Required' means training is optional if someone watches me.", answer: false },
      { text: "'Training Available' indicates training exists and should be completed if I don't know the instrument.", answer: true }
    ]},

    { topic: 'Safety Equipment Use', variants: [
      { text: "If I get a chemical splash in my eyes, I should flush at the eye wash for 15 minutes.", answer: true },
      { text: "A quick rinse in the eye wash for a few seconds is enough if I get chemicals in my eyes.", answer: false },
      { text: "Eye-wash flushing for fifteen minutes is required after a chemical splash.", answer: true },
      { text: "If I get a chemical splash in my eyes, I should flush at the eye wash for 15 seconds.", answer: false },
      { text: "The safety shower is located by the south-most door.", answer: false },
    ]},

    { topic: 'Hazards in B144', variants: [
      { text: "Using glass pipettes in B144 is permitted.", answer: false },
      { text: "It is safe to spray ethanol near an open flame as long as I am careful.", answer: false },
      { text: "Microwaves can cause burns from superheated agar or liquids.", answer: true },
      { text: "It is acceptable to use sharps in B144.", answer: false },
      { text: "Bunsen burners are a fire hazard, especially around ethanol.", answer: true }
    ]},

    { topic: 'Cleanup & Records', variants: [
      { text: "At the end of lab, I must clean my bench restore it to its default organization.", answer: true },
      { text: "I do not need to record my work if it was just a small task.", answer: false },
      { text: "I should dispose of research materials in the biological waste bins as instructed.", answer: true },
      { text: "Leaving the bench messy is fine if I am in a hurry.", answer: false },
      { text: "Accurate records of experiments must be maintained as trained.", answer: true }
    ]},

    { topic: 'Emergency Response', variants: [
      { text: "Any spill or injury must be reported immediately to the supervisor.", answer: true },
      { text: "In an evacuation, students should gather at the Mining Circle.", answer: true },
      { text: "Spills do not need to be reported if they are small.", answer: false },
      { text: "Dial 911 for life-threatening emergencies.", answer: true },
      { text: "During an emergency, I should keep working until my experiment is finished.", answer: false }
    ]}
  ];

  const container = document.getElementById('safety_quiz_container');
  const statusEl = document.getElementById('safety_quiz_status');
  const checkBtn = document.getElementById('safety_check_btn');
  const resetBtn = document.getElementById('safety_reset_btn');

  let currentSet = [];

  function pickOnePerTopic() {
    // For each topic, randomly select one variant
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
      block.className = 'safety-quiz-item';
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
        progressManager.addCompletion('safety_quiz', 'correct');
      }
    } else {
      // Keep results visible and require explicit user action to continue
      statusEl.textContent = '❌ One or more answers were incorrect. Review the feedback below, then click "New set" to try again.';
      // Disable inputs so the state is preserved for review
      container.querySelectorAll('input[type="radio"]').forEach(el => { el.disabled = true; });
      // Disable the Check button to prevent resubmission on the same set
      checkBtn.disabled = true;
      // Repurpose the Reset button as an explicit "New set" action
      resetBtn.textContent = 'New set';
      resetBtn.focus();
    }
  }

  // Improve accessibility of status updates
  statusEl.setAttribute('aria-live', 'polite');

  // Wire up buttons
  checkBtn.addEventListener('click', checkAnswers);
  resetBtn.addEventListener('click', renderQuiz);

  // Initial render
  renderQuiz();
})();
</script>