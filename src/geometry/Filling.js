import paper from 'paper/dist/paper-core';
import {BuilderElement} from './BuilderElement';

export class Filling extends BuilderElement {

  constructor({loading, pathOuter, ...attr}) {
    super(attr);
    this.raw('path', new paper.Path({parent: this, name: 'path'}));
    if(pathOuter) {
      this.path = pathOuter;
    }
  }
  
  get path() {
    return this.children.path;
  }
  set path(outer) {
    const {path} = this;
    path.removeSegments();
    path.addSegments(outer.map(v => v.clone()));
    path.closePath();
    const {bounds} = path;
    path.fillColor = new paper.Color({
      stops: ['#def', '#d0ddff', '#eff'],
      origin: bounds.bottomLeft,
      destination: bounds.topRight,
      alpha: 0.9
    });
  }
  
  redraw() {
    //this.checkActual();
    const {carcass} = this.project.props;
    this.path.opacity = carcass === 'normal' ? 0.9: 0.2;
  }
}
