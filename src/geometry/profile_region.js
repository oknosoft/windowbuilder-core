
/*
 * Профиль ряда
 *
 * Created 11.1.2023.
 */

class ProfileRegion extends Profile {

  /**
   * Возвращает тип элемента (ряд)
   */
  get elm_type() {
    return $p.enm.elm_types.region;
  }
  
  get rnum() {
    return this.layer.region;
  }

  /** @override */
  get d0() {
    const {_attr} = this;
    if(!_attr.hasOwnProperty('d0')) {
      _attr.d0 = this.offset;
      const nearest = this.nearest();
      if(nearest) {
        _attr.d0 = this.offset - nearest.d0 - (_attr._nearest_cnn ? _attr._nearest_cnn.size(this, nearest) : 0);
      }
    }
    return _attr.d0;
  }

  selected_cnn_ii() {
    const {elm, ox, _attr} = this;
    const parent = this.nearest();
    if(parent) {
      const find = {elm1: parent.elm, elm2: elm, node1: '', node2: ''};
      const row = ox.cnn_elmnts.find(find) || ox.cnn_elmnts.add(find);
      if(!_attr._nearest_cnn || _attr._nearest_cnn.empty()) {
        if(row.cnn.empty()) {
          const {enm: {cnn_types}, cat: {cnns}} = $p;
          _attr._nearest_cnn = cnns.elm_cnn(parent, this, cnn_types.acn.ii, null, true);
        }
        else {
          _attr._nearest_cnn = row.cnn;
        }
      }
      if(row.cnn.empty() && _attr._nearest_cnn) {
        row.cnn = _attr._nearest_cnn;
      }
      return {elm: parent, row};
    }
  }
  
}

EditorInvisible.ProfileRegion = ProfileRegion;
