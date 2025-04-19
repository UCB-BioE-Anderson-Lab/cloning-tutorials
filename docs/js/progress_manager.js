if (!window.progressManager) {
    class ProgressManager {
    constructor(storageKey = "quizProgress") {
        this.storageKey = storageKey;
        this.progress = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        this.hierarchy = {
            "Wetlab": {
              "p6": ["p6_q1", "p6_q2", "p6_q3"],
              "pipetting": ["pipet_q1", "pipet_q2", "pipet_q3", "pipet_q4", "pipet_q5"],
              "pcr": ["pcr_q1", "pcr_q2", "pcr_q3", "pcr_q4", "pcr_q5"],
              "gel": ["gel_q1", "gel_q2", "gel_q3"],
              "cleanup": [],
              "assembly": [],
              "transformation": [],
              "pick": [],
              "miniprep": [],
              "sequencing": [],
              "bestp": []
            },
            "Cloning Techniques": {
              "dna_basics": [],
              "sequence_tools": [],
              "manual_prediction": [],
              "simulation_tools": [],
              "basic_cloning": [],
              "gibson": [],
              "golden_gate": [],
              "mutagenesis": [],
              "sequencing": []
            },
            "Project Planning": {
              "project_setup": [],
              "design_principles": [],
              "sequence_analysis": [],
              "oligo_design": [],
              "cfs_simulation": [],
              "inventory_labsheets": [],
              "project_ispA": []
            }
          };
    }

    /**
     * Adds a quiz completion entry to progress tracking.
     * @param {string} quizName - The name of the quiz.
     * @param {string} result - The result of the quiz (e.g., "correct" or "incorrect").
     */
    addCompletion(quizName, result) {
        const timestamp = new Date().toISOString();
        this.progress.push({ quiz: quizName, datetime_completed: timestamp, result: result });
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    }

    /**
     * Resets all progress by clearing storage.
     */
    resetProgress() {
        if (confirm("Are you sure you want to reset your progress? This action cannot be undone.")) {
            this.progress = [];
            localStorage.removeItem(this.storageKey);
            location.reload();
        }
    }

    /**
     * Retrieves the progress as an object.
     * @returns {Array} The list of completed quizzes with timestamps and results.
     */
    getProgress() {
        return this.progress;
    }

    /**
     * Displays progress in a new tab.
     */
    async showProgress() {
        const progressWindow = window.open("about:blank", "_blank");

        if (!progressWindow || progressWindow.closed || typeof progressWindow.document === "undefined") {
            alert("Popup blocked! Please allow popups for this site to view progress.");
            return;
        }

        progressWindow.document.open();

        const hierarchy = this.hierarchy;

        const attemptMap = {};
        this.progress.forEach(entry => {
            if (!attemptMap[entry.quiz]) attemptMap[entry.quiz] = [];
            attemptMap[entry.quiz].push(entry.result);
        });

        let tableRows = "";
        for (const section in hierarchy) {
            tableRows += `<tr><td colspan="4" style="font-weight:bold; background:#eef;">${section}</td></tr>`;
            const tutorials = hierarchy[section];
            for (const tutorial in tutorials) {
                const quizzes = tutorials[tutorial];
                for (const quiz of quizzes) {
                    const attempts = attemptMap[quiz]?.length || 0;
                    const passed = attemptMap[quiz]?.includes("correct") || false;
                    tableRows += `
                        <tr>
                            <td>${tutorial}</td>
                            <td>${quiz}</td>
                            <td>${attempts > 0 ? attempts : "Not Started"}</td>
                            <td>${passed ? "✔" : "✘"}</td>
                        </tr>
                    `;
                }
            }
        }

        progressWindow.document.write(`
            <html>
            <head>
                <title>Quiz Progress</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                    th { background-color: #f0f0f0; }
                    td:last-child { font-weight: bold; font-size: 1.2em; }
                </style>
            </head>
            <body>
                <h1>Quiz Checklist</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Tutorial</th>
                            <th>Quiz</th>
                            <th>Attempts</th>
                            <th>Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            </html>
        `);
        progressWindow.document.close();
    }

    async generateSubmissionSummary() {
        const required = this.hierarchy;

        // Infer tutorial from URL path
        const path = location.pathname;
        const tutorial = path.split("/").pop().replace(".html", "") || "intro";

        // Flatten required quizzes across all sections for this tutorial
        let requiredList = [];
        for (const section in required) {
            if (required[section][tutorial]) {
                requiredList = required[section][tutorial];
                break;
            }
        }

        const completedCorrect = new Set(
            this.progress.filter(p => p.result === "correct").map(p => p.quiz)
        );

        const summary = {
            completed: [...completedCorrect],
            submission_date: new Date().toLocaleString(),
            finished: requiredList.every(q => completedCorrect.has(q)),
            attempt_log: this.progress
        };

        const report = JSON.stringify(summary, null, 4);

        const summaryWindow = window.open("about:blank", "_blank");
        if (!summaryWindow) {
            alert("Popup blocked! Please allow popups for this site to generate a submission report.");
            return;
        }
        summaryWindow.document.open();
        summaryWindow.document.write(`
            <html>
            <head>
                <title>Submission Summary</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
                    button { padding: 6px 10px; font-size: 14px; margin-top: 10px; }
                </style>
            </head>
            <body>
                <h1>Submission Summary</h1>
                <pre id="summary">${report}</pre>
                <button onclick="navigator.clipboard.writeText(document.getElementById('summary').innerText)">Copy to Clipboard</button>
            </body>
            </html>
        `);
        summaryWindow.document.close();
    }

    /**
     * Creates the progress panel on the page with Progress and Submit Report buttons.
     */
    renderProgressPanel() {
        if (document.querySelector(".progress-panel")) {
            return; // Prevent multiple progress panels
        }

        // Find the navigation bar
        const navbar = document.querySelector(".md-header__inner") || document.body;

        // Create container for buttons
        const panel = document.createElement("div");
        panel.classList.add("progress-panel");
        panel.style.position = "absolute";
        panel.style.right = "20px";
        panel.style.top = "50%";
        panel.style.transform = "translateY(-50%)";
        panel.style.display = "flex";
        panel.style.gap = "10px";

        // View Progress Button
        const viewProgressButton = document.createElement("button");
        viewProgressButton.innerText = "Progress";
        viewProgressButton.id = "viewProgressBtn";
        viewProgressButton.classList.add("progress-btn");
        viewProgressButton.addEventListener("click", () => this.showProgress());

        // Submission Summary Button
        const submitButton = document.createElement("button");
        submitButton.innerText = "Submit Report";
        submitButton.classList.add("progress-btn");
        submitButton.addEventListener("click", () => this.generateSubmissionSummary());
        
        panel.appendChild(viewProgressButton);
        panel.appendChild(submitButton);
        navbar.appendChild(panel);
    }
}

    // Initialize progress manager and render the panel only once
    window.progressManager = new ProgressManager();
    document.addEventListener("DOMContentLoaded", () => {
        window.progressManager.renderProgressPanel();
    });
}