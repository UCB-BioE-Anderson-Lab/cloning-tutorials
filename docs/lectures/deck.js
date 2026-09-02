/* ------------------------------------------------------------------ *
 * deck.js — shared runtime for the 140L lecture slides.
 *
 * Each section is a standalone page.  Load order in a section page:
 *     <script src="../../deck.js" defer></script>
 *     <script src="lecture.js"    defer></script>   sets window.LECTURE
 *     <script src="seq/foo.js"    defer></script>   optional animations
 *
 * A slide is  <article class="slide" data-bg="white|blue|green|red|black">
 * with optional <template class="notes"> and <template class="desc">.
 * Children carrying data-build="1", "2", ... appear one click at a time.
 * A slide with data-seq="name" is driven by a registered sequence.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const SEQ = {};
const subs = [];
let steps = [], index = 0, built = false;

/* Public API is defined immediately so sequence files (which load after
   this one) can register before the deck is built on DOMContentLoaded. */
const Deck = window.Deck = {
  sequence: function(name, factory){ SEQ[name] = factory; },
  next:  function(){ go(index + 1); },
  prev:  function(){ go(index - 1); },
  goTo:  function(i){ go(i); },
  get index(){ return index; },
  get length(){ return steps.length; },
  channels: channels,
  steps: function(){ return steps.map(s => ({ note:s.note, description:s.desc })); },
  setMode: setMode,
  toggleFullscreen: toggleFull,
  on: function(fn){ subs.push(fn); return function(){ const i = subs.indexOf(fn); if (i>=0) subs.splice(i,1); }; }
};

/* ------------------------------------------------------------------ *
 * Where are we in the lecture?
 * ------------------------------------------------------------------ */
function lecture(){ return window.LECTURE || { title:"", sections:[] }; }
function fileName(){
  const p = location.pathname.split("/").pop();
  return p && p !== "" ? p : "index.html";
}
function sectionIndex(){
  return lecture().sections.findIndex(s => s.file === fileName());
}

/* ------------------------------------------------------------------ *
 * Build the step list from the markup
 * ------------------------------------------------------------------ */
function tpl(slide, cls){
  const t = slide.querySelector(":scope > template." + cls);
  return t ? t.innerHTML.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "";
}

function buildSteps(){
  const slides = Array.from(document.querySelectorAll("#stage .slide"));
  steps = [];
  slides.forEach(function(slide){
    const note = tpl(slide, "notes"), desc = tpl(slide, "desc");
    const seqName = slide.getAttribute("data-seq");

    if (seqName && SEQ[seqName]){
      const inst = SEQ[seqName](slide);
      slide._seq = inst;
      inst.steps.forEach(function(st, i){
        steps.push({ slide:slide, builds:0, seq:inst, seqIndex:i,
                     note: st.note != null ? st.note : note,
                     desc: st.desc != null ? st.desc : desc });
      });
      return;
    }

    const groups = Array.from(slide.querySelectorAll("[data-build]"))
      .map(el => parseInt(el.getAttribute("data-build"), 10) || 1)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => a - b);
    slide._groups = groups;

    steps.push({ slide:slide, builds:0, note:note, desc:desc });
    groups.forEach(function(g){
      const el = slide.querySelector('[data-build="' + g + '"]');
      steps.push({ slide:slide, builds:g,
                   note: el && el.hasAttribute("data-note") ? el.getAttribute("data-note") : "",
                   desc: el && el.hasAttribute("data-desc") ? el.getAttribute("data-desc") : desc });
    });
  });
  built = true;
}

/* ------------------------------------------------------------------ *
 * Render
 * ------------------------------------------------------------------ */
function paintStep(i, animated){
  const st = steps[i];
  if (!st) return;
  document.querySelectorAll("#stage .slide").forEach(function(s){
    s.classList.toggle("on", s === st.slide);
  });
  if (st.slide._groups){
    st.slide._groups.forEach(function(g){
      st.slide.querySelectorAll('[data-build="' + g + '"]').forEach(function(el){
        el.classList.toggle("in", g <= st.builds);
      });
    });
  }
  if (st.seq) st.seq.go(st.seqIndex, animated !== false);
  fit();
}

function channels(i){
  const st = steps[i == null ? index : i];
  return st ? { note: st.note, description: st.desc } : { note:"", description:"" };
}

