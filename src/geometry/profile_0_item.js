
/*
 * Базовые классы профиля
 *
 * Created by Evgeniy Malyarov on 24.07.2015.
 */

/**
 * Объект, описывающий геометрию соединения
 */
class CnnPoint {

  /**
   * 
   * @param {ProfileItem} parent - родительский профиль
   * @param {NodeBE} node - имя узла профиля
   */
  constructor(parent, node) {

    this._parent = parent;

    /**
     * Имя точки соединения (b или e)
     * @type String
     */
    this.node = node;

    this.initialize();
  }

  /**
   * Проверяет, является ли соединение в точке Т-образным.
   * L для примыкающих рассматривается, как Т
   */
  get is_t() {
    const {cnn, parent, profile, profile_point} = this;
    const {cnn_types, orientations} = $p.enm;

    // если примыкание не в углу, это точно Т
    if(profile && !profile_point) {
      return true;
    }

    // если это угол, то точно не T
    if(!cnn || cnn.cnn_type == cnn_types.ad) {
      return false;
    }

    // если это Ʇ, или † то без вариантов T
    if(cnn.cnn_type == cnn_types.t) {
      return true;
    }

    // если это Ꞁ или └─, то может быть T в разрыв - проверяем
    if(cnn.cnn_type == cnn_types.av && parent.orientation != orientations.vert) {
      return true;
    }
    if(cnn.cnn_type == cnn_types.ah && parent.orientation != orientations.hor) {
      return true;
    }

    return false;
  }

  /**
   * Строгий вариант is_t: Ꞁ и └ не рассматриваются, как T
   */
  get is_tt() {
    // если это угол, то точно не T
    let {profile_point, profile, parent, point} = this;
    if(profile instanceof Filling) {
      return true;
    }
    if(!point) {
      point = parent[this.node];
    }
    if(this.is_i || profile_point === 'b' || profile_point === 'e' || profile === parent) {
      return false;
    }
    if(profile && (!profile_point || profile_point === 't') && (profile.b.is_nearest(point) || profile.e.is_nearest(point))) {
      return false;
    }
    return true;
  }

  /**
   * Проверяет, является ли соединение в точке L-образным
   * Соединения Т всегда L-образные
   */
  get is_l() {
    const {cnn} = this;
    const {av, ah} = $p.enm.cnn_types;
    return this.is_t || !!(cnn && (cnn.cnn_type === av || cnn.cnn_type === ah));
  }

  get is_short() {
    const {cnn, parent: {orientation}} = this;
    const {short, av, ah, t} = $p.enm.cnn_types;
    return cnn && (cnn.cnn_type === short || cnn.cnn_type === t ||
      (cnn.cnn_type === av && orientation.is('hor')) ||
      (cnn.cnn_type === ah && orientation.is('vert')));
  }

  /**
   * Вариант is_l - по удаленности от узла
   */
  get is_ll() {
    const {point, profile, parent} = this;
    if(!parent._attr.sticking) {
      parent._attr.sticking = Math.pow(parent.width * 2 / 3, 2);
    }
    return profile && (profile.b.is_nearest(point, parent._attr.sticking) || profile.e.is_nearest(point, parent._attr.sticking));
  }

  /**
   * Проверяет, является ли соединение в точке соединением с пустотой
   */
  get is_i() {
    return !this.profile && !this.is_cut;
  }

  /**
   * Проверяет, является ли соединение в точке соединением крест в стык
   */
  get is_x() {
    const {cnn} = this;
    return cnn && cnn.cnn_type === $p.enm.cnn_types.xx;
  }

  /**
   * Профиль, которому принадлежит точка соединения
   * @type Profile
   */
  get parent() {
    return this._parent;
  }

  clear(mode) {
    const {_attr} = this._parent;
    if(mode === 'with_neighbor') {
      _attr._corns.length = 0;
      delete _attr.d0;
      delete _attr.nom;
      if(this.profile && this.cnn) {
        this.cnn = $p.cat.cnns.elm_cnn(this._parent, this.profile, this.cnn_types, this.cnn, 0, undefined, this);
      }
      return;
    }
    if(this.profile_point) {
      this.profile_point = '';
    }
    if(this.is_cut) {
      this.is_cut = false;
    }
    const {_row} = this;
    if(_row) {
      _row.elm2 = 0;
    }
    this.profile = null;
    this.err = null;
    this.distance = Infinity;
    this.cnn_types = $p.enm.cnn_types.acn.i;
    if(this.cnn && this.cnn.cnn_type != $p.enm.cnn_types.i) {
      this.cnn = null;
    }
    if(_attr._corns.length > 5) {
      _attr._corns.length = 5;
    }
  }

  /**
   * Массив ошибок соединения
   * @type Array
   */
  get err() {
    return this._err;
  }
  set err(v) {
    if(!v) {
      this._err.length = 0;
    }
    else if(this._err.indexOf(v) == -1) {
      this._err.push(v);
    }
  }

  /**
   * Проверяет ошибки в узле профиля
   * @param style
   */
  check_err(style) {
    const {node, _parent} = this;
    const {_corns, _rays} = _parent._attr;
    if(!_corns.length) {
      return;
    }
    const len = node == 'b' ? _corns[1].getDistance(_corns[4]) : _corns[2].getDistance(_corns[3]);
    const {cnn} = this;
    let angle = _parent.angle_at(node);
    let aerr;
    if(cnn && cnn.amin && cnn.amax) {
      if(angle > 180) {
        angle = 360 - angle;
      }
      if(cnn.amin < 0 && cnn.amax < 0) {
        if(-cnn.amin <= angle && -cnn.amax >= angle) {
          aerr = true;
        }
      }
      else {
        if(cnn.amin > angle || cnn.amax < angle) {
          aerr = true;
        }
      }
    }

    if(aerr || !cnn || (cnn.lmin && cnn.lmin > len) || (cnn.lmax && cnn.lmax < len)) {
      if(style) {
        Object.assign(new paper.Path.Circle({
          center: node == 'b' ? _corns[4].add(_corns[1]).divide(2) : _corns[2].add(_corns[3]).divide(2),
          radius: style.radius || 70,
        }), style);
      }
      else {
        const {job_prm: {nom}, msg} = $p;
        const nom_error = nom.cnn_node_error || nom.critical_error;
        _parent.err_spec_row(nom_error, `${cnn ? msg.err_seam_len : msg.err_no_cnn} ${_parent.nom.article}`, cnn || _parent.inset);
      }
    }
  }

  /**
   * Профиль, с которым пересекается наш элемент в точке соединения
   * @type Profile
   */
  get profile() {
    const {_profile, _row} = this;
    if(!_profile && _row && _row.elm2) {
      this._profile = this.parent.layer.getItem({class: ProfileItem, elm: _row.elm2});
    }
    return this._profile;
  }
  set profile(v) {
    this._profile = v;
  }

  get npoint() {
    const point = this.point || this.parent[this.node];
    if(!this.is_tt) {
      return point;
    }
    const {profile} = this;
    if(!profile || !profile.nearest(true)) {
      return point;
    }
    return profile.nearest(true).generatrix.getNearestPoint(point) || point;
  }

  /**
   * Возвращает профиль и узел, если есть соединение с outer-стороны профиля
   *
   * @return {NodeAndProfile}
   */
  find_other() {

    let {parent, profile, point}  = this;
    if(!point) {
      point = parent[this.node];
    }
    const {rays, layer} = parent;
    const {outer} = $p.enm.cnn_sides;

    // ищем концы профилей в окрестности нас
    for(const elm of layer.profiles) {
      if(elm === parent) {
        continue;
      }
      for(const node of 'be') {
        if(elm[node].is_nearest(point, 1) && parent.cnn_side(elm, null, rays) === outer) {
          return {profile: elm, node};
        }
      }
    }
  }

  /**
   * При наличии соединения с другой стороны, исправляет ссылки на основной профиль и profile_point
   * @param other
   * @return {void}
   */
  correct_profile({profile}, cnn) {
    const {parent, point}  = this;
    const {rays, layer} = parent;
    const {outer} = $p.enm.cnn_sides;

    // ищем концы профилей в окрестности нас
    for(const elm of layer.profiles) {
      if(elm === parent || elm === profile) {
        continue;
      }
      for(const node of 'be') {
        if(elm[node].is_nearest(point, 1) && parent.cnn_side(elm, null, rays) !== outer) {
          this._profile = elm;
          this.profile_point = node;
          const _row = parent.ox.cnn_elmnts.find({elm1: parent.elm, node1: this.node, elm2: elm.elm, node2: node});
          if(_row) {
            this._row = _row;
            _row.cnn = cnn;
          }
          else {
            this._row = parent.ox.cnn_elmnts.add({
              elm1: parent.elm,
              node1: this.node,
              elm2: elm.elm,
              node2: node,
              cnn,
            });
          }
          return;
        }
      }
    }
  }

  /**
   * Возвращает соединение с обратной стороны конца профиля
   * @param other
   * @return {CatCnns}
   */
  cnno(other) {
    // ищем концы профилей в окрестности e
    if(!other) {
      other = this.find_other();
    }
    if(other) {
      const {parent, node} = this;
      const {cnn_elmnts} = parent.ox;
      let row = cnn_elmnts.find({elm1: parent.elm, elm2: other.profile.elm, node1: node, node2: other.node});
      if(!row) {
        row = cnn_elmnts.find({elm1: other.profile.elm, elm2: parent.elm, node1: other.node});
      }
      else if(row === this._row) {
        this.correct_profile(other, row.cnn);
      }
      if(row) {
        this._cnno = {
          elm2: other.profile.elm,
          node2: other.node,
          cnn: row.cnn,
        };
        return row.cnn;
      }
    }
    else if(this._cnno) {
      delete this._cnno;
    }
  }

  set_cnno(v) {
    const other = this.find_other();
    if(other) {
      const {parent, node} = this;
      const {cnn_elmnts} = parent.ox;
      const attr = {elm1: parent.elm, elm2: other.profile.elm, node1: node, node2: other.node};
      let row = cnn_elmnts.find(attr);
      if(!row) {
        row = cnn_elmnts.add(attr);
      }
      else if(row === this._row) {
        this.correct_profile(other, row.cnn);
      }
      row.cnn = v;

      this._cnno = {
        elm2: other.profile.elm,
        node2: other.node,
        cnn: row.cnn,
      };

      parent.project.register_change();
    }
  }

  /**
   * fake-структура для расчета спецификации
   * @return {Object}
   */
  len_angl() {
    const {is_t, cnn} = this;
    const invert = cnn && cnn.cnn_type === $p.enm.cnn_types.av;
    return {
      angle: 90,
      art1: invert ? !is_t : is_t,
      art2: invert ? is_t : !is_t,
    };
  }

  initialize() {

    let {_parent, node} = this;
    if(_parent.rnum) {
      node += _parent.rnum.toFixed();
    }

    //  массив ошибок соединения
    this._err = [];

    // строка в таблице соединений
    _parent.ox.cnn_elmnts.find_rows({elm1: _parent.elm, node1: node}, (row) => {
      if(this._row) {
        // строк больше одной - проверим, не other ли предыдущая с если что - поменяем
        const elm = _parent.layer.getItem({class: ProfileItem, elm: row.elm2});
        if(elm) {

        }
        else if(row.node2 !== node) {
          this._row = row;
        }
      }
      else {
        this._row = row;
      }
    });

    const {acn} = $p.enm.cnn_types;
    if(this._row) {

      /**
       * Текущее соединение - объект справочника соединения
       * @type CatCnns
       */
      this.cnn = this._row.cnn;
      this.profile_point = this._row.node2.substring(0, 1);
      if(['b', 'e', 't'].includes(this.profile_point)) {
        this.distance = 0;
      }

      /**
       * Массив допустимых типов соединений
       * По умолчанию - соединение с пустотой
       * @type Array
       */
      if(acn.a.includes(this.cnn.cnn_type)) {
        this.cnn_types = acn.a;
      }
      else if(acn.t.includes(this.cnn.cnn_type)) {
        this.cnn_types = acn.t;
      }
      else {
        this.cnn_types = acn.i;
      }
    }
    else {
      this.cnn = null;
      this.cnn_types = (_parent.rnum && _parent.parent_elm) ? _parent.parent_elm.rays[this.node]?.cnn_types : acn.i;
      this.profile_point = '';
    }

    /**
     * Расстояние до ближайшего профиля
     * @type Number
     */
    if(!this.hasOwnProperty('distance')) {
      this.distance = Infinity;
    }
    this.point = null;

  }
}

