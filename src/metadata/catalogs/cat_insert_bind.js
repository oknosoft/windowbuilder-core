/**
 * Дополнительные методы справочника Привязки вставок
 *
 * Created 21.04.2017
 */

exports.CatInsert_bindManager = class CatInsert_bindManager extends Object {

  /**
   * Возвращает массив допвставок с привязками к изделию или слою
   * @param ox {CatCharacteristics}
   * @param [order] {Boolean} - выполнять для Заказа, а не его строки
   * @return {Array}
   */
  insets(ox, order = false) {
    const {sys, owner} = ox;
    const res = [];
    const {enm, cat} = $p;
    const {inserts_types: {Заказ, Монтаж, Доставка, Упаковка}, elm_types: {flap}} = enm;
    for (const bind of this) {
      const {production, inserts, key, calc_order} = bind;
      if(!key.check_condition({ox})) {
        continue;
      }
      for (const {nom} of production) {
        if(!nom || nom.empty() || sys?._hierarchy(nom) || owner?._hierarchy(nom)) {
          for (const {inset, elm_type} of inserts) {
            if(!res.some((irow) => irow.inset == inset && irow.elm_type == elm_type)) {
              if((!order && !calc_order && inset.insert_type !== Заказ) || 
                  (order && (calc_order || [Заказ, Монтаж, Доставка, Упаковка].includes(inset.insert_type)))) {
                res.push({inset, elm_type, by_order: order, bind});
              }
            }
          }
        }
        // створки виртуальных слоёв
        else if(!order) {
          for(const {dop} of ox.constructions) {
            if(dop.sys && cat.production_params.get(dop.sys)._hierarchy(nom)) {
              inserts.find_rows({elm_type: flap}, ({inset, elm_type}) => {
                if(!res.some((irow) => irow.inset == inset && irow.elm_type == elm_type)) {
                  res.push({inset, elm_type, bind});
                }
              });
            }
          }
        }
      }
    }
    return res;
  }

  /**
   * Вклад привязок вставок в основную спецификацию
   * @param ox {CatCharacteristics}
   * @param {Scheme} [scheme]
   * @param {TabularSection} [spec]
   * @param {Boolean} [order]
   */
  deposit({ox, scheme, spec, order}) {

    const {enm: {elm_types}, EditorInvisible: {ContourVirtual}, CatInsert_bind, pricing} = $p;
    const old_rows = [], new_rows = [];
    if(order) {
      for(const row of ox.calc_order.production) {
        if(row.characteristic.origin instanceof CatInsert_bind) {
          old_rows.push(row);
        }
      }      
    }

    for (const {inset, elm_type, by_order, bind} of this.insets(ox, order)) {

      const elm = {
        _row: {},
        elm: 0,
        get perimeter() {
          return scheme ? scheme.perimeter : [];
        },
        clr: ox.clr,
        project: scheme,
      };
      const len_angl = {
        angle: 0,
        alp1: 0,
        alp2: 0,
        len: 0,
        cnstr: 0,
        origin: inset,
      };

      const deposit_flap = (layer) => {
        if(!(layer instanceof ContourVirtual)) {
          elm.layer = layer;
          len_angl.cnstr = layer.cnstr;
          inset.calculate_spec({elm, len_angl, ox, spec});
        }
        for (const contour of layer.contours) {
          deposit_flap(contour);
        }
      };

      // рассчитаем спецификацию вставки
      switch (elm_type) {
      case elm_types.flap:
        if(scheme) {
          for (const {contours} of scheme.contours) {
            contours.forEach(deposit_flap);
          }
        }
        break;

      case elm_types.rama:
        if(scheme) {
          for (const contour of scheme.contours) {
            elm.layer = contour;
            len_angl.cnstr = contour.cnstr;
            inset.calculate_spec({elm, len_angl, ox, spec});
          }
        }
        break;

      case elm_types.glass:
        // только для составных пакетов
        if(scheme) {
          for (const elm of scheme.glasses) {
            ox.glass_specification.find_rows({elm: elm.elm}, (row) => {
              if(row.inset.insert_glass_type === inset.insert_glass_type) {
                inset.calculate_spec({elm, row, layer: elm.layer, ox, spec});
              }
            });
          }
        }
        break;

      case elm_types.sandwich:
        // в данном случае, sandwich - любое заполнение, не только непрозрачное
        if(scheme) {
          for (const elm of scheme.glasses) {
            inset.calculate_spec({elm, layer: elm.layer, ox, spec});
          }
        }
        break;

      default:
        if(by_order) {
          const {production} = ox.calc_order;
          const cx = ox._manager.find({calc_order: ox.calc_order, leading_elm: 0, origin: bind}) ||
            ox._manager.create({calc_order: ox.calc_order, leading_elm: 0,origin: bind}, false, true)._set_loaded();
          const prow = inset.specification.find({quantity: 0, is_main_elm: true});
          if(prow) {
            cx.owner = prow.nom;
          }
          const row = production.find({characteristic: cx}) || production.add({nom: cx.owner, characteristic: cx});
          new_rows.push(row);
          cx.specification.clear();
          inset.calculate_spec({elm, len_angl, ox: cx});
          if(cx.specification.count()) {
            cx.product = row.row;
            cx.name = cx.prod_name();
            row.nom = cx.owner;
            row.unit = row.nom.storage_unit;
            row.qty = 1;
            row.quantity = 1;
            const attr = {calc_order_row: row, date: ox.calc_order.price_date, spec: cx.specification};
            pricing.price_type(attr);
            pricing.calc_first_cost(attr);
            pricing.calc_amount(attr);
            ox.calc_order._manager.emit_async('rows', ox.calc_order, {production: true});
          }
          else {
            production.del(row);
          }
        }
        else {
          inset.calculate_spec({elm, len_angl, ox, spec});
        }
      }
    }
    // старый вклад, не прошедший новые параметры - удаляем
    for(const rm of old_rows) {
      if(!new_rows.includes(rm)) {
        rm._owner.del(rm);
        ox.calc_order._manager.emit_async('rows', ox.calc_order, {production: true});
      }
    }
  }
};

