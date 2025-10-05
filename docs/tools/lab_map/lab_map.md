# Lab Map

<link rel="stylesheet" href="../css/lab_map.css">

<div id="lab-app">
  <div class="topbar">
    <input id="search-box" list="item-list" type="text" placeholder="Search or pick an item…" />
    <datalist id="item-list"></datalist>
    <div id="filters"></div>
    <div id="legend"></div>
  </div>

  <div class="body">

    <main class="canvas">
      <div id="map-root"
           data-room-src="../../../assets/data/room.json"
           data-benches-src="../../../assets/data/benches.json"
           data-consumables-src="../../../assets/data/consumables.tsv"
           data-equipment-src="../../../assets/data/equipment.json"
           data-trainings-src="../../../assets/data/trainings.json"></div>
    </main>

    <aside class="right-rail">
      <div id="details"></div>
    </aside>
  </div>

  <div class="bottom-tray" id="results-tray" hidden></div>
</div>

<script type="module">
  import * as Bus from '../js/bus.js';
  import { loadAll } from '../js/data.js';
  import { renderMap } from '../js/map.js';
  import { wireUI } from '../js/ui.js';
  import { initSearch } from '../js/search.js';
  import '../js/highlight.js';

  (async () => {
    const root = document.getElementById('map-root');
    const paths = {
      room: root.dataset.roomSrc,
      benches: root.dataset.benchesSrc,
      consumables: root.dataset.consumablesSrc,
      equipment: root.dataset.equipmentSrc,
      trainings: root.dataset.trainingsSrc
    };
    const data = await loadAll(paths);
    renderMap(root, data);
    wireUI(data);
    initSearch(data);
    Bus.emit('ready', data);
  })();
</script>
