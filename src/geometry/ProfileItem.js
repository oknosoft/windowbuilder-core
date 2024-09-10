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
    const {project: {root}, layer, b, e} = this;
    const {elmTypes} = root.enm; 
    if(b.isT || e.isT) {
      return elmTypes.impost;
    }
    return layer.layer?.virtual ? elmTypes.rama : elmTypes[layer.layer ? 'flap' : 'rama'];
  }
  
}
