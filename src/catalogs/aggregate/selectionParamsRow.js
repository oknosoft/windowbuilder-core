
let RowConstructor;

export default function selectionParamsRow({TabularSectionRow, get, set}) {
  if(!RowConstructor) {
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
      get value(){return this[get]('value')}
      set value(v){this[set]('value',v)}
      get txt_row(){return this[get]('txt_row')}
      set txt_row(v){this[set]('txt_row',v)}
    }
    RowConstructor = SelectionParamsRow;
  }
  return RowConstructor;
}
