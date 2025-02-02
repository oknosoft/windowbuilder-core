
export function countCalculatingWays({enm, classes, symbols, utils}) {

  const {EnumManager, EnumObj} = classes;

  class EnmCountCalculatingWaysManager extends EnumManager {
    
  }
  classes.EnmCountCalculatingWaysManager = EnmCountCalculatingWaysManager;
  
  const methods = {
    element({specification, basis, stack, elm, layer, ...other}) {
      const {quantity, nom} = basis;
      if(!quantity && !nom.is_procedure) {
        return;
      }
      const specRow = specification.specRow({elm, layer});
      specRow.nom = nom;
    },
    
    coloring() {
      
    },
    
    area() {
      
    },
    
    len_prm() {
      
    },
    
    not_found() {
      throw new Error(`Способ расчёта '${this.synonym}' не поддержан`);
    }
  };

  class EnmCountCalculatingWays extends EnumObj {
    calculate({specification, basis, stack, ...other}) {
      (methods[this.latin] || methods.not_found).call(this, {specification, basis, stack, ...other});
    }
  }
  classes.EnmCountCalculatingWays = EnmCountCalculatingWays;
}
