
exports.CatHttp_apis = class CatHttp_apis extends Object {
  prm(identifier) {
    const {_data} = this;
    if(!_data[name]) {
      const prow = this.params.find({identifier});
      if(prow) {
        let {type, values} = prow;
        if(values) {
          try {
            values = JSON.parse(values);
          }
          catch (e) {}
        }
        _data[name] = {type, values};
        if(type === 'enum' && values && values.length) {
          _data[name].subtype = typeof values[0];
        }
      }
      else {
        _data[name] = {};
      }
    }
    return _data[name];
  }
};
