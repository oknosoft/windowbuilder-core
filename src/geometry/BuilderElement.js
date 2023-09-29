
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
class BuilderElement extends paper.Group {

  /**
   * @param {Object} attr - объект со свойствами создаваемого элемента
   *  @param {Contour} [attr.layer] - контур (слой), которому принадлежит элемент
   *  @param {BuilderElement} [attr.parent] - контур (слой), которому принадлежит элемент
   *  @param [attr.inset] {CatInserts} -  вставка элемента. если не указано, будет вычислена по типу элемента
   *  @param [attr.path] {paper.Path|Array} (r && arc_ccw && more_180)
   *  @param {paper.Point} [attr.b] - координата узла начала элемента - не путать с координатами вершин пути элемента
   *  @param {paper.Point} attr.e - координата узла конца элемента - не путать с координатами вершин пути элемента
   *  @param {EnmElm_types} [attr.type_el]  может измениться при конструировании. например, импост -> рама
   */
  constructor(attr) {

    super(attr);
    if(attr.parent){
      this.parent = attr.parent;
    }
    else if(attr.proto && attr.proto.parent){
      this.parent = attr.proto.parent;
    }

    if(!attr.row){
      attr.row = this.layer._ox.coordinates.add();
    }

    this._row = attr.row;

    this._attr = {};

    if(!this._row.elm){
      this._row.elm = (attr.elm && typeof attr.elm === 'number') ? attr.elm : this._row._owner.aggregate([], ['elm'], 'max') + 1;
    }

    if(attr._nearest){
      this._attr._nearest = attr._nearest;
      this._attr.binded = true;
      this._attr.simulated = true;
      this._row.elm_type = $p.enm.elm_types.Створка;
    }

    if(attr.proto){

      if(attr.proto.inset){
        this.set_inset(attr.proto.inset, true);
      }

      if(attr.proto instanceof Profile){
        this.insertBelow(attr.proto);
      }

      this.clr = attr.proto.clr;

    }

    if(!this._row.cnstr && this.layer.cnstr){
      this._row.cnstr = this.layer.cnstr;
    }

    if(this._row.elm_type.empty() && !this.inset.empty()){
      this._row.elm_type = this.nom.elm_type;
    }

    this.project.register_change();

    if(this.getView()._countItemEvent) {
      this.on('doubleclick', this.elm_dblclick);
    }

  }

  /**
   * Элемент - владелец
   * имеет смысл для раскладок и рёбер заполнения
   * @type BuilderElement
   */
  get owner() {
    return this._attr.owner;
  }
  set owner(v) {
    this._attr.owner = v;
  }

  /**
   * Примыкающий внешний элемент - имеет смысл для сегментов створок, доборов и рам с внешними соединителями
   * @abstract
   * @return {BuilderElement|void}
   */
  nearest() {}

  /**
   * Образующая
   *
   * прочитать - установить путь образующей. здесь может быть линия, простая дуга или безье
   * по ней будут пересчитаны pathData и прочие свойства
   * @type paper.Path
   */
  get generatrix() {
    return this._attr.generatrix;
  }
  set generatrix(attr) {

    const {_attr} = this;
    const {generatrix} = _attr;
    generatrix.removeSegments();

    this.rays && this.rays.clear();

    if(attr instanceof paper.Path){
      generatrix.addSegments(attr.segments);
    }
    if(Array.isArray(attr)){
      generatrix.addSegments(attr);
    }
    else if(attr.proto &&  attr.p1 &&  attr.p2){

      // сначала, выясняем направление пути
      let tpath = attr.proto;
      if(tpath.getDirectedAngle(attr.ipoint) < 0){
        tpath.reverse();
      }

      // далее, уточняем порядок p1, p2
      let d1 = tpath.getOffsetOf(attr.p1);
      let d2 = tpath.getOffsetOf(attr.p2), d3;
      if(d1 > d2){
        d3 = d2;
        d2 = d1;
        d1 = d3;
      }
      if(d1 > 0){
        tpath = tpath.split(d1);
        d2 = tpath.getOffsetOf(attr.p2);
      }
      if(d2 < tpath.length){
        tpath.split(d2);
      }

      generatrix.remove();
      _attr.generatrix = tpath;
      _attr.generatrix.parent = this;

      if(this.layer && this.layer.parent){
        _attr.generatrix.guide = true;
      }
    }
  }

  /**
   * путь элемента - состоит из кривых, соединяющих вершины элемента
   * для профиля, вершин всегда 4, для заполнений может быть <> 4
   * @type paper.Path
   */
  get path() {
    return this._attr.path;
  }
  set path(attr) {
    if(attr instanceof paper.Path){
      const {_attr} = this;
      _attr.path.removeSegments();
      _attr.path.addSegments(attr.segments);
      if(!_attr.path.closed){
        _attr.path.closePath(true);
      }
    }
  }
  
  /**
   * Виртуальные метаданные для ui
   * @type metadata.Meta
   */
  get _metadata() {
    return {};
  }

  
  /**
   * Виртуальный датаменеджер для ui 
   * @type {metadata.DataManager}
   */
  get _manager() {
    return this.project._manager;
  }

