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

<p><em>Answer all questions correctly to pass. If you miss any, the quiz resets with a new randomized set.</em></p>

<div id="cleanup_quiz_container"></div>

<div style="margin-top:1rem;">
  <button type="button" id="cleanup_check_btn">Check Answers</button>
  <button type="button" id="cleanup_reset_btn">Reset</button>
  <span id="cleanup_quiz_status" style="margin-left:0.75rem;"></span>
</div>

<script>
(function () {
  const bank = [
    {
      topic: 'Why Cleanup',
      variants: [
        { text: "PCR cleanup removes enzymes, salts, and nucleotides that could inhibit restriction or ligation steps.", answer: true },
        { text: "Cleanup ensures that BsaI and ligase function properly in Golden Gate Assembly.", answer: true },
        { text: "Polymerase in unpurified PCR can fill sticky ends and block cloning.", answer: true },
        { text: "Cleanup improves downstream reactions by eliminating interfering reagents.", answer: true },
        { text: "Cleanup converts DNA into RNA for better cloning efficiency.", answer: false },
        { text: "Cleanup shortens DNA fragments for easier ligation.", answer: false },
        { text: "Cleanup increases the fluorescence intensity of the DNA.", answer: false },
        { text: "Cleanup is done to make DNA supercoiled for transformation.", answer: false }
      ]
    },
    {
      topic: 'ADB Buffer Chemistry',
      variants: [
        { text: "ADB buffer contains guanidinium thiocyanate, a chaotropic salt that promotes DNA binding to silica.", answer: true },
        { text: "Guanidinium thiocyanate denatures proteins and helps DNA adhere to the column.", answer: true },
        { text: "DNA binds to silica only in the presence of chaotropic salts like guanidinium thiocyanate.", answer: true },
        { text: "ADB buffer both denatures polymerase and promotes DNA-silica binding.", answer: true },
        { text: "ADB buffer contains sodium bicarbonate to neutralize the DNA sample.", answer: false },
        { text: "ADB buffer contains urea, which dissolves DNA for easier elution.", answer: false },
        { text: "DNA binds to silica in pure water without any salts present.", answer: false },
        { text: "After eluting the column with ADB Buffer your DNA is in the collection tube.", answer: false }
      ]
    },
    {
      topic: 'Elution and Yield',
      variants: [
        { text: "DNA elutes from the silica membrane when low-salt buffer or water disrupts the DNA–silica interaction.", answer: true },
        { text: "Eluting with EB buffer helps maintain pH and improve recovery.", answer: true },
        { text: "After the elution step, your DNA is in the collection tube", answer: true },
        { text: "After the PE wash and final spin, all that remains on the column is pure DNA.", answer: true },
        { text: "DNA elution efficiency increases if the column is left wet with ethanol.", answer: false },
        { text: "Eluting with ADB buffer helps maintain pH and improve recovery.", answer: false },
        { text: "Eluting with PE buffer helps maintain pH and improve recovery.", answer: false },
        { text: "DNA is eluted with a high-salt buffer to disrupt the anion exchange column.", answer: false }
      ]
    }
  ];

  const container = document.getElementById('cleanup_quiz_container');
  const statusEl = document.getElementById('cleanup_quiz_status');
  const checkBtn = document.getElementById('cleanup_check_btn');
  const resetBtn = document.getElementById('cleanup_reset_btn');

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
      const qId = `cleanup_q${idx + 1}`;
      const block = document.createElement('div');
      block.className = 'cleanup-quiz-item';
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
      const qId = `cleanup_q${idx + 1}`;
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
        progressManager.addCompletion('cleanup_quiz', 'correct');
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
  document.getElementById('cleanup_check_btn').addEventListener('click', checkAnswers);
  document.getElementById('cleanup_reset_btn').addEventListener('click', renderQuiz);
  renderQuiz();
})();
</script>
<!-- 
----

## 🎥 Watch Before Lab

Watch the Zymo cleanup tutorial video before coming to lab.

<iframe width="560" height="315" src="https://www.youtube.com/embed/gKHO0HHPsXg" frameborder="0" allowfullscreen></iframe> -->
