/**
 * Progress Manager (MkDocs client)
 * - Tracks quiz progress locally (localStorage).
 * - Renders a human-readable summary for the student.
 * - Builds a signed JSON payload (deterministic SHA-256) over a stable subset.
 * - Obtains a Google ID token via GIS (OAuth 2.0 / OIDC) and
 *   submits a JSON payload (including idToken) to the Apps Script Web App.
 * - Server verifies the ID token and signature, then records identity.
 */
if (!window.progressManager) {

// === Google Identity Services (GIS) helpers for Option 1 (ID token) ===
// Optional hardcoded fallback (set once for production if you don't want to use meta/global)
// Example: const HARDCODED_GSI_CLIENT_ID = "1234567890-abcdef.apps.googleusercontent.com";
const HARDCODED_GSI_CLIENT_ID = "1096619091657-o556epqbjql8ii5ulggc1ar9ha975gel.apps.googleusercontent.com"; // Localhost-only Web client
// Also expose as a global so other scripts (if any) can read it
window.GOOGLE_CLIENT_ID = HARDCODED_GSI_CLIENT_ID;

function resolveGoogleClientId() {
  // Production: source from HTML or a predefined global. No prompts, no localStorage.
  const m1 = document.querySelector('meta[name="google-signin-client_id"]');
  if (m1 && m1.content) return m1.content.trim();
  const m2 = document.querySelector('meta[name="gsi_client_id"]');
  if (m2 && m2.content) return m2.content.trim();
  if (window.GOOGLE_CLIENT_ID) return String(window.GOOGLE_CLIENT_ID).trim();
  if (window.CONFIG && window.CONFIG.googleClientId) return String(window.CONFIG.googleClientId).trim();
  // Support a data attribute on the script tag: <script src=".../progress_manager.js" data-gsi-client-id="..."></script>
  try {
    const thisScript = document.currentScript || Array.from(document.getElementsByTagName('script')).find(s => (s.src||'').includes('progress_manager.js'));
    if (thisScript) {
      const d = thisScript.getAttribute('data-gsi-client-id');
      if (d && d.length > 0) return d.trim();
    }
  } catch (e) {}
  if (HARDCODED_GSI_CLIENT_ID && HARDCODED_GSI_CLIENT_ID.includes('.apps.googleusercontent.com')) {
    return HARDCODED_GSI_CLIENT_ID.trim();
  }
  return "";
}
let GOOGLE_CLIENT_ID = resolveGoogleClientId();
if (!GOOGLE_CLIENT_ID) {
  console.warn('[GIS] Missing Google OAuth Web Client ID. Add <meta name="google-signin_client_id" content="..."> or set window.GOOGLE_CLIENT_ID before this script.');
}

let _gisScriptLoaded = false;
let _currentIdToken = null;      // latest ID token (JWT)
let _currentIdTokenExp = 0;      // ms since epoch

function loadGIS() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      _gisScriptLoaded = true;
      return resolve();
    }
    if (_gisScriptLoaded) return resolve();
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = () => { _gisScriptLoaded = true; resolve(); };
    s.onerror = () => reject(new Error("Failed to load Google Identity Services."));
    document.head.appendChild(s);
  });
}

function decodeJwtPayload(jwt) {
  try {
    const payload = jwt.split(".")[1];
    const norm = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(atob(norm).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
    return JSON.parse(json);
  } catch (e) {
    return {};
  }
}

function getValidIdToken() {
  if (_currentIdToken && Date.now() < (_currentIdTokenExp - 60_000)) {
    return _currentIdToken; // 60s early refresh window
  }
  return null;
}

async function acquireIdTokenInteractive() {
  await loadGIS();
  return new Promise((resolve) => {
    // Refresh client ID in case meta/script loads late
    GOOGLE_CLIENT_ID = resolveGoogleClientId(); // refresh in case meta/script loads late
    if (!GOOGLE_CLIENT_ID) {
      alert("Google Sign-In is not configured. Site owner must set the OAuth Web Client ID.");
      return resolve(null);
    }
    // Only disable FedCM on localhost/127.0.0.1
    const disableFedCM = (location.hostname === "127.0.0.1" || location.hostname === "localhost");
    // Initialize each time to ensure fresh nonce and callback
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        _currentIdToken = response.credential || null;
        const claims = _currentIdToken ? decodeJwtPayload(_currentIdToken) : {};
        _currentIdTokenExp = (claims.exp ? Number(claims.exp) * 1000 : 0);
        window.dispatchEvent(new CustomEvent("gis-idtoken-ready", { detail: { email: claims.email || null } }));
        resolve(_currentIdToken);
      },
      ux_mode: "popup",
      ...(disableFedCM ? { use_fedcm_for_prompt: false } : {})
    });
    // Show One Tap / account chooser; popup when needed
    window.google.accounts.id.prompt();
  });
}

