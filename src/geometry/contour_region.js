

/**
 * @summary Дополнительный ряд профилей
 * @desc Может располагаться за, перед или внутри основного слоя
 */
class ContourRegion extends Contour {

  constructor(attr) {
    super(attr);
    this.dop = {region: attr.region};
    this.hidden = true;
  }

  get key() {
    return `r${this.cnstr.toFixed()}`;
  }

  glasses(hide, glass_only) {
    return [];
  }

  get glass_contours() {
    return [];
  }

  glass_nodes(path, nodes, bind) {
    return [];
  }

  presentation(bounds) {
    if(!bounds){
      bounds = this.bounds;
    }
    const {cnstr, layer, dop, weight} = this;
    return `Ряд №${dop.region} (${cnstr}) к ${layer.cnstr}`  +
      (bounds ? ` ${bounds.width.toFixed()}х${bounds.height.toFixed()}` : '') +
      (weight ? `, ${weight.toFixed()}кг` : '');
  }

}

EditorInvisible.ContourRegion = ContourRegion;
