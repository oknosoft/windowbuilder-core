
let RowConstructor;

export default function selectionParamsRow({classes, md, enm, cat, get, set}) {
  if(!RowConstructor) {
    const {TabularSectionRow} = classes;
    class SelectionParamsRow extends TabularSectionRow {
      get elm(){return this[get]('elm')}
      set elm(v){this[set]('elm',v)}
      get area(){return this[get]('area')}
      set area(v){this[set]('area',v)}
      get param(){return this[get]('param')}
      set param(v){this[set]('param',v)}
      get origin(){return this[get]('origin')}
      set origin(v){this[set]('origin',v)}
      get comparison_type(){return this[get]('comparison_type')}
      set comparison_type(v){this[set]('comparison_type',v)}
      get value(){
        const {comparison_type, txt_row} = this;
        const value = this[get]('value');

        const {comparison_types: ct} = enm;

        switch (comparison_type) {

          case ct.in:
          case ct.nin:
          case ct.lke:
          case ct.nlk:

            if(value instanceof classes.CatColorPriceGroups) {
              return value.clrs();
            }
            else if(!txt_row) {
              return value;
            }
            try {
              const arr = JSON.parse(txt_row);
              const {types, isRef} = this.type;
              if(types && isRef && arr.length) {
                let mgr;
                for(const type of types) {
                  const tmp = md.mgr(type);
                  if(tmp && arr.some(ref => tmp.byRef(ref))) {
                    mgr = tmp;
                    break;
                  }
                }
                if(!mgr) {
                  return arr;
                }
                else if(mgr === cat.colorPriceGroups) {
                  const res = [];
                  for(const ref of arr) {
                    const cg = mgr.get(ref, false);
                    if(cg) {
                      res.push(...cg.clrs());
                    }
                  }
                  return res;
                }
                return arr.map((ref) => mgr.get(ref, false)).filter(v => v && !v.empty());
              }
              return arr;
            }
            catch (err) {
              return value;
            }

          default:
            return value;
        }
      }
      set value(v){this[set]('value',v)}
      get txt_row(){return this[get]('txt_row')}
      set txt_row(v){this[set]('txt_row',v)}
      
    }
    RowConstructor = SelectionParamsRow;
  }
  return RowConstructor;
}
