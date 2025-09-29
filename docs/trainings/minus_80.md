<span style="color: red; font-size: 1.5em; font-weight: bold;">
&#9888;&#65039; WARNING: This tutorial is for SUPERVISORS ONLY! &#9888;&#65039;
</span>

# –80 °C Freezer Training (CAT#: 79-200 Haier Biomedical Ultra Low Freezer)

 A –80 °C freezer is used for storage of microbial stocks, competent cells, and protein preps. **Only authorized supervisors may operate or access this freezer.**

**Model:** CAT#: 79-200 Haier Biomedical Ultra Low Freezer

![Haier minus 80 freezer](../images/Haier_minus_80.jpeg)

---

## Access Rules

- **Supervisors Only:** This freezer is restricted to supervisors or designated personnel. Unauthorized access is not permitted.

---

## Temperature Policy

- The freezer **must always remain at –80 °C**. **Never adjust the set temperature.**
- **Do not open the freezer if the internal temperature is above –75 °C.** Wait for the temperature to recover before accessing.

---

## Vacuum Seal Behavior

- After closing the freezer door, a **vacuum forms** to maintain the ultra-low temperature.
- **Do NOT force the door open** immediately after closing. Wait several minutes for the vacuum to release naturally.
- Forcing the door risks bending the handle or yanking it off entirely.

---

## Seals and Ice Buildup

- **Always inspect the door gaskets** and seals before and after use. A tight seal is critical for maintaining –80 °C.
- **Frost or ice buildup** on the seal or inside the door is a warning sign of leaks or improper closing.

![Example of ice/frost buildup](../images/iced_up_freezer.png)

- If you observe ice or frost, **carefully remove it** using a plastic scraper or gloved hand. Do not use metal tools.
- **Never leave the door ajar**. A –80 °C freezer will “burn itself out” (overwork and fail) if the seal is not maintained.

---

## Sample Handling

