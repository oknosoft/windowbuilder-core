
/**
 * ### Модуль Ценообразование
 * Аналог УПзП-шного __ЦенообразованиеСервер__
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 * @module  glob_pricing
 */

/**
 * ### Ценообразование
 *
 * @class Pricing
 * @param $p {MetaEngine} - контекст
 * @static
 */
class Pricing {

  constructor({md, adapters, job_prm}) {

    // подписываемся на событие после загрузки из pouchdb-ram и готовности предопределенных
    md.once('predefined_elmnts_inited', () => {
      const {pouch} = adapters;
      if(pouch.props.user_node || job_prm.use_ram) {
        this.load_prices();
      }
    });

  }

  // грузит в ram цены номенклатуры
  load_prices() {

    const {adapters: {pouch}, job_prm} = $p;
    if(job_prm.use_ram === false) {
      return Promise.resolve();
    }

    // сначала, пытаемся из local
    return this.by_range({})
      .then(() => {
        const {doc: {calc_order}, wsql} = $p;
        // излучаем событие "можно открывать формы"
        pouch.emit('pouch_complete_loaded');

        // следим за изменениями документа установки цен, чтобы при необходимости обновить кеш
        if(pouch.local.doc === pouch.remote.doc) {
          const class_names = [calc_order.class_name];
          if(pouch.props.user_node) {
            class_names.push('doc.nom_prices_setup');
          }
          this._changes = pouch.local.doc.changes({
            since: 'now',
            live: true,
            include_docs: true,
            selector: {class_name: {$in: class_names}}
          }).on('change', (change) => {
            // формируем новый
            if(change.doc.class_name == 'doc.nom_prices_setup') {
              this.by_doc(change.doc);
            }
            else if(change.doc.class_name == calc_order.class_name) {
              if(pouch.props.user_node) {
                return calc_order.emit('change', change.doc);
              }
              const doc = calc_order.by_ref[change.id.substr(15)];
              const user = pouch.authorized || wsql.get_user_param('user_name');
              if(!doc || user === change.doc.timestamp.user) {
                return;
              }
              pouch.load_changes({docs: [change.doc], update_only: true});
            }
          });
        }
      });
  }

  /**
   * Грузит после паузы при изменении документа установки цен
   * пауза нужна, чтобы не создавать водопад при пакетном изменении документов
   * индекс в этом случае, надо пересчитывать один наз, а не на каждый документ
   * @param [force] {Boolean}
   */
  deffered_load_prices(log, force) {
    const {job_prm: {server}, cat: {nom}, adapters: {pouch}} = $p;
    if(this.prices_timeout) {
      clearTimeout(this.prices_timeout);
      this.prices_timeout = 0;
    }
    if(!force) {
      const defer = server ? server.defer : 200000;
      this.prices_timeout = setTimeout(this.deffered_load_prices.bind(this, log, true), defer);
      return;
    }
    // чистим старые цены
    for(const onom of nom) {
      if (onom._data && onom._data._price) {
        for(const cx in onom._data._price) {
          delete onom._data._price[cx];
        }
      }
    }
    this.by_range({log}).then(() => pouch.emit('nom_price'));
  }

  /**
   * Перестраивает кеш цен номенклатуры по длинному ключу
   * @param startkey
   * @return {Promise.<TResult>|*}
   */
  by_range({bookmark, step=1, limit=50, log=null}) {
    const {utils, adapters: {pouch}} = $p;

    (log || console.log)(`load_prices: page №${step}`);

    return utils.sleep(200)
      .then(() => pouch.remote.doc.find({
        selector: {
          class_name: 'doc.nom_prices_setup',
          posted: true,
        },
        limit,
        bookmark,
      }))
      .then((res) => {
        step++;
        bookmark = res.bookmark;
        for (const doc of res.docs) {
          this.by_doc(doc);
        }
        return res.docs.length === limit ? this.by_range({bookmark, step, limit, log}) : 'done';
      });
  }

