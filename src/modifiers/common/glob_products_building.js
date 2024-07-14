
/**
 * Аналог УПзП-шного __ПостроительИзделийСервер__
 *
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module  glob_products_building
 * Created 26.05.2015
 */

class ProductsBuilding {

  constructor(listen) {

    let added_cnn_spec,
      ox,
      spec,
      constructions,
      coordinates,
      cnn_elmnts,
      glass_specification,
      params;

    //this._editor_invisible = null;


    /**
     * СтрокаСоединений
     * @param elm1
     * @param elm2
     * @return {Number|DataObj}
     */
    function cnn_row(elm1, elm2, cnn) {
      const {cnn_nodes} = ProductsBuilding;
      let res = cnn_elmnts.find_rows({elm1: elm1, elm2: elm2, node1: cnn_nodes, node2: cnn_nodes});
      if(res.length) {
        return res[0].row;
      }
      res = cnn_elmnts.find_rows({elm1: elm2, elm2: elm1, node1: {in: cnn_nodes}, node2: {in: cnn_nodes}});
      return res.length ? res[0].row : (cnn || 0);
    }

    /**
     * НадоДобавитьСпецификациюСоединения
     * @param cnn
     * @param elm1
     * @param elm2
     */
    function cnn_need_add_spec(cnn, elm1, elm2, point) {
      const {short, long, t, xx} = $p.enm.cnn_types;
      const cnn_type = cnn && cnn.cnn_type;
      // соединения крест в стык обрабатываем по координатам, остальные - по паре элементов
      if(cnn_type === xx) {
        if(!added_cnn_spec.points) {
          added_cnn_spec.points = [];
        }
        for (let p of added_cnn_spec.points) {
          if(p.is_nearest(point, true)) {
            return false;
          }
        }
        added_cnn_spec.points.push(point);
        return true;
      }
      else if(cnn_type === t || cnn_type === long || cnn_type === short) {
        return true;
      }
      else if(!cnn || !elm1 || !elm2 || added_cnn_spec[elm1] == elm2 || added_cnn_spec[elm2] == elm1) {
        return false;
      }
      added_cnn_spec[elm1] = elm2;
      return true;
    }


    /**
     * ДополнитьСпецификациюСпецификациейСоединения
     * @param {CatCnns} cnn
     * @param {BuilderElement} elm
     * @param {Object} len_angl
     * @param {CatCnns} [cnn_other]
     * @param {BuilderElement} [elm2]
     */
    function cnn_add_spec(cnn, elm, len_angl, cnn_other, elm2) {
      if(!cnn) {
        return;
      }
      cnn.calculate_spec({elm, elm2, len_angl, cnn_other, ox, spec});
    }

    /**
     * Спецификации фурнитуры
     * @param contour {Contour}
     */
    function furn_spec(contour) {

      const {ContourNested} = EditorInvisible;
      // у рамных контуров и вложенных изделий, фурнитуры не бывает
      if(!contour.parent || contour instanceof ContourNested || contour.parent instanceof ContourNested || contour._ox !== spec._owner) {
        return false;
      }

      // кеш сторон фурнитуры
      const {furn_cache, furn} = contour;
      const {new_spec_row, calc_count_area_mass} = ProductsBuilding;

      // проверяем, подходит ли фурнитура под геометрию контура
      if(!furn_cache.profiles.length || !furn_check_opening_restrictions(contour, furn_cache)) {
        return;
      }

      // уточняем высоту ручки, т.к. от неё зависят координаты в спецификации
      contour.update_handle_height(furn_cache);

      // получаем спецификацию фурнитуры и переносим её в спецификацию изделия
      const blank_clr = $p.cat.clrs.get();
      const {cnstr, furn_set, weight} = contour;
      furn_set.get_spec(contour, furn_cache).forEach((row) => {
        const elm = {elm: -cnstr, clr: blank_clr};
        const row_spec = new_spec_row({elm, row_base: row, origin: row.origin, specify: row.specify, spec, ox});

        if(row.is_procedure_row) {
          row_spec.elm = row.handle_height_min;
          row_spec.len = row.coefficient / 1000;
          row_spec.qty = 0;
          if(row.quantity && row.nom.demand.count()) {
            row_spec.totqty = row.quantity;
            row_spec.totqty1 = row.quantity;
          }
          else {
            row_spec.totqty = 1;
            row_spec.totqty1 = 1;
          }
        }
        else if((!row.contraction_option.empty() || row.contraction || row.coefficient) && !row.nom.is_pieces) {
          const {ФиксированнаяДлина, ОтВысотыРучки, ОтДлиныСтороныМинусВысотыРучки, Выражение} = row.contraction_option._manager;
          const profile = contour.profile_by_furn_side(row.side, furn_cache);
          const len = profile ? profile._row.len : 0;
          const coefficient = row.coefficient || 0.001;

          switch (row.contraction_option) {
          case ФиксированнаяДлина:
            row_spec.len = row.contraction * coefficient;
            break;
          case ОтВысотыРучки:
            row_spec.len = (contour.h_ruch - row.contraction) * coefficient;
            break;
          case ОтДлиныСтороныМинусВысотыРучки:
            row_spec.len = (len - contour.h_ruch - row.contraction) * coefficient;
            break;
          case Выражение:
            if(typeof row.contraction === 'string') {
              try {
                row_spec.len = eval(row.contraction) * coefficient;
                break;
              }
              catch (e) {}
            }
          default:
            row_spec.len = (len - row.contraction) * coefficient;
          }
          row_spec.qty = row.quantity;
          calc_count_area_mass(row_spec, spec);
        }
        else {
          row_spec.qty = row.quantity * (!row.coefficient ? 1 : row.coefficient);
          calc_count_area_mass(row_spec, spec);
        }
      });

      // если задано ограничение по массе - проверяем
      if(furn_set.flap_weight_max && weight > furn_set.flap_weight_max) {
        // Визуализируем все стороны
        const row_base = {clr: blank_clr, nom: $p.job_prm.nom.flap_weight_max};
        contour.profiles.forEach(elm => {
          new_spec_row({elm, row_base, origin: furn, spec, ox});
        });
      }

      // ограничения размеров по графикам
      // const checks = ox.sys.graph_restrictions(new paper.Point(contour.bounds.width, contour.bounds.height).divide(10), contour.is_clr());
      // if(Object.keys(checks)) {
      //   console.table(checks);
      // }
    }

    /**
     * Проверяет ограничения открывания, добавляет визуализацию ошибок
     * @param contour {Contour}
     * @param cache {Object}
     * @return {boolean}
     */
    function furn_check_opening_restrictions(contour, cache) {
      const err = contour.open_restrictions_err({cache});
      if(err.length) {
        const {new_spec_row} = ProductsBuilding;
        const {cat: {clrs}, job_prm: {nom}} = $p;
        const row_base = {clr: clrs.get(), nom: nom.furn_error};
        err.forEach(elm => {
          new_spec_row({elm, row_base, origin: contour.furn, spec, ox});
        });
        return false;
      }
      return true;
    }

    /**
     * Спецификации соединений примыкающих профилей
     * @param elm {Profile}
     */
    function cnn_spec_nearest(elm) {
      const nearest = elm.nearest();
      const {_attr} = elm;
      const {cat: {clrs}, cch, job_prm: {nom}, msg} = $p;
      if(nearest && nearest._row.clr != clrs.ignored()) {
        if(_attr._nearest_cnn) {
          cnn_add_spec(_attr._nearest_cnn, elm, {
            angle: 0,
            alp1: 0,
            alp2: 0,
            len: elm._row.len,
            origin: cnn_row(elm.elm, nearest.elm, _attr._nearest_cnn)
          }, null, nearest);
        }
        else {
          let enom = nom.cnn_ii_error || nom.info_error;
          if(nearest instanceof ProfileVirtual && nom.cnn_vii_error) {
            enom = nom.cnn_vii_error;
          }          
          elm.err_spec_row(enom, `${msg.err_no_cnn} элементов №${elm.elm} ${elm.nom.article} и №${
            nearest.elm} ${nearest.nom.article}`, elm.inset);
        }        
      }
    }

    /**
     * Спецификация профиля
     * @param elm {Profile}
     */
    function base_spec_profile(elm, totqty0) {

      const {_row, _attr, rays, layer, segms, inset} = elm;
      const {enm: {
        angle_calculating_ways,
        cnn_types,
        predefined_formulas: {w2},
        specification_order_row_types: {Продукция},
      }, cat, utils: {blank}} = $p;
      if(_row.nom.empty() || _row.nom.is_service || _row.nom.is_procedure || _row.clr == cat.clrs.ignored()) {
        return;
      }

      const len_angl = {
        angle: 0,
        len: _row.len,
        art1: false,
        art2: true,
        node: 'e',
      };

      // во время расчетов возможна подмена объекта спецификации
      const spec_tmp0 = spec;
      if(inset.is_order_row_prod({ox, elm})) {
        const prow = inset.specification.find({quantity: 0, is_order_row: Продукция});
        const nom = prow ? prow.nom : elm.nom;
        const attrs = {
          calc_order: ox.calc_order,
          nom,
          owner: nom,
          clr: elm.clr,
          s: 0,
          x: _row.len,
          y: 0,
          origin: inset,
        };
        const cx = Object.assign(ox.find_create_cx(elm.elm, blank.guid), attrs);
        ox._order_rows.push(cx);
        spec = cx.specification.clear();
      }

      if(segms?.length) {
        // если профиль разбит на связки, добавляем их спецификации, вместо спецификации самого профиля
        segms.forEach(base_spec_profile);
      }
      else {
        const {b, e} = rays;

        if(!b.cnn || !e.cnn) {
          return;
        }
        elm.check_err();
        b.check_err();
        e.check_err();

        const prev = b.profile;
        const next = e.profile;
        const row_cnn_prev = b.cnn && b.cnn.main_row(elm);
        const row_cnn_next = e.cnn && e.cnn.main_row(elm);
        const {new_spec_row, calc_count_area_mass} = ProductsBuilding;

        // добавляем строку спецификации
        const row_cnn = row_cnn_prev || row_cnn_next;
        _attr.row_spec = null;
        const row_spec = new_spec_row({
          elm,
          row_base: row_cnn,
          nom: _row.nom,
          origin: cnn_row(_row.elm, prev ? prev.elm : 0, b.cnn || e.cnn),
          spec,
          ox,
        });
        _attr.row_spec = row_spec;
        row_spec.qty = row_cnn ? row_cnn.quantity : 1;

        // уточняем размер
        const seam = angle_calculating_ways.СварнойШов;
        const d45 = Math.sin(Math.PI / 4);
        const dprev = row_cnn_prev ? (
          row_cnn_prev.angle_calc_method == seam && _row.alp1 > 0 ? row_cnn_prev.sz * d45 / Math.sin(_row.alp1 / 180 * Math.PI) : row_cnn_prev.sz
        ) : 0;
        const dnext = row_cnn_next ? (
          row_cnn_next.angle_calc_method == seam && _row.alp2 > 0 ? row_cnn_next.sz * d45 / Math.sin(_row.alp2 / 180 * Math.PI) : row_cnn_next.sz
        ) : 0;

        const k001 = 0.001;
        row_spec.len = (_row.len - dprev - dnext)
          * ((row_cnn_prev ? row_cnn_prev.coefficient : k001) + (row_cnn_next ? row_cnn_next.coefficient : k001)) / 2;
        if(row_cnn_prev && row_cnn_prev.algorithm === w2) {
          row_spec.len += prev.width * k001;
        }
        if(row_cnn_next && row_cnn_next.algorithm === w2) {
          row_spec.len += next.width * k001;
        }

        // profile._row._len - геометрический размер
        // profile._attr._len - то, что получится после обработки
        // row_spec.len - сколько взять (отрезать)
        elm._attr._len = (_row.len
            - (!row_cnn_prev || row_cnn_prev.angle_calc_method == seam ? 0 : row_cnn_prev.sz)
            - (!row_cnn_next || row_cnn_next.angle_calc_method == seam ? 0 : row_cnn_next.sz))
          * 1000 * ( (row_cnn_prev ? row_cnn_prev.coefficient : k001) + (row_cnn_next ? row_cnn_next.coefficient : k001)) / 2;

        // припуск для гнутых элементов
        if(!elm.is_linear()) {
          row_spec.len = row_spec.len + _row.nom.arc_elongation * k001;
        }

        // дополнительная корректировка формулой - здесь можно изменить размер, номенклатуру и вообще, что угодно в спецификации
        if(row_cnn_prev && !row_cnn_prev.formula.empty()) {
          row_cnn_prev.formula.execute({
            ox: ox,
            elm: elm,
            cnstr: 0,
            inset: blank.guid,
            row_cnn: row_cnn_prev,
            row_spec: row_spec
          });
        }
          else if(row_cnn_next && !row_cnn_next.formula.empty()) {
          row_cnn_next.formula.execute({
            ox: ox,
            elm: elm,
            cnstr: 0,
            inset: blank.guid,
            row_cnn: row_cnn_next,
            row_spec: row_spec
          });
        }

        // РассчитатьКоличествоПлощадьМассу
        const {СоединениеПополам: s2, Соединение: s1} = angle_calculating_ways;
        let acmethod_prev = row_cnn_prev ? row_cnn_prev.angle_calc_method : null;
        let acmethod_next = row_cnn_next ? row_cnn_next.angle_calc_method : null;
        let {alp1, alp2} = _row;
        if(acmethod_prev == s2 || acmethod_prev == s1) {
          alp1 = prev?.generatrix?.angle_between(elm.generatrix, b.point);
        }
        if(acmethod_next == s2 || acmethod_next == s1) {
          alp2 = elm.generatrix.angle_between(next?.generatrix, e.point);
        }
        if([1, 3].includes(inset.flipped)) {
          alp1 = 180 - alp1;
          alp2 = 180 - alp2;
        }
        if([2, 3].includes(inset.flipped)) {
          [alp1, alp2] = [alp2, alp1];
          [acmethod_prev, acmethod_next] = [acmethod_next, acmethod_prev];
        }
        calc_count_area_mass(
          row_spec,
          spec,
          {alp1, alp2},
          acmethod_prev,
          acmethod_next,
          alp1,
          alp2,
          totqty0,
        );

        // добавляем спецификации соединений
        len_angl.len = row_spec.len * 1000;
        len_angl.alp1 = prev ? prev.generatrix.angle_between(elm.generatrix, elm.b) : 90;
        len_angl.alp2 = next ? elm.generatrix.angle_between(next.generatrix, elm.e) : 90;
        const sl_types = [cnn_types.long, cnn_types.short];
        const other_side_types = [cnn_types.t, cnn_types.i, cnn_types.xx, ...sl_types];
        if(cnn_need_add_spec(b.cnn, _row.elm, prev ? prev.elm : 0, b.point)) {

          len_angl.angle = len_angl.alp2;

          // для ТОбразного, Незамкнутого контура и short-long, надо рассчитать еще и с другой стороны
          if(e.cnn && sl_types.includes(e.cnn.cnn_type)) {
            cnn_add_spec(e.cnn, elm, len_angl, b.cnn, next);
          }
          else if(other_side_types.includes(b.cnn.cnn_type)) {
            if(!other_side_types.includes(e.cnn.cnn_type) || cnn_need_add_spec(e.cnn, next ? next.elm : 0, _row.elm, e.point)) {
              cnn_add_spec(e.cnn, elm, len_angl, b.cnn, next);
            }
          }
          else {
            // для угловых, добавляем из e.cnn строки с {art2: true}, а для внешних с {art2: false}
            if(!e.profile_point || (next.rays[e.profile_point] && next.rays[e.profile_point].profile !== elm)) {
              len_angl.art2 = false;
              len_angl.art1 = true;
            }
            cnn_add_spec(e.cnn, elm, len_angl, b.cnn, next);
          }

          // спецификацию с предыдущей стороны рассчитваем всегда
          len_angl.angle = len_angl.alp1;
          len_angl.art2 = false;
          len_angl.art1 = true;
          len_angl.node = 'b';
          cnn_add_spec(b.cnn, elm, len_angl, e.cnn, prev);
        }

        // спецификация вставки
        inset.calculate_spec({elm, ox, spec});
      }

      // если у профиля есть примыкающий родительский элемент, добавим спецификацию II соединения
      cnn_spec_nearest(elm);

      // возвращаем указатель на спецификацию на место
      spec = spec_tmp0;

      // если у профиля есть доборы, добавляем их спецификации
      elm.addls.forEach(base_spec_profile);

      // если у профиля есть примыкания, добавляем их спецификации
      elm.adjoinings.forEach(base_spec_profile);

      // спецификация вложенных в элемент вставок
      // во время расчетов возможна подмена объекта спецификации
      const spec_tmp = spec;
      ox.inserts.find_rows({cnstr: -elm.elm}, ({inset, clr}) => {

        // если во вставке указано создавать продукцию, создаём
        if(inset.is_order_row_prod({ox, elm})) {
          const cx = Object.assign(ox.find_create_cx(elm.elm, inset.ref), inset.contour_attrs(elm.layer));
          ox._order_rows.push(cx);
          spec = cx.specification.clear();
        }
        else {
          spec = spec_tmp;
        }

        len_angl.origin = inset;
        len_angl.angle = elm.angle_hor;
        len_angl.cnstr = -elm.elm;
        delete len_angl.art1;
        delete len_angl.art2;
        delete len_angl.node;
        inset.calculate_spec({elm, clr, len_angl, ox, spec});
      });
      spec = spec_tmp;
    }

    /**
     * Спецификация сечения (водоотлива)
     * @param elm {Sectional}
     */
    function base_spec_sectional(elm) {

      const {_row, _attr, inset, layer} = elm;

      if(_row.nom.empty() || _row.nom.is_service || _row.nom.is_procedure || _row.clr == $p.cat.clrs.ignored()) {
        return;
      }

      // спецификация вставки
      inset.calculate_spec({elm, ox});

      // спецификация вложенных в элемент вставок
      // во время расчетов возможна подмена объекта спецификации
      const spec_tmp = spec;
      ox.inserts.find_rows({cnstr: -elm.elm}, ({inset, clr}) => {

        // если во вставке указано создавать продукцию, создаём
        if(inset.is_order_row_prod({ox, elm})) {
          const cx = Object.assign(ox.find_create_cx(elm.elm, inset.ref), inset.contour_attrs(layer));
          ox._order_rows.push(cx);
          spec = cx.specification.clear();
        }
        else {
          spec = spec_tmp;
        }

        // рассчитаем спецификацию вставки
        const len_angl = {
          angle: 0,
          alp1: 0,
          alp2: 0,
          len: 0,
          origin: inset,
          cnstr: -elm.elm
        };
        inset.calculate_spec({elm, len_angl, ox, spec});

      });

      // восстанавливаем исходную ссылку объекта спецификации
      spec = spec_tmp;

    }

    /**
     * Спецификация заполнения
     * @param elm {Filling}
     */
    function base_spec_glass(elm) {

      const {profiles, imposts, inset, _row} = elm;
      const {utils: {blank}, cat: {clrs}, cch, job_prm: {nom}, msg} = $p;

      if(_row.clr == clrs.ignored()) {
        return;
      }

      const glength = profiles.length;

      // для всех рёбер заполнения
      for (let i = 0; i < glength; i++) {
        const curr = profiles[i];

        if(curr.profile && curr.profile._row.clr == clrs.ignored()) {
          return;
        }

        const prev = (i == 0 ? profiles[glength - 1] : profiles[i - 1]);
        const next = (i == glength - 1 ? profiles[0] : profiles[i + 1]);
        const row_cnn = cnn_elmnts.find({elm1: _row.elm, elm2: curr.profile.elm});

        let angle_hor = (new paper.Point(curr.e.x - curr.b.x, curr.b.y - curr.e.y)).angle.round(2);
        if(angle_hor < 0) {
          angle_hor += 360;
        }

        const len_angl = {
          angle_hor,
          angle: 0,
          alp1: prev.sub_path.angle_between(curr.sub_path, curr.b),
          alp2: curr.sub_path.angle_between(next.sub_path, curr.e),
          len: row_cnn ? row_cnn.aperture_len : 0,
          origin: cnn_row(_row.elm, curr.profile.elm),
          prev,
          next,
          curr,
        };

        // добавляем спецификацию соединения рёбер заполнения с профилем
        (len_angl.len > 3) && cnn_add_spec(curr.cnn, curr.profile, len_angl, null, elm);

        // строка ошибки ii соединения
        if(!row_cnn) {
          elm.err_spec_row(nom.cnn_ii_error || nom.info_error, msg.err_no_cnn, inset);
        }

      }

      // во время расчетов возможна подмена объекта спецификации
      const spec_tmp0 = spec;
      let spec_tmp = spec;
      if(inset.is_order_row_prod({ox, elm})) {
        const {bounds} = elm;
        const attrs = {
          calc_order: ox.calc_order,
          owner: elm.nom,
          clr: elm.clr,
          s: elm.area,
          x: bounds.width,
          y: bounds.height,
        };
        const cx = Object.assign(ox.find_create_cx(elm.elm, blank.guid), attrs);
        ox._order_rows.push(cx);
        spec = cx.specification.clear();
      }

      // учтём параметр without_glasses
      const param = cch.properties.predefined('without_glasses');
      const totqty0 = Boolean(param && ox.params.find({param, value: true}));

      // добавляем спецификацию вставки в заполнение
      inset.calculate_spec({elm, ox, spec, totqty0});

      // для всех раскладок заполнения
      for(const lay of imposts) {
        base_spec_profile(lay, totqty0)
      }

      // спецификация вложенных в элемент вставок
      ox.inserts.find_rows({cnstr: -elm.elm}, ({inset, clr}) => {
        // если во вставке указано создавать продукцию, создаём
        const len_angl = {
          angle: 0,
          alp1: 0,
          alp2: 0,
          len: 0,
          origin: inset,
          cnstr: -elm.elm
        };
        if(inset.is_order_row_prod({ox, elm})) {
          const cx = Object.assign(ox.find_create_cx(elm.elm, inset.ref), inset.contour_attrs(elm.layer));
          ox._order_rows.push(cx);
          spec = cx.specification.clear();
        }
        else {
          spec = spec_tmp;
        }
        inset.calculate_spec({elm, len_angl, ox, spec, totqty0});
      });

      // возвращаем указатель на спецификацию на место
      spec = spec_tmp0;
    }


    /**
     * Спецификация вставок в контур
     * @param contour
     */
    function inset_contour_spec(contour) {

      // во время расчетов возможна подмена объекта спецификации
      const spec_tmp = spec;

      ox.inserts.find_rows({cnstr: contour.cnstr}, ({inset, clr}) => {

        // если во вставке указано создавать продукцию, создаём
        if(inset.is_order_row_prod({ox, contour})) {
          const cx = Object.assign(ox.find_create_cx(-contour.cnstr, inset.ref), inset.contour_attrs(contour));
          ox._order_rows.push(cx);
          spec = cx.specification.clear();
        }
        else {
          spec = spec_tmp;
        }

        // рассчитаем спецификацию вставки
        const elm = {
          _row: {},
          elm: 0,
          clr: clr,
          layer: contour,
        };
        const len_angl = {
          angle: 0,
          alp1: 0,
          alp2: 0,
          len: 0,
          origin: inset,
          cnstr: contour.cnstr
        };
        inset.calculate_spec({elm, len_angl, ox, spec, clr});

      });

      // восстанавливаем исходную ссылку объекта спецификации
      spec = spec_tmp;
    }

    /**
     * Основная cпецификация по соединениям и вставкам таблицы координат
     * @param scheme {Scheme}
     */
    function base_spec(scheme) {

      const {Contour, Filling, Sectional, Profile, ProfileParent, ProfileConnective} = $p.Editor;

      // сбрасываем структуру обработанных соединений
      added_cnn_spec = {};

      // во время расчетов возможна подмена объекта спецификации
      const spec_tmp = spec;
      function prod_row(contour) {
        // если текущий слой должен формировать виртуальное изделие - создаём
        const layer = contour.prod_layer();
        if(layer) {
          const cx = ox.find_create_cx(-layer.cnstr, null, true, ox._order_rows);
          spec = cx.specification;
          if(!spec.count()) {
            cx.sys = ox.sys;
            cx.clr = ox.clr;
            const {bounds} = layer;
            cx.x = bounds.width;
            cx.y = bounds.height;
            cx.s = (bounds.area / 1e6).round(4);
            cx.calc_order_row.nom = cx.prod_nom;
            cx.calc_order_row.ordn = ox;
            cx.prod_name();
            if(contour === layer) {
              cx.svg = layer.get_svg();
            }
          }
        }
      }

      // для всех контуров изделия
      const contours = scheme.getItems({class: Contour});
      for (const contour of contours.reverse()) {

        // пропускаем слои вложенных изделий
        if(contour._ox !== ox) {
          continue;
        }

        prod_row(contour);

        // для всех профилей контура
        for (const elm of contour.profiles) {
          !elm.virtual && base_spec_profile(elm);
        }
        // для всех заполнений контура
        for (const elm of contour.glasses(false, true)) {
          !elm.virtual && base_spec_glass(elm);
        }
        // для всех разрезов (водоотливов)
        for (const elm of contour.sectionals) {
          !elm.virtual && base_spec_sectional(elm);
        }
        
        for (const elm of contour.children) {
          if(elm instanceof ProfileGlBead) {
            // для всех штапиков
            base_spec_profile(elm);
          }
          else if(elm instanceof Compound) {
            // для всех поверхностей (составных путей)
            //base_spec_glass(elm);
          }
        }

        // спецификация вставок в контур
        inset_contour_spec(contour);

        // восстанавливаем исходную ссылку объекта спецификации
        spec = spec_tmp;
      }

      // фурнитуру обсчитываем в отдельном цикле, т.к. могут потребоваться свойства соседних слоёв
      for (const contour of contours) {
        prod_row(contour);
        furn_spec(contour);
        // восстанавливаем исходную ссылку объекта спецификации
        spec = spec_tmp;
      }

      // для всех соединительных профилей
      for (const elm of scheme.l_connective.children) {
        if(elm instanceof ProfileConnective) {
          base_spec_profile(elm);
        }
      }

      // спецификация вставок в изделие
      inset_contour_spec({
        cnstr: 0,
        project: scheme,
        get perimeter() {
          return this.project.perimeter;
        },
        glasses() {
          return this.project.glasses;
        }
      });

    }

    this.cnn_add_spec = cnn_add_spec;

    /**
     * Пересчет спецификации при записи изделия
     */
    this.recalc = function recalc(scheme, attr) {

      // console.time('base_spec');
      // console.profile();

      // ссылки для быстрого доступа к свойствам объекта продукции
      ox = scheme.ox;
      spec = ox.specification;
      constructions = ox.constructions;
      coordinates = ox.coordinates;
      cnn_elmnts = ox.cnn_elmnts;
      glass_specification = ox.glass_specification;
      params = ox.params;

      // чистим спецификацию и возможные аксессуары
      spec.clear();
      ox.calc_order.accessories('clear', ox);

      // массив продукций к добавлению в заказ
      ox._order_rows = [];

      // рассчитываем базовую сецификацию
      base_spec(scheme);

      // сворачиваем
      spec.group_by('nom,clr,characteristic,len,width,s,elm,alp1,alp2,origin,specify,stage,dop', 'qty,totqty,totqty1');


      // console.timeEnd('base_spec');
      // console.profileEnd();

      // информируем мир об окончании расчета координат
      scheme.draw_visualization();
      Promise.resolve()
        .then(() => scheme._scope && !attr.silent && scheme._scope.eve.emit('coordinates_calculated', scheme, attr));


      // производим корректировку спецификации с возможным вытягиванием строк в заказ и удалением строк из заказа
      // внутри корректировки будут рассчитаны цены продажи и плановой себестоимости
      if(ox.calc_order_row) {
        $p.spec_building.specification_adjustment({
          scheme: scheme,
          calc_order_row: ox.calc_order_row,
          spec: spec,
        }, true);
        if(attr.save) {
          ox.calc_order_row.s = ox.s;
        }
        // взводим в заказе признак изменённости продукции, чтобы пересчитать перед записью заказа вставки в заказ
        ox.calc_order._data._sub_recalc = true;
      }

      // информируем мир о завершении пересчета
      if(attr.snapshot) {
        scheme.notify(scheme, 'scheme_snapshot', attr);
      }

      function finish() {
        delete scheme._attr._saving;
        ox._data._loading = false;
      }

      // информируем мир о записи продукции
      if(attr.save) {

        // сохраняем картинку вместе с изделием
        if(attr.svg !== false) {
          ox.svg = scheme.get_svg();
        }

        return this.saver({ox, scheme, attr, finish})
          .catch((err) => {

            finish();

            if(err.msg && err.msg._shown) {
              return;
            }

            let text = err.message || err;
            if(ox._data && ox._data._err) {
              if(typeof ox._data._err === 'object') {
                !attr.silent && $p.md.emit('alert', Object.assign({obj: ox}, ox._data._err));
                delete ox._data._err;
                return;
              }
              text += `\n${ox._data._err}`;
              delete ox._data._err;
            }

            if(!attr.silent) {
              if(err.type && err.text && err.title) {
                $p.md.emit('alert', err);
              }
              else {
                $p.md.emit('alert', {type: 'alert-error', obj: ox, text});
              }
            }

          });
      }
      else {
        return Promise.resolve(finish());
      }

    };

  }

