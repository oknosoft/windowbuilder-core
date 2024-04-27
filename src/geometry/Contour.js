import paper from 'paper/dist/paper-core';
import {Skeleton} from './graph/Skeleton';
import {Mover} from './graph/Mover';

import {Profile} from './ProfileItem';
import {contourGroups} from './ContourGroups';

export class Contour extends paper.Layer {

  #raw = {};

  constructor(attr) {
    super(attr);
    this.#raw.skeleton = new Skeleton(this);
    this.#raw.mover = new Mover(this);
    contourGroups(this);
  }

  get skeleton() {
    return this.#raw.skeleton;
  }
  
  get mover() {
    return this.#raw.mover;
  }
  
  /**
   * @summary Возвращает массив вложенных контуров текущего контура
   * @type Array.<Contour>
   */
  get contours() {
    const {topLayers, bottomLayers} = this.children; 
    return bottomLayers.children.concat(topLayers.children);
  }

  /**
   * @summary Массив профилей текущего слоя
   * @type {Array.<Profile>}
   */
  get profiles() {
    return [...this.children.profiles.children];
  }
  
  /**
   * @summary Возвращает структуру профилей по сторонам
   * @param {String} [side]
   * @return {Object}
   */
  profilesBySide(side) {
    // получаем таблицу расстояний профилей от рёбер габаритов
    const {profiles} = this;
    const bounds = {
      left: Infinity,
      top: Infinity,
      bottom: -Infinity,
      right: -Infinity
    };
    const res = {};
    const ares = [];

    function bySide(name) {
      ares.some((elm) => {
        if(elm[name] == bounds[name]){
          res[name] = elm.profile;
          return true;
        }
      })
    }

    for(const profile of this.profiles) {
      const {b, e} = profile;
      const x = b.x + e.x;
      const y = b.y + e.y;
      if(x < bounds.left){
        bounds.left = x;
      }
      if(x > bounds.right){
        bounds.right = x;
      }
      if(y < bounds.top){
        bounds.top = y;
      }
      if(y > bounds.bottom){
        bounds.bottom = y;
      }
      ares.push({
        profile: profile,
        left: x,
        top: y,
        bottom: y,
        right: x
      });
    }
    
    if (side) {
      bySide(side);
      return res[side];
    }

    Object.keys(bounds).forEach(bySide);

    return res;
  }

  /**
   * @summary Массив Заполнений текущего слоя
   * @type {Array.<Filling>}
   */
  get fillings() {
    return [...this.children.fillings.children];
  }
  
  /**
   * @summary Габариты по внешним краям профилей контура
   * @type {paper.Rectangle}
   */
  get bounds() {
    return this.children.profiles.bounds;
  }

  get strokeBounds() {
    return this.children.profiles.strokeBounds;
  }
  
  /**
   * @summary Тест положения контура в изделии
   * @param {EnmElm_positions} pos
   * @return {Boolean}
   */
  isPos(pos) {
    const {project, layer} = this;
    // если в изделии один контур или если контур является створкой, он занимает одновременно все положения
    if(project.contours.count == 1 || layer){
      return true;
    }

    // если контур реально верхний или правый и т.д. - возвращаем результат сразу
    const {bounds} = this;
    let res = Math.abs(bounds[pos] - project.bounds[pos]) < project.props.sticking;

    if(!res){
      let rect;
      if(pos == "top"){
        rect = new paper.Rectangle(bounds.topLeft, bounds.topRight.add([0, -200]));
      }
      else if(pos == "left"){
        rect = new paper.Rectangle(bounds.topLeft, bounds.bottomLeft.add([-200, 0]));
      }
      else if(pos == "right"){
        rect = new paper.Rectangle(bounds.topRight, bounds.bottomRight.add([200, 0]));
      }
      else if(pos == "bottom"){
        rect = new paper.Rectangle(bounds.bottomLeft, bounds.bottomRight.add([0, 200]));
      }

      res = !project.contours.some((layer) => {
        return layer != this && rect.intersects(layer.bounds);
      });
    }

    return res;
  }

  /**
   * @summary Габариты с учетом пользовательских размерных линий, чтобы рассчитать отступы автолиний
   * @type paper.Rectangle
   */
  get dimensionBounds() {
    const {profiles, dimensions} = this.children;
    return profiles.bounds.unite(dimensions.bounds);
  }

  /**
   * @summary Надо ли строить авторазмерные линии
   * @type {Boolean}
   */
  get showDimensions() {
    return !this.layer;
  }
  

  /**
   * @summary Создаёт профиль и помещает его в своё семейство профилей
   * @param {Object} attr - объект со свойствами создаваемого элемента
   *  @param {paper.Point} [attr.b] - координата узла начала элемента
   *  @param {paper.Point} [attr.e] - координата узла конца элемента
   *  @param {paper.Path} [attr.path]
   *  @param {Array.<paper.Segment>} [attr.segments]
   *  @param {String} [attr.pathData]
   */
  createProfile({b, e, path, segments, pathData, ...other}) {
    let generatrix;
    if(path) {
      generatrix = path.clone({insert: false});
    }
    else if(pathData) {
      generatrix = new paper.Path({insert: false, pathData});
    }
    else if(segments) {
      generatrix = new paper.Path({insert: false, segments});
    }
    else if(b && e) {
      generatrix = new paper.Path({insert: false, segments: [b, e]});
    }
    if(!generatrix || generatrix.segments.length < 2) {
      throw new Error('createProfile: No generatrix');
    }
    b = generatrix.firstSegment.point;
    e = generatrix.lastSegment.point;
    if(this.skeleton.checkNodes(b, e)) {
      throw new Error('createProfile: Edge has already been added before');
    }
    generatrix.set({
      layer: this,
      //guide: true,
      strokeColor: 'grey',
      strokeScaling: false,
    });
    // TODO: defaultInset
    const profile = new Profile({
      layer: this,
      parent: this.children.profiles,
      generatrix,
      ...other
    });
    return profile;
  }

  /**
   * @summary Создаёт при необходимости, заполнения в замкнутых областях 
   */
  recalcFillings() {
    
  }

  /**
   * @summary Перерисовывает все элементы слоя
   */
  redraw() {
    for(const item of this.profiles) {
      item.redraw?.();
    }
    for(const item of this.fillings) {
      item.redraw?.();
    }
    for(const item of this.contours) {
      item.redraw?.();
    }
    this.drawVisualization();
    this.children.dimensions.redraw();
  }
  
  drawVisualization() {
    const {project, children: {visualization}, skeleton} = this;
    visualization.children.graph.clear();
    if(project.props.carcass) {
      for(const vertex of skeleton.getAllVertices()) {
        new paper.PointText({
          point: vertex.point.add([20, -20]),
          content: vertex.value,
          parent: visualization.children.graph,
          fontSize: project.props.fontSize(),
        })
      }
    }
  }
}