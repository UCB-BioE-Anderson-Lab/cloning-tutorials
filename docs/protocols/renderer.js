function normalizeValues(values){
  const out = { ...values };
  for (const k of Object.keys(out)){
    const v = out[k];
    if (typeof v === 'string'){
      const s = v.trim().toLowerCase();
      if (s === 'true' || s === 'false') out[k] = (s === 'true');
      else if (!Number.isNaN(Number(s)) && s !== '') out[k] = Number(s);
      else out[k] = s;
    }
  }
  return out;
}

async function importModule(id){
  return await import(`./modules/${id}.js`);
}

// Build the dependency graph by executing factories to discover includes (using provided values or defaults)
// Propagate derived values down the dependency graph and return both the graph and merged values
async function buildGraph(rootId, values){
  const graph = new Map(); // id -> { mod, obj, inputs, includesRequired, includesOptional, optional }
  const visiting = new Set();

  function normalizeIncludes(obj){
    const inc = obj && obj.includes;
    if (!inc) return { required: [], optional: [] };
    if (Array.isArray(inc)) return { required: inc, optional: [] };
    const required = Array.isArray(inc.required) ? inc.required : [];
    const optional = Array.isArray(inc.optional) ? inc.optional : [];
    return { required, optional };
  }

  async function visit(id, vals, isOptional){
    const existing = graph.get(id);
    if (existing){
      // if we revisit as required, downgrade the optional flag
      existing.optional = existing.optional && isOptional;
      return vals;
    }
    if (visiting.has(id)) return vals; // guard against cycles
    visiting.add(id);

    const mod = await importModule(id);
    const inputs = Array.isArray(mod.inputs) ? mod.inputs : [];
    const obj = typeof mod.factory === 'function' ? mod.factory(vals || {}) : {};
    const { required: includesRequired, optional: includesOptional } = normalizeIncludes(obj);

    const node = { mod, obj, inputs, includesRequired, includesOptional, optional: !!isOptional };
    graph.set(id, node);

    // propagate any derived values from this module to its children
    let nextVals = vals;
    if (obj && obj.derived && typeof obj.derived === 'object'){
      nextVals = { ...vals, ...obj.derived };
    }

    for (const child of includesRequired){
      if (typeof child === 'string' && child){
        nextVals = await visit(child, nextVals, false);
      }
    }
    for (const child of includesOptional){
      if (typeof child === 'string' && child){
        nextVals = await visit(child, nextVals, true);
      }
    }

    visiting.delete(id);
    return nextVals;
  }

  const finalVals = await visit(rootId, values || {}, false);
  return { graph, values: finalVals };
}

function mergeInputs(graph){
  const seen = new Set();
  const merged = [];
  for (const { inputs, optional } of graph.values()){
    if (optional) continue; // do not ask questions from optional modules
    for (const inp of (inputs || [])){
      const key = inp && inp.name;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      merged.push(inp);
    }
  }
  return merged;
}

function substituteVariables(text, values){
  return String(text || '').replace(/\{([a-zA-Z0-9_]+)\}/g, (m,k)=> (k in values ? String(values[k]) : m));
}

// ---- Text rendering (legacy/plain) ----
function replaceIncludeBlockText(body, name, replacement){
  // Prefer whole-line replacement; fallback to inline with newlines
  const lineRe = new RegExp(`(^|\n)[\t ]*\\{${name}\\}[\t ]*(?=\n|$)`, 'g');
  if (lineRe.test(body)){
    return body.replace(lineRe, (m, pre)=>`${pre}${replacement}\n`);
  }
  const inlineRe = new RegExp(`\\{${name}\\}`, 'g');
  return body.replace(inlineRe, `\n${replacement}\n`);
}

