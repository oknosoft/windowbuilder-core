import paper from 'paper/dist/paper-core';
import {ToolSelectable} from './ToolSelectable';
import {GeneratrixElement} from '../GeneratrixElement';

export class ToolPen extends ToolSelectable {

  constructor() {
    super();
    this.name = 'pen';
    this.profile = $p.dp.builderPen.create({
      bind_generatrix: true,
      bind_node: false,
      grid: 50
    });
    Object.assign(this, {
      mode: 0,
      path: null,
      hit1: null,
      hit2: null,
    })
    this.on({
      activate: () => {
        this.onActivate('cursor-autodesk');
        this.onZoomFit();
        this.get('line').strokeWidth = 3;
      },
      mousedown: this.mousedown,
      // mouseup: this.mouseup,
      // mousedrag: this.mousedrag,
      mousemove: this.mousemove,
      keydown: this.keydown,
    });
  }

  mousemove(ev) {
    this.hitTest(ev);
    const {shift, space, control, alt} = ev.modifiers;
    const {hitItem, node, line} = this.get('hitItem,node,line');
    if(node && line) {
      node.visible = false;
      line.visible = false;
      if (hitItem) {
        let item = hitItem.item.parent;
        if(space && item?.nearest?.()) {
          item = item.nearest();
        }
        if(item instanceof GeneratrixElement) {
          if (hitItem.type == 'fill' || hitItem.type == 'stroke') {
            line.removeSegments();
            line.addSegments(hitItem.item.segments.map(({point, handleIn, handleOut}) => ({point, handleIn, handleOut})));
            line.visible = true;
          }
          node.position = hitItem.point.clone();
          node.visible = true;
        }
      }
    }
    if(this.mode === 1 && this.path) {
      const pt = hitItem?.point || ev.point;
      this.path.lastSegment.point = pt.clone();
    }
  }

  mousedown(ev) {
    const {hitItem, node} = this.get('hitItem,node,line');
    if(!node.visible || ev?.which > 1) {
      return this.reset(ev);
    }
    if(!this.mode) {
      this.hit1 = hitItem;
      const pt = hitItem?.point || ev.point;
      this.path = new paper.Path({
        segments: [pt.clone(), pt.clone()],
        parent: this.parent,
        guide: true,
        strokeColor: 'grey',
        strokeWidth: 3,
        strokeScaling: false,
        strokeCap: 'round',
      });
      this.mode = 1;
    }
  }

  keydown(ev) {
    const {event: {code, target}, modifiers: {space}} = ev;
    if(code === 'Delete') {
      const {hitItem, node, line} = this.get('hitItem,node,line');
      if(line.visible) {
        let item = hitItem.item.parent;
        if(space && item?.nearest?.()) {
          item = item.nearest();
        }
        if(item instanceof GeneratrixElement) {
          try{
            item.remove();
          }
          catch (err) {
            alert(err.message);
          }
          this.project.redraw();
          return this.mousemove(ev);
        }
      }
    }
    else if(code === 'Escape') {
      return this.reset(ev);
    }
    
  }
  
  reset(ev) {
    this.mode = 0;
    this.path?.remove?.();
    this.path = null;
    this.hit1 = null;
    this.hit2 = null;
    ev?.stop?.();
  }

}