/**
 * Объект, описывающий лучи пути профиля
 */
class ProfileRays {

  constructor(parent) {
    this.parent = parent;
    this.b = new CnnPoint(this.parent, 'b');
    this.e = new CnnPoint(this.parent, 'e');
    this.inner = new paper.Path({insert: false});
    this.outer = new paper.Path({insert: false});
  }

  clear_segments() {
    if(this.inner.segments.length) {
      this.inner.removeSegments();
    }
    if(this.outer.segments.length) {
      this.outer.removeSegments();
    }
  }

  clear(with_cnn) {
    this.clear_segments();
    if(with_cnn) {
      this.b.clear(with_cnn);
      this.e.clear(with_cnn);
    }
    if(with_cnn === 'with_neighbor') {
      const {enm: {cnn_types}, cat: {cnns}} = $p;
      const {parent} = this;

      // прибиваем соединения в точках b и e
      const nodes = ['b', 'e'];
      for(const node of nodes) {
        const {profile, profile_point} = parent._attr._rays[node];
        const other = node === 'b' ? 'e' : 'b';
        if(profile && profile_point == other) {
          const {_rays, _corns} = profile._attr;
          if(_rays) {
            _rays.clear();
            _corns.length = 0;
            const cnn_point = _rays[other];
            cnn_point.cnn = cnns.elm_cnn(profile, parent, cnn_point.cnn_types, cnn_point.cnn, 0, undefined, cnn_point);
          }
        }
      }

      // прибиваем соединения примыкающих к текущему импостов
      const {inner, outer} = parent.joined_imposts();
      const elm2 = parent.elm;
      const {cnn_elmnts} = parent.ox;
      const {cnn_nodes} = ProductsBuilding;
      for (const {profile} of inner.concat(outer)) {
        for(const node of nodes) {
          const cnn_point = profile.rays[node];
          if(cnn_point.profile == parent && cnn_point.cnn) {
            const cnn = cnns.elm_cnn(profile, parent, cnn_point.cnn_types, cnn_point.cnn, 0, undefined, cnn_point);
            if(cnn !== cnn_point.cnn) {
              cnn_elmnts.clear({elm1: profile.elm, node1: cnn_nodes, elm2});
              cnn_point.cnn = cnn;
            }
          }
        }
      }

      // для соединительных профилей и элементов со створками, пересчитываем соседей
      for (const {_attr, elm} of parent.joined_nearests()) {
        _attr._rays && _attr._rays.clear(with_cnn);
        _attr._nearest_cnn = null;
      }

      // так же, пересчитываем соединения с примыкающими заполнениями
      parent.layer.glasses(false, true).forEach((glass) => {
        cnn_elmnts.clear({elm1: glass.elm, node1: cnn_nodes, elm2});
      });
    }
  }

  recalc() {

    const {parent} = this;
    const gen = parent.generatrix;
    const len = gen.length;

    this.clear();

    if(!len) {
      return;
    }

    const {d1, d2, width} = parent;
    const ds = 3 * (width > 20 ? width : 20);
    const step = len * 0.02;

    // первая точка эквидистанты. аппроксимируется касательной на участке (from < начала пути)
    let point_b = gen.firstSegment.point,
      tangent_b = gen.getTangentAt(0),
      normal_b = gen.getNormalAt(0),
      point_e = gen.lastSegment.point,
      tangent_e, normal_e;

    // добавляем первые точки путей
    this.outer.add(point_b.add(normal_b.multiply(d1)).add(tangent_b.multiply(-ds)));
    this.inner.add(point_b.add(normal_b.multiply(d2)).add(tangent_b.multiply(-ds)));

    // для прямого пути, строим в один проход
    if(gen.is_linear()) {
      this.outer.add(point_e.add(normal_b.multiply(d1)).add(tangent_b.multiply(ds)));
      this.inner.add(point_e.add(normal_b.multiply(d2)).add(tangent_b.multiply(ds)));
    }
    else {

      this.outer.add(point_b.add(normal_b.multiply(d1)));
      this.inner.add(point_b.add(normal_b.multiply(d2)));

      for (let i = step; i < len; i += step) {
        point_b = gen.getPointAt(i);
        normal_b = gen.getNormalAt(i);
        this.outer.add(point_b.add(normal_b.normalize(d1)));
        this.inner.add(point_b.add(normal_b.normalize(d2)));
      }

      normal_e = gen.getNormalAt(len);
      this.outer.add(point_e.add(normal_e.multiply(d1)));
      this.inner.add(point_e.add(normal_e.multiply(d2)));

      tangent_e = gen.getTangentAt(len);
      this.outer.add(point_e.add(normal_e.multiply(d1)).add(tangent_e.multiply(ds)));
      this.inner.add(point_e.add(normal_e.multiply(d2)).add(tangent_e.multiply(ds)));

    }

    this.inner.reverse();
  }

}


/**
 * @summary Абстрактный элемент профиля
 * @desc Виртуальный класс описывает общие свойства профиля и раскладки
 *
 * @abstract
 * @extends GeneratrixElement
 * @tutorial 02_geometry
 */
class ProfileItem extends GeneratrixElement {

  /**
   * @summary Расстояние от узла до опорной линии
   * @desc Для сегментов створок и вложенных элементов зависит от ширины элементов и свойств примыкающих соединений,
   * для соединителей и раскладок = 0
   * @type Number
   * @final
   */
  get d0() {
    return 0;
  }

  /**
   * @summary Расстояние от узла до внешнего ребра элемента
   * @desc для рамы, обычно = 0, для импоста 1/2 ширины, зависит от `d0` и `sizeb`
   * @type Number
   * @final
   */
  get d1() {
    return -(this.d0 - this.sizeb);
  }

  /**
   * @summary Расстояние от узла до внутреннего ребра элемента
   * @desc зависит от ширины элементов и свойств примыкающих соединений
   * @type Number
   * @final
   */
  get d2() {
    return this.d1 - this.width;
  }

  /**
   * @summary Задаваемое пользователем смещение от образующей
   * @desc Особенно актуально для наклонных элементов а так же, в случае,
   * когда чертёж должен опираться на размеры проёма и отступы, вместо габаритов по профилю
   * @type Number
   */
  get offset() {
    const {_row} = this;
    return (_row && _row.offset) || 0;
  }
  set offset(v) {
    const {_row, _attr, selected} = this;
    v = parseFloat(v) || 0;
    if(_row && _row.offset !== v) {
      _row.offset = v;
      if(selected) {
        this.selected = false;
      }
      const nearests = this.joined_nearests ? this.joined_nearests() : [];
      if(this.joined_imposts) {
        const imposts = this.joined_imposts();
        nearests.push.apply(nearests, imposts.inner.map((v) => v.profile).concat(imposts.outer.map((v) => v.profile)));
      }
      for(const profile of nearests) {
        profile._attr._rays && profile._attr._rays.clear();
      }
      _attr._rays && _attr._rays.clear();
      this.project.register_change(true);
      if(selected) {
        this.selected = true;
      }
    }
  }

  /**
   * @summary Дополнительный отступ на раме для углубления створки
   * @desc Экзотика. Используется, например, в системах Термогласс
   * @return {Number}
   */
  get frame_indent() {
    return this.nom._extra('frame_indent') || 0;
  }

  /**
   * Точка проекции высоты ручки на ребро профиля
   *
   * @param {InnerOuter} side
   * @return {paper.Point|void}
   */
  hhpoint(side) {
    const {layer, rays} = this;
    if(layer instanceof ConnectiveLayer) {
      return ;
    }
    const {h_ruch, furn} = layer;
    const {handle_side} = furn;
    if(!h_ruch || !handle_side) {
      return;
    }
    // получаем элемент, на котором ручка и длину элемента
    if(layer.profile_by_furn_side(handle_side) == this) {
      return rays[side].intersect_point(layer.handle_line(this));
    }
  }

  /**
   * Точка проекции высоты ручки на внутреннее ребро профиля
   * @type {paper.Point|void}
   */
  get hhi() {
    return this.hhpoint('inner');
  }

  /**
   * Точка проекции высоты ручки на внешнее ребро профиля
   * @type {paper.Point|void}
   */
  get hho() {
    return this.hhpoint('outer');
  }

  /**
   * Соединение в точке 'b' для диалога свойств
   * @type CatCnns
   * @private
   */
  get cnn1() {
    return this.getcnnn('b');
  }

  set cnn1(v) {
    this.setcnnn(v, 'b');
  }

  /**
   * Соединение в точке 'b' c обратной стороны
   * @type CatCnns
   * @private
   */
  get cnn1o() {
    return this.rays.b.cnno();
  }

  set cnn1o(v) {
    this.rays.b.set_cnno(v);
  }

  /**
   * Соединение в точке 'e' для диалога свойств
   * @type CatCnns
   * @private
   */
  get cnn2() {
    return this.getcnnn('e');
  }

  set cnn2(v) {
    this.setcnnn(v, 'e');
  }

  /**
   * Соединение в точке 'e' c обратной стороны
   * @type CatCnns
   * @private
   */
  get cnn2o() {
    return this.rays.e.cnno();
  }

  set cnn2o(v) {
    this.rays.e.set_cnno(v);
  }

  getcnnn(n) {
    return this.cnn_point(n).cnn || $p.cat.cnns.get();
  }

  setcnnn(v, n) {
    const {rays} = this;
    const cnn = $p.cat.cnns.get(v);
    if(rays[n].cnn != cnn) {
      rays[n].cnn = cnn;
      this.project.register_change();
    }
  }

  /**
   * С этой функции начинается пересчет и перерисовка сегмента раскладки
   * Возвращает объект соединения конца профиля
   * - Попутно проверяет корректность соединения. Если соединение не корректно, сбрасывает его в пустое значение и обновляет ограничитель типов доступных для узла соединений
   * - Не делает подмену соединения, хотя могла бы
   * - Не делает подмену вставки, хотя могла бы
   *
   * @abstract
   * @param {NodeBE} node - имя узла профиля
   * @param {paper.Point} [point] - координаты точки, в окрестности которой искать
   * @return {CnnPoint}
   */
  cnn_point(node, point) {

  }

  /**
   * Положение элемента в контуре
   * @type {EnmElm_positions}
   */
  get pos() {
    const {top, bottom, left, right} = this.layer.profiles_by_side();
    const {Верх, Низ, Лев, Прав, Центр} = $p.enm.positions;
    if(top === this) {
      return Верх;
    }
    if(bottom === this) {
      return Низ;
    }
    if(left === this) {
      return Лев;
    }
    if(right === this) {
      return Прав;
    }
    const {x1, x2, y1, y2} = this;
    const delta = 60;
    if(Math.abs(top.y1 + top.y2 - y1 - y2) < delta) {
      return Верх;
    }
    if(Math.abs(bottom.y1 + bottom.y2 - y1 - y2) < delta) {
      return Низ;
    }
    if(Math.abs(left.x1 + left.x2 - x1 - x2) < delta) {
      return Лев;
    }
    if(Math.abs(right.x1 + right.x2 - x1 - x2) < delta) {
      return Прав;
    }
    // TODO: рассмотреть случай с выносом стоек и разрывами
    return Центр;
  }

