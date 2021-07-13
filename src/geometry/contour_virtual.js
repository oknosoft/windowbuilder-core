
/**
 * ### Виртуальный слой
 * https://github.com/oknosoft/windowbuilder/issues/563
 *
 * @module contour_virtual
 *
 * Created by Evgeniy Malyarov on 20.04.2020.
 */


class ContourVirtual extends Contour {

  constructor(attr) {
    super(attr);
    if(!this._row.kind) {
      this._row.kind = 1;
    }
  }

  save_coordinates(short) {

    if (!short) {
      // запись в таблице координат, каждый элемент пересчитывает самостоятельно
      const {l_text, l_dimensions} = this;
      for (let elm of this.children) {
        if (elm === l_text || elm === l_dimensions) {
          elm.children.forEach((elm) => elm.save_coordinates && elm.save_coordinates());
        }
        else if (elm.save_coordinates && !(elm instanceof ProfileNested)) {
          elm.save_coordinates();
        }
      }
    }

    super.save_coordinates(true);
  }

}

EditorInvisible.ContourVirtual = ContourVirtual;
