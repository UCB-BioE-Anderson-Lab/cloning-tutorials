

const root = document.getElementById("biocad-review-app");

const SELFTEST = new URLSearchParams(window.location.search).get("selftest") === "1";
const FETCH_LOG = [];

function assert(cond, msg) {
  if (!cond) {
    const e = new Error(`SELFTEST ASSERT FAILED: ${msg}`);
    console.error(e);
    throw e;
  }
}

function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderMarkdownish(text) {
  const raw = String(text ?? "");
  if (!raw) return "";

  // Split on fenced code blocks. Odd indices are code.
  const parts = raw.split(/```/);
  let html = "";

  const looksLikeSequenceLine = (line) => {
    const s = String(line ?? "");
    if (!s.trim()) return false;

    // Heuristic: lines that are mostly A/C/G/T/U/N (allow punctuation/spaces),
    // and long enough to plausibly be a sequence/strand line.
    const letters = s.replace(/[^A-Za-z]/g, "");
    if (!letters) return false;

    const nucLetters = letters.replace(/[^ACGTUNacgtun]/g, "");
    const ratio = nucLetters.length / letters.length;

    const nucRun = s.replace(/[^ACGTUNacgtun]/g, "");

    // If it starts like a strand line (5' or 3'), allow slightly shorter runs,
    // but still require actual nucleotide content.
    const hasStrandPrefix = /^\s*[53]'/.test(s);

    const hasManyNucs = ratio >= 0.75 && nucRun.length >= 8;
    const hasShortStrand = hasStrandPrefix && nucRun.length >= 6 && ratio >= 0.75;

    return hasManyNucs || hasShortStrand;
  };

  const renderPlainWithSequenceBlocks = (plainText) => {
    const rawPlain = String(plainText ?? "");
    if (!rawPlain) return "";

    // Respect explicit <pre>...</pre> and <python>...</python> blocks embedded in question text.
    // We treat them as preformatted code blocks and escape their contents.
    const blockRegex = /<(pre|python)>([\s\S]*?)<\/\1>/gi;
    const segments = [];
    let lastIdx = 0;
    let m;
    while ((m = blockRegex.exec(rawPlain)) !== null) {
      const start = m.index;
      const end = blockRegex.lastIndex;
      if (start > lastIdx) {
        segments.push({ type: "text", value: rawPlain.slice(lastIdx, start) });
      }
      const tag = String(m[1] || "").toLowerCase();
      const body = m[2];
      if (tag === "python") {
        segments.push({ type: "code", lang: "python", value: body });
      } else {
        segments.push({ type: "pre", value: body });
      }
      lastIdx = end;
    }
    if (lastIdx < rawPlain.length) {
      segments.push({ type: "text", value: rawPlain.slice(lastIdx) });
    }

    const renderTextSegment = (txt) => {
      const lines = String(txt ?? "").split(/\r?\n/);
      let out = "";
      let buf = [];
      let inSeq = false;

      const flushSeq = () => {
        if (!buf.length) return;
        const block = buf.join("\n");
        out += `<pre><code>${esc(block)}</code></pre>`;
        buf = [];
      };

      const flushPara = (paraLines) => {
        const joined = paraLines.join("\n");
        if (!joined.trim()) return;
        let s = esc(joined);
        s = s.replace(/`([^`\n]+)`/g, "<code>$1</code>");
        s = s.replace(/\n\n+/g, "</p><p>");
        s = s.replace(/\n/g, "<br>");
        out += `<p>${s}</p>`;
      };

      let para = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isSeq = looksLikeSequenceLine(line);

        if (isSeq) {
          if (para.length) {
            flushPara(para);
            para = [];
          }
          inSeq = true;
          buf.push(line);
          continue;
        }

        if (inSeq) {
          flushSeq();
          inSeq = false;
        }

        if (!String(line ?? "").trim()) {
          if (para.length) {
            flushPara(para);
            para = [];
          }
          continue;
        }

        para.push(line);
      }

      if (inSeq) flushSeq();
      if (para.length) flushPara(para);

      return out;
    };

    let out = "";
    for (const seg of segments) {
      if (seg.type === "pre") {
        const body = String(seg.value ?? "").replace(/^\s*\n/, "").replace(/\n\s*$/, "");
        out += `<pre><code>${esc(body)}</code></pre>`;
      } else if (seg.type === "code") {
        const body = String(seg.value ?? "").replace(/^\s*\n/, "").replace(/\n\s*$/, "");
        const lang = String(seg.lang || "").trim().toLowerCase();
        const cls = lang ? `language-${lang}` : "";
        out += `<pre class="${esc(cls)}"><code class="${esc(cls)}">${esc(body)}</code></pre>`;
      } else {
        out += renderTextSegment(seg.value);
      }
    }

    return out;
  };

  for (let i = 0; i < parts.length; i++) {
    const chunk = parts[i];

    // Code fence.
    if (i % 2 === 1) {
      const rawCode = String(chunk ?? "");
      const m = rawCode.match(/^\s*([A-Za-z0-9_-]+)\n([\s\S]*)$/);
      const lang = m ? String(m[1] || "").trim().toLowerCase() : "";
      const code = m ? String(m[2] ?? "") : rawCode;
      const cls = lang ? `language-${lang}` : "";
      html += `<pre class="${esc(cls)}"><code class="${esc(cls)}">${esc(code)}</code></pre>`;
      continue;
    }

    // Plain text with sequence-block detection.
    html += renderPlainWithSequenceBlocks(chunk);
  }

  html = html.replace(/<p><\/p>/g, "");
  // Collapse runs of paragraph separators introduced by mixed pre/text.
  html = html.replace(/(<\/pre>)\s*<p><\/p>/g, "$1");
  return html;
}

