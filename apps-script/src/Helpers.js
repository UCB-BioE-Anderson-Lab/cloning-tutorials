
/**
 * Helpers.js
 * Utility functions for Sheets, Email, and temporary payload storage.
 */

// --- Student Matrix Helpers ---

function updateStudentMatrix_(payload) {
  // TODO: implement real sheet updates
  // For now, simulate: return an array of newly passed quizzes from payload
  if (payload && payload.quizzes) {
    return payload.quizzes.filter(function(q){ return q.passed; }).map(function(q){ return q.name; });
  }
  return [];
}

function assignPP6_(email) {
  // TODO: implement real assignment with a Sheet + LockService
  // For now, return a unique dummy ID
  return 'PP6-' + Utilities.getUuid().slice(0, 4).toUpperCase();
}

function sendConfirmation_(email, newlyPassed, pp6Id) {
  if (!email) return;
  var subject = "Submission received";
  var body = "Newly passed: " + JSON.stringify(newlyPassed);
  if (pp6Id) body += "\nAssigned pp6Id: " + pp6Id;
  try {
    MailApp.sendEmail(email, subject, body);
  } catch (err) {
    // Swallow errors for now
  }
}

// --- Viewer Payload Helpers ---

function saveViewerPayload_(payload, ttlSec) {
  var key = 'view:' + Utilities.getUuid();
  var cache = CacheService.getScriptCache();
  var ttl = Math.max(30, Math.min(ttlSec || 600, 1200));
  cache.put(key, JSON.stringify(payload), ttl);
  return key;
}

function loadViewerPayload_(ref) {
  var s = CacheService.getScriptCache().get(ref);
  return s ? JSON.parse(s) : null;
}
