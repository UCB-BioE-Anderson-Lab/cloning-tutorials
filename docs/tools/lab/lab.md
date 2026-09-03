# Lab

<link rel="stylesheet" href="../css/lab.css">

<div id="lab-app">

  <div class="lab-search-bar">
    <input id="lab-search"
           list="lab-list"
           type="text"
           placeholder="Search anything — reagent, chemical, equipment, CAS number…"
           autocomplete="off">
    <datalist id="lab-list"></datalist>
  </div>

  <div class="lab-map-pane">
    <div id="map-root"
         data-room-src="../../../assets/data/room.json"
         data-benches-src="../../../assets/data/benches.json"
         data-equipment-src="../../../assets/data/equipment.json"
         data-storage-src="../../../assets/data/storage.json"
         data-locations-src="../../../assets/data/locations.tsv"
         data-chemicals-src="../../../assets/data/chemicals.tsv"
         data-consumables-src="../../../assets/data/consumables.tsv"
         data-img-base="../../../images/lab_finder/"></div>
  </div>

  <div id="lab-results-panel" hidden></div>
  <div id="lab-detail-panel" hidden></div>

</div>

<script type="module">
  import { emit } from '../js/bus.js';
  import { loadAll } from '../js/data.js';
  import { renderMap } from '../js/map.js';
  import { initSearch } from '../js/search.js';
  import { initDetails } from '../js/details.js';
  import '../js/highlight.js';

  (async () => {
    const root = document.getElementById('map-root');
    const d = root.dataset;

    const paths = {
      room:        d.roomSrc,
      benches:     d.benchesSrc,
      equipment:   d.equipmentSrc,
      storage:     d.storageSrc,
      locations:   d.locationsSrc,
      chemicals:   d.chemicalsSrc,
      consumables: d.consumablesSrc,
      imgBase:     d.imgBase
    };

    const data = await loadAll(paths);
    renderMap(root, data);
    initSearch(data);
    initDetails(data);
    emit('ready', data);
  })();
</script>
