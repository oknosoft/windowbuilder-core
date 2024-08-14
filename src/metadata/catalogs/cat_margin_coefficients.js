

exports.CatMargin_coefficientsManager = class CatMargin_coefficientsManager extends Object {

  /**
   * @summary Возвращает срез маржинальных коэффициентов для отдела на дату
   * @param {Date} date
   * @param {DocCalc_orderProductionRow} calc_order_row
   * @return {CoefficientsMap}
   */
  slice({date, calc_order_row}) {
    const {CoefficientsMap} = this.constructor;
    const {branch} = calc_order_row._owner._owner;
    const res = new CoefficientsMap();
    for(const obj of this) {
      for(const row of obj.extra_charge) {
        if(row.date > date) {
          continue;
        }
        const {obj} = row;
        if(obj && (!res.has(obj) || (!branch.empty() && branch._hierarchy(obj)))) {
          res.set(obj, row);
        }
      }
    }
    return res;
  }
  
  static CoefficientsMap = class CoefficientsMap extends Map {

    /**
     * @summary Возвращает коэффициент для строки спецификации
     * @desc В зависимости от происхождения (система, фурнитура, ценовая группа, вставка)
     * @param {CatCharacteristicsSpecificationRow} row
     * @return {Number}
     * 
     */
    coefficient(row) {
      const crow = row.elm < 0 && row._owner._owner.constructions.find({cnstr: -row.elm});
      const obj = crow?.furn || row._owner._owner.sys;
      if(!this.has(obj)) {
        for(const [key, value] of this) {
          // ищем по иерархии системы или фурнитуры и запоминаем
          if(obj._hierarchy(key)) {
            this.set(obj, value);
          }
        }
        // если не нашлось по иерархии, ищем максимум по типу
        if(!this.has(obj)) {
          let test;
          for(const [key, value] of this) {
            if(key._manager === obj._manager) {
              if(!test || test.coefficient < value.coefficient) {
                test = value;
              }
            }
          }
          this.set(obj, test || {coefficient: 1});
        }
      }
      return this.get(obj).coefficient;
    }
  }
}
