import paper from 'paper/dist/paper-core';
import {ToolElement} from './ToolElement';

const {Point} = paper;

export class ToolPan extends ToolElement {

  constructor() {
    super();
    Object.assign(this, {
      name: 'pan',
      distanceThreshold: 10,
      minDistance: 10,
      mouseStartPos: new Point(),
      mode: 'pan',
      zoomFactor: 1.1,
    });
    this.on({
      activate: () => this.onActivate('cursor-hand'),
      
      deactivate() {
      },

      mousedown: this.mousedown,

      mouseup: this.mouseup,

      mousedrag: this.mousedrag,

      mousemove: this.hitTest,

      keydown: this.keydown,

      keyup: this.hitTest,
    });
  }

  testHot(type, event, mode) {
    var spacePressed = event && event.modifiers.space;
    if (mode != 'tool-zoompan' && !spacePressed)
      return false;
    return this.hitTest(event);
  }

  hitTest(event) {

    if (event.modifiers.control) {
      this.canvasCursor('cursor-zoom-in');
    } else if (event.modifiers.option) {
      this.canvasCursor('cursor-zoom-out');
    } else {
      this.canvasCursor('cursor-hand');
    }

    return true;
  }

  mousedown(event) {
    if (event.modifiers.shift) {
      this.mouseStartPos = event.point;
    }
    else{
      this.mouseStartPos = event.point.subtract(this._scope.view.center);
    }
    this.mode = '';
    if (event.modifiers.control || event.modifiers.option) {
      this.mode = 'zoom';
    }
    else {
      this.canvasCursor('cursor-hand-grab');
      this.mode = 'pan';
    }
  }

  mouseup(event) {
    const {view} = this._scope;
    if(this.mode == 'zoom') {
      const zoomCenter = event.point.subtract(view.center);
      const moveFactor = this.zoomFactor - 1.0;
      if(event.modifiers.control) {
        view.zoom *= this.zoomFactor;
        view.center = view.center.add(zoomCenter.multiply(moveFactor / this.zoomFactor));
      }
      else if(event.modifiers.option) {
        view.zoom /= this.zoomFactor;
        view.center = view.center.subtract(zoomCenter.multiply(moveFactor));
      }
    }
    else if(this.mode == 'zoom-rect') {
      const start = view.center.add(this.mouseStartPos);
      const end = event.point;
      view.center = start.add(end).multiply(0.5);
      const dx = view.bounds.width / Math.abs(end.x - start.x);
      const dy = view.bounds.height / Math.abs(end.y - start.y);
      view.zoom = Math.min(dx, dy) * view.zoom;
    }
    this.hitTest(event);
    this.mode = '';
  }

  mousedrag(event) {
    const {view} = this._scope;
    if (this.mode == 'zoom') {
      // If dragging mouse while in zoom mode, switch to zoom-rect instead.
      //this.mode = 'zoom-rect';
    }
    else if (this.mode == 'zoom-rect') {
      // While dragging the zoom rectangle, paint the selected area.
      //this._scope.drag_rect(view.center.add(this.mouseStartPos), event.point);
    }
    else if (this.mode == 'pan') {
      if (event.modifiers.shift) {
        const {project: {contours, activeLayer}} = this;
        const rootLayer = activeLayer && !activeLayer.layer ? activeLayer : contours[0];
        const delta = this.mouseStartPos.subtract(event.point);
        this.mouseStartPos = event.point;
        rootLayer.move(delta.negate());
      }
      else{
        // Handle panning by moving the view center.
        const pt = event.point.subtract(view.center);
        const delta = this.mouseStartPos.subtract(pt);
        this.mouseStartPos = pt;
        view.scrollBy(delta);
      }
    }
  }

  keydown(event) {
    const {project: {contours, activeLayer}} = this;
    const rootLayer = activeLayer && !activeLayer.layer ? activeLayer : contours[0];
    switch (event.key) {
      case 'left':
        rootLayer.move(new Point(-10, 0));
        break;
      case 'right':
        rootLayer.move(new Point(10, 0));
        break;
      case 'up':
        rootLayer.move(new Point(0, -10));
        break;
      case 'down':
        rootLayer.move(new Point(0, 10));
        break;
    }
  }
}
