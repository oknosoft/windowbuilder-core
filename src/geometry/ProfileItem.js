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
    error = error || e.checkErr({rawLength, specification});
    if(nom.empty()) {
      const row = specification.specRow({elm: this});
      row.nom = this.project.root.cat.nom.predefined('cnn_node_error');
    }
    return {b, e, rawLength, nom, specification, error};
  }

  /**
   * @summary Вклад элемента в спецификацию слоя
   */
  calculateSpec() {
    // уточняем длину с учётом соединений
    const {clr, layer, inset, angleHor, segms, project} = this;
    if(clr.is('ignored')) {
      return;
    }
    const {b, e, rawLength, nom, specification, error} = this.checkErr();
    if(error) {
      return;
    }
    if(segms?.length) {
      // если профиль разбит на связки, добавляем их спецификации, вместо спецификации самого профиля
      for(const segment of segms) {
        segment.calculateSpec();
      }
    }
    else {
      // основной материал
      const other = {elm: this, layer, nom};
      const rowCnnPrev = b.cnn?.mainRow({...other, node: b});
      const rowRnnNext = e.cnn?.mainRow({...other, node: e});
      const specRow = specification.specRow(other);
      specRow.nom = nom;
      specRow.clr = clr;
      specRow.len = this.length;

      // вклад концевых соединений
      const props = {elm: this, layer, rawLength, angleHor, nom, specification}
      for(const node of [b, e]) {
        node.cnn.calculateSpec({...props, elm2: node.profile, node});
      }
      // вклад вставки
      inset.calculateSpec(props); 
    }
    // вклад допвставок
    //
    // спецификация подчинённых элементов
    //
  }
  
}

GeneratrixElement.Profile = Profile;
