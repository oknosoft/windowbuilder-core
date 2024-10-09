
/**
 * Изделие
 * - Расширение [paper.Project](http://paperjs.org/reference/project/)
 * - Стандартные слои (layers) - это контуры изделия, в них живут элементы
 * - Размерные линии, фурнитуру и визуализацию располагаем в отдельных слоях
 *
 * @extends paper.Project
 */

class Scheme extends paper.Project {

  /**
   *
   * @param {HTMLCanvasElement} _canvas - канвас, в котором будет размещено изделие
   * @param {paper.PaperScope} _editor - экземпляр редактора
   * @param {boolean} _silent - тихий режим
   */
  constructor(_canvas, _editor, _silent) {

    // создаём объект проекта paperjs
    super(_canvas);

    _editor.project = this;

    const _attr = this._attr = {
      _silent,
      _bounds: null,
      _calc_order_row: null,
      _update_timer: 0,
      _vis_timer: 0,
    };

    // массив с моментами времени изменений изделия
    this._ch = [];

    // массив с функциями, ожидающими redraw
    this._deffer = [];

    // узлы и рёбра
    this._skeleton = new Skeleton(this);

    // объект обработки с табличными частями
    this._dp = $p.dp.buyers_order.create();

    // бит, что мы в браузере
    this.isBrowser = typeof requestAnimationFrame === 'function';

    // биндим redraw
    this.redraw = this.redraw.bind(this);
    
    // служебные слои
    const {l_connective, l_dimensions, l_visualization} = this;

    // начинаем следить за _dp, чтобы обработать изменения цвета и параметров
    if(!_attr._silent) {
      // наблюдатель за изменениями свойств изделия
      this._dp_listener = this._dp_listener.bind(this);
      this._dp._manager.on('update', this._dp_listener);
    }

    // начинаем следить за событиями контуров для перерисовки допвизуализации
    _editor.eve.on('contour_redrawed', () => {
      clearTimeout(_attr._vis_timer);
      _attr._vis_timer = setTimeout(this.draw_visualization.bind(this), 300);
    });

  }

  _insertItem(index, item, _created) {
    if(index === undefined && !_created && (
      item instanceof Contour || item instanceof ConnectiveLayer || item instanceof DimensionLayer 
    )) {
      const {layers} = this;
      const index = layers.indexOf(item);
      if(index > -1 && index < layers.length - 1) {
        layers.splice(index, 1);
        layers.push(item);
        return;
      }
    }
    return super._insertItem(index, item, _created);
  }

  /**
   * Обновляет связи параметров в иерархии слоёв
   * @param contour {Contour}
   * @param [isBrowser] {Boolean}
   */
  refresh_recursive(contour, isBrowser) {
    const {contours, l_dimensions, layer} = contour;
    if(!this._attr._loading) {
      contour.save_coordinates(true);
    }
    isBrowser && contour.refresh_prm_links();
    !layer && l_dimensions.redraw();
    for(const curr of contours) {
      this.refresh_recursive(curr, isBrowser);
    }
  }

  /**
   * Устанавливает цвет всех профилей изделия
   * @param clr {CatClrs}
   */
  set_clr(clr) {
    const {ox, _dp} = this;
    ox._obj.clr = _dp._obj.clr = clr.valueOf();
    if(ox.clr.empty()) {
      return this.check_clr();
    }
    const cache = new Map();
    const {clr: {_manager}, specification}  = ox;
    const {clr_conformity} = _dp.sys;
    this.getItems({class: ProfileItem}).forEach((elm) => {
      if(!(elm instanceof Onlay) && !(elm instanceof ProfileNestedContent)) {
        const region = elm.rnum || 0;
        if(!cache.has(region)) {
          const row = clr_conformity.find({region});
          cache.set(region, row?.clr);
        }
        const conformity = cache.get(region);
        elm.clr = conformity ? _manager.by_predefined(conformity, clr, clr, elm, specification) : clr;
      }
    });
  }

  /**
   * Освежает отбор в метаданных доступных цветов и при необходимости, цвет изделия
   */
  check_clr() {
    const {ox, _dp} = this;
    const {cat, utils} = $p;
    const cmeta = _dp._metadata('clr');
    const clr_group = _dp.sys.find_group(ox);
    const clrs = [...clr_group.clrs()];

    cat.clrs.selection_exclude_service(cmeta, _dp, this);
    let first;
    if(cmeta.choice_params.length > 2) {
      const all = clrs.length ? clrs.splice(0) : cat.clrs;
      for (const clr of all) {
        if(cmeta.choice_params.every(({name, path}) => {
          if(utils._selection(clr, {[name]: path})) {
            if(!first && Array.isArray(path.in)) {
              first = cat.clrs.get(path.in[0]);
            }
            return true;
          }
        })) {
          clrs.push(clr);
        }
      }
    }
    if (!clr_group.contains(ox.clr, clrs) || ox.clr.empty()){
      const {default_clr} = _dp.sys;
      const clr = (default_clr.empty() || !clr_group.contains(default_clr, clrs)) ? (first || clrs[0]) : default_clr;
      if(clr && !clr.empty()) {
        this.set_clr(clr);
      }
    }
  }

  /**
   * наблюдатель за изменениями свойств изделия
   * @param obj
   * @param fields
   * @private
   */
  _dp_listener(obj, fields) {

    const {_attr, ox} = this;

    if(_attr._loading || _attr._snapshot || obj != this._dp) {
      return;
    }

    const scheme_changed_names = ['clr', 'sys'];
    const row_changed_names = ['note', 'quantity', 'discount_percent', 'discount_percent_internal'];

    if(scheme_changed_names.some((name) => fields.hasOwnProperty(name))) {
      // информируем мир об изменениях
      this.notify(this, 'scheme_changed');
      const {_select_template: st} = ox._manager._owner.templates;
      if(st) {
        if(st.sys != obj.sys) {
          st.sys = obj.sys;
        }
        if(st.clr != obj.clr) {
          st.clr = obj.clr;
        }
      }
    }

    if(fields.hasOwnProperty('clr')) {
      this.set_clr(obj.clr);
    }

    if(fields.hasOwnProperty('sys') && !obj.sys.empty()) {

      obj.sys.refill_prm(ox, 0, true, this);

      // cменить на цвет по умолчанию если не входит в список доступных
      this.check_clr();

      // обновляем свойства изделия и створки
      obj._manager.emit_async('rows', obj, {extra_fields: true});

      // информируем контуры о смене системы, чтобы пересчитать материал профилей и заполнений
      this.l_connective.on_sys_changed();
      for (const contour of this.contours) {
        contour.on_sys_changed();
      }

      if(obj.sys != $p.wsql.get_user_param('editor_last_sys')) {
        $p.wsql.set_user_param('editor_last_sys', obj.sys.ref);
      }

      this.register_change(true);
    }

    for (const name of row_changed_names) {
      if(_attr._calc_order_row && fields.hasOwnProperty(name)) {
        _attr._calc_order_row[name] = obj[name];
        this.register_change(true);
      }
    }

  }

  /**
   * устанавливает систему
   * @param sys
   * @param [defaults] {TabularSection}
   * @param [refill] {Boolean}
   */
  set_sys(sys, defaults, refill) {

    const {_dp, ox} = this;

    if(_dp.sys === sys && !defaults) {
      return;
    }

    _dp.sys = sys;
    ox.sys = sys;

    _dp.sys.refill_prm(ox, 0, 1, this, defaults);

    // информируем контуры о смене системы, чтобы пересчитать материал профилей и заполнений
    this.l_connective.on_sys_changed(refill);
    for (const contour of this.contours) {
      contour.on_sys_changed(refill);
    }

    if(ox.clr.empty()) {
      ox.clr = _dp.sys.default_clr;
    }

  }

  /**
   * Меняет вставку прозрачных заполнений
   * @param inset
   */
  set_glasses(inset) {
    const {Заполнение} = $p.enm.elm_types;
    for(const glass of this.getItems({class: Filling})) {
      if(glass.nom.elm_type != Заполнение) {
        glass.set_inset(inset, true);
      }
    }
  }

