
/**
 * Рендер содержимого вложенного изделия
 *
 * @module contour_nested_content
 *
 * Created by Evgeniy Malyarov on 24.12.2020.
 */

class ContourNestedContent extends Contour {

  get l_dimensions() {
    return ContourNested._dimlns;
  }

}

EditorInvisible.ContourNestedContent = ContourNestedContent;
