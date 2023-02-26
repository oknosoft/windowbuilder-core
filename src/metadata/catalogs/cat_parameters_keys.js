/**
 * Справочник "Ключи параметров"
 *
 * @module cat_parameters_keys
 *
 * Created 19.01.2022.
 */

exports.CatParameters_keys = class CatParameters_keys extends Object {

  check_condition({elm, elm2, ox, layer, calc_order_row, ...other}) {

    if(this.empty()) {
      return true;
    }
    if(!ox && elm) {
      ox = elm.ox;
    }
    if(!layer && elm) {
      layer = elm.layer;
    }
    const {calc_order} = ox;

    for(const prm_row of this.params) {
      const {property, origin} = prm_row;
      if(!property.check_condition({prm_row, elm, elm2, origin, ox, calc_order, layer, calc_order_row, ...other})) {
        return false;
      }
    }

    return true;
  }

};
