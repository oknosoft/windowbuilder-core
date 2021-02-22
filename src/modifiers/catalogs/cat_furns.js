
/**
 * Дополнительные методы справочника Фурнитура
 *
 * Created 23.12.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2018
 * @author Evgeniy Malyarov
 * @module cat_furns
 */

/**
 * корректируем метаданные табчастей фурнитуры
 */
(({md}) => {
  const {selection_params, specification} = md.get('cat.furns').tabular_sections;
  // индексы
  selection_params.index = 'elm';
  specification.index = 'elm';
  // устаревшее поле nom_set для совместимости
  const {fields} = specification;
  fields.nom_set = fields.nom;
})($p);

/**
 * Методы объекта фурнитуры
 */
$p.CatFurns = class CatFurns extends $p.CatFurns {

  /**
   * Перезаполняет табчасть параметров указанного контура
   */
  refill_prm({project, furn, cnstr}, force=false) {

    const fprms = project.ox.params;
    const {sys} = project._dp;
    const {CatNom, job_prm: {properties: {direction, opening}}} = $p;

    // формируем массив требуемых параметров по задействованным в contour.furn.furn_set
    const aprm = furn.furn_set.used_params();
    aprm.sort((a, b) => {
      if (a.presentation > b.presentation) {
        return 1;
      }
      if (a.presentation < b.presentation) {
        return -1;
      }
      return 0;
    });

    // дозаполняем и приклеиваем значения по умолчанию
    aprm.forEach((v) => {

      // направления в табчасть не добавляем
      if(v == direction || v == opening){
        return;
      }

      let prm_row, forcibly = true;
      fprms.find_rows({param: v, cnstr: cnstr}, (row) => {
        prm_row = row;
        return forcibly = force;
      });
      if(!prm_row){
        prm_row = fprms.add({param: v, cnstr: cnstr}, true);
      }

      // умолчания и скрытость по табчасти системы
      const {param} = prm_row;
      const drow = sys.prm_defaults(param, cnstr);
      if(drow && (drow.forcibly || forcibly)) {
        prm_row.value = drow.value;
      }
      prm_row.hide = (drow && drow.hide) || (param.is_calculated && !param.show_calculated);

      // умолчания по связям параметров
      param.linked_values(param.params_links({
        grid: {selection: {cnstr: cnstr}},
        obj: {_owner: {_owner: project.ox}}
      }), prm_row);

    });

    // удаляем лишние строки, сохраняя параметры допвставок
    const adel = [];
    fprms.find_rows({cnstr: cnstr, inset: $p.utils.blank.guid}, (row) => {
      if(aprm.indexOf(row.param) == -1){
        adel.push(row);
      }
    });
    adel.forEach((row) => fprms.del(row, true));

  }

  /**
   * Вытягивает массив используемых фурнитурой и вложенными наборами параметров
   * @return {Array}
   */
  used_params() {

    const {_data} = this;
    // если параметры этого набора уже обработаны - пропускаем
    if(_data.used_params) {
      return _data.used_params;
    }

    const sprms = [];

    this.selection_params.forEach(({param}) => {
      !param.empty() && (!param.is_calculated || param.show_calculated) && !sprms.includes(param) && sprms.push(param);
    });

    const {CatFurns, CatNom, enm: {predefined_formulas: {cx_prm}}} = $p;
    this.specification.forEach(({nom, algorithm}) => {
      if(nom instanceof CatFurns) {
        for(const param of nom.used_params()) {
          !sprms.includes(param) && sprms.push(param);
        }
      }
      else if(algorithm === cx_prm && nom instanceof CatNom && !sprms.includes(nom)) {
        sprms.push(nom);
      }
    });

    return _data.used_params = sprms;

  }

  /**
   * Аналог УПзП-шного _ПолучитьСпецификациюФурнитурыСФильтром_
   * @param contour {Contour}
   * @param cache {Object}
   * @param [exclude_dop] {Boolean}
   */
  get_spec(contour, cache, exclude_dop) {

    // тихий режим для спецификации
    const res = $p.dp.buyers_order.create({specification: []}, true).specification;
    const {ox} = contour.project;
    const {transfer_operations_options: {НаПримыкающий: nea, ЧерезПримыкающий: through, НаПримыкающийОтКонца: inverse},
      open_directions, offset_options} = $p.enm;

    // бежим по всем строкам набора
    this.specification.find_rows({dop: 0}, (row_furn) => {

      // проверяем, проходит ли строка
      if(!row_furn.check_restrictions(contour, cache)){
        return;
      }

      // ищем строки дополнительной спецификации
      if(!exclude_dop){
        this.specification.find_rows({elm: row_furn.elm, dop: {not: 0}}, (dop_row) => {

          if(!dop_row.check_restrictions(contour, cache)){
            return;
          }

          // расчет координаты и (или) визуализации
          if(dop_row.is_procedure_row){

            // для правого открывания, инвертируем координату
            const invert = contour.direction == open_directions.Правое;
            // получаем элемент через сторону фурнитуры
            const elm = contour.profile_by_furn_side(dop_row.side, cache);
            // profile._len - то, что получится после обработки
            // row_spec.len - сколько взять (отрезать)
            // len - геометрическая длина без учета припусков на обработку
            const {len} = elm._row;
            // свойство номенклатуры размер до фурнпаза
            const {sizefurn} = elm.nom;
            // в зависимости от значения константы add_d, вычисляем dx1
            const dx1 = $p.job_prm.builder.add_d ? sizefurn : 0;
            // длина с поправкой на фурнпаз
            const faltz = len - 2 * sizefurn;

            let coordin = 0;

            if(dop_row.offset_option == offset_options.Формула){
              if(!dop_row.formula.empty()){
                coordin = dop_row.formula.execute({ox, elm, contour, len, sizefurn, dx1, faltz, invert, dop_row});
              }
            }
            else if(dop_row.offset_option == offset_options.РазмерПоФальцу){
              coordin = faltz + dop_row.contraction;
            }
            else if(dop_row.offset_option == offset_options.ОтРучки){
              // строим горизонтальную линию от нижней границы контура, находим пересечение и offset
              const {generatrix} = elm;
              const hor = contour.handle_line(elm);
              coordin = generatrix.getOffsetOf(generatrix.intersect_point(hor)) -
                generatrix.getOffsetOf(generatrix.getNearestPoint(elm.corns(1))) +
                (invert ? dop_row.contraction : -dop_row.contraction);
            }
            else if(dop_row.offset_option == offset_options.ОтСередины){
              // не мудрствуя, присваиваем половину длины
              coordin = len / 2 + (invert ? dop_row.contraction : -dop_row.contraction);
            }
            else{
              if(invert){
                if(dop_row.offset_option == offset_options.ОтКонцаСтороны){
                  coordin = dop_row.contraction;
                }
                else{
                  coordin = len - dop_row.contraction;
                }
              }
              else{
                if(dop_row.offset_option == offset_options.ОтКонцаСтороны){
                  coordin = len - dop_row.contraction;
                }
                else{
                  coordin = dop_row.contraction;
                }
              }
            }

            const proc_row = res.add(dop_row);
            proc_row.origin = this;
            proc_row.specify = row_furn.nom;
            proc_row.handle_height_max = contour.cnstr;
            if([nea, through, inverse].includes(dop_row.transfer_option)){
              let nearest = elm.nearest();
              if(dop_row.transfer_option == through){
                const joined = nearest.joined_nearests().reduce((acc, cur) => {
                  if(cur !== elm){
                    acc.push(cur);
                  }
                  return acc;
                }, []);
                if(joined.length){
                  nearest = joined[0];
                }
              }
              const {outer} = elm.rays;
              const nouter = nearest.rays.outer;
              const point = outer.getPointAt(outer.getOffsetOf(outer.getNearestPoint(elm.corns(1))) + coordin);
              proc_row.handle_height_min = nearest.elm;
              if(dop_row.transfer_option == inverse){
                proc_row.coefficient = nouter.getOffsetOf(nouter.getNearestPoint(nearest.corns(2))) - nouter.getOffsetOf(nouter.getNearestPoint(point));
              }
              else {
                proc_row.coefficient = nouter.getOffsetOf(nouter.getNearestPoint(point)) - nouter.getOffsetOf(nouter.getNearestPoint(nearest.corns(1)));
              }
              // если сказано учесть припуск - добавляем dx0
              if(dop_row.overmeasure){
                proc_row.coefficient +=  nearest.dx0;
              }
            }
            else{
              proc_row.handle_height_min = elm.elm;
              proc_row.coefficient = coordin;
              // если сказано учесть припуск - добавляем dx0
              if(dop_row.overmeasure){
                proc_row.coefficient +=  elm.dx0;
              }
            }

            return;
          }
          else if(!dop_row.quantity){
            return;
          }

          // в зависимости от типа строки, добавляем саму строку или её подчиненную спецификацию
          if(dop_row.is_set_row){
            const {nom} = dop_row;
            nom && nom.get_spec(contour, cache).forEach((sub_row) => {
              if(sub_row.is_procedure_row){
                res.add(sub_row);
              }
              else if(sub_row.quantity) {
                res.add(sub_row).quantity = (row_furn.quantity || 1) * (dop_row.quantity || 1) * sub_row.quantity;
              }
            });
          }
          else{
            const row_spec = res.add(dop_row);
            row_spec.origin = this;
            row_spec.specify = row_furn.nom;
          }
        });
      }

      // в зависимости от типа строки, добавляем саму строку или её подчиненную спецификацию
      if(row_furn.is_set_row){
        const {nom} = row_furn;
        nom && nom.get_spec(contour, cache, exclude_dop).forEach((sub_row) => {
          if(sub_row.is_procedure_row){
            res.add(sub_row);
          }
          else if(sub_row.quantity){
            res.add(sub_row).quantity = (row_furn.quantity || 1) * sub_row.quantity;
          }
        });
      }
      else{
        if(row_furn.quantity){
          this.add_with_algorithm(res, ox, contour, row_furn);
        }
      }
    });

    return res;
  }

  /**
   * Добавляет строку в спецификацию с учетом алгоритма
   * @param {TabularSection} res
   * @param {CatCharacteristics} ox
   * @param {Contour} contour
   * @param {CatFurnsSpecificationRow} row_furn
   */
  add_with_algorithm(res, ox, contour, row_furn) {
    const {algorithm, formula} = row_furn;
    let cx;
    if(algorithm == 'cx_prm') {
      cx = ox.extract_value({cnstr: contour.cnstr, param: row_furn.nom});
      if(cx.toString().toLowerCase() === 'нет') {
        return;
      }
    }
    const row_spec = res.add(row_furn);
    row_spec.origin = this;
    if(algorithm == 'cx_prm') {
      row_spec.nom_characteristic = cx;
    }
    if(!formula.empty() && !formula.condition_formula){
      formula.execute({ox, contour, row_furn, row_spec});
    }
  }

  /**
   * Вычисляет штульповость фурнитуры
   * 0 - не штульповая, 1 - активная, 2 - пассивная
   * @return {number}
   */
  shtulp_kind() {
    let res = 0;
    this.open_tunes.forEach(({shtulp_available, shtulp_fix_here}) => {
      if(shtulp_available && !res) {
        res = 1;
      }
      if(shtulp_fix_here) {
        res = 2;
      }
    });
    return res;
  }

};

