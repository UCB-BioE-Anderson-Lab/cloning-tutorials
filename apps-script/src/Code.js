/**
 * ===== Apps Script Web App: Verified Payload Viewer =====
 * - Verifies client signature (SHA-256 over a stable subset).
 * - Captures server email (CalNet) and receipt time.
 * - Guards duplicate submissions (10 min) via CacheService.
 * - (Optional) Logs submissions to a Google Sheet.
 */

/** ── CONFIG: set if you want to log to Sheets ─────────────────────────── */
var SHEET_ID = ''; // put your Google Sheet ID here to enable logging. Leave '' to skip logging.
var DEBUG = false; // production: disable verbose signature debug output

/** ── CONFIG: OAuth 2.0 Web Client IDs (allow list) ───────────────────── */
// Prefer Script Properties so IDs aren’t hardcoded.
// Supported properties:
//   GOOGLE_OAUTH_CLIENT_IDS = "ID1,ID2,ID3"   (preferred, comma‑separated)
//   GOOGLE_OAUTH_CLIENT_ID  = "ID1"           (legacy single value)
var GOOGLE_OAUTH_CLIENT_IDS = (function() {
  try {
    var props = PropertiesService.getScriptProperties();
    var multi = props.getProperty('GOOGLE_OAUTH_CLIENT_IDS');
    if (multi && multi.trim()) {
      return multi.split(',').map(function(s){ return s.trim(); }).filter(function(s){ return s.length > 0; });
    }
    var single = props.getProperty('GOOGLE_OAUTH_CLIENT_ID');
    if (single && single.trim()) return [ single.trim() ];
  } catch (e) {}
  return ['REPLACE_WITH_YOUR_WEB_CLIENT_ID.apps.googleusercontent.com'];
})();

/** ── ID token verification (OIDC) ─────────────────────────────────────── */
function verifyIdToken_(idToken) {
  try {
    if (!idToken) return { ok: false, error: 'missing_id_token' };
    var resp = UrlFetchApp.fetch(
      'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken),
      { method: 'get', muteHttpExceptions: true, contentType: 'application/x-www-form-urlencoded' }
    );
    var code = resp.getResponseCode();
    if (code !== 200) {
      return { ok: false, error: 'tokeninfo_http_' + code, raw: resp.getContentText() };
    }
    var claims = JSON.parse(resp.getContentText());
    // Required checks
    if (!claims.aud || GOOGLE_OAUTH_CLIENT_IDS.indexOf(claims.aud) === -1) {
      return { ok: false, error: 'aud_mismatch', aud: claims.aud, allowed: GOOGLE_OAUTH_CLIENT_IDS };
    }
    if (!claims.iss || (claims.iss !== 'https://accounts.google.com' && claims.iss !== 'accounts.google.com')) {
      return { ok: false, error: 'iss_mismatch', iss: claims.iss };
    }
    var nowSec = Math.floor(Date.now() / 1000);
    if (!claims.exp || Number(claims.exp) <= nowSec) {
      return { ok: false, error: 'token_expired', exp: claims.exp, now: nowSec };
    }
    // Optional but recommended
    if (String(claims.email_verified) !== 'true') {
      return { ok: false, error: 'email_not_verified' };
    }
    return { ok: true, claims: claims };
  } catch (e) {
    return { ok: false, error: 'verify_exception', details: String(e) };
  }
}

/** ── Rendering ────────────────────────────────────────────────────────── */
/**
 * Renders a minimal HTML page that immediately navigates to targetUrl,
 * with a visible fallback link if auto-redirect is blocked.
 * @param {string} targetUrl
 */