async function renderFromGraphText(graph, id, values){
  const node = graph.get(id);
  if (!node) throw new Error(`Unknown module: ${id}`);
  let out = String(node.obj.template || '');
  out = substituteVariables(out, values);

  const children = [ ...(node.includesRequired || []), ...(node.includesOptional || []) ];
  const inserted = new Set();

  for (const child of children){
    const childRendered = await renderFromGraphText(graph, child, values);
    // Did the template reference this include?
    const lineRe = new RegExp(`(^|\n)[\t ]*\\{${child}\\}[\t ]*(?=\n|$)`);
    const inlineRe = new RegExp(`\\{${child}\\}`);
    const hasRef = lineRe.test(out) || inlineRe.test(out);
    const next = replaceIncludeBlockText(out, child, childRendered);
    if (next !== out) inserted.add(child);
    out = next;
  }

  // Append any unreferenced includes at the end (keeps required/optional visible by default)
  for (const child of children){
    if (!inserted.has(child)){
      const childRendered = await renderFromGraphText(graph, child, values);
      out += `\n\n${childRendered}`;
    }
  }

  return out.replace(/\n{3,}/g, '\n\n').trim();
}

// ---- HTML rendering (structured) ----
function replaceIncludeBlockHTML(body, name, replacementHTML){
  // Prefer whole-line replacement; fallback to inline with block breaks
  const lineRe = new RegExp(`(^|\n)[\t ]*\\{${name}\\}[\t ]*(?=\n|$)`, 'g');
  if (lineRe.test(body)){
    return body.replace(lineRe, (m, pre)=>`${pre}${replacementHTML}\n`);
  }
  const inlineRe = new RegExp(`\\{${name}\\}`, 'g');
  return body.replace(inlineRe, `\n${replacementHTML}\n`);
}

async function renderFromGraphHTML(graph, id, values, depth = 0){
  const node = graph.get(id);
  if (!node) throw new Error(`Unknown module: ${id}`);

  const requiredSet = new Set(node.includesRequired || []);
  const optionalSet = new Set(node.includesOptional || []);

  // Prepare a fast lookup for valid include names on this node
  const includeSet = new Set([...(node.includesRequired||[]), ...(node.includesOptional||[])]);
  const inserted = new Set();

  // Substitute variables first, then process line-by-line so we can inject child HTML unescaped
  let templ = substituteVariables(String(node.obj.template || ''), values);
  const lines = templ.split(/\n/);

  const chunks = [];
  let buffer = [];

  function flushBuffer(){
    if (buffer.length){
      const html = textToHTMLBlocks(buffer.join('\n'));
      if (html) chunks.push(html);
      buffer = [];
    }
  }

  for (const line of lines){
    const m = line.match(/^\s*\{([a-zA-Z0-9_]+)\}\s*$/);
    if (m){
      const name = m[1];
      if (includeSet.has(name)){
        // render child as HTML block and insert raw
        const childHTML = await renderFromGraphHTML(graph, name, values, depth + 1);
        const childTitle = (graph.get(name)?.obj?.name) || name;
        if (requiredSet.has(name)){
          flushBuffer();
          chunks.push(childHTML);
          inserted.add(name);
        } else if (optionalSet.has(name)){
          flushBuffer();
          chunks.push(`<details class="proto-optional"><summary>Additional detail: ${escapeHtml(childTitle)}</summary>\n${childHTML}\n</details>`);
          inserted.add(name);
        }
        continue;
      }
    }
    // Check for inline includes and replace them
    let processedLine = line;
    const inlineIncludeRe = /\{([a-zA-Z0-9_]+)\}/g;
    let match;
    let offset = 0;
    const replacements = [];
    while ((match = inlineIncludeRe.exec(line)) !== null) {
      const name = match[1];
      if (includeSet.has(name)) {
        replacements.push({start: match.index, end: match.index + match[0].length, name});
      }
    }
    if (replacements.length > 0) {
      let result = '';
      let lastIndex = 0;
      for (const rep of replacements) {
        // Append text before the include
        result += processedLine.slice(lastIndex, rep.start);
        // Render child HTML inline wrapped in span or details
        const childHTML = await renderFromGraphHTML(graph, rep.name, values, depth + 1);
        const childTitle = (graph.get(rep.name)?.obj?.name) || rep.name;
        if (requiredSet.has(rep.name)){
          result += `<span class="include-inline">${childHTML}</span>`;
          inserted.add(rep.name);
        } else if (optionalSet.has(rep.name)){
          result += `<details class="proto-inline-optional"><summary>More detail: ${escapeHtml(childTitle)}</summary>${childHTML}</details>`;
          inserted.add(rep.name);
        } else {
          result += `<span class="include-inline">${childHTML}</span>`;
          inserted.add(rep.name);
        }
        lastIndex = rep.end;
      }
      // Append remaining text after last include
      result += processedLine.slice(lastIndex);
      processedLine = result;
    }
    buffer.push(processedLine);
  }

  // Append any unreferenced includes at the end
  for (const name of includeSet){
    if (inserted.has(name)) continue;
    const childHTML = await renderFromGraphHTML(graph, name, values, depth + 1);
    const childTitle = (graph.get(name)?.obj?.name) || name;
    flushBuffer();
    if (requiredSet.has(name)){
      chunks.push(childHTML);
    } else if (optionalSet.has(name)){
      chunks.push(`<details class="proto-optional"><summary>Additional detail: ${escapeHtml(childTitle)}</summary>\n${childHTML}\n</details>`);
    }
  }

  flushBuffer();

  const bodyHTML = chunks.join('\n');
  const level = Math.min(2 + depth, 6); // h2 for root, h3 for children, etc.
  const title = node.obj.name ? `<h${level}>${escapeHtml(node.obj.name)}</h${level}>` : '';
  const desc  = node.obj.description ? `<p><em>${escapeHtml(node.obj.description)}</em></p>` : '';

  const styleOnce = depth === 0 ? `
<style>
  details.proto-optional, details.proto-inline-optional { margin: 0.5rem 0; }
  details.proto-optional > summary, details.proto-inline-optional > summary { cursor: pointer; font-weight: 600; }
  .include-inline { display: inline-block; }
</style>
` : '';

  return `${styleOnce}${title}\n${desc}\n${bodyHTML}`.trim();
}

