
/**
 * @summary Соединительный профиль
 * @desc Класс описывает поведение соединительного профиля
 *
 * - у соединительного профиля есть координаты конца и начала, такие же, как у Profile
 * - концы соединяются с пустотой
 * - имеет как минимум одно ii примыкающее соединение
 * - есть путь образующей - прямая или кривая линия, такая же, как у Profile
 * - сдвиг и искривление пути передаются примыкающим профилям
 * - соединительный профиль живёт в слое одного из рамных контуров изделия, но может оказывать влияние на соединёные с ним контуры
 * - длина соединительного профиля может отличаться от длин профилей, к которым он примыкает
 *
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @extends ProfileItem
 */
class ProfileConnective extends ProfileItem {

  /**
   * Возвращает тип элемента (соединитель)
   */
  get elm_type() {
    return $p.enm.elm_types.Соединитель;
  }

  /** @override */
  get d0() {
    const d0 = Object.getOwnPropertyDescriptor(Profile.prototype, 'd0');
    return d0.get.call(this);
  }

  /**
   * С этой функции начинается пересчет и перерисовка соединительного профиля
   * т.к. концы соединителя висят в пустоте и не связаны с другими профилями, возвращаем голый cnn_point
   *
   * @param node {String} - имя узла профиля: "b" или "e"
   * @return {CnnPoint} - объект {point, profile, cnn_types}
   */
  cnn_point(node) {
    return this.rays[node];
  }

  /**
   * Двигает узлы
   * Обрабатывает смещение выделенных сегментов образующей профиля
   *
   * @param delta {paper.Point} - куда и насколько смещать
   * @param [all_points] {Boolean} - указывает двигать все сегменты пути, а не только выделенные
   * @param [start_point] {paper.Point} - откуда началось движение
   */
  move_points(delta, all_points, start_point) {

    const nearests = this.joined_nearests();
    super.move_points(delta, all_points, start_point);

    // двигаем примыкающие
    if(!paper.Key.isDown('control')) {
      this.bind_nearests(nearests);
    }

    this._attr._corns.length = 0;
    this.project.register_change();
  }
  
  bind_nearests(nearests) {
    if(!nearests) {
      nearests = this.joined_nearests();
    }
    const moved = {profiles: []};
    for (const nearest of nearests) {
      const {_rays} = nearest._attr;
      nearest.do_bind(this, _rays.b, _rays.e, moved);
      // двигаем связанные с примыкающими
      for(const cp of [_rays.b, _rays.e]) {
        if(cp.profile) {
          const {b, e} = cp.profile._attr._rays;
          cp.profile.do_bind(nearest, b, e, moved);
        }
      }
    }
  }

  move_linked(deleting) {
    if(!this.generatrix) {
      return;
    }
    const nearests = this.joined_nearests();
    const layers = new Set();
    const profiles = new Set();
    const connectives = new Set([this]);
    const {orientation} = this;

    function move_layer(profile, delta) {
      if(profiles.has(profile)) {
        return;
      }
      profiles.add(profile);
      const {d0, generatrix, layer} = profile;
      if((d0 || delta) && !layers.has(layer) && !(layer instanceof ConnectiveLayer)) {
        layers.add(layer);
        if(!delta) {
          delta = generatrix.getNormalAt(generatrix.length).multiply(deleting ? d0 : -d0);
        }
        let {bounds} = layer;
        layer.translate(delta);
        delete layer._attr._bounds;
        let checkLayers = true;
        // если у профилей сдвинутого слоя есть соединители, двигаем соседние слои
        for (const sub of layer.profiles) {
          if(!profiles.has(sub)) {
            const nearest = sub.nearest(true);
            if(nearest && !connectives.has(nearest)) {
              checkLayers = false;
              connectives.add(nearest);
              nearest.translate(delta);
              for (const sub2 of nearest.joined_nearests()) {
                if(sub2 !== sub) {
                  move_layer(sub2, delta);
                }
              }
            }
            else {
              profiles.add(sub);
            }
          }
        }
        if(checkLayers) {
          // если соединителей не нашлось, ищем пересечения
          bounds = deleting ? bounds.expand(3 * delta.length) : layer.bounds;
          for (const candidate of profile.project.contours) {
            if(!layers.has(candidate) && candidate.bounds.intersects(bounds)) {
              const intersected = candidate.bounds.intersect(bounds);
              if(orientation.is('vert') && intersected.height < 100 || orientation.is('hor') && intersected.width < 100) {
                continue;
              }
              const profile = candidate.profiles.find(({generatrix}) => {
                const center = generatrix.getPointAt(generatrix.length / 2);
                return bounds.contains(center);
              }) || candidate.profiles[0];
              move_layer(profile, delta);
              break;
            }
          }
        }
      }
    }

    function clear_joined(layer) {
      for (const sub of layer.contours) {
        clear_joined(sub);
      }
      for (const sub of layer.profiles) {
        const {_attr} = sub;
        _attr._rays?.clear();
        delete _attr.d0;
      }
    }

    for (const profile of nearests) {
      move_layer(profile);
    }
    this.bind_nearests(nearests);
    for(const connective of connectives) {
      connective.bind_nearests();
    }

    for (const layer of layers) {
      clear_joined(layer);
    }
  }

