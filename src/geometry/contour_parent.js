/*
 * Created by Evgeniy Malyarov on 20.04.2020.
 */

/**
 * Родительский слой вложенного изделия  
 * @link https://github.com/oknosoft/windowbuilder/issues/564
 * @extends Contour
 * 
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
      _attr._ox = ox.leading_product;
    }
    return _attr._ox;
  }

  // характеристика, из которой брать значения параметров
  get prm_ox() {
    return this.leading_product;
  }

  /**
   * Ошибки соединений в виртуальном слое не нужны
   */
  draw_cnn_errors() {

  }

  /**
   * Удаляет контур из иерархии проекта
   * Одновлеменно, удаляет вложенное изделие из заказа
   */
  remove() {
    //удаляем детей

    // стандартные действия по удалению слоёв
    super.remove();
  }

}

EditorInvisible.ContourParent = ContourParent;
