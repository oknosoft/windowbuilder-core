
export function load21(raw) {
  const {props, _scope: {Path}, rootLayer} = this;
  props.loading = true;
  props.sys = raw.sys;
  this.clear();
  for(const row of raw.constructions.filter((row) => !row.parent)) {
    if(this.workLayer.hasOwnProperty('cnstr')) {
      this.addLayer(row).activate();
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

const elm_types = ['Рама', 'Створка', 'Импост', 'Соединитель', 'Линия', 'Сечение'];

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
  const {elmTypes} = layer.project.root.enm;
  const profiles = [];
  const container = crow.parent ? layer.container : null;
  const pathInner = container ? container.pathInner : null;
  const pmap = new Map();
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
    let profile;
    if(crow.parent && crow.ribs) {
      if(row.elm_type === 'Створка') {
        // находим ближайшее ребро
        let rib = crow.ribs.get(row);
        if(rib) {
          profile = layer.createProfile({...rib, inset: row.inset, cnns});
        }
      }
    }
    else {
      profile = layer.createProfile({
        b: [row.x1, row.y1],
        e: [row.x2, row.y2],
        pathData: row.path_data,
        inset: row.inset,
        cnns,
        elmType: elmTypes.get(row.elm_type),
      });
    }
    profiles.push(profile);
    pmap.set(profile, row);
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
      /*
      0 - обычный слой
      1 - виртуальный
      2 - вложенное изделие
      3 - слой родительского изделия
      4 - разрыв заполнения
      5 - слой ряда
      6 - слой проёма
      10 - вирт. изделие к слою
      11 - вирт. изделие к изделию
      */
      const kind = [1, 2].includes(row.kind) ? 'virtual' : 'flap';
      const flap = container.child.createChild({kind, skipProfiles: true});
      flap.cnstr = row.cnstr;
      row.ribs = container.ribs;
      if(row.dop?.sys) {
        flap.sys = row.dop.sys;
      }
      loadLayer(flap, raw, row, Path);
    }
  }
  // свойства 3d
  const three = crow.dop?.three; 
  if(three) {
    const parent = layer.project.contours.find(l => l.cnstr === three.parent);
    if(parent) {
      layer.three.parent = parent;
      layer.three.bind = three.bind;
      const {bind} = layer.three;
      if(three.rotation) {
        const fld = (bind.is('top') || bind.is('bottom')) ? 'x' : 'y';
        layer.three.degree[fld] = three.rotation; 
      }
      // возможно, есть профиль имитации
      for(const profile of profiles) {
        const row = pmap.get(profile);
        if(row.dop?.imitationOf) {
          profile.raw('imitationOf', parent.profilesBySide()[bind.valueOf()]);
        }
      }
    }
  }
}