  /**
   * Устанавливает фурнитуру в створках изделия
   * @param furn {CatFur}
   * @param fprops {Object}
   */
  set_furn(furn, fprops) {
    for (const rama of this.contours) {
      for (const contour of rama.contours) {
        const props = fprops && fprops.get(contour.cnstr);
        if(props || !contour.furn.empty()) {
          contour.furn = props && props.furn ? props.furn : furn;
        }
      }
    }
  }

  /**
   * наблюдатель за изменениями параметров изделия и слоя
   * @param obj
   * @param fields
   * @private
   */
  _papam_listener(obj, fields) {
    const {_attr, _ch, ox, _scope} = this;
    if(_attr._loading || _attr._snapshot) {
      return;
    }
    const is_row = obj._owner === ox.params;
    // запоминаем значения базовых параметров в обработке шаблонов
    if(is_row || (obj === ox && 'params' in fields)) {
      !_ch.length && this.register_change();
      const {job_prm: {builder}, cat: {templates}} = $p;
      const {_select_template: st} = templates;
      if(st && builder.base_props && builder.base_props.includes(obj.param)) {
        let prow = st.params.find({param: obj.param});
        if(!prow) {
          prow = st.params.add({param: obj.param, value: obj.value});
        }
        prow.value = obj.value;
      }
    }
    if(is_row && obj.inset.empty()) {
      for(const contour of this.contours) {
        contour.refresh_inset_depends(obj.param);
      }
    }
    // при смене цвета основы, уточняем цвет изделия
    if(is_row && ox.sys.base_clr === obj.param) {
      this.check_clr();
      _scope?._acc?.props?._grid?.reload();
    }
    // при изменении builder_props, уточняем видимость надписей
    if(obj === ox && 'builder_props' in fields) {
      const {txts} = this.builder_props;
      for(const elm of this.getItems({class: FreeText})) {
        elm.visible = txts;
      }      
    }
    // изменили или удалили вложенную вставку
    if((obj instanceof $p.CatCharacteristicsInsertsRow && 'inset' in fields) || (obj === ox && 'inserts' in fields)) {
      this.register_change(true);
    }
  }

  /**
   * Возвращает соединение между элементами
   * @param elm1
   * @param elm2
   * @return {*}
   */
  elm_cnn(elm1, elm2) {
    const {elm: e1, _row: {_owner: o1}} = elm1;
    const {elm: e2, _row: {_owner: o2}} = elm2;
    if(o1 === o2) {
      const res = o1._owner.cnn_elmnts._obj.find((row) => row.elm1 === e1 && row.elm2 === e2);
      return res && res._row.cnn;
    }
  }

  /**
   * Алиас к табчасти соединений текущей продукции
   */
  get cnns() {
    return this.ox.cnn_elmnts;
  }

  /**
   * ХарактеристикаОбъект текущего изделия
   * @type CatCharacteristics
   */
  get ox() {
    return this._dp.characteristic;
  }
  set ox(v) {
    const {_dp, _attr, _scope} = this;
    let setted;

    // пытаемся отключить обсервер от табчасти
    if(!_attr._silent) {
      if(!this.hasOwnProperty('_papam_listener')){
        this._papam_listener = this._papam_listener.bind(this);
      }
      _dp.characteristic._manager.off('update', this._papam_listener);
      _dp.characteristic._manager.off('rows', this._papam_listener);
    }

    // устанавливаем в _dp характеристику
    _dp.characteristic = v;

    const ox = _dp.characteristic;

    _dp.len = ox.x;
    _dp.height = ox.y;
    _dp.s = ox.s;
    _dp.sys = ox.sys;
    _dp.clr = ox.clr;

    // устанавливаем строку заказа
    _attr._calc_order_row = ox.calc_order_row;

    // устанавливаем в _dp свойства строки заказа
    if(_attr._calc_order_row) {
      'quantity,price_internal,discount_percent_internal,discount_percent,price,amount,amount_internal,note'.split(',').forEach((fld) => _dp[fld] = _attr._calc_order_row[fld]);
    }
    else {
      // TODO: установить режим только просмотр, если не найдена строка заказа
      if(ox.empty()) {
        return;
      }
    }

    // устанавливаем в _dp систему профилей
    if(_dp.sys.empty()) {
      if(ox.owner.empty()) {
        _dp.sys = $p.wsql.get_user_param('editor_last_sys');
        setted = !_dp.sys.empty();
      }
      // иначе, ищем первую подходящую систему
      else {
        $p.cat.production_params.find_rows({is_folder: false}, (o) => {
          if(setted) {
            return false;
          }
          o.production.find_rows({nom: ox.owner}, () => {
            _dp.sys = o;
            setted = true;
            return false;
          });
        });
      }
    }

    // пересчитываем параметры изделия, если изменилась система
    if(setted) {
      _dp.sys.refill_prm(ox, 0, true, this);
    }

    // устанавливаем в _dp цвет по умолчанию
    if(_dp.clr.empty()) {
      _dp.clr = _dp.sys.default_clr;
    }

    // оповещаем о новых слоях и свойствах изделия
    if(!_attr._silent) {
      _scope.eve.emit_async('rows', ox, {constructions: true});
      _dp._manager.emit_async('rows', _dp, {extra_fields: true});

      // начинаем следить за ox, чтобы обработать изменения параметров фурнитуры
      _dp.characteristic._manager.on({
        update: this._papam_listener,
        rows: this._papam_listener,
      });
    }

  }

  /**
   * Допсвойства, например, скрыть размерные линии
   * при рендеринге может переопределяться или объединяться с параметрами рендеринга
   * @type Object
   */
  get builder_props() {
    const {ox, _attr} = this;
    return _attr._builder_props || ox.builder_props;
  }

  /**
   * Методы сдвига узлов и элементов
   * @type Mover
   */
  get mover() {
    return this._scope._mover;
  }

  /**
   * Задаёт режим отрисовки: каркас или полноценный эскиз
   * @param [v] {Boolean}
   */
  set_carcass(v) {
    const contours = this.getItems({class: Contour});
    contours.forEach(({skeleton}) => skeleton.carcass = v);
    this.redraw();
  }

  /**
   * @summary Загружает пользовательские размерные линии
   * @desc Этот код нельзя выполнить внутри load_contour, т.к. линия может ссылаться на элементы разных контуров
   */
  load_dimension_lines() {
    const {Размер, Радиус, Угол} = $p.enm.elm_types;
    this.ox.coordinates.find_rows({elm_type: {in: [Размер, Радиус, Угол]}}, (row) => {
      let layer = this.getItem({cnstr: row.cnstr});
      let Constructor = DimensionLineCustom;
      if(row.elm_type === Радиус) {
        Constructor = DimensionRadius;
      }
      else if(row.elm_type === Угол) {
        Constructor = DimensionAngle;
        layer = this.l_connective;
      }
      layer && new Constructor({
        parent: layer.l_dimensions,
        row: row
      });
    });
  }

  /**
   * Рекурсивно создаёт контуры изделия
   * @param [parent] {Contour}
   */
  load_contour(parent) {
    // создаём семейство конструкций
    this.ox.constructions.find_rows({parent: parent ? parent.cnstr : 0}, (row) => {
      // и вложенные створки
      this.load_contour(Contour.create({project: this, parent, row}));
    });
  }

