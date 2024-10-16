
/*
 * Модуль объекта документа Расчет-заказ
 * Обрботчики событий after_create, after_load, before_save, after_save, value_change
 * Методы выполняются в контексте текущего объекта this = DocObj
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module doc_calc_order
 */

class FakeLenAngl {

  constructor({len, inset}) {
    this.len = len;
    this.origin = inset;
    this.alp1 = 0;
    this.alp2 = 0;
    this.angle = 0;
  }

  get cnstr() {
    return 0;
  }

}

class FakeElm {

  constructor(row_spec) {
    this.row_spec = row_spec;
  }

  get elm() {
    return 0;
  }

  get angle_hor() {
    return 0;
  }

  get _row() {
    return this;
  }

  get clr() {
    const {row_spec} = this;
    return row_spec instanceof $p.DocCalc_orderProductionRow ? row_spec.characteristic.clr : row_spec.clr;
  }

  get len() {
    return this.row_spec.len;
  }

  get height() {
    const {height, width} = this.row_spec;
    return height === undefined ? width : height;
  }

  get depth() {
    return this.row_spec.depth || 0;
  }

  get s() {
    return this.row_spec.s;
  }

  get perimeter() {
    const {len, height, width} = this.row_spec;
    return [
      {len, angle: 0, angle_next: 90},
      {len: height === undefined ? width : height, angle: 90, angle_next: 90},
      {len, angle: 180, angle_next: 90},
      {len: height === undefined ? width : height, angle: 270, angle_next: 90},      
    ];
  }

  bounds_inner(size = 0) {
    const {len, height} = this;
    return new paper.Rectangle({
      from: [0, 0],
      to: [len - 2 * size, height - 2 * size]
    });
  }

  get x1() {
    return 0;
  }

  get y1() {
    return 0;
  }

  get x2() {
    return this.height;
  }

  get y2() {
    return this.len;
  }

  get ox() {
    const {project, row_spec} = this;
    return project ? project.ox : row_spec._owner._owner;
  }

}

