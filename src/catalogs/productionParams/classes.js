
export const exclude = [/*'cat.productionParams'*/];

export function classes({enm, cat, classes, symbols}, exclude)  {

  const {get, set} = symbols;

  class CatProductionParams extends classes.CatProductionParams {

    /**
     * Доступна ли вставка в данной системе в качестве elmType
     * @param {CatInserts} inset
     * @param {EnmElmTypes|Array.<EnmElmTypes>} elmType
     * @return {boolean}
     */
    isElmType(inset, elmType) {
      const inserts = this.inserts(elmType);
      return inserts.includes(inset);
    }

    /**
     * @summary Возвращает доступные в данной системе элементы (вставки)
     * @param {EnmElmTypes|Array.<EnmElmTypes>} elmTypes - допустимые типы элементов
     * @param {BuilderElement} [elm] - указатель на элемент или проект, чтобы отфильтровать по ключам
     * @return {Array.<CatInserts|CatProductionParamsElmntsRow>}
     */
    inserts({elmTypes, elm}){
      const noms = new Set();
      if(elm && !elmTypes) {
        elmTypes = [elm.elmType];
      }
      this.elmnts.findRows({elm_type: elmTypes}, row => {
        noms.add(row.nom);
      });
      return Array.from(noms);
    }
    
  }

  classes.CatProductionParams = CatProductionParams;

  /*
  
  cat.create('productionParams');
     
  */
}
