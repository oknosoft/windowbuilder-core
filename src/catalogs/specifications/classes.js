
export const exclude = [/*'cat.specifications'*/];

export function classes({cat, classes, symbols}, exclude)  {
  const {CatObj} = classes;
  const {get, set} = symbols;

  class CatSpecifications extends classes.CatSpecifications {
    
    specRow({elm, layer}) {
      const row = this.composition.add({elm: elm?.index || -layer.index});
      return row;
    }

    procRow({elm, layer}) {
      const row = this.procedures.add({elm: elm?.index || -layer.index});
      return row;
    }

  }
  classes.CatSpecifications = CatSpecifications;
}
