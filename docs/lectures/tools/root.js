/* root.js -- where the deck being audited or printed is served from.
 *
 * The tools drive a LIVE deck in Chrome, so they need a URL, and that URL
 * belongs to the project using the engine, not to the engine.  It used to
 * be a constant in each tool naming one site's mkdocs server, which is why
 * these tools could only ever look at that site's decks.
 *
 * Resolution, first hit wins:
 *   1. $DECK_ROOT
 *   2. deck-root.txt beside this file -- ONE line, the URL.  It is the
 *      consuming project's own file and the engine sync never copies it,
 *      so each project keeps its own.
 *   3. http://127.0.0.1:8765/  (bin/serve in the lecture-deck repo)
 *
 * The root is the directory that HOLDS deck directories: a tool is given
 * <deck-dir> and loads <root><deck-dir>/lecture.js.  Always ends in "/".
 */
const fs = require('fs'), path = require('path');
module.exports = function deckRoot(){
  let r = process.env.DECK_ROOT;
  if (!r){
    try { r = fs.readFileSync(path.join(__dirname, 'deck-root.txt'), 'utf8')
                .split('\n').map(s => s.trim()).find(s => s && !s.startsWith('#')); }
    catch (e) { /* no file: fall through to the default */ }
  }
  r = r || 'http://127.0.0.1:8765/';
  return r.endsWith('/') ? r : r + '/';
};
