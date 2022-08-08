/**
 * Дополнительные методы справочника Привязки вставок
 *
 * Created 21.04.2017
 */

exports.CatInsert_bindManager = class CatInsert_bindManager extends Object {

  /**
   * Возвращает массив допвставок с привязками к изделию или слою
   * @param ox {CatCharacteristics}
   * @param [order] {Boolean}
   * @return {Array}
   */
  insets(ox, order = false) {
    const {sys, owner} = ox;
    const res = [];
    const {enm, cat} = $p;
    const {inserts_types: {Заказ}, elm_types: {flap}} = enm;
    for (const {production, inserts, key} of this) {
      if(!key.check_condition({ox})) {
        continue;
      }
      for (const {nom} of production) {
        if(!nom || nom.empty() || (sys && sys._hierarchy(nom)) || (owner && owner._hierarchy(nom))) {
          for (const {inset, elm_type} of inserts) {
            if(!res.some((irow) => irow.inset == inset && irow.elm_type == elm_type)) {
              if((!order && inset.insert_type !== Заказ) || (order && inset.insert_type === Заказ)) {
                res.push({inset, elm_type});
              }
            }
          }
        }
        // створки виртуальных слоёв
        else {
          for(const {dop} of ox.constructions) {
            if(dop.sys && cat.production_params.get(dop.sys)._hierarchy(nom)) {
              inserts.find_rows({elm_type: flap}, ({inset, elm_type}) => {
                if(!res.some((irow) => irow.inset == inset && irow.elm_type == elm_type)) {
                  res.push({inset, elm_type});
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
   * @param scheme {Scheme}
   * @param spec {TabularSection}
   */
  deposit({ox, scheme, spec}) {

    const {enm: {elm_types}, EditorInvisible: {ContourVirtual}} = $p;

    for (const {inset, elm_type} of this.insets(ox)) {

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
        inset.calculate_spec({elm, len_angl, ox, spec});
      }
    }
  }
};

