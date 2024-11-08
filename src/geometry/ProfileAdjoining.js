import paper from 'paper/dist/paper-core';
import {GeneratrixElement} from './GeneratrixElement';

const strokeColor = new paper.Color(0.5, 0.5);

export class ProfileAdjoining extends GeneratrixElement.Profile {

  constructor(...attr) {
    super(...attr);
    const {path, generatrix} = this;
    const callouts = new paper.Group({parent: this, name: 'callouts'});
    generatrix.set({
      strokeColor,
      strokeWidth: 4,
    });
    path.set({
      strokeWidth: 0,
      fillColor: strokeColor,
    });
  }
  get elmType() {
    return this.project.root.enm.elmTypes.adjoining;
  }
  
  get sizeb() {
    return 0;
  }
  
  get width() {
    return 10;
  }

  redraw() {
    super.redraw();
    const {generatrix, callouts: parent} = this.children;
    parent.removeChildren();
    const {length} = generatrix;
    
    for(let pos=0; pos <= length; pos+= 50) {
      const loc = generatrix.getLocationAt(pos);
      const firstSegment = loc.point.add(loc.normal.multiply(10));
      const lastSegment = firstSegment.add(loc.normal.rotate(30).multiply(60)); 
      new paper.PathUnselectable({
        parent,
        strokeColor,
        strokeWidth: 1,
        strokeScaling: false,
        segments: [firstSegment, lastSegment],
      });
    }
  }
  
}

GeneratrixElement.Adjoining = ProfileAdjoining;
