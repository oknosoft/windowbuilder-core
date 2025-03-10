import paper from 'paper/dist/paper-core';
import {GeneratrixElement} from './GeneratrixElement';
import {afterCreate} from './ProfileAdjoining';

export class ProfilePortal extends GeneratrixElement {

  constructor({loading, ...attr}) {
    super(attr);
    afterCreate.call(this);
    if(!(loading || this.project.props.loading)) {
      this.skeleton.addProfile(this);
    }
  }

  get elmType() {
    return this.project.root.enm.elmTypes.portal;
  }

  get sizeb() {
    return 0;
  }

  get width() {
    return 0;
  }

  tuneRays() {
    
  }

  innerRib(interiorPoint, b, e) {
    const rib = this.generatrix.equidistant(-20);
    // сравним направление
    const v0 = e.subtract(b);
    const v1 = rib.lastSegment.point.subtract(rib.firstSegment.point);
    if(Math.abs(v1.angle - v0.angle) > 40) {
      rib.reverse();
    }
    return rib;
  }

  redraw() {
    return GeneratrixElement.Adjoining.prototype.redraw.call(this);    
  }

}

GeneratrixElement.Portal = ProfilePortal;
