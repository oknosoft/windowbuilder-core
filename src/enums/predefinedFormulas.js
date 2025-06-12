
export function predefinedFormulas({enm, classes, symbols, utils}) {

  const {own} = symbols;
  const {EnumManager, EnumObj} = classes;

  class EnmPredefinedFormulasManager extends EnumManager {

  }
  classes.EnmPredefinedFormulasManager = EnmPredefinedFormulasManager;

  const methods = {
    gb_long(attr, short) {
      const {rib, basis, angle} = attr;
      if(rib) {
        const {edge, prev, next, b, e} = rib;
        const {sz, coefficient, nom} = basis;
        let width = 0;
        if(nom instanceof classes.CatNom) {
          width = nom.width;
        }
        else if(nom instanceof classes.CatInserts) {
          for(const row of nom.specification) {
            if(row.checkRestrictions(attr) && row.checkParams(attr)) {
              if(row.nom instanceof classes.CatNom && row.nom.width) {
                width = row.nom.width;
                break;
              }
            }
          }
        }
        else {
          throw new Error(`Неверный тип '${nom.toString()}' для алгоритма '${this.synonym}'`);
        }
        if(!width) {
          throw new Error(`Не удалось определить толщину штапика '${nom.toString()}' для алгоритма '${this.synonym}'`);
        }
        // строим эквидистанты от рёбер заполнения
        const elongate = 120;
        const currPath = edge.profile[edge.isOuter() ? 'outer' : 'inner'].getSubPath(b, e);
        const curr0 = currPath.equidistant(edge.profile.nom.szc - sz, elongate);
        const curr1 = currPath.equidistant(edge.profile.nom.szc - sz - width, elongate);

        const prevPath = prev.edge.profile[prev.edge.isOuter() ? 'outer' : 'inner'].getSubPath(prev.b, prev.e);
        const prev0 = prevPath.equidistant(prev.edge.profile.nom.szc - sz - (short ? width : 0), elongate);

        const nextPath = next.edge.profile[next.edge.isOuter() ? 'outer' : 'inner'].getSubPath(next.b, next.e);
        const next0 = nextPath.equidistant(next.edge.profile.nom.szc - sz - (short ? width : 0), elongate);

        const pp0 = curr0.intersectPoint(prev0, b, true);
        const pp1 = curr1.intersectPoint(prev0, b, true);
        const pn0 = curr0.intersectPoint(next0, e, true);
        const pn1 = curr1.intersectPoint(next0, e, true);
        attr.currentLength = (curr0.lmax([pp0, pp1, pn0, pn1]) * (coefficient || 0.001)).round(4);
        attr.ignSz = basis;

      }
      return attr;
    },

    gb_short(attr) {
      return methods.gb_long.call(this, attr, true)
    },

    clr_prm(attr) {
      const {basis, elm, layer, project} = attr;
      const params = elm?.params || layer?.params || project?.props;
      const {selection_params} = basis[own][own];
      const prmRow = selection_params.find({elm: basis.elm, origin: enm.planDetailing.algorithm});
      if(prmRow) {
        attr.clr = params.get(prmRow.param, attr);
      }
      return attr;
    }
  };

  class EnmPredefinedFormulas extends EnumObj {
    patch(attr) {
      if(this.empty()) {
        return attr;
      }
      const method = methods[this.ref];
      if(method) {
        return method.call(this, attr);
      }
      throw new Error(`Алгоритм '${this.synonym}' не поддержан`);
    }
  }
  classes.EnmPredefinedFormulas = EnmPredefinedFormulas;
}
