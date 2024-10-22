
exports.CatCharacteristics = class CatCharacteristics extends Object {

  /**
   * @param attr
   * @returns {CatCharacteristics|boolean}
   * перед записью надо пересчитать наименование и рассчитать итоги
   */
  before_save(attr) {

    // уточняем номенклатуру системы
    const {prod_nom, calc_order, params, _data} = this;

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
    
    // масса изделия
    this.weight = this.elm_weight();

    // пересчитываем наименование
    const name = this.prod_name();
    if(name) {
      this.name = name;
    }

    // дублируем контрагента для целей RLS
    this.partner = calc_order.partner;
    
    // сохраним значения сохраняемых параметров
    _data._loading = true;
    for(const prow of params) {
      const { param, cnstr, inset, region } = prow;
      if(param.conserve && param.is_calculated) {
        prow.value = param.calculated_value({ ox: this, cnstr, inset, region });
      }
    }
    _data._loading = false;

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
        const {calc_order_row} = leading_product;
        name += ':' + (calc_order_row ? calc_order_row.row.pad() : '0');
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
          name += '/s:' + this.s.toFixed(3);
        }
        
        if(this.weight){
          name += `/m:${this.weight.toFixed(3)}`;
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
   * Рассчитывает наименование продукции
   */
  prod_name2({elm, cnstr}) {
    const {params, coordinates, x, y, note} = this;
    const main = [];
    const other = [];
    // параметры изделия
    params.find_rows({cnstr: 0, region: 0}, ({param, value}) => {
      if(param.is_calculated || param.predefined_name === 'auto_align') {
        return;
      }
      main.push(value.toString());
    });

    // добавляем размеры
    if(x && y) {
      main.push(x.toFixed(0) + 'x' + y.toFixed(0));
    }
    else if(x) {
      main.push(x.toFixed(0));
    }
    else if(y) {
      main.push(y.toFixed(0));
    }

    // параметры вставки
    params.find_rows({cnstr: -elm, region: 0}, ({param, value}) => {
      if(param.type.types.includes('boolean')) {
        if(value) {
          other.push(param.caption || param.name);
        }
      }
      else if(param.type.types.includes('number')) {
        if(value) {
          other.push(`${param.caption || param.name}: ${value}`);
        }
      }
      else if(value && !value.empty() && value.toString() !== 'Нет') {
        other.push(value.toString());
      }
    });

    // параметры рёбер
    const rrows = [];
    coordinates.find_rows({cnstr, elm_type: 'Рама'}, (rrow) => {
      rrows.push(rrow);
    });
    const rprops = new Set();
    params.find_rows({cnstr: {in: rrows.map((v) => -v.elm)}, region: 0}, ({value}) => {
      if(!value.empty() && value.toString() !== 'Нет') {
        rprops.add(value.toString());
      }
    });
    for(const rp of rprops) {
      other.push(rp);
    }
    if(note) {
      other.push(note);
    }
    
    return {main, other};
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
      if(elm > 0 || !utils.is_empty_guid(origin.valueOf())) {
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

      if(elm > 0 || !utils.is_empty_guid(origin.valueOf())) {
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
    const {sys, params, calc_order, calc_order_row} = this;
    if(!sys.empty()) {

      let setted;

      if(sys.production.count() === 1) {
        this.owner = sys.production.get(0).nom;
      }
      else {
        for(const row of sys.production) {
          if(row.param && !row.param.empty()) {
            if(row.param.check_condition({prm_row: row, ox: this, calc_order})) {
              setted = true;
              this.owner = row.nom;
              break;
            }
          }
        }
        if(!setted) {
          for(const row of sys.production) {
            if(!row.param || row.param.empty()) {
              setted = true;
              this.owner = row.nom;
              break;
            }
          }
        }
        if(!setted) {
          const prow = sys.production.get(0);
          if(prow) {
            this.owner = prow.nom;
          }
        }
      }
    }

    if(calc_order_row && !this.owner.empty() && calc_order_row.nom !== this.owner) {
      calc_order_row.nom = this.owner;
    }

    return this.owner;
  }

  /**
   * @summary Номер изделия по порядку для экранных и печатных форм
   * @type {Number}
   */
  get prod_sequence() {
    const {calc_order, calc_order_row} = this;
    let index = 0;
    if(calc_order_row) {
      for(const {characteristic} of calc_order_row._owner) {
        if(characteristic.coordinates.count() || characteristic.leading_product.calc_order === calc_order) {
          index++;
        }
        if(characteristic === this) {
          break;
        }
      }
    }
    return index;
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
        props[prop] = ((prop === 'onlay_regions') || (typeof tmp[prop] === 'number')) ? tmp[prop] : !!tmp[prop];
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
        return project.save_coordinates(Object.assign({save: true, svg: attr.svg || false}, attr));
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
    const {utils, cch, cat, EditorInvisible} = $p;
    const link = {imgs: {}};

    if(attr.res instanceof Map) {
      attr.res.set(this, link);
    }
    else {
      if(!attr.res) {
        attr.res = {};
      }
      attr.res[utils.snake_ref(this.ref)] = link;
    }
    const {format, keep_editor} = attr;
    
    // загружаем изделие в редактор
    const remove = !editor;
    if(remove) {
      editor = new EditorInvisible();
    }
    const project = editor.create_scheme();

    // если это москитка, полный проект можно не грузить
    if(this.origin?.insert_type?.is?.('mosquito')) {
      const {calc_order, leading_product, leading_elm, origin, x, y} = this;
      // находим импосты и рамки
      let {sz, nom, imposts} = origin.mosquito_props();
      if(!nom) {
        return Promise
          .resolve(keep_editor ? null : (remove ? editor.unload() : project.unload()))
          .then(() => attr.res);
      }

      const ox = this._manager.create({
        calc_order,
        owner: leading_product.owner, 
        sys: leading_product.sys,
        clr: leading_product.clr,
        x: leading_product.x,
        y: leading_product.y,
      }, false, true);
      leading_product.params.find_rows({cnstr: 0}, (row) => ox.params.add(row));
      leading_product.constructions.find_rows({parent: 0}, (row) => ox.cpy_recursive(leading_product, row.cnstr));
      ox._set_loaded(ox.ref);
      
      const irama = cat.inserts.by_nom(nom);
      const lcnn = cat.cnns.by_nom(nom, nom);
      const iimpost = imposts && cat.inserts.by_nom(imposts.nom);
      const tcnn = imposts && cat.cnns.by_nom(imposts.nom, nom, 't');

      return project.load(ox, attr.builder_props || true, calc_order)
        .then(() => {
          project._attr._hide_errors = true;
          const olayer = project.getItem({cnstr: -leading_elm});
          const perimetr = olayer.perimeter_inner(sz, nom);
          const {contours, l_dimensions, l_connective} = project;
          for(const tmp of [l_dimensions, l_connective].concat(contours)) {
            tmp.visible = false;
          }
          const parent = EditorInvisible.Contour.create({project});

          // рисуем контур
          const ppath = new paper.Path({insert: false});
          for(const {sub_path} of perimetr) {
            ppath.addSegments(sub_path.segments);
            new EditorInvisible.Profile({
              layer: parent,
              parent: parent.children.profiles,
              generatrix: sub_path,
              proto: {
                inset: irama,
                clr: this.clr,
              },
            });
          }
          
          // рисуем импосты
          const {bounds} = ppath;
          if(imposts) {
            const add_impost = (y) => {
              
              const impost = new paper.Path({
                insert: false,
                segments: [[bounds.left - 100, y], [bounds.right + 100, y]],
              });
              const {length} = impost;
              for(const {point} of ppath.getIntersections(impost)) {
                const l1 = impost.firstSegment.point.getDistance(point);
                const l2 = impost.lastSegment.point.getDistance(point);
                if (l1 < length / 2) {
                  impost.firstSegment.point = point;
                }
                if (l2 < length / 2) {
                  impost.lastSegment.point = point;
                }
              }
              
              new EditorInvisible.Profile({
                layer: parent,
                parent: parent.children.profiles,
                generatrix: impost,
                proto: {
                  inset: iimpost,
                  clr: this.clr,
                },
              });
            };
            cat.inserts.traverse_steps({
              imposts,
              bounds,
              add_impost, 
              ox: this,
              cnstr: 0, 
              origin: utils.blank.guid,
            });
          }
          parent.redraw();
          if(project.builder_props.auto_lines) {
            parent.l_dimensions.redraw(true);
            const gg = new editor.Group({
              parent: parent.l_dimensions,
              owner_bounds: parent.bounds,
              dimension_bounds: parent.bounds.unite(parent.l_dimensions.bounds),
            });
            const l_right = new EditorInvisible.DimensionLine({
              pos: 'right',
              offset: -120,
              parent: gg,
              project,
              contour: true,
            });
            l_right.redraw();

            const l_bottom = new EditorInvisible.DimensionLine({
              pos: 'bottom',
              offset: -120,
              parent: gg,
              project,
              contour: true,
            });
            l_bottom.redraw(); 
          }
          else {
            parent.l_dimensions.visible = false;
          }
          
          for(const gl of parent.fillings) {
            gl.visible = false;
          }

          // добавляем текст
          const {elm_font_size, font_family} = editor.consts;
          new editor.PointText({
            layer: parent,
            parent: parent.children.text,
            fillColor: 'black',
            fontFamily: font_family,
            fontSize: elm_font_size * 1.2,
            guide: true,
            content: this.origin.presentation,
            point: bounds.bottomLeft.add([nom.width * 1.4, -nom.width * 1.6]),
          });
          
          project.zoom_fit();
          if(Array.isArray(format) ? format.includes('png') : format === 'png') {
            project.view.update();
            link.imgs[`l0`] = project.view.element.toDataURL('image/png').substr(22);
          }
          if(Array.isArray(format) ? format.includes('svg') : (format === 'svg' || !format)) {
            link.imgs[`s0`] = parent.get_svg(attr);
          }
        })
        .catch((err) => {
          return null;
        })
        .then(() => {
          project.ox = '';
          ox.unload();
          return keep_editor ? null : (remove ? editor.unload() : project.unload());
        })
        .then(() => attr.res);
      
    }

    project._attr._regions = attr.regions;
    return project.load(this, attr.builder_props || true)
      .then(() => {
        const {_obj: {glasses, constructions, coordinates}} = this;
        
        // видимость рядов профиля
        // 0, undefined - только контур основных элементов
        // 1 - только контур элементов ряда
        // 2 - и ряд и основной элемент
        if(attr.regions) {
          for(const layer of project.getItems({class: EditorInvisible.Contour})) {
            if(attr.regions === 1) {
              layer.hidden = !(layer instanceof EditorInvisible.ContourRegion);
            }
            else {
              layer.hidden = false;
            }
          }
          project.redraw();
          project.draw_visualization();
        }
        
        // формируем эскиз(ы) в соответствии с attr
        if(attr.elm) {
          const elmnts = Array.isArray(attr.elm) ? attr.elm : [attr.elm];
          for(const elm of elmnts) {
            const item = project.draw_fragment({elm});
            const num = elm > 0 ? `g${elm}` : `l${elm}`;
            if(format === 'png') {
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
            if(format === 'png') {
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
          if(format === 'png') {
            link.imgs[`l0`] = project.view.element.toDataURL('image/png').substring(22);
          }
          else {
            link.imgs[`l0`] = project.get_svg(attr);
          }
          if(attr.glasses !== false) {
            constructions.forEach(({cnstr}) => {
              project.draw_fragment({elm: -cnstr});
              if(format === 'png') {
                link.imgs[`l${cnstr}`] = project.view.element.toDataURL('image/png').substring(22);
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
        return keep_editor ? null : (remove ? editor.unload() : project.unload());
      })
      .then(() => attr.res);
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
   * @param [elmno] {Number|Array|undefined} - номер элемента или массив номеров (с полюсом) или слоя (с минусом)
   * @return {Number}
   */
  elm_weight(elmno) {
    const {coordinates, specification} = this;
    const map = new Map();
    const isArray = Array.isArray(elmno);
    let weight = 0;
    specification.forEach(({elm, nom, totqty}) => {
      // отбрасываем лишние строки
      if(isArray) {
        if(!elmno.includes(elm)) {
          return;
        }
      }
      else if(elmno !== undefined && elm !== elmno) {
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
    if(!isArray && elmno < 0) {
      const contour = {cnstr: -elmno};
      coordinates.find_rows(contour, ({elm, inset}) => {
        if(inset.is_order_row_prod({ox: this, elm: {elm}, contour})) {
          const cx = this.find_create_cx(elm, $p.utils.blank.guid, false);
          weight += cx.elm_weight();
        }
      });
    }
    return weight.round(3);
  }

  /**
   * Выясняет, есть ли в спецификации номенклатура из константы cname
   * @param cname {String}
   * @return {Boolean}
   */
  has_nom(cname) {
    let noms = $p.job_prm.nom[cname];
    let res = false;
    if(noms) {
      if(!Array.isArray(noms)) {
        noms = [noms];
      }
      for(const {nom} of this.specification) {
        if(noms.some((curr) => curr === nom || curr.is_folder && nom._hierarchy(curr))) {
          res = true;
          break;
        }
      }
    }
    return res;
  }

  /**
   * @summary Возвращает Map ошибок из спецификации (при их наличии)
   * @param {Boolean} [checkOnly] - проверять только наличие критических ошибок
   * @return @return {Map<EnmElmTypes, Map>|Boolean} 
   */
  errors(checkOnly = false) {
    const errors = new Map();
    const {elm_types} = $p.enm;
    const err_types = [elm_types.ОшибкаКритическая];
    if(!checkOnly) {
      err_types.push(elm_types.ОшибкаИнфо);
    }
    
    for(const {nom, elm} of this.specification) {
      if(err_types.includes(nom.elm_type)) {
        if(!errors.has(nom.elm_type)){
          errors.set(nom.elm_type, new Map());
        }
        if(checkOnly) {
          break;
        }
        if(!errors.get(nom.elm_type).has(nom)){
          errors.get(nom.elm_type).set(nom, new Set())
        }
        errors.get(nom.elm_type).get(nom).add(elm);
      }
    }
    return checkOnly ? errors.has(elm_types.ОшибкаКритическая) : errors;
  }

  /**
   * Формирует строку индекса слоя cnstr
   * @param cnstr {Number}
   * @return {String}
   */
  hierarchyName(cnstr) {
    const {constructions} = this;
    // строка табчасти конструкций
    const row = constructions.find({cnstr});
    if(!row) {
      return '';
    }
    // найдём все слои нашего уровня
    const rows = constructions.find_rows({parent: row.parent})
      .map((row) => row._row)
      .sort($p.utils.sort('cnstr'));
    let index = (rows.indexOf(row) + 1).toFixed();
    if(row.parent) {
      index = `${this.hierarchyName(row.parent)}.${index}`;
    }
    return index;
  }
  
  get frame() {
    if(!this._data.frame) {
      this._data.frame = new CatCharacteristics.ProductFrame(this);
    }
    return this._data.frame;
  }

  /**
   * Настройки отображения в рисовалке по умолчанию
   * @type {Object}
   * @static
   */
  static builder_props_defaults = {
    auto_lines: true,
    custom_lines: true,
    cnns: true,
    visualization: true,
    txts: true,
    glass_regions: true,
    profile_regions: true,
    rounding: 0,
    mosquito: true,
    jalousie: true,
    grid: 50,
    mirror: false,
    articles: 0,
    glass_numbers: false,
    bw: false,
    mode: 0,
    onlay_regions: '',
  };
}
