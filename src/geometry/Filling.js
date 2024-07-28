import paper from 'paper/dist/paper-core';
import {ContainerBlank} from './ContainerBlank';

export class Filling extends ContainerBlank {
    
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
    });
  }
  
  redraw() {
    super.redraw();
    const {children: {text}, project: {props}} = this;
    this.path.opacity = props.carcass === 'normal' ? 0.9: 0.4;
    text.content = 'Заполнение';
  }

  remove() {
    const {container} = this;
    super.remove();
    if(container) {
      container.createChild({kind: 'blank'});
    }
  }
}
