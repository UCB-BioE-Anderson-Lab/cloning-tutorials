if (!window.progressManager) {
    class ProgressManager {
    constructor(storageKey = "quizProgress") {
        this.storageKey = storageKey;
        this.progress = JSON.parse(localStorage.getItem(this.storageKey)) || [];
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
    showProgress() {
        // Open the new tab immediately
        const progressWindow = window.open("about:blank", "_blank");
    
        if (!progressWindow || progressWindow.closed || typeof progressWindow.document === "undefined") {
            alert("Popup blocked! Please allow popups for this site to view progress.");
            return;
        }
    
        // Immediately start writing to the document
        progressWindow.document.open();
        progressWindow.document.write(`
            <html>
            <head>
                <title>Quiz Progress</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    pre { background: #f4f4f4; padding: 10px; border-radius: 5px; white-space: pre-wrap; word-wrap: break-word; }
                </style>
            </head>
            <body>
                <h1>Quiz Progress</h1>
                <pre>${JSON.stringify(this.progress, null, 4)}</pre>
            </body>
            </html>
        `);
        progressWindow.document.close(); // Ensures the document is fully loaded
    }

    /**
     * Creates the progress panel on the page with Reset and View Progress buttons.
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

        // Reset Button
        const resetButton = document.createElement("button");
        resetButton.innerText = "Reset Progress";
        resetButton.id = "resetProgressBtn";
        resetButton.classList.add("progress-btn");
        // Removed extra margin for better flex spacing
        resetButton.addEventListener("click", () => this.resetProgress());

        // View Progress Button
        const viewProgressButton = document.createElement("button");
        viewProgressButton.innerText = "View Progress";
        viewProgressButton.id = "viewProgressBtn";
        viewProgressButton.classList.add("progress-btn");
        // Removed extra margin for better flex spacing
        viewProgressButton.addEventListener("click", () => this.showProgress());

        // Append buttons to panel and add panel to the navigation bar
        panel.appendChild(resetButton);
        panel.appendChild(viewProgressButton);
        navbar.appendChild(panel);
    }
}

// Initialize progress manager and render the panel only once
window.progressManager = new ProgressManager();
document.addEventListener("DOMContentLoaded", () => {
    window.progressManager.renderProgressPanel();
});

}