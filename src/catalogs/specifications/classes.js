
export const exclude = [/*'cat.specifications'*/];

export function classes({cat, classes, symbols}, exclude)  {
  const {CatObj} = classes;
  const {get, set} = symbols;

  class CatSpecifications extends classes.CatSpecifications {

    /**
     * @summary Добавляет строку в табчасть состава
     * @desc Попутно заполняет реквизиты принадлежности к элементу-слою
     * @param {BuilderElement} [elm]
     * @param {Contour} [layer]
     * @return {CatSpecificationsCompositionRow}
     */
    specRow({elm, layer}) {
      const row = this.composition.add({elm: elm?.index || -layer.index});
      return row;
    }

    procRow({elm, layer}) {
      const row = this.procedures.add({elm: elm?.index || -layer.index});
      return row;
    }
    
    byBasis({elm, layer, basis}) {
      const {nom, algorithm, count_calc_method, angle_calc_method, sz, offsets, coefficient, formula, specify} = basis;
      if(nom instanceof classes.CatNom) {
        
      }
      else {
        
      }
      
    }

  }
  classes.CatSpecifications = CatSpecifications;
}
