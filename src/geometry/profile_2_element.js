
/*
 * Created 24.07.2015
 *
 * @module geometry
 * @submodule profile
 */

/**
 * @summary Профиль
 * @desc Класс описывает поведение сегмента профиля (створка, рама, импост).
 * У профиля есть координаты конца и начала, есть путь образующей - прямая или кривая линия
 *
 * @extends ProfileItem
 *
 * @tutorial 02_geometry
 *
 * @example {@caption Создаём элемент профиля на основании пути образующей. Одновременно, указываем контур, которому будет принадлежать профиль, вставку и цвет}
 *
 * new Profile({
 *   generatrix: new paper.Path({
 *     segments: [[1000,100], [0, 100]]
 *    }),
 *    proto: {parent, inset, clr}
 *  });
 */
class Profile extends ProfileItem {

  /** @inheritdoc */
  constructor(attr) {

    const fromCoordinates = attr.row && attr.row.elm;

    super(attr);

    if(this.parent) {
      const {project: {_scope}, observer, layer} = this;

      // Подключаем наблюдателя за событиями контура с именем _consts.move_points_
      this.observer = observer.bind(this);
      _scope.eve.on(consts.move_points, this.observer);

      // Информируем контур о том, что у него появился новый ребёнок
      this.layer.on_insert_elm(this);

      // ищем и добавляем доборные профили
      if(fromCoordinates){
        const {cnstr, elm, _owner} = attr.row;
        _owner.find_rows({cnstr, parent: {in: [elm, -elm]}}, (row) => {
          // добор
          if(row.elm_type.is('addition')) {
            new ProfileAddl({row, parent: this});
          }
          if(row.elm_type.is('addition_outer')) {
            new ProfileAddlOuter({row, parent: this});
          }
          // примыкание
          else if(row.elm_type.is('adjoining')) {
            new ProfileAdjoining({row, parent: this});
          }
          // связка (чулок)
          else if(row.elm_type.is('bundle')) {
            new ProfileSegment({row, parent: this});
          }
          // штапик
          else if(row.elm_type.is('glbead')) {
            new ProfileGlBead({row, parent: layer.children.profiles, profile: this});
          }
        });
      }
      this.auto_insets();
    }
  }

  /** @override */
  get d0() {
    const {_attr} = this;
    if(!_attr.hasOwnProperty('d0')) {
      _attr.d0 = this.offset;
      const nearest = this.nearest();
      if(nearest) {
        _attr.d0 = this.offset +
          (this.is_collinear(nearest) ? -nearest.d2 : nearest.d1) -
          (_attr._nearest_cnn ? _attr._nearest_cnn.size(this, nearest) : 0);
      }
    }
    return _attr.d0;
  }

  /**
   * Возвращает тип элемента (рама, створка, импост)
   * @type {EnmElm_types}
   */
  get elm_type() {
    const {_rays, _nearest} = this._attr;
    const {elm_types} = $p.enm;

    // если начало или конец элемента соединены с соседями по Т, значит это импост
    if((this.hasInner && this.hasOuter) || _rays && !_nearest && (_rays.b.is_tt || _rays.e.is_tt)) {
      return elm_types.impost;
    }

    // Если вложенный контур, значит это створка
    return this.layer?.level ? elm_types.flap : elm_types.rama;
  }

  /**
   * Является ли текущий элемент _связкой_
   * @type {Boolean}
   */
  get is_bundle() {
    return Boolean(this.children.find((elm) => elm instanceof ProfileSegment));
  }

