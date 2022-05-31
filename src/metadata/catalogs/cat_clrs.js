
exports.CatClrsManager = class CatClrsManager extends Object {

  /**
   * Получает цвет с учётом длинных гвидов
   * при необходимости, создаёт составной на лету
   */
  getter(ref) {
    if(ref && ref.length === 72) {
      const clr_in = ref.substr(0, 36);
      const clr_out = ref.substr(36);
      let in_out = this.get(ref);
      if(in_out.is_new()) {
        Object.assign(in_out._obj, {clr_in, clr_out, parent: $p.job_prm.builder.composite_clr_folder.valueOf()});
        in_out._obj.name = `${in_out.clr_in.name} \\ ${in_out.clr_out.name}`;
        in_out._set_loaded(ref);
      }
      return in_out;
    }
    return this.get(ref);
  }

  /**
   * Ссылка составного цвета
   *
   * @param curr {('clr_in'|'clr_out')}
   * @param other {CatClrs}
   * @param v {CatClrs|String}
   * @return {String}
   */
  composite_ref(curr, other, v) {
    let clr = this.get(v);
    if(clr.empty()) {
      clr = this.predefined('БезЦвета');
    }
    else if(!clr[curr].empty()) {
      clr = clr[curr];
    }
    if(other.empty()) {
      other = this.predefined('БезЦвета');
    }
    if(clr.valueOf() === other.valueOf()) {
      return clr.valueOf();
    }
    return curr === 'clr_in' ? clr.valueOf() + other.valueOf() : other.valueOf() + clr.valueOf();
  }

  /**
   * Ищет по цветам снаружи-изнутри
   * @return {CatClrs}
   */
  by_in_out({clr_in, clr_out}) {
    const {wsql, utils: {blank}} = $p;
    // скомпилированный запрос
    if(!this._by_in_out) {
      this._by_in_out = wsql.alasql.compile('select top 1 ref from ? where clr_in = ? and clr_out = ? and (not ref = ?)');
    }
    // ищем в справочнике цветов
    const ares = this._by_in_out([this.alatable, clr_in.valueOf(), clr_out.valueOf(), blank.guid]);
    return this.get(ares[0]);
  }

  /**
   * ПолучитьЦветПоПредопределенномуЦвету
   * @param clr {CatClrs} - цвет исходной строки соединения, фурнитуры или вставки
   * @param clr_elm {CatClrs} - цвет элемента
   * @param clr_sch {CatClrs} - цвет изделия
   * @return {CatClrs}
   */
  by_predefined(clr, clr_elm, clr_sch, elm, spec, row) {
    const {predefined_name} = clr;
    if(predefined_name) {
      const flipped = elm && elm.layer && elm.layer.flipped;
      switch (predefined_name) {
      case 'КакЭлемент':
        return clr_elm;
      case 'КакИзделие':
        return clr_sch;
      case 'КакЭлементСнаружи':
        return flipped ? this.by_predefined({predefined_name: 'КакЭлементИзнутри'}, clr_elm) :
          clr_elm.clr_out.empty() ? clr_elm : clr_elm.clr_out;
      case 'КакЭлементИзнутри':
        return flipped ?
          this.by_predefined({predefined_name: 'КакЭлементСнаружи'}, clr_elm) :
          clr_elm.clr_in.empty() ? clr_elm : clr_elm.clr_in;
      case 'КакИзделиеСнаружи':
        return flipped ? this.by_predefined({predefined_name: 'КакИзделиеИзнутри'}, clr_elm, clr_sch) :
          clr_sch.clr_out.empty() ? clr_sch : clr_sch.clr_out;
      case 'КакИзделиеИзнутри':
        return flipped ? this.by_predefined({predefined_name: 'КакИзделиеСнаружи'}, clr_elm, clr_sch) :
          clr_sch.clr_in.empty() ? clr_sch : clr_sch.clr_in;
      case 'КакЭлементИнверсный':
        return this.inverted(clr_elm);
      case 'КакИзделиеИнверсный':
        return this.inverted(clr_sch);
      case 'БезЦвета':
        return this.get();
      case 'Белый':
      case 'Прозрачный':
        return clr;
      case 'КакВоВставке':
        if(!elm){
          return clr_elm;
        }
        const {inset} = elm;
        const main_rows = inset.main_rows(elm);
        return main_rows.length ? this.by_predefined(main_rows[0].clr, clr_elm, clr_sch, elm, spec) : clr_elm;
      case 'КакНом':
        const nom = row ? row.nom : (elm && elm.nom);
        return nom ? nom.clr : (clr.empty() ? clr_elm : clr);
      case 'КакВедущий':
      case 'КакВедущийИзнутри':
      case 'КакВедущийСнаружи':
      case 'КакВедущийИнверсный':
        const sub_clr = this.predefined(predefined_name.replace('КакВедущий', 'КакЭлемент'));
        const t_parent = elm && elm.t_parent();
        if(!elm || elm === t_parent){
          return this.by_predefined(sub_clr,  clr_elm);
        }
        let finded;
        spec && spec.find_rows({elm: t_parent.elm, nom: t_parent.nom}, (row) => {
          finded = this.by_predefined(sub_clr,  row.clr);
          return false;
        });
        return finded || clr_elm;

      default :
        return clr_elm;
      }
    }
    else if (clr instanceof $p.CatColor_price_groups) {
      const tmp = clr.clr.empty() ? clr_elm : this.by_predefined(clr.clr, clr_elm, clr_sch, elm, spec, row);
      for(const row of clr.clr_conformity) {
        if(row.clr1.contains(tmp)) {
          return row.clr2;
        }
      }
      return tmp;
    }
    else if (clr instanceof $p.CatFormulas) {

    }
    return clr.empty() ? clr_elm : clr;
  }

  /**
   * ### Инверсный цвет
   * Возвращает элемент, цвета которого изнутри и снаружи перевёрнуты местами
   * @param clr {CatClrs} - исходный цвет
   */
  inverted(clr){
    if(!clr.is_composite()) {
      return clr;
    }
    const {clr_in, clr_out} = clr;
    return this.getter(`${clr_out.valueOf()}${clr_in.valueOf()}`);
  }

  /**
   * Возвращает предопределенный цвет НеВключатьВСпецификацию
   */
  ignored() {
    return this.predefined('НеВключатьВСпецификацию');
  }

  /**
   * Скрывает составные цвета в отборе
   * @param mf
   */
  hide_composite(mf) {
    const choice_param = mf.choice_params && mf.choice_params.find(({name}) => name === 'parent');
    const {composite_clr_folder: ccf} = $p.job_prm.builder;
    if(choice_param && choice_param.path.not) {
      choice_param.path = {nin: [choice_param.path.not, ccf]};
    }
    else if(choice_param && choice_param.path.nin && !choice_param.path.nin.find(v => v === ccf)) {
      choice_param.path.nin.push();
    }
    else {
      if(!mf.choice_params) {
        mf.choice_params = [];
      }
      mf.choice_params.push({
        name: 'parent',
        path: {not: ccf},
      });
    }
  }

  /**
   * Дополняет связи параметров выбора отбором, исключающим служебные цвета
   * @param mf {Object} - описание метаданных поля
   * @param sys {Object} - объект, у которого можно спросить связи
   */
  selection_exclude_service(mf, sys) {
    if(mf.choice_params) {
      mf.choice_params.length = 0;
    }
    else {
      mf.choice_params = [];
    }

    const {job_prm, cat: {clrs}, CatClrs, CatColor_price_groups, DpBuyers_order, Editor} = $p;

    mf.choice_params.push({
      name: 'parent',
      path: {not: clrs.predefined('СЛУЖЕБНЫЕ')}
    });

    if(sys) {

      // связи параметров для цвета изделия
      const {clr_product} = job_prm.properties;
      if(clr_product && sys instanceof DpBuyers_order) {
        const links = clr_product.params_links({obj: {_owner: {_owner: sys.characteristic}}});
        // проверим вхождение значения в доступные и при необходимости изменим
        if(links.length) {
          const filter = {}
          clr_product.filter_params_links(filter, null, links);
          filter.ref && mf.choice_params.push({
            name: 'ref',
            path: filter.ref,
          });
        }
      }

      // фильтр доступных цветов системы или вставки
      let clr_group = clrs.find_group(sys);

      mf.choice_params.push({
        name: 'ref',
        get path() {
          if(clr_group.empty() || (!clr_group.clr_conformity.count() && clr_group.condition_formula.empty())) {
            return {not: ''};
          }
          return {in: clr_group.clrs()};
        }
      });

      // подмешиваем признак сокрытия составных
      if(clr_group.hide_composite) {
        mf.hide_composite = true;
      }
      else if(mf.hide_composite) {
        mf.hide_composite = false;
      }

      // если разрешен единственный цвет, установим ro
      if(!clr_group.empty() && clr_group.clrs().length === 1) {
        mf.single_value = clr_group.clrs()[0];
      }
      else if(mf.single_value) {
        delete mf.single_value;
      }
    }
  }

  /**
   * ищет цветогруппу для sys неопределенного типа
   * @param sys
   * @return {CatColor_price_groups}
   */
  find_group(sys) {
    const {BuilderElement, Filling} = $p.EditorInvisible;
    let clr_group;
    if(sys instanceof BuilderElement) {
      clr_group = sys.inset.clr_group;
      if(clr_group.empty() && !(sys instanceof Filling)) {
        clr_group = sys.project._dp.sys.clr_group;
      }
    }
    else if(sys.hasOwnProperty('sys') && sys.profile && sys.profile.inset) {
      const sclr_group = sys.sys.clr_group;
      const iclr_group = sys.profile.inset.clr_group;
      clr_group = iclr_group.empty() ? sclr_group : iclr_group;
    }
    else if(sys.sys && sys.sys.clr_group) {
      clr_group = sys.sys.clr_group;
    }
    else {
      clr_group = sys.clr_group;
    }
    return clr_group;
  }

}

