
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
    const {index} = this;
    const add = new Map();
    for(const [nom, cxs] of noms) {
      if(index.has(nom)) {
        const rows = index.get(nom).filter(row => date >= row.period);
        if(rows.length) {
          for(const cx of cxs) {
            for(const row of rows) {
              const {characteristic} = row;
              if(characteristic === cx) {
                if(!add.has(row.procedure)) {
                  add.set(row.procedure, new Set());
                }
                add.get(row.procedure).add(nom);
              }
            }
          }
        }
      }
    }
    for(const [nom, noms] of add) {
      const row = specification.add({nom, dop: -2});
      row.specify = Array.from(noms).map(v => v.name).join(',');
    }
  }
};
