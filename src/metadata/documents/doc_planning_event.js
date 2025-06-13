

exports.DocPlanning_event = class DocPlanning_event extends Object {

  load_keys() {
    return $p.DocWork_centers_task.prototype.load_keys.call(this);
  }
}