function toChoiceArray(choices) {
  if (Array.isArray(choices)) {
    const out = [];
    for (let i = 0; i < choices.length; i++) {
      const key = i < 26 ? String.fromCharCode(65 + i) : String(i + 1);
      out.push({ key, text: String(choices[i]) });
    }
    return out;
  }
  if (choices && typeof choices === "object") {
    return Object.entries(choices).map(([k, v]) => ({ key: String(k), text: String(v) }));
  }
  return [];
}

function formatQuestionBlock(q, includeAnswer = true) {
  const choices = toChoiceArray(q.choices);
  const lines = [];
  lines.push(`Q: ${q.question}`);
  lines.push("");
  lines.push("Choices:");
  for (const c of choices) lines.push(`${c.key}. ${String(c.text)}`);
  if (includeAnswer) {
    lines.push("");
    lines.push(`Correct answer: ${q.answer}`);
    lines.push("");
    lines.push("Explanation:");
    lines.push(String(q.explanation ?? ""));
  }
  return lines.join("\n");
}

async function loadJson(relPath) {
  const url = new URL(relPath, import.meta.url);
  if (SELFTEST) FETCH_LOG.push(url.toString());
  const res = await fetch(url.toString(), { cache: "no-cache" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url.pathname}`);
  return await res.json();
}

function renderLoading() {
  root.innerHTML = `
    <div class="biocad-card">
      <div class="biocad-muted">Loading review data...</div>
    </div>
  `;
  if (window.Prism && typeof window.Prism.highlightAllUnder === "function") {
    window.Prism.highlightAllUnder(root);
  }
}

function renderError(err) {
  root.innerHTML = `
    <div class="biocad-error">
      <div><strong>Failed to load review data.</strong></div>
      <div class="biocad-small biocad-muted">${esc(err?.message || err)}</div>
    </div>
  `;
}

function buildPrompt({ topic, question, selectedKey, bag }) {
  const topicTitle = topic?.title ?? topic?.topic_slug ?? "";
  const topicScope = topic?.scope ?? "";

  const lines = [];
  lines.push('You are assisting a student learning the topic and scope below. Respond to their questions to help them understand the topic, and ask them other questions within the scope to assess their comprehension and teach them mastery of the topic.');
  lines.push("");
  lines.push("");
  lines.push("Topic:");
  lines.push(topicTitle);
  lines.push("");
  lines.push("Scope:");
  lines.push(topicScope);
  lines.push("");
  lines.push("Current question:");
  lines.push(formatQuestionBlock(question, true));
  lines.push("");
  lines.push(`Student selected: ${selectedKey ?? "(no selection)"}`);
  lines.push("");
  lines.push("Here are 10 questions on this topic for reference:");
  lines.push("");

  const bagList = bag.slice(0, 10);
  for (let i = 0; i < bagList.length; i++) {
    lines.push(`---`);
    lines.push(`Bag item ${i + 1}`);
    lines.push(formatQuestionBlock(bagList[i], true));
    lines.push("");
  }

  return lines.join("\n");
}

function setClipboard(text) {
  return navigator.clipboard.writeText(text);
}

function bySlug(topics) {
  const m = new Map();
  for (const t of topics) m.set(t.topic_slug, t);
  return m;
}

function topicsWithQuestions(topics, bank) {
  return topics.filter(t => Array.isArray(bank[t.topic_slug]) && bank[t.topic_slug].length > 0);
}

function topicAreaLabel(t) {
  const p = Array.isArray(t?.path) ? t.path : [];
  if (p.length >= 1) return String(p[0]);
  return "";
}

function makeState(topics, bank) {
  const topicMap = bySlug(topics);
  const withQ = topicsWithQuestions(topics, bank);
  const tabs = withQ.slice(0, 16);
  const firstSlug = tabs[0]?.topic_slug ?? null;

  return {
    topics,
    topicMap,
    bank,
    tabs,
    activeTopicSlug: firstSlug,
    questionIndex: 0,
    focusMode: false,
    revealed: false,
    selectedKey: null,
    copied: false,
  };
}

function activeTopic(state) {
  if (!state.activeTopicSlug) return null;
  return state.topicMap.get(state.activeTopicSlug) ?? null;
}

function activeQuestions(state) {
  const slug = state.activeTopicSlug;
  if (!slug) return [];
  const qs = state.bank[slug] || [];
  return Array.isArray(qs) ? qs : [];
}

function getActiveQuestion(state) {
  const qs = activeQuestions(state);
  if (!qs.length) return null;
  const idx = Math.max(0, Math.min(state.questionIndex, qs.length - 1));
  return qs[idx] ?? null;
}

function resetReveal(state) {
  state.revealed = false;
  state.selectedKey = null;
  state.copied = false;
}

function setActiveTopicSlug(state, slug) {
  state.activeTopicSlug = slug;
  state.questionIndex = 0;
  resetReveal(state);
}

function setQuestionIndex(state, idx) {
  const qs = activeQuestions(state);
  if (!qs.length) {
    state.questionIndex = 0;
    resetReveal(state);
    return;
  }
  state.questionIndex = Math.max(0, Math.min(idx, qs.length - 1));
  resetReveal(state);
}

function render(state) {
  const t = activeTopic(state);
  const qs = activeQuestions(state);
  const q = getActiveQuestion(state);

  const area = t ? topicAreaLabel(t) : "";
  const topicTitle = t?.title ?? "Select a topic";
  const scope = t?.scope ?? "";

  const qProgress = qs.length ? `Question ${state.questionIndex + 1}/${qs.length}` : "";
  const focusLabel = state.focusMode ? "Focus: on" : "Focus: off";

  const leftTabsHtml = state.tabs
    .map((x, i) => {
      const active = x.topic_slug === state.activeTopicSlug;
      const cls = active ? "biocad-btn primary" : "biocad-btn";
      const num = i + 1;
      return `
        <button class="${cls}" data-tab="${esc(x.topic_slug)}" style="text-align:left; width:100%; padding:0.6rem 0.8rem">
          <div style="display:flex; gap:0.6rem; align-items:flex-start">
            <div style="min-width:2.4rem; font-weight:750">${num}</div>
            <div style="font-weight:650; line-height:1.15; white-space:normal">${esc(x.title)}</div>
          </div>
        </button>
      `;
    })
    .join("");

  const questionNav = qs.length
    ? `
      <div class="biocad-row" style="gap:0.6rem; align-items:center; margin-top:1rem">
        <div class="grow"></div>
        <button class="biocad-btn" data-action="prevQ" ${state.questionIndex <= 0 ? "disabled" : ""}>Prev</button>
        <button class="biocad-btn" data-action="nextQ" ${state.questionIndex >= qs.length - 1 ? "disabled" : ""}>Next</button>
      </div>
    `
    : "";

  const topicMetaPanel = `
    <div class="biocad-answer" style="margin-top:0.35rem">
      ${area ? `<div><span class="label">Area:</span> ${esc(area)}</div>` : ""}
      <div style="margin-top:0.35rem"><span class="label">Topic:</span> ${esc(topicTitle)}</div>
      <div style="margin-top:0.6rem">
        <div class="biocad-small biocad-muted">Scope</div>
        <div>${renderMarkdownish(scope)}</div>
      </div>
    </div>
  `;

  const questionPanel = q
    ? `
      <div class="biocad-answer" style="margin-top:0.35rem">
        <div>${renderMarkdownish(q.question)}</div>
      </div>
    `
    : `
      <div class="biocad-answer" style="margin-top:0.35rem">
        <div class="biocad-muted">No question available for this topic.</div>
      </div>
    `;

  const choices = q ? toChoiceArray(q.choices) : [];
  const answersPanel = choices.length
    ? `
      <div style="display:flex; flex-direction:column; gap:0.6rem; margin-top:0.35rem">
        ${choices
          .map((c) => {
            const isSelected = state.selectedKey === c.key;
            const isCorrect = q && c.key === q.answer;
            const isRevealed = state.revealed;

            let cls = "biocad-btn";
            if (!isRevealed && isSelected) cls += " primary";
            if (isRevealed && isCorrect) cls += " correct";
            if (isRevealed && isSelected && !isCorrect) cls += " incorrect";

            const disabled = state.revealed ? "disabled" : "";
            const dim = state.revealed && q && c.key !== q.answer ? "opacity:0.55;" : "";
            return `<button class="${cls}" data-choice="${esc(c.key)}" ${disabled} style="text-align:left; ${dim}"><strong>${esc(
              c.key
            )}</strong> <span>${renderMarkdownish(c.text)}</span></button>`;
          })
          .join("")}
      </div>
    `
    : "";

  const explanationPanel = q && state.revealed
    ? `
      <div class="biocad-answer" style="margin-top:0.35rem">
        <div class="biocad-row">
          <div class="label">Correct answer:</div>
          <div>${esc(q.answer)}</div>
          <div class="grow"></div>
          <div class="biocad-pill ${state.selectedKey === q.answer ? "" : "biocad-muted"}">
            ${state.selectedKey === q.answer ? "Correct" : "Incorrect"}
          </div>
        </div>
        <div style="margin-top:0.75rem">
          <div>${renderMarkdownish(q.explanation)}</div>
        </div>
        <div class="biocad-actions" style="margin-top:0.75rem">
          <button class="biocad-btn" data-action="copyPrompt">Copy Gemini prompt</button>
          ${state.copied ? `<span class="biocad-muted biocad-small">Copied</span>` : ``}
        </div>
      </div>
    `
    : "";

  root.innerHTML = `
    <div style="max-width:none">
      <div style="display:grid; grid-template-columns: 440px 520px 1fr; gap:1rem; align-items:start">
        <div class="biocad-col-left">
          <div class="biocad-card" style="padding:1rem">
            <div class="biocad-muted biocad-small">Topics (1–16)</div>
            <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.5rem">
              ${leftTabsHtml}
            </div>
          </div>
        </div>

        <div class="biocad-col-mid">
          <div class="biocad-card" style="padding:1rem">
            <div class="biocad-muted biocad-small">Topic metadata</div>
            ${topicMetaPanel}
          </div>
        </div>

        <div class="biocad-col-right">
          <div class="biocad-card" style="padding:1rem">
            <div class="biocad-row" style="gap:0.6rem; align-items:center; margin-bottom:0.75rem">
              ${qProgress ? `<div class="biocad-pill">${esc(qProgress)}</div>` : ``}
              <div class="grow"></div>
              <button class="biocad-btn" data-action="toggleFocus" style="white-space:nowrap">${esc(focusLabel)}</button>
            </div>

            <div>
              <div class="biocad-muted biocad-small">Question</div>
              ${questionPanel}
            </div>

            <div style="margin-top:1rem">
              <div class="biocad-muted biocad-small">Answers</div>
              ${answersPanel}
            </div>

            ${state.revealed ? `
              <div style="margin-top:1rem">
                <div class="biocad-muted biocad-small">Explanation</div>
                ${explanationPanel}
              </div>
            ` : ""}

            ${questionNav}
          </div>
        </div>
      </div>
    </div>
  `;
  if (window.Prism && typeof window.Prism.highlightAllUnder === "function") {
    window.Prism.highlightAllUnder(root);
  }
  if (state.focusMode) {
    root.classList.add("biocad-focus");
  } else {
    root.classList.remove("biocad-focus");
  }

  for (const btn of root.querySelectorAll("[data-tab]")) {
    btn.addEventListener("click", () => {
      const slug = btn.getAttribute("data-tab");
      if (!slug) return;
      setActiveTopicSlug(state, slug);
      render(state);
    });
  }

  root.querySelector('[data-action="prevQ"]')?.addEventListener("click", () => {
    setQuestionIndex(state, state.questionIndex - 1);
    render(state);
  });

  root.querySelector('[data-action="nextQ"]')?.addEventListener("click", () => {
    setQuestionIndex(state, state.questionIndex + 1);
    render(state);
  });

  root.querySelector('[data-action="toggleFocus"]')?.addEventListener("click", () => {
    state.focusMode = !state.focusMode;
    render(state);
  });

  for (const btn of root.querySelectorAll("[data-choice]")) {
    btn.addEventListener("click", () => {
      if (!q) return;
      state.selectedKey = btn.getAttribute("data-choice");
      state.revealed = true;
      state.copied = false;
      render(state);
    });
  }

  root.querySelector('[data-action="copyPrompt"]')?.addEventListener("click", async () => {
    if (!q || !t) return;
    const bag = activeQuestions(state);
    const prompt = buildPrompt({
      topic: t,
      question: q,
      selectedKey: state.selectedKey,
      bag,
    });
    try {
      await setClipboard(prompt);
      state.copied = true;
      render(state);
    } catch {
      alert("Copy failed. Your browser may block clipboard access on this page.");
    }
  });
}

function runSelfTest(state) {
  console.log("SELFTEST: fetched URLs:");
  for (const u of FETCH_LOG) console.log(u);

  assert(state.tabs.length <= 16, `tabs length is ${state.tabs.length} (>16)`);
  assert(state.tabs.length > 0, "no topics with questions available for tabs");

  const slug = state.tabs[0].topic_slug;
  const qs = state.bank[slug] || [];
  assert(Array.isArray(qs) && qs.length > 0, "first tab topic has no questions");

  state.activeTopicSlug = slug;
  state.questionIndex = 0;

  const q0 = getActiveQuestion(state);
  assert(q0 && q0.slug === qs[0].slug, "deep-dive first question mismatch");

  state.questionIndex = Math.max(0, qs.length - 1);
  const qLast = getActiveQuestion(state);
  assert(qLast && qLast.slug === qs[qs.length - 1].slug, "deep-dive last question mismatch");

  const topicMeta = state.topicMap.get(slug) || { title: slug, scope: "" };
  const prompt = buildPrompt({
    topic: topicMeta,
    question: qs[0],
    selectedKey: qs[0].answer,
    bag: qs,
  });
  assert(prompt.includes("How can I help you?"), "Gemini prompt missing required line");

  console.log("SELFTEST: PASS");
}

function installKeyHandler(state) {
  window.addEventListener("keydown", (ev) => {
    if (ev.target && ["INPUT", "TEXTAREA", "SELECT"].includes(ev.target.tagName)) return;

    const q = getActiveQuestion(state);

    const k = ev.key.toLowerCase();

    if (k === "n") {
      setQuestionIndex(state, state.questionIndex + 1);
      render(state);
      return;
    }

    if (k === "p") {
      setQuestionIndex(state, state.questionIndex - 1);
      render(state);
      return;
    }

    if (k >= "1" && k <= "9") {
      const idx = Number(k) - 1;
      if (idx >= 0 && idx < state.tabs.length) {
        setActiveTopicSlug(state, state.tabs[idx].topic_slug);
        render(state);
      }
      return;
    }

    if (k === "0") {
      const idx = 9;
      if (idx < state.tabs.length) {
        setActiveTopicSlug(state, state.tabs[idx].topic_slug);
        render(state);
      }
      return;
    }

    if (!q || state.revealed) return;

    const choices = toChoiceArray(q.choices);
    const pressed = ev.key.length === 1 ? ev.key.toUpperCase() : "";
    if (!pressed) return;

    const allowed = new Set(choices.map(c => String(c.key).toUpperCase()));
    if (allowed.has(pressed)) {
      state.selectedKey = pressed;
      state.revealed = true;
      state.copied = false;
      render(state);
    }
  });
}

async function main() {
  renderLoading();
  try {
    const topics = await loadJson("./data/topics_flat.json");
    const bank = await loadJson("./data/question_bank.json");

    const state = makeState(topics, bank);

    if (!state.tabs.length) {
      throw new Error("No topics with questions found in question_bank.json.");
    }

    installKeyHandler(state);

    if (SELFTEST) runSelfTest(state);

    setActiveTopicSlug(state, state.tabs[0].topic_slug);
    render(state);
  } catch (err) {
    renderError(err);
  }
}

main();