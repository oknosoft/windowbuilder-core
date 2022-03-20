
/**
 * ### Модуль объекта справочника ХарактеристикиНоменклатуры
 * Обрботчики событий after_create, after_load, before_save, after_save, value_change
 * Методы выполняются в контексте текущего объекта this = DocObj
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module cat_characteristics
 *
 * Created 16.03.2016
 */

// переопределяем value_mgr
(function({cat: {characteristics, nom}}){
  const {value_mgr} = characteristics.constructor.prototype;
  characteristics.value_mgr = function(_obj, f, mf, array_enabled, v) {
    if(f === 'owner') {
      return nom;
    }
    if(f === 'value' && _obj.param && nom.by_ref[_obj.param]){
      return characteristics;
    }
    return value_mgr.call(characteristics, _obj, f, mf, array_enabled, v);
  };
  characteristics.extra_fields = function() {
    return [];
  };
  characteristics._direct_ram = true;
})($p);

// при старте приложения, загружаем в ОЗУ обычные характеристики (без ссылок на заказы)
!$p.job_prm.is_node && $p.md.once('predefined_elmnts_inited', () => {
  const _mgr = $p.cat.characteristics;

  // грузим характеристики
  ($p.job_prm.use_ram === false ? Promise.resolve() : _mgr.adapter.load_view(_mgr, 'linked', {
    limit: 10000,
    include_docs: true,
    startkey: [$p.utils.blank.guid, 'cat.characteristics'],
    endkey: [$p.utils.blank.guid, 'cat.characteristics\u0fff']
  }))
    .then(() => {
      // и корректируем метаданные формы спецификации с учетом ролей пользователя
      const {current_user} = $p;
      if(current_user && (
          current_user.role_available('СогласованиеРасчетовЗаказов') ||
          current_user.role_available('ИзменениеТехнологическойНСИ') ||
          current_user.role_available('РедактированиеЦен')
        )) {
        return;
      };
      const {form} = _mgr.metadata();
      if(form && form.obj && form.obj.tabular_sections) {
        form.obj.tabular_sections.specification.widths = "50,*,70,*,50,70,70,80,70,70,70,0,0,0";
      }
    });
});

