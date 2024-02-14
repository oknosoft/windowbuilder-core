
export const exclude = [/*'cat.nom'*/];

export function classes({cat, classes, symbols}, exclude)  {
  const {CatObj} = classes;
  const {get, set} = symbols;

  /*
  
class CatNom extends CatObj{
    get width(){return this[get]('width')}
    set width(v){this[set]('width',v)}
    
  }
  classes.CatNom = CatNom;

  cat.create('nom');
   
  */
}
