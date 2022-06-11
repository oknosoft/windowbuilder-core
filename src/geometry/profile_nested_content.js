
/**
 *
 *
 * @module profile_nested_content
 *
 * Created by Evgeniy Malyarov on 24.12.2020.
 */

class ProfileNestedContent extends Profile {

  constructor(attr) {


    const {row, parent, generatrix, proto, _nearest} = attr;
    if(generatrix && proto) {
      super(attr);
      this._attr._nearest = _nearest;
    }
    else {
      const {layer, project: {bounds: pbounds}} = parent;
      const {profiles, bounds: lbounds} = layer;

      const x = lbounds.x + pbounds.x;
      const y = lbounds.y + pbounds.y;

      if(row.path_data) {
        const path = new paper.Path({pathData: row.path_data, insert: false});
        path.translate([x, y]);
        row.path_data = path.pathData;
      }
      else {
        row.x1 += x;
        row.x2 += x;
        row.y1 -= y;
        row.y2 -= y;
      }

      let pelm;
      if(row.elm_type != 'Импост') {
        const h = pbounds.height + pbounds.y;
        const dir = new paper.Point(row.x2, h - row.y2).subtract(new paper.Point(row.x1, h - row.y1));
        for(const elm of profiles) {
          const {b, e, _row} = elm;
          const pdir = e.subtract(b);
          if(Math.abs(pdir.angle - dir.angle) < 0.1) {
            pelm = elm;
            break;
          }
        }
      }

      super(attr);
      this._attr._nearest = pelm;
    }
  }


  move_points(delta, all_points, start_point) {
    if(delta && delta._dimln) {
      return super.move_points(delta, all_points, start_point);
    }
  }

  save_coordinates() {
    super.save_coordinates();
    const {layer: {layer: {lbounds}}, _row, generatrix} = this;

    const path = generatrix.clone({insert: false});
    path.translate([-lbounds.x, -lbounds.y]);
    const {firstSegment: {point: b}, lastSegment: {point: e}} = path;
    _row.x1 = (b.x).round(1);
    _row.y1 = (lbounds.height - b.y).round(1);
    _row.x2 = (e.x).round(1);
    _row.y2 = (lbounds.height - e.y).round(1);
    _row.path_data = path.pathData;
  }

  selected_cnn_ii() {
    const {elm, ox} = this;
    const nelm = this.nearest();
    const {parent} = nelm._row;

    for(const row of ox.cnn_elmnts) {
      if(row.node1 || row.node2) {
        continue;
      }
      if((row.elm1 == elm && row.elm2 == parent) || (row.elm1 == parent && row.elm2 == elm)) {
        if(row.cnn.empty()) {
          const {enm: {cnn_types}, cat: {cnns}} = $p;
          row.cnn = cnns.elm_cnn(this, nelm, cnn_types.acn.ii, null, true);
        }
        return {elm: nelm, row};
      }
    }
  }

}

EditorInvisible.ProfileNestedContent = ProfileNestedContent;
