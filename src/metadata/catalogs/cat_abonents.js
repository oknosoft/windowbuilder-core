/*
 * ### Дополнительные методы справочника _Отделы абонентов_
 *
 * Created 18.12.2017.
 */

exports.CatAbonentsManager = class CatAbonentsManager extends Object {

  get current() {
    const {session_zone, zone} = $p.job_prm;
    return this.by_id(session_zone || zone);
  }
}
