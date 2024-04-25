
exports.DocWork_centers_taskManager = class DocWork_centers_taskManager extends Object {
  
  get cut_defaults() {
    if(!this._cut_defaults) {
      const {$p: {job_prm}} = this._owner;
      this._cut_defaults = Object.freeze({
        iterations: 2900,
        size: 210,        // размер популяции
        crossover: 0.19,
        mutation: 0.26,
        random: 0.21,
        skip: 55,         // прекращаем итерации, если решение не улучшилось за 55 шагов
        webWorkers: !job_prm.is_node,
        batch: 101,       // размер партии
        usefulscrap: 610, // деловой остаток
      });
    }
    return this._cut_defaults;
  }
}


exports.DocWork_centers_task = class DocWork_centers_task extends Object {

  /**
   * значения по умолчанию при создании документа
   * @return {DocWork_centers_task}
   */
  after_create() {
    const {$p} = this._manager._owner;
    if(this.is_new()) {
      this.date = new Date();
    }
    if(!$p.job_prm.is_node && this.responsible.empty()) {
      this.responsible = $p.current_user;
    }
    return this;
  }

  /**
   * значения по умолчанию при добавлении строки
   * @param {TabularSectionRow} row
   * @param {Object} [attr]
   */
  add_row(row, attr) {
    if(row?._owner === this.cuts) {
      if(!row.stick && !attr?.stick) {
        const {_obj} = row._owner;
        row._obj.stick = 1 + (_obj.length ? Math.max.apply(null, _obj.map(({stick}) => stick)) : 0);
      }
    }
  }

  /**
   * Заполняет план по массиву заказов
   * @param {Array<String|DataObj>} refs
   * @return {Promise<void>}
   */
  fill_by_orders(refs) {
    const orders = [];
    const {$p: {utils}, calc_order} = this._manager._owner;
    return refs.reduce((sum, ref) => {
      return sum.then(() => {
        if(utils.is_data_obj(ref)){
          orders.push(ref);
        }
        else {
          return calc_order.get(ref, 'promise')
            .then((ref) => orders.push(ref));
        }
      });
    }, Promise.resolve())
      .then(() => {
        return orders.reduce((sum, order) => {
          return sum.then(() => {
            return order.load_production()
              .then((prod) => {
                order.production.forEach((row) => {
                  // нас интересуют только продукции
                  if(!prod.includes(row.characteristic)) {
                    return;
                  }
                  // и только те продукции, у которых в спецификации есть материалы к раскрою
                  row.characteristic.specification.forEach((srow) => {
                    if(srow.len && !srow.nom.cutting_optimization_type.empty() && !srow.nom.cutting_optimization_type.is('Нет')){
                      for(let i = 1; i <= row.quantity; i++) {
                        this.planning.add({obj: row.characteristic, specimen: i});
                      }
                      return false;
                    }
                  });
                });
              });
          });
        }, Promise.resolve());
      });
  }

  fill_by_keys(opts = {}) {
    const {set, cutting, planning} = this;
    
    // старый раскрой чистим
    cutting.clear();
    planning.clear();
    for(const srow of set) {
      const {obj: {obj, type, specimen, region}, stage} = srow;
      // для ключей типа 'Изделие', добавляем все строки, привязанные к этапу производства
      if(type.is('product')) {
        obj.specification.find_rows({stage}, (row) => {
          const {cutting_optimization_type: ct, is_procedure, is_service} = row.nom;
          if(!row.len || is_procedure || is_service) {
            return;
          }
          if(!ct.empty() && !ct.is('no')) {
            this.cutting_row({obj, specimen, row, opts});
          }
        });
      }
    }
  }

  cutting_row({obj, specimen, elm, row, opts}) {
    // если планирование до элемента...
    if(elm && row.elm !== elm) {
      return;
    }
    // по типам оптимизации
    if(row.width && !opts.bilinear && !opts.c2d) {
      return;
    }
    // должен существовать элемент
    const coord = obj.coordinates.find({elm: row.elm});
    if(!coord) {
      return;
    }
    // только для цветных
    if(opts.clr_only) {
      if(row.clr.empty() || /Белый|БезЦвета/.test(row.clr.predefined_name) ) {
        return;
      }
    }
    for(let qty = 1;  qty <= row.qty; qty++) {
      this.cutting.add({
        production: obj,
        specimen,
        elm: row.elm,
        nom: row.nom,
        characteristic: row.characteristic.empty() ? row.clr : row.characteristic,
        len: (row.len * 1000).round(0),
        width: (row.width * 1000).round(0),
        orientation: coord.orientation,
        elm_type: coord.elm_type,
        alp1: row.alp1,
        alp2: row.alp2,
      });
    }
  }
  
  /**
   * Заполняет табчасть раскрой по плану
   * @param opts {Object}
   * @param opts.clear {Boolean}
   * @param opts.linear {Boolean}
   * @param opts.bilinear {Boolean}
   * @param opts.clr_only {Boolean}
   * @return {Promise<void>}
   */
  fill_cutting(opts) {
    const {planning, cutting} = this;
    if(opts.clear) {
      cutting.clear();
    }
    // получаем спецификации продукций
    return this.load_linked_refs()
      .then(() => {
        planning.forEach(({obj, specimen, elm}) => {
          obj.specification.forEach((row) => {
            // только строки подлежащие раскрою
            if(!row.len || row.nom.cutting_optimization_type.empty() || row.nom.cutting_optimization_type.is('no')) {
              return;
            }
            this.cutting_row({obj, specimen, elm, row, opts});
            
            
            
          });
        });
      });
  }

  /**
   * Возвращает свёрнутую структуру номенклатур, характеристик и партий раскроя
   */
  fragments(noParts) {
    const {_owner: {$p: {utils}}, cut_defaults} = this._manager;
    const res = new Map();
    const fin = [];
    for(const row of this.cutting) {
      if(!res.has(row.nom)) {
        res.set(row.nom, new Map());
      }
      const nom = res.get(row.nom);
      if(!nom.has(row.characteristic)) {
        nom.set(row.characteristic, []);
      }
      const characteristic = nom.get(row.characteristic);
      if(!noParts) {
        row.stick = 0;
        row.part = 0;
      }
      characteristic.push(row);
    }
    if(noParts) {
      return res;
    }
    // расставим партии
    for(const [nom, characteristics] of res) {
      for(const [characteristic, rows] of characteristics) {
        if(rows.length > cut_defaults.batch) {
          rows.sort(utils.sort('len'));
          const parts = (rows.length / cut_defaults.batch + 0.5).round();
          const part = (rows.length / parts).round();
          for(let i1 = 0; i1 < part; i1++) {
            for(let i2 = 0; i2 < parts; i2++) {
              const rowNum = i1 * parts + i2;
              if(rowNum >= rows.length) {
                continue;
              }
              const row = rows[rowNum];
              if(!row.pair) {
                row.part = i2;
              }
              else {
                for(const prow of rows) {
                  if(prow.pair === row.pair) {
                    prow.part = i2;
                  }
                }
              }
            }
          }
          for(let part = 0; part < parts; part++) {
            fin.push({nom, characteristic, part, parts, rows: rows.filter((row) => row.part === part)});
          }
        }
        else {
          fin.push({nom, characteristic, part: 0, parts: 1, rows});
        }
      }
    }
    return fin;
  }

  /**
   * Выполняет оптимизацию раскроя
   * @param opts
   * @return {Promise<void>}
   */
  optimize({onStep}) {
    const {$p: {classes: {Cutting}}} = this._manager._owner;
    const keys = new Set();
    const queues = [Promise.resolve(), Promise.resolve(), Promise.resolve()];
    let index = -1;
    for(const {nom, characteristic, part, parts, rows} of this.fragments()) {
      const key = nom.valueOf() + characteristic.valueOf();
      if(!keys.has(key)) {
        keys.add(key);
        index++;
        if(index > 2) {
          index = 0;
        }
      }
      queues[index] = queues[index].then(() => this.optimize_fragment({
        cutting: new Cutting('1D'),
        rows,
        part,
        parts,
        onStep,
      }));
    }
    const fin = [];
    Object.values(queues).forEach((v, index) => {
      const i = index % 2;
      if(!fin[i]) {
        fin[i] = v;
      }
      else {
        fin[i] = fin[i].then(() => v);
      }
    })
    return Promise.all(fin);
  }

  /**
   * Выполняет оптимизацию фрагмента (номенклатура+характеристика+тип)
   * @param opts
   * @return {Promise<void>}
   */
  optimize_fragment({cutting, rows, onStep, part, parts}) {
    const {_owner: {$p: {job_prm}}, cut_defaults} = this._manager;
    
    return new Promise((resolve) => {

      const doc = this;
      const workpieces = [];
      const cut_row = rows[0];
      if(cut_row) {
        // ищем запись в расходе - её туда могли положить руками, либо подтянулось из остатков
        this.cuts.find_rows({
          _top: 10e6,
          //record_kind: debit_credit_kinds.debit,
          nom: cut_row.nom,
          characteristic: cut_row.characteristic,
        }, (row) => {
          const len = row.len - row.used;
          if(len >= rows[0].len && len >= (cut_row.nom.usefulscrap || cut_defaults.usefulscrap)) {
            workpieces.push(row);
          }
        });
      }

      const config = Object.assign({}, cut_defaults);
      if(rows.length < 13) {
        config.iterations = 100;
      }
      const len0 = rows[0].len;
      if(rows.every(({len}) => len === len0)) {
        config.iterations = 3;
      }
      const userData = {
        products: rows.map((row) => row.len),
        workpieces: workpieces.map((row) => row.len - row.used),
        overmeasure: 0,
        wrongsnipmin: 0,
        wrongsnipmax: 0,
        sticklength: cut_row.nom.len || 6000,
        knifewidth: cut_row.nom.knifewidth || 7,
        usefulscrap: cut_row.nom.usefulscrap || cut_defaults.usefulscrap,
      };
      cutting.genetic.notification = function(pop, generation, stats, isFinished) {

        if(job_prm.idle) {
          job_prm.idle.activity = Date.now();
        }

        if(!generation) {
          return;
        }

        // текущий результат
        const decision = Object.assign({
          cut_row,
          userData,
          cuts: workpieces,
          rows,
          part,
          parts,
          progress: isFinished ? 1 : generation / this.configuration.iterations,
        }, this.fitness(pop[0].entity, true));

        // обновляем интерфейс
        onStep(decision);

        if(isFinished) {
          // обновляем документ
          doc.push_cut_result(decision, part + 1 === parts);
          resolve();
        }

      };

      cutting.evolve(config, userData);

    });
  }

  /**
   * помещает результат раскроя в документ
   */
  push_cut_result(decision, fin) {
    const {$p: {enm: {debit_credit_kinds}}} = this._manager._owner;
    // сначала добавляем заготовки
    for(let i = 0; i < decision.workpieces.length; i++) {
      let workpiece = decision.cuts[i];

      if(workpiece) {
        workpiece.used = workpiece.len - decision.workpieces[i];
        //workpiece.quantity = decision.workpieces[i] / 1000;
      }
      else {
        workpiece = this.cuts.add({
          record_kind: debit_credit_kinds.credit,
          nom: decision.cut_row.nom,
          characteristic: decision.cut_row.characteristic,
          len: decision.userData.sticklength,
          quantity: decision.userData.sticklength / 1000,
        });
        decision.cuts.push(workpiece);
      }
    }

    // проставляем номера палок в раскрое
    for(let i = 0; i < decision.res.length; i++) {
      const {stick} = decision.cuts[decision.res[i]];
      decision.rows[i].stick = stick;
    }
    for(let i = 0; i < decision.res.length; i++) {
      const cut_row = decision.cuts[decision.res[i]];
      const rows = this.cutting.find_rows({stick: cut_row.stick});
      const len = rows.reduce((sum, row) => sum + row.len + decision.userData.knifewidth, 0);
      cut_row.used = len;
    }
    if(fin) {
      // формируем приход деловых остатков
      const workpieces = [];
      this.cuts.find_rows({
        _top: 10e6,
        nom: decision.cut_row.nom,
        characteristic: decision.cut_row.characteristic,
      }, (row) => {
        const len = row.len - row.used;
        if(len >= decision.userData.usefulscrap) {
          workpieces.push({
            record_kind: debit_credit_kinds.debit,
            nom: decision.cut_row.nom,
            characteristic: decision.cut_row.characteristic,
            len,
            quantity: len / 1000,
          });
        }
      });
      for(const raw of workpieces) {
        this.cuts.add(raw);
      }
    }

  }
  
}