  /**
   * @summary Читает изделие по ссылке или объекту продукции
   * @desc Выполняет следующую последовательность действий:
   * - Если передана ссылка, получает объект из базы данных
   * - Удаляет все слои и элементы текущего графического контекста
   * - Рекурсивно создаёт контуры изделия по данным табличной части конструкций текущей продукции
   * - Рассчитывает габариты эскиза
   * - Згружает пользовательские размерные линии
   * - Делает начальный снапшот для {{#crossLink "UndoRedo"}}{{/crossLink}}
   * - Рисует автоматические размерные линии
   * - Активирует текущий слой в дереве слоёв
   * - Рисует дополнительные элементы визуализации
   *
   * @param id {String|CatObj} - идентификатор или объект продукции
   * @param [from_service] {Boolean} - вызов произведен из сервиса, визуализацию перерисовываем сразу и делаем дополнительный zoom_fit
   * @param [order] {DocCalc_order}
   * @async
   */
  load(id, from_service, order) {
    const {_attr} = this;
    const _scheme = this;
    const {enm: {elm_types}, cat: {templates, characteristics}, doc, utils} = $p;

    function load_object(o) {

      if(!_scheme._scope) {
        return Promise.resolve();
      }
      _scheme.ox = o;

      // включаем перерисовку
      _attr._opened = true;
      _attr._no_mod = true;
      _attr._bounds = new paper.Rectangle({point: [0, 0], size: [o.x, o.y]});

      // первым делом создаём соединители и опорные линии
      o.coordinates.forEach((row) => {
        if(row.elm_type === elm_types.Соединитель) {
          new ProfileConnective({row, parent: _scheme.l_connective});
        }
        else if(row.elm_type === elm_types.Линия) {
          new BaseLine({row, parent: _scheme.l_connective});
        }
        else if(row.elm_type === elm_types.Сечение) {
          new ProfileCut({row, parent: _scheme.l_connective});
        }
      });

      // если указаны внешние builder_props, установим их для текущего проекта
      if(typeof from_service === 'object') {
        _attr._builder_props = Object.assign({}, o.constructor.builder_props_defaults, from_service);
      }
      else {
        delete _attr._builder_props;
      }

      o = null;

      // создаём семейство конструкций
      _scheme.load_contour(null);

      // перерисовываем каркас
      _scheme.redraw({from_service});

      // ограничиваем список систем в интерфейсе
      !from_service && templates._select_template && templates._select_template.permitted_sys_meta(_scheme.ox);
      _scheme.check_clr();

      // запускаем таймер, чтобы нарисовать размерные линии и визуализацию
      return new Promise((resolve) => {

        _attr._bounds = null;

        // згружаем пользовательские размерные линии
        _scheme.load_dimension_lines();

        setTimeout(() => {

          _attr._bounds = null;
          _scheme.zoom_fit();

          const {_scope} = _scheme;

          // заставляем UndoRedo сделать начальный снапшот, одновременно, обновляем заголовок
          if(!_attr._snapshot) {
            _scope._undo.clear();
            _scope._undo.save_snapshot(_scheme);
            _scope.set_text();
          }

          // регистрируем изменение, чтобы отрисовались размерные линии
          _scheme.register_change(true);

          // виртуальное событие, чтобы активировать слой в дереве слоёв
          if(_scheme.contours.length) {
            _scheme.notify(_scheme.contours[0], 'layer_activated', true);
          }

          delete _attr._loading;

          // при необходимости загружаем типовой блок
          ((_scheme.ox.base_block.empty() || !_scheme.ox.base_block.is_new() || _scheme.ox.obj_delivery_state == 'Шаблон')
            ?
            Promise.resolve()
            :
            _scheme.ox.base_block.load().catch(() => null))
            .then(() => {
              if(_scheme.ox.coordinates.count()) {
                if(_scheme.ox.specification.count() || from_service) {
                  _scheme.draw_visualization();
                  if(from_service){
                    _scheme.zoom_fit();
                    return resolve();
                  }
                }
                else {
                  // если нет спецификации при заполненных координатах, скорее всего, прочитали типовой блок или снапшот - запускаем пересчет
                  $p.products_building.recalc(_scheme, {});
                }
              }
              else {
                if(from_service){
                  return resolve();
                }
                _scope.load_stamp && _scope.load_stamp();
              }
              delete _attr._snapshot;

              (!from_service || !_scheme.ox.specification.count()) && resolve();
            });
        }, 30);
      })
        .then(() => {
          // при необходимости, перезаполним параметры изделия и фурнитуры
          if(_scheme.ox._data.refill_props) {
            _scheme._dp.sys.refill_prm(_scheme.ox, 0, true, _scheme);
            _scheme._scope._acc && _scheme._scope._acc.props.reload();
            delete _scheme.ox._data.refill_props;
          }
          _scheme.notify(_scheme, 'loaded');
        });
    }

    _attr._loading = true;

    if(from_service) {
      _attr._from_service = true;
    }

    this.ox = null;
    this.clear();

    if(utils.is_data_obj(id) && id.calc_order && (order === id.calc_order || !id.calc_order.is_new())) {
      return load_object(id);
    }
    else if(utils.is_guid(id) || utils.is_data_obj(id)) {
      return characteristics.get(id, true, true)
        .then((ox) => {
          return doc.calc_order.get((utils.is_guid(order) || utils.is_data_obj(order)) ? order : ox.calc_order, true, true)
            .then((calc_order) => {
              if(ox.is_new() || (order && ox.calc_order != order)) {
                ox.calc_order = order;
              }
              return calc_order.load_templates();
            })
            .then(() => load_object(ox));
        });
    }
  }

  /**
   * Рисует фрагмент загруженного изделия
   * @param attr {Object}
   * @param [attr.elm] {Number} - Элемент или Контур
   * - = 0, формируется эскиз изделия,
   * - > 0, эскиз элемента (заполнения или палки)
   * - < 0, эскиз контура (рамы или створки)
   * @param [attr.width] {Number} - если указано, эскиз будет вписан в данную ширину (по умолчению - 600px)
   * @param [attr.height] {Number} - если указано, эскиз будет вписан в данную высоту (по умолчению - 600px)
   * @param [attr.sz_lines] {enm.ТипыРазмерныхЛиний} - правила формирования размерных линий (по умолчению - Обычные)
   * @param [attr.txt_cnstr] {Boolean} - выводить текст, привязанный к слоям изделия (по умолчению - Да)
   * @param [attr.txt_elm] {Boolean} - выводить текст, привязанный к элементам (например, формулы заполнений, по умолчению - Да)
   * @param [attr.visualisation] {Boolean} - выводить визуализацию (по умолчению - Да)
   * @param [attr.opening] {Boolean} - выводить направление открывания (по умолчению - Да)
   * @param [attr.select] {Number} - выделить на эскизе элемент по номеру (по умолчению - 0)
   * @param [attr.format] {String} - [svg, png, pdf] - (по умолчению - png)
   * @param [attr.children] {Boolean} - выводить вложенные контуры (по умолчению - Нет)
   */
  draw_fragment(attr = {}) {

    const {l_dimensions, l_connective, _attr} = this;

    // скрываем все слои
    const contours = this.getItems({class: Contour});

    const hide = () => {
      contours.forEach((l) => l.hidden = true);
      l_dimensions.visible = false;
      l_connective.visible = false;
    };

    const transparence = () => {
      contours.forEach((l) => {
        l.opacity = .16;
        l.hide_generatrix();
      });
    };

    let elm;
    _attr.elm_fragment = attr.elm;
    if(attr.elm > 0) {
      elm = this.getItem({class: BuilderElement, elm: attr.elm});
      if(elm) {
        elm.selected = false;
        if(elm.draw_fragment) {
          hide();
          elm.draw_fragment();
        }
        else {
          transparence();
          elm.redraw();
          elm.opacity = 1;
        }
      }
    }
    else if(attr.elm < 0) {
      hide();
      const cnstr = -attr.elm;
      contours.some((l) => {
        if(l.cnstr == cnstr) {
          l.hidden = false;
          l.hide_generatrix();
          if(l instanceof ContourTearing) {
            l.getItems({class: DimensionLineCustom}).forEach(dl => dl.remove());
          }           
          l.l_dimensions.redraw(attr.faltz || true);
          l.zoom_fit();
          return true;
        }
      });
    }
    else {
      const glasses = this.selected_glasses();
      if(glasses.length) {
        attr.elm = glasses[0].elm;
        this.deselectAll();
        if(glasses[0].layer instanceof ContourTearing) {
          attr.elm = -glasses[0].layer.cnstr;
        }
        return this.draw_fragment(attr);
      }
      else {
        const {activeLayer} = this;
        if(activeLayer.cnstr) {
          attr.elm = -activeLayer.cnstr;
          return this.draw_fragment(attr);
        }
      }
    }
    this.view.update();
    return elm;
  }

  reset_fragment() {
    const {l_dimensions, l_connective, _attr, view} = this;

    if(_attr.elm_fragment > 0) {
      const elm = this.getItem({class: BuilderElement, elm: _attr.elm_fragment});
      elm && elm.reset_fragment && elm.reset_fragment();
    }
    _attr.elm_fragment = 0;

    // показываем серытые слои
    const contours = this.getItems({class: Contour});
    contours.forEach((l) => l.hidden = false);
    l_dimensions.visible = true;
    l_connective.visible = true;
    view.update();
    this.zoom_fit();
  }

