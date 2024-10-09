
exports.CatCnnsManager = class CatCnnsManager extends Object {

  constructor(owner, class_name) {
    super(owner, class_name);
    this._nomcache = {};
    this._region_cache = new Map();
  }

  sort_cnns(elm1, elm2) {

    const {Editor: {ProfileItem, BuilderElement}, enm: {cnn_types: {t, xx}, cnn_sides}} = $p;
    const sides = [cnn_sides.inner, cnn_sides.outer];
    const orientation = elm1 instanceof ProfileItem && elm1.orientation;
    const sys = (elm1 instanceof BuilderElement && elm1.isInserted()) ? 
      elm1.layer.sys : 
      (elm2 instanceof BuilderElement && elm2.isInserted() && elm2.layer.sys);
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
      enm: {orientations: {vert /*, hor, incline */}, cnn_types: {acn, ad, ii, i}, cnn_sides},
      cat: {nom}, utils} = $p;

    const types = Array.isArray(cnn_types) ? cnn_types : (acn.a.includes(cnn_types) ? acn.a : [cnn_types]);
    
    if(elm1.rnum && (!types.includes(i) || types.length > 1)) {
      const side = elm2?.cnn_side?.(elm1) || cnn_sides.inner;
      const res = this.region_cnn({
        region: elm1.rnum, 
        elm1,
        elm2: [{profile: elm2, side}],
        cnn_types,
        array: true});
      if(types.includes(i)) {
        const ri = this.nom_cnn(elm1, elm2, [i], ign_side, is_outer, cnn_point);
        res.push(...ri);
      }
      return res;
    }

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
        // не рассматриваем соединения рядов
        if(!cnn.region || cnn.cnn_type === i) {
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
        }
      });
    }

    if(cnn_types){
      
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
        types.includes(ad) && elm1.orientation != vert && elm2.orientation == vert ){
        return this.nom_cnn(elm2, elm1, types);
      }

      if(types.includes(i) && elm2 && !elm2.empty?.()) {
        const tmp = this.nom_cnn(elm1, null, acn.i, ign_side, is_outer, cnn_point);
        return res.concat(tmp).sort(this.sort_cnns(elm1, elm2));
      }

      return res.sort(this.sort_cnns(elm1, elm2));
    }

    return a1[ref2];
  }
  
  region_cnn({region, elm1, nom1, elm2, art1glass, cnn_types, array}) {
    if(!nom1) {
      nom1 = elm1.nom;
    }
    if(!Array.isArray(elm2)) {
      elm2 = [elm2];
    }
    for(const elm of elm2) {
      if(!elm.nom) {
        elm.nom = elm.profile.nom;
      }
      if(!elm.side) {
        throw new Error(`region_cnn no side elm:${elm.elm}, region:${region}`);
      }
    }
    if(!this._region_cache.has(region)) {
      this._region_cache.set(region, new Map());
    }
    const region_cache = this._region_cache.get(region);
    for(const {nom} of elm2) {
      if(!region_cache.has(nom)) {
        const cnns = [];
        this.find_rows({region}, (cnn) => {
          cnn.check_nom2(nom) && cnns.push(cnn);
        });
        region_cache.set(nom, cnns);
      }
    }
    const all = [];
    elm2.forEach(({nom, side}, index) => {
      for(const cnn of region_cache.get(nom)) {
        if((!cnn_types || cnn_types.includes(cnn.cnn_type)) && (cnn.sd1.is('any') || cnn.sd1 === side)) {
          const is_nom = cnn.check_nom1(nom1);
          if(is_nom || art1glass) {
            all.push({cnn, priority: cnn.priority + (is_nom ? 1000 : 0) + ((art1glass && cnn.sd2 === index) ? 10000 : 0)});
          }
        }
      }
    });
    all.sort((a, b) => b.priority - a.priority);
    return array ? all.map(v => v.cnn) : all[0]?.cnn;
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
    return this.cnn_elmnts._obj.some((row) => row.nom2 == ref);
  }

  check_nom1(nom) {
    const ref = nom.valueOf();
    return this.cnn_elmnts._obj.some((row) => row.nom1 == ref);
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
   * @param {Number} [region] - номер ряда
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
      if(check_params({params: selection_params, row_spec: row, elm, elm2, ox, node: len_angl?.node})) {
        res.push(row);
      }

    });

    return res;
  }

  calculate_spec({elm, elm2, len_angl, cnn_other, ox, own_row, spec}) {

    const {
      enm: {predefined_formulas: {gb_short, gb_long, w2}, cnn_types}, 
      CatInserts, 
      utils,
      ProductsBuilding: {new_spec_row, calc_count_area_mass},
    } = $p;
    
    const sign = this.cnn_type == cnn_types.ii ? -1 : 1;
    
    if(!spec){
      spec = ox.specification;
    }
    for(const row_base of this.filtered_spec({elm, elm2, len_angl, ox})) {
      const {nom} = row_base;

      // TODO: nom может быть вставкой - в этом случае надо разузловать
      if(nom instanceof CatInserts) {
        if(![gb_short, gb_long].includes(row_base.algorithm) && len_angl && (row_base.sz || row_base.coefficient)) {
          const tmp_len_angl = Object.assign({}, len_angl);
          tmp_len_angl.len = (len_angl.len - sign * 2 * row_base.sz) * (row_base.coefficient || 0.001);
          if(row_base.algorithm === w2 && elm2) {

          }
          nom.calculate_spec({elm, elm2, len_angl: tmp_len_angl, own_row: row_base, ox, spec});
        }
        else {
          nom.calculate_spec({elm, elm2, len_angl, own_row: row_base, ox, spec});
        }
      }
      else {

        const row_spec = new_spec_row({row_base, origin: len_angl.origin || this, elm, nom, spec, ox, len_angl});

        // рассчитаем количество
        const procedure = nom.is_procedure && this.coordinates.find({elm: row_base.elm}) && this.cnn_type.is('t'); 
        if(procedure) {
          const {Path} = elm.project._scope;
          row_spec.elm = elm2.elm;
          let ray;
          if(elm2.cnn_side(elm).is('outer')) {
            ray = elm2.rays.outer;
          }
          else {
            ray = elm2.rays.inner.clone({insert: false, deep: false});
            ray.reverse();
          }
          const pt = ray.getNearestPoint(elm[len_angl.node]);
          const offset1 = ray.getOffsetOf(ray.getNearestPoint(elm2.corns(1)));
          const offset4 = ray.getOffsetOf(ray.getNearestPoint(elm2.corns(4)));
          const offset7 = elm2.corns(7) && ray.getOffsetOf(ray.getNearestPoint(elm2.corns(7)));
          let offset = offset1 < offset4 ? offset1 : offset4;
          if(offset7 && offset7 < offset) {
            offset = offset7;
          }
          const pt0 = ray.getPointAt(offset);
          const path = ray.get_subpath(pt0, pt);
          row_spec.len = path.length * (row_base.coefficient || 0.001);
        }
        else if(nom.is_pieces) {
          if(!row_base.coefficient) {
            row_spec.qty = row_base.quantity;
          }
          else {
            row_spec.qty = ((len_angl.len - sign * 2 * row_base.sz) * row_base.coefficient * row_base.quantity - 0.5)
              .round(nom.rounding_quantity);
          }
        }
        else {
          row_spec.qty = row_base.quantity;

          // если указано cnn_other, берём не размер соединения, а размеры предыдущего и последующего
          if(![gb_short, gb_long].includes(row_base.algorithm) && (row_base.sz || row_base.coefficient)) {
            let sz = row_base.sz, finded, qty;
            if(cnn_other) {
              cnn_other.specification.find_rows({nom}, (row) => {
                sz += row.sz;
                qty = row.quantity;
                return !(finded = true);
              });
            }
            if(!finded) {
              if(row_base.algorithm === w2 && elm2) {

              }
              else {
                sz *= 2;
              }
            }
            if(!row_spec.qty && finded && len_angl.art1) {
              row_spec.qty = qty;
            }
            row_spec.len = (((len_angl.len - sign * sz) * 2).round() / 2) * (row_base.coefficient || 0.001) ;
          }
        }

        // если указана формула - выполняем
        if(!row_base.formula.empty()) {
          const qty = row_base.formula.execute({
            ox,
            elm,
            len_angl,
            cnstr: 0,
            inset: utils.blank.guid,
            row_cnn: row_base,
            row_spec: row_spec
          });
          // если формула является формулой условия, используем результат, как фильтр
          if(row_base.formula.condition_formula && !qty){
            row_spec.qty = 0;
          }
        }

        // визуализация svg-dx
        if(row_spec.dop === -1 && len_angl.curr && nom.visualization.mode === 3) {
          const {sub_path, outer, profile: {generatrix}} = len_angl.curr;
          const pt = generatrix.getNearestPoint(sub_path[outer ? 'lastSegment' : 'firstSegment'].point);
          row_spec.width = generatrix.getOffsetOf(pt) / 1000;
          if(outer) {
            row_spec.alp1 = -1;
          }
        }
        else {
          calc_count_area_mass(row_spec, spec, len_angl, row_base.angle_calc_method);
        }
      }
    }
  }
}
