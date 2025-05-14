import selectionParamsRow from '../aggregate/selectionParamsRow';
import depositeSpecificationRow from '../aggregate/depositeSpecificationRow';

export const exclude = ['cat.inserts'];

export function classes({classes, md, utils, symbols, enm, cat, cch}, exclude)  {

  const {get, set, own} = symbols;
  const {CatObj, CatManager, TabularSectionRow} = classes;
  const [DepositeSpecificationObj, DepositeSpecificationRow] = depositeSpecificationRow({CatObj, TabularSectionRow, get, set, own, enm, cch});
  
  class CatInserts extends DepositeSpecificationObj {
    get lmin(){return this[get]('lmin')}
    set lmin(v){this[set]('lmin',v)}
    get lmax(){return this[get]('lmax')}
    set lmax(v){this[set]('lmax',v)}
    get region(){return this[get]('region')}
    set region(v){this[set]('region',v)}
    get article(){return this[get]('article')}
    set article(v){this[set]('article',v)}
    get insert_type(){return this[get]('insert_type')}
    set insert_type(v){this[set]('insert_type',v)}
    get clr(){return this[get]('clr')}
    set clr(v){this[set]('clr',v)}
    get hmin(){return this[get]('hmin')}
    set hmin(v){this[set]('hmin',v)}
    get hmax(){return this[get]('hmax')}
    set hmax(v){this[set]('hmax',v)}
    get smin(){return this[get]('smin')}
    set smin(v){this[set]('smin',v)}
    get smax(){return this[get]('smax')}
    set smax(v){this[set]('smax',v)}
    get for_direct_profile_only(){return this[get]('for_direct_profile_only')}
    set for_direct_profile_only(v){this[set]('for_direct_profile_only',v)}
    get ahmin(){return this[get]('ahmin')}
    set ahmin(v){this[set]('ahmin',v)}
    get ahmax(){return this[get]('ahmax')}
    set ahmax(v){this[set]('ahmax',v)}
    get priority(){return this[get]('priority')}
    set priority(v){this[set]('priority',v)}
    get mmin(){return this[get]('mmin')}
    set mmin(v){this[set]('mmin',v)}
    get mmax(){return this[get]('mmax')}
    set mmax(v){this[set]('mmax',v)}
    get can_rotate(){return this[get]('can_rotate')}
    set can_rotate(v){this[set]('can_rotate',v)}
    get sizeb(){return this[get]('sizeb')}
    set sizeb(v){this[set]('sizeb',v)}
    get clr_group(){return this[get]('clr_group')}
    set clr_group(v){this[set]('clr_group',v)}
    get is_order_row(){return this[get]('is_order_row')}
    set is_order_row(v){this[set]('is_order_row',v)}
    get insert_glass_type(){return this[get]('insert_glass_type')}
    set insert_glass_type(v){this[set]('insert_glass_type',v)}
    get available(){return this[get]('available')}
    set available(v){this[set]('available',v)}
    get slave(){return this[get]('slave')}
    set slave(v){this[set]('slave',v)}
    get is_supplier(){return this[get]('is_supplier')}
    set is_supplier(v){this[set]('is_supplier',v)}
    get split_type(){return this[get]('split_type')}
    set split_type(v){this[set]('split_type',v)}
    get pair(){return this[get]('pair')}
    set pair(v){this[set]('pair',v)}
    get lay_split_types(){return this[get]('lay_split_types')}
    set lay_split_types(v){this[set]('lay_split_types',v)}
    get css(){return this[get]('css')}
    set css(v){this[set]('css',v)}
    get flipped(){return this[get]('flipped')}
    set flipped(v){this[set]('flipped',v)}
    get product_params(){return this[get]('product_params')}
    set product_params(v){this[get]('product_params').load(v)}
    get inserts(){return this[get]('inserts')}
    set inserts(v){this[get]('inserts').load(v)}

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
return this.checkRestrictions(row, elm) && check_params({
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

    thickness(elm) {
      return (elm?.nom || this.nom(elm)).thickness || 0;
    }

    /**
     * @summary Вклад в спецификацию
     */
    calculateSpec({specification, ...other}) {
      for(const basis of this.specification) {
        if(basis.checkRestrictions(other) && basis.checkParams(other)) {
          specification.byBasis({basis, ...other});
        }
      }
    }
  }
  classes.CatInserts = CatInserts;

  class CatInsertsInsertsRow extends TabularSectionRow {
    get inset(){return this[get]('inset')}
    set inset(v){this[set]('inset',v)}
    get key(){return this[get]('key')}
    set key(v){this[set]('key',v)}
    get by_default(){return this[get]('by_default')}
    set by_default(v){this[set]('by_default',v)}
  }
  classes.CatInsertsInsertsRow = CatInsertsInsertsRow;

  class CatInsertsProductParamsRow extends TabularSectionRow {
    get param(){return this[get]('param')}
    set param(v){this[set]('param',v)}
    get value(){return this[get]('value')}
    set value(v){this[set]('value',v)}
    get hide(){return this[get]('hide')}
    set hide(v){this[set]('hide',v)}
    get forcibly(){return this[get]('forcibly')}
    set forcibly(v){this[set]('forcibly',v)}
    get pos(){return this[get]('pos')}
    set pos(v){this[set]('pos',v)}
    get list(){return this[get]('list')}
    set list(v){this[set]('list',v)}
  }
  classes.CatInsertsProductParamsRow = CatInsertsProductParamsRow;

  const SelectionParamsRow = selectionParamsRow({classes, md, utils, enm, cat, get, set});
  class CatInsertsSelectionParamsRow extends SelectionParamsRow {}
  classes.CatInsertsSelectionParamsRow = CatInsertsSelectionParamsRow;
  
  class CatInsertsSpecificationRow extends DepositeSpecificationRow {
    get angle_calc_method(){return this[get]('angle_calc_method')}
    set angle_calc_method(v){this[set]('angle_calc_method',v)}
    get count_calc_method(){return this[get]('count_calc_method')}
    set count_calc_method(v){this[set]('count_calc_method',v)}
    get lmin(){return this[get]('lmin')}
    set lmin(v){this[set]('lmin',v)}
    get lmax(){return this[get]('lmax')}
    set lmax(v){this[set]('lmax',v)}
    get ahmin(){return this[get]('ahmin')}
    set ahmin(v){this[set]('ahmin',v)}
    get ahmax(){return this[get]('ahmax')}
    set ahmax(v){this[set]('ahmax',v)}
    get smin(){return this[get]('smin')}
    set smin(v){this[set]('smin',v)}
    get smax(){return this[get]('smax')}
    set smax(v){this[set]('smax',v)}
    get rmin(){return this[get]('rmin')}
    set rmin(v){this[set]('rmin',v)}
    get rmax(){return this[get]('rmax')}
    set rmax(v){this[set]('rmax',v)}
    get for_direct_profile_only(){return this[get]('for_direct_profile_only')}
    set for_direct_profile_only(v){this[set]('for_direct_profile_only',v)}
    get step(){return this[get]('step')}
    set step(v){this[set]('step',v)}
    get step_angle(){return this[get]('step_angle')}
    set step_angle(v){this[set]('step_angle',v)}
    get offsets(){return this[get]('offsets')}
    set offsets(v){this[set]('offsets',v)}
    get do_center(){return this[get]('do_center')}
    set do_center(v){this[set]('do_center',v)}
    get attrs_option(){return this[get]('attrs_option')}
    set attrs_option(v){this[set]('attrs_option',v)}
    get is_main_elm(){return this[get]('is_main_elm')}
    set is_main_elm(v){this[set]('is_main_elm',v)}

    checkRestrictions({elm, rawLength, angleHor}) {
      // главный элемент с нулевым количеством не включаем
      if(this.is_main_elm && !this.quantity) {
        return false;
      }
      // только для прямых или только для кривых профилей
      const isLinear = elm.isLinear ? elm.isLinear() : true;
      const {for_direct_profile_only: direct_only} = this;
      if((direct_only > 0 && !isLinear) || (direct_only < 0 && isLinear)){
        return false;
      }
      if(elm?.is?.('GeneratrixElement')) {
        const {ahmin, ahmax, lmin, lmax} = this;
        if(ahmin > 0 || (ahmax && ahmax < 360)) {
          if (ahmin > angleHor || (ahmax && ahmax < angleHor)) {
            return false;
          }
        }
        if (lmin > rawLength || (lmax && lmax < rawLength)) {
          return false;
        }
      }
      return true;
    }
    
  }
  classes.CatInsertsSpecificationRow = CatInsertsSpecificationRow;
  
  class CatInsertsManager extends CatManager {}
  classes.CatInsertsManager = CatInsertsManager;
  
  /*
  
  cat.create('inserts');
     
  */
}
