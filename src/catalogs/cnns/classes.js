
// если класс не включён в exclude, заготовки конструкторов система создаст автоматически
export const exclude = [/*'cat.cnns'*/];

export function classes({cat, enm, classes, symbols}, exclude)  {
    
  const {CatCnns: CatObj, CatCnnsManager: CatManager} = classes;
  const {get, set} = symbols;
  
  const nomCache = {
    i: new Map(),
    t: new Map(),
    a: new Map(),
    ii: new Map(),
    byCnnPoint(cnnPoint, elm2) {
      const {owner: elm1, isT, isI} = cnnPoint;
      const kind = isT ? 't' : (isI ? 'i' : 'a');
      const cache = this[kind];
      let nom1 = elm1.nom;
      let nom2 = (isI || !elm2) ? null : elm2.nom;
      if(nom1?.empty()) {
        nom1 = null;
      }
      if(nom2?.empty()) {
        nom2 = null;
      }
      let c1;
      if(nom1 && (isI || nom2)) {
        if(!cache.has(nom1)) {
          cache.set(nom1, new Map());
        }
        c1 = cache.get(nom1);
        if(!c1.has(nom2)) {
          c1.set(nom2, cat.cnns.byNoms(nom1, nom2, enm.cnnTypes.acn[kind]));
        }
      }
      return {elm1, kind, cnns: c1?.get(nom2) || []};
    },
    clear() {
      for(const fld of 'i,t,a,ii'.split(',')) {
        this[fld].clear();
      }
    }
  };
  const nomCnns = () => {
    
  };
  
  class CatCnnsManager extends CatManager{

    byNoms(nom1, nom2, types) {
      const res = [];
      for(const cnn of this) {
        if(types.includes(cnn.cnn_type)) {
          for(const row of cnn.cnn_elmnts) {
            if(row.nom1 === nom1) {
              if(row.nom2 === nom2 ||
                (row.nom2.empty() && cnn.cnn_elmnts.find((row) => row.nom2 === nom2 && row.nom1.empty()))) {
                res.push(cnn);
                break;
              }
            }
          }
        }
      }
      return res;
    }
    
    nodeCnns(cnnPoint, elm2) {
      const {elm1, cnns, kind} = nomCache.byCnnPoint(cnnPoint, elm2);
      return cnns;
    }
    
    elmCnns(elm1, elm2) {
      const nom1 = elm1.nom;
      const nom2 = elm2.nom;
    }
  }
  classes.CatCnnsManager = CatCnnsManager;

  class CatCnns extends CatObj{

    nom(elm) {
      return 'nom';
    }
  }
  classes.CatCnns = CatCnns;
     
}
