import { renderTiles } from './renderTiles.js';

export function loadAndRenderCSV(map, state, hexagons) {
  fetch("../data/inference_sample.csv")
    .then(res => res.text())
    .then(csvText => {
      const parsed = Papa.parse(csvText, { header: true }).data;
      renderTiles(map, parsed, state, hexagons);
    })
    .catch(err => console.error("CSV load error:", err));
}