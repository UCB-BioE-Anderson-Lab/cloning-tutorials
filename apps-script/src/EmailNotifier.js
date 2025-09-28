

/**
 * EmailNotifier.js
 * Encapsulates confirmation email sending for quiz submissions.
 * Exposes a single method: EmailNotifier.sendConfirmation(result) -> boolean
 */
var EmailNotifier = (function () {
  // Allow Gmail/Googlemail plus campus Google Workspace; extend as needed
  var DOMAIN_ALLOW_RE = /@(?:gmail\.com|googlemail\.com|berkeley\.edu)$/i;

  function normalizeEmail_(result) {
    if (!result || typeof result !== 'object') return '';
    var cand = (result.email || result.user_email || '').toString().trim();
    return cand;
  }

  function isAllowedDomain_(email) {
    return DOMAIN_ALLOW_RE.test((email || '').toLowerCase());
  }

  function makeSubject_(result) {
    return 'Submission confirmation';
  }

  function makeBody_(result, to) {
    var lines = [];
    var first = (result.first_name || '').toString();
    var last  = (result.last_name  || '').toString();
    var fullName = [first, last].join(' ').trim();

    lines.push('Hello' + (first ? (' ' + first) : '') + ',');
    lines.push('');
    lines.push('We received your submission. Here is a summary:');
    lines.push('');
    if (fullName) lines.push('Name: ' + fullName);
    lines.push('Email: ' + to);

    if (result.wetlab_id != null && result.wetlab_id !== '') {
      lines.push('Wetlab ID: ' + result.wetlab_id);
      lines.push('You have completed lab safety training and may begin experiments. Use this ID on all sample labels.');
    }

    if (Array.isArray(result.quizzes_added_now) && result.quizzes_added_now.length) {
      lines.push('Newly recorded quizzes: ' + result.quizzes_added_now.join(', '));
    }
    if (Array.isArray(result.quizzes_passed_cumulative) && result.quizzes_passed_cumulative.length) {
      lines.push('All quizzes on record: ' + result.quizzes_passed_cumulative.join(', '));
    }

    if (result.assigned_gene)   lines.push('Assigned gene: ' + result.assigned_gene);
    if (result.submitted_at)    lines.push('Submitted at: ' + result.submitted_at);
    if (result.submission_id)   lines.push('Submission ID: ' + result.submission_id);
    if (result.checksum)        lines.push('Checksum: ' + result.checksum);

    lines.push('');
    lines.push('-- This is an automated message from the Cloning Tutorials system');
    return lines.join('\n');
  }

  /**
   * Sends the confirmation email. Returns true on success; false if skipped/failed.
   * Skips send if email missing or domain not allowed.
   */
  function sendConfirmation(result) {
    try {
      var to = normalizeEmail_(result);
      if (!to || !isAllowedDomain_(to)) return false;
      var subject = makeSubject_(result);
      var body    = makeBody_(result, to);
      MailApp.sendEmail({ to: to, subject: subject, body: body });
      return true;
    } catch (e) {
      console.warn('EmailNotifier.sendConfirmation failed', e);
      return false;
    }
  }

  return { sendConfirmation: sendConfirmation };
})();