/**
 * Дополнительные методы справочника Системы (Параметры продукции)
 *
 * Created on 19.11.2020.
 */

exports.CatProduction_params = class CatProduction_params extends Object {

  /**
   * возвращает доступные в данной системе элементы
   * @type {Array.<CatInserts>}
   */
  get noms() {
    const noms = [];
    for (const {nom} of this.elmnts) {
      if (nom instanceof CchPredefined_elmnts) {
        for (const {value} of nom.elmnts) {
          !noms.includes(value) && noms.push(value)
        }
      } 
      else {
        !noms.includes(nom) && noms.push(nom);
      }
    }
    return noms;
  }

  /**
   * Массив доступных в данной системе толщин заполнений
   * @typw {Array.<Number>}
   */
  get thicknesses() {
    const {_data} = this;
    if(!_data.thin) {
      const thin = new Set();
      const glasses = this.inserts($p.enm.elm_types.glasses, 'rows');
      for(const {nom} of glasses) {
        const thickness = nom.thickness();
        thickness && thin.add(nom.thickness());
      }
      _data.thin = Array.from(thin).sort((a, b) => a - b);
    }
    return _data.thin;
  }

  /**
   * Минимальная толщина заполнения
   * @type {Number}
   */
  get tmin() {
    return this.glass_thickness === 3 ? 0 : this.thicknesses[0];
  }
  set tmin(v) {
    return true;
  }

  /**
   * Максимальная толщина заполнения
   * @type {Number}
   */
  get tmax() {
    return this.glass_thickness === 3 ? Infinity : this.thicknesses[this.thicknesses.length - 1];
  }
  set tmax(v) {
    return true;
  }

  /**
   * возвращает доступные в данной системе фурнитуры
   * данные получает из справчоника СвязиПараметров, где ведущий = текущей системе и ведомый = фурнитура
   * @param ox {CatCharacteristics}
   * @param [layer] {Contour}
   * @return {Array}
   */
  furns(ox, layer) {
    const {job_prm: {properties}, cat: {furns}} = $p;
    const list = [];
    if(properties.furn) {
      const links = properties.furn.params_links({
        grid: {selection: {cnstr: layer ? layer.cnstr : 0}},
        obj: {_owner: {_owner: ox}},
        layer
      });
      if(links.length) {
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
   * Ищет цветогруппу системы с учётом цвета основы
   * @param {CatCharacteristics} ox
   * @return {CatColor_price_groups}
   */
  find_group(ox) {
    const {base_clr, clr_group, color_price_groups} = this;
    if(!base_clr.empty()) {
      const row = color_price_groups.find({base_clr: base_clr.extract_pvalue({ox, cnstr: 0})});
      if(row) {
        return row.clr_group;
      }
    }
    return clr_group;
  }

  /**
   * Доступна ли вставка в данной системе в качестве elm_type
   * @param nom {CatInserts}
   * @param elm_type {EnmElmTypes|Array.<EnmElmTypes>}
   * @return {boolean}
   */
  is_elm_type(nom, elm_type) {
    const inserts = this.inserts(elm_type, 'rows').map((e) => e.nom);
    return inserts.includes(nom);
  }

  /**
   * Возвращает доступные в данной системе элементы (вставки)
   * @param elm_types {EnmElmTypes|Array.<EnmElmTypes>} - допустимые типы элементов
   * @param [rows] {String} - возвращать вставки или строки табчасти "Элементы"
   * @param [elm] {BuilderElement} - указатель на элемент или проект, чтобы отфильтровать по ключам
   * @return {Array.<CatInserts>}
   */
  inserts(elm_types, rows, elm){
    const noms = [];
    const {elm_types: types} = $p.enm;
    if(!elm_types) {
      elm_types = types.rama_impost;
    }
    else if(typeof elm_types == 'string') {
      elm_types = types[elm_types];
    }
    if(!Array.isArray(elm_types)) {
      elm_types = [elm_types];
    }

    for(const row of this.elmnts) {
      const {key, nom, elm_type, pos, by_default} = row;
      if(nom && !nom.empty() && elm_types.includes(elm_type) &&
          (rows === 'rows' || !noms.some((e) => nom == e.nom)) &&
          (!elm || key.check_condition({elm}))) {
        if(nom instanceof CchPredefined_elmnts) {
          for(const {value} of nom.elmnts) {
            noms.push({
              nom: value,
              elm_type,
              pos,
              by_default,
            });
          }
        }
        else {
          noms.push(row);
        }
      }
    }

    if(rows === 'rows') {
      return noms;
    }

    noms.sort((a, b) => {
      if(a.by_default && !b.by_default) {
        return -1;
      }
      else if(!a.by_default && b.by_default) {
        return 1;
      }
      else {
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

    return noms.map((e) => e.nom);
  }

  /**
   * возвращает доступные в данной системе заполнения (вставки)
   * @return {Array.<CatInserts>}
   */
  glasses({elm, layer}) {
    return this.inserts($p.enm.elm_types.glasses, false, elm);
  }

  /**
   * @param ox {CatCharacteristics} - объект характеристики, табчасть которого надо перезаполнить
   * @param cnstr {Number} - номер конструкции. Если 0 - перезаполняем параметры изделия, иначе - фурнитуры
   * @param [force] {Boolean} - перезаполнять принудительно
   * @param [project] {Scheme} - текущий проект
   * @param [defaults] {TabularSection} - внешние умолчания
   */
  refill_prm(ox, cnstr = 0, force, project, defaults) {

    const prm_ts = !cnstr ? this.product_params : this.furn_params;
    const adel = [];
    const {enm, job_prm: {properties}, utils, EditorInvisible: {Contour}} = $p;
    const auto_align = ox.calc_order.obj_delivery_state == enm.obj_delivery_states.Шаблон && properties.auto_align;
    const {params} = ox;
    const layer = project instanceof Contour ?  project : project && project.getItem({class: Contour, cnstr: cnstr || 1});

    function add_prm(proto) {
      let row;
      let {param, value} = proto;

      if(cnstr) {

      }

      params.find_rows({cnstr, param}, (_row) => {
        row = _row;
        return false;
      });

      const drow = defaults && defaults.find({param});
      if(drow) {
        value = drow.value;
      }
      else if(param === properties.branch) {
        value = ox.calc_order.organization._extra(param);
        if(!value || value.empty()) {
          value = ox.calc_order.manager.branch;
        }
        if(value.empty()) {
          value._manager.find_rows({parent: utils.blank.guid}, (branch) => {
            value = branch;
            return false;
          });
        }
      }

      // если не найден параметр изделия - добавляем. если нет параметра фурнитуры - пропускаем
      if(!row){
        if(cnstr){
          return;
        }
        row = params.add({param, cnstr, value});
      }

      const links = param.params_links({grid: {selection: {cnstr}}, obj: row, layer});
      const hide = proto.hide || links.some((link) => link.hide);
      if(row.hide != hide){
        row.hide = hide;
      }

      if(proto.forcibly || drow || force === 1){

        if(param.inheritance === 3 || param.inheritance === 4) {
          // пытаемся получить свойство из отдела абонента
          const bvalue = param.branch_value({project, cnstr, ox});
          if(bvalue !== undefined) {
            row.value = bvalue;
            return;
          }
        }

        if(value !== undefined && row.value != value) {
          row.value = value;
        }
      }
    }

    // если в характеристике есть лишние параметры - удаляем
    if(!cnstr){
      params.find_rows({cnstr: cnstr}, (row) => {
        const {param} = row;
        if(param !== auto_align && !prm_ts.find({param})){
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

      if(project instanceof Contour) {
        return;
      }

      // если текущая фурнитура недоступна для данной системы - меняем
      // одновременно, перезаполним параметры фурнитуры
      ox.constructions.forEach((row) => {
        if(!row.furn.empty()) {
          let changed = force;
          const layer = project && project.getItem({class: Contour, cnstr: row.cnstr});
          // если для системы через связи параметров ограничен список фурнитуры...
          const furns = this.furns(ox, layer);
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
              row.furn.refill_prm(contour, force === 1);
              contour.notify(contour, 'furn_changed');
            }
            else {
              ox.sys.refill_prm(ox, row.cnstr, force, project);
            }
          }
        }
      });
    }
  }

  prm_defaults(param, cnstr) {
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
//exports.CatProduction_params.exclude = ['clr_group'];

exports.CatProduction_paramsManager = class CatProduction_paramsManager extends Object {

  // после загрузки, установим признак dhtmlxro цветам основы
  load_array(aattr, forse) {
    for(const obj of super.load_array(aattr, forse)) {
      if(!obj.base_clr.empty()) {
        obj.base_clr.dhtmlxro = true;
      }
    }
  }

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
