
// если класс не включён в exclude, заготовки конструкторов система создаст автоматически
export const exclude = [/*'cat.furns'*/];

export function classes({cat, enm, classes, symbols}, exclude)  {
    
  const {CatFurns: CatObj, CatFurnsManager: CatManager} = classes;
  const {get, set} = symbols;
  
  class CatFurnsManager extends CatManager {

  }
  classes.CatFurnsManager = CatFurnsManager;

  class CatFurns extends CatObj {

    /**
     * Вычисляет штульповость фурнитуры
     * 0 - не штульповая, 1 - активная, 2 - пассивная
     * @return {number}
     */
    shtulpKind() {
      let res = 0;
      this.open_tunes.forEach(({shtulp_available, shtulp_fix_here}) => {
        if(shtulp_available && !res) {
          res = 1;
        }
        if(shtulp_fix_here) {
          res = 2;
        }
      });
      return res;
    }
  }
  classes.CatFurns = CatFurns;
     
}
