

exports.CatOrganizationsManager = class CatOrganizationsManager extends Object {

  load_array(aattr, forse) {
    // если внутри организации завёрнуты счета - вытаскиваем
    const aaccounts = [];
    for(const row of aattr) {
      if(row.accounts) {
        row.accounts.forEach((v) => {
          v.owner = row.ref;
          aaccounts.push(v);
        });
        delete row.accounts;
      }
    }
    const res = super.load_array(aattr, forse);
    const {partner_bank_accounts} = this._owner;
    aaccounts.length && partner_bank_accounts.load_array(aaccounts, forse);

    return res;
  }

};

exports.CatOrganizations = class CatOrganizations extends Object {

  toJSON() {
    const {classes: {TabularSectionRow, CatObj}, CatOrganizations} = $p;
    
    if(this instanceof CatOrganizations) {
      const json = CatObj.prototype.toJSON.call(this);
      const accounts = [];
      this._manager._owner.partner_bank_accounts.find_rows({owner: this}, (o) => {
        const raw = o.toJSON();
        delete raw.owner;
        accounts.push(raw);
      });
      if(accounts.length) {
        json.accounts = accounts;
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
