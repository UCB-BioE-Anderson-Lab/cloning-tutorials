/**
 * Processor.gs
 * Business logic for interpreting a submission payload.
 */

function processSubmission_(payload, idTokenClaims) {
  var email = (idTokenClaims && idTokenClaims.email) || payload.email || "";

  // Save the payload for short-term retrieval in a viewer page
  var ref = saveViewerPayload_(payload, 600); // 10 minutes
  var baseUrl;
  try {
    baseUrl = PropertiesService.getScriptProperties().getProperty('REPORT_VIEWER_URL') || '';
  } catch (err) {
    baseUrl = '';
  }
  var viewerUrl = baseUrl ? (baseUrl + '?ref=' + encodeURIComponent(ref)) : '';

  return {
    ok: true,
    email: email,
    openViewer: !!viewerUrl,
    viewerUrl: viewerUrl,
    ref: ref
  };
}

function saveViewerPayload_(payload, ttlSec) {
  var key = 'view:' + Utilities.getUuid();
  var cache = CacheService.getScriptCache();
  var ttl = Math.max(30, Math.min(ttlSec || 600, 1200));
  cache.put(key, JSON.stringify(payload), ttl);
  return key;
}