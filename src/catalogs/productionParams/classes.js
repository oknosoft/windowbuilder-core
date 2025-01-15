
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
     * @return {Array.<CatInserts>}
     */
    inserts({elmTypes, elm}){
      const noms = [];
      const pos = elm?.pos || enm.positions.any;
      if(elm && !elmTypes) {
        elmTypes = [elm.elmType];
      }
      this.elmnts.findRows({elm_type: elmTypes}, row => {
        if(row.pos.empty() || row.pos.is('any') || pos.empty() || pos.is('any') || row.pos === pos) {
          // TODO: добавить проверку ключа
          if(row.nom instanceof classes.CchPredefinedElmnts) {
            for(const {value} of row.nom.elmnts) {
              noms.push({
                nom: value,
                elm_type: row.elm_type,
                pos: row.pos,
                by_default: row.by_default,
              });
            }
          }
          noms.push(row);
        }
      });
      noms.sort((a, b) => {
        if(a.by_default && !b.by_default) {
          return -1;
        }
        else if(!a.by_default && b.by_default) {
          return 1;
        }
        else {
          if(a.nom.name < b.nom.name) {
            return -1;
          }
          else if(a.nom.name > b.nom.name) {
            return 1;
          }
          else {
            return 0;
          }
        }
      });
      return noms.map(v => v.nom);
    }
    
  }

  classes.CatProductionParams = CatProductionParams;

  /*
  
  cat.create('productionParams');
     
  */
}