  /**
   * @override
   */
  nearest(ign_cnn) {

    const {enm, cat} = $p;
    const {b, e, _attr, layer, project} = this;
    let {_nearest, _nearest_cnn} = _attr;

    if(!ign_cnn && this.inset.empty()) {
      ign_cnn = true;
    }
    
    if(_nearest instanceof ProfileConnective) {
      if(!ign_cnn) {
        if(!_nearest_cnn) {
          _nearest_cnn = project.elm_cnn(this, _nearest);
        }
        _attr._nearest_cnn = cat.cnns.elm_cnn(this, _nearest, enm.cnn_types.acn.ii, _nearest_cnn, true, false);
      }
      return _nearest;
    }

    const check_nearest = (elm) => {
      if(!(elm instanceof Profile || elm instanceof ProfileConnective || elm instanceof ProfileTearing) || !elm.isInserted() || !b || !e) {
        return;
      }
      if(elm.is_linear() !== this.is_linear()) {
        return;
      }
      let {generatrix} = elm;
      if(elm.elm_type === $p.enm.elm_types.Импост) {
        const pb = elm.cnn_point('b').profile;
        const pe = elm.cnn_point('e').profile;
        if(pb && pb.nearest(true) || pe && pe.nearest(true)) {
          generatrix = generatrix.clone({insert: false}).elongation(200);
        }
      }
      let is_nearest = [];
      if(generatrix.is_nearest(b)) {
        is_nearest.push(b);
      }
      if(generatrix.is_nearest(e)) {
        is_nearest.push(e);
      }
      if(is_nearest.length < 2 && elm instanceof ProfileConnective) {
        if(this.generatrix.is_nearest(elm.b)) {
          if(is_nearest.every((point) => !point.is_nearest(elm.b))) {
            is_nearest.push(elm.b);
          }
        }
        if(this.generatrix.is_nearest(elm.e)) {
          if(is_nearest.every((point) => !point.is_nearest(elm.e))) {
            is_nearest.push(elm.e);
          }
        }
      }

      if(is_nearest.length > 1) {
        if(!ign_cnn) {
          if(!_nearest_cnn) {
            _nearest_cnn = project.elm_cnn(this, elm);
          }
          // выясним сторону соединения
          let outer;
          if(elm.is_linear()) {
            outer = Math.abs(elm.angle_hor - this.angle_hor) > 60;
          }
          else {
            const ob = generatrix.getOffsetOf(generatrix.getNearestPoint(b));
            const oe = generatrix.getOffsetOf(generatrix.getNearestPoint(e));
            outer = ob > oe;
          }
          _attr._nearest_cnn = cat.cnns.elm_cnn(this, elm, $p.enm.cnn_types.acn.ii, _nearest_cnn, false, outer);
        }
        _attr._nearest = elm;
        return true;
      }

      _attr._nearest = null;
      _attr._nearest_cnn = null;
    };

    const find_nearest = (children) => children.some((elm) => {
      if(_nearest == elm || !elm.generatrix) {
        return;
      }
      if(check_nearest(elm)) {
        return true;
      }
      else {
        _attr._nearest = null;
      }
    });
    
    if(layer && (!_attr._nearest || !check_nearest(_attr._nearest))) {
      if(layer.layer) {
        find_nearest(layer.layer.profiles);
      }
      else if(layer !== project.l_connective) {
        find_nearest(project.l_connective.children);
      }
    }

    return _attr._nearest;
  }

  /**
   * Добавляет сегменты
   * Превращает текущий элемент в "Чулок сегментов" и создаёт внутри несколько {@link ProfileSegment}
   * @param [count=2] {Number} - на сколько сегментов резать
   * @return {void}
   */
  split_by(count) {
    const {generatrix, segms, inset, clr, project} = this;
    if(!count || typeof count !== 'number' || count < 2) {
      count = 2;
    }
    const len = generatrix.length / count;
    let first = generatrix.clone({insert: false});
    for(let i=1; i<count; i++) {
      const loc = first.getLocationAt(len);
      const second = first.splitAt(loc);
      new ProfileSegment({generatrix: first, proto: {inset, clr}, parent: this, project});
      first = second;
    }
    new ProfileSegment({generatrix: first, proto: {inset, clr}, parent: this, project});
  }

  beforeRemove() {
    const {project, layer} = this;
    if(project?._attr && !project._attr._loading && !layer?._removing && (this.joined_imposts(true) || this.joined_nearests().length)) {
      $p.ui?.dialogs?.alert?.({
        title: `Профиль №${this.elm}`,
        text: 'Удаление невозможно, есть примыкающие элементы',
      });
      return false;
    }
    return true;
  }

  /**
   * Возвращает массив примыкающих створочных профилей
   * @returns {Array.<Profile>}
   */
  joined_nearests() {
    const res = [];

    this.layer?.contours?.forEach((contour) => {
      contour.profiles.forEach((profile) => {
        if(profile.nearest(true) === this) {
          if(profile instanceof ProfileVirtual) {
            res.push(...profile.joined_nearests());
          }
          else {
            res.push(profile);
          }
        }
      });
    });

    return res;
  }

  /**
   * Возвращает массив примыкающих заполнений и вложенных контуров
   * @param [glasses]
   * @return {Array.<Filling>}
   */
  joined_glasses(glasses) {
    if(!glasses) {
      glasses = this.layer.glasses();
    }
    const res = [];
    for(const glass of glasses) {
      const is_layer = glass instanceof Contour;
      if(glass.profiles.some((profile) => is_layer ? profile === this || this.is_nearest(profile) : profile.profile === this)) {
        res.push(glass);
      }
    }
    return res;
  }

