
/**
 * Обёртка строки табчасти параметра
 */
class BuilderPrmRow {

  constructor(_owner, _row) {
    this._owner = _owner;
    this._row = _row;
  }

  get row() {
    return this._row.row;
  }

  get param() {
    return this._row.param;
  }

  get inset() {
    return this._row.inset;
  }

  get sorting_field() {
    return this.param.sorting_field;
  }

  get value() {
    return this._row.value;
  }
  set value(value) {
    if(this.value == value) {
      return;
    }
    const {inset, param, _owner, _row} = this;
    const {params, cnstr} = _owner;
    if(_row.cnstr) {
      const prow = params.find({cnstr: 0, param, inset});
      if(prow?.value == value) {
        params.del(_row);
        this._row = prow;
      }
      else {
        _row.value = value;
      }
    }
    else {
      this._row = params.add({cnstr, param, inset, value});
    }
  }
}

/**
 * Свойства слоя или элемента
 *
 * Created by Evgeniy Malyarov on 11.04.2022.
 */
class BuilderPrms {

  constructor({elm, layer}) {
    this.elm = elm;
    this.layer = layer;
    this.cnstr = layer ? layer.cnstr : elm.elm;
  }

  get _name() {
    return 'params';
  }

  get _owner() {
    return this.elm ? (elm.prm_ox || elm.ox) : this.layer._ox;
  }

  get params() {
    return this._owner.params;
  }

  find_rows({inset}, cb) {
    const {cnstr, params} = this;
    const map = new Map();
    const cnstrs = [0, cnstr];
    for(const row of params) {
      if(cnstrs.includes(row.cnstr) && row.inset == inset && !row.hide) {
        if(!map.has(row.param) || row.cnstr) {
          map.set(row.param, row);
        }
      }
    }
    const res = [];
    for(const [param, row] of map) {
      res.push(new BuilderPrmRow(this, row));
    }

    res.sort($p.utils.sort('sorting_field'));
    for(const row of res) {
      cb(row);
    }
    return res;
  }

}
