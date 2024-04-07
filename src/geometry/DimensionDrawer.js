import paper from 'paper/dist/paper-core';

export class LayerGroup extends paper.Group {
  save_coordinates(short, save, close) {
    for (let elm of this.children) {
      elm.save_coordinates?.(short, save, close);
    }
  }
}

class DimensionGroup {

  clear() {
    for (let key in this) {
      this[key].removeChildren();
      this[key].remove();
      delete this[key];
    }
  }

  hasSize(size) {
    for (let key in this) {
      const {path} = this[key];
      if(path && Math.abs(path.length - size) < 1) {
        return true;
      }
    }
  }

  sizes() {
    const res = [];
    for (let key in this) {
      if(this[key].visible) {
        res.push(this[key]);
      }
    }
    return res;
  }

}

export class DimensionDrawer extends LayerGroup {

  constructor(attr) {
    super(attr);
    this.ihor = new DimensionGroup();
    this.ivert = new DimensionGroup();
  }

  /**
   * Стирает размерные линии
   */
  clear(local) {

    this.ihor?.clear();
    this.ivert?.clear();

    for (const pos of ['bottom', 'top', 'right', 'left']) {
      if(this[pos]) {
        this[pos].removeChildren();
        this[pos].remove();
        this[pos] = null;
      }
    }

    if(!local) {
      this.layer?.layer?.children?.dimensions?.clear();
    }
  }
}
