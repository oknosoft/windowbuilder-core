
import {countCalculatingWays} from './countCalculatingWays';
import {predefinedFormulas} from './predefinedFormulas';

export const exclude = ['enm.cnnTypes', 'enm.positions', 'enm.openTypes', 'enm.countCalculatingWays', 'enm.predefinedFormulas'];

export function classes({enm, classes, symbols, utils, md}, exclude)  {

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

  class EnmOpenTypesManager extends EnumManager {
    isOpening (v) {
      if(!v || v.empty() || v == this.no || v == this.static) {
        return false;
      }
      return true;
    }
  }
  classes.EnmOpenTypesManager = EnmOpenTypesManager;

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
    
    eq(pos) {
      if(!pos || pos.empty() || pos.is('any') || this.empty() || this.is('any') || pos === this) {
        return true;
      }
    }
  }
  classes.EnmPositions = EnmPositions;
  
  // md.on('managersCreateed', () => {
  //   const {elmTypes} = enm;
  //   Object.defineProperty(elmTypes, 'glasses', {value: [elmTypes.compound, elmTypes.glass]});
  // });

  countCalculatingWays({enm, classes, symbols, utils});
  predefinedFormulas({enm, classes, symbols, utils});
}