  /**
   * Проекция точки b на образующую родительского элемента
   * Для рам и створок, совпадает с 'b', для импостов - отличается
   * @type {paper.Point}
   * @final
   */
  get gb() {
    return this.gn('b');
  }

  /**
   * Проекция точки e на образующую родительского элемента
   * Для рам и створок, совпадает с 'e', для импостов - отличается
   * @type {paper.Point}
   * @final
   */
  get ge() {
    return this.gn('e');
  }

  /**
   * Вспомогательная для {@link ProfileItem#gb} {@link ProfileItem#ge}
   * @private
   * @param {String} n
   * @return {paper.Point}
   */
  gn(n) {
    const {profile, is_t} = this.cnn_point(n);
    if(is_t && profile) {
      return profile.generatrix.getNearestPoint(this[n]);
    }
    return this[n];
  }

  /**
   * Точка для размерных линий
   * @return {paper.Point}
   */
  get c1() {
    const pt = this.corns(1);
    if(pt) {
      pt._name = 'c1';
    }
    return pt;
  }

  /**
   * Точка для размерных линий
   * @return {paper.Point}
   */
  get c2() {
    const pt = this.corns(2);
    if(pt) {
      pt._name = 'c2';
    }
    return pt;
  }

  /**
   * Отрывает точку от соседнего профиля
   */
  unlink() {
    const {generatrix, b, e, rays} = this;
    const tg = b.selected ? generatrix.getTangentAt(0).multiply(consts.sticking_l + 1) : (
      e.selected ? generatrix.getTangentAt(generatrix.length).multiply(consts.sticking_l + 1).negate() : null
    );
    if(tg) {
      if(b.selected) {
        rays.b.clear(true);
      }
      else {
        rays.e.clear(true);
      }
      this.move_points(tg);
    }
  }

  /**
   * Привязывает точку к соседнему профилю
   */
  link() {
    const {generatrix, b, e, rays, parent} = this;
    const tg = b.selected ? generatrix.getTangentAt(0).multiply(consts.sticking).negate() : (
      e.selected ? generatrix.getTangentAt(generatrix.length).multiply(consts.sticking) : null
    );
    if(tg && parent instanceof Filling) {
      const node = rays[b.selected ? 'b' : 'e'];
      const point = this[node.node];
      const path = new paper.Path({insert: false, segments: [point.subtract(tg), point.add(tg)]});
      const crossings = path.getCrossings(parent.path);
      if(crossings.length === 1) {
        const delta = crossings[0].point.subtract(point);
        this.move_points(delta);
        node.profile = parent;
        node.distance = 0;
        node.cnn_types = $p.enm.cnn_types.acn.t;
        node.point = crossings[0].point;
        this.postcalc_cnn(node.node);
      }
      else {
        throw new Error('Нет подходящего ребра в окрестности точки привязки');
      }
    }
  }

  /**
   * Угол к соседнему элементу
   * @param node {NodeBE}
   * @return {number}
   */
  angle_at(node) {
    const {profile, point} = this.rays[node] || this.cnn_point(node);
    if(!profile || !point) {
      return 90;
    }
    const g1 = this.generatrix;
    const g2 = profile.generatrix;
    let offset1 = g1.getOffsetOf(g1.getNearestPoint(point)),
      offset2 = g2.getOffsetOf(g2.getNearestPoint(point));
    if(offset1 < 10){
      offset1 = 10;
    }
    else if(Math.abs(offset1 - g1.length) < 10){
      offset1 = g1.length - 10;
    }
    if(offset2 < 10){
      offset2 = 10;
    }
    else if(Math.abs(offset2 - g2.length) < 10){
      offset2 = g2.length - 10;
    }
    const t1 = g1.getTangentAt(offset1) || new paper.Point();
    const t2 = g2.getTangentAt(offset2) || new paper.Point();
    const a = t2.negate().getDirectedAngle(t1).round(1);
    return a > 180 ? a - 180 : (a < 0 ? -a : a);
  }

  /**
   * Угол к соседнему элементу в точке 'b'
   * @type Number
   * @final
   */
  get a1() {
    return this.angle_at('b');
  }

  /**
   * Угол к соседнему элементу в точке 'e'
   * @type Number
   * @final
   */
  get a2() {
    return this.angle_at('e');
  }

  /**
   * Информация для диалога свойств
   * @type String
   * @final
   */
  get info() {
    const {elm, angle_hor, length, layer} = this;
    return `№${layer instanceof ContourNestedContent ? `${layer.layer.cnstr}-${elm}` : elm}  α:${angle_hor.toFixed(0)}° l: ${length.toFixed(0)}`;
  }

  /**
   * Радиус сегмента профиля
   * @type Number
   */
  get r() {
    return this._row.r;
  }

  set r(v) {
    const {_row, _attr} = this;
    if(typeof v !== 'number') {
      v = parseFloat(v);
    }
    if(!v) {
      v = 0;
    }
    if(!v || Math.abs(_row.r - v) > 0.2) {
      _attr._rays.clear();
      _row.r = v.round(2);
      this.set_generatrix_radius();
      this.project.notify(this, 'update', {r: true, arc_h: true, arc_ccw: true});
    }
  }

  /**
   * Минимальный радиус, высисляемый по кривизне элемента
   * для прямых = 0
   */
  get rmin() {
    return this.generatrix.rmin();
  }

  /**
   * Максимальный радиус, высисляемый по кривизне элемента
   * для прямых = 0
   */
  get rmax() {
    return this.generatrix.rmax();
  }

  /**
   * Средний радиус, высисляемый по трём точкам
   * для прямых = 0
   */
  get ravg() {
    return this.generatrix.ravg();
  }

  /**
   * Направление дуги сегмента профиля против часовой стрелки
   * @type Boolean
   */
  get arc_ccw() {
    return this._row.arc_ccw;
  }

  set arc_ccw(v) {
    const {_row, _attr} = this;
    if(_row.arc_ccw != v) {
      _attr._rays.clear();
      _row.arc_ccw = v;
      this.set_generatrix_radius();
      this.project.notify(this, 'update', {r: true, arc_h: true, arc_ccw: true});
    }
  }

  /**
   * Высота дуги сегмента профиля
   * @type Number
   */
  get arc_h() {
    const {_row, b, e, generatrix} = this;
    if(_row.r) {
      const p = generatrix.getPointAt(generatrix.length / 2);
      return paper.Line.getSignedDistance(b.x, b.y, e.x, e.y, p.x, p.y).round(1);
    }
    return 0;
  }

  set arc_h(v) {
    const {_row, _attr, b, e, arc_h} = this;
    v = parseFloat(v);
    if(!v) {
      v = 0;
    }
    if(!v || Math.abs(arc_h - v) > 0.2) {
      _attr._rays.clear();
      if(v < 0) {
        v = -v;
        _row.arc_ccw = true;
      }
      else {
        _row.arc_ccw = false;
      }
      _row.r = b.arc_r(b.x, b.y, e.x, e.y, v);
      this.set_generatrix_radius(v);
      this.project.notify(this, 'update', {r: true, arc_h: true, arc_ccw: true});
    }
  }

  /**
   * @summary Угол к горизонту
   * @desc Рассчитывается для прямой, проходящей через узлы
   *
   * @type Number
   * @final
   */
  get angle_hor() {
    const {b, e} = this;
    const res = (new paper.Point(e.x - b.x, b.y - e.y)).angle.round(2);
    return res < 0 ? (res < -.5 ? res + 360 : 0) : res;
  }

  /**
   * Длина профиля с учетом соединений
   * @type Number
   * @final
   */
  get length() {
    const {b, e, outer} = this.rays;
    const ppoints = {};

    // находим проекции четырёх (шести) вершин на образующую
    for (const i of [1, 2, 3, 4, 7, 8]) {
      const pt = this.corns(i);
      if(pt) {
        ppoints[i] = outer.getNearestPoint(pt);
      }
    }

    // находим точки, расположенные ближе к концам
    let distanse = Infinity;
    for(const i of [7, 1, 4]) {
      const pt = ppoints[i];
      if(pt) {
        const curr = outer.getOffsetOf(pt);
        if(curr < distanse) {
          distanse = curr;
          ppoints.b = pt;
        }
        if(i === 7) {
          break;
        }
      }
    }
    distanse = 0;
    for(const i of [8, 2, 3]) {
      const pt = ppoints[i];
      if(pt) {
        const curr = outer.getOffsetOf(pt);
        if(curr > distanse) {
          distanse = curr;
          ppoints.e = pt;
        }
        if(i === 8) {
          break;
        }
      }
    }

    // получаем фрагмент образующей
    const sub_gen = outer.get_subpath(ppoints.b, ppoints.e);
    const res = sub_gen.length;
    sub_gen.remove();

    return (res * 2).round() / 2;
  }

  /**
   * @summary Ориентация профиля
   * @desc Вычисляется по гулу к горизонту.
   * Если угол в пределах `orientation_delta`, элемент признаётся горизонтальным или вертикальным. Иначе - наклонным
   *
   * @type EnmOrientations
   * @final
   */
  get orientation() {
    let {angle_hor} = this;
    if(angle_hor > 180) {
      angle_hor -= 180;
    }
    const {orientations} = $p.enm;
    if((angle_hor > -consts.orientation_delta && angle_hor < consts.orientation_delta) ||
      (angle_hor > 180 - consts.orientation_delta && angle_hor < 180 + consts.orientation_delta)) {
      return orientations.hor;
    }
    if((angle_hor > 90 - consts.orientation_delta && angle_hor < 90 + consts.orientation_delta) ||
      (angle_hor > 270 - consts.orientation_delta && angle_hor < 270 + consts.orientation_delta)) {
      return orientations.vert;
    }
    return orientations.incline;
  }

  /**
   * @summary Опорные точки и лучи
   * @type ProfileRays
   * @final
   */
  get rays() {
    const {_rays} = this._attr;
    if(!_rays.inner.segments.length || !_rays.outer.segments.length) {
      _rays.recalc();
    }
    return _rays;
  }

  /**
   * @summary Доборы текущего профиля
   * @type Array.<ProfileAddl>
   * @final
   */
  get addls() {
    return this.children.filter((elm) => elm instanceof ProfileAddl);
  }

  /**
   * @summary Штапики текущего профиля
   * @type Array.<ProfileGlBead>
   * @final
   */
  get glbeads() {
    return this.layer.getItems({class: ProfileGlBead, profile: this});
  }

  /**
   * @summary Сегменты текущей связки
   * @type Array.<ProfileSegment>
   * @final
   */
  get segms() {
    return this.children.filter((elm) => elm instanceof ProfileSegment);
  }

  /**
   * @summary Примыкания текущего профиля
   * @type Array.<ProfileAddl>
   * @final
   */
  get adjoinings() {
    return this.children.filter((elm) => elm instanceof ProfileAdjoining);
  }

  /**
   * Строка цвета по умолчанию для эскиза
   * @type {String}
   */
  get default_clr_str() {
    return 'FEFEFE';
  }

  /**
   * Непрозрачность профиля
   *
   * В отличии от прототипа `opacity`, не изменяет прозрачость образующей
   * @type {Number}
   */
  get opacity() {
    return this.path ? this.path.opacity : 1;
  }
  set opacity(v) {
    this.path && (this.path.opacity = v);
  }

  /**
   * Припуск для соединения "сварной шов"
   * @type {Number}
   */
  get dx0() {
    const {cnn} = this.rays.b;
    const main_row = cnn && cnn.main_row(this);
    return main_row && main_row.angle_calc_method == $p.enm.angle_calculating_ways.СварнойШов ? -main_row.sz : 0;
  }

