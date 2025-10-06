/**
 * map.js — SVG renderer for the Lab Map
 *
 * Responsibilities:
 *  - Build the SVG floor plan from room geometry (data.room.viewBox and data.room.zones)
 *  - Draw each zone (bench/cubby/open/appliance area) as an SVG <rect>
 *  - Add readable labels directly on the map (rotated for tall/vertical benches)
 *  - Wire up basic interactivity: hover and click emit events via the bus
 *  - Expose helpers to highlight/focus zones
 *
 * Visual styling is handled in CSS (lab_map.css). This file assigns semantic
 * classes only (e.g., .zone, .zone-label, .map-outline).
 */

import { emit } from './bus.js';

let LAST_ROOT = null;

function prettyLabel(z){
  if (z.label) return z.label;
  return String(z.slug || '')
    .replace(/_/g,' ')
    .replace(/-/g,' ')
    .replace(/\b([a-z])/g, (m, c) => c.toUpperCase());
}

export function renderMap(root, data){
  LAST_ROOT = root;
  const room = data.room || { viewBox:[0,0,1200,800], zones:[] };
  const [minx,miny,w,h] = room.viewBox;

  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox', `${minx} ${miny} ${w} ${h}`);
  svg.setAttribute('role','img');
  svg.setAttribute('aria-label','Lab floor plan');
  svg.setAttribute('preserveAspectRatio','xMidYMin meet');

  root.innerHTML = '';
  root.appendChild(svg);

  // map boundary box (styled via CSS)
  const outline = document.createElementNS('http://www.w3.org/2000/svg','rect');
  outline.setAttribute('x', minx);
  outline.setAttribute('y', miny);
  outline.setAttribute('width', w);
  outline.setAttribute('height', h);
  outline.setAttribute('class', 'map-outline');
  svg.appendChild(outline);

  // layers: zones below, equipment above
  const zonesLayer = document.createElementNS('http://www.w3.org/2000/svg','g');
  zonesLayer.setAttribute('class','zones-layer');
  svg.appendChild(zonesLayer);

  const equipmentLayer = document.createElementNS('http://www.w3.org/2000/svg','g');
  equipmentLayer.setAttribute('class','equipment-layer');
  svg.appendChild(equipmentLayer);

  const rects = new Map();

  // Draw zones with labels
  (room.zones||[]).forEach(z => {
    const typeClass = z.type ? String(z.type) : 'open_area';
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class', `zone-group ${typeClass}`);

    const r = document.createElementNS('http://www.w3.org/2000/svg','rect');
    r.setAttribute('x', z.x); r.setAttribute('y', z.y);
    r.setAttribute('width', z.w); r.setAttribute('height', z.h);
    r.setAttribute('class', `zone ${typeClass}`);
    r.dataset.slug = z.slug;
    r.setAttribute('role','button');
    r.setAttribute('tabindex','0');
    r.setAttribute('aria-label', prettyLabel(z));
    r.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); emit('select:zone', z.slug); }
    });

    r.addEventListener('click', () => emit('select:zone', z.slug));
    r.addEventListener('mouseenter', () => emit('hover:zone', z.slug));

    g.appendChild(r);

    // Label
    const t = document.createElementNS('http://www.w3.org/2000/svg','text');
    const cx = z.x + z.w/2, cy = z.y + z.h/2;
    const isVertical = (z.h > z.w * 1.25);
    t.setAttribute('x', cx);
    t.setAttribute('y', cy);
    t.setAttribute('text-anchor','middle');
    t.setAttribute('dominant-baseline','middle');
    t.setAttribute('class','zone-label');
    // font-size in viewBox units, scaled to the smaller dimension
    if (isVertical) t.setAttribute('transform', `rotate(-90 ${cx} ${cy})`);
    t.textContent = prettyLabel(z);
    g.appendChild(t);

    zonesLayer.appendChild(g);
    rects.set(z.slug, r);
  });

  // Draw equipment markers, if provided
  if (Array.isArray(data.equipment) && data.equipment.length) {
    drawEquipment(equipmentLayer, room.zones || [], data.equipment);
  }

  root.__rects = rects;
}

