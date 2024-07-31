
export function load21(raw) {
  const {props} = this;
  props.loading = true;
  props.sys = raw.sys;
  this.clear();
  for(const row of raw.constructions.filter((row) => !row.parent)) {
    if(this.activeLayer.hasOwnProperty('cnstr')) {
      this.addLayer().activate();
    }
    this.activeLayer.cnstr = row.cnstr;
    loadLayer(this.activeLayer, raw, row);
  }
  props.loading = false;
  props.registerChange();
  this.redraw();
  this.zoomFit();
}

const elm_types = ['Рама', 'Створка', 'Импост'];

function loadLayer(layer, raw, crow) {
  const profiles = [];
  for(const row of raw.coordinates.filter((row) => row.cnstr === crow.cnstr && elm_types.includes(row.elm_type))) {
    profiles.push(layer.createProfile({
      b: [row.x1, row.y1],
      e: [row.x2, row.y2],
      pathData: row.path_data,
      inset: row.inset,
    }));
  }
  layer.skeleton.addProfiles(profiles);
  layer.containers.sync();
}
