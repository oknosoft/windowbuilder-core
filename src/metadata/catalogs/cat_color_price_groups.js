/**
 * ### Дополнительные методы справочника _Цветоценовые группы_
 *
 * Created 17.06.2019.
 */

exports.CatColor_price_groups = class CatColor_price_groups extends Object {

  /**
   * Рассчитывает и устанавливает при необходимости в obj цвет по умолчанию
   * @param [obj] - если указано, в поле clr этого объекта будет установлен цвет
   * @return CatClrs
   */
  default_clr(obj = {}) {

    // а надо ли устанавливать? если не задано ограничение, выходим
    const available = this.clrs();

    // бежим по строкам ограничения цветов
    if(!available.includes(obj.clr) && available.length) {
      // подставляем первый разрешенный
      obj.clr = available[0];
    }

    return obj.clr;
  }

  /**
   * Извлекает доступные цвета
   * @return {Array.<CatClrs>}
   */
  clrs() {
    const {_manager: {_owner}, _data, condition_formula: formula, mode, clr_conformity} = this;
    const {cat, CatClrs, CatColor_price_groups} = _owner.$p;
    if(!_data.clrs) {
      _data.clrs = new Set();

      clr_conformity.forEach(({clr1}) => {
        if(clr1 instanceof CatClrs) {
          if(clr1.is_folder) {
            cat.clrs.find_rows({parent: clr1}, (clr) => {
              !clr.is_folder && _data.clrs.add(clr);
            });
          }
          else {
            _data.clrs.add(clr1);
          }
        }
        else if(clr1 instanceof CatColor_price_groups) {
          for(const clr of clr1.clrs()) {
            _data.clrs.add(clr);
          }
        }
      });

      // уточним по формуле условия
      if(!formula.empty()) {
        if(!mode) {
          const res = Array.from(_data.clrs);
          _data.clrs = new Set(res.filter((clr) => formula.execute(clr)));
        }
        else {
          cat.clrs.forEach((clr) => {
            if(clr.parent.predefined_name || _data.clrs.has(clr)) {
              return;
            }
            if(formula.execute(clr)) {
              _data.clrs.add(clr);
            }
          })
        }
      }
    }
    return Array.from(_data.clrs);
  }
};
