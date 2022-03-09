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
    const {cat} = _owner.$p;
    if(!_data.clrs) {
      const clrs = new Set();

      clr_conformity.forEach(({clr1}) => {
        if(clr1 instanceof CatClrs) {
          if(clr1.is_folder) {
            clr1._children().forEach((clr) => clrs.add(clr));
          }
          else {
            clrs.add(clr1);
          }
        }
        else if(clr1 instanceof CatColor_price_groups) {
          for(const clr of clr1.clrs()) {
            clrs.add(clr);
          }
        }
      });

      // уточним по формуле условия
      if(!formula.empty()) {
        const attr = {clrs};
        if(!mode) {
          _data.clrs = Array.from(clrs).filter((clr) => formula.execute(clr, attr));
        }
        else {
          cat.clrs.forEach((clr) => {
            if(clr.parent.predefined_name || clrs.has(clr)) {
              return;
            }
            if(formula.execute(clr, attr)) {
              clrs.add(clr);
            }
          })
        }
      }

      if(!_data.clrs) {
        _data.clrs = Array.from(clrs);
      }
    }
    return _data.clrs;
  }

  /**
   * Проверяйет, подходит ли цвет данной группе
   * @param clr
   * @returns {boolean}
   */
  contains(clr, clrs) {
    if(this.empty()) {
      return true;
    }
    if(!clrs) {
      clrs = this.clrs();
    }
    if(!clrs.length) {
      return true;
    }
    return clr.is_composite() ? clrs.includes(clr.clr_in) && clrs.includes(clr.clr_out) : clrs.includes(clr);
  }
};
