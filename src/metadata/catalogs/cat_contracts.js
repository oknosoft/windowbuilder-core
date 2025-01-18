



exports.CatContracts = class CatContracts extends Object {

  save(attr) {
    const {owner} = this;
    const {_manager, _data, ref, _rev, class_name} = owner;
    _manager.metadata().check_rev = false;
    const raw = {_manager, _obj: owner.toJSON(), _data, ref, _rev, class_name, is_new() {return owner.is_new()}};
    return _manager.adapter.save_obj(raw, attr || {});
  }

};
