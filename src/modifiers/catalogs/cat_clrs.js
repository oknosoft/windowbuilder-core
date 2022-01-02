
/**
 * ### Дополнительные методы справочника Цвета
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module cat_clrs
 *
 * Created 23.12.2015
 */

$p.cat.clrs.__define({

	/**
	 * ПолучитьЦветПоПредопределенномуЦвету
	 * @param clr {CatClrs} - цвет исходной строки соединения, фурнитуры или вставки
	 * @param clr_elm {CatClrs} - цвет элемента
	 * @param clr_sch {CatClrs} - цвет изделия
	 * @return {CatClrs}
	 */
  by_predefined: {
    value(clr, clr_elm, clr_sch, elm, spec, row) {
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
      return clr.empty() ? clr_elm : clr;
    }
  },

  /**
   * Клиентская часть создания составного цвета
   * @param clr_in {CatClrs} - цвет изнутри
   * @param clr_out {CatClrs} - цвет снаружи
   * @param with_inverted {Boolean} - создавать инверсный
   * @param sync {Boolean} - создавать болванку и возвращать её uid перед запросом к общим данным
   */
  composite: {
    value({clr_in, clr_out, with_inverted = true, sync = false}) {
      const {utils, job_prm, adapters: {pouch}} = $p;
      let by_in_out = this.by_in_out({clr_in, clr_out});
      let ref;
      if(!by_in_out.empty()) {
        return by_in_out;
      }
      if(clr_in.empty()) {
        return clr_out;
      }
      if(clr_out.empty()) {
        return clr_in;
      }
      if(sync) {
        ref = utils.generate_guid();
        by_in_out = this.create({
          ref,
          clr_in: clr_in.ref,
          clr_out: clr_out.ref,
          name: `${clr_in.name} \\ ${clr_out.name}`,
          parent: job_prm.builder.composite_clr_folder,
        });
      }
      const req = pouch.fetch(pouch.props.path.replace(job_prm.local_storage_prefix, 'common/cat.clrs/composite'), {
        method: 'POST',
        body: JSON.stringify({ref, clr_in: clr_in.ref, clr_out: clr_out.ref, with_inverted}),
      })
        .then((res) => res.json())
        .then((res) => {
          this.load_array([res.clr, res.inverted]);
          // чистим кеш цветогрупп
          cat.color_price_groups.forEach(({_data}) => {
            delete _data.clrs;
          });
          return this.get(res.clr);
        });
      return sync ? by_in_out : req;
    }
  },

	/**
	 * Дополняет связи параметров выбора отбором, исключающим служебные цвета
	 * @param mf {Object} - описание метаданных поля
	 */
	selection_exclude_service: {
		value(mf, sys) {

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
	},

	/**
	 * Форма выбора с фильтром по двум цветам, создающая при необходимости составной цвет
	 */
	form_selection: {
		value(pwnd, attr) {

		  const eclr = this.get();

			attr.hide_filter = true;

      attr.toolbar_click = function (btn_id, wnd){

        // если указаны оба цвета
        if(btn_id == 'btn_select' && !eclr.clr_in.empty() && !eclr.clr_out.empty()) {

          // если цвета изнутри и снаружи одинаковы, возвращаем первый
          if(eclr.clr_in == eclr.clr_out) {
            pwnd.on_select.call(pwnd, eclr.clr_in);
          }
          else {
            // дополнительно проверяем обратный цвет
            const {wsql, job_prm, utils, cat, adapters: {pouch}} = $p;
            const clrs = [eclr, {clr_in: eclr.clr_out, clr_out: eclr.clr_in}]
              .map(({clr_in, clr_out}, index) => {
                // ищем в справочнике цветов
                const ares = wsql.alasql("select top 1 ref from cat_clrs where clr_in = ? and clr_out = ? and (not ref = ?)",
                  [clr_in.ref, clr_out.ref, utils.blank.guid]);

                // если цвет найден - возвращаем
                if(ares.length) {
                  return Promise.resolve(cat.clrs.get(ares[0]));
                }
                // если включены общие данные - отдельный алгоритм
                else if(cat.clrs.metadata().common) {
                  if(index > 0) {
                    return Promise.resolve();
                  }
                  return pouch.fetch(pouch.props.path.replace(job_prm.local_storage_prefix, 'common/cat.clrs/composite'), {
                    method: 'POST',
                    body: JSON.stringify({clr_in: clr_in.ref, clr_out: clr_out.ref}),
                  })
                    .then((res) => res.json())
                    .then((res) => {
                      cat.clrs.load_array([res.clr, res.inverted]);
                      // чистим кеш цветогрупп
                      cat.color_price_groups.forEach(({_data}) => {
                        delete _data.clrs;
                      });
                      return cat.clrs.get(res.clr);
                    });
                }
                // если не нашли и нет общих данных - создаём по старинке
                return cat.clrs.create({
                  clr_in,
                  clr_out,
                  name: `${clr_in.name} \\ ${clr_out.name}`,
                  parent: job_prm.builder.composite_clr_folder
                })
                  // регистрируем цвет в couchdb
                  .then((obj) => obj.register_on_server());
              });

            Promise.all(clrs)
              .then((objs) => pwnd.on_select.call(pwnd, objs[0]))
              .catch((err) => $p.msg.show_msg({
                type: 'alert-warning',
                text: err && err.message || 'Недостаточно прав для добавления составного цвета',
                title: 'Составной цвет'
              }));
          }

          wnd.close();
          return false;
        }
      };

      const wnd = this.constructor.prototype.form_selection.call(this, pwnd, attr);

      function get_option_list(selection, val) {

        selection.clr_in = $p.utils.blank.guid;
        selection.clr_out = $p.utils.blank.guid;

        if(attr.selection) {
          attr.selection.some((sel) => {
            for (const key in sel) {
              if(key == 'ref') {
                selection.ref = sel.ref;
                return true;
              }
            }
          });
        }

        return this.constructor.prototype.get_option_list.call(this, selection, val);
      }

			return (wnd instanceof Promise ? wnd : Promise.resolve(wnd))
				.then((wnd) => {

					const tb_filter = wnd.elmnts.filter;

          tb_filter.__define({
            get_filter: {
              value() {
                const res = {
                  selection: []
                };
                if(clr_in.getSelectedValue()) {
                  res.selection.push({clr_in: clr_in.getSelectedValue()});
                }
                if(clr_out.getSelectedValue()) {
                  res.selection.push({clr_out: clr_out.getSelectedValue()});
                }
                if(res.selection.length) {
                  res.hide_tree = true;
                }
                return res;
              }
            }
          });

          wnd.attachEvent('onClose', () => {
            clr_in.unload();
            clr_out.unload();
            eclr.clr_in = $p.utils.blank.guid;
            eclr.clr_out = $p.utils.blank.guid;
            return true;
          });


					eclr.clr_in = $p.utils.blank.guid;
					eclr.clr_out = $p.utils.blank.guid;

          // Создаём элементы управления
          const clr_in = new $p.iface.OCombo({
            parent: tb_filter.div.obj,
            obj: eclr,
            field: 'clr_in',
            width: 160,
            hide_frm: true,
            get_option_list: get_option_list
          });
          const clr_out = new $p.iface.OCombo({
            parent: tb_filter.div.obj,
            obj: eclr,
            field: 'clr_out',
            width: 160,
            hide_frm: true,
            get_option_list: get_option_list
          });

          clr_in.DOMelem.style.float = 'left';
          clr_in.DOMelem_input.placeholder = 'Цвет изнутри';
          clr_out.DOMelem_input.placeholder = 'Цвет снаружи';

          clr_in.attachEvent('onChange', tb_filter.call_event);
          clr_out.attachEvent('onChange', tb_filter.call_event);
          clr_in.attachEvent('onClose', tb_filter.call_event);
          clr_out.attachEvent('onClose', tb_filter.call_event);

          // гасим кнопки управления
          wnd.elmnts.toolbar.hideItem('btn_new');
          wnd.elmnts.toolbar.hideItem('btn_edit');
          wnd.elmnts.toolbar.hideItem('btn_delete');

          wnd.elmnts.toolbar.setItemText('btn_select', '<b>Выбрать или создать</b>');

					return wnd;

				});
    },
    configurable: true,
    writable: true,
	},

	/**
	 * Изменяем алгоритм построения формы списка. Игнорируем иерархию, если указаны цвета изнутри или снаружи
	 */
	sync_grid: {
		value(attr, grid) {

			if(attr.action == "get_selection" && attr.selection && attr.selection.some(function (v) {
				return v.hasOwnProperty("clr_in") || v.hasOwnProperty("clr_out");
				})){
				delete attr.parent;
				delete attr.initial_value;
			}

			return $p.classes.DataManager.prototype.sync_grid.call(this, attr, grid);
		}
	},


});

$p.CatClrs = class CatClrs extends $p.CatClrs {

  // записывает элемент цвета на сервере
  register_on_server() {
    if(this.parent !== $p.job_prm.builder.composite_clr_folder) {
      return Promise.reject(new Error('composite_clr_folder'));
    }
    const {pouch} = $p.adapters;
    return pouch.save_obj(this, {db: pouch.remote.ram});
  }

  // возвращает стороны, на которых цвет
  get sides() {
    const res = {is_in: false, is_out: false};
    if(!this.empty() && !this.predefined_name){
      if(this.clr_in.empty() && this.clr_out.empty()){
        res.is_in = res.is_out = true;
      }
      else{
        if(!this.clr_in.empty() && !this.clr_in.predefined_name){
          res.is_in = true;
        }
        if(!this.clr_out.empty() && !this.clr_out.predefined_name){
          res.is_out = true;
        }
      }
    }
    return res;
  }
};


