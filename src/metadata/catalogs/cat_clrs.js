
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
   * ### Инверсный цвет
   * Возвращает элемент, цвета которого изнутри и снаружи перевёрнуты местами
   * @param clr {CatClrs} - исходный цвет
   */
  inverted(clr){
    if(!clr.is_composite()) {
      return clr;
    }
    const {clr_in, clr_out} = this;
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

}
