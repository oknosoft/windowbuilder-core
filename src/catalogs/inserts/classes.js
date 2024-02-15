
export const exclude = [/*'cat.inserts'*/];

export function classes({cat, classes, symbols}, exclude)  {

  const {get, set} = symbols;

  class CatInserts extends classes.CatInserts {
    nom(elm) {
      return cat.nom.get();
    }
  }

  classes.CatInserts = CatInserts;
  
  /*
  
  cat.create('inserts');
     
  */
}