exports.CatClrs = class CatClrs extends Object {

  /**
   * Возвращает инверсный по отношению к текущему
   * @returns {CatClrs}
   */
  inverted() {
    return this._manager.inverted(this);
  }

  /**
   * Признак составного
   * @returns {boolean}
   */
  is_composite() {
    const {clr_in, clr_out} = this;
    return clr_in != clr_out && !(clr_in.empty() || clr_out.empty());
  }

  /**
   * Рассчитывает реквизит grouping
   * @param values {Array}
   */
  set_grouping(values) {
    const {clr_in, clr_out, _manager} = this;
    const white = _manager.predefined('Белый');
    const grp_in = clr_in === white ? 'Белый' : clr_in.grouping.name.split(' ')[0];
    const grp_out = clr_out === white ? 'Белый' : clr_out.grouping.name.split(' ')[0];
    if(!grp_in || grp_in === 'Нет' || !grp_out || grp_out === 'Нет') {
      this.grouping = values.find((v) => v.name === 'Нет');
    }
    else {
      this.grouping = values.find((v) => v.name.startsWith(grp_in) && v.name.endsWith(grp_out));
    }
  }

  /**
   * Возвращает стороны, на которых цвет
   * @return {{is_in: boolean, is_out: boolean}}
   */
  get sides() {
    const res = {is_in: false, is_out: false};
    if(!this.empty() && !this.predefined_name){
      const {clr_in, clr_out} = this;
      if(clr_in.empty() && clr_out.empty()){
        res.is_in = res.is_out = true;
      }
      else{
        if(!clr_in.empty() && !clr_in.predefined_name){
          res.is_in = true;
        }
        if(!clr_out.empty() && !clr_out.predefined_name){
          res.is_out = true;
        }
      }
    }
    return res;
  }

  contains(clr) {
    return clr === this;
  }

}
