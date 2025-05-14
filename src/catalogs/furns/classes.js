import selectionParamsRow from '../aggregate/selectionParamsRow';
import depositeSpecificationRow from '../aggregate/depositeSpecificationRow';

// если класс не включён в exclude, заготовки конструкторов система создаст автоматически
export const exclude = ['cat.furns', 'cat.furnSpec'];

export function classes({classes, md, utils, symbols, cat, enm, cch}, exclude)  {

  const {get, set, own} = symbols;
  const {CatFurns: CatFurnsProto, CatObj, CatManager, TabularSectionRow} = classes;
  const [DepositeSpecificationObj, DepositeSpecificationRow] = depositeSpecificationRow({CatObj, TabularSectionRow, get, set, own, enm, cch});
  
  class CatFurnsManager extends CatManager {
    load(aattr, force){
      const our = [], other = [];
      for(const attr of aattr){
        if(attr.is_set) {
          other.push(attr);
        }
        else {
          our.push(attr);
        }
      }
      super.load(our, force);
      cat.furnSpec.load(other, force);
    }
  }
  classes.CatFurnsManager = CatFurnsManager;

  class CatFurns extends CatObj {
    get left_right(){return this[get]('left_right')}
    set left_right(v){this[set]('left_right',v)}
    get is_sliding(){return this[get]('is_sliding')}
    set is_sliding(v){this[set]('is_sliding',v)}
    get furn_set(){return this[get]('furn_set')}
    set furn_set(v){this[set]('furn_set',v)}
    get side_count(){return this[get]('side_count')}
    set side_count(v){this[set]('side_count',v)}
    get clr_group(){return this[get]('clr_group')}
    set clr_group(v){this[set]('clr_group',v)}
    get handle_side(){return this[get]('handle_side')}
    set handle_side(v){this[set]('handle_side',v)}
    get open_type(){return this[get]('open_type')}
    set open_type(v){this[set]('open_type',v)}
    get name_short(){return this[get]('name_short')}
    set name_short(v){this[set]('name_short',v)}
    get applying(){return this[get]('applying')}
    set applying(v){this[set]('applying',v)}
    get formula(){return this[get]('formula')}
    set formula(v){this[set]('formula',v)}
    get parent(){return this[get]('parent')}
    set parent(v){this[set]('parent',v)}
    get open_tunes(){return this[get]('open_tunes')}
    set open_tunes(v){this[get]('open_tunes').load(v)}
    get attrs_option(){return this[get]('attrs_option')}
    set attrs_option(v){this[get]('attrs_option').load(v)}
    
    /**
     * Вычисляет штульповость фурнитуры
     * 0 - не штульповая, 1 - активная, 2 - пассивная
     * @return {number}
     */
    shtulpKind() {
      let res = 0;
      this.open_tunes.forEach(({shtulp_available, shtulp_fix_here}) => {
        if(shtulp_available && !res) {
          res = 1;
        }
        if(shtulp_fix_here) {
          res = 2;
        }
      });
      return res;
    }

    findSet({layer, w, h, weight}) {
      for(const row of this.attrs_option) {
        if(row.mmin > weight || (row.mmax && row.mmax < weight)) {
          continue;
        }
        if(row.formula.empty()) {
          return row.furn_set;
        }
        try {
          const path = row.formula.execute({paper: layer.project._scope});
          if(path.contains([w, h])) {
            return row.furn_set;
          }
        }
        catch (e) {}
      }
      return this.furn_set;
    }
    
    usedParams(attr) {
      return this.findSet(attr).usedParams();
    }

    /**
     * @summary Вклад в спецификацию
     */
    calculateSpec(attr) {
      this.findSet(attr).calculateSpec(attr);
    }
  }
  classes.CatFurns = CatFurns;

  class CatFurnsAttrsOptionRow extends TabularSectionRow{
    get mmin(){return this[get]('mmin')}
    set mmin(v){this[set]('mmin',v)}
    get mmax(){return this[get]('mmax')}
    set mmax(v){this[set]('mmax',v)}
    get formula(){return this[get]('formula')}
    set formula(v){this[set]('formula',v)}
    get furn_set(){return this[get]('furn_set')}
    set furn_set(v){this[set]('furn_set',v)}
  }
  classes.CatFurnsAttrsOptionRow = CatFurnsAttrsOptionRow;

  class CatFurnsOpenTunesRow extends TabularSectionRow{
    get side(){return this[get]('side')}
    set side(v){this[set]('side',v)}
    get lmin(){return this[get]('lmin')}
    set lmin(v){this[set]('lmin',v)}
    get lmax(){return this[get]('lmax')}
    set lmax(v){this[set]('lmax',v)}
    get amin(){return this[get]('amin')}
    set amin(v){this[set]('amin',v)}
    get amax(){return this[get]('amax')}
    set amax(v){this[set]('amax',v)}
    get arc_available(){return this[get]('arc_available')}
    set arc_available(v){this[set]('arc_available',v)}
    get shtulp_available(){return this[get]('shtulp_available')}
    set shtulp_available(v){this[set]('shtulp_available',v)}
    get shtulp_fix_here(){return this[get]('shtulp_fix_here')}
    set shtulp_fix_here(v){this[set]('shtulp_fix_here',v)}
    get rotation_axis(){return this[get]('rotation_axis')}
    set rotation_axis(v){this[set]('rotation_axis',v)}
    get partial_opening(){return this[get]('partial_opening')}
    set partial_opening(v){this[set]('partial_opening',v)}
    get outline(){return this[get]('outline')}
    set outline(v){this[set]('outline',v)}
  }
  classes.CatFurnsOpenTunesRow = CatFurnsOpenTunesRow;

  class CatFurnSpecManager extends CatManager {
    
  }
  classes.CatFurnSpecManager = CatFurnSpecManager;
  
  class CatFurnSpec extends DepositeSpecificationObj {
    get flap_weight_max(){return this[get]('flap_weight_max')}
    set flap_weight_max(v){this[set]('flap_weight_max',v)}
    get specification_restrictions(){return this[get]('specification_restrictions')}
    set specification_restrictions(v){this[get]('specification_restrictions').load(v)}

    /**
     * @summary Строки основной спецификации
     * @return {Array.<CatFurnSpecSpecificationRow>}
     */
    mainRows() {
      if(!this._mainRows) {
        this._mainRows = this.specification.filter(({dop}) => dop === 0);
      }
      return this._mainRows;
    }
    
    /**
     * @summary Вклад в спецификацию
     */
    calculateSpec({specification, layer, ...props}) {
      const other =  {layer, ...props}; 
      for(const basis of this.mainRows()) {
        if(basis.checkRestrictions(other) && basis.checkParams(other)) {
          specification.byBasis({...other, basis});
          for(const dop of basis.dopRows()) {
            if(dop.checkRestrictions(other) && dop.checkParams(other)) {
              specification.byBasis({...other, basis: dop});
            }
          }
        }
      }
    }
  }
  classes.CatFurnSpec = CatFurnSpec;

  const SelectionParamsRow = selectionParamsRow({classes, md, utils, enm, cat, get, set});
  class CatFurnSpecSelectionParamsRow extends SelectionParamsRow{
    get dop(){return this[get]('dop')}
    set dop(v){this[set]('dop',v)}
  }
  classes.CatFurnSpecSelectionParamsRow = CatFurnSpecSelectionParamsRow;
  
  let calculator = null;
  
  class CatFurnSpecSpecificationRow extends DepositeSpecificationRow{
    get dop(){return this[get]('dop')}
    set dop(v){this[set]('dop',v)}
    get handle_height_base(){return this[get]('handle_height_base')}
    set handle_height_base(v){this[set]('handle_height_base',v)}
    get fix_ruch(){return this[get]('fix_ruch')}
    set fix_ruch(v){this[set]('fix_ruch',v)}
    get handle_height_min(){return this[get]('handle_height_min')}
    set handle_height_min(v){this[set]('handle_height_min',v)}
    get handle_height_max(){return this[get]('handle_height_max')}
    set handle_height_max(v){this[set]('handle_height_max',v)}
    get handle_base_filter(){return this[get]('handle_base_filter')}
    set handle_base_filter(v){this[set]('handle_base_filter',v)}
    get contraction(){return this[get]('contraction')}
    set contraction(v){this[set]('contraction',v)}
    get contraction_optionath(){return this[get]('contraction_optionath')}
    set contraction_optionath(v){this[set]('contraction_optionath',v)}
    get flap_weight_min(){return this[get]('flap_weight_min')}
    set flap_weight_min(v){this[set]('flap_weight_min',v)}
    get flap_weight_max(){return this[get]('flap_weight_max')}
    set flap_weight_max(v){this[set]('flap_weight_max',v)}
    get side(){return this[get]('side')}
    set side(v){this[set]('side',v)}
    get cnn_side(){return this[get]('cnn_side')}
    set cnn_side(v){this[set]('cnn_side',v)}
    get offset_option(){return this[get]('offset_option')}
    set offset_option(v){this[set]('offset_option',v)}
    get transfer_option(){return this[get]('transfer_option')}
    set transfer_option(v){this[set]('transfer_option',v)}
    get overmeasure(){return this[get]('overmeasure')}
    set overmeasure(v){this[set]('overmeasure',v)}
    get is_set_row(){return this[get]('is_set_row')}
    set is_set_row(v){this[set]('is_set_row',v)}
    get is_procedure_row(){return this[get]('is_procedure_row')}
    set is_procedure_row(v){this[set]('is_procedure_row',v)}

    checkRestrictions({elm, layer, rawLength, angleHor, correct=false}) {
      const {nom, quantity, for_direct_profile_only: direct_only} = this;

      if(!nom || nom.empty() || (!quantity && !nom.is_procedure)) {
        return;
      }

      // только для прямых или только для кривых профилей
      if((direct_only > 0 && !elm.isLinear()) || (direct_only < 0 && elm.isLinear())) {
        return;
      }

      return true;
    }

    paramsRows() {
      const {elm, dop} = this;
      return this[own][own].selection_params.filter((row) => row.elm === elm && row.dop === dop && !row.origin.is('algorithm'));
    }

    /**
     * @summary Строки дополнительной спецификации
     * @return {Array.<CatFurnSpecSpecificationRow>}
     */
    dopRows() {
      if(!this._dopRows) {
        const elm0 = this.elm;
        this._dopRows = this[own].filter(({elm, dop}) => elm === elm0 && dop !== 0);
      }
      return this._dopRows;
    }

    get count_calc_method() {
      if(!calculator) {
        calculator = {calculate: enm.countCalculatingWays.furn.calculate.bind(enm.countCalculatingWays.furn)};
      }
      return calculator;
    }
  }
  classes.CatFurnSpecSpecificationRow = CatFurnSpecSpecificationRow;

  class CatFurnSpecSpecificationRestrictionsRow extends TabularSectionRow{
    get elm(){return this[get]('elm')}
    set elm(v){this[set]('elm',v)}
    get dop(){return this[get]('dop')}
    set dop(v){this[set]('dop',v)}
    get side(){return this[get]('side')}
    set side(v){this[set]('side',v)}
    get lmin(){return this[get]('lmin')}
    set lmin(v){this[set]('lmin',v)}
    get lmax(){return this[get]('lmax')}
    set lmax(v){this[set]('lmax',v)}
    get amin(){return this[get]('amin')}
    set amin(v){this[set]('amin',v)}
    get amax(){return this[get]('amax')}
    set amax(v){this[set]('amax',v)}
    get for_direct_profile_only(){return this[get]('for_direct_profile_only')}
    set for_direct_profile_only(v){this[set]('for_direct_profile_only',v)}
  }
  classes.CatFurnSpecSpecificationRestrictionsRow = CatFurnSpecSpecificationRestrictionsRow;
     
}
