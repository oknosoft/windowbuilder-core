
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
    const {_row, layer: {sys}, _ox: {params}, cnstr} = this;
    const inset = $p.utils.blank.guid;
    if(!v || v == sys) {
      if(_row.dop.sys) {
        _row.dop = {sys: null};
        params.clear({cnstr, inset});
      }
    }
    else {
      _row.dop = {sys: v.valueOf()};
      this.refill_prm();
    }
  }

  /**
   * Бит, может ли данный слой иметь собственную систему
   * @return {boolean}
   */
  get own_sys() {
    return true;
  }

  refill_prm() {
    const {_ox: {params}, cnstr, sys: {product_params}} = this;
    const inset = $p.utils.blank.guid;
    // чистим
    const rm = [];
    params.find_rows({cnstr, inset}, (row) => {
      if(!product_params.find({param: row.param})) {
        rm.push(row);
      }
    });
    for(const row of rm) {
      params.del(row);
    }
    // добавляем
    for(const row of product_params) {
      let has;
      params.find_rows({cnstr: {in: [0, cnstr]}, param: row.param, inset}, () => {
        has = true;
        return false;
      });
      if(!has) {
        params.add({
          cnstr,
          inset,
          region: 0,
          param: row.param,
          hide: row.hide,
          value: row.value,
        });
      }
    }
  }

  /**
   * Возвращает значение параметра с учётом наследования
   * @param param
   * @param cnstr
   * @param elm
   * @param origin
   * @param prm_row
   * @returns {*}
   */
  extract_pvalue({param, cnstr, elm, origin, prm_row}) {
    const {enm, utils: {blank}} = $p;
    const {eq_produnt} = enm.plan_detailing
    const {_ox} = this;
    const {rnum} = elm;
    if(rnum) {
      return elm[param.valueOf()];
    }
    if(eq_produnt.includes(prm_row.origin) && (!cnstr || cnstr === this.cnstr)) {
      let prow;
      _ox.params.find_rows({
        param,
        cnstr: {in: [0, this.cnstr]},
        inset: blank.guid,
      }, (row) => {
        if(!prow || row.cnstr) {
          prow = row;
        }
      });
      if(prow) {
        return prow.value;
      }
      else {
        console.error(`Не задано значений параметра ${param.toString()}`);
      }
    }
    else {
      return param.extract_pvalue({ox: _ox, cnstr, elm, origin, prm_row})
    }
  }

  get hidden() {
    return !!this._hidden;
  }
  set hidden(v) {
    if (this.hidden != v) {
      this._hidden = v;
      this.children.forEach((elm) => {
        if (elm instanceof BuilderElement) {
          elm.opacity = v ? 0.2 : 1;
        }
      });
    }
  }

  /**
   * Виртуальный слой не добавляет вложенности
   * @return {number}
   */
  get level() {
    return this.layer.level;
  }

  presentation(bounds) {
    const text = super.presentation(bounds);
    return text.replace('Створка', 'Виртуал');
  }

  save_coordinates(...args) {
    return super.save_coordinates(...args);
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

    // затем, создаём и перерисовываем заполнения, которые перерисуют свои раскладки
    this.glass_recalc();

    // затем - вложенное изделие
    for(const elm of this.contours) {
      elm.redraw();
    }

    // информируем мир о новых размерах нашего контура
    this.notify(this, 'contour_redrawed', this._attr._bounds);
  }

}

EditorInvisible.ContourVirtual = ContourVirtual;
