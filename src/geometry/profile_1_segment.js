
/**
 * Сегмент (кусочек) связки
 *
 * Created 26.07.2021.
 */

class ProfileSegment extends ProfileItem {

  // elm_type такой же, как у обычного профиля
  get elm_type() {
    return this.parent.elm_type;
  }

  // Расстояние от узла до опорной линии
  get d0() {
    return this.parent.d0;
  }

  // Расстояние от узла до внешнего ребра элемента
  get d1() {
    return this.parent.d1;
  }

  // Расстояние от узла до внутреннего ребра элемента
  get d2() {
    return this.parent.d2;
  }

  /**
   * Координаты начала элемента
   * @type paper.Point
   */
  get b() {
    return super.b;
  }
  set b(v) {
    super.b = v;
    this._attr._rays.b.point = this.b;
  }

  /**
   * Координаты конца элемента
   * @type paper.Point
   */
  get e() {
    return super.e;
  }
  set e(v) {
    super.e = v;
    this._attr._rays.e.point = this.e;
  }

  // вставка - внешний профиль
  get inset() {
    return this.parent.inset;
  }
  set inset(v) {}

  set_inset(v) {

  }

  get nom() {
    return this.parent.nom;
  }

  get pos() {
    return this.parent.pos;
  }

  /**
   * информация для диалога свойств
   *
   * @type String
   * @final
   */
  get info() {
    const {elm, angle_hor, length, layer} = this;
    return `№${layer instanceof ContourNestedContent ? `${
      layer.layer.cnstr}-${elm}` : elm} сегм. α:${angle_hor.toFixed(0)}° l: ${length.toFixed(0)}`;
  }

  cnn_point(node, point) {

    const res = this.rays[node];
    const {parent} = this;

    const check_distance = (elm) => {

      if(elm == this || elm == parent){
        return;
      }

      const gp = elm.generatrix.getNearestPoint(point);
      let distance;

      if(gp && (distance = gp.getDistance(point)) < consts.sticking){
        if(distance <= res.distance){
          res.point = gp;
          res.distance = distance;
          res.profile = elm;

          if(elm.generatrix.firstSegment.point.is_nearest(gp)) {
            res.profile_point = 'b';
          }
          else if(elm.generatrix.lastSegment.point.is_nearest(gp)) {
            res.profile_point = 'e';
          }
        }
      }

    };

    if(!point){
      point = this[node];
    }

    // Если привязка не нарушена, возвращаем предыдущее значение
    if(res.profile && res.profile.children.length){
      if(!res.cnn) {
        res.cnn = $p.cat.cnns.elm_cnn(res.parent, res.profile, res.cnn_types, res.cnn, true, false, res);
      }
      return res;
    }

    // TODO вместо полного перебора профилей контура, реализовать анализ текущего соединения и успокоиться, если соединение корректно
    res.clear();
    res.cnn_types = [$p.enm.cnn_types.ad];

    parent.segms.forEach((segm) => check_distance(segm, true));

    if(!res.profile || !res.profile_point) {
      const {rays, generatrix} = parent;
      if(generatrix.firstSegment.point.is_nearest(res.point)) {
        res.profile = rays.b.profile;
        res.profile_point = rays.b.profile_point;
        res.cnn = $p.cat.cnns.elm_cnn(res.parent, res.profile, res.cnn_types, res.cnn, true, false, res);
      }
      else if(generatrix.lastSegment.point.is_nearest(res.point)) {
        res.profile = rays.e.profile;
        res.profile_point = rays.e.profile_point;
        res.cnn = $p.cat.cnns.elm_cnn(res.parent, res.profile, res.cnn_types, res.cnn, true, false, res);
      }
    }

    return res;
  }

  cnn_side(profile, interior, rays) {
    return profile instanceof ProfileSegment ? $p.enm.cnn_sides.inner : this.parent.cnn_side(profile, interior, rays);
  }

  save_coordinates() {
    super.save_coordinates();
    const {_row, parent} = this;
    _row.elm_type = $p.enm.elm_types.bundle;
    _row.parent = parent.elm;
  }

