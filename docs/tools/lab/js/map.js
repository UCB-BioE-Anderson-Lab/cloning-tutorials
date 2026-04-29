/**
 * map.js — SVG floor plan renderer
 *
 * Renders:
 *  - Zone rectangles (bench / open_area / cubby) with labels
 *  - Storage unit icons within zones (colored squares by type, with title)
 *  - Major equipment markers (small circles)
 *
 * Emits on bus:
 *  - select:zone  (slug)
 *  - hover:zone   (slug)
 *  - select:equipment (equipment object)
 *
 * WCAG notes:
 *  - Every interactive element has role, tabindex, aria-label
 *  - Highlighted zones get aria-selected="true" (managed by highlight.js)
 *  - Focus ring uses outline, not just fill color change
 *  - Storage icons get <title> for screen-reader tooltip
 */

import { emit } from './bus.js';

// Storage type → fill color (WCAG 3:1 contrast against white bg)
const STORAGE_COLORS = {
  'freezer':            '#2563eb', // blue-600
  'freezer-80':         '#1e40af', // blue-800
  'fridge':             '#0d9488', // teal-600
  'chemical-flammable': '#d97706', // amber-600
  'chemical-corrosive': '#dc2626', // red-600
  'cabinet':            '#4b5563', // gray-600
  'open-shelves':       '#7c3aed', // violet-600
};

// Short type abbreviations for icons
const STORAGE_ABBR = {
  'freezer':            '−20',
  'freezer-80':         '−80',
  'fridge':             '4°C',
  'chemical-flammable': '🔥',
  'chemical-corrosive': '⚗',
  'cabinet':            '□',
  'open-shelves':       '≡',
};

function prettyLabel(z) {
  if (z.label) return z.label;
  return String(z.slug || '').replace(/[-_]/g, ' ')
    .replace(/\b([a-z])/g, (_, c) => c.toUpperCase());
}

// Build a lookup: zone slug → [storage units in that zone]
function buildStorageByZone(storageJSON) {
  const map = new Map();
  for (const unit of (storageJSON?.storage_units || [])) {
    if (!map.has(unit.zone)) map.set(unit.zone, []);
    map.get(unit.zone).push(unit);
  }
  return map;
}

export function renderMap(root, data) {
  const room = data.room || { viewBox: [0, 0, 12, 7.75], zones: [] };
  const [minx, miny, w, h] = room.viewBox;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `${minx} ${miny} ${w} ${h}`);
  svg.setAttribute('role', 'list');
  svg.setAttribute('aria-label', 'Lab floor plan');
  svg.setAttribute('preserveAspectRatio', 'xMidYMin meet');

  root.innerHTML = '';
  root.appendChild(svg);

  // Room boundary
  const outline = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  outline.setAttribute('x', minx); outline.setAttribute('y', miny);
  outline.setAttribute('width', w); outline.setAttribute('height', h);
  outline.setAttribute('class', 'map-outline');
  outline.setAttribute('aria-hidden', 'true');
  svg.appendChild(outline);

  const zonesLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  zonesLayer.setAttribute('class', 'zones-layer');
  svg.appendChild(zonesLayer);

  const storageLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  storageLayer.setAttribute('class', 'storage-layer');
  storageLayer.setAttribute('aria-hidden', 'true'); // decorative; zone click opens detail
  svg.appendChild(storageLayer);

  const equipmentLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  equipmentLayer.setAttribute('class', 'equipment-layer');
  svg.appendChild(equipmentLayer);

  const rects = new Map();
  const storageByZone = buildStorageByZone(data.storageJSON);

  // ── Zones ────────────────────────────────────────────────────────────────

  (room.zones || []).forEach(z => {
    const typeClass = z.type || 'open_area';
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', `zone-group ${typeClass}`);

    const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    r.setAttribute('x', z.x); r.setAttribute('y', z.y);
    r.setAttribute('width', z.w); r.setAttribute('height', z.h);
    r.setAttribute('class', `zone ${typeClass}`);
    r.dataset.slug = z.slug;
    r.setAttribute('role', 'listitem');
    r.setAttribute('tabindex', '0');
    r.setAttribute('aria-selected', 'false');

    // Build aria-label including any storage units
    const units = storageByZone.get(z.slug) || [];
    const unitNames = units.map(u => u.name).join(', ');
    r.setAttribute('aria-label',
      prettyLabel(z) + (unitNames ? `: ${unitNames}` : ''));

    r.addEventListener('click', () => emit('select:zone', z.slug));
    r.addEventListener('mouseenter', () => emit('hover:zone', z.slug));
    r.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault(); emit('select:zone', z.slug);
      }
    });

    g.appendChild(r);

    // Zone label — rotated for tall narrow zones
    const cx = z.x + z.w / 2, cy = z.y + z.h / 2;
    const isVertical = z.h > z.w * 1.5;

    // Push label toward top when storage icons will occupy bottom
    const labelY = units.length ? cy - z.h * 0.12 : cy;

    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', cx); t.setAttribute('y', labelY);
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('dominant-baseline', 'middle');
    t.setAttribute('class', 'zone-label');
    t.setAttribute('aria-hidden', 'true');
    if (isVertical) t.setAttribute('transform', `rotate(-90 ${cx} ${labelY})`);
    t.textContent = prettyLabel(z);
    g.appendChild(t);

    zonesLayer.appendChild(g);
    rects.set(z.slug, r);

    // Draw storage unit icons for this zone
    if (units.length) drawStorageIcons(storageLayer, z, units);
  });

  // ── Equipment markers ────────────────────────────────────────────────────

  if (Array.isArray(data.equipment) && data.equipment.length) {
    drawEquipment(equipmentLayer, room.zones || [], data.equipment);
  }

  root.__rects = rects;
}

