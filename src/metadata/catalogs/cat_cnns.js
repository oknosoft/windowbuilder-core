
exports.CatCnnsManager = class CatCnnsManager extends Object {

  constructor(owner, class_name) {
    super(owner, class_name);
    this._nomcache = {};
    this.metadata('selection_params').index = 'elm';
  }

  sort_cnns(elm1, elm2) {

    const {Editor: {ProfileItem, BuilderElement}, enm: {cnn_types: {t, xx}, cnn_sides}} = this._owner.$p;
    const sides = [cnn_sides.Изнутри, cnn_sides.Снаружи];
    const orientation = elm1 instanceof ProfileItem && elm1.orientation;
    const sys = elm1 instanceof BuilderElement ? elm1.project._dp.sys : (elm2 instanceof BuilderElement && elm2.project._dp.sys);
    const priority = (cnn) => {
      let finded;
      if(sys && orientation) {
        const {priorities} = cnn;
        priorities.forEach((row) => {
          if((row.orientation.empty() || row.orientation == orientation) && (row.sys.empty() || row.sys == sys)) {
            if(!row.orientation.empty() && !row.sys.empty()) {
              finded = row;
              return false;
            }
            if(!finded || finded.sys.empty()) {
              finded = row;
            }
            else if(finded.orientation.empty() && !row.orientation.empty()) {
              finded = row;
            }
          }
        });
      }
      return finded ? finded.priority : cnn.priority;
    };

    return function sort_cnns(a, b) {

      // отдаём предпочтение соединениям, для которых задана сторона
      if(sides.includes(a.sd1) && !sides.includes(b.sd1)){
        return -1;
      }
      if(sides.includes(b.sd1) && !sides.includes(a.sd1)){
        return 1;
      }

      // далее, учитываем приоритет
      if (priority(a) > priority(b)) {
        return -1;
      }
      if (priority(a) < priority(b)) {
        return 1;
      }

      // соединения с одинаковым приоритетом сортируем по типу - опускаем вниз крест и Т
      if(a.cnn_type === xx && b.cnn_type !== xx){
        return 1;
      }
      if(b.cnn_type === xx && a.cnn_type !== xx){
        return -1;
      }
      if(a.cnn_type === t && b.cnn_type !== t){
        return 1;
      }
      if(b.cnn_type === t && a.cnn_type !== t){
        return -1;
      }

      // в последнюю очередь, сортируем по имени
      if (a.name > b.name) {
        return -1;
      }
      if (a.name < b.name) {
        return 1;
      }
      return 0;
    }
  }

  /**
   * Возвращает массив соединений, доступный для сочетания номенклатур.
   * Для соединений с заполнениями учитывается толщина. Контроль остальных геометрических особенностей выполняется на стороне рисовалки
   * @param elm1 {BuilderElement|CatNom}
   * @param [elm2] {BuilderElement|CatNom}
   * @param [cnn_types] {EnumObj|Array.<EnumObj>}
   * @param [ign_side] {Boolean}
   * @param [is_outer] {Boolean}
   * @return {Array}
   */
  nom_cnn(elm1, elm2, cnn_types, ign_side, is_outer) {

    const {
      Editor: {ProfileItem, BuilderElement, Filling},
      enm: {orientations: {vert /*, hor, incline */}, cnn_types: {acn, ad, ii}, cnn_sides},
      cat: {nom}, utils} = this._owner.$p;

    // если оба элемента - профили, определяем сторону
    const side = is_outer ? cnn_sides.Снаружи :
      (!ign_side && elm1 instanceof ProfileItem && elm2 instanceof ProfileItem && elm2.cnn_side(elm1));

    let onom2, a1, a2, thickness1, thickness2, is_i = false, art1glass = false, art2glass = false;

    if(!elm2 || (utils.is_data_obj(elm2) && elm2.empty())){
      is_i = true;
      onom2 = elm2 = nom.get();
    }
    else{
      if(elm2 instanceof BuilderElement){
        onom2 = elm2.nom;
      }
      else if(utils.is_data_obj(elm2)){
        onom2 = elm2;
      }
      else{
        onom2 = nom.get(elm2);
      }
    }

    const {ref: ref1} = elm1; // ref у BuilderElement равен ref номенклатуры или ref вставки
    const {ref: ref2} = onom2;

    if(!is_i){
      if(elm1 instanceof Filling){
        art1glass = true;
        thickness1 = elm1.thickness;
      }
      else if(elm2 instanceof Filling){
        art2glass = true;
        thickness2 = elm2.thickness;
      }
    }

    if(!this._nomcache[ref1]){
      this._nomcache[ref1] = {};
    }
    a1 = this._nomcache[ref1];
    if(!a1[ref2]){
      a2 = (a1[ref2] = []);
      // для всех элементов справочника соединения
      this.forEach((cnn) => {
        // если в строках соединяемых элементов есть наша - добавляем
        let is_nom1 = art1glass ? (cnn.art1glass && thickness1 >= cnn.tmin && thickness1 <= cnn.tmax && cnn.cnn_type == ii) : false,
          is_nom2 = art2glass ? (cnn.art2glass && thickness2 >= cnn.tmin && thickness2 <= cnn.tmax) : false;

        cnn.cnn_elmnts.forEach((row) => {
          if(is_nom1 && is_nom2){
            return false;
          }
          is_nom1 = is_nom1 || (row.nom1 == ref1 && (row.nom2.empty() || row.nom2 == onom2));
          is_nom2 = is_nom2 || (row.nom2 == onom2 && (row.nom1.empty() || row.nom1 == ref1));
        });
        if(is_nom1 && is_nom2){
          a2.push(cnn);
        }
      });
    }

    if(cnn_types){
      const types = Array.isArray(cnn_types) ? cnn_types : (acn.a.indexOf(cnn_types) != -1 ? acn.a : [cnn_types]);
      const res = a1[ref2]
        .filter((cnn) => {
          if(types.includes(cnn.cnn_type)){
            if(!side){
              return true
            }
            if(cnn.sd1 == cnn_sides.Изнутри){
              return side == cnn_sides.Изнутри;
            }
            else if(cnn.sd1 == cnn_sides.Снаружи){
              return side == cnn_sides.Снаружи;
            }
            else{
              return true;
            }
          }
        });

      // если не нашлось подходящих и это угловое соединение и второй элемент вертикальный - меняем местами эл 1-2 при поиске
      if(!res.length && elm1 instanceof ProfileItem && elm2 instanceof ProfileItem &&
        cnn_types.includes(ad) && elm1.orientation != vert && elm2.orientation == vert ){
        return this.nom_cnn(elm2, elm1, cnn_types);
      }

      return res.sort(this.sort_cnns(elm1, elm2));
    }

    return a1[ref2];
  }

  /**
   * Возвращает соединение между элементами
   * @param elm1 {BuilderElement}
   * @param elm2 {BuilderElement}
   * @param [cnn_types] {Array}
   * @param [curr_cnn] {CatCnns}
   * @param [ign_side] {Boolean}
   * @param [is_outer] {Boolean}
   */
  elm_cnn(elm1, elm2, cnn_types, curr_cnn, ign_side, is_outer){

    const {cnn_types: {acn}, cnn_sides} = this._owner.$p.enm;

    // если установленное ранее соединение проходит по типу и стороне, нового не ищем
    if(curr_cnn && cnn_types && (cnn_types.indexOf(curr_cnn.cnn_type) != -1) && (cnn_types != acn.ii)){

      // TODO: проверить геометрию

      if(!ign_side && curr_cnn.sd1 == cnn_sides.Изнутри){
        if(typeof is_outer == 'boolean'){
          if(!is_outer){
            return curr_cnn;
          }
        }
        else{
          if(elm2.cnn_side(elm1) == cnn_sides.Изнутри){
            return curr_cnn;
          }
        }
      }
      else if(!ign_side && curr_cnn.sd1 == cnn_sides.Снаружи){
        if(is_outer || elm2.cnn_side(elm1) == cnn_sides.Снаружи)
          return curr_cnn;
      }
      else{
        return curr_cnn;
      }
    }

    const cnns = this.nom_cnn(elm1, elm2, cnn_types, ign_side, is_outer);

    // сортируем по непустой стороне и приоритету
    if(cnns.length){
      return cnns[0];
    }
    // TODO: возможно, надо вернуть соединение с пустотой
    else{

    }
  }

};

