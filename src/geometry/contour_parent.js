
/**
 * ### Родительский слой вложенного изделия
 * https://github.com/oknosoft/windowbuilder/issues/564
 *
 * @module contour_nested
 *
 * Created by Evgeniy Malyarov on 20.04.2020.
 */

class ContourParent extends Contour {

  get ProfileConstructor() {
    return ProfileParent;
  }

  /**
   * Объект характеристики родительского изделия
   * @return {CatCharacteristics}
   */
  get leading_product() {
    const {_attr, project: {ox}} = this;
    if(!_attr._ox) {
      for(const {characteristic} of ox.calc_order.production) {
        if(ox.leading_product === characteristic) {
          _attr._ox = characteristic;
        }
      }
    }
    return _attr._ox;
  }

  /**
   * Ошибки соединений в виртуальном слое не нужны
   */
  draw_cnn_errors() {

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

EditorInvisible.ContourParent = ContourParent;
