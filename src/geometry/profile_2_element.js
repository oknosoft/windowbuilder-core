
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
            new ProfileGlBead({row, parent: layer, profile: this});
          }
        });
      }
    }
  }

  /** @override */
  get d0() {
    const {_attr} = this;
    if(!_attr.hasOwnProperty('d0')) {
      _attr.d0 = this.offset;
      const nearest = this.nearest();
      if(nearest) {
        _attr.d0 -= nearest.d2 + (_attr._nearest_cnn ? _attr._nearest_cnn.size(this, nearest) : 20);
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
    if(_rays && !_nearest && (_rays.b.is_tt || _rays.e.is_tt)) {
      return elm_types.impost;
    }

    // Если вложенный контур, значит это створка
    if(this.layer?.parent instanceof Contour) {
      return elm_types.flap;
    }

    return elm_types.rama;
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

    const {b, e, _attr, layer, project} = this;
    let {_nearest, _nearest_cnn} = _attr;

    if(!ign_cnn && this.inset.empty()) {
      ign_cnn = true;
    }

    const check_nearest = (elm) => {
      if(!(elm instanceof Profile || elm instanceof ProfileConnective || elm instanceof ProfileTearing) || !elm.isInserted()) {
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
    if(layer && (!_attr._nearest || !check_nearest(_attr._nearest))) {
      if(layer.layer) {
        find_nearest(layer.layer.profiles);
      }
      else {
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
    const {project} = this;
    if(project?._attr && !project._attr._loading && (this.joined_imposts(true) || this.joined_nearests().length)) {
      $p.ui?.dialogs?.alert?.({
        title: `Профиль №${this.elm}`,
        text: 'Удаление невозможно, есть примыкающие элементы',
      });
      return false;
    }
    return true;
  }

  /**
   * Возвращает массив примыкающих ипостов
   * @param {Boolean} [check_only] - не формировать подробный ответ, только проверить наличие примыкающих импостов
   * @returns {Object|Boolean}
   */
  joined_imposts(check_only) {

    const {rays, generatrix, layer} = this;
    const tinner = [];
    const touter = [];

    // точки, в которых сходятся более 2 профилей
    const candidates = {b: [], e: []};

    const {outer} = $p.enm.cnn_sides;
    const add_impost = (ip, curr, point) => {
      const res = {point: generatrix.getNearestPoint(point), profile: curr};
      if(this.cnn_side(curr, ip, rays) === outer) {
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
            const ipoint = curr.interiorPoint();
            if(cpoint.is_tt) {
              if(check_only) {
                return true;
              }
              add_impost(ipoint, curr, cpoint.point);
            }
            else {
              candidates[pname].push(ipoint);
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
          if(ip && this.cnn_side(null, ip, rays) === outer) {
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
   * Возвращает массив примыкающих створочных профилей
   * @returns {Array.<Profile>}
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
   * Возвращает виртуальный профиль ряда, вставка и соединения которого, заданы в отдельных свойствах
   * DataObj, транслирующий свойства допвставки через свойства элемента
   * @param num {Number}
   * @return {Profile}
   */
  region(num) {
    const {_attr, rays, layer: {_ox}, elm} = this;
    const {cat: {cnns, inserts}, utils} = $p;
    const irow = _ox.inserts.find({cnstr: -elm, region: num});
    
    if(!irow) {
      return this;
    }

    // параметры выбора для ряда
    function cnn_choice_links(elm1, o, cnn_point) {
      const nom_cnns = cnns.nom_cnn(elm1, cnn_point.profile, cnn_point.cnn_types, false, undefined, cnn_point);
      return nom_cnns.some((cnn) => {
        return o.ref == cnn;
      });
    }

    // возаращает строку соединяемых элементов для ряда
    function cn_row(prop, add) {
      let node1 = prop === 'cnn1' ? 'b' : (prop === 'cnn2' ? 'e' : '');
      const cnn_point = rays[node1] || {};
      const {profile, profile_point} = cnn_point;
      node1 += num;
      const node2 = profile_point ? (profile_point + num) : `t${num}`;
      const elm2 = profile ? profile.elm : 0;
      let row = _ox.cnn_elmnts.find({elm1: elm, elm2, node1, node2});
      if(!row && add) {
        row = _ox.cnn_elmnts.add({elm1: elm, elm2, node1, node2});
      }
      return add === 0 ? {row, cnn_point} : row;
    }

    if(!_attr._ranges) {
      _attr._ranges = new Map();
    }
    if(!_attr._ranges.get(num)) {
      const __attr = {_corns: []};
      _attr._ranges.set(num, new Proxy(this, {
        get(target, prop, receiver) {
          switch (prop){
            case '_attr':
              return __attr;
            case 'cnn1':
            case 'cnn2':
            case 'cnn3':
              if (!_attr._ranges.get(`cnns${num}`)) {
                _attr._ranges.set(`cnns${num}`, {});
              }
              const cn = _attr._ranges.get(`cnns${num}`);
              if (!cn[prop]) {
                const row = cn_row(prop);
                cn[prop] = row ? row.cnn : cnns.get();
              }
              return cn[prop];

            case 'cnn1_row':
            case 'cnn2_row':
            case 'cnn3_row':
              return cn_row(prop.substr(0, 4), 0);

            case 'rnum':
              return num;

            case 'irow':
              return irow;

            case 'inset':
              return irow.inset;

            case 'nom':
              return receiver.inset.nom(receiver, 0);

            case 'ref': {
              const {nom} = receiver;
              return nom && !nom.empty() ? nom.ref : receiver.inset.ref;
            }

            case 'sizeb':
              return BuilderElement.prototype.get_sizeb.call(receiver);
              
            case 'd1':
              return -(target.d0 - receiver.sizeb);
              
            case 'd2':
              return receiver.d1 - receiver.width;
              
            case 'width':
              return receiver.nom?.width || target.width;
              
            case 'rays': {
              if(!__attr._rays) {
                __attr._rays = new ProfileRays(receiver);
              }
              const {_rays} = __attr;
              if(!_rays.inner.segments.length || !_rays.outer.segments.length) {
                _rays.recalc();
              }
              _rays.b._profile = rays.b._profile?.region?.(num);
              _rays.e._profile = rays.e._profile?.region?.(num);
              _rays.b.cnn = receiver.cnn1;
              _rays.e.cnn = receiver.cnn2;
              return _rays;
            }

            case 'path': {
              // получаем узлы
              const {generatrix, rays} = receiver;
              // получаем соединения концов профиля и точки пересечения с соседями
              ProfileItem.prototype.path_points.call(receiver, rays.b, 'b', []);
              ProfileItem.prototype.path_points.call(receiver, rays.e, 'e', []);
              const {paths} = _attr;
              if(!paths.has(num)) {
                paths.set(num, Object.assign(new paper.Path({parent: target}), ProfileItem.path_attr));
              }
              const path = paths.get(num);
              const {_corns} = __attr;
              path.removeSegments();
              path.addSegments([_corns[1], _corns[2], _corns[3], _corns[4]]);
              path.closePath();
              path.fillColor = BuilderElement.clr_by_clr.call(target, irow.clr)
            }
            
            case 'clr':
              return irow.clr; 
            
            case '_metadata': {
              const meta = target.__metadata(false);
              const {fields} = meta;
              const {cnn1, cnn2} = fields;
              const {b, e} = rays;
              delete cnn1.choice_links;
              delete cnn2.choice_links;
              cnn1.list = cnns.nom_cnn(receiver, b.profile, b.cnn_types, false, undefined, b);
              cnn2.list = cnns.nom_cnn(receiver, e.profile, e.cnn_types, false, undefined, e);
              return meta;
            }

            case 'parent_elm':
              return target;

            default:
              let prow;
              if (utils.is_guid(prop)) {
                prow = _ox.params.find({param: prop, cnstr: -elm, region: num});
              }
              return prow ? prow.value : target[prop];
          }
        },

        set(target, prop, val, receiver) {
          switch (prop){
          case 'cnn1':
          case 'cnn2':
          case 'cnn3':
            const cn = _attr._ranges.get(`cnns${num}`);
            cn[prop] = cnns.get(val);
            const row = cn_row(prop, true);
            if(row.cnn !== cn[prop]) {
              row.cnn = cn[prop];
            }
            break;

          case 'clr':
            irow.clr = val;
            break;

          default:
            if(utils.is_guid(prop)) {
              const prow = _ox.params.find({param: prop, cnstr: -elm, region: num}) || _ox.params.add({param: prop, cnstr: -elm, region: num});
              prow.value = val;
            }
            else {
              target[prop] = val;
            }
          }
          target.project.register_change(true, ({_scope}) => _scope.eve.emit_async('region_change', receiver, prop));
          return true;
        },
      }));
    }
    return _attr._ranges.get(num);
  }
}

EditorInvisible.Profile = Profile;