// свойства объекта характеристики
$p.CatCharacteristics = class CatCharacteristics extends $p.CatCharacteristics {

  // перед записью надо пересчитать наименование и рассчитать итоги
  before_save(attr) {

    // уточняем номенклатуру системы
    const {prod_nom, calc_order, _data} = this;

    // контроль прав на запись характеристики
    if(!attr.force && calc_order.is_read_only) {
      _data._err = {
        title: 'Права доступа',
        type: 'alert-error',
        text: `Запрещено изменять заказ в статусе ${calc_order.obj_delivery_state}`
      };
      return false;
    }

    // для шаблонов, ссылка на типовой блок не нужна
    if(calc_order.obj_delivery_state == 'Шаблон' && !this.base_block.empty()) {
      this.base_block = '';
    }

    // пересчитываем наименование
    const name = this.prod_name();
    if(name) {
      this.name = name;
    }

    // дублируем контрагента для целей RLS
    this.partner = calc_order.partner;

    return this;

  }

  // шаблоны читаем из ram
  load(attr = {}) {
    if(this.obj_delivery_state == 'Шаблон') {
      attr.db = this._manager.adapter.db({cachable: 'ram'});
    }
    return super.load(attr);
  }

  // шаблоны сохраняем в базу ram
  save(post, operational, attachments, attr = {}) {
    if(this.obj_delivery_state == 'Шаблон') {
      attr.db = this._manager.adapter.db({cachable: 'ram'});
    }
    return super.save(post, operational, attachments, attr);
  }

  // при удалении строки вставок, удаляем параметры и соединения
  del_row(row) {
    if(row instanceof $p.CatCharacteristicsInsertsRow) {
      const {cnstr, inset, region, _owner} = row;
      const {params, cnn_elmnts} = _owner._owner;
      if(!inset.empty()) {
        params.del({cnstr, inset});
      }
      if(region) {
        params.del({cnstr, region});
        cnn_elmnts.clear(({elm1, node1}) => {
          return elm1 === -cnstr && node1.endsWith(region.toString());
        });
      }
    }
  }

  // при добавлении строки вставок, устанавливаем ряд
  add_row(row, attr) {
    if(row instanceof $p.CatCharacteristicsInsertsRow) {
      if(attr.inset && !attr.region) {
        attr.region = $p.cat.inserts.get(attr.inset).region;
      }
    }
  }

  /**
   * Добавляет параметры вставки, пересчитывает признак hide
   * @param inset
   * @param cnstr
   * @param [blank_inset]
   * @param [region]
   */
  add_inset_params(inset, cnstr, blank_inset, region) {
    const ts_params = this.params;
    const params = new Set();
    const filter = region ? {cnstr, region} : {cnstr, inset: blank_inset || inset};

    ts_params.find_rows(filter, ({param}) => params.add(param));

    const {product_params} = inset;
    inset.used_params().forEach((param) => {
      if((!param.is_calculated || param.show_calculated) && !params.has(param)) {
        const def = product_params.find({param});
        ts_params.add(region ? {cnstr, region, param, value: (def && def.value) || ""} :
          {cnstr, inset: blank_inset || inset, param, value: (def && def.value) || ""});
        params.add(param);
      }
    });

    ts_params.find_rows(filter, (row) => {
      const links = row.param.params_links({grid: {selection: {cnstr}}, obj: row});
      row.hide = links.some((link) => link.hide);
    });
  }

  /**
   * Рассчитывает наименование продукции
   */
  prod_name(short) {
    const {calc_order_row, calc_order, leading_product, sys, clr, origin} = this;
    let name = '';
    if(calc_order_row) {

      if(calc_order.number_internal) {
        name = calc_order.number_internal.trim();
      }
      else {
        // убираем нули из середины номера
        let num0 = calc_order.number_doc, part = '';
        for (let i = 0; i < num0.length; i++) {
          if(isNaN(parseInt(num0[i]))) {
            name += num0[i];
          }
          else {
            break;
          }
        }
        for (let i = num0.length - 1; i > 0; i--) {
          if(isNaN(parseInt(num0[i]))) {
            break;
          }
          part = num0[i] + part;
        }
        name += parseInt(part || 0).toFixed(0);
      }

      name += '/' + calc_order_row.row.pad();

      // для подчиненных, номер строки родителя
      if(!leading_product.empty() && !leading_product.calc_order.empty()) {
        name += ':' + leading_product.calc_order_row.row.pad();
      }

      // добавляем название системы или вставки
      if(!sys.empty()) {
        name += '/' + sys.name;
      }
      else if(origin && !origin.empty()) {
        name += '/' + (origin instanceof $p.DocPurchase_order ? this.note : (origin.name || origin.number_doc));
      }

      if(!short) {

        // добавляем название цвета
        if(!clr.empty()) {
          name += '/' + this.clr.name;
        }

        // добавляем размеры
        if(this.x && this.y) {
          name += '/' + this.x.toFixed(0) + 'x' + this.y.toFixed(0);
        }
        else if(this.x) {
          name += '/' + this.x.toFixed(0);
        }
        else if(this.y) {
          name += '/' + this.y.toFixed(0);
        }

        if(this.z) {
          if(this.x || this.y) {
            name += 'x' + this.z.toFixed(0);
          }
          else {
            name += '/' + this.z.toFixed(0);
          }
        }

        if(this.s) {
          name += '/S:' + this.s.toFixed(3);
        }

        // подмешиваем значения параметров
        let sprm = '';
        this.params.find_rows({cnstr: 0}, ({param, value}) => {
          if(param.include_to_name && sprm.indexOf(String(value)) == -1) {
            sprm && (sprm += ';');
            sprm += String(value);
          }
        });
        if(sprm) {
          name += '|' + sprm;
        }
      }
    }
    return name;
  }

  /**
   * Открывает форму происхождения строки спецификации
   */
  open_origin(row_id) {
    try {
      let {origin} = this.specification.get(row_id);
      if(typeof origin == 'number') {
        origin = this.cnn_elmnts.get(origin - 1).cnn;
      }
      if(!origin || origin.is_new()) {
        return $p.msg.show_msg({
          type: 'alert-warning',
          text: `Пустая ссылка на настройки в строке №${row_id + 1}`,
          title: o.presentation
        });
      }
      origin.form_obj();
    }
    catch (err) {
      $p.record_log(err);
    }
  }

  /**
   * Ищет характеристику в озу, в indexeddb не лезет, если нет в озу - создаёт
   * @param elm {Number} - номер элемента или контура
   * @param [origin] {CatInserts} - порождающая вставка
   * @param [modify] {Boolean} - если false - не изменяем - только поиск
   * @param [_order_rows] {Array} - если указано и есть в массиве - не перезаполняем
   * @return {CatCharacteristics}
   */
  find_create_cx(elm, origin, modify, _order_rows) {
    const {_manager, calc_order, params, inserts} = this;
    const {job_prm, utils, cat} = $p;
    if(!origin) {
      origin = cat.inserts.get();
    }
    let cx;
    _manager.find_rows({leading_product: this, leading_elm: elm, origin}, (obj) => {
      if(!obj._deleted) {
        cx = obj;
        return false;
      }
    });
    if(!cx) {
      cx = cat.characteristics.create({
        calc_order,
        leading_product: this,
        leading_elm: elm,
        origin
      }, false, true)._set_loaded();
    }
    if(_order_rows) {
      if(_order_rows.includes(cx)) {
        return cx;
      }
      _order_rows.push(cx);
      cx.specification.clear();
      if(!cx.calc_order_row) {
        calc_order.production.add({characteristic: cx});
      }
    }

    if(modify !== false) {
      // переносим в cx параметры
      cx.params.clear();
      if(elm > 0) {
        const {length, width} = job_prm.properties;
        params.find_rows({cnstr: -elm, inset: origin}, (row) => {
          if(row.param != length && row.param != width) {
            cx.params.add({param: row.param, value: row.value});
          }
        });
      }
      else {
        params.find_rows({cnstr: 0, inset: origin}, (row) => cx.params.add(row));
      }

      if(elm > 0) {
        // переносим в cx цвет
        inserts.find_rows({cnstr: -elm, inset: origin}, (row) => {
          cx.clr = row.clr;
        });
        cx.name = cx.prod_name();
      }
      else if(utils.is_empty_guid(origin.valueOf())) {
        // если это продукция слоя, переносим в cx всё, что можно
        cx.constructions.clear();
        cx.inserts.clear();
        cx.coordinates.clear();
        cx.glasses.clear();
        cx.cnn_elmnts.clear();
        cx.cpy_recursive(this, -elm);
      }

    }
    return cx;
  }

  /**
   * Копирует табчасти структуры изделия, начиная со слоя cnstr
   * @param src {CatCharacteristics}
   * @param cnstr {Number}
   */
  cpy_recursive(src, cnstr) {
    const {params, inserts, coordinates, cnn_elmnts, glasses} = this;
    this.constructions.add(src.constructions.find({cnstr}));
    src.params.find_rows({cnstr}, (row) => params.add(row));
    src.inserts.find_rows({cnstr}, (row) => inserts.add(row));
    src.coordinates.find_rows({cnstr}, (row) => {
      coordinates.add(row);
      for(const srow of src.cnn_elmnts) {
        if(srow.elm1 === row.elm || srow.elm2 === row.elm) {
          cnn_elmnts.add(srow);
        }
      }
      const grow = src.glasses.find({elm: row.elm});
      grow && this.glasses.add(grow);
    });

    src.constructions.find_rows({parent: cnstr}, (row) => this.cpy_recursive(src, row.cnstr));
  }

  /**
   * Возврвщает строку заказа, которой принадлежит продукция
   */
  get calc_order_row() {
    return this.calc_order.production.find({characteristic: this});
  }

  /**
   * Возвращает номенклатуру продукции по системе
   */
  get prod_nom() {
    const {sys, params, calc_order} = this;
    if(!sys.empty()) {

      let setted;

      if(sys.production.count() === 1) {
        this.owner = sys.production.get(0).nom;
      }
      else {
        sys.production.forEach((row) => {

          if(setted) {
            return false;
          }

          if(row.param && !row.param.empty()) {
            if(row.param.check_condition({prm_row: row, ox: this, calc_order})) {
              setted = true;
              this.owner = row.nom;
              return false;
            }
          }

        });
        if(!setted) {
          sys.production.find_rows({param: $p.utils.blank.guid}, (row) => {
            setted = true;
            this.owner = row.nom;
            return false;
          });
        }
        if(!setted) {
          const prow = sys.production.get(0);
          if(prow) {
            this.owner = prow.nom;
          }
        }
      }
    }

    return this.owner;
  }

  /**
   * Дополнительные свойства изделия для рисовалки
   */
  get builder_props() {
    const defaults = this.constructor.builder_props_defaults;
    const props = {};
    let tmp;
    try {
      tmp = typeof this._obj.builder_props === 'object' ? this._obj.builder_props : JSON.parse(this._obj.builder_props || '{}');
    }
    catch(e) {
      tmp = props;
    }
    for(const prop in defaults){
      if(tmp.hasOwnProperty(prop)) {
        props[prop] = typeof tmp[prop] === 'number' ? tmp[prop] : !!tmp[prop];
      }
      else {
        props[prop] = defaults[prop];
      }
    }
    return props;
  }
  set builder_props(v) {
    if(this.empty()) {
      return;
    }
    let _modified;
    const {_obj, _data} = this;
    const name = 'builder_props';
    const symplify = () => {
      if(typeof v === 'string') {
        v = JSON.parse(v);
      }
      const props = this.builder_props;
      for(const prop in v){
        if(prop < 'a') {
          continue;
        }
        if(props[prop] !== v[prop]) {
          props[prop] = v[prop];
          _modified = true;
        }
      }
      return props;
    };

    if(_data && _data._loading) {
      if(v.length > 200) {
        v = JSON.stringify(symplify());
      }
      _obj[name] = v;
      return;
    }

    if(!_obj[name] || typeof _obj[name] !== 'string'){
      _obj[name] = JSON.stringify(this.constructor.builder_props_defaults);
      _modified = true;
    }

    const props = symplify();
    if(_modified) {
      _obj[name] = JSON.stringify(props);
      this.__notify(name);
    }
  }

  /**
   * Выполняет замену системы, цвета и фурниутры
   * если текущее изделие помечено в обработке
   * @param engine {Scheme|CatInserts} - экземпляр рисовалки или вставки (соответственно, для изделий построителя и параметрика)
   * @param dp {DpBuyers_order} - экземпляр обработки в реквизитах и табчастях которой, правила перезаполнения
   * @return {Scheme|CatInserts}
   */
  apply_props(engine, dp) {
    // если в dp взведён флаг, выполняем подмену
    if(dp && dp.production.find({use: true, characteristic: this})) {
      const {Scheme, Filling, Contour} = $p.EditorInvisible;
      if(engine instanceof Scheme) {
        const {length} = engine._ch;
        // цвет
        if(dp.use_clr && engine._dp.clr !== dp.clr) {
          engine._dp.clr = dp.clr;
          engine._dp_listener(engine._dp, {clr: true});
        }
        // система
        if(dp.use_sys) {
          engine.set_sys(dp.sys);
        }
        // вставки заполнений
        if(dp.use_inset) {
          engine.set_glasses(dp.inset);
        }
        // подмена фурнитуры
        for(const contour of engine.getItems({class: Contour})) {
          const {furn} = contour;
          if(!furn.empty()) {
            dp.sys_furn.find_rows({elm1: furn}, ({elm2}) => {
              if(!elm2.empty() && elm2 !== furn) {
                contour.furn = elm2;
              }
            });
          }
        }
        if(engine._ch.length > length) {
          engine.redraw();
        }
      }
      // подмена параметров - одинаково для рисовалки и параметрика
      dp.product_params.forEach(({param, value, _ch}) => {
        _ch && this.params.find_rows({param}, (row) => {
          row.value = value;
        });
      });
    }
    return engine;
  }

  /**
   * Пересчитывает изделие по тем же правилам, что и визуальная рисовалка
   * @param attr {Object} - параметры пересчёта
   * @param [editor] {EditorInvisible}
   * @param [restore] {Scheme}
   */
  recalc(attr = {}, editor, restore) {

    // сначала, получаем объект заказа и продукции заказа в озу, т.к. пересчет изделия может приводить к пересчету соседних продукций

    // загружаем изделие в редактор
    const remove = !editor;
    if(remove) {
      editor = new $p.EditorInvisible();
    }
    const project = editor.create_scheme();
    return project.load(this, true)
      .then(() => {
        // выполняем пересчет
        return project.save_coordinates(Object.assign({save: true, svg: false}, attr));
      })
      .then(() => {
        project.ox = '';
        return remove ? editor.unload() : project.unload();
      })
      .then(() => {
        restore?.activate();
        return this;
      })
      .catch((err) => {
        restore?.activate();
        throw err;
      });
  }

  /**
   * Рисует изделие или фрагмент изделия в Buffer в соответствии с параметрами attr
   * @param attr
   * @param editor
   */
  draw(attr = {}, editor) {
    const link = {imgs: {}};

    if(attr.res instanceof Map) {
      attr.res.set(this, link);
    }
    else {
      if(!attr.res) {
        attr.res = {};
      }
      attr.res[$p.utils.snake_ref(this.ref)] = link;
    }

    // загружаем изделие в редактор
    const remove = !editor;
    if(remove) {
      editor = new $p.EditorInvisible();
    }
    const project = editor.create_scheme();
    return project.load(this, attr.builder_props || true)
      .then(() => {
        const {_obj: {glasses, constructions, coordinates}} = this;
        // формируем эскиз(ы) в соответствии с attr
        if(attr.elm) {
          const elmnts = Array.isArray(attr.elm) ? attr.elm : [attr.elm];
          for(const elm of elmnts) {
            const item = project.draw_fragment({elm});
            const num = elm > 0 ? `g${elm}` : `l${elm}`;
            if(attr.format === 'png') {
              link.imgs[num] = project.view.element.toDataURL('image/png').substr(22);
            }
            else {
              link.imgs[num] = project.get_svg(attr);
            }
            if(item){
              item.visible = false;
            }
          }
        }
        else if(attr.glasses) {
          link.glasses = glasses.map((glass) => Object.assign({}, glass));
          link.glasses.forEach((row) => {
            const glass = project.draw_fragment({elm: row.elm});
            // подтянем формулу стеклопакета
            if(attr.format === 'png') {
              link.imgs[`g${row.elm}`] = project.view.element.toDataURL('image/png').substr(22);
            }
            else {
              link.imgs[`g${row.elm}`] = project.get_svg(attr);
            }
            if(glass){
              row.formula_long = glass.formula(true);
              glass.visible = false;
            }
          });
        }
        else {
          if(attr.format === 'png') {
            link.imgs[`l0`] = project.view.element.toDataURL('image/png').substr(22);
          }
          else {
            link.imgs[`l0`] = project.get_svg(attr);
          }
          if(attr.glasses !== false) {
            constructions.forEach(({cnstr}) => {
              project.draw_fragment({elm: -cnstr});
              if(attr.format === 'png') {
                link.imgs[`l${cnstr}`] = project.view.element.toDataURL('image/png').substr(22);
              }
              else {
                link.imgs[`l${cnstr}`] = project.get_svg(attr);
              }
            });
          }
        }
      })
      .then(() => {
        project.ox = '';
        if(remove) {
          editor.unload();
        }
        else {
          project.unload();
        }
        return attr.res;
      });
  }

  /**
   * Значение параметра для текущего слоя или вставки
   * @param cnstr
   * @param inset
   * @param param
   * @return {*}
   */
  extract_value({cnstr, inset, param}) {
    const {utils: {blank}, CatNom, cat} = $p;
    const is_nom = param instanceof CatNom;
    inset = inset ? inset.valueOf() : blank.guid;
    param = param ? param.valueOf() : blank.guid;
    if(!Array.isArray(cnstr)) {
      cnstr = [cnstr];
    }
    const row = this.params._obj.find((row) =>
      cnstr.includes(row.cnstr) && (!row.inset && inset === blank.guid || row.inset === inset) && row.param === param);
    return is_nom ? cat.characteristics.get(row && row.value) : row && row.value;
  }

  /**
   * Рассчитывает массу фрагмента изделия
   * @param [elmno] {number} - номер элемента (с полюсом) или слоя (с минусом)
   * @return {number}
   */
  elm_weight(elmno) {
    const {coordinates, specification} = this;
    const map = new Map();
    let weight = 0;
    specification.forEach(({elm, nom, totqty}) => {
      // отбрасываем лишние строки
      if(elmno !== undefined && elm !== elmno) {
        if(elmno < 0 && elm > 0) {
          if(!map.get(elm)) {
            const crow = coordinates.find({elm});
            map.set(elm, crow ? -crow.cnstr : Infinity);
          }
          if(map.get(elm) !== elmno) return;
        }
        else {
          return;
        }
      }
      weight += nom.density * totqty;
    });
    // элементы внутри слоя могут быть вынесены в отдельные строки заказа
    if(elmno < 0) {
      const contour = {cnstr: -elmno};
      coordinates.find_rows(contour, ({elm, inset}) => {
        if(inset.is_order_row_prod({ox: this, elm: {elm}, contour})) {
          const cx = this.find_create_cx(elm, $p.utils.blank.guid, false);
          weight += cx.elm_weight();
        }
      });
    }
    return weight;
  }

};