function renderRedirectPage_(targetUrl) {
  var safe = String(targetUrl || '');
  var html = ''
    + '<!doctype html><html><head><meta charset="utf-8" />'
    + '<meta http-equiv="refresh" content="0;url=' + safe.replaceAll('&','&amp;').replaceAll('"','&quot;') + '">'
    + '<title>Launching…</title>'
    + '<meta name="viewport" content="width=device-width, initial-scale=1">'
    + '<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;margin:24px;line-height:1.4}</style>'
    + '</head><body>'
    + '<p>Launching your page… If nothing happens, <a href="' + safe.replaceAll('"','&quot;') + '">click here</a>.</p>'
    + '<script>try{window.location.replace(' + JSON.stringify(safe) + ');}catch(e){}</script>'
    + '</body></html>';
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Renders an HTML page showing a status banner and pretty JSON.
 * @param {Object} data
 * @param {string} source  "GET" or "POST"
 */
function renderPage_(data, source) {
  var statusHtml = '';
  try {
    if (data && data.verification) {
      var ok = !!data.verification.ok;
      var dup = !!data.duplicate;
      var skew = (data.clockSkewOk === false);
      statusHtml =
        '<div style="margin:0 0 12px 0;padding:10px;border-radius:8px;'
        + 'background:' + (ok ? (dup ? '#fff3cd' : '#e6f4ea') : '#fdecea') + ';'
        + 'color:' + (ok ? '#0a7a0a' : '#b00020') + ';'
        + 'border:1px solid ' + (ok ? (dup ? '#ffe58f' : '#c6e7c8') : '#f5c2c7') + ';">'
        + '<strong>' + (ok ? (dup ? 'Duplicate submission (ignored for logging), signature OK.' : 'Signature OK.') : 'Signature mismatch!') + '</strong>'
        + (skew ? ' <span style="color:#b00020;">(Clock skew > 60 min)</span>' : '')
        + '</div>';
    }
  } catch (_) {}

  var pretty = JSON.stringify(data, null, 2);
  var html = ''
    + '<!doctype html><html><head><meta charset="utf-8" />'
    + '<title>Payload Viewer</title>'
    + '<meta name="viewport" content="width=device-width, initial-scale=1" />'
    + '<style>'
    + 'body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;margin:24px;}'
    + '.card{border:1px solid #ddd;border-radius:12px;padding:16px;}'
    + 'h1{margin:0 0 12px 0;font-size:18px;}'
    + 'pre{background:#f7f7f7;padding:12px;border-radius:8px;overflow:auto;}'
    + '.meta{color:#555;font-size:12px;margin-bottom:12px;}'
    + '</style></head><body>'
    + '<div class="card">'
    + '<h1>Apps Script Web App Payload</h1>'
    + '<div class="meta">Source: ' + source + ' • Rendered at: ' + new Date().toISOString() + '</div>'
    + statusHtml
    + '<pre>' + sanitize_(pretty) + '</pre>'
    + '</div></body></html>';
  return HtmlService.createHtmlOutput(html);
}

/** Basic HTML sanitizer for preformatted text. */
function sanitize_(s) {
  return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

/** ── Signature helpers (must match client) ────────────────────────────── */
// Choose exactly which fields participate in the deterministic signature.
function buildSignableSubset_(p) {
  return {
    submissionId: p.submissionId,
    submissionDate: p.submissionDate,
    assignedGene: p.assignedGene,
    completed: p.completed,
    incompleteTutorials: p.incompleteTutorials,
    attempts: p.attempts,
    rawProgress: p.rawProgress
  };
}

/** Canonicalize object keys recursively for deterministic JSON. */
function canonicalizeForSignature_(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(canonicalizeForSignature_);
  var keys = Object.keys(value).sort();
  var out = {};
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    out[k] = canonicalizeForSignature_(value[k]);
  }
  return out;
}

/** Normalize array order for signable fields so signature is order-stable. */
function sortSignableArrays_(signable) {
  try {
    if (Array.isArray(signable.completed)) {
      signable.completed = signable.completed.slice().sort(function(a,b){
        var ai = (a && a.id) || '';
        var bi = (b && b.id) || '';
        if (ai !== bi) return ai < bi ? -1 : 1;
        var at = (a && a.completedOn) || '';
        var bt = (b && b.completedOn) || '';
        return at < bt ? -1 : (at > bt ? 1 : 0);
      });
    }
    if (Array.isArray(signable.incompleteTutorials)) {
      signable.incompleteTutorials = signable.incompleteTutorials.slice().sort();
    }
    if (Array.isArray(signable.attempts)) {
      signable.attempts = signable.attempts.slice().sort(function(a,b){
        var ak = [(a&&a.section)||'', (a&&a.tutorial)||'', (a&&a.quiz)||'', (a&&a.datetime_completed)||''].join('\u0001');
        var bk = [(b&&b.section)||'', (b&&b.tutorial)||'', (b&&b.quiz)||'', (b&&b.datetime_completed)||''].join('\u0001');
        return ak < bk ? -1 : (ak > bk ? 1 : 0);
      });
    }
    if (Array.isArray(signable.rawProgress)) {
      signable.rawProgress = signable.rawProgress.slice().sort(function(a,b){
        var ak = [(a&&a.quiz)||'', (a&&a.datetime_completed)||'', (a&&a.result)||''].join('\u0001');
        var bk = [(b&&b.quiz)||'', (b&&b.datetime_completed)||'', (b&&b.result)||''].join('\u0001');
        return ak < bk ? -1 : (ak > bk ? 1 : 0);
      });
    }
  } catch (_) {}
  return signable;
}

function sha256Hex_(text) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    text,
    Utilities.Charset.UTF_8
  );
  return bytes.map(function (b) {
    var x = (b & 0xff).toString(16);
    return x.length === 1 ? '0' + x : x;
  }).join('');
}

