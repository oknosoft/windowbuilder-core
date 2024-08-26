import paper from 'paper/dist/paper-core';
import {ToolElement} from './ToolElement';

export class ToolSelectLayer extends ToolElement {

  constructor() {
    super();
    Object.assign(this, {
      name: 'selectLayer',
    });
    this.on({
      activate: this.onActivate,
      deactivate: this.onDeactivate,
      mousedown: this.mousedown,
      mousemove: this.hitTest,
    });
  }

  onActivate() {
    //'cursor-arrow-white-point'
    //'cursor-text-select'
    //'cursor-disabled'
    super.onActivate('cursor-text-select');
    for(const layer of this.project.contours) {
      if(layer !== this.currentLayer) {
        layer.opacity = 0.5;
      }
    }
  }

  onDeactivate() {
    this.currentLayer = null;
    for(const layer of this.project.contours) {
      layer.opacity = 1;
    }
    this._scope.tools[0].activate();
  }

  mousedown(ev) {
    
  }

  hitTest(ev) {
    
  }
}
