import paper from 'paper/dist/paper-core';
import {BuilderElement} from './BuilderElement';

export class ContainerBlank extends BuilderElement {

  constructor({loading, pathOuter, ...attr}) {
    super(attr);
    const {props} = this.project;
    this.raw('path', new paper.Path({parent: this, name: 'path', opacity: 0.7}));
    new paper.TextUnselectable({
      parent: this,
      name: 'text',
      content: 'Пустота',
      fontSize: props.fontSize(),
      fontFamily: props.fontFamily(),
    });
    if(pathOuter) {
      this.path = pathOuter;
    }
  }
  
  get container() {
    if(this.isInserted()) {
      for(const container of this.layer.containers) {
        if(container.child === this) {
          return container;
        }
      }
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
      stops: ['#e6e6e6', '#ffffff', '#e8eee8'],
      origin: bounds.topLeft,
      destination: bounds.rightCenter,
      alpha: 0.6
    });
  }

  redraw() {
    //this.checkActual();
    const {children: {text}, path: {bounds}} = this;
    text.point = bounds.bottomLeft.add([text.fontSize, -text.fontSize]);
  }
  
}
