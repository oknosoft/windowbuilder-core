
export const exclude = [/*'cat.products'*/];

export function classes({cat, classes, symbols}, exclude)  {
  const {CatProducts: CatObj} = classes;
  const {get, set} = symbols;

  // class CatProducts extends CatObj{
  //   get presentation(){
  //     const {article} = this;
  //     return article ? `${article} ${super.presentation}` : super.presentation; 
  //   }
  // }
  // classes.CatProducts = CatProducts;
}
