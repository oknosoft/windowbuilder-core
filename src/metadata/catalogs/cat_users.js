/*
 * Дополнительные методы справочника _Пользователи_
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module cat_users_acl
 */


exports.CatUsersManager = class CatUsersManager extends Object {

  // после загрузки пользователей, морозим объект, чтобы его невозможно было изменить из интерфейса
  load_array(aattr, forse) {
    const res = [];
    for (let aobj of aattr) {
      let obj = this.by_ref[aobj.ref];
      if(obj && !obj.is_new()) {
        continue;
      }
      if(!aobj.acl_objs) {
        aobj.acl_objs = [];
      }
      const {acl} = aobj;
      delete aobj.acl;
      if(obj) {
        obj._mixin(aobj);
      }
      else {
        obj = new $p.CatUsers(aobj, this, true);
      }

      const {_obj} = obj;
      if(_obj && !_obj._acl) {
        _obj._acl = acl;
        obj._set_loaded();
        Object.freeze(obj);
        Object.freeze(_obj);
        for (let j in _obj) {
          if(typeof _obj[j] == 'object') {
            Object.freeze(_obj[j]);
            for (let k in _obj[j]) {
              typeof _obj[j][k] == 'object' && Object.freeze(_obj[j][k]);
            }
          }
        }
        res.push(obj);
      }
    }
    return res;
  }

  // пользователей не выгружаем
  unload_obj() {	}

}

//exports.CatUsersManager._freeze = true;

//exports.CatUsers = class CatUsers {};
