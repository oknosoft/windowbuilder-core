exports.DocCalc_orderManager = class DocCalc_orderManager extends Object {

  direct_load(force) {
    if(this._direct_loaded && !force) {
      return Promise.resolve();
    }

    const {adapters: {pouch}, utils: {moment}, ui} = this._owner.$p;
    const selector = force && force.selector ?
      force.selector :
      {
        startkey: [this.class_name, ...moment().add(1, 'month').format('YYYY-MM-DD').split('-').map(Number)],
        endkey: [this.class_name, ...moment().subtract(5, 'month').format('YYYY-MM-DD').split('-').map(Number)],
        descending: true,
        include_docs: true,
        limit: 8000,
      };

    return pouch.db(this).query('doc/by_date', selector)
      .then(({rows}) => rows.map(({doc}) => {
        doc.ref = doc._id.split('|')[1];
        delete doc._id;
        return doc;
      }))
      .then((docs) => this.load_array(docs))
      .then(() => this._direct_loaded = true)
      .catch((err) => {
        ui ? ui.dialogs.snack({message: `Чтение списка заказов: ${err.message}`}) : console.err(err);
      });
  }

}
