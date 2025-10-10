/**
 * Дополнительные методы перечисления 'Способы расчёта количества'
 *
 * @module enm_count_calculating_ways
 *
 * Created 01.05.2022.
 */

(function({enm, cat: {clrs}, cch}){

  const {coloring, len_prm, area, arm} = enm.count_calculating_ways;
  const {new_spec_row, calc_qty_len, calc_count_area_mass} = ProductsBuilding;

  const is_side = (side) => ['_in', '_out'].includes(side);

  coloring.calculate = function ({inset, elm, row_spec, row_ins_spec, spec, ox}) {
    let {_clr, _clr_side, quantity, sz, coefficient, angle_calc_method, formula, algorithm} = row_ins_spec;
    if(!_clr) {
      _clr = elm.clr;
    }
    const prefix = _clr.area_src.valueOf();
    if(prefix) {
      const {_row} = elm;
      const nom = elm.inset === inset ? elm.nom : inset.nom(elm);
      const clr = clrs.by_predefined(row_ins_spec.clr, _clr, ox.clr, elm, spec);
            
      row_spec.clr = clr;

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
        row_spec.s = (row_spec.len * row_spec.width * (coefficient || 1)).round(4);
        
        if(algorithm.is('recipe') && clr.composition.count()) {
          for(const crow of clr.composition) {
            row_ins_spec.nom = crow.nom;
            recipe_row = new_spec_row({
              elm,
              row_base: row_ins_spec,
              origin: row_ins_spec._origin,
              specify: algorithm,
              spec,
              ox,
            });
            recipe_row.qty = quantity;
            recipe_row.len = row_spec.len;
            recipe_row.width = row_spec.width;
            recipe_row.s = row_spec.s * crow.coefficient / 100;
            calc_count_area_mass(recipe_row, spec);
          }
        }
      }
    }
    if(!row_spec.width) {
      row_spec.qty = 0;
    }
    return row_spec;
  };

  area.calculate = function ({inset, elm, row_spec, row_ins_spec}) {
    const {_row} = elm;
    const {insert_type} = inset;
    const {quantity, sz, coefficient, relm} = row_ins_spec;
    row_spec.qty = quantity;
    if(insert_type.is('mosquito')) {
      const bounds = elm.bounds_inner?.(sz) || (elm.layer ? elm.layer.bounds_inner(sz) : {height: 0, width: 0});
      row_spec.len = bounds.height * coefficient;
      row_spec.width = bounds.width * coefficient;
      row_spec.s = (row_spec.len * row_spec.width).round(4);
    }
    else if(insert_type.is('jalousie')) {
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
    else if(insert_type.is('product')) {
      const {project} = elm;
      const {width, height} = project.bounds;
      row_spec.len = width / 1000;
      row_spec.width = height / 1000;
      row_spec.s = (project.form_area - sz) * coefficient;
    }
    else if(insert_type.is('layer')) {
      const {layer} = elm;
      const {width, height} = layer.bounds;
      row_spec.len = width / 1000;
      row_spec.width = height / 1000;
      row_spec.s = (layer.form_area - sz) * coefficient;
    }
    else {
      let {x1, x2, y1, y2, s} = _row;
      if(elm instanceof EditorInvisible.Filling && relm?.irow?.region) {
        const path = elm._attr.paths?.get(relm.irow.region);
        if(path) {
          x1 = y1 = 0;
          x2 = path.bounds.width;
          y2 = path.bounds.height;
          s = x2 * y2 / 1e6;
        }
      }
      row_spec.len = (y2 - y1 - sz) * coefficient;
      row_spec.width = (x2 - x1 - sz) * coefficient;
      row_spec.s = s;
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

  arm.calculate = function ({elm, row_spec, row_ins_spec, len_angl}) {
    const {nom, rays: {b, e, inner, outer}} = elm;
    const {quantity, sz, coefficient} = row_ins_spec;
    row_spec.qty = quantity;
    const prop = cch.properties.predefined('arm_coffer'),
      delta = 5.5,
      bNom = b.profile?.nom,
      eNom = e.profile?.nom,
      coffer = nom._extra(prop) || (nom.sizefaltz + delta),
      ray = inner.equidistant(-coffer),
      bInner = b.profile ? elm.cnn_side(b.profile).is('inner') : true,
      eInner = e.profile ? elm.cnn_side(e.profile).is('inner') : true,
      bad = b.cnn?.cnn_type?.is('ad'),
      ead = e.cnn?.cnn_type?.is('ad'),
      bCoffer = (bad && bNom) ? (bNom._extra(prop) || (bNom.sizefaltz + delta)) : 0,
      eCoffer = (ead && eNom) ? (eNom._extra(prop) || (eNom.sizefaltz + delta)) : 0;
    let bRay = bad ? (bInner ? b.profile.rays.inner : b.profile.rays.outer) : new paper.Path({
        insert: false,
        segments: [elm.corns(4), elm.corns(1)],
      }).elongation(200),
      eRay = ead ? (eInner ? e.profile.rays.inner : e.profile.rays.outer) : new paper.Path({
        insert: false,
        segments: [elm.corns(2), elm.corns(3)],
      }).elongation(200);
    if(!bInner) {
      bRay.reverse();
    }
    if(!eInner) {
      eRay.reverse();
    }
    if(bad && !b.profile.is_linear()) {
      const offset = bRay.getOffsetOf(bRay.getNearestPoint(elm.b));
      const loc = bRay.getLocationAt(offset + 20);
      const tg = loc.tangent.multiply(600);
      bRay = new paper.Path({
        insert: false,
        segments: [loc.point.subtract(tg), loc.point.add(tg)],
      });
    }
    if(ead && !e.profile.is_linear()) {
      const offset = eRay.getOffsetOf(eRay.getNearestPoint(elm.e));
      const loc = eRay.getLocationAt(offset - 20);
      const tg = loc.tangent.multiply(600);
      eRay = new paper.Path({
        insert: false,
        segments: [loc.point.subtract(tg), loc.point.add(tg)],
      });
    }
    const bPoint = ray.intersect_point(bRay.equidistant(-bCoffer)),
      ePoint = ray.intersect_point(eRay.equidistant(-eCoffer)),
      sub = ray.get_subpath(bPoint, ePoint);
    row_spec.len = (sub.length - 2 * sz) * coefficient;
    return row_spec;
  }

})($p);
