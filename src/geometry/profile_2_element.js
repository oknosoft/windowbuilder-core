
/**
 * Created 24.07.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2018
 * @author  Evgeniy Malyarov
 *
 * @module geometry
 * @submodule profile
 */

/**
 * ### Профиль
 * Класс описывает поведение сегмента профиля (створка, рама, импост)<br />
 * У профиля есть координаты конца и начала, есть путь образующей - прямая или кривая линия
 *
 * @class Profile
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @constructor
 * @extends ProfileItem
 * @menuorder 42
 * @tooltip Профиль
 *
 * @example
 *
 *     // Создаём элемент профиля на основании пути образующей
 *     // одновременно, указываем контур, которому будет принадлежать профиль, вставку и цвет
 *     new Profile({
 *       generatrix: new paper.Path({
 *         segments: [[1000,100], [0, 100]]
 *       }),
 *       proto: {
 *         parent: _contour,
 *         inset: _inset
 *         clr: _clr
 *       }
 *     });
 */
class Profile extends ProfileItem {

  constructor(attr) {

    const fromCoordinates = !!attr.row;

    super(attr);

    if(this.parent) {
      const {project: {_scope}, observer} = this;

      // Подключаем наблюдателя за событиями контура с именем _consts.move_points_
      this.observer = observer.bind(this);
      _scope.eve.on(consts.move_points, this.observer);

      // Информируем контур о том, что у него появился новый ребёнок
      this.layer.on_insert_elm(this);

      // ищем и добавляем доборные профили
      if(fromCoordinates){
        const {cnstr, elm, _owner} = attr.row;
        _owner.find_rows({cnstr, parent: {in: [elm, -elm]}, elm_type: $p.enm.elm_types.Добор}, (row) => new ProfileAddl({row, parent: this}));
      }
    }

  }

  /**
   * Расстояние от узла до опорной линии
   * для сегментов створок и вложенных элементов зависит от ширины элементов и свойств примыкающих соединений
   * @property d0
   * @type Number
   */
  get d0() {
    const {_attr} = this;
    if(!_attr.hasOwnProperty('d0')) {
      _attr.d0 = this.offset;
      const nearest = this.nearest();
      if(nearest) {
        _attr.d0 -= nearest.d2 + (_attr._nearest_cnn ? _attr._nearest_cnn.size(this) : 20);
      }
    }
    return _attr.d0;
  }

  /**
   * Возвращает тип элемента (рама, створка, импост)
   */
  get elm_type() {
    const {_rays, _nearest} = this._attr;
    const {elm_types} = $p.enm;

    // если начало или конец элемента соединены с соседями по Т, значит это импост
    if(_rays && !_nearest && (_rays.b.is_tt || _rays.e.is_tt)) {
      return elm_types.Импост;
    }

    // Если вложенный контур, значит это створка
    if(this.layer.parent instanceof Contour) {
      return elm_types.Створка;
    }

    return elm_types.Рама;
  }

  /**
   * Положение элемента в контуре
   */
  get pos() {
    const by_side = this.layer.profiles_by_side();
    if(by_side.top == this) {
      return $p.enm.positions.Верх;
    }
    if(by_side.bottom == this) {
      return $p.enm.positions.Низ;
    }
    if(by_side.left == this) {
      return $p.enm.positions.Лев;
    }
    if(by_side.right == this) {
      return $p.enm.positions.Прав;
    }
    // TODO: рассмотреть случай с выносом стоек и разрывами
    return $p.enm.positions.Центр;
  }