  /**
   * Возвращает массив примыкающих рам
   */
  joined_nearests() {
    const res = [];
    const {project: {contours}, layer} = this;
    [layer].concat(contours).forEach((contour) => {
      contour.profiles.forEach((profile) => {
        if(profile !== this && profile.nearest(true) === this){
          res.push(profile);
        }
      });
    });
    return res;
  }

  /**
   * К соединителям импосты не крепятся
   * @override
   */
  joined_imposts(check_only) {
    return check_only ? false : {inner: [], outer: []};
  }

  /**
   * Примыкающий внешний элемент - для соединителя всегда пусто
   * @override
   * @return {void}
   */
  nearest(ign_cnn) {
    const {_attr, layer, project} = this;
    let {_nearest, _nearest_cnn} = _attr;

    if(_nearest) {
      if(!_nearest_cnn) {
        _nearest_cnn = project.elm_cnn(this, _nearest);
      }
      const {cat, enm} = $p;
      _attr._nearest_cnn = cat.cnns.elm_cnn(this, _nearest, enm.cnn_types.acn.ii, _nearest_cnn, true);
      if(_attr._nearest_cnn && _attr._nearest_cnn !== _nearest_cnn) {
        const proto = {elm1: this.elm, elm2: _nearest.elm}
        const row = _nearest_cnn ? project.ox.cnn_elmnts.find(proto) : project.ox.cnn_elmnts.add(proto);
        row.cnn = _attr._nearest_cnn;
      }
    }
    
    return _nearest;
  }

  /**
   * Положение соединительного профиля
   * @type {EnmPositions}
   */
  get pos() {
    const nearests = this.joined_nearests();
    if(nearests.length > 1) {
      return $p.enm.positions.center;
    }
    return nearests[0].pos;
  }

  /** @inheritdoc */
  check_err(style) {
    const {ox: {cnn_elmnts}, elm: elm2} = this;
    for(const profile of this.joined_nearests()) {
      const crow = cnn_elmnts.find({elm1: profile.elm, node1: '', elm2, node2: ''});
      if(!crow || crow.cnn.empty()) {
        if(style) {
          const {_corns} = profile._attr;
          const subpath = profile.path.get_subpath(_corns[1], _corns[2]).equidistant(-6);
          Object.assign(subpath, style);
        }
        else {
          const {job_prm: {nom}, msg} = $p;
          this.err_spec_row(nom.cnn_ii_error || nom.info_error, msg.err_no_cnn, this.inset);
        }
      }
    }
  }

  /**
   * Вычисляемые поля в таблице координат
   */
  save_coordinates() {

    const {_attr, _row, generatrix} = this;
    if(!generatrix){
      return;
    }

    _row.x1 = this.x1;
    _row.y1 = this.y1;
    _row.x2 = this.x2;
    _row.y2 = this.y2;
    _row.nom = this.nom;
    _row.path_data = generatrix.pathData;
    _row.parent = 0;

    // добавляем припуски соединений
    _row.len = this.length.round(1);

    // получаем углы между элементами и к горизонту
    _row.angle_hor = this.angle_hor;

    _row.alp1 = Math.round((this.corns(4).subtract(this.corns(1)).angle - generatrix.getTangentAt(0).angle) * 10) / 10;
    if(_row.alp1 < 0){
      _row.alp1 = _row.alp1 + 360;
    }

    _row.alp2 = Math.round((generatrix.getTangentAt(generatrix.length).angle - this.corns(2).subtract(this.corns(3)).angle) * 10) / 10;
    if(_row.alp2 < 0){
      _row.alp2 = _row.alp2 + 360;
    }

    // устанавливаем тип элемента
    _row.elm_type = this.elm_type;
    _row.dop = {nearest: this._attr._nearest?.elm};

    if(_attr._nearest) {
      this.ox.cnn_elmnts.add({
        elm1: _row.elm,
        elm2: _attr._nearest.elm,
        cnn: _attr._nearest_cnn,
        aperture_len: _row.len,
      });
    }

  }

  /** @inheritdoc */
  set_inset(v) {
    const {_row, selected} = this;
    if(_row.inset != v) {
      this.move_linked(true);
      super.set_inset(v);

      // для уже нарисованных элементов...
      this.move_linked();
      this.setSelection(selected);
    }
  }

  redraw() {
    super.redraw();
    return this.draw_articles();
  }