// === Shared hashing + canonicalization helpers ===
// Choose exactly which fields participate in the deterministic signature.
function buildSignableSubset(payload) {
  return {
    submissionId: payload.submissionId,
    submissionDate: payload.submissionDate,
    assignedGene: payload.assignedGene,
    completed: payload.completed,
    incompleteTutorials: payload.incompleteTutorials,
    attempts: payload.attempts,
    rawProgress: payload.rawProgress
  };
}

// SHA-256 hex (browser)
async function sha256HexBrowser(s) {
  const enc = new TextEncoder().encode(s);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// UUID v4
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

// === Canonicalization helpers to stabilize signature input ===
// Recursively sort object keys for deterministic JSON stringification.
function canonicalizeForSignature(obj) {
  // Deep clone and sort keys deterministically
  if (Array.isArray(obj)) {
    return obj.map(canonicalizeForSignature);
  } else if (obj && typeof obj === 'object') {
    const sorted = {};
    Object.keys(obj).sort().forEach(k => {
      sorted[k] = canonicalizeForSignature(obj[k]);
    });
    return sorted;
  }
  return obj; // primitives
}

// Specific array sorters to ensure stable ordering for signable fields
// Normalize array order (stable sorts) so signatures are independent of incidental ordering.
function sortSignableArrays(signable) {
  if (Array.isArray(signable.completed)) {
    signable.completed = signable.completed.slice().sort((a,b) =>
      (a.id||'').localeCompare(b.id||'') || (a.completedOn||'').localeCompare(b.completedOn||''));
  }
  if (Array.isArray(signable.incompleteTutorials)) {
    signable.incompleteTutorials = signable.incompleteTutorials.slice().sort();
  }
  if (Array.isArray(signable.attempts)) {
    signable.attempts = signable.attempts.slice().sort((a,b) =>
      (a.section||'').localeCompare(b.section||'') ||
      (a.tutorial||'').localeCompare(b.tutorial||'') ||
      (a.quiz||'').localeCompare(b.quiz||'') ||
      (a.datetime_completed||'').localeCompare(b.datetime_completed||''));
  }
  if (Array.isArray(signable.rawProgress)) {
    signable.rawProgress = signable.rawProgress.slice().sort((a,b) =>
      (a.quiz||'').localeCompare(b.quiz||'') ||
      (a.datetime_completed||'').localeCompare(b.datetime_completed||'') ||
      (a.result||'').localeCompare(b.result||'')
    );
  }
  return signable;
}

    class ProgressManager {
    constructor(data) {
        this.storageKey = "quizProgress";
        this.progress = data.progress || [];
        this.assignedGene = data.assignedGene || null;
        this.hierarchy = {
            "Wetlab": {
              "p6": ["p6_q1", "p6_q2", "p6_q3"],
              "pipetting": ["pipet_q1", "pipet_q2", "pipet_q3", "pipet_q4", "pipet_q5"],
              "pcr": ["pcr_q1", "pcr_q2", "pcr_q3"],
              "gel": ["gel_q1", "gel_q2", "gel_q3"],
              "cleanup": ["cleanup_q1", "cleanup_q2", "cleanup_q3"],
              "assembly": ["assembly_q1", "assembly_q2"],
              "transformation": ["transformation_q1", "transformation_q2", "transformation_q3", "transformation_q4", "transformation_q5"],
              "pick": ["pick_q1", "pick_q2", "pick_q3"],
              "miniprep": ["miniprep_q1", "miniprep_q2"],
              "sequencing": ["sequencing_q1", "sequencing_q2", "sequencing_q3", "sequencing_q4"],
              "bestp": ["bestp_q1", "bestp_q2", "bestp_q3", "bestp_q4"],
              "lab_safety": ["safety_quiz"],
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
        let userName = localStorage.getItem("quizUserName") || ""; // optional; will rely on server email

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
        const incompleteTutorials = [];

        lines.push(`Name: ${userName || "(will be captured via CalNet)"}`);
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
                    if (!incompleteTutorials.includes(tutorial)) incompleteTutorials.push(tutorial);
                    // Only include per-quiz attempt rows for INCOMPLETE tutorials in the summary table.
                    // Full attempt history is still captured in payload.rawProgress.
                    for (const quiz of requiredQuizzes) {
                        if (progressByQuiz[quiz]) {
                            for (const entry of progressByQuiz[quiz]) {
                                allAttempts.push({
                                    section,
                                    tutorial,
                                    quiz,
                                    result: entry.result,
                                    datetime_completed: entry.datetime_completed
                                });
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

        let userEmail = localStorage.getItem("quizUserEmail") || ""; // optional; server will capture CalNet email

        // Construct payload (as before)
        const completed = [];
        for (const section in required) {
          const tutorials = required[section];
          for (const tutorial in tutorials) {
            const requiredQuizzes = tutorials[tutorial];
            if (requiredQuizzes.length === 0) continue;
            const allPassed = requiredQuizzes.every(q => completedCorrect.has(q));
            if (allPassed) {
              const dates = requiredQuizzes
                .flatMap(q => (progressByQuiz[q] || []))
                .filter(a => a.result === "correct")
                .map(a => new Date(a.datetime_completed));
              const latest = dates.length ? new Date(Math.max(...dates)) : null;
              completed.push({ id: tutorial, completedOn: latest ? latest.toISOString() : "" });
            }
          }
        }

        // Ensure we have a valid Google ID token (Option 1 flow)
        let idToken = getValidIdToken();
        if (!idToken) {
          idToken = await acquireIdTokenInteractive();
        }
        if (!idToken) {
          alert("Sign-in failed. Please try again.");
          return;
        }
        const submissionId = uuidv4();
        const payload = {
          // Core submission details
          submissionId,
          idToken, // Google ID token (OIDC JWT) to be verified by Apps Script
          name: userName,
          email: userEmail,
          submissionDate: new Date().toISOString(),
          submissionLocal: new Date().toLocaleString(),
          assignedGene: gene?.name || "",
          // Tutorial status
          completed,
          incompleteTutorials,
          attempts: allAttempts,
          // Raw evidence
          rawProgress: this.progress,
          // Human-readable report
          reportText: finalReport,
          // Versioning/metadata
          payloadVersion: "v1.3",
          clientVersion: "cloning-tutorials@dev",
          gitCommit: "unknown",
          buildAt: "unknown",
          // Environment diagnostics (non-sensitive)
          environment: {
            originPage: window.location.href,
            referrer: document.referrer || "",
            siteTitle: document.title || "",
            language: navigator.language || "",
            languages: Array.isArray(navigator.languages) ? navigator.languages : [],
            userAgent: navigator.userAgent || "",
            platform: navigator.platform || "",
            timeZone: (Intl.DateTimeFormat().resolvedOptions().timeZone) || "",
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
            cookiesEnabled: navigator.cookieEnabled === true,
            pixelRatio: window.devicePixelRatio || 1,
            screen: {
              width: (window.screen && window.screen.width) || null,
              height: (window.screen && window.screen.height) || null,
              availWidth: (window.screen && window.screen.availWidth) || null,
              availHeight: (window.screen && window.screen.availHeight) || null
            },
            viewport: {
              innerWidth: window.innerWidth || null,
              innerHeight: window.innerHeight || null
            }
          }
        };

        // Cap very large histories to keep payloads manageable in form POSTs
        if (Array.isArray(payload.rawProgress) && payload.rawProgress.length > 2000) {
          payload.rawProgress = payload.rawProgress.slice(-2000); // keep most recent entries
        }

        // Compute deterministic signature over a stable, canonical form
        let signable = buildSignableSubset(payload);
        // Ensure stable ordering in arrays
        signable = sortSignableArrays(signable);
        // Canonicalize object key order
        const canonical = canonicalizeForSignature(signable);
        const signableJson = JSON.stringify(canonical);
        const signature = await sha256HexBrowser(signableJson);

        payload.signature = signature;
        payload.signatureSpec = {
          alg: "SHA-256",
          scope: Object.keys(signable)
        };
        // Add report checksum for auditing
        payload.reportChecksum = hashHex;

        // Optional: size guard
        const approxBytes = new Blob([JSON.stringify(payload)]).size;
        if (approxBytes > 500_000) {
          console.warn(`Submission size ~${(approxBytes/1024).toFixed(1)} KB`);
        }

        if (typeof window.sendToAppsScript === 'function') {
          window.sendToAppsScript(payload);
          console.log('Submitted via middleware with signature.');
        } else {
          // Middleware not yet loaded — queue the submission and flush once available
          window._pendingSubmissions = window._pendingSubmissions || [];
          window._pendingSubmissions.push(payload);
          console.warn('Middleware not yet loaded; queued submission.');
        }

        // No local popup: Apps Script will render the receipt/summary page.
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
     * Creates the progress panel on the page with Progress and a single primary action button (Login/Submit).
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

        // Single primary action button: toggles Login ↔ Submit Report using GIS
        const actionButton = document.createElement("button");
        actionButton.id = "submit-or-login";
        actionButton.classList.add("progress-btn");
        actionButton.innerText = "Login";
        actionButton.title = "Login to Google, then submit";

        // Re-resolve client ID at render time (in case meta/global loaded late)
        GOOGLE_CLIENT_ID = resolveGoogleClientId();
        const enableIfConfigured = () => {
          GOOGLE_CLIENT_ID = resolveGoogleClientId();
          if (GOOGLE_CLIENT_ID) {
            actionButton.disabled = false;
            actionButton.innerText = "Login";
            actionButton.title = "Login to Google, then submit";
            return true;
          }
          return false;
        };

        // If client ID is missing, temporarily disable and retry for a short window
        if (!GOOGLE_CLIENT_ID) {
          actionButton.disabled = true;
          actionButton.innerText = "Login (setup)";
          actionButton.title = "Site owner must set OAuth Web Client ID";
          // Retry a few times in case meta/global loads after this script
          let tries = 0;
          const iv = setInterval(() => {
            tries += 1;
            if (enableIfConfigured() || tries >= 20) { // retry up to ~5s (20 * 250ms)
              clearInterval(iv);
            }
          }, 250);
          // Also try once on window load
          window.addEventListener('load', () => { enableIfConfigured(); }, { once: true });
        }

        // Helper to refresh button label based on token presence
        const refreshActionButton = () => {
          const hasToken = !!getValidIdToken();
          actionButton.innerText = hasToken ? "Submit Report" : "Login";
          actionButton.title = hasToken ? "" : "Login to Google, then submit";
        };

        // React when GIS hands us a new token
        window.addEventListener("gis-idtoken-ready", () => {
          refreshActionButton();
        });

        actionButton.addEventListener("click", async () => {
          const token = getValidIdToken();
          if (!token) {
            // Trigger interactive sign-in to fetch an ID token
            try {
              actionButton.disabled = true;
              await acquireIdTokenInteractive();
            } finally {
              actionButton.disabled = false;
            }
            refreshActionButton();
            return;
          }
          // We have a token → submit
          actionButton.disabled = true;
          try {
            await this.generateSubmissionSummary();
          } finally {
            setTimeout(() => { actionButton.disabled = false; }, 1500);
          }
        });

        // Proactively load GIS so Login is fast; update label if user is already signed in
        loadGIS().then(refreshActionButton).catch(() => {});

        panel.appendChild(viewProgressButton);
        panel.appendChild(actionButton);
        navbar.appendChild(panel);
    }
}

    // Initialize progress manager and render the panel only once
    document.addEventListener("DOMContentLoaded", async () => {
        window.progressManager = await ProgressManager.create();
        window.progressManager.renderProgressPanel();
    });
}