exports.CatCnns = class CatCnns extends Object {

  /**
   * Возвращает основную строку спецификации соединения между элементами
   */
  main_row(elm) {

    let ares, nom = elm.nom;
    const {enm, job_prm} = this._manager._owner.$p;

    // если тип соединения угловой, то арт-1-2 определяем по ориентации элемента
    if(enm.cnn_types.acn.a.indexOf(this.cnn_type) != -1){

      let art12 = elm.orientation == enm.orientations.Вертикальная ? job_prm.nom.art1 : job_prm.nom.art2;

      ares = this.specification.find_rows({nom: art12});
      if(ares.length)
        return ares[0]._row;
    }

    // в прочих случаях, принадлежность к арт-1-2 определяем по табчасти СоединяемыеЭлементы
    if(this.cnn_elmnts.find_rows({nom1: nom}).length){
      ares = this.specification.find_rows({nom: job_prm.nom.art1});
      if(ares.length)
        return ares[0]._row;
    }
    if(this.cnn_elmnts.find_rows({nom2: nom}).length){
      ares = this.specification.find_rows({nom: job_prm.nom.art2});
      if(ares.length)
        return ares[0]._row;
    }
    ares = this.specification.find_rows({nom: nom});
    if(ares.length)
      return ares[0]._row;

  }

  /**
   * Проверяет, есть ли nom в колонке nom2 соединяемых элементов
   */
  check_nom2(nom) {
    const ref = nom.valueOf();
    return this.cnn_elmnts._obj.some((row) => row.nom == ref);
  }

  /**
   * Параметрический размер соединения
   */
  size(elm) {
    let {sz, sizes} = this;
    sizes.forEach((prm_row) => {
      if(prm_row.param.check_condition({row_spec: {}, prm_row, elm, cnstr: 0, ox: elm.project.ox})) {
        sz = prm_row.elm;
        return false;
      }
    });
    return sz;
  }

  /**
   * Укорочение для конкретной номенклатуры из спецификации
   */
  nom_size({nom, elm, len_angl, ox}) {
    let sz = 0;
    const {CatInserts} = this._manager._owner.$p;
    this.filtered_spec({elm, len_angl, ox, correct: true}).some((row) => {
      const {nom: rnom} = row;
      if(rnom === nom) {
        sz = row.sz;
        return true;
      }
      else if(rnom instanceof CatInserts) {
        if(rnom.specification.find({nom})) {
          sz = row.sz;
          return true;
        }
      }
    });
    return sz;
  }

  /**
   * ПолучитьСпецификациюСоединенияСФильтром
   * @param {BuilderElement} elm
   * @param {Object} len_angl
   * @param {Object} ox
   * @param {Boolean} [correct]
   */
  filtered_spec({elm, len_angl, ox, correct = false}) {
    const res = [];

    const {
      job_prm: {nom: {art1, art2}},
      enm: {specification_installation_methods, cnn_types},
      ProductsBuilding: {check_params}} = this._manager._owner.$p;

    const {САртикулом1, САртикулом2} = specification_installation_methods;
    const {ii, xx, acn, t} = cnn_types;
    const {cnn_type, specification, selection_params} = this;

    specification.forEach((row) => {
      const {nom, quantity, for_direct_profile_only: direct_only, amin, amax, alp2, set_specification} = row;
      // при формировании спецификации, отбрасываем корректировочные строки и наоборот, при корректировке - обычные
      if(!quantity && !correct || quantity && correct) {
        return;
      }
      if(!nom || nom.empty() || nom == art1 || nom == art2) {
        return;
      }

      // только для прямых или только для кривых профилей
      if((direct_only > 0 && !elm.is_linear()) || (direct_only < 0 && elm.is_linear())) {
        return;
      }

      //TODO: реализовать фильтрацию
      if(cnn_type == ii) {
        const angle_hor = len_angl.hasOwnProperty('angle_hor') ? len_angl.angle_hor : elm.angle_hor;
        if(amin > angle_hor || amax < angle_hor || row.sz_min > len_angl.len || row.sz_max < len_angl.len) {
          return;
        }
      }
      else {
        let {angle} = len_angl;
        if(!alp2 && angle > 180) {
          angle = 360 - angle;
        }
        if(amin > angle || amax < angle) {
          return;
        }
      }

      // "устанавливать с" проверяем только для соединений профиля
      if((set_specification == САртикулом1 && len_angl.art2) || (set_specification == САртикулом2 && len_angl.art1)) {
        return;
      }
      // для угловых, разрешаем art2 только явно для art2
      if(!correct && len_angl.art2 && acn.a.includes(cnn_type) && set_specification != САртикулом2 && cnn_type != xx && cnn_type != t) {
        return;
      }

      // проверяем параметры изделия и добавляем, если проходит по ограничениям
      if(correct || check_params({params: selection_params, row_spec: row, elm, ox})) {
        res.push(row);
      }

    });

    return res;
  }

}
