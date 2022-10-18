/**
 * Вычисляемые параметры выбора
 *
 * @module cat_choice_params
 *
 * Created by Evgeniy Malyarov on 09.05.2019.
 */

exports.CatChoice_paramsManager = class CatChoice_paramsManager extends Object {

  load_array(aattr, forse) {
    const objs = super.load_array(aattr, forse);
    const {md, utils} = $p;
    // бежим по загруженным объектам
    for(const obj of objs) {
      // учитываем только те, что не runtime
      if(obj.runtime) {
        continue;
      }
      // пропускаем отключенные
      if(obj.disabled) {
        continue;
      }
      // выполняем формулу условия
      if(!obj.condition_formula.empty() && !obj.condition_formula.execute(obj)) {
        continue;
      }
      // для всех полей из состава метаданных
      obj.composition.forEach(({field}) => {
        const path = field.split('.');
        const mgr = md.mgr_by_class_name(`${path[0]}.${path[1]}`);
        if(!mgr) {
          return;
        }
        // получаем метаданные поля
        let mf = mgr.metadata(path[2]);
        if(path.length >= 4) {
          mf = mf.fields[path[3]];
        }
        if(!mf) {
          return;
        }
        if(!mf.choice_params) {
          mf.choice_params = [];
        }
        // дополняем отбор с поддержкой групп ИЛИ
        const or = new Map();
        for(const row of obj.key.params) {
          if(!or.has(row.area)) {
            or.set(row.area, []);
          }
          or.get(row.area).push(row);
        }
        if(or.size > 1) {
          const vmgr = md.mgr_by_class_name(mf.type.types[0]);
          if(vmgr) {
            const path = new Set();
            for(const grp of or.values()) {
              for(const row of grp) {
                const {_obj, comparison_type, property} = row;
                let v
                if(!property.empty()) {
                  v = property.extract_value(row);
                }
                else if(_obj.txt_row) {
                  v = _obj.txt_row.split(',');
                }
                else if(_obj.value) {
                  v = _obj.value;
                }
                vmgr.find_rows({[obj.field || 'ref']: {[comparison_type.valueOf()]: v}}, (o) => {
                  path.add(o);
                });
              }  
            }            
            mf.choice_params.push({
              name: obj.field || 'ref',
              path: {in: Array.from(path)}
            });
          }
        }
        else {
          obj.key.params.forEach((row) => {
            const {_obj, comparison_type, property} = row;
            let v
            if(!property.empty()) {
              v = property.extract_value(row);
            }
            else if(_obj.txt_row) {
              v = _obj.txt_row.split(',');
            }
            else if(_obj.value) {
              v = _obj.value;
            }
            else {
              return;
            }
            mf.choice_params.push({
              name: obj.field || 'ref',
              path: {[comparison_type.valueOf()]: v}
            });
          });
        }
      });
    }
    return objs;
  }
}