  /**
   * Объект продукции текущего элемеента  
   * может отличаться от продукции текущего проекта
   * @type {CatCharacteristics}
   */
  get ox() {
    const {layer, _row} = this;
    const _ox = layer?._ox;
    if(_ox) {
      return _ox;
    }
    return _row ? _row._owner._owner : {cnn_elmnts: []};
  }

  /**
   * Номенклатура элемента
   * свойство только для чтения, т.к. вычисляется во вставке с учётом текущих параметров и геометрии
   * @final
   * @type CatNom
   */
  get nom() {
    const {_attr} = this;
    if(!_attr.nom) {
      _attr.nom = this.inset.nom(this);
    }
    return _attr.nom;
  }

  /**
   * Номер элемента
   * @final
   * @type {Number}
   */
  get elm() {
    return (this._row && this._row._obj.elm) || 0;
  }

  // информация для редактора свойств
  get info() {
    return "№" + this.elm;
  }

  // виртуальная ссылка
  get ref() {
    const {nom} = this;
    return nom && !nom.empty() ? nom.ref : this.inset.ref;
  }

  // ширина
  get width() {
    return this.nom.width || 80;
  }

  // толщина (для заполнений и, возможно, профилей в 3D)
  get thickness() {
    return this.inset.thickness(this);
  }
  
  /**
   * Опорный размер  
   * рассчитывается таким образом, чтобы имитировать для вложенных изделий профили родителя
   * @type {Number}
   */
  get sizeb() {
  }

  // размер до фурнитурного паза
  get sizefurn() {
    return this.nom.sizefurn || 20;
  }

  // масса элемента
  get weight() {
    let {ox, elm, inset, layer} = this;
    // если элемент оформлен отдельной строкой заказа, массу берём из соседней характеристики
    if(inset.is_order_row_prod({ox, elm: this, contour: layer})) {
      ox = ox.find_create_cx(elm, $p.utils.blank.guid, false);
    }
    return ox.elm_weight(elm);
  }

  /**
   * Примыкающее соединение для диалога свойств
   */
  get cnn3(){
    const cnn_ii = this.selected_cnn_ii();
    return cnn_ii ? cnn_ii.row.cnn : $p.cat.cnns.get();
  }
  set cnn3(v) {
    const cnn_ii = this.selected_cnn_ii();
    if(cnn_ii && cnn_ii.row.cnn != v){
      cnn_ii.row.cnn = v;
      if(this._attr._nearest_cnn){
        this._attr._nearest_cnn = cnn_ii.row.cnn;
      }
      if(this.rays){
        this.rays.clear();
      }
      this.project.register_change();
    }
  }

  // вставка
  get inset() {
    return $p.cat.inserts.get(this._row && this._row._obj.inset);
  }
  set inset(v) {
    this.set_inset(v);
  }

  // цвет элемента
  get clr() {
    return this._row.clr;
  }
  set clr(v) {
    this.set_clr(v);
  }

  get clr_in() {
    return this.clr.clr_in;
  }
  set clr_in(v) {
    const {clr} = this;
    this.clr = $p.cat.clrs.composite_ref('clr_in', clr.clr_out.empty() ? clr : clr.clr_out, v);
  }

  get clr_out() {
    return this.clr.clr_out;
  }
  set clr_out(v) {
    const {clr} = this;
    this.clr = $p.cat.clrs.composite_ref('clr_out', clr.clr_in.empty() ? clr : clr.clr_in, v);
  }

  /**
   * Дополнительные свойства json
   * @type {Object}
   */
  get dop() {
    return this._row.dop;
  }
  set dop(v) {
    this._row.dop = v;
  }

  /**
   * Произвольный комментарий
   * @type {String}
   */
  get note() {
    return this.dop.note || '';
  }
  set note(v) {
    this.dop = {note: v};
  }

  


  /**
   * Сеттер вставки с учетом выделенных элементов
   * @param v {CatInserts}
   * @param [ignore_select] {Boolean}
   */
  set_inset(v, ignore_select) {

  }

  /**
   * Сеттер цвета элемента
   * @param v {CatClrs}
   * @param [ignore_select] {Boolean}
   */
  set_clr(v, ignore_select) {
    
  }
  

  /**
   * Удаляет элемент из контура и иерархии проекта
   * Одновлеменно, удаляет строку из табчасти табчасти _Координаты_ и отключает наблюдателя
   */
  remove() {

    const {parent, project, _row, ox, elm, path} = this;

    if(parent && parent.on_remove_elm) {
      parent.on_remove_elm(this);
    }

    if(path && path.onMouseLeave) {
      path.onMouseEnter = null;
      path.onMouseLeave = null;
    }

    project._scope.eve.emit('elm_removed', this);

    if(_row && _row._owner._owner === ox && !project.ox.empty()){
      ox.params.clear({cnstr: -elm});
      ox.inserts.clear({cnstr: -elm});
      _row._owner.del(_row);
    }

    project.register_change();

    super.remove();
  }
}

