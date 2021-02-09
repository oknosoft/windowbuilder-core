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
   * @return {*[]}
   */
  append_values(values = []) {
    const {CatColor_price_groups} = this._manager._owner.$p;
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
