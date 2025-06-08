import selectionParamsRow from '../aggregate/selectionParamsRow';
import depositeSpecificationRow from '../aggregate/depositeSpecificationRow';

// если класс не включён в exclude, заготовки конструкторов система создаст автоматически
export const exclude = ['cat.cnns'];

export function classes({classes, md, utils, symbols, cat, enm, cch}, exclude)  {

  const {get, set, own} = symbols;
  const {CatObj, CatManager, TabularSectionRow} = classes;
  const [DepositeSpecificationObj, DepositeSpecificationRow] = depositeSpecificationRow({CatObj, TabularSectionRow, get, set, own, enm, cch});
  
  const nomCache = {
    i: new Map(),
    t: new Map(),
    a: new Map(),
    ii: new Map(),
    byCnnPoint(cnnPoint, elm2) {
      const {owner: elm1, isT, isI, vertex: {cnnType}} = cnnPoint;
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
      let cnns = c1?.get(nom2) || [];
      if(!cnnType.empty()) {
        const {av, ah, long, short} = enm.cnnTypes;
        const {orientation} = elm1;
        cnns = cnns.filter(cnn => {
          if(cnnType === av && (orientation.is('hor') && cnn.cnn_type === short || orientation.is('vert') && cnn.cnn_type === long)) {
            return true;
          }
          if(cnnType === ah && (orientation.is('hor') && cnn.cnn_type === long || orientation.is('vert') && cnn.cnn_type === short)) {
            return true;
          }
          return cnn.cnn_type === cnnType;
        });
      }
      return {elm1, kind, cnns};
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
    
    byThickness(thickness, nom2) {
      const {ii} = enm.cnnTypes;
      const res = [];
      for(const cnn of this) {
        if(cnn.cnn_type === ii && cnn.art1glass && thickness >= cnn.tmin && thickness <= cnn.tmax) {
          if(cnn.cnn_elmnts.find({nom2})) {
            res.push(cnn);
          }
        }
      }
      return res.sort(utils.sort('priority', true));
    }
    
    nodeCnns(cnnPoint, elm2) {
      const {elm1, cnns, kind} = nomCache.byCnnPoint(cnnPoint, elm2);
      return cnns;
    }
    
    iiCnns(elm1, elm2) {
      if(!elm2) {
        elm2 = elm1.nearest;
      }
      if(!elm2) {
        return [];
      }
      const nom1 = elm1.is('Filling') ? elm1.thickness : elm1.nom;
      const nom2 = elm2.nom;
      if(!nomCache.ii.has(nom1)) {
        nomCache.ii.set(nom1, new Map());
      }
      const cache = nomCache.ii.get(nom1);
      if(!cache.has(nom2)) {
        cache.set(nom2, elm1.is('Filling') ? this.byThickness(nom1, nom2) : this.byNoms(nom1, nom2, enm.cnnTypes.acn.ii));
      }
      return cache.get(nom2);
    }
  }
  classes.CatCnnsManager = CatCnnsManager;

  class CatCnns extends DepositeSpecificationObj {
    get lmin(){return this[get]('lmin')}
    set lmin(v){this[set]('lmin',v)}
    get lmax(){return this[get]('lmax')}
    set lmax(v){this[set]('lmax',v)}
    get region(){return this[get]('region')}
    set region(v){this[set]('region',v)}
    get priority(){return this[get]('priority')}
    set priority(v){this[set]('priority',v)}
    get amin(){return this[get]('amin')}
    set amin(v){this[set]('amin',v)}
    get amax(){return this[get]('amax')}
    set amax(v){this[set]('amax',v)}
    get sd1(){return this[get]('sd1')}
    set sd1(v){this[set]('sd1',v)}
    get sd2(){return this[get]('sd2')}
    set sd2(v){this[set]('sd2',v)}
    get node1(){return this[get]('node1')}
    set node1(v){this[set]('node1',v)}
    get node2(){return this[get]('node2')}
    set node2(v){this[set]('node2',v)}
    get sz(){return this[get]('sz')}
    set sz(v){this[set]('sz',v)}
    get szz(){return this[get]('szz')}
    set szz(v){this[set]('szz',v)}
    get cnn_type(){return this[get]('cnn_type')}
    set cnn_type(v){this[set]('cnn_type',v)}
    get ahmin(){return this[get]('ahmin')}
    set ahmin(v){this[set]('ahmin',v)}
    get ahmax(){return this[get]('ahmax')}
    set ahmax(v){this[set]('ahmax',v)}
    get tmin(){return this[get]('tmin')}
    set tmin(v){this[set]('tmin',v)}
    get tmax(){return this[get]('tmax')}
    set tmax(v){this[set]('tmax',v)}
    get var_layers(){return this[get]('var_layers')}
    set var_layers(v){this[set]('var_layers',v)}
    get for_direct_profile_only(){return this[get]('for_direct_profile_only')}
    set for_direct_profile_only(v){this[set]('for_direct_profile_only',v)}
    get art1vert(){return this[get]('art1vert')}
    set art1vert(v){this[set]('art1vert',v)}
    get art1glass(){return this[get]('art1glass')}
    set art1glass(v){this[set]('art1glass',v)}
    get art2glass(){return this[get]('art2glass')}
    set art2glass(v){this[set]('art2glass',v)}
    get applying(){return this[get]('applying')}
    set applying(v){this[set]('applying',v)}
    get cnn_elmnts(){return this[get]('cnn_elmnts')}
    set cnn_elmnts(v){this[get]('cnn_elmnts').load(v)}
    get sizes(){return this[get]('sizes')}
    set sizes(v){this[get]('sizes').load(v)}
    get priorities(){return this[get]('priorities')}
    set priorities(v){this[get]('priorities').load(v)}
    get coordinates(){return this[get]('coordinates')}
    set coordinates(v){this[get]('coordinates').load(v)}

    nom(elm) {
      return 'nom';
    }

    mainRow({elm, nom, node}) {
      const {art1, art2} = cat.nom.index.predefined;
      const rows = {
        art1: [],
        art2: [],
        nom: [],
      };
      for(const row of this.specification) {
        const rnom = row.nom;
        if(rnom === art1) {
          rows.art1.push(row);
        }
        else if(rnom === art2) {
          rows.art2.push(row);
        }
        else if(rnom === nom) {
          rows.nom.push(row);
        }
      }
      for(const row of rows.art1.concat(rows.nom).concat(rows.art2)) {
        if(row.checkParams({elm, node})) {
          return row;
        }
      }
    }

    /**
     * Параметрический размер соединения
     * @param {BuilderElement} elm1 - Элемент, через который будем добираться до значений параметров
     * @param {BuilderElement} [elm2] - Соседний элемент, если доступно в контексте вызова
     * @param {Number} [region] - номер ряда
     * @return Number
     */
    size(elm1, elm2, region=0) {
      let {sz, sizes} = this;
      const {layer, project} = elm1;
      const attr = {elm: elm1, elm2, region, layer, project};
      for(const prmRow of sizes) {
        if(prmRow.coordinate) {
          continue;
        }
        if(prmRow.checkCondition(attr) && prmRow.key.checkCondition(attr)) {
          sz = prmRow.elm;
          break;
        }
      }
      return sz;
    }

    /**
     * Параметрический размер по Z
     * @param {BuilderElement} elm1 - Элемент, через который будем добираться до значений параметров
     * @param {BuilderElement} [elm2] - Соседний элемент, если доступно в контексте вызова
     * @param {Number} [region] - номер ряда
     * @return Number
     */
    sizeZ(elm1, elm2, region=0) {
      let {szz, sizes} = this;
      const {layer, project} = elm1;
      const attr = {elm: elm1, elm2, region, layer, project};
      for(const prmRow of sizes) {
        if(!prmRow.coordinate) {
          continue;
        }
        if(prmRow.checkCondition(attr) && prmRow.key.checkCondition(attr)) {
          szz = prmRow.elm;
          break;
        }
      }
      return szz;
    }

    /**
     * @summary Вклад в спецификацию
     */
    calculateSpec({specification, ...other}) {
      for(const basis of this.specification) {
        if(basis.checkRestrictions(other) && basis.checkParams(other)) {
          specification.byBasis({...other, basis});
        }
      }
    }
  }
  classes.CatCnns = CatCnns;

  class CatCnnsCnnElmntsRow extends TabularSectionRow{
    get nom1(){return this[get]('nom1')}
    set nom1(v){this[set]('nom1',v)}
    get clr1(){return this[get]('clr1')}
    set clr1(v){this[set]('clr1',v)}
    get nom2(){return this[get]('nom2')}
    set nom2(v){this[set]('nom2',v)}
    get clr2(){return this[get]('clr2')}
    set clr2(v){this[set]('clr2',v)}
    get is_nom_combinations_row(){return this[get]('is_nom_combinations_row')}
    set is_nom_combinations_row(v){this[set]('is_nom_combinations_row',v)}
  }
  classes.CatCnnsCnnElmntsRow = CatCnnsCnnElmntsRow;

  class CatCnnsCoordinatesRow extends TabularSectionRow{
    get elm(){return this[get]('elm')}
    set elm(v){this[set]('elm',v)}
    get offset_option(){return this[get]('offset_option')}
    set offset_option(v){this[set]('offset_option',v)}
    get formula(){return this[get]('formula')}
    set formula(v){this[set]('formula',v)}
    get transfer_option(){return this[get]('transfer_option')}
    set transfer_option(v){this[set]('transfer_option',v)}
    get overmeasure(){return this[get]('overmeasure')}
    set overmeasure(v){this[set]('overmeasure',v)}
  }
  classes.CatCnnsCoordinatesRow = CatCnnsCoordinatesRow;

  class CatCnnsPrioritiesRow extends TabularSectionRow{
    get sys(){return this[get]('sys')}
    set sys(v){this[set]('sys',v)}
    get orientation(){return this[get]('orientation')}
    set orientation(v){this[set]('orientation',v)}
    get priority(){return this[get]('priority')}
    set priority(v){this[set]('priority',v)}
  }
  classes.CatCnnsPrioritiesRow = CatCnnsPrioritiesRow;

  const SelectionParamsRow = selectionParamsRow({classes, md, utils, enm, cat, get, set});
  class CatCnnsSelectionParamsRow extends SelectionParamsRow {}
  classes.CatCnnsSelectionParamsRow = CatCnnsSelectionParamsRow;

  class CatCnnsSizesRow extends SelectionParamsRow{
    get coordinate(){return this[get]('coordinate')}
    set coordinate(v){this[set]('coordinate',v)}
    get key(){return this[get]('key')}
    set key(v){this[set]('key',v)}
    get area(){return 0}
    set area(v){}
  }
  classes.CatCnnsSizesRow = CatCnnsSizesRow;

  class CatCnnsSpecificationRow extends DepositeSpecificationRow {
    get sz_min(){return this[get]('sz_min')}
    set sz_min(v){this[set]('sz_min',v)}
    get sz_max(){return this[get]('sz_max')}
    set sz_max(v){this[set]('sz_max',v)}
    get amin(){return this[get]('amin')}
    set amin(v){this[set]('amin',v)}
    get amax(){return this[get]('amax')}
    set amax(v){this[set]('amax',v)}
    get set_specification(){return this[get]('set_specification')}
    set set_specification(v){this[set]('set_specification',v)}
    get for_direct_profile_only(){return this[get]('for_direct_profile_only')}
    set for_direct_profile_only(v){this[set]('for_direct_profile_only',v)}
    get alp2(){return this[get]('alp2')}
    set alp2(v){this[set]('alp2',v)}
    get angle_calc_method(){return this[get]('angle_calc_method')}
    set angle_calc_method(v){this[set]('angle_calc_method',v)}
    get contour_number(){return this[get]('contour_number')}
    set contour_number(v){this[set]('contour_number',v)}

    get count_calc_method(){return enm.countCalculatingWays.cnn}
    
    get owner() {
      return this[own][own];
    }

    checkRestrictions({elm, layer, rawLength, angleHor, correct=false}) {
      const {nom, quantity, for_direct_profile_only: direct_only, amin, amax, alp2, set_specification} = this;
      // при формировании спецификации, отбрасываем корректировочные строки и наоборот, при корректировке - обычные
      if(!quantity && !correct || quantity && correct) {
        return;
      }
      if(!nom || nom.empty() || nom.is('art1') || nom.is('art2')) {
        return;
      }

      // только для прямых или только для кривых профилей
      if((direct_only > 0 && !elm.isLinear()) || (direct_only < 0 && elm.isLinear())) {
        return;
      }
      if(angleHor === undefined) {
        angleHor = elm.angleHor;
      }
      if(amin > angleHor || amax < angleHor) {
        return;
      }
      return true;
    }
  }
  classes.CatCnnsSpecificationRow = CatCnnsSpecificationRow;
  
     
}
