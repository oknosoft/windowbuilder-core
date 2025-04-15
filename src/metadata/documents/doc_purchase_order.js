
exports.DocPurchase_order = class DocPurchase_order extends Object {

  save(...attr) {
    const basisRow = this.basis.orders.find({invoice: this});
    if(basisRow) {
      const {ref, ...raw} = this.toJSON();
      basisRow.dop = raw;
      this._modified = false;
      return Promise.resolve(this);
    }
    return super.save(...attr);
  }
}
