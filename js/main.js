import { setupMap } from './mapSetup.js';
import { setupControls } from './ui/controls.js';
import { setupEvents } from './ui/events.js';
import { loadAndRenderCSV } from './tiles/loadCSV.js';
import { state } from './utils/state.js';

document.addEventListener("DOMContentLoaded", () => {
  const map = setupMap();
  const hexagons = [];
  
  setupControls(map, state);
  setupEvents(map, state, hexagons);
  loadAndRenderCSV(map, state, hexagons);
});