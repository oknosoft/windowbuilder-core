import paper from 'paper/dist/paper-core';
import {Skeleton} from './graph/Skeleton';
import {Mover} from './graph/Mover';

import {Profile} from './ProfileItem';
import {contourGroups} from './ContourGroups';
import {Props3D} from './BuilderPropsThree';

export class Contour extends paper.Layer {

  #raw = {hidden: false};

  constructor(attr) {
    super(attr);
    this.#raw.skeleton = new Skeleton(this);
    this.#raw.mover = new Mover(this);
    this.#raw.three = new Props3D({owner: this});
    contourGroups(this);
  }

  get _manager() {
    return this.project;
  }
  
  get index() {
    const {layer, _index} = this;
    return layer ? `${layer.index}-${_index+1}` : _index.toString();
  }

  get level() {
    const {layer} = this;
    return layer ? layer.level + 1 : 0;
  }
  
  get presentation() {
    const {index, level} = this;
    return `${level ? 'Створка' : 'Рама'} №${index}`;
  }

  get skeleton() {
    return this.#raw.skeleton;
  }
  
  get mover() {
    return this.#raw.mover;
  }

  get three() {
    return this.#raw.three;
  }

  get container() {
    if(this.isInserted() && this.layer) {
      for(const container of this.layer.containers) {
        if(container.child === this) {
          return container;
        }
      }
    }
  }

  /**
   * Признак сокрытия слоя
   * @type {boolean}
   */
  get hidden() {
    return this.#raw.hidden;
  }
  set hidden(v) {
    if (this.hidden != v) {
      this.#raw.hidden = v;
      const visible = !this.#raw.hidden;
      for(const elm of this.profiles.concat(this.fillings)) {
        //elm.visible = visible;
        elm.opacity = visible ? 1 : 0.1;
      }
      this.children.visualization.visible = visible;
      //this.l_dimensions.redraw();
      //this.project.draw_sizes();
    }
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
   * @summary Массив выделенных профилей текущего слоя
   * @type {Array.<Profile>}
   */
  get selectedProfiles() {
    return this.profiles.filter(v => v.selected);
  }

  /**
   * @summary Тип открывания
   * @type {EnmOpenTypes}
   */
  get openType() {
    const {project, layer} = this;
    const {openTypes} = project.root.enm;
    return layer.layer ? openTypes.get(this.#raw.openType) : openTypes.get();
  }
  set openType(v) {
    this.#raw.openType = v;
    this.project.props.registerChange();
    if(this.furn.open_type !== this.openType) {
      //TODO: подобрать фурнитуру
    }
  }

  /**
   * @summary Направление открывания
   * @type {EnmOpenDirections}
   */
  get direction() {
    const {project, layer} = this;
    const {openDirections} = project.root.enm;
    return layer.layer ? openDirections.get(this.#raw.direction) : openDirections.get();
  }
  set direction(v) {
    this.#raw.direction = v;
    this.project.props.registerChange();
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

    for(const profile of profiles) {
      const {b, e} = profile;
      const x = b.point.x + e.point.x;
      const y = b.point.y + e.point.y;
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
    const {profiles} = this.children;
    return profiles.bounds;
  }

  /**
   * @summary Надо ли строить авторазмерные линии
   * @type {Boolean}
   */
  get showDimensions() {
    return !this.layer;
  }
  
  get sys() {
    const {project, layer} = this;
    const {utils, cat} = project.root;
    const {sys} = this.#raw;
    if(utils.is.emptyGuid(sys)) {
      return layer ? layer.sys : project.props.sys;
    }
    else {
      return cat.productionParams.get(sys);
    }
  }
  set sys(v) {
    this.#raw.sys = this.project.root.cat.productionParams.get(v);
  }
  
  get furn() {
    const {project, layer} = this;
    const {furns} = project.root.cat;
    return layer.layer ? furns.get(this.#raw.furn) : furns.get();
  }
  set furn(v) {
    this.#raw.furn = v;
    this.project.props.registerChange();
  }
  
  ProfileConstructor(attr) {
    return Profile;
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
    const {skeleton, project} = this;
    if(this.skeleton.checkNodes(b, e)) {
      throw new Error('createProfile: Edge has already been added before');
    }
    generatrix.set({
      layer: this,
      //guide: true,
      strokeColor: project.props.carcass === 'normal' ? new paper.Color(0.5, 0.5) : (other.inset ? '#00a' : '#a00'),
      strokeScaling: false,
    });
    // TODO: defaultInset
    const ProfileConstructor = this.ProfileConstructor(other);
    const profile = new ProfileConstructor({
      layer: this,
      parent: this.children.profiles,
      generatrix,
      ...other
    });
    return profile;
  }

  /**
   * @summary Перерисовывает все элементы слоя
   */
  redraw() {
    const isPlane =  this.project.props.carcass === 'plane';
    // сначала, все профили
    for(const item of this.profiles) {
      item.redraw?.();
    }
    // синхронизируем области
    this.containers.sync();
    
    for(const item of this.fillings) {
      item.redraw?.();
    }
    for(const item of this.contours) {
      if(isPlane) {
        item.visible = false;
      }
      else {
        item.visible = true;
        item.redraw?.();
      }
    }
    this.drawVisualization();
  }
  
  clear(interactive) {
    if(interactive) {
      this._removing = true;
    }
    for(const contour of this.contours) {
      contour.remove();
    }
    for(const container of this.containers) {
      container.remove();
    }
    for(const profile of this.profiles.reverse()) {
      profile.remove();
    }
    this.children.visualization.clear();
    this.project.dimensions.clear(this);
    this.project.props.registerChange();
    if(interactive) {
      delete this._removing;
    }
  }
  
  remove() {
    const {container, three} = this;
    // блокируем лишние пересчёты
    this._removing = true;
    // чистим элементы
    this.clear();
    // чистим свойства 3D
    three.clear();
    // собственно, удаляем
    super.remove();
    // создаём при необходимости на освободившемся месте, пустоту
    if(container) {
      container.createChild({kind: 'blank'});
    }
    delete this._removing;
  }

  move(delta) {
    this.translate(delta);
    this.project.props.registerChange();
    this.project.redraw();
  }
  
  drawVisualization() {
    const {project: {props}, children: {visualization}, skeleton, profiles, layer} = this;
    visualization.children.graph.clear();
    if(props.carcass === 'carcass') {
      // подписи узлов
      for(const vertex of skeleton.getAllVertices()) {
        new paper.PointText({
          point: vertex.point.add([20, -20]),
          content: `(${vertex.value})`,
          parent: visualization.children.graph,
          fontSize: props.fontSize(),
          fontFamily: props.fontFamily(),
        });
      }
      // подписи профилей
      for(const profile of profiles) {
        const loc = profile.generatrix.getLocationAt(profile.generatrix.length / 3);
        new paper.PointText({
          position: loc.point.add(loc.normal.multiply(layer ? -20 : 20)),
          content: profile._index+1,
          parent: visualization.children.graph,
          fontSize: props.fontSize(),
          fontFamily: props.fontFamily(),
          justification: 'center'
        });
      }
    }
  }
}
