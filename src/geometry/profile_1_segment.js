
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

  cnn_point(node, point) {

    const res = this.rays[node];

    const check_distance = (elm) => {

      if(elm == this || elm == this.parent){
        return;
      }

      const gp = elm.generatrix.getNearestPoint(point);
      let distance;

      if(gp && (distance = gp.getDistance(point)) < consts.sticking){
        if(distance <= res.distance){
          res.point = gp;
          res.distance = distance;
          res.profile = elm;
        }
      }

    };

    if(!point){
      point = this[node];
    }

    // Если привязка не нарушена, возвращаем предыдущее значение
    if(res.profile && res.profile.children.length){
      return res;
    }

    // TODO вместо полного перебора профилей контура, реализовать анализ текущего соединения и успокоиться, если соединение корректно
    res.clear();
    res.cnn_types = [$p.enm.cnn_types.ad];

    this.parent.segms.forEach((segm) => check_distance(segm, true));

    return res;
  }

  do_bind() {

  }

  cnn_side(profile, interior, rays) {
    return profile instanceof ProfileSegment ? $p.enm.cnn_sides.inner : this.parent.cnn_side(profile, interior, rays);
  }

  save_coordinates() {
    super.save_coordinates();
    this._row.elm_type = $p.enm.elm_types.bundle;
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

  }

  move_points() {

  }

  observer() {

  }

  // redraw() {
  //
  // }

}

EditorInvisible.ProfileSegment = ProfileSegment;
