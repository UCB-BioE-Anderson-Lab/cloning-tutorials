if (!window.progressManager) {
    class ProgressManager {
    constructor(data) {
        this.storageKey = "quizProgress";
        this.progress = data.progress || [];
        this.assignedGene = data.assignedGene || null;
        this.hierarchy = {
            "Wetlab": {
              "p6": ["p6_q1", "p6_q2", "p6_q3"],
              "pipetting": ["pipet_q1", "pipet_q2", "pipet_q3", "pipet_q4", "pipet_q5"],
              "pcr": ["pcr_q1", "pcr_q2", "pcr_q3", "pcr_q4", "pcr_q5"],
              "gel": ["gel_q1", "gel_q2", "gel_q3"],
              "cleanup": ["cleanup_q1", "cleanup_q2", "cleanup_q3"],
              "assembly": ["assembly_q1", "assembly_q2"],
              "transformation": ["transformation_q1", "transformation_q2", "transformation_q3", "transformation_q4", "transformation_q5"],
              "pick": ["pick_q1", "pick_q2", "pick_q3"],
              "miniprep": ["miniprep_q1", "miniprep_q2"],
              "sequencing": ["sequencing_q1", "sequencing_q2", "sequencing_q3", "sequencing_q4"],
              "bestp": ["bestp_q1", "bestp_q2", "bestp_q3", "bestp_q4"],
            },
            "Construction": {
              "dna_basics": ["Reverse", "Complement", "Reverse Complement", "Transcription", "Translation"],
              "sequence_tools": [],
              "manual_prediction": ["Manual_PCR", "Manual_Ligation"],
              "simulation_tools": ["simulation_tools_q1"],
              "basic_cloning": ["Basic Cloning"],
              "gibson": ["Gibson Cloning"],
              "golden_gate": ["Golden Gate Cloning"],
              "mutagenesis": ["Mutagenesis"],
              "sequencing_confirmation": [
                "strategy_scenarios",
                "primer_design",
                "interpretation_q1",
                "interpretation_q2",
                "interpretation_q3",
                "interpretation_q4"
                ],
            },
            "Project Planning": {
              "project_setup": [],
              "design_principles": ["RC_Part_Quiz"],
              "sequence_analysis": [],
              "oligo_design": [],
              "cfs_simulation": [],
              "inventory_labsheets": [],
              "project_ispA": []
            }
          };
    }

    static async create() {
        const stored = JSON.parse(localStorage.getItem("quizProgress")) || {};
        const manager = new ProgressManager(stored);
        if (!manager.assignedGene) {
            await manager.assignGene();
        }
        return manager;
    }

    async assignGene() {
        const folder = Math.floor(Math.random() * 10) + 1;
        const file = Math.floor(Math.random() * 25);
        const url = `https://raw.githubusercontent.com/UCB-BioE-Anderson-Lab/cloning-tutorials/refs/heads/main/sequences/gene_dataset/${folder}/gene_${file}.json`;
        try {
            const res = await fetch(url);
            const gene = await res.json();
            console.log("Selected gene:");
            console.log(gene);
            this.setAssignedGene(gene);
        } catch (e) {
            console.error("Failed to fetch assigned gene:", e);
        }
    }

    /**
     * Adds a quiz completion entry to progress tracking.
     * @param {string} quizName - The name of the quiz.
     * @param {string} result - The result of the quiz (e.g., "correct" or "incorrect").
     */
    addCompletion(quizName, result) {
        const timestamp = new Date().toISOString();
        this.progress.push({ quiz: quizName, datetime_completed: timestamp, result: result });
        localStorage.setItem(this.storageKey, JSON.stringify({
          progress: this.progress,
          assignedGene: this.assignedGene
        }));
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
        let userName = localStorage.getItem("quizUserName");
        if (!userName) {
            userName = prompt("Please enter your name as it appears on bCourses:");
            if (!userName) {
                alert("Name is required to generate the report.");
                return;
            }
            localStorage.setItem("quizUserName", userName);
        }

        const required = this.hierarchy;
        const progressByQuiz = {};
        this.progress.forEach(p => {
            if (!progressByQuiz[p.quiz]) progressByQuiz[p.quiz] = [];
            progressByQuiz[p.quiz].push(p);
        });

        const completedCorrect = new Set(
            this.progress.filter(p => p.result === "correct").map(p => p.quiz)
        );

        const lines = [];
        const allAttempts = [];

        lines.push(`Name: ${userName}`);
        lines.push(`Submission Date: ${new Date().toLocaleString()}`);
        const gene = this.getAssignedGeneDetails();
        if (gene && gene.name) {
            lines.push(`Assigned Gene: ${gene.name}`);
        }
        lines.push("");

        for (const section in required) {
            const tutorials = required[section];
            let sectionLines = [];

            for (const tutorial in tutorials) {
                const requiredQuizzes = tutorials[tutorial];
                if (requiredQuizzes.length === 0) continue;

                const attempted = requiredQuizzes.some(q => progressByQuiz[q]);
                if (!attempted) continue;

                const allPassed = requiredQuizzes.every(q => completedCorrect.has(q));

                if (allPassed) {
                    const dates = requiredQuizzes
                        .flatMap(q => (progressByQuiz[q] || []))
                        .filter(a => a.result === "correct")
                        .map(a => new Date(a.datetime_completed));
                    const latest = dates.length
                        ? new Date(Math.max(...dates)).toLocaleDateString()
                        : "Unknown";
                    sectionLines.push(`✓ ${tutorial} (completed on ${latest})`);
                } else {
                    sectionLines.push(`✘ ${tutorial} (incomplete)`);
                    for (const quiz of requiredQuizzes) {
                        if (progressByQuiz[quiz]) {
                            for (const entry of progressByQuiz[quiz]) {
                                allAttempts.push(entry);
                                sectionLines.push(`  - ${quiz} | ${entry.result} | ${new Date(entry.datetime_completed).toLocaleString()}`);
                            }
                        }
                    }
                }
            }

            if (sectionLines.length) {
                lines.push(`== ${section} ==`);
                lines.push(...sectionLines, "");
            }
        }

        // Generate a checksum over the report text before appending
        const report = lines.join("\n");
        const encoder = new TextEncoder();
        const data = encoder.encode(report);
        const digest = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(digest));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        lines.push(`Checksum: ${hashHex}`);

        const finalReport = lines.join("\n");

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
                    body { font-family: monospace; padding: 20px; white-space: pre-wrap; }
                    button { padding: 6px 10px; font-size: 14px; margin-top: 10px; }
                </style>
            </head>
            <body>
                <h1>Submission Summary</h1>
                <pre id="summary">${finalReport}</pre>
                <button onclick="navigator.clipboard.writeText(document.getElementById('summary').innerText)">Copy to Clipboard</button>
            </body>
            </html>
        `);
        summaryWindow.document.close();
    }

    setAssignedGene(gene) {
        this.assignedGene = gene;
        localStorage.setItem(this.storageKey, JSON.stringify({
          progress: this.progress,
          assignedGene: gene
        }));
    }

    getAssignedGeneDetails() {
        return this.assignedGene;
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
    document.addEventListener("DOMContentLoaded", async () => {
        window.progressManager = await ProgressManager.create();
        window.progressManager.renderProgressPanel();
    });
}