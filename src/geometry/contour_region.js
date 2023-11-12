

/**
 * @summary Дополнительный ряд профилей
 * @desc Может располагаться за, перед или внутри основного слоя
 */
class ContourRegion extends Contour {

  constructor(attr) {
    super(attr);
    this.hidden = !attr.show;
    if(attr.region) {
      this.dop = {region: attr.region};
    }
  }

  get ProfileConstructor() {
    return ProfileRegion;
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
    return `Ряд (${cnstr}) №${dop.region} к ${layer.cnstr}`  +
      (bounds ? ` ${bounds.width.toFixed()}х${bounds.height.toFixed()}` : '') +
      (weight ? `, ${weight.toFixed()}кг` : '');
  }

}

EditorInvisible.ContourRegion = ContourRegion;
