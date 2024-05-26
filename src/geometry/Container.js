
// import paper from 'paper/dist/paper-core';
// import {LayerGroup} from './DimensionDrawer';

/**
 * @summary Область-проём для слоёв и заполнений
 * @desc Возвращает периметр с узлами скелетона. Живёт в координатной системе изделия, отвечает только за 2D
 */
export class Container  {
  #raw = {
    owner: null,
    free: false,
  };

  constructor(owner) {
    this.#raw.owner = owner;
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

export class Containers {
  #raw = {
    owner: null,
    free: false,
  };

  constructor(owner) {
    this.#raw.owner = owner;
  }

  /**
   * @summary Ищет замкнутые циклы и создаёт-удаляет {{#crossLink "Container"}}Области{{/crossLink}}
   */
  sync() {
    const cycles = this.#raw.owner.skeleton.detectCycles();
    for(const cycle of cycles) {
      
    }
  }
}
