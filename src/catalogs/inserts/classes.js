
export const exclude = [/*'cat.inserts'*/];

export function classes({cat, classes, symbols}, exclude)  {
  const {CatObj} = classes;
  const {get, set} = symbols;

  /*
  
class CatInserts extends CatObj{
    get insert_type(){return this[get]('insert_type')}
    set insert_type(v){this[set]('insert_type',v)}
    get insert_glass_type(){return this[get]('insert_glass_type')}
    set insert_glass_type(v){this[set]('insert_glass_type',v)}

    nom(elm) {
      return 'nom';
    }
  }
  classes.CatInserts = CatInserts;

  cat.create('inserts');
     
  */
}
