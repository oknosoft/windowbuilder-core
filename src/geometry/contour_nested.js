
/**
 * ### Вложенное изделие в родительском
 * https://github.com/oknosoft/windowbuilder/issues/564
 *
 * @module contour_nested
 *
 * Created by Evgeniy Malyarov on 20.04.2020.
 * Содержит виртуальные профили, в которые служат внешним, неизменяемым слоев вложенного изделия
 */

class ContourNested extends Contour {

  constructor(attr) {
    super(attr);

    // находим или создаём строку заказа с вложенным изделием
    const {project, cnstr} = this;
    const {ox} = project;
    for(const {characteristic} of ox.calc_order.production) {
      if(characteristic.leading_product === ox && characteristic.leading_elm === -cnstr) {
        this._ox = characteristic;
        break;
      }
    }

    // добавляем в проект элементы вложенного изделия
    if(this._ox) {
      this._ox.constructions.find_rows({parent: 1}, (row) => {
        Contour.create({project, row, parent: this, ox: this._ox});
      });
    }
  }

  get hidden() {
    return !this.visible;
  }
  set hidden(v) {
    this.visible = !v;
  }

  /**
   * Перерисовывает элементы контура
   * @method redraw
   * @for Contour
   */
  redraw() {

    if(!this.visible || this.hidden) {
      return;
    }

    // сбрасываем кеш габаритов
    this._attr._bounds = null;

    // сначала перерисовываем все профили контура
    for(const elm of this.profiles) {
      elm.redraw();
    }

    // затем - вложенное изделие
    for(const elm of this.contours) {
      elm.redraw();
    }
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
