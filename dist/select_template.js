/**
 *
 *
 * @module select_template
 *
 * Created by Evgeniy Malyarov on 24.12.2019.
 */

export default function ({classes, cat: {characteristics, templates, params_links}, doc, utils, wsql}) {

  class FakeSelectTemplate extends classes.BaseDataObj {

    constructor() {
      //calc_order, base_block, sys, template_props, refill
      super({}, characteristics, false, true);
      this._data._is_new = false;
      this._meta = utils._clone(characteristics.metadata());
      this._meta.fields.template_props = templates.metadata('template_props');
      this._meta.fields.refill = utils._clone(params_links.metadata('hide'));
      this._meta.tabular_sections = {};

      const permitted_sys = this.permitted_sys.bind(this);
      Object.defineProperty(this._meta.fields.sys, 'choice_params', {
        get() {
          return permitted_sys();
        }
      });

    }

    // начальное значение заказа-шаблона
    init() {
      const ref = wsql.get_user_param('template_block_calc_order');
      let calc_order;
      return (utils.is_guid(ref) ? doc.calc_order.get(ref, 'promise').then((doc) => calc_order = doc).catch(() => null) : Promise.resolve())
        .then(() => {
          if(!calc_order || calc_order.empty()) {
            doc.calc_order.find_rows({obj_delivery_state: 'Шаблон'}, (doc) => {
              calc_order = doc;
              return false;
            });
          }
          if(calc_order) {
            return this.value_change('calc_order', '', calc_order);
          }
        });
    }


    _metadata(fld) {
      return fld ? this._meta.fields[fld] : this._meta;
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
      this.sys = this.base_block.sys;
    }

    get refill() {
      return this._getter('refill');
    }
    set refill(v) {
      this._setter('refill', v);
    }

    get sys() {
      return this._getter('sys');
    }
    set sys(v) {
      this._setter('sys', v);
    }

    get template_props() {
      return this._getter('template_props');
    }
    set template_props(v) {
      this._setter('template_props', v);
    }

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
      const {cch, cat} = $p;
      const permitted_sys = cch.properties.predefined('permitted_sys');
      if(!calc_order) {
        calc_order = this.calc_order;
      }
      if(permitted_sys) {
        const prow = calc_order.extra_fields.find({property: permitted_sys});
        if(prow && prow.txt_row) {
          res.push({
            name: "ref",
            path: {inh: prow.txt_row.split(',').map((ref) => cat.production_params.get(ref))}
          });
        }
      }
      return res;
    }

    /**
     * Корректирует и возвращает метаданные обработки
     */
    permitted_sys_meta(ox, mf) {
      const {dp, enm: {obj_delivery_states: {Шаблон}}, cch, cat} = $p;
      if(!mf) {
        mf = dp.buyers_order.metadata('sys');
      }
      if(mf.choice_params) {
        mf.choice_params.length = 0;
      }
      else {
        mf.choice_params = [];
      }
      const {base_block, obj_delivery_state} = ox;
      if(obj_delivery_state !== Шаблон &&
        (base_block.obj_delivery_state === Шаблон || base_block.calc_order.obj_delivery_state === Шаблон)) {
        this.permitted_sys(base_block.calc_order, mf.choice_params);
      }
    }

  }

  templates._select_template = new FakeSelectTemplate();
}

