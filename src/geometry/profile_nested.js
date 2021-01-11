
/**
 * Виртуальный профиль для вложенных слоёв
 *
 * @module profile_virtual
 *
 * Created by Evgeniy Malyarov on 21.04.2020.
 */

class ProfileNested extends Profile {

  constructor(attr) {
    super(attr);
    const nearest_elm = attr.parent.layer.getItem({elm: attr.row.parent});
    Object.defineProperties(this._attr, {
      _nearest: {
        get() {
          return nearest_elm;
        },
        set(v) {

        }
      },
      _nearest_cnn: {
        get() {
          return ProfileNested.nearest_cnn;
        },
        set(v) {

        }
      }
    });
    this.path.strokeColor = 'darkgreen';
    this.path.dashArray = [8, 4, 2, 4];
  }

  // ведущий элемент получаем в лоб
  nearest() {
    return this._attr._nearest;
  }

  // пересчет вставок и соединений не делаем
  default_inset(all) {

  }

  /**
   * Возвращает тип элемента (Вложение)
   */
  get elm_type() {
    return $p.enm.elm_types.Вложение;
  }

  // вставка - внешний профиль
  get inset() {
    return this.nearest().inset;
  }
  set inset(v) {}

  // цвет внешнего элемента
  get clr() {
    return this.nearest(true).clr;
  }
  set clr(v) {}

  get sizeb() {
    return 0;
  }

  path_points(cnn_point, profile_point) {

    const {_attr: {_corns}, generatrix, layer: {bounds}} = this;
    if(!generatrix.curves.length) {
      return cnn_point;
    }
    const {rays} = this.nearest();
    const prays = cnn_point.profile.nearest().rays;

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

  save_coordinates() {
    super.save_coordinates();
    const {layer: {content}, _row} = this;
    const {coordinates} = content._row._owner._owner;
    const {cnn_elmnts} = coordinates._owner;
    const prow = coordinates.find({elm: _row.parent});
    if(prow) {
      ['x1', 'y1', 'x2', 'y2', 'path_data', 'r', 'len', 'angle_hor', 'orientation', 'pos', 'elm_type'].forEach((name) => {
        prow[name] = _row[name];
      });
      prow.alp1 = prow.alp2 = 0;
    }
  }

  redraw() {
    // получаем узлы
    const bcnn = this.cnn_point('b');
    const ecnn = this.cnn_point('e');
    const {rays} = this.nearest();
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

ProfileNested.nearest_cnn = {
  size(profile) {
    return profile.nearest().width;
  },
  empty() {
    return false;
  },
  get cnn_type() {
    return $p.enm.cnn_types.ii;
  },
  specification: [],
  selection_params: [],
  filtered_spec() {
    return [];
  },
}

EditorInvisible.ProfileNested = ProfileNested;
