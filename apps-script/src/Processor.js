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
        if (check && check.ok && check.claims && check.claims.email) {
          userEmail = String(check.claims.email || '');
        }
      }
    } catch (_) {}
  
    // Resolve last name from common fields
    var lastName = '';
    if (typeof payload.last_name === 'string') lastName = payload.last_name;
    else if (typeof payload.lastName === 'string') lastName = payload.lastName;
    else if (typeof payload.name === 'string') {
      try {
        var parts = payload.name.trim().split(/\s+/);
        lastName = parts.length ? parts[parts.length - 1] : '';
      } catch (_) {}
    }
  
    // Allow the client to send quizzes_passed
    var quizzesPassed = [];
    if (Array.isArray(payload.quizzes_passed)) quizzesPassed = payload.quizzes_passed.slice();
    else if (Array.isArray(payload.quizzesPassed)) quizzesPassed = payload.quizzesPassed.slice();
  
    return {
      title: 'new one (from Processor.js) Successful submission of quiz results!',
      user_email: userEmail,
      assigned_gene: (payload.assignedGene || ''),
      quizzes_passed: quizzesPassed,
      last_name: lastName
    };
  }