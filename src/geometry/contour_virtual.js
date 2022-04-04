
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

  get ProfileConstructor() {
    return ProfileVirtual;
  }

  /**
   * Система виртуального слоя - можем переопределить
   * @return {CatProduction_params}
   */
  get sys() {
    const {_row: {dop}, layer: {sys}} = this;
    return dop.sys ? sys._manager.get(dop.sys) : sys;
  }
  set sys(v) {
    const {_row, layer: {sys}} = this;
    if((!v || v == sys) {
      if(_row.dop.sys) {
        _row.dop = {sys: null};
      }
    }
    else {
      _row.dop = {sys: v.valueOf()};
    }
  }

  presentation(bounds) {
    const text = super.presentation(bounds);
    return text.replace('Створка', 'Виртуал');
  }

  save_coordinates(...args) {
    return super.save_coordinates(...args);
  }

}

EditorInvisible.ContourVirtual = ContourVirtual;
