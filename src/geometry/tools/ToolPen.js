import paper from 'paper/dist/paper-core';
import {ToolElement} from './ToolElement';
import {GeneratrixElement} from '../GeneratrixElement';

export class ToolPen extends ToolElement {

  #raw = {
    name: 'pen',
    mouseStartPos: null,
    mode: null,
    hitItem: null,
    originalContent: null,
    originalHandleIn: null,
    originalHandleOut: null,
    changed: false,
    minDistance: 10,
    input: null,
    point1: new paper.Point(),
    last_profile: null,
    start_binded: false,
  };

  constructor() {
    super();
    this.profile = $p.dp.builderPen.create({
      bind_generatrix: true,
      bind_node: false,
      grid: 50
    });
    this.on({
      activate: () => this.onActivate('cursor-autodesk'),
      // mousedown: this.mousedown,
      // mouseup: this.mouseup,
      // mousedrag: this.mousedrag,
      // mousemove: this.hitTest,
      // keydown: this.keydown,
    });
  }

}
