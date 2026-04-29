# Lab Finder

Find anything in the lab — equipment, reagents, training materials, and more.

<div id="finder-app">
  <div class="finder-search-bar">
    <input
      id="finder-search"
      type="search"
      list="finder-list"
      placeholder="Search by name, synonym, or category…"
      autocomplete="off"
      aria-label="Search lab items"
    />
    <datalist id="finder-list"></datalist>
  </div>

  <div id="finder-results-panel" hidden></div>

  <div id="finder-detail-panel" hidden>
    <div class="finder-item-header">
      <span class="finder-item-name"></span>
      <span class="finder-category-badge"></span>
    </div>
    <div class="finder-locations"></div>
  </div>
</div>

<link rel="stylesheet" href="../css/lab_finder.css" />

<script type="module">
import { loadItems } from '../js/data.js';
import { initSearch } from '../js/search.js';
import { initDetails } from '../js/details.js';

const LOCATIONS_URL = '../../../assets/data/locations.tsv';
const IMG_BASE      = '../../../images/lab_finder/';

(async () => {
  const data = await loadItems(LOCATIONS_URL);
  data.imgBase = IMG_BASE;
  initDetails(data);
  initSearch(data);
})();
</script>
