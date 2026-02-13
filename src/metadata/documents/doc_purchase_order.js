
exports.DocPurchase_order = class DocPurchase_order extends Object {

  // при изменении реквизита
  value_change(field, type, value) {
    const ads = [];
    const {enm: {contract_kinds: {СПоставщиком}}, cat: {contracts}} = $p;
    if(field === 'organization') {
      this.organization = value;
      if(this.contract.organization != value) {
        this.contract = contracts.by_partner_and_org(this.partner, value, СПоставщиком);
        !this.constructor.prototype.hasOwnProperty('new_number_doc') && this.new_number_doc();
        ads.push('contract');
      }
    }
    else if(field === 'partner' && this.contract.owner != value) {
      this.contract = contracts.by_partner_and_org(value, this.organization, СПоставщиком);
      ads.push('contract');
    }
    ads.length && this._manager.emit_add_fields(this, ads);
  }

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