  /**
   * Перестраивает кеш цен номенклатуры по массиву ключей
   * @param startkey
   * @return {Promise.<TResult>|*}
   */
  by_doc({goods, date, currency}) {
    const {cat: {nom, currencies, characteristics}, utils} = $p;
    date = utils.fix_date(date, true);
    currency = currencies.get(currency);
    for(const row of goods) {
      const onom = nom.get(row.nom, true);
      const characteristic = characteristics.get(row.nom_characteristic, true);

      // если в озу нет подходящей номенклатуры или в строке не задан тип цен - уходим
      if (!onom || !onom._data || !row.price_type){
        continue;
      }

      if (!onom._data._price) {
        onom._data._price = {};
      }
      const key1 = characteristic ? characteristic.ref : utils.blank.guid;
      if (!onom._data._price[key1]) {
        onom._data._price[key1] = {};
      }
      const key2 = row.price_type.valueOf();
      if (!onom._data._price[key1][key2]) {
        onom._data._price[key1][key2] = [];
      }
      onom._data._price[key1][key2].push({
        currency,
        date,
        price: row.price
      });

      // сразу сортируем массив по датам, т.к. порядок используется в других местах
      onom._data._price[key1][key2].sort((a, b) => b.date - a.date);
    }
  }

  /**
   * Возвращает цену номенклатуры по типу цен из регистра пзМаржинальныеКоэффициентыИСкидки
   * Если в маржинальных коэффициентах или номенклатуре указана формула - выполняет
   *
   * Аналог УПзП-шного __ПолучитьЦенуНоменклатуры__
   * @method nom_price
   * @param nom
   * @param characteristic
   * @param price_type
   * @param prm
   * @param row
   */
  nom_price(nom, characteristic, price_type, prm, row) {

    if (row && prm) {
      // _owner = calc_order
      const {_owner} = prm.calc_order_row._owner,
        price_prm = {
          price_type: price_type,
          characteristic: characteristic,
          date: new Date(), // _owner.date,
          currency: _owner.doc_currency
        };

      if (price_type == prm.price_type.price_type_first_cost && !prm.price_type.formula.empty()) {
        price_prm.formula = prm.price_type.formula;
      }
      else if(price_type == prm.price_type.price_type_sale && !prm.price_type.sale_formula.empty()){
        price_prm.formula = prm.price_type.sale_formula;
      }
      if(!characteristic.clr.empty()){
        price_prm.clr = characteristic.clr;
      }
      row.price = nom._price(price_prm);

      return row.price;
    }
  }