  /**
   * @summary Перерисовывает все контуры изделия. Не занимается биндингом.
   * @desc Предполагается, что взаимное перемещение профилей уже обработано
   * @param [attr] {Object} - параметры, уточняющие, как перерисовывать
   */
  redraw(attr = {}) {

    const {_attr, _ch, contours, isBrowser, _scope, _deffer} = this;
    const {length} = _ch;

    _attr._opened && !_attr._silent && _scope && isBrowser && requestAnimationFrame(this.redraw);

    if(_attr._lock || !_scope?.eve || (isBrowser && _scope.eve._async?.move_points?.timer)) {
      return;
    }

    if(!_attr._opened || _attr._saving || !length) {
      _deffer.length = 0;
      return;
    }

    if(contours.length) {

      if (_attr.elm_fragment > 0) {
        const elm = this.getItem({class: BuilderElement, elm: _attr.elm_fragment});
        elm && elm.draw_fragment && elm.draw_fragment(true);
      } 
      else {
        // перерисовываем соединительные профили
        this.l_connective.redraw();

        // TODO: обновляем связи параметров изделия
        isBrowser && !_attr._silent && contours[0].refresh_prm_links(true);

        // перерисовываем все контуры
        for (let contour of contours) {
          contour.redraw();
          if (_ch.length > length) {
            return;
          }
        }
      }

      // если перерисованы все контуры, перерисовываем их размерные линии
      _attr._bounds = null;
      contours.forEach((contour) => this.refresh_recursive(contour, isBrowser));
    }
    
    // перерисовываем габаритные размерные линии изделия
    this.draw_sizes();
    if(this.l_connective.isBelow(this.l_dimensions)) {
      this.l_connective.insertAbove(this.l_dimensions);
    }
    if(this.l_visualization.isBelow(this.l_connective)) {
      this.l_visualization.insertAbove(this.l_connective);
    }

    // обновляем изображение на экране
    this.view.update();

    // сбрасываем счетчик изменений
    _ch.length = 0;

    // выполняем отложенные подписки
    for(const deffer of _deffer) {
      deffer(this);
    }
    _deffer.length = 0;
  }

  /**
   * Выясняет, есть ли необработанные изменения
   */
  has_changes() {
    return this._ch.length > 0;
  }

  /**
   * Регистрирует необходимость обновить изображение
   */
  register_update() {
    const {_attr} = this;
    if(_attr._update_timer) {
      clearTimeout(_attr._update_timer);
    }
    // _attr._update_timer = setTimeout(() => {
    //   this.view && this.view.update();
    //   _attr._update_timer = 0;
    // }, 100);
  }

  /**
   * Регистрирует факты изменения элемнтов
   */
  register_change(with_update, deffer) {

    const {_attr, _ch, _deffer} = this;

    if(!_attr._loading) {

      // сбрасываем габариты
      _attr._bounds = null;

      // сбрасываем d0 для всех профилей
      this.getItems({class: Profile}).forEach((p) => {
        delete p._attr.d0;
        delete p._attr.nom;
      });

      // регистрируем изменённость характеристики
      this.ox._data._modified = true;
      this.notify(this, 'scheme_changed');
    }
    _ch.push(Date.now());
    deffer && _deffer.push(deffer);

    if(with_update) {
      this.register_update();
    }
  }

  /**
   * Габариты изделия. Рассчитываются, как объединение габаритов всех слоёв типа Contour
   * @type Rectangle
   */
  get bounds() {
    const {_attr, l_connective} = this;
    if(!_attr._bounds) {
      this.contours.concat([l_connective]).forEach((l) => {
        if(!_attr._bounds) {
          _attr._bounds = l.bounds;
        }
        else {
          _attr._bounds = _attr._bounds.unite(l.bounds);
        }
      });
    }
    return _attr._bounds;
  }

  /**
   * Габариты с учетом пользовательских размерных линий, чтобы рассчитать отступы автолиний
   */
  get dimension_bounds() {
    let {bounds} = this;
    this.getItems({class: DimensionLine}).forEach((dl) => {
      if(dl instanceof DimensionLineCustom || dl._attr.impost || dl._attr.contour) {
        bounds = bounds.unite(dl.bounds);
      }
    });
    this.contours.forEach(({l_visualization}) => {
      const ib = l_visualization.by_insets.bounds;
      if(ib.height && ib.bottom > bounds.bottom) {
        const delta = ib.bottom - bounds.bottom + 10;
        bounds = bounds.unite(
          new paper.Rectangle(bounds.bottomLeft, bounds.bottomRight.add([0, delta < 250 ? delta * 1.1 : delta * 1.2]))
        );
      }
    });
    return bounds;
  }

  /**
   * @summary Габариты эскиза со всеми видимыми дополнениями
   * @desc В свойстве `strokeBounds` учтены все видимые дополнения - размерные линии, визуализация и т.д.
   *
   */
  get strokeBounds() {
    let bounds = this.l_dimensions.strokeBounds.unite(this.l_connective.strokeBounds);
    this.contours.forEach((l) => bounds = bounds.unite(l.strokeBounds));
    return bounds;
  }

  /**
   * Строка табчасти продукция текущего заказа, соответствующая редактируемому изделию
   */
  get _calc_order_row() {
    const {_attr, ox} = this;
    if(!_attr._calc_order_row && !ox.empty()) {
      _attr._calc_order_row = ox.calc_order_row;
    }
    return _attr._calc_order_row;
  }

  /**
   * Отдел абонента текущего изделия
   * По умолчанию, равен отделу абонента автора заказа, но может быть переопределён
   * @type {CatBranches}
   */
  get branch() {
    const {ox} = this;
    const param = $p.job_prm.properties.branch;
    return param ? param.calculated._data._formula({ox}, $p) : ox.calc_order.manager.branch;
  }

  /**
   * Формирует оповещение для тех, кто следит за this._noti
   * @param obj
   * @param [type] {String}
   * @param [fields] {Array}
   */
  notify(obj, type = 'update', fields) {
    if(obj.type) {
      type = obj.type;
    }
    this._scope?.eve?.emit_async?.(type, obj, fields);
  }

  /**
   * Формирует альтернативный связям параметров, список значений системных параметров
   * @param {Object} attr
   * @param {CatProduction_params} [sys]
   * @param {Number} [cnstr]
   * @return {boolean}
   */
  params_links(attr, sys, cnstr) {
    if(!sys) {
      sys = this._dp.sys;
    }
    if(!cnstr) {
      cnstr = 0;
    }
    return Contour.prototype.params_links(attr, sys, cnstr);
  }

  /**
   * Чистит изображение
   */
  clear() {
    const {_attr, _children, l_visualization} = this;
    const pnames = '_bounds,_update_timer,_loading,_snapshot,_silent,_from_service,_regions';
    for (let fld in _attr) {
      if(!pnames.match(fld)) {
        delete _attr[fld];
      }
    }

    l_visualization.clear();
    for (let i = _children.length - 1; i >= 0; i--) {
      if(_children[i] !== l_visualization) {
        _children[i].remove();
      }
    }
      
    //new paper.Layer({project: this});
  }

  /**
   * Деструктор
   */
  unload() {
    const {_dp, _attr, _calc_order_row, _deffer} = this;
    _deffer.length = 0;
    const pnames = ['_loading', '_saving'];
    for (let fld in _attr) {
      if(pnames.includes(fld)) {
        _attr[fld] = true;
      }
      else {
        if(fld === '_vitrazh') {
          _attr[fld].unload();
        }
        delete _attr[fld];
      }
    }

    if(this.hasOwnProperty('_dp_listener')){
      _dp._manager.off('update', this._dp_listener);
      this._dp_listener = null;
    }

    const ox = _dp.characteristic;
    if(this.hasOwnProperty('_papam_listener')){
      ox._manager.off('update', this._papam_listener);
      ox._manager.off('rows', this._papam_listener);
      this._papam_listener = null;
    }
    let revert = Promise.resolve();
    if(ox && ox._modified) {
      if(ox.is_new()) {
        if(_calc_order_row) {
          ox.calc_order.production.del(_calc_order_row);
        }
        ox.unload();
      }
      else {
        revert = revert.then(() => {
          ox._data._loading = false;
          return ox.load();
        });
      }
    }
    this.getItems({class: ContourNested}).forEach(({_ox}) => {
      if(_ox._modified) {
        revert = revert.then(() => {
          _ox._data._loading = false;
          return _ox.load();
        });
      }
    });

    this.remove();
    return revert;
  }

