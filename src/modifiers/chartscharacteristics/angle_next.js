
/**
 * Предопределенное поведение параметра angle_next
 *
 * Created 05.12.2021.
 */

$p.adapters.pouch.once('pouch_doc_ram_loaded', () => {
  const {cch, cat, EditorInvisible, utils} = $p;
  const prm = cch.properties.predefined('angle_next');
  if(prm) {
    // fake-формула
    if(prm.calculated.empty()) {
      prm.calculated = cat.formulas.create({name: 'angle_next'}, false, true);
      prm.calculated._data._formula = function (obj) {
        const {elm} = obj;
      };
    }
    // fake-признак использования
    if(!prm.use.count()) {
      prm.use.add({count_calc_method: 'ПоПериметру'});
    }
    // проверка условия
    prm.check_condition = function ({row_spec, prm_row, elm, elm2, cnstr, origin, ox}) {
      if(elm && elm._row && elm._row.hasOwnProperty('angle_next')) {
        return utils.check_compare(elm._row.angle_next, prm_row.value, prm_row.comparison_type, prm_row.comparison_type._manager)
      }
      return Object.getPrototypeOf(this).check_condition.call(this, {row_spec, prm_row, elm, elm2, cnstr, origin, ox});
    }
  }
});
