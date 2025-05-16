import paper from 'paper/dist/paper-core';
import {epsilon} from './paper/Point';
import {BuilderElement} from './BuilderElement';
import {CnnPoint} from './ProfileCnnPoint';
import {rama, impost, flap, connective, loader, svgStubs} from './ProfileShapes';

export const pathAttr = {
  strokeColor: 'black',
  dashArray: [],
  strokeWidth: 1,
  strokeScaling: false,
  strokeCap: 'round'
};
export const selectedAttr = {
  strokeColor: new paper.Color(0.2, 0.2, 0.5, 0.7),
  dashArray: [4, 6],
  strokeWidth: 2,
};

/**
 * @typedef PointAndProfile
 * @prop {paper.Point} point
 * @prop {GeneratrixElement} profile
 * @prop {CnnPoint} node
 */

/**
 * @typedef JoinedProfiles
 * @prop {Array.<PointAndProfile>} outer
 * @prop {Array.<PointAndProfile>} inner
 */

/**
 * @typedef InnerOuter {'inner'|'outer'}
 */

/**
 * @typedef NodeBE {'b'|'e'}
 */

export class GeneratrixElement extends BuilderElement {

  /**
   * @param {Object} attr - объект со свойствами создаваемого элемента
   *  @param {Contour} [attr.layer] - контур (слой), которому принадлежит элемент
   *  @param {BuilderElement} [attr.parent] - родительский элемент, которому принадлежит текущий
   *  @param {BuilderElement} [attr.owner] - элемент - владелец, которому принадлежит текущий
   *  @param {CatInserts} [attr.inset] - вставка элемента. если не указано, будет вычислена по типу элемента
   *  @param {paper.Path} [attr.generatrix] - путь образующей
   *  @param {Object} [attr.cnns] - соединения концов профиля
   *  @param {Object} [attr.cnns.b] - {cnn, cnnOuter, profile, profileOuter}
   *  @param {Object} [attr.cnns.e]
   */
  constructor({generatrix, cnns, edge, ...attr}) {
    super(attr);
    if(generatrix) {
      generatrix.set({parent: this, name: 'generatrix'});
    }
    if(cnns?.ii) {
      this.raw('cnnII', cnns?.ii);
    }
    if(edge) {
      this.raw('edge', edge);
    }
    this.raw('b', new CnnPoint({owner: this, name: 'b', ...cnns?.b}));
    this.raw('e', new CnnPoint({owner: this, name: 'e', ...cnns?.e}));
    this.raw('inner', new paper.Path({insert: false}));
    this.raw('outer', new paper.Path({insert: false}));
    this.raw('cut', new paper.Path({insert: false}));
    this.raw('path', new paper.Path({parent: this, name: 'path', fillColor: 'white', ...pathAttr}));
    this.edges = new Set();
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
  
  get vertexes() {
    const res = new Set();
    for(const edge of this.edges) {
      res.add(edge.startVertex);
      res.add(edge.endVertex);
    }
    return Array.from(res);
  }

  get cnnII() {
    let [edge, nearest, cnnII] = this.raw(['edge', 'nearest', 'cnnII']);
    if(cnnII) {
      return cnnII;
    }
    if(!nearest && edge) {
      nearest = edge.profile;
    }
    const {inset, project: {root}} = this;
    if(nearest && !inset.empty()) {
      const cnns = root.cat.cnns.iiCnns(this, nearest);
      if(cnns.length) {
        this.raw('cnnII', cnns[0]);
        return cnns[0];
      }
    }
    return root.cat.cnns.get();
  }
  set cnnII(v) {
    this.raw('cnnII', this.root.cat.cnns.get(v));
    this.project.props.registerChange();
  }
  
  /**
   * @summary Расстояние от узла до опорной линии
   * @desc Для сегментов створок и вложенных элементов зависит от ширины элементов и свойств примыкающих соединений,
   * для соединителей и раскладок = 0
   * @type Number
   * @final
   */
  get d0() {
    const {cnnII, offset} = this;
    return offset - cnnII.size(this);
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
   * @summary Размер фальца штапика
   * @type {Number}
   */
  get szc() {
    return this.nom.szc;
  }

  /**
   * @summary Припуск для соединения "сварной шов"
   * @type {Number}
   */
  get dx0() {
    const {b, nom} = this;
    const mainRow = b.cnn?.mainRow?.({elm: this, nom, node: b});
    return mainRow?.angle_calc_method?.is('seam') ? -mainRow.sz : 0;
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
    const {project} = this;
    if(!project.props.loading) {
      project.props.registerChange();
      project.redraw();
    }
  }

  /**
   * @summary Угол к горизонту
   * @desc Рассчитывается для прямой, проходящей через узлы
   *
   * @type Number
   * @final
   */
  get angleHor() {
    const {b: {point: b}, e: {point: e}} = this;
    const res = (new paper.Point(e.x - b.x, b.y - e.y)).angle.round(2);
    return res < 0 ? (res < -epsilon ? res + 360 : 0) : res;
  }

  /**
   * @summary Ориентация профиля
   * @desc Вычисляется по гулу к горизонту.
   * Если угол в пределах `orientation_delta`, элемент признаётся горизонтальным или вертикальным. Иначе - наклонным
   *
   * @type EnmOrientations
   * @final
   */
  get orientation() {
    let {angleHor, project} = this;
    const {orientations} = project.root.enm;
    const delta = 10;
    if(angleHor > 180) {
      angleHor -= 180;
    }
    if((angleHor > -delta && angleHor < delta) ||
      (angleHor > 180 - delta && angleHor < 180 + delta)) {
      return orientations.hor;
    }
    if((angleHor > 90 - delta && angleHor < 90 + delta) ||
      (angleHor > 270 - delta && angleHor < 270 + delta)) {
      return orientations.vert;
    }
    return orientations.incline;
  }

  /**
   * @summary Длина
   * @desc финальная, без припусков на обработку
   * @type Number
   */
  get length() {
    return this.rawLength;
  }

  /**
   * @summary Черновая длина
   * @desc для спецификации, с припусками на обработку
   * @type Number
   */
  get rawLength() {
    return this.generatrix.length;
  }

  /**
   * @summary Примыкающие к текущему профилю импосты
   * @type {JoinedProfiles}
   */
  get imposts() {
    const {b, e, vertexes} = this;
    const res = {inner: [], outer: []};
    for(const vertex of vertexes) {
      if(vertex !== b.vertex && vertex !== e.vertex) {
        for(const edge of vertex.getAllEdges()) {
          if(edge.profile !== this) {
            const side = this.cnnSide(edge.profile);
            const target = res[side < 0 ? 'inner' : 'outer'];
            if(!target.find((v) => v.profile === edge.profile && v.point.isNearest(vertex.point))) {
              target.push({
                profile: edge.profile, 
                point: vertex.point,
                node: edge.profile.b.point.isNearest(vertex.point) ? edge.profile.b : edge.profile.e,
              });
            }
          }
        }
      }
    }
    return res;
  }

  /**
   * @summary Положение элемента в контуре
   * @type {EnmElmPositions}
   */
  get pos() {
    const {layer, project: {root}} = this;
    const {top, bottom, left, right} = layer.profilesBySide();
    const {Верх, Низ, Лев, Прав, center, vert, hor} = root.enm.positions;
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
    const {orientation} = this;
    return orientation.is('hor') ? hor : (orientation.is('vert') ? vert : center);
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
   * @summary 3D сечение профиля
   * @return {three.Shape}
   */
  get shape() {
    const {nom, elmType} = this;
    let shape = elmType.is('impost') ? impost : (elmType.is('flap') ? flap : (elmType.is('linking') ? connective : rama));
    if(!nom.empty()) {
      if(nom.shape) {
        shape = nom.shape; 
      }
      else if(nom.shape !== null) {
        const svg_path = nom.visualization.svg_path.trim();
        if(svg_path) {
          try {
            const svg = loader.parse(svg_path.startsWith('<path') ?
              svgStubs[1].replace('%', svg_path) : svgStubs[0].replace('%', svg_path));
            shape = svg.paths[0].toShapes(true)[0];
            nom.shape = shape;
            shape.bounds = new paper.Path({
              pathData: svg_path.startsWith('<path') ?
                svg_path.replace('id="','~').split('d="')[1].split('"')[0] : svg_path,
              insert: false
            }).bounds;
          }
          catch (e) {
            nom.shape = null;
          }
        }
        else {
          nom.shape = null;
        }
      }
    }
    return shape;
  }
  
  get defaultClrStr() {
    return '#fefefe';
  }

  /**
   * @summary Является ли элемент прямым
   * @type {Boolean}
   */
  isLinear() {
    return this.generatrix.isLinear();
  }

  /**
   * @summary Примыкает ли заданный элемент к текущему
   * @type {Boolean}
   */
  isNearest(other) {
    const {generatrix} = this;
    return (generatrix.isNearest(other.b.point) && generatrix.isNearest(other.e.point)) ||
      (other.generatrix.isNearest(this.b.point) && other.generatrix.isNearest(this.e.point));
  }

  points(mode) {
    const {b, e} = this;
    return {b: b.points(mode), e: e.points(mode)};
  }
  
  /**
   * 
   * @param {paper.Point} interiorPoint
   * @param {paper.Point} b
   * @param {paper.Point} e
   */
  innerRib(interiorPoint, b, e) {
    const line = new paper.Line(this.b.point, this.e.point);
    const side = line.getSide(interiorPoint, true);
    const rib = (side > 0 ? this.outer : this.inner).clone({insert: false});
    // сравним направление
    const v0 = e.subtract(b);
    const v1 = rib.lastSegment.point.subtract(rib.firstSegment.point);
    if(Math.abs(v1.angle - v0.angle) > 40) {
      rib.reverse();
    }
    return rib;
  }

  /**
   * @summary Выделяем только образующую
   * @param {Boolean} selection
   */
  setSelection(selection) {
    const {path} = this;
    super.setSelection(selection);
    path.setSelection(0);
    path.set(selection ? selectedAttr : pathAttr);
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
    const inserts = sys.inserts({elmTypes: elmType, elm: this});
    if(inserts.length && !inserts.includes(inset)) { // || checkActual
      this.inset = inserts[0];
    }    
  }

  cnnSide(profile, interior) {
    if(!interior) {
      interior = profile.generatrix.interiorPoint;
    }
    return this.generatrix.pointPos(interior, interior);
  }

  /**
   * Выясняет, имеет ли текущий профиль соединение с `profile` в узле `vertex`
   */
  hasCnn(profile, vertex) {

    const {b, e} = this;

    if((b.vertex === vertex && b.profile === profile) || (e.vertex === vertex && e.profile == profile)) {
      return true;
    }
    return false;
  }

  /**
   * @summary При удалении элемента
   * @desc Проверяем возможность удаления и сначала удаляем из скелетона
   */
  remove() {
    const {project, skeleton, layer} = this;
    skeleton.removeProfile(this);
    for(const dl of project.dimensions.byContour(layer)) {
      if(dl.elm1 === this || dl.elm2 === this) {
        dl.remove();
      }
    }
    super.remove();
  }

  redraw() {
    this.checkActual();
    //this.project.props.loading
    const {path, project, generatrix, inset} = this;
    if(project.props.carcass !== 'normal') {
      path.selected = false;
      path.visible = false;
      generatrix.strokeColor = inset.empty() ? '#a00' : '#00a';
    }
    else {
      path.visible = true;
      if(!path.segments.length) {
        const {b, e} = this.points();
        path.addSegments([b.outer, e.outer, e.inner, b.inner]);
        path.closePath();
      }
      generatrix.strokeColor = new paper.Color(0.5, 0.5);
    }
  }
}
