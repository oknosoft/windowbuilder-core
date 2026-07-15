
/**
 * Предопределенное поведение параметров
 *
 * Created 05.12.2021.
 */

$p.adapters.pouch.once('pouch_doc_ram_loaded', () => {
  const {
    enm: {orientations, positions, elm_types, comparison_types: ect, cnn_sides},
    cch: {properties},
    cat: {formulas, clrs, production_params, property_values}, 
    CatInserts, DocCalc_order, DpBuyers_orderProductionRow, utils, job_prm} = $p;
  
  function specifyNearest(elm, prm_row) {
    if(prm_row?.origin?.is('parent') || prm_row?.origin?.is('nearest')) {
      const nearest = elm.nearest();
      if(nearest) {
        return nearest;
      }
    }
    return elm;
  }

  // стандартная часть создания fake-формулы
  function formulate(name) {
    const prm = properties.predefined(name);
    if(prm) {
      // fake-формула
      if(prm.calculated.empty()) {
        prm.calculated = formulas.create({ref: prm.ref, name: `predefined-${name}`}, false, true);
      }
      const {_data} = prm.calculated;
      if(!_data._formula) {
        switch (name) {

        case 'clr_product':
          _data._formula = function (obj) {
            return obj?.ox?.clr || clrs.get();
          };
          break;

        case 'clr_inset':
          _data._formula = function ({elm, cnstr, ox}) {
            let clr;
            if(elm instanceof DpBuyers_orderProductionRow || elm instanceof DocCalc_order.FakeElm) {
              clr = elm.clr;
            }
            else {
              ox.inserts.find_rows({cnstr}, row => (clr = row.clr));
            }
            return clr;
          };
          break;
          
        case 'clr_grp':
          _data._formula = function ({elm, clr, layer}) {
            if(!prm.values) {
              prm.values = property_values.find_rows({owner: prm});
            }
            if(!clr) {
              clr = elm.clr || layer?.clr;
            }
            if(clr && clr.grouping.empty()) {
              clr.set_grouping(prm.values);
            }
            return clr?.grouping || prm.values.find(v => v.name === 'Нет');
          };
          prm.check_condition = function ({prm_row, ox, ...other}) {
            const {check_condition} = prm.constructor.prototype;
            if(prm_row?.origin?.is('order') && ox?.calc_order) {
              const production = ox?._prm_filtered || ox.calc_order.production;
              const filtered = [];
              for(const row of production) {
                if(check_condition.call(prm, {
                  prm_row,
                  ...other,
                  ox: row.characteristic,
                  clr: row.characteristic.clr,
                })) {
                  filtered.push(row);
                }
              }
              ox._prm_filtered = filtered;
              if(filtered.length && other.elm && !other.elm.clr) {
                other.elm._prm_filtered_clr = filtered[0].characteristic.clr;
              }
              return filtered.length > 0;
            }
            return check_condition.call(prm, {prm_row, ox, ...other});
          }
          break;

        case 'inset':
          _data._formula = function ({elm, elm2, prm_row, ox, row}) {

            // если запросили вставку соседнего элемента состава заполнения, возвращаем массив
            if(prm_row?.origin?.is('nearest')){
              if(elm instanceof Filling) {
                const res = new Set();
                (elm.project?.ox || ox).glass_specification.find_rows({elm: elm.elm}, ({inset}) => {
                  if(row && inset !== row._owner?._owner) {
                    res.add(inset);
                  }
                });
                return Array.from(res);
              }
              else if(elm2 instanceof Filling) {
                return elm2.inset.target;
              }
              else {
                const nearest = elm?.nearest?.();
                if(nearest) {
                  return nearest.inset;
                }
              }
            }
            
            return elm?.inset;
          };
          break;

        case 'inserts_glass_type':
          _data._formula = function ({elm, elm2, prm_row, ox, row}) {
            
            if(prm_row?.origin?.is('nearest') && (elm2 instanceof Filling || elm2?.is_glass)) {
              elm = elm2;
            }

            // если запросили згачение вставки состава заполнения, возвращаем массив
            if((elm instanceof Filling || elm?.is_glass) && 
                (prm_row?.comparison_type?.is('in') || prm_row?.comparison_type?.is('nin'))) {
              const res = new Set();
              (elm.project?.ox || ox).glass_specification.find_rows({elm: elm.elm}, ({inset}) => {
                if(!inset.insert_glass_type.empty()) {
                  res.add(inset.insert_glass_type);
                }
              });
              return Array.from(res);
            }

            return elm?.inset?.insert_glass_type;
          };
          break;
            
        case 'elm_weight':
          _data._formula = function (obj) {
            const {elm, prm_row, ox} = obj || {};
            let weight = elm.weight || 0;
            if(!weight && prm_row.origin.is('product') && ox) {
              weight = ox.elm_weight(undefined, {elm});
            }
            return weight;
          };
          break;
          
        case 'top_glass_weight':
          _data._formula = function (obj) {
            const {elm, elm2} = obj || {};
            if(elm && elm2 instanceof Filling) {
              const {generatrix, length, orientation} = elm;
              if(orientation?.is('hor')) {
                const gen = generatrix.clone({insert: false, deep: false}).elongation(100);
                const pt = elm2.interiorPoint?.() || elm2.path.center;
                const gpt = gen.getNearestPoint(pt);
                if(pt.y < gpt.y) {
                  return elm2.weight;
                }
              }
            }
            else if(elm instanceof BuilderElement) {
              const {nom} = job_prm;
              elm.err_spec_row(nom.cnn_ii_error || nom.info_error, 'Запрещено вызывать параметр top_glass_weight из вставки', elm.inset);
            }
            return 0;
          };
          break;
          
        case 'layer_weight':
            _data._formula = function (obj) {
              let {ox, elm, layer, prm_row} = obj;
              if(!layer && elm) {
                layer = elm.layer;
              }
              if(!layer) {
                return 0;
              }
              const weights = [];
              const contours = (layer.layer && layer.sys.flap_weight_max) ? layer.layer.contours : [layer]; 
              for(const cnt of contours) {
                if(cnt === layer || !cnt.furn.open_type.is('Неподвижное')) {
                  weights.push(Math.ceil(ox.elm_weight(-cnt.cnstr, {elm, contour: layer})));
                }
              }
              return Math.max(...weights);
            };
            break;
          
        case 'up_glasses_weight':
          _data._formula = function ({elm, elm2, ox}) {
            let weight = 0;
            if(elm2 instanceof Profile && !(elm instanceof Profile)) {
              elm = elm2;
            }
            if(elm?.orientation?.is('hor')) {
              const {top} = elm.nearest_glasses;
              if(top?.length) {
                weight = (ox || elm.ox).elm_weight(top.map((glass) => glass.elm), {elm});
              }
            }
            return weight;
          };
          break;
          
        case 'has_glasses':
          _data._formula = function ({ox}) {
            for(const row of ox.calc_order.production) {
              if(row.characteristic.glasses.count()) {
                return true;
              }
            }
            return false;
          };
          break;

        case 'has_glasses_separately':
          _data._formula = function ({ox}) {
            const {glasses} = job_prm.nom;
            for(const row of ox.calc_order.production) {
              if(glasses.includes(row.nom)) {
                return true;
              }
            }
            return false;
          };
          break;
          
        case 'has_glasses_outer':
          _data._formula = function ({elm, elm2}) {
            if(!(elm instanceof Profile) && (elm2 instanceof Profile)) {
              elm = elm2;
            }
            if(elm.joined_glasses) {
              for(const gl of elm.joined_glasses()) {
                if(gl instanceof Filling) {
                  if(elm.generatrix.point_pos(gl.interiorPoint()) > 0) {
                    return true;
                  }
                }
              }              
            }
            return false;
          };
          break;
          
        case 'has_addition':
          _data._formula = function ({elm, layer}) {
            return Boolean(elm?.addls?.length);
          };
          break;
          
        case 'thickness':
          _data._formula = function ({elm, prm_row}) {
            return elm.thickness;
          };
          break;
          
        case 'region_thickness':
          _data._formula = function ({elm, prm_row}) {
            return elm.inset?.thickness(elm) || 0;
          };
          break;
            
        case 'nearest_gl_thickness':
          _data._formula = function ({elm, elm2}) {
            if(elm instanceof ProfileAdjoining) {
              elm = elm.nearest();
              elm2 = null;
            }
            let thickness = elm2?.thickness || 0;
            if(!thickness && elm?.joined_glasses) {
              thickness = Math.max(...elm.joined_glasses().map((gl) => gl.thickness || 0));
            }
            return thickness;
          };
          break;

        case 'nearest_gl_var':
          _data._formula = function ({elm}) {
            if(elm instanceof ProfileAdjoining) {
              elm = elm.nearest();
            }
            const set = new Set();
            for(const gl of elm?.joined_glasses?.()) {
              set.add(gl.thickness);
            }
            return set.size > 1;
          };
          break;
          
        case 'flap_overlay':
          _data._formula = function ({elm, prm_row}) {
            elm = specifyNearest(elm, prm_row);
            if(elm?.joined_nearests) {
              const nearests = {inner: [], outer: []};
              // учтём сторону
              const {rays, layer} = elm;
              for(const profile of elm.joined_nearests()) {
                if(elm.cnn_side(profile, null, rays).is('outer')){
                  nearests.outer.push(profile);
                }
                else {
                  nearests.inner.push(profile);
                }
              }
              for(const test1 of nearests.inner) {
                for(const test2 of nearests.outer) {
                  const sub = test1.generatrix.get_subpath(test2.b, test2.e);
                  if(sub?.length > consts.sticking) {
                    // учтём ось поворота
                    return test1.layer.is_rotation_axis(test1) || test2.layer.is_rotation_axis(test2);
                  }
                }
              }
            }
            return false;
          };
          break;
          
        case 'flap_overlay_axis':
          _data._formula = function ({elm, prm_row}) {
            elm = specifyNearest(elm, prm_row);
            if(elm?.joined_nearests) {
              const nearests = {inner: [], outer: []};
              // учтём сторону
              const {rays, layer} = elm;
              for(const profile of elm.joined_nearests()) {
                if(elm.cnn_side(profile, null, rays).is('outer')){
                  nearests.outer.push(profile);
                }
                else {
                  nearests.inner.push(profile);
                }
              }
              for(const test1 of nearests.inner) {
                for(const test2 of nearests.outer) {
                  const sub = test1.generatrix.get_subpath(test2.b, test2.e);
                  if(sub?.length > consts.sticking) {
                    // учтём ось поворота
                    return test1.layer.is_rotation_axis(test1) && test2.layer.is_rotation_axis(test2);
                  }
                }
              }
            }
            return false;
          };
          break;
          
        case 'nearest_flap_z':
          _data._formula = function ({elm}) {
            let res = 0;
            if(elm?.elm_type.is('flap')) {
              const nearest = elm.nearest(true);
              if(nearest?.elm_type?.is('impost')) {
                const other = nearest.joined_nearests().find((v) => v !== elm) || nearest;
                return elm.isAbove(other) ? 1 : -1;
              }              
            }
            return res;
          };
          break;

        case 'elm_orientation':
          _data._formula = function ({elm, elm2, prm_row, layer}) {
            if(prm_row?.origin?.is('parent')) {
              if(!layer) {
                layer = elm?.layer;
              }
              if(layer) {
                const {bounds} = layer;
                return bounds.width > bounds.height ? orientations.hor : orientations.vert; 
              }
            }
            if(!(elm instanceof ProfileItem) && elm2 instanceof ProfileItem) {
              elm = elm2;
            }
            return elm?.orientation || elm2?.orientation || orientations.get();
          };
          break;

        case 'elm_pos':
          _data._formula = function ({elm, elm2}) {
            if(!(elm instanceof ProfileItem) && elm2 instanceof ProfileItem) {
              elm = elm2;
            }
            return elm?.pos || positions.get();
          };
          break;
          
        case 'node_pos':
          _data._formula = function ({elm, node}) {
            if(elm && node) {
              if(elm instanceof ProfileSegment) {
                const {parent} = elm;
                if(!parent[node].is_nearest(elm[node])) {
                  return positions.left.center;
                }
              }
              const other = node === 'b' ? 'e' : 'b';
              if(elm.orientation.is('vert')) {
                return elm[node].y < elm[other].y ? positions.top : positions.bottom;
              }
              if(elm.orientation.is('hor')) {
                return elm[node].x > elm[other].x ? positions.right : positions.left;
              }
            }
            return positions.get();
          };
          break;

        case 'is_node_last':
          _data._formula = function ({elm, node}) {
            if(elm && node) {
              if(elm instanceof ProfileSegment) {
                const {parent} = elm;
                if(!parent[node].is_nearest(elm[node])) {
                  return false;
                }
              }
              const pt = elm[node];
              const {bounds} = elm.layer;
              const {sticking} = consts;
              return (pt.y < bounds.top + sticking) || (pt.y > bounds.bottom - sticking) ||
                (pt.x < bounds.left + sticking) || (pt.x > bounds.right - sticking);
            }
            return false;
          };
          break;
          
        case 'in_virt_layer':
          _data._formula = function ({elm, layer}) {
            if(!layer) {
              layer = elm?.layer;
            }
            return layer?.in_virt_layer || false;
          };
          break;         
          
        case 'joins_last_elm':
          _data._formula = function ({elm, elm2, prm_row, node}) {
            if(!(elm instanceof ProfileItem) && elm2 instanceof ProfileItem) {
              elm = elm2;
            }
            if(elm instanceof ProfileSegment) {
              elm = elm.parent;
            }
            if(elm) {
              const {layer: {bounds}, orientation} = elm;
              const {sticking} = consts;
              const nodes = node ? [node] : ['b', 'e']; 
              for(const node of nodes) {
                const pt = elm[node];
                if(orientation?.is('hor') && (pt.x < bounds.left + sticking) || (pt.x > bounds.right - sticking)) {
                  return true;
                }
                if(orientation?.is('vert') && (pt.y < bounds.top + sticking) || (pt.y > bounds.bottom - sticking)) {
                  return true;
                }
              }               
            }
            return false;
          };
          break;

        case 'cnn_side':
          _data._formula = function ({elm, elm2}) {
            return (elm && elm2) ? elm2.cnn_side(elm) : cnn_sides.get();
          };
          break;

        case 'is_composite':
          _data._formula = function ({elm}) {
            return elm?.clr?.is_composite();
          };
          prm.check_condition = function ({prm_row, ox, ...other}) {
            if(prm_row?.origin?.is('order') && ox?.calc_order) {
              const production = ox?._prm_filtered || ox.calc_order.production;
              const filtered = [];
              for(const row of production) {
                if(row.characteristic.clr.is_composite()) {
                  filtered.push(row);
                }
              }
              ox._prm_filtered = filtered;
              if(filtered.length && other.elm && !other.elm.clr) {
                other.elm._prm_filtered_clr = filtered[0].characteristic.clr;
              }
              return filtered.length > 0;
            }
            return prm.constructor.prototype.check_condition.call(prm, {prm_row, ox, ...other});
          }
          break;          
          
        case 'elm_type':
          _data._formula = function ({elm, elm2, row}) {
            if(elm2 && row?.set_specification?.is?.('САртикулом2')) {
              return elm2?.elm_type || elm_types.get();
            }
            return elm?.elm_type || elm_types.get();
          };
          break;

        case 'elm_rectangular':
          _data._formula = function ({elm}) {
            const {is_rectangular} = elm;
            return typeof is_rectangular === 'boolean' ? is_rectangular : true;
          };
          break;
          
        case 'region':
            _data._formula = function (obj) {
              const region = obj.region || obj.layer?.region;
              return typeof region === 'number' ? region : 0;
            };
            break;
            
        case 'furn':
          _data._formula = function ({elm, layer, ox, cnstr, prm_row}) {
            if(!layer) {
              layer = elm?.layer;
            }
            if(!layer) {
              return ox && cnstr && ox.constructions.find({cnstr})?.furn || $p.cat.furns.get();
            }
            if(prm_row?.origin?.is('nearest') && layer.layer) {
              for(const other of layer.layer.contours) {
                // TODO: добавить проверку наличия примыкания слоя к текущему
                if(other !== layer) {
                  return other.furn;
                }
              }
            }
            return layer.furn;        
          };
          break;

        case 'sys':
          _data._formula = function ({elm, layer, ox, cnstr, prm_row}) {
            if(!layer) {
              layer = elm?.layer;
            }
            if(layer) {
              if(prm_row?.origin?.is('nearest') && layer.layer) {
                for(const other of layer.layer.contours) {
                  // TODO: добавить проверку наличия примыкания слоя к текущему
                  if(other !== layer) {
                    return other.sys;
                  }
                }
              }
              if(prm_row?.origin?.is('parent') && layer.layer) {
                return layer.layer.sys;
              }
              return layer.sys;
            }
            if(cnstr) {
              const lrow = ox.constructions.find({cnstr});
              if(lrow) {
                const {sys} = lrow.dop;
                if(sys && sys !== utils.blank.guild) {
                  return production_params.get(sys);
                }
              }
            }
            return ox.sys;
          };
          break;
          
        case 'handle_height':
          _data._formula = function ({elm, layer}) {
            if(!layer && elm) {
              layer = elm.layer;
            }
            return layer ? layer.h_ruch : 0;
          };
          break;

        case 'width':
          _data._formula = function (obj) {
            return (obj?.elm instanceof Sectional) ? obj.elm.length : obj?.ox?.y || 0;
          };
          break;
          
        case 'height':
          _data._formula = function ({elm, layer, prm_row, ox, cnstr}) {
            if(!layer && elm) {
              layer = elm.layer;
            }
            if(!prm_row?.origin || prm_row.origin.is('product')) {
              return ox?.y || 0;
            }
            return layer ? layer.h : (ox.constructions.find({cnstr})?.h || 0);
          };
          break;

        case 'rotation_axis':
          _data._formula = function ({elm, layer, prm_row}) {
            if(!layer && elm?.layer) {
              layer = elm?.layer;
            }
            if(!layer) {
              return false;
            }
            if(prm_row.origin.is('layer') || prm_row.origin.is('nearest')) {
              return Boolean(layer.furn.open_tunes.find({rotation_axis: true})); 
            }
            let res = false;
            layer.furn.open_tunes.find_rows({rotation_axis: true}, ({side}) => {
              const profile = layer.profile_by_furn_side(side);
              if(profile === elm) {
                res = true;
                return false;
              }
            });
            return res;
          };
          break;

        case 'branch':
          _data._formula = function ({elm, layer, ox, calc_order}) {
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
            if(prow && !prow.value.empty()) {
              return prow.value;  
            }
            const branch = calc_order.organization._extra(prm);
            return branch && !branch.empty() ? branch : calc_order.manager.branch;
          };
          break;
          
        case 'order_category':
            _data._formula = function ({ox, calc_order, calc_order_row}) {
              if(!calc_order) {
                if(calc_order_row) {
                  calc_order = calc_order_row._owner._owner;
                }
                else if(ox) {
                  calc_order = ox.calc_order;
                }
              }
              return calc_order.category;
            };
            break;
            
        case 'has_delivery':
          _data._formula = function ({ox, calc_order, calc_order_row}) {
            if(!calc_order) {
              if(calc_order_row) {
                calc_order = calc_order_row._owner._owner;
              }
              else if(ox) {
                calc_order = ox.calc_order;
              }
            }
            if(calc_order) {
              for(const row of calc_order.production) {
                if(row.characteristic.origin?.insert_type?.is('Доставка')) {
                  return true;
                }
              }
            }
            return false;
          };
          break;

        default:
          _data._formula = function () {};
        }
      }
    }
    return prm;
  }

  // создаём те, где нужна только формула со стандартным check_condition
  for(const name of [
    'up_glasses_weight',// масса заполнений, опирающихся на профиль
    'has_glasses',      // бит в заказе есть заполнения
    'has_glasses_separately',// бит в заказе есть заполнения отдельно
    'has_glasses_outer',  //  бит к профилю примыкает заполнение с другой стороны
    'has_addition',     // бит есть добор у текущего профиля
    'elm_weight',       // масса элемента
    'top_glass_weight', // масса заполнений сверху
    'elm_orientation',  // ориентация элемента
    'elm_pos',          // положение элемента
    'node_pos',         // положение узла профиля
    'layer_weight',     // масса слоя с учётом признака 'Фильтр по тяжелой створке'
    'is_node_last',     // крайний по координатам узел в текущем слое
    'in_virt_layer',    // элемент находится в иерархии виртуального слоя
    'joins_last_elm',   // примыкает крайний элемент
    'flap_overlay',     // есть наложение створок
    'flap_overlay_axis',// есть наложение створок с осями поворота
    'cnn_side',         // сторона соединения (изнутри-снаружи)
    'elm_type',         // тип элемента
    'elm_rectangular',  // прямоугольность элемента
    'branch',           // отдел абонента текущего контекста
    'furn',             // фурнитура текущего контекста
    'sys',              // система текущего контекста
    'inset',            // вставка текущего элемента
    'inserts_glass_type',  // тип вставки заполнения
    'clr_product',      // цвет изделия
    'clr_inset',        // цвет вставки в элемент
    'clr_grp',          // группа цветов с учётом перевёрта сторон (каширование)
    'handle_height',    // высота ручки
    'width',            // ширина из параметра
    'height',           // высота слоя или изделия
    'region',           // ряд
    'is_composite',     // у элемента составной цвет
    'rotation_axis',    // у слоя есть ось поворота
    'thickness',        // толщина элемента 
    'region_thickness', // толщина ряда заполнения
    'nearest_gl_thickness',// толщина примыкающего заполнения
    'nearest_gl_var',   // бит отличия толщин примыкающих заполнений
    'nearest_flap_z',   // z-индекс примыкающей створки 
    'order_category',   // категория заказа
    'has_delivery',     // есть доставка
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
      prm.check_condition = function ({layer, elm, prm_row}) {
        if(!layer && elm) {
          layer = elm.layer;
        }
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
        let bounds = elm ? elm.bounds : layer?.bounds;
        if(!bounds && prm_row.origin.is('product') && elm?.project) {
          bounds = elm.project.bounds;
        }
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
        if(no_eclr && elm.layer?.sys) {
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

  // направление открывания
  ((name) => {
    const prm = properties.predefined(name);
    if(prm) {
      // проверка условия
      prm.check_condition = function ({prm_row, elm, elm2, layer}) {
        if(!layer && elm) {
          layer = elm.layer;
        }
        if(prm_row?.origin?.is('nearest')) {
          if(elm2) {
            layer = elm2.layer;
          }
        }
        else if (prm_row?.origin?.is('parent')) {
          if(layer?.layer) {
            layer = layer.layer;
          }
        }
        const value = layer?.direction;
        return utils.check_compare(value, prm_row.value, prm_row.comparison_type, ect);
      }
    }
  })('direction');

  
  ((name) => {
    const prm = properties.predefined(name);
    if(prm) {
      // специфическая фильтрация
      prm.check_condition = function ({prm_row, elm, layer, origin, ox}) {
        if(!ox) {
          ox = (elm || layer)?.project.ox;
        }
        if(!ox || !prm_row) {
          return false;
        }
        const {comparison_type, _owner: {_owner}} = prm_row;
        if(_owner instanceof CatInserts) {
          origin = _owner;
        }
        const compoundRow = ox.calc_order.composition.find({insert_type: origin.parent});
        if(!compoundRow) {
          return comparison_type.is('nfilled');
        }
        const ref = ox.valueOf();
        const value = (ref in compoundRow.value) ? compoundRow.value[ref] : compoundRow.value.all;
        if(comparison_type.is('eq') || comparison_type.empty()) {
          return value == origin;
        }
        if(comparison_type.is('nfilled')) {
          return value == undefined;
        }
        if(comparison_type.is('filled')) {
          return typeof value !== 'boolean'; 
        }
        return false;
      };
    }
  })('prod_compound');

  // "состав" - позволяет обратиться к массиву экземпляров изделий или элементов заказа
  ((name) => {
    const prm = properties.predefined(name);
    if(prm) {
      // данный параметр не используется для фильтрации
      prm.check_condition = function () {
        return true;
      };
      // состав заполнений
      prm.glasses = function ({elm, ox}) {
        const res = [];
        if(!ox) {
          ox = elm?.ox;
        }
        const push = (row, specimen) => {
          const {leading_product, leading_elm} = row?.characteristic || {};
          const characteristic = leading_product && !leading_product.empty() && leading_elm ? 
            leading_product : row?.characteristic;
          const glasses = leading_product && !leading_product.empty() && leading_elm ?
            [characteristic.glasses.find({elm: leading_elm})] : (characteristic.glasses || []);
          
          for(const glrow of glasses) {
            const glass = {
              formula: glrow.formula,
              thickness: glrow.thickness,
              width: glrow.width.round(1),
              height: glrow.height.round(1),
              area: glrow.s,
              is_rectangular: glrow.is_rectangular,
              is_sandwich: glrow.is_sandwich,
              weight: row.characteristic.elm_weight(glrow.elm),
              ref: characteristic.ref,
              elm: glrow.elm,
              specimen,
            };
            if(glass.width < glass.height) {
              [glass.width, glass.height] = [glass.height, glass.width];
            }
            res.push(glass);
          }
        };
        
        const calc_order = ox?.calc_order;
        if(Array.isArray(elm?.row_spec?.[prm.ref]?.keys)) {
          elm.row_spec[prm.ref].keys.forEach((key) => {
            const parts = key.split(':'); // ref:specimen:cnstr
            push(calc_order.production.find({characteristic: parts[0]}), parts[1]);
          });
        }
        else if(calc_order) {
          const {glasses} = job_prm.nom;
          for(const row of calc_order.production) {
            if(glasses?.includes(row.nom)) {
              for(let specimen = 1; specimen <= row.quantity; specimen++) {
                push(row, specimen);
              } 
            }
          }
        }
        return res;
      };

      // состав изделий
      prm.products = function ({elm, ox}) {
        const res = [];
        if(!ox) {
          ox = elm?.ox;
        }
        const calc_order = ox?.calc_order;
        elm?.row_spec[prm.ref]?.keys?.forEach((key) => {
          const parts = key.split(':'); // ref:specimen:cnstr
          const row = calc_order.production.find({characteristic: parts[0]});
          if(row) {
            const cx = row.characteristic;
            res.push({
              cx,
              width: cx.x,
              height: cx.y,
              area: cx.s,
              weight: cx.elm_weight(undefined, {elm}),
              specimen: parts[1],
              cnstr: parts[2],
            });
          }
        });

        return res;
      };
    }
  })('compound');

  // наличие связанного профиля ряда
  ((name) => {
    const prm = properties.predefined(name);
    if(prm) {
      // проверка условия
      prm.check_condition = function ({prm_row, elm}) {
        const has = elm.joined_nearests().some((elm2) => elm2.rnum === prm_row.value);
        return prm_row.comparison_type.is('ne') ? !has : has;
        //return utils.check_compare(value, prm_row.value, prm_row.comparison_type, ect);
      }
    }
  })('has_region_elm');
  
  // латиница в маркировке
  ((name) => {
    const prm = properties.predefined(name);
    if(prm) {
      prm.fetch_value = job_prm.builder.mark_latin ? utils.translit : (v) => v;
    }
  })('builder/mark_latin');
  

});
