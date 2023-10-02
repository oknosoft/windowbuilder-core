
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
  
}
