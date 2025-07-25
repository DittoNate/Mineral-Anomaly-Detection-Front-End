export function interpolateColour(score, min, max) {
  if (max === min) return `rgb(255,255,255)`;
  const scaled = (score - min) / (max - min);
  const grey = Math.round(scaled * 255);
  return `rgb(${grey}, ${grey}, ${grey})`;
}

export function updateLegendDot(score, state) {
  const min = state.currentMineral === 'AU_CONF' ? state.minAU : state.minCU;
  const max = state.currentMineral === 'AU_CONF' ? state.maxAU : state.maxCU;
  const percent = ((score - min) / (max - min)) * 100;
  const dot = document.getElementById('legend-dot');
  if (dot && !isNaN(percent)) {
    dot.style.left = `${Math.max(0, Math.min(100, percent))}%`;
    dot.style.display = 'block';
  }
}