  /**
   * Возвращает структуру типов цен и КМарж
   * Аналог УПзП-шного __ПолучитьТипЦенНоменклатуры__
   * @method price_type
   * @param prm {Object}
   * @param prm.calc_order_row {TabularSectionRow.doc.calc_order.production}
   */
  price_type(prm) {

    // Рез = Новый Структура("КМарж, КМаржМин, КМаржВнутр, Скидка, СкидкаВнешн, НаценкаВнешн, ТипЦенСебестоимость, ТипЦенПрайс, ТипЦенВнутр,
    // 				|Формула, ФормулаПродажа, ФормулаВнутр, ФормулаВнешн",
    // 				1.9, 1.2, 1.5, 0, 10, 0, ТипЦенПоУмолчанию, ТипЦенПоУмолчанию, ТипЦенПоУмолчанию, "", "", "",);
    const {utils, job_prm, enm, ireg, cat} = $p;
    const empty_formula = cat.formulas.get();
    const empty_price_type = cat.nom_prices_types.get();

    prm.price_type = {
      marginality: 1.9,
      marginality_min: 1.2,
      marginality_internal: 1.5,
      discount: 0,
      discount_external: 10,
      extra_charge_external: 0,
      price_type_first_cost: empty_price_type,
      price_type_sale: empty_price_type,
      price_type_internal: empty_price_type,
      formula: empty_formula,
      sale_formula: empty_formula,
      internal_formula: empty_formula,
      external_formula: empty_formula
    };

    const {calc_order_row} = prm;
    const {nom, characteristic} = calc_order_row;
    const {partner} = calc_order_row._owner._owner;
    const filter = nom.price_group.empty() ?
        {price_group: nom.price_group} :
        {price_group: {in: [nom.price_group, cat.price_groups.get()]}};
    const ares = [];


    ireg.margin_coefficients.find_rows(filter, (row) => {

      // фильтруем по параметрам
      let ok = true;
      if(!row.key.empty()){
        row.key.params.forEach((row_prm) => {

          const {property} = row_prm;
          // для вычисляемых параметров выполняем формулу
          if(property.is_calculated){
            ok = utils.check_compare(property.calculated_value({calc_order_row}), property.extract_value(row_prm), row_prm.comparison_type, enm.comparison_types);
          }
          // заглушка для совместимости с УПзП
          else if(property.empty()){
            const vpartner = cat.partners.get(row_prm._obj.value);
            if(vpartner && !vpartner.empty()){
              ok = vpartner == partner;
            }
          }
          // обычные параметры ищем в параметрах изделия
          else{
            let finded;
            characteristic.params.find_rows({
              cnstr: 0,
              param: property
            }, (row_x) => {
              finded = row_x;
              return false;
            });
            if(finded){
              ok = utils.check_compare(finded.value, property.extract_value(row_prm), row_prm.comparison_type, enm.comparison_types);
            }
            else{
              ok = false;
            }
          }
          if(!ok){
            return false;
          }
        })
      }
      if(ok){
        ares.push(row);
      }
    });

    // сортируем по приоритету и ценовой группе
    if(ares.length){
      ares.sort((a, b) => {

        if ((!a.key.empty() && b.key.empty()) || (a.key.priority > b.key.priority)) {
          return -1;
        }
        if ((a.key.empty() && !b.key.empty()) || (a.key.priority < b.key.priority)) {
          return 1;
        }

        if (a.price_group.ref > b.price_group.ref) {
          return -1;
        }
        if (a.price_group.ref < b.price_group.ref) {
          return 1;
        }

        return 0;
      });
      Object.keys(prm.price_type).forEach((key) => {
        prm.price_type[key] = ares[0][key];
      });
    }

    // если для контрагента установлена индивидуальная наценка, подмешиваем её в prm
    partner.extra_fields.find_rows({
      property: job_prm.pricing.dealer_surcharge
    }, (row) => {
      const val = parseFloat(row.value);
      if(val){
        prm.price_type.extra_charge_external = val;
      }
      return false;
    });

    return prm.price_type;
  }

  /**
   * Рассчитывает плановую себестоимость строки документа Расчет
   * Если есть спецификация, расчет ведется по ней. Иначе - по номенклатуре строки расчета
   *
   * Аналог УПзП-шного __РассчитатьПлановуюСебестоимость__
   * @param prm {Object}
   * @param prm.calc_order_row {TabularSectionRow.doc.calc_order.production}
   */
  calc_first_cost(prm) {

    const {marginality_in_spec} = $p.job_prm.pricing;
    const fake_row = {};
    const {calc_order_row, spec} = prm;

    if(!spec) {
      return;
    }

    // пытаемся рассчитать по спецификации
    if(spec.count()){
      spec.forEach((row) => {

        const {_obj, nom, characteristic} = row;

        this.nom_price(nom, characteristic, prm.price_type.price_type_first_cost, prm, _obj);
        _obj.amount = _obj.price * _obj.totqty1;

        if(marginality_in_spec){
          fake_row.nom = nom;
          const tmp_price = this.nom_price(nom, characteristic, prm.price_type.price_type_sale, prm, fake_row);
          _obj.amount_marged = tmp_price * _obj.totqty1;
        }

      });
      calc_order_row.first_cost = spec.aggregate([], ["amount"]).round(2);
    }
    else{
      // расчет себестомиости по номенклатуре строки расчета
      fake_row.nom = calc_order_row.nom;
      fake_row.characteristic = calc_order_row.characteristic;
      calc_order_row.first_cost = this.nom_price(fake_row.nom, fake_row.characteristic, prm.price_type.price_type_first_cost, prm, fake_row);
    }

    // себестоимость вытянутых строк спецификации в заказ
    prm.order_rows && prm.order_rows.forEach((value) => {
      const fake_prm = {
        spec: value.characteristic.specification,
        calc_order_row: value
      }
      this.price_type(fake_prm);
      this.calc_first_cost(fake_prm);
    });
  }

