

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
    const {job_prm} = $p;
    res.price_groups = job_prm.pricing.displacing_price_group || [];
    let source;
    this.find_rows({kind, is_buyer: partner.abc}, obj => {
      if(obj.owner instanceof CatAbonents && obj.extra_charge.count()) {
        source = obj;
        return false;
      }
    });
    if(!branch.empty()) {
      this.find_rows({kind, is_buyer: partner.abc}, obj => {
        if(branch._hierarchy(obj.owner) && obj.extra_charge.count()){
          if(source.owner instanceof CatAbonents || obj.owner._hierarchy(source.owner)) {
            source = obj;
          }
          if(branch === obj.owner) {
            return false;
          }
        }
      });
    }
    for(const row of (source?.extra_charge || [])) {
      if(row.period > date) {
        continue;
      }
      const obj = row.obj || null;
      // ключи параметров проверяем сразу
      if(obj instanceof CatParameters_keys) {
        if(obj.check_condition({calc_order_row})) {
          // если сработал ключ, будем возвращать коэффициент строки безусловно
          res.clear();
          const coefficient = row.coefficient || 0;
          res.coefficient = () => coefficient;
          break;
        }
        else {
          continue;
        }        
      }
      res.set(obj, row);
    }
    return res;
  }
  
  static CoefficientsMap = class CoefficientsMap extends Map {

    replenish(obj, ox) {
      for(const [key, value] of this) {
        // ищем по иерархии системы или фурнитуры и запоминаем
        if(key && obj._hierarchy(key)) {
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
      if(!this.has(obj) && ox) {
        const pl = ox.owner.nom_group;
        if(!pl.empty()) {
          this.replenish(pl);
          if(this.has(pl)) {
            this.set(obj, this.get(pl));
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
      let {_owner: {_owner}, nom: {price_group}} = row;
      let obj, crow;
      // если вытесняющая ценовая группа
      if(this.price_groups.includes(price_group)) {
        obj = price_group;
      }
      else {
        crow = row.elm < 0 && _owner.constructions.find({cnstr: -row.elm});
        obj = crow?.furn || _owner.sys;
        if(obj.empty()) {
          const {leading_product, origin} = _owner;
          if(leading_product.empty()) {
            obj = origin;
          }
          else {
            obj = leading_product.sys;
            _owner = leading_product;
          }
        }  
      }
      
      if(!this.has(obj)) {
        this.replenish(obj, _owner);
        // если не нашлось по иерархии, ищем максимум по системе
        if(!this.has(obj)) {
          if(obj instanceof CatInsert_bind) {
            for(const {inset} of obj.inserts) {
              if(!this.has(inset)) {
                this.replenish(inset, _owner);
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
              this.replenish(sys, _owner);
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
