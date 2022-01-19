/**
 * Справочник "Ключи параметров"
 *
 * @module cat_parameters_keys
 *
 * Created 19.01.2022.
 */

exports.CatParameters_keys = class CatParameters_keys extends Object {

  check_condition({elm, ox, cnstr, layer, calc_order_row}) {

    if(this.empty()) {
      return true;
    }
    if(!ox && elm) {
      ox = elm.ox;
    }
    if(!layer && elm) {
      layer = elm.layer;
    }
    if(!cnstr && layer) {
      cnstr = layer.cnstr;
    }
    const {calc_order} = ox;

    for(const prm_row of this.params) {
      const {property, origin} = prm_row;
      let ok;
      // заглушка для совместимости с УПзП
      if(calc_order_row && property.empty()){
        const vpartner = $p.cat.partners.get(prm_row._obj.value);
        if(vpartner && !vpartner.empty() && vpartner != calc_order.partner){
          return false;
        }
      }
      else {
        if(!property.check_condition({prm_row, elm, cnstr, origin, ox, calc_order, layer, calc_order_row})) {
          return false;
        }
      }
    }

    return true;
  }

};