// свойства и методы объекта
$p.DocCalc_order = class DocCalc_order extends $p.DocCalc_order {

  // подписки на события

  // после создания надо заполнить реквизиты по умолчанию: контрагент, организация, договор
  after_create(user) {

    const {enm, cat, job_prm, DocCalc_order} = $p;
    let current_user;
    if(job_prm.is_node) {
      if(user) {
        current_user = user;
      }
      else {
        return Promise.resolve(this);
      }
    }
    else {
      current_user = this.manager;
    }

    if(!current_user || current_user.empty()) {
      current_user = $p.current_user;
    }
    if(!current_user || current_user.empty()) {
      return Promise.resolve(this);
    }

    const {acl_objs} = current_user;

    //Менеджер
    this.manager = current_user;

    //Организация
    acl_objs.find_rows({by_default: true, type: cat.organizations.class_name}, (row) => {
      this.organization = row.acl_obj;
      return false;
    });

    //Подразделение
    DocCalc_order.set_department.call(this);

    //Контрагент
    acl_objs.find_rows({by_default: true, type: cat.partners.class_name}, (row) => {
      this.partner = row.acl_obj;
      return false;
    });

    //Склад
    acl_objs.find_rows({by_default: true, type: cat.stores.class_name}, (row) => {
      this.warehouse = row.acl_obj;
      return false;
    });

    //Договор
    this.contract = cat.contracts.by_partner_and_org(this.partner, this.organization);

    //СостояниеТранспорта
    this.obj_delivery_state = enm.obj_delivery_states.Черновик;

    //Номер документа
    return this.number_doc ? Promise.resolve(this) : this.new_number_doc();

  }

  // перед записью надо присвоить номер для нового и рассчитать итоги
  before_save(attr) {

    const {ui, utils, adapters: {pouch}, wsql, job_prm, md, cat, enm: {
      obj_delivery_states: {Отклонен, Отозван, Черновик, Шаблон, Подтвержден, Отправлен},
      elm_types: {ОшибкаКритическая, ОшибкаИнфо},
    }} = $p;
    const  {blank, moment} = utils;

    //Для шаблонов, отклоненных и отозванных проверки выполнять не будем, чтобы возвращалось всегда true
    //при этом, просто сразу вернуть true не можем, т.к. надо часть кода выполнить - например, сумму документа пересчитать
    const {obj_delivery_state, _obj, _manager, class_name, category, rounding, timestamp} = this;
    const must_be_saved = ![Подтвержден, Отправлен].includes(obj_delivery_state);

    // если установлен признак проведения, проверим состояние транспорта
    if(this.posted) {
      if([Отклонен, Отозван, Шаблон].includes(obj_delivery_state)) {
        ui?.dialogs?.alert({
          text: 'Нельзя провести заказ со статусом<br/>"Отклонён", "Отозван" или "Шаблон"',
          title: this.presentation
        });
        return false;
      }
      else if(obj_delivery_state != Подтвержден) {
        this.obj_delivery_state = Подтвержден;
      }
    }
    else if(obj_delivery_state == Подтвержден) {
      this.obj_delivery_state = Отправлен;
    }

    // проверим заполненность подразделения
    if(obj_delivery_state == Шаблон) {
      this.department = blank.guid;
      this.partner = blank.guid;
    }
    else {
      if(this.department.empty()) {
        ui?.dialogs?.alert({
          text: 'Не заполнен реквизит "офис продаж" (подразделение)',
          title: this.presentation
        });
        return false || must_be_saved;
      }
      if(this.partner.empty()) {
        ui?.dialogs?.alert({
          text: 'Не указан контрагент (дилер)',
          title: this.presentation
        });
        return false || must_be_saved;
      }

      const err_prices = this.check_prices();
      if(err_prices) {
        ui?.dialogs?.alert({
          title: 'Ошибки в заказе',
          text: `Пустая цена ${err_prices.nom.toString()}<br/>Обратитесь к куратору номенклатуры`,
        });
        if (!must_be_saved) {
          if(obj_delivery_state == Отправлен) {
            this.obj_delivery_state = Черновик;
          }
          return false;
        }
      }
    }

    // рассчитаем итоговые суммы документа и проверим наличие обычных и критических ошибок
    let doc_amount = 0, internal = 0;
    const errors = this._data.errors = new Map();
    if(!job_prm.debug) {
      this.production.forEach(({amount, amount_internal, characteristic}) => {
        doc_amount += amount;
        internal += amount_internal;
        characteristic.specification.forEach(({nom, elm}) => {
          if([ОшибкаКритическая, ОшибкаИнфо].includes(nom.elm_type)) {
            if(!errors.has(characteristic)){
              errors.set(characteristic, new Map());
            }
            if(!errors.has(nom.elm_type)){
              errors.set(nom.elm_type, new Set());
            }
            // накапливаем ошибки в разрезе критичности и в разрезе продукций - отдельные массивы
            if(!errors.get(characteristic).has(nom)){
              errors.get(characteristic).set(nom, new Set());
            }
            errors.get(characteristic).get(nom).add(elm);
            errors.get(nom.elm_type).add(nom);
          }
        });
      });
    }

    this.doc_amount = doc_amount.round(rounding);
    this.amount_internal = internal.round(rounding);
    this.amount_operation = this.doc_currency.to_currency(doc_amount, this.price_date).round(rounding);

    if (errors.size) {
      let critical, text = '';
      errors.forEach((errors, characteristic) => {
        if (characteristic instanceof $p.CatCharacteristics) {
          text += `<b>${characteristic.name}:</b><br/>`;
          errors.forEach((elms, nom) => {
            text += `${nom.name} - элементы:${Array.from(elms)}<br/>`;
            if(nom.elm_type == ОшибкаКритическая) {
              critical = true;
            }
          });
        }
      });

      if (critical && !must_be_saved) {
        if(obj_delivery_state == Отправлен) {
          this.obj_delivery_state = Черновик;
        }
        throw new Error(text);
      }
      else {
        ui?.dialogs?.alert({
          title: 'Ошибки в заказе',
          text,
        });
      }
    }

    // фильтр по статусу
    if(obj_delivery_state == Шаблон) {
      _obj.state = 'template';
      // Шаблоны имеют дополнительное свойство, в котором можно задать доступные системы
      const permitted_sys = $p.cch.properties.predefined('permitted_sys');
      if(permitted_sys) {
        if(!this.extra_fields.find({property: permitted_sys})) {
          this.extra_fields.add({property: permitted_sys});
        }
      }
    }
    else if(category == 'service') {
      _obj.state = 'service';
    }
    else if(category == 'complaints') {
      _obj.state = 'complaints';
    }
    else if(obj_delivery_state == Отправлен) {
      _obj.state = 'sent';
    }
    else if(obj_delivery_state == Отклонен) {
      _obj.state = 'declined';
    }
    else if(obj_delivery_state == Подтвержден) {
      _obj.state = 'confirmed';
    }
    else if(obj_delivery_state == 'Архив') {
      _obj.state = 'zarchive';
    }
    else {
      _obj.state = 'draft';
    }

    // проверка заполненности полей теперь вызывает runtime-error
    this.check_mandatory();

    // массив сырых данных изменённых характеристик
    let sobjs = this.product_rows(true, attr);

    // если изменился hash заказа, добавим его в sobjs
    if(this._modified || this.is_new()) {
      const hash = this._hash();
      if(timestamp && timestamp.hash === hash) {
        this._modified = false;
      }
      else {
        const tmp = Object.assign({_id: `${class_name}|${_obj.ref}`, class_name}, _obj);
        delete tmp.ref;
        tmp.timestamp = {
          moment: moment().format('YYYY-MM-DDTHH:mm:ss ZZ'),
          user: wsql.get_user_param('user_name'),
          hash,
        };
        if (this._attachments) {
          tmp._attachments = this._attachments;
        }
        if(_manager.build_search) {
          _manager.build_search(tmp, this);
        }
        else {
          tmp.search = ((_obj.number_doc || '') + (_obj.note ? ' ' + _obj.note : '')).toLowerCase();
        }
        sobjs.push(tmp);
      }
    }
    sobjs = utils._clone(sobjs, true);

    const db = attr?.db || (obj_delivery_state == Шаблон ?  pouch.remote.ram : pouch.db(_manager));

    // пометим на удаление неиспользуемые характеристики
    // этот кусок не влияет на возвращаемое before_save значение и выполняется асинхронно
    const unused = () => db.query('linked', {startkey: [this.ref, 'cat.characteristics'], endkey: [this.ref, 'cat.characteristics\u0fff']})
      .then(({rows}) => {
        if(!rows.length) {
          return 0;
        }
        const keys = [];
        for (const {id} of rows) {
          const ref = id.substring(20);
          if(this.production.find({characteristic: ref})) {
            continue;
          }
          keys.push(id);
        }
        const  timestamp = {
          moment: utils.moment().format('YYYY-MM-DDTHH:mm:ss ZZ'), 
          user: wsql.get_user_param('user_name')
        };
        return db.allDocs({keys, limit: keys.length})
          .then(({rows}) => {
            keys.length = 0;
            for(const {doc, key, error, value} of rows) {
              if(error || value.deleted) {
                continue;
              }
              keys.push({_id: key, _rev: value.rev, _deleted: true, timestamp});
            }
            return db.bulkDocs(keys)
              .then(() => keys.length);
          })
      })
      .then((res) => {
        res && _manager.emit_async('svgs', this);
        // null из before_save, прерывает стандартную обработку
        return null;
      })
      .catch((err) => null);

    const save_error = (reason, obj) => {
      const note = `Ошибка при записи ${this.presentation}, ${reason}`
      $p.record_log({
        class: 'save_error',
        obj,
        note,
      });
      throw new Error(note);
    };

    const bulk = () => {
      const _id = `${class_name}|${_obj.ref}`;
      // обычные заказы пишем честно - с текущими версиями, версии шаблонов не учитываем
      const rev = Promise.resolve().then(() => {
        if(obj_delivery_state == Шаблон) {
          return db.allDocs({keys: sobjs.map(({_id}) => _id)})
            .then(({rows}) => {
              for(const doc of rows) {
                if(doc.value && doc.value.rev) {
                  sobjs.some((o) => {
                    if(o._id === doc.id) {
                      o._rev = doc.value.rev;
                      return true;
                    }
                  });
                }
              }
            });
        }
        else {
          if(!this.is_new() && !_obj._rev) {
            return db.get(_id)
              .then(({_rev}) => sobjs.some((o) => {
                if(o._id === _id) {
                  o._rev = _rev;
                  return true;
                }
              }));
          }
        }
      })
        .catch(() => null);

      return rev.then(() => db.bulkDocs(sobjs));
    };
    let fin = Promise.resolve();

    return !sobjs.length ? unused() : bulk()
      .then((bres) => {
        // освежаем ревизии, проверяем успешность записи и вызываем after_save
        for(const row of bres) {
          const [cname, ref] = row.id.split('|');
          const mgr = md.mgr_by_class_name(cname);
          const o = mgr.get(ref, true);
          if(row.ok) {
            if(mgr) {
              if(o) {
                const {_data, _obj} = o;
                _obj._rev = row.rev;
                o.after_save();
                _data._modified = false;
                _data._saving = 0;
                _data._saving_trans = false;
                fin = fin.then(() => mgr.emit_promise('after_save', o));
              }
            }
          }
          else {
            const err = new Error(row.error === 'conflict' ?
              'вероятно, объект изменён другим пользователем, перечитайте заказ и продукции с сервера' :
              `${row.reason} ${o && o !== this ? o.presentation : ''} повторите попытку записи через минуту`);
            err.obj = {
              docs: sobjs.map(v => ({id: v._id, rev: v._rev, timestamp: v.timestamp})),
              bres,
            };
            throw err;
          }
        }
        // null из before_save, прерывает стандартную обработку
        return fin.then(unused);
      })
      .catch((err) => {
        if(err.obj) {
          save_error(err.message, err.obj);
        }
        else {
          save_error(`${err.message} повторите попытку записи через минуту`);
        }
      });
  }

  // шаблоны читаем из ram
  load(attr = {}) {
    if(this.obj_delivery_state == 'Шаблон') {
      attr.db = this._manager.adapter.db({cachable: 'ram'});
    }
    return super.load(attr);
  }

  // шаблоны сохраняем в базу ram
  save(post, operational, attachments, attr = {}) {
    if(this.obj_delivery_state == 'Шаблон') {
      attr.db = this._manager.adapter.db({cachable: 'ram'});
    }
    return super.save(post, operational, attachments, attr);
  }

  // проверяет заполненность цен
  check_prices() {
    const {job_prm, pricing} = $p;
    if(job_prm.pricing.skip_empty_in_spec) {
      return ;
    }
    let err;
    this.production.forEach((calc_order_row) => {
      err = pricing.check_prices({calc_order_row});
      if(err) {
        return false;
      }
    });
    return err;
  }

  // при изменении реквизита
  value_change(field, type, value) {
    if(field === 'organization') {
      this.organization = value;
      if(this.contract.organization != value) {
        this.contract = $p.cat.contracts.by_partner_and_org(this.partner, value);
        !this.constructor.prototype.hasOwnProperty('new_number_doc') && this.new_number_doc();
      }
    }
    else if(field === 'partner' && this.contract.owner != value) {
      this.contract = $p.cat.contracts.by_partner_and_org(value, this.organization);
    }
    // если изменение инициировано человеком, дополним список изменённых полей
    const ads = ['contract'];
    if(field === 'obj_delivery_state' && this.clear_templates_props) {
      ads.push('extra_fields');
      if(value != 'Шаблон') {
        this.clear_templates_props();
      }
    }
    this._manager.emit_add_fields(this, ads);

  }

  accessories(mode='create', ox) {
    const {cat: {characteristics}, job_prm: {nom}} = $p;
    const {production} = this;
    let crow = production.find({nom: nom.accessories});
    if(mode === 'clear') {
      if(crow?.characteristic && ox) {
        crow.characteristic.specification.clear({specify: ox});
      }
      if(crow?.characteristic && !crow.characteristic.empty()) {
        crow.characteristic.calc_order = this;
        return crow.characteristic;
      }
      return;
    }

    let cx = crow?.characteristic || characteristics.find({calc_order: this, owner: nom.accessories});
    if(!cx) {
      cx = characteristics.create({
        calc_order: this,
        owner: nom.accessories,
      }, false, true);
    }
    if(cx._deleted) {
      cx._obj._deleted = false;
    }
    if(!crow) {
      crow = production.add({
        nom: nom.accessories,
        characteristic: cx,
        unit: nom.accessories.storage_unit,
        qty: 1,
        quantity: 1,
      });
    }
    return cx;
  }

  // удаление строки
  del_row(row) {
    if(row instanceof $p.DocCalc_orderProductionRow) {
      const {nom, characteristic} = row;
      const {ui, job_prm} = $p;
      if(nom === job_prm.nom.accessories && characteristic.specification.count()) {
        ui?.dialogs?.alert({
          html: `Нельзя удалять пакет комплектации <i>${characteristic.prod_name(true)}</i>`,
          title: this.presentation,
        });
        return false;
      }
      if(!characteristic.empty() && !characteristic.calc_order.empty()) {
        const {production, orders, presentation, _data} = this;

        // запрет удаления подчиненной продукции
        const {leading_elm, leading_product, origin} = characteristic;
        if(!leading_product.empty() && leading_product.calc_order_row && (
          // если в изделии присутствует порождающая вставка
          leading_product.inserts.find({cnstr: -leading_elm, inset: origin}) ||
          // если это виртуальное изделие слоя
          [10, 11].includes(leading_product.constructions.find({cnstr: -leading_elm})?.kind)
        )) {
          ui?.dialogs?.alert({
            html: `Изделие <i>${characteristic.prod_name(true)}</i> не может быть удалено<br/><br/>Для удаления, пройдите в <i>${
              leading_product.prod_name(true)}</i> и отредактируйте доп. вставки и свойства слоёв`,
            title: presentation
          });
          return false;
        }
        
        const {_loading} = _data;
        _data._loading = true;
        
        // циклическое удаление ведомых при удалении основного изделия
        production.find_rows({ordn: characteristic}).forEach(({_row}) => {
          production.del(_row.row - 1);
        });
        // чистим возможные строки аксессуаров
        production.find_rows({nom: job_prm.nom.accessories}, (prow) => {
          const cx = prow.characteristic;
          if(cx.specification.find({specify: characteristic})) {
            cx.specification.clear({specify: characteristic});
            cx.weight = cx.elm_weight();
            cx.name = cx.prod_name();
          }
          if(cx.specification.count()) {
            prow.value_change('quantity', 'update', 1);
          }
          else {
            production.del(prow);
          }
        });
        orders.forEach(({invoice}) => {
          if(!invoice.empty()) {
            invoice.goods.find_rows({nom_characteristic: characteristic}).forEach(({_row}) => {
              invoice.goods.del(_row.row - 1);
            });
          }
        });
        
        _data._loading = _loading;
      }
    }
    return this;
  }


  // при удалении строки
  after_del_row(name) {
    if(name === 'production'){
      this.product_rows();
      !this._slave_recalc && this.reset_specify();
    }
    return this;
  }

  // вместе с заказом выгружаем продукцию
  unload() {
    this.production.forEach(({characteristic}) => {
      if(!characteristic.empty() && characteristic.calc_order === this) {
        characteristic.unload();
      }
    });
    return super.unload();
  }


  /**
   * Возвращает валюту документа
   */
  get doc_currency() {
    const currency = this.contract.settlements_currency;
    return currency.empty() ? $p.job_prm.pricing.main_currency : currency;
  }
  set doc_currency(v) {

  }

  /**
   * Число знаков округления
   * @type {Number}
   */
  get rounding() {
    const {pricing} = $p.job_prm;
    if(!pricing.hasOwnProperty('rounding')) {
      const parts = this.doc_currency ? this.doc_currency.parameters_russian_recipe.split(',') : [2];
      pricing.rounding = parseInt(parts[parts.length - 1]);
      if(isNaN(pricing.rounding)) {
        pricing.rounding = 2;
      }
    }
    return pricing.rounding;
  }

  /**
   * Отдел абонента текущего заказа
   * @type {CatBranches}
   */
  get branch() {
    const {manager, organization} = this;
    let branch = organization._extra('branch');
    if(!branch || branch.empty()) {
      branch = manager.branch;
    }
    return branch;
  }
  set branch(v) {
    
  }

  /**
   * Дата прайса с учётом константы valid_days (Счет действителен N дней)
   * @type {Date}
   */
  get price_date() {
    const {utils, job_prm: {pricing}} = $p;
    const {date} = this;
    const fin = utils.moment(date).add(pricing.valid_days || 0, 'days').endOf('day').toDate();
    const curr = new Date();
    const tmp = curr > fin ? curr : new Date(date.valueOf());
    tmp.setHours(23, 59, 59, 999);
    return tmp;
  }

  /**
   * При установке договора, синхронно устанавливаем параметры НДС
   */
  get contract() {
    return this._getter('contract');
  }
  set contract(v) {
    this._setter('contract', v);
    this.vat_consider = this.contract.vat_consider;
    this.vat_included = this.contract.vat_included;
  }

  /**
   * Пересчитывает номера изделий в продукциях,
   * обновляет контрагента, состояние транспорта и подразделение
   * @param {Boolean} [save] - если указано, выполняет before_save характеристик
   * @param {Object} [attr] - дополнительные атрибуты
   * @return {Array<Object>}
   */
  product_rows(save, attr) {
    let res = [], weight = 0;
    const {production, partner, obj_delivery_state, department} = this;
    const {utils, wsql} = $p;
    const user = wsql.get_user_param('user_name');    
    this.production.forEach(({row, characteristic, quantity}) => {
      if(!characteristic.empty() && characteristic.calc_order === this) {
        if(characteristic.product !== row || characteristic._modified ||
          characteristic.partner !== partner ||
          characteristic.obj_delivery_state !== obj_delivery_state ||
          characteristic.department !== department) {

          characteristic.product = row;
          characteristic.obj_delivery_state = obj_delivery_state;
          characteristic.partner = partner;
          characteristic.department = department;

          if(!characteristic.owner.empty()) {
            if(save) {
              if(characteristic.before_save(attr) === false) {
                const {_err} = characteristic._data;
                throw new Error(_err ? _err.text : `Ошибка при записи продукции ${characteristic.prod_name()}`);
              }
              else {
                characteristic.check_mandatory();
                const hash = characteristic._hash();
                const {ref, class_name, _obj} = characteristic;
                if(characteristic.timestamp && characteristic.timestamp.hash === hash) {
                  characteristic._modified = false;
                }
                else {
                  const tmp = Object.assign({_id: `${class_name}|${ref}`, class_name}, _obj);
                  delete tmp.ref;
                  tmp.timestamp = {moment: utils.moment().format('YYYY-MM-DDTHH:mm:ss ZZ'), user, hash};
                  if (characteristic._attachments) {
                    tmp._attachments = characteristic._attachments;
                  }
                  res.push(tmp);
                }
              }
            }
            else {
              characteristic.name = characteristic.prod_name();
            }
          }
        }
        weight += (quantity * characteristic.weight).round(2);
      }
    });
    // масса изделий заказа
    this.weight = weight;
    return res;
  }

  /**
   * рассчитывает итоги диспетчеризации
   * @return {Promise}
   */
  dispatching_totals() {
    const options = {
      reduce: true,
      limit: 10000,
      group: true,
      keys: []
    };
    this.production.forEach(({nom, characteristic}) => {
      if(!characteristic.empty() && !nom.is_procedure && !nom.is_service && !nom.is_accessory) {
        options.keys.push([characteristic.ref, '305e374b-3aa9-11e6-bf30-82cf9717e145', 1, 0]);
      }
    });
    return $p.adapters.pouch.remote.doc.query('server/dispatching', options)
      .then(function ({rows}) {
        const res = {};
        rows && rows.forEach(function ({key, value}) {
          if(value.plan) {
            value.plan = moment(value.plan).format('L');
          }
          if(value.fact) {
            value.fact = moment(value.fact).format('L');
          }
          res[key[0]] = value;
        });
        return res;
      });
  }

  /**
   * Возвращает данные для печати
   */
  print_data(attr = {}) {
    const {organization, bank_account, partner, contract, manager} = this;
    const {individual_person} = manager;
    const our_bank_account = bank_account && !bank_account.empty() ? bank_account : organization.main_bank_account;
    const get_imgs = [];
    const {cat: {contact_information_kinds}, utils: {blank, blob_as_text, snake_ref}} = $p;

    // заполняем res теми данными, которые доступны синхронно
    const res = {
      АдресДоставки: this.shipping_address,
      ВалютаДокумента: this.doc_currency.presentation,
      ДатаЗаказаФорматD: moment(this.date).format('L'),
      ДатаЗаказаФорматDD: moment(this.date).format('LL'),
      ДатаТекущаяФорматD: moment().format('L'),
      ДатаТекущаяФорматDD: moment().format('LL'),
      ДоговорДатаФорматD: moment(contract.date.valueOf() == blank.date.valueOf() ? this.date : contract.date).format('L'),
      ДоговорДатаФорматDD: moment(contract.date.valueOf() == blank.date.valueOf() ? this.date : contract.date).format('LL'),
      ДоговорНомер: contract.number_doc ? contract.number_doc : this.number_doc,
      ДоговорСрокДействия: moment(contract.validity).format('L'),
      ЗаказНомер: this.number_doc,
      Контрагент: partner.presentation,
      КонтрагентОписание: partner.long_presentation,
      КонтрагентДокумент: '',
      КонтрагентКЛДолжность: '',
      КонтрагентКЛДолжностьРП: '',
      КонтрагентКЛИмя: '',
      КонтрагентКЛИмяРП: '',
      КонтрагентКЛК: '',
      КонтрагентКЛОснованиеРП: '',
      КонтрагентКЛОтчество: '',
      КонтрагентКЛОтчествоРП: '',
      КонтрагентКЛФамилия: '',
      КонтрагентКЛФамилияРП: '',
      КонтрагентИНН: partner.inn,
      КонтрагентКПП: partner.kpp,
      КонтрагентЮрФизЛицо: '',
      КратностьВзаиморасчетов: this.settlements_multiplicity,
      КурсВзаиморасчетов: this.settlements_course,
      ЛистКомплектацииГруппы: '',
      ЛистКомплектацииСтроки: '',
      Организация: organization.presentation,
      ОрганизацияГород: organization.contact_information._obj.reduce((val, row) => val || row.city, '') || 'Москва',
      ОрганизацияАдрес: organization.contact_information._obj.reduce((val, row) => {
        if(row.kind == contact_information_kinds.predefined('ЮрАдресОрганизации') && row.presentation) {
          return row.presentation;
        }
        else if(val) {
          return val;
        }
        else if(row.presentation && (
            row.kind == contact_information_kinds.predefined('ФактАдресОрганизации') ||
            row.kind == contact_information_kinds.predefined('ПочтовыйАдресОрганизации')
          )) {
          return row.presentation;
        }
      }, ''),
      ОрганизацияТелефон: organization.contact_information._obj.reduce((val, row) => {
        if(row.kind == contact_information_kinds.predefined('ТелефонОрганизации') && row.presentation) {
          return row.presentation;
        }
        else if(val) {
          return val;
        }
        else if(row.kind == contact_information_kinds.predefined('ФаксОрганизации') && row.presentation) {
          return row.presentation;
        }
      }, ''),
      ОрганизацияБанкБИК: our_bank_account.bank.id,
      ОрганизацияБанкГород: our_bank_account.bank.city,
      ОрганизацияБанкКоррСчет: our_bank_account.bank.correspondent_account,
      ОрганизацияБанкНаименование: our_bank_account.bank.name,
      ОрганизацияБанкНомерСчета: our_bank_account.account_number,
      ОрганизацияИндивидуальныйПредприниматель: organization.individual_entrepreneur.presentation,
      ОрганизацияИНН: organization.inn,
      ОрганизацияКПП: organization.kpp,
      ОрганизацияСвидетельствоДатаВыдачи: organization.certificate_date_issue,
      ОрганизацияСвидетельствоКодОргана: organization.certificate_authority_code,
      ОрганизацияСвидетельствоНаименованиеОргана: organization.certificate_authority_name,
      ОрганизацияСвидетельствоСерияНомер: organization.certificate_series_number,
      ОрганизацияЮрФизЛицо: organization.individual_legal.presentation,
      Офис: this.department.presentation,
      ПродукцияЭскизы: {},
      Проект: this.project.presentation,
      СистемыПрофилей: this.sys_profile,
      СистемыФурнитуры: this.sys_furn,
      Сотрудник: manager.presentation,
      СотрудникКомментарий: manager.note,
      СотрудникДолжность: individual_person.Должность || 'менеджер',
      СотрудникДолжностьРП: individual_person.ДолжностьРП,
      СотрудникИмя: individual_person.Имя,
      СотрудникИмяРП: individual_person.ИмяРП,
      СотрудникОснованиеРП: individual_person.ОснованиеРП,
      СотрудникОтчество: individual_person.Отчество,
      СотрудникОтчествоРП: individual_person.ОтчествоРП,
      СотрудникФамилия: individual_person.Фамилия,
      СотрудникФамилияРП: individual_person.ФамилияРП,
      СотрудникФИО: individual_person.Фамилия +
      (individual_person.Имя ? ' ' + individual_person.Имя[0].toUpperCase() + '.' : '' ) +
      (individual_person.Отчество ? ' ' + individual_person.Отчество[0].toUpperCase() + '.' : ''),
      СотрудникФИОРП: individual_person.ФамилияРП + ' ' + individual_person.ИмяРП + ' ' + individual_person.ОтчествоРП,
      СотрудникТелефон: manager.contact_information._obj.reduce((val, row) => {
        if(row.type == 'Телефон' && row.presentation) {
          return row.presentation;
        }}, ''),
      СотрудникEmail: manager.contact_information._obj.reduce((val, row) => {
        if(row.type == 'АдресЭлектроннойПочты' && row.presentation) {
          return row.presentation;
        }}, ''),
      СуммаДокумента: this.doc_amount.toFixed(2),
      СуммаДокументаПрописью: this.doc_amount.in_words(),
      СуммаДокументаБезСкидки: this.production._obj.reduce((val, row) => val + row.quantity * row.price, 0).toFixed(2),
      СуммаСкидки: this.production._obj.reduce((val, row) => val + row.discount, 0).toFixed(2),
      СуммаНДС: this.production._obj.reduce((val, row) => val + row.vat_amount, 0).toFixed(2),
      ТекстНДС: this.vat_consider ? (this.vat_included ? 'В том числе НДС 20%' : 'НДС 20% (сверху)') : 'Без НДС',
      ТелефонПоАдресуДоставки: this.phone,
      СуммаВключаетНДС: contract.vat_included,
      УчитыватьНДС: contract.vat_consider,
      ВсегоНаименований: this.production.count(),
      ВсегоИзделий: 0,
      ВсегоПлощадьИзделий: 0,
      ВсегоМасса: 0,
      ВсегоМассаЗаполнений: 0,
      Продукция: [],
      Аксессуары: [],
      Услуги: [],
      Материалы: [],
      НомерВнутр: this.number_internal,
      КлиентДилера: this.client_of_dealer,
      Комментарий: this.note,
    };

    // дополняем значениями свойств
    this.extra_fields.forEach((row) => {
      res['Свойство' + row.property.name.replace(/\s/g, '')] = String(row.value);
    });

    // TODO: дополнить датами доставки и монтажа
    res.МонтажДоставкаСамовывоз = !this.shipping_address ? 'Самовывоз' : 'Монтаж по адресу: ' + this.shipping_address;

    // получаем логотип организации
    for (let key in organization._attachments) {
      if(key.indexOf('logo') != -1) {
        get_imgs.push(organization.get_attachment(key)
          .then((blob) => {
            return blob_as_text(blob, blob.type.indexOf('svg') == -1 ? 'data_url' : '');
          })
          .then((data_url) => {
            res.ОрганизацияЛоготип = data_url;
          })
          .catch($p.record_log));
        break;
      }
    }

    return this.load_linked_refs().then(() => {

      // получаем эскизы продукций, параллельно накапливаем количество и площадь изделий
      let editor, imgs = Promise.resolve();
      const builder_props = attr.builder_props && Object.assign({}, $p.CatCharacteristics.builder_props_defaults, attr.builder_props);
      this.production.forEach((row) => {
        if(!row.characteristic.empty() && !row.nom.is_procedure && !row.nom.is_service && !row.nom.is_accessory) {

          const description = this.row_description(row);
          res.Продукция.push(description);

          res.ВсегоИзделий += row.quantity;
          res.ВсегоПлощадьИзделий += row.quantity * row.characteristic.s;
          res.ВсегоМасса += row.quantity * description.Масса;
          res.ВсегоМассаЗаполнений += row.quantity * description.МассаЗаполнений;

          // если запросили эскиз без размерных линий или с иными параметрами...
          if(builder_props) {
            if(!editor) {
              editor = new $p.EditorInvisible();
            }
            imgs = imgs.then(() => {
              return row.characteristic.draw(attr, editor)
                .then((img) => {
                  res.ПродукцияЭскизы[row.characteristic.ref] = img[snake_ref(row.characteristic.ref)].imgs.l0;
                });
            });
          }
          else {
            if(row.characteristic.svg) {
              res.ПродукцияЭскизы[row.characteristic.ref] = row.characteristic.svg;
            }
          }
        }
        else if(!row.nom.is_procedure && !row.nom.is_service && row.nom.is_accessory) {
          res.Аксессуары.push(this.row_description(row));
        }
        else if(!row.nom.is_procedure && row.nom.is_service && !row.nom.is_accessory) {
          res.Услуги.push(this.row_description(row));
        }
        else if(!row.nom.is_procedure && !row.nom.is_service && !row.nom.is_accessory) {
          res.Материалы.push(this.row_description(row));
        }
      });
      res.ВсегоПлощадьИзделий = res.ВсегоПлощадьИзделий.round(3);

      res.qrcode = () => {
        // https://github.com/soldair/node-qrcode
        return Promise.resolve().then(() => {
          if(typeof QRCode === 'object') {
            const text = `ST00012|Name=${res.Организация}|PersonalAcc=${res.ОрганизацияБанкНомерСчета}|BIC=${res.ОрганизацияБанкБИК}|PayeeINN=${res.ОрганизацияИНН}|Purpose=Заказ №${res.ЗаказНомер} от ${res.ДатаЗаказаФорматD} ${res.ТекстНДС}|KPP=${res.ОрганизацияКПП}|Sum=${res.СуммаДокумента}${res.АдресДоставки ? `|payerAddress=${res.АдресДоставки}` : ''}`;
            return QRCode.toString(text, {type: 'svg'});
          }
        });
      };

      return imgs
        .then(() => {
          editor && editor.unload();
          return Promise.all(get_imgs);
        })
        .then(() => res);

    });

  }

  /**
   * Возвращает струклуру с описанием строки продукции для печати
   */
  row_description(row) {

    if(!(row instanceof $p.DocCalc_orderProductionRow) && row.characteristic) {
      this.production.find_rows({characteristic: row.characteristic}, (prow) => {
        row = prow;
        return false;
      });
    }
    const {characteristic, nom, s, quantity, note} = row;
    let m = 0, gm = 0, skip = new Set();
    characteristic.specification.forEach(({elm, nom, totqty}) => {
      m += nom.density * totqty;
      if(elm > 0 && !skip.has(elm)) {
        if(characteristic.glasses.find({elm})) {
          gm += nom.density * totqty;
        }
        else {
          skip.add(elm);
        }
      }
    });

    const res = {
      ref: characteristic.ref,
      НомерСтроки: row.row,
      Количество: quantity,
      Ед: row.unit.name || 'шт',
      Цвет: characteristic.clr.name,
      Размеры: row.len + 'x' + row.width + ', ' + s + 'м²',
      Площадь: s,
      //Отдельно размеры, общая площадь позиции и комментарий к позиции
      Длина: row.len,
      Ширина: row.width,
      ВсегоПлощадь: s * quantity,
      Масса: m,
      ВсегоМасса: m * quantity,
      МассаЗаполнений: gm,
      ВсегоМассаЗаполнений: gm * quantity,
      Примечание: note,
      Комментарий: note,
      СистемаПрофилей: characteristic.sys.name,
      Номенклатура: nom.name_full || nom.name,
      Характеристика: characteristic.name,
      Заполнения: '',
      ЗаполненияФормулы: '',
      Фурнитура: '',
      Параметры: [],
      Цена: row.price,
      ЦенаВнутр: row.price_internal,
      СкидкаПроцент: row.discount_percent,
      СкидкаПроцентВнутр: row.discount_percent_internal,
      Скидка: row.discount.round(2),
      Сумма: row.amount.round(2),
      СуммаВнутр: row.amount_internal.round(2)
    };

    // формируем описание заполнений
    characteristic.glasses.forEach(({nom, formula}) => {
      const {name} = nom;
      if(!res.Заполнения.includes(name)) {
        if(res.Заполнения) {
          res.Заполнения += ', ';
        }
        res.Заполнения += name;
      }
      if(!res.ЗаполненияФормулы.includes(formula)) {
        if(res.ЗаполненияФормулы) {
          res.ЗаполненияФормулы += ', ';
        }
        res.ЗаполненияФормулы += formula;
      }
    });

    // наименования фурнитур
    characteristic.constructions.forEach((row) => {
      const {name} = row.furn;
      if(name && res.Фурнитура.indexOf(name) == -1) {
        if(res.Фурнитура) {
          res.Фурнитура += ', ';
        }
        res.Фурнитура += name;
      }
    });



    // параметры, помеченные к включению в описание
    const params = new Map();
    characteristic.params.forEach((row) => {
      if(row.param.include_to_description) {
        params.set(row.param, row.value);
      }
    });
    for (let [param, value] of params) {
      res.Параметры.push({
        param: param.presentation,
        value: value.presentation || value
      });
    }

    return res;
  }

  /**
   * Заполняет табчасть планирования запросом к сервису windowbuilder-planning
   */
  fill_plan() {

    // чистим не стесняясь - при записи всё равно перезаполнять
    this.planning.clear();

    // получаем url сервиса
    const {wsql, aes, adapters: {pouch}, ui, utils} = $p;
    const url = (wsql.get_user_param('windowbuilder_planning', 'string') || '/plan/') + `doc.calc_order/${this.ref}`;

    // сериализуем документ и характеристики
    const post_data = utils._clone(this._obj);
    post_data.characteristics = {};

    // получаем объекты характеристик и подклеиваем их сериализацию к post_data
    this.load_production()
      .then((prod) => {
        for (const cx of prod) {
          post_data.characteristics[cx.ref] = utils._clone(cx._obj);
        }
      })
      // выполняем запрос к сервису
      .then(() => {
        pouch.fetch(url, {method: 'POST', body: JSON.stringify(post_data)})
          .then(response => response.json())
          // заполняем табчасть
          .then(json => {
            if (json.rows) {
              this.planning.load(json.rows);
            }
            else{
              console.log(json);
            }
          })
          .catch(err => {
            ui?.dialogs?.alert({
              text: err.message,
              title: "Сервис планирования"
            });
            $p.record_log(err);
          });
      });
  }

  /**
   * Выясняет, можно ли редактировать данный объект
   */
  get is_read_only() {
    const {obj_delivery_state, posted, _data} = this;
    let {current_user, cat: {abonents}, enm} = $p;
    const {Черновик, Шаблон, Отозван, Отправлен} = enm.obj_delivery_states;
    if(!current_user) {
      current_user = this.manager;
    }

    let ro = false;
    // технолог может изменять шаблоны
    if(obj_delivery_state == Шаблон) {
      const {no_mdm} = abonents.current;
      ro = !no_mdm || !current_user.role_available('ИзменениеТехнологическойНСИ');
    }
    // ведущий менеджер может изменять проведенные
    else if(posted || _data._deleted) {
      ro = !current_user.role_available('СогласованиеРасчетовЗаказов');
    }
    else if(obj_delivery_state == Отправлен) {
      ro = !_data._saving_trans && !current_user.role_available('СогласованиеРасчетовЗаказов');
    }
    else if(!obj_delivery_state.empty()) {
      ro = obj_delivery_state != Черновик && obj_delivery_state != Отозван && !current_user.role_available('СогласованиеРасчетовЗаказов');
    }
    return ro;
  }

  /**
   * Загружает в RAM данные характеристик продукций заказа
   * @return {Promise}
   */
  load_production(forse, db) {
    const prod = [];
    const {characteristics} = $p.cat;
    this.production.forEach(({characteristic}) => {
      if(!characteristic.empty() && (forse || characteristic.is_new())) {
        prod.push(characteristic.ref);
      }
    });
    return characteristics.adapter.load_array(characteristics, prod, false, db)
      .then(() => {
        prod.length = 0;
        this.production.forEach(({nom, characteristic}) => {
          if(!characteristic.empty() && !characteristic.is_new()) {
            if(forse || (!nom.is_procedure && !nom.is_accessory) || characteristic.specification.count() || characteristic.constructions.count() || characteristic.coordinates.count()){
              prod.push(characteristic);
            }
          }
        });
        return prod;
      });
  }

  /**
   * Обработчик события _ЗаписанаХарактеристикаПостроителя_
   * @param scheme
   * @param sattr
   */
  characteristic_saved(scheme, sattr) {
    const {ox, _dp} = scheme;
    const row = ox.calc_order_row;

    if(!row || ox.calc_order != this) {
      return;
    }

    //nom,characteristic,note,quantity,unit,qty,len,width,s,first_cost,marginality,price,discount_percent,discount_percent_internal,
    //discount,amount,margin,price_internal,amount_internal,vat_rate,vat_amount,ordn,changed

    this._data._loading = true;
    row.nom = ox.owner;
    row.note = _dp.note;
    row.quantity = _dp.quantity || 1;
    row.len = ox.x;
    row.width = ox.y;
    row.s = ox.s;
    row.discount_percent = _dp.discount_percent;
    row.discount_percent_internal = _dp.discount_percent_internal;
    if(row.unit.owner != row.nom) {
      row.unit = row.nom.storage_unit;
    }
    this.reset_specify();
    this._data._loading = false;
  }

  /**
   * Создаёт строку заказа с уникальной характеристикой
   * @param [row_spec] {DpBuyers_orderProductionRow} - строка - генератор параметрика
   * @param [elm]
   * @param [len_angl]
   * @param [params]
   * @param [create]
   * @param [grid]
   * @param [cx] {CatCharacteristics}
   * @return {Promise<DocCalc_orderProductionRow>}
   */
  create_product_row({row_spec, elm, len_angl, params, create, grid, cx}) {

    const row = row_spec instanceof $p.DpBuyers_orderProductionRow && !row_spec.characteristic.empty() && row_spec.characteristic.calc_order === this ?
      row_spec.characteristic.calc_order_row :
      this.production.add({
        qty: 1,
        quantity: 1,
        discount_percent_internal: $p.wsql.get_user_param('discount_percent_internal', 'number')
      });

    if(grid) {
      this.production.sync_grid(grid);
      grid.selectRowById(row.row);
    }

    if(!create) {
      return row;
    }

    // ищем объект продукции в RAM или берём из строки заказа
    const mgr = $p.cat.characteristics;
    function fill_cx(ox) {
      if(ox._deleted){
        return;
      }
      for (let ts in mgr.metadata().tabular_sections) {
        ox[ts].clear();
      }
      ox.leading_elm = 0;
      ox.leading_product = '';
      cx = Promise.resolve(ox);
      return false;
    }
    if(!cx && !row.characteristic.empty() && !row.characteristic._deleted){
      fill_cx(row.characteristic);
    }

    // если не нашли в RAM, создаём объект продукции, но из базы не читаем и пока не записываем
    return (cx || mgr.create({
      ref: $p.utils.generate_guid(),
      calc_order: this,
      product: row.row
    }, true))
      .then((ox) => {
        // если указана строка-генератор, заполняем реквизиты
        if(row_spec instanceof $p.DpBuyers_orderProductionRow) {

          if(params) {

            // получаем набор параметров, используемых текущей вставкой
            const used_params = row_spec.inset.used_params();

            // добавляем параметр в характеристику, если используется в текущей вставке
            params.find_rows({elm: row_spec.row}, (prow) => {
              if(used_params.includes(prow.param)) {
                ox.params.add(prow, true).inset = row_spec.inset;
              }
            });
          }

          elm.project = {ox};
          elm.fake_origin = row_spec.inset;

          ox.owner = row_spec.inset.nom(elm);
          ox.origin = row_spec.inset;
          ox.x = row_spec.len;
          ox.y = row_spec.height;
          ox.z = row_spec.depth;
          ox.s = (row_spec.s || row_spec.len * row_spec.height / 1e6).round(4);
          ox.clr = row_spec.clr;
          ox.note = row_spec.note;

        }

        // устанавливаем свойства в строке заказа
        Object.assign(row._obj, {
          characteristic: ox.ref,
          nom: ox.owner.ref,
          unit: ox.owner.storage_unit.ref,
          len: ox.x,
          width: ox.y,
          s: ox.s,
          qty: (row_spec && row_spec.quantity) || 1,
          quantity: (row_spec && row_spec.quantity) || 1,
          note: ox.note,
        });

        ox.name = ox.prod_name();

        // записываем расчет, если не сделали этого ранее, чтобы не погибла ссылка на расчет в характеристике
        return this.is_new() && !$p.wsql.alasql.utils.isNode ? this.save().then(() => row) : row;
      });

  }

  /**
   * Создаёт продукции заказа по массиву строк и параметров  
   * если в dp.production заполнены уникальные характеристики - перезаполняет их, а новые не создаёт
   * @param dp {DpBuyers_order} - экземпляр обработки с заполненными табличными частями
   */
  process_add_product_list(dp) {

    let res = Promise.resolve();

    dp.production.forEach((row_dp) => {
      let row_prod;

      if(row_dp.inset.empty()) {
        row_prod = this.production.add(row_dp);
        row_prod.unit = row_prod.nom.storage_unit;
        if(!row_dp.clr.empty()) {
          // ищем цветовую характеристику
          $p.cat.characteristics.find_rows({owner: row_dp.nom}, (ox) => {
            if(ox.clr == row_dp.clr) {
              row_prod.characteristic = ox;
              return false;
            }
          });
        }
        res = res.then(() => row_prod);
      }
      else {
        // рассчитываем спецификацию по текущей вставке
        const len_angl = new FakeLenAngl(row_dp);
        const elm = new FakeElm(row_dp);
        // создаём или получаем строку заказа с уникальной харктеристикой
        res = res
          .then(() => row_dp.inset.check_prm_restrictions({elm, len_angl,
            params: dp.product_params.find_rows({elm: row_dp.elm}).map(({_row}) => _row)}))
          .then(() => this.create_product_row({row_spec: row_dp, elm, len_angl, params: dp.product_params, create: true}))
          .then((row_prod) => {
            this.accessories('clear', row_prod.characteristic);
            // рассчитываем спецификацию
            row_dp.inset.calculate_spec({elm, len_angl, ox: row_prod.characteristic});
            // сворачиваем
            row_prod.characteristic.specification.group_by('nom,clr,characteristic,len,width,s,elm,alp1,alp2,origin,dop', 'qty,totqty,totqty1');
            // помещаем характеристику в текущую строку обработки dp
            row_dp.characteristic = row_prod.characteristic;
            return row_prod;
          });
      }

      // производим дополнительную корректировку спецификации и рассчитываем цены
      res = res.then((row_prod) => {
        return $p.spec_building.specification_adjustment({
          calc_order_row: row_prod,
          spec: row_prod.characteristic.specification,
        }, true);
      });
    });

    return res;
  }

  /**
   * Пересчитывает все изделия заказа по тем же правилам, что и визуальная рисовалка
   * @param attr {Object} - параметры пересчёта
   * @param [editor] {EditorInvisible}
   * @param [restore] {EditorInvisible}
   */
  recalc(attr = {}, editor, restore) {

    // при необходимости, создаём редактор
    const {EditorInvisible, CatInserts} = $p;
    const remove = !editor;
    if(remove) {
      editor = new EditorInvisible();
    }
    let {project} = editor;
    if(!(project instanceof EditorInvisible.Scheme)) {
      project = editor.create_scheme();
    }
    let tmp = Promise.resolve();

    // если передали ссылку dp, меняем при пересчете свойства в соответствии с полями обработки
    const {dp} = attr;

    // получаем массив продукций в озу
    return this.load_linked_refs()
      .then(() => {
        // чистим аксессуары
        const accessories = this.accessories('clear');
        if(accessories) {
          accessories.specification.clear();
        }
        // бежим по табчасти, если продукция, пересчитываем в рисовалке, если материал или paramrtric - пересчитываем строку
        this.production.forEach((row) => {
          const {characteristic: cx} = row;
          if(cx.empty() || cx.calc_order !== this) {
            // это материал
            row.value_change('quantity', '', row.quantity);
          }
          else if(cx.leading_product.calc_order === this) {
            // это виртуальное изделие TODO: некоторые из таких, надо пересчитывать
            return;
          }
          else if(cx.coordinates.count()) {
            // это изделие рисовалки
            tmp = tmp.then(() => {
              return project.load(cx, true, this)                                                     // читаем изделие в невизуальную рисовалку
                .then(() => cx.apply_props(project, dp).save_coordinates({svg: false, save: false}))  // выполняем пересчет спецификации
                .then(() => this.characteristic_saved(project));                                      // выполняем пересчет строки заказа
            });
          }
          else {
            const {origin} = cx;
            if(origin instanceof CatInserts && !origin.empty() && !origin.slave) {
              // это paramrtric
              cx.specification.clear();
              // выполняем пересчет
              cx.apply_props(origin, dp).calculate_spec({
                elm: new FakeElm(row),
                len_angl: new FakeLenAngl({len: row.len, inset: origin}),
                ox: cx
              });
              row.value_change('quantity', '', row.quantity);
            }
            else {
              row.value_change('quantity', '', row.quantity);
            }
          }
        });
        return tmp;
      })
      .then(() => {
        project.ox = '';
        return remove ? editor.unload() : project.unload();
      })
      .then(() => {
        restore?.activate();
        return attr.save ? this.save(undefined, undefined, undefined, attr) : this;
      })
      .catch((err) => {
        restore?.activate();
        throw err;
      });
  }

  /**
   * Рисует изделия или фрагмент изделий заказа в Buffer в соответствии с параметрами attr
   * @param attr
   * @param editor
   */
  draw(attr = {}, editor) {

    // при необходимости, создаём редактор
    const {EditorInvisible} = $p;
    const remove = !editor;
    if(remove) {
      editor = new EditorInvisible();
    }
    let {project} = editor;
    if(!(project instanceof EditorInvisible.Scheme)) {
      project = editor.create_scheme();
    }

    attr.res = {number_doc: this.number_doc};

    let tmp = Promise.resolve();

    // получаем массив продукций в озу
    return this.load_production()
      .then((prod) => {
        for(let ox of prod){
          if(ox.coordinates.count()) {
            tmp = tmp.then(() => ox.draw(attr, editor));
          }
        }
        return tmp.then((res) => {
          project.ox = '';
          if(remove) {
            editor.unload();
          }
          else {
            project.remove();
          }
          return res;
        });
      });

  }

  /**
   * Загружает продукции шаблона из mdm-cache
   * @return {Promise}
   */
  load_templates() {
    if(this._data._templates_loaded) {
      return Promise.resolve();
    }
    if(this._data._templates_loading) {
      return this._data._templates_loading;
    }
    else if(this.obj_delivery_state == 'Шаблон') {
      const {adapters, job_prm, cat} = $p;
      this._data._templates_loading = adapters.pouch.fetch(`/couchdb/mdm/${job_prm.session_zone}/templates/${this.ref}`)
        .then((res) => res.json())
        .then(({rows}) => {
          if(rows) {
            cat.characteristics.load_array(rows);
            this._data._templates_loaded = true;
            delete this._data._templates_loading;
            return this;
          }
          throw null;
        })
        .catch((err) => {
          err && console.error(err);
          delete this._data._templates_loading;
          return this.load_production()
            .then(() => {
              this._data._templates_loaded = true;
              return this;
            })
        })
        .then(() => this._manager.emit('templates_loaded', this));
      return this._data._templates_loading;
    }
    return this.load_production()
      .then((prod) => {
        const blocks = [];
        for(const {base_block} of prod) {
          if(!base_block.empty() && base_block.is_new() && !blocks.includes(base_block.ref)) {
            blocks.push(base_block.ref);
          }
        }
        if(blocks.length) {
          const {adapters: {pouch}, cat: {characteristics}} = $p;
          return pouch.load_array(characteristics, blocks, false, pouch.remote.ram)
            .then(() => prod)
            .catch(() => prod);
        }
        return prod;
      });
  }

  /**
   * Удаляет распределение обрези из спецификаций всех изделий заказа
   */
  reset_specify(cond) {
    this._slave_recalc = true;
    const rm = [];
    for(const row of this.production) {
      if(row.changed === 3) {
        if(!cond || (cond === '2D' && row.s) || (cond === '1D' && !row.s)) {
          rm.push(row);
        }
      }
    }
    for(const row of rm) {
      this.production.del(row);
    }
    for(const row of this.production) {
      const {characteristic} = row;
      if (characteristic.calc_order === this) {
        if(!cond) {
          characteristic.specification.clear({dop: -3});
        }
        else if(cond === '2D') {
          characteristic.specification.clear({dop: -3, s: {ne: 0}});
        }
        else {
          characteristic.specification.clear({dop: -3, s: 0});
        }
        row.value_change('quantity', 'update', row.quantity);
      }
    }
    this._slave_recalc = false;
  }

  /**
   * @summary Сырая потребность в материалах
   * @param {DocCalc_orderProductionRow} [prow] - если указано, получаем потребность единственной строки, а не всего заказа
   * @returns {DpBuyers_order}
   */
  aggregate_specification(prow) {
    const dp = $p.dp.buyers_order.create();
    if(prow) {
      const {characteristic, quantity} = prow;
      for(const srow of characteristic.specification) {
        if(!srow.totqty1 || srow.nom.is_service || srow.nom.is_procedure) {
          continue;
        }
        const row = dp.specification.add({
          nom: srow.nom,
          nom_characteristic: srow.characteristic,
          clr: srow.clr,
          quantity: quantity * srow.totqty1,
        });
      }
    }
    else {
      // заполняем табчасть потребностью всех продукций заказа
      for(const {nom, characteristic, quantity} of this.production) {
        if(characteristic.calc_order === this) {
          for(const srow of characteristic.specification) {
            if(!srow.totqty1 || srow.nom.is_service || srow.nom.is_procedure) {
              continue;
            }
            const row = dp.specification.add({
              nom: srow.nom,
              nom_characteristic: srow.characteristic,
              clr: srow.clr,
              quantity: quantity * srow.totqty1,
            });
          }
        }
        else {
          if(!quantity || nom.is_service || nom.is_procedure) {
            continue;
          }
          const row = dp.specification.add({nom, nom_characteristic: characteristic, clr: characteristic.clr, quantity});
        }
      }
    }
    // сворачиваем
    dp.specification.group_by(['nom', 'nom_characteristic', 'clr'], ['quantity']);
    return dp;
  }

  /**
   * Устанавливает подразделение по умолчанию
   */
  static set_department() {
    const {wsql, cat} = $p
    const department = wsql.get_user_param('current_department');
    if(department) {
      this.department = department;
    }
    if(this.department.empty() || this.department.is_new()) {
      let {manager} = this;
      if(!manager || manager.empty()) {
        manager = $p.current_user;
      }
      manager?.acl_objs && manager.acl_objs.find_rows({by_default: true, type: cat.divisions.class_name}, (row) => {
        if(this.department != row.acl_obj) {
          this.department = row.acl_obj;
        }
        return false;
      });
    }
  }

};

