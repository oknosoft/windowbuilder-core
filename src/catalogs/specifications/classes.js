
export const exclude = ['cat.specifications'];

export function classes({cat, classes, symbols}, exclude)  {
  const {CatObj, CatManager, TabularSectionRow} = classes;
  const {get, set} = symbols;

  class CatSpecificationsManager extends CatManager {
    
  }
  classes.CatSpecificationsManager = CatSpecificationsManager;
  
  class CatSpecifications extends CatObj {
    get calc_order(){return this[get]('calc_order')}
    set calc_order(v){this[set]('calc_order',v)}
    get characteristic(){return this[get]('characteristic')}
    set characteristic(v){this[set]('characteristic',v)}
    get production_kind(){return this[get]('production_kind')}
    set production_kind(v){this[set]('production_kind',v)}
    get owner(){return this[get]('owner')}
    set owner(v){this[set]('owner',v)}
    get composition(){return this[get]('composition')}
    set composition(v){this[get]('composition').load(v)}
    get procedures(){return this[get]('procedures')}
    set procedures(v){this[get]('procedures').load(v)}

    /**
     * @summary Добавляет строку в табчасть состава
     * @desc Попутно заполняет реквизиты принадлежности к элементу-слою
     * @param {BuilderElement} [elm]
     * @param {Contour} [layer]
     * @return {CatSpecificationsCompositionRow}
     */
    specRow({elm, layer}) {
      const row = this.composition.add({elm: elm?.index || layer.index});
      return row;
    }

    procRow({elm, layer}) {
      const row = this.procedures.add({elm: elm?.index || layer.index});
      return row;
    }

    /**
     * @summary Вклад в спецификацию
     * @desc Выполняет метод соответствующего EnmCountCalculatingWays или вызов по цепочке
     * @param {DepositeSpecificationRow} basis
     * @param {Array} [stack] - Предыдущие строки вызова
     */
    byBasis({basis, stack = [], ...other}) {
      const {nom, algorithm} = basis;
      const attr = algorithm.patch({specification: this, basis, stack, ...other});
      if(nom instanceof classes.CatNom) {
        basis.count_calc_method.calculate(attr);
      }
      else {
        stack.push(basis);
        nom.calculateSpec(attr);
      }
    }
  }
  classes.CatSpecifications = CatSpecifications;

  const flds = {
    a4: ['len', 'width', 's', 'qty', 'alp1', 'alp2'],
    a6: ['totqty', 'quantity'],
    round(row) {
      this.a4.forEach((fld) => row[fld] = row[fld]?.round(4) || 0);
      this.a6.forEach((fld) => row[fld] = row[fld]?.round(6) || 0);
    }
  }; 
  class CatSpecificationsCompositionRow extends TabularSectionRow{
    get composition_kinds(){return this[get]('composition_kinds')}
    set composition_kinds(v){this[set]('composition_kinds',v)}
    get nom(){return this[get]('nom')}
    set nom(v){this[set]('nom',v)}
    get characteristic(){return this[get]('characteristic')}
    set characteristic(v){this[set]('characteristic',v)}
    get unit(){return this[get]('unit')}
    set unit(v){this[set]('unit',v)}
    get specification(){return this[get]('specification')}
    set specification(v){this[set]('specification',v)}
    get quantity(){return this[get]('quantity')}
    set quantity(v){this[set]('quantity',v)}
    get cost_part(){return this[get]('cost_part')}
    set cost_part(v){this[set]('cost_part',v)}
    get stage(){return this[get]('stage')}
    set stage(v){this[set]('stage',v)}
    get elm(){return this[get]('elm')}
    set elm(v){this[set]('elm',v)}
    get region(){return this[get]('region')}
    set region(v){this[set]('region',v)}
    get clr(){return this[get]('clr')}
    set clr(v){this[set]('clr',v)}
    get len(){return this[get]('len')}
    set len(v){this[set]('len',v)}
    get width(){return this[get]('width')}
    set width(v){this[set]('width',v)}
    get depth(){return this[get]('depth')}
    set depth(v){this[set]('depth',v)}
    get s(){return this[get]('s')}
    set s(v){this[set]('s',v)}
    get alp1(){return this[get]('alp1')}
    set alp1(v){this[set]('alp1',v)}
    get alp2(){return this[get]('alp2')}
    set alp2(v){this[set]('alp2',v)}
    get qty(){return this[get]('qty')}
    set qty(v){this[set]('qty',v)}
    get totqty(){return this[get]('totqty')}
    set totqty(v){this[set]('totqty',v)}
    get price(){return this[get]('price')}
    set price(v){this[set]('price',v)}
    get amount(){return this[get]('amount')}
    set amount(v){this[set]('amount',v)}
    get amount_marged(){return this[get]('amount_marged')}
    set amount_marged(v){this[set]('amount_marged',v)}
    get origin(){return this[get]('origin')}
    set origin(v){this[set]('origin',v)}
    
    qtyLen(attr) {
      const {nom} = this;
      const {basis, elm, rib, layer, rawLength, currentLength, ...other} = attr;
      const len = currentLength || rib?.length || rawLength || elm?.length || 0;

      if(!nom.is_procedure && (nom.cutting_optimization_type.is('no') || nom.cutting_optimization_type.empty() || nom.is_pieces)) {
        if(!basis.coefficient || !len) {
          this.qty = basis.quantity;
        }
        else {
          if(!nom.is_pieces) {
            this.qty = basis.quantity;
            this.len = (len - (basis?.count_calc_method?.is('spacer') ? 0 : basis.sz)) * (basis.coefficient || 0.001);
            if(nom.rounding_quantity) {
              this.qty = (this.qty * this.len).round(nom.rounding_quantity);
              this.len = 0;
            }
            ;
          }
          else if(!nom.rounding_quantity) {
            this.qty = Math.round((len - basis.sz) * basis.coefficient * basis.quantity - 0.5);
          }
          else {
            this.qty = ((len - basis.sz) * basis.coefficient * basis.quantity).round(nom.rounding_quantity);
          }
        }
      }
      else if(nom.is_pieces && !basis.coefficient) {
        this.qty = basis.quantity;
      }
      else {
        this.qty = basis.quantity;
        this.len = (len - basis.sz) * (basis.coefficient || 0.001);
        if(basis.offsets && this.len > (basis.offsets * (basis.coefficient || 0.001))) {
          this.len = basis.offsets * (basis.coefficient || 0.001);
        }
      }
      return this;
    }
    
    angleAreaVolume(attr) {
      const {qty, len, width, s, nom, totqty, quantity, _quantity} = this;
      if(!qty) {
        // dop=-1 - визуализация, dop=-2 - техоперация,
        this.del();
        return;
      }
      // если свойства уже рассчитаны в формуле, пересчет не выполняем
      if(totqty && quantity) {
        return this;
      }
      
      const {angle, elm, totqty0} = attr;
      if(angle) {
        const {alp1, alp2, method: {prev, next}} = attr.angle;
      }

      if(len) {
        if(width && !s) {
          this.s = len * width;
        }
      }
      else {
        this.s = 0;
      }

      if(this.s) {
        this.totqty = qty * this.s;
      }
      else if(len) {
        this.totqty = qty * len;
      }
      else {
        this.totqty = qty;
      }

      // при расчёте по площади, в totqty1 пишем площадь bounds вместо площади фигуры
      if(this.s && elm?.is('Filling') && s < len * width) {
        this.totqty = qty * len * width;
      }

      this.quantity = totqty0 ? 0 : Math.max(nom.minVolume, this.totqty * nom.loss_factor);

      if(_quantity) {
        this.qty *= _quantity;
        this.totqty *= _quantity;
        this.quantity *= _quantity;
      }

      flds.round(this);
       
      return this;
    }
  }
  classes.CatSpecificationsCompositionRow = CatSpecificationsCompositionRow;

  class CatSpecificationsProceduresRow extends TabularSectionRow{
    get elm(){return this[get]('elm')}
    set elm(v){this[set]('elm',v)}
    get procedure(){return this[get]('procedure')}
    set procedure(v){this[set]('procedure',v)}
    get clr(){return this[get]('clr')}
    set clr(v){this[set]('clr',v)}
    get len(){return this[get]('len')}
    set len(v){this[set]('len',v)}
    get width(){return this[get]('width')}
    set width(v){this[set]('width',v)}
    get time_standard(){return this[get]('time_standard')}
    set time_standard(v){this[set]('time_standard',v)}
    get quantity(){return this[get]('quantity')}
    set quantity(v){this[set]('quantity',v)}
    get stage(){return this[get]('stage')}
    set stage(v){this[set]('stage',v)}
    get origin(){return this[get]('origin')}
    set origin(v){this[set]('origin',v)}

    draw({elm, region, layer, parent}) {
      if(elm.visible) {
        const {visualization} = this.procedure;
        const {attributes} = visualization;
        if(!attributes?.regions || attributes.regions.includes?.(region)) {
          visualization.draw({
            elm,
            parent,
            offset: this.len,
            //offset0: this.width * (this.alp1 || 1),
            clr: this.clr,
            reflected: layer.reflected,
          });
          return true;
        }
      }
    }
  }
  classes.CatSpecificationsProceduresRow = CatSpecificationsProceduresRow;
}