function go(i, animated){
  if (!built) return;
  const L = lecture(), si = sectionIndex();

  if (i < 0){
    if (si > 0){ location.href = L.sections[si - 1].file + "#end"; return; }
    i = 0;
  }
  if (i >= steps.length){
    if (si >= 0 && si < L.sections.length - 1){ location.href = L.sections[si + 1].file; return; }
    i = steps.length - 1;
  }

  index = i;
  paintStep(index, animated);
  syncPanel();

  const ch = channels();
  document.getElementById("liveNote").textContent = ch.note;
  document.getElementById("liveDesc").textContent = ch.description;
  document.dispatchEvent(new CustomEvent("deck:step", { detail:{
    index:index, total:steps.length, section:si,
    note:ch.note, description:ch.description } }));
  subs.forEach(function(fn){ try{ fn(index, ch); }catch(e){} });
  if (speaking) speak(ch);
}

/* Scale the 1600x900 slide box to whatever room it has. */
function fit(){
  const deck = document.getElementById("deck");
  if (!deck) return;
  const w = deck.clientWidth, h = deck.clientHeight;
  const k = Math.min(w / 1600, h / 900);
  const x = (w - 1600 * k) / 2, y = (h - 900 * k) / 2;
  document.querySelectorAll("#stage .slide").forEach(function(s){
    s.style.transform = "translate(" + x + "px," + y + "px) scale(" + k + ")";
  });
  const shot = document.getElementById("nextshot");
  if (shot){
    const sk = shot.clientWidth / 1600;
    shot.querySelectorAll(".slide").forEach(function(s){ s.style.transform = "scale(" + sk + ")"; });
  }
}
window.addEventListener("resize", fit);

/* ------------------------------------------------------------------ *
 * Panel
 * ------------------------------------------------------------------ */
function syncPanel(){
  const L = lecture(), si = sectionIndex();
  const sec = si >= 0 ? L.sections[si] : null;
  const label = (si + 1) + ". " + (sec ? sec.title : document.title);

  document.getElementById("count").textContent = (index + 1) + " / " + steps.length;
  document.getElementById("pcount").textContent = "Slide " + (index + 1) + " of " + steps.length;
  document.getElementById("psection").textContent = sec ? label : "";

  const ch = channels();
  const pn = document.getElementById("pnote"), pd = document.getElementById("pdesc");
  pn.textContent = ch.note || "(no narration on this slide)";
  pn.className = ch.note ? "" : "empty";
  pd.textContent = ch.description || "(no description written yet)";
  pd.className = ch.description ? "" : "empty";

  const shot = document.getElementById("nextshot"), nn = document.getElementById("nextnote");
  if (!shot) return;
  shot.innerHTML = "";
  if (index + 1 < steps.length){
    const clone = steps[index + 1].slide.cloneNode(true);
    clone.classList.add("on");
    clone.querySelectorAll("[data-build]").forEach(function(el){
      const g = parseInt(el.getAttribute("data-build"), 10) || 1;
      el.classList.toggle("in", g <= steps[index + 1].builds);
    });
    shot.appendChild(clone);
    nn.textContent = "";
  } else if (si >= 0 && si < L.sections.length - 1){
    nn.textContent = "Next section: " + L.sections[si + 1].title;
  } else {
    nn.textContent = "End of lecture";
  }
  fit();
}

/* ------------------------------------------------------------------ *
 * Modes.  Mode, timer and full-screen intent survive the hop between
 * section pages via sessionStorage.
 * ------------------------------------------------------------------ */
const store = {
  get: function(k, d){ try{ const v = sessionStorage.getItem(k); return v == null ? d : v; }catch(e){ return d; } },
  set: function(k, v){ try{ sessionStorage.setItem(k, v); }catch(e){} }
};
const app = () => document.getElementById("app");

function mode(){ return app().getAttribute("data-mode"); }
function setMode(m){
  app().setAttribute("data-mode", m);
  store.set("deck:mode", m);
  document.getElementById("bpres").setAttribute("aria-pressed", m === "presenter");
  document.getElementById("bwcag").setAttribute("aria-pressed", m === "wcag");
  syncPanel();
}
function isFull(){ return !!document.fullscreenElement; }
function toggleFull(){
  if (isFull()){ store.set("deck:fs", "0"); document.exitFullscreen(); }
  else {
    store.set("deck:fs", "1");
    const r = document.documentElement.requestFullscreen;
    if (r) r.call(document.documentElement).catch(function(){});
  }
}
document.addEventListener("fullscreenchange", function(){
  const b = document.getElementById("bfull");
  b.setAttribute("aria-pressed", isFull());
  b.textContent = isFull() ? "Exit full screen" : "Full screen";
});

