import paper from 'paper/dist/paper-core';
import {GeneratrixElement} from './GeneratrixElement';

export class ProfilePortal extends GeneratrixElement {

  constructor({loading, ...attr}) {
    super(attr);
    this.path.visible = false;
    this.generatrix.set({
      strokeColor: new paper.Color(0.5, 0.5),
      shadowColor: new paper.Color(0, 0, 0),
      shadowBlur: 20,
    });
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
    this.checkActual();
    //this.project.props.loading
    const {project, generatrix} = this;
    if(project.props.carcass !== 'normal') {
      if(generatrix.shadowOffset.length) {
        generatrix.shadowOffset = [0, 0];
      }
    }
    else {
      generatrix.shadowOffset = generatrix.getNormalAt(0).normalize(10);
    }
  }

}
