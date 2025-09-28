\
# Apps Script Deployment

This directory contains the Google Apps Script project that integrates with the cloning tutorials platform.  
It handles incoming tutorial progress reports from the frontend (`progress_manager.js`) and provides a secure interface for verifying, recording, and displaying payloads.

## Structure

- `Code.js` — main Apps Script logic (doGet, doPost, render, verification).
- `appsscript.json` — project configuration and manifest (runtime, scopes).
- `.clasp.json` — clasp configuration for deployment (not committed in `src/`).
- `.claspignore` — defines which files are excluded from push/pull operations.

## Development Workflow

We use [clasp](https://github.com/google/clasp) to sync local code with Google Apps Script.

1. **Login to clasp** (if not already):
   ```bash
   clasp login
   ```

2. **Pull the latest code** from the Apps Script project:
   ```bash
   clasp pull
   ```

3. **Make edits locally** in VS Code. Use version control (git) to track changes.

4. **Push changes back** to the Apps Script project:
   ```bash
   clasp push
   ```

5. **Deploy a new version**:
   - Go to the [Apps Script dashboard](https://script.google.com/).
   - Open the project and create a new deployment or update an existing one.

## Notes

- The web app must be deployed with **"Anyone with a Google account"** access for cross-campus compatibility.
- Verification logic ensures payloads cannot be tampered with (SHA-256 checksum).
- The server automatically captures the authenticated Google account email for stronger identity assurance.
- This repo version of Apps Script code serves as the **canonical source of truth**; treat the Apps Script UI as a deployment target only.

---
Maintained as part of the **SynBio Project Tutorials**.