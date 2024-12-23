import paper from 'paper/dist/paper-core';
import {ToolElement} from './ToolElement';

const {Point} = paper;

export class ToolGrid extends ToolElement {

  constructor() {
    super();
    Object.assign(this, {
      name: 'grid',
      dp: $p.dp.builderGrid.create({
        split: 'ДелениеГоризонтальных',
        w: 6000,
        h: 3000,
        elm_by_x: 6,
        elm_by_y: 3,
      }),
    });
    this.on({
      activate() {
        let {workLayer} = this.project;
        while (workLayer.layer) {
          workLayer = workLayer.layer;
        }
        workLayer.activate();
        this.onActivate('cursor-lay-impost');
        this.project.redraw();
      },
      
      deactivate() {
      },

      mouseup: this.mouseup,
      
      keydown: this.keydown,
    });
  }

  mouseup(event) {
    const {view} = this._scope;
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
