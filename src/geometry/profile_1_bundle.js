
/**
 * Связка профилей
 *
 * Created by Evgeniy Malyarov on 14.10.2020.
 */

class ProfileBundle extends ProfileItem {

  constructor(attr) {

    const fromCoordinates = !!attr.row;

    super(attr);

    if(this.parent) {
      const {project: {_scope, ox}} = this;

      // Информируем контур о том, что у него появился новый ребёнок
      this.layer.on_insert_elm(this);

      // ищем и добавляем доборные профили
      if(fromCoordinates){
        const {cnstr, elm} = attr.row;
        const {Добор} = $p.enm.elm_types;
        ox.coordinates.find_rows({cnstr, region: {not: 0}, parent: elm}, (row) => {
          // new Profile({row, parent: this});
        });
      }
    }

  }

  /**
   * Возвращает тип элемента (Связка)
   */
  get elm_type() {
    return $p.enm.elm_types.Связка;
  }

}

class BundleRange extends paper.Group {

}

EditorInvisible.ProfileBundle = ProfileBundle;
EditorInvisible.BundleRange = ProfileBundle;
