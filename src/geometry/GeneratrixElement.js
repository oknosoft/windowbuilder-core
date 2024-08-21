import paper from 'paper/dist/paper-core';
import {BuilderElement} from './BuilderElement';
import {CnnPoint} from './ProfileCnnPoint';

export const pathAttr = {
  strokeColor: 'black',
  fillColor: 'white',
  strokeWidth: 1,
  strokeScaling: false,
};

export class GeneratrixElement extends BuilderElement {

  /**
   * @param {Object} attr - объект со свойствами создаваемого элемента
   *  @param {Contour} [attr.layer] - контур (слой), которому принадлежит элемент
   *  @param {BuilderElement} [attr.parent] - родительский элемент, которому принадлежит текущий
   *  @param {BuilderElement} [attr.owner] - элемент - владелец, которому принадлежит текущий
   *  @param {CatInserts} [attr.inset] - вставка элемента. если не указано, будет вычислена по типу элемента
   *  @param {paper.Path} [attr.generatrix] - путь образующей
   *  @param {Object} [attr.cnns] - соединения концов профиля
   *  @param {CatCnns} [attr.cnns.b]
   *  @param {CatCnns} [attr.cnns.e]
   *  @param {CatCnns} [attr.cnns.bOuter]
   *  @param {CatCnns} [attr.cnns.eOuter]
   */
  constructor({generatrix, cnns, edge, ...attr}) {
    super(attr);
    if(generatrix) {
      generatrix.set({parent: this, name: 'generatrix'});
    }
    if(edge) {
      this.raw('edge', edge);  
    }
    this.raw('b', new CnnPoint({owner: this, name: 'b', cnn: cnns?.b, cnnOuter: cnns?.bOuter}));
    this.raw('e', new CnnPoint({owner: this, name: 'e', cnn: cnns?.e, cnnOuter: cnns?.eOuter}));
    this.raw('inner', new paper.Path({insert: false}));
    this.raw('outer', new paper.Path({insert: false}));
    this.raw('cut', new paper.Path({insert: false}));
    this.raw('path', new paper.Path({parent: this, name: 'path', ...pathAttr}));
  }
  
  get skeleton() {
    return this.layer.skeleton;
  }

  /**
   * @summary Образующая
   * @desc Вокруг образующей, строится Путь элемента. Здесь может быть линия, простая дуга или безье
   * @type paper.Path
   */
  get generatrix() {
    return this.children.generatrix;
  }

  /**
   * @summary Узел начала профиля
   * @type {CnnPoint}
   */
  get b() {
    return this.raw('b');
  }

  /**
   * @summary Узел конца профиля
   * @type {CnnPoint}
   */
  get e() {
    return this.raw('e');
  }

  get x1(){
    return this.b.point.x;
  }

  get x2(){
    return this.e.point.x;
  }

  get y1(){
    return this.b.point.y;
  }

  get y2(){
    return this.e.point.y;
  }

  /**
   * @summary Путь фактического реза элемента
   * @type {paper.Path}
   */
  get cut() {
    return this.raw('cut');
  }

  /**
   * @summary Ребро - владельца профиля
   * @type {GraphEdge}
   */
  get edge() {
    return this.raw('edge');
  }

  /**
   * @summary Расстояние от узла до опорной линии
   * @desc Для сегментов створок и вложенных элементов зависит от ширины элементов и свойств примыкающих соединений,
   * для соединителей и раскладок = 0
   * @type Number
   * @final
   */
  get d0() {
    return this.offset;
  }

  /**
   * @summary Расстояние от узла до внешнего ребра элемента
   * @desc для рамы, обычно = 0, для импоста 1/2 ширины, зависит от `d0` и `sizeb`
   * @type Number
   * @final
   */
  get d1() {
    return -(this.d0 - this.sizeb);
  }

  /**
   * @summary Расстояние от узла до внутреннего ребра элемента
   * @desc зависит от ширины элементов и свойств примыкающих соединений
   * @type Number
   * @final
   */
  get d2() {
    return this.d1 - this.width;
  }

  /**
   * @summary Смещение внешнего ребра от опорной линии
   * @desc для рам, как правило = 0, для импостов - половине ширины
   * @type {Number}
   */
  get sizeb() {
    const {sizeb} = this.inset;
    if(sizeb === -1100) {
      const {nom} = this;
      return nom ? nom.sizeb : 0;
    }
    else if(sizeb === -1200) {
      return this.width / 2;
    }
    else if(sizeb > 1000) {
      const parts = sizeb.toFixed(); //[для импоста]/[для рамы]
      const p1 = parts.substring(0, 3);
      const {b, e} = this.rays;
      if(b.is_cut() || b.is_t() || b.is_i() || e.is_cut() || e.is_t() || e.is_i()) {
        return parseFloat(p1);
      }
      let p2 = parts.substring(3, 3);
      while (p2.length < 3) {
        p2 += '0';
      }
      return parseFloat(p2);
    }
    return sizeb || 0;
  }

  /**
   * @summary Задаваемое пользователем смещение от образующей
   * @desc Особенно актуально для наклонных элементов а так же, в случае,
   * когда чертёж должен опираться на размеры проёма и отступы, вместо габаритов по профилю
   * @type Number
   */
  get offset() {
    return this.raw('offset') || 0;
  }
  set offset(v) {
    this.raw('offset', parseFloat(v) || 0);
  }

