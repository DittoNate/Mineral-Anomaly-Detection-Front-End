export function setupControls(map, state) {
  const anomalyInfo = L.control({ position: 'topright' });
  anomalyInfo.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info anomaly-container');
    this.update();
    return this._div;
  };
  anomalyInfo.update = function (props, latlng) {
    this._div.innerHTML = props ? `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4>Anomaly Info</h4>
        <button id="more-btn" class="more-button-icon" aria-label="More options">
          <i class="fa-solid fa-ellipsis-h"></i>
        </button>
      </div>
      <b>Placeholder Name</b><br>
      <i>Address: Placeholder Address</i><br>
      <i><b>LAT:</b> ${latlng.lat.toFixed(5)} <b>LON:</b> ${latlng.lng.toFixed(5)}</i>
      <div id="more-options" class="more-options hidden">
        <button id="download-btn"><i class="fa-solid fa-download"></i> Download</button>
        <button id="share-btn"><i class="fa-solid fa-share-nodes"></i> Share</button>
      </div>` : "<h4>Click a tile to view info</h4>";

    setTimeout(() => {
      document.getElementById('more-btn')?.addEventListener('click', () => {
        document.getElementById('more-options').classList.toggle('hidden');
      });
    }, 0);
  };
  anomalyInfo.addTo(map);
  state.anomalyInfo = anomalyInfo;

  const confidenceBox = L.control({ position: 'bottomright' });
  confidenceBox.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info confidence-box');
    this._div.innerHTML = `
      <h4>Confidence Scores</h4>
      <div id="confidence-values">
        <label><input type="radio" name="mineral" value="AU_CONF" checked><strong>Gold:</strong> <span id="au-value">---</span>%</label><br>
        <label><input type="radio" name="mineral" value="CU_CONF"><strong>Copper:</strong> <span id="cu-value">---</span>%</label>
      </div><br>
      <label for="threshold-slider"><strong>Confidence Threshold</strong></label><br>
      <label><span id="threshold-value">0%</span></label>
      <input type="range" id="threshold-slider" min="0" max="100" step="1" value="0">
    `;
    return this._div;
  };
  confidenceBox.update = function (props) {
    document.getElementById('au-value').textContent = props ? (props.AU_CONF * 100).toFixed(1) : "---";
    document.getElementById('cu-value').textContent = props ? (props.CU_CONF * 100).toFixed(1) : "---";
  };
  confidenceBox.addTo(map);
  state.confidenceBox = confidenceBox;

  const legend = L.control({ position: 'bottomleft' });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info');
    div.innerHTML = `
      <label for="opacity-slider"><strong>Tile Opacity:</strong></label><br>
      <label><span id="opacity-value">60</span>%</label>
      <input type="range" id="opacity-slider" min="0" max="1" step="0.05" value="0.6"><br><br>
      <div class="legend-bar-container">
        <div class="legend-bar"></div>
        <div class="legend-dot" id="legend-dot"></div>
      </div>
      <div class="legend-labels">
        <span>LOW CONF</span><span>HIGH CONF</span>
      </div>`;
    return div;
  };
  legend.addTo(map);
}
