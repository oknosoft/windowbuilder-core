/**
 * Дополнительные методы перечисления 'Способы расчёта количества'
 *
 * @module enm_count_calculating_ways
 *
 * Created 01.05.2022.
 */

(function({enm, cat: {clrs}, cch}){

  const {coloring, len_prm, area} = enm.count_calculating_ways;
  const {new_spec_row, calc_qty_len, calc_count_area_mass} = ProductsBuilding;

  // {inset, elm, row_spec, row_ins_spec, origin, spec, ox, len_angl}

  coloring.calculate = function ({inset, elm, row_ins_spec, origin, spec, ox, len_angl}) {
    const {clr: {clr_in, clr_out}, nom} = elm;
    let row_spec = new_spec_row({elm, row_base: row_ins_spec, origin, spec, ox, len_angl});
    if(clr_in === clr_out || row_ins_spec.clr === clrs.predefined('БезЦвета')) {
      row_spec.clr = clrs.by_predefined(row_ins_spec.clr, elm.clr, ox.clr, elm, spec);
    }
    else {
      row_spec.clr = clrs.by_predefined(row_ins_spec.clr, clr_in, ox.clr, elm, spec);

      row_spec = new_spec_row({elm, row_base: row_ins_spec, origin, spec, ox, len_angl});
      row_spec.clr = clrs.by_predefined(row_ins_spec.clr, clr_out, ox.clr, elm, spec);
    }
  };

  area.calculate = function ({inset, elm, row_spec, row_ins_spec}) {
    const {_row} = elm;
    const {quantity, sz, coefficient} = row_ins_spec;
    row_spec.qty = quantity;
    if(inset.insert_type == enm.inserts_types.mosquito) {
      const bounds = elm.layer.bounds_inner(sz);
      row_spec.len = bounds.height * coefficient;
      row_spec.width = bounds.width * coefficient;
      row_spec.s = (row_spec.len * row_spec.width).round(4);
    }
    else if(inset.insert_type == enm.inserts_types.jalousie) {
      if(elm.bounds_light) {
        const bounds = elm.bounds_light();
        row_spec.len = (bounds.height + offsets) * coefficient;
        row_spec.width = (bounds.width + sz) * coefficient;
      }
      else {
        row_spec.len = elm.len * coefficient;
        row_spec.width = elm.height * coefficient;
      }
      row_spec.s = (row_spec.len * row_spec.width).round(4);
    }
    else {
      row_spec.len = (_row.y2 - _row.y1 - sz) * coefficient;
      row_spec.width = (_row.x2 - _row.x1 - sz) * coefficient;
      row_spec.s = _row.s;
    }
    return row_spec;
  };

  len_prm.calculate = function ({inset, elm, row_spec, row_ins_spec, origin}) {
    let len = 0;

    inset.selection_params.find_rows({elm: row_ins_spec.elm}, (prm_row) => {
      const {param} = prm_row;
      if(param.type.digits) {
        len = elm.layer.extract_pvalue({param, cnstr: 0, elm, origin, prm_row})
      }
      if(len) return false;
    });
    const {quantity, sz, coefficient} = row_ins_spec;
    row_spec.qty = quantity;
    row_spec.len = len ? (len - sz) * coefficient : 0;
    row_spec.width = 0;
    row_spec.s = 0;
    return row_spec;
  };

})($p);