  get imposts() {
    const {b, e} = this;
    const inner = [], outer = [];
    let vertices = b.vertex.getNeighbors();
    while (vertices.length) {
      const tmp = new Set();
      for(const vertex of vertices) {
        for(const cnnPoint of vertex.cnnPoints) {
          if(cnnPoint.isT && cnnPoint.profile === this) {
            inner.push(cnnPoint);
            tmp.add(vertex);
          }          
        }
      }
      vertices.length = 0;
      for(const vertex of Array.from(tmp)) {
        vertices.push(...vertex.getAncestors());
      }      
    }
    // vertices = e.vertex.getAncestors();
    // while (vertices.length) {
    //   const tmp = new Set();
    //   for(const vertex of vertices) {
    //     for(const cnnPoint of vertex.cnnPoints) {
    //       if(cnnPoint.isT && cnnPoint.profile === this) {
    //         outer.push(cnnPoint);
    //         tmp.add(vertex);
    //       }
    //     }
    //   }
    //   vertices.length = 0;
    //   for(const vertex of Array.from(tmp)) {
    //     vertices.push(...vertex.getAncestors());
    //   }
    // }
    return {inner, outer};
  }

  /**
   * @summary Положение элемента в контуре
   * @type {EnmElmPositions}
   */
  get pos() {
    const {layer, project: {root}} = this;
    const {top, bottom, left, right} = layer.profilesBySide();
    const {Верх, Низ, Лев, Прав, Центр} = root.enm.positions;
    if(top === this) {
      return Верх;
    }
    if(bottom === this) {
      return Низ;
    }
    if(left === this) {
      return Лев;
    }
    if(right === this) {
      return Прав;
    }
    const {x1, x2, y1, y2} = this;
    const delta = 60;
    if(Math.abs(top.y1 + top.y2 - y1 - y2) < delta) {
      return Верх;
    }
    if(Math.abs(bottom.y1 + bottom.y2 - y1 - y2) < delta) {
      return Низ;
    }
    if(Math.abs(left.x1 + left.x2 - x1 - x2) < delta) {
      return Лев;
    }
    if(Math.abs(right.x1 + right.x2 - x1 - x2) < delta) {
      return Прав;
    }
    // TODO: рассмотреть случай с выносом стоек и разрывами
    return Центр;
  }

  /**
   * @summary Путь внешнего ребра элемента
   * @type {paper.Path}
   */
  get outer() {
    this.checkActual();
    const outer = this.raw('outer');
    if(!outer.segments.length) {
      this.tuneRays();
    }
    return outer;
  }

  /**
   * @summary Путь внутреннего ребра элемента
   * @type {paper.Path}
   */
  get inner() {
    this.checkActual();
    const inner = this.raw('inner');
    if(!inner.segments.length) {
      this.tuneRays();
    }
    return inner;
  }

  /**
   * @summary Выделяем только образующую
   * @param {Boolean} selection
   */
  setSelection(selection) {
    const {path} = this;
    super.setSelection(selection);
    path.setSelection(0);
  }

  checkActual() {
    if(!this.isActual) {
      this.raw('inner').removeSegments();
      this.raw('outer').removeSegments();
    }
    return super.checkActual();
  }

  tuneRays() {
    const [inner, outer] = this.raw(['inner', 'outer']);
    if(!inner.segments.length || !outer.segments.length) {
      const {b, e, d1, d2, generatrix} = this;
      const nb = generatrix.getNormalAt(0);
      const ne = generatrix.getNormalAt(generatrix.length);
      outer.add(b.point.add(nb.multiply(d1)));
      inner.add(b.point.add(nb.multiply(d2)));
      outer.add(e.point.add(ne.multiply(d1)));
      inner.add(e.point.add(ne.multiply(d2)));
    }
    return this;
  }

  /**
   * @summary Умолчания при изменении окружения
   * @desc Уточняет цвет, вставку и параметры
   */
  defaults() {
    const {layer: {sys}, elmType, inset} = this;
    if(inset.empty()) { // || checkActual
      const inserts = sys.inserts({elmTypes: elmType, elm: this});
      if(inserts.length) {
        this.inset = inserts[0];
      }
    }
    
  }

  cnnSide(profile, interior) {
    if(!interior) {
      interior = profile.generatrix.interiorPoint;
    }
    return this.generatrix.pointPos(interior, interior);
  }

  /**
   * @summary При удалении элемента
   * @desc Проверяем возможность удаления и сначала удаляем из скелетона
   */
  remove() {
    const {project, skeleton} = this;
    skeleton.removeProfile(this);
    super.remove();
  }

  redraw() {
    this.checkActual();
    this.project.props.loading
    const {path, project, generatrix, inset} = this;
    if(project.props.carcass !== 'normal') {
      path.selected = false;
      path.visible = false;
      generatrix.strokeColor = inset.empty() ? '#a00' : '#00a';
    }
    else {
      path.visible = true;
      if(!path.segments.length) {
        const {b, e} = this;
        const points = {b: b.points(), e: e.points()};
        path.addSegments([points.b.outer, points.e.outer, points.e.inner, points.b.inner]);
        path.closePath();
      }
      generatrix.strokeColor = new paper.Color(0.5, 0.5);
    }
  }
}
