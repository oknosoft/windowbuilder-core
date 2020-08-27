
exports.CatCnnsManager = class CatCnnsManager extends Object {

  constructor(owner, class_name) {
    super(owner, class_name);
    this._nomcache = {};
    this.metadata('selection_params').index = 'elm';
    this.sort_cnns = this.sort_cnns.bind(this);
  }

  sort_cnns(a, b) {
    const {cnn_types: {t, xx}, cnn_sides} = this._owner.$p.enm;
    const sides = [cnn_sides.Изнутри, cnn_sides.Снаружи];

    // отдаём предпочтение соединениям, для которых задана сторона
    if(sides.includes(a.sd1) && !sides.includes(b.sd1)){
      return 1;
    }
    if(sides.includes(b.sd1) && !sides.includes(a.sd1)){
      return -1;
    }
    // далее, учитываем приоритет
    if (a.priority > b.priority) {
      return -1;
    }
    if (a.priority < b.priority) {
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
   * @param {Boolean} correct
   */
  filtered_spec({elm, len_angl, ox, correct = false}) {
    const res = [];

    const {
      job_prm: {nom: {art1, art2}},
      enm: {specification_installation_methods, cnn_types},
      ProductsBuilding: {check_params}} = $p;
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
