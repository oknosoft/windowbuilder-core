
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
      this._row.elm_type = attr.proto?.elm_type || this.nom.elm_type;
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
    return this.__metadata();
  }
  __metadata(iface) {
    const {fields, tabular_sections} = this.project.ox._metadata();
    const t = this,
      {utils, cat: {inserts, cnns, clrs}, enm: {elm_types,positions, inserts_glass_types, cnn_types}, cch} = $p,
      _xfields = tabular_sections.coordinates.fields,
      inset = Object.assign({}, _xfields.inset),
      arc_h = Object.assign({}, _xfields.r, {synonym: 'Высота дуги'}),
      info = Object.assign({}, fields.note, {synonym: 'Элемент'}),
      cnn1 = Object.assign({}, tabular_sections.cnn_elmnts.fields.cnn, {synonym: 'Соединение 1'}),
      cnn2 = Object.assign({}, cnn1, {synonym: 'Соединение 2'}),
      cnn3 = Object.assign({}, cnn1, {synonym: 'Соед. примыкания'}),
      clr = Object.assign(utils._clone(_xfields.clr), {choice_params: []});

    if(iface !== false) {
      iface = $p.iface;
    }

    function cnn_choice_links(o, cnn_point){

      const nom_cnns = cnns.nom_cnn(t, cnn_point.profile, cnn_point.cnn_types, false, undefined, cnn_point);

      if(!iface || utils.is_data_obj(o)){
        return nom_cnns.some((cnn) => o.ref == cnn);
      }
      else{
        let refs = '';
        nom_cnns.forEach((cnn) => {
          if(refs) {
            refs += ', ';
          }
          refs += `'${cnn.ref}'`;
        });
        return `_t_.ref in (${refs})`;
      }
    }


    // динамические отборы для вставок и соединений
    const {_types_filling} = inserts;

    inset.choice_links = [{
      name: ['selection', 'ref'],
      path: [(o, f) => {
        const {sys} = this.layer;

        let selection;

        if(this instanceof Filling) {
          const {glass_thickness, thicknesses} = sys;

          // !iface - нет dhtmlx, чистый react
          if(!iface || utils.is_data_obj(o)) {
            const insert = inserts.get(o);
            const {insert_type, insert_glass_type} = insert;
            if(_types_filling.includes(insert_type) && (insert_glass_type.empty() || insert_glass_type === inserts_glass_types.Заполнение)) {
              /*разбор параметра glass_thickness*/
              if(glass_thickness === 0) {
                return thicknesses.includes(insert.thickness(this));
              }
              else if(glass_thickness === 1) {
                return sys.glasses({elm: this}).includes(insert);
              }
              else if(glass_thickness === 2) {
                const thickness = insert.thickness(this);
                return thickness >= thicknesses[0] && thickness <= thicknesses[thicknesses.length - 1];
              }
              else if(glass_thickness === 3) {
                return true;
              }
            }
            return false;
          }
          else {
            let refs = '';
            inserts.by_thickness(sys).forEach((o) => {
              if(o.insert_glass_type.empty() || o.insert_glass_type === inserts_glass_types.Заполнение) {
                if(refs) {
                  refs += ', ';
                }
                refs += `'${o.ref}'`;
              }
            });
            return `_t_.ref in (${refs})`;
          }
        }
        else if(this instanceof ProfileConnective) {
          selection = {elm_type: elm_types.Соединитель};
        }
        else if(this instanceof ProfileAddl) {
          selection = {elm_type: elm_types.Добор};
        }
        else if(this instanceof Profile) {
          const {any} = positions;
          if(this.nearest()) {
            selection = {
              pos:{in:[this.pos,any]},
              elm_type: {in: [elm_types.flap, elm_types.flap0, elm_types.Добор]}
            };
          }
          else {
            selection = {pos:{in:[this.pos,any]},
              elm_type: {in: [elm_types.Рама, elm_types.Импост, elm_types.Штульп, elm_types.Добор]}};
          }
        }
        else {
          selection = {elm_type: this.nom.elm_type};
        }

        // !iface - нет dhtmlx, чистый react
        if(!iface || utils.is_data_obj(o)) {
          let ok = false;
          selection.nom = inserts.get(o);
          sys.elmnts.find_rows(selection, (row) => {
            ok = true;
            return false;
          });
          return ok;
        }
        else {
          let refs = '';
          sys.elmnts.find_rows(selection, (row) => {
            if(refs) {
              refs += ', ';
            }
            refs += `'${row.nom.ref}'`;
          });
          return `_t_.ref in (${refs})`;
        }
      }]
    }];

    cnn1.choice_links = [{
      name: ['selection', 'ref'],
      path: [(o, f) => cnn_choice_links(o, this.rays.b)]
    }];

    cnn2.choice_links = [{
      name: ['selection', 'ref'],
      path: [(o, f) => cnn_choice_links(o, this.rays.e)]
    }];

    cnn3.choice_links = [{
      name: ['selection', 'ref'],
      path: [(o) => {
        const cnn_ii = this.selected_cnn_ii();
        let nom_cnns = [utils.blank.guid];

        if(cnn_ii) {
          if(cnn_ii.elm instanceof Filling || this instanceof ProfileAdjoining) {
            nom_cnns = cnns.nom_cnn(cnn_ii.elm, this, cnn_types.acn.ii);
          }
          else if(cnn_ii.elm.elm_type == elm_types.flap && this.elm_type != elm_types.flap) {
            nom_cnns = cnns.nom_cnn(cnn_ii.elm, this, cnn_types.acn.ii);
          }
          else {
            nom_cnns = cnns.nom_cnn(this, cnn_ii.elm, cnn_types.acn.ii);
          }
        }

        if(!iface || utils.is_data_obj(o)) {
          return nom_cnns.some((cnn) => o.ref == cnn);
        }
        else {
          let refs = '';
          nom_cnns.forEach((cnn) => {
            if(refs) {
              refs += ', ';
            }
            refs += `'${cnn.ref}'`;
          });
          return `_t_.ref in (${refs})`;
        }
      }]
    }];

    // дополняем свойства поля цвет отбором по служебным цветам
    clrs.selection_exclude_service(clr, this);

    const mfields = {
      info,
      inset,
      clr,
      x1: _xfields.x1,
      x2: _xfields.x2,
      y1: _xfields.y1,
      y2: _xfields.y2,
      cnn1,
      cnn2,
      cnn3,
      arc_h,
      r: _xfields.r,
      arc_ccw: _xfields.arc_ccw,
      a1: Object.assign({}, _xfields.x1, {synonym: 'Угол 1'}),
      a2: Object.assign({}, _xfields.x1, {synonym: 'Угол 2'}),
      offset: Object.assign({}, _xfields.x1, {synonym: 'Смещение'}),
      region: _xfields.region,
      note: fields.note,
      price: Object.assign({}, tabular_sections.specification.fields.price, {synonym: 'Цена продажи'}),
      first_cost: Object.assign({}, tabular_sections.specification.fields.price, {synonym: 'Себестоимость план'}),
    };

    return {
      fields: new Proxy(mfields, {
        get(target, prop) {
          if(target[prop]) {
            return target[prop];
          }
          const param = cch.properties.get(prop);
          if(param) {
            const mf = {
              type: param.type,
              synonym: param.name,
            };
            if(param.type.types.includes('cat.property_values')) {
              mf.choice_params = [{
                name: 'owner',
                path: param.ref,
              }];
            }
            return mf;
          }
        }
      }),
    };
  }

  
  /**
   * Виртуальный датаменеджер для ui 
   * @type {metadata.DataManager}
   */
  get _manager() {
    return this.project._dp._manager;
  }

  /**
   * @summary Объект продукции текущего элемеента  
   * @desc может отличаться от продукции текущего проекта
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
   * @summary Номенклатура элемента
   * @desc свойство только для чтения, т.к. вычисляется во вставке с учётом текущих параметров и геометрии
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

  /**
   * @summary Толщина элемента
   * @desc для заполнений и, возможно, профилей в 3D
   * @type {Number}
   */
  get thickness() {
    return this.inset.thickness(this);
  }
  
  /**
   * @summary Опорный размер  
   * @desc рассчитывается таким образом, чтобы имитировать для вложенных изделий профили родителя
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
   * Плановая себестоимость единицы хранения в валюте упр. учёта
   * @type {Number}
   */
  get first_cost() {
    return this.dop.first_cost || 0;
  }
  set first_cost(v) {
    this.dop = {first_cost: v};
  }

  /**
   * Плановая цена продажи единицы хранения в валюте упр. учёта
   * @type {Number}
   */
  get price() {
    return this.dop.price || 0;
  }
  set price(v) {
    this.dop = {price: v};
  }

  /**
   * Создаёт-удаляет дополнительные свойства элемента в зависимости от их наличия в системе или параметрах параметра
   * [inset] {CatInserts} - указываем для дополнительных вставок
   * @return {Array}
   */
  elm_props(inset) {
    const {_attr, _row, layer, ox: {params}, rnum} = this;
    const {utils, md, enm: {positions}} = $p;
    const concat = inset || rnum;
    if(!inset) {
      inset = this.inset;
    }

    // получаем список свойств
    const props = [];
    if(this.isInserted()) {
      // свойства, нужные вставке текущего элемента
      const inset_params = inset.used_params();
      const product_params = concat ? inset_params.map((param) => ({param, elm: true})) : layer.sys.product_params;
      for(const {param, elm} of product_params) {
        if (!inset_params.includes(param)) {
          continue;
        }
        // если переопределение явно указано в системе
        if(elm) {
          props.push(param);
        }
        // если переопределение указано в самом параметре
        else if([1, 2].includes(param.inheritance)) {
          // дополнительно учтём тип и положение элемента
          const {elm_type, pos, orientation} = this;
          if(!param.applying.count()) {
            props.push(param);
          }
          else {
            for(const arow of param.applying) {
              if((arow.elm_type.empty() || arow.elm_type == elm_type) &&
                (!arow.pos || arow.pos.empty() || arow.pos === positions.any || arow.pos === pos || arow.pos === orientation)) {
                props.push(param);
                break;
              }
            }
          }
        }
      }

      if(!rnum) {
        // удаляем возможные паразитные свойства
        _attr.props && _attr.props.forEach((prop) => {
          if(!props.includes(prop)) {
            delete this[concat ? concat.ref + prop.ref : prop.ref];
          }
        });
        _attr.props = props;
        // создаём свойства
        props.forEach((prop) => {
          const key = concat ? concat.ref + prop.ref : prop.ref;
          if(!this.hasOwnProperty(key)) {
            Object.defineProperty(this, key, {
              get() {
                let prow;
                params.find_rows({
                  param: prop,
                  cnstr: {in: [0, -_row.row]},
                  inset: concat || utils.blank.guid,
                  region: 0,
                }, (row) => {
                  if(!prow || row.cnstr) {
                    prow = row;
                  }
                });

                if(prow) {
                  return prow.value;
                }
                const type = prop.type.types[0];
                if(type.includes('.')) {
                  const mgr = md.mgr_by_class_name(type);
                  if(mgr) {
                    return mgr.get();
                  }
                }
              },
              set(v) {
                let prow, prow0;
                params.find_rows({
                  param: prop,
                  cnstr: {in: [0, -_row.row]},
                  inset: concat || utils.blank.guid,
                  region: 0,
                }, (row) => {
                  if(row.cnstr) {
                    prow = row;
                  }
                  else {
                    prow0 = row;
                  }
                });
                // если устанавливаемое значение совпадает со значением изделия - удаляем
                if(prow0 && prow0.value == v) {
                  prow && prow._owner.del(prow);
                }
                else if(prow) {
                  prow.value = v;
                }
                else {
                  params.add({
                    param: prop,
                    cnstr: -_row.row,
                    region: 0,
                    inset: concat || utils.blank.guid,
                    value: v,
                  });
                }
                this.refresh_inset_depends(prop, true);
                return true;
              },
              configurable: true,
            });
          }
        });
      }
    }

    return props;
  }

  /**
   * Пересчитывает путь элемента, если изменились параметры, влияющие на основной материал вставки
   * @param param {CchProperties}
   * @param with_neighbor {Boolean} - с учетом примыкающих
   */
  refresh_inset_depends(param, with_neighbor) {

  }

  /**
   * Сеттер вставки с учетом выделенных элементов
   * @param v {CatInserts}
   * @param [ignore_select] {Boolean}
   */
  set_inset(v, ignore_select) {
    const {_row, _attr, project} = this;
    if(_row.inset != v){
      delete _attr.nom;
      _row.inset = v;
      if(_attr && _attr._rays){
        _attr._rays.clear(true);
      }
      project.register_change();
      project._scope.eve.emit('set_inset', this);
    }
  }

  /**
   * Сеттер цвета элемента
   * @param v {CatClrs}
   * @param [ignore_select] {Boolean}
   */
  set_clr(v, ignore_select) {
    const {_row, path, project} = this;
    const {clr_group} = _row.inset;
    let clr = _row.clr._manager.getter(v);

    if(clr.empty() || !clr_group.contains(clr)) {
      const {sys} = this.layer;
      const group = clr_group.empty() ? sys.clr_group : clr_group;
      let {default_clr} = sys;
      if(default_clr.empty() || !group.contains(default_clr)) {
        const clrs = group.clrs();
        if(clrs.length) {
          default_clr = clrs[0];
        }
      }
      clr = default_clr;
    }

    if(clr_group.contains(clr) && _row.clr != clr) {
      _row.clr = clr;
      project.register_change();
    }
    // цвет элементу присваиваем только если он уже нарисован
    if(path instanceof paper.Path){
      path.fillColor = BuilderElement.clr_by_clr.call(this, _row.clr);
    }
  }

  /**
   * Возвращает примыкающий элемент и строку табчасти соединений
   */
  selected_cnn_ii() {
    const {project, elm, ox} = this;
    const items = [];

    for(const item of project.getSelectedItems()) {
      const {parent} = item;
      if(!items.includes(parent) && (parent instanceof ProfileItem || parent instanceof Filling)) {
        items.push(parent);
      }
      else if(item instanceof Filling && !items.includes(item)) {
        items.push(item);
      }
    }

    if(items.length > 1 && items.includes(this)) {
      const nelm = this.nearest();
      const shift = nelm instanceof ProfileVirtual && nelm.nearest();
      const {cat: {cnns}, enm: {cnn_types}} = $p;

      for(const item of items) {
        if(item === this) {
          continue;
        }
        for(const row of ox.cnn_elmnts) {
          if(row.node1 || row.node2) {
            continue;
          }
          if((row.elm1 == elm && row.elm2 == item.elm) || (row.elm1 == item.elm && row.elm2 == elm)) {
            const cnn = (item instanceof Filling || (item.layer.level > this.layer.level)) ?
              cnns.elm_cnn(item, this, cnn_types.acn.ii, row.cnn, false) : cnns.elm_cnn(this, item, cnn_types.acn.ii, row.cnn, false);
            if(cnn !== row.cnn) {
              row.cnn = cnn;
            }
            return {elm: item, row};
          }
          if(shift && row.elm1 == elm && row.elm2 == nelm.elm) {
            row.cnn = item instanceof Filling ?
              cnns.elm_cnn(item, this, cnn_types.acn.ii, row.cnn, false) : cnns.elm_cnn(this, item, cnn_types.acn.ii, row.cnn, false);
            return {elm: nelm, row};
          }
        }
      }
    }
  }

  /**
   * Добавляет информацию об ошибке в спецификацию, если таковой нет для текущего элемента
   * @param nom {CatNom}
   * @param text {String}
   * @param origin {DataObj} - происхождение
   */
  err_spec_row(nom, text, origin) {
    const {job_prm, cat, ProductsBuilding} = $p;
    if(!nom){
      nom = job_prm.nom.info_error;
    }
    const {_ox} = this.layer;
    const row = _ox.specification.find({elm: this.elm, nom}) || ProductsBuilding.new_spec_row({
      elm: this,
      row_base: {clr: cat.clrs.get(), nom},
      spec: _ox.specification,
      ox: _ox,
      origin,
    });
    if(text){
      row.specify = text;
    }
  }

  elm_dblclick(event) {
    this.project._scope.eve.emit('elm_dblclick', this, event);
  }

  static clr_by_clr(clr) {
    let {clr_str, clr_in, clr_out} = clr;
    const {_reflected} = this.project._attr;

    if(_reflected){
      if(!clr_out.empty() && clr_out.clr_str) {
        clr_str = clr_out.clr_str;
      }
    }
    else{
      if(!clr_in.empty() && clr_in.clr_str) {
        clr_str = clr_in.clr_str;
      }
    }

    if(!clr_str) {
      clr_str = this.default_clr_str ? this.default_clr_str : 'fff';
    }

    if(clr_str) {
      clr = clr_str.split(',');
      if(clr.length == 1) {
        if(clr_str[0] != '#') {
          clr_str = '#' + clr_str;
        }
        clr = new paper.Color(clr_str);
        clr.alpha = 0.96;
      }
      else if(clr.length == 4) {
        clr = new paper.Color(clr[0], clr[1], clr[2], clr[3]);
      }
      else if(clr.length == 3) {
        if(this.path && this.path.bounds) {
          clr = new paper.Color({
            stops: [clr[0], clr[1], clr[2]],
            origin: this.path.bounds.bottomLeft,
            destination: this.path.bounds.topRight
          });
        }
        else {
          clr = new paper.Color(clr[0]);
        }
      }
      return clr;
    }
  }
  
  beforeRemove() {
    return true;
  }

  /**
   * Удаляет элемент из контура и иерархии проекта
   * Одновлеменно, удаляет строку из табчасти табчасти _Координаты_ и отключает наблюдателя
   */
  remove() {
    
    if(!this.beforeRemove()) {
      return;
    }
    
    this.detache_wnd && this.detache_wnd();

    const {parent, project, _row, ox, elm, path} = this;

    if(parent && parent.on_remove_elm) {
      parent.on_remove_elm(this);
    }

    if(path && path.onMouseLeave) {
      path.onMouseEnter = null;
      path.onMouseLeave = null;
    }

    project._scope.eve.emit('elm_removed', this);

    if (this.observer){
      project._scope.eve.off(consts.move_points, this.observer);
      delete this.observer;
    }

    if(_row && _row._owner._owner === ox && !project.ox.empty()){
      ox.params.clear({cnstr: -elm});
      ox.inserts.clear({cnstr: -elm});
      _row._owner.del(_row);
    }

    project.register_change();

    super.remove();
  }
}

EditorInvisible.BuilderElement = BuilderElement;
