/*
 * Дополнительные методы плана видов характеристик _Свойства объектов_
 * аналог подсистемы _Свойства_ БСП
 *
 * @module cch_properties
 */

exports.CchPropertiesManager = class CchPropertiesManager extends Object {

  /**
   * Проверяет заполненность обязательных полей
   *
   * @override
   * @param prms {Array}
   * @param title {String}
   * @return {Boolean}
   */
  check_mandatory(prms, title) {

    let t, row;

    // проверяем заполненность полей
    for (t in prms) {
      row = prms[t];
      if(row.param.mandatory && (!row.value || row.value.empty())) {
        $p.msg.show_msg({
          type: 'alert-error',
          text: $p.msg.bld_empty_param + row.param.presentation,
          title: title || $p.msg.bld_title
        });
        return true;
      }
    }
  }

  /**
   * Возвращает массив доступных для данного свойства значений
   *
   * @override
   * @param prop {CatObj} - планвидовхарактеристик ссылка или объект
   * @param ret_mgr {Object} - установить в этом объекте указатель на менеджера объекта
   * @return {Array}
   */
  slist(prop, ret_mgr) {

    let res = [], rt, at, pmgr, op = this.get(prop);

    if(op && op.type.is_ref) {
      const tso = $p.enm.open_directions;

      // параметры получаем из локального кеша
      for (rt in op.type.types)
        if(op.type.types[rt].indexOf('.') > -1) {
          at = op.type.types[rt].split('.');
          pmgr = $p[at[0]][at[1]];
          if(pmgr) {

            if(ret_mgr) {
              ret_mgr.mgr = pmgr;
            }

            if(pmgr === tso) {
              pmgr.get_option_list().forEach((v) => v.value && v.value != tso.folding && res.push(v));
            }
            else if(pmgr.class_name.indexOf('enm.') != -1 || !pmgr.metadata().has_owners) {
              res = pmgr.get_option_list();
            }
            else {
              pmgr.find_rows({owner: prop}, (v) => res.push({value: v.ref, text: v.presentation}));
            }
          }
        }
    }
    return res;
  }

  load_array(aattr, forse) {
    super.load_array(aattr, forse);
    const {job_prm} = this._owner.$p;
    if(!job_prm.properties) {
      job_prm.__define('properties', {value: {}});
    }
    const parent = job_prm.properties;
    for (const row of aattr) {
      if(row.predefined_name) {
        parent.__define(row.predefined_name, {
          value: this.get(row, false, false),
          configurable: true,
          enumerable: true,
          writable: true,
        });
      }
    }
  }

}

