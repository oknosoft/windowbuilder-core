/*
 * Created by Evgeniy Malyarov on 09.02.2022.
 */

/**
 * Элемент составного пути (например, подоконник с закруглением и вырезом)
 * @extends BuilderElement
 */
class Compound extends BuilderElement {

  /**
   * Возвращает тип элемента (Составной путь)
   * @type EnmElm_types
   */
  get elm_type() {
    return $p.enm.elm_types.compound;
  }
}

EditorInvisible.Compound = Compound;
