import paper from 'paper/dist/paper-core';
import {Skeleton} from './graph/Skeleton';

export class Contour extends paper.Layer {

  #raw = {};

  constructor(attr) {
    super(attr);
    this.#raw.skeleton = new Skeleton(this);
  }

  /**
   * Возвращает массив вложенных контуров текущего контура
   * @memberOf AbstractFilling
   * @instance
   * @type Array.<Contour>
   */
  get contours() {
    return this.children.filter((elm) => elm instanceof Contour);
  }

  get skeleton() {
    return this.#raw.skeleton;
  }
}
