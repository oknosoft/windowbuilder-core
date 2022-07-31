exports.DocCalc_orderManager = class DocCalc_orderManager extends Object {

  constructor(owner, class_name) {
    super(owner, class_name);
    const {input_by_string} = this.metadata();
    if(!input_by_string.includes('client_of_dealer')) {
      input_by_string.push('client_of_dealer');
    }
    if(!input_by_string.includes('shipping_address')) {
      input_by_string.push('shipping_address');
    }
  }

  direct_load(force) {
    if(this._direct_loaded && !force) {
      return Promise.resolve();
    }

    const {adapters: {pouch}, utils: {moment}, ui} = this._owner.$p;
    const selector = force && force.selector ?
      force.selector :
      {
        startkey: [this.class_name, ...moment().add(1, 'month').format('YYYY-MM-DD').split('-').map(Number)],
        endkey: [this.class_name, ...moment().subtract(4, 'month').format('YYYY-MM-DD').split('-').map(Number)],
        descending: true,
        include_docs: true,
        limit: 3000,
      };

    return pouch.db(this).query('doc/by_date', selector)
      .then(({rows}) => rows.map(({doc}) => {
        doc.ref = doc._id.split('|')[1];
        delete doc._id;
        return doc;
      }))
      .then((docs) => this.load_array(docs))
      .then(() => this._direct_loaded = true)
      .catch((err) => {
        ui ? ui.dialogs.snack({message: `Чтение списка заказов: ${err.message}`}) : console.err(err);
      });
  }

  /**
   * Копирует заказ, возвращает промис с новым заказом
   * @param src {Object}
   * @param src.clone {Boolean} - если указано, создаётся копия объекта, иначе - новый объект с аналогичными свойствами
   * @return {Promise.<DocCalc_order>}
   */
  async clone(src) {
    const {utils, cat} = this._owner.$p;
    if(utils.is_guid(src)) {
      src = await this.get(src, 'promise');
    }
    if(src.load_linked_refs) {
      await src.load_linked_refs();
    }
    // создаём заказ
    const {clone, refill_props} = src;
    const {organization, partner, contract, _rev, ...others} = (src._obj || src);
    const tmp = {date: new Date(), organization, partner, contract};
    if(clone) {
      utils._mixin(tmp, (src._obj || src));
      delete tmp.clone;
      delete tmp.refill_props;
    }
    const dst = await this.create(tmp, !clone);
    dst._modified = true;
    if(!clone) {
      utils._mixin(dst._obj, others, null,
        'ref,date,number_doc,posted,_deleted,number_internal,production,planning,manager,obj_delivery_state'.split(','));
      dst.extra_fields.load((src._obj || src).extra_fields);
    }

    // заполняем продукцию и сохраненные эскизы
    const map = new Map();

    // создаём характеристики и заполняем данными исходного заказа
    const src_ref = src.ref;
    src.production.forEach((row) => {
      const prow = Object.assign({}, row._obj || row);
      if(row.characteristic.calc_order == src_ref) {
        const tmp = {calc_order: dst.ref};
        const _obj = row.characteristic._obj || row.characteristic;
        if(clone) {
          utils._mixin(tmp, _obj, null, ['calc_order', 'class_name']);
        }
        else {
          utils._mixin(tmp, _obj, null, 'ref,name,calc_order,timestamp,_rev,specification,class_name'.split(','), true);
        }
        const cx = cat.characteristics.create(tmp, false, true);
        prow.characteristic = cx.ref;

        if(cx.coordinates.count() && refill_props) {
          cx._data.refill_props = true;
        }
        map.set(row.characteristic.ref, cx);
      }
      dst.production.add(prow);
    });

    // обновляем leading_product
    dst.production.forEach((row) => {
      if(row.ordn) {
        const cx = map.get(row.ordn.ref);
        if(cx) {
          row.ordn = row.characteristic.leading_product = cx;
        }
      }
    });

    // пересчитываем
    if(!clone) {
      await dst.recalc();
    }

    return dst.save();
  }

  // сворачивает в строку вместе с характеристиками и излучает событие
  export(ref) {
    if(!ref) {
      return this.emit_async('export_err', new Error('Пустой объект. Вероятно, не выбрана строка заказа'));
    }
    this.emit_async('export_start', ref);
    return this.get(ref, 'promise')
      .then((doc) => doc.load_linked_refs())
      .then((doc) => {
        const res = doc.toJSON();
        for(const row of doc.production) {
          if(row.characteristic.calc_order == doc) {
            res.production[row.row - 1].characteristic = row.characteristic.toJSON();
          }
        }
        res.class_name = this.class_name;
        this.emit_async('export_ok', res);
        return res;
      })
      .catch((err) => this.emit_async('export_err', err));
  }

  // излучает событие - нужен для совместимости с dhtmlx
  import() {
    this.emit_async('import_start');
  }

};
