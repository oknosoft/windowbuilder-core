import {LightSlot} from './LightSlot';

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
   * @type {Skeleton}
   */
  get skeleton() {
    return this.#raw.owner.skeleton;
  }

  /**
   * @summary Слой-владелец
   * @type {Contour}
   */
  get owner() {
    return this.#raw.owner;
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
    const {skeleton, children, owner} = this;
    let cycles = [];
    if(owner.project.rootLayer !== owner) {
      cycles = skeleton.detectCycles();
      const keys = cycles.map(v => v.key);
      for(const key in children) {
        if(!keys.includes(key)) {
          children[key].remove();
        }
      }
    }
    return {children, cycles};
  }

  /**
   * @summary Ищет замкнутые циклы и создаёт-удаляет {{#crossLink "LightSlot"}}Области{{/crossLink}}
   */
  sync() {
    const {children, cycles} = this.detectAndPurge();
    // создаём недостающие
    for(const cycle of cycles) {
      const container = children[cycle.key] || new LightSlot(this, cycle);
      container.sync();
    }
  }
}
