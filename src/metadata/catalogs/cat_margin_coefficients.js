

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

    replenish(obj) {
      for(const [key, value] of this) {
        // ищем по иерархии системы или фурнитуры и запоминаем
        if(obj._hierarchy(key)) {
          // приоритет по равенству или прямому родителю
          if(obj === key) {
            this.set(obj, value);
            break;
          }
          if(obj.parent === key || !this.has(obj)) {
            this.set(obj, value);
          }
        }
      }
    }

    /**
     * @summary Возвращает коэффициент для строки спецификации
     * @desc В зависимости от происхождения (система, фурнитура, ценовая группа, вставка)
     * @param {CatCharacteristicsSpecificationRow} row
     * @return {Number}
     * 
     */
    coefficient(row) {
      const {_owner} = row._owner;
      const crow = row.elm < 0 && _owner.constructions.find({cnstr: -row.elm});
      let obj = crow?.furn || _owner.sys;
      if(obj.empty()) {
        const {leading_product, origin} = _owner;
        obj = leading_product.empty() ? origin : leading_product.sys;
      }
      if(!this.has(obj)) {
        this.replenish(obj);
        // если не нашлось по иерархии, ищем максимум по системе
        if(!this.has(obj)) {
          if(obj instanceof CatInsert_bind) {
            for(const {inset} of obj.inserts) {
              if(!this.has(inset)) {
                this.replenish(inset);
              }
              if(this.has(inset)) {
                this.set(obj, this.get(inset));
                break;
              }
              else {
                this.set(obj, {coefficient: 0});
              }
            }
          }
          else if(obj === crow?.furn) {
            const {sys} = _owner;
            if(!this.has(sys)) {
              this.replenish(sys);
            }
            if(this.has(sys)) {
              this.set(obj, this.get(sys));
            }
            else {
              this.set(obj, {coefficient: 0});
            }
          }
          else {
            this.set(obj, {coefficient: 0});
          }
        }
      }
      return this.get(obj).coefficient || 0;
    }
  }
}