import paper from 'paper/dist/paper-core';
import {GeneratrixElement} from './GeneratrixElement';

const strokeColor = new paper.Color(0.5, 0.5);
const shadowColor = new paper.Color(0, 0, 0, 0.5);
export function afterCreate() {
  const {path, generatrix} = this;
  const callouts = new paper.Group({parent: this, name: 'callouts'});
  generatrix.set({
    strokeColor,
    strokeWidth: 2,
    shadowColor,
    shadowBlur: 20,
  });
  path.set({
    strokeWidth: 0,
    fillColor: strokeColor,
  });
}

export class ProfileAdjoining extends GeneratrixElement.Profile {

  constructor(...attr) {
    super(...attr);
    afterCreate.call(this);
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
    const {children: {generatrix, callouts: parent}, project: {props}} = this;
    parent.removeChildren();

    ProfileAdjoining.drawHatching({parent, generatrix});
    if(props.carcass !== 'normal') {
      if(generatrix.shadowOffset.length) {
        generatrix.shadowOffset = [0, 0];
      }
    }
    else {
      generatrix.shadowOffset = generatrix.getNormalAt(0).normalize(10);
    }
  }
  
  static drawHatching({parent, generatrix}) {
    const {length} = generatrix;
    const res = [];
    for(let pos=0; pos <= length; pos+= 50) {
      const loc = generatrix.getLocationAt(pos);
      const firstSegment = loc.point.add(loc.normal.multiply(10));
      const lastSegment = firstSegment.add(loc.normal.rotate(30).multiply(40));
      res.push(new paper.PathUnselectable({
        parent,
        strokeColor,
        strokeWidth: 1,
        strokeScaling: false,
        segments: [firstSegment, lastSegment],
        guide: true,
      }));
    }
    return res;
  }
  
}

GeneratrixElement.Adjoining = ProfileAdjoining;
