/**
 *
 *
 * @module cat_params_links
 *
 * Created by Evgeniy Malyarov on 22.05.2020.
 */

exports.CatParams_links = class CatParams_links extends Object {

  append_values(values = []) {
    this.values.forEach((row) => {
      if(row.value.is_folder) {
        row.value._children().forEach((value) => {
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
