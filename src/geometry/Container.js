
import paper from 'paper/dist/paper-core';
import {LayerGroup} from './DimensionDrawer';

/**
 * @summary Область-проём для слоёв и заполнений
 * @desc Возвращает периметр с узлами скелетона. Живёт в координатной системе изделия, отвечает только за 2D
 */
export class Container extends LayerGroup {
  #raw = {
    free: false,
    width: 0,
    height: 0,
  };

  constructor({free, width, height, ...attr}) {
    super(attr);
    if(typeof free === 'boolean') {
      this.#raw.free = free;
    }
    if(typeof height === 'number') {
      this.#raw.height = height;
    }
    if(typeof width === 'number') {
      this.#raw.width = width;
    }
  }

  /**
   * @summary {{#crossLink "Skeleton"}}Скелетон{{/crossLink}} слоя, которому принадлежит `Область`
   * @Type {Skeleton}
   */
  get skeleton() {
    return this.layer.skeleton;
  }

  /**
   * @summary Последовательность {{#crossLink "GraphEdge"}}рёбер{{/crossLink}}, образующая `Область`
   */
  get perimeter() {
    
  }
  
  get width() {
    return this.#raw.width;
  }
  set width(v) {
    this.#raw.width = Number(v);
  }

  get height() {
    return this.#raw.height;
  }
  set height(v) {
    this.#raw.height = Number(v);
  }
  
}
