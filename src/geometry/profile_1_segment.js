
/**
 * Сегмент (кусочек) связки
 *
 * Created 26.07.2021.
 */

class ProfileSegment extends ProfileItem {

  // elm_type такой же, как у обычного профиля
  get elm_type() {
    const {_rays, _nearest} = this.parent._attr;
    const {elm_types} = $p.enm;

    // если начало или конец элемента соединены с соседями по Т, значит это импост
    if(_rays && !_nearest && (_rays.b.is_tt || _rays.e.is_tt)) {
      return elm_types.Импост;
    }

    // Если вложенный контур, значит это створка
    if(this.layer && this.layer.parent instanceof Contour) {
      return elm_types.Створка;
    }

    return elm_types.Рама;
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

  cnn_side () {
    return $p.enm.cnn_sides.inner;
  }

  observer() {

  }

  redraw() {

  }

}

EditorInvisible.ProfileSegment = ProfileSegment;
