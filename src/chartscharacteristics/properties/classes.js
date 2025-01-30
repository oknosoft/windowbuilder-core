
// если класс не включён в exclude, заготовки конструкторов система создаст автоматически
export const exclude = [/*'cch.properties'*/];

export function classes({cat, enm, classes, symbols}, exclude)  {
    
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
    checkCondition({row_spec, prm_row, elm, elm2, node, node2, layer, ox, ...other}) {
      return true;
    }
  }
  classes.CchProperties = CchProperties;
     
}
