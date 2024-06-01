
// import paper from 'paper/dist/paper-core';
// import {LayerGroup} from './DimensionDrawer';


/**
 * @summary Область-проём для слоёв и заполнений
 * @desc Возвращает периметр с узлами скелетона. Живёт в координатной системе изделия, отвечает только за 2D
 */
export class Container  {
  
  #raw = {owner: null, cycle: null};

  constructor(owner, cycle) {
    Object.assign(this.#raw, {owner, cycle});
    owner.children[cycle.key] = this;
    this.init();
  }

  /**
   * @summary {{#crossLink "Skeleton"}}Скелетон{{/crossLink}} слоя, которому принадлежит `Область`
   * @Type {Skeleton}
   */
  get skeleton() {
    return this.#raw.owner.skeleton;
  }

  get free() {
    return this.#raw.owner.free;
  }

  /**
   * @summary Последовательность {{#crossLink "GraphEdge"}}рёбер{{/crossLink}}, образующая `Область`
   */
  get perimeter() {
    return this.#raw.cycle;
  }
  
  get pathInner() {
    const offset = -30;
    const {cycle} = this.#raw;
    const paths = [];
    const res = [];
    for(let i = 0; i < cycle.length; i++) {
      const {startVertex, endVertex, profile} = cycle[i];
      paths.push(new paper.Path({insert: false, segments: [startVertex.point, endVertex.point]}).equidistant(offset));
    }
    for(let i = 0; i < cycle.length; i++) {
      const prev = paths[i === 0 ? cycle.length -1 : i - 1];
      const curr = paths[i];
      const next = paths[i === cycle.length - 1 ? 0 : i + 1];
      res.push(curr.intersectPoint(prev, curr.firstSegment.point));
    }
    return res;
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

  /**
   * @summary Создаёт дочернее заполнение или слой
   */
  init() {
    
  }

  remove() {
    const {owner, cycle} = this.#raw;
    // удалить элементы рисовалки
    // удалить себя из коллекции владельца
    delete owner.children[cycle.key];
  }

  sync() {
    
  }
  
}

export class Containers {
  #raw = {
    owner: null,
    free: false,
    children: {},
  };

  constructor(owner) {
    this.#raw.owner = owner;
  }

  /**
   * Итератор
   * @return {Iterator}
   */
  [Symbol.iterator]() {
    const {root} = this.#raw.owner.project;
    return new root.classes.Iterator(Object.values(this.children));
  }

  /**
   * @summary Скелетон слоя
   * @return {Skeleton}
   */
  get skeleton() {
    return this.#raw.owner.skeleton;
  }

  get children() {
    return this.#raw.children;
  }
  
  get free() {
    return this.#raw.free;
  }

  /**
   * @summary Ищет замкнутые циклы и прочищает неактуальные
   */
  detectAndPurge() {
    const {skeleton, children} = this;
    const cycles = skeleton.detectCycles();
    const keys = cycles.map(v => v.key);
    for(const key in children) {
      if(!keys.includes(key)) {
        children[key].remove();
      }
    }
    return {children, cycles};
  }

  /**
   * @summary Ищет замкнутые циклы и создаёт-удаляет {{#crossLink "Container"}}Области{{/crossLink}}
   */
  sync() {
    const {children, cycles} = this.detectAndPurge();
    // создаём недостающие
    for(const cycle of cycles) {
      const container = children[cycle.key] || new Container(this, cycle);
      container.sync();
    }
  }
}