function drawEquipment(container, zones, equipment){
  const Z = Object.fromEntries((zones||[]).map(z => [z.slug, z]));
  (equipment||[]).forEach(e => {
    // Span handling (e.g., fume hood) can be added later; for now place by host zone
    const z = Z[e.zone];
    if (!z) return;
    const [cx, cy] = anchorPoint(z, e.anchor || 'center');

    let x = cx, y = cy;
    const isFloor = (e.anchor||'').startsWith('floor');
    if (!isFloor) {
      const pad = Math.min(z.w, z.h) * 0.1;
      const minX = z.x + pad, maxX = z.x + z.w - pad;
      const minY = z.y + pad, maxY = z.y + z.h - pad;
      x = Math.min(maxX, Math.max(minX, x));
      y = Math.min(maxY, Math.max(minY, y));
    }

    // Optional per-item dx/dy offset from data
    if (e.offset && typeof e.offset.dx === 'number') x += e.offset.dx;
    if (e.offset && typeof e.offset.dy === 'number') y += e.offset.dy;

    const icon = document.createElementNS('http://www.w3.org/2000/svg','circle');
    icon.setAttribute('cx', x);
    icon.setAttribute('cy', y);
    icon.setAttribute('r', 0.12);
    icon.setAttribute('class', `equipment ${e.type||'device'}`);
    icon.setAttribute('role','button');
    icon.setAttribute('tabindex','0');
    icon.setAttribute('aria-label', e.name || e.id || 'equipment');
    icon.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); emit('select:equipment', e); }
    });

    const title = document.createElementNS('http://www.w3.org/2000/svg','title');
    title.textContent = e.name || e.id || 'equipment';
    icon.appendChild(title);

    icon.addEventListener('click', () => emit('select:equipment', e));
    icon.addEventListener('mouseenter', () => emit('hover:zone', e.zone));

    container.appendChild(icon);

    if (e.name) {
      const label = document.createElementNS('http://www.w3.org/2000/svg','text');
      label.setAttribute('x', x);
      label.setAttribute('y', y - 0.22);
      label.setAttribute('class','equipment-label');
      label.setAttribute('text-anchor','middle');
      label.setAttribute('dominant-baseline','ideographic');
      label.textContent = e.name;
      label.addEventListener('click', () => emit('select:equipment', e));
      container.appendChild(label);
    }
  });
}

function anchorPoint(z, where){
  switch(where){
    case 'top': return [z.x + z.w/2, z.y + z.h*0.22];
    case 'bottom': return [z.x + z.w/2, z.y + z.h*0.78];
    case 'left': return [z.x + z.w*0.22, z.y + z.h/2];
    case 'right': return [z.x + z.w*0.78, z.y + z.h/2];
    case 'top-left': return [z.x + z.w*0.25, z.y + z.h*0.25];
    case 'top-right': return [z.x + z.w*0.75, z.y + z.h*0.25];
    case 'floor-left': return [z.x - Math.min(0.4, z.w*0.35), z.y + z.h + Math.min(0.4, z.h*0.35)];
    case 'floor-right': return [z.x + z.w + Math.min(0.4, z.w*0.35), z.y + z.h + Math.min(0.4, z.h*0.35)];
    default: return [z.x + z.w/2, z.y + z.h/2];
  }
}

export function highlightKeys(root, keys){
  const rects = root.__rects || new Map();
  Array.from(rects.values()).forEach(r => r.classList.remove('highlight'));
  (keys||[]).forEach(k => {
    const zone = (k.split(':')[0] || '');
    const r = rects.get(zone);
    if (r) r.classList.add('highlight');
  });
}

export function focusZone(root, slug){
  const rect = (root.__rects || new Map()).get(slug);
  if (rect) { rect.classList.add('active'); }
}

// Respond to global search results and highlight benches accordingly
window.addEventListener('lab:search-results', (e) => {
  const keys = (e.detail && e.detail.keys) || [];
  if (LAST_ROOT) highlightKeys(LAST_ROOT, keys);
});
