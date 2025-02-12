
// если класс не включён в exclude, заготовки конструкторов система создаст автоматически
export const exclude = [/*'cch.properties'*/];

export function classes(root, exclude)  {
    
  const {cat, enm, classes, symbols, md} = root;
  const {CchProperties: CchObj, CchPropertiesManager: CchManager} = classes;
  const {get, set} = symbols;
  
  class CchPropertiesManager extends CchManager {

  }
  classes.CchPropertiesManager = CchPropertiesManager;

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

    contextValue({elm, elm2, node, node2, layer, inset, prm_row, ox, cnstr}) {

      const {inheritance} = this;
      
      // для некоторых параметров, значения живут не в изделии, а в отделе абонента
      if(inheritance === 3) {
        return this.branchValue({elm, layer, ox});
      }
      else if(inheritance === 5) {
        return this.templateValue({elm, layer, ox});
      }
      
    }

    calculatedValue() {

    }

    branchValue({elm, layer, ox}) {
      const project = elm?.project || layer?.project;
      let branch = project?.branch;
      if(!branch && ox) {
        branch = ox.calc_order?.organization?._extra?.('branch');
        if(!branch || branch.empty()) {
          branch = ox.calc_order?.manager?.branch;
        }
      }
      const value = branch?._extra(this);
      if(value !== undefined) {
        return value;
      }
      let brow;
      if(ox?.params) {
        const {blank} = this._manager.root.utils;
        brow = ox.params.find({param: this, cnstr: layer?.cnstr, inset: blank.guid});
        if(!brow && layer?.layer) {
          return this.branchValue({elm, layer: layer.layer, ox});
        }
      }
      return brow ? brow.value : this.type.fetchType();
    }

    templateValue({project, ox}) {
      
    }
    
  }
  classes.CchProperties = CchProperties;

  md.once('complete_loaded', () => import('./predefined')
    .then(({predefined}) => predefined(root)));
     
}
