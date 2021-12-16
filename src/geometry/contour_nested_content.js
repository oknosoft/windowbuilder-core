
/**
 * Рендер содержимого вложенного изделия
 *
 * @module contour_nested_content
 *
 * Created by Evgeniy Malyarov on 24.12.2020.
 */

class ContourNestedContent extends Contour {

  constructor(attr) {
    super(attr);

    // добавляем вложенные слои
    const {_ox: ox, project} = this;
    if(ox) {
      ox.constructions.find_rows({parent: this.cnstr}, (row) => {
        Contour.create({project, row, parent: this, ox});
      });
    }

  }

  /**
   * Загружает слои из прототипа
   * @param contour {Contour} - слой внешнего изделия (из другой рисовалки)
   * @param delta {Point} - на сколько смещать
   * @param map {Map} - соответствие номеров элементов
   */
  load_stamp({contour, delta, map}) {
    const {_ox: ox, project} = this;

    for(const proto of contour.profiles) {
      const generatrix = proto.generatrix.clone({insert: false});
      generatrix.translate(delta);
      new ProfileNestedContent({
        parent: this,
        generatrix,
        proto: {inset: proto.inset, clr: proto.clr},
        elm: map.get(proto.elm),
      });
    }

    for(const proto of contour.glasses(false, true)) {
      const path = proto.generatrix.clone({insert: false});
      path.translate(delta);
      new Filling({
        parent: this,
        path,
        proto: {inset: proto.inset, clr: proto.clr},
        elm: map.get(proto.elm),
      });
    }

    for(const proto of contour.contours) {
      const row = ox.constructions.find({cnstr: proto.cnstr});
      if(row && row.parent === this.cnstr) {
        const sub = Contour.create({project, row, parent: this, ox});
        sub.load_stamp({contour: proto, delta, map})
      };
    }
  }

  get key() {
    return `${this.layer.key}-${this.cnstr}`;
  }

  get _ox() {
    return this.layer._ox;
  }

  get lbounds() {
    return this.layer.lbounds;
  }

  get l_dimensions() {
    return ContourNested._dimlns;
  }

  /**
   * При изменении системы внешнего изделия, с внутренним почти ничего делать не надо
   */
  on_sys_changed() {
    this.profiles.forEach((elm) => elm.rays.clear('with_neighbor'));
    this.contours.forEach((contour) => contour.on_sys_changed());
  }

}

EditorInvisible.ContourNestedContent = ContourNestedContent;