  /**
   * Двигает выделенные точки путей либо все точки выделенных элементов
   * @param {paper.Point} delta - куда и на сколько сдвигать
   * @param {Boolean} [all_points] - указывает, двигать выделенные элементы целиком или только их выделенные узлы
   * @return {void}
   */
  move_points(delta, all_points) {

    const other = [];
    const layers = [];
    const profiles = new Set();
    const selected = new Set();
    const nearests = new Map();
    const {auto_align, _dp} = this;

    // добавляем в selected вложенные створки, совпадающие по узлам с рамами
    for (const item of this.selectedItems) {
      const {parent} = item;
      if(item instanceof paper.Path && parent instanceof GeneratrixElement && !(parent instanceof Sectional)) {
        selected.add(item);
        if(all_points === false) {
          continue;
        }
        if(!nearests.has(parent)) {
          nearests.set(parent, parent.joined_nearests());
        }
        for (const {generatrix} of nearests.get(parent)) {
          let check_selected;
          item.segments.forEach((segm) => {
            if(segm.selected) {
              check_selected = true;
              generatrix.segments.forEach((gs) => {
                if(gs.point.is_nearest(segm.point)) {
                  gs.selected = true;
                  selected.add(generatrix);
                }
              });
            }
          });
          if(!check_selected) {
            //  item.parent.generatrix
            selected.add(generatrix);
          }
        }
      }
      else if(parent instanceof Sectional) {
        selected.add(parent.generatrix);
      }
    }

    const {Импост} = $p.enm.elm_types;
    for (const item of selected) {
      if(!item) {
        continue;
      }
      const {parent, layer} = item;

      if(!profiles.has(parent)) {

        profiles.add(parent);

        if(parent._hatching) {
          parent._hatching.remove();
          parent._hatching = null;
        }

        if(layer instanceof ConnectiveLayer) {
          // двигаем и накапливаем связанные
          other.push.apply(other, parent.move_points(delta, all_points));
        }
        else if(!parent.nearest || !parent.nearest() || parent instanceof ProfileSegment) {

          // автоуравнивание $p.enm.align_types.Геометрически для импостов внешнего слоя
          if(auto_align && parent.elm_type === Импост && !parent.layer.layer && Math.abs(delta.x) > 1) {
            continue;
          }

          let check_selected;
          item.segments.forEach((segm) => {
            if(segm.selected && other.indexOf(segm) != -1) {
              check_selected = !(segm.selected = false);
            }
          });

          // если уже двигали и не осталось ни одного выделенного - выходим
          if(check_selected && !item.segments.some((segm) => segm.selected)) {
            continue;
          }

          // двигаем и накапливаем связанные
          other.push.apply(other, parent.move_points(delta, all_points));

          if(!layers.includes(layer)) {
            layers.push(layer);
            layer.l_dimensions.clear();
          }
        }
      }
      else if(item instanceof Filling) {
        item.purge_paths();
      }
    }

    // при необходимости двигаем импосты
    if(other.length && Math.abs(delta.x) > 1) {
      this.do_align(auto_align, profiles);
    }
    // иначе перерисовываем контуры
    else if(!this._attr._from_service) {
      this.register_change(true);
    }

    _dp._manager.emit_async('update', {}, {x1: true, x2: true, y1: true, y2: true, a1: true, a2: true, cnn1: true, cnn2: true, info: true});

    // TODO: возможно, здесь надо подвигать примыкающие контуры
  }

  /**
   * Сохраняет координаты и пути элементов в табличных частях характеристики
   * @return {Promise}
   */
  save_coordinates(attr = {}) {

    const {_attr, bounds, ox, contours} = this;

    _attr._saving = true;
    ox._data._loading = true;

    // чистим табчасти, которые будут перезаполнены
    const {cnn_nodes} = ProductsBuilding;
    const {inserts} = ox;
    ox.cnn_elmnts.clear(({elm1, node1}) => {
      return cnn_nodes.includes(node1) || !inserts.find_rows({cnstr: -elm1, region: {ne: 0}}).length;
    });
    ox.glasses.clear();

    let res = Promise.resolve();
    const push = (contour) => {
      res = res.then(() => contour.save_coordinates(false, attr.save, attr.close))
    };

    if(bounds) {
      // устанавливаем размеры в характеристике
      ox.x = bounds.width.round();
      ox.y = bounds.height.round();
      ox.s = this.area;

      // вызываем метод save_coordinates в дочерних слоях
      contours.forEach((contour) => {
        if(attr.save && contours.length > 1 && !contour.getItem({class: BuilderElement})) {
          if(this.activeLayer === contour) {
            const other = contours.find((el) => el !== contour);
            other && other.activate();
          }
          contour.remove();
          this._scope.eve.emit_async('rows', ox, {constructions: true});
        }
        else {
          push(contour);
        }
      });

      // вызываем метод save_coordinates в слое соединителей
      push(this.l_connective);
    }
    else {
      ox.x = 0;
      ox.y = 0;
      ox.s = 0;
    }

    // пересчет спецификации и цен
    return res
      .then(() => attr.no_recalc ? this : $p.products_building.recalc(this, attr))
      .catch((err) => {
        const {msg, ui} = $p;
        ui && ui.dialogs.alert({text: err.message, title: msg.bld_title});
        throw err;
      });

  }

  /**
   * @summary Изменяет центр и масштаб, чтобы изделие вписалось в размер окна
   * @desc Используется инструментом _ZoomFit_, вызывается при открытии изделия и после загрузки типового блока
   *
   * return {void}
   */
  zoom_fit(bounds, isNode) {

    if(!bounds) {
      bounds = this.strokeBounds;
    }

    if (bounds) {
      if(!isNode) {
        isNode = $p.wsql.alasql.utils.isNode;
      }
      const space = isNode ? 160 : 320;
      const min = 900;
      let {width, height, center} = bounds;
      if (width < min) {
        width = min;
      }
      if (height < min) {
        height = min;
      }
      width += space;
      height += space;
      const {view} = this;
      const zoom = Math.min(view.viewSize.height / height, view.viewSize.width / width);
      const {scaling} = view._decompose();
      view.scaling = [Math.sign(scaling.x) * zoom, Math.sign(scaling.y) * zoom];

      const dx = view.viewSize.width - width * zoom;
      if(isNode) {
        const dy = view.viewSize.height - height * zoom;
        view.center = center.add([Math.sign(scaling.y) * dx, -Math.sign(scaling.y) * dy]);
      }
      else {
        view.center = center.add([Math.sign(scaling.y) * dx / 2, 50]);
      }
    }
  }

  /**
   * @summary Возвращает строку svg эскиза изделия
   * @desc Вызывается при записи изделия. Полученный эскиз сохраняется во вложении к характеристике
   *
   * @param [attr] {Object} - указывает видимость слоёв и элементов, используется для формирования эскиза части изделия
   */
  get_svg(attr = {}) {
    this.deselectAll();
    const options = attr.export_options || {};
    if(!options.precision) {
      options.precision = 1;
    }
    // в шаблонах скрываем размерные линии
    const hidden = new Set();
    const {sz_lines} = $p.job_prm.builder;
    if(this.ox.calc_order.obj_delivery_state == 'Шаблон' || sz_lines == 'БезРазмеров' || attr.sz_lines == 'БезРазмеров') {
      for(const el of this.getItems({class: DimensionLine})) {
        el.visible = false;
        hidden.add(el);
      }
      for(const el of this.getItems({class: paper.PointText})) {
        el.visible = false;
        hidden.add(el);
      }
      for(const el of this.getItems({class: Contour})) {
        if(el.l_visualization._opening) {
          el.l_visualization._opening.strokeScaling = false;
          el.l_visualization._opening.opacity = 0.8;
          el.l_visualization.by_spec.opacity = 0.5;
        }
      }
      this.zoom_fit();

      const {ownerDocument} = this.view.element;
      if(ownerDocument) {
        options.onExport = function (item, node, options) {
          if(!item.visible) {
            return ownerDocument.createElement('g');
          }
        }
      }
    }
    const svg = this.exportSVG(options);
    const bounds = this.strokeBounds.unite(this.l_dimensions.strokeBounds);

    svg.setAttribute('x', bounds.x);
    svg.setAttribute('y', bounds.y);
    svg.setAttribute('width', bounds.width + 40);
    svg.setAttribute('height', bounds.height);
    svg.querySelector('g').removeAttribute('transform');

    options.onExport = null;
    if(hidden.size) {
      for(const el of hidden) {
        el.visible = true;
      }
      for(const el of this.getItems({class: Contour})) {
        if(el.l_visualization._opening) {
          el.l_visualization._opening.strokeScaling = true;
          el.l_visualization._opening.opacity = 1;
          el.l_visualization.by_spec.opacity = 1;
        }
      }
      this.zoom_fit();
    }

    return svg.outerHTML;
  }