/** ── Duplicate submission guard (10 minutes) ──────────────────────────── */
function wasRecentlySeen_(submissionId) {
  try {
    if (!submissionId) return false;
    var cache = CacheService.getScriptCache();
    var key = 'seen:' + submissionId;
    if (cache.get(key)) return true;
    cache.put(key, '1', 600); // 10 minutes
    return false;
  } catch (_) {
    return false;
  }
}

/** ── Optional logging to Google Sheets ────────────────────────────────── */
function getSheet_() {
  if (!SHEET_ID) return null;
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName('Submissions') || ss.insertSheet('Submissions');
  if (sh.getLastRow() === 0) {
    sh.appendRow([
      'timestamp','submissionId','serverEmail','clientEmail','effectiveEmail',
      'payloadVersion','signatureOk','recomputedSig','providedSig','duplicate',
      'clockSkewOk','jsonPayload'
    ]);
  }
  return sh;
}

function logSubmission_(result) {
  try {
    var sh = getSheet_();
    if (!sh) return;
    sh.appendRow([
      new Date().toISOString(),
      result.submissionId || '',
      result.serverEmail || '',
      result.clientEmail || '',
      result.effectiveEmail || '',
      result.payloadVersion || '',
      (result.verification && result.verification.ok) || false,
      (result.verification && result.verification.recomputed) || '',
      (result.verification && result.verification.provided) || '',
      !!result.duplicate,
      (typeof result.clockSkewOk === 'boolean') ? result.clockSkewOk : '',
      JSON.stringify(result.parsedPayload || {})
    ]);
  } catch (_) {
    // logging is best-effort; ignore errors
  }
}

/** ── Clock skew check (client vs server) ───────────────────────────────── */
function skewOk_(clientIso, serverIso, minutes) {
  try {
    var c = new Date(clientIso).getTime();
    var s = new Date(serverIso).getTime();
    return Math.abs(c - s) <= minutes * 60 * 1000;
  } catch (_) {
    return true; // do not fail the submission on parse errors
  }
}

/** ── JSON response with permissive CORS (for cross-origin fetch) ─────── */
function respondJson_(obj) {
  var out = ContentService.createTextOutput(JSON.stringify(obj));
  out.setMimeType(ContentService.MimeType.JSON);
  // Allow cross-origin calls from localhost/dev and production site
  out.setHeader("Access-Control-Allow-Origin", "*");
  out.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  out.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return out;
}

/** JSONP response helper for cross-origin GET without CORS */
function respondJsonp_(callbackName, obj) {
  var js = String(callbackName || 'callback') + '(' + JSON.stringify(obj) + ');';
  var out = ContentService.createTextOutput(js);
  out.setMimeType(ContentService.MimeType.JAVASCRIPT);
  return out;
}

