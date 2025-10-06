

import { on } from './bus.js';

function getRects(){
  const root = document.getElementById('map-root');
  return (root && root.__rects) ? root.__rects : new Map();
}
function forEachRect(fn){ getRects().forEach((el, slug) => fn(el, slug)); }
function clearClasses(){
  forEachRect(el => { el.classList.remove('highlighted','dimmed','active'); });
}
function highlightSlugs(slugs){
  const set = new Set(slugs || []);
  forEachRect((el, slug) => {
    el.classList.remove('highlighted','dimmed');
    if (set.size === 0){ return; }
    if (set.has(slug)) el.classList.add('highlighted');
    else el.classList.add('dimmed');
  });
}
function focusSlug(slug){
  forEachRect(el => el.classList.remove('active'));
  const rect = getRects().get(slug);
  if (rect){ rect.classList.add('active'); rect.classList.add('highlighted'); }
}

// Event wiring
on('ready', () => { clearClasses(); });
on('select:zone', slug => { focusSlug(slug); highlightSlugs([slug]); });
on('hover:zone', slug => { /* optional hover styling could go here */ });
on('search:results', res => {
  const slugs = (res.keys || []).map(k => (k.split(':')[0]||'')).filter(Boolean);
  highlightSlugs(slugs);
});
// Manual API hooks
on('highlight:keys', keys => {
  const slugs = (keys||[]).map(k => (k.split(':')[0]||''));
  highlightSlugs(slugs);
});
on('clear:highlight', () => { clearClasses(); });