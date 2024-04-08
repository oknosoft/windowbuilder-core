import paper from 'paper/dist/paper-core';
import {DimensionLine} from './DimensionLine';

export class LayerGroup extends paper.Group {
  saveCoordinates(short, save, close) {
    for (let elm of this.children) {
      elm.saveCoordinates?.(short, save, close);
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

  byContour(ihor, ivert, forse, bySide) {
    const {project, layer} = this;
    const {bounds} = layer;
    const {base_offset, dop_offset} = consts;

    if(project.contours.length > 1 || forse) {

      if(layer.isPos('left') && !layer.isPos('right') && project.bounds.height !== bounds.height) {
        if(!this.ihor.hasSize(bounds.height)) {
          if(!this.left) {
            this.left = new DimensionLine({
              pos: 'left',
              parent: this,
              offset: base_offset + (ihor.length > 2 ? dop_offset : 0),
              contour: true
            });
          }
          else {
            this.left.offset = base_offset + (ihor.length > 2 ? dop_offset : 0);
          }
        }
      }
      else {
        if(this.left) {
          this.left.remove();
          this.left = null;
        }
      }

      if(layer.isPos('right') && (project.bounds.height !== bounds.height || forse)) {
        if(!this.ihor.hasSize(bounds.height)) {
          if(!this.right) {
            this.right = new DimensionLine({
              pos: 'right',
              parent: this,
              offset: ihor.length > 2 ? -dop_offset * 2 : -dop_offset,
              contour: true
            });
          }
          else {
            this.right.offset = ihor.length > 2 ? -dop_offset * 2 : -dop_offset;
          }
        }
      }
      else {
        if(this.right) {
          this.right.remove();
          this.right = null;
        }
      }

      if(layer.isPos('top') && !layer.isPos('bottom') && project.bounds.width !== bounds.width) {
        if(!this.ivert.hasSize(bounds.width)) {
          if(!this.top) {
            this.top = new DimensionLine({
              pos: 'top',
              parent: this,
              offset: base_offset + (ivert.length > 2 ? dop_offset : 0),
              contour: true
            });
          }
          else {
            this.top.offset = base_offset + (ivert.length > 2 ? dop_offset : 0);
          }
        }
      }
      else {
        if(this.top) {
          this.top.remove();
          this.top = null;
        }
      }

      if(layer.isPos('bottom') && (project.bounds.width !== bounds.width || forse)) {
        if(!this.ivert.hasSize(bounds.width)) {
          if(!this.bottom) {
            this.bottom = new DimensionLine({
              pos: 'bottom',
              parent: this,
              offset: ivert.length > 2 ? -dop_offset * 2 : -dop_offset,
              contour: true
            });
          }
          else {
            this.bottom.offset = ivert.length > 2 ? -dop_offset * 2 : -dop_offset;
          }
        }
      }
      else {
        if(this.bottom) {
          this.bottom.remove();
          this.bottom = null;
        }
      }
    }

    // if(forse === 'faltz') {
    //   this.by_faltz(ihor, ivert, by_side);
    // }
  }

  imposts() {

    const {layer} = this;
    const {bounds} = layer;

    const bySide = layer.profilesBySide();
    if(!Object.keys(bySide).length) {
      return {ihor: [], ivert: [], bySide: {}};
    }

    // сначала, строим размерные линии импостов
    // получаем все профили контура, делим их на вертикальные и горизонтальные
    const ihor = [
      {
        point: bounds.top.round(),
        elm: bySide.top,
        p: bySide.top.b.y < bySide.top.e.y ? 'b' : 'e'
      },
      {
        point: bounds.bottom.round(),
        elm: bySide.bottom,
        p: bySide.bottom.b.y > bySide.bottom.e.y ? 'b' : 'e'
      }];
    const ivert = [
      {
        point: bounds.left.round(),
        elm: bySide.left,
        p: bySide.left.b.x < bySide.left.e.x ? 'b' : 'e'
      },
      {
        point: bounds.right.round(),
        elm: bySide.right,
        p: bySide.right.b.x > bySide.right.e.x ? 'b' : 'e'
      }];

    return {ihor, ivert, bySide};
  }

  /**
   * @summary Стирает размерные линии
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

  /**
   * @summary Формирует авторазмерные линии
   * @param {Boolean} [forse]
   */
  redraw(forse) {
    const {layer, project: {props}} = this;

    if(!forse) {
      forse = layer.showDimensions;
    }

    if(!forse) {
      this.clear(true);
    }
    else if(forse || !props.autoLines) {
      this.clear();
    }

    // сначала, перерисовываем размерные линии вложенных контуров, чтобы получить отступы
    for (const contour of layer.contours) {
      contour.dimensions.redraw();
    }

    // для внешних контуров строим авторазмерные линии
    if(props.autoLines && forse) {

      // далее - размерные линии контура
      this.byContour([], [], forse, bySide);
    }
  }
}