function formatInline(s){
  // Escape HTML first to stay safe, then do lightweight Markdown-style inline formatting
  let out = escapeHtml(String(s || ''));
  // Inline code
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Bold (**text**)
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic (_text_ or *text*)
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  out = out.replace(/(^|[^_])_([^_\n]+)_/g, '$1<em>$2</em>');
  return out;
}

function textToHTMLBlocks(text){
  const lines = String(text || '').split(/\n/);
  const blocks = [];
  let i = 0;
  while (i < lines.length){
    // collect ordered list if present
    if (/^\s*\d+\.\s+/.test(lines[i])){
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])){
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      blocks.push(`<ol>` + items.map(s=>`<li>${formatInline(s)}</li>`).join('') + `</ol>`);
      continue;
    }
    // collect unordered list (- or * bullets)
    if (/^\s*[-*]\s+/.test(lines[i])){
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])){
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      blocks.push(`<ul>` + items.map(s=>`<li>${formatInline(s)}</li>`).join('') + `</ul>`);
      continue;
    }
    // collect paragraph
    const para = [];
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^\s*\d+\.\s+/.test(lines[i]) && !/^\s*[-*]\s+/.test(lines[i])){
      para.push(lines[i]);
      i++;
    }
    if (para.length){
      blocks.push(`<p>${formatInline(para.join(' '))}</p>`);
    }
    // skip blank lines
    while (i < lines.length && /^\s*$/.test(lines[i])) i++;
  }
  return blocks.join('\n');
}

function escapeHtml(s){
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function loadInputs(rootId){
  const { graph } = await buildGraph(rootId, {}); // discover with defaults
  return mergeInputs(graph);
}

async function runProtocol(rootId, rawValues){
  const values = normalizeValues(rawValues || {});
  const { graph, values: mergedValues } = await buildGraph(rootId, values);
  const root = graph.get(rootId);
  if (!root || !root.obj || typeof root.obj !== 'object') throw new Error('Protocol factory did not return an object');

  const text = await renderFromGraphText(graph, rootId, mergedValues);
  const html = await renderFromGraphHTML(graph, rootId, mergedValues, 0);
  const { obj } = root; // preserve root metadata
  return { ...obj, text, html };
}

window.Protocols = { loadInputs, runProtocol };