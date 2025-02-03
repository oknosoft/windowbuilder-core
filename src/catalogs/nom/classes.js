
export const exclude = [/*'cat.nom'*/];

export function classes({cat, classes, symbols}, exclude)  {
  const {CatNom: CatObj} = classes;
  const {get, set} = symbols;

  class CatNom extends CatObj{
    get presentation(){
      const {article} = this;
      return article ? `${article} ${super.presentation}` : super.presentation; 
    }
  }
  classes.CatNom = CatNom;
}
