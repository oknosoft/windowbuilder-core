
import {EditorInvisible} from '../../geometry/paper/EditorInvisible';

export function predefined(root) {
  const {
    enm: {orientations, positions, elmTypes, comparisonTypes: ect, cnnSides},
    cch: {properties},
    cat: {formulas, clrs, productionParams, nom},
    classes, utils, jobPrm} = root;

  // стандартная часть создания fake-формулы
  function formulate(name) {
    const prm = properties.predefined(name);
    if(prm) {
      // fake-формула
      //if(prm.calculated.empty()) {
        prm.calculated = formulas.create({ref: prm.ref, name: `predefined-${name}`});
      //}
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
              if(elm instanceof classes.DpBuyersOrderProductionRow || elm instanceof classes.DocCalcOrder.FakeElm) {
                clr = elm.clr;
              }
              else {
                ox.inserts.find_rows({cnstr}, row => (clr = row.clr));
              }
              return clr;
            };
            break;

          case 'clr_elm':
            _data._formula = function (obj) {
              return obj?.elm?.clr || clrs.get();
            };
            break;

          case 'direction':
            _data._formula = function (obj) {
              let {elm, layer} = obj;
              if(!layer && elm) {
                layer = elm.layer;
              }
              return layer?.direction;
            };
            break;

          case 'inset':
            _data._formula = function ({elm, prm_row, ox, row}) {

              // если запросили вставку соседнего элемента состава заполнения, возвращаем массив
              if(prm_row?.origin?.is('nearest')){
                if(elm instanceof EditorInvisible.Filling) {
                  const res = new Set();
                  ox.glass_specification.find_rows({elm: elm.elm}, ({inset}) => {
                    if(row && inset !== row._owner?._owner) {
                      res.add(inset);
                    }
                  });
                  return Array.from(res);
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
            _data._formula = function ({elm, prm_row, ox, row}) {

              // если запросили вставку состава заполнения, возвращаем массив
              if(elm instanceof EditorInvisible.Filling || elm?.is_glass) {
                const res = new Set();
                ox.glass_specification.find_rows({elm: elm.elm}, ({inset}) => {
                  if(!inset.insert_glass_type.empty()) {
                    res.add(inset.insert_glass_type);
                  }
                });
                return Array.from(res);
              }

              return elm?.inset;
            };
            break;

          case 'elm_weight':
            _data._formula = function (obj) {
              const {elm, prm_row, ox} = obj || {};
              let weight = elm.weight || 0;
              if(!weight && prm_row.origin.is('product') && ox) {
                weight = ox.elm_weight();
              }
              return weight;
            };
            break;

          case 'layer_weight':
            _data._formula = function (obj) {
              let {project, elm, layer, prm_row} = obj;
              if(!layer && elm) {
                layer = elm.layer;
              }
              if(!layer) {
                return 0;
              }
              const weights = [0];
              const contours = (layer.layer && layer.sys.flap_weight_max) ? layer.layer.contours : [layer];
              for(const cnt of contours) {
                if(cnt === layer || !cnt.furn.open_type.is('Неподвижное')) {
                  //weights.push(Math.ceil(ox.elm_weight(-cnt.cnstr)));
                }
              }
              return Math.max(...weights);
            };
            break;

          case 'up_glasses_weight':
            _data._formula = function ({elm, elm2, ox}) {
              let weight = 0;
              if(elm2 instanceof EditorInvisible.Profile && !(elm instanceof EditorInvisible.Profile)) {
                elm = elm2;
              }
              if(elm?.orientation?.is('hor')) {
                const {top} = elm.nearest_glasses;
                if(top?.length) {
                  weight = (ox || elm.ox).elm_weight(top.map((glass) => glass.elm));
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
                if(glasses?.includes(row.nom)) {
                  return true;
                }
              }
              return false;
            };
            break;

          case 'nearest_gl_thickness':
            _data._formula = function ({elm, elm2, project}) {
              const {GeneratrixElement} = project._scope; 
              if(elm instanceof GeneratrixElement.Adjoining) {
                elm = elm.nearest();
                elm2 = null;
              }
              if(elm2 instanceof GeneratrixElement && !(elm instanceof GeneratrixElement)) {
                [elm, elm2] = [elm2, elm];
              }
              let thickness = elm2?.thickness || 0;
              if(!thickness && elm?.joinedGlasses) {
                thickness = Math.max(...elm.joined_glasses().map((gl) => gl.thickness || 0));
              }
              return thickness;
            };
            break;

          case 'nearest_gl_var':
            _data._formula = function ({elm}) {
              if(elm instanceof EditorInvisible.ProfileAdjoining) {
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
            _data._formula = function ({elm}) {
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
            _data._formula = function ({elm}) {
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
            _data._formula = function ({elm, elm2}) {
              if(!(elm instanceof EditorInvisible.ProfileItem) && elm2 instanceof EditorInvisible.ProfileItem) {
                elm = elm2;
              }
              return elm?.orientation || elm2?.orientation || orientations.get();
            };
            break;

          case 'elm_pos':
            _data._formula = function ({elm, elm2}) {
              if(!(elm instanceof EditorInvisible.ProfileItem) && elm2 instanceof EditorInvisible.ProfileItem) {
                elm = elm2;
              }
              return elm?.pos || positions.get();
            };
            break;

          case 'node_pos':
            _data._formula = function ({elm, node}) {
              if(elm && node) {
                if(elm instanceof EditorInvisible.ProfileSegment) {
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
                if(elm instanceof EditorInvisible.ProfileSegment) {
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

          case 'joins_last_elm':
            _data._formula = function ({elm, elm2, prm_row, node}) {
              if(!(elm instanceof EditorInvisible.ProfileItem) && elm2 instanceof EditorInvisible.ProfileItem) {
                elm = elm2;
              }
              if(elm instanceof EditorInvisible.ProfileSegment) {
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
            break;

          case 'elm_type':
            _data._formula = function ({elm}) {
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
              return obj?.ox?.y || 0;
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
            
          case 'row_nom':
            _data._formula = function ({elm}) {
              return elm?.nom || nom.get();
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
    'direction',        // направление открывания
    'up_glasses_weight',// масса заполнений, опирающихся на профиль
    'has_glasses',      // бит в заказе есть заполнения
    'has_glasses_separately',// бит в заказе есть заполнения отдельно
    'elm_weight',       // масса элемента
    'elm_orientation',  // ориентация элемента
    'elm_pos',          // положение элемента
    'node_pos',         // положение узла профиля
    'layer_weight',     // масса слоя с учётом признака 'Фильтр по тяжелой створке'
    'is_node_last',     // крайний по координатам узел в текущем слое
    'joins_last_elm',   // примыкает крайний элемент
    'flap_overlay',     // есть наложение створок
    'flap_overlay_axis',// есть наложение створок с осями поворота
    'cnn_side',         // сторона соединения (изнутри-снаружи)
    'elm_type',         // тип элемента
    'elm_rectangular',  // прямоугольность элемента
    'branch',           // отдел абонента текущего контекста
    'inset',            // вставка текущего элемента
    'inserts_glass_type',  // тип вставки заполнения
    'clr_product',      // цвет изделия
    'clr_inset',        // цвет вставки в элемент
    'clr_elm',          // цвет элемента с поправкой на строку спецификации
    'handle_height',    // высота ручки
    'width',            // ширина из параметра
    'height',           // высота слоя или изделия
    'region',           // ряд
    'is_composite',     // у элемента составной цвет
    'rotation_axis',    // у слоя есть ось поворота
    'nearest_gl_thickness',// толщина примыкающего заполнения
    'nearest_gl_var',   // бит отличия толщин примыкающих заполнений
    'nearest_flap_z',   // z-индекс примыкающей створки
    'row_nom',          // номенклатура элемента
  ]) {
    formulate(name);
  }
}