$p.CatCharacteristics.builder_props_defaults = {
  auto_lines: true,
  custom_lines: true,
  cnns: true,
  visualization: true,
  txts: true,
  rounding: 0,
  mosquito: true,
  jalousie: true,
  grid: 50,
  carcass: false,
  mirror: false,
  articles: 0,
};

// при изменении реквизита табчасти вставок
$p.CatCharacteristicsInsertsRow.prototype.value_change = function (field, type, value) {
  // для вложенных вставок перезаполняем параметры
  if(field == 'inset') {
    if (value != this.inset) {
      const {_owner} = this._owner;
      const {cnstr, region} = this;
      const {blank} = $p.utils;

      //Проверяем дубли вставок (их не должно быть, иначе параметры перезаписываются)
      if (value != blank.guid) {
        const res = _owner.params.find_rows({cnstr, region, inset: value, row: {not: this.row}});
        if (res.length) {
          $p.md.emit('alert', {
            obj: _owner,
            row: this,
            title: $p.msg.data_error,
            type: 'alert-error',
            text: 'Нельзя добавлять две одинаковые вставки в один элемент или слой'
          });
          return false;
        }
      }

      // удаляем параметры старой вставки
      !this.inset.empty() && _owner.params.clear({inset: this.inset, cnstr});

      // устанавливаем значение новой вставки
      this._obj.inset = value.valueOf();

      // устанавливаем ряд по умолчанию
      if(!region && this.inset.region) {
        this._obj.region = this.inset.region;
      }

      // при необходимости, обновим цвет по данным доступных цветов вставки
      this.inset.clr_group.default_clr(this);

      // заполняем параметры по умолчанию
      _owner.add_inset_params(this.inset, cnstr, null, region);
    }
  }
};

// при изменении реквизита табчасти состава заполнения
$p.CatCharacteristicsGlass_specificationRow.prototype.value_change = function (field, type, value) {
  // для вставок состава, перезаполняем параметры
  const {_obj} = this;
  if(field === 'inset' && value != this.inset) {
    _obj.inset = value ? value.valueOf() : $p.utils.blank.guid;
    const {inset, clr, dop, _owner: {_owner}} = this;
    const {product_params} = inset;
    const own_row = _owner.coordinates.find({elm: _obj.elm});
    const own_params = own_row && own_row.inset.product_params;

    const params = {};
    inset.used_params().forEach((param) => {
      if((!param.is_calculated || param.show_calculated)) {
        const def = product_params.find({param}) || (own_params && own_params.find({param}));
        if(def) {
          params[param.valueOf()] = param.fetch_type(def.value);
        }
      }
    });
    const clrs = inset.clr_group.clrs();
    if(clrs.length && !clrs.includes(clr)) {
      _obj.clr = clrs[0].valueOf();
    }
    this.dop = Object.assign(dop, {params});
  }
};

