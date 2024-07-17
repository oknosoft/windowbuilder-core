
export const exclude = [/*'cat.inserts'*/];

export function classes({cat, classes, symbols}, exclude)  {

  const {get, set} = symbols;

  class CatInserts extends classes.CatInserts {

    mainRows(elm) {
      const {specification} = this;
      const rows = specification.filter(({is_main_elm}) => is_main_elm);
      if(!rows.length && specification.length){
        rows.push(specification[0]);
      }
      if(rows.length > 1) {
        /*
const {check_params} = ProductsBuilding;
const ox = elm.prm_ox || elm.ox;
const filtered = main_rows.filter((row) => {
return this.checkMainRestrictions(row, elm) && check_params({
 params: this.selection_params,
 ox,
 elm,
 row_spec: row,
 cnstr: 0,
 origin: elm.fake_origin || 0,
});
});
return filtered.length ? filtered : [main_rows[0]];
*/
      }
      return rows;
    }

    checkMainRestrictions(row, elm) {
      
    }
    
    nom(elm) {
      let nom;
      const rows = this.mainRows(elm);

      if(rows.length && rows[0].nom instanceof classes.CatInserts){
        if(rows[0].nom == this) {
          nom = cat.nom.get();
        }
        else {
          nom = rows[0].nom.nom(elm);
        }
      }
      else if(rows.length){
        if(elm && !rows[0].formula.empty()) {
          try {
            const fnom = rows[0].formula.execute({elm});
            nom = fnom instanceof classes.CatNom ? fnom : rows[0].nom;
          }
          catch (e) {
            nom = rows[0].nom;
          }
        }
        else if(elm && rows[0].algorithm.is('nom_prm')) {
          nom = rows[0].nom;
          const prm_row = this.selection_params.find({elm: rows[0].elm, origin: enm.plan_detailing.algorithm});
          if(prm_row) {
            const prm_nom = prm_row.param.extract_pvalue({ox: elm.ox, elm, prm_row});
            if(prm_nom && !prm_nom.empty()) {
              nom = prm_nom;
            }
          }
        }
        else {
          nom = rows[0].nom;
        }
      }
      else {
        nom = cat.nom.get();
      }
      return nom;
    }
  }

  classes.CatInserts = CatInserts;
  
  /*
  
  cat.create('inserts');
     
  */
}
