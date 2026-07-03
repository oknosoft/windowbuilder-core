/**
 * Справочник СвязиПараметров
 *
 * Created by Evgeniy Malyarov on 22.05.2020.
 */

exports.CatParams_links = class CatParams_links extends Object {

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
  }
}

exports.CatParams_linksManager = class CatParams_linksManager extends Object {

  forcibly(name) {
    if(!this._forcibly) {
      this._forcibly = {};
      for(const link of this) {
        for(const {param} of link.forcibly) {
          const name = param.predefined_name;
          if(name) {
            if(!this._forcibly[name]) {
              this._forcibly[name] = new Map();
            }
            if(!this._forcibly[name].has(link.slave)) {
              this._forcibly[name].set(link.slave, new Set());
            }
            this._forcibly[name].get(link.slave).add(link);
          }
        }
      }
    }
    return this._forcibly[name];
  }
}

