
exports.CatSupplier_restrictionsManager = class CatSupplier_restrictionsManager extends Object {

  load_array(aattr, force) {
    const res = super.load_array(aattr, force);
    if(!this.index) {
      this.index = new Map();
    }
    const {index} = this;
    for(const {composition} of res) {
      for(const {period, nom, characteristic, procedure} of composition) {
        if(!index.has(nom)) {
          index.set(nom, []);
        }
        index.get(nom).push({period, characteristic, procedure});
      }
    }
    for(const [nom, rows] of index) {
      rows.sort((a, b) => a.period - b.period);
    }

    return res;
  }
  
  check(specification, noms, date) {
    for(const [nom, cxs] of noms) {
      
    }
  }
};
