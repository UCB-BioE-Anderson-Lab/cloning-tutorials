// Apps Script submission helper — minimal flow
// The client obtains auth (if any) elsewhere, posts JSON to Apps Script via JSONP,
// receives a small summary JSON, and ALWAYS renders a local page from that data.
// No viewer tokens/URLs are used; nothing is stored or fetched later from Apps Script.

const url = "https://script.google.com/macros/s/AKfycbwcs5BoLXZFa-jgZpYtwKc2galvKAjamrl9xR_U5-sNQFL_pnXV7d69TWhAzg446Ow/exec";

// JSONP fallback helper
function sendToAppsScriptViaJsonp(payloadObj) {
  return new Promise((resolve, reject) => {
    const cbName = '__gas_cb_' + Math.random().toString(36).slice(2);
    const cleanup = () => {
      try { delete window[cbName]; } catch (e) {}
      if (script && script.parentNode) script.parentNode.removeChild(script);
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('JSONP timeout'));
    }, 10000); // 10s safety timeout

    window[cbName] = (data) => {
      clearTimeout(timer);
      cleanup();
      resolve(data);
    };

    const ts = Date.now(); // cache buster
    const src = url
      + '?callback=' + encodeURIComponent(cbName)
      + '&json_payload=' + encodeURIComponent(JSON.stringify(payloadObj || {}))
      + '&ts=' + ts;

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onerror = (e) => {
      clearTimeout(timer);
      cleanup();
      reject(new Error('JSONP request failed'));
    };
    document.head.appendChild(script);
  });
}

/** Escape minimal HTML */
function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Build the result page HTML from the simple server response.
 * Expected shape (flat v2):
 * {
 *   version: string,
 *   submission_id: string,
 *   submitted_at: string,
 *   checksum: string,
 *   title: string,
 *   email: string,
 *   first_name: string,
 *   last_name: string,
 *   assigned_gene: string,
 *   quizzes_passed_new: string[],
 *   results: string,
 *   email_sent: boolean,
 *   wetlab_id?: string
 * }
 * (Back-compat: will also read legacy keys like user_email and quizzes_passed if present.)
 */
