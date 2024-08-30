
// import paper from 'paper/dist/paper-core';
// import {LayerGroup} from './DimensionDrawer';
import {Contour} from './Contour';
import {Filling} from './Filling';
import {ContainerBlank} from './ContainerBlank';

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
  
  get child() {
    return this.#raw.child;
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

  /**
   * @summary Точка внутри контейнера
   * @Type {paper.Point}
   */
  get interiorPoint() {
    const {cycle} = this.#raw;
    const points = [cycle[0].startVertex.point];
    if(cycle.length > 1) {
      if(cycle.length < 4) {
        points.push(cycle[0].endVertex.point);
      }
      if(cycle.length > 3) {
        points.push(cycle[1].endVertex.point);
      }
    }
    return new paper.Point(points
      .reduce((sum, curr) => sum ? [sum[0] + curr.x, sum[1] + curr.y] : [curr.x, curr.y], null)
      .map(v => v / points.length));
  }
  
  get pathInner() {
    const offset = 16;
    const {cycle} = this.#raw;
    const {interiorPoint} = this;
    const paths = [];
    const res = [];
    if(cycle.length > 1) {
      for(let i = 0; i < cycle.length; i++) {
        const {startVertex, endVertex, profile} = cycle[i];
        // внутреннее по отношению к контейнеру ребро профиля + фальц
        const rib = profile.innerRib(interiorPoint, startVertex.point, endVertex.point);
        paths.push(rib.equidistant(offset));
      }
      // TODO организовать прочистку здесь или отдельным циклом
      for(let i = 0; i < cycle.length; i++) {
        const prev = paths[i === 0 ? cycle.length -1 : i - 1];
        const curr = paths[i];
        const next = paths[i === cycle.length - 1 ? 0 : i + 1];
        res.push(Object.assign(curr.intersectPoint(prev, curr.firstSegment.point, (offset) * 3), {edge: cycle[i]}));
      }
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
  createChild({kind, skipProfiles}) {
    if(kind !== this.#raw.kind) {
      const {pathInner, layer, child} = this;
      const {project} = layer;
      this.#raw.child = null;
      const clayer = child?.layer;
      if(clayer) {
        clayer._removing = true;
      }
      child?.remove();
      if(clayer) {
        delete clayer._removing;
      }       
      project.props.registerChange();
      if(kind === 'flap') {
        const {loading} = project.props; 
        project.props.loading = true;
        const child = this.#raw.child = new Contour({
          project,
          parent: layer.children.topLayers,
        });
        if(!skipProfiles) {
          const profiles = [];
          for(let i = 0; i < pathInner.length; i++) {
            const b = pathInner[i];
            const e = pathInner[i === pathInner.length - 1 ? 0 : i + 1];
            profiles.push(child.createProfile({b, e, edge: b.edge, loading: true}));
          }
          child.skeleton.addProfiles(profiles);
        }
        project.props.loading = loading;
      }
      else if(kind === 'glass') {
        this.#raw.child = new Filling({
          project,
          layer,
          parent: layer.children.fillings,
          pathOuter: pathInner,
        });
      }
      else if(kind === 'blank') {
        this.#raw.child = new ContainerBlank({
          project,
          layer,
          parent: layer.children.fillings,
          pathOuter: pathInner,
        });
      }
      this.#raw.kind = kind;
    }
    else {
      this.sync();
    }
    return this.#raw.child;
  }

  remove() {
    const {owner, cycle, child} = this.#raw;
    // удалить элементы рисовалки
    child?.remove();
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
    else if(['glass', 'blank'].includes(kind)) {
      child.path = pathInner;
    }
  }


  
}


