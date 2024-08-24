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
        if (!grp_ok) {
          break;
        }
      }
      res = grp_ok;
      if(res) {
        break;
      }
    }
    
    return res;
  }

};
