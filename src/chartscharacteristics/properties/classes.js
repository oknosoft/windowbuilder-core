
// если класс не включён в exclude, заготовки конструкторов система создаст автоматически
export const exclude = [/*'cch.properties'*/];

export function classes(root, exclude)  {
    
  const {cat, enm, classes, symbols, md, jobPrm} = root;
  const {CchProperties: CchObj, CchPropertiesManager: CchManager} = classes;
  const {get, set} = symbols;

  class CchProperties extends CchObj {

    /**
     * @summary Проверяет условие в строке отбора
     * @param {DepositeSpecificationRow} row_spec
     * @param {SelectionParamsRow} prm_row
     * @param {BuilderElement} [elm]
     * @param {BuilderElement} [elm2]
     * @param {String} [node]
     * @param {String} [node2]
     * @param {Contour} [layer] - для случая, когда не указан элемент
     * @param {CatProducts} [ox] - для случая, когда не указаны элемент и слой
     */
    checkCondition({row_spec, prm_row, elm, elm2, node, node2, layer, project, order, ...other}) {
      let src = prm_row
      return true;
    }

    branchValue({project}) {
      let branch = project?.branch;
      if(!branch.empty()) {
        const value = branch._extra(this);
        if(value !== undefined) {
          return value;
        }
        branch = branch.parent;
      }
      return jobPrm.abonent.prmDefault(this);
    }

    templateValue({project}) {
      const {template} = project;
    }

    paramsLinks(attr) {
      // первым делом, выясняем, есть ли ограничитель на текущий параметр
      if(!this.hasOwnProperty('_links')) {
        this._links = cat.paramsLinks.findRows({slave: this});
      }

      return this._links.filter((link) => {
        //use_master бывает 0 - один ведущий, 1 - несколько ведущих через И, 2 - несколько ведущих через ИЛИ
        const use_master = link.use_master || 0;
        let ok = true && use_master < 2;
        //в зависимости от use_master у нас массив либо из одного, либо из нескольких ключей ведущиъ для проверки
        const arr = !use_master ? [{key: link.master}] : link.leadings;

        arr.forEach((row_key) => {
          let ok_key = true;
          // для всех записей ключа параметров сначала строим Map ИЛИ
          const or = new Map();
          for(const row of row_key.key.params) {
            if(!or.has(row.area)) {
              or.set(row.area, []);
            }
            or.get(row.area).push(row);
          }
          for(const grp of or.values()) {
            let grp_ok = true;
            for(const row of grp) {
              // выполнение условия рассчитывает объект CchProperties
              grp_ok = row.property.checkCondition(attr);
              // если строка условия в ключе не выполняется, то дальше проверять его условия смысла нет
              if (!grp_ok) {
                break;
              }
            }
            ok_key = grp_ok;
            if(ok_key) {
              break;
            }
          }

          //Для проверки через ИЛИ логика накопительная - надо проверить все ключи до единого
          if (use_master == 2){
            ok = ok || ok_key;
          }
          //Для проверки через И достаточно найти один неподходящий ключ, чтобы остановиться и признать связь неподходящей
          else if (!ok_key){
            ok = false;
            return false;
          }
        });
        //Конечный возврат в функцию фильтрации массива связей
        return ok;
      });
    }

    linkedValues(links, context, values) {
      
    }
    
  }
  classes.CchProperties = CchProperties;

  md.once('complete_loaded', () => import('./predefined')
    .then(({predefined}) => predefined(root)));
     
}