  /**
   * Удаляет элемент из контура и иерархии проекта
   * Одновлеменно, инициирует обновление путей примыкающих элементов
   */
  remove() {
    const {d2} = this;
    const postprocess = {imposts: new Map(), sub: new Set()};
    const connectives = new Map();
    this.clear_joined(true, postprocess);
    super.remove();
    for(const elm of postprocess.sub) {
      const {_attr, generatrix} = elm; 
      _attr._rays?.clear();
      delete _attr.d0;
      delete _attr._nearest;
      if(elm instanceof ProfileConnective) {
        connectives.set(elm, elm.joined_nearests());
        const normal = generatrix.getNormalAt(generatrix.length / 2).normalize(d2);
        generatrix.translate(normal);
      }
    }
    for(const [upper, imposts] of postprocess.imposts) {
      for (const {profile, point} of imposts) {
        profile._attr._rays?.clear();
        const node = profile.b.getDistance(point, true) < profile.e.getDistance(point, true) ? 'b' : 'e';
        profile.do_sub_bind(upper, node);
      }
    }
    for(const [elm, nearests] of connectives) {
      elm.bind_nearests(nearests);
    }
  }

}


/**
 * @summary Служебный слой соединительных профилей
 *
 * @extends paper.Layer
 */
class ConnectiveLayer extends paper.Layer {

  constructor(attr) {
    super(attr);
    this._errors = new paper.Group({parent: this});
  }

  presentation() {
    return 'Соединители';
  }

  get info() {
    return this.presentation;
  }
  
  get kind() {
    return 0;
  }

  get skeleton() {
    return this.project._skeleton;
  }

  get cnstr() {
    return null;
  }

  get flipped() {
    return false;
  }
  set flipped(v) {
    return false;
  }

  get hidden() {
    return !this.visible || this.project.builder_props.cnns === false;
  }
  set hidden(v) {
    this.visible = !v;
    this.redraw();
  }


  /**
   * Продукция слоя соединителей
   * Совпадает с продукцией проекта
   * @return {CatCharacteristics}
   */
  get _ox() {
    return this.project.ox;
  }

  /**
   * Система слоя соединителей
   * @return {CatProduction_params}
   */
  get sys() {
    return this.project._dp.sys;
  }

  /**
   * Фурнитура слоя соединителей всегда пустая
   * @type {CatFurns}
   */
  get furn() {
    return $p.cat.furns.get();
  }

  redraw() {
    const {_errors, children} = this;
    const visible = !this.hidden;
    children.forEach((elm) => {
      if(elm !== _errors) {
        elm.visible = visible;
        elm.redraw?.();
        if(elm instanceof ProfileItem) {
          elm.path.fillColor = BuilderElement.clr_by_clr.call(elm, elm.clr);
        }
      }
    });
    _errors.removeChildren();
    //_errors.bringToFront();
  }
  
  save_coordinates() {
    return this.children.reduce((accumulator, elm) => {
      return elm?.save_coordinates ?  accumulator.then(() => elm.save_coordinates()) : accumulator;
    }, Promise.resolve());
  }

  /**
   * Заглушка
   */
  glasses() {
    return [];
  }

  /**
   * Заглушка
   */
  get contours() {
    return [];
  }

  /**
   * Заглушка
   */
  refresh_prm_links() {

  }

  get _manager() {
    return this.project._dp._manager;
  }

  _metadata(fld) {
    return Contour.prototype._metadata.call(this, fld);
  }

  /**
   * Возвращает слой размерных линий проекта
   * @type {DimensionLayer}
   */
  get l_dimensions() {
    return this.project.contours[0].l_dimensions;
  }

  /**
   * Возвращает массив профилей текущего слоя
   * @type {Array.<ProfileItem>}
   */
  get profiles() {
    return this.children.filter((elm) => elm instanceof ProfileItem);
  }

  /**
   * Возвращает массив раскладок текущего слоя
   * @type {Array}
   */
  get onlays() {
    return [];
  }

  /**
   * Площадь профилей слоя соединителей
   * @type {number}
   */
  get area() {
    return (this.profiles.reduce((sum, {path}) => sum + path.area, 0) /1e6).round(4);
  }

  /**
   * @summary Толщина слоя
   * @desc Принимается равной максимальной толщине профиля
   * @param {Boolean} [withChildren]
   * @return {Number}
   */
  thickness() {
    return this.profiles.reduce((sum, {thickness}) =>  thickness > sum ? thickness : sum, 0);
  }

  /**
   * Обработчик при изменении системы
   */
  on_sys_changed() {
    this.profiles.forEach((elm) => elm.default_inset(true));
  }

  /**
   * Возвращает значение параметра с учётом наследования
   */
  extract_pvalue({param, cnstr, elm, origin, prm_row}) {
    return param.extract_pvalue({ox: this._ox, cnstr, elm, origin, prm_row});
  }

  /**
   * Формирует оповещение для тех, кто следит за this._noti
   * @param obj
   */
  notify(obj, type = 'update') {
    //Contour.prototype.notify.call(this, obj, type);
  }
}

EditorInvisible.ProfileConnective = ProfileConnective;
EditorInvisible.ConnectiveLayer = ConnectiveLayer;
