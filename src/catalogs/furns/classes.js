
// если класс не включён в exclude, заготовки конструкторов система создаст автоматически
export const exclude = [/*'cat.furns'*/];

export function classes({cat, enm, classes, symbols}, exclude)  {
    
  const {CatFurns: CatObj, CatFurnsManager: CatManager} = classes;
  const {get, set} = symbols;
  
  class CatFurnsManager extends CatManager {

  }
  classes.CatFurnsManager = CatFurnsManager;

  class CatFurns extends CatObj{
    
  }
  classes.CatFurns = CatFurns;
     
}
