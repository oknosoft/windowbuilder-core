
exports.CatClrsManager = class CatClrsManager extends Object {

  /**
   * Получает цвет с учётом длинных гвидов
   * при необходимости, создаёт составной на лету
   */
  getter(ref) {
    if(ref && ref.length === 72) {
      const clr_in = ref.substr(0, 36);
      const clr_out = ref.substr(36);
      let in_out = this.by_in_out({clr_in, clr_out});
      if(in_out.empty()) {
        in_out = this.create({ref, clr_in, clr_out, parent: $p.job_prm.builder.composite_clr_folder}, false, true);
        in_out._obj.name = `${in_out.clr_in.name} \\ ${in_out.clr_out.name}`;
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
    if(clr.clr_in == clr.clr_out || clr.clr_in.empty() || clr.clr_out.empty()) {
      return clr;
    }
    const by_in_out = this.by_in_out({clr_in: clr.clr_out, clr_out: clr.clr_in});
    return by_in_out.empty() ? clr : by_in_out;
  }

  /**
   * Возвращает предопределенный цвет НеВключатьВСпецификацию
   */
  ignored() {
    return this.predefined('НеВключатьВСпецификацию');
  }

}

exports.CatClrs = class CatClrs extends Object {

  inverted() {
    return this._manager.inverted(this);
  }

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


