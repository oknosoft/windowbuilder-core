
export const exclude = ['enm.cnnTypes', 'enm.positions'];

export function classes({enm, classes, symbols, utils}, exclude)  {

  const {EnumManager, EnumObj} = classes;
  class EnmCnnTypesManager extends EnumManager {
    get acn() {
      const {index} = this;
      if(!index.acn) {
        const {i, ii, long, short, ad, t} = this;
        index.acn = utils.deepFreeze({
          a: [long, short, ad],
          i: [i],
          ii: [ii],
          t: [t],
        });
      }
      return index.acn;
    }
  }
  classes.EnmCnnTypesManager = EnmCnnTypesManager;

  class EnmPositions extends EnumObj {
    invert() {
      const {latin, _manager} = this;
      switch (latin) {
        case 'top':
          return _manager.bottom;
        case 'bottom':
          return _manager.top;
        case 'left':
          return _manager.right;
        case 'right':
          return _manager.left;
      }
      return this;
    }
  }
  classes.EnmPositions = EnmPositions;
}
