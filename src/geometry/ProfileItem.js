import paper from 'paper/dist/paper-core';
import {GeneratrixElement} from './GeneratrixElement';

export class Profile extends GeneratrixElement {
  
  constructor({loading, ...attr}) {
    super(attr);
    if(!(loading || this.project.props.loading)) {
      this.skeleton.addProfile(this);
    }
  }

  get elmType() {
    const {project: {root}, layer, b, e, edges} = this;
    const {elmTypes} = root.enm;
    if(b.isT || e.isT || (!layer.layer && Array.from(edges).some(edge => edge.isOuter()))) {
      return elmTypes.impost;
    }
    return layer.layer?.virtual ? elmTypes.rama : elmTypes[layer.layer ? 'flap' : 'rama'];
  }

  /**
   * @summary Вклад элемента в спецификацию слоя
   */
  calculateSpec() {
    // уточняем длину с учётом соединений
    // вклад концевых соединений
    // вклад вставки
    // вклад допвставок
    // спецификация подчинённых элементов
  }
  
}

GeneratrixElement.Profile = Profile;
