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
    const {server} = $p.job_prm;
    const price_types = new Set();
    for(const id of server.abonents) {
      for(const {acl_obj} of this.by_id(id)?.price_types) {
        price_types.add(acl_obj);
      }
    }
    return Array.from(price_types);
  }
}