/* Full screen is dropped by the browser on navigation and cannot be
   re-entered without a gesture, so re-enter on the presenter's next key
   or click.  (F11 / control-command-F survives the hop on its own.) */
function armFullscreenResume(){
  if (store.get("deck:fs", "0") !== "1" || isFull()) return;
  const resume = function(){
    document.removeEventListener("keydown", resume, true);
    document.removeEventListener("mousedown", resume, true);
    const r = document.documentElement.requestFullscreen;
    if (r) r.call(document.documentElement).catch(function(){});
  };
  document.addEventListener("keydown", resume, true);
  document.addEventListener("mousedown", resume, true);
}

/* ------------------------------------------------------------------ *
 * Speech — an accessibility actuator for the two text channels
 * ------------------------------------------------------------------ */
let speaking = false;
function speak(ch){
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  [ch.note, ch.description].filter(Boolean).forEach(function(t){
    speechSynthesis.speak(new SpeechSynthesisUtterance(t));
  });
}
function setSpeak(on){
  speaking = on;
  store.set("deck:speak", on ? "1" : "0");
  document.getElementById("bspeak").setAttribute("aria-pressed", on);
  if (!on && "speechSynthesis" in window) speechSynthesis.cancel();
  else if (on) speak(channels());
}

/* ------------------------------------------------------------------ *
 * Section jump menu
 * ------------------------------------------------------------------ */
function buildJump(){
  const L = lecture(), si = sectionIndex();
  const ol = document.querySelector("#jump ol");
  ol.innerHTML = "";
  L.sections.forEach(function(s, i){
    const li = document.createElement("li");
    if (i === si) li.className = "here";
    li.innerHTML = '<a href="' + s.file + '"><span class="n">' + (i + 1) +
                   '</span><span class="k ' + (s.kind || "white") + '"></span><span>' +
                   s.title + "</span></a>";
    ol.appendChild(li);
  });
  document.querySelector("#jump h2").textContent = L.title || "Sections";
}


/* ------------------------------------------------------------------ *
 * Chrome.  Injected here so a section file contains nothing but its
 * <article class="slide"> elements and three script tags.
 * ------------------------------------------------------------------ */
function injectChrome(){
  const slides = Array.from(document.querySelectorAll("article.slide"));
  const app = document.createElement("div");
  app.id = "app"; app.setAttribute("data-mode", "slide");
  app.innerHTML =
    '<div id="deck"><div id="stage"></div>' +
      '<div id="bar">' +
        '<button id="prev" title="Previous (left arrow)">&#8249;</button>' +
        '<span id="count"></span>' +
        '<button id="nextb" title="Next (right arrow)">&#8250;</button>' +
        '<span class="sep"></span>' +
        '<button id="bjump" title="Sections (G)">Sections</button>' +
        '<button id="bfull" aria-pressed="false" title="Full screen (F)">Full screen</button>' +
        '<button id="bpres" aria-pressed="false" title="Presenter view (P)">Presenter</button>' +
        '<button id="bwcag" aria-pressed="false" title="Text channels (W)">Text</button>' +
        '<button id="bhelp" title="Shortcuts (?)">?</button>' +
      '</div>' +
      '<div id="help" class="overlay"><dl>' +
        '<dt>right / down / space</dt><dd>Next</dd>' +
        '<dt>left / up</dt><dd>Previous</dd>' +
        '<dt>Home / End</dt><dd>First / last slide of this section</dd>' +
        '<dt>G</dt><dd>Jump to a section</dd>' +
        '<dt>F</dt><dd>Full screen (F11 survives section changes)</dd>' +
        '<dt>P</dt><dd>Presenter view</dd>' +
        '<dt>W</dt><dd>Text-channel (WCAG) view</dd>' +
        '<dt>S</dt><dd>Speak the two channels</dd>' +
        '<dt>Esc</dt><dd>Back to the in-frame slide</dd>' +
        '<dt>?</dt><dd>This list</dd>' +
      '</dl></div>' +
      '<div id="jump" class="overlay"><div><h2></h2><ol></ol></div></div>' +
    '</div>' +
    '<aside id="panel">' +
      '<div class="pmeta"><span id="pcount"></span><span id="clock">00:00</span></div>' +
      '<div id="psection"></div>' +
      '<div class="chan note"><h2>Narration</h2><p id="pnote"></p></div>' +
      '<div class="chan"><h2>Visual description</h2><p id="pdesc"></p></div>' +
      '<div id="nextwrap"><h2>Next</h2><div id="nextshot"></div><div id="nextnote"></div></div>' +
      '<div id="speakrow"><button id="bspeak" aria-pressed="false">Speak channels</button></div>' +
    '</aside>';
  document.body.insertBefore(app, document.body.firstChild);
  const stage = app.querySelector("#stage");
  slides.forEach(function(s){ stage.appendChild(s); });

  const live = document.createElement("div");
  live.innerHTML = '<div class="sr" aria-live="polite" id="liveNote"></div>' +
                   '<div class="sr" aria-live="polite" id="liveDesc"></div>';
  document.body.appendChild(live);
}