  /**
   * @summary Перезаполняет изделие данными типового блока или снапшота
   * @desc Вызывается, обычно, из формы выбора типового блока, но может быть вызван явно в скриптах тестирования или групповых обработках
   * @param {String|CatObj|Object} obx - идентификатор или объект-основание (характеристика продукции либо снапшот)
   * @param {Boolean} [is_snapshot]
   * @param {Boolean} [no_refill]
   * @param {Boolean} [from_service]
   * @return {Promise}
   */
  load_stamp(obx, is_snapshot, no_refill, from_service) {

    const do_load = (obx) => {

      const {ox} = this;

      // если отложить очитску на потом - получим лажу, т.к. будут стёрты новые хорошие строки
      this.clear();

      // переприсваиваем номенклатуру, цвет и размеры
      const src = Object.assign({_not_set_loaded: true}, is_snapshot ? obx : obx._obj);
      ox._mixin(src, null,
        'ref,name,calc_order,product,leading_product,leading_elm,origin,base_block,note,partner,_not_set_loaded,obj_delivery_state,_rev'.split(','),
        true);
      
      // сохраняем ссылку на типовой блок
      if(!is_snapshot) {
        ox.base_block = (obx.base_block.empty() || obx.base_block.obj_delivery_state.is('Шаблон') ||
          obx.base_block.calc_order.obj_delivery_state.is('Шаблон')) ? obx : obx.base_block;
        if(!no_refill && obx.calc_order.refill_props) {
          ox._data.refill_props = true;
        }
      }

      // параметры составных пакетов
      for(const {elm, inset} of ox.coordinates) {
        if(inset.insert_type.is('Заполнение')) {
          ox.glass_specification.clear({elm});
        }
        else if(inset.insert_type.is('Стеклопакет')) {
          if(!ox.glass_specification.find({elm})) {
            for(const row of inset.specification) {
              row.quantity && ox.glass_specification.add({elm, inset: row.nom});
            }
          }
          else {
            ox.glass_specification.find_rows({elm}, (grow) => {
              grow.default_params({elm, ox, project: {ox}, inset: grow.inset});
            });
          }
        }
      }

      return this.load(ox, from_service)
        .then(() => {
          ox._data._modified = true;
          this.notify(this, 'scheme_changed');
        });

    };

    this._attr._loading = true;

    if(is_snapshot) {
      this._attr._snapshot = true;
      return do_load(obx);
    }
    else {
      const {utils, cat} = $p;
      return (utils.is_data_obj(obx) && obx.constructions.count() ?
        Promise.resolve(obx) :
        cat.characteristics.get(obx, true, true))
        .then(do_load);
    }
  }

  /**
   * Выясняет, надо ли автоуравнивать изделие при сдвиге точек
   * @return {boolean}
   */
  get auto_align() {
    const {calc_order, base_block} = this.ox;
    const {enm: {obj_delivery_states: st}, job_prm: {properties}} = $p;

    if(base_block.empty() || calc_order.obj_delivery_state == st.Шаблон || base_block.calc_order.obj_delivery_state != st.Шаблон) {
      return false;
    }

    let align;
    if(properties.auto_align) {
      base_block.params.find_rows({param: properties.auto_align, cnstr: 0}, (row) => {
        align = row.value;
        return false;
      });
    }
    return align && align != '_' && align;
  }

  /**
   * Уравнивает геометрически или по заполнениям
   * сюда попадаем из move_points, когда меняем габариты
   * @param auto_align {Boolean}
   * @param profiles {Set}
   */
  do_align(auto_align, profiles) {

    if(!auto_align || !profiles.size) {
      return;
    }

    // получаем слои, в которых двигались элементы
    const layers = new Set();
    for (const profile of profiles) {
      profile.layer.fillings && layers.add(profile.layer);
    }

    if(this._attr._align_timer) {
      clearTimeout(this._attr._align_timer);
    }

    this._attr._align_timer = setTimeout(() => {

      this._attr._align_timer = 0;

      // получаем массив заполнений изменённых контуров
      const glasses = [];
      for (const layer of layers) {
        for(const filling of layer.fillings){
          glasses.indexOf(filling) == -1 && glasses.push(filling);
        }
      }

      // TODO: понять, что хотел автор
      // if(auto_align == $p.enm.align_types.ПоЗаполнениям) {
      //
      // }
      this._scope.glass_align('width', glasses);

    }, 100);

  }

  /**
   * @summary Вписывает канвас в указанные размеры
   * @desc Используется при создании проекта и при изменении размеров области редактирования
   *
   * @param w {Number} - ширина, в которую будет вписан канвас
   * @param h {Number} - высота, в которую будет вписан канвас
   */
  resize_canvas(w, h) {
    const {viewSize} = this.view;
    viewSize.width = w;
    viewSize.height = h;
  }

  /**
   * Возвращает массив РАМНЫХ контуров текущего изделия
   * @type Array.<Contour>
   */
  get contours() {
    return this.layers.filter((l) => l instanceof Contour);
  }

  /**
   * @summary Габаритная площадь изделия
   * @desc Сумма габаритных площадей рамных контуров
   *
   * @type Number
   * @final
   */
  get area() {
    const {l_connective, contours} = this;
    return [l_connective].concat(contours).reduce((sum, {area}) => sum + area, 0).round(4);
  }

  /**
   * @summary Площадь изделия с учетом наклонов-изгибов профиля
   * @desc Сумма площадей рамных контуров
   *
   * @type Number
   * @final
   */
  get form_area() {
    return this.contours.reduce((sum, {form_area}) => sum + form_area, 0).round(4);
  }

  /**
   * @summary Цвет текущего изделия
   * @desc По сути, это не свойство, а макрос. При установке, пробегает по всем профилям изделия и присваивает им цвет 
   * @type CatClrs
   */
  get clr() {
    return this.ox.clr;
  }
  set clr(v) {
    this.ox.clr = v;
  }

  /**
   * Служебный слой размерных линий
   * @type DimensionLayer
   * @final
   */
  get l_dimensions() {
    const {_attr} = this;
    if(!_attr.l_dimensions) {
      const {activeLayer} = this;
      _attr.l_dimensions = new DimensionLayer({project: this});
      if(activeLayer instanceof Contour) {
        activeLayer.activate();
      }
    }
    return _attr.l_dimensions;
  }

  /**
   * Служебный слой соединительных профилей
   *
   * @type ConnectiveLayer
   * @final
   */
  get l_connective() {
    const {_attr} = this;
    if(!_attr.l_connective) {
      const {activeLayer} = this;
      _attr.l_connective = new ConnectiveLayer({project: this});
      if(activeLayer instanceof Contour) {
        activeLayer.activate();
      }  
    }
    return _attr.l_connective;
  }

  /**
   * Служебный слой визуализации
   *
   * @type ContourVisualization
   * @final
   */
  get l_visualization() {
    const {layers} = this;
    if(!layers.visualization) {
      const {activeLayer} = this;
      new ContourVisualization({project: this, name: 'visualization'});
      if(activeLayer instanceof Contour) {
        activeLayer.activate();
      }
    }
    return layers.visualization;
  }
  

  /**
   * @summary Создаёт и перерисовавает габаритные линии изделия
   * @desc Отвечает только за габариты изделия
   * Авторазмерные линии контуров и пользовательские размерные линии, контуры рисуют самостоятельно
   *
   */
  draw_sizes() {
    this.l_dimensions.draw_sizes();
  }

