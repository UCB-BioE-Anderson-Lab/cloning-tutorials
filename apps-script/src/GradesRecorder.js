/**
 * GradesRecorder.js
 * Maintains a gradebook sheet with one row per email and one column per quiz slug.
 * Writes timestamps at the intersections when quizzes are passed.
 *
 * Public API:
 *   GradesRecorder.recordResult(result)
 *
 * Expects `result` shaped by Processor.js:
 *   {
 *     email, first_name, last_name, submitted_at,
 *     quizzes_passed_new: ["lab_safety", "pipetting", ...]
 *   }
 */
var GradesRecorder = (function () {
  // Configuration
  var SHEET_NAME = 'Completions';
  var STATIC_HEADERS = ['Email', 'First Name', 'Last Name', 'Last Seen']; // fixed columns before quiz slugs
  var TIMEZONE = Session.getScriptTimeZone() || 'America/Los_Angeles';
  var TIMESTAMP_NUMBER_FORMAT = 'yyyy-mm-dd"T"hh:mm:ss';
  var SPREADSHEET_ID = (function(){ try { return PropertiesService.getScriptProperties().getProperty('GRADES_SPREADSHEET_ID') || ''; } catch (e) { return ''; } })();

  function recordResult(result) {
    if (!result || typeof result !== 'object') {
      console.warn('GradesRecorder: missing or invalid result');
      return;
    }
    var email = extractEmail_(result);
    if (!email) {
      var entries = [];
      try {
        for (var k in result) {
          if (Object.prototype.hasOwnProperty.call(result, k)) {
            entries.push(k + '=' + JSON.stringify(result[k]));
          }
        }
      } catch (e) {}
      console.warn('GradesRecorder: result missing email; entries seen=', entries.join(', '));
      return;
    }

    var firstName = safeString_(result.first_name);
    var lastName = safeString_(result.last_name);
    var submittedAtIso = safeString_(result.submitted_at) || new Date().toISOString();
    var submittedDate = parseIsoDate_(submittedAtIso);
    var quizzes = Array.isArray(result.quizzes_passed_new) ? result.quizzes_passed_new.slice() : [];

    var sheet = getOrCreateSheet_(SHEET_NAME);
    var headers = getHeaders_(sheet);
    var neededHeaders = STATIC_HEADERS.concat(uniqueSlugs_(quizzes));
    headers = ensureHeaders_(sheet, headers, neededHeaders);

    // Column map for quick lookup
    var colIndex = {};
    headers.forEach(function (h, i) { colIndex[h] = i + 1; });

    // Find or insert row for this email
    var row = findRowByEmail_(sheet, email);
    if (row === -1) {
      row = appendEmptyRow_(sheet, headers.length);
      sheet.getRange(row, colIndex['Email']).setValue(email);
    }

    // Update names if provided
    if (firstName) sheet.getRange(row, colIndex['First Name']).setValue(firstName);
    if (lastName)  sheet.getRange(row, colIndex['Last Name']).setValue(lastName);

    // Update Last Seen
    setTimestamp_(sheet, row, colIndex['Last Seen'], submittedDate);

    // For each passed quiz slug, stamp the timestamp
    quizzes.forEach(function (slug) {
      var header = slugToHeader_(slug);
      var c = colIndex[header];
      if (!c) {
        // this means headers were changed since we built colIndex; ensure and refresh
        headers = ensureHeaders_(sheet, getHeaders_(sheet), headers.concat([header]));
        colIndex = {};
        headers.forEach(function (h, i) { colIndex[h] = i + 1; });
        c = colIndex[header];
      }
      upsertNewerTimestamp_(sheet, row, c, submittedDate);
    });
  }

  function extractEmail_(result) {
    if (!result || typeof result !== 'object') return '';
    var candidates = [];
    try {
      candidates = [
        result.email,
        result.user_email,
        result.email_address,
        result.user && result.user.email,
        result.contact && result.contact.email,
        Array.isArray(result.emails) && result.emails.length ? result.emails[0] : '',
        // Case-insensitive fallbacks (e.g., "Email" from forms)
        result.Email,
        result.eMail,
        result.EMAIL
      ];
    } catch (e) {}
    for (var i = 0; i < candidates.length; i++) {
      var v = safeString_(candidates[i]);
      if (v) return v.toLowerCase(); // accept campus identifiers without '@'
    }
    return '';
  }

  function isLikelyEmail_(s) {
    // Simple but effective email check; avoid super strict regex to handle campus variants
    return /.+@.+\..+/.test(String(s || ''));
  }

  // Helpers

  function getOrCreateSheet_(name) {
    if (!SPREADSHEET_ID) {
      throw new Error('GradesRecorder: missing script property GRADES_SPREADSHEET_ID. Set it to the target spreadsheet ID.');
    }
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sh = ss.getSheetByName(name);
    if (!sh) {
      sh = ss.insertSheet(name);
      sh.appendRow(STATIC_HEADERS);
      sh.getRange(1, 1, 1, STATIC_HEADERS.length).setFontWeight('bold');
    }
    return sh;
  }

  function getHeaders_(sheet) {
    var lastCol = Math.max(sheet.getLastColumn(), STATIC_HEADERS.length);
    if (lastCol === 0) return [];
    var values = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    // Trim trailing empty headers
    while (values.length && String(values[values.length - 1]).trim() === '') values.pop();
    return values.map(function (v) { return safeString_(v); });
  }

  function ensureHeaders_(sheet, current, needed) {
    var curSet = {};
    current.forEach(function (h) { curSet[h] = true; });

    var added = false;
    needed.forEach(function (h) {
      if (!curSet[h]) {
        current.push(h);
        curSet[h] = true;
        added = true;
      }
    });

    if (added) {
      sheet.getRange(1, 1, 1, current.length).setValues([current]);
      sheet.getRange(1, 1, 1, current.length).setFontWeight('bold');
    }
    return current;
  }

  function uniqueSlugs_(arr) {
    var seen = {};
    var out = [];
    arr.forEach(function (s) {
      var key = slugToHeader_(s);
      if (key && !seen[key]) {
        seen[key] = true;
        out.push(key);
      }
    });
    return out;
  }

  function slugToHeader_(slug) {
    var s = safeString_(slug);
    if (!s) return '';
    // Keep as is to match your URLs and Processor output, but you could title-case if desired
    return s;
  }

  function findRowByEmail_(sheet, email) {
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return -1;
    var emailCol = 1; // first column
    var values = sheet.getRange(2, emailCol, lastRow - 1, 1).getValues();
    for (var i = 0; i < values.length; i++) {
      if (safeString_(values[i][0]) === email) return 2 + i;
    }
    return -1;
  }

  function appendEmptyRow_(sheet, colCount) {
    var row = sheet.getLastRow() + 1;
    if (colCount < 1) colCount = 1;
    var blanks = new Array(colCount).fill('');
    sheet.getRange(row, 1, 1, colCount).setValues([blanks]);
    return row;
  }

  function setTimestamp_(sheet, row, col, dateObj) {
    if (!dateObj) return;
    var rng = sheet.getRange(row, col);
    rng.setValue(dateObj);
    rng.setNumberFormat(TIMESTAMP_NUMBER_FORMAT);
  }

  // Only write a timestamp if the cell is empty; never overwrite an existing value
  function upsertNewerTimestamp_(sheet, row, col, submittedDate) {
    if (!submittedDate) return;
    var rng = sheet.getRange(row, col);
    var current = rng.getValue();
    if (!current) {
      rng.setValue(submittedDate);
      rng.setNumberFormat(TIMESTAMP_NUMBER_FORMAT);
    }
  }

  function parseIsoDate_(iso) {
    try {
      var d = new Date(iso);
      if (!isFinite(d.getTime())) return new Date();
      // Normalize into project timezone
      return new Date(Utilities.formatDate(d, TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss'Z'"));
    } catch (e) {
      return new Date();
    }
  }

  function safeString_(v) {
    if (v === null || v === undefined) return '';
    return String(v).trim();
  }

  function configureSpreadsheet_(id) {
    if (!id || typeof id !== 'string') throw new Error('configureSpreadsheet: spreadsheet ID required');
    PropertiesService.getScriptProperties().setProperty('GRADES_SPREADSHEET_ID', id.trim());
  }

  // Expose public API
  return {
    recordResult: recordResult,
    configureSpreadsheet: configureSpreadsheet_
  };
})();