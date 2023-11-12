
/*
 * Виртуальный родительский профиль для вложенных слоёв
 *
 * Created 21.04.2020.
 */

class ProfileParent extends Profile {

  constructor(attr) {
    const {parent: {leading_product}, row} = attr;
    super(attr);
  }

  // пересчет вставок и соединений не делаем
  default_inset(all) {

  }

  /**
   * Возвращает тип элемента (Вложение)
   */
  get elm_type() {
    return $p.enm.elm_types.attachment;
  }

  // вставка - внешний профиль
  set_inset(v) {

  }

  // цвет внешнего элемента
  set_clr(v) {

  }

  /**
   * Запрещаем редактировать элемент из интерфейса
   * @return {boolean}
   */
  get locked() {
    return true;
  }

  /**
   * Элемент не делает вклада в спецификацию
   * @returns {boolean}
   */
  get virtual() {
    return true;
  }

  // характеристика, из которой брать значения параметров
  get prm_ox() {
    return this.ox.leading_product;
  }

  cnn_point(node, point) {
    const {project, parent, rays} = this;
    const res = rays[node];
    if(!res.profile) {
      if(!point) {
        point = this[node];
      }
      const pp = node === 'b' ? 'e' : 'b';
      for(const profile of parent.profiles) {
        if(profile !== this && profile[pp].is_nearest(point, true)) {
          res.profile = profile;
          res.profile_point = pp;
          res.point = point;
          res.cnn_types = $p.enm.cnn_types.acn.a;
          break;
        }
      }
    }
    if(!res.cnn) {
      res.cnn = $p.cat.cnns.elm_cnn(this, res.profile, res.cnn_types);
    }
    return res;
  }

  path_points(cnn_point, profile_point) {

    const {_attr: {_corns}, generatrix, layer: {bounds}} = this;
    if(!generatrix.curves.length) {
      return cnn_point;
    }
    const {rays} = this;
    const prays = cnn_point.profile.rays;

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

    const pinner = prays.inner.getNearestPoint(bounds.center).getDistance(bounds.center, true) >
      prays.outer.getNearestPoint(bounds.center).getDistance(bounds.center, true) ? prays.inner : prays.outer;

    const inner = rays.inner.getNearestPoint(bounds.center).getDistance(bounds.center, true) >
    rays.outer.getNearestPoint(bounds.center).getDistance(bounds.center, true) ? rays.inner : rays.outer;

    const offset = -2;
    if(profile_point == 'b') {
      intersect_point(pinner.equidistant(offset), inner.equidistant(offset), 1);
      intersect_point(pinner, inner, 4);
    }
    else if(profile_point == 'e') {
      intersect_point(pinner.equidistant(offset), inner.equidistant(offset), 2);
      intersect_point(pinner, inner, 3);
    }

    return cnn_point;
  }

  redraw() {
    // получаем узлы
    const bcnn = this.cnn_point('b');
    const ecnn = this.cnn_point('e');
    const {path, generatrix} = this;

    // получаем соединения концов профиля и точки пересечения с соседями
    this.path_points(bcnn, 'b');
    this.path_points(ecnn, 'e');

    // очищаем существующий путь
    path.removeSegments();

    path.add(this.corns(1));

    // if(generatrix.is_linear()) {
      path.add(this.corns(2));
      path.add(this.corns(3));
    // }
    // else {
    //
    //   let tpath = new paper.Path({insert: false});
    //   let offset1 = rays.outer.getNearestLocation(this.corns(1)).offset;
    //   let offset2 = rays.outer.getNearestLocation(this.corns(2)).offset;
    //   let step = (offset2 - offset1) / 50;
    //
    //   for (let i = offset1 + step; i < offset2; i += step) {
    //     tpath.add(rays.outer.getPointAt(i));
    //   }
    //   tpath.simplify(0.8);
    //   path.join(tpath);
    //   path.add(this.corns(2));
    //   this.corns(6) && path.add(this.corns(6));
    //   path.add(this.corns(3));
    //
    //   tpath = new paper.Path({insert: false});
    //   offset1 = rays.inner.getNearestLocation(this.corns(3)).offset;
    //   offset2 = rays.inner.getNearestLocation(this.corns(4)).offset;
    //   step = (offset2 - offset1) / 50;
    //   for (let i = offset1 + step; i < offset2; i += step) {
    //     tpath.add(rays.inner.getPointAt(i));
    //   }
    //   tpath.simplify(0.8);
    //   path.join(tpath);
    //
    // }

    path.add(this.corns(4));
    path.closePath();
    path.reduce();

    return this;
  }
}

EditorInvisible.ProfileParent = ProfileParent;
