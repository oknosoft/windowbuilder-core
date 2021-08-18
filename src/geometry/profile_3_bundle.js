
/**
 * Связка профилей
 *
 * Created 14.10.2020.
 */

class ProfileBundle extends Profile {

  constructor(attr) {
    super(attr);

    if(!this.segms.length) {
      this.split_at();
    }
  }

  /**
   * Возвращает тип элемента (Связка)
   */
  get elm_type() {
    return $p.enm.elm_types.Связка;
  }

  /**
   * Сегменты текущей связки
   * @return {Array.<ProfileSegment>}
   */
  get segms() {
    return this.children.filter((elm) => elm instanceof ProfileSegment);
  }

  cnn_side(profile, interior, rays) {
    if(profile instanceof ProfileSegment) {
      return profile.cnn_side();
    }
    return super.cnn_side(profile, interior, rays);
  }

  /**
   * Добавляет сегменты
   * @param [len] {Number} - координата, на которой резать
   */
  split_at(len) {
    const {generatrix, segms, inset, clr} = this;
    if(!len) {
      len = generatrix.length / 2;
    }
    const first = generatrix.clone({insert: false});
    const loc = first.getLocationAt(len);
    const second = first.splitAt(loc);
    new ProfileSegment({generatrix: first, proto: {inset, clr}, parent: this});
    new ProfileSegment({generatrix: second, proto: {inset, clr}, parent: this});
  }

  /**
   * Объединяет сегменты
   * @param segm1 {ProfileSegment}
   * @param segm2 {ProfileSegment}
   */
  merge(segm1, segm2) {

  }


}

class BundleRange extends paper.Group {

}

EditorInvisible.ProfileBundle = ProfileBundle;
EditorInvisible.BundleRange = ProfileBundle;
