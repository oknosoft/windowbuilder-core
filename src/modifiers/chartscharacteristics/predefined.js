
/**
 * Предопределенное поведение параметров
 *
 * Created 05.12.2021.
 */

$p.adapters.pouch.once('pouch_doc_ram_loaded', () => {
  const {
    enm: {orientations, positions, elm_types, comparison_types: ect, cnn_sides},
    cch: {properties},
    cat: {formulas, clrs, production_params}, 
    EditorInvisible, utils} = $p;

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
            if(elm instanceof $p.DpBuyers_orderProductionRow || elm instanceof $p.DocCalc_order.FakeElm) {
              clr = elm.clr;
            }
            else {
              ox.inserts.find_rows({cnstr}, row => (clr = row.clr));
            }
            return clr;
          };
          break;

        case 'inset':
          _data._formula = function ({elm, prm_row, ox, row}) {

            // если запросили вставку соседнего элемента состава заполнения, возвращаем массив
            if(prm_row?.origin?.is('nearest')){
              if(elm instanceof $p.EditorInvisible.Filling) {
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
            if(elm instanceof $p.EditorInvisible.Filling) {
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
          
        case 'nearest_gl_thickness':
          _data._formula = function ({elm, elm2}) {
            if(elm instanceof EditorInvisible.ProfileAdjoining) {
              elm = elm.nearest();
              elm2 = null;
            }
            let thickness = elm2 ? elm2.thickness : 0;
            if(!thickness && elm?.joined_glasses) {
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
          _data._formula = function ({elm, elm2}) {
            if(!(elm instanceof EditorInvisible.ProfileItem) && elm2 instanceof EditorInvisible.ProfileItem) {
              elm = elm2;
            }
            if(elm instanceof EditorInvisible.ProfileSegment) {
              elm = elm.parent;
            }
            if(elm) {
              const {bounds} = elm.layer;
              const {sticking} = consts;
              for(const node of ['b', 'e']) {
                const pt = elm[node];
                if((pt.x < bounds.left + sticking) || (pt.x > bounds.right - sticking)) {
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

        default:
          _data._formula = function () {};
        }
      }
    }
    return prm;
  }

  // создаём те, где нужна только формула со стандартным check_condition
  for(const name of [
    'clr_product',      // цвет изделия
    'up_glasses_weight',// масса заполнений, опирающихся на профиль
    'elm_weight',       // масса элемента
    'elm_orientation',  // ориентация элемента
    'elm_pos',          // положение элемента
    'node_pos',         // положение узла профиля
    'is_node_last',     // крайний по координатам узел в текущем слое
    'joins_last_elm',   // примыкает крайний элемент
    'cnn_side',         // сторона соединения (изнутри-снаружи)
    'elm_type',         // тип элемента
    'elm_rectangular',  // прямоугольность элемента
    'branch',           // отдел абонента текущего контекста
    'inset',            // вставка текущего элемента
    'inserts_glass_type',  // тип вставки заполнения
    'clr_inset',        // цвет вставки в элемент
    'handle_height',    // высота ручки
    'width',            // ширина из параметра
    'height',           // высота слоя или изделия
    'region',           // ряд
    'is_composite',     // у элемента составной цвет
    'rotation_axis',    // у слоя есть ось поворота
    'nearest_gl_thickness',// толщина примыкающего заполнения
    'nearest_gl_var',   // бит отличия толщин примыкающих заполнений
    'nearest_flap_z',   // z-индекс примыкающей створки 
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
        const calc_order = ox?.calc_order;
        elm?.row_spec[prm.ref]?.keys?.forEach((key) => {
          const parts = key.split(':'); // ref:specimen:cnstr
          const row = calc_order.production.find({characteristic: parts[0]});
          for(const glrow of row?.characteristic?.glasses || []) {
            res.push({
              formula: glrow.formula,
              thickness: glrow.thickness,
              width: glrow.width.round(1),
              height: glrow.height.round(1),
              area: glrow.s,
              is_rectangular: glrow.is_rectangular,
              is_sandwich: glrow.is_sandwich,
              weight: row.characteristic.elm_weight(glrow.elm),
            });
          }
        });

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
            res.push(row.characteristic);
          }
        });

        return res.map((cx) => {
          const weight = cx.elm_weight();
          return {
            width: cx.x,
            height: cx.y,
            area: cx.s,
            weight,
          };
        });
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
  

});
