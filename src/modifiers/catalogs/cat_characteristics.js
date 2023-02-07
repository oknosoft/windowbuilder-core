
/*
 * Модуль объекта справочника ХарактеристикиНоменклатуры
 * Обрботчики событий after_create, after_load, before_save, after_save, value_change
 * Методы выполняются в контексте текущего объекта this = DocObj
 *
 *
 * Created 16.03.2016
 */

// переопределяем value_mgr
(function({cat: {characteristics, nom}}){
  const {value_mgr} = characteristics.constructor.prototype;
  characteristics.value_mgr = function(_obj, f, mf, array_enabled, v) {
    if(f === 'owner') {
      return nom;
    }
    if(f === 'value' && _obj.param && nom.by_ref[_obj.param]){
      return characteristics;
    }
    return value_mgr.call(characteristics, _obj, f, mf, array_enabled, v);
  };
  characteristics.extra_fields = function() {
    return [];
  };
  characteristics._direct_ram = true;
})($p);

// при старте приложения, корректируем метаданные формы спецификации с учетом ролей пользователя
!$p.job_prm.is_node && $p.md.once('predefined_elmnts_inited', () => {
  const _mgr = $p.cat.characteristics;

  Promise.resolve()
    .then(() => {
      const {current_user} = $p;
      if(current_user && (
          current_user.role_available('СогласованиеРасчетовЗаказов') ||
          current_user.role_available('ИзменениеТехнологическойНСИ') ||
          current_user.role_available('РедактированиеЦен')
        )) {
        return;
      }
      const {form} = _mgr.metadata();
      if(form && form.obj && form.obj.tabular_sections) {
        form.obj.tabular_sections.specification.widths = "50,*,70,*,50,70,70,80,70,70,70,0,0,0";
      }
    });
});

// при изменении реквизита табчасти вставок
$p.CatCharacteristicsInsertsRow.prototype.value_change = function (field, type, value) {
  // для вложенных вставок перезаполняем параметры
  if(field == 'inset') {
    if (value != this.inset) {
      const {_owner} = this._owner;
      const {cnstr, region} = this;
      const {blank} = $p.utils;

      //Проверяем дубли вставок (их не должно быть, иначе параметры перезаписываются)
      if (value != blank.guid) {
        const res = this._owner.find_rows({cnstr, region, inset: value, row: {not: this.row}});
        if (res.length) {
          $p.md.emit('alert', {
            obj: _owner,
            row: this,
            title: $p.msg.data_error,
            type: 'alert-error',
            text: 'Нельзя добавлять две одинаковые вставки в один элемент или слой'
          });
          return false;
        }
      }

      // удаляем параметры старой вставки
      !this.inset.empty() && _owner.params.clear({inset: this.inset, cnstr});

      // устанавливаем значение новой вставки
      this._obj.inset = value.valueOf();

      // устанавливаем ряд по умолчанию
      if(!region && this.inset.region) {
        this._obj.region = this.inset.region;
      }

      // при необходимости, обновим цвет по данным доступных цветов вставки
      this.inset.clr_group.default_clr(this);

      // заполняем параметры по умолчанию
      _owner.add_inset_params(this.inset, cnstr, null, region);
    }
  }
};

// при изменении реквизита табчасти состава заполнения
$p.CatCharacteristicsGlass_specificationRow.prototype.value_change = function (field, type, value) {
  // для вставок состава, перезаполняем параметры
  const {_obj} = this;
  if(field === 'inset' && value != this.inset) {
    _obj.inset = value ? value.valueOf() : $p.utils.blank.guid;
    const {inset, clr, dop, _owner: {_owner}} = this;
    const {product_params} = inset;
    const own_row = _owner.coordinates.find({elm: _obj.elm});
    const own_params = own_row && own_row.inset.product_params;

    const params = {};
    inset.used_params().forEach((param) => {
      if((!param.is_calculated || param.show_calculated)) {
        const def = product_params.find({param}) || (own_params && own_params.find({param}));
        if(def) {
          const {value} = def;
          params[param.valueOf()] = value ? value.valueOf() : value;
        }
      }
    });
    const clrs = inset.clr_group.clrs();
    if(clrs.length && !clrs.includes(clr)) {
      _obj.clr = clrs[0].valueOf();
    }
    this.dop = Object.assign(dop, {params});
  }
};

// виртуальный Ряд
Object.defineProperty($p.CatCharacteristicsGlass_specificationRow.prototype, 'region', {
  get() {
    const {region} = this.dop;
    return typeof region === 'number' ? region : 0;
  },
  set(v) {
    const region = typeof v === 'number' ? v : parseFloat(v);
    if(!isNaN(region)) {
      const {dop} = this;
      this.dop = Object.assign(dop,{region: region.round()});
    }
  }
});
$p.cat.characteristics.metadata('glass_specification').fields.region = {
  synonym: 'Ряд',
  type: {
    digits: 3,
    fraction: 0,
    types: ['number'],
  }
};

/**
 * Заполняет себя данными слоя
 * @memberof CatCharacteristicsConstructionsRow
 * @param [bounds] {paper.Bounds}
 * @param is_rectangular {Boolean}
 * @param w {Number}
 * @param h {Number}
 * @param layer {paper.Layer}
 */
$p.CatCharacteristicsConstructionsRow.prototype.by_contour = function by_contour({bounds, is_rectangular, w, h, layer}) {
  this.x = bounds ? bounds.width.round(4) : 0;
  this.y = bounds ? bounds.height.round(4) : 0;
  this.is_rectangular = is_rectangular;
  if (layer) {
    this.w = w.round(4);
    this.h = h.round(4);
  }
  else {
    this.w = 0;
    this.h = 0;
  }
};

