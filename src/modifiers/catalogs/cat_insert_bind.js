
/**
 * Дополнительные методы справочника Привязки вставок
 *
 * Created 21.04.2017
 */

$p.cat.insert_bind.__define({

  /**
   * Возвращает массив допвставок с привязками к изделию или слою
   * @param ox {CatCharacteristics}
   * @param [order] {Boolean}
   * @return {Array}
   */
  insets: {
    value(ox, order = false) {
      const {sys, owner} = ox;
      const res = [];
      const {Заказ} = $p.enm.inserts_types;
      this.forEach((o) => {
        o.production.forEach((row) => {
          const {nom} = row;
          if((sys && sys._hierarchy(nom)) || (owner && owner._hierarchy(nom))){
            o.inserts.forEach(({inset, elm_type}) => {
              if(!res.some((irow) => irow.inset == inset &&  irow.elm_type == elm_type)){
                if(!order && inset.insert_type !== Заказ) {
                  res.push({inset, elm_type});
                }
                else if(order && inset.insert_type === Заказ) {
                  res.push({inset, elm_type});
                }
              }
            });
          }
        })
      })
      return res;
    }
  }

});

