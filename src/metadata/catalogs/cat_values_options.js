
exports.CatValues_options = class CatValues_options extends Object {
  
  option_value({elm, ...other}) {
    const {values, owner} = this;
    for(const {key, value} of values) {
      if(key.check_condition({elm, ...other})) {
        return owner.fetch_type(value);
      }
    }
    if(values.length) {
      return owner.fetch_type(values[values.length-1]);
    }
  }
}
