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

}