/**
 * Методы строки спецификации
 */
$p.CatFurnsSpecificationRow = class CatFurnsSpecificationRow extends $p.CatFurnsSpecificationRow {

  /**
   * Проверяет ограничения строки фурнитуры
   * @param contour {Contour}
   * @param cache {Object}
   */
  check_restrictions(contour, cache) {
    const {elm, dop, handle_height_min, handle_height_max, formula, side, flap_weight_min: mmin, flap_weight_max: mmax} = this;
    const {direction, h_ruch, cnstr, project} = contour;

    // проверка по высоте ручки
    if(h_ruch < handle_height_min || (handle_height_max && h_ruch > handle_height_max)){
      return false;
    }

    // проверка по формуле
    if(!cache.ignore_formulas && !formula.empty() && formula.condition_formula && !formula.execute({ox: cache.ox, contour, row_furn: this})) {
      return false;
    }

    // по моменту на петлях (в текущей реализации - просто по массе)
    if(mmin || (mmax && mmax < 1000)) {
      if(!cache.hasOwnProperty('weight')) {
        if(project._dp.sys.flap_weight_max) {
          const weights = [];
          for(const cnt of contour.layer.contours) {
            weights.push(Math.ceil(cache.ox.elm_weight(-cnt.cnstr)));
          }
          cache.weight = Math.max(...weights);
        }
        else {
          cache.weight = Math.ceil(cache.ox.elm_weight(-cnstr));
        }
      }
      if(mmin && cache.weight < mmin || mmax && cache.weight > mmax) {
        return false;
      }
    }

    // получаем связанные табличные части
    const {selection_params, specification_restrictions} = this._owner._owner;
    const prop_direction = $p.job_prm.properties.direction;

    let res = true;

    // по таблице параметров
    let profile;
    selection_params.find_rows({elm, dop}, (prm_row) => {
      if(!profile) {
        profile = contour.profile_by_furn_side(side, cache);
      }
      // выполнение условия рассчитывает объект CchProperties
      const ok = (prop_direction == prm_row.param) ?
        direction == prm_row.value : prm_row.param.check_condition({row_spec: this, prm_row, elm: profile, cnstr, ox: cache.ox});
      if(!ok){
        return res = false;
      }
    });

    // по таблице ограничений
    if(res) {

      specification_restrictions.find_rows({elm, dop}, (row) => {
        const {lmin, lmax, amin, amax, side, for_direct_profile_only} = row;
        const elm = contour.profile_by_furn_side(side, cache);

        // Проверка кривизны
        if(for_direct_profile_only === -1 && elm.is_linear()) {
          return res = false;
        }
        if(for_direct_profile_only === 1 && !elm.is_linear()) {
          return res = false;
        }

        // Проверка длины
        const { side_count } = contour;
        const prev = contour.profile_by_furn_side(row.side === 1 ? side_count : row.side - 1, cache);
        const next = contour.profile_by_furn_side(row.side === side_count ? 1 : row.side + 1, cache);
        const len = (elm._row.len - prev.nom.sizefurn - next.nom.sizefurn).round();
        if (len < lmin || len > lmax) {
          return res = false;
        }

        // Проверка угла
        const angle = direction == $p.enm.open_directions.Правое ?
          elm.generatrix.angle_to(prev.generatrix, elm.e) :
          prev.generatrix.angle_to(elm.generatrix, elm.b);
        if (angle < amin || angle > amax) {
          return res = false;
        }
      });
    }

    return res;
  }

  get nom() {
    return this._getter('nom') || this._getter('nom_set');
  }
  set nom(v) {
    if(v !== '') {
      this._setter('nom', v);
    }
  }

  get nom_set() {
    return this.nom;
  }
  set nom_set (v) {
    this.nom = v;
  }

};