  /**
   * Рассчитывает стоимость продажи в строке документа Расчет
   *
   * Аналог УПзП-шного __РассчитатьСтоимостьПродажи__
   * @param prm {Object}
   * @param prm.calc_order_row {TabularSectionRow.doc.calc_order.production}
   */
  calc_amount(prm) {

    const {calc_order_row, price_type, first_cost} = prm;
    const {marginality_in_spec, not_update} = $p.job_prm.pricing;
    const {rounding, manager} = calc_order_row._owner._owner;

    // если цена уже задана и номенклатура в группе "не обновлять цены" - не обновляем
    if(calc_order_row.price && not_update && (not_update.includes(calc_order_row.nom) || not_update.includes(calc_order_row.nom.parent))) {
      ;
    }
    else {
      const price_cost = marginality_in_spec && prm.spec.count() ?
        prm.spec.aggregate([], ['amount_marged']) :
        this.nom_price(calc_order_row.nom, calc_order_row.characteristic, price_type.price_type_sale, prm, {});

      // цена продажи
      if(price_cost) {
        calc_order_row.price = price_cost.round(rounding);
      }
      else if(marginality_in_spec && !first_cost) {
        calc_order_row.price = this.nom_price(calc_order_row.nom, calc_order_row.characteristic, price_type.price_type_sale, prm, {});
      }
      else {
        calc_order_row.price = (calc_order_row.first_cost * price_type.marginality).round(rounding);
      }
    }

    // КМарж в строке расчета
    calc_order_row.marginality = calc_order_row.first_cost ?
      calc_order_row.price * ((100 - calc_order_row.discount_percent) / 100) / calc_order_row.first_cost : 0;


    // Рассчитаем цену и сумму ВНУТР или ДИЛЕРСКУЮ цену и скидку
    let extra_charge = $p.wsql.get_user_param('surcharge_internal', 'number');
    // если пересчет выполняется менеджером, используем наценку по умолчанию
    if(!manager.partners_uids.length || !extra_charge) {
      extra_charge = price_type.extra_charge_external || 0;
    }

    // TODO: учесть формулу
    calc_order_row.price_internal = (calc_order_row.price * (100 - calc_order_row.discount_percent) / 100 * (100 + extra_charge) / 100).round(rounding);

    // Эмулируем событие окончания редактирования, чтобы единообразно пересчитать строку табчасти
    !prm.hand_start && calc_order_row.value_change('price', {}, calc_order_row.price, true);

    // Цены и суммы вытянутых строк спецификации в заказ
    prm.order_rows && prm.order_rows.forEach((value) => {
      const fake_prm = {
        spec: value.characteristic.specification,
        calc_order_row: value
      };
      this.price_type(fake_prm);
      this.calc_amount(fake_prm);
    });

  }

  /**
   * В случае нулевых цен, дополняет в спецификацию строку ошибки
   * @param prm
   */
  check_prices({calc_order_row}) {
    const {pricing: {marginality_in_spec}, nom: {empty_price}} = $p.job_prm;
    let err;

    calc_order_row.characteristic.specification.forEach((row) => {
      const {_obj, nom, characteristic} = row;
      if(_obj.totqty1 && !nom.is_procedure && !nom.is_service) {
        // проверяем цену продужи или себестоимости
        if((marginality_in_spec && !_obj.amount_marged) || (!marginality_in_spec && !_obj.price)){
          err = row;
          return false;
        }
      }
    });
    return err;
  }

  /**
   * Пересчитывает сумму из валюты в валюту
   * @param amount {Number} - сумма к пересчету
   * @param date {Date} - дата курса
   * @param from - исходная валюта
   * @param [to] - конечная валюта
   * @return {Number}
   */
  from_currency_to_currency (amount, date, from, to) {
    return from.to_currency(amount, date, to);
  }


}


/**
 * ### Модуль Ценообразование
 * Аналог УПзП-шного __ЦенообразованиеСервер__ в контексте MetaEngine
 */
$p.pricing = new Pricing($p);
