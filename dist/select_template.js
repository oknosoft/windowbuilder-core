/**
 *
 *
 * @module select_template
 *
 * Created by Evgeniy Malyarov on 24.12.2019.
 */

export default function ({classes, cat: {characteristics, templates, params_links, clrs, production_params}, cch, job_prm, doc, utils, wsql}) {

  class FakeSelectTemplate extends classes.BaseDataObj {

    constructor() {
      //calc_order, base_block, sys, sys_grp, template_props, refill
      super({refill: true}, characteristics, false, true);
      this._data._is_new = false;
      this._meta = utils._clone(characteristics.metadata());
      this._meta.fields.template_props = templates.metadata('template_props');
      this._meta.fields.refill = utils._clone(params_links.metadata('hide'));
      this._meta.fields.sys_grp = utils._clone(characteristics.metadata('sys'));
      this._meta.fields.sys_grp.choice_groups_elm = 'grp';
      const {params} = this._meta.tabular_sections;
      this._meta.tabular_sections = {params};

      const permitted_sys = this.permitted_sys.bind(this);
      Object.defineProperty(this._meta.fields.sys, 'choice_params', {
        get() {
          return permitted_sys();
        }
      });

    }

    // начальное значение заказа-шаблона
    init(inset) {
      return Promise.resolve()
        .then(() => {
          const {templates_nested} = job_prm.builder;
          if(inset) {
            if(templates_nested && templates_nested.length) {
              if(!templates_nested.includes(this.calc_order)) {
                return this.value_change('calc_order', '', templates_nested[0]);
              }
            }
            else {
              return this.value_change('calc_order', '', '');
            }
          }
          else {
            const ref = wsql.get_user_param('template_block_calc_order');
            let calc_order;
            return (utils.is_guid(ref) ? doc.calc_order.get(ref, 'promise').then((doc) => calc_order = doc).catch(() => null) : Promise.resolve())
              .then(() => {
                if(!calc_order || calc_order.empty() || (templates_nested && templates_nested.includes(calc_order))) {
                  doc.calc_order.find_rows({obj_delivery_state: 'Шаблон'}, (doc) => {
                    if(templates_nested && templates_nested.includes(doc)) {
                      return ;
                    }
                    calc_order = doc;
                    return false;
                  });
                }
                if(calc_order) {
                  return this.value_change('calc_order', '', calc_order);
                }
              });
          }
        });
    }


    _metadata(fld) {
      const {_meta} = this;
      return fld ? (_meta.fields[fld] || _meta.tabular_sections[fld]) : _meta;
    }

    get calc_order() {
      return this._getter('calc_order');
    }
    set calc_order(v) {
      this._setter('calc_order', v);
    }

    get base_block() {
      return this._getter('base_block');
    }
    set base_block(v) {
      this._setter('base_block', v);
      const conds = [];
      const selection = {};
      this.permitted_sys(this.calc_order, conds);
      conds.forEach(({name, path}) => {
        selection[name] = path;
      });
      if(this.sys.empty() || !utils._selection(this.sys, selection)) {
        this.sys = this.base_block.sys;
      }
    }

    get refill() {
      return this._getter('refill');
    }
    set refill(v) {
      this._setter('refill', v);
    }

    get sys_grp() {
      let v = this._getter('sys_grp');
      if(v.empty()) {
        v = production_params.find({is_folder: true});
      }
      return v;
    }
    set sys_grp(v) {
      this._setter('sys_grp', v);
    }

    get sys() {
      return this._getter('sys');
    }
    set sys(v) {
      this._setter('sys', v);
      const {sys, params} = this;
      const selection = {};
      clrs.selection_exclude_service(this._meta.fields.clr, sys, this);
      this._meta.fields.clr.choice_params.forEach(({name, path}) => {
        selection[name] = path;
      });
      if(this.clr.empty() || !utils._selection(this.clr, selection)) {
        this.clr = sys.default_clr.empty() ? clrs.predefined('Белый') : sys.default_clr;
      }

      const {base_props} = job_prm.builder || {};
      if(base_props) {

        // удаляем все скрытые и лишние параметры
        const {product_params} = sys;
        const adel = [];
        params.forEach((row) => {
          if(row.hide || !product_params.find({param: row.param})) {
            adel.push(row);
          }
          else if(!row.hide && !base_props.includes(row.param)) {
            row.hide = true;
          }
        });
        adel.forEach((row) => params.del(row));

        product_params.forEach(({param, value, hide, by_default, forcibly}) => {
          let prow = params.find({param});
          // если еще не добавлен - добавляем со значением по умолчанию
          if(!prow) {
            prow = params.add({param, value, hide: hide || !base_props.includes(param)});
          }
          if(forcibly) {
            prow.value = value;
          }
        });
      }
    }

    get clr(){return $p.cat.clrs.getter(this._obj.clr)}
    set clr(v){this._setter('clr',v)}

    get template_props() {return this._getter('template_props')}
    set template_props(v) {this._setter('template_props', v)}

    get params() {return this._getter_ts('params')}

    value_change(field, type, value) {
      if(field == 'calc_order' && this[field] != value) {
        this[field] = value;
        const {calc_order} = this;
        if(this.base_block.calc_order !== calc_order) {
          this.base_block = '';
        }
        wsql.set_user_param('template_block_calc_order', calc_order.ref);
        return calc_order.load_templates();
      }
    }

    permitted_sys(calc_order, res = []) {
      const permitted_sys = cch.properties.predefined('permitted_sys');
      if(!calc_order) {
        calc_order = this.calc_order;
      }
      if(permitted_sys) {
        const prow = calc_order.extra_fields.find({property: permitted_sys});
        if(prow && prow.txt_row) {
          res.push({
            name: 'ref',
            path: {inh: prow.txt_row.split(',').map((ref) => production_params.get(ref))}
          });
        }
      }
      return res;
    }

    /**
     * Корректирует и возвращает метаданные обработки
     */
    permitted_sys_meta(ox, mf) {
      const {dp, enm: {obj_delivery_states: {Шаблон}}} = $p;
      if(!mf) {
        mf = dp.buyers_order.metadata('sys');
      }
      if(mf.choice_params) {
        mf.choice_params.length = 0;
      }
      else {
        mf.choice_params = [];
      }
      const {base_block, obj_delivery_state, calc_order, sys} = ox;
      if(!(obj_delivery_state === Шаблон || calc_order.obj_delivery_state === Шаблон)){
        if (base_block.obj_delivery_state === Шаблон || base_block.calc_order.obj_delivery_state === Шаблон) {
          this.permitted_sys(base_block.calc_order, mf.choice_params);
        }
        mf.choice_params.push({
          name: 'template',
          path: sys.template ? true : {not: true},
        });
      }

    }

  }

  templates._select_template = new FakeSelectTemplate();
}

