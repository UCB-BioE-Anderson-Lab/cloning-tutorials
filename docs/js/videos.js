// videos.js — the B144 lab training videos, rendered from one list.
//
// Every video lives once, in assets/videos.json. Pages never paste an embed; they say which
// video they want and this fills it in:
//
//   <div class="lab-video" data-video="lab_tour"></div>   one video
//   <div class="lab-video-index"></div>                    the whole list (videos.md)
//
// The protocol builder asks for a protocol's videos with LabVideos.forProtocol(id, values).
//
// A video with no YouTube id yet ("youtube": null) is not uploaded. Pages show nothing for it,
// and the index lists it as coming, so filling in the id is the only edit needed when it lands.
(function () {
  // Resolved against this script rather than the page, so it is right at any page depth.
  const LIST_URL = new URL('../assets/videos.json', document.currentScript.src).href;
  let listing = null;

  function load() {
    if (!listing) {
      listing = fetch(LIST_URL).then((r) => (r.ok ? r.json() : [])).catch(() => []);
    }
    return listing;
  }

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function player(v) {
    const frame = el('div', 'lab-video__frame');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.youtube)}`;
    iframe.title = v.title;
    iframe.loading = 'lazy';
    iframe.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    frame.appendChild(iframe);
    return frame;
  }

  // One video, with its title and description. Null when it has not been uploaded.
  function render(v) {
    if (!v || !v.youtube) return null;
    const fig = el('figure', 'lab-video__card');
    fig.appendChild(player(v));
    const cap = el('figcaption');
    cap.appendChild(el('strong', null, `Video ${v.n}: ${v.title}`));
    cap.appendChild(el('span', null, v.blurb));
    fig.appendChild(cap);
    return fig;
  }

  // A rule matches when every `when` field equals the protocol's input value. No `when` means
  // the video belongs to the protocol whatever its settings.
  function matches(rule, id, values) {
    if (rule.id !== id) return false;
    const when = rule.when || {};
    return Object.keys(when).every(
      (k) => String(values?.[k] ?? '').toLowerCase() === String(when[k]).toLowerCase()
    );
  }

  async function forProtocol(id, values) {
    const all = await load();
    return all.filter((v) => (v.protocols || []).some((r) => matches(r, id, values)));
  }

  async function fillSlots(root) {
    const all = await load();
    const bySlug = new Map(all.map((v) => [v.slug, v]));

    root.querySelectorAll('.lab-video[data-video]').forEach((slot) => {
      const card = render(bySlug.get(slot.dataset.video));
      slot.replaceChildren(...(card ? [card] : []));
      slot.hidden = !card;
    });

    root.querySelectorAll('.lab-video-index').forEach((slot) => {
      // Not an <ol>: every title already carries its number.
      const list = el('div', 'lab-video-index__list');
      for (const v of all) {
        const item = el('div', 'lab-video-index__item');
        const card = render(v);
        if (card) {
          item.appendChild(card);
        } else {
          item.appendChild(el('strong', null, `Video ${v.n}: ${v.title}`));
          item.appendChild(el('span', 'lab-video__pending', ' (coming soon)'));
          item.appendChild(el('p', null, v.blurb));
        }
        list.appendChild(item);
      }
      slot.replaceChildren(list);
    });
  }

  window.LabVideos = { load, forProtocol, render };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => fillSlots(document));
  } else {
    fillSlots(document);
  }
})();
