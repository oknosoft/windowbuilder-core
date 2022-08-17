
/**
 * Предопределенное поведение параметров
 *
 * Created 05.12.2021.
 */

$p.adapters.pouch.once('pouch_doc_ram_loaded', () => {
  const {cch: {properties}, cat: {formulas, clrs}, enm: {orientations, positions, comparison_types: ect}, 
    EditorInvisible, utils} = $p;

  // стандартная часть создания fake-формулы
  function formulate(name) {
    const prm = properties.predefined(name);
    if(prm) {
      // fake-формула
      if(prm.calculated.empty()) {
        prm.calculated = formulas.create({ref: prm.ref, name: `predefined-${name}`}, false, true);
      }
      if(!prm.calculated._data._formula) {
        switch (name) {

        case 'clr_product':
          prm.calculated._data._formula = function (obj) {
            return obj?.ox?.clr || clrs.get();
          };
          break;

        case 'clr_inset':
          prm.calculated._data._formula = function ({elm, cnstr, ox}) {
            let clr;
            if(elm instanceof $p.DpBuyers_orderProductionRow || elm instanceof $p.DocCalc_order.FakeElm) {
              clr = elm.clr;
            }
            else {
              ox.inserts.find_rows({cnstr}, row => (clr = row.clr));
            }
            return clr;
          };
          break;

        case 'width':
          prm.calculated._data._formula = function (obj) {
            return obj?.ox?.y || 0;
          };
          break;

        case 'inset':
          prm.calculated._data._formula = function ({elm, prm_row, ox, row}) {

            // если запросили вставку соседнего элемента состава заполнения, возвращаем массив
            if(prm_row && prm_row.origin === prm_row.origin._manager.nearest && elm instanceof EditorInvisible.Filling){
              const res = new Set();
              ox.glass_specification.find_rows({elm: elm.elm}, ({inset}) => {
                if(row && row._owner && inset !== row._owner._owner) {
                  res.add(inset);
                }
              });
              return Array.from(res);
            }

            return elm?.inset;
          };
          break;

        case 'elm_weight':
          prm.calculated._data._formula = function (obj) {
            const {elm} = obj || {};
            return elm ? elm.weight : 0;
          };
          break;

        case 'elm_orientation':
          prm.calculated._data._formula = function ({elm, elm2}) {
            return elm?.orientation || elm2?.orientation || orientations.get();
          };
          break;

        case 'elm_pos':
          prm.calculated._data._formula = function ({elm}) {
            return elm?.pos || positions.get();
          };
          break;

        case 'elm_rectangular':
          prm.calculated._data._formula = function ({elm}) {
            const {is_rectangular} = elm;
            return typeof is_rectangular === 'boolean' ? is_rectangular : true;
          };
          break;

        case 'branch':
          prm.calculated._data._formula = function ({elm, layer, ox, calc_order}) {
            if(!calc_order && ox) {
              calc_order = ox.calc_order;
            }
            else if(!calc_order && layer) {
              calc_order = layer._ox.calc_order;
            }
            else if(!calc_order && elm) {
              calc_order = elm.ox.calc_order;
            }

            const prow = (ox || layer?._ox || elm?.ox).params.find({param: prm});
            return prow && !prow.value.empty() ? prow.value : calc_order.manager.branch;
          };
          break;

        default:
          prm.calculated._data._formula = function () {};
        }
      }
    }
    return prm;
  }

  // создаём те, где нужна только формула со стандартным check_condition
  for(const name of [
    'clr_product',      // цвет изделия
    'elm_weight',       // масса элемента
    'elm_orientation',  // ориентация элемента
    'elm_pos',          // положение элемента
    'elm_rectangular',  // прямоугольность элемента
    'branch',           // отдел абонента текущего контекста
    'width',            // ширина из параметра
    'inset',            // вставка текущего элемента
    'clr_inset',        // цвет вставки в элемент
  ]) {
    formulate(name);
  }

  // угол к следующему
  ((name) => {
    const prm = formulate(name);
    if(prm) {
      // fake-признак использования
      if(!prm.use.count()) {
        prm.use.add({count_calc_method: 'ПоПериметру'});
      }
      // проверка условия
      prm.check_condition = function ({row_spec, prm_row, elm, elm2, cnstr, origin, ox}) {
        if(elm && elm._row && elm._row.hasOwnProperty(name)) {
          return utils.check_compare(elm._row.angle_next, prm_row.value, prm_row.comparison_type, prm_row.comparison_type._manager);
        }
        return Object.getPrototypeOf(this).check_condition.call(this, {row_spec, prm_row, elm, elm2, cnstr, origin, ox});
      }
    }
  })('angle_next');

  // высоты поперечин
  ((name) => {
    const prm = properties.predefined(name);
    if(prm) {
      // параметр не вычисляемый
      prm.calculated = '';
      // проверка условия
      prm.check_condition = function () {
        return true;
      };
      // значение (массив высот)
      prm.avalue = function (raw) {
        const res = [];
        if(raw) {
          for(const elm of raw.split(',')) {
            const num = parseFloat(elm);
            if(typeof num === 'number' && !isNaN(num)) {
              res.push(num);
            }
          }
        }
        return res;
      }
    }
  })('traverse_heights');

  // уровень слоя
  ((name) => {
    const prm = formulate(name);
    if(prm) {
      // проверка условия
      prm.check_condition = function ({layer, prm_row}) {
        if(layer) {
          const {level} = layer;
          return utils.check_compare(level, prm_row.value, prm_row.comparison_type, prm_row.comparison_type._manager);
        }
        return true;
      }
    }
  })('layer_level');

  // вхождение элемента в габариты
  ((name) => {
    const prm = formulate(name);
    if(prm) {
      // проверка условия
      const ne = [ect.ne, ect.nin, ect.ninh, ect.nfilled];

      prm.check_condition = function ({elm, layer, prm_row}) {
        if(!prm_row._bounds) {
          try {
            prm_row._bounds = JSON.parse(prm_row.txt_row);
          }
          catch (e) {
            return true;
          }
        }
        const bounds = elm ? elm.bounds : layer?.bounds;
        if(!bounds) {
          return true;
        }
        let ok = bounds.width >= prm_row._bounds.xmin && bounds.width <= prm_row._bounds.xmax &&
          bounds.height >= prm_row._bounds.ymin && bounds.height <= prm_row._bounds.ymax;
        if(!ok && prm_row._bounds.rotate) {
          ok = bounds.height >= prm_row._bounds.xmin && bounds.height <= prm_row._bounds.xmax &&
            bounds.width >= prm_row._bounds.ymin && bounds.width <= prm_row._bounds.ymax;
        }
        return ne.includes(prm_row.comparison_type) ? !ok : ok;
      }
    }
  })('bounds_contains');

  // способ придания цвета
  ((name) => {
    const prm = formulate(name);
    if(prm) {
      // проверка условия
      prm.check_condition = function ({elm, eclr, row_spec, prm_row}) {
        const ct = prm_row.comparison_type || ect.eq;

        // если не задан eclr, используем цвет элемента
        const no_eclr = !eclr;
        if(no_eclr) {
          eclr = elm.clr;
        }

        const value = this.extract_value(prm_row);
        if(eclr.is_composite()) {
          const {clr_in, clr_out} = eclr;
          return utils.check_compare(clr_in.area_src, value, ct, ect) ||
              utils.check_compare(clr_out.area_src, value, ct, ect);
        }

        // если в "системе" задан список цветов, не требующих покраски, смотрим на него, иначе - не белый
        if(eclr.area_src.empty()) {
          return false;
        }
        if(no_eclr) {
          const {colors} = elm.layer.sys;
          if(colors.count()) {
            if(colors.find({clr: eclr})) {
              return false;
            }
          }
          else if(eclr === clrs.predefined('Белый')) {
            return false;
          }
        }

        return utils.check_compare(eclr.area_src, value, ct, ect);
      }
    }
  })('coloring_kind');

  // признак использования строки спецификации
  ((name) => {
    const prm = properties.predefined(name);
    if(prm) {
      // проверка условия
      prm.check_condition = function ({row_spec, prm_row, elm, elm2, cnstr, origin, ox}) {
        const value = elm[row_spec.nom.ref];
        return utils.check_compare(value, prm_row.value, prm_row.comparison_type, ect);
      }
    }
  })('use');

});
