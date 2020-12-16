/**
 * Дополнительные методы справочника Системы (Параметры продукции)
 *
 * Created on 19.11.2020.
 */

exports.CatProduction_params = class CatProduction_params extends Object {

  /**
   * возвращает доступные в данной системе элементы
   * @property noms
   * @for Production_params
   */
  get noms() {
    const noms = [];
    const {utils} = $p;
    this.elmnts._obj.forEach(({nom}) => !utils.is_empty_guid(nom) && !noms.includes(nom) && noms.push(nom));
    return noms;
  }

  /**
   * Массив доступных в данной системе толщин заполнений
   * @return {number[]}
   */
  get thicknesses() {
    const thin = new Set();
    const {Заполнение, Стекло} = $p.enm.elm_types;
    this.elmnts.find_rows({elm_type: {in: [Заполнение, Стекло]}}, ({nom}) => thin.add(nom.thickness));
    return Array.from(thin);
  }

  /**
   * возвращает доступные в данной системе фурнитуры
   * данные получает из справчоника СвязиПараметров, где ведущий = текущей системе и ведомый = фурнитура
   * @property furns
   * @for Production_params
   */
  furns(ox, cnstr = 0){
    const {job_prm: {properties}, cat: {furns}} = $p;
    const list = [];
    if(properties.furn){
      const links = properties.furn.params_links({
        grid: {selection: {cnstr}},
        obj: {_owner: {_owner: ox}}
      });
      if(links.length){
        // собираем все доступные значения в одном массиве
        links.forEach((link) => link.values._obj.forEach(({value, by_default, forcibly}) => {
          const v = furns.get(value);
          v && list.push({furn: v, by_default, forcibly});
        }));
      }
    }
    return list;
  }

  /**
   * возвращает доступные в данной системе элементы (вставки)
   * @property inserts
   * @for Production_params
   * @param elm_types - допустимые типы элементов
   * @param by_default {Boolean|String} - сортировать по признаку умолчания или по наименованию вставки
   * @return Array.<CatInserts>
   */
  inserts(elm_types, by_default){
    const __noms = [];
    const {enm} = $p;
    if(!elm_types) {
      elm_types = enm.elm_types.rama_impost;
    }
    else if(typeof elm_types == 'string') {
      elm_types = enm.elm_types[elm_types];
    }
    else if(!Array.isArray(elm_types)) {
      elm_types = [elm_types];
    }

    this.elmnts.forEach((row) => {
      if(!row.nom.empty() && elm_types.includes(row.elm_type) && (by_default == 'rows' || !__noms.some((e) => row.nom == e.nom))) {
        __noms.push(row);
      }
    });

    if(by_default == 'rows') {
      return __noms;
    }

    __noms.sort((a, b) => {
      if(by_default){
        if(a.by_default && !b.by_default) {
          return -1;
        }
        else if(!a.by_default && b.by_default) {
          return 1;
        }
        else {
          return 0;
        }
      }
      else{
        if(a.nom.name < b.nom.name) {
          return -1;
        }
        else if(a.nom.name > b.nom.name) {
          return 1;
        }
        else {
          return 0;
        }
      }
    });

    return __noms.map((e) => e.nom);
  }

  /**
   * @method refill_prm
   * @param ox {Characteristics} - объект характеристики, табчасть которого надо перезаполнить
   * @param cnstr {Nomber} - номер конструкции. Если 0 - перезаполняем параметры изделия, иначе - фурнитуры
   * @param [force] {Boolean} - перезаполнять принудительно
   * @param [project] {Scheme} - текущий проект
   * @param [defaults] {TabularSection} - внешние умоляания
   */
  refill_prm(ox, cnstr = 0, force, project, defaults) {

    const prm_ts = !cnstr ? this.product_params : this.furn_params;
    const adel = [];
    const {enm, job_prm} = $p;
    const auto_align = ox.calc_order.obj_delivery_state == enm.obj_delivery_states.Шаблон && job_prm.properties.auto_align;
    const {params} = ox;

    function add_prm(proto) {
      let row;
      params.find_rows({cnstr: cnstr, param: proto.param}, (_row) => {
        row = _row;
        return false;
      });

      let {value} = proto;
      const drow = defaults && defaults.find({param: proto.param});
      if(drow) {
        value = drow.value;
      }

      // если не найден параметр изделия - добавляем. если нет параметра фурнитуры - пропускаем
      if(!row){
        if(cnstr){
          return;
        }
        row = params.add({param: proto.param, cnstr, value});
      }

      const links = proto.param.params_links({grid: {selection: {cnstr}}, obj: row});
      const hide = proto.hide || links.some((link) => link.hide);
      if(row.hide != hide){
        row.hide = hide;
      }

      if((proto.forcibly || drow) && value !== undefined && row.value != value){
        row.value = value;
      }
    }

    // если в характеристике есть лишние параметры - удаляем
    if(!cnstr){
      params.find_rows({cnstr: cnstr}, (row) => {
        const {param} = row;
        if(param !== auto_align && prm_ts.find_rows({param}).length == 0){
          adel.push(row);
        }
      });
      adel.forEach((row) => params.del(row));
    }

    // бежим по параметрам. при необходимости, добавляем или перезаполняем и устанавливаем признак hide
    prm_ts.forEach(add_prm);

    // для шаблонов, добавляем параметр автоуравнивание
    !cnstr && auto_align && add_prm({param: auto_align, value: '', hide: false});

    // устанавливаем систему и номенклатуру продукции
    if(!cnstr){
      ox.sys = this;
      ox.owner = ox.prod_nom;

      // если текущая фурнитура недоступна для данной системы - меняем
      // одновременно, перезаполним параметры фурнитуры
      ox.constructions.forEach((row) => {
        if(!row.furn.empty()) {
          let changed = force;
          // если для системы через связи параметров ограничен список фурнитуры...
          const furns = this.furns(ox, row.cnstr);
          const shtulp_kind = row.furn.shtulp_kind();
          if(furns.length) {
            if(furns.some((frow) => {
              if(frow.forcibly) {
                row.furn = frow.furn;
                return changed = true;
              }
            })) {
              ;
            }
            else if(furns.some((frow) => row.furn === frow.furn)) {
              ;
            }
            else if(shtulp_kind && furns.some((frow) => {
              if(frow.by_default && frow.furn.shtulp_kind() === shtulp_kind) {
                row.furn = frow.furn;
                return changed = true;
              }
            })) {
              ;
            }
            else if(shtulp_kind && furns.some((frow) => {
              if(frow.furn.shtulp_kind() === shtulp_kind) {
                row.furn = frow.furn;
                return changed = true;
              }
            })) {
              ;
            }
            else if(furns.some((frow) => {
              if(frow.by_default) {
                row.furn = frow.furn;
                return changed = true;
              }
            })) {
              ;
            }
            else {
              row.furn = furns[0].furn;
              changed = true;
            }
          }

          if(changed) {
            if(!project && typeof window !== 'undefined' && window.paper) {
              project = window.paper.project;
            }
            const contour = project && project.getItem({cnstr: row.cnstr});
            if(contour) {
              row.furn.refill_prm(contour);
              contour.notify(contour, 'furn_changed');
            }
            else {
              ox.sys.refill_prm(ox, row.cnstr);
            }
          }
        }
      });
    }
  }

  prm_defaults(param, cnstr) {
    const {CatNom} = $p;
    const ts = param instanceof CatNom ? this.params : (cnstr ? this.furn_params : this.product_params);
    return ts.find({param});
  }

  graph_restrictions(spoint, clr) {
    const {formula} = this;
    const checks = {};
    if(!formula.empty()) {
      const fragment = formula.execute()[clr ? 'clr' : 'white'];
      for(const key in fragment) {
        checks[key] = fragment[key].contains(spoint);
      }
    }
    return checks;
  }

}

exports.CatProduction_paramsManager = class CatProduction_paramsManager extends Object {

  /**
   * возвращает массив доступных для данного свойства значений
   * @param prop {CatObj} - планвидовхарактеристик ссылка или объект
   * @param is_furn {boolean} - интересуют свойства фурнитуры или объекта
   * @return {Array}
   */
  slist(prop, is_furn){
    let res = [], rt, at, pmgr, op = this.get(prop);

    if(op && op.type.is_ref){
      const tso = $p.enm.open_directions;
      // параметры получаем из локального кеша
      for(rt in op.type.types)
        if(op.type.types[rt].indexOf(".") > -1){
          at = op.type.types[rt].split(".");
          pmgr = $p[at[0]][at[1]];
          if(pmgr){
            if(pmgr === tso) {
              pmgr.forEach((v) => {
                v !== tso.folding && res.push({value: v.ref, text: v.synonym});
              });
            }
            else
              pmgr.find_rows({owner: prop}, (v) => {
                res.push({value: v.ref, text: v.presentation});
              });
          }
        }
    }
    return res;
  }
}
