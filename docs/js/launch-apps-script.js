// Apps Script submission helper (GIS Option 1 compatible) — uses JSONP to bypass CORS
// NOTE: This utility assumes the caller already obtained a Google ID token
// (OIDC JWT) via Google Identity Services and included it as payloadObj.idToken.
// Do not attempt to open login popups from here; auth is handled by progress_manager.js.

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
 * Expected shape:
 * { title: string, quizzes_passed: string[], last_name: string }
 */
function buildResultHtml(summary) {
  const title = escapeHtml(summary && summary.title || 'Submission received');
  const lastName = escapeHtml(summary && summary.last_name || '');
  const quizzes = Array.isArray(summary && summary.quizzes_passed) ? summary.quizzes_passed : [];
  const listItems = quizzes.map(q => '<li>' + escapeHtml(q) + '</li>').join('') || '<li>No quizzes listed</li>';

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
    '    h1{margin:0 0 12px 0;font-size:1.6rem}',
    '    .muted{color:#555}',
    '  </style>',
    '</head>',
    '<body>',
    '  <div class="card">',
    '    <h1>' + title + '</h1>',
    (lastName ? ('    <p class="muted">Hello, ' + lastName + '.</p>') : ''),
    '    <h2>Quizzes passed</h2>',
    '    <ul>' + listItems + '</ul>',
    '  </div>',
    '</body>',
    '</html>'
  ].join('\n');
}

/**
 * Launch a new page and inject the generated HTML.
 * Returns true if a window was opened.
 */
function launchResultPage(summary) {
  const html = buildResultHtml(summary || {});
  // Try to reuse an about:blank window to reduce popup blocking risk
  const w = window.open('about:blank', '_blank', 'noopener');
  if (!w) return false;
  try {
    w.document.open();
    w.document.write(html);
    w.document.close();
    return true;
  } catch (err) {
    console.warn('Failed to write result page:', err);
    try {
      // Fallback: create a Blob URL
      const blob = new Blob([html], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      w.location = blobUrl;
      return true;
    } catch (e2) {
      console.warn('Blob URL fallback failed:', e2);
      return false;
    }
  }
}

/**
 * Post a JSON payload to the Apps Script Web App endpoint.
 * @param {object} payloadObj - Must include an `idToken` field (OIDC JWT).
 * @returns {Promise<any>} - Resolves with parsed JSON (if any) or raw text.
 */
async function sendToAppsScript(payloadObj) {
  if (!payloadObj || typeof payloadObj !== "object") {
    console.warn("sendToAppsScript: expected an object payload; using {}");
    payloadObj = {};
  }
  if (!payloadObj.idToken) {
    console.warn("sendToAppsScript: payload is missing idToken. The server will reject unauthenticated requests.");
  }

  // Always use JSONP to bypass CORS for Apps Script Web Apps
  const data = await sendToAppsScriptViaJsonp(payloadObj);
  console.log("Posted to Apps Script (JSONP).", data);

  // New: the server now returns a simple summary JSON used to parameterize a page we launch.
  // If legacy viewer hints are present, honor them; otherwise launch our own page.
  try {
    if (data && data.openViewer && data.viewerUrl) {
      window.open(data.viewerUrl, '_blank', 'noopener');
    } else if (data && data.viewerRef) {
      const viewerUrl = url + '?ref=' + encodeURIComponent(data.viewerRef);
      window.open(viewerUrl, '_blank', 'noopener');
    } else if (data && (data.title || data.quizzes_passed || data.last_name)) {
      const ok = launchResultPage(data);
      if (!ok) {
        console.warn('Popup blocked. As a fallback, replace the current tab with the result page.');
        const html = buildResultHtml(data);
        const blob = new Blob([html], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        window.location.href = blobUrl;
      }
    }
  } catch (openErr) {
    console.warn('Unable to open viewer or result page:', openErr);
  }

  return data;
}

// Expose for other modules
window.sendToAppsScript = sendToAppsScript;