/** ── GET: supports ?json_payload=... or simple params ─────────────────── */
function doGet(e) {
  // Token lookup endpoint (JSON/JSONP): /exec?ref=VIEW_TOKEN[&callback=...]
  if (e && e.parameter && e.parameter.ref) {
    // Ref-based viewer has been removed in favor of simple data-return.
    var message = ''
      + '<!doctype html><html><head><meta charset="utf-8"><title>Viewer removed</title></head>'
      + '<body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;margin:24px">'
      + '<h1>Ref-based viewer removed</h1>'
      + '<p>This web app no longer stores or serves viewer pages. The client now posts data and renders the page locally.</p>'
      + '</body></html>';
    return HtmlService.createHtmlOutput(message).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  // JSONP bypass for CORS: /exec?callback=fn&json_payload=...
  try {
    var cb = e && e.parameter && e.parameter.callback;
    if (cb) {
      var payload = {};
      try {
        if (e.parameter && e.parameter.json_payload) {
          payload = JSON.parse(String(e.parameter.json_payload));
        } else {
          var params = e.parameter || {};
          Object.keys(params).forEach(function(k){ if (k !== 'callback') payload[k] = params[k]; });
        }
      } catch (parseErr) {
        return respondJsonp_(cb, { error:'bad_json_payload', details:String(parseErr) });
      }
      var summary = makeSubmissionSummary_(payload);
      return respondJsonp_(cb, summary);
    }
  } catch (jsonpErr) {
    // If JSONP path itself fails, fall through to normal GET rendering
  }
  try {
    // Handshake: if ?ping=1, emit READY postMessage to opener and close
    if (e && e.parameter && e.parameter.ping == '1') {
      var pingHtml = ''
        + '<!doctype html><html><head><meta charset="utf-8"></head></head><body>'
        + '<script>'
        + 'window.addEventListener("load", function() {'
        + '  try {'
        + '    if (window.opener) {'
        + '      window.opener.postMessage({ type: "APPS_SCRIPT_READY" }, "*");'
        + '      console.log("Ping page: sent APPS_SCRIPT_READY to opener");'
        + '      setTimeout(function() {'
        + '        window.close();'
        + '      }, 200);'
        + '    }'
        + '  } catch (e) { console.error("Ping postMessage failed", e); }'
        + '});'
        + '</script>'
        + '</body></html>';
      return HtmlService.createHtmlOutput(pingHtml).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }

    // Manual-auth check page: minimal, always triggered when 'authcheck' param is present
    if (e && e.parameter && (typeof e.parameter.authcheck !== 'undefined')) {
      var signedInEmail = '';
      try { signedInEmail = Session.getActiveUser().getEmail() || ''; } catch (_) {}
      var html = ''
        + '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
        + '<title>Google Sign-in</title>'
        + '<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;margin:24px;line-height:1.35} .btn{display:inline-block;padding:10px 14px;border:1px solid #ced4da;border-radius:8px;text-decoration:none;margin-right:8px}</style>'
        + '</head><body>'
        + (signedInEmail
            ? '<p>You appear to be signed in as <strong>' + signedInEmail + '</strong>.</p>'
            : '<p>Sign in may be required. Click Continue below to open the web app login if prompted.</p>')
        + '<p>'
        +   '<a class="btn" href="' + ScriptApp.getService().getUrl() + '" target="_self">Continue</a>'
        +   '<a class="btn" href="#" onclick="window.close();return false;">I\'m done — close</a>'
        + '</p>'
        + '<script>console.log("Authcheck page loaded. Email=", ' + JSON.stringify(signedInEmail) + ');</script>'
        + '</body></html>';
      return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }

    if (e && e.parameter && e.parameter.json_payload) {
      var p = JSON.parse(e.parameter.json_payload);
      var summary = makeSubmissionSummary_(p);
      return respondJson_(summary);
    }
  } catch (err) {
    return renderPage_({ error: 'Failed to parse json_payload', details: String(err) }, 'GET');
  }
  var data = (e && e.parameter && Object.keys(e.parameter).length)
    ? e.parameter
    : { message: 'No payload provided', hint: 'POST JSON or send query params', ok: true };
  return renderPage_(data, 'GET');
}

/**
 * Build the ultra-simple response shape expected by launch-apps-script.
 * @param {Object} payload - JSON body posted by the client.
 * @return {Object}
 */
function makeSubmissionSummary_(payload) {
  payload = payload || {};
  // Resolve last name from common fields, defaulting to empty string.
  var lastName = '';
  if (typeof payload.last_name === 'string') lastName = payload.last_name;
  else if (typeof payload.lastName === 'string') lastName = payload.lastName;
  else if (typeof payload.name === 'string') {
    try {
      var parts = payload.name.trim().split(/\s+/);
      lastName = parts.length ? parts[parts.length - 1] : '';
    } catch (_) {}
  }
  // Allow the client to send quizzes_passed; otherwise default to empty array.
  var quizzesPassed = [];
  if (Array.isArray(payload.quizzes_passed)) quizzesPassed = payload.quizzes_passed.slice();
  else if (Array.isArray(payload.quizzesPassed)) quizzesPassed = payload.quizzesPassed.slice();

  return {
    title: 'Successful submission of quiz results!',
    quizzes_passed: quizzesPassed,
    last_name: lastName
  };
}

/** ── POST: parse payload, dedupe, verify, log, render ─────────────────── */
function doPost(e) {
  try {
    var payload = {};
    var ct = (e && e.postData && e.postData.type) || '';

    if (e && e.parameter && e.parameter.json_payload) {
      payload = JSON.parse(e.parameter.json_payload);
    } else if (ct && ct.indexOf('application/json') !== -1) {
      payload = JSON.parse(e.postData.contents || '{}');
    } else if (e && e.parameter && Object.keys(e.parameter).length) {
      payload = Object.assign({}, e.parameter);
    } else if (e && e.postData && e.postData.contents) {
      // Last-resort: try to parse whatever was sent
      try { payload = JSON.parse(e.postData.contents); }
      catch (_) { payload = { raw: e.postData.contents }; }
    } else {
      return respondJson_({ error: 'No POST body received' });
    }

    // Build and return the ultra-simple response consumed by launch-apps-script.
    var summary = makeSubmissionSummary_(payload);
    return respondJson_(summary);
  } catch (err) {
    return respondJson_({ error: 'Failed to handle POST', details: String(err) });
  }
}

/** ── Compose verification + context object used by renderer/logging ───── */
function summarize_(payload, source) {
  var serverReceivedAt = new Date().toISOString();

  var serverEmail = '';
  try {
    // Execute as: Me; Access: anyone with Google account (email may be blank off-domain)
    serverEmail = Session.getActiveUser().getEmail() || '';
  } catch (e) {}

  // Signature verification (mirror client canonicalization)
  var verification = { ok: false, provided: '', recomputed: '', spec: {} };
  try {
    // Primary: sort arrays before canonicalization (server-preferred)
    var signableSorted = sortSignableArrays_(buildSignableSubset_(payload));
    var canonicalSorted = canonicalizeForSignature_(signableSorted);
    var jsonSorted = JSON.stringify(canonicalSorted);
    var hashSorted = sha256Hex_(jsonSorted);

    verification.provided = payload.signature || '';
    verification.recomputed = hashSorted;
    verification.spec = payload.signatureSpec || { alg: 'SHA-256', scope: Object.keys(signableSorted) };
    verification.ok = !!verification.provided && verification.provided === hashSorted;

    if (!verification.ok && verification.provided) {
      // Fallback: accept legacy client signatures that did NOT sort arrays
      var signableLegacy = buildSignableSubset_(payload); // no sortSignableArrays_ here
      var canonicalLegacy = canonicalizeForSignature_(signableLegacy);
      var jsonLegacy = JSON.stringify(canonicalLegacy);
      var hashLegacy = sha256Hex_(jsonLegacy);
      verification.legacyRecomputed = hashLegacy;
      if (verification.provided === hashLegacy) {
        verification.ok = true;
        verification.compat = 'accepted_unsorted_arrays_signature';
        // For transparency, keep recomputed as server-preferred and expose legacy via debug
      }
    }

    if (DEBUG) {
      verification.debug = {
        serverPreferred: {
          signableObject: canonicalSorted,
          signableJson: jsonSorted,
          sha256: hashSorted,
          length: jsonSorted.length
        },
        legacy: (function(){
          try {
            var s = buildSignableSubset_(payload);
            var c = canonicalizeForSignature_(s);
            var j = JSON.stringify(c);
            return { signableObject: c, signableJson: j, sha256: sha256Hex_(j), length: j.length };
          } catch (_) { return { error: 'legacy_debug_failed' }; }
        })()
      };
    }
  } catch (e) {
    verification = { ok: false, error: 'Signature recomputation failed', details: String(e) };
  }

  // Clock skew check (±60 minutes)
  var skewOK = skewOk_(payload.submissionDate, serverReceivedAt, 60);

  return {
    serverReceivedAt: serverReceivedAt,
    source: source,
    serverEmail: serverEmail,
    clientEmail: payload.email || '',
    effectiveEmail: serverEmail || payload.email || '',
    submissionId: payload.submissionId || '',
    payloadVersion: payload.payloadVersion || '',
    clockSkewOk: skewOK,
    verification: verification,
    idTokenPresent: !!payload.idToken,
    parsedPayload: payload
  };
}