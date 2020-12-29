
/**
 *
 *
 * @module profile_nested_content
 *
 * Created by Evgeniy Malyarov on 24.12.2020.
 */

class ProfileNestedContent extends Profile {

  constructor(attr) {

    const {row, parent} = attr;
    const {layer, project: {bounds}} = parent;
    const {profiles} = layer;

    const h = bounds.height + bounds.y;
    const dir = new paper.Point(row.x2, h - row.y2).subtract(new paper.Point(row.x1, h - row.y1));
    let pelm;
    let delta;
    for(const elm of profiles) {
      const {b, e, _row} = elm;
      const pdir = e.subtract(b);
      if(Math.abs(pdir.angle - dir.angle) < 0.1) {
        row.path_data = _row.path_data;
        const pt = new paper.Point((_row.x1 - row.x1 + _row.x2 - row.x2) / 2, (_row.y1 - row.y1 + _row.y2 - row.y2) / 2);
        if(delta) {
          delta = delta.add(pt).divide(2);
        }
        else {
          delta = pt;
        }
        row.x1 = _row.x1;
        row.x2 = _row.x2;
        row.y1 = _row.y1;
        row.y2 = _row.y2;
        pelm = elm;
        break;
      }
    }

    // if(!pelm) {
    //   row.x1 += delta.x;
    //   row.x2 += delta.x;
    //   row.y1 += delta.y;
    //   row.y2 += delta.y;
    //   row.path_data = '';
    // }

    super(attr);
    this._attr._nearest = pelm;

  }

  postcalc_cnn(node) {
    const cnn_point = this.cnn_point(node);

    cnn_point.cnn = $p.cat.cnns.elm_cnn(this, cnn_point.profile, cnn_point.cnn_types, cnn_point.cnn);

    if(!cnn_point.point) {
      cnn_point.point = this[node];
    }

    return cnn_point;
  }

}

EditorInvisible.ProfileNested = ProfileNested;
