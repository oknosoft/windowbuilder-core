
import paper from 'paper/dist/paper-core';
import {ElementParams} from './BuilderParams';
import {GraphEdge} from './graph/Edge';

/**
 * @summary Элемент изделия
 * @desc Базовый класс элементов построителя
 * Унаследован от [paper.Group](http://paperjs.org/reference/group/). Cвойства и методы `BuilderElement` присущи всем элементам построителя,
 * но не характерны для классов [Path](http://paperjs.org/reference/path/) и [Group](http://paperjs.org/reference/group/) фреймворка [paper.js](http://paperjs.org/about/),
 * т.к. описывают не линию и не коллекцию графических примитивов, а элемент конструкции с определенной физикой и поведением
 *
 * @extends paper.Group
 * @abstract
 */
export class BuilderElement extends paper.Group {
  
  #raw = {};

  /**
   * @param {Object} attr - объект со свойствами создаваемого элемента
   *  @param {Contour} [attr.layer] - контур (слой), которому принадлежит элемент
   *  @param {BuilderElement} [attr.parent] - родительский элемент, которому принадлежит текущий
   *  @param {BuilderElement} [attr.owner] - элемент - владелец, которому принадлежит текущий
   *  @param {CatInserts} [attr.inset]- вставка элемента. если не указано, будет вычислена по типу элемента
   *  @param {paper.Path} [attr.generatrix] (r && arc_ccw && more_180)
   *  @param {EnmElmTypes} [attr.elmType]  может измениться при конструировании. например, импост -> рама
   */
  constructor({generatrix, owner, inset, ...attr}) {
    super(attr);
    if(owner) {
      this.#raw.owner = owner;
    }
    if(!inset) {
      inset = this.root.cat.inserts.get();
    }
    else if(typeof inset === "string") {
      inset = this.root.cat.inserts.get(inset);
    }
    this.#raw.inset = inset;
    this.params = new ElementParams(this);
  }

  /**
   * @summary Указатель на текущий экземпляр метадаты
   * @type {MetaEngine}
   */
  get root() {
    return this.project.root;
  }
  
  get _manager() {
    return this.project;
  }

