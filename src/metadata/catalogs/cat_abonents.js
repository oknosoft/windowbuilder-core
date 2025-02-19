/*
 * ### Дополнительные методы справочника _Абоненты_
 *
 * Created 18.12.2017.
 */

exports.CatAbonentsManager = class CatAbonentsManager extends Object {

  get current() {
    const {session_zone, zone} = $p.job_prm;
    return this.by_id(session_zone || zone);
  }
  
  get price_types() {
    const {pricing} = $p.job_prm;
    return [pricing.price_type_first_cost];
  }
}
