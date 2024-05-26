import {Contour} from './Contour';
import {DimensionDrawer, MapedGroup} from './DimensionDrawer';


class GroupText extends MapedGroup {}

export class ContourRoot extends Contour {

  constructor(attr) {
    super(attr);
    new DimensionDrawer({parent: this, name: 'dimensions'});
    new GroupText({parent: this, name: 'text'});
  }
   
  activate() {
    
  }
}
