/**
 * ### Вложенное изделие
 * https://github.com/oknosoft/windowbuilder/issues/564
 *
 * @module contour_nested
 *
 * Created by Evgeniy Malyarov on 20.04.2020.
 */

class ContourNested extends Contour {

  constructor(attr) {
    super(attr);
    if(!this._row.kind) {
      this._row.kind = 2;
    }

    // находим или создаём строку заказа с вложенным изделием
  }

  /**
   * Удаляет контур из иерархии проекта
   * Одновлеменно, удаляет вложенное изделие из заказа
   * @method remove
   */
  remove() {
    //удаляем детей

    // стандартные действия по удалению слоёв
    super.remove();
  }

}

EditorInvisible.ContourNested = ContourNested;
