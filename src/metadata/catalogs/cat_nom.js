
exports.CatNomManager = class CatNomManager extends Object {

  load_array(aattr, forse) {
    // если внутри номенклатуры завёрнуты единицы - вытаскиваем
    const units = [];
    const prices = {};
    for(const row of aattr) {
      if(row.units) {
        row.units.split('\n').forEach((urow) => {
          const uattr = urow.split(',');
          units.push({
            ref: uattr[0],
            owner: row.ref,
            id: uattr[1],
            name: uattr[2],
            qualifier_unit: uattr[3],
            heft: parseFloat(uattr[4]),
            volume: parseFloat(uattr[5]),
            coefficient: parseFloat(uattr[6]),
            rounding_threshold: parseFloat(uattr[7]),
          });
        });
        delete row.units;
      }
      if(row._price) {
        prices[row.ref] = row._price;
        delete row._price;
      }
    }
    const res = super.load_array(aattr, forse);
    const {currencies, nom_units} = this._owner;
    units.length && nom_units.load_array(units, forse);

    // если внутри номенклатуры завёрнуты цены - вытаскиваем
    for(const {_data, _obj} of res) {
      const _price = prices[_obj.ref];
      if(_price) {
        _data._price = _price;
        for(const ox in _price) {
          for(const type in _price[ox]) {
            const v = _price[ox][type];
            Array.isArray(v) && v.forEach((row) => {
              row.date = new Date(row.date);
              row.currency = currencies.get(row.currency);
            });
          }
        }
      }
    }

    return res;
  }

};

