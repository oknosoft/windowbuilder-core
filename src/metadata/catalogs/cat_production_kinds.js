
exports.CatProduction_kinds = class CatProduction_kinds extends Object {
  
  get allStages() {
    let res = new Set();
    for(const {stage} of this.stages) {
      if(stage instanceof this.constructor) {
        for(const sub of stage.allStages) {
          res.add(sub);
        }
      }
      else if(stage) {
        res.add(stage);
      }
    }
    return Array.from(res);
  }
}
