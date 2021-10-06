
exports.CatCurrencies = class CatCurrencies extends Object {

  to_currency(amount, date, to) {
    if(this == to){
      return amount;
    }

    const {job_prm: {pricing}, wsql} = $p;

    if(!to || to.empty()){
      to = pricing.main_currency;
    }

    if(!date){
      date = new Date();
    }
    if(!this._manager.cource_sql){
      this._manager.cource_sql = wsql.alasql.compile('select top 1 * from `ireg_currency_courses` where `currency` = ? and `period` <= ? order by `period` desc');
    }

    let cfrom = {course: 1, multiplicity: 1}, cto = {course: 1, multiplicity: 1};
    if(this !== pricing.main_currency){
      const tmp = this._manager.cource_sql([this.ref, date]);
      if(tmp.length) {
        cfrom = tmp[0];
      }
    }
    if(to !== pricing.main_currency){
      const tmp = this._manager.cource_sql([to.ref, date]);
      if(tmp.length) {
        cto = tmp[0];
      }
    }

    return (amount * cfrom.course / cfrom.multiplicity) * cto.multiplicity / cto.course;
  }
}
