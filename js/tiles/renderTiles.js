import { interpolateColour, updateLegendDot } from '../utils/colours.js';

export function renderTiles(map, data, state, hexagons) {
  const hexData = {};

  data.forEach(row => {
    const lat = parseFloat(row.LAT);
    const lon = parseFloat(row.LON);
    const au = parseFloat(row.AU_CONF);
    const cu = parseFloat(row.CU_CONF);
    if (isNaN(lat) || isNaN(lon)) return;

    if (!isNaN(au)) {
      state.minAU = Math.min(state.minAU, au);
      state.maxAU = Math.max(state.maxAU, au);
    }
    if (!isNaN(cu)) {
      state.minCU = Math.min(state.minCU, cu);
      state.maxCU = Math.max(state.maxCU, cu);
    }

    const h3Index = h3.latLngToCell(lat, lon, 5);
    if (!hexData[h3Index]) {
      hexData[h3Index] = { AU_CONF: 0, CU_CONF: 0, points: [] };
    }

    hexData[h3Index].AU_CONF = Math.max(hexData[h3Index].AU_CONF, au);
    hexData[h3Index].CU_CONF = Math.max(hexData[h3Index].CU_CONF, cu);
    hexData[h3Index].points.push({ lat, lon });
  });

  Object.entries(hexData).forEach(([h3Index, props]) => {
    const boundary = h3.cellToBoundary(h3Index, true).map(([lng, lat]) => [lat, lng]);
    const center = h3.cellToLatLng(h3Index);
    const min = state.currentMineral === 'AU_CONF' ? state.minAU : state.minCU;
    const max = state.currentMineral === 'AU_CONF' ? state.maxAU : state.maxCU;

    const hex = L.polygon(boundary, {
      color: '#444',
      fillColor: interpolateColour(props[state.currentMineral], min, max),
      fillOpacity: 0.6,
      weight: 1
    }).addTo(map);

    hex.featureProps = props;
    hexagons.push(hex);

    hex.on('click', () => {
      state.confidenceBox.update(props);
      state.anomalyInfo.update(props, { lat: center[0], lng: center[1] });
      updateLegendDot(props[state.currentMineral], state);

      if (state.selectedHex) {
        state.selectedHex.setStyle({ weight: 1, color: '#444' });
      }
      hex.setStyle({ weight: 3, color: '#ff7319' });
      state.selectedHex = hex;
    });

    hex.on('mouseover', () => {
      hex.setStyle({ weight: 2, color: '#ff6600', fillOpacity: 0.8 });
    });

    hex.on('mouseout', () => {
      hex.setStyle({
        weight: state.selectedHex === hex ? 3 : 1,
        color: state.selectedHex === hex ? '#ff7319' : '#444',
        fillOpacity: parseFloat(document.getElementById('opacity-slider').value || 0.6)
      });
    });
  });

  updateTileColours(map, state, hexagons);
}

export function updateTileColours(map, state, hexagons) {
  const thresholdDecimal = state.confidenceThreshold / 100;

  hexagons.forEach(hex => {
    const props = hex.featureProps;
    const score = props[state.currentMineral];

    const min = state.currentMineral === 'AU_CONF' ? state.minAU : state.minCU;
    const max = state.currentMineral === 'AU_CONF' ? state.maxAU : state.maxCU;

    const isVisible = typeof score === 'number' && score >= thresholdDecimal;

    hex.setStyle({
      fillColor: interpolateColour(score, min, max)
    });

    if (isVisible && !map.hasLayer(hex)) map.addLayer(hex);
    else if (!isVisible && map.hasLayer(hex)) map.removeLayer(hex);
  });
}
