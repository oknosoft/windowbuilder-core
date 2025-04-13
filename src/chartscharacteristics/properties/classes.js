
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
      return [];
    }

    linkedValues(links, context, values) {
      
    }
    
  }
  classes.CchProperties = CchProperties;

  md.once('complete_loaded', () => import('./predefined')
    .then(({predefined}) => predefined(root)));
     
}