// ── Storage icons ─────────────────────────────────────────────────────────────
// Draws small colored square indicators in the bottom portion of each zone.
// Sized to fit within even the narrowest zones (w=0.75).

function drawStorageIcons(layer, z, units) {
  const iconW = Math.min(0.28, (z.w - 0.06) / units.length);
  const iconH = 0.18;
  const gap   = 0.03;
  const totalW = units.length * iconW + (units.length - 1) * gap;
  const startX = z.x + (z.w - totalW) / 2;
  const iconY  = z.y + z.h - iconH - 0.04;

  units.forEach((unit, i) => {
    const x = startX + i * (iconW + gap);
    const color = STORAGE_COLORS[unit.type] || '#6b7280';

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', `storage-icon storage-${unit.type || 'unknown'}`);

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = unit.name + (unit.access !== 'student' ? ` (${unit.access}-only)` : '');
    g.appendChild(title);

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x); rect.setAttribute('y', iconY);
    rect.setAttribute('width', iconW); rect.setAttribute('height', iconH);
    rect.setAttribute('rx', 0.03);
    rect.setAttribute('fill', color);
    rect.setAttribute('opacity', unit.access !== 'student' ? '0.7' : '1');
    g.appendChild(rect);

    // Short label inside icon
    const abbr = STORAGE_ABBR[unit.type] || '?';
    const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    lbl.setAttribute('x', x + iconW / 2);
    lbl.setAttribute('y', iconY + iconH / 2);
    lbl.setAttribute('text-anchor', 'middle');
    lbl.setAttribute('dominant-baseline', 'middle');
    lbl.setAttribute('class', 'storage-icon-label');
    lbl.setAttribute('fill', '#fff');
    lbl.textContent = abbr;
    g.appendChild(lbl);

    layer.appendChild(g);
  });
}

// ── Equipment markers ─────────────────────────────────────────────────────────
// Small circles — radius 0.045 (was 0.12, which was too large)

function drawEquipment(container, zones, equipment) {
  const Z = Object.fromEntries((zones || []).map(z => [z.slug, z]));

  (equipment || []).forEach(e => {
    const z = Z[e.zone];
    if (!z) return;
    const [cx, cy] = anchorPoint(z, e.anchor || 'center');

    let x = cx, y = cy;
    if (!(e.anchor || '').startsWith('floor')) {
      const pad = 0.08;
      x = Math.min(z.x + z.w - pad, Math.max(z.x + pad, x));
      y = Math.min(z.y + z.h - pad, Math.max(z.y + pad, y));
    }
    if (e.offset) {
      if (typeof e.offset.dx === 'number') x += e.offset.dx;
      if (typeof e.offset.dy === 'number') y += e.offset.dy;
    }

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'equipment-group');
    g.setAttribute('role', 'listitem');
    g.setAttribute('tabindex', '0');
    g.setAttribute('aria-label', e.name || e.id || 'equipment');

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = e.name || e.id || 'equipment';
    g.appendChild(title);

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    icon.setAttribute('cx', x); icon.setAttribute('cy', y); icon.setAttribute('r', 0.045);
    icon.setAttribute('class', `equipment-dot ${e.type || 'device'}`);
    icon.setAttribute('aria-hidden', 'true');
    g.appendChild(icon);

    g.addEventListener('click', () => emit('select:equipment', e));
    g.addEventListener('mouseenter', () => emit('hover:zone', e.zone));
    g.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); emit('select:equipment', e); }
    });

    container.appendChild(g);
  });
}

function anchorPoint(z, where) {
  switch (where) {
    case 'top':         return [z.x + z.w / 2,    z.y + z.h * 0.25];
    case 'bottom':      return [z.x + z.w / 2,    z.y + z.h * 0.75];
    case 'left':        return [z.x + z.w * 0.25, z.y + z.h / 2];
    case 'right':       return [z.x + z.w * 0.75, z.y + z.h / 2];
    case 'top-left':    return [z.x + z.w * 0.25, z.y + z.h * 0.25];
    case 'top-right':   return [z.x + z.w * 0.75, z.y + z.h * 0.25];
    case 'floor-left':  return [z.x - 0.3, z.y + z.h + 0.3];
    case 'floor-right': return [z.x + z.w + 0.3, z.y + z.h + 0.3];
    default:            return [z.x + z.w / 2,    z.y + z.h / 2];
  }
}