function buildResultHtml(summary) {
  console.log("summary received back to tutorials:")
  console.log(summary)
  const title = escapeHtml(summary && summary.title || 'Successful submission');
  const lastName = escapeHtml(summary && summary.last_name || '');
  const firstName = escapeHtml(summary && summary.first_name || '');
  const email = escapeHtml(summary && (summary.email || summary.user_email) || '');
  const assignedGene = escapeHtml(summary && summary.assigned_gene || '');
  const submittedAt = escapeHtml(summary && summary.submitted_at || '');
  const submissionId = escapeHtml(summary && summary.submission_id || '');
  const checksum = escapeHtml(summary && summary.checksum || '');
  const emailSent = !!(summary && summary.email_sent);
  const wetlabId = escapeHtml(summary && summary.wetlab_id || '');
  const results = escapeHtml(summary && summary.results || '');
  const newly = Array.isArray(summary && summary.quizzes_added_now) ? summary.quizzes_added_now : [];
  const cumulative = Array.isArray(summary && summary.quizzes_passed_cumulative)
    ? summary.quizzes_passed_cumulative
    : (Array.isArray(summary && (summary.quizzes_passed_new || summary.quizzes_passed))
        ? (summary.quizzes_passed_new || summary.quizzes_passed)
        : []);
  const newlyItems = newly.length ? newly.map(q => '<li>' + escapeHtml(q) + '</li>').join('') : '<li>No new quizzes recorded this submission</li>';
  const cumItems = cumulative.length ? cumulative.map(q => '<li>' + escapeHtml(q) + '</li>').join('') : '<li>No quizzes recorded yet</li>';
  const greeting =
    (firstName && lastName) ? ('Hello, ' + firstName + ' ' + lastName + '.')
    : (firstName ? ('Hello, ' + firstName + '.') 
    : (lastName ? ('Hello, ' + lastName + '.') 
    : ''));

  const version = escapeHtml(summary && summary.version || '');
  const quizzesCum = Array.isArray(summary && summary.quizzes_passed_cumulative) ? summary.quizzes_passed_cumulative : null;
  const cumList = quizzesCum && quizzesCum.length ? quizzesCum.map(q => '<li>' + escapeHtml(q) + '</li>').join('') : '';

  return [
    '<!doctype html>',
    '<html>',
    '<head>',
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1">',
    '  <title>' + title + '</title>',
    '  <style>',
    '    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;margin:24px;line-height:1.5}',
    '    .card{max-width:720px;margin:0 auto;padding:24px;border:1px solid #ddd;border-radius:12px}',
    '    h1{margin:0 8px 12px 0;font-size:1.6rem}',
    '    h2{margin:16px 0 8px 0;font-size:1.2rem}',
    '    .muted{color:#555}',
    '    .notice{background:#f6fff5;border:1px solid #cbe8cb;padding:12px;border-radius:8px;margin:12px 0}',
    '  </style>',
    '</head>',
    '<body>',
    '  <div class="card">',
    '    <h1>' + title + '</h1>',
    (greeting ? ('    <p class="muted">' + greeting + '</p>') : ''),
    '    <p class="muted">Email: ' + email + '</p>',
    '    <p class="muted">Version: ' + version + '</p>',
    '    <p class="muted">Assigned gene: ' + assignedGene + '</p>',
    '    <p class="muted">Submitted: ' + submittedAt + '</p>',
    '    <p class="muted">Submission ID: ' + submissionId + '</p>',
    '    <p class="muted">Checksum: ' + checksum + '</p>',
    (wetlabId ? ('    <p class="muted">Wetlab ID: ' + wetlabId + '</p>') : ''),
    (wetlabId ? ('    <div class="notice"><strong>Wetlab access granted.</strong> You have completed lab safety training and have been assigned wetlab ID <code>' + wetlabId + '</code>. Use this ID on all sample labels and when beginning experiments.</div>') : ''),
    '    <p class="muted">Email sent: ' + (emailSent ? 'Yes' : 'No') + '</p>',
    '    <h2>Newly recorded (this submission)</h2>',
    '    <ul>' + newlyItems + '</ul>',
    '    <h2>All quizzes recorded for you</h2>',
    '    <ul>' + cumItems + '</ul>',
    '  </div>',
    '</body>',
    '</html>'
  ].join('\n');
}

/**
 * Launch a new page and inject the generated HTML.
 * Opens a new tab directly to a Blob URL to avoid document.write issues.
 * Returns true if a new window/tab was opened successfully.
 */
function launchResultPage(summary) {
  const html = buildResultHtml(summary || {});
  try {
    const blob = new Blob([html], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    const w = window.open(blobUrl, '_blank'); // no 'noopener' so same-process write isn't needed
    if (!w) return false; // popup likely blocked
    return true;
  } catch (err) {
    console.warn('Failed to open result page via Blob URL:', err);
    return false;
  }
}

/**
 * Post a JSON payload to the Apps Script Web App endpoint.
 * @param {object} payloadObj - Must include an `idToken` field (OIDC JWT).
 * @returns {Promise<any>} - Resolves with parsed JSON (if any) or raw text.
 */
async function sendToAppsScript(payloadObj) {
  console.log("sendToAppsScript invoked with:");
  console.log(payloadObj);
  if (!payloadObj || typeof payloadObj !== "object") {
    console.warn("sendToAppsScript: expected an object payload; using {}");
    payloadObj = {};
  }
  if (!payloadObj.idToken) {
    console.warn("sendToAppsScript: payload is missing idToken (optional in simplified mode).");
  }

  // Always use JSONP to bypass CORS for Apps Script Web Apps
  const data = await sendToAppsScriptViaJsonp(payloadObj);
  console.log("Posted to Apps Script (JSONP).", data);

  // New strategy: always render locally from the minimal JSON returned by the server.
  try {
    const ok = launchResultPage(data || {});
    if (!ok) {
      console.warn('Popup blocked. Fallback: replace current tab with the result page.');
      const html = buildResultHtml(data || {});
      const blob = new Blob([html], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      window.location.href = blobUrl;
      // The browser will navigate away; URL will be revoked by the browser eventually.
    }
  } catch (openErr) {
    console.warn('Unable to open result page:', openErr);
  }

  return data;
}

// Expose for other modules
window.sendToAppsScript = sendToAppsScript;