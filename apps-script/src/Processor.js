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
  
    // Try to derive user email from the Google ID token (best-effort)
    var userEmail = '';
    try {
      if (payload.idToken) {
        var check = verifyIdToken_(payload.idToken); // still defined in Code.js
        var claims = (check && check.ok && check.claims) ? check.claims : null;
        var givenName = (claims && (claims.given_name || claims.givenName)) || '';
        var familyName = (claims && (claims.family_name || claims.familyName)) || '';
        if (claims && claims.email) {
          userEmail = String(claims.email || '');
        }
      }
    } catch (_) {}
  
    // Resolve names: prefer ID token claims; fall back to payload.name
    var firstName = givenName || '';
    var lastName = familyName || '';
    if ((!firstName || !lastName) && typeof payload.name === 'string') {
      try {
        var parts = payload.name.trim().split(/\s+/);
        if (!firstName) firstName = parts.length ? parts[0] : '';
        if (!lastName) lastName = parts.length ? parts[parts.length - 1] : '';
      } catch (_) {}
    }
    if (typeof payload.first_name === 'string' && !firstName) firstName = payload.first_name;
    if (typeof payload.last_name === 'string' && !lastName) lastName = payload.last_name;
    if (typeof payload.lastName === 'string' && !lastName) lastName = payload.lastName;

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

    return result;
  }