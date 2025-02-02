
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

    /**
     * @summary Вклад в спецификацию
     * @desc Выполняет метод соответствующего EnmCountCalculatingWays или вызов по цепочке
     * @param {DepositeSpecificationRow} basis
     * @param {Array} [stack] - Предыдущие строки вызова
     */
    byBasis({basis, stack = [], ...other}) {
      const {nom} = basis;
      if(nom instanceof classes.CatNom) {
        basis.count_calc_method.calculate({specification: this, basis, stack, ...other});
      }
      else {
        stack.push(basis);
        nom.calculateSpec({specification: this, stack, ...other});
      }
    }

  }
  classes.CatSpecifications = CatSpecifications;
}
