
/**
 * @typedef FrameRole {'aperture'|'child'|'parent'|'plane'|'none'}
 */

/**
 * @summary 3D фрейм текущего изделия
 * @desc может быть плоскостью с положением и ориентацией, проёмом или каркасом вложенного изделия
 */
class ProductFrame {
  constructor(owner) {
    this._ = {owner};
  }
  
  get raw() {
    return this._.owner.extra.frame || {};
  }
  
  set(props) {
    const frame = Object.assign(this.raw, props);
    this._.owner.extra = {frame};
  }

  /**
   * @summary Роль текущего фрейма
   * @type {FrameRole}
   */
  get role() {
    return this.raw.role || 'none';
  }
  set role(role) {
    this.set({role})
  }

  /**
   * @summary Соседние фреймы
   * @desc родительские изделия, проёмы и плоскости
   * @type {Array}
   */
  get others() {
    return this.raw.others || [];
  }

  /**
   * @summary 3D позиция плоскости
   * @type {number[]}
   */
  get position() {
    return this.raw.position || [0, 0, 0];
  }

  /**
   * @summary 3D поворот плоскости
   * @type {number[]}
   */
  get rotation() {
    return this.raw.rotation || [0, 0, 0];
  }

  /**
   * @summary Форма исходного проёма
   * @type {paper.Path}
   */
  get pathOuter() {
    if(!this._.pathOuter) {
      this._.pathOuter = new paper.Path({insert: false, pathData: this.raw.pathData});
    }
    return this._.pathOuter;
  }

  /**
   * @summary Форма проёма, на которую будет опираться изделие
   * @type {paper.Path}
   */
  get pathInner() {
    if(!this._.pathInner) {
      this._.pathInner = new paper.Path({insert: false, pathData: this.raw.pathData});
    }
    return this._.pathInner;
  }
}

CatCharacteristics.ProductFrame = ProductFrame;
