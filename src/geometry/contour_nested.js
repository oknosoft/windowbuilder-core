
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

  /**
   * Перезаполняет из типового блока
   */
  load_stamp() {

    const {cat: {templates, characteristics}, enm: {elm_types}, job_prm, EditorInvisible} = $p;
    const {base_block, refill} = templates._select_template;

    if(base_block.calc_order === templates._select_template.calc_order) {

      const {_ox} = this;

      // создаём новое пустое изделие
      const tx = characteristics.create({calc_order: _ox.calc_order}, false, true);
      // заполняем его из шаблона устанавливаем систему и параметры
      const teditor = new EditorInvisible();
      const tproject = teditor.create_scheme();
      tproject.load(tx, true)
        .then(() => {
          return tproject.load_stamp(base_block, false, !refill, true);
        })
        .then(() => {
          const {project, lbounds, content} = this;
          const contour = tproject.contours[0];
          if(!contour) {
            throw 'Нет слоёв в шаблоне';
          }
          //project._attr._silent = true;

          // подгоняем размеры под проём
          const {bottom, right} = tproject.l_dimensions;
          const dx = lbounds.width - bottom.size;
          const dy = lbounds.height - right.size;

          dx && bottom._move_points({size: lbounds.width - dx / 2, name: 'left'}, 'x');
          dy && right._move_points({size: lbounds.height - dy / 2, name: 'bottom'}, 'y');
          contour.redraw();
          dx && bottom._move_points({size: lbounds.width, name: 'right'}, 'x');
          dy && right._move_points({size: lbounds.height, name: 'top'}, 'y');

          // пересчитываем, не записываем
          contour.refresh_prm_links(true);
          tproject.zoom_fit();
          while (tproject._ch.length) {
            tproject.redraw();
          }
          tproject.save_coordinates({svg: false});

          // чистим наше
          while (content.children.length) {
            content.children[0].remove();
          }

          // перезаполняем сырыми данными временного изделия
          _ox.specification.clear();
          const map = new Map();
          const {_row} = content;
          const elm0 = _ox.coordinates.aggregate([], ['elm'], 'max') || 0;
          let elm = elm0;
          for(const trow of tx.constructions) {
            if(trow.parent === 1) {
              for(const fld in trow._obj) {
                if(fld !== 'row' && !fld.startsWith('_')) {
                  _row[fld] = trow._obj[fld];
                }
              }
            }
            else if(trow.parent > 1) {
              _ox.constructions.add(Object.assign({}, trow._obj));
            }
          }
          // заполняем соответствие номенов элементов
          for(const trow of tx.coordinates) {
            if(trow.cnstr > 1) {
              elm += 1;
              map.set(trow.elm, elm);
            }
          }

          // грузим cnn_elmnts;
          const adel = [];
          for(const trow of _ox.cnn_elmnts) {
            if(trow.elm1 > elm0 || trow.elm2 > elm0) {
              adel.push(trow);
            }
          }
          for(const trow of adel) {
            _ox.cnn_elmnts.del(trow);
          }
          for(const trow of tx.cnn_elmnts) {
            const row1 = tx.coordinates.find({elm: trow.elm1});
            const row2 = tx.coordinates.find({elm: trow.elm2});
            if(row1.cnstr > 1 && row2.cnstr > 1) {
              const proto = Object.assign({}, trow._obj);
              proto.elm1 = map.get(proto.elm1);
              proto.elm2 = map.get(proto.elm2);
              _ox.cnn_elmnts.add(proto);
            }
          }
          // грузим params;
          _ox.params.clear();
          for(const trow of tx.params) {
            const proto = Object.assign({}, trow._obj);
            if(proto.cnstr < 0) {
              proto.cnstr = -map.get(-proto.cnstr);
            }
            _ox.params.add(proto);
          }
          // грузим inserts;
          _ox.inserts.clear();
          for(const trow of tx.inserts) {
            const proto = Object.assign({}, trow._obj);
            if(proto.cnstr < 0) {
              proto.cnstr = -map.get(-proto.cnstr);
            }
            _ox.inserts.add(proto);
          }

          const {lbounds: tlbounds} = contour;
          content.load_stamp({
            contour: contour.contours[0],
            delta: [lbounds.x - tlbounds.x, lbounds.y - tlbounds.y],
            map,
          });

          // clearTimeout(tproject._attr._vis_timer);
          // tproject._attr._opened = false;
          // tproject.ox = '';
          // teditor.unload();
          // tx.unload();
          // project._attr._silent = false;

        })
        .catch((err) => {
          console.log(err);
        })

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
          templates._select_template.refill = false;
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
  save_coordinates(short, save, close) {

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

      save && this._ox
        .recalc({svg: true, silent: true})
        .then(() => !close && this.draw_visualization());
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
   * При изменении системы внешнего изделия, с внутренним почти ничего делать не надо
   */
  on_sys_changed() {
    this.profiles.forEach((elm) => elm.rays.clear('with_neighbor'));
    this.contours.forEach((contour) => contour.on_sys_changed());
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
    const {_ox} = this;
    // стандартные действия по удалению слоёв
    super.remove();
    // удаляем вложенное изделие из заказа
    const {calc_order_row: row} = _ox;
    if(row) {
      row._owner.del(row);
    }
    _ox.unload();
  }

}

ContourNested._dimlns = {
  redraw() {

  },
  clear() {

  }
};
EditorInvisible.ContourNested = ContourNested;
