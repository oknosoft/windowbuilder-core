
const constructors = [];

export default function depositeSpecificationRow({CatObj, TabularSectionRow, get, set, own}) {
  if(!constructors.length) {
    class DepositeSpecificationRow extends TabularSectionRow {
      get elm(){return this[get]('elm')}
      set elm(v){this[set]('elm',v)}
      get nom(){return this[get]('nom')}
      set nom(v){this[set]('nom',v)}
      get algorithm(){return this[get]('algorithm')}
      set algorithm(v){this[set]('algorithm',v)}
      get nom_characteristic(){return this[get]('nom_characteristic')}
      set nom_characteristic(v){this[set]('nom_characteristic',v)}
      get clr(){return this[get]('clr')}
      set clr(v){this[set]('clr',v)}
      get coefficient(){return this[get]('coefficient')}
      set coefficient(v){this[set]('coefficient',v)}
      get sz(){return this[get]('sz')}
      set sz(v){this[set]('sz',v)}
      get quantity(){return this[get]('quantity')}
      set quantity(v){this[set]('quantity',v)}
      get formula(){return this[get]('formula')}
      set formula(v){this[set]('formula',v)}
      get is_order_row(){return this[get]('is_order_row')}
      set is_order_row(v){this[set]('is_order_row',v)}
      get stage(){return this[get]('stage')}
      set stage(v){this[set]('stage',v)}
      get inset(){return this[get]('inset')}
      set inset(v){this[set]('inset',v)}

      paramsRows() {
        const {elm} = this;
        return this[own][own].selection_params.filter((row) => row.elm === elm && !row.origin.is('algorithm'));
      }

      checkParams(attr) {
        let {_or, count_calc_method} = this;
        if(!this._or) {
          this._or = _or = new Map();
          for(const row of this.paramsRows()) {
            if(!_or.has(row.area)) {
              _or.set(row.area, []);
            }
            _or.get(row.area).push(row);
          }
        }
        let ok = true;
        for(const grp of _or.values()) {
          let grp_ok = true;
          for (const prm_row of grp) {

            // перед проверкой условий выясняем, примерима ли проверка к данному способу расчёта
            const {use} = prm_row.param;
            if(use.count() && !use.find({count_calc_method})) {
              continue;
            }

            // выполнение условия рассчитывает объект CchProperties
            grp_ok = prm_row.checkCondition(attr);
            // если строка условия в ключе не выполняется, то дальше проверять его условия смысла нет
            if (!grp_ok) {
              break;
            }
          }
          ok = grp_ok;
          if(ok) {
            break;
          }
        }

        return ok;
      }
    }
    
    class DepositeSpecificationObj extends CatObj {
      get lmin(){return this[get]('lmin')}
      set lmin(v){this[set]('lmin',v)}
      get lmax(){return this[get]('lmax')}
      set lmax(v){this[set]('lmax',v)}
      get region(){return this[get]('region')}
      set region(v){this[set]('region',v)}
      get note(){return this[get]('note')}
      set note(v){this[set]('note',v)}

      get selection_params(){return this[get]('selection_params')}
      set selection_params(v){this[get]('selection_params').load(v)}
      get specification(){return this[get]('specification')}
      set specification(v){this[get]('specification').load(v)}
    }
    
    constructors.push(DepositeSpecificationObj, DepositeSpecificationRow);
  }
  
  return constructors;
}
