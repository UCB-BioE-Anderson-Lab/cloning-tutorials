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
    console.log('Processor received payload:', JSON.stringify(payload));
  
    // Derive identity from ID token if present; fall back to payload fields
    var userEmail = '';
    var givenName = '';
    var familyName = '';
    try {
      if (payload.idToken) {
        var check = verifyIdToken_(payload.idToken); // still defined in Code.js
        var claims = (check && check.ok && check.claims) ? check.claims : null;
        givenName = (claims && (claims.given_name || claims.givenName)) || '';
        familyName = (claims && (claims.family_name || claims.familyName)) || '';
        if (claims && claims.email) {
          userEmail = String(claims.email || '');
        }
      }
    } catch (_) {}

    // If verifyIdToken_ didn't give us claims, fall back to decoding the JWT locally
    if (payload.idToken && (!userEmail || !givenName || !familyName)) {
      try {
        var rawClaims = decodeJwtClaims_(payload.idToken);
        if (rawClaims) {
          if (!userEmail && rawClaims.email) userEmail = String(rawClaims.email);
          if (!givenName && (rawClaims.given_name || rawClaims.givenName)) givenName = String(rawClaims.given_name || rawClaims.givenName);
          if (!familyName && (rawClaims.family_name || rawClaims.familyName)) familyName = String(rawClaims.family_name || rawClaims.familyName);
        }
      } catch (e) {
        console.warn('Processor: failed to decode idToken claims', e);
      }
    }

    // Fallbacks when no ID token email
    if (!userEmail) {
      userEmail = String(
        (payload && (
          payload.email ||
          payload.user_email ||
          (payload.user && payload.user.email) ||
          (Array.isArray(payload.emails) && payload.emails.length ? payload.emails[0] : '')
        )) || ''
      ).trim();
    }
  
    // Resolve names: prefer ID token claims; then payload explicit fields; then payload.name split
    var firstName = givenName || payload.given_name || payload.givenName || payload.first_name || payload.firstName || '';
    var lastName = familyName || payload.family_name || payload.familyName || payload.last_name || payload.lastName || '';
    if ((!firstName || !lastName) && typeof payload.name === 'string') {
      try {
        var parts = payload.name.trim().split(/\s+/);
        if (!firstName) firstName = parts.length ? parts[0] : '';
        if (!lastName) lastName = parts.length > 1 ? parts[parts.length - 1] : lastName;
      } catch (_) {}
    }

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

    // Build the result object with required fields
    var result = {
      version: 'v2-flat',
      submission_id: submissionId,
      submitted_at: submittedAt,
      checksum: checksum,
      title: '3new one (from Processor.js) Successful submission of quiz results!',
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
    try {
      if (typeof GradesRecorder !== 'undefined' && GradesRecorder && typeof GradesRecorder.recordResult === 'function') {
        GradesRecorder.recordResult(result);
      } else {
        console.warn('GradesRecorder.recordResult is not available; skipping grade recording.');
      }
    } catch (e) {
      console.error('Failed to record grades:', e);
    }

    return result;
  }

// Decode a JWT and return its JSON claims without verification
function decodeJwtClaims_(jwt) {
  if (!jwt || typeof jwt !== 'string') return null;
  var parts = jwt.split('.');
  if (parts.length < 2) return null;
  var b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  // Pad base64 if needed
  while (b64.length % 4 !== 0) b64 += '=';
  var json;
  try {
    json = Utilities.newBlob(Utilities.base64Decode(b64)).getDataAsString();
  } catch (e) {
    // Fallback: UrlFetchApp based atob emulation if needed (rare)
    return null;
  }
  try {
    return JSON.parse(json);
  } catch (e2) {
    return null;
  }
}