$p.DocCalc_order.FakeElm = FakeElm;

$p.DocCalc_order.FakeLenAngl = FakeLenAngl;

// свойства и методы табчасти продукции
$p.DocCalc_orderProductionRow = class DocCalc_orderProductionRow extends $p.DocCalc_orderProductionRow {

  // при изменении реквизита
  value_change(field, type, value, no_extra_charge) {

    let {_obj, _owner, nom, characteristic, unit} = this;
    let recalc;
    const {rounding, _slave_recalc, manager, price_date: date} = _owner._owner;
    const {DocCalc_orderProductionRow, DocPurchase_order, utils, wsql, pricing, job_prm, enm} = $p;
    const rfield = DocCalc_orderProductionRow.rfields[field];
    let reset_specify;
    if(field === 'quantity' && !_slave_recalc) {
      reset_specify = true;
      characteristic.specification.clear({dop: -3});
    }

    if(rfield) {

      _obj[field] = rfield === 'n' ? parseFloat(value || 0) : '' + value;

      nom = this.nom;
      characteristic = this.characteristic;

      // проверим владельца характеристики
      if(!characteristic.empty()) {
        if(!characteristic.calc_order.empty() && characteristic.owner != nom) {
          characteristic.owner = nom;
        }
        else if(characteristic.owner != nom) {
          _obj.characteristic = utils.blank.guid;
          characteristic = this.characteristic;
        }
      }

      // проверим единицу измерения
      if(unit.owner != nom) {
        _obj.unit = nom.storage_unit.ref;
      }
      
      // количество по умолчанию
      if(field === 'nom' && !this.quantity) {
        _obj.quantity = 1;
      }

      // если это следящая вставка, рассчитаем спецификацию
      const {origin} = characteristic;
      if(origin && !origin.empty() && origin.slave) {
        characteristic.specification.clear();
        characteristic.x = this.len;
        characteristic.y = this.width;
        characteristic.s = (this.s || this.len * this.width / 1e6).round(4);
        const len_angl = new FakeLenAngl({len: this.len, inset: origin});
        const elm = new FakeElm(this);
        origin.calculate_spec({elm, len_angl, ox: characteristic});
        recalc = true;
      }

      // рассчитаем цены
      const fake_prm = {
        calc_order_row: this,
        spec: characteristic.specification,
        date,
      };
      const {price, price_internal} = _obj;
      pricing.price_type(fake_prm);
      if(origin instanceof DocPurchase_order) {
        fake_prm.first_cost = _obj.first_cost;
      }
      else {
        pricing.calc_first_cost(fake_prm);
      }
      pricing.calc_amount(fake_prm);
      if(price && !_obj.price) {
        _obj.price = price;
        _obj.price_internal = price_internal;
        recalc = true;
      }
    }

    if(DocCalc_orderProductionRow.pfields.includes(field) || recalc) {

      if(!recalc) {
        _obj[field] = parseFloat(value || 0);
      }

      isNaN(_obj.price) && (_obj.price = 0);
      isNaN(_obj.extra_charge_external) && (_obj.extra_charge_external = 0);
      isNaN(_obj.price_internal) && (_obj.price_internal = 0);
      isNaN(_obj.discount_percent) && (_obj.discount_percent = 0);
      isNaN(_obj.discount_percent_internal) && (_obj.discount_percent_internal = 0);

      _obj.amount = (_obj.price * ((100 - _obj.discount_percent) / 100) * _obj.quantity).round(rounding);

      // если есть внешняя цена дилера, получим текущую дилерскую наценку
      if(!no_extra_charge) {
        const prm = {calc_order_row: this};
        let extra_charge = 0;
        if(job_prm.pricing.use_internal !== false) {
          extra_charge = wsql.get_user_param('surcharge_internal', 'number');

          // если пересчет выполняется менеджером, используем наценку по умолчанию
          if(!manager.partners_uids.length || !extra_charge) {
            pricing.price_type(prm);
            extra_charge = prm.price_type.extra_charge_external;
          }
          // если есть наценка в строке применим ее
          if (_obj.extra_charge_external !== 0) {
            extra_charge = _obj.extra_charge_external;
          }
        }
        
        if(field != 'price_internal' && _obj.price) {
          _obj.price_internal = (_obj.price * (100 - _obj.discount_percent) / 100 * (100 + extra_charge) / 100).round(rounding);
        }
      }

      _obj.amount_internal = (_obj.price_internal * ((100 - _obj.discount_percent_internal) / 100) * _obj.quantity).round(rounding);

      // ставка и сумма НДС
      const doc = _owner._owner;
      if(doc.vat_consider) {
        const {НДС18, НДС18_118, НДС10, НДС10_110, НДС20, НДС20_120, НДС0, БезНДС} = enm.vat_rates;
        _obj.vat_rate = (nom.vat_rate.empty() ? НДС18 : nom.vat_rate).ref;
        switch (this.vat_rate) {
        case НДС18:
        case НДС18_118:
          _obj.vat_amount = (_obj.amount * 18 / 118).round(2);
          break;
        case НДС10:
        case НДС10_110:
          _obj.vat_amount = (_obj.amount * 10 / 110).round(2);
          break;
        case НДС20:
        case НДС20_120:
          _obj.vat_amount = (_obj.amount * 20 / 120).round(2);
          break;
        case НДС0:
        case БезНДС:
        case '_':
        case '':
          _obj.vat_amount = 0;
          break;
        }
        if(!doc.vat_included) {
          _obj.amount = (_obj.amount + _obj.vat_amount).round(2);
        }
      }
      else {
        _obj.vat_rate = '';
        _obj.vat_amount = 0;
      }


      // пересчитываем спецификации и цены в следящих вставках
      if(!_slave_recalc){
        _owner._owner._slave_recalc = true;
        _owner.forEach((row) => {
          if(row === this) return;
          if(reset_specify) {
            row.characteristic.specification.clear({dop: -3});
          }
          const {origin} = row.characteristic;
          if(reset_specify || (origin && !origin.empty() && origin.slave)) {
            row.value_change('quantity', 'update', row.quantity, no_extra_charge);
          }
        });
        _owner._owner._slave_recalc = false;
      }

      // TODO: учесть валюту документа, которая может отличаться от валюты упр. учета и решить вопрос с amount_operation

      // подчиненные строки
      if(field === 'quantity' && !characteristic.empty() && !characteristic.calc_order.empty()) {
        this._owner.find_rows({ordn: characteristic}, (row) => {
          row.value_change('quantity', type, _obj.quantity, no_extra_charge);
        });
      }
      const amount = _owner.aggregate([], ['amount', 'amount_internal']);
      amount.doc_amount = amount.amount.round(rounding);
      amount.amount_internal = amount.amount_internal.round(rounding);
      delete amount.amount;
      Object.assign(doc, amount);
      doc._manager.emit_async('update', doc, amount);

      return false;
    }
  }

};

$p.DocCalc_orderProductionRow.rfields = {
  nom: 's',
  characteristic: 's',
  quantity: 'n',
  len: 'n',
  width: 'n',
  s: 'n',
};

$p.DocCalc_orderProductionRow.pfields = 'price,price_internal,quantity,discount_percent_internal,extra_charge_external';