/* ------------------------------------------------------------------ *
 * Boot
 * ------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", function(){
  injectChrome();
  buildSteps();
  buildJump();

  const help = document.getElementById("help"), jump = document.getElementById("jump");
  const bar = document.getElementById("bar");
  let hideT = null;
  function poke(){
    bar.classList.add("show");
    clearTimeout(hideT);
    hideT = setTimeout(function(){ bar.classList.remove("show"); }, 2600);
  }
  document.addEventListener("mousemove", poke); poke();

  document.getElementById("prev").onclick  = function(e){ e.stopPropagation(); go(index - 1); };
  document.getElementById("nextb").onclick = function(e){ e.stopPropagation(); go(index + 1); };
  document.getElementById("bfull").onclick = function(e){ e.stopPropagation(); toggleFull(); };
  document.getElementById("bpres").onclick = function(e){ e.stopPropagation(); setMode(mode() === "presenter" ? "slide" : "presenter"); };
  document.getElementById("bwcag").onclick = function(e){ e.stopPropagation(); setMode(mode() === "wcag" ? "slide" : "wcag"); };
  document.getElementById("bjump").onclick = function(e){ e.stopPropagation(); jump.classList.toggle("show"); };
  document.getElementById("bhelp").onclick = function(e){ e.stopPropagation(); help.classList.toggle("show"); };
  document.getElementById("bspeak").onclick = function(e){ e.stopPropagation(); setSpeak(!speaking); };

  // Clicking the slide does NOT advance — a stray click on a projector or
  // a tablet should never move the deck. A click only dismisses an overlay.
  document.getElementById("deck").addEventListener("click", function(e){
    if (e.target.closest("#bar") || e.target.closest("#jump")) return;
    if (help.classList.contains("show")) help.classList.remove("show");
    else if (jump.classList.contains("show")) jump.classList.remove("show");
  });

  document.addEventListener("keydown", function(e){
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (k === "ArrowRight" || k === "ArrowDown" || k === " " || k === "PageDown" || k === "n"){ go(index + 1); e.preventDefault(); }
    else if (k === "ArrowLeft" || k === "ArrowUp" || k === "PageUp" || k === "Backspace"){ go(index - 1); e.preventDefault(); }
    else if (k === "Home"){ go(0); e.preventDefault(); }
    else if (k === "End"){ go(steps.length - 1); e.preventDefault(); }
    else if (k === "f" || k === "F"){ toggleFull(); e.preventDefault(); }
    else if (k === "p" || k === "P"){ setMode(mode() === "presenter" ? "slide" : "presenter"); e.preventDefault(); }
    else if (k === "w" || k === "W"){ setMode(mode() === "wcag" ? "slide" : "wcag"); e.preventDefault(); }
    else if (k === "s" || k === "S"){ setSpeak(!speaking); e.preventDefault(); }
    else if (k === "g" || k === "G"){ jump.classList.toggle("show"); e.preventDefault(); }
    else if (k === "?"){ help.classList.toggle("show"); e.preventDefault(); }
    else if (k === "Escape"){
      if (help.classList.contains("show")) help.classList.remove("show");
      else if (jump.classList.contains("show")) jump.classList.remove("show");
      else if (isFull()){ store.set("deck:fs", "0"); document.exitFullscreen(); }
      else setMode("slide");
    }
  });

  // restore presenter state carried over from the previous section
  setMode(store.get("deck:mode", "slide"));
  if (store.get("deck:speak", "0") === "1") setSpeak(true);
  if (!store.get("deck:t0", "")) store.set("deck:t0", String(Date.now()));
  const t0 = parseInt(store.get("deck:t0", String(Date.now())), 10);
  setInterval(function(){
    const s = Math.floor((Date.now() - t0) / 1000);
    document.getElementById("clock").textContent =
      String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }, 1000);
  armFullscreenResume();

  go(location.hash === "#end" ? steps.length - 1 : 0, false);
});
})();