  /**
   * Соединение конца профиля
   * С этой функции начинается пересчет и перерисовка профиля
   * Возвращает объект соединения конца профиля
   * - Попутно проверяет корректность соединения. Если соединение не корректно, сбрасывает его в пустое значение и обновляет ограничитель типов доступных для узла соединений
   * - Попутно устанавливает признак `is_cut`, если в точке сходятся больше двух профилей
   * - Не делает подмену соединения, хотя могла бы
   * - Не делает подмену вставки, хотя могла бы
   *
   * @param {NodeBE} node - имя узла профиля
   * @param {paper.Point} [point] - координаты точки, в окрестности которой искать
   * @return {CnnPoint} - объект {point, profile, cnn_types}
   */
  cnn_point(node, point) {
    const {project, parent, rays} = this;
    const {sticking, sticking_l} = this.sticking();
    const res = rays[node];
    const {cnn, profile, profile_point} = res;

    if(!point) {
      point = this[node];
    }

    // Если привязка не нарушена, возвращаем предыдущее значение
    let ok;
    if(profile?.children.length) {
      if(!project.has_changes()) {
        ok = true;
      }
      else if(this.check_distance(profile, res, point, true) === false || res.distance < consts.epsilon) {
        ok = true;
      }
    }

    // TODO вместо полного перебора профилей контура, реализовать анализ текущего соединения и успокоиться, если соединение корректно
    if(!ok) {
      res.clear();
      if(parent) {
        const ares = [];

        for(const profile of parent.profiles) {
          if(this.check_distance(profile, res, point, false) === false || (res.distance < ((res.is_t || !res.is_l) ? sticking : sticking_l))) {
            ares.push({
              profile_point: res.profile_point,
              profile: profile,
              cnn_types: res.cnn_types,
              point: res.point
            });
            res.clear();
          }
        }

        if(ares.length === 1) {
          res._mixin(ares[0]);
        }
        // если в точке сходятся 3 и более профиля, ищем тот, который смотрит на нас под максимально прямым углом
        else if(ares.length >= 2) {
          if(this.max_right_angle(ares)) {
            res._mixin(ares[0]);
            // если установленное ранее соединение проходит по типу, нового не ищем
            if(cnn && res.cnn_types && res.cnn_types.includes(cnn.cnn_type)) {
              res.cnn = cnn;
            }
          }
          // и среди соединений нет углового диагонального, вероятно, мы находимся в разрыве - выбираем соединение с пустотой
          else {
            res.clear();
          }
          res.is_cut = true;
        }
      }
    }

    return res;
  }

  /**
   * Для всех элементов, кроме импостов, возвращает сам элемент
   * Используется справочником {@link CatClrs|цветов} для расчёта алгоритмом КакВедущий*
   * @param {NodeBE} be - узел
   * @return {BuilderElement}
   */
  t_parent(be) {
    if(!this.elm_type.is('impost')) {
      return this;
    }
    const {_rays} = this._attr;
    if(be === 'b') {
      return _rays && _rays.b.profile;
    }
    if(be === 'e') {
      return _rays && _rays.e.profile;
    }
    return _rays && (_rays.b.profile || _rays.e.profile);
  }

  /**
   * Пересчитывает путь элемента, если изменились параметры, влияющие на основной материал вставки
   * @param param {CchProperties}
   * @return {void}
   */
  refresh_inset_depends(param, with_neighbor) {
    const {inset, _attr: {_rays, _nearest_cnn}} = this;
    if(_rays && (inset.is_depend_of(param) || _nearest_cnn?.is_depend_of?.(param))) {
      _rays.clear(with_neighbor ? 'with_neighbor' : true);
    }
  }

  /**
   * @summary Добавляет автовставки
   * @desc Только обычные. Вставки рядов игнорируем
   */
  auto_insets() {
    const {inset, elm, layer, ox} = this;
    ox.inserts && inset.inserts.find_rows({by_default: true}, (row) => {
      if(!row.inset.region && row.key.check_condition({elm: this, ox, layer})) {
        const key = {cnstr: -elm, inset: row.inset, region: 0};
        if(!ox.inserts.find(key)) {
          const irow = ox.inserts.add(key);
          row.inset.clr_group.default_clr(irow);
        }
      }
    });
  }
  
  redraw() {
    super.redraw();
    return this.draw_articles();
  }

  remove() {
    const res = super.remove();
    if(res !== false) {
      const {l_dimensions} = this.project;
      if(l_dimensions?.articles?.map?.has?.(this)) {
        l_dimensions.articles.map.get(this).remove();
        l_dimensions.articles.map.delete(this);
      }
    }
    return res;
  }
  
}

EditorInvisible.Profile = Profile;
