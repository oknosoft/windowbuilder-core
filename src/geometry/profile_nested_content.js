
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
    for(const elm of profiles) {
      const {b, e, _row} = elm;
      const pdir = e.subtract(b);
      if(Math.abs(pdir.angle - dir.angle) < 0.1) {
        row.path_data = _row.path_data;
        row.x1 = _row.x1;
        row.x2 = _row.x2;
        row.y1 = _row.y1;
        row.y2 = _row.y2;
        pelm = elm;
        break;
      }
    }

    super(attr);
    this._attr._nearest = pelm;

  }
}

EditorInvisible.ProfileNested = ProfileNested;
