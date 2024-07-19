
export const exclude = ['enm.cnnTypes'];

export function classes({enm, classes, symbols, utils}, exclude)  {

  const {EnumManager} = classes;
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
}
