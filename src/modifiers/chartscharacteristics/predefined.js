
/**
 * Предопределенное поведение параметров
 *
 * Created 05.12.2021.
 */

$p.adapters.pouch.once('pouch_doc_ram_loaded', () => {
  const {cch: {properties}, cat: {formulas}, enm: {orientations, positions}, EditorInvisible, utils} = $p;

  // угол к следующему
  ((name) => {
    const prm = properties.predefined(name);
    if(prm) {
      // fake-формула
      if(prm.calculated.empty()) {
        prm.calculated = formulas.create({ref: prm.ref, name}, false, true);
      }
      if(!prm.calculated._data._formula) {
        prm.calculated._data._formula = function (obj) {
          const {elm} = obj;
        };
      }
      // fake-признак использования
      if(!prm.use.count()) {
        prm.use.add({count_calc_method: 'ПоПериметру'});
      }
      // проверка условия
      prm.check_condition = function ({row_spec, prm_row, elm, elm2, cnstr, origin, ox}) {
        if(elm && elm._row && elm._row.hasOwnProperty(name)) {
          return utils.check_compare(elm._row.angle_next, prm_row.value, prm_row.comparison_type, prm_row.comparison_type._manager)
        }
        return Object.getPrototypeOf(this).check_condition.call(this, {row_spec, prm_row, elm, elm2, cnstr, origin, ox});
      }
    }
  })('angle_next');

  // уровень слоя
  ((name) => {
    const prm = properties.predefined(name);
    if(prm) {
      // fake-формула
      if(prm.calculated.empty()) {
        prm.calculated = formulas.create({ref: prm.ref, name}, false, true);
        prm.calculated._data._formula = function (obj) {};
      }
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

  // масса элемента
  ((name) => {
    const prm = properties.predefined(name);
    if(prm) {
      // fake-формула
      if(prm.calculated.empty()) {
        prm.calculated = formulas.create({ref: prm.ref, name}, false, true);
      }
      if(!prm.calculated._data._formula) {
        prm.calculated._data._formula = function (obj) {
          const {elm} = obj || {};
          return elm ? elm.weight : 0;
        };
      }
    }
  })('elm_weight');

  // ориентация элемента
  ((name) => {
    const prm = properties.predefined(name);
    if(prm) {
      // fake-формула
      if(prm.calculated.empty()) {
        prm.calculated = formulas.create({ref: prm.ref, name}, false, true);
      }
      if(!prm.calculated._data._formula) {
        prm.calculated._data._formula = function ({elm, elm2}) {
          return elm?.orientation || elm2?.orientation || orientations.get();
        };
      }
    }
  })('elm_orientation');

  // положение элемента
  ((name) => {
    const prm = properties.predefined(name);
    if(prm) {
      // fake-формула
      if(prm.calculated.empty()) {
        prm.calculated = formulas.create({ref: prm.ref, name}, false, true);
      }
      if(!prm.calculated._data._formula) {
        prm.calculated._data._formula = function ({elm}) {
          return elm?.pos || positions.get();
        };
      }
    }
  })('elm_pos');

  // прямоугольность элемента
  ((name) => {
    const prm = properties.predefined(name);
    if(prm) {
      // fake-формула
      if(prm.calculated.empty()) {
        prm.calculated = formulas.create({ref: prm.ref, name}, false, true);
      }
      if(!prm.calculated._data._formula) {
        prm.calculated._data._formula = function ({elm}) {
          const {is_rectangular} = elm;
          return typeof is_rectangular === 'boolean' ? is_rectangular : true;
        };
      }
    }
  })('elm_rectangular');

  // вхождение элемента в габариты
  ((name) => {
    const prm = properties.predefined(name);
    if(prm) {
      // fake-формула
      if(prm.calculated.empty()) {
        prm.calculated = formulas.create({ref: prm.ref, name}, false, true);
      }
      if(!prm.calculated._data._formula) {
        prm.calculated._data._formula = function (obj) {
          console.log(name);
        };
      }
      // проверка условия
      const {comparison_types: ct} = $p.enm;
      const ne = [ct.ne, ct.nin, ct.ninh, ct.nfilled];

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

});
