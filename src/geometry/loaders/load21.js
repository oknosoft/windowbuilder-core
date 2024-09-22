
export function load21(raw) {
  const {props, _scope: {Path}, rootLayer} = this;
  props.loading = true;
  props.sys = raw.sys;
  this.clear();
  for(const row of raw.constructions.filter((row) => !row.parent)) {
    if(this.activeLayer.hasOwnProperty('cnstr')) {
      this.addLayer().activate();
    }
    this.activeLayer.cnstr = row.cnstr;
    loadLayer(this.activeLayer, raw, row, Path);
  }
  loadLayer(rootLayer, raw, {cnstr: 0}, Path);
  props.loading = false;
  props.registerChange();
  this.redraw();
  this.zoomFit();
}

const elm_types = ['Рама', 'Створка', 'Импост', 'Соединитель'];

function findRibs(child, raw, crow, Path) {
  const {pathInner} = child;
  const map = new Map();
  for(const row of raw.coordinates.filter((row) => row.cnstr === crow.cnstr && row.elm_type === 'Створка')) {
    // находим ближайшее ребро
    let rib;
    const tmp = new Path({insert: false, pathData: row.path_data});
    for(let i = 0; i < pathInner.length; i++) {
      const b = pathInner[i];
      const e = pathInner[i === pathInner.length - 1 ? 0 : i + 1];
      if(tmp.firstSegment.point.isNearest(b, 30000) && tmp.lastSegment.point.isNearest(e, 30000)) {
        rib = {b, e, edge: b.edge};
        break;
      }
    }
    if(!rib) {
      return;
    }
    map.set(row, rib);
  }
  return map;
}

function findContainer(layer, raw, crow, Path) {
  for(const id in layer.containers.children) {
    const child = layer.containers.children[id];
    if(child.kind !== 'flap') {
      const ribs = findRibs(child, raw, crow, Path);
      if(ribs) {
        return {child, ribs};
      }
    }
  }
}

function loadLayer(layer, raw, crow, Path) {
  const profiles = [];
  const container = crow.parent ? layer.container : null;
  const pathInner = container ? container.pathInner : null;
  for(const row of raw.coordinates.filter((row) => row.cnstr === crow.cnstr && elm_types.includes(row.elm_type))) {
    const cnns = {};
    for(const cnrow of raw.cnn_elmnts) {
      if(cnrow.elm1 === row.elm) {
        if(cnrow.node1 === 'b') {
          cnns.b = cnrow.cnn;
        }
        else if(cnrow.node1 === 'e') {
          cnns.e = cnrow.cnn;
        }
        if(cnns.b && cnns.e) {
          break;
        }
      }
    }
    if(crow.parent && crow.ribs) {
      if(row.elm_type === 'Створка') {
        // находим ближайшее ребро
        let rib = crow.ribs.get(row);
        if(rib) {
          profiles.push(layer.createProfile({...rib, inset: row.inset, cnns}));
        }
      }
    }
    else {
      profiles.push(layer.createProfile({
        b: [row.x1, row.y1],
        e: [row.x2, row.y2],
        pathData: row.path_data,
        inset: row.inset,
        cnns,
      }));
    }
  }
  layer.skeleton.addProfiles(profiles);
  for(const profile of profiles) {
    profile.redraw?.();
    if(profile.elmType.is('linking')) {
      profile.findNearests();
    }
  }
  layer.containers.sync();
  for(const row of raw.constructions.filter((row) => row.parent === crow.cnstr)) {
    const container = findContainer(layer, raw, row, Path);
    if(container) {
      const flap = container.child.createChild({kind: 'flap', skipProfiles: true});
      flap.cnstr = row.cnstr;
      row.ribs = container.ribs;
      loadLayer(flap, raw, row, Path);
    }
  }
}