  /**
   * Структура примыкающих заполнений
   * @type {Object}
   */
  get nearest_glasses() {
    const res = {
      all: [],    // все
      inner: [],  // изнутри по отношению к образующей
      outer: [],  // снаружи по отношению к образующей
      left: [],   // слева от элемента
      right: [],  // справа от элемента
      top: [],    // сверху
      bottom: [], // снизу
    };
    const {layer, generatrix, orientation} = this;
    for(const glass of layer.glasses(false, true)) {
      for(const curr of glass.profiles) {
        if(curr.profile === this) {
          res.all.push(glass);
          if(curr.outer) {
            res.outer.push(glass);
          }
          else {
            res.inner.push(glass);
          }
          const glpoint = glass.interiorPoint();
          const vector = generatrix.getNearestPoint(glpoint).subtract(glpoint);
          if(orientation.is('hor')) {
            if(vector.y > 0) {
              res.top.push(glass);
            }
            else {
              res.bottom.push(glass);
            }
          }
          else if (orientation.is('vert')) {
            if(vector.x < 0) {
              res.right.push(glass);
            }
            else {
              res.left.push(glass);
            }
          }
          break;
        }
      }
    }
    return res;
  }

  setSelection(selection) {
    const {_attr: {generatrix, path}, project} = this;
    if(!generatrix || !path) {
      return;
    }
    super.setSelection(selection);
    
    generatrix.setSelection(selection);
    this.ruler_line_select(false);

    if(selection) {

      const {inner, outer} = this.rays;

      if(this._hatching) {
        this._hatching.removeChildren();
      }
      else {
        this._hatching = new paper.CompoundPath({
          parent: this,
          guide: true,
          strokeColor: 'grey',
          strokeScaling: false
        });
      }

      path.setSelection(0);
      for(const item of this.segms.concat(this.addls)) {
        item.setSelection(0);
      }

      if([0, 1].includes(project.builder_props.mode) && path.length) {
        for (let t = 0; t < inner.length; t += 50) {
          const ip = inner.getPointAt(t);
          const np = inner.getNormalAt(t).multiply(400).rotate(-35).negate();
          const fp = new paper.Path({
            insert: false,
            segments: [ip, ip.add(np)]
          });
          const op = fp.intersect_point(outer, ip);

          if(ip && op) {
            const cip = path.getNearestPoint(ip);
            const cop = path.getNearestPoint(op);
            const nip = cip.is_nearest(ip);
            const nop = cop.is_nearest(op);
            if(nip && nop) {
              this._hatching.moveTo(cip);
              this._hatching.lineTo(cop);
            }
            else if(nip && !nop) {
              const pp = fp.intersect_point(path, op);
              if(pp) {
                this._hatching.moveTo(cip);
                this._hatching.lineTo(pp);
              }
            }
            else if(!nip && nop) {
              const pp = fp.intersect_point(path, ip);
              if(pp) {
                this._hatching.moveTo(pp);
                this._hatching.lineTo(cop);
              }
            }
          }
        }
      }

    }
    else {
      if(this._hatching) {
        this._hatching.remove();
        this._hatching = null;
      }
    }
  }

  // выделяет внутреннее или внешнее ребро профиля
  ruler_line_select(mode) {

    const {_attr} = this;

    if(_attr.ruler_line_path) {
      _attr.ruler_line_path.remove();
      delete _attr.ruler_line_path;
    }

    if(mode) {
      switch (_attr.ruler_line = mode) {

      case 'inner':
        _attr.ruler_line_path = this.path.get_subpath(this.corns(3), this.corns(4));
        _attr.ruler_line_path.parent = this;
        _attr.ruler_line_path.selected = true;
        break;

      case 'outer':
        _attr.ruler_line_path = this.path.get_subpath(this.corns(1), this.corns(2));
        _attr.ruler_line_path.parent = this;
        _attr.ruler_line_path.selected = true;
        break;

      default:
        this.generatrix.selected = true;
        break;
      }
    }
    else if(_attr.ruler_line) {
      delete _attr.ruler_line;
    }
  }

  // координата стороны или образующей профиля
  ruler_line_coordin(xy) {
    switch (this._attr.ruler_line) {
    case 'inner':
      return (this.corns(3)[xy] + this.corns(4)[xy]) / 2;
    case 'outer':
      return (this.corns(1)[xy] + this.corns(2)[xy]) / 2;
    default:
      return (this.b[xy] + this.e[xy]) / 2;
    }
  }

