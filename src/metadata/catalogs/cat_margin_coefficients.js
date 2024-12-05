

exports.CatMargin_coefficientsManager = class CatMargin_coefficientsManager extends Object {

  /**
   * @summary Возвращает срез маржинальных коэффициентов для отдела на дату
   * @param {Date} date - дата среза
   * @param {Number} kind - вид (0 - коэффициент, 1 - Скидка % мин, 2 - Скидка % макс)
   * @param {DocCalc_orderProductionRow} calc_order_row
   * @return {CoefficientsMap}
   */
  slice({date, kind = 0, calc_order_row}) {
    const {CoefficientsMap} = this.constructor;
    const {branch, partner} = calc_order_row._owner._owner;
    const res = new CoefficientsMap();
    res.price_groups = $p.job_prm.pricing.displacing_price_group || [];
    let source;
    this.find_rows({kind, is_buyer: partner.abc}, obj => {
      if(!source) {
        source = obj;
      }
      else if(!branch.empty() && branch._hierarchy(obj.owner)){
        if(branch === obj.owner || obj.owner._hierarchy(source.owner)) {
          source = obj;
        }
      }
    });
    for(const row of source?.extra_charge) {
      if(row.period > date) {
        continue;
      }
      const obj = row.obj || null;
      res.set(obj, row);
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
      if(!this.has(obj) && obj instanceof CatProduction_params) {
        const pl = obj._extra('product_line');
        if(pl && !pl.empty() && this.has(pl)) {
          this.set(obj, this.get(pl));
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
      const {_owner: {_owner}, nom: {price_group}} = row;
      let obj, crow;
      if(this.price_groups.includes(price_group)) {
        obj = price_group;
      }
      else {
        crow = row.elm < 0 && _owner.constructions.find({cnstr: -row.elm});
        obj = crow?.furn || _owner.sys;
        if(obj.empty()) {
          const {leading_product, origin} = _owner;
          obj = leading_product.empty() ? origin : leading_product.sys;
        }  
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
                this.set(obj, this.get(null) || {coefficient: 0});
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
              this.set(obj, this.get(null) || {coefficient: 0});
            }
          }
          else {
            this.set(obj, this.get(null) || {coefficient: 0});
          }
        }
      }
      return this.get(obj).coefficient || 0;
    }
  }
}