  /**
   * @summary Доступ к сырым данным
   * @param {String|Array} name
   * @param {Any} [value]
   * @return {Any}
   */
  raw(name, value) {
    if(arguments.length > 1) {
      this.#raw[name] = value;
    }
    return Array.isArray(name) ? name.map(n => this.#raw[n]) : this.#raw[name];
  }

  /**
   * @summary Является ли элемент экземпляром заданного класса
   * @param {String} name
   * @return {Boolean}
   */
  is(name) {
    let Class;
    for(const sub of name.split('.')) {
      Class = Class ? Class[sub] : paper[sub];
    }
    return this instanceof Class;
  }

  get isActual() {
    return this.project.props.stamp === this.#raw.stamp;
  }
  
  checkActual() {     
    if(!this.isActual) {
      this.#raw.nom = null;
      this.#raw.index = '';
      this.#raw.path?.removeSegments?.();
      this.#raw.stamp = this.project.props.stamp;
    }
  }

  /**
   * @summary Элемент - владелец
   * @desc имеет смысл для раскладок и рёбер заполнения
   * @final
   * @type BuilderElement
   */
  get owner() {
    return this.#raw.owner;
  }

  /**
   * @summary Примыкающий внешний элемент
   * @desc имеет смысл для сегментов створок, доборов и рам с внешними соединителями
   * @abstract
   * @type BuilderElement
   */
  get nearest() {
    return this.#raw.nearest || this.#raw.edge?.profile;
  }
  set nearest(v) {
    if(v instanceof GraphEdge) {
      this.#raw.edge = v;
      delete this.#raw.nearest;
    }
    else if(v instanceof BuilderElement) {
      this.#raw.nearest = v;
      delete this.#raw.edge;
    }
    else {
      delete this.#raw.edge;
      delete this.#raw.nearest;
    }
  }

  /**
   * @summary Указатель на фактический профиль
   * @desc имеет смысл в 3D, когда элемент текущего слоя, фактически расположен в родительском
   * @abstract
   * @type BuilderElement
   */
  get imitationOf() {
    return this.#raw.imitationOf;
  }

  /**
   * @summary Видимый путь элемента
   * @desc состоит из кривых, соединяющих вершины элемента
   * @type {paper.Path}
   */
  get path() {
    return this.#raw.path;
  }
  set path(attr) {
  }

  /**
   * @summary Основная вставка элемента
   * @type CatInserts
   */
  get inset() {
    return this.root.cat.inserts.get(this.#raw.inset);
  }
  set inset(v) {
    const {project, layer} = this;
    v = project.root.cat.inserts.get(v);
    if(v !== this.#raw.inset) {
      this.#raw.inset = v;
      project.props.registerChange();
      if(!project.props.loading && !layer._removing) {
        project.redraw();
      }
    }
  }

  /**
   * @summary Номенклатура элемента
   * @desc свойство только для чтения, т.к. вычисляется во вставке с учётом текущих параметров и геометрии
   * @final
   * @type CatNom
   */
  get nom() {
    this.checkActual();
    if(!this.#raw.nom) {
      this.#raw.nom = this.inset.nom(this);
    }
    return this.#raw.nom;
  }

  /**
   * @summary Индекс элемента
   * @final
   * @type Number
   */
  get index() {
    if(!this.#raw.index) {
      const {layer, parent, elmType} = this;
      const elmnts = parent.children.filter(elm => elm.elmType === elmType);
      this.#raw.index = `${layer.index}${elmType.latin[0].toUpperCase()}${elmnts.indexOf(this)+1}`;
    }
    return this.#raw.index;
  }

  /**
   * @summary Тип элемента
   * @desc может измениться при конструировании
   * @final
   * @type EnmElmTypes
   */
  get elmType() {
    
  }

  /**
   * @summary Информация для редактора свойств
   * @final
   * @type String
   */
  get presentation() {
    return `${this.elmType} ${this.index}`;
  }

  /**
   * @summary Виртуальная ссылка
   * @type String
   */
  get ref() {
    const {nom} = this;
    return nom && !nom.empty() ? nom.ref : this.inset?.ref;
  }

  /**
   * @summary Ширина
   * @desc для профиля - ширина элемента, для заполнений - ширина описанного прямоугольника
   * @type Number
   */
  get width() {
    return this.nom.width || 80;
  }

  /**
   * @summary Высота
   * @desc для заполнений - высота описанного прямоугольника
   * @type Number
   */
  get height() {
    return this.bounds.height;
  }

  /**
   * @summary Толщина
   * @desc для заполнений и, возможно, профилей в 3D
   * @type Number
   */
  get thickness() {
    return this.inset.thickness(this);
  }

  /**
   * @summary Указатель на спецификацию элемента
   * @desc В большинстве случаев, совпадает со спецификацией слоя
   * @type {CatSpecifications}
   */
  get specification() {
    return this.layer.specification;
  }

  /**
   * @summary Скрытый
   * @desc элемент рисуется полупрозрачным
   * @type Boolean
   */
  get hidden() {
    return this.opacity < 0.5;
  }
  set hidden(v) {
    this.opacity = v ? 0.1 : 1;
    this.guide = Boolean(v);
    if(this.guide && this.selected) {
      this.selected = false;
    }
  }

  /**
   * @summary Видимый
   * @desc элемент нормальной прозрачности
   * @type Boolean
   */
  get shown() {
    return !this.hidden;
  }
  set shown(v) {
    this.hidden = !v;
  }
  
  /**
   * @summary Цвет элемента
   * @type CatClrs
   */
  get clr() {
    if(!this.#raw.clr) {
      this.#raw.clr = this.root.cat.clrs.get();
    }
    return this.#raw.clr;
  }
  set clr(v) {
    const {project, path} = this;
    v = project.root.cat.clrs.get(v);
    if(v !== this.#raw.clr) {
      this.#raw.clr = v;
      project.props.registerChange();
      if(path) {
        path.fillColor = v.color(this);
      }
    }
  }

  get clrIn() {
    return this.clr.clrIn;
  }
  set clrIn(v) {
    const {clr} = this;
    this.clr = $p.cat.clrs.composite_ref('clrIn', clr.clrOut.empty() ? clr : clr.clrOut, v);
  }

  get clrOut() {
    return this.clr.clrOut;
  }
  set clrOut(v) {
    const {clr} = this;
    this.clr = $p.cat.clrs.composite_ref('clrOut', clr.clrIn.empty() ? clr : clr.clrIn, v);
  }

  /**
   * @summary Дополнительные свойства json
   * @type Object
   */
  get dop() {
    return this.#raw.dop;
  }
  set dop(v) {
    this.#raw.dop = v;
  }

  /**
   * @summary Произвольный комментарий
   * @type String
   */
  get note() {
    return this.dop.note || '';
  }
  set note(v) {
    this.dop = {note: v};
  }

  /**
   * @summary Вклад элемента в спецификацию слоя
   */
  calculateSpec() {

  }

  /**
   * @summary Удаляет элемент из иерархии проекта
   */
  remove() {
    const {project, layer} = this;
    super.remove();
    if(layer && !project.props.loading) {
      if(layer.isInserted() && !layer._removing) {
        project.props.registerChange();
        project.root.md.emit_promise('select', {project, elm: null, layer, type: 'layer'});
        project.redraw();
      }
    }
  }
  
}

