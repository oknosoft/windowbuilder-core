import paper from 'paper/dist/paper-core';
import {ToolElement} from './ToolElement';

export class ToolSelectLayer extends ToolElement {

  constructor() {
    super();
    Object.assign(this, {
      name: 'selectLayer',
      buttons: [],
    });
    this.on({
      activate: this.onActivate,
      deactivate: this.onDeactivate,
      mousedown: this.mousedown,
      keydown: this.keydown,
    });
  }
  
  button(pos) {
    const parent = this.project.dimensions;
    const {generatrix} = pos.profile;
    const button = new paper.Path({
      parent,
      owner: this,
      pos,
      pathData: `M -40,-15 h 25 v -25 h 30 v 25 H 40 V 15 H 15 V 40 H -15 V 15 h -25 z`,
      fillColor: 'green',
      closed: true,
      position: generatrix.interiorPoint.add(generatrix.getNormalAt(generatrix.length / 2).multiply(100)),
      onClick() {
        this.owner.onSelect?.(this);
        this.owner.deactivate();
      },
      onMouseEnter() {
        this.fillColor = 'red';
        this.owner.canvasCursor('cursor-arrow-white-point');
      },
      onMouseLeave() {
        this.fillColor = 'green';
        this.owner.canvasCursor('cursor-text-select');
      }
    });
    this.buttons.push(button);
  }

  onActivate() {
    //'cursor-arrow-white-point'
    //'cursor-text-select'
    //'cursor-disabled'
    super.onActivate('cursor-text-select');
    let bounds, setMode;
    const {contours, props} = this.project;
    for(const layer of contours) {
      if(layer === this.currentLayer) {
        layer.opacity = 0.2;
      }
      else {
        layer.opacity = 0.7;
        // накапливаем bounds
        if(bounds) {
          bounds = layer.bounds.unite(bounds);
        }
        else {
          bounds = layer.bounds;
        }
      }
    }
    for(const layer of contours) {
      if(layer !== this.currentLayer) {
        // рисуем кнопки
        const bySide = layer.profilesBySide();
        for(const pos of ['top', 'bottom', 'left', 'right']) {
          if(layer.isPos(pos, bounds)) {
            this.button({layer, bind: pos, profile: bySide[pos]});
            setMode = true;
          }
        }
      }
    }
    if(setMode) {
      props.carcass = "carcass";
    }
  }

  onDeactivate() {
    this.onCancel?.();
    this.currentLayer = null;
    this.onSelect = null;
    this.onCancel = null;    
    for(const layer of this.project.contours) {
      layer.opacity = 1;
    }
    for(const button of this.buttons) {
      button.remove();
    }
  }

  deactivate() {
    this._scope.tools[0].activate();
  }

  mousedown(ev) {
    if(ev.event?.which > 1) {
      this.deactivate();
    }
  }

  keydown(ev) {
    const {project, mode} = this;
    const {event: {code, key}, modifiers} = ev;
    if (code === 'Escape' || code === 'Delete') {
      this.deactivate();
    }
  }
}
