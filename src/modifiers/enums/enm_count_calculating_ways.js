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

  const is_side = (side) => ['_in', '_out'].includes(side);

  coloring.calculate = function ({inset, elm, row_spec, row_ins_spec, spec, ox}) {
    let {_clr, _clr_side, quantity, sz, coefficient, angle_calc_method, formula} = row_ins_spec;
    if(!_clr) {
      _clr = elm.clr;
    }
    const prefix = _clr.area_src.valueOf();
    if(prefix) {
      const {_row} = elm;
      const nom = elm.inset === inset ? elm.nom : inset.nom(elm);
      row_spec.clr = clrs.by_predefined(row_ins_spec.clr, _clr, ox.clr, elm, spec);

      if(is_side(_clr_side)) {
        row_spec.width = nom._extra(prefix + _clr_side);
      }
      else {
        const areas = [nom._extra(prefix) || 0, nom._extra(prefix + '_in') || 0, nom._extra(prefix + '_out') || 0];
        row_spec.width = areas[0] || (areas[1] + areas[2]);
      }
      if(row_spec.width) {
        row_spec.qty = quantity;
        row_spec.len = (elm.length / 1000).round(3);
        row_spec.s = row_spec.len * row_spec.width * (coefficient || 1);
      }
    }
    if(!row_spec.width) {
      row_spec.qty = 0;
    }
    return row_spec;
  };

  area.calculate = function ({inset, elm, row_spec, row_ins_spec}) {
    const {_row} = elm;
    const {quantity, sz, coefficient} = row_ins_spec;
    row_spec.qty = quantity;
    if(inset.insert_type == enm.inserts_types.mosquito) {
      const bounds = elm.layer ? elm.layer.bounds_inner(sz) : elm.bounds_inner(sz);
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
    else if(inset.insert_type == enm.inserts_types.product) {
      const {project} = elm;
      const {width, height} = project.bounds;
      row_spec.len = width / 1000;
      row_spec.width = height / 1000;
      row_spec.s = (project.form_area - sz) * coefficient;
    }
    else if(inset.insert_type == enm.inserts_types.layer) {
      const {layer} = elm;
      const {width, height} = layer.bounds;
      row_spec.len = width / 1000;
      row_spec.width = height / 1000;
      row_spec.s = (layer.form_area - sz) * coefficient;
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
