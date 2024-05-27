
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
   * @summary Прочищает неактуальные циклы
   */
  purge(cycles) {
    const {children} = this;
    const keys = cycles.map(v => v.key);
    for(const key in children) {
      if(!keys.includes(key)) {
        children[key].remove();
      }
    }
  }

  /**
   * @summary Ищет замкнутые циклы и создаёт-удаляет {{#crossLink "Container"}}Области{{/crossLink}}
   */
  sync() {
    const {skeleton, children} = this;
    const cycles = skeleton.detectCycles();
    // удаляем неактуальные циклы
    this.purge();
    // создаём недостающие
    for(const cycle of cycles) {
      const container = children[cycle.key] || new Container({owner: this, cycle});
      container.sync();
    }
  }
}
