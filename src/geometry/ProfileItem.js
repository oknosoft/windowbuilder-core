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
    if(this.hashActual()) {
      const elmType = this.raw('elmType');
      if(elmType) {
        return elmType;
      }
    }
    const {project: {root}, layer, b, e, edges} = this;
    const {elmTypes} = root.enm;
    let elmType;
    if(b.isT || e.isT || (!layer.layer && Array.from(edges).some(edge => edge.isOuter()))) {
      elmType =  elmTypes.impost;
    }
    elmType = layer.layer?.virtual ? elmTypes.rama : elmTypes[layer.layer ? 'flap' : 'rama'];
    this.raw('elmType', elmType);
    this.hashActual(this.hash);
    return elmType;
  }

  /**
   * @summary Дополняет спецификацию информацией об ошибках
   * @desc Проверяет допустимую длину, изогнутость, применимость концевых соединений
   */
  checkErr() {
    const {b, e, nearest, rawLength, nom, specification} = this;
    let error = b.checkErr({rawLength, specification});
    error = error || e.checkErr({rawLength, specification});
    if(nom.empty()) {
      const row = specification.specRow({elm: this});
      row.nom = this.project.root.cat.nom.predefined('cnn_node_error');
    }
    return {b, e, nearest, rawLength, nom, specification, error};
  }

  /**
   * @summary Вклад профиля в спецификацию слоя
   */
  calculateSpec() {
    // уточняем длину с учётом соединений
    const {clr, layer, inset, angleHor, segms, project} = this;
    if(clr.is('ignored')) {
      return;
    }
    const {b, e, nearest, rawLength, nom, specification, error} = this.checkErr();
    if(error) {
      return;
    }
    const other = {elm: this, layer, nom};
    const props = {...other, rawLength, angleHor, specification};
    if(segms?.length) {
      // если профиль разбит на связки, добавляем их спецификации, вместо спецификации самого профиля
      for(const segment of segms) {
        segment.calculateSpec();
      }
    }
    else {
      // основной материал
      const rowCnnPrev = b.cnn?.mainRow({...other, node: b});
      const rowRnnNext = e.cnn?.mainRow({...other, node: e});
      const specRow = specification.specRow(other);
      specRow.nom = nom;
      specRow.clr = clr;
      specRow.len = rawLength;

      // вклад концевых соединений
      b.cnn.calculateSpec({...props, elm2: b.profile, node: b});
      if(e.isT || e.isI) {
        e.cnn.calculateSpec({...props, elm2: e.profile, node: e});
      }
      
      // вклад вставки
      inset.calculateSpec(props); 
    }
    // примыкающее соединение
    if(nearest) {
      this.cnnII.calculateSpec({...props, elm2: nearest});
    }
    // вклад допвставок
    //
    // спецификация подчинённых элементов
    //
  }
  
}

GeneratrixElement.Profile = Profile;
