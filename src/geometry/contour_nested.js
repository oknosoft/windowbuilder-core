
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

    // добавляем в проект элементы вложенного изделия
    const {project, _ox} = this;
    const row = _ox.constructions.find({parent: 1});
    Contour.create({project, row, parent: this, ox: _ox});
  }

  presentation(bounds) {
    const text = super.presentation(bounds);
    return text.replace('Створка', 'Вложение');
  }

  /**
   * Продукция текущего слоя
   * Для вложенных, отличается от изделия проекта
   * @return {CatCharacteristics}
   */
  get _ox() {
    const {_attr} = this;
    if(!_attr._ox) {
      const {cat: {templates}, job_prm, utils} = $p;
      const {project, cnstr} = this;
      const {ox} = project;
      for(const {characteristic} of ox.calc_order.production) {
        if(characteristic.leading_product === ox && characteristic.leading_elm === -cnstr) {
          _attr._ox = characteristic;
          break;
        }
      }
      if(!_attr._ox) {
        _attr._ox = ox._manager.create({
          ref: utils.generate_guid(),
          calc_order: ox.calc_order,
          leading_product: ox,
          leading_elm: -cnstr,
          constructions: [
            {kind: 3, cnstr: 1},
            {parent: 1, cnstr: 2},
          ],
        }, false, true);
        _attr._ox._data._is_new = false;
        ox.calc_order.create_product_row({create: true, cx: Promise.resolve(_attr._ox)})
          .then((row) => {
            _attr._ox.product = row.row;
          });

        // после первичного заполнения, попробуем натянуть на вложенное изделие типовой блок
        this.subscribe_load_stamp(_attr._ox);
        const {sys, params} = templates._select_template;
        sys.refill_prm(_attr._ox, 0, 1, this, params);
      }
    }
    return _attr._ox;
  }

  get hidden() {
    return !this.visible;
  }
  set hidden(v) {
    this.visible = !v;
  }

  get content() {
    return this.contours[0];
  }

  get l_dimensions() {
    return ContourNested._dimlns;
  }

  get lbounds() {
    const parent = new paper.Group({insert: false});
    for (const {generatrix} of this.profiles) {
      parent.addChild(generatrix.clone({insert: false}));
    }
    return parent.bounds;
  }

  /**
   * Перезаполняет из типового блока
   */
  load_stamp() {

    const {cat: {templates, characteristics}, job_prm, EditorInvisible} = $p;
    const {base_block} = templates._select_template;

    if(base_block.calc_order === templates._select_template.calc_order) {

      const {_attr, project, _ox, lbounds} = this;

      // создаём новое пустое изделие
      const tx = characteristics.create({calc_order: _ox.calc_order}, false, true);
      // заполняем его из шаблона устанавливаем систему и параметры
      const teditor = new EditorInvisible();
      const tproject = teditor.create_scheme();
      tproject.load(tx, true)
        .then(() => {
          return tproject.load_stamp(base_block, false, true);
        })
        .then((d) => {
          console.log(d);
          // подгоняем размеры под проём
          const {bottom, right} = tproject.l_dimensions;
          const dx = lbounds.width - bottom.size;
          const dy = lbounds.height - right.size;
          // tproject.l_dimensions.bottom._move_points({size: 1400, name: 'right'}, 'x')

          // пересчитываем, не записываем
          // чистим наше
          // перезаполняем данными временного изделия
        })
        .catch((err) => {
          console.log(err);
        })

      if(base_block.constructions.count() > 1) {
        _attr._ox.constructions.del({parent: 1});
        base_block.constructions.find_rows({parent: 1}, (brow) => {

        });
      }
    }

  }

  /**
   * Планирует перезаполнение из типового блока после создания слоя
   */
  subscribe_load_stamp(_ox) {
    const {cat: {templates}, job_prm} = $p;
    const {templates_nested} = job_prm.builder;
    if(templates_nested && templates_nested.includes(templates._select_template.calc_order)) {
      const {project} = this;
      const fin = (tx, fields) => {
        if(tx === _ox && fields.constructions) {
          project._scope.eve.off('rows', fin);
          this.load_stamp();
        }
      }
      project._scope.eve.on('rows', fin);
    }
  }

  /**
   * Вычисляемые поля в таблицах конструкций и координат
   * @method save_coordinates
   * @param short {Boolean} - короткий вариант - только координаты контура
   */
  save_coordinates(short, save) {

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
      content.save_coordinates(short);

      save && this._ox.recalc({svg: true, silent: true});
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

ContourNested._dimlns = {
  redraw() {

  },
  clear() {

  }
};
EditorInvisible.ContourNested = ContourNested;
