
/**
 * Дополнительные методы справочника Вставки
 *
 * Created 23.12.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2018
 * @author Evgeniy Malyarov
 * @module cat_inserts
 */

// подписываемся на событие после загрузки из pouchdb-ram и готовности предопределенных
(($p) => {

  const {md, cat, enm, cch, dp, utils, adapters: {pouch}, job_prm,
    CatFormulas, CatInsertsSpecificationRow, EditorInvisible} = $p;

  const {inserts_types} = enm;

  if(job_prm.use_ram !== false){
    md.once('predefined_elmnts_inited', () => {
      cat.scheme_settings && cat.scheme_settings.find_schemas('dp.buyers_order.production');
    });
  }

  cat.inserts.__define({

    _types_filling: {
      value: [
        inserts_types.Заполнение,
        inserts_types.Стеклопакет,
      ]
    },

    _types_main: {
      value: [
        inserts_types.Профиль,
        inserts_types.Заполнение,
        inserts_types.Стеклопакет,
      ]
    },

    /**
     * возвращает возможные параметры вставок данного типа
     */
    _prms_by_type: {
      value(insert_type) {
        const prms = new Set();
        this.find_rows({available: true, insert_type}, (inset) => {
          inset.used_params().forEach((param) => {
            !param.is_calculated && prms.add(param);
          });
        });
        return prms;
      }
    },

    ItemData: {
      value: class ItemData {

        constructor(item, Renderer) {

          this.Renderer = Renderer;
          this.count = 0;
          const idata = this;

          // индивидуальные классы строк
          class ItemRow extends $p.DpBuyers_orderProductionRow {

            // корректирует метаданные полей свойств через связи параметров выбора
            tune(ref, mf, column) {

              const {inset} = this;
              const prm = cch.properties.get(ref);

              // удаляем все связи, кроме владельца
              if(mf.choice_params) {
                const adel = new Set();
                for(const choice of mf.choice_params) {
                  if(choice.name !== 'owner' && choice.path != prm) {
                    adel.add(choice);
                  }
                }
                for(const choice of adel) {
                  mf.choice_params.splice(mf.choice_params.indexOf(choice), 1);
                }
              }
              else {
                mf.choice_params = [];
              }

              // если параметр не используется в текущей вставке, делаем ячейку readonly
              const prms = new Set();
              inset.used_params().forEach((param) => {
                !param.is_calculated && prms.add(param);
              });
              mf.read_only = !prms.has(prm);

              // находим связи параметров
              if(!mf.read_only) {
                const links = prm.params_links({grid: {selection: {}}, obj: this});
                const hide = links.some((link) => link.hide);
                if(hide && !mf.read_only) {
                  mf.read_only = true;
                }

                // проверим вхождение значения в доступные и при необходимости изменим
                if(links.length) {
                  // TODO: подумать про установку умолчаний
                  //prm.linked_values(links, this);
                  const filter = {}
                  prm.filter_params_links(filter, null, links);
                  filter.ref && mf.choice_params.push({
                    name: 'ref',
                    path: filter.ref,
                  });
                }

              }
            }

            get_row(param) {
              const {product_params} = this._owner._owner;
              return product_params.find({elm: this.row, param}) || product_params.add({elm: this.row, param});
            }

            value_change(field, type, value) {
              if(field === 'inset') {
                value = cat.inserts.get(value);
                if(value.insert_type == inserts_types.Параметрик) {
                  idata.tune_meta(value, this);
                }
              }
              super.value_change(field, type, value);
            }

            get elm() {
              return this.row;
            }
          }

          this.ProductionRow = ItemRow;

          // отбор по типу вставки
          this.meta = utils._clone(dp.buyers_order.metadata('production'));
          this.meta.fields.inset.choice_params[0].path = item;
          this.meta.fields.inset.disable_clear = true;

          // получаем возможные параметры вставок данного типа
          if(item !== inserts_types.Параметрик) {
            const changed = this.tune_meta(item);
            const {current_user} = $p;
            for(const scheme of changed) {
              if(pouch.local.doc.adapter === 'http' && !scheme.user) {
                current_user && current_user.roles.includes('doc_full') && scheme.save();
              }
              else {
                scheme.save();
              }
            }
          }

        }

        tune_meta(item, prototype) {
          const changed = new Set();
          let params, with_scheme, meta;

          if(!prototype) {
            prototype = this.ProductionRow.prototype;
            params = cat.inserts._prms_by_type(item);
            with_scheme = true;
            meta = this.meta;
          }
          else {
            params = new Set();
            item.product_params.forEach(({param}) => params.add(param));
            if(!prototype._meta) {
              Object.defineProperty(prototype, '_meta', {value: utils._clone(this.meta)});
            }
            meta = prototype._meta;
          }

          // прибиваем лишние параметры прежней вставки
          if(!with_scheme) {
            for(const fld in prototype) {
              if(utils.is_guid(fld) && !Array.from(params).some(({ref}) => ref === fld)) {
                delete prototype[fld];
                delete meta.fields[fld];
                if(prototype._owner && prototype._owner._owner) {
                  const {product_params} = prototype._owner._owner;
                  for(const rm of product_params.find_rows({elm: prototype.row, fld})) {
                    product_params.del(rm);
                  }
                }
              }
            }
          }

          for (const param of params) {

            // корректируем схему
            if(with_scheme) {
              cat.scheme_settings.find_rows({obj: 'dp.buyers_order.production', name: item.name}, (scheme) => {
                if(!scheme.fields.find({field: param.ref})) {
                  // добавляем строку с новым полем
                  const row = scheme.fields.add({
                    field: param.ref,
                    caption: param.caption,
                    use: true,
                  });
                  const note = scheme.fields.find({field: 'note'});
                  note && scheme.fields.swap(row, note);

                  changed.add(scheme);
                }
              });
            }

            // корректируем метаданные
            if(!meta.fields[param.ref]) {
              meta.fields[param.ref] = {
                synonym: param.caption,
                type: param.type,
              };
            }
            const mf = meta.fields[param.ref];

            // специальный редактор поля
            if(param.Editor) {
              mf.Editor = param.Editor;
            }

            // отбор по владельцу
            if(param.type.types.some(type => type === 'cat.property_values')) {
              mf.choice_params = [{name: 'owner', path: param}];
            }

            // учтём дискретный ряд
            const drow = item.product_params && item.product_params.find({param});
            if(drow && drow.list) {
              try{
                mf.list = JSON.parse(drow.list);
              }
              catch (e) {
                delete mf.list;
              }
            }
            else {
              delete mf.list;
            }

            // корректируем класс строки
            if(!prototype.hasOwnProperty(param.ref)){
              Object.defineProperty(prototype, param.ref, {
                get() {
                  const prow = this.get_row(param);
                  return param.hasOwnProperty('extract_pvalue') ? param.extract_pvalue({prow}) : prow.value;
                },
                set(value) {
                  const prow = this.get_row(param);
                  if(param.hasOwnProperty('set_pvalue')) {
                    param.set_pvalue({prow, value});
                  }
                  else {
                    prow.value = value;
                  }
                },
                configurable: true,
                enumerable: true,
              });
            }
          }

          return changed;
        }

      }
    },

    /**
     * Возвращает массив заполнений в заданном диапазоне толщин
     * @param min {Number|Array|CatProduction_params}
     * @param max {Number|undefined}
     * @return {Array.<CatInserts>}
     */
    by_thickness: {
      value(min, max) {
        const res = [];

        if(!this._by_thickness) {
          this._by_thickness = new Map();
          this.find_rows({insert_type: {in: this._types_filling}, _top: 10000}, (ins) => {
            const thickness = ins.thickness();
            if(thickness) {
              if(!this._by_thickness.has(thickness)) {
                this._by_thickness.set(thickness, []);
              }
              this._by_thickness.get(thickness).push(ins);
            }
          });
        }

        if(min instanceof $p.CatProduction_params) {
          const {thicknesses, glass_thickness} = min;
          max = 0;

          if(glass_thickness === 0) {
            min = thicknesses;
          }
          else if(glass_thickness === 1) {
            const {Заполнение, Стекло} = $p.enm.elm_types;
            min.elmnts.find_rows({elm_type: {in: [Заполнение, Стекло]}}, ({nom}) => res.push(nom));
            return res;
          }
          else if(glass_thickness === 2) {
            const min_in_sys = thicknesses[0];
            const max_in_sys = thicknesses[thicknesses.length - 1];
            for (const [thin, arr] of this._by_thickness) {
              if(thin >= min_in_sys && thin <= max_in_sys) {
                Array.prototype.push.apply(res, arr);
              }
            }
            return res;
          }
          else if(glass_thickness === 3) {
            for (const obj of this._by_thickness) {
              Array.prototype.push.apply(res, obj[1]);
            }
            return res;
          }
        }

        for (const [thin, arr] of this._by_thickness) {
          if(!max && Array.isArray(min)) {
            if(min.includes(thin)) {
              Array.prototype.push.apply(res, arr);
            }
          }
          else {
            if(thin >= min && thin <= max) {
              Array.prototype.push.apply(res, arr);
            }
          }
        }

        return res;
      }
    },

    sql_selection_list_flds: {
      value(initial_value) {
        return "SELECT _t_.ref, _t_.`_deleted`, _t_.is_folder, _t_.id,_t_.note as note,_t_.priority as priority ,_t_.name as presentation, _k_.synonym as insert_type," +
          " case when _t_.ref = '" + initial_value + "' then 0 else 1 end as is_initial_value FROM cat_inserts AS _t_" +
          " left outer join enm_inserts_types as _k_ on _k_.ref = _t_.insert_type %3 ORDER BY is_initial_value, priority desc, presentation LIMIT 2000 ";
      }
    },

    sql_selection_where_flds: {
      value(filter){
        return ` OR _t_.note LIKE '${filter}' OR _t_.id LIKE '${filter}' OR _t_.name LIKE '${filter}'`;
      }
    },

  });

  cat.inserts.metadata('specification').index = 'is_main_elm';

  // переопределяем прототип
  class CatInserts extends $p.CatInserts {

    /**
     * Возвращает строки спецификации основной номенклатуры
     * @param [elm] {BuilderElement}
     * @param [strict] {Boolean}
     * @return {Array.<CatInsertsSpecificationRow>}
     */
    main_rows(elm, strict) {

      const {_data} = this;
      let main_rows;

      if(strict) {
        if(!_data.main_rows_strict) {
          _data.main_rows_strict = this.specification._obj.filter(({is_main_elm}) => is_main_elm).map(({_row}) => _row);
        }
        main_rows = _data.main_rows_strict;
      }
      else {
        if(!_data.main_rows) {
          _data.main_rows = this.specification._obj.filter(({is_main_elm}) => is_main_elm).map(({_row}) => _row);
          if(!_data.main_rows.length && this.specification.count()){
            _data.main_rows.push(this.specification.get(0));
          }
        }
        main_rows = _data.main_rows;
      }

      if(!elm || main_rows.length < 2) {
        return main_rows;
      }
      const {check_params} = ProductsBuilding;
      const ox = elm.prm_ox || elm.ox;
      return main_rows.filter((row) => {
        return this.check_base_restrictions(row, elm) && check_params({
          params: this.selection_params,
          ox,
          elm,
          row_spec: row,
          cnstr: 0,
          origin: elm.fake_origin || 0,
        });
      });
    }

    /**
     * Выясняет, зависит ли номенклатура вставки от текущего параметра
     * @param param {CchProperties}
     * @return {Boolean}
     */
    is_depend_of(param) {
      const {_data: {main_rows}, selection_params} = this;
      if(!main_rows || main_rows.length === 1) {
        return false;
      }
      for(const row of main_rows) {
        if(selection_params.find({elm: row.elm, param: param.ref})) {
          return true;
        }
      }
    }

    /**
     * Выясняет, надо ли вытягивать данную вставку в продукцию
     *
     * @example
     * // Пример формулы:
     * let {elm, contour} = obj;
     * if(!contour && elm) {
     *  contour = elm.layer;
     * }
     * const {specification_order_row_types: types} = $p.enm;
     * return contour ? types.Продукция : types.Нет;
     *
     * @param ox {CatCharacteristics}
     * @param elm {BuilderElement}
     * @param [contour] {Contour}
     * @return {Boolean}
     */
    is_order_row_prod({ox, elm, contour}) {
      const {Продукция} = enm.specification_order_row_types;
      const {params} = ox;
      let {is_order_row, insert_type, _manager: {_types_filling}} = this;

      // заполнения в продукцию не выносим, если бит "без заполнений"
      if(_types_filling.includes(insert_type)) {
        const param = cch.properties.predefined('without_glasses');
        if(param && params?.find({cnstr: 0, param})?.value) {
          return false;
        }
      }

      if(_types_filling.includes(insert_type)) {
        const param = cch.properties.predefined('glass_separately');
        param && params?.find_rows({param}, ({cnstr, value}) => {
          if(elm && (cnstr === -elm.elm)) {
            is_order_row = value ? Продукция : '';
            return false;
          }
          if(!cnstr || (contour && cnstr === contour.cnstr)) {
            is_order_row = value ? Продукция : '';
          }
        });
      }

      if(is_order_row instanceof CatFormulas) {
        is_order_row = is_order_row.execute({ox, elm, contour});
      }
      return is_order_row === Продукция;
    }

    /**
     * Возвращает номенклатуру вставки в завсисмости от свойств элемента
     * @param elm {BuilderElement}
     * @param [strict] {Boolean} - строгий режим
     */
    nom(elm, strict) {

      const {_data} = this;

      if(!strict && !elm && _data.nom) {
        return _data.nom;
      }

      let _nom;
      const main_rows = this.main_rows(elm, strict);

      if(main_rows.length && main_rows[0].nom instanceof CatInserts){
        if(main_rows[0].nom == this) {
          _nom = cat.nom.get();
        }
        else {
          _nom = main_rows[0].nom.nom(elm, strict);
        }
      }
      else if(main_rows.length){
        if(elm && !main_rows[0].formula.empty()) {
          try {
            _nom = main_rows[0].formula.execute({elm});
            if(!_nom) {
              _nom = main_rows[0].nom;
            }
          } catch (e) {
            _nom = main_rows[0].nom;
          }
        }
        else {
          _nom = main_rows[0].nom;
        }
      }
      else {
        _nom = cat.nom.get();
      }

      if(main_rows.length < 2){
        _data.nom = typeof _nom == 'string' ? cat.nom.get(_nom) : _nom;
      }
      else{
        // TODO: реализовать фильтр
        _data.nom = _nom;
      }

      return _data.nom;
    }

    /**
     * Ширина основной номенклатуры вставки
     * @param elm {BuilderElement}
     * @param [strict] {Boolean} - строгий режим
     * @return {*|number}
     */
    width(elm, strict) {
      return this.nom(elm, strict).width || 80;
    }

    /**
     * Возвращает атрибуты характеристики виртуальной продукции по вставке в контур
     */
    contour_attrs(contour) {

      const main_rows = [];
      const res = {calc_order: contour.project.ox.calc_order};

      this.specification.find_rows({is_main_elm: true}, (row) => {
        main_rows.push(row);
        return false;
      });

      if(main_rows.length){
        const irow = main_rows[0],
          sizes = {},
          sz_keys = {},
          sz_prms = ['length', 'width', 'thickness']
            .map((name) => {
              const prm = job_prm.properties[name];
              if(prm) {
                sz_keys[prm.ref] = name;
                return prm;
              }
            })
            .filter((prm) => prm);

        // установим номенклатуру продукции
        res.owner = irow.nom instanceof CatInserts ? irow.nom.nom() : irow.nom;

        // если в параметрах вставки задействованы свойства длина и или ширина - габариты получаем из свойств
        contour.project.ox.params.find_rows({
          cnstr: contour.cnstr,
          inset: this,
          param: {in: sz_prms}
        }, (row) => {
          sizes[sz_keys[row.param.ref]] = row.value
        });

        if(Object.keys(sizes).length > 0){
          res.x = sizes.length ? (sizes.length + irow.sz) * (irow.coefficient * 1000 || 1) : 0;
          res.y = sizes.width ? (sizes.width + irow.sz) * (irow.coefficient * 1000 || 1) : 0;
          res.s = ((res.x * res.y) / 1e6).round(3);
          res.z = sizes.thickness * (irow.coefficient * 1000 || 1);
        }
        else{
          if(irow.count_calc_method == enm.count_calculating_ways.formulas && !irow.formula.empty()){
            irow.formula.execute({
              ox: contour.project.ox,
              contour: contour,
              inset: this,
              row_ins: irow,
              res: res
            });
          }
          if(irow.count_calc_method == enm.count_calculating_ways.area && this.insert_type == inserts_types.МоскитнаяСетка){
            // получаем габариты смещенного периметра
            const bounds = contour.bounds_inner(irow.sz, this);
            res.x = bounds.width.round(1);
            res.y = bounds.height.round(1);
            res.s = ((res.x * res.y) / 1e6).round(3);
          }
          else{
            res.x = contour.w + irow.sz;
            res.y = contour.h + irow.sz;
            res.s = ((res.x * res.y) / 1e6).round(3);
          }
        }
      }

      return res;

    }

    /**
     * Проверяет ограничения вставки параметрика
     * @param elm {BuilderElement}
     * @param len_angl {Object}
     * @param params {Array}
     */
    check_prm_restrictions({elm, len_angl, params}) {
      const {lmin, lmax, hmin, hmax} = this;
      const {len, height, s} = elm;

      let name = this.name + ':', err = false;

      if(lmin && len < lmin) {
        err = true;
        name += `\nдлина ${len} < ${lmin}`;
      }
      if(lmax && len > lmax) {
        err = true;
        name += `\nдлина ${len} > ${lmax}`;
      }
      if(hmin && height < hmin) {
        err = true;
        name += `\nвысота ${height} < ${hmin}`;
      }
      if(hmax && height > hmax) {
        err = true;
        name += `\nвысота ${height} > ${hmax}`;
      }

      // получаем набор параметров, используемых текущей вставкой
      const used_params = this.used_params();

      // добавляем параметр в характеристику, если используется в текущей вставке
      params.forEach(({param, value}) => {
        if(used_params.includes(param) && param.mandatory && (!value || value.empty())) {
          err = true;
          name += `\nне заполнен обязательный параметр '${param.name}'`;
        }
      });

      if(err) {
        throw new Error(name);
      }
    }

    /**
     * Проверяет ограничения вставки или строки вставки
     * @param row {CatInserts|CatInsertsSpecificationRow}
     * @param elm {BuilderElement}
     * @param [by_perimetr] {Boolean}
     * @param [len_angl] {Object}
     * @return {Boolean}
     */
    check_restrictions(row, elm, by_perimetr, len_angl) {

      if(!this.check_base_restrictions(row, elm)) {
        return false;
      }

      const {_row} = elm;
      const is_row = !utils.is_data_obj(row);

      // Главный элемент с нулевым количеством не включаем
      if(is_row && row.is_main_elm && !row.quantity){
        return false;
      }

      if (by_perimetr || row.count_calc_method !== enm.count_calculating_ways.perim) {
        if(!(elm instanceof EditorInvisible.Filling)) {
          const len = len_angl ? len_angl.len : _row.len;
          if (row.lmin > len || (row.lmax < len && row.lmax > 0)) {
            return false;
          }
        }
        if (is_row) {
          const angle_hor = len_angl && len_angl.hasOwnProperty('angle_hor') ? len_angl.angle_hor : _row.angle_hor;
          if (row.ahmin > angle_hor || row.ahmax < angle_hor) {
            return false;
          }
        }
      }

      //// Включить проверку размеров и углов, поля "Устанавливать с..." и т.д.

      return true;
    }

    /**
     * Проверяет базовые ограничения вставки или строки вставки
     * @param row
     * @param elm
     * @return {boolean}
     */
    check_base_restrictions(row, elm) {
      const {_row} = elm;

      if(elm instanceof EditorInvisible.Filling) {
        // проверяем площадь
        if(row.smin > _row.s || (_row.s && row.smax && row.smax < _row.s)){
          return false;
        }
        // и фильтр по габаритам
        if(row instanceof CatInserts) {
          const {width, height} = elm.bounds;
          const {lmin, lmax, hmin, hmax, can_rotate} = row;
          // Если можно вращать то проверим 2 направления
          if (can_rotate) {
            const w1 = width > lmin && width < lmax;
            const h1 = height > hmin && height < hmax;
            const w2 = height > lmin && height < lmax;
            const h2 = width > hmin && width < hmax;
            if (!((w1 && h1) || (w2 && h2))) {
              return false;
            }
          }
          else if ((lmin > width) || (lmax && lmax < width) || (hmin > height) || (hmax && hmax < height)) {
            return false;
          }
        }
      }
      else {
        const is_linear = elm.is_linear ? elm.is_linear() : true;
        // только для прямых или только для кривых профилей
        if((row.for_direct_profile_only > 0 && !is_linear) || (row.for_direct_profile_only < 0 && is_linear)){
          return false;
        }
      }

      if(row.rmin > _row.r || (_row.r && row.rmax && row.rmax < _row.r)){
        return false;
      }

      return true;
    }

    /**
     * Возвращает спецификацию вставки с фильтром
     * @method filtered_spec
     * @param elm {BuilderElement|Object} - элемент, к которому привязана вставка
     * @param elm2 {BuilderElement|Object} - соседний элемент, имеет смысл, когда вставка вызвана из соединения
     * @param ox {CatCharacteristics} - текущая продукция
     * @param [is_high_level_call] {Boolean} - вызов верхнего уровня - специфично для стеклопакетов
     * @param [len_angl] {Object} - контекст размеров элемента
     * @param [own_row] {CatInsertsSpecificationRow|CatCnnsSpecificationRow} - родительская строка для вложенных вставок
     * @return {Array}
     */
    filtered_spec({elm, elm2, eclr, is_high_level_call, len_angl, own_row, ox}) {

      const res = [];

      if(this.empty()){
        return res;
      }

      const {insert_type, _manager: {_types_filling, _types_main}} = this;
      const {inserts_types: {profile, coloring}, angle_calculating_ways: {Основной}, count_calculating_ways: {parameters}} = enm;
      const {check_params} = ProductsBuilding;

      function fake_row(sub_row, row) {
        const fakerow = {};
        if(sub_row._metadata) {
          for (let fld in sub_row._metadata().fields) {
            fakerow[fld] = sub_row[fld];
          }
        }
        else {
          Object.assign(fakerow, sub_row);
        }
        fakerow._owner = sub_row._owner;

        // количество по параметру
        if(sub_row instanceof CatInsertsSpecificationRow && sub_row.count_calc_method === parameters) {
          fakerow._owner._owner.selection_params.find_rows({elm: sub_row.elm, origin: 'algorithm'}, (prm_row) => {
            const {rnum} = elm;
            fakerow.quantity = (rnum ? elm[prm_row.param.valueOf()] : ox.extract_value({cnstr: [0, -elm.elm], param: prm_row.param})) || 0;
            return false;
          });
        }

        if(row) {
          fakerow.quantity = (fakerow.quantity || (sub_row.count_calc_method === parameters ? 0 : 1)) * (row.quantity || 1);
          fakerow.coefficient = (fakerow.coefficient || row.coefficient) ? fakerow.coefficient * (row.coefficient || 1) : 0;
          if(fakerow.clr.empty()) {
            fakerow.clr = row.clr;
          }
          if(fakerow.angle_calc_method === Основной) {
            fakerow.angle_calc_method = row.angle_calc_method;
          }
          if(!fakerow.sz) {
            fakerow.sz = row.sz;
          }
        }

        return fakerow;
      }

      // для заполнений, можно переопределить состав верхнего уровня
      if(is_high_level_call && _types_filling.includes(insert_type)){

        const glass_rows = [];
        ox.glass_specification.find_rows({elm: elm.elm, inset: {not: utils.blank.guid}}, (row) => {
          glass_rows.push(row);
        });

        // если спецификация верхнего уровня задана в изделии, используем её, параллельно формируем формулу
        if(glass_rows.length){
          glass_rows.forEach((row) => {
            const relm = elm.region(row);
            for(const srow of row.inset.filtered_spec({elm: relm, len_angl, ox, own_row: {clr: row.clr}})) {
              const frow = srow instanceof CatInsertsSpecificationRow ? fake_row(srow) : srow;
              frow.relm = relm;
              frow.origin = row.inset;
              res.push(frow);
            }
          });
          return res;
        }
      }

      const {flipped} = elm.layer || {};
      this.specification.forEach((row) => {

        // Проверяем ограничения строки вставки
        if(!this.check_restrictions(row, elm, insert_type === profile, len_angl)){
          return;
        }

        // Проверяем параметры изделия, контура или элемента
        if(own_row && row.clr.empty() && !own_row.clr.empty()){
          row = fake_row(row);
          row.clr = own_row.clr;
        }
        if(!check_params({
          params: this.selection_params,
          ox,
          elm,
          elm2,
          row_spec: row,
          cnstr: len_angl && len_angl.cnstr,
          origin: len_angl && len_angl.origin,
        })){
          return;
        }

        // Добавляем или разузловываем дальше
        if(row.nom instanceof CatInserts){
          if(row.nom.insert_type === coloring) {
            // добавляем одну или две строки
            if(!eclr) {
              eclr = elm.clr;
            }
            const selector = {
              params: this.selection_params,
              ox,
              elm,
              elm2,
              row_spec: row,
              cnstr: len_angl && len_angl.cnstr,
              origin: len_angl && len_angl.origin,
              eclr,
            };
            if(eclr.is_composite()) {
              let {clr_in, clr_out} = eclr;
              if(flipped) {
                [clr_in, clr_out] = [clr_out, clr_in];
              }
              selector.eclr = clr_in;
              if(check_params(selector)) {
                row.nom.filtered_spec({elm, elm2, eclr: clr_in, len_angl, ox, own_row: own_row || row}).forEach((subrow) => {
                  const fakerow = fake_row(subrow, row);
                  fakerow._origin = row.nom;
                  fakerow._clr_side = '_in';
                  fakerow._clr = clr_in;
                  res.push(fakerow);
                });
              }
              selector.eclr = clr_out;
              if(check_params(selector)) {
                row.nom.filtered_spec({elm, elm2, eclr: clr_out, len_angl, ox, own_row: own_row || row}).forEach((subrow) => {
                  const fakerow = fake_row(subrow, row);
                  fakerow._origin = row.nom;
                  fakerow._clr_side = '_out';
                  fakerow._clr = clr_out;
                  res.push(fakerow);
                });
              }
            }
            else {
              row.nom.filtered_spec({elm, elm2, eclr, len_angl, ox, own_row: own_row || row}).forEach((subrow) => {
                const fakerow = fake_row(subrow, row);
                fakerow._origin = row.nom;
                fakerow._clr = eclr;
                res.push(fakerow);
              });
            }
          }
          else {
            row.nom.filtered_spec({elm, elm2, len_angl, ox, own_row: own_row || row}).forEach((subrow) => {
              const fakerow = fake_row(subrow, row);
              fakerow._origin = row.nom;
              res.push(fakerow);
            });
          }
        }
        else{
          res.push(row);
        }

      });

      // контроль массы, размеров основной вставки
      if(_types_main.includes(insert_type) && !this.check_restrictions(this, elm, insert_type == profile, len_angl)){
        elm.err_spec_row(job_prm.nom.critical_error, this);
      }

      return res;
    }

    /**
     * Дополняет спецификацию изделия спецификацией текущей вставки
     * @method calculate_spec
     * @param elm {BuilderElement}
     * @param [elm2] {BuilderElement}
     * @param [len_angl] {Object}
     * @param ox {CatCharacteristics}
     * @param own_row {CatCnnsSpecificationRow}
     * @param spec {TabularSection}
     * @param clr {CatClrs}
     * @param totqty0 {Boolean} - если взведён, в totqty1 пишем 0 (например, для реализации параметра "Без заполнений")
     */
    calculate_spec({elm, elm2, len_angl, own_row, ox, spec, clr, totqty0}) {

      const {_row} = elm;
      const {
        perim,
        steps,
        formulas,
        element,
        parameters,
        area,
        len_prm,
        dimensions,
        cnns,
        fillings,
        coloring,
      } = enm.count_calculating_ways;
      const {profile_items} = enm.elm_types;
      const {new_spec_row, calc_qty_len, calc_count_area_mass} = ProductsBuilding;

      if(!spec){
        spec = ox.specification;
      }

      this.filtered_spec({elm, elm2, is_high_level_call: true, len_angl, own_row, ox, clr}).forEach((row_ins_spec) => {

        const origin = row_ins_spec._origin || this;
        let {count_calc_method, angle_calc_method, sz, offsets, coefficient, formula} = row_ins_spec;
        if(!coefficient) {
          coefficient = 0.001;
        }

        let row_spec;

        // добавляем строку спецификации, если профиль или не про шагам
        if(![perim, steps, fillings].includes(count_calc_method) || profile_items.includes(_row.elm_type)){
          if(!row_ins_spec.quantity) {
            return;
          }
          row_spec = new_spec_row({elm, row_base: row_ins_spec, origin, spec, ox, len_angl});
        }

        if(count_calc_method === formulas && !formula.empty()){
          // если строка спецификации не добавлена на предыдущем шаге, делаем это сейчас
          row_spec = new_spec_row({row_spec, elm, row_base: row_ins_spec, origin, spec, ox, len_angl});
        }
        else if(count_calc_method === coloring) {
          count_calc_method.calculate({inset: this, elm, row_spec, row_ins_spec, spec, ox});
        }
        // для вставок в профиль способ расчета количества не учитывается
        else if(profile_items.includes(_row.elm_type) || [element, parameters].includes(count_calc_method)){
          calc_qty_len(row_spec, row_ins_spec, len_angl ? len_angl.len : _row.len);
          // размер может уточняться по соединениям
          if(count_calc_method == cnns){
            const {b, e} = elm.rays;
            for(const node of [b, e]) {
              const {cnn} = node;
              if(cnn) {
                row_spec.len -= cnn.nom_size({nom: row_spec.nom, elm, len_angl: node.len_angl(), ox}) * coefficient;
              }
            }
          }
        }
        else{

          if(count_calc_method === area) {
            count_calc_method.calculate({inset: this, elm, row_spec, row_ins_spec});
          }
          else if(count_calc_method === perim){
            let {perimeter} = elm;
            if(!perimeter) {
              if(this.insert_type === enm.inserts_types.mosquito) {
                perimeter = elm.layer.perimeter_inner(sz, row_ins_spec.nom);
                Object.defineProperty(elm, 'perimeter', {value: perimeter});
              }
              else {
                perimeter = elm.layer.perimeter;
              }
            }
            const row_prm = {_row: {len: 0, angle_hor: 0, s: _row.s}};
            const {check_params} = ProductsBuilding;
            perimeter.forEach((rib) => {
              row_prm._row._mixin(rib);
              row_prm.is_linear = () => rib.profile ? rib.profile.is_linear() : true;
              if(this.check_restrictions(row_ins_spec, row_prm, true) && check_params({
                params: (row_ins_spec.origin || this).selection_params,
                ox,
                elm: row_prm,
                row_spec: row_ins_spec,
                origin: row_ins_spec.origin || this,
                count_calc_method,
              })){
                row_spec = new_spec_row({elm, row_base: row_ins_spec, origin, spec, ox, len_angl});
                // при расчете по периметру, выполняем формулу для каждого ребра периметра
                const fqty = !formula.empty() && formula.execute({
                  ox,
                  clr,
                  row_spec,
                  elm: rib.profile || rib,
                  elm2,
                  cnstr: len_angl && len_angl.cnstr || 0,
                  inset: (len_angl && len_angl.hasOwnProperty('cnstr')) ? len_angl.origin : utils.blank.guid,
                  row_ins: row_ins_spec,
                  len: rib.len
                });
                // если формула не вернула значение, устанавливаем qty_len стандартным способом
                if(fqty) {
                  if(!row_spec.qty) {
                    row_spec.qty = fqty;
                  }
                }
                else {
                  calc_qty_len(row_spec, row_ins_spec, rib.len);
                }
                calc_count_area_mass(row_spec, spec, len_angl && len_angl.hasOwnProperty('alp1') ? len_angl : _row,
                  angle_calc_method, angle_calc_method, 0, 0, totqty0);
              }
              row_spec = null;
            });

          }
          else if(count_calc_method === steps){

            const bounds = this.insert_type == enm.inserts_types.МоскитнаяСетка ?
              (elm.layer ? elm.layer.bounds_inner(sz) : elm.bounds_inner(sz))
              :
              {height: _row.y2 - _row.y1, width: _row.x2 - _row.x1};

            const h = (!row_ins_spec.step_angle || row_ins_spec.step_angle == 180 ? bounds.height : bounds.width);
            const w = !row_ins_spec.step_angle || row_ins_spec.step_angle == 180 ? bounds.width : bounds.height;
            if(row_ins_spec.step){
              let qty = 0;
              let pos;
              if(row_ins_spec.do_center && h >= row_ins_spec.step ){
                pos = h / 2;
                if(pos >= offsets &&  pos <= h - offsets){
                  qty++;
                }
                for(let i = 1; i <= Math.ceil(h / row_ins_spec.step); i++){
                  pos = h / 2 + i * row_ins_spec.step;
                  if(pos >= offsets &&  pos <= h - offsets){
                    qty++;
                  }
                  pos = h / 2 - i * row_ins_spec.step;
                  if(pos >= offsets &&  pos <= h - offsets){
                    qty++;
                  }
                }
              }
              else{
                for(let i = 1; i <= Math.ceil(h / row_ins_spec.step); i++){
                  pos = i * row_ins_spec.step;
                  if(pos >= offsets &&  pos <= h - offsets){
                    qty++;
                  }
                }
              }

              if(qty){
                row_spec = new_spec_row({elm, row_base: row_ins_spec, origin, spec, ox, len_angl});

                const fqty = !formula.empty() && formula.execute({
                  ox,
                  clr,
                  row_spec,
                  elm,
                  elm2,
                  cnstr: len_angl && len_angl.cnstr || 0,
                  row_ins: row_ins_spec,
                  len: len_angl ? len_angl.len : _row.len
                });
                // TODO: непонятно, надо ли здесь учитывать fqty
                calc_qty_len(row_spec, row_ins_spec, w);
                row_spec.qty *= qty;
                calc_count_area_mass(row_spec, spec, len_angl && len_angl.hasOwnProperty('alp1') ? len_angl : _row,
                  angle_calc_method, angle_calc_method, 0, 0, totqty0);
              }
              row_spec = null;
            }
          }
          else if(count_calc_method === len_prm) {
            count_calc_method.calculate({inset: this, elm, row_spec, row_ins_spec, origin});
          }
          else if(count_calc_method === dimensions){
            let len = 0, width = 0;
            this.selection_params.find_rows({elm: row_ins_spec.elm}, ({param}) => {
              if(param.type.digits) {
                ox.params.find_rows({cnstr: 0, param}, ({value}) => {
                  if(!len) {
                    len = value;
                  }
                  else if(!width) {
                    width = value;
                  }
                  return false;
                });
              }
              if(len && width) return false;
            });
            row_spec.qty = row_ins_spec.quantity;
            row_spec.len = (len - sz) * coefficient;
            row_spec.width = (width - sz) * coefficient;
            row_spec.s = (row_spec.len * row_spec.width).round(3);
          }
          else if(count_calc_method === fillings){
            (elm.layer ? elm.layer.glasses(false, true) : []).forEach((glass) => {
              const {bounds} = glass;
              row_spec = new_spec_row({elm, row_base: row_ins_spec, origin, spec, ox, len_angl});
              // виртуальный номер элемента для данного способа расчета количества
              row_spec.elm = 11000 + glass.elm;
              row_spec.qty = row_ins_spec.quantity;
              row_spec.len = (bounds.height - sz) * coefficient;
              row_spec.width = (bounds.width - sz) * coefficient;
              row_spec.s = (row_spec.len * row_spec.width).round(3);
              calc_count_area_mass(row_spec, spec, len_angl && len_angl.hasOwnProperty('alp1') ? len_angl : _row, null, null, 0, 0, totqty0);

              const qty = !formula.empty() && formula.execute({
                ox: ox,
                elm: glass,
                cnstr: len_angl && len_angl.cnstr || 0,
                inset: (len_angl && len_angl.hasOwnProperty('cnstr')) ? len_angl.origin : utils.blank.guid,
                row_ins: row_ins_spec,
                row_spec: row_spec,
                clr,
              });

              row_spec = null;
            });
          }
          else{
            throw new Error(`count_calc_method: ${count_calc_method}`);
          }
        }

        if(row_spec){
          // выполняем формулу
          if(!formula.empty()){
            const qty = formula.execute({
              ox: ox,
              elm: elm,
              elm2,
              cnstr: len_angl && len_angl.cnstr || 0,
              inset: (len_angl && len_angl.hasOwnProperty('cnstr')) ? len_angl.origin : utils.blank.guid,
              row_ins: row_ins_spec,
              row_spec: row_spec,
              clr,
              len: len_angl ? len_angl.len : _row.len
            });
            if(count_calc_method == formulas) {
              row_spec.qty = qty;
            }
            else if(formula.condition_formula && !qty) {
              row_spec.qty = 0;
            }
          }
          calc_count_area_mass(row_spec, spec, len_angl?.hasOwnProperty('alp1') ? len_angl : _row,
            angle_calc_method, angle_calc_method, 0, 0, totqty0);
        }
      });

      // скорректируем габариты вытягиваемой конструкции
      if(spec !== ox.specification) {
        const {_owner} = spec;
        switch (this.insert_type) {
          case enm.inserts_types.mosquito:
            if(Array.isArray(elm.perimeter)) {
              let start = new paper.Point([0,0]);
              const path = new paper.Path({insert: false});
              path.add(start);
              for(const rib of elm.perimeter) {
                const tmp = new paper.Point({
                  length: rib.len,
                  angle: rib.angle
                });
                const fin = start.add(tmp);
                path.add(fin);
                start = fin.clone();
              }
              const {bounds} = path;
              _owner.x = bounds.width.round(1);
              _owner.y = bounds.height.round(1);
              _owner.s = (bounds.area / 1e6).round(3);
            }
            break;
          case enm.inserts_types.jalousie:
            const bounds = {x: 0, y: 0};
            spec.forEach(({len, width}) => {
              if(len && width) {
                if(bounds.x < len) {
                  bounds.x = len;
                }
                if(bounds.y < width) {
                  bounds.y = width;
                }
              }
            });
            _owner.x = bounds.y * 1000;
            _owner.y = bounds.x * 1000;
            _owner.s = (bounds.x * bounds.y).round(3);
        }
      }
    }

    /**
     * Дополняет спецификацию изделия спецификацией текущего ряда
     * @method region_spec
     * @param elm {BuilderElement}
     * @param [len_angl] {Object}
     * @param ox {CatCharacteristics}
     * @param spec {TabularSection}
     * @param region {Number}
     */
    region_spec({elm, len_angl, ox, spec, region, totqty0}) {
      const {cat: {cnns}, enm: {angle_calculating_ways: {СоединениеПополам: s2, Соединение: s1}, predefined_formulas: {w2}}, products_building} = $p;
      const relm = elm.region(region);
      const {cnn1_row: {row: row1, cnn_point: b}, cnn2_row: {row: row2, cnn_point: e}, nom, _row} = relm;
      const cnn1 = row1 && !row1.cnn.empty() ? row1.cnn : cnns.nom_cnn(relm, b.profile, b.cnn_types, false, undefined, b)[0];
      const cnn2 = row2 && !row2.cnn.empty() ? row2.cnn : cnns.nom_cnn(relm, e.profile, e.cnn_types, false, undefined, e)[0];
      if(cnn1 && cnn2) {
        const row_cnn_prev = cnn1.main_row(relm);
        const row_cnn_next = cnn2.main_row(relm);
        const {new_spec_row, calc_count_area_mass} = ProductsBuilding;
        const row_base = row_cnn_prev || row_cnn_next;
        if(row_base) {
          const row_spec = new_spec_row({elm: relm, row_base, nom, origin: cnn1, spec, ox});
          row_spec.qty = row_base.quantity;

          // длина с учетом соединений
          const k001 = 0.001;
          const len = row_cnn_prev && row_cnn_prev.algorithm === w2 && row_cnn_next && row_cnn_next.algorithm === w2 ?
            elm.generatrix.length : _row.len;
          row_spec.len = (len - row_cnn_prev.sz - row_cnn_next.sz) * (row_cnn_prev.coefficient + row_cnn_next.coefficient) / 2;

          // припуск для гнутых элементов
          if(!elm.is_linear()) {
            row_spec.len = row_spec.len + row_spec.nom.arc_elongation * k001;
          }

          // дополнительная корректировка формулой - здесь можно изменить размер, номенклатуру и вообще, что угодно в спецификации
          if(!row_cnn_prev.formula.empty()) {
            row_cnn_prev.formula.execute({
              ox,
              elm: relm,
              inset: this,
              row_cnn: row_cnn_prev || row_cnn_next,
              row_spec
            });
          }
          else if(!row_cnn_next.formula.empty()) {
            row_cnn_next.formula.execute({
              ox,
              elm: relm,
              inset: this,
              row_cnn: row_cnn_next|| row_cnn_prev,
              row_spec
            });
          }

          // РассчитатьКоличествоПлощадьМассу
          const angle_calc_method_prev = row_cnn_prev ? row_cnn_prev.angle_calc_method : null;
          const angle_calc_method_next = row_cnn_next ? row_cnn_next.angle_calc_method : null;
          calc_count_area_mass(
            row_spec,
            spec,
            _row,
            angle_calc_method_prev,
            angle_calc_method_next,
            angle_calc_method_prev == s2 || angle_calc_method_prev == s1 ? b.profile.generatrix.angle_between(elm.generatrix, b.point) : 0,
            angle_calc_method_next == s2 || angle_calc_method_next == s1 ? elm.generatrix.angle_between(e.profile.generatrix, e.point) : 0,
            totqty0,
          );

          // добавляем спецификации соединений
          const len_angl = {
            angle: 0,
            alp1: b.profile ? b.profile.generatrix.angle_between(elm.generatrix, elm.b) : 90,
            alp2: e.profile ? elm.generatrix.angle_between(e.profile.generatrix, elm.e) : 90,
            len: row_spec ? row_spec.len * 1000 : _row.len,
            art1: false,
            art2: true,
            node: 'e',
          };
          len_angl.angle = len_angl.alp2;
          products_building.cnn_add_spec(cnn2, relm, len_angl, cnn1, e.profile);
          // с дрйгой стороны
          len_angl.angle = len_angl.alp1;
          len_angl.art2 = false;
          len_angl.art1 = true;
          len_angl.node = 'b';
          products_building.cnn_add_spec(cnn1, relm, len_angl, cnn2, b.profile);
        }
      }
      // спецификация вставки
      this.calculate_spec({elm: relm, len_angl, ox, spec});
    }

    /**
     * Возвращает толщину вставки
     * @param {elm} {BuilderElement}
     * @param [strict] {Number}
     * @return {number}
     */
    thickness(elm, strict) {

      if(elm) {
        const nom = this.nom(elm, true);
        if(nom && !nom.empty() && !nom._hierarchy(job_prm.nom.products)) {
          return nom.thickness;
        }
        const {check_params} = ProductsBuilding;
        const {_ox} = elm.layer;
        let thickness = 0;
        for(const row of this.specification) {
          if(row.quantity && this.check_base_restrictions(row, elm) && check_params({
            params: this.selection_params,
            ox: _ox,
            elm,
            row_spec: row,
            cnstr: 0,
            origin: elm.fake_origin || 0,
          })) {
            const {nom} = row;
            if(nom) {
              thickness += nom instanceof CatInserts ? nom.thickness(elm) : nom.thickness;
            }
          }
        }
        return thickness;
      }

      const {_data} = this;
      if(!_data.hasOwnProperty('thickness')) {
        _data.thickness = 0;
        const nom = this.nom(elm, true);
        if(nom && !nom.empty() && !nom._hierarchy(job_prm.nom.products)) {
          _data.thickness = nom.thickness;
        }
        else {
          for(const {nom, quantity} of this.specification) {
            if(nom && quantity) {
              _data.thickness += nom instanceof CatInserts ? nom.thickness(elm) : nom.thickness;
            }
          }
        }
      }

      return _data.thickness;
    }

    /**
     * Возвращает массив задействованных во вставке параметров
     * @return {Array}
     */
    used_params() {
      const {_data, specification} = this;
      // если параметры этого набора уже обработаны - пропускаем
      if(_data.used_params) {
        return _data.used_params;
      }

      const sprms = [];
      const {order, product, nearest} = enm.plan_detailing;
      const use = cch.properties.predefined('use');

      this.selection_params.forEach(({param, origin, elm}) => {
        if(param.empty() || origin === product || origin === order || origin === nearest) {
          return;
        }
        if(param === use) {
          const {nom} = specification.find({elm}) || {};
          if(nom) {
            const prm = cch.properties.get(nom.ref);
            if(!prm.name) {
              prm.name = prm.caption = nom.name;
              prm.type = {types: ['boolean']};
            }
            sprms.push(prm);
          }
        }
        else if((!param.is_calculated || param.show_calculated) && !sprms.includes(param)){
          sprms.push(param);
        }
      });

      this.product_params.forEach(({param}) => {
        if(!param.empty() && (!param.is_calculated || param.show_calculated) && !sprms.includes(param)){
          sprms.push(param);
        }
      });

      const {cx_prm} = enm.predefined_formulas;
      specification.forEach(({nom, algorithm}) => {
        if(nom instanceof CatInserts) {
          for(const param of nom.used_params()) {
            !sprms.includes(param) && sprms.push(param);
          }
        }
        else if(algorithm === cx_prm && !sprms.includes(nom)) {
          sprms.push(nom);
        }
      });

      return _data.used_params = Object.freeze(sprms);
    }

    get split_type(){
      let {split_type} = this._obj;
      if(!split_type) {
        split_type = [];
      }
      else if(split_type.startsWith('[')) {
        split_type = JSON.parse(split_type).map((ref) => enm.lay_split_types.get(ref));
      }
      else {
        split_type = [enm.lay_split_types.get(split_type)];
      }
      return split_type;
    }
    set split_type(v){this._setter('split_type',v)}

  }
  $p.CatInserts = CatInserts;

})($p);
