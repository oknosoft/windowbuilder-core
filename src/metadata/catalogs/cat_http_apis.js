
exports.CatHttp_apis = class CatHttp_apis extends Object {
  prm(identifier) {
    const {_data} = this;
    const key = `prm_${identifier}`;
    if(!_data[key]) {
      const prow = this.params.find({identifier});
      if(prow) {
        let {type, values, name} = prow;
        if(values) {
          try {
            values = JSON.parse(values);
          }
          catch (e) {}
        }
        _data[key] = {type, values, name};
        if(type === 'enum' && values && values.length) {
          _data[key].subtype = typeof values[0];
        }
      }
      else {
        _data[key] = {};
      }
    }
    return _data[key];
  }
};
