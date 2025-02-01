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
   * @summary Дополняет спецификацию информацией об ошибках
   * @desc Проверяет допустимую длину, изогнутость, применимость концевых соединений
   */
  checkErr() {
    const {b, e, rawLength, nom, specification} = this;
    let error = b.checkErr({rawLength, specification});
    error = e.checkErr({rawLength, specification}) || error;
    if(nom.empty()) {
      const row = specification.specRow({elm: this});
      row.nom = owner.project.root.cch.predefinedElmnts.predefined.cnn_node_error?.value;
    }
    return {b, e, rawLength, nom, specification, error};
  }

  /**
   * @summary Вклад элемента в спецификацию слоя
   */
  calculateSpec() {
    // уточняем длину с учётом соединений
    const {clr, layer, inset} = this;
    if(clr.is('ignored')) {
      return;
    }
    const {b, e, rawLength, nom, specification, error} = this.checkErr();
    if(error) {
      return;
    }
    // вклад концевых соединений
    for(const node of [b, e]) {
      node.cnn.calculateSpec({elm: this, elm2: node.profile, node: node.name, layer, rawLength, nom, specification});
    }
    // вклад вставки
    inset.calculateSpec({elm: this, layer, rawLength, nom, specification});
    // вклад допвставок
    //
    // спецификация подчинённых элементов
    //
  }
  
}

GeneratrixElement.Profile = Profile;
