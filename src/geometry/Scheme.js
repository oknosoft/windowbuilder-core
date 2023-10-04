
import paper from 'paper/dist/paper-core';
import {BuilderProps} from './BuilderProps';
import {Contour} from './Contour';

export class Scheme extends paper.Project {
  
  constructor(...attr) {
    super(...attr);
    Object.defineProperty(this, 'props', {value: new BuilderProps(this)});
  }

  get activeLayer() {
    return this._activeLayer || new Contour({project: this, insert: true});
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
    const space = 160;
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
    const zoom = Math.min(view.viewSize.height / height, view.viewSize.width / width);
    const {scaling} = view._decompose();
    view.scaling = [Math.sign(scaling.x) * zoom, Math.sign(scaling.y) * zoom];

    const dx = view.viewSize.width - width * zoom;
    const dy = view.viewSize.height - height * zoom;
    view.center = center.add([Math.sign(scaling.x) * dx, -Math.sign(scaling.y) * dy]);
  }
  
}
