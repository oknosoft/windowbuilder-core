
import paper from 'paper/dist/paper-core';
import {BuilderProps} from './BuilderProps';
import {Contour} from './Contour';

export class Scheme extends paper.Project {
  
  constructor(attr, root) {
    super(attr);
    Object.defineProperty(this, 'props', {value: new BuilderProps(this)});
    if(root) {
      Object.defineProperty(this, 'root', {value: root});
    }
  }

  get activeLayer() {
    return this._activeLayer || new Contour({project: this, insert: true});
  }

  get strokeBounds() {
    return this.layers.reduce((sum, curr) => sum.unite(curr.strokeBounds), new paper.Rectangle);
  }

  /**
   * @summary Вписывает канвас в указанные размеры
   * @desc Используется при создании проекта и при изменении размеров области редактирования
   *
   * @param w {Number} - ширина, в которую будет вписан канвас
   * @param h {Number} - высота, в которую будет вписан канвас
   */
  resizeCanvas(w, h) {
    const {viewSize} = this.view;
    viewSize.width = w;
    viewSize.height = h;
  }

  /**
   * @summary Вписывает изделие в размеры канваса
   */
  zoomFit(bounds) {
    if(!bounds) {
      bounds = this.strokeBounds;
    }
    const space = 180;
    const min = 900;
    let {width, height, center} = bounds;
    if (width < min) {
      width = min;
    }
    if (height < min) {
      height = min;
    }
    width += space;
    height += space;
    const {view} = this;
    const zoom = (Math.min(view.viewSize.height / height, view.viewSize.width / width)) * 0.9;
    const {scaling} = view._decompose();
    view.scaling = [Math.sign(scaling.x) * zoom, Math.sign(scaling.y) * zoom];

    const dx = view.viewSize.width - width * zoom;
    const dy = view.viewSize.height - height * zoom * 1.2;
    view.center = center.add([Math.sign(scaling.x) * dx, -Math.sign(scaling.y) * dy]);
  }

  /**
   * @summary Перерисовывает все слои изделия
   */
  redraw() {
    for(const item of this.children) {
      item.redraw?.();
    }
  }
  
}
