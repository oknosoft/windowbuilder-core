
import {GeneratrixElement} from './GeneratrixElement';

export class Profile extends GeneratrixElement {
  
  constructor(attr) {
    super(attr);
    if(!this.project.props.loading) {
      this.skeleton.addProfile(this);
      this.layer.recalcFillings();
    }
  }
}
