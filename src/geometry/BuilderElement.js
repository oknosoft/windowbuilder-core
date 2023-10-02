
import paper from 'paper/dist/paper-core';

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
   *  @param {paper.Path|Array} [attr.path] (r && arc_ccw && more_180)
   *  @param {paper.Point} [attr.b] - координата узла начала элемента
   *  @param {paper.Point} [attr.e] - координата узла конца элемента
   *  @param {EnmElmTypes} [attr.elmType]  может измениться при конструировании. например, импост -> рама
   */
  constructor(attr) {
    super(attr);
    if(attr.owner) {
      this.#raw.owner = attr.owner;
    }
    if(this.layer.layer) {
      this.#raw.nearest = null;
    }
    
    if(Array.isArray(attr.path)) {
      
    }
    else if(attr.b && attr.e) {
      this.#raw.generatrix = new paper.Path({
        parent: this,
        segments: [attr.b, attr.e],
        //guide: true,
        strokeColor: 'grey',
        strokeScaling: false,
      })
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
    return this.#raw.nearest;
  }

  /**
   * @summary Образующая
   * @desc Вокруг образующей, строится Путь элемента. Здесь может быть линия, простая дуга или безье
   * @type paper.Path
   */
  get generatrix() {
    return this.#raw.generatrix;
  }
  set generatrix(attr) {
  }

  /**
   * @summary Путь элемента
   * @desc состоит из кривых, соединяющих вершины элемента
   * @type paper.Path
   */
  get path() {
    return this.#raw.path;
  }
  set path(attr) {
  }

  /**
   * @summary Номенклатура элемента
   * @type CatInsets
   */
  get inset() {
    return this.#raw.inset;
  }
  set inset(v) {
    this.#raw.inset = v;
  }

  /**
   * @summary Номенклатура элемента
   * @desc свойство только для чтения, т.к. вычисляется во вставке с учётом текущих параметров и геометрии
   * @final
   * @type CatNom
   */
  get nom() {
    if(!this.#raw.nom) {
      this.#raw.nom = this.inset.nom(this);
    }
    return this.#raw.nom;
  }

  /**
   * @summary Номер элемента
   * @final
   * @type Number
   */
  get elm() {
    return (this.#raw.elm) || this.id || 0;
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
    return `${this.elmType} №${this.elm}`;
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
    return this.nom.width;
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
   * @summary Цвет элемента
   * @type CatClrs
   */
  get clr() {
    return this.#raw.clr;
  }
  set clr(v) {
    this.#raw.clr = v;
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
  
}