exports.CatNom = class CatNom extends Object {

  /**
   * Возвращает значение допреквизита группировка
   */
  get grouping() {
    if(!this.hasOwnProperty('_grouping')){
      const {extra_fields, _manager} = this;
      if(!_manager.hasOwnProperty('_grouping')) {
        _manager._grouping = _manager._owner.$p.cch.properties.predefined('grouping');
      }
      if(_manager._grouping) {
        const row = extra_fields.find({property: _manager._grouping});
        this._grouping = row ? row.value.name : '';
      }
      else {
        this._grouping = '';
      }
    }
    return this._grouping;
  }

  /**
   * Возвращает значение допреквизита минимальный объём
   */
  get min_volume() {
    if(!this.hasOwnProperty('_min_volume')){
      const {extra_fields, _manager} = this;
      if(!_manager.hasOwnProperty('_min_volume')) {
        _manager._min_volume = _manager._owner.$p.cch.properties.predefined('min_volume');
      }
      if(_manager._min_volume) {
        const row = extra_fields.find({property: _manager._min_volume});
        this._min_volume = row ? row.value : 0;
      }
      else {
        this._min_volume = 0;
      }
    }
    return this._min_volume;
  }

  /**
   * Представление объекта
   * @return {string}
   */
  get presentation() {
    return (this.article ? this.article + ' ' : '') + this.name;
  }
  set presentation(v) {

  }

  /**
   * Возвращает номенклатуру по ключу цветового аналога
   * @param clr
   * @return {any|CatNom}
   */
  by_clr_key(clr) {
    if(this.clr == clr){
      return this;
    }
    if(!this._clr_keys){
      this._clr_keys = new Map();
    }
    const {_clr_keys} = this;
    if(_clr_keys.has(clr)){
      return _clr_keys.get(clr);
    }
    if(_clr_keys.size){
      return this;
    }

    // получаем ссылку на ключ цветового аналога
    const {job_prm: {properties: {clr_key}}, cat} = $p;
    const clr_value = this._extra(clr_key);
    if(!clr_value){
      return this;
    }

    // находим все номенклатуры с подходящим ключем цветового аналога
    const {ref} = clr_key;
    this._manager.alatable.forEach((nom) => {
      nom.extra_fields && nom.extra_fields.some((row) =>
        row.property === ref && row.value === clr_value && _clr_keys.set(cat.clrs.get(nom.clr), cat.nom.get(nom.ref)));
    });

    // возарвщаем подходящую или себя
    if(_clr_keys.has(clr)){
      return _clr_keys.get(clr);
    }
    if(!_clr_keys.size){
      _clr_keys.set(0, 0);
    }
    return this;
  }

  /**
   * Возвращает цену номенклатуры указанного типа
   * - на дату
   * - с подбором характеристики по цвету
   * - с пересчетом из валюты в валюту
   *
   * @param attr
   * @return {Number|*}
   * @private
   */
  _price(attr) {
    const {
      job_prm: {pricing},
      cat: {
        characteristics: {by_ref: characteristics},
        color_price_groups: {by_ref: color_price_groups},
        clrs: {by_ref: clrs}
      },
      utils,
    } = this._manager._owner.$p;

    let price = 0,
      currency = pricing.main_currency,
      start_date = utils.blank.date;

    if(!attr){
      attr = {currency};
    }
    let {_price, _bprice} = this._data;
    if(attr.branch && _bprice?.has?.(attr.branch)) {
      _price = _bprice.get(attr.branch)
    }
    const {x, y, z, clr, ref, calc_order} = (attr.characteristic || {});

    if(attr.price_type){

      if(utils.is_data_obj(attr.price_type)){
        attr.price_type = attr.price_type.ref;
      }

      if(!attr.characteristic){
        attr.characteristic = utils.blank.guid;
      }
      else if(utils.is_data_obj(attr.characteristic)){
        // если передали уникальную характеристику продкции - ищем простую с тем же цветом и размерами
        // TODO: здесь было бы полезно учесть соответствие цветов??
        attr.characteristic = ref;
        if(!calc_order.empty()){
          const tmp = [];
          for(let clrx in _price) {
            const cx = characteristics[clrx];
            if(cx && cx.clr == clr) {
              // если на подходящую характеристику есть цена по нашему типу цен - запоминаем
              if(_price[clrx][attr.price_type]) {
                if(cx.x && x && cx.x - x < -10) {
                  continue;
                }
                if(cx.y && y && cx.y - y < -10) {
                  continue;
                }
                tmp.push({
                  cx,
                  rate: (cx.x && x ? Math.abs(cx.x - x) : 0) + (cx.y && y ? Math.abs(cx.y - y) : 0) + (cx.z && z && cx.z == z ? 1 : 0)
                });
              }
            }
          }
          if(tmp.length) {
            tmp.sort((a, b) => a.rate - b.rate);
            attr.characteristic = tmp[0].cx.ref;
          }
        }
      }

      if(!attr.date){
        attr.date = new Date();
      }

      // если для номенклатуры существует структура цен, ищем подходящую
      attr.pdate = start_date;
      if(_price){
        if(attr.clr && attr.characteristic == utils.blank.guid) {
          let tmp = 0;
          for (let clrx in _price) {
            const cpg = color_price_groups[clrx] || clrs[clrx];
            if (cpg && cpg.contains(attr.clr, null, true)) {
              if (_price[clrx][attr.price_type]) {
                _price[clrx][attr.price_type].some((row) => {
                  if (row.date > start_date && row.date <= attr.date) {
                    const tprice = row.currency.to_currency(row.price, attr.date, attr.currency);
                    if (tprice > tmp) {
                      tmp = tprice;
                      price = row.price;
                      currency = row.currency;
                      return true;
                    }
                  }
                  else if(row.date > attr.pdate) {
                    attr.pdate = row.date;
                  }
                });
              }
            }
          }
        }
        if(!price && _price[attr.characteristic]){
          if(_price[attr.characteristic][attr.price_type]){
            _price[attr.characteristic][attr.price_type].some((row) => {
              if(row.date > start_date && row.date <= attr.date){
                price = row.price;
                currency = row.currency;
                return true;
              }
            });
          }
        }
        // если нет цены на характеристику, ищем по цвету
        if(!price && attr.clr){
          for(let clrx in _price){
            const cx = characteristics[clrx];
            const cpg = color_price_groups[clrx] || clrs[clrx];
            if((cx && cx.clr == attr.clr) || (cpg && cpg.contains(attr.clr, null, true))){
              if(_price[clrx][attr.price_type]){
                _price[clrx][attr.price_type].some((row) => {
                  if(row.date > start_date && row.date <= attr.date){
                    price = row.price;
                    currency = row.currency;
                    return true;
                  }
                });
                break;
              }
            }
          }
        }
      }
    }

    // если есть формула - выполняем вне зависимости от установленной цены
    if(attr.formula){

      // если нет цены на характеристику, ищем цену без характеристики
      if(!price && _price && _price[utils.blank.guid]){
        if(_price[utils.blank.guid][attr.price_type]){
          _price[utils.blank.guid][attr.price_type].some((row) => {
            if(row.date > start_date && row.date <= attr.date){
              price = row.price;
              currency = row.currency;
              return true;
            }
          });
        }
      }
      // формулу выполняем в любом случае - она может и не опираться на цены из регистра
      price = attr.formula.execute({
        nom: this,
        characteristic: characteristics[attr.characteristic.valueOf()],
        date: attr.date,
        prm: attr.prm,
        price, currency, x, y, z, clr, calc_order,
      });
    }

    // Пересчитать из валюты в валюту
    return currency.to_currency(price, attr.date, attr.currency);
  }

  /**
   * Выясняет, назначена ли данной номенклатуре хотя бы одна цена
   * @param [cx] {String} если указано, проверяет наличие цены для конкретной характеристики
   * @param [type] {String} если указано, проверяет наличие цены по этому типу
   * @return {Boolean}
   */
  has_price(cx, type) {
    const {_price} = this._data;
    const has = (prices) => Array.isArray(prices) && prices.find(({price}) => price >= 0.01);
    if(!_price) {
      return false;
    }
    if(type) {
      if(cx) {
        return Boolean(_price[cx] && has(_price[cx][type]));
      }
      for(const cx in _price) {
        if(has(_price[cx][type])) {
          return true;
        }
      }
      return false;
    }
    else {
      if(cx) {
        for(const pt in _price[cx]) {
          if(has(_price[cx][pt])) {
            return true;
          }
        }
      }
      for(const cx in _price) {
        for(const pt in _price[cx]) {
          if(has(_price[cx][pt])) {
            return true;
          }
        }
      }
    }
  }

  /**
   * Возвращает массив связей текущей номенклатуры
   */
  params_links(attr) {
    const {CchProperties} = this._manager._owner.$p;
    return CchProperties.prototype.params_links.call(this, attr);
  }

  /**
   * Проверяет и при необходимости перезаполняет или устанваливает умолчание value в prow
   */
  linked_values(links, prow, values = []) {
    const {CchProperties} = this._manager._owner.$p;
    return CchProperties.prototype.linked_values.call(this, links, prow, values);
  }

  filter_params_links(filter, attr, links) {
    const {CchProperties} = this._manager._owner.$p;
    return CchProperties.prototype.filter_params_links.call(this, filter, attr, links);
  }

  get type() {
    return {is_ref: true, types: ["cat.characteristics"]};
  }

};
