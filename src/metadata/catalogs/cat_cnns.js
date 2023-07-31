
exports.CatCnnsManager = class CatCnnsManager extends Object {

  constructor(owner, class_name) {
    super(owner, class_name);
    this._nomcache = {};
  }

  sort_cnns(elm1, elm2) {

    const {Editor: {ProfileItem, BuilderElement}, enm: {cnn_types: {t, xx}, cnn_sides}} = $p;
    const sides = [cnn_sides.inner, cnn_sides.outer];
    const orientation = elm1 instanceof ProfileItem && elm1.orientation;
    const sys = elm1 instanceof BuilderElement ? elm1.layer.sys : (elm2 instanceof BuilderElement && elm2.layer.sys);
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

      // первым делом, учитываем приоритет (большой всплывает вверх)
      if (priority(a) > priority(b)) {
        return -1;
      }
      if (priority(a) < priority(b)) {
        return 1;
      }

      // далее, отдаём предпочтение соединениям, для которых задана сторона
      if(sides.includes(a.sd1) && !sides.includes(b.sd1)){
        return -1;
      }
      if(sides.includes(b.sd1) && !sides.includes(a.sd1)){
        return 1;
      }

      // соединения с одинаковым приоритетом и стороной сортируем по типу - опускаем вниз крест и Т
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
   * @param [cnn_point] {CnnPoint}
   * @return {Array}
   */
  nom_cnn(elm1, elm2, cnn_types, ign_side, is_outer, cnn_point) {

    const {
      Editor: {ProfileItem, BuilderElement, Filling},
      enm: {orientations: {vert /*, hor, incline */}, cnn_types: {acn, ad, ii}, cnn_sides},
      cat: {nom}, utils} = $p;

    // если оба элемента - профили, определяем сторону
    let side = is_outer ? cnn_sides.outer :
      (!ign_side && elm1 instanceof ProfileItem && !elm1.rnum && elm2 instanceof ProfileItem && elm2.cnn_side(elm1));
    if(!side && !ign_side && is_outer === false) {
      side = cnn_sides.inner;
    }

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
          if(!is_nom1) {
            is_nom1 = row.nom1 == ref1 && (row.nom2.empty() || row.nom2 == onom2);
          }
          if(!is_nom2) {
            is_nom2 = row.nom2 == onom2 && (row.nom1.empty() || row.nom1 == ref1);
          }
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
            if(cnn.amin && cnn.amax && cnn_point) {
              let angle = elm1.angle_at(cnn_point.node);
              if(angle > 180) {
                angle = 360 - angle;
              }
              if(cnn.amin < 0 && cnn.amax < 0) {
                if(-cnn.amin <= angle && -cnn.amax >= angle) {
                  return false;
                }
              }
              else {
                if(cnn.amin > angle || cnn.amax < angle) {
                  return false;
                }
              }
            }
            if(cnn_point && cnn.stop_applying(cnn_point)) {
              return false;
            }
            if(!side){
              return true;
            }
            if(cnn.sd1 == cnn_sides.inner){
              return side == cnn_sides.inner;
            }
            else if(cnn.sd1 == cnn_sides.outer){
              return side == cnn_sides.outer;
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
   * @param {BuilderElement} elm1
   * @param {BuilderElement} elm2
   * @param {Array} [cnn_types]
   * @param {CatCnns} [curr_cnn]
   * @param {Boolean} [ign_side]
   * @param {Boolean} [is_outer]
   * @param {CnnPoint} [cnn_point]
   */
  elm_cnn(elm1, elm2, cnn_types, curr_cnn, ign_side, is_outer, cnn_point){

    const {cnn_types: {acn, t, xx}, cnn_sides} = $p.enm;

    // если установленное ранее соединение проходит по типу и стороне, нового не ищем
    if(curr_cnn && cnn_types && cnn_types.includes(curr_cnn.cnn_type) && (cnn_types !== acn.ii)){

      // TODO: проверить геометрию
      if(!curr_cnn.stop_applying(cnn_point) && ign_side !== 0) {
        if(!ign_side && curr_cnn.sd1 == cnn_sides.inner){
          if(typeof is_outer == 'boolean'){
            if(!is_outer){
              return curr_cnn;
            }
          }
          else{
            if(elm2.cnn_side(elm1) == cnn_sides.inner){
              return curr_cnn;
            }
          }
        }
        else if(!ign_side && curr_cnn.sd1 == cnn_sides.outer){
          if(is_outer || elm2.cnn_side(elm1) == cnn_sides.outer)
            return curr_cnn;
        }
        else{
          return curr_cnn;
        }
      }
    }

    const cnns = this.nom_cnn(elm1, elm2, cnn_types, ign_side, is_outer, cnn_point);

    // сортируем по непустой стороне и приоритету
    if(cnns.length){
      return curr_cnn && cnns.includes(curr_cnn) ? curr_cnn : cnns[0];
    }
    // TODO: возможно, надо вернуть соединение с пустотой
    else{

    }
  }

  /**
   * Возвращает временное соединение по паре номенклатур и типу
   * @param nom1 {CatNom}
   * @param nom2 {CatNom}
   * @param [cnn_type]
   * @return {CatCnns}
   */
  by_nom(nom1, nom2, cnn_type = 'ad') {
    if(typeof cnn_type === 'string') {
      cnn_type = $p.enm.cnn_types[cnn_type]; 
    }
    
    if(!this._by_cnn_type) {
      this._by_cnn_type = new Map();
    }
    if(!this._by_cnn_type.has(cnn_type)) {
      this._by_cnn_type.set(cnn_type, new Map());
    }
    const root = this._by_cnn_type.get(cnn_type)
    if(!root.has(nom1)) {
      root.set(nom1, new Map());
    }
    if(!root.get(nom1).has(nom2)) {
      const tmp = this.create(false, false, true);
      tmp.cnn_type = cnn_type;
      tmp.cnn_elmnts.add({nom1, nom2});
      tmp._set_loaded(tmp.ref);
      root.get(nom1).set(nom2, tmp);
    }
    return root.get(nom1).get(nom2);
  }

};

exports.CatCnns = class CatCnns extends Object {

  /**
   * Возвращает основную строку спецификации соединения между элементами
   */
  main_row(elm) {

    let ares, nom = elm.nom;
    const {enm, job_prm, ProductsBuilding: {check_params}} = $p;
    const {specification, cnn_elmnts, selection_params, cnn_type} = this;

    // если тип соединения угловой, то арт-1-2 определяем по ориентации элемента
    if(enm.cnn_types.acn.a.includes(cnn_type)){
      let art12 = elm.orientation.is('vert') ? job_prm.nom.art1 : job_prm.nom.art2;
      ares = specification.find_rows({nom: art12});
    }
    // в прочих случаях, принадлежность к арт-1-2 определяем по табчасти СоединяемыеЭлементы
    if((!ares || !ares.length) && cnn_elmnts.find_rows({nom1: nom}).length){
      ares = specification.find_rows({nom: job_prm.nom.art1});
    }
    if((!ares || !ares.length) && cnn_elmnts.find_rows({nom2: nom}).length){
      ares = specification.find_rows({nom: job_prm.nom.art2});
    }
    if((!ares || !ares.length)) {
      ares = specification.find_rows({nom});
    }

    if(ares && ares.length) {
      const ox = elm.prm_ox || elm.ox;
      for(const {_row} of ares) {
        if(check_params({
          params: selection_params,
          ox,
          elm,
          row_spec: _row,
        })) {
          return _row;
        }
      }
      return ares[0]._row;
    }

  }

  /**
   * Проверяет, есть ли nom в колонке nom2 соединяемых элементов
   * @param {CatNom} nom
   * @return Boolean
   */
  check_nom2(nom) {
    const ref = nom.valueOf();
    return this.cnn_elmnts._obj.some((row) => row.nom == ref);
  }

  /**
   * Проверяет применимость для xx и t
   * @param {CnnPoint} cnn_point
   * @return Boolean
   */
  stop_applying(cnn_point) {
    const {applying, cnn_type, _manager} = this;
    let stop = applying && (cnn_type.is('t') || cnn_type.is('xx'));
    if(stop) {
      // 0 - Везде
      // 1 - Только стык
      // 2 - Только T
      // 3 - Только угол
      if(applying === 1 && !cnn_point.is_ll) {
        ;
      }
      else if(applying === 2 && cnn_point.is_ll) {
        ;
      }
      else {
        stop = false;
      }
    }
    return stop;
  }
  
  /**
   * Параметрический размер соединения 
   * @param {BuilderElement} elm0 - Элемент, через который будем добираться до значений параметров
   * @param {BuilderElement} [elm2] - Соседний элемент, если доступно в контексте вызова
   * @param {Number} [region] - Соседний элемент, если доступно в контексте вызова
   * @return Number
   */
  size(elm0, elm2, region=0) {
    let {sz, sizes} = this;
    const {ox, layer} = elm0;
    for(const prm_row of sizes) {
      let elm = elm0;
      let cnstr = 0;
      if(prm_row.origin.is('layer')) {
        cnstr = layer.cnstr;
      }
      else if(prm_row.origin.is('parent')) {
        const {parent} = elm;
        if(parent === layer) {
          cnstr = layer.cnstr;
        }
        else if(parent.elm) {
          cnstr = -parent.elm;
          elm = parent;
        }
      }
      if(prm_row.param.check_condition({row_spec: {}, prm_row, cnstr, elm, elm2, region, layer, ox}) &&
        prm_row.key.check_condition({cnstr, elm, elm2, region, layer, ox})) {
        sz = prm_row.elm;
        break;
      }
      //if(elm != elm0 && elm.inset.insert_type.is('composite')) {}
    }
    return sz;
  }

  /**
   * Выясняет, зависит ли размер соединения от текущего параметра
   * @param param {CchProperties}
   * @return {Boolean}
   */
  is_depend_of(param) {
    for(const row of this.sizes) {
      if(row.param === param || (row.param.empty() && !row.key.empty())) {
        return true;
      }
    }
  }

  /**
   * Укорочение для конкретной номенклатуры из спецификации
   */
  nom_size({nom, elm, elm2, len_angl, ox}) {
    let sz = 0;
    this.filtered_spec({elm, elm2, len_angl, ox, correct: true}).some((row) => {
      const {nom: rnom} = row;
      if(rnom === nom || (rnom instanceof CatInserts && rnom.filtered_spec({elm, elm2, len_angl, ox}).find(v => v.nom == nom))) {
        sz = row.sz;
        if(row.algorithm.is('w2') && elm2) {
          const size = this.size(elm, elm2);
          sz += -elm2.width + size;
        }
        return true;
      }
    });
    return sz;
  }

  /**
   * ПолучитьСпецификациюСоединенияСФильтром
   * @param {BuilderElement} elm
   * @param {BuilderElement} elm2
   * @param {Object} len_angl
   * @param {Object} ox
   * @param {Boolean} [correct]
   */
  filtered_spec({elm, elm2, len_angl, ox, correct = false}) {
    const res = [];

    const {
      job_prm: {nom: {art1, art2}},
      enm: {specification_installation_methods, cnn_types},
      ProductsBuilding: {check_params},
    } = $p;

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
        if(amin < 0 && amax < 0) {
          if(-amin <= angle && -amax >= angle) {
            return;
          }
        }
        else {
          if(amin > angle || amax < angle) {
            return;
          }
        }
      }

      // "устанавливать с" проверяем только для соединений профиля
      if(!correct && ((set_specification == САртикулом1 && len_angl.art2) || (set_specification == САртикулом2 && len_angl.art1))) {
        return;
      }
      // для угловых, разрешаем art2 только явно для art2
      if(!correct && len_angl.art2 && acn.a.includes(cnn_type) && !acn.xsl.includes(cnn_type) && set_specification != САртикулом2) {
        return;
      }

      // проверяем параметры изделия и добавляем, если проходит по ограничениям
      if(correct || check_params({params: selection_params, row_spec: row, elm, elm2, ox})) {
        res.push(row);
      }

    });

    return res;
  }
}