exports.CchProperties = class CchProperties extends Object {

  /**
   * Является ли значение параметра вычисляемым
   *
   * @type Boolean
   */
  get is_calculated() {
    return ($p.job_prm.properties.calculated || []).includes(this) || !this.calculated.empty();
  }

  get show_calculated() {
    return ($p.job_prm.properties.show_calculated || []).includes(this) || this.showcalc;
  }

  /**
   * Рассчитывает значение вычисляемого параметра
   * @param obj {Object}
   * @param [obj.row]
   * @param [obj.elm]
   * @param [obj.ox]
   */
  calculated_value(obj) {
    if(!this._calculated_value) {
      if(this._formula) {
        this._calculated_value = $p.cat.formulas.get(this._formula);
      }
      else if(!this.calculated.empty()) {
        this._calculated_value = this.calculated;
      }
      else {
        return;
      }
    }
    return this._calculated_value.execute(obj);
  }

  /**
   * Проверяет условие в строке отбора
   */
  check_condition({row_spec, prm_row, elm, elm2, cnstr, origin, ox, layer, ...other}) {

    if(this.empty()) {
      return true;
    }
    const {is_calculated, type} = this;
    const {utils, enm: {comparison_types, predefined_formulas}, EditorInvisible: {BuilderElement}} = $p;
    const ct = prm_row.comparison_type || comparison_types.eq;

    if(!layer) {
      if(elm instanceof BuilderElement) {
        layer = elm.layer;
      }
      else if(elm2 instanceof BuilderElement) {
        layer = elm2.layer;
      }
    }

    // для параметров алгоритма, фильтр отключаем
    if((prm_row.origin == 'algorithm') || (row_spec && row_spec.algorithm === predefined_formulas.clr_prm &&
      (ct.empty() || ct === comparison_types.eq) && type.types.includes('cat.clrs') && (!prm_row.value || prm_row.value.empty()))) {
      return true;
    }

    // значение параметра
    const val = is_calculated ? this.calculated_value({
      row: row_spec,
      cnstr: cnstr || 0,
      prm_row,
      elm,
      elm2,
      ox,
      layer,
      ...other,
    }) : this.extract_value(prm_row);

    let ok = false;

    // если сравнение на равенство - решаем в лоб, если вычисляемый параметр типа массив - выясняем вхождение значения в параметр
    if(ox && !Array.isArray(val) && (ct.empty() || ct === comparison_types.eq)) {
      if(is_calculated) {
        ok = val == prm_row.value;
      }
      else {
        const value = layer ? layer.extract_pvalue({param: this, cnstr, elm, origin, prm_row}) : this.extract_pvalue({ox, cnstr, elm, origin, prm_row});
        ok = value == val;
      }
    }
    // вычисляемый параметр - его значение уже рассчитано формулой (val) - сравниваем со значением в строке ограничений
    else if(is_calculated) {
      const value = this.extract_value(prm_row);
      ok = utils.check_compare(val, value, ct, comparison_types);
    }
    // параметр явно указан в табчасти параметров изделия
    else {
      const value = layer ? layer.extract_pvalue({param: this, cnstr, elm, origin, prm_row}) : this.extract_pvalue({ox, cnstr, elm, origin, prm_row});
      ok = (value !== undefined) && utils.check_compare(value, val, ct, comparison_types);
    }
    return ok;
  }

  /**
   * Извлекает значение из объекта (то, что будем сравнивать с extract_value)
   */
  extract_pvalue({ox, cnstr, elm = {}, origin, layer, prm_row}) {
    
    // для некоторых параметров, значения живут не в изделии, а в отделе абонента
    if(this.inheritance === 3) {
      return this.branch_value({project: elm.project, cnstr, ox});
    }

    let prow, cnstr0, elm0;
    const {product_params, params} = ox;
    const find_nearest = () => {
      if(cnstr && ox.constructions) {
        cnstr0 = cnstr;
        elm0 = elm;
        elm = {};
        const crow = ox.constructions.find({cnstr});
        crow && ox.constructions.find_rows({parent: crow.parent}, (row) => {
          if(row !== crow) {
            cnstr = row.cnstr;
            return false;
          }
        });
      }
    };
    if(params) {
      const {enm: {plan_detailing}, utils, CatInserts} = $p;
      let src = prm_row?.origin;
      if(src === plan_detailing.algorithm) {
        src = plan_detailing.get();
      }
      if(src && !src.empty()) {
        switch (src) {
        case plan_detailing.order:
          const prow = ox.calc_order.extra_fields.find(this.ref, 'property');
          return prow && prow.value;
          
        case plan_detailing.nearest:
          find_nearest();
          break;
          
        case plan_detailing.layer_active:
          if(!layer) {
            layer = elm.layer;
          }
          if(layer && layer.furn.shtulp_kind() === 2) {
            find_nearest();
          }
          break;
          
        case plan_detailing.layer_passive:
          if(!layer) {
            layer = elm.layer;
          }
          if(layer && layer.furn.shtulp_kind() === 1) {
            find_nearest();
          }
          break;
          
        case plan_detailing.parent:
          if(cnstr && ox.constructions) {
            cnstr0 = cnstr;
            elm0 = elm;
            elm = {};
            const crow = ox.constructions.find({cnstr});
            const prow = ox.constructions.find({cnstr: crow.parent});
            if(crow) {
              cnstr = (prow && prow.parent === 0) ? 0 : crow.parent;
            }
          }
          break;
          
        case plan_detailing.product:
          if(cnstr) {
            cnstr0 = cnstr;
            elm0 = elm;
            cnstr = 0;
            elm = {};
          }
          break;
          
        case plan_detailing.elm:
        case plan_detailing.layer:
          break;
          
        default:
          throw `Источник '${src.name}' не поддержан`;
        }
      }
      const inset = (!src || src.empty()) ? ((origin instanceof CatInserts) ? origin : utils.blank.guid) : utils.blank.guid;
      const {rnum} = elm;
      if(rnum) {
        return elm[this.valueOf()];
      }
      else {
        params.find_rows({
          param: this,
          cnstr: cnstr || (elm._row ? {in: [0, -elm._row.elm]} : 0),
          inset,
        }, (row) => {
          if(!prow || row.cnstr) {
            prow = row;
          }
        });
      }
      if(!prow && (cnstr0 || elm0)) {
        params.find_rows({
          param: this,
          cnstr: cnstr0 || (elm0._row ? {in: [0, -elm0._row.elm]} : 0),
          inset,
        }, (row) => {
          if(!prow || row.cnstr) {
            prow = row;
          }
        });
      }
    }
    else if(product_params) {
      product_params.find_rows({
        elm: elm.elm || 0,
        param: this
      }, (row) => {
        prow = row;
        return false;
      });
    }
    if(prow) {
      return prow && prow.value;  
    }
    if(this.inheritance === 4) {
      return this.branch_value({project: elm.project, cnstr, ox});
    }    
  }

  /**
   * Извлекает значение из строки условия (то, с чем сравнивать extract_pvalue)
   */
  extract_value({comparison_type, txt_row, value}) {

    const {enm: {comparison_types}, md, cat} = $p;

    switch (comparison_type) {

    case comparison_types.in:
    case comparison_types.nin:

      if(value instanceof CatColor_price_groups) {
        return value.clrs();
      }
      else if(!txt_row) {
        return value;
      }
      try {
        const arr = JSON.parse(txt_row);
        const {types, is_ref} = this.type;
        if(types && is_ref && arr.length) {
          let mgr;
          for(const type of types) {
            const tmp = md.mgr_by_class_name(type);
            if(tmp && arr.some(ref => tmp.by_ref[ref])) {
              mgr = tmp;
              break;
            }
          }
          if(!mgr) {
            return arr;
          }
          else if(mgr === cat.color_price_groups) {
            const res = [];
            for(const ref of arr) {
              const cg = mgr.get(ref, false);
              if(cg) {
                res.push(...cg.clrs());
              }
            }
            return res;
          }
          return arr.map((ref) => mgr.get(ref, false)).filter(v => v && !v.empty());
        }
        return arr;
      }
      catch (err) {
        return value;
      }

    default:
      return value;
    }
  }

  /**
   * Возвращает значение параметра с приведением типов
   * @param v
   */
  fetch_type(v) {
    const {type, _manager} = this;
    const {utils} = $p;
    if(type.is_ref) {

      if((type.digits && typeof v === 'number') || 
          (type.hasOwnProperty('str_len') && !utils.is_guid(v)) || utils.is_data_obj(v)) {
        return v;
      }

      const mgr = _manager.value_mgr({v}, 'v', type, false, v);
      if(mgr) {
        if(utils.is_data_mgr(mgr)) {
          const ref = ((v && (utils.is_guid(v) || utils.is_guid(v.ref))) || utils.is_enm_mgr(mgr)) ? v : '';
          return mgr.get(ref, false, false);
        }
        else {
          return utils.fetch_type(v, mgr);
        }
      }

      if(v) {
        return null;
      }

    }
    else if(type.date_part) {
      return utils.fix_date(v, true);
    }
    else if(type.digits) {
      return utils.fix_number(v, !type.hasOwnProperty('str_len'));
    }
    else if(type.types[0] == 'boolean') {
      return utils.fix_boolean(v);
    }
    else if(type.types[0] == 'json') {
      return typeof v === 'object' ? v : {};
    }
    return v;
  }

  /**
   * Возвращает массив связей текущего параметра
   */
  params_links(attr) {

    // первым делом, выясняем, есть ли ограничитель на текущий параметр
    if(!this.hasOwnProperty('_params_links')) {
      this._params_links = $p.cat.params_links.find_rows({slave: this});
    }

    return this._params_links.filter((link) => {
      //use_master бывает 0 - один ведущий, 1 - несколько ведущих через И, 2 - несколько ведущих через ИЛИ
      const use_master = link.use_master || 0;
      let ok = true && use_master < 2;
      //в зависимости от use_master у нас массив либо из одного, либо из нескольких ключей ведущиъ для проверки
      const arr = !use_master ? [{key: link.master}] : link.leadings;

      arr.forEach((row_key) => {
        let ok_key = true;
        // для всех записей ключа параметров сначала строим Map ИЛИ
        const or = new Map();
        for(const row of row_key.key.params) {
          if(!or.has(row.area)) {
            or.set(row.area, []);
          }
          or.get(row.area).push(row);
        }
        for(const grp of or.values()) {
          let grp_ok = true;
          for(const row of grp) {
            // выполнение условия рассчитывает объект CchProperties
            grp_ok = row.property.check_condition({
              cnstr: attr.grid ? attr.grid.selection.cnstr : 0,
              ox: attr.obj._owner ? attr.obj._owner._owner : attr.obj.ox,
              prm_row: row,
              elm: attr.obj,
              layer: attr.layer,
            });
            // если строка условия в ключе не выполняется, то дальше проверять его условия смысла нет
            if (!grp_ok) {
              break;
            }
          }
          ok_key = grp_ok;
          if(ok_key) {
            break;
          }
        }

        //Для проверки через ИЛИ логика накопительная - надо проверить все ключи до единого
        if (use_master == 2){
          ok = ok || ok_key;
        }
        //Для проверки через И достаточно найти один неподходящий ключ, чтобы остановиться и признать связь неподходящей
        else if (!ok_key){
          ok = false;
          return false;
        }
      });
      //Конечный возврат в функцию фильтрации массива связей
      return ok;
    });
  }

  /**
   * Проверяет и при необходимости перезаполняет или устанваливает умолчание value в prow
   * @param links {Array}
   * @param [prow] {CatCharacteristicsParamsRow|Object} - Eсли задан и текущее значение недопустимо, метод попытается установить корректное
   * @param [values] {Array} - Выходной параметр, если передать его снаружы, будет наполнен доступными значениями
   * @return {boolean}
   */
  linked_values(links, prow, values = []) {
    let changed;
    // собираем все доступные значения в одном массиве
    links.forEach((link) => link.append_values(values));
    // если значение доступно в списке - спокойно уходим
    const value = prow?.value;
    if(value instanceof CatClrs && value.is_composite()) {
      const {clr_in, clr_out} = value;
      if(!prow || (values.some(({_obj}) => _obj.value == clr_in) && values.some(({_obj}) => _obj.value == clr_out))) {
        return;
      }
    }
    else {
      if(!prow || values.some(({_obj}) => _obj.value == value)) {
        return;
      }
    }
    // если есть явный default - устанавливаем
    if(values.some((row) => {
      if(row.forcibly) {
        prow.value = row._obj.value;
        return true;
      }
      if(row.by_default && (!value || value.empty?.())) {
        prow.value = row._obj.value;
        changed = true;
      }
    })) {
      return true;
    }
    // если не нашли лучшего, установим первый попавшийся
    if(changed) {
      return true;
    }
    if(values.length) {
      if(prow instanceof CatCharacteristicsParamsRow && [3, 4].includes(prow.param.inheritance)) {
        const bvalue = prow.param.branch_value({ox: prow._owner._owner});
        if(bvalue && !bvalue.empty()) {
          if(prow.value !== bvalue) {
            prow.value = bvalue;
            return true;
          }
          return;
        }
      }
      prow.value = values[0]._obj.value;
      return true;
    }
  }

  /**
   * Значение, уточняемое отделом абонента
   * @param [project] {Scheme}
   * @param [cnstr] {Number}
   * @param [ox] {CatCharacteristics}
   */
  branch_value({project, cnstr = 0, ox}) {
    let branch = project?.branch;
    if(!branch && ox) {
      branch = ox.calc_order?.organization?._extra?.('branch');
      if(!branch || branch.empty()) {
        branch = ox.calc_order?.manager?.branch;
      }
    }
    let brow = branch && branch.extra_fields.find({property: this});
    if(brow) {
      return brow.value;
    }
    if(ox) {
      const {blank} = $p.utils;
      brow = ox.params.find({param: this, cnstr, inset: blank.guid});
      if(!brow && cnstr) {
        brow = ox.params.find({param: this, cnstr: 0, inset: blank.guid});
      }
    }
    return brow ? brow.value : this.fetch_type();
  }

  /**
   * Дополняет отбор фильтром по параметрам выбора,
   * используется в полях ввода экранных форм
   * @param filter {Object} - дополняемый фильтр
   * @param attr {Object} - атрибуты OCombo
   */
  filter_params_links(filter, attr, links) {
    // для всех отфильтрованных связей параметров
    if(!links) {
      links = this.params_links(attr);
    }
    links.forEach((link) => {
      // если ключ найден в параметрах, добавляем фильтр
      if(!filter.ref) {
        filter.ref = {in: []};
      }
      if(filter.ref.in) {
        link.append_values([]).forEach(({_obj}) => {
          if(!filter.ref.in.includes(_obj.value)) {
            filter.ref.in.push(_obj.value);
          }
        });
      }
    });
  }
}

