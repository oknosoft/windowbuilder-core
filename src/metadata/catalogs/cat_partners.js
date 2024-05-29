
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
          acontracts.push(v);
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
    const {classes: {TabularSectionRow, CatObj}, CatPartners} = $p;
    
    if(this instanceof CatPartners) {
      const json = CatObj.prototype.toJSON.call(this);
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
      if(accounts.length) {
        json.accounts = accounts;
      }
      if(contracts.length) {
        json.contracts = contracts;
      }
      return json;
    }
    else {
      const {_obj} = this;
      if(_obj?._row instanceof TabularSectionRow) {
        return _obj;
      }
    }

    return this?.toJSON ? this.toJSON() : this;
  }

};