  path_points(cnn_point, profile_point) {
    const {_attr: {_corns}, parent} = this;
    if(parent.b.is_nearest(cnn_point.point)) {
      _corns[1] = parent.corns(1);
      _corns[4] = parent.corns(4);
      _corns[5] = parent.corns(5);
      _corns[7] = parent.corns(7);
    }
    else if(parent.e.is_nearest(cnn_point.point)) {
      _corns[2] = parent.corns(2);
      _corns[3] = parent.corns(3);
      _corns[6] = parent.corns(6);
      _corns[8] = parent.corns(8);
    }
    else {
      const {rays} = parent;
      const inner = rays.inner.getNearestPoint(cnn_point.point);
      const outer = rays.outer.getNearestPoint(cnn_point.point);
      if(profile_point === 'b') {
        _corns[1] = outer;
        _corns[4] = inner;
      }
      else {
        _corns[2] = outer;
        _corns[3] = inner;
      }
    }
    return cnn_point;
  }

  nearest() {
    return this.parent;
  }

  move_points(delta) {
    const {b, e, rays, parent: {generatrix}} = this;

    for(const segm of this.generatrix.segments) {
      if (segm.selected){
        const free_point = generatrix.getNearestPoint(segm.point.add(delta));
        if(segm.point === b){
          if(b.is_nearest(generatrix.firstSegment.point)) {
            continue;
          }
          rays.b.point = free_point;
          if(rays.b.profile_point && rays.b.profile) {
            rays.b.profile[rays.b.profile_point] = free_point;
          }
        }
        else if(segm.point === e){
          if(e.is_nearest(generatrix.lastSegment.point)) {
            continue;
          }
          rays.e.point = free_point;
          if(rays.e.profile_point && rays.e.profile) {
            rays.e.profile[rays.e.profile_point] = free_point;
          }
        }

        // собственно, сдвиг узлов
        segm.point = free_point;
      }
    }
  }

  do_bind() {
    const {b, e, rays, parent: {generatrix}} = this;
    if(generatrix.is_linear()) {
      if(!generatrix.is_nearest(b, 0)) {
        let pb = generatrix.getNearestPoint(b);
        if(pb.is_nearest(generatrix.firstSegment.point, this.widht) && !pb.equals(generatrix.firstSegment.point)) {
          pb = generatrix.firstSegment.point;
        }
        if(!b.is_nearest(pb, 0)) {
          this.b = pb;
        }
        if(pb !== generatrix.firstSegment.point) {
          const cp = this.cnn_point('b');
          if(cp.profile instanceof ProfileSegment && cp.profile_point) {
            cp.profile[cp.profile_point] = pb;
          }
        }
      }
      if(!generatrix.is_nearest(e, 0)) {
        let pe = generatrix.getNearestPoint(e);
        if(pe.is_nearest(generatrix.lastSegment.point, this.widht) && !pe.equals(generatrix.lastSegment.point)) {
          pe = generatrix.lastSegment.point;
        }
        if(!e.is_nearest(pe, 0)) {
          this.e = pe;
        }
        if(pe !== generatrix.lastSegment.point) {
          const cp = this.cnn_point('e');
          if(cp.profile instanceof ProfileSegment && cp.profile_point) {
            cp.profile[cp.profile_point] = pe;
          }
        }
      }
    }
  }

  observer(p) {
    if(p === this.parent) {
      this.do_bind();
    }
  }

  joined_imposts() {
    const {b, e, parent, generatrix} = this;
    const tmp = parent.joined_imposts();
    const filter = ({point}) => {
      const pt = generatrix.getNearestPoint(point);
      return !(b.is_nearest(pt) || e.is_nearest(pt));
    };
    return {inner: tmp.inner.filter(filter), outer: tmp.outer.filter(filter)};
  }

  /**
   * У сегмента нет доборов
   */
  get addls() {
    return [];
  }

  /**
   * У сегмента нет сегментов
   */
  get segms() {
    return [];
  }

  remove(force) {
    if(force !== true) {
      const {parent: {segms, e}, rays} = this;
      // если сегментов 2 - просто чистим
      if(segms.length <= 2) {
        for(const segm of segms) {
          segm.remove(true);
        }
        return;
      }
      // последний сегмент удаляем иначе
      if(this.e.is_nearest(e)) {
        const {profile} = rays.b;
        const pe = profile.cnn_point('e');
        pe.profile = rays.e.profile;
        pe.profile_point = rays.e.profile_point;
        pe.cnn = rays.e.cnn;
        profile.e = rays.e.point;
      }
    }
    this.selected = false;
    super.remove();
  }

}

EditorInvisible.ProfileSegment = ProfileSegment;
