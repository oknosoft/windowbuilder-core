

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
    const {cnstr, layer, region, weight} = this;
    return `Ряд (${cnstr}) №${region} к ${layer.cnstr}`  +
      (bounds ? ` ${bounds.width.toFixed()}х${bounds.height.toFixed()}` : '') +
      (weight ? `, ${weight.toFixed()}кг` : '');
  }
  
  get region() {
    return this.dop.region || 0;
  }

  /**
   * Уровень вложенности слоя
   * @type {number}
   * @final
   */
  get level() {
    return this.layer.level;
  }

  /**
   * Надо ли строить авторазмерные линии
   * @return {Boolean}
   */
  get show_dimensions() {
    const {visible, hidden} = this.layer;
    return !visible || hidden;
  }

  /**
   * Признак сокрытия слоя
   * @return {boolean}
   */
  get hidden() {
    return super.hidden;
  }
  set hidden(v) {
    super.hidden = v;
    this.redraw();
  }

}

EditorInvisible.ContourRegion = ContourRegion;