  /**
   * Примыкающий внешний элемент - имеет смысл для сегментов створок, доборов и рам с внешними соединителями
   * @property nearest
   * @type Profile
   */
  nearest(ign_cnn) {

    const {b, e, _attr, layer, project} = this;
    let {_nearest, _nearest_cnn} = _attr;

    if(!ign_cnn && this.inset.empty()) {
      ign_cnn = true;
    }

    const check_nearest = (elm) => {
      if(!(elm instanceof Profile || elm instanceof ProfileConnective) || !elm.isInserted()) {
        return;
      }
      let {generatrix} = elm;
      if(elm.elm_type === $p.enm.elm_types.Импост) {
        const pb = elm.cnn_point('b').profile;
        const pe = elm.cnn_point('e').profile;
        if(pb && pb.nearest(true) || pe && pe.nearest(true)) {
          generatrix = generatrix.clone({insert: false}).elongation(100);
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
          _attr._nearest_cnn = $p.cat.cnns.elm_cnn(this, elm, $p.enm.cnn_types.acn.ii, _nearest_cnn, false, outer);
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

    if(layer && !check_nearest(_attr._nearest)) {
      if(layer.parent) {
        find_nearest(layer.parent.profiles);
      }
      else {
        find_nearest(project.l_connective.children);
      }
    }

    return _attr._nearest;
  }

  /**
   * Возвращает массив примыкающих ипостов
   */
  joined_imposts(check_only) {

    const {rays, generatrix, layer} = this;
    const tinner = [];
    const touter = [];

    // точки, в которых сходятся более 2 профилей
    const candidates = {b: [], e: []};

    const {Снаружи} = $p.enm.cnn_sides;
    const add_impost = (ip, curr, point) => {
      const res = {point: generatrix.getNearestPoint(point), profile: curr};
      if(this.cnn_side(curr, ip, rays) === Снаружи) {
        touter.push(res);
      }
      else {
        tinner.push(res);
      }
    };

    if(layer.profiles.some((curr) => {
      if(curr != this) {
        for(const pname of ['b', 'e']) {
          const cpoint = curr.rays[pname];
          if(cpoint.profile == this && cpoint.cnn) {
            if(!cpoint.profile_point) {
              if(check_only) {
                return true;
              }
              add_impost(curr.corns(1), curr, cpoint.point);
            }
            else {
              candidates[pname].push(curr.corns(1));
            }
          }
        }
      }
    })) {
      return true;
    }

    // если в точке примыкает более 1 профиля...
    ['b', 'e'].forEach((node) => {
      if(candidates[node].length > 1) {
        candidates[node].some((ip) => {
          if(this.cnn_side(null, ip, rays) === Снаружи) {
            //this.cnn_point(node).is_cut = true;
            this.rays[node].is_cut = true;
            return true;
          }
        });
      }
    });

    return check_only ? false : {inner: tinner, outer: touter};

  }

  /**
   * Возвращает массив примыкающих створочных элементов
   */
  joined_nearests() {
    const res = [];

    this.layer.contours.forEach((contour) => {
      contour.profiles.forEach((profile) => {
        if(profile.nearest(true) === this) {
          res.push(profile);
        }
      });
    });

    return res;
  }

  /**
   * Возвращает массив примыкающих заполнений и вложенных контуров
   * @param [glasses]
   * @return {[]}
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
   * ### Соединение конца профиля
   * С этой функции начинается пересчет и перерисовка профиля
   * Возвращает объект соединения конца профиля
   * - Попутно проверяет корректность соединения. Если соединение не корректно, сбрасывает его в пустое значение и обновляет ограничитель типов доступных для узла соединений
   * - Попутно устанавливает признак `is_cut`, если в точке сходятся больше двух профилей
   * - Не делает подмену соединения, хотя могла бы
   * - Не делает подмену вставки, хотя могла бы
   *
   * @method cnn_point
   * @param node {String} - имя узла профиля: "b" или "e"
   * @param [point] {paper.Point} - координаты точки, в окрестности которой искать
   * @return {CnnPoint} - объект {point, profile, cnn_types}
   */
  cnn_point(node, point) {
    const {project, parent, rays} = this;
    const res = rays[node];
    const {cnn, profile, profile_point} = res;

    if(!point) {
      point = this[node];
    }

    // Если привязка не нарушена, возвращаем предыдущее значение
    if(profile && profile.children.length) {
      if(!project.has_changes()) {
        return res;
      }
      if(this.check_distance(profile, res, point, true) === false || res.distance < consts.epsilon) {
        return res;
      }
    }

    // TODO вместо полного перебора профилей контура, реализовать анализ текущего соединения и успокоиться, если соединение корректно
    res.clear();
    if(parent) {
      const {allow_open_cnn} = project._dp.sys;
      const ares = [];

      for(const profile of parent.profiles) {
        if(this.check_distance(profile, res, point, false) === false || (res.distance < ((res.is_t || !res.is_l) ? consts.sticking : consts.sticking_l))) {
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

    return res;
  }

  /**
   * тот, к кому примыкает импост
   * @return {BuilderElement}
   */
  t_parent(be) {
    if(this.elm_type != $p.enm.elm_types.Импост) {
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
}

EditorInvisible.Profile = Profile;
