
/**
 * Рендер содержимого вложенного изделия
 *
 * @module contour_nested_content
 *
 * Created by Evgeniy Malyarov on 24.12.2020.
 */

class ContourNestedContent extends Contour {

  constructor(attr) {
    super(attr);

    // добавляем вложенные слои
    const {_ox: ox, project} = this;
    if(ox) {
      ox.constructions.find_rows({parent: this.cnstr}, (row) => {
        Contour.create({project, row, parent: this, ox});
      });
    }

  }

  get _ox() {
    return this.layer._ox;
  }

  get lbounds() {
    return this.layer.lbounds;
  }

  get l_dimensions() {
    return ContourNested._dimlns;
  }

}

EditorInvisible.ContourNestedContent = ContourNestedContent;
