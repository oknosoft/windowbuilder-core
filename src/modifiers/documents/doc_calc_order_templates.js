/**
 * ### Модуль менеджера документа Расчет-заказ
 * Методы работы с шаблонами из отдельной базы
 *
 *
 * @module doc_calc_order
 */

(({adapters: {pouch}, classes, cat, doc, job_prm, md, pricing, utils}) => {

  const _mgr = doc.calc_order;

  // начальная загрузка локальной базы templates из файлов
  function from_files(start) {
    return start ? pouch.from_files(pouch.local.templates, pouch.remote.templates) : Promise.resolve();
  }

  // освежает содержимое локальной базы templates
  function refresh_doc(start) {
    if(pouch.local.templates && pouch.remote.templates) {
      return from_files(start)
        .then((rres) => {
          return pouch.local.templates.replicate.from(pouch.remote.templates,
            {
              batch_size: 300,
              batches_limit: 3,
            })
            .on('change', (info) => {
              info.db = 'templates';
              pouch.emit_async('repl_state', info);
              if(!start && info.ok) {
                for(const {doc} of info.docs) {
                  if(doc.class_name === 'doc.nom_prices_setup') {
                    setTimeout(pricing.by_doc.bind(pricing, doc), 1000);
                  }
                }
              }
            })
            .then((info) => {
              // doc_write_failures: 0
              // docs_read: 8573
              // docs_written: 8573
              // end_time: '2018-06-28T20:15:25'
              // errors: []
              // last_seq: '8573'
              // ok: true
              // start_time: '2018-06-28T20:13:55'
              // status: 'complete'
              info.db = 'templates';
              pouch.emit_async('repl_state', info);
              return rres;
            })
            .catch((err) => {
              err.result.db = 'templates';
              pouch.emit_async('repl_state', err.result);
              $p.record_log(err);
            });
        });
    }
    else {
      return Promise.resolve();
    }
  }

  function patch_cachable() {
    const names = [
      'cat.parameters_keys',
      'cat.stores',
      'cat.delivery_directions',
      'cat.cash_flow_articles',
      'cat.nonstandard_attributes',
      'cat.projects',
      'cat.choice_params',
      'cat.nom_prices_types',
      'cat.scheme_settings',
      'doc.nom_prices_setup',
    ];
    for(const name of names) {
      const meta = md.get(name);
      meta.cachable = meta.cachable.replace(/^doc/, 'templates');
    }
  }

  function direct_templates() {
    if(!pouch.props._suffix || !job_prm.templates) {
      !pouch.local.templates && pouch.local.__define('templates', {
        get() {
          return pouch.remote.doc;
        },
        configurable: true,
        enumerable: false
      });
    }
    return Promise.resolve();
  }

  // обработчик события
  function on_log_in() {

    // для корневой базы ничего делать не надо
    if(!pouch.props._suffix || !job_prm.templates) {
      return direct_templates();
    }
    else {
      patch_cachable();
    }

    const {__opts} = pouch.remote.ram;
    pouch.remote.templates = new classes.PouchDB(__opts.name.replace(/ram$/, 'templates'),
      {skip_setup: true, adapter: 'http', auth: __opts.auth});

    // если автономный режим - подключаем refresher
    if(pouch.props.direct) {
      !pouch.local.templates && pouch.local.__define('templates', {
        get() {
          return pouch.remote.templates;
        },
        configurable: true,
        enumerable: false
      });
    }
    else {
      pouch.local.templates = new classes.PouchDB('templates', {adapter: 'idb', auto_compaction: true, revs_limit: 3});
      setInterval(refresh_doc, 600000);
      return refresh_doc(true)
        .then((rres) => {
          return typeof rres === 'number' && pouch.rebuild_indexes('templates');
        });
    }

  }

  // обработчик события
  function user_log_out() {
    if(pouch.local.templates && !pouch.local.hasOwnProperty('templates')) {
      delete pouch.local.templates;
    }
  }

  pouch.on({on_log_in, user_log_out});

  pouch.once('pouch_doc_ram_loaded', direct_templates);

  // копирует заказ, возвращает промис с новым заказом
  _mgr.clone = async function(src) {

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
    if(!clone) {
      utils._mixin(dst._obj, others, null,
        'ref,date,number_doc,posted,_deleted,number_internal,production,planning,manager,obj_delivery_state'.split(','));
    }

    // заполняем продукцию и сохраненные эскизы
    const map = new Map();

    // создаём характеристики и заполняем данными исходного заказа
    const src_ref = src.ref;
    src.production.forEach((row) => {
      const prow = Object.assign({}, row._obj || row);
      if(row.characteristic.calc_order == src_ref) {
        const tmp = {calc_order: dst.ref};
        if(clone) {
          utils._mixin(tmp, (row.characteristic._obj || row.characteristic), null, ['calc_order']);
        }
        const cx = prow.characteristic = cat.characteristics.create(tmp, false, true);
        if(!clone) {
          utils._mixin(cx._obj, (row.characteristic._obj || row.characteristic), null, 'ref,name,calc_order,timestamp,_rev'.split(','));
        }
        if(cx.coordinates.count() && refill_props) {
          cx._data.refill_props = true;
        }
        map.set(row.characteristic.valueOf(), cx);
      }
      dst.production.add(prow);
    });

    // обновляем leading_product
    dst.production.forEach((row) => {
      if(row.ordn) {
        const cx = map.get(row.ordn.valueOf());
        if(cx) {
          row.ordn = row.characteristic.leading_product = cx;
        }
      }
    });

    // если сказано перезаполнять параметры - перезаполняем и пересчитываем
    if(!clone && refill_props) {
      await dst.recalc();
    }

    return dst.save();
  }

})($p);