  /**
   * Выделяем сохранялку продукции в отдельный метод
   * чтобы его было проще переопределить снаружи
   */
  saver({ox, scheme, attr, finish}) {
    const {calc_order, _order_rows} = ox;
    let res = Promise.resolve();
    for (const cx of (_order_rows || [])) {
      if(cx.origin?.insert_type?.is?.('mosquito')) {
        res = res
          .then(() => cx.draw())
          .then((img) => {
            const {imgs} = Object.values(img)[0];
            cx.svg = imgs.s0; 
          })
          .catch(() => null);
      }
    }
    calc_order.characteristic_saved(scheme, attr);
    if(attr.save !== 'recalc') {
      res = res.then(() => {
        return calc_order.save();
      });
    }
    return res.then(() => {
        finish();
        scheme._scope && !attr.silent && scheme._scope.eve.emit('characteristic_saved', scheme, attr);
      })
      .then(() => {
        return ox;
      });
  }

  /**
   * Проверяет соответствие параметров отбора параметрам изделия
   * @param params {TabularSection} - табчасть параметров вставки или соединения
   * @param row_spec {TabularSectionRow}
   * @param [count_calc_method] {EnumObj.<count_calculating_ways>} - способ расчёта количества
   * @param elm {BuilderElement}
   * @param [cnstr] {Number} - номер конструкции или элемента
   * @return {boolean}
   */
  static check_params({params, row_spec, count_calc_method, ...other}) {

    let ok = true;

    // режем параметры по элементу сначала строим Map ИЛИ
    let {_or} = row_spec;
    if(!_or) {
      _or = new Map();
      const relm = row_spec.elm;
      for(const {_row} of params._obj.filter((row) => row.elm === relm)) {
        if(!_or.has(_row.area)) {
          _or.set(_row.area, []);
        }
        _or.get(_row.area).push(_row);
      }
      row_spec._or = _or;
    }

    for(const grp of _or.values()) {
      let grp_ok = true;
      for (const prm_row of grp) {

        // перед проверкой условий выясняем, примерима ли проверка к данному способу расчёта
        const {use} = prm_row.param;
        if(count_calc_method && !use.find({count_calc_method})) {
          continue;
        }
        if(!count_calc_method && use.count() && !use.find({count_calc_method: $p.enm.count_calculating_ways.get()})) {
          continue;
        }

        // выполнение условия рассчитывает объект CchProperties
        grp_ok = prm_row.param.check_condition({row_spec, prm_row, ...other});
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

  /**
   * Добавляет или заполняет строку спецификации
   * @param {CatCharacteristicsSpecificationRow} [row_spec]
   * @param {BuilderElement} elm
   * @param {CatInsertsSpecificationRow|CatFurnsSpecificationRow|CatCnnsSpecificationRow} [row_base]
   * @param {TabularSection} spec
   * @param {CatNom} [nom]
   * @param {CatInserts|CatFurns|CatCnns} [origin]
   * @return {CatCharacteristicsSpecificationRow}
   */
  static new_spec_row({row_spec, elm, row_base, nom, origin, specify, spec, ox, len_angl}) {
    const {
      utils: {blank},
      cat: {clrs, characteristics},
      job_prm: {debug},
      enm: {
        predefined_formulas: {cx_clr, cx_prm, gb_short, gb_long, clr_in, clr_out, nom_prm},
        comparison_types: ct,
        plan_detailing: {algorithm},
        specification_order_row_types: {kit}
      },
      cch: {properties},
      CatCharacteristics,
      CatProperty_values
    } = $p;
    
    if(!row_spec) {
      if(row_base?.is_order_row === kit) {
        specify = ox || spec._owner;
        row_spec = specify.calc_order.accessories().specification.add();
        row_spec._quantity = specify.calc_order_row.quantity;
      }
      else {
        row_spec = spec.add();
      }      
    }
    row_spec.nom = nom || row_base.nom;
    if(row_base?.relm) {
      elm = row_base.relm;
    }

    if(!row_spec.nom.visualization.empty()) {
      const {cutting_optimization_type} = row_spec.nom;
      if(cutting_optimization_type.empty() || cutting_optimization_type.is('no')) {
        row_spec.dop = -1;
      }
    }
    if(row_spec.nom.is_procedure) {
      if(!row_spec.dop) {
        row_spec.dop = -2;
      }
      if(!specify && elm && (row_spec.nom.elm_type.is('info') || row_spec.nom.elm_type.is('error'))) {
        specify = elm?.nom?.article;
      }
    }

    row_spec.clr = clrs.by_predefined(row_base ? row_base.clr : elm.clr, elm.clr, ox.clr, elm, spec, row_spec, row_base);
    row_spec.elm = elm.elm;
    if(origin && debug) {
      row_spec.origin = origin;
    }
    if(specify) {
      row_spec.specify = specify;
    }
    if(row_base?.stage && !row_base.stage.empty()) {
      row_spec.stage = row_base.stage;
    }

    // если алгоритм = характеристика по цвету
    if(row_base?.algorithm === cx_clr) {
      const clr = row_base?._clr || row_spec.clr;
      // перебираем характеристики текущей номенклатуры
      characteristics.find_rows({owner: row_spec.nom, clr}, (cx) => {
        row_spec.characteristic = cx;
        return false;
      });
    }
    else if(row_base?.algorithm === cx_prm && row_base._owner) {
      const prm_row = row_base._owner._owner.selection_params.find({elm: row_base.elm, origin: algorithm});
      if(prm_row) {
        const pv = prm_row.param.extract_pvalue({ox, elm, prm_row});
        if(pv instanceof CatCharacteristics && pv.owner === row_spec.nom) {
          row_spec.characteristic = pv;
        }
        else if(pv instanceof CatProperty_values) {
          characteristics.find_rows({owner: row_spec.nom}, (cx) => {
            if(cx.params.find({param: prm_row.param, value: pv})) {
              row_spec.characteristic = cx;
              return false;
            }
          });
        }
      }
    }
    else {
      if(row_base) {
        row_spec.characteristic = row_base.nom_characteristic;
      }
      if(!row_spec.characteristic.empty() && row_spec.characteristic.owner != row_spec.nom) {
        row_spec.characteristic = blank.guid;
      }

      // цвет по параметру
      clrs.clr_prm({row_base, row_spec, elm, origin, ox});

      if(row_base?.algorithm === clr_in) {
        const clr = clrs.by_predefined({predefined_name: 'КакЭлементИзнутри'}, elm.clr, ox.clr, elm);
        if(clr.empty()) {
          row_spec.clr = row_base.clr;
        }
        else if(row_base.clr.empty()) {
          row_spec.clr = clr;
        }
        else {
          row_spec.clr = `${clr.valueOf()}${row_base.clr,valueOf()}`;
        }
      }

      else if(row_base?.algorithm === clr_out) {
        const clr = clrs.by_predefined({predefined_name: 'КакЭлементСнаружи'}, elm.clr, ox.clr, elm);
        if(clr.empty()) {
          row_spec.clr = row_base.clr;
        }
        else if(row_base.clr.empty()) {
          row_spec.clr = clr;
        }
        else {
          row_spec.clr = `${clr.valueOf()}${row_base.clr,valueOf()}`;
        }
      }

      // длина штапика
      else if([gb_short, gb_long].includes(row_base?.algorithm) && len_angl) {
        const {curr, next, prev} = len_angl;
        if(curr && next && prev) {
          // строим эквидистанты от рёбер заполнения
          const curr0 = curr.sub_path.equidistant(row_base.sz, 100);
          const curr1 = curr.sub_path.equidistant(row_base.sz - row_base.nom.width, 100);
          const prev0 = prev.sub_path.equidistant(row_base.sz, 100);
          const next0 = next.sub_path.equidistant(row_base.sz, 100);
          const pp0 = curr0.intersect_point(prev0, curr.b, true);
          const pp1 = curr1.intersect_point(prev0, curr.b, true);
          const pn0 = curr0.intersect_point(next0, curr.e, true);
          const pn1 = curr1.intersect_point(next0, curr.e, true);
          const fin0 = curr0.get_subpath(pp0, pn0);
          const fin1 = curr1.get_subpath(pp1, pn1);
          row_spec.len = (Math.max(fin0.length, fin1.length) * (row_base.coefficient || 0.001)).round(4);
        }
      }
      else if(row_base?.algorithm === nom_prm && row_base._owner) {
        const prm_row = row_base._owner._owner.selection_params.find({elm: row_base.elm, origin: algorithm});
        if(prm_row) {
          const nom = prm_row.param.extract_pvalue({ox, elm, prm_row});
          if(nom && !nom.empty()) {
            row_spec.nom = nom;
          }
        }
      }
    }

    return row_spec;
  }

  /**
   * РассчитатьQtyLen
   * @param row_spec
   * @param row_base
   * @param len
   */
  static calc_qty_len(row_spec, row_base, len) {

    const {nom} = row_spec;

    if(!nom.is_procedure && (nom.cutting_optimization_type.is('no') || nom.cutting_optimization_type.empty() || nom.is_pieces)) {
      if(!row_base.coefficient || !len) {
        row_spec.qty = row_base.quantity;
      }
      else {
        if(!nom.is_pieces) {
          row_spec.qty = row_base.quantity;
          row_spec.len = (len - row_base.sz) * (row_base.coefficient || 0.001);
          if(nom.rounding_quantity) {
            row_spec.qty = (row_spec.qty * row_spec.len).round(nom.rounding_quantity);
            row_spec.len = 0;
          }
          ;
        }
        else if(!nom.rounding_quantity) {
          row_spec.qty = Math.round((len - row_base.sz) * row_base.coefficient * row_base.quantity - 0.5);
        }
        else {
          row_spec.qty = ((len - row_base.sz) * row_base.coefficient * row_base.quantity).round(nom.rounding_quantity);
        }
      }
    }
    else if(nom.is_pieces && !row_base.coefficient) {
      row_spec.qty = row_base.quantity;
    }
    else {
      row_spec.qty = row_base.quantity;
      row_spec.len = (len - row_base.sz) * (row_base.coefficient || 0.001);
      if(row_base.offsets && row_spec.len > (row_base.offsets * (row_base.coefficient || 0.001))) {
        row_spec.len = row_base.offsets * (row_base.coefficient || 0.001);
      }
    }
  }

  /**
   * РассчитатьКоличествоПлощадьМассу
   *
   * @param {CatCharacteristicsSpecificationRow} row_spec
   * @param {TabularSection} spec
   * @param {Object} row_coord
   * @param {EnmAngle_calculating_ways} [angle_calc_method_prev]
   * @param {EnmAngle_calculating_ways} [angle_calc_method_next]
   * @param {Number} [alp1]
   * @param {Number} [alp2]
   * @param {Boolean} [totqty0]
   */
  static calc_count_area_mass(row_spec, spec, row_coord, angle_calc_method_prev, angle_calc_method_next, alp1, alp2, totqty0) {

    const {qty, len, nom} = row_spec;
    if(!qty) {
      // dop=-1 - визуализация, dop=-2 - техоперация,
      if(row_spec.dop >= 0) {
        spec.del(row_spec.row - 1, true);
      }
      return;
    }

    // если свойства уже рассчитаны в формуле, пересчет не выполняем
    if(row_spec.totqty1 && row_spec.totqty) {
      return;
    }

    //TODO: учесть angle_calc_method
    if(!angle_calc_method_next) {
      angle_calc_method_next = angle_calc_method_prev;
    }

    if(angle_calc_method_prev && !nom.is_pieces) {

      const {Основной, СварнойШов, СоединениеПополам, Соединение, _90} = $p.enm.angle_calculating_ways;

      if((angle_calc_method_prev == Основной) || (angle_calc_method_prev == СварнойШов)) {
        row_spec.alp1 = row_coord.alp1;
      }
      else if(angle_calc_method_prev == _90) {
        row_spec.alp1 = 90;
      }
      else if(angle_calc_method_prev == СоединениеПополам) {
        row_spec.alp1 = (alp1 || row_coord.alp1) / 2;
      }
      else if(angle_calc_method_prev == Соединение) {
        row_spec.alp1 = (alp1 || row_coord.alp1);
      }

      if((angle_calc_method_next == Основной) || (angle_calc_method_next == СварнойШов)) {
        row_spec.alp2 = row_coord.alp2;
      }
      else if(angle_calc_method_next == _90) {
        row_spec.alp2 = 90;
      }
      else if(angle_calc_method_next == СоединениеПополам) {
        row_spec.alp2 = (alp2 || row_coord.alp2) / 2;
      }
      else if(angle_calc_method_next == Соединение) {
        row_spec.alp2 = (alp2 || row_coord.alp2);
      }
    }

    if(len) {
      if(row_spec.width && !row_spec.s) {
        row_spec.s = len * row_spec.width;
      }
    }
    else {
      row_spec.s = 0;
    }

    if(row_spec.s) {
      row_spec.totqty = qty * row_spec.s;
    }
    else if(len) {
      row_spec.totqty = qty * len;
    }
    else {
      row_spec.totqty = qty;
    }
    
    // при расчёте по площади, в totqty1 пишем площадь bounds вместо площади фигуры
    let {totqty, s, width} = row_spec;
    if(s && row_coord && s < len * width && row_coord.elm_type?._manager?.glasses?.includes(row_coord.elm_type)) {
      totqty = qty * len * width;
    }

    row_spec.totqty1 = totqty0 ? 0 : Math.max(nom.min_volume, totqty * nom.loss_factor);
    
    const {_quantity} = row_spec;
    if(_quantity) {
      row_spec.qty *= _quantity;
      row_spec.totqty *= _quantity;
      row_spec.totqty1 *= _quantity;
    }

    ['len', 'width', 's', 'qty', 'alp1', 'alp2'].forEach((fld) => row_spec[fld] = row_spec[fld].round(4));
    ['totqty', 'totqty1'].forEach((fld) => row_spec[fld] = row_spec[fld].round(6));
  }

}

ProductsBuilding.cnn_nodes = ['b', 'e', 't', ''];
if(typeof global !== 'undefined'){
  global.ProductsBuilding = ProductsBuilding;
}
$p.ProductsBuilding = ProductsBuilding;
$p.products_building = new ProductsBuilding(true);
