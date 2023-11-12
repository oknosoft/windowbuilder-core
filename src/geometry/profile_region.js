
/*
 * Профиль ряда
 *
 * Created 11.1.2023.
 */

class ProfileRegion extends Profile {

  /**
   * Возвращает тип элемента (ряд)
   */
  get elm_type() {
    return $p.enm.elm_types.region;
  }
  
}

EditorInvisible.ProfileRegion = ProfileRegion;
