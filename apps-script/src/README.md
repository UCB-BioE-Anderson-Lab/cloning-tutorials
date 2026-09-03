\
# Apps Script Deployment

This directory contains the Google Apps Script project that integrates with the cloning tutorials platform.  
It handles incoming tutorial progress reports from the frontend (`progress_manager.js`) and provides a secure interface for verifying, recording, and displaying payloads.

## Structure

- `Code.js` — entry points (`doGet`, `doPost`), ID token verification, rendering.
- `Processor.js` — turns a submission into the response; **this is where identity is decided**.
- `GradesRecorder.js` — the `Completions` gradebook sheet (one row per email, one column per quiz slug).
- `Pp6Allocator.js` — issues wetlab IDs on first `lab_safety` completion.
- `EmailNotifier.js` — confirmation mail, sent **as the deploying user**.
- `Helpers.js`, `OneTimeAuthorization.js` — support.
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

5. **Deploy a new version.** `clasp push` alone changes NOTHING for students: the
   student-facing `/exec` URL is hardcoded in `docs/js/launch-apps-script.js` and its
   deployment is pinned to a numbered version, not `@HEAD`. You must also redeploy
   **that same deployment ID**:

   ```bash
   clasp create-deployment -i <deployment-id> -d "what changed"
   ```

   The `-i` is required. A bare `clasp create-deployment` mints a *new* deployment with
   a *new* URL that the site never calls, so the change appears to land and does not.
   `clasp list-deployments` shows the IDs and which version each serves.

6. **Verify the deploy, don't trust it.** Version descriptions are free text and can lie
   — one labelled "verified identity required" once contained the code it was meant to
   replace. Pull the deployed version back down and diff it:

   ```bash
   clasp pull --versionNumber <n>   # into a scratch dir, then diff against src/
   ```

7. **Rollback** is the same redeploy command with `-V <previous version>`. Same URL,
   under a minute. Check `clasp list-deployments` for the version to go back to.

## Notes

- The web app must be deployed with **"Anyone with a Google account"** access for cross-campus compatibility. Identity does not come from that ACL — see below.
- **Identity comes only from a verified Google ID token.** `Processor.js` calls
  `verifyIdToken_`, and a token that does not verify — or no token at all — means the
  submission is not recorded, no wetlab ID is allocated and no mail is sent. There is
  deliberately no fallback to any identity field in the request body. Completing
  `lab_safety` issues a wetlab ID, so an unauthenticated write here is a path to
  physical lab access, not just to marks. Do not reintroduce a fallback.
- This repo version of the Apps Script code is the intended **source of truth**, but
  nothing enforces that — see the first gotcha below.

## Gotchas

Each of these has already cost someone real time.

- **`clasp push` has no branch awareness.** `apps-script/.clasp.json` is tracked, so every
  branch and worktree pushes to the same live Apps Script project, and `push` overwrites
  the remote with whatever is in the current directory. Pushing from a branch that
  predates a security fix silently reverts it. Before any push, confirm the current
  checkout contains the fix, e.g. `git merge-base --is-ancestor <fix-commit> HEAD`.
- **Submission is a JSONP `GET`, so the ID token travels in a query string.** See
  `sendToAppsScriptViaJsonp` in `docs/js/launch-apps-script.js`. That puts a bearer
  credential in browser history, referrers and any intermediate proxy log. Moving to
  `POST` is the right fix and is blocked behind the next item.
- **`doPost` cannot work as written.** `respondJson_` calls `out.setHeader(...)` on a
  `ContentService` `TextOutput`, which has no such method, so the POST path throws — and
  throws again inside its own error handler. This is why the client uses JSONP. Fix this
  before attempting to move submissions to `POST`.
- **Mail is sent as the deploying user.** `executeAs: USER_DEPLOYING` plus `MailApp` in
  `EmailNotifier.js` means anything that can reach the send path can send mail from the
  deployer's address. Keep it behind verified identity.
- **`summarize_`, `wasRecentlySeen_` and `logSubmission_` are dead code** — defined, called
  from nowhere. So the client-supplied SHA-256 `checksum` is recorded but **never
  verified**, there is no duplicate guard, and there is **no server-side submission log**
  (`SHEET_ID` is `''`). Do not reason about past submissions as if a log exists; it does
  not. Either wire them up or delete them, but don't leave them looking live.
- **`quizzes_passed` is whatever the client asserts.** No answers are transmitted, so the
  server records the list of completed tutorial names it is handed. Verified identity
  binds that claim to a real person, which stops impersonation and anonymous writes, but
  a student can still inflate their own record. Closing that needs server-side quiz
  validation, i.e. a redesign.
- **Timestamps are instants.** Sheets renders a `Date` in the spreadsheet's own timezone,
  so do not convert before writing. `parseIsoDate_` once formatted an instant as Pacific
  wall-clock, labelled it `Z` and re-parsed it as UTC, storing every timestamp 7 hours
  early (8 under PST) and moving after-midnight submissions to the previous day.

---
Maintained as part of the **SynBio Project Tutorials**.