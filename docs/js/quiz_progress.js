document.addEventListener("DOMContentLoaded", function () {
    function saveProgress(quizName, isCorrect) {
        let progress = JSON.parse(localStorage.getItem("quizProgress")) || {};
        progress[quizName] = isCorrect;
        localStorage.setItem("quizProgress", JSON.stringify(progress));
    }

    function loadProgress() {
        let progress = JSON.parse(localStorage.getItem("quizProgress")) || {};
        if (progress["reverse"] && document.getElementById("reverseResult")) {
            document.getElementById("reverseResult").innerHTML = "✅ Previously Completed";
        }
        if (progress["complement"] && document.getElementById("complementResult")) {
            document.getElementById("complementResult").innerHTML = "✅ Previously Completed";
        }
        if (progress["reverseComp"] && document.getElementById("reverseCompResult")) {
            document.getElementById("reverseCompResult").innerHTML = "✅ Previously Completed";
        }
        if (progress["transcription"] && document.getElementById("transcriptionResult")) {
            document.getElementById("transcriptionResult").innerHTML = "✅ Previously Completed";
        }
        if (progress["translation"] && document.getElementById("translateResult")) {
            document.getElementById("translateResult").innerHTML = "✅ Previously Completed";
        }
    }

    function setupQuiz(quizId, answer, inputId, resultId, storageKey) {
        let button = document.getElementById(quizId);
        let inputField = document.getElementById(inputId);
        let resultField = document.getElementById(resultId);

        if (button && inputField && resultField) {
            button.addEventListener("click", function () {
                let userInput = inputField.value.toUpperCase().trim();
                let isCorrect = (userInput === answer);

                if (isCorrect && localStorage.getItem("quizProgress")?.includes(storageKey)) {
                    resultField.innerHTML = "✅ Previously Completed";
                } else {
                    resultField.innerHTML = isCorrect ? "✅ Correct!" : "❌ Try again.";
                }
                saveProgress(storageKey, isCorrect);
            });
        }
    }

    // Set up quizzes
    setupQuiz("reverseBtn", "GTTCGA", "reverseInput", "reverseResult", "reverse");
    setupQuiz("complementBtn", "TCGAAC", "complementInput", "complementResult", "complement");
    setupQuiz("reverseCompBtn", "CTACCTG", "reverseCompInput", "reverseCompResult", "reverseComp");
    setupQuiz("transcriptionBtn", "UCUGACUA", "transcriptionInput", "transcriptionResult", "transcription");
    setupQuiz("translateBtn", "MQVE", "translateInput", "translateResult", "translation");

    // Load previous progress
    loadProgress();

    // Reset progress button
    let resetButton = document.getElementById("resetProgressBtn");
    if (resetButton) {
        resetButton.addEventListener("click", function () {
            localStorage.removeItem("quizProgress");
            document.getElementById("reverseResult").innerHTML = "";
            document.getElementById("complementResult").innerHTML = "";
            document.getElementById("reverseCompResult").innerHTML = "";
            document.getElementById("transcriptionResult").innerHTML = "";
            document.getElementById("translateResult").innerHTML = "";
            location.reload();
        });
    }
});