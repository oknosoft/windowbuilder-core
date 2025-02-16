
// если класс не включён в exclude, заготовки конструкторов система создаст автоматически
export const exclude = ['cat.colorPriceGroups'];

export function classes({cat, enm, classes, symbols}, exclude)  {
    
  const {CatObj, CatManager, TabularSectionRow, CatClrs} = classes;
  const {get, set} = symbols;
  
  class CatColorPriceGroupsManager extends CatManager {

  }
  classes.CatColorPriceGroupsManager = CatColorPriceGroupsManager;

  class CatColorPriceGroups extends CatObj {
    get color_price_group_destination(){return this[get]('color_price_group_destination')}
    set color_price_group_destination(v){this[set]('color_price_group_destination',v)}
    get condition_formula(){return this[get]('condition_formula')}
    set condition_formula(v){this[set]('condition_formula',v)}
    get mode(){return this[get]('mode')}
    set mode(v){this[set]('mode',v)}
    get hide_composite(){return this[get]('hide_composite')}
    set hide_composite(v){this[set]('hide_composite',v)}
    get clr(){return this[get]('clr')}
    set clr(v){this[set]('clr',v)}
    get captured(){return this[get]('captured')}
    set captured(v){this[set]('captured',v)}
    get editor(){return this[get]('editor')}
    set editor(v){this[set]('editor',v)}
    get price_groups(){return this[get]('price_groups')}
    set price_groups(v){this[get]('price_groups').load(v)}
    get clr_conformity(){return this[get]('clr_conformity')}
    set clr_conformity(v){this[get]('clr_conformity').load(v)}
    get exclude(){return this[get]('exclude')}
    set exclude(v){this[get]('exclude').load(v)}

    /**
     * Рассчитывает и устанавливает при необходимости в obj цвет по умолчанию
     * @param [obj] - если указано, в поле clr этого объекта будет установлен цвет
     * @return CatClrs
     */
    defaultClr(obj = {}) {

      // а надо ли устанавливать? если не задано ограничение, выходим
      const available = this.clrs();

      // бежим по строкам ограничения цветов
      if(available.length && !this.contains(obj.clr, available)) {
        // подставляем первый разрешенный
        obj.clr = available[0];
      }

      return obj.clr;
    }

    /**
     * Извлекает доступные цвета
     * @param [side] {EmnCnnSides}
     * @return {Array.<CatClrs>}
     */
    clrs(side) {
      const {_data, condition_formula: formula} = this;

      if(!_data.clrs) {
        const clrs = new Set();
        for(const {clr1} of this.clr_conformity) {
          if(clr1 instanceof CatClrs) {
            if(clr1.isFolder) {
              clr1._children().forEach((clr) => clrs.add(clr));
            }
            else {
              clrs.add(clr1);
            }
          }
          else if(clr1 instanceof CatColorPriceGroups) {
            for(const clr of clr1.clrs()) {
              clrs.add(clr);
            }
          }
        }

        // уточним по формуле условия
        if(!formula.empty()) {
          const attr = {clrs};
          if(!this.mode) {
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
      const srows = this.exclude.findRows({side});
      return srows.length ? _data.clrs.filter((clr) => {
        for(const {clr: eclr} of srows) {
          if((eclr === clr) || (eclr instanceof CatColorPriceGroups && eclr.contains(clr))) {
            return false;
          }
        }
        return true;
      }) : _data.clrs;
    }

    /**
     * Проверяет, подходит ли цвет данной группе
     * @param clr {CatClrs} - цвет, который проверяем
     * @param [clrs] {Array} - массив clrs, если не задан, рассчитываем
     * @param [any] {Boolean} - признак для составных - учитывать обе стороны или любую
     * @returns {boolean}
     */
    contains(clr, clrs, any) {
      if(this.empty() && !clrs) {
        return true;
      }
      if(!clrs) {
        clrs = this.clrs();
      }
      if(!clrs.length) {
        return true;
      }
      if(clr.isComposite()) {
        return any ?
          (clrs.includes(clr.clr_in) || clrs.includes(clr.clr_out)) :
          clrs.includes(clr.clr_in) && clrs.includes(clr.clr_out);
      }
      return clrs.includes(clr) && !this.exclude.find({side: 'Любая', clr});
    }
    
  }
  classes.CatColorPriceGroups = CatColorPriceGroups;

  class CatColorPriceGroupsClrConformityRow extends TabularSectionRow {
    get clr1(){return this[get]('clr1')}
    set clr1(v){this[set]('clr1',v)}
    get clr2(){return this[get]('clr2')}
    set clr2(v){this[set]('clr2',v)}
  }
  classes.CatColorPriceGroupsClrConformityRow = CatColorPriceGroupsClrConformityRow;

  class CatColorPriceGroupsExcludeRow extends TabularSectionRow {
    get side(){return this[get]('side')}
    set side(v){this[set]('side',v)}
    get clr(){return this[get]('clr')}
    set clr(v){this[set]('clr',v)}
  }
  classes.CatColorPriceGroupsExcludeRow = CatColorPriceGroupsExcludeRow;

  class CatColorPriceGroupsPriceGroupsRow extends TabularSectionRow{
    get price_group(){return this[get]('price_group')}
    set price_group(v){this[set]('price_group',v)}
  }
  classes.CatColorPriceGroupsPriceGroupsRow = CatColorPriceGroupsPriceGroupsRow;
     
}
