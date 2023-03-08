
exports.CatValues_options = class CatValues_options extends Object {
  
  
  option_value({elm, ...other}) {
    const {values} = this;
    for(const {key, value} of values) {
      if(key.check_condition({elm, ...other})) {
        return value;
      }
    }
    if(values.length) {
      return values[values.length-1];
    }
  }
}