- **All items must be clearly labeled** with strain or plasmid names. Spelling must be correct and unambiguous.
- **Every new or removed sample must be logged** in the [GitHub repository inventory](https://github.com/) (use the lab’s inventory repo).
- **Tubes must be tightly sealed and labeled** (waterproof, cold-resistant labels recommended).

---

## Personal Protective Equipment (PPE)

- **Thermal gloves are required** for all freezer operations. These are stored atop the device.
- Gloves protect your hands from severe cold burns.

---

## Good Practices

- **Minimize door opening.** Plan your sample retrieval in advance.
- **Return items promptly** and check that everything is properly sealed and organized.
- **Never leave the door open while searching**—remove racks or boxes to a bench, then close the door until ready to return.

---

## Alarms and Emergencies
### If an alarm sounds

- Immediately check the display for the alarm type.
- **Contact JCA and/or the Stanley facilities emergency number** as soon as possible.
- Do not attempt repairs.

### Alarm Types
The Haier freezer alarms include audible buzzers and visible flashing lights to alert users immediately. The display panel shows specific error codes (E0–E4) for sensor malfunctions or other issues. Below is a summary of common alarm types, their triggers, and how they appear on the display:

| Alarm Type         | Trigger Condition                 | Display Indicator            |
|--------------------|---------------------------------|-----------------------------|
| High Temperature   | Internal temp above set threshold | Temperature value flashing  |
| Low Temperature    | Internal temp below set threshold | Temperature value flashing  |
| Door Ajar          | Door left open for extended time  | "Door" icon flashing        |
| Power Failure      | Loss of main power supply         | "Power" icon flashing       |
| Sensor Error (E0–E4) | Sensor malfunction or disconnection | Error code displayed (E0–E4) |

- For detailed information on alarm types, troubleshooting, and maintenance, supervisors are encouraged to consult the full Haier Biomedical Ultra Low Freezer manual available here: [Haier Manual PDF](https://geneseesci.asset.akeneo.cloud/Technical_Documents/media/1362.pdf).


---

# Quiz

Test your understanding of the –80 °C Freezer procedures. For each statement, mark it as **True** or **False**. You must answer all correctly to pass. If you miss any, you can try a new randomized set.

<div id="minus80_quiz_container" style="border: 1px solid #aaa; border-radius: 6px; padding: 1em; margin: 1.5em 0; background: #f8fafd;">
  <form id="minus80_quiz_form">
    <div id="minus80_quiz_questions"></div>
    <div style="margin-top: 1em;">
      <button id="minus80_submit_btn" type="submit">Submit</button>
      <button id="minus80_reset_btn" type="button" style="margin-left: 0.5em;">Reset</button>
      <span id="minus80_status" role="status" aria-live="polite" style="margin-left: 1em;"></span>
    </div>
  </form>
</div>

<script>
(function() {
  const topics = [
    // 1. Purpose and use
    [
      {text: "The –80 °C freezer is used for storing microbial stocks, competent cells, and protein preparations.", answer: true},
      {text: "The –80 °C freezer is intended for storing food and beverages.", answer: false},
      {text: "Only biological samples should be stored in the –80 °C freezer.", answer: true},
      {text: "It is acceptable to store gloves inside the –80 °C freezer.", answer: false}
    ],
    // 2. Supervisors only
    [
      {text: "Only supervisors or designated personnel are allowed to operate or access the –80 °C freezer.", answer: true},
      {text: "Any lab member may access the –80 °C freezer without restriction.", answer: false},
      {text: "Unauthorized access to the –80 °C freezer is not permitted.", answer: true}
    ],
    // 3. Temperature policy and –75°C access limit
    [
      {text: "You must not open the freezer if the internal temperature is above –75 °C.", answer: true},
      {text: "It is safe to open the freezer at any temperature.", answer: false},
      {text: "Only open the freezer if the display shows –75 °C or colder.", answer: true},
      {text: "You may adjust the set temperature if the freezer is too cold.", answer: false}
    ],
    // 4. Vacuum seal behavior
    [
      {text: "A vacuum forms after closing the freezer door, so you should wait a few minutes before reopening.", answer: true},
      {text: "It is safe to force the freezer door open immediately after closing it.", answer: false},
      {text: "Forcing the freezer door open can damage the handle.", answer: true},
      {text: "The vacuum seal helps maintain the ultra-low temperature.", answer: true}
    ],
    // 5. Gasket and ice handling
    [
      {text: "Always inspect the door gaskets and seals before and after use.", answer: true},
      {text: "Ice or frost buildup on the seal is a warning sign of leaks.", answer: true},
      {text: "If you see frost, remove it carefully with a plastic scraper or gloved hand.", answer: true},
      {text: "Metal tools are recommended for removing ice from the freezer.", answer: false}
    ],
    // 6. Sample labeling and GitHub inventory
    [
      {text: "All samples must be clearly labeled with correct and unambiguous names.", answer: true},
      {text: "You do not need to log new or removed samples in the GitHub inventory.", answer: false},
      {text: "Tubes should be tightly sealed and labeled with waterproof, cold-resistant labels.", answer: true}
    ],
    // 7. PPE: thermal gloves
    [
      {text: "Thermal gloves must be worn for all freezer operations.", answer: true},
      {text: "Thermal gloves are optional when handling samples from the –80 °C freezer.", answer: false},
      {text: "Gloves protect your hands from severe cold burns.", answer: true}
    ],
    // 8. Good practices (door opening, retrieval)
    [
      {text: "Plan your sample retrieval in advance to minimize door opening time.", answer: true},
      {text: "It is best to leave the freezer door open while searching for samples.", answer: false},
      {text: "Remove racks or boxes to a bench and close the door until ready to return them.", answer: true}
    ],
    // 9. Alarm immediate actions
    [
      {text: "If an alarm sounds, immediately check the display for the alarm type.", answer: true},
      {text: "If the alarm sounds, attempt repairs yourself before contacting anyone.", answer: false},
      {text: "Contact JCA and/or Stanley facilities emergency number as soon as possible if an alarm occurs.", answer: true}
    ],
    // 10. Alarm types: E0–E4, flashing indicators
    [
      {text: "The freezer displays error codes E0–E4 for sensor malfunctions.", answer: true},
      {text: "Flashing icons or values on the display indicate an alarm condition.", answer: true},
      {text: "A flashing 'Door' icon means the door has been left open.", answer: true},
      {text: "The freezer never shows error codes on the display.", answer: false}
    ],
    // 11. Respect for equipment
    [
      {text: "Never leave the freezer door ajar, as this can cause the freezer to fail.", answer: true},
      {text: "Maintaining a tight seal on the freezer door is crucial.", answer: true},
      {text: "Forcing the door or leaving it open is acceptable if you are in a hurry.", answer: false}
    ]
  ];

  function pickVariants() {
    // For each topic, pick a random variant
    return topics.map(variants => variants[Math.floor(Math.random() * variants.length)]);
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  let quizItems = [];

  function renderQuiz() {
    quizItems = shuffle(pickVariants());
    const qDiv = document.getElementById("minus80_quiz_questions");
    qDiv.innerHTML = "";
    quizItems.forEach((item, idx) => {
      const qId = "minus80_q" + idx;
      const fieldset = document.createElement("fieldset");
      fieldset.style.marginBottom = "1em";
      fieldset.id = qId + "_fs";
      const legend = document.createElement("legend");
      legend.textContent = "Statement " + (idx + 1);
      legend.style.fontWeight = "bold";
      fieldset.appendChild(legend);
      const labelTrue = document.createElement("label");
      labelTrue.setAttribute("for", qId + "_true");
      labelTrue.style.marginRight = "1em";
      labelTrue.innerHTML = `<input type="radio" id="${qId}_true" name="${qId}" value="true" required> True`;
      const labelFalse = document.createElement("label");
      labelFalse.setAttribute("for", qId + "_false");
      labelFalse.innerHTML = `<input type="radio" id="${qId}_false" name="${qId}" value="false" required> False`;
      const statement = document.createElement("div");
      statement.textContent = item.text;
      statement.style.margin = "0.5em 0 0.5em 0";
      fieldset.appendChild(statement);
      fieldset.appendChild(labelTrue);
      fieldset.appendChild(labelFalse);
      qDiv.appendChild(fieldset);
    });
    document.getElementById("minus80_status").textContent = "";
    document.getElementById("minus80_submit_btn").disabled = false;
    document.getElementById("minus80_reset_btn").textContent = "Reset";
    enableInputs(true);
  }

  function enableInputs(enable) {
    quizItems.forEach((_, idx) => {
      const qId = "minus80_q" + idx;
      Array.from(document.getElementsByName(qId)).forEach(inp => {
        inp.disabled = !enable;
      });
    });
  }

  function checkQuiz(ev) {
    ev.preventDefault();
    let allCorrect = true, allAnswered = true;
    quizItems.forEach((item, idx) => {
      const qId = "minus80_q" + idx;
      const selected = Array.from(document.getElementsByName(qId)).find(inp => inp.checked);
      if (!selected) {
        allAnswered = false;
        return;
      }
      const correct = (selected.value === String(item.answer));
      if (!correct) allCorrect = false;
    });
    const status = document.getElementById("minus80_status");
    if (!allAnswered) {
      status.textContent = "Please answer all questions.";
      return;
    }
    if (allCorrect) {
      status.textContent = "✅ All correct! You have passed the quiz.";
      enableInputs(false);
      document.getElementById("minus80_submit_btn").disabled = true;
      document.getElementById("minus80_reset_btn").textContent = "New set";
      if (typeof progressManager !== 'undefined' && typeof progressManager.addCompletion === 'function') {
        progressManager.addCompletion('minus80_quiz', 'correct');
      }
    } else {
      status.textContent = "❌ Some answers are incorrect. Please review the tutorial and try again with a new set.";
      enableInputs(false);
      document.getElementById("minus80_submit_btn").disabled = true;
      document.getElementById("minus80_reset_btn").textContent = "New set";
    }
  }

  function resetQuiz() {
    renderQuiz();
  }

  document.addEventListener("DOMContentLoaded", function() {
    renderQuiz();
    document.getElementById("minus80_quiz_form").addEventListener("submit", checkQuiz);
    document.getElementById("minus80_reset_btn").addEventListener("click", resetQuiz);
  });
})();
</script>

After passing the quiz, log in and submit your report to be certified.