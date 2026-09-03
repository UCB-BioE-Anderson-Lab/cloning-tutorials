/**
 * Processor.js
 * Responsible for transforming a raw submission payload into the
 * ultra-simple JSON summary consumed by launch-apps-script.
 */

/**
 * Build the ultra-simple response shape.
 * @param {Object} payload - JSON body posted by the client.
 * @return {Object}
 */
function processSubmission_(payload) {
    payload = payload || {};

    // Never log the raw ID token: it is a bearer credential and Stackdriver
    // retains these logs.
    try {
      var loggable = {};
      for (var lk in payload) {
        if (Object.prototype.hasOwnProperty.call(payload, lk)) loggable[lk] = payload[lk];
      }
      if (loggable.idToken) loggable.idToken = '[redacted]';
      console.log('Processor received payload:', JSON.stringify(loggable));
    } catch (_) {}

    // ── Identity ─────────────────────────────────────────────────────────
    // Identity comes from a Google ID token whose signature, audience, issuer
    // and expiry have all been checked by verifyIdToken_ (Code.js). There is
    // deliberately NO fallback: an unverifiable token, or no token at all,
    // means the submission is not recorded. Completing `lab_safety` issues a
    // wetlab ID, so an unauthenticated write here is a path to physical lab
    // access, not just to marks.
    var check = verifyIdToken_(payload.idToken);
    if (!check || !check.ok || !check.claims || !check.claims.email) {
      var reason = (check && check.error) || 'missing_id_token';
      console.error('Processor: submission REJECTED, identity not verified. reason=' + reason +
                    (check && check.aud ? (' aud_seen=' + check.aud) : ''));
      return rejectedSubmission_(payload, reason);
    }

    var claims = check.claims;
    var userEmail = String(claims.email || '').trim();
    // Names are taken from the verified claims only. The client sends copies of
    // these (decoded from the same token), but accepting them would mean writing
    // caller-controlled text into the gradebook and into mail sent as the
    // deploying user.
    var firstName = String(claims.given_name || claims.givenName || '');
    var lastName  = String(claims.family_name || claims.familyName || '');

    // Allow the client to send quizzes_passed (renamed to quizzes_passed_new)
    var assignedGene = payload.assignedGene || payload.assigned_gene || '';
    var quizzesPassedNew = [];
    if (Array.isArray(payload.quizzes_passed)) quizzesPassedNew = payload.quizzes_passed.slice();
    else if (Array.isArray(payload.quizzesPassed)) quizzesPassedNew = payload.quizzesPassed.slice();
    else if (Array.isArray(payload.quizzes_passed_new)) quizzesPassedNew = payload.quizzes_passed_new.slice();
    var submittedAt = payload.submissionDate || payload.submitted_at || new Date().toISOString();
    var submissionId = payload.submissionId || payload.submission_id || '';
    var checksum = payload.checksum || '';
    var results = (quizzesPassedNew.length
      ? ('You passed: ' + quizzesPassedNew.join(', ') + '. ')
      : '') + (assignedGene ? ('Assigned gene: ' + assignedGene + '.') : '');

    // Build the result object with required fields. `title` is deliberately
    // left blank here and set at the end, once we know what actually happened.
    var result = {
      version: 'v2-flat',
      ok: false,
      submission_id: submissionId,
      submitted_at: submittedAt,
      checksum: checksum,
      title: '',
      email: userEmail,
      first_name: firstName,
      last_name: lastName,
      assigned_gene: assignedGene,
      quizzes_passed_new: quizzesPassedNew,
      results: results,
      email_sent: false
    };

    // Include optional wetlab_id if present
    if (payload.wetlab_id !== undefined) {
      result.wetlab_id = payload.wetlab_id;
    }

    // Persist grades to the gradebook sheet (one row per email; quiz slugs as columns)
    var newlyAdded = [];
    var recorded = false;
    var recordError = '';
    try {
      if (typeof GradesRecorder !== 'undefined' && GradesRecorder && typeof GradesRecorder.recordResult === 'function') {
        var ret = GradesRecorder.recordResult(result);
        // recordResult returns the array of newly-stamped slugs on success and
        // undefined when it declined to write.
        if (Array.isArray(ret)) {
          newlyAdded = ret;
          recorded = true;
        } else {
          recordError = 'gradebook declined the write';
        }
      } else {
        recordError = 'GradesRecorder unavailable';
        console.error('GradesRecorder.recordResult is not available; nothing was recorded.');
      }
    } catch (e) {
      recordError = String((e && e.message) || e);
      console.error('Failed to record grades:', e);
    }
    result.quizzes_added_now = newlyAdded.slice();

    if (!recorded) {
      result.ok = false;
      result.error = 'not_recorded';
      result.title = 'Your submission was NOT recorded';
      result.message = 'The server could not write to the gradebook' +
        (recordError ? (' (' + recordError + ')') : '') +
        '. Nothing has been saved, and no wetlab ID has been issued. ' +
        'Please report this to your instructor.';
      return result;
    }

    result.ok = true;
    result.title = 'Successful submission of quiz results!';

    try {
      if (GradesRecorder && typeof GradesRecorder.getCumulativeQuizzes === 'function' && result.email) {
        var cum = GradesRecorder.getCumulativeQuizzes(result.email) || [];
        if (Array.isArray(cum)) result.quizzes_passed_cumulative = cum;
      }
    } catch (eCum) {
      console.warn('Processor: cumulative lookup failed', eCum);
    }

    // Assign pP6 ID if eligible (delegated to Pp6Allocator). Only set if allocator returns a number.
    // Reached only when the gradebook write succeeded, so a wetlab ID is never
    // issued for a submission that was not actually recorded.
    try {
      if (typeof Pp6Allocator !== 'undefined' && Pp6Allocator && typeof Pp6Allocator.assignIfEligible === 'function') {
        var maybeId = Pp6Allocator.assignIfEligible(result);
        if (maybeId != null && result.wetlab_id === undefined) {
          result.wetlab_id = maybeId; // integer assigned by allocator
        }
      }
    } catch (e2) {
      console.warn('Processor: pP6 assignment skipped due to error', e2);
    }

    try {
      if (typeof EmailNotifier !== 'undefined' &&
          EmailNotifier &&
          typeof EmailNotifier.sendConfirmation === 'function') {
        var sent = EmailNotifier.sendConfirmation(result);
        result.email_sent = !!sent;
      } else {
        result.email_sent = false;
        console.warn('EmailNotifier.sendConfirmation unavailable');
      }
    } catch (e3) {
      result.email_sent = false;
      console.warn('Processor: email send failed', e3);
    }
    return result;
  }

