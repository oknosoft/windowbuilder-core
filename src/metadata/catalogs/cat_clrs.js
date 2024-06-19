
exports.CatClrsManager = class CatClrsManager extends Object {

  /**
   * Получает цвет с учётом длинных гвидов
   * при необходимости, создаёт составной на лету
   */
  getter(ref) {
    if(ref && ref.length === 72) {
      const clr_in = ref.substring(0, 36);
      const clr_out = ref.substring(36);
      let in_out = this.get(ref);
      if(in_out.is_new()) {
        Object.assign(in_out._obj, {clr_in, clr_out, parent: $p.job_prm.builder.composite_clr_folder.valueOf()});
        in_out._obj.name = (in_out.clr_in.name && in_out.clr_out.name) ?
          `${in_out.clr_in.name} \\ ${in_out.clr_out.name}` : '';
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

  clr_prm({row_base, row_spec, elm, origin, ox}) {
    const {enm: {predefined_formulas: {clr_prm}, comparison_types: ct}} = $p;
    if(!ox && elm) {
      ox = elm.ox;
    }
    if(row_base?.algorithm === clr_prm && ox) {
      let param;
      if(row_base._or) {
        for(const grp of row_base._or.values()) {
          for(const prow of grp) {
            if(prow.origin == "algorithm") {
              param = prow.param;
              break;
            }
            if(param) {
              break;
            }
          }
        }
      }
      if(!param && origin) {
        const ctypes = [ct.get(), ct.eq];
        origin.selection_params.find_rows({elm: row_base.elm}, (prow) => {
          if(ctypes.includes(prow.comparison_type) && prow.param.type.types.includes('cat.clrs') && (!prow.value || prow.value.empty())) {
            param = prow.param;
          }
        });
      }
      if(param) {
        const cnstr = elm?.elm ? [0, -elm.elm] : 0;
        row_spec.clr = (ox || elm.ox).extract_value({cnstr, param});
      }
    }
    return row_spec.clr;
  }

  /**
   * Возвращает цвет по предопределенному цвету при формировании спецификации
   * @param {CatClrs} clr - цвет исходной строки соединения, фурнитуры или вставки
   * @param {CatClrs} clr_elm - цвет элемента
   * @param {CatClrs} clr_sch - цвет изделия
   * @param {BuilderElement} [elm] - элемент рисовалки
   * @param {TabularSection} [spec] - табчасть спецификации для поиска ведущих
   * @param {CatCharacteristicsSpecificationRow} [row] - строка спецификации, где есть `nom`
   * @param {CatInsertsSpecificationRow|CatFurnsSpecificationRow|CatCnnsSpecificationRow} [row_base] - исходная строка вставки, соединения или фурнитуры
   * @return {CatClrs}
   */
  by_predefined(clr, clr_elm, clr_sch, elm, spec, row, row_base) {
    const {predefined_name} = clr;
    const flipped = elm?.layer?.flipped;
    const {clr_by_main_row} = $p.job_prm.builder;
    if(predefined_name) {
      switch (predefined_name) {
      case 'КакЭлемент':
        if(clr_by_main_row && elm?._attr?.row_spec) {
          clr_elm = elm?._attr?.row_spec.clr;
        }
        return flipped ? this.inverted(clr_elm) :  clr_elm;

      case 'КакИзделие':
        return clr_sch;

      case 'КакЭлементСнаружи':
        if(clr_by_main_row && elm?._attr?.row_spec) {
          clr_elm = elm?._attr?.row_spec.clr;
        }
        return flipped ? this.by_predefined({predefined_name: 'КакЭлементИзнутри'}, clr_elm) :
          clr_elm.clr_out.empty() ? clr_elm : clr_elm.clr_out;

      case 'КакЭлементИзнутри':
        if(clr_by_main_row && elm?._attr?.row_spec) {
          clr_elm = elm?._attr?.row_spec.clr;
        }
        return flipped ?
          this.by_predefined({predefined_name: 'КакЭлементСнаружи'}, clr_elm) :
          clr_elm.clr_in.empty() ? clr_elm : clr_elm.clr_in;
        
      case 'КакЭлИзнутриПлюсКонст': {
        if(clr_by_main_row && elm?._attr?.row_spec) {
          clr_elm = elm?._attr?.row_spec.clr;
        }
        clr_elm = clr_elm.clr_in.empty() ? clr_elm : clr_elm.clr_in;
        const row_cond = row_base?._owner?._owner?.selection_params?.find({
          elm: row_base.elm,
          origin: $p.enm.plan_detailing.algorithm,
        });
        if(row_cond) {
          clr_elm = this.getter(`${clr_elm.ref}${row_cond.value.ref}`);
        }
        return flipped ? this.inverted(clr_elm) : clr_elm;
      } 
      
      case 'КакЭлСнаружиПлюсКонст': {
        if(clr_by_main_row && elm?._attr?.row_spec) {
          clr_elm = elm?._attr?.row_spec.clr;
        }
        clr_elm = clr_elm.clr_out.empty() ? clr_elm : clr_elm.clr_out;
        const row_cond = row_base?._owner?._owner?.selection_params?.find({
          elm: row_base.elm,
          origin: $p.enm.plan_detailing.algorithm,
        });
        if(row_cond) {
          clr_elm = this.getter(`${row_cond.value.ref}${clr_elm.ref}`);
        }
        return flipped ? this.inverted(clr_elm) : clr_elm;
      }       
      case 'БезЦветаИзнутри':
        if(clr_by_main_row && elm?._attr?.row_spec) {
          clr_elm = elm?._attr?.row_spec.clr;
        }
        clr_elm = this.getter(`${this.predefined('БезЦвета').ref}${
          (clr_elm.clr_out.empty() ? clr_elm : clr_elm.clr_out).ref}`);
        return flipped ? this.inverted(clr_elm) : clr_elm;

      case 'БезЦветаСнаружи':
        if(clr_by_main_row && elm?._attr?.row_spec) {
          clr_elm = elm?._attr?.row_spec.clr;
        }
        clr_elm = this.getter(`${
          (clr_elm.clr_in.empty() ? clr_elm : clr_elm.clr_in).ref}${this.predefined('БезЦвета').ref}`);
        return flipped ? this.inverted(clr_elm) : clr_elm;

      case 'КакИзделиеСнаружи':
        return flipped ? this.by_predefined({predefined_name: 'КакИзделиеИзнутри'}, clr_elm, clr_sch) :
          clr_sch.clr_out.empty() ? clr_sch : clr_sch.clr_out;

      case 'КакИзделиеИзнутри':
        return flipped ? this.by_predefined({predefined_name: 'КакИзделиеСнаружи'}, clr_elm, clr_sch) :
          clr_sch.clr_in.empty() ? clr_sch : clr_sch.clr_in;

      case 'КакЭлементИнверсный':
        if(clr_by_main_row && elm?._attr?.row_spec) {
          clr_elm = elm?._attr?.row_spec.clr;
        }
        return flipped ? clr_elm : this.inverted(clr_elm);

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
        if(main_rows.length) {
          const row_base = main_rows[0];
          const row_spec = {clr: this.by_predefined(row_base.clr, clr_elm, clr_sch, elm, spec, row, row_base)};
          this.clr_prm({row_base, row_spec, elm, origin: inset});
          return row_spec.clr;
        }
        return clr_elm;
      case 'КакНом':
        const nom = row ? row.nom : (elm && elm.nom);
        return nom ? nom.clr : (clr.empty() ? clr_elm : clr);
      case 'КакВедущий':
      case 'КакВедущийИзнутри':
      case 'КакВедущийСнаружи':
      case 'КакВедущийИнверсный':
        const sub_clr = this.predefined(predefined_name.replace('КакВедущий', 'КакЭлемент'));
        const t_parent = elm?.t_parent?.();
        if(!elm || !t_parent || elm === t_parent){
          return this.by_predefined(sub_clr,  clr_elm);
        }
        let finded;
        spec && spec.find_rows({elm: t_parent.elm, nom: t_parent.nom}, (row) => {
          finded = this.by_predefined(sub_clr,  row.clr);
          return false;
        });
        return finded || this.by_predefined(sub_clr,  t_parent.clr, clr_sch, t_parent, spec, row, row_base);

      default :
        return clr_elm;
      }
    }
    else if (clr instanceof $p.CatColor_price_groups) {
      const tmp = clr.clr.empty() ? clr_elm : this.by_predefined(clr.clr, clr_elm, clr_sch, elm, spec, row, row_base);
      if(tmp.is_composite()) {
        let {clr_in, clr_out} = tmp;
        let tin, tout;
        for(const row of clr.clr_conformity) {
          if(!tin && row.clr1.contains(clr_in)) {
            tin = row.clr2;
          }
          if(!tout && row.clr1.contains(clr_out)) {
            tout = row.clr2;
          }
          if(tin && tout) {
            break;
          }
        }
        if(tin){
          clr_in = tin;
        }
        if(tout){
          clr_out = tout;
        }
        if(clr_in === clr_out) {
          return clr_in;
        }
        return this.getter(clr_in.ref + clr_out.ref);
      }
      else {
        for(const row of clr.clr_conformity) {
          if(row.clr1.contains(tmp)) {
            return row.clr2;
          }
        }
      }
      return tmp;
    }
    else if (clr instanceof $p.CatFormulas) {

    }
    return clr.empty() ? (flipped ? this.inverted(clr_elm) :  clr_elm) : clr;
  }

  /**
   * Инверсный цвет  
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
   * @summary Формирует строки контрастных цветов
   * @desc для подстановки в css
   * @param clr_str
   * @return {Object}
   */
  contrast(clr_str) {
    let hex = '',
      clrs = null;
    if (clr_str.length === 3) {
      hex = '';
      for (let i = 0; i < 3; i++) {
        hex += clr_str[i];
        hex += clr_str[i];
      }
      hex = parseInt(hex, 16);
    }
    else if (clr_str.length === 6) {
      hex = parseInt(clr_str, 16);
    }
    if (hex) {
      let back = hex.toString(16);
      while (back.length < 6) {
        back = '0' + back;
      }
      back = '#' + back;
      let clr = (0xafafaf ^ hex).toString(16);
      while (clr.length < 6) {
        clr = '0' + clr;
      }
      clr = '#' + clr;
      clrs = {
        backgroundColor: back,
        color: clr
      };
    }
    return clrs;
  }

  /**
   * Возвращает предопределенный цвет НеВключатьВСпецификацию
   */
  ignored() {
    return this.predefined('НеВключатьВСпецификацию');
  }

  /**
   * Скрывает составные цвета в отборе
   * @param mf {Object} метаданные поля
   * @param [clr_group] {CatColor_price_groups} цветогруппа
   * @param [side] {EmnCnnSides} сторона цвета
   */
  hide_composite(mf, clr_group, side) {
    const choice_param = mf.choice_params && mf.choice_params.find(({name}) => name === 'parent');
    const {composite_clr_folder: ccf} = $p.job_prm.builder;
    if(typeof side === 'string') {
      side = $p.enm.cnn_sides[side];
    }
    if(choice_param && choice_param.path.not) {
      choice_param.path = {nin: [choice_param.path.not, ccf]};
    }
    else if(choice_param && choice_param.path.nin && !choice_param.path.nin.find(v => v === ccf)) {
      choice_param.path.nin.push(ccf);
    }
    else {
      if(!mf.choice_params) {
        mf.choice_params = [{
          name: 'parent',
          path: {not: ccf},
        }];
      }
    }
    if(clr_group && side) {
      const srows = clr_group.exclude.find_rows({side}).map(({_row}) => _row.clr);
      const choice_param = srows.length && mf.choice_params.find(({name}) => name === 'ref');
      if(choice_param) {
        const {path} = choice_param;
        if(path.in) {
          delete choice_param.path;
          choice_param.path = {in: path.in.filter((o) => !srows.some((cg) => cg.contains(o)))};
        }
      }
    }
  }

  /**
   * Дополняет связи параметров выбора отбором, исключающим служебные цвета
   * @param mf {Object} - описание метаданных поля
   * @param sys {Object} - объект, у которого можно спросить связи
   * @param [project] {Scheme} - текущий проект
   */
  selection_exclude_service(mf, sys, project) {
    if(mf.choice_params) {
      mf.choice_params.length = 0;
    }
    else {
      mf.choice_params = [];
    }

    const {job_prm, cat: {clrs}, CatClrs, CatColor_price_groups, DpBuyers_order, Editor} = $p;
    
    if(!project && sys instanceof Editor.BuilderElement) {
      project = sys.project;
    }

    mf.choice_params.push({
      name: 'parent',
      path: {not: clrs.predefined('СЛУЖЕБНЫЕ')}
    });

    if(sys) {

      // связи параметров для цвета изделия
      const {clr_product} = job_prm.properties;
      const filter = {}
      if(clr_product && sys instanceof DpBuyers_order) {
        const links = clr_product.params_links({obj: {project, _owner: {_owner: sys.characteristic}}});
        // проверим вхождение значения в доступные и при необходимости изменим
        if(links.length) {
          clr_product.filter_params_links(filter, null, links);
          filter.ref && mf.choice_params.push({
            name: 'ref',
            path: filter.ref,
          });
        }
      }

      // фильтр доступных цветов системы или вставки
      let clr_group = clrs.find_group(sys, project?.ox || project);

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
      else if(filter.ref?.in && filter.ref.in?.length === 1) {
        mf.single_value = filter.ref.in[0];
      }
      else if(mf.single_value) {
        delete mf.single_value;
      }
      return clr_group;
    }
  }

  /**
   * ищет цветогруппу для sys неопределенного типа
   * @param sys
   * @return {CatColor_price_groups}
   */
  find_group(sys, ox) {
    const {EditorInvisible: {BuilderElement, Filling}, classes: {DataProcessorObj}} = $p;
    let clr_group;
    if(sys instanceof BuilderElement && sys.isInserted()) {
      clr_group = sys.inset.clr_group;
      if(clr_group.empty() && !(sys instanceof Filling)) {
        clr_group = sys.layer.sys.find_group(ox);
      }
    }
    else if(sys.hasOwnProperty('sys') && sys.profile && sys.profile.inset) {
      const iclr_group = sys.profile.inset.clr_group;
      clr_group = iclr_group.empty() ? sys.sys.find_group(ox) : iclr_group;
    }
    else if(sys.sys?.find_group) {
      clr_group = sys.sys.find_group(ox);
    }
    else if(sys.sys?.clr_group) {
      clr_group = sys.sys.clr_group;
    }
    else if(sys instanceof DataProcessorObj && ox) {
      clr_group = ox.sys.find_group(ox);
    }
    else {
      clr_group = sys.find_group ? sys.find_group(ox) : sys.clr_group;
    }
    return clr_group || this.get();
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
   * @return {Object}
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

  /**
   * Аналог метода `contains()` цветоценовых групп
   * @param clr {CatClrs}
   * @param [fake]
   * @param [any] {Boolean}
   * @return {Boolean}
   */
  contains(clr, fake, any) {
    if(clr === this) {
      return true;
    }
    else if (clr.is_composite() && any) {
      return clr.clr_in === this || clr.clr_out === this;
    }
    return  false;
  }

}
