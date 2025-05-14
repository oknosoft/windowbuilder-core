
export const exclude = [/*'cat.productionParams'*/];

export function classes({enm, cat, classes, symbols}, exclude)  {

  const {get, set} = symbols;

  class CatProductionParams extends classes.CatProductionParams {

    /**
     * Доступна ли вставка в данной системе в качестве elmType
     * @param {BuilderElement} [elm]
     * @param {CatInserts} [inset]
     * @param {EnmElmTypes|Array.<EnmElmTypes>} elmType
     * @return {boolean}
     */
    isElmType({elm, inset, elmType}) {
      const inserts = this.inserts({elm, elmTypes: elmType});
      if(!inset && elm && inserts.length) {
        inset = elm.inset;
      }
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
        if(pos.eq(row.pos)) {
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
          else {
            noms.push(row);
          }
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
      this.appendGlasses({elmTypes, elm, noms});
      return noms.map(v => v.nom);
    }

    thicknesses(rows) {
      if(!this._thicknesses) {
        const thin = new Set();
        for(const {nom} of rows) {
          const thickness = nom.thickness();
          thickness && thin.add(thickness);
        }
        this._thicknesses = Array.from(thin).sort((a, b) => a - b);
        Object.defineProperties(this._thicknesses, {
          min: {value: this._thicknesses[0] || 0},
          max: {value: this._thicknesses[this._thicknesses.length - 1] || Infinity},
        });
      }
      return this._thicknesses;
    }

    appendGlasses({elmTypes, elm, noms}){
      if(elm?.is('Filling') || (Array.isArray(elmTypes) ? elmTypes.some(v => v.is('glass')) : elmTypes.is('glass'))) {
        // glass_thickness:
        // 0 - по толщинам из списка
        // 1 - по списку
        // 2 - по вилке толщин (min max)
        // 3 - без ограничений
        switch (this.glass_thickness) {
          case 0: {
            const thicknesses = this.thicknesses(noms);
            break;
          }
          case 2: {
            break;
          }
          case 3: {
            break;
          }
        }
      }
    }
    
  }

  classes.CatProductionParams = CatProductionParams;

  /*
  
  cat.create('productionParams');
     
  */
}
