
exports.CatPartnersManager = class CatPartnersManager extends Object {

  load_array(aattr, forse) {
    // если внутри контрагента завёрнуты счета и договоры - вытаскиваем
    const aaccounts = [];
    const acontracts = [];
    for(const row of aattr) {
      if(row.accounts) {
        row.accounts.forEach((v) => {
          v.owner = row.ref;
          aaccounts.push(v);
        });
        delete row.accounts;
      }
      if(row.contracts) {
        row.contracts.forEach((v) => {
          v.owner = row.ref;
          contracts.push(v);
        });
        delete row.contracts;
      }
    }
    const res = super.load_array(aattr, forse);
    const {partner_bank_accounts, contracts} = this._owner;
    aaccounts.length && partner_bank_accounts.load_array(aaccounts, forse);
    acontracts.length && contracts.load_array(acontracts, forse);

    return res;
  }

};

exports.CatPartners = class CatPartners extends Object {

  toJSON() {
    const json = Object.getPrototypeOf(this.constructor).prototype.toJSON.call(this);
    const accounts = [];
    const contracts = [];
    const {_owner} = this._manager;
    _owner.partner_bank_accounts.find_rows({owner: this}, (o) => {
      const raw = o.toJSON();
      delete raw.owner;
      accounts.push(raw);
    });
    _owner.contracts.find_rows({owner: this}, (o) => {
      const raw = o.toJSON();
      delete raw.owner;
      contracts.push(raw);
    });
    if(accounts) {
      json.accounts = accounts;
    }
    if(contracts) {
      json.contracts = contracts;
    }
    return json;
  }

};