  /**
   * Перерисовавает визуализацию контуров изделия
   * @return {void}
   */
  draw_visualization() {
    if(this.view){
      this._scope.activate();
      for (let contour of this.contours) {
        contour.draw_visualization();
      }
      this.view.update();
    }
  }

  /**
   * @summary Вставка по умолчанию
   * @desc Возвращает вставку по умолчанию с учетом свойств системы и положения элемента
   *
   * @param {Object} [attr]
   * @param {BuilderElement} [attr.elm]
   * @param {EnmPositions} [attr.pos] - положение элемента
   * @param {EnmElm_types} [attr.elm_type] - тип элемента
   * @return {Array.<ProfileItem>}
   */
  default_inset(attr) {
    const {positions, elm_types} = $p.enm;
    let rows;
    const sys = attr?.elm?.layer ? attr.elm.layer.sys : this._dp.sys;
    if(!attr.pos) {
      rows = sys.inserts(attr.elm_type, true, attr.elm);
      // если доступна текущая, возвращаем её
      if(attr.inset && rows.some((row) => attr.inset == row)) {
        return attr.inset;
      }
      return rows[0];
    }

    rows = sys.inserts(attr.elm_type, 'rows', attr.elm);

    // если без вариантов, возвращаем без вариантов
    if(rows.length == 1) {
      return rows[0].nom;
    }

    const pos_array = Array.isArray(attr.pos);

    function check_pos(pos) {
      if(pos_array) {
        return attr.pos.some((v) => v == pos);
      }
      return attr.pos == pos;
    }

    // если подходит текущая, возвращаем текущую
    if(pos_array && Array.isArray(attr.elm_type) &&
      attr.pos.includes(positions.ЦентрВертикаль) &&
      rows.find(({pos}) => pos === positions.ЦентрВертикаль) &&
      attr.elm_type.includes(elm_types.СтворкаБИ)) {
      if(attr.inset && rows.some((row) => attr.inset == row.nom && check_pos(row.pos))) {
        return attr.inset;
      }
    }
    else if(attr.inset && rows.some((row) => attr.inset == row.nom && (row.pos === positions.any || check_pos(row.pos)))) {
      return attr.inset;
    }

    let inset;
    // ищем по умолчанию + pos
    rows.some((row) => {
      if(check_pos(row.pos) && row.by_default) {
        return inset = row.nom;
      }
    });
    // ищем по pos без умолчания
    if(!inset) {
      rows.some((row) => {
        if(check_pos(row.pos)) {
          return inset = row.nom;
        }
      });
    }
    // ищем по умолчанию + любое
    if(!inset) {
      rows.some((row) => {
        if(row.by_default && (row.pos == positions.any || row.pos?.empty?.())) {
          return inset = row.nom;
        }
      });
    }
    // ищем любое без умолчаний
    if(!inset) {
      // если не нашлось штульпа, ищем импост
      if(attr.elm_type === elm_types.Штульп) {
        attr.elm_type = elm_types.Импост;
        return this.default_inset(attr);
      }
      rows.some((row) => {
        if(row.pos == positions.any || row.pos?.empty?.()) {
          return inset = row.nom;
        }
      });
    }

    return inset;
  }

  /**
   * @summary Контроль вставки
   * @desc Проверяет, годится ли текущая вставка для данного типа элемента и положения
   * @return {CatInserts}
   */
  check_inset(attr) {
    const inset = attr.inset ? attr.inset : attr.elm.inset;
    const elm_type = attr.elm ? attr.elm.elm_type : attr.elm_type;
    const rows = [];

    // получаем список вставок с той же номенклатурой, что и наша
    let finded;
    this._dp.sys.elmnts.forEach((row) => {
      if((elm_type ? row.elm_type == elm_type : true)) {
        if(row.nom === inset) {
          finded = true;
          return false;
        }
        rows.push(row);
      }
    });

    // TODO: отфильтровать по положению attr.pos

    if(finded) {
      return inset;
    }
    if(rows.length) {
      return rows[0].nom;
    }

  }

  /**
   * Находит точку на примыкающем профиле и проверяет расстояние до неё от текущей точки
   * !! Изменяет res - CnnPoint
   * @param element {Profile} - профиль, расстояние до которого проверяем
   * @param profile {Profile|null} - текущий профиль - используется, чтобы не искать соединения с самим собой
   * TODO: возможно, имеет смысл разрешить змее кусать себя за хвост
   * @param res {CnnPoint} - описание соединения на конце текущего профиля
   * @param point {paper.Point} - точка, окрестность которой анализируем
   * @param check_only {Boolean|String} - указывает, выполнять только проверку или привязывать точку к узлам или профилю или к узлам и профилю
   * @returns {Boolean|void}
   */
  check_distance(element, profile, res, point, check_only) {

    const {elm_types, cnn_types: {acn, av, ah, long}, orientations} = $p.enm;

    let distance, cnns, addls,
      bind_node = typeof check_only == 'string' && check_only.indexOf('node') != -1,
      bind_generatrix = typeof check_only == 'string' ? check_only.indexOf('generatrix') != -1 : check_only,
      node_distance;

    // Проверяет дистанцию в окрестности начала или конца соседнего элемента
    function check_node_distance(node) {
      distance = element[node].getDistance(point)
      if(distance < parseFloat(consts.sticking_l)) {

        if(typeof res.distance == 'number' && res.distance < distance) {
          res.profile = element;
          res.profile_point = node;
          return 1;
        }

        if(check_only === true && res.profile === element && res.cnn && acn.a.includes(res.cnn.cnn_type)) {
          if(res.distance > distance) {
            res.distance = distance;
          }
          res.profile_point = node;
          res.point = point;
          return 2;
        }

        if(profile && (!res.cnn || res.cnn.empty())) {

          // а есть ли подходящее?
          cnns = $p.cat.cnns.nom_cnn(profile, element, acn.a);
          if(!cnns || !cnns.length) {
            return 1;
          }

          // если в точке сходятся 2 профиля текущего контура - ок

          // если сходятся > 2 и разрешены разрывы TODO: учесть не только параллельные

        }
        else if(res.cnn && acn.t.includes(res.cnn.cnn_type)) {
          return 1;
        }

        res.point = bind_node ? element[node] : point;
        res.distance = distance;
        res.profile = element;
        res.profile_point = node;
        res.cnn_types = acn.a;
        if(cnns && cnns.length && !res.cnn) {
          res.cnn = cnns[0];
        }
        // if(cnns && cnns.length && acn.t.includes(cnns[0].cnn_type)) {
        //   res.profile_point = '';
        //   res.cnn_types = acn.t;
        //   if(!res.cnn) {
        //     res.cnn = cnns[0];
        //   }
        // }
        // else {
        //   res.profile_point = node;
        //   res.cnn_types = acn.a;
        // }

        return 2;
      }

    }

    const b = res.profile_point === 'b' ? 'b' : 'e';
    const e = b === 'b' ? 'e' : 'b';

    if(element === profile) {
      if(profile.is_linear()) {
        return;
      }
      else {
        // проверяем другой узел, затем - Т
      }
      return;
    }
    // если мы находимся в окрестности начала соседнего элемента
    else if((node_distance = check_node_distance(b)) || (node_distance = check_node_distance(e))) {
      if(res.cnn_types !== acn.a && res.profile_point){
        res.cnn_types = acn.a;
        res.distance = distance;
      }
      return node_distance == 2 ? false : void(0);
    }

    // это соединение с пустотой или T
    res.profile_point = '';

    // // если возможна привязка к добору, используем её
    // element.addls.forEach(function (addl) {
    // 	gp = addl.generatrix.getNearestPoint(point);
    // 	distance = gp.getDistance(point);
    //
    // 	if(distance < res.distance){
    // 		res.point = addl.rays.outer.getNearestPoint(point);
    // 		res.distance = distance;
    // 		res.point = gp;
    // 		res.profile = addl;
    // 		res.cnn_types = acn.t;
    // 	}
    // });
    // if(res.distance < ((res.is_t || !res.is_l)  ? consts.sticking : consts.sticking_l)){
    // 	return false;
    // }

    // если к доборам не привязались - проверяем профиль
    //const gp = element.generatrix.getNearestPoint(point);
    const gp = element._attr._nearest && (!profile || !profile._attr._nearest) ?
      (element.rays.outer.getNearestPoint(point) || element.generatrix.getNearestPoint(point)) :
      element.generatrix.getNearestPoint(point);
    distance = gp.getDistance(point);

    if(distance < ((res.is_t || !res.is_l) ? consts.sticking : consts.sticking_l)) {

      if(distance < res.distance || bind_generatrix) {
        if(element.d0 != 0 && element.rays.outer) {
          // для вложенных створок и смещенных рам учтём смещение
          res.point = element.rays.outer.getNearestPoint(point);
          res.distance = 0;
        }
        else {
          res.point = gp;
          res.distance = distance;
        }
        res.profile = element;

        const {cnn, parent} = res;
        const {orientation} = parent || {};
        if(cnn && (
          cnn.cnn_type === long ||
          cnn.cnn_type === av && orientation === orientations.vert ||
          cnn.cnn_type === ah && orientation === orientations.hor
        )) {
          ;
        }
        else {
          res.cnn_types = acn.t;
        }
      }
      if(bind_generatrix) {
        return false;
      }
    }
  }

