

exports.CatMargin_coefficientsManager = class CatMargin_coefficientsManager extends Object {

  /**
   * @summary Возвращает срез маржинальных коэффициентов для отдела на дату
   * @param {Date} date
   * @param {DocCalc_orderProductionRow} calc_order_row
   * @return {CoefficientsMap}
   */
  slice({date, calc_order_row}) {
    const {CoefficientsMap} = this.constructor;
    const res = new CoefficientsMap();
    for(const obj of this) {
      
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
      return 1;
    }
  }
}
