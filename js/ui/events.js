import { updateTileColours } from '../tiles/renderTiles.js';
import { state } from '../utils/state.js';

export function setupEvents(map, state, hexagons) {
  document.addEventListener('input', e => {
    if (e.target.id === 'opacity-slider') {
      const newOpacity = parseFloat(e.target.value);
      document.getElementById('opacity-value').textContent = Math.round(newOpacity * 100); 
      hexagons.forEach(hex => hex.setStyle({ fillOpacity: newOpacity }));
    }

    if (e.target.id === 'threshold-slider') {
      state.confidenceThreshold = parseFloat(e.target.value);
      document.getElementById('threshold-value').textContent = `${state.confidenceThreshold}%`;
      updateTileColours(map, state, hexagons);
    }
  });

  document.querySelectorAll('input[name="mineral"]').forEach(input => {
    input.addEventListener('change', e => {
      state.currentMineral = e.target.value;
      updateTileColours(map, state, hexagons);
    });
  });
}
