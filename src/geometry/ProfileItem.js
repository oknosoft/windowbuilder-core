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
    if(b.isT || e.isT) {
      return root.enm.elmTypes.impost;
    }
    return root.enm.elmTypes[layer.layer ? 'flap' : 'rama']; 
  }
  
}