  // если профиль примыкает к соседнему слою и нет соединителя
  check_err(style) {
    const {layer, parent, project, generatrix} = this;
    if(layer !== parent || layer.level || !layer.sys.show_ii || this.nearest(true)) {
      return;
    }
    const {contours} = project;
    if(contours.length > 1) {
      let i = 0;
      for(const contour of contours) {
        if(contour === layer) {
          continue;
        }
        for(const profile of contour.profiles) {
          i = 0;
          if(generatrix.is_nearest(profile.b, 1)) {
            i++;
          }
          if(generatrix.is_nearest(profile.e, 1)) {
            i++;
          }
          if(!this.b.is_nearest(profile.b, 1) && !this.b.is_nearest(profile.e, 1) && profile.generatrix.is_nearest(this.b, 1)) {
            i++;
          }
          if(!this.e.is_nearest(profile.b, 1) && !this.e.is_nearest(profile.e, 1) && profile.generatrix.is_nearest(this.e, 1)) {
            i++;
          }
          if(i > 1) {
            break;
          }
        }
        if(i > 1) {
          break;
        }
      }
      if(i > 1) {
        if(style) {
          const {_corns} = this._attr;
          const subpath = this.path.get_subpath(_corns[1], _corns[2]).equidistant(-6);
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
   * @summary Проверяет, не изменилась ли номенклатура элемента после изменения геометрии
   * @desc складывает изменённые элементы в параметр arr
   * @param {Array} arr
   */
  check_nom(arr) {
    const {_row, _attr, length, glbeads, angle_hor} = this;
    // сохраняем угол к горизонту и длину профиля в _row
    if(_row.len !== length || _row.angle_hor !== angle_hor) {
      if(!this.project._attr._loading) {
        _row.len = length;
        _row.angle_hor = angle_hor;
      }
      if(_attr && _attr._rays) {
        const {nom: old} = _attr;
        delete _attr.nom;
        const {nom} = this;
        if(old !== nom) {
          arr.push(this);
        }
      }      
    }
    for(const chld of this.getItems({class: ProfileItem}).concat(glbeads)) {
      chld.check_nom(arr);
    }
  }

  /**
   * Вычисляемые поля в таблице координат
   * @return {void}
   */
  save_coordinates() {

    const {_attr, _row, ox: {cnn_elmnts}, rays: {b, e, inner, outer}, generatrix} = this;

    if(!generatrix) {
      return;
    }
    else if(!_attr._corns.length) {
      this.redraw();
    }

    _row.x1 = this.x1;
    _row.y1 = this.y1;
    _row.x2 = this.x2;
    _row.y2 = this.y2;
    _row.path_data = generatrix.pathData;
    _row.nom = this.nom;

    // радиус, как дань традиции - вычисляем для внешнего ребра профиля??
    if(generatrix.is_linear()) {
      _row.r = 0;
    }
    else {
      // const r1 = inner.get_subpath(_attr._corns[3], _attr._corns[4]).ravg();
      // const r2 = outer.get_subpath(_attr._corns[1], _attr._corns[2]).ravg();
      // _row.r = Math.max(r1, r2);
      _row.r = generatrix.ravg().round(2);
    }

    if(this instanceof ProfileNested || this instanceof ProfileParent) {
      _row.alp1 = _row.alp2 = 0;
      _row.inset = this.inset;
      _row.clr = this.clr;
    }
    else {

      const row_b = cnn_elmnts.add({
        elm1: _row.elm,
        node1: 'b',
        cnn: b.cnn,
        aperture_len: this.corns(1).getDistance(this.corns(4)).round(1)
      });
      const row_e = cnn_elmnts.add({
        elm1: _row.elm,
        node1: 'e',
        cnn: e.cnn,
        aperture_len: this.corns(2).getDistance(this.corns(3)).round(1)
      });

      // сохраняем информацию о соединениях
      if(b.profile) {
        row_b.elm2 = b.profile.elm;
        if(b.profile.e.is_nearest(b.point)) {
          row_b.node2 = 'e';
        }
        else if(b.profile.b.is_nearest(b.point)) {
          row_b.node2 = 'b';
        }
        else {
          row_b.node2 = 't';
        }
      }
      if(e.profile) {
        row_e.elm2 = e.profile.elm;
        if(e.profile.b.is_nearest(e.point)) {
          row_e.node2 = 'b';
        }
        else if(e.profile.e.is_nearest(e.point)) {
          row_e.node2 = 'e';
        }
        else {
          row_e.node2 = 't';
        }
      }


      if(!(this instanceof ProfileSegment)) {

        // в том числе - о соединениях с другой стороны
        if(b._cnno && row_b.elm2 !== b._cnno.elm2) {
          cnn_elmnts.add({
            elm1: _row.elm,
            node1: 'b',
            elm2: b._cnno.elm2,
            node2: b._cnno.node2,
            cnn: b._cnno.cnn,
            aperture_len: row_b.aperture_len,
          });
        }
        if(e._cnno && row_e.elm2 !== e._cnno.elm2) {
          cnn_elmnts.add({
            elm1: _row.elm,
            node1: 'e',
            elm2: e._cnno.elm2,
            node2: e._cnno.node2,
            cnn: e._cnno.cnn,
            aperture_len: row_e.aperture_len,
          });
        }

        // для створочных и доборных профилей добавляем соединения с внешними элементами
        const nrst = this.nearest();
        if(nrst) {
          cnn_elmnts.add({
            elm1: _row.elm,
            elm2: nrst.elm,
            cnn: _attr._nearest_cnn,
            aperture_len: _row.len
          });
        }
      }

      _row.alp1 = Math.round(((this.corns(5) || this.corns(4)).subtract(this.corns(1)).angle - 
        generatrix.getTangentAt(0).angle) * 10) / 10;
      if(_row.alp1 < 0) {
        _row.alp1 = _row.alp1 + 360;
      }

      _row.alp2 = Math.round((generatrix.getTangentAt(generatrix.length).angle - 
        this.corns(2).subtract(this.corns(6) || this.corns(3)).angle) * 10) / 10;
      if(_row.alp2 < 0) {
        _row.alp2 = _row.alp2 + 360;
      }
    }

    // устанавливаем тип элемента
    _row.elm_type = this.elm_type;

    // TODO: Рассчитать положение и ориентацию
    _row.orientation = this.orientation;
    _row.pos = this.pos;

    // координаты доборов и прочих детей
    this.children.forEach((addl) => addl.save_coordinates?.());
  }

  /**
   * Вызывается из конструктора - создаёт пути и лучи
   * @private
   */
  initialize(attr) {

    const {project, _attr, _row} = this;
    const h = project.bounds.height + project.bounds.y;
    const {job_prm, utils} = $p;

    if(attr.r) {
      _row.r = attr.r;
    }

    if(attr.generatrix) {
      _attr.generatrix = attr.generatrix;
      if(_attr.generatrix._reversed) {
        delete _attr.generatrix._reversed;
      }
    }
    else {
      if(_row.path_data) {
        _attr.generatrix = new paper.Path(_row.path_data);
      }
      else {
        const first_point = new paper.Point([_row.x1, h - _row.y1]);
        _attr.generatrix = new paper.Path(first_point);
        if(_row.r) {
          _attr.generatrix.arcTo(
            first_point.arc_point(_row.x1, h - _row.y1, _row.x2, h - _row.y2, _row.r + 0.001, _row.arc_ccw, false), [_row.x2, h - _row.y2]);
        }
        else {
          _attr.generatrix.lineTo([_row.x2, h - _row.y2]);
        }
      }
    }

    // точки пересечения профиля с соседями с внутренней стороны
    _attr._corns = [];

    // кеш лучей в узлах профиля
    _attr._rays = new ProfileRays(this);

    _attr.generatrix.strokeColor = 'gray';

    _attr.path = new paper.Path();
    Object.assign(_attr.path, ProfileItem.path_attr);
    this.clr = _row.clr.empty() ? job_prm.builder.base_clr : _row.clr;

    this.addChild(_attr.path);
    this.addChild(_attr.generatrix);

  }

  /**
   * Возвращает скелетон родителя
   * @return {Skeleton}
   */
  get skeleton() {
    return this.parent.skeleton;
  }

  /**
   * Обсервер  
   * Наблюдает за изменениями контура и пересчитывает путь элемента при изменении соседних элементов
   *
   * @private
   */
  observer(an) {
    const {profiles} = an;
    if(profiles) {
      let binded;
      if(!profiles.includes(this)) {
        // если среди профилей есть такой, к которму примыкает текущий, пробуем привязку
        for(const profile of profiles) {
          if(profile instanceof Onlay && !(this instanceof Onlay)) {
            continue;
          }
          binded = true;
          this.do_bind(profile, this.cnn_point('b'), this.cnn_point('e'), an);
        }
        binded && profiles.push(this);
      }
    }
    else if(an instanceof Profile || an instanceof ProfileConnective) {
      this.do_bind(an, this.cnn_point('b'), this.cnn_point('e'));
    }
  }

  /**
   * Вспомогательная функция обсервера, выполняет привязку узлов
   */
  do_bind(profile, bcnn, ecnn, moved) {

    const {acn, ad} = $p.enm.cnn_types;
    let moved_fact;

    if(profile instanceof ProfileConnective) {
      const gen = profile.generatrix.clone({insert: false}).elongation(3000);
      this._attr._rays.clear();
      const b = gen.getNearestPoint(this.b);
      const e = gen.getNearestPoint(this.e);
      const db = b.subtract(this.b);
      const de = e.subtract(this.e);
      if(db.length || de.length) {
        const selected = this.project.deselect_all_points(true);
        if(db.subtract(de).length < consts.epsilon) {
          this.move_points(de, true);
        }
        else {
          this.select_node('b');
          this.move_points(db);
          this.project.deselectAll();
          this.select_node('e');
          this.move_points(de);
        }
        this.project.deselectAll();
        for(const el of selected) {
          el.selected = true;
        }
      }
    }
    else {
      if(bcnn.cnn && bcnn.profile == profile) {
        // обрабатываем угол
        if(bcnn.profile_point && bcnn.profile_point !== 't' && !bcnn.is_x) {
          const pp = profile[bcnn.profile_point];
          if(!this.b.is_nearest(pp, 0)) {
            if(bcnn.is_t || bcnn.cnn.cnn_type == ad) {
              if(paper.Key.isDown('control')) {
                console.log('control');
              }
              else {
                if(this.b.getDistance(pp, true) < consts.sticking2) {
                  this.b = pp;
                }
                moved_fact = true;
              }
            }
            // отрываем привязанный ранее профиль
            else {
              bcnn.clear();
              this._attr._rays.clear();
            }
          }
        }
        // обрабатываем T
        else if(acn.t.indexOf(bcnn.cnn.cnn_type) != -1 && this.do_sub_bind(profile, 'b')) {
          moved_fact = true;
        }
      }

      if(ecnn.cnn && ecnn.profile == profile) {
        // обрабатываем угол
        if(ecnn.profile_point && ecnn.profile_point !== 't' && !ecnn.is_x) {
          const pp = profile[ecnn.profile_point];
          if(!this.e.is_nearest(pp, 0)) {
            if(ecnn.is_t || ecnn.cnn.cnn_type == ad) {
              if(paper.Key.isDown('control')) {
                console.log('control');
              }
              else {
                if(this.e.getDistance(pp, true) < consts.sticking2) {
                  this.e = pp;
                }
                moved_fact = true;
              }
            }
            else {
              // отрываем привязанный ранее профиль
              ecnn.clear();
              this._attr._rays.clear();
            }
          }
        }
        // обрабатываем T
        else if(acn.t.indexOf(ecnn.cnn.cnn_type) != -1 && this.do_sub_bind(profile, 'e')) {
          moved_fact = true;
        }
      }
    }

    // если мы в обсервере и есть T и в массиве обработанных есть примыкающий T - пересчитываем
    if(moved && moved_fact) {
      const imposts = this.joined_imposts();
      imposts.inner.concat(imposts.outer).forEach(({profile}) => {
        if(!moved.profiles.includes(profile)) {
          profile.observer(this);
        }
      });
    }
  }

  /**
   * Возвращает сторону соединения текущего профиля с указанным
   */
  cnn_side(profile, interior, rays) {
    if(!interior) {
      interior = profile.interiorPoint();
    }
    if(!rays) {
      rays = this.rays;
    }
    const {Изнутри, Снаружи} = $p.enm.cnn_sides;
    if(!rays || !interior || !rays.inner.length || ! rays.outer.length) {
      return Изнутри;
    }
    return rays.inner.getNearestPoint(interior).getDistance(interior, true) <
      rays.outer.getNearestPoint(interior).getDistance(interior, true) ? Изнутри : Снаружи;
  }

  /**
   * Искривляет образующую в соответствии с радиусом
   */
  set_generatrix_radius(height) {
    const {generatrix, _row, layer, selected} = this;
    const b = generatrix.firstSegment.point.clone();
    const e = generatrix.lastSegment.point.clone();
    const min_radius = b.getDistance(e) / 2;

    generatrix.removeSegments(1);
    generatrix.firstSegment.handleIn = null;
    generatrix.firstSegment.handleOut = null;

    let full;
    if(_row.r && _row.r <= min_radius) {
      _row.r = min_radius + 0.0001;
      full = true;
    }

    if(selected) {
      this.selected = false;
    }

    if(_row.r) {
      let p = new paper.Point(b.arc_point(b.x, b.y, e.x, e.y, _row.r, _row.arc_ccw, false));
      if(p.point_pos(b.x, b.y, e.x, e.y) > 0 && !_row.arc_ccw || p.point_pos(b.x, b.y, e.x, e.y) < 0 && _row.arc_ccw) {
        p = new paper.Point(b.arc_point(b.x, b.y, e.x, e.y, _row.r, !_row.arc_ccw, false));
      }
      if(full || height) {
        const start = b.add(e).divide(2);
        const vector = p.subtract(start);
        vector.length = (height || min_radius);
        p = start.add(vector);
      }
      generatrix.arcTo(p, e);
    }
    else {
      generatrix.lineTo(e);
    }

    this.rays.clear('with_neighbor');
    layer.notify({
      type: consts.move_points,
      profiles: [this],
      points: []
    });

    if(selected) {
      setTimeout(() => this.selected = selected, 100);
    }
  }

  /**
   * Сеттер вставки с учетом выделенных элементов
   * @param v {CatInserts}
   * @param ign_select {Boolean}
   * @param ign_rays {Boolean}
   */
  set_inset(v, ign_select, ign_rays) {

    const {_row, _attr, project} = this;
    const profiles = [];

    if(!ign_select && project.selectedItems.length > 1) {
      project.selected_profiles(true).forEach((elm) => {
        if(elm != this && elm.elm_type == this.elm_type) {
          profiles.push(elm);
          elm.set_inset(v, true, true);
        }
      });
    }

    if(_row.inset != v) {

      _row.inset = v;

      // для уже нарисованных элементов...
      if(_attr && _attr._rays) {
        delete _attr.nom;
        _attr._rays.clear(ign_rays ? undefined : 'with_neighbor');
        this.set_clr(_row.clr, true);
      }

      // если в новой вставке не разрешены текущие вставки в элемент - удаляем
      const rm = [];
      const {inset: {inserts}, _owner: {_owner}} = _row;
      _owner.inserts.find_rows({cnstr: -this.elm}, (row) => {
        if(!inserts.find({inset: row.inset})) {
          rm.push(row);
        }
      });
      for(const row of rm) {
        _owner.inserts.del(row);
      }

      project.register_change();
      project._scope.eve.emit('set_inset', this);
    }

    for(const {_attr} of profiles) {
      _attr && _attr._rays && _attr._rays.clear('with_neighbor');
    }
  }

  /**
   * Сеттер цвета элемента
   * @param v {CatClrs}
   * @param ignore_select {Boolean}
   */
  set_clr(v, ignore_select) {
    if(!ignore_select && this.project.selectedItems.length > 1) {
      this.project.selected_profiles(true).forEach((elm) => {
        if(elm != this) {
          elm.set_clr(v, true);
        }
      });
    }
    BuilderElement.prototype.set_clr.call(this, v);
  }

  /**
   * Дополняет cnn_point свойствами соединения
   *
   * @param node {String} b, e - начало или конец элемента
   * @return CnnPoint
   */
  postcalc_cnn(node) {
    const cnn_point = this.cnn_point(node);
    cnn_point.cnn = $p.cat.cnns.elm_cnn(this, cnn_point.profile, cnn_point.cnn_types, cnn_point.cnn, false, undefined, cnn_point);
    if(!cnn_point.point) {
      cnn_point.point = this[node];
    }
    return cnn_point;
  }

  /**
   * Пересчитывает вставку после пересчета соединений
   * Контроль пока только по типу элемента
   * @return {ProfileItem}
   */
  postcalc_inset() {
    // если слева и справа T - и тип не импост или есть не T и тпи импост
    this.set_inset(this.project.check_inset({elm: this}), true);
    return this;
  }

  /**
   * Пересчитывает вставку при смене системы или добавлении створки
   * Контроль пока только по типу элемента
   *
   * @param all {Boolean} - пересчитывать для любых (не только створочных) элементов
   * @param [refill] {Boolean} - принудительно устанавливать вставку из системы
   */
  default_inset(all, refill) {
    let {orientation, project, layer, _attr, elm_type, inset} = this;
    const {sys} = layer;
    const nearest = this.nearest(true);
    const {cat: {cnns}, enm: {positions, orientations, elm_types, cnn_types}} = $p;

    if(nearest || all) {
      // импост может оказаться штульпом
      if(elm_type === elm_types.impost){
        if (this.is_shtulp()) {
          if(sys.elmnts.find({nom: inset, elm_type: elm_types.impost})) {
            elm_type = [elm_types.impost, elm_types.shtulp];
          }
          else {
            elm_type = elm_types.shtulp;
          }
        }
      }
      let pos = nearest && sys.flap_pos_by_impost && elm_type == elm_types.flap ? nearest.pos : this.pos;
      if(pos == positions.Центр) {
        if(orientation == orientations.vert) {
          pos = [pos, positions.ЦентрВертикаль];
          if(layer.furn.shtulp_kind() === 2) {
            elm_type = [elm_type, elm_types.flap0];
          }
        }
        if(orientation == orientations.hor) {
          pos = [pos, positions.ЦентрГоризонталь];
        }
      }
      this.set_inset(project.default_inset({elm_type, pos, inset: refill ? null : inset, elm: this}), true);
    }
    if(nearest) {
      _attr._nearest_cnn = cnns.elm_cnn(this, _attr._nearest, cnn_types.acn.ii, _attr._nearest_cnn || project.elm_cnn(this, nearest));
    }
  }

  /**
   * @summary Рассчитывает точки пути
   * @desc на пересечении текущего и указанного профилей
   *
   * @param {CnnPoint} cnn_point 
   * @param {NodeBE} [profile_point]
   * @param {Array.<ProfileItem>} [profiles]
   */
  path_points(cnn_point, profile_point, profiles) {

    const {cnn_types, cnn_sides, angle_calculating_ways: {СоединениеПополам: a2}} = $p.enm;
    const {_attr, rays, generatrix} = this;
    if(!generatrix.curves.length) {
      return cnn_point;
    }
    const {_corns} = _attr;

    // ищет точку пересечения открытых путей
    // если указан индекс, заполняет точку в массиве _corns. иначе - возвращает расстояние от узла до пересечения
    function intersect_point(path1, path2, index, ipoint = cnn_point.point) {
      const intersections = path1.getIntersections(path2);
      let delta = Infinity, tdelta, point, tpoint;

      if(intersections.length == 1) {
        if(index) {
          _corns[index] = intersections[0].point;
        }
        else {
          return intersections[0].point.getDistance(ipoint, true);
        }
      }
      else if(intersections.length > 1) {
        intersections.forEach((o) => {
          tdelta = o.point.getDistance(ipoint, true);
          if(tdelta < delta) {
            delta = tdelta;
            point = o.point;
          }
        });
        if(index) {
          _corns[index] = point;
        }
        else {
          return delta;
        }
      }
      return delta;
    }
    
    // возвращает лучи второго профиля
    const inner2 = (profile2) => {
      const interior = generatrix.getPointAt(generatrix.length/2)
      const {rays: prays2} = profile2;
      const side2 = profile2.cnn_side(this, null, prays2) === cnn_sides.outer ? 'outer' : 'inner';
      let oinner2 = prays2[side2];
      if(delta) {
        const pt = oinner2.getNearestPoint(cnn_point.point);
        const normal = oinner2.getNormalAt(oinner2.getOffsetOf(pt))
          .normalize(profile2 instanceof ProfileItem ? -delta : delta);
        const tmp = oinner2.clone({insert: false});
        tmp.translate(normal);
        oinner2 = tmp;
      }
      return [interior, oinner2];
    };

    // если пересечение в узлах, используем лучи профиля
    const other = cnn_point.profile;
    const prays = other instanceof ProfileItem ? other.rays : (other instanceof Filling ? {inner: other.path, outer: other.path} : undefined);
    const is_b = profile_point === 'b';
    const is_e = profile_point === 'e';
    const {cnn_type} = cnn_point.cnn || {};
    const delta = cnn_point?.cnn?.size(this) || 0;
    
    if(prays) {
      const side = other.cnn_side(this, null, prays) === cnn_sides.outer ? 'outer' : 'inner';
      let oinner = prays[side];
      let oouter = prays[side === 'inner' ? 'outer' : 'inner'];

      // строим эквидистанту к внутренней стороне соседнего профиля
      if(delta || cnn_point?.cnn?.sd2) {
        let base = cnn_point.cnn.sd2 ? oouter : oinner;
        const pt = base.getNearestPoint(cnn_point.point);
        const normal = base.getNormalAt(base.getOffsetOf(pt))
          .normalize(other instanceof ProfileItem ? -delta : delta);
        const tmp = base.clone({insert: false});
        tmp.translate(normal);
        oinner = tmp;
      }

      // импосты рисуем с учетом стороны примыкания
      if(cnn_point.is_t || (cnn_type == cnn_types.xx && (!cnn_point.profile_point || cnn_point.profile_point === 't'))) {

        const {width} = this;
        const w2 = width * width;
        const nodes = new Set();
        let profile2;
        cnn_point.point && !(this instanceof Onlay) && (profiles || this.layer.profiles).forEach((profile) => {
          if(profile !== this){
            if(cnn_point.point.is_nearest(profile.b, w2)) {
              const cp = profile.rays.b.profile;
              if(cp !== this) {
                if(cp !== other || other.cnn_side(this) === other.cnn_side(profile)) {
                  nodes.add(profile);
                }
              }
            }
            else if(cnn_point.point.is_nearest(profile.e, w2)) {
              const cp = profile.rays.e.profile;
              if(cp !== this) {
                if(cp !== other || other.cnn_side(this) === other.cnn_side(profile)) {
                  nodes.add(profile);
                }
              }
            }
            else if(profile.generatrix.is_nearest(cnn_point.point, true)) {
              nodes.add(profile);
            }
          }
        });
        // убираем из nodes тех, кто соединяется с нами в окрестности cnn_point.point
        nodes.forEach((p2) => {
          if(p2 !== other) {
            profile2 = p2;
          }
        });

        if(profile2) {
          const [interior, oinner2] = inner2(profile2);
          
          const pt1 = intersect_point(oinner, rays.outer, 0, interior);
          const pt2 = intersect_point(oinner, rays.inner, 0, interior);
          const pt3 = intersect_point(oinner2, rays.outer, 0, interior);
          const pt4 = intersect_point(oinner2, rays.inner, 0, interior);

          if(is_b) {
            pt1 < pt3 ? intersect_point(oinner, rays.outer, 1) : intersect_point(oinner2, rays.outer, 1);
            pt2 < pt4 ? intersect_point(oinner, rays.inner, 4) : intersect_point(oinner2, rays.inner, 4);
            intersect_point(oinner2, oinner, 5);
            if(rays.inner.point_pos(_corns[5]) >= 0 || rays.outer.point_pos(_corns[5]) >= 0) {
              delete _corns[5];
              delete _corns[7];
            }
            else {
              // ищем удлинение
              const l4 = new paper.Path({insert: false, segments: [_corns[4], _corns[5]]}).elongation(width * 6);
              const lx = new paper.Path({insert: false, segments: [_corns[5], _corns[1]]}).elongation(width * 6);
              if(generatrix.is_orthogonal(lx, _corns[1]) || generatrix.is_orthogonal(l4, _corns[4])) {
                delete _corns[7];
              }
              else {
                intersect_point(l4, rays.outer, 7, interior);
              }
            }
          }
          else if(is_e) {
            pt1 < pt3 ? intersect_point(oinner, rays.outer, 2) : intersect_point(oinner2, rays.outer, 2);
            pt2 < pt4 ? intersect_point(oinner, rays.inner, 3) : intersect_point(oinner2, rays.inner, 3);
            intersect_point(oinner2, oinner, 6);
            if(rays.inner.point_pos(_corns[6]) >= 0 || rays.outer.point_pos(_corns[6]) >= 0) {
              delete _corns[6];
              delete _corns[8];
            }
            else {
              // ищем удлинение
              const l2 = new paper.Path({insert: false, segments: [_corns[2], _corns[6]]}).elongation(width * 6);
              const lx = new paper.Path({insert: false, segments: [_corns[6], _corns[3]]}).elongation(width * 6);
              if(generatrix.is_orthogonal(lx, _corns[3]) || generatrix.is_orthogonal(l2, _corns[2])) {
                delete _corns[8];
              }
              else {
                intersect_point(l2, rays.inner, 8, interior); 
              }
            }
          }
        }
        else {
                    
          // для Т-соединений сначала определяем, изнутри или снаружи находится наш профиль
          if(is_b) {
            // в зависимости от стороны соединения
            intersect_point(oinner, rays.outer, 1);
            intersect_point(oinner, rays.inner, 4);
            delete _corns[5];
            delete _corns[7];
          }
          else if(is_e) {
            // в зависимости от стороны соединения
            intersect_point(oinner, rays.outer, 2);
            intersect_point(oinner, rays.inner, 3);
            delete _corns[6];
            delete _corns[8];
          }
        }
      }

      // крест в стык
      else if(cnn_type === cnn_types.xx) {
        let {width} = this;

        // для раскладок, отступаем ширину профиля
        if(other instanceof Onlay) {
          width *= 0.7;
          const l = is_b ? width : generatrix.length - width;
          const p = generatrix.getPointAt(l);
          const n = generatrix.getNormalAt(l).normalize(width);
          const np = new paper.Path({
            insert: false,
            segments: [p.subtract(n), p.add(n)],
          });
          if(is_b) {
            intersect_point(np, rays.outer, 1);
            intersect_point(np, rays.inner, 4);
          }
          else if(is_e) {
            intersect_point(np, rays.outer, 2);
            intersect_point(np, rays.inner, 3);
          }
        }
        else {
          // получаем второй примыкающий профиль
          const cnn_point2 = other.cnn_point(cnn_point.profile_point);
          const profile2 = cnn_point2 && cnn_point2.profile;
          if(profile2) {
            const [interior, oinner2] = inner2(profile2);
            const pt1 = intersect_point(oinner, rays.outer, 0, interior);
            const pt2 = intersect_point(oinner, rays.inner, 0, interior);
            const pt3 = intersect_point(oinner2, rays.outer, 0, interior);
            const pt4 = intersect_point(oinner2, rays.inner, 0, interior);
            const pti = intersect_point(oinner2, oinner, 0, interior);

            if(is_b) {
              if(pti < pt1 && pti < pt4) {
                pt1 < pt3 ? intersect_point(oinner, rays.outer, 1) : intersect_point(oinner2, rays.outer, 1);
                pt2 < pt4 ? intersect_point(oinner, rays.inner, 4) : intersect_point(oinner2, rays.inner, 4);
              }
              else {
                pt1 > pt3 ? intersect_point(oinner, rays.outer, 1) : intersect_point(oinner2, rays.outer, 1);
                pt2 > pt4 ? intersect_point(oinner, rays.inner, 4) : intersect_point(oinner2, rays.inner, 4);
              }

              intersect_point(oinner2, oinner, 5);
              if(rays.inner.point_pos(_corns[5]) >= 0 || rays.outer.point_pos(_corns[5]) >= 0) {
                delete _corns[5];
                delete _corns[7];
              }
              else {
                // ищем удлинение
                const l4 = new paper.Path({insert: false, segments: [_corns[4], _corns[5]]}).elongation(width * 6);
                const lx = new paper.Path({insert: false, segments: [_corns[5], _corns[1]]}).elongation(width * 6);
                if(generatrix.is_orthogonal(lx, _corns[1]) || generatrix.is_orthogonal(l4, _corns[4])) {
                  delete _corns[7];
                }
                else {
                  intersect_point(l4, rays.outer, 7, interior);
                }
              }
            }
            else if(is_e) {
              if(pti > pt1 && pti > pt4) {
                pt1 < pt3 ? intersect_point(oinner, rays.outer, 2) : intersect_point(oinner2, rays.outer, 2);
                pt2 < pt4 ? intersect_point(oinner, rays.inner, 3) : intersect_point(oinner2, rays.inner, 3);                
              }
              else {
                pt1 > pt3 ? intersect_point(oinner, rays.outer, 2) : intersect_point(oinner2, rays.outer, 2);
                pt2 > pt4 ? intersect_point(oinner, rays.inner, 3) : intersect_point(oinner2, rays.inner, 3);
              }
              
              intersect_point(oinner2, oinner, 6);
              if(rays.inner.point_pos(_corns[6]) >= 0 || rays.outer.point_pos(_corns[6]) >= 0) {
                delete _corns[6];
                delete _corns[8];
              }
              else {
                // ищем удлинение
                const l2 = new paper.Path({insert: false, segments: [_corns[2], _corns[6]]}).elongation(width * 6);
                const lx = new paper.Path({insert: false, segments: [_corns[6], _corns[3]]}).elongation(width * 6);
                if(generatrix.is_orthogonal(lx, _corns[3]) || generatrix.is_orthogonal(l2, _corns[2])) {
                  delete _corns[8];
                }
                else {
                  intersect_point(l2, rays.inner, 8, interior);
                }
              }
            }
          }
          else{
            if(is_b) {
              delete _corns[1];
              delete _corns[4];
            }
            else if(is_e) {
              delete _corns[2];
              delete _corns[3];
            }
          }
        }

      }
      
      // варианты угловых соединений
      else {
        // если есть соединение с обратной стороны, его надо учитывать при отрисовке узла
        const cnn_other = cnn_point.find_other();
        const cnno = cnn_other && cnn_point.cnno(cnn_other);
        const {orientation} = this;

        // угловое диагональное с переменными ширинами
        if(cnno && cnno.cnn_type === cnn_types.ad && (cnn_type != cnn_types.ad || other.width < cnn_other.profile.width)) {

          // если профили разной ширины и угол соединение/2, добавляем pt5, pt6
          const tw = this.width, ow = other.width;
          let check_a2 = tw !== ow && cnno.main_row(this);
          if(check_a2 && check_a2.angle_calc_method === a2) {
            const wprofile = tw > ow ? this : other;
            const winner = wprofile === this ? rays.outer : oinner;
            if(is_b) {
              intersect_point(oinner, rays.outer, 1);
              const pt = _corns[1];
              const tg = winner.getTangentAt(winner.getOffsetOf(pt)).rotate((this.a1 / 2) * (wprofile === this ? -1 : 1));
              const median = new paper.Path({insert: false, segments: [pt, pt.add(tg)]}).elongation(Math.max(tw, ow) * 3);

              if(wprofile === this) {
                intersect_point(oouter, median, 5);
                intersect_point(rays.inner, median, 7);
                intersect_point(oouter, rays.inner, 4);
              }
              else {
                intersect_point(rays.inner, median, 4);
                delete _corns[5];
                delete _corns[7];
              }
            }

            else if(is_e) {
              intersect_point(oinner, rays.outer, 2);

              const pt = _corns[2];
              const tg = winner.getTangentAt(winner.getOffsetOf(pt)).rotate((this.a2 / 2) * (wprofile === this ? 1 : -1));
              const median = new paper.Path({insert: false, segments: [pt, pt.add(tg)]}).elongation(Math.max(tw, ow) * 3);

              if(wprofile === this) {
                intersect_point(oouter, median, 6);
                intersect_point(rays.inner, median, 8);
                intersect_point(oouter, rays.inner, 3);
              }
              else {
                intersect_point(rays.inner, median, 3);
                delete _corns[6];
                delete _corns[8];
              }
            }
          }
          else {
            if(is_b) {
              if(this.is_collinear(other, 1)) {
                delete _corns[1];
                delete _corns[4];
              }
              else {
                intersect_point(oouter, rays.inner, 4);
                intersect_point(oinner, rays.outer, 1);
              }
            }
            else if(is_e) {
              if(this.is_collinear(other, 1)) {
                delete _corns[2];
                delete _corns[3];
              }
              else {
                intersect_point(oouter, rays.inner, 3);
                intersect_point(oinner, rays.outer, 2);
              }
            }
          }
        }

        // угловое диагональное со стандартными или переменными ширинами
        else if(cnn_type === cnn_types.ad) {
          // если профили разной ширины и угол соединение/2, добавляем pt5, pt6
          const tw = this.width, ow = other.width;
          let check_a2 = tw !== ow && cnn_point.cnn.main_row(this);
          if(check_a2 && check_a2.angle_calc_method === a2) {
            const wprofile = tw > ow ? this : other;
            const winner = wprofile === this ? rays.inner : oinner;
            
            if(is_b) {
              intersect_point(oinner, rays.inner, 4);
              const pt = _corns[4];
              const tg = winner.getTangentAt(winner.getOffsetOf(pt)).rotate((this.a1 / 2) * (wprofile === this ? 1 : -1));
              const median = new paper.Path({insert: false, segments: [pt, pt.add(tg)]}).elongation(Math.max(tw, ow) * 3);

              if(wprofile === this) {
                intersect_point(oouter, median, 5);
                intersect_point(rays.outer, median, 7);
                intersect_point(oouter, rays.outer, 1);
              }
              else {
                intersect_point(rays.outer, median, 1);
                delete _corns[5];
                delete _corns[7];
              }
            }

            else if(is_e) {
              intersect_point(oinner, rays.inner, 3);

              const pt = _corns[3];
              const tg = winner.getTangentAt(winner.getOffsetOf(pt)).rotate((this.a2 / 2) * (wprofile === this ? -1 : 1));
              const median = new paper.Path({insert: false, segments: [pt, pt.add(tg)]}).elongation(Math.max(tw, ow) * 3);

              if(wprofile === this) {
                intersect_point(oouter, median, 6);
                intersect_point(rays.outer, median, 8);
                intersect_point(oouter, rays.outer, 2);
              }
              else {
                intersect_point(rays.outer, median, 2);
                delete _corns[6];
                delete _corns[8];
              }
            }
          }
          else {
            const {frame_indent} = this;
            if(is_b) {
              if(this.is_collinear(other, 1)) {
                delete _corns[1];
                delete _corns[4];
              }
              else {
                intersect_point(oouter, rays.outer, 1);
                intersect_point(oinner, rays.inner, 4);
                if(frame_indent) {
                  delete _corns.i1;
                  const tmp = {
                    outer: rays.outer.equidistant(-frame_indent),
                    median: new paper.Path({insert: false, segments: [_corns[1], _corns[4]]})
                  };
                  intersect_point(tmp.outer, tmp.median, 'i1');
                }
              }
            }
            else if(is_e) {
              if(this.is_collinear(other, 1)) {
                delete _corns[2];
                delete _corns[3];
              }
              else {
                intersect_point(oouter, rays.outer, 2);
                intersect_point(oinner, rays.inner, 3);
                if(frame_indent) {
                  delete _corns.i2;
                  const tmp = {
                    outer: rays.outer.equidistant(-frame_indent),
                    median: new paper.Path({insert: false, segments: [_corns[2], _corns[3]]})
                  };
                  intersect_point(tmp.outer, tmp.median, 'i2');
                }
              }
            }
          }
        }

        // короткое или угловое к вертикальной с учетом ориентации
        else if((cnn_type === cnn_types.short) ||
            (cnn_type === cnn_types.av && orientation.is('hor')) || 
            (cnn_type === cnn_types.ah && orientation.is('vert'))) {
          if(is_b) {
            intersect_point(oinner, rays.outer, 1);
            intersect_point(oinner, rays.inner, 4);
          }
          else if(is_e) {
            intersect_point(oinner, rays.outer, 2);
            intersect_point(oinner, rays.inner, 3);
          }
        }

        // длинное угловое к горизонтальной с учётом ориентации
        else if((cnn_type === cnn_types.long) ||
            (cnn_type === cnn_types.ah && orientation.is('hor')) ||
            (cnn_type === cnn_types.av && orientation.is('vert'))) {
          if(is_b) {
            intersect_point(oouter, rays.outer, 1);
            intersect_point(oouter, rays.inner, 4);
          }
          else if(is_e) {
            intersect_point(oouter, rays.outer, 2);
            intersect_point(oouter, rays.inner, 3);
          }
        }
      }
    }
    // соединение с пустотой
    else {
      // точки рассчитаются автоматически, как для ненайденных
      if(is_b) {
        delete _corns[1];
        delete _corns[4];
        delete _corns[5];
        delete _corns[7];
      }
      else if(is_e) {
        delete _corns[2];
        delete _corns[3];
        delete _corns[6];
        delete _corns[8];
      }
    }
    // если точка не рассчиталась - рассчитываем по умолчанию - как с пустотой
    if(is_b) {
      const tangent = generatrix.firstCurve.getTangentAt(0, true).normalize(-delta);
      const pt = this.b.add(tangent);
      if(!_corns[1]) {
        _corns[1] = pt.add(generatrix.firstCurve.getNormalAt(0, true).normalize(this.d1));
      }
      if(!_corns[4]) {
        _corns[4] = pt.add(generatrix.firstCurve.getNormalAt(0, true).normalize(this.d2));
      }
    }
    else if(is_e) {
      const tangent = generatrix.lastCurve.getTangentAt(1, true).normalize(delta);
      const pt = this.e.add(tangent);
      if(!_corns[2]) {
        _corns[2] = pt.add(generatrix.lastCurve.getNormalAt(1, true).normalize(this.d1));
      }
      if(!_corns[3]) {
        _corns[3] = pt.add(generatrix.lastCurve.getNormalAt(1, true).normalize(this.d2));
      }
    }

    return cnn_point;
  }

  /**
   * Точка внутри пути
   * Возвращает точку, расположенную гарантированно внутри профиля
   *
   * @type paper.Point
   */
  interiorPoint() {
    const {generatrix, d1, d2} = this;
    const igen = generatrix.getPointAt(generatrix.length / 2);
    const normal = generatrix.getNormalAt(generatrix.getOffsetOf(igen));
    return igen.add(normal.multiply((d1 + d2) / 2));
  }

  /**
   * Выделяет сегмент пути профиля, ближайший к точке
   *
   * @param point {paper.Point}
   */
  select_corn(point) {

    const res = this.corns(point);

    this.path.segments.forEach((segm) => {
      if(segm.point.is_nearest(res.point)) {
        res.segm = segm;
      }
    });

    if(!res.segm && res.point == this.b) {
      res.segm = this.generatrix.firstSegment;
    }

    if(!res.segm && res.point == this.e) {
      res.segm = this.generatrix.lastSegment;
    }

    if(res.segm && res.dist < consts.sticking0) {
      this.project.deselectAll();
      res.segm.selected = true;
    }

    return res;
  }

  /**
   * Признак прямолинейности
   * Вычисляется, как `is_linear()` {{#crossLink "BuilderElement/generatrix:property"}}образующей{{/crossLink}}
   *
   * @return Boolean
   */
  is_linear() {
    const {generatrix} = this;
    return generatrix ? generatrix.is_linear() : true;
  }

  /**
   * @summary Выясняет, примыкает ли указанный профиль к текущему
   * @desc Вычисления делаются на основании близости координат концов текущего профиля образующей соседнего
   *
   * @param p {ProfileItem}
   * @return Boolean
   */
  is_nearest(p) {
    const {b, e, generatrix} = this;
    if ((b.is_nearest(p.b, true) || generatrix.is_nearest(p.b)) && (e.is_nearest(p.e, true) || generatrix.is_nearest(p.e))) {
      if(p.is_linear() && this.is_linear()) {
        return true;
      }
      // если один или оба профиля изогнуты, проверим среднюю точку
      const pl = p.generatrix.length;
      const tl = generatrix.length;
      if(pl <= tl) {
        const mid = p.generatrix.getPointAt(pl / 2);
        return generatrix.is_nearest(mid);
      }
      else {
        const mid = generatrix.getPointAt(tl / 2);
        return p.generatrix.is_nearest(mid);
      }
    }
  }

  /**
   * @summary Выясняет, параллельны ли профили
   * @desc в пределах `consts.orientation_delta`
   *
   * @param profile {ProfileItem}
   * @return Boolean
   */
  is_collinear(profile, delta = 0) {
    let angl = profile.e.subtract(profile.b).getDirectedAngle(this.e.subtract(this.b));
    if(angl < -180) {
      angl += 180;
    }
    return Math.abs(angl) < (delta || consts.orientation_delta);
  }

  /**
   * Выясняет, перпендикулярны ли профили в точке point
   * @param {ProfileItem} profile
   * @param {paper.Point} point 
   * @param {Number} [delta]
   */
  is_orthogonal(profile, point, delta) {
    return this.generatrix.is_orthogonal(profile.generatrix, point, delta || consts.orientation_delta);
  }

  /**
   * Возвращает массив примыкающих профилей
   */
  joined_nearests() {
    return [];
  }

  /**
   * Считаем профиль штульпом, если к нему примыкает хотя бы одна штульповая фурнитура
   * @return {boolean}
   */
  is_shtulp() {
    if(this.elm_type.is('impost') && this.orientation.is('vert')) {
      const nearests = this.joined_nearests();
      for(const profile of nearests) {
        const {layer} = profile;
        for(const {shtulp_available, shtulp_fix_here, side} of layer.furn.open_tunes) {
          if((shtulp_available || shtulp_fix_here) && layer.profile_by_furn_side(side) === profile) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Переворачивает профиль (меняет местами b и e)
   */
  flip() {
    const nearests = this.joined_nearests();
    const {inner, outer} = this.joined_imposts();
    const shtulp = this.is_shtulp();

    const {elm, rays, generatrix, ox, project, layer} = this;
    rays.b.clear();
    rays.e.clear();
    rays.clear('with_neighbor');
    ox.cnn_elmnts.clear({elm1: elm});
    ox.cnn_elmnts.clear({elm2: elm});
    
    
    // если это штульп - меняем фурнитуру после переворота
    if(shtulp && nearests.length === 2) {
      nearests.forEach(({layer}, index) => {
        const {cnstr, furn, direction, h_ruch} = layer;
        nearests[index] = {
          layer,
          cnstr,
          shtulp_kind: furn.shtulp_kind(),
          furn,
          direction,
          h_ruch,
          params: new Map(),
        }; 
      });
      for(const row of nearests) {
        ox.params.find_rows({cnstr: row.cnstr}, ({param, value, hide}) => {
          row.params.set(param, {value, hide});
        });
      }
    }
    
    // переворот
    generatrix.reverse();

    // смена фурнитуры
    if(shtulp && nearests.length === 2) {
      nearests[0].layer.furn = nearests[1].furn;
      nearests[1].layer.furn = nearests[0].furn;
      nearests[0].layer.h_ruch = nearests[1].h_ruch;
      nearests[1].layer.h_ruch = nearests[0].h_ruch;

      for(const prow of ox.params) {
        let other;
        if(prow.cnstr === nearests[0].cnstr) {
          other = nearests[1].params.get(prow.param);
        }
        else if(prow.cnstr === nearests[1].cnstr) {
          other = nearests[0].params.get(prow.param);
        }
        if(other) {
          Object.assign(prow, other);
        }
      }
      
      // чистим пути рядов стеклопакетов
      for(const {layer} of nearests) {
        for(const {_attr} of layer.fillings) {
          if(_attr.paths.size) {
            for(const [region, elm] of _attr.paths) {
              elm?.remove?.();
            }
            _attr.paths.clear();
          } 
        }          
      }
    }

    // пересчёт
    project.register_change(true, () => {
      rays.clear('with_neighbor');
      project.register_change();
    });
  }

  /**
   * @summary Формирует путь сегмента профиля
   * @desc Пересчитывает соединения с соседями и стоит путь профиля на основании пути образующей
   * - Сначала, вызывает `postcalc_cnn()` для узлов `b` и `e`
   * - Внутри `postcalc_cnn`, выполняется `cnn_point()` для пересчета соединений на концах профиля
   * - Внутри `cnn_point`:
   *    + `check_distance()` - проверяет привязку, если вернулось false, `cnn_point` завершает свою работы
   *    + цикл по всем профилям и поиск привязки
   * - `postcalc_inset()` - проверяет корректность вставки, заменяет при необходимости
   * - `path_points()` - рассчитывает координаты вершин пути профиля
   *
   * @override
   * @return {ProfileItem}
   */
  redraw() {
    // получаем узлы
    const bcnn = this.postcalc_cnn('b');
    const ecnn = this.postcalc_cnn('e');
    const {path, generatrix, rays, _attr} = this;

    // получаем соединения концов профиля и точки пересечения с соседями
    this.path_points(bcnn, 'b');
    this.path_points(ecnn, 'e');

    // очищаем существующий путь
    path.removeSegments();

    // TODO отказаться от повторного пересчета и задействовать клоны rays-ов
    this.corns(5) && path.add(this.corns(5));
    path.add(this.corns(1));

    if(generatrix.is_linear()) {
      path.add(this.corns(2));
      this.corns(6) && path.add(this.corns(6));
      path.add(this.corns(3));
    }
    else {

      let tpath = new paper.Path({insert: false});
      let offset1 = rays.outer.getNearestLocation(this.corns(1)).offset;
      let offset2 = rays.outer.getNearestLocation(this.corns(2)).offset;
      let step = (offset2 - offset1) / 50;

      for (let i = offset1 + step; i < offset2; i += step) {
        tpath.add(rays.outer.getPointAt(i));
      }
      tpath.simplify(0.8);
      path.join(tpath);
      path.add(this.corns(2));
      this.corns(6) && path.add(this.corns(6));
      path.add(this.corns(3));

      tpath = new paper.Path({insert: false});
      offset1 = rays.inner.getNearestLocation(this.corns(3)).offset;
      offset2 = rays.inner.getNearestLocation(this.corns(4)).offset;
      step = (offset2 - offset1) / 50;
      for (let i = offset1 + step; i < offset2; i += step) {
        tpath.add(rays.inner.getPointAt(i));
      }
      tpath.simplify(0.8);
      path.join(tpath);

    }

    path.add(this.corns(4));
    path.closePath();
    path.reduce();
    
    // если задан frame_indent - рисуем
    if(_attr._corns.i1 && _attr._corns.i2) {
      if(!_attr.indent) {
        _attr.indent = new paper.Path({
          parent: this,
          guide: true,
          strokeColor: 'black',
          strokeWidth: 1,
          strokeScaling: false,
          segments: [_attr._corns.i1, _attr._corns.i2],
        });
      }
      else {
        _attr.indent.firstSegment.point = _attr._corns.i1;
        _attr.indent.lastSegment.point = _attr._corns.i2;
      }
    } 

    // перерисовываем всех детей
    for(const chld of this.getItems({class: ProfileItem})) {
      chld.observer?.(this);
      chld.redraw();
    }
    
    return this;
  }

  /**
   * рисует стрелочку направления элемента
   */
  mark_direction() {
    const {generatrix, rays: {inner, outer}} = this;
    const gb = generatrix.getPointAt(130);
    const ge = generatrix.getPointAt(230);
    const ib = inner.getNearestPoint(gb);
    const ie = inner.getNearestPoint(ge);
    const ob = outer.getNearestPoint(gb);
    const oe = outer.getNearestPoint(ge);

    const b = ib.add(ob).divide(2);
    const e = ie.add(oe).divide(2);
    const c = b.add(e).divide(2);
    const n = e.subtract(b).rotate(90).normalize(10);
    const c1 = c.add(n);
    const c2 = c.subtract(n);

    const path = new paper.Path({
      parent: this,
      segments: [b, e, c1, c2, e],
      strokeColor: 'darkblue',
      strokeCap: 'round',
      strokeWidth: 2,
      strokeScaling: false,
    })
  }

  /**
   * Координаты вершин (cornx1...corny4)
   *
   * @param corn {String|Number} - имя или номер вершины
   * @return {paper.Point|Number} - координата или точка
   */
  corns(corn) {
    const {_corns} = this._attr;
    if(typeof corn == 'number') {
      return corn < 10 ? _corns[corn] : this.generatrix.getPointAt(corn);
    }
    else if(corn instanceof paper.Point) {

      const res = {dist: Infinity, profile: this};
      let dist;

      for (let i = 1; i < 5; i++) {
        dist = _corns[i].getDistance(corn);
        if(dist < res.dist) {
          res.dist = dist;
          res.point = _corns[i];
          res.point_name = i;
        }
      }

      const {hhi} = this;
      if(hhi) {
        dist = hhi.getDistance(corn);
        if(dist <= res.dist) {
          res.dist = hhi.getDistance(corn);
          res.point = hhi;
          res.point_name = 'hhi';
        }
        const {hho} = this;
        dist = hho.getDistance(corn);
        if(dist <= res.dist) {
          res.dist = hho.getDistance(corn);
          res.point = hho;
          res.point_name = 'hho';
        }
      }

      dist = this.b.getDistance(corn);
      if(dist <= res.dist) {
        res.dist = this.b.getDistance(corn);
        res.point = this.b;
        res.point_name = 'b';
      }
      else {
        dist = this.e.getDistance(corn);
        if(dist <= res.dist) {
          res.dist = this.e.getDistance(corn);
          res.point = this.e;
          res.point_name = 'e';
        }
      }

      return res;
    }
    else {
      const index = corn.substring(corn.length - 1, 1);
      const axis = corn.substring(corn.length - 2, 1);
      return _corns[index][axis];
    }
  }

  /**
   * Выясняет, имеет ли текущий профиль соединение с `profile` в окрестности точки `point`
   */
  has_cnn(profile, point) {

    let t = this;
    while (t.parent instanceof ProfileItem) {
      t = t.parent;
    }
    while (profile.parent instanceof ProfileItem) {
      profile = profile.parent;
    }

    if(
      (t.b.is_nearest(point, true) && t.cnn_point('b').profile == profile) ||
      (t.e.is_nearest(point, true) && t.cnn_point('e').profile == profile) ||
      (profile.b.is_nearest(point, true) && profile.cnn_point('b').profile == t) ||
      (profile.e.is_nearest(point, true) && profile.cnn_point('e').profile == t)
    ) {
      return true;
    }

    return false;
  }

  /**
   * Выясняет по таблице соединений, являются ли соединения на концах угловыми
   */
  is_corner() {
    const {ox, elm} = this;
    const {_obj} = ox.cnn_elmnts;
    const rows = _obj.filter(({elm1, elm2, node1, node2}) =>
      (elm1 === elm && node1 === 'b' && (node2 === 'b' || node2 === 'e')) || (elm1 === elm && node1 === 'e' && (node2 === 'b' || node2 === 'e'))
    );
    return {
      ab: rows.find(({node1}) => node1 === 'b'),
      ae: rows.find(({node1}) => node1 === 'e')
    }
  }

  /**
   * Вызывает одноименную функцию _scheme в контексте текущего профиля
   */
  check_distance(element, res, point, check_only) {
    return this.project.check_distance(element, this, res, point, check_only);
  }

  /**
   * Дополняет и сортирует массив свойств примыкающих профилей
   * @param ares
   * @return {boolean}
   */
  max_right_angle(ares) {
    const {generatrix} = this;
    let has_a = true;
    ares.forEach((res) => {
      res._angle = generatrix.angle_to(res.profile.generatrix, res.point);
      if(res._angle > 180) {
        res._angle = 360 - res._angle;
      }
    });
    ares.sort((a, b) => {
      const aa = Math.abs(a._angle - 90);
      const ab = Math.abs(b._angle - 90);
      return aa - ab;
    });
    return has_a;
  }

  remove() {
    const {layer} = this;
    const res = super.remove(); 
    if(res !== false) {
      for(const {rays} of layer?.profiles || []) {
        for(const node of ['b', 'e']) {
          if(rays[node].profile === this) {
            rays[node].clear(true);
          }
        }
      }
    }
    return res;
  }
}

ProfileItem.path_attr = {
  strokeColor: 'black',
  strokeWidth: 1,
  strokeScaling: false,

  onMouseEnter(event) {
    if(this.isInserted()) {
      const {fillColor, parent: {_attr}, project} = this;
      if(project._attr._from_service || !fillColor) {
        return;
      }
      _attr.fillColor = fillColor.clone();
      const {red, green, blue, alpha} = fillColor;
      fillColor.alpha = 0.86;
      fillColor.red = red > 0.7 ? red - 0.06 : red + 0.06;
      fillColor.green = green > 0.7 ? green - 0.05 : green + 0.05;
      fillColor.blue = blue > 0.7 ? blue - 0.07 : blue + 0.07;
    }
  },

  onMouseLeave(event) {
    if(this.isInserted()) {
      const {_attr, project} = this.parent;
      if(project._attr._from_service) {
        return;
      }
      this.fillColor = _attr.fillColor;
      delete _attr.fillColor;
    }
  }
};

EditorInvisible.ProfileItem = ProfileItem;
EditorInvisible.ProfileRays = ProfileRays;
EditorInvisible.CnnPoint = CnnPoint;
