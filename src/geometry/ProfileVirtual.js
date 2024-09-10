import paper from 'paper/dist/paper-core';
import {GeneratrixElement} from './GeneratrixElement';

export class ProfileVirtual extends GeneratrixElement {

  constructor({loading, ...attr}) {
    super(attr);
    if(!(loading || this.project.props.loading)) {
      this.skeleton.addProfile(this);
    }
  }

  get elmType() {
    return this.nearest.elmType;
  }

  get inset() {
    return this.nearest.inset;
  }

  get nom() {
    return this.nearest.nom;
  }

  /**
   * @summary Расстояние от узла до опорной линии
   * @desc Для сегментов створок и вложенных элементов зависит от ширины элементов и свойств примыкающих соединений,
   * для соединителей и раскладок = 0
   * @type Number
   * @final
   */
  get d0() {
    const {szc, width, sizeb, offset} = this;
    return offset - width + szc + sizeb;
  }

}