  /**
   * @summary Цвет по умолчанию
   * @desc Возвращает цвет по умолчанию с учетом свойств системы и элемента
   *
   * @param {Object} [attr]
   * @return {CatClrs}
   */
  default_clr(attr) {
    return this.ox.clr;
  }

  /**
   * @summary Выделенные профили
   * @desc Возвращает массив выделенных профилей. Выделенным считаем профиль, у которого выделены `b` и `e` или выделен сам профиль при невыделенных узлах
   *
   * @param {Boolean} [all] - если true, возвращает все выделенные профили. Иначе, только те, которе можно двигать
   * @returns {Array.<ProfileItem>}
   */
  selected_profiles(all) {
    const res = [];
    const {selectedItems} = this;
    const {length} = selectedItems;
    for(const item of selectedItems) {
      const {parent} = item;
      if(parent instanceof ProfileItem) {
        if(all || !item.layer.layer || !parent.nearest || !parent.nearest(true)) {
          if(res.includes(parent)) {
            continue;
          }
          if(length < 2 || !(parent._attr.generatrix.firstSegment.selected ^ parent._attr.generatrix.lastSegment.selected)) {
            res.push(parent);
          }
        }
      }
    }
    return res;
  }

  /**
   * Выделенные заполнения
   *
   * @return {Array.<Filling>}
   */
  selected_glasses() {
    return this.selected_elements.filter((item) => item instanceof Filling);
  }

  /**
   * @summary Выделенный элемент
   * @desc Возвращает первый из найденных выделенных элементов
   *
   * @returns {BuilderElement}
   */
  get selected_elm() {
    const {selected_elements} = this;
    return selected_elements.length && selected_elements[0];
  }

  /**
   * @summary Выделенные элементы
   * @desc Возвращает массив выделенных элементов
   *
   * @returns {Array.<BuilderElement>}
   */
  get selected_elements() {
    const res = new Set();
    for(const item of this.selectedItems) {
      if(item instanceof BuilderElement) {
        res.add(item);
      }
      else if(item.parent instanceof BuilderElement) {
        res.add(item.parent);
      }
    }
    return Array.from(res);
  }

  /**
   * @summary Все профили изделия
   * @type {Array<ProfileItem>}
   */
  get profiles() {
    const {profiles} = this.l_connective;
    for(const contour of this.getItems({class: Contour})) {
      profiles.push(...contour.profiles);
    }
    return profiles;
  }

  /**
   * @summary Все раскладки изделия
   * @type {Array<Onlay>}
   */
  get onlays() {
    const onlays = [];
    for(const contour of this.getItems({class: Contour})) {
      onlays.push(...contour.onlays);
    }
    return onlays;
  }

  /**
   * @summary Ищет точки в выделенных элементах. Если не находит, то во всём проекте
   * @param point {paper.Point}
   * @param [tolerance] {Number}
   * @param [selected_first] {Boolean}
   * @param [with_onlays] {Boolean}
   * @returns {paper.HitItem|void}
   */
  hitPoints(point, tolerance, selected_first, with_onlays) {
    let item, hit;
    let dist = Infinity;

    function check_corns(elm) {
      const corn = elm.corns(point);
      if(corn.dist < dist) {
        dist = corn.dist;
        if(corn.dist < consts.sticking) {
          hit = {
            item: elm.generatrix,
            point: corn.point
          };
        }
      }
    }

    // отдаём предпочтение сегментам выделенных путей
    if(selected_first && selected_first !== 1) {
      this.selectedItems.some((item) => hit = item.hitTest(point, {segments: true, tolerance: tolerance || 8}));
      // если нет в выделенных, ищем во всех
      if(!hit) {
        hit = this.hitTest(point, {segments: true, tolerance: tolerance || 6});
      }
    }
    else {
      const profiles = selected_first === 1 ? this.profiles : this.activeLayer.profiles;
      for (let elm of profiles) {
        check_corns(elm);
        for (let addl of elm.addls) {
          check_corns(addl);
        }
      }
      if(with_onlays) {
        const onlays = selected_first === 1 ? this.onlays : this.activeLayer.onlays;
        for (let elm of onlays) {
          check_corns(elm);
        }
      }
    }

    return hit;
  }

  /**
   * Корневой слой для текущего слоя
   */
  rootLayer(layer) {
    if(!layer) {
      layer = this.activeLayer;
    }
    while (layer.layer) {
      layer = layer.layer;
    }
    return layer;
  }

  /**
   * Снимает выделение со всех узлов всех путей
   * В отличии от deselectAll() сами пути могут оставаться выделенными
   * учитываются узлы всех путей, в том числе и не выделенных
   */
  deselect_all_points(with_items) {
    const res = [];
    this.getItems({class: paper.Path}).forEach((item) => {
      item.segments.forEach((segm) => {
        if(segm.selected) {
          segm.selected = false;
          res.push(segm);
        }
      });
      if(with_items && item.selected) {
        item.selected = false;
        res.push(item);
      }
    });
    return res;
  }

  /**
   * Массив с рёбрами периметра
   */
  get perimeter() {
    let res = [],
      contours = this.contours,
      tmp;

    // если в изделии один рамный контур - просто возвращаем его периметр
    if(contours.length == 1) {
      return contours[0].perimeter;
    }

    // находим самый нижний правый контур

    // бежим по всем контурам, находим примыкания, исключаем их из результата

    return res;
  }

  /**
   * Возвращает массив заполнений изделия
   */
  get glasses() {
    return this.getItems({class: Filling});
  }

  get skeleton() {
    return this._skeleton;
  }

  set skeleton(v) {
    const {_skeleton} = this;
    _skeleton.skeleton = !!v;
  }

  /**
   * Зеркалирует эскиз
   * @param v {undefined|boolean} признак чтения или установки значения
   * @param animate {boolean} признак выполнять ли анимацию зеркалирования
   * @return {boolean}
   */
  async mirror(v) {
    const {_attr, view} = this;
    const {_from_service, _reflected} = _attr;
    if(typeof v === 'undefined') {
      return _reflected;
    }
    v = Boolean(v);
    if(v !== Boolean(_reflected)) {
      const {scaling} = view;
      view.scaling = [-scaling.x, scaling.y];
      _attr._reflected = v;
      for(const layer of this.contours) {
        layer.apply_mirror();
      }
      for(const profile of this.l_connective.profiles) {
        const {clr} = profile;
        if(clr.is_composite()) {
          profile.path.fillColor = BuilderElement.clr_by_clr.call(profile, clr);
        }
      }
      for(const txt of this.getItems({class: paper.PointText})) {
        const {scaling} = txt._decompose();
        txt.scaling = [-scaling.x, scaling.y];
      }
      this.register_change(true);
    }
    this.zoom_fit();
    return _attr._reflected;
  }

  get sketch_view() {
    let {sketch_view} = this._dp.sys;
    const {hinge, out_hinge, inner, outer} = sketch_view._manager;
    if(this._attr._reflected) {
      switch (sketch_view) {
        case hinge:
          return out_hinge;
        case out_hinge:
          return hinge;
        case inner:
          return outer;
        case outer:
          return inner;
      }
    }
    return sketch_view;
  }

}

EditorInvisible.Scheme = Scheme;
