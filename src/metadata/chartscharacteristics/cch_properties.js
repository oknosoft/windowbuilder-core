/**
 * ### Дополнительные методы плана видов характеристик _Свойства объектов_
 * аналог подсистемы _Свойства_ БСП
 *
 * @module cch_properties
 */

exports.CchPropertiesManager = class CchPropertiesManager extends Object {

  /**
   * ### Проверяет заполненность обязательных полей
   *
   * @method check_mandatory
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
   * ### Возвращает массив доступных для данного свойства значений
   *
   * @method slist
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

}

exports.CchProperties = class CchProperties extends Object {

  /**
   * ### Является ли значение параметра вычисляемым
   *
   * @property is_calculated
   * @type Boolean
   */
  get is_calculated() {
    return ($p.job_prm.properties.calculated || []).includes(this) || !this.calculated.empty();
  }

  get show_calculated() {
    return ($p.job_prm.properties.show_calculated || []).includes(this) || this.showcalc;
  }

  /**
   * ### Рассчитывает значение вычисляемого параметра
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
   * ### Проверяет условие в строке отбора
   */
  check_condition({row_spec, prm_row, elm, elm2, cnstr, origin, ox, calc_order}) {

    const {is_calculated, type} = this;
    const {utils, enm: {comparison_types, predefined_formulas}} = $p;

    // для алгоритма clr_prm и цветового параметра, фильтр отключаем
    if(row_spec && row_spec.algorithm === predefined_formulas.clr_prm &&
      (prm_row.comparison_type.empty() || prm_row.comparison_type === comparison_types.eq) &&
        type.types.includes('cat.clrs') &&
        (!prm_row.value || prm_row.value.empty())) {
      return true;
    }

    // значение параметра
    const val = is_calculated ? this.calculated_value({
      row: row_spec,
      cnstr: cnstr || 0,
      elm,
      elm2,
      ox,
      calc_order
    }) : this.extract_value(prm_row);

    let ok = false;

    // если сравнение на равенство - решаем в лоб, если вычисляемый параметр типа массив - выясняем вхождение значения в параметр
    if(ox && !Array.isArray(val) && (prm_row.comparison_type.empty() || prm_row.comparison_type === comparison_types.eq)) {
      if(is_calculated) {
        ok = val == prm_row.value;
      }
      else {
        const value = this.extract_pvalue({ox, cnstr, elm, origin, prm_row});
        ok = value == val;
      }
    }
    // вычисляемый параметр - его значение уже рассчитано формулой (val) - сравниваем со значением в строке ограничений
    else if(is_calculated) {
      const value = this.extract_value(prm_row);
      ok = utils.check_compare(val, value, prm_row.comparison_type, comparison_types);
    }
    // параметр явно указан в табчасти параметров изделия
    else {
      const value = this.extract_pvalue({ox, cnstr, elm, origin, prm_row});
      ok = (value !== undefined) && utils.check_compare(value, val, prm_row.comparison_type, comparison_types);
    }
    return ok;
  }

  /**
   * Извлекает значение из объекта (то, что будем сравнивать с extract_value)
   */
  extract_pvalue({ox, cnstr, elm, origin, prm_row}) {
    const {product_params, params} = ox;
    let prow, cnstr0, elm0;
    if(params) {
      const {enm: {plan_detailing}, utils} = $p;
      const src = prm_row.origin;
      if(src && !src.empty()) {
        switch (src) {
        case plan_detailing.order:
          const prow = ox.calc_order.extra_fields.find(this.ref, 'property');
          return prow && prow.value;
        case plan_detailing.nearest:
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
      const inset = src.empty() ? ((typeof origin !== 'number' && origin) || utils.blank.guid) : utils.blank.guid;
      params.find_rows({
        param: this,
        cnstr: cnstr || (elm._row ? {in: [0, -elm._row.row]} : 0),
        inset,
      }, (row) => {
        if(!prow || row.cnstr) {
          prow = row;
        }
      });
      if(!prow && (cnstr0 || elm0)) {
        params.find_rows({
          param: this,
          cnstr: cnstr0 || (elm0._row ? {in: [0, -elm0._row.row]} : 0),
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
    return prow && prow.value;
  }

  /**
   * Извлекает значение из строки условия (то, с чем сравнивать extract_pvalue)
   */
  extract_value({comparison_type, txt_row, value}) {

    const {enm: {comparison_types}, md, cat} = $p;

    switch (comparison_type) {

    case comparison_types.in:
    case comparison_types.nin:

      if(!txt_row) {
        return value;
      }
      try {
        const arr = JSON.parse(txt_row);
        const {types, is_ref} = this.type;
        if(types && is_ref && arr.length) {
          let mgr;
          for(const type of types) {
            const tmp = md.mgr_by_class_name(types[0]);
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
      const arr = !use_master ? [{key:link.master}] : link.leadings;

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
              cnstr: attr.grid.selection.cnstr,
              ox: attr.obj._owner._owner,
              prm_row: row,
              elm: attr.obj,
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
   * @param prow {Object}
   * @param values {Array} - Выходной параметр, если передать его снаружы, будет наполнен доступными значениями
   * @return {boolean}
   */
  linked_values(links, prow, values = []) {
    let changed;
    // собираем все доступные значения в одном массиве
    links.forEach((link) => link.append_values(values));
    // если значение доступно в списке - спокойно уходим
    if(values.some(({_obj}) => _obj.value == prow.value)) {
      return;
    }
    // если есть явный default - устанавливаем
    if(values.some((row) => {
      if(row.forcibly) {
        prow.value = row._obj.value;
        return true;
      }
      if(row.by_default && (!prow.value || prow.value.empty && prow.value.empty())) {
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
      prow.value = values[0]._obj.value;
      return true;
    }
  }

  /**
   * ### Дополняет отбор фильтром по параметрам выбора
   * Используется в полях ввода экранных форм
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

