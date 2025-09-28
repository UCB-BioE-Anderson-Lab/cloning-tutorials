/**
 * Pp6Allocator.js
 * Assigns persistent pP6 numeric IDs to students once they are eligible.
 * Eligibility and all persistence logic live here (not in Processor).
 *
 * Storage:
 * - Uses the same spreadsheet as GradesRecorder via the GRADES_SPREADSHEET_ID script property.
 * - Writes to a dedicated sheet tab: 'pP6_id' with columns:
 *   [Email, First Name, Last Name, wetlab_id, Assigned_At]
 * - Maintains a monotonic counter in Script Properties: PP6_NEXT (integer as string)
 */
var Pp6Allocator = (function () {
  var ASSIGNMENT_SHEET = 'pP6_id';
  var COUNTER_KEY = 'PP6_NEXT';

  // Read shared spreadsheet id from script properties
  var SPREADSHEET_ID = (function () {
    try {
      return PropertiesService.getScriptProperties().getProperty('GRADES_SPREADSHEET_ID') || '';
    } catch (e) {
      return '';
    }
  })();

  function ensureSpreadsheet_() {
    if (!SPREADSHEET_ID) {
      throw new Error('Pp6Allocator: missing GRADES_SPREADSHEET_ID');
    }
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }

  function getOrCreateAssignmentSheet_() {
    var ss = ensureSpreadsheet_();
    var sh = ss.getSheetByName(ASSIGNMENT_SHEET);
    if (!sh) {
      sh = ss.insertSheet(ASSIGNMENT_SHEET);
      sh.appendRow(['Email', 'First Name', 'Last Name', 'wetlab_id', 'Assigned_At']);
    }
    return sh;
  }

  function findRowByEmail_(sh, email) {
    var last = sh.getLastRow();
    if (last < 2) return 0; // header only
    var rng = sh.getRange(2, 1, last - 1, 1).getValues();
    var target = String(email || '').toLowerCase();
    for (var i = 0; i < rng.length; i++) {
      var v = String(rng[i][0] || '').toLowerCase();
      if (v === target) return i + 2; // 1-based index including header
    }
    return 0;
  }

  function nextId_() {
    var sh = getOrCreateAssignmentSheet_();
    var last = sh.getLastRow();
    console.log("last" + last);
    if (last < 2) return 1; // first assignment
    console.log("last > 2");

    var rng = sh.getRange(2, 4, last - 1, 1).getValues(); // col 4 = wetlab_id
    var max = 0;
    for (var i = 0; i < rng.length; i++) {
      var cell = rng[i][0];
      var n;
      if (typeof cell === 'number') {
        n = Math.floor(cell);
      } else {
        var s = String(cell || '').trim();
        // strip any non-digits (handles accidental prefixes like 'ID-405')
        s = s.replace(/[^0-9]/g, '');
        n = s ? parseInt(s, 10) : NaN;
      }
      if (!isNaN(n) && n > max) max = n;
    }
    return max + 1;
  }

  // --- Eligibility logic lives here ---
  /**
   * Eligibility rule:
   * 1. Email must be a berkeley.edu address
   * 2. The student must be newly reporting completion of lab_safety (i.e. present in newlyAdded slugs)
   */
  function isEligible_(email, newlyAdded) {
    var e = String(email || '').trim().toLowerCase();
    var isBerkeley = e.endsWith('@berkeley.edu');
    var hasNewLabSafety = Array.isArray(newlyAdded) && newlyAdded.indexOf('lab_safety') !== -1;
    return isBerkeley && hasNewLabSafety;
  }

  function extractEmail_(o) {
    if (!o || typeof o !== 'object') return '';
    var candidates = [];
    try {
      candidates = [
        o.email,
        o.user_email,
        o.email_address,
        o.user && o.user.email,
        Array.isArray(o.emails) && o.emails.length ? o.emails[0] : '',
        o.Email, o.eMail, o.EMAIL
      ];
    } catch (e) {}
    for (var i = 0; i < candidates.length; i++) {
      var v = String(candidates[i] == null ? '' : candidates[i]).trim();
      if (v) return v.toLowerCase();
    }
    return '';
  }

  function extractNames_(o) {
    var first = '', last = '';
    if (o && typeof o === 'object') {
      first = String(o.first_name || o.firstName || o.given_name || o.givenName || '').trim();
      last  = String(o.last_name  || o.lastName  || o.family_name || o.familyName || '').trim();
      if ((!first || !last) && typeof o.name === 'string') {
        try {
          var parts = o.name.trim().split(/\s+/);
          if (!first) first = parts.length ? parts[0] : '';
          if (!last)  last  = parts.length > 1 ? parts[parts.length - 1] : '';
        } catch (e) {}
      }
    }
    return { first: first, last: last };
  }

  function extractNewlyAdded_(o) {
    if (!o || typeof o !== 'object') return [];
    var arr = o.quizzes_added_now;
    return Array.isArray(arr) ? arr.slice() : [];
  }

  /**
   * Assign a numeric pP6 ID if eligible.
   * @param {object} result - Full result object from Processor (must include email, names, and quizzes_added_now)
   * @returns {number|null} newly assigned numeric id; null if ineligible or on error
   */
  function assignIfEligible(result) {
    try {
      if (!result || typeof result !== 'object') return null;
      var e = extractEmail_(result);
      var names = extractNames_(result);
      var newly = extractNewlyAdded_(result);
      if (!isEligible_(e, newly)) return null;

      var lock = LockService.getScriptLock();
      lock.waitLock(30000); // up to 30s
      try {
        var sh = getOrCreateAssignmentSheet_();
        var id = nextId_();
        sh.appendRow([e, names.first, names.last, id, new Date()]);
        return id;
      } finally {
        try { lock.releaseLock(); } catch (ignore) {}
      }
    } catch (err) {
      console.warn('Pp6Allocator.assignIfEligible error', err);
      return null;
    }
  }

  return {
    assignIfEligible: assignIfEligible
  };
})();