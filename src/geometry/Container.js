
// import paper from 'paper/dist/paper-core';
// import {LayerGroup} from './DimensionDrawer';
import {Contour} from './Contour';

/**
 * @summary Область-проём для слоёв и заполнений
 * @desc Возвращает периметр с узлами скелетона. Живёт в координатной системе изделия, отвечает только за 2D
 */
export class Container  {
  
  #raw = {owner: null, cycle: null};

  constructor(owner, cycle) {
    Object.assign(this.#raw, {owner, cycle});
    owner.children[cycle.key] = this;
    this.createChild({kind: 'glass'});
  }
  
  get key() {
    return this.#raw.cycle.key;
  }
  
  get kind() {
    return this.#raw.kind;
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
  
  get layer() {
    return this.skeleton.owner;
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
      res.push(Object.assign(curr.intersectPoint(prev, curr.firstSegment.point), {edge: cycle[i]}));
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
  createChild({kind}) {
    if(kind !== this.#raw.kind) {
      this.#raw.child?.remove();
      const {pathInner, layer} = this;
      if(kind === 'flap') {
        const child = new Contour({
          project: layer.project,
          parent: layer.children.topLayers,
        });
        const profiles = [];
        for(let i = 0; i < pathInner.length; i++) {
          const b = pathInner[i];
          const e = pathInner[i === pathInner.length - 1 ? 0 : i + 1];
          profiles.push(child.createProfile({b, e, edge: b.edge, loading: true}));
        }
        for(const profile of profiles) {
          child.skeleton.addProfile(profile);
        }
        this.#raw.child = child; 
      }
      this.#raw.kind = kind;
      return;
    }
    this.sync();
  }

  remove() {
    const {owner, cycle} = this.#raw;
    // удалить элементы рисовалки
    // удалить себя из коллекции владельца
    delete owner.children[cycle.key];
  }

  sync() {
    const {pathInner} = this;
    const {kind, child} = this.#raw;
    if(kind === 'flap') {
      for(let i = 0; i < pathInner.length; i++) {
        const b = pathInner[i];
        for(const profile of child.profiles) {
          if(profile.edge === b.edge && !profile.b.vertex.point.isNearest(b)) {
            profile.b.vertex.point = b.clone();
          }
        }
      }
    }
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
    const cycles = skeleton.project.props.slave ? [] : skeleton.detectCycles();
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