/**
 * Response for a submission whose identity could not be verified.
 * Records nothing, allocates no wetlab ID, sends no mail.
 * @param {Object} payload
 * @param {string} reason - error code from verifyIdToken_
 * @return {Object}
 */
function rejectedSubmission_(payload, reason) {
  var human = 'Your submission was NOT recorded, because your Google sign-in could not be verified. ';
  if (reason === 'missing_id_token') {
    human += 'No sign-in token reached the server. Sign in again, then resubmit.';
  } else if (reason === 'token_expired') {
    human += 'Your sign-in has expired. Sign in again, then resubmit.';
  } else if (reason === 'aud_mismatch') {
    human += 'This is a server configuration problem, not something you did wrong. ' +
             'Please send the code above to your instructor.';
  } else if (reason === 'email_not_verified') {
    human += 'The Google account you used has no verified email address. ' +
             'Use your berkeley.edu account.';
  } else {
    human += 'Sign in again, then resubmit. If it keeps happening, send the code above to your instructor.';
  }
  return {
    version: 'v2-flat',
    ok: false,
    error: reason,
    title: 'Not recorded — sign-in could not be verified',
    message: human,
    submission_id: (payload && (payload.submissionId || payload.submission_id)) || '',
    submitted_at: (payload && (payload.submissionDate || payload.submitted_at)) || new Date().toISOString(),
    checksum: '',
    email: '',
    first_name: '',
    last_name: '',
    assigned_gene: '',
    quizzes_passed_new: [],
    quizzes_added_now: [],
    results: '',
    email_sent: false
  };
}
