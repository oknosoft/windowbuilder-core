
/**
 * fake-элемент для допвставок и параметров
 *
 * Created 26.11.2021.
 */

class FakePrmElm {
  constructor(owner) {
    const {inserts} = $p.cat; 
    if(owner instanceof Contour) {
      this.layer = owner;
      this.project = owner.project;
      this.inserts = inserts.find_rows({insert_type: 'Контур', available: true});
    }
    else {
      this.project = owner;
      this.inserts = inserts.find_rows({insert_type: 'Изделие', available: true});
    }
  }

  get inset() {
    const {inserts} = this;
    return {
      inserts: {
        count() {
          return inserts.length;
        },
        unload_column() {
          return inserts;
        }
      },
      valueOf() {
        return this.ref;
      },
      get ref() {
        return $p.utils.blank.guid;
      }
    };
  }

  get ox() {
    return this.project.ox;
  }

  get elm() {
    return this.layer ? -this.layer.cnstr : 0;
  }

  get _metadata() {
    return {fields: FakePrmElm.fields};
  }
  
  get info() {
    return this.layer ? `слой ${this.layer.layer ? 'створок' : 'рам'} №${this.layer.cnstr}` : 'изделие';
  }

  region(row) {
    return FakePrmElm.region(row, this.project);
  }

}

FakePrmElm.fields = new Proxy({}, {
  get(target, prop) {
    const param = $p.cch.properties.get(prop);
    if(param) {
      const mf = {
        type: param.type,
        synonym: param.name,
      };
      if(param.Editor) {
        mf.Editor = param.Editor;
      }
      if(param.type.types.includes('cat.property_values')) {
        mf.choice_params = [{
          name: 'owner',
          path: param.ref,
        }];
      }
      return mf;
    }
  }
});

/**
 * Proxy-обёртка над строкой допвставок
 * @param row {CatCharacteristicsInsertsRow}
 * @param target {Scheme}
 * @return {Proxy}
 */
FakePrmElm.region = function region(row, target) {
  const {utils, cch: {properties}, enm} = $p;
  return new Proxy(target, {
    get(target, prop, receiver) {
      switch (prop){
      case 'rnum':
        return row.row;
      case 'irow':
        return row;
      case 'inset':
        return row.inset;
      case 'clr':
        return row.clr;
      default:
        let prow;
        if(utils.is_guid(prop)) {
          const param = properties.get(prop);
          if(!param.empty()) {
            return param.extract_pvalue({
              ox: target.ox,
              cnstr: 0,
              elm: {elm: 0},
              origin: row.inset,
              prm_row: {origin: enm.plan_detailing.get()},
            });
          }
          //prow = target.ox.params.find({param: prop, cnstr: 0, region: 0, inset: row.inset});
        }
        return target[prop];
      }
    },

    set(target, prop, val, receiver) {
      switch (prop) {
      case 'clr':
        row.clr = val;
        break;
      default:
        if(utils.is_guid(prop)) {
          const param = properties.get(prop);
          if(!param.empty() && param.set_pvalue) {
            param.set_pvalue({
              ox: target.ox,
              cnstr: 0,
              elm: {elm: 0},
              origin: row.inset,
              value: val,
            });
          }
          else {
            const {params} = target.ox;
            const prow = params.find({param: prop, cnstr: 0, region: 0, inset: row.inset}) || params.add({param: prop, inset: row.inset});
            prow.value = val;
          }
        }
        else {
          target[prop] = val;
        }
      }
      const project = target instanceof Scheme ? target : target.project;
      project.register_change(true);
      return true;
    }
  });
};

Scheme.FakePrmElm = FakePrmElm;
