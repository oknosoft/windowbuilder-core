/* eslint-disable */
module.exports = function init_classes($p) {
(function(){
  const {MetaEventEmitter,EnumManager,CatManager,DocManager,DataProcessorsManager,ChartOfCharacteristicManager,ChartOfAccountManager,
    InfoRegManager,AccumRegManager,BusinessProcessManager,TaskManager,CatObj,DocObj,TabularSectionRow,DataProcessorObj,
    RegisterRow,BusinessProcessObj,TaskObj} = $p.constructor.classes;

  const _define = Object.defineProperties;

$p.enm.create('accumulation_record_type');
$p.enm.create('sort_directions');
$p.enm.create('comparison_types');
$p.enm.create('label_positions');
$p.enm.create('data_field_kinds');
$p.enm.create('standard_period');
$p.enm.create('quick_access');
$p.enm.create('report_output');
$p.enm.create('path_kind');
$p.enm.create('inset_attrs_options');
$p.enm.create('transfer_operations_options');
$p.enm.create('offset_options');
$p.enm.create('application_mode_kinds');
$p.enm.create('contraction_options');
$p.enm.create('align_types');
$p.enm.create('mutual_contract_settlements');
$p.enm.create('sketch_view');
$p.enm.create('debit_credit_kinds');
$p.enm.create('contract_kinds');
$p.enm.create('inventory_kinds');
$p.enm.create('elm_visualization');
$p.enm.create('predefined_formulas');
$p.enm.create('text_aligns');
$p.enm.create('obj_delivery_states');
$p.enm.create('use_cut');
$p.enm.create('order_categories');
$p.enm.create('color_price_group_destinations');
$p.enm.create('open_directions');
$p.enm.create('rounding_quantity');
$p.enm.create('orientations');
$p.enm.create('opening');
$p.enm.create('plan_detailing');
$p.enm.create('positions');
$p.enm.create('gender');
$p.enm.create('parameters_keys_applying');
$p.enm.create('bind_coordinates');
$p.enm.create('elm_positions');
$p.enm.create('nested_object_editing_mode');
$p.enm.create('lay_regions');
$p.enm.create('buyers_order_states');
$p.enm.create('coloring');
$p.enm.create('application_joint_kinds');
$p.enm.create('count_calculating_ways');
$p.enm.create('angle_calculating_ways');
$p.enm.create('specification_installation_methods');
$p.enm.create('vat_rates');
$p.enm.create('cnn_sides');
$p.enm.create('inserts_types');
$p.enm.create('inserts_glass_types');
$p.enm.create('lay_split_types');
$p.enm.create('contact_information_types');
$p.enm.create('lead_types');
$p.enm.create('nom_types');
$p.enm.create('cutting_optimization_types');
$p.enm.create('open_types');
$p.enm.create('sz_line_types');
$p.enm.create('cnn_types');
$p.enm.create('specification_order_row_types');
$p.enm.create('elm_types');
$p.enm.create('planning_phases');
$p.enm.create('order_sending_stages');
$p.enm.create('individual_legal');
class CchPredefined_elmnts extends CatObj{

  get value() {
    const {_obj, type, _manager} = this;
    const {utils} = _manager._owner.$p;
    const res = _obj ? _obj.value : '';

    if(_obj.is_folder) {
      return '';
    }
    if(typeof res == 'object') {
      return res;
    }
    else if(type.is_ref) {
      if(type.digits && typeof res === 'number') {
        return res;
      }
      if(type.hasOwnProperty('str_len') && !utils.is_guid(res)) {
        return res;
      }
      const mgr = _manager.value_mgr(_obj, 'value', type);
      if(mgr) {
        if(utils.is_data_mgr(mgr)) {
          return mgr.get(res, false);
        }
        else {
          return utils.fetch_type(res, mgr);
        }
      }
      if(res) {
        _manager._owner.$p.record_log(['value', type, _obj]);
        return null;
      }
    }
    else if(type.date_part) {
      return utils.fix_date(_obj.value, true);
    }
    else if(type.digits) {
      return utils.fix_number(_obj.value, !type.hasOwnProperty('str_len'));
    }
    else if(type.types[0] == 'boolean') {
      return utils.fix_boolean(_obj.value);
    }
    else {
      return _obj.value || '';
    }

    return this.characteristic.clr;
  }
  set value(v) {
    const {_obj, _data, _manager} = this;
    if(_obj.value !== v) {
      _manager.emit_async('update', this, {value: _obj.value});
      _obj.value = v.valueOf();
      _data._modified = true;
    }
  }
  get definition(){return this._getter('definition')}
  set definition(v){this._setter('definition',v)}
  get synonym(){return this._getter('synonym')}
  set synonym(v){this._setter('synonym',v)}
  get list(){return this._getter('list')}
  set list(v){this._setter('list',v)}
  get zone(){return this._getter('zone')}
  set zone(v){this._setter('zone',v)}
  get predefined_name(){return this._getter('predefined_name')}
  set predefined_name(v){this._setter('predefined_name',v)}
  get parent(){return this._getter('parent')}
  set parent(v){this._setter('parent',v)}
  get type(){const {type} = this._obj; return typeof type === 'object' ? type : {types: []}}
  set type(v){this._obj.type = typeof v === 'object' ? v : {types: []}}
  get elmnts(){return this._getter_ts('elmnts')}
  set elmnts(v){this._setter_ts('elmnts',v)}}
$p.CchPredefined_elmnts = CchPredefined_elmnts;
class CchPredefined_elmntsElmntsRow extends TabularSectionRow{
get value(){return this._getter('value')}
set value(v){this._setter('value',v)}
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
}
$p.CchPredefined_elmntsElmntsRow = CchPredefined_elmntsElmntsRow;
class CchPredefined_elmntsManager extends ChartOfCharacteristicManager {

  constructor(owner, class_name) {
    super(owner, class_name);
    Object.defineProperty(this, 'parents', {
      value: {}
    });

    const {md, doc, adapters} = this._owner.$p;

    adapters.pouch.once('pouch_doc_ram_loaded', () => {
      // загружаем предопределенные элементы
      this.job_prms();
      // рассчеты, помеченные, как шаблоны, загрузим в память заранее
      doc.calc_order.load_templates && setTimeout(doc.calc_order.load_templates.bind(doc.calc_order), 1000);
      // даём возможность завершиться другим обработчикам, подписанным на _pouch_load_data_loaded_
      setTimeout(() => md.emit('predefined_elmnts_inited'), 100);
    });
  }

  /**
   * этот метод адаптер вызывает перед загрузкой doc_ram
   */
  job_prms() {

    // создаём константы из alatable
    for(const o of this) {
      this.job_prm(o);
    }

    // дополним автовычисляемыми свойствами, если им не назначены формулы
    const {job_prm: {properties}} = this._owner.$p;
    if(properties) {
      const {calculated, width, length} = properties;
      if(width && !width.is_calculated) {
        calculated.push(width);
        width._calculated_value = {execute: (obj) => obj && obj.calc_order_row && obj.calc_order_row.width || 0};
      }
      if(length && !length.is_calculated) {
        calculated.push(length);
        length._calculated_value = {execute: (obj) => obj && obj.calc_order_row && obj.calc_order_row.len || 0};
      }
    }
  }

  /**
   * создаёт константу
   * @param row
   */
  job_prm(row) {
    if(row.is_folder || row._obj?.is_folder) {
      return;
    }
    const {parents, _owner} = this;
    const {job_prm, md, utils, enm: {inserts_glass_types: igt}, cat: {property_values_hierarchy: vh}} = _owner.$p;
    const parent = job_prm[parents[row.parent.valueOf()]];
    const _mgr = row.type.is_ref && md.mgr_by_class_name(row.type.types[0]);

    if(parent) {
      if(parent.synonym === 'lists' || !row.synonym) {
        return;
      }
      if(parent.hasOwnProperty(row.synonym)) {
        delete parent[row.synonym];
      }

      if(row.list == -1) {
        parent.__define(row.synonym, {
          value: (() => {
            const res = {};
            (row.elmnts._obj || row.elmnts).forEach(({elm, value}) => {
              if(elm !== undefined) {
                res[elm.valueOf()] = _mgr ? _mgr.get(value, false, false) : value;
              }
            });
            return res;
          })(),
          configurable: true,
          enumerable: true,
          writable: true,
        });
      }
      else if(row.list) {
        if(row.synonym === 'glass_chains') {
          const value = [];
          const tmp = [];
          let name;
          for(const elm of row.elmnts) {
            if(elm.elm) {
              name = elm.elm;
            }
            if(elm.value) {
              tmp.push(igt.get(elm.value));
            }
            else {
              if(tmp.length) {
                const chain = tmp.splice(0);
                if(name) {
                  Object.defineProperty(chain, 'name', {value: utils.is_guid(name) ? vh.get(name) : name});
                  name = '';
                }
                value.push(chain);
              }
            }
          }
          parent.__define(row.synonym, {
            value,
            configurable: true,
            enumerable: true,
          });
        }
        else {
          parent.__define(row.synonym, {
            value: (row.elmnts._obj || row.elmnts).map((row) => {
              if(_mgr) {
                const value = _mgr.get(row.value, false, false);
                if(!utils.is_empty_guid(row.elm)) {
                  value._formula = row.elm;
                }
                return value;
              }
              else {
                return row.value;
              }
            }),
            configurable: true,
            enumerable: true,
            writable: true,
          });
        }
      }
      else if(row.predefined_name === 'abonent') {
        const {by_ref} = $p.cch.properties;
        row.elmnts.forEach((row) => {
          const property = by_ref[row.property];
          if(!property || !property.predefined_name) return;
          const _mgr = property.type.is_ref && md.mgr_by_class_name(property.type.types[0]);
          parent.__define(property.predefined_name, {
            value: _mgr ? _mgr.get(row.value, false, false) : row.value,
            configurable: true,
            enumerable: true,
            writable: true,
          });
        });
      }
      else {
        parent.__define(row.synonym, {
          value: _mgr ? _mgr.get(row.value, false, false) : row.value,
          configurable: true,
          enumerable: true,
          writable: true,
        });
      }
    }
    else {
      $p.record_log({
        class: 'error',
        note: `no parent for ${row.synonym}`,
      });
    }
  }

  /**
   * переопределяем load_array
   * @param aattr {Array.<Object>}
   * @param [forse] {Boolean}
   * @override
   */
  load_array(aattr, forse) {
    const {parents, _owner} = this;
    const {job_prm} = _owner.$p;
    const elmnts = [];
    // метод по умолчанию
    super.load_array(aattr, forse);
    for (const row of aattr) {
      // если элемент является папкой, создаём раздел в job_prm
      if(row.is_folder && row.synonym) {
        parents[row.ref] = row.synonym;
        !job_prm[row.synonym] && job_prm.__define(row.synonym, {value: {}});
      }
    }
  }

}
$p.cch.create('predefined_elmnts', CchPredefined_elmntsManager, false);
class CchProperties extends CatObj{
get shown(){return this._getter('shown')}
set shown(v){this._setter('shown',v)}
get sorting_field(){return this._getter('sorting_field')}
set sorting_field(v){this._setter('sorting_field',v)}
get extra_values_owner(){return this._getter('extra_values_owner')}
set extra_values_owner(v){this._setter('extra_values_owner',v)}
get available(){return this._getter('available')}
set available(v){this._setter('available',v)}
get mandatory(){return this._getter('mandatory')}
set mandatory(v){this._setter('mandatory',v)}
get include_to_name(){return this._getter('include_to_name')}
set include_to_name(v){this._setter('include_to_name',v)}
get list(){return this._getter('list')}
set list(v){this._setter('list',v)}
get caption(){return this._getter('caption')}
set caption(v){this._setter('caption',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get destination(){return this._getter('destination')}
set destination(v){this._setter('destination',v)}
get tooltip(){return this._getter('tooltip')}
set tooltip(v){this._setter('tooltip',v)}
get is_extra_property(){return this._getter('is_extra_property')}
set is_extra_property(v){this._setter('is_extra_property',v)}
get include_to_description(){return this._getter('include_to_description')}
set include_to_description(v){this._setter('include_to_description',v)}
get calculated(){return this._getter('calculated')}
set calculated(v){this._setter('calculated',v)}
get showcalc(){return this._getter('showcalc')}
set showcalc(v){this._setter('showcalc',v)}
get inheritance(){return this._getter('inheritance')}
set inheritance(v){this._setter('inheritance',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get predefined_name(){return this._getter('predefined_name')}
set predefined_name(v){this._setter('predefined_name',v)}
get type(){const {type} = this._obj; return typeof type === 'object' ? type : {types: []}}
set type(v){this._obj.type = typeof v === 'object' ? v : {types: []}}
get applying(){return this._getter_ts('applying')}
set applying(v){this._setter_ts('applying',v)}
get use(){return this._getter_ts('use')}
set use(v){this._setter_ts('use',v)}
get hide(){return this._getter_ts('hide')}
set hide(v){this._setter_ts('hide',v)}


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
    else if(this.inheritance === 5) {
      return this.template_value({project: elm.project, cnstr, ox});
    }

    let prow, cnstr0, elm0;
    const {product_params, params} = ox;
    const find_nearest = () => {
      if(cnstr && ox.constructions) {
        cnstr0 = cnstr;
        elm0 = elm;
        elm = {};
        const crow = ox.constructions.find({cnstr});
        crow && ox.constructions.find_rows({parent: crow.parent || cnstr0}, (row) => {
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
    case comparison_types.lke:
    case comparison_types.nlk:

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
      if(type.digits && !v && type.types.includes('cat.values_options')) {
        return 0;
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
   * Значение из шаблона
   * @param [project] {Scheme}
   * @param [cnstr] {Number}
   * @param [ox] {CatCharacteristics}
   */
  template_value({project, cnstr = 0, ox}) {
    const {params} = ox.base_block;
    let prow;
    params.find_rows({
      param: this,
      cnstr: cnstr ? {in: [0, cnstr]} : 0,
    }, (row) => {
      if(!prow || row.cnstr) {
        prow = row;
      }
    });
    return prow ? prow.value : this.fetch_type();
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
  }}
$p.CchProperties = CchProperties;
class CchPropertiesApplyingRow extends TabularSectionRow{
get elm_type(){return this._getter('elm_type')}
set elm_type(v){this._setter('elm_type',v)}
get pos(){return this._getter('pos')}
set pos(v){this._setter('pos',v)}
}
$p.CchPropertiesApplyingRow = CchPropertiesApplyingRow;
class CchPropertiesUseRow extends TabularSectionRow{
get count_calc_method(){return this._getter('count_calc_method')}
set count_calc_method(v){this._setter('count_calc_method',v)}
}
$p.CchPropertiesUseRow = CchPropertiesUseRow;
class CchPropertiesHideRow extends TabularSectionRow{
get value(){return this._getter('value')}
set value(v){this._setter('value',v)}
}
$p.CchPropertiesHideRow = CchPropertiesHideRow;
class CchPropertiesManager extends ChartOfCharacteristicManager {

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
$p.cch.create('properties', CchPropertiesManager, false);
class CatParams_links extends CatObj{
get master(){return this._getter('master')}
set master(v){this._setter('master',v)}
get slave(){return this._getter('slave')}
set slave(v){this._setter('slave',v)}
get hide(){return this._getter('hide')}
set hide(v){this._setter('hide',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get use_master(){return this._getter('use_master')}
set use_master(v){this._setter('use_master',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get leadings(){return this._getter_ts('leadings')}
set leadings(v){this._setter_ts('leadings',v)}
get values(){return this._getter_ts('values')}
set values(v){this._setter_ts('values',v)}


  /**
   * Дополеняет массив разрешенными в текущей связи значениями
   * @param values {Array}
   * @param with_clr_grp {Boolean} - с учетом цветоценовых групп
   * @return {Array}
   */
  append_values(values = []) {
    this.values.forEach((row) => {
      if(row.value instanceof CatColor_price_groups) {
        for(const value of row.value.clrs()) {
          values.push({
            value,
            _obj: {value: value.valueOf()},
          });
        }
      }
      else if(row.value && row.value.is_folder) {
        row.value._manager.find_rows({parent: row.value}, (value) => {
          !value.is_folder && values.push({
            value,
            _obj: {value: value.valueOf()},
          });
        });
      }
      else {
        values.push(row);
      }
    });
    return values;
  }}
$p.CatParams_links = CatParams_links;
class CatParams_linksLeadingsRow extends TabularSectionRow{
get key(){return this._getter('key')}
set key(v){this._setter('key',v)}
}
$p.CatParams_linksLeadingsRow = CatParams_linksLeadingsRow;
class CatParams_linksValuesRow extends TabularSectionRow{
get value(){return this._getter('value')}
set value(v){this._setter('value',v)}
get by_default(){return this._getter('by_default')}
set by_default(v){this._setter('by_default',v)}
get forcibly(){return this._getter('forcibly')}
set forcibly(v){this._setter('forcibly',v)}
}
$p.CatParams_linksValuesRow = CatParams_linksValuesRow;
$p.cat.create('params_links');
class CatChoice_params extends CatObj{
get key(){return this._getter('key')}
set key(v){this._setter('key',v)}
get runtime(){return this._getter('runtime')}
set runtime(v){this._setter('runtime',v)}
get condition_formula(){return this._getter('condition_formula')}
set condition_formula(v){this._setter('condition_formula',v)}
get field(){return this._getter('field')}
set field(v){this._setter('field',v)}
get disabled(){return this._getter('disabled')}
set disabled(v){this._setter('disabled',v)}
get composition(){return this._getter_ts('composition')}
set composition(v){this._setter_ts('composition',v)}
}
$p.CatChoice_params = CatChoice_params;
class CatChoice_paramsCompositionRow extends TabularSectionRow{
get field(){return this._getter('field')}
set field(v){this._setter('field',v)}
}
$p.CatChoice_paramsCompositionRow = CatChoice_paramsCompositionRow;
class CatChoice_paramsManager extends CatManager {

  load_array(aattr, forse) {
    const objs = super.load_array(aattr, forse);
    const {md, utils} = $p;
    // бежим по загруженным объектам
    for(const obj of objs) {
      // учитываем только те, что не runtime
      if(obj.runtime) {
        continue;
      }
      // пропускаем отключенные
      if(obj.disabled) {
        continue;
      }
      // выполняем формулу условия
      if(!obj.condition_formula.empty() && !obj.condition_formula.execute(obj)) {
        continue;
      }
      // для всех полей из состава метаданных
      obj.composition.forEach(({field}) => {
        const path = field.split('.');
        const mgr = md.mgr_by_class_name(`${path[0]}.${path[1]}`);
        if(!mgr) {
          return;
        }
        // получаем метаданные поля
        let mf = mgr.metadata(path[2]);
        if(path.length >= 4) {
          mf = mf.fields[path[3]];
        }
        if(!mf) {
          return;
        }
        if(!mf.choice_params) {
          mf.choice_params = [];
        }
        // дополняем отбор с поддержкой групп ИЛИ
        const or = new Map();
        for(const row of obj.key.params) {
          if(!or.has(row.area)) {
            or.set(row.area, []);
          }
          or.get(row.area).push(row);
        }
        if(or.size > 1) {
          const vmgr = md.mgr_by_class_name(mf.type.types[0]);
          if(vmgr) {
            const path = new Set();
            for(const grp of or.values()) {
              for(const row of grp) {
                const {_obj, comparison_type, property} = row;
                let v
                if(!property.empty()) {
                  v = property.extract_value(row);
                }
                else if(_obj.txt_row) {
                  v = _obj.txt_row.split(',');
                }
                else if(_obj.value) {
                  v = _obj.value;
                }
                vmgr.find_rows({[obj.field || 'ref']: {[comparison_type.valueOf()]: v}}, (o) => {
                  path.add(o);
                });
              }  
            }            
            mf.choice_params.push({
              name: obj.field || 'ref',
              path: {in: Array.from(path)}
            });
          }
        }
        else {
          obj.key.params.forEach((row) => {
            const {_obj, comparison_type, property} = row;
            let v
            if(!property.empty()) {
              v = property.extract_value(row);
            }
            else if(_obj.txt_row) {
              v = _obj.txt_row.split(',');
            }
            else if(_obj.value) {
              v = _obj.value;
            }
            else {
              return;
            }
            mf.choice_params.push({
              name: obj.field || 'ref',
              path: {[comparison_type.valueOf()]: v}
            });
          });
        }
      });
    }
    return objs;
  }
}
$p.cat.create('choice_params', CatChoice_paramsManager, false);
class CatPartner_bank_accounts extends CatObj{
get account_number(){return this._getter('account_number')}
set account_number(v){this._setter('account_number',v)}
get bank(){return this._getter('bank')}
set bank(v){this._setter('bank',v)}
get settlements_bank(){return this._getter('settlements_bank')}
set settlements_bank(v){this._setter('settlements_bank',v)}
get correspondent_text(){return this._getter('correspondent_text')}
set correspondent_text(v){this._setter('correspondent_text',v)}
get appointments_text(){return this._getter('appointments_text')}
set appointments_text(v){this._setter('appointments_text',v)}
get funds_currency(){return this._getter('funds_currency')}
set funds_currency(v){this._setter('funds_currency',v)}
get bank_bic(){return this._getter('bank_bic')}
set bank_bic(v){this._setter('bank_bic',v)}
get bank_name(){return this._getter('bank_name')}
set bank_name(v){this._setter('bank_name',v)}
get bank_correspondent_account(){return this._getter('bank_correspondent_account')}
set bank_correspondent_account(v){this._setter('bank_correspondent_account',v)}
get bank_city(){return this._getter('bank_city')}
set bank_city(v){this._setter('bank_city',v)}
get bank_address(){return this._getter('bank_address')}
set bank_address(v){this._setter('bank_address',v)}
get bank_phone_numbers(){return this._getter('bank_phone_numbers')}
set bank_phone_numbers(v){this._setter('bank_phone_numbers',v)}
get settlements_bank_bic(){return this._getter('settlements_bank_bic')}
set settlements_bank_bic(v){this._setter('settlements_bank_bic',v)}
get settlements_bank_correspondent_account(){return this._getter('settlements_bank_correspondent_account')}
set settlements_bank_correspondent_account(v){this._setter('settlements_bank_correspondent_account',v)}
get settlements_bank_city(){return this._getter('settlements_bank_city')}
set settlements_bank_city(v){this._setter('settlements_bank_city',v)}
get owner(){return this._getter('owner')}
set owner(v){this._setter('owner',v)}
}
$p.CatPartner_bank_accounts = CatPartner_bank_accounts;
$p.cat.create('partner_bank_accounts');
class CatWork_center_kinds extends CatObj{
get applying(){return this._getter('applying')}
set applying(v){this._setter('applying',v)}
get available(){return this._getter('available')}
set available(v){this._setter('available',v)}
get predefined_name(){return this._getter('predefined_name')}
set predefined_name(v){this._setter('predefined_name',v)}
}
$p.CatWork_center_kinds = CatWork_center_kinds;
$p.cat.create('work_center_kinds');
class CatProperty_values_hierarchy extends CatObj{
get heft(){return this._getter('heft')}
set heft(v){this._setter('heft',v)}
get owner(){return this._getter('owner')}
set owner(v){this._setter('owner',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
}
$p.CatProperty_values_hierarchy = CatProperty_values_hierarchy;
$p.cat.create('property_values_hierarchy');
class CatBanks_qualifier extends CatObj{
get correspondent_account(){return this._getter('correspondent_account')}
set correspondent_account(v){this._setter('correspondent_account',v)}
get city(){return this._getter('city')}
set city(v){this._setter('city',v)}
get address(){return this._getter('address')}
set address(v){this._setter('address',v)}
get phone_numbers(){return this._getter('phone_numbers')}
set phone_numbers(v){this._setter('phone_numbers',v)}
get activity_ceased(){return this._getter('activity_ceased')}
set activity_ceased(v){this._setter('activity_ceased',v)}
get swift(){return this._getter('swift')}
set swift(v){this._setter('swift',v)}
get inn(){return this._getter('inn')}
set inn(v){this._setter('inn',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
}
$p.CatBanks_qualifier = CatBanks_qualifier;
$p.cat.create('banks_qualifier');
class CatDestinations extends CatObj{
get predefined_name(){return this._getter('predefined_name')}
set predefined_name(v){this._setter('predefined_name',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
get extra_properties(){return this._getter_ts('extra_properties')}
set extra_properties(v){this._setter_ts('extra_properties',v)}
}
$p.CatDestinations = CatDestinations;
class CatDestinationsExtra_fieldsRow extends TabularSectionRow{
get property(){return this._getter('property')}
set property(v){this._setter('property',v)}
get _deleted(){return this._getter('_deleted')}
set _deleted(v){this._setter('_deleted',v)}
}
$p.CatDestinationsExtra_fieldsRow = CatDestinationsExtra_fieldsRow;
class CatDestinationsExtra_propertiesRow extends TabularSectionRow{
get property(){return this._getter('property')}
set property(v){this._setter('property',v)}
get _deleted(){return this._getter('_deleted')}
set _deleted(v){this._setter('_deleted',v)}
}
$p.CatDestinationsExtra_propertiesRow = CatDestinationsExtra_propertiesRow;
$p.cat.create('destinations');
class CatCountries extends CatObj{
get name_full(){return this._getter('name_full')}
get alpha2(){return this._getter('alpha2')}
get alpha3(){return this._getter('alpha3')}
get predefined_name(){return this._getter('predefined_name')}
}
$p.CatCountries = CatCountries;
$p.cat.create('countries');
class CatFormulas extends CatObj{
get formula(){return this._getter('formula')}
set formula(v){this._setter('formula',v)}
get leading_formula(){return this._getter('leading_formula')}
set leading_formula(v){this._setter('leading_formula',v)}
get condition_formula(){return this._getter('condition_formula')}
set condition_formula(v){this._setter('condition_formula',v)}
get definition(){return this._getter('definition')}
set definition(v){this._setter('definition',v)}
get template(){return this._getter('template')}
set template(v){this._setter('template',v)}
get sorting_field(){return this._getter('sorting_field')}
set sorting_field(v){this._setter('sorting_field',v)}
get async(){return this._getter('async')}
set async(v){this._setter('async',v)}
get disabled(){return this._getter('disabled')}
set disabled(v){this._setter('disabled',v)}
get context(){return this._getter('context')}
set context(v){this._setter('context',v)}
get jsx(){return this._getter('jsx')}
set jsx(v){this._setter('jsx',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get predefined_name(){return this._getter('predefined_name')}
set predefined_name(v){this._setter('predefined_name',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get params(){return this._getter_ts('params')}
set params(v){this._setter_ts('params',v)}


  execute(obj, attr) {

    const {_manager, _data, ref} = this;
    const {$p} = _manager._owner;
    const {ireg, msg, ui} = $p;

    // создаём функцию из текста формулы
    if(!_data._formula && this.formula){
      try{
        if(this.jsx) {
          _data._formula = new Function('$p', this.formula)($p);
        }
        else {
          if(this.async) {
            const AsyncFunction = Object.getPrototypeOf(eval('(async function(){})')).constructor;
            _data._formula = (new AsyncFunction('obj,$p,attr', this.formula)).bind(this);
          }
          else {
            _data._formula = (new Function('obj,$p,attr', this.formula)).bind(this);
          }
        }
      }
      catch(err){
        _data._formula = () => false;
        $p.record_log(err);
      }
    }

    const {_formula} = _data;

    if(this.parent == _manager.predefined('printing_plates')) {

      if(!_formula) {
        msg.show_msg({
          title: msg.bld_title,
          type: 'alert-error',
          text: `Ошибка в формуле<br /><b>${this.name}</b>`
        });
        return Promise.resolve();
      }

      // рендерим jsx в новое окно
      if(this.jsx) {
        return ui.dialogs.window({
          Component: _formula,
          title: this.name,
          //print: true,
          obj,
          attr,
        });
      }

      // получаем HTMLDivElement с отчетом
      ireg.log?.timeStart?.(ref);
      return _formula(obj, $p, attr)

      // показываем отчет в отдельном окне
        .then((doc) => {
          ireg.log?.timeEnd?.(ref);
          $p.SpreadsheetDocument && doc instanceof $p.SpreadsheetDocument && doc.print();
        })
        .catch(err => {
          ireg.log?.timeEnd?.(ref, err);
          throw err;
        });

    }
    else {
      ireg.log?.timeStart?.(ref);
      const res = _formula && _formula(obj, $p, attr);
      ireg.log?.timeEnd?.(ref);
      return res;
    }
  }

  get _template() {
    const {_data, _manager} = this;
    if(!_data._template){
      const {SpreadsheetDocument} = _manager._owner.$p;
      if(SpreadsheetDocument) {
        _data._template = new SpreadsheetDocument(this.template);
      }
    }
    return _data._template;
  }
}
$p.CatFormulas = CatFormulas;
class CatFormulasManager extends CatManager {

  constructor(owner, class_name) {
    super(owner, class_name);
    $p.adapters.pouch.once('pouch_doc_ram_start', this.load_formulas.bind(this));
  }

  load_formulas(src) {
    const {md, utils, wsql} = $p;
    const {isNode, isBrowser} = wsql.alasql.utils;
    const parents = [this.predefined('printing_plates'), this.predefined('modifiers')];
    const filtered = [];
    (src || this).forEach((v) => {
      if(!v.disabled && parents.includes(v.parent)){
        if(v.context === 1 && !isBrowser || v.context === 2 && !isNode) {
          return;
        }
        filtered.push(v);
      }
    });

    const compare = utils.sort('name');

    filtered.sort(utils.sort('sorting_field')).forEach((formula) => {
      // формируем списки печатных форм и внешних обработок
      if(formula.parent == parents[0]) {
        formula.params.find_rows({param: 'destination'}, (dest) => {
          const dmgr = md.mgr_by_class_name(dest.value);
          if(dmgr) {
            const tmp = dmgr._printing_plates ? Object.values(dmgr._printing_plates) : [];
            tmp.push(formula);
            tmp.sort(compare);
            dmgr._printing_plates = {};
            for(const elm of tmp) {
              dmgr._printing_plates[`prn_${elm.ref}`] = elm;
            }
          }
        });
      }
      else {
        // выполняем модификаторы
        try {
          const res = formula.execute();
          // еслм модификатор вернул задание кроносу - добавляем планировщик
          res && utils.cron && utils.cron(res);
        }
        catch (err) {
        }
      }
    });
  }

  // переопределяем load_array - не грузим неактивные формулы
  load_array(aattr, forse) {
    const res = super.load_array(aattr.filter((v) => !v.disabled || v.is_folder), forse);
    const modifiers = this.predefined('modifiers');
    for(const doc of res) {
      const {_data, parent} = doc;
      if(_data._formula) {
        _data._formula = null;
        if(parent === modifiers) {
          $p.record_log(`runtime modifier '${doc.name}'`);
        }
      }
      if(_data._template) {
        _data._template = null;
      }
    }
  }

}
$p.cat.create('formulas', CatFormulasManager, false);
class CatElm_visualization extends CatObj{
get svg_path(){return this._getter('svg_path')}
set svg_path(v){this._setter('svg_path',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get attributes(){return this._getter('attributes')}
set attributes(v){this._setter('attributes',v)}
get rotate(){return this._getter('rotate')}
set rotate(v){this._setter('rotate',v)}
get offset(){return this._getter('offset')}
set offset(v){this._setter('offset',v)}
get side(){return this._getter('side')}
set side(v){this._setter('side',v)}
get elm_side(){return this._getter('elm_side')}
set elm_side(v){this._setter('elm_side',v)}
get cx(){return this._getter('cx')}
set cx(v){this._setter('cx',v)}
get cy(){return this._getter('cy')}
set cy(v){this._setter('cy',v)}
get angle_hor(){return this._getter('angle_hor')}
set angle_hor(v){this._setter('angle_hor',v)}
get priority(){return this._getter('priority')}
set priority(v){this._setter('priority',v)}
get mode(){return this._getter('mode')}
set mode(v){this._setter('mode',v)}
get origin(){return this._getter('origin')}
set origin(v){this._setter('origin',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get predefined_name(){return this._getter('predefined_name')}
set predefined_name(v){this._setter('predefined_name',v)}
get sketch_view(){return this._getter_ts('sketch_view')}
set sketch_view(v){this._setter_ts('sketch_view',v)}
get params(){return this._getter_ts('params')}
set params(v){this._setter_ts('params',v)}


  /**
   * Рисует визуализацию
   * @param elm {BuilderElement} элемент, к которому привязана визуализация
   * @param layer {Contour} слой, в который помещаем путь
   * @param offset {Number|Array.<Number>}
   * @param clr {CatClrs}
   * @param [offset0] {Number}
   * @param [reflected] {Boolean}
   */
  draw({elm, layer, offset, clr, offset0, reflected}) {
    if(!layer.isInserted()) {
      return;
    }
    // проверим, надо ли рисовать для текущего `reflected`
    let dashArray = undefined;
    let exit = this.sketch_view.count();
    for(const {kind} of this.sketch_view) {
      if(reflected) {
        if(kind.is('outer')) {
          exit = 0;
        }
        if(kind.is('outer1')) {
          exit = 0;
          dashArray = [3, 4];
        }        
      }
      else {
        if((kind.is('inner'))) {
          exit = 0;
        }
        if((kind.is('inner1'))) {
          exit = 0;
          dashArray = [3, 4];
        }
      }
    }
    

    try {
      const {project} = layer;
      const {CompoundPath, PointText, Path, constructor} = project._scope;

      let subpath;

      if(this.svg_path.indexOf('{"method":') == 0){

        const attr = JSON.parse(this.svg_path);
        if(attr.dashArray){
          dashArray = attr.dashArray;
        }

        if(['subpath_inner', 'subpath_outer', 'subpath_generatrix', 'subpath_median'].includes(attr.method)) {
          const {rays} = elm;
          if(!rays) {
            return;
          }
          if(attr.method == 'subpath_outer') {
            subpath = rays.outer.get_subpath(elm.corns(1), elm.corns(2)).equidistant(attr.offset || 10);
          }
          else if(attr.method == 'subpath_inner') {
            subpath = rays.inner.get_subpath(elm.corns(3), elm.corns(4)).equidistant(attr.offset || 10);
          }
          else if(attr.method == 'subpath_median') {
            if(elm.is_linear()) {
              subpath = new Path({
                project,
                dashArray,
                segments: [elm.corns(1).add(elm.corns(4)).divide(2), elm.corns(2).add(elm.corns(3)).divide(2)]
              })
                .equidistant(attr.offset || 0);
            }
            else {
              const inner = rays.inner.get_subpath(elm.corns(3), elm.corns(4));
              inner.reverse();
              const outer = rays.outer.get_subpath(elm.corns(1), elm.corns(2));
              const li = inner.length / 50;
              const lo = outer.length / 50;
              subpath = new Path({project, dashArray});
              for(let i = 0; i < 50; i++) {
                subpath.add(inner.getPointAt(li * i).add(outer.getPointAt(lo * i)).divide(2));
              }
              subpath.simplify(0.8);
              if(attr.offset) {
                subpath = subpath.equidistant(attr.offset);
              }
            }
          }
          else {
            if(this.mode === 3) {
              const outer = offset0 < 0;
              attr.offset -= -elm.d1 + elm.width;
              if(outer) {
                offset0 = -offset0;
                attr.offset = -(attr.offset || 0);
              }
              const b = elm.generatrix.getPointAt(offset0 || 0);
              const e = elm.generatrix.getPointAt((offset0 + offset) || elm.generatrix.length);
              subpath = elm.generatrix.get_subpath(b, e).equidistant(attr.offset || 0);
            }
            else {
              subpath = elm.generatrix.get_subpath(elm.b, elm.e).equidistant(attr.offset || 0);
            }
          }
          subpath.parent = layer.by_spec;
          subpath.strokeWidth = attr.strokeWidth || 4;
          subpath.strokeColor = attr.strokeColor || 'red';
          subpath.strokeCap = attr.strokeCap || 'round';
        }
      }
      else if(this.svg_path){

        if(this.mode === 1) {
          //const attr = JSON.parse(this.attributes || '{}');
          const {attributes} = this;
          subpath = new PointText(Object.assign({
            project,
            layer,
            parent: layer.by_spec,
            fillColor: 'black',
            dashArray,
            fontFamily: $p.job_prm.builder.font_family,
            fontSize: attributes.fontSize || 60,
            content: this.svg_path,
          }, attributes, this.origin.empty() ? null : {_visualization: true, guide: false}));
        }
        else {
          subpath = new CompoundPath(Object.assign({
            project,
            layer,
            parent: layer.by_spec,
            pathData: this.svg_path,
            strokeColor: 'black',
            fillColor: elm.constructor.clr_by_clr.call(elm, clr.empty() ? elm._row.clr : clr),
            strokeScaling: false,
            dashArray,
            pivot: [0, 0],
            opacity: elm.opacity
          }, this.origin.empty() ? null : {_visualization: true, guide: false}));
        }

        if(elm instanceof constructor.Filling) {
          subpath.position = elm.bounds.topLeft.add(offset);
        }
        else {
          const {generatrix, rays: {inner, outer}} = elm;
          // угол касательной
          let angle_hor;
          if(elm.is_linear() || offset < 0) {
            angle_hor = generatrix.getTangentAt(0).angle;
          }           
          else if(offset > generatrix.length) {
            angle_hor = generatrix.getTangentAt(generatrix.length).angle;
          }
          else {
            angle_hor = generatrix.getTangentAt(offset).angle;
          }

          if((this.rotate != -1 || elm.orientation == $p.enm.orientations.Горизонтальная) && angle_hor != this.angle_hor){
            subpath.rotation = angle_hor - this.angle_hor;
          }

          offset += generatrix.getOffsetOf(generatrix.getNearestPoint(elm.corns(1)));

          const p0 = generatrix.getPointAt(offset > generatrix.length ? generatrix.length : offset || 0);

          if(this.elm_side == -1){
            // в середине элемента
            const p1 = inner.getNearestPoint(p0);
            const p2 = outer.getNearestPoint(p0);

            subpath.position = p1.add(p2).divide(2);

          }else if(!this.elm_side){
            // изнутри
            subpath.position = inner.getNearestPoint(p0);

          }else{
            // снаружи
            subpath.position = outer.getNearestPoint(p0);
          }
        }
      }
      if(!this.origin.empty()) {
        subpath.on({
          mouseenter(event) {
            this.strokeWidth = 1.4;
            project._scope.canvas_cursor(`cursor-text-select`);
          },
          mouseleave(event) {
            this.strokeWidth = 1;
            project._scope.canvas_cursor('cursor-arrow-white');
          },
          mousedown(event) {
            event.stop();
          },
          click(event) {
            event.stop();
          },
        });
      }
    }
    catch (e) {
      console.log(e);
    }

  }}
$p.CatElm_visualization = CatElm_visualization;
class CatElm_visualizationSketch_viewRow extends TabularSectionRow{
get kind(){return this._getter('kind')}
set kind(v){this._setter('kind',v)}
}
$p.CatElm_visualizationSketch_viewRow = CatElm_visualizationSketch_viewRow;
class CatElm_visualizationParamsRow extends TabularSectionRow{
get param(){return this._getter('param')}
set param(v){this._setter('param',v)}
}
$p.CatElm_visualizationParamsRow = CatElm_visualizationParamsRow;
$p.cat.create('elm_visualization');
class CatBranches extends CatObj{
get suffix(){return this._getter('suffix')}
set suffix(v){this._setter('suffix',v)}
get lang(){return this._getter('lang')}
set lang(v){this._setter('lang',v)}
get direct(){return this._getter('direct')}
set direct(v){this._setter('direct',v)}
get use(){return this._getter('use')}
set use(v){this._setter('use',v)}
get no_mdm(){return this._getter('no_mdm')}
set no_mdm(v){this._setter('no_mdm',v)}
get no_partners(){return this._getter('no_partners')}
set no_partners(v){this._setter('no_partners',v)}
get no_divisions(){return this._getter('no_divisions')}
set no_divisions(v){this._setter('no_divisions',v)}
get filter(){return this._getter('filter')}
set filter(v){this._setter('filter',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get organizations(){return this._getter_ts('organizations')}
set organizations(v){this._setter_ts('organizations',v)}
get partners(){return this._getter_ts('partners')}
set partners(v){this._setter_ts('partners',v)}
get divisions(){return this._getter_ts('divisions')}
set divisions(v){this._setter_ts('divisions',v)}
get price_types(){return this._getter_ts('price_types')}
set price_types(v){this._setter_ts('price_types',v)}
get keys(){return this._getter_ts('keys')}
set keys(v){this._setter_ts('keys',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
}
$p.CatBranches = CatBranches;
class CatBranchesOrganizationsRow extends TabularSectionRow{
get acl_obj(){return this._getter('acl_obj')}
set acl_obj(v){this._setter('acl_obj',v)}
get by_default(){return this._getter('by_default')}
set by_default(v){this._setter('by_default',v)}
}
$p.CatBranchesOrganizationsRow = CatBranchesOrganizationsRow;
class CatBranchesPartnersRow extends TabularSectionRow{
get acl_obj(){return this._getter('acl_obj')}
set acl_obj(v){this._setter('acl_obj',v)}
get by_default(){return this._getter('by_default')}
set by_default(v){this._setter('by_default',v)}
}
$p.CatBranchesPartnersRow = CatBranchesPartnersRow;
class CatBranchesDivisionsRow extends TabularSectionRow{
get acl_obj(){return this._getter('acl_obj')}
set acl_obj(v){this._setter('acl_obj',v)}
get by_default(){return this._getter('by_default')}
set by_default(v){this._setter('by_default',v)}
}
$p.CatBranchesDivisionsRow = CatBranchesDivisionsRow;
class CatBranchesPrice_typesRow extends TabularSectionRow{
get acl_obj(){return this._getter('acl_obj')}
set acl_obj(v){this._setter('acl_obj',v)}
}
$p.CatBranchesPrice_typesRow = CatBranchesPrice_typesRow;
class CatBranchesKeysRow extends TabularSectionRow{
get acl_obj(){return this._getter('acl_obj')}
set acl_obj(v){this._setter('acl_obj',v)}
}
$p.CatBranchesKeysRow = CatBranchesKeysRow;
class CatBranchesManager extends CatManager {

  constructor (owner, class_name) {
    super(owner, class_name);

    const {adapters: {pouch}, job_prm, enm, cat, dp} = $p;

    // после загрузки данных, надо настроить отборы в метаданных полей рисовалки
    !job_prm.is_node && pouch.once('pouch_complete_loaded', () => {
      const {current_user} = $p;

      // если отделы не загружены и полноправный пользователь...
      let next = Promise.resolve();

      if(job_prm.properties && current_user && !current_user.branch.empty() && job_prm.builder) {

        const {ПараметрВыбора} = enm.parameters_keys_applying;
        const {furn, sys, client_of_dealer_mode} = job_prm.properties;

        // накапливаем
        const branch_filter = job_prm.builder.branch_filter = {furn: [], sys: []};
        next.then(() => current_user.branch.is_new() ? current_user.branch.load() : current_user.branch)
          .then(({keys, divisions}) => {
            const add = ({acl_obj}) => {
              if(acl_obj.applying == ПараметрВыбора) {
                acl_obj.params.forEach(({property, value}) => {
                  if(property === furn) {
                    !branch_filter.furn.includes(value) && branch_filter.furn.push(value);
                  }
                  else if(property === sys) {
                    !branch_filter.sys.includes(value) && branch_filter.sys.push(value);
                  }
                });
              }
            };
            keys.forEach(add);
            divisions.forEach(({acl_obj}) => {
              acl_obj.keys.forEach(add);
              acl_obj.extra_fields.find_rows({property: client_of_dealer_mode}, ({value}) => {
                job_prm.builder.client_of_dealer_mode = value;
              });
            });
          })
          .then(() => {

            // применяем
            if(branch_filter.furn.length) {
              const mf = cat.characteristics.metadata('constructions').fields.furn;
              mf.choice_params.push({
                name: 'ref',
                path: {inh: branch_filter.furn}
              });
            }
            if(branch_filter.sys.length) {
              const mf = dp.buyers_order.metadata().fields.sys;
              mf.choice_params = [{
                name: 'ref',
                path: {inh: branch_filter.sys}
              }];
            }

          })
          .catch((err) => null);

      }
    });
  }

}
$p.cat.create('branches', CatBranchesManager, false);
class CatCashboxes extends CatObj{
get funds_currency(){return this._getter('funds_currency')}
set funds_currency(v){this._setter('funds_currency',v)}
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get current_account(){return this._getter('current_account')}
set current_account(v){this._setter('current_account',v)}
get owner(){return this._getter('owner')}
set owner(v){this._setter('owner',v)}
}
$p.CatCashboxes = CatCashboxes;
$p.cat.create('cashboxes');
class CatCurrencies extends CatObj{
get name_full(){return this._getter('name_full')}
set name_full(v){this._setter('name_full',v)}
get extra_charge(){return this._getter('extra_charge')}
set extra_charge(v){this._setter('extra_charge',v)}
get main_currency(){return this._getter('main_currency')}
set main_currency(v){this._setter('main_currency',v)}
get parameters_russian_recipe(){return this._getter('parameters_russian_recipe')}
set parameters_russian_recipe(v){this._setter('parameters_russian_recipe',v)}


  /**
   * Пересчитывает сумму из валюты в валюту
   * @param amount {Number}
   * @param [date] {Date}
   * @param [to] {CatCurrencies}
   * @return {Number}
   */
  to_currency(amount, date, to) {
    if(this == to){
      return amount;
    }

    const {job_prm: {pricing}, wsql} = $p;

    if(!to || to.empty()){
      to = pricing.main_currency;
    }

    if(!date){
      date = new Date();
    }
    if(!this._manager.cource_sql){
      this._manager.cource_sql = wsql.alasql.compile('select top 1 * from `ireg_currency_courses` where `currency` = ? and `period` <= ? order by `period` desc');
    }

    let cfrom = {course: 1, multiplicity: 1}, cto = {course: 1, multiplicity: 1};
    if(this !== pricing.main_currency){
      const tmp = this._manager.cource_sql([this.ref, date]);
      if(tmp.length) {
        cfrom = tmp[0];
      }
    }
    if(to !== pricing.main_currency){
      const tmp = this._manager.cource_sql([to.ref, date]);
      if(tmp.length) {
        cto = tmp[0];
      }
    }

    return (amount * cfrom.course / cfrom.multiplicity) * cto.multiplicity / cto.course;
  }}
$p.CatCurrencies = CatCurrencies;
$p.cat.create('currencies');
class CatContact_information_kinds extends CatObj{
get mandatory_fields(){return this._getter('mandatory_fields')}
set mandatory_fields(v){this._setter('mandatory_fields',v)}
get type(){return this._getter('type')}
set type(v){this._setter('type',v)}
get predefined_name(){return this._getter('predefined_name')}
set predefined_name(v){this._setter('predefined_name',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
}
$p.CatContact_information_kinds = CatContact_information_kinds;
$p.cat.create('contact_information_kinds');
class CatNom_kinds extends CatObj{
get nom_type(){return this._getter('nom_type')}
set nom_type(v){this._setter('nom_type',v)}
get dnom(){return this._getter('dnom')}
set dnom(v){this._setter('dnom',v)}
get dcharacteristic(){return this._getter('dcharacteristic')}
set dcharacteristic(v){this._setter('dcharacteristic',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
}
$p.CatNom_kinds = CatNom_kinds;
$p.cat.create('nom_kinds');
class CatContracts extends CatObj{
get settlements_currency(){return this._getter('settlements_currency')}
set settlements_currency(v){this._setter('settlements_currency',v)}
get mutual_settlements(){return this._getter('mutual_settlements')}
set mutual_settlements(v){this._setter('mutual_settlements',v)}
get contract_kind(){return this._getter('contract_kind')}
set contract_kind(v){this._setter('contract_kind',v)}
get date(){return this._getter('date')}
set date(v){this._setter('date',v)}
get check_days_without_pay(){return this._getter('check_days_without_pay')}
set check_days_without_pay(v){this._setter('check_days_without_pay',v)}
get allowable_debts_amount(){return this._getter('allowable_debts_amount')}
set allowable_debts_amount(v){this._setter('allowable_debts_amount',v)}
get allowable_debts_days(){return this._getter('allowable_debts_days')}
set allowable_debts_days(v){this._setter('allowable_debts_days',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get check_debts_amount(){return this._getter('check_debts_amount')}
set check_debts_amount(v){this._setter('check_debts_amount',v)}
get check_debts_days(){return this._getter('check_debts_days')}
set check_debts_days(v){this._setter('check_debts_days',v)}
get number_doc(){return this._getter('number_doc')}
set number_doc(v){this._setter('number_doc',v)}
get organization(){return this._getter('organization')}
set organization(v){this._setter('organization',v)}
get main_cash_flow_article(){return this._getter('main_cash_flow_article')}
set main_cash_flow_article(v){this._setter('main_cash_flow_article',v)}
get main_project(){return this._getter('main_project')}
set main_project(v){this._setter('main_project',v)}
get accounting_reflect(){return this._getter('accounting_reflect')}
set accounting_reflect(v){this._setter('accounting_reflect',v)}
get tax_accounting_reflect(){return this._getter('tax_accounting_reflect')}
set tax_accounting_reflect(v){this._setter('tax_accounting_reflect',v)}
get prepayment_percent(){return this._getter('prepayment_percent')}
set prepayment_percent(v){this._setter('prepayment_percent',v)}
get validity(){return this._getter('validity')}
set validity(v){this._setter('validity',v)}
get vat_included(){return this._getter('vat_included')}
set vat_included(v){this._setter('vat_included',v)}
get price_type(){return this._getter('price_type')}
set price_type(v){this._setter('price_type',v)}
get vat_consider(){return this._getter('vat_consider')}
set vat_consider(v){this._setter('vat_consider',v)}
get days_without_pay(){return this._getter('days_without_pay')}
set days_without_pay(v){this._setter('days_without_pay',v)}
get owner(){return this._getter('owner')}
set owner(v){this._setter('owner',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
}
$p.CatContracts = CatContracts;
class CatContractsExtra_fieldsRow extends TabularSectionRow{
get property(){return this._getter('property')}
set property(v){this._setter('property',v)}
get value(){return this._getter('value')}
set value(v){this._setter('value',v)}
get txt_row(){return this._getter('txt_row')}
set txt_row(v){this._setter('txt_row',v)}
}
$p.CatContractsExtra_fieldsRow = CatContractsExtra_fieldsRow;
$p.cat.create('contracts');
class CatNom_units extends CatObj{
get qualifier_unit(){return this._getter('qualifier_unit')}
set qualifier_unit(v){this._setter('qualifier_unit',v)}
get heft(){return this._getter('heft')}
set heft(v){this._setter('heft',v)}
get volume(){return this._getter('volume')}
set volume(v){this._setter('volume',v)}
get coefficient(){return this._getter('coefficient')}
set coefficient(v){this._setter('coefficient',v)}
get rounding_threshold(){return this._getter('rounding_threshold')}
set rounding_threshold(v){this._setter('rounding_threshold',v)}
get owner(){return this._getter('owner')}
set owner(v){this._setter('owner',v)}
}
$p.CatNom_units = CatNom_units;
$p.cat.create('nom_units');
class CatProperty_values extends CatObj{
get heft(){return this._getter('heft')}
set heft(v){this._setter('heft',v)}
get css(){return this._getter('css')}
set css(v){this._setter('css',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get owner(){return this._getter('owner')}
set owner(v){this._setter('owner',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
}
$p.CatProperty_values = CatProperty_values;
$p.cat.create('property_values');
class CatDivisions extends CatObj{
get sorting_field(){return this._getter('sorting_field')}
set sorting_field(v){this._setter('sorting_field',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
get keys(){return this._getter_ts('keys')}
set keys(v){this._setter_ts('keys',v)}
}
$p.CatDivisions = CatDivisions;
class CatDivisionsKeysRow extends TabularSectionRow{
get acl_obj(){return this._getter('acl_obj')}
set acl_obj(v){this._setter('acl_obj',v)}
}
$p.CatDivisionsKeysRow = CatDivisionsKeysRow;
$p.cat.create('divisions');
class CatMeta_ids extends CatObj{
get full_moniker(){return this._getter('full_moniker')}
set full_moniker(v){this._setter('full_moniker',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
}
$p.CatMeta_ids = CatMeta_ids;
$p.cat.create('meta_ids');
class CatUnits extends CatObj{
get name_full(){return this._getter('name_full')}
set name_full(v){this._setter('name_full',v)}
get international_short(){return this._getter('international_short')}
set international_short(v){this._setter('international_short',v)}
}
$p.CatUnits = CatUnits;
$p.cat.create('units');
class CatPartners extends CatObj{
get name_full(){return this._getter('name_full')}
set name_full(v){this._setter('name_full',v)}
get main_bank_account(){return this._getter('main_bank_account')}
set main_bank_account(v){this._setter('main_bank_account',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get inn(){return this._getter('inn')}
set inn(v){this._setter('inn',v)}
get kpp(){return this._getter('kpp')}
set kpp(v){this._setter('kpp',v)}
get ogrn(){return this._getter('ogrn')}
set ogrn(v){this._setter('ogrn',v)}
get okpo(){return this._getter('okpo')}
set okpo(v){this._setter('okpo',v)}
get individual_legal(){return this._getter('individual_legal')}
set individual_legal(v){this._setter('individual_legal',v)}
get main_contract(){return this._getter('main_contract')}
set main_contract(v){this._setter('main_contract',v)}
get identification_document(){return this._getter('identification_document')}
set identification_document(v){this._setter('identification_document',v)}
get buyer_main_manager(){return this._getter('buyer_main_manager')}
set buyer_main_manager(v){this._setter('buyer_main_manager',v)}
get is_buyer(){return this._getter('is_buyer')}
set is_buyer(v){this._setter('is_buyer',v)}
get is_supplier(){return this._getter('is_supplier')}
set is_supplier(v){this._setter('is_supplier',v)}
get primary_contact(){return this._getter('primary_contact')}
set primary_contact(v){this._setter('primary_contact',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get contact_information(){return this._getter_ts('contact_information')}
set contact_information(v){this._setter_ts('contact_information',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
}
$p.CatPartners = CatPartners;
class CatPartnersContact_informationRow extends TabularSectionRow{
get type(){return this._getter('type')}
set type(v){this._setter('type',v)}
get kind(){return this._getter('kind')}
set kind(v){this._setter('kind',v)}
get presentation(){return this._getter('presentation')}
set presentation(v){this._setter('presentation',v)}
get values_fields(){return this._getter('values_fields')}
set values_fields(v){this._setter('values_fields',v)}
get country(){return this._getter('country')}
set country(v){this._setter('country',v)}
get region(){return this._getter('region')}
set region(v){this._setter('region',v)}
get city(){return this._getter('city')}
set city(v){this._setter('city',v)}
get email_address(){return this._getter('email_address')}
set email_address(v){this._setter('email_address',v)}
get phone_number(){return this._getter('phone_number')}
set phone_number(v){this._setter('phone_number',v)}
get phone_without_codes(){return this._getter('phone_without_codes')}
set phone_without_codes(v){this._setter('phone_without_codes',v)}
}
$p.CatPartnersContact_informationRow = CatPartnersContact_informationRow;
$p.cat.create('partners');
class CatNom extends CatObj{
get article(){return this._getter('article')}
set article(v){this._setter('article',v)}
get name_full(){return this._getter('name_full')}
set name_full(v){this._setter('name_full',v)}
get base_unit(){return this._getter('base_unit')}
set base_unit(v){this._setter('base_unit',v)}
get storage_unit(){return this._getter('storage_unit')}
set storage_unit(v){this._setter('storage_unit',v)}
get nom_kind(){return this._getter('nom_kind')}
set nom_kind(v){this._setter('nom_kind',v)}
get nom_group(){return this._getter('nom_group')}
set nom_group(v){this._setter('nom_group',v)}
get price_group(){return this._getter('price_group')}
set price_group(v){this._setter('price_group',v)}
get vat_rate(){return this._getter('vat_rate')}
set vat_rate(v){this._setter('vat_rate',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get elm_type(){return this._getter('elm_type')}
set elm_type(v){this._setter('elm_type',v)}
get len(){return this._getter('len')}
set len(v){this._setter('len',v)}
get width(){return this._getter('width')}
set width(v){this._setter('width',v)}
get thickness(){return this._getter('thickness')}
set thickness(v){this._setter('thickness',v)}
get sizefurn(){return this._getter('sizefurn')}
set sizefurn(v){this._setter('sizefurn',v)}
get sizefaltz(){return this._getter('sizefaltz')}
set sizefaltz(v){this._setter('sizefaltz',v)}
get density(){return this._getter('density')}
set density(v){this._setter('density',v)}
get volume(){return this._getter('volume')}
set volume(v){this._setter('volume',v)}
get arc_elongation(){return this._getter('arc_elongation')}
set arc_elongation(v){this._setter('arc_elongation',v)}
get sizeb(){return this._getter('sizeb')}
set sizeb(v){this._setter('sizeb',v)}
get loss_factor(){return this._getter('loss_factor')}
set loss_factor(v){this._setter('loss_factor',v)}
get rounding_quantity(){return this._getter('rounding_quantity')}
set rounding_quantity(v){this._setter('rounding_quantity',v)}
get clr(){return $p.cat.clrs.getter(this._obj.clr)}
set clr(v){this._setter('clr',v)}
get cutting_optimization_type(){return this._getter('cutting_optimization_type')}
set cutting_optimization_type(v){this._setter('cutting_optimization_type',v)}
get saw_width(){return this._getter('saw_width')}
set saw_width(v){this._setter('saw_width',v)}
get overmeasure(){return this._getter('overmeasure')}
set overmeasure(v){this._setter('overmeasure',v)}
get double_cut(){return this._getter('double_cut')}
set double_cut(v){this._setter('double_cut',v)}
get alp1(){return this._getter('alp1')}
set alp1(v){this._setter('alp1',v)}
get wsnip_min(){return this._getter('wsnip_min')}
set wsnip_min(v){this._setter('wsnip_min',v)}
get wsnip_max(){return this._getter('wsnip_max')}
set wsnip_max(v){this._setter('wsnip_max',v)}
get packing(){return this._getter('packing')}
set packing(v){this._setter('packing',v)}
get pricing(){return this._getter('pricing')}
set pricing(v){this._setter('pricing',v)}
get visualization(){return this._getter('visualization')}
set visualization(v){this._setter('visualization',v)}
get complete_list_sorting(){return this._getter('complete_list_sorting')}
set complete_list_sorting(v){this._setter('complete_list_sorting',v)}
get is_accessory(){return this._getter('is_accessory')}
set is_accessory(v){this._setter('is_accessory',v)}
get is_procedure(){return this._getter('is_procedure')}
set is_procedure(v){this._setter('is_procedure',v)}
get is_service(){return this._getter('is_service')}
set is_service(v){this._setter('is_service',v)}
get is_pieces(){return this._getter('is_pieces')}
set is_pieces(v){this._setter('is_pieces',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
get demand(){return this._getter_ts('demand')}
set demand(v){this._setter_ts('demand',v)}
get colors(){return this._getter_ts('colors')}
set colors(v){this._setter_ts('colors',v)}


  /**
   * Возвращает значение допреквизита группировка
   */
  get grouping() {
    if(!this.hasOwnProperty('_grouping')){
      const {extra_fields, _manager} = this;
      if(!_manager.hasOwnProperty('_grouping')) {
        _manager._grouping = _manager._owner.$p.cch.properties.predefined('grouping');
      }
      if(_manager._grouping) {
        const row = extra_fields.find({property: _manager._grouping});
        this._grouping = row ? row.value.name : '';
      }
      else {
        this._grouping = '';
      }
    }
    return this._grouping;
  }

  /**
   * Возвращает значение допреквизита минимальный объём
   */
  get min_volume() {
    if(!this.hasOwnProperty('_min_volume')){
      const {extra_fields, _manager} = this;
      if(!_manager.hasOwnProperty('_min_volume')) {
        _manager._min_volume = _manager._owner.$p.cch.properties.predefined('min_volume');
      }
      if(_manager._min_volume) {
        const row = extra_fields.find({property: _manager._min_volume});
        this._min_volume = row ? row.value : 0;
      }
      else {
        this._min_volume = 0;
      }
    }
    return this._min_volume;
  }

  /**
   * Представление объекта
   * @return {string}
   */
  get presentation() {
    return (this.article ? this.article + ' ' : '') + this.name;
  }
  set presentation(v) {

  }

  /**
   * Возвращает номенклатуру по ключу цветового аналога
   * @param clr
   * @return {any|CatNom}
   */
  by_clr_key(clr) {
    if(this.clr == clr){
      return this;
    }
    if(!this._clr_keys){
      this._clr_keys = new Map();
    }
    const {_clr_keys} = this;
    if(_clr_keys.has(clr)){
      return _clr_keys.get(clr);
    }
    if(_clr_keys.size){
      return this;
    }

    // получаем ссылку на ключ цветового аналога
    const {job_prm: {properties: {clr_key}}, cat} = $p;
    const clr_value = this._extra(clr_key);
    if(!clr_value){
      return this;
    }

    // находим все номенклатуры с подходящим ключем цветового аналога
    const {ref} = clr_key;
    this._manager.alatable.forEach((nom) => {
      nom.extra_fields && nom.extra_fields.some((row) =>
        row.property === ref && row.value === clr_value && _clr_keys.set(cat.clrs.get(nom.clr), cat.nom.get(nom.ref)));
    });

    // возарвщаем подходящую или себя
    if(_clr_keys.has(clr)){
      return _clr_keys.get(clr);
    }
    if(!_clr_keys.size){
      _clr_keys.set(0, 0);
    }
    return this;
  }

  /**
   * Возвращает цену номенклатуры указанного типа
   * - на дату
   * - с подбором характеристики по цвету
   * - с пересчетом из валюты в валюту
   *
   * @param attr
   * @return {Number|*}
   * @private
   */
  _price(attr) {
    const {
      job_prm: {pricing},
      cat: {
        characteristics: {by_ref: characteristics},
        color_price_groups: {by_ref: color_price_groups},
        clrs: {by_ref: clrs}
      },
      utils,
    } = this._manager._owner.$p;

    let price = 0,
      currency = pricing.main_currency,
      start_date = utils.blank.date;

    if(!attr){
      attr = {currency};
    }
    let {_price, _bprice} = this._data;
    if(attr.branch && _bprice?.has?.(attr.branch)) {
      _price = _bprice.get(attr.branch)
    }
    const {x, y, z, clr, ref, calc_order} = (attr.characteristic || {});

    if(attr.price_type){

      if(utils.is_data_obj(attr.price_type)){
        attr.price_type = attr.price_type.ref;
      }

      if(!attr.characteristic){
        attr.characteristic = utils.blank.guid;
      }
      else if(utils.is_data_obj(attr.characteristic)){
        // если передали уникальную характеристику продкции - ищем простую с тем же цветом и размерами
        // TODO: здесь было бы полезно учесть соответствие цветов??
        attr.characteristic = ref;
        if(!calc_order.empty()){
          const tmp = [];
          for(let clrx in _price) {
            const cx = characteristics[clrx];
            if(cx && cx.clr == clr) {
              // если на подходящую характеристику есть цена по нашему типу цен - запоминаем
              if(_price[clrx][attr.price_type]) {
                if(cx.x && x && cx.x - x < -10) {
                  continue;
                }
                if(cx.y && y && cx.y - y < -10) {
                  continue;
                }
                tmp.push({
                  cx,
                  rate: (cx.x && x ? Math.abs(cx.x - x) : 0) + (cx.y && y ? Math.abs(cx.y - y) : 0) + (cx.z && z && cx.z == z ? 1 : 0)
                });
              }
            }
          }
          if(tmp.length) {
            tmp.sort((a, b) => a.rate - b.rate);
            attr.characteristic = tmp[0].cx.ref;
          }
        }
      }

      if(!attr.date){
        attr.date = new Date();
      }

      // если для номенклатуры существует структура цен, ищем подходящую
      attr.pdate = start_date;
      if(_price){
        if(attr.clr && attr.characteristic == utils.blank.guid) {
          let tmp = 0;
          for (let clrx in _price) {
            const cpg = color_price_groups[clrx] || clrs[clrx];
            if (cpg && cpg.contains(attr.clr, null, true)) {
              if (_price[clrx][attr.price_type]) {
                _price[clrx][attr.price_type].some((row) => {
                  if (row.date > start_date && row.date <= attr.date) {
                    const tprice = row.currency.to_currency(row.price, attr.date, attr.currency);
                    if (tprice > tmp) {
                      tmp = tprice;
                      price = row.price;
                      currency = row.currency;
                      return true;
                    }
                  }
                  else if(row.date > attr.pdate) {
                    attr.pdate = row.date;
                  }
                });
              }
            }
          }
        }
        if(!price && _price[attr.characteristic]){
          if(_price[attr.characteristic][attr.price_type]){
            _price[attr.characteristic][attr.price_type].some((row) => {
              if(row.date > start_date && row.date <= attr.date){
                price = row.price;
                currency = row.currency;
                return true;
              }
            });
          }
        }
        // если нет цены на характеристику, ищем по цвету
        if(!price && attr.clr){
          for(let clrx in _price){
            const cx = characteristics[clrx];
            const cpg = color_price_groups[clrx] || clrs[clrx];
            if((cx && cx.clr == attr.clr) || (cpg && cpg.contains(attr.clr, null, true))){
              if(_price[clrx][attr.price_type]){
                _price[clrx][attr.price_type].some((row) => {
                  if(row.date > start_date && row.date <= attr.date){
                    price = row.price;
                    currency = row.currency;
                    return true;
                  }
                });
                break;
              }
            }
          }
        }
      }
    }

    // если есть формула - выполняем вне зависимости от установленной цены
    if(attr.formula){

      // если нет цены на характеристику, ищем цену без характеристики
      if(!price && _price && _price[utils.blank.guid]){
        if(_price[utils.blank.guid][attr.price_type]){
          _price[utils.blank.guid][attr.price_type].some((row) => {
            if(row.date > start_date && row.date <= attr.date){
              price = row.price;
              currency = row.currency;
              return true;
            }
          });
        }
      }
      // формулу выполняем в любом случае - она может и не опираться на цены из регистра
      price = attr.formula.execute({
        nom: this,
        characteristic: characteristics[attr.characteristic.valueOf()],
        date: attr.date,
        prm: attr.prm,
        price, currency, x, y, z, clr, calc_order,
      });
    }

    // Пересчитать из валюты в валюту
    return currency.to_currency(price, attr.date, attr.currency);
  }

  /**
   * Выясняет, назначена ли данной номенклатуре хотя бы одна цена
   * @param [cx] {String} если указано, проверяет наличие цены для конкретной характеристики
   * @param [type] {String} если указано, проверяет наличие цены по этому типу
   * @return {Boolean}
   */
  has_price(cx, type) {
    const {_price} = this._data;
    const has = (prices) => Array.isArray(prices) && prices.find(({price}) => price >= 0.01);
    if(!_price) {
      return false;
    }
    if(type) {
      if(cx) {
        return Boolean(_price[cx] && has(_price[cx][type]));
      }
      for(const cx in _price) {
        if(has(_price[cx][type])) {
          return true;
        }
      }
      return false;
    }
    else {
      if(cx) {
        for(const pt in _price[cx]) {
          if(has(_price[cx][pt])) {
            return true;
          }
        }
      }
      for(const cx in _price) {
        for(const pt in _price[cx]) {
          if(has(_price[cx][pt])) {
            return true;
          }
        }
      }
    }
  }

  /**
   * Возвращает массив связей текущей номенклатуры
   */
  params_links(attr) {
    const {CchProperties} = this._manager._owner.$p;
    return CchProperties.prototype.params_links.call(this, attr);
  }

  /**
   * Проверяет и при необходимости перезаполняет или устанваливает умолчание value в prow
   */
  linked_values(links, prow, values = []) {
    const {CchProperties} = this._manager._owner.$p;
    return CchProperties.prototype.linked_values.call(this, links, prow, values);
  }

  filter_params_links(filter, attr, links) {
    const {CchProperties} = this._manager._owner.$p;
    return CchProperties.prototype.filter_params_links.call(this, filter, attr, links);
  }

  get type() {
    return {is_ref: true, types: ["cat.characteristics"]};
  }
}
$p.CatNom = CatNom;
class CatNomDemandRow extends TabularSectionRow{
get kind(){return this._getter('kind')}
set kind(v){this._setter('kind',v)}
get days_from_execution(){return this._getter('days_from_execution')}
set days_from_execution(v){this._setter('days_from_execution',v)}
get days_to_execution(){return this._getter('days_to_execution')}
set days_to_execution(v){this._setter('days_to_execution',v)}
}
$p.CatNomDemandRow = CatNomDemandRow;
class CatNomColorsRow extends TabularSectionRow{
get clr(){return $p.cat.clrs.getter(this._obj.clr)}
set clr(v){this._setter('clr',v)}
get id(){return this._getter('id')}
set id(v){this._setter('id',v)}
get article(){return this._getter('article')}
set article(v){this._setter('article',v)}
get name(){return this._getter('name')}
set name(v){this._setter('name',v)}
get packing(){return this._getter('packing')}
set packing(v){this._setter('packing',v)}
get len(){return this._getter('len')}
set len(v){this._setter('len',v)}
}
$p.CatNomColorsRow = CatNomColorsRow;
class CatNomManager extends CatManager {

  load_array(aattr, forse) {
    // если внутри номенклатуры завёрнуты единицы - вытаскиваем
    const units = [];
    const prices = {};
    for(const row of aattr) {
      if(row.units) {
        row.units.split('\n').forEach((urow) => {
          const uattr = urow.split(',');
          units.push({
            ref: uattr[0],
            owner: row.ref,
            id: uattr[1],
            name: uattr[2],
            qualifier_unit: uattr[3],
            heft: parseFloat(uattr[4]),
            volume: parseFloat(uattr[5]),
            coefficient: parseFloat(uattr[6]),
            rounding_threshold: parseFloat(uattr[7]),
          });
        });
        delete row.units;
      }
      if(row._price) {
        prices[row.ref] = row._price;
        delete row._price;
      }
    }
    const res = super.load_array(aattr, forse);
    const {currencies, nom_units} = this._owner;
    units.length && nom_units.load_array(units, forse);

    // если внутри номенклатуры завёрнуты цены - вытаскиваем
    for(const {_data, _obj} of res) {
      const _price = prices[_obj.ref];
      if(_price) {
        _data._price = _price;
        for(const ox in _price) {
          for(const type in _price[ox]) {
            const v = _price[ox][type];
            Array.isArray(v) && v.forEach((row) => {
              row.date = new Date(row.date);
              row.currency = currencies.get(row.currency);
            });
          }
        }
      }
    }

    return res;
  }

}
$p.cat.create('nom', CatNomManager, false);
class CatOrganizations extends CatObj{
get prefix(){return this._getter('prefix')}
set prefix(v){this._setter('prefix',v)}
get individual_legal(){return this._getter('individual_legal')}
set individual_legal(v){this._setter('individual_legal',v)}
get individual_entrepreneur(){return this._getter('individual_entrepreneur')}
set individual_entrepreneur(v){this._setter('individual_entrepreneur',v)}
get inn(){return this._getter('inn')}
set inn(v){this._setter('inn',v)}
get kpp(){return this._getter('kpp')}
set kpp(v){this._setter('kpp',v)}
get ogrn(){return this._getter('ogrn')}
set ogrn(v){this._setter('ogrn',v)}
get main_bank_account(){return this._getter('main_bank_account')}
set main_bank_account(v){this._setter('main_bank_account',v)}
get main_cashbox(){return this._getter('main_cashbox')}
set main_cashbox(v){this._setter('main_cashbox',v)}
get certificate_series_number(){return this._getter('certificate_series_number')}
set certificate_series_number(v){this._setter('certificate_series_number',v)}
get certificate_date_issue(){return this._getter('certificate_date_issue')}
set certificate_date_issue(v){this._setter('certificate_date_issue',v)}
get certificate_authority_name(){return this._getter('certificate_authority_name')}
set certificate_authority_name(v){this._setter('certificate_authority_name',v)}
get certificate_authority_code(){return this._getter('certificate_authority_code')}
set certificate_authority_code(v){this._setter('certificate_authority_code',v)}
get chief(){return this._getter('chief')}
set chief(v){this._setter('chief',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get contact_information(){return this._getter_ts('contact_information')}
set contact_information(v){this._setter_ts('contact_information',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
}
$p.CatOrganizations = CatOrganizations;
class CatOrganizationsContact_informationRow extends TabularSectionRow{
get type(){return this._getter('type')}
set type(v){this._setter('type',v)}
get kind(){return this._getter('kind')}
set kind(v){this._setter('kind',v)}
get presentation(){return this._getter('presentation')}
set presentation(v){this._setter('presentation',v)}
get values_fields(){return this._getter('values_fields')}
set values_fields(v){this._setter('values_fields',v)}
get country(){return this._getter('country')}
set country(v){this._setter('country',v)}
get region(){return this._getter('region')}
set region(v){this._setter('region',v)}
get city(){return this._getter('city')}
set city(v){this._setter('city',v)}
get email_address(){return this._getter('email_address')}
set email_address(v){this._setter('email_address',v)}
get phone_number(){return this._getter('phone_number')}
set phone_number(v){this._setter('phone_number',v)}
get phone_without_codes(){return this._getter('phone_without_codes')}
set phone_without_codes(v){this._setter('phone_without_codes',v)}
get list_view(){return this._getter('list_view')}
set list_view(v){this._setter('list_view',v)}
get act_from(){return this._getter('act_from')}
set act_from(v){this._setter('act_from',v)}
}
$p.CatOrganizationsContact_informationRow = CatOrganizationsContact_informationRow;
$p.cat.create('organizations');
class CatInserts extends CatObj{
get article(){return this._getter('article')}
set article(v){this._setter('article',v)}
get insert_type(){return this._getter('insert_type')}
set insert_type(v){this._setter('insert_type',v)}
get clr(){return this._getter('clr')}
set clr(v){this._setter('clr',v)}
get lmin(){return this._getter('lmin')}
set lmin(v){this._setter('lmin',v)}
get lmax(){return this._getter('lmax')}
set lmax(v){this._setter('lmax',v)}
get hmin(){return this._getter('hmin')}
set hmin(v){this._setter('hmin',v)}
get hmax(){return this._getter('hmax')}
set hmax(v){this._setter('hmax',v)}
get smin(){return this._getter('smin')}
set smin(v){this._setter('smin',v)}
get smax(){return this._getter('smax')}
set smax(v){this._setter('smax',v)}
get for_direct_profile_only(){return this._getter('for_direct_profile_only')}
set for_direct_profile_only(v){this._setter('for_direct_profile_only',v)}
get ahmin(){return this._getter('ahmin')}
set ahmin(v){this._setter('ahmin',v)}
get ahmax(){return this._getter('ahmax')}
set ahmax(v){this._setter('ahmax',v)}
get priority(){return this._getter('priority')}
set priority(v){this._setter('priority',v)}
get mmin(){return this._getter('mmin')}
set mmin(v){this._setter('mmin',v)}
get mmax(){return this._getter('mmax')}
set mmax(v){this._setter('mmax',v)}
get can_rotate(){return this._getter('can_rotate')}
set can_rotate(v){this._setter('can_rotate',v)}
get sizeb(){return this._getter('sizeb')}
set sizeb(v){this._setter('sizeb',v)}
get clr_group(){return this._getter('clr_group')}
set clr_group(v){this._setter('clr_group',v)}
get is_order_row(){return this._getter('is_order_row')}
set is_order_row(v){this._setter('is_order_row',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get insert_glass_type(){return this._getter('insert_glass_type')}
set insert_glass_type(v){this._setter('insert_glass_type',v)}
get available(){return this._getter('available')}
set available(v){this._setter('available',v)}
get slave(){return this._getter('slave')}
set slave(v){this._setter('slave',v)}
get is_supplier(){return this._getter('is_supplier')}
set is_supplier(v){this._setter('is_supplier',v)}
get region(){return this._getter('region')}
set region(v){this._setter('region',v)}
get split_type(){return this._getter('split_type')}
set split_type(v){this._setter('split_type',v)}
get pair(){return this._getter('pair')}
set pair(v){this._setter('pair',v)}
get lay_split_types(){return this._getter('lay_split_types')}
set lay_split_types(v){this._setter('lay_split_types',v)}
get css(){return this._getter('css')}
set css(v){this._setter('css',v)}
get flipped(){return this._getter('flipped')}
set flipped(v){this._setter('flipped',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get specification(){return this._getter_ts('specification')}
set specification(v){this._setter_ts('specification',v)}
get selection_params(){return this._getter_ts('selection_params')}
set selection_params(v){this._setter_ts('selection_params',v)}
get product_params(){return this._getter_ts('product_params')}
set product_params(v){this._setter_ts('product_params',v)}
get inserts(){return this._getter_ts('inserts')}
set inserts(v){this._setter_ts('inserts',v)}
}
$p.CatInserts = CatInserts;
class CatInsertsSpecificationRow extends TabularSectionRow{
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get algorithm(){return this._getter('algorithm')}
set algorithm(v){this._setter('algorithm',v)}
get nom_characteristic(){return this._getter('nom_characteristic')}
set nom_characteristic(v){this._setter('nom_characteristic',v)}
get clr(){return this._getter('clr')}
set clr(v){this._setter('clr',v)}
get quantity(){return this._getter('quantity')}
set quantity(v){this._setter('quantity',v)}
get sz(){return this._getter('sz')}
set sz(v){this._setter('sz',v)}
get coefficient(){return this._getter('coefficient')}
set coefficient(v){this._setter('coefficient',v)}
get angle_calc_method(){return this._getter('angle_calc_method')}
set angle_calc_method(v){this._setter('angle_calc_method',v)}
get count_calc_method(){return this._getter('count_calc_method')}
set count_calc_method(v){this._setter('count_calc_method',v)}
get formula(){return this._getter('formula')}
set formula(v){this._setter('formula',v)}
get lmin(){return this._getter('lmin')}
set lmin(v){this._setter('lmin',v)}
get lmax(){return this._getter('lmax')}
set lmax(v){this._setter('lmax',v)}
get ahmin(){return this._getter('ahmin')}
set ahmin(v){this._setter('ahmin',v)}
get ahmax(){return this._getter('ahmax')}
set ahmax(v){this._setter('ahmax',v)}
get smin(){return this._getter('smin')}
set smin(v){this._setter('smin',v)}
get smax(){return this._getter('smax')}
set smax(v){this._setter('smax',v)}
get rmin(){return this._getter('rmin')}
set rmin(v){this._setter('rmin',v)}
get rmax(){return this._getter('rmax')}
set rmax(v){this._setter('rmax',v)}
get for_direct_profile_only(){return this._getter('for_direct_profile_only')}
set for_direct_profile_only(v){this._setter('for_direct_profile_only',v)}
get step(){return this._getter('step')}
set step(v){this._setter('step',v)}
get step_angle(){return this._getter('step_angle')}
set step_angle(v){this._setter('step_angle',v)}
get offsets(){return this._getter('offsets')}
set offsets(v){this._setter('offsets',v)}
get do_center(){return this._getter('do_center')}
set do_center(v){this._setter('do_center',v)}
get attrs_option(){return this._getter('attrs_option')}
set attrs_option(v){this._setter('attrs_option',v)}
get is_order_row(){return this._getter('is_order_row')}
set is_order_row(v){this._setter('is_order_row',v)}
get is_main_elm(){return this._getter('is_main_elm')}
set is_main_elm(v){this._setter('is_main_elm',v)}
get stage(){return this._getter('stage')}
set stage(v){this._setter('stage',v)}
get inset(){return this._getter('inset')}
set inset(v){this._setter('inset',v)}
}
$p.CatInsertsSpecificationRow = CatInsertsSpecificationRow;
class CatInsertsInsertsRow extends TabularSectionRow{
get inset(){return this._getter('inset')}
set inset(v){this._setter('inset',v)}
get key(){return this._getter('key')}
set key(v){this._setter('key',v)}
get by_default(){return this._getter('by_default')}
set by_default(v){this._setter('by_default',v)}
}
$p.CatInsertsInsertsRow = CatInsertsInsertsRow;
$p.cat.create('inserts');
class CatParameters_keys extends CatObj{
get priority(){return this._getter('priority')}
set priority(v){this._setter('priority',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get sorting_field(){return this._getter('sorting_field')}
set sorting_field(v){this._setter('sorting_field',v)}
get applying(){return this._getter('applying')}
set applying(v){this._setter('applying',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get predefined_name(){return this._getter('predefined_name')}
set predefined_name(v){this._setter('predefined_name',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get params(){return this._getter_ts('params')}
set params(v){this._setter_ts('params',v)}


  check_condition({elm, elm2, ox, layer, calc_order_row, ...other}) {

    if(this.empty()) {
      return true;
    }
    if(!ox && elm) {
      ox = elm.ox || elm.project.ox;
    }
    if(!layer && elm) {
      layer = elm.layer;
    }
    if(!calc_order_row) {
      calc_order_row = ox?.calc_order_row;
    }
    const {calc_order} = ox;

    // по таблице параметров сначала строим Map ИЛИ
    let {_or} = this;
    if(!_or) {
      _or = new Map();
      for(const prm_row of this.params) {
        if(!_or.has(prm_row.area)) {
          _or.set(prm_row.area, []);
        }
        _or.get(prm_row.area).push(prm_row);
      }
      this._or = _or;
    }

    let res = true;
    for(const grp of _or.values()) {
      let grp_ok = true;
      for(const prm_row of grp) {
        const {property, origin} = prm_row;
        grp_ok = property.check_condition({prm_row, elm, elm2, origin, ox, calc_order, layer, calc_order_row, ...other});
      }
      res = grp_ok;
      if(res) {
        break;
      }
    }
    
    return res;
  }
}
$p.CatParameters_keys = CatParameters_keys;
$p.cat.create('parameters_keys');
class CatProduction_params extends CatObj{
get default_clr(){return $p.cat.clrs.getter(this._obj.default_clr)}
set default_clr(v){this._setter('default_clr',v)}
get clr_group(){return this._getter('clr_group')}
set clr_group(v){this._setter('clr_group',v)}
get template(){return this._getter('template')}
set template(v){this._setter('template',v)}
get flap_pos_by_impost(){return this._getter('flap_pos_by_impost')}
set flap_pos_by_impost(v){this._setter('flap_pos_by_impost',v)}
get flap_weight_max(){return this._getter('flap_weight_max')}
set flap_weight_max(v){this._setter('flap_weight_max',v)}
get formula(){return this._getter('formula')}
set formula(v){this._setter('formula',v)}
get jx(){return this._getter('jx')}
set jx(v){this._setter('jx',v)}
get e(){return this._getter('e')}
set e(v){this._setter('e',v)}
get c(){return this._getter('c')}
set c(v){this._setter('c',v)}
get g(){return this._getter('g')}
set g(v){this._setter('g',v)}
get f(){return this._getter('f')}
set f(v){this._setter('f',v)}
get check_static(){return this._getter('check_static')}
set check_static(v){this._setter('check_static',v)}
get show_flipped(){return this._getter('show_flipped')}
set show_flipped(v){this._setter('show_flipped',v)}
get show_ii(){return this._getter('show_ii')}
set show_ii(v){this._setter('show_ii',v)}
get glass_thickness(){return this._getter('glass_thickness')}
set glass_thickness(v){this._setter('glass_thickness',v)}
get furn_level(){return this._getter('furn_level')}
set furn_level(v){this._setter('furn_level',v)}
get base_clr(){return this._getter('base_clr')}
set base_clr(v){this._setter('base_clr',v)}
get sketch_view(){return this._getter('sketch_view')}
set sketch_view(v){this._setter('sketch_view',v)}
get production_kind(){return this._getter('production_kind')}
set production_kind(v){this._setter('production_kind',v)}
get outline(){return this._getter('outline')}
set outline(v){this._setter('outline',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get elmnts(){return this._getter_ts('elmnts')}
set elmnts(v){this._setter_ts('elmnts',v)}
get production(){return this._getter_ts('production')}
set production(v){this._setter_ts('production',v)}
get product_params(){return this._getter_ts('product_params')}
set product_params(v){this._setter_ts('product_params',v)}
get furn_params(){return this._getter_ts('furn_params')}
set furn_params(v){this._setter_ts('furn_params',v)}
get params(){return this._getter_ts('params')}
set params(v){this._setter_ts('params',v)}
get colors(){return this._getter_ts('colors')}
set colors(v){this._setter_ts('colors',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
get templates(){return this._getter_ts('templates')}
set templates(v){this._setter_ts('templates',v)}
get color_price_groups(){return this._getter_ts('color_price_groups')}
set color_price_groups(v){this._setter_ts('color_price_groups',v)}


  /**
   * возвращает доступные в данной системе элементы
   * @type {Array.<CatInserts>}
   */
  get noms() {
    const noms = [];
    for (const {nom} of this.elmnts) {
      if (nom instanceof CchPredefined_elmnts) {
        for (const {value} of nom.elmnts) {
          !noms.includes(value) && noms.push(value)
        }
      } 
      else {
        !noms.includes(nom) && noms.push(nom);
      }
    }
    return noms;
  }

  /**
   * Массив доступных в данной системе толщин заполнений
   * @typw {Array.<Number>}
   */
  get thicknesses() {
    const {_data} = this;
    if(!_data.thin) {
      const thin = new Set();
      const glasses = this.inserts($p.enm.elm_types.glasses, 'rows');
      for(const {nom} of glasses) {
        const thickness = nom.thickness();
        thickness && thin.add(nom.thickness());
      }
      _data.thin = Array.from(thin).sort((a, b) => a - b);
    }
    return _data.thin;
  }

  /**
   * Минимальная толщина заполнения
   * @type {Number}
   */
  get tmin() {
    return this.glass_thickness === 3 ? 0 : this.thicknesses[0];
  }
  set tmin(v) {
    return true;
  }

  /**
   * Максимальная толщина заполнения
   * @type {Number}
   */
  get tmax() {
    return this.glass_thickness === 3 ? Infinity : this.thicknesses[this.thicknesses.length - 1];
  }
  set tmax(v) {
    return true;
  }

  /**
   * возвращает доступные в данной системе фурнитуры
   * данные получает из справчоника СвязиПараметров, где ведущий = текущей системе и ведомый = фурнитура
   * @param ox {CatCharacteristics}
   * @param [layer] {Contour}
   * @return {Array}
   */
  furns(ox, layer) {
    const {job_prm: {properties}, cat: {furns}} = $p;
    const list = [];
    if(properties.furn) {
      const links = properties.furn.params_links({
        grid: {selection: {cnstr: layer ? layer.cnstr : 0}},
        obj: {_owner: {_owner: ox}},
        layer
      });
      if(links.length) {
        // собираем все доступные значения в одном массиве
        links.forEach((link) => link.values._obj.forEach(({value, by_default, forcibly}) => {
          const v = furns.get(value);
          v && list.push({furn: v, by_default, forcibly});
        }));
      }
    }
    return list;
  }

  /**
   * Ищет цветогруппу системы с учётом цвета основы
   * @param {CatCharacteristics} ox
   * @return {CatColor_price_groups}
   */
  find_group(ox) {
    const {base_clr, clr_group, color_price_groups} = this;
    if(!base_clr.empty()) {
      const row = color_price_groups.find({base_clr: base_clr.extract_pvalue({ox, cnstr: 0})});
      if(row) {
        return row.clr_group;
      }
    }
    return clr_group;
  }

  /**
   * Доступна ли вставка в данной системе в качестве elm_type
   * @param nom {CatInserts}
   * @param elm_type {EnmElmTypes|Array.<EnmElmTypes>}
   * @return {boolean}
   */
  is_elm_type(nom, elm_type) {
    const inserts = this.inserts(elm_type, 'rows').map((e) => e.nom);
    return inserts.includes(nom);
  }

  /**
   * Возвращает доступные в данной системе элементы (вставки)
   * @param elm_types {EnmElmTypes|Array.<EnmElmTypes>} - допустимые типы элементов
   * @param [rows] {String} - возвращать вставки или строки табчасти "Элементы"
   * @param [elm] {BuilderElement} - указатель на элемент или проект, чтобы отфильтровать по ключам
   * @return {Array.<CatInserts>}
   */
  inserts(elm_types, rows, elm){
    const noms = [];
    const {elm_types: types} = $p.enm;
    if(!elm_types) {
      elm_types = types.rama_impost;
    }
    else if(typeof elm_types == 'string') {
      elm_types = types[elm_types];
    }
    else if(!Array.isArray(elm_types)) {
      if(elm && elm_types === types.region) {
        const nearest = elm.nearest();
        if(nearest) {
          elm_types = nearest.elm_type;
        }
        else if(!elm.is_t && elm.layer.layer) {
          elm_types = types.flap;
        }
        else {
          elm_types = types.rama_impost;
        }
      }
      elm_types = [elm_types];
    }

    for(const row of this.elmnts) {
      const {key, nom, elm_type, pos, by_default} = row;
      if(nom && !nom.empty() && elm_types.includes(elm_type) &&
          (rows === 'rows' || !noms.some((e) => nom == e.nom)) &&
          (!elm || key.check_condition({elm}))) {
        if(nom instanceof CchPredefined_elmnts) {
          for(const {value} of nom.elmnts) {
            noms.push({
              nom: value,
              elm_type,
              pos,
              by_default,
            });
          }
        }
        else {
          noms.push(row);
        }
      }
    }

    if(rows === 'rows') {
      return noms;
    }

    noms.sort((a, b) => {
      if(a.by_default && !b.by_default) {
        return -1;
      }
      else if(!a.by_default && b.by_default) {
        return 1;
      }
      else {
        if(a.nom.name < b.nom.name) {
          return -1;
        }
        else if(a.nom.name > b.nom.name) {
          return 1;
        }
        else {
          return 0;
        }
      }
    });

    return noms.map((e) => e.nom);
  }

  /**
   * возвращает доступные в данной системе заполнения (вставки)
   * @return {Array.<CatInserts>}
   */
  glasses({elm, layer}) {
    return this.inserts($p.enm.elm_types.glasses, false, elm);
  }

  /**
   * @param ox {CatCharacteristics} - объект характеристики, табчасть которого надо перезаполнить
   * @param cnstr {Number} - номер конструкции. Если 0 - перезаполняем параметры изделия, иначе - фурнитуры
   * @param [force] {Boolean} - перезаполнять принудительно
   * @param [project] {Scheme} - текущий проект
   * @param [defaults] {TabularSection} - внешние умоляания
   */
  refill_prm(ox, cnstr = 0, force, project, defaults) {

    const prm_ts = !cnstr ? this.product_params : this.furn_params;
    const adel = [];
    const {enm, job_prm: {properties}, utils, EditorInvisible: {Contour}} = $p;
    const auto_align = ox.calc_order.obj_delivery_state == enm.obj_delivery_states.Шаблон && properties.auto_align;
    const {params} = ox;
    const layer = project instanceof Contour ?  project : project && project.getItem({class: Contour, cnstr: cnstr || 1});

    function add_prm(proto) {
      let row;
      let {param, value} = proto;

      if(cnstr) {

      }

      params.find_rows({cnstr, param}, (_row) => {
        row = _row;
        return false;
      });

      const drow = defaults && defaults.find({param});
      if(drow) {
        value = drow.value;
      }
      else if(param === properties.branch) {
        value = ox.calc_order.organization._extra(param);
        if(!value || value.empty()) {
          value = ox.calc_order.manager.branch;
        }
        if(value.empty()) {
          value._manager.find_rows({parent: utils.blank.guid}, (branch) => {
            value = branch;
            return false;
          });
        }
      }

      // если не найден параметр изделия - добавляем. если нет параметра фурнитуры - пропускаем
      if(!row){
        if(cnstr){
          return;
        }
        row = params.add({param, cnstr, value});
      }

      const links = param.params_links({grid: {selection: {cnstr}}, obj: row, layer});
      const hide = proto.hide || links.some((link) => link.hide);
      if(row.hide != hide){
        row.hide = hide;
      }

      if(proto.forcibly || drow || force === 1){

        if(param.inheritance === 3 || param.inheritance === 4) {
          // пытаемся получить свойство из отдела абонента
          const bvalue = param.branch_value({project, cnstr, ox});
          if(bvalue !== undefined) {
            row.value = bvalue;
            return;
          }
        }

        if(value !== undefined && row.value != value) {
          row.value = value;
        }
      }
    }

    // если в характеристике есть лишние параметры - удаляем
    if(!cnstr){
      params.find_rows({cnstr: cnstr}, (row) => {
        const {param} = row;
        if(param !== auto_align && !prm_ts.find({param})){
          adel.push(row);
        }
      });
      adel.forEach((row) => params.del(row));
    }

    // бежим по параметрам. при необходимости, добавляем или перезаполняем и устанавливаем признак hide
    prm_ts.forEach(add_prm);

    // для шаблонов, добавляем параметр автоуравнивание
    !cnstr && auto_align && add_prm({param: auto_align, value: '', hide: false});

    // устанавливаем систему и номенклатуру продукции
    if(!cnstr){
      ox.sys = this;
      ox.owner = ox.prod_nom;

      if(project instanceof Contour) {
        return;
      }

      // если текущая фурнитура недоступна для данной системы - меняем
      // одновременно, перезаполним параметры фурнитуры
      ox.constructions.forEach((row) => {
        if(!row.furn.empty()) {
          let changed = force;
          const layer = project && project.getItem({class: Contour, cnstr: row.cnstr});
          // если для системы через связи параметров ограничен список фурнитуры...
          const furns = this.furns(ox, layer);
          const shtulp_kind = row.furn.shtulp_kind();
          if(furns.length) {
            if(furns.some((frow) => {
              if(frow.forcibly) {
                row.furn = frow.furn;
                return changed = true;
              }
            })) {
              ;
            }
            else if(furns.some((frow) => row.furn === frow.furn)) {
              ;
            }
            else if(shtulp_kind && furns.some((frow) => {
              if(frow.by_default && frow.furn.shtulp_kind() === shtulp_kind) {
                row.furn = frow.furn;
                return changed = true;
              }
            })) {
              ;
            }
            else if(shtulp_kind && furns.some((frow) => {
              if(frow.furn.shtulp_kind() === shtulp_kind) {
                row.furn = frow.furn;
                return changed = true;
              }
            })) {
              ;
            }
            else if(furns.some((frow) => {
              if(frow.by_default) {
                row.furn = frow.furn;
                return changed = true;
              }
            })) {
              ;
            }
            else {
              row.furn = furns[0].furn;
              changed = true;
            }
          }

          if(changed) {
            if(!project && typeof window !== 'undefined' && window.paper) {
              project = window.paper.project;
            }
            const contour = project && project.getItem({cnstr: row.cnstr});
            if(contour) {
              row.furn.refill_prm(contour, force === 1);
              contour.notify(contour, 'furn_changed');
            }
            else {
              ox.sys.refill_prm(ox, row.cnstr, force, project);
            }
          }
        }
      });
    }
  }

  prm_defaults(param, cnstr) {
    const ts = param instanceof CatNom ? this.params : (cnstr ? this.furn_params : this.product_params);
    return ts.find({param});
  }

  graph_restrictions(spoint, clr) {
    const {formula} = this;
    const checks = {};
    if(!formula.empty()) {
      const fragment = formula.execute()[clr ? 'clr' : 'white'];
      for(const key in fragment) {
        checks[key] = fragment[key].contains(spoint);
      }
    }
    return checks;
  }
}
$p.CatProduction_params = CatProduction_params;
class CatProduction_paramsElmntsRow extends TabularSectionRow{
get by_default(){return this._getter('by_default')}
set by_default(v){this._setter('by_default',v)}
get elm_type(){return this._getter('elm_type')}
set elm_type(v){this._setter('elm_type',v)}
get key(){return this._getter('key')}
set key(v){this._setter('key',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get clr(){return this._getter('clr')}
set clr(v){this._setter('clr',v)}
get pos(){return this._getter('pos')}
set pos(v){this._setter('pos',v)}
}
$p.CatProduction_paramsElmntsRow = CatProduction_paramsElmntsRow;
class CatProduction_paramsProductionRow extends TabularSectionRow{
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get param(){return this._getter('param')}
set param(v){this._setter('param',v)}
get value(){return this._getter('value')}
set value(v){this._setter('value',v)}
}
$p.CatProduction_paramsProductionRow = CatProduction_paramsProductionRow;
class CatProduction_paramsParamsRow extends TabularSectionRow{
get param(){return this._getter('param')}
set param(v){this._setter('param',v)}
get value(){return this._getter('value')}
set value(v){this._setter('value',v)}
get hide(){return this._getter('hide')}
set hide(v){this._setter('hide',v)}
get forcibly(){return this._getter('forcibly')}
set forcibly(v){this._setter('forcibly',v)}
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
}
$p.CatProduction_paramsParamsRow = CatProduction_paramsParamsRow;
class CatProduction_paramsColorsRow extends TabularSectionRow{
get base_clr(){return this._getter('base_clr')}
set base_clr(v){this._setter('base_clr',v)}
get clr(){return $p.cat.clrs.getter(this._obj.clr)}
set clr(v){this._setter('clr',v)}
}
$p.CatProduction_paramsColorsRow = CatProduction_paramsColorsRow;
class CatProduction_paramsTemplatesRow extends TabularSectionRow{
get template(){return this._getter('template')}
set template(v){this._setter('template',v)}
}
$p.CatProduction_paramsTemplatesRow = CatProduction_paramsTemplatesRow;
class CatProduction_paramsColor_price_groupsRow extends TabularSectionRow{
get base_clr(){return this._getter('base_clr')}
set base_clr(v){this._setter('base_clr',v)}
get clr_group(){return this._getter('clr_group')}
set clr_group(v){this._setter('clr_group',v)}
}
$p.CatProduction_paramsColor_price_groupsRow = CatProduction_paramsColor_price_groupsRow;
class CatProduction_paramsManager extends CatManager {

  // после загрузки, установим признак dhtmlxro цветам основы
  load_array(aattr, forse) {
    for(const obj of super.load_array(aattr, forse)) {
      if(!obj.base_clr.empty()) {
        obj.base_clr.dhtmlxro = true;
      }
    }
  }

  /**
   * возвращает массив доступных для данного свойства значений
   * @param prop {CatObj} - планвидовхарактеристик ссылка или объект
   * @param is_furn {boolean} - интересуют свойства фурнитуры или объекта
   * @return {Array}
   */
  slist(prop, is_furn){
    let res = [], rt, at, pmgr, op = this.get(prop);

    if(op && op.type.is_ref){
      const tso = $p.enm.open_directions;
      // параметры получаем из локального кеша
      for(rt in op.type.types)
        if(op.type.types[rt].indexOf(".") > -1){
          at = op.type.types[rt].split(".");
          pmgr = $p[at[0]][at[1]];
          if(pmgr){
            if(pmgr === tso) {
              pmgr.forEach((v) => {
                v !== tso.folding && res.push({value: v.ref, text: v.synonym});
              });
            }
            else
              pmgr.find_rows({owner: prop}, (v) => {
                res.push({value: v.ref, text: v.presentation});
              });
          }
        }
    }
    return res;
  }
}
$p.cat.create('production_params', CatProduction_paramsManager, false);
class CatDelivery_areas extends CatObj{
get country(){return this._getter('country')}
set country(v){this._setter('country',v)}
get region(){return this._getter('region')}
set region(v){this._setter('region',v)}
get city(){return this._getter('city')}
set city(v){this._setter('city',v)}
get latitude(){return this._getter('latitude')}
set latitude(v){this._setter('latitude',v)}
get longitude(){return this._getter('longitude')}
set longitude(v){this._setter('longitude',v)}
get delivery_area(){return this._getter('delivery_area')}
set delivery_area(v){this._setter('delivery_area',v)}
get rstore(){return this._getter('rstore')}
set rstore(v){this._setter('rstore',v)}
get coordinates(){return this._getter_ts('coordinates')}
set coordinates(v){this._setter_ts('coordinates',v)}
}
$p.CatDelivery_areas = CatDelivery_areas;
class CatDelivery_areasCoordinatesRow extends TabularSectionRow{
get latitude(){return this._getter('latitude')}
set latitude(v){this._setter('latitude',v)}
get longitude(){return this._getter('longitude')}
set longitude(v){this._setter('longitude',v)}
}
$p.CatDelivery_areasCoordinatesRow = CatDelivery_areasCoordinatesRow;
$p.cat.create('delivery_areas');
class CatCnns extends CatObj{
get priority(){return this._getter('priority')}
set priority(v){this._setter('priority',v)}
get amin(){return this._getter('amin')}
set amin(v){this._setter('amin',v)}
get amax(){return this._getter('amax')}
set amax(v){this._setter('amax',v)}
get sd1(){return this._getter('sd1')}
set sd1(v){this._setter('sd1',v)}
get sd2(){return this._getter('sd2')}
set sd2(v){this._setter('sd2',v)}
get sz(){return this._getter('sz')}
set sz(v){this._setter('sz',v)}
get cnn_type(){return this._getter('cnn_type')}
set cnn_type(v){this._setter('cnn_type',v)}
get ahmin(){return this._getter('ahmin')}
set ahmin(v){this._setter('ahmin',v)}
get ahmax(){return this._getter('ahmax')}
set ahmax(v){this._setter('ahmax',v)}
get lmin(){return this._getter('lmin')}
set lmin(v){this._setter('lmin',v)}
get lmax(){return this._getter('lmax')}
set lmax(v){this._setter('lmax',v)}
get tmin(){return this._getter('tmin')}
set tmin(v){this._setter('tmin',v)}
get tmax(){return this._getter('tmax')}
set tmax(v){this._setter('tmax',v)}
get var_layers(){return this._getter('var_layers')}
set var_layers(v){this._setter('var_layers',v)}
get for_direct_profile_only(){return this._getter('for_direct_profile_only')}
set for_direct_profile_only(v){this._setter('for_direct_profile_only',v)}
get art1vert(){return this._getter('art1vert')}
set art1vert(v){this._setter('art1vert',v)}
get art1glass(){return this._getter('art1glass')}
set art1glass(v){this._setter('art1glass',v)}
get art2glass(){return this._getter('art2glass')}
set art2glass(v){this._setter('art2glass',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get applying(){return this._getter('applying')}
set applying(v){this._setter('applying',v)}
get region(){return this._getter('region')}
set region(v){this._setter('region',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get specification(){return this._getter_ts('specification')}
set specification(v){this._setter_ts('specification',v)}
get cnn_elmnts(){return this._getter_ts('cnn_elmnts')}
set cnn_elmnts(v){this._setter_ts('cnn_elmnts',v)}
get selection_params(){return this._getter_ts('selection_params')}
set selection_params(v){this._setter_ts('selection_params',v)}
get sizes(){return this._getter_ts('sizes')}
set sizes(v){this._setter_ts('sizes',v)}
get priorities(){return this._getter_ts('priorities')}
set priorities(v){this._setter_ts('priorities',v)}
get coordinates(){return this._getter_ts('coordinates')}
set coordinates(v){this._setter_ts('coordinates',v)}


  /**
   * Возвращает основную строку спецификации соединения между элементами
   */
  main_row(elm) {

    let ares, nom = elm.nom;
    const {enm, job_prm, ProductsBuilding: {check_params}} = $p;
    const {specification, cnn_elmnts, selection_params, cnn_type} = this;

    // если тип соединения угловой, то арт-1-2 определяем по ориентации элемента
    if(enm.cnn_types.acn.a.includes(cnn_type)){
      let art12 = elm.orientation.is('vert') ? job_prm.nom.art1 : job_prm.nom.art2;
      ares = specification.find_rows({nom: art12});
    }
    // в прочих случаях, принадлежность к арт-1-2 определяем по табчасти СоединяемыеЭлементы
    if((!ares || !ares.length) && cnn_elmnts.find_rows({nom1: nom}).length){
      ares = specification.find_rows({nom: job_prm.nom.art1});
    }
    if((!ares || !ares.length) && cnn_elmnts.find_rows({nom2: nom}).length){
      ares = specification.find_rows({nom: job_prm.nom.art2});
    }
    if((!ares || !ares.length)) {
      ares = specification.find_rows({nom});
    }

    if(ares && ares.length) {
      const ox = elm.prm_ox || elm.ox;
      for(const {_row} of ares) {
        if(check_params({
          params: selection_params,
          ox,
          elm,
          row_spec: _row,
        })) {
          return _row;
        }
      }
      return ares[0]._row;
    }

  }

  /**
   * Проверяет, есть ли nom в колонке nom2 соединяемых элементов
   * @param {CatNom} nom
   * @return Boolean
   */
  check_nom2(nom) {
    const ref = nom.valueOf();
    return this.cnn_elmnts._obj.some((row) => row.nom2 == ref);
  }

  check_nom1(nom) {
    const ref = nom.valueOf();
    return this.cnn_elmnts._obj.some((row) => row.nom1 == ref);
  }

  /**
   * Проверяет применимость для xx и t
   * @param {CnnPoint} cnn_point
   * @return Boolean
   */
  stop_applying(cnn_point) {
    const {applying, cnn_type, _manager} = this;
    let stop = applying && (cnn_type.is('t') || cnn_type.is('xx'));
    if(stop) {
      // 0 - Везде
      // 1 - Только стык
      // 2 - Только T
      // 3 - Только угол
      if(applying === 1 && !cnn_point.is_ll) {
        ;
      }
      else if(applying === 2 && cnn_point.is_ll) {
        ;
      }
      else {
        stop = false;
      }
    }
    return stop;
  }
  
  /**
   * Параметрический размер соединения 
   * @param {BuilderElement} elm0 - Элемент, через который будем добираться до значений параметров
   * @param {BuilderElement} [elm2] - Соседний элемент, если доступно в контексте вызова
   * @param {Number} [region] - номер ряда
   * @return Number
   */
  size(elm0, elm2, region=0) {
    let {sz, sizes} = this;
    const {ox, layer} = elm0;
    for(const prm_row of sizes) {
      let elm = elm0;
      let cnstr = 0;
      if(prm_row.origin.is('layer')) {
        cnstr = layer.cnstr;
      }
      else if(prm_row.origin.is('parent')) {
        const {parent} = elm;
        if(parent === layer) {
          cnstr = layer.cnstr;
        }
        else if(parent.elm) {
          cnstr = -parent.elm;
          elm = parent;
        }
      }
      if(prm_row.param.check_condition({row_spec: {}, prm_row, cnstr, elm, elm2, region, layer, ox}) &&
        prm_row.key.check_condition({cnstr, elm, elm2, region, layer, ox})) {
        sz = prm_row.elm;
        break;
      }
      //if(elm != elm0 && elm.inset.insert_type.is('composite')) {}
    }
    return sz;
  }

  /**
   * Выясняет, зависит ли размер соединения от текущего параметра
   * @param param {CchProperties}
   * @return {Boolean}
   */
  is_depend_of(param) {
    for(const row of this.sizes) {
      if(row.param === param || (row.param.empty() && !row.key.empty())) {
        return true;
      }
    }
  }

  /**
   * Укорочение для конкретной номенклатуры из спецификации
   */
  nom_size({nom, elm, elm2, len_angl, ox}) {
    let sz = 0;
    this.filtered_spec({elm, elm2, len_angl, ox, correct: true}).some((row) => {
      const {nom: rnom} = row;
      if(rnom === nom || (rnom instanceof CatInserts && rnom.filtered_spec({elm, elm2, len_angl, ox}).find(v => v.nom == nom))) {
        sz = row.sz;
        if(row.algorithm.is('w2') && elm2) {
          const size = this.size(elm, elm2);
          sz += -elm2.width + size;
        }
        return true;
      }
    });
    return sz;
  }

  /**
   * ПолучитьСпецификациюСоединенияСФильтром
   * @param {BuilderElement} elm
   * @param {BuilderElement} elm2
   * @param {Object} len_angl
   * @param {Object} ox
   * @param {Boolean} [correct]
   */
  filtered_spec({elm, elm2, len_angl, ox, correct = false}) {
    const res = [];

    const {
      job_prm: {nom: {art1, art2}},
      enm: {specification_installation_methods, cnn_types},
      ProductsBuilding: {check_params},
    } = $p;

    const {САртикулом1, САртикулом2} = specification_installation_methods;
    const {ii, xx, acn, t} = cnn_types;
    const {cnn_type, specification, selection_params} = this;

    specification.forEach((row) => {
      const {nom, quantity, for_direct_profile_only: direct_only, amin, amax, alp2, set_specification} = row;
      // при формировании спецификации, отбрасываем корректировочные строки и наоборот, при корректировке - обычные
      if(!quantity && !correct || quantity && correct) {
        return;
      }
      if(!nom || nom.empty() || nom == art1 || nom == art2) {
        return;
      }

      // только для прямых или только для кривых профилей
      if((direct_only > 0 && !elm.is_linear()) || (direct_only < 0 && elm.is_linear())) {
        return;
      }

      //TODO: реализовать фильтрацию
      if(cnn_type == ii) {
        const angle_hor = len_angl.hasOwnProperty('angle_hor') ? len_angl.angle_hor : elm.angle_hor;
        if(amin > angle_hor || amax < angle_hor || row.sz_min > len_angl.len || row.sz_max < len_angl.len) {
          return;
        }
      }
      else {
        let {angle} = len_angl;
        if(!alp2 && angle > 180) {
          angle = 360 - angle;
        }
        if(amin < 0 && amax < 0) {
          if(-amin <= angle && -amax >= angle) {
            return;
          }
        }
        else {
          if(amin > angle || amax < angle) {
            return;
          }
        }
      }

      // "устанавливать с" проверяем только для соединений профиля
      if(!correct && ((set_specification == САртикулом1 && len_angl.art2) || (set_specification == САртикулом2 && len_angl.art1))) {
        return;
      }
      // для угловых, разрешаем art2 только явно для art2
      if(!correct && len_angl.art2 && acn.a.includes(cnn_type) && !acn.xsl.includes(cnn_type) && set_specification != САртикулом2) {
        return;
      }

      // проверяем параметры изделия и добавляем, если проходит по ограничениям
      if(correct || check_params({params: selection_params, row_spec: row, elm, elm2, ox})) {
        res.push(row);
      }

    });

    return res;
  }

  calculate_spec({elm, elm2, len_angl, cnn_other, ox, own_row, spec}) {

    const {
      enm: {predefined_formulas: {gb_short, gb_long, w2}, cnn_types}, 
      CatInserts, 
      utils,
      ProductsBuilding: {new_spec_row, calc_count_area_mass},
    } = $p;
    
    const sign = this.cnn_type == cnn_types.ii ? -1 : 1;
    
    if(!spec){
      spec = ox.specification;
    }
    for(const row_base of this.filtered_spec({elm, elm2, len_angl, ox})) {
      const {nom} = row_base;

      // TODO: nom может быть вставкой - в этом случае надо разузловать
      if(nom instanceof CatInserts) {
        if(![gb_short, gb_long].includes(row_base.algorithm) && len_angl && (row_base.sz || row_base.coefficient)) {
          const tmp_len_angl = Object.assign({}, len_angl);
          tmp_len_angl.len = (len_angl.len - sign * 2 * row_base.sz) * (row_base.coefficient || 0.001);
          if(row_base.algorithm === w2 && elm2) {

          }
          nom.calculate_spec({elm, elm2, len_angl: tmp_len_angl, own_row: row_base, ox, spec});
        }
        else {
          nom.calculate_spec({elm, elm2, len_angl, own_row: row_base, ox, spec});
        }
      }
      else {

        const row_spec = new_spec_row({row_base, origin: len_angl.origin || this, elm, nom, spec, ox, len_angl});

        // рассчитаем количество
        if(nom.is_pieces) {
          if(!row_base.coefficient) {
            row_spec.qty = row_base.quantity;
          }
          else {
            row_spec.qty = ((len_angl.len - sign * 2 * row_base.sz) * row_base.coefficient * row_base.quantity - 0.5)
              .round(nom.rounding_quantity);
          }
        }
        else {
          row_spec.qty = row_base.quantity;

          // если указано cnn_other, берём не размер соединения, а размеры предыдущего и последующего
          if(![gb_short, gb_long].includes(row_base.algorithm) && (row_base.sz || row_base.coefficient)) {
            let sz = row_base.sz, finded, qty;
            if(cnn_other) {
              cnn_other.specification.find_rows({nom}, (row) => {
                sz += row.sz;
                qty = row.quantity;
                return !(finded = true);
              });
            }
            if(!finded) {
              if(row_base.algorithm === w2 && elm2) {

              }
              else {
                sz *= 2;
              }
            }
            if(!row_spec.qty && finded && len_angl.art1) {
              row_spec.qty = qty;
            }
            row_spec.len = (len_angl.len - sign * sz) * (row_base.coefficient || 0.001);
          }
        }

        // если указана формула - выполняем
        if(!row_base.formula.empty()) {
          const qty = row_base.formula.execute({
            ox,
            elm,
            len_angl,
            cnstr: 0,
            inset: utils.blank.guid,
            row_cnn: row_base,
            row_spec: row_spec
          });
          // если формула является формулой условия, используем результат, как фильтр
          if(row_base.formula.condition_formula && !qty){
            row_spec.qty = 0;
          }
        }

        // визуализация svg-dx
        if(row_spec.dop === -1 && len_angl.curr && nom.visualization.mode === 3) {
          const {sub_path, outer, profile: {generatrix}} = len_angl.curr;
          const pt = generatrix.getNearestPoint(sub_path[outer ? 'lastSegment' : 'firstSegment'].point);
          row_spec.width = generatrix.getOffsetOf(pt) / 1000;
          if(outer) {
            row_spec.alp1 = -1;
          }
        }
        else {
          calc_count_area_mass(row_spec, spec, len_angl, row_base.angle_calc_method);
        }
      }
    }
  }}
$p.CatCnns = CatCnns;
class CatCnnsSpecificationRow extends TabularSectionRow{
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get algorithm(){return this._getter('algorithm')}
set algorithm(v){this._setter('algorithm',v)}
get nom_characteristic(){return this._getter('nom_characteristic')}
set nom_characteristic(v){this._setter('nom_characteristic',v)}
get clr(){return this._getter('clr')}
set clr(v){this._setter('clr',v)}
get coefficient(){return this._getter('coefficient')}
set coefficient(v){this._setter('coefficient',v)}
get sz(){return this._getter('sz')}
set sz(v){this._setter('sz',v)}
get quantity(){return this._getter('quantity')}
set quantity(v){this._setter('quantity',v)}
get formula(){return this._getter('formula')}
set formula(v){this._setter('formula',v)}
get sz_min(){return this._getter('sz_min')}
set sz_min(v){this._setter('sz_min',v)}
get sz_max(){return this._getter('sz_max')}
set sz_max(v){this._setter('sz_max',v)}
get amin(){return this._getter('amin')}
set amin(v){this._setter('amin',v)}
get amax(){return this._getter('amax')}
set amax(v){this._setter('amax',v)}
get set_specification(){return this._getter('set_specification')}
set set_specification(v){this._setter('set_specification',v)}
get for_direct_profile_only(){return this._getter('for_direct_profile_only')}
set for_direct_profile_only(v){this._setter('for_direct_profile_only',v)}
get alp2(){return this._getter('alp2')}
set alp2(v){this._setter('alp2',v)}
get angle_calc_method(){return this._getter('angle_calc_method')}
set angle_calc_method(v){this._setter('angle_calc_method',v)}
get contour_number(){return this._getter('contour_number')}
set contour_number(v){this._setter('contour_number',v)}
get is_order_row(){return this._getter('is_order_row')}
set is_order_row(v){this._setter('is_order_row',v)}
get stage(){return this._getter('stage')}
set stage(v){this._setter('stage',v)}
get inset(){return this._getter('inset')}
set inset(v){this._setter('inset',v)}
}
$p.CatCnnsSpecificationRow = CatCnnsSpecificationRow;
class CatCnnsCnn_elmntsRow extends TabularSectionRow{
get nom1(){return this._getter('nom1')}
set nom1(v){this._setter('nom1',v)}
get clr1(){return this._getter('clr1')}
set clr1(v){this._setter('clr1',v)}
get nom2(){return this._getter('nom2')}
set nom2(v){this._setter('nom2',v)}
get clr2(){return this._getter('clr2')}
set clr2(v){this._setter('clr2',v)}
get is_nom_combinations_row(){return this._getter('is_nom_combinations_row')}
set is_nom_combinations_row(v){this._setter('is_nom_combinations_row',v)}
}
$p.CatCnnsCnn_elmntsRow = CatCnnsCnn_elmntsRow;
class CatCnnsPrioritiesRow extends TabularSectionRow{
get sys(){return this._getter('sys')}
set sys(v){this._setter('sys',v)}
get orientation(){return this._getter('orientation')}
set orientation(v){this._setter('orientation',v)}
get priority(){return this._getter('priority')}
set priority(v){this._setter('priority',v)}
}
$p.CatCnnsPrioritiesRow = CatCnnsPrioritiesRow;
class CatCnnsCoordinatesRow extends TabularSectionRow{
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get offset_option(){return this._getter('offset_option')}
set offset_option(v){this._setter('offset_option',v)}
get formula(){return this._getter('formula')}
set formula(v){this._setter('formula',v)}
get transfer_option(){return this._getter('transfer_option')}
set transfer_option(v){this._setter('transfer_option',v)}
get overmeasure(){return this._getter('overmeasure')}
set overmeasure(v){this._setter('overmeasure',v)}
}
$p.CatCnnsCoordinatesRow = CatCnnsCoordinatesRow;
class CatCnnsManager extends CatManager {

  constructor(owner, class_name) {
    super(owner, class_name);
    this._nomcache = {};
    this._region_cache = new Map();
  }

  sort_cnns(elm1, elm2) {

    const {Editor: {ProfileItem, BuilderElement}, enm: {cnn_types: {t, xx}, cnn_sides}} = $p;
    const sides = [cnn_sides.inner, cnn_sides.outer];
    const orientation = elm1 instanceof ProfileItem && elm1.orientation;
    const sys = elm1 instanceof BuilderElement ? elm1.layer.sys : (elm2 instanceof BuilderElement && elm2.layer.sys);
    const priority = (cnn) => {
      let finded;
      if(sys && orientation) {
        const {priorities} = cnn;
        priorities.forEach((row) => {
          if((row.orientation.empty() || row.orientation == orientation) && (row.sys.empty() || row.sys == sys)) {
            if(!row.orientation.empty() && !row.sys.empty()) {
              finded = row;
              return false;
            }
            if(!finded || finded.sys.empty()) {
              finded = row;
            }
            else if(finded.orientation.empty() && !row.orientation.empty()) {
              finded = row;
            }
          }
        });
      }
      return finded ? finded.priority : cnn.priority;
    };

    return function sort_cnns(a, b) {

      // первым делом, учитываем приоритет (большой всплывает вверх)
      if (priority(a) > priority(b)) {
        return -1;
      }
      if (priority(a) < priority(b)) {
        return 1;
      }

      // далее, отдаём предпочтение соединениям, для которых задана сторона
      if(sides.includes(a.sd1) && !sides.includes(b.sd1)){
        return -1;
      }
      if(sides.includes(b.sd1) && !sides.includes(a.sd1)){
        return 1;
      }

      // соединения с одинаковым приоритетом и стороной сортируем по типу - опускаем вниз крест и Т
      if(a.cnn_type === xx && b.cnn_type !== xx){
        return 1;
      }
      if(b.cnn_type === xx && a.cnn_type !== xx){
        return -1;
      }
      if(a.cnn_type === t && b.cnn_type !== t){
        return 1;
      }
      if(b.cnn_type === t && a.cnn_type !== t){
        return -1;
      }

      // в последнюю очередь, сортируем по имени
      if (a.name > b.name) {
        return -1;
      }
      if (a.name < b.name) {
        return 1;
      }
      return 0;
    }
  }

  /**
   * Возвращает массив соединений, доступный для сочетания номенклатур.
   * Для соединений с заполнениями учитывается толщина. Контроль остальных геометрических особенностей выполняется на стороне рисовалки
   * @param elm1 {BuilderElement|CatNom}
   * @param [elm2] {BuilderElement|CatNom}
   * @param [cnn_types] {EnumObj|Array.<EnumObj>}
   * @param [ign_side] {Boolean}
   * @param [is_outer] {Boolean}
   * @param [cnn_point] {CnnPoint}
   * @return {Array}
   */
  nom_cnn(elm1, elm2, cnn_types, ign_side, is_outer, cnn_point) {

    const {
      Editor: {ProfileItem, BuilderElement, Filling},
      enm: {orientations: {vert /*, hor, incline */}, cnn_types: {acn, ad, ii, i}, cnn_sides},
      cat: {nom}, utils} = $p;

    const types = Array.isArray(cnn_types) ? cnn_types : (acn.a.includes(cnn_types) ? acn.a : [cnn_types]);
    
    if(elm1.rnum && (!types.includes(i) || types.length > 1)) {
      const side = elm2?.cnn_side?.(elm1) || cnn_sides.inner;
      const res = this.region_cnn({
        region: elm1.rnum, 
        elm1,
        elm2: [{profile: elm2, side}],
        cnn_types,
        array: true});
      if(types.includes(i)) {
        const ri = this.nom_cnn(elm1, elm2, [i], ign_side, is_outer, cnn_point);
        res.push(...ri);
      }
      return res;
    }

    // если оба элемента - профили, определяем сторону
    let side = is_outer ? cnn_sides.outer :
      (!ign_side && elm1 instanceof ProfileItem && !elm1.rnum && elm2 instanceof ProfileItem && elm2.cnn_side(elm1));
    if(!side && !ign_side && is_outer === false) {
      side = cnn_sides.inner;
    }

    let onom2, a1, a2, thickness1, thickness2, is_i = false, art1glass = false, art2glass = false;

    if(!elm2 || (utils.is_data_obj(elm2) && elm2.empty())){
      is_i = true;
      onom2 = elm2 = nom.get();
    }
    else{
      if(elm2 instanceof BuilderElement){
        onom2 = elm2.nom;
      }
      else if(utils.is_data_obj(elm2)){
        onom2 = elm2;
      }
      else{
        onom2 = nom.get(elm2);
      }
    }

    const {ref: ref1} = elm1; // ref у BuilderElement равен ref номенклатуры или ref вставки
    const {ref: ref2} = onom2;

    if(!is_i){
      if(elm1 instanceof Filling){
        art1glass = true;
        thickness1 = elm1.thickness;
      }
      else if(elm2 instanceof Filling){
        art2glass = true;
        thickness2 = elm2.thickness;
      }
    }

    if(!this._nomcache[ref1]){
      this._nomcache[ref1] = {};
    }
    a1 = this._nomcache[ref1];
    if(!a1[ref2]){
      a2 = (a1[ref2] = []);
      // для всех элементов справочника соединения
      this.forEach((cnn) => {
        // не рассматриваем соединения рядов
        if(!cnn.region || cnn.cnn_type === i) {
          // если в строках соединяемых элементов есть наша - добавляем
          let is_nom1 = art1glass ? (cnn.art1glass && thickness1 >= cnn.tmin && thickness1 <= cnn.tmax && cnn.cnn_type == ii) : false,
            is_nom2 = art2glass ? (cnn.art2glass && thickness2 >= cnn.tmin && thickness2 <= cnn.tmax) : false;

          cnn.cnn_elmnts.forEach((row) => {
            if(is_nom1 && is_nom2){
              return false;
            }
            if(!is_nom1) {
              is_nom1 = row.nom1 == ref1 && (row.nom2.empty() || row.nom2 == onom2);
            }
            if(!is_nom2) {
              is_nom2 = row.nom2 == onom2 && (row.nom1.empty() || row.nom1 == ref1);
            }
          });
          if(is_nom1 && is_nom2){
            a2.push(cnn);
          }
        }
      });
    }

    if(cnn_types){
      
      const res = a1[ref2]
        .filter((cnn) => {
          if(types.includes(cnn.cnn_type)){
            if(cnn.amin && cnn.amax && cnn_point) {
              let angle = elm1.angle_at(cnn_point.node);
              if(angle > 180) {
                angle = 360 - angle;
              }
              if(cnn.amin < 0 && cnn.amax < 0) {
                if(-cnn.amin <= angle && -cnn.amax >= angle) {
                  return false;
                }
              }
              else {
                if(cnn.amin > angle || cnn.amax < angle) {
                  return false;
                }
              }
            }
            if(cnn_point && cnn.stop_applying(cnn_point)) {
              return false;
            }
            if(!side){
              return true;
            }
            if(cnn.sd1 == cnn_sides.inner){
              return side == cnn_sides.inner;
            }
            else if(cnn.sd1 == cnn_sides.outer){
              return side == cnn_sides.outer;
            }
            else{
              return true;
            }
          }
        });

      // если не нашлось подходящих и это угловое соединение и второй элемент вертикальный - меняем местами эл 1-2 при поиске
      if(!res.length && elm1 instanceof ProfileItem && elm2 instanceof ProfileItem &&
        types.includes(ad) && elm1.orientation != vert && elm2.orientation == vert ){
        return this.nom_cnn(elm2, elm1, types);
      }

      if(types.includes(i) && elm2 && !elm2.empty?.()) {
        const tmp = this.nom_cnn(elm1, null, acn.i, ign_side, is_outer, cnn_point);
        return res.concat(tmp).sort(this.sort_cnns(elm1, elm2));
      }

      return res.sort(this.sort_cnns(elm1, elm2));
    }

    return a1[ref2];
  }
  
  region_cnn({region, elm1, nom1, elm2, art1glass, cnn_types, array}) {
    if(!nom1) {
      nom1 = elm1.nom;
    }
    if(!Array.isArray(elm2)) {
      elm2 = [elm2];
    }
    for(const elm of elm2) {
      if(!elm.nom) {
        elm.nom = elm.profile.nom;
      }
      if(!elm.side) {
        throw new Error(`region_cnn no side elm:${elm.elm}, region:${region}`);
      }
    }
    if(!this._region_cache.has(region)) {
      this._region_cache.set(region, new Map());
    }
    const region_cache = this._region_cache.get(region);
    for(const {nom} of elm2) {
      if(!region_cache.has(nom)) {
        const cnns = [];
        this.find_rows({region}, (cnn) => {
          cnn.check_nom2(nom) && cnns.push(cnn);
        });
        region_cache.set(nom, cnns);
      }
    }
    const all = [];
    elm2.forEach(({nom, side}, index) => {
      for(const cnn of region_cache.get(nom)) {
        if(cnn_types.includes(cnn.cnn_type) && (cnn.sd1.is('any') || cnn.sd1 === side)) {
          const is_nom = cnn.check_nom1(nom1);
          if(is_nom || art1glass) {
            all.push({cnn, priority: cnn.priority + (is_nom ? 1000 : 0) + ((art1glass && cnn.sd2 === index) ? 10000 : 0)});
          }
        }
      }
    });
    all.sort((a, b) => b.priority - a.priority);
    return array ? all.map(v => v.cnn) : all[0]?.cnn;
  }

  /**
   * Возвращает соединение между элементами
   * @param {BuilderElement} elm1
   * @param {BuilderElement} elm2
   * @param {Array} [cnn_types]
   * @param {CatCnns} [curr_cnn]
   * @param {Boolean} [ign_side]
   * @param {Boolean} [is_outer]
   * @param {CnnPoint} [cnn_point]
   */
  elm_cnn(elm1, elm2, cnn_types, curr_cnn, ign_side, is_outer, cnn_point){

    const {cnn_types: {acn, t, xx}, cnn_sides} = $p.enm;

    // если установленное ранее соединение проходит по типу и стороне, нового не ищем
    if(curr_cnn && cnn_types && cnn_types.includes(curr_cnn.cnn_type) && (cnn_types !== acn.ii)){

      // TODO: проверить геометрию
      if(!curr_cnn.stop_applying(cnn_point) && ign_side !== 0) {
        if(!ign_side && curr_cnn.sd1 == cnn_sides.inner){
          if(typeof is_outer == 'boolean'){
            if(!is_outer){
              return curr_cnn;
            }
          }
          else{
            if(elm2.cnn_side(elm1) == cnn_sides.inner){
              return curr_cnn;
            }
          }
        }
        else if(!ign_side && curr_cnn.sd1 == cnn_sides.outer){
          if(is_outer || elm2.cnn_side(elm1) == cnn_sides.outer)
            return curr_cnn;
        }
        else{
          return curr_cnn;
        }
      }
    }

    const cnns = this.nom_cnn(elm1, elm2, cnn_types, ign_side, is_outer, cnn_point);

    // сортируем по непустой стороне и приоритету
    if(cnns.length){
      return curr_cnn && cnns.includes(curr_cnn) ? curr_cnn : cnns[0];
    }
    // TODO: возможно, надо вернуть соединение с пустотой
    else{

    }
  }

  /**
   * Возвращает временное соединение по паре номенклатур и типу
   * @param nom1 {CatNom}
   * @param nom2 {CatNom}
   * @param [cnn_type]
   * @return {CatCnns}
   */
  by_nom(nom1, nom2, cnn_type = 'ad') {
    if(typeof cnn_type === 'string') {
      cnn_type = $p.enm.cnn_types[cnn_type]; 
    }
    
    if(!this._by_cnn_type) {
      this._by_cnn_type = new Map();
    }
    if(!this._by_cnn_type.has(cnn_type)) {
      this._by_cnn_type.set(cnn_type, new Map());
    }
    const root = this._by_cnn_type.get(cnn_type)
    if(!root.has(nom1)) {
      root.set(nom1, new Map());
    }
    if(!root.get(nom1).has(nom2)) {
      const tmp = this.create(false, false, true);
      tmp.cnn_type = cnn_type;
      tmp.cnn_elmnts.add({nom1, nom2});
      tmp._set_loaded(tmp.ref);
      root.get(nom1).set(nom2, tmp);
    }
    return root.get(nom1).get(nom2);
  }

}
$p.cat.create('cnns', CatCnnsManager, false);
class CatFurns extends CatObj{
get flap_weight_max(){return this._getter('flap_weight_max')}
set flap_weight_max(v){this._setter('flap_weight_max',v)}
get left_right(){return this._getter('left_right')}
set left_right(v){this._setter('left_right',v)}
get is_set(){return this._getter('is_set')}
set is_set(v){this._setter('is_set',v)}
get is_sliding(){return this._getter('is_sliding')}
set is_sliding(v){this._setter('is_sliding',v)}
get furn_set(){return this._getter('furn_set')}
set furn_set(v){this._setter('furn_set',v)}
get side_count(){return this._getter('side_count')}
set side_count(v){this._setter('side_count',v)}
get clr_group(){return this._getter('clr_group')}
set clr_group(v){this._setter('clr_group',v)}
get handle_side(){return this._getter('handle_side')}
set handle_side(v){this._setter('handle_side',v)}
get open_type(){return this._getter('open_type')}
set open_type(v){this._setter('open_type',v)}
get name_short(){return this._getter('name_short')}
set name_short(v){this._setter('name_short',v)}
get applying(){return this._getter('applying')}
set applying(v){this._setter('applying',v)}
get formula(){return this._getter('formula')}
set formula(v){this._setter('formula',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get open_tunes(){return this._getter_ts('open_tunes')}
set open_tunes(v){this._setter_ts('open_tunes',v)}
get specification(){return this._getter_ts('specification')}
set specification(v){this._setter_ts('specification',v)}
get selection_params(){return this._getter_ts('selection_params')}
set selection_params(v){this._setter_ts('selection_params',v)}
get specification_restrictions(){return this._getter_ts('specification_restrictions')}
set specification_restrictions(v){this._setter_ts('specification_restrictions',v)}
get attrs_option(){return this._getter_ts('attrs_option')}
set attrs_option(v){this._setter_ts('attrs_option',v)}
}
$p.CatFurns = CatFurns;
class CatFurnsOpen_tunesRow extends TabularSectionRow{
get side(){return this._getter('side')}
set side(v){this._setter('side',v)}
get lmin(){return this._getter('lmin')}
set lmin(v){this._setter('lmin',v)}
get lmax(){return this._getter('lmax')}
set lmax(v){this._setter('lmax',v)}
get amin(){return this._getter('amin')}
set amin(v){this._setter('amin',v)}
get amax(){return this._getter('amax')}
set amax(v){this._setter('amax',v)}
get arc_available(){return this._getter('arc_available')}
set arc_available(v){this._setter('arc_available',v)}
get shtulp_available(){return this._getter('shtulp_available')}
set shtulp_available(v){this._setter('shtulp_available',v)}
get shtulp_fix_here(){return this._getter('shtulp_fix_here')}
set shtulp_fix_here(v){this._setter('shtulp_fix_here',v)}
get rotation_axis(){return this._getter('rotation_axis')}
set rotation_axis(v){this._setter('rotation_axis',v)}
get partial_opening(){return this._getter('partial_opening')}
set partial_opening(v){this._setter('partial_opening',v)}
get outline(){return this._getter('outline')}
set outline(v){this._setter('outline',v)}
}
$p.CatFurnsOpen_tunesRow = CatFurnsOpen_tunesRow;
class CatFurnsSpecificationRow extends TabularSectionRow{
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get dop(){return this._getter('dop')}
set dop(v){this._setter('dop',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get algorithm(){return this._getter('algorithm')}
set algorithm(v){this._setter('algorithm',v)}
get nom_characteristic(){return this._getter('nom_characteristic')}
set nom_characteristic(v){this._setter('nom_characteristic',v)}
get clr(){return this._getter('clr')}
set clr(v){this._setter('clr',v)}
get quantity(){return this._getter('quantity')}
set quantity(v){this._setter('quantity',v)}
get handle_height_base(){return this._getter('handle_height_base')}
set handle_height_base(v){this._setter('handle_height_base',v)}
get fix_ruch(){return this._getter('fix_ruch')}
set fix_ruch(v){this._setter('fix_ruch',v)}
get handle_height_min(){return this._getter('handle_height_min')}
set handle_height_min(v){this._setter('handle_height_min',v)}
get handle_height_max(){return this._getter('handle_height_max')}
set handle_height_max(v){this._setter('handle_height_max',v)}
get handle_base_filter(){return this._getter('handle_base_filter')}
set handle_base_filter(v){this._setter('handle_base_filter',v)}
get contraction(){return this._getter('contraction')}
set contraction(v){this._setter('contraction',v)}
get contraction_option(){return this._getter('contraction_option')}
set contraction_option(v){this._setter('contraction_option',v)}
get coefficient(){return this._getter('coefficient')}
set coefficient(v){this._setter('coefficient',v)}
get flap_weight_min(){return this._getter('flap_weight_min')}
set flap_weight_min(v){this._setter('flap_weight_min',v)}
get flap_weight_max(){return this._getter('flap_weight_max')}
set flap_weight_max(v){this._setter('flap_weight_max',v)}
get side(){return this._getter('side')}
set side(v){this._setter('side',v)}
get cnn_side(){return this._getter('cnn_side')}
set cnn_side(v){this._setter('cnn_side',v)}
get offset_option(){return this._getter('offset_option')}
set offset_option(v){this._setter('offset_option',v)}
get formula(){return this._getter('formula')}
set formula(v){this._setter('formula',v)}
get transfer_option(){return this._getter('transfer_option')}
set transfer_option(v){this._setter('transfer_option',v)}
get overmeasure(){return this._getter('overmeasure')}
set overmeasure(v){this._setter('overmeasure',v)}
get is_set_row(){return this._getter('is_set_row')}
set is_set_row(v){this._setter('is_set_row',v)}
get is_procedure_row(){return this._getter('is_procedure_row')}
set is_procedure_row(v){this._setter('is_procedure_row',v)}
get is_order_row(){return this._getter('is_order_row')}
set is_order_row(v){this._setter('is_order_row',v)}
get stage(){return this._getter('stage')}
set stage(v){this._setter('stage',v)}
get inset(){return this._getter('inset')}
set inset(v){this._setter('inset',v)}
}
$p.CatFurnsSpecificationRow = CatFurnsSpecificationRow;
class CatFurnsSpecification_restrictionsRow extends TabularSectionRow{
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get dop(){return this._getter('dop')}
set dop(v){this._setter('dop',v)}
get side(){return this._getter('side')}
set side(v){this._setter('side',v)}
get lmin(){return this._getter('lmin')}
set lmin(v){this._setter('lmin',v)}
get lmax(){return this._getter('lmax')}
set lmax(v){this._setter('lmax',v)}
get amin(){return this._getter('amin')}
set amin(v){this._setter('amin',v)}
get amax(){return this._getter('amax')}
set amax(v){this._setter('amax',v)}
get for_direct_profile_only(){return this._getter('for_direct_profile_only')}
set for_direct_profile_only(v){this._setter('for_direct_profile_only',v)}
}
$p.CatFurnsSpecification_restrictionsRow = CatFurnsSpecification_restrictionsRow;
class CatFurnsAttrs_optionRow extends TabularSectionRow{
get mmin(){return this._getter('mmin')}
set mmin(v){this._setter('mmin',v)}
get mmax(){return this._getter('mmax')}
set mmax(v){this._setter('mmax',v)}
get formula(){return this._getter('formula')}
set formula(v){this._setter('formula',v)}
get furn_set(){return this._getter('furn_set')}
set furn_set(v){this._setter('furn_set',v)}
}
$p.CatFurnsAttrs_optionRow = CatFurnsAttrs_optionRow;
$p.cat.create('furns');
class CatClrs extends CatObj{
get ral(){return this._getter('ral')}
set ral(v){this._setter('ral',v)}
get machine_tools_clr(){return this._getter('machine_tools_clr')}
set machine_tools_clr(v){this._setter('machine_tools_clr',v)}
get clr_str(){return this._getter('clr_str')}
set clr_str(v){this._setter('clr_str',v)}
get clr_out(){return this._getter('clr_out')}
set clr_out(v){this._setter('clr_out',v)}
get clr_in(){return this._getter('clr_in')}
set clr_in(v){this._setter('clr_in',v)}
get grouping(){return this._getter('grouping')}
set grouping(v){this._setter('grouping',v)}
get area_src(){return this._getter('area_src')}
set area_src(v){this._setter('area_src',v)}
get predefined_name(){return this._getter('predefined_name')}
set predefined_name(v){this._setter('predefined_name',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}


  /**
   * Возвращает инверсный по отношению к текущему
   * @returns {CatClrs}
   */
  inverted() {
    return this._manager.inverted(this);
  }

  /**
   * Признак составного
   * @returns {boolean}
   */
  is_composite() {
    const {clr_in, clr_out} = this;
    return clr_in != clr_out && !(clr_in.empty() || clr_out.empty());
  }

  /**
   * Рассчитывает реквизит grouping
   * @param values {Array}
   */
  set_grouping(values) {
    const {clr_in, clr_out, _manager} = this;
    const white = _manager.predefined('Белый');
    const grp_in = clr_in === white ? 'Белый' : clr_in.grouping.name.split(' ')[0];
    const grp_out = clr_out === white ? 'Белый' : clr_out.grouping.name.split(' ')[0];
    if(!grp_in || grp_in === 'Нет' || !grp_out || grp_out === 'Нет') {
      this.grouping = values.find((v) => v.name === 'Нет');
    }
    else {
      this.grouping = values.find((v) => v.name.startsWith(grp_in) && v.name.endsWith(grp_out));
    }
  }

  /**
   * Возвращает стороны, на которых цвет
   * @return {Object}
   */
  get sides() {
    const res = {is_in: false, is_out: false};
    if(!this.empty() && !this.predefined_name){
      const {clr_in, clr_out} = this;
      if(clr_in.empty() && clr_out.empty()){
        res.is_in = res.is_out = true;
      }
      else{
        if(!clr_in.empty() && !clr_in.predefined_name){
          res.is_in = true;
        }
        if(!clr_out.empty() && !clr_out.predefined_name){
          res.is_out = true;
        }
      }
    }
    return res;
  }

  /**
   * Аналог метода `contains()` цветоценовых групп
   * @param clr {CatClrs}
   * @param [fake]
   * @param [any] {Boolean}
   * @return {Boolean}
   */
  contains(clr, fake, any) {
    if(clr === this) {
      return true;
    }
    else if (clr.is_composite() && any) {
      return clr.clr_in === this || clr.clr_out === this;
    }
    return  false;
  }
}
$p.CatClrs = CatClrs;
class CatClrsManager extends CatManager {

  /**
   * Получает цвет с учётом длинных гвидов
   * при необходимости, создаёт составной на лету
   */
  getter(ref) {
    if(ref && ref.length === 72) {
      const clr_in = ref.substring(0, 36);
      const clr_out = ref.substring(36);
      let in_out = this.get(ref);
      if(in_out.is_new()) {
        Object.assign(in_out._obj, {clr_in, clr_out, parent: $p.job_prm.builder.composite_clr_folder.valueOf()});
        in_out._obj.name = (in_out.clr_in.name && in_out.clr_out.name) ?
          `${in_out.clr_in.name} \\ ${in_out.clr_out.name}` : '';
        in_out._set_loaded(ref);
      }
      return in_out;
    }
    return this.get(ref);
  }

  /**
   * Ссылка составного цвета
   *
   * @param curr {('clr_in'|'clr_out')}
   * @param other {CatClrs}
   * @param v {CatClrs|String}
   * @return {String}
   */
  composite_ref(curr, other, v) {
    let clr = this.get(v);
    if(clr.empty()) {
      clr = this.predefined('БезЦвета');
    }
    else if(!clr[curr].empty()) {
      clr = clr[curr];
    }
    if(other.empty()) {
      other = this.predefined('БезЦвета');
    }
    if(clr.valueOf() === other.valueOf()) {
      return clr.valueOf();
    }
    return curr === 'clr_in' ? clr.valueOf() + other.valueOf() : other.valueOf() + clr.valueOf();
  }

  /**
   * Ищет по цветам снаружи-изнутри
   * @return {CatClrs}
   */
  by_in_out({clr_in, clr_out}) {
    const {wsql, utils: {blank}} = $p;
    // скомпилированный запрос
    if(!this._by_in_out) {
      this._by_in_out = wsql.alasql.compile('select top 1 ref from ? where clr_in = ? and clr_out = ? and (not ref = ?)');
    }
    // ищем в справочнике цветов
    const ares = this._by_in_out([this.alatable, clr_in.valueOf(), clr_out.valueOf(), blank.guid]);
    return this.get(ares[0]);
  }

  clr_prm({row_base, row_spec, elm, origin, ox}) {
    const {enm: {predefined_formulas: {clr_prm}, comparison_types: ct}} = $p;
    if(!ox && elm) {
      ox = elm.ox;
    }
    if(row_base?.algorithm === clr_prm && ox) {
      let param;
      if(row_base._or) {
        for(const grp of row_base._or.values()) {
          for(const prow of grp) {
            if(prow.origin == "algorithm") {
              param = prow.param;
              break;
            }
            if(param) {
              break;
            }
          }
        }
      }
      if(!param && origin) {
        const ctypes = [ct.get(), ct.eq];
        origin.selection_params.find_rows({elm: row_base.elm}, (prow) => {
          if(ctypes.includes(prow.comparison_type) && prow.param.type.types.includes('cat.clrs') && (!prow.value || prow.value.empty())) {
            param = prow.param;
          }
        });
      }
      if(param) {
        const cnstr = elm?.elm ? [0, -elm.elm] : 0;
        row_spec.clr = (ox || elm.ox).extract_value({cnstr, param});
      }
    }
    return row_spec.clr;
  }

  /**
   * Возвращает цвет по предопределенному цвету при формировании спецификации
   * @param {CatClrs} clr - цвет исходной строки соединения, фурнитуры или вставки
   * @param {CatClrs} clr_elm - цвет элемента
   * @param {CatClrs} clr_sch - цвет изделия
   * @param {BuilderElement} [elm] - элемент рисовалки
   * @param {TabularSection} [spec] - табчасть спецификации для поиска ведущих
   * @param {CatCharacteristicsSpecificationRow} [row] - строка спецификации, где есть `nom`
   * @param {CatInsertsSpecificationRow|CatFurnsSpecificationRow|CatCnnsSpecificationRow} [row_base] - исходная строка вставки, соединения или фурнитуры
   * @return {CatClrs}
   */
  by_predefined(clr, clr_elm, clr_sch, elm, spec, row, row_base) {
    const {predefined_name} = clr;
    const flipped = elm?.layer?.flipped;
    const {clr_by_main_row} = $p.job_prm.builder;
    if(predefined_name) {
      switch (predefined_name) {
      case 'КакЭлемент':
        if(clr_by_main_row && elm?._attr?.row_spec) {
          clr_elm = elm?._attr?.row_spec.clr;
        }
        return flipped ? this.inverted(clr_elm) :  clr_elm;

      case 'КакИзделие':
        return clr_sch;

      case 'КакЭлементСнаружи':
        if(clr_by_main_row && elm?._attr?.row_spec) {
          clr_elm = elm?._attr?.row_spec.clr;
        }
        return flipped ? this.by_predefined({predefined_name: 'КакЭлементИзнутри'}, clr_elm) :
          clr_elm.clr_out.empty() ? clr_elm : clr_elm.clr_out;

      case 'КакЭлементИзнутри':
        if(clr_by_main_row && elm?._attr?.row_spec) {
          clr_elm = elm?._attr?.row_spec.clr;
        }
        return flipped ?
          this.by_predefined({predefined_name: 'КакЭлементСнаружи'}, clr_elm) :
          clr_elm.clr_in.empty() ? clr_elm : clr_elm.clr_in;
        
      case 'КакЭлИзнутриПлюсКонст': {
        if(clr_by_main_row && elm?._attr?.row_spec) {
          clr_elm = elm?._attr?.row_spec.clr;
        }
        clr_elm = clr_elm.clr_in.empty() ? clr_elm : clr_elm.clr_in;
        const row_cond = row_base?._owner?._owner?.selection_params?.find({
          elm: row_base.elm,
          origin: $p.enm.plan_detailing.algorithm,
        });
        if(row_cond) {
          clr_elm = this.getter(`${clr_elm.ref}${row_cond.value.ref}`);
        }
        return flipped ? this.inverted(clr_elm) : clr_elm;
      } 
      
      case 'КакЭлСнаружиПлюсКонст': {
        if(clr_by_main_row && elm?._attr?.row_spec) {
          clr_elm = elm?._attr?.row_spec.clr;
        }
        clr_elm = clr_elm.clr_out.empty() ? clr_elm : clr_elm.clr_out;
        const row_cond = row_base?._owner?._owner?.selection_params?.find({
          elm: row_base.elm,
          origin: $p.enm.plan_detailing.algorithm,
        });
        if(row_cond) {
          clr_elm = this.getter(`${row_cond.value.ref}${clr_elm.ref}`);
        }
        return flipped ? this.inverted(clr_elm) : clr_elm;
      }       
      case 'БезЦветаИзнутри':
        if(clr_by_main_row && elm?._attr?.row_spec) {
          clr_elm = elm?._attr?.row_spec.clr;
        }
        clr_elm = this.getter(`${this.predefined('БезЦвета').ref}${
          (clr_elm.clr_out.empty() ? clr_elm : clr_elm.clr_out).ref}`);
        return flipped ? this.inverted(clr_elm) : clr_elm;

      case 'БезЦветаСнаружи':
        if(clr_by_main_row && elm?._attr?.row_spec) {
          clr_elm = elm?._attr?.row_spec.clr;
        }
        clr_elm = this.getter(`${
          (clr_elm.clr_in.empty() ? clr_elm : clr_elm.clr_in).ref}${this.predefined('БезЦвета').ref}`);
        return flipped ? this.inverted(clr_elm) : clr_elm;

      case 'КакИзделиеСнаружи':
        return flipped ? this.by_predefined({predefined_name: 'КакИзделиеИзнутри'}, clr_elm, clr_sch) :
          clr_sch.clr_out.empty() ? clr_sch : clr_sch.clr_out;

      case 'КакИзделиеИзнутри':
        return flipped ? this.by_predefined({predefined_name: 'КакИзделиеСнаружи'}, clr_elm, clr_sch) :
          clr_sch.clr_in.empty() ? clr_sch : clr_sch.clr_in;

      case 'КакЭлементИнверсный':
        if(clr_by_main_row && elm?._attr?.row_spec) {
          clr_elm = elm?._attr?.row_spec.clr;
        }
        return flipped ? clr_elm : this.inverted(clr_elm);

      case 'КакИзделиеИнверсный':
        return this.inverted(clr_sch);

      case 'БезЦвета':
        return this.get();
      case 'Белый':
      case 'Прозрачный':
        return clr;
      case 'КакВоВставке':
        if(!elm){
          return clr_elm;
        }
        const {inset} = elm;
        const main_rows = inset.main_rows(elm);
        if(main_rows.length) {
          const row_base = main_rows[0];
          const row_spec = {clr: this.by_predefined(row_base.clr, clr_elm, clr_sch, elm, spec, row, row_base)};
          this.clr_prm({row_base, row_spec, elm, origin: inset});
          return row_spec.clr;
        }
        return clr_elm;
      case 'КакНом':
        const nom = row ? row.nom : (elm && elm.nom);
        return nom ? nom.clr : (clr.empty() ? clr_elm : clr);
      case 'КакВедущий':
      case 'КакВедущийИзнутри':
      case 'КакВедущийСнаружи':
      case 'КакВедущийИнверсный':
        const sub_clr = this.predefined(predefined_name.replace('КакВедущий', 'КакЭлемент'));
        const t_parent = elm?.t_parent?.();
        if(!elm || !t_parent || elm === t_parent){
          return this.by_predefined(sub_clr,  clr_elm);
        }
        let finded;
        spec && spec.find_rows({elm: t_parent.elm, nom: t_parent.nom}, (row) => {
          finded = this.by_predefined(sub_clr,  row.clr);
          return false;
        });
        return finded || this.by_predefined(sub_clr,  t_parent.clr, clr_sch, t_parent, spec, row, row_base);

      default :
        return clr_elm;
      }
    }
    else if (clr instanceof $p.CatColor_price_groups) {
      const tmp = clr.clr.empty() ? clr_elm : this.by_predefined(clr.clr, clr_elm, clr_sch, elm, spec, row, row_base);
      for(const row of clr.clr_conformity) {
        if(row.clr1.contains(tmp)) {
          return row.clr2;
        }
      }
      return tmp;
    }
    else if (clr instanceof $p.CatFormulas) {

    }
    return clr.empty() ? (flipped ? this.inverted(clr_elm) :  clr_elm) : clr;
  }

  /**
   * Инверсный цвет  
   * Возвращает элемент, цвета которого изнутри и снаружи перевёрнуты местами
   * @param clr {CatClrs} - исходный цвет
   */
  inverted(clr){
    if(!clr.is_composite()) {
      return clr;
    }
    const {clr_in, clr_out} = clr;
    return this.getter(`${clr_out.valueOf()}${clr_in.valueOf()}`);
  }

  /**
   * Возвращает предопределенный цвет НеВключатьВСпецификацию
   */
  ignored() {
    return this.predefined('НеВключатьВСпецификацию');
  }

  /**
   * Скрывает составные цвета в отборе
   * @param mf {Object} метаданные поля
   * @param [clr_group] {CatColor_price_groups} цветогруппа
   * @param [side] {EmnCnnSides} сторона цвета
   */
  hide_composite(mf, clr_group, side) {
    const choice_param = mf.choice_params && mf.choice_params.find(({name}) => name === 'parent');
    const {composite_clr_folder: ccf} = $p.job_prm.builder;
    if(typeof side === 'string') {
      side = $p.enm.cnn_sides[side];
    }
    if(choice_param && choice_param.path.not) {
      choice_param.path = {nin: [choice_param.path.not, ccf]};
    }
    else if(choice_param && choice_param.path.nin && !choice_param.path.nin.find(v => v === ccf)) {
      choice_param.path.nin.push(ccf);
    }
    else {
      if(!mf.choice_params) {
        mf.choice_params = [{
          name: 'parent',
          path: {not: ccf},
        }];
      }
    }
    if(clr_group && side) {
      const srows = clr_group.exclude.find_rows({side}).map(({_row}) => _row.clr);
      const choice_param = srows.length && mf.choice_params.find(({name}) => name === 'ref');
      if(choice_param) {
        const {path} = choice_param;
        if(path.in) {
          delete choice_param.path;
          choice_param.path = {in: path.in.filter((o) => !srows.some((cg) => cg.contains(o)))};
        }
      }
    }
  }

  /**
   * Дополняет связи параметров выбора отбором, исключающим служебные цвета
   * @param mf {Object} - описание метаданных поля
   * @param sys {Object} - объект, у которого можно спросить связи
   * @param [project] {Scheme} - текущий проект
   */
  selection_exclude_service(mf, sys, project) {
    if(mf.choice_params) {
      mf.choice_params.length = 0;
    }
    else {
      mf.choice_params = [];
    }

    const {job_prm, cat: {clrs}, CatClrs, CatColor_price_groups, DpBuyers_order, Editor} = $p;
    
    if(!project && sys instanceof Editor.BuilderElement) {
      project = sys.project;
    }

    mf.choice_params.push({
      name: 'parent',
      path: {not: clrs.predefined('СЛУЖЕБНЫЕ')}
    });

    if(sys) {

      // связи параметров для цвета изделия
      const {clr_product} = job_prm.properties;
      const filter = {}
      if(clr_product && sys instanceof DpBuyers_order) {
        const links = clr_product.params_links({obj: {project, _owner: {_owner: sys.characteristic}}});
        // проверим вхождение значения в доступные и при необходимости изменим
        if(links.length) {
          clr_product.filter_params_links(filter, null, links);
          filter.ref && mf.choice_params.push({
            name: 'ref',
            path: filter.ref,
          });
        }
      }

      // фильтр доступных цветов системы или вставки
      let clr_group = clrs.find_group(sys, project?.ox || project);

      mf.choice_params.push({
        name: 'ref',
        get path() {
          if(clr_group.empty() || (!clr_group.clr_conformity.count() && clr_group.condition_formula.empty())) {
            return {not: ''};
          }
          return {in: clr_group.clrs()};
        }
      });

      // подмешиваем признак сокрытия составных
      if(clr_group.hide_composite) {
        mf.hide_composite = true;
      }
      else if(mf.hide_composite) {
        mf.hide_composite = false;
      }

      // если разрешен единственный цвет, установим ro
      if(!clr_group.empty() && clr_group.clrs().length === 1) {
        mf.single_value = clr_group.clrs()[0];
      }
      else if(filter.ref?.in && filter.ref.in?.length === 1) {
        mf.single_value = filter.ref.in[0];
      }
      else if(mf.single_value) {
        delete mf.single_value;
      }
      return clr_group;
    }
  }

  /**
   * ищет цветогруппу для sys неопределенного типа
   * @param sys
   * @return {CatColor_price_groups}
   */
  find_group(sys, ox) {
    const {EditorInvisible: {BuilderElement, Filling}, classes: {DataProcessorObj}} = $p;
    let clr_group;
    if(sys instanceof BuilderElement) {
      clr_group = sys.inset.clr_group;
      if(clr_group.empty() && !(sys instanceof Filling)) {
        clr_group = sys.layer.sys.find_group(ox);
      }
    }
    else if(sys.hasOwnProperty('sys') && sys.profile && sys.profile.inset) {
      const iclr_group = sys.profile.inset.clr_group;
      clr_group = iclr_group.empty() ? sys.sys.find_group(ox) : iclr_group;
    }
    else if(sys.sys && sys.sys.find_group) {
      clr_group = sys.sys.find_group(ox);
    }
    else if(sys.sys && sys.sys.clr_group) {
      clr_group = sys.sys.clr_group;
    }
    else if(sys instanceof DataProcessorObj && ox) {
      clr_group = ox.sys.find_group(ox);
    }
    else {
      clr_group = sys.find_group ? sys.find_group(ox) : sys.clr_group;
    }
    return clr_group || this.get();
  }

}
$p.cat.create('clrs', CatClrsManager, false);
class CatColor_price_groups extends CatObj{
get color_price_group_destination(){return this._getter('color_price_group_destination')}
set color_price_group_destination(v){this._setter('color_price_group_destination',v)}
get condition_formula(){return this._getter('condition_formula')}
set condition_formula(v){this._setter('condition_formula',v)}
get mode(){return this._getter('mode')}
set mode(v){this._setter('mode',v)}
get hide_composite(){return this._getter('hide_composite')}
set hide_composite(v){this._setter('hide_composite',v)}
get clr(){return this._getter('clr')}
set clr(v){this._setter('clr',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get price_groups(){return this._getter_ts('price_groups')}
set price_groups(v){this._setter_ts('price_groups',v)}
get clr_conformity(){return this._getter_ts('clr_conformity')}
set clr_conformity(v){this._setter_ts('clr_conformity',v)}
get exclude(){return this._getter_ts('exclude')}
set exclude(v){this._setter_ts('exclude',v)}


  /**
   * Рассчитывает и устанавливает при необходимости в obj цвет по умолчанию
   * @param [obj] - если указано, в поле clr этого объекта будет установлен цвет
   * @return CatClrs
   */
  default_clr(obj = {}) {

    // а надо ли устанавливать? если не задано ограничение, выходим
    const available = this.clrs();

    // бежим по строкам ограничения цветов
    if(available.length && !this.contains(obj.clr, available)) {
      // подставляем первый разрешенный
      obj.clr = available[0];
    }

    return obj.clr;
  }

  /**
   * Извлекает доступные цвета
   * @param [side] {EmnCnnSides}
   * @return {Array.<CatClrs>}
   */
  clrs(side) {
    const {_manager: {_owner}, _data, condition_formula: formula, mode, clr_conformity} = this;
    const {cat} = _owner.$p;
    if(!_data.clrs) {
      const clrs = new Set();

      clr_conformity.forEach(({clr1}) => {
        if(clr1 instanceof CatClrs) {
          if(clr1.is_folder) {
            clr1._children().forEach((clr) => clrs.add(clr));
          }
          else {
            clrs.add(clr1);
          }
        }
        else if(clr1 instanceof CatColor_price_groups) {
          for(const clr of clr1.clrs()) {
            clrs.add(clr);
          }
        }
      });

      // уточним по формуле условия
      if(!formula.empty()) {
        const attr = {clrs};
        if(!mode) {
          _data.clrs = Array.from(clrs).filter((clr) => formula.execute(clr, attr));
        }
        else {
          cat.clrs.forEach((clr) => {
            if(clr.parent.predefined_name || clrs.has(clr)) {
              return;
            }
            if(formula.execute(clr, attr)) {
              clrs.add(clr);
            }
          })
        }
      }

      if(!_data.clrs) {
        _data.clrs = Array.from(clrs);
      }
    }
    const srows = this.exclude.find_rows({side});
    return srows.length ? _data.clrs.filter((clr) => {
      for(const {clr: eclr} of srows) {
        if((eclr === clr) || (eclr instanceof CatColor_price_groups && eclr.contains(clr))) {
          return false;
        }
      }
      return true;
    }) : _data.clrs;
  }

  /**
   * Проверяет, подходит ли цвет данной группе
   * @param clr {CatClrs} - цвет, который проверяем
   * @param [clrs] {Array} - массив clrs, если не задан, рассчитываем
   * @param [any] {Boolean} - признак для составных - учитывать обе стороны или любую
   * @returns {boolean}
   */
  contains(clr, clrs, any) {
    if(this.empty() && !clrs) {
      return true;
    }
    if(!clrs) {
      clrs = this.clrs();
    }
    if(!clrs.length) {
      return true;
    }
    if(clr.is_composite()) {
      return any ?
          (clrs.includes(clr.clr_in) || clrs.includes(clr.clr_out)) :
          clrs.includes(clr.clr_in) && clrs.includes(clr.clr_out);  
    }
    return clrs.includes(clr) && !this.exclude.find({side: 'Любая', clr});
  }}
$p.CatColor_price_groups = CatColor_price_groups;
class CatColor_price_groupsPrice_groupsRow extends TabularSectionRow{
get price_group(){return this._getter('price_group')}
set price_group(v){this._setter('price_group',v)}
}
$p.CatColor_price_groupsPrice_groupsRow = CatColor_price_groupsPrice_groupsRow;
class CatColor_price_groupsClr_conformityRow extends TabularSectionRow{
get clr1(){return this._getter('clr1')}
set clr1(v){this._setter('clr1',v)}
get clr2(){return this._getter('clr2')}
set clr2(v){this._setter('clr2',v)}
}
$p.CatColor_price_groupsClr_conformityRow = CatColor_price_groupsClr_conformityRow;
class CatColor_price_groupsExcludeRow extends TabularSectionRow{
get side(){return this._getter('side')}
set side(v){this._setter('side',v)}
get clr(){return this._getter('clr')}
set clr(v){this._setter('clr',v)}
}
$p.CatColor_price_groupsExcludeRow = CatColor_price_groupsExcludeRow;
$p.cat.create('color_price_groups');
class CatUsers extends CatObj{
get invalid(){return this._getter('invalid')}
set invalid(v){this._setter('invalid',v)}
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get individual_person(){return this._getter('individual_person')}
set individual_person(v){this._setter('individual_person',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get ancillary(){return this._getter('ancillary')}
set ancillary(v){this._setter('ancillary',v)}
get user_ib_uid(){return this._getter('user_ib_uid')}
set user_ib_uid(v){this._setter('user_ib_uid',v)}
get id(){return this._getter('id')}
set id(v){this._setter('id',v)}
get latin(){return this._getter('latin')}
set latin(v){this._setter('latin',v)}
get prefix(){return this._getter('prefix')}
set prefix(v){this._setter('prefix',v)}
get branch(){return this._getter('branch')}
set branch(v){this._setter('branch',v)}
get push_only(){return this._getter('push_only')}
set push_only(v){this._setter('push_only',v)}
get roles(){return this._getter('roles')}
set roles(v){this._setter('roles',v)}
get ips(){return this._getter('ips')}
set ips(v){this._setter('ips',v)}
get suffix(){return this._getter('suffix')}
set suffix(v){this._setter('suffix',v)}
get direct(){return this._getter('direct')}
set direct(v){this._setter('direct',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
get contact_information(){return this._getter_ts('contact_information')}
set contact_information(v){this._setter_ts('contact_information',v)}
get acl_objs(){return this._getter_ts('acl_objs')}
set acl_objs(v){this._setter_ts('acl_objs',v)}
get ids(){return this._getter_ts('ids')}
set ids(v){this._setter_ts('ids',v)}
get subscribers(){return this._getter_ts('subscribers')}
set subscribers(v){this._setter_ts('subscribers',v)}
}
$p.CatUsers = CatUsers;
class CatUsersContact_informationRow extends TabularSectionRow{
get type(){return this._getter('type')}
set type(v){this._setter('type',v)}
get kind(){return this._getter('kind')}
set kind(v){this._setter('kind',v)}
get presentation(){return this._getter('presentation')}
set presentation(v){this._setter('presentation',v)}
get values_fields(){return this._getter('values_fields')}
set values_fields(v){this._setter('values_fields',v)}
get country(){return this._getter('country')}
set country(v){this._setter('country',v)}
get region(){return this._getter('region')}
set region(v){this._setter('region',v)}
get city(){return this._getter('city')}
set city(v){this._setter('city',v)}
get email_address(){return this._getter('email_address')}
set email_address(v){this._setter('email_address',v)}
get phone_number(){return this._getter('phone_number')}
set phone_number(v){this._setter('phone_number',v)}
get phone_without_codes(){return this._getter('phone_without_codes')}
set phone_without_codes(v){this._setter('phone_without_codes',v)}
get list_view(){return this._getter('list_view')}
set list_view(v){this._setter('list_view',v)}
}
$p.CatUsersContact_informationRow = CatUsersContact_informationRow;
class CatUsersAcl_objsRow extends TabularSectionRow{
get acl_obj(){return this._getter('acl_obj')}
set acl_obj(v){this._setter('acl_obj',v)}
get type(){return this._getter('type')}
set type(v){this._setter('type',v)}
get by_default(){return this._getter('by_default')}
set by_default(v){this._setter('by_default',v)}
}
$p.CatUsersAcl_objsRow = CatUsersAcl_objsRow;
class CatUsersIdsRow extends TabularSectionRow{
get identifier(){return this._getter('identifier')}
set identifier(v){this._setter('identifier',v)}
get server(){return this._getter('server')}
set server(v){this._setter('server',v)}
}
$p.CatUsersIdsRow = CatUsersIdsRow;
class CatUsersSubscribersRow extends TabularSectionRow{
get abonent(){return this._getter('abonent')}
set abonent(v){this._setter('abonent',v)}
get branch(){return this._getter('branch')}
set branch(v){this._setter('branch',v)}
get roles(){return this._getter('roles')}
set roles(v){this._setter('roles',v)}
}
$p.CatUsersSubscribersRow = CatUsersSubscribersRow;
class CatUsersManager extends CatManager {

  // после загрузки пользователей, морозим объект, чтобы его невозможно было изменить из интерфейса
  load_array(aattr, forse) {
    const res = [];
    for (let aobj of aattr) {
      let obj = this.by_ref[aobj.ref];
      if(obj && !obj.is_new()) {
        continue;
      }
      if(!aobj.acl_objs) {
        aobj.acl_objs = [];
      }
      const {acl} = aobj;
      delete aobj.acl;
      if(obj) {
        obj._mixin(aobj);
      }
      else {
        obj = new $p.CatUsers(aobj, this, true);
      }

      const {_obj} = obj;
      if(_obj && !_obj._acl) {
        _obj._acl = acl;
        obj._set_loaded();
        Object.freeze(obj);
        Object.freeze(_obj);
        for (let j in _obj) {
          if(typeof _obj[j] == 'object') {
            Object.freeze(_obj[j]);
            for (let k in _obj[j]) {
              typeof _obj[j][k] == 'object' && Object.freeze(_obj[j][k]);
            }
          }
        }
        res.push(obj);
      }
    }
    return res;
  }

  // пользователей не выгружаем
  unload_obj() {	}

}
$p.cat.create('users', CatUsersManager, false);
class CatProjects extends CatObj{
get finished(){return this._getter('finished')}
set finished(v){this._setter('finished',v)}
get responsible(){return this._getter('responsible')}
set responsible(v){this._setter('responsible',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get category(){return this._getter('category')}
set category(v){this._setter('category',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
get stages(){return this._getter_ts('stages')}
set stages(v){this._setter_ts('stages',v)}
get acl_objs(){return this._getter_ts('acl_objs')}
set acl_objs(v){this._setter_ts('acl_objs',v)}
}
$p.CatProjects = CatProjects;
class CatProjectsStagesRow extends TabularSectionRow{
get stage(){return this._getter('stage')}
set stage(v){this._setter('stage',v)}
get date(){return this._getter('date')}
set date(v){this._setter('date',v)}
get responsible(){return this._getter('responsible')}
set responsible(v){this._setter('responsible',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
}
$p.CatProjectsStagesRow = CatProjectsStagesRow;
class CatProjectsAcl_objsRow extends TabularSectionRow{
get acl_obj(){return this._getter('acl_obj')}
set acl_obj(v){this._setter('acl_obj',v)}
}
$p.CatProjectsAcl_objsRow = CatProjectsAcl_objsRow;
$p.cat.create('projects');
class CatStores extends CatObj{
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get assembly_days(){return this._getter('assembly_days')}
set assembly_days(v){this._setter('assembly_days',v)}
get address(){return this._getter('address')}
set address(v){this._setter('address',v)}
get latitude(){return this._getter('latitude')}
set latitude(v){this._setter('latitude',v)}
get longitude(){return this._getter('longitude')}
set longitude(v){this._setter('longitude',v)}
get delivery_area(){return this._getter('delivery_area')}
set delivery_area(v){this._setter('delivery_area',v)}
get address_fields(){return this._getter('address_fields')}
set address_fields(v){this._setter('address_fields',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
}
$p.CatStores = CatStores;
$p.cat.create('stores');
class CatWork_shifts extends CatObj{
get predefined_name(){return this._getter('predefined_name')}
set predefined_name(v){this._setter('predefined_name',v)}
get work_shift_periodes(){return this._getter_ts('work_shift_periodes')}
set work_shift_periodes(v){this._setter_ts('work_shift_periodes',v)}
}
$p.CatWork_shifts = CatWork_shifts;
class CatWork_shiftsWork_shift_periodesRow extends TabularSectionRow{
get begin_time(){return this._getter('begin_time')}
set begin_time(v){this._setter('begin_time',v)}
get end_time(){return this._getter('end_time')}
set end_time(v){this._setter('end_time',v)}
}
$p.CatWork_shiftsWork_shift_periodesRow = CatWork_shiftsWork_shift_periodesRow;
$p.cat.create('work_shifts');
class CatCash_flow_articles extends CatObj{
get definition(){return this._getter('definition')}
set definition(v){this._setter('definition',v)}
get sorting_field(){return this._getter('sorting_field')}
set sorting_field(v){this._setter('sorting_field',v)}
get predefined_name(){return this._getter('predefined_name')}
set predefined_name(v){this._setter('predefined_name',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
}
$p.CatCash_flow_articles = CatCash_flow_articles;
$p.cat.create('cash_flow_articles');
class CatNom_prices_types extends CatObj{
get price_currency(){return this._getter('price_currency')}
set price_currency(v){this._setter('price_currency',v)}
get discount_percent(){return this._getter('discount_percent')}
set discount_percent(v){this._setter('discount_percent',v)}
get vat_price_included(){return this._getter('vat_price_included')}
set vat_price_included(v){this._setter('vat_price_included',v)}
get rounding_order(){return this._getter('rounding_order')}
set rounding_order(v){this._setter('rounding_order',v)}
get rounding_in_a_big_way(){return this._getter('rounding_in_a_big_way')}
set rounding_in_a_big_way(v){this._setter('rounding_in_a_big_way',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
}
$p.CatNom_prices_types = CatNom_prices_types;
$p.cat.create('nom_prices_types');
class CatIndividuals extends CatObj{
get birth_date(){return this._getter('birth_date')}
set birth_date(v){this._setter('birth_date',v)}
get sex(){return this._getter('sex')}
set sex(v){this._setter('sex',v)}
get imns_code(){return this._getter('imns_code')}
set imns_code(v){this._setter('imns_code',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get inn(){return this._getter('inn')}
set inn(v){this._setter('inn',v)}
get pfr_number(){return this._getter('pfr_number')}
set pfr_number(v){this._setter('pfr_number',v)}
get birth_place(){return this._getter('birth_place')}
set birth_place(v){this._setter('birth_place',v)}
get Фамилия(){return this._getter('Фамилия')}
set Фамилия(v){this._setter('Фамилия',v)}
get Имя(){return this._getter('Имя')}
set Имя(v){this._setter('Имя',v)}
get Отчество(){return this._getter('Отчество')}
set Отчество(v){this._setter('Отчество',v)}
get ФамилияРП(){return this._getter('ФамилияРП')}
set ФамилияРП(v){this._setter('ФамилияРП',v)}
get ИмяРП(){return this._getter('ИмяРП')}
set ИмяРП(v){this._setter('ИмяРП',v)}
get ОтчествоРП(){return this._getter('ОтчествоРП')}
set ОтчествоРП(v){this._setter('ОтчествоРП',v)}
get ОснованиеРП(){return this._getter('ОснованиеРП')}
set ОснованиеРП(v){this._setter('ОснованиеРП',v)}
get ДолжностьРП(){return this._getter('ДолжностьРП')}
set ДолжностьРП(v){this._setter('ДолжностьРП',v)}
get Должность(){return this._getter('Должность')}
set Должность(v){this._setter('Должность',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get predefined_name(){return this._getter('predefined_name')}
set predefined_name(v){this._setter('predefined_name',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get contact_information(){return this._getter_ts('contact_information')}
set contact_information(v){this._setter_ts('contact_information',v)}
}
$p.CatIndividuals = CatIndividuals;
class CatIndividualsContact_informationRow extends TabularSectionRow{
get type(){return this._getter('type')}
set type(v){this._setter('type',v)}
get kind(){return this._getter('kind')}
set kind(v){this._setter('kind',v)}
get presentation(){return this._getter('presentation')}
set presentation(v){this._setter('presentation',v)}
get values_fields(){return this._getter('values_fields')}
set values_fields(v){this._setter('values_fields',v)}
get country(){return this._getter('country')}
set country(v){this._setter('country',v)}
get region(){return this._getter('region')}
set region(v){this._setter('region',v)}
get city(){return this._getter('city')}
set city(v){this._setter('city',v)}
get email_address(){return this._getter('email_address')}
set email_address(v){this._setter('email_address',v)}
get phone_number(){return this._getter('phone_number')}
set phone_number(v){this._setter('phone_number',v)}
get phone_without_codes(){return this._getter('phone_without_codes')}
set phone_without_codes(v){this._setter('phone_without_codes',v)}
get list_view(){return this._getter('list_view')}
set list_view(v){this._setter('list_view',v)}
}
$p.CatIndividualsContact_informationRow = CatIndividualsContact_informationRow;
$p.cat.create('individuals');
class CatCharacteristics extends CatObj{
get x(){return this._getter('x')}
set x(v){this._setter('x',v)}
get y(){return this._getter('y')}
set y(v){this._setter('y',v)}
get z(){return this._getter('z')}
set z(v){this._setter('z',v)}
get s(){return this._getter('s')}
set s(v){this._setter('s',v)}
get clr(){return $p.cat.clrs.getter(this._obj.clr)}
set clr(v){this._setter('clr',v)}
get weight(){return this._getter('weight')}
set weight(v){this._setter('weight',v)}
get calc_order(){return this._getter('calc_order')}
set calc_order(v){this._setter('calc_order',v)}
get product(){return this._getter('product')}
set product(v){this._setter('product',v)}
get leading_product(){return this._getter('leading_product')}
set leading_product(v){this._setter('leading_product',v)}
get leading_elm(){return this._getter('leading_elm')}
set leading_elm(v){this._setter('leading_elm',v)}
get origin(){return this._getter('origin')}
set origin(v){this._setter('origin',v)}
get base_block(){return this._getter('base_block')}
set base_block(v){this._setter('base_block',v)}
get sys(){return this._getter('sys')}
set sys(v){this._setter('sys',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get obj_delivery_state(){return this._getter('obj_delivery_state')}
set obj_delivery_state(v){this._setter('obj_delivery_state',v)}
get partner(){return this._getter('partner')}
set partner(v){this._setter('partner',v)}
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get builder_props(){return this._getter('builder_props')}
set builder_props(v){this._setter('builder_props',v)}
get svg(){return this._getter('svg')}
set svg(v){this._setter('svg',v)}
get extra(){return this._getter('extra')}
set extra(v){this._setter('extra',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get branch(){return this._getter('branch')}
set branch(v){this._setter('branch',v)}
get owner(){return this._getter('owner')}
set owner(v){this._setter('owner',v)}
get constructions(){return this._getter_ts('constructions')}
set constructions(v){this._setter_ts('constructions',v)}
get coordinates(){return this._getter_ts('coordinates')}
set coordinates(v){this._setter_ts('coordinates',v)}
get inserts(){return this._getter_ts('inserts')}
set inserts(v){this._setter_ts('inserts',v)}
get params(){return this._getter_ts('params')}
set params(v){this._setter_ts('params',v)}
get cnn_elmnts(){return this._getter_ts('cnn_elmnts')}
set cnn_elmnts(v){this._setter_ts('cnn_elmnts',v)}
get glass_specification(){return this._getter_ts('glass_specification')}
set glass_specification(v){this._setter_ts('glass_specification',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
get glasses(){return this._getter_ts('glasses')}
set glasses(v){this._setter_ts('glasses',v)}
get specification(){return this._getter_ts('specification')}
set specification(v){this._setter_ts('specification',v)}
get dop(){return this._getter_ts('dop')}
set dop(v){this._setter_ts('dop',v)}
get demand(){return this._getter_ts('demand')}
set demand(v){this._setter_ts('demand',v)}


  /**
   * @param attr
   * @returns {CatCharacteristics|boolean}
   * перед записью надо пересчитать наименование и рассчитать итоги
   */
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
    
    // масса изделия
    this.weight = this.elm_weight();

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
              parent,
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
                parent,
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
            parent,
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
    
    return project.load(this, attr.builder_props || true)
      .then(() => {
        const {_obj: {glasses, constructions, coordinates}} = this;
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
            link.imgs[`l0`] = project.view.element.toDataURL('image/png').substr(22);
          }
          else {
            link.imgs[`l0`] = project.get_svg(attr);
          }
          if(attr.glasses !== false) {
            constructions.forEach(({cnstr}) => {
              project.draw_fragment({elm: -cnstr});
              if(format === 'png') {
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
    return weight;
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
    rounding: 0,
    mosquito: true,
    jalousie: true,
    grid: 50,
    mirror: false,
    articles: 0,
    glass_numbers: false,
    bw: false,
    mode: 0,
  };}
$p.CatCharacteristics = CatCharacteristics;
class CatCharacteristicsConstructionsRow extends TabularSectionRow{
get cnstr(){return this._getter('cnstr')}
set cnstr(v){this._setter('cnstr',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get x(){return this._getter('x')}
set x(v){this._setter('x',v)}
get y(){return this._getter('y')}
set y(v){this._setter('y',v)}
get z(){return this._getter('z')}
set z(v){this._setter('z',v)}
get w(){return this._getter('w')}
set w(v){this._setter('w',v)}
get h(){return this._getter('h')}
set h(v){this._setter('h',v)}
get furn(){return this._getter('furn')}
set furn(v){this._setter('furn',v)}
get direction(){return this._getter('direction')}
set direction(v){this._setter('direction',v)}
get h_ruch(){return this._getter('h_ruch')}
set h_ruch(v){this._setter('h_ruch',v)}
get fix_ruch(){return this._getter('fix_ruch')}
set fix_ruch(v){this._setter('fix_ruch',v)}
get is_rectangular(){return this._getter('is_rectangular')}
set is_rectangular(v){this._setter('is_rectangular',v)}
get kind(){return this._getter('kind')}
set kind(v){this._setter('kind',v)}
get flipped(){return this._getter('flipped')}
set flipped(v){this._setter('flipped',v)}
get dop(){return this._getter('dop')}
set dop(v){this._setter('dop',v)}
}
$p.CatCharacteristicsConstructionsRow = CatCharacteristicsConstructionsRow;
class CatCharacteristicsCnn_elmntsRow extends TabularSectionRow{
get elm1(){return this._getter('elm1')}
set elm1(v){this._setter('elm1',v)}
get node1(){return this._getter('node1')}
set node1(v){this._setter('node1',v)}
get elm2(){return this._getter('elm2')}
set elm2(v){this._setter('elm2',v)}
get node2(){return this._getter('node2')}
set node2(v){this._setter('node2',v)}
get cnn(){return this._getter('cnn')}
set cnn(v){this._setter('cnn',v)}
get aperture_len(){return this._getter('aperture_len')}
set aperture_len(v){this._setter('aperture_len',v)}
}
$p.CatCharacteristicsCnn_elmntsRow = CatCharacteristicsCnn_elmntsRow;
class CatCharacteristicsGlass_specificationRow extends TabularSectionRow{
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get inset(){return this._getter('inset')}
set inset(v){this._setter('inset',v)}
get clr(){return $p.cat.clrs.getter(this._obj.clr)}
set clr(v){this._setter('clr',v)}
get dop(){return this._getter('dop')}
set dop(v){this._setter('dop',v)}
}
$p.CatCharacteristicsGlass_specificationRow = CatCharacteristicsGlass_specificationRow;
class CatCharacteristicsGlassesRow extends TabularSectionRow{
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get formula(){return this._getter('formula')}
set formula(v){this._setter('formula',v)}
get width(){return this._getter('width')}
set width(v){this._setter('width',v)}
get height(){return this._getter('height')}
set height(v){this._setter('height',v)}
get s(){return this._getter('s')}
set s(v){this._setter('s',v)}
get is_rectangular(){return this._getter('is_rectangular')}
set is_rectangular(v){this._setter('is_rectangular',v)}
get is_sandwich(){return this._getter('is_sandwich')}
set is_sandwich(v){this._setter('is_sandwich',v)}
get thickness(){return this._getter('thickness')}
set thickness(v){this._setter('thickness',v)}
get coffer(){return this._getter('coffer')}
set coffer(v){this._setter('coffer',v)}
}
$p.CatCharacteristicsGlassesRow = CatCharacteristicsGlassesRow;
class CatCharacteristicsSpecificationRow extends TabularSectionRow{
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get clr(){return $p.cat.clrs.getter(this._obj.clr)}
set clr(v){this._setter('clr',v)}
get characteristic(){return this._getter('characteristic')}
set characteristic(v){this._setter('characteristic',v)}
get qty(){return this._getter('qty')}
set qty(v){this._setter('qty',v)}
get len(){return this._getter('len')}
set len(v){this._setter('len',v)}
get width(){return this._getter('width')}
set width(v){this._setter('width',v)}
get s(){return this._getter('s')}
set s(v){this._setter('s',v)}
get alp1(){return this._getter('alp1')}
set alp1(v){this._setter('alp1',v)}
get alp2(){return this._getter('alp2')}
set alp2(v){this._setter('alp2',v)}
get totqty(){return this._getter('totqty')}
set totqty(v){this._setter('totqty',v)}
get totqty1(){return this._getter('totqty1')}
set totqty1(v){this._setter('totqty1',v)}
get price(){return this._getter('price')}
set price(v){this._setter('price',v)}
get amount(){return this._getter('amount')}
set amount(v){this._setter('amount',v)}
get amount_marged(){return this._getter('amount_marged')}
set amount_marged(v){this._setter('amount_marged',v)}
get stage(){return this._getter('stage')}
set stage(v){this._setter('stage',v)}
get origin(){return this._getter('origin')}
set origin(v){this._setter('origin',v)}
get specify(){return this._getter('specify')}
set specify(v){this._setter('specify',v)}
get changed(){return this._getter('changed')}
set changed(v){this._setter('changed',v)}
get dop(){return this._getter('dop')}
set dop(v){this._setter('dop',v)}
}
$p.CatCharacteristicsSpecificationRow = CatCharacteristicsSpecificationRow;
class CatCharacteristicsDopRow extends TabularSectionRow{
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get coordinate(){return this._getter('coordinate')}
set coordinate(v){this._setter('coordinate',v)}
get origin(){return this._getter('origin')}
set origin(v){this._setter('origin',v)}
get dop(){return this._getter('dop')}
set dop(v){this._setter('dop',v)}
}
$p.CatCharacteristicsDopRow = CatCharacteristicsDopRow;
class CatCharacteristicsDemandRow extends TabularSectionRow{
get kind(){return this._getter('kind')}
set kind(v){this._setter('kind',v)}
get days_from_execution(){return this._getter('days_from_execution')}
set days_from_execution(v){this._setter('days_from_execution',v)}
get days_to_execution(){return this._getter('days_to_execution')}
set days_to_execution(v){this._setter('days_to_execution',v)}
}
$p.CatCharacteristicsDemandRow = CatCharacteristicsDemandRow;
$p.cat.create('characteristics');
class CatPrice_groups extends CatObj{
get definition(){return this._getter('definition')}
set definition(v){this._setter('definition',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
}
$p.CatPrice_groups = CatPrice_groups;
$p.cat.create('price_groups');
class CatProject_categories extends CatObj{
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get stages(){return this._getter_ts('stages')}
set stages(v){this._setter_ts('stages',v)}
}
$p.CatProject_categories = CatProject_categories;
class CatProject_categoriesStagesRow extends TabularSectionRow{
get stage(){return this._getter('stage')}
set stage(v){this._setter('stage',v)}
get grouping(){return this._getter('grouping')}
set grouping(v){this._setter('grouping',v)}
}
$p.CatProject_categoriesStagesRow = CatProject_categoriesStagesRow;
$p.cat.create('project_categories');
class CatCharges_discounts extends CatObj{
get price_type(){return this._getter('price_type')}
set price_type(v){this._setter('price_type',v)}
get sorting_field(){return this._getter('sorting_field')}
set sorting_field(v){this._setter('sorting_field',v)}
get application_joint(){return this._getter('application_joint')}
set application_joint(v){this._setter('application_joint',v)}
get application_mode(){return this._getter('application_mode')}
set application_mode(v){this._setter('application_mode',v)}
get predefined_name(){return this._getter('predefined_name')}
set predefined_name(v){this._setter('predefined_name',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get periods(){return this._getter_ts('periods')}
set periods(v){this._setter_ts('periods',v)}
get keys(){return this._getter_ts('keys')}
set keys(v){this._setter_ts('keys',v)}
get price_groups(){return this._getter_ts('price_groups')}
set price_groups(v){this._setter_ts('price_groups',v)}
}
$p.CatCharges_discounts = CatCharges_discounts;
class CatCharges_discountsPeriodsRow extends TabularSectionRow{
get start_date(){return this._getter('start_date')}
set start_date(v){this._setter('start_date',v)}
get expiration_date(){return this._getter('expiration_date')}
set expiration_date(v){this._setter('expiration_date',v)}
}
$p.CatCharges_discountsPeriodsRow = CatCharges_discountsPeriodsRow;
class CatCharges_discountsKeysRow extends TabularSectionRow{
get condition(){return this._getter('condition')}
set condition(v){this._setter('condition',v)}
}
$p.CatCharges_discountsKeysRow = CatCharges_discountsKeysRow;
class CatCharges_discountsPrice_groupsRow extends TabularSectionRow{
get price_group(){return this._getter('price_group')}
set price_group(v){this._setter('price_group',v)}
get value(){return this._getter('value')}
set value(v){this._setter('value',v)}
}
$p.CatCharges_discountsPrice_groupsRow = CatCharges_discountsPrice_groupsRow;
$p.cat.create('charges_discounts');
class CatNom_groups extends CatObj{
get vat_rate(){return this._getter('vat_rate')}
set vat_rate(v){this._setter('vat_rate',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
}
$p.CatNom_groups = CatNom_groups;
$p.cat.create('nom_groups');
class CatAbonents extends CatObj{
get no_mdm(){return this._getter('no_mdm')}
set no_mdm(v){this._setter('no_mdm',v)}
get servers(){return this._getter_ts('servers')}
set servers(v){this._setter_ts('servers',v)}
}
$p.CatAbonents = CatAbonents;
class CatAbonentsServersRow extends TabularSectionRow{
get key(){return this._getter('key')}
set key(v){this._setter('key',v)}
get name(){return this._getter('name')}
set name(v){this._setter('name',v)}
get proxy(){return this._getter('proxy')}
set proxy(v){this._setter('proxy',v)}
}
$p.CatAbonentsServersRow = CatAbonentsServersRow;
class CatAbonentsManager extends CatManager {

  get current() {
    const {session_zone, zone} = $p.job_prm;
    return this.by_id(session_zone || zone);
  }
  
  get price_types() {
    const {server} = $p.job_prm;
    const price_types = new Set();
    for(const id of server.abonents) {
      for(const price_type of this.by_id(id)?.price_types) {
        price_types.add(price_type);
      }
    }
    return Array.from(price_types);
  }
}
$p.cat.create('abonents', CatAbonentsManager, false);
class CatInsert_bind extends CatObj{
get key(){return this._getter('key')}
set key(v){this._setter('key',v)}
get calc_order(){return this._getter('calc_order')}
set calc_order(v){this._setter('calc_order',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get production(){return this._getter_ts('production')}
set production(v){this._setter_ts('production',v)}
get inserts(){return this._getter_ts('inserts')}
set inserts(v){this._setter_ts('inserts',v)}
}
$p.CatInsert_bind = CatInsert_bind;
class CatInsert_bindProductionRow extends TabularSectionRow{
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
}
$p.CatInsert_bindProductionRow = CatInsert_bindProductionRow;
class CatInsert_bindInsertsRow extends TabularSectionRow{
get inset(){return this._getter('inset')}
set inset(v){this._setter('inset',v)}
get elm_type(){return this._getter('elm_type')}
set elm_type(v){this._setter('elm_type',v)}
}
$p.CatInsert_bindInsertsRow = CatInsert_bindInsertsRow;
class CatInsert_bindManager extends CatManager {

  /**
   * Возвращает массив допвставок с привязками к изделию или слою
   * @param ox {CatCharacteristics}
   * @param [order] {Boolean}
   * @return {Array}
   */
  insets(ox, order = false) {
    const {sys, owner} = ox;
    const res = [];
    const {enm, cat} = $p;
    const {inserts_types: {Заказ}, elm_types: {flap}} = enm;
    for (const {production, inserts, key} of this) {
      if(!key.check_condition({ox})) {
        continue;
      }
      for (const {nom} of production) {
        if(!nom || nom.empty() || (sys && sys._hierarchy(nom)) || (owner && owner._hierarchy(nom))) {
          for (const {inset, elm_type} of inserts) {
            if(!res.some((irow) => irow.inset == inset && irow.elm_type == elm_type)) {
              if((!order && inset.insert_type !== Заказ) || (order && inset.insert_type === Заказ)) {
                res.push({inset, elm_type});
              }
            }
          }
        }
        // створки виртуальных слоёв
        else {
          for(const {dop} of ox.constructions) {
            if(dop.sys && cat.production_params.get(dop.sys)._hierarchy(nom)) {
              inserts.find_rows({elm_type: flap}, ({inset, elm_type}) => {
                if(!res.some((irow) => irow.inset == inset && irow.elm_type == elm_type)) {
                  res.push({inset, elm_type});
                }
              });
            }
          }
        }
      }
    }
    return res;
  }

  /**
   * Вклад привязок вставок в основную спецификацию
   * @param ox {CatCharacteristics}
   * @param scheme {Scheme}
   * @param spec {TabularSection}
   */
  deposit({ox, scheme, spec}) {

    const {enm: {elm_types}, EditorInvisible: {ContourVirtual}} = $p;

    for (const {inset, elm_type} of this.insets(ox)) {

      const elm = {
        _row: {},
        elm: 0,
        get perimeter() {
          return scheme ? scheme.perimeter : [];
        },
        clr: ox.clr,
        project: scheme,
      };
      const len_angl = {
        angle: 0,
        alp1: 0,
        alp2: 0,
        len: 0,
        cnstr: 0,
        origin: inset,
      };

      const deposit_flap = (layer) => {
        if(!(layer instanceof ContourVirtual)) {
          elm.layer = layer;
          len_angl.cnstr = layer.cnstr;
          inset.calculate_spec({elm, len_angl, ox, spec});
        }
        for (const contour of layer.contours) {
          deposit_flap(contour);
        }
      };

      // рассчитаем спецификацию вставки
      switch (elm_type) {
      case elm_types.flap:
        if(scheme) {
          for (const {contours} of scheme.contours) {
            contours.forEach(deposit_flap);
          }
        }
        break;

      case elm_types.rama:
        if(scheme) {
          for (const contour of scheme.contours) {
            elm.layer = contour;
            len_angl.cnstr = contour.cnstr;
            inset.calculate_spec({elm, len_angl, ox, spec});
          }
        }
        break;

      case elm_types.glass:
        // только для составных пакетов
        if(scheme) {
          for (const elm of scheme.glasses) {
            ox.glass_specification.find_rows({elm: elm.elm}, (row) => {
              if(row.inset.insert_glass_type === inset.insert_glass_type) {
                inset.calculate_spec({elm, row, layer: elm.layer, ox, spec});
              }
            });
          }
        }
        break;

      case elm_types.sandwich:
        // в данном случае, sandwich - любое заполнение, не только непрозрачное
        if(scheme) {
          for (const elm of scheme.glasses) {
            inset.calculate_spec({elm, layer: elm.layer, ox, spec});
          }
        }
        break;

      default:
        inset.calculate_spec({elm, len_angl, ox, spec});
      }
    }
  }
}
$p.cat.create('insert_bind', CatInsert_bindManager, false);
class CatTemplates extends CatObj{
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get captured(){return this._getter('captured')}
set captured(v){this._setter('captured',v)}
get editor(){return this._getter('editor')}
set editor(v){this._setter('editor',v)}
get templates(){return this._getter_ts('templates')}
set templates(v){this._setter_ts('templates',v)}
}
$p.CatTemplates = CatTemplates;
class CatTemplatesTemplatesRow extends TabularSectionRow{
get template(){return this._getter('template')}
set template(v){this._setter('template',v)}
get xmin(){return this._getter('xmin')}
set xmin(v){this._setter('xmin',v)}
get xmax(){return this._getter('xmax')}
set xmax(v){this._setter('xmax',v)}
get ymin(){return this._getter('ymin')}
set ymin(v){this._setter('ymin',v)}
get ymax(){return this._getter('ymax')}
set ymax(v){this._setter('ymax',v)}
get sys(){return this._getter('sys')}
set sys(v){this._setter('sys',v)}
get furn(){return this._getter('furn')}
set furn(v){this._setter('furn',v)}
get filling(){return this._getter('filling')}
set filling(v){this._setter('filling',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get props(){return this._getter('props')}
set props(v){this._setter('props',v)}
get grouping(){return this._getter('grouping')}
set grouping(v){this._setter('grouping',v)}
}
$p.CatTemplatesTemplatesRow = CatTemplatesTemplatesRow;
$p.cat.create('templates');
class CatDelivery_directions extends CatObj{
get composition(){return this._getter_ts('composition')}
set composition(v){this._setter_ts('composition',v)}
get coordinates(){return this._getter_ts('coordinates')}
set coordinates(v){this._setter_ts('coordinates',v)}
}
$p.CatDelivery_directions = CatDelivery_directions;
class CatDelivery_directionsCompositionRow extends TabularSectionRow{
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
}
$p.CatDelivery_directionsCompositionRow = CatDelivery_directionsCompositionRow;
class CatDelivery_directionsCoordinatesRow extends TabularSectionRow{
get latitude(){return this._getter('latitude')}
set latitude(v){this._setter('latitude',v)}
get longitude(){return this._getter('longitude')}
set longitude(v){this._setter('longitude',v)}
}
$p.CatDelivery_directionsCoordinatesRow = CatDelivery_directionsCoordinatesRow;
$p.cat.create('delivery_directions');
class CatHttp_apis extends CatObj{
get nom(){return this._getter_ts('nom')}
set nom(v){this._setter_ts('nom',v)}
get params(){return this._getter_ts('params')}
set params(v){this._setter_ts('params',v)}

  prm(identifier) {
    const {_data} = this;
    const key = `prm_${identifier}`;
    if(!_data[key]) {
      const prow = this.params.find({identifier});
      if(prow) {
        let {type, values, name} = prow;
        if(values) {
          try {
            values = JSON.parse(values);
          }
          catch (e) {}
        }
        _data[key] = {type, values, name};
        if(type === 'enum' && values && values.length) {
          _data[key].subtype = typeof values[0];
        }
      }
      else {
        _data[key] = {};
      }
    }
    return _data[key];
  }}
$p.CatHttp_apis = CatHttp_apis;
class CatHttp_apisNomRow extends TabularSectionRow{
get identifier(){return this._getter('identifier')}
set identifier(v){this._setter('identifier',v)}
get name(){return this._getter('name')}
set name(v){this._setter('name',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get nom_characteristic(){return this._getter('nom_characteristic')}
set nom_characteristic(v){this._setter('nom_characteristic',v)}
get params(){return this._getter('params')}
set params(v){this._setter('params',v)}
}
$p.CatHttp_apisNomRow = CatHttp_apisNomRow;
class CatHttp_apisParamsRow extends TabularSectionRow{
get identifier(){return this._getter('identifier')}
set identifier(v){this._setter('identifier',v)}
get name(){return this._getter('name')}
set name(v){this._setter('name',v)}
get type(){return this._getter('type')}
set type(v){this._setter('type',v)}
get values(){return this._getter('values')}
set values(v){this._setter('values',v)}
}
$p.CatHttp_apisParamsRow = CatHttp_apisParamsRow;
$p.cat.create('http_apis');
class CatProduction_kinds extends CatObj{
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get stages(){return this._getter_ts('stages')}
set stages(v){this._setter_ts('stages',v)}
}
$p.CatProduction_kinds = CatProduction_kinds;
class CatProduction_kindsStagesRow extends TabularSectionRow{
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get stage(){return this._getter('stage')}
set stage(v){this._setter('stage',v)}
}
$p.CatProduction_kindsStagesRow = CatProduction_kindsStagesRow;
$p.cat.create('production_kinds');
class CatValues_options extends CatObj{
get owner(){return this._getter('owner')}
set owner(v){this._setter('owner',v)}
get values(){return this._getter_ts('values')}
set values(v){this._setter_ts('values',v)}

  
  
  option_value({elm, ...other}) {
    const {values} = this;
    for(const {key, value} of values) {
      if(key.check_condition({elm, ...other})) {
        return value;
      }
    }
    if(values.length) {
      return values[values.length-1];
    }
  }}
$p.CatValues_options = CatValues_options;
class CatValues_optionsValuesRow extends TabularSectionRow{
get key(){return this._getter('key')}
set key(v){this._setter('key',v)}
get value(){return this._getter('value')}
set value(v){this._setter('value',v)}
}
$p.CatValues_optionsValuesRow = CatValues_optionsValuesRow;
$p.cat.create('values_options');
class CatLead_src extends CatObj{
get type(){return this._getter('type')}
set type(v){this._setter('type',v)}
}
$p.CatLead_src = CatLead_src;
$p.cat.create('lead_src');
class CatLeads extends CatObj{
get create_date(){return this._getter('create_date')}
set create_date(v){this._setter('create_date',v)}
get origin(){return this._getter('origin')}
set origin(v){this._setter('origin',v)}
get responsible(){return this._getter('responsible')}
set responsible(v){this._setter('responsible',v)}
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get dop(){return this._getter('dop')}
set dop(v){this._setter('dop',v)}
}
$p.CatLeads = CatLeads;
$p.cat.create('leads');
class CatAccounts extends CatObj{
get prefix(){return this._getter('prefix')}
set prefix(v){this._setter('prefix',v)}
get push_only(){return this._getter('push_only')}
set push_only(v){this._setter('push_only',v)}
get ips(){return this._getter('ips')}
set ips(v){this._setter('ips',v)}
get owner(){return this._getter('owner')}
set owner(v){this._setter('owner',v)}
}
$p.CatAccounts = CatAccounts;
$p.cat.create('accounts');
class CatWork_centers extends CatObj{
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get plan_multiplicity(){return this._getter('plan_multiplicity')}
set plan_multiplicity(v){this._setter('plan_multiplicity',v)}
get parent(){return this._getter('parent')}
set parent(v){this._setter('parent',v)}
get work_center_kinds(){return this._getter_ts('work_center_kinds')}
set work_center_kinds(v){this._setter_ts('work_center_kinds',v)}
}
$p.CatWork_centers = CatWork_centers;
class CatWork_centersWork_center_kindsRow extends TabularSectionRow{
get kind(){return this._getter('kind')}
set kind(v){this._setter('kind',v)}
}
$p.CatWork_centersWork_center_kindsRow = CatWork_centersWork_center_kindsRow;
$p.cat.create('work_centers');
class CatProject_stages extends CatObj{
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get grouping(){return this._getter('grouping')}
set grouping(v){this._setter('grouping',v)}
}
$p.CatProject_stages = CatProject_stages;
$p.cat.create('project_stages');
class DocPurchase extends DocObj{
get organization(){return this._getter('organization')}
set organization(v){this._setter('organization',v)}
get partner(){return this._getter('partner')}
set partner(v){this._setter('partner',v)}
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get warehouse(){return this._getter('warehouse')}
set warehouse(v){this._setter('warehouse',v)}
get doc_amount(){return this._getter('doc_amount')}
set doc_amount(v){this._setter('doc_amount',v)}
get responsible(){return this._getter('responsible')}
set responsible(v){this._setter('responsible',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get goods(){return this._getter_ts('goods')}
set goods(v){this._setter_ts('goods',v)}
get services(){return this._getter_ts('services')}
set services(v){this._setter_ts('services',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
}
$p.DocPurchase = DocPurchase;
class DocPurchaseGoodsRow extends TabularSectionRow{
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get nom_characteristic(){return this._getter('nom_characteristic')}
set nom_characteristic(v){this._setter('nom_characteristic',v)}
get quantity(){return this._getter('quantity')}
set quantity(v){this._setter('quantity',v)}
get unit(){return this._getter('unit')}
set unit(v){this._setter('unit',v)}
get price(){return this._getter('price')}
set price(v){this._setter('price',v)}
get amount(){return this._getter('amount')}
set amount(v){this._setter('amount',v)}
get vat_rate(){return this._getter('vat_rate')}
set vat_rate(v){this._setter('vat_rate',v)}
get vat_amount(){return this._getter('vat_amount')}
set vat_amount(v){this._setter('vat_amount',v)}
get trans(){return this._getter('trans')}
set trans(v){this._setter('trans',v)}
}
$p.DocPurchaseGoodsRow = DocPurchaseGoodsRow;
class DocPurchaseServicesRow extends TabularSectionRow{
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get content(){return this._getter('content')}
set content(v){this._setter('content',v)}
get quantity(){return this._getter('quantity')}
set quantity(v){this._setter('quantity',v)}
get price(){return this._getter('price')}
set price(v){this._setter('price',v)}
get amount(){return this._getter('amount')}
set amount(v){this._setter('amount',v)}
get vat_rate(){return this._getter('vat_rate')}
set vat_rate(v){this._setter('vat_rate',v)}
get vat_amount(){return this._getter('vat_amount')}
set vat_amount(v){this._setter('vat_amount',v)}
get nom_group(){return this._getter('nom_group')}
set nom_group(v){this._setter('nom_group',v)}
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get cost_item(){return this._getter('cost_item')}
set cost_item(v){this._setter('cost_item',v)}
get project(){return this._getter('project')}
set project(v){this._setter('project',v)}
get buyers_order(){return this._getter('buyers_order')}
set buyers_order(v){this._setter('buyers_order',v)}
}
$p.DocPurchaseServicesRow = DocPurchaseServicesRow;
$p.doc.create('purchase');
class DocInventory_cuts extends DocObj{
get transactions_kind(){return this._getter('transactions_kind')}
set transactions_kind(v){this._setter('transactions_kind',v)}
get responsible(){return this._getter('responsible')}
set responsible(v){this._setter('responsible',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get work_center(){return this._getter('work_center')}
set work_center(v){this._setter('work_center',v)}
get materials(){return this._getter_ts('materials')}
set materials(v){this._setter_ts('materials',v)}
}
$p.DocInventory_cuts = DocInventory_cuts;
class DocInventory_cutsMaterialsRow extends TabularSectionRow{
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get characteristic(){return this._getter('characteristic')}
set characteristic(v){this._setter('characteristic',v)}
get len(){return this._getter('len')}
set len(v){this._setter('len',v)}
get width(){return this._getter('width')}
set width(v){this._setter('width',v)}
get qty(){return this._getter('qty')}
set qty(v){this._setter('qty',v)}
get cell(){return this._getter('cell')}
set cell(v){this._setter('cell',v)}
get recorded_quantity(){return this._getter('recorded_quantity')}
set recorded_quantity(v){this._setter('recorded_quantity',v)}
}
$p.DocInventory_cutsMaterialsRow = DocInventory_cutsMaterialsRow;
$p.doc.create('inventory_cuts');
class DocInventory_goods extends DocObj{
get organization(){return this._getter('organization')}
set organization(v){this._setter('organization',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get warehouse(){return this._getter('warehouse')}
set warehouse(v){this._setter('warehouse',v)}
get responsible(){return this._getter('responsible')}
set responsible(v){this._setter('responsible',v)}
get origin(){return this._getter('origin')}
set origin(v){this._setter('origin',v)}
get goods(){return this._getter_ts('goods')}
set goods(v){this._setter_ts('goods',v)}
}
$p.DocInventory_goods = DocInventory_goods;
class DocInventory_goodsGoodsRow extends TabularSectionRow{
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get nom_characteristic(){return this._getter('nom_characteristic')}
set nom_characteristic(v){this._setter('nom_characteristic',v)}
get quantity(){return this._getter('quantity')}
set quantity(v){this._setter('quantity',v)}
get recorded_quantity(){return this._getter('recorded_quantity')}
set recorded_quantity(v){this._setter('recorded_quantity',v)}
get unit(){return this._getter('unit')}
set unit(v){this._setter('unit',v)}
get coefficient(){return this._getter('coefficient')}
set coefficient(v){this._setter('coefficient',v)}
get price(){return this._getter('price')}
set price(v){this._setter('price',v)}
get amount(){return this._getter('amount')}
set amount(v){this._setter('amount',v)}
get len(){return this._getter('len')}
set len(v){this._setter('len',v)}
get width(){return this._getter('width')}
set width(v){this._setter('width',v)}
get qty(){return this._getter('qty')}
set qty(v){this._setter('qty',v)}
}
$p.DocInventory_goodsGoodsRow = DocInventory_goodsGoodsRow;
$p.doc.create('inventory_goods');
class DocWork_centers_task extends DocObj{
get key(){return this._getter('key')}
set key(v){this._setter('key',v)}
get recipient(){return this._getter('recipient')}
set recipient(v){this._setter('recipient',v)}
get biz_cuts(){return this._getter('biz_cuts')}
set biz_cuts(v){this._setter('biz_cuts',v)}
get responsible(){return this._getter('responsible')}
set responsible(v){this._setter('responsible',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get planning(){return this._getter_ts('planning')}
set planning(v){this._setter_ts('planning',v)}
get demand(){return this._getter_ts('demand')}
set demand(v){this._setter_ts('demand',v)}
get cuts(){return this._getter_ts('cuts')}
set cuts(v){this._setter_ts('cuts',v)}
get cutting(){return this._getter_ts('cutting')}
set cutting(v){this._setter_ts('cutting',v)}


  /**
   * значения по умолчанию при создании документа
   * @return {DocWork_centers_task}
   */
  after_create() {
    const {$p} = this._manager._owner;
    if(this.date == $p.utils.blank.date) {
      this.date = new Date();
    }
    if(!$p.job_prm.is_node) {
      this.responsible = $p.current_user;
    }
    return this;
  }

  /**
   * значения по умолчанию при добавлении строки
   * @param {TabularSectionRow} row
   * @param {Object} [attr]
   */
  add_row(row, attr) {
    if(row?._owner === this.cuts) {
      if(!row.stick && !attr?.stick) {
        const {_obj} = row._owner;
        row._obj.stick = 1 + (_obj.length ? Math.max.apply(null, _obj.map(({stick}) => stick)) : 0);
      }
    }
  }

  /**
   * Заполняет план по заказу
   * @param {Array<String|DataObj>} refs
   * @return {Promise<void>}
   */
  fill_by_orders(refs) {
    const orders = [];
    const {$p: {utils}, calc_order} = this._manager._owner;
    return refs.reduce((sum, ref) => {
      return sum.then(() => {
        if(utils.is_data_obj(ref)){
          orders.push(ref);
        }
        else {
          return calc_order.get(ref, 'promise')
            .then((ref) => orders.push(ref));
        }
      });
    }, Promise.resolve())
      .then(() => {
        return orders.reduce((sum, order) => {
          return sum.then(() => {
            return order.load_production()
              .then((prod) => {
                order.production.forEach((row) => {
                  // нас интересуют только продукции
                  if(!prod.includes(row.characteristic)) {
                    return;
                  }
                  // и только те продукции, у которых в спецификации есть материалы к раскрою
                  row.characteristic.specification.forEach((srow) => {
                    if(srow.len && !srow.nom.cutting_optimization_type.empty() && !srow.nom.cutting_optimization_type.is('Нет')){
                      for(let i = 1; i <= row.quantity; i++) {
                        this.planning.add({obj: row.characteristic, specimen: i});
                      }
                      return false;
                    }
                  });
                });
              });
          });
        }, Promise.resolve());
      });
  }

  /**
   * Заполняет табчасть раскрой по плану
   * @param opts {Object}
   * @param opts.clear {Boolean}
   * @param opts.linear {Boolean}
   * @param opts.bilinear {Boolean}
   * @param opts.clr_only {Boolean}
   * @return {Promise<void>}
   */
  fill_cutting(opts) {
    const {planning, cutting} = this;
    if(opts.clear) {
      cutting.clear();
    }
    // получаем спецификации продукций
    return this.load_linked_refs()
      .then(() => {
        planning.forEach(({obj, specimen, elm}) => {
          obj.specification.forEach((row) => {
            // только строки подлежащие раскрою
            if(!row.len || row.nom.cutting_optimization_type.empty() || row.nom.cutting_optimization_type.is('Нет')) {
              return;
            }
            // если планирование до элемента...
            if(elm && row.elm !== elm) {
              return;
            }
            // по типам оптимизации
            if(!opts.bilinear && row.width) {
              return;
            }
            // должен существовать элемент
            const coord = obj.coordinates.find({elm: row.elm});
            if(!coord) {
              return;
            }
            // только для цветных
            if(opts.clr_only) {
              if(row.clr.empty() || /Белый|БезЦвета/.test(row.clr.predefined_name) ) {
                return;
              }
            }
            for(let qty = 1;  qty <= row.qty; qty++) {
              cutting.add({
                production: obj,
                specimen,
                elm: row.elm,
                nom: row.nom,
                characteristic: row.characteristic.empty() ? row.clr : row.characteristic,
                len: (row.len * 1000).round(0),
                width: (row.width * 1000).round(0),
                orientation: coord.orientation,
                elm_type: coord.elm_type,
                alp1: row.alp1,
                alp2: row.alp2,
              });
            }
          });
        });
      });
  }

  /**
   * Возвращает свёрнутую структуру номенклатур, характеристик и партий раскроя
   */
  fragments(noParts) {
    const {_owner: {$p: {utils}}, cut_defaults} = this._manager;
    const res = new Map();
    const fin = [];
    for(const row of this.cutting) {
      if(!res.has(row.nom)) {
        res.set(row.nom, new Map());
      }
      const nom = res.get(row.nom);
      if(!nom.has(row.characteristic)) {
        nom.set(row.characteristic, []);
      }
      const characteristic = nom.get(row.characteristic);
      if(!noParts) {
        row.stick = 0;
        row.part = 0;
      }
      characteristic.push(row);
    }
    if(noParts) {
      return res;
    }
    // расставим партии
    for(const [nom, characteristics] of res) {
      for(const [characteristic, rows] of characteristics) {
        if(rows.length > cut_defaults.batch) {
          rows.sort(utils.sort('len'));
          const parts = (rows.length / cut_defaults.batch + 0.5).round();
          const part = (rows.length / parts).round();
          for(let i1 = 0; i1 < part; i1++) {
            for(let i2 = 0; i2 < parts; i2++) {
              const rowNum = i1 * parts + i2;
              if(rowNum >= rows.length) {
                continue;
              }
              const row = rows[rowNum];
              if(!row.pair) {
                row.part = i2;
              }
              else {
                for(const prow of rows) {
                  if(prow.pair === row.pair) {
                    prow.part = i2;
                  }
                }
              }
            }
          }
          for(let part = 0; part < parts; part++) {
            fin.push({nom, characteristic, part, parts, rows: rows.filter((row) => row.part === part)});
          }
        }
        else {
          fin.push({nom, characteristic, part: 0, parts: 1, rows});
        }
      }
    }
    return fin;
  }

  /**
   * Выполняет оптимизацию раскроя
   * @param opts
   * @return {Promise<void>}
   */
  optimize({onStep}) {
    const {$p: {classes: {Cutting}}} = this._manager._owner;
    let queue = Promise.resolve();
    for(const {nom, characteristic, part, parts, rows} of this.fragments()) {
      queue = queue.then(() => this.optimize_fragment({
        cutting: new Cutting('1D'),
        rows,
        part,
        parts,
        onStep,
      }));
    }
    return queue;
  }

  /**
   * Выполняет оптимизацию фрагмента (номенклатура+характеристика+тип)
   * @param opts
   * @return {Promise<void>}
   */
  optimize_fragment({cutting, rows, onStep, part, parts}) {
    const {_owner: {$p: {job_prm}}, cut_defaults} = this._manager;
    
    return new Promise((resolve) => {

      const doc = this;
      const workpieces = [];
      const cut_row = rows[0];
      if(cut_row) {
        // ищем запись в расходе - её туда могли положить руками, либо подтянулось из остатков
        this.cuts.find_rows({
          _top: 10e6,
          //record_kind: debit_credit_kinds.debit,
          nom: cut_row.nom,
          characteristic: cut_row.characteristic,
        }, (row) => {
          const len = row.len - row.used;
          if(len >= rows[0].len && len >= (cut_row.nom.usefulscrap || cut_defaults.usefulscrap)) {
            workpieces.push(row);
          }
        });
      }

      const config = Object.assign({}, cut_defaults);
      const userData = {
        products: rows.map((row) => row.len),
        workpieces: workpieces.map((row) => row.len - row.used),
        overmeasure: 0,
        wrongsnipmin: 0,
        wrongsnipmax: 0,
        sticklength: cut_row.nom.len || 6000,
        knifewidth: cut_row.nom.knifewidth || 7,
        usefulscrap: cut_row.nom.usefulscrap || cut_defaults.usefulscrap,
      };
      cutting.genetic.notification = function(pop, generation, stats, isFinished) {

        if(job_prm.idle) {
          job_prm.idle.activity = Date.now();
        }

        if(!generation) {
          return;
        }

        // текущий результат
        const decision = Object.assign({
          cut_row,
          userData,
          cuts: workpieces,
          rows,
          part,
          parts,
          progress: isFinished ? 1 : generation / this.configuration.iterations,
        }, this.fitness(pop[0].entity, true));

        // обновляем интерфейс
        onStep(decision);

        if(isFinished) {
          // обновляем документ
          doc.push_cut_result(decision, part + 1 === parts);
          resolve();
        }

      };

      cutting.evolve(config, userData);

    });
  }

  /**
   * помещает результат раскроя в документ
   */
  push_cut_result(decision, fin) {
    const {$p: {enm: {debit_credit_kinds}}} = this._manager._owner;
    // сначала добавляем заготовки
    for(let i = 0; i < decision.workpieces.length; i++) {
      let workpiece = decision.cuts[i];

      if(workpiece) {
        workpiece.used = workpiece.len - decision.workpieces[i];
        //workpiece.quantity = decision.workpieces[i] / 1000;
      }
      else {
        workpiece = this.cuts.add({
          record_kind: debit_credit_kinds.credit,
          nom: decision.cut_row.nom,
          characteristic: decision.cut_row.characteristic,
          len: decision.userData.sticklength,
          quantity: decision.userData.sticklength / 1000,
        });
        decision.cuts.push(workpiece);
      }
    }

    // проставляем номера палок в раскрое
    for(let i = 0; i < decision.res.length; i++) {
      const {stick} = decision.cuts[decision.res[i]];
      decision.rows[i].stick = stick;
    }
    for(let i = 0; i < decision.res.length; i++) {
      const cut_row = decision.cuts[decision.res[i]];
      const rows = this.cutting.find_rows({stick: cut_row.stick});
      const len = rows.reduce((sum, row) => sum + row.len + decision.userData.knifewidth, 0);
      cut_row.used = len;
    }
    if(fin) {
      // формируем приход деловых остатков
      const workpieces = [];
      this.cuts.find_rows({
        _top: 10e6,
        nom: decision.cut_row.nom,
        characteristic: decision.cut_row.characteristic,
      }, (row) => {
        const len = row.len - row.used;
        if(len >= decision.userData.usefulscrap) {
          workpieces.push({
            record_kind: debit_credit_kinds.debit,
            nom: decision.cut_row.nom,
            characteristic: decision.cut_row.characteristic,
            len,
            quantity: len / 1000,
          });
        }
      });
      for(const raw of workpieces) {
        this.cuts.add(raw);
      }
    }

  }
  }
$p.DocWork_centers_task = DocWork_centers_task;
class DocWork_centers_taskPlanningRow extends TabularSectionRow{
get obj(){return this._getter('obj')}
set obj(v){this._setter('obj',v)}
get specimen(){return this._getter('specimen')}
set specimen(v){this._setter('specimen',v)}
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get power(){return this._getter('power')}
set power(v){this._setter('power',v)}
}
$p.DocWork_centers_taskPlanningRow = DocWork_centers_taskPlanningRow;
class DocWork_centers_taskDemandRow extends TabularSectionRow{
get production(){return this._getter('production')}
set production(v){this._setter('production',v)}
get specimen(){return this._getter('specimen')}
set specimen(v){this._setter('specimen',v)}
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get characteristic(){return this._getter('characteristic')}
set characteristic(v){this._setter('characteristic',v)}
get final_balance(){return this._getter('final_balance')}
set final_balance(v){this._setter('final_balance',v)}
get quantity(){return this._getter('quantity')}
set quantity(v){this._setter('quantity',v)}
get from_cut(){return this._getter('from_cut')}
set from_cut(v){this._setter('from_cut',v)}
get close(){return this._getter('close')}
set close(v){this._setter('close',v)}
}
$p.DocWork_centers_taskDemandRow = DocWork_centers_taskDemandRow;
class DocWork_centers_taskCutsRow extends TabularSectionRow{
get record_kind(){return this._getter('record_kind')}
set record_kind(v){this._setter('record_kind',v)}
get stick(){return this._getter('stick')}
set stick(v){this._setter('stick',v)}
get pair(){return this._getter('pair')}
set pair(v){this._setter('pair',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get characteristic(){return this._getter('characteristic')}
set characteristic(v){this._setter('characteristic',v)}
get len(){return this._getter('len')}
set len(v){this._setter('len',v)}
get width(){return this._getter('width')}
set width(v){this._setter('width',v)}
get used(){return this._getter('used')}
set used(v){this._setter('used',v)}
get x(){return this._getter('x')}
set x(v){this._setter('x',v)}
get y(){return this._getter('y')}
set y(v){this._setter('y',v)}
get quantity(){return this._getter('quantity')}
set quantity(v){this._setter('quantity',v)}
get cell(){return this._getter('cell')}
set cell(v){this._setter('cell',v)}
get dop(){return this._getter('dop')}
set dop(v){this._setter('dop',v)}
}
$p.DocWork_centers_taskCutsRow = DocWork_centers_taskCutsRow;
class DocWork_centers_taskCuttingRow extends TabularSectionRow{
get production(){return this._getter('production')}
set production(v){this._setter('production',v)}
get specimen(){return this._getter('specimen')}
set specimen(v){this._setter('specimen',v)}
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get characteristic(){return this._getter('characteristic')}
set characteristic(v){this._setter('characteristic',v)}
get len(){return this._getter('len')}
set len(v){this._setter('len',v)}
get width(){return this._getter('width')}
set width(v){this._setter('width',v)}
get stick(){return this._getter('stick')}
set stick(v){this._setter('stick',v)}
get pair(){return this._getter('pair')}
set pair(v){this._setter('pair',v)}
get orientation(){return this._getter('orientation')}
set orientation(v){this._setter('orientation',v)}
get elm_type(){return this._getter('elm_type')}
set elm_type(v){this._setter('elm_type',v)}
get alp1(){return this._getter('alp1')}
set alp1(v){this._setter('alp1',v)}
get alp2(){return this._getter('alp2')}
set alp2(v){this._setter('alp2',v)}
get cell(){return this._getter('cell')}
set cell(v){this._setter('cell',v)}
get part(){return this._getter('part')}
set part(v){this._setter('part',v)}
get x(){return this._getter('x')}
set x(v){this._setter('x',v)}
get y(){return this._getter('y')}
set y(v){this._setter('y',v)}
get rotated(){return this._getter('rotated')}
set rotated(v){this._setter('rotated',v)}
get nonstandard(){return this._getter('nonstandard')}
set nonstandard(v){this._setter('nonstandard',v)}
}
$p.DocWork_centers_taskCuttingRow = DocWork_centers_taskCuttingRow;
class DocWork_centers_taskManager extends DocManager {
  
  get cut_defaults() {
    if(!this._cut_defaults) {
      const {$p: {job_prm}} = this._owner;
      this._cut_defaults = Object.freeze({
        iterations: 2900,
        size: 210,        // размер популяции
        crossover: 0.19,
        mutation: 0.26,
        random: 0.21,
        skip: 55,         // прекращаем итерации, если решение не улучшилось за 55 шагов
        webWorkers: !job_prm.is_node,
        batch: 101,       // размер партии
        usefulscrap: 610, // деловой остаток
      });
    }
    return this._cut_defaults;
  }
}
$p.doc.create('work_centers_task', DocWork_centers_taskManager, false);
class DocCalc_order extends DocObj{
get number_internal(){return this._getter('number_internal')}
set number_internal(v){this._setter('number_internal',v)}
get project(){return this._getter('project')}
set project(v){this._setter('project',v)}
get organization(){return this._getter('organization')}
set organization(v){this._setter('organization',v)}
get partner(){return this._getter('partner')}
set partner(v){this._setter('partner',v)}
get client_of_dealer(){return this._getter('client_of_dealer')}
set client_of_dealer(v){this._setter('client_of_dealer',v)}
get contract(){return this._getter('contract')}
set contract(v){this._setter('contract',v)}
get bank_account(){return this._getter('bank_account')}
set bank_account(v){this._setter('bank_account',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get manager(){return this._getter('manager')}
set manager(v){this._setter('manager',v)}
get leading_manager(){return this._getter('leading_manager')}
set leading_manager(v){this._setter('leading_manager',v)}
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get warehouse(){return this._getter('warehouse')}
set warehouse(v){this._setter('warehouse',v)}
get doc_amount(){return this._getter('doc_amount')}
set doc_amount(v){this._setter('doc_amount',v)}
get amount_operation(){return this._getter('amount_operation')}
set amount_operation(v){this._setter('amount_operation',v)}
get amount_internal(){return this._getter('amount_internal')}
set amount_internal(v){this._setter('amount_internal',v)}
get phone(){return this._getter('phone')}
set phone(v){this._setter('phone',v)}
get delivery_area(){return this._getter('delivery_area')}
set delivery_area(v){this._setter('delivery_area',v)}
get shipping_address(){return this._getter('shipping_address')}
set shipping_address(v){this._setter('shipping_address',v)}
get coordinates(){return this._getter('coordinates')}
set coordinates(v){this._setter('coordinates',v)}
get address_fields(){return this._getter('address_fields')}
set address_fields(v){this._setter('address_fields',v)}
get sys_profile(){return this._getter('sys_profile')}
set sys_profile(v){this._setter('sys_profile',v)}
get sys_furn(){return this._getter('sys_furn')}
set sys_furn(v){this._setter('sys_furn',v)}
get difficult(){return this._getter('difficult')}
set difficult(v){this._setter('difficult',v)}
get vat_consider(){return this._getter('vat_consider')}
set vat_consider(v){this._setter('vat_consider',v)}
get vat_included(){return this._getter('vat_included')}
set vat_included(v){this._setter('vat_included',v)}
get settlements_course(){return this._getter('settlements_course')}
set settlements_course(v){this._setter('settlements_course',v)}
get settlements_multiplicity(){return this._getter('settlements_multiplicity')}
set settlements_multiplicity(v){this._setter('settlements_multiplicity',v)}
get extra_charge_external(){return this._getter('extra_charge_external')}
set extra_charge_external(v){this._setter('extra_charge_external',v)}
get obj_delivery_state(){return this._getter('obj_delivery_state')}
set obj_delivery_state(v){this._setter('obj_delivery_state',v)}
get category(){return this._getter('category')}
set category(v){this._setter('category',v)}
get sending_stage(){return this._getter('sending_stage')}
set sending_stage(v){this._setter('sending_stage',v)}
get basis(){return this._getter('basis')}
set basis(v){this._setter('basis',v)}
get lead(){return this._getter('lead')}
set lead(v){this._setter('lead',v)}
get approval(){return this._getter('approval')}
set approval(v){this._setter('approval',v)}
get branch(){return this._getter('branch')}
set branch(v){this._setter('branch',v)}
get production(){return this._getter_ts('production')}
set production(v){this._setter_ts('production',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
get contact_information(){return this._getter_ts('contact_information')}
set contact_information(v){this._setter_ts('contact_information',v)}
get planning(){return this._getter_ts('planning')}
set planning(v){this._setter_ts('planning',v)}
get orders(){return this._getter_ts('orders')}
set orders(v){this._setter_ts('orders',v)}
}
$p.DocCalc_order = DocCalc_order;
class DocCalc_orderProductionRow extends TabularSectionRow{
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get characteristic(){return this._getter('characteristic')}
set characteristic(v){this._setter('characteristic',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get quantity(){return this._getter('quantity')}
set quantity(v){this._setter('quantity',v)}
get unit(){return this._getter('unit')}
set unit(v){this._setter('unit',v)}
get qty(){return this._getter('qty')}
set qty(v){this._setter('qty',v)}
get len(){return this._getter('len')}
set len(v){this._setter('len',v)}
get width(){return this._getter('width')}
set width(v){this._setter('width',v)}
get s(){return this._getter('s')}
set s(v){this._setter('s',v)}
get first_cost(){return this._getter('first_cost')}
set first_cost(v){this._setter('first_cost',v)}
get marginality(){return this._getter('marginality')}
set marginality(v){this._setter('marginality',v)}
get price(){return this._getter('price')}
set price(v){this._setter('price',v)}
get discount_percent(){return this._getter('discount_percent')}
set discount_percent(v){this._setter('discount_percent',v)}
get discount(){return this._getter('discount')}
set discount(v){this._setter('discount',v)}
get amount(){return this._getter('amount')}
set amount(v){this._setter('amount',v)}
get margin(){return this._getter('margin')}
set margin(v){this._setter('margin',v)}
get discount_percent_internal(){return this._getter('discount_percent_internal')}
set discount_percent_internal(v){this._setter('discount_percent_internal',v)}
get extra_charge_external(){return this._getter('extra_charge_external')}
set extra_charge_external(v){this._setter('extra_charge_external',v)}
get price_internal(){return this._getter('price_internal')}
set price_internal(v){this._setter('price_internal',v)}
get amount_internal(){return this._getter('amount_internal')}
set amount_internal(v){this._setter('amount_internal',v)}
get vat_rate(){return this._getter('vat_rate')}
set vat_rate(v){this._setter('vat_rate',v)}
get vat_amount(){return this._getter('vat_amount')}
set vat_amount(v){this._setter('vat_amount',v)}
get ordn(){return this._getter('ordn')}
set ordn(v){this._setter('ordn',v)}
get changed(){return this._getter('changed')}
set changed(v){this._setter('changed',v)}
}
$p.DocCalc_orderProductionRow = DocCalc_orderProductionRow;
class DocCalc_orderContact_informationRow extends TabularSectionRow{
get type(){return this._getter('type')}
set type(v){this._setter('type',v)}
get kind(){return this._getter('kind')}
set kind(v){this._setter('kind',v)}
get presentation(){return this._getter('presentation')}
set presentation(v){this._setter('presentation',v)}
get values_fields(){return this._getter('values_fields')}
set values_fields(v){this._setter('values_fields',v)}
get country(){return this._getter('country')}
set country(v){this._setter('country',v)}
get region(){return this._getter('region')}
set region(v){this._setter('region',v)}
get city(){return this._getter('city')}
set city(v){this._setter('city',v)}
get email_address(){return this._getter('email_address')}
set email_address(v){this._setter('email_address',v)}
get phone_number(){return this._getter('phone_number')}
set phone_number(v){this._setter('phone_number',v)}
get phone_without_codes(){return this._getter('phone_without_codes')}
set phone_without_codes(v){this._setter('phone_without_codes',v)}
}
$p.DocCalc_orderContact_informationRow = DocCalc_orderContact_informationRow;
class DocCalc_orderPlanningRow extends TabularSectionRow{
get phase(){return this._getter('phase')}
set phase(v){this._setter('phase',v)}
get date(){return this._getter('date')}
set date(v){this._setter('date',v)}
get key(){return this._getter('key')}
set key(v){this._setter('key',v)}
get obj(){return this._getter('obj')}
set obj(v){this._setter('obj',v)}
get specimen(){return this._getter('specimen')}
set specimen(v){this._setter('specimen',v)}
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get power(){return this._getter('power')}
set power(v){this._setter('power',v)}
}
$p.DocCalc_orderPlanningRow = DocCalc_orderPlanningRow;
class DocCalc_orderOrdersRow extends TabularSectionRow{
get is_supplier(){return this._getter('is_supplier')}
set is_supplier(v){this._setter('is_supplier',v)}
get invoice(){return this._getter('invoice')}
set invoice(v){this._setter('invoice',v)}
}
$p.DocCalc_orderOrdersRow = DocCalc_orderOrdersRow;
class DocCalc_orderManager extends DocManager {

  constructor(owner, class_name) {
    super(owner, class_name);
    const {input_by_string} = this.metadata();
    if(!input_by_string.includes('client_of_dealer')) {
      input_by_string.push('client_of_dealer');
    }
    if(!input_by_string.includes('shipping_address')) {
      input_by_string.push('shipping_address');
    }
  }

  /**
   * Загрузка из сырых данных для динсписка
   * @param {Object} [force]
   * @return {Promise<void>|*}
   */
  direct_load(force) {
    if(this._direct_loaded && !force) {
      return Promise.resolve();
    }

    const {adapters: {pouch}, utils: {moment}, ui} = $p;
    const selector = force && force.selector ?
      force.selector :
      {
        startkey: [this.class_name, ...moment().add(1, 'month').format('YYYY-MM-DD').split('-').map(Number)],
        endkey: [this.class_name, ...moment().subtract(4, 'month').format('YYYY-MM-DD').split('-').map(Number)],
        descending: true,
        include_docs: true,
        limit: 3000,
      };

    return pouch.db(this).query('doc/by_date', selector)
      .then(({rows}) => rows.map(({doc}) => {
        doc.ref = doc._id.split('|')[1];
        delete doc._id;
        return doc;
      }))
      .then((docs) => this.load_array(docs))
      .then(() => this._direct_loaded = true)
      .catch((err) => {
        ui ? ui.dialogs.snack({message: `Чтение списка заказов: ${err.message}`}) : console.err(err);
      });
  }

  /**
   * Копирует заказ, возвращает промис с новым заказом
   * @param src {Object}
   * @param src.clone {Boolean} - если указано, создаётся копия объекта, иначе - новый объект с аналогичными свойствами
   * @return {Promise<DocCalc_order>}
   */
  async clone(src) {
    const {utils, cat} = $p;
    if(utils.is_guid(src)) {
      src = await this.get(src, 'promise');
    }
    if(src.load_linked_refs) {
      await src.load_linked_refs();
    }
    // создаём заказ
    const {clone, refill_props} = src;
    const {organization, partner, contract, _rev, ...others} = (src._obj || src);
    const tmp = {date: new Date(), organization, partner, contract};
    if(clone) {
      utils._mixin(tmp, (src._obj || src));
      delete tmp.clone;
      delete tmp.refill_props;
    }
    const dst = await this.create(tmp, !clone);
    dst._modified = true;
    if(!clone) {
      utils._mixin(dst._obj, others, null,
        'ref,date,number_doc,posted,_deleted,number_internal,production,planning,manager,obj_delivery_state'.split(','));
      dst.extra_fields.load((src._obj || src).extra_fields);
    }

    // заполняем продукцию и сохраненные эскизы
    const map = new Map();

    // создаём характеристики и заполняем данными исходного заказа
    const src_ref = src.ref;
    src.production.forEach((row) => {
      const prow = Object.assign({}, row._obj || row);
      if(row.characteristic?.calc_order == src_ref) {
        const tmp = {calc_order: dst.ref};
        const _obj = row.characteristic._obj || row.characteristic;
        if(clone) {
          utils._mixin(tmp, _obj, null, ['calc_order', 'class_name']);
        }
        else {
          utils._mixin(tmp, _obj, null, 'ref,name,calc_order,timestamp,_rev,specification,class_name'.split(','), true);
        }
        const cx = cat.characteristics.create(tmp, false, true);
        prow.characteristic = cx.ref;

        if(cx.coordinates.count() && refill_props) {
          cx._data.refill_props = true;
        }
        map.set(row.characteristic.ref, cx);
      }
      dst.production.add(prow, true, null, true); // (attr = {}, silent, Constructor, raw)
    });

    // обновляем leading_product
    dst.production.forEach((row) => {
      if(row.ordn) {
        const cx = map.get(row.ordn.ref);
        if(cx) {
          row.ordn = row.characteristic.leading_product = cx;
        }
      }
    });

    // пересчитываем
    if(!clone && dst.recalc) {
      await dst.recalc();
    }

    return dst.save();
  }

  // сворачивает в строку вместе с характеристиками и излучает событие
  export(ref) {
    if(!ref) {
      return this.emit_async('export_err', new Error('Пустой объект. Вероятно, не выбрана строка заказа'));
    }
    this.emit_async('export_start', ref);
    return this.get(ref, 'promise')
      .then((doc) => doc.load_linked_refs())
      .then((doc) => {
        const res = doc.toJSON();
        for(const row of doc.production) {
          if(row.characteristic.calc_order == doc) {
            res.production[row.row - 1].characteristic = row.characteristic.toJSON();
          }
        }
        res.class_name = this.class_name;
        this.emit_async('export_ok', res);
        return res;
      })
      .catch((err) => this.emit_async('export_err', err));
  }

  // излучает событие - нужен для совместимости с dhtmlx
  import() {
    this.emit_async('import_start');
  }

}
$p.doc.create('calc_order', DocCalc_orderManager, false);
class DocCredit_card_order extends DocObj{
get organization(){return this._getter('organization')}
set organization(v){this._setter('organization',v)}
get partner(){return this._getter('partner')}
set partner(v){this._setter('partner',v)}
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get doc_amount(){return this._getter('doc_amount')}
set doc_amount(v){this._setter('doc_amount',v)}
get responsible(){return this._getter('responsible')}
set responsible(v){this._setter('responsible',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get payment_details(){return this._getter_ts('payment_details')}
set payment_details(v){this._setter_ts('payment_details',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
}
$p.DocCredit_card_order = DocCredit_card_order;
$p.doc.create('credit_card_order');
class DocWork_centers_performance extends DocObj{
get start_date(){return this._getter('start_date')}
set start_date(v){this._setter('start_date',v)}
get expiration_date(){return this._getter('expiration_date')}
set expiration_date(v){this._setter('expiration_date',v)}
get responsible(){return this._getter('responsible')}
set responsible(v){this._setter('responsible',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get planning(){return this._getter_ts('planning')}
set planning(v){this._setter_ts('planning',v)}
}
$p.DocWork_centers_performance = DocWork_centers_performance;
class DocWork_centers_performancePlanningRow extends TabularSectionRow{
get date(){return this._getter('date')}
set date(v){this._setter('date',v)}
get work_shift(){return this._getter('work_shift')}
set work_shift(v){this._setter('work_shift',v)}
get work_center(){return this._getter('work_center')}
set work_center(v){this._setter('work_center',v)}
get power(){return this._getter('power')}
set power(v){this._setter('power',v)}
}
$p.DocWork_centers_performancePlanningRow = DocWork_centers_performancePlanningRow;
$p.doc.create('work_centers_performance');
class DocDebit_bank_order extends DocObj{
get organization(){return this._getter('organization')}
set organization(v){this._setter('organization',v)}
get partner(){return this._getter('partner')}
set partner(v){this._setter('partner',v)}
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get bank_account(){return this._getter('bank_account')}
set bank_account(v){this._setter('bank_account',v)}
get doc_amount(){return this._getter('doc_amount')}
set doc_amount(v){this._setter('doc_amount',v)}
get responsible(){return this._getter('responsible')}
set responsible(v){this._setter('responsible',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get payment_details(){return this._getter_ts('payment_details')}
set payment_details(v){this._setter_ts('payment_details',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
}
$p.DocDebit_bank_order = DocDebit_bank_order;
$p.doc.create('debit_bank_order');
class DocCredit_bank_order extends DocObj{
get organization(){return this._getter('organization')}
set organization(v){this._setter('organization',v)}
get partner(){return this._getter('partner')}
set partner(v){this._setter('partner',v)}
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get bank_account(){return this._getter('bank_account')}
set bank_account(v){this._setter('bank_account',v)}
get doc_amount(){return this._getter('doc_amount')}
set doc_amount(v){this._setter('doc_amount',v)}
get responsible(){return this._getter('responsible')}
set responsible(v){this._setter('responsible',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get payment_details(){return this._getter_ts('payment_details')}
set payment_details(v){this._setter_ts('payment_details',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
}
$p.DocCredit_bank_order = DocCredit_bank_order;
$p.doc.create('credit_bank_order');
class DocDebit_cash_order extends DocObj{
get organization(){return this._getter('organization')}
set organization(v){this._setter('organization',v)}
get partner(){return this._getter('partner')}
set partner(v){this._setter('partner',v)}
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get cashbox(){return this._getter('cashbox')}
set cashbox(v){this._setter('cashbox',v)}
get doc_amount(){return this._getter('doc_amount')}
set doc_amount(v){this._setter('doc_amount',v)}
get responsible(){return this._getter('responsible')}
set responsible(v){this._setter('responsible',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get payment_details(){return this._getter_ts('payment_details')}
set payment_details(v){this._setter_ts('payment_details',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
}
$p.DocDebit_cash_order = DocDebit_cash_order;
$p.doc.create('debit_cash_order');
class DocCredit_cash_order extends DocObj{
get organization(){return this._getter('organization')}
set organization(v){this._setter('organization',v)}
get partner(){return this._getter('partner')}
set partner(v){this._setter('partner',v)}
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get cashbox(){return this._getter('cashbox')}
set cashbox(v){this._setter('cashbox',v)}
get doc_amount(){return this._getter('doc_amount')}
set doc_amount(v){this._setter('doc_amount',v)}
get responsible(){return this._getter('responsible')}
set responsible(v){this._setter('responsible',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get payment_details(){return this._getter_ts('payment_details')}
set payment_details(v){this._setter_ts('payment_details',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
}
$p.DocCredit_cash_order = DocCredit_cash_order;
$p.doc.create('credit_cash_order');
class DocSelling extends DocObj{
get organization(){return this._getter('organization')}
set organization(v){this._setter('organization',v)}
get partner(){return this._getter('partner')}
set partner(v){this._setter('partner',v)}
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get warehouse(){return this._getter('warehouse')}
set warehouse(v){this._setter('warehouse',v)}
get doc_amount(){return this._getter('doc_amount')}
set doc_amount(v){this._setter('doc_amount',v)}
get responsible(){return this._getter('responsible')}
set responsible(v){this._setter('responsible',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get goods(){return this._getter_ts('goods')}
set goods(v){this._setter_ts('goods',v)}
get services(){return this._getter_ts('services')}
set services(v){this._setter_ts('services',v)}
get extra_fields(){return this._getter_ts('extra_fields')}
set extra_fields(v){this._setter_ts('extra_fields',v)}
}
$p.DocSelling = DocSelling;
class DocSellingGoodsRow extends TabularSectionRow{
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get nom_characteristic(){return this._getter('nom_characteristic')}
set nom_characteristic(v){this._setter('nom_characteristic',v)}
get quantity(){return this._getter('quantity')}
set quantity(v){this._setter('quantity',v)}
get unit(){return this._getter('unit')}
set unit(v){this._setter('unit',v)}
get price(){return this._getter('price')}
set price(v){this._setter('price',v)}
get discount_percent(){return this._getter('discount_percent')}
set discount_percent(v){this._setter('discount_percent',v)}
get vat_rate(){return this._getter('vat_rate')}
set vat_rate(v){this._setter('vat_rate',v)}
get amount(){return this._getter('amount')}
set amount(v){this._setter('amount',v)}
get vat_amount(){return this._getter('vat_amount')}
set vat_amount(v){this._setter('vat_amount',v)}
get trans(){return this._getter('trans')}
set trans(v){this._setter('trans',v)}
}
$p.DocSellingGoodsRow = DocSellingGoodsRow;
class DocSellingServicesRow extends TabularSectionRow{
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get content(){return this._getter('content')}
set content(v){this._setter('content',v)}
get quantity(){return this._getter('quantity')}
set quantity(v){this._setter('quantity',v)}
get price(){return this._getter('price')}
set price(v){this._setter('price',v)}
get discount_percent(){return this._getter('discount_percent')}
set discount_percent(v){this._setter('discount_percent',v)}
get amount(){return this._getter('amount')}
set amount(v){this._setter('amount',v)}
get vat_rate(){return this._getter('vat_rate')}
set vat_rate(v){this._setter('vat_rate',v)}
get vat_amount(){return this._getter('vat_amount')}
set vat_amount(v){this._setter('vat_amount',v)}
get trans(){return this._getter('trans')}
set trans(v){this._setter('trans',v)}
}
$p.DocSellingServicesRow = DocSellingServicesRow;
$p.doc.create('selling');
class DocNom_prices_setup extends DocObj{
get price_type(){return this._getter('price_type')}
set price_type(v){this._setter('price_type',v)}
get currency(){return this._getter('currency')}
set currency(v){this._setter('currency',v)}
get responsible(){return this._getter('responsible')}
set responsible(v){this._setter('responsible',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get goods(){return this._getter_ts('goods')}
set goods(v){this._setter_ts('goods',v)}
}
$p.DocNom_prices_setup = DocNom_prices_setup;
class DocNom_prices_setupGoodsRow extends TabularSectionRow{
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get nom_characteristic(){return this._getter('nom_characteristic')}
set nom_characteristic(v){this._setter('nom_characteristic',v)}
get price_type(){return this._getter('price_type')}
set price_type(v){this._setter('price_type',v)}
get price(){return this._getter('price')}
set price(v){this._setter('price',v)}
}
$p.DocNom_prices_setupGoodsRow = DocNom_prices_setupGoodsRow;
$p.doc.create('nom_prices_setup');
class DocPlanning_event extends DocObj{
get phase(){return this._getter('phase')}
set phase(v){this._setter('phase',v)}
get key(){return this._getter('key')}
set key(v){this._setter('key',v)}
get recipient(){return this._getter('recipient')}
set recipient(v){this._setter('recipient',v)}
get trans(){return this._getter('trans')}
set trans(v){this._setter('trans',v)}
get partner(){return this._getter('partner')}
set partner(v){this._setter('partner',v)}
get project(){return this._getter('project')}
set project(v){this._setter('project',v)}
get origin(){return this._getter('origin')}
set origin(v){this._setter('origin',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get executors(){return this._getter_ts('executors')}
set executors(v){this._setter_ts('executors',v)}
get planning(){return this._getter_ts('planning')}
set planning(v){this._setter_ts('planning',v)}
}
$p.DocPlanning_event = DocPlanning_event;
class DocPlanning_eventExecutorsRow extends TabularSectionRow{
get executor(){return this._getter('executor')}
set executor(v){this._setter('executor',v)}
get coefficient(){return this._getter('coefficient')}
set coefficient(v){this._setter('coefficient',v)}
}
$p.DocPlanning_eventExecutorsRow = DocPlanning_eventExecutorsRow;
class DocPlanning_eventPlanningRow extends TabularSectionRow{
get obj(){return this._getter('obj')}
set obj(v){this._setter('obj',v)}
get specimen(){return this._getter('specimen')}
set specimen(v){this._setter('specimen',v)}
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get power(){return this._getter('power')}
set power(v){this._setter('power',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get begin_time(){return this._getter('begin_time')}
set begin_time(v){this._setter('begin_time',v)}
get end_time(){return this._getter('end_time')}
set end_time(v){this._setter('end_time',v)}
}
$p.DocPlanning_eventPlanningRow = DocPlanning_eventPlanningRow;
$p.doc.create('planning_event');
class DocPurchase_order extends DocObj{
get organization(){return this._getter('organization')}
set organization(v){this._setter('organization',v)}
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get warehouse(){return this._getter('warehouse')}
set warehouse(v){this._setter('warehouse',v)}
get partner(){return this._getter('partner')}
set partner(v){this._setter('partner',v)}
get contract(){return this._getter('contract')}
set contract(v){this._setter('contract',v)}
get basis(){return this._getter('basis')}
set basis(v){this._setter('basis',v)}
get stage(){return this._getter('stage')}
set stage(v){this._setter('stage',v)}
get responsible(){return this._getter('responsible')}
set responsible(v){this._setter('responsible',v)}
get shipping_date(){return this._getter('shipping_date')}
set shipping_date(v){this._setter('shipping_date',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get settlements_course(){return this._getter('settlements_course')}
set settlements_course(v){this._setter('settlements_course',v)}
get settlements_multiplicity(){return this._getter('settlements_multiplicity')}
set settlements_multiplicity(v){this._setter('settlements_multiplicity',v)}
get bank_account(){return this._getter('bank_account')}
set bank_account(v){this._setter('bank_account',v)}
get vat_included(){return this._getter('vat_included')}
set vat_included(v){this._setter('vat_included',v)}
get doc_amount(){return this._getter('doc_amount')}
set doc_amount(v){this._setter('doc_amount',v)}
get vat_consider(){return this._getter('vat_consider')}
set vat_consider(v){this._setter('vat_consider',v)}
get obj_delivery_state(){return this._getter('obj_delivery_state')}
set obj_delivery_state(v){this._setter('obj_delivery_state',v)}
get identifier(){return this._getter('identifier')}
set identifier(v){this._setter('identifier',v)}
get goods(){return this._getter_ts('goods')}
set goods(v){this._setter_ts('goods',v)}
}
$p.DocPurchase_order = DocPurchase_order;
class DocPurchase_orderGoodsRow extends TabularSectionRow{
get identifier(){return this._getter('identifier')}
set identifier(v){this._setter('identifier',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get nom_characteristic(){return this._getter('nom_characteristic')}
set nom_characteristic(v){this._setter('nom_characteristic',v)}
get unit(){return this._getter('unit')}
set unit(v){this._setter('unit',v)}
get quantity(){return this._getter('quantity')}
set quantity(v){this._setter('quantity',v)}
get price(){return this._getter('price')}
set price(v){this._setter('price',v)}
get amount(){return this._getter('amount')}
set amount(v){this._setter('amount',v)}
get vat_rate(){return this._getter('vat_rate')}
set vat_rate(v){this._setter('vat_rate',v)}
get vat_amount(){return this._getter('vat_amount')}
set vat_amount(v){this._setter('vat_amount',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get params(){return this._getter('params')}
set params(v){this._setter('params',v)}
get calc_order(){return this._getter('calc_order')}
set calc_order(v){this._setter('calc_order',v)}
}
$p.DocPurchase_orderGoodsRow = DocPurchase_orderGoodsRow;
$p.doc.create('purchase_order');
class IregLog_view extends RegisterRow{
get key(){return this._getter('key')}
set key(v){this._setter('key',v)}
get user(){return this._getter('user')}
set user(v){this._setter('user',v)}
}
$p.IregLog_view = IregLog_view;
$p.ireg.create('log_view');
class IregCurrency_courses extends RegisterRow{
get currency(){return this._getter('currency')}
set currency(v){this._setter('currency',v)}
get period(){return this._getter('period')}
set period(v){this._setter('period',v)}
get course(){return this._getter('course')}
set course(v){this._setter('course',v)}
get multiplicity(){return this._getter('multiplicity')}
set multiplicity(v){this._setter('multiplicity',v)}
}
$p.IregCurrency_courses = IregCurrency_courses;
$p.ireg.create('currency_courses');
class IregMargin_coefficients extends RegisterRow{
get price_group(){return this._getter('price_group')}
set price_group(v){this._setter('price_group',v)}
get key(){return this._getter('key')}
set key(v){this._setter('key',v)}
get condition_formula(){return this._getter('condition_formula')}
set condition_formula(v){this._setter('condition_formula',v)}
get marginality(){return this._getter('marginality')}
set marginality(v){this._setter('marginality',v)}
get marginality_min(){return this._getter('marginality_min')}
set marginality_min(v){this._setter('marginality_min',v)}
get marginality_internal(){return this._getter('marginality_internal')}
set marginality_internal(v){this._setter('marginality_internal',v)}
get price_type_first_cost(){return this._getter('price_type_first_cost')}
set price_type_first_cost(v){this._setter('price_type_first_cost',v)}
get price_type_sale(){return this._getter('price_type_sale')}
set price_type_sale(v){this._setter('price_type_sale',v)}
get price_type_internal(){return this._getter('price_type_internal')}
set price_type_internal(v){this._setter('price_type_internal',v)}
get formula(){return this._getter('formula')}
set formula(v){this._setter('formula',v)}
get sale_formula(){return this._getter('sale_formula')}
set sale_formula(v){this._setter('sale_formula',v)}
get internal_formula(){return this._getter('internal_formula')}
set internal_formula(v){this._setter('internal_formula',v)}
get external_formula(){return this._getter('external_formula')}
set external_formula(v){this._setter('external_formula',v)}
get extra_charge_external(){return this._getter('extra_charge_external')}
set extra_charge_external(v){this._setter('extra_charge_external',v)}
get discount_external(){return this._getter('discount_external')}
set discount_external(v){this._setter('discount_external',v)}
get discount(){return this._getter('discount')}
set discount(v){this._setter('discount',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
}
$p.IregMargin_coefficients = IregMargin_coefficients;
$p.ireg.create('margin_coefficients');
class DpBuilder_size extends DataProcessorObj{
get offset(){return this._getter('offset')}
set offset(v){this._setter('offset',v)}
get angle(){return this._getter('angle')}
set angle(v){this._setter('angle',v)}
get fix_angle(){return this._getter('fix_angle')}
set fix_angle(v){this._setter('fix_angle',v)}
get align(){return this._getter('align')}
set align(v){this._setter('align',v)}
get hide_c1(){return this._getter('hide_c1')}
set hide_c1(v){this._setter('hide_c1',v)}
get hide_c2(){return this._getter('hide_c2')}
set hide_c2(v){this._setter('hide_c2',v)}
get hide_line(){return this._getter('hide_line')}
set hide_line(v){this._setter('hide_line',v)}
get text(){return this._getter('text')}
set text(v){this._setter('text',v)}
get font_family(){return this._getter('font_family')}
set font_family(v){this._setter('font_family',v)}
get bold(){return this._getter('bold')}
set bold(v){this._setter('bold',v)}
get font_size(){return this._getter('font_size')}
set font_size(v){this._setter('font_size',v)}
}
$p.DpBuilder_size = DpBuilder_size;
$p.dp.create('builder_size');
class DpBuilder_coordinates extends DataProcessorObj{
get bind(){return this._getter('bind')}
set bind(v){this._setter('bind',v)}
get path(){return this._getter('path')}
set path(v){this._setter('path',v)}
get offset(){return this._getter('offset')}
set offset(v){this._setter('offset',v)}
get step(){return this._getter('step')}
set step(v){this._setter('step',v)}
get step_angle(){return this._getter('step_angle')}
set step_angle(v){this._setter('step_angle',v)}
get coordinates(){return this._getter_ts('coordinates')}
set coordinates(v){this._setter_ts('coordinates',v)}
}
$p.DpBuilder_coordinates = DpBuilder_coordinates;
class DpBuilder_coordinatesCoordinatesRow extends TabularSectionRow{
get x(){return this._getter('x')}
set x(v){this._setter('x',v)}
get y(){return this._getter('y')}
set y(v){this._setter('y',v)}
}
$p.DpBuilder_coordinatesCoordinatesRow = DpBuilder_coordinatesCoordinatesRow;
$p.dp.create('builder_coordinates');
class DpBuilder_pen extends DataProcessorObj{
get elm_type(){return this._getter('elm_type')}
set elm_type(v){this._setter('elm_type',v)}
get inset(){return this._getter('inset')}
set inset(v){this._setter('inset',v)}
get clr(){return $p.cat.clrs.getter(this._obj.clr)}
set clr(v){this._setter('clr',v)}
get bind_generatrix(){return this._getter('bind_generatrix')}
set bind_generatrix(v){this._setter('bind_generatrix',v)}
get bind_node(){return this._getter('bind_node')}
set bind_node(v){this._setter('bind_node',v)}
get bind_sys(){return this._getter('bind_sys')}
set bind_sys(v){this._setter('bind_sys',v)}
get grid(){return this._getter('grid')}
set grid(v){this._setter('grid',v)}
get region(){return this._getter('region')}
set region(v){this._setter('region',v)}
}
$p.DpBuilder_pen = DpBuilder_pen;
$p.dp.create('builder_pen');
class DpBuilder_price extends DataProcessorObj{
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get goods(){return this._getter_ts('goods')}
set goods(v){this._setter_ts('goods',v)}
get rounding_quantity(){return this._getter_ts('rounding_quantity')}
set rounding_quantity(v){this._setter_ts('rounding_quantity',v)}
}
$p.DpBuilder_price = DpBuilder_price;
class DpBuilder_priceGoodsRow extends TabularSectionRow{
get price_type(){return this._getter('price_type')}
set price_type(v){this._setter('price_type',v)}
get date(){return this._getter('date')}
set date(v){this._setter('date',v)}
get nom_characteristic(){return this._getter('nom_characteristic')}
set nom_characteristic(v){this._setter('nom_characteristic',v)}
get price(){return this._getter('price')}
set price(v){this._setter('price',v)}
get currency(){return this._getter('currency')}
set currency(v){this._setter('currency',v)}
}
$p.DpBuilder_priceGoodsRow = DpBuilder_priceGoodsRow;
class DpBuilder_priceRounding_quantityRow extends TabularSectionRow{
get elm_type(){return this._getter('elm_type')}
set elm_type(v){this._setter('elm_type',v)}
get value(){return this._getter('value')}
set value(v){this._setter('value',v)}
}
$p.DpBuilder_priceRounding_quantityRow = DpBuilder_priceRounding_quantityRow;
$p.dp.create('builder_price');
class DpBuyers_order extends DataProcessorObj{
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get characteristic(){return this._getter('characteristic')}
set characteristic(v){this._setter('characteristic',v)}
get sys(){return this._getter('sys')}
set sys(v){this._setter('sys',v)}
get clr(){return $p.cat.clrs.getter(this._obj.clr)}
set clr(v){this._setter('clr',v)}
get len(){return this._getter('len')}
set len(v){this._setter('len',v)}
get height(){return this._getter('height')}
set height(v){this._setter('height',v)}
get depth(){return this._getter('depth')}
set depth(v){this._setter('depth',v)}
get s(){return this._getter('s')}
set s(v){this._setter('s',v)}
get quantity(){return this._getter('quantity')}
set quantity(v){this._setter('quantity',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get first_cost(){return this._getter('first_cost')}
set first_cost(v){this._setter('first_cost',v)}
get price(){return this._getter('price')}
set price(v){this._setter('price',v)}
get discount_percent(){return this._getter('discount_percent')}
set discount_percent(v){this._setter('discount_percent',v)}
get discount_percent_internal(){return this._getter('discount_percent_internal')}
set discount_percent_internal(v){this._setter('discount_percent_internal',v)}
get discount(){return this._getter('discount')}
set discount(v){this._setter('discount',v)}
get amount(){return this._getter('amount')}
set amount(v){this._setter('amount',v)}
get shipping_date(){return this._getter('shipping_date')}
set shipping_date(v){this._setter('shipping_date',v)}
get client_number(){return this._getter('client_number')}
set client_number(v){this._setter('client_number',v)}
get inn(){return this._getter('inn')}
set inn(v){this._setter('inn',v)}
get shipping_address(){return this._getter('shipping_address')}
set shipping_address(v){this._setter('shipping_address',v)}
get phone(){return this._getter('phone')}
set phone(v){this._setter('phone',v)}
get price_internal(){return this._getter('price_internal')}
set price_internal(v){this._setter('price_internal',v)}
get amount_internal(){return this._getter('amount_internal')}
set amount_internal(v){this._setter('amount_internal',v)}
get base_block(){return this._getter('base_block')}
set base_block(v){this._setter('base_block',v)}
get weight(){return this._getter('weight')}
set weight(v){this._setter('weight',v)}
get furn(){return this._getter('furn')}
set furn(v){this._setter('furn',v)}
get inset(){return this._getter('inset')}
set inset(v){this._setter('inset',v)}
get product_params(){return this._getter_ts('product_params')}
set product_params(v){this._setter_ts('product_params',v)}
get production(){return this._getter_ts('production')}
set production(v){this._setter_ts('production',v)}
get glass_specification(){return this._getter_ts('glass_specification')}
set glass_specification(v){this._setter_ts('glass_specification',v)}
get specification(){return this._getter_ts('specification')}
set specification(v){this._setter_ts('specification',v)}
get charges_discounts(){return this._getter_ts('charges_discounts')}
set charges_discounts(v){this._setter_ts('charges_discounts',v)}
get sys_furn(){return this._getter_ts('sys_furn')}
set sys_furn(v){this._setter_ts('sys_furn',v)}
get sys_profile(){return this._getter_ts('sys_profile')}
set sys_profile(v){this._setter_ts('sys_profile',v)}

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
  }}
$p.DpBuyers_order = DpBuyers_order;
class DpBuyers_orderProductionRow extends TabularSectionRow{
get inset(){return this._getter('inset')}
set inset(v){this._setter('inset',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get characteristic(){return this._getter('characteristic')}
set characteristic(v){this._setter('characteristic',v)}
get clr(){return $p.cat.clrs.getter(this._obj.clr)}
set clr(v){this._setter('clr',v)}
get len(){return this._getter('len')}
set len(v){this._setter('len',v)}
get height(){return this._getter('height')}
set height(v){this._setter('height',v)}
get depth(){return this._getter('depth')}
set depth(v){this._setter('depth',v)}
get s(){return this._getter('s')}
set s(v){this._setter('s',v)}
get quantity(){return this._getter('quantity')}
set quantity(v){this._setter('quantity',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get first_cost(){return this._getter('first_cost')}
set first_cost(v){this._setter('first_cost',v)}
get price(){return this._getter('price')}
set price(v){this._setter('price',v)}
get discount_percent(){return this._getter('discount_percent')}
set discount_percent(v){this._setter('discount_percent',v)}
get amount(){return this._getter('amount')}
set amount(v){this._setter('amount',v)}
get ordn(){return this._getter('ordn')}
set ordn(v){this._setter('ordn',v)}
get qty(){return this._getter('qty')}
set qty(v){this._setter('qty',v)}
get use(){return this._getter('use')}
set use(v){this._setter('use',v)}
}
$p.DpBuyers_orderProductionRow = DpBuyers_orderProductionRow;
class DpBuyers_orderGlass_specificationRow extends TabularSectionRow{
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get sorting(){return this._getter('sorting')}
set sorting(v){this._setter('sorting',v)}
get inset(){return this._getter('inset')}
set inset(v){this._setter('inset',v)}
get clr(){return $p.cat.clrs.getter(this._obj.clr)}
set clr(v){this._setter('clr',v)}
}
$p.DpBuyers_orderGlass_specificationRow = DpBuyers_orderGlass_specificationRow;
class DpBuyers_orderSpecificationRow extends TabularSectionRow{
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get dop(){return this._getter('dop')}
set dop(v){this._setter('dop',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get algorithm(){return this._getter('algorithm')}
set algorithm(v){this._setter('algorithm',v)}
get nom_characteristic(){return this._getter('nom_characteristic')}
set nom_characteristic(v){this._setter('nom_characteristic',v)}
get clr(){return $p.cat.clrs.getter(this._obj.clr)}
set clr(v){this._setter('clr',v)}
get quantity(){return this._getter('quantity')}
set quantity(v){this._setter('quantity',v)}
get handle_height_base(){return this._getter('handle_height_base')}
set handle_height_base(v){this._setter('handle_height_base',v)}
get handle_height_min(){return this._getter('handle_height_min')}
set handle_height_min(v){this._setter('handle_height_min',v)}
get handle_height_max(){return this._getter('handle_height_max')}
set handle_height_max(v){this._setter('handle_height_max',v)}
get contraction(){return this._getter('contraction')}
set contraction(v){this._setter('contraction',v)}
get contraction_option(){return this._getter('contraction_option')}
set contraction_option(v){this._setter('contraction_option',v)}
get coefficient(){return this._getter('coefficient')}
set coefficient(v){this._setter('coefficient',v)}
get flap_weight_min(){return this._getter('flap_weight_min')}
set flap_weight_min(v){this._setter('flap_weight_min',v)}
get flap_weight_max(){return this._getter('flap_weight_max')}
set flap_weight_max(v){this._setter('flap_weight_max',v)}
get side(){return this._getter('side')}
set side(v){this._setter('side',v)}
get cnn_side(){return this._getter('cnn_side')}
set cnn_side(v){this._setter('cnn_side',v)}
get offset_option(){return this._getter('offset_option')}
set offset_option(v){this._setter('offset_option',v)}
get formula(){return this._getter('formula')}
set formula(v){this._setter('formula',v)}
get transfer_option(){return this._getter('transfer_option')}
set transfer_option(v){this._setter('transfer_option',v)}
get overmeasure(){return this._getter('overmeasure')}
set overmeasure(v){this._setter('overmeasure',v)}
get is_set_row(){return this._getter('is_set_row')}
set is_set_row(v){this._setter('is_set_row',v)}
get is_procedure_row(){return this._getter('is_procedure_row')}
set is_procedure_row(v){this._setter('is_procedure_row',v)}
get is_order_row(){return this._getter('is_order_row')}
set is_order_row(v){this._setter('is_order_row',v)}
get origin(){return this._getter('origin')}
set origin(v){this._setter('origin',v)}
get specify(){return this._getter('specify')}
set specify(v){this._setter('specify',v)}
get stage(){return this._getter('stage')}
set stage(v){this._setter('stage',v)}
}
$p.DpBuyers_orderSpecificationRow = DpBuyers_orderSpecificationRow;
class DpBuyers_orderCharges_discountsRow extends TabularSectionRow{
get nom_kind(){return this._getter('nom_kind')}
set nom_kind(v){this._setter('nom_kind',v)}
get discount_percent(){return this._getter('discount_percent')}
set discount_percent(v){this._setter('discount_percent',v)}
}
$p.DpBuyers_orderCharges_discountsRow = DpBuyers_orderCharges_discountsRow;
class DpBuyers_orderSys_furnRow extends TabularSectionRow{
get elm1(){return this._getter('elm1')}
set elm1(v){this._setter('elm1',v)}
get elm2(){return this._getter('elm2')}
set elm2(v){this._setter('elm2',v)}
}
$p.DpBuyers_orderSys_furnRow = DpBuyers_orderSys_furnRow;
class DpBuyers_orderSys_profileRow extends TabularSectionRow{
get sys(){return this._getter('sys')}
set sys(v){this._setter('sys',v)}
}
$p.DpBuyers_orderSys_profileRow = DpBuyers_orderSys_profileRow;
$p.dp.create('buyers_order');
class DpBuilder_text extends DataProcessorObj{
get text(){return this._getter('text')}
set text(v){this._setter('text',v)}
get font_family(){return this._getter('font_family')}
set font_family(v){this._setter('font_family',v)}
get bold(){return this._getter('bold')}
set bold(v){this._setter('bold',v)}
get font_size(){return this._getter('font_size')}
set font_size(v){this._setter('font_size',v)}
get angle(){return this._getter('angle')}
set angle(v){this._setter('angle',v)}
get align(){return this._getter('align')}
set align(v){this._setter('align',v)}
get clr(){return this._getter('clr')}
set clr(v){this._setter('clr',v)}
get x(){return this._getter('x')}
set x(v){this._setter('x',v)}
get y(){return this._getter('y')}
set y(v){this._setter('y',v)}
}
$p.DpBuilder_text = DpBuilder_text;
$p.dp.create('builder_text');
class DpBuilder_lay_impost extends DataProcessorObj{
get elm_type(){return this._getter('elm_type')}
set elm_type(v){this._setter('elm_type',v)}
get clr(){return $p.cat.clrs.getter(this._obj.clr)}
set clr(v){this._setter('clr',v)}
get region(){return this._getter('region')}
set region(v){this._setter('region',v)}
get split(){return this._getter('split')}
set split(v){this._setter('split',v)}
get elm_by_y(){return this._getter('elm_by_y')}
set elm_by_y(v){this._setter('elm_by_y',v)}
get step_by_y(){return this._getter('step_by_y')}
set step_by_y(v){this._setter('step_by_y',v)}
get align_by_y(){return this._getter('align_by_y')}
set align_by_y(v){this._setter('align_by_y',v)}
get inset_by_y(){return this._getter('inset_by_y')}
set inset_by_y(v){this._setter('inset_by_y',v)}
get elm_by_x(){return this._getter('elm_by_x')}
set elm_by_x(v){this._setter('elm_by_x',v)}
get step_by_x(){return this._getter('step_by_x')}
set step_by_x(v){this._setter('step_by_x',v)}
get align_by_x(){return this._getter('align_by_x')}
set align_by_x(v){this._setter('align_by_x',v)}
get inset_by_x(){return this._getter('inset_by_x')}
set inset_by_x(v){this._setter('inset_by_x',v)}
get w(){return this._getter('w')}
set w(v){this._setter('w',v)}
get h(){return this._getter('h')}
set h(v){this._setter('h',v)}
get sizes(){return this._getter_ts('sizes')}
set sizes(v){this._setter_ts('sizes',v)}
}
$p.DpBuilder_lay_impost = DpBuilder_lay_impost;
class DpBuilder_lay_impostSizesRow extends TabularSectionRow{
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get sz(){return this._getter('sz')}
set sz(v){this._setter('sz',v)}
get changed(){return this._getter('changed')}
set changed(v){this._setter('changed',v)}
}
$p.DpBuilder_lay_impostSizesRow = DpBuilder_lay_impostSizesRow;
$p.dp.create('builder_lay_impost');
class RepMaterials_demand extends DataProcessorObj{
get calc_order(){return this._getter('calc_order')}
set calc_order(v){this._setter('calc_order',v)}
get formula(){return this._getter('formula')}
set formula(v){this._setter('formula',v)}
get scheme(){return this._getter('scheme')}
set scheme(v){this._setter('scheme',v)}
get production(){return this._getter_ts('production')}
set production(v){this._setter_ts('production',v)}
get specification(){return this._getter_ts('specification')}
set specification(v){this._setter_ts('specification',v)}
}
$p.RepMaterials_demand = RepMaterials_demand;
class RepMaterials_demandProductionRow extends TabularSectionRow{
get use(){return this._getter('use')}
set use(v){this._setter('use',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get characteristic(){return this._getter('characteristic')}
set characteristic(v){this._setter('characteristic',v)}
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get qty(){return this._getter('qty')}
set qty(v){this._setter('qty',v)}
}
$p.RepMaterials_demandProductionRow = RepMaterials_demandProductionRow;
class RepMaterials_demandSpecificationRow extends TabularSectionRow{
get calc_order(){return this._getter('calc_order')}
set calc_order(v){this._setter('calc_order',v)}
get product(){return this._getter('product')}
set product(v){this._setter('product',v)}
get cnstr(){return this._getter('cnstr')}
set cnstr(v){this._setter('cnstr',v)}
get elm(){return this._getter('elm')}
set elm(v){this._setter('elm',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get article(){return this._getter('article')}
set article(v){this._setter('article',v)}
get id(){return this._getter('id')}
set id(v){this._setter('id',v)}
get clr(){return $p.cat.clrs.getter(this._obj.clr)}
set clr(v){this._setter('clr',v)}
get characteristic(){return this._getter('characteristic')}
set characteristic(v){this._setter('characteristic',v)}
get nom_kind(){return this._getter('nom_kind')}
set nom_kind(v){this._setter('nom_kind',v)}
get price_group(){return this._getter('price_group')}
set price_group(v){this._setter('price_group',v)}
get nom_group(){return this._getter('nom_group')}
set nom_group(v){this._setter('nom_group',v)}
get packing(){return this._getter('packing')}
set packing(v){this._setter('packing',v)}
get qty(){return this._getter('qty')}
set qty(v){this._setter('qty',v)}
get len(){return this._getter('len')}
set len(v){this._setter('len',v)}
get width(){return this._getter('width')}
set width(v){this._setter('width',v)}
get s(){return this._getter('s')}
set s(v){this._setter('s',v)}
get thickness(){return this._getter('thickness')}
set thickness(v){this._setter('thickness',v)}
get material(){return this._getter('material')}
set material(v){this._setter('material',v)}
get grouping(){return this._getter('grouping')}
set grouping(v){this._setter('grouping',v)}
get note(){return this._getter('note')}
set note(v){this._setter('note',v)}
get totqty(){return this._getter('totqty')}
set totqty(v){this._setter('totqty',v)}
get totqty1(){return this._getter('totqty1')}
set totqty1(v){this._setter('totqty1',v)}
get alp1(){return this._getter('alp1')}
set alp1(v){this._setter('alp1',v)}
get alp2(){return this._getter('alp2')}
set alp2(v){this._setter('alp2',v)}
get sz(){return this._getter('sz')}
set sz(v){this._setter('sz',v)}
get price(){return this._getter('price')}
set price(v){this._setter('price',v)}
get amount(){return this._getter('amount')}
set amount(v){this._setter('amount',v)}
get amount_marged(){return this._getter('amount_marged')}
set amount_marged(v){this._setter('amount_marged',v)}
get dop(){return this._getter('dop')}
set dop(v){this._setter('dop',v)}
}
$p.RepMaterials_demandSpecificationRow = RepMaterials_demandSpecificationRow;
$p.rep.create('materials_demand');
class RepFormulas_stat extends DataProcessorObj{
get data(){return this._getter_ts('data')}
set data(v){this._setter_ts('data',v)}
}
$p.RepFormulas_stat = RepFormulas_stat;
class RepFormulas_statDataRow extends TabularSectionRow{
get date(){return this._getter('date')}
set date(v){this._setter('date',v)}
get formula(){return this._getter('formula')}
set formula(v){this._setter('formula',v)}
get user(){return this._getter('user')}
set user(v){this._setter('user',v)}
get suffix(){return this._getter('suffix')}
set suffix(v){this._setter('suffix',v)}
get requests(){return this._getter('requests')}
set requests(v){this._setter('requests',v)}
get time(){return this._getter('time')}
set time(v){this._setter('time',v)}
}
$p.RepFormulas_statDataRow = RepFormulas_statDataRow;
$p.rep.create('formulas_stat');
class RepCash extends DataProcessorObj{
get data(){return this._getter_ts('data')}
set data(v){this._setter_ts('data',v)}
}
$p.RepCash = RepCash;
class RepCashDataRow extends TabularSectionRow{
get period(){return this._getter('period')}
set period(v){this._setter('period',v)}
get register(){return this._getter('register')}
set register(v){this._setter('register',v)}
get organization(){return this._getter('organization')}
set organization(v){this._setter('organization',v)}
get bank_account_cashbox(){return this._getter('bank_account_cashbox')}
set bank_account_cashbox(v){this._setter('bank_account_cashbox',v)}
get initial_balance(){return this._getter('initial_balance')}
set initial_balance(v){this._setter('initial_balance',v)}
get debit(){return this._getter('debit')}
set debit(v){this._setter('debit',v)}
get credit(){return this._getter('credit')}
set credit(v){this._setter('credit',v)}
get final_balance(){return this._getter('final_balance')}
set final_balance(v){this._setter('final_balance',v)}
}
$p.RepCashDataRow = RepCashDataRow;
$p.rep.create('cash');
class RepGoods extends DataProcessorObj{
get data(){return this._getter_ts('data')}
set data(v){this._setter_ts('data',v)}
}
$p.RepGoods = RepGoods;
class RepGoodsDataRow extends TabularSectionRow{
get period(){return this._getter('period')}
set period(v){this._setter('period',v)}
get register(){return this._getter('register')}
set register(v){this._setter('register',v)}
get warehouse(){return this._getter('warehouse')}
set warehouse(v){this._setter('warehouse',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get characteristic(){return this._getter('characteristic')}
set characteristic(v){this._setter('characteristic',v)}
get initial_balance(){return this._getter('initial_balance')}
set initial_balance(v){this._setter('initial_balance',v)}
get debit(){return this._getter('debit')}
set debit(v){this._setter('debit',v)}
get credit(){return this._getter('credit')}
set credit(v){this._setter('credit',v)}
get final_balance(){return this._getter('final_balance')}
set final_balance(v){this._setter('final_balance',v)}
get amount_initial_balance(){return this._getter('amount_initial_balance')}
set amount_initial_balance(v){this._setter('amount_initial_balance',v)}
get amount_debit(){return this._getter('amount_debit')}
set amount_debit(v){this._setter('amount_debit',v)}
get amount_credit(){return this._getter('amount_credit')}
set amount_credit(v){this._setter('amount_credit',v)}
get amount_final_balance(){return this._getter('amount_final_balance')}
set amount_final_balance(v){this._setter('amount_final_balance',v)}
}
$p.RepGoodsDataRow = RepGoodsDataRow;
$p.rep.create('goods');
class RepInvoice_execution extends DataProcessorObj{
get data(){return this._getter_ts('data')}
set data(v){this._setter_ts('data',v)}
}
$p.RepInvoice_execution = RepInvoice_execution;
class RepInvoice_executionDataRow extends TabularSectionRow{
get period(){return this._getter('period')}
set period(v){this._setter('period',v)}
get organization(){return this._getter('organization')}
set organization(v){this._setter('organization',v)}
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get partner(){return this._getter('partner')}
set partner(v){this._setter('partner',v)}
get trans(){return this._getter('trans')}
set trans(v){this._setter('trans',v)}
get invoice(){return this._getter('invoice')}
set invoice(v){this._setter('invoice',v)}
get pay(){return this._getter('pay')}
set pay(v){this._setter('pay',v)}
get pay_total(){return this._getter('pay_total')}
set pay_total(v){this._setter('pay_total',v)}
get pay_percent(){return this._getter('pay_percent')}
set pay_percent(v){this._setter('pay_percent',v)}
get shipment(){return this._getter('shipment')}
set shipment(v){this._setter('shipment',v)}
get shipment_total(){return this._getter('shipment_total')}
set shipment_total(v){this._setter('shipment_total',v)}
get shipment_percent(){return this._getter('shipment_percent')}
set shipment_percent(v){this._setter('shipment_percent',v)}
}
$p.RepInvoice_executionDataRow = RepInvoice_executionDataRow;
$p.rep.create('invoice_execution');
class RepMutual_settlements extends DataProcessorObj{
get data(){return this._getter_ts('data')}
set data(v){this._setter_ts('data',v)}
}
$p.RepMutual_settlements = RepMutual_settlements;
class RepMutual_settlementsDataRow extends TabularSectionRow{
get period(){return this._getter('period')}
set period(v){this._setter('period',v)}
get register(){return this._getter('register')}
set register(v){this._setter('register',v)}
get organization(){return this._getter('organization')}
set organization(v){this._setter('organization',v)}
get trans(){return this._getter('trans')}
set trans(v){this._setter('trans',v)}
get partner(){return this._getter('partner')}
set partner(v){this._setter('partner',v)}
get initial_balance(){return this._getter('initial_balance')}
set initial_balance(v){this._setter('initial_balance',v)}
get debit(){return this._getter('debit')}
set debit(v){this._setter('debit',v)}
get credit(){return this._getter('credit')}
set credit(v){this._setter('credit',v)}
get final_balance(){return this._getter('final_balance')}
set final_balance(v){this._setter('final_balance',v)}
}
$p.RepMutual_settlementsDataRow = RepMutual_settlementsDataRow;
$p.rep.create('mutual_settlements');
class RepSelling extends DataProcessorObj{
get data(){return this._getter_ts('data')}
set data(v){this._setter_ts('data',v)}
}
$p.RepSelling = RepSelling;
class RepSellingDataRow extends TabularSectionRow{
get period(){return this._getter('period')}
set period(v){this._setter('period',v)}
get register(){return this._getter('register')}
set register(v){this._setter('register',v)}
get organization(){return this._getter('organization')}
set organization(v){this._setter('organization',v)}
get department(){return this._getter('department')}
set department(v){this._setter('department',v)}
get partner(){return this._getter('partner')}
set partner(v){this._setter('partner',v)}
get trans(){return this._getter('trans')}
set trans(v){this._setter('trans',v)}
get nom(){return this._getter('nom')}
set nom(v){this._setter('nom',v)}
get characteristic(){return this._getter('characteristic')}
set characteristic(v){this._setter('characteristic',v)}
get quantity(){return this._getter('quantity')}
set quantity(v){this._setter('quantity',v)}
get amount(){return this._getter('amount')}
set amount(v){this._setter('amount',v)}
get vat_amount(){return this._getter('vat_amount')}
set vat_amount(v){this._setter('vat_amount',v)}
get discount(){return this._getter('discount')}
set discount(v){this._setter('discount',v)}
}
$p.RepSellingDataRow = RepSellingDataRow;
$p.rep.create('selling');

/*
 * Подмешивается в конец init-файла
 *
 */

/**
 * Абстрактная строка табчасти параметров
 * @class
 */
class ParamsRow extends TabularSectionRow{
  get param(){
    return this._getter('param') || $p.cch.properties.get();
  }
  set param(v){this._setter('param',v)}
  get value(){
    const {param} = this;
    return (param && param.fetch_type && !param.empty()) ? param.fetch_type(this._obj.value) : this._getter('value');
  }
  set value(v){
    if(typeof v === 'string' && v.length === 72 && this.param.type?.types?.includes('cat.clrs')) {
      v = $p.cat.clrs.getter(v);
    }
    this._setter('value',v);
  }
}

/**
 * Строка табчасти параметров с уточнением до элемента
 * @class
 */
class ElmParamsRow extends ParamsRow{
  get elm(){return this._getter('elm')}
  set elm(v){this._setter('elm',v)}
}

/**
 * Строка табчасти параметров с признаком сокрытия
 * @class
 */
class HideParamsRow extends ParamsRow{
  get hide(){return this._getter('hide')}
  set hide(v){this._setter('hide',v)}
}

/**
 * Строка табчасти параметров с признаками сокрытия и принудительной установки
 * @class
 */
class HideForciblyParamsRow extends HideParamsRow{
  get forcibly(){return this._getter('forcibly')}
  set forcibly(v){this._setter('forcibly',v)}

  option_value({elm, ...other}) {
    const {value} = this;
    return value instanceof CatValues_options ? value.option_value({elm, ...other}) : value;
  }
}

/**
 * Строка табчасти отбора технологических справочников
 * @class
 */
class SelectionParamsRow extends ElmParamsRow{
  get area(){return this._getter('area')}
  set area(v){this._setter('area',v)}
  get comparison_type(){return this._getter('comparison_type')}
  set comparison_type(v){this._setter('comparison_type',v)}
  get txt_row(){return this._getter('txt_row')}
  set txt_row(v){this._setter('txt_row',v)}
  get origin(){return this._getter('origin')}
  set origin(v){this._setter('origin',v)}
}

/**
 * Строка табчасти допреквизитов
 * @class
 */
class Extra_fieldsRow extends TabularSectionRow{
  get property(){return this._getter('property')}
  set property(v){this._setter('property',v)}
  get value(){
    const {property: param} = this;
    return (param?.fetch_type && !param.empty()) ? param.fetch_type(this._obj.value) : this._getter('value');
  }
  set value(v) {
    if(typeof v === 'string' && v.length === 72 && this.property?.type?.types?.includes('cat.clrs')) {
      v = $p.cat.clrs.getter(v);
    }
    this._setter('value', v);
  }
  get txt_row(){return this._getter('txt_row')}
  set txt_row(v){this._setter('txt_row',v)}
}

/**
 * Строка допреквизитов ключей параметров
 * @class
 */
class CatParameters_keysParamsRow extends Extra_fieldsRow{
  get area(){return this._getter('area')}
  set area(v){this._setter('area',v)}
  get origin(){return this._getter('origin')}
  set origin(v){this._setter('origin',v)}
  get comparison_type(){return this._getter('comparison_type')}
  set comparison_type(v){this._setter('comparison_type',v)}
}

/**
 * Строка табчасти назначения платежа
 * @class
 */
class Payment_detailsRow extends TabularSectionRow{
  get cash_flow_article(){return this._getter('cash_flow_article')}
  set cash_flow_article(v){this._setter('cash_flow_article',v)}
  get trans(){return this._getter('trans')}
  set trans(v){this._setter('trans',v)}
  get amount(){return this._getter('amount')}
  set amount(v){this._setter('amount',v)}
}

/**
 * Строка табчасти параметров формул
 * @class
 */
class CatFormulasParamsRow extends ParamsRow{}

class DpBuyers_orderProduct_paramsRow extends ElmParamsRow{
  get region(){return this._getter('region')}
  set region(v){this._setter('region',v)}
  get inset(){return this._getter('inset')}
  set inset(v){this._setter('inset',v)}
  get hide(){return this._getter('hide')}
  set hide(v){this._setter('hide',v)}
}

class CatProduction_paramsFurn_paramsRow extends HideForciblyParamsRow{}

class CatProduction_paramsProduct_paramsRow extends HideForciblyParamsRow{
  get elm(){return this._getter('elm')}
  set elm(v){this._setter('elm',v)}
}

class CatInsertsProduct_paramsRow extends HideForciblyParamsRow{
  get pos(){return this._getter('pos')}
  set pos(v){this._setter('pos',v)}
  get list(){return this._getter('list')}
  set list(v){this._setter('list',v)}
}

class CatCnnsSizesRow extends SelectionParamsRow{
  get key(){return this._getter('key')}
  set key(v){this._setter('key',v)}
}

class CatInsertsSelection_paramsRow extends SelectionParamsRow{}

class CatCnnsSelection_paramsRow extends SelectionParamsRow{}

class CatFurnsSelection_paramsRow extends SelectionParamsRow{
  get dop(){return this._getter('dop')}
  set dop(v){this._setter('dop',v)}
}

class CatCharacteristicsParamsRow extends HideParamsRow{
  get cnstr(){return this._getter('cnstr')}
  set cnstr(v){this._setter('cnstr',v)}
  get region(){return this._getter('region')}
  set region(v){this._setter('region',v)}
  get inset(){return this._getter('inset')}
  set inset(v){this._setter('inset',v)}
  get _list() {
    const {param, inset} = this;
    if(!param.empty() && !inset.empty()) {
      const def = inset.product_params.find({param});
      if(def && def.list) {
        let _list;
        try {_list = JSON.parse(def.list)}
        catch (e) {}
        return _list;
      }
    }
  }
}

class DocCredit_card_orderPayment_detailsRow extends Payment_detailsRow{}
class DocDebit_bank_orderPayment_detailsRow extends Payment_detailsRow{}
class DocCredit_bank_orderPayment_detailsRow extends Payment_detailsRow{}
class DocDebit_cash_orderPayment_detailsRow extends Payment_detailsRow{}
class DocCredit_cash_orderPayment_detailsRow extends Payment_detailsRow{}

class CatProjectsExtra_fieldsRow extends Extra_fieldsRow{}
class CatStoresExtra_fieldsRow extends Extra_fieldsRow{}
class CatCharacteristicsExtra_fieldsRow extends Extra_fieldsRow{}
class DocPurchaseExtra_fieldsRow extends Extra_fieldsRow{}
class DocCalc_orderExtra_fieldsRow extends Extra_fieldsRow{}
class DocCredit_card_orderExtra_fieldsRow extends Extra_fieldsRow{}
class DocDebit_bank_orderExtra_fieldsRow extends Extra_fieldsRow{}
class DocCredit_bank_orderExtra_fieldsRow extends Extra_fieldsRow{}
class DocDebit_cash_orderExtra_fieldsRow extends Extra_fieldsRow{}
class DocCredit_cash_orderExtra_fieldsRow extends Extra_fieldsRow{}
class DocSellingExtra_fieldsRow extends Extra_fieldsRow{}
class CatBranchesExtra_fieldsRow extends Extra_fieldsRow{}
class CatPartnersExtra_fieldsRow extends Extra_fieldsRow{}
class CatNomExtra_fieldsRow extends Extra_fieldsRow{}
class CatOrganizationsExtra_fieldsRow extends Extra_fieldsRow{}
class CatDivisionsExtra_fieldsRow extends Extra_fieldsRow{}
class CatUsersExtra_fieldsRow extends Extra_fieldsRow{}
class CatProduction_paramsExtra_fieldsRow extends Extra_fieldsRow{}

class CatCharacteristicsCoordinatesRow extends TabularSectionRow{
  get cnstr(){return this._getter('cnstr')}
  set cnstr(v){this._setter('cnstr',v)}
  get parent(){return this._getter('parent')}
  set parent(v){this._setter('parent',v)}
  get region(){
    const region = this._getter('region');
    return typeof region === "number" ? region : (region.empty() ? 0 : region)}
  set region(v){this._setter('region',v)}
  get elm(){return this._getter('elm')}
  set elm(v){this._setter('elm',v)}
  get elm_type(){return this._getter('elm_type')}
  set elm_type(v){this._setter('elm_type',v)}
  get clr(){return $p.cat.clrs.getter(this._obj.clr)}
  set clr(v){this._setter('clr',v)}
  get inset(){return this._getter('inset')}
  set inset(v){this._setter('inset',v)}
  get path_data(){return this._getter('path_data')}
  set path_data(v){this._setter('path_data',v)}
  get x1(){return this._getter('x1')}
  set x1(v){this._setter('x1',v)}
  get y1(){return this._getter('y1')}
  set y1(v){this._setter('y1',v)}
  get x2(){return this._getter('x2')}
  set x2(v){this._setter('x2',v)}
  get y2(){return this._getter('y2')}
  set y2(v){this._setter('y2',v)}
  get r(){return this._getter('r')}
  set r(v){this._setter('r',v)}
  get arc_ccw(){return this._getter('arc_ccw')}
  set arc_ccw(v){this._setter('arc_ccw',v)}
  get s(){return this._getter('s')}
  set s(v){this._setter('s',v)}
  get angle_hor(){return this._getter('angle_hor')}
  set angle_hor(v){this._setter('angle_hor',v)}
  get alp1(){return this._getter('alp1')}
  set alp1(v){this._setter('alp1',v)}
  get alp2(){return this._getter('alp2')}
  set alp2(v){this._setter('alp2',v)}
  get len(){return this._getter('len')}
  set len(v){this._setter('len',v)}
  get pos(){return this._getter('pos')}
  set pos(v){this._setter('pos',v)}
  get orientation(){return this._getter('orientation')}
  set orientation(v){this._setter('orientation',v)}
  get nom(){return this._getter('nom')}
  set nom(v){this._setter('nom',v)}
  get offset(){return this._getter('offset')}
  set offset(v){this._setter('offset',v)}
  get dop(){return this._getter('dop')}
  set dop(v){this._setter('dop',v)}
}
class CatCharacteristicsInsertsRow extends TabularSectionRow{
  get cnstr(){return this._getter('cnstr')}
  set cnstr(v){this._setter('cnstr',v)}
  get region(){
    const region = this._getter('region');
    return typeof region === "number" ? region : (region.empty() ? 0 : region)}
  set region(v){this._setter('region',v)}
  get inset(){return this._getter('inset')}
  set inset(v){this._setter('inset',v)}
  get clr(){return $p.cat.clrs.getter(this._obj.clr)}
  set clr(v){this._setter('clr',v)}
  get dop(){return this._getter('dop')}
  set dop(v){this._setter('dop',v)}
}

Object.assign($p, {
  CatFormulasParamsRow,
  CatCharacteristicsParamsRow,
  DpBuyers_orderProduct_paramsRow,
  CatProduction_paramsFurn_paramsRow,
  CatProduction_paramsProduct_paramsRow,
  CatInsertsProduct_paramsRow,
  CatCnnsSizesRow,
  CatInsertsSelection_paramsRow,
  CatCnnsSelection_paramsRow,
  CatFurnsSelection_paramsRow,
  DocCredit_card_orderPayment_detailsRow,
  DocDebit_bank_orderPayment_detailsRow,
  DocCredit_bank_orderPayment_detailsRow,
  DocDebit_cash_orderPayment_detailsRow,
  DocCredit_cash_orderPayment_detailsRow,
  CatProjectsExtra_fieldsRow,
  CatStoresExtra_fieldsRow,
  CatCharacteristicsExtra_fieldsRow,
  DocPurchaseExtra_fieldsRow,
  DocCalc_orderExtra_fieldsRow,
  DocCredit_card_orderExtra_fieldsRow,
  DocDebit_bank_orderExtra_fieldsRow,
  DocCredit_bank_orderExtra_fieldsRow,
  DocDebit_cash_orderExtra_fieldsRow,
  DocCredit_cash_orderExtra_fieldsRow,
  DocSellingExtra_fieldsRow,
  CatBranchesExtra_fieldsRow,
  CatPartnersExtra_fieldsRow,
  CatNomExtra_fieldsRow,
  CatOrganizationsExtra_fieldsRow,
  CatDivisionsExtra_fieldsRow,
  CatUsersExtra_fieldsRow,
  CatProduction_paramsExtra_fieldsRow,
  CatParameters_keysParamsRow,
  CatCharacteristicsCoordinatesRow,
  CatCharacteristicsInsertsRow,
});

})();
};

