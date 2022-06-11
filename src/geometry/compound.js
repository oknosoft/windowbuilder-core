/**
 * Элемент составного пути (например, подоконник с закруглением и вырезом)
 *
 * @module compound
 *
 * Created by Evgeniy Malyarov on 09.02.2022.
 */

class Compound extends BuilderElement {

  /**
   * Возвращает тип элемента (Составной путь)
   */
  get elm_type() {
    return $p.enm.elm_types.compound;
  }
}

EditorInvisible.Compound = Compound;
