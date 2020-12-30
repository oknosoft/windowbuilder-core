
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

  presentation(bounds) {
    const text = super.presentation(bounds);
    return text.replace('Створка', 'Вложение');
  }

  get hidden() {
    return !this.visible;
  }
  set hidden(v) {
    this.visible = !v;
  }

  get content() {
    for(const contour of this.contours) {
      return contour;
    }
  }

  /**
   * Вычисляемые поля в таблицах конструкций и координат
   * @method save_coordinates
   * @param short {Boolean} - короткий вариант - только координаты контура
   */
  save_coordinates(short) {

    if (!short) {
      // запись в таблице координат для виртуальных профилей
      for (const elm of this.profiles) {
        elm.save_coordinates();
      }
    }

    // ответственность за строку в таблице конструкций лежит на контуре
    const {bounds, w, h, is_rectangular, content} = this;
    this._row.x = bounds ? bounds.width.round(4) : 0;
    this._row.y = bounds ? bounds.height.round(4) : 0;
    this._row.is_rectangular = is_rectangular;
    this._row.w = w.round(4);
    this._row.h = h.round(4);

    // пересчитаем вложенное изделие
    if(content) {
      content._row._owner._owner.glasses.clear();
      content.save_coordinates();
    }
  }

  set path(attr) {
    super.path = attr;
    // перерисовываем вложенные контуры
    const {content, profiles} = this
    if(content) {
      content.path = profiles.map((p) => new GlassSegment(p, p.b, p.e, false));
    }
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
